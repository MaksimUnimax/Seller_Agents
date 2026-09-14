/* global BridgeAutorunModel, OzonLlmOutputReportWorkflowPatch, OzonSwaggerReadSurfacePatch */
(() => {
  "use strict";
  const PATCH_KEY = "__OZON_PERFORMANCE_REPORT_CONTINUATION_PATCH_20260913__";
  if (globalThis[PATCH_KEY]) return;

  const bridge = globalThis.BridgeAutorunModel;
  const workflow = globalThis.OzonLlmOutputReportWorkflowPatch;
  const surface = globalThis.OzonSwaggerReadSurfacePatch;
  if (!bridge?.applyReportPrefix || !workflow?.resultEnvelopesFromDelivery || !surface?.PERFORMANCE_REPORT_STARTS) {
    throw new Error("Performance report continuation patch prerequisites missing.");
  }

  const INSTRUCTION_PREFIX = workflow.INSTRUCTION_PREFIX || "OZON_LLM_INSTRUCTIONS_V1";
  const starts = surface.PERFORMANCE_REPORT_STARTS;

  function plain(value) { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
  function findFirstField(value, fieldName, depth = 0) {
    if (depth > 10 || value === null || value === undefined) return null;
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findFirstField(item, fieldName, depth + 1);
        if (found !== null && found !== undefined) return found;
      }
      return null;
    }
    if (!plain(value)) return null;
    for (const [key, child] of Object.entries(value)) {
      if (String(key).toLowerCase() === String(fieldName).toLowerCase()) return child;
      const found = findFirstField(child, fieldName, depth + 1);
      if (found !== null && found !== undefined) return found;
    }
    return null;
  }
  function successfulEnvelope(envelope) {
    const status = Number(envelope?.http_status || 0);
    return status >= 200 && status < 300 && !findFirstField(envelope?.result, "error");
  }
  function validUuid(value) {
    const text = String(value || "").trim();
    return /^[A-Za-z0-9_.:-]{6,200}$/.test(text) ? text : null;
  }
  function extractBalancedObject(source, start) {
    let depth = 0, inString = false, escaped = false;
    for (let index = start; index < source.length; index += 1) {
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
        if (depth === 0) return source.slice(start, index + 1);
      }
    }
    return null;
  }
  function splitInstructionTail(text) {
    const source = String(text || "");
    const marker = `\n\n${INSTRUCTION_PREFIX}\n`;
    const at = source.lastIndexOf(marker);
    if (at < 0) return { base: source, payload: null };
    const jsonAt = at + marker.length;
    if (source[jsonAt] !== "{") return { base: source, payload: null };
    const json = extractBalancedObject(source, jsonAt);
    if (!json || source.slice(jsonAt + json.length).trim()) return { base: source, payload: null };
    try { return { base: source.slice(0, at), payload: JSON.parse(json) }; }
    catch (_) { return { base: source, payload: null }; }
  }
  function performanceContinuation(envelope, index) {
    const operation = String(envelope?.operation || "");
    const spec = starts[operation];
    if (!spec || !successfulEnvelope(envelope)) return null;
    const uuid = validUuid(findFirstField(envelope?.result, "UUID"));
    if (!uuid) return Object.freeze({ source_result_index: index, source_operation: operation, kind: "performance_report", state: "blocked_missing_fresh_uuid", next_command: null, automatic_continuation: false });
    const params = spec.vendor === true ? { UUID: uuid, vendor: true } : { UUID: uuid };
    return Object.freeze({
      source_result_index: index,
      source_operation: operation,
      kind: "performance_report",
      state: "created",
      next_command: Object.freeze({ operation: spec.next_operation, params: Object.freeze(params) }),
      automatic_continuation: false
    });
  }
  function extendText(text) {
    const split = splitInstructionTail(text);
    if (!split.payload) return text;
    const additions = workflow.resultEnvelopesFromDelivery(split.base)
      .map((envelope, index) => performanceContinuation(envelope, index + 1))
      .filter(Boolean);
    if (!additions.length) return text;
    const existing = Array.isArray(split.payload.workflow_continuations) ? split.payload.workflow_continuations : [];
    const payload = { ...split.payload, workflow_continuations: [...existing, ...additions] };
    return `${split.base}\n\n${INSTRUCTION_PREFIX}\n${JSON.stringify(payload, null, 2)}`;
  }

  const originalApply = bridge.applyReportPrefix.bind(bridge);
  function applyReportPrefix(outgoingText, record) {
    const original = originalApply(outgoingText, record);
    return { ...original, text: extendText(original?.text || "") };
  }
  globalThis.BridgeAutorunModel = Object.freeze({ ...bridge, applyReportPrefix });

  const api = Object.freeze({ performanceContinuation, extendText });
  globalThis.OzonPerformanceReportContinuationPatch = api;
  globalThis[PATCH_KEY] = api;
})();
