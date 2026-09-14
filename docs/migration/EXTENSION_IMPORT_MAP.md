# Карта переноса расширений — D1.E0

Дата: 2026-09-14. Статус: **MAP COMPLETE / CODE NOT IMPORTED**.
Это карта точных источников, файлов, загрузки и входов проверок. Она не закрывает поведенческую сверку WB, установленную приёмку или объединение.

## Зафиксированные источники

| Компонент | Source commit | Состояние источника | Production-файлы |
|---|---|---|---:|
| Ozon 0.1.22 | `3b102f68a96bee0d7d734d7e32d4fccba440e927` | PRE-HANDOFF PASS; LIVE CERTIFICATION PENDING POST INSTALL | 36 |
| WB 0.3.0 | `006af2724aafdf6589c16881c1ed06eb01cca281` | INSTALLED FAIL по сообщению владельца; полнота переноса открыта | 40 |

Ozon берётся из `tooling/llm-api-bridges/ozon-seller/dist-step7-candidate/`, WB — из `tooling/llm-api-bridges/wildberries/extension/` в `MaksimUnimax/blood_sand`.
Точные ветки, ZIP, SHA-256 и границы проверки находятся в [квитанции D1.E0](evidence/extensions-2026-09-14/README.md). Ozon 0.1.21 заменён как активный источник; исторические multi-AI ветки не объявляются второй текущей версией.

## Как читать карту

- [FILE_MAP](evidence/extensions-2026-09-14/FILE_MAP.md): все 76 файлов, место первого переноса и назначение при объединении.
- [RUNTIME_FILE_MAP.json](evidence/extensions-2026-09-14/RUNTIME_FILE_MAP.json): точные пути, Git blob SHA, SHA-256, размеры и соответствие исходного ZIP.
- [RUNTIME_LOAD_GRAPH.json](evidence/extensions-2026-09-14/RUNTIME_LOAD_GRAPH.json): порядок загрузки manifest, importScripts и ресурсов popup. Все 36/40 файлов достижимы; 46/54 прямых связи.
- [TEST_AND_AUTHORITY_INPUTS.json](evidence/extensions-2026-09-14/TEST_AND_AUTHORITY_INPUTS.json): 176 записей проверок, fixtures и исторических документов, с отдельной ролью каждого входа.
- [FINDINGS](evidence/extensions-2026-09-14/FINDINGS.md): доказанные расхождения, ограничения и проверки перед изменением подсистем.
- [Следующий шаг D1.E1](EXTENSION_IMPORT_NEXT_STEP.md): конкретный объём будущего импорта и критерии завершения.

Граф загрузки не является полным графом вызовов функций. Направления D2 — архитектурное назначение, а не готовый список механических перемещений. Крупные файлы требуют разделения на несколько модулей. Значение HOLD означает, что поведенческая эквивалентность ещё не доказана; KEEP не присваивается по совпадению имени или количеству тестов.

## Первый перенос D1.E1

| Планируемое размещение | Назначение и границы |
|---|---|
| `apps/extension/src/imported/ozon-v0.1.22/` | Временный неизменённый снимок 36 production-файлов. Из него воспроизводится исходный Ozon для регрессии |
| `migration/reference/wildberries-v0.3.0/runtime/` | 40 исходных файлов WB с явным INSTALLED FAIL; вне production-графа и workspace-пакетов |
| `tests/regression/imported/ozon-v0.1.22/` | Исходные проверки выбранного финального package-cycle и связанные регрессии |
| `tests/regression/imported/wildberries-v0.3.0/` | 52 исходных WB suite, их helpers, fixtures и метаданные |
| `tests/fixtures/migration/` | Закреплённые старые donor/RED/permission/matrix входы; только для проверок |
| `tooling/build/`, `tooling/checks/` | Будущая упаковка и запуск проверок в Seller_Agents; без подключения к серверной команде выполнения |

Точные подпути определены в JSON-картах. Эти каталоги исходников в D1.E0 не созданы. Исходный тестовый layout будет собираться во временном каталоге из переносимых файлов, чтобы не переписывать проверки вместе с production-кодом. Состав временного каталога также проверяется по manifest; незаявленных старых файлов там быть не должно.

Временные снимки имеют ограниченный срок жизни: после переноса сценария в общее ядро, соответствующих регрессий и установленной приёмки прежняя production-копия исключается. Историю сохраняет Git. Исторические donor fixtures остаются только пока их использует конкретная проверка.

## Назначение подсистем в D2

