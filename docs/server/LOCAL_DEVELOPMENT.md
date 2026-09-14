# Работа с перенесённым сервером

Команды выполняются из корня Seller_Agents, а не из прежнего server/.
Версии: Node.js 24.20.0 в CI, pnpm 10.34.5. Внешние зависимости сохранены из замороженного источника.

## Подготовка

1. Получить принятый commit/main Seller_Agents и прочитать SERVER_IMPORT_ACCEPTANCE.
2. Установить зависимости командой pnpm install --frozen-lockfile.
3. Для интеграционных проверок поднять отдельную PostgreSQL: docker compose -f infra/local/docker-compose.yml up -d.
4. Передать переменные из .env.example в окружение процесса, заполнив только тестовые/локальные значения. Само наличие .env не объявляется автоматической загрузкой конфигурации.
5. Запустить pnpm db:migrate на тестовой базе.
6. pnpm api:dev и pnpm worker:dev запускают исходные приложения. Настройку SMTP и production secrets выполнять отдельной задачей.

README инфраструктуры и .env.example описывают disposable development credentials. Не направлять тесты на production DB: часть suites очищает данные.

## Проверки

| Команда | Область |
|---|---|
| pnpm docs:check | Документация и относительные ссылки |
| pnpm lint | Исходники сервера и boundary guard |
| pnpm format:check | Сохранённый формат server source/config |
| pnpm typecheck | Workspace types |
| pnpm test | Исходные package/app unit tests |
| pnpm test:integration | Последовательные suites на отдельной PostgreSQL |
| pnpm db:migrate | Применение сохранённых миграций |
| pnpm openapi:check | Сравнение генерации с сохранённым OpenAPI |
| pnpm bridge:guard | Сервер не импортирует активный Bridge runtime |
| pnpm build | API, worker, health-runner, portal и admin |
| pnpm test:e2e | Исходные Playwright server suites, loopback test harness |
| pnpm exec vitest run tests/e2e/server/playwright-config-regression.test.ts | Проверка пути workspace для Playwright после переноса |

Playwright требует установленного Chromium; в CI используется pnpm exec playwright install --with-deps chromium.
Существующая test:e2e команда использует POSIX assignment переменной; CI работает в Linux. На Windows запускать в совместимой shell или явно передать PRODUCT_CONTROL_PLANE_E2E в окружение и вызвать Playwright напрямую, сохраняя тот же config.
H3 browser actions и live AI проверки эти команды не открывают.

## Продолжение

[Поручение Codex](../development/SERVER_CODEX_HANDOFF.md) описывает следующую задачу после приёмки переноса.
Старый source repo остаётся замороженным; исправления нового сервера делаются здесь.
