# HEALTH B5 TIME-R1 acceptance and C11 failure-provenance review — 2026-09-16

## Scope

Independent architect review after publication of SA-HEALTH-B5-TIME-R1-20260916-01, followed by bounded design of the remaining B5 C11 provenance correction. This document is control-context evidence only; it is not product implementation and does not accept whole B5.

## TIME-R1 exact candidate

Repository: MaksimUnimax/runtime-fixtures (ID 1369117174).
Branch: feature/server-health-h3-p8-4.
Accepted base before TIME-R1: d8f5157696d137750176d1aa44aedf9c2116404e.
Code commit: 63bd01b60449658ca56beffd4ffd4e0bda03f969.
Final commit: f8b35fdec3212dedf0e186830e4af21c719d890d.
Final tree: e8ecb16f857fcdbafc29889ae4a4fd37d54c1b8c.
Final parent: 63bd01b60449658ca56beffd4ffd4e0bda03f969.

GitHub compare from d8f5157 to f8b35fde is ahead by exactly two commits, behind by zero, with the merge base equal to d8f5157. The changed-file set contains exactly ten paths and stays inside the TIME-R1 assignment: the H3 persistence mapper and unit test, H3 PostgreSQL integration test, B5 sanitized evidence document and the dedicated TIME-R1 evidence directory.

The production change is one chronology predicate in H3HealthPersistenceContextSchema.superRefine: allowed ISO timestamps continue to be validated as offset-aware strings, but chronology is now decided by Date.parse instant ordering rather than lexical string ordering. This correctly handles equal instants expressed with different offsets, offset inversions and fractional seconds while preserving the existing equality rule and all runtime/scope checks.

Mapper tests add the prescribed A–F cases for both ChatGPT Standard revision 2 and ChatGPT Work revision 1 plus ordinary invalid syntax/timezone/equality controls. PostgreSQL tests add accepted A/C/E round trips for both surfaces and reverse B/D pre-write rejection with row counts unchanged. No migration, Health classifier, schema catalog, browser strategy, API/OpenAPI or extension runtime change is part of TIME-R1.

## TIME-R1 remote acceptance gate

Exact final-SHA Server CI run 35090148436, job 104774285365, head f8b35fdec3212dedf0e186830e4af21c719d890d completed SUCCESS at 2026-09-16T11:35:10Z.

Observed successful steps: dependency install, lint, format:check, typecheck, Playwright config regression, pnpm test, pnpm test:integration, db:migrate, openapi:check, bridge:guard, build, Playwright Chromium install, pnpm test:e2e, post actions and container cleanup. The feature-branch-only frozen-import verification was conditionally SKIPPED; it is not a failed acceptance gate.

Executor evidence reported 29/29 mapper GREEN after ten expected RED assertions, 16 focused PostgreSQL cases, full integration 1524/1524, E2E 162/162, documentation check, clean worktree and zero live-provider calls. Independent acceptance relies on source/diff review plus the exact-SHA remote CI above, not on executor self-assessment alone.

Verdict: SA-HEALTH-B5-TIME-R1-20260916-01 ACCEPTED in timestamp chronology scope only.

Whole P8.4/B5 remains REWORK_REQUIRED because the separately identified C11 failure-provenance defect is still present on f8b35fde.

## C11 source diagnosis

C11_CONVERSATION_IDENTITY is a required CORE contour. Its catalog definition uses primary strategy CONVERSATION_IDENTIFIER with declared fallback CONVERSATION_URL_IDENTITY.

Both current browser strategies evaluate URL/route identity during VALIDATE_BRIDGE_SURFACES. In each strategy the C11 observation has these semantics when identity succeeds:

- primaryStrategyOutcome = FAIL;
- fallback result CONVERSATION_URL_IDENTITY = PASS;
- selectedStrategyId = CONVERSATION_URL_IDENTITY;
- fallbackQuality = APPROVED_EQUIVALENT;
- structuralOutcome = PASS;
- behavioralOutcome = PASS.

That is a valid representation of an approved fallback and the Health classifier correctly maps the resulting contour finding to DRIFT.

When the late identity check fails, however, both strategies currently retain the fallback attempt with outcome FAIL and retain fallbackQuality APPROVED_EQUIVALENT, but set selectedStrategyId to null. H3ContourObservationSchema explicitly requires any non-NOT_APPLICABLE fallbackQuality to have a selected fallback result. The observation therefore throws during construction.

The strategy-level #safe wrapper catches that schema exception and returns a bare FAIL result. The generic H3 engine does preserve observations on ordinary failed strategy results, but receives an empty observation array in this case. Consequently the VALIDATE_BRIDGE_SURFACES event loses not only C11 provenance but the already-computed C09, C10 and C12 observations as well.

This is a production-observability/Health-truth defect, not merely a test-shape issue: B5 persistence cannot reliably distinguish the required-core C11 failure because the source strategy destroys its bounded provenance before the mapper.

## Chosen correction

No schema or classifier change is justified. The current schemas already support a selected fallback whose attempt outcome is FAIL, and the classifier already classifies a required CORE failed contour as BROKEN. The fallbackQuality field describes the quality/equivalence of the fallback strategy, not whether that fallback attempt passed.

