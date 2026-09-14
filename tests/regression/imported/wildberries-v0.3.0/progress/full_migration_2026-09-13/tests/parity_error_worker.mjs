// Ozon-derived admission/result contract exercised through the real WB worker.
// Only Chrome storage/tab APIs and fetch are mocked. No real provider networking.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
fs.mkdirSync(out,{recursive:false});const fd=fs.openSync(path.join(out,'results.jsonl'),'wx'),rows=[];
const identity={origin:'https://chatgpt.com',ai_id:'chatgpt',conversation_id:'11111111-1111-1111-1111-111111111111',status:'confirmed',source:'synthetic-fixture'};
const key=identity.origin+'|'+identity.conversation_id;
const api=(operation='seller_info',params={})=>'WB_API_V1\n'+JSON.stringify({operation,params});
const help=(operation='catalog',params={})=>'WB_HELP_V1\n'+JSON.stringify({operation,params});
function fixture(){const binding={...identity,binding_id:'fixture-binding',revision:1,conversation_key:key};return {
 wbmb_seller_token:'offline-fixture-token',wbmb_auto_send:true,wbmb_conversation_bindings:{[key]:binding},
 wbmb_manual_modes:{[key]:true},wbmb_auto_runs:{},
 ['wb_work_session_v1:'+key]:{state:'active_visible',conversation_key:key,revision:2,tab_id:1,...identity}
};}
function boot(data=fixture()){
 let listener;const count={calls:0},messages=[];
 const tab={id:1,url:'https://chatgpt.com/c/'+identity.conversation_id};
 const sandbox={URL,URLSearchParams,TextEncoder,TextDecoder,AbortController,Headers,Response,Uint8Array,crypto:crypto.webcrypto,setTimeout,clearTimeout,console,btoa:s=>Buffer.from(s,'binary').toString('base64')};
 sandbox.chrome={runtime:{lastError:null,getURL:p=>'chrome-extension://fixture/'+p,onMessage:{addListener:f=>listener=f}},
 storage:{local:{async get(keys){if(keys===null)return structuredClone(data);return Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(data[k])]))},async set(v){Object.assign(data,structuredClone(v))},async remove(ks){for(const k of Array.isArray(ks)?ks:[ks])delete data[k]}}},
 tabs:{async get(){return tab},async query(){return [tab]},sendMessage(id,m,cb){messages.push(m);queueMicrotask(()=>cb(m.type==='WB_GET_IDENTITY'?{ok:true,identity}: {ok:false,code:'SYNTHETIC_UI_UNAVAILABLE'}))}}};
 sandbox.fetch=async()=>{count.calls++;return new Response('{"fixture":"provider success"}',{status:200,headers:{'Content-Type':'application/json'}})};
 const context=vm.createContext(sandbox);
 sandbox.importScripts=(...files)=>{for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f,timeout:3000})};
 vm.runInContext(fs.readFileSync(path.join(root,'service_worker.js'),'utf8'),context,{filename:'service_worker.js',timeout:3000});
 return {context,count,data,messages,async send(text,request='fresh-attempt'){
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('HARNESS_TIMEOUT')),5000);listener({type:'WB_EXECUTE_COMMAND',conversation_key:key,manual_request_id:request,command_text:text},{tab,frameId:0,url:tab.url},r=>{clearTimeout(timer);resolve(r)})});
 }};
}
async function test(id,fn){let row;try{row={id,status:'PASS',detail:await fn()}}catch(e){row={id,status:'FAIL',error:e.message,stack:e.stack}}rows.push(row);fs.writeSync(fd,JSON.stringify(row)+'\n');fs.fsyncSync(fd);console.log(id,row.status,row.error||'');}
function payload(response){assert.equal(typeof response.report_text,'string','A command failure must have a structured chat report, not just error/toast');assert.ok(response.report_text.startsWith('WB_RESULT_V1\n'));return JSON.parse(response.report_text.slice('WB_RESULT_V1\n'.length));}
function assertLocal(w,r,code){const p=payload(r);assert.equal(r.ok,false);assert.equal(r.bridge_error,true);assert.equal(r.pre_execution_error,true);assert.equal(p.bridge_error,true);assert.equal(p.pre_execution_error,true);assert.equal(p.http_status,0);assert.equal(p.request_meta.physical_request_count,0);assert.equal(p.request_meta.external_request_executed,false);assert.equal(p.request_meta.automatic_retry,false);assert.equal(w.count.calls,0);assert.ok(p.batch.items.some(i=>i.code===code),JSON.stringify(p));const op=w.data.wbmb_manual_operations?.[key];assert.ok(op,'The local rejection must have a durable manual owner');assert.equal(op.status,'delivering');assert.equal(op.delivery_confirmed,false);assert.equal(op.outgoing_text,r.outgoing_text||r.report_text);assert.equal(op.tab_id,1);assert.equal(op.conversation_key,key);assert.ok(op.command_batch?.sha256);assert.ok(!JSON.stringify(p).includes('offline-fixture-token'));return {code,physical_requests:0,durable_owner:true,report_ready_for_content:true};}
const cases=[
 ['unknown',api('definitely_unknown_operation'),'UNSUPPORTED_OPERATION'],
 ['disabled',api('subscriptions'),'OPERATION_BLOCKED'],
 ['malformed-json','WB_API_V1 {','INVALID_JSON'],
 ['missing-json','WB_API_V1','MISSING_JSON'],
 ['top-level-field','WB_API_V1 {"operation":"seller_info","params":{},"headers":{"Authorization":"PRIVATE-SECRET"}}','UNKNOWN_COMMAND_FIELD'],
 ['params-injection',api('seller_info',{url:'https://example.invalid/PRIVATE-SECRET'}),'TRANSPORT_INJECTION_REJECTED'],
 ['invalid-help',help('unknown_help'),'HELP_UNSUPPORTED_OPERATION']
];
for(const [id,text,code] of cases)await test('PREEXEC:'+id,async()=>{const w=boot(),r=await w.send(text);const d=assertLocal(w,r,code);assert.equal(JSON.stringify(r).includes('PRIVATE-SECRET'),false);return d;});

