# Перенесённый сервер

Исходная база: blood_sand, feature/product-control-plane-p8-4-h3-2026-09-14,
commit 3f16bbf6387cc62303e292fcfe61449c8f243b92.

Граница: P8.4 Foundation deterministic acceptance PASS по фиксации владельца; H3 browser actions, P8.5 и P8.6 не начаты.
Текущий перенос не продолжает P8.4. Source documents ниже сохраняют исторические статусы; текущий результат переноса находится в [STATUS](../STATUS.md).

Прочитать сначала [общие решения](../decisions/DECISIONS.md), [поручение продолжения](../development/SERVER_CODEX_HANDOFF.md) и [квитанцию переноса](../migration/evidence/SERVER_IMPORT_ACCEPTANCE.md).
Новые общепродуктовые решения имеют приоритет над старым порядком «Bridge только P11», платным первым выпуском и коммерческим лимитом установок.
Пока перенесено исходное поведение; бесплатная beta eligibility, quota регистрации и прочие новые механики ещё требуют реализации.

## Размещение

- apps/api, portal, admin, worker, health-runner — серверные приложения.
- packages/server — 26 серверных доменных пакетов.
- packages/contracts и packages/shared — сохранённые общие пакеты с прежними именами @product.
- tests/integration/server и tests/e2e/server — сохранённые тесты.
- tooling/server — служебные scripts.
- packages/contracts/openapi — принятый API artifact.
- infra/local — локальная тестовая БД.
- [reference](reference/bridge/BASELINE.md) — историческая справка, не импорт runtime расширения.

## Исходные нормативные документы

[Архитектура](ARCHITECTURE.md), [требования](REQUIREMENTS.md), [roadmap источника](ROADMAP.md),
[правила разработки](DEVELOPMENT_RULES.md), [безопасность](SECURITY.md),
[интеграционный контракт](INTEGRATION_CONTRACT.md), [стек](TECH_STACK.md),
[модель данных](DATA_MODEL.md), [API](API_CONTRACTS.md), [тестирование](TEST_STRATEGY.md).
Исторические пути server/... в evidence относятся к исходному репозиторию. Полная карта новых путей находится в manifest переноса.
