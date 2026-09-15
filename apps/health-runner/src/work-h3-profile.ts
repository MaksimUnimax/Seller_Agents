import type { Locator, Page } from "playwright";

/**
 * Versioned, code-owned authority for the authenticated ChatGPT Work surface.
 * The route is supporting context only; the header marker is the positive
 * Work identity. Exact Russian strings are intentionally locale-bound to v1.
 */
export const CHATGPT_WORK_H3_PROFILE = Object.freeze({
  surface: "CHATGPT_WORK" as const,
  profileId: "CHATGPT_WORK_H3_V1",
  profileRevision: 1,
  approvedOrigin: "https://chatgpt.com",
  locale: "ru-RU",
  workMarker: "Работа",
  headerSelector: 'header, [role="banner"]',
  routePattern:
    /^\/g\/g-p-([^/]+)\/c\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/|$)/i,
  composerName: "Чат с ChatGPT",
  emptyPlaceholder: "Работайте над чем угодно",
  sendName: "Отправить промпт",
  generatingPlaceholder: "Отслеживание",
  generatingText: "Выполняется",
  stopName: "Остановить ответ",
  selectors: Object.freeze({
    surfaceRoot: "body",
    promptInput: "#prompt-textarea",
    sendControl:
      'button#composer-submit-button[data-testid="send-button"], button[data-testid="send-button"]',
    stopControl: 'button[data-testid="stop-button"]',
    busySignal: '[aria-busy="true"]',
    assistantMessage:
      'section[data-turn="assistant"], [data-message-author-role="assistant"]',
    messageId: Object.freeze({
      primary: "data-turn-id",
      directFallback: "data-message-id",
    }),
    codeSurface: Object.freeze([
      "[data-writing-block-fullscreen-editor-region]",
      ".cm-content",
      "#code-block-viewer",
      "pre > code",
      "pre",
    ]),
    nativeCopy:
      'button[aria-label="Копировать ответ"], button[aria-label="Копировать"], button[aria-label="Copy"]',
  }),
});

export type ChatGPTWorkH3Profile = typeof CHATGPT_WORK_H3_PROFILE;

export type WorkRouteIdentity = Readonly<{
  projectRouteKey: string;
  conversationId: string;
}>;

export type WorkRouteResolution =
  | Readonly<{ kind: "BOUND"; identity: WorkRouteIdentity }>
  | Readonly<{ kind: "CONFLICT" }>
  | Readonly<{ kind: "MISSING" }>;

export function workSurfaceRoot(page: Page): Locator {
  return page.locator(CHATGPT_WORK_H3_PROFILE.selectors.surfaceRoot);
}

/** Only header/banner-owned exact text is eligible Work identity. */
export function workHeaderMarkers(page: Page): Locator {
  return page
    .locator(CHATGPT_WORK_H3_PROFILE.headerSelector)
    .getByText(CHATGPT_WORK_H3_PROFILE.workMarker, { exact: true });
}

export async function hasPositiveWorkMarker(page: Page): Promise<boolean> {
  const all = page.getByText(CHATGPT_WORK_H3_PROFILE.workMarker, {
    exact: true,
  });
  const owned = workHeaderMarkers(page);
  let visibleAll = 0;
  for (let index = 0; index < (await all.count()); index += 1) {
    if (
      await all
        .nth(index)
        .isVisible({ timeout: 250 })
        .catch(() => false)
    )
      visibleAll += 1;
  }
  let visibleOwned = 0;
  for (let index = 0; index < (await owned.count()); index += 1) {
    if (
      await owned
        .nth(index)
        .isVisible({ timeout: 250 })
        .catch(() => false)
    )
      visibleOwned += 1;
  }
  return visibleAll === 1 && visibleOwned === 1;
}

export function workPromptInputs(composer: Locator): Locator {
  return composer.locator(CHATGPT_WORK_H3_PROFILE.selectors.promptInput);
}

export function workSendControls(composer: Locator): Locator {
  return composer.locator(CHATGPT_WORK_H3_PROFILE.selectors.sendControl);
}

export function workStopControls(composer: Locator): Locator {
  return composer.locator(CHATGPT_WORK_H3_PROFILE.selectors.stopControl);
}

export function workAssistantMessages(root: Locator): Locator {
  return root.locator(CHATGPT_WORK_H3_PROFILE.selectors.assistantMessage);
}

export function workCodeSurfaces(message: Locator): Locator {
  return message.locator(
    CHATGPT_WORK_H3_PROFILE.selectors.codeSurface.join(", "),
  );
}

export function workCopyControls(message: Locator): Locator {
  return message.locator(CHATGPT_WORK_H3_PROFILE.selectors.nativeCopy);
}

export function parseWorkRoute(url: string): WorkRouteIdentity | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(CHATGPT_WORK_H3_PROFILE.routePattern);
    if (!match?.[1] || !match[2]) return null;
    return {
      projectRouteKey: match[1],
      conversationId: match[2].toLowerCase(),
    };
  } catch {
    return null;
  }
}

export function resolveWorkRoute(
  pageUrl: string,
  canonicalHref: string | null,
): WorkRouteResolution {
  let page: URL;
  try {
    page = new URL(pageUrl);
  } catch {
    return { kind: "MISSING" };
  }
  const fromUrl = parseWorkRoute(page.toString());
  let fromCanonical: WorkRouteIdentity | null = null;
  if (canonicalHref) {
    try {
      const canonical = new URL(canonicalHref, page.origin);
      if (canonical.origin === page.origin)
        fromCanonical = parseWorkRoute(canonical.toString());
    } catch {
      return { kind: "CONFLICT" };
    }
  }
  if (canonicalHref && !fromCanonical) return { kind: "CONFLICT" };
  if (
    fromUrl &&
    fromCanonical &&
    (fromUrl.projectRouteKey !== fromCanonical.projectRouteKey ||
      fromUrl.conversationId !== fromCanonical.conversationId)
  )
    return { kind: "CONFLICT" };
  const identity = fromUrl ?? fromCanonical;
  return identity ? { kind: "BOUND", identity } : { kind: "MISSING" };
}

export async function workMessageId(message: Locator): Promise<string | null> {
  const direct = await message.getAttribute(
    CHATGPT_WORK_H3_PROFILE.selectors.messageId.primary,
  );
  if (direct) return direct;
  return message.getAttribute(
    CHATGPT_WORK_H3_PROFILE.selectors.messageId.directFallback,
  );
}
