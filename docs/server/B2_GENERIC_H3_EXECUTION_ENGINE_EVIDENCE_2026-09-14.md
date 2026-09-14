# B2 — Generic H3 execution engine

Date: 2026-09-14
Branch: `feature/server-health-h3-p8-4`
Base: accepted B1 commit `f11b21392ae5543356cde0803d1b53591376f5a1`

## Scope

B2 adds one common H3 execution engine for the accepted B1 packaged action
tuple. The engine exhaustively handles the packaged semantic steps and uses a
trusted internal `H3SurfaceStrategy` boundary for future Standard and Work
implementations. The boundary contains only surface identification, composer
identification, packaged-prompt insertion, one irreversible send, bounded
observations, Bridge-surface validation, and cleanup.

The engine enforces the locally packaged target-to-surface mapping, exact
profile identity, immutable B1 action order, one send invocation, terminal
cleanup, per-step and total budgets, and bounded typed results. Failures never
retain exception text or browser content. The result uses the existing safe
H3 evidence event shape transiently; it does not persist evidence.

No Standard or Work selectors/DOM behavior, generic BrowserDriver methods,
provider calls, customer sessions, database changes, migrations, shared
contract changes, or P8.5 work were added.

## Validation

- Health-runner typecheck — PASS.
- Health-runner unit tests — PASS, 68 tests; H2 and B1 regressions included.
- Health-runner build — PASS.
- Repository lint and Bridge boundary guard — PASS.
- Repository format check — PASS.
- Repository typecheck — PASS.
- Repository unit tests — PASS.
- OpenAPI check — PASS.
- Repository build — PASS.
- Fresh disposable PostgreSQL integration run — 1,487 passed, 20 skipped; one
  pre-existing P8.2 fixture `beforeAll` failed on duplicate seeded
  `ai_adapters` identity after migration. No B2 path was involved.
- Fresh disposable PostgreSQL Playwright E2E run — 85/85 PASS, including the
  real Chromium H2 suite.

The integration failure is retained as an unrelated baseline limitation; no
integration/schema workaround was introduced for B2.

## Non-goals

B2 does not implement ChatGPT Standard or Work DOM behavior, evidence
persistence, live H3, arbitrary browser execution, scheduling, incidents, or
P8.5.
