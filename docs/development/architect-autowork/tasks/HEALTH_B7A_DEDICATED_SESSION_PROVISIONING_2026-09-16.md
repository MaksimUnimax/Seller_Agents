# SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01

Roadmap: P8.4 / B7_CONTROLLED_LIVE_H3 — A: dedicated Health session/target provisioning foundation

This is an implementation task with architecture already decided by the architect. It closes the internal provisioning gap required before any real B7 live run. It MUST make zero live ChatGPT/provider/marketplace/customer-session calls.

## Repository / exact base

Repository: MaksimUnimax/runtime-fixtures
Stable repository ID: 1369117174
Branch: feature/server-health-h3-p8-4
Required exact remote/start base: 90c1e0c66a47692634eb652aa1392fdafc1f8f10
Expected tree: 447d6515954e051a287011596fdd3154e11c2561
Expected parent: 697eea7adc337e1f11def16818829c2e443efb15
Current main at architect preparation: bc718cc5c677ad0eb4598e7de3ad766473ff0847

Exact-head B8 Server CI authority: run 35105136595 / job 104824258928 / SUCCESS.

First fetch refs. Require local/remote Health exact base and clean worktree. If remote moved, local diverged, or another implementation task is active: STOP and report. No reset/rebase/stash/cherry-pick/amend/force/replacement branch.

## Proven architectural gap

Normative docs/server/HEALTH_SYSTEM.md requires dedicated controlled test accounts/browser profiles, session/profile secrets outside Git, a reauthentication runbook, minimal benign conversations and account/session cleanup.

Current accepted source cannot yet perform a compliant authenticated Work H3 live run:

- ChromeBrowserDriver always creates a fresh empty browser.newContext() and has no dedicated-Health auth-state provisioning input;
- Work identifyApprovedSurface requires a bound project/conversation route;
- packaged Work target itself opens only https://chatgpt.com/;
- no sanctioned local-only mechanism supplies dedicated auth state plus the dedicated Work start route;
- customer browser/profile reuse, copied customer session data and raw login automation are forbidden.

This is an internal P8.4/B7 gap and is independently implementable before the external dedicated account is provisioned.

## Accepted design

Preserve a fresh EPHEMERAL_CONTROLLED BrowserContext for every run. Do NOT introduce a persistent userDataDir and do NOT reuse a normal customer/owner profile.

Allow an explicitly dedicated Health context to preload Playwright storageState from an operator-provisioned dedicated Health state file outside Git. The file path is trusted local server configuration only; it is never accepted from H2/H3 plans, remote config, API input, target payload or AI content.

Standard keeps the packaged target start URL. Work may use a local-only dedicated start URL because its positive profile requires a real project/conversation route. That URL is secret operational input outside Git and must:

