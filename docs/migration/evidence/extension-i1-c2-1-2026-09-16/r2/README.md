# C2.1 R2 evidence

Task `SA-I1-C2-1-R2-20260916-01`; status `PENDING ARCHITECT REVIEW`.

R2 corrects restore-by-auth-state. Null or absent credentials are treated as normal signed-out/activation state; credential-dependent authority, rotation and cache-clock fields cannot authorize without credentials. Non-null malformed credentials still use terminal invalidation. Restored pending and starting attempts are validated independently, with exact current API origin, portal origin and contract version. Valid pending attempts resume one generation-owned exchange; valid starting attempts reuse their attempt and start idempotency keys without polling before a start response.

Named focused cases were executed in both source and extracted-package VMs:

- `T1-valid-pending-restart`: real `startActivation` with synthetic 201, held exchange, worker recreation, unchanged pending generation/attempt keys/device code/expiry, exactly one resumed exchange, no new device start, activated exchange and signed bootstrap.
- `T2-valid-starting-restart`: durably held starting response, worker recreation, same attempt/start key, idempotent response and exchange; the closed-worker HTTP promise was not released.
- `T3-negative-pending-controls`: API origin, portal origin, contract, missing context, pending shape, starting shape and expiry controls; every invalid record was removed before a fresh attempt. Same-context and normal signed-out restart controls remained clean.
- `T4-actual-completion-veto`: held checkpoint remained unresolved; clocks crossed exact `expiresAt` while held; the released call denied, persisted a floor at or above expiry, and status/getAuthority/restart denied. A separate still-fresh held-write control returned true.
- `T5-storage-failures`: set-failure/removal-success durable denial and set-plus-removal-failure in-memory denial with later nondecreasing-floor recovery.
- `T6-ownership-renewal`: same-session floor preservation, A/B envelope and clock byte fencing, terminal refresh invalidation, and fresh device/session ownership without the old high floor.
- `T7-composed-expiry`: real Ozon text and Wildberries binary Work owners; positive delivery/artifact controls; exact-expiry denial for delivery, send, attachment, recovery and content paths, with zero provider replay and zero added control-plane guard HTTP.

No live provider calls were made. The R1 receipt and results remain historical; its factual addendum records the original task-ID reuse and the assertions R1 did not execute or described inaccurately.

The native Chromium application source and extracted routes were run unchanged and both failed at the existing restore assertion (`authenticated`/`workAllowed` after seed-and-restart); the prior built runtime reproduced the same failure. This is recorded as `FAIL`, not converted to a pass. The signed-bootstrap browser verifier passed. Installed-local acceptance passed against a task-owned disposable PostgreSQL container with two isolated accounts/device sessions and zero live provider calls.

R3 review addendum: the R2 published results remain historical. The current-head native CI run `35060667796` (`job104680101447`) passed both source and extracted routes; installed CI run `35060667782` (`job104680101417`) passed, and client job `104680101221` was successful. The candidate-identical checkout is `c8652fb156b4a14e67ecbf9de8c016176163e1bb`. These current CI facts are separate from the executor's historical native result recorded above. Run `35057935403` was R1 evidence, not R2 CI.

Offline grace, signed profile consumption, joint offline command-result acceptance, Health, merge, deployment and release remain outside this task.
