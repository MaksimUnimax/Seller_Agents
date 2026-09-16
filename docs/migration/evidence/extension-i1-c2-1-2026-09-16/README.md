# C2.1 evidence

Task `SA-I1-C2-1-20260916-01`; status `PENDING ARCHITECT REVIEW`.

This receipt distinguishes source VM, extracted-package VM, native Chromium fixture and installed-local API/portal/PostgreSQL evidence. The focused cache-time suite uses deterministic injected wall/monotonic clocks only in the test VM and deterministic storage barriers; production uses `Date.now()` and `performance.now()`.

The candidate preserves the signed envelope and payload bytes, binds restores to exact packaged context, persists the effective-time floor before positive cached Work, and denies at `effectiveNow >= expiresAt`. Existing C1 tests and native popup/content/IDB/attachment guards remain in the run. Provider calls are synthetic and counted as zero. The installed-local integration script was not changed; when its disposable database prerequisite is unavailable, that gate is recorded as `SKIPPED`, not `PASS`.

Offline grace, signed profile consumption and joint offline command-result acceptance remain open C2.2+ boundaries. No server, contract, migration, Health, source-branch, main, deploy or release change is included.
