"""Local document parsing against real Chromium APIs. Synthetic bytes only."""
import sys,os,json,zipfile,io,zlib,struct
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]).resolve();out.mkdir(parents=True,exist_ok=False);results=[]
def archive(entries,stored=False):
 b=io.BytesIO()
 with zipfile.ZipFile(b,'w',zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED) as z:
  for name,value in entries.items():z.writestr(name,value)
 return b.getvalue()
NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
REL='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
sheet=f'<x:worksheet xmlns:x="{NS}"><x:sheetData><x:row><x:c t="inlineStr"><x:is><x:t>Название</x:t></x:is></x:c><x:c><x:v>12345678901234567890.001</x:v></x:c><x:c><x:f>HYPERLINK("https://invalid.example/")</x:f><x:v>2</x:v></x:c></x:row><x:row><x:c t="s"><x:v>0</x:v></x:c></x:row></x:sheetData></x:worksheet>'
def workbook(target='worksheets/sheet1.xml',mode='',sheet_text=sheet,path='xl/worksheets/sheet1.xml'):
 return {'xl/workbook.xml':f'<x:workbook xmlns:x="{NS}" xmlns:r="{REL}"><x:sheets><x:sheet name="Данные" sheetId="1" r:id="r1"/></x:sheets></x:workbook>', 'xl/_rels/workbook.xml.rels':f'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="{REL}/worksheet" Target="{target}" TargetMode="{mode}"/></Relationships>', path:sheet_text,'xl/sharedStrings.xml':f'<sst xmlns="{NS}"><si><r><t>песок</t></r><r><t> &amp; кровь</t></r></si></sst>'}
