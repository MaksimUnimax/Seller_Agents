import { lstat, readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { CHATGPT_WORK_H3_PROFILE, parseWorkRoute } from "./work-h3-profile.js";

const MAX_CONFIG_FILE_BYTES = 64 * 1024;
const MAX_STORAGE_STATE_FILE_BYTES = 4 * 1024 * 1024;
const STANDARD_TARGET_KEY = "chatgpt_standard_health" as const;
const WORK_TARGET_KEY = "chatgpt_work_health" as const;

export type DedicatedHealthSessionTargetKey =
  | typeof STANDARD_TARGET_KEY
  | typeof WORK_TARGET_KEY;

export type DedicatedHealthSessionConfigErrorCode =
  | "INVALID_CONFIG_FILE_PATH"
  | "CONFIG_FILE_UNAVAILABLE"
  | "CONFIG_FILE_NOT_REGULAR"
  | "CONFIG_FILE_SYMLINK"
  | "CONFIG_FILE_EMPTY"
  | "CONFIG_FILE_TOO_LARGE"
  | "CONFIG_FILE_PERMISSIONS"
  | "CONFIG_FILE_READ_FAILED"
  | "CONFIG_JSON_INVALID"
  | "CONFIG_SCHEMA_INVALID"
  | "NO_TARGETS_CONFIGURED"
  | "INVALID_STORAGE_STATE_PATH"
  | "STORAGE_STATE_UNAVAILABLE"
  | "STORAGE_STATE_NOT_REGULAR"
  | "STORAGE_STATE_SYMLINK"
  | "STORAGE_STATE_EMPTY"
  | "STORAGE_STATE_TOO_LARGE"
  | "STORAGE_STATE_PERMISSIONS"
  | "DUPLICATE_STORAGE_STATE"
  | "INVALID_WORK_START_URL"
  | "UNTRUSTED_SESSION_REGISTRY"
  | "TARGET_NOT_CONFIGURED";

export class DedicatedHealthSessionConfigError extends Error {
  public constructor(
    public readonly code: DedicatedHealthSessionConfigErrorCode,
  ) {
    super(code);
    this.name = "DedicatedHealthSessionConfigError";
  }
}

type DedicatedHealthSessionBinding = Readonly<
  | {
      targetKey: typeof STANDARD_TARGET_KEY;
      storageStatePath: string;
    }
  | {
      targetKey: typeof WORK_TARGET_KEY;
      storageStatePath: string;
      startUrl: string;
    }
>;

type ConfigTarget = Readonly<Record<string, unknown>>;

function fail(code: DedicatedHealthSessionConfigErrorCode): never {
  throw new DedicatedHealthSessionConfigError(code);
}

function isRecord(value: unknown): value is ConfigTarget {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: ConfigTarget, keys: readonly string[]): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function requireAbsolutePath(value: unknown): string {
  if (typeof value !== "string" || !isAbsolute(value))
    fail("INVALID_STORAGE_STATE_PATH");
  return resolve(value);
}

function validateFilePermissions(
  mode: number,
  code: "CONFIG_FILE_PERMISSIONS" | "STORAGE_STATE_PERMISSIONS",
): void {
  if (process.platform === "win32") return;
  if ((mode & 0o077) !== 0 || (mode & 0o400) === 0) fail(code);
}

async function inspectFile(
  filePath: string,
  kind: "config" | "storage",
): Promise<{ size: number; device: number; inode: number }> {
  const codes =
    kind === "config"
      ? {
          unavailable: "CONFIG_FILE_UNAVAILABLE" as const,
          notRegular: "CONFIG_FILE_NOT_REGULAR" as const,
          symlink: "CONFIG_FILE_SYMLINK" as const,
          empty: "CONFIG_FILE_EMPTY" as const,
          tooLarge: "CONFIG_FILE_TOO_LARGE" as const,
          permissions: "CONFIG_FILE_PERMISSIONS" as const,
        }
      : {
          unavailable: "STORAGE_STATE_UNAVAILABLE" as const,
          notRegular: "STORAGE_STATE_NOT_REGULAR" as const,
          symlink: "STORAGE_STATE_SYMLINK" as const,
          empty: "STORAGE_STATE_EMPTY" as const,
          tooLarge: "STORAGE_STATE_TOO_LARGE" as const,
          permissions: "STORAGE_STATE_PERMISSIONS" as const,
        };
  const maxBytes =
    kind === "config" ? MAX_CONFIG_FILE_BYTES : MAX_STORAGE_STATE_FILE_BYTES;
  let stats;
  try {
    stats = await lstat(filePath);
  } catch {
    fail(codes.unavailable);
  }
  if (stats.isSymbolicLink()) fail(codes.symlink);
  if (!stats.isFile()) fail(codes.notRegular);
  if (stats.size <= 0) fail(codes.empty);
  if (stats.size > maxBytes) fail(codes.tooLarge);
  validateFilePermissions(stats.mode, codes.permissions);
  return { size: stats.size, device: stats.dev, inode: stats.ino };
}

function parseWorkStartUrl(value: unknown): string {
  if (typeof value !== "string" || value.length === 0)
    fail("INVALID_WORK_START_URL");
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    fail("INVALID_WORK_START_URL");
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.origin !== CHATGPT_WORK_H3_PROFILE.approvedOrigin ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.search !== "" ||
    parsed.hash !== "" ||
    parseWorkRoute(parsed.toString()) === null
  ) {
    fail("INVALID_WORK_START_URL");
  }
  return parsed.toString();
}

type ParsedBindingFields =
  | Readonly<{ storageStatePath: string }>
  | Readonly<{ storageStatePath: string; startUrl: string }>;

