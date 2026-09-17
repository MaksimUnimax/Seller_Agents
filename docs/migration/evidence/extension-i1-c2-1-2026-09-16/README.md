# C2.1 evidence

Task `SA-I1-C2-1-20260916-01`; current status `ACCEPTED` for the bounded C2.1 scope on candidate `4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1`. Historical candidate/R1/R2 review states remain preserved in their own receipts.

The preserved initial candidate receipt is historical and its review was `REWORK_REQUIRED`. The architect reproduced four defects in candidate `2fdb51545a4e64822be4e68efbc7d4393fefba3a`: origin ownership was checked only under authority, effective time used an initial-only monotonic anchor, a wall-clock jump was not carried by the runtime anchor, and a held checkpoint write could authorize after expiry. The candidate also lacked pending-attempt origin provenance. The exact causes and prior results remain in `results.json`; R1/R2/R3 evidence remains append-only in the corresponding subdirectories.

This evidence family distinguishes source VM, extracted-package VM, native Chromium fixture and installed-local API/portal/PostgreSQL evidence. The focused cache-time suite uses deterministic injected wall/monotonic clocks only in the test VM and deterministic storage barriers; production uses `Date.now()` and `performance.now()`.

The accepted C2.1 candidate preserves the signed envelope and payload bytes, binds restores to exact packaged context, persists the effective-time floor before positive fresh cached Work, and denies at `effectiveNow >= expiresAt`. Existing C1 tests and native popup/content/IDB/attachment guards remain in the run. Provider calls are synthetic and counted as zero.

## Acceptance

C2.1 is accepted only for durable cache context/time, activation restore and fresh-only Work guards on candidate `4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1`, tree `14e8e61d86b955b8a8f22b0c9e24f255654e92f7`, parent/code `6dc770ec30fe7c7165f4c14ff8b6356cd55937d6`, start `06e0eb79badc5e65ea972035a2968f72fdaae6a7`. The independent R3 review closed the bounded defects; historical R1/R2/R3 receipts are not rewritten.

Offline grace, signed profile consumption and joint offline command-result acceptance were outside C2.1. C2.2-A is separately accepted only for verified cached-bootstrap configuration acquisition. C2.2-B remains `NOT_STARTED` and must receive its own bounded scope. No server, contract, migration, Health, main, deploy or release change is claimed by this C2.1 acceptance.
