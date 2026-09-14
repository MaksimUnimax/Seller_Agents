import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const repo = path.resolve(process.argv[2] || ".");
const matrixPath = path.resolve(process.argv[3] || "FINAL_CONTROL_SAFETY_MATRIX.jsonl");
const dist = path.join(repo, "tooling", "llm-api-bridges", "ozon-seller", "dist-step7-candidate");

function load(relative) {
  const file = path.join(dist, relative);
  vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
}
function assert(condition, message, details = null) {
  if (!condition) {
    const suffix = details == null ? "" : `\n${JSON.stringify(details, null, 2)}`;
    throw new Error(`${message}${suffix}`);
  }
}

if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = (await import("node:util")).TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = (await import("node:util")).TextDecoder;

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

const rows = fs.readFileSync(matrixPath, "utf8")
  .split(/\r?\n/)
  .filter((line) => line.trim())
  .map((line, index) => {
    try { return JSON.parse(line); }
    catch (error) { throw new Error(`Invalid JSONL at line ${index + 1}: ${error.message}`); }
  });

assert(rows.length === 514, "Final control matrix must contain exactly 514 rows", { actual: rows.length });
const operationKeys = new Set();
for (const row of rows) {
  const key = `${row.api_family}:${String(row.method).toUpperCase()} ${row.path}`;
  assert(!operationKeys.has(key), "Duplicate operation in final control matrix", { key });
  operationKeys.add(key);
}

const READ_CLASSES = new Set([
  "READ_SAFE_DIRECT",
  "READ_SAFE_REPORT_START",
  "READ_SAFE_REPORT_STATUS",
  "READ_SAFE_REPORT_DOWNLOAD",
  "READ_SAFE_WITH_PRIVACY_GATE",
  "CONDITIONAL_READ"
]);

const byTransport = new Map();
const classCounts = {};
for (const row of rows) {
  const cls = String(row.final_accepted_class || "");
  classCounts[cls] = (classCounts[cls] || 0) + 1;
  const key = `${row.api_family}:${String(row.method).toUpperCase()} ${row.path}`;
  byTransport.set(key, row);
}

assert(classCounts.READ_SAFE_DIRECT === 211, "Final Direct count mismatch", classCounts);
assert(classCounts.READ_SAFE_REPORT_START === 29, "Final Report Start count mismatch", classCounts);
assert(classCounts.READ_SAFE_REPORT_STATUS === 15, "Final Report Status count mismatch", classCounts);
assert(classCounts.READ_SAFE_REPORT_DOWNLOAD === 2, "Final Report Download count mismatch", classCounts);
assert(classCounts.READ_SAFE_WITH_PRIVACY_GATE === 30, "Final Privacy count mismatch", classCounts);
assert(classCounts.CONDITIONAL_READ === 12, "Final Conditional count mismatch", classCounts);
assert(classCounts.MUTATION_BUSINESS_STATE === 183, "Final mutation count mismatch", classCounts);
assert(classCounts.DEPRECATED_OR_RETIRED === 32, "Final deprecated count mismatch", classCounts);

const finalReadable = rows.filter((row) => READ_CLASSES.has(String(row.final_accepted_class || "")));
assert(finalReadable.length === 299, "Final read-capable count must be 299", { actual: finalReadable.length });

const Registry = globalThis.OzonOperationRegistry;
const Contract = globalThis.OzonContract;
assert(Registry && Contract, "Patched registry/contract not loaded");
assert(Registry.catalogValidation(Contract.OPERATIONS).ok === true, "Patched registry/contract catalog mismatch", Registry.catalogValidation(Contract.OPERATIONS));

const enabledAliasesByTransport = new Map();
const unsafeEnabled = [];
const deprecatedEnabled = [];
const noSwaggerTarget = [];
const internalAliases = [];

for (const [alias, meta] of Object.entries(Registry.OPERATIONS)) {
  if (meta?.execution_enabled !== true) continue;
  const provider = String(meta.provider || "seller_api");
  if (provider === "report_file") {
    internalAliases.push(alias);
    continue;
  }
  const family = provider === "performance_api" ? "PERFORMANCE" : provider === "seller_api" ? "SELLER" : null;
  assert(family, "Unknown enabled provider in patched registry", { alias, provider });
  const transportKey = `${family}:${String(meta.method).toUpperCase()} ${meta.path}`;
  const row = byTransport.get(transportKey);
  if (!row) {
    noSwaggerTarget.push({ alias, transportKey });
    continue;
  }
  if (String(row.final_accepted_class) === "MUTATION_BUSINESS_STATE") unsafeEnabled.push({ alias, transportKey });
  if (String(row.final_accepted_class) === "DEPRECATED_OR_RETIRED") deprecatedEnabled.push({ alias, transportKey });
  if (!enabledAliasesByTransport.has(transportKey)) enabledAliasesByTransport.set(transportKey, []);
  enabledAliasesByTransport.get(transportKey).push(alias);
}