| Подсистема и исходные представители | Будущее размещение | Что обязательно сохранить или отделить |
|---|---|---|
| Popup: `popup.js/html/css` | `apps/extension/src/popup` | Один интерфейс с Ozon/WB переключателем, магазинами и ручным Start/Finish. Перенести сообщения, диагностику и lifecycle вместе с отображением |
| Worker/content entrypoints | `apps/extension/src/background`, `apps/extension/src/content` | Только сборка компонентов и события браузера; выполнение, хранение и delivery выделяются в ядро |
| Work, identity, recovery | `packages/bridge-core/src/work`, `identity` | Контекст магазина/аккаунта, идентификатор диалога, поздние события и завершение. Идентификация страницы ИИ отделяется в AI adapter |
| Capture, manual controls, batch discovery | `packages/bridge-core/src/capture`, `execution` | Одно нажатие запускает упорядоченный пакет; повторное обнаружение не запускает его само. Авторежим не входит в пользовательскую бету |
| Отправка, attachment, port/wake, transaction | `packages/bridge-core/src/delivery`, `packages/ai-adapters/*`, `packages/browser-platform/*` | Подтверждения доставки, неизвестный исход, восстановление файла без повторного запроса к площадке; DOM-операции отделить от очереди |
| Registry/contract/guidance/credentials/entitlements Ozon | `packages/marketplaces/ozon` | Seller/Performance, параметры, read policy, лимиты и ключи остаются Ozon-спецификой; общий envelope извлекается отдельно |
| `wb_operations`, `wb_contract`, `wb_command_protocol`, `wb_provider`, credentials/guidance | `packages/marketplaces/wildberries` | Сохранить WB hosts, сериализацию, токен и ограничения. Текущий registry не объявлять живо сертифицированным |
| Смешанный `provider_transport_core`, planners/policies | `packages/bridge-core/src/transport`, `execution`, `policy` и нужный marketplace | Отделить общий механизм от правил конкретной операции. Значения Ozon quota не копировать в WB |
| Storage и разбор документов | `packages/bridge-core/src/storage`, `documents`, `packages/browser-platform` | Часовой технический буфер; завершение IDB-транзакции, scopes, cleanup; provider-specific XLSX/report правила остаются в adapter |
| `runtime_names`, bridge messages | `packages/bridge-core/src/protocol` и marketplace | Новое пространство имён не должно смешать ключи двух магазинов/аккаунтов; изменение строк не заменяет модель данных |
| Browser manifests | `apps/extension/manifests`, `packages/browser-platform/*` | Chrome, Opera, Yandex, Firefox и Safari — отдельные проверяемые targets; общий JS не является доказательством поддержки |
| Серверное подключение | `packages/control-client` | Вход, bootstrap и редкие операции по действующему контракту; marketplace-команды не маршрутизируются через сервер |

Это детализация [REPOSITORY](../architecture/REPOSITORY.md), без смены принятой продуктовой механики. Межкомпонентный серверный контракт остаётся в `packages/contracts`; внутренние сообщения worker/content не нужно автоматически публиковать как серверный API.

## Загрузка Ozon: переносить порядок, а не только файлы

Точка входа `service_worker_entry.js` сначала загружает базовые механизмы и `service_worker.js`, затем Swagger/runtime/XLSX/report/file-delivery расширения поведения. Их порядок приведён в машинном графе. Manifest content scripts и popup имеют собственные ordered lists.

Файлы с `patch` в имени сейчас являются частью production. Нельзя удалить их как временные исправления или отсортировать загрузку по алфавиту. В D1 байты и порядок сохраняются; в D2 изменение factory/wrapper/consumer делается вместе с проверкой всех затронутых точек входа.

## Проверки и их происхождение

У Ozon выбраны 10 верхнеуровневых gate-файлов финального workflow, пять транзитивных входов и шесть дополнительных регрессий для извлекаемых подсистем. Это не каталог всех исторических тестов Blood & Sand. Дополнительные регрессии не выдаются за выполненные в этом этапе.

У WB сохраняются 52 suite исходного финального прохода. Восемь из них используют старый Ozon donor `e01b051c…`; замена donor на текущий Ozon 0.1.22 изменила бы смысл сравнения. Он сохраняется как fixture, без объединения веток. Отдельные Ozon RED-проверки используют `309da471…`, сравнение permissions — manifest `0aa8f535…`.

Финальная матрица 514 операций отсутствует в выбранном Ozon candidate и в старом workflow читается из движущегося `origin/main`. Для будущей проверки закреплён точный вход `17aa0833…` и его SHA-256. Проверка 514 на выбранных байтах Ozon и этом входе пройдена локально; это не заменяет installed acceptance и не доказывает фактические права аккаунта.

## Границы параллельной работы

Серверный Codex продолжает отдельные задания в серверных каталогах. Этот этап не меняет сервер, lockfile, auth contract, root scripts или серверный CI. Первое общее расширение подключается к серверу по I1, до завершения всех следующих функций. Импорт исходного Ozon сам по себе не создаёт beta-авторизацию.

Новые LLM, WB R1–R8, live API characterization, browser publication и развёртывание не входят в D1.E0/D1.E1. Исправление WB provider-neutral контура и переход от сохранённого Ozon к согласованному единому продукту выполняются в D2 с собственными доказательствами.
