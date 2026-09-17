# Current site SEO baseline — 2026-09-16

Статус: **SOURCE AUDIT / NOT PRODUCTION CRAWL**.
Проверенная ветка source: `main`.
Main HEAD на начало SEO-S0: `16c0ac9b6aa9a72aa3100eb04f14bd74e4d6593a`.

Этот документ фиксирует только текущее состояние source `apps/site/public/`. Он не утверждает, что сайт уже production-deployed или проиндексирован.

## Проверенные файлы

- `apps/site/public/index.html`;
- `apps/site/public/robots.txt`;
- `apps/site/public/sitemap.xml`.

## Текущий search surface

### HTML language

`PASS`: `<html lang="ru">`.

### Title

Текущее значение:

`Octoport — ИИ-сотрудник для Ozon и Wildberries`

Оценка: `PRODUCT_SAFE / SEARCH_TARGET_UNVALIDATED`.

Title соответствует принятому позиционированию и marketplace scope, но пока нельзя объявить его оптимальным SEO-target: основная поисковая категория ещё не подтверждена Wordstat/SERP.

### Meta description

Текущее содержание сообщает:

- Octoport связывает выбранный ИИ с Ozon/Wildberries;
- работа идёт через браузерное расширение;
- бесплатная закрытая бета готовится.

Оценка: `PRODUCT_SAFE`. Финальная поисковая формулировка будет проверяться после semantic routing.

### Canonical

`PASS SOURCE`:

`https://octoport.ru/`

Canonical совпадает с текущей domain authority.

### H1

Текущий H1:

`Ваш ИИ получает руки для работы с маркетплейсами.`

Оценка: `BRAND/CONVERSION COPY; SEO ROLE PENDING`.

Смысл понятен в контексте страницы, но H1 не содержит явного названия продукта, Ozon/Wildberries или установленной поисковой категории. До Wordstat/SERP это не объявляется ошибкой и не переписывается вслепую. После определения primary cluster необходимо решить, должен ли H1 быть более search-explicit, а брендовая метафора остаться supporting line.

### Visible brand spelling

В source публичное имя преимущественно записано латиницей `Octoport` / `octoport`. Владелец закрепил продуктовое название **«Октопорт»**.

`SEO_REVIEW_REQUIRED`: после brand/search pass определить место для естественного видимого кириллического `Октопорт`, чтобы поисковая система и пользователь однозначно связывали русское имя с `Octoport`/`octoport.ru`. Нельзя делать механический keyword stuffing или создавать отдельную дубль-страницу ради написания.

### Main content

`PASS PRODUCT CLARITY`:

Текущая страница явно содержит:

- Ozon + Wildberries;
- ИИ;
- браузерное расширение;
- явный запуск пользователем;
- read-only scope;
- получение результата в диалоге;
- локальные ключи/ограниченный server contour;
- закрытую бесплатную бету без ложного утверждения об открытой регистрации.

Контент соответствует текущей product truth и пригоден как S0 marketing foundation.

## Crawl/index controls

### robots.txt

Текущее состояние:

```text
User-agent: *
Allow: /

Sitemap: https://octoport.ru/sitemap.xml
```

`PASS SOURCE`: target origin не заблокирован.

### sitemap.xml

Содержит только:

`https://octoport.ru/`

`PASS FOR CURRENT ONE-PAGE SOURCE`.

Добавлять будущие Ozon/WB/use-case URL в sitemap можно только после физического создания канонических индексируемых страниц. Нельзя наполнять sitemap SEO-гипотезами.

## Social metadata

Есть:

- `og:type`;
- `og:locale=ru_RU`;
- `og:site_name`;
- `og:title`;
- `og:description`;
- `og:url`.

Отсутствие `og:image` не является SEO blocker для индексации, но станет отдельной social/share задачей после утверждения логотипа/маскота и production asset.

## Structured data

JSON-LD/schema markup в текущем `index.html` не обнаружен.

Статус: `NOT REQUIRED YET / REVIEW LATER`.

Не добавлять фиктивные `SoftwareApplication`, рейтинги, цены или availability до появления соответствующего реального публичного состояния. Возможные Organization/WebSite/SoftwareApplication schemas рассматриваются только после стабилизации публичной информации.

## JavaScript / rendering

Основной контент находится в статическом HTML; S0 не зависит от JS для поискового текста.

`PASS`: это хороший baseline для crawlability и не требует вводить framework ради SEO.

## Текущая архитектура URL

Физически существует одна публичная landing page и hash anchors (`#how`, `#privacy`, `#beta`). Hash anchors не являются отдельными поисковыми документами.

Статус: `ONE-PAGE FOUNDATION`.

Нельзя делать вывод «нам нужна одна страница» или «нам обязательно нужны /ozon/ и /wildberries/» только из текущего source. Это решит semantic/SERP pass.

## Риски, которые нужно закрыть до SEO handoff сайта

1. `PRIMARY CATEGORY UNKNOWN` — пока неизвестно, какой поисковый словарь должен определять Home Title/H1.
2. `CYRILLIC BRAND MISSING/WEAK` — русское имя «Октопорт» не представлено явно в текущем visible copy.
3. `NO PAGE ROLE MAP` — дополнительных target pages пока нет и не должно быть до clustering.
4. `NO PRODUCTION CRAWL EVIDENCE` — source audit не доказывает HTTP status, redirects, final headers, live robots/canonical или индексирование.
5. `NO POST-LAUNCH SEARCH DATA` — нет оснований оптимизировать по CTR/queries до deployment/indexing.

## Что НЕ менять сейчас

До результатов Batch 01 и первого clustering pass не давать site executor бессистемную задачу:

- переписать Title/H1 «под SEO»;
- добавить десятки ключей в homepage;
- создать `/ozon/`, `/wildberries/`, `/chatgpt/` только по интуиции;
- добавить fake FAQ/schema;
- создать блог ради количества URL.

Текущий source остаётся пригодной product-safe foundation. SEO сначала определяет поисковые роли, затем передаёт bounded patch.
