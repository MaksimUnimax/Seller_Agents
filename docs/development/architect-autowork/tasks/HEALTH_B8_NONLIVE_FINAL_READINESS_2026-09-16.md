# SA-HEALTH-B8-NONLIVE-FINAL-READINESS-20260916-01

Roadmap: P8.4 / B8_FULL_P8_4_ACCEPTANCE — NON-LIVE FINAL READINESS ONLY

This is a bounded final-readiness/evidence task while B7 controlled-live H3 is externally blocked on the dedicated Health account/session prerequisite. It MUST NOT claim B8 PASS or P8.4 ACCEPTED. It closes every independently startable non-live P8.4 criterion so that the remaining blocker is explicit and singular.

## Repository / branch / exact base

Repository: MaksimUnimax/runtime-fixtures
Stable repository ID: 1369117174
Branch: feature/server-health-h3-p8-4
Required exact starting remote head/base: the architect-accepted B6 head reported in the B6 final review; expected candidate at preparation is 697eea7adc337e1f11def16818829c2e443efb15 with tree 40552ecc3475a183b6b14dfffcee77d033e743b6 and parent bf3c27a817c7e4698f539ff5cacc1db73c833710.
P8.4 pre-B1 comparison base: de41f33646d5dd61bcae66624225e16538fd8f3a.
Current main snapshot at preparation: bc718cc5c677ad0eb4598e7de3ad766473ff0847.

Do not start until the architect has accepted B6 on its exact-head remote CI. Fetch current refs first and require the Health remote to equal the accepted B6 head exactly. If it differs, STOP and report.

## B7 blocker is preserved, not bypassed

Read the control reference docs/development/architect-autowork/references/HEALTH_B7_LIVE_PREREQUISITE.md from the architect control branch.

B7 requires an owner-approved dedicated Health account/session/profile only. Never use a customer/owner normal ChatGPT browser profile, copied cookies/storage/tokens, seller/marketplace credentials, raw provider-login automation, CAPTCHA/anti-bot/auth/geoblock bypass, or the old structural Opera capture as live acceptance.

Make ZERO live ChatGPT/provider/marketplace/customer-session calls in B8.

B8 may conclude only:

- P8.4_NONLIVE_FINAL_READINESS = PASS, if every criterion below passes;
- P8.4_FULL_ACCEPTANCE = BLOCKED_B7_LIVE;
- P8.5 = NOT_STARTED.

It must never convert the external B7 blocker into PASS/skip/waiver.

## Architecture/evidence authorities

Read and reconcile the exact-base versions of:

