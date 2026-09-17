# TOOL CAPABILITY / HUMAN-ACTION POLICY

Status: MANDATORY project-wide testing/execution policy for Seller Agents / Octoport.
Effective: 2026-09-17.
Scope: every current and future roadmap step that involves testing, browser/GUI interaction, installed-extension acceptance, GitHub inspection, local development validation, Health/H3, packaging or owner handoff.

This document exists because a previous B7 attempt incorrectly pushed automatable browser work onto the owner and allowed a candidate flow to reach the owner before all non-human checks were exhausted. That failure mode is prohibited.

## 1. Primary rule

Everything that can be tested or inspected without the owner's physical participation MUST be tested or inspected before asking the owner to do anything and before handing the owner an extension build/ZIP.

The architect/executor must exhaust applicable available tools first. A request such as "click Send", "open this tab", "check the model", "copy the DOM", "take a screenshot", "run this shell command", "look at CI", or "tell me whether binding worked" is a test-execution defect when an available tool can perform or observe that step.

Human participation is allowed only for a proven non-automatable residue, for example a password/secret/2FA entry, CAPTCHA, an explicit provider security/approval gate that cannot be pre-approved or automated, or another action that remains impossible after all applicable tools below were actually tried.

Any claimed human-only blocker MUST record:
- which applicable tools were tried;
- the exact operation attempted;
- the exact error, missing capability, approval boundary or provider restriction;
- why the remaining action cannot be completed by another available tool.

A bare "please click/confirm/check manually" is not an acceptable blocker.

## 2. Available tool inventory and verified capability boundaries

Capabilities are time-sensitive. At the start of a browser/GUI testing task the architect must re-check the actually available tool surface instead of assuming an old capability still exists. The inventory below is the verified baseline on 2026-09-17.

### 2.1 Opera Browser Connector — architect observation/navigation channel

Currently exposed operations in this architect conversation:
- list open tabs and tab IDs;
- read browser history for up to seven days;
- read the accessibility tree of a tab;
- query that accessibility tree with jq;
- take a screenshot;
- navigate an existing tab to a URL or open a URL in a new tab;
- close a tab.

Use it for live URL/conversation identity checks, tab discovery, read-only DOM/accessibility evidence, visible Work/model/composer state, screenshots and navigation.

Current hard boundary: this concrete connector does not expose generic click/type/Send operations. That limitation does NOT mean the owner must act; continue down the automation ladder.

### 2.2 Codex Browser Use through the supported browser extension

OpenAI's current documentation states that Browser Use lets Codex work with websites through the in-app browser or Chrome using the ChatGPT Chrome extension. The Chrome-extension route is the supported route when a task needs the existing Chrome profile, cookies, signed-in session, open tabs or Chrome extensions.

Use this route for interactive work in an already authenticated supported browser session where available. Do not export passwords/cookies/storageState into prompts, Git or evidence.

Do not assume an unsupported browser transport merely because a Chromium extension can be installed there. In particular, the current official documentation found on 2026-09-17 names Chrome. If an installed extension is being used through Opera or another browser, first prove its concrete capabilities with a bounded preflight and record the result.

Official references checked 2026-09-17:
- https://help.openai.com/en/articles/20001277-using-the-built-in-browser-in-the-chatgpt-desktop-app
- https://help.openai.com/en/articles/20001510-manage-browser-and-computer-use-in-your-enterprise-workspace

### 2.3 Codex / ChatGPT desktop built-in browser

The built-in browser can browse pages, work across tabs, sign in inside its own browser state, use supported extensions, start downloads and perform browser tasks through Browser Use.

Important boundary: it uses its own browser state. It does not automatically inherit the existing Chrome/Opera login. Use it directly for public/local-development testing or when its own authenticated state is intentionally prepared; do not silently treat it as the same session as the owner's ordinary browser.

Official reference checked 2026-09-17:
- https://help.openai.com/en/articles/20001277-using-the-built-in-browser-in-the-chatgpt-desktop-app

### 2.4 Developer Mode / full CDP

