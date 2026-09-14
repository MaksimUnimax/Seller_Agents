(() => {
  "use strict";
  function createWBProvider({contract=globalThis.WBContract,fetchImpl=globalThis.fetch,uuid=()=>globalThis.crypto.randomUUID(),now=()=>Date.now(),timeoutMs=30_000,maxBytes=3_000_000,maxBinaryBytes=12_000_000,artifactSink=null,quarantineSink=null,verificationPolicy=null}={}){
    const policy=globalThis.WBResponseVerifier.policy(verificationPolicy);
    async function executeCommand(commandText,rawCredentials){
      const command=contract.parseCommand(commandText);const credentials=globalThis.WBCredentials.normalizeSellerCredentials(rawCredentials,{required:true});const meta=contract.resolveOperation(command.operation);const request=contract.buildRequest(command,globalThis.WBCredentials.sellerHeaders(credentials,{hasBody:requestBody(command,meta)}));const requestId=String(uuid());
      let response;
      if(request.response_mode==="binary") response=await globalThis.ProviderTransportCore.executeBinaryOnce({fetchImpl,request,timeoutMs,maxBytes:maxBinaryBytes,now});
      else response=await globalThis.ProviderTransportCore.executeJsonOnce({fetchImpl,request,timeoutMs,maxBytes,now});
      const checked=globalThis.WBResponseVerifier.verify(response,{binary:request.response_mode==='binary',policy});
      async function processingFailure(error,details=checked.details){
        let capture={stored_locally:false,raw_retention_failed:true,chat_access_blocked:true};
        if(quarantineSink)try{const bytes=request.response_mode==='binary'?WBArtifactStore.decode(response.binaryBase64):new TextEncoder().encode(response.rawText);const descriptor=await quarantineSink(bytes,{name:'WB-unverified-response-'+requestId+'.bin',mime:'application/octet-stream',requestId});capture={stored_locally:true,ref:descriptor.ref,sha256:descriptor.sha256,byte_length:descriptor.byte_length,chat_access_blocked:true}}catch(_){}
        const code=/^[A-Z0-9_]{1,100}$/.test(error?.code||'')?error.code:'RESPONSE_PROCESSING_FAILED';
        const result={error:{code,stage:'response_processing',automatic_retry:false},provider_http_ok:response.ok,provider_http_status:response.httpStatus,raw_capture:capture,body_omitted:true};
        const report='WB_RESULT_V1\n'+JSON.stringify({bridge:'wildberries-llm-api-bridge',version:contract.VERSION,request_id:requestId,operation:command.operation,http_status:response.httpStatus,bridge_error:true,request_meta:{provider:'wildberries',host_alias:request.host_alias,http_method:request.method,path_alias:command.operation,external_request_executed:true,physical_request_count:1,automatic_retry:false,verification:details},result,elapsed_ms:response.elapsedMs});
        return Object.freeze({ok:false,artifact_refs:[],request_id:requestId,operation:command.operation,command_fingerprint:contract.commandFingerprint(command),http_status:response.httpStatus,report_text:report,response_meta:response.responseMeta,verification:code==='PROVIDER_JSON_INVALID'?'MALFORMED_DECLARED_JSON':'RESPONSE_PROCESSING_FAILED',verification_details:details});
      }
      if(checked.error)return processingFailure(checked.error);
      try{
      const err=response.ok?null:contract.safeErrorPayload(response.httpStatus,response.rawText,response.parsed);
      let artifactRefs=[],deliveryError=null;
      let binaryResult=null;
      if(response.ok && request.response_mode==="binary" && artifactSink){
        try{
          const mime=String(response.responseMeta?.content_type||'application/octet-stream').split(';')[0].trim();
          const extensions={'text/plain':'txt','text/csv':'csv','application/pdf':'pdf','image/png':'png','application/zip':'zip','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx'};
          const bytes=WBArtifactStore.decode(response.binaryBase64);
          const descriptor=await artifactSink(bytes,{name:'WB-'+command.operation+'-'+requestId+'.'+(extensions[mime]||'bin'),mime,requestId});
          artifactRefs=[descriptor];binaryResult={artifact:descriptor,byte_length:response.byteLength,delivery_status:'PREPARED_NOT_ATTACHED'};
        }catch(e){deliveryError={code:'ARTIFACT_STORAGE_FAILED',provider_http_status:response.httpStatus,provider_ok:true,automatic_retry:false};binaryResult={content_base64:response.binaryBase64,byte_length:response.byteLength,delivery_error:deliveryError,bytes_preserved_in_result:true};}
      }
      const rawResult=response.ok?(request.response_mode==="binary"?(binaryResult||{content_base64:response.binaryBase64,byte_length:response.byteLength}):checked.details.parse==='json'?checked.value:response.rawText):{error:err};
      const result=response.ok?contract.sanitizeResult(command,rawResult):rawResult;
      const reportText=contract.formatResultReport({requestId,command,requestMeta:{host_alias:request.host_alias,http_method:request.method,path_alias:command.operation},httpStatus:response.httpStatus,result,elapsedMs:response.elapsedMs,pagination:{explicit_only:true,hidden_requests:0,automatic_retry:false},rateLimit:response.responseMeta?.retry_after?{retry_after:response.responseMeta.retry_after}:null});
      return Object.freeze({artifact_refs:artifactRefs,delivery_error:deliveryError,verification:checked.details.fully_verified?"VERIFIED_PROVIDER_SCHEMA_AND_SEMANTICS":request.response_mode==="binary"?"BINARY_BYTES_CAPTURED":checked.details.parse!=="json"?"NON_JSON_BODY":"STRUCTURAL_ONLY_WB_SCHEMA_PENDING",verification_details:checked.details,ok:response.ok,request_id:requestId,operation:command.operation,command_fingerprint:contract.commandFingerprint(command),http_status:response.httpStatus,report_text:reportText,response_meta:response.responseMeta});
      }catch(error){return processingFailure(error,{...checked.details,sanitation:"failed"})}
    }
    function requestBody(command,meta){return meta.method==="POST"&&command.body!==undefined;}
    async function testConnection(rawCredentials,probeCommandText=null){const credentials=globalThis.WBCredentials.normalizeSellerCredentials(rawCredentials,{required:true});if(probeCommandText)return executeCommand(probeCommandText,rawCredentials);const request={url:"https://common-api.wildberries.ru/ping",host_alias:"common",method:"GET",headers:globalThis.WBCredentials.sellerHeaders(credentials),body:undefined,response_mode:"json"};const response=await globalThis.ProviderTransportCore.executeJsonOnce({fetchImpl,request,timeoutMs,maxBytes,now});if(!response.ok)return Object.freeze({ok:false,code:"WB_API_ERROR",message:`Wildberries API отклонил /ping: HTTP ${response.httpStatus}.`,http_status:response.httpStatus,elapsed_ms:response.elapsedMs,response_meta:response.responseMeta});return Object.freeze({ok:true,code:"CONNECTED",message:"Получен успешный ответ WB /ping. Права отдельных операций не проверялись.",http_status:response.httpStatus,elapsed_ms:response.elapsedMs,response_meta:response.responseMeta});}
    return Object.freeze({executeCommand,testConnection});
  }
  globalThis.WBProvider=createWBProvider();globalThis.WBProviderFactory=Object.freeze({createWBProvider});
})();
