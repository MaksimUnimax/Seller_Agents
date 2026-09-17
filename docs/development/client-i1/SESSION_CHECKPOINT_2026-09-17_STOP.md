# Seller Agents / I1-C2 session checkpoint — 2026-09-17

Status: `PAUSED BY OWNER / WAITING FOR CONTINUE COMMAND`.

This file records the exact stopping point. No further implementation, merge, CI triage, roadmap step, or capability wiring should be started from this session until the owner explicitly says to continue.

## Authoritative branch at pause

Repository: `MaksimUnimax/runtime-fixtures`.

Working/integration branch: `integration/i1-c1-srv5-2026-09-16`.

Head immediately before this checkpoint commit: `8333c3af04a01d7e6fdb79002d800cc73f9765a7`.

That head is a docs-only post-merge checkpoint on top of C2.2-C merge commit `ff55e8aaf3d473582ccce37a89c45098789fa2b3`.

Canonical `main` is still separate; PR #9 remains the draft synchronization/integration PR and was not merged by this work.

## Completed in this session

### C2.2-B — signed bootstrap metadata projection

Status: `ACCEPTED / REMOTE VERIFIED / MERGED INTO INTEGRATION`.

Exact tested implementation:

- head `8a5d9e6ca611d69512ad28fc00684c63bdc87324`;
- tree `1fb11a510d6dd314a0647c5348e56d1a26bc007e`.

Result:

- added a detached frozen projection of already verified signed Bootstrap V2 metadata;
- exposes signed `features`, `entitlements`, configuration identity and validated AI metadata;
- always reports `executionAuthority: false`;
- does not synthesize `capabilities` or `workAllowed`;
- does not change Work, provider, replay, delivery, recovery, quota, scheduler, server contracts, schema, migrations or OpenAPI.

Acceptance evidence:

- focused metadata gate `5/5 PASS` on source and `5/5 PASS` on extracted package;
- full Extension I1 `102/102 PASS`;
- browser verifier PASS with tamper rejection;
- installed-local API/portal/PostgreSQL PASS;
- Extension CI push/PR PASS including WB browser baseline;
- deterministic package `39/39/39`, zero byte mismatches, SHA-256 `5badfd1a67a824ecd160694fdb45ee25fb2dac27386e22ab93145eeaca4b6afa`.

PR #18 merged normally into the integration line. Post-merge documentation was corrected to reflect the merge fact.

Evidence: `docs/migration/evidence/extension-i1-c2-2b-2026-09-17/r1/`.

### C2.2-C — packaged local capability authority

Status: `ACCEPTED / REMOTE VERIFIED / MERGED INTO INTEGRATION`.

Exact tested implementation:

- head `a1d0a9dc83daf80536f58bf56d498206da8a1eb3`;
- tree `1f7a54c0ac0c1c95b680071f7036f084715bac4c`.

Result:

- created immutable `SellerAgentsPackagedCapabilities` package-local authority;
- records exactly four reviewed packaged adapter-presence facts:
  - `marketplace.ozon.adapter`;
  - `marketplace.wildberries.adapter`;
  - `ai.chatgpt.web.adapter`;
  - `ai.alice.web.adapter`;
- manifest and every row use `executionAuthority: false`;
- `signedPermissionBindings` is empty;
- global authority slot is non-writable and non-configurable;
- remote signed feature/entitlement keys cannot bind to local capability merely by matching a name;
- no `canWork()`, Work, application, provider, server or scheduler execution path consumes this manifest as permission.

Acceptance evidence:

- focused packaged-capability gate `5/5 PASS` on source and `5/5 PASS` on extracted package;
- full Extension I1 `104/104 PASS`;
- browser verifier PASS with signed tamper rejection;
- installed-local API/portal/PostgreSQL PASS;
- Documentation CI PASS;
- Extension CI push and PR PASS including common core, Ozon, WB Node, native Chromium and WB browser baseline;
- deterministic package `39/39/39`, zero byte mismatches;
- package size `1,839,269` bytes;
- package SHA-256 `61e992cc28323c68bb2f448d88bb2d9ecc7ce2e0f1c9ced5de82b4ac2d123057`;
- packaged authority input `2,072` bytes, SHA-256 `17783d63479ab5282b0414fd83bfcecbb8d0ed86f272c5e2f2005a081466e927`.

PR #19 merged normally into the integration line at merge commit:

`ff55e8aaf3d473582ccce37a89c45098789fa2b3`

tree:

`cedba79daf0b25109c720c0976bd78deb00834db`

Post-merge roadmap/status/evidence were then fixed by docs-only fast-forward commit:

`8333c3af04a01d7e6fdb79002d800cc73f9765a7`

Evidence: `docs/migration/evidence/extension-i1-c2-2c-2026-09-17/r1/`.

## CI state at the exact pause moment

The implementation acceptance is already complete and is pinned to the exact tested implementation heads above.

A redundant post-merge/docs-triggered Extension CI run is still in progress on branch head `8333c3af04a01d7e6fdb79002d800cc73f9765a7`:

- run `35192570545`;
- Ozon baseline already `SUCCESS`;
- common core, native Chromium, WB Node and WB browser jobs were still running at the last read;
- Documentation CI on the same head already `SUCCESS`.

This in-progress rerun does not invalidate C2.2-C acceptance because no production implementation changed after exact-tested head `a1d0a9dc83daf80536f58bf56d498206da8a1eb3`; subsequent changes were acceptance/status documentation only. On resume, read this run once and record its final state before starting the next bounded implementation step.

A separate redundant PR-head Extension CI rerun on acceptance/docs head `513d5e770edd823106adc0e58ae023ba0ccefe40` was also still executing the preserved WB browser route when PR #19 was merged. It is additional evidence only, not the authority for implementation acceptance.

## What remains explicitly closed

Do not infer from C2.2-B/C that any of the following is accepted:

- signed feature/entitlement → packaged capability mapping;
- effective executable capability authority;
- offline Work or stale-cache Work;
- change to `SellerAgentsControlClient.canWork()`;
- Work Start/Resume wiring;
- command execution authorization from cached signed metadata;
- provider dispatch/replay changes;
- delivery/recovery/quota/file/scheduler changes;
- independent packaged AI-profile fingerprint authority;
- real email delivery / S1.2;
- D3/S2;
- full I1 or full D2;
- live marketplace/AI/provider acceptance;
- beta, deployment or release.

## Exact next step after owner says continue

Do **not** jump directly to offline Work.

First:

1. read final state of the still-running post-merge CI run(s) and record only factual results;
2. re-read current integration head and C2.2-B/C acceptance receipts;
3. design the next bounded capability step as a non-executing/read-only authority first;
4. identify explicit reviewed signed server permission keys rather than guessing from local capability names;
5. define a fail-closed mapping/intersection rule where:
   - packaged local capability must exist;
   - signed permission must explicitly allow it;
   - missing/unknown signed permission denies;
   - signed denial wins;
   - remote allow cannot manufacture a capability absent from the package;
6. prove that result independently before any Work/dispatch/offline integration.

No further work was started beyond this boundary.
