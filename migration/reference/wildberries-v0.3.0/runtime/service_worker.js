/* global BB2ConversationIdentity, BB2ManualControls, WBRuntime, WBCredentials, WBContract, BridgeAutorunModel, ProviderTransportCore, WBProvider */
importScripts("shared/ai_delivery_capabilities.js", "shared/conversation_identity.js", "shared/runtime_names.js", "shared/manual_controls.js", "shared/wb_credentials.js", "shared/wb_operations.js", "shared/wb_contract.js", "shared/parameter_guidance.js", "shared/mixed_batch_discovery.js", "shared/wb_guidance_registry.js", "shared/wb_guidance.js", "shared/delivery_policy.js", "shared/wb_command_protocol.js", "shared/wb_batch_runtime.js", "shared/bridge_autorun_model.js", "shared/provider_transport_core.js", "shared/response_verifier.js", "shared/wb_provider.js");
importScripts("shared/work_session_model.js", "shared/runtime_policy.js", "shared/entitlement_policy.js", "shared/query_planner.js", "shared/artifact_store.js", "shared/runtime_worker.js", "shared/work_start_worker.js", "shared/work_recovery_worker.js", "shared/delivery_transaction_worker.js");

const VERSION = "0.3.0";
const CREDENTIAL_BACKUP_FORMAT = "wildberries-bridge-seller-credentials-backup";
const CREDENTIAL_BACKUP_VERSION = 2;
const KEYS = WBRuntime.STORAGE_KEYS;
const MAX_DIAGNOSTICS = 1500;
const WORKER_SESSION_ID = `worker-${crypto.randomUUID()}`;
const DEFAULT_AUTO_START_TEXT = WBRuntime.DEFAULT_AUTO_START_TEXT;

let bindingWriteLock = Promise.resolve();
let autoRunsWriteLock = Promise.resolve();
let manualOperationsWriteLock = Promise.resolve();
let prefixWriteLock = Promise.resolve();
let startPromptWriteLock = Promise.resolve();
let migrationWriteLock = Promise.resolve();
let diagnosticsWriteLock = Promise.resolve();
let copyProfilesWriteLock = Promise.resolve();

// Reference-parity single-flight: one worker-owned browser delivery attempt per run.
// This is deliberately the same primitive used by Business Bridge 2.0.0.22.
const deliveryAttemptRequests = new Map();
function singleFlight(map, key, fn) {
  if (map.has(key)) return map.get(key);
  const request = Promise.resolve().then(fn).finally(() => {
    if (map.get(key) === request) map.delete(key);
  });
  map.set(key, request);
  return request;
}

function storageGet(keys) { return chrome.storage.local.get(keys); }
function storageSet(values) { return chrome.storage.local.set(values); }
function storageRemove(keys) { return chrome.storage.local.remove(keys); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function withDiagnosticsWrite(fn) {
  const next = diagnosticsWriteLock.then(fn, fn);
  diagnosticsWriteLock = next.catch(() => null);
  return next;
}

function withCopyProfilesWrite(fn) {
  const next = copyProfilesWriteLock.then(fn, fn);
  copyProfilesWriteLock = next.catch(() => null);
  return next;
}

function copyProfileCollection(raw) {
  return BB2ManualControls.normalizeCopyButtonProfileCollection(raw);
}

async function getCopyButtonProfiles() {
  const data = await storageGet(KEYS.COPY_BUTTON_PROFILES);
  return copyProfileCollection(data[KEYS.COPY_BUTTON_PROFILES] || null);
}

async function broadcastCopyButtonProfiles(collection) {
  const normalized = copyProfileCollection(collection);
  const tabs = await chrome.tabs.query({ url: WBAIDeliveryCapabilities.implementedContentScriptPatterns() }).catch(() => []);
  await Promise.all(tabs.map((tab) => tab.id ? tabMessage(tab.id, { type: "WB_SET_COPY_BUTTON_PROFILES", profiles: normalized }).catch(() => null) : null));
  return normalized;
}

async function saveCopyButtonProfile(profile) {
  const normalized = BB2ManualControls.normalizeCopyButtonProfile(profile);
  if (!normalized) throw Object.assign(new Error("Invalid Copy button profile."), { code: "INVALID_COPY_BUTTON_PROFILE" });
  return withCopyProfilesWrite(async () => {
    const current = await getCopyButtonProfiles();
    const key = BB2ManualControls.copyButtonProfileKey(normalized);
    const currentKeys = new Set(current.profiles.map(BB2ManualControls.copyButtonProfileKey));
    const profiles = currentKeys.has(key) ? current.profiles : [...current.profiles, normalized];
    if (profiles.length > BB2ManualControls.MAX_CUSTOM_COPY_BUTTON_PROFILES) {
      throw Object.assign(new Error(`Достигнут безопасный предел ${BB2ManualControls.MAX_CUSTOM_COPY_BUTTON_PROFILES} пользовательских Copy-профилей.`), { code: "COPY_PROFILE_LIMIT" });
    }
    const merged = copyProfileCollection({ kind: "bb2_manual_copy_profiles_v2", profiles });
    await storageSet({ [KEYS.COPY_BUTTON_PROFILES]: merged });
    await broadcastCopyButtonProfiles(merged);
    return merged;
  });
}

async function clearCopyButtonProfiles() {
  return withCopyProfilesWrite(async () => {
    const empty = copyProfileCollection(null);
    await storageSet({ [KEYS.COPY_BUTTON_PROFILES]: empty });
    await broadcastCopyButtonProfiles(empty);
    return empty;
  });
}

function sanitizeDiagnosticValue(value, key = "", depth = 0, secrets = []) {
  const lower = String(key || "").toLowerCase();
  if (["token", "authorization", "api_key", "api-key", "client_id", "client-id", "clientid", "prompt_text", "report_text", "outgoing_text", "body", "credential"].includes(lower) || lower.includes("token") || lower.includes("secret") || lower.includes("api_key") || lower.includes("api-key") || lower.includes("client_id") || lower.includes("client-id") || lower.includes("clientid")) {
    return undefined;
  }
  if (depth > 4) return "[depth-limited]";
  if (typeof value === "string") { for (const secret of secrets) if (secret) value = value.split(secret).join("[redacted]"); return value.length > 500 ? `${value.slice(0, 500)}…` : value; }
  if (value === null || ["number", "boolean"].includes(typeof value)) return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => sanitizeDiagnosticValue(item, "", depth + 1, secrets)).filter((item) => item !== undefined);
  if (typeof value === "object") {
    const result = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      const safe = sanitizeDiagnosticValue(childValue, childKey, depth + 1, secrets);
      if (safe !== undefined) result[childKey] = safe;
    }
    return result;
  }
  return String(value);
}

function safeDiagnosticDetails(details = {}, secrets = []) {
  return sanitizeDiagnosticValue(details, "", 0, secrets) || {};
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(String(value || ""));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function canonicalBackupValue(value) {
  if (Array.isArray(value)) return value.map(canonicalBackupValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalBackupValue(value[key])]));
  }
  return value;
}

async function exportSellerCredentialsBackup() {
  const settings = await getSettings();
  const credentials = WBCredentials.normalizeSellerCredentials(settings.sellerCredentials, { required: true });
  const payload = {
    seller_token: credentials.token,
    seller_token_type: "personal"
  };
  return {
    format: CREDENTIAL_BACKUP_FORMAT,
    backup_version: CREDENTIAL_BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    extension_version: VERSION,
    extension_id: chrome.runtime.id || null,
    contains_secrets: true,
    credentials_sha256: await sha256Hex(JSON.stringify(canonicalBackupValue(payload))),
    credentials: payload
  };
}

async function importSellerCredentialsBackup(backup) {
  const backupVersion = Number(backup?.backup_version || 0);
  if (!backup || backup.format !== CREDENTIAL_BACKUP_FORMAT || ![1, CREDENTIAL_BACKUP_VERSION].includes(backupVersion)) {
    throw Object.assign(new Error("Это не поддерживаемый backup Wildberries Bridge credentials."), { code: "INVALID_CREDENTIAL_BACKUP" });
  }
  if (backup.contains_secrets !== true) {
    throw Object.assign(new Error("Backup credentials не помечен как secret-bearing."), { code: "INVALID_CREDENTIAL_BACKUP" });
  }
  const incoming = backup.credentials;
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
    throw Object.assign(new Error("Backup не содержит credentials object."), { code: "INVALID_CREDENTIAL_BACKUP" });
  }
  const expectedHash = String(backup.credentials_sha256 || "").toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(expectedHash)) {
    throw Object.assign(new Error("Backup не содержит корректную SHA-256 checksum."), { code: "INVALID_CREDENTIAL_BACKUP_CHECKSUM" });
  }
  const actualHash = await sha256Hex(JSON.stringify(canonicalBackupValue(incoming)));
  if (actualHash !== expectedHash) {
    throw Object.assign(new Error("Контрольная сумма backup credentials не совпала."), { code: "CREDENTIAL_BACKUP_CHECKSUM_MISMATCH" });
  }
  const credentials = WBCredentials.normalizeSellerCredentials({
    token: incoming.seller_token,
    tokenType: incoming.seller_token_type || "personal",
    clientSecret: incoming.seller_client_secret
  }, { required: true });
  await storageSet({ [KEYS.SELLER_CLIENT_ID]: credentials.clientId });
  await storageRemove(KEYS.SELLER_API_KEY);
  await setStatus({ ok: true, code: "CREDENTIALS_IMPORTED", message: "Wildberries Seller credentials импортированы из проверенного локального backup." });
  return WBCredentials.publicCredentialState(credentials);
}

async function diagnostic(event, details = {}, options = {}) {
  try {
    return await withDiagnosticsWrite(async () => {
      const current = await storageGet([KEYS.DIAGNOSTICS, KEYS.DIAGNOSTIC_SEQ, KEYS.SELLER_TOKEN, KEYS.SELLER_CLIENT_SECRET]);
      const list = Array.isArray(current[KEYS.DIAGNOSTICS]) ? current[KEYS.DIAGNOSTICS] : [];
      const sequence = Math.max(0, Number(current[KEYS.DIAGNOSTIC_SEQ] || 0)) + 1;
      const secrets = [current[KEYS.SELLER_TOKEN], current[KEYS.SELLER_CLIENT_SECRET]].filter(v => typeof v === "string" && v.length);
      const safe = safeDiagnosticDetails(details, secrets);
      const record = {
        ...safe,
        sequence,
        event_id: `event-${sequence}-${crypto.randomUUID()}`,
        at: new Date().toISOString(),
        runtime_version: VERSION,
        source: options.source === "content_script" ? "content_script" : "service_worker",
        level: ["info", "warning", "error"].includes(options.level) ? options.level : "info",
        event: /^[A-Z][A-Z0-9_]{0,119}$/.test(String(event)) ? String(event) : "INVALID_DIAGNOSTIC_EVENT"
      };
      list.push(record);
      await storageSet({
        [KEYS.DIAGNOSTICS]: list.slice(-MAX_DIAGNOSTICS),
        [KEYS.DIAGNOSTIC_SEQ]: sequence
      });
      return record;
    });
  } catch (_) {
    return null;
  }
}

function normalizeConversationKey(value) {
  const key = String(value || "").trim();
  if (!key || key.length > 300) {
    throw Object.assign(new Error("Не удалось определить текущий ChatGPT-диалог."), { code: "INVALID_CONVERSATION_KEY" });
  }
  return key;
}

function normalizeTabId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw Object.assign(new Error("Не удалось определить вкладку ChatGPT."), { code: "INVALID_TAB_ID" });
  return id;
}

function normalizeIdentity(identity) {
  const origin = String(identity?.origin || "").trim().toLowerCase();
  const conversationId = identity?.conversation_id ? String(identity.conversation_id).trim().toLowerCase() : null;
  const status = String(identity?.status || (conversationId ? "confirmed" : "unknown"));
  if (!BB2ConversationIdentity.providerForOrigin(origin)) {
    throw Object.assign(new Error("Не удалось подтвердить origin ChatGPT-диалога."), { code: "INVALID_CHATGPT_ORIGIN" });
  }
  if (status === "conflict" || status === "adapter_mismatch" || status === "unsupported") {
    throw Object.assign(new Error("Path и canonical указывают на разные ChatGPT-диалоги. Autorun заблокирован fail-closed."), { code: "CONVERSATION_IDENTITY_CONFLICT" });
  }
  return {
    origin,
    ai_id: BB2ConversationIdentity.providerForOrigin(origin),
    conversation_id: status === "confirmed" ? conversationId : null,
    status: status === "confirmed" && conversationId ? "confirmed" : "unknown",
    source: String(identity?.source || "none"),
    chat_path: String(identity?.chat_path || "")
  };
}

function conversationKeyFromIdentity(identity) {
  const normalized = normalizeIdentity(identity);
  if (!normalized.conversation_id) return null;
  return `${normalized.origin}|${normalized.conversation_id}`;
}

function legacyConversationKey(identity) {
  const normalized = normalizeIdentity(identity);
  const prefix = WBAIDeliveryCapabilities.profile(normalized.ai_id)?.legacy_conversation_key_prefix;
  return prefix && normalized.conversation_id ? `${prefix}:${normalized.conversation_id}` : null;
}

function sameConversationIdentity(a, b) {
  const left = normalizeIdentity(a);
  const right = normalizeIdentity(b);
  return Boolean(left.conversation_id && right.conversation_id && left.origin === right.origin && left.conversation_id === right.conversation_id);
}

async function tabIdentity(tabId) {
  const tab = normalizeTabId(tabId);
  const response = await tabMessage(tab, { type: "WB_GET_IDENTITY" });
  if (!response?.ok || !response.identity) {
    throw Object.assign(new Error(response?.error || "Не удалось прочитать identity ChatGPT-диалога."), { code: response?.code || "IDENTITY_UNAVAILABLE" });
  }
  return normalizeIdentity(response.identity);
}

async function assertTabConversation(tabId, conversationKey, expectedConversationId = null) {
  const key = normalizeConversationKey(conversationKey);
  const identity = await tabIdentity(tabId);
  const liveKey = conversationKeyFromIdentity(identity);
  if (!liveKey || liveKey !== key) {
    throw Object.assign(new Error("Привязанная вкладка открыта на другом или неподтверждённом ChatGPT-диалоге."), { code: "CONVERSATION_MISMATCH" });
  }
  if (expectedConversationId && identity.conversation_id !== String(expectedConversationId).toLowerCase()) {
    throw Object.assign(new Error("Conversation ID вкладки не совпадает с owner-run."), { code: "CONVERSATION_MISMATCH" });
  }
  return identity;
}

function withBindingWrite(fn) {
  const next = bindingWriteLock.then(fn, fn);
  bindingWriteLock = next.catch(() => null);
  return next;
}

async function getConversationBindings() {
  const data = await storageGet(KEYS.CONVERSATION_BINDINGS);
  return { ...(data[KEYS.CONVERSATION_BINDINGS] || {}) };
}

