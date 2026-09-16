# Wordstat Batch 01 — synthesis

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `COMPLETE`.

## Evidence boundary

This synthesis is based only on persisted Batch 01 Wordstat evidence. It does not convert broad Wordstat counts into product demand without intent checks, and it does not finalize URL/page architecture before targeted expansion and SERP verification.

Batch 01 execution totals:

- provider calls: `15/15` completed;
- calls with usable `totalCount`: `13`;
- successful calls with exact empty `result: {}`: `2`;
- provider failures: `0`;
- estimated accumulated provider cost: `0.30 ₽`.

## 1. Broad AI/marketplace vocabulary is heavily polluted by content-generation intent

Observed broad roots:

- `ии для маркетплейсов` — `3381`;
- `нейросеть для маркетплейсов` — `3451`.

The returned child vocabulary is dominated by cards, images, infographics and content creation. Therefore these broad counts must **not** be treated as direct Octoport-category demand.

Product-adjacent wording observed inside those broad results includes:

- `ии агенты для маркетплейсов` — `134`;
- `какой ии для маркетплейсов` — `128`;
- `ии для работы с маркетплейсами` — `39`;
- `ии для продаж на маркетплейсах` — `23`;
- `ии для аналитики маркетплейсов` — `15`;
- `ии ассистент для маркетплейсов` — `13`;
- `нейросеть помощь для маркетплейсов` — `517` (intent still ambiguous);
- `нейросети для менеджеров маркетплейсов` — `19`.

These are stronger candidates for targeted expansion than the broad roots themselves.

## 2. Seller/helper wording exists but exact initial phrasing is small

`ии помощник селлера` returned `totalCount = 20` with no returned expansion rows in the supplied envelope.

This does not support using that exact phrase as the primary category label. Seller/agent/assistant vocabulary remains worth testing through variants observed elsewhere.

## 3. Ozon-specific AI vocabulary is materially stronger than the initial generic helper wording

Observed roots:

- `ии для ozon` — `128`;
- `ии для озон` normalized by provider into a result led by `ии для озона` — `972`.

The large Cyrillic Ozon cluster is again strongly polluted by card/content-generation queries. Product-adjacent rows nevertheless appeared:

- `ии агент для озон` — `40`;
- `ии ассистент для озон` — `10`.

These should be targeted directly in Batch 02 rather than treating the whole `972` as relevant demand.

## 4. Wildberries-specific vocabulary is present but smaller and spelling-sensitive

Observed roots:

- `ии для wildberries` — `225`;
- `ии для вайлдберриз` — `76`.

Observed product-adjacent row:

- `ии агент для wildberries` — `20`.

The Latin marketplace spelling produced the larger root in Batch 01. No final SEO spelling decision should be made before targeted expansion and SERP inspection.

## 5. ChatGPT vocabulary exists, but current marketplace-specific volume is too small for dedicated routes

Observed:

- `chatgpt для маркетплейсов` — `67`;
- `chatgpt для ozon` — `9`;
- `chatgpt для wildberries` — `10`.

Current evidence supports treating ChatGPT as secondary/supporting vocabulary, not yet as a dedicated page family.

## 6. Analytics/service vocabulary is commercially meaningful but semantically risky

Observed:

- `аналитика маркетплейсов с ии` — `13`;
- `сервис аналитики маркетплейсов` — `756`.

The service-analytics cluster includes incumbent/classic analytics brands and comparison/review intent, so `756` cannot be assigned directly to Octoport demand.

However, several product-adjacent rows are important for targeted expansion:

- `сервис аналитика продаж на маркетплейсах` — `39`;
- `сервис для аналитики продаж на маркетплейсах` — `19`;
- `сервис внутренней аналитики маркетплейсов` — `19`.

These may better match Octoport's read-only use of seller-owned marketplace data than external market intelligence, but that fit must be validated by targeted Wordstat and SERP evidence.

## 7. Two exact seeds returned successful empty objects and must not be interpreted as zero

- `ии анализ продаж маркетплейсов` → exact `result: {}`;
- `подключить ии к маркетплейсу` → exact `result: {}`.

These calls are provider successes with no supplied `totalCount`/rows. They are evidence about these exact request forms, not proof of zero demand for the broader intents.

## 8. Initial educational wording is weak

`как использовать ии для маркетплейсов` returned `totalCount = 3` and no expansion arrays.

The exact wording is low-volume. Broader educational content may still be useful later, but it should not drive the commercial landing architecture from this evidence.

## Batch 01 routing conclusion

Do not change production site copy or create SEO routes from the broad roots yet.

The next evidence pass should isolate the product-fit vocabulary that actually appeared inside Batch 01: agent, assistant, work, sales, analytics, internal analytics, seller/manager language, and marketplace-specific agent wording. After that, priority clusters should receive SERP verification before page-role decisions.
