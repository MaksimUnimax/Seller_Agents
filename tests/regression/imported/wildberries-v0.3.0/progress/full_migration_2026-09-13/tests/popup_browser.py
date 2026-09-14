import os
"""Real popup HTML/CSS/JS in Chromium; runtime/Chrome responses synthetic, never WB."""
from pathlib import Path
import json,sys,re,os,traceback,hashlib
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve(); out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False)
rows=[];f=(out/'results.jsonl').open('x'); networks=[]
fixture=r'''(initial)=>{window.__messages=[];window.__fail=null;window.__unavailable=false;const identity={origin:'https://chatgpt.com',ai_id:'chatgpt',conversation_id:'11111111-1111-1111-1111-111111111111',status:'confirmed'};const key=identity.origin+'|'+identity.conversation_id;
window.__state={version:'0.2.1',page_context_available:true,seller_credentials_present:true,auto_send:true,binding:{bound:true,conversation_id:identity.conversation_id,binding_id:'fixture',revision:1},conversation_key:key,work:{state:initial,revision:2,conversation_key:key,tab_id:1},manual_mode:initial==='active_visible',manual_operation_active:false,provider_gate:'READ_ONLY',provider_operation_count:188,provider_enabled_operation_count:172,provider_execution_ready:true,provider_enabled_operations:['seller_info'],auto_start_prompt:{text:'Per-chat fixture prompt',is_default:true},report_prefix:{enabled:false,text:'prefix fixture',interval:1,delivered_count:0},last_status:{ok:false,code:'WORK_NOT_ACTIVE',message:'OLD_WORK_ERROR',at:'2026-09-01T00:00:00Z'}};
window.__options={ai_mode:'auto',personal_data:false,composer_wait_ms:30000,attachment_wait_ms:30000,bootstrap_text:'Global fixture prompt'};
window.chrome={runtime:{lastError:null,getManifest:()=>({version:'0.2.1'}),sendMessage(m,cb){if(typeof cb!=='function')return new Promise(resolve=>chrome.runtime.sendMessage(m,resolve));__messages.push(m);if(__fail===m.type){queueMicrotask(()=>cb({ok:false,code:'SYNTHETIC_FAILURE',error:'Synthetic explicit action failed'}));return;}let r={ok:true};switch(m.type){
case 'WB_RESOLVE_POPUP_CONTEXT':r=__unavailable?{ok:false,error:'NEW_CHAT_NO_IDENTITY'}:{ok:true,context:{tab_id:1,conversation_key:key,identity}};break;
case 'WB_GET_SETTINGS_STATE':case 'WB_GET_GLOBAL_SETTINGS_STATE':r={ok:true,state:{...__state,page_context_available:m.type!=='WB_GET_GLOBAL_SETTINGS_STATE'}};break;
case 'WB_GET_RUNTIME_OPTIONS':r={ok:true,options:__options};break;
case 'WB_GET_QUOTA_STATE':r={ok:true,observations:[]};break;
case 'WB_WORK_ACTION':if(m.action==='state'){r={ok:true,work:__state.work};break;}__state.work={...__state.work,state:m.action==='finish'?'inactive':m.action==='toggle'?(__state.work.state==='active_visible'?'active_hidden':'active_visible'):m.action==='start'?'binding':__state.work.state,revision:__state.work.revision+1};__state.manual_mode=__state.work.state==='active_visible';r={ok:true,work:__state.work};break;
case 'WB_SAVE_SETTINGS':case 'WB_SAVE_GLOBAL_SETTINGS':__state.auto_send=m.auto_send;__state.report_prefix={...__state.report_prefix,enabled:m.report_prefix_enabled,text:m.report_prefix_text,interval:m.report_prefix_interval||1};r={ok:true,state:__state};break;
case 'WB_SAVE_RUNTIME_OPTIONS':__options={...__options,...m.options};r={ok:true,options:__options};break;
case 'WB_RESET_AUTO_START_PROMPT':r={ok:true,state:__state};break;
case 'WB_GET_DIAGNOSTICS':r={ok:true,events:[]};break;
case 'WB_BIND_CONVERSATION':r={ok:true,binding:__state.binding};break;
}queueMicrotask(()=>cb(r));}},tabs:{query:async()=>[{id:1,url:identity.origin+'/c/'+identity.conversation_id}],sendMessage(id,m,cb){if(typeof cb!=='function')return new Promise(resolve=>chrome.tabs.sendMessage(id,m,resolve));queueMicrotask(()=>cb({ok:true,identity,refreshed:true}))}},storage:{onChanged:{addListener(){},removeListener(){}}}};
}'''
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox']);ctx=browser.new_context(viewport={'width':470,'height':850})
 def new(state='active_visible'):
  p=ctx.new_page();p.set_default_timeout(1400);errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.route('**/*',lambda route:(networks.append(route.request.url),route.abort()))
  html=(root/'popup.html').read_text();scripts=re.findall(r'<script[^>]+src="([^"]+)"',html);html=re.sub(r'<script\b[^>]*>.*?</script>','',html,flags=re.S);html=re.sub(r'<link[^>]*>','',html)
  p.set_content(html);p.add_style_tag(content=(root/'popup.css').read_text());p.evaluate(fixture,state)
  for script in scripts:p.add_script_tag(content=(root/script).read_text())
  p.wait_for_timeout(150);return p,errors
 def test(name,fn):
  p=None
  try:p,e=new('inactive' if name=='START_PENDING_NOT_FALSE_ACTIVE' else 'active_visible');fn(p,e);row={'id':name,'status':'PASS'}
  except Exception as ex:
   row={'id':name,'status':'FAIL','error':str(ex),'trace':traceback.format_exc()}
   if p:p.screenshot(path=str(out/(name+'.png')),full_page=True)
  rows.append(row);f.write(json.dumps(row,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno());print(name,row['status'],row.get('error','')[:160],flush=True)
  if p:p.close()
 def check(v,msg='assertion failed'):
  if not v:raise AssertionError(msg)
 def no_duplicates(p,e):check(not e,str(e));check(p.locator('#manualMode,#startAuto,#pauseAuto,#resumeAuto,#finishAuto').count()==0,'Duplicate manual/production autorun UI still present');check(p.locator('#workStart,#workShowHide,#workRefresh,#workFinish').count()==4)
 test('ONE_WORK_CONTROLLER',no_duplicates)
 test('NO_INITIAL_NETWORK',lambda p,e:check(not p.evaluate('__messages.some(m=>m.type==="WB_TEST_CONNECTION"||m.type==="WB_EXECUTE_COMMAND")')))
 test('NO_FOREIGN_OZON_API_LANGUAGE',lambda p,e:check(not re.search('posting_fbs_get|Performance|OZON_API',p.inner_text('body'))))
 def toggle(p,e):
  p.locator('#workShowHide').click();p.wait_for_timeout(100);check(p.locator('#workSessionMeta').get_attribute('data-state')=='active_hidden');check('Показать' in p.inner_text('#workShowHide'));check('OLD_WORK_ERROR' not in p.inner_text('#status'));check('error' not in (p.get_attribute('#status','class')or''))
 test('TOGGLE_SYNC_AND_STALE_BANNER',toggle)
 def errors(p,e):
  p.evaluate('__fail="WB_WORK_ACTION"');p.locator('#workRefresh').click();p.wait_for_timeout(100);check('SYNTHETIC_FAILURE' in p.inner_text('#status'));check('error' in p.get_attribute('#status','class'));check(p.locator('#workSessionMeta').get_attribute('data-state')=='active_visible')
 test('ACTION_FAILURE_NOT_HIDDEN',errors)
 def busy(p,e):
  p.evaluate('__state.manual_operation_active=true');p.locator('#refreshState').click();p.wait_for_timeout(100);check(p.locator('#workStart').is_disabled());check('Доставка' in p.inner_text('#workAuthorityMeta'))
 test('DURABLE_BUSY_VISIBLE',busy)
 def dirty(p,e):
  p.locator('#bootstrapText').fill('unsaved local draft');p.locator('summary',has_text='Префикс результата WB').click();p.locator('#reportPrefixText').fill('unsaved prefix');p.locator('#refreshState').click();p.wait_for_timeout(100);check(p.input_value('#bootstrapText')=='unsaved local draft');check(p.input_value('#reportPrefixText')=='unsaved prefix')
 test('REFRESH_PRESERVES_UNSAVED_TEXT',dirty)
 def save(p,e):
  p.locator('#personalData').check();p.locator('#autoSend').uncheck();p.locator('#bootstrapText').fill('new global prompt');p.locator('#save').click();p.wait_for_timeout(100);ms=p.evaluate('__messages');check(any(m['type']=='WB_SAVE_RUNTIME_OPTIONS' and m['options'].get('personal_data') for m in ms));check(any(m['type']=='WB_SAVE_SETTINGS' and m.get('auto_send') is False for m in ms));check(not any(m['type']=='WB_TEST_CONNECTION' for m in ms));check(not any('auto_start_prompt_text' in m for m in ms),'Save all must not create an unedited conversation override')
 test('SAVE_OPTIONS_WITHOUT_CALL_OR_OVERRIDE',save)
 def pending(p,e):
  p.locator('#workStart').click();p.wait_for_timeout(100);check(p.locator('#workSessionMeta').get_attribute('data-state')=='binding');check(p.locator('#workShowHide').is_disabled());check('отправлен' not in p.inner_text('#status').lower())
 test('START_PENDING_NOT_FALSE_ACTIVE',pending)
 def ai(p,e):
  p.locator('#aiMode').select_option('chatgpt');p.wait_for_timeout(100);ms=p.evaluate('__messages');check(any(m['type']=='WB_SAVE_RUNTIME_OPTIONS' and m.get('tab_id')==1 and m.get('options',{}).get('ai_mode')=='chatgpt' for m in ms))
 test('AI_SELECTION_SCOPE_CURRENT_TAB',ai)
 def absent(p,e):
  p.evaluate('__unavailable=true');p.locator('#refreshState').click();p.wait_for_timeout(100);check(p.locator('#workStart').is_disabled());check(not p.locator('#save').is_disabled());check(not p.locator('#bootstrapText').is_disabled());check(p.locator('#reportPrefixEnabled').is_disabled())
 test('NEW_CHAT_GLOBAL_SETTINGS_AVAILABLE',absent)
 def geometry(p,e):
  check(not e,str(e));check(p.evaluate('document.documentElement.scrollWidth<=window.innerWidth'));check(p.locator('#workStart').bounding_box()['y']<240);check('WB token' in p.inner_text('body'))
 test('POPUP_LAYOUT_AND_NO_SCRIPT_ERRORS',geometry)
 if all(r['status']=='PASS' for r in rows):
  p,e=new();p.screenshot(path=str(out/'popup-preview.png'),full_page=True);p.screenshot(path=str(out/'popup-top.png'));p.close()
 browser.close()
summary={'passed':sum(r['status']=='PASS' for r in rows),'failed':sum(r['status']=='FAIL' for r in rows),'network_attempts':networks,'real_provider_calls':0,'scope':'actual popup scripts in Chromium with synthetic runtime state, not integrated worker','popup_sha256':hashlib.sha256((root/'popup.js').read_bytes()).hexdigest()}
(out/'summary.json').write_text(json.dumps(summary,indent=2));f.close();print(json.dumps(summary));sys.exit(1 if summary['failed'] else 0)
