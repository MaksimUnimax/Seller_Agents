import { createServer, type IncomingMessage, type Server } from "node:http";
import { getPackagedH3Prompt } from "@product/health-runner";

export type HealthStandardH3FixtureVariant =
  | "VALID"
  | "WORK_SURFACE"
  | "MISSING_SURFACE"
  | "LOGIN_EXPIRED"
  | "CAPTCHA_CHECKPOINT"
  | "VERIFICATION_CHECKPOINT"
  | "ACCOUNT_BLOCKED"
  | "MISSING_COMPOSER"
  | "AMBIGUOUS_COMPOSER"
  | "DISABLED_INPUT"
  | "MISSING_SEND"
  | "SEND_STOP_CONFUSION"
  | "SEND_AMBIGUOUS"
  | "OLD_RESPONSE_ONLY"
  | "BUSY_TIMEOUT"
  | "RESPONSE_MISSING"
  | "COMPLETION_MISSING"
  | "CODE_BLOCK_MISSING"
  | "COPY_MISSING"
  | "COPY_MISMATCHED"
  | "CONVERSATION_CHANGED"
  | "DELIVERY_MISSING";

export type HealthStandardH3Fixture = Readonly<{
  origin: string;
  startUrl: (variant: HealthStandardH3FixtureVariant) => string;
  promptMatches: number;
  sendActivations: number;
  requestMethods: readonly string[];
  close: () => Promise<void>;
}>;

const HEALTH_PROMPT = getPackagedH3Prompt("BRIDGE_COMMAND_SMOKE_V1");
const BLOCKERS: Readonly<
  Partial<Record<HealthStandardH3FixtureVariant, string>>
> = {
  LOGIN_EXPIRED: "LOGIN_EXPIRED",
  CAPTCHA_CHECKPOINT: "CAPTCHA_SECURITY_CHECKPOINT",
  VERIFICATION_CHECKPOINT: "VERIFICATION_CHECKPOINT",
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
};

function requestPath(request: IncomingMessage): string {
  return new URL(request.url ?? "/", "http://127.0.0.1").pathname;
}

function testId(id: string): string {
  return `data-testid="hf-${id}"`;
}

function composerMarkup(
  variant: HealthStandardH3FixtureVariant,
  conversationId: string,
  suffix = "",
): string {
  if (variant === "MISSING_COMPOSER") return "";
  const disabled = variant === "DISABLED_INPUT" ? " disabled" : "";
  const send =
    variant === "MISSING_SEND"
      ? ""
      : `<button ${testId("send-control")} data-hf-state="send" data-hf-actionable="true" aria-label="Send message" type="button">Send</button>`;
  const extraSend =
    variant === "SEND_AMBIGUOUS"
      ? `<button ${testId("send-control")} data-hf-state="send" data-hf-actionable="true" aria-label="Send message" type="button">Send duplicate</button>`
      : "";
  const stop =
    variant === "SEND_STOP_CONFUSION"
      ? `<button ${testId("stop-control")} data-hf-state="busy" aria-label="Stop generating" type="button">Stop</button>`
      : `<button ${testId("stop-control")} data-hf-state="busy" aria-label="Stop generating" type="button" hidden>Stop</button>`;
  const delivery =
    variant === "DELIVERY_MISSING"
      ? ""
      : `<div ${testId("delivery-target")} data-hf-owner-conversation-id="${conversationId}" data-hf-mode="health-safe">delivery contour</div>`;
  return `<form ${testId("composer-root")} data-hf-active="true" data-hf-variant="standard_composer_v1" data-hf-conversation-id="${conversationId}" data-hf-instance="${suffix}">
    <textarea ${testId("editable-input")} aria-label="ChatGPT prompt" data-hf-editable="true" data-hf-actionable="true"${disabled}></textarea>
    ${send}${extraSend}${stop}${delivery}
  </form>`;
}

