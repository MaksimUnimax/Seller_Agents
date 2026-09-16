# C2.1 evidence

Task `SA-I1-C2-1-20260916-01`; status `PENDING ARCHITECT REVIEW`.

The preserved candidate receipt is historical and its review is `REWORK_REQUIRED`. The architect reproduced four defects in candidate `2fdb51545a4e64822be4e68efbc7d4393fefba3a`: origin ownership was checked only under authority, effective time used an initial-only monotonic anchor, a wall-clock jump was not carried by the runtime anchor, and a held checkpoint write could authorize after expiry. The candidate also lacked pending-attempt origin provenance. The exact causes and prior results remain in `results.json`; R1 evidence is in [`r1/`](r1/).

This receipt distinguishes source VM, extracted-package VM, native Chromium fixture and installed-local API/portal/PostgreSQL evidence. The focused cache-time suite uses deterministic injected wall/monotonic clocks only in the test VM and deterministic storage barriers; production uses `Date.now()` and `performance.now()`.

The candidate preserves the signed envelope and payload bytes, binds restores to exact packaged context, persists the effective-time floor before positive cached Work, and denies at `effectiveNow >= expiresAt`. Existing C1 tests and native popup/content/IDB/attachment guards remain in the run. Provider calls are synthetic and counted as zero. The installed-local integration script was not changed; when its disposable database prerequisite is unavailable, that gate is recorded as `SKIPPED`, not `PASS`.

Offline grace, signed profile consumption and joint offline command-result acceptance remain open C2.2+ boundaries. No server, contract, migration, Health, source-branch, main, deploy or release change is included.
