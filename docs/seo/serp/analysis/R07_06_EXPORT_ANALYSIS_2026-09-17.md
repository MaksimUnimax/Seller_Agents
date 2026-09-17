# R07 full-export analysis — complete 20/20

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP / F5,F8 card-workflow boundary`.  
Query: `как заполнить карточку товара wildberries`.  
Job: `octoport-serp-r07-20260917`. Operation: `sprh5ncfp74am7l6eofs`. Revision: `5`.  
Status: **PASS / COMPLETE 20 OF 20 / INFORMATION SATURATED**.

Authorities: `R07_PRE_STEP_RESEARCH_AND_RELEASE_2026-09-17.md`, `raw/R07_05_COLLECT_SUCCEEDED_2026-09-17.md`, `raw/R07_06_EXPORT_MANIFEST_2026-09-17.md`, and the complete uploaded export.

## Export QA

```text
results = 20
documents = 20
has_more = false
all_job_items_in_this_file = true
missing_url_ranks = []
unsafe_url_ranks = []
source_bytes = 97531
source_sha256 = 67fafe83ef45e5b8bce03ab2c44756029af3a6be0288148739db2fac8f71762d
lossless_persistence = PASS
```

No sampling, truncation or summarize-before-analysis was used.

## Complete rank coding

| Rank | Domain | Returned title | Primary class |
|---:|---|---|---|
| 1 | `seller.wildberries.ru` | Как создать карточку товара | `WB_NATIVE_CARD_CREATION_OR_FILLING_GUIDE` |
| 2 | `skillbox.ru` | Как делать карточки товаров для Wildberries... / Skillbox Media | `CARD_SEO_TEXT_OR_CHARACTERISTICS_OPTIMIZATION` |
| 3 | `practicum.yandex.ru` | Карточка товара на Wildberries: способы создания, оформления... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 4 | `secrets.tbank.ru` | Карточки товара на Wildberries в 2026: как правильно заполнять... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 5 | `www.moysklad.ru` | Карточка товара на Wildberries (Вайлдберриз) в 2026 году | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 6 | `skillbox.ru` | Карточка товара на Wildberries: как создавать, заполнять... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 7 | `tochka.com` | Карточка товара на Wildberries: как создать и правильно... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 8 | `selsup.ru` | Как создать карточку товара на Wildberries в 2026 году | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 9 | `blog.promopult.ru` | Как создать и заполнить карточку товара на Вайлдберриз... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 10 | `marpla.ru` | Как создать карточку товара на Wildberries – как сделать... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 11 | `allo.tochka.com` | Карточки товара для Wildberries: как сделать карточку товара... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 12 | `www.reg.ru` | Как правильно оформить карточку на Wildberries: инструкция... | `CARD_SEO_TEXT_OR_CHARACTERISTICS_OPTIMIZATION` |
| 13 | `www.insales.ru` | Как правильно оформить карточку товара на Вайлдберриз | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 14 | `sellermoon.ru` | Как создать и заполнить карточку товара на... — SELLER MOON | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 15 | `www.etxt.ru` | Карточки товара на Wildberries: особенности создания | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 16 | `adapter.ru` | Как создать карточку товара на Вайлдберриз и заполнить её... | `CARD_SEO_TEXT_OR_CHARACTERISTICS_OPTIMIZATION` |
| 17 | `wbstat.pro` | Как заполнять карточки на WILDBERRIES, чтобы выйти в ТОП за... | `CARD_SEO_TEXT_OR_CHARACTERISTICS_OPTIMIZATION` |
| 18 | `insales.by` | Как заполнить карточку товара на Wildberries - пошаговая... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 19 | `marpla.ru` | Заполнение карточек на Вайлдберриз – какие требования WB... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |
| 20 | `rutube.ru` | Как создать идеальную карточку товара на Wildberries без... | `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE` |

## Composition

```text
WB_NATIVE_CARD_CREATION_OR_FILLING_GUIDE = 1/20
SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE = 15/20
CARD_SEO_TEXT_OR_CHARACTERISTICS_OPTIMIZATION = 4/20
CREATIVE_IMAGE_INFOGRAPHIC_OR_MEDIA_GENERATOR = 0/20
AI_CARD_CONTENT_GENERATOR = 0/20
DIRECT_CARD_MANAGEMENT_OR_AUTOMATION_SERVICE = 0/20
COURSE_OR_GENERIC_SELLER_EDUCATION = 0/20
NOISE_OTHER_INTENT = 0/20

