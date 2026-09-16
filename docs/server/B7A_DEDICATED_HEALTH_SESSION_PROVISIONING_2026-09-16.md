# Health B7A R1 dedicated-session capability provenance

Task: `SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01`

Roadmap: `P8.4 / B7_CONTROLLED_LIVE_H3` — bounded correction of the rejected
B7A dedicated-session provisioning design.

This remains a non-live implementation correction. It does not claim B7 live
behavioral acceptance, P8.4 acceptance, or permission to start P8.5.

## Exact authority and initial refs

| Item | Verified value |
| --- | --- |
| Repository | `MaksimUnimax/runtime-fixtures` |
| Worktree | `/root/runtime-fixtures` |
| Branch | `feature/server-health-h3-p8-4` |
| Required local/start head | `592b51da31ab5ecfd0e4d4b3e981897849731614` |
| Required remote/start head | `592b51da31ab5ecfd0e4d4b3e981897849731614` |
| Required starting tree | `1e4737933665a6ba6d02e491e7873d3f40e47e6f` |
| Required starting parent | `90c1e0c66a47692634eb652aa1392fdafc1f8f10` |
| Architect main snapshot | `bc718cc5c677ad0eb4598e7de3ad766473ff0847` |
| Architect control head read without checkout | `c122d57a8c4ffeaebedb2b7f7c7d310784860821` |
| Competing implementation on this Health branch | None |

Product/control refs were fetched before inspection. Both authority documents
were read in full from the architect control head without switching branches or
cherry-picking. The worktree and index were clean before edits. No reset,
rebase, stash, cherry-pick, amend, force operation, or replacement branch was
used.

## Rejected candidate and valid RED

Architect review rejected candidate `592b51d…` because the structural binding
and optional constructor paths made the strict loader optional. This was an
architect-design security-boundary defect, not a provider or runtime live
failure: a fabricated binding could reach `browser.newContext` and consume
arbitrary accessible storage state before navigation ownership checks.

Before production edits, only the existing B7A E2E test path was changed. The
two synthetic loopback RED checks both failed on the exact candidate for the
required reason:

- forged factory authority: 1 failed; the loopback request contained the
  synthetic dedicated cookie;
- third `ChromeBrowserDriver` constructor argument: 1 failed; the loopback
  request contained the synthetic dedicated cookie.

No provider, marketplace, ChatGPT, customer-session, or real-auth call was
made. The RED used temporary synthetic storage state and loopback only; no raw
value, credential, path, or cookie was published.

## Corrected authority boundary

`dedicated-health-session.ts` now exposes `DedicatedHealthSessionRegistry` as a
type-only opaque contract. The loader creates a frozen opaque object only after
all existing config, file-safety, identity, permission, and Work-route checks
pass, then records sensitive target bindings in a module-private `WeakMap`.
The module-internal resolver is the only binding lookup and rejects forged
objects with bounded `UNTRUSTED_SESSION_REGISTRY`; missing configured targets
remain `TARGET_NOT_CONFIGURED`. The resolver is not a root export.

`ChromeBrowserDriver` is restored to `(targets, launchTimeoutMs?)`. A
module-private driver `WeakMap` holds a trusted binding only when the dedicated
factory has resolved it. Extra JavaScript constructor arguments have no
authority. The factory shape is:

```ts
createDedicatedHealthChromeBrowserDriver(
  targets,
  registry,
  targetKey,
  launchTimeoutMs?,
)
```

No public API accepts a storage-state path, Work start URL, direct binding, or
constructible runtime registry. Fresh `EPHEMERAL_CONTROLLED` contexts,
download denial, no writeback, no persistent user data, navigation firewalls,
bounded errors, and result sanitization remain unchanged.

The old fabricated loopback Work positive was removed. Work authority and exact
production route validation remain deterministic loader/unit coverage; no live
Work navigation is required for R1.

## Validation

| Check | Result |
| --- | --- |
| Valid RED on exact candidate | 2 failed as required; both synthetic-cookie bypasses proven |
| Focused dedicated registry unit test | 11 passed, 0 failed, 0 skipped |
| Required Health unit subset | 109 passed across 6 files, 0 failed, 0 skipped |
| Health runner full unit suite | 119 passed across 10 files, 0 failed, 0 skipped |
| Focused typecheck | PASS |
| Monorepo typecheck | PASS |
| Focused ESLint and Prettier | PASS |
| Full lint and bridge guard | PASS |
| Playwright-config regression | 1 passed, 0 skipped |
| Dedicated-session Chromium E2E, isolated no-webserver harness | 7 passed, 0 failed, 0 skipped |
| OpenAPI check | PASS |
| Build (API, worker, Health runner, portal, admin) | PASS |
| Docs check | PASS: 416 files / 229 Markdown / 320 relative links / 26 requirements / 32 scenarios |
| Full unit command `pnpm test` | PASS; Health 119/119 and bridge guard PASS |
| Integration command | Not completed: no `DATABASE_URL`; interrupted after no DB output |
| `pnpm db:migrate` | BLOCKED: `DATABASE_URL` absent |
| Canonical `pnpm test:e2e` focused invocation | BLOCKED before tests: `DATABASE_URL` invalid/absent for webserver migration |

The isolated dedicated E2E used no configured product webserver and therefore
proved the local browser boundary without database or provider access. The
database-dependent gates were not converted into a claim of success.

## Scope, privacy, and status

Only the eight allowlisted B7A paths are changed. No package/dependency,
lockfile, environment, target registry, H2/H3 schema, strategy/profile,
shared contract, API/OpenAPI, DB/migration, public-doc, site/SEO, or control
path was widened.

All state, identifiers, routes, and cookies used in tests were synthetic and
temporary. No real credentials or session/config data were published. There
were zero live ChatGPT/provider/marketplace/customer-session calls and zero
login, CAPTCHA, anti-bot, authentication, geoblock, or security bypasses.

The remaining external prerequisite is owner-provisioned dedicated Health auth
state/config for Standard and Work plus an approved dedicated Work
project/conversation route, all outside Git. B7 live behavioral acceptance is
`NOT RUN`. B7A R1 remains pending architect/exact-head CI acceptance; P8.4 is
`NOT_ACCEPTED`; P8.5 is `NOT_STARTED`.
