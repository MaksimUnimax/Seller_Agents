# M3 — representative Yandex SERP query matrix

Date: 2026-09-16.
Status: `ACTIVE COLLECTION MANIFEST`.
Authority: `../SEO_MASTER_ROADMAP_2026-09-16.md`.

Purpose: collect enough current ordinary Yandex SERP evidence to resolve category language, marketplace split, task/analytics intent, comparison/discovery intent, LLM/integration intent and noise boundaries before Collection Freeze. This is not a fixed quota: queries are released only while they add material information.

## Execution rule

For each released query:

`start -> persist/readback -> submitN -> persist/readback -> due collectN -> persist/readback -> export -> persist/hash/provenance -> close query -> release next`.

No blind retry and no parallel duplicate submission of the same query. Until the current YMB popup/state bug and batch semantics are independently fixed/accepted, use one-query jobs for provider safety.

## Priority matrix

| ID | Query | Evidence purpose | Wordstat context | State |
|---|---|---|---:|---|
| S01 | `ии агенты для маркетплейсов` | prove/deny core AI-agent category and discover recurring SERP competitors/page types | 134 | `CLOSED / 20 RESULTS` |
| S02 | `ии агент для озон` | test Ozon-specific commercial/product intent and whether Ozon warrants distinct ownership | 40 | `RELEASED` |
| S03 | `ии агент для wildberries` | test WB-specific commercial/product intent and compare with Ozon | 20 | `QUEUED` |
| S04 | `какой ии для маркетплейсов` | comparison/discovery intent and expected page format | 128 | `QUEUED` |
| S05 | `ии для работы с маркетплейсами` | broader task-oriented wording; resolve product vs education/training intent | 39 | `QUEUED` |
| S06 | `ии для аналитики маркетплейсов` | AI analytics task wording | 15 | `QUEUED` |
| S07 | `сервис аналитика продаж на маркетплейсах` | classic analytics-service category vs Octoport-like product intent | 39 | `QUEUED` |
| S08 | `сервис внутренней аналитики маркетплейсов` | seller-owned/internal analytics vs marketplace built-in analytics ambiguity | 19 | `QUEUED` |
| S09 | `ии для маркетплейсов` | broad control: measure content-generation contamination in ordinary SERP | 3381 broad root | `QUEUED CONTROL` |
| S10 | `нейросеть для маркетплейсов` | broad control for card/image/content-generation intent | 3451 broad root | `QUEUED CONTROL` |
| S11 | `ии ассистент для маркетплейсов` | agent vs assistant category behavior | 13 | `CONDITIONAL` |
| S12 | `ии агент для маркетплейсов` | singular-vs-plural generic category behavior | derived from category | `CONDITIONAL` |
| S13 | `chatgpt для ozon` | LLM↔Ozon pairing intent | 9 | `CONDITIONAL` |
| S14 | `chatgpt для wildberries` | LLM↔WB pairing intent | 10 | `CONDITIONAL` |
| S15 | evidence-backed `подключить ИИ/ChatGPT к Ozon/WB` formulation | integration/natural-language-to-store-data job | not yet fixed | `CONDITIONAL AFTER S02/S03/M4` |
| S16 | `нейросети для менеджеров маркетплейсов` | persona/tool vs course/training control | 19 | `CONDITIONAL` |
| S17 | `нейросеть помощь для маркетплейсов` | explicit noise/control confirmation | 517, card/infographic-heavy Wordstat expansion | `OPTIONAL CONTROL` |

## Release/stop logic

After every 2–4 materially different queries, update the recurring-domain/page-type registry. A conditional query is skipped when earlier SERPs already answer its intended decision with sufficient evidence.

M3 can close before all conditional rows execute if additional queries stop changing:

- dominant intent/page types;
- recurring competitor set;
- Ozon/WB split evidence;
- agent/assistant/category semantics;
- analytics/integration ambiguity;
- candidate Page Jobs;
- newly discovered lexical families.

M3 cannot close while any high-value split/merge or category decision lacks representative current SERP evidence.
