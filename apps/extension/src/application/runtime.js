/* Privileged application orchestration. Mature Ozon Work and delivery remain the implementation. */
const SA_PAYLOAD_TTL = 3600000;
let saCatalogEnabled = false;
const saStarts = new Map();
const saStartFlights = new Map();
const saCatalog = SellerAgentsStoreCatalog.create({
  read: storageGet, write: storageSet,
  currentAccount: () => SellerAgentsControlClient.currentAccount(),
  uuid: () => crypto.randomUUID(),
  normalizeCredentials(marketplace, input, previous = {}) {
    if (marketplace === "wildberries") return { token: SellerAgentsWBReference.credentials.normalizeSellerCredentials({ token: input.token || previous.token, tokenType: "personal" }, { required: true }).token };
    const seller = OzonCredentials.normalizeSellerCredentials({ clientId: input.seller?.clientId ?? previous.seller?.clientId,
      apiKey: input.seller?.apiKey || previous.seller?.apiKey }, { required: true });
    const performance = input.clearPerformance ? OzonCredentials.normalizePerformanceCredentials({}) :
      OzonCredentials.normalizePerformanceCredentials({ clientId: input.performance?.clientId ?? previous.performance?.clientId,
        clientSecret: input.performance?.clientSecret || previous.performance?.clientSecret });
    return { seller, performance };
  },
  revision: (marketplace, c) => marketplace === "wildberries" ? SellerAgentsWBAdapter.credentialRevision(c) :
    sha256Hex(JSON.stringify(["account-scoped-ozon-credentials", c.seller.clientId, c.seller.apiKey, c.performance.clientId, c.performance.clientSecret]))
});
const saQuota = SellerAgentsObservedQuota.create({ read: storageGet, write: storageSet, namespace: "seller_agents_observed_quota_v1" });
const saReady = (async () => {
  await chrome.storage.local.setAccessLevel?.({ accessLevel: "TRUSTED_CONTEXTS" });
  await SellerAgentsControlClient.restore();
  saCatalogEnabled = true;
})();
function saError(code) { return Object.assign(new Error(code), { code }); }
function saPopupSender(sender) {
  // MessageSender.url is assigned by the browser, not supplied in the message.
  // The same privileged page may be hosted by the browser action or its own tab.
  return sender?.url === chrome.runtime.getURL("popup.html");
}
async function saEnabled() { await saReady; return saCatalogEnabled; }
let saInitializeFlight = null;
async function saInitialize() {
  if (await saEnabled()) return;
  if (saInitializeFlight) return saInitializeFlight;
  saInitializeFlight = saInitializeOnce().finally(() => { saInitializeFlight = null; });
  return saInitializeFlight;
}
async function saInitializeOnce() {
  /* Legacy global credentials remain isolated. Never assign them to the first real account. */
  if (!await SellerAgentsControlClient.currentAccount()) return;
  await saCatalog.list();
}
function saStoreContext(store) {
  return { accountId: store.accountId, storeId: store.id, marketplace: store.marketplace,
    credentialRevision: store.credentialRevision, policyRevision: store.personalDataEnabled ? "personal-enabled" : "personal-disabled" };
}
async function saAssertStore(pinned) {
  const accountId = await SellerAgentsControlClient.currentAccount();
  if (!accountId || !pinned || pinned.accountId !== accountId) throw SellerAgentsExecutionContext.error();
  let store;
  try { store = await saCatalog.get(pinned.storeId); } catch (_) { throw SellerAgentsExecutionContext.error(); }
  const live = saStoreContext(store);
  if (Object.keys(live).some(key => live[key] !== pinned[key])) throw SellerAgentsExecutionContext.error();
  return store;
}
async function saStoreForPending(tab, intent) {
  const pending = (await getPendingWorkStarts())[String(tab)];
  if (!pending || pending.intent_id !== intent) throw SellerAgentsExecutionContext.error();
  await saAssertStore(pending.store_context);
  return pending.store_context;
}
async function saPendingGuard(pending) {
  if (pending?.store_context) await saAssertStore(pending.store_context);
  else if (await saEnabled()) throw SellerAgentsExecutionContext.error();
}
async function saReadContext(key, immutable, ownerIdentity) {
  const data = await storageGet([KEYS.CONVERSATION_BINDINGS, KEYS.WORK_SESSIONS]);
  const binding = normalizeBindingRecord(data[KEYS.CONVERSATION_BINDINGS]?.[key], key);
  const work = OzonWorkSessionModel.normalize(data[KEYS.WORK_SESSIONS]?.[key], key);
  const p = binding?.store_context;
  let store = null;
  try { store = await saAssertStore(p); } catch (_) {}
  const current = manualContextOwners.get(key);
  const ownerActive = !ownerIdentity || current?.operation_id === ownerIdentity.operation_id && manualOperationActive(current) &&
    SellerAgentsExecutionContext.fields.every(field => current.execution_context?.[field] === ownerIdentity.execution_context[field]);
  return { ...immutable, ...(store ? saStoreContext(store) : p), accountId: store?.accountId || "unavailable",
    conversationKey: key, bindingId: binding?.binding_id || "unbound", bindingRevision: binding?.revision || 0,
    workSessionId: work.start_intent_id || "inactive", active: Boolean(store && ownerActive &&
      [OzonWorkSessionModel.STATES.ACTIVE_VISIBLE, OzonWorkSessionModel.STATES.ACTIVE_HIDDEN, OzonWorkSessionModel.STATES.RECOVERING].includes(work.state)) };
}
async function saSettings(pinned) {
  const store = await saAssertStore(pinned);
  if (store.marketplace !== "ozon") throw saError("WRONG_SETTINGS_PROVIDER");
  return { sellerCredentials: store.credentials.seller, performanceCredentials: store.credentials.performance,
    autoSend: true, personalDataEnabled: store.personalDataEnabled,
    sellerApiMetadata: OzonEntitlements.normalizeSnapshot(null), lastStatus: null };
}
async function saGuard(owner) {
  const p = owner?.execution_context;
  if (!p) throw SellerAgentsExecutionContext.error("EXECUTION_CONTEXT_MISSING");
  const readCurrent = () => saReadContext(owner.conversation_key, { commandHash: p.commandHash, requestId: p.requestId }, owner);
  if (owner.payload_expires_at_ms && owner.payload_expires_at_ms <= Date.now()) throw saError("RESULT_EXPIRED");
  const guard = SellerAgentsExecutionContext.createGuard(p, readCurrent);
  await guard.assertCurrent();
  const store = await saAssertStore(p);
  if (p.marketplace === "wildberries") return SellerAgentsWBAdapter.createContext({ snapshot: p, readCurrent, credentials: store.credentials });
  const settings = await saSettings(p);
  await guard.assertCurrent();
  return Object.freeze({ ...guard, async settings() { await guard.assertCurrent(); return settings; } });
}
async function saPublicContext(key) {
  const binding = key ? await bindingForConversationKey(key) : null;
  const work = key ? await workSessionFor(key) : null;
  return { marketplace: binding?.store_context?.marketplace || "ozon", store_id: binding?.store_context?.storeId || null,
    work_session_id: work?.start_intent_id || null, work_active: Boolean(work && ["active_visible", "active_hidden", "recovering"].includes(work.state)),
    button_visible: work?.state === "active_visible", assistant_baseline_ids: binding?.assistant_baseline_ids || [] };
}
async function saInvalidateStore(id) {
  const bindings = await getConversationBindings();
  for (const [key, raw] of Object.entries(bindings)) {
    if (raw.store_context?.storeId !== id) continue;
    const work = await workSessionFor(key);
    if (["active_visible", "active_hidden", "error"].includes(work.state))
      await saLegacyMessage({ type: "OZ_WORK_FINISH", conversation_key: key, tab_id: work.tab_id }, {});
  }
  const pending = await getPendingWorkStarts();
  for (const [tab, start] of Object.entries(pending)) if (start.store_context?.storeId === id)
    await clearPendingWorkStart(Number(tab), start.intent_id, start.revision, "store_changed");
}
async function saInvalidateAuthority() {
  const bindings = await getConversationBindings();
  for (const [key, raw] of Object.entries(bindings)) {
    const work = await workSessionFor(key);
    if (["active_visible", "active_hidden", "recovering", "error"].includes(work.state)) {
      try { await saLegacyMessage({ type: "OZ_WORK_FINISH", conversation_key: key, tab_id: work.tab_id }, {}); } catch (_) { /* the context guard remains closed */ }
    }
  }
  const pending = await getPendingWorkStarts();
  for (const [tab, start] of Object.entries(pending)) {
    try { await clearPendingWorkStart(Number(tab), start.intent_id, start.revision, "authority_changed"); } catch (_) { /* stale pending state is harmless */ }
  }
}
SellerAgentsControlClient.onAuthorityChanged(() => saInvalidateAuthority());
async function saPopupState(tabId) {
  const live = await tabIdentity(normalizeTabId(tabId));
  const key = live.conversation_id ? conversationKeyFromIdentity(live) : null;
  const context = await saPublicContext(key);
  const pending = (await getPendingWorkStarts())[String(tabId)] || null;
  const auth = await SellerAgentsControlClient.status();
  let stores = [];
  if (auth.authenticated) stores = await saCatalog.list();
  return { ok: true, auth, pending: pending ? { intent_id: pending.intent_id, send_outcome: pending.send_outcome, expires_at: pending.expires_at } : null, stores,
    account: auth.account || { kind: "signed_out", label: "Вход не выполнен" },
    identity: live, conversation_key: key, context, work: key ? await workSessionFor(key) : null,
    operation: key ? publicManualOperation(await getManualOperation(key)) : null };
}
async function saWorkStart(message, sender) {
  return singleFlight(saStartFlights, String(message.tab_id), async () => {
    await SellerAgentsControlClient.ensureForIdentity(await tabIdentity(normalizeTabId(message.tab_id)));
    if (!await SellerAgentsControlClient.canWork()) throw saError("WORK_POLICY_BLOCKED");
    const store = await saCatalog.get(message.store_id);
    const live = await tabIdentity(normalizeTabId(message.tab_id));
    const key = live.conversation_id ? conversationKeyFromIdentity(live) : null;
    const binding = key ? await bindingForConversationKey(key) : null;
    const work = key ? await workSessionFor(key) : null;
    if (binding?.store_context?.storeId === store.id && ["active_visible", "active_hidden"].includes(work?.state))
      return { ok: true, accepted: false, code: "WORK_SESSION_ALREADY_ACTIVE" };
    if (binding?.store_context && binding.store_context.storeId !== store.id) {
      if (message.confirm_change !== true) throw saError("STORE_CHANGE_CONFIRMATION_REQUIRED");
      if (["active_visible", "active_hidden", "error"].includes(work?.state))
        await saLegacyMessage({ type: "OZ_WORK_FINISH", tab_id: message.tab_id, conversation_key: key }, sender);
    }
    saStarts.set(Number(message.tab_id), saStoreContext(store));
    try { return await saLegacyMessage({ type: "OZ_WORK_START", tab_id: message.tab_id, start_intent_id: message.start_intent_id }, sender); }
    finally { saStarts.delete(Number(message.tab_id)); }
  });
}
async function saHandleMessage(message, sender) {
  const enabled = await saEnabled();
  if (/^OZ_(?:SAVE_|RESET_|CLEAR_|SET_|GET_SETTINGS_STATE|GET_GLOBAL_SETTINGS_STATE|GET_DIAGNOSTICS|BIND_CONVERSATION|TEST_CONNECTION|REFRESH_SELLER_API_METADATA|WORK_START$|WORK_SHOW$|WORK_HIDE$|WORK_FINISH$|WORK_REFRESH$|WORK_RESUME$)/.test(message?.type || "") && !saPopupSender(sender)) throw saError("POPUP_SENDER_REQUIRED");
  if (/^OZ_AUTO_/.test(message?.type || "")) throw saError("LEGACY_ACTION_DISABLED");
  if (message?.type?.startsWith("SA_")) {
    if (!saPopupSender(sender)) throw saError("POPUP_SENDER_REQUIRED");
    if (message.type === "SA_AUTH_STATE") return { ok: true, auth: await SellerAgentsControlClient.status() };
    if (message.type === "SA_AUTH_START") return { ok: true, auth: await SellerAgentsControlClient.startActivation() };
    if (message.type === "SA_AUTH_OPEN_PORTAL") return { ok: true, portalUrl: await SellerAgentsControlClient.openPortal() };
    if (message.type === "SA_AUTH_CANCEL") return { ok: true, auth: await SellerAgentsControlClient.cancelActivation() };
    if (message.type === "SA_AUTH_RESET") return { ok: true, auth: await SellerAgentsControlClient.localReset() };
    await saInitialize();
    switch (message.type) {
      case "SA_POPUP_STATE": return saPopupState(message.tab_id);
      case "SA_STORE_SAVE": {
        const old = message.store?.id ? await saCatalog.get(message.store.id) : null;
        const saved = await saCatalog.save(message.store);
        if (old && (old.credentialRevision !== saved.credentialRevision || old.personalDataEnabled !== saved.personalDataEnabled)) await saInvalidateStore(saved.id);
        return { ok: true, store: saved };
      }
      case "SA_STORE_DELETE":
        if (message.confirm !== true) throw saError("DELETE_CONFIRMATION_REQUIRED");
        await saCatalog.remove(message.store_id);
        await saInvalidateStore(message.store_id);
        return { ok: true };
      case "SA_WORK_START": return saWorkStart(message, sender);
      case "SA_STORE_CHECK": return saCheckStore(message);
      case "SA_RESUME_QUOTA": {
        const state = await saPopupState(message.tab_id), key = state.conversation_key;
        const owner = await getManualOperation(key);
        if (!owner || owner.batch?.request_state !== "quota_waiting") throw saError("NO_QUOTA_WAIT");
        await assertManualBatchContext(key, owner.operation_id);
        launchBatchProcessor("manual", key, owner.operation_id, "explicit_quota_resume");
        return { ok: true };
      }
      default: throw saError("UNKNOWN_MESSAGE");
    }
  }
  if (enabled) {
    if (/^OZ_(?:GET_SETTINGS_STATE|GET_GLOBAL_SETTINGS_STATE|GET_DIAGNOSTICS)/.test(message.type) && !saPopupSender(sender)) throw saError("POPUP_SENDER_REQUIRED");
    if (/^OZ_(?:AUTO_|BIND_CONVERSATION|SAVE_.*SETTINGS|TEST_CONNECTION|WORK_RESUME|SET_MANUAL_MODE|SAVE_REPORT_PREFIX|SAVE_.*START_PROMPT|RESET_.*START_PROMPT|REFRESH_SELLER_API_METADATA)/.test(message?.type || "")) throw saError("LEGACY_ACTION_DISABLED");
    if (["OZ_WORK_DELIVERY_ASSERT", "OZ_WORK_SEND_COMMIT"].includes(message.type)) {
      const key = normalizeConversationKey(message.conversation_key), id = String(message.owner_id || "");
      await assertTabConversation(sender?.tab?.id, key);
      const current = await getManualOperation(key);
      if (current?.operation_id !== id || current.delivery?.delivery_id !== message.delivery_id || Number(current.tab_id) !== Number(sender?.tab?.id)) throw saError("DELIVERY_OWNER_MISMATCH");
      await saAssertDeliveryOwner(current);
      if (message.type === "OZ_WORK_DELIVERY_ASSERT") return { ok: true };
      if (!message.actor_id) throw saError("DELIVERY_ACTOR_REQUIRED");
      let granted = false;
      await mutateManualOperation(key, async owner => {
        if (owner?.operation_id !== id || owner.delivery?.delivery_id !== message.delivery_id) throw saError("DELIVERY_OWNER_MISMATCH");
        await saAssertDeliveryOwner(owner);
        if (owner.delivery.sa_send_actor) return owner;
        if (owner.delivery.phase !== "inserted") throw saError("DELIVERY_NOT_INSERTED");
        granted = true;
        return { ...owner, delivery: { ...owner.delivery, sa_send_actor: message.actor_id, sa_send_committed_at: Date.now() } };
      });
      return { ok: true, click_allowed: granted, code: granted ? "SEND_COMMITTED" : "SEND_OUTCOME_UNKNOWN_NO_RETRY" };
    }
    if (message.type === "OZ_WORK_START") throw saError("STORE_SELECTION_REQUIRED");
    if (["OZ_WORK_SHOW", "OZ_WORK_HIDE", "OZ_WORK_FINISH", "OZ_WORK_REFRESH"].includes(message.type) && !saPopupSender(sender)) throw saError("POPUP_SENDER_REQUIRED");
    if (message.type.startsWith("OZ_WORK_START_") || message.type === "OZ_WORK_PENDING_IDENTITY") {
      const pending = (await getPendingWorkStarts())[String(sender?.tab?.id || message.tab_id)];
      await saPendingGuard(pending);
    }
    if (message.type === "OZ_WORK_FINISH") {
      const pending = (await getPendingWorkStarts())[String(message.tab_id)];
      if (pending) {
        await clearPendingWorkStart(message.tab_id, pending.intent_id, pending.revision, "operator_finish");
        if (pending.conversation_key) await tabMessage(message.tab_id, { type: "OZ_WORK_APPLY_VISIBILITY", visible: false, conversation_key: pending.conversation_key });
        return { ok: true, pending_cancelled: true };
      }
    }
    if (message.type === "OZ_WORK_HIDE") {
      const key = normalizeConversationKey(message.conversation_key), work = await workSessionFor(key);
      await assertTabConversation(message.tab_id, key);
      if (work.state !== "active_visible") throw saError("WORK_SESSION_NOT_VISIBLE");
      await mutateWorkSession(key, work.revision, OzonWorkSessionModel.STATES.ACTIVE_HIDDEN);
      await tabMessage(message.tab_id, { type: "OZ_WORK_APPLY_VISIBILITY", visible: false, conversation_key: key, work_active: true });
      return { ok: true };
    }
    if (message.type === "OZ_EXECUTE_COMMAND") {
      await assertTabConversation(sender?.tab?.id, message.conversation_key);
      const binding = await bindingForConversationKey(message.conversation_key);
      await saAssertStore(binding?.store_context);
      const work = await workSessionFor(message.conversation_key);
      if (work.state !== "active_visible") throw saError("WORK_SESSION_NOT_VISIBLE");
      if (message.work_session_id !== work.start_intent_id) throw saError("WORK_SESSION_CHANGED");
    }
    if (message.type.startsWith("OZ_BATCH_DELIVERY_")) {
      await assertManualBatchContext(message.conversation_key, message.owner_id || message.operation_id);
      if (message.type === "OZ_BATCH_DELIVERY_COMPLETE") {
        const current = await getManualOperation(message.conversation_key);
        if (!current?.delivery?.sa_send_actor) throw saError("SEND_NOT_COMMITTED");
      }
    }
  }
  const result = await saLegacyMessage(message, sender);
  if (enabled && ["OZ_CONTENT_READY", "OZ_CONTENT_SYNC", "OZ_GET_MANUAL_STATE"].includes(message.type) && result?.ok) {
    const key = result.conversation_key || message.conversation_key;
    result.store_context = await saPublicContext(key);
    result.auto_watch = null;
  }
  return result;
}
async function saCheckStore(message) {
  const store = await saCatalog.get(message.store_id), pinned = saStoreContext(store);
  let result;
  try {
    if (store.marketplace === "wildberries") {
      const snapshot = SellerAgentsExecutionContext.snapshot({ ...pinned, conversationKey: "credential-check", bindingId: "credential-check",
        bindingRevision: 1, workSessionId: "credential-check", commandHash: "credential-check", requestId: crypto.randomUUID() });
      const context = await SellerAgentsWBAdapter.createContext({ snapshot, credentials: store.credentials,
        readCurrent: async () => ({ ...snapshot, ...saStoreContext(await saAssertStore(pinned)), active: true }) });
      result = await SellerAgentsWBAdapter.createProvider().execute('WB_API_V1 {"operation":"seller_info","params":{}}', { context });
    } else if (message.part === "performance") result = await OzonProvider.testPerformanceConnection(store.credentials.performance);
    else result = await OzonProvider.testConnection(store.credentials.seller);
  } catch (error) { result = { ok: false, http_status: error.http_status || 0 }; }
  await saAssertStore(pinned);
  const httpStatus = Number(result.http_status || 0);
  const code = result.ok ? "ACCESS_CONFIRMED" : httpStatus === 401 ? "CREDENTIAL_REJECTED" : httpStatus === 403 ? "ACCESS_DENIED" : "CHECK_FAILED";
  return { ok: true, store: await saCatalog.noteVerification(store.id, store.credentialRevision,
    store.marketplace === "wildberries" ? "token" : message.part === "performance" ? "performance" : "seller", { code, httpStatus }) };
}
function saPrunePayload(owner, now = Date.now()) {
  if (!owner) return owner;
  const expires = owner.payload_expires_at_ms || Date.parse(owner.created_at || "") + SA_PAYLOAD_TTL;
  if (Number.isFinite(expires) && expires > now) return { ...owner, payload_expires_at_ms: expires };
  return { ...owner, status: "failed", batch: null, outgoing_text: null, delivery: null,
    completed_at: owner.completed_at || new Date(now).toISOString(), last_error: { code: "RESULT_EXPIRED" } };
}
async function saAssertDeliveryOwner(owner) {
  if (!owner?.execution_context || !await saEnabled()) return;
  if (owner.payload_expires_at_ms <= Date.now()) throw saError("RESULT_EXPIRED");
  const guard = await saGuard(owner);
  await guard.assertCurrent();
}

