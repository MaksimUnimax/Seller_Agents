# SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01

Roadmap: P8.4 / B7_CONTROLLED_LIVE_H3 — B7A dedicated-session provisioning security rework

This is a bounded implementation correction. The architect already proved the cause and selected the solution. Do not investigate/redesign it.

## Repository / exact base

Repository: MaksimUnimax/runtime-fixtures
Stable repository ID: 1369117174
Branch: feature/server-health-h3-p8-4
Required exact remote/start base: 592b51da31ab5ecfd0e4d4b3e981897849731614
Expected tree: 1e4737933665a6ba6d02e491e7873d3f40e47e6f
Expected parent: 90c1e0c66a47692634eb652aa1392fdafc1f8f10
Current main at architect review: bc718cc5c677ad0eb4598e7de3ad766473ff0847

The base is the rejected B7A candidate. Do NOT reset/revert it wholesale and do NOT rewrite history. Correct it with bounded commits on the same branch.

First fetch refs. Require local/remote Health exact base and a clean worktree. If remote moved, local diverged, or another implementation task is active: STOP and report. No reset/rebase/stash/cherry-pick/amend/force/replacement branch.

Read in full before editing:

- docs/development/architect-autowork/references/HEALTH_B7A_R1_SECURITY_REVIEW.md from the architect control branch;
- the original B7A task for preserved non-goals/acceptance boundaries.

## Proven defect

The current loader validates dedicated config/state files correctly, but runtime provenance is not enforced:

- package root exports a constructible DedicatedHealthSessionRegistry runtime class and the structural DedicatedHealthSessionBinding type;
- ChromeBrowserDriver accepts an optional third dedicatedBinding argument;
- createDedicatedHealthChromeBrowserDriver accepts a binding object directly;
- current E2E standardBinding/workBinding helpers fabricate plain objects and successfully inject storage state without calling loadDedicatedHealthSessionRegistry;
- launch() consumes binding.storageStatePath through browser.newContext before open() performs target/start-URL checks.

Therefore strict loader checks are optional and arbitrary accessible storage state, including a customer/owner state file, can be injected by a fabricated binding. This violates the accepted no-customer-session / dedicated-Health-only security boundary.

The defect originated in the architect task design. Do not blame or compensate with unrelated refactors.

## Required architecture

### A. Loader-created opaque capability only

In apps/health-runner/src/dedicated-health-session.ts:

1. Preserve all existing strict config/state/Work URL validation and bounded error behavior.

2. Replace the publicly constructible/sensitive registry model with an opaque loader-created capability.

3. Keep sensitive target bindings in a module-private WeakMap keyed by registry objects created only after loadDedicatedHealthSessionRegistry has successfully completed every validation.

4. Public/root API may expose DedicatedHealthSessionRegistry as a TYPE only. It must not expose a runtime class that a caller can instantiate to create authority.

5. The public registry object must not expose resolve() or any other method/property that returns storageStatePath or Work startUrl. A safe constant version marker / safe configured-target metadata is allowed only if needed, but no sensitive value may be enumerable/serializable.

6. Add one module-internal resolver used by browser-driver.ts. It receives the registry object and target key, checks the module-private WeakMap, and returns the hidden validated binding only when the registry was actually produced by loadDedicatedHealthSessionRegistry.

7. A forged plain object cast to DedicatedHealthSessionRegistry must fail with one closed safe error code, e.g. UNTRUSTED_SESSION_REGISTRY, with message equal only to the code.

8. Missing configured target remains a separate bounded TARGET_NOT_CONFIGURED failure.

The internal resolver may be exported from the source module only for browser-driver.ts, but MUST NOT be re-exported from apps/health-runner/src/index.ts.

### B. No direct injection on ChromeBrowserDriver

In apps/health-runner/src/browser-driver.ts:

1. Restore the public constructor shape to the pre-B7A form:

- ChromeBrowserDriver(targets, launchTimeoutMs?)

There is no third binding/options/session argument.

2. Add a module-private WeakMap<ChromeBrowserDriver, DedicatedHealthSessionBinding> (or equivalent module-private capability association).

3. Only createDedicatedHealthChromeBrowserDriver may populate that WeakMap.

4. launch() obtains dedicated state only from that private association. A raw JavaScript caller passing a third constructor argument must not attach storage state.

5. Preserve fresh browser.newContext({ acceptDownloads:false, storageState:... }) for trusted dedicated drivers and the unchanged anonymous context for default drivers.

6. Preserve sessionKind EPHEMERAL_CONTROLLED, no writeback, no persistent userDataDir, no raw Playwright-handle exposure, and all existing navigation/popup/CDP protections.

### C. Dedicated factory accepts registry + target key

