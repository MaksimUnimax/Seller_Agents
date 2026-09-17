# R04 pre-step research and bounded release — `аналитика маркетплейсов для селлеров`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F3+F9 analytics boundary`.  
Status: **PREPARED / PASS CANDIDATE / OWNER-FACING SOURCE DISCLOSURE REQUIRED BEFORE FIRST START**.

## 1. Current cursor

Accepted state:

```text
M2R = ACCEPTED WITH MAIN CHAT CORRECTIONS
S01-S03 = CLOSED
R01 = CLOSED / 20
R02 = CLOSED / 20
R03 = CLOSED / 20
F2_PAIRED_VERDICT = F2_MIXED_SHARED_CORE_PLUS_MARKETPLACE_DEPTH
F2_ORDINARY_SEARCH_INFORMATION_SATURATED = YES
NEXT_CANDIDATE = R04
M7 = BLOCKED
M8 = BLOCKED
```

Current query authority: `M3_QUERY_MATRIX_2026-09-17.md`.

## 2. Product-truth boundary

Octoport's launch data surface is primarily seller-authorized marketplace data/tools, not an unrestricted external-market intelligence warehouse.

Canonical mechanism remains:

`user-selected supported AI -> Octoport -> authorized Ozon/Wildberries data/tools -> same AI works as seller employee/helper`.

R04 must therefore distinguish:

- analytics of the seller's own store/account/data;
- native marketplace seller analytics/reports;
- external market/niche/competitor intelligence;
- analytics SaaS/service discovery;
- educational/professional intent.

Search evidence cannot silently expand Octoport into competitor/niche intelligence where capability/source authority is absent.

## 3. Query identity

```text
QUERY_ID = R04
QUERY_TEXT = аналитика маркетплейсов для селлеров
FAMILIES = F3, F9
JOB_ID_PLANNED = octoport-serp-r04-20260917
RELATION = analytics control; paired conceptually with R05 reports
```

## 4. Exact open decision

What does current Yandex Search mean by the broad seller phrase `аналитика маркетплейсов для селлеров`?

Primary alternatives to measure:

1. seller-owned/internal store analytics: orders, sales, funnel, stock, finance, ads, search queries, product metrics;
2. external market intelligence: niches, competitor sales/prices/strategies, total-market demand;
3. mixed analytics SaaS combining internal and external data;
4. service/consulting/audit discovery;
5. education/course/profession/job content;
6. generic marketplace-management content or other noise.

This query does not create a final page or authorize external-intelligence claims.

## 5. Why existing evidence is insufficient

M2R Wordstat confirmed live analytics demand, but Wordstat cannot resolve which data class or page type dominates Search.

R01-R03 resolved own-ChatGPT/connector intent, not analytics category ownership. Their manual-report/analysis results prove that sellers use AI over marketplace data, but they do not establish what users expect from the unqualified word `аналитика`.

R04 therefore has high boundary value: it can determine whether Octoport-addressable seller-owned analytics is a major Search intent or whether broad SERP demand is dominated by external-intelligence platforms.

```text
R04_REDUNDANT_WITH_F2 = NO
R04_INFORMATION_GAIN = HIGH
```

## 6. Fresh external research — 2026-09-17

### R04-Y1 — current Yandex WebSearchAsync request contract

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`

Current docs confirm the asynchronous request accepts query text, RU search type, family mode, page, typo mode, sort, grouping, region, localization and response format.

Method use: preserve exactly the same first-page comparison settings used by S01-S03/R01-R03. Only query/job identity changes.

### R04-Y2 — current deferred lifecycle

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`

Current docs confirm the deferred operation model. Main Chat continues to require exactly-once submission, persistent operation identity, bounded collect, and no interpretation of not-due/pending as zero demand.

### R04-WB1 — official Wildberries seller analytics API

Official WB API current analytics documentation:

`https://dev.wildberries.ru/openapi//analytics`

The current Analytics section explicitly covers seller-owned analytics/data including:

- sales funnel;
- search queries for the seller's own products;
- stock history/current stock reporting;
- seller analytics in CSV/report lifecycle form.

Method use: classify results around seller-owned/native analytics separately from external market intelligence.

### R04-WB2 — official WB capability/access boundary

Official WB API information:

`https://dev.wildberries.ru/docs/openapi/api-information`

