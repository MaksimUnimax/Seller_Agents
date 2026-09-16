# Health B6 security, privacy, deterministic regression

Task: `SA-HEALTH-B6-SPDR-R1-20260916-01`

Roadmap: `P8.4 / B6_SECURITY_PRIVACY_DETERMINISTIC_REGRESSION`

This is sanitized acceptance evidence over the existing H2/H3 implementation and
permanent regressions. No production, test, package, workflow, migration, schema,
or fixture code was changed. B7 live controlled H3 acceptance was not started.

The stale checkout at `f8b35fdec3212dedf0e186830e4af21c719d890d` was recovered by
verified fast-forward only to accepted B5 `bf3c27a817c7e4698f539ff5cacc1db73c833710`.
The accepted tree is `2223a72ecfdf98758c6c3f96c1adeb7b541ec168`, with parent
`668877ecda66d73f7046339393226309b966c7a3`; architect-verified `origin/main` was
`bc718cc5c677ad0eb4598e7de3ad766473ff0847`.

## SPDR proof matrix

| Criterion | Existing authority and exact assertions | Result |
| --- | --- | --- |
| SPDR-01 packaged operations only | `h3-actions.test.ts`: “admits only the closed packaged action kinds”, “compiles from safe plan authority and rejects injected action input”, “rejects unsafe action field %s”, “keeps target authority outside actions and only uses the packaged prompt id”, “models exactly one irreversible send and no retry primitive”, “keeps cleanup terminal and the sequence immutable”, “contains the fixed Bridge-shaped validation set” | PASS |
| SPDR-02 no generic browser escape hatch | `h3-engine.test.ts`: “keeps the exported engine surface semantic and bounded”; `h2.test.ts`: “rejects unknown H2 plan fields and raw selector authority”, “runtime-encapsulates raw Playwright handles”; `browser-driver.ts` semantic `BrowserDriver` surface and private Playwright handles | PASS |
| SPDR-03 one irreversible Send / no resend | `h3-actions.test.ts`: “models exactly one irreversible send and no retry primitive”; `h3-engine.test.ts`: “does not retry a failed or uncertain send”, “does not resend after a post-send failure”, “enforces the total run budget without retrying send”; Standard “post-send failures never retry” and Work “bounded post-Send failures never retry” fixtures | PASS |
| SPDR-04 deterministic benign packaged prompt | `h3-contracts.test.ts`: “maps the only prompt id to a local benign fixed prompt”; `h3-contracts.ts`: `H3PromptIdSchema`, `getPackagedH3Prompt`, strict plan schema | PASS |
| SPDR-05 zero provider side effects | `apps/health-runner/package.json` has only workspace health/shared dependencies, Playwright, and Zod; required browser runs used loopback controlled fixtures; no provider/customer credentials were supplied | PASS |
| SPDR-06 Standard / Work isolation | `h3-actions.test.ts`: “accepts only distinct packaged Standard and Work identities”; `h3-engine.test.ts`: “isolates Standard and Work strategies through one registry and rejects mismatches”; real Standard “registers Standard only and rejects Work resolution” and Work “Work never falls back to Standard and Standard rejects Work” | PASS |
| SPDR-07 H2 security regression | `h2.test.ts`: target/credential/origin boundary, redirect and uncertainty tests, “reports structural misses without fabricating BROKEN or invoking persistence”; `health-h2.spec.ts`: “rejects an unsafe top-level redirect”, “isolates cookies between separate ephemeral contexts”, “blocks an unapproved cross-origin popup before its document request”, and preblocked redirect cases | PASS |
| SPDR-08 sanitizer / persistence privacy | `h3-contracts.test.ts`: “accepts only bounded metadata evidence”, “rejects raw conversation data at bundle level”; `h3-health-persistence.test.ts`: “accepts only the strict bounded observation vocabulary”, “maps %s post-Send FAIL without raw response details”, “rejects unknown source fields before selecting any evidence”, “keeps evidence references opaque and bounded”; PostgreSQL “persists %s PASS with sanitized contour evidence”, “persists %s bridge-validation C11 failure provenance”, “persists %s post-Send FAIL without raw response/DOM” | PASS |
| SPDR-09 ephemeral sessions / no reuse | `h2.test.ts`: “keeps session mode ephemeral across driver instances”, “runtime-encapsulates raw Playwright handles”; `browser-driver.ts`: `sessionKind = EPHEMERAL_CONTROLLED`, fresh `chromium.launch()` and `browser.newContext()`, cleanup; `health-h2.spec.ts`: “isolates cookies between separate ephemeral contexts” | PASS |
| SPDR-10 cleanup / bounded failures | `h3-engine.test.ts`: “fails before send and still cleans up exactly once”, “reports cleanup failure and preserves both primary and cleanup failures”, “enforces the total run budget without retrying send”; H2 “maps a bounded observation timeout to environment uncertainty and cleans up”, “cleans up when observation fails unexpectedly” | PASS |
| SPDR-11 no secret/raw-conversation leak | `h3-health-persistence.test.ts`: “maps %s PASS into durable contour evidence”, “maps %s post-Send FAIL without raw response details”, “maps %s pre-Send environment uncertainty”, “keeps evidence references opaque and bounded”; PostgreSQL sanitized contour assertions; Standard and Work real fixture serialized-result absence assertions | PASS |

## Execution

All five required gates exited 0. The focused Chromium run reported 92/92 passed
and zero skips: H2 13, Standard H3 37, Work H3 42. The PostgreSQL run reported
18/18 passed and zero skips. Unit/security reported 98/98 passed and zero skips.

The database was task-owned disposable PostgreSQL `postgres:18.0`, container
`health-b6-spdr-pg`, database `e2e`, exposed only on loopback at a dynamically
assigned port. The container was removed after the focused checks. No password or
connection string is present in this evidence.

All browser tests used existing loopback/local controlled fixtures. No live
ChatGPT, marketplace-provider, marketplace API, seller-token, extension
customer-session, provider-credential, or real customer-browser/profile call was
made. B7 live controlled H3 acceptance is explicitly not started.

Detailed blob authorities, commands, totals, and sanitized results are recorded in
the accompanying [results.json](evidence/health-b6-spdr-2026-09-16/results.json).

This B6 evidence remains pending architect review and exact-head remote Server CI
after publication.