async function saCleanupExpiredPayloads() {
  if (!await saEnabled()) return;
  const data = await storageGet(KEYS.MANUAL_OPERATIONS);
  for (const [key, owner] of Object.entries(data[KEYS.MANUAL_OPERATIONS] || {})) {
    const expiry = owner.payload_expires_at_ms || Date.parse(owner.created_at || "") + SA_PAYLOAD_TTL;
    if (!Number.isFinite(expiry) || expiry <= Date.now()) await mutateManualOperation(key, current => saPrunePayload(current));
  }
  await OzonFileDeliveryWorker.cleanupExpiredArtifacts();
}
chrome.alarms.create("seller-agents-payload-cleanup", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name === "seller-agents-payload-cleanup") void saCleanupExpiredPayloads(); });
setTimeout(() => { void saCleanupExpiredPayloads(); }, 0);
const saFileOwners = SellerAgentsLocalOperations.createRecordStore({ read: keys => chrome.storage.session.get(keys),
  write: values => chrome.storage.session.set(values), namespace: "seller_agents_file_owners_v1" });
async function saCheckOzonFileRef(command, context) {
  if (!await saEnabled() || command.operation !== "report_file_get") return;
  const owner = await saFileOwners.get(command.params.file_ref), pinned = context?.snapshot;
  if (!pinned || !owner || owner.expires_at_ms <= Date.now() ||
    ["accountId", "storeId", "credentialRevision"].some(field => owner[field] !== pinned[field]))
    throw saError("REPORT_FILE_STORE_MISMATCH");
  await context.assertCurrent();
}
async function saRememberOzonFileRefs(response, context) {
  if (!await saEnabled() || !context) return;
  let envelope;
  try { envelope = JSON.parse(String(response.report_text).slice(String(response.report_text).indexOf("\n") + 1)); } catch (_) { return; }
  for (const ref of [envelope?.result?.report_file_ref, envelope?.result?.generated_file_ref]) {
    if (!/^rpf_[sp]_[A-Za-z0-9_-]+$/.test(ref || "")) continue;
    await context.assertCurrent();
    await saFileOwners.mutate(ref, async old => {
      await context.assertCurrent();
      const p = context.snapshot;
      if (old && ["accountId", "storeId", "credentialRevision"].some(field => old[field] !== p[field])) throw saError("REPORT_FILE_STORE_MISMATCH");
      return old || { accountId: p.accountId, storeId: p.storeId, credentialRevision: p.credentialRevision, expires_at_ms: Date.now() + SA_PAYLOAD_TTL };
    });
  }
}
