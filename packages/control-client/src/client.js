/* Privileged browser control-plane client. Tokens and deviceCode never leave this scope. */
(() => {
  "use strict";
  const config = globalThis.SellerAgentsControlConfig;
  const verifier = globalThis.SellerAgentsBootstrapVerifier;
  const STORAGE_KEY = "seller_agents_control_auth_v2";
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const MACHINE = /^[a-z0-9][a-z0-9._-]*$/;
  const TOKEN = /^[A-Za-z0-9._~-]{16,4096}$/;
  const OPAQUE_TOKEN = /^[A-Za-z0-9_-]{43}$/;
  const EXCHANGE_PENDING = "DEVICE_AUTH_PENDING";
  const RETRYABLE_EXCHANGE_STATUS = new Set([429, 500, 502, 503, 504]);
  const TERMINAL_EXCHANGE_ERRORS = new Set(["DEVICE_AUTH_CLOSED", "DEVICE_AUTH_INVALID", "DEVICE_LIMIT_REACHED", "SUBSCRIPTION_REQUIRED"]);
  const LOCAL_AI = Object.freeze({ chatgpt: Object.freeze({ family: "chatgpt", surface: "web" }), alice: Object.freeze({ family: "alice", surface: "web" }) });
  let state = { generation: 0, credentials: null, pending: null, rotation: null, authority: null, lastError: null };
  let initialized = false, initFlight = null, mutationQueue = Promise.resolve();
  let activationFlight = null, refreshFlight = null, pollingFlight = null, authorityChanged = null;
  function error(code, detail) { const value = Object.assign(new Error(code), { code }); if (detail !== undefined) value.detail = detail; return value; }
  function now() { return Date.now(); }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function key() { return crypto.randomUUID(); }
  function origin(value) { return typeof value === "string" && value === new URL(value).origin; }
  function url(path, base) { const root = base || config.controlApiOrigin; if (!origin(root) || ![config.controlApiOrigin, config.portalOrigin].includes(root)) throw error("PACKAGED_ORIGIN_INVALID"); return new URL(path, `${root}/`).toString(); }
  function safeError(value) { const code = typeof value?.code === "string" ? value.code : "CONTROL_REQUEST_FAILED"; return { code: code.slice(0, 80) }; }
  function queueMutation(fn) { const run = mutationQueue.then(fn); mutationQueue = run.catch(() => {}); return run; }
  async function persist(next) { await chrome.storage.local.set({ [STORAGE_KEY]: clone(next) }); }
  function sameAuthorityIdentity(left, right) { return Boolean(left && right && left.deviceId === right.deviceId && left.sessionId === right.sessionId && left.payload?.account?.id === right.payload?.account?.id); }
  function authorityNeedsInvalidation(previous, next, reason) { if (!previous || !next) return Boolean(previous || next); if (!sameAuthorityIdentity(previous, next)) return true; if (["refresh_invalid", "bootstrap_unauthorized", "authority_invalid", "local_reset"].includes(reason)) return true; if (previous.workAllowed && !next.workAllowed) return true; return canWork(previous.payload) && !canWork(next.payload); }
  async function commit(next, previous = state.authority, reason = "state_changed") {
    const changed = authorityNeedsInvalidation(previous, next.authority, reason);
    await persist(next);
    state = next;
    if (changed && typeof authorityChanged === "function") { try { await authorityChanged(clone(state.authority), reason, state.generation); } catch (_) { /* guards remain authoritative */ } }
    return true;
  }
  function isCurrent(context) {
    if (!context || state.generation !== context.generation) return false;
    if (context.attemptId && state.pending?.attemptId !== context.attemptId) return false;
    if (context.deviceId && state.credentials?.deviceId !== context.deviceId) return false;
    if (context.sessionId && state.credentials?.sessionId !== context.sessionId) return false;
    if (context.rotationKey && state.rotation?.idempotencyKey !== context.rotationKey) return false;
    return true;
  }
  function contextForState(extra = {}) { return { generation: state.generation, attemptId: state.pending?.attemptId || null, deviceId: state.credentials?.deviceId || null, sessionId: state.credentials?.sessionId || null, ...extra }; }
  function commitIfCurrent(context, updater, reason = "state_changed") { return queueMutation(async () => { if (!isCurrent(context)) return false; const next = await updater(clone(state)); if (!next || state.generation !== context.generation || (context.attemptId && state.pending?.attemptId !== context.attemptId) || (context.rotationKey && state.rotation?.idempotencyKey !== context.rotationKey)) return false; await commit(next, state.authority, reason); return true; }); }
  function validCredentials(value) { return value && UUID.test(value.deviceId) && UUID.test(value.sessionId) && value.tokenType === "Bearer" && TOKEN.test(value.accessToken) && OPAQUE_TOKEN.test(value.refreshToken) && Number.isFinite(Date.parse(value.accessTokenExpiresAt)) && Number.isFinite(Date.parse(value.refreshTokenExpiresAt)); }
  function validPending(value) { return value && value.attemptId && UUID.test(value.authorizationId) && OPAQUE_TOKEN.test(value.deviceCode) && /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/.test(value.userCode) && Number.isFinite(Date.parse(value.expiresAt)) && TOKEN.test(value.startIdempotencyKey) && TOKEN.test(value.exchangeIdempotencyKey); }
  function pendingLive(value) { return value?.phase !== "starting" && validPending(value) && Date.parse(value.expiresAt) > now(); }
  function publicPending(value) { if (!value) return null; return { authorizationId: value.authorizationId, userCode: value.userCode, expiresAt: value.expiresAt, verificationUri: url(`/activate?authorizationId=${encodeURIComponent(value.authorizationId)}`, config.portalOrigin) }; }
  function publicStatus() { const authority = state.authority, accountId = authority?.payload?.account?.id || null, snapshot = authority?.payload || null; return Object.freeze({ authenticated: Boolean(state.credentials && authority && accountId), accountId, account: accountId ? { kind: "control_account", label: `Аккаунт · ${accountId.slice(0, 8)}` } : null, pending: pendingLive(state.pending) ? publicPending(state.pending) : null, lastError: state.lastError, generation: state.generation, workAllowed: Boolean(accountId && state.authority?.workAllowed && canWork(snapshot)), authority: authority ? { configVersion: snapshot.configVersion, expiresAt: snapshot.expiresAt, aiStatus: snapshot.ai.status } : null }); }
  function canWork(snapshot) { return Boolean(snapshot && snapshot.account?.status === "ACTIVE" && snapshot.devicePolicy?.status === "ACTIVE" && ["SUPPORTED", "UPDATE_RECOMMENDED"].includes(snapshot.compatibility?.extension?.status) && snapshot.compatibility?.browser?.status === "SUPPORTED" && snapshot.ai?.status === "RESOLVED" && Date.parse(snapshot.expiresAt) > now() && ["chatgpt", "alice"].includes(snapshot.ai.detected?.family)); }
  function browserFamily() { const ua = typeof navigator === "object" ? String(navigator.userAgent || "").toLowerCase() : ""; return ua.includes("yabrowser") ? "yandex_chromium" : "chrome"; }
  function browserVersion() { const ua = typeof navigator === "object" ? String(navigator.userAgent || "") : ""; const match = ua.match(/(?:Chrome|YaBrowser)\/(\d+(?:\.\d+){0,3})/i); return match ? match[1] : "0.0.0"; }
  function parseRetryAfter(response) { const value = response.headers?.get("Retry-After"); if (!value) return 1000; const seconds = Number(value); if (Number.isFinite(seconds)) return Math.max(250, Math.min(60000, seconds * 1000)); const date = Date.parse(value); return Number.isFinite(date) ? Math.max(250, Math.min(60000, date - now())) : 1000; }
  async function readLimitedBody(response, limit = 1024 * 1024) {
    if (!response.body?.getReader) {
      const text = await response.text();
      if (text.length > limit) throw error("CONTROL_RESPONSE_TOO_LARGE");
      return text;
    }
    const reader = response.body.getReader(), chunks = [], decoder = new TextDecoder();
    let total = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      total += part.value.byteLength;
      if (total > limit) { try { await reader.cancel(); } catch (_) {} throw error("CONTROL_RESPONSE_TOO_LARGE"); }
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(total); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return decoder.decode(bytes);
  }
  async function request(path, options = {}) { const headers = new Headers(options.headers || {}); headers.set("Accept", "application/json"); if (options.body !== undefined) { headers.set("Content-Type", "application/json"); options.body = JSON.stringify(options.body); } const response = await fetch(url(path), { ...options, headers }); let body = null; try { const text = await readLimitedBody(response); body = text ? JSON.parse(text) : null; } catch (failure) { if (failure?.code === "CONTROL_RESPONSE_TOO_LARGE") throw failure; } if (!response.ok) { const failure = error(body?.error?.code || `CONTROL_HTTP_${response.status}`); failure.status = response.status; failure.retryAfterMs = parseRetryAfter(response); failure.body = body; throw failure; } return { body, response }; }
  function assertStart(body) { if (!body || body.status !== "pending" || !UUID.test(body.authorizationId) || !OPAQUE_TOKEN.test(body.deviceCode) || !/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/.test(body.userCode) || !Number.isFinite(Date.parse(body.expiresAt))) throw error("INVALID_DEVICE_AUTH_RESPONSE"); return body; }
  function assertTokens(body) { if (!body || body.status !== "activated" || !validCredentials(body)) throw error("INVALID_TOKEN_RESPONSE"); return { deviceId: body.deviceId, sessionId: body.sessionId, tokenType: body.tokenType, accessToken: body.accessToken, accessTokenExpiresAt: body.accessTokenExpiresAt, refreshToken: body.refreshToken, refreshTokenExpiresAt: body.refreshTokenExpiresAt }; }
  function assertRefreshTokens(body, previous) { if (!body || body.tokenType !== "Bearer" || typeof body.accessToken !== "string" || !body.accessToken || !OPAQUE_TOKEN.test(body.refreshToken || "") || !Number.isFinite(Date.parse(body.accessTokenExpiresAt)) || !Number.isFinite(Date.parse(body.refreshTokenExpiresAt))) throw error("INVALID_REFRESH_RESPONSE"); return { deviceId: previous.deviceId, sessionId: previous.sessionId, tokenType: body.tokenType, accessToken: body.accessToken, accessTokenExpiresAt: body.accessTokenExpiresAt, refreshToken: body.refreshToken, refreshTokenExpiresAt: body.refreshTokenExpiresAt }; }
  function accessFresh() { return state.credentials && Date.parse(state.credentials.accessTokenExpiresAt) > now() + 30000; }
  async function openPortal(authorizationId) { const portalUrl = url(`/activate?authorizationId=${encodeURIComponent(authorizationId)}`, config.portalOrigin); if (chrome.tabs?.create) await chrome.tabs.create({ url: portalUrl }); return portalUrl; }
  function retryableExchange(failure) { return failure.code === EXCHANGE_PENDING || !failure.status || RETRYABLE_EXCHANGE_STATUS.has(failure.status); }
  async function ensurePolling() {
    await init(); if (!pendingLive(state.pending)) return; if (pollingFlight) return pollingFlight;
    const context = contextForState();
    let flight;
    flight = (async () => { while (isCurrent(context) && pendingLive(state.pending)) { const pending = state.pending; try { const result = await request("/v1/device-authorizations/token", { method: "POST", headers: { "Idempotency-Key": pending.exchangeIdempotencyKey }, body: { deviceCode: pending.deviceCode } }); const credentials = assertTokens(result.body); if (!isCurrent(context) || state.pending?.authorizationId !== pending.authorizationId) return; if (!await commitIfCurrent(context, current => ({ ...current, credentials, pending: null, rotation: null, lastError: null, generation: current.generation + 1 }), "activated")) return; try { await bootstrap(); } catch (failure) { await queueMutation(async () => { if (state.credentials && state.generation === context.generation + 1) await commit({ ...state, lastError: safeError(failure) }, state.authority, "bootstrap_failed"); }); } return; } catch (failure) { if (!isCurrent(context) || state.pending?.authorizationId !== pending.authorizationId) return; if (retryableExchange(failure) && Date.parse(pending.expiresAt) > now()) { const wait = failure.code === EXCHANGE_PENDING ? failure.retryAfterMs || 1000 : Math.min(5000, Math.max(1000, failure.retryAfterMs || 1000)); await new Promise(resolve => setTimeout(resolve, Math.min(wait, Math.max(250, Date.parse(pending.expiresAt) - now())))); continue; } await commitIfCurrent(context, current => ({ ...current, pending: null, lastError: safeError(failure), generation: current.generation + 1 }), "activation_failed"); return; } } })();
    pollingFlight = flight.finally(() => { if (pollingFlight === flight) pollingFlight = null; }); return pollingFlight;
  }
  async function startActivation() {
    await init(); if (state.credentials && state.authority) return { ...publicStatus(), portalUrl: null };
    if (state.credentials && !state.authority) { try { await bootstrap(); } catch (failure) { await queueMutation(async () => { await commit({ ...state, lastError: safeError(failure) }, state.authority, "bootstrap_failed"); }); } return { ...publicStatus(), portalUrl: null }; }
    if (pendingLive(state.pending)) { const context = contextForState(); const portalUrl = await openPortal(state.pending.authorizationId); if (isCurrent(context)) void ensurePolling(); return { ...publicStatus(), portalUrl: isCurrent(context) ? portalUrl : null }; }
    if (activationFlight) return activationFlight;
    let flight, operationContext = null;
    flight = (async () => {
      const started = await queueMutation(async () => { if (state.credentials || pendingLive(state.pending)) return null; const startIdempotencyKey = state.pending?.phase === "starting" && TOKEN.test(state.pending.startIdempotencyKey) ? state.pending.startIdempotencyKey : key(); const attemptId = state.pending?.phase === "starting" && state.pending.attemptId ? state.pending.attemptId : key(); const next = { ...state, generation: state.generation + 1, pending: { phase: "starting", attemptId, startIdempotencyKey }, lastError: null }; await commit(next, state.authority, "activation_starting"); return { context: { generation: next.generation, attemptId }, startIdempotencyKey }; });
      if (!started) return publicStatus();
      operationContext = started.context;
      const result = await request("/v1/device-authorizations", { method: "POST", headers: { "Idempotency-Key": started.startIdempotencyKey }, body: { clientType: "browser_extension", browserFamily: browserFamily(), browserVersion: browserVersion(), extensionVersion: config.extensionVersion } });
      const response = assertStart(result.body); const pending = { phase: "pending", attemptId: started.context.attemptId, authorizationId: response.authorizationId, deviceCode: response.deviceCode, userCode: response.userCode, expiresAt: response.expiresAt, startIdempotencyKey: started.startIdempotencyKey, exchangeIdempotencyKey: key() };
      if (!await commitIfCurrent(started.context, current => ({ ...current, pending, lastError: null }), "activation_started") || !isCurrent(started.context)) return publicStatus();
      const portalUrl = await openPortal(response.authorizationId); if (!isCurrent(started.context)) return publicStatus(); void ensurePolling(); return { ...publicStatus(), portalUrl };
    })().catch(async failure => { if (operationContext) await commitIfCurrent(operationContext, current => ({ ...current, lastError: safeError(failure) }), "activation_failed"); throw failure; }).finally(() => { if (activationFlight === flight) activationFlight = null; });
    activationFlight = flight; return flight;
  }
  async function refresh() {
    await init(); if (accessFresh() && !state.rotation) return clone(state.credentials); if (!state.credentials) throw error("AUTH_REQUIRED"); if (refreshFlight) return refreshFlight;
    let flight, operationContext = null;
    flight = (async () => {
      const prepared = await queueMutation(async () => { if (!state.credentials) throw error("AUTH_REQUIRED"); const context = contextForState(); let rotation = state.rotation; if (!rotation || rotation.generation !== context.generation || rotation.refreshToken !== state.credentials.refreshToken) { rotation = { generation: context.generation, refreshToken: state.credentials.refreshToken, idempotencyKey: key() }; await commit({ ...state, rotation }, state.authority, "refresh_prepared"); } return { context: { ...context, rotationKey: rotation.idempotencyKey }, rotation, credentials: clone(state.credentials) }; });
      operationContext = prepared.context;
      const result = await request("/v1/auth/refresh", { method: "POST", headers: { "Idempotency-Key": prepared.rotation.idempotencyKey }, body: { refreshToken: prepared.rotation.refreshToken } }); const credentials = assertRefreshTokens(result.body, prepared.credentials); if (!await commitIfCurrent(prepared.context, current => ({ ...current, credentials, rotation: null, lastError: null }), "refresh_rotated")) throw error("AUTH_GENERATION_CHANGED"); return clone(credentials);
    })().catch(async failure => { if (failure.code === "AUTH_REFRESH_INVALID" && operationContext) await commitIfCurrent(operationContext, current => ({ generation: current.generation + 1, credentials: null, pending: null, rotation: null, authority: null, lastError: safeError(failure) }), "refresh_invalid"); throw failure; }).finally(() => { if (refreshFlight === flight) refreshFlight = null; });
    refreshFlight = flight; return flight;
  }
  function bootstrapRequest(detectedAi, credentials, authority) { const body = { contractVersion: "control_plane_v2", extensionVersion: config.extensionVersion, browser: { family: browserFamily(), version: browserVersion() }, deviceId: credentials.deviceId, lastConfigVersion: authority?.payload?.configVersion || null }; if (detectedAi) body.detectedAi = detectedAi; return body; }
  function semver(value) { return String(value).split(/[.+-]/, 1)[0].split(".").map(Number); }
  function versionAtLeast(actual, minimum) { const a = semver(actual), m = semver(minimum); for (let i = 0; i < Math.max(a.length, m.length); i++) if ((a[i] || 0) !== (m[i] || 0)) return (a[i] || 0) > (m[i] || 0); return true; }
  function exactKeys(value, required, optional = []) { if (!value || typeof value !== "object" || Array.isArray(value)) return false; const allowed = new Set([...required, ...optional]); return Object.keys(value).every(k => allowed.has(k)) && required.every(k => Object.hasOwn(value, k)); }
  function validSelector(value, strategy) {
    if (!exactKeys(value, ["strategy", "primary", "fallbacks", "timeoutMs", "observationMode"]) || value.strategy !== strategy || !Array.isArray(value.fallbacks) || value.fallbacks.length > 3 || !Number.isSafeInteger(value.timeoutMs) || value.timeoutMs < 250 || value.timeoutMs > 30000 || !["polling", "mutation_observer"].includes(value.observationMode)) return false;
    const validPrimitive = primitive => exactKeys(primitive, ["kind", "reference"], ["role"]) && ["page-root", "conversation-root", "composer-root", "send-control", "assistant-response", "busy-control", "copy-control"].includes(primitive.reference) && (primitive.kind === "packaged_selector_reference" ? !Object.hasOwn(primitive, "role") : primitive.kind === "accessibility_role_name" && ["main", "article", "textbox", "button", "status"].includes(primitive.role));
    return validPrimitive(value.primary) && value.fallbacks.every(validPrimitive) && !(value.observationMode === "polling" && value.timeoutMs < 500);
  }
  function validProfileShape(profile) {
    const content = profile?.content, compatibility = profile?.compatibility;
    if (!MACHINE.test(profile?.profileKey || "") || String(profile?.profileKey || "").length > 64 || !Number.isSafeInteger(profile?.revision) || profile.revision <= 0 || profile?.schemaVersion !== "adapter_profile_v1" || profile?.scopeVariant !== null) return false;
    if (!exactKeys(content, ["schemaVersion", "page", "selectors", "observation", "contours"]) || content.schemaVersion !== "adapter_profile_v1" || !exactKeys(content.page, ["identityStrategy", "conversationStrategy", "composerStrategy"]) || content.page.identityStrategy !== "page_identity" || content.page.conversationStrategy !== "conversation_root" || content.page.composerStrategy !== "composer_root") return false;
    if (!exactKeys(content.selectors, ["conversation", "composer", "send", "assistantResponse"]) || !validSelector(content.selectors.conversation, "conversation_root") || !validSelector(content.selectors.composer, "composer_root") || !validSelector(content.selectors.send, "send_control") || !validSelector(content.selectors.assistantResponse, "assistant_response")) return false;
    if (!exactKeys(content.observation, ["mode", "intervalMs"]) || !["polling", "mutation_observer"].includes(content.observation.mode) || !Number.isSafeInteger(content.observation.intervalMs) || content.observation.intervalMs < 100 || content.observation.intervalMs > 5000 || (content.observation.mode === "mutation_observer" && content.observation.intervalMs !== 100)) return false;
    const contourKeys = new Set(["page_identity", "conversation_root", "composer_root", "send_control", "busy_state", "assistant_response", "copy_control"]);
    if (!Array.isArray(content.contours) || content.contours.length < 4 || content.contours.length > 7 || new Set(content.contours.map(x => x.key)).size !== content.contours.length || !content.contours.every(x => exactKeys(x, ["key", "required", "expectedState", "strategy"]) && contourKeys.has(x.key) && typeof x.required === "boolean" && ["PRESENT", "INTERACTIVE", "COMPLETES"].includes(x.expectedState) && contourKeys.has(x.strategy))) return false;
    if (!exactKeys(compatibility, ["schemaVersion", "contractVersion", "browserFamilies", "minimumBrowserVersions", "minimumExtensionVersion"]) || compatibility.schemaVersion !== "profile_compatibility_v1" || compatibility.contractVersion !== "control_plane_v1" || !Array.isArray(compatibility.browserFamilies) || compatibility.browserFamilies.length < 1 || compatibility.browserFamilies.length > 2 || new Set(compatibility.browserFamilies).size !== compatibility.browserFamilies.length || !compatibility.browserFamilies.every(x => ["chrome", "yandex_chromium"].includes(x)) || !Array.isArray(compatibility.minimumBrowserVersions) || compatibility.minimumBrowserVersions.length > 2 || new Set(compatibility.minimumBrowserVersions.map(x => x.browserFamily)).size !== compatibility.minimumBrowserVersions.length || !compatibility.minimumBrowserVersions.every(x => exactKeys(x, ["browserFamily", "minimumVersion"]) && compatibility.browserFamilies.includes(x.browserFamily) && /^(?:0|[1-9][0-9]*)(?:\.(?:0|[1-9][0-9]*)){0,3}$/.test(x.minimumVersion)) || !(compatibility.minimumExtensionVersion === null || /^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(compatibility.minimumExtensionVersion))) return false;
    if (!compatibility.browserFamilies.includes(browserFamily()) || (compatibility.minimumExtensionVersion && !versionAtLeast(config.extensionVersion, compatibility.minimumExtensionVersion))) return false;
    const browserMin = compatibility.minimumBrowserVersions.find(x => x.browserFamily === browserFamily()); return !browserMin || versionAtLeast(browserVersion(), browserMin.minimumVersion);
  }
  async function profileFingerprint(profile) { const bytes = new TextEncoder().encode(verifier.canonicalJson({ content: profile.content, compatibility: profile.compatibility })); return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(x => x.toString(16).padStart(2, "0")).join(""); }
  async function validateOperationalAuthority(payload, requestedAi = null) { if (!canWork(payload) || !validProfileShape(payload.ai.profile)) return false; const expected = requestedAi ? LOCAL_AI[requestedAi] : LOCAL_AI[payload.ai.detected.family], detected = payload.ai.detected; if (!expected || detected.family !== (requestedAi || detected.family) || detected.surface !== expected.surface || detected.variant !== null || payload.ai.profile.scopeVariant !== null) return false; return (await profileFingerprint(payload.ai.profile)) === payload.ai.profile.contentSha256; }
  async function requestBootstrap(credentials, authority, detectedAi) { return request("/v1/bootstrap", { method: "POST", headers: { Authorization: `Bearer ${credentials.accessToken}` }, body: bootstrapRequest(detectedAi, credentials, authority) }); }
  async function invalidateUnauthorized(context, failure) { await commitIfCurrent(context, current => ({ generation: current.generation + 1, credentials: null, pending: null, rotation: null, authority: null, lastError: safeError(failure) }), "bootstrap_unauthorized"); }
  async function bootstrap(options = {}) {
    await init(); if (!state.credentials) throw error("AUTH_REQUIRED"); const requestedAi = options.detectedAi?.family || null; if (!accessFresh()) await refresh(); let context = contextForState(), credentials = clone(state.credentials), authority = clone(state.authority), retried = false;
    while (true) { if (!isCurrent(context)) throw error("AUTH_GENERATION_CHANGED"); let result; try { result = await requestBootstrap(credentials, authority, options.detectedAi); } catch (failure) { if (failure.status === 401 && !retried && isCurrent(context)) { retried = true; await refresh(); context = contextForState(); credentials = clone(state.credentials); authority = clone(state.authority); continue; } if (failure.status === 401) await invalidateUnauthorized(context, failure); throw failure; }
      const verified = await verifier.verifyV2(result.body, config.trustBundle); if (!isCurrent(context)) throw error("AUTH_GENERATION_CHANGED"); if (!verified.ok) throw error(`BOOTSTRAP_${verified.error}`); if (verified.payload.account.status !== "ACTIVE" || verified.payload.devicePolicy.status !== "ACTIVE" || verified.payload.compatibility.browser.status !== "SUPPORTED" || Date.parse(verified.payload.expiresAt) <= now()) throw error("BOOTSTRAP_EXPIRED_OR_INCOMPATIBLE"); const workAllowed = await validateOperationalAuthority(verified.payload, requestedAi); const nextAuthority = { verified: true, workAllowed, payload: verified.payload, envelope: verified.envelope, deviceId: credentials.deviceId, sessionId: credentials.sessionId, generation: context.generation, requestedAi: requestedAi || verified.payload.ai.detected?.family || null }; if (!await commitIfCurrent(context, current => { const authorityContextChanged = current.authority && current.authority.requestedAi !== nextAuthority.requestedAi; const generation = authorityContextChanged ? current.generation + 1 : current.generation; return { ...current, generation, authority: { ...nextAuthority, generation }, lastError: null }; }, "bootstrap_verified")) throw error("AUTH_GENERATION_CHANGED"); return clone(verified.payload);
    }
  }
  async function ensureForIdentity(identity) { await init(); if (!state.credentials) throw error("AUTH_REQUIRED"); const requested = LOCAL_AI[identity?.ai_id] ? identity.ai_id : null; if (!requested) throw error("WORK_UNSUPPORTED_AI"); const current = state.authority; if (current && current.generation === state.generation && current.requestedAi === requested && current.payload?.ai?.detected?.family === requested && current.workAllowed && canWork(current.payload)) return clone(current.payload); return bootstrap({ detectedAi: { family: requested, surface: LOCAL_AI[requested].surface, variant: null } }); }
  async function restoreOnce() {
    await chrome.storage.local.setAccessLevel?.({ accessLevel: "TRUSTED_CONTEXTS" }); const result = await chrome.storage.local.get(STORAGE_KEY); const saved = result[STORAGE_KEY]; if (saved && typeof saved === "object") state = { ...state, ...clone(saved) }; if (!validCredentials(state.credentials)) state = { ...state, credentials: null, authority: null, rotation: null };
    if (state.authority && state.credentials) { try { if (state.authority.deviceId !== state.credentials.deviceId || state.authority.sessionId !== state.credentials.sessionId || state.authority.generation !== state.generation) throw error("AUTHORITY_CREDENTIAL_MISMATCH"); const verified = await verifier.verifyV2(state.authority.envelope, config.trustBundle); if (!verified.ok) throw error(`STORED_AUTHORITY_${verified.error}`); if (verifier.canonicalJson(verified.payload) !== verifier.canonicalJson(state.authority.payload)) throw error("STORED_AUTHORITY_PAYLOAD_MISMATCH"); if (Date.parse(verified.payload.expiresAt) <= now()) throw error("BOOTSTRAP_EXPIRED"); const allowed = await validateOperationalAuthority(verified.payload, state.authority.requestedAi); if (allowed !== state.authority.workAllowed) throw error("STORED_AUTHORITY_POLICY_MISMATCH"); } catch (failure) { const previous = state.authority, next = { ...state, authority: null, lastError: safeError(failure), generation: state.generation + 1 }; await persist(next); state = next; if (previous && typeof authorityChanged === "function") { try { await authorityChanged(null, "authority_invalid", state.generation); } catch (_) {} } } }
    initialized = true; if (pendingLive(state.pending)) void ensurePolling(); return publicStatus();
  }
  function init() { if (initialized) return Promise.resolve(publicStatus()); if (!initFlight) initFlight = restoreOnce().finally(() => { initFlight = null; }); return initFlight; }
  async function localReset() { await init(); await queueMutation(async () => { await commit({ generation: state.generation + 1, credentials: null, pending: null, rotation: null, authority: null, lastError: null }, state.authority, "local_reset"); }); return publicStatus(); }
  async function cancelActivation() { await init(); await queueMutation(async () => { await commit({ ...state, generation: state.generation + 1, pending: null, lastError: null }, state.authority, "activation_cancelled"); }); return publicStatus(); }
  const api = { restore: init, status: async () => { await init(); return publicStatus(); }, currentAccount: async () => { await init(); return state.authority?.payload?.account?.id || null; }, generation: async () => { await init(); return state.generation; }, hasAuthority: async () => { await init(); return Boolean(state.authority && state.credentials); }, canWork: async () => { await init(); return Boolean(state.authority && state.authority.workAllowed && canWork(state.authority.payload)); }, getAuthority: async () => { await init(); return clone(state.authority); }, startActivation, cancelActivation, refresh, bootstrap, ensureForIdentity, localReset, openPortal: async () => { await init(); const pending = state.pending; if (!pendingLive(pending)) throw error("NO_ACTIVATION_ATTEMPT"); return openPortal(pending.authorizationId); }, onAuthorityChanged: handler => { authorityChanged = handler; } };
  globalThis.SellerAgentsControlClient = Object.freeze(api);
})();
