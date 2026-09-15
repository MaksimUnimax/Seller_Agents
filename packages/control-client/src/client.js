/* Privileged browser control-plane client. Tokens and deviceCode never leave this scope. */
(() => {
  "use strict";
  const config = globalThis.SellerAgentsControlConfig;
  const verifier = globalThis.SellerAgentsBootstrapVerifier;
  const STORAGE_KEY = "seller_agents_control_auth_v2";
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const TOKEN = /^[A-Za-z0-9._~-]{16,4096}$/;
  const OPAQUE_TOKEN = /^[A-Za-z0-9_-]{43}$/;
  const EXCHANGE_PENDING = "DEVICE_AUTH_PENDING";
  let state = { generation: 0, credentials: null, pending: null, rotation: null, authority: null, lastError: null };
  let restoreFlight = null;
  let activationFlight = null;
  let refreshFlight = null;
  let pollingFlight = null;
  let authorityChanged = null;

  function error(code, detail) {
    const value = Object.assign(new Error(code), { code });
    if (detail !== undefined) value.detail = detail;
    return value;
  }
  function now() { return Date.now(); }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function key() { return crypto.randomUUID(); }
  function origin(value) { return typeof value === "string" && value === new URL(value).origin; }
  function url(path, base) {
    const root = base || config.controlApiOrigin;
    if (!origin(root) || ![config.controlApiOrigin, config.portalOrigin].includes(root)) throw error("PACKAGED_ORIGIN_INVALID");
    return new URL(path, `${root}/`).toString();
  }
  function safeError(value) {
    const code = typeof value?.code === "string" ? value.code : "CONTROL_REQUEST_FAILED";
    return { code: code.slice(0, 80) };
  }
  async function readState() {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY];
  }
  async function writeState() { await chrome.storage.local.set({ [STORAGE_KEY]: clone(state) }); }
  async function notify(previous, reason) {
    if (previous !== state.authority && typeof authorityChanged === "function") {
      try { await authorityChanged(clone(state.authority), reason, state.generation); } catch (_) { /* invalidation is best effort; guards remain authoritative */ }
    }
  }
  async function commit(next, previous, reason) {
    state = next;
    await writeState();
    await notify(previous, reason);
  }
  function validCredentials(value) {
    return value && UUID.test(value.deviceId) && UUID.test(value.sessionId) && value.tokenType === "Bearer" &&
      TOKEN.test(value.accessToken) && OPAQUE_TOKEN.test(value.refreshToken) &&
      Number.isFinite(Date.parse(value.accessTokenExpiresAt)) && Number.isFinite(Date.parse(value.refreshTokenExpiresAt));
  }
  function validPending(value) {
    return value && UUID.test(value.authorizationId) && OPAQUE_TOKEN.test(value.deviceCode) &&
      /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/.test(value.userCode) && Number.isFinite(Date.parse(value.expiresAt)) &&
      TOKEN.test(value.startIdempotencyKey) && TOKEN.test(value.exchangeIdempotencyKey);
  }
  function pendingLive(value) { return value?.phase !== "starting" && validPending(value) && Date.parse(value.expiresAt) > now(); }
  function publicPending(value) {
    if (!value) return null;
    return { authorizationId: value.authorizationId, userCode: value.userCode, expiresAt: value.expiresAt,
      verificationUri: url(`/activate?authorizationId=${encodeURIComponent(value.authorizationId)}`, config.portalOrigin) };
  }
  function publicStatus() {
    const authority = state.authority;
    const accountId = authority?.payload?.account?.id || null;
    const snapshot = authority?.payload || null;
    return Object.freeze({
      authenticated: Boolean(state.credentials && authority && accountId),
      accountId,
      account: accountId ? { kind: "control_account", label: `Аккаунт · ${accountId.slice(0, 8)}` } : null,
      pending: pendingLive(state.pending) ? publicPending(state.pending) : null,
      lastError: state.lastError,
      generation: state.generation,
      workAllowed: Boolean(accountId && canWork(snapshot)),
      authority: authority ? { configVersion: snapshot.configVersion, expiresAt: snapshot.expiresAt, aiStatus: snapshot.ai.status } : null,
    });
  }
  function canWork(snapshot) {
    return Boolean(snapshot && snapshot.account?.status === "ACTIVE" && snapshot.devicePolicy?.status === "ACTIVE" &&
      ["SUPPORTED", "UPDATE_RECOMMENDED"].includes(snapshot.compatibility?.extension?.status) &&
      snapshot.compatibility?.browser?.status === "SUPPORTED" && snapshot.ai?.status === "RESOLVED" &&
      Date.parse(snapshot.expiresAt) > now());
  }
  function browserFamily() {
    const ua = typeof navigator === "object" ? String(navigator.userAgent || "").toLowerCase() : "";
    return ua.includes("yabrowser") ? "yandex_chromium" : "chrome";
  }
  function browserVersion() {
    const ua = typeof navigator === "object" ? String(navigator.userAgent || "") : "";
    const match = ua.match(/(?:Chrome|YaBrowser)\/(\d+(?:\.\d+){0,3})/i);
    return match ? match[1] : "0.0.0";
  }
  function parseRetryAfter(response) {
    const value = response.headers?.get("Retry-After");
    if (!value) return 1000;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(250, Math.min(60000, seconds * 1000));
    const date = Date.parse(value);
    return Number.isFinite(date) ? Math.max(250, Math.min(60000, date - now())) : 1000;
  }
  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");
    if (options.body !== undefined) { headers.set("Content-Type", "application/json"); options.body = JSON.stringify(options.body); }
    const response = await fetch(url(path), { ...options, headers });
    let body = null;
    try { body = await response.json(); } catch (_) { /* status below is authoritative */ }
    if (!response.ok) {
      const failure = error(body?.error?.code || `CONTROL_HTTP_${response.status}`);
      failure.status = response.status;
      failure.retryAfterMs = parseRetryAfter(response);
      failure.body = body;
      throw failure;
    }
    return { body, response };
  }
  function assertStart(body) {
    if (!body || body.status !== "pending" || !UUID.test(body.authorizationId) || !OPAQUE_TOKEN.test(body.deviceCode) ||
      !/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/.test(body.userCode) || !Number.isFinite(Date.parse(body.expiresAt))) throw error("INVALID_DEVICE_AUTH_RESPONSE");
    return body;
  }
  function assertTokens(body) {
    if (!body || body.status !== "activated" || !validCredentials(body)) throw error("INVALID_TOKEN_RESPONSE");
    return { deviceId: body.deviceId, sessionId: body.sessionId, tokenType: body.tokenType,
      accessToken: body.accessToken, accessTokenExpiresAt: body.accessTokenExpiresAt,
      refreshToken: body.refreshToken, refreshTokenExpiresAt: body.refreshTokenExpiresAt };
  }
  function assertRefreshTokens(body, previous) {
    if (!body || body.tokenType !== "Bearer" || typeof body.accessToken !== "string" || !body.accessToken ||
      !OPAQUE_TOKEN.test(body.refreshToken || "") || !Number.isFinite(Date.parse(body.accessTokenExpiresAt)) ||
      !Number.isFinite(Date.parse(body.refreshTokenExpiresAt))) throw error("INVALID_REFRESH_RESPONSE");
    return { deviceId: previous.deviceId, sessionId: previous.sessionId, tokenType: body.tokenType,
      accessToken: body.accessToken, accessTokenExpiresAt: body.accessTokenExpiresAt,
      refreshToken: body.refreshToken, refreshTokenExpiresAt: body.refreshTokenExpiresAt };
  }
  function accessFresh() { return state.credentials && Date.parse(state.credentials.accessTokenExpiresAt) > now() + 30000; }
  async function openPortal(authorizationId) {
    const portalUrl = url(`/activate?authorizationId=${encodeURIComponent(authorizationId)}`, config.portalOrigin);
    if (chrome.tabs?.create) await chrome.tabs.create({ url: portalUrl });
    return portalUrl;
  }
  async function ensurePolling() {
    if (!pendingLive(state.pending)) return;
    if (pollingFlight) return pollingFlight;
    const generation = state.generation;
    pollingFlight = (async () => {
      while (state.generation === generation && pendingLive(state.pending)) {
        const pending = state.pending;
        try {
          const result = await request("/v1/device-authorizations/token", {
            method: "POST", headers: { "Idempotency-Key": pending.exchangeIdempotencyKey }, body: { deviceCode: pending.deviceCode },
          });
          const credentials = assertTokens(result.body);
          if (state.generation !== generation || state.pending?.authorizationId !== pending.authorizationId) return;
          const previous = state.authority;
          state = { ...state, credentials, pending: null, lastError: null, generation: generation + 1 };
          await writeState();
          await notify(previous, "activated");
          try { await bootstrap(); } catch (failure) {
            state = { ...state, lastError: safeError(failure) };
            await writeState();
          }
          return;
        } catch (failure) {
          if (state.generation !== generation || state.pending?.authorizationId !== pending.authorizationId) return;
          if (failure.code === EXCHANGE_PENDING) {
            const wait = Math.min(Math.max(failure.retryAfterMs || 1000, 250), Math.max(250, Date.parse(pending.expiresAt) - now()));
            await new Promise(resolve => setTimeout(resolve, wait));
            continue;
          }
          const previous = state.authority;
          state = { ...state, pending: null, lastError: safeError(failure), generation: generation + 1 };
          await writeState();
          await notify(previous, "activation_failed");
          return;
        }
      }
    })().finally(() => { pollingFlight = null; });
    return pollingFlight;
  }
  async function startActivation() {
    await restore();
    if (state.credentials && state.authority) return { ...publicStatus(), portalUrl: null };
    if (state.credentials && !state.authority) {
      try { await bootstrap(); } catch (failure) {
        state = { ...state, lastError: safeError(failure) };
        await writeState();
      }
      return { ...publicStatus(), portalUrl: null };
    }
    if (pendingLive(state.pending)) {
      const portalUrl = await openPortal(state.pending.authorizationId);
      void ensurePolling();
      return { ...publicStatus(), portalUrl };
    }
    if (activationFlight) return activationFlight;
    activationFlight = (async () => {
      const startKey = state.pending?.phase === "starting" && TOKEN.test(state.pending.startIdempotencyKey) ? state.pending.startIdempotencyKey : key();
      if (state.pending?.phase !== "starting") {
        state = { ...state, pending: { phase: "starting", startIdempotencyKey: startKey }, lastError: null };
        await writeState();
      }
      const result = await request("/v1/device-authorizations", {
        method: "POST", headers: { "Idempotency-Key": startKey }, body: {
          clientType: "browser_extension", browserFamily: browserFamily(), browserVersion: browserVersion(), extensionVersion: config.extensionVersion,
        },
      });
      const response = assertStart(result.body);
      const next = { ...state, pending: { phase: "pending", authorizationId: response.authorizationId, deviceCode: response.deviceCode,
        userCode: response.userCode, expiresAt: response.expiresAt, startIdempotencyKey: startKey, exchangeIdempotencyKey: key() }, lastError: null };
      await commit(next, state.authority, "activation_started");
      const portalUrl = await openPortal(response.authorizationId);
      void ensurePolling();
      return { ...publicStatus(), portalUrl };
    })().catch(async failure => {
      state = { ...state, lastError: safeError(failure) };
      await writeState();
      throw failure;
    }).finally(() => { activationFlight = null; });
    return activationFlight;
  }
  async function refresh() {
    await restore();
    if (accessFresh() && !state.rotation) return clone(state.credentials);
    if (!state.credentials) throw error("AUTH_REQUIRED");
    if (refreshFlight) return refreshFlight;
    refreshFlight = (async () => {
      const generation = state.generation;
      let rotation = state.rotation;
      if (!rotation || rotation.generation !== generation || rotation.refreshToken !== state.credentials.refreshToken) {
        rotation = { generation, refreshToken: state.credentials.refreshToken, idempotencyKey: key() };
        state = { ...state, rotation };
        await writeState();
      }
      try {
        const result = await request("/v1/auth/refresh", {
          method: "POST", headers: { "Idempotency-Key": rotation.idempotencyKey }, body: { refreshToken: rotation.refreshToken },
        });
        const credentials = assertRefreshTokens(result.body, state.credentials);
        if (state.generation !== generation || state.rotation?.idempotencyKey !== rotation.idempotencyKey) throw error("AUTH_GENERATION_CHANGED");
        state = { ...state, credentials, rotation: null, lastError: null };
        await writeState();
        return clone(credentials);
      } catch (failure) {
        if (failure.code === "AUTH_REFRESH_INVALID") {
          const previous = state.authority;
          state = { generation: state.generation + 1, credentials: null, pending: null, rotation: null, authority: null, lastError: safeError(failure) };
          await writeState();
          await notify(previous, "refresh_invalid");
        }
        throw failure;
      }
    })().finally(() => { refreshFlight = null; });
    return refreshFlight;
  }
  function bootstrapRequest(detectedAi) {
    const body = { contractVersion: "control_plane_v2", extensionVersion: config.extensionVersion,
      browser: { family: browserFamily(), version: browserVersion() }, deviceId: state.credentials.deviceId,
      lastConfigVersion: state.authority?.payload?.configVersion || null };
    if (detectedAi) body.detectedAi = detectedAi;
    return body;
  }
  async function bootstrap(options = {}) {
    await restore();
    if (!state.credentials) throw error("AUTH_REQUIRED");
    if (!accessFresh()) await refresh();
    const generation = state.generation;
    const result = await request("/v1/bootstrap", { method: "POST", headers: { Authorization: `Bearer ${state.credentials.accessToken}` }, body: bootstrapRequest(options.detectedAi) });
    const verified = await verifier.verifyV2(result.body, config.trustBundle);
    if (!verified.ok) throw error(`BOOTSTRAP_${verified.error}`);
    if (verified.payload.account.status !== "ACTIVE" || verified.payload.devicePolicy.status !== "ACTIVE" ||
      verified.payload.compatibility.browser.status !== "SUPPORTED" || Date.parse(verified.payload.expiresAt) <= now()) throw error("BOOTSTRAP_EXPIRED_OR_INCOMPATIBLE");
    if (state.generation !== generation) throw error("AUTH_GENERATION_CHANGED");
    const previous = state.authority;
    state = { ...state, authority: { verified: true, payload: verified.payload, envelope: verified.envelope, deviceId: state.credentials.deviceId, sessionId: state.credentials.sessionId }, lastError: null };
    await writeState();
    await notify(previous, "bootstrap_verified");
    return clone(verified.payload);
  }
  async function ensureForIdentity(identity) {
    await restore();
    if (!state.credentials) throw error("AUTH_REQUIRED");
    if (!state.authority) return bootstrap({ detectedAi: identity?.ai_id ? { family: "chatgpt", surface: "web", variant: null } : null });
    if (canWork(state.authority.payload)) return clone(state.authority.payload);
    const detectedAi = identity?.ai_id ? { family: "chatgpt", surface: "web", variant: null } : null;
    return bootstrap({ detectedAi });
  }
  async function restore() {
    if (restoreFlight) return restoreFlight;
    restoreFlight = (async () => {
      await chrome.storage.local.setAccessLevel?.({ accessLevel: "TRUSTED_CONTEXTS" });
      const saved = await readState();
      if (saved && typeof saved === "object") state = { ...state, ...clone(saved) };
      if (!validCredentials(state.credentials)) state = { ...state, credentials: null, authority: null, rotation: null };
      if (state.authority && state.credentials) {
        try {
          if (state.authority.deviceId !== state.credentials.deviceId || state.authority.sessionId !== state.credentials.sessionId) throw error("AUTHORITY_CREDENTIAL_MISMATCH");
          const verified = await verifier.verifyV2(state.authority.envelope, config.trustBundle);
          if (!verified.ok) throw error(`STORED_AUTHORITY_${verified.error}`);
          if (verifier.canonicalJson(verified.payload) !== verifier.canonicalJson(state.authority.payload)) throw error("STORED_AUTHORITY_PAYLOAD_MISMATCH");
          if (Date.parse(verified.payload.expiresAt) <= now()) throw error("BOOTSTRAP_EXPIRED");
        } catch (failure) {
          const previous = state.authority;
          state = { ...state, authority: null, lastError: safeError(failure), generation: state.generation + 1 };
          await writeState();
          await notify(previous, "authority_invalid");
        }
      }
      if (pendingLive(state.pending)) void ensurePolling();
      if (state.rotation && state.credentials && state.rotation.generation === state.generation) {
        /* A prior worker died after the server committed rotation. The same key and old token are retried. */
      }
      return publicStatus();
    })().finally(() => { restoreFlight = null; });
    return restoreFlight;
  }
  async function localReset() {
    await restore();
    const previous = state.authority;
    state = { generation: state.generation + 1, credentials: null, pending: null, rotation: null, authority: null, lastError: null };
    await writeState();
    await notify(previous, "local_reset");
    return publicStatus();
  }
  async function cancelActivation() {
    await restore();
    const previous = state.authority;
    state = { ...state, generation: state.generation + 1, pending: null, lastError: null };
    await writeState();
    await notify(previous, "activation_cancelled");
    return publicStatus();
  }
  const api = {
    restore, status: async () => { await restore(); return publicStatus(); }, currentAccount: async () => { await restore(); return state.authority?.payload?.account?.id || null; },
    generation: async () => { await restore(); return state.generation; }, hasAuthority: async () => { await restore(); return Boolean(state.authority && state.credentials); },
    canWork: async () => { await restore(); return Boolean(state.authority && canWork(state.authority.payload)); }, getAuthority: async () => { await restore(); return clone(state.authority); },
    startActivation, cancelActivation, refresh, bootstrap, ensureForIdentity, localReset,
    openPortal: async () => { await restore(); if (!state.pending) throw error("NO_ACTIVATION_ATTEMPT"); return openPortal(state.pending.authorizationId); },
    onAuthorityChanged: handler => { authorityChanged = handler; },
  };
  globalThis.SellerAgentsControlClient = Object.freeze(api);
})();
