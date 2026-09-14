import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {reporter} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),log=reporter(process.argv[3]);
const box={URL,URLSearchParams,TextEncoder,TextDecoder,AbortController,Response,Headers,Uint8Array,ArrayBuffer,crypto:crypto.webcrypto,setTimeout,clearTimeout,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary')};
const c=vm.createContext(box);
for(const f of ['wb_operations','wb_contract','wb_credentials','artifact_store','provider_transport_core','response_verifier','wb_provider'])vm.runInContext(fs.readFileSync(path.join(root,'shared',f+'.js'),'utf8'),c,{filename:f});
const request={url:'https://common-api.wildberries.ru/api/v1/seller-info',method:'GET',headers:{Authorization:'SYNTHETIC-TOKEN'}};
await log.test('REDIRECT_CANNOT_CREATE_A_HIDDEN_PROVIDER_REQUEST',async()=>{let calls=0,options;await box.ProviderTransportCore.executeJsonOnce({request,fetchImpl:async(u,o)=>{calls++;options=o;return new Response('{}',{headers:{'Content-Type':'application/json'}})}});assert.equal(calls,1);assert.equal(options.redirect,'error')});
for(const binary of [false,true])await log.test((binary?'BINARY':'JSON')+'_BODY_IS_WITHIN_REQUEST_DEADLINE',async()=>{
 let release,cancelled=false,calls=0;
 const response={ok:true,status:200,headers:new Headers(),body:{getReader:()=>({read:()=>new Promise(r=>{release=r}),cancel:async()=>{cancelled=true;release?.({done:true})}})}};
 const job=(binary?box.ProviderTransportCore.executeBinaryOnce:box.ProviderTransportCore.executeJsonOnce)({request,timeoutMs:25,fetchImpl:async()=>{calls++;return response}}).then(()=>({code:'UNEXPECTED_SUCCESS'}),e=>e);
 const result=await Promise.race([job,new Promise(r=>setTimeout(()=>r({code:'BODY_DEADLINE_NOT_ENFORCED'}),100))]);
 release?.({done:true});await job;assert.equal(result.code,'REQUEST_TIMEOUT');assert.equal(calls,1);assert.equal(cancelled,true);
});
await log.test('BINARY_STORAGE_FAILURE_PRESERVES_OBTAINED_BYTES',async()=>{
 const bytes=Buffer.from('%PDF-1.7\nSYNTHETIC COMPLETE BYTES');let calls=0;
 const provider=box.WBProviderFactory.createWBProvider({fetchImpl:async()=>{calls++;return new Response(bytes,{headers:{'Content-Type':'application/pdf'}})},artifactSink:async()=>{throw new Error('synthetic IDB abort')}});
 const r=await provider.executeCommand('WB_API_V1 {"operation":"analytics_report_download","params":{"path":{"downloadId":"fixture-job"}}}',{token:'SYNTHETIC-TOKEN'});
 assert.equal(r.ok,true);assert.equal(r.delivery_error.code,'ARTIFACT_STORAGE_FAILED');assert.equal(calls,1);const env=JSON.parse(r.report_text.slice('WB_RESULT_V1\n'.length));assert.equal(Buffer.from(env.result.content_base64||'','base64').toString(),bytes.toString());
});
log.finish({scope:'Pure transport/provider fixtures; no real provider network; response headers are not complete-body success'});
