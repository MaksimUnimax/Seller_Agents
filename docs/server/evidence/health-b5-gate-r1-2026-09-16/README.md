# SA-HEALTH-B5-GATE-R1-20260916-01 — terminal evidence

Date: 2026-09-16
Repository: `MaksimUnimax/runtime-fixtures` (stable repository ID `1369117174`)
Branch: `feature/server-health-h3-p8-4`
Task-owned PostgreSQL: PostgreSQL 18.0, loopback `127.0.0.1:55440`; database
names were `health_b5_gate_r1_test`, `health_b5_gate_r1_h3_test`,
`health_b5_gate_r1_matrix_test`, and `health_b5_gate_r1_candidate_test`.
Credentials and full connection strings are intentionally omitted.

## Refs and trees

| Ref | SHA | Tree | Parent |
|---|---|---|---|
| start/base | `a80cd3706a10d25079fedb9553fc7f5b2fc21683` | `4569d243b0fedf239efaa36085375911b0507e82` | `3138966bb0d1cd66e060b43703169975f48e9265` |
| code/test candidate | `3b3ba9f8cfdbb0fb431072029541f61c5863237e` | `aeef3c2bcb23aa0fb75ff1aac5666bacf748b765` | `a80cd3706a10d25079fedb9553fc7f5b2fc21683` |
| final evidence candidate | see terminal report after publication | final tree is recorded in terminal report | code/test candidate |
| latest verified main before work | `bc718cc5c677ad0eb4598e7de3ad766473ff0847` | not used as a base | — |

The final self-SHA is deliberately not embedded in this self-referential
evidence commit; the terminal report records the published final SHA, tree,
parent, and remote head.

## RED — exact start

Dependencies were installed with `pnpm install --frozen-lockfile` using Node
`v24.20.0` and pnpm `10.34.5`. On the same task-owned database, in two separate
sequential processes:

1. `pnpm exec vitest run --config tests/integration/server/vitest.config.ts packages/server/db/src/adapter-registry.integration.test.ts` — exit `0`, `7/7` passed.
2. `pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts` — exit `1`, PostgreSQL `23505`, constraint `ai_adapters_machine_key_unique`, `machine_key=chatgpt`, `6 skipped` and no H3 case executed.

The exact output is in `logs/red-adapter-registry.log` and
`logs/red-h3-health-persistence.log`. The DB-health second-risk RED was not
claimed as executed; it was established by source inspection and verified in
the GREEN matrix.

## GREEN — focused and repeat matrix

On a fresh task-owned database, the H3-only command passed `6/6`, exit `0`:

`pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts`

On another fresh task-owned database, separate sequential processes with no
external reset passed with exit `0` and no skips:

| Order | Exact file | Result | Exit |
|---:|---|---:|---:|
| 1 | `packages/server/db/src/adapter-registry.integration.test.ts` | `7/7` | 0 |
| 2 | `tests/integration/server/h3-health-persistence.integration.test.ts` | `6/6` | 0 |
| 3 | `packages/server/db/src/health-persistence.integration.test.ts` | `21/21` | 0 |
| 4 | `tests/integration/server/h3-health-persistence.integration.test.ts` | `6/6` | 0 |
| 5 | `packages/server/db/src/health-persistence.integration.test.ts` | `21/21` | 0 |

The focused logs are `green-h3-fresh.log` and
`green-matrix-01` through `green-matrix-05` in `logs/`.

## Full candidate gates

All commands ran from the candidate worktree with `DATABASE_URL` assigned to
the task-owned loopback database before the database-bearing cycle. No live
provider calls were made.

| # | Gate / exact command | Result | Exit |
|---:|---|---:|---:|
| 1 | `pnpm lint` | PASS | 0 |
| 2 | `pnpm format:check` | PASS | 0 |
| 3 | `pnpm typecheck` | PASS | 0 |
| 4 | `pnpm exec vitest run tests/e2e/server/playwright-config-regression.test.ts` | `1/1` PASS | 0 |
| 5 | `pnpm test` | PASS; package unit suites pass; `admin-billing` has no test files under `--passWithNoTests` | 0 |
| 6 | `pnpm test:integration` | `39` files, `1514/1514` PASS; H3 `6/6`, DB-health `21/21` | 0 |
| 7 | `pnpm db:migrate` | PASS | 0 |
| 8 | `pnpm openapi:check` | PASS | 0 |
| 9 | `pnpm bridge:guard` | PASS | 0 |
| 10 | `pnpm build` | PASS | 0 |
| 11 | `pnpm exec playwright install --with-deps chromium` | PASS | 0 |
| 12 | `PRODUCT_CONTROL_PLANE_E2E=1 pnpm test:e2e` | `162/162` PASS, 0 skips | 0 |
| 13 | `pnpm docs:check` | PASS; `403` files, `221` Markdown, `319` relative links, `26` requirements, `32` acceptance scenarios | 0 |

The full candidate logs are `candidate-01` through `candidate-13` in
`logs/`. The only test-suite no-test condition was the existing
`@product/admin-billing` package under `passWithNoTests`; there were no skipped
tests in the required integration, focused GREEN, or E2E checks. Existing
Next.js ESLint-plugin and apt root-run warnings were warnings only. The docs
check reported structure, relative links, and requirement coverage only; it
does not execute product tests.

## Remote CI facts

After the normal fast-forward push, the current candidate Server CI is
`[run 35084983097](https://github.com/MaksimUnimax/runtime-fixtures/actions/runs/35084983097)`;
its status at report time is `in_progress`, with job `server` ID
`104757575027`. The run head and checkout SHA are
`0d42223331ec936a671179fba4f59a0bcbe07214`. This is remote CI in progress,
not a completed candidate PASS, and it was not awaited or retriggered.

No current Documentation CI run exists for this feature branch: the workflow
triggers on pushes to `main`/`migration/**`, pull requests, or manual dispatch,
and no pull-request run was created for this task. Therefore the candidate
Documentation CI result is `UNKNOWN/N/A`; local `pnpm docs:check` is the
completed documentation gate. For reference, the latest accessible main
Documentation CI is
`[run 35075454532](https://github.com/MaksimUnimax/runtime-fixtures/actions/runs/35075454532)`,
`success`, checkout/head SHA
`bc718cc5c677ad0eb4598e7de3ad766473ff0847`.

## Allowlist and boundaries

Changed paths in this task are exactly:

- `tests/integration/server/h3-health-persistence.integration.test.ts`
- `packages/server/db/src/health-persistence.integration.test.ts`
- `docs/server/B5_SANITIZED_H3_EVIDENCE_INTEGRATION_2026-09-15.md`
- this README;
- `results.json`;
- the assigned sanitized logs under `logs/`.

Code/test commit precedes evidence commit. No production Health/runtime code,
migrations, constraints, contracts, auth, signing, deduplication,
idempotency, scheduler, Vitest config, CI/workflow, reserved README files, or
other non-allowlist paths were changed. No merge, deploy, release, or live
provider call was performed. B5 remains `NOT ACCEPTED` pending independent
architectural review; I1 C2.2-A remains open.
