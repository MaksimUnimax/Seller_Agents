import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const mode = process.argv.includes("--baseline-red") ? "baseline-red" : "candidate-green";
const rootArg = process.argv.filter((arg) => !arg.startsWith("--"))[2] || ".";
const root = path.resolve(rootArg);
const dist = path.join(root, "dist-step7-candidate");
const failures = [];
const passes = [];

function check(condition, label, detail = "") {
  if (!condition) failures.push(`${label}${detail ? `: ${detail}` : ""}`);
  else passes.push(label);
}
function throws(fn, code = null) {
  try { fn(); return false; }
  catch (error) { return code ? String(error?.code || "") === code : true; }
}
function load(relative) {
  const file = path.join(dist, relative);
  const source = fs.readFileSync(file, "utf8");
  vm.runInThisContext(source, { filename: file });
}

if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = (await import("node:util")).TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = (await import("node:util")).TextDecoder;

load("shared/runtime_names.js");
load("shared/ozon_operation_registry.js");
load("shared/ozon_entitlements.js");
load("shared/ozon_contract.js");
load("shared/ozon_guidance.js");

const ADDED = Object.freeze([
  "performance_search_promo_orders_report_create",
  "performance_search_promo_products_report_create",
  "performance_statistics_report_create",
  "performance_all_sku_promo_orders_report_create",
  "performance_all_sku_promo_products_report_create",
  "performance_attribution_report_create",
  "performance_phrases_report_create",
  "performance_video_report_create",
  "performance_vendor_statistics_report_create",
  "analytics_decommissioned_goods",
  "description_category_dependent_attributes",
  "description_category_dependent_attribute_values",
  "notification_check"
]);
const REMOVED = Object.freeze([
  "product_quant_list",
  "product_quant_info",
  "performance_expense",
  "performance_daily",
  "performance_campaign_product",
  "performance_media",
  "stock_on_warehouses_v2"
]);
const REPORT_TARGETS = Object.freeze([
  ["performance_search_promo_orders_report_create", "POST", "/api/client/statistic/orders/generate"],
  ["performance_search_promo_products_report_create", "POST", "/api/client/statistic/products/generate"],
  ["performance_statistics_report_create", "POST", "/api/client/statistics"],
  ["performance_all_sku_promo_orders_report_create", "GET", "/api/client/statistics/all_sku_promo/orders/generate"],
  ["performance_all_sku_promo_products_report_create", "GET", "/api/client/statistics/all_sku_promo/products/generate"],
  ["performance_attribution_report_create", "POST", "/api/client/statistics/attribution"],
  ["performance_phrases_report_create", "POST", "/api/client/statistics/phrases"],
  ["performance_video_report_create", "POST", "/api/client/statistics/video"],
  ["performance_vendor_statistics_report_create", "POST", "/api/client/vendors/statistics"]
]);
const SENSITIVE = Object.freeze([
  "returns_utilization_history",
  "posting_marks",
  "fbs_posting_product_exemplar_status_v5",
  "fbs_product_exemplar_validate",
  "fbs_posting_product_exemplar_create_or_get_v6"
]);

if (mode === "baseline-red") {
  check(ADDED.every((alias) => !globalThis.OzonOperationRegistry.OPERATIONS[alias]), "RED-01 thirteen missing aliases reproduced");
  check(REMOVED.every((alias) => Boolean(globalThis.OzonOperationRegistry.OPERATIONS[alias])), "RED-02 seven stale/deprecated aliases reproduced");
  const blocked = new Set((globalThis.OzonContract.PERFORMANCE_ASYNC_REPORT_SIDE_EFFECT_BLOCKLIST || []).map((row) => `${row.method} ${row.path}`));
  check(REPORT_TARGETS.every(([, method, p]) => blocked.has(`${method} ${p}`)), "RED-03 nine false report blocks reproduced");
  check(globalThis.OzonOperationRegistry.OPERATIONS.returns_utilization_history?.policy_group !== "personal_data_read", "RED-04 utilization-history privacy gap reproduced");
  check(SENSITIVE.slice(1).every((alias) => globalThis.OzonOperationRegistry.OPERATIONS[alias]?.policy_group !== "personal_data_read"), "RED-05 marking-code sensitivity gap reproduced");
  if (failures.length) {
    console.error(JSON.stringify({ mode, verdict: "FAIL", passes, failures }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ mode, verdict: "EXPECTED_BASELINE_RED_REPRODUCED", passes, failures: [] }, null, 2));
  process.exit(0);
}

load("shared/ozon_credentials.js");
load("shared/provider_transport_core.js");
load("shared/ozon_provider.js");
load("shared/swagger_read_surface_patch.js");

