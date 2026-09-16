SA-HEALTH-B5-TIME-R1-20260916-01 — P8.4/B5, корректное сравнение времени в H3 mapper

Исполни конкретное решение архитектора ниже. Это исправление существующего B5, не начало B6–B8, C2.2-B или нового этапа.

Repository: MaksimUnimax/runtime-fixtures, stable ID1369117174.
Branch: feature/server-health-h3-p8-4.
Start/base: d8f5157696d137750176d1aa44aedf9c2116404e.
Start tree: 6612db9fbc1cd370a2882c7e5add696329413316.
Start parent: 0d42223331ec936a671179fba4f59a0bcbe07214.
Последний проверенный main: bc718cc5c677ad0eb4598e7de3ad766473ff0847.

Fetch canonical remote, сверь actual branch/main. При движении целевой ветки от start верни refs, не reset/force/rebase. Работай в выделенном worktree; сохрани параллельные изменения владельца в docs/ROADMAP.md и docs/development/SERVER_CODEX_HANDOFF.md. Не stash, не включай их в коммит, не изменяй. При уже исполняющейся или завершённой задаче с этим ID второй запуск запрещён.

Доказанная проблема
В apps/health-runner/src/h3-health-persistence.ts схема H3HealthPersistenceContextSchema принимает ISO timestamps с offset:true, но superRefine сравнивает completedAt < startedAt как строки. Это не порядок моментов времени. Независимое выполнение точного callback на start показало:
A: start 2026-09-16T10:00:00+05:00, end 2026-09-16T06:00:00Z — +1 час, ошибочно отвергается.
B: start 2026-09-16T06:00:00Z, end 2026-09-16T10:00:00+05:00 — -1 час, ошибочно проходит callback.
C: start 2026-09-16T06:00:00Z, end 2026-09-16T06:00:00.100Z — +100мс, ошибочно отвергается.
D: start 2026-09-16T06:00:00.100Z, end 2026-09-16T06:00:00Z — -100мс, ошибочно проходит callback.
E: start 2026-09-16T10:00:00+05:00, end 2026-09-16T05:00:00Z — одинаковый момент, ошибочно отвергается.
F: start 2026-09-16T06:00:00.000Z, end 2026-09-16T06:00:01.000Z — существующий корректный UTC-интервал проходит.
Это доказательство точного callback, не полный mapper/DB run. Ты должен добавить RED/GREEN на реальный public mapper.
DB repository уже сравнивает Date и отвергает обратный интервал до transaction; миграция имеет completed_at >= started_at. Повреждение persisted rows не заявлено. Дефект B5 — ложный отказ корректным входам и неверный пропуск на capture boundary.

Принятое решение
Только в H3HealthPersistenceContextSchema.superRefine заменить лексикографический порядок на сравнение Date.parse(value.completedAt) < Date.parse(value.startedAt).
Сохранить IsoTimestampSchema с offset:true, существующие path/code/message ошибки, strict schema, browser metadata checks и преобразование в Date на выходе mapper.
Равные моменты времени разрешены, независимо от записи offset или дробной части.
Не ограничивать вход только Z, не округлять/обрезать строки, не нормализовать их лексикографически, не менять DB/parser/миграции.

Allowlist
1. apps/health-runner/src/h3-health-persistence.ts — только указанная проверка.
2. apps/health-runner/src/h3-health-persistence.test.ts — регрессии хронологии.
3. tests/integration/server/h3-health-persistence.integration.test.ts — PostgreSQL roundtrip регрессии времени; сохранить принятую подготовку схемы.
4. docs/server/B5_SANITIZED_H3_EVIDENCE_INTEGRATION_2026-09-15.md — добавить фактическое исправление и уточнить существующую фразу Boundary «This document closes B5 only»: реализация кандидата не является архитектурной приёмкой, B5 остаётся NOT ACCEPTED до решения архитектора. Исторические FAIL/RED сохранить.
5. docs/server/evidence/health-b5-time-r1-2026-09-16/README.md
6. docs/server/evidence/health-b5-time-r1-2026-09-16/results.json
7. docs/server/evidence/health-b5-time-r1-2026-09-16/logs/ — обезличенные назначенные логи.
Другие пути не менять.

