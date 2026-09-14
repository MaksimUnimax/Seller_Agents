import path from 'node:path';import assert from 'node:assert/strict';
import {boot,reporter,identity,key,workKey} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),log=reporter(process.argv[3]);
const state=()=>({wbmb_seller_token:'SYNTHETIC-TOKEN',wbmb_conversation_bindings:{[key]:{...identity,conversation_key:key,binding_id:'b',revision:1}},[workKey]:{state:'active_visible',conversation_key:key,revision:2,tab_id:1,...identity}});
const command='WB_API_V1 {"operation":"seller_info","params":{}}';
const request=w=>w.call({type:'WB_EXECUTE_COMMAND',conversation_key:key,manual_request_id:'fixture-'+Math.random(),command_text:command},w.content());
async function test(name,fn){await log.test(name,async()=>{const w=boot(root,state());try{await fn(w)}finally{w.dispose()}})}
await test('LOGICAL_PHYSICAL_IDENTITIES_PERSIST_BEFORE_FETCH_AND_MATCH_RESULT',async w=>{
 let atFetch;w.context.fetch=async()=>{w.counts.provider++;atFetch=structuredClone(w.data.wbmb_manual_operations[key].command_batch.snapshot.items[0]);return new Response('{}',{headers:{'Content-Type':'application/json'}})};
 const r=await request(w),batch=JSON.parse(r.report_text.slice('WB_RESULT_V1\n'.length)),row=batch.batch.items[0],env=JSON.parse(row.report_text.slice('WB_RESULT_V1\n'.length));
 assert.ok(atFetch.logical_request_id);assert.ok(atFetch.physical_request_id);assert.equal(atFetch.state,'dispatch_committed');assert.equal(atFetch.physical_request_count,null);assert.equal(row.logical_request_id,env.request_meta.logical_request_id);assert.equal(row.physical_request_id,env.request_meta.physical_request_id);assert.equal(row.physical_request_count,1);assert.equal(w.counts.provider,1);
});
await test('ACCOUNT_SWITCH_DURING_COMMIT_IS_KNOWN_ZERO_PROVIDER_CALLS',async w=>{
 const set=w.context.chrome.storage.local.set;let changed=false;
 w.context.chrome.storage.local.set=async v=>{await set(v);if(!changed&&Object.values(v.wbmb_manual_operations||{}).some(o=>o.command_batch?.snapshot?.items?.some(i=>i.state==='dispatch_committed'))){changed=true;w.data.wbmb_seller_token='SYNTHETIC-OTHER-ACCOUNT';}};
 const r=await request(w);assert.equal(changed,true);assert.equal(w.counts.provider,0);const row=w.data.wbmb_manual_operations[key].command_batch.snapshot.items[0];assert.equal(row.physical_request_count,0);assert.equal(row.state,'error');assert.equal(row.external_request_executed,false);assert.ok(r.report_text.includes('CREDENTIAL_SCOPE_CHANGED'));
});
await test('SEMANTIC_LOGICAL_FINGERPRINT_IGNORES_FORMATTING',async w=>{
 const seen=[];for(const text of [command,'WB_API_V1\n{ "params": {}, "operation": "seller_info" }']){
  const x=boot(root,state());try{const r=await x.call({type:'WB_EXECUTE_COMMAND',conversation_key:key,manual_request_id:'fixture',command_text:text},x.content());const row=JSON.parse(r.report_text.slice('WB_RESULT_V1\n'.length)).batch.items[0];seen.push({id:row.logical_request_id,hash:JSON.parse(row.report_text.slice('WB_RESULT_V1\n'.length)).request_meta.logical_fingerprint})}finally{x.dispose()}
 }assert.equal(seen[0].hash,seen[1].hash);assert.notEqual(seen[0].id,seen[1].id);assert.match(seen[0].hash,/^[a-f0-9]{64}$/);
});
log.finish({scope:'Actual worker/provider dispatch with mocked fetch and an account change during durable dispatch; fixture calls only'});
