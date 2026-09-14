/* Worker-only IndexedDB artifact store. Opaque, expiring, binding-scoped references.
 * No URL fetching. Byte contents stay out of chrome.storage and ordinary messages. */
(() => {
  'use strict';
  const fail=code=>{throw Object.assign(new Error(code),{code});};
  const MAX_BYTES=32*1024*1024, CHUNK_BYTES=48*1024, TTL=24*3600*1000;
  const hash=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  const ownerKey=o=>JSON.stringify([o?.conversation_key,o?.binding_id,o?.binding_revision,o?.account_scope]);
  function validOwner(o){if(!o || typeof o.conversation_key!=='string' || !o.binding_id || !Number.isSafeInteger(o.binding_revision) || o.binding_revision<1 || !/^[a-f0-9]{64}$/.test(o.account_scope||''))fail('ARTIFACT_OWNER_INVALID');return o;}
  function bytesOf(value){if(value instanceof Uint8Array)return value;if(value instanceof ArrayBuffer)return new Uint8Array(value);fail('ARTIFACT_BYTES_INVALID');}
  function filename(value){const s=String(value||'WB-result.bin').replace(/[\u0000-\u001f\u007f/\\:*?"<>|]/g,'_').replace(/^\.+/,'').slice(0,180);return s||'WB-result.bin';}
  function encode(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);}
  function decode(s){if(typeof s!=='string'||s.length>MAX_BYTES*2||!(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/).test(s))fail('ARTIFACT_BASE64_INVALID');const raw=atob(s);return Uint8Array.from(raw,c=>c.charCodeAt(0));}
  function database(name='wb-bridge-artifacts-v1'){
    let pending;
    function open(){if(!pending)pending=new Promise((resolve,reject)=>{const q=indexedDB.open(name,1);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('artifacts'))q.result.createObjectStore('artifacts',{keyPath:'ref'});};q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result;db.onversionchange=()=>{db.close();pending=null;};resolve(db);};}).catch(e=>{pending=null;throw e;});return pending;}
    async function transaction(mode,work){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('artifacts',mode);let result;try{work(tx.objectStore('artifacts'),v=>{result=v;});}catch(e){tx.abort();reject(e);return;}tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||new Error('ARTIFACT_STORAGE_FAILURE'));tx.onabort=()=>reject(tx.error||new Error('ARTIFACT_STORAGE_ABORT'));});}
    return Object.freeze({get:ref=>transaction('readonly',(s,set)=>{const q=s.get(ref);q.onsuccess=()=>set(q.result||null);}),put:record=>transaction('readwrite',s=>s.put(record)),remove:ref=>transaction('readwrite',s=>s.delete(ref)),all:()=>transaction('readonly',(s,set)=>{const q=s.getAll();q.onsuccess=()=>set(q.result);})});
  }
  function create({backend=database(),now=()=>Date.now(),uuid=()=>crypto.randomUUID(),maxBytes=MAX_BYTES,ttl=TTL}={}){
    async function read(ref,owner){validOwner(owner);if(!/^wb-file-[a-f0-9-]{36}$/.test(String(ref)))fail('ARTIFACT_REF_INVALID');const r=await backend.get(ref);if(!r)fail('ARTIFACT_NOT_FOUND');if(r.expires_at<=now()){await backend.remove(ref);fail('ARTIFACT_EXPIRED');}if(ownerKey(r.owner)!==ownerKey(owner))fail('ARTIFACT_OWNER_MISMATCH');const bytes=bytesOf(r.bytes);if(bytes.length!==r.byte_length || await hash(bytes)!==r.sha256)fail('ARTIFACT_INTEGRITY_MISMATCH');return r;}
    async function put(value,owner,{name='WB-result.bin',mime='application/octet-stream',requestId=null,sourceKind='generated_bridge_document',artifactKey=null,ref=null,expiresAt=null,personalDataRequired=false}={}){
      validOwner(owner);const bytes=new Uint8Array(bytesOf(value));if(bytes.length>maxBytes)fail('ARTIFACT_TOO_LARGE');
      if(!/^[a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+$/.test(mime))mime='application/octet-stream';
      if(ref!==null&&!/^wb-file-[a-f0-9-]{36}$/.test(ref))fail('ARTIFACT_REF_INVALID');
      const digest=await hash(bytes);
      if(ref&&await backend.get(ref)){
        const previous=await read(ref,owner);
        if(previous.sha256!==digest||previous.byte_length!==bytes.length||previous.filename!==filename(name)||previous.mime!==mime||previous.source_kind!==sourceKind||previous.personal_data_required!==Boolean(personalDataRequired))fail('ARTIFACT_RETAINED_STATE_MISMATCH');
        return descriptor(previous); // Idempotent recovery never renews expiry.
      }
      const expiry=expiresAt===null?now()+ttl:expiresAt;
      if(!Number.isSafeInteger(expiry)||expiry<=now()||expiry>now()+ttl)fail('ARTIFACT_EXPIRY_INVALID');
      const r={ref:ref||'wb-file-'+uuid(),owner:JSON.parse(JSON.stringify(owner)),filename:filename(name),mime,byte_length:bytes.length,sha256:digest,created_at:now(),expires_at:expiry,request_id:requestId,source_kind:String(sourceKind||'generated_bridge_document'),artifact_key:String(artifactKey||('bridge:'+String(requestId||uuid()))),personal_data_required:Boolean(personalDataRequired),bytes};
      await backend.put(r);return descriptor(r);
    }
    const descriptor=r=>Object.freeze({ref:r.ref,filename:r.filename,mime:r.mime,byte_length:r.byte_length,sha256:r.sha256,expires_at:r.expires_at,request_id:r.request_id,source_kind:r.source_kind||'generated_bridge_document',artifact_key:r.artifact_key||null});
    async function chunk(ref,owner,index){if(!Number.isSafeInteger(index)||index<0)fail('ARTIFACT_CHUNK_INDEX');const r=await read(ref,owner),total=Math.ceil(r.byte_length/CHUNK_BYTES);if(index>=Math.max(1,total))fail('ARTIFACT_CHUNK_INDEX');const b=bytesOf(r.bytes).slice(index*CHUNK_BYTES,(index+1)*CHUNK_BYTES);return {index,total:Math.max(1,total),base64:encode(b),byte_length:b.length,sha256:await hash(b),file_sha256:r.sha256};}
    async function prune(){const all=await backend.all();for(const r of all)if(r.expires_at<=now())await backend.remove(r.ref);return all.length;}
    return Object.freeze({put,read,remove:async(ref,owner)=>{const r=await backend.get(ref);if(!r)return false;validOwner(owner);if(ownerKey(r.owner)!==ownerKey(owner))fail('ARTIFACT_OWNER_MISMATCH');await backend.remove(ref);return true;},describe:async(ref,o)=>descriptor(await read(ref,o)),chunk,prune});
  }
  globalThis.WBArtifactStore=Object.freeze({create,database,hash,encode,decode,filename,MAX_BYTES,CHUNK_BYTES,validOwner,ownerKey});
})();
