# Health B7A dedicated session provisioning

Task: `SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01`

Roadmap: `P8.4 / B7_CONTROLLED_LIVE_H3` — dedicated Health session/target
provisioning foundation.

This is a non-live implementation candidate. It adds a trusted local-only
provisioning boundary for dedicated Health storage state and the Work start
route while preserving a fresh controlled browser context for every run. It
does not claim B7 live behavioral acceptance, full P8.4 acceptance, or
permission to start P8.5.

## Exact authority and identities

| Item | Verified value |
| --- | --- |
| Repository | `MaksimUnimax/runtime-fixtures` |
| Worktree | `/root/runtime-fixtures` |
| Branch | `feature/server-health-h3-p8-4` |
| Required starting/local head | `90c1e0c66a47692634eb652aa1392fdafc1f8f10` |
| Required starting/remote head | `90c1e0c66a47692634eb652aa1392fdafc1f8f10` |
| Required starting tree | `447d6515954e051a287011596fdd3154e11c2561` |
| Required starting parent | `697eea7adc337e1f11def16818829c2e443efb15` |
| Architect main snapshot | `bc718cc5c677ad0eb4598e7de3ad766473ff0847` |
| Architect control head fetched/read | `664a8d1b5aaec0dd4bd33f79e126ea31a77e15c0` |
| Other implementation executor | None claimed by the architect cursor |

The product and architect-control refs were fetched before inspection. The
task authority, current cursor, B7 prerequisite and B8 review were read from
the architect-control ref without switching to it or cherry-picking it. No
reset, rebase, stash, cherry-pick, amend, force operation or replacement
branch was used.

## Implemented boundary

`dedicated-health-session.ts` owns a strict version-1 JSON registry. It accepts
only the two dedicated Health target keys. Standard has one `string`
`storageStatePath` field; Work has that field plus one `string` `startUrl`
field. At least one target is required and all objects are strict. The loaded
bindings are immutable and their sensitive fields are non-enumerable during
serialization.

The loader requires absolute owner-readable regular non-symlink files, checks
the bounded config and storage-state sizes, rejects group/other POSIX bits,
does not read storage-state contents, and rejects duplicate state files by
file identity. Work URL validation requires HTTPS, the code-owned approved
origin, no credentials/query/hash, and an existing code-owned project and
conversation route shape. The actual local paths and route are never recorded
here or in the evidence JSON.

`createDedicatedHealthChromeBrowserDriver` supplies only the validated local
storage-state path to a fresh `browser.newContext` with downloads disabled.
It never uses persistent context or a user data directory and never writes
refreshed authentication state. `sessionKind` remains
`EPHEMERAL_CONTROLLED`. The binding is target-specific; Standard cannot accept
a start override, Work must pass origin and route checks, and all mismatches
fail before navigation with bounded driver errors. Raw Playwright handles,
selectors, scripts, prompts, login automation and CAPTCHA/security bypasses
remain unavailable.

## Reauthentication and operational runbook

An operator provisions or replaces each dedicated Health storage-state file out
of band, keeps the config and state files outside Git with owner-only POSIX
permissions, and reruns the controlled Health checks. Login, CAPTCHA,
anti-bot, authentication and geoblock controls are never automated or
bypassed. The runtime consumes the state path but never persists refreshed
credentials. The Work start route exists only in the local secret config and is
never evidence or result data.

## Targeted security and regression matrix

| Check | Result |
| --- | --- |
| Dedicated registry unit suite | 11 passed, 0 skipped |
| Required Health unit suite (`pnpm --filter @product/health-runner test`) | 119 passed across 10 files, 0 skipped |
| New direct loopback Chromium regression | 5 passed, 0 skipped |
| Combined local Health Chromium matrix, first pass | 96 passed, 1 transient pre-existing Standard timing failure |
| Retried failed Standard case only | 1 passed |
| Focused H3 PostgreSQL persistence coverage in full integration run | 18 passed, 0 skipped |
| Full configured Playwright E2E | 169 passed, 0 skipped |

The first combined local Health matrix failure was an existing default-driver
Standard timing case and did not use the dedicated binding. Its single-case
rerun passed; the full configured E2E subsequently passed all 169 tests.

The focused checks preserve strict H2/H3 plan schemas, one-Send/no-resend
strategy behavior, Standard/Work fences, sanitized results and persistence,
private raw browser handles, default fresh cookie isolation, dedicated fresh
cookie consumption, target mismatch rejection, origin/route defenses and
ephemeral cleanup. No state path, Work route, cookie or storage content appears
in H2/H3 results or persisted evidence.

## Full server cycle

The full cycle was run against a disposable local PostgreSQL container using
synthetic/temporary test material only:

1. `pnpm lint` — PASS.
2. `pnpm format:check` — PASS.
3. `pnpm typecheck` — PASS.
4. Playwright-config regression — 1 passed, 0 skipped.
5. `pnpm test` — PASS; Health runner 119/119 and bridge guard PASS.
6. `pnpm test:integration` — 39 files, 1,526 tests passed, 0 skipped.
7. `pnpm db:migrate` — PASS.
8. `pnpm openapi:check` — PASS.
9. `pnpm bridge:guard` — PASS.
10. `pnpm build` — PASS for API, worker, Health runner, portal and admin.
11. Chromium install — not needed; installed Chromium was already used successfully.
12. `pnpm test:e2e` — 169 passed, 0 skipped.
13. `pnpm docs:check` — run after this evidence publication is complete.

The full cycle made no live ChatGPT, provider, marketplace, customer-session or
credentialed browser calls. All authentication/session/config data used by
tests was synthetic and temporary.

## Scope and remaining prerequisite

Only the eight B7A implementation/evidence paths listed in the companion
results JSON are changed. No package, lockfile, environment, schema, API, DB,
migration, target-registry, strategy, public-document or customer-session path
was widened.

The remaining external B7 prerequisite is owner-provisioned dedicated Health
auth state/config for Standard and Work plus an approved dedicated Work
project/conversation route, all outside Git. B7 live behavioral acceptance was
not run. `B7A` remains an implementation candidate pending architect and
exact-head CI acceptance; `P8.4` remains `NOT_ACCEPTED` and `P8.5` remains
`NOT_STARTED`.
