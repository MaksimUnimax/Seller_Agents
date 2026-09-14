#!/usr/bin/env python3
import os
"""Actual Chromium/production modules on local DOM with mocked location and SHA oracle.
No live AI or WB calls. Each test atomically logged. Group bounds keep runs small.
python browser_final.py CANDIDATE NEW_OUTPUT GROUP
"""
from pathlib import Path
import sys,json,os,hashlib,html,traceback,zipfile,io,base64
from playwright.sync_api import sync_playwright
root,out=map(lambda s:Path(s).resolve(),sys.argv[1:3]); group='own-button'
out.mkdir(parents=True,exist_ok=False);rows=[];page_errors=[];network=[]
files={str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(root.rglob('*')) if p.is_file() and '.git' not in p.parts}
(out/'SOURCE_HASHES.json').write_text(json.dumps(files,indent=2))
ID='11111111-1111-1111-1111-111111111111';OTHER='22222222-2222-2222-2222-222222222222'
def api(a='seller_info',p=None):return 'WB_API_V1\n'+json.dumps({'operation':a,'params':p or {}},ensure_ascii=False)
HELP='WB_HELP_V1\n{"operation":"catalog","params":{}}'
def block(t,ai='chatgpt',bid='b1'):
 if ai=='alice':return '<div class="CodeBlock"><button data-testid="codeblock-action-copy">Copy</button><pre class="CodeBlock-ContentPre"><code>'+html.escape(t)+'</code></pre></div>'
 return f'<div data-writing-block="true" data-testid="writing-block-container" data-writing-block-id="{bid}"><button aria-label="Copy">Copy</button><div data-writing-block-fullscreen-editor-region style="white-space:pre-wrap">{html.escape(t)}</div></div>'
def turn(t,ai='chatgpt',tid='a1',role='assistant'):
 if ai=='alice':return f'<div data-message-role="{"alice" if role=="assistant" else "user"}" id="{tid}">{t}</div>'
 return f'<section data-turn="{role}" data-turn-id="{tid}">{t}</section>'
def composer(ai):
 if ai=='alice':return '<div class="Standalone-Input" data-testid="standalone-input"><textarea data-testid="inputbase-textarea"></textarea><button type="button" data-testid="oknyx" aria-label="Отправить">Send</button><div data-testid="input-controls-root"><button type="button" data-testid="InputControls-Plus-Button" aria-haspopup="dialog">File</button></div></div>'
 return '<form id="compose-form"><textarea id="prompt-textarea"></textarea><input type="file" id="upload-files" multiple><button type="button" data-testid="send-button" aria-label="Send">Send</button></form>'
