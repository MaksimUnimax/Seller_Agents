import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { webcrypto, createHash } from 'node:crypto';

// Independent review probes: assertions intentionally detect candidate defects.
// Controlled HTTP replies and disposable fixture signing keys; no live service.
const HEAD = '9e80e8ad531f079b38bf03b9e29f171c87c477c0';
const root = path.resolve(process.env.SA_REVIEW_REPOSITORY || path.join(import.meta.dirname, 'snapshot'));
const runtime = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-r1-review-'));
const K = 'seller_agents_control_auth_v2';
const A = '11111111-1111-4111-8111-111111111111';
const B = '55555555-5555-4555-8555-555555555555';
const clone = value => structuredClone(value);
const iso = delta => new Date(Date.now() + delta).toISOString();
const defer = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const flush = async () => { await new Promise(setImmediate); await new Promise(setImmediate); };
const canonical = value => value === null || typeof value !== 'object' ? JSON.stringify(value) : Array.isArray(value) ? '[' + value.map(canonical).join(',') + ']' : '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const rows = [];
const hashes = {};
for (const name of ['config.js', 'crypto.js', 'client.js']) {
  const relative = 'packages/control-client/src/' + name;
  const bytes = fs.readFileSync(path.join(root, relative));
  hashes[relative] = createHash('sha256').update(bytes).digest('hex');
  fs.writeFileSync(path.join(runtime, name), bytes);
}
fs.writeFileSync(path.join(runtime, 'service_worker_entry.js'), "importScripts('config.js','crypto.js','client.js');\n");
const { makeWorker, until } = await import(pathToFileURL(path.join(root, 'tests/regression/extension-core/worker-harness.mjs')));

