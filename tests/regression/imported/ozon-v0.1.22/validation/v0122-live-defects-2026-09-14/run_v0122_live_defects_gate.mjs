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
  if (condition) passes.push(label);
  else failures.push(`${label}${detail ? `: ${detail}` : ""}`);
}
function throws(fn, expectedCode = null) {
  try { fn(); return false; }
  catch (error) { return expectedCode ? String(error?.code || "") === expectedCode : true; }
}
async function rejects(fn, expectedCode = null) {
  try { await fn(); return false; }
  catch (error) { return expectedCode ? String(error?.code || "") === expectedCode : true; }
}
function load(relative) {
  const file = path.join(dist, relative);
  vm.runInThisContext(fs.readFileSync(file, "utf8"), { filename: file });
}
function exists(relative) { return fs.existsSync(path.join(dist, relative)); }
function b64(bytes) { return Buffer.from(bytes).toString("base64"); }
function utf8(text) { return new TextEncoder().encode(text); }

if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.TextEncoder) globalThis.TextEncoder = (await import("node:util")).TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = (await import("node:util")).TextDecoder;

let personalDataEnabled = false;
globalThis.chrome = {
  runtime: { id: "test-extension" },
  storage: {
    local: {
      async get(keys) {
        const all = { ozmb_personal_data_enabled_v1: personalDataEnabled };
        if (Array.isArray(keys)) return Object.fromEntries(keys.filter((key) => Object.prototype.hasOwnProperty.call(all, key)).map((key) => [key, all[key]]));
        if (typeof keys === "string") return Object.prototype.hasOwnProperty.call(all, keys) ? { [keys]: all[keys] } : {};
        return { ...all };
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

const BaselineContract = globalThis.OzonContract;
const BaselineRegistry = globalThis.OzonOperationRegistry;
const TARGET = "performance_statistics_report_download";
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const UUID = "927f6bc2-af64-43ff-8ae9-943774396a95";
const reorderedA = { operation: "description_category_attribute_values", params: { attribute_id: 10096, type_id: 93733, description_category_id: 87515080, limit: 5 } };
const reorderedB = { operation: "description_category_attribute_values", params: { attribute_id: 10096, description_category_id: 87515080, limit: 5, type_id: 93733 } };
const changedValue = { operation: "description_category_attribute_values", params: { attribute_id: 10096, description_category_id: 87515080, limit: 6, type_id: 93733 } };
const arrayA = { operation: "seller_product_info_list", params: { product_id: ["1082848375", "1082848376"] } };
const arrayB = { operation: "seller_product_info_list", params: { product_id: ["1082848376", "1082848375"] } };

const ordinaryBefore = BaselineContract.buildPerformanceRequest({ operation: TARGET, params: { UUID } }, { Authorization: "Bearer TEST" });

async function baselinePrivacyProbe() {
  let fetchCount = 0;
  const fakeFetch = async () => {
    fetchCount += 1;
    return new Response(JSON.stringify({ result: { postings: [], has_next: false } }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const provider = globalThis.OzonProviderFactory.createOzonProvider({ contract: BaselineContract, fetchImpl: fakeFetch, uuid: () => "baseline-privacy", now: () => 1_700_000_000_000 });
  try {
    await provider.executeCommandObject({ operation: "fbs_posting_list", params: { filter: { since: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" }, limit: 1 } }, { clientId: "123", apiKey: "test-key" }, {});
  } catch (_) {}
  return fetchCount;
}

if (mode === "baseline-red") {
  const legacyOrderSensitiveFingerprint = (command) => {
    const text = JSON.stringify(BaselineContract.normalizeCommand(command));
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  };
  check(legacyOrderSensitiveFingerprint(reorderedA) !== legacyOrderSensitiveFingerprint(reorderedB), "RED-01 order-sensitive fingerprint reproduced");
  check(throws(() => BaselineContract.normalizeCommand({ operation: TARGET, params: { UUID, vendor: true } })), "RED-02 vendor download param gap reproduced");
  check(!BaselineRegistry.OPERATIONS[TARGET].response_content_types.includes(XLSX), "RED-03 XLSX contract gap reproduced");
  check((await baselinePrivacyProbe()) > 0, "RED-04 provider layer lacks final personal-data OFF guard");

  load("shared/direct_binary_file_delivery_patch.js");
  const xlsxBytes = utf8("PK\u0003\u0004xxxx[Content_Types].xmlxxxxxl/workbook.xml");
  const fakeBase = {
    async executeCommandObject() {
      return {
        ok: true, operation: TARGET, http_status: 200, external_request_executed: true,
        result: { content_type: XLSX, byte_length: xlsxBytes.byteLength, encoding: "base64", file_content_base64: b64(xlsxBytes) },
        report_text: `OZON_RESULT_V1\n${JSON.stringify({ bridge: "ozon-llm-api-bridge", version: "0.1.21", request_id: "r", operation: TARGET, command: { operation: TARGET, fingerprint: "00000000" }, request_meta: {}, http_status: 200, elapsed_ms: 1, pagination: null, rate_limit: null, planning: null, result: { content_type: XLSX, byte_length: xlsxBytes.byteLength, encoding: "base64", file_content_base64: b64(xlsxBytes) } })}`
      };
    }
  };
  const wrapped = globalThis.OzonDirectBinaryDeliveryPatch.wrapProvider(fakeBase, { artifactWriter: async () => {}, uuid: () => "xlsx-red", now: () => 1_700_000_000_000 });
  check(await rejects(() => wrapped.executeCommandObject({ operation: TARGET, params: { UUID } }, {}, {}), "DIRECT_BINARY_CONTENT_TYPE_UNSUPPORTED"), "RED-05 direct-binary XLSX rejection reproduced");

  if (failures.length) {
    console.error(JSON.stringify({ mode, verdict: "FAIL", passes, failures }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ mode, verdict: "EXPECTED_BASELINE_RED_REPRODUCED", passes, failures: [] }, null, 2));
  process.exit(0);
}

check(exists("shared/live_runtime_v0122_patch.js"), "GREEN-00 candidate runtime patch exists");
check(exists("shared/xlsx_direct_binary_delivery_patch.js"), "GREEN-00B candidate XLSX pre-wrapper exists");
if (!exists("shared/live_runtime_v0122_patch.js") || !exists("shared/xlsx_direct_binary_delivery_patch.js")) {
  console.error(JSON.stringify({ mode, verdict: "FAIL", passes, failures }, null, 2));
  process.exit(1);
}
load("shared/live_runtime_v0122_patch.js");

const Contract = globalThis.OzonContract;
const Registry = globalThis.OzonOperationRegistry;
const Repair = globalThis.OzonLiveRuntimeRepairV0122;

check(Contract.commandFingerprint(reorderedA) === Contract.commandFingerprint(reorderedB), "GREEN-01 semantic fingerprint ignores object-key order");
check(Contract.commandFingerprint(reorderedA) !== Contract.commandFingerprint(changedValue), "GREEN-02 semantic fingerprint changes when business value changes");
check(Contract.commandFingerprint(arrayA) !== Contract.commandFingerprint(arrayB), "GREEN-03 semantic fingerprint preserves array order");

const vendorNormalized = Contract.normalizeCommand({ operation: TARGET, params: { UUID, vendor: true } });
check(vendorNormalized.params.vendor === true, "GREEN-04 vendor:true accepted as explicit safe selector");
check(throws(() => Contract.normalizeCommand({ operation: TARGET, params: { UUID, vendor: false } }), "INVALID_OPERATION_PARAMS"), "GREEN-05 vendor:false rejected locally");
check(throws(() => Contract.normalizeCommand({ operation: TARGET, params: { UUID, vendor: "t" } }), "INVALID_OPERATION_PARAMS"), "GREEN-06 arbitrary vendor string rejected locally");

const ordinaryAfter = Contract.buildPerformanceRequest({ operation: TARGET, params: { UUID } }, { Authorization: "Bearer TEST" });
check(JSON.stringify(ordinaryAfter) === JSON.stringify(ordinaryBefore), "GREEN-07 ordinary non-vendor request byte/deep parity");
const vendorRequest = Contract.buildPerformanceRequest({ operation: TARGET, params: { UUID, vendor: true } }, { Authorization: "Bearer TEST" });
check(vendorRequest.url === `${ordinaryBefore.url}&vendor=t`, "GREEN-08 vendor download encodes exactly vendor=t", vendorRequest.url);
check(Array.isArray(vendorRequest.response_content_types) && vendorRequest.response_content_types.includes(XLSX), "GREEN-09 vendor download response contract includes XLSX");
check(Registry.OPERATIONS[TARGET].response_content_types.includes(XLSX), "GREEN-10 registry response contract includes XLSX");

const discovered = Contract.discoverCommands(`OZON_API_V1\n${JSON.stringify({ operation: TARGET, params: { vendor: true, UUID } })}`);
check(discovered.length === 1 && discovered[0].ok === true && discovered[0].command.params.vendor === true, "GREEN-11 discovery accepts vendor download command");
check(discovered[0]?.command_fingerprint === Contract.commandFingerprint(discovered[0]?.command), "GREEN-12 discovery uses semantic fingerprint");

async function guardedProbe(enabled, command) {
  let fetchCount = 0;
  const fakeFetch = async () => {
    fetchCount += 1;
    return new Response(JSON.stringify({ result: { postings: [], has_next: false } }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const base = globalThis.OzonProviderFactory.createOzonProvider({ contract: Contract, fetchImpl: fakeFetch, uuid: () => "guarded", now: () => 1_700_000_000_000 });
  const guarded = Repair.wrapProviderWithPersonalDataGuard(base, { settingsReader: async () => ({ personalDataEnabled: enabled }) });
  let error = null;
  try { await guarded.executeCommandObject(command, { clientId: "123", apiKey: "test-key" }, {}); }
  catch (caught) { error = caught; }
  return { fetchCount, error };
}
const gatedCommand = { operation: "fbs_posting_list", params: { filter: { since: "2026-09-01T00:00:00Z", to: "2026-09-02T00:00:00Z" }, limit: 1 } };
const off = await guardedProbe(false, gatedCommand);
check(off.fetchCount === 0 && String(off.error?.code || "") === "OPERATION_DISABLED_BY_USER" && off.error?.external_request_executed === false, "GREEN-13 final personal-data OFF guard is zero-request fail-closed");
const on = await guardedProbe(true, gatedCommand);
check(on.fetchCount === 1, "GREEN-14 personal-data ON positive control reaches provider exactly once", String(on.fetchCount));
const safe = await guardedProbe(false, { operation: "seller_product_list", params: { filter: {}, limit: 1 } });
check(safe.fetchCount === 1, "GREEN-15 READ_SAFE operation is not blocked by privacy guard", String(safe.fetchCount));

load("shared/xlsx_direct_binary_delivery_patch.js");
const Xlsx = globalThis.OzonXlsxDirectBinaryDeliveryPatch;
check(Xlsx.XLSX_CONTENT_TYPE === XLSX, "GREEN-16 XLSX pre-wrapper declares exact MIME support");
const xlsxBytes = new Uint8Array(Buffer.from("UEsDBBQAAAAAAAw1Ll3HHBc8CAAAAAgAAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbDxUeXBlcy8+UEsDBBQAAAAAAAw1Ll3OnpgTCwAAAAsAAAAPAAAAeGwvd29ya2Jvb2sueG1sPHdvcmtib29rLz5QSwECFAMUAAAAAAAMNS5dxxwXPAgAAAAIAAAAEwAAAAAAAAAAAAAAgAEAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUAxQAAAAAAAw1Ll3OnpgTCwAAAAsAAAAPAAAAAAAAAAAAAACAATkAAAB4bC93b3JrYm9vay54bWxQSwUGAAAAAAIAAgB+AAAAcQAAAAAA", "base64"));
let artifact = null;
const rawXlsx = { content_type: XLSX, byte_length: xlsxBytes.byteLength, encoding: "base64", file_content_base64: b64(xlsxBytes) };
const fakeBase = {
  async executeCommandObject() {
    return {
      ok: true, operation: TARGET, http_status: 200, external_request_executed: true, result: rawXlsx,
      report_text: `OZON_RESULT_V1\n${JSON.stringify({ bridge: "ozon-llm-api-bridge", version: "0.1.22", request_id: "r", operation: TARGET, command: { operation: TARGET, fingerprint: "00000000" }, request_meta: {}, http_status: 200, elapsed_ms: 1, pagination: null, rate_limit: null, planning: null, result: rawXlsx })}`
    };
  }
};
const xlsxDirect = Xlsx.wrapProvider(fakeBase, { artifactWriter: async (value) => { artifact = value; }, uuid: () => "xlsx-green", now: () => 1_700_000_000_000 });
const xlsxOutput = await xlsxDirect.executeCommandObject({ operation: TARGET, params: { UUID, vendor: true } }, {}, {});
check(xlsxOutput.result.generated_file_ref === "rpf_s_xlsx-green" && xlsxOutput.result.format === "xlsx", "GREEN-17 XLSX becomes opaque generated_file_ref");
check(!Object.prototype.hasOwnProperty.call(xlsxOutput.result, "file_content_base64") && !xlsxOutput.report_text.includes(b64(xlsxBytes)), "GREEN-18 XLSX base64 does not leak into report text");
check(artifact?.extension === "xlsx" && artifact?.mime_type === XLSX && artifact?.byte_length === xlsxBytes.byteLength && artifact?.source_kind === "original_provider_file", "GREEN-19 XLSX artifact metadata preserves exact provider-file identity");

const badXlsxBytes = utf8("PK\u0003\u0004not-an-ooxml-workbook");
const badBase = {
  async executeCommandObject() {
    const raw = { content_type: XLSX, byte_length: badXlsxBytes.byteLength, encoding: "base64", file_content_base64: b64(badXlsxBytes) };
    return { ok: true, operation: TARGET, http_status: 200, external_request_executed: true, result: raw, report_text: `OZON_RESULT_V1\n${JSON.stringify({ result: raw })}` };
  }
};
const badXlsxDirect = Xlsx.wrapProvider(badBase, { artifactWriter: async () => {}, uuid: () => "bad-xlsx", now: () => 1_700_000_000_000 });
check(await rejects(() => badXlsxDirect.executeCommandObject({ operation: TARGET, params: { UUID, vendor: true } }, {}, {}), "DIRECT_BINARY_MAGIC_MISMATCH"), "GREEN-20 XLSX masquerade rejected by OOXML integrity guard");

load("shared/direct_binary_file_delivery_patch.js");
const Direct = globalThis.OzonDirectBinaryDeliveryPatch;
const csvBytes = utf8("a,b\n1,2\n");
let csvArtifact = null;
const csvBase = {
  async executeCommandObject() {
    const raw = { content_type: "text/csv", byte_length: csvBytes.byteLength, encoding: "base64", file_content_base64: b64(csvBytes) };
    return { ok: true, operation: "performance_daily_csv", http_status: 200, external_request_executed: true, result: raw, report_text: `OZON_RESULT_V1\n${JSON.stringify({ result: raw })}` };
  }
};
const csvDirect = Direct.wrapProvider(csvBase, { artifactWriter: async (value) => { csvArtifact = value; }, uuid: () => "csv-green", now: () => 1_700_000_000_000 });
const csvOutput = await csvDirect.executeCommandObject({ operation: "performance_daily_csv", params: { campaignIds: ["37130644"], dateFrom: "2026-09-01", dateTo: "2026-09-02" } }, {}, {});
check(csvOutput.result.generated_file_ref === "rpf_s_csv-green" && csvArtifact?.extension === "csv", "GREEN-21 existing CSV attachment path remains green");

check(Object.keys(Registry.OPERATIONS).length === Object.keys(BaselineRegistry.OPERATIONS).length, "GREEN-22 operation universe count unchanged by v0.1.22 overlay");
check(Registry.catalogValidation(Contract.OPERATIONS).ok === true, "GREEN-23 registry-contract catalog parity remains green");

if (failures.length) {
  console.error(JSON.stringify({ mode, verdict: "FAIL", passes, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ mode, verdict: "PASS", passes, failures: [] }, null, 2));
