import {
  chmod,
  link,
  mkdir,
  readFile,
  symlink,
  writeFile,
} from "node:fs/promises";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DedicatedHealthSessionConfigError,
  loadDedicatedHealthSessionRegistry,
} from "./dedicated-health-session.js";

const WORK_URL =
  "https://chatgpt.com/g/g-p-test-health/c/00000000-0000-4000-8000-000000000123";

async function withTempDirectory(
  callback: (directory: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "health-session-test-"));
  try {
    await callback(directory);
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

async function createState(directory: string, name = "state.json") {
  const path = join(directory, name);
  await writeFile(path, '{"cookies":[],"origins":[]}', { mode: 0o600 });
  await chmod(path, 0o600);
  return path;
}

async function createConfig(
  directory: string,
  config: unknown,
  name = "config.json",
): Promise<string> {
  const path = join(directory, name);
  await writeFile(path, JSON.stringify(config), { mode: 0o600 });
  await chmod(path, 0o600);
  return path;
}

async function expectConfigError(
  action: () => Promise<unknown>,
  code: string,
): Promise<void> {
  try {
    await action();
    throw new Error("EXPECTED_CONFIG_ERROR");
  } catch (error) {
    expect(error).toBeInstanceOf(DedicatedHealthSessionConfigError);
    expect((error as DedicatedHealthSessionConfigError).code).toBe(code);
    expect((error as Error).message).toBe(code);
  }
}

function standardConfig(storageStatePath: string): unknown {
  return {
    version: 1,
    targets: { chatgpt_standard_health: { storageStatePath } },
  };
}

function workConfig(storageStatePath: string, startUrl = WORK_URL): unknown {
  return {
    version: 1,
    targets: { chatgpt_work_health: { storageStatePath, startUrl } },
  };
}

describe("dedicated Health session registry", () => {
  it("loads a valid Standard-only configuration", async () => {
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      const registry = await loadDedicatedHealthSessionRegistry(
        await createConfig(directory, standardConfig(statePath)),
      );
      const binding = registry.resolve("chatgpt_standard_health");
      expect(binding.targetKey).toBe("chatgpt_standard_health");
      expect(binding.storageStatePath).toBe(statePath);
      expect("startUrl" in binding).toBe(false);
      expect(Object.isFrozen(binding)).toBe(true);
    });
  });

  it("loads a valid Work-only configuration with an approved route", async () => {
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      const registry = await loadDedicatedHealthSessionRegistry(
        await createConfig(directory, workConfig(statePath)),
      );
      expect(registry.resolve("chatgpt_work_health")).toMatchObject({
        targetKey: "chatgpt_work_health",
        storageStatePath: statePath,
        startUrl: WORK_URL,
      });
    });
  });

  it("resolves both targets to distinct immutable bindings", async () => {
    await withTempDirectory(async (directory) => {
      const standardState = await createState(directory, "standard.json");
      const workState = await createState(directory, "work.json");
      const registry = await loadDedicatedHealthSessionRegistry(
        await createConfig(directory, {
          version: 1,
          targets: {
            chatgpt_standard_health: { storageStatePath: standardState },
            chatgpt_work_health: {
              storageStatePath: workState,
              startUrl: WORK_URL,
            },
          },
        }),
      );
      expect(registry.resolve("chatgpt_standard_health").storageStatePath).toBe(
        standardState,
      );
      expect(registry.resolve("chatgpt_work_health").storageStatePath).toBe(
        workState,
      );
      expect(JSON.stringify(registry)).not.toContain("standard.json");
      expect(JSON.stringify(registry)).not.toContain(WORK_URL);
      expect(
        JSON.stringify(registry.resolve("chatgpt_work_health")),
      ).not.toContain(WORK_URL);
      expect(
        JSON.stringify(registry.resolve("chatgpt_work_health")),
      ).not.toContain(workState);
    });
  });

  it("uses bounded errors for missing targets and unknown fields", async () => {
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      const registry = await loadDedicatedHealthSessionRegistry(
        await createConfig(directory, standardConfig(statePath)),
      );
      await expectConfigError(
        async () => registry.resolve("missing_target"),
        "TARGET_NOT_CONFIGURED",
      );
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, {
              version: 1,
              extra: "rejected",
              targets: {
                chatgpt_standard_health: { storageStatePath: statePath },
              },
            }),
          ),
        "CONFIG_SCHEMA_INVALID",
      );
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, {
              version: 1,
              targets: {
                chatgpt_standard_health: {
                  storageStatePath: statePath,
                  startUrl: WORK_URL,
                },
              },
            }),
          ),
        "CONFIG_SCHEMA_INVALID",
      );
    });
  });

  it("rejects relative config and storage-state paths", async () => {
    await withTempDirectory(async (directory) => {
      const configPath = await createConfig(
        directory,
        standardConfig("relative.json"),
      );
      await expectConfigError(
        () => loadDedicatedHealthSessionRegistry(configPath),
        "INVALID_STORAGE_STATE_PATH",
      );
      await expectConfigError(
        () => loadDedicatedHealthSessionRegistry("relative-config.json"),
        "INVALID_CONFIG_FILE_PATH",
      );
    });
  });

  it("rejects symlinked config and state files on POSIX", async () => {
    if (process.platform === "win32") return;
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      const stateLink = join(directory, "state-link.json");
      await symlink(statePath, stateLink);
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, standardConfig(stateLink)),
          ),
        "STORAGE_STATE_SYMLINK",
      );

      const configPath = await createConfig(
        directory,
        standardConfig(statePath),
      );
      const configLink = join(directory, "config-link.json");
      await symlink(configPath, configLink);
      await expectConfigError(
        () => loadDedicatedHealthSessionRegistry(configLink),
        "CONFIG_FILE_SYMLINK",
      );
    });
  });

  it("rejects non-regular, empty and oversized files", async () => {
    await withTempDirectory(async (directory) => {
      const emptyState = join(directory, "empty-state.json");
      await writeFile(emptyState, "", { mode: 0o600 });
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, standardConfig(emptyState)),
          ),
        "STORAGE_STATE_EMPTY",
      );

      const directoryState = join(directory, "state-directory");
      await mkdir(directoryState, { mode: 0o700 });
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, standardConfig(directoryState)),
          ),
        "STORAGE_STATE_NOT_REGULAR",
      );

      const oversizedState = join(directory, "oversized-state.json");
      await writeFile(oversizedState, Buffer.alloc(4 * 1024 * 1024 + 1), {
        mode: 0o600,
      });
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, standardConfig(oversizedState)),
          ),
        "STORAGE_STATE_TOO_LARGE",
      );

      const oversizedConfig = join(directory, "oversized-config.json");
      await writeFile(oversizedConfig, Buffer.alloc(64 * 1024 + 1), {
        mode: 0o600,
      });
      await expectConfigError(
        () => loadDedicatedHealthSessionRegistry(oversizedConfig),
        "CONFIG_FILE_TOO_LARGE",
      );
    });
  });

  it("enforces owner-only POSIX permissions while accepting owner-only files", async () => {
    if (process.platform === "win32") return;
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      const configPath = await createConfig(
        directory,
        standardConfig(statePath),
      );
      await chmod(configPath, 0o640);
      await expectConfigError(
        () => loadDedicatedHealthSessionRegistry(configPath),
        "CONFIG_FILE_PERMISSIONS",
      );
      await chmod(configPath, 0o600);
      expect(
        (await loadDedicatedHealthSessionRegistry(configPath)).resolve(
          "chatgpt_standard_health",
        ).targetKey,
      ).toBe("chatgpt_standard_health");

      await chmod(statePath, 0o604);
      await expectConfigError(
        () => loadDedicatedHealthSessionRegistry(configPath),
        "STORAGE_STATE_PERMISSIONS",
      );
      await chmod(statePath, 0o600);
    });
  });

  it("rejects duplicate storage-state files", async () => {
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, {
              version: 1,
              targets: {
                chatgpt_standard_health: { storageStatePath: statePath },
                chatgpt_work_health: {
                  storageStatePath: statePath,
                  startUrl: WORK_URL,
                },
              },
            }),
          ),
        "DUPLICATE_STORAGE_STATE",
      );

      const hardLinkPath = join(directory, "state-hard-link.json");
      await link(statePath, hardLinkPath);
      await expectConfigError(
        async () =>
          loadDedicatedHealthSessionRegistry(
            await createConfig(directory, {
              version: 1,
              targets: {
                chatgpt_standard_health: { storageStatePath: statePath },
                chatgpt_work_health: {
                  storageStatePath: hardLinkPath,
                  startUrl: WORK_URL,
                },
              },
            }),
          ),
        "DUPLICATE_STORAGE_STATE",
      );
    });
  });

  it("rejects unsafe or non-route Work start URLs without revealing input", async () => {
    await withTempDirectory(async (directory) => {
      const statePath = await createState(directory);
      const sentinel = "project-sentinel-7f3e";
      const cases = [
        "http://chatgpt.com/g/g-p-test-health/c/00000000-0000-4000-8000-000000000123",
        "https://evil.example/g/g-p-test-health/c/00000000-0000-4000-8000-000000000123",
        "https://user:pass@chatgpt.com/g/g-p-test-health/c/00000000-0000-4000-8000-000000000123",
        `${WORK_URL}?sentinel=${sentinel}`,
        `${WORK_URL}#${sentinel}`,
        "https://chatgpt.com/g/g-p-test-health/c/not-a-uuid",
        "https://chatgpt.com/c/00000000-0000-4000-8000-000000000123",
      ];
      for (const startUrl of cases) {
        const configPath = await createConfig(
          directory,
          workConfig(statePath, startUrl),
        );
        try {
          await loadDedicatedHealthSessionRegistry(configPath);
          throw new Error("EXPECTED_CONFIG_ERROR");
        } catch (error) {
          expect(error).toBeInstanceOf(DedicatedHealthSessionConfigError);
          expect((error as DedicatedHealthSessionConfigError).code).toBe(
            "INVALID_WORK_START_URL",
          );
          expect((error as Error).message).toBe("INVALID_WORK_START_URL");
          expect((error as Error).message).not.toContain(sentinel);
          expect((error as Error).message).not.toContain(WORK_URL);
        }
      }
    });
  });

  it("keeps file paths and Work URLs out of errors and serialization", async () => {
    await withTempDirectory(async (directory) => {
      const statePath = join(directory, "state-secret-sentinel.json");
      const configPath = await createConfig(directory, workConfig(statePath));
      try {
        await loadDedicatedHealthSessionRegistry(configPath);
        throw new Error("EXPECTED_CONFIG_ERROR");
      } catch (error) {
        expect(error).toBeInstanceOf(DedicatedHealthSessionConfigError);
        expect((error as Error).message).not.toContain(statePath);
        expect((error as Error).message).not.toContain(WORK_URL);
      }
      const content = await readFile(configPath, "utf8");
      expect(content).toContain(statePath);
    });
  });
});
