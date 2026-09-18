# LEVEL 2 — M13-M18 technical implementation, launch, measurement and close

Status: ACTIVE
Date: 2026-09-18
KW-002 analogs: Step19-22 where applicable; M13/M14/M16 have additional Octoport implementation responsibilities not present in KW-002.

Fresh current official technical sources are mandatory before each execution stage. Stored URLs are a base, not permission to skip refresh.

## M13 — technical SEO specification

Purpose:
freeze technical requirements before code mutation.

Current source classes:
OFFICIAL_YANDEX and OFFICIAL_GOOGLE first.

Required topics:
- canonical origin and rel=canonical behavior;
- HTTP status/redirect rules;
- robots.txt;
- Sitemap;
- YandexAdditionalBot policy;
- crawlable regular links / no orphans;
- indexable main content/rendering;
- unique Title/H1/description boundaries;
- duplicate/thin/service URL handling;
- mobile usability;
- performance/CWV where applicable;
- Open Graph separate from Search metadata;
- truthful structured data only when visible content/product supports it;
- Yandex + Google compatibility.

Yandex canonical is a recommendation and duplicate handling must not rely on it blindly. Structural URL changes require redirect planning.

PASS:
every requirement is current-source-backed, maps to an M11/M12 need or general crawl/index necessity, and has a testable acceptance check.

## M14 — bounded production implementation

Purpose:
implement accepted M11-M13 authorities without architecture or parallel-work drift.

Before patch:
- fetch current main/current implementation branch;
- inspect parallel site/server/extension changes;
- identify exact files/routes affected;
- reconcile any source drift against accepted specs;
- freeze do-not-change boundary;
- define tests.

Rules:
- SEO stream does not rewrite server/extension behavior;
- no unsupported product copy;
- no route/page not authorized by M11/M12;
- no silent technical requirement downgrade;
- no force-push;
- code change != accepted deployment.

Output:
bounded implementation commit/PR + exact changed-file map + tests.

PASS:
spec->source parity, tests, no unrelated changes, current-main reconciliation and review pass.

## M15 — source / predeploy / live QA

KW-002 analog: Step20 exact-file QA.

Purpose:
prove that implementation artifacts actually match accepted authority.

Check:
- route/page existence;
- visible page/spec parity;
- Title/H1/meta;
- canonical;
- HTTP/redirect;
- robots/Sitemap;
- main-content render/indexability;
- crawlable links/no orphan;
- structured data truth;
- mobile;
- performance material defects;
- thin/duplicate pages;
- unsupported/fake claims;
- broken links/assets;
- environment/live differences.

~~~text
ARTIFACT EXISTS != QA PASS
BUILD PASS != SEO PASS
DEPLOY SUCCESS != LIVE QA PASS
~~~

PASS:
all blocking source/predeploy/live defects closed or explicit HOLD with launch decision.

## M16 — launch + indexing verification

Purpose:
verify actual live/search discovery state after deployment.

Current Yandex evidence may include:
- Webmaster ownership;
- crawl statistics;
- Searchable pages/indexing status;
- Sitemap/robots processing;
- URL checks/reindex tools where appropriate;
- crawl/coverage/exclusion errors.

Rules:
- page deployed != page indexed;
- indexed != ranking for target query;
- delayed Webmaster data != failure;
- canonical/robots/Sitemap live state must be checked, not inferred from source branch.

Output:
launch/indexing ledger with URL-level status and blockers.

PASS:
canonical targets live/discoverable, critical crawl/indexability errors = 0, measurement surfaces ready, unresolved delays distinguished from actual defects.

## M17 — measurement + controlled iteration

KW-002 analog: Step21 adapted to live SEO.

Measure with source/date/segment provenance:
- Yandex queries, impressions, clicks, CTR, pages/positions where provided;
- region/device where relevant;
- Webmaster market/query data;
- Alice visibility/Share of Voice and source examples when available;
- Google Search Console;
- approved conversion signals;
- recurring bounded SERP controls for critical hypotheses.

Every optimization:
hypothesis -> exact change -> observation window -> metric/result -> decision.

Do not rewrite continuously without a measurable hypothesis.

Algorithm/market changes can reopen older decisions; preserve history.

PASS:
measurement taxonomy and baselines are durable; changes are attributable; no unsupported causal claim.

## M18 — finished-product acceptance / close

KW-002 analog: Step20 + Step22.

Finished means launch product + reopen/measurement loop are operational, not that SEO can never change.

Required:
- current authorities recoverable from GitHub;
- M0-M13 accepted;
- priority implementation accepted;
- M15 live technical QA accepted;
- M16 indexing/launch surfaces ready;
- no critical product-truth conflict;
- no critical crawl/indexability defect;
- no high-value semantic/page-ownership blocker for launch;
- owner-facing final package understandable;
- measurement/reopen loop documented;
- open blocking actions = 0.

~~~text
FINAL_ARTIFACTS_EXIST != FINISHED
OPEN_BLOCKING_ACTIONS > 0 -> NOT FINISHED
~~~

PASS:
FINAL_STATUS_TRUTH = COMPLETE for the launch SEO product, with future measurement/reopen conditions explicit.