const Registry = globalThis.OzonOperationRegistry;
const Contract = globalThis.OzonContract;
const Surface = globalThis.OzonSwaggerReadSurfacePatch;

check(Object.keys(Registry.OPERATIONS).length === 303, "GREEN-01 patched registry alias count 303", String(Object.keys(Registry.OPERATIONS).length));
check(ADDED.every((alias) => Registry.OPERATIONS[alias]?.execution_enabled === true && Contract.OPERATIONS[alias]?.execution_enabled === true), "GREEN-02 all 13 aliases installed and executable");
check(REMOVED.every((alias) => !Registry.OPERATIONS[alias] && !Contract.OPERATIONS[alias]), "GREEN-03 all seven stale/deprecated aliases absent");
check(!Object.values(Registry.OPERATIONS).some((meta) => meta.method === "POST" && meta.path === "/v2/order/create"), "GREEN-04 mutation control remains unavailable");
check(Contract.PERFORMANCE_MUTATION_BLOCKLIST.some((row) => row.path === "/api/client/campaign/search_promo/carrots/enable"), "GREEN-05 true Performance mutation blocklist preserved");

const falseBlocks = new Set((Contract.PERFORMANCE_ASYNC_REPORT_SIDE_EFFECT_BLOCKLIST || []).map((row) => `${row.method} ${row.path}`));
check(REPORT_TARGETS.every(([, method, p]) => !falseBlocks.has(`${method} ${p}`)), "GREEN-06 nine audited report starts removed from false blocklist");

