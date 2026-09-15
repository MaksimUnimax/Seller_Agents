import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
// Run with SA_REVIEW_REPOSITORY pointing to a checkout of candidate 0b2a1776.
const repo=path.resolve(process.env.SA_REVIEW_REPOSITORY || '.');
const { makeWorker }=await import(pathToFileURL(path.join(repo,'tests/regression/extension-core/worker-harness.mjs')));
import { webcrypto } from 'node:crypto';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const runtime=fs.mkdtempSync(path.join(os.tmpdir(),'sa-r2-review-'));
for(const n of ['config','crypto','client'])fs.copyFileSync(path.join(repo,'packages/control-client/src',n+'.js'),path.join(runtime,n+'.js'));
fs.writeFileSync(path.join(runtime,'service_worker_entry.js'),"importScripts('config.js','crypto.js','client.js');\n");
const K='seller_agents_control_auth_v2';
const canonical=v=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(canonical).join(',')+']':'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
const rows=[];
for(const mode of ['oversized-success','unconfigured-account']){
 const backing={local:{},session:{}};let template;
 const w=await makeWorker(runtime,{backing,fetch:async()=>{
  if(mode==='oversized-success')return new Response('x'.repeat(1024*1024+1));
  const p=structuredClone(template.authority.payload);p.ai={status:'UNCONFIGURED'};p.accessBasis='NONE';
  const bytes=Buffer.from(canonical(p));
  const pk=await webcrypto.subtle.importKey('pkcs8',Buffer.from(backing.local.__seller_agents_fixture_signing_key.privateKey,'base64'),{name:'Ed25519'},false,['sign']);
  const signature=await webcrypto.subtle.sign('Ed25519',pk,Buffer.concat([Buffer.from('product-control-plane/bootstrap-snapshot/v1\0fixture-key\0'),bytes]));
  return new Response(JSON.stringify({envelopeVersion:'bootstrap_envelope_v2',algorithm:'Ed25519',keyId:'fixture-key',payload:bytes.toString('base64url'),signature:Buffer.from(signature).toString('base64url')}));
 }});
 template=structuredClone(backing.local[K]);
 if(mode==='unconfigured-account')backing.local[K].authority=null;
 assert.equal(await w.call('SellerAgentsControlClient.canWork'),mode==='oversized-success');
 let code=null;try{await w.call('SellerAgentsControlClient.bootstrap');}catch(e){code=e.code;}
 const status=await w.call('SellerAgentsControlClient.status');
 rows.push({mode,error:code,authenticated:status.authenticated,workAllowed:status.workAllowed});w.close();
}
assert.equal(rows[0].workAllowed,true,'candidate defect: oversized success preserves Work');
assert.equal(rows[1].authenticated,false,'candidate defect: signed initial-account UNCONFIGURED rejected');
fs.writeFileSync(path.resolve('I1_C1_R2_reproduction-results.json'),JSON.stringify({head:'0b2a1776ff484d2410b3a43d338ec5548e73f019',scope:'exact-source client modules in VM; no installed/live acceptance',rows},null,2));
console.log(JSON.stringify(rows));