assert(noSwaggerTarget.length === 0, "Enabled Seller/Performance aliases without current Swagger target", noSwaggerTarget);
assert(unsafeEnabled.length === 0, "Mutation operations exposed by patched registry", unsafeEnabled);
assert(deprecatedEnabled.length === 0, "Deprecated/retired operations exposed by patched registry", deprecatedEnabled);

const missingReadable = [];
for (const row of finalReadable) {
  const key = `${row.api_family}:${String(row.method).toUpperCase()} ${row.path}`;
  const aliases = enabledAliasesByTransport.get(key) || [];
  if (!aliases.length) missingReadable.push({ inventory_index: row.inventory_index, operation_key: row.operation_key || key, final_class: row.final_accepted_class });
}
assert(missingReadable.length === 0, "Final read-capable Swagger operations missing from patched registry", missingReadable);

const duplicateReadMappings = [...enabledAliasesByTransport.entries()]
  .filter(([key, aliases]) => READ_CLASSES.has(String(byTransport.get(key)?.final_accepted_class || "")) && aliases.length > 1)
  .map(([key, aliases]) => ({ operation_key: key, aliases: [...aliases].sort() }));

const ADDED_EXPECTED = new Set([
  "PERFORMANCE:POST /api/client/statistic/orders/generate",
  "PERFORMANCE:POST /api/client/statistic/products/generate",
  "PERFORMANCE:POST /api/client/statistics",
  "PERFORMANCE:GET /api/client/statistics/all_sku_promo/orders/generate",
  "PERFORMANCE:GET /api/client/statistics/all_sku_promo/products/generate",
  "PERFORMANCE:POST /api/client/statistics/attribution",
  "PERFORMANCE:POST /api/client/statistics/phrases",
  "PERFORMANCE:POST /api/client/statistics/video",
  "PERFORMANCE:POST /api/client/vendors/statistics",
  "SELLER:POST /v1/analytics/decommissioned-goods",
  "SELLER:POST /v1/description-category/dependent-attributes",
  "SELLER:POST /v1/description-category/dependent-attributes/values",
  "SELLER:POST /v1/notification/check"
]);
for (const key of ADDED_EXPECTED) assert((enabledAliasesByTransport.get(key) || []).length > 0, "Expected newly added endpoint is not exposed", { key });

const FORBIDDEN_OLD = new Set([
  "SELLER:POST /v1/product/quant/list",
  "SELLER:POST /v1/product/quant/info",
  "PERFORMANCE:GET /api/client/statistics/expense/json",
  "PERFORMANCE:GET /api/client/statistics/daily/json",
  "PERFORMANCE:GET /api/client/statistics/campaign/product/json",
  "PERFORMANCE:GET /api/client/statistics/campaign/media/json",
  "SELLER:POST /v2/analytics/stock_on_warehouses"
]);
for (const key of FORBIDDEN_OLD) assert((enabledAliasesByTransport.get(key) || []).length === 0, "Removed/deprecated endpoint still exposed", { key, aliases: enabledAliasesByTransport.get(key) || [] });

const result = {
  verdict: "PASS",
  matrix_rows: rows.length,
  unique_swagger_operations: operationKeys.size,
  final_read_capable_operations: finalReadable.length,
  read_capable_operations_with_enabled_alias: finalReadable.length - missingReadable.length,
  missing_read_capable_operations: missingReadable.length,
  enabled_mutation_exposures: unsafeEnabled.length,
  enabled_deprecated_exposures: deprecatedEnabled.length,
  enabled_aliases_without_current_swagger_target: noSwaggerTarget.length,
  patched_registry_aliases_total: Object.keys(Registry.OPERATIONS).length,
  enabled_current_swagger_transports: enabledAliasesByTransport.size,
  internal_non_swagger_aliases: internalAliases.sort(),
  duplicate_read_transport_mappings: duplicateReadMappings,
  class_counts: classCounts
};
console.log("OZON_FINAL_514_PATCHED_REGISTRY_GATE_PASS");
console.log(JSON.stringify(result, null, 2));
