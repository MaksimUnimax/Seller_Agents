# I1-C1 R4 architect review — 2026-09-15

Verdict: REWORK_REQUIRED on 60c3a34bdc1b6a5563fad59e8ac38c78b76e32d3. I1-C1 remains open. R4 terminal processed once; next task R5 is prepared for one submission, with no direct Bridge/process acknowledgement.

## Identity and evidence
Repo MaksimUnimax/Seller_Agents; feature/extension-i1-client-2026-09-15; PR7 draft/unmerged.
R4 parent e26fcc7dd60617838cb9a49d7c6560018cb45ec3; candidate tree243d944b3834f4c88c694f4c3f668ddc80bb7bbf.
Remote feature independently matches candidate; main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c unchanged.
PR merge111598ce78535a3922ca427665aff3cd24805e06 has parents main5d7c8853 and candidate60c3a34; PR installed checkout log confirms this merge.
Read current handoff STATE/task, candidate diff, touched source/tests/evidence, application/runtime/popup, frozen tab identity/transport, composition patches and relevant server routes. Candidate STATUS/ROADMAP still contain older I1-SRV statuses; accepted handoff SRV.0–4 facts take precedence, no rollback/reopening.

## Confirmed corrections and bounds
- R4-1: responseOk-based oversized-success invalidation and shared-contract SemVer grammar are correct. Independent probes against exact matching client/crypto/harness Git blobs confirm oversized200/201/206 deny auth/Work and signed top-level0.2.4-alpha.2+build.7 is accepted by compatible0.2.4.
- R4-2: same-worker A/B start/refresh/bootstrap barriers, credentials/no-authority retry fencing and invalid-authority cases are materially implemented. Actual composed Ozon/WB held-provider tests exercise denial with cleanup failure and block the second dispatch/delivery advertisement. Narrow source/test acceptance only; delivering-owner/file/recovery criteria remain absent.
- R4-3: common-core zero MANUAL_BATCH_FAILED/BATCH_PROCESSOR_UNCAUGHT assertions, separate Seller/Performance/auth counts, cd4bce38 and historical0.2.3 adaptation are restored; fixture credential scope corrected. Accepted in this bounded regression scope.
- G6 unchanged native restart fixture and browser jobs pass; no installed/live inference.
- R4-4 existing-account fixture preserves CLOSED beta and normal OTP. Correct201/204 expectations, BFF/direct observations and same-worker checks are present. Installed auth acceptance has FAILED remote evidence, not environment-only BLOCKED.

## Proven popup defect / selected correction
Push installed34975780030/104403007844 checked out60c3a34. PostgreSQL initialized and harness reached activation preview/account option after successful OTP verification; line144 waits #auth-code, which is empty/hidden for64 observations and times out30s.
PR installed34975784338/104403022717 has identical failure on the verified merge.
Executor's cited34969687336/104382641739 is previous R3 and cannot establish R4 status.

popup.js captures active tab; installed harness opens popup.html as its own active tab. saPopupState in application/runtime.js unconditionally resolves tabIdentity before reading auth. Frozen tabIdentity requires an AI content receiver; own popup/unsupported/missing tabs fail. The action refresh catches the error and never renders pending code. Source-extracted function probes reproduce zero auth reads for missing/unsupported tabs and successful pending read for supported control. This is a controlled transport reproduction, not a captured live popup error code. Native browser_application.py previously overrides tabs.query(active), explaining why its green fixture does not test this condition.

Selected R5 correction: a neutral identity fallback ONLY inside read-only saPopupState identity acquisition. Real auth/account/catalog remain readable without AI; no conversation/Work context is invented. Global identity, Start/delivery checks and sender ownership unchanged. Add source and native own-tab regression; retain real installed A/B flow without query override/storage seeding.

## Remaining specified tests
1. R4 delivery negatives only run after owner failed and may use fallback delivery ID. Need actual delivering owner before insert and inserted owner before send, file META/CHUNK/commit/recovery denial, content recovery/no replay, seeded legacy credentials, auth/status/Finish accessibility, no implicit control HTTP. Production composition has authority hooks; test these rather than speculatively replacing them.
2. Existing numeric/text labels compare first identifiers alpha versus alpha-channel, not numeric versus text at the same position. Add alpha.2/alpha.beta and alpha/alpha.1 in both directions. Retain real signed matrix and other passing version controls.
These are previously required R4 acceptance criteria, not new scope.

## Independently read CI
- Push I1 run34975780030: client104403007878 SUCCESS; installed104403007844 FAILURE at empty code. Failure artifact10399456334,351 bytes.
- PR I1 run34975784338: client104403023119 SUCCESS; installed104403022717 FAILURE at same point. Failure artifact10399865377,351 bytes.
- Push Extension34975780173: native104403008687, common-core104403009006, Ozon104403009077, WB nodes104403009091 SUCCESS. WB browsers104403008932 IN_PROGRESS at last read.
- PR Extension34975784301: native104403022476, common-core104403022801, WB nodes104403022827, Ozon104403023185 SUCCESS. WB browsers104403023146 IN_PROGRESS at last read.
- Documentation34975784243 SUCCESS.
No whole-CI green claim. Old unchanged green suites were not rerun by the architect; targeted changed-code probes plus current CI/source review were sufficient.

## Package and local evidence
Tracked r4 receipt agrees with reported ZIP1,801,658 bytes, SHA25657028388aab922f2d5deb955dda9202a7f58e09cc2cfae2fe89d1abdd1bd59c7. Repeat archive/source-extracted/byte readback are executor claims recorded in published evidence; architect did not independently download this ZIP.
Local installed ECONNREFUSED127.0.0.1:45493 is a separate reported environmental failure; remote CI demonstrates a reachable application failure.
Other executor local gate claims match source intent and available successful remote jobs; process counts alone do not close G3/G5.

## Next
SA-I1-C1-R5-20260915-01: exact popup correction plus remaining delivery/version assertions; no other roadmap task. R5 instructions in ../tasks/I1_C1_R5_2026-09-15.md.
Queue preserved: C1 -> I1-SRV.5 -> C2/joint installed acceptance; Health/P8.4 B5 NOT ACCEPTED, B6–B8 pending. No deployment/release/live provider call.
