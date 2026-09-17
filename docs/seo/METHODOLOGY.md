# Методика SEO и семантического ядра Октопорта

Статус: **SEO-S0 methodology authority**.
Дата: 2026-09-16.

## 1. Принцип

SEO Октопорта строится target-first, evidence-first и product-safe.

Нельзя начинать с заранее придуманного дерева страниц, а затем натягивать на него ключи. Сначала собирается полный поисковый universe, затем определяется интент и только после этого создаются/оптимизируются target pages.

## 2. Канонический конвейер

### Phase 0 — product truth

Входы:

- `docs/product/SPEC.md`;
- `docs/product/UX.md`;
- `docs/decisions/DECISIONS.md`;
- `apps/site/README.md`;
- прямые актуальные решения владельца.

Выход: `PRODUCT_TRUTH.md`.

Любой поисковый запрос, который требует от продукта неподдерживаемого действия, может оставаться в semantic universe как рыночный факт, но не маршрутизируется на продающую страницу с ложным обещанием.

### Phase 1 — seed discovery

Создаётся широкий seed universe по независимым осям:

- category: ИИ / нейросеть / AI / помощник / сотрудник / агент;
- marketplace: Ozon / Озон / Wildberries / Вайлдберриз / WB / маркетплейсы;
- user role: селлер / продавец / менеджер маркетплейсов / аналитик;
- job-to-be-done: аналитика / продажи / реклама / остатки / отчёты / финансы / товары / заказы и другие реально читаемые контуры;
- LLM/provider language: ChatGPT и другие реально поддерживаемые/планируемые адаптеры;
- implementation language: расширение / интеграция / API / подключение;
- problem language: «как анализировать», «как подключить», «нейросеть анализирует…», «ИИ для…»;
- comparison/alternative language — только как discovery, не как автоматически допустимая competitor page.

Seed — это только `SEARCH_HYPOTHESIS`.

### Phase 2 — Wordstat discovery

Канонический provider reference:

`MaksimUnimax/blood_sand/tooling/llm-api-bridges/yandex-wordstat/reference-1.1.5/`.

Bridge поддерживает четыре разрешённых метода:

- `getTop` → `/v2/wordstat/topRequests`;
- `getDynamics` → `/v2/wordstat/dynamics`;
- `getRegionsDistribution` → `/v2/wordstat/regions`;
- `getRegionsTree` → `/v2/wordstat/getRegionsTree`.

Для discovery основным методом является `getTop`. `getDynamics` используется для сезонности/стабильности уже значимых фраз, а region methods — когда география реально меняет решение. Нельзя делать dynamics/regions для каждой фразы автоматически без аналитической причины.

Базовый discovery-проход:

- регион: РФ (`225`) до отдельного решения;
- devices: `DEVICE_ALL`;
- `numPhrases`: достаточно широкий лимит, но результаты сохраняются без искусственного дублирования;
- один seed может иметь несколько итераций расширения, если новые связанные фразы открывают отдельный релевантный словарь.

Каждый provider result сохраняет provenance:

- дата/время получения;
- bridge/reference version;
- method;
- исходный seed/phrase;
- regions/device/other request parameters;
- request/result ID при наличии;
- полный сырой result либо неизменяемую raw-копию;
- нормализованное представление отдельно.

Нельзя переписывать raw evidence после аналитической очистки.

### Phase 3 — normalization

Нормализация не должна уничтожать поисковое различие.

Храним минимум:

- `raw_phrase`;
- `normalized_phrase`;
- frequency metric(s) как вернул provider;
- source seed(s);
- provider provenance;
- brand/marketplace/LLM/entity tags;
- preliminary intent;
- status.

Дедупликация выполняется на нормализованном ключе, но raw-варианты и все источники сохраняются. Нельзя сложить частотности разных формулировок и выдать сумму за частотность одной фразы.

### Phase 4 — relevance classification

Каждая уникальная строка получает одно из состояний:

- `WORKING` — релевантна продукту и требует дальнейшей маршрутизации;
- `REVIEW` — неоднозначна, нужен SERP/product review;
- `EXCLUDED` — нерелевантна с причиной;
- `BRAND_DEFENSE` — брендовая/навигационная фраза, которая может иметь низкий объём, но важна отдельно.

Причины исключения должны быть конечным словарём, например:

- другой смысл слова;
- покупатель, а не продавец;
- вакансии/обучение без продуктового интента;
- unsupported mutation/job;
- developer-only API intent без релевантной пользовательской посадки;
- другой marketplace;
- информационный шум;
- adult/illegal/irrelevant;
- duplicate normalized intent;
- competitor navigational query без законной/полезной страницы.

`EXCLUDED` строки не удаляются физически.

### Phase 5 — intent classification

Предварительные классы:

- `COMMERCIAL_CATEGORY` — ищут класс продукта;
- `COMMERCIAL_MARKETPLACE` — решение для конкретного Ozon/WB;
- `COMMERCIAL_TASK` — решение конкретной задачи продавца;
- `COMMERCIAL_LLM_PAIRING` — связка LLM ↔ marketplace;
- `INTEGRATION` — подключение/интеграция/API/расширение;
- `INFORMATIONAL_PROBLEM` — как решить задачу/получить данные;
- `BRAND_NAVIGATIONAL` — Октопорт/Octoport;
- `COMPARISON` — сравнение/альтернатива;
- `SUPPORT` — установка, ключи, безопасность, совместимость;
- `IRRELEVANT`.