Change public factory to exactly this authority shape (naming/types may follow code style but semantics are fixed):

createDedicatedHealthChromeBrowserDriver(
  targets,
  registry,
  targetKey,
  launchTimeoutMs?,
)

It MUST NOT accept a direct binding, storageStatePath or startUrl.

The factory resolves the hidden binding only through the internal trusted-registry resolver, associates it privately with the new driver, and returns the driver.

A forged registry must be rejected before browser launch or any state-file consumption.

A registry lacking the requested target must be rejected before browser launch/navigation.

### D. Root exports

In apps/health-runner/src/index.ts:

- keep createDedicatedHealthChromeBrowserDriver;
- keep loadDedicatedHealthSessionRegistry;
- keep DedicatedHealthSessionConfigError and its safe error-code type;
- export DedicatedHealthSessionRegistry only as a type/opaque contract if consumers need it;
- stop re-exporting DedicatedHealthSessionBinding;
- do not export any internal resolver, binding constructor, secret/path accessor or runtime registry constructor.

## Mandatory RED before production correction

First modify only tests inside the existing B7A test allowlist. Do not touch production yet.

Add two stable security regressions using synthetic temporary storage-state files and loopback only. Use runtime casts where needed so the same tests compile against pre-fix and post-fix API shapes.

RED-1 — forged factory authority:

- fabricate a plain object containing targetKey + synthetic storageStatePath, without loadDedicatedHealthSessionRegistry;
- invoke createDedicatedHealthChromeBrowserDriver through a runtime-compatible cast;
- desired assertion: forged authority is rejected before state consumption/navigation and the loopback server receives no synthetic cookie/request attributable to that forged dedicated state.

On the current base this MUST fail for the proven reason: the fabricated binding is accepted and its storage-state cookie is consumed.

RED-2 — third constructor argument:

- instantiate ChromeBrowserDriver through a runtime cast with a third fabricated binding argument;
- run against the Standard loopback target;
- desired assertion: the extra argument has no authority and the request contains no synthetic dedicated cookie.

On the current base this MUST fail because the current constructor consumes the third binding.

Valid RED requires both failures to be due to actual synthetic cookie/session injection from the forged objects. Setup/type/browser/network failures are invalid RED and require STOP/report.

Record bounded sanitized RED evidence. No real credentials/paths in published evidence.

## Post-fix deterministic tests

Update existing B7A unit/E2E tests to the corrected API.

Required proof:

1. Standard positive path is now:
   temporary config file -> loadDedicatedHealthSessionRegistry -> opaque registry -> createDedicatedHealthChromeBrowserDriver(registry,targetKey) -> fresh Chromium context -> synthetic loopback cookie consumed.

2. Default ChromeBrowserDriver remains cookie-isolated after dedicated driver close.

3. Forged plain registry object is rejected before launch/state consumption.

4. Direct third constructor argument has zero authority and cannot inject storage state.

5. Root package runtime does not expose a constructible DedicatedHealthSessionRegistry authority. If tested by namespace reflection, the runtime export must be absent.

6. Root package does not expose a direct binding/session-path injection API.

7. Missing target in a real loader-created registry fails boundedly before launch/navigation.

8. Valid Work-only production config still loads only with exact https://chatgpt.com approved origin, no credentials/query/hash, parseWorkRoute-valid project+UUID route, and restrictive state-file checks.

9. Work route/path/state values remain inaccessible through public registry serialization/output.

10. Existing invalid Work URL/file/schema/permission/symlink/duplicate-state tests remain green.

11. Do NOT preserve the old positive loopback Work test that fabricates a binding. Replace it with loader/route-authority tests that make zero live provider calls. Actual authenticated Work navigation is B7 live acceptance, not R1.

12. H2/H3 plan schemas still reject raw storageStatePath/startUrl/session authority.

13. One-Send/no-resend, Standard/Work strategy semantics, persistence sanitization and BrowserDriver navigation firewall remain unchanged.

All state/cookies/identifiers are synthetic temporary test data.

## Focused validation

After valid RED and production fix, run at minimum:

1. pnpm --filter @product/health-runner exec vitest run src/dedicated-health-session.test.ts src/h2.test.ts src/h3-contracts.test.ts src/h3-actions.test.ts src/h3-engine.test.ts src/h3-health-persistence.test.ts
2. pnpm --filter @product/health-runner typecheck
3. pnpm bridge:guard
4. focused tests/e2e/server/health-dedicated-session.spec.ts plus existing health-h2.spec.ts, health-standard-h3.spec.ts and health-work-h3.spec.ts under canonical Playwright config with PRODUCT_CONTROL_PLANE_E2E=1
5. focused tests/integration/server/h3-health-persistence.integration.test.ts with disposable PostgreSQL

