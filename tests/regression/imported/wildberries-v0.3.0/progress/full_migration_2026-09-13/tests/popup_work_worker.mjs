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
 return {context,count,data,messages,dispatch(message,sender={url:"chrome-extension://fixture/popup.html"}){return new Promise(resolve=>listener(message,sender,resolve))},async send(text,request='fresh-attempt'){
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('HARNESS_TIMEOUT')),5000);listener({type:'WB_EXECUTE_COMMAND',conversation_key:key,manual_request_id:request,command_text:text},{tab,frameId:0,url:tab.url},r=>{clearTimeout(timer);resolve(r)})});
 }};
}
async function test(id,fn){let row;try{row={id,status:'PASS',detail:await fn()}}catch(e){row={id,status:'FAIL',error:e.message,stack:e.stack}}rows.push(row);fs.writeSync(fd,JSON.stringify(row)+'\n');fs.fsyncSync(fd);console.log(id,row.status,row.error||'');}

const evalw=(w,code)=>vm.runInContext(code,w.context);
const mode=w=>evalw(w,`getManualMode(${JSON.stringify(key)})`);
const state=w=>evalw(w,`publicSettingsState(${JSON.stringify(key)})`);
function workFixture(state='active_visible',legacy=true){const d=fixture();d.wbmb_manual_modes[key]=legacy;d['wb_work_session_v1:'+key].state=state;return d;}
function workHarness(d){const w=boot(d);let runtimeId='popup-fixture-g1',generation='popup-fixture-g1';w.context.chrome.tabs.sendMessage=(id,m,cb)=>{w.messages.push(m);let r;if(m.type==='WB_GET_IDENTITY')r={ok:true,identity,runtime_id:runtimeId,runtime_generation:generation};else if(m.type==='WB_APPLY_AI_MODE')r={ok:true,applied:true,ai_mode:m.ai_mode,adapter_id:m.ai_mode==='alice'?null:'chatgpt',runtime_id:runtimeId,runtime_generation:generation};else if(m.type==='WB_WORK_VISIBILITY')r={ok:true,applied:true,revision:m.work.revision};else if(m.type==='WB_WORK_RUNTIME_FREEZE')r={ok:true,applied:true,runtime_id:runtimeId,runtime_generation:generation,assistant_baseline_ids:['assistant-old']};else if(m.type==='WB_RUNTIME_REFRESH'){runtimeId+='-next';generation=m.new_runtime_generation||runtimeId;r={ok:true,refreshed:true,runtime_id:runtimeId,runtime_generation:generation};}else if(m.type==='WB_WORK_RUNTIME_RENEW')r={ok:true,applied:true,baseline_applied:true,recovery_id:m.recovery_id,runtime_id:runtimeId,runtime_generation:generation,identity};else if(m.type==='WB_AUTO_GET_BASELINE')r={ok:true,assistant_baseline_ids:[]};else r={ok:false,code:'MOCK_UNSUPPORTED'};queueMicrotask(()=>cb(r))};return w;}
const action=(w,action)=>evalw(w,`wbWorkAction(${JSON.stringify({tab_id:1,identity,action})},{url:'chrome-extension://fixture/popup.html'})`);
for(const [s,legacy,expected] of [['active_visible',false,true],['active_hidden',true,false],['inactive',true,false],['error',true,false]]) await test(`AUTHORITY:${s}:legacy-${legacy}`,async()=>{const w=boot(workFixture(s,legacy));assert.equal(await mode(w),expected);assert.equal(w.count.calls,0)});
await test('NO_WORK_NO_MANUAL',async()=>{const d=fixture();delete d['wb_work_session_v1:'+key];const w=boot(d);assert.equal(await mode(w),false)});
await test('HELP_WORK_VISIBLE_LEGACY_FALSE',async()=>{const w=boot(workFixture('active_visible',false)),r=await w.send(help());assert.equal(r.ok,true,JSON.stringify(r));assert.equal(w.count.calls,0)});
await test('LEGACY_SET_CANNOT_BYPASS_WORK',async()=>{const w=boot(workFixture('inactive',false));await assert.rejects(()=>evalw(w,`setManualMode(${JSON.stringify(key)},true)`),e=>e.code==='WORK_SESSION_OWNS_MANUAL_MODE');assert.equal(await mode(w),false)});
await test('POPUP_WORK_SNAPSHOT',async()=>{const w=boot(),s=await state(w);assert.equal(s.work?.state,'active_visible');assert.equal(s.work.conversation_key,key);assert.equal(s.runtime_options.personal_data,false);assert.equal(s.manual_mode,true)});
await test('HIDE_AND_LATER_SYNC_USE_WORK',async()=>{const w=workHarness(workFixture());const r=await action(w,'toggle');assert.equal(r.work.state,'active_hidden');assert.equal(await mode(w),false);assert.equal((await state(w)).manual_mode,false);assert.equal(w.count.calls,0)});
await test('SHOW_WORK_VISIBLE_WITHOUT_LEGACY',async()=>{const w=workHarness(workFixture('active_hidden',false));const r=await action(w,'toggle');assert.equal(r.work.state,'active_visible');assert.equal(await mode(w),true);assert.equal(w.count.calls,0)});
await test('RESUME_INACTIVE_BINDING_WITHOUT_START_PROMPT',async()=>{const w=workHarness(workFixture('inactive',false));const r=await action(w,'toggle');assert.equal(r.ok,true);assert.equal(r.work.state,'active_visible');assert.ok(!w.messages.some(m=>/START_PROMPT/.test(m.type)));assert.equal(w.count.calls,0)});
await test('SHOW_UI_ACK_REQUIRED',async()=>{const w=workHarness(workFixture('active_hidden',false));w.context.chrome.tabs.sendMessage=(id,m,cb)=>queueMicrotask(()=>cb(m.type==='WB_GET_IDENTITY'?{ok:true,identity}:{ok:false,code:'NO_UI_ACK'}));let r;try{r=await action(w,'toggle')}catch(e){r={ok:false,code:e.code}};assert.equal(r.ok,false);assert.equal(await mode(w),false);assert.equal(w.count.calls,0)});
await test('FINISH_NO_LEGACY_REVIVAL',async()=>{const w=workHarness(workFixture());const r=await action(w,'finish');assert.equal(r.work.state,'inactive');assert.equal(await mode(w),false);assert.equal((await state(w)).binding.bound,true);assert.equal(w.count.calls,0)});
await test('REFRESH_REQUIRES_ACK_AND_PRESERVES_OPTIONS',async()=>{const d=workFixture('active_hidden',false);d.wb_runtime_options_v1={personal_data:false,composer_wait_ms:12000,attachment_wait_ms:22000};const w=workHarness(d);const r=await action(w,'refresh');assert.equal(r.work.state,'active_hidden');assert.equal((await state(w)).runtime_options.composer_wait_ms,12000);assert.equal(w.count.calls,0)});
await test('POPUP_SENDER_CANNOT_BE_CONTENT',async()=>{const w=workHarness(fixture());await assert.rejects(()=>evalw(w,`wbWorkAction(${JSON.stringify({tab_id:1,identity,action:'toggle'})},{tab:{id:1}})`),e=>e.code==='POPUP_AUTHORITY_REQUIRED');assert.equal(await mode(w),true)});
await test('MANUAL_STATE_EXPOSES_DURABLE_BUSY',async()=>{const d=fixture();d.wbmb_manual_operations={[key]:{operation_id:'existing',conversation_key:key,tab_id:1,status:'delivering'}};const w=boot(d);const r=await w.dispatch({type:'WB_GET_MANUAL_STATE',conversation_key:key},{tab:{id:1,url:'https://chatgpt.com/c/'+identity.conversation_id},frameId:0});assert.equal(r.ok,true);assert.equal(r.manual_operation_active,true);assert.equal(w.count.calls,0)});

