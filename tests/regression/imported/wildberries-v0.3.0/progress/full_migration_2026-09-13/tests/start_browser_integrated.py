"""Full real worker dispatcher + real content/popup in Chromium, synthetic AI DOM.
Only Chrome transport/storage and the remote AI webapp are fixture boundaries.
No production source rewriting, no real API network, no manufactured Start proof.
"""
from pathlib import Path
import asyncio,json,sys,os,hashlib,html,traceback
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
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking','--disable-dev-shm-usage','--disable-gpu'])
  async def case(name,fn,**kw):
   f=None
   try:
    f=await Fixture().start(browser,**kw);await fn(f);expect(not f.errors,'Page errors '+repr(f.errors));s=await f.state();expect(s['counts']['provider']==0,'Provider call');emit(name,True)
   except Exception as e:
    emit(name,False,{'error':str(e),'traceback':traceback.format_exc()})
    if f:
     st=await f.state();pd=st['data'].get('wb_work_pending_start_v2:1',{});st['proof']=await f.page.evaluate('p=>fixtureFire({type:"WB_WORK_START_PROOF",...p,conversation_id:p.observed_conversation_id,runtime_generation:p.watch_generation})',pd);st['content_messages']=await f.page.evaluate('messages');st['dom']=await f.page.locator('body').inner_text();(out/(name+'.state.json')).write_text(json.dumps(st,ensure_ascii=False,indent=2));await f.page.screenshot(path=str(out/(name+'.png')))
   finally:
    if f:await f.close()
  async def initial(f):
   r=await f.begin();expect(r['ok'],str(r));await f.wait_phase('waiting_response');expect(await f.page.evaluate('sentClicks')==1,'Send count');s=await f.state();expect(not any(v.get('state')=='active_visible' for k,v in s['data'].items() if k.startswith('wb_work_session_v1:')),'Premature active')
  async def positive(f):await initial(f);await f.complete();await f.wait_phase('completed');expect(await f.page.evaluate('sentClicks')==1,'Repeated Send')
  async def duplicate(f):await initial(f);await f.begin();expect(await f.page.evaluate('sentClicks')==1,'Double Start resends')
  async def finish(f):
   await initial(f);r=await f.rpc('call',message={'type':'WB_WORK_ACTION','action':'finish','tab_id':1});expect(r['ok'],str(r));await f.complete();await asyncio.sleep(.65);await f.wait_phase('cancelled');expect(await f.page.evaluate('sentClicks')==1)
  async def wrong(f):
   await initial(f);await f.page.evaluate('id=>setIdentity(id)',OTHER);await f.complete();await asyncio.sleep(.65);s=await f.state();expect(s['data']['wb_work_pending_start_v2:1']['phase']!='completed','Cross-chat activation')
  async def draft(f):
   await f.page.locator('textarea').fill('Мой неотправленный текст');await f.begin();await f.wait_phase('failed');expect(await f.page.locator('textarea').input_value()=='Мой неотправленный текст');expect(await f.page.evaluate('sentClicks')==0)
  async def wrapped(f):
   await f.page.evaluate("fixtureTurnMarkup='wrapped'");r=await f.begin();expect(r['ok'],str(r));await f.wait_phase('waiting_response',timeout=15);await f.complete();await f.wait_phase('completed');expect(await f.page.evaluate('sentClicks')==1)
  async def ambiguous(f,mode='noop'):
   await f.page.evaluate('mode=>fixtureSendMode=mode',mode);await f.begin();await f.wait_phase('unknown_no_retry',timeout=15);await f.begin();await asyncio.sleep(.15);expect(await f.page.evaluate('sentClicks')==1,'Ambiguous send retried');s=await f.state();expect(s['data']['wb_work_pending_start_v2:1']['prompt_delivered'] is False);expect(not any(v.get('state')=='active_visible' for k,v in s['data'].items() if k.startswith('wb_work_session_v1:')))
  async def diagnostic(f):
   await ambiguous(f);await asyncio.sleep(.1);s=await f.state();events=[e.get('event') for e in s['data'].get('wbmb_diagnostics',[])];expect('WORK_START_CONTENT_RESPONSE_LOST_NO_RETRY' not in events,'Explicit content failure mislabeled as lost Chrome channel');(out/'explicit_negative.state.json').write_text(json.dumps(s,ensure_ascii=False,indent=2))
  async def loss(f):f.drop_start_response=True;await positive(f)
  async def worker_restart(f):
   async def hook(m,r):
    if m['type']=='WB_WORK_START_COMMIT_REQUEST':f.boundary_hook=None;await f.rpc('recreate')
    return r
   f.boundary_hook=hook;await positive(f)
  async def content_restart(f):
   await initial(f);await f.restart_content();await f.complete();await f.wait_phase('completed');expect(await f.page.evaluate('sentClicks')==1)
  async def interrupted_content(f):
   async def hook(m,r):
    if m['type']=='WB_WORK_START_COMMIT_REQUEST':f.boundary_hook=None;await f.restart_content()
    return r
   f.boundary_hook=hook;await f.begin();await f.wait_phase('unknown_no_retry');await f.begin();await asyncio.sleep(.1);expect(await f.page.evaluate('sentClicks')==0,'Superseded runtime clicked')
  async def replaced_composer(f):
   async def hook(m,r):
    if m['type']=='WB_WORK_START_COMMIT_REQUEST':f.boundary_hook=None;await f.page.evaluate('()=>{const c=document.querySelector("textarea");c.replaceWith(c.cloneNode())}')
    return r
   f.boundary_hook=hook;await f.begin();await f.wait_phase('failed');expect(await f.page.evaluate('sentClicks')==0,'Replaced composer clicked')
  async def finish_before_click(f):
   async def hook(m,r):
    if m['type']=='WB_WORK_START_COMMIT_REQUEST':f.boundary_hook=None;v=await f.rpc('call',message={'type':'WB_WORK_ACTION','action':'finish','tab_id':1});expect(v['ok'],str(v))
    return r
   f.boundary_hook=hook;await f.begin();await f.wait_phase('cancelled');await asyncio.sleep(.3);expect(await f.page.evaluate('sentClicks')==0,'Finish completed before click but click still happened')
  async def late_user(f,reload=False):
   await ambiguous(f,'empty-only');s=await f.state();text=next(m['prompt_text'] for m in s['messages'] if m['type']=='WB_WORK_SEND_INITIAL_PROMPT');await f.page.evaluate('text=>addTurn("user","user-late",text)',text)
   if reload:await f.restart_content()
   await f.complete();await f.wait_phase('completed');expect(await f.page.evaluate('sentClicks')==1,'Late proof caused retry')
  async def refresh_pending(f):
   await initial(f);v=await f.rpc('call',message={'type':'WB_WORK_ACTION','action':'refresh','tab_id':1});expect(v.get('code')=='WORK_START_ALREADY_PENDING',str(v));await f.complete();await f.wait_phase('completed');expect(await f.page.evaluate('sentClicks')==1)
  await case('REAL_CONTENT_WORKER_START_SEND_ACK',initial)
  await case('REAL_CONTENT_WORKER_RESPONSE_ACTIVATION',positive)
  await case('NEW_CHAT_REAL_ID_THEN_COMPLETION',positive,new=True)
  await case('REAL_DOUBLE_START_SINGLE_SEND',duplicate)
  await case('REAL_FINISH_CANCELS_WATCH',finish)
  await case('REAL_WRONG_CHAT_NO_ACTIVATION',wrong)
  await case('REAL_USER_DRAFT_PRESERVED',draft)
  await case('ALICE_REAL_CONTENT_START',positive,ai='alice')
  await case('CHATGPT_WRAPPED_USER_PAYLOAD_SEND_AND_CORRELATION',wrapped)
  await case('CLICK_NOOP_IS_UNKNOWN_AND_NEVER_RETRIED',ambiguous)
  await case('EMPTY_COMPOSER_WITHOUT_USER_TURN_IS_UNKNOWN',lambda f:ambiguous(f,'empty-only'))
  await case('EXPLICIT_NEGATIVE_RESPONSE_IS_NOT_CHANNEL_LOSS',diagnostic)
  await case('OUTER_CONTENT_RESPONSE_LOSS_AFTER_COMMIT_NO_RETRY',loss)
  await case('WORKER_RECREATED_AFTER_COMMIT_BEFORE_CLICK',worker_restart)
  await case('CONTENT_RESTART_RECOVERS_EXISTING_SENT_MESSAGE',content_restart)
  await case('CONTENT_RESTART_BEFORE_CLICK_STAYS_NO_RETRY',interrupted_content)
  await case('COMPOSER_REPLACEMENT_AFTER_COMMIT_NO_CLICK',replaced_composer)
  await case('FINISH_ACK_BEFORE_CLICK_CANCELS_CONTENT_ACTION',finish_before_click)
  await case('LATE_USER_PROOF_RECOVERS_WITHOUT_RELOAD',late_user)
  await case('LATE_USER_PROOF_RECOVERS_AFTER_RELOAD',lambda f:late_user(f,True))
  await case('REFRESH_UNRESOLVED_START_IS_EXPLICITLY_BLOCKED',refresh_pending)
  await browser.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Actual dispatcher + actual content in Chromium; synthetic AI DOM; simulated Chrome storage/transport; native MV3 not proved; no provider calls'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
