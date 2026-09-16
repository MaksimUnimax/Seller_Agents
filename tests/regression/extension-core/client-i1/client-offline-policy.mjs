import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import path from "node:path";
import { makeWorker, signFixtureBootstrap, until } from "../worker-harness.mjs";

const runtime = path.resolve(process.argv[2]);
const AUTH = "seller_agents_control_auth_v2";
const CHATGPT = { family: "chatgpt", surface: "web", variant: null };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const canonical = value => value === null ? "null" : typeof value === "boolean" ? (value ? "true" : "false") : typeof value === "string" ? JSON.stringify(value) : typeof value === "number" ? String(value) : Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
function packagedConfig(backing, changes = {}) {
  const key = backing.local.__seller_agents_fixture_signing_key;
  const publicKey = Buffer.from(key.publicKey, "base64");
  const fingerprint = createHash("sha256").update(publicKey).digest("hex");
  return { environment: "LOCAL DEVELOPMENT", controlApiOrigin: "http://127.0.0.1:43100", portalOrigin: "http://127.0.0.1:43101", extensionVersion: "0.2.4", contractVersion: "control_plane_v2", trustBundle: { trustBundleVersion: "bootstrap_trust_bundle_v1", algorithm: "Ed25519", publicKeyFormat: "spki_der", publicKeyEncoding: "base64", fingerprintAlgorithm: "sha256", fingerprintEncoding: "lowercase_hex", keys: [{ keyId: "fixture-key", publicKey: key.publicKey, fingerprintSha256: fingerprint, lifecycle: "ACTIVE", trustEligibility: "SIGNING_AND_VERIFICATION" }] }, ...changes };
}

async function signed(backing, payload) { return json(await signFixtureBootstrap(backing, payload)); }

async function prepared(options = {}) {
  const clock = options.clock || { wall: Date.now(), mono: 1000 };
  const backing = options.backing || { local: {}, session: {} };
  const first = await makeWorker(runtime, { backing, wallClock: () => clock.wall, monotonicClock: () => clock.mono });
  const original = structuredClone(backing.local[AUTH]);
  first.close();
  if (options.payload) {
    const payload = structuredClone(options.payload(original.authority.payload));
    backing.local[AUTH].authority.payload = payload;
    backing.local[AUTH].authority.envelope = await signFixtureBootstrap(backing, payload);
    backing.local[AUTH].authority.requestedAi = options.requestedAi === undefined ? original.authority.requestedAi : options.requestedAi;
    backing.local[AUTH].authority.cacheBinding.detectedAi = backing.local[AUTH].authority.requestedAi === null ? null : CHATGPT;
  }
  if (options.credentials) Object.assign(backing.local[AUTH].credentials, options.credentials);
  await options.mutateBacking?.(backing);
  const packagedConfig = options.packagedConfigFactory ? await options.packagedConfigFactory(backing) : options.packagedConfig;
  const worker = await makeWorker(runtime, {
    backing,
    seedAuthority: false,
    wallClock: () => clock.wall,
    monotonicClock: () => clock.mono,
    userAgent: options.userAgent,
    packagedConfig,
    fetch: options.fetch || (async url => { throw new Error("unexpected control request " + url); }),
    onStorageWrite: options.onStorageWrite,
    onStorageRemove: options.onStorageRemove,
  });
  return { worker, backing, clock, original };
}

async function policy(worker, options = {}) {
  const available = await worker.call("(function () { return typeof SellerAgentsControlClient.bootstrapWithPolicy === 'function'; })");
  assert.equal(typeof available, "boolean");
  assert.equal(available, true, "candidate must expose bootstrapWithPolicy; exact-base RED is a separate run");
  return worker.call("SellerAgentsControlClient.bootstrapWithPolicy", options);
}

