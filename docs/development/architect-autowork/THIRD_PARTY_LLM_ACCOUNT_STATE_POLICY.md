# THIRD-PARTY LLM ACCOUNT STATE POLICY

Status: MANDATORY project-wide architecture and testing invariant for Seller Agents / Octoport.
Effective: 2026-09-17.
Scope: every current and future extension, server-integration, browser-test, Codex task, architecture review, product decision and owner handoff that touches ChatGPT, Alice or any future third-party LLM surface.

This file is a mandatory companion to `TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md`. It exists to prevent a testing limitation from being turned into product architecture.

## 1. Primary product invariant

Seller Agents / Octoport MUST NOT model, infer, persist or hardcode a third-party LLM account class as product authority.

The product does not care whether a third-party LLM account is free, paid, subscribed, unsubscribed, trial, enterprise, personal, Work-enabled, Work-disabled or in any other provider-owned commercial/account category.

Those provider-side categories are not Seller Agents product concepts.

They MUST NOT become:

- Seller Agents plans;
- Seller Agents permissions;
- Seller Agents entitlements;
- Seller Agents capability grants;
- Seller Agents authorization classes;
- Seller Agents account tiers;
- extension modes selected from inferred provider subscription state;
- server policy selected from inferred provider subscription state;
- persistent fields such as `isPaid`, `subscriptionTier`, `providerPlan`, `hasPaidLlm`, `workTier`, `llmPlan`, or equivalent product authority;
- global gates that enable or disable the extension because of a provider-owned account category.

A future provider pricing or account-model change MUST NOT require Seller Agents product logic to be rewritten merely because the provider renamed, moved, added or removed a commercial tier.

## 2. Runtime rule: work with the surface that actually exists

Production runtime may detect only the concrete supported page/runtime surface needed to perform a specific operation.

Examples of legitimate runtime facts:

- a supported composer is present;
- a supported conversation identity is present;
- a specific supported control or DOM surface exists;
- a specific operation can or cannot be performed on the current page;
- the provider currently shows a login wall instead of a usable chat surface.

These are observable runtime facts, not provider account classes.

The extension MUST NOT infer from them that the user is on a particular paid/free/subscription tier.

If one provider-specific surface is absent, only the operation that actually requires that surface may be unavailable. Its absence MUST NOT by itself disable unrelated Seller Agents functionality or manufacture a Seller Agents authorization decision.

## 3. Work and similar provider features are not Seller Agents authority

`Work`, or any equivalent present/future provider-specific surface, MUST NOT be encoded as a Seller Agents subscription class, permission tier or global product mode.

If production code needs to recognize a concrete provider UI surface in order to interact with it, that recognition is a browser-adapter concern only.

It MUST NOT be converted into a statement such as:

- user is paid;
- user is free;
- user has a better Seller Agents tier;
- user may use Seller Agents because Work exists;
- user may not use Seller Agents because Work does not exist.

Seller Agents' own authorization, beta access, commercial plans, server permissions and signed capability decisions remain separate first-party authorities and must never be derived from third-party LLM commercial/account state.

## 4. The only current split is a testing-environment split

The owner and architect explicitly define the current distinction as follows:

1. `SERVER_AUTOMATABLE` — Codex can execute the test in its own server/browser environment without the owner's personal authenticated third-party LLM session.
2. `OWNER_SESSION_REQUIRED` — the test requires the owner's real authenticated third-party LLM session, which is not being transferred to Codex, so the owner performs that residue manually as one consolidated batch after all server automation is green.

This split exists only because the owner's authenticated provider session is not available to the Codex server test environment.

It has NO product meaning.

It MUST NOT be translated into production architecture, product permissions, server entitlements, extension tiers, account classes or runtime modes.

If a future approved tool can safely test the same authenticated surface without owner participation, that test moves from `OWNER_SESSION_REQUIRED` to `SERVER_AUTOMATABLE` without any product-code change.

## 5. Test matrix rule

Tests may exercise different observable provider states when needed to prove compatibility, for example:

- usable chat surface;
- login wall / no usable composer;
- optional provider-specific UI present;
- optional provider-specific UI absent;
- authenticated owner session;
- isolated server fixture or public unauthenticated surface.

These rows exist only to obtain coverage of different observable surfaces.

They MUST NOT be treated as domain classes that production code should store or reproduce.

Test reports should prefer descriptions of observed surfaces rather than speculative provider commercial labels.

Do not write `paid account PASS` or `free account FAIL` when the evidence actually proves only that a specific observable UI surface was present or absent.

## 6. Manual testing consequence

Owner/manual testing is required only for the residue that cannot be executed by the current automation environment, principally because the owner's authenticated provider session is not transferred to Codex or because an actual physical/browser/provider environment is otherwise unavailable.

The mandatory sequence remains:

`all server automation -> complete automated defect batch -> coordinated patch -> full regression -> one consolidated owner-session/manual batch -> complete manual defect batch -> coordinated patch -> full regression`

Do not split the owner batch by imagined provider tier.

Do not create separate product acceptance tracks called free/paid/Work/non-Work unless the owner explicitly defines a future test-only matrix for a concrete reason. Even then, those labels remain test metadata only and do not authorize product modeling.

## 7. Forbidden implementation patterns

Architecture/code review MUST reject, unless the owner explicitly changes this invariant, any production change whose logic is equivalent to:

- infer paid/free from DOM;
- infer subscription plan from presence/absence of Work;
- store provider plan as Seller Agents account authority;
- map provider plan to Seller Agents server entitlement;
- globally disable the extension because an optional provider surface is absent;
- make ordinary Seller Agents browser/runtime initialization contingent on a provider-owned commercial class;
- create a server permission or capability from a guessed provider subscription tier;
- use third-party account/payment state as a replacement for Seller Agents' own signed authorization.

Names do not matter. A renamed field or indirect boolean with the same semantic meaning is equally forbidden.

## 8. Required future Codex prompt guard

Any Codex task that touches LLM browser adapters, provider DOM, Work-like surfaces, login state, browser acceptance or provider-authenticated tests MUST contain an explicit guard equivalent to:

`NO THIRD-PARTY LLM ACCOUNT-TIER PRODUCT MODELING`.

The prompt must state that:

- provider authentication/subscription/payment state is test-environment metadata only;
- production code must not infer or persist free/paid/provider-plan classes;
- the test split is only `Codex can automate without owner session` versus `owner session required`;
- Seller Agents first-party authorization/entitlements remain separate;
- a missing optional provider surface may block only the concrete dependent operation, not manufacture a global Seller Agents product decision.

## 9. Review checklist

Before accepting any future LLM/browser patch, the architect must verify:

- no new provider-tier/product-authority field was introduced;
- no provider plan/payment inference was introduced;
- no Work-presence inference became a Seller Agents entitlement;
- no optional provider UI absence became a global extension disable gate;
- any provider-state distinction in tests stays in test/evidence code only;
- owner-session-only checks remain a testing residue, not a production branch;
- Seller Agents server authorization remains first-party and independent.

A violation is an architecture defect even if tests are green.

## 10. Authority

This policy records the owner's explicit instruction on 2026-09-17 and overrides earlier or later ambiguous wording that could be read as defining separate Seller Agents product modes from third-party LLM authentication, payment, subscription or Work availability.

Only a later explicit owner instruction may change this invariant.