The minimum correct change is therefore identical in both standard-h3-strategy.ts and work-h3-strategy.ts: for the C11 observation, selectedStrategyId is always CONVERSATION_URL_IDENTITY because that fallback strategy was actually evaluated. Keep the fallback attempt outcome conditional on identityPass; keep fallbackQuality APPROVED_EQUIVALENT; keep structural/behavioral outcomes conditional on identityPass; keep evidence METADATA only on pass and NONE on failure; keep primaryStrategyOutcome FAIL.

This preserves actual execution provenance and makes both success and failure objects schema-valid. An identity failure continues to fail the H3 step with BRIDGE_SURFACE_VALIDATION_FAILED, but now the failure event retains C09–C12. When mapped to Health, C11 is a present required CORE failure and the classifier returns BROKEN.

Rejected alternatives:

- changing fallbackQuality to NOT_APPLICABLE and leaving selectedStrategyId null would falsely erase the fact that the packaged fallback was attempted;
- weakening H3ContourObservationSchema would admit internally contradictory provenance everywhere;
- changing the catalog/classifier would hide an implementation bug rather than fix it;
- converting the late failure to environment uncertainty would be semantically wrong because this is deterministic product/surface identity drift, not an external login/network/checkpoint condition.

## Deterministic actual-strategy RED design

The test must prove the late identity-failure path is reachable in the real Standard and Work strategies, especially Work, whose validateBridgeSurfaces first performs an early ownership/route stability check.

Add one test-only fixture variant to each current H3 fixture, named IDENTITY_CHANGES_DURING_BRIDGE_VALIDATION.

For this variant only, install a narrowly scoped one-shot wrapper around Element.prototype.getAttribute in the fixture page. The wrapper delegates all normal behavior to the original method. It triggers only when the requested attribute name is aria-disabled and the target element is the accepted code-local native Copy button inside the generated response. On that first trigger, before returning the original attribute value, synchronously mutate both browser history and the canonical link to the same different valid conversation identity.

Standard mutation target: the fixture origin plus /c/<changed-conversation-id>.
Work mutation target: the fixture origin plus /g/g-p-test-project/c/<changed-conversation-id>, preserving the original project identity and changing only the conversation id.

Why this is deterministic and correctly placed:

- the code-local Copy control does not exist until the associated response has been inserted;
- Work's early #workOwnershipStable and first #belongsToBoundRoute(response) execute at the beginning of validateBridgeSurfaces before the code/copy disabled-state probe;
- Standard has already associated the response with the originally bound conversation;
- isDisabled/disabled performs a getAttribute("aria-disabled") probe on the selected native Copy control;
- the hook therefore changes identity after all early checks but before the later C11 identityPass evaluation;
- it does not change Copy visibility, enabled state, label, code token, composer, input or send control, so C09, C10 and C12 remain independently valid;
- both URL and canonical are updated together, avoiding a synthetic canonical-conflict failure.

Pre-fix expected actual-strategy RED: the overall run fails at VALIDATE_BRIDGE_SURFACES with BRIDGE_SURFACE_VALIDATION_FAILED and exactly one Send, but the bridge validation event has an empty observations array because the invalid C11 object is caught by #safe.

Post-fix expected actual-strategy GREEN for both Standard and Work:

- overall outcome FAIL;
- failureStep VALIDATE_BRIDGE_SURFACES;
- failureCode BRIDGE_SURFACE_VALIDATION_FAILED;
- exactly one physical Send;
- the VALIDATE_BRIDGE_SURFACES event contains exactly four observations in contour order C09, C10, C11, C12;
- C09 PASS;
- C10 PASS;
- C11 PRESENT with primary FAIL, fallback [{strategyId: CONVERSATION_URL_IDENTITY, outcome: FAIL}], selectedStrategyId CONVERSATION_URL_IDENTITY, structural FAIL, behavioral FAIL, fallbackQuality APPROVED_EQUIVALENT, environment VALID, uncertaintyReason null, evidenceKind NONE;
- C12 PASS.

## B5 durable regression design

Add a mapper-level regression in apps/health-runner/src/h3-health-persistence.test.ts using an explicit bridge-validation FAIL event that carries C09 PASS, C10 PASS, exact failed C11 fallback provenance above, and C12 PASS. Run it for both Standard revision 2 and Work revision 1. The mapper must preserve the exact C11 fallback fields, preserve the other bridge contours rather than losing them, and classify the Health input BROKEN.

Add matching PostgreSQL integration cases in tests/integration/server/h3-health-persistence.integration.test.ts for Standard and Work. Persist the mapped execution through the existing repository path and read it back with the current helper/repository APIs in that same test file. Assert the run healthState is BROKEN and durable C11 selected/fallback failure fields are exact. No migration is needed.

The test-only execution helper unions may be expanded narrowly to allow failureCode BRIDGE_SURFACE_VALIDATION_FAILED and failureStep VALIDATE_BRIDGE_SURFACES. Do not generalize or refactor unrelated helpers.

## Next task

SA-HEALTH-B5-C11-R1-20260916-01 is prepared on base f8b35fdec3212dedf0e186830e4af21c719d890d and is stored at tasks/HEALTH_B5_C11_R1_2026-09-16.md.

No B6, P8.5 scheduling/incidents, I1/C2.2-A, extension runtime, main merge, deployment, release or live-provider work is authorized in that task. Whole B5 remains NOT ACCEPTED until the C11 candidate receives independent source/diff/evidence review and applicable exact-head remote CI.