- be HTTPS;
- have origin exactly CHATGPT_WORK_H3_PROFILE.approvedOrigin (https://chatgpt.com) in production configuration;
- contain no username/password;
- contain no query or hash;
- satisfy the existing parseWorkRoute() packaged route authority;
- never be returned, logged or persisted in Health evidence.

The browser driver itself must independently defend target ownership: a dedicated binding is target-specific; it cannot be opened as another target; any start override must remain inside the resolved target's allowedTopLevelOrigins; Standard cannot receive a start override; Work override must satisfy parseWorkRoute().

No selector, script, prompt, click primitive, raw Playwright handle or arbitrary URL authority is added to H3 plan/remote inputs.

## New dedicated session module

Create:

apps/health-runner/src/dedicated-health-session.ts
apps/health-runner/src/dedicated-health-session.test.ts

Implement a strict local file-backed configuration registry.

Use one strict versioned JSON shape owned by this module:

- version must equal 1;
- targets is a strict object that may contain only chatgpt_standard_health and chatgpt_work_health;
- at least one target must be configured;
- Standard binding contains storageStatePath only;
- Work binding contains storageStatePath and startUrl only;
- unknown fields are rejected;
- if both bindings exist, their storageStatePath values must resolve to different files.

Export a bounded API equivalent to:

- DedicatedHealthSessionConfigError with a closed safe code enum and message equal only to the code;
- immutable DedicatedHealthSessionBinding type;
- DedicatedHealthSessionRegistry with resolve(targetKey);
- async loadDedicatedHealthSessionRegistry(configFilePath).

Do not expose raw config JSON or storage-state contents through toJSON/logging/result helpers.

### File safety

For the config file and each storageStatePath:

- path must be absolute;
- lstat must prove a regular file, not a symlink;
- config file size must be >0 and <=64 KiB;
- storage-state file size must be >0 and <=4 MiB;
- on POSIX, group/other permission bits must be zero and owner-read must be present;
- file errors must produce bounded error codes only, never echo the sensitive path/content;
- do not read or log storage-state contents in this module; Playwright consumes the path directly.

The config JSON itself is read only long enough to parse/validate the bounded configuration. Never log it.

### Work start URL validation

At config load:

- parse URL safely;
- require https:;
- require exact origin https://chatgpt.com;
- reject username/password/search/hash;
- require parseWorkRoute(url) != null.

Standard has no startUrl field and strict parsing must reject one.

## Browser driver integration

Modify only the minimum required parts of:

apps/health-runner/src/browser-driver.ts
apps/health-runner/src/index.ts

Keep the existing public default ChromeBrowserDriver constructor behavior unchanged for current callers: without a dedicated binding it creates the same fresh anonymous/local-test EPHEMERAL_CONTROLLED context as before.

Add a trusted optional dedicated binding path and an exported named factory:

createDedicatedHealthChromeBrowserDriver(targets, binding, launchTimeoutMs?)

The factory may internally use a new optional constructor parameter; callers should use the named factory for dedicated sessions.

On launch of a dedicated driver, create the same fresh browser.newContext with acceptDownloads=false plus storageState set to the validated dedicated Health file path. Do not use launchPersistentContext/userDataDir.

BrowserRuntimeMetadata.sessionKind remains exactly EPHEMERAL_CONTROLLED because the context is fresh each run.

On open(targetKey):

- reject if binding.targetKey != resolved target key with a new bounded BrowserDriverError code;
- Standard navigates only target.startUrl and rejects any injected override at runtime;
- Work uses binding.startUrl;
- independently parse the effective URL and require no credentials/search/hash;
- require effective URL origin is in target.allowedTopLevelOrigins;
- for Work require parseWorkRoute(effectiveUrl) != null;
- reject before navigation on any mismatch using a bounded safe BrowserDriverError code;
- existing navigation firewall, popup/redirect protections and active target ownership remain unchanged.

Do not add raw Page/Browser/Context/Locator/CDP getters.

closeOrPersist continues to close the context/browser; it does NOT write auth state back to disk. Reauthentication/state replacement remains an explicit operator action outside this runtime path.

## Deterministic tests

### Unit/config tests

In dedicated-health-session.test.ts use only temporary synthetic files and fake identifiers.

Cover at minimum:

1. valid Standard-only config loads;
2. valid Work-only config loads with a fake approved route;
3. valid both-target config resolves distinct bindings;
4. missing target resolution fails with bounded code;
5. unknown config/target fields rejected;
6. relative config/state paths rejected;
7. config/state symlink rejected on supported platform;
8. non-regular/empty/oversized files rejected;
9. POSIX group/other-readable config/state rejected; owner-only files pass;
10. duplicate Standard/Work storage-state file rejected;
11. Standard startUrl injection rejected by strict schema;
12. Work wrong scheme/origin, embedded credentials, query, hash, missing project route, missing conversation UUID rejected;
13. error messages never contain sentinel path, Work URL, project id or conversation id;
14. registry/object serialization does not reveal state-file path or Work URL.

Synthetic storage-state contents may be minimal local test JSON. No real cookie/token/account material.

### Real Chromium local regression

Create:

tests/e2e/server/health-dedicated-session.spec.ts

Use only a task-local loopback HTTP server and temporary synthetic Playwright storage-state files. No external network.

Required cases:

A. Standard dedicated binding:
- exact target key chatgpt_standard_health on a loopback ControlledTargetRegistry fixture;
- storage state contains one synthetic loopback cookie;
- dedicated factory starts a fresh context;
- open sends the synthetic cookie to the loopback server, proving storageState was actually consumed;
- getRuntimeMetadata().sessionKind remains EPHEMERAL_CONTROLLED;
- ControlledNavigationResult contains only safe targetKey/finalOrigin and not the cookie/path.

B. Work local route override:
- exact target key chatgpt_work_health on a loopback controlled target;
- synthetic binding startUrl uses that loopback origin plus /g/g-p-test-health/c/00000000-0000-4000-8000-000000000123;
- driver navigates that exact path only because it is same allowed target origin and parseWorkRoute-valid;
- synthetic cookie is consumed;
- navigation result still exposes only finalOrigin.

The production file loader remains hard-bound to https://chatgpt.com; the loopback Work binding is constructed directly in test code only to exercise BrowserDriver defense with the same route shape.

C. target mismatch:
- Work binding cannot open Standard target and vice versa;
- server receives no navigation request.

D. runtime defense:
- direct synthetic binding with cross-origin override, Standard override, query/hash or invalid Work route is rejected before navigation with bounded code.

E. isolation:
- after dedicated driver closes, a newly constructed default ChromeBrowserDriver against the same loopback target starts without the synthetic cookie, proving no carry-over between contexts.

No production test hook, environment backdoor, fixture marker or global prototype patch.

## Security regression after new attack surface

The B6 stage remains historical accepted evidence for the pre-B7A source. This task MUST revalidate the applicable security invariants on the new source.

Run focused checks after implementation:

1. dedicated session unit tests;
2. existing h2.test.ts, h3-contracts.test.ts, h3-actions.test.ts, h3-engine.test.ts, h3-health-persistence.test.ts plus dedicated-health-session.test.ts;
3. health-runner typecheck;
4. pnpm bridge:guard;
5. focused new health-dedicated-session.spec.ts plus existing health-h2.spec.ts, health-standard-h3.spec.ts, health-work-h3.spec.ts in real Chromium local fixtures;
6. focused H3 PostgreSQL persistence regression.

Prove specifically:

- remote H2/H3 plan schemas still reject raw storageStatePath/startUrl/session fields;
- default driver remains fresh and cookie-isolated;
- dedicated driver remains fresh EPHEMERAL_CONTROLLED and consumes only explicit dedicated state;
- customer session/profile reuse is still absent;
- no generic browser executor/raw handle exposure;
- no state path/Work route/cookie sentinel appears in H2/H3 result serialization or persistence;
- one-Send/no-resend and Standard/Work strategy behavior remain unchanged.

## Full final acceptance cycle

Once focused checks are green and code is unchanged, run one full server cycle:

1. pnpm lint
2. pnpm format:check
3. pnpm typecheck
4. pnpm exec vitest run tests/e2e/server/playwright-config-regression.test.ts
5. pnpm test
6. pnpm test:integration
7. pnpm db:migrate
8. pnpm openapi:check
9. pnpm bridge:guard
10. pnpm build
11. install Chromium only if actually needed
12. pnpm test:e2e
13. pnpm docs:check

Record actual totals/skips. Do not rerun green gates after unchanged code.

ZERO live ChatGPT/provider/marketplace calls throughout this task.

## Evidence / runbook

Create only:

- docs/server/B7A_DEDICATED_HEALTH_SESSION_PROVISIONING_2026-09-16.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/README.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/results.json

Document without secret values:

- exact base/final identities;
- design and threat boundary;
- config shape by field names/types only, never actual path/URL/token/cookie values;
- dedicated state/config files must live outside Git and be owner-only on POSIX;
- login/CAPTCHA/security controls are never automated or bypassed;
- reauthentication runbook: operator reprovisions/replaces dedicated Health storage-state file out of band, keeps config/state outside Git with restrictive permissions, and reruns controlled Health; runtime never persists refreshed credentials;
- Work start URL belongs only in the local secret config and is never evidence;
- targeted security matrix and full-cycle results;
- zero live calls;
- remaining external B7 prerequisite after this task: owner-provisioned dedicated Standard/Work Health auth state/config plus approved dedicated Work project/conversation route.

Do not claim actual live B7 PASS.

## Allowed changed paths

ONLY:

- apps/health-runner/src/dedicated-health-session.ts
- apps/health-runner/src/dedicated-health-session.test.ts
- apps/health-runner/src/browser-driver.ts
- apps/health-runner/src/index.ts
- tests/e2e/server/health-dedicated-session.spec.ts
- docs/server/B7A_DEDICATED_HEALTH_SESSION_PROVISIONING_2026-09-16.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/README.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/results.json

If another production/test file is genuinely required, STOP and report the exact contradiction. Do not broaden scope yourself.

Explicitly forbidden:

- .env/.env.example changes;
- storage-state/auth/config secret files in repository;
- package/dependency changes;
- H2/H3 plan schema widening;
- target-registry packaged target changes;
- Standard/Work strategy/profile semantic changes;
- shared contracts/OpenAPI/API/DB/migrations;
- existing B1-B8 evidence rewrites;
- README.md, AGENTS.md, docs/README.md, CHANGELOG.md, docs/ROADMAP.md, SERVER_CODEX_HANDOFF.md;
- site/SEO/domain/private workspace-control;
- I1/C2/S1/D3/extension changes;
- live provider calls;
- login automation;
- CAPTCHA/anti-bot/auth/geoblock bypass;
- customer/owner ordinary browser profile/session reuse.

## Publication

Before commit/push verify diff from 90c1e0c... is entirely inside the allowlist and contains no real secrets/state/project/conversation identifiers.

Create bounded commits without rewriting accepted history.

Immediately before push fetch origin and require remote Health still exactly 90c1e0c66a47692634eb652aa1392fdafc1f8f10. If moved: STOP; no rebase/reset/force.

Normal fast-forward push to the SAME Health branch only. If HTTPS credentials alone fail, the previously approved one-shot SSH-over-443 path may be used without changing stored repo configuration or disabling host-key verification.

No force, replacement branch, PR, main merge, deployment or release.

After push verify remote final SHA and clean worktree. Report immediately observable Server CI run/job/status; do not rerun/wait-loop it. Architect handles exact-head CI acceptance.

## Required terminal report — then STOP

Return:

- task ID / P8.4 B7A coordinate;
- exact worktree/base/tree/parent/main;
- exact implemented API/files;
- security invariants and negative cases;
- focused test commands/results/counts/skips;
- full server-cycle commands/results/counts/skips;
- confirmation all auth/session/config data was synthetic and temporary;
- confirmation no state/config path or Work route appears in published evidence/results;
- evidence/runbook paths;
- exact final SHA/tree/parent/commit list;
- changed-path name-status/stat and allowlist result;
- remote before/after push;
- immediate CI run/job/status;
- clean worktree;
- zero live ChatGPT/provider/marketplace/customer-session calls;
- zero login/CAPTCHA/security bypass;
- zero reset/rebase/stash/cherry-pick/amend/force/main merge/deploy/release;
- B7A implementation candidate pending architect/exact-head CI acceptance;
- B7 live behavioral acceptance NOT RUN;
- remaining external prerequisite exactly: owner-provisioned dedicated Health auth state/config for Standard and Work plus approved dedicated Work project/conversation route, all outside Git;
- P8.4 remains NOT_ACCEPTED and P8.5 NOT_STARTED.

Do not self-accept B7A. Do not start the real B7 live run. STOP after terminal report.