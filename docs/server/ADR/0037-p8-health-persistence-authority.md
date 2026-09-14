# ADR-0037: P8 Health persistence authority

Status: P8.2 local candidate

Date: 2026-09-12

## Decision

P8.2 adds bounded PostgreSQL persistence for the deterministic P8.1 Health
contract. Persistence is not a second Health authority. The P8.1 classifier
and validators remain the sole source of truth for suite validity, contour
relations, and the final Health state.

## Frozen rules

- The P8.1 classifier remains the sole Health truth authority.
- The database never independently classifies Health.
- A stored final state is always derived from `classifyHealth()`.
- Suite definitions are validated through P8.1 before persistence.
- Result sets are validated through P8.1 before a completed run is committed.
- P8.2 stores no remote executable expansion.
- Evidence persistence is metadata/reference only.
- Raw DOM, screenshot bytes, conversation bodies, cookies and provider
  credentials are never stored by P8.2.
- P8.4 owns evidence capture and content.
- P8.5 owns incident behavior, deduplication and orchestration.
- P8.2 provides an incident schema primitive only.
- P8.3 owns BrowserDriver and live Chrome.
- P9 owns external notification providers.
- P13 owns Yandex Browser live acceptance.

## Persistence boundary

The database stores immutable validated suite revisions, completed runs,
per-contour validated result JSON, and safe evidence references. Suite
revisions and completed runs have no update/delete path. Evidence rows are
also constrained to an exact safe reference present in their validated
contour result, preventing post-classification arbitrary evidence injection.

Run identity is checked against the existing P7 adapter, surface, variant,
profile and exact profile revision hierarchy. The existing browser-family
vocabulary is reused as a constrained string; P8.2 does not introduce a
competing browser enum.

The completed-run operation validates the suite and result set, calls
`classifyHealth()`, validates P7 identity, persists or reuses the immutable
suite revision, inserts the derived run, inserts all validated contour
results, inserts only their safe evidence references, and commits as one
transaction. Any failure rolls back the transaction.

## Incident primitive

`health_incidents` contains only scope, status, run references, an optional
root contour and timestamp constraints. It deliberately contains no lifecycle
service, deduplication algorithm, automatic open/resolve behavior, alerting,
repair packet or orchestration policy. Those decisions remain P8.5 authority.

## Consequences

P8.2 is safe for independent review as a persistence candidate. It does not
start browser execution, live AI, scheduling, notifications, HTTP/API/admin
surfaces, evidence capture, P7 availability hooks, Bridge work or P8.3+.
