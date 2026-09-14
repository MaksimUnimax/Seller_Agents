# Репозиторий и размещение кода

Канонический репозиторий: MaksimUnimax/Seller_Agents. Основная ветка main.
Директории D0 содержат README с назначением; Git не хранит пустые каталоги. Это не фиктивные приложения.

| Путь | Содержимое |
|---|---|
| apps/extension/src/popup | Общий UI, карточки магазинов, действия Work |
| apps/extension/src/background | Composition root worker, обработчики browser events |
| apps/extension/src/content | Composition root страницы, безопасный канал в worker |
| apps/extension/manifests | Варианты manifest и packaging по браузерам |
| apps/extension/assets | Иконки/локализация/статические ресурсы |
| apps/api, portal, admin, worker, health-runner | Перенесённые серверные entrypoints и UI |
| packages/bridge-core | Общий runtime, состояния, policies через порты |
| packages/marketplaces/ozon, wildberries | Изолированная специфика площадок |
| packages/ai-adapters/chatgpt, alice | Реализация поддерживаемых AI targets |
| packages/browser-platform/chromium, firefox, safari | Различия браузеров и платформ |
| packages/control-client | Клиент серверного контура |
| packages/contracts | Межкомпонентные схемы, protocol versions, генерируемый OpenAPI |
| packages/shared | Небольшие общие чистые примитивы; не склад доменной логики |
| packages/server | Существующие серверные домены, по одному каталогу на пакет |
| docs/product, architecture | ТЗ и границы реализации |
| docs/integrations | Правила API/ИИ/браузеров и подтверждения поддержки |
| docs/development, operations | Работа, проверки, выпуск и восстановление |
| docs/decisions | Текущие решения и внешние неизвестные |
| docs/migration/evidence | Карта источников и доказательства переноса |
| docs/user | Инструкции пользователя |
| tests/contracts, integration, e2e, regression | Межмодульные и сквозные проверки |
| tests/fixtures | Обезличенные контролируемые ответы/DOM; никаких клиентских ключей |
| tooling/build, checks, api-watch | Сборка, постоянные проверки, подготовка API diff |
| infra/local, preprod, production | Конфигурация сред без секретов |
| .github | Общие CI workflow и шаблоны задач/PR |

## Правила зависимостей

Browser packages не импортируют apps, packages/server, Node-only API или секреты инфраструктуры.
contracts содержит переносимые wire-схемы и типы; серверные валидаторы/кодогенерация, которым нужен Node, отделяются от браузерных export entrypoints.
Marketplace adapters не импортируют друг друга. AI adapter не импортирует marketplace adapter.
UI получает доступные команды/поля из модели выбранного marketplace, не дублирует политику read-only в обработчиках кнопок.

Существующий server/packages/contracts в D1 сначала сопоставляется с packages/contracts. Не создавать две независимо редактируемые схемы одинакового протокола.
При смене путей сохранять имена workspace-пакетов, если нет причины менять публичный импорт; фиксировать mapping старое → новое.

## Что не переносим

Маркетинг, SEO, брендовые материалы Blood & Sand и unrelated tooling не являются частью Seller Agents.
Готовые ZIP, node_modules, локальные секреты, профили реальных браузеров и выгрузки магазинов не складываются в исходный код.
Release assets публикуются отдельно при выпуске; их manifest и хеши хранятся в evidence.
Исторический код может временно попасть в migration/reference/<component> только на D1, явно без включения в workspace/production graph и с условием удаления после сверки.

## Развитие

Короткие ветки feature/…, fix/…, docs/…, migration/…. Не создавать постоянные параллельные Ozon/WB копии общего ядра.
Сервер и расширение могут выпускаться разными версиями; совместимость определяют схемы и release manifest.
Корневой lockfile появляется после реального импорта зависимостей и генерации package manager. В D0 поддельный lockfile не создаётся.
