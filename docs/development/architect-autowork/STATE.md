# Server / I1 / Health current cursor — 2026-09-17

Current: HEALTH_P8_4_B8_NONLIVE_READINESS_ACCEPTED / HEALTH_B7A_R1_CAPABILITY_PROVENANCE_ACCEPTED / HEALTH_B7B_ACCOUNT_SCOPE_LUNA_FENCE_TASK_ISSUED_AWAITING_REPORT / HEALTH_B7_LIVE_READONLY_PREFLIGHT_ACCEPTED / HEALTH_B7_LIVE_BEHAVIORAL_STANDARD_LEG_OBSERVED_PASS_WORK_LEG_UNSENT_NO_FINAL_REPORT / P8_4_NOT_ACCEPTED / P8_5_NOT_STARTED / I1_C2_2A_OPEN_BLOCKED.

Owner continuous autowork remains active, but there is a current explicit stop condition: after the final report for SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01 arrives, DO NOT issue another executor prompt. Independently review that report, update this cursor, then prepare the comprehensive handoff prompt for a new ChatGPT dialogue. One sequential Codex/test executor only. Do not duplicate B7B or the behavioral live task while execution/delivery state is unresolved.

## Canonical refs

- Repository: MaksimUnimax/runtime-fixtures, stable ID 1369117174.
- Architect-control branch: docs/architect-autowork-handoff-2026-09-15.
- Architect-control head before this STATE update: f523928011979a8c8df518f4a14cc45516b20f53, tree 611e9cbcf59c10fd30184ab0168152686fea8003.
- Health branch: feature/server-health-h3-p8-4.
- Health branch independently rechecked 2026-09-17 after the stalled behavioral run: still d4bae8752c304cd49ef5c0f4ef2b5d44281d0f95, tree 59729eb113061f00e6b093de8237a138e7d7603f. No B7B or later Health publication is present on this branch at that check.
- Accepted B7A R1 parent / rejected initial B7A candidate: 592b51da31ab5ecfd0e4d4b3e981897849731614.
- Local implementation provenance remains 256f7f7458921bb5b8ec6f9243467be8ebfadb7c followed by evidence-only correction 07106b7b1ba58e62d23239e0e730aed8cce7a25b. The GitHub publication uses one equivalent fast-forward commit with the exact same final tree.
- B7A transport authority: deterministic eight-file archive, 16685 bytes, SHA-256 8b40df5aeb587f7aee6e2cb2d4e55f79213f6826060d1c46d64e1f5ce6cff92a.
- Main last independently known: bc718cc5c677ad0eb4598e7de3ad766473ff0847.
- I1 integration last independently known: 076af64efbcdfdc67aec8713969c31c276a90b2d; PR9/C2.2-A remain open/blocked at existing gates and reserved docs/README.md conflict.
- S1.1 is merged/accepted; S1.2 still requires a new explicit owner decision and is not started.

## Mandatory tool capability / human-action policy — 2026-09-17

Canonical policy: docs/development/architect-autowork/TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md.

It is mandatory for every current/future roadmap step involving tests, browser/GUI interaction, installed-extension acceptance, Health/H3, package creation or owner handoff.

Core rule: everything that can be tested or inspected without the owner's physical participation MUST be tested before asking the owner to do anything and before handing over an extension build/ZIP. Executor/architect must explicitly exhaust applicable available tools before claiming a human-only blocker.

Every future Codex/tester prompt involving browser, GUI, installed extension, package, Health/H3, provider/live acceptance or owner handoff MUST contain an explicit AVAILABLE TOOLS / NO UNNECESSARY HUMAN ACTION section. It must name actual tools/capabilities/boundaries, require the automation ladder, prohibit delegating automatable steps to the owner, and require exact evidence for any claimed human-only residue.

Current baseline tool inventory is recorded in the canonical policy and includes: Opera Browser Connector observation/navigation; Codex Browser Use through the officially supported browser-extension path where available; Codex/ChatGPT built-in browser; Developer Mode/full CDP; Site Tools/WebMCP when actually exposed; Computer Use when available; Codex local development/terminal; GitHub connector; web research; Business Bridge as development transport only.

Important correction to earlier cursor wording: current official OpenAI documentation verified on 2026-09-17 explicitly documents Browser Use through the in-app browser or Chrome using the ChatGPT Chrome extension. Do NOT claim official Opera extension support without concrete evidence. The separate Opera Browser Connector available to the architect is verified and can list/navigate tabs, read accessibility trees, jq-query them, take screenshots, read recent history and close tabs, but its current exposed API does not provide generic click/type/Send. If an installed browser extension is used through Opera, prove that exact capability with bounded preflight instead of assuming it.

