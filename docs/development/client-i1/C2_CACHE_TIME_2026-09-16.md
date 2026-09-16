# C2.1 durable cache context and effective time

Status: `PENDING ARCHITECT REVIEW` for task `SA-I1-C2-1-20260916-01`.

This step is limited to the browser control client on integration branch `integration/i1-c1-srv5-2026-09-16`, starting at `1ff322b3dd2b68c4f02e5390850cd2f1b9548186`. It adds no server fields, contract changes, offline fallback, timers or provider requests.

The existing `seller_agents_control_auth_v2` record now stores an exact packaged cache binding under `authority.cacheBinding`: control and portal origins, contract and extension versions, browser family/version, normalized resolved AI (or `null` for account-only authority), and the lowercase SHA-256 digest of the canonical packaged trust bundle. The same record stores `state.cacheClock`, owned by the exact device/session and package origin/contract, with trusted server time and a nondecreasing effective-time floor. These are local metadata and are not hardware anti-rollback guarantees.

Restore verifies the existing envelope and exact decoded payload with the current packaged ring before applying the existing account/profile/fingerprint checks. Missing or malformed binding/clock, changed ownership, and origin mismatch fail closed; origin mismatch removes credentials before a request can target the replacement origin. Same-origin version, browser, trust-ring and AI-context mismatch discards cached authority while preserving structurally valid credentials and the session floor for a fresh signed bootstrap. Expired signature-valid snapshots remain non-authorizing cache.

The Work-facing `status`, `canWork`, `ensureForIdentity` fast path and `getAuthority` result share one serialized checkpoint. It combines `Date.now()`, `performance.now()`, trusted server time, durable floor, runtime high-watermark and the runtime anchor; unsafe or backwards monotonic observations deny. A positive result is returned only after the increased floor has been persisted and identity rechecked. Freshness is half-open: equality with `expiresAt` denies. No offline grace permission is granted.

The focused suite is `tests/regression/extension-core/client-i1/client-cache-time.mjs`. It retains the base expiry/rollback regression as RED evidence, then covers fresh/expiry boundaries, restart floors, observed expiry/grace, unsafe clocks, storage barriers, all cache-context dimensions, legacy records, signed server-time regression and account-only `UNCONFIGURED`. Existing C1 race, denial, native and installed-local gates remain required.

Open boundaries: offline-grace eligibility, signed profile consumption and full joint offline command-result acceptance remain C2.2+; C2.1 is not C2 completion. Health B5/B6–B8, S1.2/D3, full I1/D2, beta, release and deployment remain open.
