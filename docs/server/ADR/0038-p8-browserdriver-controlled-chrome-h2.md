# ADR-0038: P8 BrowserDriver, controlled Chrome, and H2 structural smoke

Date: 2026-09-13
Status: P8.3 local candidate; not locally or remotely accepted

## Context

P8.1 owns the Health vocabulary, contour catalog, and final deterministic
classifier. P8.2 owns immutable persistence of validated completed Health
runs. P8.3 needs a real browser boundary for cheap structural observations
without turning Health into a generic remote-browser service or starting the
provider-specific H3 surface work.

## Decisions

P8.3 owns:

- the browser-family-independent `BrowserDriver` contract;
- the concrete controlled `ChromeBrowserDriver`;
- H2 structural observation and its bounded report envelope;
- the trusted local target registry and top-level origin policy;
- the packaged strategy registry and safe structural metadata;
- browser lifecycle/runtime metadata;
- deterministic mapping of controlled-browser and environment uncertainty.

P8.3 does not own ChatGPT Standard/Work, H3 prompt insertion/send/response
behavior, scheduling, incidents, Health admin/API/UI, notifications, Yandex
Browser, evidence persistence or screenshot retention, or customer sessions.
P13 owns a future Yandex live driver. P8.4 owns provider-surface H3 and
sanitized evidence.

## Controlled browser boundary

The public runner contract exposes lifecycle methods, a target-key `open`,
runtime metadata, packaged strategy observation, and ephemeral cleanup. It does
not expose Playwright `Browser`, `BrowserContext`, `Page`, or `Locator`, and has
no evaluation, arbitrary URL, raw selector, CDP, script, shell, download,
clipboard, or file-chooser operation.

Only `EPHEMERAL_CONTROLLED` sessions are supported. Chrome launches headless
with a fresh context, accepts no permissions, disables downloads, never loads
customer storage/cookies/credentials, and closes resources in
`closeOrPersist()` without persisting session state.

P8.3 supports exactly one controlled top-level page. Before that page is
opened, the BrowserContext installs a context-wide top-level navigation
firewall over all pages: the controlled page may navigate only to the packaged
target's allowed origins, while every secondary page or popup is marked unsafe,
its top-level navigation is aborted, and the page is closed. Main-frame URL
transitions provide bounded defense in depth for non-network schemes and later
navigation. Raw Playwright handles are stored in ECMAScript runtime-private
fields; they are not ordinary JavaScript properties or public getters.

Targets are compiled trusted definitions. A run supplies only a registered
target key. Each definition validates an HTTP(S) start URL, credential-free
URL, allowed top-level origins, browser family, and bounded navigation
timeout. The driver blocks disallowed-origin requests before network
continuation and rejects an unsafe redirect deterministically. No external
provider target is packaged in P8.3.

For Chrome only, `ChromeBrowserDriver` may use a private, fixed-command
Chromium DevTools Protocol interceptor solely to enforce this packaged
top-level network authority. The interceptor is internal, non-exported,
non-configurable by runtime payload, and is not BrowserDriver public authority.
It captures the controlled page's primary frame with `Page.getFrameTree`,
enables `Fetch` at request stage, continues allowed primary Document requests
and all non-primary requests, and fails disallowed primary Document requests
before unapproved network delivery where Chromium allows request-stage
interception. The session is held in an ECMAScript runtime-private field and
is disabled and disposed with the ephemeral page/context. No generic CDP
send, raw session, Network API, or caller-selected protocol command exists.

## Packaged strategies and H2 plan

The H2 plan is a strict allowlist of baseline contour keys, accepted packaged
strategy IDs, accepted structural assertion IDs, ordered primary/fallback
strategies, a target key, and a bounded contour timeout. Unknown fields and
profile-like authority (`url`, selectors, scripts, credentials, storage,
headers, commands, filesystem paths, and provider operations) are rejected.
Locator resolution is compiled local code keyed by the accepted P8 strategy
IDs; it is not supplied by JSON or remote profile content.

H2 only observes page identity, surface/contour markers, visibility,
editability, actionability, existing message/code/copy relationships,
conversation identity, delivery structure, and blocking markers. It never
fills, types, presses keys, clicks Send or Copy, submits a form, uploads or
downloads a file, executes a bridge-shaped command, waits for a response after
a new prompt, or mutates provider state. Safe metadata is bounded to counts,
tag/type/role, presence of allowlisted metadata, booleans, a fixed relationship
label, and an accepted uncertainty marker. Full DOM/HTML, text, cookies,
storage, credentials, headers, screenshots, and account identity are not
returned or persisted.

The H2 report deliberately has no `HealthState` field and does not call
`classifyHealth()`. Structural miss is not a fabricated `BROKEN` or other
final Health result; skipped H3 behavior is never treated as `PASS`. P8.3
does not call `persistCompletedHealthRun()` or add a Health suite kind or
migration.

## Environment and acceptance

Accepted uncertainty reasons are reused for login expiry, verification/CAPTCHA
checkpoint, account block, pre-identity network failure, and controlled
browser unavailability. A checkpoint is uncertainty, not product breakage,
and is closed cleanly without bypass or anti-bot behavior.

Implementation acceptance uses real Chromium against a disposable HTTP fixture
bound to `127.0.0.1` on a dynamic port. It does not access ChatGPT, Yandex,
Ozon, or another external provider. The fixture proves primary and fallback
observation, required structural miss, checkpoint uncertainty, redirect
rejection, read-only action counters, and isolation of fresh contexts.

P8.3 intentionally has no screenshot implementation. Sanitized evidence and
retention are deferred to P8.4. The stage remains `ACTIVE / LOCAL CANDIDATE`
until a separate review and acceptance process.
