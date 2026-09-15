import { expect, test } from "@playwright/test";
import {
  ChromeBrowserDriver,
  H3SurfaceStrategyRegistry,
  createControlledTargetRegistry,
  createH3RunPlan,
  runH3BehavioralSmokeFromRegistry,
} from "@product/health-runner";
import {
  startHealthWorkH3Fixture,
  type HealthWorkH3Fixture,
  type HealthWorkH3FixtureVariant,
} from "./support/health-work-h3-fixture.js";

const WORK_TARGET = "chatgpt_work_health";
const STANDARD_TARGET = "chatgpt_standard_health";

async function runVariant(
  fixture: HealthWorkH3Fixture,
  variant: HealthWorkH3FixtureVariant,
  surface: "CHATGPT_WORK" | "CHATGPT_STANDARD" = "CHATGPT_WORK",
) {
  const targetKey = surface === "CHATGPT_WORK" ? WORK_TARGET : STANDARD_TARGET;
  const driver = new ChromeBrowserDriver(
    createControlledTargetRegistry([
      {
        key: targetKey,
        startUrl: fixture.startUrl(variant),
        // The fixture origin is test-only. The approved Work origin remains
        // required by the Work strategy and is the only packaged production origin.
        allowedTopLevelOrigins: [fixture.origin, "https://chatgpt.com"],
        browserFamily: "chrome",
        navigationTimeoutMs: 5_000,
      },
    ]),
  );
  try {
    await driver.start();
    await driver.open(targetKey);
    const strategy =
      surface === "CHATGPT_WORK"
        ? driver.createChatGPTWorkH3Strategy()
        : driver.createChatGPTStandardH3Strategy();
    const registry = new H3SurfaceStrategyRegistry([strategy]);
    return await runH3BehavioralSmokeFromRegistry(
      registry,
      createH3RunPlan(targetKey, surface, {
        stepTimeoutMs: 5_000,
        runTimeoutMs: 30_000,
      }),
    );
  } finally {
    await driver.closeOrPersist();
  }
}

async function expectState(
  fixture: HealthWorkH3Fixture,
  expected: Readonly<{ promptMatches: number; sendActivations: number }>,
): Promise<void> {
  await expect
    .poll(async () => {
      const response = await fetch(`${fixture.origin}/fixture-state`);
      return response.json();
    })
    .toEqual(expected);
}

async function expectNoSend(
  variant: HealthWorkH3FixtureVariant,
  failureCode: string,
): Promise<void> {
  const fixture = await startHealthWorkH3Fixture();
  try {
    const result = await runVariant(fixture, variant);
    expect(result.failureCode).toBe(failureCode);
    await expectState(fixture, {
      promptMatches: ["MISSING_SEND", "AMBIGUOUS_SEND"].includes(variant)
        ? 1
        : 0,
      sendActivations: 0,
    });
  } finally {
    await fixture.close();
  }
}

