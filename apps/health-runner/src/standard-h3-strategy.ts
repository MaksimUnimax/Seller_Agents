import type { Locator, Page } from "playwright";
import {
  EnvironmentUncertaintyReasonSchema,
  type EnvironmentUncertaintyReason,
} from "@product/health";
import {
  H3SurfaceProfileSchema,
  type H3BridgeSurfaceCheck,
  type H3SurfaceProfile,
} from "./h3-actions.js";
import {
  getPackagedH3Prompt,
  H3PromptIdSchema,
  type H3PromptId,
} from "./h3-contracts.js";
import { getPackagedH3Target } from "./h3-engine.js";
import {
  H3StrategyStepResultSchema,
  type H3StrategyStepResult,
  type H3SurfaceStrategy,
} from "./h3-strategy.js";
import type {
  ControlledTarget,
  ControlledTargetKey,
} from "./target-registry.js";

const STANDARD_PROFILE: H3SurfaceProfile = Object.freeze({
  surface: "CHATGPT_STANDARD",
  profileId: "CHATGPT_STANDARD_H3_V1",
  profileRevision: 1,
});
const STANDARD_TARGET = getPackagedH3Target("CHATGPT_STANDARD");
const HEALTH_TOKEN = "BRIDGE_HEALTHCHECK_V1";
const BLOCKING_MARKER = "hf-blocking";
const SESSION_PRECONDITION_MARKER = "hf-session-precondition";
const EXPECTED_CHECKS: readonly H3BridgeSurfaceCheck[] = Object.freeze([
  "COMMAND_CODE_BLOCK_SURFACE",
  "NATIVE_COPY_CONTROL",
  "CONVERSATION_IDENTITY",
  "DELIVERY_INSERTION_PATH",
]);

const pass = (
  markerCount: number,
  transitionObserved: boolean,
): H3StrategyStepResult =>
  H3StrategyStepResultSchema.parse({
    outcome: "PASS",
    markerCount: Math.min(64, Math.max(0, markerCount)),
    transitionObserved,
    uncertaintyReason: null,
  });

const fail = (markerCount = 0): H3StrategyStepResult =>
  H3StrategyStepResultSchema.parse({
    outcome: "FAIL",
    markerCount: Math.min(64, Math.max(0, markerCount)),
    transitionObserved: false,
    uncertaintyReason: null,
  });

const uncertain = (
  reason: EnvironmentUncertaintyReason,
): H3StrategyStepResult =>
  H3StrategyStepResultSchema.parse({
    outcome: "UNCERTAIN",
    markerCount: null,
    transitionObserved: null,
    uncertaintyReason: reason,
  });

function boundedCount(count: number): number {
  return Math.min(64, Math.max(0, count));
}

function safeIdentity(value: string | null): string | null {
  return value !== null && /^[a-z][a-z0-9_-]{0,63}$/.test(value) ? value : null;
}

function isExpectedChecks(checks: readonly H3BridgeSurfaceCheck[]): boolean {
  return (
    checks.length === EXPECTED_CHECKS.length &&
    checks.every((check, index) => check === EXPECTED_CHECKS[index])
  );
}

/**
 * The only Playwright-aware H3 implementation currently packaged. It is
 * constructed by ChromeBrowserDriver after target-key navigation; the Page
 * and all locators remain private to this module and never cross the H3
 * strategy boundary.
 */
export function createChatGPTStandardH3Strategy(
  page: Page,
  target: ControlledTarget,
  closeSession: () => Promise<void>,
): H3SurfaceStrategy {
  if (target.key !== STANDARD_TARGET) {
    throw new Error("CHATGPT_STANDARD_TARGET_REQUIRED");
  }
  H3SurfaceProfileSchema.parse(STANDARD_PROFILE);
  return new ChatGPTStandardH3Strategy(page, target, closeSession);
}

