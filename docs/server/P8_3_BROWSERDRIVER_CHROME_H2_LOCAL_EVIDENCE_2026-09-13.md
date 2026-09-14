# P8.3 BrowserDriver / controlled Chrome H2 local evidence

TECHNICAL_ID = `PRODUCT-CONTROL-PLANE-P8_3-BROWSERDRIVER-CONTROLLED-CHROME-H2-IMPLEMENTATION-2026-09-13`

## Identity and scope

- Remote branch readback: `a8fedac5532e9d984248a871899d04d1d8679676`.
- Remote tree readback: `e8971cf2d34136162c8937ae8296cf0148d84ba4`.
- Implementation base: `a8fedac5532e9d984248a871899d04d1d8679676`.
- Base tree: `e8971cf2d34136162c8937ae8296cf0148d84ba4`.
- Isolated worktree: `/opt/product-control-plane-src/blood_sand-p8.3-browserdriver-chrome-h2`.
- Authority read: ROADMAP, HEALTH_SYSTEM, ARCHITECTURE, SECURITY,
  TEST_STRATEGY, ADR-0003, ADR-0031, ADR-0036, ADR-0037, and P8.2 remote
  acceptance, plus the named health-runner/Health/adapter/DB/E2E/toolchain
  files.

## Implementation

Changed implementation paths are under `apps/health-runner`:

- `BrowserDriver` keeps browser family independent and exposes only lifecycle,
  target-key navigation, runtime metadata, packaged strategy observation, and
  ephemeral cleanup. Playwright Browser/Context/Page/Locator types stay
  private to the implementation.
- `ChromeBrowserDriver` uses real Playwright Chromium, headless ephemeral
  contexts, no permissions, downloads disabled, bounded timeouts, guarded
  origins, and clean shutdown. No Yandex driver was added.
- `ControlledTargetRegistry` validates credential-free HTTP(S) definitions,
  browser family, allowed origins, bounded navigation timeouts, and rejects
  unsafe schemes, invalid origins, duplicates, and unregistered keys.
- H2 plans are strict schemas over target keys, baseline contours, packaged
  strategy IDs, structural assertion IDs, ordered fallback IDs, and bounded
  timeouts. Unknown fields and URL/selector/script/credential/storage/
  filesystem/provider-command authority are rejected. Locator behavior is
  compiled packaged code.
- H2 reports contain level, target key, runtime metadata, timings, primary and
  ordered fallback attempts, selected strategy, bounded safe structural
  metadata, structural assertion outcomes, and environment uncertainty. They
  contain no final `HealthState`, behavioral result, full DOM/HTML/text,
  cookie/storage content, credentials, headers, screenshots, or persistence
  reference.

H2 is read-only: no input fill, prompt insertion, keypress, Send/Copy click,
form submit, upload/download, bridge command, new-prompt response wait, or
provider mutation. P8.3 does not call `classifyHealth()` or
`persistCompletedHealthRun()`. Screenshot evidence is deferred to P8.4.

## Acceptance results

- Focused unit baseline: 1 health-runner test.
- Focused unit final: 20 passed, 0 failed, 0 skipped, one final run; delta +19.
- Full unit: expected and actual 1,259 (baseline 1,240 +19), PASS; nested
  Bridge guard PASS.
- Full integration: 1,507 passed, 0 failed, 0 skipped, one run, on disposable
  PostgreSQL18.
- Focused real-browser file: `server/e2e/health-h2.spec.ts`.
- Final focused browser gate: 6 collected, 6 passed, 0 failed, 0 skipped,
  retries 0, one final post-fix run. Real Chromium was used against a
  `127.0.0.1` dynamic-port HTTP fixture.
- Cases passed: primary structural match; deterministic fallback selection;
  required structural miss without final health claim; CAPTCHA/security
  checkpoint uncertainty; unsafe cross-origin redirect rejection; and fresh
  ephemeral-context cookie isolation.
