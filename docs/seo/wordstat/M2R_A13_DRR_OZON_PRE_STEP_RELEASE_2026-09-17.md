# M2R-A13 pre-step research and query release — `дрр ozon`

Date: 2026-09-17.
Stage: `M2R — paired Ozon advertising metric discovery`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport turns the user's chosen supported AI into a marketplace employee by giving it governed access to Ozon/Wildberries data/tools; Octoport is not the AI employee itself.
- A10 `аналитика рекламы маркетплейсов`: CLOSED / totalCount 33 / one direct row / weak generic category root.
- A11 `аналитика рекламы wildberries`: CLOSED / totalCount 15 / totalCount-only.
- A12 `дрр wildberries`: CLOSED / totalCount 23 / totalCount-only.
- Wildberries advertising Wordstat discovery is saturated enough for now; later SERP verification remains required.
- Paired Ozon advertising evidence is still missing.
- Autobidder / continuous bid-management remains an explicit boundary family, not core Octoport acquisition.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A13`

`QUERY_TEXT = дрр ozon`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Measure Ozon-specific search language around the concrete advertising-efficiency metric `ДРР`, and compare its lexical productivity with the already measured Wildberries side.

Need to discover whether users naturally search for:

- ДРР Ozon / доля рекламных расходов;
- how to calculate DRR;
- normal/target DRR;
- how to reduce DRR;
- campaign/product-level DRR;
- ad profitability / payback;
- CTR / CPC / CPO / CR / ROMI / ROAS crossover;
- spend / revenue / margin crossover;
- campaign statistics/reports/services;
- bidder/autobidder/automatic stake management;
- education/content noise.

## 4. Why this query instead of `аналитика рекламы ozon`

A10-A12 already establish that category-style advertising labels are weak/non-expansive in Wordstat. Running another near-identical category label for Ozon would have lower expected information gain than moving directly to current seller metric language.

The paired Ozon control is still required because Wildberries evidence cannot stand in for Ozon search behavior or marketplace terminology.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

Source:

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current official contract supports last-30-days phrase-containing/similar-query discovery and up to 2000 returned phrases.

Method consequence: use `дрр ozon` as the Ozon-specific metric discovery root; persist full output before interpretation.

### Ozon capability authority

Current product-capability truth is governed by the project's already accepted Ozon Performance API/OpenAPI audit, not by competitor pages. That authority establishes advertising campaign/statistics surfaces for Ozon and remains the source for what Octoport may actually read/analyze.

Fresh public search did not provide a sufficiently current official Ozon seller-help page proving that `ДРР` is Ozon's own UI label. Therefore this pre-step does **not** claim official Ozon UI terminology for DRR.

### Current 2026 market-language evidence

Current seller-focused materials use DRR explicitly for Ozon:

- https://mpmgr.ru/blog/reports/raschet-drr-reklamy — published 14.07.2026; explains DRR calculation for Wildberries and Ozon and says Ozon sellers inspect advertising statistics;
- https://mpmgr.ru/blog/ads-promotion/dolya-reklamnykh-raskhodov-drr — published 16.05.2026; covers DRR for Wildberries and Ozon and distinguishes DRR from ROMI/ROAS/ROI;
- https://marketguru.io/docs/ozon-bidder/ — current Ozon advertising-tool documentation exposes impressions, clicks, CTR, CPC, CR, orders, spend, DRR, CPO, CPS and ROMI around Ozon campaigns;
- https://mpmgr.ru/blog/cases/keis-kosmetika-marketpleysy — published 19.06.2026; uses Ozon DRR as a campaign-efficiency metric in a paired WB/Ozon seller case.

These sources prove live market language and likely lexical neighbors only. They do not override Ozon API/product authority and do not make bidder automation part of Octoport core.

## 6. Source -> method trace

| Question | Source | A13 use | Boundary |
|---|---|---|---|
| Can GetTop expand Ozon DRR language? | Yandex Wordstat.GetTop | max-depth metric discovery | demand/language only, not page proof |
| Can Octoport analyze Ozon advertising data? | accepted project Performance API/OpenAPI authority | product capability boundary | do not infer unsupported launch operations |
| Is `ДРР Ozon` live market language in 2026? | MP Manager / MarketGuru current materials | justify exact metric seed and neighboring buckets | third-party market language != official Ozon UI/product truth |
| What about bidders? | current bidder pages | negative/boundary evidence | continuous automated bid management is not core demand |

## 7. Information-gain contract

A13 must add information beyond A10-A12 by:

1. measuring Ozon-specific DRR demand independently;
2. discovering calculate/norm/reduce/compare language if present;
3. exposing campaign/statistics/efficiency neighbors such as CTR/CPC/CPO/CR/ROMI/ROAS;
4. detecting profit/margin/unit-economics crossover;
5. measuring Ozon-vs-WB lexical asymmetry without assuming equivalence;
6. identifying service/tool/report language;
7. separating analysis/diagnostics from bidder/autobidder automation;
8. deciding whether Ozon advertising Wordstat discovery is saturated enough or needs one additional Ozon-specific task probe.

## 8. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- OZON_DRR_CORE;
- DRR_CALCULATION;
- DRR_NORM_BENCHMARK;
- DRR_REDUCTION_OPTIMIZATION;
- CAMPAIGN_PRODUCT_DRR;
- CTR_CPC_CPO_CR;
- ROMI_ROAS_PAYBACK;
- SPEND_REVENUE_MARGIN_CROSSOVER;
- CAMPAIGN_REPORT_STATISTICS;
- SERVICE_ANALYTICS_TOOL;
- AUTOBIDDER_BID_MANAGEMENT;
- EDUCATION_CONTENT;
- NOISE;
- HOLD.

`AUTOBIDDER_BID_MANAGEMENT` remains boundary evidence and is not counted as core Octoport demand.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert a totalCount-only response into zero. A weak exact root would not erase the Ozon advertising task proven by accepted API authority; it would mean the search language is fragmented or expressed differently.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 9. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `дрр ozon`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 10. Stop / reopen

After full persistence/readback/analysis:

- compare Ozon DRR outcome against WB DRR outcome without summing unrelated totals;
- if Ozon is also weak/non-expansive, stop advertising Wordstat synonym chasing and defer merge/split/page decisions to representative SERP evidence;
- only release another Ozon advertising query if a named unresolved semantic decision remains;
- keep bidder/autobidder language separate;
- no page decision from raw counts.

## 11. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A13_DRR_OZON_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> advertising-family saturation decision -> next provider action`.

## 12. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for one bounded Wordstat call.

The cumulative M2R corpus is now substantial. After A13 and the remaining major corrected-product task families, proactive Work reconciliation is expected to be useful for full-volume cross-family deduplication, classification, boundary QA and discovery-gap checks. Resource economy is not a reason to avoid it.

## 13. Downstream decision

A13 does not create a page. It provides the missing Ozon-side advertising metric evidence and determines whether the advertising family needs more Wordstat collection before later SERP verification.

## 14. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain after A10-A12 | 10.0 |
| Fresh provider-method support | 10.0 |
| Ozon capability-authority discipline | 10.0 |
| Current 2026 market-language support | 10.0 |
| Product-truth alignment | 10.0 |
| Official-vs-third-party terminology separation | 10.0 |
| Autobidder boundary control | 10.0 |
| Outcome/failure contract | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 15. Release verdict

```text
M2R_A13_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A13 = 0
QUERY = дрр ozon
```