function normalizeBindingRecord(record, key = null) {
  if (!record || typeof record !== "object") return null;
  const origin = String(record.origin || "").trim().toLowerCase();
  const conversationId = String(record.conversation_id || "").trim().toLowerCase();
  const conversationKey = String(record.conversation_key || key || "").trim();
  const bindingId = String(record.binding_id || "").trim();
  const revision = Math.max(1, Number(record.revision || 1));
  if (!bindingId || !origin || !conversationId || !conversationKey) return null;
  if (`${origin}|${conversationId}` !== conversationKey) return null;
  return {
    binding_id: bindingId,
    revision,
    origin,
    conversation_id: conversationId,
    conversation_key: conversationKey,
    bound_at: record.bound_at || null,
    updated_at: record.updated_at || record.bound_at || null
  };
}

async function bindingForConversationKey(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const bindings = await getConversationBindings();
  return normalizeBindingRecord(bindings[key], key);
}

async function strictBindingForIdentity(identity) {
  const normalized = normalizeIdentity(identity);
  const key = conversationKeyFromIdentity(normalized);
  if (!key) {
    throw Object.assign(new Error("ChatGPT conversation identity не подтверждена; явная привязка невозможна."), { code: "CONVERSATION_NOT_CONFIRMED" });
  }
  const binding = await bindingForConversationKey(key);
  if (!binding) {
    throw Object.assign(new Error("Этот ChatGPT-диалог не привязан к Wildberries Bridge. Сначала нажмите «Привязать диалог» в popup."), { code: "CONVERSATION_NOT_BOUND" });
  }
  if (binding.origin !== normalized.origin || binding.conversation_id !== normalized.conversation_id || binding.conversation_key !== key) {
    throw Object.assign(new Error("Conversation binding не совпадает с текущим ChatGPT-диалогом."), { code: "CONVERSATION_BINDING_MISMATCH" });
  }
  return binding;
}

function bindingSnapshot(binding) {
  return {
    binding_id: String(binding.binding_id),
    binding_revision: Math.max(1, Number(binding.revision || 1)),
    origin: String(binding.origin),
    conversation_id: String(binding.conversation_id),
    conversation_key: String(binding.conversation_key)
  };
}

async function assertRunBinding(run) {
  if (!run) throw Object.assign(new Error("Run отсутствует."), { code: "AUTO_RUN_NOT_FOUND" });
  const liveBinding = await bindingForConversationKey(run.conversation_key);
  if (!liveBinding) {
    throw Object.assign(new Error("Привязка ChatGPT-диалога к Wildberries Bridge отсутствует. Run заблокирован fail-closed."), { code: "CONVERSATION_NOT_BOUND" });
  }
  const snap = run.binding_snapshot || null;
  if (!snap) {
    throw Object.assign(new Error("Активный run не содержит binding snapshot. Снова явно привяжите этот диалог в popup для безопасной миграции run."), { code: "RUN_BINDING_SNAPSHOT_MISSING" });
  }
  if (Number(snap.binding_revision) !== Number(liveBinding.revision) ||
      String(snap.binding_id || "") !== liveBinding.binding_id ||
      String(snap.origin || "") !== liveBinding.origin ||
      String(snap.conversation_id || "") !== liveBinding.conversation_id ||
      String(snap.conversation_key || "") !== liveBinding.conversation_key) {
    throw Object.assign(new Error("Binding активного run не совпадает с текущей явной привязкой диалога."), { code: "RUN_BINDING_MISMATCH" });
  }
  return liveBinding;
}

async function bindConversation(context, {requireUnbound=false,additionalBindingCommit=null} = {}) {
  const tab = normalizeTabId(context?.tab_id);
  const expected = normalizeIdentity({
    origin: context?.origin,
    conversation_id: context?.conversation_id,
    status: context?.conversation_id ? "confirmed" : "unknown"
  });
  if (!expected.conversation_id) {
    throw Object.assign(new Error("Нужен подтверждённый ChatGPT-диалог /c/<conversation-id>."), { code: "CONVERSATION_NOT_CONFIRMED" });
  }
  const live = await tabIdentity(tab);
  if (!sameConversationIdentity(live, expected)) {
    throw Object.assign(new Error("Контекст popup изменился. Откройте popup заново в нужном ChatGPT-диалоге."), { code: "POPUP_CONTEXT_STALE" });
  }
  const key = await resolveConfirmedConversationKey(live);
  return withBindingWrite(async () => {
    const bindings = await getConversationBindings();
    const previous = normalizeBindingRecord(bindings[key], key);
    if(requireUnbound&&previous)throw wbError("WORK_START_BINDING_CHANGED");
    const now = new Date().toISOString();
    const record = {
      binding_id: (previous?.binding_id && String(previous.binding_id).startsWith("wbbind-")) ? previous.binding_id : `wbbind-${crypto.randomUUID()}`,
      revision: Math.max(0, Number(previous?.revision || 0)) + 1,
      origin: live.origin,
      conversation_id: live.conversation_id,
      conversation_key: key,
      bound_at: previous?.bound_at || now,
      updated_at: now
    };
    bindings[key] = record;
    const bindingUpdates = { [KEYS.CONVERSATION_BINDINGS]: bindings };
    // A pre-1.1.5 manual-mode bit must not silently become armed merely because the operator
    // performs the first explicit bind. The first bind is authorization, not implicit mode activation.
    if (!previous) {
      const manualData = await storageGet(KEYS.MANUAL_MODES);
      const modes = { ...(manualData[KEYS.MANUAL_MODES] || {}) };
      delete modes[key];
      bindingUpdates[KEYS.MANUAL_MODES] = modes;
    }
    // Work activation can atomically record the binding snapshot with the new
    // binding, so worker loss between binding and visibility cannot lose ownership.
    if(additionalBindingCommit)Object.assign(bindingUpdates,additionalBindingCommit(record));
    const finalIdentity=await tabIdentity(tab);if(!sameConversationIdentity(finalIdentity,live))throw wbError('POPUP_CONTEXT_STALE');
    await storageSet(bindingUpdates);
    const verified=await bindingForConversationKey(key);if(!verified||WBRuntimePolicy.canonical(bindingSnapshot(verified))!==WBRuntimePolicy.canonical(bindingSnapshot(record)))throw wbError('CONVERSATION_BINDING_READBACK_FAILED');

    // Explicit operator binding is the only allowed migration path for an older active run
    // that predates binding snapshots. Never auto-bind on extension upgrade.
    const existing = await getAutoRun(key);
    if (existing && !existing.binding_snapshot && !BridgeAutorunModel.isTerminalStatus(existing.status)) {
      await mutateAutoRun(key, (current) => current ? { ...current, binding_snapshot: bindingSnapshot(record) } : current);
      await diagnostic("LEGACY_RUN_BOUND_BY_EXPLICIT_OPERATOR_ACTION", { run_id: existing.run_id, binding_id: record.binding_id, conversation_key: key });
    }
    await diagnostic("CONVERSATION_BOUND", { binding_id: record.binding_id, binding_revision: record.revision, conversation_key: key, tab_id: tab });
    return record;
  });
}

function withMigrationWrite(fn) {
  const next = migrationWriteLock.then(fn, fn);
  migrationWriteLock = next.catch(() => null);
  return next;
}

async function migrateLegacyConversationStorage(identity) {
  const normalized = normalizeIdentity(identity);
  const realKey = conversationKeyFromIdentity(normalized);
  const oldKey = legacyConversationKey(normalized);
  if (!realKey || !oldKey || realKey === oldKey) return realKey;
  return withMigrationWrite(async () => {
    const data = await storageGet([KEYS.MANUAL_MODES, KEYS.AUTO_RUNS, KEYS.REPORT_PREFIXES, KEYS.AUTO_START_PROMPTS]);
    const maps = {
      [KEYS.MANUAL_MODES]: { ...(data[KEYS.MANUAL_MODES] || {}) },
      [KEYS.AUTO_RUNS]: { ...(data[KEYS.AUTO_RUNS] || {}) },
      [KEYS.REPORT_PREFIXES]: { ...(data[KEYS.REPORT_PREFIXES] || {}) },
      [KEYS.AUTO_START_PROMPTS]: { ...(data[KEYS.AUTO_START_PROMPTS] || {}) }
    };
    const updates = {};
    for (const storageKey of Object.keys(maps)) {
      const map = maps[storageKey];
      if (Object.prototype.hasOwnProperty.call(map, oldKey) && !Object.prototype.hasOwnProperty.call(map, realKey)) {
        map[realKey] = map[oldKey];
        if (storageKey === KEYS.AUTO_RUNS && map[realKey]) {
          map[realKey] = {
            ...map[realKey],
            conversation_key: realKey,
            conversation_id: normalized.conversation_id,
            origin: normalized.origin
          };
        }
      }
      delete map[oldKey];
      updates[storageKey] = map;
    }
    await storageSet(updates);
    return realKey;
  });
}

async function resolveConfirmedConversationKey(identity) {
  const normalized = normalizeIdentity(identity);
  const key = conversationKeyFromIdentity(normalized);
  if (!key) {
    throw Object.assign(new Error("Нужен подтверждённый ChatGPT-диалог /c/<conversation-id>. В новом пустом чате сначала создайте диалог, затем откройте popup снова."), { code: "CONVERSATION_NOT_CONFIRMED" });
  }
  await migrateLegacyConversationStorage(normalized);
  return key;
}

async function resolvePopupContext(tabId, expectedIdentity = null) {
  const tab = normalizeTabId(tabId);
  const live = await tabIdentity(tab);
  if (expectedIdentity) {
    const expected = normalizeIdentity(expectedIdentity);
    if (!sameConversationIdentity(live, expected)) {
      throw Object.assign(new Error("Контекст popup изменился. Откройте popup заново в нужном ChatGPT-диалоге."), { code: "POPUP_CONTEXT_STALE" });
    }
  }
  const key = await resolveConfirmedConversationKey(live);
  return { tab_id: tab, conversation_key: key, identity: live };
}

async function getSettings() {
  const data = await storageGet([KEYS.SELLER_CLIENT_ID, KEYS.SELLER_API_KEY, KEYS.AUTO_SEND, KEYS.LAST_STATUS]);
  if (data[KEYS.SELLER_API_KEY]) await storageRemove(KEYS.SELLER_API_KEY);
  return {
    sellerCredentials: WBCredentials.normalizeSellerCredentials({
      clientId: data[KEYS.SELLER_CLIENT_ID] || "",
      tokenType: "personal"
    }),
    autoSend: data[KEYS.AUTO_SEND] !== false,
    lastStatus: data[KEYS.LAST_STATUS] || null
  };
}

async function getManualMode(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  if (!key) return false;
  // Work is authoritative. Never revive a hidden/finished session from a legacy flag.
  return (await wbWorkRead(key)).state === 'active_visible';
}

const MANUAL_OPERATION_STATUSES = Object.freeze({
  REQUESTING: "requesting",
  DELIVERING: "delivering",
  COMPLETED: "completed",
  FAILED: "failed"
});

function manualOperationActive(operation) {
  return Boolean(operation && [MANUAL_OPERATION_STATUSES.REQUESTING, MANUAL_OPERATION_STATUSES.DELIVERING].includes(operation.status));
}

function publicManualOperation(operation) {
  if (!operation) return null;
  return {
    operation_id: operation.operation_id || null,
    manual_request_id: operation.manual_request_id || null,
    status: operation.status || null,
    owner_tab_id: operation.tab_id || null,
    request_id: operation.request_id || null,
    delivery_id: operation.delivery_id || null,
    operation: operation.operation || null,
    command_summary: operation.command_summary || null,
    delivery_confirmed: operation.delivery_confirmed === true,
    created_at: operation.created_at || null,
    updated_at: operation.updated_at || null,
    completed_at: operation.completed_at || null,
    last_error: operation.last_error || null
  };
}

async function getManualOperation(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const data = await storageGet(KEYS.MANUAL_OPERATIONS);
  return (data[KEYS.MANUAL_OPERATIONS] || {})[key] || null;
}

function withManualOperationsWrite(fn) {
  const next = manualOperationsWriteLock.then(fn, fn);
  manualOperationsWriteLock = next.catch(() => null);
  return next;
}

async function mutateManualOperation(conversationKey, mutator) {
  const key = normalizeConversationKey(conversationKey);
  return withManualOperationsWrite(async () => {
    const data = await storageGet(KEYS.MANUAL_OPERATIONS);
    const operations = { ...(data[KEYS.MANUAL_OPERATIONS] || {}) };
    const current = operations[key] || null;
    const before = JSON.stringify(current);
    const next = await mutator(current);
    if (JSON.stringify(next) === before) return current;
    if (next) operations[key] = { ...next, updated_at: new Date().toISOString() };
    else delete operations[key];
    await storageSet({ [KEYS.MANUAL_OPERATIONS]: operations });
    const saved = (await storageGet(KEYS.MANUAL_OPERATIONS))[KEYS.MANUAL_OPERATIONS] || {};
    if (JSON.stringify(saved[key]||null)!==JSON.stringify(operations[key]||null)) throw wbError("MANUAL_STORAGE_READBACK_FAILED");
    return operations[key] || null;
  });
}

async function getAutoRun(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const data = await storageGet(KEYS.AUTO_RUNS);
  const runs = data[KEYS.AUTO_RUNS] || {};
  return runs[key] || null;
}

function withAutoRunsWrite(fn) {
  const next = autoRunsWriteLock.then(fn, fn);
  autoRunsWriteLock = next.catch(() => null);
  return next;
}

async function mutateAutoRun(conversationKey, mutator) {
  const key = normalizeConversationKey(conversationKey);
  return withAutoRunsWrite(async () => {
    const data = await storageGet(KEYS.AUTO_RUNS);
    const runs = { ...(data[KEYS.AUTO_RUNS] || {}) };
    const current = runs[key] || null;
    const next = await mutator(current);
    if (next) runs[key] = { ...next, updated_at: new Date().toISOString() };
    else delete runs[key];
    await storageSet({ [KEYS.AUTO_RUNS]: runs });
    return runs[key] || null;
  });
}

async function setManualMode() {
  throw Object.assign(new Error('Кнопками WB управляет только рабочая сессия.'), {code:'WORK_SESSION_OWNS_MANUAL_MODE'});
}

function withPrefixWrite(fn) {
  const next = prefixWriteLock.then(fn, fn);
  prefixWriteLock = next.catch(() => null);
  return next;
}

async function getReportPrefix(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const data = await storageGet(KEYS.REPORT_PREFIXES);
  return (data[KEYS.REPORT_PREFIXES] || {})[key] || null;
}

async function saveReportPrefix(conversationKey, payload) {
  const key = normalizeConversationKey(conversationKey);
  return withPrefixWrite(async () => {
    const data = await storageGet(KEYS.REPORT_PREFIXES);
    const prefixes = { ...(data[KEYS.REPORT_PREFIXES] || {}) };
    const current = prefixes[key] || null;
    const normalized = BridgeAutorunModel.normalizePrefixRecord({
      enabled: payload.report_prefix_enabled === true,
      text: String(payload.report_prefix_text ?? current?.text ?? ""),
      interval: payload.report_prefix_interval,
      delivered_count: current?.delivered_count || 0,
      last_applied_at_count: current?.last_applied_at_count || 0,
      last_confirmed_delivery_id: current?.last_confirmed_delivery_id || null,
      updated_at: new Date().toISOString()
    });
    if (normalized && (normalized.enabled || normalized.text)) prefixes[key] = normalized;
    else delete prefixes[key];
    await storageSet({ [KEYS.REPORT_PREFIXES]: prefixes });
    return prefixes[key] || null;
  });
}

