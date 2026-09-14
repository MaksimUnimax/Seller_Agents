/* Provider outcome and chat delivery have separate authorities. A saved result
 * may be reconciled or re-staged; a committed Send/attachment is NEVER replayed.
 * All mutations are fenced, read back, and bound to account/chat/tab/runtime. */
(() => {
'use strict';
const SIDE='wb_local_results_v1',flights=new Map();let sideLock=Promise.resolve();
const clone=v=>JSON.parse(JSON.stringify(v));
function exclusive(key,fn){const prev=flights.get(key)||Promise.resolve(),p=prev.catch(()=>{}).then(fn);flights.set(key,p);p.finally(()=>{if(flights.get(key)===p)flights.delete(key)}).catch(()=>{});return p;}
const ids=v=>{if(!Array.isArray(v)||v.length>4000||v.some(x=>typeof x!=='string'||!x||x.length>240))throw wbError('DELIVERY_BASELINE_INVALID');return [...new Set(v)]};
const cleanCode=e=>/^[A-Z0-9_]{1,100}$/.test(e?.code||'')?e.code:'BRIDGE_LOCAL_FAILURE';
async function sideMap(){return (await storageGet(SIDE))[SIDE]||{};}
async function sideMutate(id,fn){const p=sideLock.then(async()=>{const map=await sideMap(),r=await fn(map[id]||null);if(r)map[id]=r;else delete map[id];await storageSet({[SIDE]:map});const got=(await sideMap())[id]||null;if(WBRuntimePolicy.canonical(got)!==WBRuntimePolicy.canonical(r||null))throw wbError('DELIVERY_STORAGE_READBACK_FAILED');return got});sideLock=p.catch(()=>{});return p;}
async function find(key,id,operationId=''){
 const main=await getManualOperation(key);if(main&&((id&&main.delivery_id===id)||(operationId&&main.operation_id===operationId)))return main;
 return Object.values(await sideMap()).find(r=>r.conversation_key===key&&((id&&r.delivery_id===id)||(operationId&&r.operation_id===operationId)))||null;
}
async function runtime(message,sender,key){
 if((sender?.frameId??0)!==0||!sender?.tab?.id)throw wbError('CONTENT_AUTHORITY_REQUIRED');
 const live=await tabMessage(sender.tab.id,{type:'WB_GET_IDENTITY'});
 if(!live?.ok||!live.identity||conversationKeyFromIdentity(live.identity)!==key)throw wbError('CONVERSATION_MISMATCH');
 const generation=String(live.runtime_generation||live.runtime_id||'');
 if(!generation||message.runtime_generation!==generation)throw wbError('DELIVERY_RUNTIME_SUPERSEDED');
 if(message.actor_id!==live.runtime_id)throw wbError('DELIVERY_ACTOR_MISMATCH');
 return {generation,actor:live.runtime_id,document_id:sender.documentId||null};
}
async function get(message,sender,{allowTerminal=false}={}){
 const key=await wbSenderKey(message,sender),r=await find(key,String(message.delivery_id||''),String(message.manual_operation_id||''));
 if(!r)throw wbError('DELIVERY_NOT_FOUND');await runtime(message,sender,key);if(r.tab_id!==sender.tab.id||r.finish_requested)throw wbError('DELIVERY_OWNER_MISMATCH');
 if(!allowTerminal&&r.status!=='delivering')throw wbError('DELIVERY_NOT_PENDING');
 if(!r.diagnostic_only)await assertRunBinding(r);
 const scope=await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials));
 if(!r.account_scope||scope!==r.account_scope)throw wbError('DELIVERY_ACCOUNT_CHANGED');
 return {key,record:r,meta:r,manual:true,side:r.side_error===true};
}
async function write(r,patch){
 const fn=current=>{if(!current||current.operation_id!==r.operation_id||current.status!=='delivering'||current.finish_requested||Number(current.delivery_revision||0)!==Number(r.delivery_revision||0))throw wbError('DELIVERY_REVISION_CHANGED');return {...current,...patch,delivery_revision:Number(current.delivery_revision||0)+1}};
 const saved=r.side_error?await sideMutate(r.operation_id,fn):await mutateManualOperation(r.conversation_key,fn);
 const check=await find(r.conversation_key,r.delivery_id);if(!check||check.delivery_revision!==saved.delivery_revision||Object.keys(patch).some(k=>WBRuntimePolicy.canonical(check[k])!==WBRuntimePolicy.canonical(patch[k])))throw wbError('DELIVERY_STORAGE_READBACK_FAILED');
 // Record only transaction metadata, never result text, command params or bytes.
 const event=patch.status==='completed'?'DELIVERY_CONFIRMED':patch.send_state==='committed'?'DELIVERY_SEND_COMMITTED':patch.send_state==='unknown_no_retry'?'DELIVERY_SEND_OUTCOME_UNKNOWN_NO_RETRY':patch.send_rollback?'DELIVERY_SEND_ROLLED_BACK_NO_ACTIVATION':patch.attachment_phase==='committed'?'FILE_ATTACHMENT_COMMITTED':patch.attachment_phase==='attached'?'FILE_ATTACHMENT_READY_ACK':patch.insert_state==='committed'?'DELIVERY_INSERT_COMMITTED':patch.delivery_staged?'DELIVERY_STAGE_CONFIRMED':patch.delivery_lease_id?'DELIVERY_LEASE_PREPARED':patch.delivery_materialized?'DELIVERY_RESULT_MATERIALIZED':patch.last_error?'DELIVERY_ERROR_RESULT_PRESERVED':null;
 if(event)await diagnostic(event,{operation_id:check.operation_id,delivery_id:check.delivery_id,request_id:check.request_id,conversation_key:check.conversation_key,tab_id:check.tab_id,runtime_generation:check.delivery_generation||null,delivery_revision:check.delivery_revision,attachment_phase:check.attachment_phase||'pending',send_state:check.send_state||'pending',file_count:(check.artifact_refs||[]).length,external_request_executed:false,event_domain:'chat_delivery',provider_result_preserved:true,automatic_retry:false});
 return check;
}
async function guard(m,s,{lease=true}={}){
 const d=await get(m,s),rt=await runtime(m,s,d.key);
 if(lease&&(!m.lease_id||m.lease_id!==d.record.delivery_lease_id||d.record.delivery_generation!==rt.generation||d.record.delivery_actor!==rt.actor))throw wbError('DELIVERY_LEASE_CHANGED');return {...d,rt};
}
async function insertionVisible(r){
 if(!r.side_error&&!r.diagnostic_only&&(await wbWorkRead(r.conversation_key)).state!=='active_visible')throw wbError('DELIVERY_WORK_NOT_VISIBLE');
}
async function prepare(m,s){return exclusive('prepare:'+m.delivery_id,async()=>{
 let {key,record:r}=await get(m,s);const rt=await runtime(m,s,key),options=await wbOptions(),owner=await wbOwner(key).catch(()=>null);
 let refs=r.artifact_refs||[],text=r.outgoing_text||'';
 if(!r.delivery_materialized){
  const ai=BB2ConversationIdentity.providerForOrigin(r.origin),decision=WBAIDeliveryCapabilities.generatedTextDecision(ai,text);
  if(decision.representation==='text_document'){
   if(!owner||r.diagnostic_only)throw wbError('ARTIFACT_OWNER_INVALID');
   const maximum=WBAIDeliveryCapabilities.profile(ai)?.max_files_per_turn;
   if(Number.isSafeInteger(maximum)&&maximum>0&&refs.length>=maximum){
    if(!r.retained_text_ref){
      const expires=Date.parse(r.created_at)+3600000;
      if(!Number.isSafeInteger(expires)||expires<=Date.now())throw wbError('LOCAL_FILE_EXPIRED');
      r=await write(r,{retained_text_ref:'wb-file-'+crypto.randomUUID(),retained_text_expires_at:expires,retained_text_personal_data:options.personal_data===true});
    }
    const d=await wbArtifacts().put(new TextEncoder().encode(r.outgoing_text),owner,{name:'WB-complete-result-'+r.request_id+'.txt',mime:'text/plain',requestId:r.request_id,sourceKind:'generated_bridge_text',artifactKey:'bridge-retained:'+r.request_id,ref:r.retained_text_ref,expiresAt:r.retained_text_expires_at,personalDataRequired:r.retained_text_personal_data===true});
    text=WBDeliveryPolicy.retainedReceipt(r,d);
    if(WBAIDeliveryCapabilities.generatedTextDecision(ai,text).representation!=='plain_text')throw wbError('AI_DELIVERY_RECEIPT_TOO_LARGE');
   }else{
   const d=await wbArtifacts().put(new TextEncoder().encode(text),owner,{name:'WB-result-'+r.request_id+'.txt',mime:'text/plain',requestId:r.request_id});refs=[...refs,d];
   text='WB_RESULT_V1\n'+JSON.stringify({request_id:r.request_id,delivery:'full_result_attached',files:refs,source_text_sha256:await sha256Hex(r.outgoing_text),provider_request_repeated:false});
   }
  }
  r=await write(r,{delivery_materialized:true,artifact_refs:refs,delivery_text:text,delivery_prefix_applied:r.report_prefix_applied===true&&!r.retained_text_ref});
 }else text=r.delivery_text;
 if(refs.length){if(!owner)throw wbError('ARTIFACT_OWNER_INVALID');for(const d of refs)await wbArtifacts().describe(d.ref,owner);}
 // The pre-staging baseline is immutable, including across worker/page recovery.
 const baseline=r.delivery_baseline_users||ids(m.baseline_user_turn_ids);
 const assistant=r.delivery_baseline_assistant||ids(m.assistant_baseline_ids||[]);
 const same=r.delivery_generation===rt.generation&&r.delivery_actor===rt.actor;
 const lease=same&&r.delivery_lease_id?r.delivery_lease_id:crypto.randomUUID();
 r=await write(r,{delivery_lease_id:lease,delivery_actor:rt.actor,delivery_generation:rt.generation,delivery_document_id:rt.document_id,delivery_baseline_users:baseline,delivery_baseline_assistant:assistant});
 await guard({...m,lease_id:lease},s);
 const deliveryPaused=!r.side_error&&!r.diagnostic_only&&(await wbWorkRead(key)).state!=='active_visible';
 return {ok:true,text,files:refs,auto_send:r.auto_send!==false,options,lease_id:lease,revision:r.delivery_revision,delivery_paused:deliveryPaused,baseline_user_turn_ids:baseline,assistant_baseline_ids:assistant,send_state:r.send_state||'pending',insert_state:r.insert_state||(r.delivery_staged?'staged':'pending'),attachment_phase:r.attachment_phase||'pending',manual_send_wait:r.manual_send_wait===true,delivery_staged:r.delivery_staged===true};
 });}
