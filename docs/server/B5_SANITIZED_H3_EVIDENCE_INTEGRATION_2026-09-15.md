# B5 — Sanitized H3 evidence integration

Date: 2026-09-15
Roadmap: P8.4 / B5_SANITIZED_H3_EVIDENCE_INTEGRATION
Branch: `feature/server-health-h3-p8-4`
Accepted B4 base: `53419eb57cc222254e14b5dc273a37249487331c`
Rejected initial B5 head: `3138966bb0d1cd66e060b43703169975f48e9265`

The initial B5 candidate was rejected by architecture review for aggregate
step-to-contour truth loss, fallback provenance loss, C09–C12 bridge
aggregation, P8.5 deduplication/idempotency leakage, and synthetic
bounded-fragment references without captured fragments. This document records
the correction only; B6, B7, B8, and P8.5 are not started.

## Scope and authority

B5 integrates the accepted B2 H3 result with the existing P8 persistence
authority. H3 execution mechanics, the fixed nine-step order, Standard/Work
strategies, one-Send rule, cleanup, and B3/B4 fixtures are unchanged.

The actual current repository authority is:

- `packages/server/health/src/types.ts` and `classifier.ts` for strict Health
  vocabulary, contour validation, and final classification;
- `packages/server/db/src/health-persistence-repository.ts` for transactional
  persistence and readback;
- `packages/server/db/drizzle/0015_p8_2_health_persistence.sql` for immutable
  PostgreSQL constraints.

The current migration contains the implemented P8.2 tables
`health_suite_revisions`, `health_runs`, `health_contour_results`,
`health_evidence_references`, and `health_incidents`. The repository does not
currently contain separate `health_checks` or `health_deployments` tables;
B5 does not invent them.

`0015_p8_2_health_persistence.sql` is unchanged. No migration was required.
The existing contour JSON is still written only after strict
`HealthContourResultSchema` validation, and evidence rows remain exact
references to evidence metadata present in that validated contour result.

## Capture-boundary sanitizer

`apps/health-runner/src/h3-health-persistence.ts` is the single B5 mapping
boundary. It strictly parses the accepted `H3ExecutionResult` and approved
`BrowserRuntimeMetadata`, checks surface/profile revision against the supplied
Health scope, then emits only an `H3HealthPersistenceCommand` containing:

- validated Health suite;
- validated Health contour results in the existing C01–C13 vocabulary;
- `PASS`, `FAIL`, or `UNCERTAIN` contour outcomes;
- existing environment uncertainty codes;
- existing timestamps and H3 level/classifier version;
- opaque server-random UUID evidence references with existing rule/classification
  metadata.

Unknown source fields are rejected by strict schemas. No recursive source
copying exists. `markerCount` and `transitionObserved` remain ephemeral H3
event fields and are not persisted. Browser name/headless/session details are
validated at capture but omitted when the existing Health scope has no typed
durable field for them. Existing scope fields retain browser family/version,
surface/profile revision, extension version, and engine version.

The corrected path is:

`Standard/Work surface strategy → strict typed contour observations → common
H3 engine safe event → B5 mapper → HealthContourResult → classifyHealth() →
P8.2 persistence`.

`H3ContourObservation` is a closed, strict allowlist containing only the
contour key, Health-owned primary/fallback outcomes, selected packaged
strategy, structural and behavioral outcomes, fixed fallback quality,
environment status/reason, and a bounded evidence kind. It contains no
selector, raw DOM/HTML, prompt, response, URL/route, project/conversation/
message identifier, browser handle, arbitrary text/JSON, or executable field.
There is no generic metadata bag and no second classifier or H3 engine.

C02 is emitted only after completed-flow conversation ownership is established;
surface identification alone cannot make C02 pass. Standard and Work preserve
actual primary/fallback choices. The implemented Standard semantic Send
fallback is tested as primary FAIL plus `COMPOSER_ACTION_CONTROL` PASS with
`APPROVED_EQUIVALENT`, producing canonical `DRIFT`. Completion's idle-state
fallback is marked `MATERIALLY_DEGRADED` because the repository authority
describes that path as less reliable. No favorable quality is caller-supplied.

Bridge validation independently evaluates C09 command surface, C10 native
Copy, C11 conversation identity, and C12 delivery insertion. The fixed H3
bridge step may fail while durable results preserve `C09 PASS, C10 FAIL, C11
PASS, C12 PASS`; canonical classification is `DEGRADED`, not `BROKEN` solely
because C10 failed. Structural and behavioral outcomes are preserved
independently.

## Evidence reference policy

The current schema calls the opaque key `evidence_id` (UUID), rather than
`evidence_ref`. B5 uses server-owned random UUIDv4 values for each represented
reference. They are unique within a run/result set and contain no route,
project, conversation, message, account, prompt, response, seller, credential,
cookie, token, or storage material. Evidence rows contain only the existing
`rule_id`, `classification`, nullable hash, nullable bounded size, and creation
timestamp. No evidence bytes or private page state are stored.

