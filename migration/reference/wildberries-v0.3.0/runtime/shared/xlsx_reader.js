/* Local XLSX inspection only. ZIP CRC and XML namespaces are validated; formulas
 * are never evaluated, external relationships are never followed. Numeric values
 * remain strings so finance precision and long IDs cannot be silently rounded. */
(() => {
 'use strict';
 const error=c=>{throw Object.assign(new Error(c),{code:c});};
 const decoder=new TextDecoder('utf-8',{fatal:true}),MAX=32*1024*1024;
 const table=Uint32Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
 function crc32(b){let c=0xffffffff;for(const v of b)c=table[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
 async function unzip(input){const b=input instanceof Uint8Array?input:new Uint8Array(input),v=new DataView(b.buffer,b.byteOffset,b.byteLength);if(b.length>MAX||b.length<22)error('XLSX_ZIP_SIZE');let end=-1;for(let i=b.length-22;i>=Math.max(0,b.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){end=i;break;}if(end<0)error('XLSX_ZIP_DIRECTORY');if(v.getUint16(end+4,true)||v.getUint16(end+6,true))error('XLSX_ZIP_MULTIDISK');const n=v.getUint16(end+10,true),cdsize=v.getUint32(end+12,true),start=v.getUint32(end+16,true);if(n!==v.getUint16(end+8,true)||n>2000||n===65535||start+cdsize!==end||end+22+v.getUint16(end+20,true)!==b.length)error('XLSX_ZIP_LIMIT');let p=start,total=0;const out=new Map();for(let i=0;i<n;i++){
 if(p+46>end||v.getUint32(p,true)!==0x02014b50)error('XLSX_ZIP_DIRECTORY');const flags=v.getUint16(p+8,true),method=v.getUint16(p+10,true),crc=v.getUint32(p+16,true),size=v.getUint32(p+20,true),rawsize=v.getUint32(p+24,true),nl=v.getUint16(p+28,true),el=v.getUint16(p+30,true),cl=v.getUint16(p+32,true),local=v.getUint32(p+42,true);if(p+46+nl+el+cl>start+cdsize)error('XLSX_ZIP_DIRECTORY');const name=decoder.decode(b.slice(p+46,p+46+nl));p+=46+nl+el+cl;
 if(flags&65||![0,8].includes(method)||name.startsWith('/')||name.includes('\\')||name.split('/').includes('..')||out.has(name)||rawsize>MAX||local+30>b.length)error('XLSX_UNSAFE_ZIP_ENTRY');
 if(v.getUint32(local,true)!==0x04034b50)error('XLSX_BAD_LOCAL_HEADER');const localNameLength=v.getUint16(local+26,true),offset=local+30+localNameLength+v.getUint16(local+28,true);if(v.getUint16(local+6,true)!==flags||v.getUint16(local+8,true)!==method||decoder.decode(b.slice(local+30,local+30+localNameLength))!==name)error('XLSX_LOCAL_CENTRAL_MISMATCH');if(offset+size>start)error('XLSX_ENTRY_BOUNDS');let bytes=b.slice(offset,offset+size);
 if(method===8){const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));const reader=stream.getReader(),chunks=[];let count=0;for(;;){const next=await reader.read();if(next.done)break;count+=next.value.length;if(count>rawsize||total+count>MAX){await reader.cancel();error('XLSX_DECOMPRESSION_LIMIT');}chunks.push(next.value);}bytes=new Uint8Array(count);let at=0;for(const c of chunks){bytes.set(c,at);at+=c.length;}}
 total+=bytes.length;if(total>MAX||bytes.length!==rawsize||crc32(bytes)!==crc)error('XLSX_CRC_OR_SIZE');out.set(name,bytes);
 }if(p!==start+cdsize)error('XLSX_ZIP_DIRECTORY');return out;}
 function xml(s){if(/<!DOCTYPE|<!ENTITY/i.test(s))error('XLSX_UNSAFE_XML');const doc=new DOMParser().parseFromString(s,'application/xml');if(doc.getElementsByTagNameNS('*','parsererror').length)error('XLSX_XML_INVALID');return doc;}
 const nodes=(root,name)=>Array.from(root.getElementsByTagNameNS('*',name));
 function col(ref){let n=0;for(const c of ref.toUpperCase())n=n*26+c.charCodeAt(0)-64;return n-1;}
 function worksheet(s,shared=[]){const doc=xml(s),rows=[];let rowIndex=-1,cells=0;for(const row of nodes(doc,'row')){const declared=row.getAttribute('r'),previous=rowIndex;if(declared&&!/^[1-9][0-9]*$/.test(declared))error('XLSX_ROW_REF_INVALID');rowIndex=declared?Number(declared)-1:rowIndex+1;if(rowIndex<=previous)error('XLSX_ROW_ORDER');if(!Number.isSafeInteger(rowIndex)||rowIndex<0||rowIndex>=100000)error('XLSX_ROW_LIMIT');const values=[];const usedColumns=new Set();let column=-1;for(const cell of Array.from(row.children).filter(x=>x.localName==='c')){const ref=cell.getAttribute('r');if(ref){const m=/^([A-Za-z]+)(\d+)$/.exec(ref);if(!m||Number(m[2])-1!==rowIndex)error('XLSX_CELL_REF_INVALID');column=col(m[1]);}else column++;
 if(column<0||column>=16384||++cells>300000)error('XLSX_CELL_LIMIT');if(usedColumns.has(column))error('XLSX_DUPLICATE_CELL');usedColumns.add(column);const t=cell.getAttribute('t'),raw=nodes(cell,'v')[0]?.textContent??'',formula=nodes(cell,'f')[0]?.textContent??null;let value=raw;
 if(t==='s'){const i=Number(raw);if(!/^\d+$/.test(raw)||i>=shared.length)error('XLSX_SHARED_STRING_REF');value=shared[i];}else if(t==='inlineStr')value=nodes(cell,'t').map(x=>x.textContent).join('');else if(t==='b'){if(!['0','1'].includes(raw))error('XLSX_BOOLEAN_INVALID');value=raw==='1';}
 values[column]=formula===null?value:{formula,cached:value,evaluated:false};}
 rows.push({row:rowIndex+1,values});}return rows;}
 function relationshipPath(target){
  if(typeof target!=='string'||!target||target.includes('\\')||target.startsWith('//')||/^[A-Za-z][A-Za-z0-9+.-]*:/.test(target))error('XLSX_UNSAFE_RELATIONSHIP');
  const rooted=target.startsWith('/')||target.startsWith('xl/'),parts=rooted?[]:['xl'];
  for(const piece of target.replace(/^\/+/, '').split('/')){if(!piece||piece==='.')continue;if(piece==='..'){if(!parts.length)error('XLSX_UNSAFE_RELATIONSHIP');parts.pop()}else parts.push(piece)}
  if(!parts.length)error('XLSX_UNSAFE_RELATIONSHIP');return parts.join('/');
 }
 async function read(bytes){
  const zip=await unzip(bytes),workbook=zip.get('xl/workbook.xml'),rels=zip.get('xl/_rels/workbook.xml.rels');
  if(!workbook||!rels)error('XLSX_WORKBOOK_METADATA_MISSING');
  const relationships=new Map();for(const rel of nodes(xml(decoder.decode(rels)),'Relationship')){const id=rel.getAttribute('Id');if(!id||relationships.has(id))error('XLSX_RELATIONSHIP_INVALID');relationships.set(id,rel)}
  const ss=zip.get('xl/sharedStrings.xml'),shared=ss?nodes(xml(decoder.decode(ss)),'si').map(n=>nodes(n,'t').map(x=>x.textContent).join('')):[],sheets=[],names=new Set(),paths=new Set();
  for(const sheet of nodes(xml(decoder.decode(workbook)),'sheet')){
   const name=sheet.getAttribute('name'),rid=Array.from(sheet.attributes).find(a=>a.localName==='id')?.value,rel=relationships.get(rid);
   if(!name||names.has(name)||!rel||!String(rel.getAttribute('Type')||'').endsWith('/worksheet'))error('XLSX_SHEET_RELATIONSHIP_INVALID');
   if(String(rel.getAttribute('TargetMode')||'').toLowerCase()==='external')error('XLSX_EXTERNAL_WORKSHEET');
   const path=relationshipPath(rel.getAttribute('Target')),data=zip.get(path);if(!data||paths.has(path))error('XLSX_SHEET_ENTRY_INVALID');names.add(name);paths.add(path);sheets.push({name,path,rows:worksheet(decoder.decode(data),shared)});
  }
  if(!sheets.length)error('XLSX_NO_WORKSHEETS');return {sheets,external_links_followed:false,formulas_evaluated:false,numeric_precision:'strings'};
 }
 globalThis.WBXlsxReader=Object.freeze({read,worksheet,unzip,crc32});
})();
