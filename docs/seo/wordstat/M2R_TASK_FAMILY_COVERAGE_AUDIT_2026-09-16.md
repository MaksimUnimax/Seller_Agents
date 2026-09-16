# M2R — task-family coverage audit after product correction

Date: 2026-09-16.
Status: **COMPLETE COVERAGE AUDIT / REBASELINE INPUT**.
Branch: `seo/wordstat-batch-01-2026-09-16`.

## 0. Why this audit exists

Owner corrected the core product model:

**Octoport is not the AI employee itself. Octoport is the bridge/tool that turns the user's chosen supported AI into an employee for work with Ozon/Wildberries.**

That correction widens the acquisition market beyond people already searching for `ИИ-агент`. Existing demand can enter through analytics/reporting services, daily seller-cabinet help, card-work assistance, advertising analysis, marketplace/search/niche analytics, marketplace help/knowledge, and connection of an existing LLM to marketplace data.

Quality-first rule applies: cost, token usage and Work resource usage are not reasons to stop acquisition while material information gaps remain.

Authorities:

- `../PRODUCT_TRUTH.md`;
- `../QUALITY_FIRST_RESOURCE_RULE.md`;
- `../research/PRODUCT_AUDIENCE_API_AND_KNOWLEDGE_BOUNDARIES_2026-09-16.md`;
- `M2_WORDSTAT_VOLUME_ACCOUNTING_2026-09-16.md`;
- `BATCH_01_SYNTHESIS_2026-09-16.md`;
- `BATCH_02_SYNTHESIS_2026-09-16.md`;
- all 30 persisted raw B01/B02 Wordstat responses.

## 1. Current corpus size

Current direct Wordstat lexical pool:

- unique `results[]` phrase strings: `185`;
- non-echoed exact tested seeds: `10`;
- direct observed/tested universe: **`195` unique phrase strings**;
- broad universe including associations: `423` unique phrase strings.

This audit does not treat the 423 broad associations as 423 candidate SEO keywords. Many are noise/entity/navigation phrases. Coverage decisions below use the direct pool plus durable qualitative evidence from associations when relevant.

## 2. External method check refreshed 2026-09-16

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop

Current contract confirms that GetTop returns last-30-days data for popular queries containing the supplied phrase and for similar queries, with `results[]`, `associations[]` and `totalCount`. This supports using broad discovery seeds plus targeted refinements rather than treating one seed as a final keyword universe.

### Yandex Webmaster — query selection / market analysis

https://yandex.ru/support/webmaster/ru/service/queries-selection

Current Yandex guidance says query clustering groups queries close by meaning or user intent and recommends finding additional/non-obvious formulations plus studying popular sites/pages. Therefore family coverage is judged by user job and observed market language, not only by lexical overlap with the product name.

### Ahrefs — keyword clustering

https://ahrefs.com/blog/keyword-clustering/

Industry corroboration: keywords with same/similar intent should later be clustered together using SERP similarity; raw phrase count is not a page-count target.

## 3. Fresh market-language check for undercovered families

Observed live/current wording outside our existing Wordstat pool includes:

- `аналитика маркетплейсов`, `аналитика маркетплейсов для селлеров`, `внутренняя аналитика`, `отчёты кабинета`, `финансовый отчёт`, `воронка продаж`, `остатки`, `прибыль`, `реклама`, `поисковые запросы`;
- product pages explicitly describe API-connected aggregation of Ozon/WB seller data and reports;
- WB official help exposes `Аналитика продавца`, `Аналитика поиска`, `Аналитика развития бизнеса`, `Анализ ниш`, `Сравнение карточек`, `Доходы и расходы`, `Калькулятор прибыли`, `Продажи по регионам`, `Доля бренда`, `Остатки`, `Возвраты`;
- current ad-analytics market language includes `аналитика рекламы`, `ДРР`, campaign effectiveness, CTR, CPO/ROAS and ad reports;
- marketplace-help language exists around `как работать в кабинете Wildberries` and similar workflow/instruction needs.

Reference examples:

