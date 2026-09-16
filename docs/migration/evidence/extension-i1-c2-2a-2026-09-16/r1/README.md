# C2.2-A correction receipt — R1

Task: `SA-I1-C2-2A-R1-20260916-01`  
Base: `ec9c23da45091255e0ba53914b3682539ef0b797` / tree `eeeb24dfea47f714b38d6997550073e468aad58c` / parent `a553d1f80769528544ee1c90d1305edb51d9d71f`  
Target: `integration/i1-c1-srv5-2026-09-16`; no main merge.  
Status: `IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`.

The candidate binds audited HTTP 503 eligibility to the exact `/v1/bootstrap` error object, separates successful-write obsolescence from rejected storage writes, and fences the public policy result after the mutation queue resumes. It does not grant offline Work or change server/contracts/site/ingress.

## Explicit case ledger

| Label | Assertion/scenario | Source | Extracted | Outcome |
|---|---|---:|---:|---|
| R1-1 | Exact-start P1 RED from the independent probe; corrected policy uses endpoint-bound audited 503 provenance, paired fresh-access 503 CACHE control, and local/body failures are ineligible. | PASS | PASS | Candidate GREEN; exact-start RED is architect-provided probe evidence |
| R1-2 | Exact-start P2 RED from the independent probe; denial AUTH write is held after the successful floor write, later raw bootstrap supersedes it, with no remove or storage-failure classification. | PASS | PASS | GREEN |
| R1-3 | Audited 503, transport TypeError/abort, wrong/malformed 503, 429/500/502/504, malformed 200, body-read failure, signature/profile/context controls; actual request/failure source and no cached result are asserted. | PASS | PASS | GREEN with retained R3/R4 controls |
| R1-4 | Expiry/grace equality and after, stale account-only acquisition, fresh-only Work/status/getAuthority denial, monotonic/effective-time controls and persisted floor behavior. | PASS | PASS | GREEN with retained C2.1 time controls |
| R1-5 | Failed AUTH set/successful remove and failed AUTH set/failed remove; exact attempts, safe failure, memory denial and restart durability limitation; recovery control. | PASS | PASS | GREEN |
| R1-6 | Changed API/portal origin, browser/user-agent, extension version, contract, packaged trust ring, device, session, requested AI, and tampered envelope; restore denial is distinguished from in-flight mismatch. | PASS | PASS | GREEN |
| R1-7 | Held successful checkpoint followed by newer raw invocation; held denial transaction followed by later raw invocation; old result cannot mutate or restore newer state. Existing reset/activation and later-403 controls retained. | PASS | PASS | GREEN |
| R1-8 | Verified online renewal returns the new payload and replaces cache; Work guards add zero control-plane requests; no provider replay/live calls. | PASS | PASS | GREEN |

Focused source and extracted runs both completed with Node `v22.22.2`; the complete I1 composition reported `100` passing gate processes. Native source/extracted, installed-local API/portal/PostgreSQL, `openapi:check`, and authenticated current-task remote CI were not run in this workspace and remain `UNKNOWN`.

## Package receipt

Default-development composition archive: `1834654` bytes, SHA-256 `2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de`. Repeat archive matched; source/extracted byte readback matched. Ephemeral-key native receipt: `UNKNOWN`.

Historical remote facts are not transferred to this current receipt. No merge, deploy, release, Work grant, provider replay, or full-I1 acceptance is claimed.

## R2 correction

This R1 receipt and its result JSON remain historical and are not rewritten. The R2 candidate adds the assigned missing acceptance rows and stable Q1–Q7 case IDs on the later exact start supplied by the architect. Its current evidence is in `../r2/README.md` and `../r2/results.json`; R1’s historical RED/PASS provenance is not re-run or replaced.
