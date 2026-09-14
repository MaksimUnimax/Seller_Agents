/* Read-only parameter visibility from the existing WB executable contract.
 * The bundled registry has no verified nested WB body schemas. Expose that
 * boundary explicitly; never fill it with Ozon values or guessed examples. */
(() => {
 'use strict';
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const codes=new Set(['INVALID_OPERATION_PARAMS','INVALID_PATH_PARAMS','INVALID_QUERY_PARAMS','MISSING_PATH_PARAM','INVALID_PATH_PARAM','UNSUPPORTED_QUERY_PARAM','MISSING_QUERY_PARAM','MISSING_BODY','INVALID_QUERY_PARAM']);
 function schema(alias){
  if(!Object.hasOwn(WBContract.OPERATIONS,alias))return null;
  const m=WBContract.OPERATIONS[alias],names=[...m.path.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map(x=>x[1]);
  const properties={path:{type:'object',properties:Object.fromEntries(names.map(k=>[k,{type:'string',pattern:'^[A-Za-z0-9._:-]{1,180}$'}])),required:names,additionalProperties:false},query:{type:'object',properties:Object.fromEntries(m.query_keys.map(k=>[k,{}])),required:[...m.required_query_keys],additionalProperties:false}};
  if(m.body_required||m.method==='POST')properties.body={};
  return freeze({type:'object',properties,required:['path','query',...(m.body_required?['body']:[])],additionalProperties:false});
 }
 function describe(alias){
  const value=schema(alias);if(!value)return null;
  const m=WBContract.OPERATIONS[alias];
  return freeze({parameter_schema:value,parameter_schema_scope:'canonical_params_wrappers_after_normalization',schema_authority:'EXISTING_WB_EXECUTABLE_CONTRACT',schema_completeness:'partial',
    unresolved_schema:['WB field types, limits, enum values and nested body schemas require provider characterization'],
    parameter_guidance:'Используйте params.path, params.query и params.body. Неизвестную структуру тела не заменяйте вымышленным примером.',
    execution_enabled:m.execution_enabled===true&&m.effect==='READ'&&m.current===true});
 }
 function correction(alias,code){
  if(!codes.has(code)||!Object.hasOwn(WBContract.OPERATIONS,alias))return null;
  const meta=describe(alias);if(!meta.execution_enabled)return null;
  return freeze({status:'operation_parameter_correction',operation:alias,error:code,external_request_executed:false,physical_business_request_count:0,template:null,template_runnable:false,...meta});
 }
 globalThis.WBParameterGuidance=Object.freeze({schema,describe,correction});
})();
