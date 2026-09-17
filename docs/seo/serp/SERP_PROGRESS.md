# SEO SERP collection — execution progress

Date: 2026-09-17.  
Branch: `seo/wordstat-batch-01-2026-09-16`.  
Status: **M3 / R08 CLOSED / R09 QUERY-SPECIFIC PRE-STEP RELEASED / LOCAL START NOT YET EXECUTED**.

## Closed Search evidence

```text
S01 ии агенты для маркетплейсов = CLOSED / 20
S02 ии агент для озон = CLOSED / 20
S03 ии агент для wildberries = CLOSED / 20
R01 подключить chatgpt к маркетплейсу = CLOSED / 20
R02 chatgpt для ozon = CLOSED / 20
R03 chatgpt для wildberries = CLOSED / 20
R04 аналитика маркетплейсов для селлеров = CLOSED / 20
R05 отчеты для селлеров маркетплейсов = CLOSED / 20
R06 помощник селлера маркетплейсов = CLOSED / 20
R08 аналитика рекламы маркетплейсов = CLOSED / 20
```

## R08 closure

Query-specific authority: `R08_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md`.

Terminal/export authorities:

- `raw/R08_05_COLLECT_SUCCEEDED_2026-09-17.md`;
- `analysis/R08_05_COLLECT_SUCCEEDED_2026-09-17.md`;
- `raw/R08_06_EXPORT_MANIFEST_2026-09-17.md`;
- `analysis/R08_06_EXPORT_ANALYSIS_2026-09-17.md`.

```text
R08_QUERY = аналитика рекламы маркетплейсов
R08_FAMILY = F6
R08_JOB_ID = octoport-serp-r08-20260917
R08_OPERATION_ID = sprvt6p3aq5uj96uqs0b
R08_REVISION = 5
R08_RESULT_COUNT = 20
R08_DOCUMENT_COUNT = 20
R08_HAS_MORE = false
R08_MISSING_URL_RANKS = []
R08_UNSAFE_URL_RANKS = []
R08_DIRECT_AD_TOOL = 3/20
R08_MIXED_SUITE_WITH_AD_ANALYTICS = 5/20
R08_BROAD_ANALYTICS = 8/20
R08_EDITORIAL = 4/20
R08_AD_EXPLICIT_COMMERCIAL_SOFTWARE = 8/20
R08_TOP10_AD_EXPLICIT_SOFTWARE = 5/10
R08_MORE_F6_SEARCH_NOW = NO
R08_MARKETPLACE_SPECIFIC_PAIR = HOLD
R08_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R08_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R08 = CLOSED FOR CURRENT M3 PASS
```

No further R08 `start`, `submitN`, `collectN` or `exportPage` is permitted for the current accepted job/revision.

## R09 current state

Query-specific authority: `R09_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md`.

```text
R09_QUERY = поисковые запросы wildberries для продавца
R09_FAMILY = F7
R09_JOB_ID = octoport-serp-r09-20260917
R09_RELATION = control against R10
R09_PRE_STEP = PASS / PERSISTED
R09_PRE_STEP_REMOTE_READBACK = REQUIRED BEFORE PHYSICAL START
R09_EXISTING_START_CONFLICT = NONE
R09_LOCAL_START = RELEASED EXACTLY ONCE / NOT YET EXECUTED
R09_SUBMIT = NOT RELEASED
R09_COLLECT = NOT RELEASED
R09_EXPORT = NOT RELEASED
R10 = BLOCKED UNTIL R09 COMPLETE EXPORT + READBACK + ALL-RESULT ANALYSIS
```

Fresh R09 research confirms two distinct first-party WB seller-data meanings which must remain separate during SERP coding:

- seller-owned product search-performance/report data (`Поисковые запросы: ваши товары`), including an official WB Analytics API surface;
- marketplace-wide user search-demand data (`Поисковые запросы на WB`).

Buyer search/navigation, seller SEO education, third-party keyword/rank tools, external competitor intelligence and niche analysis remain explicit boundaries rather than assumed synonyms.

## Current hard gate

```text
CURRENT_STAGE = M3 ORDINARY YANDEX SERP COLLECTION
CURRENT_QUERY = R09
R08 = CLOSED
R09_QUERY_SPECIFIC_PRE_STEP = RELEASED / PERSISTED
R09_PRE_STEP_READBACK = REQUIRED BEFORE EXECUTION
R09_START_ALLOWED = EXACTLY ONE LOCAL START AFTER READBACK
R09_SUBMIT_ALLOWED = NO
R09_COLLECT_ALLOWED = NO
R09_EXPORT_ALLOWED = NO
R10 = BLOCKED
R07 = BLOCKED BY MATRIX ORDER UNTIL R09/R10 COMPLETE
R11 = BLOCKED
R12 = BLOCKED
M7_COLLECTION_FREEZE = BLOCKED
M8_SEMANTIC_MASTER = BLOCKED
NEXT_PHYSICAL_ACTION = AFTER REMOTE READBACK, EXECUTE EXACTLY ONE R09 LOCAL START AND RETURN THE COMPLETE ENVELOPE
```

## Exact released command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r09-20260917","queries":["поисковые запросы wildberries для продавца"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

This command releases only local job creation. The returned envelope must be persisted and remotely read back before any `submitN` decision.