Where Browser Use/CDP is available and approved, Codex can use Chrome DevTools Protocol for deeper diagnostics including console output, runtime/browser errors, network traffic, page state/DOM and JavaScript performance. Full CDP can inspect/control sensitive browser internals and may require an explicit approval before first use on a website.

Use CDP when ordinary Browser Use or accessibility evidence is insufficient. Do not invent selectors or runtime state from screenshots when CDP/page-state evidence is available.

Official references checked 2026-09-17:
- https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
- https://help.openai.com/en/articles/20001510-manage-browser-and-computer-use-in-your-enterprise-workspace

### 2.5 Site Tools / WebMCP

In the ChatGPT desktop built-in browser, a supported website may expose structured site tools. When available, ChatGPT can use them to search/read/update supported website data and work with interactive pages using the current page/session.

Current boundary: Site Tools are available only when the account/model/page supports them and the website actually exposes matching tools. Current OpenAI documentation says they are in the desktop built-in browser, not Chrome. Detect availability first; never invent a Site Tool.

Official reference checked 2026-09-17:
- https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app

### 2.6 Computer Use

Where enabled, Computer Use lets Codex interact with desktop applications on Windows/macOS; current OpenAI documentation describes seeing/clicking/typing in Windows applications. Use it as GUI fallback when browser-specific tooling cannot perform an otherwise automatable click/type/window action.

Do not ask the owner to operate ordinary GUI controls before checking whether Computer Use is available for the task.

Official references checked 2026-09-17:
- https://help.openai.com/en/articles/20001510-manage-browser-and-computer-use-in-your-enterprise-workspace
- https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes

### 2.7 Codex local development surface

Codex local execution is the default place for repository/file work, terminal commands, tests, builds, package generation, local servers, logs and deterministic debugging that the executor is authorized to perform.

Do not give the owner shell commands to execute manually when Codex/local tooling can run them. Do not use the owner as a copy/paste transport for ordinary files or logs that available tooling can read.

### 2.8 GitHub connector — architect repository authority

The currently connected GitHub tool can inspect repository metadata, files/directories, branches, commits, diffs/comparisons, PR metadata/patches/changed paths, status checks/workflow runs and artifacts; the connected write surface also supports bounded repository writes such as creating/updating files/branches/commits/refs where project authorization permits them.

Technical capability is not authorization: project rules still forbid force updates and unauthorized merge/rebase/reset/stash/cherry-pick/amend, reserved-file edits and unrelated scope changes.

Use the connector before claiming GitHub/CI/evidence is unavailable merely because server-side gh is unauthenticated.

### 2.9 Web/search

Use current web research for external documentation, provider behavior, browser/CDP/tool capability and known issues when freshness matters. Web search is not a substitute for an authenticated local browser session and must not be used to guess live DOM/account state.

### 2.10 Business Bridge 2

Business Bridge is the development transport between architect conversation and the Codex executor. It is not Seller Agents and is not itself the product under test. Its existence does not justify building a second browser bridge merely to run tests.

For browser/Health work, reuse available Codex/browser/connector capabilities before proposing new infrastructure. Do not modify Business Bridge unless the owner explicitly authorizes a separate Bridge change.

## 3. Mandatory automation ladder

Before requesting owner participation, use the applicable layers in this order, skipping only layers that are irrelevant or demonstrably unavailable:

1. deterministic programmatic/local tests and local tooling;
2. GitHub connector for repository/CI/evidence operations;
3. Opera Browser Connector for live tab/URL/accessibility/DOM/screenshot/navigation evidence;
4. Codex Browser Use through a supported installed browser extension when an existing signed-in browser session is needed;
5. Codex/ChatGPT built-in browser when its separate browser state is acceptable;
6. Developer Mode/full CDP for deeper DOM/console/network/page-state/runtime inspection;
7. Site Tools if the current page actually exposes them;
8. Computer Use for remaining automatable GUI interaction;
9. only then, a proven minimal human-only residue.

Do not stop at the first tool's limitation if a later tool can close the same criterion.

## 4. Mandatory pre-handoff test gate

