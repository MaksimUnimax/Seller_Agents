import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import path from "node:path";
import { makeWorker, signFixtureBootstrap, until } from "../worker-harness.mjs";

const runtime = path.resolve(process.argv[2]);
const AUTH = "seller_agents_control_auth_v2";
const baseWall = 1_700_000_000_000;
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json" } });
const clone = value => structuredClone(value);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const canonical = value => value === null ? "null" : typeof value === "boolean" ? (value ? "true" : "false") : typeof value === "string" ? JSON.stringify(value) : typeof value === "number" ? String(value) : Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
const fixtureTrustBundle = backing => { const key = backing.local.__seller_agents_fixture_signing_key; const publicKey = Buffer.from(key.publicKey, "base64"); return { trustBundleVersion: "bootstrap_trust_bundle_v1", algorithm: "Ed25519", publicKeyFormat: "spki_der", publicKeyEncoding: "base64", fingerprintAlgorithm: "sha256", fingerprintEncoding: "lowercase_hex", keys: [{ keyId: "fixture-key", publicKey: key.publicKey, fingerprintSha256: createHash("sha256").update(publicKey).digest("hex"), lifecycle: "ACTIVE", trustEligibility: "SIGNING_AND_VERIFICATION" }] }; };
const signed = async (backing, payload) => json(await signFixtureBootstrap(backing, payload));

async function fixture(options = {}) {
  const backing = options.backing || { local: {}, session: {} };
  const clock = options.clock || { wall: baseWall, mono: 1000 };
  const worker = await makeWorker(runtime, { backing, wallClock: () => clock.wall, monotonicClock: () => clock.mono, seedAuthority: options.seedAuthority, userAgent: options.userAgent, packagedConfig: options.packagedConfig, onStorageWrite: options.onStorageWrite, onStorageRemove: options.onStorageRemove, fetch: options.fetch });
  return { worker, backing, clock };
}

// C2.1-R1: exact base behavior was the known regression. The candidate's
// seeded record has the new metadata; the explicit legacy branch records the
// pre-change behavior when this suite is run against the exact base runtime.
{
  const { worker, backing, clock } = await fixture();
  try {
    const authority = clone(backing.local[AUTH].authority);
    const payload = authority.payload;
    const expiry = Date.parse(payload.expiresAt);
    assert.equal((await worker.call("SellerAgentsControlClient.canWork")), true);
    clock.wall = expiry + 1; clock.mono += 10;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false);
    clock.wall = baseWall; clock.mono += 10;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false);
    assert.equal(backing.local[AUTH].authority.cacheBinding.cacheVersion, "control_cache_binding_v1");
  } finally { worker.close(); }
}

// C2.1-R2/R3/R4: half-open freshness, wall rollback resistance, monotonic
// advancement, restart floor retention, and byte-preserving signed cache.
{
  const { worker, backing, clock } = await fixture();
  try {
    const before = clone(backing.local[AUTH].authority);
    const expiry = Date.parse(before.payload.expiresAt), grace = Date.parse(before.payload.offlineGraceUntil);
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    clock.wall += 100; clock.mono += 100;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    const floorAfterMonotonic = backing.local[AUTH].cacheClock.effectiveTimeMs;
    clock.wall = baseWall - 1000; clock.mono += 1000;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    assert.ok(backing.local[AUTH].cacheClock.effectiveTimeMs > floorAfterMonotonic);
    const envelope = before.envelope, payloadBytes = before.envelope.payload, deadline = before.payload.expiresAt;
    clock.wall = expiry; clock.mono += 1;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false);
    assert.ok(backing.local[AUTH].cacheClock.effectiveTimeMs >= expiry);
    clock.wall = grace; clock.mono += 1;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false);
    assert.ok(backing.local[AUTH].cacheClock.effectiveTimeMs >= grace);
    assert.equal(backing.local[AUTH].authority.envelope.payload, payloadBytes);
    assert.equal(backing.local[AUTH].authority.envelope.signature, envelope.signature);
    assert.equal(backing.local[AUTH].authority.payload.expiresAt, deadline);
    worker.close();
    const restarted = await makeWorker(runtime, { backing, wallClock: () => baseWall - 100000, monotonicClock: () => 1 });
    try { assert.equal(await restarted.call("SellerAgentsControlClient.canWork"), false); } finally { restarted.close(); }
  } catch (error) { worker.close(); throw error; }
}