async function insertCommit(m,s){return exclusive('insert:'+m.delivery_id,async()=>{
 let {record:r}=await guard(m,s);await insertionVisible(r);
 if(r.insert_state||r.delivery_staged||['committed','sent','unknown_no_retry'].includes(r.send_state))return {ok:true,insert_allowed:false,insert_state:r.insert_state||'staged',automatic_retry:false};
 r=await write(r,{insert_state:'committed',insert_actor:m.actor_id,insert_committed_at:new Date().toISOString()});
 await guard(m,s);await insertionVisible(r);return {ok:true,insert_allowed:true,insert_state:'committed'};
 });}
async function stage(m,s){let {record:r}=await guard(m,s);if(['committed','sent','unknown_no_retry'].includes(r.send_state))return {ok:true,staged:true,reconcile_only:true};
 if(!r.insert_state&&!r.delivery_staged)throw wbError('DELIVERY_INSERT_NOT_COMMITTED');
 const proof=await tabMessage(r.tab_id,{type:'WB_CHECK_DELIVERY_STAGE',conversation_key:r.conversation_key,delivery_id:r.delivery_id,text:r.delivery_text,files:r.artifact_refs||[],runtime_generation:r.delivery_generation});
 if(!proof?.ok||!proof.staged)throw wbError('DELIVERY_STAGE_NOT_CONFIRMED');
 await guard(m,s);r=await write(r,{insert_state:'staged',delivery_staged:true,manual_send_wait:r.auto_send===false});return {ok:true,staged:true,waiting_manual_send:r.manual_send_wait,revision:r.delivery_revision};}
