# I1-C1 R3 architect review — 2026-09-15

Verdict: REWORK_REQUIRED. Task SA-I1-C1-R3-20260915-01. Candidate e26fcc7dd60617838cb9a49d7c6560018cb45ec3, exact remote tree c1beb4927fee66c4065e133c960929e800fabe5e. C1 remains open; PR7 draft and unmerged. This terminal report is handled once. R4 prepared; delivery/process not observed.

## Identity and scope
Three commits since required start0b2a1776ff484d2410b3a43d338ec5548e73f019:20091e9131bb7cb9c0893cbf0f0fa6205de6546d implementation, ee74779ce49297bcf03ab95054c44d30e145b30a evidence, e26fcc7dd60617838cb9a49d7c6560018cb45ec3 final evidence. Diff/source of all implementation changes and cited prior controls reviewed.
Main remains5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c. PR API base field reports historicalbc0cd0088ca50ba06021ea602a46bdd90de91378, but independently fetched virtual mergef14fa4eb5d9a0214932c65c30c7c92e507ef84fe has parents main5d7c8853 and candidatee26fcc7, tree1f15e0a05c9a1ac81ee02dde57ce3826067f02a8. Do not substitute the historical base for current main or candidate.
R3 report renamed original G criteria. Original mapping retained: G1 flights, G2 refresh, G3 denial/Work, G4 versions, G5 installed auth, G6 native restart. Its criterion PASS labels do not establish original acceptance.

## Confirmed gains
Independent probe confirms oversized200 now invalidates account/Work and valid signed account-only UNCONFIGURED with no prior authority authenticates, Work:false. R3 includes same-worker successful account A/B login, account-only restore, held exchange success/error, successful bootstrap401 recovery/lost-response key reuse and actual no-seed worker restart after storage removal. Client entry context checks materially improved. Native source/extracted fixture CI remains green. These are bounded improvements, not whole C1 acceptance.

## Proven defects and incomplete prescribed evidence
1. Oversized201 and206 retain authenticated:true/workAllowed:true after CONTROL_RESPONSE_TOO_LARGE. Exact source bootstrap catch still uses status===200, ignoring request.responseOk. All-successful-response requirement remains unfulfilled.
2. Correctly signed top minimum0.2.4-alpha.2+build.7 is rejected BOOTSTRAP_INVALID_PAYLOAD_SCHEMA. crypto.js has older regex; packages/shared/src/index.ts SemVerV1Schema allows combined prerelease/build and bounds1..64. client.js comparison already uses full grammar. Align verifier grammar, preserve exact comparison.
3. Version matrix only uses actual release0.2.4 against alpha.2/alpha.10 and calls120.0 minimum a fourth-component test. It proves neither prerelease identifier ordering nor fourth-component refusal. Add actual varying client versions and120.0.0.1 minimum.
4. Missing original R3 acceptance scenarios: held start with B completed before A release; old refresh/bootstrap/credentials-only retry across actual same-worker B login; active composed Ozon/WB provider/delivery denial with cleanup failure; invalid signature/key/schema invalidation of existing Work. Existing client-races refresh replacement uses a second worker. Verifier-only tests do not prove authority invalidation.
5. full-worker-composed omits donor MANUAL_BATCH_FAILED=0, BATCH_PROCESSOR_UNCAUGHT=0 and Performance business1/Seller business0 assertions. R3 changed default Performance credentials globally in worker-harness, rather than setting them in this one fixture. extension_import removed existing0.2.3 sender adaptation although instructed to retain prior-version routes. Restore assertions/defaults/0.2.3 branch; do not change production guards.
6. Installed fixture failures described below. Environment-only terminal summary is unsupported.

## Exact-source probes
I1_C1_R3_reproduce.mjs and results record five client cases and one repository-function case, Node24.
Actual Git blob hashes independently match:
- client.js524c074fb2fb0bab29ab150ad4a39576d40b2928
- crypto.js362d336e3b90b89d26c9ec51071d8ab78e2473f8
- auth-repository.tse89dff61c1ca157ffea9acf0cbdc3c5e2f783cd3
Client modules execute in VM with controlled HTTP and temporary signing key. Repository function uses controlled SQL replies matching migration default CLOSED state. No live PostgreSQL, installed browser or provider acceptance claimed for these probes. Defect assertions intentionally detect the candidate failure.