async function harness(fetcher, { expired = false } = {}) {
  const backing = { local: {}, session: {} }, calls = [];
  let h;
  const w = await makeWorker(runtime, { backing, fetch: async (url, init) => {
    const route = new URL(url).pathname;
    calls.push({ route, authorization: init.headers.get('Authorization') });
    return fetcher(route, init, h);
  }});
  if (expired) backing.local[K].credentials.accessTokenExpiresAt = iso(-1000);
  const template = clone(backing.local[K]);
  const sign = async payload => {
    const key = await webcrypto.subtle.importKey('pkcs8', Buffer.from(backing.local.__seller_agents_fixture_signing_key.privateKey, 'base64'), { name: 'Ed25519' }, false, ['sign']);
    const bytes = Buffer.from(canonical(payload));
    const signature = await webcrypto.subtle.sign('Ed25519', key, Buffer.concat([Buffer.from('product-control-plane/bootstrap-snapshot/v1\0fixture-key\0'), bytes]));
    return { envelopeVersion: 'bootstrap_envelope_v2', algorithm: 'Ed25519', keyId: 'fixture-key', payload: bytes.toString('base64url'), signature: Buffer.from(signature).toString('base64url') };
  };
  h = { w, backing, template, calls, sign, async bootstrapReply(change = () => {}) {
    const p = clone(template.authority.payload); change(p);
    p.ai.profile.contentSha256 = createHash('sha256').update(canonical({ content: p.ai.profile.content, compatibility: p.ai.profile.compatibility })).digest('hex');
    return reply(await sign(p));
  }};
  await w.call('SellerAgentsControlClient.restore');
  assert.equal(await w.call('SellerAgentsControlClient.canWork'), true, 'valid starting authority');
  return h;
}
const start = () => ({ status: 'pending', authorizationId: '44444444-4444-4444-8444-444444444444', deviceCode: 'D'.repeat(43), userCode: 'ABCD-EFGH', expiresAt: iso(600000) });
async function activationReply(route, _init, h) {
  if (route === '/v1/device-authorizations') return reply(start(), 201);
  if (route.endsWith('/token')) return reply({ status: 'activated', ...h.template.credentials, accessTokenExpiresAt: iso(3600000) });
  if (route === '/v1/bootstrap') return h.bootstrapReply();
  throw Error('Unexpected route: ' + route);
}
try {
  {
    const h = await harness(activationReply);
    try {
      await h.w.call('SellerAgentsControlClient.localReset');
      await h.w.call('SellerAgentsControlClient.startActivation');
      await until(async () => (await h.w.call('SellerAgentsControlClient.status')).authenticated, 'first login');
      await flush();
      await h.w.call('SellerAgentsControlClient.localReset');
      await h.w.call('SellerAgentsControlClient.startActivation');
      await flush();
      const status = await h.w.call('SellerAgentsControlClient.status');
      const exchanges = h.calls.filter(c => c.route.endsWith('/token')).length;
      assert.equal(exchanges, 1); assert.ok(status.pending); assert.equal(status.authenticated, false);
      rows.push({ id: 'R1_SECOND_LOGIN_NEVER_POLLS', defectReproduced: true, starts: h.calls.filter(c => c.route === '/v1/device-authorizations').length, exchanges, secondPending: true });
    } finally { h.w.close(); }
  }
  {
    const h = await harness(async (route, init, h) => {
      if (route === '/v1/auth/refresh') return reply({ ...h.template.credentials, accessToken: 'review_rotated_access_token' });
      if (route === '/v1/bootstrap' && init.headers.get('Authorization') === 'Bearer review_rotated_access_token') return h.bootstrapReply();
      return reply({ error: { code: 'UNAUTHORIZED' } }, 401);
    });
    try {
      await assert.rejects(h.w.call('SellerAgentsControlClient.bootstrap'), e => e.code === 'UNAUTHORIZED');
      const status = await h.w.call('SellerAgentsControlClient.status');
      assert.equal(h.calls.filter(c => c.route === '/v1/auth/refresh').length, 0);
      assert.equal(h.calls.length, 2); assert.equal(status.authenticated, false);
      rows.push({ id: 'R1_401_RETRY_SKIPS_REFRESH', defectReproduced: true, bootstrapRequests: 2, refreshRequests: 0, sameRejectedAccessTokenTwice: h.calls[0].authorization === h.calls[1].authorization, finalAuthorityCleared: true });
    } finally { h.w.close(); }
  }
  for (const kind of ['signed_maintenance', 'invalid_signature']) {
    const h = await harness(async (_route, _init, h) => {
      if (kind === 'signed_maintenance') return h.bootstrapReply(p => { p.compatibility.browser.status = 'MAINTENANCE'; });
      const envelope = await h.sign(clone(h.template.authority.payload));
      envelope.signature = Buffer.alloc(64).toString('base64url'); return reply(envelope);
    });
    try {
      let code; try { await h.w.call('SellerAgentsControlClient.bootstrap'); } catch (e) { code = e.code; }
      assert.ok(code); assert.equal(await h.w.call('SellerAgentsControlClient.canWork'), true);
      const before = h.calls.length;
      await h.w.call('SellerAgentsControlClient.ensureForIdentity', { ai_id: 'chatgpt', origin: 'https://chatgpt.com' });
      assert.equal(h.calls.length, before);
      rows.push({ id: 'R1_' + kind.toUpperCase() + '_RETAINS_WORK', defectReproduced: true, error: code, workAllowedAfterRejection: true, nextEnsureUsesOldAuthorityWithoutRequest: true });
    } finally { h.w.close(); }
  }
  {
    const h = await harness(async (_route, _init, h) => h.bootstrapReply(p => { p.ai.profile.compatibility.minimumExtensionVersion = '0.99.0'; }));
    try {
      await h.w.call('SellerAgentsControlClient.bootstrap');
      assert.equal(await h.w.call('SellerAgentsControlClient.canWork'), true);
      rows.push({ id: 'R1_PROFILE_MINIMUM_MINOR_VERSION_BYPASSED', defectReproduced: true, installedVersion: '0.2.4', signedMinimumVersion: '0.99.0', workAllowed: true });
    } finally { h.w.close(); }
  }
  // Bounded controls for prior findings; these are not installed acceptance.
  {
    const entered = defer(), held = defer();
    const h = await harness(async route => { assert.equal(route, '/v1/device-authorizations'); entered.resolve(); return held.promise; });
    try {
      await h.w.call('SellerAgentsControlClient.localReset');
      const starting = h.w.call('SellerAgentsControlClient.startActivation');
      await entered.promise; await h.w.call('SellerAgentsControlClient.cancelActivation');
      held.resolve(reply(start(), 201)); await starting; await flush();
      assert.equal((await h.w.call('SellerAgentsControlClient.status')).pending, null);
      assert.equal(h.w.portalTabs.length, 0);
      rows.push({ id: 'F1_CANCELLED_START', controlPassed: true });
    } finally { h.w.close(); }
  }
  {
    const entered = defer(), held = defer();
    const h = await harness(async (route, init, h) => {
      if (route === '/v1/auth/refresh') { entered.resolve(); return held.promise; }
      if (route === '/v1/bootstrap') return h.bootstrapReply(p => { p.account.id = B; });
      return activationReply(route, init, h);
    }, { expired: true });
    try {
      const refreshing = h.w.call('SellerAgentsControlClient.refresh').catch(e => e.code);
      await entered.promise; await h.w.call('SellerAgentsControlClient.localReset');
      await h.w.call('SellerAgentsControlClient.startActivation');
      await until(async () => (await h.w.call('SellerAgentsControlClient.status')).accountId === B, 'same worker new account');
      held.resolve(reply({ error: { code: 'AUTH_REFRESH_INVALID' } }, 401));
      assert.equal(await refreshing, 'AUTH_REFRESH_INVALID');
      assert.equal((await h.w.call('SellerAgentsControlClient.status')).accountId, B);
      rows.push({ id: 'F3_OLD_REFRESH_PRESERVES_NEW_ACCOUNT_SAME_WORKER', controlPassed: true });
    } finally { h.w.close(); }
  }
  {
    const h = await harness(async (_route, _init, h) => h.bootstrapReply());
    try {
      await h.w.call('(()=>{globalThis.reviewNotices=[];SellerAgentsControlClient.onAuthorityChanged((a,r,g)=>reviewNotices.push({reason:r,generation:g}));})');
      await h.w.call('SellerAgentsControlClient.bootstrap'); await h.w.call('SellerAgentsControlClient.bootstrap');
      assert.equal((await h.w.call('(()=>reviewNotices)')).length, 0);
      rows.push({ id: 'F5_COMPATIBLE_BOOTSTRAP_NO_INVALIDATION_CALLBACK', controlPassed: true });
      const p = clone(h.template.authority.payload); p.features['1flag'] = true;
      const check = envelope => h.w.call('((e)=>SellerAgentsBootstrapVerifier.verifyV2(e,SellerAgentsControlConfig.trustBundle))', envelope);
      assert.equal((await check(await h.sign(p))).ok, true);
      rows.push({ id: 'F8_DIGIT_FIRST_IDENTIFIER', controlPassed: true });
      p.ai.profile.content.large = 'x'.repeat(26000);
      const large = await h.sign(p); assert.ok(large.payload.length > 32768);
      assert.equal((await check(large)).ok, false);
      rows.push({ id: 'F6_OVERSIZED_ENVELOPE_REJECTED', controlPassed: true });
      const restart = await makeWorker(runtime, { backing: h.backing });
      try { assert.equal((await restart.call('SellerAgentsControlClient.status')).authenticated, true); }
      finally { restart.close(); }
      rows.push({ id: 'F7_RESTART_SAME_BACKING', controlPassed: true });
    } finally { h.w.close(); }
  }
  fs.writeFileSync(path.join(import.meta.dirname, 'reproduction-results.json'), JSON.stringify({ head: HEAD, method: 'Unmodified published client modules; published makeWorker support; independent scenarios; Node VM, controlled HTTP, disposable WebCrypto Ed25519 keys. Not live or installed acceptance.', sourceSha256: hashes, observations: rows }, null, 2) + '\n');
  console.log(JSON.stringify(rows, null, 2));
} finally { fs.rmSync(runtime, { recursive: true, force: true }); }
