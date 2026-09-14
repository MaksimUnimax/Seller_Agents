import path from 'node:path';
import assert from 'node:assert/strict';
import {boot,reporter,pendingKey,workKey,key} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),log=reporter(process.argv[3]);
async function test(id,fn,options={}){await log.test(id,async()=>{const w=boot(root,{},options);try{await fn(w);assert.equal(w.counts.provider,0)}finally{w.dispose()}})}
await test('HUNG_TAB_CHANNEL_HAS_FINITE_NO_RETRY_OUTCOME',async w=>{
 const result=await Promise.race([w.eval('tabMessage(1,{type:"WB_TEST_HUNG"})'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Unbounded tab callback')),300))]);
 assert.equal(result.code,'TAB_MESSAGE_TIMEOUT');assert.equal(w.messages.filter(m=>m.type==='WB_TEST_HUNG').length,1);
},{timerDelay:ms=>ms===30000?20:ms,onTabMessage:()=>new Promise(()=>{})});
await test('KNOWN_NO_CLICK_TERMINALIZES_WORK_ERROR',async w=>{
 assert.equal((await w.start()).accepted,true);await w.settle();
 const base={...w.data[pendingKey],identity:w.state.identity,runtime_generation:w.state.generation,actor_id:'fixture-actor'};
 assert.equal((await w.call({...base,type:'WB_WORK_START_COMMIT_REQUEST',baseline_user_turn_ids:[],assistant_baseline_ids:[]},w.content())).click_allowed,true);
 const r=await w.call({...base,type:'WB_WORK_START_SEND_OUTCOME',click_event_observed:false,composer_empty:false},w.content());
 assert.equal(r.send_outcome,'failed_before_irreversible_click');assert.equal(w.data[workKey]?.state,'error');assert.equal(w.data[workKey]?.error?.code,'WORK_START_SEND_FAILED');assert.ok(w.data[pendingKey].terminal_at);
});
const snapshot={schema_version:1,batch_id:'saved-batch',status:'running',created_at:'2026-09-13T00:00:00Z',command_fingerprint:'fixture',stop_reason:null,items:[{index:0,kind:'api',operation:'seller_info',state:'success',physical_request_count:1,http_status:200,request_id:'known-provider-result',report_text:'FULL KNOWN PROVIDER TRUTH'},{index:1,kind:'api',operation:'seller_info',state:'dispatch_committed',physical_request_count:null}]};
async function saved(w,{canonical=false,corrupt=false,unknown=false}={}){
 w.context.fixtureSnapshot=structuredClone(snapshot);
 const serialized=canonical?w.eval('WBRuntimePolicy.canonical(fixtureSnapshot)'):JSON.stringify(snapshot);
 w.context.fixtureText=serialized;const sha=await w.eval('sha256Hex(fixtureText)');
 const record={operation_id:'fixture-operation',conversation_key:key,command_batch:{snapshot:structuredClone(snapshot),sha256:sha,...(canonical?{checksum_algorithm:'canonical-json-v1'}:{}),...(unknown?{checksum_algorithm:'unreviewed-v99'}:{})}};
 if(corrupt)record.command_batch.snapshot.items[0].report_text='CHANGED';
 w.data.fixtureRecord=record;w.state.reorderReads=canonical;
 return await w.eval('storageGet("fixtureRecord").then(x=>recoverSavedBatch(x.fixtureRecord))');
}
await test('REORDERED_CANONICAL_BATCH_RECOVERY_PRESERVES_KNOWN_TRUTH',async w=>{const r=await saved(w,{canonical:true});assert.ok(r.report_text.includes('FULL KNOWN PROVIDER TRUTH'));assert.ok(r.report_text.includes('REQUEST_OUTCOME_UNKNOWN_NO_RETRY'));assert.equal(r.physical_request_count,null)});
await test('LEGACY_EXACT_BYTE_CHECKSUM_REMAINS_READABLE',async w=>{const r=await saved(w);assert.ok(r.report_text.includes('FULL KNOWN PROVIDER TRUTH'))});
await test('CORRUPT_BATCH_IS_NOT_REPLAYED_OR_DELIVERED',async w=>{await assert.rejects(saved(w,{canonical:true,corrupt:true}),e=>e.code==='BATCH_INTEGRITY_MISMATCH')});
await test('UNKNOWN_CHECKSUM_ALGORITHM_FAILS_CLOSED',async w=>{await assert.rejects(saved(w,{unknown:true}),e=>e.code==='BATCH_INTEGRITY_MISMATCH')});
log.finish({scope:'Actual worker; storage, DOM proof and shortened timeout clock mocked; no provider calls'});
