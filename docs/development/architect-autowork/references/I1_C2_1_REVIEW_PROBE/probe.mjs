import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto,createHash} from 'node:crypto';
import {makeWorker} from '../i1-sync-review/seed.mjs';
const AUTH='seller_agents_control_auth_v2';
const canon=v=>v===null?'null':Array.isArray(v)?'['+v.map(canon).join(',')+']':typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}':JSON.stringify(v);
async function fixture(){
 const {backing,fixtureConfig:config}=await makeWorker('unused');const s=backing.local[AUTH],p=s.authority.payload;
 s.authority.cacheBinding={cacheVersion:'control_cache_binding_v1',controlApiOrigin:config.controlApiOrigin,portalOrigin:config.portalOrigin,contractVersion:config.contractVersion,extensionVersion:config.extensionVersion,browser:{family:'chrome',version:'120.0.0.0'},detectedAi:p.ai.detected,trustBundleSha256:createHash('sha256').update(canon(config.trustBundle)).digest('hex')};
 s.cacheClock={cacheVersion:'control_cache_clock_v1',owner:{controlApiOrigin:config.controlApiOrigin,portalOrigin:config.portalOrigin,contractVersion:config.contractVersion,deviceId:s.credentials.deviceId,sessionId:s.credentials.sessionId},trustedServerTimeMs:Date.parse(p.serverTime),effectiveTimeMs:Date.parse(p.serverTime)};
 return {backing,config,clock:{wall:Date.parse(p.serverTime),mono:1000},network:[],writeHook:null};
}
async function open(f,config=f.config){
 const box={crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,atob,btoa,URL,Headers,Response,setTimeout:f.suppressTimers?()=>0:setTimeout,clearTimeout,navigator:{userAgent:'Chrome/120.0.0.0'},performance:{now:()=>f.clock.mono},_wall:()=>f.clock.wall};
 const ctx=vm.createContext(box);const clone=x=>vm.runInContext('JSON.parse',ctx)(JSON.stringify(x));
 box.chrome={storage:{local:{get:async k=>clone({[k]:f.backing.local[k]}),set:async v=>{if(f.writeHook)await f.writeHook(v);Object.assign(f.backing.local,structuredClone(v));},remove:async k=>{delete f.backing.local[k];}}}};
 box.__SELLER_AGENTS_PACKAGED_CONFIG__=JSON.stringify(config);
 box.fetch=async (url,options)=>{f.network.push({url,hasBearer:new Headers(options?.headers).has('Authorization'),hasDeviceCode:Boolean(options?.body&&JSON.parse(options.body).deviceCode)});return new Response(JSON.stringify({error:{code:'PROBE_UNAVAILABLE'}}),{status:503});};
 vm.runInContext('Date.now=()=>_wall()',ctx);
 for(const file of ['config.js','crypto.js'])vm.runInContext(fs.readFileSync(new URL('../i1-sync-review/'+file,import.meta.url),'utf8'),ctx);
 vm.runInContext(fs.readFileSync(new URL('./client.js',import.meta.url),'utf8'),ctx);
 const call=(method,...args)=>vm.runInContext('SellerAgentsControlClient.'+method+'(...'+JSON.stringify(args)+')',ctx);
 await call('restore');return call;
}
const result={scope:'independent source VM; actual candidate bytes and Ed25519; synthetic clocks/storage/network; no live or installed claim'};
{
 const f=await fixture(),call=await open(f);await call('canWork');f.clock.mono=2000;await call('canWork');f.clock.mono=1500;
 result.monotonic_decrease_above_anchor={observations:[1000,2000,1500],workAllowed:await call('canWork')};
}
{
 const f=await fixture(),call=await open(f);await call('canWork');const initial=f.clock.wall;f.clock.wall=initial+60000;f.clock.mono=1100;await call('canWork');const high=f.backing.local[AUTH].cacheClock.effectiveTimeMs;f.clock.wall=initial;f.clock.mono=2100;await call('canWork');
 result.elapsed_after_wall_jump={elapsedMonotonic:1000,effectiveAdvance:f.backing.local[AUTH].cacheClock.effectiveTimeMs-high};
}
{
 const f=await fixture();let call=await open(f);await call('canWork');call=await open(f,{...f.config,extensionVersion:'0.2.5'});
 const discarded=f.backing.local[AUTH].authority===null,creds=Boolean(f.backing.local[AUTH].credentials);
 call=await open(f,{...f.config,extensionVersion:'0.2.5',controlApiOrigin:'http://127.0.0.1:43199'});try{await call('bootstrap');}catch{}
 result.authority_null_origin_restart={discarded,credentialsRetained:creds,requests:f.network};
}
{
 const f=await fixture(),call=await open(f);await call('canWork');const expiry=Date.parse(f.backing.local[AUTH].authority.payload.expiresAt);f.clock.wall+=100;f.clock.mono+=100;
 let release,entered;const gate=new Promise(r=>entered=r);f.writeHook=async()=>{entered();await new Promise(r=>release=r);};const pending=call('canWork');await gate;f.clock.wall=expiry;f.clock.mono+=3600000;f.writeHook=null;release();
 result.held_write_crosses_expiry={returnedWorkAllowed:await pending,nextWorkAllowed:await call('canWork')};
}
{
 const f=await fixture(),s=f.backing.local[AUTH];s.credentials=null;s.authority=null;s.cacheClock=null;f.suppressTimers=true;
 s.pending={phase:'pending',attemptId:'probe-attempt',authorizationId:'66666666-6666-4666-8666-666666666666',deviceCode:'D'.repeat(43),userCode:'ABCD-EFGH',expiresAt:new Date(f.clock.wall+60000).toISOString(),startIdempotencyKey:'S'.repeat(24),exchangeIdempotencyKey:'E'.repeat(24)};
 await open(f,{...f.config,controlApiOrigin:'http://127.0.0.1:43199'});await new Promise(r=>setImmediate(r));
 result.pending_origin_restart={requests:f.network};
}
const bytes=fs.readFileSync(new URL('./client.js',import.meta.url));result.clientGitBlob=createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
fs.writeFileSync(new URL('./result.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
