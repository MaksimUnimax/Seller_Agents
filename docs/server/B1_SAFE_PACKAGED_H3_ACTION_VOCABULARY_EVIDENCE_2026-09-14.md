# B1 — Safe packaged H3 browser action vocabulary

Date: 2026-09-14
Branch: `feature/server-health-h3-p8-4`
Base: `de41f33646d5dd61bcae66624225e16538fd8f3a`

## Scope

B1 adds the local, closed H3 action vocabulary that a later B2 engine may
consume. It compiles the existing strict `H3RunPlan` into one frozen tuple in
the already-authoritative behavioral order:

```text
IDENTIFY_SURFACE
IDENTIFY_COMPOSER
INSERT_PROMPT
SEND_ONCE
OBSERVE_BUSY
OBSERVE_RESPONSE
OBSERVE_COMPLETION
VALIDATE_BRIDGE_SURFACES
CLEANUP
```

The action schema contains only packaged semantic identifiers. It has no URL,
selector, DOM query, script, executable profile, arbitrary keyboard/mouse
operation, raw prompt, raw response, or generic browser executor field.
`INSERT_PROMPT` carries only `BRIDGE_COMMAND_SMOKE_V1`; the prompt text remains
owned by the existing local packaged-prompt authority.

`SEND_ONCE` is the only send semantic and is marked
`SINGLE_IRREVERSIBLE`. The compiler does not accept an action array, retry,
resend, or caller-supplied ordering. Standard and Work use distinct local
versioned profile identities; no surface DOM strategy or H3 execution engine
is implemented here.

## Validation

- `pnpm --filter @product/health-runner test` — 55 passed.
- `pnpm --filter @product/health-runner typecheck` — passed.
- `pnpm --filter @product/health-runner build` — passed.
- `pnpm lint` — passed, including `bridge:guard`.
- `pnpm format:check` — passed.
- `pnpm typecheck` — passed.
- `pnpm test` — passed.
- `pnpm openapi:check` — passed.
- `pnpm build` — passed.

The local H2 deterministic unit regression remains green. The configured H2
Playwright E2E harness was not run to completion because its API harness
requires a database explicitly named `e2e` or `test`; the available local
development database has a different name. No third-party AI, marketplace
provider, customer session, or persistent B1 evidence store was used.

## Non-goals

B1 does not execute H3, implement Standard or Work DOM behavior, add browser
driver methods, persist evidence, change database/schema/migrations, or start
P8.5/B2.
