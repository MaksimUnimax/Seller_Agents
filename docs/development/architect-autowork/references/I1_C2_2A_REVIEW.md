# C2.2-A architect review — REWORK_REQUIRED
Task SA-I1-C2-2A-20260916-01. Date2026-09-16.
Candidate ec9c23da45091255e0ba53914b3682539ef0b797/tree eeeb24dfea47f714b38d6997550073e468aad58c/parent a553d1f80769528544ee1c90d1305edb51d9d71f.
Start4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1.
Integration branch and PR9 head independently equal candidate; PR9 remains draft.
Current main e5f302d2d0334a106fa046b8dee4e8df6e38e583 includes authorized Octoport/site/ingress changes. Preserve, do not revert or import into this correction.
Actual CI merge bc3da6a062b1bdcd49badb3879ac2adc03f40a97/tree cec0617f7188d19d3bb718affa12972e5aea3470 has main e5f302... and candidate parents. Unlike earlier review, tree is not candidate-identical: nineteen extra main paths are site/ingress/docs/workflow; no extension-client delta.

## Decision and independent proof
REWORK_REQUIRED, not a CI-only block.
Exact production client Git blob026740435bdab9c07b826d231874b75aa6e6ece8:
P1 matching signed cache + expired access + refresh HTTP503 BOOTSTRAP_UNAVAILABLE returned CACHE/FRESH. Network list contains only /v1/auth/refresh. HTTP fallback incorrectly trusts status/code without endpoint provenance.
P2 access remains fresh through grace; actual second AUTH denial write held, later raw bootstrap begins, successful denial write released. Old result AUTH_DENIAL_PERSISTENCE_FAILED,2writes,1remove,AUTH deleted; actual storage failures0. persistCacheDenial catches its own obsolescence exception as persistence failure.
Source VM with real fixture Ed25519; production file unchanged. No native/live claim from probes. Probe files and exact safe results accompany this review.

## Source acceptance gaps
request fetch-only transport wrapping and private WeakMap are present; HTTP errors have no equivalent endpoint provenance.
Positive-floor write catches CACHE_ACQUISITION_OBSOLETED specially, but denial helper catches everything. Narrow both storage catches to the actual persist await, then perform ownership checks outside.
Policy cached return lacks a final ownership check after awaiting queue result. ONLINE policy checks sequence/context but not the exact committed authority identity at its public consumer. Complete original return-fence requirement.
Published215-line offline-policy test does not justify full A–H PASS. Missing: oversized/schema/trust/signed compatibility/time regression rows; expiresAt-1/grace-1 and held-write completion veto; consumed-grace restart/rollback; resolved-AI stale Work guard trio; both-fail storage/catalog-IDB retention; changed environment/context fallback matrix; reset+B and crypto/storage/public-consumer races. Existing account-only checks and two held-network cases are narrower evidence.
Legacy compatibility branch can return early rather than asserting the desired CACHE behavior. Make exact-base RED require the actual expected acquisition outcome, not a new error code absent in the base.

## Current CI
Authenticated current I135066457056 client104697816433/installed104697816751 SUCCESS.
Installed completed log read: real API/portal/disposable PostgreSQL, two accounts/devices/authorizations, same worker, development OTP,0live providers.
PR Extension35066456987 native104697809040 SUCCESS; completed log source/extracted Chromium151.0.7922.34 with real popup/text/binary/IDB/Finish under synthetic AI/fetch.
Core104697809262,WB-nodes104697809203,Ozon104697809452 and Docs35066457014/job104697729787 SUCCESS by API.
Server35066457022/job104697802488,WB-browser104697809313 and additional push WB-browser104697789953 remain IN_PROGRESS at final snapshot. No all-green claim; no rerun/cancel. Ready proven correction need not await these old candidate jobs.
Executor local native/installed/OpenAPI UNKNOWN/not-run remains historical; remote PASS is separate evidence.
Reported default ZIP1834181bytes/SHA25601927616ac7e500b6a872d9eca1416953b5af90bd5ea13e6097be726f32234b0 not independently downloaded for rejected candidate. Initial README/results still say current package UNKNOWN; reconcile in factual addendum, do not rewrite historical JSON.

## Next correction
SA-I1-C2-2A-R1-20260916-01: endpoint-bound private HTTP provenance, precise persistence catches, final public ownership fence and the already mandated missing cases.
Exact task in tasks/I1_C2_2A_R1_2026-09-16.md. Prepared for one final submission; saved task is not delivery/running evidence.
C2.1 acceptance preserved. C2.2-A open; offline Work/profile/full joint C2,I1/D2,Health B5/B6–8,S1.2/D3,beta/deploy/release remain open. Owner manual testing not required yet.