test.describe("B4 packaged ChatGPT Work H3", () => {
  test("runs Work through the single B2 engine with one physical Send", async () => {
    const fixture = await startHealthWorkH3Fixture();
    try {
      const result = await runVariant(fixture, "VALID");
      expect(result.outcome).toBe("PASS");
      expect(result.completedSteps).toHaveLength(9);
      expect(result.surfaceProfile).toEqual({
        surface: "CHATGPT_WORK",
        profileId: "CHATGPT_WORK_H3_V1",
        profileRevision: 1,
      });
      await expectState(fixture, { promptMatches: 1, sendActivations: 1 });
      expect(JSON.stringify(result)).not.toContain("Health check");
      expect(JSON.stringify(result)).not.toContain("BRIDGE_HEALTHCHECK_V1");
      expect(JSON.stringify(result)).not.toContain("Работа");
      expect(JSON.stringify(result)).not.toContain("test-project");
    } finally {
      await fixture.close();
    }
  });

  test("keeps Send precedence when generation is already active", async () => {
    const fixture = await startHealthWorkH3Fixture();
    try {
      const result = await runVariant(fixture, "TEXT_PRESENT_GENERATING");
      expect(result.outcome).toBe("PASS");
      await expectState(fixture, { promptMatches: 1, sendActivations: 1 });
    } finally {
      await fixture.close();
    }
  });

  test("does not confuse the Stop state with Send", async () => {
    const fixture = await startHealthWorkH3Fixture();
    try {
      const result = await runVariant(fixture, "STOP_SEND_CONFUSION");
      expect(result.outcome).toBe("PASS");
      await expectState(fixture, { promptMatches: 1, sendActivations: 1 });
    } finally {
      await fixture.close();
    }
  });

  test.describe("surface and composer gates", () => {
    for (const [variant, failureCode] of [
      ["MISSING_WORK_MARKER", "SURFACE_IDENTIFICATION_FAILED"],
      ["WORK_MARKER_CONTENT_ONLY", "SURFACE_IDENTIFICATION_FAILED"],
      ["AMBIGUOUS_WORK_MARKER", "SURFACE_IDENTIFICATION_FAILED"],
      ["STANDARD_SURFACE", "SURFACE_IDENTIFICATION_FAILED"],
      ["NO_ROUTE_SHAPE", "SURFACE_IDENTIFICATION_FAILED"],
      ["ROUTE_CANONICAL_CONFLICT", "SURFACE_IDENTIFICATION_FAILED"],
      ["MISSING_COMPOSER", "COMPOSER_IDENTIFICATION_FAILED"],
      ["AMBIGUOUS_COMPOSER", "COMPOSER_IDENTIFICATION_FAILED"],
      ["WRONG_COMPOSER_NAME", "COMPOSER_IDENTIFICATION_FAILED"],
      ["DISABLED_INPUT", "COMPOSER_IDENTIFICATION_FAILED"],
      ["MISSING_SEND", "SEND_FAILED"],
      ["AMBIGUOUS_SEND", "SEND_FAILED"],
    ] as const) {
      test(`${variant} fails closed before Send`, async () => {
        await expectNoSend(variant, failureCode);
      });
    }
  });

  test("Work never falls back to Standard and Standard rejects Work", async () => {
    const fixture = await startHealthWorkH3Fixture();
    try {
      const workOnStandard = await runVariant(fixture, "STANDARD_SURFACE");
      expect(workOnStandard.failureCode).toBe("SURFACE_IDENTIFICATION_FAILED");
      const standardOnWork = await runVariant(
        fixture,
        "VALID",
        "CHATGPT_STANDARD",
      );
      expect(standardOnWork.failureCode).toBe("SURFACE_IDENTIFICATION_FAILED");
      await expectState(fixture, { promptMatches: 0, sendActivations: 0 });
    } finally {
      await fixture.close();
    }
  });

  test.describe("bounded post-Send failures never retry", () => {
    for (const [variant, failureCode] of [
      ["BUSY_TIMEOUT", "BUSY_TIMEOUT"],
      ["RESPONSE_MISSING", "RESPONSE_TIMEOUT"],
      ["OLD_RESPONSE_ONLY", "RESPONSE_TIMEOUT"],
      ["COMPLETION_MISSING", "COMPLETION_TIMEOUT"],
      ["RESPONSE_SELF_BUSY_STUCK", "COMPLETION_TIMEOUT"],
      ["STOP_CLEARS_BUT_OTHER_BUSY_REMAINS", "COMPLETION_TIMEOUT"],
      ["BUSY_CLEARS_BUT_STOP_REMAINS", "COMPLETION_TIMEOUT"],
      ["EMPTY_RESPONSE_AFTER_GENERATION", "COMPLETION_TIMEOUT"],
      ["PROJECT_ROUTE_MUTATION", "BUSY_OBSERVATION_FAILED"],
      ["CONVERSATION_MUTATION", "BUSY_OBSERVATION_FAILED"],
      ["CODE_BLOCK_MISSING", "BRIDGE_SURFACE_VALIDATION_FAILED"],
      ["NATIVE_COPY_MISSING", "BRIDGE_SURFACE_VALIDATION_FAILED"],
      ["NATIVE_COPY_MISMATCHED", "BRIDGE_SURFACE_VALIDATION_FAILED"],
      ["DELIVERY_MISSING", "BRIDGE_SURFACE_VALIDATION_FAILED"],
    ] as const) {
      test(`${variant} has exactly one Send`, async () => {
        const fixture = await startHealthWorkH3Fixture();
        try {
          const result = await runVariant(fixture, variant);
          expect(result.failureCode).toBe(failureCode);
          await expectState(fixture, { promptMatches: 1, sendActivations: 1 });
        } finally {
          await fixture.close();
        }
      });
    }
  });

  test.describe("bounded environment blockers", () => {
    for (const [variant, reason] of [
      ["LOGIN_EXPIRED", "LOGIN_EXPIRED"],
      ["CAPTCHA_CHECKPOINT", "CAPTCHA_SECURITY_CHECKPOINT"],
      ["VERIFICATION_CHECKPOINT", "VERIFICATION_CHECKPOINT"],
      ["ACCOUNT_BLOCKED", "ACCOUNT_BLOCKED"],
    ] as const) {
      test(`${variant} is uncertain with no Send`, async () => {
        const fixture = await startHealthWorkH3Fixture();
        try {
          const result = await runVariant(fixture, variant);
          expect(result.outcome).toBe("UNCERTAIN");
          expect(result.environmentUncertainty).toBe(reason);
          await expectState(fixture, { promptMatches: 0, sendActivations: 0 });
        } finally {
          await fixture.close();
        }
      });
    }
  });
});
