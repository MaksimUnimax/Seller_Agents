# SEO и семантика Октопорта

Статус: **MASTER ROADMAP ACTIVE / EVIDENCE COLLECTION IN PROGRESS**.
Дата начала: 2026-09-16.
Текущая рабочая ветка evidence/research: `seo/wordstat-batch-01-2026-09-16`.

Этот каталог — постоянная authority для органического поиска, семантического ядра, поисковой архитектуры, Алисы AI и технического SEO публичного продукта **Октопорт / Octoport**. Техническое имя репозитория не используется как целевой публичный бренд.

## Текущая execution authority

Главный исполняемый roadmap:

- [SEO_MASTER_ROADMAP_2026-09-16](SEO_MASTER_ROADMAP_2026-09-16.md) — текущий путь от evidence collection до готового production SEO-продукта.

Методические authority:

- [PRODUCT_TRUTH](PRODUCT_TRUTH.md) — реальные продуктовые границы и допустимые обещания;
- [METHODOLOGY](METHODOLOGY.md) — базовый evidence-first semantic/SEO pipeline;
- [EXTERNAL_METHOD_RESEARCH_2026-09-16](EXTERNAL_METHOD_RESEARCH_2026-09-16.md) — актуальные внешние методические опоры Yandex/Google + industry corroboration;
- [KW002_METHOD_AUDIT_2026-09-16](KW002_METHOD_AUDIT_2026-09-16.md) — что переносим из текущего KW-002, что адаптируем и что сознательно не копируем.

Старый [SEO_ROADMAP](SEO_ROADMAP.md) сохранён только как исторический coarse roadmap и **не является текущей execution authority**.

## Цель

Построить не набор «SEO-текстов» и не просто таблицу ключей, а доказуемый поисковый продукт:

`product truth → demand evidence → live Yandex SERP → search competitors → Alice AI evidence → evidence freeze → semantic master → SERP/task clustering → target page ownership → page specs → technical SEO → implementation → launch/indexing → Yandex/Google/Alice measurement`.

Финальная структура сайта не принимается до `M7 Collection Freeze` из master-roadmap. До этого собираем и сохраняем все evidence, нужные для честного решения о семантике, посадочных и оптимизации.

## Границы исследования

Основной рынок текущего прохода — русскоязычный спрос вокруг продавцов Ozon/Wildberries и использования ИИ/AI-агентов/нейросетей/LLM для работы с данными и задачами маркетплейсов.

Основные evidence surfaces:

1. Yandex Wordstat — спрос и лексические семьи;
2. обычный Yandex Search — интент, типы страниц, поисковые конкуренты, SERP overlap;
3. конкурентные landing/product/content pages — реальный язык категории, Page Jobs, proof/trust и coverage gaps;
4. Алиса AI / generative search — структура ответов, источники и follow-up decomposition;
5. Yandex Webmaster — после подключения: queries/market analysis, indexability, search query analytics, Alice AI visibility;
6. Google Search Console — cross-engine index/query baseline после запуска;
7. current Octoport site/source — техническая и контентная исходная точка.

Текущая цель — органический поиск и информационная архитектура. Платная семантика Директа может использовать результат позже, но не определяет текущую архитектуру.

## Уровни доказательности

Каждый важный вывод получает один из статусов:

- `PRODUCT_TRUTH` — подтверждено действующей продуктовой документацией/решением владельца;
- `SEARCH_HYPOTHESIS` — рабочая гипотеза до внешней проверки;
- `WORDSTAT_OBSERVED` — получено из Wordstat с параметрами/provenance;
- `SERP_OBSERVED` — подтверждено текущей обычной выдачей Yandex;
- `ALICE_OBSERVED` — подтверждено контролируемым ответом/источниками Алисы AI с датой;
- `COMPETITOR_OBSERVED` — подтверждено конкретной конкурентной страницей/URL;
- `SEO_DECISION` — принятое решение о кластере, page ownership, приоритете, split/merge или internal-link route с основанием;
- `IMPLEMENTED` — реально внесено в публичный сайт;
- `MEASURED` — подтверждено post-launch Webmaster/GSC/Alice/product analytics.

Нельзя повышать гипотезу до решения без нужного evidence слоя.

## Неподвижные правила provider/evidence

Для платных/асинхронных bridge/provider действий:

`FULL RESPONSE/EXPORT → DURABLE PERSIST → READBACK/VERIFY → ANALYSIS/PROGRESS → NEXT ACTION`.

