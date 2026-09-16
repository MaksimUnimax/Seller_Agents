# I1-SRV.5 R2 Evidence

Date: 2026-09-16
Repository: `MaksimUnimax/Seller_Agents`
Branch: `feature/server-i1-srv5-acceptance-2026-09-16`
Canonical base: `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`
Status: `I1-SRV.5 IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`

## Exact correction

`packages/server/db/src/health-persistence.integration.test.ts` now resets
the disposable database's `public` and `drizzle` schemas and runs the
canonical migrations immediately after `runtime.ready()` and before the
existing fixed-ID fixture inserts. Fixture IDs, assertions, suite order,
production health code, migrations, and the deliberate shared history within
the suite remain unchanged.

## Focused deterministic proof

Environment: Node `24.20.0`, pnpm `10.34.5`, PostgreSQL `18.0`, loopback-only
task-owned disposable databases. Connection strings and credentials were
sanitized and not retained.

On one task-owned database, the unchanged-source sequence was:

- Adapter registry first: PASS, `1` file / `7/7` tests, exit `0`.
- Health persistence second, with no cleanup/reset between invocations: RED,
  PostgreSQL `23505`, constraint `ai_adapters_pkey`, at
  `health-persistence.integration.test.ts:129` during the fixed adapter
  fixture INSERT; `20` tests skipped, exit `1`.

After the exact R2 correction, on that same database:

- Adapter registry then health persistence: PASS, `7/7` followed by `20/20`,
  both exit `0`.
- Health persistence invoked once more without outside cleanup: PASS,
  `20/20`, exit `0`.

## Full acceptance

A separate fresh task-owned loopback E2E database was used. In the required
order, each gate completed with exit `0`:

`pnpm lint`; `pnpm format:check`; `pnpm typecheck`; the existing Playwright
config regression (`1/1`); `pnpm test`; `pnpm test:integration` (`39` files,
`1527/1527` tests, no new skips, all `20` health tests executed);
`pnpm db:migrate`; `pnpm openapi:check`; `pnpm bridge:guard`; `pnpm build`;
`pnpm test:e2e` (`88/88`, retaining the I1 reference tests and existing
suite); and `pnpm docs:check` (`0` errors after documentation update).

The first full-cycle attempt stopped at the local E2E interlock because its
task-owned database name lacked `e2e` or `test`; no E2E test ran there. The
successful cycle used a fresh database with the required explicit test name.
This setup block is recorded as a local environment outcome, not as a test
pass or product failure.

## Boundaries and publication

The prior R1 signing correction, its local integration failure, and the
earlier disk-exhaustion `BLOCKED` outcome remain historical. This R2 repair
does not accept Health/P8.4 B5; B6–B8 remain queued. C1 remains separately
accepted at `56c81a3521c02502b65fd713aec890e5a30f038d`; PR7 remains draft and
unmerged. No installed extension, live provider, email delivery, preprod,
release, full I1/C2, or Health launch is claimed.

Only the allowlisted fixture and documentation paths are included. Private
keys, tokens, raw envelopes, traces, screenshots, and video were not
retained. The existing draft PR8 is reused:
https://github.com/MaksimUnimax/Seller_Agents/pull/8

The exact R2 code commit, later evidence commit, final tree/parent, and PR
virtual merge SHA are reported in the terminal handoff.

R2 code commit: `1822e861b70ade3326d12f37d655467db53a1b05`
R2 code tree: `fde0f3ad158ed89e54d28f1396b6ea7d3b39c15b`
R2 code parent: `832b135f129154dae2a1ce726528fdb353e92292`
