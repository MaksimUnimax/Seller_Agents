# M2R-A10 pre-step research and query release — `аналитика рекламы маркетплейсов`

Date: 2026-09-16.
Stage: `M2R — advertising analysis/help discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A01 broad analytics: CLOSED / high information gain.
- A03-A05 reports: CLOSED / generic report discovery saturated enough / accounting-heavy.
- A06-A09 finance/profit: CLOSED / saturated enough for M2R; concrete seller jobs outperform abstract category language.
- A09 `маржинальность на маркетплейсах`: totalCount 111; clean but modest metric family.
- Advertising analysis/help remains a major undercovered corrected-product family.
- A01 had only one explicit direct ad-analytics phrase: `реклама маркетплейса аналитика` = 33.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A10`

`QUERY_TEXT = аналитика рекламы маркетплейсов`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Discover the search-language surface for **analysis/help with marketplace advertising**, while explicitly separating it from specialist real-time bid-management/autobidder products.

Need to discover whether users naturally search for:

- ad analytics / advertising statistics;
- campaign effectiveness;
- advertising spend / budget;
- DRR / ROAS / CPO / CTR / CPC or marketplace-specific efficiency metrics;
- impressions / clicks / orders / conversions;
- product-level ad performance;
- campaign reports;
- recommendations / optimization / diagnostics;
- Ozon/Wildberries-specific ad analytics;
- services/dashboards/tools;
- automatic bid-management / autobidder intent;
- education/course/agency noise.

## 4. Why existing evidence is insufficient

Historical M2 did not run a dedicated advertising-analysis discovery seed. A01 broad analytics surfaced only `реклама маркетплейса аналитика` = 33. Therefore current semantic evidence is far too shallow to represent advertising as one of the AI-employee's legitimate working domains.

Advertising is not being included because Octoport should become a 24/7 bid bot. The target job is interpretation of campaign data, diagnostics, recommendations and planning using seller advertising statistics.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract: GetTop returns last-30-days popular queries containing the specified keyword and similar queries; `numPhrases` accepts 1..2000 and response can include `results[]`, `associations[]`, `totalCount`.

Method consequence: use the broad advertising-analysis phrase as discovery evidence only; persist the full provider response before classification.

### Wildberries current advertising-statistics surface

Source:

https://seller.wildberries.ru/instructions/en/ru/material/statistics-and-promotion-management

Updated 2026-06-17. Current WB promotion documentation exposes:

- overall statistics across campaigns;
- campaign metrics;
- campaign statistics and extended statistics;
- product statistics;
- recommendations for promotion;
- guidance on increasing impressions, clicks, cart additions and orders.

Product consequence: ad-performance interpretation and recommendations are genuine current seller jobs.

### Current market-language evidence

https://www.pi-data.ru/analitika-reklamy-wb-ozon

Current page uses the explicit category `Аналитика рекламы на маркетплейсах` and describes campaign/product views with budget, impressions, clicks, orders and DRR.

https://marketdash.ru/

Current seller-analytics product uses a dedicated advertising module for Wildberries/Ozon with campaign statistics, spend, reach and efficiency.

These pages establish current market language and metric vocabulary; they are not product-truth authorities for Octoport.

### Ozon capability boundary

Current endpoint-level Ozon advertising truth remains governed by the project's accepted Performance API/OpenAPI authority. Public Ozon seller materials also document campaign analytics and advertising-management surfaces, but A10 does not assume that every advertising operation is in launch scope. Launch positioning remains read-only/analysis-first.

## 6. Source -> method trace

| Question | Source | A10 use | Boundary |
|---|---|---|---|
| Can GetTop expose ad-analysis variants? | Yandex Wordstat.GetTop | max-depth discovery | demand/language only, not page proof |
| Is ad-stat analysis a current seller job? | WB current promotion statistics | retain campaign/metric/recommendation branches | current launch is analysis/read-only, not autonomous mutation |
| Is `аналитика рекламы на маркетплейсах` current market language? | Pi-Data, MarketDash | justify broad seed and metric buckets | competitor vocabulary != final target-page authority |
| What about Ozon advertising functions? | project Performance API authority + public seller evidence | keep Ozon branch eligible | no unsupported endpoint/product promises |

## 7. Information-gain contract

A10 must add information by:

1. mapping generic ad-analysis language absent from prior M2;
2. discovering efficiency metrics and campaign-stat terminology;
3. exposing service/tool/report/recommendation language;
4. detecting Ozon/WB-specific advertising-analysis formulations;
5. distinguishing analytical/help intent from agency/course content;
6. explicitly separating real-time autobidder/bid-management intent from Octoport core;
7. identifying high-value follow-up seeds such as marketplace-specific ad analytics or DRR when actual evidence justifies them;
8. informing later SERP probes around advertising analysis/help.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Review every direct row and useful association into provisional buckets:

- AD_ANALYTICS_CORE;
- CAMPAIGN_STATISTICS;
- SPEND_BUDGET;
- DRR_ROAS_CPO;
- CTR_CPC_IMPRESSIONS_CLICKS;
- ORDERS_CONVERSION;
- PRODUCT_AD_PERFORMANCE;
- REPORT_DASHBOARD_TOOL;
- RECOMMENDATION_OPTIMIZATION_HELP;
- MARKETPLACE_SPECIFIC;
- AUTOBIDDER_BID_MANAGEMENT;
- AGENCY_SERVICE;
- EDUCATION_CONTENT;
- NOISE;
- HOLD.

`AUTOBIDDER_BID_MANAGEMENT` is retained as boundary evidence but is not counted as core Octoport demand merely because it concerns ads.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would mean users express the advertising job differently and would trigger alternate evidence-backed formulations rather than erasing the job.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `аналитика рекламы маркетплейсов`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- run marketplace-specific WB/Ozon ad-analysis probes when A10 or current market evidence shows material information gain;
- run DRR/efficiency/report branches separately only if they resolve a named semantic gap;
- keep autobidder terminology as a negative/boundary family, not a volume source for core demand;
- no page decision from raw phrase counts;
- continue until advertising-analysis search language reaches family-level saturation.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A10_ANALITIKA_REKLAMY_MARKETPLEYSOV_RESULT_2026-09-16.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for this single bounded Wordstat call.

After the advertising family and one or two additional corrected-product families are acquired, proactive Work reconciliation of the complete M2R corpus is likely to have positive quality gain and should be reconsidered without resource-economy constraints.

## 13. Downstream decision

A10 does not create a page. It determines whether advertising analytics/help is a meaningful acquisition family, what language sellers use, which subfamilies need more acquisition, and which later SERP checks should separate analytical assistance from bid-bot products.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-task support | 10.0 |
| Current market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Autobidder boundary control | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A10_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A10 = 0
```