- docs/server/B1_SAFE_PACKAGED_H3_ACTION_VOCABULARY_EVIDENCE_2026-09-14.md
- docs/server/B2_GENERIC_H3_EXECUTION_ENGINE_EVIDENCE_2026-09-14.md
- docs/server/B3_CHATGPT_STANDARD_H3_EVIDENCE_2026-09-14.md
- docs/server/B4_CHATGPT_WORK_H3_EVIDENCE_2026-09-15.md
- docs/server/B5_SANITIZED_H3_EVIDENCE_INTEGRATION_2026-09-15.md
- docs/server/B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION_2026-09-16.md
- docs/server/evidence/health-b5-gate-r1-2026-09-16/**
- docs/server/evidence/health-b5-time-r1-2026-09-16/**
- docs/server/evidence/health-b5-c11-r2-2026-09-16/**
- docs/server/evidence/health-b6-spdr-2026-09-16/**

Read current Health source/test authority needed to map the final diff:

- apps/health-runner/**
- tests/e2e/server/health-h2.spec.ts
- tests/e2e/server/health-standard-h3.spec.ts
- tests/e2e/server/health-work-h3.spec.ts
- tests/e2e/server/support/health-standard-h3-fixture.ts
- tests/e2e/server/support/health-work-h3-fixture.ts
- tests/integration/server/h3-health-persistence.integration.test.ts
- packages/server/db/src/health-persistence.integration.test.ts

Do not edit any production/test source.

## Final non-live acceptance matrix

### FR-01 — complete accepted stage chain

Establish the exact B1→B6 accepted chain from Git/evidence and record each accepted stage purpose:

- B1 closed safe packaged action vocabulary;
- B2 common H3 engine;
- B3 Standard strategy/profile deterministic acceptance;
- B4 Work strategy/profile authority and deterministic acceptance;
- B5 strict sanitized mapping/persistence, PostgreSQL isolation, timestamp correction and C11 provenance closure;
- B6 security/privacy/deterministic regression.

Do not infer B7/B8 acceptance.

### FR-02 — full P8.4 implementation diff

Compare exact pre-B1 base de41f33646d5dd61bcae66624225e16538fd8f3a to accepted B6 head.

Architect preparation observed: ahead 28 / behind 0 / merge base exactly de41f336... . Recompute and record actual values.

Inventory every changed path by top-level subsystem and verify the diff remains within expected Health implementation/test/evidence scope. Explicitly flag and STOP on unexpected extension runtime, marketplace adapters, shared contracts, API/portal/admin/worker production, migration/DDL, site/SEO/domain, private-control, README.md/AGENTS.md/docs/README.md/CHANGELOG.md or deployment/release changes attributable to this P8.4 chain.

Historical allowed Health-support changes include health-runner source/tests, Health Chromium fixtures/specs, H3 PostgreSQL tests, the specific health-persistence integration fixture correction, and docs/server Health evidence.

### FR-03 — architecture closure

Prove the current source retains:

- one closed semantic H3 action vocabulary;
- one common H3 engine;
- distinct Standard and Work packaged profiles/strategies;
- exact target/surface/profile mismatch fences;
- exactly one irreversible Send/no resend;
- terminal cleanup;
- bounded timeout/failure classifications;
- no generic browser executor authority;
- controlled HTTP(S) target/origin/navigation policy.

### FR-04 — security/privacy closure

Reconcile B6 SPDR-01..SPDR-11 with current unchanged source blobs. Confirm no post-B6 production/test changes have invalidated them.

Require:

- fresh ephemeral controlled browser contexts;
- no customer-session reuse;
- no raw browser handle escape;
- no raw prompt/response/full conversation/DOM/HTML/cookie/token/storage/seller/provider payload persistence;
- no fake bounded-fragment evidence;
- opaque bounded evidence references only;
- strict source schemas and toxic-field rejection.

### FR-05 — deterministic fixture closure

Confirm current Standard and Work local fixtures remain production-semantic mirrors rather than fixture-coupled success paths. Reconcile the accepted B3/B4 negative matrices, one-Send counters, Standard/Work isolation, conversation/workspace drift handling, completion fail-closed behavior and code/Copy ownership.

### FR-06 — persistence/classifier closure

Confirm B5 durable behavior:

- strict C01-C13 typed contour mapping;
- independent C09-C12 persistence;
- C11 failed selected URL fallback retained and required-core BROKEN classification;
- no C11 failure evidence;
- no B5 dedup/idempotency leakage into P8.5;
- parsed instant chronology rather than lexical timestamp ordering;
- PostgreSQL isolation/readback remains covered.

### FR-07 — exact remote CI and local evidence reconciliation

Use the architect-accepted exact-head B6 Server CI as the current code/test acceptance authority. Record exact run/job/head/conclusion and successful required steps.

Reconcile B6 focused local results (98 unit/security, 18 focused PostgreSQL, 92 local Chromium, all required no skips) with source blob identities. Do not rerun the full local repository cycle merely to repeat already-green unchanged source.

### FR-08 — remote readback

Read back from GitHub the exact accepted B6 head, tree, parent and all new B6 evidence blobs. Confirm remote byte/content authority exists for the evidence used by this final-readiness audit.

### FR-09 — forbidden-path / secret / privacy audit

Audit the complete P8.4 diff and all B8 evidence for:

- forbidden unrelated scopes;
- actual credential/token/key/cookie/storage material;
- raw real project/conversation/account/seller identifiers;
- raw ChatGPT conversation/prompt/response text;
- screenshots/DOM dumps/browser storage;
- provider or marketplace payloads.

Do not treat ordinary documentation words such as “token” or “cookie” as secret evidence; identify actual value-shaped sensitive material. Evidence must remain sanitized.

### FR-10 — live blocker precision

Record B7 as BLOCKED_EXTERNAL_PREREQUISITE with exact missing condition:

an owner-approved dedicated Health account/session/profile plus a sanctioned controlled-runner session mechanism that preserves the accepted ephemeral/security boundary and does not require customer-session reuse or security-control bypass.

The accepted B4 Opera capture is structural authority only and is NOT live acceptance.

### FR-11 — final readiness verdict

If FR-01..FR-10 non-live checks pass:

- verdict P8.4_NONLIVE_FINAL_READINESS = PASS;
- verdict B7_CONTROLLED_LIVE_H3 = BLOCKED_EXTERNAL_PREREQUISITE;
- verdict B8_FULL_P8_4_ACCEPTANCE = BLOCKED_B7_LIVE;
- P8.4 overall = NOT_ACCEPTED;
- P8.5 = NOT_STARTED.

Do not self-promote any blocked status to PASS.

## Execution / checks

This task is evidence-only over unchanged accepted B6 source. Do NOT rerun full unit/integration/E2E/build locally.

Required new checks:

1. exact Git ancestry/full diff and path inventory from de41f336... to accepted B6 head;
2. exact source/evidence blob readback used by FR-01..FR-10;
3. parse results.json;
4. pnpm docs:check after B8 evidence is written;
5. git diff --check;
6. exact changed-path allowlist check against accepted B6 base;
7. bounded secret/privacy scan/review of the B8 evidence and complete P8.4 changed-path set.

A contradiction in accepted evidence/source, unexpected forbidden P8.4 path, actual secret/raw data, or stale/missing exact-head CI/readback is a STOP/FAIL, not an invitation to patch runtime inside B8.

## Allowed changes

ONLY:

- docs/server/B8_P8_4_NONLIVE_FINAL_READINESS_2026-09-16.md
- docs/server/evidence/health-b8-final-readiness-2026-09-16/README.md
- docs/server/evidence/health-b8-final-readiness-2026-09-16/results.json

No production/test/package/workflow/migration changes.
No B1-B6 evidence rewrites.
No B7 live attempt.
No README.md, AGENTS.md, docs/README.md, CHANGELOG.md, docs/ROADMAP.md, SERVER_CODEX_HANDOFF.md, site/SEO/domain or private workspace-control changes.

## Publication

Create bounded evidence-only commit(s), fetch immediately before push and require remote Health still equals the accepted B6 base. Normal fast-forward only to the same branch. If HTTPS credentials alone fail, the already-approved one-shot GitHub SSH-over-443 path may be used without changing stored repository configuration or disabling host-key verification.

No force, replacement branch, PR, main merge, deployment or release.

After push verify exact remote final SHA and clean worktree. Report immediately observable Server CI run/job/status if any; do not rerun or wait-loop it. Architect will review exact-head CI.

## Terminal report — then STOP

Return:

- task ID / roadmap coordinate;
- worktree and exact starting refs;
- FR-01..FR-11 matrix;
- exact P8.4 ancestry and commit/path inventory summary;
- exact accepted B1-B6 stage/evidence identities;
- exact accepted B6 CI run/job/head/conclusion;
- remote blob/readback proof summary;
- forbidden-path and secret/privacy audit result;
- exact B7 missing external prerequisite;
- explicit no live calls/customer sessions/security bypass;
- JSON/docs/diff/allowlist results;
- final evidence commit/head/tree/parent and changed path stat;
- remote before/after and immediate CI status;
- clean final worktree;
- zero production/test/package/workflow/migration changes;
- P8.4_NONLIVE_FINAL_READINESS PASS/FAIL;
- B7 BLOCKED_EXTERNAL_PREREQUISITE;
- B8 BLOCKED_B7_LIVE;
- P8.4 NOT_ACCEPTED;
- P8.5 NOT_STARTED.

Do not start P8.5. Do not start another task. STOP after terminal report.