- Fixture mutation counters: `H2_MUTATING_ACTIONS = 0`; all observed fixture
  requests were GET; no provider or AI account was contacted.
- Historical gate notes: one initial DB container attempt used the wrong
  PostgreSQL18 tmpfs mount and exited before Playwright; it was removed and the
  setup was corrected. Two pre-final browser invocations exposed fixture/guard
  defects (3/6, then 5/6); bounded source fixes were applied and the final
  6/6 run passed. No blind retry was used.
- Full E2E was not executed. Non-executing collection was 78 total: baseline
  72 plus 6 P8.3 tests.

Static gates all passed in the final sequence: format, lint, typecheck,
OpenAPI check, and build. The first lint attempt found and then fixed one
mechanical `prefer-const` fixture issue; the final lint included Bridge guard.
OpenAPI remains 102 operations with SHA-256
`9563c57d622a7eee2197ea9a0508852f7c7a0aef87bbb9dddf5570cc83b50cc7`.

## Boundaries and audit

- `server/packages/health/src/classifier.ts`: unchanged.
- `server/packages/db/src/health-persistence-repository.ts`: unchanged.
- P8.2 migration 0015: unchanged; no 0016 exists.
- Migration range: `0000..0015`.
- Migration 0014 SHA-256:
  `4a12aa34d6be16648fc6cd12b4f3de04f3cce0f3abd6938918905dfa2c471558`.
- Migration 0015 SHA-256:
  `212888c0972c1905b5306add1cdd45a70f2152148cecf73c829cc8c0b11ebcb9`.
- P8.2 persistence changed: `NO`.
- API/OpenAPI, admin, portal product UX, workflow, Bridge, scheduler,
  incidents, notifications, P8.4+, P9, and P13: unchanged/not started.
- Provider calls: `0`; live AI browser calls: `0`; H3 message sends: `0`.
- Roadmap: P8.3 is `ACTIVE / LOCAL CANDIDATE`; P8.4 remains `PLANNED`.
- Commit: `0`; push: `0`.

The exact staged candidate tree, patch/archive hashes, and independent
reconstruction hashes are recorded in the accompanying freeze manifest after
explicit staging. This candidate is safe for independent review, not final
local acceptance, commit, or push.

## Corrective Attempt2 update

- Independent Review1: `FAIL` — CRITICAL 0, HIGH 2, MEDIUM 0, LOW 0.
- R1-HIGH-001: popup/new-page origin escape; corrected locally, re-review
  pending.
- R1-HIGH-002: raw Playwright handle escape; corrected locally, re-review
  pending.
- Attempt2 corrections: BrowserContext-wide top-level navigation routing and
  main-frame validation reject secondary pages/popups and unapproved primary
  navigation; Browser/BrowserContext/Page handles use ECMAScript runtime
  private fields.
- New regressions: runtime public-surface raw-handle audit and real Chromium
  `POPUP_CROSS_ORIGIN_BLOCKED` with two loopback origins.
- Attempt2 implementation candidate tree after correction (before this
  evidence hash append): `08d9bc5656db79091cde41510eaa527047ba370e`.
- QA results: focused unit `21 PASS / 0 FAIL / 0 SKIP`; focused Chromium `7/7
  PASS`, retries `0`; popup unapproved document hits `0`, secondary pages left
  `0`, violation surfaced `YES`; full unit `1260 PASS / 0 FAIL / 0 SKIP` with
  Bridge guard PASS; full integration `1507 PASS / 0 FAIL / 0 SKIP`; E2E
  inventory `79` total and `7` P8.3, full E2E not run; format, lint, typecheck,
  OpenAPI, and build PASS.
- Re-review: `PENDING`.
- P8.3 local state: `ACTIVE / LOCAL CANDIDATE`.

## Corrective Attempt3 evidence

