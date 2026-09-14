import os
from pathlib import Path
import asyncio,json,sys,os,traceback
from playwright.async_api import async_playwright
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False)
rows=[]
def emit(name,ok,detail=None):
 r={'id':name,'status':'PASS' if ok else 'FAIL','detail':detail};rows.append(r)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(r,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 print(r['status'],name,detail or '',flush=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking'])
  page=await browser.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  await page.set_content('<html><body><main></main><form><textarea id="prompt-textarea"></textarea><button type="button" data-testid="send-button">Send</button></form></body></html>')
  await page.evaluate("""()=>{window.fixtureLocation={origin:'https://chatgpt.com',hostname:'chatgpt.com',protocol:'https:',pathname:'/',href:'https://chatgpt.com/'};window.fixtureGlobal=new Proxy(globalThis,{get:(t,k)=>k==='location'?fixtureLocation:Reflect.get(t,k),set:(t,k,v)=>Reflect.set(t,k,v)});window.listeners=[];window.pendingBootstrap=null;window.chrome={runtime:{id:'fixture',lastError:null,getURL:p=>'chrome-extension://fixture/'+p,onMessage:{addListener:f=>listeners.push(f),removeListener:f=>listeners=listeners.filter(x=>x!==f)},sendMessage:(m,cb)=>{if(m.type==='WB_BOOTSTRAP_STATE'){pendingBootstrap=cb;return;}let r={ok:true};if(m.type==='WB_GET_RUNTIME_OPTIONS')r={ok:true,options:{ai_mode:'auto'}};if(m.type==='WB_GET_SEND_BUTTON_PROFILE')r={ok:true,profile:null};if(m.type==='WB_GET_COPY_BUTTON_PROFILES')r={ok:true,profiles:[]};if(m.type==='WB_WORK_START_RECOVER')r={ok:true,pending:false};queueMicrotask(()=>cb(r));}}};}""")
  for f in json.loads((root/'manifest.json').read_text())['content_scripts'][0]['js']:
   await page.add_script_tag(content='((globalThis,location)=>{\n'+(root/f).read_text()+'\n})(fixtureGlobal,fixtureLocation);')
  await page.wait_for_function('()=>pendingBootstrap!==null')
  await page.evaluate("""()=>{fixtureLocation.pathname='/c/22222222-2222-2222-2222-222222222222';fixtureLocation.href=fixtureLocation.origin+fixtureLocation.pathname;document.querySelector('textarea').value='NEW CHAT DRAFT';pendingBootstrap({ok:true,pending:true,prompt:'OLD BOOTSTRAP',origin:'https://chatgpt.com',ai_id:'chatgpt'});}""")
  await page.wait_for_timeout(100)
  value=await page.locator('textarea').input_value()
  try:
   assert value=='NEW CHAT DRAFT',value
   assert not errs,errs
   emit('P7-B1-stale-bootstrap-callback-does-not-touch-new-route',True)
  except Exception as e:emit('P7-B1-stale-bootstrap-callback-does-not-touch-new-route',False,{'error':str(e),'errors':errs,'value':value,'traceback':traceback.format_exc()})
  await page.evaluate('()=>globalThis.__WB_LLM_API_BRIDGE_RUNTIME__?.dispose?.()')
  await browser.close()
 summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'scope':'Actual content script in Chromium synthetic ChatGPT new-chat DOM; no provider calls'}
 (out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
