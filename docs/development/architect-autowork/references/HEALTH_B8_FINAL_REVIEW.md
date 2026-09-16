# Health P8.4 / B8 — non-live final-readiness architect review

Date: 2026-09-16
Canonical repository: MaksimUnimax/runtime-fixtures (ID 1369117174)
Product branch: feature/server-health-h3-p8-4

## Verdict

SA-HEALTH-B8-NONLIVE-FINAL-READINESS-20260916-01: ACCEPTED in its explicitly non-live scope.

- P8.4_NONLIVE_FINAL_READINESS = PASS.
- B8_FULL_P8_4_ACCEPTANCE = BLOCKED_B7_LIVE.
- P8.4 overall = NOT_ACCEPTED.
- P8.5 = NOT_STARTED.

This acceptance does not waive, skip or accept B7.

## Exact Git identity and diff

Accepted B8 evidence head: 90c1e0c66a47692634eb652aa1392fdafc1f8f10
Tree: 447d6515954e051a287011596fdd3154e11c2561
Parent / accepted B6 head: 697eea7adc337e1f11def16818829c2e443efb15

Independent compare 697eea7... -> 90c1e0c... is ahead by 1, behind by 0, merge base exactly 697eea7. Exactly three changed paths are present and all are the B8 evidence allowlist:

- docs/server/B8_P8_4_NONLIVE_FINAL_READINESS_2026-09-16.md
- docs/server/evidence/health-b8-final-readiness-2026-09-16/README.md
- docs/server/evidence/health-b8-final-readiness-2026-09-16/results.json

No production, test, package, workflow, migration, schema, API, fixture, extension, reserved public-entrypoint, site/SEO/domain or private-control path changed in B8.

The evidence JSON retains PENDING_COMMIT/PENDING_PUSH self-reference placeholders because the file cannot know the later commit SHA that contains itself. This is not the publication authority. GitHub remote ref/readback and exact-head CI below are authoritative.

## Stale-process recovery review

The first B8 attempt stopped before changes because two old package/validation process groups were present. The accepted recovery evidence records the current executor ancestry separately and classifies both groups by PID/PPID/PGID/SID/start time/elapsed time/cwd/command ancestry, not by process-name pattern.

Both groups were older than seven days, separated from the current executor session/process-group/ancestry, contained no active Codex/Bridge/git/ssh/docker/postgres/browser/deploy/release process and held no ambiguous Git lock. Both were terminated by SIGTERM to their exact verified process groups. No survivor required SIGKILL, no respawn was observed, the protected executor ancestry remained alive, and product HEAD/tree/worktree were unchanged. No pkill/killall/pattern kill/reboot/service restart/lock deletion/reset/rebase/stash/cherry-pick/amend/force operation was used.

## Final-readiness matrix

Independent source/evidence review found FR-01 through FR-11 internally consistent with the accepted B1-B6 state:

- accepted B1-B6 stage chain and evidence is remotely present;
- de41f33646d5dd61bcae66624225e16538fd8f3a -> accepted B6 697eea7... is linear (ahead 28 / behind 0, merge base de41f336) and its changed paths stay within Health runner/test/evidence support scope;
- closed semantic H3 vocabulary, common engine, distinct Standard/Work profiles/strategies, mismatch fences, one-Send/no-resend, terminal cleanup, bounded failures, controlled navigation and no generic browser executor remain present;
- B6 SPDR security/privacy properties remain valid for the accepted B6 source;
- deterministic Standard/Work fixtures remain production-semantic mirrors with isolation/drift/completion/code-Copy negative coverage;
- B5 strict C01-C13 mapping, independent C09-C12 durability, failed C11 selected fallback provenance, BROKEN classifier result, timestamp instant chronology and PostgreSQL isolation remain present;
- accepted B6 exact-head CI/evidence and source blob readback are remote;
- no actual credential/cookie/token/storage/customer/seller/raw conversation/DOM/provider payload was found in B8 evidence or the bounded P8.4 audit;
- zero live ChatGPT/provider/marketplace/customer-session calls were made in B8.

## Exact-head CI

Server CI run: 35105136595
Server job: 104824258928
Exact head: 90c1e0c66a47692634eb652aa1392fdafc1f8f10
Conclusion: SUCCESS

Install, lint, format, typecheck, Playwright-config regression, unit, PostgreSQL integration, db:migrate, openapi:check, bridge:guard, build, Chromium install, E2E, post steps and container cleanup all completed successfully. The feature-branch frozen-import step is conditionally skipped and is not an acceptance failure.

## Post-B8 B7 architecture correction

B8 correctly recorded the then-known live prerequisite, but independent architect review after publication found that B7 is not only waiting on an external dedicated account.

Normative docs/server/HEALTH_SYSTEM.md requires dedicated controlled test accounts/browser profiles, session/profile secrets outside Git, a reauthentication runbook, minimal benign conversations and account/session cleanup. P8 roadmap scope includes controlled Chrome H3 and P8.4 is specifically Standard/Work H3 + sanitized evidence.

Current accepted source does not yet provide the production mechanism needed to consume that dedicated identity safely:

- ChromeBrowserDriver always creates a fresh empty browser.newContext() and has no dedicated-health storage/profile provisioning input;
- Work strategy requires a bound project/conversation route before surface identification;
- packaged Work target opens only https://chatgpt.com/;
- there is no local trusted mechanism to supply an authenticated dedicated Health session plus the dedicated Work start route without adding raw generic browser/login authority.

Therefore the accurate B7 state after this review is:

B7_CONTROLLED_LIVE_H3 = BLOCKED_INTERNAL_PROVISIONING_AND_EXTERNAL_DEDICATED_ACCOUNT.

The internal part is independently implementable and must be done next. The external dedicated account/session/config remains required only for the later actual live run.

## Accepted architectural direction for B7A

Add a trusted local dedicated-Health session provisioning boundary without customer-session reuse or login automation:

- keep each run a fresh EPHEMERAL_CONTROLLED browser/context;
- optionally preload Playwright storageState from a dedicated Health state file located outside Git;
- load only from a strict local file configuration, never from H3 plan/remote payload/API;
- require absolute regular non-symlink config/state files and restrictive POSIX permissions where applicable;
- never read/log/persist storage-state contents into Health evidence;
- Standard keeps its packaged https://chatgpt.com/ start URL;
- Work may receive one local-only start URL, but it must be same approved ChatGPT origin and satisfy the already-packaged Work project/conversation route parser; query/hash/credentials are forbidden;
- a session binding is target-specific and cannot be reused for the other target;
- browser navigation policy, one-Send engine, target/surface/profile fences and sanitized result schemas remain unchanged;
- no login/CAPTCHA/anti-bot automation is added.

After this code change the old B6/B8 exact-source proofs remain historical evidence for the pre-B7A source; the new attack surface must receive targeted security regression plus exact-head full CI before live B7 can run.

The remaining external prerequisite after B7A will be owner provisioning of the dedicated Health state/config files and an approved dedicated Work conversation/project route. No secret values belong in Git or terminal evidence.