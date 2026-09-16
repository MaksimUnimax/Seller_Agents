import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const AUTH_STORAGE_KEY = "seller_agents_control_auth_v2";
function canonical(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}
const b64url = (value) => Buffer.from(value).toString("base64url");

export async function signFixtureBootstrap(backing, payload, keyId = "fixture-key") {
  const stored = backing.local.__seller_agents_fixture_signing_key;
  assert.ok(stored, "fixture signing key is worker-local backing state");
  const privateKey = await webcrypto.subtle.importKey("pkcs8", Buffer.from(stored.privateKey, "base64"), { name: "Ed25519" }, false, ["sign"]);
  const payloadBytes = new TextEncoder().encode(canonical(payload));
  const domain = new Uint8Array([...new TextEncoder().encode("product-control-plane/bootstrap-snapshot/v1"), 0, ...new TextEncoder().encode(keyId), 0]);
  const signed = new Uint8Array(domain.length + payloadBytes.length);
  signed.set(domain); signed.set(payloadBytes, domain.length);
  const signature = await webcrypto.subtle.sign("Ed25519", privateKey, signed);
  return { envelopeVersion: "bootstrap_envelope_v2", algorithm: "Ed25519", keyId, payload: b64url(payloadBytes), signature: b64url(Buffer.from(signature)) };
}

