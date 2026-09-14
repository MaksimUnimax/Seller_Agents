(() => {
  "use strict";

  const HELP_PREFIX = globalThis.WBRuntime?.RUNTIME?.helpPrefix || "WB_HELP_V1";
  const HELP_PREFIX_V2 = globalThis.WBRuntime?.RUNTIME?.helpPrefixV2 || "WB_HELP_V2";
  const GUIDANCE_PREFIX = globalThis.WBRuntime?.RUNTIME?.guidanceResultPrefix || "WB_GUIDANCE_RESULT_V1";
  const GUIDANCE_PREFIX_V2 = globalThis.WBRuntime?.RUNTIME?.guidanceResultPrefixV2 || "WB_GUIDANCE_RESULT_V2";
  const Registry = globalThis.WBGuidanceRegistry;
  const CLUSTERS = Registry?.CLUSTERS || Object.freeze({});
  const INTENT_FIELDS = new Set(["operation", "method", "path", "endpoint", "action"]);
  const SENSITIVE = new Set(["authorization", "api_key", "apikey", "client_id", "clientid", "client_secret", "clientsecret", "token", "access_token", "access-token"]);

  const norm = (value) => String(value || "").toLowerCase().slice(0, 240);
  const plain = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]");

  function descriptorFromObject(value, errorCode = "INVALID_COMMAND") {
    if (!plain(value)) return Object.freeze({ error_code: String(errorCode), top_level_keys: Object.freeze([]), intent: Object.freeze({}), parameter_keys: Object.freeze([]), sensitive: false });
    const top = Object.keys(value).slice(0, 24).map(norm);
    const intent = {};
    let sensitive = false;
    for (const rawKey of Object.keys(value).slice(0, 24)) {
      const key = norm(rawKey);
      if (SENSITIVE.has(key)) sensitive = true;
      if (INTENT_FIELDS.has(key) && typeof value[rawKey] === "string") intent[key] = Object.hasOwn(Registry?.OPERATIONS || {}, value[rawKey]) ? norm(value[rawKey]) : "[UNRECOGNIZED_INTENT]";
    }
    const params = plain(value.params) ? value.params : plain(value.args) ? value.args : {};
    const parameterKeys = Object.keys(params).slice(0, 32).map(norm);
    for (const key of parameterKeys) if (SENSITIVE.has(key)) sensitive = true;
    return Object.freeze({ error_code: String(errorCode || "INVALID_COMMAND").slice(0, 80), top_level_keys: Object.freeze(top), intent: Object.freeze(intent), parameter_keys: Object.freeze(parameterKeys), sensitive });
  }

  function descriptorFromJson(jsonText, errorCode) {
    try { return descriptorFromObject(JSON.parse(String(jsonText || "")), errorCode); }
    catch (_) { return descriptorFromObject(null, errorCode || "INVALID_JSON"); }
  }

  function clusterEntries(clusterId, section = null) {
    if (!Registry) return [];
    return Registry.operationsForCluster(clusterId, section, { includeConditional: true, includeHidden: false });
  }

  function scoreDescriptor(descriptor) {
    const scores = Object.fromEntries(Object.keys(CLUSTERS).map((id) => [id, 0]));
    const rules = [];
    const intents = Object.values(descriptor?.intent || {});
    const tokens = [...intents, ...(descriptor?.top_level_keys || []), ...(descriptor?.parameter_keys || [])].join(" ");

    for (const [alias, meta] of Object.entries(Registry?.OPERATIONS || {})) {
      if (intents.includes(alias.toLowerCase())) {
        scores[meta.cluster] = (scores[meta.cluster] || 0) + 120;
        rules.push(`${meta.cluster}:exact_alias:${alias}`);
      }
      const fixedPath = String(meta.path || "").toLowerCase();
      if (fixedPath && intents.some((value) => value.includes(fixedPath))) {
        scores[meta.cluster] = (scores[meta.cluster] || 0) + 100;
        rules.push(`${meta.cluster}:exact_path:${alias}`);
      }
    }

    for (const [id, cluster] of Object.entries(CLUSTERS)) {
      for (const clue of cluster.clues || []) {
        if (tokens.includes(String(clue).toLowerCase())) {
          scores[id] += String(clue).includes("/") ? 60 : 18;
          rules.push(`${id}:clue`);
        }
      }
    }

    return Object.freeze({ scores: Object.freeze(scores), rules: Object.freeze(rules) });
  }

  function classify(descriptor) {
    if (descriptor?.sensitive) return Object.freeze({ status: "guidance_error", cluster: null, section: null, version: 2, error: "SENSITIVE_ATTEMPT_REDACTED" });
    const scored = scoreDescriptor(descriptor);
    const ranked = Object.entries(scored.scores).sort((a, b) => b[1] - a[1]);
    if (!ranked.length || ranked[0][1] <= 0) return Object.freeze({ status: "cluster_required", cluster: null, section: null, version: 2, error: descriptor?.error_code || null, scores: scored.scores });
    if (ranked[1] && ranked[1][1] === ranked[0][1]) return Object.freeze({ status: "cluster_required", cluster: null, section: null, version: 2, error: "AMBIGUOUS_CLUSTER", scores: scored.scores });
    return Object.freeze({ status: "cluster_suggested", cluster: ranked[0][0], section: null, version: 2, error: descriptor?.error_code || null, scores: scored.scores });
  }

  function extractBalancedObject(source, start) {
    let depth = 0, string = false, escaped = false;
    for (let index = start; index < source.length; index += 1) {
      const char = source[index];
      if (string) {
        if (escaped) { escaped = false; continue; }
        if (char === "\\") { escaped = true; continue; }
        if (char === '"') string = false;
        continue;
      }
      if (char === '"') { string = true; continue; }
      if (char === "{") depth += 1;
      else if (char === "}") {
        depth -= 1;
        if (depth === 0) return source.slice(start, index + 1);
      }
    }
    return null;
  }

  function parseHelp(text) {
    const source = String(text || "").replace(/\u00a0/g, " ").trim();
    const v2 = source.startsWith(HELP_PREFIX_V2);
    const prefix = v2 ? HELP_PREFIX_V2 : HELP_PREFIX;
    if (!source.startsWith(prefix)) return Object.freeze({ ok: false, code: "NOT_HELP_COMMAND" });
    let cursor = prefix.length;
    while (/\s/.test(source[cursor] || "")) cursor += 1;
    if (source[cursor] !== "{") return Object.freeze({ ok: false, code: "HELP_JSON_REQUIRED" });
    const json = extractBalancedObject(source, cursor);
    if (!json || source.slice(cursor + json.length).trim()) return Object.freeze({ ok: false, code: "HELP_EXACT_OBJECT_REQUIRED" });
    let raw;
    try { raw = JSON.parse(json); } catch (_) { return Object.freeze({ ok: false, code: "HELP_INVALID_JSON" }); }
    if (!plain(raw)) return Object.freeze({ ok: false, code: "HELP_INVALID_OBJECT" });
    const allowedFields = v2 ? ["cluster", "section"] : ["cluster"];
    const extra = Object.keys(raw).filter((key) => !allowedFields.includes(key));
    if (extra.length) return Object.freeze({ ok: false, code: "HELP_UNKNOWN_FIELD" });
    const cluster = Registry?.canonicalClusterId(raw.cluster);
    if (!cluster || !CLUSTERS[cluster]) return Object.freeze({ ok: false, code: "HELP_UNKNOWN_CLUSTER" });
    let section = null;
    if (v2 && raw.section != null) {
      section = String(raw.section || "").trim();
      if (!section || !CLUSTERS[cluster]?.sections?.[section]) return Object.freeze({ ok: false, code: "HELP_UNKNOWN_SECTION" });
    }
    return Object.freeze({ ok: true, version: v2 ? 2 : 1, cluster, section });
  }

  function operationCard(alias, meta) {
    return Object.freeze({
      ...globalThis.WBParameterGuidance?.describe(alias),
      operation: alias,
      purpose: meta.purpose || "Read-only WB operation.",
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

  function choicesFor(cluster = null, section = null, version = 1) {
    if (!cluster) {
      return Object.entries(CLUSTERS).map(([id, meta]) => Object.freeze({ cluster: id, description: meta.description || "" }));
    }
    const entries = clusterEntries(cluster, section);
    if (version >= 2 && !section) {
      const sections = [...new Set(entries.map(({ meta }) => meta.section).filter(Boolean))];
      if (sections.length > 1) {
        return sections.map((id) => Object.freeze({ section: id, description: CLUSTERS[cluster]?.sections?.[id] || "", operation_count: entries.filter(({ meta }) => meta.section === id).length }));
      }
    }
    return entries.map(({ alias, meta }) => operationCard(alias, meta));
  }

  function catalogValidation(contract = globalThis.WBContract) {
    return Registry?.catalogValidation(contract?.OPERATIONS || null) || Object.freeze({ ok: false, errors: ["operation_registry_missing"] });
  }

  function result({ status = "cluster_required", cluster = null, section = null, error = null, descriptor = null, version = 1 } = {}) {
    const normalizedCluster = cluster ? Registry?.canonicalClusterId(cluster) : null;
    return Object.freeze({
      bridge: "wildberries-llm-api-bridge",
      version: globalThis.WBRuntime?.RUNTIME?.version || "0.3.0",
      guidance_version: String(version >= 2 ? 2 : 1),
      status,
      cluster: normalizedCluster,
      section: section || null,
      external_request_executed: false,
      physical_business_request_count: 0,
      error: error || null,
      descriptor: descriptor ? { error_code: descriptor.error_code || null, intent: descriptor.intent || {}, parameter_keys: descriptor.parameter_keys || [] } : null,
      choices: choicesFor(normalizedCluster, section, version)
    });
  }

  function format(payload) {
    const prefix = String(payload?.guidance_version || "1") === "2" ? GUIDANCE_PREFIX_V2 : GUIDANCE_PREFIX;
    return `${prefix}\n${JSON.stringify(payload, null, 2)}`;
  }

  globalThis.WBGuidance = Object.freeze({
    HELP_PREFIX,
    HELP_PREFIX_V2,
    GUIDANCE_PREFIX,
    GUIDANCE_PREFIX_V2,
    CLUSTERS,
    descriptorFromObject,
    descriptorFromJson,
    scoreDescriptor,
    classify,
    parseHelp,
    catalogValidation,
    result,
    format
  });
})();
