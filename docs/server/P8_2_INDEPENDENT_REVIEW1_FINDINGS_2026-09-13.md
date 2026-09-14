# P8.2 Independent Review1 Findings — 2026-09-13

REVIEW1 = PASS

Reviewed Attempt1 tree = `ea02862cdc76778f2d901665db43005201567382`
Reviewed Attempt2 tree = `638372813cd682d3a5af214bc2830d91010dec03`

CRITICAL = 0
HIGH = 0
MEDIUM = 0
LOW = 1

## Findings

### R1-MEDIUM-001

OPEN IN REVIEWED ATTEMPT1

No repository-level integration test forced a database failure after durable
write work began and proved full transaction rollback.

CORRECTIVE ACTION = repository late-failure rollback integration regression
added in Attempt2.

### R1-MEDIUM-002

OPEN IN REVIEWED ATTEMPT1

No repository integration test submitted the same evidence UUID more than once
inside one completed-run result set and proved safe rejection with no partial
rows.

CORRECTIVE ACTION = same-result-set duplicate-evidence integration regression
added in Attempt2.

## Review1 accepted areas

Review1 accepted the following areas in the reviewed Attempt1 candidate:

- migration;
- physical schema;
- suite persistence;
- P7 hierarchy;
- scope integrity;
- classifier authority;
- contour validation;
- privacy;
- evidence schema;
- immutability;
- incident primitive;
- lockfile/boundaries.

## Attempt2 corrective execution

ATTEMPT2_CORRECTIVE_TEST_A = PASS
ATTEMPT2_CORRECTIVE_TEST_B = PASS
FOCUSED_CORRECTIVE = PASS (`20/20`)
FULL_INTEGRATION = `1507/1507`
FORMAT = PASS
LINT = PASS
BRIDGE = PASS
TYPECHECK = PASS

R1-MEDIUM-001 = CLOSED

R1-MEDIUM-002 = CLOSED

The corrective coverage was independently revalidated against the reviewed
Attempt2 tree. Both medium findings are closed; no implementation patch is
required.

## Final Review1 result

CRITICAL/HIGH/MEDIUM/LOW = `0/0/0/1`

LOW = Test B naming says rollback although implementation fail-fasts before
transaction.

This is a documentation/test naming observation, not a product defect.

## Review chronology

- Attempt1 Review1 = FAIL, with `R1-MEDIUM-001` and `R1-MEDIUM-002` open.
- Attempt2 added the two corrective integration regressions; implementation,
  schema, migration, repository and lockfile semantics were unchanged.
- Focused corrective execution = PASS (`20/20`); full integration = PASS
  (`1507/1507`); format, lint, Bridge guard and typecheck = PASS.
- Final independent re-review = PASS on tree
  `638372813cd682d3a5af214bc2830d91010dec03`.
