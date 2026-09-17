# M2R-A18 pre-step research and query release — `поисковые запросы wildberries`

Date: 2026-09-17.
Stage: `M2R — search / niche analytics discovery (F7), source-bounded WB search analytics`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is not the AI employee. It gives the user's chosen supported AI governed access to marketplace data/tools so that the same AI can work as a seller employee/helper.
- A17 `как заполнить карточку товара wildberries`: CLOSED / totalCount 34 / totalCount-only / operational card job valid but umbrella root non-expansive.
- F5 near-synonym Wordstat chasing is stopped for now; later evidence should use representative SERP + official card workflow corpus.
- Corrected coverage audit marks F7 marketplace/search/niche analytics as a major gap.
- Owner explicitly rejected automatic exclusion of search/niche analytics: include source-confirmed addressable parts, but do not promise unsupported full-market intelligence.
- Wildberries current official surfaces expose both search analytics and niche analysis.
- Crucially, current WB official FAQ explicitly states that the `Поисковые запросы` report is available via public API, making search analytics directly source-bounded/addressable for Octoport.
- Ozon broader market/niche capability remains separately source-bounded and must not be inferred from WB.
- M7 Collection Freeze remains blocked.

## 2. Historical anti-duplication check

Current M2/M2R coverage authority was reread before release:

- `M2R_TASK_FAMILY_COVERAGE_AUDIT_2026-09-16.md` explicitly marks F7 as `WEAK / MAJOR GAP` and says there is no coherent niche/search-demand family in the current direct pool;
- Batch 01/02 syntheses contain no dedicated `поисковые запросы wildberries` or `анализ ниш wildberries` acquisition pass;
- the current M2R correction pass through A17 has not run a dedicated F7 query.

Therefore A18 is not a duplicate probe.

## 3. Query identity

`QUERY_ID = M2R-A18`

`QUERY_TEXT = поисковые запросы wildberries`

Provider operation: `Wordstat.GetTop`.

## 4. Open decision

Discover how sellers search for **Wildberries search-query analytics** and which subjobs users attach to that task.

Need to discover whether users naturally search for:

- search queries on WB / popular queries;
- analytics of search queries;
- seller's own product search queries;
- positions/ranking/visibility in search;
- frequency/demand/query volume;
- conversion from search to card/order;
- search SEO/keywords/card optimization;
- query reports/download/API;
- search analytics services/tools;
- niche/demand crossover;
- advertising/search-promotion crossover;
- buyer-side generic search/navigation noise.

## 5. Why this query is first in F7

F7 contains both `search analytics` and `niche/market analytics`, but their capability certainty differs.

For WB search analytics, current official evidence is strong and launch-addressable:

- WB has an official `Аналитика поиска` section;
- `Поисковые запросы на WB` covers marketplace user search phrases;
- `Поисковые запросы: ваши товары` covers seller-product search visibility/positions;
- current official FAQ explicitly states that `Поисковые запросы` can be obtained through the public API.

Therefore `поисковые запросы wildberries` is the safest first F7 seed: it measures a real seller job that is both search-relevant and API-confirmed.

`Анализ ниш` remains a separate eligible F7 branch, but source/API boundaries must be assessed independently before any Octoport product claim.

## 6. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/ru/docs/search-api/api-ref/Wordstat/getTop

Current contract: last-30-days phrase-containing/similar-query discovery, `numPhrases` up to 2000.

### Wildberries official search analytics

https://seller.wildberries.ru/instructions/ru/ru/subcategory/search-analytics

Current official section exposes:

- `Поисковые запросы на WB`;
- `Поисковые запросы: ваши товары`;
- ranking/search-position metrics;
- query text and query filters;
- search traffic and product-card transition data;
- explicit public-API availability for the `Поисковые запросы` report.

### Wildberries official marketplace-wide search-query report

https://seller.wildberries.ru/instructions/en/uz/material/search-analytics-report

Updated 01.07.2026. The report shows marketplace user search phrases, query counts, average daily query volume, and other demand/search indicators.

### Wildberries official niche-analysis boundary

https://seller.wildberries.ru/instructions/ru/ru/material/A-250