STUB=r'''({manual,ai,id})=>{
 window.messages=[];window.listeners=[];window.manual=manual;window.ai=ai;window.fixtureId=id;window.fixtureOrigin=location.origin;window.sentClicks=0;window.receivedFiles=[];
 window.nativeCopies=0;document.querySelectorAll('button[aria-label=Copy],button[data-testid=codeblock-action-copy]').forEach(b=>b.addEventListener('click',()=>nativeCopies++));window.responseText='WB_RESULT_V1\n{"fixture":"complete-result"}';window.autoSend=false;window.deferExecute=false;window.pendingExecute=null;
 window.chrome={runtime:{lastError:null,onMessage:{addListener:f=>listeners.push(f),removeListener:f=>listeners=listeners.filter(x=>x!==f)},sendMessage:(m,cb)=>{
 messages.push(m);let r={ok:true,enabled:manual};
 if(m.type==='WB_GET_RUNTIME_OPTIONS')r={ok:true,options:{ai_mode:'auto',composer_wait_ms:1000,attachment_wait_ms:1000}};
 if(m.type==='WB_CONTENT_READY')r={ok:true,manual_mode:manual,conversation_key:fixtureOrigin+'|'+fixtureId};
 if(m.type==='WB_WORK_STATE')r={ok:true,work:{state:manual?'active_visible':'inactive',conversation_key:fixtureOrigin+'|'+fixtureId,revision:2}};
 if(m.type==='WB_BOOTSTRAP_STATE')r={ok:true,pending:false};
 if(m.type==='WB_AUTO_COMMAND_READY')r={ok:true,accepted:true};
 if(m.type==='WB_EXECUTE_COMMAND')r={ok:true,auto_send:autoSend,report_text:responseText,request_id:'test-request',operation_id:'test-operation',manual_operation_id:'test-operation',delivery_id:'test-delivery',conversation_key:fixtureOrigin+'|'+fixtureId};
 if(m.type==='WB_DELIVERY_PREPARE')r={ok:true,text:responseText,files:window.preparedFiles||[],auto_send:autoSend,options:{composer_wait_ms:1000,attachment_wait_ms:1000}};
 if(m.type.includes('COMMIT_REQUEST'))r={ok:true,committed:true,click_allowed:true};
 if(m.type==='WB_EXECUTE_COMMAND'&&deferExecute){pendingExecute=()=>cb(r);return;}
 queueMicrotask(()=>cb(r));
 },connect:()=>window.fixturePort()}};
 window.fire=(message)=>Promise.all(listeners.map(f=>new Promise(resolve=>{const keep=f(message,{},resolve);if(!keep)resolve({});})));
 document.querySelectorAll('[data-testid="send-button"],[data-testid="oknyx"]').forEach(b=>b.addEventListener('click',()=>{sentClicks++;const a=WBAIAdapters.adapterForLocation();const c=a.composerContext();const t=c.composer.value;const n=document.createElement(ai==='alice'?'div':'section');if(ai==='alice'){n.dataset.messageRole='user';n.id='user-sent-'+sentClicks;}else{n.dataset.turn='user';n.dataset.turnId='user-sent-'+sentClicks;}n.textContent=t;document.querySelector('main').append(n);c.composer.value='';c.composer.dispatchEvent(new InputEvent('input',{bubbles:true}));}));
 window.previewFiles=files=>{receivedFiles.push(...files);const a=WBAIAdapters.adapterForLocation(),c=a.composerContext();for(const f of files){const wrap=document.createElement('div');wrap.dataset.status='ready';const n=document.createElement('span');n.dataset.filename=f.name;n.textContent=f.name;wrap.append(n);c.root.append(wrap);}};
 document.querySelector('input[type=file]')?.addEventListener('change',e=>previewFiles([...e.target.files]));document.body.addEventListener('drop',e=>{e.preventDefault();previewFiles([...e.dataTransfer.files]);});
}'''
def expect(ok,msg='Assertion failed'):
 if not ok:raise AssertionError(msg)
