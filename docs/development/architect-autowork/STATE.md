# Server / I1 / Health current cursor — 2026-09-16

Current: HEALTH_P8_4_B8_NONLIVE_READINESS_ACCEPTED / HEALTH_B7A_DEDICATED_SESSION_PROVISIONING_PREPARED_FOR_SINGLE_FINAL_SUBMISSION / HEALTH_B7_LIVE_BLOCKED_INTERNAL_AND_EXTERNAL / P8_4_NOT_ACCEPTED / P8_5_NOT_STARTED / I1_C2_2A_OPEN_BLOCKED.

Owner continuous autowork is active. One architect and one sequential Codex executor only. SA-HEALTH-B8-PROCESS-R1-20260916-01 / canonical B8 terminal has been received and independently reviewed. No implementation executor is claimed running at this snapshot. Saving B7A is preparation, not delivery/start evidence.

## Canonical refs

- Repository: MaksimUnimax/runtime-fixtures, stable ID 1369117174.
- Health branch: feature/server-health-h3-p8-4.
- Accepted B8 non-live evidence head / required B7A base: 90c1e0c66a47692634eb652aa1392fdafc1f8f10.
- B8 tree: 447d6515954e051a287011596fdd3154e11c2561.
- B8 parent / accepted B6 head: 697eea7adc337e1f11def16818829c2e443efb15.
- P8.4 pre-B1 comparison base: de41f33646d5dd61bcae66624225e16538fd8f3a.
- Main remains bc718cc5c677ad0eb4598e7de3ad766473ff0847 at the latest architect check. Preserve parallel public-doc/site/SEO/domain changes.
- I1 integration branch remains 076af64efbcdfdc67aec8713969c31c276a90b2d; PR9 remains open/draft/mergeable=false and C2.2-A remains OPEN/BLOCKED at its current gates plus reserved docs/README.md conflict.
- Main roadmap records S1.1 merged/accepted. S1.2 remains deferred until I1-sync plus a new explicit owner decision, so this stream must not start S1.2 implicitly.

## Accepted B6

SA-HEALTH-B6-SPDR-R1-20260916-01 and P8.4/B6 are ACCEPTED on 697eea7adc337e1f11def16818829c2e443efb15.

Exact-head Server CI run 35101822297 / job 104812875780 / SUCCESS. B6 changed exactly three evidence-only paths, SPDR-01..11 passed, focused 98/98 unit/security, 18/18 PostgreSQL and 92/92 local Chromium all passed with zero required skips, and zero live provider/customer-session calls occurred.

Review: docs/development/architect-autowork/references/HEALTH_B6_FINAL_REVIEW.md.

## B8 non-live final-readiness verdict

SA-HEALTH-B8-NONLIVE-FINAL-READINESS-20260916-01: ACCEPTED in its explicitly non-live scope.

- P8.4_NONLIVE_FINAL_READINESS = PASS for the pre-B7A source represented by 90c1e0c66a47692634eb652aa1392fdafc1f8f10.
- B8_FULL_P8_4_ACCEPTANCE = BLOCKED_B7_LIVE.
- P8.4 overall = NOT_ACCEPTED.
- P8.5 = NOT_STARTED.

Independent B6->B8 compare is ahead by 1 / behind 0 / merge base B6. B8 changes exactly three evidence-only paths and no production/test/package/workflow/migration/schema/API/fixture/extension/reserved/private path.

The stale-host-process recovery was independently reviewable from sanitized evidence: exactly two >7-day unrelated process groups were separated from the current executor ancestry/session/process group, held no ambiguous Git lock and contained no active Codex/Bridge/git/ssh/docker/postgres/browser/deploy/release process. Both exact groups terminated on SIGTERM, no SIGKILL was needed, no respawn occurred, protected executor ancestry remained alive, and repository HEAD/tree/worktree were unchanged. No pkill/killall/pattern kill/reboot/service restart/lock deletion/reset/rebase/stash/cherry-pick/amend/force operation was used.

B8 evidence FR-01..FR-11 is internally consistent with the accepted B1-B6 state. It records the full pre-B1 de41f336... -> accepted B6 697eea7... chain as ahead 28 / behind 0 and a bounded Health/test/evidence changed-path set with no unrelated forbidden scope or actual secret/raw customer/provider data.

