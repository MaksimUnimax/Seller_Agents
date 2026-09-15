import { describe, expect, it } from "vitest";
import {
  BASELINE_HEALTH_SUITE,
  HealthSuiteDefinitionSchema,
  classifyHealth,
} from "@product/health";
import {
  createH3HealthPersistenceCommand,
  type H3HealthPersistenceContext,
} from "./h3-health-persistence.js";
import { H3ExecutionResultSchema } from "./h3-engine.js";
import type { H3BehaviorStep } from "./h3-contracts.js";

const STARTED_AT = "2026-09-15T10:00:00.000Z";
const COMPLETED_AT = "2026-09-15T10:00:01.000Z";
const RUNTIME = {
  family: "chrome" as const,
  browserName: "chromium",
  browserVersion: "120.0.0.0",
  headless: true,
  sessionKind: "EPHEMERAL_CONTROLLED" as const,
};

function suiteFor(surface: "standard" | "work", profileRevision: 1 | 2) {
  return HealthSuiteDefinitionSchema.parse({
    ...BASELINE_HEALTH_SUITE,
    scope: {
      ...BASELINE_HEALTH_SUITE.scope,
      surfaceKey: surface,
      profile: {
        ...BASELINE_HEALTH_SUITE.scope.profile,
        revision: profileRevision,
      },
    },
  });
}

function event(step: H3BehaviorStep, outcome: "PASS" | "FAIL" | "UNCERTAIN") {
  return {
    step,
    outcome,
    durationMs: 4,
    markerCount: null,
    transitionObserved: null,
  };
}

function execution(
  surface: "CHATGPT_STANDARD" | "CHATGPT_WORK",
  outcome: "PASS" | "FAIL" | "UNCERTAIN",
  events: readonly ReturnType<typeof event>[],
  failureCode: "RESPONSE_OBSERVATION_FAILED" | "LOGIN_REQUIRED" | null,
  failureStep: "OBSERVE_RESPONSE" | "IDENTIFY_SURFACE" | null,
  environmentUncertainty: "LOGIN_EXPIRED" | null,
) {
  return H3ExecutionResultSchema.parse({
    level: "H3",
    targetKey:
      surface === "CHATGPT_STANDARD"
        ? "chatgpt_standard_health"
        : "chatgpt_work_health",
    surfaceProfile:
      surface === "CHATGPT_STANDARD"
        ? {
            surface,
            profileId: "CHATGPT_STANDARD_H3_V2",
            profileRevision: 2,
          }
        : {
            surface,
            profileId: "CHATGPT_WORK_H3_V1",
            profileRevision: 1,
          },
    outcome,
    completedSteps: events
      .filter((item) => item.outcome === "PASS")
      .map((item) => item.step),
    events,
    durationMs: 250,
    failureCode,
    failureStep,
    cleanupOutcome: "PASS",
    cleanupFailureCode: null,
    environmentUncertainty,
  });
}

function context(
  surface: "standard" | "work",
  profileRevision: 1 | 2,
  idempotencyKey: string,
): H3HealthPersistenceContext {
  return {
    suite: suiteFor(surface, profileRevision),
    idempotencyKey,
    startedAt: STARTED_AT,
    completedAt: COMPLETED_AT,
    browserRuntime: RUNTIME,
    operatorMaintenance: false,
    operatorMaintenanceAuthority: null,
    classifierVersion: "p8.1-classifier-v1",
  };
}

const PASS_EVENTS = [
  event("IDENTIFY_SURFACE", "PASS"),
  event("IDENTIFY_COMPOSER", "PASS"),
  event("INSERT_PROMPT", "PASS"),
  event("SEND_ONCE", "PASS"),
  event("OBSERVE_BUSY", "PASS"),
  event("OBSERVE_RESPONSE", "PASS"),
  event("OBSERVE_COMPLETION", "PASS"),
  event("VALIDATE_BRIDGE_SURFACES", "PASS"),
  event("CLEANUP", "PASS"),
] as const;

