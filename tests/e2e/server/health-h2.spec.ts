import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import {
  ChromeBrowserDriver,
  createControlledTargetRegistry,
  createH2ProbePlan,
  runH2StructuralSmoke,
} from "@product/health-runner";
import {
  startHealthH2Fixture,
  type HealthH2Fixture,
  type HealthH2FixtureVariant,
} from "./support/health-h2-fixture.js";

type RedirectStatus = 301 | 302 | 303 | 307 | 308;
type TopLevelNavigationCase = Readonly<{
  approvedOrigin: string;
  startUrl: string;
  unapprovedDocumentHits: () => number;
  close: () => Promise<void>;
}>;

async function startTopLevelNavigationCase(
  status: RedirectStatus | "META_REFRESH",
): Promise<TopLevelNavigationCase> {
  let unapprovedDocumentHits = 0;
  const destination = createServer((_request, response) => {
    unapprovedDocumentHits += 1;
    response.writeHead(200, { "content-type": "text/html" }).end("blocked");
  });
  await new Promise<void>((resolve, reject) => {
    destination.once("error", reject);
    destination.listen(0, "127.0.0.1", resolve);
  });
  const destinationAddress = destination.address();
  if (typeof destinationAddress !== "object" || !destinationAddress) {
    await new Promise<void>((resolve) => destination.close(() => resolve()));
    throw new Error("NAVIGATION_DESTINATION_ADDRESS_UNAVAILABLE");
  }
  const destinationUrl = `http://127.0.0.1:${destinationAddress.port}/blocked-target`;
  const origin = createServer((_request, response) => {
    if (status === "META_REFRESH") {
      response
        .writeHead(200, { "content-type": "text/html" })
        .end(`<!doctype html><meta http-equiv="refresh" content="0;url=${destinationUrl}">`);
      return;
    }
    response.writeHead(status, { location: destinationUrl }).end();
  });
  await new Promise<void>((resolve, reject) => {
    origin.once("error", reject);
    origin.listen(0, "127.0.0.1", resolve);
  });
  const originAddress = origin.address();
  if (typeof originAddress !== "object" || !originAddress) {
    await new Promise<void>((resolve) => origin.close(() => resolve()));
    await new Promise<void>((resolve) => destination.close(() => resolve()));
    throw new Error("NAVIGATION_ORIGIN_ADDRESS_UNAVAILABLE");
  }
  const approvedOrigin = `http://127.0.0.1:${originAddress.port}`;
  return {
    approvedOrigin,
    startUrl: `${approvedOrigin}/${status === "META_REFRESH" ? "meta-refresh" : `redirect-${status}`}`,
    unapprovedDocumentHits: () => unapprovedDocumentHits,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        origin.close((error) => (error ? reject(error) : resolve()));
      });
      await new Promise<void>((resolve, reject) => {
        destination.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}

async function expectPreblockedNavigation(
  status: RedirectStatus | "META_REFRESH",
): Promise<void> {
  const navigationCase = await startTopLevelNavigationCase(status);
  const targetKey = "loopback_fixture";
  const driver = new ChromeBrowserDriver(
    createControlledTargetRegistry([
      {
        key: targetKey,
        startUrl: navigationCase.startUrl,
        allowedTopLevelOrigins: [navigationCase.approvedOrigin],
        browserFamily: "chrome",
        navigationTimeoutMs: 5_000,
      },
    ]),
  );
  try {
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan(targetKey, ["C01_PAGE_IDENTITY"]),
    );
    expect(report.executionError).toBe("UNSAFE_TOP_LEVEL_REDIRECT");
    expect(report.observations).toEqual([]);
    expect(navigationCase.unapprovedDocumentHits()).toBe(0);
    expect(driver.getSecurityDiagnostics()).toEqual({
      secondaryPageCount: 0,
      unsafeTopLevelNavigation: true,
    });
  } finally {
    await navigationCase.close();
  }
}

async function runFixture(
  fixture: HealthH2Fixture,
  variant: HealthH2FixtureVariant,
  contourKeys?: Parameters<typeof createH2ProbePlan>[1],
) {
  const targetKey = "loopback_fixture";
  const driver = new ChromeBrowserDriver(
    createControlledTargetRegistry([
      {
        key: targetKey,
        startUrl: fixture.startUrl(variant),
        allowedTopLevelOrigins: [fixture.origin],
        browserFamily: "chrome",
        navigationTimeoutMs: 5_000,
      },
    ]),
  );
  return runH2StructuralSmoke(
    driver,
    createH2ProbePlan(targetKey, contourKeys),
  );
}

