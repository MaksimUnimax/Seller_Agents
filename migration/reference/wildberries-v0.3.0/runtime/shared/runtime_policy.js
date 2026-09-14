/* Provider-neutral policy mechanisms. WB-specific policies remain disabled until
 * reviewed characterization; this module never performs a network request.
 * Account keys are SHA-256 digests, never raw credentials. */
(() => {
  'use strict';
  const fail=(code,message=code)=>{throw Object.assign(new Error(message),{code});};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const plain=v=>v!==null && typeof v==='object' && !Array.isArray(v);
  const forbidden=new Set(['__proto__','constructor','prototype']);
  function safeTree(v,depth=0){
    if(depth>64)fail('METADATA_DEPTH');
    if(Array.isArray(v)){for(const x of v)safeTree(x,depth+1);return;}
    if(plain(v))for(const k of Object.keys(v)){if(forbidden.has(k))fail('UNSAFE_METADATA_KEY');safeTree(v[k],depth+1);}
  }
  function canonical(v){
    if(v===undefined)fail('UNDEFINED_CANONICAL_VALUE');
    if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';
    if(plain(v))return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
    return JSON.stringify(v);
  }
  async function hash(value){
    const b=value instanceof Uint8Array?value:new TextEncoder().encode(String(value));
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256',b))].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  function dateValue(value){
    if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))fail('INVALID_DATE');
    const n=Date.parse(value+'T00:00:00Z');
    if(!Number.isFinite(n) || new Date(n).toISOString().slice(0,10)!==value)fail('INVALID_DATE');
    return n;
  }
  function dateTime(value){
    const m=typeof value==='string' && value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|([+-])(\d{2}):(\d{2}))$/);
    if(!m)fail('INVALID_DATE_TIME');dateValue(m[1]);
    if(+m[2]>23 || +m[3]>59 || +m[4]>59 || (m[6] && (+m[7]>23 || +m[8]>59)))fail('INVALID_DATE_TIME');
    const n=Date.parse(value);if(!Number.isFinite(n))fail('INVALID_DATE_TIME');return n;
  }
  function shiftUtcMonths(atMs,months){
    if(!Number.isFinite(atMs)||!Number.isSafeInteger(months))fail('INVALID_DATE_RULE');
    const source=new Date(atMs),target=new Date(atMs);if(!Number.isFinite(source.getTime()))fail('INVALID_DATE_RULE');
    target.setUTCDate(1);target.setUTCMonth(source.getUTCMonth()+months);
    const end=new Date(target.getTime());end.setUTCMonth(end.getUTCMonth()+1);end.setUTCDate(0);
    target.setUTCDate(Math.min(source.getUTCDate(),end.getUTCDate()));
    if(!Number.isFinite(target.getTime()))fail('INVALID_DATE_RULE');return target.getTime();
  }
  function validateDateRule(rule,now){
    if(!plain(rule)||!Number.isFinite(now)||!Number.isFinite(new Date(now).getTime()))fail('INVALID_DATE_RULE');
    if(rule.format!==undefined&&!['date','date-time'].includes(rule.format))fail('INVALID_DATE_RULE');
    for(const key of ['max_history_days','max_history_months','max_span_days','max_span_months','max_inclusive_days'])if(rule[key]!==undefined&&(!Number.isSafeInteger(rule[key])||rule[key]<(key==='max_inclusive_days'?1:0)))fail('INVALID_DATE_RULE');
    const parse=rule.format==='date-time'?dateTime:dateValue;
    if(rule.min!==undefined&&rule.max!==undefined&&parse(rule.min)>parse(rule.max))fail('INVALID_DATE_RULE');
  }
  function validateDate(value,rule={},now=Date.now()){
    validateDateRule(rule,now);const parse=rule.format==='date-time'?dateTime:dateValue;
    const n=rule.format==='date-time'?dateTime(value):dateValue(value);
    const today=Date.parse(new Date(now).toISOString().slice(0,10)+'T00:00:00Z');
    if(rule.min!==undefined && n<parse(rule.min))fail('DATE_TOO_EARLY');
    if(rule.max!==undefined && n>parse(rule.max))fail('DATE_TOO_LATE');
    if(rule.today_or_future && n<today)fail('DATE_IN_PAST');
    if(rule.no_future && n>now)fail('DATE_IN_FUTURE');
    if(rule.max_history_days!==undefined && n<today-rule.max_history_days*86400000)fail('DATE_HISTORY_WINDOW');
    if(rule.max_history_months!==undefined && n<shiftUtcMonths(today,-rule.max_history_months))fail('DATE_HISTORY_WINDOW');
    return n;
  }
  function validatePeriod(from,to,rule={},now=Date.now()){
    const a=validateDate(from,rule,now),b=validateDate(to,rule,now);if(b<a)fail('DATE_RANGE_REVERSED');
    if(rule.max_span_days!==undefined && b-a>rule.max_span_days*86400000)fail('DATE_RANGE_TOO_WIDE');
    if(rule.max_inclusive_days!==undefined && b-a>(rule.max_inclusive_days-1)*86400000)fail('DATE_RANGE_TOO_WIDE');
    if(rule.max_span_months!==undefined && b>shiftUtcMonths(a,rule.max_span_months))fail('DATE_RANGE_TOO_WIDE');return true;
  }
  function effectiveAt(rule={},at=Date.now()){
    if(!Number.isFinite(at))fail('INVALID_EFFECTIVE_TIME');
    const from=rule.effective_from===undefined?null:dateValue(rule.effective_from),until=rule.effective_until===undefined?null:dateValue(rule.effective_until);
    if(from!==null&&until!==null&&until<from)fail('EFFECTIVE_DATE_RANGE_REVERSED');
    return Object.freeze({effective:(from===null||at>=from)&&(until===null||at<until),effective_from:from,effective_until_exclusive:until});
  }
  function snapshotDiff(before,after){
    const index=s=>{const map=new Map();for(const row of s?.operations||[]){if(typeof row.alias!=='string'||map.has(row.alias))fail('SNAPSHOT_DUPLICATE');map.set(row.alias,row);}return map;};
    const a=index(before),b=index(after);
    return Object.freeze({added:[...b.keys()].filter(k=>!a.has(k)).sort(),removed:[...a.keys()].filter(k=>!b.has(k)).sort(),changed:[...b.keys()].filter(k=>a.has(k)&&canonical(a.get(k))!==canonical(b.get(k))).sort()});
  }
  // Deliberately bounded, reviewed JSON-schema subset; unsupported keywords fail
  // compiler validation instead of silently broadening an operation contract.
  const schemaKeys=new Set(['type','required','properties','additionalProperties','items','enum','minimum','maximum','minLength','maxLength','minItems','maxItems','format','description','title','nullable']);
  function compileSchema(s,depth=0){
    if(depth>32 || !plain(s))fail('INVALID_SCHEMA');safeTree(s);
    for(const k of Object.keys(s))if(!schemaKeys.has(k))fail('UNSUPPORTED_SCHEMA_KEYWORD');
    if(s.type && !['object','array','string','number','integer','boolean','null'].includes(s.type))fail('INVALID_SCHEMA_TYPE');
    // Unsupported shapes are rejected at metadata admission, never interpreted
    // permissively as missing constraints. No live WB schema is activated here.
    if(s.properties!==undefined && !plain(s.properties))fail('INVALID_SCHEMA');
    if(s.additionalProperties!==undefined && typeof s.additionalProperties!=='boolean')fail('UNSUPPORTED_SCHEMA_KEYWORD');
    if(s.nullable!==undefined && typeof s.nullable!=='boolean')fail('INVALID_SCHEMA');
    if(s.enum!==undefined && (!Array.isArray(s.enum)||!s.enum.length))fail('INVALID_SCHEMA');
    for(const key of ['minLength','maxLength','minItems','maxItems'])if(s[key]!==undefined && (!Number.isSafeInteger(s[key])||s[key]<0))fail('INVALID_SCHEMA');
    for(const key of ['minimum','maximum'])if(s[key]!==undefined && (typeof s[key]!=='number'||!Number.isFinite(s[key])))fail('INVALID_SCHEMA');
    for(const [min,max] of [['minimum','maximum'],['minLength','maxLength'],['minItems','maxItems']])if(s[min]!==undefined && s[max]!==undefined && s[min]>s[max])fail('INVALID_SCHEMA');

    if(s.properties)for(const x of Object.values(s.properties))compileSchema(x,depth+1);
    if(s.items)compileSchema(s.items,depth+1);
    if(s.required && (!Array.isArray(s.required)||s.required.some(k=>typeof k!=='string')))fail('INVALID_SCHEMA');
    if(s.format && !['date','date-time'].includes(s.format))fail('UNSUPPORTED_SCHEMA_FORMAT');
    return Object.freeze(clone(s));
  }
  function validateSchema(value,s,path='$',depth=0){
    if(depth>64)fail('RESPONSE_DEPTH');if(value===null && s.nullable)return true;
    const t=s.type;
    if(t==='object' && !plain(value) || t==='array' && !Array.isArray(value) || t==='string' && typeof value!=='string' || t==='number' && (typeof value!=='number'||!Number.isFinite(value)) || t==='integer' && !Number.isSafeInteger(value) || t==='boolean' && typeof value!=='boolean' || t==='null' && value!==null)fail('SCHEMA_TYPE_MISMATCH',path);
    if(s.enum && !s.enum.some(x=>canonical(x)===canonical(value)))fail('SCHEMA_ENUM',path);
    if(plain(value)){
      for(const k of s.required||[])if(!Object.hasOwn(value,k))fail('SCHEMA_REQUIRED',path+'.'+k);
      for(const [k,x] of Object.entries(value)){if(forbidden.has(k))fail('UNSAFE_RESPONSE_KEY');if(s.properties?.[k])validateSchema(x,s.properties[k],path+'.'+k,depth+1);else if(s.additionalProperties===false)fail('SCHEMA_ADDITIONAL_PROPERTY',path+'.'+k);}
    }
    if(Array.isArray(value)){
      if(s.minItems!==undefined && value.length<s.minItems || s.maxItems!==undefined && value.length>s.maxItems)fail('SCHEMA_ARRAY_LENGTH',path);
      if(s.items)value.forEach((x,i)=>validateSchema(x,s.items,path+'['+i+']',depth+1));
    }
    if(typeof value==='number' && (s.minimum!==undefined&&value<s.minimum || s.maximum!==undefined&&value>s.maximum))fail('SCHEMA_NUMBER_RANGE',path);
    if(typeof value==='string'){
      if(s.minLength!==undefined&&[...value].length<s.minLength || s.maxLength!==undefined&&[...value].length>s.maxLength)fail('SCHEMA_STRING_LENGTH',path);
      if(s.format==='date')dateValue(value);if(s.format==='date-time')dateTime(value);
    }
    return true;
  }
  function admission(meta,options={}){
    if(!meta || meta.execution_enabled!==true)fail('OPERATION_DISABLED');
    if(meta.current!==true || meta.currentness && meta.currentness!=='current')fail('NON_CURRENT_OPERATION');
    if(meta.effect!=='READ')fail('NON_READ_OPERATION_FORBIDDEN');
    if(meta.privacy_policy==='operator_personal_data_gate' && options.personal_data!==true)fail('PERSONAL_DATA_DISABLED');
    if(meta.entitlement_policy){const decision=globalThis.WBEntitlementPolicy?.evaluate({...meta.entitlement_policy,params:options.params||{},profile:options.entitlement_profile,account_scope:options.account_scope,at:options.at});if(!decision?.allowed)fail(decision?.code||'ENTITLEMENT_FRAMEWORK_UNAVAILABLE');return {allowed:true,effect:meta.effect,account_access:decision.account_access,entitlement:decision};}
    if(meta.entitlement_required && meta.entitlement_status!=='supported_and_entitled')fail(meta.entitlement_status==='supported_but_not_entitled'?'NOT_ENTITLED':'ENTITLEMENT_UNKNOWN');
    return {allowed:true,effect:meta.effect,account_access:meta.entitlement_status||'entitlement_unknown'};
  }
  function operationAuthority(registry){
    const rows={};for(const [alias,m] of Object.entries(registry))rows[alias]=Object.freeze({...m,alias,provider_family:m.host,currentness:m.current?'current':'unresolved',privacy_policy:m.privacy_policy||'legacy_reviewed_projection',entitlement_status:'entitlement_unknown',entitlement_required:false,workflow_role:m.read_kind||'read',rate_policy:null,pagination_policy:'explicit_only',cache_policy:null,coalescing_policy:null,prefetch_policy:null,date_policy:null,source:'WB014_PACKAGED_BASELINE__NOT_LIVE_CERTIFIED'});
    return Object.freeze(rows);
  }
  function retryAfter(value,now=Date.now()){
    if(value===null || value===undefined || String(value).trim()==='')return null;
    const s=String(value).trim();const n=/^\d+(?:\.\d+)?$/.test(s)?now+Number(s)*1000:Date.parse(s);
    return Number.isFinite(n)&&n>=now&&Number.isFinite(new Date(n).getTime())?n:null;
  }
  function create({store,now=()=>Date.now(),alarm=async()=>{},namespace='wbmb_runtime_policy'}={}){
    if(!store || typeof store.get!=='function' || typeof store.set!=='function')fail('POLICY_STORAGE_REQUIRED');
    const locks=new Map();
    const locked=(key,fn)=>{const next=(locks.get(key)||Promise.resolve()).then(fn,fn);locks.set(key,next.catch(()=>{}));return next;};
    async function get(key){const raw=await store.get(key);return raw?.[key]??null;}
    async function put(key,v){await store.set({[key]:v});const actual=await get(key);if(actual===null||canonical(actual)!==canonical(v))fail('POLICY_STORAGE_READBACK_FAILED');}
    const accountKey=async token=>{if(!token)fail('ACCOUNT_IDENTITY_MISSING');return hash('WB_PERSONAL_TOKEN_SCOPE\0'+token);};
    function quotaScope(account,family){if(!/^[a-f0-9]{64}$/.test(account)||!/^\w{1,80}$/.test(family))fail('INVALID_QUOTA_SCOPE');}
    function quotaState(v){if(v!==null&&(!plain(v)||!Number.isFinite(v.next_at)||v.next_at<0||!Number.isFinite(v.observed_at)||v.observed_at<0))fail('QUOTA_STATE_INVALID');return v;}
    async function eligibility(account,family){quotaScope(account,family);const v=quotaState(await get(namespace+':quota:'+account+':'+family));return {eligible:!v || v.next_at<=now(),next_at:v?.next_at||0};}
    async function reserve(account,family,intervalMs=0){
      if(!/^[a-f0-9]{64}$/.test(account)||!/^\w{1,80}$/.test(family)||!Number.isFinite(intervalMs)||intervalMs<0)fail('INVALID_QUOTA_SCOPE');
      const key=namespace+':quota:'+account+':'+family;
      return locked(key,async()=>{const old=quotaState(await get(key));if(old?.next_at>now())return {allowed:false,next_at:old.next_at};const next_at=now()+intervalMs;await put(key,{next_at,observed_at:now()});if(intervalMs>0)await alarm(key,next_at);return {allowed:true,next_at};});
    }
    async function observeRetryAfter(account,family,value){
      quotaScope(account,family);
      const at=retryAfter(value,now());if(at===null)return null;
      const key=namespace+':quota:'+account+':'+family;
      return locked(key,async()=>{const old=quotaState(await get(key)),next_at=Math.max(old?.next_at||0,at);await put(key,{next_at,observed_at:now(),source:'provider_retry_after'});await alarm(key,next_at);return next_at;}); // Notification only; no provider call.
    }
    // Cache policy is trusted extension code, never a page-supplied switch. WB
    // installs no such policy. Exact and projected entries use the same durable
    // integrity/account/authority fences; no miss path can fetch or retry.
    function cachePolicy(policy){
      if(!policy?.enabled)return null;
      if(policy.authority?.reviewed!==true||typeof policy.authority.source_revision!=='string'||!policy.authority.source_revision.trim())fail('CACHE_POLICY_NOT_REVIEWED');
      if(!['exact','projection'].includes(policy.mode)||!Number.isFinite(policy.ttl_ms)||policy.ttl_ms<=0||typeof policy.verify!=='function')fail('CACHE_POLICY_INVALID');
      if(policy.mode==='projection'&&(typeof policy.describe!=='function'||typeof policy.project!=='function'))fail('CACHE_POLICY_INVALID');
      return policy;
    }
    function cacheScope(account){if(!/^[a-f0-9]{64}$/.test(account))fail('INVALID_CACHE_ACCOUNT_SCOPE');return namespace+':cache-v2:'+account;}
    async function cacheDescriptor(request,policy){
      safeTree(request);
      if(policy.mode==='exact')return {eligible:true,compatibility_key:canonical(request),fields:[]};
      const d=await policy.describe(clone(request));if(d?.eligible!==true)return null;
      if(typeof d.compatibility_key!=='string'||!d.compatibility_key||!Array.isArray(d.fields)||!d.fields.length||d.fields.some(x=>typeof x!=='string'||!x)||new Set(d.fields).size!==d.fields.length)fail('CACHE_DESCRIPTOR_INVALID');
      return {eligible:true,compatibility_key:d.compatibility_key,fields:[...d.fields]};
    }
    async function cacheGet(account,request,policy=null){
      const p=cachePolicy(policy);if(!p)return null;
      const key=cacheScope(account),wanted=await cacheDescriptor(request,p);if(!wanted)return null;
      const state=await get(key),candidates=[];
      for(const record of Object.values(state?.entries||{})){
        try{
          const v=record.payload;
          if(!v||v.account!==account||v.source_revision!==p.authority.source_revision||v.mode!==p.mode||!Number.isFinite(v.expires_at)||v.expires_at<=now()||!Number.isFinite(v.stored_at)||v.stored_at>now())continue;
          if(record.sha256!==await hash(canonical(v)))continue;
          const desc=await cacheDescriptor(v.request,p);
          if(!desc||canonical(desc)!==canonical(v.descriptor)||desc.compatibility_key!==wanted.compatibility_key||wanted.fields.some(f=>!desc.fields.includes(f)))continue;
          if(v.value?.ok!==true||v.value?.verified!==true||await p.verify(clone(v.value),clone(v.request))!==true)continue;
          const projected=p.mode==='projection'?await p.project(clone(v.value),clone(request),clone(v.request)):clone(v.value);
          safeTree(projected);if(!plain(projected)||projected.ok!==true||await p.verify(clone(projected),clone(request))!==true)continue;
          candidates.push({v,desc,projected,extra:desc.fields.length-wanted.fields.length});
        }catch(_){/* Invalid cached evidence is a miss, never a provider retry. */}
      }
      candidates.sort((a,b)=>a.extra-b.extra||b.v.stored_at-a.v.stored_at);
      const hit=candidates[0];if(!hit)return null;
      return {...clone(hit.projected),external_request_executed:false,automatic_retry:false,cache_provenance:{source_request_id:hit.v.value.request_id||null,source_request_fingerprint:await hash(canonical(hit.v.request)),source_revision:hit.v.source_revision,stored_at:hit.v.stored_at,expires_at:hit.v.expires_at,age_ms:now()-hit.v.stored_at,cached_fields:hit.desc.fields,requested_fields:wanted.fields,projected:p.mode==='projection'}};
    }
    async function cachePut(account,request,value,policy=null){
      const p=cachePolicy(policy);if(!p)return false;
      const key=cacheScope(account),descriptor=await cacheDescriptor(request,p);if(!descriptor||value?.ok!==true||value?.verified!==true||value.error||value.delivery_error)return false;
      safeTree(value);if(await p.verify(clone(value),clone(request))!==true)return false;
      const id=await hash(canonical({source_revision:p.authority.source_revision,request,mode:p.mode}));
      return locked(key,async()=>{
        const state=await get(key),entries={};
        for(const [oldId,entry]of Object.entries(state?.entries||{}))if(/^[a-f0-9]{64}$/.test(oldId)&&entry?.payload?.expires_at>now())entries[oldId]=entry;
        const payload={account,source_revision:p.authority.source_revision,mode:p.mode,request:clone(request),descriptor,value:clone(value),stored_at:now(),expires_at:now()+p.ttl_ms};
        entries[id]={payload,sha256:await hash(canonical(payload))};
        // Storage bound only, not a marketplace TTL or cache-eligibility rule.
        const keep=Object.entries(entries).sort((a,b)=>b[1].payload.stored_at-a[1].payload.stored_at).slice(0,256);
        await put(key,{schema_version:2,entries:Object.fromEntries(keep)});return true;
      });
    }
    async function acceptSnapshot(snapshot,expectedHash){
      try{
        safeTree(snapshot);if(snapshot?.reviewed!==true || !Array.isArray(snapshot.operations) || !snapshot.operations.length || expectedHash!==await hash(canonical(snapshot)))fail('SNAPSHOT_NOT_VERIFIED');
        const aliases=new Set();for(const row of snapshot.operations){if(typeof row.alias!=='string'||aliases.has(row.alias))fail('SNAPSHOT_DUPLICATE');aliases.add(row.alias);if(row.schema)compileSchema(row.schema);effectiveAt(row,now());}
        const diff=snapshotDiff(await lastKnownGood(),snapshot);
        await put(namespace+':lkg',{snapshot:clone(snapshot),sha256:expectedHash});
        const update={accepted:true,at:now(),sha256:expectedHash,diff};
        try{await put(namespace+':metadata-update',update);return {accepted:true,diff,update_recorded:true};}
        catch(_){return {accepted:true,diff,update_recorded:false,code:'METADATA_UPDATE_AUDIT_NOT_PERSISTED'};}
      }catch(error){const update={accepted:false,at:now(),code:error.code||'SNAPSHOT_INVALID'};try{await put(namespace+':metadata-update',update)}catch(_){}return {...update,preserved:Boolean(await lastKnownGood())};}
    }
    async function lastKnownGood(){const v=await get(namespace+':lkg');if(!v || v.sha256!==await hash(canonical(v.snapshot)))return null;return clone(v.snapshot);}
    async function metadataState(){const snapshot=await lastKnownGood();return {lkg_available:Boolean(snapshot),lkg_sha256:snapshot?await hash(canonical(snapshot)):null,operation_count:snapshot?.operations?.length||0,last_update:await get(namespace+':metadata-update'),automatic_provider_refresh:false};}
    function plan(commands,{coalescing=[],prefetch=false}={}){
      if(coalescing.length||prefetch)fail('WB_OPTIMIZATION_REQUIRES_REVIEWED_RULE');
      return commands.map((c,i)=>({index:i,command:c,physical_call_budget:1,coalesced:false,prefetched:false}));
    }
    return Object.freeze({accountKey,eligibility,reserve,observeRetryAfter,cacheGet,cachePut,acceptSnapshot,lastKnownGood,metadataState,plan});
  }
  globalThis.WBRuntimePolicy=Object.freeze({hash,canonical,compileSchema,validateSchema,validateDate,validatePeriod,shiftUtcMonths,effectiveAt,snapshotDiff,dateValue,dateTime,admission,operationAuthority,retryAfter,create,DEFAULT_CACHE_ENABLED:false,DEFAULT_COALESCING_RULES:Object.freeze([]),DEFAULT_PREFETCH_ENABLED:false});
})();
