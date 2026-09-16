# I1 Server / Extension Synchronization Handoff

Date: 2026-09-16
Status: `I1-SRV.5 IMPLEMENTED_CANDIDATE / ARCHITECT_REVIEW_PENDING`

## Implemented server contract

The accepted server authority remains the existing device authorization,
portal approval, token exchange, access authentication, V2 signed bootstrap,
packaged trust, refresh rotation, and durable device revocation path. This
candidate adds one named reference acceptance scenario joining those existing
authorities. It does not add a second auth stack, second trust source, new
HTTP contract, migration, or extension runtime implementation.

The reference scenario covers/asserts the intended sequence with real development OTP,
portal approval, disposable PostgreSQL/API/portal harness, V2 account identity,
K1 trust verification, account tamper/unknown-key/device-mismatch negatives,
refresh rotation continuity, and portal revoke fail-closed behavior. Its local
refresh rotation continuity, and portal revoke fail-closed behavior. The added
worker consistency regression covers/asserts runner-owned K1/K2 generation,
worker absence of private signing material, and equality between inherited K1
trust and disposable database metadata. Focused execution passed `2/2`, and
the full server E2E passed `88/88` on the task-owned disposable harness.

The prior full-host PostgreSQL disk-exhaustion outcome remains historical
`BLOCKED` evidence and is not relabeled PASS. The architect-selected repair
keeps fresh pair generation and private signing material in the runner/API
fixture ownership boundary; workers retain inherited public JSON.

## C1 verified scope

C1 is a separate accepted client candidate at
`56c81a3521c02502b65fd713aec890e5a30f038d` on
`feature/extension-i1-client-2026-09-15`; PR7 is draft and unmerged. C1 covers
source/package/native and installed-local API/portal/PostgreSQL acceptance,
development OTP, synthetic provider/AI, and zero live calls. It does not turn
the server reference client into an installed extension or establish live
marketplace/email/provider acceptance.

## Pending client and product integration

C2/offline/profile integration is still pending. The existing
`SimulatedExtensionClient` is intentionally a V1 policy/reference path; the
new server test uses direct V2 HTTP requests for V2 acceptance and does not
claim V2 cached browser behavior. No second client auth stack or V2 retrofit is
authorized by this handoff.

## Explicit boundaries

- `S1.2`: real email provider, credentials, and preproduction remain deferred.
- `D3/S2`: store/profile synchronization, rare key transfer, and full beta
  product integration remain pending.
- Health/Stream B: Health/P8.4 H3 remains a separate authority and is not part
  of Stream A I1 synchronization.
- I1/D2 and beta: this handoff does not declare either complete.
- Roadmap: no new order or additional implementation is opened by this
  document. The next action is architect review of the bounded candidate.

## Evidence and publication

See [I1-SRV.5 reference acceptance](I1_SRV_5_REFERENCE_ACCEPTANCE_2026-09-16.md)
for the criterion matrix, exact test names, current gate outcomes, historical
I1-SRV.0–4/PR6 evidence, and C1/PR7 separation. The branch is to be reviewed
as a draft PR only; no merge or follow-on S1.2/D3/C2/Health launch is part of
this task.
