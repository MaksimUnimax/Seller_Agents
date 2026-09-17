# R10 pre-step research and bounded release — `анализ ниш wildberries для продавца`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F7 niche-analysis boundary`.  
Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**.

## 1. Current cursor

```text
M2R = ACCEPTED
S01-S03 = CLOSED
R01-R06 = CLOSED
R08 = CLOSED
R09 = CLOSED / FULL EXPORT PERSISTED / ALL-20 ANALYSIS READ BACK
NEXT_CANDIDATE = R10
R07 = BLOCKED UNTIL R10 CLOSURE
R11 = BLOCKED
R12 = BLOCKED
M7 = BLOCKED
M8 = BLOCKED
```

Matrix authority: `M3_QUERY_MATRIX_2026-09-17.md`.

R09 closure authority:

- `raw/R09_05_EXPORT_MANIFEST_2026-09-17.md`;
- `analysis/R09_05_EXPORT_ANALYSIS_2026-09-17.md`;
- `SERP_PROGRESS.md`.

## 2. Query identity

```text
QUERY_ID = R10
QUERY_TEXT = анализ ниш wildberries для продавца
FAMILY = F7
JOB_ID_PLANNED = octoport-serp-r10-20260917
RELATION = paired/control with R09; WB-only niche-analysis boundary
```

## 3. Exact open decision

What does current Yandex Search mean by `анализ ниш wildberries для продавца`?

The live first page must distinguish at least:

1. native Wildberries first-party niche analytics/reporting built from marketplace-wide WB data;
2. third-party external niche/market intelligence that estimates or reconstructs market, competitor, category, brand, product, demand or revenue data beyond one seller's authorized store;
3. broad marketplace analytics suites where niche selection is only one module;
4. seller education/how-to content about selecting a niche or product;
5. generic product-idea / "what to sell" content without a real analytics surface;
6. adjacent search-query/card-SEO tooling that does not actually answer the niche-analysis job;
7. agencies/courses/consulting or other service intent;
8. unrelated noise.

The matrix decision remains: **native niche-analysis demand and whether users expect broader external market intelligence**.

R09 established seller-side search-query intent, but it did not answer this broader market/niche-data question. R10 must therefore be analyzed independently.

## 4. Why current durable evidence is insufficient

Wordstat establishes exact demand for niche-analysis wording. Official Wildberries sources establish that a native `Анализ ниш` report exists and operates on broader marketplace data, not only on one seller's store.

However, neither fact tells us what Yandex Search users expect from the exact R10 wording. The SERP may be dominated by:

- the native WB report;
- external MPStats-like intelligence;
- broad analytics SaaS;
- educational/how-to pages;
- product-selection advice;
- mixed commercial and informational surfaces.

There is also a hard capability boundary. Current public WB API analytics documentation confirms seller analytics/search/stocks/CSV methods, but a dedicated public `Анализ ниш` API endpoint was not found in the current analytics reference checked for this pre-step. Search cannot convert a UI/report capability into API capability.

```text
R10_REDUNDANT_WITH_R09 = NO
R10_INFORMATION_GAIN = HIGH
R10_NATIVE_WB_REPORT = CONFIRMED
R10_NATIVE_WB_REPORT_DATA_SCOPE = MARKETPLACE_WIDE / FIRST_PARTY WB
R10_PUBLIC_API_NICHE_ENDPOINT = NOT CONFIRMED
R10_EXTERNAL_INTELLIGENCE_EXPECTATION = UNRESOLVED UNTIL LIVE SERP
```

## 5. Fresh external/provider research — 2026-09-17

### R10-Y1 — current Yandex deferred Search lifecycle

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`

Rechecked on 2026-09-17. Current documentation still supports deferred/asynchronous text search and the same request controls used in accepted M3 runs: Russian search type, region, page, grouping, typo mode and relevance sort.

Method use: retain the accepted one-local-start -> one submit -> bounded deferred collect -> revision-pinned complete export lifecycle, with RU/225 top-20 parameters.

### R10-WB1 — native `Анализ ниш` is a real first-party marketplace-wide analytics surface

Official Wildberries Seller Help:

`https://seller.wildberries.ru/instructions/ru/ru/subcategory/trading-platform-analytics`

Current help describes the business-development analytics section as using data not only from the seller's own store but from all products on the marketplace. It explicitly says this layer can be used to compare the seller with competitors and identify niches for development.

The current FAQ for `Анализ ниш` exposes niche-market metrics including:

- availability status such as balance/deficit/illiquid;
- category turnover;
- average stock;
- monopolization / concentration of orders among sellers;
- number of cards;
- category/subject filtering;
- a search-query widget.

Method use: `WB_NATIVE_NICHE_ANALYTICS` is a distinct first-party class. It is broader than seller-owned store analytics and broader than R09 own-product search performance.

### R10-WB2 — Wildberries positions niche analysis as assortment / product-selection intelligence

Official Wildberries seller portal:

`https://seller.wildberries.ru/about-portal/ru/ru`

Current portal copy places `Анализ ниш` inside complex analytics and describes the task as studying buyer demand/trends and finding promising niches for trading. It also separates `Анализ ниш` from search analytics and comparison of cards.

