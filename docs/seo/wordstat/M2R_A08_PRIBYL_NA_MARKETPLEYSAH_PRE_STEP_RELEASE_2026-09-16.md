# M2R-A08 pre-step research and query release — `прибыль на маркетплейсах`

Date: 2026-09-16.
Stage: `M2R — concrete finance/profit seller-job discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A01 `аналитика маркетплейсов`: CLOSED / high information gain.
- A03-A05 generic report family: CLOSED / saturated enough / accounting-heavy.
- A06 `финансовая аналитика маркетплейсов`: CLOSED / weak and non-expansive.
- A07 `юнит экономика маркетплейсов`: CLOSED / clean task-oriented family; totalCount 271; 5 direct rows all seller-task relevant.
- A07 direct language centers on calculation/table/calculator/how-to and does not independently expose broader profit language.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A08`

`QUERY_TEXT = прибыль на маркетплейсах`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Map how marketplace sellers search for the broader business outcome **profit**, without requiring expert terms such as `юнит-экономика` or abstract labels such as `финансовая аналитика`.

Need to discover whether users naturally search for:

- profit / net profit;
- how to calculate profit;
- marketplace seller earnings/income;
- margin / profitability;
- commissions / logistics / storage / advertising as profit drivers;
- unit-economics crossover;
- calculators/templates/services;
- Ozon/Wildberries-specific profit wording;
- how to preserve/increase profit;
- tax/accounting-only intent;
- generic entrepreneurial/course/content noise.

## 4. Why existing evidence is insufficient

A07 validates the concrete finance task but its direct vocabulary is strongly centered on `расчет`, `таблица`, `калькулятор` and `как рассчитать` under the technical category `юнит экономика`.

A seller can care about profit without knowing or using that term. Current 2026 market language explicitly uses the broad phrase `прибыль на маркетплейсах`, so a separate probe has material information gain and protects against overfitting the semantic model to expert vocabulary.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract: GetTop returns last-30-days popular queries containing the requested phrase plus similar queries; `numPhrases` supports up to 2000; responses can contain `results[]`, `associations[]`, `totalCount`.

Method consequence: use `прибыль на маркетплейсах` as a broad outcome-oriented discovery seed; preserve all provider rows before interpretation.

### Wildberries official seller profit/finance language

https://seller.wildberries.ru/about-portal/ru/ru

The current seller portal explicitly tells sellers to calculate unit economics to estimate revenue and profit before selling.

https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports

Current report surface includes `Калькулятор прибыли`, `Доходы и расходы`, and `Юнит-экономика`.

https://seller.wildberries.ru/instructions/ru/by/material/djem-subscription-options-by

Current documentation says `Доходы и расходы` shows how final financial result is formed, while `Юнит-экономика` calculates margin and ROI by product and helps identify unprofitable items and understand how costs affect profit.

Product consequence: profit is a genuine seller-management job grounded in current marketplace data/reporting.

### Current 2026 market-language evidence

https://secrets.tbank.ru/trendy/kak-selleru-sohranit-pribyl-v-2026-godu/

Current T-Bank material uses the exact concept `прибыль на маркетплейсах` and discusses seller profit under changing marketplace commissions.

https://pay.yandex.ru/blog/articles/chto-zhdyot-prodavcov-na-marketplejsah

Current 2026 Yandex material likewise frames marketplace selling around rising commissions, more precise calculations and preserving profit.

These sources establish current language/problem relevance; they do not establish final target pages or Octoport product claims.

## 6. Source -> method trace

| Question | Source | A08 use | Boundary |
|---|---|---|---|
| Can GetTop discover profit-language variants? | Yandex Wordstat.GetTop | max-depth outcome discovery | Wordstat = language/demand, not page proof |
| Is profit a current seller task? | WB official portal/reports | retain profit/cost/margin/unit-economics branches | only supported data may become product claims |
| Is `прибыль на маркетплейсах` current market language? | T-Bank 2026, Yandex 2026 | justify independent broad profit seed | editorial content != final SEO authority |

## 7. Information-gain contract

A08 must add information beyond A07 by:

1. testing non-expert outcome language around profit;
2. discovering net-profit/margin/profitability/earnings wording;
3. exposing cost-driver language such as commissions, logistics, storage and advertising;
4. measuring overlap with unit-economics terminology;
5. distinguishing seller-management profit intent from generic `how much sellers earn`/course/content intent;
6. finding Ozon/Wildberries-specific profit formulations;
7. identifying later probes such as `маржинальность маркетплейсов` only if actual evidence or unresolved task need justifies them;
8. informing future SERP verification of profit/calculation/service intent.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist full response first. Then review every direct row and useful association into provisional buckets:

- PROFIT_CORE;
- NET_PROFIT;
- PROFIT_CALCULATION;
- SELLER_EARNINGS_INCOME;
- MARGIN_PROFITABILITY;
- UNIT_ECONOMICS_CROSSOVER;
- COMMISSION_LOGISTICS_STORAGE_COSTS;
- AD_COST_CROSSOVER;
- MARKETPLACE_SPECIFIC;
- CALCULATOR_TEMPLATE_TOOL;
- SERVICE_ANALYTICS;
- EDUCATION_CONTENT_COURSE;
- ACCOUNTING_TAX;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would not erase the profitability task proven by A07/current seller sources; it would mean users express it through other terminology.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `прибыль на маркетплейсах`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the quality-first owner rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- expand margin/profitability/cost-driver branches only when they add material information;
- do not infer a page from raw phrase volume;
- retain `юнит экономика` and `прибыль` as separate lexical families until SERP evidence demonstrates merge/split behavior;
- continue finance/profit acquisition until additional probes stop materially changing the task/language map.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A08_PRIBYL_NA_MARKETPLEYSAH_RESULT_2026-09-16.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

Work remains proactively authorized once enough M2R analytics/report/finance/ad/help branches accumulate for cross-family full-volume reconciliation or independent QA.

## 13. Downstream decision

A08 does not create a page. It determines whether broad profit language is a meaningful acquisition family, how it relates to unit economics, and which finance/cost subjobs deserve further Wordstat and later Yandex SERP verification.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Orthogonal information gain after A07 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-task support | 10.0 |
| Current 2026 market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Profit-vs-earnings/content ambiguity control | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A08_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A08 = 0
```