No extension build, ZIP, package or "ready for owner test" candidate may be handed to the owner until every applicable check that does not require owner participation has been run and is green.

At minimum, depending on changed scope, run and record:
- unit tests;
- contract/schema tests;
- integration tests, including PostgreSQL/migrations when applicable;
- browser/E2E tests that can be automated;
- runtime harnesses/native fixtures;
- live read-only DOM/accessibility/browser-state checks where relevant;
- typecheck;
- lint;
- format check;
- build/package checks;
- source-to-package inventory/parity checks where package artifacts are produced;
- security/fail-closed tests;
- Health/H3 tests relevant to the changed browser integration;
- regression suites for the touched behavior;
- exact-head CI gates required by the roadmap;
- installed/browser binding checks that are automatable.

FAILED, SKIPPED and NOT RUN are not PASS. Any skipped item must state why it is inapplicable or why it is genuinely human-only.

The required development loop is:
- collect current live DOM/page/tool evidence where relevant;
- build the complete test list for the bounded scope;
- run every automatable test;
- collect actual failures;
- design and implement the smallest correct patch;
- rerun the affected tests and then the full required regression matrix;
- repeat until green;
- only then prepare the owner handoff/package.

## 5. Mandatory dialogue-binding gate for extension handoff

A candidate extension must never reach the owner with an undiscovered basic dialogue-binding failure.

Before packaging/handoff, automate and prove as much of this path as the available tools permit:
- install/load/reload the exact candidate package in the controlled test environment;
- open or identify an existing allowed ChatGPT test dialogue;
- recognize the exact conversation identity rather than merely chatgpt.com origin;
- bind the extension to that dialogue;
- verify the intended account/store/marketplace context;
- persist the binding;
- reload the page/extension/worker as relevant and prove binding restoration;
- prove it does not bind to a neighboring/unrelated dialogue;
- unbind/rebind and prove expected state transitions;
- prove parallel-dialogue isolation where the changed scope touches it;
- prove wrong-dialogue/navigation drift fails closed;
- collect DOM/accessibility/runtime evidence for any selector/identity dependency.

If final Send is the only operation that the available environment truly cannot execute without a provider confirmation, all pre-Send and post-state-independent checks still MUST be completed before owner involvement. The report must isolate that one residue instead of handing the owner a broad manual test script.

## 6. Prompt requirement

Every future Codex/tester prompt that involves browser, GUI, installed extension, packaging, Health/H3, provider/live acceptance or owner handoff MUST include an explicit `AVAILABLE TOOLS / NO UNNECESSARY HUMAN ACTION` section.

That section must:
- name the tools actually available for that task;
- list their relevant capabilities and known boundaries;
- require the automation ladder above;
- prohibit asking the owner to perform an automatable step;
- require evidence for any claimed human-only blocker;
- require all non-human tests to be green before handoff.

Do not shorten this into a vague sentence such as "use available tools". The purpose is to prevent a future executor/architect from forgetting that the tools exist or assuming a capability boundary without checking it.

## 7. B7/Health-specific application

For current B7/H3 work:
- the owner-designated current ChatGPT account is the Health test account;
- use only the fixed Standard and Work fixture conversations recorded in STATE.md;
- zero new chat/Project creation, deletion, archive, rename or move;
- zero model-picker opens/model changes;
- Work must identify model family GPT-5.6 Luna; effort suffix is allowed;
- live DOM/accessibility/account/conversation/model/composer evidence must be collected with available tools before any human-only action;
- the current behavioral B7 task must not be duplicated while its execution/report state is unresolved;
- after its final report, the architect reviews it, updates cursor and performs the owner-requested new-dialogue handoff; no automatic next executor prompt is issued.

## 8. Evidence standard

Every browser/installed/Health acceptance report must distinguish:
- automated and actually executed;
- automated but unavailable, with exact reason;
- human-only and why;
- not applicable;
- not run.

Never label a capability "tested" because a tool advertises it. For example, "CDP capability advertised" is not the same as "CDP exercised". Record the tool/action actually used.

This policy overrides older instructions that casually defer ordinary validation to the owner. Later explicit owner instructions still have priority.