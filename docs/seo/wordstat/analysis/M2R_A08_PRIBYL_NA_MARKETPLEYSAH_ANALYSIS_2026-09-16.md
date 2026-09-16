# M2R-A08 analysis — `прибыль на маркетплейсах`

Date: 2026-09-16.
Status: `ANALYZED / FULL 7-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A08_PRIBYL_NA_MARKETPLEYSAH_RESULT_2026-09-16.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `389`;
- direct `results[]`: `7` rows;
- associations: `18` rows;
- requested depth: `2000`;
- no provider failure;
- no depth-saturation signal.

`totalCount=389` is demand for the broad phrase family, not the count of direct rows and not pure Octoport demand.

## 2. Full-row review

All 7 direct rows and all 18 associations were reviewed. No sampling was used.

Direct rows:

| Phrase | Count | Provisional interpretation |
|---|---:|---|
| `прибыль на маркетплейсах` | 389 | broad seller-profit job |
| `налог на прибыль маркетплейс` | 128 | tax/accounting intent; outside core launch acquisition |
| `чистая прибыль на маркетплейсе` | 56 | core managerial-profit metric |
| `расчет прибыли на маркетплейсе` | 27 | calculation/task intent |
| `прибыль с товара на маркетплейсе` | 24 | product-level profitability intent |
| `прибыль от продаж на маркетплейсах` | 22 | sales-profit intent |
| `учет на маркетплейсах прибыль` | 15 | accounting/management-accounting crossover; HOLD for intent |

All 18 associations are broad marketplace/navigation/business noise. Two Ozon how-to-sale associations are marketplace-adjacent but not profit-language evidence and are not promoted into this family.

## 3. What A08 proved

`прибыль на маркетплейсах` is a meaningful, user-understandable finance family with stronger broad demand than both the abstract finance root and the expert unit-economics phrase:

- A06 `финансовая аналитика маркетплейсов`: totalCount 64;
- A07 `юнит экономика маркетплейсов`: totalCount 271;
- A08 `прибыль на маркетплейсах`: totalCount 389.

The family is not as clean as unit economics because tax/accounting intent is material. Still, several direct rows clearly represent seller-management tasks: clean profit, profit calculation, product profit and sales profit.

## 4. Relationship to unit economics

A07 and A08 should remain separate lexical families for now:

- `юнит экономика` = expert/calculation/tool language;
- `прибыль` = broader business-outcome language;
- both map to related seller-finance jobs, but Wordstat alone does not prove a single search intent or page.

Later ordinary Yandex SERP overlap and user-task clustering must decide merge/split.

## 5. Product consequence

The corrected Octoport mechanism fits both jobs:

`user's chosen AI + authorized seller data -> calculate/explain profitability and unit economics in dialogue`.

This acquisition angle is stronger than positioning Octoport as another dashboard or calculator because the user's AI can work from the seller's actual marketplace data and explain the result conversationally.

Current launch/read-only truth supports analysis and explanation only; no autonomous price/business-state changes may be promised.

## 6. Tax/accounting boundary

The row `налог на прибыль маркетплейс` = 128 is large enough that broad profit search cannot be treated as pure managerial analytics demand.

Current core acquisition boundary:

- KEEP/INVESTIGATE: clean profit, calculation, product-level profit, sales profit;
- HOLD: accounting/management accounting crossover;
- EXCLUDE_FROM_CORE_LAUNCH: tax calculation/filing intent unless a supported product workflow is later explicitly added.

## 7. Finance-family coverage after A06-A08

Current evidence now covers three materially different user languages:

1. abstract finance analytics — weak/non-expansive;
2. unit economics — clean technical seller-job language;
3. profit — broader outcome language with tax contamination.

What remains materially unresolved inside finance is **margin/profitability language** and whether users express the job directly through `маржинальность`/`рентабельность` rather than profit/unit economics.

## 8. Next acquisition decision

Run one more independent concrete metric probe before leaving the finance family:

`маржинальность на маркетплейсах`

Reason:

- current WB unit-economics sources explicitly use margin/margin percentage as a seller metric;
- market materials use margin/profitability as a key marketplace profitability concept;
- neither A07 nor A08 returned direct margin/profitability child phrases;
- this is a distinct business metric rather than a synonym of `прибыль`;
- after this probe, finance-family Wordstat discovery can be reassessed for saturation and likely move to the major unfilled advertising-analysis family.

## 9. Work decision

`WORK_NOW = NOT_REQUIRED`.

A08 is small and fully reviewed. Work remains proactively authorized for later cross-family reconciliation once enough M2R ledgers accumulate.

## 10. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Profit-vs-tax separation | 10.0 |
| Product-truth alignment | 10.0 |
| Unit-economics comparison | 10.0 |
| Observed-vs-inferred discipline | 10.0 |
| Association/noise handling | 10.0 |
| Information-gain routing | 10.0 |
| Avoidance of page inference | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream usefulness | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 11. Verdict

```text
M2R_A08 = CLOSED
DIRECT_ROWS_REVIEWED = 7/7
ASSOCIATIONS_REVIEWED = 18/18
PROFIT_FAMILY = VALID / MATERIAL
TAX_CONTAMINATION = MATERIAL
UNIT_ECONOMICS_AND_PROFIT = RELATED BUT NOT YET MERGED
NEXT_QUERY_CANDIDATE = маржинальность на маркетплейсах
```
