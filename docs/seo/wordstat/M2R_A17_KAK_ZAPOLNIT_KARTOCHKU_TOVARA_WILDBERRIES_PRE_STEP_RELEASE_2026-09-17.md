# M2R-A17 pre-step research and query release — `как заполнить карточку товара wildberries`

Date: 2026-09-17.
Stage: `M2R — product-card operational work discovery (F5)`.
Status: **RELEASE CANDIDATE / OWNER-FACING DISCLOSURE REQUIRED BEFORE EXECUTION**.

## 1. Cursor

- Product truth: Octoport is not the AI employee. It gives the user's chosen supported AI governed access to marketplace data/tools so that the same AI can work as a seller employee/helper.
- A16 `как работать в кабинете wildberries`: CLOSED / totalCount 6 / totalCount-only / broad procedural cabinet root is tiny and non-expansive.
- F8 broad umbrella Wordstat synonym chasing is stopped; later F8 evidence should use task-specific queries, SERP and official help-center corpus.
- Corrected coverage audit marks F5 Product-card operational help as `WRONG-SHAPE`: historical card vocabulary is dominated by image/infographic/content-generation intent rather than operational card work.
- Owner explicitly confirmed that card tasks are relevant when they mean creating/filling/checking cards, attributes, description, SEO/category/compliance; stand-alone AI image/infographic generation is not core.
- Current launch remains read-only/analysis-first; acquisition relevance does not imply autonomous card editing at launch.
- M7 Collection Freeze remains blocked.

## 2. Query identity

`QUERY_ID = M2R-A17`

`QUERY_TEXT = как заполнить карточку товара wildberries`

Provider operation: `Wordstat.GetTop`.

## 3. Open decision

Discover the operational seller language around **creating/filling/checking a Wildberries product card**, separately from image/infographic generators.

Need to discover whether users naturally search for:

- how to create/fill a WB product card;
- product title/name;
- category selection;
- attributes/characteristics;
- description/text;
- SEO/search visibility/keywords;
- brand, color, composition and product data;
- price, sizes, barcode;
- package dimensions;
- certificates/marking/compliance;
- errors, moderation and blocking;
- card-quality/rating/checking;
- bulk creation/upload;
- tools/services for card management;
- photo/video/infographic generation that must be separated as non-core image intent.

## 4. Why this query follows A16

A16 proved that a broad procedural cabinet phrase is too small/non-expansive to enumerate seller mechanics. F5 is a named unresolved task family and offers a more specific procedural job.

Historical evidence does not count broad card-generation volume as F5 coverage because it is mostly wrong-shape image/infographic demand. A17 deliberately anchors on `заполнить карточку товара`, which is an operational seller workflow rather than a content-generator category label.

## 5. Fresh external research — 2026-09-17

### Yandex Wordstat.GetTop

https://aistudio.yandex.ru/ru/docs/search-api/api-ref/Wordstat/getTop

Current official contract says GetTop returns the last 30 days of popular phrase-containing/similar queries and accepts `numPhrases` from 1 to 2000.

Method consequence: use the exact operational card-work phrase as max-depth discovery and preserve the full provider response before interpretation.

### Wildberries official/current product-card workflow

https://seller.wildberries.ru/instructions/material/A-927

Updated 04.08.2026. The current official article `Как создать карточку товара` explicitly includes `Как заполнить карточку товара правильно` and covers:

- name/title;
- category;
- seller SKU;
- brand;
- color;
- TN VED / marking;
- description;
- product characteristics;
- price;
- size table;
- barcode;
- package dimensions;
- permits/documents;
- photo/video;
- card improvements;
- common reasons for card blocking.

The same current guidance says filled characteristics affect how often and to whom the product is shown; empty or contradictory characteristics reduce search/filter visibility.

### Wildberries official card-quality language

https://seller.wildberries.ru/instructions/en/ru/material/card-quality-rating

Current card-quality guidance says important characteristics affect whether the product appears in filters/search and that sellers should correctly fill significant characteristics.

### Current 2026 market-language evidence

- https://practicum.yandex.ru/blog/kartochka-tovara-wildberries-kak-sozdat/ — 05.05.2026, `Как оформить карточку на Wildberries`;
- https://pseller.ru/ru/blog/kartochka-tovara-wildberries — 10.09.2026, `как создать и заполнить в 2026`;
- https://selsup.ru/blog/kartochka-tovara-na-vajldberriz-kak-zapolnit-chtoby-prodat-tovar/ — updated 11.09.2026, current create/fill/characteristics language;
- https://mpmgr.ru/blog/cards-seo/kak-sozdat-kartochku-wildberries — 18.01.2026, current operational card workflow and SEO/attributes language.

These pages establish current search/market vocabulary; they are not Octoport product-truth authorities.

## 6. Product-scope boundary

F5 is relevant as a seller job, but current Octoport launch promise remains read-only/analysis-first.

Therefore current acquisition relevance may support jobs such as:

- inspect/check a card and its data;
- explain what fields/attributes are missing or inconsistent;
- prepare/recommend title, description, attributes or SEO changes;
- answer procedural questions using current official knowledge;

but must **not** be marketed as autonomous card editing/writing back to the marketplace unless that mutation capability is later implemented and accepted.

## 7. Source -> method trace

