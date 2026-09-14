import { describe, expect, it } from "vitest";
import type {
  BrowserDriver,
  ControlledNavigationResult,
} from "./browser-driver.js";
import { BrowserDriverError, ChromeBrowserDriver } from "./browser-driver.js";
import {
  createH2ProbePlan,
  parseH2ProbePlan,
  runH2StructuralSmoke,
  type BrowserRuntimeMetadata,
} from "./h2.js";
import {
  ControlledTargetRegistry,
  createControlledTargetRegistry,
} from "./target-registry.js";
import type {
  SafeStructuralObservation,
  SafeStructuralMetadata,
} from "./strategies.js";
import { shouldBlockPrimaryDocumentRequest } from "./navigation-policy.js";

const metadata: SafeStructuralMetadata = {
  elementCount: 1,
  tag: "div",
  role: "region",
  type: null,
  ariaLabelPresent: false,
  stableDataKind: "fixture",
  visible: true,
  editable: false,
  actionable: false,
  relationship: "BOUNDED_PACKAGED_TARGET",
  blockingState: null,
};

function observation(
  outcome: SafeStructuralObservation["outcome"] = "PASS",
  uncertaintyReason: SafeStructuralObservation["uncertaintyReason"] = null,
): SafeStructuralObservation {
  return { outcome, metadata, uncertaintyReason };
}

class FakeDriver implements BrowserDriver {
  public readonly family = "chrome" as const;
  public readonly sessionKind = "EPHEMERAL_CONTROLLED" as const;
  public readonly calls: string[] = [];
  public closed = false;
  public runtime: BrowserRuntimeMetadata = {
    family: "chrome",
    browserName: "fake-chromium",
    browserVersion: "test",
    headless: true,
    sessionKind: "EPHEMERAL_CONTROLLED",
  };
  public results = new Map<string, SafeStructuralObservation>();
  public error: Error | undefined;

  public async prepareSession(): Promise<void> {
    this.calls.push("prepareSession");
  }
  public async launch(): Promise<void> {
    this.calls.push("launch");
  }
  public async start(): Promise<void> {
    this.calls.push("start");
  }
  public async open(targetKey: string): Promise<ControlledNavigationResult> {
    this.calls.push(`open:${targetKey}`);
    return { targetKey, finalOrigin: "http://127.0.0.1:1" };
  }
  public getRuntimeMetadata(): BrowserRuntimeMetadata {
    return this.runtime;
  }
  public getSecurityDiagnostics() {
    return { secondaryPageCount: 0, unsafeTopLevelNavigation: false } as const;
  }
  public async observeStrategy(
    strategyId: string,
  ): Promise<SafeStructuralObservation> {
    this.calls.push(`observe:${strategyId}`);
    if (this.error) throw this.error;
    const result = this.results.get(strategyId);
    if (!result) return observation();
    return result;
  }
  public async closeOrPersist(): Promise<void> {
    this.calls.push("closeOrPersist");
    this.closed = true;
  }
  public async stop(): Promise<void> {
    await this.closeOrPersist();
  }
}

const targetDefinition = {
  key: "loopback_fixture",
  startUrl: "http://127.0.0.1:4321/healthy",
  allowedTopLevelOrigins: ["http://127.0.0.1:4321"],
  browserFamily: "chrome" as const,
  navigationTimeoutMs: 2_000,
};