Official Jam scope:

`https://seller.wildberries.ru/instructions/ru/am/material/whats-included-in-jam?recommended=true`

Current Jam documentation includes `Анализ ниш` among analytical reports and describes it as helping select in-demand but scarce goods to expand the assortment.

Method use: code native niche-selection/report intent separately from generic SEO and separately from seller-owned search reports.

### R10-WB3 — current public WB Analytics API does not establish a dedicated niche-analysis endpoint

Official WB API Analytics and Data:

`https://dev.wildberries.ru/openapi/analytics`

The current public analytics reference checked for R10 documents:

- sales-funnel analytics;
- search queries for the seller's products;
- stock/history analytics;
- seller analytics CSV/report generation.

No dedicated public `Анализ ниш` endpoint was found in this current reference during the bounded pre-step research.

Method use: preserve the capability gate. A native WB UI/report result proves demand/source legitimacy but **does not by itself prove Octoport can retrieve that dataset through an allowed API**. Search is not allowed to repair missing endpoint-level product authority.

### R10-EXT1 — external niche intelligence is materially broader than the native-store data model

Representative current external analytics source:

`https://mpstats.io/instruments/wildberries/analytics`

MPSTATS currently markets external Wildberries analytics around the whole market: competitors, categories, brands, trends, niches, demand, prices, sales/revenue estimates and product opportunities. Its own current description explicitly distinguishes this external market layer from standard seller-cabinet analytics.

Method use: when R10 results promise reconstructed whole-market/competitor sales, revenue, price, brand/category or cross-seller intelligence, code them as `EXTERNAL_NICHE_MARKET_INTELLIGENCE` rather than silently treating them as equivalent to Octoport's confirmed API scope.

This source is used only to define the external-intelligence boundary; it does not authorize those capabilities for Octoport.

## 6. Product-truth boundary

Authority: `../PRODUCT_TRUTH.md`.

Current product truth allows marketplace/search/niche analytics only where data is actually available from confirmed Ozon/WB sources. It explicitly prohibits turning full external market/competitor/niche coverage into an SEO promise without endpoint-level confirmation.

Therefore:

```text
NATIVE_WB_NICHE_REPORT_EXISTS = YES
NATIVE_WB_NICHE_REPORT_IS_MARKETPLACE_WIDE = YES
OCTOPORT_CAN_PROMISE_FULL_NATIVE_NICHE_REPORT_VIA_API = NO / NOT YET PROVEN
OCTOPORT_CAN_PROMISE_MPSTATS_LIKE_EXTERNAL_INTELLIGENCE = NO
SERP_CAN_MEASURE_USER_EXPECTATION = YES
SERP_CAN_CREATE_PRODUCT_CAPABILITY = NO
```

## 7. Source -> method trace

| Question | Evidence | R10 use | Boundary |
|---|---|---|---|
| Current Search provider lifecycle? | Yandex AI Studio official | same accepted deferred top-20 lifecycle | provider docs != Bridge execution proof |
| Does WB have first-party niche analytics? | WB Seller Help `Аналитика развития бизнеса` | native WB niche-report class | UI/report existence != API availability |
| What data does native niche analysis imply? | WB FAQ/current help | marketplace-wide category/competition/availability/search-query metrics | first-party aggregate != seller-owned-only data |
| Is niche analysis part of paid seller analytics? | WB Jam official | confirms seller-facing report/task | subscription/product conditions remain real |
| Is a dedicated niche API endpoint confirmed? | current WB API Analytics reference | keep capability as unproven | absence from checked reference is not proof of impossibility elsewhere |
| What is the external-intelligence boundary? | current MPSTATS WB analytics | code whole-market reconstructed competitor/category/niche intelligence separately | competitor marketing claims do not authorize Octoport capability |
| What may Octoport promise? | `PRODUCT_TRUTH.md` | endpoint-level promise gate | no full external market-intelligence claim without proof |

## 8. Full-result coding plan

Every normalized organic result will be reviewed with:

```text
rank
url/domain/title/snippet/full export text when needed
page type = WB seller help / WB API / SaaS / analytics platform / article / agency / course / forum / noise
actor = seller / prospective seller / marketplace / analytics vendor / consultant / unclear
data source = WB first-party / seller-authorized own data / external public/reconstructed estimate / mixed / unclear
market scope = one seller / category / subject / whole WB marketplace / competitor set / cross-marketplace / unclear
job = choose niche / assess demand / assess deficit / assess competition / compare sellers / estimate sales or revenue / inspect search demand / choose product / learn methodology / other
commercial intent = use report / use SaaS / compare tools / learn / buy service/course / other
capability relation = confirmed launch-readable / source-valid-but-API-unproven / external-intelligence-boundary / adjacent / noise
Octoport fit = direct potential / adjacent / boundary / noise
```

Primary classes:

