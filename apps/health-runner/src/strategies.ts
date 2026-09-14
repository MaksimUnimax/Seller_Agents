import type { Page } from "playwright";
import {
  EnvironmentUncertaintyReasonSchema,
  PackagedStrategyIdSchema,
  type EnvironmentUncertaintyReason,
  type PackagedStrategyId,
} from "@product/health";

export type SafeStructuralMetadata = Readonly<{
  elementCount: number;
  tag: string | null;
  role: string | null;
  type: string | null;
  ariaLabelPresent: boolean;
  stableDataKind: string | null;
  visible: boolean;
  editable: boolean;
  actionable: boolean;
  relationship: "BOUNDED_PACKAGED_TARGET";
  blockingState: EnvironmentUncertaintyReason | null;
}>;

export type SafeStructuralObservation = Readonly<{
  outcome: "PASS" | "FAIL" | "UNCERTAIN";
  metadata: SafeStructuralMetadata;
  uncertaintyReason: EnvironmentUncertaintyReason | null;
}>;

type StrategyDefinition = Readonly<{
  marker: string;
  kind: "TEST_ID" | "ROLE";
  role?: "button" | "textbox";
  name?: string;
  requiresEditable?: boolean;
  requiresActionable?: boolean;
  absenceMeansHealthy?: boolean;
}>;

const STRATEGIES: Readonly<Record<PackagedStrategyId, StrategyDefinition>> = {
  PAGE_HOST_MARKER: { marker: "page-host", kind: "TEST_ID" },
  SURFACE_MARKER: { marker: "surface", kind: "TEST_ID" },
  CONVERSATION_ANCHOR: { marker: "conversation-root", kind: "TEST_ID" },
  ACTIVE_CONVERSATION_REGION: {
    marker: "active-conversation",
    kind: "TEST_ID",
  },
  COMPOSER_CONTAINER: { marker: "composer-root", kind: "TEST_ID" },
  ACTIVE_COMPOSER_REGION: { marker: "active-composer", kind: "TEST_ID" },
  EDITABLE_INPUT: {
    marker: "editable-input",
    kind: "TEST_ID",
    requiresEditable: true,
  },
  ACCESSIBILITY_TEXTBOX: {
    marker: "fixture-editor",
    kind: "ROLE",
    role: "textbox",
    name: "fixture-editor",
    requiresEditable: true,
  },
  SEMANTIC_SEND_CONTROL: {
    marker: "send-control",
    kind: "ROLE",
    role: "button",
    name: "fixture-send",
    requiresActionable: true,
  },
  COMPOSER_ACTION_CONTROL: {
    marker: "composer-action",
    kind: "TEST_ID",
    requiresActionable: true,
  },
  BUSY_INDICATOR: { marker: "busy-indicator", kind: "TEST_ID" },
  RESPONSE_STATE_MARKER: { marker: "response-state", kind: "TEST_ID" },
  ASSISTANT_MESSAGE_REGION: {
    marker: "assistant-message",
    kind: "TEST_ID",
  },
  MESSAGE_ASSOCIATION_MARKER: {
    marker: "message-association",
    kind: "TEST_ID",
  },
  COMPLETION_MARKER: { marker: "completion", kind: "TEST_ID" },
  RESPONSE_IDLE_STATE: { marker: "response-idle", kind: "TEST_ID" },
  COMMAND_SURFACE: { marker: "command-surface", kind: "TEST_ID" },
  CODE_BLOCK_DISCOVERY: { marker: "code-block", kind: "TEST_ID" },
  NATIVE_COPY_CONTROL: { marker: "native-copy", kind: "TEST_ID" },
  COPY_ANCHOR_ASSOCIATION: { marker: "copy-anchor", kind: "TEST_ID" },
  CONVERSATION_IDENTIFIER: {
    marker: "conversation-id",
    kind: "TEST_ID",
  },
  CONVERSATION_URL_IDENTITY: {
    marker: "conversation-url-id",
    kind: "TEST_ID",
  },
  DELIVERY_TARGET: { marker: "delivery-target", kind: "TEST_ID" },
  BLOCKING_MARKER: {
    marker: "blocking",
    kind: "TEST_ID",
    absenceMeansHealthy: true,
  },
  SESSION_PRECONDITION: {
    marker: "session-precondition",
    kind: "TEST_ID",
    absenceMeansHealthy: true,
  },
};

