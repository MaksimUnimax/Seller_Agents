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
 const box={crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,atob,btoa,URL,Headers,Response,queueMicrotask,setTimeout:f.suppressTimers?()=>0:setTimeout,clearTimeout,navigator:{userAgent:'Chrome/120.0.0.0'},performance:{now:()=>f.clock.mono},_wall:()=>f.clock.wall};
 const ctx=vm.createContext(box);const clone=x=>vm.runInContext('JSON.parse',ctx)(JSON.stringify(x));
 box.chrome={storage:{local:{get:async k=>clone({[k]:f.backing.local[k]}),set:async v=>{if(f.writeHook)await f.writeHook(v);Object.assign(f.backing.local,structuredClone(v));},remove:async k=>{f.removes=(f.removes||0)+1;if(f.removeHook)await f.removeHook(k);delete f.backing.local[k];}}}};
 box.__SELLER_AGENTS_PACKAGED_CONFIG__=JSON.stringify(config);
 box.fetch=async (url,options)=>{f.network.push({url,hasBearer:new Headers(options?.headers).has('Authorization'),hasDeviceCode:Boolean(options?.body&&JSON.parse(options.body).deviceCode)});if(f.fetch)return f.fetch(url,options);return new Response(JSON.stringify({error:{code:'PROBE_UNAVAILABLE'}}),{status:503});};
 vm.runInContext('Date.now=()=>_wall()',ctx);
 for(const file of ['config.js','crypto.js'])vm.runInContext(fs.readFileSync(new URL('../i1-sync-review/'+file,import.meta.url),'utf8'),ctx);
 vm.runInContext(fs.readFileSync(new URL('./client.js',import.meta.url),'utf8'),ctx);
 const call=(method,...args)=>vm.runInContext('SellerAgentsControlClient.'+method+'(...'+JSON.stringify(args)+')',ctx);
 await call('restore');return call;
}
export {fixture,open,AUTH};
