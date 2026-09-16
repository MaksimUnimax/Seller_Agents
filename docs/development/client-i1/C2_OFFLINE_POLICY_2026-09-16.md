# C2.2-A verified cached-bootstrap acquisition

Status: `IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING` for task `SA-I1-C2-2A-20260916-01` on the exact integration head supplied by the architect.

This bounded layer keeps public `bootstrap()` online-only and adds privileged `bootstrapWithPolicy()`. The latter performs the same verified online bootstrap first and returns `{ source: "ONLINE", freshness: "FRESH", payload }` on success. Cache acquisition is eligible only for a private registered no-response rejection from `/v1/bootstrap`, a preflight `/v1/auth/refresh` no-response rejection before any bootstrap 401, or HTTP 503 with exactly `BOOTSTRAP_UNAVAILABLE`.

Fetch URL, headers and serialized body are prepared outside the fetch catch. A private `WeakMap` records the actual endpoint only for the new `CONTROL_TRANSPORT_UNAVAILABLE` error. Received responses are never transport: body-read, size, JSON, HTTP, signature, profile, time, storage and programming failures retain their existing classifications. A refresh failure after bootstrap 401 cannot hide the known challenge; terminal 401/403 invalidation remains durable, and activation/exchange have no fallback.

The policy invocation captures generation, device/session, authority envelope, payload, cache binding, requested-AI context and cache clock. A private bootstrap-attempt sequence fences later raw or policy bootstraps. The captured envelope is reverified with the packaged trust ring; canonical payload equality, current environment, exact binding, owned clock and requested-AI context are required. Missing requested AI is account-only context and cannot borrow a resolved AI snapshot.

The existing mutation queue and `seller_agents_control_auth_v2` record provide the only durable checkpoint. Effective time is advanced in memory before persistence; `effective < expiresAt` is `FRESH`, `expiresAt <= effective < offlineGraceUntil` is `STALE_BUT_OFFLINE_GRACE_ELIGIBLE`, and grace equality or later is `CACHE_EXPIRED`. Completion sampling can veto or reclassify a result but is not claimed durable until a later checkpoint. Failed denied writes attempt existing AUTH removal and return `AUTH_DENIAL_PERSISTENCE_FAILED` when durability cannot be made honest.

This API returns verified configuration only. It does not set `authority.workAllowed`, `runtimeLastCheckpointAllowed`, or an authority-change grant, and is not wired into Work consumers or dispatch. Signed capability/profile consumption, offline Work, command/result completion and scheduler integration remain subsequent C2 work. The focused test uses real Ed25519 fixture signatures and test-only barriers on both source and extracted routes.

## R1 correction ledger

The initial candidate receipt’s broad A–H declaration was incomplete. R1 records the endpoint-bound 503 provenance control, successful-write obsolescence control, public-return fence, local/body-failure control, both AUTH set/remove outcomes, and context dimensions in `docs/migration/evidence/extension-i1-c2-2a-2026-09-16/r1/README.md`. The original result JSON remains historical evidence and is not rewritten.
