import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

// Independent review probes. Run the unmodified published client with controlled
// API replies and disposable keys. No live server, credentials or marketplace.
const root = path.resolve(process.env.SA_REVIEW_REPOSITORY || path.join(import.meta.dirname, 'snapshot'));
const K = 'seller_agents_control_auth_v2';
const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const iso = delta => new Date(Date.now() + delta).toISOString();
const canonical = v => v === null || typeof v !== 'object' ? JSON.stringify(v) : Array.isArray(v) ? '[' + v.map(canonical).join(',') + ']' : '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
const clone = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
const rows = [];
async function harness({ account = null, accessExpired = false, accessBasis = 'BETA', family = 'chatgpt', fetcher } = {}) {
  const pair = await webcrypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  const der = await webcrypto.subtle.exportKey('spki', pair.publicKey);
  const keyId = 'review-key';
  const bundle = { trustBundleVersion: 'bootstrap_trust_bundle_v1', algorithm: 'Ed25519', publicKeyFormat: 'spki_der', publicKeyEncoding: 'base64', fingerprintAlgorithm: 'sha256', fingerprintEncoding: 'lowercase_hex', keys: [{ keyId, publicKey: Buffer.from(der).toString('base64'), fingerprintSha256: Buffer.from(await webcrypto.subtle.digest('SHA-256', der)).toString('hex'), lifecycle: 'ACTIVE', trustEligibility: 'SIGNING_AND_VERIFICATION' }] };
  const credentials = id => ({ deviceId: id, sessionId: '33333333-3333-4333-8333-333333333333', tokenType: 'Bearer', accessToken: 'review_access_token_synthetic', accessTokenExpiresAt: iso(accessExpired ? -1000 : 3600000), refreshToken: 'A'.repeat(43), refreshTokenExpiresAt: iso(7200000) });
  const payload = id => ({ snapshotVersion: 'bootstrap_snapshot_v2', contractVersion: 'control_plane_v2', configVersion: 1, issuedAt: iso(-1000), serverTime: iso(0), expiresAt: iso(3600000), offlineGraceUntil: iso(7200000), accessBasis, account: { id, status: 'ACTIVE' }, subscription: { state: 'NONE', planRevision: null }, devicePolicy: { status: 'ACTIVE' }, compatibility: { extension: { status: 'SUPPORTED', minimumVersion: null }, browser: { status: 'SUPPORTED' } }, entitlements: {}, features: {}, ai: { status: 'RESOLVED', detected: { family, surface: 'web', variant: null }, profile: { profileKey: 'review-profile', revision: 1, scopeVariant: null, schemaVersion: 'adapter_profile_v1', contentSha256: 'a'.repeat(64), content: {}, compatibility: {} } } });
  const sign = async p => {
    const bytes = Buffer.from(canonical(p));
    const signed = Buffer.concat([Buffer.from('product-control-plane/bootstrap-snapshot/v1\0'), Buffer.from(keyId), Buffer.from([0]), bytes]);
    const signature = await webcrypto.subtle.sign('Ed25519', pair.privateKey, signed);
    return { envelopeVersion: 'bootstrap_envelope_v2', algorithm: 'Ed25519', keyId, payload: bytes.toString('base64url'), signature: Buffer.from(signature).toString('base64url') };
  };
  let saved;
  if (account) {
    const p = payload(account), c = credentials(account);
    saved = { generation: 1, credentials: c, pending: null, rotation: null, authority: { verified: true, payload: p, envelope: await sign(p), deviceId: c.deviceId, sessionId: c.sessionId }, lastError: null };
  }
  const calls = [], tabs = [], notices = [], timers = new Set();
  const ctx = vm.createContext({ crypto: webcrypto, TextEncoder, TextDecoder, URL, Headers, atob, btoa, structuredClone, console });
  const inside = v => v === undefined ? undefined : vm.runInContext('JSON.parse', ctx)(JSON.stringify(v));
  ctx.chrome = { storage: { local: { async get() { return inside({ [K]: saved }); }, async set(data) { saved = clone(data[K]); }, async setAccessLevel() {} } }, tabs: { async create(o) { tabs.push(o.url); } } };
  ctx.setTimeout = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
  ctx.clearTimeout = t => { timers.delete(t); clearTimeout(t); };
  ctx.fetch = async (url, init) => {
    calls.push({ path: new URL(url).pathname, method: init.method, idempotency: init.headers.get('Idempotency-Key') });
    const value = await fetcher(new URL(url).pathname, init, { sign, payload, credentials });
    return { ok: value.status >= 200 && value.status < 300, status: value.status, headers: new Headers(value.headers || {}), async json() { return inside(value.body); } };
  };
  ctx.__SELLER_AGENTS_PACKAGED_CONFIG__ = JSON.stringify({ environment: 'LOCAL DEVELOPMENT', controlApiOrigin: 'http://127.0.0.1:43100', portalOrigin: 'http://127.0.0.1:43101', extensionVersion: '0.2.4', contractVersion: 'control_plane_v2', trustBundle: bundle });
  for (const name of ['config.js', 'crypto.js', 'client.js']) vm.runInContext(fs.readFileSync(path.join(root, 'packages/control-client/src', name), 'utf8'), ctx, { filename: name });
  const api = ctx.SellerAgentsControlClient;
  api.onAuthorityChanged((authority, reason, generation) => { notices.push({ reason, generation, account: authority?.payload.account.id }); });
  await api.restore();
  return { api, ctx, calls, tabs, notices, sign, payload, bundle, inside, saved: () => clone(saved), close() { for (const t of timers) clearTimeout(t); } };
}
const startBody = () => ({ status: 'pending', authorizationId: '44444444-4444-4444-8444-444444444444', deviceCode: 'D'.repeat(43), userCode: 'ABCD-EFGH', expiresAt: iso(600000) });

