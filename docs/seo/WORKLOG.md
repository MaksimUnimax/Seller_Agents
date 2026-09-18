# SEO worklog — Октопорт

Этот журнал append-only: новые проходы добавляются ниже. Ошибки/отклонённые гипотезы не стираются; меняется их статус и фиксируется причина.

## 2026-09-16 — SEO-S0 / старт

### Поручение владельца

Запущена отдельная SEO-линия продукта Октопорт параллельно разработке сайта и сервера.

Зафиксировано владельцем:

- продуктовое название: **Октопорт**;
- маскот: осьминог, соединяющий маркетплейсы с LLM;
- логотип планируется как минималистичный осьминог;
- семантическое ядро и SEO необходимо строить с использованием существующего Yandex bridge из репозитория `blood_sand`;
- весь ход SEO-работы должен постоянно и полно фиксироваться в документации Seller_Agents.

### Проверка актуального Seller_Agents

Перед правками прочитаны обязательные точки входа:

- `AGENTS.md`;
- `README.md`;
- `docs/STATUS.md`;
- `docs/ROADMAP.md`;
- `docs/decisions/DECISIONS.md`;
- `docs/README.md`;
- `docs/development/WORKFLOW.md`;
- ранее проверены `docs/product/SPEC.md`, `docs/product/UX.md`, `docs/architecture/OVERVIEW.md`, `apps/site/README.md`.

Актуальный `main` непосредственно перед взятием задачи:

`16c0ac9b6aa9a72aa3100eb04f14bd74e4d6593a`

Commit message: `Merge Octoport SITE-S1 deployment preparation`.

Это важно: SEO-ветка взята уже после SITE-S1 preparation, поэтому не должна перетирать параллельные site changes.

Создана короткая отдельная ветка:

`docs/seo-semantic-foundation-2026-09-16`

### Проверка Yandex Wordstat bridge

Найден канонический путь:

`MaksimUnimax/blood_sand/tooling/llm-api-bridges/yandex-wordstat/`

Зафиксированный reference:

- version `1.1.5`;
- full Node suite `283/283 PASS`;
- fresh unpacked Chromium E2E `21/21 PASS`;
- credentials local-only;
- exactly-once lifecycle/recovery доказан в reference.

Исполняемый protocol подтверждает методы:

- `getTop`;
- `getDynamics`;
- `getRegionsDistribution`;
- `getRegionsTree`.

Endpoint authority находится в `reference-1.1.5/shared/wordstat_protocol.js`. Для broad semantic discovery принят `getTop` как основной метод; остальные методы используются только по аналитической необходимости.

### Созданная SEO authority

Созданы:

- `docs/seo/README.md`;
- `docs/seo/PRODUCT_TRUTH.md`;
- `docs/seo/METHODOLOGY.md`;
- `docs/seo/SEO_ROADMAP.md`;
- `docs/seo/SEED_UNIVERSE.md`;
- этот `WORKLOG.md`.

### Первое аналитическое решение

`SEO_DECISION`: не проектировать окончательное дерево посадочных страниц по интуиции до Wordstat discovery.

Причина: продукт может быть найден рынком через несколько разных словарей — «ИИ для маркетплейсов», «нейросеть», «ChatGPT для Ozon/Wildberries», «аналитика маркетплейсов», «ИИ-помощник селлера» и task-specific запросы. До evidence неизвестно, какой словарь должен определять главную category page, какие темы достойны отдельных marketplace/use-case pages и где будет каннибализация.

### Product-safe boundary

`PRODUCT_TRUTH`: SEO может строиться вокруг read-only работы с данными Ozon/Wildberries через выбранный пользователем LLM.

Не допускается до появления новых доказанных фактов:

- обещать редактирование business state;
- выдавать Октопорт за собственную LLM;
- обещать server archive отчётов;
- публиковать исторические `199/299 ₽` как текущие цены;
- писать, что public registration уже открыта;
- объявлять все browser/LLM combinations production-accepted.

