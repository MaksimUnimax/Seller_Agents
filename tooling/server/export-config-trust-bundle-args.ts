const usage =
  "Usage: pnpm config:trust-export [--overlap-key <keyId>]... [--output <path>]";

export type TrustExportArguments = {
  overlapKeyIds: string[];
  outputPath?: string;
};

export function parseTrustExportArguments(
  argv: readonly string[],
): TrustExportArguments {
  const overlapKeyIds: string[] = [];
  let outputPath: string | undefined;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--overlap-key") {
      const keyId = argv[index + 1];
      if (!keyId || keyId.startsWith("--")) throw new Error(usage);
      if (overlapKeyIds.includes(keyId))
        throw new Error("P3_PUBLIC_TRUST_KEY_DUPLICATE_OVERLAP");
      overlapKeyIds.push(keyId);
      index += 1;
    } else if (argument === "--output") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--") || outputPath !== undefined)
        throw new Error(usage);
      outputPath = value;
      index += 1;
    } else {
      throw new Error(usage);
    }
  }
  return { overlapKeyIds, ...(outputPath ? { outputPath } : {}) };
}
