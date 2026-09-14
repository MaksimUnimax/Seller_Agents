import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
export const ID='11111111-1111-1111-1111-111111111111';
export const identity={origin:'https://chatgpt.com',ai_id:'chatgpt',conversation_id:ID,status:'confirmed',source:'synthetic-DOM'};
export const key=identity.origin+'|'+ID;
export const pendingKey='wb_work_pending_start_v2:1';
export const workKey='wb_work_session_v1:'+key;
export function boot(root,data={},options={}) {
 let listener;const removed=[],connected=[],alarmListeners=[];const events=[];const messages=[];const tasks=new Set(),ports=new Map();
 const state={identity:{...identity},generation:'content-g1',runtimeId:'content-g1',renewalAck:true,refuseRenewal:false,changeIdentityOnRenew:false,documentId:'document-1',proof:{user_turn_id:'user-new',assistant_turn_id:'assistant-new',matched:true,complete:true},visibility:true,dropDispatch:false,failWrite:null,corruptRead:false};
 const counts={provider:0,promptDispatch:0};
 const popup={id:'fixture',url:'chrome-extension://fixture/popup.html'};
 const tab=()=>({id:1,url:state.tabUrl||state.identity.origin+(state.identity.conversation_id?(state.identity.ai_id==='alice'?'/chat/':'/c/')+state.identity.conversation_id:'/')});
 const content=()=>({id:'fixture',tab:tab(),url:tab().url,frameId:0,documentId:state.documentId});
 function setTimer(fn,ms,...args){const t=setTimeout(()=>{tasks.delete(t);fn(...args)},options.timerDelay?options.timerDelay(ms):ms);tasks.add(t);return t;}
 const reorder=v=>Array.isArray(v)?v.map(reorder):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().reverse().map(k=>[k,reorder(v[k])])):v;
 const box={URL,URLSearchParams,TextEncoder,TextDecoder,AbortController,Headers,Response,Blob,Uint8Array,crypto:crypto.webcrypto,setTimeout:setTimer,clearTimeout,queueMicrotask,console,atob:s=>Buffer.from(s,'base64').toString('binary'),btoa:s=>Buffer.from(s,'binary').toString('base64')};
 box.chrome={runtime:{id:'fixture',lastError:null,getURL:p=>'chrome-extension://fixture/'+p,onMessage:{addListener:f=>listener=f},onConnect:{addListener:f=>connected.push(f)}},
 alarms:{onAlarm:{addListener:f=>alarmListeners.push(f)},async create(name,info){events.push({type:'alarm',name,info:structuredClone(info)})}},
 storage:{local:{async get(keys){if(keys===null)return state.reorderReads?reorder(structuredClone(data)):structuredClone(data);const obj=Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(data[k])]));if(state.corruptRead&&obj[pendingKey])obj[pendingKey].revision=-1;return state.reorderReads?reorder(obj):obj;},async set(v){events.push({type:'storage',keys:Object.keys(v),value:structuredClone(v)});if(state.failWrite?.(v))throw new Error('synthetic storage failure');Object.assign(data,structuredClone(v));},async remove(keys){for(const k of Array.isArray(keys)?keys:[keys])delete data[k];}}},
 tabs:{async get(){return tab()},async query(){return [tab()]},onRemoved:{addListener:f=>removed.push(f)},sendMessage(id,m,cb){messages.push(structuredClone(m));if(options.onTabMessage){if(m.type==='WB_WORK_SEND_INITIAL_PROMPT')counts.promptDispatch++;Promise.resolve(options.onTabMessage(id,m)).then(v=>{if(m.type==='WB_GET_IDENTITY'&&v?.identity){state.identity=v.identity;state.generation=v.runtime_generation||v.runtime_id;}cb(v)},e=>cb({ok:false,code:'HARNESS_TAB_ERROR',error:String(e)}));return;}let result;
 if(m.type==='WB_GET_IDENTITY')result={ok:true,identity:state.identity,runtime_id:state.runtimeId,runtime_generation:state.generation};
 else if(m.type==='WB_WORK_SEND_INITIAL_PROMPT'){counts.promptDispatch++;result=state.dropDispatch?{ok:false,code:'TAB_MESSAGE_ERROR'}:{ok:true,sent:true,intent_id:m.intent_id,revision:m.revision};}
 else if(m.type==='WB_WORK_START_PROOF')result={ok:true,identity:state.identity,runtime_generation:state.generation,...state.proof};
 else if(m.type==='WB_WORK_VISIBILITY')result={ok:state.visibility,applied:state.visibility};
 else if(m.type==='WB_WORK_START_WATCH')result={ok:true,started:true};
 else if(m.type==='WB_WORK_START_CANCEL')result={ok:true,cancelled:true};
 else if(m.type==='WB_WORK_RUNTIME_FREEZE')result={ok:true,applied:true,runtime_id:state.runtimeId,runtime_generation:state.generation,assistant_baseline_ids:['assistant-old']};
 else if(m.type==='WB_WORK_RUNTIME_RENEW'){if(state.changeIdentityOnRenew)state.identity={...state.identity,conversation_id:'22222222-2222-2222-2222-222222222222'};if(state.renewalAck)state.generation=m.runtime_generation;result={ok:state.renewalAck,applied:state.renewalAck,runtime_id:state.runtimeId,runtime_generation:state.generation,identity:state.identity,baseline_applied:true,recovery_id:m.recovery_id};}
 else if(m.type==='WB_RUNTIME_REFRESH'){if(!state.refuseRenewal){state.runtimeId+='-next';state.generation=m.new_runtime_generation||state.runtimeId;}result={ok:!state.refuseRenewal,code:state.refuseRenewal?'WORK_REFRESH_CONTENT_RECONNECT_FAILED':null,refreshed:true,runtime_id:state.runtimeId};}
 else if(m.type==='WB_AUTO_GET_BASELINE')result={ok:true,assistant_baseline_ids:[]};
 else result={ok:false,code:'SYNTHETIC_UI_UNAVAILABLE'};
 queueMicrotask(()=>cb(structuredClone(result)));
 }} };
 box.fetch=async()=>{counts.provider++;return new Response('{"fixture":"success"}',{status:200,headers:{'Content-Type':'application/json'}})};
 const context=vm.createContext(box);
 box.importScripts=(...names)=>{for(const n of names)vm.runInContext(fs.readFileSync(path.join(root,n),'utf8'),context,{filename:n,timeout:3000})};
 vm.runInContext(fs.readFileSync(path.join(root,'service_worker.js'),'utf8'),context,{filename:'service_worker.js',timeout:3000});
 const call=(m,s=popup)=>new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('HARNESS_TIMEOUT '+m.type)),2500);listener(m,s,r=>{clearTimeout(t);resolve(r)})});
 function openPort(id,name){const incoming=[],disconnected=[];const port={name,sender:content(),onMessage:{addListener:f=>incoming.push(f)},onDisconnect:{addListener:f=>disconnected.push(f)},postMessage:m=>options.onPortMessage?.(id,m)};ports.set(id,{incoming,disconnected});for(const f of connected)f(port);}
 return {data,state,counts,events,messages,context,popup,content,call,openPort,alarm:async name=>{for(const f of alarmListeners)await f({name})},portMessage:(id,m)=>{for(const f of ports.get(id)?.incoming||[])f(m)},disconnectPort:id=>{for(const f of ports.get(id)?.disconnected||[])f();ports.delete(id)},eval:code=>vm.runInContext(code,context),start:()=>call({type:'WB_WORK_ACTION',action:'start',tab_id:1,identity:state.identity}),settle:()=>new Promise(r=>setTimeout(r,15)),remove:async()=>{for(const f of removed)await f(1)},dispose:()=>{for(const t of tasks)clearTimeout(t)}};
}
export function reporter(out){fs.mkdirSync(out,{recursive:true});const fd=fs.openSync(path.join(out,'results.jsonl'),'wx'),rows=[];return {async test(id,fn){let row;try{await fn();row={id,status:'PASS'}}catch(e){row={id,status:'FAIL',error:e.message,stack:e.stack}}rows.push(row);fs.writeSync(fd,JSON.stringify(row)+'\n');fs.fsyncSync(fd);console.log(id,row.status,row.error||'')},finish(extra={}){const s={passed:rows.filter(x=>x.status==='PASS').length,failed:rows.filter(x=>x.status==='FAIL').length,...extra};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(s,null,2));fs.closeSync(fd);console.log(s);process.exitCode=s.failed?1:0;return s}}}
