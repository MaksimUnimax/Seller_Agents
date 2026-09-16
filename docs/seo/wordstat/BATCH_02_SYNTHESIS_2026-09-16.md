# Wordstat Batch 02 — synthesis

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `COMPLETE`.

## Evidence boundary

This synthesis is based only on persisted Batch 02 Wordstat evidence. It does not treat `totalCount` values as additive across overlapping phrases and does not convert broad counts into Octoport demand without intent verification. Final URL/page architecture remains blocked on SERP evidence.

Batch 02 execution totals:

- provider calls: `15/15` completed;
- calls with usable `totalCount`: `15/15`;
- successful exact-empty `result: {}` calls: `0`;
- provider failures: `0`;
- estimated accumulated provider cost: `0.30 ₽`.

## 1. `агент` is the strongest product-fit category vocabulary observed in this targeted pass

Observed exact/seed counts:

- `ии агенты для маркетплейсов` — `134`;
- `ии агент для озон` — `40`;
- `ии агент для wildberries` — `20`;
- `ии агент для селлера` — `4`.

The first three are semantically close to Octoport's product model and materially stronger than the seller-specific exact wording. They produced little or no useful child expansion, so the next question is SERP intent, not additional blind Wordstat expansion.

Implication: prioritize `агент` wording for SERP verification, but do not yet assign standalone routes.

## 2. `ассистент` is relevant but weaker than `агент`

Observed:

- `ии ассистент для маркетплейсов` — `13`;
- `ии ассистент для озон` — `10`.

This vocabulary is product-compatible, but current evidence is weaker than the corresponding agent wording. Treat it as supporting language inside the same broader cluster unless SERP evidence reveals a distinct intent.

## 3. Task-oriented AI wording exists but is fragmented and partly mixed with education

Observed:

- `ии для работы с маркетплейсами` — `39`;
- `ии для продаж на маркетплейсах` — `23`;
- `ии для аналитики маркетплейсов` — `15`;
- `нейросети для менеджеров маркетплейсов` — `19`.

`ии для работы с маркетплейсами` returned a child `ии для работы с маркетплейсами обучение` — `10`, showing that training/education can contaminate the phrase. The other targeted phrases produced no useful product-specific expansion.

Implication: these are secondary semantic supports and selected SERP-check candidates, not page decisions.

## 4. Analytics/service wording remains commercially interesting but highly ambiguous

Observed:

- `сервис аналитика продаж на маркетплейсах` — `39`;
- `сервис для аналитики продаж на маркетплейсах` — `19`;
- `сервис внутренней аналитики маркетплейсов` — `19`.

The first seed returned the second phrase as a child, confirming that they belong to the same close lexical cluster. However the association vocabulary is noisy and does not distinguish external market-intelligence products from tools working with the seller's own marketplace data.

`сервис внутренней аналитики маркетплейсов` is especially important to verify because "внутренняя аналитика" can mean either seller-owned/internal data or native marketplace analytics.

Implication: this cluster requires SERP inspection before any commercial landing route is considered.

## 5. `нейросеть помощь для маркетплейсов` is a false-positive broad root for Octoport demand

Seed `нейросеть помощь для маркетплейсов` returned `totalCount = 517`, but its returned children were dominated by content creation:

- `карточки для маркетплейсов с помощью нейросети` — `471`;
- `создание карточек для маркетплейсов с помощью нейросети` — `309`;
- `инфографика для маркетплейсов с помощью нейросети` — `36`;
- `создание инфографики для маркетплейсов с помощью нейросетей` — `24`.

Therefore the `517` must not be counted as direct demand for an AI agent / marketplace-control product. Keep it outside the core product-fit cluster. One SERP control check may be useful only to confirm the observed content-generation intent.

## 6. `какой ии для маркетплейсов` is meaningful discovery/comparison demand but not yet product-specific

Observed `totalCount = 128` with no returned child rows. The wording suggests comparison/recommendation discovery, but Wordstat alone does not show whether users expect card-generation tools, general LLMs, analytics services, or agent-style marketplace tooling.

Implication: high-priority SERP-intent check. It may support informational/comparison content later, but should not be assigned a page role before the SERP is inspected.

## 7. `ии агент для селлера` is too small to drive a dedicated route

Observed `totalCount = 4`, with no `results` or `associations` arrays returned in the response.

The phrase is semantically relevant but currently too small to justify a separate page. Keep `селлер` as supporting role vocabulary within the broader agent cluster.

## Normalized cluster view

### Core agent cluster — highest product-fit priority

- `ии агенты для маркетплейсов` — `134`;
- `ии агент для озон` — `40`;
- `ии агент для wildberries` — `20`;
- supporting: `ии ассистент для маркетплейсов` — `13`, `ии ассистент для озон` — `10`;
- supporting role phrase: `ии агент для селлера` — `4`.

### Task/use-case cluster — secondary product-fit

- `ии для работы с маркетплейсами` — `39`;
- `ии для продаж на маркетплейсах` — `23`;
- `ии для аналитики маркетплейсов` — `15`;
- `нейросети для менеджеров маркетплейсов` — `19`.

### Analytics-service cluster — commercial but ambiguous

- `сервис аналитика продаж на маркетплейсах` — `39`;
- `сервис для аналитики продаж на маркетплейсах` — `19`;
- `сервис внутренней аналитики маркетплейсов` — `19`.

### Discovery/comparison cluster — informational, intent unknown

- `какой ии для маркетплейсов` — `128`.

### Exclude from core product-demand counting

- `нейросеть помощь для маркетплейсов` — `517` because returned child vocabulary is overwhelmingly card/infographic generation.

## SERP verification priority

The bounded next pass should inspect these queries first:

1. `ии агенты для маркетплейсов` — establish category intent around the strongest generic agent wording;
2. `ии агент для озон` — determine whether Ozon-specific agent intent is product/tool oriented;
3. `ии агент для wildberries` — same for Wildberries;
4. `какой ии для маркетплейсов` — determine comparison/discovery expectations;
5. `сервис аналитика продаж на маркетплейсах` — distinguish classic external analytics from seller-owned data tooling;
6. `сервис внутренней аналитики маркетплейсов` — determine meaning of "внутренняя" in live SERP;
7. `ии для работы с маркетплейсами` — check training/education contamination versus tool intent.

Optional control query after those: `нейросеть помощь для маркетплейсов` to confirm the content-generation SERP pattern already strongly suggested by Wordstat children.

## Batch 02 routing conclusion

Batch 02 materially narrowed the semantic field. The strongest product-fit vocabulary is the AI-agent cluster, especially generic marketplace agents and marketplace-specific Ozon/Wildberries agent phrases. Assistant, task/use-case and seller-role wording should currently remain supporting vocabulary. Analytics-service wording is commercially relevant but cannot be routed until live SERP intent separates external analytics, native marketplace analytics and seller-owned-data workflows.

Do not change production site copy or create final SEO routes yet. Next stage is bounded SERP-intent verification of the priority list above, followed by page-role decisions only from combined Wordstat + SERP evidence.