async function assertTransportCase(kind, responseFactory, expectedFreshness = "STALE_BUT_OFFLINE_GRACE_ELIGIBLE", payloadOptions = {}) {
  const clock = { wall: Date.now(), mono: 1000 };
  const fixture = await prepared({ clock, payload: base => ({ ...base, expiresAt: new Date(clock.wall - 1).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString(), ...payloadOptions }), fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"), `${kind} only attempts bootstrap`);
    return responseFactory();
  } });
  try {
    const before = structuredClone(fixture.backing.local[AUTH].authority);
    const result = await policy(fixture.worker, { detectedAi: CHATGPT });
    assert.equal(result.source, "CACHE", kind);
    assert.equal(result.freshness, expectedFreshness, kind);
    assert.equal(canonical(result.payload), canonical(before.payload), `${kind} preserves payload`);
    assert.equal(canonical(fixture.backing.local[AUTH].authority.envelope), canonical(before.envelope), `${kind} preserves signed envelope`);
    assert.equal(fixture.worker.network.filter(row => row.url.endsWith("/v1/bootstrap")).length, 1, `${kind} observed online failure`);
  } finally { fixture.worker.close(); }
}

await assertTransportCase("TypeError transport", () => { throw new TypeError("offline detail must stay private"); });
await assertTransportCase("abort-like transport", () => { throw Object.assign(new Error("aborted"), { name: "AbortError" }); });
await assertTransportCase("audited bootstrap 503", () => json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503));
await assertTransportCase("audited bootstrap 503 with fresh access", () => json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503), "FRESH", { expiresAt: new Date(Date.now() + 3600000).toISOString(), offlineGraceUntil: new Date(Date.now() + 7200000).toISOString() });

// A response-body failure may carry the audited fields in its local cause,
// but it did not come from request()'s HTTP-error construction and cannot
// acquire cache.
{
  const localBodyFailure = Object.assign(new Error("body read failure"), { status: 503, code: "BOOTSTRAP_UNAVAILABLE" });
  const fixture = await prepared({ fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"));
    return { ok: false, status: 503, headers: { get: () => null }, body: { getReader: () => ({ read: async () => { throw localBodyFailure; }, cancel: async () => {} }) } };
  } });
  try {
    const before = structuredClone(fixture.backing.local[AUTH].authority);
    await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /CONTROL_HTTP_503/);
    assert.equal(canonical(fixture.backing.local[AUTH].authority), canonical(before), "local body failure leaves signed cache unchanged");
  } finally { fixture.worker.close(); }
}

// A response exists for every case below; none may be reclassified as
// transport merely because it has no useful status on an arbitrary exception.
for (const [label, responseFactory] of [
  ["wrong-code 503", () => json({ error: { code: "TEMPORARY" } }, 503)],
  ["malformed 503", () => json("not-json", 503)],
  ["429", () => json({ error: { code: "RETRY" } }, 429)],
  ["500", () => json({ error: { code: "FAIL" } }, 500)],
  ["502", () => json({ error: { code: "FAIL" } }, 502)],
  ["504", () => json({ error: { code: "FAIL" } }, 504)],
  ["malformed 200", () => json({ malformed: true }, 200)],
]) {
  const fixture = await prepared({ fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return responseFactory(); } });
  try { await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT })); assert.notEqual(fixture.worker.network.length, 0, label); assert.ok(fixture.backing.local[AUTH] === undefined || fixture.backing.local[AUTH]?.authority == null || fixture.backing.local[AUTH]?.authority?.payload); }
  finally { fixture.worker.close(); }
}

// A body-read failure after Response is not transport and therefore cannot
// acquire cache. The verifier sees a missing body and rejects the bootstrap.
{
  const fixture = await prepared({ fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"));
    return new Response(new ReadableStream({ start(controller) { controller.error(new Error("body read failure")); } }), { status: 200 });
  } });
  try { await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /BOOTSTRAP_/); }
  finally { fixture.worker.close(); }
}