Дополнительно:

- no blind retry;
- operation/job identity сохраняется;
- local lifecycle action не считается provider call;
- provider success в чате не считается downstream authority без durable evidence;
- raw evidence не заменяется аналитическим пересказом;
- неизвестный исход не превращается в ноль/отсутствие спроса.

## Текущий фактический cursor

### M0 — Governance + product truth

`PASS`.

### M1 — Current-site + measurement baseline

`OPEN` — read-only baseline должен быть завершён до production SEO implementation.

### M2 — Demand acquisition

`B01 + B02 PASS`.

Wordstat broad/targeted discovery завершён. Новый широкий Wordstat batch **не разрешён по умолчанию**. Reopen — только по конкретному information gap из Search/competitors/Alice.

### M3 — Ordinary Yandex SERP collection

`IN PROGRESS`.

S01 `ии агенты для маркетплейсов`:

- Deferred Search lifecycle завершён `SUCCEEDED`;
- 20 нормализованных результатов;
- validation usable for URL comparison;
- normalized authority сохранена в `serp/exports/`;
- S01 подтверждает самостоятельный search-intent/category слой AI-агентов для маркетплейсов: product/service landings + integrations + informational/comparison pages, а не только генерацию карточек.

### M4 — Search competitor + landing corpus

`OPEN`.

S01 уже дал первый candidate registry, но стабильный конкурентный корпус принимается только после нескольких разных query families.

### M5 — Alice AI / generative-search evidence

`OPEN / NOT STARTED`.

### M6–M7

Gap acquisition и Collection Freeze заблокированы до достаточного M3–M5 evidence.

### M8+

Финальная семантика, clusters, page ownership, посадочные и site implementation **сознательно заблокированы до Collection Freeze**, по прямому решению владельца: сначала собираем и сохраняем всё нужное, потом проектируем.

## Каталоги evidence/artifacts

- `wordstat/` — raw provider evidence, analysis, progress, synthesis;
- `serp/raw/` — lifecycle envelopes/errors/collect evidence;
- `serp/exports/` — нормализованные экспортные Search authorities + source hashes/provenance;
- `serp/analysis/` — query/lifecycle/intent analysis;
- `serp/competitors/` — recurring search competitor registry и page-level observations;
- `alice/` — будущие Alice/AI-search evidence/analysis;
- `semantic/` — будущий governed universe после Collection Freeze;
- `clusters/` — будущие SERP/task-first clusters;
- `pages/` — будущие final page specifications;
- `technical/` — baseline/technical SEO spec и QA;
- `evidence/` — acceptance receipts/closure artifacts;
- `WORKLOG.md` — append-only фактический ход работы.

## Критерий полноты

Полнота не измеряется числом фраз.

До перехода к финальной семантике должны быть закрыты:

- Wordstat baseline;
- representative ordinary Yandex SERP matrix;
- recurring search competitor set;
- relevant competitor page corpus;
- representative Alice AI cases;
- high-value evidence gaps;
- provider outcome ambiguity;
- durable evidence required for final decisions.

После этого master roadmap ведёт проект через semantic master → clusters → page ownership → page specs → technical implementation → production verification → measurement.

## Ключевые правила качества

- Частотность хранится рядом с конкретной фразой, не как выдуманный агрегат кластера.
- Высокая частотность не делает запрос релевантным; низкая не делает его бесполезным.
- Кластеры строятся по user job + intent + SERP compatibility, а не только по словам.
- `AMBIGUITY -> HOLD` до доказательства.
- Каждая target page имеет собственную coverage boundary и `covered_elsewhere`.
- Нет fake CREATE / thin pages / doorway pages.
- Конкурентный текст — evidence, а не материал для копирования.
- Каждая финальная страница проходит product-truth + Yandex ЭПОС gate.
- Техническое SEO не заменяет релевантность/контент, но canonical/indexability/robots/sitemap/internal links/schema/mobile/performance являются acceptance gates.
- Маскот и бренд не подменяют язык реального search intent.

## Взаимодействие с параллельной разработкой

SEO research до отдельного synchronization handoff изменяет только `docs/seo/**`.

Не трогать из этого потока:

- server/runtime contracts;
- extension implementation;
- текущую site implementation;
- moving `main`.

Production site patch появится только как отдельная bounded задача после принятия page map/page specs/technical spec.
