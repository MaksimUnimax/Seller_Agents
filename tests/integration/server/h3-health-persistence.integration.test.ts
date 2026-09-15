import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  BASELINE_HEALTH_SUITE,
  HealthSuiteDefinitionSchema,
  type HealthSuiteDefinition,
} from "../../../packages/server/health/src/index.js";
import {
  createH3HealthPersistenceCommand,
  type H3HealthPersistenceContext,
} from "../../../apps/health-runner/src/h3-health-persistence.js";
import { H3ExecutionResultSchema } from "../../../apps/health-runner/src/h3-engine.js";
import type { H3BehaviorStep } from "../../../apps/health-runner/src/h3-contracts.js";
import {
  createDatabaseRuntime,
  createHealthPersistenceRepository,
} from "@product/db";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const IDS = {
  adapter: "00000000-0000-4000-8000-000000000101",
  standardSurface: "00000000-0000-4000-8000-000000000102",
  workSurface: "00000000-0000-4000-8000-000000000103",
  standardProfile: "00000000-0000-4000-8000-000000000104",
  workProfile: "00000000-0000-4000-8000-000000000105",
  standardRevision: "00000000-0000-4000-8000-000000000106",
  workRevision: "00000000-0000-4000-8000-000000000107",
};

const runtime = createDatabaseRuntime(connectionString);
const repository = createHealthPersistenceRepository(runtime);

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

function suiteFor(surface: "standard" | "work"): HealthSuiteDefinition {
  const standard = surface === "standard";
  const machineKey = standard ? "b5-chatgpt-standard" : "b5-chatgpt-work";
  return HealthSuiteDefinitionSchema.parse({
    ...BASELINE_HEALTH_SUITE,
    machineKey,
    scope: {
      ...BASELINE_HEALTH_SUITE.scope,
      adapterFamilyId: IDS.adapter,
      adapterFamilyKey: "chatgpt",
      surfaceId: standard ? IDS.standardSurface : IDS.workSurface,
      surfaceKey: surface,
      profile: {
        id: standard ? IDS.standardProfile : IDS.workProfile,
        revision: standard ? 2 : 1,
      },
      healthSuite: { machineKey, revision: 1 },
    },
  });
}

function context(
  suite: HealthSuiteDefinition,
  idempotencyKey: string,
): H3HealthPersistenceContext {
  return {
    suite,
    idempotencyKey,
    startedAt: "2026-09-15T11:00:00.000Z",
    completedAt: "2026-09-15T11:00:01.000Z",
    browserRuntime: {
      family: "chrome",
      browserName: "chromium",
      browserVersion: "120.0.0.0",
      headless: true,
      sessionKind: "EPHEMERAL_CONTROLLED",
    },
    operatorMaintenance: false,
    operatorMaintenanceAuthority: null,
    classifierVersion: "p8.1-classifier-v1",
  };
}

async function persist(
  surface: "standard" | "work",
  result: ReturnType<typeof H3ExecutionResultSchema.parse>,
  key: string,
) {
  const command = createH3HealthPersistenceCommand(
    result,
    context(suiteFor(surface), key),
  );
  const run = await repository.persistCompletedHealthRun(command);
  return {
    run,
    contours: await repository.listContourResults(run.id),
    evidence: await repository.listEvidenceReferences(run.id),
  };
}

