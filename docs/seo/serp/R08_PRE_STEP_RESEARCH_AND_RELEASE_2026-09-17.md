# R08 pre-step research and bounded release — `аналитика рекламы маркетплейсов`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F6 advertising-analysis boundary`.  
Status: **PASS / QUERY-SPECIFIC RELEASE / LOCAL START ONLY**.

## 1. Current cursor

```text
M2R = ACCEPTED
S01-S03 = CLOSED
R01-R06 = CLOSED
NEXT_CANDIDATE = R08
M7 = BLOCKED
M8 = BLOCKED
```

Matrix authority: `M3_QUERY_MATRIX_2026-09-17.md`.

## 2. Query identity

```text
QUERY_ID = R08
QUERY_TEXT = аналитика рекламы маркетплейсов
FAMILY = F6
JOB_ID_PLANNED = octoport-serp-r08-20260917
RELATION = generic control; marketplace-specific WB/Ozon pair remains conditional
```

## 3. Exact open decision

What does current Yandex Search mean by the broad phrase `аналитика рекламы маркетплейсов`?

The live first page must distinguish at least:

1. analytics of a seller's own advertising campaigns inside Ozon/Wildberries;
2. cross-marketplace seller SaaS aggregating own advertising data;
3. analytics of external traffic/advertising that drives sales on marketplaces;
4. advertising-management/autobidder/bid-automation tools;
5. agencies or managed advertising services;
6. external market/competitor advertising intelligence;
7. generic educational/content intent;
8. unrelated noise.

The decision is not whether advertising metrics exist. Official/current marketplace surfaces already prove that seller-owned campaign statistics are a real operational task. Search is required to determine which user job and page types dominate the broad acquisition phrase and whether one marketplace-specific control is still needed.

## 4. Why durable evidence is insufficient

R04 established a broad analytics SERP with seller-owned analytics plus strong external/mixed market intelligence. It did not isolate advertising analytics.

Wordstat F6 roots are live but sparse/non-expansive and cannot tell whether Search means campaign diagnostics, agencies, autobidders, external traffic attribution or competitor intelligence.

```text
R08_REDUNDANT_WITH_R04 = NO
R08_INFORMATION_GAIN = HIGH
R08_MARKETPLACE_PAIR = CONDITIONAL_ONLY
```

## 5. Fresh external/provider research — 2026-09-17

### R08-Y1 — current Yandex deferred Search lifecycle

Official Yandex AI Studio:

`https://aistudio.yandex.ru/ru/docs/search-api/operations/web-search`

Current documentation states that asynchronous Web Search returns an Operation object whose `id` must be saved, then retrieved later; execution can take from five minutes to a few hours.

REST reference:

`https://aistudio.yandex.ru/ru/docs/search-api/api-ref/WebSearchAsync/search`

Method use: keep the accepted one-submit/deferred-operation/bounded-collect/revision-pinned-export lifecycle and the same top-20 RU/225 comparison parameters.

### R08-WB1 — current WB seller UI has first-party campaign analytics

Official Wildberries seller documentation, updated 2026-06-17:

`https://seller.wildberries.ru/instructions/ru/ru/material/statistics-and-promotion-management`

The current `WB Продвижение → Статистика` surface provides both overall and per-campaign statistics. Observed metrics include campaign identity/status, impressions, clicks, cart additions, orders, spend and other values; extended statistics can be downloaded as XLS.

Method use: pages about a seller's own WB campaign metrics are a first-party operational analytics class, not external market intelligence.

### R08-WB2 — current WB API exposes promotion statistics for the seller account

Official WB API:

`https://dev.wildberries.ru/en/docs/openapi/promotion?locale=ru%2F`

The current Promotion API includes campaign statistics, search-cluster statistics and media-campaign statistics, authenticated with the Promotion token category and subject to seller-account request limits.

Method use: seller-owned campaign/statistics/API surfaces are capability-adjacent evidence. Search still cannot authorize unsupported Octoport actions; accepted API/product authority remains separate.

### R08-OZ1 — current Ozon seller promotion surface exposes campaign-result metrics

Official Ozon Help result surface:

`https://docs.ozon.uz/performance/product-ads/oplata-za-klik/results-of-campaign/`

