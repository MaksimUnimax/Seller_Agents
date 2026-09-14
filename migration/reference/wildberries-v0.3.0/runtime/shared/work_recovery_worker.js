/* Durable provider-neutral Refresh/Finish. Ozon begin/terminalize/resume contract,
 * adapted to in-process content replacement: new physical runtime plus exact
 * logical generation proof. Recovery never executes a provider or prompt. */
(() => {
  'use strict';
  const PREFIX='wb_work_recovery_v1:', flights=new Map(), locks=new Map();
  const now=()=>new Date().toISOString();
  const terminal=p=>!p||['completed','cancelled','failed','expired'].includes(p.phase);
  const error=code=>Object.assign(new Error(code),{code});
  function lock(key,fn){const old=locks.get(key)||Promise.resolve(),p=old.then(fn,fn);locks.set(key,p);return p.finally(()=>{if(locks.get(key)===p)locks.delete(key);});}
  async function read(key){return (await storageGet(PREFIX+key))[PREFIX+key]||null;}
  async function save(key,p){await storageSet({[PREFIX+key]:p});const v=await read(key);if(WBRuntimePolicy.canonical(v)!==WBRuntimePolicy.canonical(p))throw error('WORK_RECOVERY_COMMIT_READBACK_FAILED');return v;}
  async function rawWork(key){return WBWorkSessionModel.normalize((await storageGet(WB_WORK_PREFIX+key))[WB_WORK_PREFIX+key],key);}
  function owner(p,id){return id?.status==='confirmed'&&p.origin===id.origin&&p.ai_id===id.ai_id&&p.conversation_id===id.conversation_id;}
  async function surface(p){const v=await tabMessage(p.tab_id,{type:'WB_GET_IDENTITY'});if(!v?.ok||!owner(p,v.identity))throw error('WORK_REFRESH_CONTEXT_INVALID');return v;}
  function same(p,v){return p?.recovery_id===v?.recovery_id&&Number(p?.revision)===Number(v?.revision);}
  async function live(p){const q=await read(p.conversation_key),w=await rawWork(p.conversation_key);if(!same(q,p)||terminal(q)||w.state!=='recovering'||Number(w.revision)!==Number(p.revision))throw error('WORK_RECOVERY_SUPERSEDED');return q;}
  function valid(p){return p&&typeof p.recovery_id==='string'&&p.recovery_id.length<=200&&Number.isSafeInteger(p.revision)&&p.revision>0&&typeof p.expires_at==='string'&&Number.isFinite(Date.parse(p.expires_at))&&typeof p.new_runtime_generation==='string'&&p.new_runtime_generation.length>0&&p.new_runtime_generation.length<=200&&Array.isArray(p.assistant_baseline_ids)&&p.assistant_baseline_ids.length<=5000&&p.assistant_baseline_ids.every(x=>typeof x==='string'&&x.length<=300);}
  async function fail(p,code,phase='failed'){
    return lock(p.conversation_key,async()=>{const q=await read(p.conversation_key);if(!same(q,p)||terminal(q))return {ok:false,code:'WORK_RECOVERY_SUPERSEDED'};
      let w=await rawWork(p.conversation_key);
      // Close admission before terminalizing the intent. If either write fails,
      // the durable pending-intent gate still denies new provider execution.
      if((w.state==='recovering'&&w.revision===p.revision)||(['active_visible','active_hidden'].includes(w.state)&&[p.revision,p.revision+1].includes(w.revision))){w=WBWorkSessionModel.transition(w,'error',{error:{code}});await wbWorkSave(p.conversation_key,w);}
      await save(p.conversation_key,{...q,phase,completed_at:now(),error:{code}});
      await tabMessage(p.tab_id,{type:'WB_WORK_VISIBILITY',conversation_key:p.conversation_key,work:w});
      return {ok:false,code,work:w};
    });
  }
  async function terminateOperation(key,action){
    const record=await getManualOperation(key);if(!manualOperationActive(record))return {operation_id:null,phase:'none',provider_dispatched:false,delivery_preserved:false};
    const delivering=record.status==='delivering';
    if(delivering&&action==='refresh')return {operation_id:record.operation_id,phase:'delivery:'+String(record.send_state||record.attachment_phase||'prepared'),provider_result_durable:true,delivery_preserved:true,delivery_id:record.delivery_id};
    const items=record.command_batch?.snapshot?.items||[];
    const dispatched=record.status==='requesting'&&(items.some(x=>['dispatch_committed','requesting'].includes(x.state))||record.batch?.request_state==='requesting'||record.batch?.entries?.some(x=>x.status==='requesting'));
    const code=dispatched?'REQUEST_OUTCOME_UNKNOWN_NO_RETRY':delivering?'OPERATOR_FINISH_DELIVERY_ABANDONED':action==='refresh'?'OPERATOR_REFRESH_BEFORE_PROVIDER':'OPERATOR_FINISH_BEFORE_PROVIDER';
    await mutateManualOperation(key,r=>r?.operation_id===record.operation_id&&manualOperationActive(r)?{...r,status:'failed',finish_requested:true,request_worker_session_id:null,completed_at:now(),last_error:{code,message:code,at:now()},batch:r.batch?{...r.batch,request_state:dispatched?'outcome_unknown':'terminal',request_worker_session_id:null}:r.batch}:r);
    return {operation_id:record.operation_id,phase:record.status,provider_dispatched:dispatched,delivery_preserved:false,provider_result_durable:delivering,code};
  }
  async function settle(p){
    await live(p);const id=await surface(p);
    if(!id.runtime_id||id.runtime_id===p.old_runtime_id)throw error('WORK_REFRESH_OLD_RUNTIME');
    const ack=await tabMessage(p.tab_id,{type:'WB_WORK_RUNTIME_RENEW',conversation_key:p.conversation_key,recovery_id:p.recovery_id,recovery_revision:p.revision,runtime_generation:p.new_runtime_generation,assistant_baseline_ids:p.assistant_baseline_ids||[],visible:false});
    await live(p);const fresh=await surface(p);
    if(!ack?.ok||ack.applied!==true||ack.baseline_applied!==true||ack.recovery_id!==p.recovery_id||ack.runtime_id!==fresh.runtime_id||ack.runtime_generation!==p.new_runtime_generation||fresh.runtime_generation!==p.new_runtime_generation||!owner(p,ack.identity)||fresh.runtime_id===p.old_runtime_id)throw error('WORK_REFRESH_CONTENT_RECONNECT_FAILED');
    return lock(p.conversation_key,async()=>{
      const q=await live(p),key=p.conversation_key;let w=await rawWork(key);
      const binding=await bindingForConversationKey(key);
      if(!binding||binding.binding_id!==q.binding_id||Number(binding.revision)!==Number(q.binding_revision))throw error('WORK_REFRESH_BINDING_CHANGED');
      await save(key,{...q,phase:'visibility_committed',new_runtime_id:fresh.runtime_id,handshake_at:now()});
      w=WBWorkSessionModel.transition(w,p.expected_visible?'active_visible':'active_hidden',{error:null});await wbWorkSave(key,w);
      const visible=await tabMessage(p.tab_id,{type:'WB_WORK_VISIBILITY',conversation_key:key,work:w,recovery_id:p.recovery_id,runtime_generation:p.new_runtime_generation});
      const check=await surface(p);
      if(!visible?.ok||visible.applied!==true||check.runtime_id!==fresh.runtime_id||check.runtime_generation!==p.new_runtime_generation){
        w=WBWorkSessionModel.transition(w,'error',{error:{code:'WORK_REFRESH_VISIBILITY_NOT_CONFIRMED'}});await wbWorkSave(key,w);
        await save(key,{...q,phase:'failed',completed_at:now(),error:{code:'WORK_REFRESH_VISIBILITY_NOT_CONFIRMED'}});
        await tabMessage(p.tab_id,{type:'WB_WORK_VISIBILITY',conversation_key:key,work:w});return {ok:false,code:'WORK_REFRESH_VISIBILITY_NOT_CONFIRMED',work:w};
      }
      await save(key,{...q,phase:'completed',new_runtime_id:fresh.runtime_id,completed_at:now(),restored_state:w.state});
      return {ok:true,work:w,recovery:await read(key),runtime_reinitialized:true,physical_worker_reloaded:false,provider_replayed:false};
    });
  }
  async function refresh(ctx){
    const key=ctx.conversation_key;if(flights.has(key))return {ok:false,code:'REFRESH_ALREADY_IN_PROGRESS'};
    const work=(async()=>{let p;
      try{
        p=await lock(key,async()=>{
          const prior=await read(key);if(!terminal(prior))throw error('REFRESH_ALREADY_IN_PROGRESS');
          const w=await rawWork(key);if(!['active_visible','active_hidden'].includes(w.state))throw error('WORK_NOT_ACTIVE');
          const binding=await bindingForConversationKey(key);if(!binding)throw error('CONVERSATION_NOT_BOUND');
          const id=await tabMessage(ctx.tab_id,{type:'WB_GET_IDENTITY'});if(!id?.ok||!id.runtime_id||!owner(ctx.identity,id.identity))throw error('WORK_REFRESH_CONTEXT_INVALID');
          const next=WBWorkSessionModel.transition(w,'recovering',{error:null});
          if(!Number.isSafeInteger(next.revision))throw error('WORK_RECOVERY_REVISION_CORRUPT');
          const rec={version:1,recovery_id:'work-recovery-'+crypto.randomUUID(),revision:next.revision,conversation_key:key,tab_id:ctx.tab_id,origin:ctx.identity.origin,ai_id:ctx.identity.ai_id,conversation_id:ctx.identity.conversation_id,binding_id:binding.binding_id,binding_revision:Number(binding.revision),previous_state:w.state,expected_visible:w.state!=='active_hidden',old_runtime_id:id.runtime_id,old_runtime_generation:id.runtime_generation||id.runtime_id,new_runtime_generation:'work-runtime-'+crypto.randomUUID(),worker_session_id:WORKER_SESSION_ID,phase:'intent',created_at:now(),expires_at:new Date(Date.now()+30000).toISOString(),assistant_baseline_ids:[]};
          await save(key,rec);await wbWorkSave(key,next);
          const op=await terminateOperation(key,'refresh');
          return save(key,{...rec,operation:op});
        });
        const freeze=await tabMessage(p.tab_id,{type:'WB_WORK_RUNTIME_FREEZE',conversation_key:key,recovery_id:p.recovery_id,recovery_revision:p.revision,old_runtime_id:p.old_runtime_id});
        await live(p);
        if(!freeze?.ok||freeze.applied!==true||freeze.runtime_id!==p.old_runtime_id)throw error('WORK_REFRESH_FREEZE_FAILED');
        if(!Array.isArray(freeze.assistant_baseline_ids)||freeze.assistant_baseline_ids.length>5000||freeze.assistant_baseline_ids.some(x=>typeof x!=='string'||x.length>300))throw error('WORK_REFRESH_BASELINE_INVALID');
        p=await lock(key,async()=>{const q=await live(p);return save(key,{...q,phase:'renewal_committed',assistant_baseline_ids:[...new Set(freeze.assistant_baseline_ids)],renewal_committed_at:now()});});
        // One renewal only. An uncertain callback is reconciled by identity, not another reinit.
        await tabMessage(p.tab_id,{type:'WB_RUNTIME_REFRESH',conversation_key:key,recovery_id:p.recovery_id,recovery_revision:p.revision,old_runtime_id:p.old_runtime_id,new_runtime_generation:p.new_runtime_generation,assistant_baseline_ids:p.assistant_baseline_ids});
        let renewed=false;
        for(let i=0;i<15;i++){await live(p);const s=await surface(p);if(s.runtime_id&&s.runtime_id!==p.old_runtime_id){renewed=true;break;}await new Promise(r=>setTimeout(r,40));}
        if(!renewed)throw error('WORK_REFRESH_OLD_RUNTIME');
        return await settle(p);
      }catch(e){if(p)return fail(p,e.code||'WORK_REFRESH_FAILED');return {ok:false,code:e.code||'WORK_REFRESH_FAILED'};}
    })();flights.set(key,work);try{return await work;}finally{if(flights.get(key)===work)flights.delete(key);}
  }
  async function finish(ctx){
    const key=ctx.conversation_key;
    return lock(key,async()=>{
      const p=await read(key);if(!terminal(p))await save(key,{...p,phase:'cancelled',completed_at:now(),error:{code:'OPERATOR_FINISH_RECOVERY_CANCELLED'}});
      let w=await rawWork(key);const operation=await terminateOperation(key,'finish');
      if(w.state==='recovering')w=WBWorkSessionModel.transition(w,'error',{error:{code:'OPERATOR_FINISH_RECOVERY_CANCELLED'}});
      if(w.state!=='inactive'){
        if(w.state==='binding'||w.state==='pending_identity')w=WBWorkSessionModel.transition(w,'inactive',{error:null});
        else {w=WBWorkSessionModel.transition(w,'finishing',{error:null});w=WBWorkSessionModel.transition(w,'inactive',{error:null});}
        await wbWorkSave(key,w);
      }
      const r=await getAutoRun(key);if(r&&!BridgeAutorunModel.isTerminalStatus(r.status))await stopAutoRun(key);
      const ack=await tabMessage(ctx.tab_id,{type:'WB_WORK_VISIBILITY',conversation_key:key,work:w});
      return {ok:ack?.ok===true&&ack.applied===true,code:ack?.ok&&ack.applied?null:'WORK_VISIBILITY_NOT_ACKNOWLEDGED',work:w,operation,provider_replayed:false};
    });
  }
  async function resume(m,sender){
    if(!sender?.tab?.id||(sender.frameId??0)!==0)throw error('CONTENT_AUTHORITY_REQUIRED');
    const id=normalizeIdentity(m.identity||{}),key=await resolveConfirmedConversationKey(id),p=await read(key);
    if(terminal(p))return {ok:true,pending:false};
    if(sender.tab.id!==p.tab_id||!owner(p,id)||new URL(sender.url||sender.tab.url).origin!==p.origin)throw error('WORK_REFRESH_CONTEXT_INVALID');
    if(typeof p.expires_at==='string'&&Number.isFinite(Date.parse(p.expires_at))&&p.expires_at<=now())return fail(p,'WORK_RECOVERY_EXPIRED','expired');
    if(!valid(p))return fail(p,'WORK_RECOVERY_RECORD_INVALID');
    if(flights.has(key))return {ok:true,pending:true};
    const work=(async()=>{
      const s=await surface(p);if(m.runtime_id!==s.runtime_id||m.runtime_generation!==s.runtime_generation)throw error('WORK_REFRESH_GENERATION_MISMATCH');
      if(s.runtime_id===p.old_runtime_id)return {ok:true,pending:true,code:'WORK_REFRESH_WAIT_NEW_RUNTIME'};
      if(!['renewal_committed','visibility_committed'].includes(p.phase))return fail(p,'WORK_RECOVERY_INCOMPLETE_NO_RETRY');
      let current=p;
      if(p.phase==='visibility_committed')current=await lock(key,async()=>{
        const q=await read(key),w=await rawWork(key);
        if(!same(q,p)||terminal(q))throw error('WORK_RECOVERY_SUPERSEDED');
        if(['active_visible','active_hidden'].includes(w.state)){
          const next=WBWorkSessionModel.transition(w,'recovering',{error:null});
          await wbWorkSave(key,next);return save(key,{...q,revision:next.revision,phase:'renewal_committed'});
        }
        return q;
      });
      return settle(current).catch(e=>fail(current,e.code||'WORK_REFRESH_FAILED'));
    })();
    flights.set(key,work);
    try{return await work;}finally{if(flights.get(key)===work)flights.delete(key);}
  }

  globalThis.WBWorkRecovery=Object.freeze({read,terminal,refresh,finish,resume,terminateOperation,exclusive:lock});
})();
