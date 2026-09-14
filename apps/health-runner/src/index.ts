import type { BrowserFamily } from "@product/shared";
import type { BrowserDriver } from "./browser-driver.js";

export type { BrowserFamily } from "@product/shared";
export type {
  BrowserDriver,
  BrowserDriverErrorCode,
  BrowserDriverSecurityDiagnostics,
  ControlledNavigationResult,
} from "./browser-driver.js";
export { BrowserDriverError, ChromeBrowserDriver } from "./browser-driver.js";
export {
  ControlledTargetRegistry,
  ControlledTargetKeySchema,
  createControlledTargetRegistry,
} from "./target-registry.js";
export type { ControlledTarget } from "./target-registry.js";
export {
  BrowserRuntimeMetadataSchema,
  H2ExecutionErrorSchema,
  H2StructuralProbePlanSchema,
  H2StructuralObservationSchema,
  H2StructuralSmokeReportSchema,
  createH2ProbePlan,
  parseH2ProbePlan,
  runH2StructuralSmoke,
} from "./h2.js";
export type {
  BrowserRuntimeMetadata,
  H2ExecutionError,
  H2ProbeContour,
  H2StructuralObservation,
  H2StructuralProbePlan,
  H2StructuralSmokeReport,
} from "./h2.js";
export {
  H3SurfaceSchema,
  H3PromptIdSchema,
  H3BehaviorStepSchema,
  H3RunPlanSchema,
  H3_BEHAVIOR_STEP_ORDER,
  createH3RunPlan,
  getPackagedH3Prompt,
  parseH3RunPlan,
} from "./h3-contracts.js";
export type {
  H3Surface,
  H3PromptId,
  H3BehaviorStep,
  H3RunPlan,
} from "./h3-contracts.js";
export {
  H3PackagedActionSchema,
  H3_PACKAGED_ACTION_KIND_ORDER,
  compileH3PackagedActions,
  getPackagedH3Profile,
  parseH3PackagedAction,
} from "./h3-actions.js";
export type {
  H3PackagedAction,
  H3PackagedActionSequence,
  H3SurfaceProfile,
} from "./h3-actions.js";
export {
  H3EvidenceOutcomeSchema,
  H3SafeEvidenceEventSchema,
  H3SafeEvidenceBundleSchema,
  sanitizeH3EvidenceEvent,
  sanitizeH3EvidenceBundle,
} from "./evidence-sanitizer.js";
export type {
  H3EvidenceOutcome,
  H3SafeEvidenceEvent,
  H3SafeEvidenceBundle,
} from "./evidence-sanitizer.js";
export type {
  SafeStructuralMetadata,
  SafeStructuralObservation,
} from "./strategies.js";

export class NoopBrowserDriver implements BrowserDriver {
  public readonly sessionKind = "EPHEMERAL_CONTROLLED" as const;
  public constructor(public readonly family: BrowserFamily) {}
  public async prepareSession(): Promise<void> {}
  public async launch(): Promise<void> {}
  public async start(): Promise<void> {}
  public async open(): Promise<never> {
    throw new Error("NOOP_BROWSER_DRIVER_CANNOT_OPEN");
  }
  public getRuntimeMetadata() {
    return {
      family: this.family,
      browserName: "noop",
      browserVersion: "noop",
      headless: true,
      sessionKind: "EPHEMERAL_CONTROLLED" as const,
    };
  }
  public getSecurityDiagnostics() {
    return {
      secondaryPageCount: 0,
      unsafeTopLevelNavigation: false,
    } as const;
  }
  public async observeStrategy(): Promise<never> {
    throw new Error("NOOP_BROWSER_DRIVER_CANNOT_OBSERVE");
  }
  public async closeOrPersist(): Promise<void> {}
  public async stop(): Promise<void> {}
}