async function noteConfirmedPrefix(conversationKey, applied, deliveryId = "") {
  const key = normalizeConversationKey(conversationKey);
  return withPrefixWrite(async () => {
    const data = await storageGet(KEYS.REPORT_PREFIXES);
    const prefixes = { ...(data[KEYS.REPORT_PREFIXES] || {}) };
    const current = prefixes[key] || null;
    if (!current) return null;
    prefixes[key] = BridgeAutorunModel.noteConfirmedPrefix(current, applied === true, deliveryId);
    await storageSet({ [KEYS.REPORT_PREFIXES]: prefixes });
    return prefixes[key];
  });
}

function withStartPromptWrite(fn) {
  const next = startPromptWriteLock.then(fn, fn);
  startPromptWriteLock = next.catch(() => null);
  return next;
}

function normalizeAutoStartPromptText(value) {
  const text = String(value ?? "").replace(/\r\n?/g, "\n").trim();
  if (!text) throw Object.assign(new Error("Стартовый текст Work не может быть пустым."), { code: "AUTO_START_PROMPT_EMPTY" });
  if (Array.from(text).length > 30000) throw Object.assign(new Error("Стартовый текст Work слишком длинный (максимум 30000 символов)."), { code: "AUTO_START_PROMPT_TOO_LONG" });
  return text;
}

// One authority for common Start text, with lossless migration of WB's
// previously independent new-chat bootstrap template. Explicit chat overrides
// remain independent; resetting a chat returns it to the current common text.
function legacyGlobalPrompt(data) {
 if(data[KEYS.GLOBAL_AUTO_START_PROMPT])return data[KEYS.GLOBAL_AUTO_START_PROMPT];
 const text=data.wb_runtime_options_v1?.bootstrap_text;
 return typeof text==='string'&&text.trim()?{text,is_default:[DEFAULT_AUTO_START_TEXT,WBRuntime.PREVIOUS_AUTO_START_TEXT,WBRuntime.LEGACY_WORK_START_TEXT].includes(text),updated_at:null}:null;
}
async function persistPromptState(values){
 await storageSet(values);const actual=await storageGet(Object.keys(values));
 for(const key of Object.keys(values))if(WBRuntimePolicy.canonical(values[key])!==WBRuntimePolicy.canonical(actual[key]))throw wbError('PROMPT_STORAGE_READBACK_FAILED');
}
function normalizeGlobalAutoStartPromptRecord(raw) {
  const current = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : null;
  const now = new Date().toISOString();
  if (current?.text && String(current.text).trim()) {
    const normalizedText = normalizeAutoStartPromptText(current.text);
    if (current.is_default === true && normalizedText !== DEFAULT_AUTO_START_TEXT) {
      return { record: { text: DEFAULT_AUTO_START_TEXT, is_default: true, updated_at: now }, changed: true };
    }
    return {
      record: { text: normalizedText, is_default: current.is_default === true, updated_at: current.updated_at || null },
      changed: normalizedText !== current.text
    };
  }
  return { record: { text: DEFAULT_AUTO_START_TEXT, is_default: true, updated_at: now }, changed: true };
}

async function getGlobalAutoStartPrompt({ ensureStored = true } = {}) {
  return withStartPromptWrite(async () => {
    const data = await storageGet([KEYS.GLOBAL_AUTO_START_PROMPT, "wb_runtime_options_v1"]);
    const normalized = normalizeGlobalAutoStartPromptRecord(legacyGlobalPrompt(data));
    if (ensureStored && (normalized.changed || !data[KEYS.GLOBAL_AUTO_START_PROMPT])) await persistPromptState({ [KEYS.GLOBAL_AUTO_START_PROMPT]: normalized.record });
    return normalized.record;
  });
}

async function saveGlobalAutoStartPrompt(text) {
  const normalizedText = normalizeAutoStartPromptText(text);
  return withStartPromptWrite(async () => {
    const record = {
      text: normalizedText,
      is_default: normalizedText === DEFAULT_AUTO_START_TEXT,
      updated_at: new Date().toISOString()
    };
    await persistPromptState({ [KEYS.GLOBAL_AUTO_START_PROMPT]: record });
    return record;
  });
}

async function resetGlobalAutoStartPrompt() {
  return saveGlobalAutoStartPrompt(DEFAULT_AUTO_START_TEXT);
}

async function getAutoStartPrompt(conversationKey, { ensureStored = true } = {}) {
  const key = normalizeConversationKey(conversationKey);
  return withStartPromptWrite(async () => {
    const data = await storageGet([KEYS.AUTO_START_PROMPTS, KEYS.GLOBAL_AUTO_START_PROMPT, "wb_runtime_options_v1"]);
    const prompts = { ...(data[KEYS.AUTO_START_PROMPTS] || {}) };
    const current = prompts[key] || null;
    const globalResolved = normalizeGlobalAutoStartPromptRecord(legacyGlobalPrompt(data));
    const updates = {};

    if ((globalResolved.changed || !data[KEYS.GLOBAL_AUTO_START_PROMPT]) && ensureStored) updates[KEYS.GLOBAL_AUTO_START_PROMPT] = globalResolved.record;

    if (current?.text && String(current.text).trim() && current.is_default !== true) {
      if (Object.keys(updates).length) await persistPromptState(updates);
      return {
        text: normalizeAutoStartPromptText(current.text),
        is_default: false,
        is_override: true,
        source: "conversation_override",
        updated_at: current.updated_at || null
      };
    }

    if (current && ensureStored) {
      delete prompts[key];
      updates[KEYS.AUTO_START_PROMPTS] = prompts;
    }
    if (Object.keys(updates).length) await persistPromptState(updates);
    return { ...globalResolved.record, is_override: false, source: "global" };
  });
}

async function saveAutoStartPrompt(conversationKey, text) {
  const key = normalizeConversationKey(conversationKey);
  const normalizedText = normalizeAutoStartPromptText(text);
  return withStartPromptWrite(async () => {
    const data = await storageGet(KEYS.AUTO_START_PROMPTS);
    const prompts = { ...(data[KEYS.AUTO_START_PROMPTS] || {}) };
    prompts[key] = {
      text: normalizedText,
      is_default: false,
      updated_at: new Date().toISOString()
    };
    await persistPromptState({ [KEYS.AUTO_START_PROMPTS]: prompts });
    return { ...prompts[key], is_override: true, source: "conversation_override" };
  });
}

async function resetAutoStartPrompt(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  await withStartPromptWrite(async () => {
    const data = await storageGet(KEYS.AUTO_START_PROMPTS);
    const prompts = { ...(data[KEYS.AUTO_START_PROMPTS] || {}) };
    if (Object.prototype.hasOwnProperty.call(prompts, key)) {
      delete prompts[key];
      await persistPromptState({ [KEYS.AUTO_START_PROMPTS]: prompts });
    }
  });
  return getAutoStartPrompt(key);
}

function publicRun(run) {
  if (!run) return null;
  return {
    run_id: run.run_id,
    status: run.status,
    owner_tab_id: run.tab_id || null,
    conversation_id: run.conversation_id || null,
    binding_id: run.binding_snapshot?.binding_id || null,
    binding_revision: Number(run.binding_snapshot?.binding_revision || 0) || null,
    sequence: Number(run.sequence || 0),
    pause_requested: run.pause_requested === true,
    finish_requested: run.finish_requested === true,
    last_operation: run.last_operation || null,
    last_command_summary: run.last_command_summary || null,
    last_assistant_turn_id: run.last_assistant_turn_id || null,
    created_at: run.created_at || null,
    updated_at: run.updated_at || null,
    last_error: run.last_error || null
  };
}

let packagedMetadataHash;
async function commonPublicSettingsFields() {
  const settings = await getSettings();
  const [sendData, copyProfiles] = await Promise.all([
    storageGet(KEYS.SEND_BUTTON_PROFILE),
    getCopyButtonProfiles()
  ]);
  const credentialState = WBCredentials.publicCredentialState(settings.sellerCredentials);
  const operationNames = Object.keys(WBContract.OPERATIONS || {});
  const enabledOperations = operationNames.filter((name) => WBContract.OPERATIONS[name]?.execution_enabled === true);
  const registryHash=await (packagedMetadataHash||(packagedMetadataHash=WBRuntimePolicy.hash(WBRuntimePolicy.canonical(WBContract.OPERATIONS))));
  const metadata={authority:'PRESERVED_PACKAGED_WB_REGISTRY',registry_sha256:registryHash,provider_currentness:'REQUIRES_WB_CHARACTERIZATION',local_lkg:await WBPolicyEngine.metadataState(),automatic_provider_refresh:false};
  return {
    version: VERSION,
    ...credentialState,
    provider_execution_ready: enabledOperations.length > 0,
    provider_operation_count: operationNames.length,
    provider_enabled_operation_count: enabledOperations.length,
    provider_enabled_operations: enabledOperations,
    provider_metadata: metadata,
    provider_gate: enabledOperations.length > 0 ? "OPEN" : "CLOSED",
    auto_send: settings.autoSend,
    send_button_profile: sendData[KEYS.SEND_BUTTON_PROFILE] || null,
    copy_button_profiles: copyProfiles,
    copy_button_profile_count: copyProfiles.profiles.length,
    copy_button_builtin_adapter_count: BB2ManualControls.BUILTIN_MANUAL_COPY_ADAPTER_COUNT,
    last_status: settings.lastStatus?.code === "SAFE_PROBE_NOT_CONFIGURED" ? null : settings.lastStatus
  };
}

async function publicSettingsState(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const common = await commonPublicSettingsFields();
  const [manualMode, manualOperation, run, prefix, startPrompt, binding] = await Promise.all([
    getManualMode(key), getManualOperation(key), getAutoRun(key), getReportPrefix(key), getAutoStartPrompt(key), bindingForConversationKey(key)
  ]);
  return {
    ...common,
    work: await wbWorkRead(key),
    runtime_options: await wbOptions(),
    page_context_available: true,
    conversation_key: key,
    binding: binding ? { bound: true, ...binding } : { bound: false, binding_id: null, revision: null },
    manual_mode: binding ? manualMode : false,
    manual_operation: binding ? publicManualOperation(manualOperation) : null,
    manual_operation_active: binding ? manualOperationActive(manualOperation) : false,
    auto_run: publicRun(run),
    auto_start_prompt: {
      text: String(startPrompt?.text || DEFAULT_AUTO_START_TEXT),
      is_default: startPrompt?.is_default === true,
      is_override: startPrompt?.is_override === true,
      source: startPrompt?.source || "global",
      updated_at: startPrompt?.updated_at || null
    },
    report_prefix: prefix ? {
      enabled: prefix.enabled === true,
      text: String(prefix.text || ""),
      interval: Number(prefix.interval || 1),
      delivered_count: Number(prefix.delivered_count || 0),
      last_applied_at_count: Number(prefix.last_applied_at_count || 0),
      updated_at: prefix.updated_at || null
    } : null
  };
}

async function publicGlobalSettingsState(pageContextError = null) {
  const common = await commonPublicSettingsFields();
  return {
    ...common,
    page_context_available: false,
    page_context_error: pageContextError ? String(pageContextError).slice(0, 800) : null,
    conversation_key: null,
    binding: { bound: false, binding_id: null, revision: null },
    manual_mode: false,
    manual_operation: null,
    manual_operation_active: false,
    auto_run: null,
    auto_start_prompt: { text: DEFAULT_AUTO_START_TEXT, is_default: true, updated_at: null },
    report_prefix: null
  };
}

async function setStatus(status) {
  const clean = {
    ok: Boolean(status.ok),
    code: String(status.code || "").slice(0, 120),
    message: String(status.message || "").slice(0, 800),
    http_status: Number(status.http_status || 0),
    at: new Date().toISOString()
  };
  await storageSet({ [KEYS.LAST_STATUS]: clean });
  return clean;
}

// Every plan is reparsed in the worker; content-supplied plans are never trusted.
async function executeWorkPlan(commandText, context) {
  // pre_execution_plan is worker-created only, never accepted from page messages.
  const plan = context.pre_execution_plan || WBCommandProtocol.parseOrError(commandText);
  const localOnly = plan.entries.every(entry => entry.code || entry.kind === 'help' || entry.kind === 'file');
  if (context.mode !== 'manual' && plan.entries.length === 1 && plan.entries[0].kind === 'api' && !plan.entries[0].code) {
    return executeWildberriesCore(plan.entries[0].command_text, context);
  }
  const settings = await getSettings();
  const credentialsAtStart = JSON.stringify(settings.sellerCredentials);
  const canContinue = async () => {
    const record = context.mode === 'manual' ? await getManualOperation(context.key) : await getAutoRun(context.key);
    if (!record || (record.operation_id || record.run_id) !== context.id || record.status !== 'requesting' || record.pause_requested || record.finish_requested) return false;
    if (record.request_worker_session_id !== WORKER_SESSION_ID) return false;
    try {
      await assertTabConversation(context.tabId, context.key, record.conversation_id);
      await assertRunBinding(record);
    } catch (_) { return false; }
    // The command gate must not prevent delivery of its own local rejection.
    if (!localOnly && context.mode === 'manual' && !(await getManualMode(context.key))) return false;
    if (context.mode === 'auto' && await getManualMode(context.key)) return false;
    return JSON.stringify((await getSettings()).sellerCredentials) === credentialsAtStart;
  };
  const persist = async (snapshot) => {
    const checksum = await sha256Hex(WBRuntimePolicy.canonical(snapshot)); let saved = false;
    const mutate = context.mode === 'manual' ? mutateManualOperation : mutateAutoRun;
    await mutate(context.key, (current) => {
      if (!current || (current.operation_id || current.run_id) !== context.id || current.status !== 'requesting' || current.request_worker_session_id !== WORKER_SESSION_ID) return current;
      saved = true; return {...current, auto_send:settings.autoSend, command_batch: {snapshot, sha256: checksum, checksum_algorithm:'canonical-json-v1'}};
    });
    if (!saved) throw Object.assign(new Error('Batch ownership changed.'), {code:'BATCH_OWNER_CHANGED'});
  };
  const result = await WBBatchRuntime.run(plan, {persist, canContinue, beforeEntry:(entry,record)=>WBDeliveryPolicy.budget(entry,record,WBAIDeliveryCapabilities.adapterIdForOrigin(context.key.split('|')[0])), execute: async (entry, beforeDispatch, requestIdentity) => {
    if(entry.kind==='file'){const result=await wbReadLocalFile(entry.command,context);if(!(await canContinue()))throw wbError('LOCAL_FILE_CONTEXT_CHANGED');return result;}
    return wbExecuteProvider(entry.command_text,{...context,...requestIdentity},settings,beforeDispatch);
  }});
  await diagnostic('EXPLICIT_BATCH_TERMINAL', {batch_id:result.record.batch_id,status:result.record.status,logical_count:plan.entries.length,physical_request_count:result.response.physical_request_count});
  return {...result.response, auto_send:settings.autoSend};
}

