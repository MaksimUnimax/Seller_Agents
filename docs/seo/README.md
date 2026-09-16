# SEO и семантика Октопорта

Статус: **MASTER ROADMAP ACTIVE / EVIDENCE COLLECTION IN PROGRESS**.
Дата начала: 2026-09-16.
Текущая рабочая ветка: `seo/wordstat-batch-01-2026-09-16`.

Этот каталог — постоянная authority для органического поиска, семантики, поисковой архитектуры, Алисы AI и технического SEO публичного продукта **Октопорт / Octoport**.

## Текущие обязательные authority

### Roadmap

- [SEO_MASTER_ROADMAP_2026-09-16](SEO_MASTER_ROADMAP_2026-09-16.md) — текущий исполняемый путь до готового production SEO-продукта.

### Execution/process rules

- [EXECUTION_RULES](EXECUTION_RULES.md) — обязательные правила сбора, evidence, provider lifecycle, QA, ambiguity, anti-regression и stage closure;
- [WORK_HANDOFF_RULE](WORK_HANDOFF_RULE.md) — обязательный large-data contract: когда и как полный массив отдаётся ChatGPT Work;
- [STAGE_GATES_M0_M7](STAGE_GATES_M0_M7.md) — перенесённые и адаптированные KW-002 Step00–06 gates для текущей стадии сбора.

### Method/product authorities

- [PRODUCT_TRUTH](PRODUCT_TRUTH.md) — что продукт реально представляет собой и что допустимо обещать;
- [METHODOLOGY](METHODOLOGY.md) — базовый evidence-first SEO/semantic pipeline;
- [EXTERNAL_METHOD_RESEARCH_2026-09-16](EXTERNAL_METHOD_RESEARCH_2026-09-16.md) — свежая внешняя методическая база Yandex/Google + industry corroboration;
- [KW002_METHOD_AUDIT_2026-09-16](KW002_METHOD_AUDIT_2026-09-16.md) — что именно перенесено из живого KW-002 и что сознательно не копируется.

Старый `SEO_ROADMAP.md` сохранён как исторический coarse roadmap и не является текущей execution authority.

## Operating model

Прямое решение владельца:

```text
ЭТОТ ДИАЛОГ
= собирает evidence
= управляет bridge/provider действиями
= сохраняет/проверяет результаты
= формирует точный Work prompt
= принимает/отклоняет Work return

CHATGPT WORK
= анализирует, систематизирует и преобразует большие данные
= работает с полным разрешённым массивом
= создаёт большие таблицы/артефакты
```

Если полный анализ большого массива небезопасен в обычном чате, **sampling запрещён**. Срабатывает `WORK_HANDOFF_RULE.md`.

## Цель

Построить не «SEO-тексты» и не просто список ключей, а доказуемый поисковый продукт:

`product truth → demand evidence → Yandex SERP → search competitors → Alice AI evidence → M7 Collection Freeze → Work semantic master → SERP/task clustering → page ownership → page specs → technical SEO → implementation → live/indexing → Yandex/Google/Alice measurement`.

Финальная структура сайта заблокирована до `M7 Collection Freeze`.

## Evidence classes

- `PRODUCT_TRUTH`;
- `SEARCH_HYPOTHESIS`;
- `WORDSTAT_OBSERVED`;
- `SERP_OBSERVED`;
- `COMPETITOR_OBSERVED`;
- `ALICE_OBSERVED`;
- `SEO_DECISION`;
- `IMPLEMENTED`;
- `MEASURED`;
- `UNKNOWN/HOLD`.

Эти классы не подменяют друг друга.

## Неподвижный provider/evidence порядок

```text
FULL RESPONSE / EXPORT
-> DURABLE PERSIST
-> REMOTE READBACK / VERIFY
-> ANALYSIS / PROGRESS
-> NEXT PROVIDER ACTION
```

Дополнительно:

- no blind retry;
- pending/waiting/unknown не превращаются в отрицательное search evidence;
- operation/job identity сохраняется;
- chat не является единственным raw-хранилищем;
- large evidence не урезается из-за контекста;
- Work output не является truth до Main Chat return QA.

## Текущий cursor

### M0

`PASS` — product truth/governance frozen.

### M1

`OPEN / SOURCE BASELINE PARTIAL PASS` — source audit есть, live/indexing/measurement surface ещё должен быть закрыт.

### M2

`B01+B02 EXECUTED / RETROSPECTIVE KW002 GATE AUDIT OPEN`.

Фактический Wordstat сбор завершён, но после переноса более строгих KW-002 rules обязателен ретро-аудит:

- seed/probe quality;
- depth/coverage;
- B01 raw persistence;
- B02 exact-envelope verification;
- evidence limitation register.

Исторические запросы не переигрываются автоматически только ради оформления.

### M3

`IN PROGRESS`.

S01 `ии агенты для маркетплейсов` закрыт: 20 нормализованных результатов, source export hash-pinned, normalized authority сохранена. S02 `ии агент для озон` подготовлен к bounded execution после завершения текущих durability/rule migration checks.

Основные M3 authority:

- `serp/M3_QUERY_MATRIX_2026-09-16.md`;
- `serp/M3_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-16.md`;
- `serp/SERP_PROGRESS.md`.

### M4

`OPEN` — search-competitor/landing corpus будет строиться из recurring live SERP evidence.

### M5

`OPEN / NOT STARTED` — Alice AI collection.

### M6–M7

Blocked until M3–M5 evidence and retro gates are sufficient.

### M8+

Blocked until Collection Freeze; затем full cross-source semantic pass идёт через Work W1 при large-data trigger.

## Каталоги

- `wordstat/` — Wordstat raw/analysis/progress/synthesis;
- `serp/raw/` — Search lifecycle evidence;
- `serp/exports/` — normalized Search exports + exact archive/provenance where available;
- `serp/analysis/` — query/lifecycle/intent notes;
- `serp/competitors/` — recurring competitor registry/page corpus;
- `alice/` — Alice/AI-search evidence;
- `semantic/` — post-freeze semantic master;
- `clusters/` — post-freeze SERP/task clusters;
- `pages/` — final page specs;
- `technical/` — technical SEO baseline/spec/QA;
- `evidence/` — acceptance/closure/QA artifacts;
- `WORKLOG.md` — append-only execution log.

## Полнота

Готовность к финальной семантике определяется не числом фраз, а закрытием нужных решений:

- Wordstat baseline + retro gates;
- representative ordinary Yandex SERP matrix;
- stable-enough recurring search competitor set;
- relevant competitor page corpus;
- representative Alice cases;
- zero unresolved high-value acquisition gaps;
- no unknown provider outcomes;
- durable/read-back evidence required for downstream work.

Только затем M7 закрывается и разрешается Work/full semantic analysis.

## Isolation

До отдельного implementation handoff этот поток изменяет только `docs/seo/**`.

Не трогать отсюда:

- server/runtime contracts;
- extension implementation;
- site implementation;
- moving `main`.