- Attempt2 tree: `bd71d2eeb69d1af7756019d6b95eea603e9ecf2e`.
- Attempt2 re-review: `FAIL`; five redirect destination hits were observed
  before the unsafe diagnostic, one each for HTTP 301, 302, 303, 307, and
  308. An immediate cross-origin meta refresh initially returned success
  before its later unsafe diagnostic. R1-HIGH-001 remained open; R1-HIGH-002
  was closed.
- Pre-code proof: real Chromium with a private Playwright
  `browserContext.newCDPSession(page)` and fixed `Page.enable`,
  `Page.getFrameTree`, `Fetch.enable`, `Fetch.continueRequest`,
  `Fetch.failRequest`, and `Fetch.disable` calls. Request-stage pauses use
  the captured primary frame ID and block only disallowed primary
  `Document` requests. All five redirect statuses and meta refresh produced
  zero Origin-B document hits.
- Attempt3 implementation: the CDP session and primary frame ID are stored
  in ECMAScript runtime-private fields inside `ChromeBrowserDriver`; no CDP
  capability is added to `BrowserDriver`. Context-wide popup/new-page policy
  remains intact. A private per-session unsafe-navigation latch and bounded
  350 ms stabilization window prevent durable success after a known unsafe
  navigation.
- Focused unit: Attempt2 `21`; Attempt3 `22`; delta `+1`; all passed with no
  skips.
- Focused real Chromium: `13/13` passed, `0` failed, `0` skipped, retries
  `0`; 301/302/303/307/308 and meta refresh all had zero destination hits;
  popup destination hits remained zero and secondary pages left remained
  zero. Chromium was `151.0.7922.34`; child Node was `v24.20.0`.
- Full unit: `1261/1261` passed, `0` failed, `0` skipped; Attempt2 baseline
  was `1260`, exact delta `+1`; Bridge guard passed.
- Full integration: `1507/1507` passed, `0` failed, `0` skipped, on fresh
  PostgreSQL `18.0` with tmpfs-only storage.
- Full E2E was not executed. Non-executing inventory: `85` total, baseline
  `72`, P8.3 `13`; no baseline disappearance.
- Independent post-build sanity probe used the public built health-runner
  entry and recorded zero total unapproved destination hits across all six
  cases. It was temporary and is not in Git.
- Static/QA: format, lint, Bridge guard, typecheck, OpenAPI check, and build
  passed. OpenAPI remained `102` operations with SHA-256
  `9563c57d622a7eee2197ea9a0508852f7c7a0aef87bbb9dddf5570cc83b50cc7`.
- Boundaries unchanged: migrations `0000..0015`, no `0016`, classifier delta
  `0`, P8.2 persistence delta `0`, API/admin/Bridge/workflow deltas `0`,
  provider calls `0`, live AI browser calls `0`, and P8.4 not started.
- Attempt3 status: `CORRECTED LOCALLY / RE-REVIEW PENDING`; local state remains
  `ACTIVE / LOCAL CANDIDATE`. No local acceptance, commit, push, or
  independent re-review was performed.
- Attempt3 candidate tree: `8408b7935738559d9d90cf66065e55a28a6d475b` before
  this final evidence refresh; the freeze below was regenerated after the
  evidence append.

## Final local acceptance

The corrected migration authority was reconciled before the final-local gate.
The checked-in P8.2 acceptance document is authoritative. No migration was
edited, and the product candidate remained unchanged.

- Reviewed product tree before acceptance-document materialization:
  `20ae8f508ad1c5ebe22755b048490e14bdb6b7a6`.
- Base commit/tree:
  `a8fedac5532e9d984248a871899d04d1d8679676` /
  `e8971cf2d34136162c8937ae8296cf0148d84ba4`.
- Independent Review1 record: `/var/backups/product-control-plane/git/blood_sand-p8.3-attempt3-independent-review1-2026-09-13.txt`;
  10,172 bytes; SHA-256
  `8551ccdfe1c62db19117726980530cee542c2da0b7d599aaa34621323689ede9`.
