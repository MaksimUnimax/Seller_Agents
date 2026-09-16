import { expect, test } from "@playwright/test";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ChromeBrowserDriver,
  createControlledTargetRegistry,
  createDedicatedHealthChromeBrowserDriver,
  type DedicatedHealthSessionBinding,
} from "@product/health-runner";

const COOKIE_NAME = "synthetic_health_cookie";
const COOKIE_VALUE = "synthetic-health-only";
const WORK_ROUTE = "/g/g-p-test-health/c/00000000-0000-4000-8000-000000000123";

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

function standardBinding(
  storageStatePath: string,
): DedicatedHealthSessionBinding {
  return { targetKey: "chatgpt_standard_health", storageStatePath };
}

function workBinding(
  origin: string,
  storageStatePath: string,
  startUrl = `${origin}${WORK_ROUTE}`,
): DedicatedHealthSessionBinding {
  return { targetKey: "chatgpt_work_health", storageStatePath, startUrl };
}

test.describe("B7A dedicated Health session provisioning", () => {
  test("consumes dedicated Standard storage state in a fresh controlled context", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const driver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          standardBinding(storageStatePath),
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

  test("uses the local-only Work route and consumes its dedicated cookie", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const driver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          workBinding(fixture.origin, storageStatePath),
        );
        try {
          await driver.start();
          const result = await driver.open("chatgpt_work_health");
          expect(fixture.requests()).toContainEqual({
            path: WORK_ROUTE,
            cookie: `${COOKIE_NAME}=${COOKIE_VALUE}`,
          });
          expect(result).toEqual({
            targetKey: "chatgpt_work_health",
            finalOrigin: fixture.origin,
          });
          expect(JSON.stringify(result)).not.toContain(WORK_ROUTE);
          expect(JSON.stringify(result)).not.toContain(COOKIE_VALUE);
        } finally {
          await driver.closeOrPersist();
        }
      });
    } finally {
      await fixture.close();
    }
  });

  test("rejects dedicated binding target mismatch before any navigation", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const workDriver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          workBinding(fixture.origin, storageStatePath),
        );
        const standardDriver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          standardBinding(storageStatePath),
        );
        try {
          await workDriver.start();
          await expect(
            workDriver.open("chatgpt_standard_health"),
          ).rejects.toMatchObject({
            code: "DEDICATED_TARGET_MISMATCH",
          });
          await standardDriver.start();
          await expect(
            standardDriver.open("chatgpt_work_health"),
          ).rejects.toMatchObject({
            code: "DEDICATED_TARGET_MISMATCH",
          });
          expect(fixture.requests()).toEqual([]);
        } finally {
          await workDriver.closeOrPersist();
          await standardDriver.closeOrPersist();
        }
      });
    } finally {
      await fixture.close();
    }
  });

  test("rejects cross-origin, Standard-override, query/hash and invalid Work routes before navigation", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const invalidUrls = [
          "https://evil.example/g/g-p-test-health/c/00000000-0000-4000-8000-000000000123",
          `${fixture.origin}${WORK_ROUTE}?unsafe=1`,
          `${fixture.origin}${WORK_ROUTE}#unsafe`,
          `${fixture.origin}/g/g-p-test-health/c/not-a-uuid`,
        ];
        for (const startUrl of invalidUrls) {
          const driver = createDedicatedHealthChromeBrowserDriver(
            targets(fixture.origin),
            workBinding(fixture.origin, storageStatePath, startUrl),
          );
          try {
            await driver.start();
            await expect(
              driver.open("chatgpt_work_health"),
            ).rejects.toMatchObject({
              code: "DEDICATED_START_URL_INVALID",
            });
          } finally {
            await driver.closeOrPersist();
          }
        }

        const standardOverride = {
          targetKey: "chatgpt_standard_health",
          storageStatePath,
          startUrl: `${fixture.origin}/injected-standard-start`,
        } as unknown as DedicatedHealthSessionBinding;
        const standardDriver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          standardOverride,
        );
        try {
          await standardDriver.start();
          await expect(
            standardDriver.open("chatgpt_standard_health"),
          ).rejects.toMatchObject({ code: "DEDICATED_START_URL_INVALID" });
        } finally {
          await standardDriver.closeOrPersist();
        }
        expect(fixture.requests()).toEqual([]);
      });
    } finally {
      await fixture.close();
    }
  });

  test("does not carry dedicated cookies into a newly constructed default driver", async () => {
    const fixture = await startLoopbackFixture();
    try {
      await withStorageState(async (storageStatePath) => {
        const dedicatedDriver = createDedicatedHealthChromeBrowserDriver(
          targets(fixture.origin),
          standardBinding(storageStatePath),
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
});
