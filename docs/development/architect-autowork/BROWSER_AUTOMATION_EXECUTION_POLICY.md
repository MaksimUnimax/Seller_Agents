# BROWSER AUTOMATION EXECUTION POLICY

Status: MANDATORY companion to `TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md` and `THIRD_PARTY_LLM_ACCOUNT_STATE_POLICY.md`.
Effective: 2026-09-17.
Scope: every current and future Seller Agents / Octoport task that changes or accepts browser-extension behavior, LLM adapters, dialogue binding, installed-extension behavior, packaging or owner handoff.

This policy exists because earlier work incorrectly treated many browser-extension checks as human-only. A bounded server-side capability probe on 2026-09-17 proved that the actual current unified Seller Agents extension can be loaded and exercised by Playwright in its bundled Chromium without the owner's authenticated LLM session.

## 1. Mandatory first browser gate

For Chromium-extension acceptance, the default server-side browser gate is Playwright's bundled Chromium with a persistent context and the actual unpacked candidate extension.

The canonical launch class is:

- `chromium.launchPersistentContext(...)`;
- `--disable-extensions-except=<actual unpacked candidate>`;
- `--load-extension=<actual unpacked candidate>`.

Both headless and headed/Xvfb execution must be attempted when relevant to the changed scope. A manifest parse, source-string check or synthetic VM test does not replace an actual packaged-extension load when the browser can perform it.

The browser test must use the exact current candidate package, not a toy extension, Business Bridge, an old Ozon-only extension or a hand-written mock standing in for the shipped extension.

## 2. Verified server-side baseline from 2026-09-17 probe

Probe work ID: `SA-I1-BROWSER-AUTOMATION-PROBE-2026-09-17-01`.

Repository/base used by the probe:

- repository: `MaksimUnimax/runtime-fixtures`;
- accepted integration base: `1d8045a3511be7f0cfab72c175316187550f80c8`;
- extension manifest version: `0.2.4`;
- composed package file count: `39`;
- reported package ZIP SHA-256: `5c33b7a5faa27cb05a45eba08f3da86e3d616e80ca95de3c79c9350bb20a54a3`.

Probe environment:

- Playwright `1.62.1`;
- bundled Chromium / Chrome for Testing `151.0.7922.34`;
- executable `/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`;
- Xvfb available.

Actually executed and reported PASS on the exact product package:

- bundled Chromium headless extension load;
- bundled Chromium headed under Xvfb extension load;
- MV3 service worker discovery;
- extension ID derivation from worker URL;
- popup open/runtime execution;
- `chrome.storage.local` read/write;
- popup close/reopen persistence;
- page reload persistence;
- persistent browser-context restart persistence;
- multiple tabs;
- conversation identity isolation;
- wrong-dialog / neighboring-dialog isolation in the exercised matrix;
- extension reload/lifecycle paths covered by the probe.

The fresh evidence handoff later reproduced the same headless P01-P14 and ChatGPT/Alice fixture results.

Important limitation: forced idle service-worker suspension itself was `NOT_SUPPORTED_BY_TOOL` in this probe. Browser/persistent-context restart persistence is a separate PASS and MUST NOT be rewritten as proof of forced idle suspension.

## 3. Branded Chrome is not the same test target as Playwright Chromium

Do not substitute Google Chrome or Edge for the mandatory Playwright bundled-Chromium load proof.

In the 2026-09-17 probe, branded Google Chrome `147.0.7727.116` did not load the unpacked MV3 extension through the same required sideload flags: no MV3 service worker appeared.

Therefore:

- bundled Chromium PASS remains valid even if branded Chrome sideload FAILS;
- branded Chrome runtime acceptance, when required, is a separate environment-specific gate;
- a branded Chrome FAIL must not be misreported as `Playwright cannot test extensions`;
- a bundled Chromium PASS must not be misreported as `real Google Chrome accepted`.

When an authenticated existing user Chrome session is required and an approved attach/browser-extension route is available, that is a different automation path and must be reported separately from command-line sideload.

## 4. Opera and Yandex Browser must be proven, never inferred

Opera and Yandex Browser are Chromium-derived, but Chromium ancestry is not acceptance evidence.

Rules:

- do not mark Opera PASS because bundled Chromium passed;
- do not mark Yandex PASS because bundled Chromium passed;
- detect whether the actual browser binary exists;
- if safe, install/use an isolated test binary/profile and execute the actual extension;
- record exact version, launch method, extension-load result, worker result, popup result, content-script result and persistence result;
- if the environment is absent, record `NOT_TESTED_ENVIRONMENT_MISSING`, not PASS.

The 2026-09-17 probe found no Opera or Yandex Browser binary on the server. Their status remains environment-missing until separately executed.

## 5. Firefox uses a separate WebExtension path

Playwright Chromium extension loading is not Firefox extension acceptance.

For Firefox:

