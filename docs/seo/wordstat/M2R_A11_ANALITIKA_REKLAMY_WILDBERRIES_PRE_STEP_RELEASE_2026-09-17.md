# M2R-A11 pre-step research and query release — `аналитика рекламы wildberries`

Date: 2026-09-17.
Stage: `M2R — marketplace-specific advertising analysis/help discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A06-A09 finance/profit family: CLOSED / saturated enough for M2R.
- A10 `аналитика рекламы маркетплейсов`: CLOSED / weak and non-expansive; totalCount 33; only one direct phrase.
- A10 did not expose DRR/CTR/CPC/CPO/campaign/product/statistics language.
- Advertising analysis/help remains open and undercovered.
- Marketplace-specific discovery is now required.
- Autobidder / continuous bid-management remains an explicit boundary family, not core Octoport demand.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A11`

`QUERY_TEXT = аналитика рекламы wildberries`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Determine how Wildberries sellers search for **advertising analysis and campaign-performance help** when the marketplace is named explicitly.

Need to discover whether users naturally search for:

- advertising analytics / campaign analysis;
- statistics of WB advertising/promotion;
- DRR / share of advertising spend;
- CTR / CPC / CPO / CPM / CR;
- spend / budget / orders / conversion;
- product/SKU-level ad performance;
- campaign reports and dashboards;
- ad profitability / ROMI / ROAS;
- campaign diagnostics and optimization help;
- search-query/cluster statistics;
- bid/stake optimization and autobidder/bidder tools;
- agencies/courses/content noise.

## 4. Why existing evidence is insufficient

A10 tested the generic root `аналитика рекламы маркетплейсов` and returned only one direct phrase (`реклама маркетплейса аналитика` = 33). This is too shallow to represent the real seller-advertising job.

Current Wildberries seller documentation contains a much richer advertising-statistics vocabulary, and current market pages repeatedly use the exact category `Аналитика рекламы Wildberries`. Therefore marketplace-specific wording has clear incremental information gain and is not a redundant synonym probe.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current contract: GetTop returns last-30-days popular queries containing the supplied phrase plus similar queries; `numPhrases` supports up to 2000; response can contain `results[]`, `associations[]`, `totalCount`.

Method consequence: use this as a marketplace-specific lexical discovery probe and persist the full provider response before semantic interpretation.

### Wildberries official promotion-statistics surface

Source:

https://seller.wildberries.ru/instructions/en/ru/material/statistics-and-promotion-management

Updated 17.06.2026. Current WB documentation exposes:

- overall statistics across campaigns;
- campaign metrics;
- impressions, clicks, CTR, CPC, CR;
- spend;
- orders and order value;
- share of spend;
- CPO and CPM;
- average position;
- campaign and product statistics;
- extended statistics by search queries/catalog;
- recommendations to improve impressions, clicks, cart additions and orders.

This is direct evidence that analysis/diagnostics of advertising statistics is a real current seller job.

### Wildberries official DRR language

Source:

https://pro.wildberries.ru/insight/3D1cDmllZKqdNDJlcNHd6jHYZqq/3D1cJO4EKvo1OlSzgbpQiXpjENo

Published 12.06.2026. Wildberries explicitly uses `ДРР` for media advertising and `доля затрат` for WB Promotion and frames these metrics as tools for tracking advertising/promotion effectiveness.

### Current 2026 market-language evidence

Current pages use the exact category `Аналитика рекламы Wildberries` and repeatedly expand it with DRR, ROMI/ROAS, CTR, CPC, CPO, spend, orders and campaign profitability:

- https://rmagent.ru/articles/analitika-reklamy-wildberries-kak-schitat-drr-i-okupaemost-po-kampaniyam
- https://360mp.ru/reklama/
- https://metricpulse.ru/reklama-wildberries
- https://bublick.space/analitika-reklamy-wildberries/
- https://puredigit.ru/vozmozhnosti/reklama-wildberries/

These pages establish live search/market vocabulary; they do not create final SEO page ownership and do not override product truth.

## 6. Source -> method trace

| Question | Source | A11 use | Boundary |
|---|---|---|---|
| Can GetTop expose WB-specific ad language? | Yandex Wordstat.GetTop | full-depth marketplace-specific discovery | demand/language only, not page proof |
| What current WB metrics/jobs exist? | WB promotion statistics | retain campaign/statistics/metric/recommendation branches | launch remains analysis/read-only |
| Is DRR current official seller terminology? | WB Pro 2026 | retain DRR/share-of-spend branches | no assumption that DRR alone defines whole ad family |
| Is `аналитика рекламы Wildberries` live market language? | current 2026 analytics pages | justify exact marketplace-specific seed | market language != final target-page authority |

## 7. Information-gain contract

A11 must add information beyond A10 by:

1. testing whether naming Wildberries unlocks a richer advertising lexical surface;
2. discovering campaign-statistics and efficiency-metric language;
3. exposing DRR/CTR/CPC/CPO/ROMI/ROAS terminology if users actually search it;
4. discovering campaign/product/search-query report language;
5. separating analysis/help intent from bid-management/autobidder tools;
6. identifying clean follow-up seeds for DRR/statistics/campaign analysis only when actual returned evidence justifies them;
7. providing the WB half of a later paired WB-vs-Ozon advertising comparison;
8. informing later Yandex SERP verification of ad-analysis/help intent.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- WB_AD_ANALYTICS_CORE;
- CAMPAIGN_STATISTICS;
- DRR_SHARE_OF_SPEND;
- CTR_CPC_CPO_CPM_CR;
- SPEND_BUDGET;
- ORDERS_CONVERSION;
- PRODUCT_SKU_PERFORMANCE;
- SEARCH_QUERY_CLUSTER_STATS;
- PROFITABILITY_ROMI_ROAS;
- REPORT_DASHBOARD_TOOL;
- RECOMMENDATION_DIAGNOSTICS;
- AUTOBIDDER_BID_MANAGEMENT;
- AGENCY_SERVICE;
- EDUCATION_CONTENT;
- NOISE;
- HOLD.

`AUTOBIDDER_BID_MANAGEMENT` is retained as boundary evidence but is not counted as core Octoport acquisition demand merely because it concerns WB advertising.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would not erase the seller advertising task proven by current WB sources; it would mean users phrase the job through metrics such as DRR/statistics rather than the compound `аналитика рекламы`.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `аналитика рекламы wildberries`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- release a paired Ozon advertising-analysis probe unless the WB result or another authority proves no material information gain;
- release DRR/statistics/efficiency subfamilies separately only when they answer remaining named gaps;
- keep autobidder/bidder language as an explicit exclusion/boundary family;
- no page decision from raw counts;
- continue until marketplace-specific advertising language reaches family-level saturation.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A11_ANALITIKA_REKLAMY_WILDBERRIES_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

The cumulative M2R corpus is growing. After paired WB/Ozon advertising acquisition and one or two remaining major task families, proactively hand the complete accumulated M2R corpus to Work for cross-family reconciliation/adversarial QA if that provides positive quality gain. Resource economy is not a reason to avoid it.

## 13. Downstream decision

A11 does not create a page. It determines the Wildberries advertising search-language surface, which subfamilies require more acquisition, and what representative SERP checks are needed later.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain after A10 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official WB support | 10.0 |
| Current 2026 market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Autobidder boundary control | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A11_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A11 = 0
```
