# I1-SRV.5 architect review — 2026-09-16

Verdict: REWORK_REQUIRED on b0d93e36b2c7f37a4758ea4b33dbfa9cf2c688bb; no acceptance of I1-SRV.5.

## Exact candidate
Repository MaksimUnimax/Seller_Agents; branch feature/server-i1-srv5-acceptance-2026-09-16.
Actual main/base 5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c. The terminal report and some docs omitted the last character; Git ancestry independently confirms the full SHA.
Commits 3710aeeef82314fff37e914833ca280ad5f56ab7 -> b0d93e36b2c7f37a4758ea4b33dbfa9cf2c688bb; final tree 9ebcf18e4d0c24d7058a8b730a7e18a74ff950b6.
All eight changed paths are within the original task allowlist. No production changes.
Architect created draft PR8 after confirming no existing PR for this branch. PR7 untouched. PR8 merge d86a0bcfc55552454af1f84dc8d27f0f7c7c6fa0 has parents current main and candidate; tree equals candidate.

## Source review
The joined test retains activation via portal fixture, single V2 release, copied credentials, strict signed account identity, unchanged-signature tamper, unknown key, request injection/device mismatch, refresh continuity, portal revoke and terminal denial. It does not replace the V1 simulated offline path or claim installed extension evidence.
Read the exact candidate diff, current task/cursor/roadmap, bootstrap.spec.ts, support/fixtures.ts, support/database.ts, playwright.config.ts, config regression and simulated client refresh/verifier implementation.

## Proven blocker and architect correction
playwright.config.ts generates Ed25519 K1/K2 and overwrites CONFIG_SIGNING_PUBLIC_KEY_RING_JSON at module evaluation. Playwright 1.62.1 workerProcessEntry sets TEST_WORKER_INDEX before deserializeConfig, so worker import generates different public keys than the runner API private ring. The new test correctly follows the earlier architect instruction to read the environment, but that instruction assumed the existing fixture preserved the runner public ring. The architect owns this incorrect assumption.

Independent reproduction uses the candidate key-generation section with the same Playwright 1.62.1, one actual test worker and no API/DB/browser:
- BASE: WORKER_PUBLIC_RING_EQUALS_RUNNER=false; expected true; process exit1.
- FIX: WORKER_PUBLIC_RING_EQUALS_RUNNER=true; 1 passed; process exit0.
Node24.19.0 locally, versus executor24.20.0. This is a Playwright process/environment reproduction, NOT server E2E, installed browser, or provider evidence.
The replacement skips pair/private-ring generation in workers, preserves inherited public JSON, fails setup when absent, and conditionally supplies the private ring only to the runner's API webServer config.
Add an actual Playwright regression comparing inherited K1 DER with disposable API public signing metadata. It must never populate trust from DB or response. Existing lifecycle assertions remain strict.

Portable probe inputs are in I1_SRV5_PROBE/: base/fixed configs use standard @playwright/test imports; key-lifecycle.spec.ts asserts equality only. For the recorded local execution only the import path was mapped to the runtime-installed identical Playwright package. No private keys or raw envelopes are persisted.

## CI and environment
Server push35043545567/job104628447057 completed FAILURE. Integration (39 files/1527 tests), migration, OpenAPI, bridge and build passed. Full E2E: 86 passed, 1 failed; the new reference scenario fails at line86 firstVerification expected ok:true, received ok:false. Exact checkout b0d93e36 confirmed in job log. This independently corroborates the worker-key reproduction. PR server35043813324/job104629216114 remains in progress at latest read; no conclusion claimed.
Documentation35043813323/job104629215980 SUCCESS.
Initial in-progress log download returned BlobNotFound404. After job completion the full log was retrieved successfully and the exact assertion failure inspected. Sanitized excerpt: I1_SRV5_FAILURE.txt.
Executor's local PostgreSQL disk-exhaustion BLOCKED remains historical. Remote PostgreSQL is healthy. No shared cleanup attempted.
Exact snapshots in I1_SRV5_CI.json. Applicable skipped import step is not relabeled PASS.

## Next action and boundaries
One task SA-I1-SRV5-R1-20260916-01 prepared for a single final Bridge submission; no direct delivery/process claim. Previous task terminal explicitly says stopped. Reuse existing branch and PR8. No main merge, PR7 changes, C2 launch, Health changes, release or deployment.
C1 remains ACCEPTED in its prior bounded scope; Health/P8.4 B5 remains NOT ACCEPTED, B6–B8 queued. After corrected SRV5 acceptance continue C2/joint integration per cursor.
