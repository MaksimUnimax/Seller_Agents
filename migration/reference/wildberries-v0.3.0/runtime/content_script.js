/* global BB2ConversationIdentity, BB2ManualControls, WBContract, WBCommandProtocol, BB2ComposerSend, BB2ProvenWritingCapture */
(function installWBContent() {
  "use strict";

  let aiMode="auto";
  let aiModeRevision=0;
  function currentAIAdapter(){return globalThis.WBAIAdapters?.adapterForLocation(aiMode) || null;}
  function roleOf(n){return n?.getAttribute("data-turn") || n?.getAttribute("data-message-author-role") || (n?.getAttribute("data-message-role")==="alice"?"assistant":n?.getAttribute("data-message-role"));}
  function turnId(n){return currentAIAdapter()?.messageId(n) || n?.getAttribute("data-turn-id") || "";}
  const VERSION = "0.3.0";
  const runtimeId = `${VERSION}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const RUNTIME_KEY = "__WB_LLM_API_BRIDGE_RUNTIME__";
  const STAGE_ATTR = "data-wildberries-bridge-stage";
  const STAGE_DELIVERY_ATTR = "data-wildberries-bridge-delivery";
  const SEND_RENDER_WAIT_MS = 2000;
  const SEND_TARGET_STABLE_SAMPLES = 3;
  const SEND_TARGET_SAMPLE_INTERVAL_MS = 200;
  const COMPOSER_SEND_RETRY_MS = 250;
  const MANUAL_INITIAL_BLOCK_LIMIT = 5;
  const MANUAL_INITIAL_NODE_LIMIT = 5000;
  const CURRENT_ROOT_SELECTOR = [
    '[data-writing-block="true"][data-testid="writing-block-container"]',
    '[data-writing-block-id][data-testid="writing-block-container"]',
    '[data-oai-writing-block-surface][data-writing-block="true"]'
  ].join(", ");
  const CURRENT_BODY_SELECTOR = "[data-writing-block-fullscreen-editor-region]";
  const LEGACY_BODY_SELECTOR = "#code-block-viewer";
  const BUSY = new Set();
  // Copy profiles remain structural hints only; no execution listener is attached to native Copy.
  const DECORATED = new Map();
  const OWN_BUTTONS = new Map();
  const manualKnownBlocks = new Set();
  let ownButtonHost = null, ownButtonShadow = null, positionRaf = 0;
  let manualBridgeReady = true;
  let manualRescanTimer = null;
  let workVisibilityRevision = -1;
  let observer = null;
  let manualFlushTimer = null;
  const manualPendingRoots = new Set();
  const manualTrackedRoots = new Set();
  let manualTailRoot = null;
  let manualEnabled = false;
  let manualConversationKey = null;
  let runtimeMessageListener = null;
  let sendButtonProfile = null;
  let copyButtonProfiles = [];
  let pickerState = null;
  let copyPickerActive = false;
  let suppressPickerClick = false;
  const recoveryInFlight = new Set();
  const manualRecoveryInFlight = new Set();

  const AUTO_PROMPT_STABILITY_MS = 2000;
  const AUTO_PROMPT_DEBOUNCE_MS = 200;
  let autoObserver = null;
  let autoTimer = null;
  let activeAutoWatch = null;
  let autoFirstSeen = null;
  let autoTickInFlight = false;
  let identityPollTimer = null;
  let lastObservedConversationKey = null;

  const prior = globalThis[RUNTIME_KEY];
  if (prior?.dispose) { try { prior.dispose(); } catch (_) {} }
  const runtime = { id: runtimeId, generation: runtimeId, recovery: null, disposed: false, dispose: null };
  globalThis[RUNTIME_KEY] = runtime;

  function current() { return !runtime.disposed && globalThis[RUNTIME_KEY] === runtime; }
  const ownedListeners = [];
  function superseded() { return { ok: false, code: "CONTENT_RUNTIME_SUPERSEDED", error: "Content runtime superseded." }; }
  function assertCurrent() { if (!current()) throw Object.assign(new Error("Content runtime superseded."), { code: "CONTENT_RUNTIME_SUPERSEDED" }); }
  function assertConversation(key) {
    assertCurrent();
    if (key && key !== conversationKeyFromLocation()) throw Object.assign(new Error("Delivery belongs to another conversation."), { code: "CONVERSATION_MISMATCH" });
  }
  function listenOwned(target, type, handler, options) {
    const guarded = (...args) => { if (current()) return handler(...args); };
    target.addEventListener(type, guarded, options);
    ownedListeners.push(() => target.removeEventListener(type, guarded, options));
  }
  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

  async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(String(value || ""));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function assertRecoveryTextIntegrity(recovery) {
    const expected = String(recovery?.outgoing_hash || "").trim().toLowerCase();
    if (!expected) return true;
    const actual = await sha256Hex(String(recovery?.outgoing_text || ""));
    if (actual !== expected) {
      throw Object.assign(new Error("Сохранённый Wildberries delivery text не совпадает с его SHA-256. Автоматическая отправка заблокирована."), { code: "DELIVERY_INTEGRITY_MISMATCH" });
    }
    return true;
  }
  function canonicalText(value) { return String(value || "").replace(/\u00a0/g, " ").replace(/\r\n/g, "\n").trim(); }
  function normalizedDeliveryText(value) { return canonicalText(value).replace(/\s+/g, " ").trim(); }

  function turnSections() {
    const a=currentAIAdapter();if(!a)return [];
    return [...new Set([...a.assistantMessages(),...a.userMessages()])].sort((x,y)=>x===y?0:x.compareDocumentPosition(y)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
  }
  globalThis.BB2CaptureEnvironment = Object.freeze({ turnSections });

  function assistantTurnIds() {
    return turnSections()
      .filter((section) => roleOf(section) === "assistant")
      .map((section) => turnId(section))
      .filter(Boolean);
  }

  function userTurnIds() {
    return turnSections()
      .filter((section) => roleOf(section) === "user")
      .map((section) => turnId(section))
      .filter(Boolean);
  }

  function userTurnRecords() {
    return turnSections()
      .filter((section) => roleOf(section) === "user")
      .map((section) => ({
        id: turnId(section) || "",
        text: canonicalText(userMessageText(section))
      }))
      .filter((item) => item.id);
  }

  function userMessageText(section) {
    const adapter = currentAIAdapter();
    return adapter?.userMessageText ? adapter.userMessageText(section)
      : adapter?.messageText?.(section) || "";
  }

  function matchingNewUserTurn(baselineIds, expectedText, requestId = "") {
    const baseline = baselineIds instanceof Set ? baselineIds : new Set(baselineIds || []);
    const expected = normalizedDeliveryText(expectedText);
    const requestToken = String(requestId || "").trim();
    for (const record of userTurnRecords()) {
      if (baseline.has(record.id)) continue;
      const actual = normalizedDeliveryText(record.text);
      if (expected && (actual === expected || (requestToken && actual.includes(expected) && actual.includes(requestToken)))) return record.id;
      if (!expected && requestToken && actual.includes("WB_RESULT_V1") && actual.includes(requestToken)) return record.id;
    }
    return null;
  }

  function conversationIdentity() {
    const canonicalHref=document.querySelector('link[rel="canonical"][href]')?.href || '';
    const adapter=currentAIAdapter();
    const active=document.querySelector('button[data-testid="chatlist-item-active"][aria-current="page"]');
    const activeConversationId=active?.closest('.ChatListItem[id]')?.id || null;
    const resolved=BB2ConversationIdentity.resolveWithEvidence({origin:location.origin,pathname:location.pathname,canonicalHref,activeConversationId});
    if(!adapter || resolved.ai_id!==adapter.id)return {...resolved,conversation_id:null,status:'adapter_mismatch',source:'ai_mode_mismatch'};
    return {...resolved,selected_ai_mode:aiMode,active_adapter_id:adapter.id};
  }

  function conversationKeyFromLocation() {
    const here = conversationIdentity();
    if (!here?.origin || !here?.conversation_id || here.status !== "confirmed") return null;
    return `${String(here.origin).toLowerCase()}|${String(here.conversation_id).toLowerCase()}`;
  }

  function sameConversation(origin, conversationId) {
    const here = conversationIdentity();
    return Boolean(
      here?.status === "confirmed" &&
      here?.conversation_id &&
      String(here.origin || "").toLowerCase() === String(origin || "").toLowerCase() &&
      String(here.conversation_id).toLowerCase() === String(conversationId || "").toLowerCase()
    );
  }

  function sendRuntime(type, payload = {}) {
    return new Promise((resolveOriginal) => {
      const timer=setTimeout(()=>resolveOriginal({ok:false,code:'RUNTIME_RESPONSE_TIMEOUT',error:'Worker response not confirmed; no automatic replay.'}),type==='WB_EXECUTE_COMMAND'?1200000:15000);
      let settled=false;const resolve=value=>{if(settled)return;settled=true;clearTimeout(timer);resolveOriginal(value);};
      if (!current()) return resolve(superseded());
      if (payload.conversation_key && payload.conversation_key !== conversationKeyFromLocation()) return resolve({ok:false,code:"CONVERSATION_MISMATCH",error:"Command belongs to another conversation."});
      try {
        chrome.runtime.sendMessage({ ...payload, actor_id:runtimeId, runtime_generation:runtime.generation, type }, (response) => {
          const err = chrome.runtime.lastError;
          if (!current()) return resolve(superseded());
          if (payload.conversation_key && payload.conversation_key !== conversationKeyFromLocation()) return resolve({ok:false,code:"CONVERSATION_MISMATCH",error:"Response belongs to another conversation."});
          if (err) return resolve({ ok: false, code: "RUNTIME_ERROR", error: err.message });
          resolve(response || { ok: false, code: "EMPTY_RESPONSE", error: "Пустой ответ service worker." });
        });
      } catch (error) {
        resolve({ ok: false, code: "RUNTIME_ERROR", error: String(error?.message || error) });
      }
    });
  }

  function recordContentDiagnostic(event, details = {}) {
    sendRuntime("WB_RECORD_DIAGNOSTIC", { event, details }).catch(() => null);
  }

  const statusToastByKey = new Map();

  function ensureToastRoot() {
    let root = document.getElementById("wb-llm-api-bridge-toast-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "wb-llm-api-bridge-toast-root";
    // Status plates belong at the top so they never cover the ChatGPT composer.
    Object.assign(root.style, { position: "fixed", right: "18px", top: "18px", zIndex: "2147483647", display: "grid", gap: "8px", maxWidth: "460px", pointerEvents: "none" });
    document.documentElement.appendChild(root);
    return root;
  }

  function clearToast(key) {
    const normalized = String(key || "");
    if (!normalized) return false;
    const previous = statusToastByKey.get(normalized);
    if (!previous) return false;
    statusToastByKey.delete(normalized);
    try { previous.remove(); } catch (_) {}
    return true;
  }

  function toast(text, tone = "info", timeout = 5000, key = "") {
    if (!current()) return false;
    const normalizedKey = String(key || "");
    if (normalizedKey) clearToast(normalizedKey);
    const item = document.createElement("div");
    item.textContent = text;
    Object.assign(item.style, {
      position: "relative",
      font: "13px/1.4 system-ui, sans-serif", color: tone === "error" ? "#7f1d1d" : "#0f172a",
      background: tone === "error" ? "#fee2e2" : tone === "success" ? "#dcfce7" : "#e0f2fe",
      border: "1px solid rgba(15,23,42,.16)", borderRadius: "10px", padding: "10px 38px 10px 12px",
      boxShadow: "0 8px 24px rgba(15,23,42,.18)", pointerEvents: "auto", whiteSpace: "pre-wrap"
    });
    const remove = () => {
      if (normalizedKey && statusToastByKey.get(normalizedKey) === item) statusToastByKey.delete(normalizedKey);
      try { item.remove(); } catch (_) {}
    };
    const close = document.createElement("button");
    close.setAttribute("type", "button");
    close.setAttribute("aria-label", "Закрыть");
    close.setAttribute("title", "Закрыть");
    close.textContent = "×";
    Object.assign(close.style, {
      position: "absolute", right: "8px", top: "6px", width: "24px", height: "24px",
      padding: "0", border: "0", borderRadius: "6px", background: "transparent", color: "inherit",
      font: "700 20px/24px system-ui, sans-serif", textAlign: "center", cursor: "pointer", opacity: "0.72"
    });
    close.addEventListener("click", (event) => {
      try { event.preventDefault(); event.stopPropagation(); } catch (_) {}
      remove();
    });
    item.appendChild(close);
    ensureToastRoot().appendChild(item);
    if (normalizedKey) statusToastByKey.set(normalizedKey, item);
    if (Number(timeout) > 0) setTimeout(remove, timeout);
    return item;
  }

  function visible(element) {
    if (!(element instanceof Element) || !element.isConnected) return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  }

  function isGenericAssistantCopy(button) {
    const token = [button.getAttribute("data-testid") || "", button.getAttribute("aria-label") || "", button.getAttribute("title") || "", button.textContent || ""].join(" ").toLowerCase();
    return (button.getAttribute("data-testid") || "") === "copy-turn-action-button" || /копировать\s+ответ|copy\s+response/u.test(token);
  }

  function looksLikeCopy(button) {
    if (!(button instanceof HTMLButtonElement) || isGenericAssistantCopy(button)) return false;
    const token = [button.getAttribute("data-testid") || "", button.getAttribute("aria-label") || "", button.getAttribute("title") || "", button.getAttribute("name") || "", button.textContent || ""].join(" ").toLowerCase();
    return (button.getAttribute("data-testid") || "").toLowerCase().includes("copy") || /(?:^|\s)(?:копировать|copy)(?:\s|$)/u.test(token) || Boolean(button.querySelector('svg use[href*="#ce3544"]'));
  }

  function normalizeCopyButtonProfiles(value) {
    return BB2ManualControls.normalizeCopyButtonProfileCollection(value).profiles;
  }

  function replaceCopyButtonProfiles(value, reason = "update") {
    if (!current()) return false;
    copyButtonProfiles = normalizeCopyButtonProfiles(value);
    recordContentDiagnostic("COPY_BUTTON_PROFILES_UPDATED", { reason, custom_profile_count: copyButtonProfiles.length });
    if (manualEnabled) {
      for (const button of [...DECORATED.keys()]) restoreButton(button);
      decorateLatestExisting(MANUAL_INITIAL_BLOCK_LIMIT);
    }
  }

  function copyButtonSignature(button, adapterId) {
    const decoration = DECORATED.get(button);
    const title = decoration ? (decoration.title || "") : (button.getAttribute("title") || "");
    const testid = button.getAttribute("data-testid") || "";
    const aria = button.getAttribute("aria-label") || "";
    const name = button.getAttribute("name") || "";
    return {
      kind: "bb2_manual_copy_button_v2",
      profile_id: `oz-copy-profile-${crypto.randomUUID()}`,
      adapter_id: adapterId,
      tag: button.tagName.toLowerCase(),
      testid,
      aria,
      title,
      name,
      type: button.getAttribute("type") || "",
      text_hint: (testid || aria || title || name) ? "" : canonicalText(button.textContent || "").slice(0, 120),
      created_at: new Date().toISOString()
    };
  }

  function signatureMatchesCopyButton(profile, binding, button) {
    const normalized = BB2ManualControls.normalizeCopyButtonProfile(profile);
    if (!normalized || !(button instanceof HTMLButtonElement) || normalized.adapter_id !== binding?.adapter_id) return false;
    if (normalized.tag && button.tagName.toLowerCase() !== normalized.tag) return false;
    for (const [key, attribute] of [["testid", "data-testid"], ["aria", "aria-label"], ["title", "title"], ["name", "name"], ["type", "type"]]) {
      if (normalized[key] && (button.getAttribute(attribute) || "") !== normalized[key]) return false;
    }
    if (normalized.text_hint && canonicalText(button.textContent || "").slice(0, 120) !== normalized.text_hint) return false;
    return true;
  }

  function isLocalCopyForBinding(button, binding) {
    if (!(button instanceof HTMLButtonElement) || !binding || isGenericAssistantCopy(button)) return false;
    return looksLikeCopy(button) || copyButtonProfiles.some((profile) => signatureMatchesCopyButton(profile, binding, button));
  }

  function bindingFromRoot(root) {
    const a=currentAIAdapter();
    if(a && root instanceof Element){
      const section=a.assistantMessages().find(n=>n===root || n.contains(root));
      if(section){
        const blocks=a.findCodeBlocks(section);
        const block=blocks.find(b=>b===root);
        if(block){const body=block.querySelector('[data-writing-block-fullscreen-editor-region],.cm-content,#code-block-viewer,pre > code,code,pre');if(body)return {root:block,body,section,adapter_id:a.id+'_native_code_v1',ai_native:true};}
      }
    }
    if (!(root instanceof Element)) return null;
    if (root.matches(CURRENT_ROOT_SELECTOR)) {
      const bodies = [...root.querySelectorAll(CURRENT_BODY_SELECTOR)];
      const section = root.closest('section[data-turn="assistant"][data-turn-id]');
      if (bodies.length === 1 && section) return { root, body: bodies[0], section, adapter_id: "current_writing_block_v1" };
    }
    if (root instanceof HTMLPreElement) {
      const bodies = [...root.querySelectorAll(LEGACY_BODY_SELECTOR)];
      const section = root.closest('section[data-turn="assistant"][data-turn-id]');
      if (bodies.length === 1 && section) return { root, body: bodies[0], section, adapter_id: "legacy_code_block_v1" };
    }
    return null;
  }

  function bindingFromButton(button) {
    const a=currentAIAdapter();
    if(a && button instanceof HTMLButtonElement){for(const section of a.assistantMessages()){if(!section.contains(button))continue;for(const block of a.findCodeBlocks(section)){if(a.geometryAnchor(block)===button || block.contains(button)){const b=bindingFromRoot(block);if(b)return b;}}}}
    if (!(button instanceof HTMLButtonElement) || isGenericAssistantCopy(button)) return null;
    const currentRoot = button.closest(CURRENT_ROOT_SELECTOR);
    const currentBinding = bindingFromRoot(currentRoot);
    if (currentBinding?.root.contains(button)) return currentBinding;
    const legacyRoot = button.closest("pre");
    const legacyBinding = bindingFromRoot(legacyRoot);
    return legacyBinding?.root.contains(button) ? legacyBinding : null;
  }

  function supportedBindingsInSection(section) {
    if (!(section instanceof Element)) return [];
    const roots = [
      ...section.querySelectorAll(CURRENT_ROOT_SELECTOR),
      ...section.querySelectorAll("pre")
    ];
    const bindings = [];
    const seen = new Set();
    for (const root of roots) {
      if (seen.has(root)) continue;
      seen.add(root);
      const binding = bindingFromRoot(root);
      if (binding) bindings.push(binding);
    }
    return bindings;
  }

  // Picker fallback must work precisely when the button no longer looks like a known Copy control.
  // Resolve a sibling-toolbar button back to one unique writing/code block using the proven locality rule.
  function bindingFromLocalCopyCandidate(button) {
    if (!(button instanceof HTMLButtonElement) || isGenericAssistantCopy(button)) return null;
    const direct = bindingFromButton(button);
    if (direct) return direct;
    const section = button.closest('section[data-turn="assistant"][data-turn-id]');
    if (!section) return null;
    const matches = supportedBindingsInSection(section).filter((binding) =>
      BB2ManualControls.chooseLocalWritingBlockCopyButton(section, binding.root, [button]) === button
    );
    return matches.length === 1 ? matches[0] : null;
  }

  function commandText(binding) {
    const adapter = WBAIAdapters.ADAPTERS[binding?.adapter_id] || currentAIAdapter();
    if (!adapter || !binding?.root?.isConnected) return "";
    return String(adapter.readCodeText(binding.root) || "");
  }

  function ancestorDistance(node, ancestor) {
    let distance = 0;
    let currentNode = node;
    while (currentNode && currentNode !== ancestor) {
      currentNode = currentNode.parentElement || null;
      distance += 1;
    }
    return currentNode === ancestor ? distance : Number.POSITIVE_INFINITY;
  }

  function sharedAncestorWithin(left, right, boundary) {
    if (!left || !right || !boundary) return null;
    const rightAncestors = new Set();
    let currentNode = right;
    while (currentNode) {
      rightAncestors.add(currentNode);
      if (currentNode === boundary) break;
      currentNode = currentNode.parentElement || null;
    }
    currentNode = left;
    while (currentNode) {
      if (rightAncestors.has(currentNode)) return currentNode;
      if (currentNode === boundary) break;
      currentNode = currentNode.parentElement || null;
    }
    return null;
  }

  function chooseLocalCopyButton(section, explicitRoot, candidates) {
    const copies = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
    if (!section || copies.length === 0) return null;
    if (!explicitRoot) return copies.length === 1 ? copies[0] : null;

    const inside = copies.filter((copy) => explicitRoot.contains(copy));
    if (inside.length === 1) return inside[0];
    if (inside.length > 1) return null;

    const ranked = copies.map((copy) => {
      const shared = sharedAncestorWithin(explicitRoot, copy, section);
      if (!shared || shared === section) return null;
      const score = ancestorDistance(explicitRoot, shared) + ancestorDistance(copy, shared);
      return Number.isFinite(score) ? { copy, score } : null;
    }).filter(Boolean).sort((a, b) => a.score - b.score);

    if (!ranked.length) return null;
    const bestScore = ranked[0].score;
    const best = ranked.filter((entry) => entry.score === bestScore);
    return best.length === 1 ? best[0].copy : null;
  }

  function localCopyButton(binding) {
    if(binding?.ai_native){const n=currentAIAdapter()?.geometryAnchor(binding.root);return n instanceof HTMLButtonElement?n:null;}
    if (!binding) return null;
    const sectionCopies = [...binding.section.querySelectorAll("button")].filter((button) => isLocalCopyForBinding(button, binding));
    return chooseLocalCopyButton(binding.section, binding.root, sectionCopies);
  }

  function commandKey(binding, text) {
    const turn = turnId(binding.section) || "assistant";
    const explicit = binding.root.getAttribute("data-writing-block-id") || binding.root.id || "block";
    let fingerprint = "00000000";
    try { fingerprint = WBCommandProtocol.parse(text).fingerprint; } catch (_) {}
    return `${turn}:${explicit}:${fingerprint}`;
  }

  function styleSnapshot(element, property) {
    return {
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property)
    };
  }

  function restoreStyleSnapshot(element, property, snapshot) {
    if (!snapshot?.value) element.style.removeProperty(property);
    else element.style.setProperty(property, snapshot.value, snapshot.priority || "");
  }

  function restoreButton(button) {
    const old = DECORATED.get(button);
    if (!old) return;
    button.removeEventListener("click", old.handler, true);
    restoreStyleSnapshot(button, "color", old.styles.color);
    restoreStyleSnapshot(button, "background-color", old.styles.backgroundColor);
    restoreStyleSnapshot(button, "box-shadow", old.styles.boxShadow);
    if (old.title === null) button.removeAttribute("title");
    else button.setAttribute("title", old.title);
    DECORATED.delete(button);
  }

  function ensureOwnButtonSurface() {
    if (ownButtonHost?.isConnected && ownButtonShadow) return ownButtonShadow;
    const host = document.createElement("div");
    host.id = "wb-bridge-own-button-host";
    Object.assign(host.style, {
      position: "fixed", inset: "0", zIndex: "2147483646", pointerEvents: "none",
      width: "0", height: "0", overflow: "visible"
    });
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      button.wb-bridge-block-action {
        all: initial;
        box-sizing: border-box;
        position: fixed;
        min-width: 68px;
        height: 32px;
        padding: 0 10px;
        border: 1px solid rgba(137, 24, 178, .82);
        border-radius: 8px;
        background: linear-gradient(125deg, #e313bf, #7b21d2);
        color: white;
        font: 700 12px/30px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(15, 23, 42, .24);
        pointer-events: auto;
        user-select: none;
        white-space: nowrap;
      }
      button.wb-bridge-block-action:hover:not(:disabled) { filter: brightness(1.06); }
      button.wb-bridge-block-action:focus-visible { outline: 3px solid rgba(208, 50, 209, .55); outline-offset: 2px; }
      button.wb-bridge-block-action:disabled {
        cursor: default;
        background: rgba(71, 85, 105, .88);
        border-color: rgba(148, 163, 184, .7);
        color: rgba(255,255,255,.86);
        box-shadow: 0 2px 8px rgba(15,23,42,.16);
      }
    `;
    shadow.appendChild(style);
    (document.body || document.documentElement).appendChild(host);
    ownButtonHost = host;
    ownButtonShadow = shadow;
    return shadow;
  }

  function positionOwnButton(record) {
    if (!record?.button || !record?.binding?.root?.isConnected) return false;
    const adapter = WBAIAdapters.ADAPTERS[record.binding.adapter_id] || currentAIAdapter();
    const anchor = adapter?.geometryAnchor(record.binding.root) || record.binding.root;
    if (!(anchor instanceof Element) || !anchor.isConnected) return false;
    const rect = anchor.getBoundingClientRect();
    const button = record.button;
    const width = Math.max(68, button.getBoundingClientRect().width || 68);
    const height = 32;
    const outsideLeft = rect.right + 10;
    const roomOutside = outsideLeft + width <= window.innerWidth - 8;
    let left;
    let top;
    if (roomOutside) {
      left = outsideLeft;
      top = Math.max(8, Math.min(window.innerHeight - height - 8, rect.top + 4));
    } else {
      left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left + 8));
      top = Math.max(8, Math.min(window.innerHeight - height - 8, rect.top + 46));
    }
    button.style.left = `${Math.round(left)}px`;
    button.style.top = `${Math.round(top)}px`;
    const onScreen = rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth;
    button.style.display = onScreen ? "block" : "none";
    return true;
  }

  function scheduleOwnButtonPositioning() {
    if (positionRaf) return;
    positionRaf = requestAnimationFrame(() => {
      positionRaf = 0;
      for (const [block, record] of [...OWN_BUTTONS.entries()]) {
        if (!block.isConnected || !record.binding?.section?.isConnected) {
          try { record.resize_observer?.disconnect(); } catch (_) {}
          try { record.button.remove(); } catch (_) {}
          OWN_BUTTONS.delete(block);
          manualKnownBlocks.delete(block);
          continue;
        }
        positionOwnButton(record);
      }
    });
  }

  function removeOwnButton(block) {
    const record = OWN_BUTTONS.get(block);
    if (!record) return false;
    record.destroyed = true;
    try { record.resize_observer?.disconnect(); } catch (_) {}
    try { record.button.remove(); } catch (_) {}
    OWN_BUTTONS.delete(block);
    return true;
  }

  function clearOwnButtons() {
    for (const block of [...OWN_BUTTONS.keys()]) removeOwnButton(block);
    if (positionRaf) cancelAnimationFrame(positionRaf);
    positionRaf = 0;
    try { ownButtonHost?.remove(); } catch (_) {}
    ownButtonHost = null;
    ownButtonShadow = null;
  }

  function renderOwnButton(record) {
    if (!record?.button) return;
    const ready = manualEnabled && manualBridgeReady;
    record.button.disabled = !ready || record.in_flight === true;
    record.button.textContent = record.in_flight ? "WB…" : "WB";
    record.button.title = ready
      ? `WB Bridge: выполнить команды из этого ${record.binding.adapter_id === "alice" ? "Alice" : "ChatGPT"} code block`
      : "WB Bridge: bridge занят; API-вызов заблокирован до завершения текущей delivery";
  }

  function setManualBridgeReady(ready) {
    manualBridgeReady = ready === true;
    for (const record of OWN_BUTTONS.values()) renderOwnButton(record);
    return manualBridgeReady;
  }

  async function handleCopy(binding, button) {
    if (!current() || !manualEnabled) return;
    const currentKey = conversationKeyFromLocation();
    if (manualConversationKey !== currentKey) {
      await syncManualState();
      if (!manualEnabled || manualConversationKey !== currentKey) return;
    }
    const text = commandText(binding);
    if (!WBCommandProtocol.hasCommands(text)) {
      toast("Wildberries: в блоке нет команды API или HELP. Выполнено только обычное копирование; API-запрос не отправлен.", "info", 5000);
      return;
    }
    let parsed;
    try { parsed = WBCommandProtocol.parse(text); }
    catch (_) {
      // Do not reduce a malformed explicit attempt to a toast. The worker owns
      // parsing/admission and persists a safe report before returning it here.
      parsed = {operation:'локальную проверку команды'};
    }
    const key = commandKey(binding, text);
    if (BUSY.has(key)) {
      await reportLocalDeliveryError({code:'MANUAL_REQUEST_DUPLICATE'},currentKey).catch(()=>null);return;
    }
    BUSY.add(key);
    const operationConversationKey = String(manualConversationKey || currentKey);
    const manualRequestId = crypto.randomUUID();
    let manualOperationId = "";
    toast(`Wildberries: выполняю ${parsed.operation} (HELP локально, API последовательно)…`, "info", 0, "operation-state");
    try {
      const response = await sendRuntime("WB_EXECUTE_COMMAND", { command_text: text, conversation_key: operationConversationKey, manual_request_id: manualRequestId });
      manualOperationId = String(response.manual_operation_id || "");
      if (!response.report_text) throw Object.assign(new Error(response.error || "Wildberries API не вернул отчёт."), { code: response.code || "NO_REPORT" });
      if (!response.ok) toast(`Wildberries API вернул ошибку ${response.http_status || ""}. Отчёт будет передан в чат.`, "error", 0, "operation-state");
      else toast("Wildberries: ответ получен. Передаю результат в ChatGPT…", "success", 0, "operation-state");
      const delivery = await deliverReport(response.outgoing_text || response.report_text, response.auto_send !== false, { confirmUserTurn: response.auto_send !== false, runId: `manual:${manualOperationId || operationConversationKey}`, deliveryId: response.delivery_id || `manual-${response.request_id || Date.now()}`, requestId: response.request_id || "", requireCommit: false, conversationKey: operationConversationKey });
      if(delivery.waiting_for_composer_clear)return;
      if (manualOperationId) {
        const completion = await sendRuntime("WB_MANUAL_DELIVERY_COMPLETE", {
          conversation_key: operationConversationKey,
          manual_operation_id: manualOperationId,
          delivery_confirmed: delivery.delivery_confirmed === true,
          confirmed_user_turn_id: delivery.confirmed_user_turn_id || null,
          composer_empty: delivery.composer_empty === true,
          click_attempts: Number(delivery.click_attempts || 0)
        });
        if (!completion?.ok) throw Object.assign(new Error(completion?.error || "Не удалось завершить manual operation."), { code: completion?.code || "MANUAL_DELIVERY_COMPLETE_REJECTED" });
      }
      if (delivery.delivery_confirmed) {
        await sendRuntime("WB_REPORT_DELIVERY_CONFIRMED", {
          conversation_key: operationConversationKey,
          report_prefix_applied: response.report_prefix_applied === true,
          delivery_id: response.delivery_id || ""
        });
      }
    } catch (error) {
      if (manualOperationId) {
        await sendRuntime("WB_MANUAL_DELIVERY_FAILED", {
          conversation_key: operationConversationKey,
          manual_operation_id: manualOperationId,
          code: error.code || "MANUAL_DELIVERY_FAILED",
          error: error.message || String(error)
        }).catch(() => null);
      }
      if(!manualOperationId.startsWith('wb-local-'))await reportLocalDeliveryError(error,operationConversationKey,manualOperationId).catch(()=>null);
      toast(`Wildberries: ${error.code||'Ошибка доставки'}`, "error", 0, "operation-state");
    } finally {
      BUSY.delete(key);
    }
  }

  function decorateBinding(binding) {
    if (!manualEnabled || !binding?.root?.isConnected || OWN_BUTTONS.has(binding.root)) return false;
    const shadow = ensureOwnButtonSurface();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wb-bridge-block-action";
    button.setAttribute("aria-label", "WB Bridge — выполнить команды из этого code block");
    const record = { binding, button, in_flight: false, resize_observer: null, destroyed: false, conversation_key: manualConversationKey, runtime_id: runtimeId };
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!current() || record.runtime_id !== runtimeId || record.conversation_key !== conversationKeyFromLocation() || record.conversation_key !== manualConversationKey || record.destroyed || OWN_BUTTONS.get(binding.root) !== record || !record.button.isConnected) return;
      if (!manualEnabled || !manualBridgeReady || record.in_flight) return;
      if (!binding.root.isConnected || !binding.section.isConnected) {
        removeOwnButton(binding.root);
        scheduleManualRescan();
        return;
      }
      record.in_flight = true;
      setManualBridgeReady(false);
      renderOwnButton(record);
      queueMicrotask(() => handleCopy(binding).finally(() => {
        record.in_flight = false;
        if (current() && record.runtime_id === runtimeId && record.conversation_key === manualConversationKey && manualConversationKey === conversationKeyFromLocation()) { setManualBridgeReady(true); void syncManualState(); }
        renderOwnButton(record);
      }));
    });
    shadow.appendChild(button);
    try {
      if (globalThis.ResizeObserver) {
        record.resize_observer = new ResizeObserver(() => scheduleOwnButtonPositioning());
        record.resize_observer.observe(binding.root);
      }
    } catch (_) { record.resize_observer = null; }
    OWN_BUTTONS.set(binding.root, record);
    renderOwnButton(record);
    positionOwnButton(record);
    recordContentDiagnostic("OWN_CODE_BUTTON_BOUND", {
      ai_adapter: binding.adapter_id,
      assistant_message_id: (WBAIAdapters.ADAPTERS[binding.adapter_id] || currentAIAdapter())?.messageId(binding.section) || null
    });
    return true;
  }

  function allStructuralBindings() {
    const adapter = currentAIAdapter();
    if (!adapter) return [];
    const bindings = [];
    for (const message of adapter.assistantMessages()) {
      for (const root of adapter.findCodeBlocks(message)) {
        if (root?.isConnected) bindings.push({ root, body: root, section: message, adapter_id: adapter.id });
      }
    }
    return bindings;
  }

  function decorateExistingBindings() {
    if (!manualEnabled) return { roots: [], visitedNodes: 0, capped: false };
    const bindings = allStructuralBindings();
    for (const binding of bindings) {
      manualKnownBlocks.add(binding.root);
      decorateBinding(binding);
    }
    scheduleOwnButtonPositioning();
    return { roots: bindings.map((binding) => binding.root), visitedNodes: bindings.length, capped: false };
  }



  function scheduleManualRescan(delay = 60) {
    if (!manualEnabled || manualRescanTimer) return;
    manualRescanTimer = setTimeout(() => {
      manualRescanTimer = null;
      if (!manualEnabled) return;
      const bindings = allStructuralBindings();
      const live = new Set(bindings.map((binding) => binding.root));
      for (const block of [...manualKnownBlocks]) if (!live.has(block)) manualKnownBlocks.delete(block);
      for (const block of [...OWN_BUTTONS.keys()]) if (!live.has(block)) removeOwnButton(block);
      for (const binding of bindings) {
        if (manualKnownBlocks.has(binding.root)) continue;
        manualKnownBlocks.add(binding.root);
        decorateBinding(binding);
      }
      scheduleOwnButtonPositioning();
    }, delay);
  }

  function candidateRootsFromAddedNode(node) {
    const native=currentAIAdapter(); if(native && node instanceof Element){const sections=native.assistantMessages().filter(s=>s===node || s.contains(node) || node.contains(s));if(sections.length)return sections.flatMap(s=>native.findCodeBlocks(s));}
    if (!(node instanceof Element)) return [];
    const roots = new Set();
    const addRoot = (candidate) => {
      const binding = bindingFromRoot(candidate);
      if (binding) roots.add(binding.root);
    };
    const addFromElement = (candidate) => {
      if (!(candidate instanceof Element)) return;
      if (candidate.matches(CURRENT_ROOT_SELECTOR)) addRoot(candidate);
      if (candidate.matches(CURRENT_BODY_SELECTOR)) addRoot(candidate.closest(CURRENT_ROOT_SELECTOR));
      if (candidate.id === "code-block-viewer") addRoot(candidate.closest("pre"));
      if (candidate instanceof HTMLButtonElement) addRoot(bindingFromButton(candidate)?.root);
    };
    addFromElement(node);
    for (const currentRoot of node.querySelectorAll(CURRENT_ROOT_SELECTOR)) addRoot(currentRoot);
    for (const currentBody of node.querySelectorAll(CURRENT_BODY_SELECTOR)) addRoot(currentBody.closest(CURRENT_ROOT_SELECTOR));
    for (const viewer of node.querySelectorAll(LEGACY_BODY_SELECTOR)) addRoot(viewer.closest("pre"));
    for (const button of node.querySelectorAll("button")) addRoot(bindingFromButton(button)?.root);
    return [...roots];
  }

  function rootDocumentOrder(left, right) {
    if (left === right) return 0;
    const relation = left.compareDocumentPosition(right);
    return relation & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  }

  function processNewManualRoot(root) {
    const binding = bindingFromRoot(root);
    if (!manualEnabled || !binding || !binding.root.isConnected) return false;
    root = binding.root;
    if (manualTrackedRoots.has(root)) return decorateBinding(binding);
    if (!manualTailRoot || !manualTailRoot.isConnected) {
      manualTailRoot = root;
      manualTrackedRoots.add(root);
      return decorateBinding(binding);
    }
    if (root === manualTailRoot) {
      manualTrackedRoots.add(root);
      return decorateBinding(binding);
    }
    const relation = manualTailRoot.compareDocumentPosition(root);
    // Match Business Bridge semantics: ignore old/history DOM inserted before the tail after manual mode was enabled.
    if (!(relation & Node.DOCUMENT_POSITION_FOLLOWING)) return false;
    manualTailRoot = root;
    manualTrackedRoots.add(root);
    return decorateBinding(binding);
  }

  function flushManualRoots() {
    manualFlushTimer = null;
    if (!manualEnabled) {
      manualPendingRoots.clear();
      return;
    }
    for (const button of [...DECORATED.keys()]) {
      if (!button.isConnected) DECORATED.delete(button);
    }
    for (const root of [...manualTrackedRoots]) {
      if (!root.isConnected) manualTrackedRoots.delete(root);
    }
    const roots = [...manualPendingRoots].sort(rootDocumentOrder);
    manualPendingRoots.clear();
    roots.forEach(processNewManualRoot);
  }

  function queueManualRoot(root) {
    const binding = bindingFromRoot(root);
    if (!manualEnabled || !binding) return;
    manualPendingRoots.add(binding.root);
    if (manualFlushTimer) return;
    manualFlushTimer = setTimeout(flushManualRoots, 60);
  }

  function previousElementInDocumentOrder(node, boundary) {
    if (!(node instanceof Element) || !(boundary instanceof Element)) return null;
    if (node.previousElementSibling) {
      let candidate = node.previousElementSibling;
      while (candidate.lastElementChild) candidate = candidate.lastElementChild;
      return candidate;
    }
    const parent = node.parentElement;
    return parent && parent !== boundary ? parent : null;
  }

  function latestManualBlockRoots(limit = MANUAL_INITIAL_BLOCK_LIMIT, nodeLimit = MANUAL_INITIAL_NODE_LIMIT) {
    const native=currentAIAdapter();if(native){const roots=native.assistantMessages().flatMap(s=>native.findCodeBlocks(s)).slice(-limit);if(roots.length)return {roots,visitedNodes:roots.length,capped:false};}
    const boundary = document.querySelector("main") || document.body || document.documentElement;
    if (!(boundary instanceof Element)) return { roots: [], visitedNodes: 0, capped: false };
    const roots = [];
    const seen = new Set();
    let node = boundary.lastElementChild;
    while (node?.lastElementChild) node = node.lastElementChild;
    let visited = 0;
    while (node && roots.length < limit && visited < nodeLimit) {
      visited += 1;
      let binding = null;
      if (node.matches(CURRENT_ROOT_SELECTOR)) binding = bindingFromRoot(node);
      else if (node.matches(CURRENT_BODY_SELECTOR)) binding = bindingFromRoot(node.closest(CURRENT_ROOT_SELECTOR));
      else if (node.id === "code-block-viewer") binding = bindingFromRoot(node.closest("pre"));
      if (binding && !seen.has(binding.root)) {
        seen.add(binding.root);
        roots.push(binding.root);
      }
      node = previousElementInDocumentOrder(node, boundary);
    }
    roots.reverse();
    return { roots, visitedNodes: visited, capped: Boolean(node && roots.length < limit) };
  }

  function decorateLatestExisting(limit = MANUAL_INITIAL_BLOCK_LIMIT) {
    if (!manualEnabled) return;
    const scan = latestManualBlockRoots(limit);
    scan.roots.forEach((root) => {
      manualTrackedRoots.add(root);
      const binding = bindingFromRoot(root);
      if (binding) decorateBinding(binding);
    });
    manualTailRoot = scan.roots.at(-1) || null;
  }

  function stopManualObserver() {
    manualEnabled = false;
    manualBridgeReady = false;
    if (observer) observer.disconnect();
    observer = null;
    if (manualFlushTimer) clearTimeout(manualFlushTimer);
    manualFlushTimer = null;
    if (manualRescanTimer) clearTimeout(manualRescanTimer);
    manualRescanTimer = null;
    manualPendingRoots.clear();
    manualTrackedRoots.clear();
    manualKnownBlocks.clear();
    manualTailRoot = null;
    clearOwnButtons();
    window.removeEventListener("scroll", scheduleOwnButtonPositioning, true);
    window.removeEventListener("resize", scheduleOwnButtonPositioning, true);
  }

  function startManualObserver() {
    if (!current() || !manualEnabled || observer) return;
    decorateExistingBindings();
    observer = new MutationObserver(() => {
      if (!manualEnabled) return;
      const currentKey = conversationKeyFromLocation();
      if (manualConversationKey !== currentKey) {
        void syncAllState();
        return;
      }
      scheduleManualRescan();
    });
    const observerRoot = document.querySelector("main") || document.body || document.documentElement;
    observer.observe(observerRoot, { childList: true, subtree: true, characterData: true });
    window.addEventListener("scroll", scheduleOwnButtonPositioning, true);
    window.addEventListener("resize", scheduleOwnButtonPositioning, true);
  }

  function applyManualMode(enabled, conversationKey = conversationKeyFromLocation()) {
    if (!current()) return false;
    const next = enabled === true;
    const key = conversationKey || conversationKeyFromLocation();
    if (!key) {
      stopManualObserver();
      manualConversationKey = null;
      return false;
    }
    if (manualConversationKey && manualConversationKey !== key) stopManualObserver();
    manualConversationKey = String(key);
    if (next) {
      if (manualEnabled && observer) { decorateExistingBindings(); return true; }
      manualEnabled = true;
      manualBridgeReady = true;
      startManualObserver();
    } else {
      if (!manualEnabled && !observer && OWN_BUTTONS.size === 0) return true;
      stopManualObserver();
      manualConversationKey = String(key);
    }
    console.info(`[Wildberries Bridge ${VERSION}] manual mode ${next ? "ON" : "OFF"} for ${key}`);
    return true;
  }

  async function syncManualState() {
    const key = conversationKeyFromLocation();
    if (!key) {
      applyManualMode(false, null);
      return { ok: false, code: "CONVERSATION_NOT_CONFIRMED" };
    }
    const response = await sendRuntime("WB_GET_MANUAL_STATE", { conversation_key: key });
    if (!current()) return superseded();
    applyManualMode(response?.ok && response.enabled === true, key);
    setManualBridgeReady(response?.manual_operation_active !== true);
    return response;
  }

  function insideAssistantEditor(node) {
    return Boolean(node?.closest?.('section[data-turn="assistant"], [data-message-author-role="assistant"], [data-writing-block], [data-writing-block-id], #code-block-viewer'));
  }

  function composerContextFromNode(node) {
    if (!(node instanceof HTMLElement) || !visible(node) || insideAssistantEditor(node)) return null;
    const form = node.closest("form");
    if (!form || insideAssistantEditor(form)) return null;
    return { composer: node, form };
  }

  function primaryComposerContext() {
    return currentAIAdapter()?.composerContext() || null;
  }

  function composerText(composer) {
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) return composer.value || "";
    return composer.textContent || "";
  }

  function setComposerText(composer, text) {
    assertCurrent();
    composer.focus();
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(composer), "value");
      const setter = descriptor?.set;
      if (!setter) throw new Error("Composer value setter unavailable.");
      setter.call(composer, text);
    } else {
      composer.textContent = text;
    }
    composer.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    composer.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function buttonToken(button) {
    return [button.getAttribute("data-testid") || "", button.getAttribute("aria-label") || "", button.getAttribute("title") || "", button.getAttribute("name") || "", button.getAttribute("type") || "", button.textContent || ""].join(" ").toLowerCase();
  }

  function manualButtonSignature(button) {
    const testid = button.getAttribute("data-testid") || "";
    const aria = button.getAttribute("aria-label") || "";
    const title = button.getAttribute("title") || "";
    const name = button.getAttribute("name") || "";
    return {
      kind: "bb2_manual_send_button_v1",
      tag: button.tagName.toLowerCase(),
      testid, aria, title, name,
      type: button.getAttribute("type") || "",
      text_hint: (testid || aria || title || name) ? "" : canonicalText(button.textContent || "").slice(0, 120),
      form_index: null
    };
  }

  function signatureMatchesButton(profile, button) {
    if (!profile || profile.kind !== "bb2_manual_send_button_v1" || !(button instanceof HTMLElement)) return false;
    if (profile.tag && button.tagName.toLowerCase() !== profile.tag) return false;
    for (const [key, attribute] of [["testid", "data-testid"], ["aria", "aria-label"], ["title", "title"], ["name", "name"], ["type", "type"]]) {
      if (profile[key] && (button.getAttribute(attribute) || "") !== profile[key]) return false;
    }
    if (profile.text_hint && canonicalText(button.textContent || "").slice(0, 120) !== profile.text_hint) return false;
    return true;
  }

  function manualSendButton(context) {
    if (!sendButtonProfile || !context?.form) return null;
    const candidates = [...context.form.querySelectorAll('button, [role="button"], input[type="submit"]')]
      .filter((button) => signatureMatchesButton(sendButtonProfile, button))
      .filter((button) => visible(button) && !insideAssistantEditor(button))
      .filter((button) => !(button instanceof HTMLButtonElement && button.disabled) && button.getAttribute("aria-disabled") !== "true");
    if (candidates.length === 1) return candidates[0];
    if (Number.isInteger(sendButtonProfile.form_index)) {
      const all = [...context.form.querySelectorAll('button, [role="button"], input[type="submit"]')];
      const indexed = all[sendButtonProfile.form_index] || null;
      if (indexed && candidates.includes(indexed)) return indexed;
    }
    return null;
  }

  function sendButtonCandidates(context) {
    const a=currentAIAdapter();if(!a)return [];
    const strategy=WBAIDeliveryCapabilities.profile(a.id)?.composer_control_strategy;
    if(!['legacy_microphone_completion_v1','adapter_explicit_ready_v1'].includes(strategy))return [];
    if(strategy==='legacy_microphone_completion_v1' && sendButtonProfile){const b=manualSendButton(context);if(b)return [{button:b,score:3000}];}
    return a.sendButtonCandidates(context);
  }

  function sendButton(context) {
    const a=currentAIAdapter();if(!a)return null;
    const strategy=WBAIDeliveryCapabilities.profile(a.id)?.composer_control_strategy;
    if(!['legacy_microphone_completion_v1','adapter_explicit_ready_v1'].includes(strategy))return null;
    if(strategy==='legacy_microphone_completion_v1' && sendButtonProfile){const b=manualSendButton(context);if(b)return b;}
    return a.sendButton(context);
  }

  function sendButtonFingerprint(button) {
    if (!(button instanceof HTMLElement)) return "";
    return [
      button.tagName,
      button.getAttribute("data-testid") || "",
      button.getAttribute("aria-label") || "",
      button.getAttribute("title") || "",
      button.getAttribute("type") || "",
      button.getAttribute("name") || ""
    ].join("|");
  }

  function composerSendDeps() {
    const key = conversationKeyFromLocation();
    return { resolveContext: () => { assertConversation(key); return primaryComposerContext(); }, resolveButton: sendButton, candidateButtons: sendButtonCandidates, visible, readComposerText: composerText, fingerprint: sendButtonFingerprint, sleep };
  }

  async function waitForStableSendTarget(timeoutMs = 10000, expectedText = null) {
    return BB2ComposerSend.waitForValidatedTarget({
      expectedText,
      timeoutMs,
      sampleIntervalMs: SEND_TARGET_SAMPLE_INTERVAL_MS,
      requiredStableSamples: SEND_TARGET_STABLE_SAMPLES,
      deps: composerSendDeps()
    });
  }

  async function stabilizeComposerForSend(expectedText, area, details = {}) {
    const startedAt = Date.now();
    const minimumReadyAt = startedAt + SEND_RENDER_WAIT_MS;
    const deadline = startedAt + Math.max(8000, SEND_RENDER_WAIT_MS + 4000);
    let stableSamples = 0;
    let lastComposer = null;
    recordContentDiagnostic(`${area}_COMPOSER_STABILIZATION_STARTED`, { ...details, minimum_wait_ms: SEND_RENDER_WAIT_MS });
    while (Date.now() < deadline) {
      assertCurrent();
      const context = primaryComposerContext();
      const exactText = Boolean(context) && normalizedDeliveryText(composerText(context.composer)) === normalizedDeliveryText(expectedText);
      if (context && exactText && context.composer.isConnected && (context.root || context.form)?.isConnected) {
        stableSamples = context.composer === lastComposer ? stableSamples + 1 : 1;
        lastComposer = context.composer;
        if (Date.now() >= minimumReadyAt && stableSamples >= SEND_TARGET_STABLE_SAMPLES) {
          recordContentDiagnostic(`${area}_COMPOSER_STABILIZED`, { ...details, elapsed_ms: Date.now() - startedAt, stable_samples: stableSamples, composer_tag: context.composer.tagName, contenteditable: context.composer.getAttribute("contenteditable") || null });
          return context;
        }
      } else {
        stableSamples = 0;
        lastComposer = null;
      }
      await sleep(SEND_TARGET_SAMPLE_INTERVAL_MS);
    }
    recordContentDiagnostic(`${area}_COMPOSER_STABILIZATION_FAILED`, { ...details, elapsed_ms: Date.now() - startedAt, composer_present: Boolean(primaryComposerContext()) });
    throw new Error("Нижнее поле ChatGPT не подтвердило устойчивое состояние после программной вставки текста.");
  }

  async function clickComposerUntilEmpty({area,runId,details={}}) {
    const key=conversationKeyFromLocation();assertConversation(key);
    const c=primaryComposerContext();const expected=c?composerText(c.composer):null;
    if(!expected) return {composer_empty:true,click_attempts:0};
    const target=await waitForStableSendTarget(15000,expected);
    assertConversation(key);
    if(!target)throw Object.assign(new Error('Send remains blocked; no click performed.'),{code:'SEND_TARGET_TIMEOUT'});
    const result=BB2ComposerSend.clickSynchronously({target,expectedText:expected,deps:composerSendDeps(),beforeClick(snapshot){assertConversation(key);recordContentDiagnostic(area+'_PRE_SEND_SNAPSHOT',{...details,run_id:runId,...snapshot});}});
    const deadline=Date.now()+12000;
    while(Date.now()<deadline){assertConversation(key);const currentContext=primaryComposerContext();if(currentContext && !composerText(currentContext.composer).trim())return {composer_empty:true,click_attempts:1};await sleep(120);}
    throw Object.assign(new Error('Send outcome not confirmed; automatic second click forbidden.'),{code:'SEND_OUTCOME_UNKNOWN_NO_RETRY'});
  }

  async function waitForMatchingNewUserTurn(baselineIds, expectedText, requestId = "", timeoutMs = 15000) {
    const baseline = baselineIds instanceof Set ? baselineIds : new Set(baselineIds || []);
    const deadline = Date.now() + timeoutMs;
    while (current() && Date.now() < deadline) {
      const next = matchingNewUserTurn(baseline, expectedText, requestId);
      if (next) return next;
      await sleep(150);
    }
    return null;
  }

  async function waitForComposerEmpty(timeoutMs = 7000) {
    const deadline = Date.now() + timeoutMs;
    while (current() && Date.now() < deadline) {
      const context = primaryComposerContext();
      if (context && !canonicalText(composerText(context.composer))) return true;
      await sleep(120);
    }
    return false;
  }

  const fileDelivery=WBFileDelivery.create({request:sendRuntime,adapter:currentAIAdapter,current:()=>current(),scopeValid:key=>key===conversationKeyFromLocation(),runtimeGeneration:()=>runtime.generation,actorId:()=>runtimeId,sleep});
  let workPanel=null;
  function showWork(work) {
    const key = work?.conversation_key;
    if (!current() || !key || key !== conversationKeyFromLocation()) return false;
    const revision = Number(work.revision);
    if (manualConversationKey === key && Number.isFinite(revision) && revision < workVisibilityRevision) return false;
    workVisibilityRevision = Number.isFinite(revision) ? revision : workVisibilityRevision;
    return applyManualMode(work.state === "active_visible", key);
  }
  // The worker owns Start; this layer may stage/click only after its durable commit.
  const workStartWatches=new Map(),workStartSends=new Set(),workStartCancelled=new Set();
  function workStartScope(p,{beforeClick=false}={}){
    assertCurrent();if(workStartCancelled.has(`${p.intent_id}:${p.revision}`))throw Object.assign(new Error('Work Start cancelled'),{code:'WORK_START_CANCELLED'});const id=conversationIdentity();
    if(p.origin!==id.origin||p.ai_id!==id.ai_id)throw Object.assign(new Error('Work Start surface changed'),{code:'WORK_PENDING_IDENTITY_MISMATCH'});
    const expected=p.expected_conversation_id||p.conversation_id||null;
    if(expected&&expected!==id.conversation_id)throw Object.assign(new Error('Work Start conversation changed'),{code:'WORK_PENDING_CONVERSATION_CHANGED'});
    if(beforeClick&&!expected&&id.conversation_id)throw Object.assign(new Error('New chat identity changed before Send'),{code:'WORK_PENDING_CONVERSATION_CHANGED'});
    if(p.runtime_generation&&p.runtime_generation!==runtime.generation)throw Object.assign(new Error('Old Work Start generation'),{code:'WORK_START_GENERATION_MISMATCH'});
    return id;
  }
  function stopWorkStartWatch(key){const w=workStartWatches.get(key);if(w)clearInterval(w.timer);workStartWatches.delete(key);}
  async function workStartProof(p){
    workStartScope(p);const before=conversationKeyFromLocation(),sections=turnSections();
    const baseUsers=new Set(p.baseline_user_turn_ids||[]),baseAssistants=new Set(p.assistant_baseline_ids||[]);
    const matches=[];
    for(const section of sections){if(roleOf(section)!=='user'||baseUsers.has(turnId(section)))continue;
      if(p.user_turn_id&&turnId(section)!==p.user_turn_id)continue;
      const raw=normalizedDeliveryText(userMessageText(section));
      if(await sha256Hex(raw)===p.prompt_sha256){
        workStartScope(p);if(before!==conversationKeyFromLocation()||!section.isConnected||normalizedDeliveryText(userMessageText(section))!==raw)throw Object.assign(new Error('Work proof changed during await'),{code:'WORK_START_PROOF_INVALID'});
        matches.push(section);
      }
    }
    const user=matches.length===1?matches[0]:null;let response=null;
    if(user){for(const section of sections.slice(sections.indexOf(user)+1)){
      if(roleOf(section)==='user'){response=null;break;}
      if(roleOf(section)==='assistant'&&!baseAssistants.has(turnId(section)))response=section;
    }}
    const adapter=currentAIAdapter(),complete=Boolean(response&&adapter?.messageComplete(response)&&!adapter.isGenerating()&&!response.matches('[aria-busy="true"],[data-is-streaming="true"]')&&!response.querySelector('[aria-busy="true"],[data-is-streaming="true"]'));
    return {ok:true,identity:conversationIdentity(),runtime_generation:runtime.generation,matched:Boolean(user),user_turn_id:user?turnId(user):null,complete,assistant_turn_id:complete?turnId(response):null};
  }
  function startWorkStartResponseWatch(p){
    workStartScope(p);const key=`${p.intent_id}:${p.revision}`;if(workStartWatches.has(key))return true;
    const w={p,busy:false,timer:null};
    w.timer=setInterval(()=>{if(w.busy)return;w.busy=true;void(async()=>{
      if(!current()){stopWorkStartWatch(key);return;}
      workStartScope(p);
      if(Date.now()>=Date.parse(p.expires_at)){
        stopWorkStartWatch(key);await sendRuntime('WB_WORK_PENDING_TIMEOUT',{...p,identity:conversationIdentity(),runtime_generation:runtime.generation});return;
      }
      const v=await workStartProof(p);workStartScope(p);
      if(v.matched&&p.send_outcome!=='sent_acknowledged'){
        // Reconcile late DOM proof only. This path never inserts or clicks.
        const recovered=await sendRuntime('WB_WORK_START_RECOVER',{identity:conversationIdentity(),runtime_generation:runtime.generation});
        workStartScope(p);
        if(!recovered?.ok||!recovered.work_start_watch)return;
        Object.assign(p,recovered.work_start_watch);workStartScope(p);
      }
      if(!v.complete||p.send_outcome!=='sent_acknowledged')return;
      const r=await sendRuntime('WB_WORK_PENDING_IDENTITY',{...p,identity:conversationIdentity(),runtime_generation:runtime.generation,first_response_complete:true,assistant_turn_id:v.assistant_turn_id});
      workStartScope(p);if(!r?.waiting){stopWorkStartWatch(key);if(r?.work)showWork(r.work);}
    })().catch(e=>{stopWorkStartWatch(key);recordContentDiagnostic('WORK_START_WATCH_FAILED',{code:e.code||'WORK_START_WATCH_FAILED'});}).finally(()=>{w.busy=false;});},500);
    workStartWatches.set(key,w);return true;
  }
  async function rehydrateWorkStart(){
    const r=await sendRuntime('WB_WORK_START_RECOVER',{identity:conversationIdentity(),runtime_generation:runtime.generation});
    if(!current())return;if(r?.ok&&r.work_start_watch)startWorkStartResponseWatch(r.work_start_watch);
  }
  async function sendWorkSessionPrompt(p){
    const key=`${p.intent_id}:${p.revision}`;if(workStartSends.has(key))return {ok:true,sent:false,committed_elsewhere:true};
    workStartSends.add(key);let committed=false,clickObserved=false;const assistantBaseline=assistantTurnIds(),userBaseline=userTurnIds();
    const outcome=(empty,user)=>sendRuntime('WB_WORK_START_SEND_OUTCOME',{intent_id:p.intent_id,revision:p.revision,identity:conversationIdentity(),actor_id:runtimeId,runtime_generation:runtime.generation,click_event_observed:clickObserved,composer_empty:empty,user_turn_id:user||null});
    try{
      workStartScope(p,{beforeClick:true});
      const text=String(p.prompt_text||''),context=primaryComposerContext();
      if(!context)throw Object.assign(new Error('Composer not ready'),{code:'COMPOSER_NOT_FOUND'});
      const old=normalizedDeliveryText(composerText(context.composer));
      if(old&&old!==normalizedDeliveryText(text))throw Object.assign(new Error('Composer contains unsent user text'),{code:'COMPOSER_CONTAINS_OTHER_TEXT'});
      if(!old)setComposerText(context.composer,text);
      const target=await waitForStableSendTarget(15000,text);workStartScope(p,{beforeClick:true});
      if(!target||primaryComposerContext()?.composer!==context.composer)throw Object.assign(new Error('Composer changed before Start'),{code:'WORK_START_SEND_TARGET_UNAVAILABLE'});
      const c=await sendRuntime('WB_WORK_START_COMMIT_REQUEST',{intent_id:p.intent_id,revision:p.revision,identity:conversationIdentity(),actor_id:runtimeId,runtime_generation:runtime.generation,assistant_baseline_ids:assistantBaseline,baseline_user_turn_ids:userBaseline});
      workStartScope(p,{beforeClick:true});
      if(!c?.ok||c.committed!==true)throw Object.assign(new Error('Start commit rejected'),{code:c?.code||'WORK_START_COMMIT_REJECTED'});
      committed=true;if(c.click_allowed!==true)return {ok:true,sent:false,committed_elsewhere:true,intent_id:p.intent_id,revision:p.revision};
      const clicked=BB2ComposerSend.clickSynchronously({target,expectedText:text,deps:composerSendDeps(),beforeClick(){workStartScope(p,{beforeClick:true});if(primaryComposerContext()?.composer!==context.composer)throw Object.assign(new Error('Composer replaced'),{code:'WORK_START_COMPOSER_REPLACED'});}});
      clickObserved=clicked.click_event_observed===true;
      const deadline=Math.min(Date.parse(p.expires_at),Date.now()+12000);let user=null,empty=false;
      while(current()&&Date.now()<deadline){
        workStartScope(p);user=matchingNewUserTurn(new Set(userBaseline),text);const live=primaryComposerContext();empty=Boolean(live&&!canonicalText(composerText(live.composer)));
        if(user&&empty)break;await sleep(120);
      }
      workStartScope(p);const ack=await outcome(empty,user);workStartScope(p);
      if(!ack?.ok||ack.send_outcome!=='sent_acknowledged')throw Object.assign(new Error('Start Send is not confirmed; no automatic retry'),{code:ack?.code||'WORK_START_SEND_OUTCOME_UNKNOWN_NO_RETRY',click_event_observed:clickObserved,outcome_recorded:true});
      if(ack.pending_start){const s=ack.pending_start;startWorkStartResponseWatch({intent_id:s.intent_id,revision:s.revision,origin:s.origin,ai_id:s.ai_id,conversation_id:s.observed_conversation_id,prompt_sha256:s.prompt_sha256,baseline_user_turn_ids:s.baseline_user_turn_ids,assistant_baseline_ids:s.assistant_baseline_ids,runtime_generation:s.watch_generation,expires_at:s.expires_at,user_turn_id:s.user_turn_id,send_outcome:s.send_outcome});}
      return {ok:true,sent:true,intent_id:p.intent_id,revision:p.revision};
    }catch(e){
      clickObserved=clickObserved||e.click_event_observed===true;
      if(committed&&!e.outcome_recorded&&current())await outcome(false,null).catch(()=>null);
      return {ok:false,code:e.code||'WORK_START_SEND_FAILED',intent_id:p.intent_id,revision:p.revision,click_event_observed:clickObserved};
    }finally{workStartSends.delete(key);}
  }

  async function bootstrapContext(){
    const startHref=location.href;
    const startIdentity=conversationIdentity();
    const response=await sendRuntime('WB_BOOTSTRAP_STATE',{});
    if(!current() || location.href!==startHref)return;
    const nowIdentity=conversationIdentity();
    const sameStartIdentity=String(nowIdentity?.origin||'')===String(startIdentity?.origin||'') &&
      String(nowIdentity?.conversation_id||'')===String(startIdentity?.conversation_id||'') &&
      String(nowIdentity?.status||'')===String(startIdentity?.status||'');
    if(!sameStartIdentity)return;
    if(response?.pending && typeof response.prompt==='string'){
      // The worker also returns the bootstrap owner. Revalidate it after the
      // asynchronous boundary before touching a composer in an SPA.
      if(response.origin && response.origin!==location.origin)return;
      if(response.ai_id && currentAIAdapter()?.id!==response.ai_id)return;
      const context=primaryComposerContext();
      if(context && !canonicalText(composerText(context.composer))){
        setComposerText(context.composer,response.prompt);
        toast('WB: стартовый текст подготовлен. Отправьте его; привязка появится после подтверждения нового диалога.','success',8000);
      }
    }
  }
  let deliveryQueue=Promise.resolve();
  const activeDeliveries=new Map();
  const composerWaiters=new Map();let composerWaitObserver=null,composerWakeQueued=false;
  function clearComposerWaiters(){composerWaiters.clear();composerWaitObserver?.disconnect();composerWaitObserver=null;clearToast('manual-composer-wait');}
  function wakeComposerWaiters(){
    if(composerWakeQueued||!composerWaiters.size)return;composerWakeQueued=true;
    queueMicrotask(()=>{
      composerWakeQueued=false;let wake=false;
      for(const [id,w] of composerWaiters){
        if(!current()||runtime.generation!==w.generation||conversationKeyFromLocation()!==w.conversation_key||!manualEnabled){composerWaiters.delete(id);continue;}
        const c=primaryComposerContext();
        if(!activeDeliveries.has(id)&&c&&!canonicalText(composerText(c.composer))){composerWaiters.delete(id);wake=true;}
      }
      if(!composerWaiters.size){composerWaitObserver?.disconnect();composerWaitObserver=null;clearToast('manual-composer-wait');}
      // Fetch only the durable owner state. Recovery revalidates account, lease,
      // generation and commit phase before touching the composer or attachment.
      if(wake)void syncAllState({force:true}).catch(()=>null);
    });
  }
  function registerComposerWait(conversationKey,deliveryId,generation){
    composerWaiters.set(deliveryId,{conversation_key:conversationKey,generation});
    if(!composerWaitObserver){composerWaitObserver=new MutationObserver(wakeComposerWaiters);composerWaitObserver.observe(document.body||document.documentElement,{childList:true,subtree:true,characterData:true});}
    toast('Очистите поле ввода, чтобы получить сохранённый отчёт. Запрос WB повторяться не будет.','info',0,'manual-composer-wait');
    recordContentDiagnostic('MANUAL_COMPOSER_WAIT_STARTED',{conversation_key:conversationKey,delivery_id:deliveryId,provider_replayed:false});
  }
  listenOwned(document,'input',wakeComposerWaiters,true);
  function deliverReport(reportText,autoSend,options={}){
    const id=options.deliveryId;if(activeDeliveries.has(id))return activeDeliveries.get(id);
    const job=deliveryQueue.then(()=>deliverReportCore(reportText,autoSend,options)).catch(error=>{
      if(error.code==='DELIVERY_WORK_NOT_VISIBLE')return {waiting_for_composer_clear:true,visibility_suspended:true};
      throw error;
    });
    activeDeliveries.set(id,job);deliveryQueue=job.catch(()=>{});
    job.finally(()=>{if(activeDeliveries.get(id)===job)activeDeliveries.delete(id);wakeComposerWaiters();}).catch(()=>{});return job;
  }
  async function deliverReportCore(reportText,autoSend,{runId='manual',deliveryId='',requestId='',conversationKey=''}={}){
    const generation=runtime.generation,visibilityRevision=workVisibilityRevision;const valid=()=>{assertConversation(conversationKey);if(runtime.generation!==generation)throw Object.assign(new Error('Delivery runtime changed.'),{code:'DELIVERY_RUNTIME_SUPERSEDED'});if(!manualEnabled&&workVisibilityRevision!==visibilityRevision)throw Object.assign(new Error('Work delivery paused.'),{code:'DELIVERY_WORK_NOT_VISIBLE'});};valid();
    const prepared=await sendRuntime('WB_DELIVERY_PREPARE',{conversation_key:conversationKey,delivery_id:deliveryId,baseline_user_turn_ids:userTurnIds(),assistant_baseline_ids:assistantTurnIds()});valid();
    if(!prepared?.ok)throw Object.assign(new Error('Подготовка сохранённого результата не удалась.'),{code:prepared?.code||'DELIVERY_PREPARE_FAILED'});
    reportText=prepared.text;autoSend=autoSend&&prepared.auto_send!==false;
    const baseline=new Set(prepared.baseline_user_turn_ids||[]),assistant=prepared.assistant_baseline_ids||[];
    const message={conversation_key:conversationKey,delivery_id:deliveryId,lease_id:prepared.lease_id};
    const result=(user=null,extra={})=>({sent:false,delivery_confirmed:Boolean(user),confirmed_user_turn_id:user,click_attempts:0,composer_empty:!composerText(primaryComposerContext()?.composer),baseline_user_turn_ids:[...baseline],assistant_baseline_ids:assistant,...extra});
    const proof=()=>{valid();return matchingNewUserTurn(baseline,reportText,requestId)};
    const existing=proof();
    if(existing&&(prepared.delivery_staged||prepared.insert_state==='committed'||prepared.insert_state==='staged'))return result(existing);
    if(prepared.delivery_paused)return result(null,{waiting_for_composer_clear:true,visibility_suspended:true});
    if(['committed','sent','unknown_no_retry'].includes(prepared.send_state)){
      const deadline=Date.now()+3000;let user=null;
      while(Date.now()<deadline){if(user=proof())break;await sleep(150)}valid();
      if(!user)toast('Wildberries: отправка была зафиксирована, но сообщение пока не подтверждено. Повтор Send и WB запрещён; результат сохранён.','error',0,'operation-state');
      return result(user,{reconcile_only:true});
    }
    // A previous insert permit may have been consumed before a channel or page
    // restart. Reconcile its existing draft/user turn; never insert it again.
    if(prepared.insert_state&&prepared.insert_state!=='pending'){
      const c=primaryComposerContext(),sameDraft=c&&canonicalText(composerText(c.composer))===canonicalText(reportText)&&c.composer.getAttribute(STAGE_DELIVERY_ATTR)===deliveryId;
      if(!sameDraft){toast('Wildberries: исход предыдущей вставки не подтверждён. Результат сохранён; повторная вставка и запрос WB запрещены.','error',0,'operation-state');return result(null,{reconcile_only:true,insertion_outcome_unknown:true});}
    }
    let context=null;const until=Date.now()+(prepared.options?.composer_wait_ms||30000);
    while(Date.now()<until){valid();const next=primaryComposerContext(),text=next?canonicalText(composerText(next.composer)):'';
      if(next&&(!text||text===canonicalText(reportText))){context=next;break}await sleep(150);
    }
    if(!context){valid();registerComposerWait(conversationKey,deliveryId,generation);return result(null,{waiting_for_composer_clear:true});}
    const sameComposer=()=>{valid();const c=primaryComposerContext();if(!c||c.composer!==context.composer||c.root!==context.root)throw Object.assign(new Error('Composer replaced.'),{code:'DELIVERY_COMPOSER_CHANGED'});};
    const sameAttachments=()=>{sameComposer();if(prepared.files?.length&&currentAIAdapter()?.attachmentReady(prepared.files)!==true)throw Object.assign(new Error('Вложение изменилось до отправки. Файл и результат сохранены.'),{code:'DELIVERY_ATTACHMENT_CHANGED_BEFORE_SEND'});};
    if(prepared.files?.length){
      try{await fileDelivery.attach(prepared.files,{conversationKey,deliveryId,leaseId:prepared.lease_id,timeoutMs:prepared.options?.attachment_wait_ms||30000,previouslyAttached:prepared.attachment_phase==='attached',attachmentPhase:prepared.attachment_phase});}
      catch(error){
        if(error.code==='DELIVERY_WORK_NOT_VISIBLE')throw error;
        sameComposer();
        const fallback=await sendRuntime('WB_DELIVERY_ATTACHMENT_FAILED',{...message,code:error.code||'ATTACHMENT_DELIVERY_FAILED'});sameComposer();
        // Worker permits this only before any attachment/Send commit. Reprepare
        // the same owned result as text; no file application/provider replay.
        if(fallback?.text_fallback===true)return deliverReportCore(reportText,autoSend,{runId,deliveryId,requestId,conversationKey});
        throw error;
      }
    }sameComposer();
    const text=canonicalText(composerText(context.composer));
    if(text&&text!==canonicalText(reportText))throw Object.assign(new Error('Текст пользователя сохранён; доставка ожидает свободное поле.'),{code:'COMPOSER_USER_TEXT_PRESENT'});
    if(!prepared.insert_state||prepared.insert_state==='pending'){
      const insert=await sendRuntime('WB_DELIVERY_INSERT_COMMIT',message);sameComposer();
      if(!insert?.ok||insert.insert_allowed!==true)throw Object.assign(new Error('Вставка не получила подтверждённого разрешения. Результат сохранён.'),{code:insert?.code||'DELIVERY_INSERT_OUTCOME_UNKNOWN_NO_RETRY'});
      const freshText=canonicalText(composerText(context.composer));if(freshText&&freshText!==canonicalText(reportText))throw Object.assign(new Error('Черновик изменился до вставки. Результат сохранён.'),{code:'COMPOSER_USER_TEXT_PRESENT'});
    }
    if(!text)setComposerText(context.composer,reportText);
    context.composer.setAttribute(STAGE_ATTR,'1');context.composer.setAttribute(STAGE_DELIVERY_ATTR,deliveryId);
    const staged=await sendRuntime('WB_DELIVERY_STAGE',message);sameComposer();
    if(!staged?.ok)throw Object.assign(new Error('Вставка результата не подтверждена.'),{code:staged?.code||'DELIVERY_STAGE_FAILED'});
    if(!autoSend){toast('Wildberries: результат подготовлен. Нажмите Send вручную.','info',0,'operation-state');return result(null,{manual_staged:true});}
    await stabilizeComposerForSend(reportText,'DELIVERY',{run_id:runId,delivery_id:deliveryId});sameComposer();
    const target=await waitForStableSendTarget(10000,reportText);sameComposer();
    if(!target)throw Object.assign(new Error('Send пока недоступна. Результат сохранён.'),{code:'DELIVERY_SEND_TARGET_NOT_READY_BEFORE_COMMIT'});
    sameAttachments();
    const commit=await sendRuntime('WB_MANUAL_DELIVERY_COMMIT_REQUEST',message);sameComposer();
    if(!commit?.ok)throw Object.assign(new Error('Фиксация отправки не подтверждена.'),{code:commit?.code||'DELIVERY_COMMIT_REJECTED'});
    if(!commit.click_allowed)return result(null,{reconcile_only:true});
    // Re-validate the SAME composer, text and target synchronously after durable commit.
    try{BB2ComposerSend.clickSynchronously({target,expectedText:reportText,deps:composerSendDeps(),beforeClick(){sameAttachments();}});}
    catch(e){if(e.method_called===false&&e.click_event_observed===false){await sendRuntime('WB_DELIVERY_SEND_ROLLBACK',{...message,send_nonce:commit.send_nonce,method_called:false,click_event_observed:false});}throw e;}
    let user=null;const deadline=Date.now()+15000;
    while(Date.now()<deadline){if(user=proof())break;await sleep(150)}valid();
    const fresh=primaryComposerContext();if(fresh?.composer===context.composer&&!composerText(fresh.composer).trim()){fresh.composer.removeAttribute(STAGE_ATTR);fresh.composer.removeAttribute(STAGE_DELIVERY_ATTR);fresh.composer.removeAttribute('data-wb-file-delivery');}
    toast(user?'Wildberries: результат подтверждён в чате.':'Wildberries: сообщение пока не подтверждено. Результат сохранён; повтор Send и WB запрещён.',user?'success':'error',user?3500:0,'operation-state');
    return result(user,{sent:true,click_attempts:1});
  }
  async function reportLocalDeliveryError(error,key,operationId=''){
    assertConversation(key);const code=/^[A-Z0-9_]{1,100}$/.test(error?.code||'')?error.code:'BRIDGE_LOCAL_FAILURE';
    const r=await sendRuntime('WB_LOCAL_COMMAND_ERROR',{conversation_key:key,code,error_operation_id:operationId});assertConversation(key);
    if(r?.report_text&&r.manual_operation_id){
      // A diagnostic failing to deliver does not recursively create more diagnostics.
      return recoverManualDelivery({type:'manual_deliver',operation_id:r.manual_operation_id,delivery_id:r.delivery_id,request_id:r.request_id,outgoing_text:r.report_text,auto_send:r.auto_send,conversation_key:key,origin:location.origin,conversation_id:conversationIdentity().conversation_id});
    }
    const c=primaryComposerContext();if(c&&!canonicalText(composerText(c.composer))){
      setComposerText(c.composer,'WB_RESULT_V1\n'+JSON.stringify({bridge:'wildberries-llm-api-bridge',version:VERSION,bridge_error:true,operation:null,http_status:0,error:{code},delivery:{state:'manual_send_required_storage_unavailable',automatic_send:false},request_meta:{physical_request_count:null,external_request_executed:null,automatic_retry:false}}));
      toast('Wildberries: ошибка подготовлена в поле сообщения. Нажмите Send вручную; сохранение/подтверждение пока недоступно.','error',0,'operation-state');
    }
    return {ok:false,code};
  }

  async function sendAutoStart(messageText, runId, conversationKey = conversationKeyFromLocation()) {
    assertConversation(conversationKey);
    const initialContext = primaryComposerContext();
    if (!initialContext) throw Object.assign(new Error("Не найдено нижнее поле ChatGPT."), { code: "COMPOSER_NOT_FOUND" });
    const existing = canonicalText(composerText(initialContext.composer));
    if (existing && normalizedDeliveryText(existing) !== normalizedDeliveryText(messageText)) {
      throw Object.assign(new Error("Нижнее поле содержит неотправленный текст до подготовки команды запуска."), { code: "COMPOSER_CONTAINS_OTHER_TEXT" });
    }

    // Reference parity: Start confirmation is based on the committed Send making the composer empty.
    // Unlike result delivery, the happy path MUST NOT wait for or require a matching user-turn DOM record.
    const assistantBaselineIds = assistantTurnIds();
    if (!existing) setComposerText(initialContext.composer, messageText);
    recordContentDiagnostic(existing ? "START_TEXT_REUSED" : "START_TEXT_STAGED", { run_id: runId });

    await stabilizeComposerForSend(messageText, "START", { run_id: runId, reused_existing_text: Boolean(existing) });
    const preCommitTarget = await waitForStableSendTarget(10000, messageText);
    if (!preCommitTarget) throw Object.assign(new Error("Send-кнопка не готова до start commit."), { code: "START_SEND_TARGET_NOT_READY_BEFORE_COMMIT" });

    const commit = await sendRuntime("WB_AUTO_START_COMMIT_REQUEST", {
      run_id: runId,
      conversation_key: conversationKey,
      baseline_user_turn_ids: [],
      actor_id: runtimeId
    });
    if (!commit.ok || !commit.committed) throw Object.assign(new Error(commit.error || "Wildberries start commit rejected."), { code: commit.code || "START_COMMIT_REJECTED" });
    if (commit.click_allowed !== true) {
      recordContentDiagnostic("START_COMMITTED_BY_OTHER_RUNTIME", { run_id: runId, actor_id: runtimeId });
      return {
        committed: true,
        sent: false,
        committed_elsewhere: true,
        composer_empty: false,
        click_attempts: 0,
        assistant_baseline_ids: assistantBaselineIds,
        run_id: runId,
        identity: conversationIdentity()
      };
    }

    const sent = await clickComposerUntilEmpty({ area: "START", runId });
    toast("Wildberries Autorun: запуск отправлен. Жду новый WB_API_V1 block.", "success", 0, "autorun-state");
    return {
      committed: true,
      sent: true,
      composer_empty: sent.composer_empty === true,
      click_attempts: sent.click_attempts,
      assistant_baseline_ids: assistantBaselineIds,
      run_id: runId,
      identity: conversationIdentity()
    };
  }

  async function currentRecovery(conversationKey, runId) {
    const response = await sendRuntime("WB_GET_AUTO_RECOVERY", { conversation_key: conversationKey, run_id: runId });
    if (!response?.ok) return null;
    return response.recovery || null;
  }

  async function reconcileCommittedStart(recovery) {
    if (!recovery || !sameConversation(recovery.origin, recovery.conversation_id) || recovery.conversation_key !== conversationKeyFromLocation()) return false;
    const baseline = new Set(recovery.baseline_user_turn_ids || []);
    const confirmedUserTurnId = await waitForMatchingNewUserTurn(baseline, recovery.message_text || "", "", 8000);
    if (!confirmedUserTurnId) {
      recordContentDiagnostic("START_RECONCILIATION_PENDING", { run_id: recovery.run_id });
      toast("Wildberries Autorun: start уже committed, но соответствующий user-turn не найден. Повторный Send запрещён; оставляю run для reconciliation.", "error", 9000);
      return false;
    }
    const completion = await sendRuntime("WB_AUTO_START_COMPLETE", {
      run_id: recovery.run_id,
      conversation_key: recovery.conversation_key,
      actor_id: runtimeId,
      reconcile: true,
      start_confirmed: true,
      confirmed_user_turn_id: confirmedUserTurnId,
      composer_empty: true,
      click_attempts: 0,
      assistant_baseline_ids: assistantTurnIds()
    });
    if (!completion?.ok) throw Object.assign(new Error(completion?.error || "Start reconciliation rejected."), { code: completion?.code || "START_RECONCILIATION_REJECTED" });
    toast("Wildberries Autorun: ранее committed start подтверждён по существующему user-turn. Повторный Send не выполнялся.", "success", 7000);
    return true;
  }

  async function reconcileCommittedDelivery(recovery) {
    if (!recovery || !sameConversation(recovery.origin, recovery.conversation_id) || recovery.conversation_key !== conversationKeyFromLocation()) return false;
    await assertRecoveryTextIntegrity(recovery);
    const baseline = new Set(recovery.baseline_user_turn_ids || []);
    const confirmedUserTurnId = await waitForMatchingNewUserTurn(baseline, recovery.outgoing_text || "", recovery.request_id || "", 8000);
    if (!confirmedUserTurnId) {
      recordContentDiagnostic("DELIVERY_RECONCILIATION_PENDING", { run_id: recovery.run_id, delivery_id: recovery.delivery_id || null, request_id: recovery.request_id || null });
      toast("Wildberries Autorun: delivery уже committed, но matching user-turn пока не найден. Повторный Send и повторный Wildberries API запрещены; оставляю доставку для reconciliation.", "error", 9000);
      return false;
    }
    const completion = await sendRuntime("WB_AUTO_DELIVERY_COMPLETE", {
      run_id: recovery.run_id,
      conversation_key: recovery.conversation_key,
      delivery_confirmed: true,
      confirmed_user_turn_id: confirmedUserTurnId,
      composer_empty: true,
      click_attempts: 0,
      delivery_id: recovery.delivery_id,
      assistant_baseline_ids: assistantTurnIds()
    });
    if (!completion?.ok) throw Object.assign(new Error(completion?.error || "Delivery reconciliation rejected."), { code: completion?.code || "DELIVERY_RECONCILIATION_REJECTED" });
    toast("Wildberries Autorun: ранее committed результат подтверждён по существующему user-turn. Повторный Send/API не выполнялся.", "success", 7000);
    return true;
  }

  async function performClaimedDelivery(recovery) {
    if (!recovery || !sameConversation(recovery.origin, recovery.conversation_id) || recovery.conversation_key !== conversationKeyFromLocation()) {
      throw Object.assign(new Error("Recovery delivery адресована другому ChatGPT-диалогу."), { code: "CONVERSATION_MISMATCH" });
    }
    await assertRecoveryTextIntegrity(recovery);
    const delivery = await deliverReport(recovery.outgoing_text || "", true, {
      confirmUserTurn: true,
      runId: recovery.run_id,
      deliveryId: recovery.delivery_id,
      requestId: recovery.request_id || "",
      requireCommit: true,
      conversationKey: recovery.conversation_key
    });
    if (delivery.committed_elsewhere) {
      const latest = delivery.commit_recovery || await currentRecovery(recovery.conversation_key, recovery.run_id);
      if (latest?.type === "reconcile_delivery") await reconcileCommittedDelivery(latest);
      return { ok: true, committed_elsewhere: true };
    }
    if(delivery.manual_staged){
      const staged=await sendRuntime('WB_AUTO_DELIVERY_STAGED',{conversation_key:recovery.conversation_key,delivery_id:recovery.delivery_id,baseline_user_turn_ids:delivery.baseline_user_turn_ids,assistant_baseline_ids:delivery.assistant_baseline_ids});
      if(!staged?.ok)throw Object.assign(new Error('Не удалось сохранить ожидание ручной отправки.'),{code:staged?.code||'MANUAL_STAGE_FAILED'});
      return {ok:true,waiting_manual_send:true};
    }
    const completion = await sendRuntime("WB_AUTO_DELIVERY_COMPLETE", {
      run_id: recovery.run_id,
      conversation_key: recovery.conversation_key,
      delivery_confirmed: delivery.delivery_confirmed === true,
      confirmed_user_turn_id: delivery.confirmed_user_turn_id || null,
      composer_empty: delivery.composer_empty === true,
      click_attempts: Number(delivery.click_attempts || 0),
      delivery_id: recovery.delivery_id,
      assistant_baseline_ids: delivery.assistant_baseline_ids || assistantTurnIds()
    });
    if (!completion?.ok) throw Object.assign(new Error(completion?.error || "Не удалось подтвердить доставку."), { code: completion?.code || "DELIVERY_CONFIRMATION_REJECTED" });
    return { ok: true, completion };
  }

  async function recoverManualDelivery(recovery) {
    if (!recovery || recovery.type !== "manual_deliver" || !recovery.operation_id || !recovery.delivery_id) return { ok: false, code: "MANUAL_RECOVERY_INVALID" };
    if (recovery.conversation_key !== conversationKeyFromLocation() || !sameConversation(recovery.origin, recovery.conversation_id)) return { ok: false, code: "CONVERSATION_MISMATCH" };
    const key = `${recovery.operation_id}:${recovery.delivery_id}`;
    if (manualRecoveryInFlight.has(key)) return { ok: true, deduplicated: true };
    manualRecoveryInFlight.add(key);
    try {
      const delivery = await deliverReport(String(recovery.outgoing_text || ""), recovery.auto_send !== false, {
        confirmUserTurn: recovery.auto_send !== false,
        runId: `manual:${recovery.operation_id}`,
        deliveryId: recovery.delivery_id,
        requestId: recovery.request_id || "",
        requireCommit: false,
        conversationKey: recovery.conversation_key
      });
      if(delivery.waiting_for_composer_clear)return {ok:true,waiting_for_composer_clear:true};
      const completion = await sendRuntime("WB_MANUAL_DELIVERY_COMPLETE", {
        conversation_key: recovery.conversation_key,
        manual_operation_id: recovery.operation_id,
        delivery_confirmed: delivery.delivery_confirmed === true,
        confirmed_user_turn_id: delivery.confirmed_user_turn_id || null,
        composer_empty: delivery.composer_empty === true,
        click_attempts: Number(delivery.click_attempts || 0)
      });
      if (!completion?.ok) throw Object.assign(new Error(completion?.error || "Не удалось завершить recovered manual operation."), { code: completion?.code || "MANUAL_DELIVERY_COMPLETE_REJECTED" });
      if (delivery.delivery_confirmed) {
        await sendRuntime("WB_REPORT_DELIVERY_CONFIRMED", {
          conversation_key: recovery.conversation_key,
          report_prefix_applied: recovery.report_prefix_applied === true,
          delivery_id: recovery.delivery_id
        });
      }
      return { ok: true, completion };
    } catch (error) {
      await sendRuntime("WB_MANUAL_DELIVERY_FAILED", {
        conversation_key: recovery.conversation_key,
        manual_operation_id: recovery.operation_id,
        code: error.code || "MANUAL_DELIVERY_RECOVERY_FAILED",
        error: error.message || String(error)
      }).catch(() => null);
      throw error;
    } finally {
      manualRecoveryInFlight.delete(key);
    }
  }

  async function runRecoveryOnce(recovery, { propagate = false } = {}) {
    if (!recovery?.type || !recovery?.run_id) return { ok: false, code: "RECOVERY_INVALID" };
    const key = `${recovery.type}:${recovery.run_id}:${recovery.delivery_id || ""}`;
    if (recoveryInFlight.has(key)) return { ok: true, deduplicated: true };
    recoveryInFlight.add(key);
    try {
      if(recovery.type==='reconcile_manual_send'){
        const matched=matchingNewUserTurn(new Set(recovery.manual_baseline_users||[]),'',recovery.request_id);
        if(!matched)return {ok:true,waiting_manual_send:true};
        return await sendRuntime('WB_AUTO_MANUAL_SEND_CONFIRMED',{conversation_key:recovery.conversation_key,delivery_id:recovery.delivery_id,confirmed_user_turn_id:matched});
      }
      if (recovery.type === "dispatch_start") {
        const result = await sendAutoStart(String(recovery.message_text || ""), String(recovery.run_id || ""), String(recovery.conversation_key || ""));
        if (result.committed_elsewhere) {
          const latest = await currentRecovery(recovery.conversation_key, recovery.run_id);
          if (latest?.type === "reconcile_start") await reconcileCommittedStart(latest);
        }
        return { ok: true, handled: true };
      }
      if (recovery.type === "reconcile_start") return { ok: true, handled: await reconcileCommittedStart(recovery) };
      if (recovery.type === "deliver_claimed") {
        await performClaimedDelivery(recovery);
        return { ok: true, handled: true };
      }
      if (recovery.type === "reconcile_delivery") return { ok: true, handled: await reconcileCommittedDelivery(recovery) };
      if (recovery.type === "request_outcome_unknown") {
        toast("Wildberries Autorun: service worker перезапустился во время Wildberries request. Исход запроса неизвестен; автоматический повтор запрещён.", "error", 0, "autorun-state");
        return { ok: false, code: "REQUEST_OUTCOME_UNKNOWN" };
      }
      return { ok: false, code: "RECOVERY_UNSUPPORTED" };
    } catch (error) {
      recordContentDiagnostic("RECOVERY_FAILED", { run_id: recovery.run_id, type: recovery.type, code: error.code || "RECOVERY_FAILED", error: error.message || String(error) });
      toast(`Wildberries recovery: ${error.message}`, "error", 0, "autorun-state");
      if (propagate) throw error;
      return { ok: false, code: error.code || "RECOVERY_FAILED", error: error.message || String(error) };
    } finally {
      recoveryInFlight.delete(key);
    }
  }

  function stopAutoWatch(reason = "stopped") {
    const previous = activeAutoWatch;
    if (autoObserver) autoObserver.disconnect();
    autoObserver = null;
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = null;
    activeAutoWatch = null;
    autoFirstSeen = null;
    autoTickInFlight = false;
    if (reason) {
      console.info(`[Wildberries Bridge ${VERSION}] auto watch stopped: ${reason}`);
      if (previous) recordContentDiagnostic("PROMPT_WATCH_STOPPED", { run_id: previous.run_id, reason });
    }
  }

  function scheduleAutoTick(delay = 0) {
    if (!activeAutoWatch || autoTimer) return;
    autoTimer = setTimeout(() => {
      autoTimer = null;
      autoTick().catch((error) => {
        toast(`Wildberries Autorun: ошибка watcher — ${error.message}`, "error", 0, "autorun-state");
        stopAutoWatch("tick_error");
      });
    }, delay);
  }

  // Read only the admitted, completed assistant turn. Presentation blocks are
  // capture surfaces, not command boundaries; controls/hidden mirrors are omitted.
  function completedAssistantSource(section) {
    if (!(section instanceof Element) || !section.isConnected || roleOf(section) !== 'assistant') return {ok:false};
    if (currentAIAdapter()?.isGenerating() || section.matches('[aria-busy="true"], [data-is-streaming="true"]') || section.querySelector('[aria-busy="true"], [data-is-streaming="true"]')) return {ok:false};
    function read(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || '';
      if (!(node instanceof Element)) return '';
      if (node.matches('button,script,style,svg,[hidden],[aria-hidden="true"]')) return '';
      if (getComputedStyle(node).display === 'none' || getComputedStyle(node).visibility === 'hidden') return '';
      if (node.matches(CURRENT_ROOT_SELECTOR)) {
        const binding = bindingFromRoot(node);
        if (!binding) throw new Error('Ambiguous writing-block surface.');
        return '\n'+commandText(binding)+'\n';
      }
      if (node.tagName === 'PRE') {
        const binding = bindingFromRoot(node);
        return '\n'+(binding ? commandText(binding) : String(node.textContent || ''))+'\n';
      }
      if (node.tagName === 'BR') return '\n';
      const text = [...node.childNodes].map(read).join('');
      return /^(DIV|P|SECTION|LI|UL|OL|BLOCKQUOTE|H[1-6])$/.test(node.tagName) ? '\n'+text+'\n' : text;
    }
    try { return {ok:true,text:read(section).trim()}; } catch (_) { return {ok:false}; }
  }

  function candidateAfterAssistantBaseline(baselineIds, watchId) {
    const baseline = baselineIds instanceof Set ? baselineIds : new Set(baselineIds || []);
    const turns = turnSections();
    const assistant = turns.filter(s=>roleOf(s)==='assistant' && turnId(s) && !baseline.has(turnId(s))).at(-1);
    if (!assistant || turns.slice(turns.indexOf(assistant)+1).some(s=>roleOf(s)==='user')) return {waiting:true};
    const source = completedAssistantSource(assistant);
    if (!source.ok) return {waiting:true};
    const id = turnId(assistant);
    return {assistant_turn_id:id,prompt_text:source.text,copy_ready:true,copy_mode:'completed_assistant_source',writing_block:true,writing_block_id:null,structural_signature:[watchId,id,source.text].join('||')};
  }

  async function autoTick() {
    if (!current() || !activeAutoWatch || autoTickInFlight) return;
    autoTickInFlight = true;
    try {
      if (!sameConversation(activeAutoWatch.origin, activeAutoWatch.conversation_id) || conversationKeyFromLocation() !== activeAutoWatch.conversation_key) {
        stopAutoWatch("conversation_changed");
        return;
      }
      const candidate = candidateAfterAssistantBaseline(activeAutoWatch.assistant_baseline_ids, activeAutoWatch.watch_id);
      if (candidate.waiting) {
        autoFirstSeen = null;
        scheduleAutoTick(750);
        return;
      }
      if (!candidate.writing_block || !candidate.prompt_text || !candidate.copy_ready) {
        autoFirstSeen = null;
        scheduleAutoTick(750);
        return;
      }
      if (!WBCommandProtocol.hasCommands(candidate.prompt_text)) {
        // Autorun admits explicit envelopes from the whole completed assistant source.
        // No user turns or earlier-baseline turns are executed.
        autoFirstSeen = null;
        scheduleAutoTick(750);
        return;
      }
      if (!autoFirstSeen || autoFirstSeen.signature !== candidate.structural_signature) {
        autoFirstSeen = { signature: candidate.structural_signature, at: Date.now() };
        recordContentDiagnostic("PROMPT_CANDIDATE_STABILITY_STARTED", { run_id: activeAutoWatch.run_id, assistant_turn_id: candidate.assistant_turn_id, writing_block_id: candidate.writing_block_id || null, copy_mode: candidate.copy_mode || null });
        scheduleAutoTick(AUTO_PROMPT_STABILITY_MS);
        return;
      }
      const elapsed = Date.now() - autoFirstSeen.at;
      if (elapsed < AUTO_PROMPT_STABILITY_MS) {
        scheduleAutoTick(AUTO_PROMPT_STABILITY_MS - elapsed);
        return;
      }
      const section = turnSections().find((item) => turnId(item) === candidate.assistant_turn_id) || null;
      const localPayload = completedAssistantSource(section);
      if (!localPayload.ok || localPayload.text !== candidate.prompt_text) {
        autoFirstSeen = null;
        scheduleAutoTick(750);
        return;
      }
      let parsed;
      try { parsed = WBCommandProtocol.parse(localPayload.text); }
      catch (error) {
        toast(`Wildberries Autorun: блок WB_API_V1 невалиден — ${error.message}`, "error", 0, "autorun-state");
        stopAutoWatch("invalid_command");
        return;
      }
      recordContentDiagnostic("PROMPT_ACCEPTED", { run_id: activeAutoWatch.run_id, assistant_turn_id: candidate.assistant_turn_id, operation: parsed.operation, command_fingerprint: parsed.fingerprint });
      toast(`Wildberries Autorun: выполняю ${parsed.operation}.`, "info", 0, "autorun-state");
      const autorunContext = {
        run_id: activeAutoWatch.run_id,
        conversation_key: activeAutoWatch.conversation_key,
        origin: activeAutoWatch.origin,
        conversation_id: activeAutoWatch.conversation_id,
        watch_id: activeAutoWatch.watch_id
      };
      const response = await sendRuntime("WB_AUTO_COMMAND_READY", {
        run_id: autorunContext.run_id,
        conversation_key: autorunContext.conversation_key,
        watch_id: autorunContext.watch_id,
        assistant_turn_id: candidate.assistant_turn_id,
        command_text: localPayload.text,
        command_fingerprint: parsed.fingerprint
      });
      if (!response?.accepted) {
        if (response?.paused) stopAutoWatch("worker_paused");
        else if (response?.ignored) scheduleAutoTick(1000);
        else {
          toast(`Wildberries Autorun: ${response?.error || "команда не принята"}`, "error", 0, "autorun-state");
          stopAutoWatch("command_rejected");
        }
        return;
      }
      // Reference parity: once the command is accepted, the watcher stops.
      // Delivery is owned exclusively by the service worker single-flight cycle.
      stopAutoWatch("command_accepted");
    } finally {
      autoTickInFlight = false;
    }
  }

  function beginAutoWatch(message) {
    if (!current()) return false;
    stopAutoWatch("replaced");
    if (!sameConversation(message.origin, message.conversation_id)) return false;
    if (message.conversation_key !== conversationKeyFromLocation()) return false;
    // Fail-safe mutual exclusion: autorun watcher removes any stale manual Copy listeners before it can programmatically verify a local Copy control.
    applyManualMode(false, message.conversation_key);
    activeAutoWatch = {
      run_id: String(message.run_id || ""),
      conversation_key: String(message.conversation_key || ""),
      origin: String(message.origin || "").toLowerCase(),
      conversation_id: String(message.conversation_id || "").toLowerCase(),
      watch_id: String(message.watch_id || ""),
      assistant_baseline_ids: new Set(Array.isArray(message.assistant_baseline_ids) ? message.assistant_baseline_ids : [])
    };
    autoObserver = new MutationObserver(() => {
      if (!autoTimer) scheduleAutoTick(AUTO_PROMPT_DEBOUNCE_MS);
    });
    autoObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "class", "data-testid", "aria-label", "title"]
    });
    scheduleAutoTick(0);
    toast("Wildberries Autorun: жду следующую WB_API_V1 команду.", "success", 0, "autorun-state");
    recordContentDiagnostic("PROMPT_WATCH_STARTED", { run_id: activeAutoWatch.run_id, watch_id: activeAutoWatch.watch_id, assistant_baseline_count: activeAutoWatch.assistant_baseline_ids.size });
    console.info(`[Wildberries Bridge ${VERSION}] auto watch started for ${activeAutoWatch.run_id}`);
    return true;
  }

  async function syncAllState() {
    if (!current()) return superseded();
    await rehydrateWorkStart().catch(()=>null);
    if (!current()) return superseded();
    const here = conversationIdentity();
    if (here?.status !== "confirmed" || !here?.conversation_id) {
      void bootstrapContext().catch(()=>null);
      applyManualMode(false, null);
      stopAutoWatch("identity_not_confirmed");
      return { ok: false, code: here?.status === "conflict" ? "CONVERSATION_IDENTITY_CONFLICT" : "CONVERSATION_NOT_CONFIRMED" };
    }
    await bootstrapContext().catch(()=>null);
    if(!current())return superseded();
    const recovery=await sendRuntime('WB_WORK_RECOVERY_RESUME',{identity:here,runtime_id:runtimeId,runtime_generation:runtime.generation});
    if(!current())return superseded();
    if(recovery?.pending){applyManualMode(false,conversationKeyFromLocation());return recovery;}
    const work=await sendRuntime("WB_WORK_STATE",{conversation_key:conversationKeyFromLocation()});
    showWork(work?.work);
    const response = await sendRuntime("WB_CONTENT_READY", { identity: here });
    if (!current()) return superseded();
    const key = response?.conversation_key || conversationKeyFromLocation();
    applyManualMode(response?.ok && response.manual_mode === true, key);
    if (response?.ok && response.auto_watch?.status === "waiting_command") beginAutoWatch(response.auto_watch);
    else stopAutoWatch(response?.owner === false ? "duplicate_non_owner" : "sync_not_waiting");
    if (response?.ok && response.manual_operation_owner !== false && response.manual_recovery) {
      queueMicrotask(() => { void recoverManualDelivery(response.manual_recovery).catch((error) => {
        recordContentDiagnostic("MANUAL_DELIVERY_RECOVERY_FAILED", { operation_id: response.manual_recovery.operation_id || null, code: error.code || "MANUAL_DELIVERY_RECOVERY_FAILED", error: error.message || String(error) });
        toast(`Wildberries manual recovery: ${error.message}`, "error", 9000);
      }); });
    }
    if (response?.ok && response.owner !== false && response.recovery) {
      queueMicrotask(() => { void runRecoveryOnce(response.recovery); });
    }
    const pending=await sendRuntime('WB_LOCAL_RESULTS_PENDING',{conversation_key:key});
    if(current()&&pending?.ok)for(const item of pending.results||[])queueMicrotask(()=>{void recoverManualDelivery(item).catch(()=>null)});
    return response;
  }

  function restoreButtonPicker() {
    if (pickerState) {
      try {
        const active=primaryComposerContext();
        if(pickerState.conversation_key===conversationKeyFromLocation()&&active?.composer===pickerState.context.composer&&canonicalText(composerText(active.composer))===canonicalText(pickerState.test_text))setComposerText(active.composer,pickerState.original_text);
      } catch (_) {}
      pickerState = null;
    }
    copyPickerActive = false;
  }

  function startSendButtonPicker() {
    const context = primaryComposerContext();
    if (!context) throw new Error("Не найдено поле текущего AI.");
    restoreButtonPicker();
    pickerState = { context, original_text: composerText(context.composer),conversation_key:conversationKeyFromLocation(),generation:runtime.generation,test_text:"BRIDGE_BUTTON_TEST — это тест, сообщение не будет отправлено." };
    setComposerText(context.composer, pickerState.test_text);
    toast("Wildberries Bridge: нажмите нужную Send-кнопку в нижней форме. Клик будет перехвачен, тест не отправится.", "info", 9000);
  }

  function startCopyButtonPicker() {
    restoreButtonPicker();
    copyPickerActive = true;
    toast("Wildberries Bridge: нажмите локальную Copy-кнопку внутри writing/code block. Клик будет перехвачен только для выбора и не запустит API.", "info", 9000);
  }

  listenOwned(document, "pointerdown", (event) => {
    if (!pickerState && !copyPickerActive) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    suppressPickerClick = true;
    const button = event.target instanceof Element ? event.target.closest('button, [role="button"], input[type="submit"]') : null;

    if (copyPickerActive) {
      if (!(button instanceof HTMLButtonElement)) {
        toast("Wildberries Bridge: выберите именно локальную Copy-кнопку writing/code block.", "info", 7000);
        return;
      }
      const binding = bindingFromLocalCopyCandidate(button);
      if (!binding || isGenericAssistantCopy(button)) {
        toast("Wildberries Bridge: кнопка не привязана однозначно к одному локальному writing/code block. Общая «Копировать ответ» не подходит.", "info", 7000);
        return;
      }
      if (!commandText(binding)) {
        toast("Wildberries Bridge: тело выбранного блока не найдено или пусто.", "info", 7000);
        return;
      }
      const profile = copyButtonSignature(button, binding.adapter_id);
      sendRuntime("WB_SAVE_COPY_BUTTON_PROFILE", { profile }).then((response) => {
        if (!response.ok) throw new Error(response.error || "Не удалось сохранить Copy-кнопку.");
        replaceCopyButtonProfiles(response.profiles || profile, "picker_saved");
        restoreButtonPicker();
        toast(`Wildberries Bridge: Copy-кнопка добавлена; прежние варианты сохранены (${copyButtonProfiles.length} пользовательских).`, "success", 7000);
      }).catch((error) => {
        restoreButtonPicker();
        toast(`Wildberries Bridge: ${error.message}`, "error", 9000);
      });
      return;
    }

    const picking=pickerState,scope=picking.context.root||picking.context.form,live=primaryComposerContext();
    if(picking.conversation_key!==conversationKeyFromLocation()||picking.generation!==runtime.generation||live?.composer!==picking.context.composer){restoreButtonPicker();return;}
    if (!(button instanceof HTMLElement) || !scope?.contains(button)) {
      toast("Wildberries Bridge: выберите кнопку только в поле текущего AI.", "info", 7000);
      return;
    }
    const profile = manualButtonSignature(button);
    profile.form_index = [...scope.querySelectorAll('button, [role="button"], input[type="submit"]')].indexOf(button);
    sendRuntime("WB_SAVE_SEND_BUTTON_PROFILE", { profile }).then((response) => {
      if(!current()||pickerState!==picking||picking.conversation_key!==conversationKeyFromLocation()||picking.generation!==runtime.generation)return;
      if (!response.ok) throw new Error(response.error || "Не удалось сохранить Send-кнопку.");
      sendButtonProfile = profile;
      restoreButtonPicker();
      toast("Wildberries Bridge: Send-кнопка сохранена.", "success", 6000);
    }).catch((error) => {
      if(!current()||pickerState!==picking)return;
      restoreButtonPicker();
      toast(`Wildberries Bridge: ${error.message}`, "error", 9000);
    });
  }, true);

  listenOwned(document, "click", (event) => {
    if (!suppressPickerClick) return;
    suppressPickerClick = false;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }, true);

  listenOwned(document, "keydown", (event) => {
    if ((!pickerState && !copyPickerActive) || event.key !== "Escape") return;
    event.preventDefault();
    restoreButtonPicker();
    toast("Wildberries Bridge: выбор кнопки отменён.", "info", 5000);
  }, true);

  listenOwned(document,'click',event=>{
    if(!event.isTrusted)return;const context=primaryComposerContext(),button=context&&currentAIAdapter()?.sendButton(context);
    if(button&&(button===event.target||button.contains(event.target))){setTimeout(()=>{if(current())void syncAllState().catch(()=>null);},400);setTimeout(()=>{if(current())void syncAllState().catch(()=>null);},1200);}
  },true);
  runtimeMessageListener = (message, _sender, sendResponse) => {
    if (!current()) return false;
    if(message?.type==='WB_APPLY_AI_MODE'){
      if(message.origin!==location.origin||message.href!==location.href||message.runtime_id!==runtimeId||message.runtime_generation!==runtime.generation){sendResponse({ok:false,code:'TAB_AI_MODE_CONTEXT_INVALID'});return false;}
      if(!['auto',...WBAIDeliveryCapabilities.implementedTargetIds()].includes(message.ai_mode)){sendResponse({ok:false,code:'INVALID_RUNTIME_OPTIONS'});return false;}
      const before=currentAIAdapter()?.id||null;aiMode=message.ai_mode;aiModeRevision++;
      const after=currentAIAdapter()?.id||null,changed=before!==after;
      if(changed){
        runtime.generation='ai-mode-'+crypto.randomUUID();
        for(const key of [...workStartWatches.keys()])stopWorkStartWatch(key);
        fileDelivery.dispose();stopAutoWatch('tab_ai_mode_changed');stopManualObserver();
        applyManualMode(false,conversationKeyFromLocation());
        lastObservedConversationKey=conversationKeyFromLocation();
        queueMicrotask(()=>{if(current())void syncAllState().catch(()=>null);});
      }
      recordContentDiagnostic('AI_ADAPTER_SELECTION_CHANGED',{ai_mode:aiMode,adapter_id:after,adapter_changed:changed,scope:'tab'});
      sendResponse({ok:true,applied:true,ai_mode:aiMode,adapter_id:after,runtime_id:runtimeId,runtime_generation:runtime.generation});return false;
    }
    if(message?.type==='WB_CHECK_DELIVERY_STAGE'){
      const c=primaryComposerContext();const staged=message.conversation_key===conversationKeyFromLocation()&&message.runtime_generation===runtime.generation&&c&&c.composer.getAttribute(STAGE_DELIVERY_ATTR)===message.delivery_id&&canonicalText(composerText(c.composer))===canonicalText(message.text)&&(!(message.files||[]).length||currentAIAdapter()?.attachmentReady(message.files));
      sendResponse({ok:true,staged:Boolean(staged)});return false;
    }
    if(message?.type==='WB_CHECK_USER_DELIVERY'){
      const matched=message.conversation_key===conversationKeyFromLocation()&&(!message.runtime_generation||message.runtime_generation===runtime.generation)&&matchingNewUserTurn(new Set(message.baseline_user_turn_ids||[]),message.expected_text||'',message.request_id)===message.user_turn_id;
      sendResponse({ok:true,matched});return false;
    }
    if(message?.type==='WB_WORK_SEND_INITIAL_PROMPT'){sendWorkSessionPrompt(message).then(sendResponse);return true;}
    if(message?.type==='WB_WORK_START_CANCEL'){
      try{workStartScope(message);const key=`${message.intent_id}:${message.revision}`;workStartCancelled.add(key);stopWorkStartWatch(key);sendResponse({ok:true,cancelled:true});}
      catch(e){sendResponse({ok:false,code:e.code||'WORK_START_CANCEL_NOT_CONFIRMED'});}return false;
    }
    if(message?.type==='WB_WORK_START_PROOF'){workStartProof(message).then(sendResponse).catch(e=>sendResponse({ok:false,code:e.code||'WORK_START_PROOF_INVALID'}));return true;}
    if(message?.type==='WB_WORK_START_WATCH'){try{sendResponse({ok:true,started:startWorkStartResponseWatch(message)});}catch(e){sendResponse({ok:false,code:e.code||'WORK_START_WATCH_INVALID'});}return false;}
    if (message?.type === "WB_WORK_VISIBILITY") {
      const key = message.conversation_key || message.work?.conversation_key;
      if (!key || key !== conversationKeyFromLocation() || message.work?.conversation_key !== key) { sendResponse({ok:false,code:"CONVERSATION_MISMATCH"}); return false; }
      if(message.runtime_generation&&message.runtime_generation!==runtime.generation){sendResponse({ok:false,code:'WORK_REFRESH_GENERATION_MISMATCH'});return false;}
      const revision = Number(message.work?.revision);
      if (manualConversationKey === key && Number.isFinite(revision) && revision < workVisibilityRevision) { sendResponse({ok:false,code:"STALE_WORK_REVISION"}); return false; }
      workVisibilityRevision = Number.isFinite(revision) ? revision : workVisibilityRevision;
      applyManualMode(message.work?.state === "active_visible", key);
      if(message.work?.state!=='active_visible')clearComposerWaiters();
      showWork(message.work);
      if(message.work?.state==='active_visible')void syncAllState({force:true}).catch(()=>null);
      sendResponse({ok:true,applied:true});return false;
    }
    if (message?.type === "WB_DELIVERY_WAKE") {
      if(message.conversation_key!==conversationKeyFromLocation())return false;
      void syncAllState({force:true}).catch(()=>null);sendResponse({ok:true});return true;
    }
    if (message?.type === 'WB_WORK_RUNTIME_FREEZE') {
      if(message.conversation_key!==conversationKeyFromLocation()||message.old_runtime_id!==runtimeId){sendResponse({ok:false,code:'WORK_REFRESH_CONTEXT_INVALID'});return false;}
      runtime.recovery={id:message.recovery_id,revision:message.recovery_revision};
      applyManualMode(false,message.conversation_key);stopAutoWatch('work_refresh');
      sendResponse({ok:true,applied:true,runtime_id:runtimeId,runtime_generation:runtime.generation,assistant_baseline_ids:assistantTurnIds()});return false;
    }
    if (message?.type === 'WB_WORK_RUNTIME_RENEW') {
      if(message.conversation_key!==conversationKeyFromLocation()||message.visible!==false||typeof message.runtime_generation!=='string'||!message.runtime_generation||!Array.isArray(message.assistant_baseline_ids)) {sendResponse({ok:false,code:'WORK_REFRESH_CONTEXT_INVALID'});return false;}
      runtime.generation=message.runtime_generation;runtime.recovery={id:message.recovery_id,revision:message.recovery_revision,assistant_baseline_ids:[...message.assistant_baseline_ids]};
      applyManualMode(false,message.conversation_key);stopAutoWatch('work_refresh_renew');
      sendResponse({ok:true,applied:true,baseline_applied:true,identity:conversationIdentity(),runtime_id:runtimeId,runtime_generation:runtime.generation,recovery_id:message.recovery_id});return false;
    }
    if (message?.type === "WB_RUNTIME_REFRESH") {
      if(message.conversation_key!==conversationKeyFromLocation()||message.old_runtime_id!==runtimeId||runtime.recovery?.id!==message.recovery_id){sendResponse({ok:false,code:'WORK_REFRESH_CONTEXT_INVALID'});return false;}
      const ids=assistantTurnIds();sendResponse({ok:true,assistant_baseline_ids:ids,runtime_id:runtimeId});
      queueMicrotask(()=>{if(current())installWBContent();});return false;
    }
    if (message?.type === "WB_START_COPY_BUTTON_PICKER") {
      try { startCopyButtonPicker(); sendResponse({ ok: true }); }
      catch (error) { sendResponse({ ok: false, error: error.message, code: error.code || "CONTENT_ADAPTER_ERROR" }); }
      return false;
    }
    if (message?.type === "WB_START_SEND_BUTTON_PICKER") {
      try { startSendButtonPicker(); sendResponse({ ok: true }); }
      catch (error) { sendResponse({ ok: false, error: error.message, code: error.code || "CONTENT_ADAPTER_ERROR" }); }
      return false;
    }
    if (message?.type === "WB_SET_SEND_BUTTON_PROFILE") {
      sendButtonProfile = message.profile || null;
      sendResponse({ ok: true });
      return false;
    }
    if (message?.type === "WB_SET_COPY_BUTTON_PROFILES") {
      replaceCopyButtonProfiles(message.profiles || null, "worker_update");
      sendResponse({ ok: true });
      return false;
    }
    if (message?.type === "WB_PAGE_CONTEXT") {
      const here = conversationIdentity();
      sendResponse({ ok: true, conversation_key: conversationKeyFromLocation(), identity: here, href: location.href });
      return false;
    }
    if (message?.type === "WB_GET_IDENTITY") {
      sendResponse({ ok: true, identity: conversationIdentity(), href: location.href, runtime_id: runtimeId, runtime_generation: runtime.generation });
      return false;
    }
    if (message?.type === "WB_APPLY_MANUAL_MODE") {
      sendResponse({ok:false,applied:false,code:'WORK_SESSION_OWNS_MANUAL_MODE'});
      return false;
    }
    if (message?.type === "WB_AUTO_SEND_START") {
      (async () => {
        if (!sameConversation(message.origin, message.conversation_id) || message.conversation_key !== conversationKeyFromLocation()) {
          return { ok: false, code: "CONVERSATION_MISMATCH", error: "Autorun start адресован другому ChatGPT-диалогу." };
        }
        stopAutoWatch("auto_start");
        return { ok: true, ...(await sendAutoStart(String(message.message_text || ""), String(message.run_id || ""), String(message.conversation_key || conversationKeyFromLocation() || ""))) };
      })().then(sendResponse).catch((error) => sendResponse({ ok: false, code: error.code || "AUTO_START_FAILED", error: error.message || String(error) }));
      return true;
    }
    if (message?.type === "WB_AUTO_DELIVERY_AVAILABLE") {
      (async () => {
        const recovery = message.recovery || null;
        if (!recovery || recovery.conversation_key !== conversationKeyFromLocation()) return { ok: false, code: "CONVERSATION_MISMATCH", error: "Delivery push адресован другому диалогу." };
        return await runRecoveryOnce(recovery, { propagate: true });
      })().then(sendResponse).catch((error) => sendResponse({ ok: false, code: error.code || "DELIVERY_RECOVERY_FAILED", error: error.message || String(error) }));
      return true;
    }
    if (message?.type === "WB_AUTO_BEGIN_WATCH") {
      sendResponse({ ok: true, started: beginAutoWatch(message), identity: conversationIdentity() });
      return false;
    }
    if (message?.type === "WB_AUTO_STOP_WATCH") {
      stopAutoWatch(message.reason || "worker");
      sendResponse({ ok: true });
      return false;
    }
    if (message?.type === "WB_AUTO_GET_BASELINE") {
      if (message.conversation_id && !sameConversation(message.origin || location.origin, message.conversation_id)) {
        sendResponse({ ok: false, code: "CONVERSATION_MISMATCH", error: "Baseline запрошен не у owner-диалога." });
        return false;
      }
      sendResponse({ ok: true, assistant_baseline_ids: assistantTurnIds(), identity: conversationIdentity() });
      return false;
    }
    return false;
  };
  chrome.runtime.onMessage.addListener(runtimeMessageListener);

  lastObservedConversationKey = conversationKeyFromLocation();
  identityPollTimer = setInterval(() => {
    if (!current()) return;
    const key = conversationKeyFromLocation();
    if (key === lastObservedConversationKey) return;
    lastObservedConversationKey = key;
    stopAutoWatch("conversation_route_changed");
    stopManualObserver();
    void syncAllState();
  }, 1000);

  Promise.all([
    sendRuntime("WB_GET_SEND_BUTTON_PROFILE"),
    sendRuntime("WB_GET_COPY_BUTTON_PROFILES"),
    sendRuntime("WB_GET_RUNTIME_OPTIONS")
  ]).then(([sendResponse, copyResponse, optionsResponse]) => {
    if (!current()) return;
    if(aiModeRevision===0)aiMode=globalThis.WBAIAdapters.normalizeMode(optionsResponse?.options?.ai_mode);
    sendButtonProfile = sendResponse?.ok ? sendResponse.profile || null : null;
    copyButtonProfiles = copyResponse?.ok ? normalizeCopyButtonProfiles(copyResponse.profiles) : [];
  }).finally(() => { if (current()) void syncAllState(); });

  runtime.dispose = () => {
    clearComposerWaiters();
    for(const key of [...workStartWatches.keys()])stopWorkStartWatch(key);
    fileDelivery.dispose();if(workPanel)workPanel.remove();
    if (runtime.disposed) return;
    try { restoreButtonPicker(); } catch (_) {}
    runtime.disposed = true;
    for (const remove of ownedListeners.splice(0)) { try { remove(); } catch (_) {} }
    stopManualObserver();
    stopAutoWatch("content_dispose");
    try { restoreButtonPicker(); } catch (_) {}
    if (identityPollTimer) clearInterval(identityPollTimer);
    identityPollTimer = null;
    if (runtimeMessageListener) chrome.runtime.onMessage.removeListener(runtimeMessageListener);
    runtimeMessageListener = null;
    for (const key of [...statusToastByKey.keys()]) clearToast(key);
    try { if (globalThis[RUNTIME_KEY] === runtime) delete globalThis[RUNTIME_KEY]; } catch (_) {}
  };

  recordContentDiagnostic("CONTENT_RUNTIME_STARTED", { version: VERSION, identity: conversationIdentity() });
  console.info(`[Wildberries Bridge ${VERSION}] content ready; manual and autorun are conversation-scoped and mutually exclusive`);
})();