// Exact expiry boundaries use the real signed envelope and the production
// effective-time checkpoint: expiry is stale, grace equality is denied.
for (const [label, offset, expected] of [["expiresAt", 0, "STALE_BUT_OFFLINE_GRACE_ELIGIBLE"], ["grace equality", 3600000, "CACHE_EXPIRED"], ["grace after", 3600001, "CACHE_EXPIRED"]]) {
  const clock = { wall: Date.now(), mono: 1000 };
  const fixture = await prepared({ clock, payload: base => ({ ...base, expiresAt: new Date(clock.wall).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString() }), fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
  clock.wall += offset; clock.mono += offset;
  try {
    if (expected === "CACHE_EXPIRED") await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), new RegExp(expected));
    else { const result = await policy(fixture.worker, { detectedAi: CHATGPT }); assert.equal(result.freshness, expected, label); }
  } finally { fixture.worker.close(); }
}

// Expired access may fail at preflight refresh and still preserve rotation
// intent while using the matching signed cache. A bootstrap 401 followed by
// forced-refresh transport is a known auth challenge and cannot fall back.
{
  const clock = { wall: Date.now(), mono: 1000 };
  const preflight = await prepared({ clock, credentials: { accessTokenExpiresAt: new Date(clock.wall - 1000).toISOString() }, payload: base => ({ ...base, expiresAt: new Date(clock.wall - 1).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString() }), fetch: async url => { assert.ok(url.endsWith("/v1/auth/refresh")); throw new TypeError("refresh transport"); } });
  try { const result = await policy(preflight.worker, { detectedAi: CHATGPT }); assert.equal(result.source, "CACHE"); assert.ok(preflight.backing.local[AUTH].rotation, "rotation intent retained"); }
  finally { preflight.worker.close(); }
}
{
  const fixture = await prepared({ fetch: async url => {
    if (url.endsWith("/v1/bootstrap")) return json({ error: { code: "AUTH_CHALLENGE" } }, 401);
    assert.ok(url.endsWith("/v1/auth/refresh")); throw new TypeError("forced refresh transport");
  } });
  try { await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /AUTH_CHALLENGE/); assert.equal(fixture.backing.local[AUTH].credentials, null, "known auth challenge is terminal"); assert.equal(fixture.backing.local[AUTH].authority, null); }
  finally { fixture.worker.close(); }
}