// F1: a response to a cancelled start resurrects the activation attempt.
{
  const entered = deferred(), reply = deferred(), token = deferred();
  const h = await harness({ fetcher: async route => {
    if (route === '/v1/device-authorizations') { entered.resolve(); return reply.promise; }
    return token.promise;
  } });
  const starting = h.api.startActivation();
  await entered.promise;
  await h.api.cancelActivation();
  assert.equal((await h.api.status()).pending, null);
  reply.resolve({ status: 201, body: startBody() });
  await starting;
  const after = await h.api.status();
  assert.ok(after.pending, 'published code reproduced: cancelled attempt returned');
  rows.push({ id: 'F1_CANCELLED_START_RESURRECTS', reproduced: true, pendingAfterCancel: !!after.pending, portalTabsOpenedAfterCancel: h.tabs.length, exchangeStartedAfterCancel: h.calls.some(x => x.path.endsWith('/token')) });
  h.close();
}

// F2: a known current-session bootstrap rejection leaves authorization usable.
{
  const h = await harness({ account: A, fetcher: async () => ({ status: 401, body: { error: { code: 'UNAUTHORIZED', message: 'Authentication required', correlationId: 'review' } } }) });
  let code;
  try { await h.api.bootstrap(); } catch (e) { code = e.code; }
  const status = await h.api.status();
  assert.equal(code, 'UNAUTHORIZED'); assert.equal(status.authenticated, true); assert.equal(status.workAllowed, true);
  rows.push({ id: 'F2_REJECTED_BOOTSTRAP_RETAINS_AUTHORITY', reproduced: true, responseCode: code, authenticatedAfterRejection: status.authenticated, workAllowedAfterRejection: status.workAllowed, invalidationEvents: h.notices.length });
  h.close();
}

// F3: invalid refresh response from A clears an already authenticated B session.
{
  const refreshEntered = deferred(), oldReply = deferred(), bReady = deferred();
  const h = await harness({ account: A, accessExpired: true, fetcher: async (route, init, helper) => {
    if (route === '/v1/auth/refresh') { refreshEntered.resolve(); return oldReply.promise; }
    if (route === '/v1/device-authorizations') return { status: 201, body: startBody() };
    if (route.endsWith('/token')) return { status: 200, body: { status: 'activated', ...helper.credentials(B), accessTokenExpiresAt: iso(3600000) } };
    if (route === '/v1/bootstrap') return { status: 200, body: await helper.sign(helper.payload(B)) };
    throw Error('Unexpected route');
  } });
  h.api.onAuthorityChanged((authority, reason) => { if (reason === 'bootstrap_verified' && authority.payload.account.id === B) bReady.resolve(); });
  const rotating = h.api.refresh().catch(e => e.code);
  await refreshEntered.promise;
  await h.api.localReset();
  await h.api.startActivation();
  await bReady.promise;
  assert.equal((await h.api.status()).accountId, B);
  oldReply.resolve({ status: 401, body: { error: { code: 'AUTH_REFRESH_INVALID', message: 'Authentication failed', correlationId: 'review' } } });
  assert.equal(await rotating, 'AUTH_REFRESH_INVALID');
  const after = await h.api.status();
  assert.equal(after.authenticated, false);
  rows.push({ id: 'F3_LATE_REFRESH_INVALID_LOGS_OUT_NEW_ACCOUNT', reproduced: true, newAccountWasAuthenticated: true, authenticatedAfterOldFailure: after.authenticated, finalError: after.lastError?.code });
  h.close();
}

