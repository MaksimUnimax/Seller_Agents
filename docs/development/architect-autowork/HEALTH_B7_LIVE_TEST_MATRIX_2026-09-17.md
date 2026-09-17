# HEALTH B7 / H3 live test matrix — 2026-09-17

Status: architect control evidence. This is not a production patch and does not accept B7/P8.4.

## Authority

- Repository: `MaksimUnimax/runtime-fixtures` (stable repo ID 1369117174).
- Health branch: `feature/server-health-h3-p8-4`.
- Exact inspected Health head: `d4bae8752c304cd49ef5c0f4ef2b5d44281d0f95`.
- Exact inspected tree: `59729eb113061f00e6b093de8237a138e7d7603f`.
- Exact-head Server CI: run `35125879122`, job `104894664468`, SUCCESS.
- Existing B7A R1 non-live acceptance remains valid only for its accepted non-live/capability-provenance scope.
- Current live behavioral task: `SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01`; do not duplicate while unresolved.

## Status vocabulary

- `PASS_ALREADY_PROVEN`: exact-head automated suite or live evidence proves this bounded criterion.
- `RUNNABLE_NOW_NO_SEND`: can be checked against the live fixtures without a new Send; architect performs it before asking the owner.
- `WORK_SEND_REQUIRED`: requires the remaining Work behavioral Send / transient observation; not inferable from current read-only state.
- `TRANSIENT_NOT_RETRO_PROVABLE`: current DOM can show final state but cannot reconstruct a transient event such as busy/stop transition.
- `GAP_OUTDATED_CONTRACT`: current code/test authority conflicts with the current live UI/account contract and must be patched before live acceptance.
- `NOT_ACCEPTED`: evidence is insufficient for acceptance.

## Mandatory workflow

Use `TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md`. Collect current live DOM/page/tool evidence → enumerate the complete bounded tests → run every automatable test → collect failures → smallest correct patch → rerun affected tests and the complete required regression matrix → repeat until green → package/handoff only then.

The owner is not used as a manual test runner for anything an available tool can perform or observe.

# 1. Exact-head H3/Health automated inventory

## 1.1 `apps/health-runner/src/dedicated-health-session.test.ts`

Existing suite covers, among other cases:
- strict runtime-only absolute storage-state loading and opaque registry production;
- Work legacy `/chat/<uuid>` normalization to the old canonical project route;
- direct old Work project route acceptance;
- malformed/nested/wrong Work route rejection;
- generic Work `/c/<uuid>` rejection;
- missing config/start URL/auth/client/storage-state fields rejection;
- credential/query/hash URL rejection;
- relative storage path rejection;
- wrong Standard origin rejection;
- post-load source mutation isolation;
- opaque/non-forgeable registry/binding authority.

Automated exact-head status: `PASS_ALREADY_PROVEN` for the old non-live B7A session-provisioning contract.

Live compatibility status: `GAP_OUTDATED_CONTRACT` because the current fixed Work conversation is `https://chatgpt.com/c/6aab3f30-ebd0-83e9-a41e-26e6eb78b5e2`, while this suite explicitly treats Work `/c/<uuid>` as invalid.

## 1.2 `apps/health-runner/src/h2.test.ts`

Existing P8.3/H2 suite covers:
- explicit lifecycle and cleanup;
- concrete Chrome driver identity and ephemeral session kind;
- registered controlled-target-only resolution;
- rejection of unsafe schemes and embedded credentials;
- start-origin policy;
- rejection of injected raw selector/script authority;
- packaged contour order;
- ordered fallback selection;
- bounded observation timeout mapping;
- blocking-state uncertainty without false health state;
- structural misses without fabricated BROKEN;
- unexpected observation failure cleanup;
- bounded safe structural metadata;
- fresh ephemeral state across instances;
- no exposed raw Playwright/CDP handles;
- primary-document origin blocking policy.

Exact-head status: `PASS_ALREADY_PROVEN`. This is foundational/non-live and does not substitute for current live Work identity.

## 1.3 `apps/health-runner/src/h3-actions.test.ts`