B5 captures no bounded DOM fragment. C07 and C09 therefore have empty evidence
arrays even when their observations pass; no synthetic `BOUNDED_FRAGMENT`
reference is created. Metadata and state-transition references are emitted only
when the observation kind matches a rule allowed by that contour.

## Standard and Work mapping

Both accepted surfaces use the same typed persistence posture:

- PASS persists all mapped contour results and safe evidence associations;
- post-Send FAIL persists stable contour failure outcomes and leaves later
  contours `NOT_OBSERVED`, without raw response/DOM/error details;
- pre-Send/environment UNCERTAIN persists only the existing bounded
  environment classification and returns Health `UNKNOWN` through the existing
  classifier.

Work route components, project/conversation identifiers, localized page text,
titles, and marker context are not read by the mapper and cannot reach the
durable command. Standard and Work identity remains represented by the
existing Health scope surface key and profile revision.

## P8.2 completed-run semantics, immutability, and retention

Each completed run receives a new server-random UUID and one atomic insert
transaction. B5 contains no `idempotencyKey` API, `deterministicRunId()`, run
reuse via `ON CONFLICT`, or `HEALTH_RUN_IDEMPOTENCY_CONFLICT`. Deduplication and
orchestration remain reserved for P8.5.

The existing unique `(run_id, contour_key)` constraint, evidence UUID primary
key, evidence-to-contour foreign key/trigger, immutable-row triggers, and
transaction rollback behavior remain active. B5 does not schedule retention,
mutate historical evidence, create incidents, or start P8.5. It only supplies
the already-authoritative run timestamps and existing retention-compatible
metadata; the current migration has no B5 retention scheduler or new evidence
column.

## Privacy and logging verification

The B5 unit test passes a toxic test-only source object containing recognizable
prompt, response, project, conversation, cookie, bearer-token, storage, and
seller sentinels. Strict capture parsing rejects unknown fields before any
mapping. Valid mapped results and durable readback are asserted to contain no
sentinels. Tests also assert opaque UUID shape/bounds and absence of raw H3
prompt/response/DOM data from contour output.

The touched production paths emit no raw browser observation, prompt,
response, DOM/HTML, exception, route, storage, credential, seller payload, or
serialized Playwright object. Errors remain stable bounded codes. No provider,
marketplace, customer-session, or live ChatGPT call was made.

## Validation record

Focused/local checks completed:

- health-runner B5 mapper plus existing H2/B1/B2/B3/B4 unit coverage:
  `91/91 PASS`;
- health-runner and DB package typechecks: `PASS`;
- DB package unit coverage: `11/11 PASS`;
- fresh PostgreSQL zero-to-current migration and integration: pending final
  exact-head CI result;
- Standard/Work durable B5 persistence matrix, including PASS, post-Send FAIL,
  pre-Send UNCERTAIN, privacy readback, independent bridge outcomes, no fake
  fragments, and random-run/no-dedup semantics: pending final exact-head CI
  result;
- `0015_p8_2_health_persistence.sql`: unchanged;
- no Stream A, extension runtime, public contract, API/admin/portal, B6, B7,
  or P8.5 files changed.

Full repository gates, exact corrected candidate SHA, exact-head Server CI, and
remote readback are recorded in the terminal report after the final candidate
is pushed. No live H3 acceptance is claimed.

## Gate R1 — PostgreSQL integration-fixture isolation (2026-09-16)

The exact-start RED reproduced the historical ordering defect on one
task-owned PostgreSQL 18 database: adapter-registry `7/7` passed, then the
unchanged H3 fixture failed in `beforeAll` with PostgreSQL `23505` on
`ai_adapters_machine_key_unique` for `machine_key=chatgpt`; all six H3 cases
were skipped. This RED is retained in the gate evidence and is not reclassified
as a pass.

The correction is limited to the two integration fixtures. After
`runtime.ready()` and before their first fixture INSERT, each fixture now drops
the task-owned `public` and `drizzle` schemas, recreates `public`, and invokes
the existing migration runner. Runtime code, migrations, constraints, Health
classification, fixture IDs/keys, assertions, and Vitest configuration remain
unchanged. The H3 fixture imports `runMigrations` from `@product/db/migrations`;
the DB fixture imports it from `./migrations.js`.

The corrected focused H3 run passed `6/6` on a fresh task-owned database. The
separate repeat matrix passed `7/7 → 6/6 → 21/21 → 6/6 → 21/21`, with every
process exiting `0` and no skips. The full candidate integration composition
passed `1514/1514` across `39` files, and the configured E2E composition passed
`162/162`.

This successful gate establishes fixture isolation only; it does not constitute
architectural B5 acceptance. B5 remains `NOT ACCEPTED` pending independent
architectural review. I1 C2.2-A remains open at its existing location because
of the reserved `docs/README.md` PR9 conflict and missing current checks. No
B6–B8, C2.2-B, or new architectural work is started.

## Boundary

This document records the B5 implementation candidate only; it is not
architectural acceptance. B5 remains `NOT ACCEPTED` pending the architect's
independent decision. B6 security/privacy/deterministic regression is the next
step and is not started by this candidate.