- Review1: `PASS`; CRITICAL `0`, HIGH `0`, MEDIUM `0`, LOW `0`;
  R1-HIGH-001 `CLOSED`; R1-HIGH-002 `CLOSED`.
- Runtime: child Node `v24.20.0`; pnpm `10.34.5`.
- Immediate preconditions: free-space hard floor `PASS`; ports 3100, 3200,
  and 3300 `CLEAR`; fresh PostgreSQL `18.0` loopback E2E database `READY`.
- E2E inventory: `85` total = baseline `72` + P8.3 `13`.
- Full E2E: exactly one run; collected `85`, passed `85`, failed `0`, skipped
  `0`, interrupted `0`, not run `0`, retries `0`, run count `1`.
- Provider calls `0`; live AI browser calls `0`; Bridge changed `NO`;
  P8.4 started `NO`.

Final local state is `ACTIVE / LOCAL ACCEPTED / REMOTE ACCEPTANCE PENDING`.
This document records local acceptance only and does not authorize commit or
push.

## Publication and remote-acceptance materialization

PUBLICATION_SHA = `d96bee078f640f64bcc32608341f2d68ca9afb8f`

PUBLICATION_TREE = `59379c24f3568958fa942741358e4b14aeecd792`

CI99 = `FAILED`

CI99 baseline admin-ai failure = `60-second Complete-rollout timeout`

CI99 P8.3 H2 = `13/13 PASS`

Exact-d96 local diagnostic = `85/85 PASS / NO REPRO`

Exact-d96 GitHub rerun = `NOT EXECUTED / ACTIONS WRITE PERMISSION BLOCK`

Docs-only trigger SHA = `4ab4eca5e5e5661943732d1de2e2432dddda2ea9`

Executable/test/schema/workflow delta on trigger = `0`

Trigger Server CI run = `34754180128 / run 100 / PASS`

Trigger E2E = `85/85 PASS`

Trigger P8.3 H2 = `13/13 PASS`

Equivalent product-tree CI revalidation = `PASS`

REMOTE_ACCEPTANCE_MATERIALIZATION = `IN PROGRESS / EXACT DOCS COMMIT CI PENDING`

P8.4_STARTED = `NO`

Provider calls = `0`

Live AI browser calls = `0`

No future remote-acceptance commit SHA is recorded here because it does not
exist until commit creation.

## Final remote-acceptance adjudication

- First remote-acceptance materialization SHA:
  `483658ff29a58f43628bb024f570f5880a4a420d`.
- CI101: `FAILED`, E2E `84/85`; P8.3 H2 `13/13 PASS`.
- The CI101 P3.6 failure was later proven to be a test-only probabilistic
  no-op tamper, not a production defect.
- The CI99 admin-ai failure was later proven to be a test synchronization
  defect, not an admin-AI API or product defect.
- P8.3 product correction: `NO`.
- Combined test-correction candidate tree:
  `fa770534d6737c4058f5b4475c513bc67367d7f4`.
- Combined correction full E2E: `85/85 PASS`.
- Test-stabilization publication SHA:
  `130e3f1bd9cffc28b5ac799c87173fac96d9adf2`.
- CI102 run `34794830667`: `PASS`, E2E `85/85`.
- CI102 corrected P3.6: `PASS`.
- CI102 corrected admin-ai owner flow: `PASS`.
- CI102 P8.3 H2: `13/13 PASS`.
- Migrations unchanged; classifier unchanged; P8.2 persistence unchanged;
  Bridge unchanged.
- Provider calls: `0`; live AI browser calls: `0`.
- P8.4: `NOT STARTED`.

`FINAL_REMOTE_ACCEPTANCE_REMATERIALIZATION = CANDIDATE / FINALITY REQUIRES
THIS DOCS COMMIT EXACT-SHA CI PASS`.
