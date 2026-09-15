import { expect, test } from "@playwright/test";
import {
  ChromeBrowserDriver,
  H3SurfaceStrategyRegistry,
  createControlledTargetRegistry,
  createH3RunPlan,
  runH3BehavioralSmokeFromRegistry,
} from "@product/health-runner";
import {
  startHealthStandardH3Fixture,
  type HealthStandardH3Fixture,
  type HealthStandardH3FixtureVariant,
} from "./support/health-standard-h3-fixture.js";

const TARGET_KEY = "chatgpt_standard_health";

async function runVariant(
  fixture: HealthStandardH3Fixture,
  variant: HealthStandardH3FixtureVariant,
  bookkeeping = true,
) {
  const driver = new ChromeBrowserDriver(
    createControlledTargetRegistry([
      {
        key: TARGET_KEY,
        startUrl: fixture.startUrl(variant, bookkeeping),
        allowedTopLevelOrigins: [fixture.origin],
        browserFamily: "chrome",
        navigationTimeoutMs: 5_000,
      },
    ]),
  );
  try {
    await driver.start();
    await driver.open(TARGET_KEY);
    const strategy = driver.createChatGPTStandardH3Strategy();
    const registry = new H3SurfaceStrategyRegistry([strategy]);
    const result = await runH3BehavioralSmokeFromRegistry(
      registry,
      createH3RunPlan(TARGET_KEY, "CHATGPT_STANDARD", {
        stepTimeoutMs: 5_000,
        runTimeoutMs: 30_000,
      }),
    );
    expect(driver.getRuntimeMetadata().browserVersion).toBe("unavailable");
    return result;
  } catch (error) {
    await driver.closeOrPersist();
    throw error;
  }
}

async function readFixtureState(fixture: HealthStandardH3Fixture): Promise<{
  promptMatches: number;
  sendActivations: number;
}> {
  const response = await fetch(`${fixture.origin}/fixture-state`);
  return (await response.json()) as {
    promptMatches: number;
    sendActivations: number;
  };
}

async function waitForFixtureState(
  fixture: HealthStandardH3Fixture,
  expected: Readonly<{ promptMatches: number; sendActivations: number }>,
): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const state = await readFixtureState(fixture);
    if (
      state.promptMatches === expected.promptMatches &&
      state.sendActivations === expected.sendActivations
    ) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  await expect.poll(() => readFixtureState(fixture)).toEqual(expected);
}

async function expectNoSend(
  variant: HealthStandardH3FixtureVariant,
  expectedFailureCode: string,
): Promise<void> {
  const fixture = await startHealthStandardH3Fixture();
  try {
    const result = await runVariant(fixture, variant);
    expect(result.failureCode).toBe(expectedFailureCode);
    await waitForFixtureState(fixture, {
      promptMatches: ["MISSING_SEND", "SEND_AMBIGUOUS"].includes(variant)
        ? 1
        : 0,
      sendActivations: 0,
    });
  } finally {
    await fixture.close();
  }
}

