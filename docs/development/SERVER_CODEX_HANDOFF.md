# Поручение серверному Codex после переноса

Этот файл — подготовленное поручение, не запуск нового агента и не разрешение продолжить P8.4 в старом репозитории.
S1.1 уже принят; этот файл сохраняет его исходную область как историческую запись и не выдаёт новое разрешение на серверную реализацию.
Repository: MaksimUnimax/Seller_Agents. Историческая база S1.1 — актуальный
`main` после принятого переноса; использованная для него ветка
`feature/server-beta-access` уже закрыта.

## Текущая authority handoff

Текущим источником истины является canonical `main` на merge-коммите
`d0b54aa5e659932d3fa2d996b572e06aadfffe62`. Post-merge authority, source
lineage и exact-head CI S1.1 записаны в [S1.1 remote acceptance](../server/S1_1_REMOTE_ACCEPTANCE_2026-09-14.md).

Ниже сохранена область уже завершённого S1.1 для трассировки требований. Она
не является текущим поручением и не должна повторно реализовываться. Для нового
серверного изменения требуется отдельное поручение владельца с указанным
scope и базовым commit. Этот A8A closeout остаётся документационным и не
открывает I1, S1.2, H3/P8.4/P8.5/P8.6, extension work, database changes или
contract changes.

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

## Завершённое поручение S1.1 (историческая область)

Level 1: S1 — сервер бесплатной беты.
Level 2: S1.1 — явный бесплатный доступ BETA и атомарный набор регистраций.
S1.1 принят в canonical `main` как `DONE / REMOTE ACCEPTED`; post-merge authority и exact-head CI записаны в [S1.1 remote acceptance](../server/S1_1_REMOTE_ACCEPTANCE_2026-09-14.md). Следующий будущий серверный участок — ранний I1 (реальная авторизация расширения); S1.2 (реальная email-доставка/preprod) этим состоянием не начинается.
План затронутых модулей и согласованных контрактов был частью завершённого поручения; его нельзя трактовать как новое задание.

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

## Будущая последовательность I1 (только запись границ)

S1.1 остаётся `DONE / REMOTE ACCEPTED`; I1 этим closeout не начат. Следующая
серверная последовательность после отдельного поручения владельца —
`I1-SRV.0`, затем `I1-SRV.1`, с продолжением только по явно принятым шагам.
Будущую ветку `feature/server-i1-auth-bootstrap` создавать от тогдашнего
принятого `main`, а не от исторической beta-ветки.

I1 должен переиспользовать существующий стек OTP, device, access, refresh,
bootstrap и revoke. Второй auth stack создавать запрещено; новые шаги должны
подключаться к этим существующим authority и контрактам после их отдельного
review.

Для Stream A Health не является authority: Health authority относится к
Stream B и не выдаёт серверному I1 разрешение на health runtime или evidence.
Extension runtime также не является authority Stream A; его реализация и
интеграция остаются отдельными границами.

После `I1-SRV.5` действует hard stop до нового поручения владельца. Реальная
email-доставка и preprod остаются отложенными в S1.2. Ни `I1-SRV.0`, ни любой
другой шаг I1 этим документом не начат.
