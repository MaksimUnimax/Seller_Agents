# C2.1 R2 architect review — 2026-09-16

Verdict REWORK_REQUIRED for SA-I1-C2-1-R2-20260916-01.

## Exact candidate
Remote integration/i1-c1-srv5-2026-09-16 and draft PR9 independently match06e0eb79badc5e65ea972035a2968f72fdaae6a7; treee090b748a6a1aa8d35869f215c7846984e4f73f3; parentead575816dde5df2613a61cb8aa599e216c8066a.
Start13068c24354e8ec61bab6cf05598a5bb6ced7b65; code790975c4879de41043d747485f4c957e7f51b003; evidence33ce720c9cdcd01fb15d80cffe520ebe13196877 and06e0eb79; receipt-test commitead5758.
Six changed files, all allowlisted. Merge c8652fb156b4a14e67ecbf9de8c016176163e1bb verified candidate-identical tree and main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c + candidate parents.
Read cursor, exact R2 task, client diff, added tests/evidence and native harness. Domain migration агентселлер.ру→октопорт.ру is owner-authorized parallel work; preserve it, do not weaken auth/origin binding.

## Confirmed correction
Independent actual-start/source VM probe on exact client Git blobcb3632414fbbce7aca678bc91a40d1120865cc41: after restart same-context pending now preserved, exchangeCalls2 rather than1, lastError null. R2 fixes the R1 activation regression. Prior R1 origin/time fixes are retained; no reimplementation requested.
Added tests meaningfully cover starting retry, pending negative controls, expiry during held write, checkpoint storage failure, floor renewal and real composed Ozon/WB delivery/artifact expiry.

## Remaining proven defect
restoreOnce invalid-pending branch still calls queueMutation+commit. commit writes before updating state and has no removal fallback.
Independent probe: actual activation, observe expired pending, recreate worker with AUTH set failure and available removal. restoreError=PROBE_AUTH_SET_FAILED; writeAttempts1; removeAttempts0; durablePendingRetained=true. This violates the already-required in-memory-first durable discard/fallback and blocks initialization despite available removal.
R3 reuses the existing terminal invalidateKnown path for this invalid persisted auth record; valid pending/starting unchanged. No new auth design.

## Remaining evidence omissions
T6 has floor renewal/terminal new owner and held A HTTP/B byte checks, but no queued checkpoint/reset or same-session distinct-envelope decision race.
T7 has real positive/negative delivery and original artifact bytes, but no fresh denied command/provider dispatch attempt after expiry and no assertion on manual_recovery. R3 adds only those missing assertions. Do not equate headline T1–T7 PASS or98processes with every requested case.

## Native / CI
The local native FAIL is preserved, cause not established by published assertion-only evidence. Prior-built-runtime failure is not exact provenance or diagnosis.
Independent current-head native CI35060667796/job104680101447 SUCCESS, completed log read: both source/extracted native fixtures PASS on Chromium151.0.7922.34. Real popup/Work/text/binary File/IDB/port/Finish tested with synthetic provider;0live. Checkoutc8652fb verified.
Current installed CI35060667782/job104680101417 SUCCESS, completed log read: API/portal/PostgreSQL,2accounts/devices/authorizations,logout isolation,same worker,developmentOTP,0live.
Client job104680101221 SUCCESS; core104680101386/Ozon104680101372/WBnodes104680101568SUCCESS by job API. Documentation35060667810SUCCESS by run API.
Server35060667790/job104680101324 and WB-browser104680101195 remained in progress at snapshot. No all-green claim, cancellation or rerun. R3 correction is already justified independently; it does not wait for old candidate jobs to pass.
The executor's quoted35057935403 /3e69df3 is prior R1 evidence, not current R2 CI.
Package1822586bytes/SHA256d43b25e4ab7d981d3d0d93b759c8e1f7d44d0b21c92d6f7a03f6b1eed4ac22f4 is reported; not downloaded for independent byte readback in this rejected-candidate review.

## Evidence / continuation
I1_C2_1_R2_REVIEW_PROBE/{fixture.mjs,pending-probe.mjs,pending-result.json,storage-probe.mjs,storage-result.json}. Execution layout c2-r2-review with exact candidate client.js and sibling i1-sync-review seed/config/crypto; seed already preserved in references/I1_C2_1_PROBE. Real Ed25519 with synthetic server/storage; no installed/live claim from probes.
Next SA-I1-C2-1-R3-20260916-01 specified at tasks/I1_C2_1_R3_2026-09-16.md, prepared for one final submission. Executor stopped per terminal; no direct Bridge/process visibility. Saving is not launch.
C2.1 open; C2.2/offline/profile/joint offline open. Earlier C1/SRV5/SYNC bounded acceptance unchanged. Health B5 NOT ACCEPTED/B6–8 queued; S1.2/D3/full I1/beta/deploy/release remain open. Manual owner testing after joint installed C2 and Q1.