async function recoverSavedBatch(record) {
  const saved = record.command_batch;
  try {
    if (!saved?.snapshot || !saved.sha256 || saved.checksum_algorithm && saved.checksum_algorithm !== 'canonical-json-v1') throw new Error('Integrity authority mismatch.');
    // Legacy byte checksums remain strict: a reordered legacy record cannot be
    // authenticated retroactively. New records hash semantic JSON explicitly.
    const serialized = saved.checksum_algorithm === 'canonical-json-v1' ? WBRuntimePolicy.canonical(saved.snapshot) : JSON.stringify(saved.snapshot);
    if (await sha256Hex(serialized) !== saved.sha256) throw new Error('Integrity mismatch.');
    return WBBatchRuntime.render(WBBatchRuntime.recover(saved.snapshot));
  } catch (_) {
    if (record.operation_id) await mutateManualOperation(record.conversation_key, r => r?.operation_id === record.operation_id ? {...r,status:'failed',last_error:{code:'BATCH_INTEGRITY_MISMATCH',message:'Saved batch corrupt; no replay.'}} : r);
    else await markRunError(record.conversation_key,'BATCH_INTEGRITY_MISMATCH','Saved batch corrupt; no replay.');
    throw Object.assign(new Error('Saved batch invalid; no replay.'), {code:'BATCH_INTEGRITY_MISMATCH'});
  }
}

async function executeWildberriesCore(commandText, context) {
  const settings = await getSettings();
  const command = WBContract.parseCommand(commandText);
  const fingerprint = WBContract.commandFingerprint(command);
  await diagnostic("WB_REQUEST_STARTED", { operation: command.operation, command_fingerprint: fingerprint });
  try {
    const response = await wbExecuteProvider(commandText,context,settings);
    await diagnostic("WB_REQUEST_FINISHED", {
      request_id: response.request_id || null,
      operation: command.operation,
      command_fingerprint: fingerprint,
      http_status: response.http_status,
      ok: response.ok
    }, { level: response.ok ? "info" : "warning" });
    await setStatus(response.ok
      ? { ok: true, code: "CONNECTED", message: "Последний Wildberries API запрос выполнен успешно.", http_status: response.http_status }
      : { ok: false, code: "WB_API_ERROR", message: `Wildberries API вернул HTTP ${response.http_status}.`, http_status: response.http_status });
    return { ...response, auto_send: settings.autoSend };
  } catch (error) {
    const safe = safeExecutionError(error);
    await diagnostic("WB_REQUEST_FAILED", {
      operation: command.operation,
      command_fingerprint: fingerprint,
      code: safe.code,
      error: safe.message,
      http_status: safe.http_status
    }, { level: "error" });
    await setStatus({ ok: false, code: safe.code, message: safe.message, http_status: safe.http_status });
    throw error;
  }
}

// Error metadata belongs to this worker path; the contract's redacted error
// payload intentionally has no HTTP status. Never invent status 200 for a fetch failure.
function safeExecutionError(error) {
  const status = Number(error?.http_status);
  const httpStatus = Number.isInteger(status) && status >= 100 && status <= 599 ? status : 0;
  return Object.freeze({ ...WBContract.safeBridgeErrorPayload(error), http_status: httpStatus });
}

function buildAutoExecutionErrorResult(command, fingerprint, error, elapsedMs = 0) {
  const safe = safeExecutionError(error);
  WBContract.preflightExecution(command);
  const meta = WBContract.resolveOperation(command.operation);
  const requestId = crypto.randomUUID();
  const reportText = WBContract.formatResultReport({
    requestId,
    command,
    requestMeta: {
      host_alias: meta.host,
      http_method: meta.method,
      path_alias: command.operation,
      physical_request_count: Number.isInteger(error?.physical_request_count)?error.physical_request_count:null,
      external_request_executed: typeof error?.external_request_executed==='boolean'?error.external_request_executed:null,
      automatic_retry:false,
      next_eligible_at:error?.next_eligible_at||null
    },
    httpStatus: safe.http_status,
    result: { error: safe },
    elapsedMs: Math.max(0, Number(elapsedMs || 0)),
    pagination: null,
    rateLimit: null
  });
  return Object.freeze({
    ok: false,
    bridge_error: true,
    request_id: requestId,
    operation: command.operation,
    command_fingerprint: fingerprint,
    http_status: safe.http_status,
    report_text: reportText,
    response_meta: null
  });
}

async function applyPrefixToReport(conversationKey, reportText) {
  const prefix = await getReportPrefix(conversationKey);
  const result = BridgeAutorunModel.applyReportPrefix(reportText, prefix);
  return { outgoing_text: result.text, report_prefix_applied: result.applied };
}

async function executeManualCommand(commandText, conversationKey, sender, manualRequestId) {
  const key = normalizeConversationKey(conversationKey);
  const senderTabId = Number(sender?.tab?.id || 0);
  if (!Number.isInteger(senderTabId) || senderTabId <= 0) {
    throw Object.assign(new Error("Ручная Wildberries-команда должна приходить из ChatGPT content script."), { code: "MANUAL_SENDER_TAB_MISSING" });
  }
  const requestToken = String(manualRequestId || "").trim();
  if (!requestToken) throw Object.assign(new Error("Manual request ID отсутствует."), { code: "MANUAL_REQUEST_ID_MISSING" });
  const liveIdentity = await assertTabConversation(senderTabId, key);
  const binding = await strictBindingForIdentity(liveIdentity);
  // Identity/binding are security boundaries; only after they pass may an error
  // be delivered into this owner chat. Work/parser/policy rejection is a result.
  const work = await wbWorkRead(key);
  let parsed;
  if (work.state !== 'active_visible') {
    parsed = WBCommandProtocol.localFailure({code:'WORK_SESSION_NOT_VISIBLE'},commandText,'work_session_gate');
  } else if (!(await getManualMode(key))) {
    parsed = WBCommandProtocol.localFailure({code:'MANUAL_MODE_OFF'},commandText,'manual_gate');
  } else {
    // Retired Autorun records cannot block the production Work/manual path.
    parsed = WBCommandProtocol.parseOrError(commandText);
  }
  let duplicateOperation = null;
  const operationId = `wbmanual-${crypto.randomUUID()}`;
  const accountScope = (await wbOwner(key)).account_scope;
  const now = new Date().toISOString();
  const operation = await mutateManualOperation(key, (current) => {
    if (current?.manual_request_id === requestToken) {
      duplicateOperation = current;
      return current;
    }
    if (manualOperationActive(current)) return current;
    return {
      operation_id: operationId,
      account_scope: accountScope,
      manual_request_id: requestToken,
      conversation_key: key,
      origin: liveIdentity.origin,
      conversation_id: liveIdentity.conversation_id,
      binding_snapshot: bindingSnapshot(binding),
      tab_id: senderTabId,
      status: MANUAL_OPERATION_STATUSES.REQUESTING,
      operation: parsed.operation,
      command_summary: parsed.operation,
      request_id: null,
      request_worker_session_id: WORKER_SESSION_ID,
      delivery_id: null,
      outgoing_text: null,
      auto_send: true,
      report_prefix_applied: false,
      delivery_confirmed: false,
      created_at: now,
      completed_at: null,
      last_error: null
    };
  });
  if (duplicateOperation) {
    throw Object.assign(new Error("Эта ручная операция уже принята. Повторный API-вызов запрещён."), { code: "MANUAL_REQUEST_DUPLICATE", operation_id: duplicateOperation.operation_id });
  }
  if (!operation || operation.operation_id !== operationId) {
    throw Object.assign(new Error("Bridge уже выполняет или доставляет ручной Wildberries-запрос."), { code: "MANUAL_OPERATION_ACTIVE" });
  }
  await diagnostic("MANUAL_OPERATION_CLAIMED", { operation_id: operationId, manual_request_id: requestToken, conversation_id: liveIdentity.conversation_id, tab_id: senderTabId, operation: parsed.operation });
  try {
    const result = await executeWorkPlan(commandText, {mode:'manual',key,id:operationId,tabId:senderTabId,pre_execution_plan:parsed});
    const liveOperation = await getManualOperation(key);
    if (liveOperation?.operation_id !== operationId || liveOperation.status !== 'requesting' || liveOperation.finish_requested) throw Object.assign(new Error('Operation cancelled; no late delivery.'), {code:'MANUAL_OPERATION_CANCELLED'});
    await assertRunBinding(liveOperation);
    await assertTabConversation(senderTabId, key, liveIdentity.conversation_id);
    const prefixed = await applyPrefixToReport(key, result.report_text);
    const deliveryId = `manual-delivery-${operationId}`;
    const committedDelivery = await mutateManualOperation(key, (current) => {
      if (!current || current.operation_id !== operationId || current.status !== 'requesting' || current.finish_requested) return current;
      return {
        ...current,
        status: MANUAL_OPERATION_STATUSES.DELIVERING,
        request_id: result.request_id || null,
        delivery_id: deliveryId,
        outgoing_text: prefixed.outgoing_text || result.report_text,
        artifact_refs: result.artifact_refs || [],
        auto_send: result.auto_send !== false,
        report_prefix_applied: prefixed.report_prefix_applied === true,
        last_error: null
      };
    });
    if (committedDelivery?.operation_id !== operationId || committedDelivery.status !== 'delivering' || committedDelivery.finish_requested) throw Object.assign(new Error('Operation cancelled before delivery commit.'), {code:'MANUAL_OPERATION_CANCELLED'});
    await diagnostic("MANUAL_OPERATION_DELIVERING", { operation_id: operationId, delivery_id: deliveryId, request_id: result.request_id || null, tab_id: senderTabId });
    return { ...result, ...prefixed, manual_operation_id: operationId, manual_request_id: requestToken, delivery_id: deliveryId };
  } catch (error) {
    await mutateManualOperation(key, (current) => {
      if (!current || current.operation_id !== operationId || current.status !== 'requesting' || current.finish_requested) return current;
      return { ...current, status: MANUAL_OPERATION_STATUSES.FAILED, completed_at: new Date().toISOString(), last_error: { code: error.code || "MANUAL_OPERATION_FAILED", message: String(error.message || error) } };
    });
    await diagnostic("MANUAL_OPERATION_FAILED", { operation_id: operationId, code: error.code || "MANUAL_OPERATION_FAILED", error: String(error.message || error) }, { level: "error" });
    throw error;
  }
}

function manualDeliveryRecoveryPayload(operation) {
  if (!operation || operation.status !== MANUAL_OPERATION_STATUSES.DELIVERING || !operation.delivery_id || !operation.outgoing_text) return null;
  return {
    type: "manual_deliver",
    operation_id: operation.operation_id,
    manual_request_id: operation.manual_request_id || "",
    conversation_key: operation.conversation_key,
    origin: operation.origin,
    conversation_id: operation.conversation_id,
    delivery_id: operation.delivery_id,
    request_id: operation.request_id || "",
    outgoing_text: operation.outgoing_text,
    auto_send: operation.auto_send !== false,
    report_prefix_applied: operation.report_prefix_applied === true
  };
}

async function manualOwnerDecision(operation, candidateTabId, { allowRebind = true } = {}) {
  const candidate = normalizeTabId(candidateTabId);
  if (!operation || !manualOperationActive(operation)) return { owner: false, reason: "manual_operation_missing", operation };
  if (Number(operation.tab_id) === candidate) {
    await assertTabConversation(candidate, operation.conversation_key, operation.conversation_id);
    return { owner: true, rebound: false, operation };
  }
  const oldTab = await chrome.tabs.get(Number(operation.tab_id)).catch(() => null);
  let oldOwnsConversation = false;
  if (oldTab?.id) {
    const oldIdentity = await tabIdentity(oldTab.id).catch(() => null);
    if (oldIdentity) oldOwnsConversation = conversationKeyFromIdentity(oldIdentity) === operation.conversation_key;
  }
  if (oldOwnsConversation) return { owner: false, reason: "duplicate_non_owner", owner_tab_id: operation.tab_id, operation };
  if (!allowRebind) return { owner: false, reason: "owner_unavailable", owner_tab_id: operation.tab_id, operation };
  await assertTabConversation(candidate, operation.conversation_key, operation.conversation_id);
  const rebound = await mutateManualOperation(operation.conversation_key, (current) => {
    if (!current || current.operation_id !== operation.operation_id || !manualOperationActive(current)) return current;
    return { ...current, tab_id: candidate };
  });
  return { owner: true, rebound: true, operation: rebound || operation };
}

async function manualRecoveryForContent(operation, candidateTabId) {
  if (!operation || !manualOperationActive(operation)) return { owner: true, recovery: null, operation };
  const owner = await manualOwnerDecision(operation, candidateTabId, { allowRebind: true });
  if (!owner.owner) return { ...owner, recovery: null };
  let current = owner.operation || operation;
  if (current.status === MANUAL_OPERATION_STATUSES.REQUESTING) {
    if (current.request_worker_session_id && current.request_worker_session_id !== WORKER_SESSION_ID) {
      if (current.command_batch) {
        await assertRunBinding(current);
        const result = await recoverSavedBatch(current);
        const prefixed = await applyPrefixToReport(current.conversation_key, result.report_text);
        current = await mutateManualOperation(current.conversation_key, (r) => {
          if (!r || r.operation_id !== current.operation_id || r.status !== 'requesting') return r;
          return {...r, artifact_refs:result.artifact_refs||[], status:'delivering', request_id:result.request_id, delivery_id:'manual-delivery-'+r.operation_id, outgoing_text:prefixed.outgoing_text, report_prefix_applied:prefixed.report_prefix_applied, request_worker_session_id:null};
        });
        return {owner:true,rebound:owner.rebound===true,operation:current,recovery:manualDeliveryRecoveryPayload(current)};
      }
      current = await mutateManualOperation(current.conversation_key, (record) => {
        if (!record || record.operation_id !== current.operation_id || record.status !== MANUAL_OPERATION_STATUSES.REQUESTING) return record;
        return {
          ...record,
          status: MANUAL_OPERATION_STATUSES.FAILED,
          completed_at: new Date().toISOString(),
          last_error: {
            code: "MANUAL_REQUEST_OUTCOME_UNKNOWN",
            message: "Service worker перезапустился во время ручного Wildberries API request. Исход запроса неизвестен; автоматический повтор запрещён."
          }
        };
      });
      await diagnostic("MANUAL_REQUEST_RECOVERY_BLOCKED_NO_RETRY", { operation_id: current?.operation_id || operation.operation_id, previous_worker_session_id: operation.request_worker_session_id || null, worker_session_id: WORKER_SESSION_ID }, { level: "error" });
      return { owner: true, rebound: owner.rebound === true, operation: current, recovery: null };
    }
    return { owner: true, rebound: owner.rebound === true, operation: current, recovery: null };
  }
  return { owner: true, rebound: owner.rebound === true, operation: current, recovery: manualDeliveryRecoveryPayload(current) };
}

async function completeManualOperation(message, sender, failed = false) {
  return WBDeliveryTransactions.complete(message,sender,failed);
}

async function tabMessage(tabId, message) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = value => { if (settled) return; settled = true; clearTimeout(timer); resolve(value); };
    // UI transport only. A deadline never authorizes another click/request;
    // persisted transaction state remains the authority after channel loss.
    const timer = setTimeout(() => finish({ok:false,code:'TAB_MESSAGE_TIMEOUT',error:'Вкладка не подтвердила ответ вовремя.'}), 30000);
    try {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        const error = chrome.runtime.lastError;
        if (error) return finish({ ok: false, code: "TAB_MESSAGE_ERROR", error: error.message });
        finish(response || { ok: false, code: "EMPTY_RESPONSE", error: "Пустой ответ вкладки." });
      });
    } catch (error) {
      finish({ ok: false, code: "TAB_MESSAGE_ERROR", error: String(error?.message || error) });
    }
  });
}

