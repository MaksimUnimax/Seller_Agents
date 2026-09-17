# R07 query-specific research and release — 2026-09-17

Stage: `M3 — Ordinary Yandex SERP collection`.  
Query ID: `R07`.  
Query: `как заполнить карточку товара wildberries`.  
Families: `F5, F8`.  
Relation: narrow control before broader `R11 = как работать в кабинете wildberries продавцу`.  
Status: **PASS / QUERY-SPECIFIC PRE-STEP COMPLETE / EXACTLY ONE LOCAL START RELEASED AFTER REMOTE READBACK**.

## 1. Decision this query must resolve

R07 is not a generic “card” query. It is a bounded test of what Russian Yandex users mean when they ask how to fill a Wildberries product card.

Named decision:

```text
OPERATIONAL_SELLER_CARD_WORKFLOW
VS
CARD_SEO_AND_TEXT_OPTIMIZATION
VS
CREATIVE_IMAGE_INFOGRAPHIC_GENERATION
VS
GENERIC_EDUCATION_OR_COURSE_CONTENT
```

The key question is whether this wording resolves mainly to the seller’s actual card-filling workflow (category, title, description, characteristics, dimensions, documents, media, etc.), or whether visible demand is materially diverted into creative generators, SEO/content tools, courses and generic educational content.

This query also establishes a narrow control for R11. R11 is much broader and may mix cards, logistics, prices, analytics, advertising, supplies and general cabinet navigation. R07 must be closed first so card-specific evidence is not misread later as a generic cabinet intent.

## 2. Current official Wildberries product/source evidence

### 2.1 Seller Help — card creation is a real operational workflow

Current Wildberries Seller Help page `Как создать карточку товара`, updated 2026-08-04:

`https://seller.wildberries.ru/instructions/material/A-927`

It explicitly covers the practical fields and steps of card creation, including:

- product name;
- 18+ flag where applicable;
- category;
- seller article;
- brand;
- color;
- TN VED;
- KIZ/marking requirement;
- description;
- product characteristics;
- NTIN where applicable;
- price;
- size table;
- barcode;
- package dimensions;
- permits / supporting documents;
- photo and video;
- completion of card creation.

The same official help surface points sellers to tools for improving the card, including photo editor, photo tags, AI photo studio, rich content and A/B tests.

This proves that “fill the card” is a concrete seller workflow, not merely an abstract SEO topic.

### 2.2 Seller Help — optimization is adjacent but not identical

Current Wildberries guidance `Как оптимизировать карточку товара`:

`https://seller.wildberries.ru/instructions/ru/ru/material/how-to-optimize-the-product-profile`

It recommends organic use of keywords, spelling/style checks and complete characteristics, and documents a WB neural-network description generator available under relevant tariff/subscription conditions.

Therefore R07 may legitimately contain an SEO/text-optimization layer, but this layer must be distinguished from the broader operational card-filling workflow.

### 2.3 Seller Help — media/creative work is a separate real subtask

Current Wildberries photo guidance:

`https://seller.wildberries.ru/instructions/ru/ru/material/item-photo-rules-recommendations-and-common-mistakes`

and the `Как улучшить карточку товара` section show that photos, rich content, photo editing, AI photo studio, video cover and other creative surfaces are genuine card-related jobs.

This means a SERP containing image/infographic generation is not automatically noise. It is adjacent card work, but it must not be collapsed into the same intent as filling operational seller fields.

## 3. Current official WB API capability evidence

Current WB API Product Management documentation:

`https://dev.wildberries.ru/openapi/work-with-products`

The public Content API currently documents methods that can technically:

- create product cards;
- edit product cards;
- retrieve categories, subjects, characteristics and brands;
- retrieve created cards;
- upload media files to cards;
- work with other product-management data.

Examples include `POST /content/v2/cards/upload`, product-card list methods and media upload methods under the Content token category.

### Critical product-scope interpretation

This API capability **does not expand Octoport launch scope**.