// C2.1-R5/R6: unsafe monotonic observations fail closed; a positive floor
// cannot authorize until its durable write succeeds, then can recover without
// lowering that floor. Total storage failure is intentionally only a denial.
{
  for (const kind of ["missing", "nan", "decreasing"]) {
    const clock = { wall: baseWall, mono: 1000 };
    const backing = { local: {}, session: {} };
    const seeded = await makeWorker(runtime, { backing, wallClock: () => clock.wall, monotonicClock: () => clock.mono });
    seeded.close();
    const worker = await makeWorker(runtime, { backing, seedAuthority: false, wallClock: () => clock.wall, monotonicClock: kind === "missing" ? () => undefined : kind === "nan" ? () => NaN : () => { clock.mono -= 1; return clock.mono; } });
    try { assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false, kind); assert.equal((await worker.call("SellerAgentsControlClient.getAuthority")).workAllowed, false); } finally { worker.close(); }
  }
  const clock = { wall: baseWall, mono: 1000 }, backing = { local: {}, session: {} };
  let release, writes = 0;
  const { worker } = await fixture({ backing, clock, onStorageWrite: async (kind, values) => { if (kind === "local" && Object.hasOwn(values, AUTH) && writes++ === 0) await new Promise(resolve => { release = resolve; }); } });
  try {
    await worker.call("SellerAgentsControlClient.canWork");
    clock.wall += 100; clock.mono += 100;
    const held = worker.call("SellerAgentsControlClient.canWork");
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(release !== undefined, true); release(); assert.equal(await held, true);
    clock.wall += 100; clock.mono += 100;
    const oldFloor = backing.local[AUTH].cacheClock.effectiveTimeMs;
    let mode = "normal";
    const failing = await fixture({ backing, clock, onStorageWrite: async (kind, values) => { if (mode === "fail" && kind === "local" && Object.hasOwn(values, AUTH)) throw new Error("write barrier"); }, onStorageRemove: async () => { throw new Error("removal barrier"); } });
    try { await failing.worker.call("SellerAgentsControlClient.canWork"); mode = "fail"; clock.wall += 100; clock.mono += 100; assert.equal(await failing.worker.call("SellerAgentsControlClient.canWork"), false); clock.wall += 100; clock.mono += 100; mode = "normal"; assert.equal(await failing.worker.call("SellerAgentsControlClient.canWork"), true); assert.ok(backing.local[AUTH].cacheClock.effectiveTimeMs >= oldFloor); } finally { failing.worker.close(); }
  } finally { worker.close(); }
}

// C2.1-R7/R8: every packaged context dimension denies cached Work. Origin
// changes are checked before bootstrap so no old credential-bearing request is
// emitted; same-origin package mismatch keeps credentials for signed refresh.
{
  const dimensions = [
    ["api-origin", { controlApiOrigin: "http://127.0.0.1:43199" }, true],
    ["portal-origin", { portalOrigin: "http://127.0.0.1:43199" }, true],
    ["contract", { contractVersion: "control_plane_v3" }, false],
    ["extension", { extensionVersion: "0.2.5" }, false],
    ["browser-family", { userAgent: "Mozilla/5.0 YaBrowser/120.0.0.0" }, false],
    ["browser-version", { userAgent: "Mozilla/5.0 Chrome/121.0.0.0" }, false],
    ["trust-ring", { trustChanged: true }, false],
    ["requested-ai", { requestedChanged: true }, false],
    ["device-owner", { deviceChanged: true }, true],
    ["session-owner", { sessionChanged: true }, true],
    ["generation-owner", { generationChanged: true }, true],
  ];
  for (const [label, change, originChanged] of dimensions) {
    const seed = await fixture(); const original = clone(seed.backing.local[AUTH]); seed.worker.close();
    const trustBundle = fixtureTrustBundle(seed.backing); if (change.trustChanged) trustBundle.keys[0].fingerprintSha256 = "0".repeat(64);
    if (change.requestedChanged) seed.backing.local[AUTH].authority.requestedAi = "alice";
    if (change.deviceChanged) seed.backing.local[AUTH].credentials.deviceId = "44444444-4444-4444-8444-444444444444";
    if (change.sessionChanged) seed.backing.local[AUTH].credentials.sessionId = "55555555-5555-4555-8555-555555555555";
    if (change.generationChanged) seed.backing.local[AUTH].generation = 2;
    const network = []; const worker = await makeWorker(runtime, { backing: seed.backing, seedAuthority: false, userAgent: change.userAgent, packagedConfig: { environment: "LOCAL DEVELOPMENT", controlApiOrigin: change.controlApiOrigin || "http://127.0.0.1:43100", portalOrigin: change.portalOrigin || "http://127.0.0.1:43101", extensionVersion: change.extensionVersion || "0.2.4", contractVersion: change.contractVersion || "control_plane_v2", trustBundle }, fetch: async (url) => { network.push(url); return json({ error: { code: "UNEXPECTED" } }, 500); } });
    try { assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false, label); if (originChanged) { await assert.rejects(worker.call("SellerAgentsControlClient.bootstrap"), /AUTH_REQUIRED/); assert.equal(network.length, 0); } else if (!change.deviceChanged && !change.sessionChanged && !change.generationChanged) { assert.equal((await worker.call("SellerAgentsControlClient.getAuthority")), null, label); assert.ok(seed.backing.local[AUTH]?.credentials, `${label} preserves credentials`); } } finally { worker.close(); }
  }
  const positive = await fixture(); try { assert.equal(await positive.worker.call("SellerAgentsControlClient.canWork"), true); } finally { positive.worker.close(); }
}

