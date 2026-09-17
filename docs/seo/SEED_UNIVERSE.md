# Initial seed universe — Октопорт

Статус всех фраз в этом файле: **SEARCH_HYPOTHESIS / NOT YET WORDSTAT-VALIDATED**.
Дата: 2026-09-16.

Цель списка — обеспечить широкий discovery, а не заранее доказать нужность конкретной страницы. Частотности намеренно отсутствуют.

## Правила seed list

- Seed должен открывать самостоятельный словарь рынка, а не быть механической перестановкой слов.
- Близкие варианты всё равно могут быть нужны, если Wordstat расширяет их по-разному (`Ozon`/`Озон`, `Wildberries`/`Вайлдберриз`).
- Фраза в seed list не означает, что её допустимо использовать как продуктовый claim.
- Unsupported mutation intents собираются как рыночный факт и затем исключаются/маршрутизируются по product truth.
- Новые релевантные термины из Wordstat добавляются append-only с provenance на seed, который их обнаружил.

## A. Общая категория AI × marketplaces

| ID | Seed | Зачем |
|---|---|---|
| A01 | ии для маркетплейсов | Основная гипотеза категории |
| A02 | нейросеть для маркетплейсов | Пользовательский синоним AI |
| A03 | ai для маркетплейсов | Англоязычная форма в русском спросе |
| A04 | искусственный интеллект для маркетплейсов | Полная формулировка |
| A05 | ии помощник для маркетплейсов | Assistant category |
| A06 | ии помощник селлера | Role-oriented category |
| A07 | ии для селлеров | Короткая role category |
| A08 | нейросеть для селлеров | Role + neural wording |
| A09 | ии помощник продавца маркетплейсов | Explicit seller wording |
| A10 | ии сотрудник для маркетплейсов | Проверка принятого позиционирования «ИИ-сотрудник» |
| A11 | ai помощник селлера | Mixed-language variant |
| A12 | нейросеть для продавца маркетплейсов | Natural language variant |
| A13 | автоматизация маркетплейсов с ии | Adjacent automation wording; требует product-safe фильтра |
| A14 | аналитика маркетплейсов с ии | Сильная hypothesis для реального read-only scope |
| A15 | анализ маркетплейсов нейросетью | Task/category bridge |

## B. Ozon category language

| ID | Seed | Зачем |
|---|---|---|
| B01 | ии для ozon | Brand Latin variant |
| B02 | ии для озон | Cyrillic variant |
| B03 | нейросеть для ozon | Neural wording |
| B04 | нейросеть для озон | Cyrillic neural wording |
| B05 | ии помощник ozon | Assistant wording |
| B06 | ии помощник для озон | Natural variant |
| B07 | ai для ozon | Mixed language |
| B08 | искусственный интеллект ozon | Full term |
| B09 | аналитика ozon с ии | Read-only category/task |
| B10 | анализ ozon нейросетью | Task wording |

## C. Wildberries category language

| ID | Seed | Зачем |
|---|---|---|
| C01 | ии для wildberries | Latin brand |
| C02 | ии для вайлдберриз | Cyrillic market spelling |
| C03 | ии для wb | Abbreviation |
| C04 | нейросеть для wildberries | Neural wording |
| C05 | нейросеть для вайлдберриз | Cyrillic neural wording |
| C06 | ии помощник wildberries | Assistant wording |
| C07 | ии помощник для вайлдберриз | Natural variant |
| C08 | ai для wildberries | Mixed language |
| C09 | аналитика wildberries с ии | Read-only category/task |
| C10 | анализ wildberries нейросетью | Task wording |

## D. ChatGPT pairing

ChatGPT используется как discovery-language, а не как обещание единственного/обязательного LLM.

| ID | Seed | Зачем |
|---|---|---|
| D01 | chatgpt для маркетплейсов | Вероятный пользовательский язык категории |
| D02 | чатгпт для маркетплейсов | Кириллическая форма |
| D03 | chatgpt для селлера | Role intent |
| D04 | chatgpt для продавца маркетплейсов | Explicit role |
| D05 | chatgpt ozon | Broad pairing |
| D06 | chatgpt для ozon | Explicit pairing |
| D07 | chatgpt для озон | Cyrillic marketplace |
| D08 | чатгпт озон | Cyrillic colloquial |
| D09 | chatgpt wildberries | Broad pairing |
| D10 | chatgpt для wildberries | Explicit pairing |
| D11 | chatgpt для вайлдберриз | Cyrillic marketplace |
| D12 | чатгпт вайлдберриз | Cyrillic colloquial |

## E. Другие LLM как discovery

Эти seeds проверяют наличие самостоятельного спроса. Отдельные landing pages до доказанного intent не предполагаются.

| ID | Seed |
|---|---|
| E01 | алиса для маркетплейсов |
| E02 | алиса ozon |
| E03 | алиса wildberries |
| E04 | gemini для маркетплейсов |
| E05 | gemini ozon |
| E06 | gemini wildberries |
| E07 | claude для маркетплейсов |
| E08 | claude ozon |
| E09 | claude wildberries |
| E10 | deepseek для маркетплейсов |
| E11 | deepseek ozon |
| E12 | deepseek wildberries |
| E13 | qwen для маркетплейсов |
| E14 | qwen ozon |
| E15 | qwen wildberries |

## F. Analytics / sales / reports jobs