async function stopWatch(run, reason) {
  if (!run?.tab_id) return;
  await diagnostic("PROMPT_WATCH_STOP_REQUESTED", { run_id: run.run_id, tab_id: run.tab_id, reason: reason || "worker" });
  const response = await tabMessage(run.tab_id, { type: "WB_AUTO_STOP_WATCH", run_id: run.run_id, reason: reason || "worker" });
  await diagnostic("PROMPT_WATCH_STOP_RESPONSE", { run_id: run.run_id, tab_id: run.tab_id, ok: response?.ok === true, code: response?.code || null, error: response?.error || null }, { level: response?.ok === true ? "info" : "warning" });
}

async function beginWatch(run) {
  if(WBRuntime.AUTORUN_PRODUCTION_ENABLED!==true)return {ok:false,code:'WB_AUTORUN_NON_PRODUCTION'};
  if (!run || run.status !== BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND) return { ok: false, code: "RUN_NOT_WAITING" };
  await assertRunBinding(run);
  await assertTabConversation(run.tab_id, run.conversation_key, run.conversation_id);
  return tabMessage(run.tab_id, {
    type: "WB_AUTO_BEGIN_WATCH",
    run_id: run.run_id,
    conversation_key: run.conversation_key,
    origin: run.origin,
    conversation_id: run.conversation_id,
    watch_id: run.watch_id,
    assistant_baseline_ids: Array.isArray(run.assistant_baseline_ids) ? run.assistant_baseline_ids : []
  });
}

async function markRunError(conversationKey, code, message) {
  const key = normalizeConversationKey(conversationKey);
  const run = await mutateAutoRun(key, (current) => current ? {
    ...current,
    status: BridgeAutorunModel.RUN_STATUSES.ERROR,
    last_error: { code: String(code || "AUTO_RUN_ERROR"), message: String(message || "Autorun error"), at: new Date().toISOString() }
  } : null);
  if (run) await stopWatch(run, "run_error");
  return run;
}

async function ownerDecision(run, candidateTabId, { allowRebind = true } = {}) {
  const candidate = normalizeTabId(candidateTabId);
  if (!run) return { owner: false, reason: "run_missing", run: null };
  await assertRunBinding(run);
  if (Number(run.tab_id) === candidate) {
    await assertTabConversation(candidate, run.conversation_key, run.conversation_id);
    return { owner: true, rebound: false, run };
  }

  const oldTab = await chrome.tabs.get(Number(run.tab_id)).catch(() => null);
  let oldOwnsConversation = false;
  if (oldTab?.id) {
    const oldIdentity = await tabIdentity(oldTab.id).catch(() => null);
    if (oldIdentity) oldOwnsConversation = conversationKeyFromIdentity(oldIdentity) === run.conversation_key;
  }
  if (oldOwnsConversation) {
    return { owner: false, reason: "duplicate_non_owner", owner_tab_id: run.tab_id, run };
  }

  if (!allowRebind || BridgeAutorunModel.isTerminalStatus(run.status)) {
    return { owner: false, reason: "owner_unavailable", owner_tab_id: run.tab_id, run };
  }
  await assertTabConversation(candidate, run.conversation_key, run.conversation_id);
  const rebound = await mutateAutoRun(run.conversation_key, (current) => {
    if (!current || current.run_id !== run.run_id) return current;
    return { ...current, tab_id: candidate };
  });
  return { owner: true, rebound: true, run: rebound };
}

async function commitAutoStart(message, sender) {
  const key = normalizeConversationKey(message.conversation_key);
  const runId = String(message.run_id || "");
  const actorId = String(message.actor_id || "");
  const senderTabId = Number(sender?.tab?.id || 0);
  let run = await getAutoRun(key);
  if (!run || run.run_id !== runId) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_START_STATE_MISMATCH", error: "Run не найден или не совпадает." };
  }
  if (!Number.isInteger(senderTabId) || senderTabId !== Number(run.tab_id)) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_NON_OWNER_TAB", error: "Start commit пришёл не из owner-вкладки." };
  }
  await assertTabConversation(senderTabId, key, run.conversation_id);
  await assertRunBinding(run);
  const phase = run.start_delivery?.phase || BridgeAutorunModel.START_PHASES.NONE;
  if (phase === BridgeAutorunModel.START_PHASES.CONFIRMED) {
    return { ok: true, committed: true, click_allowed: false, already_confirmed: true };
  }
  if (phase === BridgeAutorunModel.START_PHASES.COMMITTED) {
    // Commit is the irreversible boundary. Even the same content runtime must never receive a second click grant.
    return { ok: true, committed: true, click_allowed: false, already_committed: true };
  }
  if (run.status !== BridgeAutorunModel.RUN_STATUSES.STARTING) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_START_STATE_MISMATCH", error: "Run не находится в start state." };
  }
  let clickAllowed = false;
  run = await mutateAutoRun(key, (current) => {
    if (!current || current.run_id !== runId || current.status !== BridgeAutorunModel.RUN_STATUSES.STARTING) return current;
    const currentPhase = current.start_delivery?.phase || BridgeAutorunModel.START_PHASES.NONE;
    if (currentPhase !== BridgeAutorunModel.START_PHASES.NONE) return current;
    clickAllowed = true;
    return BridgeAutorunModel.commitStart(current, {
      baselineUserTurnIds: message.baseline_user_turn_ids,
      actorId
    });
  });
  if (!clickAllowed) {
    return { ok: true, committed: true, click_allowed: false, already_committed: true };
  }
  await diagnostic("START_COMMITTED_BEFORE_CLICK", { run_id: runId, tab_id: senderTabId, actor_id: actorId || null, baseline_user_turn_count: run?.start_delivery?.baseline_user_turn_ids?.length || 0 });
  return { ok: true, committed: true, click_allowed: true, run: publicRun(run) };
}

async function finalizeCommittedStartFromComposerEmpty(key, runId, senderTabId, assistantBaselineIds = [], diagnostics = {}) {
  let didConfirm = false;
  let run = await mutateAutoRun(key, (current) => {
    if (!current || current.run_id !== runId) return current;
    if (current.start_delivery?.phase === BridgeAutorunModel.START_PHASES.CONFIRMED) return current;
    if (current.status !== BridgeAutorunModel.RUN_STATUSES.STARTING || current.start_delivery?.phase !== BridgeAutorunModel.START_PHASES.COMMITTED) return current;
    didConfirm = true;
    return BridgeAutorunModel.afterConfirmedStart(current, assistantBaselineIds || []);
  });
  if (!didConfirm && run?.start_delivery?.phase !== BridgeAutorunModel.START_PHASES.CONFIRMED) {
    return { ok: false, code: "AUTO_START_CONFIRM_RACE", error: "Start state изменился конкурентно до подтверждения." };
  }
  if (didConfirm) {
    await diagnostic("START_CONFIRMED", {
      run_id: runId,
      tab_id: senderTabId,
      confirmation_basis: "composer_empty_after_committed_click",
      click_attempts: Number(diagnostics.click_attempts || 0),
      status: run?.status || null
    });
    if (run?.status === BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND) await beginWatch(run);
    else if (run) await stopWatch(run, `start_complete:${run.status}`);
  }
  return { ok: true, confirmed: true, already_confirmed: !didConfirm, run: publicRun(run) };
}

async function completeAutoStart(message, sender) {
  const key = normalizeConversationKey(message.conversation_key);
  const runId = String(message.run_id || "");
  const actorId = String(message.actor_id || "");
  const senderTabId = Number(sender?.tab?.id || 0);
  const run = await getAutoRun(key);
  if (!run || run.run_id !== runId) {
    return { ok: false, code: "AUTO_START_STATE_MISMATCH", error: "Run не найден или не совпадает." };
  }
  if (!Number.isInteger(senderTabId) || senderTabId !== Number(run.tab_id)) {
    return { ok: false, code: "AUTO_NON_OWNER_TAB", error: "Start confirmation пришёл не из owner-вкладки." };
  }
  await assertTabConversation(senderTabId, key, run.conversation_id);
  await assertRunBinding(run);
  if (run.start_delivery?.phase === BridgeAutorunModel.START_PHASES.CONFIRMED) {
    return { ok: true, confirmed: true, already_confirmed: true, run: publicRun(run) };
  }
  if (run.status !== BridgeAutorunModel.RUN_STATUSES.STARTING) {
    return { ok: false, code: "AUTO_START_STATE_MISMATCH", error: "Run не находится в start state." };
  }
  if (run.start_delivery?.phase !== BridgeAutorunModel.START_PHASES.COMMITTED) {
    return { ok: false, code: "AUTO_START_NOT_COMMITTED", error: "Start ещё не committed." };
  }
  if (message.reconcile !== true && run.start_delivery?.commit_actor_id && actorId && run.start_delivery.commit_actor_id !== actorId) {
    return { ok: false, code: "AUTO_START_ACTOR_MISMATCH", error: "Start confirmation пришёл от другого content runtime." };
  }

  // Reference parity: for the normal start path, a committed click followed by an empty composer is the confirmation boundary.
  // Reconciliation may prove the same fact by locating the already-created user turn, but no user-turn DOM match is required here.
  if (message.composer_empty !== true) {
    await diagnostic("START_CONFIRMATION_PENDING", { run_id: runId, tab_id: senderTabId, click_attempts: Number(message.click_attempts || 0), confirmation_basis: "composer_not_empty" }, { level: "warning" });
    return { ok: true, confirmed: false, pending_reconciliation: true, run: publicRun(run) };
  }
  return await finalizeCommittedStartFromComposerEmpty(key, runId, senderTabId, message.assistant_baseline_ids || [], {
    click_attempts: message.click_attempts
  });
}

function startRecoveryPayload(run) {
  return {
    type: "dispatch_start",
    run_id: run.run_id,
    conversation_key: run.conversation_key,
    origin: run.origin,
    conversation_id: run.conversation_id,
    message_text: String(run.start_delivery?.message_text || "")
  };
}

function deliveryRecoveryPayload(run, type) {
  return {
    type,
    run_id: run.run_id,
    conversation_key: run.conversation_key,
    origin: run.origin,
    conversation_id: run.conversation_id,
    delivery_id: run.delivery?.delivery_id || "",
    request_id: run.delivery?.request_id || "",
    outgoing_text: String(run.delivery?.outgoing_text || ""),
    outgoing_hash: run.delivery?.outgoing_hash || "",
    report_prefix_applied: run.delivery?.report_prefix_applied === true,
    baseline_user_turn_ids: Array.isArray(run.delivery?.baseline_user_turn_ids) ? run.delivery.baseline_user_turn_ids : []
  };
}

async function recoveryPayloadForRun(run) {
  if(WBRuntime.AUTORUN_PRODUCTION_ENABLED!==true&&run?.status!=='delivering'&&run?.status!=='requesting')return {type:'retired_non_production',code:'WB_AUTORUN_NON_PRODUCTION',automatic_retry:false};
  if (!run || BridgeAutorunModel.isTerminalStatus(run.status)) return null;
  await assertRunBinding(run);
  if(run.status==='delivering'&&run.delivery?.manual_send_wait)return {...deliveryRecoveryPayload(run,'reconcile_manual_send'),manual_baseline_users:run.delivery.manual_baseline_users||[],manual_assistant_baseline:run.delivery.manual_assistant_baseline||[]};
  const decision = BridgeAutorunModel.recoveryDecision(run, WORKER_SESSION_ID);
  if (decision.type === "unsafe_request_outcome") {
    if (run.command_batch) {
      const result = await recoverSavedBatch(run);
      const prefixed = await applyPrefixToReport(run.conversation_key, result.report_text);
      const hash = await sha256Hex(prefixed.outgoing_text);
      const restored = await mutateAutoRun(run.conversation_key, (r) => {
        if (!r || r.run_id !== run.run_id || r.status !== 'requesting') return r;
        const claimed = BridgeAutorunModel.claimDelivery(r, {deliveryId:'batch-delivery-'+result.request_id,requestId:result.request_id,outgoingText:prefixed.outgoing_text,outgoingHash:hash,reportPrefixApplied:prefixed.report_prefix_applied});
        claimed.artifact_refs=result.artifact_refs||[];claimed.request_worker_session_id=null;return claimed;
      });
      return deliveryRecoveryPayload(restored, 'deliver_claimed');
    }
    const failed = await markRunError(run.conversation_key, decision.code, "Service worker перезапустился во время Wildberries API request. Исход запроса неизвестен; автоматический повтор запрещён, чтобы не создать второй provider API-вызов.");
    await diagnostic("REQUEST_RECOVERY_BLOCKED_NO_RETRY", { run_id: run.run_id, previous_worker_session_id: run.request_worker_session_id || null, worker_session_id: WORKER_SESSION_ID }, { level: "error" });
    return { type: "request_outcome_unknown", code: decision.code, run: publicRun(failed) };
  }
  if (decision.type === "dispatch_start") return startRecoveryPayload(run);
  if (decision.type === "reconcile_start") {
    return {
      ...startRecoveryPayload(run),
      type: "reconcile_start",
      baseline_user_turn_ids: Array.isArray(run.start_delivery?.baseline_user_turn_ids) ? run.start_delivery.baseline_user_turn_ids : []
    };
  }
  if (decision.type === "deliver_claimed") return deliveryRecoveryPayload(run, "deliver_claimed");
  if (decision.type === "reconcile_delivery") return deliveryRecoveryPayload(run, "reconcile_delivery");
  if (decision.type === "request_in_progress") return { type: "request_in_progress", run_id: run.run_id };
  if (decision.type === "paused") return { type: "paused", run_id: run.run_id };
  return null;
}