export async function until(fn, description) {
  const end = Date.now() + 3500;
  while (Date.now() < end) {
    const value = await fn();
    if (value) return value;
    await new Promise((r) => setTimeout(r, 5));
  }
  throw new Error("Timed out: " + description);
}
export async function makeWorker(directory, options = {}) {
  const network = [],
    messages = [],
    listeners = [],
    connectListeners = [],
    storageChangedListeners = [],
    timers = new Set();
  const backing = options.backing || { local: {}, session: {} };
  const accountId = options.accountId || "11111111-1111-4111-8111-111111111111";
  const deviceId = options.deviceId || "22222222-2222-4222-8222-222222222222";
  const sessionId = options.sessionId || "33333333-3333-4333-8333-333333333333";
  const fixtureKey = backing.local.__seller_agents_fixture_signing_key;
  let signing;
  if (fixtureKey) {
    signing = {
      privateKey: await webcrypto.subtle.importKey("pkcs8", Buffer.from(fixtureKey.privateKey, "base64"), { name: "Ed25519" }, false, ["sign"]),
      publicKey: await webcrypto.subtle.importKey("spki", Buffer.from(fixtureKey.publicKey, "base64"), { name: "Ed25519" }, false, ["verify"]),
    };
  } else {
    signing = await webcrypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
    backing.local.__seller_agents_fixture_signing_key = {
      privateKey: Buffer.from(await webcrypto.subtle.exportKey("pkcs8", signing.privateKey)).toString("base64"),
      publicKey: Buffer.from(await webcrypto.subtle.exportKey("spki", signing.publicKey)).toString("base64"),
    };
  }
  const spki = fixtureKey
    ? new Uint8Array(Buffer.from(fixtureKey.publicKey, "base64"))
    : new Uint8Array(await webcrypto.subtle.exportKey("spki", signing.publicKey));
  const fingerprint = Buffer.from(await webcrypto.subtle.digest("SHA-256", spki)).toString("hex");
  const keyId = "fixture-key";
  const fixtureConfig = options.packagedConfig || {
    environment: "LOCAL DEVELOPMENT",
    controlApiOrigin: "http://127.0.0.1:43100",
    portalOrigin: "http://127.0.0.1:43101",
    extensionVersion: "0.2.4",
    contractVersion: "control_plane_v2",
    trustBundle: { trustBundleVersion: "bootstrap_trust_bundle_v1", algorithm: "Ed25519", publicKeyFormat: "spki_der", publicKeyEncoding: "base64", fingerprintAlgorithm: "sha256", fingerprintEncoding: "lowercase_hex", keys: [{ keyId, publicKey: Buffer.from(spki).toString("base64"), fingerprintSha256: fingerprint, lifecycle: "ACTIVE", trustEligibility: "SIGNING_AND_VERIFICATION" }] },
  };
  if (options.seedAuthority !== false && !backing.local[AUTH_STORAGE_KEY]) {
    const issued = new Date(Date.now() - 1000).toISOString();
    const serverTime = new Date().toISOString();
    const expires = new Date(Date.now() + 3600000).toISOString();
    const grace = new Date(Date.now() + 7200000).toISOString();
    const content = { schemaVersion: "adapter_profile_v1", page: { identityStrategy: "page_identity", conversationStrategy: "conversation_root", composerStrategy: "composer_root" },
      selectors: { conversation: { strategy: "conversation_root", primary: { kind: "packaged_selector_reference", reference: "conversation-root" }, fallbacks: [], timeoutMs: 1000, observationMode: "polling" },
        composer: { strategy: "composer_root", primary: { kind: "packaged_selector_reference", reference: "composer-root" }, fallbacks: [], timeoutMs: 1000, observationMode: "polling" },
        send: { strategy: "send_control", primary: { kind: "packaged_selector_reference", reference: "send-control" }, fallbacks: [], timeoutMs: 1000, observationMode: "polling" },
        assistantResponse: { strategy: "assistant_response", primary: { kind: "packaged_selector_reference", reference: "assistant-response" }, fallbacks: [], timeoutMs: 1000, observationMode: "polling" } },
      observation: { mode: "polling", intervalMs: 100 }, contours: [
        { key: "page_identity", required: true, expectedState: "PRESENT", strategy: "page_identity" },
        { key: "conversation_root", required: true, expectedState: "PRESENT", strategy: "conversation_root" },
        { key: "composer_root", required: true, expectedState: "INTERACTIVE", strategy: "composer_root" },
        { key: "send_control", required: true, expectedState: "INTERACTIVE", strategy: "send_control" }] };
    const compatibility = { schemaVersion: "profile_compatibility_v1", contractVersion: "control_plane_v1", browserFamilies: ["chrome"], minimumBrowserVersions: [], minimumExtensionVersion: null };
    const contentSha256 = Buffer.from(await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical({ content, compatibility })))).toString("hex");
    const payload = { snapshotVersion: "bootstrap_snapshot_v2", contractVersion: "control_plane_v2", configVersion: 1, issuedAt: issued, expiresAt: expires, offlineGraceUntil: grace, serverTime,
      accessBasis: "BETA", account: { id: accountId, status: "ACTIVE" }, subscription: { state: "NONE", planRevision: null }, devicePolicy: { status: "ACTIVE" },
      compatibility: { extension: { status: "SUPPORTED", minimumVersion: null }, browser: { status: "SUPPORTED" } }, entitlements: {}, features: {},
      ai: { status: "RESOLVED", detected: { family: "chatgpt", surface: "web", variant: null }, profile: { profileKey: "fixture-profile", revision: 1, scopeVariant: null, schemaVersion: "adapter_profile_v1", contentSha256, content, compatibility } } };
    const payloadBytes = new TextEncoder().encode(canonical(payload));
    const domain = new Uint8Array([...new TextEncoder().encode("product-control-plane/bootstrap-snapshot/v1"), 0, ...new TextEncoder().encode(keyId), 0]);
    const signed = new Uint8Array(domain.length + payloadBytes.length); signed.set(domain); signed.set(payloadBytes, domain.length);
    const signature = await webcrypto.subtle.sign("Ed25519", signing.privateKey, signed);
    backing.local[AUTH_STORAGE_KEY] = { generation: 1, credentials: { deviceId, sessionId, tokenType: "Bearer", accessToken: "fixture_access_token", accessTokenExpiresAt: expires, refreshToken: "A".repeat(43), refreshTokenExpiresAt: grace }, pending: null, rotation: null,
      authority: { verified: true, workAllowed: true, requestedAi: "chatgpt", generation: 1, payload, envelope: { envelopeVersion: "bootstrap_envelope_v2", algorithm: "Ed25519", keyId, payload: b64url(payloadBytes), signature: b64url(signature) }, deviceId, sessionId }, lastError: null };
  }
  return { backing, fixtureConfig };
}