### Initial seed universe

Сформирован широкий набор seed families:

- AI × marketplaces;
- Ozon;
- Wildberries;
- ChatGPT pairings;
- другие LLM discovery;
- analytics/sales/reports;
- advertising/stock/product read-jobs;
- integration/API/extension language;
- informational problem language;
- adjacent analytics-service category;
- brand defense.

Все seeds пока имеют статус `SEARCH_HYPOTHESIS`. Частотности не записывались и не оценивались моделью.

### Текущий blocker / внешний вход

Для перевода seeds в `WORDSTAT_OBSERVED` нужен реальный provider execution через установленный Wordstat Bridge с локальным Yandex credential. GitHub reference подтверждает протокол, но не содержит secrets, и secrets не должны переноситься в репозиторий.

До provider result работа может безопасно продолжаться только в части подготовки batches, схемы хранения и product-safe taxonomy. Нельзя подменять Wordstat веб-поиском или модельной оценкой частотности.

### Следующий cursor

1. Подготовить первый bounded batch `getTop` по 15 broad seeds из `SEED_UNIVERSE.md`.
2. Выполнить provider calls через Wordstat Bridge.
3. Сохранить raw provenance без редактирования.
4. Построить первую normalized table и определить новые vocabulary families.
5. Только после этого расширять второй batch.

## 2026-09-16 — SEO-S0 / Batch 01 preparation и current-site source audit

### Batch 01

Подготовлен `docs/seo/wordstat/BATCH_01_BROAD_DISCOVERY.md`.

Состав: 15 broad `getTop` calls, РФ `225`, `DEVICE_ALL`, `numPhrases=2000`.

Выбраны не подряд первые seeds, а независимые словари: общая AI category, нейросеть, seller-assistant language, analytics, Ozon/Озон, Wildberries/Вайлдберриз, ChatGPT pairings, sales analysis, integration language, adjacent analytics SaaS и informational how-to.

Статус подготовки: `PREPARED`.

### Current public-site source audit

Проверены на актуальном `main`:

- `apps/site/public/index.html`;
- `apps/site/public/robots.txt`;
- `apps/site/public/sitemap.xml`.

Создан `docs/seo/technical/CURRENT_SITE_BASELINE_2026-09-16.md`.

Факты source:

- `lang=ru`;
- canonical = `https://octoport.ru/`;
- robots разрешает crawl и указывает canonical sitemap;
- sitemap содержит только главную, что соответствует текущему one-page source;
- основной контент статический и не зависит от JS;
- текущий Title: `Octoport — ИИ-сотрудник для Ozon и Wildberries`;
- текущий H1: `Ваш ИИ получает руки для работы с маркетплейсами.`;
- public copy аккуратно говорит о готовящейся закрытой бесплатной бете и read-only scope.

### SEO findings по source

`SEO_DECISION`: текущий site source не переписывать до первых Wordstat/SERP фактов.

Причина: Title соответствует product truth, но ещё не доказано, что «ИИ-сотрудник» — основной поисковый язык. H1 хорошо работает как брендовая метафора, но не доказано, что он оптимален как primary search heading.

Отдельный `SEO_REVIEW_REQUIRED`: в visible copy используется латинский `Octoport`, тогда как владелец зафиксировал русское продуктовое имя «Октопорт». После brand/search pass нужно естественно связать оба написания на странице, не создавая keyword stuffing или дубль URL.

### Git/PR state

Foundation PR `#15` прошёл Documentation CI и влит в `main` merge-коммитом `cfd63e5c2227a52ccff6cbb5bb2da4580ec3bb3a`.

Для provider evidence создана отдельная ветка:

`seo/wordstat-batch-01-2026-09-16`

## 2026-09-16 — SEO-S1 / Wordstat Batch 01 execution started

### B01-01 — `ии для маркетплейсов`

