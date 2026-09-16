# M2R-A09 pre-step research and query release — `маржинальность на маркетплейсах`

Date: 2026-09-16.
Stage: `M2R — concrete finance/profit metric discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A06 `финансовая аналитика маркетплейсов`: CLOSED / weak abstract category root.
- A07 `юнит экономика маркетплейсов`: CLOSED / clean seller-task family / totalCount 271.
- A08 `прибыль на маркетплейсах`: CLOSED / material broader outcome family / totalCount 389, with tax contamination.
- A08 exposed clean-profit/calculation/product-profit/sales-profit language but did not expose direct margin/profitability wording.
- Finance-family remains open for one independent margin/profitability probe before saturation reassessment.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A09`

`QUERY_TEXT = маржинальность на маркетплейсах`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Test whether sellers use **margin / profitability** as an independent search language for the same financial-management problem, rather than only `прибыль` or `юнит экономика`.

Need to discover whether users naturally search for:

- margin/margin percentage;
- profitability / return;
- how to calculate margin;
- product/category margin;
- commissions/logistics/storage/ads as margin drivers;
- price-setting and break-even;
- Ozon/Wildberries-specific margin wording;
- calculators/templates/services;
- high-margin product/niche external-market intent;
- education/content noise.

## 4. Why existing evidence is insufficient

A07 and A08 prove seller profitability demand through two different languages:

- unit economics — technical calculation/tool intent;
- profit — broader business outcome, with tax contamination.

Neither returned direct Wordstat phrases containing `маржинальность` or `рентабельность`. Current marketplace and market sources use these terms as first-class seller metrics, so one independent metric probe has material information gain.

## 5. Fresh external research — 2026-09-16

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract: GetTop returns last-30-days popular phrase-containing and similar queries, supports `numPhrases` up to 2000, and can return `results[]`, `associations[]`, `totalCount`.

Method consequence: use the metric phrase as discovery evidence only; persist full provider output before interpretation.

### Wildberries official/current seller language

Source:

https://seller.wildberries.ru/about-portal/ru/ru

Current seller portal explicitly surfaces the topic `Юнит-экономика и маржинальность: как посчитать прибыль`.

Product consequence: margin is a current seller-management metric and a legitimate acquisition/job family when based on authorized seller data.

### Current 2026 market-language evidence

https://secrets.tbank.ru/online-torgovlya/9-sposobov-uvelichit-marju/

Published 2026-08-28. Current seller-focused material explicitly uses `маржинальность товара на маркетплейсах` / `увеличить маржу на маркетплейсе` and connects margin with prices, expenses, stocks and turnover.

https://mpmgr.ru/blog/business/marzhinalnost-prostymi-slovami-marketpleysy

Published 2026-07-04. Uses exact category `Маржинальность на маркетплейсах` and distinguishes margin from markup and profitability for Wildberries/Ozon sellers.

https://mpmgr.ru/docs/features/analytics/wildberries/unit-economics

Published 2026-07-01. Current unit-economics documentation calculates profit, margin and profitability and defines margin as profit as a percentage of sale price/revenue.

These current pages establish live seller terminology; they do not create final SEO page authority by themselves.

## 6. Source -> method trace

| Question | Source | A09 use | Boundary |
|---|---|---|---|
| Can GetTop expose margin variants? | Yandex Wordstat.GetTop | max-depth metric discovery | Wordstat = language/demand, not page proof |
| Is margin a current marketplace seller metric? | WB seller portal | retain genuine seller-margin branches | only supported data may become product claims |
| Is the exact language current in 2026? | T-Bank, MP Manager | justify independent margin probe | editorial/market language != final target-page decision |

## 7. Information-gain contract

A09 must add information beyond A07/A08 by:

1. measuring margin/profitability language directly;
2. exposing calculation/formula/price-setting wording if present;
3. detecting commission/logistics/storage/ad cost crossovers;
4. separating seller-managerial margin from `high-margin products/niches` external-market discovery;
5. finding marketplace-specific Ozon/WB formulations;
6. determining whether margin deserves later separate SERP verification or can remain a supporting lexical family;
7. deciding whether finance/profit Wordstat discovery has reached sufficient saturation to move to advertising analytics.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Review every direct row and useful association into provisional buckets:

- MARGIN_CORE;
- PROFITABILITY_RETURN;
- CALCULATION_FORMULA;
- PRICE_BREAK_EVEN;
- COMMISSION_LOGISTICS_STORAGE_COST;
- AD_COST_CROSSOVER;
- PRODUCT_LEVEL_MARGIN;
- MARKETPLACE_SPECIFIC;
- CALCULATOR_TEMPLATE_TOOL;
- HIGH_MARGIN_PRODUCT_NICHE;
- SERVICE_ANALYTICS;
- EDUCATION_CONTENT;
- NOISE;
- HOLD.

### SUCCESS_EMPTY/ZERO

Preserve exactly. A weak exact phrase would not erase the metric/task relevance proven by current seller sources; it would show that users express the task through profit/unit-economics wording.

### TECHNICAL_FAILURE/UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `маржинальность на маркетплейсах`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- reassess finance-family saturation across A06-A09;
- only run further finance metric probes if they answer a remaining named decision gap;
- likely next major M2R family after finance saturation is advertising analytics/help, which remains a major uncovered acquisition family;
- no page decision from raw counts.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A09_MARZHINALNOST_NA_MARKETPLEYSAH_RESULT_2026-09-16.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> finance saturation decision -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

Work remains proactively authorized for later cross-family full-volume reconciliation when accumulated M2R analytics/report/finance/ad/help ledgers justify it.

## 13. Downstream decision

A09 does not create a page. It completes the currently planned finance/profit metric discovery loop and determines whether margin should receive later SERP verification or remain supporting semantics.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official seller-language support | 10.0 |
| Current 2026 market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Margin-vs-niche boundary control | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A09_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A09 = 0
```
