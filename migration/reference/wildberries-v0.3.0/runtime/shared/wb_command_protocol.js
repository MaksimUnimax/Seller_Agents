/* Ordered command envelopes + local registry guidance. No network or credentials.
 * Balanced-object scanning adapted from the pinned Ozon command contract.
 * WB adaptation: strict API params, ordered local per-entry failures; C09 late mixed authority.
 */
(() => {
  'use strict';
  const C = globalThis.WBContract;
  if (!C) throw new Error('WBContract must load before WBCommandProtocol');
  const MAX_COMMANDS = 32, MAX_SOURCE_CHARS = 262144;
  const localCodes = new Set(['UNSUPPORTED_OPERATION','OPERATION_BLOCKED','NON_READ_OPERATION_FORBIDDEN','NON_CURRENT_OPERATION']);
  const forbidden = new Set(['url','uri','host','hostname','method','headers','authorization','apikey','clientid','clientsecret','xclientsecret','token','accesstoken','bearer','__proto__','prototype','constructor']);
  const plain = v => !!v && typeof v === 'object' && !Array.isArray(v) && Object.prototype.toString.call(v) === '[object Object]';
  const fail = code => { throw Object.assign(new Error(`WB command admission: ${code}.`), {code}); };
  const freeze = v => { if (v && typeof v === 'object' && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; };
  function guard(v, depth = 0, budget = {keys:0}) {
    if (depth > 16) fail('PARAMS_TOO_DEEP');
    if (v === null || ['boolean','string'].includes(typeof v)) return;
    if (typeof v === 'number' && Number.isFinite(v)) return;
    if (Array.isArray(v)) { if (v.length > 100000) fail('TOO_MANY_ITEMS'); v.forEach(x=>guard(x,depth+1,budget)); return; }
    if (!plain(v)) fail('INVALID_PARAMS_VALUE');
    for (const [key,x] of Object.entries(v)) {
      if (++budget.keys > 100000) fail('TOO_MANY_KEYS');
      if (forbidden.has(key.toLowerCase().replace(/[^a-z0-9]/g,'')) || ['__proto__','prototype','constructor'].includes(key)) fail('TRANSPORT_INJECTION_REJECTED');
      guard(x,depth+1,budget);
    }
  }
  function balancedEnd(source, start) {
    let depth=0, quoted=false, escaped=false;
    for (let i=start;i<source.length;i++) {
      const ch=source[i];
      if (quoted) { if (escaped) escaped=false; else if (ch==='\\') escaped=true; else if (ch==='"') quoted=false; continue; }
      if (ch==='"') quoted=true;
      else if (ch==='{') depth++;
      else if (ch==='}' && --depth===0) return i+1;
    }
    fail('INVALID_JSON');
  }
  function marker(source,start) {
    const re=/WB_(?:API_V1|FILE_V1|HELP_V[12])(?![A-Za-z0-9_])/g; re.lastIndex=start;
    for (let m;(m=re.exec(source));) if (!/[A-Za-z0-9_]/.test(source[m.index-1] || '')) return m;
    return null;
  }
  function hasCommands(text) { return !!marker(String(text || ''),0); }
  function helpCommand(raw) {
    const allowed=raw.operation==='catalog'?['family','offset','limit']:raw.operation==='describe'?['alias']:null;
    if (!allowed) fail('HELP_UNSUPPORTED_OPERATION');
    if (Object.keys(raw.params).some(k=>!allowed.includes(k))) fail('HELP_UNKNOWN_PARAM');
    const p=raw.params;
    if (raw.operation==='describe') {
      if (typeof p.alias!=='string' || !/^[a-z0-9_]{1,120}$/.test(p.alias)) fail('HELP_INVALID_ALIAS');
      return {operation:raw.operation,params:{alias:p.alias}};
    }
    if (p.family!==undefined && (typeof p.family!=='string' || !Object.hasOwn(C.HOSTS,p.family))) fail('HELP_UNKNOWN_FAMILY');
    const offset=p.offset??0, limit=p.limit??25;
    if (!Number.isSafeInteger(offset) || offset<0 || !Number.isSafeInteger(limit) || limit<1 || limit>50) fail('HELP_INVALID_PAGE');
    return {operation:'catalog',params:{...(p.family===undefined?{}:{family:p.family}),offset,limit}};
  }
  function fingerprint(value) {
    let h=2166136261;const s=JSON.stringify(value);
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return (h>>>0).toString(16).padStart(8,'0');
  }
  function parse(text) {
    const source=String(text||'');
    if(source.length>MAX_SOURCE_CHARS)fail('COMMAND_SOURCE_TOO_LARGE');
    const rows=WBMixedBatchDiscovery.discover(source,{
      commandPrefix:'WB_API_V1',helpPrefixV1:'WB_HELP_V1',helpPrefixV2:'WB_HELP_V2',
      additionalCommandPrefixes:['WB_FILE_V1'],
      apiDiscover:commandText=>{let attemptedAlias=null;try{
        if(commandText.startsWith('WB_FILE_V1'))return [{ok:true,marker_index:0,local_file:true,operation:'bridge_file_get',command:WBDeliveryPolicy.parseLocal(commandText),command_text:commandText}];
        const start=commandText.indexOf('{');if(start<0)fail('MISSING_JSON');
        let raw;try{raw=JSON.parse(commandText.slice(start));}catch(_){fail('INVALID_JSON');}
        if(!plain(raw))fail('INVALID_JSON_ROOT');
        if(Object.keys(raw).some(k=>k!=='operation'&&k!=='params'))fail('UNKNOWN_COMMAND_FIELD');
        if(typeof raw.operation!=='string'||!/^[a-z0-9_]{1,120}$/.test(raw.operation))fail('INVALID_OPERATION');
        attemptedAlias=Object.hasOwn(C.OPERATIONS,raw.operation)?raw.operation:null;
        if(!plain(raw.params))fail('INVALID_OPERATION_PARAMS');guard(raw.params);
        const command=C.parseCommand(commandText);C.preflightExecution(command);C.buildRequest(command);
        return [{ok:true,marker_index:0,command,command_text:commandText,operation:command.operation}];
      }catch(e){return [{ok:false,marker_index:0,code:e.code||'INVALID_JSON',parameter_guidance:attemptedAlias?WBParameterGuidance.correction(attemptedAlias,e.code):null}]}},
      parseHelp:commandText=>{try{
        const start=commandText.indexOf('{');let raw;
        try{raw=JSON.parse(commandText.slice(start));}catch(_){fail('HELP_INVALID_JSON');}
        if(commandText.startsWith('WB_HELP_V1')&&plain(raw)&&Object.hasOwn(raw,'operation')){
          if(Object.keys(raw).some(k=>k!=='operation'&&k!=='params')||!plain(raw.params))fail('HELP_UNKNOWN_FIELD');guard(raw.params);
          return {ok:true,legacy:true,command:helpCommand(raw)};
        }
        return WBGuidance.parseHelp(commandText);
      }catch(e){return {ok:false,code:e.code||'HELP_INVALID_JSON'}}}
    });
    if(rows.length>MAX_COMMANDS)fail('TOO_MANY_COMMANDS');
    if(!rows.length)fail('NO_COMMAND_ENVELOPES');
    const entries=rows.map((r,index)=>{
      const d=r.kind==='api'?r.discovery:r.help;
      const command=r.kind==='api'?d.command:d.legacy?d.command:{operation:'guidance',params:{cluster:d.cluster,section:d.section,version:d.version},guided:true};
      return {index,kind:d.local_file?'file':r.kind,operation:d.ok?(r.kind==='api'?d.operation:command.operation):null,command:d.ok?command:null,command_text:r.kind==='api'?d.command_text:r.command_text,code:d.ok?null:d.code,guidance:d.parameter_guidance||null,marker_index:r.marker_index};
    });
    const single=entries.length===1&&entries[0].kind==='api'&&!entries[0].code;
    return freeze({entries,operation:entries.length===1?entries[0].operation:`batch:${entries.length}`,fingerprint:single?C.commandFingerprint(entries[0].command):fingerprint(entries.map(e=>[e.kind,e.operation,e.command||e.code]))});
  }
  function card(alias) {
    const m=C.OPERATIONS[alias];
    if(!m || !Object.hasOwn(C.OPERATIONS,alias))return {operation:alias,known:false,execution_enabled:false};
    const pathParams=[...m.path.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map(x=>x[1]);
    const enabled=m.execution_enabled===true && m.effect==='READ' && m.current===true;
    const runnable=enabled && !m.body_required && !m.required_query_keys.length && !pathParams.length;
    return {...WBParameterGuidance.describe(alias),operation:alias,known:true,family:m.host,category:m.category,method:m.method,path:m.path,effect:m.effect,current_in_snapshot:m.current===true,execution_enabled:enabled,blocked_reason:m.blocked_reason||null,privacy:m.privacy,read_kind:m.read_kind,response_mode:m.response_mode,required_path:pathParams,query_keys:[...m.query_keys],required_query:[...m.required_query_keys],body_required:m.body_required,template:runnable?{operation:alias,params:{}}:null,template_runnable:runnable,account_access:'UNVERIFIED_REAL_ACCOUNT'};
  }
  function guidance(command) {
    if(command?.guided){const p=command.params;return WBGuidance.result({status:'operations',cluster:p.cluster,section:p.section,version:p.version});}
    const c=helpCommand(command);const all=Object.keys(C.OPERATIONS).sort();
    const enabled=all.filter(a=>card(a).execution_enabled).length;
    const common={local:true,physical_request_count:0,registry_total:all.length,registry_enabled:enabled,registry_disabled:all.length-enabled,authority:'PACKAGED_WB_REGISTRY_SNAPSHOT_NOT_LIVE_ACCOUNT_PROOF',no_hidden_calls:true};
    if(c.operation==='describe')return {...common,operation_card:card(c.params.alias)};
    const {family,offset,limit}=c.params;const selected=all.filter(a=>!family || C.OPERATIONS[a].host===family);
    const families=[...new Set(all.map(a=>C.OPERATIONS[a].host))].sort();
    const operations=selected.slice(offset,offset+limit).map(card);
    return {...common,families,total: selected.length,offset,limit,operations,next_offset:offset+operations.length<selected.length?offset+operations.length:null};
  }
  // Local failures contain no raw source/params, credentials or provider URLs.
  function safeLocalError(error, stage='command_discovery') {
    const code=/^[A-Z0-9_]{1,100}$/.test(error?.code||'')?error.code:'PRE_EXECUTION_ERROR';
    const stages=new Set(['command_discovery','work_session_gate','manual_gate','guidance_discovery','provider_admission']);
    const messages={
      MIXED_HELP_AND_API:'HELP и API нельзя смешивать. Отправьте новый отдельный запрос; WB не вызывался.',
      WORK_SESSION_NOT_VISIBLE:'Рабочая сессия не активна или кнопка скрыта. Включите работу и отправьте новую явную команду.',
      MANUAL_MODE_OFF:'Кнопка WB выключена. Включите её через рабочую сессию и отправьте новую явную команду.',
      AUTO_MODE_ACTIVE:'Другой канал выполнения активен. Запрос WB не выполнялся.',
      PERSONAL_DATA_DISABLED:'Разрешение личных данных выключено. Включение не повторяет запрос: нужна новая явная команда.',
      QUOTA_WAIT_NEW_EXPLICIT_COMMAND_REQUIRED:'Лимит пока не разрешает новый запрос. После указанного срока нужна новая явная команда.',
      OPERATION_BLOCKED:'Операция заблокирована в этой сборке. Запрос WB не выполнялся.',
      UNSUPPORTED_OPERATION:'Неизвестная операция. Используйте локальную справку для выбора разрешённой операции.'
    };
    return {code,stage:stages.has(stage)?stage:'command_discovery',message:messages[code]||('Команда отклонена локально: '+code+'. WB не вызывался.'),automatic_retry:false};
  }
  function localFailure(error,source,stage='command_discovery') {
    const safe=safeLocalError(error,stage),text=String(source||'');
    return freeze({local_only:true,operation:'pre_execution_error',fingerprint:fingerprint([text.slice(0,MAX_SOURCE_CHARS),text.length,safe.code]),entries:[{index:0,kind:'api',operation:null,command:null,code:safe.code,error:safe}]});
  }
  function parseOrError(source) {
    try { return parse(source); }
    catch(error) { return localFailure(error,source,error?.code==='MIXED_HELP_AND_API'?'guidance_discovery':'command_discovery'); }
  }
  globalThis.WBCommandProtocol=Object.freeze({MAX_COMMANDS,MAX_SOURCE_CHARS,parse,parseOrError,localFailure,safeLocalError,hasCommands,guidance,card});
})();
