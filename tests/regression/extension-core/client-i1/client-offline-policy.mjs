import assert from "node:assert/strict";
import path from "node:path";
import { makeWorker, signFixtureBootstrap, until } from "../worker-harness.mjs";

const runtime = path.resolve(process.argv[2]);
const AUTH = "seller_agents_control_auth_v2";
const CHATGPT = { family: "chatgpt", surface: "web", variant: null };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const canonical = value => value === null ? "null" : typeof value === "boolean" ? (value ? "true" : "false") : typeof value === "string" ? JSON.stringify(value) : typeof value === "number" ? String(value) : Array.isArray(value) ? `[${value.map(canonical).join(",")}]` : `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;

async function signed(backing, payload) { return json(await signFixtureBootstrap(backing, payload)); }

async function prepared(options = {}) {
  const clock = options.clock || { wall: Date.now(), mono: 1000 };
  const backing = { local: {}, session: {} };
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
  const worker = await makeWorker(runtime, {
    backing,
    seedAuthority: false,
    wallClock: () => clock.wall,
    monotonicClock: () => clock.mono,
    fetch: options.fetch || (async url => { throw new Error("unexpected control request " + url); }),
    onStorageWrite: options.onStorageWrite,
    onStorageRemove: options.onStorageRemove,
  });
  return { worker, backing, clock, original };
}

async function policy(worker, options = {}, compatibilityProbe = false) {
  const available = await worker.call("(function () { return typeof SellerAgentsControlClient.bootstrapWithPolicy === 'function'; })");
  assert.equal(typeof available, "boolean");
  if (available) return worker.call("SellerAgentsControlClient.bootstrapWithPolicy", options);
  // Exact-start compatibility path: the observed error must be the actual
  // online rejection, never a missing-method TypeError.
  if (!compatibilityProbe) return worker.call("SellerAgentsControlClient.bootstrap", options);
  try { return await worker.call("SellerAgentsControlClient.bootstrap", options); }
  catch (failure) { return { source: "LEGACY_ONLINE_ONLY", failureCode: failure.code, status: failure.status }; }
}

async function assertTransportCase(kind, responseFactory, expectedFreshness = "STALE_BUT_OFFLINE_GRACE_ELIGIBLE") {
  const clock = { wall: Date.now(), mono: 1000 };
  const fixture = await prepared({ clock, payload: base => ({ ...base, expiresAt: new Date(clock.wall - 1).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString() }), fetch: async url => {
    assert.ok(url.endsWith("/v1/bootstrap"), `${kind} only attempts bootstrap`);
    return responseFactory();
  } });
  try {
    const before = structuredClone(fixture.backing.local[AUTH].authority);
    const result = await policy(fixture.worker, { detectedAi: CHATGPT }, true);
    if (result.source === "LEGACY_ONLINE_ONLY") { assert.equal(result.failureCode, kind.includes("audited") ? "BOOTSTRAP_UNAVAILABLE" : "CONTROL_TRANSPORT_UNAVAILABLE", kind); assert.equal(result.status, kind.includes("audited") ? 503 : undefined, kind); return; }
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

// Account-only cache is valid configuration only for an account-only request;
// it cannot satisfy a requested AI context, and stale acquisition never turns
// the existing Work-facing guards into an offline grant.
{
  const clock = { wall: Date.now(), mono: 1000 };
  const fixture = await prepared({ clock, requestedAi: null, payload: base => ({ ...base, expiresAt: new Date(clock.wall - 1).toISOString(), offlineGraceUntil: new Date(clock.wall + 3600000).toISOString(), ai: { status: "UNCONFIGURED" } }), fetch: async url => { assert.ok(url.endsWith("/v1/bootstrap")); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
  try { const result = await policy(fixture.worker); assert.equal(result.source, "CACHE"); assert.equal(await fixture.worker.call("SellerAgentsControlClient.canWork"), false); assert.equal((await fixture.worker.call("SellerAgentsControlClient.status")).workAllowed, false); }
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
