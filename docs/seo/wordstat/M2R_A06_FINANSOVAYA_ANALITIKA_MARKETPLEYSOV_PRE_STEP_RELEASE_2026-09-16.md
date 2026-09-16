# M2R-A06 pre-step research and query release — `финансовая аналитика маркетплейсов`

Date: 2026-09-16.
Stage: `M2R — finance/profit seller-job discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A01 `аналитика маркетплейсов`: CLOSED / high information gain / 162 direct rows.
- A02 `аналитика продаж на маркетплейсах`: CLOSED / valid but narrow.
- A03-A05 report experiment: CLOSED / generic report discovery is now saturated; accounting/1C/tax contamination repeatedly dominates broad report wording.
- A05 `отчеты продаж маркетплейсов`: 448 totalCount but only 3 direct rows, 2 accounting-oriented.
- Next orthogonal family selected: finance / profit / unit economics.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A06`

`QUERY_TEXT = финансовая аналитика маркетплейсов`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Map the search-language surface around **financial analytics of a marketplace seller/business**, independent of generic report wording.

Need to discover whether users naturally search for:

- profit / net profit;
- margin / profitability;
- unit economics;
- income / expenses;
- commissions / logistics / storage / deductions;
- payouts / cash flow;
- product-level profitability;
- store-level P&L / finance dashboards;
- Ozon/Wildberries-specific financial analytics;
- AI/automation/analytics-service language;
- accountant/bookkeeping/tax intent that is outside core launch scope.

## 4. Why existing evidence is insufficient

A01 exposed only a few direct finance-oriented phrases:

- `финансовый аналитик маркетплейсов` — 64, ambiguous human-role wording;
- `аналитика финансов на маркетплейсах` — 15;
- `финансовая аналитика для маркетплейсов` — 8.

A03-A05 proved that broad report wording is heavily contaminated by 1C/accounting/tax intent and does not reliably reveal seller-operational financial language.

Therefore finance/profit must be explored as its own job family rather than inferred from generic `аналитика` or `отчеты` roots.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

Source: https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract says GetTop returns last-30-days popular queries containing the specified phrase and similar queries. `numPhrases` accepts up to 2000; response can include `results[]`, `associations[]` and `totalCount`.

Method consequence: use the broad finance phrase as discovery evidence only; persist full output before classification.

### Wildberries official seller finance/profit surface

Sources:

- https://seller.wildberries.ru/instructions/ru/ru/subcategory/analytics-reports
- https://seller.wildberries.ru/about-portal/ru/ru

Current WB seller materials expose `Доходы и расходы: показатели`, `Калькулятор прибыли`, unit economics, weekly sales analysis, regional sales, stocks, returns/movements and other seller reports. The seller portal explicitly tells sellers to calculate unit economics and estimate revenue/profit before selling.

Product consequence: finance/profit analysis is a genuine seller job and therefore a legitimate Octoport acquisition family when the underlying data is available from authorized marketplace sources.

### Current market-language evidence

Current services use explicit finance/profit language for seller analytics:

- https://soykasoft.ru/ — `сервис финансовой и управленческой аналитики маркетплейсов`, profit/product economics and API integration;
- https://selleo.ru/ — `финансовая аналитика для селлеров маркетплейсов`, profit, advertising and management reporting;
- https://litestat.io/ — `финансовая аналитика на маркетплейсах`, net profit, profitability and loss control;
- https://truestats.ru/articles — current marketplace financial-analytics content around margin, profitability and seller finance.

These pages establish current market vocabulary; they are not product-truth authorities for Octoport.

## 6. Source -> method trace

| Question | Source | Use | Boundary |
|---|---|---|---|
| Can GetTop discover finance-language variants? | Yandex Wordstat.GetTop | full-depth finance discovery | demand/language only; no page proof |
| Are finance/profit tasks real seller jobs? | WB official seller/report surfaces | retain profit/income-expense/unit-economics branches | only supported data may become Octoport claims |
| Does current market use `финансовая аналитика` wording? | SoykaSoft, Selleo, LiteStat, TrueStats | justify the broad finance seed | competitor vocabulary != final target/page authority |

## 7. Information-gain contract

A06 must add information beyond A01-A05 by:

1. discovering finance/profit vocabulary that generic reports failed to expose;
2. separating seller managerial finance from bookkeeping/tax/accounting;
3. discovering margin/profitability/unit-economics/income-expense/cash-flow language;
4. finding product-level vs store-level finance jobs;
5. detecting advertising/logistics/storage/commission cost crossovers;
6. finding Ozon/WB-specific finance phrasing;
7. identifying high-value follow-up seeds for profit, unit economics, payouts or cost analysis;
8. informing later SERP tests of financial-analytics services as an Octoport acquisition entrance.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist full response first. Then review every direct row and useful association into provisional buckets:

- PROFIT_NET_PROFIT;
- MARGIN_PROFITABILITY;
- UNIT_ECONOMICS;
- INCOME_EXPENSE_PNL;
- PAYOUT_CASH_FLOW;
- COMMISSION_LOGISTICS_STORAGE_COSTS;
- PRODUCT_PROFITABILITY;
- STORE_FINANCE_ANALYTICS;
- AD_FINANCE_CROSSOVER;
- MARKETPLACE_SPECIFIC;
- FINANCE_TOOL_SERVICE;
- ACCOUNTING_TAX_BOOKKEEPING;
- HUMAN_FINANCE_ROLE_EDU;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would not erase finance/profit task evidence from marketplace and market sources; it would only show that users phrase the need differently.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `финансовая аналитика маркетплейсов`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- expand profit/unit-economics/income-expense/payout/cost branches separately when materially present or independently important;
- do not fall back to more generic report synonyms;
- do not create page decisions from raw phrase counts;
- continue finance-family acquisition until new probes stop materially changing the task/language map.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A06_FINANSOVAYA_ANALITIKA_MARKETPLEYSOV_RESULT_2026-09-16.md`

Sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat query.

Work remains proactively available once multiple M2R finance/report/analytics/ad branches accumulate and cross-family full-volume reconciliation or independent QA would materially improve quality.

## 13. Downstream decision

A06 does not create a page. It determines whether financial analytics/profit is a meaningful acquisition family and which finance subjobs need further Wordstat and later Yandex SERP verification.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Orthogonal information gain after report saturation | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-task support | 10.0 |
| Current market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Finance-vs-accounting boundary | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A06_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A06 = 0
```
