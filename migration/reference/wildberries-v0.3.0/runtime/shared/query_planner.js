/* Provider-neutral contiguous acquisition/projection engine. No WB optimization
 * policy is installed: production uses identity plans, one explicit API command
 * per physical request. Reviewed provider adapters are dependency injections,
 * never command/page/settings data. No network or retry logic lives here. */
(() => {
 'use strict';
 const fail=code=>{throw Object.assign(new Error(code),{code})},copy=v=>JSON.parse(JSON.stringify(v));
 const api=e=>['api','command'].includes(e?.kind)&&!!e.command&&!e.code;
 function validateEntries(entries){if(!Array.isArray(entries)||entries.length>32||entries.some((e,i)=>!e||e.index!==undefined&&e.index!==i))fail('QUERY_PLAN_ENTRIES_INVALID');}
 function create(adapter=null){
  if(adapter&&(!adapter.authority?.reviewed||typeof adapter.authority.source_revision!=='string'||!adapter.authority.source_revision||!['describe','combine','project','normalize'].every(k=>typeof adapter[k]==='function')))fail('QUERY_POLICY_NOT_REVIEWED');
  async function build(entries,{capability_planned=true,execution_started=false}={}){
   validateEntries(entries);if(!capability_planned)fail('QUERY_PLAN_BEFORE_CAPABILITY');if(execution_started||entries.some(e=>['dispatch_committed','requesting','complete','success'].includes(e.state||e.status)))fail('QUERY_PLAN_EXECUTION_ALREADY_STARTED');
   const planned=entries.map((e,i)=>({...copy(e),index:i})),groups=[];
   if(adapter)for(let i=0;i<planned.length;){
    if(!api(planned[i])){i++;continue}const first=await adapter.describe(copy(planned[i].command));if(!first?.eligible){i++;continue}
    if(typeof first.compatibility_key!=='string'||!first.compatibility_key)fail('QUERY_COMPATIBILITY_INVALID');
    const members=[i],commands=[planned[i].command];let combined=null,j=i+1;
    for(;j<planned.length;j++){
     if(!api(planned[j]))break;const next=await adapter.describe(copy(planned[j].command));if(!next?.eligible||next.compatibility_key!==first.compatibility_key)break;
     const attempt=await adapter.combine(copy([...commands,planned[j].command]));if(attempt?.eligible===false)break;if(!attempt?.command)fail('QUERY_COMBINATION_INVALID');
     combined={...attempt,command:await adapter.normalize(copy(attempt.command))};commands.push(planned[j].command);members.push(j);
    }
    if(members.length>1){const fingerprint=await WBRuntimePolicy.hash(WBRuntimePolicy.canonical(combined.command)),id='query-'+i+'-'+fingerprint;
     const group={group_id:id,leader_index:i,member_indexes:members,physical_command:combined.command,physical_fingerprint:fingerprint,projection:copy(combined.projection??null),physical_call_budget:1,policy_revision:adapter.authority.source_revision};groups.push(group);
     for(const member of members)Object.assign(planned[member],{query_group_id:id,query_group_leader_index:i});i=j;
    }else i++;
   }
   const mappings=planned.map((e,i)=>({logical_index:i,physical_leader_index:api(e)?e.query_group_leader_index??i:null,physical_call_budget:api(e)?e.query_group_id&&e.query_group_leader_index!==i?0:1:0,coalesced:!!e.query_group_id,prefetched:false}));
   return {version:1,strategy:adapter?'reviewed_contiguous_acquisition':'explicit_identity',groups,entries:planned,mappings,physical_call_budget:mappings.reduce((n,r)=>n+r.physical_call_budget,0),automatic_retry:false,automatic_prefetch:false};
  }
  async function project(group,entries,physical){
   if(!adapter||!group||!Array.isArray(group.member_indexes)||!physical?.request_id)fail('QUERY_PROJECTION_AUTHORITY_REQUIRED');
   // Acquisition failure is never retried as separate logical requests.
   const rows=[];for(const index of group.member_indexes){const entry=entries[index];if(!api(entry)||entry.query_group_id!==group.group_id)fail('QUERY_PROJECTION_MEMBER_MISMATCH');
    let result=physical.result,error=null;try{if(physical.ok===true)result=await adapter.project(copy(physical.result),copy(entry.command),copy(group.projection))}catch(_){error={code:'QUERY_PROJECTION_FAILED',stage:'local_projection',provider_result_preserved:true,automatic_retry:false};result=copy(physical.result)}
    rows.push({logical_index:index,logical_fingerprint:await WBRuntimePolicy.hash(WBRuntimePolicy.canonical(entry.command)),physical_request_id:physical.request_id,physical_fingerprint:group.physical_fingerprint,external_request_executed:physical.external_request_executed!==false,result,error,ok:physical.ok===true&&!error,automatic_retry:false});
   }return rows;
  }
  function accounting(rows){const ids=new Set(rows.filter(r=>r.external_request_executed===true).map(r=>r.physical_request_id).filter(Boolean));return {logical_result_count:rows.length,physical_request_count:ids.size};}
  // Optional widening remains a single reviewed acquisition. It cannot generate
  // extra calls, and the original logical command is retained for projection.
  async function prefetch(command){if(!adapter?.prefetch)return {logical_command:copy(command),physical_command:copy(command),prefetched:false,physical_call_budget:1};const d=await adapter.prefetch(copy(command));if(!d?.eligible)return {logical_command:copy(command),physical_command:copy(command),prefetched:false,physical_call_budget:1};if(!d.command||typeof adapter.projectPrefetch!=='function')fail('PREFETCH_PROJECTION_REQUIRED');return {logical_command:copy(command),physical_command:await adapter.normalize(copy(d.command)),projection:copy(d.projection??null),prefetched:true,physical_call_budget:1};}
  async function projectPrefetch(plan,physical){if(!plan.prefetched||physical.ok!==true)return copy(physical);try{return {...copy(physical),result:await adapter.projectPrefetch(copy(physical.result),copy(plan.logical_command),copy(plan.projection))}}catch(_){return {...copy(physical),ok:false,projection_error:{code:'PREFETCH_PROJECTION_FAILED',provider_result_preserved:true,automatic_retry:false}}}}
  return Object.freeze({build,project,accounting,prefetch,projectPrefetch});
 }
 globalThis.WBQueryPlanner=Object.freeze({create});
})();