Mandatory pre-handoff gate: no extension build/ZIP reaches the owner while any applicable non-human test remains unrun or failing. This includes unit, contracts, integration/DB/migrations where applicable, browser/E2E, runtime/native fixtures, live read-only DOM/accessibility checks, types, lint, format, build/package parity, security/fail-closed, Health/H3, regression, exact-head CI and automatable installed/browser checks.

Mandatory dialogue-binding gate before extension handoff: automate exact dialogue recognition, binding, persistence, reload/worker restoration, correct marketplace/store context, no neighboring-dialogue binding, unbind/rebind, wrong-dialogue fail-closed and applicable parallel-dialogue isolation. A build that cannot bind to the test dialogue must be caught before owner handoff.

## B7A R1 acceptance

Task SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01 is ACCEPTED.

The strict loader is the sole producer of dedicated-session authority: loader-created opaque registry, module-private registry WeakMap, module-private driver binding WeakMap, no public direct binding/path/startUrl authority, ChromeBrowserDriver constructor restored to targets + optional launch timeout, and dedicated factory restricted to trusted registry + target key. Forged registry/direct structural objects and third constructor arguments have zero authority. Fresh EPHEMERAL_CONTROLLED contexts, no persistent user data, no state writeback, and exact Work route validation remain intact for the existing Playwright implementation.

Exact-head Server CI authority:
- run 35125879122
- job 104894664468
- head d4bae8752c304cd49ef5c0f4ef2b5d44281d0f95
- tree 59729eb113061f00e6b093de8237a138e7d7603f
- conclusion SUCCESS
- local/remote gates included Health, dedicated Chromium, lint, format, typecheck, PostgreSQL integration, db:migrate, OpenAPI, bridge guard, build and canonical E2E.

Verdict:
- SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01 = ACCEPTED.
- B7A_DEDICATED_SESSION_PROVISIONING = ACCEPTED as non-live internal provisioning code/evidence.
- P8.4 = NOT_ACCEPTED.
- P8.5 = NOT_STARTED.

## Owner B7 account-safety constraints — 2026-09-17

Owner explicitly designated the CURRENT ChatGPT account being used in this work as the Health test account. There is no second Health test account to create or obtain, and no separate-account prerequisite.

Fixed test conversations in this same account:
- Standard: https://chatgpt.com/c/6aab3f3b-0110-83ea-8d4c-8b57715c85ee
- Work: https://chatgpt.com/c/6aab3f30-ebd0-83e9-a41e-26e6eb78b5e2

Control/report conversation, NOT a Work test fixture:
- https://chatgpt.com/g/g-p-6aa3ac15c90081918863dfcf30ada0e8-analitika-bridzhei/c/6aaa7a78-e394-83ea-b95a-630825510dca

Relay protocol:
- executor/tester sends its report directly into the control/report conversation through the available browser-control path;
- owner does not manually copy executor reports back to architect;
- architect writes the next executor prompt in the control chat and owner manually carries that prompt to the executor;
- this architect→owner→executor direction is the only intended manual relay.

Owner requirements:
- Health B7 creates zero ChatGPT conversations and zero Projects;
- deletes/archives/renames/moves zero conversations and Projects;
- Standard uses only the fixed Standard conversation;
- Work uses only the fixed Work conversation;
- navigation to a different conversation is fail-closed;
- Work live Health executes only when current model family is GPT-5.6 Luna;
- effort suffix such as "Средний" is allowed;
- Health never opens the model picker or switches/fallback models;
- unrelated conversations are never touched;
- no password, cookie export, raw session file or storageState enters messages/Git/evidence/terminal reports/server.

## B7 read-only live preflight — ACCEPTED

Task: SA-HEALTH-B7-LIVE-READONLY-PREFLIGHT-20260917-01.

Accepted result:
- Standard exact fixed URL/conversation/authenticated page/composer PASS;
- Work exact fixed URL/conversation/authenticated page/positive Work marker/model family GPT-5.6 Luna/composer PASS;
- Work model control observed as GPT-5.6 Luna Средний;
- zero prompt insertions/Sends during preflight;
- zero model-picker opens/model changes/account mutations;
- secrets NO, blockers none;
- full CDP was only reported as capability advertised, not proven exercised.

Verdict: ACCEPTED read-only readiness only; not behavioral B7 acceptance.

