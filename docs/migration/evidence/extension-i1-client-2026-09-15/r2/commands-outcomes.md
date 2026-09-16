# R2 commands and outcomes

The focused R2 assertions failed on the untouched starting candidate with `Timed out: second exchange`, demonstrating the stale polling owner. After implementation, `client-r2.mjs` passed on source and extracted routes.

Passed locally:

- Node 24 syntax checks, composed I1 source/package checker (90 processes), and verifier regression.
- Native Chromium `browser_application.py` on generated source and extracted runtimes, using one ephemeral fixture key per build; both passed.
- Existing composed application route passed.

The common-core checker reached its historical `core-source-full-worker-green` control but failed because that control still expects `OZ_SAVE_GLOBAL_SETTINGS` to use the old standalone fallback. R2 intentionally makes `saEnabled` mean composed readiness independent of login, so this is a stale-control incompatibility, not hidden as a pass.

Installed local API/portal/PostgreSQL acceptance was not run without a disposable database URL in this environment. No production or live marketplace calls were made.