def check(condition,value=None):
 assert condition,value
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ['WB_TEST_CHROMIUM'],headless=True,args=['--no-sandbox','--disable-background-networking'])
 page=browser.new_page();requests=[];page.route('**/*',lambda route:(requests.append(route.request.url),route.abort()))
 page.set_content('<html><body></body></html>')
 for name in ['xlsx_reader.js','document_reader.js']:
  p=root/'shared'/name
  if p.exists():page.add_script_tag(content=p.read_text())
 def xlsx(b):return page.evaluate('async b=>{try{return {ok:true,data:await WBXlsxReader.read(Uint8Array.from(b))}}catch(e){return {ok:false,code:e.code||e.message}}}',list(b))
 def doc(b,name,options={}):return page.evaluate('async x=>{try{return {ok:true,data:await WBDocumentReader.read(Uint8Array.from(x.b),{filename:x.name,...x.options})}}catch(e){return {ok:false,code:e.code||e.message}}}',{'b':list(b),'name':name,'options':options})
 def reject(b,code=None):
  r=xlsx(b);check(not r['ok'],r)
  if code:check(r['code']==code,r)
 def test(name,fn):
  try:fn();row={'id':name,'status':'PASS'}
  except Exception as e:row={'id':name,'status':'FAIL','error':str(e)}
  results.append(row)
  with (out/'results.jsonl').open('a') as f:f.write(json.dumps(row,ensure_ascii=False)+'\n');f.flush();os.fsync(f.fileno())
  print(row,flush=True)
 def custom():
  r=xlsx(archive(workbook('worksheets/custom-data.xml',path='xl/worksheets/custom-data.xml')));check(r['ok'],r);s=r['data']['sheets'][0];check(s['name']=='Данные',s);check(s['rows'][0]['values'][0]=='Название',s)
 test('XLSX_CUSTOM_WORKSHEET_RELATIONSHIP_AND_NAMESPACES',custom)
 def values():
  r=xlsx(archive(workbook()));check(r['ok'],r);s=r['data']['sheets'][0]['rows'];check(s[0]['values'][1]=='12345678901234567890.001',s);check(s[0]['values'][2]['evaluated'] is False,s);check(s[1]['values'][0]=='песок & кровь',s)
 test('XLSX_IMPLICIT_ROWS_CELLS_SHARED_TEXT_PRECISION_FORMULA',values)
 for target in ['/xl/worksheets/sheet1.xml','xl/worksheets/sheet1.xml','./worksheets/sheet1.xml']:
  test('XLSX_RELATIONSHIP_'+target,lambda target=target:check(xlsx(archive(workbook(target)))['ok']))
 test('XLSX_MISSING_WORKBOOK_METADATA_REJECTED',lambda:reject(archive({'xl/worksheets/sheet1.xml':'<worksheet><row><c><v>2</v></c></row></worksheet>'}),'XLSX_WORKBOOK_METADATA_MISSING'))
 test('XLSX_EXTERNAL_WORKSHEET_REJECTED',lambda:reject(archive(workbook('https://invalid.example/file.xml','External')),'XLSX_EXTERNAL_WORKSHEET'))
 test('XLSX_RELATIONSHIP_TRAVERSAL_REJECTED',lambda:reject(archive(workbook('../../outside.xml')),'XLSX_UNSAFE_RELATIONSHIP'))
 test('XLSX_XML_ENTITY_REJECTED',lambda:reject(archive(workbook(sheet_text='<!DOCTYPE worksheet [<!ENTITY x SYSTEM "https://invalid.example/">]>'+sheet)),'XLSX_UNSAFE_XML'))
 test('XLSX_DUPLICATE_CELL_REJECTED',lambda:reject(archive(workbook(sheet_text='<worksheet><row r="1"><c r="A1"/><c r="A1"/></row></worksheet>')),'XLSX_DUPLICATE_CELL'))
 test('XLSX_DUPLICATE_ROW_REJECTED',lambda:reject(archive(workbook(sheet_text='<worksheet><row r="1"/><row r="1"/></worksheet>')),'XLSX_ROW_ORDER'))
 test('XLSX_CELL_ROW_CONFLICT_REJECTED',lambda:reject(archive(workbook(sheet_text='<worksheet><row r="1"><c r="A2"/></row></worksheet>')),'XLSX_CELL_REF_INVALID'))
 test('XLSX_ZIP_TRAVERSAL_REJECTED',lambda:reject(archive({'../file.xml':'bad'}),'XLSX_UNSAFE_ZIP_ENTRY'))
 def corrupt_crc():
  b=bytearray(archive(workbook(),stored=True));i=b.index(b'PK\x01\x02');b[i+16]^=1;reject(b,'XLSX_CRC_OR_SIZE')
 test('XLSX_ZIP_CRC_REJECTED',corrupt_crc)
 def mismatch():
  b=bytearray(archive(workbook()));b[30]^=1;reject(b,'XLSX_LOCAL_CENTRAL_MISMATCH')
 test('XLSX_ZIP_LOCAL_CENTRAL_NAME_REJECTED',mismatch)
 def bomb():
  b=bytearray(archive({'huge.txt':'a'*100000}));i=b.index(b'PK\x01\x02');struct.pack_into('<I',b,i+24,1);reject(b,'XLSX_DECOMPRESSION_LIMIT')
 test('XLSX_INFLATION_BOUND_DURING_STREAM',bomb)
 def csv():
  r=doc('ID;Text;Text\r\n12345678901234567890;"hello;\nworld";"a""b"\r\n2;;=1+1'.encode(),'report.csv');check(r['ok'],r);s=r['data']['sheet'];check(s['rows'][0]==['12345678901234567890','hello;\nworld','a"b'],s);check(s['rows'][1][2]=='=1+1',s);check(len(set(s['columns']))==3,s)
 test('CSV_QUOTES_MULTILINE_PRECISION_FORMULA_TEXT',csv)
 def csv_page():
  r=doc(b'a,b\n1,2\n3,4','report.csv',{'limit':1});check(r['ok'],r);s=r['data']['sheet'];check(s['rows']==[['1','2']] and s['has_more'] and s['next_offset']==1,s)
 test('CSV_EXPLICIT_LOCAL_PAGINATION',csv_page)
 def malformed_csv():
  r=doc(b'a,b\n"unclosed','report.csv');check(r.get('code')=='CSV_UNCLOSED_QUOTE',r)
 test('CSV_MALFORMED_QUOTE_REJECTED',malformed_csv)
 def wider_csv():
  r=doc(b'a\n1,2,3','report.csv');check(r['ok'],r);s=r['data']['sheet'];check(s['rows']==[['1,2,3']],s)
 test('CSV_NO_SILENT_DATA_COLUMN_LOSS',lambda:check(doc(b'a,b\n1,2,3','report.csv')['data']['sheet']['rows']==[['1','2','3']]))
 def zipcsv():
  r=doc(archive({'one.csv':'a\n1','two.csv':'a\n2'}),'report.zip',{'entry':'two.csv'});check(r['ok'],r);check(r['data']['sheet']['rows']==[['2']],r);check(r['data']['available_entries']==['one.csv','two.csv'],r)
 test('ZIP_CSV_EXPLICIT_ENTRY_SELECTION',zipcsv)
 def pdf(compress=False):
  content=b'BT (Hello PDF) Tj [(one)(two)] TJ <FEFF041F04350441043E043A> Tj ET'
  raw=zlib.compress(content) if compress else content
  b=b'%PDF-1.4\n1 0 obj\n<<'+(b'/Filter /FlateDecode ' if compress else b'')+b'/Length '+str(len(raw)).encode()+b'>>\nstream\n'+raw+b'\nendstream\nendobj\n%%EOF'
  r=doc(b,'report.pdf');check(r['ok'],r);d=r['data'];check(d['text_extract_available'] and 'Hello PDF' in d['text_extract'] and 'Песок' in d['text_extract'],d);check(d['extraction_complete'] is False and d['scripts_executed'] is False,d)
 test('PDF_LITERAL_HEX_PARTIAL_EXTRACTION',pdf)
 test('PDF_FLATE_PARTIAL_EXTRACTION',lambda:pdf(True))
 test('PDF_INVALID_HEADER_REJECTED',lambda:check(doc(b'not a PDF','report.pdf').get('code')=='PDF_HEADER_INVALID'))
 if len(sys.argv)>3:
  page.add_script_tag(content=(Path(sys.argv[3])/'shared/provider_transport_core.js').read_text())
  def differential_xlsx():
   simple='<worksheet><sheetData><row><c t="inlineStr"><is><t>Name</t></is></c><c t="inlineStr"><is><t>Count</t></is></c></row><row><c t="inlineStr"><is><t>Песок</t></is></c><c><v>42</v></c></row></sheetData></worksheet>'
   data=archive(workbook(sheet_text=simple));a=xlsx(data);b=page.evaluate('b=>ProviderTransportCore.parseAiReadableReportBytes(Uint8Array.from(b),{pathname:"report.xlsx"})',list(data));check(a['ok'],a);rows=a['data']['sheets'][0]['rows'];check(rows[0]['values']==b['sheet']['columns'],b);check(rows[1]['values']==[str(x) for x in b['sheet']['rows'][0]],b)
  test('DONOR_DIFFERENTIAL_VALID_WORKBOOK_RELATIONSHIPS',differential_xlsx)
  def differential_csv():
   data='Name,Count\nПесок,42'.encode();a=doc(data,'report.csv')['data']['sheet'];b=page.evaluate('b=>ProviderTransportCore.parseAiReadableReportBytes(Uint8Array.from(b),{pathname:"report.csv"})',list(data))['sheet'];check(a['columns']==b['columns'] and a['rows']==b['rows'],(a,b))
  test('DONOR_DIFFERENTIAL_DELIMITED_TEXT',differential_csv)
  def differential_pdf():
   data=b'%PDF-1.4\n<< /Length 21 >>\nstream\nBT (Hello) Tj ET\nendstream\n%%EOF';a=doc(data,'report.pdf')['data'];b=page.evaluate('b=>ProviderTransportCore.parsePdfDocumentBytes(Uint8Array.from(b))',list(data));check(a['text_extract']==b['text_extract'],(a,b))
  test('DONOR_DIFFERENTIAL_PDF_OPERATORS',differential_pdf)
 test('DOCUMENT_NETWORK_CALLS_ZERO',lambda:check(not requests,requests))
 browser.close()
summary={'passed':sum(r['status']=='PASS' for r in results),'failed':sum(r['status']=='FAIL' for r in results),'scope':'Synthetic local files in real Chromium; no native extension, no provider traffic'}
(out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(summary);sys.exit(bool(summary['failed']))