function createBinding(
  targetKey: DedicatedHealthSessionTargetKey,
  fields: ParsedBindingFields,
): DedicatedHealthSessionBinding {
  const binding = { targetKey } as {
    targetKey: DedicatedHealthSessionTargetKey;
    storageStatePath: string;
    startUrl?: string;
  };
  Object.defineProperty(binding, "storageStatePath", {
    configurable: false,
    enumerable: false,
    value: fields.storageStatePath,
    writable: false,
  });
  if ("startUrl" in fields) {
    Object.defineProperty(binding, "startUrl", {
      configurable: false,
      enumerable: false,
      value: fields.startUrl,
      writable: false,
    });
  }
  return Object.freeze(binding) as DedicatedHealthSessionBinding;
}

function parseTargetBinding(
  targetKey: DedicatedHealthSessionTargetKey,
  value: unknown,
): ParsedBindingFields {
  if (!isRecord(value)) fail("CONFIG_SCHEMA_INVALID");
  const expectedKeys =
    targetKey === STANDARD_TARGET_KEY
      ? ["storageStatePath"]
      : ["storageStatePath", "startUrl"];
  if (
    !hasOnlyKeys(value, expectedKeys) ||
    !("storageStatePath" in value) ||
    (targetKey === WORK_TARGET_KEY && !("startUrl" in value))
  ) {
    fail("CONFIG_SCHEMA_INVALID");
  }
  const storageStatePath = requireAbsolutePath(value.storageStatePath);
  if (targetKey === STANDARD_TARGET_KEY) return { storageStatePath };
  return { storageStatePath, startUrl: parseWorkStartUrl(value.startUrl) };
}

function parseConfig(value: unknown): DedicatedHealthSessionBinding[] {
  if (!isRecord(value) || !hasOnlyKeys(value, ["version", "targets"]))
    fail("CONFIG_SCHEMA_INVALID");
  if (value.version !== 1 || !isRecord(value.targets))
    fail("CONFIG_SCHEMA_INVALID");
  if (
    !hasOnlyKeys(value.targets, [STANDARD_TARGET_KEY, WORK_TARGET_KEY]) ||
    Object.keys(value.targets).length === 0
  ) {
    fail(
      Object.keys(value.targets).length === 0
        ? "NO_TARGETS_CONFIGURED"
        : "CONFIG_SCHEMA_INVALID",
    );
  }
  const bindings: DedicatedHealthSessionBinding[] = [];
  for (const targetKey of [STANDARD_TARGET_KEY, WORK_TARGET_KEY] as const) {
    if (!(targetKey in value.targets)) continue;
    const parsed = parseTargetBinding(targetKey, value.targets[targetKey]);
    if (targetKey === STANDARD_TARGET_KEY) {
      if ("startUrl" in parsed) fail("CONFIG_SCHEMA_INVALID");
      bindings.push(createBinding(targetKey, parsed));
    } else {
      if (!("startUrl" in parsed)) fail("CONFIG_SCHEMA_INVALID");
      bindings.push(createBinding(targetKey, parsed));
    }
  }
  return bindings;
}

export interface DedicatedHealthSessionRegistry {
  readonly __dedicatedHealthSessionRegistry?: never;
}

const registryBindings = new WeakMap<
  object,
  ReadonlyMap<DedicatedHealthSessionTargetKey, DedicatedHealthSessionBinding>
>();

export function resolveDedicatedHealthSessionBinding(
  registry: DedicatedHealthSessionRegistry,
  targetKey: string,
): DedicatedHealthSessionBinding {
  if (
    (typeof registry !== "object" && typeof registry !== "function") ||
    registry === null
  )
    fail("UNTRUSTED_SESSION_REGISTRY");
  const bindings = registryBindings.get(registry);
  if (!bindings) fail("UNTRUSTED_SESSION_REGISTRY");
  if (targetKey !== STANDARD_TARGET_KEY && targetKey !== WORK_TARGET_KEY)
    fail("TARGET_NOT_CONFIGURED");
  const binding = bindings.get(targetKey);
  if (!binding) fail("TARGET_NOT_CONFIGURED");
  return binding;
}

export async function loadDedicatedHealthSessionRegistry(
  configFilePath: string,
): Promise<DedicatedHealthSessionRegistry> {
  if (typeof configFilePath !== "string" || !isAbsolute(configFilePath))
    fail("INVALID_CONFIG_FILE_PATH");
  const resolvedConfigFilePath = resolve(configFilePath);
  const configFile = await inspectFile(resolvedConfigFilePath, "config");
  let rawConfig: string;
  try {
    rawConfig = await readFile(resolvedConfigFilePath, "utf8");
  } catch {
    fail("CONFIG_FILE_READ_FAILED");
  }
  if (Buffer.byteLength(rawConfig, "utf8") !== configFile.size) {
    fail("CONFIG_FILE_READ_FAILED");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawConfig) as unknown;
  } catch {
    fail("CONFIG_JSON_INVALID");
  }
  const bindings = parseConfig(parsed);
  const inspectedStates = await Promise.all(
    bindings.map(async (binding) => ({
      binding,
      file: await inspectFile(binding.storageStatePath, "storage"),
    })),
  );
  for (let left = 0; left < inspectedStates.length; left += 1) {
    for (let right = left + 1; right < inspectedStates.length; right += 1) {
      const first = inspectedStates[left];
      const second = inspectedStates[right];
      if (
        first &&
        second &&
        first.file.device === second.file.device &&
        first.file.inode === second.file.inode
      ) {
        fail("DUPLICATE_STORAGE_STATE");
      }
    }
  }
  const registry = Object.freeze({}) as DedicatedHealthSessionRegistry;
  registryBindings.set(
    registry,
    new Map(inspectedStates.map(({ binding }) => [binding.targetKey, binding])),
  );
  return registry;
}