await test('ORDERED:mixed-help-api',async()=>{const w=boot(),r=await w.send(help()+'\n'+api());const p=payload(r);assert.equal(r.ok,true,JSON.stringify(r));assert.deepEqual(p.batch.items.map(i=>i.kind),['help','api']);assert.equal(w.count.calls,1);assert.equal(p.request_meta.physical_request_count,1);return {ordered:true,calls:1}});
await test('ORDERED:mixed-api-help',async()=>{const w=boot(),r=await w.send(api()+'\n'+help());const p=payload(r);assert.equal(r.ok,true,JSON.stringify(r));assert.deepEqual(p.batch.items.map(i=>i.kind),['api','help']);assert.equal(w.count.calls,1);return {ordered:true,calls:1}});
await test('ORDERED:malformed-help-does-not-poison-later-api',async()=>{const w=boot(),r=await w.send('WB_HELP_V1 {\n'+api());const p=payload(r);assert.equal(r.ok,false);assert.equal(p.batch.status,'completed_with_errors');assert.equal(w.count.calls,1);assert.equal(p.batch.items[0].state,'blocked');assert.equal(p.batch.items[1].state,'success');return {calls:1}});
await test('ORDERED:invalid-later-api-keeps-first-explicit-call',async()=>{const w=boot(),r=await w.send(api()+'\nWB_API_V1 {');const p=payload(r);assert.equal(r.ok,false);assert.equal(w.count.calls,1);assert.equal(p.batch.items[0].state,'success');assert.equal(p.batch.items[1].state,'blocked');return {calls:1}});

