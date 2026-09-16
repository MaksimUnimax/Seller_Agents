# Health P8.4 / B5 — C11 R2 final architect review

Date: 2026-09-16
Canonical repository: MaksimUnimax/runtime-fixtures (ID 1369117174)
Product branch: feature/server-health-h3-p8-4

## Verdict

SA-HEALTH-B5-C11-R2-20260916-01: ACCEPTED.
P8.4 / B5_SANITIZED_H3_EVIDENCE_INTEGRATION: ACCEPTED.

This acceptance is bounded to B5. It does not accept B6, B7, B8, P8.5+, live-provider behavior, deployment or release.

## Exact Git identity

Accepted B5 final head: bf3c27a817c7e4698f539ff5cacc1db73c833710
Final tree: 2223a72ecfdf98758c6c3f96c1adeb7b541ec168
Final parent: 668877ecda66d73f7046339393226309b966c7a3
Accepted R2 start/base: f8b35fdec3212dedf0e186830e4af21c719d890d
Implementation commit: b4a8c17f7ad1a1468a511a4fd793c439bfbd97c3
Evidence commits: acd430e57ec118880e061f3977e2b072c1da02a2, 668877ecda66d73f7046339393226309b966c7a3, bf3c27a817c7e4698f539ff5cacc1db73c833710

Independent compare from f8b35fde to bf3c27a is ahead by 4, behind by 0, with merge base exactly f8b35fde. Exactly eight paths changed and all are inside the R2 allowlist: two production strategies, two real H3 specs, mapper unit regression, PostgreSQL integration regression, and two sanitized evidence files. No support fixture, browser-driver, migration, schema/catalog/classifier, API/OpenAPI, reserved public-entrypoint, site/SEO/domain or private-control file changed.

## Production correction

The production semantic delta is the intended C11 provenance correction in both Standard and Work strategies. CONVERSATION_URL_IDENTITY is now the selected strategy whenever that fallback is actually evaluated, including when its outcome is FAIL. Primary outcome remains FAIL, fallback outcome remains conditional PASS/FAIL, structural and behavioral outcomes remain conditional, fallbackQuality remains APPROVED_EQUIVALENT, success evidence remains METADATA and failure evidence remains NONE. Identity failure still fails VALIDATE_BRIDGE_SURFACES with BRIDGE_SURFACE_VALIDATION_FAILED.

No schema weakening, classifier change, mapping rule change, DB change or H3 engine change was used.

## Reachable actual-strategy regression

The final Standard and Work browser regressions use real Playwright pages, real local controlled fixtures, the real production strategy factories and runH3BehavioralSmoke. Their Node-side Page proxies delegate all real Page/Locator operations except the scripted identity-source view and arm only on entry to the real validateBridgeSurfaces call.

Standard changes coherent route/canonical conversation identity on canonical read 1 after arm. Work changes only conversation identity on canonical read 3 after arm, preserving its two earlier ownership checks. Both tests assert that the seam actually fired, one physical Send occurred, execution failed at VALIDATE_BRIDGE_SURFACES / BRIDGE_SURFACE_VALIDATION_FAILED, C09/C10/C12 remained PASS, and C11 retained the exact failed approved-fallback provenance.

The sanitized R2 evidence records the valid pre-fix RED: the scripted identity drift fired on both surfaces but the bridge event lost its C09-C12 observations through the old #safe path. Post-fix focused strategy tests are GREEN.

## Mapper and PostgreSQL durability

Mapper regressions cover both Standard profile revision 2 and Work revision 1. A bridge-validation failure with C09 PASS, C10 PASS, C11 failed selected URL fallback and C12 PASS maps without schema error, retains all four contours and classifies BROKEN because C11 is required CORE.

PostgreSQL regressions persist the same failure through the normal B5 mapper/repository boundary, read back BROKEN, retain all 13 contours, preserve exact C11 failed-fallback fields and persist no C11 failure evidence. No migration or repository API change was required.

## Prior B5 rejection reasons

The complete B5 review confirms that the earlier rejection reasons are now closed in the current candidate:

- aggregate step-to-contour truth loss: closed by typed contour observations and mapper preservation;
- fallback provenance loss: closed, including the final C11 failure case;
- C09-C12 bridge aggregation: closed; all four are independent durable contour results;
- P8.5 dedup/idempotency leakage: absent from B5 and remains reserved for P8.5;
- synthetic bounded-fragment evidence: absent; C07/C09 do not fabricate fragment references;
- PostgreSQL integration fixture isolation: accepted in the earlier B5 gate repair;
- timestamp chronology across offsets/fractional/equal instants: accepted in TIME-R1;
- privacy/toxic-source leakage: strict capture schemas and persistence regressions preserve the bounded sanitized representation.

No additional B5 blocker was found in the final independent review.

## Exact-head CI

Server CI run: 35098078398
Server job: 104800314556
Exact head: bf3c27a817c7e4698f539ff5cacc1db73c833710
Status/conclusion: completed / success
Completed: 2026-09-16T12:59:58Z

Successful job steps include dependency install, lint, format check, typecheck, Playwright config regression, unit tests, PostgreSQL integration tests, db:migrate, openapi:check, bridge:guard, build, Chromium installation, E2E, post steps and container cleanup. The feature-branch-only frozen-import verification is conditionally SKIPPED and is not an acceptance failure.

Executor-local sanitized evidence additionally reports unit 1347, integration 1526 and E2E 164/164 with zero live-provider calls. These counts are supplemental to the independently verified exact-head remote CI.

The R2 evidence publication fields that describe the first failed push attempt are historical evidence of that attempt, not the final remote state. Publication recovery intentionally did not rewrite the tested candidate or evidence merely to self-reference a later evidence commit. Architect remote readback and exact-head CI above are the final publication authority.

## Next bounded step

B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION is next. B6 is a deterministic security/privacy acceptance gate, not a new browser feature and not live-provider acceptance. Existing permanent source/tests already implement the required guarantees; B6 should therefore produce a consolidated, reproducible proof matrix and sanitized evidence without runtime/test changes unless the exact source unexpectedly contradicts this reviewed state. Live controlled H3 belongs to B7.