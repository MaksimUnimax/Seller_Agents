# Health B5 C11 R2 evidence

Task: `SA-HEALTH-B5-C11-R2-20260916-01`
Roadmap: `P8.4 / B5`

This is sanitized execution evidence for the C11 failure-provenance
correction. The required base was `f8b35fdec3212dedf0e186830e4af21c719d890d`
with tree `e8ecb16f857fcdbafc29889ae4a4fd37d54c1b8c`; `origin/main` was
`bc718cc5c677ad0eb4598e7de3ad766473ff0847` at preparation. The implementation
candidate is commit `b4a8c17` (`fix(health): retain C11 bridge failure
provenance`), whose full SHA is recorded in `results.json`/the terminal report.

R1 history is recorded only as an invalid trigger: its page-world
`Element.prototype.getAttribute` hook did not observe the Playwright locator
read, so it produced no valid RED and no product candidate. R2 uses a
test-only Node-side Page/Locator Proxy around the real Standard and Work
strategies. The Standard helper flipped on canonical read 1; the Work helper
flipped on canonical read 3. Both valid pre-fix tests failed because the safe
path returned the bridge failure without C09–C12 observations. No fixture
support file or browser driver was changed.

Post-fix focused H3: `2/2` new R2 tests passed; the full Standard/Work spec
files passed `79/79`. The mapper file passed `31/31`. Focused PostgreSQL passed
`18/18`, including both durable Standard/Work cases, on a disposable
PostgreSQL 18 container named `health-b5-c11-r2-pg` (removed after the run).

The correction is limited to selecting the evaluated
`CONVERSATION_URL_IDENTITY` fallback in the two C11 observation builders.
Failure step/code, structural and behavioral outcomes, environment validity,
fallback quality, and evidence absence remain unchanged. No live provider
calls were made; all browser coverage used local controlled fixtures.

Full server-cycle results and local commit identities are captured in
`results.json`. The normal fast-forward push was blocked by unavailable
GitHub credentials; the target remote therefore remains at the required base
and remote CI is not observable from this environment. B5 remains pending
architect review and exact-head remote CI; this evidence does not self-accept
B5.
