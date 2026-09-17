# R09 pre-step research and bounded release — `поисковые запросы wildberries для продавца`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F7 seller search-analytics boundary`.  
Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**.

## 1. Current cursor

```text
M2R = ACCEPTED
S01-S03 = CLOSED
R01-R06 = CLOSED
R08 = CLOSED / FULL EXPORT PERSISTED / ALL-20 ANALYSIS READ BACK
NEXT_CANDIDATE = R09
R10 = BLOCKED UNTIL R09 CLOSURE
M7 = BLOCKED
M8 = BLOCKED
```

Matrix authority: `M3_QUERY_MATRIX_2026-09-17.md`.

R08 closure authority:

- `raw/R08_06_EXPORT_MANIFEST_2026-09-17.md`;
- `analysis/R08_06_EXPORT_ANALYSIS_2026-09-17.md`.

## 2. Query identity

```text
QUERY_ID = R09
QUERY_TEXT = поисковые запросы wildberries для продавца
FAMILY = F7
JOB_ID_PLANNED = octoport-serp-r09-20260917
RELATION = control against R10; WB-specific seller search task
```

## 3. Exact open decision

What does current Yandex Search mean by `поисковые запросы wildberries для продавца`?

The live first page must distinguish at least:

1. seller-owned search-performance/report intent — queries by which the seller's own products are found, positions, visibility, transitions, carts/orders/conversion;
2. marketplace-wide WB search-demand analytics — what buyers search across Wildberries, query popularity and funnel data;
3. third-party SEO/keyword/rank-tracking tools for WB sellers;
4. external market/competitor search intelligence that estimates data beyond the seller's own authorized store scope;
5. seller education about card SEO, keyword collection and ranking;
6. buyer-side search/navigation — how a shopper searches Wildberries rather than how a seller analyzes search data;
7. niche-analysis surfaces where search queries are only one component;
8. unrelated noise.

The matrix decision remains `seller search-report intent versus buyer search/navigation`. Fresh WB evidence adds a required internal boundary inside seller-side intent: marketplace-wide search-demand analytics is not the same dataset as search-performance data for the seller's own products.

## 4. Why durable evidence is insufficient

Wordstat and previously accepted product/source evidence establish that search-query work exists, but they do not establish the current Yandex SERP composition for this exact seller-qualified phrase.

Official WB sources prove two distinct first-party seller jobs:

- `Поисковые запросы: ваши товары` — search queries and search performance for the seller's products;
- `Поисковые запросы на WB` — marketplace-wide user query demand.

They do not tell us whether Yandex Search for the exact R09 wording is dominated by those first-party reports, third-party SEO tools, external analytics/intelligence, educational pages or buyer navigation.

```text
R09_REDUNDANT_WITH_R04_R08 = NO
R09_INFORMATION_GAIN = HIGH
R09_CAPABILITY_ADJACENT_EVIDENCE = CONFIRMED
R09_SEARCH_INTENT_MIX = UNRESOLVED UNTIL LIVE SERP
```

## 5. Fresh external/provider research — 2026-09-17

### R09-Y1 — current Yandex deferred Search lifecycle

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`

Rechecked on 2026-09-17. Current documentation still states that asynchronous Web Search returns an Operation object whose `id` must be saved, then queried later for completion/result. The operation can take from five minutes to a few hours.

Method use: retain the already accepted one-local-start -> exactly one submit -> bounded deferred collect -> revision-pinned complete export lifecycle, with the same RU/225 top-20 comparison parameters.

### R09-WB1 — marketplace-wide search-demand report is a real seller surface

Official Wildberries Seller documentation, updated 2026-07-01:

`https://seller.wildberries.ru/instructions/en/uz/material/search-analytics-report`

The current report `Поисковые запросы на WB` shows information about search queries entered by Wildberries users. Wildberries defines a search query as the phrases buyers use to find products and exposes query-volume measures for seller analysis.

Method use: classify first-party marketplace-wide query-demand/report pages separately from own-product search-performance reports. Their data scope differs even though both are seller analytics.

### R09-WB2 — own-product search-performance report is a distinct seller job

Official Wildberries Search Analytics help:

`https://seller.wildberries.ru/instructions/ru/ru/subcategory/search-analytics`

Current help states that `Поисковые запросы: ваши товары` shows queries by which the seller's products rank/find traffic, including average search position and query-level transitions/add-to-cart/orders. It also states that the Search Queries report counts search traffic specifically, unlike the broader sales funnel.

