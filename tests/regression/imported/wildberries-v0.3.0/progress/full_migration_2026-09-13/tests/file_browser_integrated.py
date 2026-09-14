"""Full real worker dispatcher + real content/popup in Chromium, synthetic AI DOM.
Only Chrome transport/storage and the remote AI webapp are fixture boundaries.
No production source rewriting, no real API network, no manufactured Start proof.
"""
from pathlib import Path
import asyncio,json,sys,os,hashlib,html,traceback,base64
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1];root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False)
ID='11111111-1111-1111-1111-111111111111';OTHER='22222222-2222-2222-2222-222222222222'
rows=[];network=[]
def emit(name,ok,detail=None):
 v={'id':name,'status':'PASS' if ok else 'FAIL','detail':detail};rows.append(v)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(v,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 print(v['status'],name,str(detail)[:250],flush=True)
def expect(ok,message='Assertion failed'):
 if not ok:raise AssertionError(message)
class Fixture:
 async def start(self,browser,ai='chatgpt',new=False):
  self.wait={};self.seq=0;self.errors=[];self.ai=ai;self.new=new;self.tab_tasks=set();self.boundary_hook=None;self.drop_start_response=False
  self.proc=await asyncio.create_subprocess_exec('node',str(R/'tests/worker_rpc.mjs'),str(root),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,limit=4*1024*1024)
  self.ctx=await browser.new_context();self.page=await self.ctx.new_page();self.page.on('pageerror',lambda e:self.errors.append(str(e)))
  self.origin='https://alice.yandex.ru' if ai=='alice' else 'https://chatgpt.com';self.url=self.origin+('/chat/' if ai=='alice' else ('/' if new else '/c/'))+('' if new else ID)
  await self.ctx.route('**/*',lambda route:route.abort());self.pump=asyncio.create_task(self.read())
  composer='<div class="Standalone-Input" data-testid="standalone-input"><textarea data-testid="inputbase-textarea"></textarea><button type="button" data-testid="oknyx" aria-label="Отправить">Send</button></div>' if ai=='alice' else '<form><textarea id="prompt-textarea"></textarea><button type="button" data-testid="send-button" aria-label="Send">Send</button></form>'
  await self.page.set_content('<html><head><style>textarea{width:500px;height:80px}button{width:70px;height:30px}</style></head><body><main></main>'+composer+(('<div class=ChatListItem id='+ID+'><button data-testid=chatlist-item-active aria-current=page>Active</button></div>') if ai=='alice' and not new else '')+'</body></html>')
  await self.page.expose_function('fixtureSha256',lambda values:list(hashlib.sha256(bytes(values)).digest()))
  async def send(message):
   identity=await self.page.evaluate('()=>({origin:fixtureLocation.origin,ai_id:fixtureAI,conversation_id:fixtureId,status:fixtureId?"confirmed":"unknown"})')
   result=await self.rpc('call',message=message,sender='content',identity=identity)
   if self.boundary_hook:result=await self.boundary_hook(message,result)
   return result
  await self.page.expose_function('fixtureSend',send)
  await self.page.evaluate(r'''({url,ai,id})=>{
   const u=new URL(url);window.fixtureAI=ai;window.fixtureId=id;window.fixtureLocation={origin:u.origin,hostname:u.hostname,protocol:u.protocol,pathname:u.pathname,href:u.href};window.fixtureGlobal=new Proxy(globalThis,{get:(t,k)=>k==='location'?fixtureLocation:Reflect.get(t,k),set:(t,k,v)=>Reflect.set(t,k,v)});
   Object.defineProperty(crypto,'subtle',{value:{digest:async(_,bytes)=>Uint8Array.from(await fixtureSha256(Array.from(new Uint8Array(bytes.buffer||bytes,bytes.byteOffset||0,bytes.byteLength)))).buffer},configurable:true});
   if(!crypto.randomUUID)Object.defineProperty(crypto,'randomUUID',{value:()=> 'id-'+Date.now()+'-'+Math.random()});
   window.fixtureListeners=[];window.sentClicks=0;window.fixtureSendMode='normal';window.fixtureTurnMarkup='plain';window.messages=[];
   window.chrome={runtime:{id:'fixture',lastError:null,getURL:p=>'chrome-extension://fixture/'+p,onMessage:{addListener:f=>fixtureListeners.push(f),removeListener:f=>fixtureListeners=fixtureListeners.filter(x=>x!==f)},sendMessage:(m,cb)=>{messages.push(m);fixtureSend(m).then(cb,e=>cb({ok:false,code:'FIXTURE_ERROR',error:String(e)}))}}};
   window.fixtureFire=m=>Promise.all(fixtureListeners.map(f=>new Promise(resolve=>{const keep=f(m,{},resolve);if(!keep)resolve(null)}))).then(rs=>rs.find(x=>x!==null)||{ok:false,code:'NO_CONTENT_LISTENER'});
   window.addTurn=(role,id,text)=>{const n=document.createElement(fixtureAI==='alice'?'div':'section');if(fixtureAI==='alice'){n.dataset.messageRole=role==='assistant'?'alice':'user';n.id=id;}else{n.dataset.turn=role;n.dataset.turnId=id;}if(role==='user'&&fixtureAI==='chatgpt'&&fixtureTurnMarkup==='wrapped'){n.innerHTML='<h5 class="sr-only">Вы сказали:</h5><div data-message-author-role="user"><div class="whitespace-pre-wrap"></div></div><button aria-label="Copy">Copy</button><button aria-label="Edit">Edit</button>';n.querySelector('.whitespace-pre-wrap').textContent=text;}else n.textContent=text;document.querySelector('main').append(n);return n;};
   window.setIdentity=id=>{fixtureId=id;fixtureLocation.pathname=(fixtureAI==='alice'?'/chat/':'/c/')+id;fixtureLocation.href=fixtureLocation.origin+fixtureLocation.pathname;};
   document.querySelector('button').addEventListener('click',()=>{sentClicks++;const c=document.querySelector('textarea'),text=c.value;if(fixtureSendMode==='noop')return;if(fixtureSendMode==='empty-only'){c.value='';return;}if(!fixtureId)setIdentity('11111111-1111-1111-1111-111111111111');addTurn('user','user-new',text);c.value='';c.dispatchEvent(new InputEvent('input',{bubbles:true}));});
  }''',{'url':self.url,'ai':ai,'id':None if new else ID})
  for f in json.loads((root/'manifest.json').read_text())['content_scripts'][0]['js']:
   await self.page.add_script_tag(content='((globalThis,location)=>{\n'+(root/f).read_text()+'\n})(fixtureGlobal,fixtureLocation);')
  await asyncio.sleep(.08);return self
 async def read(self):
  while True:
   line=await self.proc.stdout.readline()
   if not line:return
   try:o=json.loads(line)
   except Exception:continue
   if o['kind']=='port':
    await self.page.evaluate('o=>fixturePortDeliver(o.port_id,o.result)',o);continue
   if o['kind']=='tab':
    task=asyncio.create_task(self.tab(o));self.tab_tasks.add(task);task.add_done_callback(self.tab_tasks.discard);continue
   p=self.wait.pop(o['id'],None)
   if p and not p.done():
    if o['kind']=='error':p.set_exception(RuntimeError(o['error']))
    else:p.set_result(o['result'])
 async def tab(self,o):
  try:r=await self.page.evaluate('m=>fixtureFire(m)',o['message'])
  except Exception as e:r={'ok':False,'code':'BROWSER_FIXTURE_ERROR','error':str(e)}
  if self.drop_start_response and o['message']['type']=='WB_WORK_SEND_INITIAL_PROMPT':r={'ok':False,'code':'TAB_MESSAGE_ERROR','error':'Synthetic callback channel loss AFTER the real content transaction'}
  await self.write({'kind':'tab_result','id':o['id'],'result':r})
 async def restart_content(self):
  await self.page.add_script_tag(content='((globalThis,location)=>{\n'+(root/'content_script.js').read_text()+'\n})(fixtureGlobal,fixtureLocation);')
 async def write(self,o):self.proc.stdin.write((json.dumps(o)+'\n').encode());await self.proc.stdin.drain()
 async def rpc(self,kind,**kw):
  self.seq+=1;i='req-'+str(self.seq);f=asyncio.get_running_loop().create_future();self.wait[i]=f;await self.write({'kind':kind,'id':i,**kw});return await asyncio.wait_for(f,5)
 async def begin(self):
  ident=await self.page.evaluate('()=>({origin:fixtureLocation.origin,ai_id:fixtureAI,conversation_id:fixtureId,status:fixtureId?"confirmed":"unknown"})')
  return await self.rpc('call',message={'type':'WB_WORK_ACTION','action':'start','tab_id':1,'identity':ident},identity=ident)
 async def state(self):return await self.rpc('state')
 async def wait_phase(self,phase,timeout=3):
  deadline=asyncio.get_running_loop().time()+timeout
  while asyncio.get_running_loop().time()<deadline:
   s=await self.state();p=s['data'].get('wb_work_pending_start_v2:1',{})
   if p.get('phase')==phase:return p
   await asyncio.sleep(.08)
  raise AssertionError('Phase '+phase+' not reached. '+json.dumps(s,ensure_ascii=False)[:5000])
 async def complete(self):
  await self.page.evaluate('()=>{const a=addTurn("assistant","assistant-new","Готово");a.insertAdjacentHTML("beforeend",fixtureAI==="chatgpt"?"<button data-testid=copy-turn-action-button>Copy</button>":"<button data-testid=message-copy>Copy</button>")}')
 async def close(self):
  # Fixture teardown first stops the actual content runtime, then drains the
  # simulated transport before closing Playwright or the worker pipe.
  try:await self.page.evaluate('()=>globalThis.__WB_LLM_API_BRIDGE_RUNTIME__?.dispose?.()')
  except Exception:pass
  await asyncio.sleep(.08)
  try:await self.rpc('dispose')
  except Exception:pass
  if self.tab_tasks:
   await asyncio.gather(*list(self.tab_tasks),return_exceptions=True)
  self.proc.terminate();await self.proc.wait();self.pump.cancel()
  await asyncio.gather(self.pump,return_exceptions=True)
  await self.ctx.close()

FILE='WB_API_V1 {"operation":"analytics_report_download","params":{"path":{"downloadId":"fixture-1"}}}'
API='WB_API_V1 {"operation":"seller_info","params":{}}'
BYTES=b'%PDF-1.7\n'+bytes(range(256))*601
class FileFixture(Fixture):
 async def start(self,browser,ai='chatgpt',large=False):
  await super().start(browser,ai=ai)
  await self.rpc('mutate',data={'wbmb_seller_token':'SYNTHETIC-NOT-A-REAL-TOKEN','wbmb_auto_send':True})
  await self.rpc('file_fixture',fixture={'base64':base64.b64encode(BYTES).decode(),'mime':'application/pdf','large':large})
  async def port(kind,port_id,name=None,message=None):return await self.rpc('port_'+kind,port_id=port_id,name=name,message=message)
  await self.page.expose_function('fixturePortSend',port)
  await self.page.evaluate(r'''()=>{
   window.fixturePorts=new Map();window.fileApplications=0;window.fileCaptures=[];window.noPreview=false;window.fileNoopSend=false;window.commandCount=0;
   chrome.runtime.connect=({name})=>{const id='port-'+crypto.randomUUID(),message=[],disconnected=[];const ready=fixturePortSend('open',id,name,null);const port={onMessage:{addListener:f=>message.push(f),removeListener:f=>{const i=message.indexOf(f);if(i>=0)message.splice(i,1)}},onDisconnect:{addListener:f=>disconnected.push(f),removeListener:f=>{const i=disconnected.indexOf(f);if(i>=0)disconnected.splice(i,1)}},postMessage:m=>{ready.then(()=>fixturePortSend('message',id,null,m));},disconnect:()=>{fixturePorts.delete(id);fixturePortSend('disconnect',id,null,null).catch(()=>{});}};fixturePorts.set(id,{message,disconnected});return port;};
   window.fixturePortFault=null;
   window.fixturePortDeliver=(id,m)=>{if(fixturePortFault==='disconnect'&&m.index===1){for(const f of [...(fixturePorts.get(id)?.disconnected||[])])f();return;}if(fixturePortFault==='corrupt'&&m.index===1)m={...m,base64:'AA=='};for(const f of [...(fixturePorts.get(id)?.message||[])])f(m)};
   const composer=document.querySelector('textarea'),root=composer.closest('form,.Standalone-Input');
   const button=root.querySelector('[data-testid="send-button"],[data-testid="oknyx"]'),clone=button.cloneNode(true);button.replaceWith(clone);
   clone.addEventListener('click',()=>{sentClicks++;if(fileNoopSend)return;const text=composer.value;addTurn('user','user-delivered-'+sentClicks,text);composer.value='';composer.dispatchEvent(new InputEvent('input',{bubbles:true}));root.querySelectorAll('[data-filename]').forEach(n=>n.remove());});
   window.captureFiles=async files=>{fileApplications++;for(const file of files){const bytes=new Uint8Array(await file.arrayBuffer());fileCaptures.push({name:file.name,size:file.size,type:file.type,sha256:Array.from(await fixtureSha256(Array.from(bytes)),b=>b.toString(16).padStart(2,'0')).join('')});if(!noPreview){const n=document.createElement('span');n.dataset.filename=file.name;n.dataset.status='ready';n.textContent=file.name;root.append(n);}}};
   if(fixtureAI==='chatgpt'){const input=document.createElement('input');input.type='file';input.multiple=true;root.append(input);input.addEventListener('change',()=>captureFiles([...input.files]));}
   else {const controls=document.createElement('div');controls.dataset.testid='input-controls-root';controls.innerHTML='<button data-testid="InputControls-Plus-Button" aria-label="Добавить файл" aria-haspopup="dialog">+</button>';root.append(controls);document.body.addEventListener('drop',e=>{e.preventDefault();captureFiles([...e.dataTransfer.files])});}
   window.commandTurn=text=>{const n=addTurn('assistant','assistant-command-'+(++commandCount),'');const block=document.createElement('div');if(fixtureAI==='alice')block.className='CodeBlock';const pre=document.createElement('pre'),code=document.createElement('code');code.textContent=text;pre.append(code);block.append(pre);const copy=document.createElement('button');copy.textContent='Copy';copy.setAttribute('aria-label','Copy');if(fixtureAI==='alice')copy.dataset.testid='codeblock-action-copy';block.append(copy);n.append(block);return n.id||n.dataset.turnId;};
  }''')
  expect((await self.begin())['ok']);await self.wait_phase('waiting_response');await self.complete();await self.wait_phase('completed');return self
 async def execute(self,text):
  self.previous_operation=(await self.operation()).get('operation_id')
  before=await self.page.locator('.wb-bridge-block-action').count()
  await self.page.evaluate('text=>commandTurn(text)',text)
  until=asyncio.get_running_loop().time()+3
  while await self.page.locator('.wb-bridge-block-action').count()<=before:
   if asyncio.get_running_loop().time()>until:raise AssertionError('New command button not decorated')
   await asyncio.sleep(.05)
  await self.page.locator('.wb-bridge-block-action').last.click(timeout=3500)
 async def operation(self):
  state=await self.state();return next(iter(state['data'].get('wbmb_manual_operations',{}).values()),{})
 async def terminal(self,timeout=8):
  until=asyncio.get_running_loop().time()+timeout
  while asyncio.get_running_loop().time()<until:
   op=await self.operation()
   if op.get('status')=='completed' and op.get('operation_id')!=self.previous_operation:return op
   await asyncio.sleep(.08)
  raise AssertionError('Delivery not completed: '+json.dumps(op,ensure_ascii=False)[:2000])

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking','--disable-dev-shm-usage','--disable-gpu'])
  async def case(name,fn,**kwargs):
   if os.environ.get('WB_TEST_CASE') and os.environ['WB_TEST_CASE']!=name:return
   f=None
   try:
    f=await FileFixture().start(browser,**kwargs);await fn(f);expect(not f.errors,repr(f.errors));emit(name,True)
   except Exception as e:
    emit(name,False,{'error':str(e),'trace':traceback.format_exc()})
    if f:
     (out/(name+'.state.json')).write_text(json.dumps(await f.state(),ensure_ascii=False,indent=2));await f.page.screenshot(path=str(out/(name+'.png')),full_page=True)
   finally:
    if f:await f.close()
  async def original(f):
   await f.execute(FILE);op=await f.terminal();state=await f.state();captures=await f.page.evaluate('fileCaptures');expect(state['counts']['provider']==1);expect(len(captures)==1,str(captures));expect(captures[0]['sha256']==hashlib.sha256(BYTES).hexdigest());expect(op['delivery_confirmed']);expect(await f.page.evaluate('sentClicks')==2);expect(len(await f.rpc('artifacts'))==0,'Delivered artifact not cleaned')
  await case('CHATGPT_REAL_COMMAND_TO_PORT_FILE_SEND_AND_CONFIRM',original)
  await case('ALICE_REAL_COMMAND_TO_DROP_FILE_SEND_AND_CONFIRM',original,ai='alice')
  async def overflow(f):
   await f.execute(FILE+'\n'+API);op=await f.terminal();ref=op.get('retained_text_ref');expect(ref,'Missing retained text');original_text=op['outgoing_text'];expect(await f.page.evaluate('fileApplications')==1);expect((await f.state())['counts']['provider']==2)
   await f.execute('WB_FILE_V1 '+json.dumps({'ref':ref}));await f.terminal();captures=await f.page.evaluate('fileCaptures');expect(len(captures)==2);expect(captures[1]['sha256']==hashlib.sha256(original_text.encode()).hexdigest());expect((await f.state())['counts']['provider']==2)
  await case('ALICE_OVERSIZED_FULL_TEXT_LOCAL_CONTINUATION_NO_WB_REFETCH',overflow,ai='alice',large=True)
  async def fallback(f):
   await f.page.locator('[data-testid="InputControls-Plus-Button"]').evaluate('(n)=>n.remove()');await f.execute(FILE);op=await f.terminal();expect(op.get('attachment_failure_fallback'));expect(await f.page.evaluate('fileApplications')==0);expect((await f.state())['counts']['provider']==1);expect('WB_FILE_V1' in op['delivery_text']);expect(op['outgoing_text'] in op['delivery_text'])
  await case('ALICE_PRECOMMIT_FILE_FAILURE_DELIVERS_SAVED_TEXT_RECEIPT',fallback,ai='alice')
  async def chunk_fault(f,mode):
   await f.page.evaluate('m=>fixturePortFault=m',mode);await f.execute(FILE);op=await f.terminal();expect(op.get('attachment_failure_fallback'));expect(await f.page.evaluate('fileApplications')==0);expect((await f.state())['counts']['provider_total']==1);expect(len(await f.rpc('artifacts'))==1)
  await case('PORT_DISCONNECTION_BEFORE_ATTACHMENT_PRESERVES_PROVIDER_BYTES',lambda f:chunk_fault(f,'disconnect'),ai='alice')
  await case('CORRUPT_CHUNK_NEVER_REACHES_BROWSER_FILE',lambda f:chunk_fault(f,'corrupt'),ai='alice')
  async def committed_lost(f):
   async def boundary(message,result):
    if message['type']=='WB_DELIVERY_ATTACH_COMMIT' and result.get('apply_allowed'):
     await f.rpc('recreate');return {'ok':False,'code':'SYNTHETIC_ACK_LOST_AFTER_COMMIT'}
    return result
   f.boundary_hook=boundary;await f.execute(FILE)
   # Synchronize with the injected commit boundary, not a two-second assumption
   # about browser/RPC scheduling under the full gate.
   deadline=asyncio.get_running_loop().time()+10
   while asyncio.get_running_loop().time()<deadline:
    op=await f.operation()
    if op.get('attachment_phase')=='committed':break
    await asyncio.sleep(.05)
   op=await f.operation();expect(op.get('attachment_phase')=='committed',str(op.get('attachment_phase')));expect(not op.get('attachment_failure_fallback'));expect(await f.page.evaluate('fileApplications')==0);expect((await f.state())['counts']['provider_total']==1)
   await f.restart_content();await asyncio.sleep(1);expect(await f.page.evaluate('fileApplications')==0);expect((await f.state())['counts']['provider_total']==1);expect(len(await f.rpc('artifacts'))==1)
  await case('WORKER_RESTART_AND_LOST_ATTACHMENT_COMMIT_ACK_NO_REAPPLY',committed_lost,ai='alice')
  async def unknown_send(f):
   await f.page.evaluate('()=>fileNoopSend=true');await f.execute(FILE)
   until=asyncio.get_running_loop().time()+30
   while (await f.operation()).get('send_state')!='unknown_no_retry' and asyncio.get_running_loop().time()<until:await asyncio.sleep(.1)
   op=await f.operation();expect(op.get('status')=='delivering');expect(op.get('send_state')=='unknown_no_retry',str(op.get('send_state')));expect(await f.page.evaluate('fileApplications')==1);expect(await f.page.evaluate('sentClicks')==2)
   await f.rpc('recreate');await f.restart_content();await asyncio.sleep(4);expect(await f.page.evaluate('fileApplications')==1);expect(await f.page.evaluate('sentClicks')==2);expect((await f.state())['counts']['provider_total']==1)
  await case('AMBIGUOUS_FILE_SEND_RESTART_DOES_NOT_CLICK_OR_REFETCH',unknown_send)
  async def budget(f):
   await f.execute(FILE+'\n'+FILE.replace('fixture-1','fixture-2'));op=await f.terminal();expect((await f.state())['counts']['provider_total']==1);expect(op['command_batch']['snapshot']['items'][1]['state']=='deferred');expect(await f.page.evaluate('fileApplications')==1)
  await case('ALICE_SECOND_FILE_DEFERRED_BEFORE_ACQUISITION_IN_BROWSER',budget,ai='alice')
  await browser.close()
 summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'selected_case':os.environ.get('WB_TEST_CASE'),'scope':'Actual command capture + worker + named Port + browser File/DataTransfer + UI send/proof; synthetic AI DOM, Chrome transport and provider responses; not installed MV3 acceptance','real_provider_calls':0}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary));sys.exit(bool(summary['failed']))
asyncio.run(main())
