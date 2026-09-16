# C2.2-A tests/evidence receipt — R2

Task: `SA-I1-C2-2A-R2-20260916-01`  
Branch: `integration/i1-c1-srv5-2026-09-16`  
Exact start: `90f3f5ab4787d1ed4b782bff4f97181dd9fe3772`  
Start tree: `835ce56a1fd235196f7010936817485bf7347eb5`  
Parent/code: `65596c5f1b5189c60de64d72a80773d43f1a203f`  
Implementation commit: `d927b2498262798f03d2fa9f0accf9c62fbaaad0`  
Status: `IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`

## Scope and source

R2 is tests/evidence only. Production client bytes were not changed. The policy test retains the working R1 controls and adds named, independently asserted Q1–Q7 cases. The worker harness change is a deterministic test-only crypto verification barrier; no production closure state is exposed. No site, SEO, ingress, server, dependency, workflow, checker registration, offline Work, provider replay, activation fallback, deployment, or release change is included.

## Named case ledger

Every listed case was `PASS` on both the source and extracted composed runtime in the local Node `v22.22.2` run. A missing, failed, or skipped case would make its group fail; none was missing or skipped.

| ID | Outcome | Assertion / failure origin |
|---|---|---|
| Q1-A-refresh503-not-cache | PASS | Exact 503 `BOOTSTRAP_UNAVAILABLE`, refresh-only path, zero CACHE |
| Q1-B-oversized-200 | PASS | `CONTROL_RESPONSE_TOO_LARGE`, status/response identity, one bootstrap, no cache |
| Q1-B-oversized-503 | PASS | Same size classification for 503, no audited-cache fallback |
| Q1-C-unknown-key | PASS | Signed-envelope verification rejects unknown keyId |
| Q1-C-corrupted-signature | PASS | Signature verification rejects altered signature |
| Q1-C-browser-unsupported | PASS | Correctly signed browser compatibility rejection |
| Q1-C-extension-update-required | PASS | Correctly signed valid minimum version requires update |
| Q1-C-profile-minimum-99 | PASS | Correctly signed incompatible profile minimum rejects |
| Q1-C-server-time-regression | PASS | Correctly signed server time below trusted floor rejects |
| Q1-D-preflight-refresh-401 | PASS | Ordered refresh denial clears durable authority/credentials; restart signed out |
| Q1-D-preflight-refresh-403 | PASS | Same durable terminal denial for 403 |
| Q1-D-bootstrap401-refresh-401 | PASS | Bootstrap 401 then forced refresh 401 remains ordered and signed out |
| Q1-D-bootstrap401-refresh-403 | PASS | Bootstrap 401 then forced refresh 403 remains ordered and signed out |
| Q1-E-storage503-is-not-http503 | PASS | Local AUTH write failure is persistence failure, not HTTP 503/cache eligibility |
| Q2-A-expires-minus-one | PASS | `expiresAt - 1` is FRESH |
| Q2-A-expires-equality | PASS | `expiresAt` is stale but grace-eligible |
| Q2-A-grace-minus-one | PASS | `grace - 1` is stale but grace-eligible |
| Q2-A-grace-equality | PASS | Grace equality is `CACHE_EXPIRED` |
| Q2-A-grace-after | PASS | Grace plus one is `CACHE_EXPIRED` |
| Q2-B-held-write-crosses-grace | PASS | Held real AUTH floor write crossing grace rejects and persists denial floor |
| Q2-C-resolved-AI-fresh-cache-guards | PASS | Fresh resolved-AI then stale cache denies all guards with zero added requests |
| Q2-D-rollback-consumed-grace-restart | PASS | Consumed monotonic grace and rollback cannot lower durable floor across restarts |
| Q3-A-first-floor-both-storage-fail-and-idb-retention | PASS | First-floor set/remove failure preserves old bytes, records no false durability, retains catalog and IDB record |
| Q4-A-no-authority-cache-control | PASS | Valid credentials with null authority preserves original actual bootstrap 503 |
| Q4-B-signed-out-auth-required-zero-requests | PASS | Signed-out state is `AUTH_REQUIRED` with zero requests |
| Q4-C-account-only-online-positive | PASS | Account-only request succeeds as a valid positive control |
| Q4-D-account-mismatch-signed-policy-processing | PASS | Paired valid positive restores first; correctly signed mismatch is labeled policy-processing, not restore |
| Q5-A-held-A-then-real-B-activation | PASS | Real A/B async ownership retains B account/device/session after A rejection |
| Q5-B-held-cached-verification-replacement | PASS | Crypto barrier makes old cached result obsolete; valid same-session B owns |
| Q5-B-held-cached-verification-forbidden | PASS | Later signed 403 keeps denied authority and obsoletes old result |
| Q5-C-held-positive-write-replacement | PASS | Held AUTH write cannot commit before later valid replacement; final owner is B |
| Q5-C-held-positive-write-forbidden | PASS | Held AUTH write cannot commit before later 403; final authority remains denied |
| Q6-final-public-return-fence | PASS | Exact post-checkpoint microtask fence makes old return obsolete; B completes and owns |
| Q7-renewal-retained | PASS | Online renewal returns new FRESH payload and replaces signed envelope |
| Q7-provider-replay-retained | PASS | Work-facing guards add zero provider/control-plane calls |
| Q7-no-offline-work-retained | PASS | Stale cache never grants offline Work |

Group outcomes: `Q1 PASS`, `Q2 PASS`, `Q3 PASS`, `Q4 PASS`, `Q5 PASS`, `Q6 PASS`, `Q7 PASS`. No prescribed case exposed a production defect.

## Verification and provenance

| Check | Result | Provenance |
|---|---|---|
| Focused policy source/extracted | PASS | Fresh composed source and extracted routes; stable ledger above |
| I1 checker | PASS | Local `tooling/checks/extension_i1.py`, 100 gate processes |
| Core checker | PASS | Local `tooling/checks/extension_core.py`, 111 gate processes |
| `docs:check` | PASS | Local docs checker |
| `bridge:guard` | PASS | Local bridge boundary guard |
| `openapi:check` | PASS | Underlying `@product/api openapi:check`; Corepack supplied the pinned pnpm runner |
| Native source/extracted | UNKNOWN | Not rerun; prior remote receipt remains separate |
| Installed-local acceptance | UNKNOWN | Not rerun |
| Current-task remote CI | UNKNOWN | No executor authentication; no rerun or cancellation; architect gate remains |

Previously supplied remote R1 jobs remain historical: I1 run `35069793516` and extension/docs completed logs were not rerun; server and WB-browser jobs were still in progress at review. No all-green claim is made.

## Package and byte identity

Current default-development composition receipt: `1834654` bytes, SHA-256 `2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de`; repeat archive matched and source/extracted bytes matched. This is the current local default receipt, not the separately supplied native receipt (`1835439` bytes, SHA-256 `d3aa2c954b483d6d7b22ddea5bd2e4d09e1adb91738c7e399c0d6f5afb5e5352`).

Production client inventory comparison: `packages/control-client/src/client.js` is unchanged from start to candidate and has blob `5f6a195048e257304c16fb92a25c4ff772d98fe0`. Only the allowlisted test/harness files and evidence/documentation files are changed. Old root/R1 result JSON files are preserved.

Normal fast-forward publication is pending architect review; no merge, force push, deployment, release, or acceptance beyond this local evidence is claimed.