async function startAutoRun(conversationKey, tabId) {
  if(WBRuntime.AUTORUN_PRODUCTION_ENABLED!==true)throw wbError('WB_AUTORUN_NON_PRODUCTION');
  const key = normalizeConversationKey(conversationKey);
  const tab = normalizeTabId(tabId);
  const liveIdentity = await assertTabConversation(tab, key);
  await migrateLegacyConversationStorage(liveIdentity);
  const binding = await strictBindingForIdentity(liveIdentity);
  const settings = await getSettings();
  WBCredentials.normalizeSellerCredentials(settings.sellerCredentials, { required: true });
  if (!Object.values(WBContract.OPERATIONS).some((meta) => meta.execution_enabled === true)) throw Object.assign(new Error("Wildberries provider execution gate закрыт: нет ни одной implementation-ready READ operation."), { code: "PROVIDER_GATE_CLOSED" });
  if (await getManualMode(key)) throw Object.assign(new Error("Сначала отключите ручной режим Wildberries."), { code: "MANUAL_MODE_ACTIVE" });
  const manualOperation = await getManualOperation(key);
  if (manualOperationActive(manualOperation)) {
    await diagnostic("AUTO_MODE_START_BLOCKED_BY_MANUAL_OPERATION", { operation_id: manualOperation.operation_id || null, status: manualOperation.status || null, conversation_id: liveIdentity.conversation_id || null, tab_id: tab }, { level: "warning" });
    throw Object.assign(new Error("Дождитесь завершения уже принятого ручного Wildberries request/delivery."), { code: "MANUAL_OPERATION_ACTIVE" });
  }
  const existing = await getAutoRun(key);
  if (existing && !BridgeAutorunModel.isTerminalStatus(existing.status)) {
    throw Object.assign(new Error("Для этого диалога уже существует активный Wildberries autorun."), { code: "AUTO_RUN_ALREADY_ACTIVE" });
  }

  const startPrompt = await getAutoStartPrompt(key);
  const now = new Date().toISOString();
  let run = {
    run_id: `wbrun-${crypto.randomUUID()}`,
    conversation_key: key,
    origin: liveIdentity.origin,
    conversation_id: liveIdentity.conversation_id,
    binding_snapshot: bindingSnapshot(binding),
    tab_id: tab,
    status: BridgeAutorunModel.RUN_STATUSES.STARTING,
    sequence: 0,
    pause_requested: false,
    finish_requested: false,
    assistant_baseline_ids: [],
    watch_id: null,
    last_assistant_turn_id: null,
    last_command_fingerprint: null,
    last_operation: null,
    last_command_summary: null,
    last_error: null,
    start_delivery: {
      phase: BridgeAutorunModel.START_PHASES.NONE,
      message_text: String(startPrompt.text || ""),
      baseline_user_turn_ids: [],
      commit_actor_id: null,
      committed_at: null,
      confirmed_at: null
    },
    delivery: null,
    last_confirmed_delivery_id: null,
    last_confirmed_report_prefix_applied: false,
    last_confirmed_user_turn_id: null,
    created_at: now,
    updated_at: now
  };
  run = await mutateAutoRun(key, () => run);

  // Report prefix is deliberately NOT read or applied here. It belongs only to post-API result delivery.
  await diagnostic("START_DISPATCH_REQUESTED", { run_id: run.run_id, tab_id: tab });
  const response = await tabMessage(tab, {
    type: "WB_AUTO_SEND_START",
    run_id: run.run_id,
    conversation_key: key,
    origin: run.origin,
    conversation_id: run.conversation_id,
    message_text: startPrompt.text
  });
  await diagnostic("START_DISPATCH_RESPONSE", {
    run_id: run.run_id,
    tab_id: tab,
    ok: response?.ok === true,
    committed: response?.committed === true,
    composer_empty: response?.composer_empty === true,
    click_attempts: Number(response?.click_attempts || 0),
    code: response?.code || null,
    error: response?.error || null
  }, { level: response?.ok === true ? "info" : "warning" });

  run = await getAutoRun(key) || run;
  if (response?.ok && response?.composer_empty === true) {
    const finalized = await finalizeCommittedStartFromComposerEmpty(
      key,
      run.run_id,
      tab,
      Array.isArray(response.assistant_baseline_ids) ? response.assistant_baseline_ids : [],
      { click_attempts: response.click_attempts }
    );
    if (!finalized?.ok) throw Object.assign(new Error(finalized?.error || "Start composer confirmation failed."), { code: finalized?.code || "AUTO_START_CONFIRM_FAILED" });
    await diagnostic("START_SEND_COMPLETED", { run_id: run.run_id, tab_id: tab, click_attempts: Number(response?.click_attempts || 0) });
    return finalized.run;
  }
  if (!response?.ok) {
    if ((run.start_delivery?.phase || BridgeAutorunModel.START_PHASES.NONE) === BridgeAutorunModel.START_PHASES.NONE) {
      run = await markRunError(key, response?.code || "AUTO_START_FAILED", response?.error || "Не удалось подготовить/отправить стартовое сообщение autorun.");
      throw Object.assign(new Error(response?.error || "Не удалось отправить стартовое сообщение autorun."), { code: response?.code || "AUTO_START_FAILED" });
    }
    // After commit the click outcome can be ambiguous. Never auto-resend; leave STARTING for reconciliation.
    await diagnostic("START_RESPONSE_LOST_AFTER_COMMIT", { run_id: run.run_id, phase: run.start_delivery?.phase || null }, { level: "warning" });
  } else if ((run.start_delivery?.phase || BridgeAutorunModel.START_PHASES.NONE) === BridgeAutorunModel.START_PHASES.COMMITTED) {
    await diagnostic("START_CONFIRMATION_PENDING", { run_id: run.run_id, tab_id: tab, click_attempts: Number(response?.click_attempts || 0), confirmation_basis: "composer_not_empty" }, { level: "warning" });
  }
  return publicRun(await getAutoRun(key) || run);
}

async function handleAutoCommand(message, sender) {
  if(WBRuntime.AUTORUN_PRODUCTION_ENABLED!==true)throw wbError('WB_AUTORUN_NON_PRODUCTION');
  const key = normalizeConversationKey(message.conversation_key);
  const runId = String(message.run_id || "");
  const assistantTurnId = String(message.assistant_turn_id || "");
  const commandText = String(message.command_text || "");
  const senderTabId = Number(sender?.tab?.id || 0);
  const currentRun = await getAutoRun(key);
  if (!currentRun || currentRun.run_id !== runId) return { ok: false, accepted: false, code: "AUTO_RUN_NOT_FOUND", error: "Autorun не найден." };
  if (!Number.isInteger(senderTabId) || senderTabId !== Number(currentRun.tab_id)) {
    return { ok: false, accepted: false, code: "AUTO_NON_OWNER_TAB", error: "Этот WB_API_V1 block появился не во вкладке-owner активного autorun." };
  }
  try {
    await assertTabConversation(senderTabId, key, currentRun.conversation_id);
    await assertRunBinding(currentRun);
  } catch (error) { return { ok: false, accepted: false, code: error.code || "CONVERSATION_MISMATCH", error: error.message }; }
  if (await getManualMode(key)) return { ok: false, paused: true, code: "MANUAL_MODE_ACTIVE", error: "Ручной режим включён; autorun не выполняет команду." };
  let parsed;
  try { parsed = WBCommandProtocol.parse(commandText);
    if (parsed.entries.length === 1 && parsed.entries[0].code) throw Object.assign(new Error('Operation blocked locally.'), {code:parsed.entries[0].code});
  }
  catch (error) { return { ok: false, accepted: false, code: error.code || "INVALID_COMMAND", error: error.message }; }
  const fingerprint = parsed.fingerprint;

  let requestGranted = false;
  let run = await mutateAutoRun(key, (current) => {
    if (!current || current.run_id !== runId) return current;
    if (Number(current.tab_id) !== senderTabId) return current;
    if (current.status !== BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND) return current;
    if (current.last_assistant_turn_id === assistantTurnId && current.last_command_fingerprint === fingerprint) return current;
    requestGranted = true;
    return {
      ...current,
      status: BridgeAutorunModel.RUN_STATUSES.REQUESTING,
      request_worker_session_id: WORKER_SESSION_ID,
      request_started_at: new Date().toISOString(),
      last_assistant_turn_id: assistantTurnId,
      last_command_fingerprint: fingerprint,
      command_batch: null,
      last_operation: parsed.operation,
      last_command_summary: parsed.operation,
      last_error: null
    };
  });

  if (!run || run.run_id !== runId) return { ok: false, accepted: false, code: "AUTO_RUN_NOT_FOUND", error: "Autorun не найден." };
  if (!requestGranted) {
    return { ok: true, accepted: false, ignored: true, status: run.status };
  }

  await diagnostic("AUTO_COMMAND_ACCEPTED", { run_id: runId, tab_id: senderTabId, assistant_turn_id: assistantTurnId, operation: parsed.operation, command_fingerprint: fingerprint });
  let result;
  const requestStartedAt = Date.now();
  try {
    result = await executeWorkPlan(commandText, {mode:'auto',key,id:runId,tabId:senderTabId});
  } catch (error) {
    try {
      result = buildAutoExecutionErrorResult(parsed.entries[0].command, fingerprint, error, Date.now() - requestStartedAt);
      await diagnostic("AUTO_REQUEST_ERROR_REPORT_CREATED", {
        run_id: runId,
        operation: parsed.operation,
        request_id: result.request_id,
        code: WBContract.safeBridgeErrorPayload(error).code,
        http_status: result.http_status
      }, { level: "warning" });
    } catch (reportError) {
      await markRunError(key, reportError.code || "AUTO_ERROR_REPORT_FAILED", reportError.message || String(reportError));
      throw reportError;
    }
  }

  try {
    await assertRunBinding(await getAutoRun(key));
    await assertTabConversation(senderTabId, key, currentRun.conversation_id);
  } catch (error) {
    await markRunError(key,error.code || 'BATCH_DELIVERY_OWNER_CHANGED','Delivery owner changed; saved result not sent.');
    throw error;
  }
  const deliveryId = `delivery-${crypto.randomUUID()}`;
  const prefixed = await applyPrefixToReport(key, result.report_text);
  const outgoingHash = await sha256Hex(prefixed.outgoing_text);
  run = await mutateAutoRun(key, (current) => {
    if (!current || current.run_id !== runId) return current;
    const claimed = BridgeAutorunModel.claimDelivery(current, {
      deliveryId,
      requestId: result.request_id,
      outgoingText: prefixed.outgoing_text,
      outgoingHash,
      reportPrefixApplied: prefixed.report_prefix_applied === true
    });
    claimed.artifact_refs = result.artifact_refs || [];
    claimed.auto_send = result.auto_send !== false;
    claimed.request_worker_session_id = null;
    claimed.request_completed_at = new Date().toISOString();
    return claimed;
  });
  await diagnostic("DELIVERY_CLAIMED", { run_id: runId, delivery_id: deliveryId, request_id: result.request_id, report_prefix_applied: prefixed.report_prefix_applied === true, outgoing_hash: outgoingHash });

  // Reference parity: delivery is worker-owned and single-flight. The command caller only receives
  // acceptance metadata; it never starts a competing content-side delivery path.
  void attemptAutoDelivery(key, runId);

  return {
    ...result,
    ...prefixed,
    accepted: true,
    run_id: runId,
    delivery_id: deliveryId,
    outgoing_hash: outgoingHash,
    sequence: Number(run?.sequence || 0)
  };
}

function attemptAutoDelivery(conversationKey, runId) {
  const key = normalizeConversationKey(conversationKey);
  return singleFlight(deliveryAttemptRequests, String(runId || ""), async () => {
    const run = await getAutoRun(key);
    if (!run || BridgeAutorunModel.isTerminalStatus(run.status)) return { ok: false, code: "AUTO_RUN_NOT_ACTIVE" };
    if (run.status !== BridgeAutorunModel.RUN_STATUSES.DELIVERING || !run.delivery) return { ok: false, code: "AUTO_RUN_NOT_DELIVERING" };
    const phase = run.delivery.phase;
    if (![BridgeAutorunModel.DELIVERY_PHASES.CLAIMED, BridgeAutorunModel.DELIVERY_PHASES.COMMITTED].includes(phase)) {
      return { ok: false, code: "AUTO_DELIVERY_NOT_ACTIONABLE" };
    }
    const recovery = deliveryRecoveryPayload(run, phase === BridgeAutorunModel.DELIVERY_PHASES.COMMITTED ? "reconcile_delivery" : "deliver_claimed");
    const push = await tabMessage(Number(run.tab_id), { type: "WB_AUTO_DELIVERY_AVAILABLE", recovery });
    await diagnostic("DELIVERY_PUSH_RESPONSE", {
      run_id: run.run_id,
      delivery_id: run.delivery.delivery_id,
      phase,
      ok: push?.ok === true,
      code: push?.code || null
    }, { level: push?.ok === true ? "info" : "warning" });
    return push;
  });
}

async function commitAutoDelivery(message, sender) {
  const key = normalizeConversationKey(message.conversation_key);
  const runId = String(message.run_id || "");
  const deliveryId = String(message.delivery_id || "");
  const actorId = String(message.actor_id || "");
  const senderTabId = Number(sender?.tab?.id || 0);
  let run = await getAutoRun(key);
  if (!run || run.run_id !== runId || run.status !== BridgeAutorunModel.RUN_STATUSES.DELIVERING) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_DELIVERY_STATE_MISMATCH", error: "Run не находится в delivery state." };
  }
  if (!Number.isInteger(senderTabId) || senderTabId !== Number(run.tab_id)) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_NON_OWNER_TAB", error: "Delivery commit пришёл не из owner-вкладки." };
  }
  await assertTabConversation(senderTabId, key, run.conversation_id);
  await assertRunBinding(run);
  if (run.delivery?.delivery_id !== deliveryId) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_DELIVERY_ID_MISMATCH", error: "Delivery ID не совпадает с активной доставкой." };
  }
  if (run.delivery?.phase === BridgeAutorunModel.DELIVERY_PHASES.CONFIRMED) {
    return { ok: true, committed: true, click_allowed: false, already_confirmed: true };
  }
  if (run.delivery?.phase === BridgeAutorunModel.DELIVERY_PHASES.COMMITTED) {
    // Commit is the irreversible boundary. Never grant a second browser click after it, even to the same runtime.
    return { ok: true, committed: true, click_allowed: false, already_committed: true, recovery: deliveryRecoveryPayload(run, "reconcile_delivery") };
  }
  if (run.delivery?.phase !== BridgeAutorunModel.DELIVERY_PHASES.CLAIMED) {
    return { ok: false, committed: false, click_allowed: false, code: "AUTO_DELIVERY_NOT_CLAIMED", error: "Delivery ещё не claimable." };
  }
  let clickAllowed = false;
  run = await mutateAutoRun(key, (current) => {
    if (!current || current.run_id !== runId || current.delivery?.delivery_id !== deliveryId) return current;
    if (current.delivery?.phase !== BridgeAutorunModel.DELIVERY_PHASES.CLAIMED) return current;
    clickAllowed = true;
    return BridgeAutorunModel.commitDelivery(current, {
      deliveryId,
      baselineUserTurnIds: message.baseline_user_turn_ids,
      actorId
    });
  });
  if (!clickAllowed) {
    const latest = await getAutoRun(key);
    return { ok: true, committed: true, click_allowed: false, already_committed: true, recovery: latest ? deliveryRecoveryPayload(latest, "reconcile_delivery") : null };
  }
  await diagnostic("DELIVERY_COMMITTED_BEFORE_CLICK", { run_id: runId, delivery_id: deliveryId, tab_id: senderTabId, actor_id: actorId || null, baseline_user_turn_count: run?.delivery?.baseline_user_turn_ids?.length || 0 });
  return { ok: true, committed: true, click_allowed: true, run: publicRun(run) };
}

