import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import path from "node:path";
const { makeWorker, signFixtureBootstrap, until } = await import(process.argv[3]);

const runtime = path.resolve(process.argv[2]);
const AUTH = "seller_agents_control_auth_v2";
const CHATGPT = { family: "chatgpt", surface: "web", variant: null };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const caseResults = [], caseFailures = [];
const T0 = 1700000000000;
const clone = value => value === undefined ? undefined : structuredClone(value);
const paths = worker => worker.network.map(row => new URL(row.url).pathname);
const fixedPayload = (clock, changes = {}) => base => ({ ...clone(base), issuedAt: new Date(T0 - 100).toISOString(), serverTime: new Date(T0).toISOString(), expiresAt: new Date(T0 + 1000).toISOString(), offlineGraceUntil: new Date(T0 + 3000).toISOString(), ...changes });
const profileFingerprint = (content, compatibility) => createHash("sha256").update(canonical({ content, compatibility })).digest("hex");
function withProfile(base, changes = {}) {
  const compatibility = { ...base.ai.profile.compatibility, ...changes };
  const profile = { ...base.ai.profile, compatibility, contentSha256: profileFingerprint(base.ai.profile.content, compatibility) };
  return { ...clone(base), ai: { ...base.ai, profile } };
}
async function exactFailure(operation, expected, label) {
  let failure;
  try { await operation(); } catch (error) { failure = error; }
  assert.ok(failure, label + ": expected rejection");
  assert.equal(failure.code, expected.code || expected, label + ": code");
  if (expected.status !== undefined) assert.equal(failure.status, expected.status, label + ": status");
  if (expected.responseOk !== undefined) assert.equal(failure.responseOk, expected.responseOk, label + ": responseOk");
  return failure;
}
async function namedCase(id, fn, assertion = id + " assertions completed") {
  try {
    await fn();
    caseResults.push({ id, status: "PASS", source: "asserted", failure_origin: null, actual_assertion: assertion });
  } catch (error) {
    caseResults.push({ id, status: "FAIL", source: "asserted", failure_origin: (error.code ? error.code + ": " : "") + (error.message || String(error)), actual_assertion: assertion });
    caseFailures.push(error);
  }
}
function fakeIDB() {
  const records = new Map(), stats = { reads: 0, writes: 0 };
  return { records, stats, open() {
    const request = {};
    queueMicrotask(() => {
      request.result = { objectStoreNames: { contains: () => true }, close() {}, transaction() {
        const tx = { objectStore() {
          const op = (kind, value) => {
            const result = {};
            queueMicrotask(() => {
              if (kind === "get" || kind === "all") stats.reads++;
              if (kind === "put") { stats.writes++; records.set(value.artifact_key, value); }
              if (kind === "delete") { stats.writes++; records.delete(value); }
              result.result = kind === "get" ? records.get(value) : kind === "all" ? [...records.values()] : value?.artifact_key;
              result.onsuccess?.();
              queueMicrotask(() => tx.oncomplete?.());
            });
            return result;
          };
          return { get: key => op("get", key), put: value => op("put", value), delete: key => op("delete", key), getAll: () => op("all") };
        } };
        return tx;
      } };
      request.onsuccess?.();
    });
    return request;
  } };
}
const idbRequest = request => new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error || new Error("fixture IDB request failed")); });
async function idbPutGet(idb, record) {
  const database = await idbRequest(idb.open());
  const store = database.transaction("artifacts", "readwrite").objectStore("artifacts");
  await idbRequest(store.put(record));
  const readStore = database.transaction("artifacts", "readonly").objectStore("artifacts");
  return idbRequest(readStore.get(record.artifact_key));
}
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
  const wallClock = options.wallClock || (() => clock.wall);
  const monotonicClock = options.monotonicClock || (() => clock.mono);
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
    wallClock,
    monotonicClock,
    indexedDB: options.indexedDB,
    beforeCryptoVerify: options.beforeCryptoVerify,
    accountId: options.accountId,
    deviceId: options.deviceId,
    sessionId: options.sessionId,
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

await namedCase("Q2-D-rollback-consumed-grace-restart", async () => {
  const clock = { wall: T0, mono: 1000 }, fixture = await prepared({ clock, payload: fixedPayload(clock), fetch: async url => { assert.equal(new URL(url).pathname, "/v1/bootstrap"); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
  try {
    clock.wall = T0 + 500; clock.mono = 1500; await policy(fixture.worker, { detectedAi: CHATGPT });
    clock.wall = T0 - 500; clock.mono = 2500; await policy(fixture.worker, { detectedAi: CHATGPT });
    const consumedFloor = fixture.backing.local[AUTH].cacheClock.effectiveTimeMs;
    assert.equal(consumedFloor, T0 + 1500);
    fixture.worker.close();
    const restartClock = { wall: T0 - 500, mono: 1 };
    const restarted = await makeWorker(runtime, { backing: fixture.backing, seedAuthority: false, wallClock: () => restartClock.wall, monotonicClock: () => restartClock.mono, fetch: async url => { assert.equal(new URL(url).pathname, "/v1/bootstrap"); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
    try {
      assert.equal(fixture.backing.local[AUTH].cacheClock.effectiveTimeMs, consumedFloor);
      const cached = await policy(restarted, { detectedAi: CHATGPT });
      assert.equal(cached.freshness, "STALE_BUT_OFFLINE_GRACE_ELIGIBLE");
      restartClock.wall = T0 + 3000; restartClock.mono = 1501;
      await exactFailure(() => policy(restarted, { detectedAi: CHATGPT }), "CACHE_EXPIRED", "Q2-D grace");
      assert.ok(restarted.backing.local[AUTH].cacheClock.effectiveTimeMs >= T0 + 3000);
      restarted.close();
      const again = await makeWorker(runtime, { backing: fixture.backing, seedAuthority: false, wallClock: () => T0 - 10000, monotonicClock: () => 1, fetch: async url => { assert.equal(new URL(url).pathname, "/v1/bootstrap"); return json({ error: { code: "BOOTSTRAP_UNAVAILABLE" } }, 503); } });
      try {
        assert.equal((await again.call("SellerAgentsControlClient.canWork")), false);
        assert.equal((await again.call("SellerAgentsControlClient.getAuthority")).workAllowed, false);
        assert.ok(again.backing.local[AUTH].cacheClock.effectiveTimeMs >= T0 + 3000);
        await exactFailure(() => policy(again, { detectedAi: CHATGPT }), "CACHE_EXPIRED", "Q2-D rollback denial");
      } finally { again.close(); }
    } finally { if (restarted) restarted.close(); }
  } finally { fixture.worker.close(); }
});


console.log(JSON.stringify({cases:caseResults}));if(caseFailures.length)process.exitCode=1;
