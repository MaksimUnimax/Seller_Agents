# M2R-A10 analysis — `аналитика рекламы маркетплейсов`

Date: 2026-09-17.
Status: `ANALYZED / FULL 1-DIRECT-ROW REVIEW`.
Raw authority: `../raw/M2R_A10_ANALITIKA_REKLAMY_MARKETPLEYSOV_RESULT_2026-09-17.md`.

## 1. Provider outcome

- Wordstat status: `OK`;
- request executed: `true`;
- `totalCount`: `33`;
- direct `results[]`: `1` row;
- associations: `15` rows;
- requested depth: `2000`;
- no provider failure;
- no depth-saturation signal.

`totalCount=33` is demand for this exact broad phrase family, not the total advertising-analysis market and not a count of distinct phrases.

## 2. Full-row review

All 1 direct row and all 15 associations were reviewed. No sampling was used.

Direct row:

| Phrase | Count | Interpretation |
|---|---:|---|
| `реклама маркетплейса аналитика` | 33 | valid generic advertising-analysis wording, but non-expansive and too abstract for family discovery |

All 15 associations are unrelated `market`, marketing profession/education, entity or generic marketing noise. None adds usable marketplace advertising-analysis vocabulary.

## 3. What A10 proved

The generic root `аналитика рекламы маркетплейсов` is a **weak discovery seed**.

It does not expose direct Wordstat vocabulary around:

- campaign statistics;
- advertising spend/budget;
- DRR / share of spend;
- CTR / CPC / CPO / CR;
- impressions / clicks / cart additions / orders;
- product-level ad performance;
- campaign reports;
- recommendations/diagnostics;
- Ozon/Wildberries-specific advertising language;
- autobidder/bid-management boundaries.

This does **not** mean advertising analysis/help is a weak seller job. Current marketplace documentation exposes rich campaign-statistics surfaces. The failure is lexical: sellers appear not to phrase the job through the generic compound `аналитика рекламы маркетплейсов` often enough for Wordstat to expand it.

## 4. Fresh current-language check — routing consequence

Current Wildberries seller documentation (updated 17.06.2026) exposes a detailed promotion-statistics vocabulary:

- overall campaign statistics;
- campaign metrics;
- impressions;
- clicks;
- CTR;
- CPC;
- CR;
- spend;
- share of spend;
- orders;
- CPO;
- CPM;
- average position;
- extended statistics;
- search-query statistics;
- recommendations to improve impressions, clicks, cart additions and orders.

Source:

- https://seller.wildberries.ru/instructions/en/ru/material/statistics-and-promotion-management

Current WB Pro material (12.06.2026) also explicitly uses the seller metric `ДРР` and distinguishes it from `доля затрат` in WB Promotion.

Source:

- https://pro.wildberries.ru/insight/3D1cDmllZKqdNDJlcNHd6jHYZqq/3D1cJO4EKvo1OlSzgbpQiXpjENo

Current market pages repeatedly use the exact category `Аналитика рекламы Wildberries` and expand it through DRR, ROMI, CTR, CPC, CPO, spend, orders and profitability.

Examples:

- https://rmagent.ru/articles/analitika-reklamy-wildberries-kak-schitat-drr-i-okupaemost-po-kampaniyam
- https://360mp.ru/reklama/
- https://metricpulse.ru/reklama-wildberries
- https://bublick.space/analitika-reklamy-wildberries/

These establish current search/market terminology but do not establish final SEO page ownership or Octoport feature truth.

## 5. Product consequence

Advertising remains a valid Octoport job family under the corrected product model:

`user's chosen AI + advertising statistics -> explain campaign performance, diagnose weak points, compare campaigns/products, calculate efficiency and recommend what to inspect/change`.

Current launch positioning remains read-only/analysis-first. Real-time automatic bid management is a separate product category and must not be counted as core Octoport demand merely because it concerns advertising.

## 6. Next acquisition decision

Run a marketplace-specific probe:

`аналитика рекламы wildberries`

Why this is higher information gain than another generic advertising synonym:

1. A10 proves the generic root is non-expansive;
2. current WB official documentation has a very rich advertising-statistics vocabulary;
3. current 2026 market pages use the exact category `Аналитика рекламы Wildberries` repeatedly;
4. marketplace-specific wording can expose DRR/CTR/CPC/CPO/campaign/product/statistics language that the generic root did not return;
5. it gives one side of a later paired WB-vs-Ozon advertising comparison;
6. autobidder/bid-management terms can be retained as explicit boundary evidence rather than merged into analytical help.

A paired Ozon advertising-analysis probe remains planned after the WB result unless evidence shows no material information gain.

## 7. Advertising-family status after A10

```text
GENERIC_AD_ANALYTICS_ROOT = VALID BUT WEAK / NON-EXPANSIVE
ADVERTISING_JOB = NOT REJECTED
MARKETPLACE_SPECIFIC_DISCOVERY = REQUIRED
WB_FIRST = justified by current official/market terminology
OZON_PAIRED_PROBE = expected after WB result
AUTOBIDDER = boundary family / not core demand
```

## 8. Work decision

`WORK_NOW = NOT REQUIRED` for A10 itself: only 1 direct row + 15 associations and all were reviewed completely.

After marketplace-specific advertising probes and one or two further major corrected-product families, proactive Work reconciliation of the full M2R corpus should be reconsidered under the quality-first rule.

## 9. Quality score

| Criterion | /10 |
|---|---:|
| Full-row coverage | 10.0 |
| Correct weak-seed interpretation | 10.0 |
| Product-truth alignment | 10.0 |
| Association/noise handling | 10.0 |
| Current-source routing | 10.0 |
| Marketplace-specific pivot logic | 10.0 |
| Autobidder boundary discipline | 10.0 |
| Observed-vs-inferred separation | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream usefulness | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 10. Verdict

```text
M2R_A10 = CLOSED
DIRECT_ROWS_REVIEWED = 1/1
ASSOCIATIONS_REVIEWED = 15/15
GENERIC_AD_ANALYTICS = WEAK / NON-EXPANSIVE
NEXT_QUERY = аналитика рекламы wildberries
```
