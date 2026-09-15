import { writeFile } from "node:fs/promises";
import { createDatabaseRuntime, type DatabaseRuntime } from "@product/db";
import {
  createPublicTrustBundle,
  resolveSigningKeyLifecycle,
  serializePublicTrustBundle,
  SigningKeyEventSchema,
  SigningKeyMetadataSchema,
} from "@product/remote-config";
import { loadConfig } from "@product/shared";

function outputPath(argv: readonly string[]): string | undefined {
  const index = argv.indexOf("--output");
  if (index < 0) {
    if (argv.length > 0)
      throw new Error("Usage: pnpm config:trust-export [--output <path>]");
    return undefined;
  }
  const value = argv[index + 1];
  if (!value || argv.slice(index + 2).length > 0)
    throw new Error("Usage: pnpm config:trust-export [--output <path>]");
  return value;
}

async function readBundle(database: DatabaseRuntime) {
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
  return createPublicTrustBundle(entries);
}

const target = outputPath(process.argv.slice(2));
const config = loadConfig(process.env);
const database = createDatabaseRuntime(config.databaseUrl);
try {
  await database.ready();
  const bundle = await readBundle(database);
  const bytes = Buffer.concat([
    serializePublicTrustBundle(bundle),
    Buffer.from("\n", "utf8"),
  ]);
  if (target) await writeFile(target, bytes, { encoding: "utf8" });
  else process.stdout.write(bytes);
} finally {
  await database.close();
}
