/* One popup controller. Work alone owns page buttons; native Copy is not a runner. */
'use strict';
const $=id=>document.getElementById(id);
for(const id of WBAIDeliveryCapabilities.implementedTargetIds()){const option=document.createElement('option');option.value=id;option.textContent=WBAIDeliveryCapabilities.targetLabel(id);$('aiMode').append(option);}
let popupContext=null,lastState=null,runtimeOptions={},lastDiagnostics=[],uiBusy=false,notice=null,refreshFlight=null,inspectUrl=null;
const dirty=new Set(),workIds=['workStart','workRefresh','workShowHide','workFinish'];
const formIds=['autoSend','personalData','composerWait','attachmentWait','bootstrapText','autoStartPromptText','reportPrefixEnabled','reportPrefixText','reportPrefixInterval'];
// A lost callback cannot keep the operator controls busy forever. A timeout
// is an acknowledgement failure; this controller never replays the action.
function boundedChannel(start,code){return new Promise(resolve=>{let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);resolve(value)};const timer=setTimeout(()=>finish({ok:false,code:code+'_TIMEOUT',error:'Подтверждение не получено. Проверьте сохранённое состояние; автоматического повтора нет.',automatic_retry:false}),30000);try{start(finish)}catch(e){finish({ok:false,code:code+'_ERROR',error:e.message,automatic_retry:false})}});}
function send(type,payload={}){return boundedChannel(finish=>chrome.runtime.sendMessage({...payload,type},r=>{const e=chrome.runtime.lastError;finish(e?{ok:false,code:'RUNTIME_ERROR',error:e.message}:r||{ok:false,code:'EMPTY_RESPONSE'});}), 'RUNTIME_MESSAGE');}
function tabMessage(id,message){return boundedChannel(finish=>chrome.tabs.sendMessage(id,message,r=>{const e=chrome.runtime.lastError;finish(e?{ok:false,code:'TAB_MESSAGE_ERROR',error:e.message}:r||{ok:false,code:'EMPTY_RESPONSE'});}), 'TAB_MESSAGE');}
function checked(r){if(!r?.ok)throw Object.assign(new Error(r?.error||r?.message||r?.code||'Нет подтверждения операции'),{code:r?.code||'ACTION_FAILED'});return r;}
function status(text,tone=''){notice={text,tone};renderStatus();}
function renderStatus(){
 const w=lastState?.work||{state:'inactive'},m=lastState?.manual_operation,pending=lastState?.pending_start;
 if(!notice&&pending?.phase==='unknown_no_retry')notice={text:'Результат отправки начального текста неизвестен. Повторная отправка заблокирована; завершите сессию перед новым явным запуском.',tone:'error'};
 let value=notice;
 if(!value&&w.state==='error'&&w.error)value={text:`${w.error.code||'WORK_ERROR'}: связь с рабочей сессией требует восстановления.`,tone:'error'};
 if(!value&&lastState?.manual_operation_active&&m?.last_error)value={text:`Ошибка активной операции: ${m.last_error.code||'DELIVERY_ERROR'}`,tone:'error'};
 if(!value)value={text:lastState?.page_context_available===false?'Контекст диалога недоступен. Глобальные настройки остаются доступны.':w.state==='active_visible'?'Рабочая сессия активна. Запуск команды — отдельной кнопкой WB.':w.state==='active_hidden'?'Рабочая сессия активна. Кнопки WB скрыты.':['binding','pending_identity','recovering','finishing'].includes(w.state)?'Ожидается завершение действия рабочей сессии.':'Работа с диалогом не начата.',tone:w.state==='active_visible'?'ok':''};
 $('status').textContent=value.text;$('status').className=('status '+value.tone).trim();
}
async function resolvePopupContext(){
 const query=await boundedChannel(finish=>Promise.resolve(chrome.tabs.query({active:true,currentWindow:true})).then(tabs=>finish({ok:true,tabs}),e=>finish({ok:false,error:e.message})), 'TAB_QUERY');
 if(!query.ok)return {available:false,tab_id:null,error:query.error,code:query.code};
 const [tab]=query.tabs;
 if(!tab?.id)return {available:false,tab_id:null,error:'Нет активной вкладки'};
 const page=await tabMessage(tab.id,{type:'WB_PAGE_CONTEXT'});
 if(!page.ok||!page.identity)return {available:false,tab_id:tab.id,error:page.error||'AI-интерфейс недоступен'};
 const r=await send('WB_RESOLVE_POPUP_CONTEXT',{tab_id:tab.id,identity:page.identity});
 if(!r.ok||!r.context?.conversation_key)return {available:false,tab_id:tab.id,identity:page.identity,error:r.error||'Идентификатор диалога пока не подтверждён'};
 return {available:true,...r.context};
}
function assign(id,value,checkbox=false){if(!dirty.has(id)){if(checkbox)$(id).checked=value===true;else $(id).value=String(value??'');}}
function renderState(state){
 lastState=state;const page=state.page_context_available!==false,bound=page&&state.binding?.bound===true,w=state.work||{state:'inactive'};
 const labels={inactive:'Не активна',pending_identity:'Ожидание диалога',binding:'Подготовка / ожидание подтверждения',active_visible:'Активна — кнопки WB показаны',active_hidden:'Активна — кнопки WB скрыты',recovering:'Восстановление связи',finishing:'Завершение',error:'Ошибка рабочей сессии'};
 const transient=['pending_identity','binding','recovering','finishing'].includes(w.state),active=['active_visible','active_hidden'].includes(w.state);
 $('versionBadge').textContent='v'+(state.version||chrome.runtime.getManifest().version);
 $('workSessionMeta').textContent=`Сессия: ${labels[w.state]||w.state}.`;$('workSessionMeta').dataset.state=w.state;
 $('workAuthorityMeta').textContent=state.manual_operation_active?'Доставка или выполнение выбранной команды ещё продолжается. Повторный запуск заблокирован.':'Кнопками WB управляет только рабочая сессия. Обычный Copy не запускает WB.';
 $('workStart').disabled=uiBusy||!popupContext?.identity?.ai_id||transient||active||state.manual_operation_active===true;
 $('workRefresh').disabled=uiBusy||!page||!bound||!active;
 $('workShowHide').disabled=uiBusy||!page||!bound||!(active||w.state==='inactive'&&state.manual_operation_active!==true);
 $('workShowHide').textContent=w.state==='active_visible'?'Скрыть кнопку':'Показать кнопку';
 $('workFinish').disabled=uiBusy||(!state.pending_start&&(!page||w.state==='inactive'));
 $('bindConversation').disabled=uiBusy||!page||transient||state.manual_operation_active===true;
 $('bindingBanner').className='binding-banner '+(bound?'bound':'unbound');
 $('bindingState').textContent=!page?'Контекст не подтверждён':bound?'Диалог привязан':'Диалог не привязан';
 $('bindingMeta').textContent=!page?popupContext?.error||'Глобальные настройки доступны.':bound?`${popupContext?.identity?.ai_id||'AI'} · ${state.binding.conversation_id}`:'Явная привязка нужна перед передачей данных в этот диалог.';
 $('bindConversation').textContent=bound?'Перепривязать':'Привязать';
 $('providerGate').textContent=state.provider_execution_ready?'Только чтение':'Закрыт';
 const total=Number(state.provider_operation_count||0),enabled=Number(state.provider_enabled_operation_count||0);
 $('providerOperations').textContent=`${enabled} разрешено / ${total} всего`;
 $('providerGateMeta').textContent=`${Math.max(0,total-enabled)} заблокировано в снимке реестра. Это не подтверждение доступа аккаунта.`;
 const metadata=state.provider_metadata;$('metadataStatus').textContent=metadata?'Снимок реестра: '+metadata.registry_sha256.slice(0,12)+'. Актуальность WB требует отдельной проверки. '+(metadata.local_lkg?.last_update?.accepted===false?'Последнее локальное обновление отклонено; сохранена предыдущая проверенная версия.':'Автоматического обновления через API нет.'):'Актуальность WB требует отдельной проверки.';
 $('credentialState').textContent=state.seller_credentials_present?'Токен сохранён локально. Для замены введите новый.':'Токен не сохранён.';
 assign('autoSend',state.auto_send!==false,true);assign('personalData',runtimeOptions.personal_data===true,true);
 assign('composerWait',(runtimeOptions.composer_wait_ms||30000)/1000);assign('attachmentWait',(runtimeOptions.attachment_wait_ms||30000)/1000);assign('bootstrapText',runtimeOptions.bootstrap_text||'');
 if(document.activeElement!==$('aiMode'))$('aiMode').value=runtimeOptions.ai_mode||'auto';
 $('aiMode').disabled=uiBusy||!popupContext?.tab_id;
 assign('autoStartPromptText',state.auto_start_prompt?.text||'');
 $('autoStartPromptMeta').textContent=page?(state.auto_start_prompt?.is_override?'Индивидуальное значение этого диалога.':'Диалог использует общий стартовый текст.'):'Индивидуальные настройки доступны после появления идентификатора диалога.';
 const prefix=state.report_prefix||{};assign('reportPrefixEnabled',prefix.enabled,true);assign('reportPrefixText',prefix.text||'');assign('reportPrefixInterval',prefix.interval||1);$('prefixDelivered').textContent=String(prefix.delivered_count||0);
 for(const id of ['autoStartPromptText','resetAutoStartPrompt','reportPrefixEnabled','reportPrefixText','reportPrefixInterval','pickSend','pickCopy'])$(id).disabled=uiBusy||!page;
 for(const id of ['save','test','refreshState'])$(id).disabled=uiBusy;
 $('sendButtonState').textContent=state.send_button_profile?'Пользовательский ориентир':'Автоматическое распознавание';
 $('copyButtonState').textContent=`${Number(state.copy_button_builtin_adapter_count||2)} встроенных; ${Number(state.copy_button_profile_count||0)} пользовательских`;
 const old=state.last_status;$('apiLastStatus').textContent=old?`Последний сохранённый статус (история, не состояние сессии): ${old.code||'OK'} · ${old.at||'дата не указана'}`:'Сохранённого статуса API нет.';
 renderStatus();
}
async function refresh(){
 if(refreshFlight)return refreshFlight;
 refreshFlight=(async()=>{popupContext=await resolvePopupContext();const c=popupContext;
  const [s,o]=await Promise.all([send(c.available?'WB_GET_SETTINGS_STATE':'WB_GET_GLOBAL_SETTINGS_STATE',c.available?{conversation_key:c.conversation_key}:{page_context_error:c.error}),send('WB_GET_RUNTIME_OPTIONS',c.tab_id?{tab_id:c.tab_id}:{})]);
  checked(s);checked(o);runtimeOptions=o.options||{};
  if(c.tab_id&&c.identity?.ai_id){const p=await send('WB_WORK_PENDING_STATE',{tab_id:c.tab_id});if(p?.ok&&p.pending){s.state={...s.state,pending_start:p.pending_start,work:{...(s.state.work||{}),state:'pending_identity'}};}}
  renderState(s.state);return s.state;
 })();try{return await refreshFlight;}finally{refreshFlight=null;}
}
async function busy(fn){if(uiBusy)return;uiBusy=true;notice=null;if(lastState)renderState(lastState);
 try{await fn();}catch(e){const code=String(e?.code||'ERROR'),message=String(e?.message||e||'').trim();status(message&&message!==code?`${code}: ${message}`:code,'error');}
 finally{uiBusy=false;if(lastState)renderState(lastState);}
}
async function workAction(action){
 const c=popupContext=await resolvePopupContext();if(!c.available&&!(c.identity?.ai_id&&['start','finish'].includes(action)))throw new Error(c.error);
 const r=await send('WB_WORK_ACTION',{action,tab_id:c.tab_id,identity:c.identity});
 if(r.work&&lastState)renderState({...lastState,work:r.work});checked(r);
 await refresh();notice=null;renderStatus();
}
for(const [id,action] of [['workStart','start'],['workRefresh','refresh'],['workShowHide','toggle'],['workFinish','finish']])$(id).addEventListener('click',()=>busy(()=>workAction(action)));
$('refreshState').addEventListener('click',()=>busy(refresh));
for(const id of formIds)for(const event of ['input','change'])$(id).addEventListener(event,()=>dirty.add(id));
async function saveAll(){
 const c=popupContext=await resolvePopupContext(),changed=new Set(dirty);
 const waits=['composerWait','attachmentWait'].map(id=>Number($(id).value)*1000);
 if(waits.some(v=>!Number.isInteger(v)||v<1000||v>120000))throw new Error('Ожидание должно быть от 1 до 120 секунд.');
 const r=checked(await send('WB_SAVE_RUNTIME_OPTIONS',{options:{personal_data:$('personalData').checked,composer_wait_ms:waits[0],attachment_wait_ms:waits[1],bootstrap_text:$('bootstrapText').value}}));runtimeOptions={...runtimeOptions,...r.options,ai_mode:runtimeOptions.ai_mode};
 const common={seller_client_id:$('clientId').value,auto_send:$('autoSend').checked};
 const fields=c.available?{conversation_key:c.conversation_key,report_prefix_enabled:$('reportPrefixEnabled').checked,report_prefix_text:$('reportPrefixText').value,report_prefix_interval:Number($('reportPrefixInterval').value||1)}:{page_context_error:c.error};
 if(c.available&&changed.has('autoStartPromptText'))fields.auto_start_prompt_text=$('autoStartPromptText').value;
 let result;try{result=checked(await send(c.available?'WB_SAVE_SETTINGS':'WB_SAVE_GLOBAL_SETTINGS',{...common,...fields}));}
 catch(e){throw Object.assign(new Error('Настройки доставки сохранены; сохранение остальных полей не подтверждено. '+e.message),{code:e.code});}
 $('clientId').value='';for(const id of changed)if(c.available||!['autoStartPromptText','reportPrefixEnabled','reportPrefixText','reportPrefixInterval'].includes(id))dirty.delete(id);
 renderState(result.state);return result;
}
$('save').addEventListener('click',()=>busy(async()=>{await saveAll();status('Настройки сохранены. Запросов к WB не выполнялось.','ok');}));
$('aiMode').addEventListener('change',()=>{const mode=$('aiMode').value;return busy(async()=>{const c=popupContext=await resolvePopupContext();if(!c.tab_id)throw new Error('Нет активной вкладки');checked(await send('WB_SAVE_RUNTIME_OPTIONS',{tab_id:c.tab_id,options:{ai_mode:mode}}));await refresh();status('Интерфейс этой вкладки обновлён. Запросы не повторялись.','ok');});});
$('bindConversation').addEventListener('click',()=>busy(async()=>{const c=popupContext=await resolvePopupContext();if(!c.available)throw new Error(c.error);checked(await send('WB_BIND_CONVERSATION',{context:{tab_id:c.tab_id,origin:c.identity.origin,conversation_id:c.identity.conversation_id}}));await refresh();status('Текущий диалог привязан.','ok');}));
$('test').addEventListener('click',()=>busy(async()=>{await saveAll();const r=checked(await send('WB_TEST_CONNECTION'));await refresh();status(r.message||'Ответ проверки API получен.','ok');}));
function downloadJson(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('exportCredentials').addEventListener('click',()=>busy(async()=>{const r=checked(await send('WB_EXPORT_CREDENTIALS'));if(!r.backup)throw new Error('Резервная копия не получена');downloadJson('WB-token-backup.json',r.backup);status('Секретный токен экспортирован в локальный файл.','ok');}));
$('chooseCredentialImport').addEventListener('click',()=>$('credentialImportFile').click());
$('credentialImportFile').addEventListener('change',()=>busy(async()=>{try{const file=$('credentialImportFile').files?.[0];if(!file)return;if(file.size>1024*1024)throw new Error('Слишком большой файл токена');const c=popupContext=await resolvePopupContext();checked(await send('WB_IMPORT_CREDENTIALS',{backup:JSON.parse(await file.text()),conversation_key:c.available?c.conversation_key:null,page_context_error:c.error||null}));$('clientId').value='';await refresh();status('Токен импортирован локально. Сетевая проверка не запускалась.','ok');}finally{$('credentialImportFile').value='';}}));
$('clearCredentials').addEventListener('click',()=>busy(async()=>{if(!confirm('Удалить WB token из расширения?'))return;checked(await send('WB_CLEAR_CREDENTIALS'));await refresh();status('Сохранённый токен удалён.','ok');}));
$('resetGlobalPrompt').addEventListener('click',()=>busy(async()=>{checked(await send('WB_RESET_GLOBAL_AUTO_START_PROMPT'));dirty.delete('bootstrapText');await refresh();status('Общий стандарт восстановлен. Индивидуальные тексты сохранены.','ok');}));
$('resetAutoStartPrompt').addEventListener('click',()=>busy(async()=>{const c=popupContext=await resolvePopupContext();if(!c.available)throw new Error(c.error);const r=checked(await send('WB_RESET_AUTO_START_PROMPT',{conversation_key:c.conversation_key}));dirty.delete('autoStartPromptText');renderState(r.state);status('Диалог использует общий стартовый текст.','ok');}));
for(const [id,type] of [['pickSend','WB_START_SEND_BUTTON_PICKER'],['pickCopy','WB_START_COPY_BUTTON_PICKER']])$(id).addEventListener('click',()=>busy(async()=>{const c=popupContext=await resolvePopupContext();if(!c.available)throw new Error(c.error);checked(await tabMessage(c.tab_id,{type}));status('Укажите ориентир в AI-диалоге. Команда WB не запускается.','ok');}));
for(const [id,type] of [['clearSend','WB_CLEAR_SEND_BUTTON_PROFILE'],['clearCopy','WB_CLEAR_COPY_BUTTON_PROFILES']])$(id).addEventListener('click',()=>busy(async()=>{checked(await send(type));await refresh();status('Пользовательская калибровка сброшена.','ok');}));
function renderDiagnostics(){const filter=$('diagnosticsFilter').value,op=lastState?.manual_operation?.operation_id;
 const events=lastDiagnostics.filter(x=>filter==='all'||filter==='errors'?filter==='all'||/(ERROR|FAILED|BLOCKED|TIMEOUT|CONFLICT|REJECTED|MISMATCH|UNKNOWN)/i.test(x.event||x.level||''):filter==='send'?/(COMPOSER|SEND|DELIVERY|RECOVER)/i.test(x.event||''):!x.operation_id||x.operation_id===op);
 $('diagnosticsCount').textContent=String(lastDiagnostics.length);$('diagnosticsMeta').textContent=`Показано ${Math.min(events.length,250)} из ${lastDiagnostics.length}.`;$('diagnostics').textContent=JSON.stringify(events.slice(-250),null,2);
}
let diagnosticsFlight=null;
async function loadDiagnostics(){if(diagnosticsFlight)return diagnosticsFlight;diagnosticsFlight=(async()=>{const r=checked(await send('WB_GET_DIAGNOSTICS'));lastDiagnostics=Array.isArray(r.diagnostics)?r.diagnostics:[];renderDiagnostics()})();try{return await diagnosticsFlight}finally{diagnosticsFlight=null}}
$('diagnosticsFilter').addEventListener('change',renderDiagnostics);
$('loadDiagnostics').addEventListener('click',()=>busy(loadDiagnostics));
$('copyDiagnostics').addEventListener('click',()=>busy(async()=>{await loadDiagnostics();await navigator.clipboard.writeText($('diagnostics').textContent);status('Показанный журнал скопирован.','ok');}));
$('downloadDiagnostics').addEventListener('click',()=>busy(async()=>{await loadDiagnostics();downloadJson('WB-diagnostics.json',{format:'wildberries-bridge-diagnostics',exported_at:new Date().toISOString(),extension_version:chrome.runtime.getManifest().version,events:lastDiagnostics});}));
$('clearDiagnostics').addEventListener('click',()=>busy(async()=>{checked(await send('WB_CLEAR_DIAGNOSTICS'));lastDiagnostics=[];renderDiagnostics();status('Журнал очищен.','ok');}));
$('xlsxInspect').addEventListener('change',()=>busy(async()=>{const file=$('xlsxInspect').files?.[0];if(!file)return;$('xlsxExport').hidden=true;try{if(file.size>32*1024*1024)throw new Error('Файл больше 32 MiB');const data=await WBDocumentReader.read(new Uint8Array(await file.arrayBuffer()),{filename:file.name,contentType:file.type});if(inspectUrl)URL.revokeObjectURL(inspectUrl);inspectUrl=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));$('xlsxExport').href=inspectUrl;$('xlsxExport').download='WB-local-document.json';$('xlsxExport').hidden=false;$('xlsxStatus').textContent=data.format==='pdf'?'PDF: извлечён доступный текст. Это частичное чтение без OCR; исходный файл сохранён.':`Формат: ${data.format}. Строк: ${data.sheets?data.sheets.reduce((n,s)=>n+s.rows.length,0):data.sheet.rows.length}. Формулы не выполнялись.`;}catch(e){$('xlsxStatus').textContent=`Ошибка: ${e.code||e.message}`;throw e;}}));
let quotas=[];function renderQuota(){const q=quotas.filter(x=>Number(x.next_at)>Date.now());$('quotaStatus').textContent=q.length?q.map(x=>`${x.family}: ${Math.ceil((x.next_at-Date.now())/1000)} сек. до нового явного запроса`).join('; '):'Ожидания Retry-After не зарегистрированы. Автоматических повторов нет.';}
async function loadQuota(){const r=checked(await send('WB_GET_QUOTA_STATE'));quotas=r.observations||[];renderQuota();}
refresh().then(()=>Promise.all([loadDiagnostics(),loadQuota()])).catch(e=>status(`${e.code||'ERROR'}: ${e.message}`,'error'));
const workStatusTimer=setInterval(()=>{if(lastState?.pending_start&&!uiBusy)void refresh().catch(()=>null);},1000);
const diagnosticsTimer=setInterval(()=>loadDiagnostics().catch(()=>{}),2000),quotaTimer=setInterval(renderQuota,1000);
window.addEventListener('unload',()=>{clearInterval(diagnosticsTimer);clearInterval(quotaTimer);clearInterval(workStatusTimer);if(inspectUrl)URL.revokeObjectURL(inspectUrl);});
