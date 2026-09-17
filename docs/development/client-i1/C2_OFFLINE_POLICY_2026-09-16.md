# C2.2-A verified cached-bootstrap acquisition

Status: `ACCEPTED / REMOTE VERIFIED` for task `SA-I1-C2-2A-20260916-01`. Architect acceptance and exact-tree remote readback are recorded in `docs/migration/evidence/extension-i1-c2-2a-2026-09-16/r4/README.md`.

This bounded layer keeps public `bootstrap()` online-only and adds privileged `bootstrapWithPolicy()`. The latter performs the same verified online bootstrap first and returns `{ source: "ONLINE", freshness: "FRESH", payload }` on success. Cache acquisition is eligible only for a private registered no-response rejection from `/v1/bootstrap`, a preflight `/v1/auth/refresh` no-response rejection before any bootstrap 401, or HTTP 503 with exactly `BOOTSTRAP_UNAVAILABLE`.

Fetch URL, headers and serialized body are prepared outside the fetch catch. A private `WeakMap` records the actual endpoint only for the new `CONTROL_TRANSPORT_UNAVAILABLE` error. Received responses are never transport: body-read, size, JSON, HTTP, signature, profile, time, storage and programming failures retain their existing classifications. A refresh failure after bootstrap 401 cannot hide the known challenge; terminal 401/403 invalidation remains durable, and activation/exchange have no fallback.

The policy invocation captures generation, device/session, authority envelope, payload, cache binding, requested-AI context and cache clock. A private bootstrap-attempt sequence fences later raw or policy bootstraps. The captured envelope is reverified with the packaged trust ring; canonical payload equality, current environment, exact binding, owned clock and requested-AI context are required. Missing requested AI is account-only context and cannot borrow a resolved AI snapshot.

The existing mutation queue and `seller_agents_control_auth_v2` record provide the only durable checkpoint. Effective time is advanced in memory before persistence; `effective < expiresAt` is `FRESH`, `expiresAt <= effective < offlineGraceUntil` is `STALE_BUT_OFFLINE_GRACE_ELIGIBLE`, and grace equality or later is `CACHE_EXPIRED`. Completion sampling can veto or reclassify a result but is not claimed durable until a later checkpoint. Failed denied writes attempt existing AUTH removal and return `AUTH_DENIAL_PERSISTENCE_FAILED` when durability cannot be made honest.

This API returns verified configuration only. It does not set `authority.workAllowed`, `runtimeLastCheckpointAllowed`, or an authority-change grant, and is not wired into Work consumers or dispatch. Signed capability/profile consumption, offline Work, command/result completion and scheduler integration remain subsequent C2 work. The focused test uses real Ed25519 fixture signatures and test-only barriers on both source and extracted routes.

## R1 correction ledger

The initial candidate receipt’s broad A–H declaration was incomplete. R1 records the endpoint-bound 503 provenance control, successful-write obsolescence control, public-return fence, local/body-failure control, both AUTH set/remove outcomes, and context dimensions in `docs/migration/evidence/extension-i1-c2-2a-2026-09-16/r1/README.md`. The original result JSON remains historical evidence and is not rewritten.

## R2 test/evidence addendum

Task `SA-I1-C2-2A-R2-20260916-01` extends the acceptance ledger without changing the production client. The test records stable per-case outcomes and covers the assigned Q1 classification rows, Q2 fixed-time boundaries and restart floors, Q3 first-floor storage/IDB/catalog retention, Q4 signed context distinctions, Q5 asynchronous ownership barriers, and Q6 the final public-return fence. The shared worker harness forwards existing clock/IDB options and provides only a test-only `beforeCryptoVerify` barrier; production closure state is not exposed.

The focused policy suite passed on both source and extracted composed runtimes under the local Node `v22.22.2` toolchain. The full local I1 checker passed `100` processes, and the shared core checker passed `111` processes. `docs:check`, `bridge:guard`, and the underlying `@product/api openapi:check` passed. The production client source remained byte-identical to the supplied start: blob `5f6a195048e257304c16fb92a25c4ff772d98fe0`. Historical R2 provenance remains in `r2/README.md` and `r2/results.json`.

## R3 factual correction

R3 repaired the retained-artifact proof so the fixture artifact is written once and then checked through readonly gets, made the durable AUTH/account ownership assertions exact, separated a legitimate signed account replacement from stale-account fallback obsolescence, and strengthened held-cache race/final-return fencing. Source and extracted policy suites are `37/37 PASS` each across Q1–Q7. The destructive retention negative control remains an expected failure and does not replace the normal PASS. Historical R2/R3 result files remain unchanged.

## Architect acceptance — 2026-09-17

C2.2-A is accepted for this configuration-acquisition scope only. The accepted implementation tree is `531033ac08f001dd55427c4ae969a6c4b5d6b861`, reached on integration head `5d93bccac163c8728a8d7a3b1d4b9f23ea16b680` after merging current canonical `main` `bc718cc5c677ad0eb4598e7de3ad766473ff0847` without force-push/rebase/reset.

Exact-tree remote evidence is green: all seven workflow runs completed successfully; Extension I1 has `100/100 PASS`; native Chromium and the installed local API/portal/PostgreSQL harness pass; Server CI passes lint, format, typecheck, unit, PostgreSQL integration, migrations, OpenAPI, bridge guard, build and browser E2E; Extension CI passes common core, Ozon/WB baselines including WB browser fixtures, and native application-browser coverage. The deterministic development ZIP is `1,834,654` bytes with SHA-256 `2c1f5765b0eb382d9387e3ea1a59e71bd549344f10c107a39069d92719f341de`, with 39/39 runtime/extracted/ZIP file parity and zero byte mismatches.

No owner/manual test is required for this bounded step: all acceptance criteria are covered by deterministic source/package/native/installed-local/remote evidence. Real email, preprod, live provider and broader installed/live-product acceptance remain later roadmap scopes, not manual residues of C2.2-A.

This acceptance still does **not** authorize offline Work, profile/capability execution, joint offline command/result behavior, provider replay, scheduler integration, S1.2, D3, full I1/D2, deployment or release.
