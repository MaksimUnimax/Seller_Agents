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
function clear() { for (const key of ["OzonRuntime","OzonOperationRegistry","OzonEntitlements","OzonContract","OzonContractFactory","OzonGuidance","OzonCredentials","ProviderTransportCore","OzonProvider","OzonProviderFactory","OzonSwaggerReadSurfacePatch","__OZON_SWAGGER_READ_SURFACE_PATCH_20260913__"]) { try { delete globalThis[key]; } catch (_) {} } }
function capture(fn) { try { return { ok: true, value: fn() }; } catch (error) { return { ok: false, error: { code: String(error?.code || ""), message: String(error?.message || error), external_request_executed: error?.external_request_executed ?? null } }; } }
function stable(value) { return JSON.stringify(value); }
function parity(label, leftFn, rightFn) {
  const left = capture(leftFn); const right = capture(rightFn);
  check(stable(left) === stable(right), label, JSON.stringify({ base: left, patched: right }));
}
if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;
clear();
for (const file of ["shared/runtime_names.js","shared/ozon_operation_registry.js","shared/ozon_entitlements.js","shared/ozon_contract.js","shared/ozon_guidance.js"]) load(file);
const BaseRegistry = globalThis.OzonOperationRegistry;
const Base = globalThis.OzonContract;
const baseAliases = Object.keys(Base.OPERATIONS).sort();
for (const file of ["shared/ozon_credentials.js","shared/provider_transport_core.js","shared/ozon_provider.js","shared/swagger_read_surface_patch.js"]) load(file);
const Patched = globalThis.OzonContract;
const Surface = globalThis.OzonSwaggerReadSurfacePatch;
if (!Base || !Patched || !Surface) throw new Error("contract authorities missing");

const removed = new Set(Surface.REMOVED_ALIASES || []);
const retainedBase = baseAliases.filter((alias) => !removed.has(alias));
check(retainedBase.every((alias) => Object.prototype.hasOwnProperty.call(Patched.OPERATIONS, alias)), "PARITY-00 all non-removed base aliases retained");
check((Surface.REMOVED_ALIASES || []).every((alias) => !Patched.OPERATIONS[alias]), "PARITY-01 removed aliases remain absent");
check((Surface.ADDED_ALIASES || []).length === 13, "PARITY-02 exact 13 added aliases");
check(Object.keys(BaseRegistry.OPERATIONS).length - removed.size + (Surface.ADDED_ALIASES || []).length === Object.keys(Patched.OPERATIONS).length, "PARITY-03 registry cardinality transition exact");

const atMs = Date.parse("2026-09-13T12:00:00Z");
const profile = { status: "known", subscription_type: "PREMIUM_PRO", is_premium: true, probe_performed: false, probe_http_status: 0, probe_error_code: null };
const analyticsA = { operation: "analytics_data", params: { date_from: "2026-09-01", date_to: "2026-09-02", dimension: ["sku"], metrics: ["revenue"], limit: 1000 } };
const analyticsB = { operation: "analytics_data", params: { date_from: "2026-09-01", date_to: "2026-09-02", dimension: ["sku"], metrics: ["ordered_units"], limit: 1000 } };
const performanceOld = { operation: "performance_bid_limits", params: {} };
const sellerOld = { operation: "supplier_available_warehouses", params: {} };
const representatives = [
  ["analytics_data", analyticsA],
  ["performance_bid_limits", performanceOld],
  ["supplier_available_warehouses", sellerOld]
];
for (const [name, command] of representatives) {
  parity(`PARITY-${name}-normalize`, () => Base.normalizeCommand(command), () => Patched.normalizeCommand(command));
  parity(`PARITY-${name}-preflight`, () => Base.preflightExecution(command), () => Patched.preflightExecution(command));
  parity(`PARITY-${name}-coalescing`, () => Base.analyticsCoalescingDescriptor(command), () => Patched.analyticsCoalescingDescriptor(command));
  parity(`PARITY-${name}-acquisition`, () => Base.reviewedAnalyticsAcquisitionProfile(command), () => Patched.reviewedAnalyticsAcquisitionProfile(command));
  parity(`PARITY-${name}-requirement`, () => Base.sellerCapabilityRequirement(command, atMs, null), () => Patched.sellerCapabilityRequirement(command, atMs, null));
  parity(`PARITY-${name}-planning`, () => Base.planCommandForSellerCapability(command, profile, atMs, null), () => Patched.planCommandForSellerCapability(command, profile, atMs, null));
  parity(`PARITY-${name}-fingerprint`, () => Base.commandFingerprint(command), () => Patched.commandFingerprint(command));
}
parity("PARITY-analytics-coalesced-command", () => Base.buildAnalyticsCoalescedCommand([analyticsA, analyticsB]), () => Patched.buildAnalyticsCoalescedCommand([analyticsA, analyticsB]));
parity("PARITY-existing-performance-request", () => Base.buildPerformanceRequest(performanceOld, { Authorization: "Bearer TEST" }), () => Patched.buildPerformanceRequest(performanceOld, { Authorization: "Bearer TEST" }));
parity("PARITY-existing-seller-request", () => Base.buildRequest(sellerOld, { "Client-Id": "1", "Api-Key": "x" }), () => Patched.buildRequest(sellerOld, { "Client-Id": "1", "Api-Key": "x" }));

const source = fs.readFileSync(path.join(dist, "shared/swagger_read_surface_patch.js"), "utf8");
for (const method of ["analyticsCoalescingDescriptor","buildAnalyticsCoalescedCommand","reviewedAnalyticsAcquisitionProfile","sellerCapabilityRequirement","planCommandForSellerCapability"]) {
  check(source.includes(`patchedBaseContract.${method}`), `PARITY-DELEGATION source delegates ${method}`);
}

const output = { verdict: failures.length ? "FAIL" : "PASS", base_aliases: baseAliases.length, retained_base_aliases: retainedBase.length, passes, failures };
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
console.log("OZON_SHARED_CONSUMER_PARITY_GATE_PASS");