Provider result:

- bridge `yandex-marketing-bridge` `0.1.8`;
- request_id `wordstat-ee0583c8-f745-4c22-9212-cee56c5c444d`;
- HTTP `200`;
- elapsed `1312 ms`;
- estimated cost `0.02 ₽`;
- totalCount `3381`;
- automatic_retry `false`.

Raw evidence: `docs/seo/wordstat/raw/B01_01_2026-09-16.md`.

`SEO_FINDING`: broad phrase имеет заметный объём, но выдача сильно доминируется генерацией карточек, фото, инфографики и изображений. Поэтому `3381` нельзя интерпретировать как чистый спрос на продукт класса Октопорта.

Product-adjacent наблюдаемые фразы внутри выдачи:

- `ии агенты для маркетплейсов` — `134`;
- `какой ии для маркетплейсов` — `128`;
- `ии для работы с маркетплейсами` — `39`;
- `ии для продаж на маркетплейсах` — `23`;
- `ии для аналитики маркетплейсов` — `15`;
- `ии ассистент для маркетплейсов` — `13`.

Вывод пока не маршрутизирует страницу: нужен отдельный seller-assistant/analytics/marketplace evidence.

### B01-02 — `нейросеть для маркетплейсов`

Provider result:

- bridge `yandex-marketing-bridge` `0.1.8`;
- request_id `wordstat-a162cb60-3be5-4014-a203-de28cb0983da`;
- HTTP `200`;
- elapsed `1437 ms`;
- estimated cost `0.02 ₽`;
- totalCount `3451`;
- automatic_retry `false`.

Raw evidence: `docs/seo/wordstat/raw/B01_02_2026-09-16.md`.

`SEO_FINDING`: словарь «нейросеть для маркетплейсов» загрязнён карточками/изображениями/инфографикой ещё сильнее. Сам объём `3451` также нельзя назначать Октопорту как category demand.

Product-adjacent наблюдаемые фразы:

- `нейросеть помощь для маркетплейсов` — `517` — требует отдельной проверки интента, формулировка широкая;
- `лучшие нейросети для маркетплейсов` — `103` — comparison/informational, не обязательно product landing;
- `нейросеть для работы с маркетплейсами` — `29`;
- `нейросети для менеджеров маркетплейсов` — `19`;
- `топ нейросетей для маркетплейсов` — `15`;
- `нейросети для торговли на маркетплейсах` — `11`.

### Промежуточный вывод после 2/15 calls

Два самых очевидных broad-category seeds показали одно и то же: рынок использует `ИИ/нейросеть + маркетплейсы` прежде всего для content-creation tasks. Это делает преждевременным продвижение главной только под широкую фразу «ИИ для маркетплейсов» без уточняющего seller-work/analytics context.

Следующий seed намеренно меняет ось с generic AI на user-role/assistant language: `ии помощник селлера`.

### Batch progress

- successful calls: `2/15`;
- provider failures: `0`;
- accumulated estimated cost: `0.04 ₽`;
- current cursor: `B01-03`.


## 2026-09-18 — M3 retrospective / repository-persistence rule reinforced

Owner instruction re-locked: chat is not project storage. Any roadmap/rule/evidence/analysis/progress change must be written to the active GitHub branch and remote-readback before it is reported as accepted.

A method audit of completed M3 found valid organic top-20 evidence but an incomplete historical Definition of Done. Missing hard controls: full HTML/SERP-feature representation, device/browser sensitivity, bounded regional sensitivity, temporal repeat for ambiguous/high-value queries, and complete cross-query URL/domain overlap QA.

Decision:

- do not invalidate or blindly replay the accepted M3 organic corpus;
- keep M4 as current stage;
- record explicit M3 control debt;
- require a bounded M3 control patch in M6;
- block M7 Collection Freeze until `M3_CONTROL_DEBT = CLOSED`.

Updated authorities:

