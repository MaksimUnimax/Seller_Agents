import assert from 'node:assert/strict';
import path from 'node:path';
import { makeWorker, until } from './worker-harness.mjs';
const runtime = path.resolve(process.argv[2]);
const results = [];
async function test(id, fn) { await fn(); results.push({ id, status: 'PASS' }); }
const wb = token => ({ marketplace: 'wildberries', credentials: { token }, personalDataEnabled: true });
const ozon = (id, key) => ({ marketplace: 'ozon', credentials: { seller: { clientId: id, apiKey: key } }, personalDataEnabled: true });
const fixtureToken = 'FIXTURE_PERSONAL_WB_NEVER_REAL';
const api = 'WB_API_V1 {"operation":"seller_info","params":{}}';
const plain = x => JSON.parse(JSON.stringify(x));
function fakeIDB() {
  const records = new Map();
  return { records, open() {
    const request = {};
    queueMicrotask(() => { request.result = { objectStoreNames: { contains: () => true }, close() {}, transaction() {
      const tx = { objectStore() { const op = (kind, value) => {
        const r = {};
        queueMicrotask(() => { if (kind === 'put') records.set(value.artifact_key, value);
          if (kind === 'delete') records.delete(value);
          r.result = kind === 'get' ? records.get(value) : kind === 'all' ? [...records.values()] : value?.artifact_key;
          r.onsuccess?.(); queueMicrotask(() => tx.oncomplete?.()); }); return r;
      }; return { get: k => op('get', k), put: v => op('put', v), delete: k => op('delete', k), getAll: () => op('all') }; } }; return tx;
    } }; request.onsuccess?.(); }); return request;
  } };
}
async function setup(options = {}) {
  const idb = fakeIDB();
  const worker = await makeWorker(runtime, { indexedDB: idb, fetch: async (url, init, n) => options.fetch ? options.fetch(url, init, n) : new Response('{"result":{"value":42}}', { headers: { 'content-type': 'application/json' } }), ...options });
  const popup = (type, fields = {}) => worker.popup({ type, tab_id: worker.tabId, ...fields });
  const initial = await popup('SA_POPUP_STATE'); assert.equal(initial.ok, true, JSON.stringify(initial));
  async function save(store) { const r = await popup('SA_STORE_SAVE', { store }); assert.equal(r.ok, true, JSON.stringify(r)); return r.store; }
  async function start(store, { tabId = worker.tabId, identity = worker.identity, sender, confirm = false } = {}) {
    const r = await popup('SA_WORK_START', { tab_id: tabId, store_id: store.id, confirm_change: confirm });
    assert.equal(r.ok, true, JSON.stringify(r));
    if (r.accepted === false) return r;
    const pending = await until(async () => { const p = (await worker.call('getPendingWorkStarts'))[tabId]; return p?.send_outcome === 'sent_acknowledged' && p; }, 'application Start send acknowledgement');
    const active = await worker.request({ type: 'OZ_WORK_PENDING_IDENTITY', identity, intent_id: pending.intent_id, revision: pending.revision, first_response_complete: true }, sender);
    assert.equal(active.ok, true, JSON.stringify(active));
    return { key: active.binding.conversation_key, session: active.session, identity, sender, tabId };
  }
  async function execute(started, source = api, requestId = 'explicit-fixture-block') {
    const r = await worker.request({ type: 'OZ_EXECUTE_COMMAND', conversation_key: started.key, command_text: source,
      manual_request_id: requestId, work_session_id: started.session.start_intent_id }, started.sender);
    assert.equal(r.ok, true, JSON.stringify(r)); return r;
  }
  async function collected(started) { return until(async () => { const o = await worker.call('getManualOperation', started.key); if (o?.status === 'failed') throw new Error(JSON.stringify(o.last_error)); return o?.status === 'delivering' && o; }, 'application result collected'); }
  async function deliver(started, owner) {
    const fields = { owner_kind: 'manual', owner_id: owner.operation_id, conversation_key: started.key, delivery_id: owner.delivery_id, actor_id: 'fixture-content' };
    const commit = await worker.request({ type: 'OZ_BATCH_DELIVERY_INSERT_COMMIT', ...fields }, started.sender);
    assert.equal(commit.insert_allowed, true, JSON.stringify(commit));
    const inserted = await worker.request({ type: 'OZ_BATCH_DELIVERY_INSERTED', ...fields }, started.sender);
    assert.equal(inserted.ok, true, JSON.stringify(inserted));
    const send = await worker.request({ type: 'OZ_WORK_SEND_COMMIT', ...fields }, started.sender);
    assert.equal(send.click_allowed, true, JSON.stringify(send));
    const twice = await worker.request({ type: 'OZ_WORK_SEND_COMMIT', ...fields }, started.sender);
    assert.equal(twice.click_allowed, false);
    const done = await worker.request({ type: 'OZ_BATCH_DELIVERY_COMPLETE', ...fields, delivery_confirmed: true, confirmation_basis: 'microphone' }, started.sender);
    assert.equal(done.ok, true, JSON.stringify(done));
    assert.equal((await worker.call("getManualOperation", started.key)).status, "completed");
    return fields;
  }
  return { worker, idb, popup, save, start, execute, collected, deliver };
}
await test('APP-01-popup-sender-catalog-names-and-secret-isolation', async () => {
  const s = await setup(); try {
    const denied = await s.worker.request({ type: 'SA_STORE_SAVE', store: wb(fixtureToken) }); assert.equal(denied.code, 'POPUP_SENDER_REQUIRED');
    const a = await s.save(wb(fixtureToken)), b = await s.save(wb('FIXTURE_SECOND'));
    assert.equal(a.name, 'WB 1'); assert.equal(b.name, 'WB 2'); assert.notEqual(a.id, b.id);
    const renamed = await s.save({ id: a.id, marketplace: a.marketplace, name: 'Новый магазин', personalDataEnabled: true });
    assert.equal(renamed.id, a.id); assert.equal(renamed.credentialRevision, a.credentialRevision);
    const state = await s.popup('SA_POPUP_STATE'); assert.ok(!JSON.stringify(state).includes(fixtureToken));
    assert.equal(s.worker.network.length, 0);
  } finally { s.worker.close(); }
});
await test('APP-02-real-WB-Start-HELP-API-common-text-delivery-durable-send-no-replay', async () => {
  const s = await setup(); try {
    const store = await s.save(wb(fixtureToken)), started = await s.start(store);
    assert.ok(s.worker.messages.find(x => x.prompt_text)?.prompt_text.includes('WB_HELP_V1'));
    await s.execute(started, 'WB_HELP_V1 {"operation":"describe","params":{"alias":"seller_info"}}\n'+api);
    const owner = await s.collected(started); assert.equal(s.worker.network.length, 1);
    assert.ok(owner.outgoing_text.startsWith('WB_BATCH_RESULT_V1')); assert.ok(owner.outgoing_text.includes(store.id));
    assert.deepEqual(plain(owner.batch.entries.map(x => x.kind)), ['guidance','command']);
    assert.equal(owner.execution_context.storeId, store.id);
    assert.ok(!JSON.stringify(owner).includes(fixtureToken));
    await s.deliver(started, owner);
    const duplicate = await s.worker.request({ type: 'OZ_EXECUTE_COMMAND', conversation_key: started.key, command_text: api, manual_request_id: 'explicit-fixture-block', work_session_id: started.session.start_intent_id });
    assert.equal(duplicate.code, 'MANUAL_REQUEST_DUPLICATE'); assert.equal(s.worker.network.length, 1);
  } finally { s.worker.close(); }
});
await test('APP-03-two-WB-stores-two-dialogues-pinned-credentials-and-Ozon', async () => {
  const seen = [];
  const s = await setup({ fetch: async (url, init) => { seen.push({ url, headers: init.headers }); return new Response('{"result":[]}', { headers: { 'content-type': 'application/json' } }); } }); try {
    const a = await s.save(wb(fixtureToken)), b = await s.save(wb('FIXTURE_TOKEN_B'));
    const first = await s.start(a), tab = s.worker.addTab(78, 'second-dialogue');
    const second = await s.start(b, { tabId: 78, ...tab });
    await Promise.all([s.execute(first), s.execute(second)]);
    await Promise.all([s.collected(first), s.collected(second)]);
    assert.deepEqual(seen.map(x=>x.headers.Authorization).sort(), ['Bearer '+fixtureToken, 'Bearer FIXTURE_TOKEN_B'].sort());
    const o = await s.save(ozon('FIXTURE_OZON_CLIENT', 'FIXTURE_OZON_KEY'));
    const thirdTab = s.worker.addTab(79, 'ozon-dialogue');
    const third = await s.start(o, { tabId: 79, ...thirdTab });
    await s.execute(third, 'OZON_API_V1 {"operation":"roles","params":{}}');
    const oo = await s.collected(third);
    assert.equal(oo.execution_context.marketplace, 'ozon');
    assert.equal(seen.at(-1).headers['Client-Id'], 'FIXTURE_OZON_CLIENT');
  } finally { s.worker.close(); }
});
await test('APP-04-Hide-does-not-stop-inflight-tail-or-delivery-Finish-does', async () => {
  let release, arrived;
  const entered = new Promise(r => arrived = r), wait = new Promise(r => release = r);
  const s = await setup({ fetch: async () => { arrived(); await wait; return new Response('{}', { headers: { 'content-type': 'application/json' } }); } }); try {
    const start = await s.start(await s.save(wb(fixtureToken))); await s.execute(start, api+'\n'+api);
    await entered;
    assert.equal((await s.popup('OZ_WORK_HIDE', { conversation_key: start.key })).ok, true);
    release(); const owner = await s.collected(start); assert.equal(s.worker.network.length, 2);
    await s.deliver(start, owner);
    assert.equal((await s.popup('OZ_WORK_FINISH', { conversation_key: start.key })).ok, true);
    const late = await s.worker.request({ type: 'OZ_WORK_DELIVERY_ASSERT', conversation_key: start.key, owner_id: owner.operation_id, delivery_id: owner.delivery_id }); assert.equal(late.ok, false);
  } finally { release?.(); s.worker.close(); }
});
await test('APP-05-confirmed-switch-rotated-credentials-and-delete-stop-late-provider', async () => {
  let release, arrived;
  const entered = new Promise(r => arrived = r), wait = new Promise(r => release = r);
  const s = await setup({ fetch: async () => { arrived(); await wait; return new Response('{}', { headers: { 'content-type': 'application/json' } }); } }); try {
    const a = await s.save(wb(fixtureToken)), b = await s.save(wb('FIXTURE_NEW_STORE'));
    const first = await s.start(a); await s.execute(first, api+'\n'+api); await entered;
    const rejected = await s.popup('SA_WORK_START', { store_id: b.id }); assert.equal(rejected.code, 'STORE_CHANGE_CONFIRMATION_REQUIRED');
    const next = await s.start(b, { confirm: true });
    release(); await new Promise(r=>setTimeout(r,30));
    assert.equal(s.worker.network.length, 1);
    assert.equal((await s.worker.call('bindingForConversationKey', next.key)).store_context.storeId, b.id);
    assert.equal(s.worker.messages.filter(m=>m.type==='OZ_BATCH_DELIVERY_AVAILABLE').length,0);
    const renamed = await s.save({ id:b.id, name:'Rename', marketplace:'wildberries', personalDataEnabled:true });
    assert.equal((await s.worker.call('workSessionFor', next.key)).state,'active_visible');
    await s.save({ id:renamed.id, marketplace:'wildberries', credentials:{token:'FIXTURE_ROTATED'}, personalDataEnabled:true });
    assert.equal((await s.worker.call('workSessionFor', next.key)).state,'inactive');
    const again = await s.start(renamed);
    await s.popup('SA_STORE_DELETE',{store_id:b.id,confirm:true});
    assert.equal((await s.worker.call('workSessionFor',again.key)).state,'inactive');
    assert.ok(!JSON.stringify((await s.popup('SA_POPUP_STATE')).stores).includes(b.id));
  } finally { release?.(); s.worker.close(); }
});
await test('APP-06-TTL-recovery-no-renewal-and-legacy-autorun-disabled', async () => {
  const s = await setup(); try {
    const start = await s.start(await s.save(wb(fixtureToken))); await s.execute(start);
    const owner = await s.collected(start);
    const keys = await s.worker.call('(() => OzonRuntime.STORAGE_KEYS)');
    s.worker.backing.local[keys.MANUAL_OPERATIONS][start.key].payload_expires_at_ms = Date.now()-1;
    const expired = await s.worker.call('getManualOperation', start.key);
    assert.equal(expired.last_error.code,'RESULT_EXPIRED'); assert.equal(expired.outgoing_text,null); assert.equal(expired.batch,null);
    assert.equal((await s.worker.request({ type:'OZ_WORK_DELIVERY_ASSERT',conversation_key:start.key,owner_id:owner.operation_id,delivery_id:owner.delivery_id })).ok,false);
    assert.equal((await s.popup('OZ_AUTO_START',{conversation_key:start.key})).code,'LEGACY_ACTION_DISABLED');
    assert.equal(s.worker.network.length,1);
  } finally { s.worker.close(); }
});
await test('APP-07-binary-original-file-common-attachment-port-and-expiry', async () => {
  const bytes = new Uint8Array([37,80,68,70,45,49,10,0,255]);
  const s = await setup({ fetch: async () => new Response(bytes,{ headers: {'content-type':'application/pdf','content-disposition':'attachment; filename="original-report.pdf"'} }) }); try {
    s.worker.setDialogue('11111111-1111-4111-8111-111111111111');
    const store = await s.save(wb(fixtureToken)), start = await s.start(store);
    const ref = await s.worker.call('(() => SellerAgentsWBReference.contract)');
    const meta = Object.values(ref.OPERATIONS).find(m=>m.response_mode==='binary'&&m.execution_enabled&&m.privacy==='standard');
    assert.ok(meta);
    const params = { path:Object.fromEntries([...meta.path.matchAll(/\{([^}]+)\}/g)].map(m=>[m[1],'fixture'])),query:Object.fromEntries(meta.required_query_keys.map(k=>[k,'1'])),...(meta.body_required?{body:{}}:{}) };
    await s.execute(start,'WB_API_V1 '+JSON.stringify({operation:meta.alias,params}));
    const owner=await s.collected(start);
    assert.equal(owner.delivery.mode,'attachment_watch_v1');
    const fields={owner_kind:'manual',owner_id:owner.operation_id,conversation_key:start.key,delivery_id:owner.delivery_id,actor_id:'fixture-attachment'};
    const commit=await s.worker.portRequest({type:'OZ_ATTACHMENT_COMMIT',...fields}); assert.equal(commit.attach_allowed,true,JSON.stringify(commit));
    const descriptor=commit.recovery.artifact_descriptors.find(d=>d.source_kind==='original_provider_file'); assert.equal(descriptor.filename,'original-report.pdf');
    const chunk=await s.worker.portRequest({type:'OZ_ATTACHMENT_ARTIFACT_CHUNK',...fields,artifact_key:descriptor.artifact_key});
    assert.deepEqual(Buffer.from(chunk.chunk_base64,'base64'),Buffer.from(bytes));
    const record=s.idb.records.get(descriptor.artifact_key); record.expires_at_ms=Date.now()-1;
    const late=await s.worker.portRequest({type:'OZ_ATTACHMENT_ARTIFACT_CHUNK',...fields,artifact_key:descriptor.artifact_key}); assert.equal(late.ok,false);
    assert.equal(s.worker.network.length,1);
  } finally { s.worker.close(); }
});
await test('APP-08-account-catalog-isolation-and-await-account-change', async () => {
  const s = await setup(); try {
    const api = await s.worker.call('(() => SellerAgentsStoreCatalog)');
    let account = 'fixture-account-A', serial = 0, backing = {}, flip = false;
    const catalog = api.create({ read: async key => { if (flip) account = 'fixture-account-B'; return { [key]: backing[key] }; },
      write: async value => Object.assign(backing, plain(value)), currentAccount: async () => account,
      normalizeCredentials: (_marketplace, value, old) => value.token ? value : old,
      revision: async (_marketplace, value) => value.token, uuid: () => 'fixture-'+(++serial) });
    const a = await catalog.save({ marketplace:'wildberries',credentials:{token:'fixture-A'} });
    account = 'fixture-account-B';assert.equal((await catalog.list()).length,0);await assert.rejects(catalog.get(a.id));
    account = 'fixture-account-A';assert.equal((await catalog.list())[0].id,a.id);
    flip = true;await assert.rejects(catalog.list(),/ACCOUNT_CHANGED/);
  } finally { s.worker.close(); }
});
await test('APP-09-Ozon-local-file-reference-is-owned-by-store-not-name-or-dialogue', async () => {
  const s = await setup(); try {
    const a = await s.save(ozon('FIXTURE_CLIENT_A','FIXTURE_KEY_A'));
    const b = await s.save(ozon('FIXTURE_CLIENT_B','FIXTURE_KEY_B'));
    const first = await s.start(a), tab = s.worker.addTab(78,'second-ozon-dialogue');
    const second = await s.start(b,{tabId:78,...tab});
    const ref='rpf_s_FIXTURE_STORE_A_ONLY';
    const makeGuard = await s.worker.call('(() => async (key) => { const p=await captureBatchContext(key, "fixture", "fixture-ref"); return {snapshot:p,assertCurrent:async()=>{}}; })');
    const guardA = await makeGuard(first.key), guardB = await makeGuard(second.key);
    const remember = await s.worker.call('(() => saRememberOzonFileRefs)'), check = await s.worker.call('(() => saCheckOzonFileRef)');
    await remember({report_text:'OZON_RESULT_V1\n'+JSON.stringify({result:{report_file_ref:ref}})},guardA);
    await check({operation:'report_file_get',params:{file_ref:ref}},guardA);
    await assert.rejects(check({operation:'report_file_get',params:{file_ref:ref}},guardB),/REPORT_FILE_STORE_MISMATCH/);
    assert.equal(s.worker.network.length,0);
  } finally { s.worker.close(); }
});
console.log(JSON.stringify({ status:'PASS', results, live_provider_calls:0, scope:'actual generated worker/popup messages and attachment port; simulated browser and provider; not installed live acceptance' },null,2));
