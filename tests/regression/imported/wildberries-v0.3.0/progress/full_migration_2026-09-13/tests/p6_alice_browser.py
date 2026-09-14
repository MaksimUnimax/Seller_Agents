#!/usr/bin/env python3
import os
from pathlib import Path
import sys,json,os,hashlib,traceback
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False);rows=[]
def emit(i,ok,d=None):
 r={'id':i,'status':'PASS' if ok else 'FAIL','detail':d};rows.append(r)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(r,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 print(r['status'],i,flush=True)
def case(i,fn):
 try: emit(i,True,fn())
 except Exception as e: emit(i,False,{'error':str(e),'trace':traceback.format_exc()})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking']);p=b.new_page();
 p.set_content('''<!doctype html><body><div class="Standalone-Input" data-testid="standalone-input"><textarea data-testid="inputbase-textarea" style="width:300px;height:80px"></textarea><div data-testid="input-controls-root"><button data-testid="InputControls-Plus-Button" aria-label="Добавить файл" aria-haspopup="dialog" style="width:40px;height:20px">+</button></div><button data-testid="oknyx" aria-label="Отправить" style="width:60px;height:20px">send</button><div class="StandaloneInput-TopControls" id="previews"></div></div></body>''')
 p.evaluate("""()=>{window.fixtureLocation={protocol:'https:',hostname:'alice.yandex.ru',origin:'https://alice.yandex.ru'};window.fixtureGlobal=new Proxy(globalThis,{get:(t,k)=>k==='location'?fixtureLocation:Reflect.get(t,k),set:(t,k,v)=>Reflect.set(t,k,v)});window.dropCount=0;document.body.addEventListener('drop',e=>{e.preventDefault();dropCount++;for(const f of e.dataTransfer.files){const w=document.createElement('div');w.dataset.status='ready';const x=document.createElement('span');x.dataset.filename=f.name;x.textContent=f.name;document.querySelector('#previews').append(x)}})}""")
 for f in ['shared/ai_delivery_capabilities.js','shared/web_file_attachment.js','shared/ai_adapters.js']:
  src=(root/f).read_text();p.add_script_tag(content='((globalThis,location)=>{'+src+'})(fixtureGlobal,fixtureLocation);')
 case('P6-ALICE-SURFACE-OWNED',lambda: p.evaluate("""()=>{const a=WBAIAdapters.adapterForLocation('alice'),s=a.attachmentSurface();if(!s||s.kind!=='drag_drop_v1'||s.root!==document.body||!s.capability_marker)return false;return true}""") or (_ for _ in ()).throw(AssertionError('surface missing')))
 case('P6-ALICE-RUNTIME-XLSX-DECISION',lambda: p.evaluate("""()=>WBAIDeliveryCapabilities.fileDispatchDecision('alice',{filename:'provider.xlsx',mime:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',byte_length:4,source_kind:'original_provider_file',artifact_key:'provider:r',sha256:'a'.repeat(64)})"""))
 def drop():
  v=p.evaluate("""()=>{const a=WBAIAdapters.adapterForLocation('alice'),s=a.attachmentSurface(),f=new File([new Uint8Array([1,2,3])],'provider.xlsx',{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});const r=a.attachFiles(s,[f]);return {dropCount,dispatched:r.dispatched,file_count:r.file_count,preview:!!a.attachmentPreview('provider.xlsx'),ready:a.attachmentReady([{filename:'provider.xlsx'}])}}""")
  assert v=={'dropCount':1,'dispatched':3,'file_count':1,'preview':True,'ready':True},v;return v
 case('P6-ALICE-DROP-READY',drop)
 def stale():
  return p.evaluate("""()=>{const a=WBAIAdapters.adapterForLocation('alice'),s=a.attachmentSurface();s.capability_marker.remove();try{a.attachFiles(s,[new File(['x'],'x.txt',{type:'text/plain'})]);return 'BAD'}catch(e){return e.code}}""")
 case('P6-ALICE-STALE-SURFACE-REJECTED',lambda: (lambda v: v if v=='TARGET_AI_ATTACHMENT_SURFACE_CHANGED' else (_ for _ in ()).throw(AssertionError(v)))(stale()))
 b.close()
summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'real_provider_calls':0,'scope':'actual production AI modules in local Chromium synthetic Alice DOM'};(out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary);sys.exit(bool(summary['failed']))