// P2: hold the actual denial AUTH write after the increased-floor write. A
// later raw bootstrap supersedes the policy while that successful write is
// held. Obsolescence must not remove AUTH or turn the successful write into a
// storage failure.
{
  const clock = { wall: Date.now(), mono: 1000 };
  let denialRelease, denialHeld = false, bootstrapCalls = 0;
  const writes = [];
  const fixture = await prepared({
    clock,
    credentials: { accessTokenExpiresAt: new Date(clock.wall + 86400000).toISOString(), refreshTokenExpiresAt: new Date(clock.wall + 172800000).toISOString() },
    payload: base => ({ ...base, expiresAt: new Date(clock.wall + 3600000).toISOString(), offlineGraceUntil: new Date(clock.wall + 7200000).toISOString() }),
    fetch: async url => {
      assert.ok(url.endsWith("/v1/bootstrap"));
      bootstrapCalls++;
      if (bootstrapCalls === 1) return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503);
      return new Promise(resolve => { fixture.releaseBootstrap = () => resolve(signed(fixture.backing, { ...fixture.backing.local[AUTH].authority.payload, configVersion: 2, serverTime: new Date(clock.wall + 1).toISOString(), expiresAt: new Date(clock.wall + 3600000).toISOString(), offlineGraceUntil: new Date(clock.wall + 7200000).toISOString() })); });
    },
    onStorageWrite: async (kind, values) => {
      if (kind !== "local" || !values[AUTH]) return;
      const entry = structuredClone(values[AUTH]);
      writes.push({ workAllowed: entry.authority?.workAllowed, floor: entry.cacheClock?.effectiveTimeMs, configVersion: entry.authority?.payload?.configVersion });
      if (!denialHeld && entry.authority?.workAllowed === false) {
        denialHeld = true;
        await new Promise(resolve => { denialRelease = resolve; });
      }
    },
    onStorageRemove: async (kind, key) => { if (kind === "local" && key === AUTH) fixture.removeAttempts = (fixture.removeAttempts || 0) + 1; },
  });
  try {
    clock.wall += 7200000; clock.mono += 7200000;
    const old = policy(fixture.worker, { detectedAi: CHATGPT });
    await until(() => denialHeld && writes.some(row => row.workAllowed === true) && typeof denialRelease === "function", "P2 denial AUTH write");
    const oldFloor = fixture.backing.local[AUTH].cacheClock.effectiveTimeMs;
    const later = fixture.worker.call("SellerAgentsControlClient.bootstrap", { detectedAi: CHATGPT });
    await until(() => bootstrapCalls === 2, "P2 later raw bootstrap");
    denialRelease();
    await assert.rejects(old, /CACHE_ACQUISITION_OBSOLETED/);
    assert.equal(fixture.removeAttempts || 0, 0, "P2 obsolescence does not remove AUTH");
    assert.ok(fixture.backing.local[AUTH], "P2 AUTH remains present");
    assert.ok(fixture.backing.local[AUTH].cacheClock.effectiveTimeMs >= oldFloor, "P2 floor is nondecreasing");
    fixture.releaseBootstrap();
    const newer = await later;
    assert.equal(newer.configVersion, 2, "P2 newer raw result completes");
    assert.equal(fixture.backing.local[AUTH].authority.payload.configVersion, 2, "P2 newer authority remains owner");
    assert.ok(writes.some(row => row.workAllowed === true) && writes.some(row => row.workAllowed === false), "P2 held denial write was after floor write");
  } finally { fixture.worker.close(); }
}

// G/public-return fence: resolve the real successful checkpoint write, then
// start a newer raw invocation before the queue promise reaches the public
// consumer. The old policy result is rejected and B owns the final authority.
{
  const clock = { wall: Date.now(), mono: 1000 };
  let checkpointHeld = false, releaseCheckpoint, calls = 0;
  const fixture = await prepared({
    clock,
    credentials: { accessTokenExpiresAt: new Date(clock.wall + 86400000).toISOString(), refreshTokenExpiresAt: new Date(clock.wall + 172800000).toISOString() },
    payload: base => ({ ...base, expiresAt: new Date(clock.wall + 3600000).toISOString(), offlineGraceUntil: new Date(clock.wall + 7200000).toISOString() }),
    fetch: async url => {
      assert.ok(url.endsWith("/v1/bootstrap"));
      if (++calls === 1) return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503);
      const base = structuredClone(fixture.backing.local[AUTH].authority.payload);
      return signed(fixture.backing, { ...base, configVersion: 2, serverTime: new Date(clock.wall + 1).toISOString(), expiresAt: new Date(clock.wall + 3600000).toISOString(), offlineGraceUntil: new Date(clock.wall + 7200000).toISOString() });
    },
    onStorageWrite: async (kind, values) => {
      if (kind === "local" && values[AUTH]?.authority?.workAllowed === true && values[AUTH].cacheClock.effectiveTimeMs > Date.now() && !checkpointHeld) {
        checkpointHeld = true;
        await new Promise(resolve => { releaseCheckpoint = resolve; });
      }
    },
  });
  try {
    clock.wall += 3600001; clock.mono += 3600001;
    const old = policy(fixture.worker, { detectedAi: CHATGPT });
    await until(() => checkpointHeld && typeof releaseCheckpoint === "function", "G checkpoint write");
    releaseCheckpoint();
    const newer = fixture.worker.call("SellerAgentsControlClient.bootstrap", { detectedAi: CHATGPT });
    await assert.rejects(old, /CACHE_ACQUISITION_OBSOLETED/);
    const result = await newer;
    assert.equal(result.configVersion, 2);
    assert.equal(fixture.backing.local[AUTH].authority.payload.configVersion, 2);
  } finally { fixture.worker.close(); }
}