async function commit(m,s){return exclusive('send:'+m.delivery_id,async()=>{
 let {record:r}=await guard(m,s);if(['committed','sent','unknown_no_retry'].includes(r.send_state))return {ok:true,committed:true,click_allowed:false};
 await insertionVisible(r);
 if(r.auto_send===false)throw wbError('AUTOSEND_OFF');if(!r.delivery_staged)throw wbError('DELIVERY_NOT_STAGED');
 if((r.artifact_refs||[]).length&&r.attachment_phase!=='attached')throw wbError('DELIVERY_FILES_NOT_ACKNOWLEDGED');
 r=await write(r,{send_state:'committed',send_actor:m.actor_id,send_committed_at:new Date().toISOString(),send_nonce:crypto.randomUUID()});
 await guard(m,s);await insertionVisible(r);return {ok:true,committed:true,click_allowed:true,send_nonce:r.send_nonce};
 });}
async function rollback(m,s){return exclusive('send:'+m.delivery_id,async()=>{
 let {record:r}=await guard(m,s);
 if(m.method_called!==false||m.click_event_observed!==false)throw wbError('SEND_OUTCOME_UNKNOWN_NO_RETRY');
 if(r.send_state!=='committed')return {ok:true,rolled_back:false};
 if(!m.send_nonce||m.send_nonce!==r.send_nonce||m.actor_id!==r.send_actor)throw wbError('DELIVERY_SEND_NONCE_MISMATCH');
 r=await write(r,{send_state:'pending',send_nonce:null,send_actor:null,send_committed_at:null,send_rollback:{code:'PROVEN_NO_ACTIVATION',automatic_retry:false}});
 return {ok:true,rolled_back:true,automatic_retry:false};
 });}