## Installed CI and source diagnosis
Push run34969687336/job104382641739 checked exacte26fcc7 and failed. PostgreSQL18 healthy. Trace: installed_local_integration.py line100 wait_for_url activation after Verify, Timeout30000. The log does not capture OTP HTTP outcome; do not claim it literally contains BETA_CLOSED.
Source-derived prerequisite failure: migration0016 initializes beta_admission_state CLOSED/capacity0; api-harness supplies no existing identities; createAuthRepository.verifyOtp valid NEW identity returns BETA_CLOSED; API maps to403; portal leaves login showing error. Controlled exact repository-function probe confirms BETA_CLOSED with those SQL replies. This is a concrete fixture prerequisite, not evidence that the actual remote HTTP response was captured.
Architect decision: prepare two EXISTING test accounts/identities in the isolated DB, leave admission CLOSED and unchanged, then use real OTP/session/approve/exchange/bootstrap. This gate proves account login/catalog isolation, not new beta registration. No product admission bypass, precreated sessions/tokens or extension storage injection.
Further deterministic errors found before next run:
- API logout success is204, harness asserts200.
- device authorization creation is201, harness counts only200.
- portal preview requests go through43101/api/control-plane; observer only accepts browser responses at43100, so its distinct authorization set cannot include those preview responses.
Correct all together, capture portal OTP status/code safely before waiting redirect, derive transient distinct authorization IDs from portal URLs and output booleans only. Actual post-fix local API/browser pass remains required.

## CI readback
Push Extension run34969687206:
- common-core104382641209 SUCCESS
- Ozon104382641422 SUCCESS
- WB nodes104382641530 SUCCESS
- native104382641557 SUCCESS
- WB browsers104382641477 IN_PROGRESS at readback.
Push I1 run34969687336 FAILURE:
- client104382641521 SUCCESS
- installed104382641739 FAILURE.
PR Extension run34969692552:
- common-core104382658287, Ozon104382658603, native104382658622, WB nodes104382658800 SUCCESS
- WB browsers104382658762 IN_PROGRESS.
PR I1 run34969692534 FAILURE:
- client104382657956 SUCCESS
- installed104382658392 FAILURE.
Documentation PR run34969692570 SUCCESS.
No need to wait remaining WB browser jobs to decide REWORK_REQUIRED based on proven blockers. Counts111/92 are reported gate runs, not acceptance scope.

## Package / limitations
Reported ZIP1800206 bytes, SHA256470a14e478480969302a566d35b27b7499566bcc2918b84902353b702c27cfe1. Source/extracted/repeat archive reported PASS and jobs green in their scopes. Architect did not download ZIP bytes; no independent byte readback claim.
Executor local PostgreSQL initdb no-space remains separately reported. No direct Bridge tool or running process/job ID available; terminal report used as completed submission, next task includes no-overlap check.

## Backlog, not current correction
Source review observed portal BFF does not forward idempotency-key; auth route treats missing header as optional, so this is not established cause of first OTP failure. Review retry correctness at I1-SRV.5 scope, not as unsolicited R4 production change.
Shared server compareSemVerV1 still uses Number and split first two hyphen pieces, unlike corrected client decimal comparator. Record for server reference-client compatibility review; no shared/server change in C1 correction.
Health/P8.4 B5 remains NOT ACCEPTED; serverI1-SRV.0–4 inherited accepted; I1-SRV.5/C2/Health queue unchanged.

## Next
One task SA-I1-C1-R4-20260915-01 startinge26fcc7. Full design ../tasks/I1_C1_R4_2026-09-15.md. R4 IDs preserve original G mapping. R3 not resubmitted. R4 transport ACK pending; after interruption inspect latest final turn/current job before any submission.