// Account-only cache is valid configuration only for an account-only request;
// it cannot satisfy a requested AI context, and stale acquisition never turns
// the existing Work-facing guards into an offline grant.
{
  const clock = { wall: Date.now(), mono: 1000 }, backing = { local: {}, session: {} };
  let offline = false;
  const fixture = await prepared({ clock, backing, fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"));
    if (offline) return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503);
    const base = structuredClone(backing.local[AUTH].authority.payload);
    return signed(backing, { ...base, serverTime: new Date(clock.wall + 1).toISOString(), expiresAt: new Date(clock.wall + 1000).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString(), ai: { status: "UNCONFIGURED" } });
  } });
  try {
    await fixture.worker.call("SellerAgentsControlClient.bootstrap");
    offline = true; clock.wall += 2000; clock.mono += 2000;
    const result = await policy(fixture.worker);
    assert.equal(result.source, "CACHE");
    assert.equal(await fixture.worker.call("SellerAgentsControlClient.canWork"), false);
    assert.equal((await fixture.worker.call("SellerAgentsControlClient.status")).workAllowed, false);
    assert.equal((await fixture.worker.call("SellerAgentsControlClient.getAuthority")).workAllowed, false);
  } finally { fixture.worker.close(); }
}

// F: policy acquisition rejects the signed cache for each changed binding
// dimension. The first group is restore-level denial; requested AI is an
// in-flight policy identity mismatch with the original authority preserved.
for (const [label, changes, userAgent] of [
  ["api origin", { controlApiOrigin: "http://127.0.0.1:43199" }],
  ["portal origin", { portalOrigin: "http://127.0.0.1:43199" }],
  ["browser", {}, "Mozilla/5.0 Chrome/120.0.0.0"],
  ["extension version", { extensionVersion: "0.2.5" }],
  ["contract", { contractVersion: "control_plane_v3" }],
  ["packaged trust ring", { trustBundle: { trustBundleVersion: "bootstrap_trust_bundle_v1", algorithm: "Ed25519", publicKeyFormat: "spki_der", publicKeyEncoding: "base64", fingerprintAlgorithm: "sha256", fingerprintEncoding: "lowercase_hex", keys: [] } }],
]) {
  const clock = { wall: Date.now(), mono: 1000 };
  const fixture = await prepared({
    clock,
    userAgent,
    packagedConfigFactory: async backing => packagedConfig(backing, changes),
    payload: base => ({ ...base, expiresAt: new Date(clock.wall - 1).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString() }),
    fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); },
  });
  try {
    await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /BOOTSTRAP_UNAVAILABLE|CACHE_CONTEXT_MISMATCH|AUTH_REQUIRED/);
    assert.ok(fixture.worker.network.filter(row => row.url.endsWith("/v1/bootstrap")).length <= 1, `${label} source`);
    assert.equal(fixture.backing.local[AUTH]?.authority, null, `${label} restore denial`);
  } finally { fixture.worker.close(); }
}
{
  const fixture = await prepared({ payload: base => ({ ...base, expiresAt: new Date(Date.now() - 1).toISOString(), offlineGraceUntil: new Date(Date.now() + 3600000).toISOString() }), fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
  try {
    await assert.rejects(policy(fixture.worker, { detectedAi: { family: "alice", surface: "web", variant: null } }), /BOOTSTRAP_UNAVAILABLE|CACHE_CONTEXT_MISMATCH/);
    assert.ok(fixture.backing.local[AUTH]?.authority, "requested-AI mismatch keeps the original authority");
  } finally { fixture.worker.close(); }
}
for (const [label, field, value] of [
  ["device context", "deviceId", "44444444-4444-4444-8444-444444444444"],
  ["session context", "sessionId", "55555555-5555-4555-8555-555555555555"],
]) {
  const fixture = await prepared({
    payload: base => ({ ...base, expiresAt: new Date(Date.now() - 1).toISOString(), offlineGraceUntil: new Date(Date.now() + 3600000).toISOString() }),
    mutateBacking: backing => { backing.local[AUTH].credentials[field] = value; },
    fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); },
  });
  try { await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /AUTH_REQUIRED|BOOTSTRAP_UNAVAILABLE/); assert.equal(fixture.backing.local[AUTH]?.authority, null, `${label} authority denied`); }
  finally { fixture.worker.close(); }
}
{
  const fixture = await prepared({
    payload: base => ({ ...base, expiresAt: new Date(Date.now() - 1).toISOString(), offlineGraceUntil: new Date(Date.now() + 3600000).toISOString() }),
    mutateBacking: backing => { const signature = backing.local[AUTH].authority.envelope.signature; backing.local[AUTH].authority.envelope.signature = `${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`; },
    fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); },
  });
  try { await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /BOOTSTRAP_UNAVAILABLE|AUTH_REQUIRED/); assert.equal(fixture.backing.local[AUTH]?.authority, null, "differently signed envelope is denied"); }
  finally { fixture.worker.close(); }
}
{
  const fixture = await prepared({ fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
  try { await assert.rejects(policy(fixture.worker), /BOOTSTRAP_UNAVAILABLE|CACHE_CONTEXT_MISMATCH/); }
  finally { fixture.worker.close(); }
}

// A later raw online invocation supersedes an older policy attempt even when
// both use the same account/device/session. The held A response cannot return
// cache or lower B's signed authority.
{
  let calls = 0, release;
  const fixture = await prepared({ fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"));
    if (++calls === 1) return new Promise((resolve, reject) => { release = () => reject(new TypeError("A transport")); });
    const payload = structuredClone(fixture.backing.local[AUTH].authority.payload);
    return signed(fixture.backing, { ...payload, configVersion: 2 });
  } });
  try {
    const old = policy(fixture.worker, { detectedAi: CHATGPT }), oldFailure = assert.rejects(old, /CONTROL_TRANSPORT_UNAVAILABLE/); await until(() => release, "held policy A");
    const replacement = fixture.worker.call("SellerAgentsControlClient.bootstrap", { detectedAi: CHATGPT });
    await until(() => calls === 2, "raw online B"); release();
    await replacement; await oldFailure;
    assert.equal(fixture.backing.local[AUTH].authority.payload.configVersion, 2);
  } finally { fixture.worker.close(); }
}

// A later 403 invalidates the current authority; the old eligible transport
// failure must not restore it.
{
  let calls = 0, release;
  const fixture = await prepared({ fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"));
    if (++calls === 1) return new Promise((resolve, reject) => { release = () => reject(new TypeError("A transport")); });
    return json({ error: { code: "LATER_FORBIDDEN" } }, 403);
  } });
  try {
    const old = policy(fixture.worker, { detectedAi: CHATGPT }), oldFailure = assert.rejects(old, /CONTROL_TRANSPORT_UNAVAILABLE/); await until(() => release, "held policy before 403");
    const forbidden = fixture.worker.call("SellerAgentsControlClient.bootstrap", { detectedAi: CHATGPT }), forbiddenFailure = assert.rejects(forbidden, /LATER_FORBIDDEN/);
    await until(() => calls === 2, "later 403"); release();
    await forbiddenFailure; await oldFailure;
    assert.equal(fixture.backing.local[AUTH].authority, null);
  } finally { fixture.worker.close(); }
}

