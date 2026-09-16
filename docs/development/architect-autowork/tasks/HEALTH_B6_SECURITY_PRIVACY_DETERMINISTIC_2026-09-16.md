# SA-HEALTH-B6-SPDR-20260916-01

Roadmap: P8.4 / B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION

This is a bounded deterministic acceptance/evidence task. It is NOT a new H3 feature task, NOT live-provider acceptance, and NOT permission to redesign or patch runtime behavior. The architect has independently accepted P8.4/B5 on the exact base below and has already determined the B6 proof matrix.

## Repository / branch / exact base

Repository: MaksimUnimax/runtime-fixtures
Stable repository ID: 1369117174
Branch: feature/server-health-h3-p8-4
Required exact remote/start base: bf3c27a817c7e4698f539ff5cacc1db73c833710
Expected base tree: 2223a72ecfdf98758c6c3f96c1adeb7b541ec168
Expected base parent: 668877ecda66d73f7046339393226309b966c7a3
Current main at architect preparation: bc718cc5c677ad0eb4598e7de3ad766473ff0847
Accepted exact-head B5 Server CI: run 35098078398 / job 104800314556 / SUCCESS.

First fetch current refs. Confirm feature/server-health-h3-p8-4 is still exactly the required base and the worktree is clean. Record current main but do not merge/rebase it. If the Health remote moved, another implementation task is active, or owner dirty state would be damaged: STOP and report exact facts. No reset, rebase, stash, force, cherry-pick or replacement branch.

## B6 architecture decision

The required B6 security/privacy/deterministic guarantees are already implemented and permanently covered by existing accepted source/tests. Therefore B6 must consolidate and reproduce those guarantees without changing production or test code.

Expected changed paths are documentation/evidence only. If a required criterion below is contradicted by exact source or an existing required test fails, STOP and report that exact contradiction. Do NOT invent a fix, add a new test, relax an assertion or change production source in this task.

Live controlled ChatGPT/H3 acceptance is B7, not B6. Make ZERO live ChatGPT, marketplace-provider or customer-session calls.

## Read-only source authority to verify

Read the exact-base versions of these files before running the matrix:

- apps/health-runner/src/h3-contracts.ts
- apps/health-runner/src/h3-contracts.test.ts
- apps/health-runner/src/h3-actions.ts
- apps/health-runner/src/h3-actions.test.ts
- apps/health-runner/src/h3-engine.ts
- apps/health-runner/src/h3-engine.test.ts
- apps/health-runner/src/browser-driver.ts
- apps/health-runner/src/h2.ts
- apps/health-runner/src/h2.test.ts
- apps/health-runner/src/evidence-sanitizer.ts
- apps/health-runner/src/h3-health-persistence.ts
- apps/health-runner/src/h3-health-persistence.test.ts
- apps/health-runner/package.json
- tests/e2e/server/health-h2.spec.ts
- tests/e2e/server/health-standard-h3.spec.ts
- tests/e2e/server/health-work-h3.spec.ts
- tests/integration/server/h3-health-persistence.integration.test.ts

Do not edit any of them.

Record their exact Git blob SHAs in the evidence matrix, at least for the production authorities and each test file used as a gate.

## B6 acceptance matrix — exact facts to prove

### SPDR-01 — packaged operations only

Prove from h3-actions.ts / h3-actions.test.ts:

- only the closed packaged nine-step H3 action vocabulary is accepted;
- injected CLICK, RETRY_SEND or caller-supplied action authority is rejected;
- unsafe fields such as URL/href/startUrl/selector/css/xpath/locator/script/javascript/evaluate/functionBody/promptText/text/message/rawPrompt are rejected;
- target authority remains outside action objects;
- VALIDATE_BRIDGE_SURFACES has the fixed four packaged checks;
- action sequence is frozen and cleanup terminal.

### SPDR-02 — no generic browser escape hatch

Prove from h3-engine.test.ts, browser-driver.ts and h2.test.ts:

- H3 engine surface exposes no click/fill/evaluate generic operation;
- BrowserDriver exposes semantic controlled operations only and no public raw Browser/BrowserContext/Page/Locator/CDPSession handle;
- raw Playwright objects remain private implementation state;
- arbitrary selector/script authority remains rejected at H2/H3 plan boundaries.

### SPDR-03 — exactly one irreversible Send / no resend

Prove from h3-actions.test.ts, h3-engine.test.ts and real local Standard/Work H3 specs:

- exactly one SEND_ONCE / SINGLE_IRREVERSIBLE action exists;
- no RETRY_SEND/RESEND primitive exists;
- failed, uncertain, timed-out or post-Send execution does not resend;
- normal Standard and Work local-fixture runs each observe one prompt match and one physical Send activation.

### SPDR-04 — deterministic benign packaged prompt

Prove from h3-contracts.ts / h3-contracts.test.ts:

- the only H3 prompt ID is BRIDGE_COMMAND_SMOKE_V1;
- text is locally packaged, deterministic and asks only for the fixed BRIDGE_HEALTHCHECK_V1 response shape;
- it explicitly prohibits tool calls/external data access;
- caller raw prompt injection is rejected.

Do not copy full prompt text into B6 evidence; record prompt ID and those bounded properties only.

### SPDR-05 — zero marketplace/provider side effects in B6

Prove:

- apps/health-runner/package.json has no Ozon/Wildberries marketplace runtime dependency;
- the B6 browser runs use only existing loopback/local controlled fixtures;
- no live ChatGPT account, marketplace API, seller token, extension customer session or provider credential is supplied;
- B6 performs zero live-provider calls.

Do not add firewall/network instrumentation or change runtime code. This is an execution-input and dependency-boundary proof, not an external-network experiment.

### SPDR-06 — Standard / Work isolation

Prove from h3-actions.test.ts, h3-engine.test.ts and real Standard/Work H3 specs:

- Standard profile is CHATGPT_STANDARD_H3_V2 revision 2;
- Work profile is CHATGPT_WORK_H3_V1 revision 1;
- registry routes each plan to its matching strategy;
- target/surface and profile mismatches fail before strategy execution;
- both real local-fixture paths execute independently with one Send and their own profile identity.

### SPDR-07 — H2 security regression remains intact

Prove from h2.test.ts and health-h2.spec.ts:

- only registered HTTP(S) controlled targets are accepted;
- embedded credentials and origin-policy mismatch are rejected;
- unsafe top-level redirects/popups are preblocked;
- structural H2 remains non-mutating;
- timeout/security-checkpoint/unexpected failures clean up and remain bounded classifications;
- H2 does not fabricate a final HealthState.

### SPDR-08 — evidence sanitizer / persistence privacy

Prove from h3-contracts.test.ts, evidence-sanitizer.ts, h3-health-persistence.test.ts and the PostgreSQL H3 persistence regression:

- unsafe event fields/raw conversation bundle data are rejected;
- H3 contour/event vocabulary remains strict and bounded;
- toxic prompt/response/DOM/HTML/project/conversation/cookie/token/storage/seller sentinels cannot reach mapped or durable output;
- durable C11 failure evidence remains absent while safe contour provenance remains present;
- no evidence bytes or raw browser state are persisted.

### SPDR-09 — dedicated ephemeral Health sessions; no customer session reuse

Prove from browser-driver.ts, h2.test.ts and health-h2.spec.ts:

- sessionKind is EPHEMERAL_CONTROLLED;
- ChromeBrowserDriver launches a fresh browser and new BrowserContext;
- it does not use customer userDataDir/storageState/profile/session injection;
- cleanup closes context/browser and resets driver state;
- two separate real Chromium H2 runs start with empty initial cookies, proving no cookie carry-over between Health contexts.

Do not use a real customer browser/profile/account to prove this criterion.

### SPDR-10 — cleanup and bounded failure classification

Prove from h3-engine.test.ts and H2 tests:

- pre-Send failure still cleans exactly once;
- post-Send failure/timeout does not resend and still cleans up;
- cleanup failure has stable CLEANUP_FAILED classification;
- primary and cleanup failures can both be retained without leaking raw exception text;
- total run timeout is bounded and does not cause resend.

### SPDR-11 — no secret/raw-conversation leak

Prove from sanitizer/persistence tests plus real Standard/Work fixture assertions:

- serialized H3 results do not contain raw packaged prompt content or the requested response token;
- Standard result does not expose selector/html/cookie/token material;
- Work result does not expose localized Work marker/project context;
- mapped/durable output remains free of toxic secret/raw-conversation sentinels.

## Required deterministic execution matrix

Use one task-owned disposable PostgreSQL 18 container. Name it `health-b6-spdr-pg`. Use a loopback-only dynamically assigned host port and an explicit disposable database named `e2e`. Do not reuse any development/customer DB. Record container image/version and database name, but never persist the password/connection string in evidence. Remove the container when all focused checks are complete, including on failure where practical.

Use the resulting loopback DATABASE_URL for the focused PostgreSQL and Playwright matrix.

Run exactly these required gates on the unchanged accepted B5 source:

1. Health-runner unit/security matrix:
   `pnpm --filter @product/health-runner exec vitest run src/h2.test.ts src/h3-contracts.test.ts src/h3-actions.test.ts src/h3-engine.test.ts src/h3-health-persistence.test.ts`

2. Health-runner type boundary:
   `pnpm --filter @product/health-runner typecheck`

3. Bridge boundary guard:
   `pnpm bridge:guard`

4. Focused durable H3 PostgreSQL regression:
   `pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts`

5. Focused real Chromium local-fixture matrix:
   `PRODUCT_CONTROL_PLANE_E2E=1 pnpm exec playwright test --config tests/e2e/server/playwright.config.ts tests/e2e/server/health-h2.spec.ts tests/e2e/server/health-standard-h3.spec.ts tests/e2e/server/health-work-h3.spec.ts`

