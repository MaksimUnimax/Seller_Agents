# Server / I1 / Health current cursor — 2026-09-17

Current: HEALTH_P8_4_B8_NONLIVE_READINESS_ACCEPTED / HEALTH_B7A_R1_CAPABILITY_PROVENANCE_ACCEPTED / HEALTH_B7B_ACCOUNT_SCOPE_LUNA_FENCE_TASK_ISSUED_AWAITING_REPORT / HEALTH_B7_LIVE_READONLY_PREFLIGHT_ACCEPTED / HEALTH_B7_LIVE_BEHAVIORAL_SMOKE_ISSUED_AWAITING_FINAL_REPORT / P8_4_NOT_ACCEPTED / P8_5_NOT_STARTED / I1_C2_2A_OPEN_BLOCKED.

Owner continuous autowork remains active, but there is a current explicit stop condition: after the final report for SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01 arrives, DO NOT issue another executor prompt. Independently review that report, update this cursor, then prepare the comprehensive handoff prompt for a new ChatGPT dialogue. One sequential Codex/test executor only. Do not duplicate B7B or the behavioral live task while execution/delivery state is unresolved.

## Canonical refs

- Repository: MaksimUnimax/runtime-fixtures, stable ID 1369117174.
- Architect-control branch: docs/architect-autowork-handoff-2026-09-15.
- Health branch: feature/server-health-h3-p8-4.
- Accepted B7A R1 remote head: d4bae8752c304cd49ef5c0f4ef2b5d44281d0f95.
- Accepted B7A R1 tree: 59729eb113061f00e6b093de8237a138e7d7603f.
- Accepted B7A R1 parent / rejected initial B7A candidate: 592b51da31ab5ecfd0e4d4b3e981897849731614.
- Compare 592b51d… → d4bae875… is ahead by 1, behind by 0, with exactly the eight B7A allowlisted paths.
- Local implementation provenance remains 256f7f7458921bb5b8ec6f9243467be8ebfadb7c followed by evidence-only correction 07106b7b1ba58e62d23239e0e730aed8cce7a25b. The GitHub publication uses one equivalent fast-forward commit with the exact same final tree; commit SHA differs only because commit metadata/history shape differs.
- Transport authority: deterministic eight-file archive, 16685 bytes, SHA-256 8b40df5aeb587f7aee6e2cb2d4e55f79213f6826060d1c46d64e1f5ce6cff92a; all eight Git blob SHA values independently matched before tree publication.
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
- executor/tester sends its terminal/preflight report directly into the control/report conversation through the available browser-control path;
- owner does not manually copy executor reports back to architect;
- architect writes the next executor prompt in the control chat and owner manually carries that prompt to the executor;
- this architect→owner→executor direction is the only intended manual relay.

Owner requirements:
- Health B7 must create zero ChatGPT conversations and zero Projects.
- Health B7 must delete/archive/rename/move zero conversations and zero Projects.
- Standard must use only the fixed Standard conversation above.
- Work must use only the fixed Work conversation above.
- Any navigation to a different conversation is fail-closed.
- Work live Health may execute only when the current model family is GPT-5.6 Luna.
- An effort suffix such as "Средний" is allowed.
- Health must never open the model picker or switch/fallback models.
- Unknown/existing foreign conversations/projects are never touched.
- No password, cookie export, raw session file or storageState is passed through ChatGPT messages, Git, evidence, terminal reports or the remote server.

Observed current Work UI on the owner-provided Work URL:
- URL is ordinary /c/<uuid>, not the older /g/g-p-.../c/<uuid> shape.
- positive Work marker observed as "Тест связи · Работа" / sidebar "Тест связи, Работа";
- visible model control observed as "GPT-5.6 Luna Средний";
- model family resolves to GPT-5.6 Luna.

Therefore old assumptions that Work necessarily requires /g/g-p-... or that the model button accessible name equals only "GPT-5.6 Luna" are not current authority and must not be hardcoded into accepted B7 live behavior.

## Corrected B7 live execution architecture

Live B7 must NOT depend on exporting Playwright storageState/cookies from the owner's browser or transferring session secrets to the remote server. Live B7 must NOT use remote Playwright/Chromium as the authenticated provider session.

Use the available local observation/control surfaces to collect real ChatGPT DOM/page state and run the bounded live acceptance. The architect currently has a working Opera Browser Connector for tabs/URL/accessibility/screenshot/navigation. Codex/ChatGPT Desktop provides its built-in browser and, where available/configured, Browser Use through the documented Chrome extension path plus optional controlled CDP/Computer Use. Tool availability must be proven per task, not assumed.

The built-in desktop browser uses a separate browser state and does not automatically reuse the ordinary browser login. Cloud Browser likewise has its own remote session. Neither should be silently substituted for the fixed authenticated account/session without deliberate setup.

