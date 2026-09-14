(() => {
'use strict';
const C=globalThis.WBContract, groups={};
const OPERATIONS=Object.fromEntries(Object.entries(C.OPERATIONS).map(([alias,m])=>{
 const cluster=m.host,section=m.read_kind||'direct';
 const enabled=m.current===true&&m.effect==='READ'&&m.execution_enabled===true;
 const required=[...(m.required_query_keys||[]),...(m.path.match(/\{[^}]+\}/g)||[]),...(m.body_required?['body']:[])];
 const runnable=enabled&&required.length===0;
 (groups[cluster]||=( {description:cluster,clues:[cluster],sections:{}} )).sections[section]=section==='derived'?'Формирование отчёта отдельной явной командой':'Прямое чтение';
 return [alias,Object.freeze({...m,cluster,section,purpose:alias,required_parameters:required,template:runnable?{operation:alias,params:{}}:null,template_runnable:runnable,safety_class:enabled?'READ_SAFE':'BLOCKED',privacy_policy:m.privacy,policy_group:m.privacy==='standard'?'safe_projection':'personal_data_read',entitlement_key:null,workflow_role:section==='derived'?'explicit_report_step':'single_read'})];
}));
const canonicalClusterId=v=>typeof v==='string'&&Object.hasOwn(groups,v)?v:null;
const operationsForCluster=(id,section)=>Object.entries(OPERATIONS).filter(([a,m])=>m.cluster===id&&(!section||m.section===section)).map(([alias,meta])=>({alias,meta}));
const catalogValidation=()=>({ok:Object.keys(OPERATIONS).length===188,operation_count:Object.keys(OPERATIONS).length,enabled:Object.values(OPERATIONS).filter(m=>m.execution_enabled).length,authority:'PACKAGED_WB_REGISTRY_SNAPSHOT_NOT_LIVE_ACCOUNT_PROOF'});
globalThis.WBGuidanceRegistry=Object.freeze({CLUSTERS:Object.freeze(groups),OPERATIONS:Object.freeze(OPERATIONS),canonicalClusterId,operationsForCluster,catalogValidation});
})();