Existing suite covers:
- deterministic packaged fixtures/target-key behavior independent of current URL;
- no-side-effect semantics for `IDENTIFY_SURFACE`;
- Work attachment remap to `ATTACHMENT_UPLOAD`;
- sequential Work configure behavior;
- Standard direct `FILE_UPLOAD` behavior;
- Work URL/structure preservation for non-upload steps.

Exact-head status: `PASS_ALREADY_PROVEN`.

## 1.4 `apps/health-runner/src/h3-contracts.test.ts`

Existing suite covers:
- exact H3 step names/order;
- exact Standard strategy sequence;
- exact Work strategy sequence including configure/upload distinction;
- exact packaged Health prompt and `BRIDGE_COMMAND_SMOKE_V1` ID;
- strict schemas and unknown-field rejection;
- deterministic action mapping;
- invalid target/step combinations fail closed;
- immutable/canonical target registry.

Exact-head status: `PASS_ALREADY_PROVEN`.

## 1.5 `apps/health-runner/src/h3-engine.test.ts`

Existing common B2 execution engine tests cover:
- accepted packaged sequence executes in order with one Send;
- pre-Send failure cleans up exactly once and never Sends;
- failed/thrown/uncertain Send is never retried;
- post-Send failure never resends;
- busy/response/completion timeouts never resend;
- cleanup failure is recorded without losing the primary failure;
- total run budget is bounded with no Send replay;
- injected/reordered raw actions are rejected before strategy execution;
- Standard and Work strategy isolation through one registry;
- target/surface mismatch rejection;
- exported engine surface remains semantic/bounded rather than raw click/fill/evaluate authority.

Exact-head status: `PASS_ALREADY_PROVEN`.

## 1.6 `apps/health-runner/src/standard-h3-profile.test.ts`

Existing tests cover:
- supported Standard `/c/<uuid>` and `/chat/<uuid>` identity normalization;
- wrong origin/unsupported route rejection;
- deterministic selector/helper metadata.

Exact-head status: `PASS_ALREADY_PROVEN`.
Current live Standard route `/c/6aab3f3b-0110-83ea-8d4c-8b57715c85ee` is structurally consistent with this contract.

## 1.7 `apps/health-runner/src/work-h3-profile.test.ts`

Existing tests cover the old Work route contract:
- old direct project route mapping;
- legacy `/g/g-p-<project>/c/<uuid>` mapping;
- wrong-host rejection;
- generic `/c/<uuid>` rejection;
- `/chat/<uuid>` rejection;
- project landing/malformed nested route rejection;
- explicit Work signals/model-independent selectors/upload metadata.

Exact-head suite status: `PASS_ALREADY_PROVEN` only for its old contract.
Live compatibility status: `GAP_OUTDATED_CONTRACT` because current Work is ordinary `/c/<uuid>` plus a positive semantic Work marker.

## 1.8 `apps/health-runner/src/h3-health-persistence.test.ts`

Existing mapper/persistence suite covers bounded sanitized H3 evidence and classification, including:
- Standard/Work PASS mapping into durable contour evidence;
- post-Send FAIL mapping without raw response details;
- pre-Send environment uncertainty mapping;
- C11 conversation-identity failure provenance for Standard and Work;
- timezone/chronology validation and reverse-time rejection;
- strict bounded observation vocabulary and toxic/raw-field rejection;
- primary/fallback provenance;
- DRIFT/DEGRADED/BROKEN/UNKNOWN classification cases;
- native-copy-only and required-core failure separation;
- sanitized evidence without prompt/response/cookie/token leakage.

Exact-head status: `PASS_ALREADY_PROVEN` for persistence/mapping behavior. It does not prove the current live Work selectors/route/model contract.

## 1.9 Other source tests

`apps/health-runner/src/index.test.ts` and `target-registry.test.ts` remain part of the exact-head Health unit suite and were included in the accepted exact-head CI/full Health run. They provide exported-surface and controlled-target registry regression coverage. Status: `PASS_ALREADY_PROVEN` for the exact accepted head.