Unit RED/GREEN
В существующем h3-health-persistence.test.ts используй реальные execution/context helpers и createH3HealthPersistenceCommand, а не копию callback.
Добавь именованные A–F для обеих поверхностей Standard/revision2 и Work/revision1.
A,C,E,F: mapper возвращает команду; startedAt/completedAt являются Date и равны Date.parse исходных строк; ожидаемые deltaMs: 3600000,100,0,1000.
B,D: mapper бросает Zod validation error с issue path completedAt и прежним сообщением completedAt must not precede startedAt.
Отдельно проверь сохранение отказа неверному ISO и строке без timezone, равенство одинаковых UTC timestamps и отказ обычному обратному UTC-интервалу.
Не выноси/переписывай имеющиеся helpers и не ослабляй прежние assertions.
На точном start выполни новые A–F против неизменённого production mapper: A–E должны давать ожидаемый RED, F остаётся GREEN. Затем внеси одну production-правку и выполни те же tests GREEN. Сохрани SHA, команды, exit codes и named cases. Не называй независимый callback probe полным unit RED.

PostgreSQL acceptance
Используй новую task-owned disposable PostgreSQL18 на loopback, свободном порту, с test в имени. DATABASE_URL назначать только ей; PRODUCT_CONTROL_PLANE_E2E=1 при E2E. Не трогать общую/боевую БД. Секреты не печатать.
В существующем H3 integration-файле добавь по обеим поверхностям A,C,E:
— построить command из PASS execution и context с указанными timestamps;
— persistCompletedHealthRun(command);
— listRuns для точного scope либо точный SQL readback по возвращённому run.id;
— проверить фактические сохранённые started_at/completed_at на ожидаемые UTC moments, deltaMs, H3/HEALTHY, scope/profile принадлежность,13 contours/11 evidence.
Для B,D по обеим поверхностям:
— проверить отказ реального mapper до вызова repository;
— сравнить до/после counts health_suite_revisions, health_runs, health_contour_results, health_evidence_references: изменений нет.
Не подставляй в repository вручную исправленные даты для обхода mapper. Не меняй DB constraints.
Сохрани исходные6 H3 и21 DB-health cases; новые timestamp cases добавляются к ним.

Проверки
Node24/pnpm10.34.5; frozen install без обновления зависимостей.
Focused mapper unit RED→GREEN: pnpm --filter @product/health-runner exec vitest run src/h3-health-persistence.test.ts.
Затем pnpm --filter @product/health-runner test.
Focused H3 PostgreSQL suite на чистой БД: pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts.
На candidate один полный обязательный Server CI cycle:
pnpm lint;
pnpm format:check;
pnpm typecheck;
pnpm exec vitest run tests/e2e/server/playwright-config-regression.test.ts;
pnpm test;
pnpm test:integration;
pnpm db:migrate;
pnpm openapi:check;
pnpm bridge:guard;
pnpm build;
pnpm exec playwright install --with-deps chromium;
pnpm test:e2e.
После evidence: pnpm docs:check.
Все gate exit0, все существующие и новые случаи выполнены, неожиданных skips нет. Integration baseline1514 плюс добавленные cases; E2E baseline162. Укажи фактические counts, а не подгоняй их.
Существующий admin-billing passWithNoTests отдельно указать; не выдавать за выполненные тесты.
При FAIL вне назначенного исправления верни точный лог; не исследуй новое направление и не расширяй allowlist.
Не повторяй зелёные проверки без изменения кода/обязательного gate.

Неизменяемые условия
Не менять fixture isolation из принятого gate repair, DB migrations/repository/constraints, Health classifier/contour rules/evidence/privacy, auth/contracts, server/extension runtime вне одной проверки, scheduler/P8.5, CI/workflows/dependencies.
Не менять README.md, AGENTS.md, docs/README.md, CHANGELOG.md, сайт/SEO/domain/public presentation, workspace-control, PR9 или owner dirty files.
Не merge main/I1, не создавать replacement branches/PRs. Никаких live-provider calls/deploy/release.
C2.2-A остаётся открытым на своём критерии. B5 не объявлять ACCEPTED; B6–B8 не начинать.

Публикация
Сначала code/tests commit, затем подготовленный evidence commit. Выполни один normal fast-forward push собранного candidate в существующую ветку; без force/history rewrite.
Final self-SHA/tree/parent сообщи в terminal, не создавай бесконечные receipt commits ради самоссылки. Remote CI факты после push сообщи в terminal.
Проверь remote head; укажи фактические Server CI run/job URLs и checkout SHA. Если выполняется — IN_PROGRESS, если нет доступа — UNKNOWN с причиной. Не перезапускай CI для ожидания. Documentation workflow не запускается feature push: local docs:check отдельно, main CI не является candidate PASS.
Сохрани предыдущую историю gate fixture repair и его отдельный CI35085259171; не переноси результат старого head на новый.

Terminal report
Task/branch/start/code/final SHA/tree/parent; allowlist diff; реальные public mapper RED/GREEN A–F обеих поверхностей; PostgreSQL roundtrip и no-write negatives; полный cycle; remote head/CI; сохранённые owner changes; удаление только собственной disposable DB;0 live calls; blockers.
После terminal report остановись для независимого ревью архитектора.