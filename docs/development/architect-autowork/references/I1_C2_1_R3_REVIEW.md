# C2.1 R3 independent architect review
Date: 2026-09-16
Task: SA-I1-C2-1-R3-20260916-01
Candidate: 4acc5fb3336e3e38fa30d6a7ec16c80730bcd7e1
Tree: 14e8e61d86b955b8a8f22b0c9e24f255654e92f7
Parent/code: 6dc770ec30fe7c7165f4c14ff8b6356cd55937d6
Start: 06e0eb79badc5e65ea972035a2968f72fdaae6a7
Branch: integration/i1-c1-srv5-2026-09-16
PR9 draft/unmerged; main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c unchanged.
PR virtual merge48bfe9632c055a7743f1da5c5a8a1159fa48b7c0 has the identical candidate tree and main+candidate parents.

## Decision
WAITING only for the already running WB browser baseline jobs. Source review, independent defect reproduction, targeted current CI and artifact readback are complete. No executor currently running per terminal; no new prompt submitted yet.

## Source and behavior
Compare exact R2 start to candidate: five allowed files, production change is the single invalid restored activation branch routed through terminal invalidateKnown.
Independent source VM on exact Git blob35497eac2582877e7851bcb27b3c5833bd060e79: actual startActivation then expiry and recreated runtime with AUTH.set failing. restoreError=null, set attempts1, remove attempts1, durable pending absent. R2 identical probe was rejected with PROBE_AUTH_SET_FAILED, remove0, pending retained. This confirms the specific correction; no installed claim derives from this probe.
R3-A/B assert real activation and recreation, failed-set removal, both-fail honest persistence error and fresh recovery. Valid pending/starting controls retained.
R3-C asserts queue-held checkpoint/reset/B order and a different real-signed same-session envelope. Its allowed pre-replacement ordering is explicitly scoped; not misrepresented as simultaneous B completion through a locked queue.
R3-D adds fresh denied Ozon/WB dispatch and manual_recovery absence, preserving actual binary artifact and positive bytes.
Downloaded current CI focused source/extracted logs both PASS with R3-A–D and retained T1–T7. Source assertions reviewed, counts are not the acceptance criterion.

## Current remote evidence
I1 run35062978145, installed104687048991 and client104687049183 SUCCESS. Completed logs prove checkout48bfe963..., two isolated account/device/authorization scenarios, same worker, development OTP, zero live provider calls.
Extension PR run35062978154: native104687049112 SUCCESS with source/extracted Chromium151.0.7922.34, actual popup/text/binary/IDB/Finish under synthetic AI/fetch. Core104687048920/Ozon104687049205/WB-nodes104687049107 SUCCESS by job API. WB-browsers104687049023 pending at this checkpoint.
Additional existing push run35062974367: core104687036989/Ozon104687037101/WB-nodes104687036940/native104687037225 SUCCESS; WB-browsers104687037055 pending. Neither run relaunched.
Server35062978184/job104687050044 SUCCESS; completed log shows39 integration files/1527 tests, all20 health-persistence tests executed,88 E2E passed. This does not accept separate Health B5.
Documentation35062978385/job104687049763 SUCCESS.
No old R2 CI is counted as current R3 proof.

## Package
Independent downloaded artifact10433241137 from current I1 run: default development ZIP1822450bytes, SHA256ceede563a4869184f26d161875ce6ca39f12c37245ee49c2917302d3a4ea4e59.39/39 package files identical to packaged runtime and extracted copies; no mismatches. Checker98 processes PASS.
Changed client input SHA256eca6f66f9376a80933df068dbbd893e1d45a6b2ffced513ce1090f5592487f8a/61119bytes matches exact remote Git content and downloaded composition input receipt.
Executor reported1823235bytes/SHA25603ed7c22618cbb9b49c83e0c2b6a4735b314c0a30480258550b02492cc8dab65 is separate local ephemeral-key package evidence, not the downloaded default ZIP. Current native CI's ephemeral-key ZIP also has a separate hash86db3a4c3ff65198f4f823ae4121b765ac69b8ddd888b46cd7cb9e62480521f9.

## Evidence errata and boundaries
R3 README/results label runs35060667796/35060667782 and checkoutc8652fb as current candidate facts. They belong to R2. The correct R3 refs/jobs above supersede that attribution; original evidence is retained as history. R3 start field is truncated; full start is stated above. Next task requires a factual addendum, not rewriting old result JSON.
C2.1 is bounded durable context/time/restore and fresh-only Work authorization. Offline-grace acquisition/use, signed capability/profile execution and joint offline command-result acceptance remain open. C2.2-A is designed as acquisition only; it cannot grant Work or bypass the unimplemented capability/profile intersection.
C1/SRV5/SYNC accepted scopes preserved. Health B5 NOT ACCEPTED/B6–B8 queued. S1.2 real email/preprod,D3,fullI1/D2,beta,deploy/release remain open. Owner manual tests follow joint installed C2 and Q1.
Owner's parallel агентселлер.ру→октопорт.ру migration is authorized; preserve changes, never relax origin/auth binding.

## Next
Prepared SA-I1-C2-2A-20260916-01: private trustworthy request provenance, online-first bootstrapWithPolicy, reverified exact-context cache acquisition under signed grace and existing durable clock. Work consumers remain fresh-only pending separate signed-profile/capability integration.
Task is prepared, not sent or running. Await final existing CI gate in active architect cycle, then update acceptance/cursor and submit exactly once.
