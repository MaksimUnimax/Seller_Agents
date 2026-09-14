/* global OzonOperationRegistry, OzonContract, OzonContractFactory, OzonProviderFactory, OzonEntitlements */
(() => {
  "use strict";

  const PATCH_KEY = "__OZON_SWAGGER_READ_SURFACE_PATCH_20260913__";
  if (globalThis[PATCH_KEY]) return;

  const baseRegistry = globalThis.OzonOperationRegistry;
  const baseContract = globalThis.OzonContract;
  const contractFactory = globalThis.OzonContractFactory;
  if (!baseRegistry?.OPERATIONS || !baseContract?.OPERATIONS || typeof contractFactory?.createOzonContract !== "function") {
    throw new Error("Ozon read-surface patch: base registry/contract authority missing.");
  }

  function fail(code, message) {
    const error = new Error(message);
    error.code = code;
    error.external_request_executed = false;
    throw error;
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

  function plain(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype);
  }

  function cloneJson(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function requirePlain(value, path = "params") {
    if (!plain(value)) fail("INVALID_OPERATION_PARAMS", `${path} должен быть JSON-объектом.`);
    return { ...value };
  }

  function allowedFields(object, fields, path = "params") {
    const allowed = new Set(fields);
    const extra = Object.keys(object).filter((key) => !allowed.has(key));
    if (extra.length) fail("INVALID_OPERATION_PARAMS", `${path}: неизвестные поля: ${extra.join(", ")}.`);
  }

  function requireField(object, field, path = "params") {
    if (!Object.prototype.hasOwnProperty.call(object, field)) fail("INVALID_OPERATION_PARAMS", `${path}.${field} обязателен.`);
    return object[field];
  }

  function requireString(value, path, { nonEmpty = true } = {}) {
    if (typeof value !== "string") fail("INVALID_OPERATION_PARAMS", `${path} должен быть строкой.`);
    const text = value.trim();
    if (nonEmpty && !text) fail("INVALID_OPERATION_PARAMS", `${path} не должен быть пустым.`);
    return text;
  }

  function requireInt(value, path, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
    if (!Number.isSafeInteger(value) || value < min || value > max) fail("INVALID_OPERATION_PARAMS", `${path} должен быть целым числом ${min}..${max}.`);
    return value;
  }

  function requireEnum(value, path, values) {
    const text = requireString(value, path);
    if (!values.includes(text)) fail("INVALID_OPERATION_PARAMS", `${path}: неподдерживаемое значение ${text}.`);
    return text;
  }

  function requireUint64String(value, path) {
    const text = requireString(value, path);
    if (!/^(?:0|[1-9]\d*)$/.test(text)) fail("INVALID_OPERATION_PARAMS", `${path} должен быть uint64 в строке.`);
    try {
      const n = BigInt(text);
      if (n < 0n || n > 18446744073709551615n) throw new Error("range");
    } catch (_) { fail("INVALID_OPERATION_PARAMS", `${path} выходит за uint64.`); }
    return text;
  }

  function requireRfc3339(value, path) {
    const text = requireString(value, path);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(text) || !Number.isFinite(Date.parse(text))) {
      fail("INVALID_OPERATION_PARAMS", `${path} должен быть RFC3339 date-time.`);
    }
    return text;
  }

  function requireYmd(value, path) {
    const text = requireString(value, path);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!match) fail("INVALID_OPERATION_PARAMS", `${path} должен быть датой ГГГГ-ММ-ДД.`);
    const date = new Date(`${text}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== text) fail("INVALID_OPERATION_PARAMS", `${path} содержит несуществующую дату.`);
    return text;
  }

  function requirePair(object, left, right, validator, path = "params", { optional = true } = {}) {
    const hasLeft = Object.prototype.hasOwnProperty.call(object, left);
    const hasRight = Object.prototype.hasOwnProperty.call(object, right);
    if (hasLeft !== hasRight) fail("INVALID_OPERATION_PARAMS", `${path}.${left} и ${path}.${right} должны передаваться парой.`);
    if (!optional && !hasLeft) fail("INVALID_OPERATION_PARAMS", `${path}.${left} и ${path}.${right} обязательны.`);
    if (hasLeft) {
      object[left] = validator(object[left], `${path}.${left}`);
      object[right] = validator(object[right], `${path}.${right}`);
      if (Date.parse(object[left]) > Date.parse(object[right])) fail("INVALID_OPERATION_PARAMS", `${path}.${left} не может быть позже ${path}.${right}.`);
    }
    return hasLeft;
  }

  function normalizeCampaigns(value, path) {
    if (!Array.isArray(value) || !value.length) fail("INVALID_OPERATION_PARAMS", `${path} должен быть непустым массивом.`);
    return value.map((item, index) => requireUint64String(item, `${path}[${index}]`));
  }

  const GROUP_BY = Object.freeze(["NO_GROUP_BY", "DATE", "START_OF_WEEK", "START_OF_MONTH"]);
  const VENDOR_TYPES = Object.freeze(["TRAFFIC_SOURCES", "ORDERS"]);
  const DECOMMISSION_COMPENSATION = Object.freeze(["NO_COMPENSATION", "PRELIMINARY_COMPENSATION", "CLOSED_COMPENSATION"]);
  const DECOMMISSION_DELIVERY = Object.freeze(["FBO", "FBS"]);
  const DECOMMISSION_REASONS = Object.freeze([
    "ECONOM_UTILIZATION", "SELLER_UTILIZATION", "MISSED_DEADLINE", "MISSED_COURIER_DELIVERY", "PROHIBITED_FOR_SALE",
    "EXPIRED", "DAMAGED_DUE_TO_PACKAGING", "DAMAGED_BY_CUSTOMER", "SPILLED_DUE_TO_PACKAGING", "OZON_DEFECT", "OZON_LOSS",
    "OTHER", "REZON", "AUTODISPOSAL_STOCK", "RETURNS_AUTO_INVALID", "RETURNS_AUTO_VALID", "TRUSTBASED_ACCEPTANCE"
  ]);
  const DECOMMISSION_SORT_BY = Object.freeze(["DATE", "DISPOSAL_FEE"]);
  const SORT_DIR = Object.freeze(["ASC", "DESC"]);

  function normalizePerformancePeriodBody(params, { campaignsRequired = false, video = false } = {}) {
    const out = requirePlain(params);
    const fields = video ? ["campaigns", "dateFrom", "dateTo", "groupBy"] : ["campaigns", "from", "to", "dateFrom", "dateTo", "groupBy"];
    allowedFields(out, fields);
    if (campaignsRequired || Object.prototype.hasOwnProperty.call(out, "campaigns")) out.campaigns = normalizeCampaigns(requireField(out, "campaigns"), "params.campaigns");
    if (!video) requirePair(out, "from", "to", requireRfc3339);
    requirePair(out, "dateFrom", "dateTo", requireYmd);
    if (Object.prototype.hasOwnProperty.call(out, "groupBy")) out.groupBy = requireEnum(out.groupBy, "params.groupBy", GROUP_BY);
    return out;
  }

  function normalizeSearchPromoReport(params) {
    const out = requirePlain(params);
    allowedFields(out, ["from", "to"]);
    requirePair(out, "from", "to", requireRfc3339);
    return out;
  }

  function normalizeAllSkuReport(params) {
    const out = requirePlain(params);
    allowedFields(out, ["timeBounds.from", "timeBounds.to"]);
    requirePair(out, "timeBounds.from", "timeBounds.to", requireRfc3339);
    return out;
  }

  function normalizeVendorStatistics(params) {
    const out = requirePlain(params);
    allowedFields(out, ["dateFrom", "dateTo", "type"]);
    requirePair(out, "dateFrom", "dateTo", requireYmd);
    if (Object.prototype.hasOwnProperty.call(out, "type")) out.type = requireEnum(out.type, "params.type", VENDOR_TYPES);
    return out;
  }

  function normalizeDecommissionedGoods(params) {
    const out = requirePlain(params);
    allowedFields(out, ["filter", "page", "page_size", "sort_by", "sort_dir"]);
    const filter = requirePlain(requireField(out, "filter"), "params.filter");
    allowedFields(filter, ["compensation", "date_from", "date_to", "delivery_schema", "dispose_reasons", "posting_number", "skus", "supply_id"], "params.filter");
    filter.date_from = requireRfc3339(requireField(filter, "date_from", "params.filter"), "params.filter.date_from");
    filter.date_to = requireRfc3339(requireField(filter, "date_to", "params.filter"), "params.filter.date_to");
    if (Date.parse(filter.date_from) > Date.parse(filter.date_to)) fail("INVALID_OPERATION_PARAMS", "params.filter.date_from не может быть позже date_to.");
    filter.delivery_schema = requireEnum(requireField(filter, "delivery_schema", "params.filter"), "params.filter.delivery_schema", DECOMMISSION_DELIVERY);
    if (Object.prototype.hasOwnProperty.call(filter, "compensation")) {
      if (!Array.isArray(filter.compensation)) fail("INVALID_OPERATION_PARAMS", "params.filter.compensation должен быть массивом.");
      filter.compensation = filter.compensation.map((item, i) => requireEnum(item, `params.filter.compensation[${i}]`, DECOMMISSION_COMPENSATION));
    }
    if (Object.prototype.hasOwnProperty.call(filter, "dispose_reasons")) {
      if (!Array.isArray(filter.dispose_reasons)) fail("INVALID_OPERATION_PARAMS", "params.filter.dispose_reasons должен быть массивом.");
      filter.dispose_reasons = filter.dispose_reasons.map((item, i) => requireEnum(item, `params.filter.dispose_reasons[${i}]`, DECOMMISSION_REASONS));
    }
    if (Object.prototype.hasOwnProperty.call(filter, "posting_number")) filter.posting_number = requireString(filter.posting_number, "params.filter.posting_number");
    if (Object.prototype.hasOwnProperty.call(filter, "skus")) {
      if (!Array.isArray(filter.skus) || filter.skus.length > 100) fail("INVALID_OPERATION_PARAMS", "params.filter.skus должен содержать не более 100 элементов.");
      filter.skus = filter.skus.map((item, i) => {
        const text = requireString(item, `params.filter.skus[${i}]`);
        if (!/^-?\d+$/.test(text)) fail("INVALID_OPERATION_PARAMS", `params.filter.skus[${i}] должен быть int64 в строке.`);
        return text;
      });
    }
    if (Object.prototype.hasOwnProperty.call(filter, "supply_id")) filter.supply_id = requireInt(filter.supply_id, "params.filter.supply_id");
    out.filter = filter;
    out.page = requireInt(requireField(out, "page"), "params.page", { min: 0, max: 2147483647 });
    out.page_size = requireInt(requireField(out, "page_size"), "params.page_size", { min: 1, max: 99 });
    if (Object.prototype.hasOwnProperty.call(out, "sort_by")) out.sort_by = requireEnum(out.sort_by, "params.sort_by", DECOMMISSION_SORT_BY);
    if (Object.prototype.hasOwnProperty.call(out, "sort_dir")) out.sort_dir = requireEnum(out.sort_dir, "params.sort_dir", SORT_DIR);
    return out;
  }

  function normalizeDependentAttributes(params) {
    const out = requirePlain(params);
    allowedFields(out, ["description_category_id", "type_id"]);
    out.description_category_id = requireInt(requireField(out, "description_category_id"), "params.description_category_id", { min: 1 });
    if (Object.prototype.hasOwnProperty.call(out, "type_id")) out.type_id = requireInt(out.type_id, "params.type_id", { min: 0 });
    return out;
  }

  function normalizeDependentAttributeValues(params) {
    const out = requirePlain(params);
    allowedFields(out, ["child_attribute_id", "cursor", "description_category_id", "limit", "parent_attribute_id", "type_id"]);
    out.child_attribute_id = requireInt(requireField(out, "child_attribute_id"), "params.child_attribute_id", { min: 1 });
    out.parent_attribute_id = requireInt(requireField(out, "parent_attribute_id"), "params.parent_attribute_id", { min: 1 });
    if (Object.prototype.hasOwnProperty.call(out, "cursor")) out.cursor = requireString(out.cursor, "params.cursor", { nonEmpty: false });
    if (Object.prototype.hasOwnProperty.call(out, "description_category_id")) out.description_category_id = requireInt(out.description_category_id, "params.description_category_id", { min: 1 });
    if (Object.prototype.hasOwnProperty.call(out, "type_id")) out.type_id = requireInt(out.type_id, "params.type_id", { min: 0 });
    if (Object.prototype.hasOwnProperty.call(out, "limit")) out.limit = requireInt(out.limit, "params.limit", { min: 1, max: 1000 });
    return out;
  }

  function normalizeNotificationCheck(params) {
    const out = requirePlain(params);
    allowedFields(out, ["url"]);
    const raw = requireString(requireField(out, "url"), "params.url");
    let parsed;
    try { parsed = new URL(raw); }
    catch (_) { fail("INVALID_OPERATION_PARAMS", "params.url должен быть корректным HTTPS URL."); }
    if (parsed.protocol !== "https:") fail("NOTIFICATION_URL_REJECTED", "params.url: разрешён только HTTPS.");
    if (parsed.username || parsed.password) fail("NOTIFICATION_URL_REJECTED", "params.url: userinfo запрещён.");
    if (parsed.port && parsed.port !== "443") fail("NOTIFICATION_URL_REJECTED", "params.url: разрешён только стандартный HTTPS-порт 443.");
    const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) fail("NOTIFICATION_URL_REJECTED", "params.url: локальный hostname запрещён.");
    if (/^\[.*\]$/.test(parsed.host) || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) fail("NOTIFICATION_URL_REJECTED", "params.url: IP-адреса запрещены; нужен публичный DNS hostname.");
    if (!host.includes(".") || !/^[a-z0-9.-]+$/.test(host) || host.split(".").some((label) => !label || label.startsWith("-") || label.endsWith("-"))) {
      fail("NOTIFICATION_URL_REJECTED", "params.url: нужен публичный DNS hostname.");
    }
    out.url = parsed.toString();
    return out;
  }

  function safeResult(value) {
    const cloned = cloneJson(value);
    return cloned;
  }

  function redactUrlFields(value) {
    const root = cloneJson(value);
    if (!root || typeof root !== "object") return root;
    const stack = [root];
    const urlKeys = /^(?:url|file_url|download_url|link|href)$/i;
    while (stack.length) {
      const current = stack.pop();
      if (Array.isArray(current)) {
        for (const child of current) if (child && typeof child === "object") stack.push(child);
        continue;
      }
      for (const [key, child] of Object.entries(current)) {
        if (urlKeys.test(key) && typeof child === "string" && /^https?:\/\//i.test(child.trim())) current[key] = "[REDACTED_URL]";
        else if (child && typeof child === "object") stack.push(child);
      }
    }
    return root;
  }

  const REMOVED_ALIASES = new Set([
    "product_quant_list",
    "product_quant_info",
    "performance_expense",
    "performance_daily",
    "performance_campaign_product",
    "performance_media",
    "stock_on_warehouses_v2"
  ]);

  const SENSITIVE_GATE_ALIASES = new Set([
    "returns_utilization_history",
    "posting_marks",
    "fbs_posting_product_exemplar_status_v5",
    "fbs_product_exemplar_validate",
    "fbs_posting_product_exemplar_create_or_get_v6"
  ]);

  const PERFORMANCE_REPORT_STARTS = deepFreeze({
    performance_search_promo_orders_report_create: { method: "POST", path: "/api/client/statistic/orders/generate", request_style: "json_body", normalize: normalizeSearchPromoReport, next_operation: "performance_statistics_status" },
    performance_search_promo_products_report_create: { method: "POST", path: "/api/client/statistic/products/generate", request_style: "json_body", normalize: normalizeSearchPromoReport, next_operation: "performance_statistics_status" },
    performance_statistics_report_create: { method: "POST", path: "/api/client/statistics", request_style: "json_body", normalize: (p) => normalizePerformancePeriodBody(p, { campaignsRequired: true }), next_operation: "performance_statistics_status" },
    performance_all_sku_promo_orders_report_create: { method: "GET", path: "/api/client/statistics/all_sku_promo/orders/generate", request_style: "query", normalize: normalizeAllSkuReport, next_operation: "performance_statistics_status" },
    performance_all_sku_promo_products_report_create: { method: "GET", path: "/api/client/statistics/all_sku_promo/products/generate", request_style: "query", normalize: normalizeAllSkuReport, next_operation: "performance_statistics_status" },
    performance_attribution_report_create: { method: "POST", path: "/api/client/statistics/attribution", request_style: "json_body", normalize: (p) => normalizePerformancePeriodBody(p, { campaignsRequired: true }), next_operation: "performance_statistics_status" },
    performance_phrases_report_create: { method: "POST", path: "/api/client/statistics/phrases", request_style: "json_body", normalize: (p) => normalizePerformancePeriodBody(p, { campaignsRequired: false }), next_operation: "performance_statistics_status" },
    performance_video_report_create: { method: "POST", path: "/api/client/statistics/video", request_style: "json_body", normalize: (p) => normalizePerformancePeriodBody(p, { campaignsRequired: true, video: true }), next_operation: "performance_statistics_status" },
    performance_vendor_statistics_report_create: { method: "POST", path: "/api/client/vendors/statistics", request_style: "json_body", normalize: normalizeVendorStatistics, next_operation: "performance_vendor_statistics_status", vendor: true }
  });

  const CUSTOM_OPERATION_META = {
    analytics_decommissioned_goods: {
      provider: "seller_api", method: "POST", path: "/v1/analytics/decommissioned-goods", effect: "READ", request_style: "json_body",
      execution_enabled: true, currentness: "current", safety_class: "READ_SAFE", privacy_policy: "safe_projection",
      cluster: "returns_cancellations", section: "returns", guidance_visibility: "user", entitlement_key: "POST /v1/analytics/decommissioned-goods", workflow_role: "single_read",
      purpose: "Получить аналитику списаний и утилизации без изменения состояния Ozon.", template: null, template_runnable: false,
      required_parameters: ["filter.date_from", "filter.date_to", "filter.delivery_schema", "page", "page_size"]
    },
    description_category_dependent_attributes: {
      provider: "seller_api", method: "POST", path: "/v1/description-category/dependent-attributes", effect: "READ", request_style: "json_body",
      execution_enabled: true, currentness: "current", safety_class: "READ_SAFE", privacy_policy: "safe_projection",
      cluster: "catalog_products", section: "attributes_categories", guidance_visibility: "user", entitlement_key: "POST /v1/description-category/dependent-attributes", workflow_role: "single_read",
      purpose: "Получить связи родительских и дочерних характеристик категории.", template: { operation: "description_category_dependent_attributes", params: { description_category_id: 1 } }
    },
    description_category_dependent_attribute_values: {
      provider: "seller_api", method: "POST", path: "/v1/description-category/dependent-attributes/values", effect: "READ", request_style: "json_body",
      execution_enabled: true, currentness: "current", safety_class: "READ_SAFE", privacy_policy: "safe_projection",
      cluster: "catalog_products", section: "attributes_categories", guidance_visibility: "user", entitlement_key: "POST /v1/description-category/dependent-attributes/values", workflow_role: "single_read",
      purpose: "Получить допустимые дочерние значения зависимых характеристик.", template: { operation: "description_category_dependent_attribute_values", params: { parent_attribute_id: 1, child_attribute_id: 2, limit: 100 } }
    },
    notification_check: {
      provider: "seller_api", method: "POST", path: "/v1/notification/check", effect: "READ", request_style: "json_body",
      execution_enabled: true, currentness: "current", safety_class: "CONDITIONAL_READ", privacy_policy: "safe_projection",
      cluster: "account_access", section: "seller_settings", guidance_visibility: "conditional", entitlement_key: "POST /v1/notification/check", workflow_role: "single_read",
      purpose: "Проверить HTTPS endpoint уведомлений через фиксированный Seller API метод; локальные/IP URL запрещены.", template: null, template_runnable: false, required_parameters: ["url: public HTTPS URL on port 443"]
    }
  };

  for (const [alias, spec] of Object.entries(PERFORMANCE_REPORT_STARTS)) {
    CUSTOM_OPERATION_META[alias] = {
      provider: "performance_api", method: spec.method, path: spec.path, effect: "READ", request_style: spec.request_style,
      execution_enabled: true, currentness: "current", safety_class: "READ_SAFE_REPORT_START", privacy_policy: "safe_projection",
      cluster: "advertising_performance", section: "statistics", guidance_visibility: "user", entitlement_key: `PERFORMANCE ${spec.method} ${spec.path}`, workflow_role: "explicit_workflow_read_step",
      purpose: "Запустить формирование Performance-отчёта одним явным запросом; проверка статуса выполняется отдельной командой.",
      template: null, template_runnable: false, required_parameters: ["use exact documented parameters for the selected report"]
    };
  }

  const patchedRegistryOperations = {};
  for (const [alias, meta] of Object.entries(baseRegistry.OPERATIONS)) {
    if (REMOVED_ALIASES.has(alias)) continue;
    const next = { ...meta };
    if (SENSITIVE_GATE_ALIASES.has(alias)) {
      next.safety_class = "PERSONAL_DATA_READ_GATED";
      next.privacy_policy = "operator_personal_data_gate";
      next.policy_group = "personal_data_read";
      next.default_allowed = false;
      next.guidance_visibility = "conditional";
    }
    patchedRegistryOperations[alias] = next;
  }
  Object.assign(patchedRegistryOperations, CUSTOM_OPERATION_META);

  function canonicalClusterId(value) {
    const id = String(value || "").trim();
    return baseRegistry.CLUSTER_ALIASES?.[id] || id;
  }
  function operation(alias) { return patchedRegistryOperations[String(alias || "").trim()] || null; }
  function operationsForCluster(clusterId, section = null, { includeConditional = true, includeHidden = false } = {}) {
    const cluster = canonicalClusterId(clusterId);
    return Object.entries(patchedRegistryOperations)
      .filter(([, meta]) => meta.cluster === cluster)
      .filter(([, meta]) => section == null || meta.section === String(section))
      .filter(([, meta]) => includeHidden || meta.guidance_visibility !== "hidden")
      .filter(([, meta]) => includeConditional || meta.guidance_visibility !== "conditional")
      .map(([alias, meta]) => ({ alias, meta }));
  }
  function catalogValidation(contractOperations = globalThis.OzonContract?.OPERATIONS || null) {
    const errors = [];
    for (const [alias, meta] of Object.entries(patchedRegistryOperations)) {
      if (!baseRegistry.CLUSTERS?.[meta.cluster]) errors.push(`cluster_missing:${alias}:${meta.cluster}`);
      if (!baseRegistry.CLUSTERS?.[meta.cluster]?.sections?.[meta.section]) errors.push(`section_missing:${alias}:${meta.cluster}:${meta.section}`);
      if (String(meta.provider || "seller_api") !== "report_file" && !meta.entitlement_key) errors.push(`entitlement_missing:${alias}`);
      if (!meta.privacy_policy) errors.push(`privacy_missing:${alias}`);
      if (contractOperations) {
        const contract = contractOperations[alias];
        if (!contract) errors.push(`contract_missing:${alias}`);
        else if (contract.method !== meta.method || contract.path !== meta.path || String(contract.provider || "seller_api") !== String(meta.provider || "seller_api")) errors.push(`contract_transport_mismatch:${alias}`);
      }
    }
    if (contractOperations) {
      for (const [alias, meta] of Object.entries(contractOperations)) if (meta?.execution_enabled === true && !patchedRegistryOperations[alias]) errors.push(`registry_missing_enabled:${alias}`);
    }
    return deepFreeze({ ok: errors.length === 0, errors });
  }

  const patchedRegistry = deepFreeze({
    CLUSTERS: baseRegistry.CLUSTERS,
    CLUSTER_ALIASES: baseRegistry.CLUSTER_ALIASES,
    OPERATIONS: patchedRegistryOperations,
    canonicalClusterId,
    operation,
    operationsForCluster,
    catalogValidation
  });
  globalThis.OzonOperationRegistry = patchedRegistry;

  const baseFactoryOperations = {};
  for (const [alias, meta] of Object.entries(baseContract.OPERATIONS)) {
    if (REMOVED_ALIASES.has(alias)) continue;
    const registryMeta = patchedRegistryOperations[alias] || {};
    const next = { ...meta, ...registryMeta };
    if (alias === "posting_global_etgb" || alias === "invoice_get") {
      const originalSanitize = meta.sanitizeResult;
      next.sanitizeResult = (raw, context) => redactUrlFields(originalSanitize(raw, context));
      next.contract_state = `${String(meta.contract_state || "existing")}_url_redaction_2026_09_13`;
    }
    baseFactoryOperations[alias] = next;
  }
  baseFactoryOperations.analytics_decommissioned_goods = {
    ...CUSTOM_OPERATION_META.analytics_decommissioned_goods,
    normalizeParams: normalizeDecommissionedGoods,
    sanitizeResult: safeResult,
    contract_state: "canonical_swagger_2026_09_13"
  };
  baseFactoryOperations.description_category_dependent_attributes = {
    ...CUSTOM_OPERATION_META.description_category_dependent_attributes,
    normalizeParams: normalizeDependentAttributes,
    sanitizeResult: safeResult,
    contract_state: "canonical_swagger_2026_09_13"
  };
  baseFactoryOperations.description_category_dependent_attribute_values = {
    ...CUSTOM_OPERATION_META.description_category_dependent_attribute_values,
    normalizeParams: normalizeDependentAttributeValues,
    sanitizeResult: safeResult,
    contract_state: "canonical_swagger_2026_09_13"
  };

  const patchedBaseContract = contractFactory.createOzonContract({
    operations: baseFactoryOperations,
    prefix: baseContract.PREFIX,
    resultPrefix: baseContract.RESULT_PREFIX,
    version: baseContract.VERSION,
    sellerApiBase: baseContract.SELLER_API_BASE,
    performanceApiBase: baseContract.PERFORMANCE_API_BASE
  });

  const customAliases = new Set(["notification_check", ...Object.keys(PERFORMANCE_REPORT_STARTS)]);
  const contractOperations = { ...patchedBaseContract.OPERATIONS };
  contractOperations.notification_check = {
    ...CUSTOM_OPERATION_META.notification_check,
    normalizeParams: normalizeNotificationCheck,
    sanitizeResult: safeResult,
    contract_state: "canonical_swagger_2026_09_13_conditional_url_guard"
  };
  for (const [alias, spec] of Object.entries(PERFORMANCE_REPORT_STARTS)) {
    contractOperations[alias] = {
      ...CUSTOM_OPERATION_META[alias],
      normalizeParams: spec.normalize,
      sanitizeResult: safeResult,
      contract_state: "canonical_performance_swagger_2026_09_13_report_start"
    };
  }

  function resolveCustom(alias) {
    const name = String(alias || "").trim();
    const meta = contractOperations[name];
    if (!meta) fail("UNSUPPORTED_OPERATION", `Операция ${name} не разрешена.`);
    if (meta.effect !== "READ") fail("NON_READ_OPERATION_REJECTED", `Операция ${name} не является READ.`);
    return { operation: name, meta };
  }

  function normalizeCustom(raw) {
    if (!plain(raw)) fail("INVALID_JSON_ROOT", "Команда должна быть JSON-объектом.");
    const extra = Object.keys(raw).filter((key) => !["operation", "params"].includes(key));
    if (extra.length) fail("UNKNOWN_TOP_LEVEL_FIELD", `Неизвестные поля команды: ${extra.join(", ")}`);
    const { operation: alias, meta } = resolveCustom(raw.operation);
    const params = raw.params === undefined ? {} : raw.params;
    const normalized = meta.normalizeParams(params);
    return deepFreeze({ operation: alias, params: cloneJson(normalized) });
  }

  function normalizeCommand(raw) {
    const alias = plain(raw) ? String(raw.operation || "").trim() : "";
    return customAliases.has(alias) ? normalizeCustom(raw) : patchedBaseContract.normalizeCommand(raw);
  }

  function resolveOperation(alias) {
    const name = String(alias || "").trim();
    return customAliases.has(name) ? resolveCustom(name) : patchedBaseContract.resolveOperation(name);
  }

  function preflightExecution(command) {
    const normalized = normalizeCommand(command);
    if (!customAliases.has(normalized.operation)) return patchedBaseContract.preflightExecution(normalized);
    const { meta } = resolveCustom(normalized.operation);
    if (meta.execution_enabled !== true) fail("OPERATION_BLOCKED", `Операция ${normalized.operation} отключена политикой bridge.`);
    return { command: normalized, meta };
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
    let depth = 0, inString = false, escaped = false;
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
    return { ok: false, code: "INVALID_JSON", message: "JSON-объект после OZON_API_V1 не завершён." };
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
          ok: false, marker_index: markerIndex, code: String(error?.code || "INVALID_COMMAND"), message: String(error?.message || error || "Некорректная команда."),
          attempt_descriptor: baseContract.sanitizedAttemptDescriptor(rawAttempt, String(error?.code || "INVALID_COMMAND"))
        }));
      }
      cursor = extracted.end_index;
    }
    return Object.freeze(discovered);
  }

  function encodeQuery(params) {
    const pairs = [];
    for (const [key, value] of Object.entries(params || {})) {
      if (value === undefined || value === null) continue;
      const values = Array.isArray(value) ? value : [value];
      for (const item of values) pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
    }
    return pairs.join("&");
  }

  function buildPerformanceRequest(command, headers) {
    const normalized = normalizeCommand(command);
    if (!Object.prototype.hasOwnProperty.call(PERFORMANCE_REPORT_STARTS, normalized.operation)) return patchedBaseContract.buildPerformanceRequest(normalized, headers);
    const meta = contractOperations[normalized.operation];
    if (!/^https:\/\/api-performance\.ozon\.ru$/.test(baseContract.PERFORMANCE_API_BASE)) fail("INVALID_FIXED_HOST", "Performance API host не прошёл fixed-host guard.");
    const params = cloneJson(normalized.params);
    const query = meta.request_style === "query" ? encodeQuery(params) : "";
    const url = `${baseContract.PERFORMANCE_API_BASE}${meta.path}${query ? `?${query}` : ""}`;
    return deepFreeze({
      url, method: meta.method, headers: { ...headers }, body: meta.method === "POST" ? JSON.stringify(params) : undefined,
      operation: normalized.operation, path: meta.path, host_alias: "performance_api", response_style: "json", response_content_types: ["application/json"]
    });
  }

  function buildRequest(command, headers) {
    const normalized = normalizeCommand(command);
    if (normalized.operation !== "notification_check") return patchedBaseContract.buildRequest(normalized, headers);
    const meta = contractOperations.notification_check;
    if (!/^https:\/\/api-seller\.ozon\.ru$/.test(baseContract.SELLER_API_BASE)) fail("INVALID_FIXED_HOST", "Seller API host не прошёл fixed-host guard.");
    return deepFreeze({
      url: `${baseContract.SELLER_API_BASE}${meta.path}`, method: "POST", headers: { ...headers }, body: JSON.stringify(normalized.params),
      operation: normalized.operation, path: meta.path, host_alias: "seller_api", response_style: "json", response_content_types: ["application/json"]
    });
  }

  function sanitizeResult(command, rawResult) {
    const normalized = normalizeCommand(command);
    if (customAliases.has(normalized.operation)) return deepFreeze(safeResult(rawResult));
    return patchedBaseContract.sanitizeResult(normalized, rawResult);
  }

  function verifyProviderResponse(command, rawResult) {
    const normalized = normalizeCommand(command);
    if (rawResult === null || rawResult === undefined) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", `${normalized.operation}: provider response body отсутствует.`);
    if (Object.prototype.hasOwnProperty.call(PERFORMANCE_REPORT_STARTS, normalized.operation)) {
      if (!plain(rawResult) || typeof rawResult.UUID !== "string" || !rawResult.UUID.trim()) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", `${normalized.operation}: ответ должен содержать UUID отчёта.`);
      if (Object.prototype.hasOwnProperty.call(rawResult, "vendor") && typeof rawResult.vendor !== "boolean") fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", `${normalized.operation}: vendor должен быть boolean.`);
      return deepFreeze({ verified: true, operation: normalized.operation, rule: "performance_report_uuid" });
    }
    if (normalized.operation === "notification_check") {
      if (!plain(rawResult) || typeof rawResult.is_active !== "boolean") fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "notification_check response.is_active должен быть boolean.");
      if (Object.prototype.hasOwnProperty.call(rawResult, "errors") && !Array.isArray(rawResult.errors)) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "notification_check response.errors должен быть массивом.");
      return deepFreeze({ verified: true, operation: normalized.operation, rule: "notification_check_is_active" });
    }
    if (normalized.operation === "analytics_decommissioned_goods") {
      if (!plain(rawResult)) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "analytics_decommissioned_goods response должен быть объектом.");
      if (Object.prototype.hasOwnProperty.call(rawResult, "items") && !Array.isArray(rawResult.items)) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "analytics_decommissioned_goods response.items должен быть массивом.");
      if (Object.prototype.hasOwnProperty.call(rawResult, "total_count") && !Number.isInteger(rawResult.total_count)) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "analytics_decommissioned_goods response.total_count должен быть integer.");
      return deepFreeze({ verified: true, operation: normalized.operation, rule: "decommissioned_goods_shape" });
    }
    if (normalized.operation === "description_category_dependent_attributes") {
      if (!plain(rawResult) || (Object.prototype.hasOwnProperty.call(rawResult, "result") && !Array.isArray(rawResult.result))) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "dependent_attributes response.result должен быть массивом.");
      return deepFreeze({ verified: true, operation: normalized.operation, rule: "dependent_attributes_shape" });
    }
    if (normalized.operation === "description_category_dependent_attribute_values") {
      if (!plain(rawResult) || (Object.prototype.hasOwnProperty.call(rawResult, "result") && !Array.isArray(rawResult.result))) fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "dependent_attribute_values response.result должен быть массивом.");
      if (Object.prototype.hasOwnProperty.call(rawResult, "cursor") && typeof rawResult.cursor !== "string") fail("PROVIDER_RESPONSE_CONTRACT_MISMATCH", "dependent_attribute_values response.cursor должен быть string.");
      return deepFreeze({ verified: true, operation: normalized.operation, rule: "dependent_attribute_values_shape" });
    }
    return patchedBaseContract.verifyProviderResponse(normalized, rawResult);
  }

  function fnv1a(value) {
    const text = String(value || "");
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
  function commandFingerprint(command) {
    const normalized = normalizeCommand(command);
    return customAliases.has(normalized.operation) ? fnv1a(JSON.stringify(normalized)) : patchedBaseContract.commandFingerprint(normalized);
  }

  function sellerCapabilityRequirement(command, atMs = Date.now(), entitlementSnapshot = null) {
    const normalized = normalizeCommand(command);
    if (normalized.operation !== "notification_check") return patchedBaseContract.sellerCapabilityRequirement(normalized, atMs, entitlementSnapshot);
    const requirement = globalThis.OzonEntitlements?.requirementFor
      ? globalThis.OzonEntitlements.requirementFor(normalized, entitlementSnapshot, atMs)
      : { required: false, known: false, allowed_subscription_types: [], reasons: ["entitlement_module_missing"] };
    return deepFreeze({
      required: requirement.required === true,
      known: requirement.known !== false,
      reasons: [...(requirement.reasons || [])],
      allowed_subscription_types: [...(requirement.allowed_subscription_types || [])],
      entitlement_key: requirement.entitlement_key || contractOperations.notification_check.entitlement_key,
      rule_source: requirement.rule_source || null,
      default_access: requirement.default_access || null
    });
  }

  function planningEnvelope(profile, entitlement) {
    const capability = patchedBaseContract.normalizeCapabilityProfile(profile);
    return deepFreeze({
      capability: {
        status: capability.status, subscription_type: capability.subscription_type, is_premium: capability.is_premium,
        probe_performed: capability.probe_performed, probe_http_status: capability.probe_http_status, probe_error_code: capability.probe_error_code
      },
      entitlement: { ...entitlement }
    });
  }

  function planCommandForSellerCapability(command, profile, atMs = Date.now(), entitlementSnapshot = null) {
    const normalized = normalizeCommand(command);
    if (Object.prototype.hasOwnProperty.call(PERFORMANCE_REPORT_STARTS, normalized.operation)) {
      return deepFreeze({
        action: "execute", command: normalized, logical_command: normalized,
        planning: planningEnvelope({ status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false }, {
          status: "SUPPORTED_AND_ENTITLED", partial: false, capability_required: false, reason: "performance_provider_not_seller_subscription", exact_request_preserved: true
        })
      });
    }
    if (normalized.operation !== "notification_check") return patchedBaseContract.planCommandForSellerCapability(normalized, profile, atMs, entitlementSnapshot);
    const requirement = sellerCapabilityRequirement(normalized, atMs, entitlementSnapshot);
    const capability = patchedBaseContract.normalizeCapabilityProfile(profile);
    if (requirement.known === false) {
      return deepFreeze({ action: "execute", command: normalized, logical_command: normalized, planning: planningEnvelope({ status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false }, {
        status: "ENTITLEMENT_UNKNOWN", partial: false, capability_required: false, reason: requirement.reasons[0] || "entitlement_rule_unknown",
        entitlement_key: requirement.entitlement_key, rule_source: requirement.rule_source, exact_request_preserved: true
      }) });
    }
    if (requirement.required !== true) {
      return deepFreeze({ action: "execute", command: normalized, logical_command: normalized, planning: planningEnvelope({ status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false }, {
        status: "SUPPORTED_AND_ENTITLED", partial: false, capability_required: false, reason: "all_accounts",
        entitlement_key: requirement.entitlement_key, rule_source: requirement.rule_source, exact_request_preserved: true
      }) });
    }
    const allowed = requirement.allowed_subscription_types || [];
    if (capability.status !== "known") {
      return deepFreeze({ action: "reject", command: normalized, error: { code: "ENTITLEMENT_UNKNOWN", message: "Не удалось подтвердить подписку продавца; запрос не отправлен." }, planning: planningEnvelope(capability, {
        status: "ENTITLEMENT_UNKNOWN", partial: false, reason: requirement.reasons[0] || "subscription_required", required_subscription_types: [...allowed], entitlement_key: requirement.entitlement_key, rule_source: requirement.rule_source, exact_request_preserved: true
      }) });
    }
    if (!allowed.includes(capability.subscription_type)) {
      return deepFreeze({ action: "reject", command: normalized, error: { code: "SUBSCRIPTION_REQUIRED", message: "Текущая подписка продавца не даёт доступ к этому методу." }, planning: planningEnvelope(capability, {
        status: "SUPPORTED_BUT_NOT_ENTITLED", partial: false, reason: requirement.reasons[0] || "subscription_required", required_subscription_types: [...allowed], entitlement_key: requirement.entitlement_key, rule_source: requirement.rule_source, exact_request_preserved: true
      }) });
    }
    return deepFreeze({ action: "execute", command: normalized, logical_command: normalized, planning: planningEnvelope(capability, {
      status: "SUPPORTED_AND_ENTITLED", partial: false, capability_required: true, reason: requirement.reasons[0] || "subscription_requirement_satisfied", required_subscription_types: [...allowed], entitlement_key: requirement.entitlement_key, rule_source: requirement.rule_source, exact_request_preserved: true
    }) });
  }

  function formatResultReport(args) {
    const normalized = normalizeCommand(args.command);
    if (!customAliases.has(normalized.operation)) return patchedBaseContract.formatResultReport(args);
    const requestMeta = args.requestMeta || {};
    const requestMetaOut = {
      provider: "ozon",
      host_alias: String(requestMeta.host_alias || contractOperations[normalized.operation].provider || "seller_api"),
      http_method: String(requestMeta.http_method || contractOperations[normalized.operation].method || ""),
      path_alias: String(requestMeta.path_alias || normalized.operation)
    };
    if (typeof requestMeta.external_request_executed === "boolean") requestMetaOut.external_request_executed = requestMeta.external_request_executed;
    if (typeof requestMeta.capability_probe_executed === "boolean") requestMetaOut.capability_probe_executed = requestMeta.capability_probe_executed;
    if (Number.isFinite(Number(requestMeta.capability_probe_http_status))) requestMetaOut.capability_probe_http_status = Number(requestMeta.capability_probe_http_status || 0);
    const envelope = {
      bridge: "ozon-llm-api-bridge", version: baseContract.VERSION, request_id: String(args.requestId || ""), operation: normalized.operation,
      command: { operation: normalized.operation, fingerprint: commandFingerprint(normalized) }, request_meta: requestMetaOut,
      http_status: Number(args.httpStatus || 0), elapsed_ms: Number(args.elapsedMs || 0), pagination: args.pagination ?? null, rate_limit: args.rateLimit ?? null,
      planning: args.planning ? cloneJson(args.planning) : null, result: args.result
    };
    return `${baseContract.RESULT_PREFIX}\n${JSON.stringify(envelope, null, 2)}`;
  }

  const filteredAsyncFalseBlocklist = deepFreeze((baseContract.PERFORMANCE_ASYNC_REPORT_SIDE_EFFECT_BLOCKLIST || [])
    .filter((item) => !Object.values(PERFORMANCE_REPORT_STARTS).some((spec) => spec.method === item.method && spec.path === item.path))
    .map((item) => ({ ...item })));

  const patchedContract = Object.freeze({
    ...patchedBaseContract,
    PERFORMANCE_ASYNC_REPORT_SIDE_EFFECT_BLOCKLIST: filteredAsyncFalseBlocklist,
    OPERATIONS: deepFreeze(contractOperations),
    operationRegistry: patchedRegistry,
    parseCommand,
    discoverCommands,
    normalizeCommand,
    resolveOperation,
    preflightExecution,
    buildRequest,
    buildPerformanceRequest,
    sanitizeResult,
    verifyProviderResponse,
    commandFingerprint,
    sellerCapabilityRequirement,
    planCommandForSellerCapability,
    formatResultReport,
    isCommandText: (text) => String(text || "").replace(/\u00a0/g, " ").trim().startsWith(baseContract.PREFIX)
  });
  globalThis.OzonContract = patchedContract;

  function operationCard(alias, meta) {
    return Object.freeze({
      operation: alias,
      purpose: meta.purpose || "Read-only Ozon operation.",
      template: meta.template_runnable === false ? null : (meta.template || { operation: alias, params: {} }),
      template_runnable: meta.template_runnable !== false,
      required_parameters: Array.isArray(meta.required_parameters) ? Object.freeze([...meta.required_parameters]) : Object.freeze([]),
      section: meta.section || null,
      safety_class: meta.safety_class || "READ_SAFE",
      privacy_policy: meta.privacy_policy || "safe_projection",
      personal_data_setting_required_when_off: meta.policy_group === "personal_data_read",
      entitlement_key: meta.entitlement_key || null,
      workflow_role: meta.workflow_role || "single_read"
    });
  }

  function guidanceChoices(cluster = null, section = null, version = 1) {
    if (!cluster) return Object.entries(patchedRegistry.CLUSTERS).map(([id, meta]) => Object.freeze({ cluster: id, description: meta.description || "" }));
    const entries = patchedRegistry.operationsForCluster(cluster, section, { includeConditional: true, includeHidden: false });
    if (version >= 2 && !section) {
      const sections = [...new Set(entries.map(({ meta }) => meta.section).filter(Boolean))];
      if (sections.length > 1) return sections.map((id) => Object.freeze({ section: id, description: patchedRegistry.CLUSTERS[cluster]?.sections?.[id] || "", operation_count: entries.filter(({ meta }) => meta.section === id).length }));
    }
    return entries.map(({ alias, meta }) => operationCard(alias, meta));
  }

  const baseGuidance = globalThis.OzonGuidance;
  if (baseGuidance) {
    function scoreDescriptor(descriptor) {
      const scores = Object.fromEntries(Object.keys(patchedRegistry.CLUSTERS).map((id) => [id, 0]));
      const rules = [];
      const intents = Object.values(descriptor?.intent || {});
      const tokens = [...intents, ...(descriptor?.top_level_keys || []), ...(descriptor?.parameter_keys || [])].join(" ");
      for (const [alias, meta] of Object.entries(patchedRegistry.OPERATIONS)) {
        if (intents.includes(alias.toLowerCase())) { scores[meta.cluster] = (scores[meta.cluster] || 0) + 120; rules.push(`${meta.cluster}:exact_alias:${alias}`); }
        const fixedPath = String(meta.path || "").toLowerCase();
        if (fixedPath && intents.some((value) => value.includes(fixedPath))) { scores[meta.cluster] = (scores[meta.cluster] || 0) + 100; rules.push(`${meta.cluster}:exact_path:${alias}`); }
      }
      for (const [id, cluster] of Object.entries(patchedRegistry.CLUSTERS)) {
        for (const clue of cluster.clues || []) if (tokens.includes(String(clue).toLowerCase())) { scores[id] += String(clue).includes("/") ? 60 : 18; rules.push(`${id}:clue`); }
      }
      return Object.freeze({ scores: Object.freeze(scores), rules: Object.freeze(rules) });
    }
    function classify(descriptor) {
      if (descriptor?.sensitive) return Object.freeze({ status: "guidance_error", cluster: null, section: null, version: 2, error: "SENSITIVE_ATTEMPT_REDACTED" });
      const scored = scoreDescriptor(descriptor);
      const ranked = Object.entries(scored.scores).sort((a, b) => b[1] - a[1]);
      if (!ranked.length || ranked[0][1] <= 0 || (ranked[1] && ranked[1][1] === ranked[0][1])) return Object.freeze({ status: "cluster_required", cluster: null, section: null, version: 2, error: ranked[1] && ranked[1][1] === ranked[0][1] ? "AMBIGUOUS_CLUSTER" : (descriptor?.error_code || null), scores: scored.scores });
      return Object.freeze({ status: "cluster_suggested", cluster: ranked[0][0], section: null, version: 2, error: descriptor?.error_code || null, scores: scored.scores });
    }
    function result({ status = "cluster_required", cluster = null, section = null, error = null, descriptor = null, version = 1 } = {}) {
      const normalizedCluster = cluster ? patchedRegistry.canonicalClusterId(cluster) : null;
      return Object.freeze({
        bridge: "ozon-llm-api-bridge", version: globalThis.OzonRuntime?.RUNTIME?.version || "0.1.20", guidance_version: String(version >= 2 ? 2 : 1), status,
        cluster: normalizedCluster, section: section || null, external_request_executed: false, physical_business_request_count: 0, error: error || null,
        descriptor: descriptor ? { error_code: descriptor.error_code || null, intent: descriptor.intent || {}, parameter_keys: descriptor.parameter_keys || [] } : null,
        choices: guidanceChoices(normalizedCluster, section, version)
      });
    }
    globalThis.OzonGuidance = Object.freeze({ ...baseGuidance, CLUSTERS: patchedRegistry.CLUSTERS, scoreDescriptor, classify, catalogValidation: (ops = globalThis.OzonContract?.OPERATIONS || null) => patchedRegistry.catalogValidation(ops), result });
  }

  if (globalThis.OzonProviderFactory?.createOzonProvider) {
    globalThis.OzonProvider = globalThis.OzonProviderFactory.createOzonProvider({ contract: patchedContract });
  }

  const expectedAdded = Object.keys(CUSTOM_OPERATION_META);
  for (const alias of expectedAdded) {
    if (!patchedRegistry.OPERATIONS[alias] || !patchedContract.OPERATIONS[alias]) throw new Error(`Ozon read-surface patch invariant failed: missing ${alias}`);
  }
  for (const alias of REMOVED_ALIASES) {
    if (patchedRegistry.OPERATIONS[alias] || patchedContract.OPERATIONS[alias]) throw new Error(`Ozon read-surface patch invariant failed: stale alias ${alias}`);
  }
  const catalog = patchedRegistry.catalogValidation(patchedContract.OPERATIONS);
  if (!catalog.ok) throw new Error(`Ozon read-surface patch catalog mismatch: ${catalog.errors.join(", ")}`);

  const api = Object.freeze({
    REMOVED_ALIASES: Object.freeze([...REMOVED_ALIASES]),
    SENSITIVE_GATE_ALIASES: Object.freeze([...SENSITIVE_GATE_ALIASES]),
    ADDED_ALIASES: Object.freeze(expectedAdded),
    PERFORMANCE_REPORT_STARTS,
    registry: patchedRegistry,
    contract: patchedContract
  });
  globalThis.OzonSwaggerReadSurfacePatch = api;
  globalThis[PATCH_KEY] = api;
})();
