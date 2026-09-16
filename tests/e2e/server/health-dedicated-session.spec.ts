import { expect, test } from "@playwright/test";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import * as HealthRunner from "@product/health-runner";
import {
  ChromeBrowserDriver,
  createControlledTargetRegistry,
  createDedicatedHealthChromeBrowserDriver,
  loadDedicatedHealthSessionRegistry,
} from "@product/health-runner";

const COOKIE_NAME = "synthetic_health_cookie";
const COOKIE_VALUE = "synthetic-health-only";
type LoopbackFixture = Readonly<{
  origin: string;
  requests: () => readonly Readonly<{ path: string; cookie: string }>[];
  close: () => Promise<void>;
}>;

async function startLoopbackFixture(): Promise<LoopbackFixture> {
  const requests: Array<{ path: string; cookie: string }> = [];
  const server = createServer((request, response) => {
    requests.push({
      path: request.url ?? "",
      cookie: request.headers.cookie ?? "",
    });
    response
      .writeHead(200, { "content-type": "text/html" })
      .end("<!doctype html><title>synthetic health fixture</title>");
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (typeof address !== "object" || !address)
    throw new Error("HEALTH_DEDICATED_LOOPBACK_ADDRESS_UNAVAILABLE");
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    requests: () => requests,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}

async function withStorageState(
  callback: (storageStatePath: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "health-dedicated-e2e-"));
  const storageStatePath = join(directory, "dedicated-state.json");
  await writeFile(
    storageStatePath,
    JSON.stringify({
      cookies: [
        {
          domain: "127.0.0.1",
          expires: -1,
          httpOnly: false,
          name: COOKIE_NAME,
          path: "/",
          sameSite: "Lax",
          secure: false,
          value: COOKIE_VALUE,
        },
      ],
      origins: [],
    }),
    { mode: 0o600 },
  );
  await chmod(storageStatePath, 0o600);
  try {
    await callback(storageStatePath);
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

type LoadedRegistry = Awaited<
  ReturnType<typeof loadDedicatedHealthSessionRegistry>
>;

async function withLoadedStandardRegistry(
  callback: (
    storageStatePath: string,
    registry: LoadedRegistry,
  ) => Promise<void>,
): Promise<void> {
  await withStorageState(async (storageStatePath) => {
    const configPath = join(dirname(storageStatePath), "config.json");
    await writeFile(
      configPath,
      JSON.stringify({
        version: 1,
        targets: {
          chatgpt_standard_health: { storageStatePath },
        },
      }),
      { mode: 0o600 },
    );
    await chmod(configPath, 0o600);
    const registry = await loadDedicatedHealthSessionRegistry(configPath);
    await callback(storageStatePath, registry);
  });
}

function targets(origin: string) {
  return createControlledTargetRegistry([
    {
      key: "chatgpt_standard_health",
      startUrl: `${origin}/standard-start`,
      allowedTopLevelOrigins: [origin],
      browserFamily: "chrome",
      navigationTimeoutMs: 5_000,
    },
    {
      key: "chatgpt_work_health",
      startUrl: `${origin}/packaged-work-start`,
      allowedTopLevelOrigins: [origin],
      browserFamily: "chrome",
      navigationTimeoutMs: 5_000,
    },
  ]);
}

test.describe("B7A dedicated Health session provisioning", () => {
  test("consumes dedicated Standard storage state in a fresh controlled context", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withLoadedStandardRegistry(async (storageStatePath, registry) => {
        const driver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          registry,
          "chatgpt_standard_health",
        );
        try {
          await driver.start();
          const result = await driver.open("chatgpt_standard_health");
          expect(fixture.requests()).toContainEqual({
            path: "/standard-start",
            cookie: `${COOKIE_NAME}=${COOKIE_VALUE}`,
          });
          expect(driver.getRuntimeMetadata().sessionKind).toBe(
            "EPHEMERAL_CONTROLLED",
          );
          expect(result).toEqual({
            targetKey: "chatgpt_standard_health",
            finalOrigin: fixture.origin,
          });
          expect(JSON.stringify(result)).not.toContain(COOKIE_VALUE);
          expect(JSON.stringify(result)).not.toContain(storageStatePath);
        } finally {
          await driver.closeOrPersist();
        }
      });
    } finally {
      await fixture.close();
    }
  });

  test("rejects a target that is not configured by the loaded registry", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withLoadedStandardRegistry(async (_storageStatePath, registry) => {
        expect(() =>
          createDedicatedHealthChromeBrowserDriver(
            targets(fixture.origin),
            registry,
            "chatgpt_work_health",
          ),
        ).toThrowError("TARGET_NOT_CONFIGURED");
        expect(fixture.requests()).toEqual([]);
      });
    } finally {
      await fixture.close();
    }
  });

  test("does not expose a runtime registry or direct binding API at the root", () => {
    expect("DedicatedHealthSessionRegistry" in HealthRunner).toBe(false);
    expect("DedicatedHealthSessionBinding" in HealthRunner).toBe(false);
  });

  test("does not carry dedicated cookies into a newly constructed default driver", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withLoadedStandardRegistry(async (_storageStatePath, registry) => {
        const dedicatedDriver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          registry,
          "chatgpt_standard_health",
        );
        try {
          await dedicatedDriver.start();
          await dedicatedDriver.open("chatgpt_standard_health");
        } finally {
          await dedicatedDriver.closeOrPersist();
        }

        const defaultDriver = new ChromeBrowserDriver(targets(fixture.origin));
        try {
          await defaultDriver.start();
          await defaultDriver.open("chatgpt_standard_health");
        } finally {
          await defaultDriver.closeOrPersist();
        }
        expect(fixture.requests()).toEqual([
          { path: "/standard-start", cookie: `${COOKIE_NAME}=${COOKIE_VALUE}` },
          { path: "/standard-start", cookie: "" },
        ]);
      });
    } finally {
      await fixture.close();
    }
  });

  test("rejects forged factory authority before synthetic state consumption", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const forgedBinding = {
          targetKey: "chatgpt_standard_health",
          storageStatePath,
        };
        const factory = createDedicatedHealthChromeBrowserDriver as unknown as (
          targetRegistry: ReturnType<typeof targets>,
          forgedAuthority: unknown,
        ) => ChromeBrowserDriver;
        let driver: ChromeBrowserDriver | undefined;
        let factoryError: unknown;
        try {
          driver = factory(targets(fixture.origin), forgedBinding);
        } catch (error) {
          factoryError = error;
        }
        if (factoryError !== undefined) {
          expect(factoryError).toMatchObject({
            code: "UNTRUSTED_SESSION_REGISTRY",
          });
          expect(fixture.requests()).toEqual([]);
          return;
        }
        try {
          await driver?.start();
          await driver?.open("chatgpt_standard_health");
        } finally {
          await driver?.closeOrPersist();
        }
        expect(fixture.requests()).toEqual([
          {
            path: "/standard-start",
            cookie: "",
          },
        ]);
      });
    } finally {
      await fixture.close();
    }
  });

  test("ignores a third ChromeBrowserDriver constructor argument", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const forgedBinding = {
          targetKey: "chatgpt_standard_health",
          storageStatePath,
        };
        const DriverConstructor = ChromeBrowserDriver as unknown as new (
          targetRegistry: ReturnType<typeof targets>,
          launchTimeoutMs?: number,
          forgedAuthority?: unknown,
        ) => ChromeBrowserDriver;
        const driver = new DriverConstructor(
          targets(fixture.origin),
          undefined,
          forgedBinding,
        );
        try {
          await driver.start();
          await driver.open("chatgpt_standard_health");
        } finally {
          await driver.closeOrPersist();
        }
        expect(fixture.requests()).toEqual([
          {
            path: "/standard-start",
            cookie: "",
          },
        ]);
      });
    } finally {
      await fixture.close();
    }
  });

  test("rejects a forged plain registry before browser launch", async () => {
    const fixture = await startLoopbackFixture();
    try {
      const factory = createDedicatedHealthChromeBrowserDriver as unknown as (
        targetRegistry: ReturnType<typeof targets>,
        forgedRegistry: unknown,
        targetKey: string,
      ) => ChromeBrowserDriver;
      expect(() =>
        factory(targets(fixture.origin), {}, "chatgpt_standard_health"),
      ).toThrowError("UNTRUSTED_SESSION_REGISTRY");
      expect(fixture.requests()).toEqual([]);
    } finally {
      await fixture.close();
    }
  });
});
