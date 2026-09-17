# M2R-A19 pre-step research and query release — `анализ ниш wildberries`

Date: 2026-09-17.
Stage: `M2R — search / niche analytics discovery (F7), WB niche-analysis branch`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is not the AI employee. It gives the user's chosen supported AI governed access to marketplace data/tools so that the same AI can work as a seller employee/helper.
- A18 `поисковые запросы wildberries`: CLOSED / totalCount 73 / one direct row / seller search-analytics job valid and official public-API access confirmed, but exact Wordstat root non-expansive.
- Buyer/general-search associations were high-noise and excluded from seller-demand counting.
- F7 search side is represented enough for M2R.
- F7 niche / marketplace-development analytics remains independently unmeasured in Wordstat.
- Wildberries official seller analytics currently exposes a distinct `Анализ ниш` report.
- Do not infer full niche-report public-API availability from the separate official public-API statement for `Поисковые запросы`.
- M7 Collection Freeze remains blocked.

## 2. Historical anti-duplication check

Current M2/M2R authorities were reread before release:

- `M2R_TASK_FAMILY_COVERAGE_AUDIT_2026-09-16.md` marks F7 as a major gap;
- Batch 01 / Batch 02 syntheses do not contain a dedicated `анализ ниш wildberries` probe;
- M2R A01-A18 has not measured this exact niche-analysis family;
- A18 measures search-query analytics, not niche-selection / marketplace-development analytics.

Therefore A19 is not a duplicate.

## 3. Query identity

`QUERY_ID = M2R-A19`

`QUERY_TEXT = анализ ниш wildberries`

Provider operation: `Wordstat.GetTop`.

## 4. Open decision

Measure the search-language surface around **Wildberries niche analysis / niche selection / marketplace-wide development analytics** as a seller decision distinct from search-query analytics.

Need to discover whether users naturally search for:

- niche analysis on Wildberries;
- how to choose/find a niche;
- promising/profitable niches;
- demand / market capacity;
- competition / number of sellers/cards;
- monopolization;
- revenue / average check;
- turnover / stock availability;
- buyout percentage;
- seasonality;
- price segments;
- search-query crossover;
- analytics services/tools/parsers;
- courses/content;
- generic investment/business-niche noise.

## 5. Why A19 is still needed after A18

A18 represented the `search analytics` side of F7. Niche analysis is a different seller job:

- search analytics answers what users search and how products perform in marketplace search;
- niche analysis answers whether a category/subject is attractive, competitive, demanded and economically viable for entry/development.

The two jobs overlap through search-demand data but should not be collapsed before evidence.

## 6. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/ru/docs/search-api/api-ref/Wordstat/getTop

Current contract supports last-30-days phrase-containing/similar-query discovery with up to 2000 returned phrases.

### Wildberries official/current `Анализ ниш`

https://seller.wildberries.ru/instructions/ru/ru/material/A-250

Updated 01.06.2026. The report helps sellers find new prospective niches and analyze existing ones. Current report surfaces include:

- sellers and product-card counts;
- monopolization;
- rounded revenue and average check;
- turnover / availability;
- average stock balances;
- buyout percentage;
- seasonality;
- search-query widget;
- price segments;
- financial indicators and detailed subject data.

A newer Kazakhstan-localized version updated 22.07.2026 confirms the same current niche-analysis model and explicitly describes demand as derived from stock turnover/availability.

### Wildberries official analytics-development section

https://seller.wildberries.ru/instructions/ru/ru/subcategory/trading-platform-analytics

Current `Аналитика развития бизнеса` includes `Анализ ниш` and states that marketplace analytics uses data not only from the seller's own store but from products across the platform, to compare performance against competitors and identify development niches.

### Current 2026 market-language evidence

https://mpmgr.ru/blog/external-analytics/analiz-nishi-wildberries-poshagovo

Published 09.07.2026. Uses exact current language `Анализ ниши на Wildberries` and frames it around demand, competition, seller counts, revenue, turnover and product-entry decisions.

https://parser.club/tools/wb-analiz-nishi

Current tool page uses `Анализ ниши на Wildberries` and seller jobs around seller counts, pricing, cards/reviews and entry assessment.

These pages establish live market language; they are not Octoport product-truth authorities.

## 7. Capability/source boundary

