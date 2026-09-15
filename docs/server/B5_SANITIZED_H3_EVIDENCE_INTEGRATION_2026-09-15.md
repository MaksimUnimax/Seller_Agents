# B5 — Sanitized H3 evidence integration

Date: 2026-09-15
Roadmap: P8.4 / B5_SANITIZED_H3_EVIDENCE_INTEGRATION
Branch: `feature/server-health-h3-p8-4`
Accepted B4 base: `53419eb57cc222254e14b5dc273a37249487331c`

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
- opaque UUID evidence references with existing rule/classification metadata;
- a bounded safe retry key used only by the repository's deterministic run ID.

Unknown source fields are rejected by strict schemas. No recursive source
copying exists. `markerCount` and `transitionObserved` remain ephemeral H3
event fields and are not persisted. Browser name/headless/session details are
validated at capture but omitted when the existing Health scope has no typed
durable field for them. Existing scope fields retain browser family/version,
surface/profile revision, extension version, and engine version.

The mapper associates H3 actions with the existing contour authority: surface
and composer actions feed C01–C04, Send feeds C05, busy/response/completion
feed C06–C08, Bridge-surface validation feeds C09–C12, and the existing
environment uncertainty vocabulary feeds C13. It creates no second run/result
hierarchy and no arbitrary JSON diagnostic/evidence bag.

## Evidence reference policy

The current schema calls the opaque key `evidence_id` (UUID), rather than
`evidence_ref`. B5 preserves that authority. IDs are server-derived from a
bounded B5 namespace and contour key, are valid PostgreSQL UUIDs, and contain
no route, project, conversation, message, account, prompt, response, seller,
credential, cookie, token, or storage material. Evidence rows contain only the
existing `rule_id`, `classification`, nullable hash, nullable bounded size,
and creation timestamp. No evidence bytes or private page state are stored.

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

## Idempotency, immutability, and retention

The repository accepts an optional bounded B5 retry key. When present, it
derives a deterministic versioned UUID for `health_runs.id`, inserts with
`ON CONFLICT DO NOTHING`, and verifies the existing immutable run and contour
results before returning it. A same-key/different-input retry fails with a
stable `HEALTH_RUN_IDEMPOTENCY_CONFLICT`; no in-memory deduplication is used.
Callers without a key retain the pre-existing random run behavior.

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
  `85/85 PASS`;
- fresh PostgreSQL zero-to-current migration: `PASS`;
- existing P8.2 persistence plus durable idempotency regression: `21/21
  PASS` on a fresh disposable database;
- Standard/Work durable B5 persistence matrix, including PASS, post-Send FAIL,
  pre-Send UNCERTAIN, privacy readback, and retry deduplication: `7/7 PASS`;
- `0015_p8_2_health_persistence.sql`: unchanged;
- no Stream A, extension runtime, public contract, API/admin/portal, B6, B7,
  or P8.5 files changed.

Full repository gates and exact remote Server CI are recorded in the terminal
report after the final candidate is pushed. No live H3 acceptance is claimed.

## Boundary

This document closes B5 only. B6 security/privacy/deterministic regression is
the next step and is not started by this candidate.
