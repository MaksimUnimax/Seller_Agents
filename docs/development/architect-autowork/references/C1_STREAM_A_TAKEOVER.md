# Stream A transfer to the extension architect

Date: 2026-09-15.

## Owner direction and boundaries

The owner supplied the outgoing Stream A architect's final report and said that the first Codex stream is being stopped and its remaining work is transferred here. This architect now owns extension integration and the remaining Stream A architecture, task decomposition, review and acceptance. The coding executor continues to implement concrete tasks in manual mode. Automatic Business Bridge operation has not been enabled by the owner. Stream B remains separately owned and active until explicitly transferred or stopped.

Do not stop other processes, clean shared Docker resources, edit Stream B branches or change Health/P8 runtime ownership. Do not send a second overlapping task to an executor still running a previous task.

## Inherited server baseline

- Main: `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`.
- Corrected I1-SRV.4 candidate: `f2f7be25393f2d6b3794b8423d7a2701a7c37bdc`.
- Merge: PR #6; parents are `bc0cd0088ca50ba06021ea602a46bdd90de91378` and the corrected candidate.
- Candidate/merge tree: `4dfcf1c3d3537091d741a7784f99ebee995e76cc`.
- Exact-head Server CI `34951442143`: success; inspected job steps include PostgreSQL integration, migrations and full server E2E.
- Exact-head Documentation CI `34951442176`: success.
- I1-SRV.0 through I1-SRV.4: accepted by outgoing architect and merged. Pending-review wording in current repository documents is stale against the supplied acceptance report.
- I1-SRV.5: not started. S1.2 real email/preprod and D3/store synchronization: not started.

The inherited acceptance report was corroborated with the remote commit/tree/CI evidence. This transfer does not claim a second complete source audit of all preceding server stages.

## Current client result

I1-C1 head `2a98057646af52eee0f654997b3f60f6322dfb04` is **REWORK_REQUIRED**, not accepted. Draft PR #7 was created by this architect. `REVIEW.md`, `reproduce.mjs` and `reproduction-results.json` record eight independent source-level reproductions and additional CI/UI findings. No implementation or server branches were modified by the review.

## Execution order

1. Correct C1 lifecycle/state ownership, policy binding, verifier contract parity, fixtures and failing CI in the existing client branch. Prove installed local browser authentication, account isolation and preserved composed marketplace behavior. Keep PR #7 in draft for architect review.
2. Execute a bounded I1-SRV.5 server reference-client acceptance task from the then-current canonical main. Keep its server proof separate from browser-client implementation. A C1 contract blocker can cause the architect to move this step earlier; the executor does not invent an alternate protocol to bypass it.
3. Integrate C2 consumption of accepted signed Work/AI policy and durable offline/error behavior into the browser client; run joint installed acceptance against the accepted server and packaged trust bundle. Earlier C1 online login remains independently required.
4. Reconcile factual Stream A status documents in a separate closeout, preserving concurrent Stream B changes. S1.2 deployment/provider choices are a later task. Do not claim full I1, production email, preprod or release until their actual gates pass.

## I1-SRV.5 architectural scope prepared for the next executor task

Use the existing public API, PostgreSQL authority, token service, trust exporter and simulated-extension-client. Do not create a second auth stack, new HTTP errors, V3, a new account identity, migrations or server marketplace storage to make the tests easy.

One executable reference-client lifecycle must establish:

1. Isolated PostgreSQL/API/portal resources and deterministic development OTP delivery, explicitly distinguished from actual provider email.
2. Real device start, pending/Retry-After, portal OTP sign-in, approval and exchange through public contracts.
3. Real access/refresh use, strict signed V2 verification with separately exported and pinned release trust, canonical accountId matching durable subject, and BETA without a fake commercial subscription.
4. Successful refresh rotation plus lost-response retry using the same persisted idempotency key, replay-window behavior and terminal rejection outside the accepted semantics. No test-only bypass of durable server authority.
5. Fresh cache, exact expiry/grace boundaries, eligible transport and audited BOOTSTRAP_UNAVAILABLE fallback, context mismatch, denied capability intersection and incompatibility. A valid live response is not rejected solely because optional cache persistence fails.
6. Persistence before cached ALLOW, repeated effective-time high-watermark advancement, restart/clock rollback, expiry persistence and write-failure behavior. Real signature verification must precede policy evaluation in the lifecycle evidence.
7. Online revoke followed by access/refresh/bootstrap denial, durable terminal cache invalidation and restart denial; unrelated account/device remains usable. Explicitly distinguish an unseen revoke during true offline operation from a locally observed terminal result.
8. Wrong trust/key/signature/schema/account binding, incompatible signed policy and unauthorized responses cannot be bypassed with stale cache.

Reuse focused negative tests where they already prove a contract; add missing orchestration and boundary evidence. Do not create a large mirror suite or weaken existing tests. Full exact-head server/documentation CI and merge/readback must support final acceptance. Emit `STREAM_A_I1_SERVER_REACHED_SYNC_BOUNDARY` only after architect acceptance of I1-SRV.5. This marker hands the contract to the same architect's browser integration work; it does not authorize autonomous S1.2, D3 or Health/P8 development.
