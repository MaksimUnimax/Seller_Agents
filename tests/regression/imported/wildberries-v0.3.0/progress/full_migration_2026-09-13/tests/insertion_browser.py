from run_browser_fixture import *

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ['WB_TEST_CHROMIUM'],headless=True,args=['--no-sandbox','--disable-background-networking'])
  async def intercept(f,mode):
   await f.page.evaluate(r'''mode=>{
    window.insertWrites=0;window.lostStage=0;window.savedSend=chrome.runtime.sendMessage;window.primaryRequestId=null;window.primaryDeliveryId=null;
    window.isPrimary=v=>{try{return JSON.parse(String(v).slice(String(v).indexOf('WB_RESULT_V1')+12).trim()).request_id===primaryRequestId}catch(_){return false}};
    window.primaryTurns=()=>[...document.querySelectorAll('[data-turn="user"],[data-message-role="user"]')].filter(n=>isPrimary(n.textContent)).length;
    const descriptor=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value');
    Object.defineProperty(HTMLTextAreaElement.prototype,'value',{...descriptor,set(v){if(isPrimary(v))insertWrites++;return descriptor.set.call(this,v)}});
    chrome.runtime.sendMessage=(m,cb)=>{
     if(m.type==='WB_EXECUTE_COMMAND')return savedSend(m,r=>{primaryRequestId=r.request_id;primaryDeliveryId=r.delivery_id;cb(r)});
     if(m.delivery_id===primaryDeliveryId&&m.type==='WB_DELIVERY_INSERT_COMMIT'&&mode==='commit-ack-loss')return savedSend(m,r=>cb({ok:false,code:'SYNTHETIC_INSERT_ACK_LOST'}));
     if(m.delivery_id===primaryDeliveryId&&m.type==='WB_DELIVERY_STAGE'){
      lostStage++;if(mode==='manual-send')document.querySelector('[data-testid="send-button"],[data-testid="oknyx"]').click();
      return cb({ok:false,code:'SYNTHETIC_STAGE_CHANNEL_LOST'});
     }
     return savedSend(m,cb);
    };
   }''',mode)
   await f.execute(API)
   until=asyncio.get_running_loop().time()+5
   while asyncio.get_running_loop().time()<until:
    op=await f.operation()
    if op.get('last_error'):return
    await asyncio.sleep(.05)
   raise AssertionError('Expected interrupted delivery not reached')
  async def recover(f):
   await f.page.evaluate('()=>{chrome.runtime.sendMessage=savedSend}');await f.restart_content();await asyncio.sleep(.7)
  async def lost_commit(f):
   await intercept(f,'commit-ack-loss');expect(await f.page.evaluate('insertWrites')==0);await recover(f);expect(await f.page.evaluate('insertWrites')==0);expect(await f.page.evaluate('primaryTurns()')==0,'Unexpected primary user message');expect((await f.operation()).get('status')=='delivering')
  async def lost_page(f):
   await intercept(f,'stage-loss');expect(await f.page.evaluate('insertWrites')==1)
   await f.page.locator('textarea').evaluate('(n)=>{const c=n.cloneNode(false);c.value="";for(const a of [...c.attributes])if(a.name.startsWith("data-wb"))c.removeAttribute(a.name);n.replaceWith(c)}')
   await recover(f);expect(await f.page.evaluate('insertWrites')==1);expect(await f.page.evaluate('primaryTurns()')==0,'Unexpected primary user message');expect((await f.operation()).get('status')=='delivering')
  async def saved_draft(f):
   await intercept(f,'stage-loss');await recover(f);op=await f.terminal();expect(op['delivery_confirmed']);expect(await f.page.evaluate('insertWrites')==1);expect(await f.page.evaluate('primaryTurns()')==1,'Expected one primary user message')
  async def manual_send(f):
   await intercept(f,'manual-send');expect(await f.page.evaluate('primaryTurns()')==1,'Expected one primary user message');await recover(f);op=await f.terminal();expect(op['delivery_confirmed']);expect(await f.page.evaluate('primaryTurns()')==1,'Expected one primary user message');expect(await f.page.evaluate('insertWrites')==1)
  for ai in ['chatgpt','alice']:
   for name,fn in [('INSERT_COMMIT_ACK_LOSS_NO_INSERT',lost_commit),('PAGE_LOSS_AFTER_INSERT_NO_REINSERT',lost_page),('SAVED_DRAFT_STAGE_RECOVERY',saved_draft),('USER_SEND_BEFORE_STAGE_RECOVERY',manual_send)]:
    f=None
    try:f=await FileFixture().start(browser,ai=ai);await fn(f);expect((await f.state())['counts']['provider_total']==1);expect(not f.errors,str(f.errors));emit(ai+'_'+name,True)
    except Exception as e:
     if f:(out/(ai+'_'+name+'_state.json')).write_text(json.dumps(await f.state(),ensure_ascii=False,indent=2))
     emit(ai+'_'+name,False,{'error':str(e),'trace':traceback.format_exc()})
    finally:
     if f:await f.close()
  await browser.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Actual worker/content in Chromium; insertion channel and page loss; synthetic UI/provider only; no installed acceptance'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
