/* Additional worker authorities. Runs in the same worker/global as the original
 * ownership state machine. Only explicit UI commands change settings/work state. */
const WB_EXTRA_OPTIONS='wb_runtime_options_v1';
const WB_WORK_PREFIX='wb_work_session_v1:';
const WB_BOOT_PREFIX='wb_bootstrap_v1:';
const WB_EXTRA_DEFAULTS=Object.freeze({ai_mode:'auto',personal_data:false,composer_wait_ms:30000,attachment_wait_ms:30000,bootstrap_text:WBRuntime.DEFAULT_AUTO_START_TEXT});
const WBWorkFlights=new Map(), WBDeliveryFlights=new Map();
let WBExtraWrite=Promise.resolve(), WBArtifactsInstance;
const WBPolicyEngine=WBRuntimePolicy.create({store:{get:storageGet,set:storageSet},alarm:async(name,when)=>{if(chrome.alarms)await chrome.alarms.create('wb-quota:'+name,{when});}});
function wbArtifacts(){return WBArtifactsInstance||(WBArtifactsInstance=WBArtifactStore.create());}
function wbExtraLock(fn){const p=WBExtraWrite.then(fn,fn);WBExtraWrite=p.catch(()=>{});return p;}
function wbError(code){return Object.assign(new Error(code),{code});}
function wbPopupOnly(sender){if(sender?.tab || sender?.url!==chrome.runtime.getURL('popup.html'))throw wbError('POPUP_AUTHORITY_REQUIRED');}
async function wbOptions(){const data=await storageGet([WB_EXTRA_OPTIONS,KEYS.GLOBAL_AUTO_START_PROMPT]),raw=data[WB_EXTRA_OPTIONS]||{},prompt=normalizeGlobalAutoStartPromptRecord(legacyGlobalPrompt(data)).record;return {...WB_EXTRA_DEFAULTS,...raw,bootstrap_text:prompt.text,cache_enabled:false,coalescing_rules:[],prefetch_enabled:false};}

