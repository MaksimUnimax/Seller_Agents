from run_browser_fixture import *

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ['WB_TEST_CHROMIUM'],headless=True,args=['--no-sandbox','--disable-background-networking'])
  async def action(f,name):
   identity=await f.page.evaluate('()=>({origin:fixtureLocation.origin,ai_id:fixtureAI,conversation_id:fixtureId,status:"confirmed"})');q=await f.rpc('call',message={'type':'WB_WORK_ACTION','action':name,'tab_id':1,'identity':identity},identity=identity);expect(q['ok'],str(q));return q
  for ai in ['chatgpt','alice']:
   for finish in [False,True]:
    name=ai+('_FINISH_DURING_INITIAL_WAIT' if finish else '_HIDE_DURING_INITIAL_WAIT_SHOW_RESUMES')
    f=None
    try:
     f=await FileFixture().start(browser,ai=ai);await f.rpc('call',message={'type':'WB_SAVE_RUNTIME_OPTIONS','options':{'composer_wait_ms':10000}})
     await f.page.locator('textarea').fill('Сохранить черновик');await f.execute(API)
     until=asyncio.get_running_loop().time()+4
     while not (await f.operation()).get('delivery_lease_id'):
      expect(asyncio.get_running_loop().time()<until,'Delivery prepare did not complete');await asyncio.sleep(.05)
     await action(f,'finish' if finish else 'toggle');await f.page.locator('textarea').fill('');await asyncio.sleep(2)
     expect(not (await f.operation()).get('insert_state'),'Text insertion committed after Work was hidden/finished');expect(await f.page.evaluate('sentClicks')==1,'Send after hidden/finished Work');expect((await f.state())['counts']['provider_total']==1)
     if not finish:
      expect((await action(f,'toggle'))['work']['state']=='active_visible');op=await f.terminal();expect(op['delivery_confirmed']);expect(await f.page.evaluate('sentClicks')==2);expect((await f.state())['counts']['provider_total']==1)
     emit(name,True)
    except Exception as e:emit(name,False,{'error':str(e),'trace':traceback.format_exc()})
    finally:
     if f:await f.close()
  await browser.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Initial composer wait versus actual Work Hide/Show/Finish in Chromium; fixture provider; no installed acceptance'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
