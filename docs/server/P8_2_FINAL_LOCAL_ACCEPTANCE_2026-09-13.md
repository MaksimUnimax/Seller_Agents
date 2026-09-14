# P8.2 Final Local Acceptance — 2026-09-13

TECHNICAL_ID = `PRODUCT-CONTROL-PLANE-P8_2-FINAL-LOCAL-ACCEPTANCE-ATTEMPT3-NODE24-PINNED-2026-09-13`

## Authority and reviewed candidate

- BASE_REMOTE_HEAD = `f153ef2c8cd2baccd676c2f28166d181b1d83ae2`;
- BASE_REMOTE_TREE = `60fda619217839ecd8c9aeb0469d91fd8db729ee`;
- ATTEMPT1_TREE = `ea02862cdc76778f2d901665db43005201567382`;
- ACCEPTED_REVIEWED_ATTEMPT2_TREE =
  `638372813cd682d3a5af214bc2830d91010dec03`.

The reviewed Attempt2 product was reconstructed from its immutable patch and
added-file archive without implementation, test, schema, migration, lockfile,
or E2E configuration changes.

## Review and preserved QA

Review1 = PASS
Findings = `0/0/0/1` (critical/high/medium/low)

- R1-MEDIUM-001 = CLOSED;
- R1-MEDIUM-002 = CLOSED;
- focused = `20/20`;
- unit = `1240/1240`;
- integration = `1507/1507`;
- format = PASS;
- lint = PASS;
- bridge = PASS;
- typecheck = PASS;
- OpenAPI = PASS, `102` exact;
- build = PASS.

## Complete E2E history

E2E history is recorded truthfully in the local evidence document. Attempt1
was a real test timeout (`19` pass, `1` fail, `1` interrupted, `51` not run).
Diagnostic1 was an invalid harness invocation with `0` test bodies. Diagnostic2
was `3/3` PASS. Attempt2 was a Node12 harness startup failure with `0` test
bodies and is not product evidence.

FINAL ACCEPTANCE E2E = FULL ATTEMPT3, `72/72`, retries `0`.

Attempt3 used the canonical `pnpm test:e2e` package script exactly once. The
parent and all tested child processes resolved Node `24.20.0`; pnpm was
`10.34.5`. Local Playwright used the existing Chromium cache. PostgreSQL was
`18.0`, loopback-only, dynamic port, tmpfs-backed, with no persistent volume.
The canonical Playwright webServer owned `pnpm db:migrate`; no manual database
migration was run before E2E.

## Accepted P8.2 persistence areas

- suite revisions;
- Health runs;
- P7 scope integrity;
- classifier authority;
- atomic persistence;
- contours;
- safe evidence metadata;
- immutability;
- incident primitive.

Provider calls = `0`
Live AI browser calls = `0`
Local Playwright browser = YES

Migrations = `0000..0015`
0014 SHA-256 = `4a12aa34d6be16648fc6cd12b4f3de04f3cce0f3abd6938918905dfa2c471558`
0015 SHA-256 = `212888c0972c1905b5306add1cdd45a70f2152148cecf73c829cc8c0b11ebcb9`
0016 = ABSENT

## Scope and state

P8.3 = NOT STARTED
Deployment = NO
Commit = NO
Push = NO

P8_2_LOCAL_ACCEPTANCE = PASS
P8_2_REMOTE_ACCEPTANCE = PENDING

This document records local acceptance only. It does not claim that all E2E
attempts passed, and it does not authorize commit or push.