# 2. Exact-head browser/E2E inventory

## 2.1 `tests/e2e/server/health-dedicated-session.spec.ts`

Seven browser tests prove:
- dedicated Standard synthetic storage state is consumed in a fresh controlled context;
- unconfigured target is rejected;
- no public runtime registry/direct binding API at package root;
- dedicated cookies do not leak into a new default driver;
- forged factory authority cannot consume synthetic state;
- a third `ChromeBrowserDriver` constructor argument has zero authority;
- forged plain registry is rejected before launch.

Exact-head status: `PASS_ALREADY_PROVEN` (B7A non-live provisioning/security only).

## 2.2 `tests/e2e/server/health-standard-h3.spec.ts`

The packaged Standard fixture tests cover at least:
- full real Standard strategy through common B2 engine with exactly one physical Send;
- fresh root without pre-Send conversation identity;
- existing bound conversation with stable identity;
- C11 provenance on conversation drift at validation;
- bounded fresh send when identity never binds;
- route/canonical conflict fails before Send;
- fixture bookkeeping independence;
- shipped Standard profile authority;
- Standard-only registry / Work resolution rejection;
- Stop control not confused with Send;
- historical assistant content not accepted as the new response;
- pre-Send fail-closed variants: Work surface, missing surface, missing/ambiguous/disabled composer, missing/ambiguous Send;
- environment blockers: login expired, CAPTCHA/security checkpoint, verification checkpoint, account blocked;
- post-Send one-Send/no-retry failures: identity changes, busy timeout, missing response, missing completion, missing code block, missing/mismatched copy, conversation change, missing delivery;
- completion-specific failures: stuck response busy, stale stop/other busy signals, empty generated response, identity change during completion.

Exact-head fixture status: `PASS_ALREADY_PROVEN`.
Live Standard status is separately evaluated below; fixture PASS is not treated as live PASS.

## 2.3 `tests/e2e/server/health-work-h3.spec.ts`

The packaged Work fixture tests cover at least:
- full Work through common B2 engine with exactly one physical Send;
- C11 provenance on conversation drift;
- Send precedence while generation state is active;
- semantic Work marker without header/banner markup;
- conversation text containing `Работа` does not make a valid marker ambiguous;
- mature code-local Copy control;
- Stop not confused with Send;
- fail-closed surface/composer gates: missing/content-only/ambiguous Work marker, Standard surface, no route shape, route/canonical conflict, missing/ambiguous/wrong-name/disabled composer, missing/ambiguous Send;
- Work never falls back to Standard and Standard rejects Work;
- Standard remains valid when `Работа` exists only in conversation content;
- bounded post-Send no-retry cases: busy/response/completion timeouts, historical response, stuck busy/stop combinations, empty response, route/conversation mutations, missing code surface, missing/mismatched code-local Copy, wrong response/table copy, missing delivery;
- bounded blockers: login expired, CAPTCHA/security checkpoint, verification checkpoint, account blocked.

Exact-head fixture status: `PASS_ALREADY_PROVEN` for the old packaged Work route/profile.
Live compatibility status: `GAP_OUTDATED_CONTRACT` because the fixture/profile authority does not represent the current live `/c/<uuid>` Work identity and there is no Luna model fence in the exact production strategy.

## 2.4 `tests/e2e/server/health-h2.spec.ts`

Exact-head H2 structural browser smoke is included in the accepted browser/CI evidence. Status: `PASS_ALREADY_PROVEN` for packaged structural fixtures; not a substitute for current live B7.

# 3. Current production Work implementation audit

Exact `apps/health-runner/src/work-h3-profile.ts` on `d4bae875…` currently declares:
- `workMarker = "Работа"`;
- route pattern only `/g/g-p-<project>/c/<uuid>`;
- `composerName = "Чат с ChatGPT"`;
- `emptyPlaceholder = "Работайте над чем угодно"`;
- `sendName = "Отправить промпт"`;
- expected send selector around `composer-submit-button` / `send-button`;
- code-local native Copy aria-label `Копировать`/`Copy`.

