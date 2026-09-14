# Поручение серверному Codex после переноса

Этот файл — подготовленное поручение, не запуск нового агента и не разрешение продолжить P8.4 в старом репозитории.
Начать реализацию после завершённого SERVER_IMPORT_ACCEPTANCE и поручения владельца.
Repository: MaksimUnimax/Seller_Agents. Base: актуальный main после принятого переноса. Создать короткую feature/server-beta-access ветку от него.

## Точка остановки источника

blood_sand / feature/product-control-plane-p8-4-h3-2026-09-14 / 3f16bbf6387cc62303e292fcfe61449c8f243b92.
P8.4 Foundation: принят по фиксации владельца; H3 browser actions, P8.5/P8.6: NOT_STARTED.
owner_refs и recommendations не опубликованы в источнике и остаются у владельца локально. Их содержимое в Seller Agents отсутствует; не утверждать, что локальная неопубликованная работа перенесена.

## Обязательное чтение

Корневой AGENTS, docs/STATUS, docs/ROADMAP, docs/decisions/DECISIONS;
docs/product/SPEC, BETA_ADMISSION и ADMIN_AND_WEB;
docs/architecture/CONTRACTS, DATA_AND_SECURITY и SYNC;
docs/server/README, DEVELOPMENT_RULES, SECURITY, INTEGRATION_CONTRACT;
docs/migration/evidence/SERVER_IMPORT_ACCEPTANCE.

## Следующая ограниченная задача

Level 1: S1 — сервер бесплатной беты.
Level 2: S1.1 — явный бесплатный доступ BETA и атомарный набор регистраций.
На feature-ветке S1.1 имеет статус `IMPLEMENTED_CANDIDATE`; `OWNER_ARCHITECT_REVIEW_PENDING`. После независимого принятия следующий будущий серверный участок — ранний I1 (реальная авторизация расширения); S1.2 (реальная email-доставка/preprod) этим состоянием не начинается.
До кода составить план затронутых существующих auth/access/admin модулей и согласованных контрактов по уже принятому ТЗ; не менять продуктовую механику.

Требуемый результат:
- accessBasis BETA без fake checkout и платного trial timer;
- новые подтверждённые регистрации ограничены capacity/admitted в одной транзакции;
- existing login/new installation не расходуют место и не блокируются закрытием набора;
- начальный режим CLOSED; owner/beta-operator открывает и добавляет места с requestId/revision/audit;
- beta не использует коммерческий лимит установок;
- сохранены безопасность OTP/session rotation, остальные принятые commercial semantics и server/extension boundaries.

Использовать тестовые данные. Настоящую почту и препрод оставить отдельной будущей задачей S1.2; после принятия S1.1 следующий серверный участок — ранний I1.
H3 browser actions/P8.5/P8.6 не начинать в S1.1.

## Разрешённые области

apps/api/portal/admin/worker/health-runner и packages/server по необходимости задачи;
packages/contracts/shared — только явные необходимые изменения с проверкой потребителей;
соответствующие server tests, docs/server и evidence.
Не трогать apps/extension, bridge-core, marketplace/AI/browser adapters или активные исходные ветки Blood & Sand.
Существующие имена @product/* сохранены; они не означают отдельный репозиторий.

## Проверки и отчёт

Из корня: pnpm install --frozen-lockfile; pnpm lint; pnpm format:check; pnpm typecheck; pnpm test;
pnpm test:integration с отдельной PostgreSQL; pnpm db:migrate; pnpm openapi:check; pnpm bridge:guard; pnpm build; pnpm test:e2e.
Новые схемы генерировать явно с review. В S1.1 обязательно конкурентное последнее место/повтор OTP/requestId/вход существующего пользователя при закрытом наборе/права админки.
Не ослаблять старые проверки для получения зелёного CI; обновлять только изменённое по принятому ТЗ ожидаемое поведение.

server-import-check проверяет неизменяемую квитанцию D1 на коммите переноса и migration/server-* ветках. После начала новой feature-разработки изменяемые файлы не обязаны совпадать с хешами старого переноса.
Завершение: конкретное поведение, exact commit, CI и тестовые результаты, ограничения, обновлённый STATUS и следующая задача. Наличие исходного PASS не подтверждает новый код.
