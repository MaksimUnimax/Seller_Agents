/* global OzonProvider, OzonOperationRegistry, ProviderTransportCore */
(() => {
  "use strict";

  const PATCH_KEY = "__OZON_XLSX_DIRECT_BINARY_DELIVERY_V0122__";
  if (globalThis[PATCH_KEY]) return;

  const TARGET_OPERATION = "performance_statistics_report_download";
  const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const DB_NAME = "ozon_bridge_delivery_artifacts_v1";
  const DB_VERSION = 1;
  const STORE_NAME = "artifacts";
  const ARTIFACT_TTL_MS = 60 * 60 * 1000;
  const MAX_BYTES = 16 * 1024 * 1024;

  function fail(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }
  function contentType(value) { return String(value || "").split(";", 1)[0].trim().toLowerCase(); }
  function bytes(value) { return ProviderTransportCore.reportBase64ToBytes(String(value || "")); }
  function sanitizeToken(value) { return String(value || "").replace(/[^A-Za-z0-9_-]/g, ""); }
  function personal(operation) { return OzonOperationRegistry?.operation?.(operation)?.policy_group === "personal_data_read"; }
  function filename(operation, ref) { return `ozon-${String(operation || "performance-report").replace(/[^A-Za-z0-9_-]/g, "_")}-${ref}.xlsx`.slice(0, 180); }

  function readU16(data, offset) {
  if (offset < 0 || offset + 2 > data.length) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP structure is truncated.");
  return data[offset] | (data[offset + 1] << 8);
}
function readU32(data, offset) {
  if (offset < 0 || offset + 4 > data.length) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP structure is truncated.");
  return (data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0;
}
function hasSig(data, offset, a, b, c, d) {
  return offset >= 0 && offset + 4 <= data.length && data[offset] === a && data[offset + 1] === b && data[offset + 2] === c && data[offset + 3] === d;
}
function zipName(data, start, length) {
  if (start < 0 || start + length > data.length) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP filename is truncated.");
  let out = "";
  for (let i = start; i < start + length; i += 1) out += String.fromCharCode(data[i]);
  return out;
}
function findEocd(data) {
  const minimum = Math.max(0, data.length - 65557);
  for (let offset = data.length - 22; offset >= minimum; offset -= 1) {
    if (hasSig(data, offset, 0x50, 0x4b, 0x05, 0x06)) return offset;
  }
  return -1;
}
function assertXlsxMagic(source) {
  const data = source instanceof Uint8Array ? source : new Uint8Array(source || []);
  if (data.byteLength < 22) throw fail("DIRECT_BINARY_EMPTY", "Ozon вернул пустой/слишком короткий XLSX документ.");
  if (!hasSig(data, 0, 0x50, 0x4b, 0x03, 0x04)) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX не начинается с корректного ZIP local-file header.");

  const eocd = findEocd(data);
  if (eocd < 0) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP не содержит корректный end-of-central-directory record.");
  const disk = readU16(data, eocd + 4);
  const centralDisk = readU16(data, eocd + 6);
  const entriesOnDisk = readU16(data, eocd + 8);
  const entriesTotal = readU16(data, eocd + 10);
  const centralSize = readU32(data, eocd + 12);
  const centralOffset = readU32(data, eocd + 16);
  const commentLength = readU16(data, eocd + 20);
  if (disk !== 0 || centralDisk !== 0 || entriesTotal < 1 || entriesTotal === 0xffff || entriesOnDisk !== entriesTotal) {
    throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP uses unsupported multi-disk/ZIP64 or inconsistent central-directory metadata.");
  }
  if (eocd + 22 + commentLength !== data.length || centralOffset + centralSize !== eocd || centralOffset >= eocd) {
    throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP central-directory offsets are inconsistent.");
  }

  const names = new Set();
  let cursor = centralOffset;
  for (let index = 0; index < entriesTotal; index += 1) {
    if (!hasSig(data, cursor, 0x50, 0x4b, 0x01, 0x02)) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP central-directory entry is invalid.");
    const flags = readU16(data, cursor + 8);
    if ((flags & 0x0001) !== 0) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "Encrypted XLSX ZIP entries are not supported.");
    const nameLength = readU16(data, cursor + 28);
    const extraLength = readU16(data, cursor + 30);
    const entryCommentLength = readU16(data, cursor + 32);
    const localOffset = readU32(data, cursor + 42);
    const name = zipName(data, cursor + 46, nameLength);
    if (!name || name.includes("\\") || name.startsWith("/") || name.split("/").includes("..")) {
      throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP contains unsafe entry path.");
    }
    if (!hasSig(data, localOffset, 0x50, 0x4b, 0x03, 0x04)) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP central entry does not point to a local-file header.");
    const localNameLength = readU16(data, localOffset + 26);
    const localExtraLength = readU16(data, localOffset + 28);
    const localName = zipName(data, localOffset + 30, localNameLength);
    if (localName !== name || localOffset + 30 + localNameLength + localExtraLength > centralOffset) {
      throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP local/central entry metadata mismatch.");
    }
    names.add(name);
    cursor += 46 + nameLength + extraLength + entryCommentLength;
    if (cursor > eocd) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP central directory overruns EOCD.");
  }
  if (cursor !== eocd) throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP central-directory size does not match parsed entries.");
  if (!names.has("[Content_Types].xml") || !names.has("xl/workbook.xml")) {
    throw fail("DIRECT_BINARY_MAGIC_MISMATCH", "XLSX ZIP-контейнер не содержит обязательные OOXML workbook entries.");
  }
  return true;
}

  async function sha256Hex(source) {
    const digest = await crypto.subtle.digest("SHA-256", source);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      let request;
      try { request = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (error) { reject(error); return; }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "artifact_key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB open failed"));
      request.onblocked = () => reject(new Error("IndexedDB open blocked"));
    });
  }

  async function putArtifact(record) {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        let tx;
        let request;
        try {
          tx = db.transaction(STORE_NAME, "readwrite");
          request = tx.objectStore(STORE_NAME).put(record);
        } catch (error) { reject(error); return; }
        let requestSucceeded = false;
        let settled = false;
        const rejectOnce = (error) => { if (settled) return; settled = true; reject(error); };
        request.onsuccess = () => { requestSucceeded = true; };
        request.onerror = () => rejectOnce(request.error || new Error("IndexedDB XLSX artifact put failed"));
        tx.onabort = () => rejectOnce(tx.error || new Error("IndexedDB XLSX artifact transaction aborted"));
        tx.oncomplete = () => {
          if (settled) return;
          if (!requestSucceeded) { rejectOnce(new Error("IndexedDB XLSX artifact transaction completed before put success.")); return; }
          settled = true;
          resolve();
        };
      });
    } finally { try { db.close(); } catch (_) {} }
  }

  function safeResultReport(reportText, safeResult) {
    const text = String(reportText || "");
    const newline = text.indexOf("\n");
    if (newline <= 0 || text.slice(0, newline).trim() !== "OZON_RESULT_V1") throw fail("DIRECT_BINARY_REPORT_ENVELOPE_INVALID", "XLSX result report не имеет канонический OZON_RESULT_V1 envelope.");
    let envelope;
    try { envelope = JSON.parse(text.slice(newline + 1)); }
    catch (_) { throw fail("DIRECT_BINARY_REPORT_ENVELOPE_INVALID", "XLSX result report JSON повреждён."); }
    envelope.result = safeResult;
    return `OZON_RESULT_V1\n${JSON.stringify(envelope, null, 2)}`;
  }

  function wrapProvider(baseProvider, { artifactWriter = putArtifact, uuid = () => crypto.randomUUID(), now = () => Date.now() } = {}) {
    if (!baseProvider || typeof baseProvider.executeCommandObject !== "function") throw fail("XLSX_BINARY_BASE_PROVIDER_MISSING", "OzonProvider.executeCommandObject is required.");

    async function executeCommandObject(command, sellerCredentials, performanceCredentials = {}, options = {}) {
      const output = await baseProvider.executeCommandObject(command, sellerCredentials, performanceCredentials, options);
      const operation = String(output?.operation || command?.operation || "");
      if (operation !== TARGET_OPERATION || output?.ok !== true || Number(output?.http_status || 0) < 200 || Number(output?.http_status || 0) >= 300) return output;
      const raw = output?.result && typeof output.result === "object" && !Array.isArray(output.result) ? output.result : null;
      if (!raw || raw.generated_file_ref || !raw.file_content_base64 || contentType(raw.content_type) !== XLSX_CONTENT_TYPE) return output;

      try {
        const source = bytes(raw.file_content_base64);
        const declared = Number(raw.byte_length);
        if (!Number.isInteger(declared) || declared !== source.byteLength) throw fail("DIRECT_BINARY_BYTE_LENGTH_MISMATCH", "XLSX byte_length не совпадает с provider bytes.");
        if (source.byteLength > MAX_BYTES) throw fail("DIRECT_BINARY_TOO_LARGE", `XLSX превышает hard cap ${MAX_BYTES} bytes.`);
        assertXlsxMagic(source);
        const ref = `rpf_${personal(operation) ? "p" : "s"}_${sanitizeToken(uuid())}`;
        const created = Number(now());
        const artifact = {
          artifact_key: `provider:${ref}`,
          source_kind: "original_provider_file",
          filename: filename(operation, ref),
          mime_type: XLSX_CONTENT_TYPE,
          extension: "xlsx",
          byte_length: source.byteLength,
          sha256: await sha256Hex(source),
          bytes: source.slice().buffer,
          created_at_ms: created,
          expires_at_ms: created + ARTIFACT_TTL_MS
        };
        await artifactWriter(artifact);
        const safe = { ...raw };
        delete safe.file_content_base64;
        delete safe.encoding;
        safe.generated_file_ref = ref;
        safe.generated_file_inline = true;
        safe.generated_file_content_type = XLSX_CONTENT_TYPE;
        safe.generated_file_byte_length = source.byteLength;
        safe.format = "xlsx";
        const result = Object.freeze(safe);
        return Object.freeze({ ...output, result, report_text: safeResultReport(output.report_text, result) });
      } catch (error) {
        error.external_request_executed = true;
        error.http_status = Number(output?.http_status || 0);
        error.response_meta = output?.response_meta || null;
        throw error;
      }
    }

    async function executeCommand(commandText, sellerCredentials, performanceCredentials = {}, options = {}) {
      const command = globalThis.OzonContract.parseCommand(commandText);
      return executeCommandObject(command, sellerCredentials, performanceCredentials, options);
    }
    return Object.freeze({ ...baseProvider, executeCommandObject, executeCommand });
  }

  globalThis.OzonProvider = wrapProvider(globalThis.OzonProvider);
  const api = Object.freeze({ TARGET_OPERATION, XLSX_CONTENT_TYPE, DB_NAME, STORE_NAME, MAX_BYTES, wrapProvider, assertXlsxMagic, safeResultReport });
  globalThis.OzonXlsxDirectBinaryDeliveryPatch = api;
  globalThis[PATCH_KEY] = api;
})();
