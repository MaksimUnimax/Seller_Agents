import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const context = { crypto: webcrypto, TextEncoder, TextDecoder, atob, btoa };
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.argv[2], "utf8"), context, { filename: "crypto.js" });
const canonical = (value) => {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
};
const fromContext = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);
const uuid = "11111111-1111-4111-8111-111111111111";
const keyId = "i1-regression-key";
const keys = await webcrypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
const spki = new Uint8Array(await webcrypto.subtle.exportKey("spki", keys.publicKey));
const publicKey = Buffer.from(spki).toString("base64");
const fingerprint = Buffer.from(await webcrypto.subtle.digest("SHA-256", spki)).toString("hex");
const payload = {
  snapshotVersion: "bootstrap_snapshot_v2", contractVersion: "control_plane_v2", configVersion: 7,
  issuedAt: "2026-09-15T00:00:00Z", expiresAt: "2026-09-16T00:00:00Z", offlineGraceUntil: "2026-09-17T00:00:00Z", serverTime: "2026-09-15T00:00:00Z",
  accessBasis: "BETA", account: { id: uuid, status: "ACTIVE" }, subscription: { state: "NONE", planRevision: null }, devicePolicy: { status: "ACTIVE" },
  compatibility: { extension: { status: "SUPPORTED", minimumVersion: null }, browser: { status: "SUPPORTED" } }, entitlements: {}, features: {}, ai: { status: "UNCONFIGURED" },
};
const payloadBytes = new TextEncoder().encode(canonical(payload));
const prefix = new Uint8Array([...new TextEncoder().encode("product-control-plane/bootstrap-snapshot/v1"), 0, ...new TextEncoder().encode(keyId), 0]);
const signed = new Uint8Array(prefix.length + payloadBytes.length); signed.set(prefix); signed.set(payloadBytes, prefix.length);
const signature = await webcrypto.subtle.sign("Ed25519", keys.privateKey, signed);
const envelope = fromContext({ envelopeVersion: "bootstrap_envelope_v2", algorithm: "Ed25519", keyId, payload: Buffer.from(payloadBytes).toString("base64url"), signature: Buffer.from(signature).toString("base64url") });
const bundle = fromContext({ trustBundleVersion: "bootstrap_trust_bundle_v1", algorithm: "Ed25519", publicKeyFormat: "spki_der", publicKeyEncoding: "base64", fingerprintAlgorithm: "sha256", fingerprintEncoding: "lowercase_hex", keys: [{ keyId, publicKey, fingerprintSha256: fingerprint, lifecycle: "ACTIVE", trustEligibility: "SIGNING_AND_VERIFICATION" }] });
const verify = (value = envelope, ring = bundle) => context.SellerAgentsBootstrapVerifier.verifyV2(value, ring);
assert.equal((await verify()).ok, true);
const tampered = fromContext({ ...envelope, payload: Buffer.from(JSON.stringify({ ...payload, account: { id: "22222222-2222-4222-8222-222222222222", status: "ACTIVE" } })).toString("base64url") });
assert.equal((await verify(tampered)).ok, false);
assert.equal((await verify(fromContext({ ...envelope, envelopeVersion: "bootstrap_envelope_v1" }))).error, "INVALID_ENVELOPE");
assert.equal((await verify(envelope, fromContext({ ...bundle, keys: [] }))).error, "UNKNOWN_SIGNING_KEY");
const duplicateBytes = new TextEncoder().encode('{"account":{"id":"' + uuid + '","status":"ACTIVE"},"account":{},"snapshotVersion":"bootstrap_snapshot_v2"}');
const duplicateSigned = new Uint8Array(prefix.length + duplicateBytes.length); duplicateSigned.set(prefix); duplicateSigned.set(duplicateBytes, prefix.length);
const duplicateSignature = await webcrypto.subtle.sign("Ed25519", keys.privateKey, duplicateSigned);
assert.equal((await verify(fromContext({ ...envelope, payload: Buffer.from(duplicateBytes).toString("base64url"), signature: Buffer.from(duplicateSignature).toString("base64url") }))).error, "INVALID_PAYLOAD_JSON");
console.log(JSON.stringify({ status: "PASS", valid_v2: true, tamper: true, cross_version: true, unknown_key: true, duplicate_field: true }));