| ID | Seed | Комментарий |
|---|---|---|
| F01 | ии аналитика маркетплейсов | Общая read-only задача |
| F02 | ии анализ продаж маркетплейсов | Sales analysis |
| F03 | нейросеть анализ продаж маркетплейсов | Neural wording |
| F04 | ии анализ продаж ozon | Ozon-specific |
| F05 | ии анализ продаж wildberries | WB-specific |
| F06 | анализ продаж ozon chatgpt | LLM task wording |
| F07 | анализ продаж wildberries chatgpt | LLM task wording |
| F08 | анализ отчетов маркетплейсов ии | Report analysis |
| F09 | нейросеть для отчетов маркетплейсов | Report language |
| F10 | ии для аналитики ozon | Natural task phrase |
| F11 | ии для аналитики wildberries | Natural task phrase |
| F12 | анализ данных ozon ии | Data analysis |
| F13 | анализ данных wildberries ии | Data analysis |

## G. Advertising / stock / product read-jobs

Проверяем спрос, но дальнейшая маршрутизация зависит от фактически разрешённых API/read capabilities.

| ID | Seed |
|---|---|
| G01 | ии анализ рекламы ozon |
| G02 | chatgpt реклама ozon анализ |
| G03 | ии анализ рекламы wildberries |
| G04 | chatgpt реклама wildberries анализ |
| G05 | ии анализ остатков ozon |
| G06 | ии анализ остатков wildberries |
| G07 | нейросеть остатки маркетплейсов |
| G08 | ии анализ товаров ozon |
| G09 | ии анализ товаров wildberries |
| G10 | ии анализ заказов ozon |
| G11 | ии анализ заказов wildberries |

## H. Integration / extension / API language

| ID | Seed | Риск/цель |
|---|---|---|
| H01 | интеграция chatgpt ozon | Может быть developer или seller intent |
| H02 | подключить chatgpt к ozon | Seller/integration intent |
| H03 | ozon api chatgpt | Сильный developer mix — требует review |
| H04 | расширение chatgpt ozon | Browser-extension language |
| H05 | интеграция chatgpt wildberries | Seller/developer mix |
| H06 | подключить chatgpt к wildberries | Seller/integration intent |
| H07 | wildberries api chatgpt | Developer mix |
| H08 | расширение chatgpt wildberries | Browser-extension language |
| H09 | подключить ии к маркетплейсу | Generic integration intent |
| H10 | интеграция ии с маркетплейсами | Generic integration intent |
| H11 | api маркетплейса нейросеть | Broad technical intent |
| H12 | расширение для ии маркетплейсы | Product implementation language |

## I. Problem/how-to language

| ID | Seed |
|---|---|
| I01 | как использовать ии для маркетплейсов |
| I02 | как использовать chatgpt для маркетплейсов |
| I03 | как использовать chatgpt для ozon |
| I04 | как использовать chatgpt для wildberries |
| I05 | как анализировать продажи ozon |
| I06 | как анализировать продажи wildberries |
| I07 | как анализировать рекламу ozon |
| I08 | как анализировать рекламу wildberries |
| I09 | как анализировать маркетплейсы с помощью ии |
| I10 | как подключить нейросеть к ozon |
| I11 | как подключить нейросеть к wildberries |

## J. Adjacent category — analytics services

Эта группа нужна, чтобы понять, насколько рынок формулирует задачу через существующую категорию «сервис аналитики». Наличие спроса не означает, что Октопорт нужно выдавать за классический dashboard analytics SaaS.

| ID | Seed |
|---|---|
| J01 | сервис аналитики маркетплейсов |
| J02 | аналитика маркетплейсов для селлеров |
| J03 | сервис аналитики ozon |
| J04 | сервис аналитики wildberries |
| J05 | аналитика ozon для продавцов |
| J06 | аналитика wildberries для продавцов |
| J07 | автоматизация аналитики маркетплейсов |

## K. Brand-defense seeds

| ID | Seed |
|---|---|
| K01 | октопорт |
| K02 | octoport |
| K03 | окто порт |
| K04 | octo port |

Нулевой спрос на старте нормален. Эти фразы не используются для оценки TAM и не исключаются из brand tracking.

## Первый порядок provider calls

Чтобы не тратить вызовы на механические вариации до понимания словаря, первый broad pass выполняется в следующем порядке:

1. A01 `ии для маркетплейсов`;
2. A02 `нейросеть для маркетплейсов`;
3. A06 `ии помощник селлера`;
4. A14 `аналитика маркетплейсов с ии`;
5. B01 `ии для ozon`;
6. B02 `ии для озон`;
7. C01 `ии для wildberries`;
8. C02 `ии для вайлдберриз`;
9. D01 `chatgpt для маркетплейсов`;
10. D06 `chatgpt для ozon`;
11. D10 `chatgpt для wildberries`;
12. F02 `ии анализ продаж маркетплейсов`;
13. H09 `подключить ии к маркетплейсу`;
14. J01 `сервис аналитики маркетплейсов`;
15. I01 `как использовать ии для маркетплейсов`.

После результатов этот список адаптируется: provider-discovered vocabulary имеет приоритет над бессмысленным механическим выполнением всех оставшихся seeds.

## Stop/expand rule для каждого seed

После `getTop`:

- если нет релевантных новых формулировок — seed помечается `DISCOVERED_NO_NEW_FAMILY`;
- если найдена новая релевантная лексическая семья — создаётся дочерний seed с `discovered_from`;
- если результаты в основном нерелевантны — сохраняются raw и создаётся exclusion pattern, но seed не «подчищается» задним числом;
- если спрос смешивает разные интенты — фраза идёт в `REVIEW` и позже проверяется SERP.
