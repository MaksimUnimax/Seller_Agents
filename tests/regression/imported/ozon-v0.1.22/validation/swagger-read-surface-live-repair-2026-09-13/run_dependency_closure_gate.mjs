import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { TextEncoder, TextDecoder } from "node:util";

const root = path.resolve(process.argv[2] || ".");
const dist = path.join(root, "dist-step7-candidate");
const failures = [];
const passes = [];
function check(ok, label, detail = "") { if (ok) passes.push(label); else failures.push(`${label}${detail ? `: ${detail}` : ""}`); }
function load(rel) { const file = path.join(dist, rel); vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file }); }
function capture(fn) { try { return { ok: true, value: fn() }; } catch (error) { return { ok: false, error: { code: String(error?.code || ""), message: String(error?.message || error) } }; } }
if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;
for (const file of ["shared/runtime_names.js","shared/ozon_operation_registry.js","shared/ozon_entitlements.js","shared/ozon_contract.js","shared/ozon_guidance.js","shared/ozon_credentials.js","shared/provider_transport_core.js","shared/ozon_provider.js","shared/swagger_read_surface_patch.js"]) load(file);
const Contract = globalThis.OzonContract;
const Registry = globalThis.OzonOperationRegistry;
const Surface = globalThis.OzonSwaggerReadSurfacePatch;
const expectedAdded = [
  "performance_search_promo_orders_report_create","performance_search_promo_products_report_create","performance_statistics_report_create","performance_all_sku_promo_orders_report_create","performance_all_sku_promo_products_report_create","performance_attribution_report_create","performance_phrases_report_create","performance_video_report_create","performance_vendor_statistics_report_create","analytics_decommissioned_goods","description_category_dependent_attributes","description_category_dependent_attribute_values","notification_check"
].sort();
const expectedRemoved = ["product_quant_list","product_quant_info","performance_expense","performance_daily","performance_campaign_product","performance_media","stock_on_warehouses_v2"].sort();
check(JSON.stringify([...(Surface.ADDED_ALIASES || [])].sort()) === JSON.stringify(expectedAdded), "CLOSURE-00 added alias set exact");
check(JSON.stringify([...(Surface.REMOVED_ALIASES || [])].sort()) === JSON.stringify(expectedRemoved), "CLOSURE-01 removed alias set exact");
check(expectedAdded.every((alias) => Registry.OPERATIONS[alias]?.execution_enabled === true && Contract.OPERATIONS[alias]?.execution_enabled === true), "CLOSURE-02 all added aliases installed/enabled");
check(expectedRemoved.every((alias) => !Registry.OPERATIONS[alias] && !Contract.OPERATIONS[alias]), "CLOSURE-03 all removed aliases absent");