class ChatGPTStandardH3Strategy implements H3SurfaceStrategy {
  public readonly surfaceProfile = STANDARD_PROFILE;
  public readonly targetKey: ControlledTargetKey = STANDARD_TARGET;
  #page: Page | undefined;
  #target: ControlledTarget | undefined;
  #closeSession: (() => Promise<void>) | undefined;
  #conversation: Locator | undefined;
  #composer: Locator | undefined;
  #input: Locator | undefined;
  #assistantMessages: Locator | undefined;
  #generationState: Locator | undefined;
  #associatedResponse: Locator | undefined;
  #conversationId: string | undefined;
  #baselineMessageIds = new Set<string>();
  #baselineMessageCount = 0;
  #promptInserted = false;
  #sendInvoked = false;

  public constructor(
    page: Page,
    target: ControlledTarget,
    closeSession: () => Promise<void>,
  ) {
    this.#page = page;
    this.#target = target;
    this.#closeSession = closeSession;
  }

  public async identifyApprovedSurface(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const blocker = await this.#environmentBlocker();
      if (blocker) return blocker;
      const page = this.#page;
      const target = this.#target;
      if (!page || !target || !this.#isAllowedOrigin(page, target))
        return fail();

      const host = page.getByTestId("hf-page-host");
      const surface = page.getByTestId("hf-surface");
      const hostCount = await host.count();
      const surfaceCount = await surface.count();
      if (hostCount !== 1 || surfaceCount !== 1) return fail(surfaceCount);
      if (
        !(await host.isVisible({ timeout: 1_000 })) ||
        !(await surface.isVisible({ timeout: 1_000 })) ||
        (await surface.getAttribute("data-hf-kind")) !== "chatgpt-standard"
      ) {
        return fail(surfaceCount);
      }

      const conversation = page.getByTestId("hf-conversation-root");
      const activeConversation = page.getByTestId("hf-active-conversation");
      if (
        (await conversation.count()) !== 1 ||
        (await activeConversation.count()) !== 1
      ) {
        return fail();
      }
      const conversationId = safeIdentity(
        await conversation.getAttribute("data-hf-conversation-id"),
      );
      if (
        !conversationId ||
        (await activeConversation.getAttribute("data-hf-conversation-id")) !==
          conversationId
      ) {
        return fail();
      }

      this.#conversation = conversation;
      this.#conversationId = conversationId;
      const generationState = conversation.getByTestId("hf-response-state");
      if ((await generationState.count()) !== 1) return fail();
      this.#generationState = generationState.first();
      this.#assistantMessages = conversation.getByTestId(
        "hf-assistant-message",
      );
      this.#baselineMessageCount = await this.#assistantMessages.count();
      if (this.#baselineMessageCount > 64)
        return fail(this.#baselineMessageCount);
      for (let index = 0; index < this.#baselineMessageCount; index += 1) {
        const messageId = safeIdentity(
          await this.#assistantMessages
            .nth(index)
            .getAttribute("data-hf-message-id"),
        );
        if (!messageId) return fail(this.#baselineMessageCount);
        this.#baselineMessageIds.add(messageId);
      }
      return pass(2, false);
    });
  }

  public async identifyApprovedComposer(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const conversation = this.#conversation;
      const conversationId = this.#conversationId;
      if (!conversation || !conversationId) return fail();
      const composers = conversation.getByTestId("hf-composer-root");
      if ((await composers.count()) !== 1) return fail(await composers.count());
      const composer = composers.first();
      if (
        !(await composer.isVisible({ timeout: 1_000 })) ||
        (await composer.getAttribute("data-hf-active")) !== "true" ||
        (await composer.getAttribute("data-hf-variant")) !==
          "standard_composer_v1" ||
        (await composer.getAttribute("data-hf-conversation-id")) !==
          conversationId
      ) {
        return fail();
      }
      const input = await this.#resolveEditableInput(composer);
      if (
        !input ||
        !(await input.isVisible({ timeout: 1_000 })) ||
        !(await input.isEditable({ timeout: 1_000 }))
      ) {
        return fail();
      }
      this.#composer = composer;
      this.#input = input;
      return pass(1, false);
    });
  }

  public async insertPackagedPrompt(
    promptId: H3PromptId,
  ): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const input = this.#input;
      if (!input || H3PromptIdSchema.safeParse(promptId).success === false) {
        return fail();
      }
      const prompt = getPackagedH3Prompt(promptId);
      await input.fill(prompt);
      // Readback is an ephemeral boolean proof. The prompt is never returned,
      // logged, retained in state, or included in the H3 result.
      const inserted = (await input.inputValue()) === prompt;
      this.#promptInserted = inserted;
      return inserted ? pass(1, true) : fail();
    });
  }

  public async sendOnce(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const composer = this.#composer;
      if (
        !composer ||
        !this.#input ||
        !this.#promptInserted ||
        this.#sendInvoked
      ) {
        return fail();
      }
      const candidates = composer.getByTestId("hf-send-control");
      if ((await candidates.count()) !== 1)
        return fail(await candidates.count());
      const send = candidates.first();
      if (
        !(await send.isVisible({ timeout: 1_000 })) ||
        !(await send.isEnabled({ timeout: 1_000 })) ||
        (await send.getAttribute("data-hf-state")) !== "send" ||
        (await send.getAttribute("data-hf-actionable")) !== "true"
      ) {
        return fail();
      }
      this.#sendInvoked = true;
      // This is the sole physical irreversible activation. There is no retry,
      // alternate candidate, Enter fallback, or second attempt on failure.
      await send.click();
      return pass(1, true);
    });
  }

  public async observeBusy(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      if (!this.#sendInvoked || !this.#conversation || !this.#generationState)
        return fail();
      const state = this.#generationState;
      const generationSeen =
        (await state.getAttribute("data-hf-generation-seen")) === "true";
      if (generationSeen) return pass(1, true);
      const stop = this.#conversation.getByTestId("hf-stop-control");
      try {
        await stop.waitFor({ state: "visible", timeout: 30_000 });
      } catch {
        return fail();
      }
      return (await state.getAttribute("data-hf-generation-seen")) === "true"
        ? pass(1, true)
        : fail();
    });
  }

  public async observeResponse(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const messages = this.#assistantMessages;
      const conversationId = this.#conversationId;
      if (!this.#sendInvoked || !messages || !conversationId) return fail();
      try {
        await messages.nth(this.#baselineMessageCount).waitFor({
          state: "attached",
          timeout: 30_000,
        });
      } catch {
        return fail();
      }
      const count = await messages.count();
      for (let index = this.#baselineMessageCount; index < count; index += 1) {
        const candidate = messages.nth(index);
        const messageId = safeIdentity(
          await candidate.getAttribute("data-hf-message-id"),
        );
        const candidateConversation = await candidate.getAttribute(
          "data-hf-conversation-id",
        );
        if (
          messageId &&
          !this.#baselineMessageIds.has(messageId) &&
          candidateConversation === conversationId
        ) {
          this.#associatedResponse = candidate;
          return pass(1, true);
        }
      }
      return fail(boundedCount(count));
    });
  }

  public async observeCompletion(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const response = this.#associatedResponse;
      if (!response) return fail();
      try {
        const completion = response.getByTestId("hf-completion");
        const idle = response.getByTestId("hf-response-idle");
        await completion.waitFor({
          state: "visible",
          timeout: 30_000,
        });
        await idle.waitFor({
          state: "visible",
          timeout: 30_000,
        });
      } catch {
        return fail();
      }
      return (await response
        .getByTestId("hf-response-state")
        .getAttribute("data-hf-state")) === "idle"
        ? pass(1, true)
        : fail();
    });
  }

  public async validateBridgeSurfaces(
    checks: readonly H3BridgeSurfaceCheck[],
  ): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const response = this.#associatedResponse;
      const conversation = this.#conversation;
      const composer = this.#composer;
      const conversationId = this.#conversationId;
      const page = this.#page;
      const target = this.#target;
      if (
        !response ||
        !conversation ||
        !composer ||
        !conversationId ||
        !page ||
        !target ||
        !isExpectedChecks(checks) ||
        !this.#isAllowedOrigin(page, target)
      ) {
        return fail();
      }

      const commandSurface = response.getByTestId("hf-command-surface");
      const codeBlocks = commandSurface.getByTestId("hf-code-block");
      if (
        (await commandSurface.count()) !== 1 ||
        !(await commandSurface.isVisible({ timeout: 1_000 })) ||
        (await commandSurface.getAttribute("data-hf-shape")) !==
          "fenced-code-block" ||
        (await codeBlocks.count()) !== 1 ||
        !(await codeBlocks.isVisible({ timeout: 1_000 })) ||
        (await codeBlocks.getAttribute("data-hf-fence")) !== "true"
      ) {
        return fail();
      }
      const code = codeBlocks.locator("code");
      if (
        (await code.count()) !== 1 ||
        (await code.getByText(HEALTH_TOKEN, { exact: true }).count()) !== 1
      ) {
        return fail();
      }

      const codeId = safeIdentity(
        await codeBlocks.getAttribute("data-hf-code-id"),
      );
      const copy = response.getByTestId("hf-native-copy");
      if (
        !codeId ||
        (await copy.count()) !== 1 ||
        !(await copy.isVisible({ timeout: 1_000 })) ||
        (await copy.getAttribute("data-hf-copy-for")) !== codeId ||
        (await copy.getAttribute("data-hf-actionable")) !== "true"
      ) {
        return fail();
      }

      const conversationUrlIdentity = page.getByTestId(
        "hf-conversation-url-id",
      );
      if (
        (await conversationUrlIdentity.count()) !== 1 ||
        (await conversationUrlIdentity.getAttribute(
          "data-hf-conversation-id",
        )) !== conversationId ||
        (await response.getAttribute("data-hf-conversation-id")) !==
          conversationId
      ) {
        return fail();
      }

      const delivery = composer.getByTestId("hf-delivery-target");
      if (
        (await delivery.count()) !== 1 ||
        !(await delivery.isVisible({ timeout: 1_000 })) ||
        (await delivery.getAttribute("data-hf-owner-conversation-id")) !==
          conversationId ||
        (await delivery.getAttribute("data-hf-mode")) !== "health-safe"
      ) {
        return fail();
      }
      return pass(4, true);
    });
  }

  public async cleanup(): Promise<void> {
    const closeSession = this.#closeSession;
    this.#page = undefined;
    this.#target = undefined;
    this.#closeSession = undefined;
    this.#conversation = undefined;
    this.#composer = undefined;
    this.#input = undefined;
    this.#assistantMessages = undefined;
    this.#generationState = undefined;
    this.#associatedResponse = undefined;
    this.#conversationId = undefined;
    this.#baselineMessageIds.clear();
    this.#baselineMessageCount = 0;
    this.#promptInserted = false;
    this.#sendInvoked = false;
    await closeSession?.();
  }

  async #safe(
    operation: () => Promise<H3StrategyStepResult>,
  ): Promise<H3StrategyStepResult> {
    try {
      return await operation();
    } catch {
      return fail();
    }
  }

  async #environmentBlocker(): Promise<H3StrategyStepResult | null> {
    const page = this.#page;
    if (!page) return uncertain("CONTROLLED_BROWSER_UNAVAILABLE");
    for (const markerId of [BLOCKING_MARKER, SESSION_PRECONDITION_MARKER]) {
      const marker = page.getByTestId(markerId);
      const count = await marker.count();
      if (count === 0) continue;
      if (count !== 1 || !(await marker.isVisible({ timeout: 1_000 })))
        return fail(count);
      const reason = EnvironmentUncertaintyReasonSchema.safeParse(
        await marker.getAttribute("data-hf-state"),
      );
      return reason.success
        ? uncertain(reason.data)
        : uncertain("VERIFICATION_CHECKPOINT");
    }
    return null;
  }

  async #resolveEditableInput(composer: Locator): Promise<Locator | null> {
    const primary = composer.getByTestId("hf-editable-input");
    if ((await primary.count()) > 1) return null;
    if ((await primary.count()) === 1) return primary.first();
    const fallback = composer.getByRole("textbox", {
      name: "ChatGPT prompt",
      exact: true,
    });
    if ((await fallback.count()) !== 1) return null;
    return fallback.first();
  }

  #isAllowedOrigin(page: Page, target: ControlledTarget): boolean {
    try {
      return target.allowedTopLevelOrigins.includes(new URL(page.url()).origin);
    } catch {
      return false;
    }
  }
}
