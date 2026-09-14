import type { Locator, Page } from "playwright";
import { type EnvironmentUncertaintyReason } from "@product/health";
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
import {
  CHATGPT_STANDARD_H3_PROFILE,
  chatGPTConversationIdentity,
  standardAssistantMessages,
  standardCodeSurfaces,
  standardComposerRoots,
  standardCopyControls,
  standardInputIsInsideAssistantEditor,
  standardPromptInputs,
  standardSendControls,
  standardStopControls,
  standardSurfaceRoot,
  standardMessageId,
} from "./standard-h3-profile.js";

const STANDARD_PROFILE: H3SurfaceProfile = Object.freeze({
  surface: CHATGPT_STANDARD_H3_PROFILE.surface,
  profileId: CHATGPT_STANDARD_H3_PROFILE.profileId,
  profileRevision: CHATGPT_STANDARD_H3_PROFILE.profileRevision,
});
const STANDARD_TARGET = getPackagedH3Target("CHATGPT_STANDARD");
const HEALTH_TOKEN = "BRIDGE_HEALTHCHECK_V1";
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

function safeTurnId(value: string | null): string | null {
  return value !== null && /^[A-Za-z][A-Za-z0-9_-]{0,127}$/.test(value)
    ? value
    : null;
}

function isExpectedChecks(checks: readonly H3BridgeSurfaceCheck[]): boolean {
  return (
    checks.length === EXPECTED_CHECKS.length &&
    checks.every((check, index) => check === EXPECTED_CHECKS[index])
  );
}

function controlToken(locator: Locator): Promise<string> {
  return Promise.all([
    locator.getAttribute("data-testid"),
    locator.getAttribute("aria-label"),
    locator.getAttribute("title"),
    locator.getAttribute("name"),
    locator.getAttribute("type"),
  ]).then((values) =>
    values
      .map((value) => value ?? "")
      .join(" ")
      .toLowerCase(),
  );
}

async function isDisabled(locator: Locator): Promise<boolean> {
  const [enabled, ariaDisabled] = await Promise.all([
    locator.isEnabled({ timeout: 1_000 }).catch(() => false),
    locator.getAttribute("aria-disabled"),
  ]);
  return !enabled || ariaDisabled === "true";
}