await test('TAB_AI_NOT_GLOBAL',async()=>{const w=workHarness(fixture());await evalw(w,`wbSaveOptions({ai_mode:'alice'},{url:'chrome-extension://fixture/popup.html'},1)`);const one=await evalw(w,'wbTabOptions(1)'),two=await evalw(w,'wbTabOptions(2)'),global=await evalw(w,'wbOptions()');assert.equal(one.ai_mode,'alice');assert.equal(two.ai_mode,'auto');assert.equal(global.ai_mode,'auto');assert.equal(w.count.calls,0)});
await test('TAB_AI_ORIGIN_CHANGE_DOES_NOT_INHERIT',async()=>{const w=workHarness(fixture());await evalw(w,`wbSaveOptions({ai_mode:'chatgpt'},{url:'chrome-extension://fixture/popup.html'},1)`);w.context.chrome.tabs.get=async id=>({id,url:'https://alice.yandex.ru/chat/fixture'});assert.equal((await evalw(w,'wbTabOptions(1)')).ai_mode,'auto')});
await test('INVALID_TAB_AI_WRITES_NOTHING',async()=>{const w=workHarness(fixture()),before=JSON.stringify(w.data);await assert.rejects(()=>evalw(w,`wbSaveOptions({ai_mode:'unsupported'},{url:'chrome-extension://fixture/popup.html'},1)`));assert.equal(JSON.stringify(w.data),before)});
await test('CONTENT_CANNOT_CHANGE_TAB_AI',async()=>{const w=workHarness(fixture()),before=JSON.stringify(w.data);await assert.rejects(()=>evalw(w,`wbSaveOptions({ai_mode:'alice'},{tab:{id:1}},1)`));assert.equal(JSON.stringify(w.data),before)});
await test('GET_OPTIONS_USES_SENDER_TAB',async()=>{const w=workHarness(fixture());await evalw(w,`wbSaveOptions({ai_mode:'alice'},{url:'chrome-extension://fixture/popup.html'},1)`);const r=await w.dispatch({type:'WB_GET_RUNTIME_OPTIONS',tab_id:2},{tab:{id:1},frameId:0});assert.equal(r.options.ai_mode,'alice');assert.equal(w.count.calls,0)});
const summary={passed:rows.filter(r=>r.status==='PASS').length,failed:rows.filter(r=>r.status==='FAIL').length,real_provider_calls:0,scope:'exact worker functions and real dispatcher with mocked Chrome/DOM acknowledgement',worker_sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'service_worker.js'))).digest('hex')};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));fs.closeSync(fd);console.log(summary);process.exitCode=summary.failed?1:0;