async function attachCommit(m,s){return exclusive('attach:'+m.delivery_id,async()=>{
 let {record:r}=await guard(m,s);await insertionVisible(r);checkFiles(r,m.files);
 if(['committed','attached','unknown_no_retry'].includes(r.attachment_phase))return {ok:true,apply_allowed:false,attachment_phase:r.attachment_phase};
 r=await write(r,{attachment_phase:'committed',attachment_actor:m.actor_id,attachment_committed_at:new Date().toISOString()});await guard(m,s);await insertionVisible(r);return {ok:true,apply_allowed:true,attachment_phase:r.attachment_phase};
 });}
function checkFiles(r,files){const refs=r.artifact_refs||[];if(!refs.length||!Array.isArray(files)||files.length!==refs.length||files.some((v,i)=>v.ref!==refs[i].ref||v.sha256!==refs[i].sha256))throw wbError('ATTACHMENT_ACK_MISMATCH');}
async function attached(m,s){let {record:r}=await guard(m,s);checkFiles(r,m.files);if(r.attachment_phase==='committed'&&r.attachment_actor!==m.actor_id)throw wbError('ATTACHMENT_OUTCOME_UNKNOWN_NO_RETRY');if(!['committed','attached','unknown_no_retry'].includes(r.attachment_phase))throw wbError('ATTACHMENT_NOT_COMMITTED');r=await write(r,{attachment_phase:'attached'});return {ok:true,attached:true,revision:r.delivery_revision};}
async function complete(m,s,failed=false){return exclusive('complete:'+String(m.manual_operation_id),async()=>{
 let {key,record:r}=await get(m,s,{allowTerminal:true});await runtime(m,s,key);
 if(r.status==='completed')return {ok:true,operation:publicManualOperation(r)};
 if(r.status!=='delivering')throw wbError('DELIVERY_NOT_PENDING');
 if(failed){const code=cleanCode(m);const committed=['committed','sent','unknown_no_retry'].includes(r.send_state);r=await write(r,{send_state:committed?'unknown_no_retry':(r.send_state||'pending'),delivery_retryable:!committed,delivery_confirmed:false,last_error:{code,message:'Ошибка доставки: '+code+'. Полученный результат сохранён. Повтор WB запрещён.'}});return {ok:true,pending:true,operation:publicManualOperation(r)};}
 if(!m.delivery_confirmed||typeof m.confirmed_user_turn_id!=='string'||!m.confirmed_user_turn_id){r=await write(r,{delivery_confirmed:false,delivery_retryable:false,send_state:['committed','unknown_no_retry'].includes(r.send_state)?'unknown_no_retry':r.send_state||'pending'});return {ok:true,pending:true,operation:publicManualOperation(r)};}
 // A user may send the inserted draft before the stage response reaches the
 // worker. Only an independently verified new user turn can settle that gap.
 if(!r.insert_state&&(!r.delivery_staged||(!r.manual_send_wait&&!['committed','unknown_no_retry'].includes(r.send_state))))throw wbError('DELIVERY_NOT_COMMITTED');
 if((r.artifact_refs||[]).length&&r.attachment_phase!=='attached')throw wbError('DELIVERY_FILES_NOT_ACKNOWLEDGED');
 if((r.delivery_baseline_users||[]).includes(m.confirmed_user_turn_id))throw wbError('DELIVERY_OLD_USER_TURN');
 const proof=await tabMessage(r.tab_id,{type:'WB_CHECK_USER_DELIVERY',conversation_key:key,delivery_id:r.delivery_id,request_id:r.request_id,expected_text:r.delivery_text,user_turn_id:m.confirmed_user_turn_id,baseline_user_turn_ids:r.delivery_baseline_users||[],runtime_generation:m.runtime_generation});
 if(!proof?.ok||!proof.matched)throw wbError('DELIVERY_USER_TURN_NOT_CONFIRMED');
 await get(m,s);await runtime(m,s,key);
 const owner=await wbOwner(key).catch(()=>null),refs=r.artifact_refs||[];
 if(!r.side_error)await noteConfirmedPrefix(key,r.delivery_prefix_applied===true,r.delivery_id);
 r=await write(r,{status:'completed',delivery_confirmed:true,confirmed_user_turn_id:m.confirmed_user_turn_id,send_state:'sent',manual_send_wait:false,completed_at:new Date().toISOString(),delivery_retryable:false,last_error:null,artifact_refs:[],delivered_files:refs.map(x=>({filename:x.filename,mime:x.mime,byte_length:x.byte_length,sha256:x.sha256})),cleanup_pending:refs.map(x=>x.ref)});
 if(owner)for(const f of refs)await wbArtifacts().remove(f.ref,owner).catch(()=>null);
 return {ok:true,operation:publicManualOperation(r)};
 });}
