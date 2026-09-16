# M2R-A01 pre-step research and query release — `аналитика маркетплейсов`

Date: 2026-09-16.
Stage: `M2R — demand reacquisition after owner product correction`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Roadmap / cursor

- M0 product truth: OWNER-CORRECTED — Octoport turns the user's chosen supported AI into a marketplace employee; Octoport is not the AI employee itself.
- historical M2 B01+B02: preserved and usable, but current direct pool is only 195 unique phrase strings and is coverage-skewed.
- M2R task-family coverage audit: PASS; F3 seller analytics/reports = MATERIAL GAP.
- M3 S01-S03: valid and closed for the AI-agent entrance.
- old S04+ release order: paused until M2R coverage gaps are repaired.
- M7 Collection Freeze: blocked.

## 2. Query identity

`QUERY_ID = M2R-A01`

`QUERY_TEXT = аналитика маркетплейсов`

Provider operation:

`Wordstat.GetTop`

## 3. Open decision

What search-language universe sits under the broad established category `аналитика маркетплейсов`, and how much of it corresponds to jobs Octoport can serve by turning the user's chosen AI into an analyst/helper over seller and marketplace data?

Need to distinguish at least:

- seller-owned/internal analytics;
- reports/finance/profit/sales/stocks/returns/funnel;
- advertising analytics;
- search-query/search-demand/niche analytics;
- external competitor/market-intelligence;
- service/comparison language;
- marketplace-specific Ozon/WB wording;
- education/noise.

This query does **not** assume all marketplace analytics demand belongs to Octoport.

## 4. Why existing evidence is insufficient

Existing M2 evidence used:

- `сервис аналитики маркетплейсов` — totalCount 756, but its direct rows were strongly shaped by service/brand/top/review wording;
- `сервис аналитика продаж на маркетплейсах` — 39;
- `сервис для аналитики продаж на маркетплейсах` — 19;
- `сервис внутренней аналитики маркетплейсов` — 19;
- `ии для аналитики маркетплейсов` — 15;
- `аналитика маркетплейсов с ии` — 13.

These probes do not provide a broad lexical map of the established analytics category without forcing either `сервис` or `ИИ` into the request.

Current live market pages use the exact generic wording `аналитика маркетплейсов` and expose sub-jobs such as seller reports, finances, orders, sales, stocks, advertising and search queries. Therefore the generic root has material incremental information gain.

## 5. Fresh external method / market research — 2026-09-16

### Official Yandex Wordstat contract

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current provider documentation states that GetTop returns last-30-days popular queries containing the supplied phrase and similar queries; `numPhrases` can be set up to 2000; response can include `results[]`, `associations[]` and `totalCount`.

Method consequence: this is a valid broad discovery probe; returned rows must be preserved before semantic classification.

### Official Yandex Webmaster query selection / market analysis

https://yandex.ru/support/webmaster/ru/service/queries-selection

Current guidance explicitly recommends finding non-obvious query formulations and groups queries by meaning/user intent, plus studying popular sites/pages.

Method consequence: we search the user-job language first; later SERP evidence determines page/intent clustering. Raw Wordstat phrases do not directly become pages.

### Official Wildberries analytics surface

https://seller.wildberries.ru/instructions/ru/kz/category/analytics
https://seller.wildberries.ru/instructions/ru/ru/subcategory/search-analytics
https://seller.wildberries.ru/instructions/ru/ru/subcategory/trading-platform-analytics

Current WB seller documentation exposes seller analytics, stocks, search analytics, business-development analytics, niche analysis, card comparison, income/expense reports, profit calculator, regional sales and other report families. It also confirms that search-query reporting can be obtained via public API.

Product consequence: several analytics sub-jobs are genuine Octoport-adjacent jobs, while broad external-market claims remain source-bounded.

### Current market-language examples

- https://analitika-marketpleysov.ru/features
- https://reccora.ru/analytics/marketplaces
- https://marketdash.ru/

Current pages use `аналитика маркетплейсов` for API-connected seller-data aggregation and reports around finance, orders, sales, stocks, profit, advertising and search queries.

These examples support the existence of the category language; they do not prove all of their features are Octoport capabilities or final SEO targets.

## 6. Source -> method trace

