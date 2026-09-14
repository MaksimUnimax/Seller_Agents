import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const root = path.resolve(process.argv[2] || ".");
const dist = path.join(root, "dist-step7-candidate");
const failures = [];
const passes = [];
const NOW = 1_700_000_000_000;

function check(condition, label, detail = "") {
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? `: ${detail}` : ""}`);
}
async function rejects(fn, code = null) {
  try { await fn(); return false; }
  catch (error) { return code ? String(error?.code || "") === code : true; }
}
function load(relative) {
  const file = path.join(dist, relative);
  vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
}
function allJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...allJsFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}
function b64(bytes) { return Buffer.from(bytes).toString("base64"); }
function utf8(text) { return new TextEncoder().encode(text); }

if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = (await import("node:util")).TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = (await import("node:util")).TextDecoder;

let personalDataEnabled = false;
globalThis.chrome = {
  runtime: { id: "v0122-dependency-closure" },
  storage: {
    local: {
      async get(keys) {
        const values = { ozmb_personal_data_enabled_v1: personalDataEnabled };
        if (Array.isArray(keys)) return Object.fromEntries(keys.filter((key) => Object.prototype.hasOwnProperty.call(values, key)).map((key) => [key, values[key]]));
        if (typeof keys === "string") return Object.prototype.hasOwnProperty.call(values, keys) ? { [keys]: values[keys] } : {};
        return { ...values };
      },
      async set(values) {
        if (Object.prototype.hasOwnProperty.call(values || {}, "ozmb_personal_data_enabled_v1")) personalDataEnabled = values.ozmb_personal_data_enabled_v1 === true;
      }
    },
    session: { async get() { return {}; }, async set() {} }
  }
};

load("shared/runtime_names.js");
load("shared/ozon_operation_registry.js");
load("shared/ozon_entitlements.js");
load("shared/ozon_contract.js");
load("shared/ozon_credentials.js");
load("shared/provider_transport_core.js");
load("shared/ozon_provider.js");
load("shared/swagger_read_surface_patch.js");
load("shared/live_runtime_v0122_patch.js");
load("shared/xlsx_direct_binary_delivery_patch.js");
load("shared/direct_binary_file_delivery_patch.js");

const Contract = globalThis.OzonContract;
const Registry = globalThis.OzonOperationRegistry;
const Factory = globalThis.OzonProviderFactory;
const Repair = globalThis.OzonLiveRuntimeRepairV0122;
const Xlsx = globalThis.OzonXlsxDirectBinaryDeliveryPatch;
const Direct = globalThis.OzonDirectBinaryDeliveryPatch;
const Swagger = globalThis.OzonSwaggerReadSurfacePatch;
const TARGET = "performance_statistics_report_download";
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const UUID = "927f6bc2-af64-43ff-8ae9-943774396a95";

// GATE-07: enumerate every production file that knows about the provider factory.
const factoryConsumers = allJsFiles(dist)
  .filter((file) => fs.readFileSync(file, "utf8").includes("OzonProviderFactory"))
  .map((file) => path.relative(dist, file).replaceAll("\\", "/"))
  .sort();
const expectedFactoryConsumers = [
  "shared/live_runtime_v0122_patch.js",
  "shared/ozon_provider.js",
  "shared/swagger_read_surface_patch.js"
].sort();
check(JSON.stringify(factoryConsumers) === JSON.stringify(expectedFactoryConsumers), "CLOSURE-01 provider-factory consumer inventory is complete and closed", JSON.stringify(factoryConsumers));

// GATE-32: assert exact runtime composition order used by the installed MV3 worker.
const entryText = fs.readFileSync(path.join(dist, "service_worker_entry.js"), "utf8");
const order = [
  "service_worker.js",
  "shared/swagger_read_surface_patch.js",
  "shared/live_runtime_v0122_patch.js",
  "shared/xlsx_direct_binary_delivery_patch.js",
  "shared/direct_binary_file_delivery_patch.js"
].map((name) => entryText.indexOf(name));
check(order.every((value) => value >= 0) && order.every((value, index) => index === 0 || value > order[index - 1]), "CLOSURE-02 installed worker composes Swagger -> v0.1.22 -> XLSX -> generic binary in exact order", JSON.stringify(order));

// Overlay-sensitive privacy classification introduced by the Swagger patch.
check(Array.isArray(Swagger.SENSITIVE_GATE_ALIASES) && Swagger.SENSITIVE_GATE_ALIASES.includes("returns_utilization_history"), "CLOSURE-03 Swagger overlay sensitive set contains live-failed returns_utilization_history");
check(Registry.OPERATIONS.returns_utilization_history?.policy_group === "personal_data_read", "CLOSURE-04 overlay operation is classified as personal_data_read after composition");

async function providerProbe({ command, enabled, reportState = null, beforeExecute = null }) {
  let fetchCount = 0;
  let settingsReads = 0;
  const fakeFetch = async (url) => {
    fetchCount += 1;
    const text = String(url || "");
    if (text.includes("report-safe") || text.includes("report-personal")) {
      return new Response("a,b\n1,2\n", { status: 200, headers: { "content-type": "text/csv" } });
    }
    return new Response(JSON.stringify({ result: {} }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const store = reportState ? {
    async get() { return JSON.parse(JSON.stringify(reportState)); },
    async set() {}
  } : undefined;
  const base = Factory.createOzonProvider({
    contract: Contract,
    fetchImpl: fakeFetch,
    uuid: () => "closure-probe",
    now: () => NOW,
    ...(store ? { reportStateStore: store } : {})
  });
  let currentEnabled = enabled;
  const guarded = Repair.wrapProviderWithPersonalDataGuard(base, {
    settingsReader: async () => { settingsReads += 1; return { personalDataEnabled: currentEnabled }; }
  });
  if (typeof beforeExecute === "function") currentEnabled = await beforeExecute(currentEnabled);
  let error = null;
  let output = null;
  try { output = await guarded.executeCommandObject(command, { clientId: "123", apiKey: "test-key" }, {}); }
  catch (caught) { error = caught; }
  return { fetchCount, settingsReads, error, output };
}

const overlayCommand = { operation: "returns_utilization_history", params: {} };
const overlayOff = await providerProbe({ command: overlayCommand, enabled: false });
check(overlayOff.fetchCount === 0 && overlayOff.settingsReads === 1 && String(overlayOff.error?.code || "") === "OPERATION_DISABLED_BY_USER" && overlayOff.error?.external_request_executed === false, "CLOSURE-05 overlay-gated privacy OFF is zero-request fail-closed");
const overlayOn = await providerProbe({ command: overlayCommand, enabled: true });
check(overlayOn.fetchCount === 1, "CLOSURE-06 overlay-gated privacy ON reaches provider exactly once", String(overlayOn.fetchCount));

// GATE-25 race: state can change after planning; dispatch guard must read the fresh OFF value.
const race = await providerProbe({ command: overlayCommand, enabled: true, beforeExecute: async () => false });
check(race.fetchCount === 0 && race.settingsReads === 1 && String(race.error?.code || "") === "OPERATION_DISABLED_BY_USER", "CLOSURE-07 ON-at-planning -> OFF-before-dispatch remains zero-request blocked");

// GATE-26: report_file_get provenance and lifecycle.
const personalRef = "rpf_p_personal123456";
const safeRef = "rpf_s_safe123456789";
const staleRef = "rpf_s_stale12345678";
const reportState = {
  schema_version: 1,
  report_code_policies: {},
  report_file_refs: {
    [personalRef]: { url: "https://files.ozon.ru/report-personal.csv", personal_data_required: true, created_at_ms: NOW - 1000 },
    [safeRef]: { url: "https://files.ozon.ru/report-safe.csv", personal_data_required: false, created_at_ms: NOW - 1000 },
    [staleRef]: { url: "https://files.ozon.ru/report-safe-stale.csv", personal_data_required: false, created_at_ms: NOW - (31 * 60 * 1000) }
  }
};
const personalOff = await providerProbe({ command: { operation: "report_file_get", params: { file_ref: personalRef, limit: 2 } }, enabled: false, reportState });
check(personalOff.fetchCount === 0 && String(personalOff.error?.code || "") === "OPERATION_DISABLED_BY_USER", "CLOSURE-08 personal report file OFF is blocked before file fetch");
const personalOn = await providerProbe({ command: { operation: "report_file_get", params: { file_ref: personalRef, limit: 2 } }, enabled: true, reportState });
check(personalOn.fetchCount === 1, "CLOSURE-09 personal report file ON reaches trusted file provider once", String(personalOn.fetchCount));
const safeOff = await providerProbe({ command: { operation: "report_file_get", params: { file_ref: safeRef, limit: 2 } }, enabled: false, reportState });
check(safeOff.fetchCount === 1, "CLOSURE-10 safe report file provenance remains usable with privacy OFF", String(safeOff.fetchCount));
const stale = await providerProbe({ command: { operation: "report_file_get", params: { file_ref: staleRef, limit: 2 } }, enabled: false, reportState });
check(stale.fetchCount === 0 && String(stale.error?.code || "") === "REPORT_FILE_REF_NOT_FOUND", "CLOSURE-11 stale report-file dependency fails closed with zero requests");
const unknown = await providerProbe({ command: { operation: "report_file_get", params: { file_ref: "rpf_unknown_123456789" } }, enabled: false, reportState });
check(unknown.fetchCount === 0 && String(unknown.error?.code || "") === "REPORT_FILE_REF_NOT_FOUND", "CLOSURE-12 unknown/historical report-file dependency fails closed with zero requests");

// GATE-15/31: all intentionally removed stale aliases stay absent from both authorities.
for (const alias of Swagger.REMOVED_ALIASES) {
  check(!Registry.OPERATIONS[alias] && !Contract.OPERATIONS[alias], `CLOSURE-13 removed alias remains absent: ${alias}`);
}

// GATE-29: keep the positive/negative trusted-host boundary for notification_check.
let unsafeRejected = false;
try { Contract.normalizeCommand({ operation: "notification_check", params: { url: "https://127.0.0.1/a" } }); }
catch (error) { unsafeRejected = String(error?.code || "") === "NOTIFICATION_URL_REJECTED"; }
check(unsafeRejected, "CLOSURE-14 notification_check rejects IP/SSRF target locally");
let safeNotification = null;
try { safeNotification = Contract.normalizeCommand({ operation: "notification_check", params: { url: "https://example.com/hook" } }); }
catch (_) {}
check(safeNotification?.params?.url === "https://example.com/hook", "CLOSURE-15 notification_check retains public HTTPS positive control");

// GATE-06: adversarial OOXML integrity. Mere marker strings inside arbitrary PK bytes are not a valid XLSX.
const forgedBytes = utf8("PK\u0003\u0004arbitrary-payload-[Content_Types].xml-and-xl/workbook.xml-without-valid-central-directory");
const forgedRaw = { content_type: XLSX, byte_length: forgedBytes.byteLength, encoding: "base64", file_content_base64: b64(forgedBytes) };
const forgedProvider = {
  async executeCommandObject() {
    return { ok: true, operation: TARGET, http_status: 200, external_request_executed: true, result: forgedRaw, report_text: `OZON_RESULT_V1\n${JSON.stringify({ result: forgedRaw })}` };
  }
};
const forgedWrapped = Xlsx.wrapProvider(forgedProvider, { artifactWriter: async () => {}, uuid: () => "forged", now: () => NOW });
check(await rejects(() => forgedWrapped.executeCommandObject({ operation: TARGET, params: { UUID, vendor: true } }, {}, {}), "DIRECT_BINARY_MAGIC_MISMATCH"), "CLOSURE-16 malformed PK payload with OOXML marker strings is rejected");

// GATE-08: explicitly prove wrapper composition, not the XLSX wrapper in isolation.
const validLikeBytes = new Uint8Array(Buffer.from("UEsDBBQAAAAAAAw1Ll3HHBc8CAAAAAgAAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbDxUeXBlcy8+UEsDBBQAAAAAAAw1Ll3OnpgTCwAAAAsAAAAPAAAAeGwvd29ya2Jvb2sueG1sPHdvcmtib29rLz5QSwECFAMUAAAAAAAMNS5dxxwXPAgAAAAIAAAAEwAAAAAAAAAAAAAAgAEAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUAxQAAAAAAAw1Ll3OnpgTCwAAAAsAAAAPAAAAAAAAAAAAAACAATkAAAB4bC93b3JrYm9vay54bWxQSwUGAAAAAAIAAgB+AAAAcQAAAAAA", "base64"));
const rawXlsx = { content_type: XLSX, byte_length: validLikeBytes.byteLength, encoding: "base64", file_content_base64: b64(validLikeBytes) };
let xlsxWrites = 0;
let genericWrites = 0;
const baseXlsxProvider = {
  async executeCommandObject() {
    return { ok: true, operation: TARGET, http_status: 200, external_request_executed: true, result: rawXlsx, report_text: `OZON_RESULT_V1\n${JSON.stringify({ result: rawXlsx })}` };
  }
};
const xlsxFirst = Xlsx.wrapProvider(baseXlsxProvider, { artifactWriter: async () => { xlsxWrites += 1; }, uuid: () => "composite-xlsx", now: () => NOW });
const genericSecond = Direct.wrapProvider(xlsxFirst, { artifactWriter: async () => { genericWrites += 1; }, uuid: () => "unexpected-generic", now: () => NOW });
let composite = null;
try { composite = await genericSecond.executeCommandObject({ operation: TARGET, params: { UUID, vendor: true } }, {}, {}); }
catch (_) {}
check(composite?.result?.generated_file_ref === "rpf_s_composite-xlsx" && !Object.prototype.hasOwnProperty.call(composite?.result || {}, "file_content_base64") && xlsxWrites === 1 && genericWrites === 0, "CLOSURE-17 XLSX pre-wrapper survives generic binary wrapper without duplicate artifact or base64 leak", JSON.stringify({ xlsxWrites, genericWrites, result: composite?.result || null }));

if (failures.length) {
  console.error(JSON.stringify({ verdict: "FAIL", passes, failures, factoryConsumers }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ verdict: "PASS", passes, failures: [], factoryConsumers }, null, 2));
