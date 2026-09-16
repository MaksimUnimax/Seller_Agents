# SEO roadmap Октопорта — historical coarse roadmap

Status: **SUPERSEDED AS EXECUTION AUTHORITY**.
Дата supersession: 2026-09-16.

Текущая execution authority:

`SEO_MASTER_ROADMAP_2026-09-16.md`

Этот файл сохранён как исторический coarse roadmap первого SEO-прохода. Его общие принципы остаются полезными, но текущий cursor, порядок evidence collection и финальные acceptance gates определяются только master roadmap.

---

## Historical roadmap

SEO развивается независимо от server/extension implementation, но не может публиковать обещания, которые опережают product truth или deployment state.

| Этап | Работа | Артефакт | Критерий завершения |
|---|---|---|---|
| SEO-S0 | Authority, product truth, методика, provenance rules, initial seeds | `docs/seo/*` | Документы созданы; гипотезы отделены от фактов; Wordstat source закреплён |
| SEO-S1 | Broad Wordstat discovery | `wordstat/raw`, `wordstat/normalized`, evidence receipt | Seed families прогнаны; raw results неизменяемы; provenance полный |
| SEO-S2 | Очистка и классификация universe | `semantic/UNIVERSE.*`, `WORKING`, `REVIEW`, `EXCLUDED` | Каждая строка имеет статус/reason; нет потерянных raw variants |
| SEO-S3 | Intent clustering и route design | `clusters/` | Каждый WORKING cluster имеет intent и target route либо HOLD |
| SEO-S4 | SERP verification ключевых кластеров | `serp/` | Проверены главная категория, marketplace pages и спорные CREATE/merge cases |
| SEO-S5 | Search architecture | target map / URL roles | Определены KEEP/OPTIMIZE/CREATE/ROUTE/RECHECK без fake CREATE |
| SEO-S6 | Page specs | `pages/*.md` | Для target pages: primary/secondary + Wordstat, H1/Title, coverage, links, priority |
| SEO-S7 | Technical SEO handoff | `technical/` + bounded site task | Canonical/indexability/sitemap/metadata/schema requirements готовы разработчику |
| SEO-S8 | Source implementation review | implementation evidence | Реальный site source соответствует page specs и technical SEO boundary |
| SEO-S9 | Post-deploy verification | production evidence | Проверены live status, robots, sitemap, canonical, status codes, rendered content |
| SEO-S10 | Measurement loop | periodic evidence | Индексация/queries/impressions/clicks используются для приоритетных корректировок |

## Historical SEO-S0

Входит:

- отдельный нормативный каталог SEO;
- фиксация бренда Октопорт / Octoport;
- фиксация маскота/метафоры только как brand context;
- продуктовая truth-граница;
- источник Yandex Wordstat Bridge;
- правила raw/provenance;
- seed taxonomy;
- первый seed list;
- подготовка Wordstat batches.

Не входит:

- выдуманная частотность;
- окончательная URL architecture до discovery;
- публикация изменений `apps/site`;
- production deployment;
- изменение server/extension contracts;
- платная семантика Яндекс Директа.

## Historical SEO-S1 — broad discovery

### Цель

Не доказать заранее выбранные ключи, а найти словарь рынка.

### Волны

1. **Category language**: ИИ/нейросеть/AI/помощник для маркетплейсов/селлеров.
2. **Marketplace language**: Ozon/Озон и Wildberries/Вайлдберриз/WB.
3. **Task language**: аналитика, продажи, реклама, остатки, отчёты и другие read-capabilities.
4. **LLM pairing**: ChatGPT/другие LLM ↔ Ozon/WB/marketplaces.
5. **Integration language**: подключить, интеграция, расширение, API, выгрузить данные в ИИ.
6. **Problem queries**: «как анализировать…», «как использовать ИИ…», «нейросеть для анализа…».
7. **Adjacent terms**: новые релевантные слова, обнаруженные provider results.

### Stop condition

Discovery нельзя остановить по числу строк. Он заканчивается, когда дополнительные релевантные seed expansions перестают открывать новые значимые интенты/лексические семьи.

## Historical SEO-S2 — очистка

Особенно контролировать смешения:

- покупательские запросы Ozon/WB vs seller intent;
- «ИИ для карточек товара» как генерация контента vs фактический read-only Октопорт;
- управление ценами/ставками vs аналитика;
- вакансии и профессия «менеджер маркетплейсов»;
- курсы/обучение;
- API developer intent;
- встроенные AI-функции самих маркетплейсов;
- сервисы аналитики, которые пользователь может искать как отдельную категорию;
- consumer ChatGPT shopping use cases.

## Historical SEO-S3/S4 — решение о страницах

До этих этапов следующие страницы являются лишь вероятными ролями, не принятой архитектурой:

- главная product/category page;
- Ozon page;
- Wildberries page;
- отдельные task/use-case pages;
- LLM integration pages;
- security/how-it-works/support pages;
- guides/articles.

Отдельная страница создаётся, только если у неё есть собственный поисковый интент, достаточный контент и distinct product answer.

## Взаимодействие с потоком сайта

SEO не редактирует `apps/site` одновременно с отдельным site executor без synchronization.

Передача разработчику сайта выполняется bounded-пакетом:

1. список точных файлов/URL;
2. target intent;
3. Title/H1/content blocks;
4. canonical/indexing;
5. internal links;
6. acceptance checks;
7. что не менять.

Если сайт успевает создать URL до завершения семантики, наличие URL не превращает его автоматически в SEO target page.

## Взаимодействие с продуктовым roadmap

SEO может идти параллельно server/extension work, потому что research не изменяет runtime contracts. Но публичный copy должен отличать:

- `планируется/готовится`;
- `реализовано в source`;
- `проверено установленно`;
- `развёрнуто production`.

SEO не имеет права самостоятельно повышать продуктовый статус ради лучшей конверсии текста.
