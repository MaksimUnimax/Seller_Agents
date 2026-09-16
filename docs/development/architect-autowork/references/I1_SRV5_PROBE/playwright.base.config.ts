import { defineConfig } from "@playwright/test";
import { generateKeyPairSync } from "node:crypto";
import { resolve } from "node:path";

const serverWorkspaceCwd = resolve(__dirname, "../../..");

// Per-run only: the private half is passed to the disposable API process via
// its environment and is never persisted or exposed by the test API.
const e2eConfigSigningPairs = [
  { keyId: "e2e-config-k1", pair: generateKeyPairSync("ed25519") },
  { keyId: "e2e-config-k2", pair: generateKeyPairSync("ed25519") },
];
const e2eConfigSigningRingJson = JSON.stringify({
  version: 1,
  keys: e2eConfigSigningPairs.map(({ keyId, pair }) => ({
    keyId,
    privateKeyPemB64: Buffer.from(
      pair.privateKey.export({ format: "pem", type: "pkcs8" }),
    ).toString("base64"),
  })),
});
// Workers receive only public verification material; the private ring exists
// solely in the disposable API web-server process environment.
process.env.CONFIG_SIGNING_PUBLIC_KEY_RING_JSON = JSON.stringify(
  e2eConfigSigningPairs.map(({ keyId, pair }) => ({
    keyId,
    publicKeySpkiDerB64: pair.publicKey
      .export({ format: "der", type: "spki" })
      .toString("base64"),
  })),
);


process.env.SRV5_REVIEW_PARENT_PUBLIC_RING ??= process.env.CONFIG_SIGNING_PUBLIC_KEY_RING_JSON;
export default defineConfig({ testDir: ".", testMatch: "key-lifecycle.spec.ts", workers: 1, retries: 0, reporter: "line" });
