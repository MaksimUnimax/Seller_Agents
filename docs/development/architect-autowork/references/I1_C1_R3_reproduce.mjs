import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
// SA_REVIEW_REPOSITORY must point to an e26fcc7 candidate checkout. Node24.
const repo=path.resolve(process.env.SA_REVIEW_REPOSITORY || '.');
const { makeWorker, signFixtureBootstrap }=await import(pathToFileURL(path.join(repo,'tests/regression/extension-core/worker-harness.mjs')));
const { createAuthRepository }=await import(pathToFileURL(path.join(repo,'packages/server/db/src/auth-repository.ts')));
import assert from 'node:assert/strict';
import fs from 'node:fs';
const runtime=fs.mkdtempSync(path.join(os.tmpdir(),'sa-r3-review-'));
for(const n of ['config','crypto','client'])fs.copyFileSync(path.join(repo,'packages/control-client/src',n+'.js'),path.join(runtime,n+'.js'));
fs.writeFileSync(path.join(runtime,'service_worker_entry.js'),"importScripts('config.js','crypto.js','client.js');\n");
const K='seller_agents_control_auth_v2';
const rows=[];
for(const mode of ['oversized-200','oversized-201','oversized-206','top-semver-prerelease-build','unconfigured-account']){
 const backing={local:{},session:{}};let template;
 const w=await makeWorker(runtime,{backing,fetch:async()=>{
  if(mode.startsWith('oversized-'))return new Response('x'.repeat(1024*1024+1),{status:Number(mode.slice(-3))});
  const p=structuredClone(template.authority.payload);
  if(mode==='unconfigured-account'){p.ai={status:'UNCONFIGURED'};p.accessBasis='NONE';}
  else p.compatibility.extension.minimumVersion='0.2.4-alpha.2+build.7';
  return new Response(JSON.stringify(await signFixtureBootstrap(backing,p)));
 }});
 template=structuredClone(backing.local[K]);
 if(mode==='unconfigured-account')backing.local[K].authority=null;
 let code=null;try{await w.call('SellerAgentsControlClient.bootstrap');}catch(e){code=e.code;}
 const status=await w.call('SellerAgentsControlClient.status');
 rows.push({mode,error:code,authenticated:status.authenticated,workAllowed:status.workAllowed});w.close();
}
assert.equal(rows[0].workAllowed,false);
assert.equal(rows[1].workAllowed,true);
assert.equal(rows[2].workAllowed,true);
assert.equal(rows[3].workAllowed,false);
assert.equal(rows[4].authenticated,true);
assert.equal(rows[4].workAllowed,false);
const queries=[];
const tx={query:async(sql,args)=>{
 queries.push(sql);
 if(sql.startsWith('INSERT INTO auth_rate_limit_buckets'))return {rows:[{count:1}]};
 if(sql.startsWith('SELECT * FROM otp_challenges'))return {rows:[{id:'fixture-challenge',normalized_identity_target:'fixture@example.test',verification_hash:'fixture',attempt_count:0,max_attempts:5,expires_at:new Date(Date.now()+60000),consumed_at:null,invalidated_at:null}]};
 if(sql.startsWith('UPDATE otp_challenges SET consumed_at'))return {rows:[{id:'fixture-challenge'}]};
 if(sql.includes('pg_advisory_xact_lock'))return {rows:[]};
 if(sql.startsWith('SELECT i.user_id'))return {rows:[]};
 if(sql.startsWith('SELECT mode,capacity,admitted'))return {rows:[{mode:'CLOSED',capacity:0,admitted:0}]};
 throw new Error('unexpected query');
}};
const db={transaction:async(fn)=>fn(tx)};
const result=await createAuthRepository(db).verifyOtp({challengeId:'fixture-challenge',code:'fixture',ipKey:'fixture',correlationId:'fixture',idempotencyHash:'fixture',verify:()=>true,sessionHash:'fixture',expiresAt:new Date(Date.now()+60000)});
assert.equal(result.code,'BETA_CLOSED');
rows.push({mode:'repository-new-identity-default-closed',result,scope:'exact repository function, controlled SQL replies matching migration defaults; not real PostgreSQL'});
fs.writeFileSync(path.resolve('I1_C1_R3_reproduction-results.json'),JSON.stringify({head:'e26fcc7dd60617838cb9a49d7c6560018cb45ec3',scope:'exact-source VM and repository function probes; no installed/live acceptance',rows},null,2));
console.log(JSON.stringify(rows));
