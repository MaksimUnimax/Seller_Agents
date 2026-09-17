# Server / I1 / Health current cursor — 2026-09-17

Current: HEALTH_P8_4_B8_NONLIVE_READINESS_ACCEPTED / HEALTH_B7A_R1_CAPABILITY_PROVENANCE_ACCEPTED / HEALTH_B7B_ACCOUNT_SCOPE_LUNA_FENCE_NEXT / HEALTH_B7_LIVE_BLOCKED_EXTERNAL_PREREQUISITE / P8_4_NOT_ACCEPTED / P8_5_NOT_STARTED / I1_C2_2A_OPEN_BLOCKED.

Owner continuous autowork remains active. One sequential Codex executor only.

## Canonical refs

- Repository: MaksimUnimax/runtime-fixtures, stable ID 1369117174.
- Health branch: feature/server-health-h3-p8-4.
- Accepted B7A R1 remote head: d4bae8752c304cd49ef5c0f4ef2b5d44281d0f95.
- Accepted B7A R1 tree: 59729eb113061f00e6b093de8237a138e7d7603f.
- Accepted B7A R1 parent / rejected initial B7A candidate: 592b51da31ab5ecfd0e4d4b3e981897849731614.
- Compare 592b51d… → d4bae875… is ahead by 1, behind by 0, with exactly the eight B7A allowlisted paths.
- Local implementation provenance remains 256f7f7458921bb5b8ec6f9243467be8ebfadb7c followed by evidence-only correction 07106b7b1ba58e62d23239e0e730aed8cce7a25b. The GitHub publication uses one equivalent fast-forward commit with the exact same final tree; commit SHA differs only because commit metadata/history shape differs.
- Transport authority: deterministic eight-file archive, 16685 bytes, SHA-256 8b40df5aeb587f7aee6e2cb2d4e55f79213f6826060d1c46d64e1f5ce6cff92a; all eight Git blob SHA values independently matched before tree publication.
- Main remains bc718cc5c677ad0eb4598e7de3ad766473ff0847 at latest independent check.
- I1 integration remains 076af64efbcdfdc67aec8713969c31c276a90b2d; PR9/C2.2-A remain open/blocked at existing gates and reserved docs/README.md conflict.
- S1.1 is merged/accepted; S1.2 still requires a new explicit owner decision and is not started.

## B7A R1 acceptance

Task SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01 is ACCEPTED.

The strict loader is the sole producer of dedicated-session authority: loader-created opaque registry, module-private registry WeakMap, module-private driver binding WeakMap, no public direct binding/path/startUrl authority, ChromeBrowserDriver constructor restored to targets + optional launch timeout, and dedicated factory restricted to trusted registry + target key. Forged registry/direct structural objects and third constructor arguments have zero authority. Fresh EPHEMERAL_CONTROLLED contexts, no persistent user data, no state writeback, and exact Work route validation remain intact.

Local evidence before publication: required Health subset 109 PASS, full Health 119 PASS, dedicated Chromium 7 PASS, lint/format/typecheck/build/OpenAPI/bridge/docs PASS. Exact-head remote Server CI then closed the DB-dependent gates that were unavailable locally.

Exact-head Server CI authority:
- run 35125879122
- job 104894664468
- head d4bae8752c304cd49ef5c0f4ef2b5d44281d0f95
- tree 59729eb113061f00e6b093de8237a138e7d7603f
- conclusion SUCCESS
- lint, format, typecheck, playwright-config regression, unit, PostgreSQL integration, db:migrate, OpenAPI, bridge guard, build, Chromium install, canonical pnpm test:e2e, cleanup: SUCCESS.

Verdict:
- SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01 = ACCEPTED.
- B7A_DEDICATED_SESSION_PROVISIONING = ACCEPTED.
- B7_CONTROLLED_LIVE_H3 = BLOCKED_EXTERNAL_PREREQUISITE.
- P8.4 = NOT_ACCEPTED.
- P8.5 = NOT_STARTED.

## Owner B7 account-safety constraints — 2026-09-17

Before live B7, implement one bounded internal hardening step: SA-HEALTH-B7B-ACCOUNT-SCOPE-LUNA-FENCE-20260917-01.

Owner requirements are stricter than the earlier provisioning boundary:
- Health B7 must create zero ChatGPT conversations and zero Projects.
- Health B7 must delete/archive/rename/move zero conversations and zero Projects.
- Standard must use one owner-precreated dedicated test conversation; root/new-chat execution is forbidden for live B7.
- Work must use one owner-precreated dedicated Project + conversation route; route drift to another project/conversation is fail-closed.
- Dedicated browser navigation must remain locked to the configured conversation identity, not merely to the allowed origin.
- Work live Health may execute only when the currently displayed model is positively identified as GPT-5.6 Luna.
- Health must never open the model picker or switch/fallback models. Missing, ambiguous or different model identity blocks before prompt insertion/Send.
- Unknown/existing foreign conversations/projects are never touched. The B7 implementation does not gain any create/delete/archive/rename/move capability.

Architect decision: implement the stronger zero-mutation account policy rather than a bounded temporary-chat lifecycle. Standard receives a pre-bound conversation start route for live dedicated execution. Work retains its pre-bound project/conversation route. The browser-driver adds a dedicated conversation route lock for all top-level navigation. Work H3 adds a read-only exact Luna identity gate with no model-selection action. Synthetic tests must prove no Send on wrong/missing/ambiguous model and no cross-conversation navigation authority.

## Remaining Health blocker

B7 live behavioral acceptance has not been run. After B7B code hardening is accepted, the external prerequisite remains owner-provisioned dedicated Health authentication state/config for both Standard and Work plus the exact precreated Standard conversation URL and approved dedicated Work project/conversation route. The Work conversation must already have GPT-5.6 Luna selected. It must use a dedicated controlled Health account/profile, not owner/customer production sessions. No live auth/provider behavior may be invented or claimed without that prerequisite.

## Other open roadmap gates

- C2.2-A remains OPEN/BLOCKED by PR9 gates and the reserved docs/README.md conflict; C2.2-B must not start.
- S1.2 requires a new explicit owner decision even though I1-sync is accepted.
- P8.5 must not start before P8.4/B7 closure.
- D3, deployment, release and general beta are not authorized next steps here.
- Do not touch README.md, AGENTS.md, docs/README.md, CHANGELOG.md, site/SEO/domain/public presentation or private workspace-control.
