from run_browser_fixture import *

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ['WB_TEST_CHROMIUM'],headless=True,args=['--no-sandbox','--disable-background-networking'])
  async def removal(f,boundary):
   await f.page.evaluate(r'''boundary=>{
    window.savedSend=chrome.runtime.sendMessage;window.removalObserved=false;
    chrome.runtime.sendMessage=(m,cb)=>savedSend(m,r=>{
     if(m.type===boundary&&r.ok){document.querySelectorAll('[data-filename]').forEach(n=>n.remove());removalObserved=true;}
     cb(r);
    });
   }''',boundary)
   await f.execute(FILE)
   deadline=asyncio.get_running_loop().time()+8
   while asyncio.get_running_loop().time()<deadline:
    op=await f.operation()
    if op.get('last_error') or op.get('status')=='completed':break
    await asyncio.sleep(.05)
   expect(await f.page.evaluate('removalObserved'),'Removal boundary not reached')
   expect(await f.page.evaluate('sentClicks')==1,'Result Send occurred after file preview disappeared')
   expect(not op.get('delivery_confirmed'),'Missing file must not complete delivery')
   expect(op.get('status')=='delivering','Primary result not retained')
   expect(op.get('last_error',{}).get('code')=='DELIVERY_ATTACHMENT_CHANGED_BEFORE_SEND',str(op.get('last_error')))
   expect(len(await f.rpc('artifacts'))==1,'Provider artifact not retained')
   expect(await f.page.evaluate('fileApplications')==1)
   expect((await f.state())['counts']['provider_total']==1)
   # Recovery can inspect state, but must not reapply the committed attachment.
   await f.page.evaluate('()=>{chrome.runtime.sendMessage=savedSend}');await f.restart_content();await asyncio.sleep(.7)
   expect(await f.page.evaluate('sentClicks')==1);expect(await f.page.evaluate('fileApplications')==1)
   expect((await f.state())['counts']['provider_total']==1)
  for ai in ['chatgpt','alice']:
   for boundary in ['WB_DELIVERY_STAGE','WB_MANUAL_DELIVERY_COMMIT_REQUEST']:
    f=None;name=ai+'_'+boundary
    try:f=await FileFixture().start(browser,ai=ai);await removal(f,boundary);expect(not f.errors,str(f.errors));emit(name,True)
    except Exception as e:
     if f:(out/(name+'_state.json')).write_text(json.dumps(await f.state(),ensure_ascii=False,indent=2))
     emit(name,False,{'error':str(e),'trace':traceback.format_exc()})
    finally:
     if f:await f.close()
  await browser.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Real content/worker; file removed at asynchronous stage/commit boundary; synthetic UI/provider; no installed acceptance'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