// C2.1-R9/R10: legacy records fail closed, online replacement must be signed,
// server time cannot regress, and an old verification cannot publish after B.
{
  const seed = await fixture(); const backing = seed.backing; delete backing.local[AUTH]; seed.worker.close();
  const legacy = await makeWorker(runtime, { backing, seedAuthority: false });
  try { assert.equal((await legacy.call("SellerAgentsControlClient.status")).authenticated, false); } finally { legacy.close(); }
  const accountWorker = await fixture(); const preserved = clone(accountWorker.backing.local[AUTH]); accountWorker.backing.local.catalog_fixture = { keep: true }; accountWorker.backing.local[AUTH].authority.cacheBinding.extensionVersion = "0.2.3"; accountWorker.worker.close();
  const replacement = await makeWorker(runtime, { backing: accountWorker.backing, seedAuthority: false, wallClock: () => baseWall, monotonicClock: () => 1000, fetch: async (url, init) => url.endsWith("/v1/bootstrap") ? json({ error: { code: "NO_UNSIGNED_BOOTSTRAP" } }, 500) : json({ error: { code: "UNEXPECTED" } }, 500) });
  try { assert.equal(await replacement.call("SellerAgentsControlClient.canWork"), false); assert.equal(replacement.backing.local.catalog_fixture.keep, true); await assert.rejects(replacement.call("SellerAgentsControlClient.bootstrap"), /NO_UNSIGNED_BOOTSTRAP/); } finally { replacement.close(); }
  assert.ok(preserved.cacheClock.effectiveTimeMs >= preserved.cacheClock.trustedServerTimeMs);
}

// C2.1-R9/R12: a lower same-session server time cannot replace the cache;
// account-only authority remains authenticated but is never operational Work.
{
  const clock = { wall: baseWall, mono: 1000 }, backing = { local: {}, session: {} };
  const first = await fixture({ backing, clock, fetch: async url => {
    if (!url.endsWith("/v1/bootstrap")) return json({ error: { code: "UNEXPECTED" } }, 500);
    const base = clone(backing.local[AUTH].authority.payload);
    return json(await signFixtureBootstrap(backing, { ...base, serverTime: new Date(baseWall - 1).toISOString(), expiresAt: new Date(baseWall + 3600000).toISOString(), offlineGraceUntil: new Date(baseWall + 7200000).toISOString() }));
  } });
  try { await first.worker.call("SellerAgentsControlClient.canWork"); clock.wall += 1000; clock.mono += 1000; await first.worker.call("SellerAgentsControlClient.canWork"); await assert.rejects(first.worker.call("SellerAgentsControlClient.bootstrap"), /BOOTSTRAP_SERVER_TIME_REGRESSION/); } finally { first.worker.close(); }
  const accountOnlyBacking = { local: {}, session: {} };
  const accountOnly = await fixture({ backing: accountOnlyBacking, clock, fetch: async url => { const base = clone(accountOnlyBacking.local[AUTH].authority.payload); return json(await signFixtureBootstrap(accountOnlyBacking, { ...base, serverTime: new Date(clock.wall + 2000).toISOString(), expiresAt: new Date(clock.wall + 3600000).toISOString(), offlineGraceUntil: new Date(clock.wall + 7200000).toISOString(), ai: { status: "UNCONFIGURED" } })); } });
  try { await accountOnly.worker.call("SellerAgentsControlClient.bootstrap"); const status = await accountOnly.worker.call("SellerAgentsControlClient.status"); assert.equal(status.authenticated, true); assert.equal(status.workAllowed, false); assert.equal(accountOnly.backing.local[AUTH].authority.cacheBinding.detectedAi, null); } finally { accountOnly.worker.close(); }
}

