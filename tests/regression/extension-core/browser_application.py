"""Native Chromium fixture: generated popup, actual worker/content/IDB, synthetic AI and fetch.
The popup is opened as an extension page; only tabs.query(active) is supplied the
fixture AI tab, because Playwright does not operate the browser action toolbar.
No live AI/provider or installed target-browser certification is claimed.
"""
from pathlib import Path
import argparse,json,tempfile,time,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[3]

def until(fn, timeout=30):
    deadline=time.monotonic()+timeout
    while time.monotonic()<deadline:
        value=fn()
        if value:return value
        time.sleep(.1)
    raise AssertionError('Timed out waiting for browser state')

def run(runtime,output):
    output.mkdir(parents=True,exist_ok=True)
    fixture=(ROOT/'tests/regression/extension-core/fixtures/application-chat.html').read_text()
    result={'status':'RUNNING','live_provider_calls':0,'installed_acceptance':False,'scope':'native Chromium fixture; popup active-tab port controlled; synthetic AI/fetch'}
    with sync_playwright() as p,tempfile.TemporaryDirectory() as profile:
        opts={'headless':True,'channel':'chromium','args':['--no-sandbox',f'--disable-extensions-except={runtime}',f'--load-extension={runtime}']}
        if os.getenv('SA_TEST_CHROMIUM'):opts['executable_path']=os.environ['SA_TEST_CHROMIUM'];opts.pop('channel')
        context=p.chromium.launch_persistent_context(profile,**opts)
        page=popup=worker=None
        errors=[]
        try:
            context.route('**/*',lambda route:route.fulfill(body=fixture,content_type='text/html') if route.request.url.startswith('https://chatgpt.com/c/') else route.abort())
            worker=context.service_workers[0] if context.service_workers else context.wait_for_event('serviceworker')
            page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto('https://chatgpt.com/c/11111111-1111-4111-8111-111111111111')
            tab_id=until(lambda:worker.evaluate("async()=>{const tabs=await chrome.tabs.query({url:'https://chatgpt.com/c/*'});return tabs[0]?.id}"))
            worker.evaluate("""()=>{globalThis.fixtureFetches=[];globalThis.fetch=async(url,init)=>{
              if(!String(url).includes('.wildberries.ru/'))throw new Error('Fixture forbids unmocked provider');
              fixtureFetches.push(String(url));
              return globalThis.fixtureBinary ? new Response(new Uint8Array([37,80,68,70,45,49,10,0,255]),{headers:{'content-type':'application/pdf','content-disposition':'attachment; filename="native-report.pdf"'}}) : new Response('{"result":{"fixture":42}}',{headers:{'content-type':'application/json'}});
            }}""")
            popup=context.new_page();popup.on('pageerror',lambda e:errors.append(str(e)))
            popup.add_init_script(f"const originalQuery=chrome.tabs.query.bind(chrome.tabs);chrome.tabs.query=(query)=>query.active?Promise.resolve([{{id:{tab_id}}}]):originalQuery(query);")
            popup.goto(worker.url.rsplit('/',1)[0]+'/popup.html')
            popup.wait_for_function("document.querySelector('#account').textContent.includes('I1')")
            popup.click('#wildberries');popup.click('#add');popup.fill('#token','FIXTURE_BROWSER_PERSONAL_TOKEN');popup.fill('#name','Тестовый WB');popup.click('#save')
            popup.wait_for_function("document.querySelector('#stores').textContent.includes('Тестовый WB')")
            assert page.evaluate('sent.length')==0
            popup.click('#start')
            until(lambda:'Работаем' in popup.locator('#connection').inner_text())
            assert page.evaluate('sent.length')==1
            assert 'WB_HELP_V1' in page.evaluate('sent[0]')
            # Historical assistant block must not gain the execution button.
            until(lambda:worker.evaluate("async()=>Object.values((await chrome.storage.local.get('ozmb_work_sessions_v1')).ozmb_work_sessions_v1||{})[0]?.state==='active_visible'"))
            page.wait_for_timeout(300)
            assert page.locator('.ozon-bridge-block-action').count()==0
            page.evaluate("fixtureCommand('WB_HELP_V1 {\"operation\":\"describe\",\"params\":{\"alias\":\"seller_info\"}}\\nWB_API_V1 {\"operation\":\"seller_info\",\"params\":{}}')")
            page.locator("section[data-turn='assistant'] .code").last.scroll_into_view_if_needed()
            button=page.locator('.ozon-bridge-block-action').last
            button.wait_for();assert button.inner_text()=='WB';button.click()
            page.wait_for_function('sent.length===2',timeout=30000)
            assert page.evaluate("sent[1].startsWith('WB_BATCH_RESULT_V1')")
            until(lambda:worker.evaluate("async()=>Object.values((await chrome.storage.local.get('ozmb_manual_operations')).ozmb_manual_operations||{})[0]?.status==='completed'"))
            assert worker.evaluate('fixtureFetches.length')==1
            # Hiding keeps the session active; the popup persists the bound marketplace.
            popup.click('#visibility');until(lambda:'скрыта' in popup.locator('#connection').inner_text())
            assert page.locator('.ozon-bridge-block-action').count()==0
            popup.click('#visibility');until(lambda:page.locator('.ozon-bridge-block-action').count()==1)
            page.locator("section[data-turn='assistant'] .code").last.scroll_into_view_if_needed()
            button=page.locator('.ozon-bridge-block-action').last;button.click();page.wait_for_timeout(250)
            assert worker.evaluate('fixtureFetches.length')==1
            # Actual native File/IndexedDB/chunk/attachment/send path for a binary WB result.
            command=worker.evaluate("""()=>{fixtureBinary=true;const m=Object.values(SellerAgentsWBReference.contract.OPERATIONS).find(m=>m.response_mode==='binary'&&m.execution_enabled&&m.privacy==='standard');return 'WB_API_V1 '+JSON.stringify({operation:m.alias,params:{path:Object.fromEntries([...m.path.matchAll(/\\{([^}]+)\\}/g)].map(m=>[m[1],'fixture'])),query:Object.fromEntries(m.required_query_keys.map(k=>[k,'1'])),...(m.body_required?{body:{}}:{})}})}""")
            page.evaluate('(text)=>fixtureCommand(text)',command)
            page.locator("section[data-turn='assistant'] .code").last.scroll_into_view_if_needed()
            button=page.locator('.ozon-bridge-block-action').last;button.wait_for();button.click()
            page.wait_for_function('files.length>=1',timeout=30000)
            actual=page.evaluate("files.find(f=>f.name==='native-report.pdf')")
            assert actual['bytes']==[37,80,68,70,45,49,10,0,255]
            page.wait_for_function('sent.length===3',timeout=30000)
            until(lambda:worker.evaluate("async()=>Object.values((await chrome.storage.local.get('ozmb_manual_operations')).ozmb_manual_operations||{})[0]?.status==='completed'"))
            assert worker.evaluate('fixtureFetches.length')==2
            popup.click('#finish');until(lambda:'Завершено' in popup.locator('#connection').inner_text())
            assert page.locator('.ozon-bridge-block-action').count()==0
            # Popup dimensions at normal and enlarged typography; no horizontal clipping.
            for width,scale in [(380,1),(320,1),(380,1.25)]:
                popup.set_viewport_size({'width':width,'height':900})
                popup.evaluate('(scale)=>document.documentElement.style.fontSize=(14*scale)+"px"',scale)
                popup.click('#edit')
                assert popup.evaluate('document.documentElement.scrollWidth<=innerWidth')
                popup.screenshot(path=str(output/f'popup-{width}-{scale}.png'),full_page=True)
                popup.click('#cancel')
            assert not errors,errors
            result.update(status='PASS',browser=context.browser.version,checks=['popup create/edit','real Work prompt','old-history baseline','WB mixed block text send','no replay','Show/Hide','native binary File/IDB/port send','Finish','320/380px and enlarged typography'])
        except Exception as error:
            result.update(status='FAIL',error=str(error),page_errors=errors)
            if popup:
                try:popup.screenshot(path=str(output/'failure-popup.png'),full_page=True)
                except Exception:pass
            if page:
                try:page.screenshot(path=str(output/'failure-chat.png'),full_page=True)
                except Exception:pass
            if worker:
                try:(output/'failure-worker.json').write_text(json.dumps(worker.evaluate('async()=>chrome.storage.local.get(["ozmb_diagnostics","ozmb_work_sessions_v1","ozmb_manual_operations","ozmb_pending_work_starts_v1"])'),ensure_ascii=False,indent=2))
                except Exception:pass
        finally:
            context.close();(output/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps(result,ensure_ascii=False));assert result['status']=='PASS',result.get('error')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--runtime',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);args=parser.parse_args();run(args.runtime.resolve(),args.output.resolve())