B7 live remains a controlled acceptance run, not P8.5 scheduling. Repeatable unattended scheduling/orchestration remains P8.5 scope and must not be smuggled into B7.

## B7 read-only live preflight — ACCEPTED

Task: SA-HEALTH-B7-LIVE-READONLY-PREFLIGHT-20260917-01.

Tester delivered exactly one prepared report to the control/report conversation after the owner authorized that report delivery.

Accepted observed result:
- browser-control extension path available;
- DOM/accessibility available;
- full CDP was reported as capability advertised, NOT independently proven exercised;
- Standard requested/final exact fixed URL, exact conversation identity, authenticated rendered conversation and composer PASS;
- Standard prompt insertions 0, Sends 0;
- Work requested/final exact fixed URL, exact conversation identity, authenticated rendered conversation, positive Work marker and composer PASS;
- Work model control "GPT-5.6 Luna Средний", family GPT-5.6 Luna PASS;
- model-picker opens 0, model changes 0, prompt insertions 0, Sends 0;
- account safety mutations all zero;
- secrets captured/reported: NO;
- blockers: none;
- next live Send readiness: READY.

Verdict: SA-HEALTH-B7-LIVE-READONLY-PREFLIGHT-20260917-01 = ACCEPTED. This is read-only readiness only and is not B7 behavioral acceptance.

## Current B7 behavioral live task — ISSUED, FINAL REPORT NOT YET RECEIVED

Current task ID: SA-HEALTH-B7-LIVE-BEHAVIORAL-SMOKE-20260917-01.

Canonical Health prompt:
Health check. Reply with exactly one fenced code block containing the single token BRIDGE_HEALTHCHECK_V1. Do not call tools or access external data.

Packaged prompt ID: BRIDGE_COMMAND_SMOKE_V1.

Intended behavior order: IDENTIFY_SURFACE → IDENTIFY_COMPOSER → INSERT_PROMPT → SEND_ONCE → OBSERVE_BUSY → OBSERVE_RESPONSE → OBSERVE_COMPLETION → VALIDATE_BRIDGE_SURFACES → CLEANUP.

The task authorizes only the bounded Standard Health Send, bounded Work Health Send and one final report to the control/report conversation, with account-safety rules above. It must validate the new response only, exact token BRIDGE_HEALTHCHECK_V1, relevant fenced/code surface, native copy control and stable conversation identity. Work must revalidate positive Work identity and GPT-5.6 Luna before Send and must never open/change the model picker.

Observed execution problem so far: the tester reached Standard pre-Send and then asked the owner to confirm the Send; later reached Work pre-Send and again asked for confirmation. This exposed the missing project-wide tool/human-action policy and is why the mandatory policy above now exists. Do not infer B7 PASS or FAIL from these intermediate prompts. The final behavioral report has not yet arrived.

Do not submit a duplicate behavioral task while this execution/report state is unresolved.

After the final behavioral report arrives: independently review it and applicable GitHub/browser facts, issue a verdict, update cursor, and STOP executor progression. Per explicit owner instruction, no new executor prompt follows this report; instead prepare the comprehensive new-ChatGPT-dialogue handoff with full project state, rules, tool capabilities, test setup, relay protocol, roadmap and exact continuation point.

## B7B task status / acceptance caution

Task SA-HEALTH-B7B-ACCOUNT-SCOPE-LUNA-FENCE-20260917-01 was already issued before the live-browser architecture correction and may already be executing. Do not send a parallel correction task until its terminal report arrives or delivery is definitively known to have failed.

On review, reject/rework any B7B implementation that:
- makes live acceptance depend on Playwright storageState transfer;
- requires the Work URL to use /g/g-p-... when the current fixed Work chat is /c/<uuid> with a positive Work marker;
- requires accessible model name to equal only "GPT-5.6 Luna" and rejects the current model control solely because it includes an effort suffix;
- creates/deletes/archives/renames/moves chats/projects or switches models.

B7B may still be accepted in a narrower non-live hardening scope if its tests/code remain useful and do not incorrectly constrain the actual live path.

## Other open roadmap gates

- B7 behavioral acceptance remains open; therefore full P8.4 = NOT_ACCEPTED.
- P8.5 must not start before P8.4/B7 closure.
- C2.2-A remains OPEN/BLOCKED by PR9 gates and the reserved docs/README.md conflict; C2.2-B must not start.
- S1.2 requires a new explicit owner decision even though I1-sync is accepted.
- D3, deployment, release and general beta are not authorized next steps here.
- Do not touch README.md, AGENTS.md, docs/README.md, CHANGELOG.md, site/SEO/domain/public presentation or private workspace-control without explicit authorization.
