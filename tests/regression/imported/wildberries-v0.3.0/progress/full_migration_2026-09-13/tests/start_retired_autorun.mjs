import path from 'node:path';import assert from 'node:assert/strict';import {boot,reporter,key,identity,workKey,pendingKey} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),r=reporter(process.argv[3]);
for(const phase of ['waiting_command','requesting','delivering'])await r.test('RETIRED_AUTORUN_DOES_NOT_PERMANENTLY_BLOCK_EXPLICIT_START_'+phase,async()=>{
 const retired={run_id:'retired',status:phase,conversation_key:key,outgoing_text:'PRESERVED_PRIOR_TRUTH',request_id:'prior'};
 const w=boot(root,{wbmb_seller_token:'fixture',wbmb_auto_runs:{[key]:retired},[workKey]:{state:'inactive',revision:10,conversation_key:key,tab_id:1,...identity}});
 try{const q=await w.start();assert.equal(q.accepted,true,JSON.stringify(q));await w.settle();assert.deepEqual(w.data.wbmb_auto_runs[key],retired);assert.equal(w.counts.provider,0);assert.equal(w.counts.promptDispatch,1);assert.ok(w.data[pendingKey]);assert.ok(!w.messages.some(m=>m.type==='WB_AUTO_BEGIN_WATCH'));}finally{w.dispose()}
});
await r.test('UNFINISHED_MANUAL_RESULT_STILL_BLOCKS_START',async()=>{
 const saved={operation_id:'manual',status:'delivering',conversation_key:key,outgoing_text:'PRESERVED_CURRENT_RESULT'};
 const w=boot(root,{wbmb_seller_token:'fixture',wbmb_manual_operations:{[key]:saved},[workKey]:{state:'inactive',revision:10,conversation_key:key,tab_id:1,...identity}});
 try{const q=await w.start();assert.equal(q.code,'WORK_START_COMPETING_OPERATION');assert.deepEqual(w.data.wbmb_manual_operations[key],saved);assert.equal(w.counts.provider,0);assert.equal(w.counts.promptDispatch,0);}finally{w.dispose()}
});
r.finish({scope:'Current NON_PROD autorun authority; explicit Work Start only; prior result retained; no provider requests'});