- https://seller.wildberries.ru/instructions/ru/kz/category/analytics
- https://seller.wildberries.ru/instructions/ru/ru/subcategory/search-analytics
- https://seller.wildberries.ru/instructions/ru/ru/subcategory/trading-platform-analytics
- https://analitika-marketpleysov.ru/features
- https://reccora.ru/analytics/marketplaces
- https://marketdash.ru/
- https://reviomp.ru/vozmozhnosti/reklama
- https://uniseller.io/blog/kak-rabotat-v-kabinete-wildberries-seller/

These are market-language evidence, not automatic target-keyword approval.

## 4. Coverage map against corrected product model

Coverage states:

- `STRONG` = current M2 evidence is enough to choose representative SERP tests without new discovery being mandatory;
- `MODERATE` = important wording exists but family breadth is too narrow;
- `WEAK` = only a few probes/phrases exist;
- `ABSENT` = no meaningful direct lexical coverage for the user job;
- `WRONG-SHAPE` = high volume exists but is dominated by the wrong intent and cannot be treated as coverage.

| Family | Current coverage | Existing evidence | Gap verdict |
|---|---|---|---|
| F1 Existing AI-agent/assistant | **STRONG** | `ии агенты для маркетплейсов` 134; Ozon agent 40; WB agent 20; assistant variants; S01-S03 SERPs | Keep; additional probes only if they answer a new split/wording question |
| F2 Connect user's own AI/LLM to marketplace | **WEAK** | `chatgpt для маркетплейсов` 67; `chatgpt для ozon` 9; `chatgpt для wildberries` 10; old `подключить ии к маркетплейсу` returned `{}` | Material gap. No Claude/Gemini/LLM/connection-language family coverage |
| F3 Seller-cabinet analytics/reports | **MODERATE but narrow** | `сервис аналитики маркетплейсов` 756; sales/internal analytics variants; `ии для аналитики` 15 | Material gap. Current corpus undercovers generic analytics, seller reports, profit, stock, returns, funnel, finance, report aggregation language |
| F4 Daily marketplace work/help | **WEAK** | `ии для работы с маркетплейсами` 39; `ии для продаж` 23; manager/helper variants | Material gap. Very little language around cabinet work, supplies, orders, returns, reviews, prices, workflows |
| F5 Product-card operational help | **WRONG-SHAPE** | many card/image/infographic generation phrases; a few description/text phrases | High raw volume does not equal coverage. Need separate operational card family: fill/check/attributes/description/SEO/category/compliance; exclude image/infographic generators |
| F6 Advertising analysis/help | **ABSENT** | no meaningful direct ad-analysis family in current 195 pool | Major gap. Need reports/statistics/efficiency/DRR/diagnostics language; autobidder intent must be split out |
| F7 Marketplace/search/niche analytics | **WEAK** | only scattered analytics/search wording; no coherent niche/search-demand family | Major gap. WB official surfaces prove this is a real seller task; Ozon capability must stay source-bounded |
| F8 Knowledge/help about cabinet mechanics | **ABSENT** | `как использовать ии для маркетплейсов` 3 is not cabinet-help demand | Major gap. Need workflow/instruction/report-metric/status/help-center language |
| F9 Comparison/discovery of AI/tools | **MODERATE** | `какой ии для маркетплейсов` 128; `лучшие/топ нейросети`; analytics-service `лучшие/топ` variants | Existing S04 hypothesis remains useful but should run after task-family rebaseline |
| F10 Broad noise controls | **STRONG** | broad `ии`/`нейросеть` roots and large card/image/infographic vocabulary | Keep as contamination control; do not expand merely for volume |

## 5. Critical interpretation

The current 195 direct phrases are **not too small because Octoport needs thousands of pages**. They are insufficient because coverage is highly uneven:

- the old acquisition over-covered broad AI/card-generation language;
- it covered the `ИИ-агент` entrance reasonably well;
- it did **not** adequately cover several older categories through which a real Octoport buyer may search: analytics/reports, daily cabinet work, ad analysis, search/niche analytics, cabinet help/knowledge and own-LLM connection.

