import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {makeWorker,signFixtureBootstrap} from './worker-harness.mjs';
const src=JSON.parse(fs.readFileSync(new URL('./source-functions.json',import.meta.url)));
const rows=[];
for(const mode of ['unsupported-popup-tab','missing-tab','supported-ai-tab']) {
 let reads=0;
 const context=vm.createContext({
  tabMessage:async()=>mode==='supported-ai-tab'?{ok:true,identity:{ai_id:'chatgpt',conversation_id:null}}:{ok:false,code:'IDENTITY_UNAVAILABLE'},
  normalizeIdentity:x=>x,
  saPublicContext:async()=>({work_active:false,button_visible:false}),
  getPendingWorkStarts:async()=>({}),
  SellerAgentsControlClient:{status:async()=>{reads++;return {authenticated:false,pending:{userCode:'ABCD-EFGH'},workAllowed:false};}},
  saCatalog:{list:async()=>[]},
 });
 vm.runInContext(src.normalizeTabId+src.tabIdentity+src.popupState,context);
 let code=null,result=null;
 try{result=await vm.runInContext(`saPopupState(${mode==='missing-tab'?'undefined':'999'})`,context);}catch(e){code=e.code;}
 if(mode==='supported-ai-tab'){assert.equal(result.auth.pending.userCode,'ABCD-EFGH');assert.equal(reads,1);}
 else {assert.equal(reads,0);assert.equal(code,mode==='missing-tab'?'INVALID_TAB_ID':'IDENTITY_UNAVAILABLE');}
 rows.push({mode,code,authStateReads:reads,ok:result?.ok===true});
}
const K='seller_agents_control_auth_v2';
for(const mode of ['oversized-200','oversized-201','oversized-206','top-semver-prerelease-build']) {
 const backing={local:{},session:{}};let template;
 const w=await makeWorker(new URL('./runtime/',import.meta.url).pathname,{backing,fetch:async()=>{
  if(mode.startsWith('oversized-'))return new Response('x'.repeat(1024*1024+1),{status:Number(mode.slice(-3))});
  const p=structuredClone(template.authority.payload);p.compatibility.extension.minimumVersion='0.2.4-alpha.2+build.7';
  return new Response(JSON.stringify(await signFixtureBootstrap(backing,p)));
 }});
 template=structuredClone(backing.local[K]);let code=null;
 try{await w.call('SellerAgentsControlClient.bootstrap');}catch(e){code=e.code;}
 const status=await w.call('SellerAgentsControlClient.status');
 assert.equal(status.workAllowed,mode==='top-semver-prerelease-build');
 rows.push({mode,code,authenticated:status.authenticated,workAllowed:status.workAllowed});w.close();
}
const output={head:'60c3a34bdc1b6a5563fad59e8ac38c78b76e32d3',scope:'exact client modules and extracted popup-state functions; mocked tab transport; no installed acceptance',rows};
fs.writeFileSync(new URL('./results.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output));