Current documentation identifies Analytics as an API category, lists seller analytics/search/stock/report methods, and supports a read-only token permission. The WB developer homepage separately describes `Аналитика и данные` as search queries for your products, stock history and sales funnel.

Method use: treat native seller-data analytics as capability-grounded and distinguish it from market-wide competitor/niche claims.

Boundary: official WB analytics capability does not imply access to the entire market's private seller data.

### R04-OZ1 — official Ozon seller-owned search analytics

Official Ozon Seller/Bestseller source:

`https://seller.ozon.ru/media/news/novaya-analitika-po-zaprosam-tovarov/`

Ozon documents the seller-cabinet tool `Запросы моего товара`, including queries that produced views/sales, search visibility/position and order revenue attributable to those queries.

Method use: preserve an Ozon seller-owned/product-search analytics bucket.

Boundary: this first-party seller analytics is not equivalent to external niche/competitor intelligence.

### R04-OZ2 — official Ozon promotion analytics example

Official Ozon Seller/Bestseller source:

`https://seller.ozon.ru/media/news/ocenivajte-effektivnost-vashih-promokodov/`

Ozon documents analytics over the seller's own promotions/promocodes, including orders, conversion, sales value and discount metrics.

Method use: reinforce the seller-owned/internal analytics class rather than treating all `аналитика маркетплейсов` as market-intelligence software.

### R04-M1 — current market language explicitly separates internal and external analytics

Current MPSTATS official surface:

`https://mpstats.io/`

The platform currently exposes both:

- external analytics: demand, market, competitors, niches, prices/strategies;
- internal seller-cabinet analytics: the seller's own sales/business indicators.

Method use: code internal vs external analytics as separate intent/data classes even when one SaaS page offers both.

Boundary: MPSTATS claims and external-data collection methods do not establish Octoport feature parity.

### R04-M2 — external analytics as a recognized seller-service category

Yandex Market partner editorial surface:

`https://partner.market.yandex.ru/chtojournal/finance-on-marketplaces_obzor_servisov/`

The article describes analytics services for sellers around market demand, seasonality, competitors and assortment/product selection, illustrating that the broad phrase can lead to external market-intelligence/service-discovery intent.

Method use: preserve `EXTERNAL_MARKET_INTELLIGENCE` and `ANALYTICS_SAAS_MIXED` classes during R04 coding.

## 7. Source -> method trace

| Question | Evidence | R04 use | Boundary |
|---|---|---|---|
| Is current Yandex async request shape stable? | Yandex WebSearchAsync docs | preserve comparable top-20 controls | provider docs != Bridge proof |
| How handle deferred completion? | Yandex operation docs | exactly-once operation lifecycle | pending/not-due != zero |
| Does native seller analytics exist on WB? | official WB analytics/API docs | seller-owned/native analytics class | not full external market intelligence |
| Does native seller analytics exist on Ozon? | official Ozon seller analytics surfaces | seller-owned/product/promo analytics class | not competitor/niche authority |
| Is external analytics a distinct current seller product class? | MPSTATS official + Yandex Market editorial | external-intelligence/SaaS classes | third-party claims != Octoport truth |
| Why Search now? | M2R + current matrix | measure dominant live intent/page types | no page decision yet |

## 8. Full-result coding plan

Every normalized organic result will be coded with:

```text
rank
url/domain/title/snippet/modtime
page type = product/landing/tool/category/article/guide/course/service/agency/job/noise
marketplace scope = WB/Ozon/multi/generic
user = seller/operator/analyst/agency/student/job-seeker/other
data ownership = seller-owned / external-market / mixed / unclear
analytics scope = sales/orders/stock/finance/search/ads/funnel/unit economics/niche/competitor/prices/etc
source mechanism = native marketplace / API-connected SaaS / public-market parsing / consulting/manual / unclear
commercial intent = SaaS/tool/service/education/editorial
Octoport launch fit = direct / adjacent / boundary / noise
```

Primary non-overlapping classes planned:

- `SELLER_OWNED_INTERNAL_ANALYTICS`;
- `EXTERNAL_MARKET_INTELLIGENCE`;
- `MIXED_INTERNAL_EXTERNAL_ANALYTICS_SAAS`;
- `ANALYTICS_SERVICE_OR_CONSULTING`;
- `ANALYTICS_EDUCATION_OR_PROFESSION`;
- `GENERIC_SELLER_ANALYTICS_CONTENT`;
- `NOISE_OTHER_INTENT`.

