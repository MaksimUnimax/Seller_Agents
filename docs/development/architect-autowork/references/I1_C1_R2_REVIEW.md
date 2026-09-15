# I1-C1 R2 independent architect review — 2026-09-15

Verdict: REWORK_REQUIRED. Scope: SA-I1-C1-R2-20260915-01, candidate 0b2a1776ff484d2410b3a43d338ec5548e73f019, tree 3a83601109f7cb643e06d923b1da36691f9b0014. C1 remains open; PR7 draft/unmerged. Executor terminal report says stopped; no Bridge process/job identifier supplied.

## Current identity
Remote feature head independently equals candidate. Parent/start 9e80e8ad531f079b38bf03b9e29f171c87c477c0; main 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c. One candidate commit reviewed, with 12 changed files. PR virtual merge reported 3e9fa9bfacf383cd1a5c33c4199aa2916fbf9ede; failures below independently read from PUSH jobs checking pure feature candidate.

## Proven implementation defects
1. Oversized HTTP200 bootstrap (>1MiB) throws CONTROL_RESPONSE_TOO_LARGE before verifier; bootstrap catch handles denial only status401/403. Independent exact-source VM probe observed authenticated:true/workAllowed:true after rejection. This fails G3. Carry response status and invalidate known invalid 2xx (also oversized terminal401/403).
2. Signed valid account-only UNCONFIGURED payload is rejected BOOTSTRAP_PROFILE_INCOMPATIBLE with credentials but no authority; observed authenticated:false/workAllowed:false. BootstrapService.issueV2 supplies UNCONFIGURED when detectedAi omitted, and ensurePolling calls bootstrap without it. Auth and Work must be distinguished: valid account-only authority may authenticate with workAllowed:false; requested operational profile still mandatory for Work. Use consistent restore validation, maintain generation/cleanup when downgrading prior Work.
3. Source review: bootstrap captures context after initial refresh await; refresh validates options.context after early bearer/fresh returns and omits expected-context check inside queued preparation; startActivation credentials/no-authority catch commits error unconditionally. R3 pins entry context across these named continuations.
4. Four R2 added tests do not establish full G1-G4 criteria: both G1/G2 mock bootstrap403 and assert signed-out, no successful repeated authentication/recovery, no signed version matrix, no held same-worker stale success/error cases, no actual restart after removal or composed active Work/delivery denial cases. New coverage count is not acceptance.

## Independent runtime evidence
I1_C1_R2_reproduce.mjs and I1_C1_R2_reproduction-results.json record two probes on actual published config/crypto/client modules and worker harness, controlled HTTP and temporary signer only. Initial-account probe uses credentials/no authority and signed UNCONFIGURED/accessBasis NONE, consistent with server issueV2.
Exact source Git blobs verified by git hash-object:
- client.js 885cab1b4589592d52176eb447725d67149ade48
- crypto.js 362d336e3b90b89d26c9ec51071d8ab78e2473f8
- config.js 7c0a8019703929bc201995ed9e38e7c1706a459b
This is source VM proof, not installed/local API/live or release acceptance. Assertions intentionally detect candidate defects and must be inverted for corrected acceptance.

## CI
- Push I1 run 34965374842 FAILURE: client104368454298 SUCCESS; installed104368454586 FAILURE. PostgreSQL18 initialized and healthy. installed_local_integration.py line91 re.search(...).group(0) raises AttributeError: NoneType has no attribute group. No code text awaited; portal redirect is asynchronous and harness checks URL too early. Fix bounded UI/redirect/approval synchronization, then account-only bootstrap defect remains necessary to fix. Local no-space/ECONNREFUSED reported separately, not cause of remote failure.
- Push Extension run34965374971: common-core104368455663 FAILURE, core-source-full-worker-green settings setup LEGACY_ACTION_DISABLED. Native104368455416 SUCCESS, Ozon104368455718 SUCCESS, WB nodes104368455739 SUCCESS; WB browser104368455692 still IN_PROGRESS at readback.
- PR I1 run34965379075 FAILURE: client104368469403 SUCCESS, installed104368469518 FAILURE.
- PR Extension run34965379044 still IN_PROGRESS: core104368469509 FAILURE, native104368469186 SUCCESS; WB browsers104368469422 IN_PROGRESS, Ozon104368469442 and WB nodes104368469471 SUCCESS.
- Documentation PR run34965379091 SUCCESS.
No need to wait remaining browser job to establish REWORK_REQUIRED from proven blockers. No all-green statement.
Core job log proves fixture mismatch; frozen imported full-worker source reviewed: legacy save/bind/resume/manual setup. extension_import.py currently changes sender only. R3 ports all ten candidate behavioral controls onto existing signed composed harness + SA store/start handshake, keeps donor/RED byte-identical, preserves count/fingerprint/delivery assertions. Production signed-out routing must not regress.

## Narrow accepted evidence and remaining boundaries
G6 first-context empty restore/one seed/full close/same-profile second worker setup matches specified design and native CI is successful. Retain this synthetic native fixture correction. Composed readiness and local guards are directionally correct but G3 remains unaccepted due oversized path and missing behavioral controls. Comparator implementation inspected; G4 acceptance awaits prescribed signed boundary tests.
Executor-reported package SELLER_AGENTS_I1_C1_v0.2.4_LOCAL_DEVELOPMENT.zip hash dd96560e52cbfe51e07f6150829c1a01dce31e05f124e69cbed859694ac83c8a, size1797539. Architect did not independently download ZIP bytes. R2 directory has commands-outcomes.md, failure-evidence.json, package-receipt.json, requirement-mapping.json; no tracked r2/README.md, so terminal evidence link does not resolve to a published README.
Current client README's unconditional R2 closes wording exceeds evidence; correct prospectively without erasing history.

## Next
SA-I1-C1-R3-20260915-01 is a single concrete correction task, starting at candidate 0b2a1776ff484d2410b3a43d338ec5548e73f019. Prepared task ../tasks/I1_C1_R3_2026-09-15.md. Previous executor stopped by report; R3 Bridge delivery/ack not independently observed. Do not resubmit after interruption without checking final assistant turn/current job.
Queues unchanged: close C1 blockers, I1-SRV.5, C2/joint installed acceptance; retain Health/P8.4 B5 NOT ACCEPTED and subsequent B6-B8 queue. No main/Health/server merge or architecture delegation.