async function wbTabOptions(tabId) {
 const options=await wbOptions();if(!Number.isInteger(tabId)||tabId<=0)return options;
 const tab=await chrome.tabs.get(tabId);const origin=new URL(tab.url).origin;
 const id='wb_tab_ai_v1:'+tabId,txId='wb_tab_ai_change_v1:'+tabId,data=await storageGet([id,txId]),tx=data[txId];
 const record=tx?.phase==='applying'&&tx.origin===origin?{origin,mode:tx.previous_mode}:data[id];
 return {...options,ai_mode:record?.origin===origin&&['auto',...WBAIDeliveryCapabilities.implementedTargetIds()].includes(record.mode)?record.mode:'auto'};
}
async function wbSetTabAIMode(mode,tabId){
 if(tabId===null)throw wbError('GLOBAL_AI_MODE_REMOVED');
 if(!Number.isInteger(tabId)||tabId<=0)throw wbError('TAB_ID_REQUIRED');
 if(!['auto',...WBAIDeliveryCapabilities.implementedTargetIds()].includes(mode))throw wbError('INVALID_RUNTIME_OPTIONS');
 return wbExtraLock(async()=>{
  const tab=await chrome.tabs.get(tabId),origin=new URL(tab.url).origin;
  if(!WBAIDeliveryCapabilities.adapterIdForOrigin(origin))throw wbError('AI_NOT_SUPPORTED');
  const surface=await tabMessage(tabId,{type:'WB_GET_IDENTITY'});
  if(!surface?.ok||!surface.runtime_id||!surface.runtime_generation)throw wbError('TAB_AI_MODE_CONTEXT_INVALID');
  const id='wb_tab_ai_v1:'+tabId,txId='wb_tab_ai_change_v1:'+tabId,previous=(await wbTabOptions(tabId)).ai_mode;
  const tx={intent_id:'ai-mode-'+crypto.randomUUID(),phase:'applying',origin,href:tab.url,runtime_id:surface.runtime_id,previous_mode:previous,requested_mode:mode};
  await persistPromptState({[id]:{mode,origin},[txId]:tx});
  const payload=(mode,s)=>({type:'WB_APPLY_AI_MODE',ai_mode:mode,origin,href:tab.url,runtime_id:s.runtime_id,runtime_generation:s.runtime_generation,intent_id:tx.intent_id});
  try{
   const ack=await tabMessage(tabId,payload(mode,surface)),fresh=await tabMessage(tabId,{type:'WB_GET_IDENTITY'}),currentTab=await chrome.tabs.get(tabId);
   if(!ack?.ok||ack.applied!==true||ack.ai_mode!==mode||currentTab.url!==tab.url||fresh?.runtime_id!==surface.runtime_id||ack.runtime_id!==surface.runtime_id||!ack.runtime_generation||fresh.runtime_generation!==ack.runtime_generation)throw wbError('TAB_AI_MODE_APPLY_FAILED');
   await persistPromptState({[txId]:{...tx,phase:'completed',runtime_generation:ack.runtime_generation,adapter_id:ack.adapter_id||null}});
   await diagnostic('TAB_AI_MODE_CHANGED',{tab_id:tabId,ai_mode:mode,previous_ai_mode:previous,adapter_id:ack.adapter_id||null,external_request_executed:false});
   return {ok:true,options:await wbTabOptions(tabId),adapter_id:ack.adapter_id||null};
  }catch(e){
   await persistPromptState({[id]:{mode:previous,origin},[txId]:{...tx,phase:'rolled_back',error:{code:e.code||'TAB_AI_MODE_APPLY_FAILED'}}});
   const fresh=await tabMessage(tabId,{type:'WB_GET_IDENTITY'}),currentTab=await chrome.tabs.get(tabId);
   const rollback=currentTab.url===tab.url&&fresh?.runtime_id===surface.runtime_id?await tabMessage(tabId,payload(previous,fresh)):null;
   const confirmed=rollback?.ok===true&&rollback.applied===true&&rollback.ai_mode===previous;
   await diagnostic('TAB_AI_MODE_ROLLED_BACK',{tab_id:tabId,ai_mode:previous,rollback_confirmed:confirmed,external_request_executed:false});
   return {ok:false,code:e.code||'TAB_AI_MODE_APPLY_FAILED',rollback_confirmed:confirmed,options:await wbTabOptions(tabId)};
  }
 });
}
async function wbSaveOptions(value,sender,tabId=null){
 wbPopupOnly(sender);
 if(value&&Object.hasOwn(value,'ai_mode')){if(Object.keys(value).length!==1)throw wbError('INVALID_RUNTIME_OPTIONS');return wbSetTabAIMode(value.ai_mode,tabId);}
 return withStartPromptWrite(()=>wbExtraLock(async()=>{const allowed=new Set(Object.keys(WB_EXTRA_DEFAULTS));
 if(!value||Object.keys(value).some(k=>!allowed.has(k)))throw wbError('INVALID_RUNTIME_OPTIONS');
 const old=await wbOptions(),v={...old,...value};
 if(!['auto',...WBAIDeliveryCapabilities.implementedTargetIds()].includes(v.ai_mode)||typeof v.personal_data!=='boolean'||!Number.isInteger(v.composer_wait_ms)||v.composer_wait_ms<1000||v.composer_wait_ms>120000||!Number.isInteger(v.attachment_wait_ms)||v.attachment_wait_ms<1000||v.attachment_wait_ms>120000||typeof v.bootstrap_text!=='string'||v.bootstrap_text.length>100000)throw wbError('INVALID_RUNTIME_OPTIONS');
 if(Object.hasOwn(value,'bootstrap_text'))v.bootstrap_text=normalizeAutoStartPromptText(v.bootstrap_text);
 const clean=Object.fromEntries([...allowed].map(k=>[k,v[k]])),writes={};
 if(Object.hasOwn(value,'bootstrap_text'))writes[KEYS.GLOBAL_AUTO_START_PROMPT]={text:v.bootstrap_text,is_default:v.bootstrap_text===DEFAULT_AUTO_START_TEXT,updated_at:new Date().toISOString()};
 writes[WB_EXTRA_OPTIONS]=clean;await persistPromptState(writes);
 return {ok:true,options:tabId?await wbTabOptions(tabId):await wbOptions()};
 }));
}

