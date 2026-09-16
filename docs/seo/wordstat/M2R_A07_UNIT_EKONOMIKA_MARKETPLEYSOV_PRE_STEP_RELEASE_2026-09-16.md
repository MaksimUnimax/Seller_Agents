# M2R-A07 pre-step research and query release — `юнит экономика маркетплейсов`

Date: 2026-09-16.
Stage: `M2R — concrete finance/profit seller-job discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A01 `аналитика маркетплейсов`: CLOSED / high information gain.
- A02 `аналитика продаж на маркетплейсах`: CLOSED / real but lexically narrow.
- A03-A05 generic report experiment: CLOSED / saturated; accounting/1C/tax contamination repeatedly dominates.
- A06 `финансовая аналитика маркетплейсов`: CLOSED / weak and non-expansive; 2 direct rows, dominant wording ambiguous with human profession.
- Finance/profit family therefore moves from abstract category wording to concrete seller metrics/tasks.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A07`

`QUERY_TEXT = юнит экономика маркетплейсов`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Map current search language around marketplace seller **unit economics**, using a concrete seller business task rather than the abstract category `финансовая аналитика`.

Need to discover whether users naturally search for:

- unit economics of marketplace selling;
- profit / net profit;
- margin / profitability;
- ROI;
- break-even;
- product profitability;
- commission / logistics / storage costs;
- advertising costs and DRR/ROAS crossover;
- returns / buyouts / cancellations as cost drivers;
- calculators/templates/services;
- Ozon/Wildberries-specific unit-economics wording;
- education/course/calculator noise;
- generic e-commerce/unit-economics use outside marketplaces.

## 4. Why existing evidence is insufficient

A06 showed that `финансовая аналитика маркетплейсов` does not expose concrete seller finance language: only two direct rows appeared and the dominant row was the human-role phrase `финансовый аналитик маркетплейсов` = 64.

Earlier A01 surfaced only small finance phrases (`аналитика финансов ...` = 15; `финансовая аналитика ...` = 8) and did not expose profit/margin/unit-economics branches.

Therefore a concrete metric/task term is required.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Use: last-30-days phrase-containing and similar-query discovery at up to 2000 phrases. Wordstat remains demand/language evidence, not final intent/page proof.

### Wildberries official seller language

Current official WB seller surfaces explicitly use unit-economics and profit language:

- seller portal step: `Посчитайте юнит-экономику` and estimate revenue/profit;
- report family includes `Отчёт «Юнит-экономика»` and `Калькулятор прибыли`;
- current `Джем` documentation states that the unit-economics report shows income/expenses and calculates margin and ROI by product, helps identify unprofitable products, understand cost impact on profit, and make pricing/assortment decisions.

Sources:

- https://seller.wildberries.ru/about-portal/ru/ru
- https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports
- https://seller.wildberries.ru/instructions/ru/by/material/djem-subscription-options-by

### Current 2026 market-language evidence

Current marketplace seller content uses the exact category `юнит-экономика маркетплейсов` and expands it through profit, commissions, margin, profitability and break-even.

Example:

- https://mpmgr.ru/blog/reports/unit-ekonomika-marketpleysy-polnyj-gajd

Current Yandex Direct material also frames marketplace sales analytics around whether trading produces profit and which metrics/tools are needed.

- https://direct.yandex.ru/base/articles/analiz-prodazh-na-marketplejse

These current pages establish that concrete profitability/unit-economics wording is live market language. They do not create final SEO targets by themselves.

## 6. Source -> method trace

| Question | Source | A07 use | Boundary |
|---|---|---|---|
| Can GetTop expose unit-economics variants? | Yandex Wordstat.GetTop | full-depth concrete-job discovery | demand/language only |
| Is unit economics a real current seller task? | WB official seller portal/reports | retain profit/margin/ROI/cost branches | only supported data may become Octoport claims |
| Does current market use this language? | MPMGR 2026, Yandex Direct 2026 | justify concrete seller-term seed | content source != page authority |

## 7. Information-gain contract

A07 must add information beyond A06 by:

1. testing a concrete seller-finance term instead of abstract finance-category wording;
2. discovering profit/margin/profitability/ROI/break-even language;
3. exposing cost-driver terms such as commissions, logistics, storage, advertising and returns;
4. distinguishing calculators/templates/education from analysis/service intent;
5. finding Ozon/Wildberries-specific unit-economics formulations;
6. identifying strong follow-up seeds such as `прибыль на маркетплейсах`, `маржинальность маркетплейсов`, or marketplace-specific unit economics;
7. informing later SERP tests for finance/profit acquisition jobs.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the full response first. Then review every direct row and useful association into provisional buckets:

- UNIT_ECONOMICS_CORE;
- PROFIT_NET_PROFIT;
- MARGIN_PROFITABILITY_ROI;
- BREAK_EVEN;
- COMMISSION_LOGISTICS_STORAGE_COSTS;
- AD_COST_CROSSOVER;
- RETURNS_BUYOUTS_CANCELLATIONS;
- PRODUCT_PROFITABILITY;
- MARKETPLACE_SPECIFIC;
- CALCULATOR_TEMPLATE_TOOL;
- SERVICE_ANALYTICS;
- EDUCATION_COURSE;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would not erase the seller profitability task; it would mean users phrase the job differently and would increase the value of the independent `прибыль на маркетплейсах` probe.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `юнит экономика маркетплейсов`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- run `прибыль на маркетплейсах` independently regardless of A07 size if the finance-family language remains incomplete;
- expand margin/profitability/ROI/cost branches separately when they add material information;
- do not infer final page count from phrase count;
- stop only when finance/profit family queries stop materially changing the task/language map.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A07_UNIT_EKONOMIKA_MARKETPLEYSOV_RESULT_2026-09-16.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

Work remains proactively authorized once enough M2R analytics/report/finance/ad/help ledgers accumulate and cross-family full-volume reconciliation or independent QA materially improves reliability.

## 13. Downstream decision

A07 does not create a page. It tests concrete seller profitability language and determines the next finance/profit probes and later representative Yandex SERP checks.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Orthogonal information gain after A06 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-language support | 10.0 |
| Current market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Metric-vs-profession ambiguity control | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A07_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A07 = 0
```
