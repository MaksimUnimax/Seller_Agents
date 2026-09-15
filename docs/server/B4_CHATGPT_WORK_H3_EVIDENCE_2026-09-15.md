# B4 — ChatGPT Work H3 authority-boundary evidence

Date: 2026-09-15  
Roadmap: P8.4 / B4_CHATGPT_WORK_H3  
Branch: `feature/server-health-h3-p8-4`  
Outcome: `IMPLEMENTED CANDIDATE — LOCAL PASS; REMOTE EXACT-HEAD ACCEPTANCE PENDING`

## Execution boundary

The accepted B3 head remains `c3662cac0b88f46a5b01f5fbc488578e82983046` as the
Stream B base; the current Stream B head is the docs-only blocker candidate
recorded below. B4 implementation was not started because the
repository does not contain sufficient authoritative, production-specific
ChatGPT Work surface knowledge to construct the required strategy safely.

No production code, extension file, contract, migration, provider call,
customer account, live ChatGPT session, or later roadmap step was changed or
started by this bounded investigation.

## Required identity

The already-packaged identity is retained as an unimplemented contract
identity:

```text
surface = CHATGPT_WORK
profile = CHATGPT_WORK_H3_V1
profileRevision = 1
target key = chatgpt_work_health
```

This document does not claim that those identifiers constitute Work DOM
authority.

## Authority audit

The following current repository sources were read and checked:

| Source | Established authority | Missing authority |
| --- | --- | --- |
| `docs/server/ADR/0033-p7-bootstrap-ai-resolution-and-signed-profile-binding.md` | P7 maps a simulated `CHATGPT_WORK` fixture to `work_composer_v3`. | The ADR explicitly states that this is simulated fixture knowledge and does not claim live ChatGPT DOM knowledge. |
| `packages/server/simulated-extension-client/src/detector.ts` | Exact HTTPS origin fixture mapping for Standard and Work. | The `fixture` value is caller/test supplied; it is not authenticated Work shell or workspace identity. |
| `docs/server/P7_6_P7_FINAL_ACCEPTANCE_2026-09-12.md` | Standard/Work resolution and cross-surface binding are distinct in the simulated contract. | No production route, workspace marker, DOM contour, or authenticated Work target is established. |
| `apps/extension/src/imported/ozon-v0.1.22/content_script.js` | `chatgptWorkSubmitButton()` recognizes the shipped exact `button#composer-submit-button[data-testid="send-button"]` contour; Work send-disabled/active states are handled. | This is a send-control specialization, not a Work workspace/surface identity. The accepted Standard authority also permits the same exact send control, so it cannot isolate Work from Standard. |
| `apps/extension/src/imported/ozon-v0.1.22/shared/ai_adapters.js` | Shared ChatGPT host, composer, assistant, code, Copy, busy, and send semantics. | No Work workspace/shell/route identity is present. |
| `apps/extension/src/imported/ozon-v0.1.22/shared/conversation_identity.js` | ChatGPT identity is same-origin and based on `/c/<UUID>` path/canonical agreement. | No workspace identity or Work-specific lifecycle is present. |
| `apps/extension/src/imported/ozon-v0.1.22/shared/work_session_model.js` | Local Ozon work-session state is keyed by conversation and has explicit lifecycle transitions. | This is product workflow state, not ChatGPT Work workspace DOM authority. Health must not depend on extension runtime state. |
| `docs/server/B3_CHATGPT_STANDARD_H3_EVIDENCE_2026-09-14.md` and accepted B3 source | Complete Standard contour authority and deterministic fixture semantics. | No Work-specific production contour beyond the send-control specialization above. |

The active extension Stream A branches and `origin/main` were also searched.
They contain the same imported Work send-control code and simulated P7
identity, but no accepted authenticated Work DOM/route/workspace authority.

## Why implementation cannot safely proceed

The required B4 isolation proofs cannot be made from the available authority:

1. Standard and Work cannot be distinguished by the imported Work send selector,
   because the accepted Standard profile also recognizes that selector.
2. The P7 `https://chatgpt.com/work` value occurs only in simulated fixture
   tests and is expressly not a live target authority.
3. The shared ChatGPT identity authority proves only origin and conversation
   identity; it does not prove workspace ownership or Work surface identity.
4. Adding a `data-work`, workspace route, workspace ID, shell marker, or other
   Work-only selector would invent production authority, which B4 forbids.
5. Reusing Standard for Work would violate the one-engine/two-strategy
   isolation requirement and would permit Standard to satisfy Work.

Consequently no Work strategy, Work target, Work fixture, or Work negative
matrix was synthesized. A fixture-only PASS would be invalid evidence.

## Exact external prerequisite

`EXTERNAL_REQUIRED_PREREQUISITE =`

`An owner-approved, read-only capture or repository-authoritative implementation
of an authenticated ChatGPT Work surface from a dedicated controlled health
account, establishing the real Work-specific surface/workspace identity,
credential-free start target and allowed origin(s), active composer ownership,
send/Stop/busy semantics, assistant-response ownership, completion signals,
conversation/workspace identity lifecycle, code/Copy ownership, and delivery
insertion contour. The capture must be usable to derive a deterministic
packaged profile without login/CAPTCHA bypass, customer access, provider calls,
or extension-runtime dependency.`

