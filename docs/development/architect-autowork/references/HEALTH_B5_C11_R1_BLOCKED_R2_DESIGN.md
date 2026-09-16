# Health B5 C11 R1 blocked test trigger / R2 deterministic design — 2026-09-16

## R1 terminal verdict

Task SA-HEALTH-B5-C11-R1-20260916-01 did not create a product candidate and is BLOCKED_TEST_TRIGGER_ONLY, not a product/code failure and not an accepted C11 result.

Verified terminal facts:

- repository MaksimUnimax/runtime-fixtures, branch feature/server-health-h3-p8-4;
- base/remote remained f8b35fdec3212dedf0e186830e4af21c719d890d;
- base tree e8ecb16f857fcdbafc29889ae4a4fd37d54c1b8c;
- main bc718cc5c677ad0eb4598e7de3ad766473ff0847;
- no changed paths, no commits, no push, final worktree clean;
- the mandated page-world Element.prototype.getAttribute wrapper did not observe Playwright locator.getAttribute calls;
- the focused run produced 79 total tests, 77 passed and two intended new tests failed because both strategies still returned PASS: the identity mutation hook never fired;
- this is not valid RED evidence for the C11 provenance defect;
- mapper/PostgreSQL/full cycle were correctly not run after the invalid RED;
- zero live-provider calls and no history/scope mutations.

Independent remote readback after the terminal confirms the Health branch is still f8b35fdec3212dedf0e186830e4af21c719d890d and main is still bc718cc5c677ad0eb4598e7de3ad766473ff0847.

The original production diagnosis remains valid: on identityPass=false both Standard and Work construct C11 with fallbackQuality APPROVED_EQUIVALENT and URL fallback FAIL but selectedStrategyId=null, violating H3ContourObservationSchema. The strategy #safe catches that schema exception and returns bare fail(), losing C09–C12. The chosen production correction remains to record CONVERSATION_URL_IDENTITY as selected whenever that fallback was evaluated, regardless of PASS/FAIL.

## Why the old trigger is discarded

Playwright locator reads execute through Playwright's own injected/utility execution machinery rather than the page's ordinary main-world Element.prototype wrapper. The reported zero-hit diagnostic and the two PASS outcomes prove the specific page-world monkey-patch is not a valid synchronization seam for this repository/Playwright version. Do not broaden production code or browser driver just to preserve that failed test design.

## R2 deterministic strategy-level browser seam

Use the existing real fixture DOM and real Playwright Page, and run the actual Standard/Work production strategy through the common H3 engine. The only test double is a Node-side Proxy around the Playwright Page passed to the strategy. It scripts the identity source values returned by page.url() and the canonical locator while delegating every other Page/Locator operation to the real Playwright objects.

This is intentionally a strategy-level TOCTOU simulation, not a provider-page script. It models a real route/canonical identity change between two source reads without depending on browser timer scheduling, page-world prototype patching or a production test hook.

### Shared scripted-page helper contract

Implement a small helper local to each H3 spec file or one duplicated minimal helper; do not add a production helper/module.

Inputs:

- the real Playwright Page;
- changedUrl;
- changedCanonicalHref;
- flipAtCanonicalHrefRead.

State:

- armed=false;
- canonicalHrefReads=0;
- drifted=false.

Return:

- page: Page Proxy;
- arm(): sets armed=true, canonicalHrefReads=0, drifted=false;
- optional readback getters for assertions/debug only.

Page Proxy behavior:

1. page.url(): return changedUrl only when drifted=true; otherwise delegate to the real page.url().
2. page.locator(selector,...args): delegate to the real page.locator. For every selector except exact link[rel="canonical"], return the real Locator unchanged. For exact canonical selector, return a Locator Proxy.
3. Every other Page property/method is delegated; callable values must be bound to the real Page so Playwright private/internal receiver state is preserved.

Canonical Locator Proxy behavior:

1. getAttribute(name,...args): call the real locator.getAttribute first to preserve the underlying browser operation and original result.
2. If name is not href or armed=false, return the original result.
3. If armed=true and name=href, increment canonicalHrefReads.
4. When canonicalHrefReads reaches flipAtCanonicalHrefRead, set drifted=true.
5. Once drifted=true, return changedCanonicalHref for href reads; before drift return the original href.
6. Every other Locator property/method delegates/binds to the real Locator.

