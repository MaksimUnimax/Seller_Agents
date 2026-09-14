"""Native extension MV3/storage/runtime messaging, synthetic ChatGPT page.
No credentials, no real AI traffic or provider calls; this is not owner E2E.
"""
from pathlib import Path
import asyncio,json,sys,os,tempfile,traceback,hashlib
from playwright.async_api import async_playwright
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False);rows=[]
def emit(name,ok,detail=None):
 r={'id':name,'status':'PASS' if ok else 'FAIL','detail':detail};rows.append(r)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(r)+'\n');f.flush();os.fsync(f.fileno())
 print(r,flush=True)
def expect(v,m='Assertion failed'):
 if not v:raise AssertionError(m)
ID='11111111-1111-1111-1111-111111111111';URL='https://chatgpt.com/c/'+ID
HTML='''<!doctype html><html><head><style>textarea{width:500px;height:100px}button{min-width:60px;min-height:30px}</style></head><body><main></main><form><textarea id="prompt-textarea"></textarea><button type="button" data-testid="send-button">Send</button></form><script>
let seq=0;window.addAssistant=(text)=>{const n=document.createElement('section');n.dataset.turn='assistant';n.dataset.turnId='assistant-'+(++seq);n.innerHTML='<div class="payload"></div><button data-testid="copy-turn-action-button">Copy</button>';n.querySelector('.payload').textContent=text;document.querySelector('main').append(n);};
document.querySelector('[data-testid="send-button"]').onclick=()=>{const c=document.querySelector('textarea'),n=document.createElement('section');n.dataset.turn='user';n.dataset.turnId='user-'+(++seq);n.innerHTML='<h5 class="sr-only">Вы сказали:</h5><div data-message-author-role="user"><div class="whitespace-pre-wrap"></div></div><button aria-label="Copy">Copy</button>';n.querySelector('.whitespace-pre-wrap').textContent=c.value;document.querySelector('main').append(n);c.value='';c.dispatchEvent(new InputEvent('input',{bubbles:true}));setTimeout(()=>addAssistant('Готово'),200);};
</script></body></html>'''
async def main():
 async with async_playwright() as p:
  with tempfile.TemporaryDirectory(prefix='wb-native-mv3-') as profile:
   ctx=None
   try:
    ctx=await p.chromium.launch_persistent_context(profile,executable_path=os.environ['WB_NATIVE_CHROMIUM'],headless=True,ignore_default_args=['--disable-extensions'],args=['--no-sandbox','--disable-background-networking','--disable-dev-shm-usage','--disable-extensions-except='+str(root),'--load-extension='+str(root)])
    requests=[]
    async def route(r):
     requests.append(r.request.url)
     if r.request.url==URL:await r.fulfill(status=200,content_type='text/html',body=HTML)
     else:await r.abort()
    await ctx.route('**/*',route)
    worker=ctx.service_workers[0] if ctx.service_workers else await ctx.wait_for_event('serviceworker',timeout=15000)
    eid=worker.url.split('/')[2]
    state=await worker.evaluate("()=>({version:chrome.runtime.getManifest().version,work:typeof WBWorkStart,delivery:typeof WBDeliveryTransactions,capabilities:typeof WBAIDeliveryCapabilities,artifacts:typeof WBArtifactStore,session:WORKER_SESSION_ID})")
    expect(all(state[x]=='object' for x in ['work','delivery','capabilities','artifacts']),str(state));expect(state['version']==json.loads((root/'manifest.json').read_text())['version'])
    emit('NATIVE-MV3-FULL-ENTRY-LOAD',True,state)
    persistence=await worker.evaluate("async()=>{const db=WBArtifactStore.database('wb-native-fixture');await db.put({ref:'fixture',value:[1,2,3]});const v=await db.get('fixture');await db.remove('fixture');return v}")
    expect(persistence['value']==[1,2,3]);emit('NATIVE-INDEXEDDB-COMMITTED-TRANSACTION',True)
    page=await ctx.new_page();await page.goto(URL);popup=await ctx.new_page();await popup.goto('chrome-extension://'+eid+'/popup.html')
    async def call(message):return await popup.evaluate('m=>chrome.runtime.sendMessage(m)',message)
    tab=await worker.evaluate("async()=> (await chrome.tabs.query({url:'https://chatgpt.com/c/*'}))[0].id")
    ident=None
    for _ in range(80):
     ident=await popup.evaluate("id=>chrome.tabs.sendMessage(id,{type:'WB_GET_IDENTITY'}).catch(()=>null)",tab)
     if ident and ident.get('identity',{}).get('status')=='confirmed':break
     await asyncio.sleep(.1)
    expect(ident and ident.get('identity',{}).get('status')=='confirmed',str(ident))
    started=await call({'type':'WB_WORK_ACTION','action':'start','tab_id':tab,'identity':ident['identity']});expect(started.get('ok'),str(started))
    async def work_state():return await call({'type':'WB_WORK_ACTION','action':'state','tab_id':tab,'identity':ident['identity']})
    for _ in range(120):
     work=await work_state()
     if work.get('work',{}).get('state')=='active_visible':break
     await asyncio.sleep(.1)
    expect(work.get('work',{}).get('state')=='active_visible',str(work));expect(await page.locator('[data-turn="user"]').count()==1)
    emit('NATIVE-START-CALLBACK-WATCH-CORRELATION-ACTIVE',True)
    await popup.close();popup=await ctx.new_page();await popup.goto('chrome-extension://'+eid+'/popup.html');expect((await work_state())['work']['state']=='active_visible');emit('NATIVE-POPUP-CLOSE-REOPEN',True)
    refreshed=await call({'type':'WB_WORK_ACTION','action':'refresh','tab_id':tab,'identity':ident['identity']});expect(refreshed.get('ok'),str(refreshed));expect(await page.locator('[data-turn="user"]').count()==1);emit('NATIVE-REFRESH-NO-SECOND-START',True)
    finished=await call({'type':'WB_WORK_ACTION','action':'finish','tab_id':tab,'identity':ident['identity']});expect(finished.get('ok'),str(finished));expect((await work_state())['work']['state']=='inactive');emit('NATIVE-FINISH-INACTIVE',True)
    await page.reload();await asyncio.sleep(.3);expect((await work_state())['work']['state']=='inactive');emit('NATIVE-TAB-RELOAD-PRESERVES-FINISH',True)
    # Native worker lifecycle endpoint, not a VM recreation.
    session=await ctx.new_cdp_session(popup);versions=[];session.on('ServiceWorker.workerVersionUpdated',lambda e:versions.extend(e.get('versions',[])));await session.send('ServiceWorker.enable');await asyncio.sleep(.2)
    version=next((v for v in reversed(versions) if v.get('scriptURL')==worker.url and v.get('runningStatus')=='running'),None);expect(version,'Native worker version unavailable')
    old=state['session'];await session.send('ServiceWorker.stopWorker',{'versionId':version['versionId']})
    expect((await call({'type':'WB_GET_RUNTIME_OPTIONS'})).get('ok'))
    fresh=None
    for _ in range(60):
     for w in ctx.service_workers:
      try:
       current=await w.evaluate('WORKER_SESSION_ID')
       if current!=old:fresh=current;break
      except Exception:pass
     if fresh:break
     await asyncio.sleep(.1)
    expect(fresh,'Worker did not restart');expect((await work_state())['work']['state']=='inactive');emit('NATIVE-WORKER-STOP-WAKE-NO-START-REPLAY',True)
    # Browser route log plus extension diagnostics: no WB operation was requested.
    ds=await call({'type':'WB_GET_DIAGNOSTICS'});expect(not any(x.get('external_request_executed') is True for x in ds.get('diagnostics',[])))
    (out/'diagnostics.json').write_text(json.dumps(ds,ensure_ascii=False,indent=2));(out/'network.json').write_text(json.dumps(requests,indent=2));await popup.screenshot(path=str(out/'native-popup.png'),full_page=True)
   except Exception as e:emit('NATIVE-MV3-SCENARIO',False,{'error':str(e),'trace':traceback.format_exc()})
   finally:
    if ctx:await ctx.close()
 summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'native_extension_loaded':any(r['id']=='NATIVE-MV3-FULL-ENTRY-LOAD' and r['status']=='PASS' for r in rows),'owner_installed_acceptance':False,'real_provider_requests':0,'scope':'Native full Chrome MV3; synthetic ChatGPT DOM, no real AI account or WB credential'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