for(const state of ['inactive','active_hidden','recovering'])await test('WORK:'+state,async()=>{const d=fixture();d['wb_work_session_v1:'+key].state=state;const w=boot(d),r=await w.send(help());return assertLocal(w,r,'WORK_SESSION_NOT_VISIBLE')});
// Superseding project authority: Autorun is NON_PROD. A retained legacy record
// must not make the approved manual Work/HELP path permanently busy.
await test('LEGACY_AUTORUN_DOES_NOT_BLOCK_MANUAL_HELP',async()=>{const d=fixture();d.wbmb_auto_runs[key]={run_id:'competing-run',conversation_key:key,status:'requesting'};const w=boot(d),q=await w.send(help());assert.equal(q.ok,true);assert.equal(w.count.calls,0);assert.equal(d.wbmb_auto_runs[key].status,'requesting')});
await test('GATE:personal-data-off',async()=>{const w=boot();vm.runInContext(`const originalAdmission=WBRuntimePolicy.admission;WBRuntimePolicy={...WBRuntimePolicy,admission(){throw Object.assign(new Error('Personal data disabled'),{code:'PERSONAL_DATA_DISABLED'})}}`,w.context);return assertLocal(w,await w.send(api()),'PERSONAL_DATA_DISABLED')});
await test('GATE:quota-wait',async()=>{const w=boot();await vm.runInContext(`(async()=>{const o=await wbOwner(${JSON.stringify(key)});await WBPolicyEngine.observeRetryAfter(o.account_scope,'common','60')})()`,w.context);return assertLocal(w,await w.send(api()),'QUOTA_WAIT_NEW_EXPLICIT_COMMAND_REQUIRED')});
await test('HELP:zero-network-no-token',async()=>{const d=fixture();delete d.wbmb_seller_token;const w=boot(d),r=await w.send(help());const p=payload(r);assert.equal(r.ok,true);assert.equal(w.count.calls,0);assert.equal(p.batch.items[0].result.registry_total,188);return {calls:0,registry:188}});
await test('API:exact-single-request',async()=>{const w=boot(),r=await w.send(api());assert.equal(r.ok,true,JSON.stringify(r));assert.equal(w.count.calls,1);return {calls:1}});
await test('OWNER:wrong-conversation-does-not-deliver',async()=>{const w=boot();w.context.chrome.tabs.sendMessage=(id,m,cb)=>queueMicrotask(()=>cb({ok:true,identity:{...identity,conversation_id:'22222222-2222-2222-2222-222222222222'}}));const r=await w.send(api('unknown_alias'));assert.equal(r.ok,false);assert.equal(r.report_text,undefined);assert.equal(w.count.calls,0);return {wrong_owner_delivery:0,calls:0}});
await test('RECOVERY:local-result-no-provider-replay',async()=>{const w=boot(),r=await w.send(api('unknown_alias'));assertLocal(w,r,'UNSUPPORTED_OPERATION');const next=boot(w.data);const p=await vm.runInContext('(async()=>manualDeliveryRecoveryPayload(await getManualOperation('+JSON.stringify(key)+')))()',next.context);assert.ok(p?.outgoing_text);assert.equal(p.outgoing_text,r.outgoing_text);assert.equal(next.count.calls,0);return {recovered:true,provider_calls:0}});
// Late pinned Ozon mixed_batch_discovery.js is the ordered-input oracle.
await test('DIFFERENTIAL:ozon-mixed-discovery',async()=>{const ozonRoot=path.resolve(process.argv[4]);const oracle=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(ozonRoot,'shared/mixed_batch_discovery.js'),'utf8'),oracle);for(const text of [help()+'\n'+api(),api()+'\n'+help(),api()+'\nWB_HELP_V1 {']){oracle.input=text.replaceAll('WB_','OZON_');const expected=vm.runInContext(`OzonMixedBatchDiscovery.discover(input,{apiDiscover:t=>[{marker_index:0,ok:true}],parseHelp:t=>({ok:true})}).map(x=>[x.kind,x.version||null])`,oracle);const w=boot();const actual=vm.runInContext(`WBMixedBatchDiscovery.discover(${JSON.stringify(text)},{commandPrefix:'WB_API_V1',helpPrefixV1:'WB_HELP_V1',helpPrefixV2:'WB_HELP_V2',apiDiscover:t=>[{marker_index:0,ok:true}],parseHelp:t=>({ok:true})}).map(x=>[x.kind,x.version||null])`,w.context);assert.deepEqual(JSON.parse(JSON.stringify(actual)),JSON.parse(JSON.stringify(expected)))}return {cases:3}});
const summary={target:path.basename(root),source_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'service_worker.js'))).digest('hex'),passed:rows.filter(r=>r.status==='PASS').length,failed:rows.filter(r=>r.status==='FAIL').length,real_provider_calls:0,scope:'synthetic-real-worker-and-extracted-Ozon-discovery; not installed chat delivery'};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));fs.closeSync(fd);console.log(summary);process.exitCode=summary.failed?1:0;
