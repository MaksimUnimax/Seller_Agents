# Health B6 SPDR evidence

Task: `SA-HEALTH-B6-SPDR-R1-20260916-01`

Roadmap: `P8.4 / B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION`

Repository: `MaksimUnimax/runtime-fixtures`

Worktree: `/root/runtime-fixtures`

Branch: `feature/server-health-h3-p8-4`

The initial local HEAD was the reported stale `f8b35fdec3212dedf0e186830e4af21c719d890d`.
After fetch, remote Health was exactly the required accepted B5 base
`bf3c27a817c7e4698f539ff5cacc1db73c833710`; ancestry, tree
`2223a72ecfdf98758c6c3f96c1adeb7b541ec168`, and parent
`668877ecda66d73f7046339393226309b966c7a3` were verified before a fast-forward-only
recovery. Architect-verified `origin/main` was
`bc718cc5c677ad0eb4598e7de3ad766473ff0847`.

## Gate results

| Gate | Command | Result |
| --- | --- | --- |
| Unit/security | `pnpm --filter @product/health-runner exec vitest run src/h2.test.ts src/h3-contracts.test.ts src/h3-actions.test.ts src/h3-engine.test.ts src/h3-health-persistence.test.ts` | exit 0; 5 files, 98 passed, 0 skipped |
| Type boundary | `pnpm --filter @product/health-runner typecheck` | exit 0 |
| Bridge boundary | `pnpm bridge:guard` | exit 0; passed |
| PostgreSQL regression | `pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts` | exit 0; 1 file, 18 passed, 0 skipped |
| Chromium local fixtures | `PRODUCT_CONTROL_PLANE_E2E=1 pnpm exec playwright test --config tests/e2e/server/playwright.config.ts tests/e2e/server/health-h2.spec.ts tests/e2e/server/health-standard-h3.spec.ts tests/e2e/server/health-work-h3.spec.ts` | exit 0; 3 files, 92 passed, 0 skipped: H2 13, Standard 37, Work 42 |

The commands ran with Node `24.20.0` and pnpm `10.34.5`. Chromium and its standard
OS dependencies were installed only because the established runner lacked them;
the repository lockfile and dependency versions were unchanged.

## Sanitized boundaries

- PostgreSQL image/version: `postgres:18.0`; container: `health-b6-spdr-pg`; database: `e2e`; loopback-only dynamic port; container removed and absence verified.
- No password, DATABASE_URL, raw logs, raw prompt, response token, DOM/HTML, cookie, token, storage, project, conversation, seller, provider, or customer-session data is persisted here.
- All browser cases were existing loopback/local controlled fixtures. Zero live ChatGPT/provider/marketplace/customer-session calls were made.
- Zero production/test/package/workflow/migration/schema changes were made.
- B7 live controlled H3 acceptance was not started; B6 remains pending architect review and exact-head remote Server CI after publication.

The exact source/test blob matrix and SPDR-01 through SPDR-11 assertion mapping are
in `results.json` and summarized in the parent B6 task page.
