# B3 — ChatGPT Standard H3 evidence

Date: 2026-09-14
Branch: `feature/server-health-h3-p8-4`
Base: accepted B2 `0474d83e27074f9f61a41efd13e916d2ab75d20c`

## Implementation

B3 adds one packaged `CHATGPT_STANDARD_H3_V1` strategy for the existing B2
engine. It uses the current controlled Chrome lifecycle and locally packaged
structural markers for surface/composer identity, prompt insertion, the single
send activation, generation transition, new-response association, completion,
code-block/Copy correlation, conversation identity, and safe delivery contour.

The Standard strategy retains only ephemeral structural locators and bounded
identities for the active run. Prompt and response content are never returned,
stored, logged, or placed in evidence. The fixed Health token is checked only
inside the local code-surface validation. Copy is correlated but never clicked.

The production target authority is credential-free `https://chatgpt.com/` with
the existing target key `chatgpt_standard_health`. No Work target or Work
strategy was added. No BrowserDriver raw Page/Context/Locator, arbitrary
selector, script, URL, provider, marketplace, customer session, persistence,
schema, contract, or API authority was added.

## Deterministic browser acceptance

`tests/e2e/server/health-standard-h3.spec.ts` runs the real Chrome driver and
the real B2 engine against a loopback-only synthetic fixture. The final matrix
was `23/23 PASS`, retries `0`, with no external network dependency.

Covered cases include:

- valid Standard success through all nine steps;
- Standard-only registration and Work resolution rejection;
- exact packaged prompt observation in the test fixture;
- physical Send activation exactly once on success and every post-send failure;
- zero physical Send activations for pre-send failures and environment blockers;
- visible Stop/Send disambiguation and ambiguous Send rejection;
- login, CAPTCHA, verification, and account-blocked uncertainty;
- missing/drifted surface, composer, input, response, completion, code, Copy,
  conversation, and delivery contours;
- pre-existing assistant history not satisfying response association;
- bounded result privacy assertions with no prompt, response, HTML, selector,
  token, cookie, or storage data in the result.

## Gates

- Health-runner typecheck: PASS.
- Health-runner unit tests: `69/69 PASS`.
- Health-runner build: PASS.
- Repository lint and Bridge guard: PASS.
- Repository format check: PASS.
- Repository typecheck: PASS.
- Repository unit tests: PASS.
- OpenAPI check: PASS.
- Database migration command: PASS; migration range unchanged, no migration
  created.
- Repository build: PASS.
- H2 BrowserDriver regression: `13/13 PASS` on real Chromium, including
  fallback/miss/checkpoint, cookie isolation, popup blocking, and all guarded
  redirect/meta-refresh cases.
- Full integration: `1506/1507 PASS`; one known pre-existing P7.2 concurrency
  fixture failed in `p7.2-correction.integration.test.ts` with expected
  `PUBLISHED`, actual `RETIRED`. No B3 path, schema, or data change caused it;
  the same baseline limitation was recorded by B2.

No live ChatGPT acceptance, provider call, customer session, B4 Work behavior,
B5 evidence persistence, or P8.5 work was started.
