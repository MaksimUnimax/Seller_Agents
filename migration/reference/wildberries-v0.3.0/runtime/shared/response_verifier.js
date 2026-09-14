/* Provider-neutral response verification. Schema and semantic rules must come
 * from a reviewed provider adapter; this file contains no WB business schema. */
(() => {
 'use strict';
 const fail=code=>{throw Object.assign(new Error(code),{code})};
 function safeTree(value,depth=0,budget={keys:0}){if(depth>64)fail('RESPONSE_DEPTH_EXCEEDED');if(typeof value==='number'&&!Number.isFinite(value))fail('RESPONSE_NUMBER_NOT_FINITE');if(!value||typeof value!=='object')return;for(const [key,child] of Object.entries(value)){if(++budget.keys>300000)fail('RESPONSE_KEY_LIMIT');if(['__proto__','prototype','constructor'].includes(key))fail('UNSAFE_RESPONSE_KEY');safeTree(child,depth+1,budget)}}
 function policy(value){if(value===null||value===undefined)return null;if(value.reviewed!==true||typeof value.source_revision!=='string'||!value.source_revision)fail('RESPONSE_POLICY_NOT_REVIEWED');if(value.semanticError!==undefined&&typeof value.semanticError!=='function')fail('RESPONSE_POLICY_INVALID');return {...value,...(value.schema?{schema:WBRuntimePolicy.compileSchema(value.schema)}:{})}}
 function verify(response,{binary=false,policy=null}={}){
  const details={transport:'response_received',http:response.ok?'success':'error',parse:binary?'binary':'text',schema:'not_configured',semantic:'not_configured',source_revision:policy?.source_revision||null,fully_verified:false};let value=response.parsed;
  try{
   const json=/(?:^|[+/])json(?:;|$)/i.test(String(response.responseMeta?.content_type||''));
   if(!binary&&json){if(!response.rawText.trim()&&[204,205].includes(response.httpStatus)){value=null;details.parse='empty'}else{try{value=JSON.parse(response.rawText);details.parse='json'}catch(_){details.parse='invalid_json';fail('PROVIDER_JSON_INVALID')}}}
   else if(!binary&&response.parsed!==null)details.parse='json';
   if(!binary&&details.parse==='json')safeTree(value);
   if(response.ok&&policy?.schema){try{WBRuntimePolicy.validateSchema(value,policy.schema);details.schema='pass'}catch(e){details.schema='failed';throw e}}
   if(response.ok&&policy?.semanticError){const error=policy.semanticError(value);details.semantic=error?'error':'pass';if(error)fail(/^[A-Z0-9_]{1,100}$/.test(error.code)?error.code:'PROVIDER_SEMANTIC_ERROR')}
   details.fully_verified=response.ok&&details.schema==='pass'&&details.semantic==='pass';return {ok:response.ok,value,details,error:null};
  }catch(error){return {ok:false,value:null,details,error:{code:/^[A-Z0-9_]{1,100}$/.test(error.code)?error.code:'RESPONSE_VERIFICATION_FAILED',stage:'response_verification',automatic_retry:false}}}
 }
 globalThis.WBResponseVerifier=Object.freeze({policy,verify,safeTree});
})();