/** The only Standard H3 strategy, built from the immutable local profile. */
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
  #surface: Locator | undefined;
  #composer: Locator | undefined;
  #input: Locator | undefined;
  #assistantMessages: Locator | undefined;
  #associatedResponse: Locator | undefined;
  #conversationId: string | undefined;
  #baselineMessageIds = new Set<string>();
  #baselineMessageCount = 0;
  #promptInserted = false;
  #sendInvoked = false;
  #busyObserved = false;

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
      try {
        new URL(page.url());
      } catch {
        return uncertain("NETWORK_FAILURE_BEFORE_PAGE_IDENTITY");
      }
      const surface = standardSurfaceRoot(page);
      if (
        (await surface.count()) !== 1 ||
        !(await surface.isVisible({ timeout: 1_000 }))
      ) {
        return fail(await surface.count());
      }
      const conversationId = await this.#resolveConversationId(page);
      if (!conversationId) return fail();
      this.#surface = surface;
      this.#conversationId = conversationId;
      this.#assistantMessages = standardAssistantMessages(surface);
      this.#baselineMessageCount = await this.#assistantMessages.count();
      if (this.#baselineMessageCount > 64)
        return fail(this.#baselineMessageCount);
      for (let index = 0; index < this.#baselineMessageCount; index += 1) {
        const id = safeTurnId(
          await standardMessageId(this.#assistantMessages.nth(index)),
        );
        if (!id) return fail(this.#baselineMessageCount);
        this.#baselineMessageIds.add(id);
      }
      return pass(2, false);
    });
  }

  public async identifyApprovedComposer(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const surface = this.#surface;
      if (!surface || !this.#conversationId) return fail();
      const composers = standardComposerRoots(surface);
      if ((await composers.count()) !== 1) return fail(await composers.count());
      const composer = composers.first();
      if (!(await composer.isVisible({ timeout: 1_000 }))) return fail();
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
      if (!input || !H3PromptIdSchema.safeParse(promptId).success)
        return fail();
      const prompt = getPackagedH3Prompt(promptId);
      await input.fill(prompt);
      // Ephemeral boolean readback only; prompt content never enters a result.
      const inserted = (await this.#readInput(input)) === prompt;
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
      const exact = standardSendControls(composer);
      const exactCount = await exact.count();
      if (exactCount > 1) return fail(exactCount);
      let send: Locator | null = exactCount === 1 ? exact.first() : null;
      if (!send) send = await this.#resolveSemanticSend(composer);
      if (
        !send ||
        !(await send.isVisible({ timeout: 1_000 })) ||
        (await isDisabled(send))
      ) {
        return fail();
      }
      this.#sendInvoked = true;
      // Sole irreversible activation. No Enter fallback, candidate retry, or resend.
      await send.click();
      return pass(1, true);
    });
  }

  public async observeBusy(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      if (!this.#sendInvoked || !this.#surface) return fail();
      const stop = standardStopControls(this.#surface);
      try {
        await stop.first().waitFor({ state: "visible", timeout: 30_000 });
        this.#busyObserved = true;
        return pass(1, true);
      } catch {
        // A very fast response can remove Stop before it is sampled.
        const messages = this.#assistantMessages;
        if (messages && (await messages.count()) > this.#baselineMessageCount) {
          this.#busyObserved = true;
          return pass(1, true);
        }
        return fail();
      }
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
        const id = safeTurnId(await standardMessageId(candidate));
        if (!id || this.#baselineMessageIds.has(id)) continue;
        if (!(await this.#belongsToConversation(candidate, conversationId)))
          continue;
        this.#associatedResponse = candidate;
        return pass(1, true);
      }
      return fail(boundedCount(count));
    });
  }

  public async observeCompletion(): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const response = this.#associatedResponse;
      if (!response || !this.#surface) return fail();
      const stop = standardStopControls(this.#surface);
      try {
        await response.waitFor({ state: "visible", timeout: 30_000 });
        await response
          .locator('[aria-busy="true"]')
          .waitFor({ state: "detached", timeout: 30_000 })
          .catch(() => undefined);
        await stop
          .first()
          .waitFor({ state: "hidden", timeout: 30_000 })
          .catch(() => undefined);
      } catch {
        return fail();
      }
      return this.#busyObserved ? pass(1, true) : fail();
    });
  }

  public async validateBridgeSurfaces(
    checks: readonly H3BridgeSurfaceCheck[],
  ): Promise<H3StrategyStepResult> {
    return this.#safe(async () => {
      const response = this.#associatedResponse;
      const composer = this.#composer;
      const page = this.#page;
      const target = this.#target;
      const conversationId = this.#conversationId;
      if (
        !response ||
        !composer ||
        !page ||
        !target ||
        !conversationId ||
        !isExpectedChecks(checks) ||
        !this.#isAllowedOrigin(page, target)
      )
        return fail();
      const codeSurface = await this.#findCodeSurfaceWithCopy(
        standardCodeSurfaces(response),
      );
      if (!codeSurface) return fail();
      if (
        (await codeSurface.getByText(HEALTH_TOKEN, { exact: true }).count()) !==
        1
      )
        return fail();
      const copy = standardCopyControls(codeSurface);
      if (
        (await copy.count()) !== 1 ||
        !(await copy.isVisible({ timeout: 1_000 })) ||
        (await isDisabled(copy.first()))
      ) {
        return fail();
      }
      if (!(await this.#belongsToConversation(response, conversationId)))
        return fail();

      // C12 is the same form-owned insertion path used by the accepted
      // adapter: the active editor and Send control share one live form.
      const input = this.#input;
      const send = standardSendControls(composer);
      if (
        !input ||
        (await send.count()) !== 1 ||
        !(await composer.isVisible({ timeout: 1_000 }))
      )
        return fail();
      if (!(await input.isEditable({ timeout: 1_000 }))) return fail();
      return pass(4, true);
    });
  }

  public async cleanup(): Promise<void> {
    const closeSession = this.#closeSession;
    this.#page = undefined;
    this.#target = undefined;
    this.#closeSession = undefined;
    this.#surface = undefined;
    this.#composer = undefined;
    this.#input = undefined;
    this.#assistantMessages = undefined;
    this.#associatedResponse = undefined;
    this.#conversationId = undefined;
    this.#baselineMessageIds.clear();
    this.#baselineMessageCount = 0;
    this.#promptInserted = false;
    this.#sendInvoked = false;
    this.#busyObserved = false;
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
    let pathname = "";
    try {
      pathname = new URL(page.url()).pathname.toLowerCase();
    } catch {
      return uncertain("NETWORK_FAILURE_BEFORE_PAGE_IDENTITY");
    }
    // Login route is the only provider-specific precondition established by
    // the accepted adapter. Accessible checkpoints are fail-closed and never
    // bypassed or acted on.
    if (/^\/auth\/login(?:\/|$)/.test(pathname))
      return uncertain("LOGIN_EXPIRED");
    const checkpoint = page.getByRole("dialog");
    if (
      (await checkpoint.count()) > 0 &&
      (await checkpoint.first().isVisible({ timeout: 1_000 }))
    ) {
      const label = (
        (await checkpoint.first().getAttribute("aria-label")) ?? ""
      ).toLowerCase();
      if (!label) return null;
      if (label.includes("captcha"))
        return uncertain("CAPTCHA_SECURITY_CHECKPOINT");
      if (label.includes("blocked") || label.includes("suspend"))
        return uncertain("ACCOUNT_BLOCKED");
      return uncertain("VERIFICATION_CHECKPOINT");
    }
    return null;
  }

  async #resolveConversationId(page: Page): Promise<string | null> {
    const canonicalHref = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href")
      .catch(() => null);
    return chatGPTConversationIdentity(page.url(), canonicalHref);
  }

  async #resolveEditableInput(composer: Locator): Promise<Locator | null> {
    const inputs = standardPromptInputs(composer);
    const candidates: Locator[] = [];
    for (let index = 0; index < (await inputs.count()); index += 1) {
      const input = inputs.nth(index);
      if (!(await standardInputIsInsideAssistantEditor(input)))
        candidates.push(input);
    }
    return candidates.length === 1 ? (candidates[0] ?? null) : null;
  }

  async #resolveSemanticSend(composer: Locator): Promise<Locator | null> {
    const controls = composer.locator(
      'button, [role="button"], input[type="submit"]',
    );
    const candidates: Locator[] = [];
    for (let index = 0; index < (await controls.count()); index += 1) {
      const control = controls.nth(index);
      if (
        !(await control.isVisible({ timeout: 1_000 }).catch(() => false)) ||
        (await isDisabled(control))
      )
        continue;
      const token = await controlToken(control);
      if (/stop|cancel|abort|останов|отмен/.test(token)) continue;
      if (/\bsend\b|отправ/u.test(token) || /submit/i.test(token))
        candidates.push(control);
    }
    return candidates.length === 1 ? (candidates[0] ?? null) : null;
  }

  async #findCodeSurfaceWithCopy(surfaces: Locator): Promise<Locator | null> {
    const response = this.#associatedResponse;
    if (!response) return null;
    const copies = standardCopyControls(response);
    for (
      let copyIndex = 0;
      copyIndex < (await copies.count());
      copyIndex += 1
    ) {
      const ancestors = copies.nth(copyIndex).locator("xpath=ancestor::*");
      for (
        let ancestorIndex = 0;
        ancestorIndex < (await ancestors.count());
        ancestorIndex += 1
      ) {
        const ancestor = ancestors.nth(ancestorIndex);
        if (!(await ancestor.isVisible({ timeout: 1_000 }).catch(() => false)))
          continue;
        if (
          (await standardCopyControls(ancestor).count()) === 1 &&
          (await standardCodeSurfaces(ancestor).count()) >= 1
        ) {
          return ancestor;
        }
      }
    }
    for (let index = 0; index < (await surfaces.count()); index += 1) {
      const surface = surfaces.nth(index);
      if (!(await surface.isVisible({ timeout: 1_000 }).catch(() => false)))
        continue;
      if (
        (await standardCopyControls(surface).count()) === 1 &&
        (await surface.locator("code").count()) >= 1
      )
        return surface;
    }
    return null;
  }

  async #readInput(input: Locator): Promise<string> {
    try {
      return await input.inputValue();
    } catch {
      return (await input.textContent()) ?? "";
    }
  }

  async #belongsToConversation(
    locator: Locator,
    conversationId: string,
  ): Promise<boolean> {
    const page = this.#page;
    if (!page || (await this.#resolveConversationId(page)) !== conversationId)
      return false;
    return (await standardMessageId(locator)) !== null;
  }

  #isAllowedOrigin(page: Page, target: ControlledTarget): boolean {
    try {
      return target.allowedTopLevelOrigins.includes(new URL(page.url()).origin);
    } catch {
      return false;
    }
  }
}
