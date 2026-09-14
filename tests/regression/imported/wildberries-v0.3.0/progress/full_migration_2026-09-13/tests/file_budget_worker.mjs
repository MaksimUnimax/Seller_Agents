import path from 'node:path';
import assert from 'node:assert/strict';
import {boot,reporter,ID} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),log=reporter(process.argv[3]);
const file=n=>'WB_API_V1 '+JSON.stringify({operation:'analytics_report_download',params:{path:{downloadId:'fixture-'+n}}});
const help='WB_HELP_V1 {"operation":"catalog","params":{"limit":1}}';
const api='WB_API_V1 {"operation":"seller_info","params":{}}';
async function setup(ai='alice'){
 const identity={origin:ai==='alice'?'https://alice.yandex.ru':'https://chatgpt.com',ai_id:ai,conversation_id:ID,status:'confirmed'},key=identity.origin+'|'+ID;
 let w;w=boot(root,{wbmb_seller_token:'SYNTHETIC-TOKEN',wbmb_auto_send:true,wbmb_conversation_bindings:{[key]:{...identity,conversation_key:key,binding_id:'fixture-binding',revision:1}},['wb_work_session_v1:'+key]:{state:'active_visible',conversation_key:key,revision:2,tab_id:1,...identity}},{onTabMessage:(tab,m)=>m.type==='WB_GET_IDENTITY'?{ok:true,identity:w.state.identity,runtime_id:w.state.runtimeId,runtime_generation:w.state.generation}:m.type==='WB_CHECK_DELIVERY_STAGE'?{ok:true,staged:true}:m.type==='WB_CHECK_USER_DELIVERY'?{ok:true,matched:true}:{ok:false,code:'FIXTURE_UNSUPPORTED'}});
 w.state.identity=identity;w.large=false;
 w.context.fetch=async url=>{w.counts.provider++;return url.includes('/downloads/file/')?new Response('%PDF-1.7\nSYNTHETIC ORIGINAL FILE',{headers:{'Content-Type':'application/pdf'}}):new Response(JSON.stringify({fixture:w.large?'x'.repeat(91000):'json'}),{headers:{'Content-Type':'application/json'}})};
 w.eval(`const fileFixtureMemory=new Map();WBArtifactsInstance=WBArtifactStore.create({backend:{get:async r=>fileFixtureMemory.get(r)||null,put:async r=>fileFixtureMemory.set(r.ref,r),remove:async r=>fileFixtureMemory.delete(r),all:async()=>[...fileFixtureMemory.values()]}});`);
 w.req=(type,extra={})=>w.call({type,conversation_key:key,actor_id:w.state.runtimeId,runtime_generation:w.state.generation,...extra},w.content());
 w.exec=text=>w.req('WB_EXECUTE_COMMAND',{manual_request_id:'file-fixture-'+Math.random(),command_text:text});
 w.prepare=r=>w.req('WB_DELIVERY_PREPARE',{delivery_id:r.delivery_id,baseline_user_turn_ids:[],assistant_baseline_ids:[]});
 w.finishDelivery=async(r,p)=>{
  const fields={delivery_id:r.delivery_id,lease_id:p.lease_id};
  if(p.files.length){const files=p.files.map(d=>({ref:d.ref,sha256:d.sha256}));assert.equal((await w.req('WB_DELIVERY_ATTACH_COMMIT',{...fields,files})).apply_allowed,true);assert.equal((await w.req('WB_DELIVERY_FILES_STAGED',{...fields,files})).ok,true);}
  assert.equal((await w.req('WB_DELIVERY_INSERT_COMMIT',fields)).insert_allowed,true);assert.equal((await w.req('WB_DELIVERY_STAGE',fields)).ok,true);assert.equal((await w.req('WB_MANUAL_DELIVERY_COMMIT_REQUEST',fields)).click_allowed,true);
  assert.equal((await w.req('WB_MANUAL_DELIVERY_COMPLETE',{manual_operation_id:r.manual_operation_id,delivery_confirmed:true,confirmed_user_turn_id:'fixture-delivered-'+r.request_id})).ok,true);
 };
 w.op=()=>w.data.wbmb_manual_operations?.[key];return w;
}
async function test(name,fn,ai){await log.test(name,async()=>{const w=await setup(ai);try{await fn(w)}finally{w.dispose()}})}
await test('ALICE_SECOND_FILE_DEFERRED_BEFORE_PROVIDER_ACQUISITION',async w=>{const r=await w.exec(file(1)+'\n'+file(2));assert.equal(w.counts.provider,1);const items=w.op().command_batch.snapshot.items;assert.equal(items[1].state,'deferred');assert.equal(items[1].physical_request_count,0);assert.equal(items[1].next_command_text,file(2));assert.equal(r.artifact_refs?.length||w.op().artifact_refs.length,1)});
await test('CHATGPT_EXPLICIT_TWO_FILE_BUDGET_UNCHANGED',async w=>{await w.exec(file(1)+'\n'+file(2));assert.equal(w.counts.provider,2);assert.equal(w.op().artifact_refs.length,2)},'chatgpt');
await test('FILE_DEFERRAL_PRESERVES_ORDERED_HELP_AND_JSON',async w=>{await w.exec([file(1),file(2),help,api].join('\n'));assert.equal(w.counts.provider,2);const items=w.op().command_batch.snapshot.items;assert.deepEqual(items.map(x=>x.state),['success','deferred','success','success']);assert.equal(w.op().artifact_refs.length,1)});
await test('ALICE_LARGE_COMPANION_RETAINED_WITHOUT_SECOND_ATTACHMENT',async w=>{w.large=true;const r=await w.exec(file(1)+'\n'+api);assert.equal(w.counts.provider,2);const p=await w.prepare(r);assert.equal(p.ok,true,JSON.stringify(p));assert.equal(p.files.length,1,'Original file plus impossible extra TXT');assert.ok(p.text.includes('WB_FILE_V1'),'Explicit local continuation missing');assert.equal(w.counts.provider,2);assert.ok(w.op().retained_text_ref);});
async function retained(w){w.large=true;const r=await w.exec(file(1)+'\n'+api),original=w.op().outgoing_text,p=await w.prepare(r);assert.equal(p.ok,true);const ref=w.op().retained_text_ref;await w.finishDelivery(r,p);return {ref,original};}
await test('EXPLICIT_LOCAL_CONTINUATION_DELIVERS_EXACT_BYTES_WITH_ZERO_WB',async w=>{const {ref,original}=await retained(w);const r=await w.exec('WB_FILE_V1 '+JSON.stringify({ref}));assert.equal(r.ok,true,JSON.stringify(r));assert.equal(w.counts.provider,2);assert.equal(w.op().command_batch.snapshot.items[0].kind,'file');assert.equal(w.op().command_batch.snapshot.items[0].physical_request_count,0);const p=await w.prepare(r);assert.equal(p.ok,true);assert.equal(p.files.length,1);const bytes=w.eval(`new TextDecoder().decode(fileFixtureMemory.get(${JSON.stringify(ref)}).bytes)`);assert.equal(bytes,original);await w.finishDelivery(r,p);assert.equal(w.counts.provider,2)});
await test('LOCAL_CONTINUATION_ACCOUNT_CHANGE_FAILS_WITHOUT_FETCH',async w=>{const {ref}=await retained(w);w.data.wbmb_seller_token='SYNTHETIC-OTHER-ACCOUNT';const r=await w.exec('WB_FILE_V1 '+JSON.stringify({ref}));assert.equal(r.ok,false);assert.equal(w.counts.provider,2);assert.ok(r.report_text.includes('ARTIFACT_OWNER_MISMATCH'))});
await test('LOCAL_CONTINUATION_EXPIRY_FAILS_WITHOUT_REFETCH',async w=>{const {ref}=await retained(w);w.eval(`fileFixtureMemory.get(${JSON.stringify(ref)}).expires_at=0`);const r=await w.exec('WB_FILE_V1 '+JSON.stringify({ref}));assert.equal(r.ok,false);assert.equal(w.counts.provider,2);assert.ok(r.report_text.includes('ARTIFACT_EXPIRED'))});
await test('LOCAL_CONTINUATION_CORRUPTION_FAILS_WITHOUT_REFETCH',async w=>{const {ref}=await retained(w);w.eval(`fileFixtureMemory.get(${JSON.stringify(ref)}).bytes[0]^=1`);const r=await w.exec('WB_FILE_V1 '+JSON.stringify({ref}));assert.equal(r.ok,false);assert.equal(w.counts.provider,2);assert.ok(r.report_text.includes('ARTIFACT_INTEGRITY_MISMATCH'))});
await test('RETAINED_MATERIALIZATION_RETRY_DOES_NOT_DUPLICATE_OR_RENEW',async w=>{
 w.large=true;const r=await w.exec(file(1)+'\n'+api);w.state.failWrite=v=>Object.values(v.wbmb_manual_operations||{}).some(o=>o.delivery_materialized===true);
 assert.equal((await w.prepare(r)).ok,false);const ref=w.op().retained_text_ref,expiry=w.eval(`fileFixtureMemory.get(${JSON.stringify(ref)}).expires_at`);w.state.failWrite=null;
 assert.equal((await w.prepare(r)).ok,true);assert.equal(w.op().retained_text_ref,ref);assert.equal(w.eval(`fileFixtureMemory.get(${JSON.stringify(ref)}).expires_at`),expiry);assert.equal(w.eval('fileFixtureMemory.size'),2);assert.equal(w.counts.provider,2);
});
await test('LOCAL_COMMAND_STRICT_FIELDS_DO_NOT_EXPAND_PROVIDER_REGISTRY',async w=>{
 const count=w.eval('Object.keys(WBContract.OPERATIONS).length');assert.equal(count,188);
 const r=await w.exec('WB_FILE_V1 {"ref":"wb-file-11111111-1111-1111-1111-111111111111","url":"https://example.invalid"}');assert.equal(r.ok,false);assert.equal(w.counts.provider,0);assert.equal(w.eval('Object.keys(WBContract.OPERATIONS).length'),count);
});
await test('PREFIX_ONLY_ADVANCES_FROM_CONFIRMED_WORKER_TRUTH',async w=>{
 w.data.wbmb_report_prefix_configs={[w.state.identity.origin+'|'+ID]:{enabled:true,text:'PREFIX FIXTURE',interval:1,delivered_count:0,last_applied_at_count:0}};
 const forged=await w.req('WB_REPORT_DELIVERY_CONFIRMED',{delivery_id:'invented',report_prefix_applied:true});assert.equal(forged.ok,false);
 const r=await w.exec(api),p=await w.prepare(r);await w.finishDelivery(r,p);const config=w.data.wbmb_report_prefix_configs[w.state.identity.origin+'|'+ID];assert.equal(config.delivered_count,1);assert.equal(config.last_applied_at_count,1);
 assert.equal((await w.req('WB_REPORT_DELIVERY_CONFIRMED',{delivery_id:r.delivery_id,report_prefix_applied:false})).ok,true);assert.equal(w.data.wbmb_report_prefix_configs[w.state.identity.origin+'|'+ID].delivered_count,1);
});
await test('RETAINED_TEXT_DOES_NOT_CONSUME_UNDELIVERED_PREFIX',async w=>{
 const key=w.state.identity.origin+'|'+ID;w.data.wbmb_report_prefix_configs={[key]:{enabled:true,text:'PREFIX FIXTURE',interval:1,delivered_count:0,last_applied_at_count:0}};
 await retained(w);assert.equal(w.data.wbmb_report_prefix_configs[key].delivered_count,1);assert.equal(w.data.wbmb_report_prefix_configs[key].last_applied_at_count,0);
});
await test('PREATTACHMENT_FAILURE_HAS_FULL_TEXT_AND_LOCAL_ORIGINAL_CONTINUATION',async w=>{
 const r=await w.exec(file(1)),p=await w.prepare(r),original=w.op().outgoing_text,ref=p.files[0].ref;
 const f=await w.req('WB_DELIVERY_ATTACHMENT_FAILED',{delivery_id:r.delivery_id,lease_id:p.lease_id,code:'TARGET_AI_ATTACHMENT_SURFACE_UNAVAILABLE'});assert.equal(f.text_fallback,true,JSON.stringify(f));
 assert.equal(w.op().outgoing_text,original);assert.equal(w.op().artifact_refs.length,0);assert.equal(w.op().undelivered_artifact_refs[0].ref,ref);assert.ok(w.op().delivery_text.includes(original));assert.ok(w.op().delivery_text.includes('WB_FILE_V1'));
 const next=await w.prepare(r);assert.equal(next.files.length,0);await w.finishDelivery(r,next);
 const local=await w.exec('WB_FILE_V1 '+JSON.stringify({ref}));assert.equal(local.ok,true,JSON.stringify(local));assert.equal(w.counts.provider,1);const lp=await w.prepare(local);assert.equal(lp.files[0].ref,ref);await w.finishDelivery(local,lp);assert.equal(w.counts.provider,1);
});
await test('PREATTACHMENT_FALLBACK_FORBIDDEN_AFTER_ATTACH_COMMIT',async w=>{
 const r=await w.exec(file(1)),p=await w.prepare(r);assert.equal((await w.req('WB_DELIVERY_ATTACH_COMMIT',{delivery_id:r.delivery_id,lease_id:p.lease_id,files:p.files.map(d=>({ref:d.ref,sha256:d.sha256}))})).apply_allowed,true);
 const f=await w.req('WB_DELIVERY_ATTACHMENT_FAILED',{delivery_id:r.delivery_id,lease_id:p.lease_id,code:'ATTACHMENT_PREVIEW_TIMEOUT'});assert.equal(f.text_fallback,false);assert.equal(w.op().artifact_refs.length,1);assert.equal(w.op().attachment_phase,'committed');assert.equal(w.counts.provider,1);
});
log.finish({scope:'Actual worker, mocked WB JSON/binary responses and local artifact backend; provider-call counter counts fixtures only'});