An unauthenticated public page or the existing simulated `CHATGPT_WORK`
fixture is not sufficient. Once this prerequisite exists, B4 can resume behind
the existing B2 engine with a distinct Work strategy and a dedicated
production-semantics fixture.

## Validation boundary

The required health-runner focused command could not run in this environment:

```text
pnpm --filter @product/health-runner test
=> /bin/bash: pnpm: command not found
```

The pre-existing local toolchain is also not suitable for the required server
gates (`node --version` reports `v12.22.9`, while the repository authority
requires Node 24). No validation result is represented as B4 PASS.

The B3 source and current test files remain unchanged, and no B4 test or
production behavior is claimed.

## Non-goals preserved

```text
COMMON_B2_ENGINE_REUSED = NOT APPLICABLE (no B4 implementation)
STANDARD_STRATEGY_PRESERVED = YES
WORK_STRATEGY_IMPLEMENTED = NO
WORK_FIXTURE_CREATED = NO
LIVE_H3_ACCEPTANCE = NOT STARTED
B5 = NOT STARTED
B6 = NOT STARTED
B7 = NOT STARTED
P8.5 = NOT STARTED
PROVIDER_CALLS = 0
CUSTOMER_SESSIONS = 0
EXTENSION_RUNTIME_DEPENDENCY = 0
DB_MIGRATION = 0
CONTRACT_CHANGE = 0
```

The next action is to return control to the Stream B architect with the exact
external prerequisite above.

## Blocker resolution and owner-approved capture authority — 2026-09-15

The previous `EXTERNAL_BLOCKER` remains historical evidence: B4 was correctly
blocked because repository authority contained no real authenticated Work
surface identity. The owner has now supplied an approved authenticated,
sanitized Opera Browser Connector capture. It resolves the structural B4
prerequisite only; it is not controlled Health-account reachability or B7 live
acceptance.

The accepted capture establishes:

- origin `https://chatgpt.com`;
- supporting route shape
  `https://chatgpt.com/g/g-p-<PROJECT_ID>/c/<CONVERSATION_UUID>`;
- route shape is not Work proof and real route components are never persisted;
- the positive authenticated header/top-bar marker is the exact Russian
  localized string `Работа`;
- `CHATGPT_WORK_H3_V1`, revision `1`, is explicitly bound to locale `ru-RU`;
- State A is an idle empty textbox named `Чат с ChatGPT`, with placeholder
  `Работайте над чем угодно` and no Send activation;
- State B is text-present with accessible Send `Отправить промпт`, including
  while another generation signal is active;
- State C is empty-composer generation with `Отслеживание`, `Выполняется`,
  and Stop `Остановить ответ`;
- Stop is observation-only and never a Send or Send-counter event.

The Work strategy positively gates controlled target policy, approved origin,
bounded project/conversation route shape, and one unambiguous visible
header-owned `Работа` marker. A marker in ordinary message/composer content,
an ambiguous marker, route-only context, or a shared Send control cannot prove
Work. Route/project and conversation ownership are held ephemerally and drift
fails closed.

The strategy reuses the accepted B2 engine in the fixed nine-step order and
reuses mature common ChatGPT response mechanics only after Work gating:
assistant message identity, attached/non-empty response, busy/completion
signals, code surface, native Copy ownership, conversation identity, and
delivery insertion ownership. The mature
`chatgptWorkSubmitButton()` contour is supporting Send authority only; it is
not surface identity. There is one physical Send maximum, no Enter fallback,
retry, or navigation repair. Completion remains fail closed. Dynamic strings
such as `Выполнено за <duration>` and `Обработка заняла <duration>` remain
supporting observations, not mandatory selectors.

Standard received only the narrow B4 isolation correction: a positively
identified header-owned Work marker causes Standard surface identification to
fail before Send. Standard mechanics otherwise remain unchanged. Deterministic
proof covers Standard+Standard PASS, Work+Work PASS, Standard+Work fail before
Send, Work+Standard fail before Send, shared Send without Work marker, route
without Work marker, and message-content-only marker.

Implementation and deterministic acceptance are present in:

- `apps/health-runner/src/work-h3-profile.ts` and
  `apps/health-runner/src/work-h3-strategy.ts`;
- `apps/health-runner/src/browser-driver.ts`, `target-registry.ts`, and the
  public registry exports;
- `tests/e2e/server/support/health-work-h3-fixture.ts` and
  `tests/e2e/server/health-work-h3.spec.ts`;
- `apps/health-runner/src/work-h3-profile.test.ts` and target/source guards.

The fixture uses only fake test project/conversation identifiers and test
bookkeeping. Production Work code never queries fixture bookkeeping. Evidence
and execution results contain bounded metadata only: no real project ID,
conversation UUID, project/account identity, raw authenticated DOM, node IDs,
cookies, tokens, storage, prompt, response, conversation, screenshot, or
clipboard content is persisted or exposed.

Focused local gates recorded for this candidate are Work Chromium 34/34 PASS,
normal/precedence/Stop Work cases 9/9 PASS across three repetitions, Standard
B3 Chromium 36/36 PASS, and health-runner unit coverage 73/73 PASS. H2, B1,
and B2 remain covered by the existing regression suite. Exact candidate SHA
and terminal Server CI run/head are recorded in the final terminal report;
this document makes no B7 live-acceptance claim.