Exact `work-h3-strategy.ts` currently:
- requires positive Work marker;
- requires `resolveWorkRoute(...).kind === BOUND` before proceeding;
- verifies exact Work composer name/placeholder/form relationship;
- verifies prompt before one physical `send.click()`;
- tracks baseline assistant messages and identity;
- validates code/copy/conversation/delivery surfaces;
- contains **no `Luna` check and no model-control/model-family check** on this exact head.

Therefore there are two independently proven current Work blockers:

### GAP-WORK-ROUTE-01 — `GAP_OUTDATED_CONTRACT`
Current live Work fixture is `/c/6aab3f30-ebd0-83e9-a41e-26e6eb78b5e2`, but `resolveWorkRoute` only binds the old project-prefixed route. The current strategy would fail `IDENTIFY_SURFACE` on the live fixture even though the positive Work marker is present.

### GAP-WORK-MODEL-02 — `GAP_OUTDATED_CONTRACT`
Owner requires live Work Health to Send only when current model family is exact `GPT-5.6 Luna`, allowing an effort suffix such as `Средний`, without opening/changing the model picker. Current exact-head Work strategy has no model/Luna gate at all.

These gaps must be addressed by a later bounded patch/rework after the currently issued task/report state is resolved. Do not patch blindly on the architect control branch and do not duplicate the in-flight executor task.

# 4. Live Standard matrix — fixed fixture

Fixture: `https://chatgpt.com/c/6aab3f3b-0110-83ea-8d4c-8b57715c85ee`.

Read-only evidence was collected through the actual Opera Browser Connector after the behavioral tester stalled.

- Exact URL/conversation identity: `PASS_ALREADY_PROVEN` current live observation.
- Authenticated rendered conversation: `PASS_ALREADY_PROVEN` from accepted preflight/current page.
- C01 page identity / approved ChatGPT surface: `PASS_ALREADY_PROVEN` at current live state.
- C02 conversation/new assistant region exists: `PASS_ALREADY_PROVEN` current rendered conversation.
- C03 composer root/input: `PASS_ALREADY_PROVEN`; live accessibility exposes `textField` named `Чат с ChatGPT`.
- C13 obvious login/CAPTCHA/verification/account-blocked UI: no blocker observed in current live accessibility; `PASS_ALREADY_PROVEN` for this observation instant only.
- C04 exact packaged prompt insertion: `PASS_ALREADY_PROVEN` retrospectively as current user turn shows the canonical Health prompt verbatim; the insertion transition itself was not observed by architect.
- C05 exactly one physical Send: current DOM proves the turn exists but cannot independently reconstruct the physical click count; executor task/report or lower-level trace is still required for exact one-click provenance. `TRANSIENT_NOT_RETRO_PROVABLE`.
- C06 busy/start transition: `TRANSIENT_NOT_RETRO_PROVABLE` from final DOM.
- C07 one new assistant response after the Health turn: `PASS_ALREADY_PROVEN` in current DOM.
- C08 completion: final response is rendered and stable; final-state completion is `PASS_ALREADY_PROVEN`, but transient stop/busy sequence is not reconstructed.
- C09 code surface: `PASS_ALREADY_PROVEN`; one visible Health answer code surface carries exact `BRIDGE_HEALTHCHECK_V1`.
- C10 code-local native Copy: `PASS_ALREADY_PROVEN`; accessibility exposes `Копировать` adjacent to the code surface; response-level copy also exists separately.
- C11 final conversation identity stable: `PASS_ALREADY_PROVEN`; exact Standard URL remains unchanged.
- C12 exact delivery insertion path/state-transition provenance: current UI association is consistent but Opera accessibility alone does not prove the underlying production data attribute/transition trace. `TRANSIENT_NOT_RETRO_PROVABLE` unless executor/CDP evidence exists.
- Account mutations/model changes: no such mutation was performed by architect; accepted preflight had zero. Current live DOM does not independently prove the tester's complete action log.

Standard live output-shape verdict: `PASS_ALREADY_PROVEN` for the final observable output shape; full behavioral provenance remains incomplete because transient Send/busy/delivery transitions were not independently captured.

