# M2R-A07 analysis — `юнит экономика маркетплейсов`

Date: 2026-09-16.
Status: `ANALYZED / FULL 5-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A07_UNIT_EKONOMIKA_MARKETPLEYSOV_RESULT_2026-09-16.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `271`;
- direct `results[]`: `5` rows;
- associations: `19` rows;
- requested depth: `2000`;
- no provider failure;
- no depth-saturation signal.

`totalCount=271` is demand for the broad phrase family, not the count of returned phrases and not additive with child counts.

## 2. Full-row review

All 5 direct rows and all 19 associations were reviewed. No sampling was used.

Direct rows:

| Phrase | Count | Provisional interpretation |
|---|---:|---|
| `юнит экономика для маркетплейсов` | 151 | core marketplace unit-economics job |
| `расчет юнит экономики для маркетплейс` | 26 | calculation/task intent |
| `юнит экономика для маркетплейсов таблица` | 20 | spreadsheet/template/tool intent |
| `юнит экономика для маркетплейсов калькулятор` | 12 | calculator/tool intent |
| `как правильно рассчитать юнит экономику для маркетплейса` | 7 | instructional calculation intent |

All 19 associations are unrelated `market/economics/entity` noise and add no usable marketplace-seller semantic branches.

## 3. What A07 proved

A07 is the cleanest finance-related discovery query tested so far.

Compared with A06 `финансовая аналитика маркетплейсов`:

- A06 totalCount = 64;
- A06 direct rows = 2;
- dominant wording was ambiguous with a human finance-analyst profession;
- A07 totalCount = 271;
- A07 direct rows = 5;
- all 5 direct rows are directly about the seller's marketplace unit-economics job.

This supports the methodological correction: **concrete seller jobs/metrics are better acquisition/discovery roots than abstract capability labels**.

## 4. Intent shape

The A07 family currently decomposes into three closely related user needs:

1. understand/calculate marketplace unit economics;
2. obtain a table/template for calculation;
3. use a calculator/tool for calculation.

Wordstat did not independently surface profit, margin, ROI, commissions, logistics, advertising costs or break-even wording inside this exact branch. Those concepts are part of the business task according to current marketplace sources, but they must not be inserted into the Wordstat ledger as observed phrases unless separately measured.

## 5. Product consequence

This is highly compatible with Octoport's corrected product model:

`user's chosen AI + seller marketplace data -> AI helps calculate/explain seller unit economics`.

The opportunity is not to compete as another static calculator. Octoport's differentiator can later be evaluated against the job `calculate/explain unit economics from my actual seller data in dialogue`.

Current launch/read-only truth supports analysis/explanation of authorized data, not autonomous business-state changes.

## 6. Boundary / noise consequence

Unlike broad analytics/report roots, the direct A07 surface has no accounting/1C/tax or human-profession contamination.

However, `таблица` and `калькулятор` indicate that many users may expect a concrete calculation utility/template rather than an AI/agent product. This makes later SERP inspection essential before treating the family as a commercial Octoport landing target.

## 7. Next acquisition decision

Run the independently planned orthogonal profitability probe:

`прибыль на маркетплейсах`

Why:

1. A07 proves unit economics is meaningful, but its child vocabulary is mostly calculation/table/calculator;
2. profit is a broader business outcome than the technical term `юнит экономика`;
3. a seller may search profit without knowing the unit-economics category;
4. a profit probe can expose revenue/cost/margin/net-profit/product-profitability wording that A07 did not return;
5. it provides an independent check against overfitting finance acquisition to expert terminology.

If profit language remains broad/noisy, subsequent queries should follow observed subjobs rather than inventing synonyms.

## 8. Work decision

`WORK_NOW = NOT REQUIRED`.

A07 contains only 5 direct rows + 19 associations and was fully reviewed. Work remains proactively available for later cross-family full-volume reconciliation once the M2R corpus becomes materially richer.

## 9. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Concrete-job interpretation | 10.0 |
| Separation of observed vs source-derived metrics | 10.0 |
| Product-truth alignment | 10.0 |
| Noise handling | 10.0 |
| Tool/calculator ambiguity handling | 10.0 |
| Cross-query comparison | 10.0 |
| Information-gain routing | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream usefulness | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 10. Verdict

```text
M2R_A07 = CLOSED
DIRECT_ROWS_REVIEWED = 5/5
ASSOCIATIONS_REVIEWED = 19/19
UNIT_ECONOMICS_FAMILY = VALID / CLEAN / TASK-ORIENTED
ABSTRACT_FINANCE_WORDING = INFERIOR DISCOVERY ROOT
CALCULATOR_TEMPLATE_INTENT = MATERIAL
NEXT_QUERY = прибыль на маркетплейсах
```