| Evidence question | Source | M2R-A01 use | Boundary |
|---|---|---|---|
| What does GetTop return? | Yandex AI Studio Wordstat.GetTop | broad discovery with full results/associations persistence | Wordstat = demand/language, not intent/page proof |
| Should non-obvious variants be sought? | Yandex Webmaster query selection | inspect all returned lexical branches, not only expected terms | no keyword becomes target automatically |
| Are seller analytics/report jobs real marketplace tasks? | official WB analytics/help | retain seller/report/search/niche branches for deeper verification | only source-confirmed capabilities can support product claims |
| Is `аналитика маркетплейсов` current market language? | current analytics product pages | justify generic seed instead of only `сервис ...` | competitors are market-language evidence, not copy authority |

## 7. Information-gain contract

`EXPECTED_INCREMENTAL_INFORMATION_GAIN`:

1. discover generic analytics vocabulary omitted by the old `сервис ...` and `ИИ ...` seeds;
2. quantify whether the direct children naturally decompose into seller-owned reports vs external market intelligence;
3. expose report/task vocabulary suitable for new targeted probes;
4. discover Ozon/WB-specific analytics wording;
5. identify ad/search/niche/report subfamilies that deserve their own M2R queries;
6. provide a better basis for representative M3 SERP selection.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the full response first. Then classify every returned `results[]` phrase and materially useful association into provisional task buckets:

- SELLER_INTERNAL_ANALYTICS;
- REPORTS_FINANCE_PROFIT;
- SALES_STOCKS_RETURNS_FUNNEL;
- AD_ANALYTICS;
- SEARCH_NICHE_MARKET_ANALYTICS;
- EXTERNAL_COMPETITOR_INTELLIGENCE;
- MARKETPLACE_SPECIFIC;
- SERVICE_COMPARISON;
- EDUCATION;
- NOISE;
- HOLD.

No destructive exclusion from one token/substr alone.

### SUCCESS_WITH_ZERO / EMPTY BODY

Preserve exactly. It would apply only to this exact broad request form and would not erase existing analytics-category evidence.

### TECHNICAL_FAILURE / UNKNOWN

Persist the exact error. No semantic conclusion and no blind retry.

## 9. Provider request / depth contract

Use:

- method: `getTop`;
- phrase: `аналитика маркетплейсов`;
- `numPhrases`: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Depth justification:

This is intentionally broad reacquisition. Official maximum is 2000. Quality is the priority and there is no owner cost cap. Using maximum response depth minimizes avoidable discovery truncation. Returned row volume, not `totalCount`, will determine whether any depth boundary was approached.

## 10. Cost / retry / stop

`COST_IS_NOT_A_DECISION_GATE = true`.

No blind retry. One execution identity only until its exact outcome is persisted/read back/analyzed.

Stop/reopen rules:

- if returned rows saturate or expose several high-value branches, release targeted children separately;
- do not recursively query every child without named decision value;
- continue family acquisition until new probes stop materially changing the task/language map.

## 11. Persistence path

Planned raw evidence:

`docs/seo/wordstat/raw/M2R_A01_ANALITIKA_MARKETPLEYSOV_2026-09-16.md`

Required sequence:

`full provider envelope -> raw persist -> remote readback -> analysis -> progress/ledger -> only then next provider query`.

## 12. Work trigger

Pre-query corpus is small enough for Main Chat. Post-response trigger is **quality-based**:

- if A01 returns a large/deep phrase set or if cross-family classification would be materially more reliable in Work, prepare full-volume Work handoff;
- never sample or first-N merely to avoid Work/token use.

`WORK_NOW = NOT REQUIRED BEFORE THIS SINGLE QUERY`.

## 13. Downstream decision

A01 does not create a page. It determines:

- which analytics/report subfamilies deserve targeted Wordstat calls;
- which phrases should later receive ordinary Yandex SERP verification;
- whether classic analytics-service demand is a meaningful acquisition entrance for Octoport;
- which portions are outside product/source truth and need EXCLUDE/HOLD.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain | 10.0 |
| Fresh official method support | 10.0 |
| Current market-language support | 9.5 |
| Product-truth alignment | 10.0 |
| Capability/source boundary | 9.5 |
| Depth justification | 10.0 |
| Failure/zero semantics | 10.0 |
| Work/resource rule compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 99/100`
`QUALITY_SCORE = 9.9/10`

## 15. Release verdict

```text
M2R_A01_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
WORK_PRE_QUERY = NOT_REQUIRED
PROVIDER_COMMANDS_EXECUTED_FOR_A01 = 0
```

Plain meaning: first fill the biggest missing acquisition entrance — generic marketplace analytics — without forcing `ИИ` or `сервис` into the user's wording. Collect the full lexical surface, then split seller reports/analytics from external market intelligence and other noise before deciding which subfamilies deserve Search verification.