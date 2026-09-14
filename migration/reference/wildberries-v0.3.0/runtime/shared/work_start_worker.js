/* Provider-neutral Work Start transaction, adapted from the pinned Ozon
 * create/commit/outcome/watch/pending-identity chain. No provider dispatch.
 * Storage commit/readback precedes the only permitted Send. Recovery is proof-only.
 */
(() => {
  'use strict';
  const PREFIX='wb_work_pending_start_v2:', SEQ='wb_work_start_revision_v2:';
  const flights=new Map(), locks=new Map();
  const terminal=p=>!p||['completed','cancelled','failed','expired'].includes(p.phase);
  const safeId=v=>typeof v==='string'&&v.length>0&&v.length<=300;
  const ids=v=>Array.isArray(v)&&v.length<=5000&&v.every(safeId)?[...new Set(v)]:[];
  const error=code=>Object.assign(new Error(code),{code});
  const iso=()=>new Date().toISOString();
  const keyOf=s=>s.identity.conversation_id?`${s.identity.origin}|${s.identity.conversation_id}`:null;
  const same=(a,b)=>a?.intent_id===b?.intent_id&&Number(a?.revision)===Number(b?.revision);
  const normalized=v=>String(v||'').replace(/\s+/g,' ').trim();
  function lock(tab,fn){const prev=locks.get(tab)||Promise.resolve(),p=prev.then(fn,fn);locks.set(tab,p);return p.finally(()=>{if(locks.get(tab)===p)locks.delete(tab);});}
  async function read(tab){return (await storageGet(PREFIX+tab))[PREFIX+tab]||null;}
  async function save(tab,p){await storageSet({[PREFIX+tab]:p});const actual=await read(tab);if(!actual||WBRuntimePolicy.canonical(actual)!==WBRuntimePolicy.canonical(p))throw error('WORK_START_COMMIT_READBACK_FAILED');return actual;}
  async function surface(tab){
    const r=await tabMessage(normalizeTabId(tab),{type:'WB_GET_IDENTITY'});
    if(!r?.ok||!r.identity)throw error('WORK_START_IDENTITY_UNAVAILABLE');
    const identity=normalizeIdentity(r.identity),generation=String(r.runtime_generation||r.runtime_id||'');
    if(!generation)throw error('WORK_START_RUNTIME_GENERATION_REQUIRED');
    const account_scope=await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials));
    const key=identity.conversation_id?identity.origin+'|'+identity.conversation_id:null,binding=key?await bindingForConversationKey(key):null;
    return {identity,generation,account_scope,binding_snapshot:binding?bindingSnapshot(binding):null};
  }
  function checkSurface(p,s){
    if(p.origin!==s.identity.origin||p.ai_id!==s.identity.ai_id)throw error('WORK_PENDING_IDENTITY_MISMATCH');
    if(p.observed_conversation_id&&p.observed_conversation_id!==s.identity.conversation_id)throw error('WORK_PENDING_CONVERSATION_CHANGED');
    if(p.account_scope&&p.account_scope!==s.account_scope)throw error('WORK_START_ACCOUNT_CHANGED');
    if(p.binding_authority_version===1&&WBRuntimePolicy.canonical(p.binding_snapshot)!==WBRuntimePolicy.canonical(s.binding_snapshot))throw error('WORK_START_BINDING_CHANGED');
  }
  async function event(name,p,extra={}){await diagnostic(name,{intent_id:p?.intent_id,revision:p?.revision,tab_id:p?.tab_id,external_request_executed:false,...extra}).catch(()=>null);}
  async function messageOwner(m,sender,{watch=false,allowExpired=false}={}){
    if(!sender?.tab?.id||(sender.frameId??0)!==0)throw error('CONTENT_AUTHORITY_REQUIRED');
    const tab=normalizeTabId(sender.tab.id),p=await read(tab);
    if(!same(p,m))throw error('WORK_PENDING_STALE_OR_INVALID');
    const s=await surface(tab);checkSurface(p,s);
    if(!p.account_scope)throw error('WORK_START_ACCOUNT_AUTHORITY_MISSING');
    if(p.binding_authority_version!==1)throw error('WORK_START_BINDING_AUTHORITY_MISSING');
    const claimed=normalizeIdentity(m.identity||{});
    if(claimed.origin!==s.identity.origin||claimed.ai_id!==s.identity.ai_id||claimed.conversation_id!==s.identity.conversation_id)throw error('WORK_PENDING_IDENTITY_MISMATCH');
    const senderOrigin=new URL(sender.url||sender.tab.url).origin;
    if(senderOrigin!==p.origin)throw error('WORK_PENDING_IDENTITY_MISMATCH');
    if(!safeId(m.runtime_generation)||m.runtime_generation!==s.generation)throw error('WORK_START_GENERATION_MISMATCH');
    const expected=watch?p.watch_generation:p.content_runtime_generation||p.dispatch_runtime_generation;
    if(expected&&expected!==s.generation)throw error('WORK_START_GENERATION_MISMATCH');
    if(terminal(p))throw error('WORK_PENDING_TERMINAL');
    if(!allowExpired&&p.expires_at<=iso())throw error('WORK_PENDING_TIMEOUT');
    return {tab,p,s};
  }
  async function failKnown(p,code){
    if(p.conversation_key){const k=p.conversation_key,raw=(await storageGet(WB_WORK_PREFIX+k))[WB_WORK_PREFIX+k],w=WBWorkSessionModel.normalize(raw,k);
      if(w.revision===p.expected_session_revision||w.start_intent_id===p.intent_id){
        const next=WBWorkSessionModel.transition(w,'error',{error:{code}});await wbWorkSave(k,next);
      }
    }
  }
  async function dispatch(tab,p,text){
    const before=await read(tab);if(!same(before,p)||terminal(before)||before.send_commit_actor_id)return;
    const s=await surface(tab);checkSurface(before,s);
    if(s.generation!==before.dispatch_runtime_generation)throw error('WORK_START_GENERATION_MISMATCH');
    await event('WORK_START_CONTENT_DISPATCHED',p);
    const result=await tabMessage(tab,{type:'WB_WORK_SEND_INITIAL_PROMPT',intent_id:p.intent_id,revision:p.revision,origin:p.origin,ai_id:p.ai_id,expected_conversation_id:p.observed_conversation_id,runtime_generation:p.dispatch_runtime_generation,prompt_text:text,expires_at:p.expires_at});
    if(!result?.ok||result.sent!==true){
      await lock(tab,async()=>{const latest=await read(tab);if(!same(latest,p)||terminal(latest))return;
        if(latest.send_commit_actor_id&&latest.send_outcome!=='failed_before_irreversible_click'){
          // A lost outer callback is not a second Send authorization.
          const channelLost=['TAB_MESSAGE_ERROR','EMPTY_RESPONSE','TAB_MESSAGE_TIMEOUT'].includes(result?.code);
          await event(channelLost?'WORK_START_CONTENT_RESPONSE_LOST_NO_RETRY':'WORK_START_CONTENT_NEGATIVE_RESPONSE_NO_RETRY',latest,{content_response_code:result?.code||null,send_outcome:latest.send_outcome});return;
        }
        const code='WORK_START_SEND_FAILED';await save(tab,{...latest,phase:'failed',error:{code},terminal_at:iso()});await failKnown(latest,code);
      });
    }
  }
  async function start(m,sender){
    wbPopupOnly(sender);const tab=normalizeTabId(m.tab_id);
    const result=await lock(tab,async()=>{
      const s=await surface(tab),expected=m.identity&&normalizeIdentity(m.identity);
      if(expected&&(expected.origin!==s.identity.origin||expected.ai_id!==s.identity.ai_id||expected.conversation_id!==s.identity.conversation_id))throw error('POPUP_CONTEXT_STALE');
      let old=await read(tab);
      if(!terminal(old)){
        try{checkSurface(old,s);}catch(e){
          if(!['WORK_PENDING_IDENTITY_MISMATCH','WORK_PENDING_CONVERSATION_CHANGED','WORK_START_ACCOUNT_CHANGED'].includes(e.code))throw e;
          // An explicit Start in a different owner context cannot resume or
          // replay the old attempt. Preserve its uncertain outcome separately.
          const history={...old,phase:'cancelled',terminal_at:iso(),cancel_reason:e.code,automatic_retry:false};
          const historyKey='wb_work_start_history_v1:'+old.intent_id;
          await storageSet({[historyKey]:history});
          if(WBRuntimePolicy.canonical((await storageGet(historyKey))[historyKey])!==WBRuntimePolicy.canonical(history))throw error('WORK_START_HISTORY_READBACK_FAILED');
          old=await save(tab,history);await event('WORK_START_OLD_OWNER_RETIRED',old,{reason:e.code});
        }
      }
      if(!terminal(old)){
        if(old.expires_at>iso()||old.send_commit_actor_id)return {ok:true,accepted:false,code:'WORK_START_ALREADY_PENDING',pending_start:old};
        await save(tab,{...old,phase:'expired',terminal_at:iso(),error:{code:'WORK_PENDING_TIMEOUT'}});
      }
      const key=keyOf(s),w=key?await wbWorkRead(key):WBWorkSessionModel.normalize(null,null);
      if(['active_visible','active_hidden'].includes(w.state))throw error('WORK_SESSION_ALREADY_ACTIVE');
      if(!['inactive','error'].includes(w.state))throw error('WORK_START_ALREADY_IN_PROGRESS');
      // Retired NON_PROD Autorun records retain historical truth but cannot
      // acquire or watch in this product. They must not create a permanent
      // busy state for an explicit Work Start. Live manual results still gate it.
      if(key){const manual=await getManualOperation(key);if(manualOperationActive(manual))throw error('WORK_START_COMPETING_OPERATION');}
      const prompt=key?await getAutoStartPrompt(key):await getGlobalAutoStartPrompt();
      const text=String(prompt.text);
      if(!text.trim()||text.length>100000)throw error('WORK_START_PROMPT_INVALID');
      const seq=Number((await storageGet(SEQ+tab))[SEQ+tab]||0);
      if(!Number.isSafeInteger(seq)||seq<0||!Number.isSafeInteger(w.revision)||w.revision<0||Math.max(seq,w.revision)>=Number.MAX_SAFE_INTEGER)throw error('WORK_START_REVISION_CORRUPT');
      const revision=Math.max(seq,w.revision)+1;
      const p={version:2,state:'pending_identity',phase:'pending',intent_id:'work-start-'+crypto.randomUUID(),revision,tab_id:tab,origin:s.identity.origin,ai_id:s.identity.ai_id,account_scope:s.account_scope,binding_authority_version:1,binding_snapshot:s.binding_snapshot,conversation_key:key,expected_session_revision:w.revision,created_at:iso(),expires_at:new Date(Date.now()+120000).toISOString(),prompt_delivered:false,observed_conversation_id:s.identity.conversation_id,first_response_complete:false,send_commit_actor_id:null,send_committed_at:null,send_outcome:'not_started',assistant_baseline_ids:[],baseline_user_turn_ids:[],content_runtime_generation:null,watch_generation:null,dispatch_runtime_generation:s.generation,prompt_sha256:await sha256Hex(normalized(text))};
      await storageSet({[SEQ+tab]:revision});await save(tab,p);await event('WORK_START_PENDING_PERSISTED',p);
      // Never await the content's commit/outcome while retaining the tab write lock.
      const timer=setTimeout(()=>{const job=dispatch(tab,p,text).catch(async e=>{
        await lock(tab,async()=>{const live=await read(tab);if(same(live,p)&&!terminal(live)&&!live.send_commit_actor_id){await save(tab,{...live,phase:'failed',terminal_at:iso(),error:{code:e.code||'WORK_START_DISPATCH_FAILED'}});await failKnown(live,e.code||'WORK_START_DISPATCH_FAILED');}}).catch(()=>null);
      }).finally(()=>flights.delete(p.intent_id));flights.set(p.intent_id,job);},0);
      return {ok:true,accepted:true,pending_start:p,work:{...w,state:'pending_identity',start_intent_id:p.intent_id}};
    });return result;
  }
  async function commit(m,sender){return lock(sender?.tab?.id,async()=>{
    const {tab,p,s}=await messageOwner(m,sender);
    if(!safeId(m.actor_id))throw error('WORK_START_ACTOR_REQUIRED');
    if(![m.baseline_user_turn_ids,m.assistant_baseline_ids].every(v=>Array.isArray(v)&&v.length<=5000&&v.every(safeId)))throw error('WORK_START_BASELINE_INVALID');
    if(p.send_commit_actor_id)return {ok:true,committed:true,click_allowed:false,code:'WORK_START_ALREADY_COMMITTED_NO_RETRY',pending_start:p};
    const next={...p,phase:'send_committed',send_commit_actor_id:m.actor_id,send_committed_at:iso(),send_outcome:'committed_before_click',content_runtime_generation:s.generation,watch_generation:s.generation,baseline_user_turn_ids:ids(m.baseline_user_turn_ids),assistant_baseline_ids:ids(m.assistant_baseline_ids)};
    await save(tab,next);await event('WORK_START_SEND_COMMIT_ACK',next);
    const persisted=await read(tab);if(!same(persisted,next)||terminal(persisted))throw error('WORK_PENDING_STALE_OR_INVALID');
    const fresh=await surface(tab);checkSurface(next,fresh);if(fresh.generation!==s.generation)throw error('WORK_START_GENERATION_MISMATCH');
    return {ok:true,committed:true,click_allowed:true,intent_id:p.intent_id,revision:p.revision};
  });}
  async function proof(tab,p,s){
    const v=await tabMessage(tab,{type:'WB_WORK_START_PROOF',...watchPayload(p),runtime_generation:s.generation});
    const current=await surface(tab);checkSurface(p,current);
    if(current.generation!==s.generation||!v?.ok||v.runtime_generation!==s.generation)throw error('WORK_START_PROOF_INVALID');
    const id=normalizeIdentity(v.identity||{});if(id.origin!==current.identity.origin||id.ai_id!==current.identity.ai_id||id.conversation_id!==current.identity.conversation_id)throw error('WORK_START_PROOF_INVALID');
    const user=safeId(v.user_turn_id)&&!p.baseline_user_turn_ids.includes(v.user_turn_id)&&v.matched===true;
    const assistant=user&&v.complete===true&&safeId(v.assistant_turn_id)&&!p.assistant_baseline_ids.includes(v.assistant_turn_id);
    return {...v,user,assistant};
  }
  function watchPayload(p){return {intent_id:p.intent_id,revision:p.revision,origin:p.origin,ai_id:p.ai_id,conversation_id:p.observed_conversation_id,prompt_sha256:p.prompt_sha256,baseline_user_turn_ids:p.baseline_user_turn_ids,assistant_baseline_ids:p.assistant_baseline_ids,runtime_generation:p.watch_generation||p.content_runtime_generation||p.dispatch_runtime_generation,expires_at:p.expires_at,user_turn_id:p.user_turn_id||null,send_outcome:p.send_outcome};}
  async function watch(tab,p){return tabMessage(tab,{type:'WB_WORK_START_WATCH',...watchPayload(p)});}
  async function outcome(m,sender){
    const result=await lock(sender?.tab?.id,async()=>{
      const {tab,p,s}=await messageOwner(m,sender);
      if(!p.send_commit_actor_id||p.send_commit_actor_id!==m.actor_id)throw error('WORK_START_SEND_ACTOR_MISMATCH');
      if(p.send_outcome==='sent_acknowledged')return {ok:true,accepted:true,send_outcome:p.send_outcome,pending_start:p};
      let v=null;if(m.click_event_observed===true&&m.composer_empty===true)v=await proof(tab,p,s);
      const send_outcome=m.click_event_observed===true?(m.composer_empty===true&&v?.user&&m.user_turn_id===v.user_turn_id?'sent_acknowledged':'outcome_unknown_no_retry'):'failed_before_irreversible_click';
      const next={...p,phase:send_outcome==='sent_acknowledged'?'waiting_response':send_outcome==='failed_before_irreversible_click'?'failed':'unknown_no_retry',send_outcome,prompt_delivered:send_outcome==='sent_acknowledged',observed_conversation_id:p.observed_conversation_id||s.identity.conversation_id,watch_generation:s.generation,user_turn_id:v?.user?v.user_turn_id:null};
      if(next.phase==='failed'){next.error={code:'WORK_START_SEND_FAILED'};next.terminal_at=iso();}
      await save(tab,next);await event('WORK_START_SEND_OUTCOME',next,{send_outcome,send_state:send_outcome==='sent_acknowledged'?'CONFIRMED_SENT':send_outcome==='failed_before_irreversible_click'?'CONFIRMED_NOT_SENT':'POSSIBLY_SENT_UNCONFIRMED',click_event_observed:m.click_event_observed===true,composer_empty:m.composer_empty===true,new_user_turn_matched:v?.user===true,user_turn_id:v?.user?v.user_turn_id:null});
      if(next.phase==='failed')await failKnown(next,'WORK_START_SEND_FAILED');
      await event('WORK_START_WORKER_ACK_RECEIVED',next,{send_outcome});
      return {ok:true,accepted:true,send_outcome,no_retry:true,pending_start:next};
    });
    if(result.pending_start.phase!=='failed')await watch(sender.tab.id,result.pending_start);
    return result;
  }
  async function observe(m,sender){return lock(sender?.tab?.id,async()=>{
    const {tab,p,s}=await messageOwner(m,sender,{watch:true});
    if(!p.prompt_delivered||p.send_outcome!=='sent_acknowledged')return {ok:false,waiting:true,code:'WORK_START_SEND_NOT_ACKNOWLEDGED'};
    if(!s.identity.conversation_id)return {ok:true,waiting:true};
    const v=await proof(tab,p,s);
    if(m.first_response_complete!==true||!v.assistant||m.assistant_turn_id!==v.assistant_turn_id)return {ok:true,waiting:true};
    const key=keyOf(s),raw=(await storageGet(WB_WORK_PREFIX+key))[WB_WORK_PREFIX+key];let w=WBWorkSessionModel.normalize(raw,key);
    if(w.start_intent_id!==p.intent_id&&w.revision!==p.expected_session_revision)throw error('WORK_SESSION_STALE_EVENT');
    let transaction={...p,phase:'activating',conversation_key:key,observed_conversation_id:s.identity.conversation_id,first_response_complete:true,confirmed_assistant_turn_id:v.assistant_turn_id};await save(tab,transaction);
    if(!await bindingForConversationKey(key)){
      const binding=await bindConversation({tab_id:tab,origin:s.identity.origin,conversation_id:s.identity.conversation_id},{requireUnbound:true,additionalBindingCommit:record=>({[PREFIX+tab]:{...transaction,binding_snapshot:bindingSnapshot(record)}})});
      transaction={...transaction,binding_snapshot:bindingSnapshot(binding)};
    }
    if(w.state!=='binding'){
      if(!['inactive','error'].includes(w.state))throw error('WORK_PENDING_BINDING_STATE_INVALID');
      w=WBWorkSessionModel.transition(w,'binding',{tab_id:tab,origin:s.identity.origin,ai_id:s.identity.ai_id,conversation_id:s.identity.conversation_id,start_intent_id:p.intent_id,error:null});await wbWorkSave(key,w);
    }
    const fresh=await surface(tab);checkSurface(transaction,fresh);if(fresh.generation!==s.generation)throw error('WORK_START_GENERATION_MISMATCH');
    w=WBWorkSessionModel.transition(w,'active_visible',{error:null});
    const completed={...transaction,phase:'completed',terminal_at:iso()};await storageSet({[WB_WORK_PREFIX+key]:w,[PREFIX+tab]:completed});
    const activation=await storageGet([WB_WORK_PREFIX+key,PREFIX+tab]);if(WBRuntimePolicy.canonical(activation[WB_WORK_PREFIX+key])!==WBRuntimePolicy.canonical(w)||WBRuntimePolicy.canonical(activation[PREFIX+tab])!==WBRuntimePolicy.canonical(completed))throw error('WORK_START_ACTIVATION_READBACK_FAILED');
    const ack=await tabMessage(tab,{type:'WB_WORK_VISIBILITY',conversation_key:key,work:w,runtime_generation:s.generation});
    return WBWorkRecovery.exclusive(key,async()=>{
      const live=WBWorkSessionModel.normalize((await storageGet(WB_WORK_PREFIX+key))[WB_WORK_PREFIX+key],key);
      // Finish/Refresh may have completed while the content acknowledgement was
      // in flight. A late Start callback has no authority over that newer state.
      if(live.revision!==w.revision||live.state!==w.state)return {ok:false,code:'WORK_SESSION_STALE_EVENT',work:live};
      let code=null;
      try{const after=await surface(tab);checkSurface(transaction,after);if(after.generation!==s.generation)throw error('WORK_START_GENERATION_MISMATCH');}
      catch(e){code=e.code||'WORK_START_CONTEXT_CHANGED';}
      if(!code&&(ack?.ok!==true||ack.applied!==true))code='WORK_VISIBILITY_NOT_ACKNOWLEDGED';
      if(code){w=WBWorkSessionModel.transition(w,'error',{error:{code}});await wbWorkSave(key,w);return {ok:false,code,work:w};}
      await event('WORK_START_ACTIVE_VISIBLE',transaction);return {ok:true,work:w,binding:await bindingForConversationKey(key)};
    });
  });}
  async function recover(m,sender){
    if(!sender?.tab?.id||(sender.frameId??0)!==0)throw error('CONTENT_AUTHORITY_REQUIRED');const tab=normalizeTabId(sender.tab.id);
    return lock(tab,async()=>{const p=await read(tab);if(terminal(p))return {ok:true,pending:false};const s=await surface(tab);checkSurface(p,s);
      if(!p.account_scope)throw error('WORK_START_ACCOUNT_AUTHORITY_MISSING');
    if(p.binding_authority_version!==1)throw error('WORK_START_BINDING_AUTHORITY_MISSING');
      const claimed=normalizeIdentity(m.identity||{});
      if(new URL(sender.url||sender.tab.url).origin!==p.origin||claimed.origin!==s.identity.origin||claimed.ai_id!==s.identity.ai_id||claimed.conversation_id!==s.identity.conversation_id)throw error('WORK_PENDING_IDENTITY_MISMATCH');
      if(m.runtime_generation!==s.generation)throw error('WORK_START_GENERATION_MISMATCH');
      if(p.expires_at<=iso())return {ok:false,pending:true,code:p.send_commit_actor_id?'WORK_START_SEND_OUTCOME_UNKNOWN_NO_RETRY':'WORK_PENDING_TIMEOUT',automatic_retry:false};
      // No provider or Send path is reachable from rehydration.
      if(!p.send_commit_actor_id)return {ok:true,pending:true,code:'WORK_START_NOT_COMMITTED',automatic_retry:false};
      let next={...p,watch_generation:s.generation};
      if(p.send_outcome!=='sent_acknowledged'){
        const v=await proof(tab,p,s);if(!v.user){await save(tab,{...next,phase:'unknown_no_retry',send_outcome:'outcome_unknown_no_retry'});return {ok:false,pending:true,code:'WORK_START_SEND_OUTCOME_UNKNOWN_NO_RETRY',automatic_retry:false};}
        next={...next,phase:'waiting_response',prompt_delivered:true,send_outcome:'sent_acknowledged',user_turn_id:v.user_turn_id};
      }
      next.observed_conversation_id=p.observed_conversation_id||s.identity.conversation_id;
      await save(tab,next);return {ok:true,pending:true,work_start_watch:watchPayload(next),automatic_retry:false};
    });
  }
  async function cancel(tab,reason){return lock(tab,async()=>{
    const p=await read(tab);if(terminal(p))return {ok:true,cancelled:false};
    await save(tab,{...p,phase:reason==='response_timeout'?'expired':'cancelled',terminal_at:iso(),cancel_reason:reason});
    await event('WORK_PENDING_START_CANCELLED',p,{reason});
    const ack=reason==='tab_closed'?null:await tabMessage(tab,{type:'WB_WORK_START_CANCEL',...watchPayload(p)});
    const confirmed=reason==='tab_closed'||ack?.ok===true&&ack.cancelled===true;
    await event('WORK_START_CONTENT_CANCEL_OUTCOME',p,{reason,cancellation_confirmed:confirmed,send_outcome:p.send_outcome});
    return {ok:confirmed,cancelled:true,...(confirmed?{}:{code:'WORK_START_CANCEL_NOT_CONFIRMED'}),work:WBWorkSessionModel.normalize(null,p.conversation_key)};
  });}
  async function cancelPopup(m,sender){wbPopupOnly(sender);const tab=normalizeTabId(m.tab_id),p=await read(tab);if(terminal(p))return null;const s=await surface(tab);checkSurface(p,s);const result=await cancel(tab,'operator_finish');return result.cancelled?result:null;}
  async function status(m,sender){wbPopupOnly(sender);const tab=normalizeTabId(m.tab_id),p=await read(tab);if(!p)return {ok:true,pending:false};const s=await surface(tab);checkSurface(p,s);return {ok:true,pending:!terminal(p),pending_start:p};}
  async function contentCancel(m,sender){const {tab}=await messageOwner(m,sender,{watch:true,allowExpired:true});return cancel(tab,m.type==='WB_WORK_PENDING_TIMEOUT'?'response_timeout':'content_cancelled');}
  async function handle(m,sender){switch(m.type){
    case 'WB_WORK_START_COMMIT_REQUEST':return commit(m,sender);
    case 'WB_WORK_START_SEND_OUTCOME':return outcome(m,sender);
    case 'WB_WORK_PENDING_IDENTITY':return observe(m,sender);
    case 'WB_WORK_START_RECOVER':return recover(m,sender);
    case 'WB_WORK_PENDING_TIMEOUT':case 'WB_WORK_PENDING_CANCEL':return contentCancel(m,sender);
    case 'WB_WORK_PENDING_STATE':return status(m,sender);
    default:throw error('WORK_START_MESSAGE_UNKNOWN');
  }}
  globalThis.WBWorkStart=Object.freeze({start,cancelPopup,status,handle,read,terminal,watchPayload,lock});
  if(chrome.tabs.onRemoved)chrome.tabs.onRemoved.addListener(tab=>{void cancel(tab,'tab_closed').catch(()=>null);});
})();