- `SEO_MASTER_ROADMAP_2026-09-16.md`;
- `EXECUTION_RULES.md`;
- `METHODOLOGY.md`;
- `STAGE_GATES_M0_M7.md`;
- `README.md`;
- `serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md`.


## 2026-09-18 — M4A preparation / competitor registry before landing crawl

Next roadmap step was prepared under the current execution rules.

Before preparation Main Chat re-read the current repository authorities, checked fresh external M4 method guidance, evaluated the Work trigger and verified the remote branch base.

Key correction to the earlier conversational plan:

- M4 does **not** start from a hand-picked list such as Selsup/MPSTATS/etc.;
- search competitors must first be derived from the complete accepted M3 corpus;
- accepted M3 authority = 15 queries × 20 rows = 300 organic occurrences, with R04R1 replacing unreliable original R04;
- full-volume cross-file recurrence/URL/domain lineage is assigned to ChatGPT Work;
- no sampling, first-N or remembered-brand filtering;
- M4A performs no vendor browsing and no new Search/Wordstat/Alice/provider acquisition;
- M4B landing-page collection remains blocked until Main Chat accepts the M4A return.

Prepared and published:

- `serp/competitors/M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18.md`;
- `serp/competitors/M4A_WORK_PROMPT_2026-09-18.md`;
- `serp/competitors/M4_PROGRESS.md`;
- `serp/competitors/work_return/M4A_REGISTRY_2026-09-18/README.md`.

The M4A Work return must contain seven final deliverables and reconcile exactly 15 authority queries / 300 accepted occurrence rows or stop with HOLD.

Current cursor:

`M4 CURRENT -> M4A PREPARED -> OWNER RELAYS WORK PROMPT -> WORK FULL-VOLUME RETURN -> OWNER UPLOADS UNPACKED RETURN -> MAIN CHAT REMOTE READBACK + QA -> only then M4B`.


## 2026-09-18 — two-level rule architecture restored; M4A preparation reopened

Owner correction: the transferred KW-002 process is explicitly two-level and should already have existed in Octoport.

Canonical structure:
- LEVEL 1 = universal mandatory project rules;
- LEVEL 2 = methodology/gates/contract for the exact step;
- work/evidence/state/results = factual execution layer, not LEVEL 2.

Root cause:
Octoport imported many universal controls and stage gates, but the explicit LEVEL 1 / LEVEL 2 authority architecture and fail-closed pre-step requirement were flattened. This allowed Main Chat to prepare M4A without proving an explicit read of a dedicated M4 LEVEL 2 authority.

Correction:
- LEVEL1/README.md created;
- LEVEL2/README.md created;
- LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md created;
- EXECUTION_RULES.md now contains the fail-closed two-level gate;
- RULE_READ_LEDGER.md created;
- prior M4A gate/prompt marked SUPERSEDED / NOT EXECUTABLE;
- M4A preparation reopened from live HEAD;
- no Work/Bridge/provider execution had started from the invalid prompt.

Regression rule:
NO EXPLICIT LEVEL2 READ -> PREPARATION INVALID -> PROMPT NOT EXECUTABLE -> REPREPARE.


## 2026-09-18 — full KW-002 Step06-22 transfer audit and Alice sequence correction

Owner required verification that upcoming Octoport stages had actually inherited the rules already learned in KW-002.

Audit found:
- roadmap M4-M18 descriptions existed;
- dedicated Level2 transfer after M4 was incomplete;
- M4 lacked several hardened Step06/Step07 controls;
- M5/M7/M8 sequence allowed Alice evidence before a frozen Search-only semantic/page baseline, unlike KW-002 Step14-17.

Corrections published:
- universal Octoport M0-M18 Level2 step index;
- KW-002->Octoport transfer audit matrix;
- hardened M4 Step06/07 rule;
- M5/M10 Search-only-before-Alice rule;
- M6 gap/provider rule;
- M7/M8 Search freeze + semantic-master rule;
- M9/M11 clustering/IA rule;
- M12 page-spec/content rule;
- M13-M18 technical/implementation/launch/measurement rule.