Therefore the right response is **not phrase inflation**. The right response is targeted family discovery until these jobs are represented well enough to choose SERP probes and later clusters.

## 6. M2R acquisition priorities

### Priority A — seller analytics / reports

Start here because:

1. owner explicitly identified analytics/report-service seekers as core acquisition audience;
2. current web evidence shows a large established category using exact language `аналитика маркетплейсов` and `аналитика маркетплейсов для селлеров`;
3. our previous Wordstat seed `сервис аналитики маркетплейсов` was narrower and mostly exposed service-brand/comparison wording;
4. API/source research confirms that many seller analytics/report tasks are genuinely addressable by Octoport's model.

Initial discovery probes, each requiring its own query release before execution:

- `аналитика маркетплейсов`;
- `аналитика для маркетплейсов`;
- `аналитика для селлеров`;
- `аналитика продавца маркетплейсов`;
- `внутренняя аналитика маркетплейсов`;
- `отчеты маркетплейсов`;
- `отчеты для селлеров`;
- `аналитика продаж маркетплейсов`;
- later marketplace-specific Ozon/WB variants when children/current SERP justify them.

### Priority B — advertising analytics/help

- `аналитика рекламы маркетплейсов`;
- `аналитика рекламы wildberries`;
- `аналитика рекламы ozon`;
- `отчет по рекламе wildberries`;
- `отчет по рекламе ozon`;
- DRR/effectiveness variants discovered from provider results.

Explicit negative boundary: autobidder/bid-bot category is not counted as core Octoport demand.

### Priority C — daily cabinet work/help

Explore seller-cabinet/job wording without forcing `ИИ` into the seed, because users may search the problem rather than the new solution category.

### Priority D — own-LLM connection

Revisit with actual user language around ChatGPT/Claude/Gemini + Ozon/WB/data/cabinet/API, because the previous generic `подключить ии к маркетплейсу` probe was too narrow and returned no usable body.

### Priority E — card operational work

Separate text/SEO/attributes/filling/checking/compliance from image/infographic-generation noise.

### Priority F — search/niche analytics + marketplace help knowledge

Use source-confirmed tasks and current marketplace terminology; do not promise capabilities beyond confirmed sources.

## 7. Work decision

The current 195 direct / 423 broad phrase universe is small enough for complete Main Chat family-level coverage auditing, so no sampling was needed.

However, under `QUALITY_FIRST_RESOURCE_RULE.md`, Work is permitted proactively later if expanded M2R ledgers or cross-source family classification benefit from independent full-volume QA. Resource economy is not a reason to avoid Work.

## 8. Quality score

| Criterion | /10 |
|---|---:|
| Product-model alignment | 10.0 |
| Complete current-volume accounting | 10.0 |
| Existing-evidence reuse | 10.0 |
| Fresh external method support | 9.5 |
| Task-family coverage logic | 10.0 |
| Noise-boundary handling | 10.0 |
| Capability/source boundaries | 9.5 |
| Information-gain planning | 10.0 |
| Work/resource-policy compliance | 10.0 |
| Downstream readiness | 9.5 |

`QUALITY_TOTAL = 98.5/100`
`QUALITY_SCORE = 9.85/10`

## 9. Verdict

```text
M2R_REBASELINE_REQUIRED = true
OLD_B01_B02_EVIDENCE_DISCARDED = false
F1_AGENT_CATEGORY = sufficiently represented for now
F2_OWN_LLM_CONNECTION = GAP
F3_ANALYTICS_REPORTS = MATERIAL_GAP
F4_DAILY_WORK_HELP = GAP
F5_CARD_OPERATIONAL = WRONG_SHAPE / GAP
F6_AD_ANALYTICS = MAJOR_GAP
F7_SEARCH_NICHE_ANALYTICS = MAJOR_GAP
F8_KNOWLEDGE_HELP = MAJOR_GAP
F9_COMPARISON_DISCOVERY = usable but paused behind rebaseline
F10_NOISE_CONTROL = sufficient
M7_COLLECTION_FREEZE = blocked
```

Next physical action: release the first new M2R Wordstat discovery query `аналитика маркетплейсов` under a query-specific contract.