Current indexed Ozon help describes PPC campaign-result metrics including average CPC, orders, sales, spend, DRR and impressions.

Method use: Ozon first-party campaign effectiveness is a distinct seller-owned advertising-analysis job. This terminology evidence does not replace the accepted canonical Ozon Performance Swagger authority.

### R08-YD1 — external advertising can also be measured against marketplace sales

Official Yandex Direct:

`https://www.yandex.ru/support/direct/ru/campaign-master/sales-on-marketplaces`

The current `Продажи на маркетплейсах` campaign statistics include impressions, clicks, conversions, conversion cost and spend by marketplace; for Ozon and Yandex Market the surface also reports income and DRR.

Method use: classify external-traffic advertising analytics separately from native Ozon/WB promotion analytics. The broad word `реклама маркетплейсов` can legitimately refer to traffic bought outside the marketplace and attributed back to marketplace sales.

### R08-M1 — current market vocabulary separates own-store/internal analytics from external intelligence

Current 2026 seller-tool guide:

`https://steksellera.com/guides/vneshnyaya-ili-vnutrennyaya-analitika/`

Updated 2026-07-31, it explicitly frames internal analytics as the seller's own store data, including advertising, while external analytics covers market demand, niches, products, prices, search queries and competitors.

Method use: do not merge ad-campaign diagnostics over authorized own-store data with competitor/niche intelligence merely because both are marketed as marketplace analytics.

### R08-M2 — current third-party tools aggregate advertising analytics across seller workflows

Examples found in fresh 2026 surfaces:

- `https://mpmgr.ru/docs/features/auto-campaigns/wildberries/analytics` — WB campaign analytics, updated 2026-06-06;
- `https://mpmgr.ru/docs/features/auto-campaigns/ozon/analytics` — Ozon campaign analytics, updated 2026-06-26;
- `https://sellerstrat.ru/ru` — current marketplace seller SaaS includes a marketing view separating organic and advertising performance.

Method use: a cross-marketplace seller-ad-analytics SaaS class is expected and must be kept separate from agencies/autobidders and from first-party marketplace help pages.

## 6. Source -> method trace

| Question | Evidence | R08 use | Boundary |
|---|---|---|---|
| Current Search provider lifecycle? | Yandex AI Studio official | same accepted deferred top-20 method | provider docs != Bridge implementation proof |
| Does WB expose seller-owned ad analytics? | WB Seller + WB API official | first-party/native campaign analytics class | analytics != authorization to mutate campaigns |
| Does Ozon expose campaign-effectiveness metrics? | Ozon Help official | first-party/native Ozon campaign analytics class | canonical Performance Swagger remains capability authority |
| Can advertising analytics mean off-marketplace traffic? | Yandex Direct official | separate external-traffic attribution class | not native marketplace advertising |
| Own-data vs market/competitor boundary? | fresh 2026 seller-tool methodology | code internal vs external intelligence separately | market source is terminology evidence, not Octoport capability authority |
| Do third-party seller tools aggregate campaign analytics? | fresh 2026 MP Manager/SellerStrat surfaces | cross-marketplace SaaS class | SaaS features are source-specific |

## 7. Full-result coding plan

Every normalized organic result will be reviewed with:

```text
rank
url/domain/title/snippet/full export text when needed
page type = marketplace help / API / SaaS / dashboard / agency / automation tool / article / course / noise
advertising source = native Ozon / native WB / multi-marketplace native / external traffic / unclear
actor = seller / agency / marketer / software / marketplace / unclear
data ownership = seller-authorized own campaigns / external market or competitor / mixed / unclear
metrics/job = spend / impressions / clicks / CTR / CPC / cart / orders / sales / DRR / ROAS / bids / attribution / other
commercial intent = analyze / optimize / automate bids / outsource / learn / compare tools
Octoport fit = direct / adjacent / boundary / noise
```

Primary classes:

- `MARKETPLACE_NATIVE_SELLER_AD_CAMPAIGN_ANALYTICS`;
- `CROSS_MARKETPLACE_SELLER_AD_ANALYTICS_SAAS`;
- `EXTERNAL_TRAFFIC_TO_MARKETPLACE_ANALYTICS`;
- `AD_MANAGEMENT_AUTOBIDDER_OR_BID_AUTOMATION`;
- `AGENCY_OR_MANAGED_MARKETPLACE_ADVERTISING`;
- `EXTERNAL_MARKET_OR_COMPETITOR_AD_INTELLIGENCE`;
- `GENERIC_ADVERTISING_ANALYTICS_CONTENT_OR_EDUCATION`;
- `NOISE_OTHER_INTENT`.