describe("B5 H3 capture-boundary Health mapper", () => {
  it.each([
    ["CHATGPT_STANDARD", "standard", 2],
    ["CHATGPT_WORK", "work", 1],
  ] as const)(
    "maps %s PASS into durable contour evidence",
    (surface, key, revision) => {
      const command = createH3HealthPersistenceCommand(
        execution(surface, "PASS", PASS_EVENTS, null, null, null),
        context(key, revision, `${key}-pass-retry-1`),
      );

      expect(command.results).toHaveLength(13);
      expect(
        command.results.every(
          (result) => result.observationStatus === "PRESENT",
        ),
      ).toBe(true);
      expect(
        command.results.every((result) => result.environmentStatus === "VALID"),
      ).toBe(true);
      expect(
        command.results.every((result) => result.evidence.length === 1),
      ).toBe(true);
      expect(
        classifyHealth({
          suite: command.suite,
          results: command.results,
          operatorMaintenance: command.operatorMaintenance,
        }),
      ).toBe("HEALTHY");
      expect(JSON.stringify(command.results)).not.toContain(
        "BRIDGE_COMMAND_SMOKE_V1",
      );
    },
  );

  it.each([
    ["CHATGPT_STANDARD", "standard", 2],
    ["CHATGPT_WORK", "work", 1],
  ] as const)(
    "maps %s post-Send FAIL without raw response details",
    (surface, key, revision) => {
      const failedEvents = [
        ...PASS_EVENTS.slice(0, 5),
        event("OBSERVE_RESPONSE", "FAIL"),
        event("CLEANUP", "PASS"),
      ];
      const command = createH3HealthPersistenceCommand(
        execution(
          surface,
          "FAIL",
          failedEvents,
          "RESPONSE_OBSERVATION_FAILED",
          "OBSERVE_RESPONSE",
          null,
        ),
        context(key, revision, `${key}-fail-retry-1`),
      );

      expect(
        command.results.find(
          (result) => result.contourKey === "C07_ASSISTANT_MESSAGE",
        )?.primaryStrategyOutcome,
      ).toBe("FAIL");
      expect(
        command.results.find(
          (result) => result.contourKey === "C08_MESSAGE_COMPLETION",
        )?.observationStatus,
      ).toBe("NOT_OBSERVED");
      expect(
        classifyHealth({
          suite: command.suite,
          results: command.results,
          operatorMaintenance: command.operatorMaintenance,
        }),
      ).toBe("BROKEN");
      expect(JSON.stringify(command.results)).not.toMatch(
        /TOXIC_PROMPT|TOXIC_RESPONSE|TOXIC_DOM|TOXIC_HTML|TOXIC_ERROR/i,
      );
    },
  );

  it.each([
    ["CHATGPT_STANDARD", "standard", 2],
    ["CHATGPT_WORK", "work", 1],
  ] as const)(
    "maps %s pre-Send environment uncertainty",
    (surface, key, revision) => {
      const uncertainEvents = [
        event("IDENTIFY_SURFACE", "UNCERTAIN"),
        event("CLEANUP", "PASS"),
      ];
      const command = createH3HealthPersistenceCommand(
        execution(
          surface,
          "UNCERTAIN",
          uncertainEvents,
          "LOGIN_REQUIRED",
          "IDENTIFY_SURFACE",
          "LOGIN_EXPIRED",
        ),
        context(key, revision, `${key}-uncertain-retry-1`),
      );

      expect(
        command.results.find(
          (result) => result.contourKey === "C13_BLOCKING_STATE",
        ),
      ).toMatchObject({
        environmentStatus: "UNCERTAIN",
        uncertaintyReason: "LOGIN_EXPIRED",
      });
      expect(
        classifyHealth({
          suite: command.suite,
          results: command.results,
          operatorMaintenance: command.operatorMaintenance,
        }),
      ).toBe("UNKNOWN");
      expect(JSON.stringify(command.results)).not.toMatch(
        /TOXIC_PROMPT|TOXIC_RESPONSE|TOXIC_DOM|TOXIC_HTML|TOXIC_COOKIE|TOXIC_TOKEN|TOXIC_STORAGE/i,
      );
    },
  );

  it("rejects unknown source fields before selecting any evidence", () => {
    const toxic = {
      ...execution("CHATGPT_STANDARD", "PASS", PASS_EVENTS, null, null, null),
      promptBody: "TOXIC_PROMPT_SENTINEL",
      assistantResponse: "TOXIC_RESPONSE_SENTINEL",
      projectId: "TOXIC_PROJECT_SENTINEL",
      conversationUuid: "TOXIC_CONVERSATION_SENTINEL",
      cookie: "TOXIC_COOKIE_SENTINEL",
      bearerToken: "TOXIC_TOKEN_SENTINEL",
      storageValue: "TOXIC_STORAGE_SENTINEL",
      sellerPayload: "TOXIC_SELLER_SENTINEL",
    };

    expect(() =>
      createH3HealthPersistenceCommand(
        toxic,
        context("standard", 2, "standard-toxic-retry-1"),
      ),
    ).toThrow();
  });

  it("keeps evidence references opaque and bounded", () => {
    const command = createH3HealthPersistenceCommand(
      execution("CHATGPT_WORK", "PASS", PASS_EVENTS, null, null, null),
      context("work", 1, "work-opaque-retry-1"),
    );
    const serialized = JSON.stringify(command.results);
    for (const result of command.results) {
      const reference = result.evidence[0];
      expect(reference?.evidenceId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(reference?.evidenceId.length).toBe(36);
    }
    expect(serialized).not.toContain("work-opaque-retry-1");
    expect(serialized).not.toContain("Работа");
  });
});