- `WB_NATIVE_NICHE_ANALYTICS_REPORT`;
- `EXTERNAL_NICHE_MARKET_INTELLIGENCE_PLATFORM`;
- `BROAD_MARKETPLACE_ANALYTICS_WITH_NICHE_MODULE`;
- `SELLER_EDUCATION_NICHE_SELECTION_GUIDE`;
- `PRODUCT_SELECTION_OR_WHAT_TO_SELL_GUIDE`;
- `SEARCH_QUERY_OR_CARD_SEO_ADJACENT`;
- `AGENCY_COURSE_OR_CONSULTING_SERVICE`;
- `NOISE_OTHER_INTENT`.

Actual evidence controls final coding; these are not quotas. New evidence-driven classes may be added rather than forcing mismatched rows.

For every result that claims market/competitor data, record whether the page appears to rely on first-party WB aggregate data, seller-authorized store data, or external/reconstructed intelligence.

## 9. R09 -> R10 comparison rule

R09 is now closed and serves only as a control. Its accepted top-20 was dominated by seller SEO/keyword/card-optimization surfaces, not niche analysis.

R10 must answer a separate question:

- does seller-qualified niche language resolve to native WB analytics;
- or to external market/competitor intelligence;
- or to informational product-selection guidance;
- and which data-source expectation dominates the first page?

Do not merge R10 into R09 merely because native niche analysis contains a search-query widget.

## 10. Stop / decision rule

After one complete top-20 for this exact R10 query:

1. classify all results, not a sample;
2. quantify native-WB versus external-intelligence versus broad SaaS versus education/service/noise;
3. identify dominant data-source expectation and page types;
4. determine whether current information is sufficient to bound F7 niche-analysis acquisition language;
5. do not add another niche query unless a named unresolved decision remains;
6. do not create page ownership, final landing architecture, H1/Title or Semantic Master before M7/M9+ gates.

If the SERP is dominated by capabilities outside product authority, retain the demand evidence but mark addressability constrained rather than inventing product support.

## 11. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export the complete top-20; classify every row; measure native first-party niche analytics versus external market intelligence versus broad analytics/education/service intent; then close R10 before moving to R07.

### VALID ZERO

Weakens only this exact seller-qualified phrase. It does not erase the confirmed native WB niche-analysis task or previously observed Wordstat demand.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry. Ambiguous provider execution requires separate reconciliation/release.

## 12. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = анализ ниш wildberries для продавца
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
jobId = octoport-serp-r10-20260917
```

## 13. Current Bridge / durable-state gates

Rechecked immediately before release:

```text
BRIDGE_REPO = MaksimUnimax/Yandex_direct
BRIDGE_BRANCH = hotfix/ymb-017-qualification-fix-2026-09-16
BRIDGE_HEAD = 469a69b628ef00e79718996cfd7bbb0291edddec
BRIDGE_HEAD_RECHECK = PASS

DURABLE_REPO = MaksimUnimax/runtime-fixtures
DURABLE_BRANCH = seo/wordstat-batch-01-2026-09-16
PRE_RELEASE_HEAD = 87f4066473089e8acd4a86d193e1d9bac7771995
R09_CLOSURE_READBACK = PASS
R10_PRE_STEP_EXISTING = NONE (404 CHECKED)
R10_RAW_START_EXISTING = NONE (404 CHECKED)
R10_ANALYSIS_START_EXISTING = NONE (404 CHECKED)
RAW_LIFECYCLE_PATH_PREFIX = docs/seo/serp/raw/R10_*
ANALYSIS_PATH_PREFIX = docs/seo/serp/analysis/R10_*
FULL_EXPORT_PERSISTENCE = REQUIRED BEFORE SEMANTIC ANALYSIS
REMOTE_READBACK = REQUIRED BEFORE EVERY NEXT PROVIDER ACTION
WORK_TRIGGER_FOR_ONE_TOP20 = NOT MET
```

## 14. Release gate

```text
R09 = CLOSED / FULL EXPORT PERSISTED / READBACK / ALL-20 ANALYSIS READBACK
R10_INFORMATION_GAIN = HIGH
FRESH_YANDEX_PROVIDER_RESEARCH = PASS
FRESH_WB_NATIVE_NICHE_RESEARCH = PASS
FRESH_WB_MARKETPLACE_WIDE_DATA_SCOPE_RESEARCH = PASS
CURRENT_WB_PUBLIC_API_NICHE_ENDPOINT = NOT CONFIRMED
FRESH_EXTERNAL_INTELLIGENCE_BOUNDARY_RESEARCH = PASS
PRODUCT_TRUTH_CAPABILITY_GATE = PASS
SOURCE_TO_METHOD_TRACE = PASS
CURRENT_BRIDGE_BRANCH_HEAD = VERIFIED
EXISTING_JOB_CONFLICT = NONE
WORK_TRIGGER = NOT MET
NO_PROVIDER_CALL_BEFORE_RELEASE = true
```

This artifact releases **only one local start**. It does not release `submitN`, `collectN`, `exportPage`, R07 or any other query.

## 15. Exact released local command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r10-20260917","queries":["анализ ниш wildberries для продавца"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted pattern is local-only creation with one `PENDING` item. The actual returned envelope is authority. Persist and read back that envelope before any `submitN` can be considered.
