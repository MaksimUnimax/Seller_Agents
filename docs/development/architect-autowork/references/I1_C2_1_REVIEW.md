# C2.1 architect review — 2026-09-16

Verdict: REWORK_REQUIRED on 981d7e422d45234674aeda84c762245be55ff493.
Task reviewed: SA-I1-C2-1-20260916-01. Next: SA-I1-C2-1-R1-20260916-01.

## Provenance and scope

Branch integration/i1-c1-srv5-2026-09-16 and PR9 head independently match981d7e422d45234674aeda84c762245be55ff493. Tree4711cea969329f5552fe07e7f99af122fda60dc9; parent38471d667936f6f80a3f4aa682057309745ac080. Two commits from accepted synchronization1ff322b3dd2b68c4f02e5390850cd2f1b9548186. Exactly10 changed paths, all within previous task allowlist. Main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c unchanged. PR9 draft/unmerged, virtual merge13cf170bd3f0d6cd884e48f1133ef161f6b5361a has identical candidate tree and parents main+candidate.

Reviewed production client, focused suite, all changed harness/checker/docs patches, previous exact task and cursor. Successful portions are not blanket C2.1 acceptance.

## Independently reproduced defects

Real candidate client Git blob2fdb51545a4e64822be4e68efbc7d4393fefba3a; independent VM with actual config/Ed25519 verifier, synthetic storage/clock/network only.
- restoreOnce validates origin only when authority exists. A real version-mismatch restore persists authority=null with credentials. Restart with changed API origin forwards bearer to the replacement endpoint. A structurally valid pending record also forwards deviceCode after origin change.
- effectiveTime compares monotonic against initial anchor.1000→2000→1500 still permits Work.
- After observed wall+60000 then wall rollback, monotonic+1000 advances effective floor0. Rolling high-watermark must accrue subsequent monotonic elapsed time.
- Hold positive checkpoint write, advance to expiry, release: the pending call returns true; next call returns false. Need completion veto before publishing permission.
Evidence: I1_C2_1_REVIEW_PROBE/probe.mjs and result.json. No real secrets/provider calls or installed claim.

Reproduction layout used c2-review/probe.mjs+client.js and sibling i1-sync-review/seed.mjs/config.js/crypto.js. Seed is already preserved at I1_C2_1_PROBE/seed.mjs; config/crypto come unchanged from repo packages/control-client/src at this head. Materialize those named files into that layout to run node c2-review/probe.mjs. Keys are generated per run and never persisted in review artifacts.

## Missing mandatory behavioral proof

The focused “legacy” test removes the whole auth record, not legacy metadata on retained credentials. The held-storage test lacks an unresolved-promise assertion. No new composed-expiry provider/delivery/real-attachment/recovery matrix. Existing C1 controls are retained but do not substitute for these new time-related behaviors. R1 adds named cases without weakening old tests.

## CI and package evidence

Authenticated architect access succeeded. Executor's local installed SKIPPED is preserved.
I1 run35055691061: installed104665287264 SUCCESS and client104665287453 SUCCESS. Completed logs independently confirm checkout13cf170..., client98processes, browser verification PASS, installed real API/portal/PG PASS with two accounts/device sessions/authorizations, logout isolation, Chromium151.0.7922.34, development OTP and0live-provider calls.
Extension native job104665346251 in35055691094 SUCCESS: both source/extracted native popup/Work/text/binary File/IDB/port/Finish controls PASS, synthetic provider scope.
Documentation35055691054/job104665287448 SUCCESS;458files,0errors.
Core/Ozon/WB-node job API conclusions SUCCESS. Server and WB-browser latest statuses are separately preserved in I1_C2_1_CI.json; no all-green assertion. Pending checks cannot reverse the independently demonstrated REWORK_REQUIRED verdict. R1 is an authorized correction, not a task waiting for these old jobs to pass; no cancellation/rerun requested.
Reported package1814944bytes/SHA25695456cc3a34eec92ce487c75da17d38ec63b63927bc19cb4b47a632d12d9807d and repeat/parity are executor evidence. Architect did not download/read back this candidate ZIP because source defects already require replacement. Do not reuse previous SYNC ZIP readback as C2 proof.

## Decision and next work

C2.1 remains open. R1 fixes transport ownership with or without authority, pending provenance, rolling monotonic calculation, bounded post-storage expiry/owner veto, and missing deterministic behavioral tests. Exact task is tasks/I1_C2_1_R1_2026-09-16.md.
Completion-veto design: durable positive checkpoint is the pre-write observed floor; after-await sample may veto and updates runtime high-watermark, not falsely claim durable storage of that sample. Expiry veto durably records denial/floor; no endless write-until-clock-stops loop.
C2.2 offline grace/profile consumption/joint offline command-result remain open. C1/SRV5/SYNC prior bounded acceptance preserved. Health B5 not accepted/B6–8 queued; S1.2/D3 and full I1/beta/deploy/release open. Manual owner testing remains after joint C2 installed acceptance then Q1.
Executor stopped per terminal; no confirmed active executor task. Save R1 then submit once in final. Saved prompt is not proof of delivery/start.
