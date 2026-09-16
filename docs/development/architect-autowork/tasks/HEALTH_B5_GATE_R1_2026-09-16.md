SA-HEALTH-B5-GATE-R1-20260916-01 — P8.4/B5, исправление изоляции PostgreSQL integration fixtures

Роль: реализуй указанное ниже решение архитектора. Это один ограниченный шаг существующей очереди Health, пока приёмка I1 C2.2-A остаётся открытой из-за конфликта PR9 в чужом docs/README.md. Не начинай B6–B8, C2.2-B или новую архитектурную работу.

Репозиторий: MaksimUnimax/runtime-fixtures, stable ID 1369117174.
Ветка: feature/server-health-h3-p8-4.
Точный start/base задачи: a80cd3706a10d25079fedb9553fc7f5b2fc21683.
Start tree: 4569d243b0fedf239efaa36085375911b0507e82.
Start parent: 3138966bb0d1cd66e060b43703169975f48e9265.
Историческая принятая B4-база: 53419eb57cc222254e14b5dc273a37249487331c; не возвращаться на неё.
Последний проверенный main: bc718cc5c677ad0eb4598e7de3ad766473ff0847.

Перед изменениями fetch canonical remote, проверь текущие main и целевую ветку, чистоту выделенного worktree. Если целевая ветка уже ушла с указанного start, не reset/force-push и не повторяй задачу: верни фактические refs для сверки архитектором. Изменение main само по себе не требует его интеграции. Сохрани параллельные изменения владельца; не создавай заменяющую ветку или PR из-за переименования репозитория. Не используй worktree другого активного задания.

Доказанная проблема
Server CI run 34955906130, job 104337782297 завершился FAIL. В beforeAll tests/integration/server/h3-health-persistence.integration.test.ts, INSERT около строки 244: PostgreSQL 23505, ai_adapters_machine_key_unique, machine_key=chatgpt. Шесть H3-тестов не выполнились; итог 1508 passed / 6 skipped.
tests/integration/server/vitest.config.ts уже задаёт fileParallelism=false: наборы последовательно используют одну disposable DB. createDatabaseRuntime().ready() выполняет SELECT 1, не очищает схемы и не применяет миграции. adapter-registry.integration.test.ts оставляет chatgpt. H3 fixture выполняет INSERT без подготовки чистой схемы. packages/server/db/src/health-persistence.integration.test.ts также вставляет фиксированные b500... IDs без reset и не изолирован от повторного запуска. Второй риск установлен чтением исходников; не выдавай его за уже выполненный RED.

Принятое решение
Обе fixture сами подготавливают чистые public и drizzle схемы и применяют существующие миграции перед неизменённым заполнением. Это тот же порядок подготовки, который уже применяется другими последовательными integration fixtures. Runtime, классификация Health и ограничения БД не меняются.

Точный allowlist
1. tests/integration/server/h3-health-persistence.integration.test.ts
2. packages/server/db/src/health-persistence.integration.test.ts
3. docs/server/B5_SANITIZED_H3_EVIDENCE_INTEGRATION_2026-09-15.md — только добавление раздела о текущем исправлении и статусе приёмки, сохранив историю.
4. docs/server/evidence/health-b5-gate-r1-2026-09-16/README.md
5. docs/server/evidence/health-b5-gate-r1-2026-09-16/results.json
6. docs/server/evidence/health-b5-gate-r1-2026-09-16/logs/ — только обезличенные логи назначенных проверок.
Больше никаких изменений.

Конкретные изменения
В H3 test импортируй runMigrations из @product/db/migrations.
В DB health test импортируй runMigrations из ./migrations.js.
В beforeAll обоих файлов непосредственно после await runtime.ready() и до первого fixture INSERT последовательно:
— await runtime.query("DROP SCHEMA IF EXISTS public CASCADE");
— await runtime.query("DROP SCHEMA IF EXISTS drizzle CASCADE");
— await runtime.query("CREATE SCHEMA public");
— await runMigrations({ connectionString: connectionString! });
Сохрани дальнейшее заполнение, IDS, machine_key, все assertions, helpers и afterAll закрытие runtime без изменений. Не выноси общий helper, не меняй Vitest config.

Безопасная среда
Все PostgreSQL проверки — только на новой БД, созданной именно этой задачей. PostgreSQL 18, loopback, отдельный свободный порт, имя health_b5_gate_r1_test; перед каждым циклом проверь назначение DATABASE_URL. PRODUCT_CONTROL_PLANE_E2E=1 для E2E. Не используй ambient/shared/production DB. Сброс схем разрешён только внутри такой disposable task-owned DB. Не печатай секреты. При очистке удали только собственные созданные ресурсы; не чисти чужие контейнеры, volumes, worktrees или Bridge. Не меняй DB interlock: он требует loopback и test/e2e в имени.