const validSamples = Object.freeze({
  performance_search_promo_orders_report_create: { from: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" },
  performance_search_promo_products_report_create: { from: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" },
  performance_statistics_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02", groupBy: "DATE" },
  performance_all_sku_promo_orders_report_create: { "timeBounds.from": "2026-09-01T00:00:00Z", "timeBounds.to": "2026-09-02T00:00:00Z" },
  performance_all_sku_promo_products_report_create: { "timeBounds.from": "2026-09-01T00:00:00Z", "timeBounds.to": "2026-09-02T00:00:00Z" },
  performance_attribution_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02" },
  performance_phrases_report_create: { dateFrom: "2026-09-01", dateTo: "2026-09-02" },
  performance_video_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02", groupBy: "NO_GROUP_BY" },
  performance_vendor_statistics_report_create: { dateFrom: "2026-09-01", dateTo: "2026-09-02", type: "ORDERS" }
});
for (const [alias, method, p] of REPORT_TARGETS) {
  try {
    const request = Contract.buildPerformanceRequest({ operation: alias, params: validSamples[alias] }, { Authorization: "Bearer TEST" });
    check(request.method === method && request.path === p && String(request.url).startsWith("https://api-performance.ozon.ru"), `GREEN-07 exact Performance route ${alias}`);
  } catch (error) { check(false, `GREEN-07 exact Performance route ${alias}`, `${error.code || ""} ${error.message || error}`); }
}
check(Contract.buildPerformanceRequest({ operation: "performance_phrases_report_create", params: validSamples.performance_phrases_report_create }, {}).path === "/api/client/statistics/phrases", "GREEN-08 phrases control exact route");
check(throws(() => Contract.normalizeCommand({ operation: "performance_statistics_report_create", params: { campaigns: ["1"], dateFrom: "2026-02-30", dateTo: "2026-03-01" } })), "GREEN-09 invalid report date rejected locally");
check(throws(() => Contract.normalizeCommand({ operation: "performance_vendor_statistics_report_create", params: { type: "BAD" } })), "GREEN-10 invalid report enum rejected locally");

for (const alias of SENSITIVE) {
  const meta = Registry.OPERATIONS[alias];
  check(meta?.policy_group === "personal_data_read" && meta?.default_allowed === false && meta?.guidance_visibility === "conditional", `GREEN-11 sensitive gate ${alias}`);
}

const notificationGood = Contract.buildRequest({ operation: "notification_check", params: { url: "https://example.com/hook" } }, { "Client-Id": "1", "Api-Key": "x" });
check(notificationGood.url === "https://api-seller.ozon.ru/v1/notification/check" && notificationGood.method === "POST", "GREEN-12 notification Bridge transport fixed to Seller API");
check(JSON.parse(notificationGood.body).url === "https://example.com/hook", "GREEN-13 notification target carried only as provider parameter");
for (const bad of [
  "http://example.com/hook",
  "https://localhost/hook",
  "https://127.0.0.1/hook",
  "https://[::1]/hook",
  "https://user:pass@example.com/hook",
  "https://example.com:8443/hook"
]) check(throws(() => Contract.normalizeCommand({ operation: "notification_check", params: { url: bad } })), `GREEN-14 notification unsafe URL rejected ${bad}`);

try {
  const etgbParams = Registry.OPERATIONS.posting_global_etgb.template.params;
  const etgb = Contract.sanitizeResult({ operation: "posting_global_etgb", params: etgbParams }, { file_url: "https://cdn.example.com/a.csv", nested: { href: "https://cdn.example.com/b.csv" }, safe: "ok" });
  check(etgb.file_url === "[REDACTED_URL]" && etgb.nested.href === "[REDACTED_URL]" && etgb.safe === "ok", "GREEN-15 posting_global_etgb URL redaction");
} catch (error) { check(false, "GREEN-15 posting_global_etgb URL redaction", String(error?.message || error)); }
try {
  const invoiceParams = Registry.OPERATIONS.invoice_get.template.params;
  const invoice = Contract.sanitizeResult({ operation: "invoice_get", params: invoiceParams }, { download_url: "https://cdn.example.com/i.pdf", id: "1" });
  check(invoice.download_url === "[REDACTED_URL]" && invoice.id === "1", "GREEN-16 invoice URL redaction");
} catch (error) { check(false, "GREEN-16 invoice URL redaction", String(error?.message || error)); }

check(!throws(() => Contract.normalizeCommand({ operation: "cargoes_label_transport_status", params: { operation_id: "op-1" } })), "GREEN-17 proven operation_id preserved");
check(throws(() => Contract.normalizeCommand({ operation: "cargoes_label_transport_status", params: { operation_idd: "op-1" } })), "GREEN-18 Swagger typo operation_idd rejected");
check(Registry.catalogValidation(Contract.OPERATIONS).ok === true, "GREEN-19 registry-contract catalog parity");

for (const alias of ADDED) {
  const params = alias.startsWith("performance_") ? (validSamples[alias] || {})
    : alias === "analytics_decommissioned_goods" ? { filter: { date_from: "2026-09-01T00:00:00Z", date_to: "2026-09-02T00:00:00Z", delivery_schema: "FBO" }, page: 0, page_size: 10 }
    : alias === "description_category_dependent_attributes" ? { description_category_id: 1 }
    : alias === "description_category_dependent_attribute_values" ? { parent_attribute_id: 1, child_attribute_id: 2, limit: 100 }
    : { url: "https://example.com/hook" };
  const text = `${Contract.PREFIX} ${JSON.stringify({ operation: alias, params })}`;
  const found = Contract.discoverCommands(text);
  check(found.length === 1 && found[0].ok === true && found[0].command.operation === alias, `GREEN-20 parser/discovery accepts ${alias}`);
}
for (const alias of REMOVED) {
  const text = `${Contract.PREFIX} ${JSON.stringify({ operation: alias, params: {} })}`;
  const found = Contract.discoverCommands(text);
  check(found.length === 1 && found[0].ok === false, `GREEN-21 parser/discovery rejects removed ${alias}`);
}

const adChoices = globalThis.OzonGuidance.result({ status: "ok", cluster: "advertising_performance", section: "statistics", version: 2 }).choices || [];
check(REPORT_TARGETS.every(([alias]) => adChoices.some((choice) => choice.operation === alias)), "GREEN-22 guidance exposes all nine new Performance report starts");
check(!adChoices.some((choice) => ["performance_expense", "performance_daily", "performance_campaign_product", "performance_media"].includes(choice.operation)), "GREEN-23 guidance omits removed Performance JSON aliases");

for (const [alias] of REPORT_TARGETS) {
  check(!throws(() => Contract.verifyProviderResponse({ operation: alias, params: validSamples[alias] }, { UUID: "12345678-1234-1234-1234-123456789012", vendor: alias.includes("vendor") })), `GREEN-24 response UUID accepted ${alias}`);
  check(throws(() => Contract.verifyProviderResponse({ operation: alias, params: validSamples[alias] }, { state: "OK" }), "PROVIDER_RESPONSE_CONTRACT_MISMATCH"), `GREEN-25 missing UUID rejected ${alias}`);
}
check(!throws(() => Contract.verifyProviderResponse({ operation: "notification_check", params: { url: "https://example.com" } }, { is_active: true, errors: [] })), "GREEN-26 notification response shape accepted");
check(throws(() => Contract.verifyProviderResponse({ operation: "notification_check", params: { url: "https://example.com" } }, { is_active: "yes" }), "PROVIDER_RESPONSE_CONTRACT_MISMATCH"), "GREEN-27 notification invalid response rejected");

// Provider transport proof: exactly one Performance auth request and one business request; no hidden status poll/retry/fan-out.
try {
  let authRequests = 0;
  let businessRequests = 0;
  const seenUrls = [];
  const fakeFetch = async (url) => {
    const text = String(url);
    seenUrls.push(text);
    if (text.includes("/api/client/token")) {
      authRequests += 1;
      return new Response(JSON.stringify({ access_token: "TOKEN", token_type: "Bearer", expires_in: 3600 }), { status: 200, headers: { "content-type": "application/json" } });
    }
    businessRequests += 1;
    return new Response(JSON.stringify({ UUID: "12345678-1234-1234-1234-123456789012", vendor: false }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const provider = globalThis.OzonProviderFactory.createOzonProvider({ contract: Contract, fetchImpl: fakeFetch, uuid: () => "req-1", now: () => Date.parse("2026-09-13T09:00:00Z") });
  const result = await provider.executeCommandObject({ operation: "performance_phrases_report_create", params: validSamples.performance_phrases_report_create }, {}, { clientId: "client", clientSecret: "secret" });
  check(result.ok === true && authRequests === 1 && businessRequests === 1, "GREEN-28 exactly one Performance business request", `auth=${authRequests} business=${businessRequests} urls=${seenUrls.join("|")}`);
} catch (error) { check(false, "GREEN-28 exactly one Performance business request", `${error.code || ""} ${error.message || error}`); }

// Load the real output-continuation layers and prove next-command use of fresh UUID with no automatic continuation.
try {
  load("shared/bridge_autorun_model.js");
  load("shared/llm_output_report_workflow_patch.js");
  load("shared/performance_report_continuation_patch.js");
  const P = globalThis.OzonPerformanceReportContinuationPatch;
  const standard = P.performanceContinuation({ operation: "performance_phrases_report_create", http_status: 200, result: { UUID: "fresh-uuid-123" } }, 1);
  const vendor = P.performanceContinuation({ operation: "performance_vendor_statistics_report_create", http_status: 200, result: { UUID: "fresh-vendor-123", vendor: true } }, 1);
  const missing = P.performanceContinuation({ operation: "performance_phrases_report_create", http_status: 200, result: {} }, 1);
  check(standard?.next_command?.operation === "performance_statistics_status" && standard.next_command.params.UUID === "fresh-uuid-123" && standard.automatic_continuation === false, "GREEN-29 standard report continuation exact and manual");
  check(vendor?.next_command?.operation === "performance_vendor_statistics_status" && vendor.next_command.params.UUID === "fresh-vendor-123" && vendor.next_command.params.vendor === true && vendor.automatic_continuation === false, "GREEN-30 vendor report continuation exact and manual");
  check(missing?.state === "blocked_missing_fresh_uuid" && missing?.next_command === null, "GREEN-31 missing UUID fails closed");
} catch (error) { check(false, "GREEN-29/30/31 continuation layer loads", `${error.code || ""} ${error.message || error}`); }

// Loader order and package-boundary static assertions.
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(dist, "manifest.json"), "utf8"));
  const scripts = manifest.content_scripts?.[0]?.js || [];
  const registryAt = scripts.indexOf("shared/ozon_operation_registry.js");
  const contractAt = scripts.indexOf("shared/ozon_contract.js");
  const guidanceAt = scripts.indexOf("shared/ozon_guidance.js");
  const patchAt = scripts.indexOf("shared/swagger_read_surface_patch.js");
  const contentAt = scripts.indexOf("content_script.js");
  check(registryAt >= 0 && contractAt > registryAt && guidanceAt > contractAt && patchAt > guidanceAt && contentAt > patchAt, "GREEN-32 content loader order correct");
  const workerEntry = fs.readFileSync(path.join(dist, "service_worker_entry.js"), "utf8");
  const workerAt = workerEntry.indexOf('importScripts("service_worker.js")');
  const surfaceAt = workerEntry.indexOf('importScripts("shared/swagger_read_surface_patch.js")');
  const outputAt = workerEntry.indexOf('importScripts("shared/llm_output_report_workflow_patch.js")');
  const continuationAt = workerEntry.indexOf('importScripts("shared/performance_report_continuation_patch.js")');
  check(workerAt >= 0 && surfaceAt > workerAt && outputAt > surfaceAt && continuationAt > outputAt, "GREEN-33 worker loader order correct");
} catch (error) { check(false, "GREEN-32/33 loader assertions", String(error?.message || error)); }

if (failures.length) {
  console.error(JSON.stringify({ mode, verdict: "FAIL", pass_count: passes.length, passes, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ mode, verdict: "PASS", pass_count: passes.length, passes, failures: [] }, null, 2));