// F4: a snapshot resolving another AI is accepted for an unrelated tab identity.
{
  const h = await harness({ account: A, family: 'chatgpt', fetcher: async () => { throw Error('Unexpected control request'); } });
  const result = await h.api.ensureForIdentity({ ai_id: 'alice', origin: 'https://alice.yandex.ru' });
  assert.equal(result.ai.detected.family, 'chatgpt');
  assert.equal(await h.api.canWork(), true);
  rows.push({ id: 'F4_UNBOUND_AI_POLICY_PERMITS_WORK', reproduced: true, requestedAi: 'alice', grantedSnapshotAi: result.ai.detected.family, accessBasis: result.accessBasis, workAllowed: await h.api.canWork(), profileContentIsEmpty: Object.keys(result.ai.profile.content).length === 0 });
  h.close();
}

// F5: every successful bootstrap signals full authority invalidation, even if
// the account/device/session and permitted policy did not change.
{
  const h = await harness({ account: A, fetcher: async (route, init, helper) => ({ status: 200, body: await helper.sign(helper.payload(A)) }) });
  await h.api.bootstrap();
  await h.api.bootstrap();
  assert.equal(h.notices.filter(x => x.reason === 'bootstrap_verified').length, 2);
  rows.push({ id: 'F5_UNCHANGED_BOOTSTRAP_INVALIDATION_CALLBACK', reproduced: true, sameAccount: true, invalidationCallbacks: h.notices.length, runtimeConsumer: 'saInvalidateAuthority finishes every active binding' });
  h.close();
}

// F6: bounds declared by the authoritative signed-envelope schema are omitted.
{
  const h = await harness({ fetcher: async () => { throw Error('Unexpected request'); } });
  const p = h.payload(A); p.ai.profile.content.large = 'x'.repeat(26000);
  const envelope = await h.sign(p);
  assert.ok(envelope.payload.length > 32768);
  const result = await h.ctx.SellerAgentsBootstrapVerifier.verifyV2(h.inside(envelope), h.inside(h.bundle));
  assert.equal(result.ok, true);
  rows.push({ id: 'F6_OVERSIZE_SIGNED_ENVELOPE_ACCEPTED', reproduced: true, actualPayloadEncodedLength: envelope.payload.length, acceptedSchemaMaximum: 32768 });
  h.close();
}
// F7: existing restart fixtures change the trust key but keep the old envelope.
{
  const minimal = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-i1-review-'));
  for (const name of ['config.js', 'crypto.js', 'client.js']) fs.copyFileSync(path.join(root, 'packages/control-client/src', name), path.join(minimal, name));
  fs.writeFileSync(path.join(minimal, 'service_worker_entry.js'), "importScripts('config.js','crypto.js','client.js');\n");
  const { makeWorker } = await import(pathToFileURL(path.join(root, 'tests/regression/extension-core/worker-harness.mjs')));
  const backing = { local: {}, session: {} };
  const first = await makeWorker(minimal, { backing });
  assert.equal(await first.call('SellerAgentsControlClient.currentAccount'), A);
  first.close();
  const second = await makeWorker(minimal, { backing });
  const status = await second.call('SellerAgentsControlClient.status');
  assert.equal(status.authenticated, false);
  assert.equal(status.lastError.code, 'STORED_AUTHORITY_INVALID_SIGNATURE');
  rows.push({ id: 'F7_RESTART_FIXTURE_REPLACES_TRUST_KEY', reproduced: true, sameBacking: true, authenticatedAfterRestart: status.authenticated, error: status.lastError.code, scope: 'original makeWorker with a minimal loader for the unmodified client modules' });
  second.close();
  fs.rmSync(minimal, { recursive: true, force: true });
}
// F8: a valid StableMachineIdentifier in the frozen contract is rejected.
{
  const h = await harness({ fetcher: async () => { throw Error('Unexpected request'); } });
  const p = h.payload(A); p.features['1flag'] = true;
  assert.ok(/^[a-z0-9][a-z0-9._-]*$/.test('1flag'));
  const result = await h.ctx.SellerAgentsBootstrapVerifier.verifyV2(h.inside(await h.sign(p)), h.inside(h.bundle));
  assert.equal(result.error, 'INVALID_PAYLOAD_SCHEMA');
  rows.push({ id: 'F8_VALID_CONTRACT_IDENTIFIER_REJECTED', reproduced: true, validServerIdentifier: '1flag', clientError: result.error });
  h.close();
}
fs.writeFileSync(path.join(import.meta.dirname, 'reproduction-results.json'), JSON.stringify({ head: '2a98057646af52eee0f654997b3f60f6322dfb04', method: 'Unmodified source modules, Node VM, controlled API responses, ephemeral Ed25519 keys; not live/installed acceptance', findings: rows }, null, 2) + '\n');
console.log(JSON.stringify(rows, null, 2));
