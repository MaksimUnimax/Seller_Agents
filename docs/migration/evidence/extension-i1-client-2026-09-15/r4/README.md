# I1-C1 R4 evidence

Task `SA-I1-C1-R4-20260915-01`. This is an implementation candidate for architect review; PR #7 remains draft and unmerged.

Starting head/tree were independently checked as `e26fcc7dd60617838cb9a49d7c6560018cb45ec3` / `c1beb4927fee66c4065e133c960929e800fabe5e`; main was `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`. The remote feature ref was unchanged at the pre-work check. The final local candidate SHA/tree are recorded in the terminal report.

R4-1 is GREEN on source and extracted runtime. The bounded-body classifier now denies oversized successful 200/201/206 responses, preserves transient 503 and final 401/403 invalidation, and the browser verifier uses the exact shared SemVerV1 grammar with length 1–64. Actual signed fixtures cover combined prerelease/build, build-neutral precedence, alpha.2/alpha.10, release/prerelease, hyphenated and numeric/text prereleases, malformed metadata, browser 120.0.0.0/120.0.0.1, zero-padded component shape, leading-zero, and range controls. The starting-head RED probes were retained: oversized 201/206 remained Work-allowed and combined prerelease/build was rejected by the old verifier regex.

R4-2 is GREEN on source and extracted runtime. Actual same-worker owner barriers cover held start, refresh, expired-token bootstrap, no-authority recovery, and signed bad-key/schema invalidation. Composed Ozon and WB denial cases hold the first provider response, deny authority, fail cleanup writes, and prove no second provider dispatch, delivery advertisement, insert, send, or control-plane guard traffic. Existing same-worker singleflight/lost-response controls remain wired.

R4-3 is GREEN on source and extracted common-core routes: the ten aliases retain exact-once positive events, add zero `MANUAL_BATCH_FAILED` and `BATCH_PROCESSOR_UNCAUGHT`, and assert Performance-only versus Seller-only request/auth identity with fingerprint `cd4bce38`. The 0.2.3 popup-sender adaptation is restored exactly; 0.2.4 uses the composed fixture route. Frozen RED/donor source remains unchanged.

R4-4 fixture setup is implemented only in the installed test entrypoint. It creates exactly two existing ACTIVE users/accounts/OWNER memberships/verified email identities in one transaction, requires loopback PostgreSQL, and proves beta mode/capacity/admitted unchanged. The prescribed local run is BLOCKED before this setup can execute because `pnpm db:migrate` received `ECONNREFUSED 127.0.0.1:45493`; the host had no available disk and existing shared PostgreSQL containers were not touched. The bounded failure artifact records stage `database_migrate`, status `FAIL`, and allowlisted code `DATABASE_MIGRATION_FAILED` without raw database output.

The required remote job supplied for this gate is [run 34969687336, job 104382641739](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34969687336/job/104382641739). GitHub API access from this environment returned HTTP 404 for the private repository endpoint, so remote status and checkout SHA are not independently asserted here. WB browser jobs, both I1 jobs, and Documentation CI remain architect/CI obligations; no all-green claim is made.

No production auth/DB/portal change, shared schema/migration change, I1-SRV.5, C2/offline, D3, S1.2, Health/P8, provider call, dependency, release, or deployment change is included.
