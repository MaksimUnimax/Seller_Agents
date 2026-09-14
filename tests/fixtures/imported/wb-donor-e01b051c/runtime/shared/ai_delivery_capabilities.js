(() => {
  "use strict";

  const TARGET_AI_IDS = Object.freeze([
    "chatgpt",
    "alice",
    "deepseek",
    "grok",
    "claude",
    "gemini",
    "qwen",
    "kimi"
  ]);

  const CHATGPT_MAX_SAFE_PLAIN_TEXT_UNICODE_CHARACTERS = 1_048_000;
  const ALICE_MAX_SAFE_PLAIN_TEXT_UTF16_CODE_UNITS = 90_000;

  const PROFILES = Object.freeze({
    chatgpt: Object.freeze({
      id: "chatgpt",
      label: "ChatGPT",
      status: "implemented",
      origins: Object.freeze(["https://chatgpt.com", "https://chat.openai.com"]),
      conversation_path_segment: "c",
      canonical_conversation_supported: true,
      active_conversation_evidence_required: false,
      composer_control_strategy: "legacy_microphone_completion_v1",
      delivery_confirmation_basis: "microphone",
      accepted_delivery_confirmation_bases: Object.freeze(["microphone", "work_submit_disabled_after_click"]),
      inline_mixed_text_with_files: false,
      pre_attachment_failure_text_fallback: false,
      legacy_conversation_key_prefix: "chatgpt:c",
      plain_text_max_chars: CHATGPT_MAX_SAFE_PLAIN_TEXT_UNICODE_CHARACTERS,
      plain_text_length_metric: "unicode_code_points",
      attachments_supported: true,
      accepted_extensions: Object.freeze(["txt", "pdf", "png", "csv", "tsv", "zip", "xls", "xlsx", "docx", "pptx"]),
      max_file_bytes: null,
      max_files_per_turn: null,
      attachment_strategy: "file_input_v1"
    }),
    alice: Object.freeze({
      id: "alice",
      label: "Алиса",
      status: "implemented",
      origins: Object.freeze(["https://alice.yandex.ru"]),
      conversation_path_segment: "chat",
      canonical_conversation_supported: false,
      active_conversation_evidence_required: true,
      composer_control_strategy: "adapter_explicit_ready_v1",
      delivery_confirmation_basis: "target_ready",
      accepted_delivery_confirmation_bases: Object.freeze(["target_ready", "alice_ready"]),
      inline_mixed_text_with_files: true,
      pre_attachment_failure_text_fallback: true,
      legacy_conversation_key_prefix: null,
      plain_text_max_chars: ALICE_MAX_SAFE_PLAIN_TEXT_UTF16_CODE_UNITS,
      plain_text_length_metric: "utf16_code_units",
      attachments_supported: true,
      accepted_extensions: Object.freeze(["txt", "pdf", "doc", "docx", "xlsx"]),
      original_provider_file_type_policy: "runtime_target_verification",
      max_file_bytes: 100 * 1024 * 1024,
      max_files_per_turn: 1,
      attachment_strategy: "drag_drop_v1"
    }),
    deepseek: Object.freeze({ id: "deepseek", label: "DeepSeek", status: "planned", plain_text_max_chars: null, attachments_supported: null, accepted_extensions: Object.freeze([]), max_file_bytes: null, max_files_per_turn: null, attachment_strategy: "pending" }),
    grok: Object.freeze({ id: "grok", label: "Grok", status: "planned", plain_text_max_chars: null, attachments_supported: true, accepted_extensions: Object.freeze(["txt", "pdf", "csv", "xlsx", "docx", "pptx"]), max_file_bytes: null, max_files_per_turn: null, attachment_strategy: "pending" }),
    claude: Object.freeze({ id: "claude", label: "Claude", status: "planned", plain_text_max_chars: null, attachments_supported: true, accepted_extensions: Object.freeze(["txt", "pdf", "csv", "xlsx", "docx", "json", "html", "odt", "rtf", "epub"]), max_file_bytes: null, max_files_per_turn: null, attachment_strategy: "pending" }),
    gemini: Object.freeze({ id: "gemini", label: "Gemini", status: "planned", plain_text_max_chars: null, attachments_supported: true, accepted_extensions: Object.freeze([]), max_file_bytes: null, max_files_per_turn: null, attachment_strategy: "pending" }),
    qwen: Object.freeze({ id: "qwen", label: "Qwen", status: "planned", plain_text_max_chars: null, attachments_supported: true, accepted_extensions: Object.freeze(["pdf", "xlsx", "xls"]), max_file_bytes: null, max_files_per_turn: null, attachment_strategy: "pending" }),
    kimi: Object.freeze({ id: "kimi", label: "Kimi", status: "planned", plain_text_max_chars: null, attachments_supported: true, accepted_extensions: Object.freeze(["txt", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]), max_file_bytes: 100 * 1024 * 1024, max_files_per_turn: 50, attachment_strategy: "pending" })
  });

  function normalizedOrigin(value) {
    try { return new URL(String(value || "")).origin.toLowerCase(); }
    catch (_) { return String(value || "").trim().toLowerCase().replace(/\/$/, ""); }
  }

  function profile(adapterId) {
    return PROFILES[String(adapterId || "").trim().toLowerCase()] || null;
  }

  function implementedTargetIds() {
    return TARGET_AI_IDS.filter((id) => profile(id)?.status === "implemented");
  }

  function adapterIdForOrigin(origin) {
    const normalized = normalizedOrigin(origin);
    for (const id of implementedTargetIds()) {
      const origins = Array.isArray(profile(id)?.origins) ? profile(id).origins : [];
      if (origins.some((value) => normalizedOrigin(value) === normalized)) return id;
    }
    return null;
  }

  function targetLabel(adapterId) {
    const current = profile(adapterId);
    return current?.label || current?.id || "целевой AI";
  }

  function implementedContentScriptPatterns() {
    const values = [];
    for (const id of implementedTargetIds()) for (const origin of profile(id)?.origins || []) values.push(`${normalizedOrigin(origin)}/*`);
    return Object.freeze([...new Set(values)]);
  }

  function conversationPathForTarget(adapterId, conversationId) {
    const segment = String(profile(adapterId)?.conversation_path_segment || "").trim().replace(/^\/+|\/+$/g, "");
    const id = String(conversationId || "").trim().toLowerCase();
    return segment && id ? `/${segment}/${id}` : null;
  }

  function deliveryConfirmationBasis(adapterId) { return String(profile(adapterId)?.delivery_confirmation_basis || ""); }
  function acceptedDeliveryConfirmationBases(adapterId) {
    const values = profile(adapterId)?.accepted_delivery_confirmation_bases;
    return Object.freeze(Array.isArray(values) ? [...values] : []);
  }

  function unicodeLength(value) {
    let count = 0;
    for (const _character of String(value || "")) count += 1;
    return count;
  }

  function utf8ByteLength(value) {
    return new TextEncoder().encode(String(value || "")).byteLength;
  }

  function extensionFromFilename(filename) {
    const base = String(filename || "").split(/[\\/]/).pop() || "";
    const index = base.lastIndexOf(".");
    return index > 0 && index < base.length - 1 ? base.slice(index + 1).toLowerCase() : "";
  }

  function supportsFile(adapterId, descriptor = {}) {
    const current = profile(adapterId);
    if (!current) return Object.freeze({ status: "unsupported_adapter", supported: false, reason: "adapter_unknown" });
    if (current.status !== "implemented") return Object.freeze({ status: "pending", supported: false, reason: "adapter_not_implemented" });
    if (current.attachments_supported !== true) return Object.freeze({ status: "unsupported", supported: false, reason: "attachments_not_supported" });
    const extension = String(descriptor.extension || extensionFromFilename(descriptor.filename)).toLowerCase();
    if (current.accepted_extensions.length && !current.accepted_extensions.includes(extension)) {
      return Object.freeze({ status: "unsupported", supported: false, reason: "file_type_not_supported", extension });
    }
    const byteLength = Math.max(0, Number(descriptor.byte_length || descriptor.byteLength || 0));
    if (current.max_file_bytes !== null && current.max_file_bytes !== undefined && Number.isFinite(Number(current.max_file_bytes)) && byteLength > Number(current.max_file_bytes)) {
      return Object.freeze({ status: "unsupported", supported: false, reason: "file_too_large_for_adapter", extension, byte_length: byteLength });
    }
    return Object.freeze({ status: "supported", supported: true, reason: null, extension, byte_length: byteLength });
  }

  function fileDispatchDecision(adapterId, descriptor = {}) {
    const current = profile(adapterId);
    const staticSupport = supportsFile(adapterId, descriptor);
    const extension = String(descriptor.extension || extensionFromFilename(descriptor.filename)).toLowerCase();
    const byteLength = Math.max(0, Number(descriptor.byte_length || descriptor.byteLength || 0));
    const mimeType = String(descriptor.mime_type || descriptor.mimeType || "").split(";", 1)[0].trim().toLowerCase();
    const sourceKind = String(descriptor.source_kind || "").trim().toLowerCase();
    const artifactKey = String(descriptor.artifact_key || "").trim();
    const sha256 = String(descriptor.sha256 || "").trim().toLowerCase();

    if (!current) return Object.freeze({ ...staticSupport, dispatch_allowed: false, runtime_verification_required: false });
    if (current.max_file_bytes !== null && current.max_file_bytes !== undefined && Number.isFinite(Number(current.max_file_bytes)) && byteLength > Number(current.max_file_bytes)) {
      return Object.freeze({ status: "unsupported", supported: false, dispatch_allowed: false, runtime_verification_required: false, reason: "file_too_large_for_adapter", extension, byte_length: byteLength, mime_type: mimeType, source_kind: sourceKind });
    }
    if (staticSupport.supported === true) {
      return Object.freeze({ status: "verified_supported", supported: true, dispatch_allowed: true, runtime_verification_required: false, reason: null, extension, byte_length: byteLength, mime_type: mimeType, source_kind: sourceKind });
    }

    const runtimePolicy = String(current.original_provider_file_type_policy || "");
    const integrityBackedOriginalProviderFile = sourceKind === "original_provider_file"
      && artifactKey.startsWith("provider:")
      && /^[a-f0-9]{64}$/.test(sha256);
    const typeIsConcrete = Boolean(extension && extension !== "bin" && mimeType && mimeType !== "application/octet-stream");
    if (staticSupport.reason === "file_type_not_supported"
      && runtimePolicy === "runtime_target_verification"
      && integrityBackedOriginalProviderFile
      && typeIsConcrete) {
      return Object.freeze({
        status: "runtime_verification_required",
        supported: false,
        dispatch_allowed: true,
        runtime_verification_required: true,
        reason: "target_runtime_verification_required",
        extension,
        byte_length: byteLength,
        mime_type: mimeType,
        source_kind: sourceKind
      });
    }
    return Object.freeze({ ...staticSupport, dispatch_allowed: false, runtime_verification_required: false, mime_type: mimeType, source_kind: sourceKind });
  }

  function generatedTextDecision(adapterId, text) {
    const current = profile(adapterId);
    const value = String(text || "");
    const unicodeChars = unicodeLength(value);
    if (!current) return Object.freeze({ representation: "plain_text", threshold_status: "unknown_adapter", unicode_chars: unicodeChars, threshold_chars: unicodeChars, length_metric: "unicode_code_points", threshold: null });
    const metric = current.plain_text_length_metric === "utf16_code_units" ? "utf16_code_units" : "unicode_code_points";
    const thresholdChars = metric === "utf16_code_units" ? value.length : unicodeChars;
    const hasThreshold = current.plain_text_max_chars !== null && current.plain_text_max_chars !== undefined && Number.isFinite(Number(current.plain_text_max_chars));
    const threshold = hasThreshold ? Number(current.plain_text_max_chars) : null;
    if (threshold === null) return Object.freeze({ representation: "plain_text", threshold_status: "pending_live_calibration", unicode_chars: unicodeChars, threshold_chars: thresholdChars, length_metric: metric, threshold: null });
    return Object.freeze({
      representation: thresholdChars > threshold ? "text_document" : "plain_text",
      threshold_status: "calibrated",
      unicode_chars: unicodeChars,
      threshold_chars: thresholdChars,
      length_metric: metric,
      threshold
    });
  }

  globalThis.OzonAIDeliveryCapabilities = Object.freeze({
    TARGET_AI_IDS,
    PROFILES,
    CHATGPT_MAX_SAFE_PLAIN_TEXT_UNICODE_CHARACTERS,
    ALICE_MAX_SAFE_PLAIN_TEXT_UTF16_CODE_UNITS,
    normalizedOrigin,
    adapterIdForOrigin,
    profile,
    implementedTargetIds,
    targetLabel,
    implementedContentScriptPatterns,
    conversationPathForTarget,
    deliveryConfirmationBasis,
    acceptedDeliveryConfirmationBases,
    unicodeLength,
    utf8ByteLength,
    extensionFromFilename,
    supportsFile,
    fileDispatchDecision,
    generatedTextDecision
  });
})();