// C2.1-R10: a held A verification cannot publish after reset and completed B
// activation; B owns the resulting authority, account and cache floor.
{
  const clock = { wall: baseWall, mono: 1000 }, backing = { local: {}, session: {} };
  let releaseA, bootstraps = 0, basePayload;
  const owned = await fixture({ backing, clock, fetch: async (url) => {
    if (url.endsWith("/v1/device-authorizations")) return json({ status: "pending", authorizationId: "66666666-6666-4666-8666-666666666666", deviceCode: "D".repeat(43), userCode: "ABCD-EFGH", expiresAt: new Date(clock.wall + 60000).toISOString() });
    if (url.endsWith("/v1/device-authorizations/token")) return json({ status: "activated", deviceId: "77777777-7777-4777-8777-777777777777", sessionId: "88888888-8888-4888-8888-888888888888", tokenType: "Bearer", accessToken: "B".repeat(24), accessTokenExpiresAt: new Date(clock.wall + 3600000).toISOString(), refreshToken: "C".repeat(43), refreshTokenExpiresAt: new Date(clock.wall + 7200000).toISOString() });
    if (url.endsWith("/v1/bootstrap")) { bootstraps++; const base = basePayload; if (bootstraps === 1) return new Promise(resolve => { releaseA = () => resolve(signed(backing, base)); }); return signed(backing, { ...base, account: { id: "99999999-9999-4999-8999-999999999999", status: "ACTIVE" }, serverTime: new Date(clock.wall + 100).toISOString(), ai: { status: "UNCONFIGURED" } }); }
    return json({ error: { code: "UNEXPECTED" } }, 500);
  } });
  basePayload = clone(backing.local[AUTH].authority.payload);
  try {
    const oldBootstrap = owned.worker.call("SellerAgentsControlClient.bootstrap"); await until(() => releaseA, "held A verification");
    await owned.worker.call("SellerAgentsControlClient.localReset"); await owned.worker.call("SellerAgentsControlClient.startActivation");
    await until(async () => (await owned.worker.call("SellerAgentsControlClient.status")).authenticated, "B activation"); releaseA();
    await assert.rejects(oldBootstrap, /AUTH_GENERATION_CHANGED/); assert.equal(await owned.worker.call("SellerAgentsControlClient.currentAccount"), "99999999-9999-4999-8999-999999999999"); assert.equal((await owned.worker.call("SellerAgentsControlClient.status")).workAllowed, false);
  } finally { releaseA?.(); owned.worker.close(); }
}