Roadmap correction:
M5 now prepares AI diagnostic hypotheses only; no Alice provider call.
M7 is Search-side Collection Freeze.
M8/M9 are Search-only.
M10A freezes Search-only page/IA baseline.
M10B/C/D then select AI cases, collect Alice evidence and reconcile.
M11 is final architecture after accepted AI delta.

Root cause:
ROADMAP DESCRIPTION != TRANSFERRED EXECUTABLE LEVEL2 METHOD.

Regression:
NO APPLICABLE STEP INDEX + LEVEL2 READ -> NO PREPARATION / NO EXECUTION.


## 2026-09-18 — completed M0-M3 retrospective against hardened KW-002

Owner required the same KW-002 comparison for already executed stages, not only future roadmap steps.

Main Chat read actual Octoport M0/M1/M2/M2R/M3 artifacts plus KW-002 Step00-Step06, dedicated gates, failure ledgers and hardened Step06 output.

Scores:
- M0 Product Truth: 9.0/10. Product truth remains PASS; one compact Step00/01-style scope/source consolidation is required before M7.
- M1 source/measurement baseline: 7.7/10 readiness only; correctly remains OPEN.
- Historical M2 B01+B02: 8.3/10 historical. Evidence valid, but initial coverage/schema/persistence were weaker than hardened KW-002 and insufficient alone.
- M2R full-volume reconciliation: 9.7/10 after Main Chat corrections. This is the strongest completed evidence stage and remains ACCEPTED.
- M3 primary organic: 8.3/10. Strong acquisition/lifecycle/persistence, but not yet hardened Step06-equivalent.

Important M2R finding:
Main Chat did not trust Work's 98/100 self-score. Return QA corrected three real defects: matrix accounting 12/9/3 -> 15/12/3; R07 relation R10 -> R11; B02 association occurrence/unique counts 245/152 -> 246/153.

Important M3 comparison:
KW-002 hardened Step06 at 9.3/10 included Top3/Top10/11-20 profiles, collision ledger, explicit recurrence granularity, complete pairwise exact-URL/domain Top10 similarity and curated competitor registry. Octoport M3 did not yet contain that complete derivative layer.

Correction:
- no Search replay for this analytical debt;
- M4A derives Step06 hardening from existing 300 accepted M3 rows;
- M6 closes full-SERP/device/region/temporal controls;
- M7 remains blocked until those debts plus M0 scope/source consolidation close.

Authority:
LEVEL2/OCTOPORT_M0_M3_COMPLETED_STAGE_KW002_RETRO_AUDIT_2026-09-18.md.


## 2026-09-18 — retrospective remediation timing made explicit

Owner correctly noted that the previous retrofit audit said WHAT remained weak but scattered WHEN those repairs would be executed.

Roadmap now has one mandatory remediation schedule:

- R0 M0 scope/source consolidation = immediately, before M4A re-preparation;
- R1 M1 live/measurement completion = after M4/M5 and before M6 final closure/M7;
- R2 historical M2 is not rewritten; M2R already is the correction. Pre-M7 only current-authority cleanup/check;
- R3A M3 Step06 analytical hardening = inside M4A now, using existing 300 rows;
- R3B M3 full-SERP/device/region/temporal controls = inside M6 before M7;
- R4 current-authority M0/M1/M2/M3 re-score = immediately before M7; each current stage >=9.0/10 and all hard gates PASS.

M4A re-preparation is now explicitly blocked until R0 passes.
M7 is explicitly blocked while M1 is OPEN or any current M0-M3 authority remains below normal stage threshold/hard gates.


## 2026-09-18 — R0 M0 scope/source consolidation

Executed the first mandatory remediation item before M4A.