Actual evidence controls final coding; these are not quotas. New evidence-driven classes may be added rather than forcing mismatched rows.

## 8. Conditional marketplace-pair rule

R08 is the generic control. Do **not** automatically run both `аналитика рекламы wildberries` and `аналитика рекламы ozon`.

After the complete R08 top-20:

- if generic Search clearly resolves the ownership/job/page-type boundary and marketplace-specific differences are not decision-changing, `MORE_F6_SEARCH_NOW = NO`;
- if one named unresolved divergence remains (for example WB-native bid/search-cluster analytics versus Ozon-native campaign/DRR analytics), release only the minimum marketplace-specific control needed to resolve that divergence;
- Search cannot repair missing capability proof.

## 9. Outcome contract

### SUCCESS_WITH_RESULTS

Persist/export the complete top-20; classify every row; measure native seller campaign analytics versus cross-marketplace SaaS, external traffic, agencies/autobidders and external intelligence; decide whether a marketplace-specific control is still necessary.

### VALID ZERO

Weakens only this exact broad formulation. It does not erase official seller-owned advertising analytics capabilities or narrower demand.

### TECHNICAL / VALIDATION / PROVIDER / PARSE / UNKNOWN

No semantic conclusion. Persist exact truth and stop. No blind retry. Ambiguous provider execution requires separate reconciliation/release.

## 10. Provider contract

```text
service = Yandex Search API
mode = Manual / Deferred
query = аналитика рекламы маркетплейсов
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
jobId = octoport-serp-r08-20260917
```

## 11. Current Bridge / durable-state gates

Rechecked immediately before release:

```text
REPO = MaksimUnimax/Yandex_direct
BRANCH = hotfix/ymb-017-qualification-fix-2026-09-16
HEAD = 469a69b628ef00e79718996cfd7bbb0291edddec
BRANCH_HEAD_RECHECK = PASS
```

The same accepted Search async lifecycle completed R06 through recovered local start, exactly one submit, bounded collect, terminal revision 5 and full export. Installed Bridge self-reported 0.1.9 during delivery incidents; repository source/version identity remains a separate concern and does not alter the observed public lifecycle results.

Durable conflict check:

```text
R08_EXISTING_DURABLE_START_ARTIFACT = NONE (404 CHECKED)
RAW_LIFECYCLE_PATH_PREFIX = docs/seo/serp/raw/R08_*
ANALYSIS_PATH_PREFIX = docs/seo/serp/analysis/R08_*
FULL_EXPORT_PERSISTENCE = REQUIRED BEFORE SEMANTIC ANALYSIS
REMOTE_READBACK = REQUIRED BEFORE EVERY NEXT PROVIDER ACTION
WORK_TRIGGER_FOR_ONE_TOP20 = NOT MET
```

## 12. Release gate

```text
R06 = CLOSED / FULL EXPORT PERSISTED / READBACK / ALL-20 ANALYSIS READBACK
R08_INFORMATION_GAIN = HIGH
FRESH_YANDEX_PROVIDER_RESEARCH = PASS
FRESH_WB_AD_ANALYTICS_RESEARCH = PASS
FRESH_OZON_AD_ANALYTICS_RESEARCH = PASS
EXTERNAL_TRAFFIC_BOUNDARY_RESEARCH = PASS
INTERNAL_VS_EXTERNAL_ANALYTICS_BOUNDARY = PASS
SOURCE_TO_METHOD_TRACE = PASS
CURRENT_BRIDGE_BRANCH_HEAD = VERIFIED
EXISTING_JOB_CONFLICT = NONE
WORK_TRIGGER = NOT MET
NO_PROVIDER_CALL_BEFORE_RELEASE = true
```

This artifact releases **only one local start**. It does not release `submitN`.

## 13. Exact released local command

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r08-20260917","queries":["аналитика рекламы маркетплейсов"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

Expected accepted pattern is local-only creation with one `PENDING` item. Actual returned envelope is authority.
