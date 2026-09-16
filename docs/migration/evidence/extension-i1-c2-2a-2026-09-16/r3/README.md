# C2.2-A evidence receipt — R3

Task: `SA-I1-C2-2A-R3-20260916-01`  
Branch: `integration/i1-c1-srv5-2026-09-16`  
Exact start: `edc70704cec965b9e7bc58ca4d3c961834573517`  
Start tree: `3aaad9a0fd29649f492ebb0cd3152236f2475dcc`  
Parent: `d927b2498262798f03d2fa9f0accf9c62fbaaad0`  
Test commit: `fc31792360d004d1a18b009ff6c3c51b8bd1eefd`  
Status: `PASS / ARCHITECT_REVIEW_PENDING`

## Scope

R3 changes only `client-offline-policy.mjs` plus append-only evidence. Production, `worker-harness.mjs`, workflows, dependencies, public presentation, server runtime, and private control repository remain unchanged.

## Corrected proof

- R3-1 `Q3-A-first-floor-both-storage-fail-and-idb-retention`: the fixture artifact is put once with `created_at_ms=T0` and `expires_at_ms=T0+3600000`; every later normal assertion is a readonly get. The seed write count remains exactly one after both AUTH set/remove failures, original-worker recovery, crash-branch restart, and successful checkpoint. The normal scenario passes. A disposable scratch clear immediately before a readonly assertion produces the expected assertion failure (`get === undefined`) and is recorded as `EXPECTED_FAIL`; it is not part of the normal fixture path.
- R3-1 preserves the exact catalog marker and AUTH failure codes. The original worker rolls back wall time to `T0-100` while monotonic time remains `1100` and persists `T0+100`. The separate failed-backing branch restarts at the old floor and then performs a normal `T0+100/1100` checkpoint; its limitation is explicit.
- R3-2 `Q2-D-rollback-consumed-grace-restart`: policy itself returns `CACHE/FRESH` at `T0+500/1500`, then `CACHE/STALE_BUT_OFFLINE_GRACE_ELIGIBLE` at `T0-500/2500`; durable floor is `T0+1500`. Restarted workers use explicit `/v1/bootstrap` responses with `BOOTSTRAP_UNAVAILABLE` 503. Grace equality rejects `CACHE_EXPIRED`, persists floor `>=T0+3000`, and a second rollback/restart still rejects. Fresh-only guard checks remain independent in Q2-C.
- R3-3 labels the existing correctly signed online account replacement as the positive `Q4-D-account-replacement-online-positive` case. `Q4-D-account-replacement-obsoletes-held-cache` holds real WebCrypto verification of cached A, commits signed B for account `99999999-9999-4999-8999-999999999999` with configVersion 2 and `serverTime=T0+1`, and proves exact durable B AUTH after A returns `CACHE_ACQUISITION_OBSOLETED`.
- Q5-B replacement and 403 variants snapshot durable AUTH after B settles and before releasing A, then deep-compare the complete record after A settles. Q5-C retains the queue-order assertion and compares signed B payload/envelope plus committed credentials, generation, and clock, or the exact denied authority with owned credentials.

## Actual source/extracted ledger

`results.json` contains the 37 per-case PASS records for both composed routes. Both routes produced these group outcomes:

| Group | Outcome | Retained/updated coverage |
|---|---|---|
| Q1 | PASS | Classification, signed-envelope, refresh, exact AUTH failures |
| Q2 | PASS | Expiry/grace boundaries, rollback persistence, fresh-only guards |
| Q3 | PASS | Actual retention, storage-failure boundary, recovery and crash branch |
| Q4 | PASS | No-authority/signed-out controls, online-positive replacement, stale-cache obsolescence |
| Q5 | PASS | Activation, cached verification, positive-write queue, exact B preservation |
| Q6 | PASS | Existing final-return fence |
| Q7 | PASS | Existing renewal, provider replay, and no-offline-work controls |

No case was missing, skipped, or failed. The Q3 scratch negative control is the only expected failure and is caught by the test while the unmodified scenario remains PASS. Q6 retains the positive assertion and cites the architect's already executed candidate-versus-single-final-fence-mutant proof; no executor mutant run is claimed.

## Validation and provenance

| Check | Result | Provenance |
|---|---|---|
| `extension_i1.py --output <new-task-owned-output>` | PASS | Node `v22.22.2`, 100 gate processes, source and extracted policy PASS, zero live provider calls |
| `pnpm docs:check` | PASS | pinned Corepack/pnpm tooling; 472 files, 247 Markdown files, 364 relative links |
| `pnpm bridge:guard` | PASS | pinned Corepack/pnpm tooling |
| `pnpm openapi:check` | PASS | pinned Corepack/pnpm tooling with nested pnpm shim in temporary PATH |
| Native/source-extracted suites | UNKNOWN | unchanged historical provenance retained; not rerun per task scope |
| Installed-local suites | UNKNOWN | not rerun per task scope |
| Current-task remote CI | UNKNOWN | no executor authentication; no rerun or cancellation |

## Package and runtime identity

Default development archive: `1834654` bytes, SHA-256 `2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de`. Repeat archive matched and source/extracted runtime bytes matched. This is the same required receipt; no ephemeral-key native receipt was substituted.

`packages/control-client/src/client.js` retains blob `5f6a195048e257304c16fb92a25c4ff772d98fe0` from start through final. `worker-harness.mjs` and all production inputs are byte-identical. Evidence receipt files are under this `r3/` directory; no ZIP or secrets are published.

## Remote/publication facts

After fetch, `origin/integration/i1-c1-srv5-2026-09-16` was `ec9c23da45091255e0ba53914b3682539ef0b797`, an ancestor of the local R3 start; no advanced remote ref was overwritten. Current fetched `origin/main` was `e5f302d2d0334a106fa046b8dee4e8df6e38e583`, distinct from the historical observed-main value and untouched. Existing draft PR9 is reused; no merge, rebase, force push, CI rerun/cancellation, deployment, or release is claimed.

Machine-readable route/probe and package receipts are in `probes/policy-routes.json`, `receipts/extension-i1.json`, and `results.json`. Stop here for architect review.
