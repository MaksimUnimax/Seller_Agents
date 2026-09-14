import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { TextEncoder, TextDecoder } from "node:util";

const mode = process.argv.includes("--expect-red") ? "expect-red" : "candidate-green";
const rootArg = process.argv.filter((arg) => !arg.startsWith("--"))[2] || ".";
const root = path.resolve(rootArg);
const dist = path.join(root, "dist-step7-candidate");
const failures = [];
const passes = [];
const diagnostics = [];

function check(condition, label, detail = "") {
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? `: ${detail}` : ""}`);
}
function capture(label, fn) {
  try { return { ok: true, value: fn() }; }
  catch (error) {
    return { ok: false, error: { code: String(error?.code || ""), message: String(error?.message || error) }, label };
  }
}
function load(relative) {
  const file = path.join(dist, relative);
  vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
}
function clearGlobals() {
  for (const key of [
    "OzonRuntime", "OzonOperationRegistry", "OzonEntitlements", "OzonContract", "OzonGuidance",
    "OzonCredentials", "ProviderTransportCore", "OzonProvider", "OzonProviderFactory",
    "OzonSwaggerReadSurfacePatch", "__OZON_SWAGGER_READ_SURFACE_PATCH_20260913__"
  ]) {
    try { delete globalThis[key]; } catch (_) {}
  }
}

if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;
clearGlobals();

for (const file of [
  "shared/runtime_names.js",
  "shared/ozon_operation_registry.js",
  "shared/ozon_entitlements.js",
  "shared/ozon_contract.js",
  "shared/ozon_guidance.js",
  "shared/ozon_credentials.js",
  "shared/provider_transport_core.js",
  "shared/ozon_provider.js",
  "shared/swagger_read_surface_patch.js"
]) load(file);

const Contract = globalThis.OzonContract;
const Surface = globalThis.OzonSwaggerReadSurfacePatch;
if (!Contract || !Surface) throw new Error("Patched Ozon contract did not load.");

const REPORTS = Object.freeze({
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

// Prove this gate models the exact pre-dispatch order that failed live.
const workerSource = fs.readFileSync(path.join(dist, "service_worker.js"), "utf8");
const markers = [
  "const requestedPhysicalCommand = entry.execution_command || entry.command;",
  "readAnalyticsResultCacheForCurrentSettings(requestedPhysicalCommand)",
  "OzonContract.reviewedAnalyticsAcquisitionProfile(requestedPhysicalCommand)",
  "prepareProviderQuotaForCommand(physicalCommandForQuota)",
  "BATCH_REQUEST_STARTED",
  "executeOzonCore(liveEntry.command_text"
];
const positions = markers.map((marker) => workerSource.indexOf(marker));
check(positions.every((value) => value >= 0) && positions.every((value, index) => index === 0 || value > positions[index - 1]),
  "RUNTIME-00 actual service-worker predispatch order frozen", JSON.stringify({ markers, positions }));

const redRows = [];
const greenRows = [];
for (const [alias, params] of Object.entries(REPORTS)) {
  const command = { operation: alias, params };
  const normalized = capture(`${alias}:normalize`, () => Contract.normalizeCommand(command));
  check(normalized.ok, `RUNTIME-01 normalize ${alias}`, normalized.ok ? "" : JSON.stringify(normalized.error));
  if (!normalized.ok) continue;

  const text = `${Contract.PREFIX}\n${JSON.stringify(command)}`;
  const discovery = capture(`${alias}:discover`, () => Contract.discoverCommands(text));
  check(discovery.ok && discovery.value.length === 1 && discovery.value[0]?.ok === true,
    `RUNTIME-02 discovery ${alias}`, discovery.ok ? JSON.stringify(discovery.value) : JSON.stringify(discovery.error));

  const requirement = capture(`${alias}:sellerCapabilityRequirement`, () => Contract.sellerCapabilityRequirement(normalized.value, Date.now(), null));
  const plan = capture(`${alias}:plan`, () => Contract.planCommandForSellerCapability(normalized.value,
    { status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false, probe_http_status: 0, probe_error_code: null }, Date.now(), null));
  const coalescing = capture(`${alias}:analyticsCoalescingDescriptor`, () => Contract.analyticsCoalescingDescriptor(plan.ok ? plan.value.command : normalized.value));
  const acquisition = capture(`${alias}:reviewedAnalyticsAcquisitionProfile`, () => Contract.reviewedAnalyticsAcquisitionProfile(plan.ok ? plan.value.command : normalized.value));
  const preflight = capture(`${alias}:preflight`, () => Contract.preflightExecution(plan.ok ? plan.value.command : normalized.value));
  const request = capture(`${alias}:buildPerformanceRequest`, () => Contract.buildPerformanceRequest(plan.ok ? plan.value.command : normalized.value, { Authorization: "Bearer TEST" }));

  const row = {
    alias,
    requirement: requirement.ok ? { ok: true, value: requirement.value } : { ok: false, error: requirement.error },
    plan: plan.ok ? { ok: true, action: plan.value.action, planning: plan.value.planning } : { ok: false, error: plan.error },
    coalescing: coalescing.ok ? { ok: true, eligible: coalescing.value?.eligible === true } : { ok: false, error: coalescing.error },
    acquisition: acquisition.ok ? { ok: true, applicable: acquisition.value?.applicable === true } : { ok: false, error: acquisition.error },
    preflight: preflight.ok ? { ok: true, provider: preflight.value?.meta?.provider || null } : { ok: false, error: preflight.error },
    request: request.ok ? { ok: true, method: request.value?.method || null, path: request.value?.path || null } : { ok: false, error: request.error }
  };
  diagnostics.push(row);

  const staleClosureObserved = [requirement, coalescing, acquisition].some((result) => !result.ok && result.error?.code === "UNSUPPORTED_OPERATION");
  if (mode === "expect-red") {
    redRows.push({ alias, staleClosureObserved, row });
    check(staleClosureObserved, `RED-RUNTIME stale closed-set consumer reproduced ${alias}`, JSON.stringify(row));
    check(plan.ok && plan.value.action === "execute", `RED-RUNTIME planning still accepts ${alias}`, plan.ok ? String(plan.value.action) : JSON.stringify(plan.error));
    check(preflight.ok && preflight.value?.meta?.provider === "performance_api", `RED-RUNTIME public preflight accepts ${alias}`);
    check(request.ok, `RED-RUNTIME request builder accepts ${alias}`, request.ok ? "" : JSON.stringify(request.error));
  } else {
    greenRows.push({ alias, row });
    check(requirement.ok, `GREEN-RUNTIME seller capability consumer accepts ${alias}`, JSON.stringify(requirement.error || {}));
    check(plan.ok && plan.value.action === "execute", `GREEN-RUNTIME planner accepts ${alias}`, plan.ok ? String(plan.value.action) : JSON.stringify(plan.error));
    check(coalescing.ok && coalescing.value?.eligible !== true, `GREEN-RUNTIME coalescing consumer safely returns not-applicable ${alias}`, coalescing.ok ? JSON.stringify(coalescing.value) : JSON.stringify(coalescing.error));
    check(acquisition.ok && acquisition.value?.applicable !== true, `GREEN-RUNTIME acquisition consumer safely returns not-applicable ${alias}`, acquisition.ok ? JSON.stringify(acquisition.value) : JSON.stringify(acquisition.error));
    check(preflight.ok && preflight.value?.meta?.provider === "performance_api", `GREEN-RUNTIME preflight routes Performance ${alias}`);
    check(request.ok, `GREEN-RUNTIME request builder accepts ${alias}`, request.ok ? "" : JSON.stringify(request.error));
  }
}

// Test-10 reproduction/instrumentation. This command uses the exact live input that exposed a logical/physical mismatch.
const test10 = { operation: "description_category_dependent_attribute_values", params: {
  parent_attribute_id: 85,
  child_attribute_id: 10096,
  description_category_id: 87515080,
  type_id: 93733,
  limit: 1
}};
const t10Normalized = capture("test10:normalize", () => Contract.normalizeCommand(test10));
const t10LogicalFp = t10Normalized.ok ? Contract.commandFingerprint(t10Normalized.value) : null;
const t10Requirement = t10Normalized.ok ? capture("test10:requirement", () => Contract.sellerCapabilityRequirement(t10Normalized.value, Date.now(), null)) : { ok: false };
const t10Plan = t10Normalized.ok ? capture("test10:plan", () => Contract.planCommandForSellerCapability(t10Normalized.value,
  { status: "not_needed", subscription_type: "UNKNOWN", is_premium: null, probe_performed: false, probe_http_status: 0, probe_error_code: null }, Date.now(), null)) : { ok: false };
const t10Planned = t10Plan.ok ? t10Plan.value.command : null;
const t10PlannedFp = t10Planned ? Contract.commandFingerprint(t10Planned) : null;
const t10Coalescing = t10Planned ? capture("test10:coalescing", () => Contract.analyticsCoalescingDescriptor(t10Planned)) : { ok: false };
const t10Acquisition = t10Planned ? capture("test10:acquisition", () => Contract.reviewedAnalyticsAcquisitionProfile(t10Planned)) : { ok: false };
const t10Physical = t10Acquisition.ok && t10Acquisition.value?.applicable === true ? t10Acquisition.value.command : t10Planned;
const t10PhysicalFp = t10Physical ? Contract.commandFingerprint(t10Physical) : null;
const t10Diagnostic = {
  normalized_ok: t10Normalized.ok,
  requirement: t10Requirement.ok ? t10Requirement.value : t10Requirement.error,
  plan_ok: t10Plan.ok,
  logical_command: t10Normalized.ok ? t10Normalized.value : null,
  logical_fingerprint: t10LogicalFp,
  planned_command: t10Planned,
  planned_fingerprint: t10PlannedFp,
  planning: t10Plan.ok ? t10Plan.value.planning : null,
  coalescing: t10Coalescing.ok ? t10Coalescing.value : t10Coalescing.error,
  acquisition: t10Acquisition.ok ? t10Acquisition.value : t10Acquisition.error,
  physical_command: t10Physical,
  physical_fingerprint: t10PhysicalFp,
  live_observed_physical_fingerprint: "cd4bce38"
};
diagnostics.push({ test10: t10Diagnostic });
check(t10Normalized.ok && t10Plan.ok, "TEST10-01 deterministic planning available", JSON.stringify(t10Diagnostic));
if (mode === "candidate-green") {
  check(t10LogicalFp === t10PlannedFp && t10LogicalFp === t10PhysicalFp,
    "TEST10-02 deterministic exact-request preservation", JSON.stringify(t10Diagnostic));
  check(t10Plan.value?.planning?.entitlement?.exact_request_preserved !== false,
    "TEST10-03 planning must not claim request transformation without rule", JSON.stringify(t10Plan.value?.planning || null));
}

const output = { mode, verdict: failures.length ? "FAIL" : (mode === "expect-red" ? "EXPECTED_RED_REPRODUCED" : "PASS"), passes, failures, diagnostics };
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
