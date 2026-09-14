import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { TextEncoder, TextDecoder } from "node:util";

const mode = process.argv.includes("--expect-red") ? "expect-red" : "candidate-green";
const positional = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const root = path.resolve(positional[0] || "tooling/llm-api-bridges/ozon-seller");
const dist = path.join(root, "dist-step7-candidate");
const passes = [];
const failures = [];
const cases = [];

function check(condition, label, detail = "") {
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? `: ${detail}` : ""}`);
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
function independentSemanticFingerprint(command) {
  const text = JSON.stringify(stableSemanticClone(command));
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
let storageRealmClone = (value) => value;
function clone(value) {
  return value === undefined ? undefined : storageRealmClone(value);
}
function makeStorageArea() {
  const data = Object.create(null);
  return {
    _data: data,
    async get(keys) {
      if (keys == null) return clone(data);
      if (typeof keys === "string") return { [keys]: clone(data[keys]) };
      if (Array.isArray(keys)) return Object.fromEntries(keys.map((key) => [key, clone(data[key])]));
      if (typeof keys === "object") {
        const out = {};
        for (const [key, fallback] of Object.entries(keys)) out[key] = data[key] === undefined ? clone(fallback) : clone(data[key]);
        return out;
      }
      return {};
    },
    async set(values) {
      for (const [key, value] of Object.entries(values || {})) data[key] = clone(value);
    },
    async remove(keys) {
      for (const key of (Array.isArray(keys) ? keys : [keys])) delete data[key];
    },
    async clear() {
      for (const key of Object.keys(data)) delete data[key];
    }
  };
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders }
  });
}

async function runCase({ alias, params, kind = "performance", expectedRed = false }) {
  const local = makeStorageArea();
  const session = makeStorageArea();
  const runtimeListeners = [];
  const portListeners = [];
  const storageChangedListeners = [];
  const alarmListeners = [];
  const tabRemovedListeners = [];
  const network = [];
  const tabId = 77;
  const identity = {
    origin: "https://chatgpt.com",
    ai_id: "chatgpt",
    conversation_id: `worker-gate-${alias.replace(/[^a-z0-9]+/gi, "-").slice(0, 80)}`,
    status: "confirmed"
  };

  const tabMessage = (message) => {
    const type = String(message?.type || "");
    if (type === "OZ_GET_IDENTITY") return { ok: true, identity };
    if (type === "OZ_WORK_APPLY_VISIBILITY") return { ok: true, applied: true };
    if (type === "OZ_BATCH_DELIVERY_AVAILABLE") return { ok: true, received: true };
    if (type === "OZ_AUTO_DELIVERY_AVAILABLE") return { ok: true, received: true };
    if (type === "OZ_SET_SEND_BUTTON_PROFILE" || type === "OZ_SET_MICROPHONE_BUTTON_PROFILE") return { ok: true };
    if (type === "OZ_APPLY_AI_MODE") return { ok: true, adapter_id: "chatgpt" };
    return { ok: true };
  };

  const chrome = {
    storage: {
      local,
      session,
      onChanged: { addListener(fn) { storageChangedListeners.push(fn); } }
    },
    runtime: {
      lastError: null,
      getURL: (name) => `chrome-extension://worker-gate/${String(name || "")}`,
      onMessage: { addListener(fn) { runtimeListeners.push(fn); } },
      onConnect: { addListener(fn) { portListeners.push(fn); } }
    },
    tabs: {
      async get(id) { return Number(id) === tabId ? { id: tabId, url: `https://chatgpt.com/c/${identity.conversation_id}` } : null; },
      async query() { return []; },
      sendMessage(id, message, callback) {
        const response = Number(id) === tabId ? tabMessage(message) : { ok: false, code: "TAB_NOT_FOUND" };
        queueMicrotask(() => callback?.(response));
      },
      onRemoved: { addListener(fn) { tabRemovedListeners.push(fn); } },
      async reload() { return undefined; }
    },
    alarms: {
      create() {},
      async clear() { return true; },
      onAlarm: { addListener(fn) { alarmListeners.push(fn); } }
    },
    downloads: { async download() { return 1; } }
  };

  const fakeFetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : String(input?.url || input);
    const method = String(init?.method || input?.method || "GET").toUpperCase();
    const body = init?.body ?? input?.body ?? null;
    network.push({ url, method, body: typeof body === "string" ? body : null });
    if (url === "https://api-performance.ozon.ru/api/client/token") {
      return jsonResponse({ access_token: "WORKER_GATE_TOKEN", token_type: "Bearer", expires_in: 3600 });
    }
    if (url.startsWith("https://api-performance.ozon.ru/")) {
      return jsonResponse({ UUID: `REPORT_${alias.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}` });
    }
    if (url.startsWith("https://api-seller.ozon.ru/v1/description-category/dependent-attributes/values")) {
      return jsonResponse({ result: [], cursor: "" });
    }
    if (url.startsWith("https://api-seller.ozon.ru/")) {
      return jsonResponse({ result: [] });
    }
    throw new Error(`Unexpected network target in worker gate: ${url}`);
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
    Headers,
    Request,
    AbortController,
    Blob,
    structuredClone,
    fetch: fakeFetch,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    queueMicrotask,
    atob: globalThis.atob,
    btoa: globalThis.btoa
  };
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox);
  const vmJsonParse = vm.runInContext("JSON.parse", context);
  storageRealmClone = (value) => value === undefined ? undefined : vmJsonParse(JSON.stringify(value));
  sandbox.importScripts = (...files) => {
    for (const relative of files) {
      const file = path.join(dist, relative);
      vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
    }
  };
  vm.runInContext(fs.readFileSync(path.join(dist, "service_worker_entry.js"), "utf8"), context, { filename: path.join(dist, "service_worker_entry.js") });
  await new Promise((resolve) => setTimeout(resolve, 5));

  check(portListeners.length >= 1, `${alias} production attachment port boundary loaded`);
  check(storageChangedListeners.length >= 1, `${alias} production storage wake boundary loaded`);
  const listener = runtimeListeners.at(-1);
  if (typeof listener !== "function") throw new Error("service_worker did not register chrome.runtime.onMessage listener");
  const sender = { tab: { id: tabId, url: `https://chatgpt.com/c/${identity.conversation_id}` } };
  async function workerMessage(message) {
    return await new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => { if (!settled) reject(new Error(`worker message timeout: ${message?.type}`)); }, 3000);
      try {
        listener(message, sender, (response) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(response);
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  const settings = await workerMessage({
    type: "OZ_SAVE_GLOBAL_SETTINGS",
    auto_send: true,
    personal_data_enabled: true,
    seller_client_id: "SELLER_TEST_CLIENT",
    seller_api_key: "SELLER_TEST_KEY",
    performance_client_id: "PERF_TEST_CLIENT",
    performance_client_secret: "PERF_TEST_SECRET"
  });
  if (!settings?.ok) throw new Error(`settings setup failed: ${JSON.stringify(settings)}`);

  const bound = await workerMessage({ type: "OZ_BIND_CONVERSATION", context: { tab_id: tabId, origin: identity.origin, conversation_id: identity.conversation_id } });
  if (!bound?.ok || !bound?.binding?.conversation_key) throw new Error(`binding setup failed: ${JSON.stringify(bound)}`);
  const conversationKey = bound.binding.conversation_key;

  const resumed = await workerMessage({ type: "OZ_WORK_RESUME", tab_id: tabId, conversation_key: conversationKey });
  if (!resumed?.ok) throw new Error(`work-session resume failed: ${JSON.stringify(resumed)}`);
  const manual = await workerMessage({ type: "OZ_SET_MANUAL_MODE", tab_id: tabId, conversation_key: conversationKey, enabled: true });
  if (!manual?.ok || manual?.enabled !== true) throw new Error(`manual mode setup failed: ${JSON.stringify(manual)}`);

  const commandText = `OZON_API_V1\n${JSON.stringify({ operation: alias, params })}`;
  const admission = await workerMessage({
    type: "OZ_EXECUTE_COMMAND",
    command_text: commandText,
    conversation_key: conversationKey,
    manual_request_id: `worker-gate-${alias}`
  });

  let diagnostics = [];
  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    const response = await workerMessage({ type: "OZ_GET_DIAGNOSTICS" });
    diagnostics = Array.isArray(response?.diagnostics) ? response.diagnostics : [];
    if (diagnostics.some((row) => ["BATCH_RESULT_STORED", "MANUAL_BATCH_FAILED"].includes(row?.event))) break;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  const byEvent = (name) => diagnostics.filter((row) => row?.event === name);
  const manualFailed = byEvent("MANUAL_BATCH_FAILED");
  const processorFailed = byEvent("BATCH_PROCESSOR_UNCAUGHT");
  const batchStarted = byEvent("BATCH_REQUEST_STARTED");
  const requestStarted = byEvent("OZON_REQUEST_STARTED");
  const requestFinished = byEvent("OZON_REQUEST_FINISHED");
  const resultStored = byEvent("BATCH_RESULT_STORED");
  const planning = byEvent("BATCH_CAPABILITY_PLANNING_COMPLETED");
  const queryPlanning = byEvent("BATCH_QUERY_PLANNING_COMPLETED");
  const authRequests = network.filter((row) => row.url === "https://api-performance.ozon.ru/api/client/token");
  const performanceBusinessRequests = network.filter((row) => row.url.startsWith("https://api-performance.ozon.ru/") && row.url !== "https://api-performance.ozon.ru/api/client/token");
  const sellerBusinessRequests = network.filter((row) => row.url.startsWith("https://api-seller.ozon.ru/"));
  const businessRequests = [...performanceBusinessRequests, ...sellerBusinessRequests];

  const output = {
    alias,
    kind,
    admission,
    diagnostics: diagnostics.map((row) => ({
      sequence: row.sequence,
      event: row.event,
      code: row.code || null,
      operation: row.operation || null,
      command_fingerprint: row.command_fingerprint || null,
      physical_command_fingerprint: row.physical_command_fingerprint || null,
      command_transformed: typeof row.command_transformed === "boolean" ? row.command_transformed : null,
      http_status: Number(row.http_status || 0),
      external_request_executed: typeof row.external_request_executed === "boolean" ? row.external_request_executed : null
    })).filter((row) => /BATCH|OZON_REQUEST|PERSONAL_DATA/.test(row.event)),
    network,
    counts: { auth: authRequests.length, performance_business: performanceBusinessRequests.length, seller_business: sellerBusinessRequests.length, business_total: businessRequests.length }
  };
  cases.push(output);

  check(admission?.ok === true && admission?.accepted === true, `${alias} manual admission accepted`, JSON.stringify(admission));

  if (expectedRed) {
    check(manualFailed.some((row) => row?.code === "UNSUPPORTED_OPERATION"), `${alias} frozen v0.1.20 worker RED reproduces UNSUPPORTED_OPERATION`, JSON.stringify(output));
    check(processorFailed.length === 0 || processorFailed.every((row) => row?.code === "UNSUPPORTED_OPERATION"), `${alias} frozen processor diagnostic consistent when present`, JSON.stringify(output));
    check(batchStarted.length === 0 && requestStarted.length === 0 && requestFinished.length === 0 && resultStored.length === 0 && businessRequests.length === 0,
      `${alias} frozen RED fails before provider dispatch`, JSON.stringify(output));
    return output;
  }

  check(planning.length === 1, `${alias} capability planning completed`, JSON.stringify(output.diagnostics));
  check(queryPlanning.length === 1, `${alias} query planning completed`, JSON.stringify(output.diagnostics));
  check(manualFailed.length === 0 && processorFailed.length === 0, `${alias} no uncaught worker failure`, JSON.stringify(output));
  check(batchStarted.length === 1, `${alias} BATCH_REQUEST_STARTED exactly once`, JSON.stringify(output));
  check(requestStarted.length === 1, `${alias} OZON_REQUEST_STARTED exactly once`, JSON.stringify(output));
  check(requestFinished.length === 1 && Number(requestFinished[0]?.http_status) === 200, `${alias} OZON_REQUEST_FINISHED HTTP 200`, JSON.stringify(output));
  check(resultStored.length === 1 && resultStored[0]?.external_request_executed === true, `${alias} BATCH_RESULT_STORED external request true`, JSON.stringify(output));
  check(businessRequests.length === 1, `${alias} exactly one provider business request`, JSON.stringify(output.counts));
  if (kind === "performance") {
    check(authRequests.length === 1, `${alias} exactly one Performance auth request in fresh worker`, JSON.stringify(output.counts));
    check(performanceBusinessRequests.length === 1 && sellerBusinessRequests.length === 0, `${alias} exactly one Performance business request`, JSON.stringify(output.network));
  }
  const start = requestStarted[0] || {};
  check(start.command_transformed === false && start.command_fingerprint === start.physical_command_fingerprint,
    `${alias} worker logical/physical command preserved`, JSON.stringify(start));
  return output;
}

const REPORTS = {
  performance_search_promo_orders_report_create: { from: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" },
  performance_search_promo_products_report_create: { from: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" },
  performance_statistics_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02", groupBy: "DATE" },
  performance_all_sku_promo_orders_report_create: { "timeBounds.from": "2026-09-01T00:00:00Z", "timeBounds.to": "2026-09-02T00:00:00Z" },
  performance_all_sku_promo_products_report_create: { "timeBounds.from": "2026-09-01T00:00:00Z", "timeBounds.to": "2026-09-02T00:00:00Z" },
  performance_attribution_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02" },
  performance_phrases_report_create: { dateFrom: "2026-09-01", dateTo: "2026-09-02" },
  performance_video_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02", groupBy: "NO_GROUP_BY" },
  performance_vendor_statistics_report_create: { dateFrom: "2026-09-01", dateTo: "2026-09-02", type: "ORDERS" }
};

for (const [alias, params] of Object.entries(REPORTS)) {
  await runCase({ alias, params, kind: "performance", expectedRed: mode === "expect-red" });
}

if (mode !== "expect-red") {
  const test10Command = {
    operation: "description_category_dependent_attribute_values",
    params: { parent_attribute_id: 85, child_attribute_id: 10096, description_category_id: 87515080, type_id: 93733, limit: 1 }
  };
  const test10ExpectedFingerprint = independentSemanticFingerprint(test10Command);
  check(test10ExpectedFingerprint === "cd4bce38", "Test10 independent canonical fingerprint fixture", test10ExpectedFingerprint);
  const test10 = await runCase({
    alias: test10Command.operation,
    kind: "seller",
    params: test10Command.params,
    expectedRed: false
  });
  const requestStart = test10.diagnostics.find((row) => row.event === "OZON_REQUEST_STARTED") || null;
  check(requestStart?.command_fingerprint === test10ExpectedFingerprint,
    "Test10 full worker logical fingerprint is canonical and order-insensitive", JSON.stringify(requestStart));
  check(requestStart?.physical_command_fingerprint === test10ExpectedFingerprint && requestStart?.command_transformed === false,
    "Test10 full worker preserves canonical logical/physical identity", JSON.stringify(requestStart));
}

const verdict = failures.length ? "FAIL" : (mode === "expect-red" ? "EXPECTED_FULL_WORKER_RED_REPRODUCED" : "PASS");
console.log(JSON.stringify({ mode, verdict, pass_count: passes.length, passes, failures, cases }, null, 2));
if (failures.length) process.exit(1);