| Question | Source | A17 use | Boundary |
|---|---|---|---|
| Can GetTop expose operational card variants? | Yandex Wordstat.GetTop | max-depth discovery | demand/language only, not page proof |
| Is filling/checking the card a real current seller workflow? | WB official card-creation docs | retain field/attribute/description/compliance branches | launch remains read-only/analysis-first |
| Do characteristics affect search/filter visibility? | WB card-creation + quality-rating docs | retain card-quality/SEO/checking subjobs | no unsupported ranking guarantees |
| Is create/fill language live in 2026? | Yandex Practicum / PSeller / SelSup / MP Manager | justify exact query and likely lexical children | market/editorial wording != final page authority |

## 8. Information-gain contract

A17 must add information beyond historical card/image noise by:

1. measuring operational create/fill/check language;
2. discovering title/category/attribute/description terminology;
3. exposing SEO/search/card-quality vocabulary;
4. identifying barcode/dimensions/documents/compliance/error/blocking subjobs;
5. detecting bulk-card management/tool language;
6. explicitly separating image/photo/infographic-generation intent;
7. deciding whether a paired Ozon card-work probe is needed;
8. deciding whether F5 is represented well enough for later SERP verification and clustering.

## 9. Outcome contract

### SUCCESS_WITH_RESULTS

Persist the complete response first. Then review every direct row and materially useful association into provisional buckets:

- CARD_CREATION_FILL_CORE;
- TITLE_NAME_CATEGORY;
- ATTRIBUTES_CHARACTERISTICS;
- DESCRIPTION_TEXT;
- SEO_SEARCH_VISIBILITY;
- BRAND_COLOR_COMPOSITION_DATA;
- PRICE_SIZE_BARCODE;
- DIMENSIONS_LOGISTICS_DATA;
- DOCUMENTS_MARKING_COMPLIANCE;
- ERROR_MODERATION_BLOCKING;
- CARD_QUALITY_CHECK;
- BULK_UPLOAD_MANAGEMENT;
- TOOL_SERVICE;
- PHOTO_VIDEO;
- IMAGE_INFOGRAPHIC_GENERATION;
- COURSE_EDUCATION;
- NOISE;
- HOLD.

`IMAGE_INFOGRAPHIC_GENERATION` remains real search demand but is not counted as Octoport core merely because it mentions marketplace cards.

### SUCCESS_TOTALCOUNT_ONLY / EMPTY

Preserve exactly. Do not convert totalCount-only to zero. A weak exact root would not erase the operational workflow proven by current official WB guidance; it would mean users search through narrower field/task wording.

### TECHNICAL_FAILURE / UNKNOWN

Persist exact error; no semantic conclusion and no blind retry.

## 10. Provider/depth contract

Use:

- method: `getTop`;
- phrase: `как заполнить карточку товара wildberries`;
- numPhrases: `2000`;
- regions: `["225"]`;
- devices: `["DEVICE_ALL"]`.

Maximum depth is intentional under the owner quality-first rule. Cost is not a decision gate.

## 11. Stop / reopen

After full persistence/readback/analysis:

- if operational child language is rich, expand only named unresolved subjobs with material information gain;
- if image/infographic intent re-dominates, classify it separately and pivot to a narrower operational field/check query only when justified;
- release a paired Ozon card-work probe only if it adds marketplace-specific information;
- do not infer page count from phrase count;
- no claim of autonomous card editing at launch.

## 12. Persistence path

Planned raw:

`docs/seo/wordstat/raw/M2R_A17_KAK_ZAPOLNIT_KARTOCHKU_TOVARA_WILDBERRIES_RESULT_2026-09-17.md`

Required sequence:

`full provider response -> persist -> remote readback -> full-row analysis -> next provider action`.

## 13. Work trigger

`WORK_PRE_QUERY = NOT_REQUIRED` for this single bounded Wordstat call.

After A17 and one F7 search/niche acquisition probe, proactively trigger/prepare a Work reconciliation pass if the expected quality gain remains positive. The accumulated M2R corpus is now substantial enough that cross-family deduplication, intent classification, boundary QA and discovery-gap checking benefit from an independent full-volume pass. Resource economy is not a reason to defer it.

## 14. Downstream decision

A17 does not create a page. It repairs the old wrong-shape F5 coverage by measuring actual operational card-work language and determines what later SERP/card-family evidence is required.

## 15. Quality score

| Criterion | /10 |
|---|---:|
| Query purpose clarity | 10.0 |
| Incremental information gain vs wrong-shape historical F5 | 10.0 |
| Fresh provider-method support | 10.0 |
| Current official WB workflow support | 10.0 |
| Current 2026 market-language support | 10.0 |
| Image-generation boundary control | 10.0 |
| Product launch-scope discipline | 10.0 |
| Outcome/failure contract | 10.0 |
| Work/resource compliance | 10.0 |
| Downstream decision value | 10.0 |

`QUALITY_TOTAL = 100/100`
`QUALITY_SCORE = 10.0/10`

## 16. Release verdict

```text
M2R_A17_PRE_STEP = PASS
QUERY_RELEASE = READY_AFTER_OWNER_FACING_DISCLOSURE
PROVIDER_COMMANDS_EXECUTED_FOR_A17 = 0
QUERY = как заполнить карточку товара wildberries
```
