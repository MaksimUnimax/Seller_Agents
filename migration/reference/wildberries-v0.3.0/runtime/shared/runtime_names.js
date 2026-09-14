(() => {
  "use strict";
  const RUNTIME = Object.freeze({
    version: "0.3.0",
    commandPrefix: "WB_API_V1",
    resultPrefix: "WB_RESULT_V1",
    messagePrefix: "WB_",
    runtimeKey: "__WB_LLM_API_BRIDGE_RUNTIME__",
    stageAttr: "data-wb-bridge-stage",
    stageDeliveryAttr: "data-wb-bridge-delivery"
  });
  const STORAGE_KEYS = Object.freeze({
    SELLER_TOKEN: "wbmb_seller_token",
    SELLER_CLIENT_ID: "wbmb_seller_token",
    SELLER_API_KEY: "wbmb_seller_client_secret",
    SELLER_TOKEN_TYPE: "wbmb_seller_token_type",
    SELLER_CLIENT_SECRET: "wbmb_seller_client_secret",
    AUTO_SEND: "wbmb_auto_send",
    CONVERSATION_BINDINGS: "wbmb_conversation_bindings",
    MANUAL_MODES: "wbmb_manual_modes",
    MANUAL_OPERATIONS: "wbmb_manual_operations",
    AUTO_RUNS: "wbmb_auto_runs",
    REPORT_PREFIXES: "wbmb_report_prefix_configs",
    AUTO_START_PROMPTS: "wbmb_auto_start_prompts",
    GLOBAL_AUTO_START_PROMPT: "wbmb_global_auto_start_prompt",
    SEND_BUTTON_PROFILE: "wbmb_send_button_profile",
    COPY_BUTTON_PROFILES: "wbmb_copy_button_profiles",
    DIAGNOSTICS: "wbmb_diagnostics",
    DIAGNOSTIC_SEQ: "wbmb_diagnostic_sequence",
    LAST_STATUS: "wbmb_last_status"
  });
  const PREVIOUS_AUTO_START_TEXT = [
    "ЭТО НАЧАЛО АВТОМАТИЧЕСКОЙ READ-ONLY РАБОТЫ WILDBERRIES BRIDGE.",
    "Продолжай текущую Wildberries-задачу по активному factual-data плану этого диалога.",
    "",
    "СПЕЦИАЛЬНЫЕ БЛОКИ РАЗРЕШЕНЫ ТОЛЬКО ДЛЯ РОВНО ОДНОЙ ИСПОЛНЯЕМОЙ КОМАНДЫ WB_API_V1.",
    "Один WB_API_V1 = не более одного внешнего Wildberries API request. Никаких скрытых retry, pagination-loop, polling или fan-out.",
    "Следующая страница, status/download async report или explicit report retry всегда требуют отдельной WB_API_V1 команды.",
    "При HTTP 429/4xx/5xx или result.error не повторяй тот же запрос автоматически.",
    "Не передавай url, host, HTTP method, headers, Authorization, token или X-Client-Secret: выбирай только operation из production allowlist и params.",
    "Bridge разрешает только проверенные READ/read-derived aliases; mutation/UNKNOWN и direct customer-PII surfaces недоступны.",
    "После WB_RESULT_V1 обработай evidence и продолжи следующий необходимый read-only шаг.",
    "Когда сбор завершён и следующий WB API вызов не нужен, ответь только: сбор закончен."
  ].join("\\n");
  const LEGACY_WORK_START_TEXT = [
    "ЭТО НАЧАЛО READ-ONLY РАБОТЫ WILDBERRIES BRIDGE.",
    "Продолжай текущую задачу по подтверждённым данным этого диалога.",
    "WB_API_V1 + JSON с operation и params — одна явная API-команда; максимум один запрос WB.",
    "Несколько независимых команд можно дать в одном ответе: они выполняются последовательно в исходном порядке.",
    "Markdown и кнопка Copy не определяют количество команд. Manual читает выбранный блок; Autorun — завершённый ответ ассистента.",
    "WB_HELP_V1 с operation=catalog и params={} показывает локальный каталог; describe с params.alias показывает операцию. HELP не вызывает WB.",
    "HELP и API можно смешивать. Каталог отражает сохранённый registry, а не проверку прав реального токена.",
    "Зависимые запросы делай после получения результата: cursor, task ID и другие значения не подставляются автоматически.",
    "Не задавай URL, method, headers, Authorization или token. Только разрешённые operation и params.",
    "Нет скрытых retry, pagination, polling или fan-out. После ошибки API остаток пакета не выполняется; автоматический повтор запрещён.",
    "При interrupted/unknown используй сохранённый отчёт; не повторяй запрос с неопределённым исходом.",
    "Когда сбор завершён, ответь: сбор закончен."
  ].join("\n");
  const DEFAULT_AUTO_START_TEXT=LEGACY_WORK_START_TEXT.replace("Markdown и кнопка Copy не определяют количество команд. Manual читает выбранный блок; Autorun — завершённый ответ ассистента.","Кнопка WB выполняет команды из выбранного блока. Markdown и кнопка Copy не определяют количество команд.");
  const AUTORUN_PRODUCTION_ENABLED=false;
  globalThis.WBRuntime = Object.freeze({ RUNTIME, STORAGE_KEYS, DEFAULT_AUTO_START_TEXT, PREVIOUS_AUTO_START_TEXT, LEGACY_WORK_START_TEXT, AUTORUN_PRODUCTION_ENABLED });
})();