async function wbOwner(key){const binding=await bindingForConversationKey(key);if(!binding)throw wbError('CONVERSATION_NOT_BOUND');const settings=await getSettings();return {conversation_key:key,binding_id:binding.binding_id,binding_revision:Number(binding.revision),account_scope:await WBPolicyEngine.accountKey(JSON.stringify(settings.sellerCredentials))};}
async function wbSenderKey(message,sender){if(!sender?.tab?.id||sender.frameId && sender.frameId!==0)throw wbError('CONTENT_AUTHORITY_REQUIRED');const key=normalizeConversationKey(message.conversation_key);const id=await tabIdentity(sender.tab.id);if(!id.conversation_id||id.status!=='confirmed'||await resolveConfirmedConversationKey(id)!==key)throw wbError('CONVERSATION_MISMATCH');return key;}
async function wbWorkRead(key){
 const raw=(await storageGet(WB_WORK_PREFIX+key))[WB_WORK_PREFIX+key];let w=WBWorkSessionModel.normalize(raw,key);
 // 0.2.2/0.2.3 could persist false readback errors caused only by object-key order.
 // They are provider-neutral UI state failures, never evidence of a WB request outcome.
 // Migrate only these two known obsolete codes; all other Work errors remain fail-closed.
 if(w.state==='error'&&['WORK_STATE_COMMIT_READBACK_FAILED','WORK_START_COMMIT_READBACK_FAILED'].includes(w.error?.code)){
   w=WBWorkSessionModel.transition(w,'inactive',{error:null});await wbWorkSave(key,w);
 }
 if(globalThis.WBWorkRecovery){
  const rec=await WBWorkRecovery.read(key);
  if(!WBWorkRecovery.terminal(rec)&&!['inactive','error'].includes(w.state)){
   // Separate storage records cannot commit atomically. Pending recovery remains
   // authoritative even if the Work active write survived an interrupted commit.
   return WBWorkSessionModel.normalize({...w,state:'recovering'},key);
  }
 }
 if(!WBWorkFlights.has(key)&&['binding','recovering','finishing'].includes(w.state)){w=WBWorkSessionModel.transition(w,'error',{error:{code:'WORK_INTERRUPTED_NO_PROVIDER_REPLAY'}});await wbWorkSave(key,w);}return w;
}
async function wbWorkSave(key,record){await storageSet({[WB_WORK_PREFIX+key]:record});const saved=(await storageGet(WB_WORK_PREFIX+key))[WB_WORK_PREFIX+key];if(!saved||WBRuntimePolicy.canonical(saved)!==WBRuntimePolicy.canonical(record))throw wbError('WORK_STATE_COMMIT_READBACK_FAILED');return record;}
async function wbWorkAction(message,sender){
 wbPopupOnly(sender);
 if(message.action==='start')return WBWorkStart.start(message,sender);
 if(message.action==='finish'){const cancelled=await WBWorkStart.cancelPopup(message,sender);if(cancelled)return cancelled;}
const ctx=await resolvePopupContext(message.tab_id,message.identity||null),key=ctx.conversation_key,action=message.action;
 if(!['start','refresh','toggle','finish','state'].includes(action))throw wbError('WORK_ACTION_INVALID');
 if(action==='state')return {ok:true,work:await wbWorkRead(key)};
 if(action==='finish')return WBWorkRecovery.finish(ctx);
 const pendingStart=await WBWorkStart.read(ctx.tab_id);if(!WBWorkStart.terminal(pendingStart))throw wbError('WORK_START_ALREADY_PENDING');
 if(action==='refresh')return WBWorkRecovery.refresh(ctx);
 if(WBWorkFlights.has(key))return {ok:false,code:'REFRESH_ALREADY_IN_PROGRESS'};
 return singleFlight(WBWorkFlights,key,()=>WBWorkRecovery.exclusive(key,async()=>{
   let w=await wbWorkRead(key);const previous=w.state;
   if(!['inactive','active_visible','active_hidden'].includes(previous))return {ok:false,code:'WORK_SESSION_NOT_INACTIVE',work:w};
   if(previous==='inactive'&&manualOperationActive(await getManualOperation(key)))return {ok:false,code:'WORK_RESUME_OPERATION_ACTIVE',work:w};
   const owner=await wbOwner(key),surface=await tabMessage(ctx.tab_id,{type:'WB_GET_IDENTITY'});
   const transit=async(next,patch={})=>{w=WBWorkSessionModel.transition(w,next,patch);await wbWorkSave(key,w);};
   try {
    if(previous==='inactive'){
      await transit('binding',{tab_id:ctx.tab_id,origin:ctx.identity.origin,ai_id:ctx.identity.ai_id,conversation_id:ctx.identity.conversation_id,start_intent_id:null,error:null});
      await transit('active_visible');
    }else await transit(previous==='active_visible'?'active_hidden':'active_visible',{error:null});
    const ack=await tabMessage(ctx.tab_id,{type:'WB_WORK_VISIBILITY',conversation_key:key,work:w,runtime_generation:surface.runtime_generation});
    const fresh=await tabMessage(ctx.tab_id,{type:'WB_GET_IDENTITY'});
    if(!fresh?.ok||WBRuntimePolicy.canonical(normalizeIdentity(fresh.identity))!==WBRuntimePolicy.canonical(normalizeIdentity(surface.identity))||fresh.runtime_generation!==surface.runtime_generation||WBRuntimePolicy.canonical(await wbOwner(key))!==WBRuntimePolicy.canonical(owner))throw wbError('WORK_VISIBILITY_CONTEXT_CHANGED');
    if(ack?.ok!==true||ack.applied!==true)throw wbError('WORK_VISIBILITY_NOT_ACKNOWLEDGED');
    await diagnostic(previous==='inactive'?'WORK_SESSION_RESUMED_WITHOUT_PROMPT':'WORK_SESSION_VISIBILITY_CHANGED',{conversation_key:key,tab_id:ctx.tab_id,state:w.state,session_revision:w.revision,external_request_executed:false});
    return {ok:true,work:w,resumed_without_prompt:previous==='inactive'};
   }catch(error){
    const code=/^[A-Z0-9_]+$/.test(error.code||'')?error.code:'WORK_ACTION_FAILED';
    // Show and Hide both leave the provider gate closed if the UI is uncertain.
    // Resume failure remains an error; it must not masquerade as an active session.
    await transit(previous==='inactive'?'error':'active_hidden',{error:previous==='inactive'?{code}:null});
    return {ok:false,code,work:w};
   }
 }));
}

