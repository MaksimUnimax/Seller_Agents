# C2.2-A R2 independent review — 2026-09-16

Verdict: REWORK_REQUIRED, bounded to regression evidence. No new production defect established. C2.2-A remains open.

## Candidate and ownership
Task SA-I1-C2-2A-R2-20260916-01, branch integration/i1-c1-srv5-2026-09-16, draft PR9.
Start90f3f5ab4787d1ed4b782bff4f97181dd9fe3772/tree835ce56a1fd235196f7010936817485bf7347eb5.
Finaledc70704cec965b9e7bc58ca4d3c961834573517/tree3aaad9a0fd29649f492ebb0cd31522366f2475dcc, parentd927b2498262798f03d2fa9f0accf9c62fbaaad0.
Seven changed paths reviewed; production client blob5f6a195048e257304c16fb92a25c4ff772d98fe0 unchanged.

Canonical repository is now MaksimUnimax/runtime-fixtures, stable ID1369117174; owner explicitly confirmed rename/publication. Same history/refs/PRs, not a replacement repository. Preserve owner domain/SEO/public presentation work. Do not use generic entry-point documentation to reset product decisions.
Mainbc718cc5c677ad0eb4598e7de3ad766473ff0847 independently fetched. Local git merge-tree against candidate reports exactly one conflict, docs/README.md; PR9 dirty/mergeable:false. No merge/rebase/ref mutation performed on implementation. This file belongs to the parallel presentation stream; R3 must not edit it. Remote PR CI prerequisite remains open.

## Independent positive evidence
Exact-head local clone; composed source/extracted focused tests each PASS, 36 named ledger rows, Nodev24.19.0 (distinct from executor Nodev22.22.2).
Independent repeated default build:1834654bytes/SHA2562c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de; repeat/source-extracted byte equality.
Read current push Extension CI run35075574262: SUCCESS. Core104727070823/native104727071214/Ozon104727071155/WBnodes104727071159/WBbrowser104727071069 all SUCCESS.
Native completed log read: exact checked-out edc70704cec965b9e7bc58ca4d3c961834573517, Chromium151.0.7922.34, source and extracted PASS, zero live calls, installed_acceptance:false.
Separate native log-only package1835439bytes/SHA2561b0ad27a67946fa2755d2637af9d4fba345b3bc7d425fc939f8c18c315d72468; not independently downloaded.
No new candidate PR I1/installed/Server/Docs runs observed while PR9 dirty. Historical R1 evidence is not current R2 execution. No reruns/cancellations.

## Proven evidence defects and selected fixes
1. Q3-A / idbPutGet writes the same record before every retention read. Architect inserted fixture records.clear immediately before post-failure and post-restart reads; original assertions still PASS/exit0. Read-only postcondition under identical deletion fails/exit1 with undefined versus record. This is a demonstrated false-positive.
2. Original Q3 record lacks expires_at_ms. Existing file_delivery_port_worker.js cleanupExpiredArtifacts treats missing expiry as0 and deletes it, correctly. A valid TTL (created_at_ms=T0, expires_at_ms=T0+3600000) plus get-only postconditions passes on unchanged runtime, with one seed write and no subsequent IDB writes.
3. Q3 does not prove same-worker in-memory floor after simultaneous failed set/remove. Corrected probe clones old durable backing at failure, separately recovers original worker under wall rollback/unchanged monotonic, then restarts the old snapshot. It passes: recovered original floorT0+100; restarted old snapshot honestly retains only old durable floor. Catalog/IDB retained.
4. Q4-D is a legitimate signed ONLINE account replacement, not stale-account fallback rejection. Preserve it as positive. Existing real verify barrier can hold old-A fallback, commit signed same-session accountB/configVersion2, then release A: CACHE_ACQUISITION_OBSOLETED and deep-equal B AUTH. Independently verified.
5. Q5-B cloned-record assert.notEqual is reference inequality. Corrected probe captures complete B AUTH after success/403 and deep-compares after A settles; both pass. Require complete B assertions also for held-write variants.
6. Q2-D checkpoints through canWork and directly overwrites durable floor; replace consumption with bootstrapWithPolicy, remove fixture write, make restarted bootstrap503 explicit. Architect probe passes floorT0+1500 and expiry restart denial on unchanged runtime.
No production edit follows these findings. Do not alter expiry cleanup or account authority semantics to accommodate invalid fixtures.

## Scope accepted within review
R2 Q1 failure matrix, half-open deadline/held-write tests, fresh-only guards, real activation owner race and final-return schedule reviewed. Q6 positive passes on exact current client; prior independent one-final-check mutant proof has matching immutable production blob and remains architect-attributed evidence. Do not invent an executor mutant run. Existing correct assertions are retained; no broad new audit or unrelated test expansion.

## Probe provenance
references/I1_C2_2A_R2_REVIEW_PROBE contains the exact disposable probes and captured outputs. Arguments: composed runtime directory first, absolute file path to exact candidate worker-harness.mjs second. Probes intentionally run selected test helpers/cases, not the full product suite.
r2-idb-false-positive: forced deletion with validTTL still PASS.
r2-idb-sensitive-control: same forced deletion plus readonly postcondition FAIL as expected.
r2-correction-design-probe: validTTL, exact retained reads, same-worker/restart split, accountB verification barrier and exact B preservation all PASS on source and extracted.
r2-policy-floor-design-probe: policy-driven rollback/restart consumed floor PASS on source.
Production stayed immutable; these are fixture-based VM proofs, not native/live acceptance.

## Next action
SA-I1-C2-2A-R3-20260916-01 tests/evidence only, exact algorithm saved in tasks/I1_C2_2A_R3_2026-09-16.md. No main integration or public-entrypoint edits. One final task submission; saving is not execution evidence.
Prior bounded C1/SRV5/SYNC/C2.1 acceptances remain. HealthP8.4B5 unaccepted/B6–B8 queued; fullC2/I1, installed offline joint acceptance, live/beta/release remain open.
