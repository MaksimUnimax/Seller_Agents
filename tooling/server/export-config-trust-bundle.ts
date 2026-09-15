import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createDatabaseRuntime, type DatabaseRuntime } from "@product/db";
import { parseTrustExportArguments } from "./export-config-trust-bundle-args.js";
import {
  createPublicTrustBundle,
  resolveSigningKeyLifecycle,
  serializePublicTrustBundle,
  SigningKeyEventSchema,
  SigningKeyMetadataSchema,
} from "../../packages/server/remote-config/src/index.js";
import { loadConfig } from "@product/shared";

export async function readBundle(
  database: DatabaseRuntime,
  overlapKeyIds: readonly string[],
) {
  const keys = await database.query(
    'SELECT key_id AS "keyId",algorithm,public_key_spki_der AS "publicKeySpkiDer",public_key_sha256 AS "publicKeySha256",created_at AS "createdAt" FROM signing_keys ORDER BY key_id',
  );
  const entries = [];
  for (const row of keys.rows) {
    const metadata = SigningKeyMetadataSchema.parse(row);
    const events = await database.query(
      'SELECT id,key_id AS "keyId",event_type AS "eventType",occurred_at AS "occurredAt",reason_code AS "reasonCode",created_at AS "createdAt" FROM signing_key_events WHERE key_id=$1 ORDER BY occurred_at,id',
      [metadata.keyId],
    );
    entries.push({
      metadata,
      lifecycle: resolveSigningKeyLifecycle(
        events.rows.map((event) => SigningKeyEventSchema.parse(event)),
      ),
    });
  }
  return createPublicTrustBundle(entries, overlapKeyIds);
}

export async function main(argv: readonly string[] = process.argv.slice(2)) {
  const args = parseTrustExportArguments(argv);
  const config = loadConfig(process.env);
  const database = createDatabaseRuntime(config.databaseUrl);
  try {
    await database.ready();
    const bundle = await readBundle(database, args.overlapKeyIds);
    const bytes = Buffer.concat([
      serializePublicTrustBundle(bundle),
      Buffer.from("\n", "utf8"),
    ]);
    if (args.outputPath)
      await writeFile(args.outputPath, bytes, { encoding: "utf8" });
    else process.stdout.write(bytes);
  } finally {
    await database.close();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
  await main().catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "trust export failed",
    );
    process.exitCode = 1;
  });