async function completeAutoDelivery(message, sender) {
  const key = normalizeConversationKey(message.conversation_key);
  const runId = String(message.run_id || "");
  const deliveryId = String(message.delivery_id || "");
  let currentRun = await getAutoRun(key);
  if (!currentRun || currentRun.run_id !== runId) {
    throw Object.assign(new Error("Delivery confirmation не соответствует активному autorun."), { code: "AUTO_DELIVERY_STATE_MISMATCH" });
  }
  const senderTabId = Number(sender?.tab?.id || 0);
  if (!Number.isInteger(senderTabId) || senderTabId !== Number(currentRun.tab_id)) {
    throw Object.assign(new Error("Delivery confirmation пришёл не из owner-вкладки autorun."), { code: "AUTO_NON_OWNER_TAB" });
  }
  await assertTabConversation(senderTabId, key, currentRun.conversation_id);
  await assertRunBinding(currentRun);

  // Duplicate confirmation after an already finalized delivery is idempotent.
  if (deliveryId && currentRun.last_confirmed_delivery_id === deliveryId) {
    await noteConfirmedPrefix(key, currentRun.last_confirmed_report_prefix_applied === true, deliveryId);
    return publicRun(currentRun);
  }
  if (currentRun.status !== BridgeAutorunModel.RUN_STATUSES.DELIVERING) {
    throw Object.assign(new Error("Run больше не находится в delivery state."), { code: "AUTO_DELIVERY_STATE_MISMATCH" });
  }
  if (!deliveryId || currentRun.delivery?.delivery_id !== deliveryId) {
    throw Object.assign(new Error("Delivery confirmation ID не совпадает с активной доставкой."), { code: "AUTO_DELIVERY_ID_MISMATCH" });
  }
  if (currentRun.delivery?.phase !== BridgeAutorunModel.DELIVERY_PHASES.COMMITTED) {
    throw Object.assign(new Error("Delivery confirmation разрешён только после commit."), { code: "AUTO_DELIVERY_NOT_COMMITTED" });
  }
  await diagnostic("DELIVERY_CONFIRMATION_RECEIVED", { run_id: runId, delivery_id: deliveryId, delivery_confirmed: message.delivery_confirmed === true, composer_empty: message.composer_empty === true, click_attempts: Number(message.click_attempts || 0) }, { level: message.delivery_confirmed === true ? "info" : "warning" });
  if (message.delivery_confirmed !== true) {
    const pending = await mutateAutoRun(key, (current) => {
      if (!current || current.run_id !== runId || current.delivery?.delivery_id !== deliveryId) return current;
      return {
        ...current,
        last_error: {
          code: "DELIVERY_CONFIRMATION_PENDING",
          message: "Send был committed, но новый user-turn пока не подтверждён. Автоматический повтор Send/API запрещён; разрешена только reconciliation.",
          at: new Date().toISOString(),
          recoverable: true
        }
      };
    });
    return publicRun(pending);
  }

  // Prefix accounting is idempotent by delivery_id, so duplicate/concurrent confirmations cannot increment twice.
  const prefixApplied = currentRun.delivery?.report_prefix_applied === true;
  await noteConfirmedPrefix(key, prefixApplied, deliveryId);

  let didConfirm = false;
  let run = await mutateAutoRun(key, (current) => {
    if (!current || current.run_id !== runId) return current;
    if (current.last_confirmed_delivery_id === deliveryId) return current;
    if (current.status !== BridgeAutorunModel.RUN_STATUSES.DELIVERING || current.delivery?.delivery_id !== deliveryId || current.delivery?.phase !== BridgeAutorunModel.DELIVERY_PHASES.COMMITTED) return current;
    didConfirm = true;
    const confirmedCurrent = {
      ...current,
      delivery: {
        ...current.delivery,
        phase: BridgeAutorunModel.DELIVERY_PHASES.CONFIRMED,
        confirmed_at: new Date().toISOString(),
        confirmed_user_turn_id: message.confirmed_user_turn_id || null
      }
    };
    const next = BridgeAutorunModel.afterConfirmedDelivery(confirmedCurrent);
    next.last_confirmed_delivery_id = deliveryId;
    next.last_confirmed_report_prefix_applied = prefixApplied;
    next.last_confirmed_user_turn_id = message.confirmed_user_turn_id || null;
    next.delivery = null;
    if (next.status === BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND) {
      next.assistant_baseline_ids = Array.isArray(message.assistant_baseline_ids) ? message.assistant_baseline_ids : [];
      next.watch_id = `watch-${crypto.randomUUID()}`;
    }
    return next;
  });
  if (!run || run.run_id !== runId) return null;
  if (!didConfirm && run.last_confirmed_delivery_id !== deliveryId) {
    throw Object.assign(new Error("Delivery state изменился конкурентно до подтверждения."), { code: "AUTO_DELIVERY_CONFIRM_RACE" });
  }
  if (didConfirm) {
    await diagnostic("DELIVERY_COMPLETED", { run_id: runId, status: run.status, sequence: Number(run.sequence || 0), delivery_id: deliveryId });
    if (run.status === BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND) await beginWatch(run);
    else await stopWatch(run, `delivery_complete:${run.status}`);
  }
  return publicRun(run);
}

async function failAutoDelivery(message, sender) {
  const key = normalizeConversationKey(message.conversation_key);
  const run = await getAutoRun(key);
  if (!run || run.run_id !== String(message.run_id || "")) return null;
  const senderTabId = Number(sender?.tab?.id || 0);
  if (!Number.isInteger(senderTabId) || senderTabId !== Number(run.tab_id)) return publicRun(run);
  await assertTabConversation(senderTabId, key, run.conversation_id).catch(() => null);
  if (run.status === BridgeAutorunModel.RUN_STATUSES.DELIVERING && run.delivery) {
    const preserved = await mutateAutoRun(key, (current) => {
      if (!current || current.run_id !== run.run_id) return current;
      return {
        ...current,
        last_error: {
          code: String(message.code || "DELIVERY_FAILED"),
          message: String(message.error || "Не удалось доставить Wildberries result в ChatGPT."),
          at: new Date().toISOString(),
          recoverable: true
        }
      };
    });
    await diagnostic("DELIVERY_FAILED_BUT_PRESERVED", { run_id: run.run_id, delivery_id: run.delivery?.delivery_id || null, phase: run.delivery?.phase || null, code: message.code || "DELIVERY_FAILED" }, { level: "warning" });
    return publicRun(preserved);
  }
  const failed = await markRunError(key, message.code || "DELIVERY_FAILED", message.error || "Не удалось доставить Wildberries result в ChatGPT.");
  return publicRun(failed);
}

async function pauseAutoRun(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const existing = await getAutoRun(key);
  if (!existing) throw Object.assign(new Error("Активный autorun не найден."), { code: "AUTO_RUN_NOT_FOUND" });
  await assertRunBinding(existing);
  let shouldStopWatch = false;
  const run = await mutateAutoRun(key, (current) => {
    if (!current) return null;
    const decision = BridgeAutorunModel.pauseDecision(current.status);
    if (decision === "immediate") {
      shouldStopWatch = true;
      return { ...current, status: BridgeAutorunModel.RUN_STATUSES.PAUSED, pause_requested: false };
    }
    if (decision === "deferred") return { ...current, pause_requested: true };
    return current;
  });
  if (!run) throw Object.assign(new Error("Активный autorun не найден."), { code: "AUTO_RUN_NOT_FOUND" });
  if (shouldStopWatch) await stopWatch(run, "operator_pause");
  return publicRun(run);
}

async function resumeAutoRun(conversationKey, tabId) {
  if(WBRuntime.AUTORUN_PRODUCTION_ENABLED!==true)throw wbError('WB_AUTORUN_NON_PRODUCTION');
  const key = normalizeConversationKey(conversationKey);
  const tab = normalizeTabId(tabId);
  if (await getManualMode(key)) throw Object.assign(new Error("Перед продолжением autorun выключите ручной режим Wildberries."), { code: "MANUAL_MODE_ACTIVE" });
  const manualOperation = await getManualOperation(key);
  if (manualOperationActive(manualOperation)) throw Object.assign(new Error("Дождитесь завершения уже принятого ручного Wildberries request/delivery."), { code: "MANUAL_OPERATION_ACTIVE" });
  const settings = await getSettings();
  WBCredentials.normalizeSellerCredentials(settings.sellerCredentials, { required: true });
  if (!Object.values(WBContract.OPERATIONS).some((meta) => meta.execution_enabled === true)) throw Object.assign(new Error("Wildberries provider execution gate закрыт: нет ни одной implementation-ready READ operation."), { code: "PROVIDER_GATE_CLOSED" });
  const current = await getAutoRun(key);
  if (!current || current.status !== BridgeAutorunModel.RUN_STATUSES.PAUSED) throw Object.assign(new Error("Run не находится на паузе."), { code: "AUTO_RUN_NOT_PAUSED" });
  await assertRunBinding(current);

  const owner = await ownerDecision(current, tab, { allowRebind: true });
  if (!owner.owner) {
    throw Object.assign(new Error(`Этот autorun принадлежит другой вкладке ChatGPT (tab ${owner.owner_tab_id || current.tab_id}).`), { code: "AUTO_NON_OWNER_TAB" });
  }
  const ownedRun = owner.run || current;
  const baseline = await tabMessage(tab, {
    type: "WB_AUTO_GET_BASELINE",
    run_id: ownedRun.run_id,
    conversation_key: key,
    conversation_id: ownedRun.conversation_id
  });
  if (!baseline.ok) throw Object.assign(new Error(baseline.error || "Не удалось получить baseline ChatGPT."), { code: baseline.code || "BASELINE_FAILED" });
  const run = await mutateAutoRun(key, (runNow) => {
    if (!runNow || runNow.run_id !== ownedRun.run_id || runNow.status !== BridgeAutorunModel.RUN_STATUSES.PAUSED) return runNow;
    return {
      ...runNow,
      tab_id: tab,
      status: BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND,
      pause_requested: false,
      assistant_baseline_ids: Array.isArray(baseline.assistant_baseline_ids) ? baseline.assistant_baseline_ids : [],
      watch_id: `watch-${crypto.randomUUID()}`
    };
  });
  if (run?.status === BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND) await beginWatch(run);
  return publicRun(run);
}

async function stopAutoRun(conversationKey) {
  const key = normalizeConversationKey(conversationKey);
  const existing = await getAutoRun(key);
  if (!existing) throw Object.assign(new Error("Autorun не найден."), { code: "AUTO_RUN_NOT_FOUND" });
  await assertRunBinding(existing);
  let stopNow = false;
  const run = await mutateAutoRun(key, (current) => {
    if (!current) return null;
    if (current.status === BridgeAutorunModel.RUN_STATUSES.REQUESTING || current.status === BridgeAutorunModel.RUN_STATUSES.DELIVERING || current.status === BridgeAutorunModel.RUN_STATUSES.STARTING) {
      return { ...current, finish_requested: true };
    }
    stopNow = true;
    return { ...current, status: BridgeAutorunModel.RUN_STATUSES.STOPPED, finish_requested: false, pause_requested: false };
  });
  if (!run) throw Object.assign(new Error("Autorun не найден."), { code: "AUTO_RUN_NOT_FOUND" });
  if (stopNow) await stopWatch(run, "operator_finish");
  return publicRun(run);
}

