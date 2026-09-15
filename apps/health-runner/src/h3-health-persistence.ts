import { createHash } from "node:crypto";
import {
  BASELINE_HEALTH_SUITE,
  HealthContourResultSchema,
  HealthSuiteDefinitionSchema,
  type HealthContourResult,
  type HealthSuiteDefinition,
} from "@product/health";
import { z } from "zod";
import {
  H3ExecutionResultSchema,
  type H3ExecutionResult,
} from "./h3-engine.js";
import { type H3BehaviorStep } from "./h3-contracts.js";
import { BrowserRuntimeMetadataSchema as RunnerBrowserRuntimeMetadataSchema } from "./h2.js";

const H3HealthIdempotencyKeySchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9._:-]{0,127}$/);
const IsoTimestampSchema = z.string().datetime({ offset: true });

/**
 * This is the only B5 input that may cross from the H3 runner into Health
 * persistence. It is intentionally separate from the browser observation
 * object: only the already-validated H3 result and approved runtime metadata
 * are accepted, and the returned command contains only Health-owned fields.
 */
export const H3HealthPersistenceContextSchema = z
  .object({
    suite: HealthSuiteDefinitionSchema,
    idempotencyKey: H3HealthIdempotencyKeySchema,
    startedAt: IsoTimestampSchema,
    completedAt: IsoTimestampSchema,
    browserRuntime: RunnerBrowserRuntimeMetadataSchema,
    operatorMaintenance: z.boolean().default(false),
    operatorMaintenanceAuthority: z.string().min(1).max(128).nullable(),
    classifierVersion: z.string().min(1).max(64),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.completedAt < value.startedAt) {
      context.addIssue({
        code: "custom",
        path: ["completedAt"],
        message: "completedAt must not precede startedAt",
      });
    }
    if (
      value.browserRuntime.family !== value.suite.scope.browserFamily ||
      value.browserRuntime.browserVersion !== value.suite.scope.browserVersion
    ) {
      context.addIssue({
        code: "custom",
        path: ["browserRuntime"],
        message: "runtime metadata does not match Health scope",
      });
    }
  });
export type H3HealthPersistenceContext = z.input<
  typeof H3HealthPersistenceContextSchema
>;

export const H3HealthPersistenceCommandSchema = z
  .object({
    suite: HealthSuiteDefinitionSchema,
    results: z
      .array(HealthContourResultSchema)
      .length(BASELINE_HEALTH_SUITE.contours.length),
    operatorMaintenance: z.boolean(),
    operatorMaintenanceAuthority: z.string().min(1).max(128).nullable(),
    healthLevel: z.literal("H3"),
    classifierVersion: z.string().min(1).max(64),
    startedAt: z.date(),
    completedAt: z.date(),
    idempotencyKey: H3HealthIdempotencyKeySchema,
  })
  .strict();
export type H3HealthPersistenceCommand = z.infer<
  typeof H3HealthPersistenceCommandSchema
>;

const CONTOUR_STEP: Readonly<
  Record<HealthContourResult["contourKey"], H3BehaviorStep | null>
> = Object.freeze({
  C01_PAGE_IDENTITY: "IDENTIFY_SURFACE",
  C02_CONVERSATION_ROOT: "IDENTIFY_SURFACE",
  C03_COMPOSER_ROOT: "IDENTIFY_COMPOSER",
  C04_COMPOSER_INPUT: "INSERT_PROMPT",
  C05_SEND_CONTROL: "SEND_ONCE",
  C06_BUSY_STOP_STATE: "OBSERVE_BUSY",
  C07_ASSISTANT_MESSAGE: "OBSERVE_RESPONSE",
  C08_MESSAGE_COMPLETION: "OBSERVE_COMPLETION",
  C09_COMMAND_CODE_BLOCK_SURFACE: "VALIDATE_BRIDGE_SURFACES",
  C10_NATIVE_COPY_CONTROL: "VALIDATE_BRIDGE_SURFACES",
  C11_CONVERSATION_IDENTITY: "VALIDATE_BRIDGE_SURFACES",
  C12_DELIVERY_INSERTION_PATH: "VALIDATE_BRIDGE_SURFACES",
  C13_BLOCKING_STATE: null,
});

const EVIDENCE_RULE: Readonly<
  Record<
    HealthContourResult["contourKey"],
    HealthContourResult["evidence"][number]["ruleId"]
  >
> = Object.freeze({
  C01_PAGE_IDENTITY: "SAFE_ELEMENT_METADATA",
  C02_CONVERSATION_ROOT: "SAFE_ELEMENT_METADATA",
  C03_COMPOSER_ROOT: "SAFE_ELEMENT_METADATA",
  C04_COMPOSER_INPUT: "SAFE_ELEMENT_METADATA",
  C05_SEND_CONTROL: "STATE_TRANSITION_TRACE",
  C06_BUSY_STOP_STATE: "STATE_TRANSITION_TRACE",
  C07_ASSISTANT_MESSAGE: "BOUNDED_DOM_FRAGMENT",
  C08_MESSAGE_COMPLETION: "STATE_TRANSITION_TRACE",
  C09_COMMAND_CODE_BLOCK_SURFACE: "BOUNDED_DOM_FRAGMENT",
  C10_NATIVE_COPY_CONTROL: "SAFE_ELEMENT_METADATA",
  C11_CONVERSATION_IDENTITY: "SAFE_ELEMENT_METADATA",
  C12_DELIVERY_INSERTION_PATH: "STATE_TRANSITION_TRACE",
  C13_BLOCKING_STATE: "SAFE_ELEMENT_METADATA",
});