// Failed checkpoint writes deny this call; after storage recovery the same
// signed cache is reconsidered. The catalog/IDB surface is not involved.
{
  let fail = false, writes = 0, removes = 0;
  const fixture = await prepared({ payload: base => ({ ...base, expiresAt: new Date(Date.now() - 1).toISOString(), offlineGraceUntil: new Date(Date.now() + 3600000).toISOString() }), fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); }, onStorageWrite: async (kind, values) => { if (kind === "local" && values[AUTH] && fail) { writes++; throw new Error("injected storage failure"); } }, onStorageRemove: async kind => { if (kind === "local" && fail) removes++; } });
  try {
    fail = true;
    fixture.clock.wall += 100; fixture.clock.mono += 100;
    await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /AUTH_DENIAL_PERSISTENCE_FAILED/);
    assert.equal(writes, 1); assert.equal(removes, 1);
    fail = false;
    const result = await policy(fixture.worker, { detectedAi: CHATGPT });
    assert.equal(result.source, "CACHE");
  } finally { fixture.worker.close(); }
}

// A failed denial set followed by a failed removal is reported honestly. The
// persisted record remains the old checkpoint, so a restart cannot claim the
// newer in-memory floor was durable.
{
  const clock = { wall: Date.now(), mono: 1000 }, writes = [], removals = [];
  let failDenial = false;
  const fixture = await prepared({
    clock,
    payload: base => ({ ...base, expiresAt: new Date(clock.wall + 3600000).toISOString(), offlineGraceUntil: new Date(clock.wall + 7200000).toISOString() }),
    fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); },
    onStorageWrite: async (kind, values) => { if (kind === "local" && failDenial && values[AUTH]?.authority?.workAllowed === false) { writes.push(values[AUTH].cacheClock.effectiveTimeMs); throw new Error("denial set failed"); } },
    onStorageRemove: async (kind, key) => { if (kind === "local" && failDenial && key === AUTH) { removals.push(key); throw new Error("denial remove failed"); } },
  });
  const persistedFloor = fixture.backing.local[AUTH].cacheClock.effectiveTimeMs;
  try {
    clock.wall += 7200000; clock.mono += 7200000; failDenial = true;
    await assert.rejects(policy(fixture.worker, { detectedAi: CHATGPT }), /AUTH_DENIAL_PERSISTENCE_FAILED/);
    assert.equal(writes.length, 1); assert.equal(removals.length, 1);
    assert.ok(fixture.backing.local[AUTH].cacheClock.effectiveTimeMs >= persistedFloor, "successful floor checkpoint is retained");
    assert.equal((await fixture.worker.call("SellerAgentsControlClient.getAuthority")).workAllowed, false, "memory remains denied");
    failDenial = false;
    const restarted = await makeWorker(runtime, { backing: fixture.backing, seedAuthority: false, wallClock: () => clock.wall, monotonicClock: () => clock.mono, fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
    try { assert.equal((await restarted.call("SellerAgentsControlClient.status")).authenticated, true); assert.ok(restarted.backing.local[AUTH].cacheClock.effectiveTimeMs >= persistedFloor); } finally { restarted.close(); }
  } finally { fixture.worker.close(); }
}

// A verified live renewal remains online and replaces the cached envelope;
// policy never replays a provider request on behalf of Work guards.
{
  const fixture = await prepared({ fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"));
    const payload = structuredClone(fixture.backing.local[AUTH].authority.payload);
    return signed(fixture.backing, { ...payload, configVersion: 3 });
  } });
  try {
    const result = await policy(fixture.worker, { detectedAi: CHATGPT });
    assert.equal(result.source, "ONLINE"); assert.equal(result.freshness, "FRESH");
    assert.equal(result.payload.configVersion, 3); assert.equal(fixture.worker.network.length, 1);
    await fixture.worker.call("SellerAgentsControlClient.canWork"); await fixture.worker.call("SellerAgentsControlClient.status");
    assert.equal(fixture.worker.network.length, 1, "fresh Work guards do not add network requests");
  } finally { fixture.worker.close(); }
}

console.log(JSON.stringify({ status: "PASS", focused: "client-offline-policy", A: "PASS", B: "PASS", C: "PASS", D: "PASS", E: "PASS", F: "PASS", G: "PASS", H: "PASS", transport_provenance: true, audited_503: true, no_offline_work_grant: true }));