test.describe("P8.3 real Chromium loopback H2", () => {
  test("launches Chromium and observes the primary structural fixture", async () => {
    const fixture = await startHealthH2Fixture();
    try {
      const report = await runFixture(fixture, "PRIMARY_HEALTHY");
      expect(report.browserRuntime.browserName).toBe("chromium");
      expect(report.browserRuntime.browserVersion).not.toBe("unavailable");
      expect(report.executionError).toBeNull();
      expect(report.environmentUncertainty).toBeNull();
      expect(
        report.observations.every(
          (observation) => observation.selectedStrategyId !== null,
        ),
      ).toBe(true);
      expect(fixture.mutatingActionKinds).toEqual([]);
      expect(fixture.requestMethods.every((method) => method === "GET")).toBe(
        true,
      );
    } finally {
      await fixture.close();
    }
  });

  test("selects the approved fallback in deterministic order", async () => {
    const fixture = await startHealthH2Fixture();
    try {
      const report = await runFixture(fixture, "FALLBACK_STRUCTURAL", [
        "C03_COMPOSER_ROOT",
      ]);
      const observation = report.observations[0];
      expect(observation?.primaryAttempt.outcome).toBe("FAIL");
      expect(
        observation?.fallbackAttempts.map((attempt) => attempt.strategyId),
      ).toEqual(["ACTIVE_COMPOSER_REGION"]);
      expect(observation?.selectedStrategyId).toBe("ACTIVE_COMPOSER_REGION");
      expect(fixture.mutatingActionKinds).toEqual([]);
    } finally {
      await fixture.close();
    }
  });

  test("reports a required structural miss without a final HealthState", async () => {
    const fixture = await startHealthH2Fixture();
    try {
      const report = await runFixture(fixture, "REQUIRED_CORE_MISSING", [
        "C03_COMPOSER_ROOT",
      ]);
      expect(report.executionError).toBeNull();
      expect(report.observations[0]?.selectedStrategyId).toBeNull();
      expect(report.observations[0]?.structuralAssertions[0]?.outcome).toBe(
        "FAIL",
      );
      expect("healthState" in report).toBe(false);
      expect(fixture.mutatingActionKinds).toEqual([]);
    } finally {
      await fixture.close();
    }
  });

  test("maps a security checkpoint to environment uncertainty", async () => {
    const fixture = await startHealthH2Fixture();
    try {
      const report = await runFixture(fixture, "BLOCKING_STATE", [
        "C13_BLOCKING_STATE",
      ]);
      expect(report.environmentUncertainty).toBe("CAPTCHA_SECURITY_CHECKPOINT");
      expect(report.observations[0]?.structuralAssertions[0]?.outcome).toBe(
        "UNCERTAIN",
      );
      expect(fixture.mutatingActionKinds).toEqual([]);
    } finally {
      await fixture.close();
    }
  });

  test("rejects an unsafe top-level redirect", async () => {
    const fixture = await startHealthH2Fixture();
    try {
      const report = await runFixture(fixture, "UNSAFE_REDIRECT", [
        "C01_PAGE_IDENTITY",
      ]);
      expect(report.executionError).toBe("UNSAFE_TOP_LEVEL_REDIRECT");
      expect(report.observations).toEqual([]);
      expect(fixture.mutatingActionKinds).toEqual([]);
    } finally {
      await fixture.close();
    }
  });

  test("isolates cookies between separate ephemeral contexts", async () => {
    const fixture = await startHealthH2Fixture();
    try {
      await runFixture(fixture, "PRIMARY_HEALTHY", ["C01_PAGE_IDENTITY"]);
      await runFixture(fixture, "PRIMARY_HEALTHY", ["C01_PAGE_IDENTITY"]);
      expect(fixture.initialRequestCookies).toEqual(["", ""]);
      expect(fixture.mutatingActionKinds).toEqual([]);
    } finally {
      await fixture.close();
    }
  });

  test("blocks an unapproved cross-origin popup before its document request", async () => {
    let documentHits = 0;
    const destination: Server = createServer((_request, response) => {
      documentHits += 1;
      response.writeHead(200, { "content-type": "text/html" }).end("blocked");
    });
    await new Promise<void>((resolve, reject) => {
      destination.once("error", reject);
      destination.listen(0, "127.0.0.1", resolve);
    });
    const address = destination.address();
    if (typeof address !== "object" || !address) {
      await new Promise<void>((resolve) => destination.close(() => resolve()));
      throw new Error("POPUP_DESTINATION_ADDRESS_UNAVAILABLE");
    }
    const destinationOrigin = `http://127.0.0.1:${address.port}`;
    const fixture = await startHealthH2Fixture(destinationOrigin);
    const targetKey = "loopback_fixture";
    const driver = new ChromeBrowserDriver(
      createControlledTargetRegistry([
        {
          key: targetKey,
          startUrl: fixture.startUrl("POPUP_CROSS_ORIGIN"),
          allowedTopLevelOrigins: [fixture.origin],
          browserFamily: "chrome",
          navigationTimeoutMs: 5_000,
        },
      ]),
    );
    try {
      const report = await runH2StructuralSmoke(
        driver,
        createH2ProbePlan(targetKey, ["C01_PAGE_IDENTITY"]),
      );
      expect(report.executionError).toBe("UNSAFE_TOP_LEVEL_REDIRECT");
      expect(documentHits).toBe(0);
      expect(driver.getSecurityDiagnostics()).toEqual({
        secondaryPageCount: 0,
        unsafeTopLevelNavigation: true,
      });
    } finally {
      await fixture.close();
      await new Promise<void>((resolve, reject) => {
        destination.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  test("REDIRECT_301_PREBLOCKED", async () => {
    await expectPreblockedNavigation(301);
  });

  test("REDIRECT_302_PREBLOCKED", async () => {
    await expectPreblockedNavigation(302);
  });

  test("REDIRECT_303_PREBLOCKED", async () => {
    await expectPreblockedNavigation(303);
  });

  test("REDIRECT_307_PREBLOCKED", async () => {
    await expectPreblockedNavigation(307);
  });

  test("REDIRECT_308_PREBLOCKED", async () => {
    await expectPreblockedNavigation(308);
  });

  test("META_REFRESH_CROSS_ORIGIN_PREBLOCKED", async () => {
    await expectPreblockedNavigation("META_REFRESH");
  });
});