Created:
`evidence/M0_SCOPE_SOURCE_RETRO_CONSOLIDATION_2026-09-18.md`.

The file consolidates existing accepted M0 facts into one Step00/01-style authority:
- product definition and launch action boundary;
- Russian-language / Russia search baseline;
- SEO research goal;
- allowed evidence source classes;
- prohibited/non-authoritative inputs;
- current site-state pointer;
- material unknown/HOLD ledger;
- evidence-class boundaries;
- dependency/reopen policy.

No new provider calls and no new market/product facts were invented.

Result:
`M0_SCOPE_SOURCE_RETRO_CONSOLIDATION = PASS`.
Current M0 score: `9.7/10`.
M1 remains OPEN.
After remote readback, M4A re-preparation is released.


## 2026-09-18 — M4A R2 prepared under corrected two-level architecture

After R0 passed, Main Chat re-read live Level1, the full applicable M4 Level2 stack, current M3/M2R evidence and failure history, then repeated fresh external M4 method research.

R2 replaces the earlier invalid M4A prompt.

Key hardened additions:
- 300-row occurrence classification;
- Top3/Top10/11-20 separation;
- query-level Top10 analytical profiles;
- complete 105-pair exact-URL/domain similarity matrix;
- collision/uncertainty ledger;
- recurrence universe with explicit metric granularity;
- curated Search-competitor registry;
- M4B anchor manifest.

Work-role boundary fixed:
Main Chat does governance/research/release once.
Work receives execution-only prompt and narrow drift/input preflight.

No provider calls or external competitor browsing are authorized in M4A.

M4B remains blocked until Main Chat independently accepts the R2 Work return.


## 2026-09-18 — M4A R2 HOLD exposed R06 export transport defect

ChatGPT Work correctly stopped during narrow input-integrity preflight.

R06 historical manifest claimed a 73,361-byte source and gzip SHA a3df7f3b..., but its seven immutable Git chunks reconstruct a different gzip SHA and fail standard CRC validation.

Main Chat independently verified that:
- the terminal provider collect is valid and uses the same R06 operation/revision;
- the seven chunks themselves have the historical Git blob identities;
- the raw DEFLATE payload is intact and yields a valid 73,385-byte JSON;
- recovered JSON has correct R06 job, revision, operation, query, SUCCEEDED state and 20 complete ranks;
- historical exact-byte manifest claim is invalid;
- no separately persisted historical full JSON/gzip exists at the expected paths.

Therefore this is a durable-transport authority defect, not a reason for blind Search replay.

R2 is suspended.
Next action: materialize a new derived recovery transport with correct integrity metadata, independently QA it, then issue a new M4A release revision.


## 2026-09-18 — R06 durable transport recovered without provider replay

The R06 M4A blocker was repaired from immutable Git evidence.

Only the corrupt gzip trailer was replaced. The original compressed DEFLATE body remained unchanged. The new transport validates normally and reconstructs the independently verified 73,385-byte JSON.

Remote recovery chunk readback passed.

The historical R06 exact-byte manifest remains superseded and preserved as incident history.

Current R06 transport authority is the derived recovery manifest + QA under:
`serp/raw/recovery/R06_2026-09-18/`.

No Search provider call was repeated, so the original R06 SERP snapshot remains the observed evidence.

R2 is not resumed. A fresh M4A R3 release is required.


## 2026-09-18 — M4A R3 authorized after R06 recovery

R06 transport integrity incident is closed without a new Search provider call.

R2 remains a correct failed-preflight attempt and is not resumed.

R3 freezes the same M4A analytical method and complete execution unit:
15 queries × 20 rows = 300 occurrences, 105 Top10 query pairs.

The only authority correction is R06:
Work must use the accepted derived recovery transport and verify its exact source/gzip identities before classification.

R3 release/readback passed and Work may start.

M4B remains blocked until R3 Work return receives independent Main Chat QA.
