import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "docs/migration/evidence/SERVER_IMPORT_MANIFEST.json"), "utf8"),
);
assert.equal(manifest.source_commit, "3f16bbf6387cc62303e292fcfe61449c8f243b92");
assert.equal(manifest.entries.length, 512);
assert.equal(new Set(manifest.entries.map((entry) => entry.source_path)).size, 512);
const targetPaths = new Set();
let imported = 0;
for (const entry of manifest.entries) {
  if (entry.target_path === null) {
    assert.equal(entry.source_path, "server/.gitkeep");
    assert.equal(entry.disposition, "EXCLUDED_EMPTY_PLACEHOLDER");
    continue;
  }
  assert(!targetPaths.has(entry.target_path), "Duplicate target: " + entry.target_path);
  targetPaths.add(entry.target_path);
  const data = readFileSync(resolve(root, entry.target_path));
  const hash = createHash("sha1")
    .update("blob " + data.length + "\0")
    .update(data)
    .digest("hex");
  assert.equal(hash, entry.target_blob_sha, "Imported file changed: " + entry.target_path);
  if (entry.disposition === "BYTE_IDENTICAL") {
    assert.equal(hash, entry.source_blob_sha, "Source equality: " + entry.target_path);
  }
  if (entry.source_path.includes("/drizzle/") ||
      entry.source_path.startsWith("server/apps/health-runner/") ||
      entry.source_path === "server/openapi/openapi.json") {
    assert.equal(hash, entry.source_blob_sha, "Frozen boundary changed: " + entry.target_path);
  }
  imported++;
}
assert.equal(imported, 511);
console.log("Server import inventory PASS: 512 source entries, 511 imported, one empty placeholder excluded.");
console.log("Frozen H3 foundation, SQL migrations and OpenAPI bytes preserved.");
console.log("Scope: D1 migration checkpoint only; run on its commit, not on later feature commits.");
