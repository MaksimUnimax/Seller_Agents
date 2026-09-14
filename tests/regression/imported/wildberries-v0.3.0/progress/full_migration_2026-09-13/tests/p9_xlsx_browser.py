import os
from pathlib import Path
import asyncio,json,sys,os,zipfile,io,traceback
from playwright.async_api import async_playwright
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False);rows=[]
def emit(i,ok,d=None):
 r={'id':i,'status':'PASS' if ok else 'FAIL','detail':d};rows.append(r)
 with (out/'results.jsonl').open('a') as f:f.write(json.dumps(r,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
 print(r['status'],i,d or '',flush=True)
def xlsx_bytes():
 bio=io.BytesIO()
 sheet='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1"><v>12345678901234567890</v></c><c><v>42</v></c><c r="C1"><f>1+1</f><v>2</v></c></row></sheetData></worksheet>'''
 with zipfile.ZipFile(bio,'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('xl/worksheets/sheet1.xml',sheet)
  z.writestr('xl/workbook.xml','<workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" r:id="r1"/></sheets></workbook>')
  z.writestr('xl/_rels/workbook.xml.rels','<Relationships><Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>')
 return bio.getvalue()
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('WB_TEST_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-background-networking']);page=await b.new_page();await page.set_content('<html><body></body></html>');await page.add_script_tag(content=(root/'shared/xlsx_reader.js').read_text())
  good=list(xlsx_bytes())
  try:
   r=await page.evaluate('b=>WBXlsxReader.read(Uint8Array.from(b))',good);row=r['sheets'][0]['rows'][0];assert row['values'][0]=='12345678901234567890',row;assert row['values'][1]=='42',row;emit('P9-01-namespaced-workbook-implicit-cell-refs-precision',True)
  except Exception as e:emit('P9-01-namespaced-workbook-implicit-cell-refs-precision',False,{'error':str(e),'traceback':traceback.format_exc()})
  try:
   r=await page.evaluate('b=>WBXlsxReader.read(Uint8Array.from(b))',good);c=r['sheets'][0]['rows'][0]['values'][2];assert c['formula']=='1+1' and c['cached']=='2' and c['evaluated'] is False,c;assert r['formulas_evaluated'] is False;assert r['external_links_followed'] is False;assert r['numeric_precision']=='strings';emit('P9-02-formula-not-evaluated-external-links-not-followed',True)
  except Exception as e:emit('P9-02-formula-not-evaluated-external-links-not-followed',False,{'error':str(e),'traceback':traceback.format_exc()})
  try:
   r=await page.evaluate('async()=>{try{await WBXlsxReader.read(Uint8Array.from([1,2,3,4]));return null}catch(e){return e.code||e.message}}');assert r in ('XLSX_ZIP_SIZE','XLSX_ZIP_DIRECTORY'),r;emit('P9-03-corrupt-archive-rejected',True)
  except Exception as e:emit('P9-03-corrupt-archive-rejected',False,{'error':str(e),'traceback':traceback.format_exc()})
  await b.close()
 summary={'passed':sum(x['status']=='PASS' for x in rows),'failed':sum(x['status']=='FAIL' for x in rows),'scope':'Provider-neutral local XLSX parser in Chromium; no WB report lifecycle/provider calls'};(out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary);return bool(summary['failed'])
sys.exit(asyncio.run(main()))