Install Chromium only if the established environment lacks it; do not perform unrelated dependency upgrades.

All five gates must exit 0. Record actual file/test totals and skips; do not invent expected counts. A skipped required test is not a pass.

Because runtime/test source is unchanged and exact-base B5 Server CI is already fully green, do NOT repeat the entire local repository lint/unit/integration/E2E cycle. The targeted B6 matrix is the new required gate. A normal push of the evidence-only B6 commit will trigger exact-head Server CI, which the architect will independently review.

## Evidence artifact

Create only:

- docs/server/B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION_2026-09-16.md
- docs/server/evidence/health-b6-spdr-2026-09-16/README.md
- docs/server/evidence/health-b6-spdr-2026-09-16/results.json

The evidence must be sanitized and must contain:

- task ID / roadmap coordinate;
- exact base SHA/tree/main snapshot;
- source/test blob-SHA authority matrix;
- SPDR-01 through SPDR-11, each mapped to exact existing source/test assertion names and its proof result;
- exact commands, exits, actual test totals/skips;
- disposable PostgreSQL image/version/name and confirmation of removal, without secret connection material;
- confirmation that all browser tests were local controlled fixtures;
- zero live ChatGPT/provider/marketplace/customer-session calls;
- zero production/test code changes;
- changed-path inventory;
- explicit statement that B7 live controlled H3 acceptance is NOT started;
- B6 remains pending architect review and exact-head remote CI after publication.

Do not paste raw logs containing environment values. Include only bounded command/result summaries sufficient to reproduce the proof.

## Allowed changed paths

ONLY:

- docs/server/B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION_2026-09-16.md
- docs/server/evidence/health-b6-spdr-2026-09-16/README.md
- docs/server/evidence/health-b6-spdr-2026-09-16/results.json

No production code changes.
No test code changes.
No package/dependency changes.
No workflow changes.
No migration/schema changes.
No B5 evidence rewrite.
No reserved README.md, AGENTS.md, docs/README.md, CHANGELOG.md.
No docs/ROADMAP.md or docs/development/SERVER_CODEX_HANDOFF.md.
No site/SEO/domain/private workspace-control changes.

If any non-allowed path becomes necessary, STOP and report the exact failed B6 criterion. Do not broaden scope.

## Documentation verification

After writing only the allowed B6 evidence files:

- validate results.json parses as JSON;
- run `pnpm docs:check`;
- inspect `git diff --check`;
- verify exact diff against bf3c27a817c7e4698f539ff5cacc1db73c833710 is evidence-only and contains no secret/raw customer/provider data.

Do not rerun the focused runtime matrix merely because evidence files were added; runtime/test source did not change.

## Publication

Create a bounded evidence-only commit or minimal bounded evidence-only commit chain. Do not amend or rewrite accepted B5 history.

Fetch immediately before push. Remote feature/server-health-h3-p8-4 must still equal bf3c27a817c7e4698f539ff5cacc1db73c833710. If it moved, STOP; no rebase/reset/force.

Push by normal fast-forward to the SAME branch. If normal HTTPS publication alone is blocked by unavailable credentials, the already-approved one-shot GitHub SSH-over-443 route may be used without changing stored repository configuration or disabling host-key verification. No force/force-with-lease, replacement branch, PR, main merge, deployment or release.

After publication verify exact remote final SHA and clean worktree. Report an immediately observable Server CI run/job/status if available; do not rerun or wait-loop it. Architect handles exact-head remote CI after terminal.

## Non-goals

Do not start B7 live controlled H3 acceptance or B8.
Do not start P8.5+.
Do not touch I1/C2.2-A/PR9, extension runtime/package, S1.2/D3.
Do not use real ChatGPT/customer/marketplace credentials, browser profiles, sessions or data.
Do not merge main, deploy or release.
Do not add a consolidated test merely to rename existing guarantees; B6 is a proof gate over existing permanent regressions.

## Terminal report — then STOP

Return:

- task ID / P8.4 B6 coordinate;
- worktree path;
- exact initial branch/base/tree/main refs;
- SPDR-01..SPDR-11 PASS/FAIL matrix with exact supporting test/source names;
- all five required focused commands with exit codes, actual test/file totals and skips;
- disposable PostgreSQL image/version/name, isolation confirmation and removal confirmation, without credentials;
- exact evidence commit/final SHA/tree/parent and commit list;
- changed-path name-status/stat against accepted B5 base and allowlist confirmation;
- docs:check / JSON parse / diff-check results;
- remote Health head before/after push;
- immediate Server CI run/job/status if observable;
- final clean worktree;
- zero production/test/package/workflow/migration changes;
- zero live ChatGPT/provider/marketplace/customer-session calls;
- zero reset/rebase/stash/cherry-pick/amend/force/main merge/deploy/release;
- explicit statement that B7 was not started and B6 remains pending architect review/exact-head remote CI.

Do not self-accept B6. Do not start B7. STOP after terminal report.