function historicalResponse(conversationId: string): string {
  return `<article ${testId("assistant-message")} data-hf-message-id="history-1" data-hf-conversation-id="${conversationId}">
    <div ${testId("command-surface")} data-hf-shape="fenced-code-block"><pre ${testId("code-block")} data-hf-fence="true" data-hf-code-id="history-code"><code>${"BRIDGE_HEALTHCHECK_V1"}</code></pre></div>
    <button ${testId("native-copy")} data-hf-copy-for="history-code" data-hf-actionable="true" aria-label="Copy">Copy</button>
  </article>`;
}

function newResponseMarkup(
  variant: HealthStandardH3FixtureVariant,
  conversationId: string,
): string {
  const completed = variant !== "COMPLETION_MISSING";
  const responseConversationId =
    variant === "CONVERSATION_CHANGED"
      ? "changed-conversation"
      : conversationId;
  const code =
    variant === "CODE_BLOCK_MISSING"
      ? ""
      : `<div ${testId("command-surface")} data-hf-shape="fenced-code-block"><pre ${testId("code-block")} data-hf-fence="true" data-hf-code-id="response-code"><code>${HEALTH_PROMPT.includes("BRIDGE_HEALTHCHECK_V1") ? "BRIDGE_HEALTHCHECK_V1" : "unexpected"}</code></pre></div>`;
  const copy =
    variant === "COPY_MISSING"
      ? ""
      : `<button ${testId("native-copy")} data-hf-copy-for="${variant === "COPY_MISMATCHED" ? "wrong-code" : "response-code"}" data-hf-actionable="true" aria-label="Copy">Copy</button>`;
  return `<article ${testId("assistant-message")} data-hf-message-id="response-1" data-hf-conversation-id="${responseConversationId}">
    <div ${testId("message-association")} data-hf-conversation-id="${responseConversationId}"></div>
    <div ${testId("response-state")} data-hf-state="${completed ? "idle" : "busy"}" data-hf-generation-seen="true"></div>
    <div ${testId("completion")} ${completed ? "" : "hidden"}>complete</div><div ${testId("response-idle")} ${completed ? "" : "hidden"}>idle</div>
    ${code}${copy}
  </article>`;
}

function fixtureHtml(variant: HealthStandardH3FixtureVariant): string {
  const conversationId = "fixture-conversation-v1";
  const blocker = BLOCKERS[variant];
  const surface =
    variant === "MISSING_SURFACE"
      ? ""
      : `<section ${testId("surface")} data-hf-kind="${variant === "WORK_SURFACE" ? "chatgpt-work" : "chatgpt-standard"}">surface</section>`;
  const composerCount = variant === "AMBIGUOUS_COMPOSER" ? 2 : 1;
  const composers = Array.from({ length: composerCount }, (_unused, index) =>
    composerMarkup(variant, conversationId, String(index)),
  ).join("");
  const history =
    variant === "OLD_RESPONSE_ONLY" ? historicalResponse(conversationId) : "";
  const responseEnabled = ![
    "OLD_RESPONSE_ONLY",
    "BUSY_TIMEOUT",
    "RESPONSE_MISSING",
  ].includes(variant);
  const completionEnabled = variant !== "COMPLETION_MISSING";
  const promptExpectation = JSON.stringify(HEALTH_PROMPT);
  return `<!doctype html>
<html><head><title>Controlled ChatGPT Standard H3 fixture</title></head>
<body>
  <main ${testId("page-host")} data-hf-kind="chatgpt">host</main>
  ${surface}
  <section ${testId("conversation-root")} data-hf-conversation-id="${conversationId}">
    <section ${testId("active-conversation")} data-hf-conversation-id="${conversationId}">
      <div ${testId("conversation-url-id")} data-hf-conversation-id="${conversationId}"></div>
      <div ${testId("response-state")} data-hf-state="idle" data-hf-generation-seen="false"></div>
      ${history}
      ${composers}
    </section>
  </section>
  ${blocker ? `<div ${testId("blocking")} data-hf-state="${blocker}">blocked</div>` : ""}
  <script>
    const conversation = document.querySelector('[data-testid="hf-conversation-root"]');
    const initialState = conversation.querySelector('[data-testid="hf-response-state"]');
    let sendCount = 0;
    const expectedPrompt = ${promptExpectation};
    document.querySelectorAll('[data-testid="hf-editable-input"]').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.value === expectedPrompt) {
          input.setAttribute('data-hf-prompt-match', 'true');
          fetch('/fixture-action?kind=prompt-match');
        }
      });
    });
    document.querySelectorAll('[data-testid="hf-send-control"]').forEach((send) => {
      send.addEventListener('click', () => {
        sendCount += 1;
        fetch('/fixture-action?kind=send-click&count=' + sendCount);
        if (sendCount !== 1) return;
        initialState.setAttribute('data-hf-state', 'busy');
        initialState.setAttribute('data-hf-generation-seen', '${variant !== "BUSY_TIMEOUT" ? "true" : "false"}');
        document.querySelectorAll('[data-testid="hf-stop-control"]').forEach((stop) => stop.hidden = false);
        ${
          responseEnabled
            ? `setTimeout(() => {
          conversation.querySelector('[data-testid="hf-active-conversation"]').insertAdjacentHTML('beforeend', ${JSON.stringify(newResponseMarkup(variant, conversationId))});
          const response = conversation.querySelector('[data-testid="hf-assistant-message"][data-hf-message-id="response-1"]');
          ${
            completionEnabled
              ? `document.querySelector('[data-testid="hf-assistant-message"][data-hf-message-id="response-1"] [data-testid="hf-response-state"]').setAttribute('data-hf-state', 'idle');
          document.querySelector('[data-testid="hf-assistant-message"][data-hf-message-id="response-1"] [data-testid="hf-completion"]').hidden = false;
          document.querySelector('[data-testid="hf-assistant-message"][data-hf-message-id="response-1"] [data-testid="hf-response-idle"]').hidden = false;
          document.querySelectorAll('[data-testid="hf-stop-control"]').forEach((stop) => stop.hidden = true);`
              : ""
          }
        }, 40);`
            : ""
        }
      });
    });
    window.addEventListener('beforeunload', () => fetch('/fixture-action?kind=cleanup'));
  </script>
</body></html>`;
}

