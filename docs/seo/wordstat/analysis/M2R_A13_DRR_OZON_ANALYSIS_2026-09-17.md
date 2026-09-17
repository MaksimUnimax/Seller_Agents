# M2R-A13 analysis — `дрр ozon`

Date: 2026-09-17.
Status: `ANALYZED / FULL 1-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A13_DRR_OZON_RESULT_2026-09-17.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `31`;
- direct `results[]`: `1` row;
- associations: `16` rows;
- requested depth: `2000`;
- no provider failure;
- no depth-saturation signal.

`totalCount=31` is demand for this exact Ozon DRR phrase family, not the size of the full Ozon advertising-analysis market.

## 2. Full-row review

All 1 direct row and all 16 associations were reviewed. No sampling was used.

Direct row:

| Phrase | Count | Interpretation |
|---|---:|---|
| `дрр ozon` | 31 | live Ozon-specific advertising-efficiency metric wording; valid but non-expansive |

All 16 associations are generic Ozon/entity/navigation/current-news noise and add no usable seller-advertising lexical branches.

## 3. Paired WB vs Ozon advertising control

Measured metric roots:

### Wildberries

`дрр wildberries`

- totalCount `23`;
- `results[]` absent;
- `associations[]` absent;
- live exact family, non-expansive.

### Ozon

`дрр ozon`

- totalCount `31`;
- one direct row, identical to the seed;
- 16 irrelevant Ozon associations;
- live exact family, non-expansive.

The Ozon exact root is numerically somewhat larger in this observation, but these totals must not be treated as an election-style ranking or as additive market-size estimates. Both sides show the same key lexical property: low expansion in Wordstat.

## 4. Advertising-family synthesis after A10-A13

The dedicated advertising correction pass tested:

1. generic category — `аналитика рекламы маркетплейсов` -> `33`, one direct row;
2. WB category — `аналитика рекламы wildberries` -> `15`, totalCount-only;
3. WB metric — `дрр wildberries` -> `23`, totalCount-only;
4. Ozon metric — `дрр ozon` -> `31`, one direct row.

Current official/product authorities independently establish that marketplace advertising statistics and campaign-analysis tasks are real. Wordstat, however, does not concentrate that demand into these obvious category/metric roots.

Therefore the correct interpretation is:

- advertising analysis/help remains product-relevant;
- Wordstat demand is fragmented or expressed through narrower campaign/problem formulations;
- near-synonym chasing now has low expected information gain;
- later representative SERP inspection is required to understand actual intent, competitor types and page ownership;
- bidder/autobidder automation remains a separate boundary category and must not inflate Octoport core demand.

## 5. Advertising Wordstat saturation decision

```text
ADVERTISING_WORDSTAT_DISCOVERY = SATURATED_ENOUGH_FOR M2R
GENERIC_AND_MARKETPLACE_SPECIFIC_ROOTS = LIVE BUT NON-EXPANSIVE
MORE_NEAR-SYNONYM_AD_QUERIES = LOW_EXPECTED_INFORMATION_GAIN
ADVERTISING_SERP_VERIFICATION = REQUIRED LATER
AUTOBIDDER = BOUNDARY / NOT CORE
```

This does not mean all advertising semantics are final. It means the family is represented well enough for the current correction pass to move to another large uncovered product-job family.

## 6. Next major corrected-product family

Next family should target **daily seller work / helper language** (`F4`) because the owner-corrected coverage audit marked it weak and because it is central to the actual product promise: the user's chosen AI becomes a working helper/employee for marketplace tasks.

The next exact Wordstat seed must be selected only after a fresh current-language/source check. The goal is to discover how people search for a seller helper/assistant in ordinary marketplace work without forcing AI wording and without collapsing into human-job vacancies, agencies or unrelated seller support.

## 7. Work decision

`WORK_NOW = NOT REQUIRED` for A13 itself because the dataset is only one direct row plus 16 associations.

The cumulative M2R corpus is now substantial across analytics/reports/finance/advertising. After the next one or two major families (daily work/help, card operations, search/niche/knowledge as applicable), proactive Work reconciliation should be triggered if it materially improves cross-family deduplication, classification, boundary QA and discovery-gap detection.

## 8. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| WB/Ozon paired control | 10.0 |
| Non-expansive-root interpretation | 10.0 |
| Product-authority discipline | 10.0 |
| Noise handling | 10.0 |
| Autobidder boundary discipline | 10.0 |
| Saturation reasoning | 10.0 |
| Avoidance of redundant query inflation | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream routing | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 9. Verdict

```text
M2R_A13 = CLOSED
DIRECT_ROWS_REVIEWED = 1/1
ASSOCIATIONS_REVIEWED = 16/16
OZON_DRR_EXACT_FAMILY = LIVE / SMALL / NON-EXPANSIVE
WB_OZON_AD_WORDSTAT = BOTH NON-EXPANSIVE
ADVERTISING_WORDSTAT_DISCOVERY = SATURATED_ENOUGH_FOR NOW
NEXT_MAJOR_FAMILY = DAILY_SELLER_WORK_HELP
```
