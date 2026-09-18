# SEO и семантика Октопорта

Статус: **MASTER ROADMAP ACTIVE / EVIDENCE COLLECTION IN PROGRESS**.
Дата начала: 2026-09-16.
Текущая рабочая ветка: `seo/wordstat-batch-01-2026-09-16`.

Этот каталог — постоянная authority для органического поиска, семантики, поисковой архитектуры, Алисы AI и технического SEO публичного продукта **Октопорт / Octoport**.

## Обязательные authority

- [SEO_MASTER_ROADMAP_2026-09-16](SEO_MASTER_ROADMAP_2026-09-16.md) — путь до готового production SEO-продукта;
- [EXECUTION_RULES](EXECUTION_RULES.md) — сбор/evidence/provider/QA/anti-regression rules;
- [WORK_HANDOFF_RULE](WORK_HANDOFF_RULE.md) — обязательный large-data contract с ChatGPT Work;
- [STAGE_GATES_M0_M7](STAGE_GATES_M0_M7.md) — адаптированные KW-002 Step00–06 gates до Collection Freeze;
- [PRODUCT_TRUTH](PRODUCT_TRUTH.md) — реальные продуктовые границы;
- [METHODOLOGY](METHODOLOGY.md) — базовый evidence-first pipeline;
- [EXTERNAL_METHOD_RESEARCH_2026-09-16](EXTERNAL_METHOD_RESEARCH_2026-09-16.md) — внешняя методическая база;
- [KW002_METHOD_AUDIT_2026-09-16](KW002_METHOD_AUDIT_2026-09-16.md) — перенос методики живого KW-002.

Старый `SEO_ROADMAP.md` — исторический coarse roadmap, не execution authority.

## Operating model

```text
ЭТОТ ДИАЛОГ
= архитектор/контролёр
= собирает evidence
= управляет bridge/provider
= сохраняет + readback-проверяет результаты
= пишет точный Work prompt
= принимает/отклоняет Work return

CHATGPT WORK
= работает с полным большим массивом
= анализирует
= систематизирует
= делает join/dedup/reconciliation/clustering и большие артефакты
= не меняет методику самовольно
```

Если полный анализ большого массива небезопасен в обычном чате, sampling/first-N/truncation запрещены: срабатывает `WORK_HANDOFF_RULE.md`.

## Цель

`product truth → Wordstat → Yandex Search → search competitors → M5 AI hypotheses only → M6 gap closure → M7 Search freeze → M8 Search-only semantic master → M9 Search clustering → M10A Search-only page/IA baseline → M10B/C/D Alice diagnostics + reconciliation → M11 final IA → M12 page specs → technical SEO → implementation → live/indexing → measurement`.

Финальная структура сайта заблокирована до M7.

## Evidence classes

`PRODUCT_TRUTH`, `SEARCH_HYPOTHESIS`, `WORDSTAT_OBSERVED`, `SERP_OBSERVED`, `COMPETITOR_OBSERVED`, `ALICE_OBSERVED`, `SEO_DECISION`, `IMPLEMENTED`, `MEASURED`, `UNKNOWN/HOLD`.

Классы не подменяют друг друга.

## Provider/evidence hard order

```text
FULL RESPONSE / EXPORT
-> DURABLE PERSIST
-> REMOTE READBACK / VERIFY
-> ANALYSIS / PROGRESS
-> NEXT PROVIDER ACTION
```

No blind retry. Pending/waiting/unknown не являются отрицательным evidence. **Chat вообще не является принятым project storage: любые изменения roadmap/rules/evidence/analysis/progress должны быть записаны в GitHub и remote-readback до статуса accepted.** Большие данные не урезаются ради контекста. Work output не является текущей truth до return QA.

## Текущий cursor

### M0 — Product truth/governance

`PASS`.

### M1 — Current-site + measurement baseline

`OPEN / SOURCE BASELINE PARTIAL PASS`.

### M2 — Wordstat demand acquisition

