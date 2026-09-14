import readline from 'node:readline';
import path from 'node:path';
import {boot} from './worker_harness.mjs';
const waiting=new Map(),artifacts=new Map();let seq=0,w,fileFixture=null,providerTotal=0;
const write=o=>process.stdout.write(JSON.stringify(o)+'\n');
const onTabMessage=(tab_id,message)=>new Promise((resolve,reject)=>{const id='tab-'+(++seq);waiting.set(id,{resolve,reject});write({kind:'tab',id,tab_id,message})});
const options={onTabMessage,onPortMessage:(port_id,result)=>write({kind:'port',port_id,result})};
function files(){if(!fileFixture)return;w.context.fixtureBackend={get:async r=>artifacts.get(r)||null,put:async r=>artifacts.set(r.ref,r),remove:async r=>artifacts.delete(r),all:async()=>[...artifacts.values()]};w.eval('WBArtifactsInstance=WBArtifactStore.create({backend:fixtureBackend})');w.context.fetch=async url=>{w.counts.provider++;providerTotal++;return url.includes('/downloads/file/')?new Response(Buffer.from(fileFixture.base64,'base64'),{headers:{'Content-Type':fileFixture.mime||'application/pdf'}}):new Response(JSON.stringify({fixture:fileFixture.large?'x'.repeat(91000):'JSON fixture'}),{headers:{'Content-Type':'application/json'}})}}
w=boot(path.resolve(process.argv[2]),{},options);
readline.createInterface({input:process.stdin}).on('line',line=>{void(async()=>{const o=JSON.parse(line);if(o.kind==='tab_result'){const p=waiting.get(o.id);waiting.delete(o.id);p?.resolve(o.result);return;}let result;
 if(o.identity)w.state.identity=o.identity;
 if(o.tab_url)w.state.tabUrl=o.tab_url;
 if(o.kind==='state')result={data:w.data,counts:{...w.counts,provider_total:providerTotal},events:w.events,messages:w.messages};
 else if(o.kind==='mutate'){Object.assign(w.data,o.data||{});result={ok:true}}
 else if(o.kind==='file_fixture'){fileFixture=o.fixture;files();result={ok:true}}
 else if(o.kind==='port_open'){w.openPort(o.port_id,o.name);result={ok:true}}
 else if(o.kind==='port_message'){w.portMessage(o.port_id,o.message);result={ok:true}}
 else if(o.kind==='port_disconnect'){w.disconnectPort(o.port_id);result={ok:true}}
 else if(o.kind==='artifacts')result=[...artifacts.values()].map(x=>({ref:x.ref,sha256:x.sha256,byte_length:x.byte_length,source_kind:x.source_kind,expires_at:x.expires_at}));
 else if(o.kind==='recreate'){const data=w.data;const state=w.state;w.dispose();w=boot(path.resolve(process.argv[2]),data,options);Object.assign(w.state,state);files();result={ok:true}}
 else if(o.kind==='call')result=await w.call(o.message,o.sender==='content'?w.content():w.popup);
 else if(o.kind==='dispose'){w.dispose();result={ok:true}}
 write({kind:'result',id:o.id,result});})().catch(e=>write({kind:'error',id:JSON.parse(line).id,error:String(e),stack:e.stack}));});
