/* Provider-neutral entitlement machinery. No WB subscription names, endpoint
 * rules, automatic probes or permissive inference from a successful ping. The
 * packaged registry has no entitlement_policy: WB evidence is a separate gate. */
(() => {
 'use strict';
 const fail=code=>{throw Object.assign(new Error(code),{code})},clone=v=>JSON.parse(JSON.stringify(v));
 const plain=v=>v&&typeof v==='object'&&!Array.isArray(v),scope=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
 function reviewed(a){if(a?.reviewed!==true||typeof a.source_revision!=='string'||!a.source_revision.trim())fail('ENTITLEMENT_POLICY_NOT_REVIEWED');return a;}
 function values(v){if(!Array.isArray(v)||!v.length||v.some(x=>typeof x!=='string'||!x.trim())||new Set(v).size!==v.length)fail('ENTITLEMENT_RULE_UNKNOWN');return [...v].sort();}
 function selectorMatches(s,params,at){
   if(!plain(s)||typeof s.field!=='string'||!s.field||['__proto__','constructor','prototype'].includes(s.field))fail('ENTITLEMENT_RULE_UNKNOWN');
   const value=Object.hasOwn(params,s.field)?params[s.field]:undefined;
   if(s.type==='date_older_than_months'){
     if(!Number.isSafeInteger(s.months)||s.months<1)fail('ENTITLEMENT_RULE_UNKNOWN');
     if(value===undefined)return false;
     let date;try{date=WBRuntimePolicy.dateValue(value)}catch(_){fail('ENTITLEMENT_RULE_UNKNOWN')}
     const now=new Date(at),boundary=Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-s.months,now.getUTCDate(),now.getUTCHours(),now.getUTCMinutes(),now.getUTCSeconds(),now.getUTCMilliseconds());
     return date<boundary;
   }
   const allowed=values(s.values);
   if(s.type==='value_in')return allowed.includes(value);
   if(s.type==='array_contains_any')return Array.isArray(value)&&value.some(v=>allowed.includes(v));
   if(s.type==='object_array_key_contains_any'){
     if(typeof s.key!=='string'||!s.key||['__proto__','constructor','prototype'].includes(s.key))fail('ENTITLEMENT_RULE_UNKNOWN');
     return Array.isArray(value)&&value.some(v=>plain(v)&&Object.hasOwn(v,s.key)&&allowed.includes(v[s.key]));
   }
   fail('ENTITLEMENT_RULE_UNKNOWN');
 }
 function requirementFor({authority,rule,params={},at=Date.now()}){
   reviewed(authority);
   const unknown=()=>({known:false,required:true,allowed_values:[],reasons:['entitlement_rule_unknown'],source_revision:authority.source_revision});
   try{
     if(!Number.isFinite(at)||!plain(params)||!plain(rule)||!['unrestricted','restricted'].includes(rule.default_access))return unknown();
     const sets=[],reasons=[];
     if(rule.allowed_values!==undefined){sets.push(values(rule.allowed_values));reasons.push('endpoint_restriction')}
     else if(rule.default_access==='restricted')return unknown();
     if(rule.features!==undefined&&!Array.isArray(rule.features))return unknown();
     for(const feature of rule.features||[]){
       // Validate even currently unmatched rules. A malformed selector is not
       // evidence that an operation is unrestricted.
       if(typeof feature.id!=='string'||!feature.id)return unknown();
       const allowed=values(feature.allowed_values),matches=selectorMatches(feature.selector,params,at);
       if(matches){sets.push(allowed);reasons.push(feature.id)}
     }
     let intersection=sets.length?[...sets[0]]:[];
     for(const set of sets.slice(1))intersection=intersection.filter(x=>set.includes(x));
     if(sets.length&&!intersection.length)return unknown();
     return {known:true,required:sets.length>0,allowed_values:intersection.sort(),reasons,source_revision:authority.source_revision};
   }catch(_){return unknown()}
 }
 function validProfile(p,account,authority,at){
   return Number.isFinite(at)&&typeof authority?.source_revision==='string'&&Boolean(authority.source_revision)&&scope(account)&&p?.account_scope===account&&p.status==='known'&&p.verified===true&&p.authority_revision===authority.source_revision&&typeof p.source_request_id==='string'&&Boolean(p.source_request_id)&&Number.isFinite(p.observed_at)&&p.observed_at<=at&&Number.isFinite(p.expires_at)&&p.expires_at>at&&p.expires_at>p.observed_at&&Array.isArray(p.values)&&p.values.every(v=>typeof v==='string'&&Boolean(v))&&new Set(p.values).size===p.values.length;
 }
 function evaluate(args){
   const at=args.at??Date.now(),requirement=requirementFor({...args,at});
   const result={requirement,external_request_executed:false,probe_performed:false,automatic_retry:false};
   if(!requirement.known)return {...result,allowed:false,code:'ENTITLEMENT_RULE_UNKNOWN',account_access:'entitlement_unknown'};
   if(!requirement.required)return {...result,allowed:true,code:'ENTITLEMENT_NOT_REQUIRED',account_access:'not_required'};
   if(!validProfile(args.profile,args.account_scope,args.authority,at))return {...result,allowed:false,code:'ENTITLEMENT_UNKNOWN',account_access:'entitlement_unknown'};
   const allowed=args.profile.values.some(v=>requirement.allowed_values.includes(v));
   return {...result,allowed,code:allowed?'ENTITLEMENT_ALLOWED':'NOT_ENTITLED',account_access:allowed?'supported_and_entitled':'supported_but_not_entitled',source_request_id:args.profile.source_request_id};
 }
 function create({store,namespace='wb_entitlement_evidence_v1'}={}){
   if(typeof store?.get!=='function'||typeof store?.set!=='function')fail('ENTITLEMENT_STORAGE_REQUIRED');
   const key=account=>{if(!scope(account))fail('ENTITLEMENT_ACCOUNT_SCOPE_REQUIRED');return namespace+':'+account};
   async function record(profile){
     const authority={source_revision:profile?.authority_revision};
     if(!validProfile(profile,profile?.account_scope,authority,profile?.observed_at))fail('ENTITLEMENT_EVIDENCE_INVALID');
     const payload=clone(profile),id=key(profile.account_scope),record={payload,sha256:await WBRuntimePolicy.hash(WBRuntimePolicy.canonical(payload))};
     await store.set({[id]:record});const saved=(await store.get(id))?.[id];
     if(!saved||WBRuntimePolicy.canonical(saved)!==WBRuntimePolicy.canonical(record))fail('ENTITLEMENT_STORAGE_READBACK_FAILED');return true;
   }
   async function read(account,authority,at=Date.now()){
     reviewed(authority);const id=key(account),record=(await store.get(id))?.[id];
     if(!record||record.sha256!==await WBRuntimePolicy.hash(WBRuntimePolicy.canonical(record.payload))||!validProfile(record.payload,account,authority,at))return null;
     return clone(record.payload);
   }
   return Object.freeze({record,read});
 }
 globalThis.WBEntitlementPolicy=Object.freeze({requirementFor,evaluate,create,DEFAULT_POLICY:null});
})();