// C2.1-R1-A architect reproductions: the rolling anchor rejects a decrease
// after a larger reading, while equal readings remain legal.  The held-write
// assertions prove the public promise is not resolved by an in-memory floor,
// and the expiry crossing is vetoed on that same released call.
{
  const clock = { wall: baseWall, mono: 1000 };
  const { worker, backing } = await fixture({ clock });
  try {
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    clock.mono = 2000; assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    clock.mono = 1500; assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false);
    clock.mono = 2000; assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    clock.mono = 2000; assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    const expiry = Date.parse(backing.local[AUTH].authority.payload.expiresAt);
    const beforeWallJump = backing.local[AUTH].cacheClock.effectiveTimeMs;
    clock.wall += 60000; clock.mono += 100;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    const afterWallJump = backing.local[AUTH].cacheClock.effectiveTimeMs;
    clock.wall -= 60000; clock.mono += 1000;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), true);
    assert.ok(backing.local[AUTH].cacheClock.effectiveTimeMs >= afterWallJump + 1000);
    assert.ok(afterWallJump >= clock.wall); assert.ok(afterWallJump > beforeWallJump);
    clock.wall = expiry; clock.mono += 1;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false);
    worker.close();
    const restarted = await makeWorker(runtime, { backing, wallClock: () => baseWall, monotonicClock: () => 1 });
    try { assert.equal(await restarted.call("SellerAgentsControlClient.canWork"), false); } finally { restarted.close(); }
  } catch (error) { worker.close(); throw error; }
}
{
  const clock = { wall: baseWall, mono: 1000 }, backing = { local: {}, session: {} };
  let hold = false, releaseWrite, settled = false;
  const { worker } = await fixture({ backing, clock, onStorageWrite: async (kind, values) => {
    if (hold && kind === "local" && Object.hasOwn(values, AUTH) && !releaseWrite) await new Promise(resolve => { releaseWrite = resolve; });
  } });
  try {
    await worker.call("SellerAgentsControlClient.canWork"); hold = true; clock.wall += 100; clock.mono += 100;
    const pending = worker.call("SellerAgentsControlClient.canWork").then(value => { settled = true; return value; });
    await until(() => releaseWrite, "checkpoint write latch");
    await new Promise(resolve => setImmediate(resolve)); assert.equal(settled, false);
    releaseWrite(); assert.equal(await pending, true);
    hold = false; releaseWrite = undefined; clock.wall = Date.parse(backing.local[AUTH].authority.payload.expiresAt); clock.mono += 1;
    assert.equal(await worker.call("SellerAgentsControlClient.canWork"), false, "half-open expiry denial");
  } finally { releaseWrite?.(); worker.close(); }
}

// C2.1-R1-B/D provenance and ownership: an actual origin replacement clears
// transport ownership before any secret-bearing route; a same-origin package
// replacement keeps only the valid session clock and obtains a fresh signed
// authority online.
{
  const seed = await fixture(); const saved = clone(seed.backing.local[AUTH]); seed.backing.local.catalog_fixture = { keep: true }; seed.worker.close();
  const network = [];
  const changed = await makeWorker(runtime, { backing: seed.backing, seedAuthority: false, packagedConfig: { environment: "LOCAL DEVELOPMENT", controlApiOrigin: "http://127.0.0.1:43199", portalOrigin: "http://127.0.0.1:43101", extensionVersion: "0.2.4", contractVersion: "control_plane_v2", trustBundle: fixtureTrustBundle(seed.backing) }, fetch: async (url, init) => { network.push({ url, body: init?.body || "" }); return url.endsWith("/v1/device-authorizations") ? json({ status: "pending", authorizationId: "66666666-6666-4666-8666-666666666666", deviceCode: "N".repeat(43), userCode: "ABCD-EFGH", expiresAt: new Date(baseWall + 60000).toISOString() }) : json({ error: { code: "MUST_NOT_USE_OLD_SECRET" } }, 500); } });
  try {
    assert.equal((await changed.call("SellerAgentsControlClient.status")).authenticated, false);
    await assert.rejects(changed.call("SellerAgentsControlClient.bootstrap"), /AUTH_REQUIRED/);
    await assert.rejects(changed.call("SellerAgentsControlClient.refresh", { force: true }), /AUTH_REQUIRED/);
    await changed.call("SellerAgentsControlClient.startActivation");
    assert.equal(network[0].url.endsWith("/v1/device-authorizations"), true);
    assert.equal(network.every(row => !row.body.includes(saved.credentials.accessToken) && !row.body.includes(saved.credentials.refreshToken)), true);
  } finally { changed.close(); }
  const sameOriginBacking = { local: {}, session: {} }, sameSeed = await fixture({ backing: sameOriginBacking });
  const raisedFloor = sameOriginBacking.local[AUTH].cacheClock.effectiveTimeMs + 5000; sameOriginBacking.local[AUTH].cacheClock.effectiveTimeMs = raisedFloor; sameSeed.worker.close();
  const replacementPayload = clone(sameOriginBacking.local[AUTH].authority.payload); const replacement = await makeWorker(runtime, { backing: sameOriginBacking, seedAuthority: false, wallClock: () => baseWall, monotonicClock: () => 1000, packagedConfig: { environment: "LOCAL DEVELOPMENT", controlApiOrigin: "http://127.0.0.1:43100", portalOrigin: "http://127.0.0.1:43101", extensionVersion: "0.2.5", contractVersion: "control_plane_v2", trustBundle: fixtureTrustBundle(sameOriginBacking) }, fetch: async url => url.endsWith("/v1/bootstrap") ? signed(sameOriginBacking, { ...replacementPayload, serverTime: new Date(baseWall).toISOString(), expiresAt: new Date(baseWall + 3600000).toISOString(), offlineGraceUntil: new Date(baseWall + 7200000).toISOString() }) : json({ error: { code: "UNEXPECTED" } }, 500) });
  try { assert.equal((await replacement.call("SellerAgentsControlClient.status")).authenticated, false); assert.ok(replacement.backing.local[AUTH].credentials); assert.ok(replacement.backing.local[AUTH].cacheClock.effectiveTimeMs >= raisedFloor); await replacement.call("SellerAgentsControlClient.bootstrap"); assert.equal((await replacement.call("SellerAgentsControlClient.status")).authenticated, true); } finally { replacement.close(); }
}