Actual evidence controls final coding; planned classes are not quotas.

## 9. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export all normalized rows; analyze all rows; determine dominant data-ownership/page-type mix; identify recurring Search competitors/surfaces; decide whether R05 remains necessary (expected yes because `отчеты` has a different accounting/statutory contamination question).

### VALID ZERO

Weakens this exact formulation only; does not erase F3 analytics demand or marketplace native analytics capability. Preserve zero and do not substitute Wordstat assumptions.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry.

## 10. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = аналитика маркетплейсов для селлеров
searchType = SEARCH_TYPE_RU
region = 225
page = 0
groupsOnPage = 20
docsInGroup = 1
groupMode = GROUP_MODE_FLAT
familyMode = FAMILY_MODE_MODERATE
fixTypoMode = FIX_TYPO_MODE_OFF
sortMode = SORT_MODE_BY_RELEVANCE
sortOrder = SORT_ORDER_DESC
maxRequests = 1
maxCostRub = 0.0305
jobId = octoport-serp-r04-20260917
```

This is the same bounded first-page surface as prior M3 queries, not full Search coverage.

## 11. Bridge capability

Accepted S01-S03/R01-R03 evidence establishes:

```text
start = local job creation, no provider call in accepted pattern
submitN count=1 = one provider submission when accepted
accepted operation id persists
collectN may locally return NO_DUE_OPERATIONS without provider call
later provider-backed collect retrieves same operation
exportPage is revision-bound
```

Provider documentation and Bridge implementation evidence remain separate authorities.

## 12. Persistence contract

Planned lifecycle begins:

- `raw/R04_01_START_2026-09-17.md`;
- `analysis/R04_01_START_2026-09-17.md`;
- sequential submit/collect/export artifacts after each gate;
- final export persisted losslessly with source hash/size and remote readback;
- full semantic analysis only after raw persistence/readback PASS.

Every lifecycle response must be persisted/read back before the next provider action.

## 13. Work trigger

One top-20 query remains safe for complete Main Chat review.

```text
WORK_TRIGGER_FOR_R04 = NOT MET
```

No sampling is allowed.

## 14. Existing-job conflict check

Immediately before this pre-step, repository readback for:

`docs/seo/serp/raw/R04_01_START_2026-09-17.md`

returned `404 Not Found`.

```text
R04_EXISTING_DURABLE_START_ARTIFACT = NONE
```

The actual first Bridge start response remains authoritative for local job state.

## 15. Hard gates

```text
M2R_MAIN_CHAT_RETURN_QA = PASS
R01_R03_F2_BLOCK = CLOSED
F2_ORDINARY_SEARCH_INFORMATION_SATURATED = YES
CURRENT_M3_MATRIX = PASS
R04_INFORMATION_GAIN = HIGH
FRESH_YANDEX_METHOD_RESEARCH = PASS
FRESH_OFFICIAL_WB_ANALYTICS_RESEARCH = PASS
FRESH_OFFICIAL_OZON_ANALYTICS_RESEARCH = PASS
CURRENT_EXTERNAL_ANALYTICS_MARKET_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
PRODUCT_BOUNDARY_RECONCILED = PASS
PROVIDER_CONTRACT = PASS
BRIDGE_CAPABILITY_RECONCILED = PASS
PERSISTENCE_CONTRACT = PASS
WORK_TRIGGER_EVALUATED = PASS
R04_EXISTING_DURABLE_START_ARTIFACT = NONE
NO_PROVIDER_CALL_BEFORE_RELEASE = true
OWNER_FACING_SOURCE_DISCLOSURE = REQUIRED BEFORE FIRST START
```

This pre-step itself does not authorize submit/collect/export.

## 16. Planned first action after disclosure

Exactly one local start may be activated after owner-facing source/method disclosure:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r04-20260917","queries":["аналитика маркетплейсов для селлеров"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted Bridge behavior: local start only, `request_executed:false`, `provider_calls:0`, one `PENDING` item. Actual returned envelope remains authority.

## 17. Plain-language conclusion

The broad seller-analytics category cannot be treated as one data source. Marketplace-native analytics is clearly real for seller-owned data, while current analytics SaaS language also strongly includes external market/niche/competitor intelligence. R04 is therefore the necessary Search test of which of those meanings dominates the unqualified seller query and which page types users currently encounter. Search can define intent boundaries; it cannot grant Octoport unsupported external-intelligence capability.