async function testConnection() {
  const settings = await getSettings();
  WBCredentials.normalizeSellerCredentials(settings.sellerCredentials, { required: true });
  try {
    const response = await WBProvider.testConnection(settings.sellerCredentials);
    const message = response.ok
      ? `Wildberries Seller API доступен. /ping HTTP ${response.http_status}.`
      : `${response.message || "Wildberries Seller API вернул ошибку."}`;
    const status = await setStatus({
      ok: response.ok,
      code: response.ok ? "CONNECTED" : (response.code || "WB_API_ERROR"),
      message,
      http_status: response.http_status
    });
    return { ...response, ...status, message };
  } catch (error) {
    const status = await setStatus({ ok: false, code: error.code || "CONNECTION_TEST_FAILED", message: error.message || String(error), http_status: 0 });
    return { ok: false, ...status };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if(["WB_AUTO_START","WB_AUTO_RESUME","WB_AUTO_COMMAND_READY","WB_AUTO_START_COMMIT_REQUEST","WB_AUTO_START_COMPLETE"].includes(message?.type))return {ok:false,accepted:false,code:'WB_AUTORUN_NON_PRODUCTION',external_request_executed:false,automatic_retry:false};
    if(["WB_RESOLVE_POPUP_CONTEXT","WB_GET_SETTINGS_STATE","WB_GET_GLOBAL_SETTINGS_STATE","WB_GET_DIAGNOSTICS","WB_CLEAR_DIAGNOSTICS","WB_SET_MANUAL_MODE","WB_AUTO_PAUSE","WB_AUTO_STOP"].includes(message?.type))wbPopupOnly(sender);
    if (["WB_WORK_START_COMMIT_REQUEST","WB_WORK_START_SEND_OUTCOME","WB_WORK_PENDING_IDENTITY","WB_WORK_START_RECOVER","WB_WORK_PENDING_TIMEOUT","WB_WORK_PENDING_CANCEL","WB_WORK_PENDING_STATE"].includes(message?.type)) return WBWorkStart.handle(message,sender);
    if (["WB_DELIVERY_INSERT_COMMIT","WB_DELIVERY_ATTACHMENT_FAILED","WB_DELIVERY_SEND_ROLLBACK","WB_DELIVERY_STAGE","WB_DELIVERY_ATTACH_COMMIT","WB_LOCAL_COMMAND_ERROR","WB_LOCAL_RESULTS_PENDING"].includes(message?.type)) return WBDeliveryTransactions.extra(message,sender);
    if (["WB_EXPORT_CREDENTIALS","WB_IMPORT_CREDENTIALS","WB_CLEAR_CREDENTIALS","WB_SAVE_GLOBAL_SETTINGS","WB_SAVE_SETTINGS","WB_TEST_CONNECTION","WB_RESET_AUTO_START_PROMPT","WB_RESET_GLOBAL_AUTO_START_PROMPT","WB_BIND_CONVERSATION"].includes(message?.type)) wbPopupOnly(sender);
    if (["WB_WORK_RECOVERY_RESUME", "WB_GET_QUOTA_STATE", "WB_AUTO_DELIVERY_STAGED", "WB_AUTO_MANUAL_SEND_CONFIRMED", "WB_GET_RUNTIME_OPTIONS","WB_SAVE_RUNTIME_OPTIONS","WB_WORK_ACTION","WB_WORK_STATE","WB_NEW_CONTEXT","WB_BOOTSTRAP_STATE","WB_DELIVERY_PREPARE","WB_MANUAL_DELIVERY_COMMIT_REQUEST","WB_DELIVERY_FILES_STAGED"].includes(message?.type)) return wbExtraMessage(message,sender);
    switch (message?.type) {
      case "WB_RESOLVE_POPUP_CONTEXT": {
        const context = await resolvePopupContext(message.tab_id, message.identity || null);
        return { ok: true, context };
      }
      case "WB_BIND_CONVERSATION": {
        const binding = await bindConversation(message.context || {});
        return { ok: true, binding, state: await publicSettingsState(binding.conversation_key) };
      }
      case "WB_GET_SETTINGS_STATE":
        return { ok: true, state: await publicSettingsState(message.conversation_key) };
      case "WB_GET_GLOBAL_SETTINGS_STATE":
        return { ok: true, state: await publicGlobalSettingsState(message.page_context_error || null) };
      case "WB_SAVE_GLOBAL_SETTINGS": {
        const current = await getSettings();
        const values = { [KEYS.AUTO_SEND]: message.auto_send !== false };
        const newClientId = typeof message.seller_client_id === "string" ? message.seller_client_id.trim() : "";
        const rejectedSecret = typeof message.seller_api_key === "string" ? message.seller_api_key.trim() : "";
        if (rejectedSecret) throw Object.assign(new Error("X-Client-Secret не поддерживается в Personal-token сборке."), { code: "CLIENT_SECRET_UNSUPPORTED_PERSONAL_BUILD" });
        if (newClientId) {
          const credentials = WBCredentials.normalizeSellerCredentials({
            clientId: newClientId || current.sellerCredentials.clientId,
            tokenType: "personal"
          }, { required: true });
          values[KEYS.SELLER_CLIENT_ID] = credentials.clientId;
          await storageRemove(KEYS.SELLER_API_KEY);
        }
        await storageSet(values);
        return { ok: true, state: await publicGlobalSettingsState(message.page_context_error || null) };
      }
      case "WB_SAVE_SETTINGS": {
        const key = normalizeConversationKey(message.conversation_key);
        const current = await getSettings();
        const values = { [KEYS.AUTO_SEND]: message.auto_send !== false };
        const newClientId = typeof message.seller_client_id === "string" ? message.seller_client_id.trim() : "";
        const rejectedSecret = typeof message.seller_api_key === "string" ? message.seller_api_key.trim() : "";
        if (rejectedSecret) throw Object.assign(new Error("X-Client-Secret не поддерживается в Personal-token сборке."), { code: "CLIENT_SECRET_UNSUPPORTED_PERSONAL_BUILD" });
        if (newClientId) {
          const credentials = WBCredentials.normalizeSellerCredentials({
            clientId: newClientId || current.sellerCredentials.clientId,
            tokenType: "personal"
          }, { required: true });
          values[KEYS.SELLER_CLIENT_ID] = credentials.clientId;
          await storageRemove(KEYS.SELLER_API_KEY);
        }
        await storageSet(values);
        await saveReportPrefix(key, message);
        if (typeof message.auto_start_prompt_text === "string") await saveAutoStartPrompt(key, message.auto_start_prompt_text);
        return { ok: true, state: await publicSettingsState(key) };
      }
      case "WB_RESET_GLOBAL_AUTO_START_PROMPT": {
        await resetGlobalAutoStartPrompt();
        return {ok:true,options:await wbOptions()};
      }
      case "WB_RESET_AUTO_START_PROMPT": {
        const key = normalizeConversationKey(message.conversation_key);
        await resetAutoStartPrompt(key);
        return { ok: true, state: await publicSettingsState(key) };
      }
      case "WB_SET_MANUAL_MODE": {
        const key = normalizeConversationKey(message.conversation_key);
        if (message.enabled === true) {
          const tab = normalizeTabId(message.tab_id);
          const liveIdentity = await assertTabConversation(tab, key);
          await strictBindingForIdentity(liveIdentity);
        }
        const enabled = await setManualMode(key, message.enabled === true);
        return { ok: true, enabled, state: await publicSettingsState(key) };
      }
      case "WB_GET_MANUAL_STATE": {
        const key = normalizeConversationKey(message.conversation_key);
        const senderTabId = Number(sender?.tab?.id || 0);
        if (senderTabId <= 0) return { ok: true, enabled: false, bound: false };
        const liveIdentity = await assertTabConversation(senderTabId, key);
        try {
          await strictBindingForIdentity(liveIdentity);
        } catch (error) {
          if (error?.code === "CONVERSATION_NOT_BOUND") return { ok: true, enabled: false, bound: false };
          throw error;
        }
        return { ok: true, enabled: await getManualMode(key), bound: true, work: await wbWorkRead(key), manual_operation_active: manualOperationActive(await getManualOperation(key)) };
      }
      case "WB_CONTENT_READY":
      case "WB_CONTENT_SYNC": {
        const senderTabId = Number(sender?.tab?.id || 0);
        if (!Number.isInteger(senderTabId) || senderTabId <= 0) return { ok: false, code: "CONTENT_TAB_MISSING", error: "Content sync пришёл без ChatGPT tab." };
        const identity = normalizeIdentity(message.identity || {});
        const key = await resolveConfirmedConversationKey(identity);
        const liveIdentity = await assertTabConversation(senderTabId, key, identity.conversation_id);
        let binding = null;
        try { binding = await strictBindingForIdentity(liveIdentity); } catch (error) { if (error?.code !== "CONVERSATION_NOT_BOUND") throw error; }
        const contentAccountScope=await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials));
        let run = await getAutoRun(key);
        if(run?.account_scope!==contentAccountScope)run=null;
        let manualOperation = binding ? await getManualOperation(key) : null;
        if(manualOperation?.account_scope!==contentAccountScope)manualOperation=null;
        let manualRecovery = null;
        let manualOwner = Boolean(binding);
        let manualRebound = false;
        if (binding && manualOperationActive(manualOperation)) {
          const manualDecision = await manualRecoveryForContent(manualOperation, senderTabId);
          manualOwner = manualDecision.owner === true;
          manualRebound = manualDecision.rebound === true;
          manualOperation = manualDecision.operation || manualOperation;
          manualRecovery = manualDecision.recovery || null;
          if (manualRebound) await diagnostic("MANUAL_OPERATION_TAB_REBOUND_AFTER_OLD_TAB_GONE", { operation_id: manualOperation?.operation_id || null, tab_id: senderTabId, status: manualOperation?.status || null });
        }
        let owner = Boolean(binding);
        let ownerTabId = run?.tab_id || null;
        let rebound = false;
        if (binding && run && !BridgeAutorunModel.isTerminalStatus(run.status)) {
          const decision = await ownerDecision(run, senderTabId, { allowRebind: true });
          owner = decision.owner === true;
          ownerTabId = decision.owner_tab_id || decision.run?.tab_id || run.tab_id;
          rebound = decision.rebound === true;
          run = decision.run || run;
          if (rebound) await diagnostic("RUN_TAB_REBOUND_AFTER_OLD_TAB_GONE", { run_id: run.run_id, tab_id: senderTabId, status: run.status });
        }
        let recovery = null;
        if (owner && run && !BridgeAutorunModel.isTerminalStatus(run.status)) {
          if (run.status === BridgeAutorunModel.RUN_STATUSES.DELIVERING && run.delivery) {
            // Same as the reference CONTENT_READY contour: the worker resumes its own cycle.
            // Do not hand a second claimed-delivery execution path back to content.
            setTimeout(() => { void attemptAutoDelivery(key, run.run_id); }, 0);
          } else {
            recovery = await recoveryPayloadForRun(run);
          }
          run = await getAutoRun(key) || run;
        }
        const manualEnabled=binding ? await getManualMode(key) : false;
        await assertTabConversation(senderTabId,key,identity.conversation_id);
        if(await WBPolicyEngine.accountKey(JSON.stringify((await getSettings()).sellerCredentials))!==contentAccountScope)throw wbError('DELIVERY_ACCOUNT_CHANGED');
        return {
          ok: true,
          conversation_key: key,
          identity: liveIdentity,
          binding: binding ? { bound: true, ...binding } : { bound: false, binding_id: null, revision: null },
          owner,
          owner_tab_id: ownerTabId,
          rebound,
          manual_mode: manualEnabled,
          manual_operation: binding ? publicManualOperation(manualOperation) : null,
          manual_operation_owner: manualOwner,
          manual_operation_rebound: manualRebound,
          manual_recovery: manualOwner ? manualRecovery : null,
          auto_run: publicRun(run),
          recovery,
          auto_watch: WBRuntime.AUTORUN_PRODUCTION_ENABLED===true && owner && run?.status === BridgeAutorunModel.RUN_STATUSES.WAITING_COMMAND ? {
            run_id: run.run_id,
            conversation_key: run.conversation_key,
            origin: run.origin,
            conversation_id: run.conversation_id,
            watch_id: run.watch_id,
            assistant_baseline_ids: Array.isArray(run.assistant_baseline_ids) ? run.assistant_baseline_ids : [],
            status: run.status
          } : null
        };
      }
      case "WB_EXPORT_CREDENTIALS": {
        const backup = await exportSellerCredentialsBackup();
        await diagnostic("CREDENTIALS_EXPORTED", { backup_version: backup.backup_version, contains_secrets: true });
        return { ok: true, backup };
      }
      case "WB_IMPORT_CREDENTIALS": {
        const credentialState = await importSellerCredentialsBackup(message.backup);
        await diagnostic("CREDENTIALS_IMPORTED", { backup_version: Number(message.backup?.backup_version || 0), seller_credentials_present: credentialState.seller_credentials_present === true });
        if (typeof message.conversation_key === "string" && message.conversation_key.trim()) return { ok: true, state: await publicSettingsState(message.conversation_key) };
        return { ok: true, state: await publicGlobalSettingsState(message.page_context_error || null) };
      }
      case "WB_CLEAR_CREDENTIALS": {
        await storageRemove([KEYS.SELLER_CLIENT_ID, KEYS.SELLER_API_KEY]);
        await setStatus({ ok: false, code: "CREDENTIALS_CLEARED", message: "Wildberries Personal token удалён из chrome.storage.local." });
        if (typeof message.conversation_key === "string" && message.conversation_key.trim()) return { ok: true, state: await publicSettingsState(message.conversation_key) };
        return { ok: true, state: await publicGlobalSettingsState(message.page_context_error || null) };
      }
      case "WB_TEST_CONNECTION":
        return await testConnection();
      case "WB_EXECUTE_COMMAND":
        try {return await executeManualCommand(String(message.command_text || ""), message.conversation_key, sender, message.manual_request_id);}
        catch(error){return await WBDeliveryTransactions.localError(message,sender,error);}
      case "WB_MANUAL_DELIVERY_COMPLETE":
        return await completeManualOperation(message, sender, false);
      case "WB_MANUAL_DELIVERY_FAILED":
        return await completeManualOperation(message, sender, true);
      case "WB_REPORT_DELIVERY_CONFIRMED":
        return WBDeliveryTransactions.confirmPrefix(message,sender);
      case "WB_GET_AUTO_RECOVERY": {
        const key = normalizeConversationKey(message.conversation_key);
        const senderTabId = Number(sender?.tab?.id || 0);
        const run = await getAutoRun(key);
        if (!run || run.run_id !== String(message.run_id || "")) return { ok: false, code: "AUTO_RUN_NOT_FOUND", error: "Autorun не найден." };
        const owner = await ownerDecision(run, senderTabId, { allowRebind: true });
        if (!owner.owner) return { ok: false, code: "AUTO_NON_OWNER_TAB", error: "Recovery запрошен не owner-вкладкой." };
        const recovery = await recoveryPayloadForRun(owner.run || run);
        return { ok: true, recovery };
      }
      case "WB_AUTO_START":
        return { ok: true, run: await startAutoRun(message.conversation_key, message.tab_id) };
      case "WB_AUTO_START_COMMIT_REQUEST":
        return await commitAutoStart(message, sender);
      case "WB_AUTO_START_COMPLETE":
        return await completeAutoStart(message, sender);
      case "WB_AUTO_PAUSE":
        return { ok: true, run: await pauseAutoRun(message.conversation_key) };
      case "WB_AUTO_RESUME":
        return { ok: true, run: await resumeAutoRun(message.conversation_key, message.tab_id) };
      case "WB_AUTO_STOP":
        return { ok: true, run: await stopAutoRun(message.conversation_key) };
      case "WB_AUTO_COMMAND_READY":
        return await handleAutoCommand(message, sender);
      case "WB_AUTO_DELIVERY_COMMIT_REQUEST":
        return await commitAutoDelivery(message, sender);
      case "WB_AUTO_DELIVERY_COMPLETE":
        return { ok: true, run: await completeAutoDelivery(message, sender) };
      case "WB_AUTO_DELIVERY_FAILED":
        return { ok: true, run: await failAutoDelivery(message, sender) };
      case "WB_GET_SEND_BUTTON_PROFILE": {
        const data = await storageGet(KEYS.SEND_BUTTON_PROFILE);
        return { ok: true, profile: data[KEYS.SEND_BUTTON_PROFILE] || null };
      }
      case "WB_SAVE_SEND_BUTTON_PROFILE": {
        const profile = message.profile || null;
        if (!profile || profile.kind !== "bb2_manual_send_button_v1") throw new Error("Invalid send button profile.");
        await storageSet({ [KEYS.SEND_BUTTON_PROFILE]: profile });
        const tabs = await chrome.tabs.query({ url: WBAIDeliveryCapabilities.implementedContentScriptPatterns() }).catch(() => []);
        await Promise.all(tabs.map((tab) => tab.id ? tabMessage(tab.id, { type: "WB_SET_SEND_BUTTON_PROFILE", profile }).catch(() => null) : null));
        await diagnostic("SEND_BUTTON_PROFILE_SAVED", { kind: profile.kind, tag: profile.tag, testid: profile.testid, aria: profile.aria });
        return { ok: true };
      }
      case "WB_CLEAR_SEND_BUTTON_PROFILE": {
        await storageSet({ [KEYS.SEND_BUTTON_PROFILE]: null });
        const tabs = await chrome.tabs.query({ url: WBAIDeliveryCapabilities.implementedContentScriptPatterns() }).catch(() => []);
        await Promise.all(tabs.map((tab) => tab.id ? tabMessage(tab.id, { type: "WB_SET_SEND_BUTTON_PROFILE", profile: null }).catch(() => null) : null));
        await diagnostic("SEND_BUTTON_PROFILE_CLEARED", {});
        return { ok: true };
      }
      case "WB_GET_COPY_BUTTON_PROFILES": {
        const profiles = await getCopyButtonProfiles();
        return { ok: true, profiles, builtin_adapter_count: BB2ManualControls.BUILTIN_MANUAL_COPY_ADAPTER_COUNT };
      }
      case "WB_SAVE_COPY_BUTTON_PROFILE": {
        const normalized = BB2ManualControls.normalizeCopyButtonProfile(message.profile || null);
        if (!normalized) throw Object.assign(new Error("Invalid Copy button profile."), { code: "INVALID_COPY_BUTTON_PROFILE" });
        const profiles = await saveCopyButtonProfile(normalized);
        await diagnostic("COPY_BUTTON_PROFILE_ADDED", { adapter_id: normalized.adapter_id, testid: normalized.testid || null, aria: normalized.aria || null, custom_profile_count: profiles.profiles.length });
        return { ok: true, profiles, builtin_adapter_count: BB2ManualControls.BUILTIN_MANUAL_COPY_ADAPTER_COUNT };
      }
      case "WB_CLEAR_COPY_BUTTON_PROFILES": {
        const profiles = await clearCopyButtonProfiles();
        await diagnostic("COPY_BUTTON_PROFILES_CLEARED", { builtin_adapter_count: BB2ManualControls.BUILTIN_MANUAL_COPY_ADAPTER_COUNT });
        return { ok: true, profiles, builtin_adapter_count: BB2ManualControls.BUILTIN_MANUAL_COPY_ADAPTER_COUNT };
      }
      case "WB_GET_DIAGNOSTICS": {
        const data = await storageGet(KEYS.DIAGNOSTICS);
        return { ok: true, diagnostics: data[KEYS.DIAGNOSTICS] || [] };
      }
      case "WB_CLEAR_DIAGNOSTICS":
        await storageSet({ [KEYS.DIAGNOSTICS]: [] });
        return { ok: true };
      case "WB_RECORD_DIAGNOSTIC":
        await diagnostic(String(message.event || "CONTENT_DIAGNOSTIC"), { source: "content_script", tab_id: sender.tab?.id || null, ...(message.details || {}) }, { source: "content_script" });
        return { ok: true };
      default:
        return { ok: false, code: "UNKNOWN_MESSAGE", error: "Неизвестная команда расширения." };
    }
  })().then(sendResponse).catch(async (error) => {
    const code = String(error?.code || (error?.name === "AbortError" ? "REQUEST_TIMEOUT" : "EXTENSION_ERROR"));
    const text = String(error?.message || error || "Unknown error");
    await setStatus({ ok: false, code, message: text }).catch(() => null);
    sendResponse({ ok: false, code, error: text });
  });
  return true;
});
