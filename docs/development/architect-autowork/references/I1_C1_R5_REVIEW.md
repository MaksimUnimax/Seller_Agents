# I1-C1 R5 architect review — 2026-09-15

Verdict: WAITING — required WB browser jobs remain IN_PROGRESS. Implementation/source/package and installed-local checks reviewed successfully in the bounded scope below. No new rework task is warranted from this review; C1 is not closed before all applicable CI completes.

## Current identity
Task SA-I1-C1-R5-20260915-01; feature/extension-i1-client-2026-09-15; PR7 draft/unmerged.
Base60c3a34bdc1b6a5563fad59e8ac38c78b76e32d3, tree243d944b3834f4c88c694f4c3f668ddc80bb7bbf.
Candidate56c81a3521c02502b65fd713aec890e5a30f038d, tree5c14497e239922c3712d0c3be12af7ee59e665f5; sole parent is base. Remote feature independently matches.
Main5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c unchanged.
PR merge542a334c39dd9cda52c72f07c98a676a207f84d1 has verified parents main5d7c8853 and candidate56c81a3. Installed PR checkout log confirms the merge SHA.

## Review findings
Read current handoff STATE, R5 task, current roadmap, entire bounded diff, r5 evidence/receipt, current runtime and R5 worker fixtures; inspected actual packaged guards and installed job logs.
- Only production change is saPopupState's narrow identity fallback. Auth/catalog/storage failures are outside the catch. Unsupported tabs return neutral identity and no Work context. Supported page pending Start remains intact; global identity/Start/delivery guards are unchanged.
- Native own-tab popup now has no active-AI override, renders account/catalog and disables Start. The established positive AI-tab flow is preserved.
- Installed local gate passed on BOTH pure candidate and verified merge: real local PostgreSQL/API/portal, development OTP A/B,2 starts/exchanges/bootstrap,2 OTP request/verify, logout204, same worker, distinct accounts/device-session tuples/authorizations, catalog isolation, beta unchanged and zero live provider calls.
- R5 SemVer matrix now exercises alpha.2/alpha.beta and alpha/alpha.1 in both directions with actual signed client/config variants. Previous controls remain.
- Six source/extracted R5 fixtures use real delivering owners and retain cleanup-write failures through authority-denied requests; Ozon/WB before insert and after insert/before send are exercised. Legacy credentials are seeded under actual runtime key names; Finish succeeds after cleanup writes are restored.
- Published R5 attachment negatives use a placeholder artifact key and omit explicit permission/error-code assertions. Instead of inferring the rejection reason, architect ran a bounded stronger probe on the downloaded exact-candidate CI package: actual saved artifact key, exact WORK_POLICY_BLOCKED, no attach/click/insert grants and no extra IDB reads; additionally valid META/CHUNK byte equality followed by denial in the SAME worker, then auth/status availability. All passed. This closes the specific evidence ambiguity without speculative production changes or another implementation round.
- R5 diagnostics use regex-bounded public error codes rather than a literal allowlist; codePresent reflects lastError, not the rendered activation code. This is a diagnostic wording limitation, not a remaining demonstrated authorization failure. No raw auth data was published in reviewed evidence.

## Independently observed CI
Push I1 run34980773436: client104420205030 SUCCESS; installed104420205399 SUCCESS, checkout56c81a3.
PR I1 run34980778468: client104420224976 SUCCESS; installed104420225438 SUCCESS, checkout542a334.
Push Extension34980773590: native104420205173, WB nodes104420205623, core104420205656, Ozon104420205673 SUCCESS; WB browsers104420205685 IN_PROGRESS.
PR Extension34980778417: native104420225185, WB nodes104420225414, core104420225419, Ozon104420225558 SUCCESS; WB browsers104420225471 IN_PROGRESS.
Documentation34980778452 SUCCESS.
Executor gh/API404 does not prevent architect observation. READY_FOR_ARCHITECT_REVIEW in terminal is not all-green acceptance.

## Package readback
Downloaded exact-candidate I1 artifact10400594363 from run34980773436. Artifact archive digest aca25771b72c9b6c3062318dcbf875a29c7ee5dc237553a130572c6d8ec4afc6 independently matches GitHub metadata.
Its CI package SHA2562f364316986187db50251dc4708317ca612ce51dd7106138106f64239605ba43,1,801,114 bytes; all39 entries match its composition receipt hashes/sizes. Changed runtime Git input matches receipt and occurs verbatim in packaged shared/application.js.
Executor separately reports browser-package SHA256b98b87a176c8bed2a1550e4838ba1c563aae28a938a9d284436fe35e72e62e6e,1,801,899 bytes. That archive was not downloaded; do not conflate the two builds or claim its bytes were independently verified.
Local README lists Node22 for source checks and later Node24/Corepack for installed run; remote configured gates passed. No dependency change is present.

## Continuation
R5 terminal processed once; executor is stopped according to terminal, no direct server-process observation. No R6 prepared or issued. Required CI is still running; do not duplicate R5 or rerun green checks.
Next action: read only completion/status and, on failure, exact logs of pending WB jobs104420205685/104420225471. If successful with unchanged head, use this completed review for bounded R5/C1 acceptance, then prepare I1-SRV.5 against the current server handoff. Do not restart full review.
Server I1-SRV.0–4 accepted history and Health/P8.4 B5 NOT ACCEPTED / B6–B8 pending preserved. C2, full joint installed/live acceptance, deployment/release remain separate.
