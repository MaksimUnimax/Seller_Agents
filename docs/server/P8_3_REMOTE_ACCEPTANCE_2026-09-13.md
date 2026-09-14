# P8.3 Remote Acceptance — 2026-09-13

TECHNICAL_ID = `PRODUCT-CONTROL-PLANE-P8_3-REMOTE-ACCEPTANCE-MATERIALIZATION-2026-09-13`

FINAL_REMATERIALIZATION_TECHNICAL_ID = `PRODUCT-CONTROL-PLANE-P8_3-FINAL-REMOTE-ACCEPTANCE-REMATERIALIZATION-2026-09-14`

## Accepted product identity

- P8.3 reviewed product tree: `20ae8f508ad1c5ebe22755b048490e14bdb6b7a6`.
- P8.3 final-local tree: `59379c24f3568958fa942741358e4b14aeecd792`.
- Product publication SHA: `d96bee078f640f64bcc32608341f2d68ca9afb8f`.
- Product publication tree: `59379c24f3568958fa942741358e4b14aeecd792`.
- Product publication parent: `a8fedac5532e9d984248a871899d04d1d8679676`.
- Product publication subject: `feat(server): implement P8.3 controlled Chrome H2`.
- Product correction after publication: `NO`.

## Local acceptance

- Independent Review1: `PASS`.
- CRITICAL/HIGH/MEDIUM/LOW: `0/0/0/0`.
- R1-HIGH-001: `CLOSED`.
- R1-HIGH-002: `CLOSED`.
- Focused unit: `22/22`.
- Full unit: `1261/1261`.
- Integration: `1507/1507`.
- Focused Chromium: `13/13`.
- Independent network matrix: `15/15`.
- Final-local full E2E: `85/85`.
- Retries: `0`.
- OpenAPI: `102 exact`.
- Provider calls: `0`.
- Live AI browser calls: `0`.

## Original publication CI truth

- CI99 run: `34750699812`.
- Run number: `99`.
- Head SHA: `d96bee078f640f64bcc32608341f2d68ca9afb8f`.
- Result: `FAILED`.
- E2E: `83 passed / 1 failed / 1 did not run out of 85`.
- Failure: pre-existing baseline `admin-ai` Complete-rollout 60-second timeout.
- P8.3 H2 in CI99: `13/13 PASS`.

The original d96 publication SHA did **not** pass its own exact-SHA Server CI.

## Local exact-publication diagnostic

- Exact SHA: `d96bee078f640f64bcc32608341f2d68ca9afb8f`.
- Status: `P8_3_CI99_DIAGNOSTIC_NO_REPRO`.
- Canonical full E2E: `85/85 PASS`.
- Browser: `151.0.7922.34`.
- Failure reproduced: `NO`.

## Exact-SHA rerun blocker

- Job-specific exact-SHA rerun execution: `NOT PERFORMED`.
- Reason: Actions write permission unavailable.
- HTTP: `403`.
- Successful rerun triggers: `0`.

This was an authorization block before execution, not a failed test rerun.

## Equivalent-product-tree GitHub CI revalidation

### Trigger commit

- Trigger commit: `4ab4eca5e5e5661943732d1de2e2432dddda2ea9`.
- Trigger tree: `b315c635d6e27314fd2daf61b9137ff1b1a1fc2f`.
- Parent: `d96bee078f640f64bcc32608341f2d68ca9afb8f`.
- Trigger subject: `docs(server): trigger P8.3 CI revalidation after rerun auth block`.
- Changed path: `server/docs/P8_3_CI_REVALIDATION_TRIGGER_AFTER_RERUN_AUTH_BLOCK_2026-09-13.md`.
- Executable/test/schema/workflow delta: `0`.

### Server CI

- Workflow: `Server CI`.
- Run ID: `34754180128`.
- Run number: `100`.
- Event: `push`.
- Exact trigger head: `4ab4eca5e5e5661943732d1de2e2432dddda2ea9`.
- Conclusion: `success`.
- Job ID: `103715650773`.
- Mandatory steps: `all green`.
- E2E: `85/85 PASS`.
- P8.3 H2: `13/13 PASS`.

Correct conclusion:

The unchanged P8.3 executable/test/schema/workflow product tree passed the
full canonical Server CI on a docs-only descendant commit.

## Accepted P8.3 scope

- browser-family-independent BrowserDriver contract;
- controlled Chrome implementation;
- ephemeral controlled sessions;
- packaged target authority;
- packaged structural strategy authority;
- read-only H2 structural smoke;
- context-wide popup/secondary-page protection;
- private Chromium CDP request-stage top-level Document firewall;
- deterministic unsafe-navigation latch;
- runtime-private Browser/BrowserContext/Page/CDPSession handles;
- safe bounded structural metadata;
- real Chromium acceptance;
- no final HealthState from H2;
- no completed Health-run persistence from H2.

## Boundaries

