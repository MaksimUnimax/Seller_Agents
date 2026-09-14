from run_browser_fixture import *

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ['WB_TEST_CHROMIUM'],headless=True,args=['--no-sandbox'])
  async def begin(f):
   await f.page.locator('textarea').fill('Original private draft')
   r=await f.page.evaluate("()=>fixtureFire({type:'WB_START_SEND_BUTTON_PICKER'})");expect(r.get('ok'),str(r));expect('BRIDGE_BUTTON_TEST' in await f.page.locator('textarea').input_value())
  async def positive(f):
   await begin(f);await f.page.locator('[data-testid="send-button"],[data-testid="oknyx"]').click();await asyncio.sleep(.25)
   expect(await f.page.locator('textarea').input_value()=='Original private draft');expect((await f.state())['data'].get('wbmb_send_button_profile'),'Profile missing')
  async def edited(f):
   await begin(f);await f.page.locator('textarea').fill('New user draft');await f.page.keyboard.press('Escape');expect(await f.page.locator('textarea').input_value()=='New user draft')
  async def route(f):
   await begin(f);await f.page.evaluate("()=>{setIdentity('22222222-2222-2222-2222-222222222222');document.querySelector('textarea').value='Other chat draft'}");await f.page.keyboard.press('Escape');expect(await f.page.locator('textarea').input_value()=='Other chat draft')
  async def cancel(f):
   await begin(f);await f.page.keyboard.press('Escape');expect(await f.page.locator('textarea').input_value()=='Original private draft')
  for ai in ['chatgpt','alice']:
   for name,fn in [('CALIBRATE_NO_SEND',positive),('EDIT_PRESERVED',edited),('OTHER_CHAT_DRAFT_PRESERVED',route),('ESCAPE_RESTORES_OWNED_DRAFT',cancel)]:
    f=None
    try:f=await Fixture().start(browser,ai=ai);await fn(f);expect(await f.page.evaluate('sentClicks')==0);expect((await f.state())['counts']['provider']==0);expect(not f.errors,str(f.errors));emit(ai+'_'+name,True)
    except Exception as e:emit(ai+'_'+name,False,{'error':str(e),'trace':traceback.format_exc()})
    finally:
     if f:await f.close()
  await browser.close()
 summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'scope':'Actual content and worker; safe calibration with synthetic ChatGPT/Alice DOM; no network'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
