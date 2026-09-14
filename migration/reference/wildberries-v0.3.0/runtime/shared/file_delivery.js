/* Browser attachment transport. Every chunk is pulled over a named Port, bounded,
 * checksummed, and scoped to the worker-owned delivery. No provider calls here. */
(() => {
 'use strict';
 const err=code=>Object.assign(new Error(code),{code});
 const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
 const decode=s=>{if(typeof s!=='string'||s.length>65536||!(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/).test(s))throw err('ATTACHMENT_CHUNK_INVALID');const b=atob(s);return Uint8Array.from(b,c=>c.charCodeAt(0));};
 function create({request,adapter,current,scopeValid=()=>true,runtimeGeneration=()=>null,actorId=()=>null,connect=()=>chrome.runtime.connect({name:'WB_FILE_V1'}),sleep=ms=>new Promise(r=>setTimeout(r,ms)),now=()=>Date.now()}={}){
   const ports=new Set();
   function active(key){if(!current())throw err('RUNTIME_SUPERSEDED');if(key&&!scopeValid(key))throw err('CONVERSATION_MISMATCH');}
   async function pull(d,key,deliveryId){
     active(key);if(!Number.isSafeInteger(d.byte_length)||d.byte_length<0||d.byte_length>32*1024*1024||!/^[a-f0-9]{64}$/.test(d.sha256||''))throw err('ATTACHMENT_DESCRIPTOR_INVALID');
     const port=connect();ports.add(port);const bytes=new Uint8Array(d.byte_length);let offset=0;
     try{
       const total=Math.max(1,Math.ceil(d.byte_length/(48*1024)));
       for(let index=0;index<total;index++){
         active(key);const chunk=await new Promise((resolve,reject)=>{
           const timer=setTimeout(()=>done(err('ATTACHMENT_PORT_TIMEOUT')),15000);
           const disconnected=()=>done(err('ATTACHMENT_PORT_DISCONNECTED'));
           const listener=m=>done(null,m);
           function done(e,v){clearTimeout(timer);port.onMessage.removeListener(listener);port.onDisconnect.removeListener(disconnected);e?reject(e):resolve(v);}
           port.onMessage.addListener(listener);port.onDisconnect.addListener(disconnected);
           try{port.postMessage({conversation_key:key,delivery_id:deliveryId,ref:d.ref,index,runtime_generation:runtimeGeneration(),actor_id:actorId()});}catch(e){done(e);}
         });
         active(key);if(!chunk.ok)throw err(chunk.code||'ATTACHMENT_PORT_FAILED');
         const b=decode(chunk.base64);
         if(chunk.ref!==d.ref||chunk.index!==index||chunk.total!==total||chunk.byte_length!==b.length||chunk.file_sha256!==d.sha256||await digest(b)!==chunk.sha256||offset+b.length>bytes.length)throw err('ATTACHMENT_CHUNK_INTEGRITY');
         bytes.set(b,offset);offset+=b.length;
       }
       if(offset!==bytes.length||await digest(bytes)!==d.sha256)throw err('ATTACHMENT_FILE_INTEGRITY');return bytes;
     }finally{ports.delete(port);try{port.disconnect();}catch(_){}}
   }
   async function attach(descriptors,{conversationKey,deliveryId,timeoutMs=30000,previouslyAttached=false,attachmentPhase="pending",leaseId=null}={}){
     active(conversationKey);const ai=adapter();if(!ai)throw err('UNKNOWN_AI_ADAPTER');if(!descriptors.length)return {attached:false,files:[]};
     const profile=globalThis.WBAIDeliveryCapabilities.profile(ai.id);
     if(profile?.max_files_per_turn && descriptors.length>profile.max_files_per_turn)throw err('AI_FILE_COUNT_EXCEEDED');
     for(const d of descriptors){const decision=globalThis.WBAIDeliveryCapabilities.fileDispatchDecision?globalThis.WBAIDeliveryCapabilities.fileDispatchDecision(ai.id,d):{...globalThis.WBAIDeliveryCapabilities.supportsFile(ai.id,d),dispatch_allowed:globalThis.WBAIDeliveryCapabilities.supportsFile(ai.id,d).supported===true};if(!decision.dispatch_allowed)throw err('AI_FILE_TYPE_UNSUPPORTED');}
     const context=ai.composerContext();if(!context)throw err('COMPOSER_NOT_FOUND');
     const verifyComposer=()=>{active(conversationKey);const fresh=ai.composerContext();if(!fresh || fresh.composer!==context.composer || fresh.root!==context.root)throw err('ATTACHMENT_COMPOSER_CHANGED');};
     const existing=descriptors.filter(d=>ai.attachmentPreview(d.filename));
     if(existing.length && !previouslyAttached && context.composer?.getAttribute('data-wb-file-delivery')!==deliveryId)throw err('ATTACHMENT_PREEXISTING_UNVERIFIED');
     const filesMeta=descriptors.map(d=>({ref:d.ref,sha256:d.sha256}));
     const missing=descriptors.filter(d=>!ai.attachmentPreview(d.filename));
     if(missing.length&&['committed','attached','unknown_no_retry'].includes(attachmentPhase))throw err('ATTACHMENT_OUTCOME_UNKNOWN_NO_RETRY');
     if(missing.length){const files=[];for(const d of missing){const b=await pull(d,conversationKey,deliveryId);active(conversationKey);files.push(new File([b],d.filename,{type:d.mime}));}
       verifyComposer();const surface=ai.attachmentSurface();if(!surface)throw err('TARGET_AI_ATTACHMENT_SURFACE_UNAVAILABLE');
       const permit=await request('WB_DELIVERY_ATTACH_COMMIT',{conversation_key:conversationKey,delivery_id:deliveryId,lease_id:leaseId,files:filesMeta});verifyComposer();
       if(!permit?.ok||!permit.apply_allowed)throw err(permit?.code||'ATTACHMENT_OUTCOME_UNKNOWN_NO_RETRY');
       context.composer?.setAttribute('data-wb-file-delivery',deliveryId);
       ai.attachFiles(surface,files);
     }
     const start=now();while(now()-start<timeoutMs){verifyComposer();if(ai.attachmentReady(descriptors)){
       const ack=await request('WB_DELIVERY_FILES_STAGED',{conversation_key:conversationKey,delivery_id:deliveryId,lease_id:leaseId,files:filesMeta});if(!ack?.ok)throw err(ack?.code||'ATTACHMENT_ACK_FAILED');verifyComposer();return {attached:true,files:descriptors};
     }await sleep(100);}
     throw err('ATTACHMENT_PREVIEW_TIMEOUT');
   }
   function dispose(){for(const p of ports)try{p.disconnect();}catch(_){}ports.clear();}
   return Object.freeze({pull,attach,dispose});
 }
 globalThis.WBFileDelivery=Object.freeze({create,digest,decode});
})();