- H3 = `NOT STARTED`.
- ChatGPT Standard/Work behavioral Health = `NOT STARTED`.
- P8.4 = `NOT STARTED`.
- P8.5 = `NOT STARTED`.
- P8.6 = `NOT STARTED`.
- P8.7 = `NOT STARTED`.
- P9 = `NOT STARTED`.
- P13 = `NOT STARTED`.
- Bridge changed = `NO`.
- classifier changed = `NO`.
- P8.2 persistence changed = `NO`.
- public API/admin Health surface added = `NO`.
- provider calls = `0`.
- live AI browser calls = `0`.
- deployment = `NO`.

## Migrations

- migrations = `0000..0015`.
- 0014 SHA256 = `4a12aa34d6be16648fc6cd12b4f3de04f3cce0f3abd6938918905dfa2c471558`.
- 0015 SHA256 = `212888c0972c1905b5306add1cdd45a70f2152148cecf73c829cc8c0b11ebcb9`.
- 0016 = `ABSENT`.

## Acceptance condition

This rematerialized document records the final P8.3 acceptance evidence.
Formal P8.3 remote acceptance becomes effective when the exact commit
containing this rematerialized document:

1. has parent `130e3f1bd9cffc28b5ac799c87173fac96d9adf2`;
2. changes only the three authorized P8.3 documentation paths;
3. is fast-forward pushed to the canonical branch;
4. remains canonical branch HEAD after CI;
5. passes its own push-triggered exact-SHA Server CI; and
6. has E2E `85/85` and P8.3 H2 `13/13`.

P8.3 = `DONE / REMOTE ACCEPTED` is recorded as the roadmap materialization
state, subject to the external exact-SHA CI condition above. This document
does not invent the future docs commit SHA or CI run.

## First remote-acceptance materialization and CI101

The first remote-acceptance materialization was commit
`483658ff29a58f43628bb024f570f5880a4a420d`, tree
`b94d3af448474bcaeaf534f293b028853980279f`, parent
`4ab4eca5e5e5661943732d1de2e2432dddda2ea9`, subject
`docs(server): record P8.3 remote acceptance`.

- CI101 run: `34756015585` (run number `101`), job `103720395455`.
- Event: `push`.
- Result: `FAILED`.
- E2E: `84/85`.
- P8.3 H2: `13/13 PASS`.
- Failure: the P3.6 tampered-cache test observed `READY` rather than
  `CACHE_INVALID`.

The CI101 failure did not prove a P8.3 product defect. Later diagnosis proved
the failure was a probabilistic no-op in the test tamper mutation.

## Baseline-test failure adjudication

Both historical failures were proven independent baseline E2E test defects:

Historical CI truth: CI99 = `FAILED`; CI100 = `PASS`; CI101 = `FAILED`;
CI102 = `PASS`.

- CI99 admin-ai failure: `ADMIN_AI_TEST_SYNCHRONIZATION_DEFECT`. The test did
  not wait for authoritative assignment refetch/render completion after
  `Resume rollout` before starting `Complete rollout`.
- CI101 P3.6 failure: `TEST-ONLY PROBABILISTIC NO-OP TAMPER`. The generated
  signature could already begin with `A`, making `"A" + signature.slice(1)`
  identical to the original valid signature.

- P8.3 product correction indicated: `NO`.
- P3.6 production correction indicated: `NO`.
- admin-AI product/API correction indicated: `NO`.
- baseline E2E test correction indicated: `YES`.

## Combined baseline E2E stabilization

The combined test-correction candidate tree was
`fa770534d6737c4058f5b4475c513bc67367d7f4` and changed exactly two test
paths: `server/e2e/admin-ai.spec.ts` and `server/e2e/bootstrap.spec.ts`.

- Focused P3.6: `PASS`.
- Bootstrap spec: `17/17 PASS`.
- Admin targeted owner flow: `8/8 PASS`.
- Complete admin-ai spec: three independent invocations, each `3/3 PASS`.
- Full E2E: `85/85 PASS`, retries `0`, workers `1`.
- P8.3 H2: `13/13 PASS`.

The correction publication was commit
`130e3f1bd9cffc28b5ac799c87173fac96d9adf2`, tree
`fa770534d6737c4058f5b4475c513bc67367d7f4`, parent
`483658ff29a58f43628bb024f570f5880a4a420d`, subject
`test(server): stabilize baseline E2E acceptance`. Its changed paths were
exactly `server/e2e/admin-ai.spec.ts` and `server/e2e/bootstrap.spec.ts`.
Product/source delta: `0`.

## Server CI 102

- Run: `34794830667` (run number `102`, attempt `1`), job `103825791235`.
- Event: `push`.
- Exact head: `130e3f1bd9cffc28b5ac799c87173fac96d9adf2`.
- Result: `PASS`; all mandatory steps green.
- E2E: `85/85 PASS`; retries `0`; workers `1`.
- P3.6: `PASS`.
- admin-ai owner flow: `PASS`.
- P8.3 H2: `13/13 PASS`.

The test-only stabilization commit changed no P8.3 product source and does
not replace the P8.3 product publication identity at
`d96bee078f640f64bcc32608341f2d68ca9afb8f`.