const SAFE_TOKEN = /^[a-z][a-z0-9_-]{0,63}$/;

function safeToken(value: string | null): string | null {
  return value !== null && SAFE_TOKEN.test(value) ? value : null;
}

function blockingReason(
  value: string | null,
): EnvironmentUncertaintyReason | null {
  const parsed = EnvironmentUncertaintyReasonSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

async function getLocator(page: Page, definition: StrategyDefinition) {
  if (definition.kind === "ROLE") {
    if (!definition.role || !definition.name) {
      throw new Error("INVALID_PACKAGED_STRATEGY");
    }
    return page.getByRole(definition.role, {
      name: definition.name,
      exact: true,
    });
  }
  return page.getByTestId(`hf-${definition.marker}`);
}

async function inspect(
  page: Page,
  definition: StrategyDefinition,
  timeoutMs: number,
): Promise<SafeStructuralObservation> {
  const locator = await getLocator(page, definition);
  const elementCount = await locator.count();
  const boundedCount = Math.min(elementCount, 64);
  if (elementCount === 0 && definition.absenceMeansHealthy) {
    return {
      outcome: "PASS",
      metadata: {
        elementCount: 0,
        tag: null,
        role: null,
        type: null,
        ariaLabelPresent: false,
        stableDataKind: null,
        visible: false,
        editable: false,
        actionable: false,
        relationship: "BOUNDED_PACKAGED_TARGET",
        blockingState: null,
      },
      uncertaintyReason: null,
    };
  }
  if (elementCount === 0) {
    return {
      outcome: "FAIL",
      metadata: {
        elementCount: 0,
        tag: null,
        role: null,
        type: null,
        ariaLabelPresent: false,
        stableDataKind: null,
        visible: false,
        editable: false,
        actionable: false,
        relationship: "BOUNDED_PACKAGED_TARGET",
        blockingState: null,
      },
      uncertaintyReason: null,
    };
  }
  const first = locator.first();
  const [visible, role, type, tag, kind, state, editable, actionable] =
    await Promise.all([
      first.isVisible({ timeout: timeoutMs }),
      first.getAttribute("role", { timeout: timeoutMs }),
      first.getAttribute("type", { timeout: timeoutMs }),
      first.getAttribute("data-hf-tag", { timeout: timeoutMs }),
      first.getAttribute("data-hf-kind", { timeout: timeoutMs }),
      first.getAttribute("data-hf-state", { timeout: timeoutMs }),
      first.getAttribute("data-hf-editable", { timeout: timeoutMs }),
      first.getAttribute("data-hf-actionable", { timeout: timeoutMs }),
    ]);
  const reason = blockingReason(state);
  const safeMetadata: SafeStructuralMetadata = {
    elementCount: boundedCount,
    tag: safeToken(tag),
    role: safeToken(role),
    type: safeToken(type),
    ariaLabelPresent:
      (await first.getAttribute("aria-label", { timeout: timeoutMs })) !== null,
    stableDataKind: safeToken(kind),
    visible,
    editable: editable === "true" || role === "textbox",
    actionable: actionable === "true" || role === "button",
    relationship: "BOUNDED_PACKAGED_TARGET",
    blockingState: reason,
  };
  if (reason) {
    return {
      outcome: "UNCERTAIN",
      metadata: safeMetadata,
      uncertaintyReason: reason,
    };
  }
  const valid =
    elementCount === 1 &&
    visible &&
    (!definition.requiresEditable || safeMetadata.editable) &&
    (!definition.requiresActionable || safeMetadata.actionable);
  return {
    outcome: valid ? "PASS" : "FAIL",
    metadata: safeMetadata,
    uncertaintyReason: null,
  };
}

export async function executePackagedStrategy(
  page: Page,
  strategyId: PackagedStrategyId,
  timeoutMs: number,
): Promise<SafeStructuralObservation> {
  const parsedStrategyId = PackagedStrategyIdSchema.parse(strategyId);
  const definition = STRATEGIES[parsedStrategyId];
  if (!definition) throw new Error("PACKAGED_STRATEGY_NOT_REGISTERED");
  return inspect(page, definition, timeoutMs);
}
