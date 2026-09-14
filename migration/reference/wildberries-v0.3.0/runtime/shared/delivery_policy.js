/* Provider-neutral target delivery budget and local continuation protocol.
 * WB_FILE_V1 reads existing owned bytes only. It is NOT a WB API operation.
 * Ozon report_file_get aliases/ref grammar never enter the WB provider registry.
 */
(() => {
  'use strict';
  const PREFIX='WB_FILE_V1';
  const fail=code=>{throw Object.assign(new Error(code),{code});};
  const refValid=ref=>typeof ref==='string'&&/^wb-file-[a-f0-9-]{36}$/.test(ref);
  function parseLocal(text){
    const source=String(text||'').trim();
    if(!source.startsWith(PREFIX))fail('NOT_LOCAL_FILE_COMMAND');
    let raw;try{raw=JSON.parse(source.slice(PREFIX.length).trim());}catch(_){fail('LOCAL_FILE_INVALID_JSON');}
    if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).length!==1||!Object.hasOwn(raw,'ref')||!refValid(raw.ref))fail('LOCAL_FILE_INVALID_COMMAND');
    return Object.freeze({ref:raw.ref});
  }
  function localCommand(ref){if(!refValid(ref))fail('LOCAL_FILE_INVALID_REF');return PREFIX+' '+JSON.stringify({ref});}
  function fileProducing(entry){return entry?.kind==='file'||globalThis.WBContract.OPERATIONS[entry?.operation]?.response_mode==='binary';}
  function budget(entry,record,ai){
    const maximum=globalThis.WBAIDeliveryCapabilities.profile(ai)?.max_files_per_turn;
    if(!Number.isSafeInteger(maximum)||maximum<1||!fileProducing(entry))return null;
    const acquired=new Set();
    for(const row of record.items||[]){
      if(row.state!=='success'||!fileProducing(row))continue;
      const refs=row.artifact_refs||[];
      for(const d of refs)acquired.add(d.ref);
      // An obtained binary body still consumes a slot if artifact storage failed.
      if(!refs.length&&row.http_status>=200&&row.http_status<300)acquired.add('request:'+row.request_id);
    }
    if(acquired.size<maximum)return null;
    return Object.freeze({state:'deferred',reason:'TARGET_AI_FILE_LIMIT',target_ai:ai,max_files_per_turn:maximum,
      physical_request_count:0,external_request_executed:false,automatic_continuation:false,
      next_command_text:entry.command_text,
      message:'Команда получения следующего файла отложена до отдельного сообщения. Запрос к WB не выполнялся.'});
  }
  function retainedReceipt(record,descriptor,{attachmentsComplete=true}={}){
    return 'WB_RESULT_V1\n'+JSON.stringify({bridge:'wildberries-llm-api-bridge',request_id:record.request_id,
      operation:'bridge_delivery',http_status:0,request_meta:{provider:'bridge_local',physical_request_count:0,external_request_executed:false,automatic_retry:false},
      delivery:{complete:false,attachments_complete:attachmentsComplete,full_text_retained:true,ref:descriptor.ref,sha256:descriptor.sha256,byte_length:descriptor.byte_length,expires_at:descriptor.expires_at,
        next_command_text:localCommand(descriptor.ref),automatic_continuation:false,
        message:'Полный текст сохранён локально без сокращений. Следующая явная WB_FILE_V1 команда получает его без повторения WB-запросов.'}},null,2);
  }
  globalThis.WBDeliveryPolicy=Object.freeze({PREFIX,parseLocal,localCommand,fileProducing,budget,retainedReceipt});
})();