Класс — аналитическое поле, не готовая структура URL.

### Phase 6 — clustering

Кластер объединяет фразы только если один документ способен честно и полно закрыть их интент.

Используются:

1. семантическое сходство;
2. одинаковая задача пользователя;
3. одинаковая стадия выбора;
4. фактическая SERP-совместимость для спорных/приоритетных кластеров;
5. product capability boundary.

Нельзя объединять запросы только потому, что у них одинаковые слова `Ozon` или `ИИ`.

### Phase 7 — target-first routing

Для каждого рабочего кластера принимается один route:

- `HOME`;
- `MARKETPLACE_PAGE`;
- `FEATURE_OR_USE_CASE`;
- `LLM_INTEGRATION_PAGE`;
- `SUPPORT_OR_DOCS`;
- `ARTICLE/GUIDE`;
- `NO_INDEX_TARGET`;
- `HOLD`.

Затем определяется физическое действие:

- `KEEP` — существующая страница подходит;
- `OPTIMIZE` — существующая страница требует SEO-изменения;
- `CREATE` — новая страница действительно нужна;
- `ROUTE_INTERNAL_LINK` — отдельная страница не нужна, требуется перелинковка/coverage;
- `RECHECK` — данных недостаточно.

Запрещён fake CREATE ради красивого sitemap.

### Phase 8 — SERP verification

SERP проверяется приоритетно для:

- главной категории;
- Ozon и WB кластеров;
- high-frequency/high-business-value кластеров;
- неоднозначных intent merges;
- случаев, где решается `CREATE` vs `OPTIMIZE`;
- возможной каннибализации.

Фиксируются дата, поисковая система, регион/локализация, формулировка запроса, типы результатов и вывод об интенте. Сниппеты конкурентов не копируются в тексты Октопорта.

### Phase 9 — page specification

Для каждой индексируемой SEO-target page обязательны:

- URL/role;
- primary query + Wordstat;
- secondary queries + Wordstat каждой фразы;
- intent;
- user job;
- product promise boundary;
- собственная зона coverage;
- `covered_elsewhere` — что эта страница не должна таргетировать;
- H1 target state;
- Title target state;
- description guidance;
- обязательные смысловые блоки;
- доказательства/демонстрации продукта;
- FAQ только при реальной пользовательской потребности;
- internal links in/out;
- canonical/indexing state;
- SEO priority `HIGH/MEDIUM/LOW` с основанием;
- implementation state.

### Phase 10 — technical SEO

Минимальный технический gate публичного сайта:

- один canonical origin `https://octoport.ru/`;
- корректные canonical links;
- robots без случайного блокирования target pages;
- sitemap только из реальных канонических индексируемых URL;
- корректная HTML semantic structure и один логичный H1;
- уникальные Title/H1 для разных target roles;
- доступный основной контент без зависимости от client JS, если JS не нужен продукту;
- redirects без цепочек для переименованных/удалённых SEO URL;
- отсутствие thin/fake pages;
- корректные Open Graph/social metadata отдельно от поискового Title;
- structured data только там, где schema соответствует реальному содержимому;
- performance/Core Web Vitals учитываются при развитии сайта, но не используются как замена релевантности и контента.

### Phase 11 — post-launch measurement

После production deployment фиксируется новая стадия evidence:

- индексирование;
- impressions;
- clicks;
- CTR;
- запросы;
- позиции/visibility с указанием источника;
- landing pages;
- brand vs non-brand;
- conversion signals, когда они станут технически и юридически допустимыми.

Изменение страницы после запуска должно связывать гипотезу с измеряемым результатом, а не сводиться к бесконечному переписыванию текста.

## 3. Приоритизация

SEO priority — не «частотность по убыванию».

Оцениваются совместно:

- relevance к product truth;
- business intent;
- Wordstat demand;
- способность Октопорта реально решить задачу;
- близость к launch scope;
- конкуренция/тип SERP;
- риск каннибализации;
- стоимость создания полезной страницы;
- роль в архитектуре внутренней перелинковки.

Никакой числовой scoring-модели не вводится до появления необходимости. Приоритет `HIGH/MEDIUM/LOW` сопровождается текстовым basis.

## 4. Принцип полноты

«Собрали 100/1000/3000 фраз» не является критерием готовности.

Готовность семантики определяется тем, что:

- покрыты независимые словари/интенты;
- новые seed expansions перестают открывать значимые новые классы;
- неоднозначные high-value запросы прошли review;
- каждый WORKING cluster имеет target route;
- каждая target page имеет собственную границу;
- все численные данные имеют provenance.

## 5. Запрет на выдуманные данные

До реального provider call нельзя записывать частотность, динамику или региональное распределение. Примерные числа, «обычно ищут» и модельная оценка спроса не заменяют Wordstat.

До SERP-проверки нельзя объявлять два запроса одним интентом только по интуиции, если от этого зависит создание/слияние страницы.