`PASS WITH EXPLICIT HISTORICAL PERSISTENCE LIMITATION`.

- B01 + B02 provider acquisition выполнены;
- строгий ретро-аудит по перенесённым KW-002 gates завершён: `wordstat/M2_WORDSTAT_RETRO_GATE_AUDIT_2026-09-16.md`;
- B01-01..14 содержат durable factual result body + provenance, но не должны называться exact full top-level envelopes;
- B01-15 — exact full envelope;
- B02-01..15 — strict full-envelope process;
- provider replay ради wrapper-формата не нужен;
- новые Wordstat calls только по конкретному information gap с новым depth/persistence gate.

### M3 — Ordinary Yandex SERP collection

`CLOSED FOR PRIMARY ORGANIC ACQUISITION / CONTROL DEBT OPEN UNTIL M6`.

S01–S03 and R01–R12 are accepted; R04R1 is authority instead of the unreliable original R04 transport run.

Post-close method audit found that the old M3 DoD proved the organic top-20 intent layer and durable lifecycle, but did not require full HTML/SERP-feature, device, regional, temporal-stability and complete cross-query overlap controls. Valid organic evidence is preserved. The missing controls are mandatory in M6 and block M7.

Authority: `serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md`.

### M4 — Search competitor + landing corpus

`CURRENT / M4A PREPARATION REOPENED / PRIOR PROMPT NOT EXECUTABLE`.

M4A first derives the recurring competitor/page registry from the **complete accepted M3 corpus** (15 authority queries × 20 rows = 300 occurrences). A remembered/preselected brand list is not authority. M4B current landing-page collection is blocked until the M4A Work return is uploaded, remote-read back and accepted by Main Chat.

Mandatory authority order: LEVEL1/README.md -> LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md -> current M4A preparation -> execution evidence. The earlier M4A prompt is superseded/non-executable and must be rebuilt from live HEAD.

### M5 — AI diagnostic hypothesis preparation

`OPEN / NOT STARTED / NO ALICE PROVIDER ACQUISITION`.

M5 records candidate future Alice questions only. Actual Alice evidence is deferred until a frozen Search-only page/IA baseline exists in M10A.

### M6–M7

M6 is blocked until M4 is accepted and M5 hypothesis preparation is sufficient. M6 then closes named Search-side gaps and executes the mandatory M3 control patch. M7 is blocked until `M3_CONTROL_DEBT = CLOSED` plus all other collection-freeze gates.

### M8+

Blocked until Collection Freeze. Полный cross-source semantic pass после M7 идёт через Work W1 при large-data trigger.

## Evidence/artifact directories

- `wordstat/` — Wordstat raw/analysis/progress/synthesis/retro QA;
- `serp/raw/` — Search lifecycle evidence;
- `serp/exports/` — normalized Search exports + source hashes/provenance;
- `serp/analysis/` — query/lifecycle/intent notes;
- `serp/competitors/` — recurring competitors/page corpus;
- `alice/` — Alice/AI-search evidence;
- `semantic/` — post-freeze semantic master;
- `clusters/` — post-freeze SERP/task clusters;
- `pages/` — final page specs;
- `technical/` — technical SEO baseline/spec/QA;
- `evidence/` — acceptance/closure/QA;
- `WORKLOG.md` — append-only execution log.

## Collection completeness gate

Before M7 closes:

- Wordstat baseline and retro gates accepted;
- representative Yandex SERP matrix complete for decisions;
- recurring search competitor set stable enough;
- relevant competitor page corpus collected;
- AI diagnostic hypothesis register prepared, but Alice provider evidence excluded from Search freeze;
- high-value evidence gaps closed/HOLD with reason;
- unknown provider outcomes = 0;
- downstream-required evidence durably read back;
- W1 pre-handoff manifest ready.

Only then final semantic analysis, clusters and landing architecture are released.

## Isolation

До отдельного implementation handoff SEO stream изменяет только `docs/seo/**`. Server/runtime/extension/site implementation и moving `main` не трогаются.
