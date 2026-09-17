# R03 full SERP analysis — `chatgpt для wildberries`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F2 own-AI marketplace-specific paired check`.  
Status: **CLOSED / SUCCESS WITH 20 RESULTS / MIXED_WB_CHATGPT_SERP_WITH_STRONG_CONNECTION_HEAD_AND_CONTENT_HEAVY_TAIL / PAIRED F2 COMPARISON REQUIRED**.

## 1. Evidence authority and integrity

Source attachment:

`search-octoport-serp-r03-20260917-r5-0-0.json`

Persistence authority:

`../raw/R03_06_EXPORT_MANIFEST_2026-09-17.md`.

Provider identity:

```text
job_id = octoport-serp-r03-20260917
operation_id = spr8vij9p1s7cijt2chi
revision = 5
query = chatgpt для wildberries
result_rows = 20
validation.document_count = 20
validation.usable_for_url_comparison = true
missing_url_ranks = []
unsafe_url_ranks = []
has_more = false
all_job_items_in_this_file = true
```

All 20 normalized rows were reviewed. No sampling was used. Interpretation is limited to captured Yandex URL/title/snippet/modtime evidence; full-page competitor claims remain M4 work.

## 2. R03 decision question

R03 tests whether explicit `Wildberries` naming sharpens own-ChatGPT demand toward real seller-data/API/connector use and whether its Search surface is materially different from R02 `chatgpt для ozon`.

Observed standalone R03 result:

**`MIXED_WB_CHATGPT_SERP_WITH_STRONG_CONNECTION_HEAD_AND_CONTENT_HEAVY_TAIL`**.

The first three ranks are strong direct-connection/integration results. The middle/tail is substantially more content/card/SEO-heavy than the R02 Ozon SERP.

## 3. Rank-by-rank classification

Primary classes are non-overlapping and account to 20/20.

| Rank | Domain | Observed result job | Primary class | F2/WB relevance |
|---:|---|---|---|---|
| 1 | `jafo.ru` | connect Claude/ChatGPT directly to WB/Ozon seller cabinets/data | DIRECT_WB_CHATGPT_CONNECTION | very high |
| 2 | `api-master.ru` | connect external AI to Ozon/WB API/data/MCP analytics layer | DIRECT_WB_CHATGPT_CONNECTION | very high |
| 3 | `apimonster.ru` | OpenAI/ChatGPT ↔ Wildberries no-code/API connector | DIRECT_WB_CHATGPT_CONNECTION | very high and WB-specific |
| 4 | `klerk.ru` | AI/ChatGPT for creating Wildberries product cards/descriptions | WB_CARD_CONTENT_GENERATION | low/boundary |
| 5 | `youtube.com` | marketplace card/infographic creation in ChatGPT | WB_CARD_CONTENT_GENERATION | low/boundary |
| 6 | `tablichki.tech` | analyze WB/Ozon exports with ChatGPT/Claude/DeepSeek | MANUAL_DATA_ANALYSIS | high job relevance, manual-export mode |
| 7 | `legasoft.ru` | ChatGPT Data Analysis over WB sales report for supply planning | MANUAL_DATA_ANALYSIS | high job relevance, WB-specific |
| 8 | `jafo.ru` | AI assistant for WB/Ozon seller catalogue/prices/ads/analytics | WB_INTEGRATION_OR_AGENT | high category adjacency; mutation promises are boundary |
| 9 | `youtube.com` | automate WB/Ozon with ChatGPT; snippet absent | BROAD_AUTOMATION_BOUNDARY | relevant theme, capabilities unproven from captured evidence |
| 10 | `seo.wbcon.ru` | ChatGPT-based descriptions for WB/Ozon products | WB_CARD_CONTENT_GENERATION | low/boundary |
| 11 | `youtube.com` | SEO optimization on Wildberries using ChatGPT | WB_CARD_CONTENT_GENERATION | content/SEO job |
| 12 | `vc.ru` | use ChatGPT for WB supplies/other marketplace seller work | GENERIC_CHATGPT_FOR_WB_SELLER | medium; broad seller tutorial |
| 13 | `youtube.com` | real-order/product-card work with ChatGPT for WB | GENERIC_CHATGPT_FOR_WB_SELLER | medium; captured result not a connector |
| 14 | `youtube.com` | general examples of ChatGPT for work on Wildberries | GENERIC_CHATGPT_FOR_WB_SELLER | medium |
| 15 | `youtube.com` | design Wildberries product card in GPT | WB_CARD_CONTENT_GENERATION | low/boundary |
| 16 | `wbcon.ru` | ChatGPT product-description service/instruction for WB/Ozon | WB_CARD_CONTENT_GENERATION | low/boundary |
| 17 | `sellermoon.ru` | ChatGPT naming/photo/USP/description/content for WB/Ozon | WB_CARD_CONTENT_GENERATION | low/boundary |
| 18 | `vc.ru` | SEO-optimized marketplace texts for WB/Ozon with ChatGPT | WB_CARD_CONTENT_GENERATION | low/boundary |
| 19 | `rutube.ru` | Wildberries SEO product-card optimization with ChatGPT | WB_CARD_CONTENT_GENERATION | low/boundary |
| 20 | `youtube.com` | ChatGPT copywriter for Wildberries product descriptions | WB_CARD_CONTENT_GENERATION | low/boundary |

## 4. Aggregate composition