async function confirmPrefix(m,s){
 const {key,record:r}=await get(m,s,{allowTerminal:true});
 if(r.status!=='completed'||r.delivery_confirmed!==true||r.send_state!=='sent')throw wbError('DELIVERY_NOT_CONFIRMED');
 if(!r.side_error)await noteConfirmedPrefix(key,r.delivery_prefix_applied===true,r.delivery_id);
 return {ok:true};
}
async function attachmentFailure(m,s){return exclusive('attach:'+m.delivery_id,async()=>{
 let {record:r}=await guard(m,s);const ai=BB2ConversationIdentity.providerForOrigin(r.origin);
 if(WBAIDeliveryCapabilities.profile(ai)?.pre_attachment_failure_text_fallback!==true||r.attachment_phase&&r.attachment_phase!=='pending'||r.send_state&&r.send_state!=='pending'||r.delivery_staged||r.attachment_failure_fallback||!(r.artifact_refs||[]).length)return {ok:true,text_fallback:false,automatic_retry:false};
 const code=cleanCode(m),refs=r.artifact_refs,owner=await wbOwner(r.conversation_key);
 const notice='WB_RESULT_V1\n'+JSON.stringify({request_id:r.request_id,delivery_id:r.delivery_id,complete:false,delivery_error:{code,stage:'before_attachment_commit',provider_result_preserved:true,provider_request_repeated:false},undelivered_files:refs.map(d=>({filename:d.filename,sha256:d.sha256,next_command_text:WBDeliveryPolicy.localCommand(d.ref)})),automatic_continuation:false});
 let text=notice+'\n\n'+r.outgoing_text,prefix=r.report_prefix_applied===true;
 if(WBAIDeliveryCapabilities.generatedTextDecision(ai,text).representation!=='plain_text'){
  prefix=false;
  if(!r.retained_text_ref){const expires=Date.parse(r.created_at)+3600000;if(!Number.isSafeInteger(expires)||expires<=Date.now())throw wbError('LOCAL_FILE_EXPIRED');r=await write(r,{retained_text_ref:'wb-file-'+crypto.randomUUID(),retained_text_expires_at:expires,retained_text_personal_data:(await wbOptions()).personal_data===true});}
  const d=await wbArtifacts().put(new TextEncoder().encode(r.outgoing_text),owner,{name:'WB-complete-result-'+r.request_id+'.txt',mime:'text/plain',requestId:r.request_id,sourceKind:'generated_bridge_text',artifactKey:'bridge-retained:'+r.request_id,ref:r.retained_text_ref,expiresAt:r.retained_text_expires_at,personalDataRequired:r.retained_text_personal_data===true});
  text=notice+'\n\n'+WBDeliveryPolicy.retainedReceipt(r,d,{attachmentsComplete:false});
 }
 if(WBAIDeliveryCapabilities.generatedTextDecision(ai,text).representation!=='plain_text')throw wbError('AI_DELIVERY_RECEIPT_TOO_LARGE');
 await guard(m,s);
 await write(r,{attachment_failure_fallback:true,delivery_materialized:true,artifact_refs:[],undelivered_artifact_refs:refs,delivery_text:text,delivery_prefix_applied:prefix,attachment_phase:'pending',delivery_staged:false});
 await diagnostic('ATTACHMENT_PRECOMMIT_TEXT_FALLBACK',{delivery_id:r.delivery_id,request_id:r.request_id,code,external_request_executed:false,provider_result_preserved:true,automatic_retry:false});
 return {ok:true,text_fallback:true,automatic_retry:false};
});}
async function localError(m,s,error){
 // No raw source/params/error message. This record cannot authorize API work.
 const key=await wbSenderKey(m,s),identity=await tabIdentity(s.tab.id),binding=await bindingForConversationKey(key),code=cleanCode(error||m),id='wb-local-'+crypto.randomUUID(),scope=await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials));
 const original=await getManualOperation(key),sameAttempt=original?.manual_request_id===m.manual_request_id&&!['MANUAL_REQUEST_DUPLICATE','MANUAL_OPERATION_ACTIVE'].includes(code),sourceAttempt=!!m.error_operation_id&&original?.operation_id===m.error_operation_id;
 const snap=(sameAttempt||sourceAttempt)?original?.command_batch?.snapshot:null;
 const unknown=!!snap?.items?.some(r=>r.physical_request_count===null),known=(snap?.items||[]).reduce((n,r)=>n+(r.physical_request_count||0),0);
 const physical=sameAttempt?(unknown?null:known):0;
 const payload={bridge:'wildberries-llm-api-bridge',version:WBContract.VERSION,request_id:id,operation:null,http_status:0,bridge_error:true,pre_execution_error:!sourceAttempt&&physical===0,error:{code,stage:sourceAttempt?'chat_delivery':sameAttempt&&physical!==0?'execution_result':'local_admission',message:'Ошибка Bridge: '+code+'. Автоматический повтор WB запрещён.'},source_provider_outcome:snap?{request_id:snap.batch_id,status:snap.status,physical_request_count:unknown?null:known,preserved:true}:null,request_meta:{provider:'bridge_local',logical_command_count:1,physical_request_count:physical,external_request_executed:physical===null?null:physical>0,automatic_retry:false}};
 const duplicate=Object.values(await sideMap()).find(r=>m.error_operation_id&&r.error_operation_id===m.error_operation_id&&r.error_code===code&&r.conversation_key===key);if(duplicate)return {ok:false,code,already_reported:true};
 const text='WB_RESULT_V1\n'+JSON.stringify(payload,null,2),record={side_error:true,diagnostic_only:true,error_operation_id:m.error_operation_id||null,error_code:code,operation_id:id,manual_request_id:String(m.manual_request_id||id).slice(0,120),conversation_key:key,origin:identity.origin,conversation_id:identity.conversation_id,tab_id:s.tab.id,binding_snapshot:binding?bindingSnapshot(binding):null,account_scope:scope,status:'delivering',request_id:id,delivery_id:id,outgoing_text:text,auto_send:(await getSettings()).autoSend!==false,artifact_refs:[],delivery_confirmed:false,created_at:new Date().toISOString(),expires_at:Date.now()+24*3600000};
 await sideMutate(id,()=>record);
 return {ok:false,bridge_error:true,pre_execution_error:payload.pre_execution_error,http_status:0,code,manual_operation_id:id,delivery_id:id,request_id:id,report_text:text,outgoing_text:text,auto_send:record.auto_send};
}
async function pending(m,s){
 const key=await wbSenderKey(m,s),scope=await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials));
 const results=Object.values(await sideMap()).filter(r=>r.conversation_key===key&&r.account_scope===scope&&r.tab_id===s.tab.id&&r.status==='delivering'&&!r.finish_requested&&r.expires_at>Date.now()).slice(0,16).map(manualDeliveryRecoveryPayload);
 await wbSenderKey(m,s);
 if(await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials))!==scope)throw wbError('DELIVERY_ACCOUNT_CHANGED');
 return {ok:true,results};
}
async function extra(m,s){switch(m.type){case 'WB_DELIVERY_INSERT_COMMIT':return insertCommit(m,s);case 'WB_DELIVERY_ATTACHMENT_FAILED':return attachmentFailure(m,s);case 'WB_DELIVERY_SEND_ROLLBACK':return rollback(m,s);case 'WB_DELIVERY_STAGE':return stage(m,s);case 'WB_DELIVERY_ATTACH_COMMIT':return attachCommit(m,s);case 'WB_LOCAL_COMMAND_ERROR':return localError(m,s);case 'WB_LOCAL_RESULTS_PENDING':return pending(m,s);default:throw wbError('UNKNOWN_RUNTIME_MESSAGE')}}
async function prune(){for(const r of Object.values(await sideMap()))if(r.expires_at<Date.now()||r.status==='completed')await sideMutate(r.operation_id,()=>null);}
globalThis.WBDeliveryTransactions=Object.freeze({get,prepare,insertCommit,stage,commit,rollback,attachCommit,attached,complete,confirmPrefix,localError,pending,extra,prune});
})();
