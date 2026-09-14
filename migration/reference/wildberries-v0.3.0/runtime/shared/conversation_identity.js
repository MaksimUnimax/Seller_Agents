(() => {
  "use strict";

  const UUID = "([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})";
  const Caps = globalThis.WBAIDeliveryCapabilities;

  function normalizedOrigin(value) {
    try { return new URL(String(value || "")).origin.toLowerCase(); }
    catch (_) { return String(value || "").trim().toLowerCase(); }
  }

  function providerForOrigin(origin) { return Caps?.adapterIdForOrigin(normalizedOrigin(origin)) || null; }

  function conversationIdFromPath(pathname, provider = providerForOrigin(globalThis.location?.origin)) {
    const segment = String(Caps?.profile(provider)?.conversation_path_segment || "");
    const pattern = segment ? new RegExp(`(?:^|/)${segment}/${UUID}(?:/|$)`, "i") : null;
    return String(pathname || "").match(pattern || /$^/)?.[1]?.toLowerCase() || null;
  }

  function conversationPathFor(provider, id) { return Caps?.conversationPathForTarget(provider, id) || null; }

  function canonicalConversationId(origin, canonicalHref, provider = providerForOrigin(origin)) {
    if (!canonicalHref || Caps?.profile(provider)?.canonical_conversation_supported !== true) return null;
    try {
      const expectedOrigin = normalizedOrigin(origin);
      const parsed = new URL(String(canonicalHref), String(origin || undefined));
      if (normalizedOrigin(parsed.origin) !== expectedOrigin) return null;
      return conversationIdFromPath(parsed.pathname, provider);
    } catch (_) { return null; }
  }

  function resolve({ origin, pathname, canonicalHref = "" } = {}) {
    const normalized = normalizedOrigin(origin);
    const provider = providerForOrigin(normalized);
    if (!provider) {
      return { origin: normalized, chat_path: String(pathname || ""), conversation_id: null, status: "unsupported", source: "unsupported_origin", ai_id: null };
    }
    const pathId = conversationIdFromPath(pathname, provider);
    const canonicalId = canonicalConversationId(normalized, canonicalHref, provider);
    if (pathId && canonicalId && pathId !== canonicalId) {
      return { origin: normalized, chat_path: String(pathname || ""), conversation_id: null, status: "conflict", source: "path_canonical_conflict", ai_id: provider };
    }
    const conversationId = pathId || canonicalId || null;
    return {
      origin: normalized,
      chat_path: String(pathname || ""),
      conversation_id: conversationId,
      status: conversationId ? "confirmed" : "unknown",
      source: pathId && canonicalId ? "path_and_canonical" : (pathId ? "path" : (canonicalId ? "canonical" : "none")),
      ai_id: provider
    };
  }

  function normalizedConversationCandidate(value) {
    const candidate = String(value || "").trim().toLowerCase();
    return candidate || null;
  }

  function resolveWithEvidence({ origin, pathname, canonicalHref = "", activeConversationId = null } = {}) {
    const base = resolve({ origin, pathname, canonicalHref });
    if (Caps?.profile(base.ai_id)?.active_conversation_evidence_required !== true) return base;

    const activeId = normalizedConversationCandidate(activeConversationId);
    if (!base.conversation_id) {
      return { ...base, active_conversation_id: activeId, corroboration: "not_applicable" };
    }
    if (!activeId) {
      return {
        ...base,
        conversation_id: null,
        status: "unknown",
        source: "alice_path_without_active_history",
        active_conversation_id: null,
        corroboration: "missing"
      };
    }
    if (activeId !== base.conversation_id) {
      return {
        ...base,
        conversation_id: null,
        status: "conflict",
        source: "alice_path_active_history_conflict",
        active_conversation_id: activeId,
        corroboration: "conflict"
      };
    }
    return {
      ...base,
      source: "path_and_active_history",
      active_conversation_id: activeId,
      corroboration: "confirmed"
    };
  }

  globalThis.BB2ConversationIdentity = Object.freeze({
    conversationPathFor,
    providerForOrigin,
    conversationIdFromPath,
    canonicalConversationId,
    resolve,
    resolveWithEvidence
  });
})();