test.describe("B3 packaged ChatGPT Standard H3", () => {
  test("runs the real Standard strategy through the common B2 engine", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "VALID");
      expect(result.outcome).toBe("PASS");
      expect(result.completedSteps).toHaveLength(9);
      expect(result.surfaceProfile).toEqual({
        surface: "CHATGPT_STANDARD",
        profileId: "CHATGPT_STANDARD_H3_V2",
        profileRevision: 2,
      });
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
      expect(JSON.stringify(result)).not.toContain("Health check");
      expect(JSON.stringify(result)).not.toContain("BRIDGE_HEALTHCHECK_V1");
      expect(JSON.stringify(result)).not.toMatch(/selector|html|cookie|token/i);
    } finally {
      await fixture.close();
    }
  });

  test("supports a fresh root with no pre-send conversation identity", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "FRESH_ROOT_NO_ID");
      expect(result.outcome).toBe("PASS");
      expect(result.completedSteps).toHaveLength(9);
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
    } finally {
      await fixture.close();
    }
  });

  test("supports an existing bound conversation with stable identity", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "EXISTING_CONVERSATION");
      expect(result.outcome).toBe("PASS");
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
    } finally {
      await fixture.close();
    }
  });

  test("bounds a fresh send when conversation identity never binds", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "IDENTITY_NEVER_BINDS");
      expect(result.failureCode).toBe("BUSY_OBSERVATION_FAILED");
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
    } finally {
      await fixture.close();
    }
  });

  test("rejects a deterministic route/canonical identity conflict before Send", async () => {
    await expectNoSend(
      "ROUTE_CANONICAL_CONFLICT",
      "SURFACE_IDENTIFICATION_FAILED",
    );
  });

  test("fixture bookkeeping is irrelevant to production contour discovery", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "VALID", false);
      expect(result.outcome).toBe("PASS");
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
    } finally {
      await fixture.close();
    }
  });

  test("fixture is built from the shipped Standard profile authority", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "VALID");
      expect(result.surfaceProfile).toEqual({
        surface: "CHATGPT_STANDARD",
        profileId: "CHATGPT_STANDARD_H3_V2",
        profileRevision: 2,
      });
      expect(result.outcome).toBe("PASS");
    } finally {
      await fixture.close();
    }
  });

  test("registers Standard only and rejects Work resolution", async () => {
    const fixture = await startHealthStandardH3Fixture();
    const driver = new ChromeBrowserDriver(
      createControlledTargetRegistry([
        {
          key: TARGET_KEY,
          startUrl: fixture.startUrl("VALID"),
          allowedTopLevelOrigins: [fixture.origin],
          browserFamily: "chrome",
          navigationTimeoutMs: 5_000,
        },
      ]),
    );
    try {
      await driver.start();
      await driver.open(TARGET_KEY);
      const strategy = driver.createChatGPTStandardH3Strategy();
      const registry = new H3SurfaceStrategyRegistry([strategy]);
      expect(registry.resolve("CHATGPT_STANDARD", TARGET_KEY)).toBe(strategy);
      expect(() =>
        registry.resolve("CHATGPT_WORK", "chatgpt_work_health"),
      ).toThrow("STRATEGY_NOT_REGISTERED");
    } finally {
      await driver.closeOrPersist();
      await fixture.close();
    }
  });

  test("does not confuse a visible Stop control with Send", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "SEND_STOP_CONFUSION");
      expect(result.outcome).toBe("PASS");
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
    } finally {
      await fixture.close();
    }
  });

  test("does not accept historical assistant content as the new response", async () => {
    const fixture = await startHealthStandardH3Fixture();
    try {
      const result = await runVariant(fixture, "OLD_RESPONSE_ONLY");
      expect(result.failureCode).toBe("RESPONSE_TIMEOUT");
      await waitForFixtureState(fixture, {
        promptMatches: 1,
        sendActivations: 1,
      });
    } finally {
      await fixture.close();
    }
  });

  test.describe("pre-send failures", () => {
    for (const [variant, failureCode] of [
      ["WORK_SURFACE", "SURFACE_IDENTIFICATION_FAILED"],
      ["MISSING_SURFACE", "SURFACE_IDENTIFICATION_FAILED"],
      ["MISSING_COMPOSER", "COMPOSER_IDENTIFICATION_FAILED"],
      ["AMBIGUOUS_COMPOSER", "COMPOSER_IDENTIFICATION_FAILED"],
      ["DISABLED_INPUT", "COMPOSER_IDENTIFICATION_FAILED"],
      ["MISSING_SEND", "SEND_FAILED"],
      ["SEND_AMBIGUOUS", "SEND_FAILED"],
    ] as const) {
      test(`${variant} fails before physical Send`, async () => {
        await expectNoSend(variant, failureCode);
      });
    }
  });

  test.describe("environment blockers", () => {
    for (const [variant, reason] of [
      ["LOGIN_EXPIRED", "LOGIN_EXPIRED"],
      ["CAPTCHA_CHECKPOINT", "CAPTCHA_SECURITY_CHECKPOINT"],
      ["VERIFICATION_CHECKPOINT", "VERIFICATION_CHECKPOINT"],
      ["ACCOUNT_BLOCKED", "ACCOUNT_BLOCKED"],
    ] as const) {
      test(`${variant} is uncertain and cannot Send`, async () => {
        const fixture = await startHealthStandardH3Fixture();
        try {
          const result = await runVariant(fixture, variant);
          expect(result.outcome).toBe("UNCERTAIN");
          expect(result.environmentUncertainty).toBe(reason);
          expect(result.failureCode).toMatch(
            /LOGIN_REQUIRED|VERIFICATION_CHECKPOINT|ACCOUNT_BLOCKED/,
          );
          await waitForFixtureState(fixture, {
            promptMatches: 0,
            sendActivations: 0,
          });
        } finally {
          await fixture.close();
        }
      });
    }
  });

  test.describe("post-send failures never retry", () => {
    for (const [variant, failureStep, failureCode] of [
      ["EXISTING_IDENTITY_CHANGES", "OBSERVE_BUSY", "BUSY_OBSERVATION_FAILED"],
      [
        "FRESH_BOUND_IDENTITY_CHANGES",
        "OBSERVE_COMPLETION",
        "COMPLETION_OBSERVATION_FAILED",
      ],
    ] as const) {
      test(`${variant} is bounded after one Send`, async () => {
        const fixture = await startHealthStandardH3Fixture();
        try {
          const result = await runVariant(fixture, variant);
          expect(result.failureStep).toBe(failureStep);
          expect(result.failureCode).toBe(failureCode);
          expect(result.outcome).toBe("FAIL");
          await waitForFixtureState(fixture, {
            promptMatches: 1,
            sendActivations: 1,
          });
        } finally {
          await fixture.close();
        }
      });
    }

    for (const [variant, failureCode] of [
      ["BUSY_TIMEOUT", "BUSY_TIMEOUT"],
      ["RESPONSE_MISSING", "RESPONSE_TIMEOUT"],
      ["COMPLETION_MISSING", "COMPLETION_TIMEOUT"],
      ["CODE_BLOCK_MISSING", "BRIDGE_SURFACE_VALIDATION_FAILED"],
      ["COPY_MISSING", "BRIDGE_SURFACE_VALIDATION_FAILED"],
      ["COPY_MISMATCHED", "BRIDGE_SURFACE_VALIDATION_FAILED"],
      ["CONVERSATION_CHANGED", "BUSY_OBSERVATION_FAILED"],
      ["DELIVERY_MISSING", "BRIDGE_SURFACE_VALIDATION_FAILED"],
    ] as const) {
      test(`${variant} activates Send once`, async () => {
        const fixture = await startHealthStandardH3Fixture();
        try {
          const result = await runVariant(fixture, variant);
          expect(result.failureCode).toBe(failureCode);
          await waitForFixtureState(fixture, {
            promptMatches: 1,
            sendActivations: 1,
          });
        } finally {
          await fixture.close();
        }
      });
    }

    for (const [variant, failureCode] of [
      ["RESPONSE_SELF_BUSY_STUCK", "COMPLETION_TIMEOUT"],
      ["STOP_CLEARS_BUT_OTHER_BUSY_REMAINS", "COMPLETION_TIMEOUT"],
      ["BUSY_CLEARS_BUT_STOP_REMAINS", "COMPLETION_TIMEOUT"],
      ["EMPTY_RESPONSE_AFTER_GENERATION", "COMPLETION_TIMEOUT"],
      ["IDENTITY_CHANGES_DURING_COMPLETION", "COMPLETION_OBSERVATION_FAILED"],
    ] as const) {
      test(`${variant} fails at OBSERVE_COMPLETION without retry`, async () => {
        const fixture = await startHealthStandardH3Fixture();
        try {
          const result = await runVariant(fixture, variant);
          expect(result.failureCode).toBe(failureCode);
          expect(result.failureStep).toBe("OBSERVE_COMPLETION");
          expect(result.completedSteps).not.toContain("OBSERVE_COMPLETION");
          await waitForFixtureState(fixture, {
            promptMatches: 1,
            sendActivations: 1,
          });
        } finally {
          await fixture.close();
        }
      });
    }
  });
});
