import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {boot,reporter} from './worker_harness.mjs';
const root=path.resolve(process.argv[2]),log=reporter(process.argv[3]);
function popup(){
 const timers=new Set(),sent=[],callbacks=[],nodes=new Map();
 const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',dataset:{},className:'',append(){},addEventListener(){},checked:false,textContent:''});return nodes.get(id)};
 const box={console,URL,Blob,Set,Map,document:{getElementById:node,createElement:()=>node('option'),activeElement:null},window:{addEventListener(){}},navigator:{},setInterval:()=>0,clearInterval(){},setTimeout(fn,ms){const t=setTimeout(()=>{timers.delete(t);fn()},ms>=30000?15:ms);timers.add(t);return t},clearTimeout(t){timers.delete(t);clearTimeout(t)},chrome:{runtime:{getManifest:()=>({version:'fixture'}),sendMessage(m,cb){sent.push(m);callbacks.push(cb)}},tabs:{query:()=>new Promise(()=>{}),sendMessage(id,m,cb){sent.push(m);callbacks.push(cb)}}}};
 const c=vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(root,'shared/ai_delivery_capabilities.js'),'utf8'),c);vm.runInContext(fs.readFileSync(path.join(root,'popup.js'),'utf8'),c);
 return {sent,callbacks,eval:s=>vm.runInContext(s,c),dispose(){for(const t of timers)clearTimeout(t)}};
}
for(const [name,expression] of [['RUNTIME','send("WB_WORK_ACTION",{action:"start"})'],['CONTENT','tabMessage(1,{type:"WB_RUNTIME_REFRESH"})'],['TAB_QUERY','resolvePopupContext()']])await log.test('POPUP_'+name+'_CHANNEL_DEADLINE_NO_REPLAY',async()=>{const p=popup();try{const r=await Promise.race([p.eval(expression),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Unbounded popup channel')),150))]);assert.ok(r?.code==='RUNTIME_MESSAGE_TIMEOUT'||r?.code==='TAB_MESSAGE_TIMEOUT'||r?.available===false);assert.ok(p.sent.filter(m=>['WB_WORK_ACTION','WB_RUNTIME_REFRESH'].includes(m.type)).length<=1);if(name!=='TAB_QUERY'&&p.callbacks.length){p.callbacks[0]({ok:true});assert.equal(r.ok,false);assert.equal(r.automatic_retry,false)}}finally{p.dispose()}});
await log.test('DIAGNOSTIC_REDACTS_ACTIVE_SECRET_IN_ARBITRARY_VALUE',async()=>{const w=boot(root);try{w.data.wbmb_seller_token='synthetic-private-token-only';w.context.secret=w.data.wbmb_seller_token;await w.eval('diagnostic("TRANSPORT_FAILED",{error:"Echo: "+secret,nested:{value:secret},body:"omit",authorization:"omit"})');const last=w.data.wbmb_diagnostics.at(-1);assert.ok(!JSON.stringify(last).includes(w.data.wbmb_seller_token));assert.ok(!('body' in last));assert.equal(last.event,'TRANSPORT_FAILED')}finally{w.dispose()}});
await log.test('DIAGNOSTIC_AUTHORITATIVE_FIELDS_CANNOT_BE_OVERWRITTEN',async()=>{const w=boot(root);try{await w.eval('diagnostic("DELIVERY_SEND_COMMITTED",{sequence:-1,event_id:"forged",event:"FAKE_SUCCESS",at:"forged",runtime_version:"0",source:"forged"})');const last=w.data.wbmb_diagnostics.at(-1);assert.equal(last.event,'DELIVERY_SEND_COMMITTED');assert.ok(last.sequence>0);assert.notEqual(last.event_id,'forged');assert.notEqual(last.at,'forged');assert.equal(last.runtime_version,w.eval('VERSION'));assert.equal(last.source,'service_worker')}finally{w.dispose()}});
log.finish({scope:'Actual popup and worker source; messaging/storage/clock fixtures; real provider requests=0'});