- inspect the actual current extension manifest/build compatibility;
- use Mozilla-supported temporary extension tooling such as `web-ext run`, or another legitimate isolated Firefox profile route;
- test the actual current product package if compatible;
- prove background/runtime, popup, content-script and storage behavior separately.

The 2026-09-17 probe had no Firefox binary. `web-ext 10.6.0` lint found current blockers including missing Firefox-compatible background fallback/add-on ID requirements and a data-collection metadata notice.

`web-ext lint` is not runtime Firefox PASS.

## 6. LLM provider session state is a test-environment boundary only

This policy MUST be read together with `THIRD_PARTY_LLM_ACCOUNT_STATE_POLICY.md`.

The split is only:

1. `SERVER_AUTOMATABLE` — Codex can execute the test without the owner's personal authenticated provider session.
2. `OWNER_SESSION_REQUIRED` — the test genuinely requires the owner's real authenticated provider session and that session is not being transferred to Codex.

No product meaning may be derived from this split.

Do not create free/paid/Work/non-Work product modes, tiers, entitlements, permissions or authorization classes from a test-environment limitation.

Tests may describe the observed page surface that was exercised, but production code must not persist or infer a provider commercial/account class from that test matrix.

## 7. What Codex must test before owner involvement

Before any owner browser handoff, Codex must automate every applicable item that the server environment can perform, including at minimum where relevant:

- build/package;
- source/package parity;
- actual unpacked extension load;
- MV3 worker/runtime;
- popup runtime;
- storage read/write and persistence;
- popup close/reopen;
- page reload;
- persistent browser restart;
- multi-tab isolation;
- exact conversation identity;
- bind/unbind/rebind;
- wrong-dialog fail-closed;
- parallel-dialog isolation;
- marketplace switch and marketplace isolation;
- store isolation;
- current LLM adapter fixtures;
- supported composer/chat fixture behavior;
- provider login-wall / missing-composer fail-closed behavior;
- DOM drift;
- SPA route changes;
- bootstrap/auth/transport regression paths that do not require the owner's provider session;
- unit/integration/E2E/browser regressions applicable to the touched scope;
- exact package/browser evidence for the candidate being handed off.

An item that cannot be executed because the environment is missing is not PASS. Record the exact missing environment/tool prerequisite and continue every other reachable automated test.

## 8. Failure batching remains mandatory

Browser automation follows the same mandatory defect loop as the project-wide policy:

`all reachable automation -> complete automated failure batch -> coordinated patch -> focused tests -> full regression -> repeat until green`.

Do not patch the first browser failure and immediately hand the next test to the owner if more server-side browser tests remain reachable.

Do not stop after proving only that the service worker loads. Installed extension acceptance must exercise the current bounded feature path far enough to expose binding, storage, adapter, popup, lifecycle and isolation defects before owner involvement.

## 9. Owner-session batch

Only after every reachable server-side automated test is green may the architect prepare one consolidated owner-session/manual batch.

That batch exists only for tests which still require the owner's real authenticated provider session or a genuinely unavailable physical/browser/provider environment.

The owner batch MUST NOT be split by inferred provider account tier. It is a single operational residue created by unavailable session/environment access.

The owner performs all currently reachable human-only tests in one pass. All defects/findings are collected before the next ordinary patch cycle.

After any owner-derived patch, Codex reruns the full affected automated matrix before another owner batch is considered.

## 10. Required status vocabulary

For browser capability/test matrices use explicit statuses:

- `PASS`;
- `FAIL`;
- `NOT_SUPPORTED_BY_TOOL`;
- `NOT_TESTED_ENVIRONMENT_MISSING`;
- `OWNER_SESSION_REQUIRED` or the historically used equivalent `AUTH_REQUIRED_OWNER_BATCH`.

Never convert SKIPPED, UNKNOWN, advertised capability or environment absence into PASS.

## 11. Mandatory future prompt guard

Every future Codex/browser tester prompt that touches the extension must explicitly state:

- use Playwright bundled Chromium as the primary server-side unpacked-extension gate when applicable;
- test the actual exact candidate package;
- distinguish bundled Chromium from branded Chrome;
- do not infer Opera/Yandex from Chromium;
- use a separate Firefox/WebExtension path;
- do not claim forced idle suspension if only browser restart was tested;
- exhaust server automation before owner involvement;
- collect all automated failures before patching;
- hand the owner only one consolidated remaining session/manual batch;
- obey `THIRD_PARTY_LLM_ACCOUNT_STATE_POLICY.md` and never turn provider authentication/subscription/Work state into Seller Agents product authority.

## 12. Authority

This policy records the verified browser-testing boundary established on 2026-09-17 and the owner's explicit instruction that Codex performs all tests possible without the owner's personal provider session before the owner performs the remaining session-bound tests.

A later tool/browser capability improvement should reduce the owner residue, not create new product modes.

Only later explicit owner instructions may weaken or replace this invariant.