async function wbCreateContext(message,sender){wbPopupOnly(sender);const options=await wbOptions(),ai=message.ai_id,profile=WBAIDeliveryCapabilities.profile(ai);if(profile?.status!=='implemented'||!profile.origins?.length||!profile.new_conversation_path)throw wbError('AI_NOT_SUPPORTED');const origin=profile.origins[0];const tab=await chrome.tabs.create({url:origin+profile.new_conversation_path,active:true});const record={tab_id:tab.id,origin,ai_id:ai,prompt:options.bootstrap_text,expires_at:Date.now()+3600000,intent_id:crypto.randomUUID(),status:'pending_identity'};await storageSet({[WB_BOOT_PREFIX+tab.id]:record});return {ok:true,tab_id:tab.id};}
async function wbBootstrap(message,sender){
 if(!sender?.tab?.id||(sender.frameId??0)!==0)throw wbError('CONTENT_AUTHORITY_REQUIRED');
 const k=WB_BOOT_PREFIX+sender.tab.id,rec=(await storageGet(k))[k];
 if(!rec)return {ok:true,pending:false};
 if(rec.expires_at<Date.now()){
  await storageRemove(k);
  return {ok:true,pending:false,expired:true};
 }
 const origin=new URL(sender.url||sender.tab.url).origin;if(origin!==rec.origin)throw wbError('BOOTSTRAP_ORIGIN_CHANGED');
 // A bootstrap draft is temporary UI state. Once a real identity exists it is
 // consumed, but it never auto-binds that identity or authorizes a send.
 const identity=await tabIdentity(sender.tab.id);
 if(identity.status==='confirmed'&&identity.conversation_id){
  const key=await resolveConfirmedConversationKey(identity);
  const bound=Boolean(await bindingForConversationKey(key));
  await storageRemove(k);
  return {ok:true,pending:false,bound,requires_work_start:true,identity_resolved:true};
 }
 return {ok:true,pending:true,prompt:rec.prompt,intent_id:rec.intent_id,origin:rec.origin,ai_id:rec.ai_id,requires_work_start:true};
}
async function wbGetDelivery(message,sender){return WBDeliveryTransactions.get(message,sender);}
async function wbDeliveryPrepare(message,sender){return WBDeliveryTransactions.prepare(message,sender);}
async function wbManualCommit(message,sender){return WBDeliveryTransactions.commit(message,sender);}
async function wbExtraMessage(message,sender){
 switch(message.type){
 case 'WB_GET_QUOTA_STATE':return wbQuotaState(sender);
 case 'WB_AUTO_DELIVERY_STAGED':return wbManualAutoStage(message,sender);
 case 'WB_AUTO_MANUAL_SEND_CONFIRMED':return wbConfirmManualAuto(message,sender);
 case 'WB_GET_RUNTIME_OPTIONS':{if(!sender?.tab&&message.tab_id)wbPopupOnly(sender);return {ok:true,options:await wbTabOptions(Number(sender?.tab?.id||message.tab_id)||null)};}
 case 'WB_SAVE_RUNTIME_OPTIONS':return wbSaveOptions(message.options,sender,message.tab_id??null);
 case 'WB_WORK_RECOVERY_RESUME':return WBWorkRecovery.resume(message,sender);
 case 'WB_WORK_ACTION':return wbWorkAction(message,sender);
 case 'WB_WORK_STATE':{const key=await wbSenderKey(message,sender);return {ok:true,work:await wbWorkRead(key)};}
 case 'WB_NEW_CONTEXT':return wbCreateContext(message,sender);
 case 'WB_BOOTSTRAP_STATE':return wbBootstrap(message,sender);
 case 'WB_DELIVERY_FILES_STAGED':return wbFilesStaged(message,sender);
 case 'WB_DELIVERY_PREPARE':return wbDeliveryPrepare(message,sender);
 case 'WB_MANUAL_DELIVERY_COMMIT_REQUEST':return wbManualCommit(message,sender);
 default:throw wbError('UNKNOWN_RUNTIME_MESSAGE');
 }
}
function wbInstallPorts(){
 if(!chrome.runtime.onConnect)return;
 chrome.runtime.onConnect.addListener(port=>{
  if(port.name!=='WB_FILE_V1')return;let disconnected=false,chain=Promise.resolve();
  port.onDisconnect.addListener(()=>{disconnected=true});
  port.onMessage.addListener(m=>{chain=chain.then(async()=>{
   if(disconnected)return;
   try{
    const before=await wbGetDelivery(m,port.sender),descriptors=before.meta.artifact_refs||before.record.artifact_refs||[];
    if(!descriptors.some(d=>d.ref===m.ref))throw wbError('ARTIFACT_NOT_IN_DELIVERY');
    const owner=await wbOwner(before.key),chunk=await wbArtifacts().chunk(m.ref,owner,m.index);
    // IndexedDB/chunk hashing can yield across account, route, runtime or Finish.
    // Revalidate before transferring bytes into the content process.
    const after=await wbGetDelivery(m,port.sender);
    if(after.record.operation_id!==before.record.operation_id||!(after.meta.artifact_refs||after.record.artifact_refs||[]).some(d=>d.ref===m.ref))throw wbError('ARTIFACT_NOT_IN_DELIVERY');
    if(WBRuntimePolicy.canonical(await wbOwner(after.key))!==WBRuntimePolicy.canonical(owner))throw wbError('ARTIFACT_OWNER_CHANGED');
    if(!disconnected)port.postMessage({ok:true,ref:m.ref,...chunk});
   }catch(e){if(!disconnected)port.postMessage({ok:false,code:/^[A-Z0-9_]+$/.test(e.code||'')?e.code:'ARTIFACT_TRANSPORT_FAILED'})}
  }).catch(()=>{/* channel closed; no replay or provider refetch */});});
 });
}
wbInstallPorts();
// Alarms never re-execute provider work. Content startup performs normal recovery.
if(chrome.alarms?.onAlarm)chrome.alarms.onAlarm.addListener(async a=>{
 const quota=String(a.name||'').match(/^wb-quota:wbmb_runtime_policy:quota:([a-f0-9]{64}):(\w{1,80})$/);
 if(quota){
  const account_scope=quota[1],family=quota[2];
  try{const state=await WBPolicyEngine.eligibility(account_scope,family);await diagnostic(state.eligible?'QUOTA_ELIGIBILITY_REACHED':'QUOTA_WAIT_REMAINS',{account_scope,family,next_at:state.next_at,automatic_retry:false});}
  catch(e){await diagnostic('QUOTA_NOTIFICATION_FAILED',{account_scope,family,code:e.code||'QUOTA_STATE_UNAVAILABLE',automatic_retry:false});}
 }
 if(a.name==='wb-artifact-prune')await wbArtifacts().prune().catch(()=>null);
});
if(chrome.alarms)chrome.alarms.create('wb-artifact-prune',{periodInMinutes:60});

