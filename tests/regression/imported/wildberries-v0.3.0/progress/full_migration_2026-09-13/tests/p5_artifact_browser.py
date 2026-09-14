import os
from pathlib import Path
import asyncio,json,sys,os,hashlib,traceback
from playwright.async_api import async_playwright
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False);rows=[]
def emit(i,ok,d=None):
 r={'id':i,'status':'PASS' if ok else 'FAIL','detail':d};rows.append(r)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(r,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 print(r['status'],i,d or '',flush=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking']);ctx=await b.new_context();await ctx.route('**/*',lambda route:route.fulfill(status=200,content_type='text/html',body='<html><body></body></html>'));page=await ctx.new_page();await page.goto('https://p5-fixture.test/');await page.expose_function('fixtureSha256',lambda values:list(hashlib.sha256(bytes(values)).digest()));await page.evaluate("()=>{if(!crypto.randomUUID)Object.defineProperty(crypto,'randomUUID',{value:()=> 'fixture-'+Date.now()+'-'+Math.random(),configurable:true});if(!crypto.subtle)Object.defineProperty(crypto,'subtle',{value:{digest:async(_,bytes)=>Uint8Array.from(await fixtureSha256(Array.from(new Uint8Array(bytes.buffer||bytes,bytes.byteOffset||0,bytes.byteLength)))).buffer},configurable:true})}");await page.add_script_tag(content=(root/'shared/artifact_store.js').read_text())
  await page.evaluate("""()=>{window.owner={conversation_key:'https://chatgpt.com|11111111-1111-1111-1111-111111111111',binding_id:'b',binding_revision:1,account_scope:'a'.repeat(64)};window.other={...owner,binding_id:'other'};window.store=WBArtifactStore.create({databaseName:'p5-'+Date.now()});}""")
  try:
   r=await page.evaluate("""async()=>{const bytes=new Uint8Array(700123);for(let i=0;i<bytes.length;i++)bytes[i]=i%251;const d=await store.put(bytes,owner,{name:'result.xlsx',mime:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',requestId:'r1',sourceKind:'original_provider_file',artifactKey:'provider:r1'});window.ref=d.ref;window.original=Array.from(bytes);const got=await store.read(d.ref,owner);return {d,sha:got.sha256,len:got.byte_length,same:Array.from(got.bytes).every((v,i)=>v===bytes[i])}}""");assert r['same'] and r['len']==700123;assert r['d']['source_kind']=='original_provider_file';emit('P5-A1-stored-byte-integrity-provenance',True)
  except Exception as e:emit('P5-A1-stored-byte-integrity-provenance',False,{'error':str(e),'traceback':traceback.format_exc()})
  try:
   code=await page.evaluate("""async()=>{try{await store.read(ref,other);return null}catch(e){return e.code||e.message}}""");assert code=='ARTIFACT_OWNER_MISMATCH',code;emit('P5-A2-owner-mismatch-rejected',True)
  except Exception as e:emit('P5-A2-owner-mismatch-rejected',False,{'error':str(e),'traceback':traceback.format_exc()})
  try:
   r=await page.evaluate("""async()=>{const chunks=[];for(let i=0;;i++){try{const c=await store.chunk(ref,owner,i);chunks.push(c);if(i+1>=c.total)break}catch(e){throw e}}const all=[];for(const c of chunks){const bin=atob(c.base64);for(let j=0;j<bin.length;j++)all.push(bin.charCodeAt(j));}const joined=new Uint8Array(all);const dig=await crypto.subtle.digest('SHA-256',joined);const hex=[...new Uint8Array(dig)].map(x=>x.toString(16).padStart(2,'0')).join('');return {count:chunks.length,file:chunks[0].file_sha256,hex,chunk_ok:chunks.every(c=>/^[a-f0-9]{64}$/.test(c.sha256)),same:joined.length===original.length&&joined.every((v,i)=>v===original[i])}}""");assert r['count']>=2 and r['same'] and r['chunk_ok'] and r['hex']==r['file'];emit('P5-A3-chunk-and-full-integrity',True)
  except Exception as e:emit('P5-A3-chunk-and-full-integrity',False,{'error':str(e),'traceback':traceback.format_exc()})
  try:
   r=await page.evaluate("""async()=>{const ok=await store.remove(ref,owner);let code=null;try{await store.read(ref,owner)}catch(e){code=e.code||e.message}return {ok,code}}""");assert r['ok'] and r['code']=='ARTIFACT_NOT_FOUND',r;emit('P5-A4-terminal-cleanup-removes-artifact',True)
  except Exception as e:emit('P5-A4-terminal-cleanup-removes-artifact',False,{'error':str(e),'traceback':traceback.format_exc()})
  await ctx.close();await b.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Actual IndexedDB artifact store in Chromium; no provider calls'};(out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