```text
DIRECT_WB_CHATGPT_CONNECTION = 3/20
WB_INTEGRATION_OR_AGENT = 1/20
MANUAL_DATA_ANALYSIS = 2/20
GENERIC_CHATGPT_FOR_WB_SELLER = 3/20
WB_CARD_CONTENT_GENERATION = 10/20
BROAD_AUTOMATION_BOUNDARY = 1/20
NOISE_OTHER_INTENT = 0/20
TOTAL = 20/20
```

Position-weighted view:

```text
TOP_3_DIRECT_CONNECTION = 3/3
TOP_10_DIRECT_CONNECTION_OR_WB_INTEGRATION = 4/10
TOP_10_MANUAL_ANALYSIS = 2/10
TOP_10_CARD_CONTENT = 3/10
TOP_10_BROAD_AUTOMATION = 1/10
```

Thus the head strongly confirms the direct connection/integration job, while card/content contamination appears much earlier and becomes dominant across the full top-20.

## 5. Marketplace scope inside R03

Analyst coding from captured URL/title/snippet scope:

```text
CLEARLY_WB_SPECIFIC_OR_WB_ANCHORED_SELLER_RELEVANT = 9/20
DUAL_WB_OZON_SELLER_RELEVANT = 10/20
BROADER_MULTI_MARKETPLACE_OR_GENERIC = 1/20
LEXICAL_NOISE = 0/20
```

The nine WB-specific/WB-anchored rows are ranks `3,4,7,11,13,14,15,19,20`. The ten dual WB+Ozon rows are `1,2,5,6,8,9,10,16,17,18`. Rank 12 is broader multi-marketplace seller-use content anchored on Wildberries but not a dedicated WB mechanism page.

Important consequence: explicit Wildberries naming does create WB-specific depth, but a very large dual-marketplace core remains.

## 6. Relationship to generic R01

R01 proved generic F2 connection intent with direct connection at ranks 1-2 but a mixed tail. R03 reconfirms the same mechanism more specifically:

- direct connection/integration occupies ranks 1-3;
- the same two strongest generic connection documents recur at ranks 1 and 2;
- rank 3 is now a dedicated Wildberries connector page;
- seller-data analysis appears via manual-report/export workflows at ranks 6-7;
- unlike R01, later results heavily resolve toward Wildberries SEO/card/content use.

Therefore:

```text
R03_WB_SHARPEN_VS_GENERIC_R01 = YES_AT_HEAD
R03_WHOLE_SERP_PURITY = LOW_TO_MODERATE
R03_DIRECT_CONNECTION_JOB = CONFIRMED
```

## 7. What R03 proves

### Confirmed

1. `chatgpt для wildberries` is a real seller-side Search surface, not merely generic ChatGPT noise.
2. The first three results strongly resolve toward direct ChatGPT/external-AI connection to marketplace/Wildberries data and seller cabinets.
3. A dedicated WB connector URL appears at rank 3, while the two strongest dual-marketplace connection pages remain ranks 1-2.
4. Manual report/export analysis is a recurring secondary user job.
5. Wildberries-specific educational/content demand is much stronger in the tail than direct connector demand.
6. Own-LLM F2 demand and F1 agent-category demand share a mechanism core but remain distinct intent formulations.

### Not confirmed

1. No final Wildberries page or separate `ChatGPT for Wildberries` page is authorized.
2. Card/SEO generation demand does not expand Octoport's launch scope.
3. Competitor mutation/automation claims do not establish Octoport write capability.
4. Manual Excel/report workflows do not imply Octoport must use file upload.
5. Search ranking alone does not prove full competitor functionality; M4 must capture full pages.

## 8. Product-truth controls

Octoport remains:

`user-selected supported AI -> Octoport -> authorized Ozon/Wildberries data/tools -> same AI works as seller employee/helper`.

Launch remains read/analyze/explain/prepare. R03 supplies Search language and intent evidence only.

## 9. M4 Search-surface candidates

Recurring F2 mechanism pages:

- `jafo.ru/blog/podklyuchit-claude-chatgpt-k-wildberries-ozon`;
- `api-master.ru/blog/how-to-connect-chatgpt-to-ozon-wb`;
- `apimonster.ru/connector/bundle/openai/wildberries/`.

Secondary recurring/job surfaces:

- `tablichki.tech/ocifrovka_marketplace_blog/tpost/ai_marketplaces`;
- `jafo.ru/`;
- selected WB-specific manual analysis and content pages only if they recur across later task queries.

These are Search-corpus candidates, not automatically business competitors.

## 10. R03 closure

```text
R03_PROVIDER_LIFECYCLE = PASS
R03_EXPORT_INTEGRITY = PASS
R03_FULL_RAW_PERSISTENCE = PASS
R03_REMOTE_READBACK = PASS
R03_FULL_20_ROW_REVIEW = PASS
R03_PRIMARY_SERP_CLASS = MIXED_WB_CHATGPT_SERP_WITH_STRONG_CONNECTION_HEAD_AND_CONTENT_HEAVY_TAIL
R03_WB_SHARPEN_VS_R01 = YES_AT_HEAD
R03_FINAL_PAGE_OWNERSHIP = UNRESOLVED_BY_DESIGN
R03 = CLOSED
```

The next required analytical action is the explicit R02↔R03 paired comparison. No additional F2 provider query is justified unless that comparison exposes a named unresolved decision with material information gain.
