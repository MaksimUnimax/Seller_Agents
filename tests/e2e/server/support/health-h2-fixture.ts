import { createServer, type IncomingMessage, type Server } from "node:http";

export type HealthH2FixtureVariant =
  | "PRIMARY_HEALTHY"
  | "FALLBACK_STRUCTURAL"
  | "REQUIRED_CORE_MISSING"
  | "BLOCKING_STATE"
  | "UNSAFE_REDIRECT"
  | "POPUP_CROSS_ORIGIN";

export type HealthH2Fixture = Readonly<{
  origin: string;
  startUrl: (variant: HealthH2FixtureVariant) => string;
  initialRequestCookies: readonly string[];
  mutatingActionKinds: readonly string[];
  requestMethods: readonly string[];
  close: () => Promise<void>;
}>;

function hasVariant(
  pathname: string,
  variant: HealthH2FixtureVariant,
): boolean {
  return pathname === `/${variant.toLowerCase()}`;
}

function marker(
  testId: string,
  tag: string,
  kind: string,
  options: Readonly<{
    role?: string;
    type?: string;
    ariaLabel?: string;
    editable?: boolean;
    actionable?: boolean;
    state?: string;
  }> = {},
): string {
  const attributes = [
    `data-testid="hf-${testId}"`,
    `data-hf-tag="${tag}"`,
    `data-hf-kind="${kind}"`,
    options.role ? `role="${options.role}"` : "",
    options.type ? `type="${options.type}"` : "",
    options.ariaLabel ? `aria-label="${options.ariaLabel}"` : "",
    options.editable ? `data-hf-editable="true"` : "",
    options.actionable ? `data-hf-actionable="true"` : "",
    options.state ? `data-hf-state="${options.state}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<${tag} ${attributes}>fixture</${tag}>`;
}

function fixtureHtml(
  variant: HealthH2FixtureVariant,
  popupOrigin?: string,
): string {
  const composerMissing =
    variant === "FALLBACK_STRUCTURAL" || variant === "REQUIRED_CORE_MISSING";
  const composerFallbackMissing = variant === "REQUIRED_CORE_MISSING";
  const blocker = variant === "BLOCKING_STATE";
  const popupScript =
    variant === "POPUP_CROSS_ORIGIN" && popupOrigin
      ? `<script>window.open(${JSON.stringify(`${popupOrigin}/popup`)});</script>`
      : "";
  return `<!doctype html>
<html><head><title>Controlled H2 fixture</title></head>
<body>
  ${marker("page-host", "main", "page")}
  ${marker("surface", "section", "surface")}
  ${marker("conversation-root", "section", "conversation")}
  ${marker("active-conversation", "section", "conversation-fallback")}
  ${!composerMissing ? marker("composer-root", "form", "composer") : ""}
  ${!composerFallbackMissing ? marker("active-composer", "form", "composer-fallback") : ""}
  ${marker("editable-input", "textarea", "input", { editable: true })}
  <textarea aria-label="fixture-editor" data-hf-tag="textarea" data-hf-kind="input-fallback" data-hf-editable="true"></textarea>
  ${marker("send-control", "button", "send", { role: "button", ariaLabel: "fixture-send", actionable: true })}
  ${marker("composer-action", "button", "send-fallback", { actionable: true })}
  ${marker("busy-indicator", "div", "busy")}
  ${marker("response-state", "div", "response-state")}
  ${marker("assistant-message", "article", "assistant")}
  ${marker("message-association", "article", "assistant-fallback")}
  ${marker("completion", "div", "completion")}
  ${marker("response-idle", "div", "idle")}
  ${marker("command-surface", "pre", "command")}
  ${marker("code-block", "pre", "code")}
  ${marker("native-copy", "button", "copy", { actionable: true })}
  ${marker("copy-anchor", "button", "copy-fallback", { actionable: true })}
  ${marker("conversation-id", "div", "conversation")}
  ${marker("conversation-url-id", "div", "conversation-url")}
  ${marker("delivery-target", "div", "delivery")}
  ${blocker ? marker("blocking", "div", "blocking", { state: "CAPTCHA_SECURITY_CHECKPOINT" }) : ""}
  <script>
    for (const kind of ["input", "submit", "send-click", "copy-click", "file-select", "download"]) {
      document.addEventListener(kind === "send-click" || kind === "copy-click" ? "click" : kind, () => {
        fetch("/fixture-action?kind=" + encodeURIComponent(kind));
      });
    }
  </script>
  ${popupScript}
</body></html>`;
}

function requestPath(request: IncomingMessage): string {
  return new URL(request.url ?? "/", "http://127.0.0.1").pathname;
}

export async function startHealthH2Fixture(
  popupOrigin?: string,
): Promise<HealthH2Fixture> {
  const initialRequestCookies: string[] = [];
  const mutatingActionKinds: string[] = [];
  const requestMethods: string[] = [];
  let sessionNumber = 0;
  const server: Server = createServer((request, response) => {
    const path = requestPath(request);
    const method = request.method ?? "UNKNOWN";
    requestMethods.push(method);
    if (path !== "/favicon.ico" && path !== "/fixture-action") {
      initialRequestCookies.push(request.headers.cookie ?? "");
    }
    if (path === "/fixture-action") {
      const query = new URL(request.url ?? "/", "http://127.0.0.1")
        .searchParams;
      const kind = query.get("kind");
      if (kind) mutatingActionKinds.push(kind);
      response.writeHead(204).end();
      return;
    }
    if (path === "/unsafe_redirect") {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 1;
      response
        .writeHead(302, { location: `http://127.0.0.1:${port + 1}/outside` })
        .end();
      return;
    }
    const variants: HealthH2FixtureVariant[] = [
      "PRIMARY_HEALTHY",
      "FALLBACK_STRUCTURAL",
      "REQUIRED_CORE_MISSING",
      "BLOCKING_STATE",
      "POPUP_CROSS_ORIGIN",
    ];
    const variant = variants.find((candidate) => hasVariant(path, candidate));
    if (!variant || method !== "GET") {
      response.writeHead(404).end();
      return;
    }
    sessionNumber += 1;
    response.setHeader(
      "set-cookie",
      `fixture-session=ephemeral-${sessionNumber}; Path=/`,
    );
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(fixtureHtml(variant, popupOrigin));
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (typeof address !== "object" || !address) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    throw new Error("H2_FIXTURE_ADDRESS_UNAVAILABLE");
  }
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    startUrl: (variant) =>
      variant === "UNSAFE_REDIRECT"
        ? `${origin}/unsafe_redirect`
        : `${origin}/${variant.toLowerCase()}`,
    initialRequestCookies,
    mutatingActionKinds,
    requestMethods,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
  };
}