Updated 01.06.2026. `Анализ ниш` helps identify prospective niches and analyze existing ones, including sellers/cards, monopolization, revenue/average check, turnover, availability, buyout percentage, search-query widget and other metrics.

This proves the seller task exists, but A18 does not assume that all niche-analysis data are available through the same public API route as search-query reporting.

## 7. Source -> method trace

| Question | Source | A18 use | Boundary |
|---|---|---|---|
| Can GetTop discover WB search-query language? | Yandex Wordstat.GetTop | max-depth lexical discovery | demand/language only, not page proof |
| Is search-query analytics a real current seller job? | WB `Аналитика поиска` | retain search/ranking/query-report branches | official seller surface |
| Is the report API-addressable? | WB official search-analytics FAQ | product capability relevance | applies to confirmed search report; do not generalize to all analytics |
| Is niche analysis a real adjacent seller job? | WB official `Анализ ниш` | retain as separate F7 branch | API/access boundary remains separate |

## 8. Information-gain contract

A18 must add information by:

1. measuring WB-specific search-query analytics language;
2. discovering position/ranking/visibility/frequency/conversion vocabulary;
3. detecting seller-own-product vs marketplace-wide query intent;
4. identifying SEO/card-optimization crossover;
5. detecting report/download/API/tool/service language;
6. separating seller analytics from buyer-side generic search noise;
7. determining whether an independent `анализ ниш wildberries` probe is needed;
8. deciding whether F7 is represented well enough for later SERP verification and Work reconciliation.

## 9. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- WB_SEARCH_QUERY_CORE;
- MARKETPLACE_WIDE_QUERY_DEMAND;
- SELLER_PRODUCT_SEARCH_QUERIES;
- POSITION_RANKING_VISIBILITY;
- QUERY_VOLUME_FREQUENCY;
- SEARCH_CONVERSION;
- SEO_KEYWORDS_CARD_OPTIMIZATION;
- REPORT_DOWNLOAD_API;
- TOOL_SERVICE_ANALYTICS;
- NICHE_DEMAND_CROSSOVER;
- AD_SEARCH_PROMOTION_CROSSOVER;
- BUYER_SEARCH_NOISE;
- EDUCATION_CONTENT;
- NOISE;
- HOLD.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert totalCount-only to zero. A weak exact root would not erase the search-analytics task proven by current official WB sources; it would mean seller queries are expressed through narrower report/ranking/position wording.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 10. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `поисковые запросы wildberries`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 11. Stop / reopen

After full persistence/readback/analysis:

- release `анализ ниш wildberries` independently if F7 still lacks niche/demand language and the query has positive information gain;
- do not infer Ozon market/niche capability from WB evidence;
- do not create page decisions from raw counts;
- keep marketplace-wide external-market claims source-bounded;
- after F7 minimum coverage, trigger/prepare proactive Work reconciliation of the accumulated M2R corpus if quality gain remains positive.

## 12. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A18_POISKOVYE_ZAPROSY_WILDBERRIES_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> F7 coverage decision -> Work-trigger reassessment -> next provider action`.

## 13. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for this single bounded Wordstat call.

After A18, the accumulated M2R corpus spans analytics/reports/finance/advertising/helper/knowledge/cards/search analytics. Under the quality-first rule, a proactive full-volume Work reconciliation is expected to have positive value for:

- cross-family deduplication;
- intent classification;
- observed-vs-inferred lineage;
- boundary/adversarial QA;
- gap detection before returning to M3 Search and later Collection Freeze.

The exact Work handoff should be prepared after A18 analysis, or after one additional niche probe if A18 leaves F7 materially incomplete.

## 14. Downstream decision

A18 does not create a page. It measures a source-confirmed, API-addressable seller search-analytics job and determines whether F7 needs an additional niche-analysis probe before corpus reconciliation.

## 15. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Historical anti-duplication discipline | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official WB search-analytics support | 10.0 |
| Public-API capability evidence | 10.0 |
| Search-vs-niche capability boundary | 10.0 |
| Product-truth alignment | 10.0 |
| Outcome/failure contract | 10.0 |
| Work-trigger planning | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 16. Release verdict

```text
M2R_A18_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A18 = 0
QUERY = поисковые запросы wildberries
```