describe("B5 durable Standard/Work H3 evidence", () => {
  beforeAll(async () => {
    await runtime.ready();
    await runtime.query(
      `INSERT INTO ai_adapters(id,machine_key,display_name) VALUES($1,'chatgpt','ChatGPT')`,
      [IDS.adapter],
    );
    await runtime.query(
      `INSERT INTO ai_surfaces(id,adapter_id,machine_key,display_name) VALUES($1,$2,'standard','ChatGPT Standard'),($3,$2,'work','ChatGPT Work')`,
      [IDS.standardSurface, IDS.adapter, IDS.workSurface],
    );
    await runtime.query(
      `INSERT INTO adapter_profiles(id,adapter_id,surface_id,machine_key,display_name) VALUES($1,$2,$3,'standard-h3','Standard H3'),($4,$2,$5,'work-h3','Work H3')`,
      [
        IDS.standardProfile,
        IDS.adapter,
        IDS.standardSurface,
        IDS.workProfile,
        IDS.workSurface,
      ],
    );
    await runtime.query(
      `INSERT INTO adapter_profile_revisions(id,profile_id,adapter_id,surface_id,revision,schema_version,state,content,compatibility_constraints,content_sha256) VALUES($1,$2,$3,$4,2,'adapter_profile_v1','DRAFT','{}'::jsonb,'{}'::jsonb,$5),($6,$7,$3,$8,1,'adapter_profile_v1','DRAFT','{}'::jsonb,'{}'::jsonb,$5)`,
      [
        IDS.standardRevision,
        IDS.standardProfile,
        IDS.adapter,
        IDS.standardSurface,
        "0".repeat(64),
        IDS.workRevision,
        IDS.workProfile,
        IDS.workSurface,
      ],
    );
  });

  afterAll(async () => runtime.close());

  it.each([
    ["standard", "CHATGPT_STANDARD"],
    ["work", "CHATGPT_WORK"],
  ] as const)(
    "persists %s PASS with sanitized contour evidence",
    async (surface, executionSurface) => {
      const stored = await persist(
        surface,
        execution(executionSurface, "PASS", PASS_EVENTS, null, null, null),
        `b5-${surface}-pass-1`,
      );
      expect(stored.run.healthLevel).toBe("H3");
      expect(stored.run.healthState).toBe("HEALTHY");
      expect(stored.run.browserFamily).toBe("chrome");
      expect(stored.run.browserVersion).toBe("120.0.0.0");
      expect(stored.run.profileRevision).toBe(surface === "standard" ? 2 : 1);
      expect(stored.contours).toHaveLength(13);
      expect(stored.evidence).toHaveLength(13);
      expect(
        stored.evidence.every((item) => item.evidenceId.length === 36),
      ).toBe(true);
      expect(JSON.stringify(stored)).not.toMatch(
        /TOXIC_PROMPT|TOXIC_RESPONSE|TOXIC_DOM|TOXIC_HTML|TOXIC_PROJECT|TOXIC_CONVERSATION|TOXIC_COOKIE|TOXIC_TOKEN|TOXIC_STORAGE|TOXIC_SELLER/i,
      );
    },
  );

  it.each([
    ["standard", "CHATGPT_STANDARD"],
    ["work", "CHATGPT_WORK"],
  ] as const)(
    "persists %s post-Send FAIL without raw response/DOM",
    async (surface, executionSurface) => {
      const failedEvents = [
        ...PASS_EVENTS.slice(0, 5),
        event("OBSERVE_RESPONSE", "FAIL"),
        event("CLEANUP", "PASS"),
      ];
      const stored = await persist(
        surface,
        execution(
          executionSurface,
          "FAIL",
          failedEvents,
          "RESPONSE_OBSERVATION_FAILED",
          "OBSERVE_RESPONSE",
          null,
        ),
        `b5-${surface}-fail-1`,
      );
      expect(stored.run.healthState).toBe("BROKEN");
      expect(
        stored.contours.find(
          (item) => item.contourKey === "C07_ASSISTANT_MESSAGE",
        )?.primaryStrategyOutcome,
      ).toBe("FAIL");
      expect(
        stored.evidence.some(
          (item) => item.classification === "BOUNDED_FRAGMENT",
        ),
      ).toBe(true);
    },
  );

  it.each([
    ["standard", "CHATGPT_STANDARD"],
    ["work", "CHATGPT_WORK"],
  ] as const)(
    "persists %s pre-Send UNCERTAIN as bounded environment state",
    async (surface, executionSurface) => {
      const stored = await persist(
        surface,
        execution(
          executionSurface,
          "UNCERTAIN",
          [event("IDENTIFY_SURFACE", "UNCERTAIN"), event("CLEANUP", "PASS")],
          "LOGIN_REQUIRED",
          "IDENTIFY_SURFACE",
          "LOGIN_EXPIRED",
        ),
        `b5-${surface}-uncertain-1`,
      );
      expect(stored.run.healthState).toBe("UNKNOWN");
      expect(
        stored.contours.find(
          (item) => item.contourKey === "C13_BLOCKING_STATE",
        ),
      ).toMatchObject({
        environmentStatus: "UNCERTAIN",
        uncertaintyReason: "LOGIN_EXPIRED",
      });
      expect(JSON.stringify(stored.contours)).not.toMatch(
        /TOXIC_PROMPT|TOXIC_RESPONSE|TOXIC_DOM|TOXIC_HTML|TOXIC_COOKIE|TOXIC_TOKEN|TOXIC_STORAGE/i,
      );
    },
  );

  it("does not duplicate a durable Work PASS on application retry", async () => {
    const suite = suiteFor("work");
    const command = createH3HealthPersistenceCommand(
      execution("CHATGPT_WORK", "PASS", PASS_EVENTS, null, null, null),
      context(suite, "b5-work-idempotent-pass"),
    );
    const first = await repository.persistCompletedHealthRun(command);
    const second = await repository.persistCompletedHealthRun(command);
    expect(second).toEqual(first);
    const count = await runtime.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM health_runs WHERE id=$1",
      [first.id],
    );
    expect(count.rows[0]?.count).toBe("1");
  });
});