## Current B7 behavioral live task — PARTIAL OBSERVED STATE, FINAL REPORT ABSENT

Task: SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01.

Canonical Health prompt:
Health check. Reply with exactly one fenced code block containing the single token BRIDGE_HEALTHCHECK_V1. Do not call tools or access external data.

Packaged prompt ID: BRIDGE_COMMAND_SMOKE_V1.

Intended order: IDENTIFY_SURFACE → IDENTIFY_COMPOSER → INSERT_PROMPT → SEND_ONCE → OBSERVE_BUSY → OBSERVE_RESPONSE → OBSERVE_COMPLETION → VALIDATE_BRIDGE_SURFACES → CLEANUP.

### Standard live leg — independently observed after tester stalled

The tester had asked the owner to confirm Standard Send. Subsequent independent read-only inspection by the architect through Opera Browser Connector on the exact fixed Standard URL shows that the Standard Send in fact occurred at 07:16 local UI time.

Observed current Standard evidence:
- final URL exact https://chatgpt.com/c/6aab3f3b-0110-83ea-8d4c-8b57715c85ee;
- one visible canonical Health user turn after the old "Тест" fixture turn;
- one following assistant response;
- the new assistant response contains a single visible code surface with exact token BRIDGE_HEALTHCHECK_V1;
- native code-surface "Копировать" control is present;
- ordinary assistant-response copy control is also present;
- composer is currently empty/ready;
- screenshot independently confirms the canonical prompt and exact token response.

Architect may treat these CURRENT-DOM facts as evidence that the Standard live leg reached the required output shape. The Opera Connector observation does not retroactively prove every transient event (for example OBSERVE_BUSY) and does not by itself prove which interactive tool performed the Send. Do not fabricate those missing transient details.

### Work live leg — independently observed UNSENT

Independent read-only inspection of the exact fixed Work URL shows:
- final URL exact https://chatgpt.com/c/6aab3f30-ebd0-83e9-a41e-26e6eb78b5e2;
- positive header marker "Тест связи · Работа";
- model control exact accessible name "GPT-5.6 Luna Средний", family GPT-5.6 Luna;
- composer is empty with current Work placeholder;
- no canonical Health user turn is present after the old "Тест" fixture turn;
- no Health assistant response exists;
- screenshot independently confirms this pre-Send state.

Therefore Work behavioral Send/response validation is NOT RUN. B7 behavioral acceptance is incomplete. Do not claim B7 PASS.

### Control/report delivery

The architect opened and read the exact control/report conversation through Opera Browser Connector after the partial run. No final report for SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01 is present. The visible conversation contains the current architect work instead. Therefore terminal report delivery is still absent.

Current behavioral verdict: PARTIAL / NOT_ACCEPTED. Standard output shape is independently observed; Work Send/response and final report remain missing.

Do not submit a duplicate behavioral task while the current execution/report state remains unresolved.

After a final behavioral report arrives: independently review it and applicable GitHub/browser facts, issue verdict, update cursor, and STOP executor progression. Per explicit owner instruction, no new executor prompt follows that report; instead prepare the comprehensive new-ChatGPT-dialogue handoff with full project state, rules, tool capabilities, test setup, relay protocol, roadmap and exact continuation point.

## B7B task status / acceptance caution

Task SA-HEALTH-B7B-ACCOUNT-SCOPE-LUNA-FENCE-20260917-01 was already issued before the live-browser architecture correction. No publication beyond d4bae875... is present on feature/server-health-h3-p8-4 at the latest independent check, so no B7B implementation can currently be accepted from that branch.

On any future report/review, reject/rework implementation that:
- makes live acceptance depend on Playwright storageState transfer;
- requires Work URL /g/g-p-... when the fixed current Work chat is /c/<uuid> with positive Work marker;
- rejects GPT-5.6 Luna solely because accessible name includes effort suffix;
- creates/deletes/archives/renames/moves chats/projects or switches models.

## Other open roadmap gates

- B7 behavioral acceptance remains open; therefore full P8.4 = NOT_ACCEPTED.
- P8.5 must not start before P8.4/B7 closure.
- C2.2-A remains OPEN/BLOCKED by PR9 gates and reserved docs/README.md conflict; C2.2-B must not start.
- S1.2 requires a new explicit owner decision even though I1-sync is accepted.
- D3, deployment, release and general beta are not authorized next steps here.
- Do not touch README.md, AGENTS.md, docs/README.md, CHANGELOG.md, site/SEO/domain/public presentation or private workspace-control without explicit authorization.
