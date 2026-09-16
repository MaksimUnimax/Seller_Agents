# M2R-A09 analysis — `маржинальность на маркетплейсах`

Date: 2026-09-16.
Status: `ANALYZED / FULL 3-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A09_MARZHINALNOST_NA_MARKETPLEYSAH_RESULT_2026-09-16.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `111`;
- direct `results[]`: `3` rows;
- associations: `18` rows;
- requested depth: `2000`;
- no provider failure;
- no depth-saturation signal.

`totalCount=111` is demand for this phrase family, not the number of returned phrases and not additive with child counts.

## 2. Full-row review

All 3 direct rows and all 18 associations were reviewed. No sampling was used.

Direct rows:

| Phrase | Count | Interpretation |
|---|---:|---|
| `маржинальность товара на маркетплейсе` | 33 | product-level profitability metric; strong seller-management fit |
| `какая маржинальность на маркетплейсах` | 26 | benchmark/expected-margin informational intent; can mix seller-management and generalized advice |
| `маржинальность на маркетплейсах это` | 14 | educational/definition intent |

Associations are mostly generic `маржа`, financial-trading, entity and `market` noise. They do not add usable marketplace-seller lexical branches.

## 3. What A09 proved

`маржинальность на маркетплейсах` is a real, clean but modest seller-finance family.

Unlike broad report/finance roots, the direct result surface contains:

- no 1C/accounting/posting contamination;
- no tax/statutory reporting contamination;
- no human-job/profession wording;
- no external-market brand/service clutter.

The family is primarily informational/metric-oriented rather than tool/service-oriented. The strongest direct phrase is product-level margin (`33`), followed by benchmark/definition questions.

## 4. Finance-family synthesis after A06-A09

The finance/profit acquisition loop now has four independently measured formulations:

### A06 — abstract category

`финансовая аналитика маркетплейсов`

- totalCount `64`;
- weak, non-expansive;
- dominant wording ambiguous with the human profession `финансовый аналитик`.

### A07 — concrete expert task

`юнит экономика маркетплейсов`

- totalCount `271`;
- 5 direct rows, all seller-task relevant;
- task/tool language: calculation, table, calculator, how-to;
- cleanest finance branch.

### A08 — broad business outcome

`прибыль на маркетплейсах`

- totalCount `389`;
- direct clean seller language: net profit, profit calculation, profit per product, profit from sales;
- material tax contamination through `налог на прибыль`.

### A09 — metric language

`маржинальность на маркетплейсах`

- totalCount `111`;
- 3 direct rows, all marketplace-relevant;
- product-margin / benchmark / definition intent;
- clean but small.

## 5. Finance-family saturation decision

The core finance/profit language map is now sufficiently represented for M2R discovery purposes:

- abstract finance category;
- unit economics;
- profit;
- product margin.

A further generic finance synonym is unlikely to materially change the task map. Additional finance probes should only be released later when a specific unresolved decision requires them (for example exact Ozon/WB finance wording or a SERP-discovered `рентабельность` branch).

```text
FINANCE_PROFIT_WORDSTAT_DISCOVERY = SATURATED_ENOUGH_FOR_NOW
MORE_GENERIC_FINANCE_PROBES = LOW_EXPECTED_INFORMATION_GAIN
FINANCE_SERP_VERIFICATION = REQUIRED_LATER
```

This is not a statement that all finance semantics are final. It means the family is represented well enough to move acquisition resources to a larger uncovered product job.

## 6. Product consequence

The finance evidence strongly supports the owner's product model:

`user's chosen AI + actual seller data -> calculate/explain unit economics, profit and margin in dialogue`.

The cleanest acquisition opportunities are concrete seller jobs rather than the label `финансовая аналитика`.

This does not imply separate pages for unit economics, profit and margin. Merge/split remains blocked on current SERP evidence and later clustering.

## 7. Next M2R family

Next major family: **advertising analysis/help**, excluding real-time autobidder intent.

Reason:

1. advertising analysis/help was identified in the owner-corrected product map as a genuine AI-employee job;
2. A01 surfaced only one explicit ad-analytics phrase: `реклама маркетплейса аналитика` = 33;
3. current Wordstat corpus still lacks a dedicated ad-analysis discovery pass;
4. Ozon/Wildberries expose advertising statistics and campaign data through their seller/advertising ecosystems;
5. specialized bid-management bots are a distinct market and must be separated rather than counted as Octoport core demand.

The first broad advertising query should test the category without hard-coding Ozon or WB yet, then marketplace-specific probes should follow when information gain justifies them.

## 8. Work decision

`WORK_NOW = NOT REQUIRED` for A09 itself; only 3 direct rows + 18 associations were reviewed completely.

However, M2R has now accumulated multiple analytics/report/finance branches. After the advertising family and one or two additional major task families are acquired, a proactive Work handoff for cross-family full-volume reconciliation becomes increasingly justified under the quality-first rule.

## 9. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Metric-vs-noise separation | 10.0 |
| Cross-finance synthesis | 10.0 |
| Saturation reasoning | 10.0 |
| Product-truth alignment | 10.0 |
| Observed-vs-inferred boundary | 10.0 |
| Avoidance of query inflation | 10.0 |
| Next-family routing | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream usefulness | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 10. Verdict

```text
M2R_A09 = CLOSED
DIRECT_ROWS_REVIEWED = 3/3
ASSOCIATIONS_REVIEWED = 18/18
MARGIN_FAMILY = VALID / CLEAN / MODEST
FINANCE_PROFIT_FAMILY = SATURATED_ENOUGH_FOR M2R
NEXT_MAJOR_FAMILY = ADVERTISING_ANALYSIS_HELP
AUTOBIDDER_CATEGORY = EXCLUDE_FROM_CORE / KEEP_AS_BOUNDARY_CONTROL
```
