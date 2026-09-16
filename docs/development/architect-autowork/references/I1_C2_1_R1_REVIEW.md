# C2.1 R1 architect review — 2026-09-16

Verdict: REWORK_REQUIRED.
Actual reviewed assignment: SA-I1-C2-1-R1-20260916-01. Executor terminal and R1 evidence incorrectly use original SA-I1-C2-1-20260916-01. Assignment matched by exact start981d7e4, six allowlisted changed paths and R1 implementation; no duplicate original task was issued.

## Candidate provenance
Repo MaksimUnimax/Seller_Agents, branch integration/i1-c1-srv5-2026-09-16.
Exact remote/PR9 head13068c24354e8ec61bab6cf05598a5bb6ced7b65; tree035cbd5ee60919597ae29f56aa1ed4240950fb06; parent/code17d54dc3a8577ae6d46736608c0bbed909b70d1a.
Start981d7e422d45234674aeda84c762245be55ff493.
PR9 draft/unmerged; merge3e69df315214546b32b09c411fcdadf754ebdcdc verified main+candidate parents and candidate-identical tree.
Main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c unchanged.
Cursor and exact issued R1 task read; all client changes, focused test additions and evidence inspected. Existing client-r4/client-r5 route fixtures read for the precise remaining acceptance design.

## Corrected behavior independently confirmed
Previous architect probes rerun against exact candidate client Git blob a6a2e7d18376f01fcfd73d0ca2452f2485723b42.
Monotonic1000→2000→1500 now denies; elapsed1000 after wall rollback advances effective1000; authority-null changed-origin restore emits no bearer request; legacy pending changed-origin restore emits no deviceCode; held checkpoint crossing expiry returns false on that same call and next call.
These are actual source VM results with real Ed25519 verification and synthetic clocks/storage/network, not installed/live proof. Preserve the working R1 corrections.

## New regression and cause
Independent probe calls actual startActivation with synthetic201, holds exchange, then recreates worker with unchanged backing/config/wall. Before restart pending.phase=pending, authContext present, credentials=null, exchangeCalls1. After restart pending=null, exchangeCalls1, STORED_CREDENTIALS_INVALID.
restoreOnce unconditionally invalidates every saved state with !validCredentials(state.credentials). Null credentials are the expected pre-exchange activation state, so valid pending is wiped before independent pending validation/polling.
validAuthContext additionally lacks required contractVersion equality.
Correction: classify absent vs malformed credentials; validate/preserve pending and starting states independently; exact origins+contract; preserve generation/keys/expiry for valid restored attempts; resume owned polling only after initialization.

## Missing / overstated proof
New held-write test releases and awaits true before advancing to expiry, despite claiming same-call completion veto. Architect independently confirmed implementation fixes that bug; automated regression still must move clocks while held.
No completed T5 storage-removal-success restart, T6 exact clock/envelope owner matrix, or composed-expiry dispatch/delivery/real artifact/recovery matrix. Old C1 403 controls cannot stand in for expiry-specific behavior.
R1 “D” is described as assertions included in A and must not be presented as an additional independently executed case.
R2 gives concrete T1–T7 with route/message names and positive controls. No runtime redesign assigned for unobserved failures.

## CI / artifact limits
Authenticated architect connector works.
I1run35057935403: installed104671924481 and client104671924614 SUCCESS; completed logs read. Checkout3e69df3 matches verified merge tree. Client98processes/verifierPASS; installed actual API/portal/PostgreSQL PASS, same worker, two accounts/devices/authorizations, logout isolation, Chromium151.0.7922.34, development OTP,0live-provider calls.
Native/common-core/Ozon/WB-node job API conclusions SUCCESS in35057935284; documentation35057935305 SUCCESS. Server and WB-browser still in progress at latest snapshot. No all-green claim; no rerun/cancellation. Source-proven correction does not depend on waiting for old candidate checks to become green.
Reported ZIP1822215bytes/SHA2560dbfcf2f390b00417395164b5f20c4e676c02695ecaa359ee178cdaf027f39ae; local repeat/parity reported. This candidate ZIP was not independently downloaded; previous accepted SYNC readback is not evidence for this ZIP.
Machine-readable CI snapshot: I1_C2_1_R1_CI.json.

## Reproduction / handoff
Files under I1_C2_1_R1_REVIEW_PROBE preserve previous-probe/results and fixture/pending-probe/result.
Original execution layout: c2-r1-review/{client.js,fixture.mjs,pending-probe.mjs,previous-probe.mjs}, sibling i1-sync-review/{seed.mjs,config.js,crypto.js}. Seed already exists at references/I1_C2_1_PROBE/seed.mjs; config/crypto/client are exact repo packages/control-client/src files at reviewed head. Materialize that layout, run node c2-r1-review/pending-probe.mjs and previous-probe.mjs. Synthetic keys generated per run; no credentials/private keys saved in review evidence.

Next task SA-I1-C2-1-R2-20260916-01 prepared at tasks/I1_C2_1_R2_2026-09-16.md for one final submission.
C2.1 remains open; C2.2/offline/profile/joint offline not started. C1/SRV5/SYNC historical bounded acceptances preserved. Health B5 not accepted/B6–8 queued; S1.2/D3/full I1/beta/deploy/release open.
Executor stopped per terminal. No direct Bridge/process visibility and no confirmed new running task. Saved task does not prove delivery; do not resend after final if delivery unknown.