Exact-head B8 Server CI:

- run 35105136595;
- job 104824258928;
- head 90c1e0c66a47692634eb652aa1392fdafc1f8f10;
- conclusion SUCCESS;
- install, lint, format, typecheck, Playwright-config regression, unit, PostgreSQL integration, db:migrate, openapi:check, bridge:guard, build, Chromium install, E2E, post steps and cleanup all SUCCESS;
- frozen import is conditionally skipped on the feature branch and is not a failure.

The self-referential B8 results.json publication fields that remained PENDING_COMMIT/PENDING_PUSH are not final authority; GitHub remote readback plus the exact-head CI above are authoritative.

Detailed review: docs/development/architect-autowork/references/HEALTH_B8_FINAL_REVIEW.md.

## B7 architecture correction discovered after B8

The prior cursor described B7 as external-only. Independent post-B8 review proved that classification incomplete.

Normative docs/server/HEALTH_SYSTEM.md requires dedicated controlled test accounts/browser profiles, session/profile secrets outside Git and a reauthentication runbook. Current P8 roadmap scope includes the controlled Chrome runner and P8.4 specifically owns ChatGPT Standard/Work H3 + sanitized evidence.

Current accepted product source lacks the sanctioned mechanism required for authenticated live H3:

- ChromeBrowserDriver always launches a fresh empty browser.newContext() with no dedicated Health auth-state provisioning input;
- Work identifyApprovedSurface requires a bound project/conversation route;
- packaged Work target opens only https://chatgpt.com/;
- there is no trusted local-only mechanism to supply dedicated Health auth state plus the dedicated Work start route without broadening remote/generic browser authority.

Therefore current accurate state is:

B7_CONTROLLED_LIVE_H3 = BLOCKED_INTERNAL_PROVISIONING_AND_EXTERNAL_DEDICATED_ACCOUNT.

The internal portion is independently implementable now. It must be completed before asking the owner for final dedicated Health session files / Work route for the actual live run.

## Next exact task — B7A

Task ID: SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01.
Task file: docs/development/architect-autowork/tasks/HEALTH_B7A_DEDICATED_SESSION_PROVISIONING_2026-09-16.md.
Required exact base: 90c1e0c66a47692634eb652aa1392fdafc1f8f10.

Accepted architecture:

- every run remains a fresh EPHEMERAL_CONTROLLED browser/newContext;
- no persistent userDataDir and no customer/owner ordinary browser profile reuse;
- an explicitly dedicated Health context may preload Playwright storageState from an owner-only local file outside Git;
- configuration is a strict trusted local file, never H2/H3 plan/remote/API input;
- Standard keeps packaged root start URL;
- Work may receive one local-only start URL but only exact approved ChatGPT origin, no credentials/query/hash and a route accepted by the existing parseWorkRoute authority;
- binding is target-specific and browser driver independently enforces target/origin/route rules before navigation;
- no raw Page/Browser/Context/Locator/CDP exposure, selector/script/prompt/action expansion or login/CAPTCHA automation;
- session/config paths, Work route and storage-state contents never enter Health results/evidence/logging;
- reauthentication is an explicit out-of-band operator replacement of the dedicated Health state file; runtime never writes refreshed auth state.

B7A adds the strict dedicated-session registry, browser-driver binding/factory, synthetic unit/security tests and a real Chromium local-only session-injection regression. It makes ZERO live ChatGPT/provider/marketplace calls.

Because B7A changes the security attack surface after B6/B8, it must run B6-equivalent focused security/privacy regressions plus one full exact-source server cycle. Historical B6/B8 evidence remains valid for its original source but cannot substitute for acceptance of the new provisioning code.

After B7A architect/exact-head CI acceptance, the remaining B7 external prerequisite will be owner-provisioned dedicated Health auth state/config for Standard and Work plus an approved dedicated Work project/conversation route, all outside Git. Only then may the actual controlled live B7 behavioral smoke run.

P8.4 remains NOT_ACCEPTED and P8.5 remains NOT_STARTED throughout B7A.

## Broader boundaries

Do not start C2.2-B, S1.2, P8.5, D3, deployment or release. Do not resolve reserved docs/README.md in this stream. Do not edit README.md, AGENTS.md, docs/README.md, CHANGELOG.md, site/SEO/domain/public presentation or private workspace-control.