Official Wildberries Jam scope:

`https://seller.wildberries.ru/instructions/ru/by/material/djem-subscription-options-by?categoryId=jam&goBackOption=prevRoute`

The current Jam description separates `Поисковые запросы: ваши товары` (queries buyers used to find the seller's products; ranking/visibility/sales factors) from `Поисковые запросы на WB` (queries of Wildberries site/app users).

Method use: own-product search analytics is a first-party operational seller-data class and must not be merged with marketplace-wide demand or external competitor intelligence.

### R09-WB3 — current WB API explicitly exposes search-query reports for the seller's products

Official WB API, Analytics and Data:

`https://dev.wildberries.ru/openapi/analytics`

Current API documentation has the section `Поисковые запросы по вашим товарам`. It requires an Analytics-category token and states that these methods require a Jam subscription. The main endpoint is:

`POST /api/v2/search-report/report`

It forms the report dataset with general information, product positions, visibility/transitions and grouped table data. Related methods expose product search texts and orders/positions by search queries.

Method use: this is direct capability evidence for seller-owned search analytics at the WB API level. It does not prove that every marketplace-wide Search Analytics UI dataset is API-addressable, does not remove subscription requirements, and does not authorize unsupported external market intelligence.

### R09-WB4 — buyer search / card-SEO language is a neighboring intent, not the same seller report

Official WB seller materials use search-query language for card optimization and ranking as well as for analytics. The Search Analytics documentation explains positions in the search results and query-level recommendations, while the separate marketplace-wide report describes buyer query demand.

Method use: educational SEO/card-optimization pages are valid seller intent but must be coded separately from report/analytics intent. Buyer-facing navigation/help is a boundary, not seller analytics.

### R09-WB5 — niche analysis is adjacent but broader than R09

Official Wildberries `Анализ ниш`, updated 2026-06-01:

`https://seller.wildberries.ru/instructions/ru/ru/material/A-250`

The niche report includes a search-query table as one component and explicitly points users to `Поисковые запросы: ваши товары` for more detailed work with search-query conversion.

Method use: if the R09 SERP surfaces niche-analysis products, code them as adjacent/broader rather than silently treating niche intelligence as equivalent to the own-product search report. R10 remains the separate matrix query for niche analysis.

## 6. Source -> method trace

| Question | Evidence | R09 use | Boundary |
|---|---|---|---|
| Current Search provider lifecycle? | Yandex AI Studio official | same accepted deferred top-20 lifecycle | provider docs != Bridge execution proof |
| Does WB expose marketplace-wide search demand? | WB Seller `Поисковые запросы на WB` | first-party marketplace-wide query-demand class | marketplace aggregate != own-product seller data |
| Does WB expose own-product search analytics? | WB Search Analytics + Jam official | seller-owned search-performance/report class | report availability/subscription constraints remain real |
| Is own-product search analytics exposed by API? | WB API `Аналитика и данные` official | capability-confirmed seller-data class | API proof != every UI field/report; no external-intelligence overclaim |
| Is SEO/ranking language adjacent? | WB Search Analytics official | separate seller education/optimization from analytics report intent | guidance != buyer navigation and != report dataset |
| Is niche analysis the same task? | WB `Анализ ниш` official | keep broader niche/search-demand surfaces separate | R10 owns the later niche-boundary question |

## 7. Full-result coding plan

Every normalized organic result will be reviewed with:

```text
rank
url/domain/title/snippet/full export text when needed
page type = WB seller help / WB API / SaaS / SEO tool / analytics tool / agency / article / buyer help / noise
actor = seller / buyer / SEO specialist / marketplace / software / agency / unclear
search scope = seller-owned product search performance / marketplace-wide query demand / buyer navigation / external competitor intelligence / unclear
data ownership = own seller products / marketplace aggregate / external estimate / mixed / unclear
job = discover queries / track positions / analyze visibility / transitions / carts / orders / conversion / optimize card SEO / navigate buyer search / analyze niche / other
commercial intent = analyze / track / discover keywords / optimize / learn / navigate / compare tools / other
Octoport fit = direct / adjacent / boundary / noise
```

Primary classes:

- `SELLER_OWN_PRODUCT_SEARCH_REPORT_OR_ANALYTICS`;
- `MARKETPLACE_WIDE_SEARCH_DEMAND_ANALYTICS`;
- `THIRD_PARTY_SEO_KEYWORD_OR_RANK_TOOL`;
- `EXTERNAL_MARKET_OR_COMPETITOR_SEARCH_INTELLIGENCE`;
- `BUYER_SEARCH_NAVIGATION_OR_CONSUMER_HELP`;
- `SELLER_EDUCATION_OR_CARD_SEO_GUIDE`;
- `NICHE_ANALYSIS_WITH_SEARCH_QUERY_COMPONENT`;
- `NOISE_OTHER_INTENT`.

Actual evidence controls final coding; these are not quotas. New evidence-driven classes may be added rather than forcing mismatched rows.

## 8. R09 -> R10 boundary rule

R09 is the seller-search control. R10 (`анализ ниш wildberries для продавца`) remains a separate matrix step and is **not** released by this artifact.

After the complete R09 top-20:

- quantify seller-owned report/analytics versus marketplace-wide demand versus SEO tools/external intelligence versus buyer navigation;
- determine whether the exact seller-qualified search-query language is a useful acquisition surface;
- carry only evidence-supported source/data boundaries into R10;
- do not use Search to repair missing API/product authority;
- do not start R10 until R09 has complete export persistence, readback and all-result analysis.

## 9. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export the complete top-20; classify every row; measure seller-side search-report intent versus marketplace-wide demand, third-party SEO/rank tools, external intelligence, education and buyer navigation; then close the R09 decision before touching R10.

### VALID ZERO

Weakens only this exact seller-qualified formulation. It does not erase the official WB seller search-report task or the confirmed own-product Search Queries API capability.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry. Ambiguous provider execution requires separate reconciliation/release.

## 10. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = поисковые запросы wildberries для продавца
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
jobId = octoport-serp-r09-20260917
```

## 11. Current Bridge / durable-state gates

Rechecked immediately before release:

```text
REPO = MaksimUnimax/Yandex_direct
BRANCH = hotfix/ymb-017-qualification-fix-2026-09-16
HEAD = 469a69b628ef00e79718996cfd7bbb0291edddec
BRANCH_HEAD_RECHECK = PASS
```

Durable SEO branch rechecked immediately before release:

```text
DURABLE_REPO = MaksimUnimax/runtime-fixtures
DURABLE_BRANCH = seo/wordstat-batch-01-2026-09-16
PRE_RELEASE_HEAD = 5a6bc3fcfec851e07a432f4742dd5ff805ec6285
R08_EXPORT_ANALYSIS_READBACK = PASS
R09_PRE_STEP_EXISTING = NONE (404 CHECKED)
R09_RAW_START_EXISTING = NONE (404 CHECKED)
R09_ANALYSIS_START_EXISTING = NONE (404 CHECKED)
RAW_LIFECYCLE_PATH_PREFIX = docs/seo/serp/raw/R09_*
ANALYSIS_PATH_PREFIX = docs/seo/serp/analysis/R09_*
FULL_EXPORT_PERSISTENCE = REQUIRED BEFORE SEMANTIC ANALYSIS
REMOTE_READBACK = REQUIRED BEFORE EVERY NEXT PROVIDER ACTION
WORK_TRIGGER_FOR_ONE_TOP20 = NOT MET
```

## 12. Release gate

```text
R08 = CLOSED / FULL EXPORT PERSISTED / READBACK / ALL-20 ANALYSIS READBACK
R09_INFORMATION_GAIN = HIGH
FRESH_YANDEX_PROVIDER_RESEARCH = PASS
FRESH_WB_MARKETPLACE_WIDE_SEARCH_REPORT_RESEARCH = PASS
FRESH_WB_OWN_PRODUCT_SEARCH_REPORT_RESEARCH = PASS
CURRENT_WB_API_SEARCH_REPORT_CAPABILITY = PASS
BUYER_SEARCH_AND_SEO_BOUNDARY_RESEARCH = PASS
NICHE_BOUNDARY_RESEARCH = PASS
SOURCE_TO_METHOD_TRACE = PASS
CURRENT_BRIDGE_BRANCH_HEAD = VERIFIED
EXISTING_JOB_CONFLICT = NONE
WORK_TRIGGER = NOT MET
NO_PROVIDER_CALL_BEFORE_RELEASE = true
```

This artifact releases **only one local start**. It does not release `submitN`, `collectN`, `exportPage`, R10, or any other query.

## 13. Exact released local command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r09-20260917","queries":["поисковые запросы wildberries для продавца"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted pattern is local-only creation with one `PENDING` item. Actual returned envelope is authority. Persist and read back that envelope before any `submitN` can be considered.