Проверка RED
На неизменённом точном start, после установки frozen dependencies, в одной task-owned DB двумя отдельными последовательными процессами:
1. pnpm exec vitest run --config tests/integration/server/vitest.config.ts packages/server/db/src/adapter-registry.integration.test.ts
Ожидание: 7/7 PASS.
2. Без внешней очистки той же DB:
pnpm exec vitest run --config tests/integration/server/vitest.config.ts tests/integration/server/h3-health-persistence.integration.test.ts
Ожидание: nonzero, PostgreSQL 23505 на ai_adapters_machine_key_unique/chatgpt, 6 H3 cases не выполнены.
Сохрани точный SHA, команды, exit codes, constraint и результаты. Если RED отличается, верни точный лог; не придумывай иную причину и не расширяй исправление.

Проверка GREEN
После двух назначенных изменений:
1. На новой пустой task-owned DB запусти только H3-файл: 6/6 PASS, демонстрируя, что fixture сама применяет миграции.
2. На одной другой свежей task-owned DB отдельными последовательными процессами, без внешнего reset между ними:
adapter-registry.integration.test.ts → H3-файл → health-persistence.integration.test.ts → H3-файл → health-persistence.integration.test.ts.
Все команды используют pnpm exec vitest run --config tests/integration/server/vitest.config.ts и точный путь файла.
Ожидание: 7/7 → 6/6 → 21/21 → 6/6 → 21/21, каждый exit 0, без skips. Не полагайся на порядок файлов в одном вызове Vitest.
Это проверяет предшествующие данные, повторный запуск и обе стороны изоляции. Не добавляй тест, который лишь проверяет текст SQL.

Полный обязательный цикл на candidate
Node 24 и pnpm 10.34.5 по package.json; pnpm install --frozen-lockfile, без обновлений зависимостей.
На свежей собственной DB выполни порядок существующего Server CI:
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
установка Chromium штатной командой из .github/workflows/server-ci.yml, затем pnpm test:e2e.
После документации: pnpm docs:check.
Integration: ожидаются все 1514 cases существующей композиции, включая все 6 H3 и 21 DB-health; обязательны ноль неожиданных skips/failures. Количество не заменяет проверку этих наборов. E2E: все настроенные на этой ветке cases, укажи фактическое число. Не подставляй число из другой I1-ветки.
При реальном новом FAIL сохрани точный лог и остановись на отчёт без обхода проверки и самовольного исправления вне allowlist. Не повторяй зелёные проверки без изменения проверяемого кода или обязательного основания.

Неизменяемые условия / non-goals
Не менять production-код Health, server/client runtime, migrations, DB constraints, fixture keys/IDs, assertions, contract, auth, signing, dedup/idempotency и scheduler.
Никаких ON CONFLICT, upsert, reuse существующих записей, удаления отдельных конфликтующих строк, skips, test-order hacks, увеличения retries, CI/workflow edits или ослабления interlocks.
Не переносить коммиты I1 целиком и не интегрировать main в эту задачу.
Не редактировать README.md, AGENTS.md, docs/README.md, CHANGELOG.md, сайт/SEO/domain migration или workspace-control. Не разрешать конфликт PR9.
Не запускать live-provider calls, merge, deploy или release.
B5 остаётся NOT ACCEPTED до независимого ревью архитектора. Это исправление gate, а не принятие B5. C2.2-A остаётся открытым на своём месте.

Evidence и публикация
В новом README/results зафиксируй start/code/final refs и trees без вымышленных SHA; точные RED/GREEN команды/exit codes, полную матрицу gates, версии инструментов, перечень изменённых путей и ноль live calls. Сохрани исторический FAIL; не выдавай 6 skipped за PASS. В B5-документ добавь явное уточнение: успешный gate ещё не означает архитектурную приёмку B5.
Code/test commit сначала, evidence commit затем. Финальный self-SHA не встраивай в собственный коммит: укажи его в terminal report.
Публикуй только normal fast-forward в существующую feature/server-health-h3-p8-4. Без force/rebase/history rewrite и без нового PR в рамках этой задачи.
Проверь remote head после push. Получи фактические текущие Server/Documentation CI URL, run/job IDs, checkout SHA и результаты, если доступ позволяет; исторический run не является проверкой candidate. Не запускай повторный CI ради ожидания. При недоступности доступа обозначь UNKNOWN с точной причиной, не объявляй PASS.
Terminal report: task ID; branch; start/code/final SHA/tree/parent; allowlist diff; RED и GREEN отдельно; полный список gates и реальные skips; remote head/CI facts; состояние worktree и очистка только своих ресурсов; blockers.
После terminal report остановись для архитектурного ревью. Следующий шаг выбирает архитектор.