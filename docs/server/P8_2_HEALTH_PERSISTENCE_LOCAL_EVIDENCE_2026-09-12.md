# P8.2 Health Persistence — Local Evidence — 2026-09-12

`TECHNICAL_ID = PRODUCT-CONTROL-PLANE-P8_2-RESOURCE-RECOVERY-AND-EXECUTION-2026-09-12`

## Authority and resource recovery

- canonical remote branch head verified by HTTPS `git ls-remote`:
  `f153ef2c8cd2baccd676c2f28166d181b1d83ae2`;
- canonical tree: `60fda619217839ecd8c9aeb0469d91fd8db729ee`;
- `FREE_BYTES_START = 8504975360`;
- `FREE_BYTES_P8_2_START = 8835481600`;
- `TOTAL_FREE_BYTES_GAIN = 330506240`;
- hard floor: `8589934592` bytes;
- cleanup stopped immediately after reaching the floor.

Deleted authorized targets:

- `/root/.npm/_logs`;
- the three `.deb` files directly under `/var/cache/apt/archives/`;
- `/opt/product-control-plane-src/blood_sand-p8.1-health-foundation-attempt3/server/node_modules`.

Retired through Git worktree machinery:

- `blood_sand-p8.1-remote-acceptance`;
- `blood_sand-p8.1-final-local-acceptance`;
- `blood_sand-p8.1-health-foundation-attempt3`.

Attempt3 freeze hashes were reverified before retirement. P8.1 freeze files
remain under `/var/backups/product-control-plane/git/`.

## Implementation

P8.2 adds exactly migration `0015_p8_2_health_persistence.sql` and the
following persistence boundary:

- validated immutable Health suite revisions;
- immutable completed Health runs;
- exact P8.1 contour results;
- safe evidence-reference metadata only;
- incident schema primitive with physical constraints only;
- bounded internal repository reads;
- one atomic completed-run transaction;
- P7 adapter/surface/variant/profile revision hierarchy validation.

`@product/health` remains pure. `@product/db` depends on it through the only
narrow workspace dependency required by P8.2.

## Required gate results

- frozen install: PASS (`pnpm 10.34.5`, Node `v24.20.0`);
- migration run 1: PASS;
- migration run 2: PASS/idempotent;
- migration range: `0000..0015`;
- `0014_p7_2_profile_assignments_lifecycle.sql` SHA-256:
  `4a12aa34d6be16648fc6cd12b4f3de04f3cce0f3abd6938918905dfa2c471558`;
- `0015_p8_2_health_persistence.sql` SHA-256:
  `212888c0972c1905b5306add1cdd45a70f2152148cecf73c829cc8c0b11ebcb9`;
- unit: PASS, `1240` total, delta `0`, failures `0`, skips `0`;
- integration: PASS, `1505` total, delta `+18`, failures `0`, skips `0`;
- P8.2 integration file: `18/18` PASS;
- format check: PASS;
- lint and nested Bridge guard: PASS;
- typecheck: PASS;
- OpenAPI: PASS, `102` operations, SHA-256
  `9563c57d622a7eee2197ea9a0508852f7c7a0aef87bbb9dddf5570cc83b50cc7`;
- build: PASS (API, worker, health-runner, portal, admin);
- full E2E: NOT RUN by instruction.

No commit or push is authorized by this task.

## Scope guard

No BrowserDriver, Playwright Health runtime, live AI, ChatGPT navigation,
controlled-account login, scheduler, queue/cron, incident lifecycle, external
notification, object storage, screenshot capture, raw DOM capture, admin
route/UI, public API, P7 availability hook, automatic rollback, Bridge edit or
P8.3+ implementation was added.

## Next step

INDEPENDENT REVIEW OF P8.2 HEALTH PERSISTENCE.

## Freeze

- base commit: `f153ef2c8cd2baccd676c2f28166d181b1d83ae2`;
- patch, added archive, manifest, candidate tree and both reconstruction trees
  are recorded with bytes and SHA-256 in
  `/var/backups/product-control-plane/git/blood_sand-p8.2-health-persistence.manifest.txt`;
- double reconstruction: PASS;
- protected main: unchanged;
- provider calls: `0`;
- live browser calls: `0`;
- commit: `0`;
- push: `0`.

## Attempt2 corrective chronology — 2026-09-13

- Independent Review1 = FAIL;
- reviewed tree = `ea02862cdc76778f2d901665db43005201567382`;
- findings = `R1-MEDIUM-001`, `R1-MEDIUM-002`;
- implementation source changed = NO;
- migration changed = NO;
- schema changed = NO;
- repository changed = NO;
- dependencies changed = NO;
- lockfile changed = NO;
- corrective tests added = `2`;
- focused corrective execution = PASS, `20/20`;
- at this chronology point, findings were not yet claimed closed and fresh
  Independent Review1 remained pending; the final re-review is recorded below.

## Complete E2E acceptance chronology — 2026-09-13

The following history is preserved without relabeling earlier events:

- Full E2E Attempt1 = FAIL: `72` collected, `19` pass, `1` fail, `1`
  interrupted, `51` not run, retries `0`; failure was `admin-ai.spec.ts`
  timeout at `60000ms`; exact test title was not recovered.
- Diagnostic1 = INVALID_FOR_PRODUCT: `0` test bodies; the mandatory
  `PRODUCT_CONTROL_PLANE_E2E=1` interlock was omitted.
- Diagnostic2 = PASS: `admin-ai.spec.ts` `3/3`, retries `0`; the original
  timeout was not reproduced.
- Full E2E Attempt2 = HARNESS_STARTUP_FAILURE: `0` test bodies; child execution
  resolved `/usr/bin/node v12.22.9` instead of Node 24.20.0. No product/test/
  source mutation occurred, so this is not product evidence.
- Full E2E Attempt3 = PASS: exactly one canonical `pnpm test:e2e` run,
  `72/72`, retries `0`; parent and tested child processes were pinned and
  proven on Node `24.20.0`.

Candidate tree unchanged throughout = YES (`638372813cd682d3a5af214bc2830d91010dec03`).

P8_2_LOCAL_ACCEPTANCE = PASS
P8_2_REMOTE_ACCEPTANCE = PENDING
P8_3_STARTED = NO

## P8.2 publication and remote-acceptance materialization

FINAL_LOCAL_TREE = `46d3438ac4e4ece23707e3f6175f0c7ce97f04ed`

REVIEWED_PRODUCT_TREE = `638372813cd682d3a5af214bc2830d91010dec03`

PUBLICATION_COMMIT = `e280de3ed24b9fc79157979614b780b9c6cc9220`

PUBLICATION_TREE = `46d3438ac4e4ece23707e3f6175f0c7ce97f04ed`

PUBLICATION_REMOTE_READBACK = `PASS`

PUBLICATION_SERVER_CI = `PASS`

PUBLICATION_CI_RUN = `34737485993`

PUBLICATION_CI_JOB = `103671311329`

PUBLICATION_CI_EVENT = `push`

PUBLICATION_CI_EXACT_SHA = `YES`

PUBLICATION_CI_MANDATORY_STEPS = `ALL PASS`

UNIT = `1240`

INTEGRATION = `1507`

E2E = `72`

REMOTE_ACCEPTANCE_MATERIALIZATION = `IN PROGRESS / DOCS-ONLY CANDIDATE`

P8_3_STARTED = `NO`

The publication commit remains the exact accepted product tree.

This docs-only materialization does not change persistence behavior, tests,
migrations, schemas, package dependencies, lockfile, API, Bridge, or P8.3.

The future docs-only commit's CI result is intentionally not claimed yet.