# 5. Live Work matrix — fixed fixture

Fixture: `https://chatgpt.com/c/6aab3f30-ebd0-83e9-a41e-26e6eb78b5e2`.

Current read-only Opera Connector evidence:
- exact URL/conversation: present and stable;
- positive `Работа` marker visible;
- model control accessible name `GPT-5.6 Luna Средний`;
- separate visible family text `GPT-5.6 Luna`;
- live composer accessibility `textField` name exactly `Чат с ChatGPT`;
- live empty placeholder exactly `Работайте над чем угодно`;
- live Send button exactly `Отправить промпт`;
- no new canonical Health prompt/response has been sent in Work.

Status by criterion:
- current live page/authenticated conversation: `PASS_ALREADY_PROVEN`;
- positive Work semantic marker: `PASS_ALREADY_PROVEN`;
- required model family `GPT-5.6 Luna` with effort suffix allowed: observed `PASS_ALREADY_PROVEN` as current UI fact;
- no model picker was opened by architect: `PASS_ALREADY_PROVEN` for architect actions; tester full action log still awaits final report;
- composer accessible name: `PASS_ALREADY_PROVEN` and matches current profile;
- empty placeholder: `PASS_ALREADY_PROVEN` and matches current profile;
- Send accessible name: `PASS_ALREADY_PROVEN` and matches current profile;
- production route binding: `GAP_OUTDATED_CONTRACT` — exact current strategy cannot bind the live `/c/<uuid>` route;
- production Luna/model fence: `GAP_OUTDATED_CONTRACT` — absent from exact current strategy;
- prompt insertion: `WORK_SEND_REQUIRED` / currently not run;
- Send-once: `WORK_SEND_REQUIRED` / currently not run;
- busy/start observation: `WORK_SEND_REQUIRED`;
- new assistant response: `WORK_SEND_REQUIRED`;
- completion: `WORK_SEND_REQUIRED`;
- exact Health token/code surface: `WORK_SEND_REQUIRED`;
- code-local native Copy on new response: `WORK_SEND_REQUIRED`;
- final conversation identity stability across Send: `WORK_SEND_REQUIRED`;
- delivery insertion path: `WORK_SEND_REQUIRED`.

Current Work live verdict: `NOT_ACCEPTED`.

# 6. Behavioral task/report state

`SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01` remains unresolved:
- Standard live output exists and final observable shape is independently verified;
- Work Health turn was not sent at last inspection;
- final executor/tester report was not present in the control/report conversation at last inspection.

Do not create a second overlapping behavioral task. When the final report arrives, architect must review it against this matrix, update cursor, and then obey the owner's explicit stop: no next executor prompt; prepare the comprehensive new-dialogue handoff instead.

# 7. Required future patch scope after the handoff/review boundary

This is a finding, not current authorization to publish production code.

A correct later Work B7 patch/rework must at minimum:
- redesign Work identity so the fixed `/c/<uuid>` route can be bound only when a positive Work marker proves Work ownership;
- preserve exact conversation UUID continuity and fail closed on drift;
- keep generic Standard `/c/<uuid>` distinct from Work through positive semantic Work ownership rather than route prefix alone;
- add read-only model-family detection and require exact family `GPT-5.6 Luna`, while allowing an effort suffix such as `Средний`;
- never open or change the model picker;
- add RED tests for current `/c/<uuid>` Work route and Luna-with-effort-suffix behavior before GREEN implementation;
- retain all existing no-retry/one-Send/blocker/code-local-Copy/identity security regressions;
- rerun the entire relevant Health unit suite, dedicated browser suite, Standard H3 browser suite, Work H3 browser suite, PostgreSQL/integration/migrations where required by Server CI, lint, format, typecheck, build, OpenAPI/bridge guards and canonical E2E;
- rerun read-only live Standard/Work evidence after the patch before any live Send;
- only then perform the bounded live Work Send and final B7 acceptance evidence.

B7/P8.4 remains NOT_ACCEPTED until this is closed with valid live evidence.