DIRECT_OPERATIONAL_CARD_WORKFLOW = 16/20
SEO_OPTIMIZATION_OVERLAP = 4/20
SELLER_RELEVANCE = 20/20
```

Top 10: 1 official WB operational guide, 8 seller operational workflow guides, 1 SEO/text optimization result.

## Decision

R07 resolves cleanly to a distinct seller-side operational task: create and correctly fill a Wildberries product card. Rank 1 is Wildberries' own `Как создать карточку товара`. The dominant pages cover cabinet actions and fields such as category/product data, name, description, characteristics, price, size/barcode, dimensions, documents, media, variants and later edits.

The SERP does **not** collapse into creative/infographic or AI-card generation: both are `0/20`. Dedicated third-party direct card-management/automation services are also `0/20`.

SEO is real but secondary. Ranks 2, 12, 16 and 17 primarily frame filling through search visibility, keywords, ranking or TOP outcomes. Therefore R07 is not redundant with R09: R09 was search-query/card-SEO dominated, while R07 is actual card creation/filling workflow.

```text
R07_OPERATIONAL_CARD_FILLING_DISTINCT_JOB = YES
R07_DOMINANT_INTENT = SELLER_OPERATIONAL_CARD_WORKFLOW
R07_SEO_OVERLAP = MATERIAL_BUT_SECONDARY
R07_REDUNDANT_WITH_R09 = NO
R07_CREATIVE_GENERATOR_COLLISION = NO
R07_AI_GENERATOR_COLLISION = NO
R07_BUYER_INTENT_COLLISION = NO
```

## Product boundary

The SERP repeatedly describes direct actions the seller performs in the native WB cabinet. The query-specific pre-step separately confirmed that WB's public Content API technically has create/edit methods. Neither fact expands Octoport's accepted launch scope.

```text
WB_API_CAN_WRITE_PRODUCT_CARDS = YES
R07_SERP_EXPECTS_NATIVE_SELF_SERVICE_EXECUTION = YES
R07_THIRD_PARTY_AUTOMATION_EXPECTATION = NOT_MATERIAL
OCTOPORT_LAUNCH_DIRECT_CARD_EDITING = NO
SEARCH_CAN_AUTHORIZE_NEW_WRITE_CAPABILITY = NO
```

Octoport-safe launch addressability remains read/analyze/explain/diagnose/recommend/prepare content or field values. Direct mutation stays outside launch scope until independently changed.

## R11 control and stop rule

R07 was the narrow control before `R11 = как работать в кабинете wildberries продавцу`. It now establishes a coherent card-specific subtask, so R11 can measure the broader cabinet task mix without treating card evidence as the whole intent.

All named R07 uncertainties are resolved by one complete top-20. Remaining uncertainty is product implementation/scope, which Search cannot resolve.

```text
R07_NARROW_CONTROL_FOR_R11 = RESOLVED
R11_REMAINS_NEEDED = YES
R07_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R07_MORE_SEARCH_NOW = NO
R07_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
```

M4 corpus seeds: Selsup, SellerMoon, WBStat, Marpla, InSales, Adapter, PromoPult. Wildberries Seller Help is first-party authority, not a competitor seed.

## Final verdict

```text
R07_VERDICT = DISTINCT_SELLER_OPERATIONAL_CARD_FILLING_INTENT_CONFIRMED_WITH_OFFICIAL_WB_AT_RANK_1_AND_ONLY_SECONDARY_SEO_OVERLAP
R07_DIRECT_OPERATIONAL_CARD_WORKFLOW = 16/20
R07_SEO_OPTIMIZATION_OVERLAP = 4/20
R07_CREATIVE_GENERATOR_OVERLAP = 0/20
R07_AI_GENERATOR_OVERLAP = 0/20
R07_THIRD_PARTY_DIRECT_AUTOMATION = 0/20
R07_SELLER_RELEVANCE = 20/20
R07_OCTOPORT_DIRECT_EDITING = NOT_IN_LAUNCH_SCOPE
R07_INFORMATION_SATURATED_FOR_CURRENT_DECISION = YES
R07_MORE_SEARCH_NOW = NO
R07_PAGE_OWNERSHIP_DECISION = DEFERRED_TO_M9_M11
R07 = CLOSED_FOR_CURRENT_M3_AFTER_DURABLE_READBACK
```