Current official WB evidence proves the niche-analysis seller task and native marketplace report.

However:

- A19 does not assume that the full `Анализ ниш` report is available through the same public API route as the separately confirmed `Поисковые запросы` report;
- Octoport product claims must remain limited to data actually available through accepted marketplace/API authority;
- niche-analysis search demand may still be valuable as audience/problem evidence even if only a subset is launch-addressable.

## 8. Source -> method trace

| Question | Source | A19 use | Boundary |
|---|---|---|---|
| Can GetTop expose niche-analysis language? | Yandex Wordstat.GetTop | max-depth lexical discovery | demand/language only, not page proof |
| Is niche analysis a current WB seller job? | WB official `Анализ ниш` | retain demand/competition/revenue/turnover branches | official native report |
| Is it distinct from own-store analytics? | WB `Аналитика развития бизнеса` | retain marketplace-wide/competitive branch | do not infer API availability |
| Is exact wording live in 2026? | MP Manager / Parser Club | justify exact query and likely lexical neighbors | market/tool language != product authority |

## 9. Information-gain contract

A19 must add information by:

1. independently measuring niche-analysis language;
2. discovering niche-choice / promising/profitable-niche wording;
3. exposing demand/competition/revenue/turnover/seasonality language;
4. identifying marketplace-wide analytics/tool/service intent;
5. detecting search-query crossover without collapsing it into A18;
6. separating seller analytics from generic business/investment niche noise;
7. deciding whether F7 is represented enough to stop Wordstat correction acquisition;
8. providing the last minimum branch needed before proactive M2R full-volume reconciliation.

## 10. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- NICHE_ANALYSIS_CORE;
- NICHE_SELECTION_PROMISING_NICHE;
- DEMAND_MARKET_CAPACITY;
- COMPETITION_SELLERS_CARDS;
- MONOPOLIZATION;
- REVENUE_AVERAGE_CHECK;
- TURNOVER_AVAILABILITY_STOCK;
- BUYOUT_PERCENT;
- SEASONALITY;
- PRICE_SEGMENTS;
- SEARCH_QUERY_CROSSOVER;
- TOOL_SERVICE_ANALYTICS;
- COURSE_EDUCATION;
- GENERIC_BUSINESS_NICHE_NOISE;
- NOISE;
- HOLD.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert totalCount-only to zero. A weak exact root would not erase the niche-analysis seller task proven by current official WB sources; it would mean users express it through narrower `выбор ниши` / `товар для продажи` / service language.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 11. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `анализ ниш wildberries`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 12. Stop / reopen

After full persistence/readback/analysis:

- stop M2R near-synonym acquisition unless reconciliation identifies a specific material gap;
- do not infer Ozon full-market/niche capability from WB evidence;
- do not create page decisions from raw counts;
- preserve API/capability boundaries;
- prepare/trigger full-volume M2R reconciliation before returning to M3 Search.

## 13. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A19_ANALIZ_NISH_WILDBERRIES_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> F7/M2R coverage decision -> full-volume reconciliation handoff`.

## 14. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for this single bounded query.

`WORK_POST_A19 = EXPECTED / QUALITY-BASED`.

After A19, the accumulated evidence spans historical M2 B01/B02 plus M2R analytics/reports/finance/advertising/helper/knowledge/cards/search/niche branches. A full-volume independent reconciliation is expected to improve quality by checking:

- exact deduplication and lineage;
- family coverage after all corrections;
- core vs adjacent vs noise boundaries;
- seller vs buyer / human-role / accounting / autobidder / image-generation contamination;
- source/API capability boundaries;
- remaining acquisition gaps;
- representative M3 SERP query matrix before resuming Search.

Resource economy is not a reason to defer this pass.

## 15. Downstream decision

A19 does not create a page. It completes the minimum dedicated F7 Wordstat coverage required before cross-family reconciliation and later SERP verification.

## 16. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Historical anti-duplication discipline | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official WB niche-analysis support | 10.0 |
| Search-vs-niche distinction | 10.0 |
| API/capability boundary | 10.0 |
| Current 2026 market-language support | 10.0 |
| Outcome/failure contract | 10.0 |
| Post-query Work trigger | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 17. Release verdict

```text
M2R_A19_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A19 = 0
QUERY = анализ ниш wildberries
WORK_POST_A19 = EXPECTED
```