All required cases must pass with zero required skips.

Because production security-boundary code changes, run one full final server acceptance cycle after focused GREEN:

- pnpm lint
- pnpm format:check
- pnpm typecheck
- pnpm exec vitest run tests/e2e/server/playwright-config-regression.test.ts
- pnpm test
- pnpm test:integration
- pnpm db:migrate
- pnpm openapi:check
- pnpm bridge:guard
- pnpm build
- install Chromium only if needed
- pnpm test:e2e
- pnpm docs:check

Record actual totals/skips. Do not repeat green gates after unchanged code.

ZERO live ChatGPT/provider/marketplace/customer-session calls.

## Evidence correction

Update only the existing B7A evidence/report paths already in the allowlist. Do not rewrite B8 or older accepted evidence.

The B7A report/evidence must explicitly record:

- architect rejected candidate 592b51d... because the direct structural binding path bypassed loader authority;
- this was an architect-design defect, not a provider/runtime live failure;
- exact valid RED showing both bypasses on 592b51d...;
- corrected opaque registry/capability architecture;
- post-fix focused and full-cycle results;
- no real secrets/paths/Work route/cookies in evidence;
- B7 actual live behavioral acceptance remains NOT RUN;
- remaining external prerequisite after R1 remains owner-provisioned dedicated Health auth state/config for Standard and Work plus approved dedicated Work project/conversation route, all outside Git.

Publication self-reference fields may remain bounded historical/pre-publication metadata; final remote SHA/CI authority will be architect readback.

## Allowed changed paths

ONLY the same eight candidate paths:

- apps/health-runner/src/dedicated-health-session.ts
- apps/health-runner/src/dedicated-health-session.test.ts
- apps/health-runner/src/browser-driver.ts
- apps/health-runner/src/index.ts
- tests/e2e/server/health-dedicated-session.spec.ts
- docs/server/B7A_DEDICATED_HEALTH_SESSION_PROVISIONING_2026-09-16.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/README.md
- docs/server/evidence/health-b7a-session-provisioning-2026-09-16/results.json

No new path is authorized.

Explicitly forbidden:

- package/dependency/lockfile changes;
- .env/.env.example or secret/session/config files in Git;
- target-registry packaged target changes;
- H2/H3 plan schema widening;
- Standard/Work strategy/profile semantic changes;
- shared contracts/OpenAPI/API/DB/migrations;
- B1-B8 evidence rewrites;
- README.md, AGENTS.md, docs/README.md, CHANGELOG.md, docs/ROADMAP.md, SERVER_CODEX_HANDOFF.md;
- site/SEO/domain/private workspace-control;
- I1/C2/S1/D3/extension work;
- customer/owner browser-session reuse;
- provider login automation;
- CAPTCHA/anti-bot/auth/geoblock bypass;
- live provider calls.

If another path is genuinely required, STOP and report exact contradiction rather than widening scope.

## Publication

Diff must be reviewed against exact base 592b51da31ab5ecfd0e4d4b3e981897849731614 and remain within the eight-path allowlist with zero secret material.

Create bounded correction commit(s) on the same Health branch; do not amend/rewrite the rejected candidate.

Immediately before push fetch origin and require remote Health still exactly 592b51da31ab5ecfd0e4d4b3e981897849731614. If moved: STOP. No rebase/reset/force.

Normal fast-forward push only. HTTPS credential fallback may use the already-approved one-shot GitHub SSH-over-443 route without changing stored repo config or disabling host-key verification.

No force, replacement branch, PR, main merge, deployment or release.

After push verify remote exact final and clean worktree. Report immediately observable Server CI run/job/status and STOP. Architect handles exact-head CI acceptance.

## Terminal report

Return:

- task ID / B7A R1 coordinate;
- exact initial refs;
- valid RED commands/results proving forged factory + third-constructor injection on 592b51d...;
- exact corrected public/internal API shape;
- focused tests with counts/skips;
- full final cycle with counts/skips;
- exact final SHA/tree/parent/commit list;
- exact eight-path diff/stat and allowlist result;
- evidence correction summary;
- remote before/after push;
- immediate CI run/job/status;
- clean worktree;
- zero real auth/session/config data;
- zero live ChatGPT/provider/marketplace/customer-session calls;
- zero login/CAPTCHA/security bypass;
- zero reset/rebase/stash/cherry-pick/amend/force/main merge/deploy/release;
- B7A R1 pending architect/exact-head CI acceptance;
- B7 live behavioral acceptance NOT RUN;
- remaining external prerequisite unchanged;
- P8.4 NOT_ACCEPTED;
- P8.5 NOT_STARTED.

Do not self-accept B7A. Do not start live B7 or P8.5. STOP after terminal report.
