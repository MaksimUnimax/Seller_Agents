(() => {
  "use strict";

  const AI_MODES = Object.freeze(["auto", ...globalThis.WBAIDeliveryCapabilities.implementedTargetIds()]);

  function normalizeMode(value) {
    const mode = String(value || "auto").trim().toLowerCase();
    return AI_MODES.includes(mode) ? mode : "unsupported";
  }

  function host() {
    if(globalThis.location?.protocol && globalThis.location.protocol!=="https:") return "";
    return String(globalThis.location?.hostname || "").toLowerCase();
  }

  function text(node) {
    return String(node?.innerText || node?.textContent || "").trim();
  }

  function visible(node) {
    if (!(node instanceof HTMLElement) || !node.isConnected) return false;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  }

  function readComposerText(composer) {
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) return composer.value || "";
    return composer?.textContent || "";
  }

  function setComposerText(composer, value) {
    if (!(composer instanceof HTMLElement)) throw Object.assign(new Error("AI composer is unavailable."), { code: "COMPOSER_NOT_FOUND" });
    const next = String(value || "");
    composer.focus();
    if (composer instanceof HTMLTextAreaElement || composer instanceof HTMLInputElement) {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(composer), "value");
      if (!descriptor?.set) throw Object.assign(new Error("Composer value setter unavailable."), { code: "COMPOSER_SETTER_UNAVAILABLE" });
      descriptor.set.call(composer, next);
    } else {
      composer.textContent = next;
    }
    composer.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: next }));
    composer.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function controlsWithin(context) {
    const root = context?.root || context?.form || null;
    if (!(root instanceof Element)) return [];
    return [...root.querySelectorAll('button, [role="button"], input[type="submit"]')];
  }

  function aliceComposerContext() {
    const candidates=[...document.querySelectorAll('[data-testid="inputbase-textarea"], [data-highlight-id="alice-input"] textarea')].filter(n=>n instanceof HTMLElement&&visible(n)&&!n.closest('[data-message-role],.CodeBlock'));
    if(candidates.length!==1)return null;
    const composer=candidates[0];
    const root = composer.closest('[data-testid="standalone-input"]') ||
      composer.closest('[data-testid="standalone-input-field"]') ||
      composer.closest('[data-highlight-id="alice-input"]') ||
      composer.parentElement;
    if (!(root instanceof Element)) return null;
    return { composer, root, form: composer.closest("form") || null };
  }

  function chatgptInsideAssistantEditor(node) {
    return Boolean(node?.closest?.('section[data-turn="assistant"], [data-message-author-role="assistant"], [data-writing-block], [data-writing-block-id], #code-block-viewer'));
  }

  function chatgptComposerContext() {
    const selectors = [
      "#prompt-textarea",
      '[data-testid="prompt-textarea"]',
      'textarea[id*="prompt" i]',
      'textarea[data-testid*="prompt" i]',
      '[contenteditable="true"][id*="prompt" i]',
      '[contenteditable="true"][data-testid*="prompt" i]'
    ];
    const candidates = [], seen = new Set();
    for (const selector of selectors) {
      for (const composer of document.querySelectorAll(selector)) {
        if (!(composer instanceof HTMLElement) || !visible(composer) || chatgptInsideAssistantEditor(composer)) continue;
        if (seen.has(composer)) continue;
        seen.add(composer);
        const form = composer.closest("form");
        if (!(form instanceof Element) || chatgptInsideAssistantEditor(form)) continue;
        let score = 0;
        if (composer.id === "prompt-textarea") score += 1000;
        if (composer.getAttribute("data-testid") === "prompt-textarea") score += 800;
        if (form.closest("#composer-background, [data-testid*='composer' i]")) score += 400;
        candidates.push({ context: { composer, form, root: form }, score });
      }
    }
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    if (!best || candidates.filter(item => item.score === best.score).length !== 1) return null;
    return best.context;
  }

  function buttonToken(button) {
    return [
      button?.getAttribute?.("data-testid") || "",
      button?.getAttribute?.("aria-label") || "",
      button?.getAttribute?.("title") || "",
      button?.getAttribute?.("name") || "",
      button?.getAttribute?.("type") || "",
      button?.textContent || ""
    ].join(" ").toLowerCase();
  }

  function controlDisabled(button) {
    return Boolean(button instanceof HTMLButtonElement && button.disabled) || button?.getAttribute?.("aria-disabled") === "true";
  }

  function chatgptSendCandidates(context) {
    if (!context?.form?.contains(context.composer)) return [];
    const exact = [...context.form.querySelectorAll('button#composer-submit-button[data-testid="send-button"], button[data-testid="send-button"]')]
      .filter((button) => button instanceof HTMLElement && visible(button) && !chatgptInsideAssistantEditor(button) && !controlDisabled(button));
    if (exact.length === 1) return [{ button: exact[0], score: 2000 }];
    return [...context.form.querySelectorAll('button, [role="button"], input[type="submit"]')]
      .filter((button) => button instanceof HTMLElement && visible(button) && !chatgptInsideAssistantEditor(button) && !controlDisabled(button))
      .filter((button) => !/stop|cancel|abort|останов|отмен/.test(buttonToken(button)))
      .map((button) => {
        const token = buttonToken(button);
        const testid = String(button.getAttribute("data-testid") || "").toLowerCase();
        let score = 0;
        if (testid === "send-button" || testid.includes("send-button")) score += 1000;
        if (/\bsend\b|отправ/u.test(token)) score += 600;
        if (String(button.getAttribute("type") || "").toLowerCase() === "submit") score += 300;
        return { button, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  function chatgptSendButton(context) {
    const candidates = chatgptSendCandidates(context);
    const top = candidates[0];
    if (!top) return null;
    return candidates.filter((item) => item.score === top.score).length === 1 ? top.button : null;
  }

  function chatgptFileInput() {
    // The input must belong to the same unique composer, never a global/other form.
    const context = chatgptComposerContext();
    if (!context?.form) return null;
    const candidates = [...context.form.querySelectorAll('input[type="file"]')]
      .filter(item => item instanceof HTMLInputElement && item.isConnected && !chatgptInsideAssistantEditor(item));
    return candidates.length === 1 ? candidates[0] : null;
  }

  function chatgptAttachmentPreview(filename) {
    const context=chatgptComposerContext(),root=context?.root||context?.form;
    if(!root || !filename)return null;
    const matches=[...root.querySelectorAll('[role="group"][aria-label],[data-testid*="file" i],[data-filename],[data-file-name]')].filter(n=>[n.getAttribute('aria-label'),n.getAttribute('data-filename'),n.getAttribute('data-file-name'),n.getAttribute('title')].some(v=>v===filename));
    return matches.length===1?matches[0]:null;
  }

  const CHATGPT_COPY_ANCHORS=new WeakMap(), ALICE_COPY_ANCHORS=new WeakMap();
  const CHATGPT_CODE_COPY_SELECTOR='button[aria-label="Копировать"], button[aria-label="Copy"]';

  function chatgptCopyOwnedBlock(copyButton, message) {
    if (!(copyButton instanceof Element) || !(message instanceof Element) || !message.contains(copyButton)) return null;
    let node = copyButton.parentElement;
    while (node && node !== message) {
      const copyControls = [...node.querySelectorAll(CHATGPT_CODE_COPY_SELECTOR)];
      const rawSurfaces = [
        ...node.querySelectorAll('[data-writing-block-fullscreen-editor-region]'),
        ...node.querySelectorAll('.cm-content'),
        ...node.querySelectorAll('#code-block-viewer'),
        ...node.querySelectorAll('pre > code'),
        ...node.querySelectorAll('pre')
      ];
      if (copyControls.length === 1 && rawSurfaces.length > 0) return node;
      node = node.parentElement;
    }
    return null;
  }

  const CHATGPT = Object.freeze({
    id: "chatgpt",
    label: "ChatGPT",
    matchesLocation() { return globalThis.WBAIDeliveryCapabilities.adapterIdForOrigin(location.origin) === this.id; },
    assistantMessages() {
      const sections = [...document.querySelectorAll('section[data-turn="assistant"]')];
      return sections.length ? sections : [...document.querySelectorAll('[data-message-author-role="assistant"]')];
    },
    userMessages() {
      const sections = [...document.querySelectorAll('section[data-turn="user"]')];
      return sections.length ? sections : [...document.querySelectorAll('[data-message-author-role="user"]')];
    },
    userMessageText(node) {
      // Turn roots also own accessibility headings and Copy/Edit controls.
      // Select the message body structurally; never match a prompt substring.
      if (!(node instanceof Element)) return "";
      const bodies = node.matches('[data-message-author-role="user"]')
        ? [node] : [...node.querySelectorAll('[data-message-author-role="user"]')];
      if (bodies.length > 1) return "";
      const body = bodies[0] || node;
      const payloads = [...body.querySelectorAll('.whitespace-pre-wrap')];
      if (payloads.length > 1) return "";
      return text(payloads[0] || body);
    },
    messageId(node) {
      if (!(node instanceof Element)) return "";
      return node.getAttribute("data-turn-id") || node.querySelector('[data-message-author-role][data-message-id]')?.getAttribute("data-message-id") || node.getAttribute("data-message-id") || "";
    },
    messageText(node) { return text(node); },
    findCodeBlocks(message) {
      if (!(message instanceof Element)) return [];
      const roots = [];
      for (const copyButton of message.querySelectorAll(CHATGPT_CODE_COPY_SELECTOR)) {
        const root = chatgptCopyOwnedBlock(copyButton, message);
        if (!root) continue;
        CHATGPT_COPY_ANCHORS.set(root, copyButton);
        roots.push(root);
      }
      return [...new Set(roots)];
    },
    readCodeText(block) {
      if (!(block instanceof Element)) return "";
      const writingBody = block.querySelector('[data-writing-block-fullscreen-editor-region]');
      if (writingBody) return String(writingBody.innerText || writingBody.textContent || "");
      const cm = block.querySelector('.cm-content');
      if (cm) return String(cm.textContent || "");
      const legacy = block.querySelector('#code-block-viewer');
      if (legacy) return String(legacy.innerText || legacy.textContent || "");
      const code = block.querySelector("pre > code") || block.querySelector("code");
      if (code) return String(code.textContent || "");
      const pre = block.querySelector("pre");
      return pre ? String(pre.textContent || "") : "";
    },
    geometryAnchor(block) {
      const copyButton = block instanceof Element ? CHATGPT_COPY_ANCHORS.get(block) : null;
      return copyButton?.isConnected ? copyButton : (block instanceof Element ? block : null);
    },
    isGenerating() { return Boolean(document.querySelector('[data-testid="stop-button"]') || document.querySelector('[aria-busy="true"]')); },
    messageComplete(message) { return Boolean(message?.isConnected && !this.isGenerating() && text(message)); },
    composerContext: chatgptComposerContext,
    readComposerText,
    setComposerText,
    sendButtonCandidates: chatgptSendCandidates,
    sendButton: chatgptSendButton,
    sendButtonFingerprint(button) {
      if (!(button instanceof HTMLElement)) return "";
      return [button.tagName, button.getAttribute("data-testid") || "", button.getAttribute("aria-label") || "", button.getAttribute("title") || "", button.getAttribute("type") || "", button.getAttribute("name") || ""].join("|");
    },
    deliveryCapabilities() { return globalThis.WBAIDeliveryCapabilities?.profile?.(this.id) || null; },
    attachmentSurface() { const input = chatgptFileInput(); return input ? {kind:"file_input_v1",input,root:input.closest("form")||document.documentElement} : null; },
    attachFiles(surface,files) {
      const live = this.attachmentSurface();
      if (!live || surface?.kind !== "file_input_v1" || surface.input !== live.input || surface.root !== live.root)
        throw Object.assign(new Error("Attachment surface changed"), {code:"TARGET_AI_ATTACHMENT_SURFACE_CHANGED"});
      return WBWebFileAttachment.setInputFiles(live.input,files);
    },
    attachmentPreview(filename) { return chatgptAttachmentPreview(filename); },
    attachmentReady(descriptors) {
      const list = Array.isArray(descriptors) ? descriptors : [];
      if (!list.length) return false;
      return list.every((descriptor) => {
        const preview = chatgptAttachmentPreview(descriptor.filename);
        return Boolean(preview?.isConnected && !preview.matches?.('[aria-busy="true"]') && !preview.querySelector?.('[aria-busy="true"]'));
      });
    }
  });

  const ALICE = Object.freeze({
    id: "alice",
    label: "Alice",
    matchesLocation() { return globalThis.WBAIDeliveryCapabilities.adapterIdForOrigin(location.origin) === this.id; },
    assistantMessages() { return [...document.querySelectorAll('[data-message-role="alice"]')]; },
    userMessages() { return [...document.querySelectorAll('[data-message-role="user"]')]; },
    messageId(node) {
      if (!(node instanceof Element)) return "";
      return node.id || node.getAttribute("data-message-id") || "";
    },
    messageText(node) { return text(node); },
    findCodeBlocks(message) {
      if (!(message instanceof Element)) return [];
      const roots = [];
      for (const copyButton of message.querySelectorAll('[data-testid="codeblock-action-copy"]')) {
        const root = copyButton.closest('.CodeBlock');
        if (!(root instanceof Element) || !message.contains(root)) continue;
        ALICE_COPY_ANCHORS.set(root, copyButton);
        roots.push(root);
      }
      return [...new Set(roots)];
    },
    readCodeText(block) {
      if (!(block instanceof Element)) return "";
      const code = block.querySelector("pre.CodeBlock-ContentPre > code") || block.querySelector("pre > code");
      return code ? String(code.textContent || "") : "";
    },
    geometryAnchor(block) {
      if (!(block instanceof Element)) return null;
      const copyButton = ALICE_COPY_ANCHORS.get(block);
      return copyButton?.isConnected ? copyButton : (block.querySelector(":scope > .CodeBlock-StickyWrapper") || block);
    },
    composerContext: aliceComposerContext,
    readComposerText,
    setComposerText,
    classifyComposerControl(context, visibleFn = visible) {
      const root = context?.root;
      if (!(root instanceof Element)) return { kind: "unknown", button: null };
      const button = root.querySelector('[data-testid="oknyx"]');
      if (!(button instanceof HTMLElement) || !visibleFn(button)) return { kind: "unknown", button: null };
      const aria = String(button.getAttribute("aria-label") || "").trim().toLowerCase();
      if (aria === "алиса, стоп") return { kind: "stop", button };
      if (aria === "отправить") return { kind: (controlDisabled(button) || button.classList.contains("StandaloneOknyx_error")) ? "send_disabled" : "send_active", button };
      if (aria === "алиса, начни слушать") return { kind: "ready", button };
      return { kind: "unknown", button };
    },
    sendButtonCandidates(context) {
      const classified = this.classifyComposerControl(context, visible);
      return classified.kind === "send_active" && classified.button ? [{ button: classified.button, score: 2000 }] : [];
    },
    sendButton(context) {
      const classified = this.classifyComposerControl(context, visible);
      return classified.kind === "send_active" ? classified.button : null;
    },
    sendButtonFingerprint(button) {
      if (!(button instanceof HTMLElement)) return "";
      return [button.tagName, button.getAttribute("data-testid") || "", button.getAttribute("aria-label") || "", button.getAttribute("title") || ""].join("|");
    },
    deliveryCapabilities() { return globalThis.WBAIDeliveryCapabilities?.profile?.(this.id) || null; },
    attachmentSurface() {
      const c=aliceComposerContext(); if(!c)return null;
      const root=c.composer.closest('.Standalone-Input') || c.root;
      if(!(root instanceof Element))return null;
      const controls=root.querySelector('[data-testid="input-controls-root"]') || c.root.querySelector?.('[data-testid="input-controls-root"]');
      if(!(controls instanceof Element) || !controls.isConnected)return null;
      const marker=controls.querySelector('button[data-testid="InputControls-Plus-Button"][aria-label="Добавить файл"][aria-haspopup="dialog"]');
      if(!(marker instanceof HTMLElement) || !visible(marker) || controlDisabled(marker) || !(document.body instanceof HTMLElement) || !document.body.isConnected)return null;
      return {kind:'drag_drop_v1',root:document.body,composer_root:root,controls_root:controls,capability_marker:marker};
    },
    attachFiles(surface,files) {
      const live=this.attachmentSurface();
      if(!live || live.root!==surface.root || live.capability_marker!==surface.capability_marker)throw Object.assign(new Error('Alice attachment surface changed.'),{code:'TARGET_AI_ATTACHMENT_SURFACE_CHANGED'});
      return globalThis.WBWebFileAttachment.dispatchFileDrop(live.root,files);
    },
    attachmentPreview(filename) {
      const target=String(filename||'').trim();if(!target)return null;
      const c=aliceComposerContext();if(!c)return null;const root=c.composer.closest('.Standalone-Input') || c.root;if(!(root instanceof Element))return null;
      const scopes=[root,c.root,root.querySelector?.('.StandaloneInput-TopControls')].filter((n,i,a)=>n instanceof Element&&n.isConnected&&a.indexOf(n)===i);
      const matches=[];for(const scope of scopes){for(const n of scope.querySelectorAll('*')){if(!(n instanceof HTMLElement)||!n.isConnected)continue;const attrs=[n.getAttribute('data-filename')||'',n.getAttribute('data-file-name')||'',n.getAttribute('aria-label')||'',n.getAttribute('title')||''].map(v=>String(v).trim()).filter(Boolean);const nodeText=String(n.textContent||'').replace(/\u00a0/g,' ').trim();if(attrs.some(v=>v===target||v.includes(target))||nodeText===target)matches.push(n);}if(matches.length)break;}
      if(!matches.length)return null;const leaves=matches.filter(n=>!matches.some(o=>o!==n&&n.contains(o)));const candidates=leaves.length?leaves:matches;return candidates.length===1?candidates[0]:null;
    },
    attachmentReady(descriptors) {
      return descriptors.length>0 && descriptors.every(d=>{
        const n=this.attachmentPreview(d.filename);if(!n?.isConnected)return false;
        const a=n.closest('[data-status]') || n.parentElement || n;
        return !a.matches('[aria-busy="true"]') && !a.querySelector('[aria-busy="true"]') && !/uploading|loading|загружа|обработ|ошиб|error|unsupported|failed|сбой/i.test(a.textContent+' '+a.getAttribute('data-status'));
      });
    },
    isGenerating() {
      const button = document.querySelector('[data-testid="oknyx"]');
      return String(button?.getAttribute("aria-label") || "").trim().toLowerCase() === "алиса, стоп";
    },
    messageComplete(message) { return Boolean(message?.isConnected && !this.isGenerating() && text(message)); }
  });

  const ADAPTERS = Object.freeze({ chatgpt: CHATGPT, alice: ALICE });

  function adapterForLocation(mode = "auto") {
    const normalized = normalizeMode(mode);
    if (normalized !== "auto") {
      const selected = ADAPTERS[normalized] || null;
      return selected?.matchesLocation() ? selected : null;
    }
    return Object.values(ADAPTERS).find((candidate) => candidate.matchesLocation()) || null;
  }

  globalThis.WBAIAdapters = Object.freeze({
    AI_MODES,
    ADAPTERS,
    normalizeMode,
    adapterForLocation,
    visible,
    readComposerText,
    setComposerText
  });
})();
