(() => {
  "use strict";
  const PREFIX="WB_API_V1", RESULT_PREFIX="WB_RESULT_V1", VERSION="0.3.0";
  const registry=globalThis.WBOperations;
  if(!registry) throw new Error("WBOperations must load before WBContract");
  const {HOSTS,OPERATIONS}=registry;
  const FORBIDDEN=new Set(["url","uri","host","hostname","method","headers","authorization","api-key","api_key","apikey","client-id","client_id","clientid","client-secret","client_secret","clientsecret","x-client-secret","token","access-token","access_token","bearer"]);
  const SECRET_KEYS=[/authorization/i,/api[_-]?key/i,/client[_-]?secret/i,/access[_-]?token/i,/^token$/i,/bearer/i];
  const PII_KEYS=[/phone/i,/e-?mail/i,/delivery[_-]?address/i,/^address$/i,/addressee/i,/recipient/i,/customer/i,/buyer/i,/client[_-]?info/i,/passport/i,/first[_-]?name/i,/last[_-]?name/i,/middle[_-]?name/i,/full[_-]?name/i,/^fio$/i,/^user(name)?$/i,/^latitude$/i,/^longitude$/i,/^lat$/i,/^lon$/i];
  function fail(code,message){const e=new Error(message||code);e.code=code;throw e;}
  function normKey(v){return String(v).toLowerCase().replace(/[^a-z0-9_-]/g,"");}
  function isPlain(v){if(!v||typeof v!=="object"||Array.isArray(v))return false; const p=Object.getPrototypeOf(v); return p===null||p===Object.prototype||Object.getPrototypeOf(p)===null;}
  function deepFreeze(v){if(!v||typeof v!=="object"||Object.isFrozen(v))return v;Object.freeze(v);for(const x of Object.values(v))deepFreeze(x);return v;}
  function cloneJson(v,path="params",depth=0,b={keys:0},{rejectTransport=true,maxDepth=16,maxItems=100000,maxKeys=300000}={}){
    if(depth>maxDepth)fail("PARAMS_TOO_DEEP",`${path}: превышена глубина JSON.`);
    if(v===null||typeof v==="boolean"||typeof v==="string")return v;
    if(typeof v==="number"){if(!Number.isFinite(v))fail("INVALID_NUMBER",`${path}: число должно быть конечным.`);return v;}
    if(Array.isArray(v)){if(v.length>maxItems)fail("TOO_MANY_ITEMS",`${path}: слишком много элементов.`);return v.map((x,i)=>cloneJson(x,`${path}[${i}]`,depth+1,b,{rejectTransport,maxDepth,maxItems,maxKeys}));}
    if(!isPlain(v))fail("INVALID_PARAMS_VALUE",`${path}: разрешены только JSON-значения.`);
    const out={};for(const [k,x] of Object.entries(v)){if(["__proto__","prototype","constructor"].includes(k))fail("UNSAFE_JSON_KEY",`${path}: unsafe object key.`);b.keys++;if(b.keys>maxKeys)fail("TOO_MANY_KEYS",`${path}: слишком много JSON-ключей.`);if(rejectTransport&&FORBIDDEN.has(normKey(k)))fail("TRANSPORT_INJECTION_REJECTED",`${path}.${k}: transport/auth поле запрещено.`);out[k]=cloneJson(x,`${path}.${k}`,depth+1,b,{rejectTransport,maxDepth,maxItems,maxKeys});}return out;
  }
  function resolveOperation(name){const m=OPERATIONS[String(name||"")];if(!m)fail("UNSUPPORTED_OPERATION",`Операция ${name||"<empty>"} не разрешена.`);if(m.effect!=="READ")fail("NON_READ_OPERATION_FORBIDDEN",`Операция ${name} не является READ.`);if(m.current!==true)fail("NON_CURRENT_OPERATION",`Операция ${name} не является current.`);if(m.execution_enabled!==true)fail("OPERATION_BLOCKED",`Операция ${name} заблокирована: ${m.blocked_reason||"policy"}.`);if(!/^(GET|POST)$/.test(m.method))fail("INVALID_REGISTRY_METHOD",`${name}: invalid method.`);if(!HOSTS[m.host])fail("INVALID_REGISTRY_HOST",`${name}: invalid host.`);return m;}
  // Public commands are NOT the normalized worker/provider representation.
  // Validate before resolving an alias: an extra transport field must never be ignored.
  function assertPublicCommand(raw) {
    if (!isPlain(raw)) fail("INVALID_JSON_ROOT", "Команда должна быть JSON-объектом.");
    for (const key of Object.keys(raw)) {
      if (key !== "operation" && key !== "params") fail("UNKNOWN_COMMAND_FIELD", "Разрешены только operation и params.");
    }
    if (typeof raw.operation !== "string" || !raw.operation.trim()) fail("MISSING_OPERATION", "Не указано строковое operation.");
    if (!Object.hasOwn(raw, "params") || !isPlain(raw.params)) fail("INVALID_OPERATION_PARAMS", "Обязателен JSON-объект params.");
  }
  function normalizeCommand(raw){
    assertPublicCommand(raw);
    const operation=raw.operation.trim();const meta=resolveOperation(operation);
    const supplied=raw.params===undefined?{}:cloneJson(raw.params,"params",0,{keys:0},{rejectTransport:true}); if(!isPlain(supplied))fail("INVALID_OPERATION_PARAMS","params должен быть JSON-объектом.");
    if (Object.hasOwn(supplied,"path") && !isPlain(supplied.path)) fail("INVALID_PATH_PARAMS", "params.path должен быть объектом.");
    if (Object.hasOwn(supplied,"query") && !isPlain(supplied.query)) fail("INVALID_QUERY_PARAMS", "params.query должен быть объектом.");
    const path=isPlain(supplied.path)?supplied.path:{}; const query=isPlain(supplied.query)?supplied.query:{};
    let body=supplied.body;
    // compatibility: for body-only methods, direct params are accepted when path/query/body wrappers are absent
    if(meta.body_required && body===undefined && !("path" in supplied)&&!("query" in supplied)&&!("body" in supplied)) body=supplied;
    const placeholders=[...String(meta.path).matchAll(/\{([A-Za-z0-9_]+)\}/g)].map(m=>m[1]);
    const pathOut={};for(const k of placeholders){const val=path[k]??supplied[k];if(val===undefined||val===null||String(val).trim()==="")fail("MISSING_PATH_PARAM",`${operation}: не указан path.${k}.`);const text=String(val).trim();if(!/^[A-Za-z0-9._:-]{1,180}$/.test(text))fail("INVALID_PATH_PARAM",`${operation}: ${k} имеет недопустимый формат.`);pathOut[k]=text;}
    const qOut={};for(const [k,v] of Object.entries(query)){if(!meta.query_keys.includes(k))fail("UNSUPPORTED_QUERY_PARAM",`${operation}: query.${k} не разрешён.`);qOut[k]=v;}
    // compatibility: declared query keys may be supplied directly in params
    for(const k of meta.query_keys){if(qOut[k]===undefined && supplied[k]!==undefined && !["path","query","body"].includes(k))qOut[k]=supplied[k];}
    for(const k of meta.required_query_keys){if(qOut[k]===undefined||qOut[k]===null||qOut[k]==="")fail("MISSING_QUERY_PARAM",`${operation}: обязателен query.${k}.`);}
    if(meta.body_required && (body===undefined||body===null))fail("MISSING_BODY",`${operation}: обязателен params.body.`);
    if(body!==undefined) body=cloneJson(body,"params.body",0,{keys:0},{rejectTransport:true});
    return deepFreeze({operation,path:pathOut,query:qOut,body});
  }
  // Internal callers may restore this representation from JSON storage. Re-validate
  // it through the public contract instead of trusting a marker, identity or old worker.
  function checkedCommand(command) {
    if (isPlain(command) && !Object.hasOwn(command,"params") && Object.hasOwn(command,"path") && Object.hasOwn(command,"query")) {
      for (const key of Object.keys(command)) {
        if (!["operation","path","query","body"].includes(key)) fail("UNKNOWN_COMMAND_FIELD", "Недопустимое поле внутренней команды.");
      }
      return normalizeCommand({operation:command.operation, params:{path:command.path, query:command.query, ...(command.body===undefined?{}:{body:command.body})}});
    }
    return normalizeCommand(command);
  }
  function parseCommand(text){let s=String(text||"").trim();if(!s.startsWith(PREFIX))fail("NOT_WB_COMMAND",`Команда должна начинаться с ${PREFIX}.`);s=s.slice(PREFIX.length).trim();if(!s)fail("MISSING_JSON",`После ${PREFIX} нужен JSON.`);let raw;try{raw=JSON.parse(s);}catch(e){fail("INVALID_JSON","Некорректный JSON команды.");}return normalizeCommand(raw);}
  function qs(query){const u=new URLSearchParams();for(const [k,v] of Object.entries(query||{})){if(v===undefined||v===null)continue;if(Array.isArray(v)){for(const x of v)u.append(k,String(x));}else if(isPlain(v))fail("INVALID_QUERY_PARAM",`${k}: query value cannot be object.`);else u.append(k,String(v));}const s=u.toString();return s?`?${s}`:"";}
  function buildRequest(command,headers={}){const c=checkedCommand(command),m=resolveOperation(c.operation);let path=m.path;for(const [k,v] of Object.entries(c.path))path=path.replaceAll(`{${k}}`,encodeURIComponent(v));if(path.includes("{")||path.includes(".."))fail("UNRESOLVED_PATH","Небезопасный или незаполненный path.");const origin=HOSTS[m.host];const url=`${origin}${path}${qs(c.query)}`;const request={url,host_alias:m.host,method:m.method,headers:Object.freeze({...headers}),body:m.method==="POST"&&c.body!==undefined?JSON.stringify(c.body):undefined,response_mode:m.response_mode||"json",privacy:m.privacy||"standard",effect:m.effect};return Object.freeze(request);}
  function redactText(s){return String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,"[REDACTED_EMAIL]").replace(/(?:\+?\d[\d\s().-]{8,}\d)/g,"[REDACTED_PHONE]");}
  function sanitizeNode(v,privacy,depth=0,b={keys:0},maxKeys=300000){if(depth>64)fail("RESULT_DEPTH_EXCEEDED","Результат не обрезан; превышена безопасная глубина.");if(v===null||typeof v==="boolean")return v;if(typeof v==="number")return Number.isFinite(v)?v:null;if(typeof v==="string")return privacy==="customer_safe_v1"?redactText(v):v;if(Array.isArray(v))return v.map(x=>sanitizeNode(x,privacy,depth+1,b,maxKeys));if(!v||typeof v!=="object")return String(v);const out={};const entries=Object.entries(v);for(const [k,x] of entries){if(b.keys>=maxKeys-1){fail("RESULT_KEY_LIMIT","Результат не обрезан; превышено число полей.");}b.keys++;if(SECRET_KEYS.some(r=>r.test(k))||(privacy==="customer_safe_v1"&&PII_KEYS.some(r=>r.test(k))))out[k]="[REDACTED]";else out[k]=sanitizeNode(x,privacy,depth+1,b,maxKeys);}return out;}
  function sanitizeResult(command,raw){const c=checkedCommand(command),m=resolveOperation(c.operation);return sanitizeNode(raw,m.privacy||"standard");}
  function commandFingerprint(command){const s=JSON.stringify(checkedCommand(command));let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,"0");}
  function safeErrorPayload(status,raw,parsed){const src=parsed&&typeof parsed==="object"?sanitizeNode(parsed,"customer_safe_v1"):redactText(String(raw||"").slice(0,12000));return {code:"WB_API_ERROR",message:`Wildberries API вернул HTTP ${Number(status||0)}.`,http_status:Number(status||0),provider_error:src,automatic_retry:false};}
  function safeBridgeErrorPayload(error){return {code:String(error?.code||"WB_BRIDGE_ERROR"),message:redactText(String(error?.message||error||"Bridge error")).slice(0,4000),automatic_retry:false};}
  function formatResultReport({requestId,command,requestMeta,httpStatus,result,elapsedMs,pagination=null,rateLimit=null}){const c=checkedCommand(command);const env={bridge:"wildberries-llm-api-bridge",version:VERSION,request_id:String(requestId||""),operation:c.operation,command:{operation:c.operation,fingerprint:commandFingerprint(c)},request_meta:{provider:"wildberries",host_alias:String(requestMeta?.host_alias||""),http_method:String(requestMeta?.http_method||""),path_alias:String(requestMeta?.path_alias||c.operation)},http_status:Number(httpStatus||0),elapsed_ms:Number(elapsedMs||0),result:sanitizeNode(result,resolveOperation(c.operation).privacy||"standard"),pagination:pagination??{explicit_only:true,hidden_requests:0,automatic_retry:false}};if(rateLimit)env.rate_limit=rateLimit;return `${RESULT_PREFIX}\n${JSON.stringify(env,null,2)}`;}
  function isCommandText(text){return String(text||"").replace(/\u00a0/g," ").trim().startsWith(PREFIX);}
  function preflightExecution(command){const c=checkedCommand(command),m=resolveOperation(c.operation);return Object.freeze({operation:c.operation,effect:m.effect,execution_enabled:true,current:true});}
  const WBContract=Object.freeze({PREFIX,RESULT_PREFIX,VERSION,HOSTS,OPERATIONS,parseCommand,normalizeCommand,resolveOperation,preflightExecution,buildRequest,sanitizeResult,commandFingerprint,safeErrorPayload,safeBridgeErrorPayload,formatResultReport,isCommandText});
  function createWBContract({operations=null,prefix=PREFIX,resultPrefix=RESULT_PREFIX,version=VERSION,sellerApiBase="https://common-api.wildberries.ru"}={}) {
    if(!operations || operations===OPERATIONS) return WBContract;
    const reg=Object.freeze({...operations});
    function ro(name){const operation=String(name||"").trim(),meta=reg[operation];if(!meta)fail("UNSUPPORTED_OPERATION",`Операция ${operation} не разрешена.`);if(meta.effect!=="READ")fail("NON_READ_OPERATION_FORBIDDEN",operation);return {operation,meta};}
    function nc(raw){assertPublicCommand(raw);const {operation,meta}=ro(raw.operation);const params=cloneJson(raw.params===undefined?{}:raw.params,"params",0,{keys:0},{rejectTransport:true});const normalized=typeof meta.normalizeParams==="function"?meta.normalizeParams(params):params;return deepFreeze({operation,params:normalized});}
    function pc(text){const src=String(text||"").trim();if(!src.startsWith(prefix))fail("NOT_WB_COMMAND",`Команда должна начинаться с ${prefix}.`);let raw;try{raw=JSON.parse(src.slice(prefix.length).trim());}catch(e){fail("INVALID_JSON",e.message);}return nc(raw);}
    function pf(command){const c=nc(command),{meta}=ro(c.operation);if(meta.execution_enabled!==true)fail("OPERATION_BLOCKED",c.operation);return {command:c,meta};}
    function br(command,headers={}){const {command:c,meta}=pf(command);const url=`${sellerApiBase}${meta.path}`;return Object.freeze({url,host_alias:"common",method:meta.method,headers:Object.freeze({...headers}),body:meta.method==="POST"?JSON.stringify(c.params):undefined,response_mode:"json",effect:meta.effect});}
    function sr(command,raw){const {meta}=pf(command);return typeof meta.sanitizeResult==="function"?meta.sanitizeResult(raw):raw;}
    function fp(command){const x=JSON.stringify(nc(command));let h=2166136261;for(let i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16).padStart(8,"0");}
    function fr({requestId,command,requestMeta,httpStatus,result,elapsedMs,pagination=null,rateLimit=null}){const c=nc(command);return `${resultPrefix}\n${JSON.stringify({bridge:"wildberries-llm-api-bridge",version,request_id:String(requestId||""),operation:c.operation,command:{operation:c.operation,fingerprint:fp(c)},request_meta:{provider:"wildberries",host_alias:String(requestMeta?.host_alias||"common"),http_method:String(requestMeta?.http_method||""),path_alias:String(requestMeta?.path_alias||c.operation)},http_status:Number(httpStatus||0),elapsed_ms:Number(elapsedMs||0),pagination,rate_limit:rateLimit,result},null,2)}`;}
    return Object.freeze({PREFIX:prefix,RESULT_PREFIX:resultPrefix,VERSION:version,HOSTS,OPERATIONS:reg,parseCommand:pc,normalizeCommand:nc,resolveOperation:(n)=>ro(n),preflightExecution:pf,buildRequest:br,sanitizeResult:sr,commandFingerprint:fp,safeErrorPayload,safeBridgeErrorPayload,formatResultReport:fr,isCommandText:(t)=>String(t||"").trim().startsWith(prefix)});
  }
  globalThis.WBContract=WBContract;
  globalThis.WBContractFactory=Object.freeze({createWBContract,OPERATIONS});
})();