function opaqueEvidenceId(namespace: string, contourKey: string): string {
  const bytes = createHash("sha256")
    .update("p8-health-evidence-reference-v1\0")
    .update(namespace)
    .update("\0")
    .update(contourKey)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function eventOutcome(
  event: H3ExecutionResult["events"][number] | undefined,
): "PASS" | "FAIL" | "UNCERTAIN" {
  if (!event || event.outcome === "NOT_RUN") return "FAIL";
  return event.outcome;
}

function evidenceFor(
  namespace: string,
  contourKey: HealthContourResult["contourKey"],
  classification: "METADATA" | "BOUNDED_FRAGMENT",
  ruleId: HealthContourResult["evidence"][number]["ruleId"],
) {
  return {
    evidenceId: opaqueEvidenceId(namespace, contourKey),
    ruleId,
    classification,
    sha256: null,
    sizeBytes: null,
  } as const;
}

function outcomeForContour(
  execution: H3ExecutionResult,
  contourKey: HealthContourResult["contourKey"],
): H3ExecutionResult["events"][number]["outcome"] | null {
  if (contourKey === "C13_BLOCKING_STATE") {
    return execution.environmentUncertainty === null ? "PASS" : "UNCERTAIN";
  }
  const step = CONTOUR_STEP[contourKey];
  if (!step) return null;
  const event = execution.events.find((candidate) => candidate.step === step);
  return event ? eventOutcome(event) : null;
}

function contourResult(
  execution: H3ExecutionResult,
  contour: HealthSuiteDefinition["contours"][number],
  namespace: string,
): HealthContourResult {
  const outcome = outcomeForContour(execution, contour.key);
  const present = outcome !== null;
  const evidenceRule = EVIDENCE_RULE[contour.key];
  const evidence = present
    ? [
        evidenceFor(
          namespace,
          contour.key,
          evidenceRule === "BOUNDED_DOM_FRAGMENT"
            ? "BOUNDED_FRAGMENT"
            : "METADATA",
          evidenceRule,
        ),
      ]
    : [];
  const environmentUncertainty = execution.environmentUncertainty;
  const parsed = HealthContourResultSchema.parse({
    contourKey: contour.key,
    required: contour.required,
    failureSeverity: contour.failureSeverity,
    observationStatus: present ? "PRESENT" : "NOT_OBSERVED",
    primaryStrategyId: contour.primaryStrategyId,
    primaryStrategyOutcome: present ? outcome : "NOT_ATTEMPTED",
    fallbackStrategyOutcomes: [],
    selectedStrategyId: present ? contour.primaryStrategyId : null,
    structuralOutcome: present
      ? outcome === "PASS"
        ? "PASS"
        : outcome
      : "NOT_RUN",
    behavioralOutcome: present
      ? outcome === "PASS"
        ? "PASS"
        : outcome
      : "NOT_RUN",
    fallbackQuality: "NOT_APPLICABLE",
    environmentStatus: environmentUncertainty === null ? "VALID" : "UNCERTAIN",
    uncertaintyReason: environmentUncertainty,
    evidence,
  });
  return parsed;
}

/**
 * Capture-boundary sanitizer and Health mapper for B5. The source is parsed
 * strictly before any field is selected. No prompt, response, DOM, route,
 * project, conversation, storage, token, or arbitrary error field is read.
 */
export function createH3HealthPersistenceCommand(
  rawExecution: unknown,
  rawContext: H3HealthPersistenceContext,
): H3HealthPersistenceCommand {
  const execution = H3ExecutionResultSchema.parse(rawExecution);
  const context = H3HealthPersistenceContextSchema.parse(rawContext);
  if (
    execution.surfaceProfile.surface === "CHATGPT_STANDARD" &&
    context.suite.scope.surfaceKey !== "standard"
  ) {
    throw new Error("H3_STANDARD_HEALTH_SCOPE_MISMATCH");
  }
  if (
    execution.surfaceProfile.surface === "CHATGPT_WORK" &&
    context.suite.scope.surfaceKey !== "work"
  ) {
    throw new Error("H3_WORK_HEALTH_SCOPE_MISMATCH");
  }
  if (
    execution.surfaceProfile.profileRevision !==
    context.suite.scope.profile.revision
  ) {
    throw new Error("H3_PROFILE_REVISION_SCOPE_MISMATCH");
  }
  const results = context.suite.contours.map((contour) =>
    contourResult(execution, contour, context.idempotencyKey),
  );
  return H3HealthPersistenceCommandSchema.parse({
    suite: context.suite,
    results,
    operatorMaintenance: context.operatorMaintenance,
    operatorMaintenanceAuthority: context.operatorMaintenanceAuthority,
    healthLevel: "H3",
    classifierVersion: context.classifierVersion,
    startedAt: new Date(context.startedAt),
    completedAt: new Date(context.completedAt),
    idempotencyKey: context.idempotencyKey,
  });
}

export type { H3ExecutionResult };