const fixtures = {
  performance_search_promo_orders_report_create: { from: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" },
  performance_search_promo_products_report_create: { from: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" },
  performance_statistics_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02", groupBy: "DATE" },
  performance_all_sku_promo_orders_report_create: { "timeBounds.from": "2026-09-01T00:00:00Z", "timeBounds.to": "2026-09-02T00:00:00Z" },
  performance_all_sku_promo_products_report_create: { "timeBounds.from": "2026-09-01T00:00:00Z", "timeBounds.to": "2026-09-02T00:00:00Z" },
  performance_attribution_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02" },
  performance_phrases_report_create: { dateFrom: "2026-09-01", dateTo: "2026-09-02" },
  performance_video_report_create: { campaigns: ["1"], dateFrom: "2026-09-01", dateTo: "2026-09-02", groupBy: "NO_GROUP_BY" },
  performance_vendor_statistics_report_create: { dateFrom: "2026-09-01", dateTo: "2026-09-02", type: "ORDERS" },
  analytics_decommissioned_goods: { filter: { date_from: "2026-09-01T00:00:00Z", date_to: "2026-09-02T00:00:00Z", delivery_schema: "FBO" }, page: 0, page_size: 10 },
  description_category_dependent_attributes: { description_category_id: 87515080, type_id: 93733 },
  description_category_dependent_attribute_values: { parent_attribute_id: 85, child_attribute_id: 10096, description_category_id: 87515080, type_id: 93733, limit: 1 },
  notification_check: { url: "https://example.com/hook" }
};
const sampleResults = {
  analytics_decommissioned_goods: { items: [], total_count: 0 },
  description_category_dependent_attributes: { result: [] },
  description_category_dependent_attribute_values: { result: [], cursor: "" },
  notification_check: { is_active: true, errors: [] }
};
const profile = { status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false, probe_http_status: 0, probe_error_code: null };
for (const alias of expectedAdded) {
  const command = { operation: alias, params: fixtures[alias] };
  const normalized = capture(() => Contract.normalizeCommand(command));
  check(normalized.ok, `CLOSURE-${alias}-normalize`, JSON.stringify(normalized.error || {}));
  if (!normalized.ok) continue;
  const discovered = capture(() => Contract.discoverCommands(`${Contract.PREFIX}\n${JSON.stringify(command)}`));
  check(discovered.ok && discovered.value.length === 1 && discovered.value[0]?.ok === true, `CLOSURE-${alias}-discover`, JSON.stringify(discovered.error || discovered.value));
  const requirement = capture(() => Contract.sellerCapabilityRequirement(normalized.value, Date.parse("2026-09-13T12:00:00Z"), null));
  check(requirement.ok, `CLOSURE-${alias}-capability-requirement`, JSON.stringify(requirement.error || {}));
  const plan = capture(() => Contract.planCommandForSellerCapability(normalized.value, profile, Date.parse("2026-09-13T12:00:00Z"), null));
  check(plan.ok && ["execute","reject"].includes(plan.value?.action), `CLOSURE-${alias}-planning`, JSON.stringify(plan.error || plan.value));
  const physical = plan.ok && plan.value?.command ? plan.value.command : normalized.value;
  const coalescing = capture(() => Contract.analyticsCoalescingDescriptor(physical));
  check(coalescing.ok, `CLOSURE-${alias}-coalescing-consumer`, JSON.stringify(coalescing.error || {}));
  const acquisition = capture(() => Contract.reviewedAnalyticsAcquisitionProfile(physical));
  check(acquisition.ok, `CLOSURE-${alias}-acquisition-consumer`, JSON.stringify(acquisition.error || {}));
  const preflight = capture(() => Contract.preflightExecution(physical));
  check(preflight.ok, `CLOSURE-${alias}-preflight`, JSON.stringify(preflight.error || {}));
  if (preflight.ok) {
    const provider = String(preflight.value?.meta?.provider || "seller_api");
    const request = capture(() => provider === "performance_api" ? Contract.buildPerformanceRequest(physical, { Authorization: "Bearer TEST" }) : Contract.buildRequest(physical, { "Client-Id": "1", "Api-Key": "x" }));
    check(request.ok && /^https:\/\/api-(?:performance|seller)\.ozon\.ru\//.test(String(request.value?.url || "")), `CLOSURE-${alias}-request-builder`, JSON.stringify(request.error || request.value));
  }
  const raw = alias.startsWith("performance_") ? { UUID: "12345678-1234-1234-1234-123456789012", vendor: alias === "performance_vendor_statistics_report_create" } : sampleResults[alias];
  const verified = capture(() => Contract.verifyProviderResponse(physical, raw));
  check(verified.ok, `CLOSURE-${alias}-response-contract`, JSON.stringify(verified.error || {}));
  const sanitized = capture(() => Contract.sanitizeResult(physical, raw));
  check(sanitized.ok, `CLOSURE-${alias}-sanitize`, JSON.stringify(sanitized.error || {}));
  if (sanitized.ok) {
    const formatted = capture(() => Contract.formatResultReport({ command: physical, requestId: `closure-${alias}`, requestMeta: { external_request_executed: true }, httpStatus: 200, elapsedMs: 1, result: sanitized.value, planning: plan.ok ? plan.value?.planning || null : null }));
    check(formatted.ok && String(formatted.value || "").startsWith(Contract.RESULT_PREFIX), `CLOSURE-${alias}-output`, JSON.stringify(formatted.error || {}));
  }
}

const affectedMethods = ["sellerCapabilityRequirement","planCommandForSellerCapability","analyticsCoalescingDescriptor","reviewedAnalyticsAcquisitionProfile"];
const runtimeConsumers = {};
for (const method of affectedMethods) runtimeConsumers[method] = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && file.endsWith(".js")) {
      const text = fs.readFileSync(file, "utf8");
      for (const method of affectedMethods) if (text.includes(`OzonContract.${method}`)) runtimeConsumers[method].push(path.relative(dist, file).replaceAll("\\", "/"));
    }
  }
}
walk(dist);
for (const [method, files] of Object.entries(runtimeConsumers)) {
  const unique = [...new Set(files)].sort();
  check(unique.every((file) => file === "service_worker.js"), `CLOSURE-runtime-consumers-${method}`, JSON.stringify(unique));
}
const worker = fs.readFileSync(path.join(dist, "service_worker.js"), "utf8");
for (const method of ["sellerCapabilityRequirement","planCommandForSellerCapability","analyticsCoalescingDescriptor","reviewedAnalyticsAcquisitionProfile"]) {
  check(worker.includes(`OzonContract.${method}`), `CLOSURE-worker-path-has-${method}`);
}

const output = { verdict: failures.length ? "FAIL" : "PASS", added_aliases: expectedAdded.length, removed_aliases: expectedRemoved.length, runtime_consumers: runtimeConsumers, passes, failures };
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
console.log("OZON_DEPENDENCY_CLOSURE_GATE_PASS");