export async function startHealthStandardH3Fixture(): Promise<HealthStandardH3Fixture> {
  const requestMethods: string[] = [];
  let promptMatches = 0;
  let sendActivations = 0;
  const server: Server = createServer((request, response) => {
    const path = requestPath(request);
    requestMethods.push(request.method ?? "UNKNOWN");
    if (path === "/fixture-action") {
      const kind = new URL(
        request.url ?? "/",
        "http://127.0.0.1",
      ).searchParams.get("kind");
      if (kind === "send-click") sendActivations += 1;
      if (kind === "prompt-match") promptMatches += 1;
      response.writeHead(204).end();
      return;
    }
    if (path === "/fixture-state") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ promptMatches, sendActivations }));
      return;
    }
    const variant = path
      .slice(1)
      .toUpperCase() as HealthStandardH3FixtureVariant;
    const variants: readonly HealthStandardH3FixtureVariant[] = [
      "VALID",
      "WORK_SURFACE",
      "MISSING_SURFACE",
      "LOGIN_EXPIRED",
      "CAPTCHA_CHECKPOINT",
      "VERIFICATION_CHECKPOINT",
      "ACCOUNT_BLOCKED",
      "MISSING_COMPOSER",
      "AMBIGUOUS_COMPOSER",
      "DISABLED_INPUT",
      "MISSING_SEND",
      "SEND_STOP_CONFUSION",
      "SEND_AMBIGUOUS",
      "OLD_RESPONSE_ONLY",
      "BUSY_TIMEOUT",
      "RESPONSE_MISSING",
      "COMPLETION_MISSING",
      "CODE_BLOCK_MISSING",
      "COPY_MISSING",
      "COPY_MISMATCHED",
      "CONVERSATION_CHANGED",
      "DELIVERY_MISSING",
    ];
    if (!variants.includes(variant) || request.method !== "GET") {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(fixtureHtml(variant));
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (typeof address !== "object" || !address) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    throw new Error("H3_FIXTURE_ADDRESS_UNAVAILABLE");
  }
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    startUrl: (variant) => `${origin}/${variant.toLowerCase()}`,
    get promptMatches() {
      return promptMatches;
    },
    get sendActivations() {
      return sendActivations;
    },
    requestMethods,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}
