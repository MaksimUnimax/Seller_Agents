import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

export async function until(fn, description) {
  const end = Date.now() + 3500;
  while (Date.now() < end) {
    const value = await fn();
    if (value) return value;
    await new Promise((r) => setTimeout(r, 5));
  }
  throw new Error("Timed out: " + description);
}
export async function makeWorker(directory, options = {}) {
  const network = [],
    messages = [],
    listeners = [],
    timers = new Set();
  const backing = options.backing || { local: {}, session: {} };
  let context,
    request,
    promptOutcome = options.promptOutcome ?? "sent";
  const identity = {
    origin: "https://chatgpt.com",
    ai_id: "chatgpt",
    conversation_id: "core-fixture-dialogue",
    status: "confirmed",
  };
  const tabId = 77;
  const clone = (value) =>
    value === undefined
      ? undefined
      : vm.runInContext("JSON.parse", context)(JSON.stringify(value));
  function area(kind) {
    return {
      async get(keys) {
        options.onStorageRead?.(kind, keys);
        const data = backing[kind];
        if (keys == null) return clone(data);
        if (typeof keys === "string") return clone({ [keys]: data[keys] });
        if (Array.isArray(keys))
          return clone(Object.fromEntries(keys.map((key) => [key, data[key]])));
        return clone(
          Object.fromEntries(
            Object.entries(keys).map(([key, fallback]) => [
              key,
              data[key] ?? fallback,
            ]),
          ),
        );
      },
      async set(values) {
        Object.assign(backing[kind], structuredClone(values));
      },
      async remove(keys) {
        for (const key of Array.isArray(keys) ? keys : [keys])
          delete backing[kind][key];
      },
    };
  }
  const tab = {
    id: tabId,
    url: identity.origin + "/c/" + identity.conversation_id,
  };
  const chrome = {
    storage: {
      local: area("local"),
      session: area("session"),
      onChanged: { addListener() {} },
    },
    runtime: {
      lastError: null,
      getURL: (name) => "chrome-extension://core-fixture/" + name,
      onMessage: {
        addListener(fn) {
          listeners.push(fn);
        },
      },
      onConnect: { addListener() {} },
    },
    tabs: {
      async get(id) {
        return id === tabId ? tab : null;
      },
      async query() {
        return [];
      },
      async reload() {},
      onRemoved: { addListener() {} },
      sendMessage(id, message, callback) {
        messages.push(structuredClone(message));
        if (message.type === "OZ_WORK_SEND_INITIAL_PROMPT") {
          void (async () => {
            const fields = {
              intent_id: message.intent_id,
              revision: message.revision,
              identity,
              actor_id: "fixture-actor",
              runtime_generation: "fixture-content",
            };
            const committed = await request({
              type: "OZ_WORK_START_COMMIT_REQUEST",
              ...fields,
            });
            assert.equal(committed.click_allowed, true);
            const ack = await request({
              type: "OZ_WORK_START_SEND_OUTCOME",
              ...fields,
              click_event_observed: true,
              composer_empty: promptOutcome === "sent",
              assistant_baseline_ids: ["existing-assistant-turn"],
            });
            assert.equal(ack.ok, true);
            callback({
              ok: true,
              sent: promptOutcome === "sent",
              intent_id: message.intent_id,
              revision: message.revision,
            });
          })().catch((error) => {
            callback({ ok: false, error: error.message });
          });
          return;
        }
        const response =
          message.type === "OZ_GET_IDENTITY"
            ? { ok: true, identity }
            : {
                ok: true,
                applied: true,
                received: true,
                adapter_id: "chatgpt",
              };
        queueMicrotask(() => callback?.(response));
      },
    },
    alarms: {
      create() {},
      async clear() {
        return true;
      },
      onAlarm: { addListener() {} },
    },
    downloads: {
      async download() {
        return 1;
      },
    },
  };
  const sandbox = {
    console,
    chrome,
    crypto: webcrypto,
    TextEncoder,
    TextDecoder,
    URL,
    URLSearchParams,
    Response,
    Request,
    Headers,
    AbortController,
    Blob,
    structuredClone,
    queueMicrotask,
    atob,
    btoa,
    fetch: async (url, init = {}) => {
      network.push({
        url: String(url),
        method: init.method || "GET",
        body: init.body,
      });
      if (options.fetch)
        return options.fetch(String(url), init, network.length);
      assert.ok(
        String(url).startsWith("https://api-seller.ozon.ru/"),
        "No unexpected network target",
      );
      return new Response(JSON.stringify({ result: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
    setTimeout(fn, ms, ...args) {
      const timer = setTimeout(() => {
        timers.delete(timer);
        fn(...args);
      }, ms);
      timers.add(timer);
      return timer;
    },
    clearTimeout(timer) {
      timers.delete(timer);
      clearTimeout(timer);
    },
    setInterval(fn, ms, ...args) {
      const timer = setInterval(fn, ms, ...args);
      timers.add(timer);
      return timer;
    },
    clearInterval(timer) {
      timers.delete(timer);
      clearInterval(timer);
    },
  };
  context = vm.createContext(sandbox);
  sandbox.importScripts = (...files) => {
    for (const name of files)
      vm.runInContext(
        fs.readFileSync(path.join(directory, name), "utf8"),
        context,
        { filename: name },
      );
  };
  vm.runInContext(
    fs.readFileSync(path.join(directory, "service_worker_entry.js"), "utf8"),
    context,
    { filename: "service_worker_entry.js" },
  );
  request = (message) =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Message timed out: " + message.type)),
        4000,
      );
      try {
        listeners.at(-1)(clone(message), clone({ tab }), (response) => {
          clearTimeout(timeout);
          resolve(response);
        });
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  const call = (name, ...args) =>
    vm.runInContext(`${name}(...${JSON.stringify(args)})`, context);
  await new Promise((r) => setTimeout(r, 5));
  return {
    network,
    messages,
    backing,
    identity,
    tabId,
    request,
    call,
    async settings() {
      const response = await request({
        type: "OZ_SAVE_GLOBAL_SETTINGS",
        auto_send: true,
        personal_data_enabled: true,
        seller_client_id: "FIXTURE_CLIENT",
        seller_api_key: "FIXTURE_KEY",
      });
      assert.equal(response.ok, true, JSON.stringify(response));
    },
    async start() {
      const response = await request({ type: "OZ_WORK_START", tab_id: tabId });
      assert.equal(response.ok, true, JSON.stringify(response));
      const pending = await until(async () => {
        const row = (await call("getPendingWorkStarts"))[tabId];
        return row?.send_outcome === "sent_acknowledged" ? row : null;
      }, "start prompt acknowledgement");
      const active = await request({
        type: "OZ_WORK_PENDING_IDENTITY",
        intent_id: pending.intent_id,
        revision: pending.revision,
        identity,
        first_response_complete: true,
      });
      assert.equal(active.ok, true, JSON.stringify(active));
      return active.binding.conversation_key;
    },
    close() {
      for (const timer of timers) {
        clearTimeout(timer);
        clearInterval(timer);
      }
      timers.clear();
    },
  };
}
