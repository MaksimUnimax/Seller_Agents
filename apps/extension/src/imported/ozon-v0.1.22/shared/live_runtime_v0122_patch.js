/* global OzonContract, OzonOperationRegistry, OzonProviderFactory, OzonRuntime */
(() => {
  "use strict";

  const PATCH_KEY = "__OZON_LIVE_RUNTIME_REPAIR_V0122__";
  if (globalThis[PATCH_KEY]) return;

  const TARGET_VERSION = "0.1.22";
  const TARGET_DOWNLOAD = "performance_statistics_report_download";
  const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const baseContract = globalThis.OzonContract;
  const baseRegistry = globalThis.OzonOperationRegistry;
  const providerFactory = globalThis.OzonProviderFactory;
  if (!baseContract?.OPERATIONS || !baseRegistry?.OPERATIONS || typeof providerFactory?.createOzonProvider !== "function") {
    throw new Error("Ozon v0.1.22 runtime repair prerequisites missing.");
  }

  function fail(code, message) {
    const error = new Error(message);
    error.code = code;
    error.external_request_executed = false;
    error.http_status = 0;
    throw error;
  }
  function plain(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype);
  }
  function cloneJson(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    const seen = new WeakSet();
    const stack = [value];
    while (stack.length) {
      const current = stack.pop();
      if (!current || typeof current !== "object" || seen.has(current)) continue;
      seen.add(current);
      Object.freeze(current);
      for (const child of Object.values(current)) if (child && typeof child === "object" && !seen.has(child)) stack.push(child);
    }
    return value;
  }
  function stableSemanticClone(value) {
    if (Array.isArray(value)) return value.map((item) => stableSemanticClone(item));
    if (value && typeof value === "object") {
      const out = {};
      for (const key of Object.keys(value).sort()) out[key] = stableSemanticClone(value[key]);
      return out;
    }
    return value;
  }
  function fnv1a(value) {
    const text = String(value || "");
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
  function xlsxTypes(existing) {
    const list = Array.isArray(existing) ? existing.map(String) : [];
    if (!list.includes(XLSX_CONTENT_TYPE)) list.push(XLSX_CONTENT_TYPE);
    return Object.freeze(list);
  }

  const baseDownloadContractMeta = baseContract.OPERATIONS[TARGET_DOWNLOAD];
  const baseDownloadRegistryMeta = baseRegistry.OPERATIONS[TARGET_DOWNLOAD];
  if (!baseDownloadContractMeta || !baseDownloadRegistryMeta) throw new Error("Ozon v0.1.22 target Performance download operation missing.");

  function normalizeVendorDownload(raw) {
    if (!plain(raw)) fail("INVALID_JSON_ROOT", "Команда должна быть JSON-объектом.");
    const extraTop = Object.keys(raw).filter((key) => !["operation", "params"].includes(key));
    if (extraTop.length) fail("UNKNOWN_TOP_LEVEL_FIELD", `Неизвестные поля команды: ${extraTop.join(", ")}`);
    if (String(raw.operation || "").trim() !== TARGET_DOWNLOAD) return baseContract.normalizeCommand(raw);
    const params = raw.params === undefined ? {} : raw.params;
    if (!plain(params)) fail("INVALID_OPERATION_PARAMS", "params должен быть JSON-объектом.");
    const extraParams = Object.keys(params).filter((key) => !["UUID", "vendor"].includes(key));
    if (extraParams.length) fail("INVALID_OPERATION_PARAMS", `params: неизвестные поля: ${extraParams.join(", ")}.`);
    const baseParams = {};
    if (Object.prototype.hasOwnProperty.call(params, "UUID")) baseParams.UUID = params.UUID;
    const normalizedBase = baseContract.normalizeCommand({ operation: TARGET_DOWNLOAD, params: baseParams });
    if (!Object.prototype.hasOwnProperty.call(params, "vendor")) return normalizedBase;
    if (params.vendor !== true) fail("INVALID_OPERATION_PARAMS", "params.vendor допускает только boolean true для vendor-отчёта.");
    return deepFreeze({ operation: TARGET_DOWNLOAD, params: { ...cloneJson(normalizedBase.params), vendor: true } });
  }

  function normalizeCommand(raw) {
    const alias = plain(raw) ? String(raw.operation || "").trim() : "";
    return alias === TARGET_DOWNLOAD ? normalizeVendorDownload(raw) : baseContract.normalizeCommand(raw);
  }
  function stripVendor(command) {
    const normalized = normalizeCommand(command);
    if (normalized.operation !== TARGET_DOWNLOAD || normalized.params?.vendor !== true) return normalized;
    const params = { ...cloneJson(normalized.params) };
    delete params.vendor;
    return baseContract.normalizeCommand({ operation: TARGET_DOWNLOAD, params });
  }
  function commandFingerprint(command) {
    const normalized = normalizeCommand(command);
    return fnv1a(JSON.stringify(stableSemanticClone(normalized)));
  }

  const downloadContractMeta = deepFreeze({
    ...baseDownloadContractMeta,
    response_content_types: xlsxTypes(baseDownloadContractMeta.response_content_types),
    normalizeParams: (params) => normalizeVendorDownload({ operation: TARGET_DOWNLOAD, params }).params,
    contract_state: `${String(baseDownloadContractMeta.contract_state || "current")}_vendor_xlsx_v0122`
  });
  const contractOperations = deepFreeze({ ...baseContract.OPERATIONS, [TARGET_DOWNLOAD]: downloadContractMeta });
  const downloadRegistryMeta = deepFreeze({
    ...baseDownloadRegistryMeta,
    response_content_types: xlsxTypes(baseDownloadRegistryMeta.response_content_types)
  });
  const registryOperations = deepFreeze({ ...baseRegistry.OPERATIONS, [TARGET_DOWNLOAD]: downloadRegistryMeta });

  function resolveOperation(alias) {
    const name = String(alias || "").trim();
    if (name !== TARGET_DOWNLOAD) return baseContract.resolveOperation(name);
    if (downloadContractMeta.effect !== "READ") fail("NON_READ_OPERATION_REJECTED", `Операция ${name} не является READ.`);
    return { operation: name, meta: downloadContractMeta };
  }
  function preflightExecution(command) {
    const normalized = normalizeCommand(command);
    if (normalized.operation !== TARGET_DOWNLOAD) return baseContract.preflightExecution(normalized);
    if (downloadContractMeta.execution_enabled !== true) fail("OPERATION_BLOCKED", `Операция ${TARGET_DOWNLOAD} отключена политикой bridge.`);
    return { command: normalized, meta: downloadContractMeta };
  }
  function parseCommand(text) {
    const source = String(text || "").replace(/\u00a0/g, " ").trim();
    if (!source.startsWith(baseContract.PREFIX)) fail("NOT_OZON_COMMAND", `Команда должна начинаться с ${baseContract.PREFIX}`);
    const rest = source.slice(baseContract.PREFIX.length).trim();
    if (!rest) fail("MISSING_JSON", `После ${baseContract.PREFIX} должен идти JSON-объект.`);
    let raw;
    try { raw = JSON.parse(rest); }
    catch (error) { fail("INVALID_JSON", `Некорректный JSON: ${error.message}`); }
    return normalizeCommand(raw);
  }
  function extractBalancedJsonObject(source, objectStart) {
    if (source[objectStart] !== "{") return { ok: false, code: "MISSING_JSON", message: `После ${baseContract.PREFIX} должен идти JSON-объект.` };
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = objectStart; index < source.length; index += 1) {
      const char = source[index];
      if (inString) {
        if (escaped) { escaped = false; continue; }
        if (char === "\\") { escaped = true; continue; }
        if (char === '"') inString = false;
        continue;
      }
      if (char === '"') { inString = true; continue; }
      if (char === "{") depth += 1;
      else if (char === "}") {
        depth -= 1;
        if (depth === 0) return { ok: true, json_text: source.slice(objectStart, index + 1), end_index: index + 1 };
        if (depth < 0) break;
      }
    }
    return { ok: false, code: "INVALID_JSON", message: `JSON-объект после ${baseContract.PREFIX} не завершён.` };
  }
  function discoverCommands(text) {
    const source = String(text || "").replace(/\u00a0/g, " ");
    const ignorable = /[\s\u200B\u2060\u00AD]/u;
    const discovered = [];
    let cursor = 0;
    while (cursor < source.length) {
      const markerIndex = source.indexOf(baseContract.PREFIX, cursor);
      if (markerIndex < 0) break;
      const afterMarker = markerIndex + baseContract.PREFIX.length;
      let objectStart = afterMarker;
      while (objectStart < source.length && ignorable.test(source[objectStart])) objectStart += 1;
      if (source[objectStart] !== "{") {
        discovered.push(Object.freeze({ ok: false, marker_index: markerIndex, code: "MISSING_JSON", message: `После ${baseContract.PREFIX} должен непосредственно идти JSON-объект.` }));
        cursor = afterMarker;
        continue;
      }
      const extracted = extractBalancedJsonObject(source, objectStart);
      if (!extracted.ok) {
        discovered.push(Object.freeze({ ok: false, marker_index: markerIndex, code: extracted.code, message: extracted.message }));
        cursor = afterMarker;
        continue;
      }
      const commandText = `${baseContract.PREFIX} ${extracted.json_text}`;
      let rawAttempt = null;
      try { rawAttempt = JSON.parse(extracted.json_text); } catch (_) {}
      try {
        const command = parseCommand(commandText);
        preflightExecution(command);
        discovered.push(Object.freeze({ ok: true, marker_index: markerIndex, command_text: commandText, command, command_fingerprint: commandFingerprint(command) }));
      } catch (error) {
        discovered.push(Object.freeze({
          ok: false,
          marker_index: markerIndex,
          code: String(error?.code || "INVALID_COMMAND"),
          message: String(error?.message || error || "Некорректная команда."),
          attempt_descriptor: typeof baseContract.sanitizedAttemptDescriptor === "function"
            ? baseContract.sanitizedAttemptDescriptor(rawAttempt, String(error?.code || "INVALID_COMMAND"))
            : null
        }));
      }
      cursor = extracted.end_index;
    }
    return Object.freeze(discovered);
  }

  function buildPerformanceRequest(command, headers) {
    const normalized = normalizeCommand(command);
    if (normalized.operation !== TARGET_DOWNLOAD) return baseContract.buildPerformanceRequest(normalized, headers);
    const baseCommand = stripVendor(normalized);
    const request = baseContract.buildPerformanceRequest(baseCommand, headers);
    if (normalized.params?.vendor !== true) return request;
    const separator = String(request.url || "").includes("?") ? "&" : "?";
    return deepFreeze({
      ...request,
      url: `${request.url}${separator}vendor=t`,
      response_content_types: xlsxTypes(request.response_content_types)
    });
  }
  function sanitizeResult(command, rawResult) {
    const normalized = normalizeCommand(command);
    return normalized.operation === TARGET_DOWNLOAD
      ? baseContract.sanitizeResult(stripVendor(normalized), rawResult)
      : baseContract.sanitizeResult(normalized, rawResult);
  }
  function verifyProviderResponse(command, rawResult) {
    const normalized = normalizeCommand(command);
    return normalized.operation === TARGET_DOWNLOAD
      ? baseContract.verifyProviderResponse(stripVendor(normalized), rawResult)
      : baseContract.verifyProviderResponse(normalized, rawResult);
  }
  function analyticsCoalescingDescriptor(command) {
    const normalized = normalizeCommand(command);
    if (normalized.operation === TARGET_DOWNLOAD) return deepFreeze({ eligible: false, reason: "operation_not_analytics_data", metrics: [], compatibility_key: null, compatibility_fingerprint: null });
    return baseContract.analyticsCoalescingDescriptor(normalized);
  }
  function reviewedAnalyticsAcquisitionProfile(command) {
    const normalized = normalizeCommand(command);
    if (normalized.operation === TARGET_DOWNLOAD) {
      return deepFreeze({ applicable: false, profile_id: null, prefetch_applied: false, command: normalized, requested_metrics: [], physical_metrics: [] });
    }
    return baseContract.reviewedAnalyticsAcquisitionProfile(normalized);
  }
  function sellerCapabilityRequirement(command, atMs = Date.now(), entitlementSnapshot = null) {
    const normalized = normalizeCommand(command);
    if (normalized.operation !== TARGET_DOWNLOAD) return baseContract.sellerCapabilityRequirement(normalized, atMs, entitlementSnapshot);
    return deepFreeze({
      known: true,
      required: false,
      operation: TARGET_DOWNLOAD,
      entitlement_key: downloadContractMeta.entitlement_key,
      rule_source: "performance_provider_not_seller_subscription",
      reasons: ["performance_provider_not_seller_subscription"],
      default_access: "available"
    });
  }
  function performancePlanning(command) {
    return deepFreeze({
      action: "execute",
      command,
      logical_command: command,
      planning: {
        capability: { status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false, probe_http_status: 0, probe_error_code: null },
        entitlement: { status: "SUPPORTED_AND_ENTITLED", partial: false, capability_required: false, reason: "performance_provider_not_seller_subscription", exact_request_preserved: true }
      }
    });
  }
  function planCommandForSellerCapability(command, profile, atMs = Date.now(), entitlementSnapshot = null) {
    const normalized = normalizeCommand(command);
    if (normalized.operation === TARGET_DOWNLOAD) return performancePlanning(normalized);
    return baseContract.planCommandForSellerCapability(normalized, profile, atMs, entitlementSnapshot);
  }

  function rewriteEnvelopeVersionAndFingerprint(text, normalizedCommand = null) {
    const source = String(text || "");
    const newline = source.indexOf("\n");
    if (newline <= 0) return source;
    let envelope;
    try { envelope = JSON.parse(source.slice(newline + 1)); }
    catch (_) { return source; }
    if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) return source;
    envelope.version = TARGET_VERSION;
    if (normalizedCommand && envelope.command && typeof envelope.command === "object") {
      envelope.command = { ...envelope.command, fingerprint: commandFingerprint(normalizedCommand) };
    }
    return `${source.slice(0, newline)}\n${JSON.stringify(envelope, null, 2)}`;
  }
  function formatResultReport(args) {
    const normalized = normalizeCommand(args.command);
    const baseArgs = normalized.operation === TARGET_DOWNLOAD ? { ...args, command: stripVendor(normalized) } : { ...args, command: normalized };
    return rewriteEnvelopeVersionAndFingerprint(baseContract.formatResultReport(baseArgs), normalized);
  }
  function formatPreExecutionErrorReport(args) {
    return rewriteEnvelopeVersionAndFingerprint(baseContract.formatPreExecutionErrorReport(args), null);
  }

  const patchedRegistry = Object.freeze({
    ...baseRegistry,
    OPERATIONS: registryOperations,
    operation(alias) { return registryOperations[String(alias || "").trim()] || null; },
    operationsForCluster(clusterId, section = null, options = {}) {
      const cluster = typeof baseRegistry.canonicalClusterId === "function" ? baseRegistry.canonicalClusterId(clusterId) : String(clusterId || "").trim();
      const includeConditional = options.includeConditional !== false;
      const includeHidden = options.includeHidden === true;
      return Object.entries(registryOperations)
        .filter(([, meta]) => meta.cluster === cluster)
        .filter(([, meta]) => section == null || meta.section === String(section))
        .filter(([, meta]) => includeHidden || meta.guidance_visibility !== "hidden")
        .filter(([, meta]) => includeConditional || meta.guidance_visibility !== "conditional")
        .map(([alias, meta]) => ({ alias, meta }));
    },
    catalogValidation(contractOps = null) {
      const result = baseRegistry.catalogValidation(contractOps || contractOperations);
      const errors = Array.isArray(result?.errors) ? [...result.errors] : [];
      const target = (contractOps || contractOperations)?.[TARGET_DOWNLOAD];
      if (!target) errors.push(`contract_missing:${TARGET_DOWNLOAD}`);
      else if (target.method !== downloadRegistryMeta.method || target.path !== downloadRegistryMeta.path || String(target.provider || "") !== String(downloadRegistryMeta.provider || "")) errors.push(`contract_transport_mismatch:${TARGET_DOWNLOAD}`);
      return deepFreeze({ ok: errors.length === 0, errors });
    }
  });

  const patchedContract = Object.freeze({
    ...baseContract,
    VERSION: TARGET_VERSION,
    OPERATIONS: contractOperations,
    normalizeCommand,
    resolveOperation,
    preflightExecution,
    parseCommand,
    discoverCommands,
    buildPerformanceRequest,
    sanitizeResult,
    verifyProviderResponse,
    commandFingerprint,
    analyticsCoalescingDescriptor,
    reviewedAnalyticsAcquisitionProfile,
    sellerCapabilityRequirement,
    planCommandForSellerCapability,
    formatResultReport,
    formatPreExecutionErrorReport
  });

  function commandRequiresPersonalDataPolicy(command, provider = null) {
    const normalized = patchedContract.normalizeCommand(command);
    const meta = patchedRegistry.operation(normalized.operation);
    if (meta?.policy_group === "personal_data_read") return true;
    if (normalized.operation !== "report_file_get") return false;
    const refPolicy = typeof provider?.reportFileRefPolicy === "function" ? provider.reportFileRefPolicy(normalized.params?.file_ref) : null;
    return refPolicy?.known === true && refPolicy.personal_data_required === true;
  }
  async function defaultSettingsReader() {
    const key = globalThis.OzonRuntime?.STORAGE_KEYS?.PERSONAL_DATA_ENABLED || "ozmb_personal_data_enabled_v1";
    const storage = globalThis.chrome?.storage?.local;
    if (!storage || typeof storage.get !== "function") return { personalDataEnabled: false, source: "storage_unavailable_fail_closed" };
    const data = await storage.get(key);
    return { personalDataEnabled: data?.[key] === true, source: "chrome.storage.local" };
  }
  function personalDataBlockedError() {
    const error = new Error("Операция может передать личные данные в AI-чат. Чтобы выполнить запрос, включите «Показывать личные данные» в настройках Ozon Bridge, затем явно запустите новую команду.");
    error.code = "OPERATION_DISABLED_BY_USER";
    error.external_request_executed = false;
    error.request_attempted = false;
    error.http_status = 0;
    error.policy = "personal_data_setting_required";
    return error;
  }
  function wrapProviderWithPersonalDataGuard(baseProvider, { settingsReader = defaultSettingsReader } = {}) {
    if (!baseProvider || typeof baseProvider.executeCommandObject !== "function") throw new Error("Ozon v0.1.22 privacy guard requires executeCommandObject.");
    async function executeCommandObject(command, sellerCredentials, performanceCredentials = {}, options = {}) {
      const normalized = patchedContract.normalizeCommand(command);
      if (commandRequiresPersonalDataPolicy(normalized, baseProvider)) {
        let settings;
        try { settings = await settingsReader(); }
        catch (_) { settings = { personalDataEnabled: false, source: "settings_read_failed_fail_closed" }; }
        if (settings?.personalDataEnabled !== true) throw personalDataBlockedError();
      }
      return baseProvider.executeCommandObject(normalized, sellerCredentials, performanceCredentials, options);
    }
    async function executeCommand(commandText, sellerCredentials, performanceCredentials = {}, options = {}) {
      return executeCommandObject(patchedContract.parseCommand(commandText), sellerCredentials, performanceCredentials, options);
    }
    return Object.freeze({ ...baseProvider, executeCommandObject, executeCommand });
  }

  globalThis.OzonOperationRegistry = patchedRegistry;
  globalThis.OzonContract = patchedContract;
  const recreatedProvider = providerFactory.createOzonProvider({ contract: patchedContract });
  globalThis.OzonProvider = wrapProviderWithPersonalDataGuard(recreatedProvider);

  const api = Object.freeze({
    TARGET_VERSION,
    TARGET_DOWNLOAD,
    XLSX_CONTENT_TYPE,
    stableSemanticClone,
    commandFingerprint,
    commandRequiresPersonalDataPolicy,
    wrapProviderWithPersonalDataGuard,
    normalizeVendorDownload
  });
  globalThis.OzonLiveRuntimeRepairV0122 = api;
  globalThis[PATCH_KEY] = api;
})();