def emit(name,ok,detail=None):
 r={'id':name,'status':'PASS' if ok else 'FAIL','detail':detail,'scope':'REAL_CHROMIUM_LOCAL_DOM_MOCKED_LOCATION_SHA_ORACLE_NO_PROVIDER'};rows.append(r)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(r,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 print(r['status'],name,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking'])
 def load(p,f):p.add_script_tag(content='((globalThis,location)=>{\n'+(root/f).read_text()+'\n})(fixtureGlobal,fixtureLocation);')
 def setup(ai='chatgpt',body='',manual=True,content=False,url=None):
  ctx=browser.new_context();page=ctx.new_page();page.set_default_timeout(1200);err=[];page.on('pageerror',lambda e:err.append(str(e)))
  target=url or ('https://alice.yandex.ru/chat/' if ai=='alice' else 'https://chatgpt.com/c/')+ID
  doc='<!doctype html><html><head><style>textarea{width:480px;height:100px}button{min-width:50px;height:28px}</style></head><body><main>'+body+'</main>'+composer(ai)+(('<div class=ChatListItem id="'+ID+'"><button data-testid=chatlist-item-active aria-current=page>Active</button></div>') if ai=='alice' else '')+'</body></html>'
  ctx.route('**/*',lambda r:(network.append({'url':r.request.url,'blocked':True}),r.abort()))
  page.set_content(doc)
  page.expose_function('fixtureSha256',lambda values:list(hashlib.sha256(bytes(values)).digest()))
  page.evaluate("""target=>{const u=new URL(target);window.fixtureLocation={origin:u.origin,hostname:u.hostname,protocol:u.protocol,pathname:u.pathname,href:u.href};window.fixtureGlobal=new Proxy(globalThis,{get:(t,k)=>k==='location'?fixtureLocation:Reflect.get(t,k),set:(t,k,v)=>Reflect.set(t,k,v)});if(!crypto.subtle)Object.defineProperty(crypto,'subtle',{value:{digest:async(algorithm,bytes)=>Uint8Array.from(await fixtureSha256(Array.from(new Uint8Array(bytes.buffer||bytes,bytes.byteOffset||0,bytes.byteLength)))).buffer}});if(!crypto.randomUUID)Object.defineProperty(crypto,'randomUUID',{value:()=> 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const n=crypto.getRandomValues(new Uint8Array(1))[0]&15;return(c==='x'?n:(n&3)|8).toString(16)})});}""",target)
  page.evaluate(STUB.replace('location.origin','fixtureLocation.origin'),{'manual':manual,'ai':ai,'id':ID})
  for f in json.loads((root/'manifest.json').read_text())['content_scripts'][0]['js']:
   if f!='content_script.js' or content:load(p=page,f=f)
  page.wait_for_timeout(80)
  return ctx,page,err
 def case(name,fn,ai='chatgpt',body='',manual=True,content=False,url=None):
  ctx,p,err=setup(ai,body,manual,content,url)
  try:
   detail=fn(p);expect(not err,'PAGEERROR '+str(err));emit(name,True,detail)
  except Exception as e:
   emit(name,False,{'error':str(e),'page_errors':err});p.screenshot(path=str(out/(name+'.png')))
   (out/(name+'.messages.json')).write_text(json.dumps(p.evaluate('messages'),ensure_ascii=False,indent=2))
  finally:page_errors.extend(err);ctx.close()
 def count(p,kind):return p.evaluate('t=>messages.filter(m=>m.type===t).length',kind)
 def begin(p,baseline=None):p.evaluate('ids=>fire({type:"WB_AUTO_BEGIN_WATCH",run_id:"fixture-run",watch_id:"fixture-watch",origin:fixtureOrigin,conversation_id:fixtureId,conversation_key:fixtureOrigin+"|"+fixtureId,assistant_baseline_ids:ids})',baseline or [])
 def copy_click(p,ai):p.locator('[data-testid=codeblock-action-copy]' if ai=='alice' else 'button[aria-label=Copy]').first.click()
 def captured(p):return p.evaluate("messages.find(m=>m.type==='WB_AUTO_COMMAND_READY')?.command_text")

 BTN='button.wb-bridge-block-action'
 BODY=turn(block(HELP))
 def clicked(p):
  p.locator('button[aria-label=Copy]').click();p.wait_for_timeout(220)
  expect(p.evaluate('nativeCopies')==1,'Native Copy no longer works')
  expect(count(p,'WB_EXECUTE_COMMAND')==0,'Native Copy executes WB command')
 case('NATIVE_COPY_NO_WB_EXECUTION',clicked,body=BODY,content=True)
 def native_unchanged(p):
  r=p.locator('button[aria-label=Copy]').evaluate('(b)=>({style:b.getAttribute("style"),title:b.getAttribute("title"),text:b.textContent})')
  expect(r=={'style':None,'title':None,'text':'Copy'},'Native Copy mutated: '+str(r));return r
 case('NATIVE_COPY_ATTRIBUTES_UNCHANGED',native_unchanged,body=BODY,content=True)
 def surface(p):
  expect(p.locator(BTN).count()==1,'Independent WB button absent')
  v=p.locator(BTN).evaluate('(b)=>({shadow:b.getRootNode() instanceof ShadowRoot,host:b.getRootNode().host.id,label:b.textContent})')
  expect(v=={'shadow':True,'host':'wb-bridge-own-button-host','label':'WB'},str(v))
  expect(count(p,'WB_EXECUTE_COMMAND')==0);return v
 case('ONE_OWNED_SHADOW_SURFACE',surface,body=BODY,content=True)
 def selection(p):
  p.locator(BTN).nth(1).click();p.wait_for_timeout(150)
  c=p.evaluate("messages.filter(m=>m.type==='WB_EXECUTE_COMMAND').map(m=>m.command_text)")
  expect(len(c)==1 and 'subscriptions' in c[0] and 'seller_info' not in c[0],str(c));expect(p.evaluate('nativeCopies')==0)
 case('ONLY_SELECTED_BLOCK_EXECUTES',selection,body=turn(block(api('seller_info'),bid='a')+block(api('subscriptions'),bid='b')),content=True)
 def dynamic(p):
  p.evaluate("()=>{document.querySelector('[data-writing-block-fullscreen-editor-region]').textContent='WB_HELP_V1 {\"operation\":\"describe\",\"params\":{\"alias\":\"subscriptions\"}}'}")
  p.wait_for_timeout(120);p.locator(BTN).click();p.wait_for_timeout(120)
  expect('subscriptions' in p.evaluate("messages.find(m=>m.type==='WB_EXECUTE_COMMAND')?.command_text||''"),'Stale raw text used')
 case('READ_RAW_ONLY_ON_OWN_CLICK',dynamic,body=BODY,content=True)
 def many(p):
  p.evaluate("()=>{const m=document.querySelector('main');for(let i=0;i<4;i++){const s=m.firstElementChild.cloneNode(true);s.dataset.turnId='new-'+i;s.querySelector('[data-testid=writing-block-container]').dataset.writingBlockId='new-'+i;m.append(s)}}")
  p.wait_for_timeout(180);expect(p.locator(BTN).count()==5,'Missing/duplicated structural controls')
  expect(p.locator('#wb-bridge-own-button-host').count()==1)
 case('DOM_RESCAN_ONE_HOST_NO_DUPLICATES',many,body=BODY,content=True)
 def hidden(p):
  p.evaluate("()=>fire({type:'WB_WORK_VISIBILITY',work:{state:'active_hidden',conversation_key:fixtureOrigin+'|'+fixtureId,revision:3},conversation_key:fixtureOrigin+'|'+fixtureId})")
  p.wait_for_timeout(100);expect(p.locator(BTN).count()==0 and p.locator('#wb-bridge-own-button-host').count()==0)
  p.locator('button[aria-label=Copy]').click();expect(count(p,'WB_EXECUTE_COMMAND')==0,'Hidden Work still executes from native Copy')
 case('HIDE_REMOVES_SURFACE_AND_EXECUTION',hidden,body=BODY,content=True)
 def wrong(p):
  p.evaluate("()=>fire({type:'WB_WORK_VISIBILITY',work:{state:'active_visible',conversation_key:fixtureOrigin+'|22222222-2222-2222-2222-222222222222',revision:3},conversation_key:fixtureOrigin+'|22222222-2222-2222-2222-222222222222'})")
  expect(p.locator(BTN).count()==0,'Wrong owner showed a WB button')
 case('WRONG_OWNER_VISIBILITY_REJECTED',wrong,body=BODY,manual=False,content=True)
 def stale(p):
  p.locator(BTN).evaluate('(b)=>window.oldOwnButton=b')
  p.evaluate("()=>document.querySelector('[data-testid=writing-block-container]').remove()")
  p.wait_for_timeout(120);p.evaluate('()=>oldOwnButton.click()');expect(count(p,'WB_EXECUTE_COMMAND')==0,'Removed block executed');expect(p.locator(BTN).count()==0)
 case('REMOVED_BLOCK_NO_STALE_EXECUTION',stale,body=BODY,content=True)
 def busy(p):
  p.evaluate('()=>{deferExecute=true}');p.locator(BTN).nth(0).click();p.wait_for_timeout(80)
  expect(p.locator(BTN).nth(1).is_disabled(),'Parallel block execution not disabled')
  p.locator(BTN).nth(1).evaluate('(b)=>b.click()');expect(count(p,'WB_EXECUTE_COMMAND')==1)
 case('GLOBAL_MANUAL_SINGLE_FLIGHT',busy,body=turn(block(api(),bid='a')+block(api('subscriptions'),bid='b')),content=True)
 case('STRUCTURE_NOT_COMMAND_TEXT',lambda p:expect(p.locator(BTN).count()==1,'Non-command structural block was skipped'),body=turn(block('ordinary example')),content=True)
 def alice(p):
  expect(p.locator(BTN).count()==1,'Alice WB surface missing');p.locator('[data-testid=codeblock-action-copy]').click();expect(count(p,'WB_EXECUTE_COMMAND')==0)
 case('ALICE_NATIVE_COPY_SEPARATION',alice,ai='alice',body=turn(block(HELP,'alice'),'alice'),content=True)
 def legacy(p):
  result=p.evaluate("()=>fire({type:'WB_APPLY_MANUAL_MODE',enabled:true,conversation_key:fixtureOrigin+'|'+fixtureId})")
  p.wait_for_timeout(120);expect(p.locator(BTN).count()==0,'Legacy boolean showed WB buttons despite inactive Work')
 case('LEGACY_MESSAGE_CANNOT_REVIVE_WORK',legacy,body=BODY,manual=False,content=True)
 browser.close()
summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'real_provider_calls':0,'network_attempts':network,'scope':'Actual production content in Chromium synthetic ChatGPT/Alice DOM, mocked runtime; not installed profile acceptance'}
(out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary,flush=True);sys.exit(bool(summary['failed']))