Current Octoport launch scope remains read/analyze/explain/diagnose/recommend/prepare reports or content; direct product-card editing is not part of the accepted launch promise.

Therefore:

```text
WB_API_CAN_WRITE_PRODUCT_CARDS = YES
OCTOPORT_LAUNCH_DIRECT_CARD_EDITING = NO
SEARCH_CAN_AUTHORIZE_NEW_WRITE_CAPABILITY = NO
```

If the R07 SERP strongly expects direct creation/editing, that is a product-gap/boundary signal, not permission to advertise unsupported write actions.

## 4. Fresh non-authoritative boundary research

Fresh web research confirms a separate commercial layer of AI/creative card generators. Examples include:

- `https://kartochka.me/` — AI infographic/card generator;
- `https://itemcard.ru/` — AI generation of marketplace card visuals and infographic packs;
- `https://kartogen.ru/generator-kartochek` — AI generator for photos/infographics/text/video;
- `https://mpmgr.ru/blog/cards-seo/kak-sozdat-kartochku-wildberries` — current seller education combining operational filling with SEO considerations.

These are category/boundary examples only. They are not authorities for Octoport capability and do not predetermine the Yandex top-20 composition.

## 5. Full-result coding plan for the later R07 export

Every returned normalized result must be reviewed; no sampling.

Primary coding classes:

- `WB_NATIVE_CARD_CREATION_OR_FILLING_GUIDE`
- `SELLER_OPERATIONAL_CARD_WORKFLOW_GUIDE`
- `CARD_SEO_TEXT_OR_CHARACTERISTICS_OPTIMIZATION`
- `CREATIVE_IMAGE_INFOGRAPHIC_OR_MEDIA_GENERATOR`
- `AI_CARD_CONTENT_GENERATOR`
- `DIRECT_CARD_MANAGEMENT_OR_AUTOMATION_SERVICE`
- `COURSE_OR_GENERIC_SELLER_EDUCATION`
- `NOISE_OTHER_INTENT`

For each result record at minimum:

- rank;
- domain / URL / title / snippet;
- page type;
- actor (seller, agency/course, software, WB itself, buyer/other);
- whether it addresses operational seller fields;
- whether it is primarily SEO/text optimization;
- whether it is primarily image/infographic/media generation;
- whether it promises direct card changes/automation;
- commercial vs informational intent;
- Octoport current-fit assessment without inventing capabilities.

## 6. Stop rule

R07 is saturated for the current M3 decision when one complete top-20 makes the dominant intent and material collision classes clear enough to answer:

1. Is operational card filling a distinct seller search job?
2. How large is the SEO/text-optimization overlap?
3. How large is the creative-generator overlap?
4. Is direct execution/editing materially expected?
5. Is R07 sufficiently distinct from broad R11 cabinet work?

If remaining uncertainty is only product implementation/capability, Search must stop because another SERP cannot authorize unsupported functionality.

## 7. Provider lifecycle gate

Job ID:

`octoport-serp-r07-20260917`

Only after this document and updated `SERP_PROGRESS.md` are durably persisted and read back may exactly one local `start` be issued.

Released start schema:

```text
SEARCH_ASYNC_BATCH_API_V1 {"action":"start","jobId":"octoport-serp-r07-20260917","queries":["как заполнить карточку товара wildberries"],"confirmBillable":true,"maxRequests":1,"maxCostRub":0.0305,"searchType":"SEARCH_TYPE_RU","region":"225","page":0,"groupsOnPage":20,"docsInGroup":1,"groupMode":"GROUP_MODE_FLAT","familyMode":"FAMILY_MODE_MODERATE","fixTypoMode":"FIX_TYPO_MODE_OFF","sortMode":"SORT_MODE_BY_RELEVANCE","sortOrder":"SORT_ORDER_DESC"}
```

After a successful local start:

- do not repeat `start`;
- persist/read back exact start envelope;
- only then consider one `submitN`;
- no `collectN` before accepted submit;
- no export before terminal success;
- no R11 provider action before R07 complete export + persistence + all-result analysis + readback.