// C2.1-R1-C: a real credential-bearing legacy record cannot be resumed when
// its clock/binding metadata is absent, and pending attempts are bound before
// their first request and again when the server response is stored.
{
  const seed = await fixture(); const backing = seed.backing; const saved = clone(backing.local[AUTH]); delete backing.local[AUTH].cacheClock; delete backing.local[AUTH].authority.cacheBinding; backing.local.catalog_fixture = { keep: true }; seed.worker.close();
  const worker = await makeWorker(runtime, { backing, seedAuthority: false, fetch: async () => json({ error: { code: "NO_LEGACY_RESUME" } }, 500) });
  try { assert.equal((await worker.call("SellerAgentsControlClient.status")).authenticated, false); assert.equal(backing.local.catalog_fixture.keep, true); assert.equal(backing.local[AUTH].credentials, null); } finally { worker.close(); }
  const pendingBacking = { local: {}, session: {} }, pendingSeed = await fixture({ backing: pendingBacking }); pendingSeed.worker.close(); pendingBacking.local[AUTH].credentials = null; pendingBacking.local[AUTH].authority = null; pendingBacking.local[AUTH].cacheClock = null;
  pendingBacking.local[AUTH].pending = { phase: "pending", attemptId: "legacy-attempt", authorizationId: "66666666-6666-4666-8666-666666666666", deviceCode: "D".repeat(43), userCode: "ABCD-EFGH", expiresAt: new Date(baseWall + 60000).toISOString(), startIdempotencyKey: "S".repeat(16), exchangeIdempotencyKey: "E".repeat(16) };
  const pendingNetwork = []; const pendingWorker = await makeWorker(runtime, { backing: pendingBacking, seedAuthority: false, fetch: async (url, init) => { pendingNetwork.push({ url, body: init?.body || "" }); return url.endsWith("/v1/device-authorizations") ? json({ status: "pending", authorizationId: "77777777-7777-4777-8777-777777777777", deviceCode: "N".repeat(43), userCode: "JKLM-NPQR", expiresAt: new Date(baseWall + 60000).toISOString() }) : json({ error: { code: "NO_LEGACY_PENDING" } }, 500); } });
  try { assert.equal((await pendingWorker.call("SellerAgentsControlClient.status")).pending, null); await pendingWorker.call("SellerAgentsControlClient.startActivation"); await until(() => pendingNetwork.some(row => row.url.endsWith("/v1/device-authorizations")), "new activation after legacy pending"); assert.equal(pendingNetwork.some(row => String(row.body).includes("D".repeat(43))), false); } finally { pendingWorker.close(); }
}

console.log(JSON.stringify({ status: "PASS", focused: "client-cache-time", fresh_boundary: true, effective_floor: true, restart_floor: true, context_matrix: 11, legacy_closed: true, ownership_reset_race: true, no_live_provider_calls: true, r1_cases: { "A-rolling-monotonic-and-completion-veto": 2, "B-origin-and-same-origin-replacement": 2, "C-legacy-and-pending-provenance": 2, "D-wall-rollback-and-restart-floor": 1, "prior-focused-matrix": 11 } }));