function wbSafeRuntimeText(value,credentials){
 let text=String(value||'');
 for(const v of new Set([credentials?.token,credentials?.clientId,credentials?.apiKey,credentials?.clientSecret].filter(v=>typeof v==='string'&&v.length>=4)))text=text.split(v).join('[REDACTED_CREDENTIAL]');
 // Public product URLs remain useful; expiring signed/token-bearing URLs do not.
 return text.replace(/https?:\/\/[^\s"<>\\]+/g,url=>/[?&](?:x-amz-signature|signature|sig|token|access_token|authorization)=/i.test(url)?'[REDACTED_SIGNED_URL]':url);
}
async function wbExecuteProvider(commandText,context,settings,beforeDispatch=null){
 if(context?.mode!=='manual')throw wbError('WB_AUTORUN_NON_PRODUCTION');
 if(!context?.key)throw wbError('PROVIDER_CONTEXT_REQUIRED');
 const command=WBContract.parseCommand(commandText),meta=WBRuntimePolicy.operationAuthority(WBContract.OPERATIONS)[command.operation],options=await wbOptions();
 WBRuntimePolicy.admission(meta,{personal_data:options.personal_data});
 const owner=await wbOwner(context.key),family=meta.host;let calls=0,physicalHash=null,boundaryError=null;
 const logicalId=context.logical_request_id||'wb-logical-'+crypto.randomUUID(),physicalId='wb-physical-'+crypto.randomUUID();
 const logicalHash=await WBRuntimePolicy.hash(WBRuntimePolicy.canonical(JSON.parse(JSON.stringify(command))));
 const startCredentials=JSON.stringify(settings.sellerCredentials);
 const guarded=async(...args)=>{
   try {
   if(calls)throw wbError('HIDDEN_REQUEST_BLOCKED');
   const record=context.mode==='manual'?await getManualOperation(context.key):await getAutoRun(context.key);
   if(!record||String(record.operation_id||record.run_id)!==context.id||record.status!=='requesting'||record.finish_requested||record.pause_requested)throw wbError('PROVIDER_OWNER_CHANGED');
   await assertRunBinding(record);await assertTabConversation(context.tabId,context.key,record.conversation_id);
   if(JSON.stringify((await getSettings()).sellerCredentials)!==startCredentials)throw wbError('CREDENTIAL_SCOPE_CHANGED');
   const eligible=await WBPolicyEngine.reserve(owner.account_scope,family,0);
   if(!eligible.allowed){const error=wbError('QUOTA_WAIT_NEW_EXPLICIT_COMMAND_REQUIRED');error.next_eligible_at=eligible.next_at;throw error;}
   physicalHash=await WBRuntimePolicy.hash(WBRuntimePolicy.canonical({url:args[0],method:args[1]?.method,body:args[1]?.body??null}));
   await diagnostic('PROVIDER_DISPATCH_INTENT',{logical_request_id:logicalId,physical_request_id:physicalId,logical_fingerprint:logicalHash,physical_fingerprint:physicalHash,operation:command.operation,external_request_executed:false,automatic_retry:false}).catch(()=>null);
   if(beforeDispatch)await beforeDispatch({logical_request_id:logicalId,logical_fingerprint:logicalHash,physical_request_id:physicalId,physical_fingerprint:physicalHash});
   // Persistence/diagnostics can yield. Revalidate ownership before the one
   // physical fetch; a known pre-fetch cancellation has a zero call count.
   await assertTabConversation(context.tabId,context.key,record.conversation_id);
   const finalRecord=context.mode==='manual'?await getManualOperation(context.key):await getAutoRun(context.key);
   if(!finalRecord||String(finalRecord.operation_id||finalRecord.run_id)!==context.id||finalRecord.status!=='requesting'||finalRecord.finish_requested||finalRecord.pause_requested)throw wbError('PROVIDER_OWNER_CHANGED');
   if(WBRuntimePolicy.canonical(await wbOwner(context.key))!==WBRuntimePolicy.canonical(owner))throw wbError('CREDENTIAL_SCOPE_CHANGED');
   calls++;
   } catch(error) { boundaryError=error; throw error; }
   return fetch(...args);
 };
 const sink=async(bytes,info)=>{
   // Owner snapshot is captured before the provider call, never silently reassigned.
   return wbArtifacts().put(bytes,owner,{name:info.name,mime:info.mime,requestId:info.requestId,sourceKind:'original_provider_file',artifactKey:'provider:'+String(info.requestId||''),personalDataRequired:options.personal_data===true});
 };
 const quarantine=async(bytes,info)=>wbArtifacts().put(bytes,owner,{name:info.name,mime:info.mime,requestId:info.requestId,sourceKind:'unverified_provider_response',artifactKey:'quarantine:'+info.requestId,personalDataRequired:true});
 const provider=WBProviderFactory.createWBProvider({fetchImpl:guarded,artifactSink:sink,quarantineSink:quarantine});
 let result;
 try { result=await provider.executeCommand(commandText,settings.sellerCredentials); }
 catch(error) { const actual=boundaryError||error; actual.physical_request_count=calls; actual.external_request_executed=calls>0; actual.message=wbSafeRuntimeText(actual.message,settings.sellerCredentials); throw actual; }
 let quotaPersistenceError=false;
 if(result.response_meta?.retry_after)try {await WBPolicyEngine.observeRetryAfter(owner.account_scope,family,result.response_meta.retry_after);} catch(_) {quotaPersistenceError=true;} 
 let report=wbSafeRuntimeText(result.report_text,settings.sellerCredentials);
 try {const env=JSON.parse(report.replace(/^WB_RESULT_V1\s*/,''));env.request_meta={...env.request_meta,logical_command_count:1,logical_request_id:logicalId,physical_request_id:calls?physicalId:null,provider_response_request_id:result.request_id,physical_request_count:calls,external_request_executed:calls===1,logical_fingerprint:logicalHash,logical_fingerprint_version:'canonical-normalized-wb-v1',physical_fingerprint:physicalHash,exact_request_preserved:true,automatic_retry:false,account_scope:owner.account_scope,verification:result.verification||'STRUCTURAL_ONLY_WB_SCHEMA_PENDING',verification_details:result.verification_details||null,quota_persistence_error:quotaPersistenceError};report='WB_RESULT_V1\n'+JSON.stringify(env,null,2);}catch(_){throw wbError('RESULT_ENVELOPE_INVALID');}
 await diagnostic('PROVIDER_RESPONSE_RECORDED',{logical_request_id:logicalId,physical_request_id:calls?physicalId:null,request_id:result.request_id,operation:command.operation,http_status:result.http_status,ok:result.ok,external_request_executed:calls===1}).catch(()=>null);
 return {...result,report_text:report,auto_send:settings.autoSend,physical_request_count:calls,external_request_executed:calls>0};
}
async function wbFilesStaged(message,sender){return WBDeliveryTransactions.attached(message,sender);}

// The only WB_FILE_V1 executor. Existing local bytes, no provider construction,
// no fetch, no report/task status lookup and no automatic continuation.
async function wbReadLocalFile(command,context){
 if(!context?.key)throw wbError('LOCAL_FILE_OWNER_REQUIRED');
 const checked=WBDeliveryPolicy.parseLocal(WBDeliveryPolicy.localCommand(command?.ref));
 const owner=await wbOwner(context.key),record=await wbArtifacts().read(checked.ref,owner);
 const retained=record.source_kind==='generated_bridge_text'&&String(record.artifact_key).startsWith('bridge-retained:');
 const original=record.source_kind==='original_provider_file'&&String(record.artifact_key).startsWith('provider:')&&typeof record.personal_data_required==='boolean';
 if(!retained&&!original)throw wbError('LOCAL_FILE_TYPE_MISMATCH');
 if(record.personal_data_required&&(await wbOptions()).personal_data!==true)throw wbError('PERSONAL_DATA_DISABLED');
 if(WBRuntimePolicy.canonical(await wbOwner(context.key))!==WBRuntimePolicy.canonical(owner))throw wbError('LOCAL_FILE_OWNER_CHANGED');
 const descriptor=await wbArtifacts().describe(record.ref,owner),requestId='wb-local-file-'+crypto.randomUUID();
 return {ok:true,http_status:0,request_id:requestId,operation:'bridge_file_get',artifact_refs:[descriptor],report_text:'WB_RESULT_V1\n'+JSON.stringify({bridge:'wildberries-llm-api-bridge',version:WBContract.VERSION,request_id:requestId,operation:'bridge_file_get',http_status:0,request_meta:{provider:'bridge_local',physical_request_count:0,external_request_executed:false,automatic_retry:false},result:{artifact:descriptor,source_request_id:record.request_id,bytes_reused:true,provider_request_repeated:false}})};
}

// Delivery-only wake. Never calls an execution entry point, never repeats WB.
async function wbWakePendingDeliveries(){
 const saved=await storageGet([KEYS.MANUAL_OPERATIONS,KEYS.AUTO_RUNS]);
 const all=[...Object.values(saved[KEYS.MANUAL_OPERATIONS]||{}),...Object.values(saved[KEYS.AUTO_RUNS]||{})];
 for(const record of all){if(record?.status!=='delivering'||!record.tab_id||!record.conversation_key)continue;
  try {await assertRunBinding(record);await assertTabConversation(record.tab_id,record.conversation_key,record.conversation_id);await tabMessage(record.tab_id,{type:'WB_DELIVERY_WAKE',conversation_key:record.conversation_key});}catch(_){/* wrong/dead owner: no cross-chat recovery */}
 }
}
if(chrome.alarms?.onAlarm){chrome.alarms.onAlarm.addListener(async a=>{if(a.name==='wb-delivery-wake')await wbWakePendingDeliveries().catch(()=>null);});chrome.alarms.create('wb-delivery-wake',{periodInMinutes:1});}

async function wbManualAutoStage(message,sender){
 const d=await wbGetDelivery(message,sender);if(d.manual||d.record.status!=='delivering'||d.record.delivery?.phase!=='claimed')throw wbError('AUTO_DELIVERY_NOT_CLAIMED');
 if(d.record.auto_send!==false)throw wbError('MANUAL_STAGE_MODE_MISMATCH');
 await mutateAutoRun(d.key,r=>r?.run_id===d.record.run_id?{...r,delivery:{...r.delivery,manual_send_wait:true,manual_baseline_users:Array.isArray(message.baseline_user_turn_ids)?message.baseline_user_turn_ids:[],manual_assistant_baseline:Array.isArray(message.assistant_baseline_ids)?message.assistant_baseline_ids:[]}}:r);
 return {ok:true,waiting_manual_send:true};
}
async function wbConfirmManualAuto(message,sender){
 const d=await wbGetDelivery(message,sender),run=d.record;if(d.manual||!run.delivery?.manual_send_wait||typeof message.confirmed_user_turn_id!=='string'||!message.confirmed_user_turn_id)throw wbError('MANUAL_SEND_NOT_CONFIRMED');
 const check=await tabMessage(run.tab_id,{type:'WB_CHECK_USER_DELIVERY',conversation_key:d.key,request_id:run.delivery.request_id,user_turn_id:message.confirmed_user_turn_id,baseline_user_turn_ids:run.delivery.manual_baseline_users});
 if(!check?.ok||!check.matched)throw wbError('MANUAL_SEND_DOM_NOT_CONFIRMED');
 await mutateAutoRun(d.key,r=>{if(r?.run_id!==run.run_id||!r.delivery?.manual_send_wait)return r;const next=BridgeAutorunModel.commitDelivery(r,{deliveryId:r.delivery.delivery_id,baselineUserTurnIds:r.delivery.manual_baseline_users,actorId:'operator-manual-send-confirmed'});next.delivery.manual_send_wait=false;return next;});
 const result=await completeAutoDelivery({conversation_key:d.key,run_id:run.run_id,delivery_id:run.delivery.delivery_id,delivery_confirmed:true,confirmed_user_turn_id:message.confirmed_user_turn_id,composer_empty:true,click_attempts:0,assistant_baseline_ids:run.delivery.manual_assistant_baseline||[]},sender);
 return {ok:true,run:result,bridge_send_clicks:0};
}
async function wbQuotaState(sender){wbPopupOnly(sender);const scope=await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials));const all=await storageGet(null);const prefix='wbmb_runtime_policy:quota:'+scope+':';return {ok:true,observations:Object.entries(all).filter(([k])=>k.startsWith(prefix)).map(([k,v])=>({family:k.slice(prefix.length),next_at:Number(v?.next_at||0),remaining_ms:Math.max(0,Number(v?.next_at||0)-Date.now()),automatic_retry:false})),configured_wb_intervals:false};}
