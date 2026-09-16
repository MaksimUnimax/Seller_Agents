# SA-HEALTH-B5-TIME-R1-20260916-01 — terminal evidence

Date: 2026-09-16  
Repository: `MaksimUnimax/runtime-fixtures` (stable repository ID `1369117174`)  
Branch: `feature/server-health-h3-p8-4`  
Start/base: `d8f5157696d137750176d1aa44aedf9c2116404e`  
Start tree: `6612db9fbc1cd370a2882c7e5add696329413316`  
Start parent: `0d42223331ec936a671179fba4f59a0bcbe07214`  
Latest verified main: `bc718cc5c677ad0eb4598e7de3ad766473ff0847`

Dependencies used: Node `v24.20.0`, pnpm `10.34.5`, Vitest `3.2.6`, PostgreSQL
`18.0`, Playwright `1.62.1`. `pnpm install --frozen-lockfile` exited `0`.

## Code/test candidate

Code/test commit: `63bd01b60449658ca56beffd4ffd4e0bda03f969`  
Tree: `b96c97debb4d8cf646ad76795a119791f0e20e8e`  
Parent: `d8f5157696d137750176d1aa44aedf9c2116404e`

The production change is exactly one condition in
`H3HealthPersistenceContextSchema.superRefine`: `Date.parse(value.completedAt)`
is compared with `Date.parse(value.startedAt)`. ISO offset acceptance, strict
schema behavior, issue path/code/message, metadata checks, and Date conversion
are unchanged. No DB/repository/migration/constraint/runtime code changed.

## Mapper RED → GREEN

The exact-start RED was run against the unchanged mapper, not called a full
unit RED or a full mapper/DB run. Focused command:

`pnpm --filter @product/health-runner exec vitest run src/h3-health-persistence.test.ts`

Before the production edit: exit `1`, 29 tests, 10 failed. On both Standard
(`revision2`) and Work (`revision1`), A/C/E were false rejects and B/D were
false accepts; F remained green. The named cases and expected deltas were:

| Case | Expected mapper result | Delta ms | Exact moments used |
|---|---|---:|---|
| A | return command | `3600000` | `10:00:00+05:00` → `06:00:00Z` |
| B | ZodError at `completedAt`, existing message | `-3600000` | `06:00:00Z` → `10:00:00+05:00` |
| C | return command | `100` | `10:00:00.100+05:00` → `05:00:00.200Z` |
| D | ZodError at `completedAt`, existing message | `-100` | `05:00:00.200Z` → `10:00:00.100+05:00` |
| E | return command | `0` | `10:00:00+05:00` → `05:00:00Z` |
| F | return command | `1000` | `06:00:00.000Z` → `06:00:01.000Z` |

After the one production edit: exit `0`, 29/29 passed. The same A–F cases
passed on both surfaces. Additional preservation checks passed for invalid ISO,
missing timezone, equal UTC strings, and ordinary reverse UTC.

The independent callback probe from the task brief remains historical evidence
only; it is not reported as the full unit RED.

## PostgreSQL acceptance

The focused command on a new task-owned PostgreSQL 18 loopback database was:

`pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts`

with `DATABASE_URL` assigned only to that disposable database and
`PRODUCT_CONTROL_PLANE_E2E=1`. Result: exit `0`, 16/16 passed, 0 skips. The
original six H3 cases remain, with ten timestamp cases added: A/C/E roundtrips
for Standard and Work (6) plus B/D mapper-before-repository no-write negatives
for Standard and Work (4).

For each accepted case, the test builds the real command from PASS execution and
context, persists it, reads the returned run by exact ID, and checks parsed UTC
moments/delta, H3/HEALTHY, scope/profile ownership, 13 contour rows, and 11
evidence references. B/D assert the real mapper's existing Zod message before
repository invocation and unchanged counts of `health_suite_revisions`,
`health_runs`, `health_contour_results`, and `health_evidence_references`.

## Full Server cycle

All required commands exited `0`: `pnpm lint`, `pnpm format:check`,
`pnpm typecheck`, Playwright config regression `1/1`, `pnpm test`,
`pnpm test:integration`, `pnpm db:migrate`, `pnpm openapi:check`,
`pnpm bridge:guard`, `pnpm build`, Chromium installation, and E2E.

After evidence preparation, `pnpm docs:check` also exited `0`: 405 files, 222
Markdown files, 319 relative links, 26 requirements, and 32 acceptance
scenarios. It executes no product tests.

Integration: 39 files, 1524/1524, 0 skips (baseline 1514 plus 10 new cases).  
E2E: 162/162, 0 skips.  
`@product/admin-billing` separately reported no test files under its existing
`--passWithNoTests`; it is not counted as executed tests.  
No live-provider calls were made.

## Allowlist and boundaries

Changed paths are exactly:

- `apps/health-runner/src/h3-health-persistence.ts`
- `apps/health-runner/src/h3-health-persistence.test.ts`
- `tests/integration/server/h3-health-persistence.integration.test.ts`
- `docs/server/B5_SANITIZED_H3_EVIDENCE_INTEGRATION_2026-09-15.md`
- this README;
- `results.json`;
- assigned sanitized logs under `logs/`.

Owner parallel changes in `docs/ROADMAP.md` and
`docs/development/SERVER_CODEX_HANDOFF.md` were preserved; this worktree had no
uncommitted owner changes to include. The task-owned disposable PostgreSQL
container is removed after the report. No merge, force push, history rewrite,
deploy, release, B6–B8, C2.2-B, scheduler/P8.5, or architectural acceptance is
performed. B5 remains `NOT ACCEPTED` pending independent architect review.