The canonical getAttribute is intentionally the flip point because both profile identity resolvers read canonical href and then call page.url(). Setting drifted during that href read makes the subsequent page.url return the matching changed URL, so the strategy observes a coherent changed identity rather than an artificial URL/canonical conflict.

### Arm exactly at VALIDATE_BRIDGE_SURFACES

Wrap the actual H3 strategy in a test-only Proxy passed to runH3BehavioralSmoke. All properties/methods delegate/bind to the real strategy. The sole special case is validateBridgeSurfaces: immediately before delegating to the real strategy method, call scriptedPage.arm().

This guarantees all prior H3 steps run against the unmodified real identity. No production hook, driver change or timer is required.

### Standard exact phase

Use the existing Standard fixture variant EXISTING_CONVERSATION and direct createChatGPTStandardH3Strategy with the scripted Page Proxy and a target resolved from createControlledTargetRegistry. Use fixture.origin as the allowed origin, matching existing Standard fixture semantics. closeSession is test-owned no-op; test cleanup closes page/browser through Playwright and closes the fixture.

Changed identity uses the existing valid changed UUID 00000000-0000-4000-8000-000000000003. changedUrl and changedCanonicalHref are both fixture.origin + /c/<changed-id>.

flipAtCanonicalHrefRead = 1.

Reason: after arming at validateBridgeSurfaces, Standard's initial allowed-origin check reads page.url only. Its C11 belongsToConversation call performs the first canonical href read. The helper flips there; the immediately following page.url returns the same changed identity. C09/C10 have already been evaluated, C11 sees a different bound conversation and returns identityPass=false, and C12 remains independently evaluable.

### Work exact phase

Use the existing Work fixture variant VALID and direct createChatGPTWorkH3Strategy. Resolve a target with allowedTopLevelOrigins [fixture.origin, "https://chatgpt.com"] exactly like the current Work runVariant helper, because the Work strategy requires the packaged approved-origin policy to be present. closeSession is a test no-op.

Changed identity uses 00000000-0000-4000-8000-000000000002. changedUrl and changedCanonicalHref are both fixture.origin + /g/g-p-test-project/c/<changed-id>, preserving the project route key and changing only conversationId.

flipAtCanonicalHrefRead = 3.

Reason after arming at validateBridgeSurfaces:

1. Work's first #workOwnershipStable reads canonical href once and passes on original identity.
2. The immediately following first #belongsToBoundRoute calls #workOwnershipStable again; canonical href read two passes on original identity.
3. C09/C10 and delivery preconditions execute.
4. The late C11 #belongsToBoundRoute calls #workOwnershipStable again; canonical href read three flips to changed canonical and the following page.url supplies the matching changed URL.
5. Project route remains stable but conversationId differs from captured #routeIdentity, so identityPass=false after both early guards have already passed.

This directly proves the reachable late Work identity change that remained uncertain in the earlier architecture review.

## Expected RED / GREEN

Before changing production strategies, add the two desired browser-strategy tests using the scripted Page/strategy proxies and run only the Standard/Work H3 spec files.

Expected pre-fix RED for each new test:

- overall engine result still FAIL at VALIDATE_BRIDGE_SURFACES with BRIDGE_SURFACE_VALIDATION_FAILED;
- one physical Send;
- the VALIDATE_BRIDGE_SURFACES event exists but has an empty observations array, because C11 construction throws and #safe converts it to bare fail();
- therefore the desired assertion for four C09–C12 observations fails.

The test should assert the desired post-fix contract, not the broken empty-array behavior; capture the failure output as RED evidence.

After the exact two-line production correction, both tests must GREEN and retain C09 PASS, C10 PASS, C11 failed selected URL fallback provenance, C12 PASS.

The mapper and PostgreSQL durable regressions from R1 remain required unchanged. They prove B5 persistence/classification of the retained C11 failure as BROKEN for Standard and Work.

## R2 scope decision

No browser-driver change is required or allowed. The R1 fixture page-world hook is removed from the plan. Existing fixture support files do not need changes for R2.

Next task: SA-HEALTH-B5-C11-R2-20260916-01, base f8b35fdec3212dedf0e186830e4af21c719d890d.

Whole B5 remains REWORK_REQUIRED / NOT ACCEPTED until the R2 candidate is independently reviewed and exact-head remote CI is successful.