# C2.2-A R1 independent review — 2026-09-16

Verdict: REWORK_REQUIRED, acceptance completion only. No newly proven production defect; preserve the reviewed client unchanged.
Candidate90f3f5ab4787d1ed4b782bff4f97181dd9fe3772/tree835ce56a1fd235196f7010936817485bf7347eb5; parent65596c5f1b5189c60de64d72a80773d43f1a203f; startec9c23da45091255e0ba53914b3682539ef0b797. Integration remote and draft PR9 verified.

## Independently reproduced
Exact client Git blob5f6a195048e257304c16fb92a25c4ff772d98fe0, real Ed25519 source VM:
- P1: refresh503 rejected BOOTSTRAP_UNAVAILABLE, only refresh endpoint, no CACHE.
- P2: second actual denial write superseded by raw invocation; CACHE_ACQUISITION_OBSOLETED, writes2/remove0, AUTH retained, no storage failure.
- Final public fence: schedule later raw invocation by queueMicrotask from checkpoint completion monotonic sample; candidate rejects obsolete acquisition. Disposable mutant removing ONLY the post-checkpoint final policyCurrent check returns CACHE. This is an independent sensitivity control, not a production change.
Replay scripts/results in I1_C2_2A_R1_REVIEW_PROBE/. Existing shared fixture/seed dependencies are retained under I1_C2_2A_REVIEW_PROBE/; copy its fixture.mjs next to new probes and retain sibling i1-sync-review dependencies. Fetch candidate client.js into the new probe directory and verify the Git blob before running. Mutant is disposable and not published as code.

## Concrete acceptance gaps
Published policy test12d127d52b86775511367dbc32f47f555ce12e39 reviewed in full.
- No negative refresh503 case despite R1-1 PASS.
- Generic negative cases at97–108; no oversized200/503, online unknown-key/bad-signature, valid signed incompatible environment/profile/server-time rows, or full refresh401/403 policy matrix.
- Boundary table124 lacks minus-one rows. No grace crossing held-write, consumed-grace wall rollback/restart.
- Stale guard fixture240–256 changes AI to UNCONFIGURED; cannot prove resolved-AI denial.
- Storage test has no catalog/IDB assertions. Both-fail test covers denial write after floor persisted; does not prove failed first floor durability limitation.
- No policy reset+B activation or held verification; corrupted signature is not valid signed replacement.
- Public-return test201–234 starts B before persist resumes; earlier internal checks suffice. It does not discriminate final fence; architect supplied a discriminating schedule.
- README, JSON and terminal disagree on local docs/bridge/OpenAPI outcomes.
No C2.1 fresh-only/raw test silently substitutes for these policy cases. Do not accept full A–H from process count.

## CI and concurrent owner work
See I1_C2_2A_R1_CI.json. Current native source/extracted and installed-local completed logs independently read, both PASS with zero live providers. I1/core/Ozon/WBnodes/docs success. Server and both WB-browser jobs still IN_PROGRESS at snapshot; no all-green claim or rerun.
Checkout0c66a4fc0d98a7702d28f3301af2aa97d8b07d2b/treeeb42f95e850fa0dd0b31643b23eb0f4d869da02e parents maincfd63e5c2227a52ccff6cbb5bb2da4580ec3bb3a and candidate. Additional32 main paths are owner site/SEO/ingress/docs; no client delta. Owner explicitly confirmed parallel SEO during this review. Preserve both SEO and Octoport migration.
Native log receipt1835439bytes/SHA256d3aa2c954b483d6d7b22ddea5bd2e4d09e1adb91738c7e399c0d6f5afb5e5352; not downloaded. Local default1834654/2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de separate.
No need to wait for old CI before ready test correction; candidate gates remain open.
Next task SA-I1-C2-2A-R2-20260916-01 tests/evidence only, exact missing scenarios and per-case ledger. Full C2/I1 remains open.
