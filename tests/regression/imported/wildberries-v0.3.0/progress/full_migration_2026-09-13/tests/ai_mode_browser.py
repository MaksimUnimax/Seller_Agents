import os
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
  self.wait={};self.seq=0;self.errors=[];self.ai=ai;self.new=new;self.tab_tasks=set()
  self.proc=await asyncio.create_subprocess_exec('node',str(R/'tests/worker_rpc.mjs'),str(root),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,limit=4*1024*1024)
  self.ctx=await browser.new_context();self.page=await self.ctx.new_page();self.page.on('pageerror',lambda e:self.errors.append(str(e)))
  self.origin='https://alice.yandex.ru' if ai=='alice' else 'https://chatgpt.com';self.url=self.origin+('/chat/' if ai=='alice' else ('/' if new else '/c/'))+('' if new else ID)
  await self.ctx.route('**/*',lambda route:route.abort());self.pump=asyncio.create_task(self.read())
  composer='<div class="Standalone-Input" data-testid="standalone-input"><textarea data-testid="inputbase-textarea"></textarea><button type="button" data-testid="oknyx" aria-label="Отправить">Send</button></div>' if ai=='alice' else '<form><textarea id="prompt-textarea"></textarea><button type="button" data-testid="send-button" aria-label="Send">Send</button></form>'
  await self.page.set_content('<html><head><style>textarea{width:500px;height:80px}button{width:70px;height:30px}</style></head><body><main></main>'+composer+(('<div class=ChatListItem id='+ID+'><button data-testid=chatlist-item-active aria-current=page>Active</button></div>') if ai=='alice' and not new else '')+'</body></html>')
  await self.page.expose_function('fixtureSha256',lambda values:list(hashlib.sha256(bytes(values)).digest()))
  async def send(message):
   identity=await self.page.evaluate('()=>({origin:fixtureLocation.origin,ai_id:fixtureAI,conversation_id:fixtureId,status:fixtureId?"confirmed":"unknown"})')
   return await self.rpc('call',message=message,sender='content',identity=identity,tab_url=await self.page.evaluate('fixtureLocation.href'))
  await self.page.expose_function('fixtureSend',send)
  await self.page.evaluate(r'''({url,ai,id})=>{
   const u=new URL(url);window.fixtureAI=ai;window.fixtureId=id;window.fixtureLocation={origin:u.origin,hostname:u.hostname,protocol:u.protocol,pathname:u.pathname,href:u.href};window.fixtureGlobal=new Proxy(globalThis,{get:(t,k)=>k==='location'?fixtureLocation:Reflect.get(t,k),set:(t,k,v)=>Reflect.set(t,k,v)});
   Object.defineProperty(crypto,'subtle',{value:{digest:async(_,bytes)=>Uint8Array.from(await fixtureSha256(Array.from(new Uint8Array(bytes.buffer||bytes,bytes.byteOffset||0,bytes.byteLength)))).buffer},configurable:true});
   if(!crypto.randomUUID)Object.defineProperty(crypto,'randomUUID',{value:()=> 'id-'+Date.now()+'-'+Math.random()});
   window.fixtureListeners=[];window.sentClicks=0;window.fixtureSendMode='normal';window.messages=[];
   window.chrome={runtime:{id:'fixture',lastError:null,getURL:p=>'chrome-extension://fixture/'+p,onMessage:{addListener:f=>fixtureListeners.push(f),removeListener:f=>fixtureListeners=fixtureListeners.filter(x=>x!==f)},sendMessage:(m,cb)=>{messages.push(m);fixtureSend(m).then(cb,e=>cb({ok:false,code:'FIXTURE_ERROR',error:String(e)}))}}};
   window.fixtureFire=m=>Promise.all(fixtureListeners.map(f=>new Promise(resolve=>{const keep=f(m,{},resolve);if(!keep)resolve(null)}))).then(rs=>rs.find(x=>x!==null)||{ok:false,code:'NO_CONTENT_LISTENER'});
   window.addTurn=(role,id,text)=>{const n=document.createElement(fixtureAI==='alice'?'div':'section');if(fixtureAI==='alice'){n.dataset.messageRole=role==='assistant'?'alice':'user';n.id=id;}else{n.dataset.turn=role;n.dataset.turnId=id;}n.textContent=text;document.querySelector('main').append(n);return n;};
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
  await self.write({'kind':'tab_result','id':o['id'],'result':r})
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
  browser=await p.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking'])
  async def mode(f,value):return await f.rpc('call',message={'type':'WB_SAVE_RUNTIME_OPTIONS','tab_id':1,'options':{'ai_mode':value}},tab_url=await f.page.evaluate('fixtureLocation.href'))
  async def success(f):
   old=await f.page.evaluate('()=>fixtureFire({type:"WB_GET_IDENTITY"})');q=await mode(f,f.ai);expect(q['ok'],str(q));expect(q.get('adapter_id')==f.ai,str(q));current=await f.page.evaluate('()=>fixtureFire({type:"WB_GET_IDENTITY"})');expect(old['runtime_id']==current['runtime_id']);expect(current['identity']['selected_ai_mode']==f.ai)
   state=await f.state();expect(not any(m['type']=='WB_RUNTIME_REFRESH' for m in state['messages']));expect(await f.page.evaluate('fixtureListeners.length')==1)
  async def incompatible(f):
   await success(f);old=await f.page.evaluate('()=>fixtureFire({type:"WB_GET_IDENTITY"})');q=await mode(f,'alice' if f.ai=='chatgpt' else 'chatgpt');expect(q['ok'],str(q));expect(q.get('adapter_id') is None);current=await f.page.evaluate('()=>fixtureFire({type:"WB_GET_IDENTITY"})');expect(current['runtime_generation']!=old['runtime_generation']);q=await mode(f,'auto');expect(q['ok'] and q.get('adapter_id')==f.ai,str(q))
  async def lost(f):
   await success(f)
   await f.page.evaluate("()=>{const original=fixtureFire;let lost=false;fixtureFire=async m=>{const q=await original(m);if(m.type==='WB_APPLY_AI_MODE'&&!lost){lost=true;return {ok:false,code:'FIXTURE_RESPONSE_LOST_AFTER_APPLY'};}return q;};}")
   q=await mode(f,'alice' if f.ai=='chatgpt' else 'chatgpt');expect(q['ok'] is False,str(q));expect(q.get('rollback_confirmed') is True,str(q));current=await f.page.evaluate('()=>fixtureFire({type:"WB_GET_IDENTITY"})');expect(current['identity']['selected_ai_mode']==f.ai);expect(current['identity']['active_adapter_id']==f.ai)
  async def stale(f):
   await success(f);q=await f.page.evaluate("async()=>{const p=await fixtureFire({type:'WB_GET_IDENTITY'});return fixtureFire({type:'WB_APPLY_AI_MODE',ai_mode:'auto',origin:fixtureLocation.origin,href:fixtureLocation.href,runtime_id:p.runtime_id,runtime_generation:'old-generation'});}");expect(q['ok'] is False,str(q));current=await f.page.evaluate('()=>fixtureFire({type:"WB_GET_IDENTITY"})');expect(current['identity']['selected_ai_mode']==f.ai)
  for ai in ['chatgpt','alice']:
   for name,fn in [('APPLY',success),('ADAPTER_CHANGE',incompatible),('LOST_RESPONSE_ROLLBACK',lost),('STALE_APPLY_REJECTED',stale)]:
    f=None
    try:
     f=await Fixture().start(browser,ai=ai);await fn(f);expect(not f.errors,repr(f.errors));state=await f.state();expect(state['counts']['provider']==0);expect(await f.page.evaluate('sentClicks')==0);emit(ai+'_'+name,True)
    except Exception as e:emit(ai+'_'+name,False,{'error':str(e),'traceback':traceback.format_exc()})
    finally:
     if f:await f.close()
  await browser.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Actual WB worker and actual content in Chromium; simulated ChatGPT/Alice; fixture Chrome transport; zero send/provider calls; not installed acceptance'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
