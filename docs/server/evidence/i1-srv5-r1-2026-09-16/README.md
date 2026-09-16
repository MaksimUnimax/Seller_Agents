# I1-SRV.5 R1 Evidence

Date: 2026-09-16
Repository: `MaksimUnimax/Seller_Agents`
Branch: `feature/server-i1-srv5-acceptance-2026-09-16`
Base: `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383`
Status: `I1-SRV.5 IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`

## Fixture correction

The reviewed candidate `b0d93e36b2c7f37a4758ea4b33dbfa9cf2c688bb` generated
fresh K1/K2 pairs on every Playwright config evaluation. The worker then held
different public trust from the runner/API signer. The architect-selected R1
repair generates the existing `e2e-config-k1`/`e2e-config-k2` pairs only when
`TEST_WORKER_INDEX` is undefined, retains inherited public JSON in workers,
and supplies the private ring only to the disposable API webServer environment.

## Sanitized commands and outcomes

All commands ran with Node `24.20.0`, pnpm `10.34.5`, and a task-owned
loopback PostgreSQL database. Secrets, raw envelopes, credentials, key bytes,
traces, screenshots, and video were not logged or retained.

- `pnpm install --frozen-lockfile` — PASS.
- Focused regression on reviewed `b0d93e3` — RED at the boolean K1 trust/DB
  equality assertion (`false`), as expected.
- Focused regression after R1 correction — PASS (`1/1`).
- `tests/e2e/server/i1-reference-acceptance.spec.ts` — PASS (`2/2`), including
  the V2 lifecycle coverage/assertions.
- `tests/e2e/server/playwright-config-regression.test.ts` — PASS (`1/1`).
- `pnpm lint` — PASS; `pnpm format:check` — PASS; `pnpm typecheck` — PASS;
  `pnpm test` — PASS; `pnpm openapi:check` — PASS; `pnpm bridge:guard` — PASS;
  `pnpm build` — PASS.
- `pnpm db:migrate` — PASS.
- `pnpm test:e2e` — PASS (`88/88`).
- `pnpm test:integration` — `1507 passed / 20 skipped`, then FAIL in the
  unrelated health-persistence setup on duplicate fixed `ai_adapters` primary
  key. No task file was changed for that existing fixture collision.
- `pnpm docs:check` — PASS (`418` files, `0` errors) after documentation
  finalization.

The earlier candidate’s local disk-exhaustion results remain historical
`BLOCKED` evidence; they are not retroactively changed to PASS.

## Publication boundaries

PR8 is the existing draft and is reused:
https://github.com/MaksimUnimax/Seller_Agents/pull/8

The R1 correction commit is `39478f0b4e28dd875111ce28670396531a8efc4d`
(`37fc3eea2c37060cb3599d7380df7623bad95229` tree); the final published head
is reported in the terminal handoff.

No production, cryptographic verifier, API contract, shared fixture,
dependency, lockfile, workflow, migration, extension, Health, PR7, main, or
architect-cursor changes are included.
