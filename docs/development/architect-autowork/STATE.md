# Server / I1 / Health current cursor — 2026-09-16

Current: HEALTH_P8_4_B8_NONLIVE_READINESS_ACCEPTED / HEALTH_B7A_REWORK_REQUIRED_DIRECT_BINDING_BYPASS / HEALTH_B7A_R1_CAPABILITY_PROVENANCE_PREPARED_FOR_SINGLE_FINAL_SUBMISSION / HEALTH_B7_LIVE_NOT_RUN / P8_4_NOT_ACCEPTED / P8_5_NOT_STARTED / I1_C2_2A_OPEN_BLOCKED.

Owner continuous autowork is active. One architect and one sequential Codex executor only. SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01 terminal has been received and independently reviewed. Executor stopped after terminal. No other implementation executor is claimed running at this snapshot. Saving R1 is preparation, not delivery/start evidence.

## Canonical refs

- Repository: MaksimUnimax/runtime-fixtures, stable ID 1369117174.
- Health branch: feature/server-health-h3-p8-4.
- Rejected B7A candidate / required R1 base: 592b51da31ab5ecfd0e4d4b3e981897849731614.
- Candidate tree: 1e4737933665a6ba6d02e491e7873d3f40e47e6f.
- Candidate parent / accepted B8 non-live head: 90c1e0c66a47692634eb652aa1392fdafc1f8f10.
- Main independently rechecked remains bc718cc5c677ad0eb4598e7de3ad766473ff0847.
- I1 integration branch remains 076af64efbcdfdc67aec8713969c31c276a90b2d; PR9/C2.2-A remain open/blocked at their current gates and reserved docs/README.md conflict.
- S1.1 is already merged/accepted. Main roadmap still requires a new explicit owner decision before S1.2, so S1.2 is not started implicitly.

## Preserved accepted Health state

P8.4 B1-B6 remain accepted in their recorded bounded scopes.

B8 non-live final readiness is ACCEPTED in its explicitly bounded scope on 90c1e0c66a47692634eb652aa1392fdafc1f8f10. Exact-head B8 Server CI run 35105136595 / job 104824258928 completed SUCCESS. B8 established P8.4_NONLIVE_FINAL_READINESS=PASS for the pre-B7A source while retaining B7 live blocked/not-run, P8.4 NOT_ACCEPTED and P8.5 NOT_STARTED.

## B7A candidate facts

SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01 published normally fast-forward from B8 to:

- head 592b51da31ab5ecfd0e4d4b3e981897849731614;
- tree 1e4737933665a6ba6d02e491e7873d3f40e47e6f;
- parent 90c1e0c66a47692634eb652aa1392fdafc1f8f10.

Independent compare: ahead 1 / behind 0 / merge base exact parent. Exactly the eight authorized B7A paths changed; no unrelated scope changed.

Candidate local evidence reports 119/119 Health unit, 11/11 registry, 5/5 dedicated Chromium, 18/18 focused H3 PostgreSQL, 1526/1526 full integration, 169/169 full E2E, and green lint/format/typecheck/migration/OpenAPI/bridge-guard/build/docs. All auth/session material was synthetic; zero live provider/customer-session calls were reported.

Exact-head Server CI run 35111261064 / job 104845256371 exists on 592b51d... . At this cursor snapshot install/lint/format/typecheck/config-regression/unit/integration/migration/OpenAPI/bridge-guard/build/Chromium were green and E2E was still IN_PROGRESS. This CI is NON-GATING for the current verdict because the architect independently proved a security architecture defect that green CI cannot override.

## B7A verdict — REWORK_REQUIRED

The candidate is NOT accepted.

The strict file-backed loader is correct in isolation but is not runtime-authoritative:

- apps/health-runner root API exports a constructible DedicatedHealthSessionRegistry runtime class and structural DedicatedHealthSessionBinding type;
- public ChromeBrowserDriver accepts a third dedicatedBinding parameter;
- createDedicatedHealthChromeBrowserDriver accepts a DedicatedHealthSessionBinding directly;
- no runtime proof requires that binding to originate from loadDedicatedHealthSessionRegistry;
- the candidate E2E itself fabricates plain standardBinding/workBinding objects and successfully consumes their synthetic storage-state cookie without loader authority;
- launch() feeds binding.storageStatePath to browser.newContext before open() performs target/start-URL mismatch validation.

Therefore a caller can bypass loader lstat/symlink/regular-file/size/POSIX-permission/distinct-state checks and can point the driver at any accessible storage-state file, including an owner/customer session. This violates the dedicated-Health-only/no-customer-session security boundary.

This defect originated in the architect-approved B7A design, which explicitly allowed direct binding construction for the loopback Work test. Codex implemented that design literally. R1 corrects the architecture rather than widening tests around the same bypass.

Detailed review: docs/development/architect-autowork/references/HEALTH_B7A_R1_SECURITY_REVIEW.md.

## Next exact task — B7A R1 capability provenance

Task ID: SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01.
Task file: docs/development/architect-autowork/tasks/HEALTH_B7A_R1_CAPABILITY_PROVENANCE_2026-09-16.md.
Required exact base: 592b51da31ab5ecfd0e4d4b3e981897849731614.

Architect decision:

- loadDedicatedHealthSessionRegistry becomes the sole producer of dedicated-session authority;
- loader-created registry is opaque and branded through module-private WeakMap state;
- sensitive binding/path/startUrl is not exposed through the root API;
- ChromeBrowserDriver public constructor returns to targets + optional launchTimeout only, with no direct session argument;
- browser-driver keeps a module-private WeakMap associating a driver with a trusted hidden binding only when created by the dedicated factory;
- createDedicatedHealthChromeBrowserDriver accepts targets + loader-created registry + target key (+ optional timeout), never binding/path/startUrl;
- forged registry/direct binding/third constructor argument have zero authority;
- Standard positive Chromium proof must use config -> loader -> registry -> factory; old direct loopback Work positive binding is removed because it is the bypass;
- valid Work production route authority remains tested without live navigation; actual Work navigation stays B7 live acceptance.

R1 must first add valid RED regressions proving on exact candidate 592b51d... that a forged factory object and third constructor argument currently inject the synthetic cookie. Only then may production code change. After fix run focused security matrix and one full server acceptance cycle.

Allowed R1 changes are ONLY the same eight B7A paths. No new path, package/dependency, target registry, H2/H3 schema, strategy/profile, contract/API/DB/migration, reserved public documentation, site/SEO/domain/private-control change.

Zero live ChatGPT/provider/marketplace/customer-session calls. B7 live remains NOT RUN. P8.4 remains NOT_ACCEPTED. P8.5 remains NOT_STARTED.

## Broader boundaries

Do not start C2.2-B, S1.2, P8.5, D3, deployment or release. Do not resolve reserved docs/README.md in this stream. Do not edit README.md, AGENTS.md, docs/README.md, CHANGELOG.md, site/SEO/domain/public presentation or private workspace-control.
