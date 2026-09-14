/* Local bounded document utilities. PDF operator decoding adapted from the
 * current Ozon donor provider_transport_core.js (e01b051c); no provider URLs,
 * schemas, report aliases or entitlements are imported. */
(() => {
 'use strict';
 const MAX_BYTES=32*1024*1024,MAX_ROWS=100000,MAX_CELLS=300000;
 const fail=code=>{throw Object.assign(new Error(code),{code})};
 async function boundedStream(stream,max){const reader=stream.getReader(),chunks=[];let size=0;for(;;){const x=await reader.read();if(x.done)break;size+=x.value.length;if(size>max){await reader.cancel();fail('DOCUMENT_DECOMPRESSION_LIMIT')}chunks.push(x.value)}const bytes=new Uint8Array(size);let p=0;for(const c of chunks){bytes.set(c,p);p+=c.length}return bytes}
 function delimited(raw,{name='Report',offset=0,limit=MAX_ROWS,delimiter=null}={}){
  if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>MAX_ROWS)fail('DOCUMENT_PAGE_INVALID');
  if(new TextEncoder().encode(raw).length>MAX_BYTES)fail('DOCUMENT_SIZE_LIMIT');const text=String(raw).replace(/^\uFEFF/,'');
  if(delimiter!==null&&![';',',','\t'].includes(delimiter))fail('CSV_DELIMITER_INVALID');
  if(delimiter===null){const counts={';':0,',':0,'\t':0};let quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"')i++;else quoted=!quoted}else if(!quoted){if(c==='\n'||c==='\r')break;if(c in counts)counts[c]++}}delimiter=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0]}
  const rows=[];let row=[],field='',quoted=false,closed=false,cells=0;
  const cell=()=>{if(++cells>MAX_CELLS)fail('DOCUMENT_CELL_LIMIT');row.push(field);field='';closed=false};
  const line=()=>{cell();if(row.some(v=>v!==''))rows.push(row);if(rows.length>MAX_ROWS+1)fail('DOCUMENT_ROW_LIMIT');row=[]};
  for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++}else{quoted=false;closed=true}}else field+=c;continue}
   if(c===delimiter){cell();continue}if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;line();continue}
   if(closed)fail('CSV_TRAILING_QUOTE_DATA');if(c==='"'){if(field)fail('CSV_QUOTE_INVALID');quoted=true}else field+=c;
  }
  if(quoted)fail('CSV_UNCLOSED_QUOTE');if(field||row.length||closed)line();if(!rows.length)return {name,columns:[],rows:[],row_count:0,has_more:false,next_offset:null,numeric_precision:'strings'};
  const header=rows.shift(),width=rows.reduce((n,r)=>Math.max(n,r.length),header.length),used=new Set();
  const columns=Array.from({length:width},(_,i)=>{const base=String(header[i]||'column_'+(i+1));let n=1,key=base;while(used.has(key))key=base+'_'+(++n);used.add(key);return key});
  const page=rows.slice(offset,offset+limit).map(r=>Array.from({length:width},(_,i)=>r[i]??'')),next=Math.min(rows.length,offset+page.length);
  return {name,columns,rows:page,row_count:rows.length,offset,limit,has_more:next<rows.length,next_offset:next<rows.length?next:null,numeric_precision:'strings',formulas_evaluated:false};
 }
  function reportLatin1(bytes) {
    const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    let out = "";
    const chunk = 0x4000;
    for (let i = 0; i < source.length; i += chunk) out += String.fromCharCode(...source.subarray(i, Math.min(source.length, i + chunk)));
    return out;
  }

  function pdfDecodeLiteral(raw) {
    let out = "";
    const text = String(raw || "");
    for (let i = 0; i < text.length; i += 1) {
      if (text[i] !== "\\") { out += text[i]; continue; }
      i += 1;
      if (i >= text.length) break;
      const ch = text[i];
      const mapped = { n:"\n", r:"\r", t:"\t", b:"\b", f:"\f", "(":"(", ")":")", "\\":"\\" }[ch];
      if (mapped !== undefined) { out += mapped; continue; }
      if (/[0-7]/.test(ch)) {
        let oct = ch;
        for (let j = 0; j < 2 && /[0-7]/.test(text[i + 1] || ""); j += 1) { i += 1; oct += text[i]; }
        out += String.fromCharCode(parseInt(oct, 8));
        continue;
      }
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      else if (ch !== "\r" && ch !== "\n") out += ch;
    }
    return out;
  }

  function pdfDecodeHex(raw) {
    let hex = String(raw || "").replace(/\s+/g, "");
    if (hex.length % 2) hex += "0";
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
      let out = "";
      for (let i = 2; i + 1 < bytes.length; i += 2) out += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
      return out;
    }
    return reportLatin1(bytes);
  }

  function pdfExtractTextOperators(content) {
    const text = String(content || "");
    const pieces = [];
    for (const match of text.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj\b/g)) pieces.push(pdfDecodeLiteral(match[1]));
    for (const match of text.matchAll(/<([0-9A-Fa-f\s]+)>\s*Tj\b/g)) pieces.push(pdfDecodeHex(match[1]));
    for (const arrayMatch of text.matchAll(/\[([\s\S]*?)\]\s*TJ\b/g)) {
      let joined = "";
      for (const literal of arrayMatch[1].matchAll(/\(((?:\\.|[^\\)])*)\)/g)) joined += pdfDecodeLiteral(literal[1]);
      for (const hex of arrayMatch[1].matchAll(/<([0-9A-Fa-f\s]+)>/g)) joined += pdfDecodeHex(hex[1]);
      if (joined) pieces.push(joined);
    }
    return pieces.map((value) => String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]+/g, " ").trim()).filter(Boolean);
  }

  async function parsePdfDocumentBytes(bytes, { maxTextChars = 30000 } = {}) {
    if(!Number.isSafeInteger(maxTextChars)||maxTextChars<1||maxTextChars>30000)fail("PDF_TEXT_LIMIT_INVALID");
    const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
    if(source.length>MAX_BYTES)fail("DOCUMENT_SIZE_LIMIT"); if(!new TextDecoder().decode(source.slice(0,8)).startsWith("%PDF-"))fail("PDF_HEADER_INVALID");
    const latin = reportLatin1(source);
    const pieces = []; let extractedBytes=0,streamCount=0;
    const streamPattern = /<<([\s\S]{0,4096}?)>>\s*stream\r?\n/g;
    let match;
    while ((match = streamPattern.exec(latin)) !== null) {
      if(++streamCount>2000)fail("PDF_STREAM_LIMIT");
      const dataStart = streamPattern.lastIndex;
      const end = latin.indexOf("endstream", dataStart);
      if (end < 0) break;
      let dataEnd = end;
      while (dataEnd > dataStart && (latin[dataEnd - 1] === "\r" || latin[dataEnd - 1] === "\n")) dataEnd -= 1;
      if (/\/FlateDecode\b/.test(match[1])) {
        try {
          if (typeof DecompressionStream !== "function") fail("PDF_DEFLATE_UNAVAILABLE", "Runtime не поддерживает PDF FlateDecode.");
          const compressed = source.slice(dataStart, dataEnd);
          const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate"));
          const inflated = await boundedStream(stream,MAX_BYTES-extractedBytes); extractedBytes+=inflated.length;
          pieces.push(...pdfExtractTextOperators(reportLatin1(inflated)));
        } catch (error) {
          if(error.code==="DOCUMENT_DECOMPRESSION_LIMIT")throw error;
          // Some PDFs use predictors/font encodings; fail-soft on text extraction while preserving document metadata.
        }
      } else pieces.push(...pdfExtractTextOperators(latin.slice(dataStart, dataEnd)));
      streamPattern.lastIndex = end + 9;
    }
    const unique = [];
    const seen = new Set();
    for (const piece of pieces) {
      const normalized = piece.replace(/\s+/g, " ").trim();
      if (normalized && !seen.has(normalized)) { seen.add(normalized); unique.push(normalized); }
    }
    const joined = unique.join("\n");
    return Object.freeze({
      format: "pdf",
      text_extract_available: Boolean(joined),
      text_extract: joined.slice(0, maxTextChars),
      text_truncated: joined.length > maxTextChars, extraction_complete:false, extraction_scope:"limited_text_operators_no_OCR_no_font_mapping", original_file_preserved:true, external_links_followed:false, scripts_executed:false
    });
  }


 async function read(input,{filename='',contentType='',entry=null,...options}={}){
  const bytes=input instanceof Uint8Array?input:new Uint8Array(input);if(bytes.length>MAX_BYTES)fail('DOCUMENT_SIZE_LIMIT');const lower=filename.toLowerCase(),ct=contentType.split(';')[0].toLowerCase();
  const zip=bytes.length>=4&&bytes[0]===80&&bytes[1]===75&&bytes[2]===3&&bytes[3]===4;
  if(lower.endsWith('.xlsx')||ct==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')return {format:'xlsx',...await WBXlsxReader.read(bytes)};
  if(zip||lower.endsWith('.zip')||ct==='application/zip'){
   const entries=await WBXlsxReader.unzip(bytes);if(entries.has('xl/workbook.xml'))return {format:'xlsx',...await WBXlsxReader.read(bytes)};
   const names=[...entries.keys()].filter(n=>/\.(csv|txt)$/i.test(n));if(!names.length)fail('DOCUMENT_ZIP_UNSUPPORTED');if(entry&&!names.includes(entry))fail('DOCUMENT_ENTRY_NOT_FOUND');const selected=entry||names[0];return {format:'zip_csv',available_entries:names,selected_entry:selected,sheet:delimited(new TextDecoder('utf-8',{fatal:true}).decode(entries.get(selected)),{...options,name:selected}),automatic_continuation:false};
  }
  if(lower.endsWith('.pdf')||ct==='application/pdf')return parsePdfDocumentBytes(bytes,options);
  if(/\.(csv|txt|tsv)$/i.test(lower)||['text/csv','application/csv','text/plain','text/tab-separated-values'].includes(ct))return {format:'csv',sheet:delimited(new TextDecoder('utf-8',{fatal:true}).decode(bytes),{...options,...(lower.endsWith('.tsv')?{delimiter:'\t'}:{}),name:filename||'Report'})};
  fail('DOCUMENT_FORMAT_UNSUPPORTED');
 }
 globalThis.WBDocumentReader=Object.freeze({read,delimited,parsePdfDocumentBytes,MAX_BYTES});
})();
