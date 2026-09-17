# Server / I1 / Health current cursor — 2026-09-17

Current: HEALTH_P8_4_B8_NONLIVE_READINESS_ACCEPTED / HEALTH_B7A_R1_CAPABILITY_PROVENANCE_ACCEPTED / HEALTH_B7B_ACCOUNT_SCOPE_LUNA_FENCE_TASK_ISSUED_AWAITING_REPORT / HEALTH_B7_LIVE_REDESIGNED_LOCAL_OPENAI_BROWSER_CONTROL / P8_4_NOT_ACCEPTED / P8_5_NOT_STARTED / I1_C2_2A_OPEN_BLOCKED.

Owner continuous autowork remains active. One sequential Codex executor only. The B7B implementation task was already issued before the live-browser architecture correction below; do not submit a duplicate while its execution/delivery state is unresolved. Review its eventual terminal report against the corrected architecture before acceptance.

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

The strict loader is the sole producer of dedicated-session authority: loader-created opaque registry, module-private registry WeakMap, module-private driver binding WeakMap, no public direct binding/path/startUrl authority, ChromeBrowserDriver constructor restored to targets + optional launch timeout, and dedicated factory restricted to trusted registry + target key. Forged registry/direct structural objects and third constructor arguments have zero authority. Fresh EPHEMERAL_CONTROLLED contexts, no persistent user data, no state writeback, and exact Work route validation remain intact for the existing Playwright implementation.

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
- B7A_DEDICATED_SESSION_PROVISIONING = ACCEPTED as non-live internal provisioning code/evidence.
- B7_CONTROLLED_LIVE_H3 = NOT RUN.
- P8.4 = NOT_ACCEPTED.
- P8.5 = NOT_STARTED.

## Owner B7 account-safety constraints — 2026-09-17

Owner explicitly designated the CURRENT ChatGPT account being prepared in this work as the dedicated Health test account. There is no second Health test account to create or obtain, and no separate-account prerequisite. This current account is the controlled test account for B7.

Owner-provided fixed test conversations in this same account:
- Standard: https://chatgpt.com/c/6aab3f3b-0110-83ea-8d4c-8b57715c85ee
- Work: https://chatgpt.com/c/6aab3f30-ebd0-83e9-a41e-26e6eb78b5e2

Do not create replacement chats/projects merely to satisfy an old route assumption.

Owner requirements:
- Health B7 must create zero ChatGPT conversations and zero Projects.
- Health B7 must delete/archive/rename/move zero conversations and zero Projects.
- Standard must use only the owner-precreated Standard conversation above.
- Work must use only the owner-precreated Work conversation above.
- Any navigation to a different conversation is fail-closed.
- Work live Health may execute only when the current model is GPT-5.6 Luna.
- Health must never open the model picker or switch/fallback models.
- Unknown/existing foreign conversations/projects are never touched.

Observed current Work UI on the owner-provided Work URL:
- URL is currently ordinary /c/<uuid>, not the older /g/g-p-.../c/<uuid> shape.
- The page exposes the positive Work marker "Работа".
- The visible model control exposes GPT-5.6 Luna with an effort suffix in its accessible name (observed as "GPT-5.6 Luna Средний").
Therefore old assumptions that Work necessarily requires /g/g-p-... or that the model button accessible name equals only "GPT-5.6 Luna" are not current authority and must not be hardcoded into accepted B7 live behavior.

## Corrected B7 live execution architecture — OpenAI desktop/browser control, not Playwright session export

The owner explicitly rejected transporting browser session state/cookies to the server and directed use of the OpenAI application path.

Architect conclusion after checking current OpenAI product documentation:
- Live B7 must NOT depend on exporting Playwright storageState/cookies from the owner's browser or transferring session secrets to the remote server.
- Live B7 must NOT use the remote Playwright/Chromium browser as the authenticated provider session.
- Preferred live execution surface is the local ChatGPT Desktop app in Codex/Browser Use, controlling the owner's already-signed-in Opera through the OpenAI/ChatGPT browser extension.
- Current OpenAI documentation states that Browser Use can use an existing local browser profile/signed-in session through the browser extension, and current release notes explicitly support Opera for tab mentions and browser control (Opera lacks side chat, which is irrelevant to B7).
- This keeps authentication local on the owner machine. No password, cookie export, raw session file or storageState is passed through ChatGPT messages, Git, evidence, Codex terminal reports or the remote server.
- For stronger machine-readable inspection, ChatGPT Desktop/Codex Developer mode may use controlled full CDP access where available/approved. This can inspect page state/DOM/console/network without inventing selectors from screenshots alone.
- The built-in desktop browser is a fallback only if we intentionally sign into its separate browser state. It does not reuse the existing Opera session and therefore is not the preferred path for this owner flow.
- Cloud Browser is not the preferred path because it has a separate remote session and does not reuse the owner's local signed-in browser state.

B7 live remains a controlled acceptance run, not P8.5 scheduling. Repeatable unattended scheduling/orchestration remains P8.5 scope and must not be smuggled into B7.

For B7 acceptance the local OpenAI browser-control run must be bounded to the two exact conversation URLs above and prove, with machine-readable/sanitized evidence where the product surface permits:
- correct account/session already active locally;
- exact allowed conversation identity before and after each action;
- Work marker present on the Work conversation;
- Work current model semantically identifies GPT-5.6 Luna; an effort suffix such as "Средний" is allowed, but a different model family/name is not;
- exactly one packaged Health prompt insertion and exactly one Send per allowed surface;
- generation starts, a new assistant response appears and completes;
- required command/code surface and native copy control are present;
- no navigation to another conversation;
- zero new-chat/project creation, deletion, archive, rename, move or model-switch action;
- secrets/cookies/session values are not captured in evidence.

Do not claim B7 PASS until this local OpenAI-app path is actually exercised. The existing B7A Playwright provisioning tests remain valid non-live defense/regression evidence but are not the authenticated live transport anymore.

## B7B task status / acceptance caution

Task SA-HEALTH-B7B-ACCOUNT-SCOPE-LUNA-FENCE-20260917-01 was already issued before the architecture correction and may already be executing. Do not send a parallel correction task until its terminal report arrives or delivery is definitively known to have failed.

On review, reject/rework any B7B implementation that:
- makes live acceptance depend on Playwright storageState transfer;
- requires the Work URL to use /g/g-p-... when the owner-provided current Work chat is /c/<uuid> with a positive Work marker;
- requires accessible model name to equal only "GPT-5.6 Luna" and rejects the current model control solely because it includes an effort suffix;
- creates/deletes/archives/renames/moves chats/projects or switches models.

B7B may still be accepted in a narrower non-live hardening scope if its tests/code remain useful and do not incorrectly constrain the actual live OpenAI-app path.

## Remaining Health blocker

B7 live behavioral acceptance has not been run. The owner has already supplied the two exact allowed conversation URLs and designated the current account as the Health test account. The remaining operational prerequisite is local ChatGPT Desktop/Codex Browser Use configured to control the already-signed-in Opera via the OpenAI browser extension, with any required one-time website/browser/CDP approvals. No second account and no server-side session transfer are required.

## Other open roadmap gates

- C2.2-A remains OPEN/BLOCKED by PR9 gates and the reserved docs/README.md conflict; C2.2-B must not start.
- S1.2 requires a new explicit owner decision even though I1-sync is accepted.
- P8.5 must not start before P8.4/B7 closure.
- D3, deployment, release and general beta are not authorized next steps here.
- Do not touch README.md, AGENTS.md, docs/README.md, CHANGELOG.md, site/SEO/domain/public presentation or private workspace-control.