describe("P8.3 controlled BrowserDriver and H2 boundary", () => {
  it("keeps the lifecycle explicit and closes after a successful H2 run", async () => {
    const driver = new FakeDriver();
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan("loopback_fixture", ["C01_PAGE_IDENTITY"]),
    );
    expect(driver.calls).toEqual([
      "start",
      "open:loopback_fixture",
      "observe:PAGE_HOST_MARKER",
      "closeOrPersist",
    ]);
    expect(report.browserRuntime.sessionKind).toBe("EPHEMERAL_CONTROLLED");
  });

  it("identifies the concrete implementation as Chrome", () => {
    const driver = new ChromeBrowserDriver(
      createControlledTargetRegistry([targetDefinition]),
    );
    expect(driver.family).toBe("chrome");
    expect(driver.sessionKind).toBe("EPHEMERAL_CONTROLLED");
  });

  it("accepts only registered controlled targets", () => {
    const registry = new ControlledTargetRegistry([targetDefinition]);
    expect(registry.resolve("loopback_fixture").startUrl).toContain(
      "127.0.0.1",
    );
    expect(() => registry.resolve("missing_target")).toThrow(
      "CONTROLLED_TARGET_NOT_REGISTERED",
    );
  });

  it.each([
    "file:///tmp/x",
    "data:text/html,blocked",
    "javascript:alert(1)",
    "blob:http://127.0.0.1/x",
    "ftp://127.0.0.1/x",
  ])("rejects unsafe target scheme %s", (startUrl) => {
    expect(() =>
      createControlledTargetRegistry([{ ...targetDefinition, startUrl }]),
    ).toThrow(/UNSAFE_CONTROLLED_TARGET_URL|INVALID_CONTROLLED_TARGET_ORIGIN/);
  });

  it("rejects embedded target credentials", () => {
    expect(() =>
      createControlledTargetRegistry([
        { ...targetDefinition, startUrl: "http://user:pass@127.0.0.1:4321/x" },
      ]),
    ).toThrow("UNSAFE_CONTROLLED_TARGET_URL");
  });

  it("requires the start origin to be in the top-level origin policy", () => {
    expect(() =>
      createControlledTargetRegistry([
        {
          ...targetDefinition,
          allowedTopLevelOrigins: ["http://127.0.0.1:4322"],
        },
      ]),
    ).toThrow("TARGET_ORIGIN_POLICY_MISMATCH");
  });

  it("rejects unknown H2 plan fields and raw selector authority", () => {
    const valid = createH2ProbePlan("loopback_fixture", ["C01_PAGE_IDENTITY"]);
    expect(() =>
      parseH2ProbePlan({ ...valid, url: targetDefinition.startUrl }),
    ).toThrow();
    expect(() =>
      parseH2ProbePlan({
        ...valid,
        contours: [{ ...valid.contours[0], selector: "#arbitrary" }],
      }),
    ).toThrow();
    expect(() =>
      parseH2ProbePlan({
        ...valid,
        contours: [{ ...valid.contours[0], script: "document.body" }],
      }),
    ).toThrow();
  });

  it("rejects a strategy order that is not the packaged contour order", () => {
    const valid = createH2ProbePlan("loopback_fixture", ["C03_COMPOSER_ROOT"]);
    expect(() =>
      parseH2ProbePlan({
        ...valid,
        contours: [
          {
            ...valid.contours[0],
            fallbackStrategyIds: ["ACTIVE_CONVERSATION_REGION"],
          },
        ],
      }),
    ).toThrow("H2 strategy order does not match packaged contour");
  });

  it("executes primary then the ordered fallback until a match", async () => {
    const driver = new FakeDriver();
    driver.results.set("COMPOSER_CONTAINER", observation("FAIL"));
    driver.results.set("ACTIVE_COMPOSER_REGION", observation("PASS"));
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan("loopback_fixture", ["C03_COMPOSER_ROOT"]),
    );
    const result = report.observations[0];
    expect(result?.primaryAttempt.strategyId).toBe("COMPOSER_CONTAINER");
    expect(
      result?.fallbackAttempts.map((attempt) => attempt.strategyId),
    ).toEqual(["ACTIVE_COMPOSER_REGION"]);
    expect(result?.selectedStrategyId).toBe("ACTIVE_COMPOSER_REGION");
  });

  it("maps a bounded observation timeout to environment uncertainty and cleans up", async () => {
    const driver = new FakeDriver();
    driver.error = new BrowserDriverError("OBSERVATION_TIMEOUT");
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan("loopback_fixture", ["C01_PAGE_IDENTITY"]),
    );
    expect(report.executionError).toBe("OBSERVATION_TIMEOUT");
    expect(report.environmentUncertainty).toBe(
      "CONTROLLED_BROWSER_UNAVAILABLE",
    );
    expect(driver.closed).toBe(true);
  });

  it("maps blocking observations without claiming a product health state", async () => {
    const driver = new FakeDriver();
    driver.results.set(
      "BLOCKING_MARKER",
      observation("UNCERTAIN", "CAPTCHA_SECURITY_CHECKPOINT"),
    );
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan("loopback_fixture", ["C13_BLOCKING_STATE"]),
    );
    expect(report.environmentUncertainty).toBe("CAPTCHA_SECURITY_CHECKPOINT");
    expect("healthState" in report).toBe(false);
    expect(driver.closed).toBe(true);
  });

  it("reports structural misses without fabricating BROKEN or invoking persistence", async () => {
    const driver = new FakeDriver();
    driver.results.set("COMPOSER_CONTAINER", observation("FAIL"));
    driver.results.set("ACTIVE_COMPOSER_REGION", observation("FAIL"));
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan("loopback_fixture", ["C03_COMPOSER_ROOT"]),
    );
    expect(report.observations[0]?.structuralAssertions[0]?.outcome).toBe(
      "FAIL",
    );
    expect("healthState" in report).toBe(false);
    expect(report.executionError).toBeNull();
  });

  it("cleans up when observation fails unexpectedly", async () => {
    const driver = new FakeDriver();
    driver.error = new Error("synthetic observation failure");
    const report = await runH2StructuralSmoke(
      driver,
      createH2ProbePlan("loopback_fixture", ["C01_PAGE_IDENTITY"]),
    );
    expect(report.executionError).toBe("OBSERVATION_FAILED");
    expect(driver.closed).toBe(true);
  });

  it("keeps safe structural metadata bounded and allowlisted", () => {
    const valid = createH2ProbePlan("loopback_fixture", ["C01_PAGE_IDENTITY"]);
    expect(() =>
      parseH2ProbePlan({
        ...valid,
        contours: [{ ...valid.contours[0], timeoutMs: 31_000 }],
      }),
    ).toThrow();
  });

  it("keeps session mode ephemeral across driver instances", () => {
    const registry = createControlledTargetRegistry([targetDefinition]);
    const first = new ChromeBrowserDriver(registry);
    const second = new ChromeBrowserDriver(registry);
    expect(first.sessionKind).toBe("EPHEMERAL_CONTROLLED");
    expect(second.sessionKind).toBe("EPHEMERAL_CONTROLLED");
    expect(first.getRuntimeMetadata().browserVersion).toBe("unavailable");
    expect(second.getRuntimeMetadata().browserVersion).toBe("unavailable");
  });

  it("runtime-encapsulates raw Playwright handles", () => {
    const driver = new ChromeBrowserDriver(
      createControlledTargetRegistry([targetDefinition]),
    );
    const exposedNames = [
      ...Object.keys(driver),
      ...Object.getOwnPropertyNames(driver),
      ...Object.getOwnPropertySymbols(driver).map(String),
    ];
    expect(Reflect.get(driver, "browser")).toBeUndefined();
    expect(Reflect.get(driver, "context")).toBeUndefined();
    expect(Reflect.get(driver, "page")).toBeUndefined();
    expect(Reflect.get(driver, "cdpSession")).toBeUndefined();
    expect(Reflect.get(driver, "session")).toBeUndefined();
    expect(Reflect.get(driver, "networkSession")).toBeUndefined();
    expect(exposedNames).not.toEqual(
      expect.arrayContaining([
        "browser",
        "context",
        "page",
        "cdpSession",
        "session",
        "networkSession",
      ]),
    );
    for (const name of exposedNames) {
      const value = Reflect.get(driver, name);
      expect(value).not.toBeInstanceOf(Function);
      expect(value?.constructor?.name).not.toMatch(
        /^(Browser|BrowserContext|Page|Locator|ElementHandle|JSHandle|CDPSession)$/,
      );
    }
  });

  it("blocks only disallowed primary Document origins", () => {
    const primaryFrameId = "primary-frame";
    expect(
      shouldBlockPrimaryDocumentRequest(
        "http://127.0.0.1:4322/redirected",
        primaryFrameId,
        primaryFrameId,
        ["http://127.0.0.1:4321"],
      ),
    ).toBe(true);
    expect(
      shouldBlockPrimaryDocumentRequest(
        "http://127.0.0.1:4321/allowed",
        primaryFrameId,
        primaryFrameId,
        ["http://127.0.0.1:4321"],
      ),
    ).toBe(false);
    expect(
      shouldBlockPrimaryDocumentRequest(
        "http://127.0.0.1:4322/iframe",
        "child-frame",
        primaryFrameId,
        ["http://127.0.0.1:4321"],
      ),
    ).toBe(false);
  });
});
