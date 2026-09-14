# Текущее состояние

Дата проверки: 2026-09-14.
Этап: D1.E1 IMPORT_CANDIDATE — 232 файла перенесены, remote CI/приёмка ожидаются. D0/D1.S1/D1.E0 COMPLETED.
Product implementation: SERVER_IMPORTED_AND_VERIFIED; EXTENSION_BASELINES_IMPORTED_ACCEPTANCE_PENDING; COMBINED_RUNTIME_NOT_IMPLEMENTED.
Deployment: NOT_STARTED.
Browser releases: NOT_CREATED.
Live provider tests in this stage: NOT_RUN.

## Компоненты

| Компонент | Исходное состояние | Состояние в Seller_Agents |
|---|---|---|
| Ozon 0.1.22 | 3b102f68; PRE-HANDOFF PASS, LIVE CERTIFICATION PENDING POST INSTALL | 36 runtime-файлов перенесены; local source/package route PASS, remote приёмка ожидается |
| WB 0.3.0 | 006af272; INSTALLED FAIL; provider-neutral migration REOPENED / COMPLETENESS NOT PROVEN | 40 runtime-файлов перенесены в reference; Node source/package PASS, browser fixtures ожидаются |
| Сервер | Замороженный P8.4 Foundation на 3f16bbf; H3 browser actions/P8.5/P8.6 не начаты | SERVER_IMPORT_ACCEPTED: новый полный CI PASS, 594-file readback MATCH; deployment не выполнен |
| Единое расширение | Целевая архитектура согласована | Не реализовано |
| Лимит регистраций беты | Новое требование владельца | Специфицировано, не реализовано |
| Редкая синхронизация/перенос ключей | Приняты целевые механики | Специфицированы, не реализованы |
| Сайт/админка | Исходные приложения сервера | Перенесены и проверены вместе с сервером; beta-механики ещё не реализованы |
| Мониторинг DOM/API | Есть основа Health, целевые правила API watcher | Расписания в этом этапе не создавались |

Снимки и подтверждения: [SOURCES](migration/SOURCES.md), [SOURCE_STATUS](migration/evidence/SOURCE_STATUS.md).

## Текущий результат

D1.E1: [квитанция](migration/evidence/extension-import-2026-09-14/README.md), [команды](development/EXTENSION_BASELINE.md). Перенесены 76 production/reference-файлов и 156 тестовых/справочных входов без изменения байтов. Ozon: 14 source + 11 package gate-вызовов, 66 syntax checks; WB Node: 35 suites, 754/0 на source и ZIP. Проверены повторная упаковка, исходные hashes и остановка runner-а по ошибке. Remote CI и 17 WB browser suites ещё не приняты. Серверный код, конфигурация и lockfile не изменены.

D1.E0: [карта расширений](migration/EXTENSION_IMPORT_MAP.md), [квитанция](migration/evidence/extensions-2026-09-14/README.md), [расхождения](migration/evidence/extensions-2026-09-14/FINDINGS.md). Сверены 76/76 production-файлов с точными ZIP, 100 связей статической загрузки и 176 входов проверок/исторических документов. Локально выполнены закреплённый 514 gate Ozon и проба WB retention; последняя подтверждает 24-часовой default вместо целевого часа. Полная повторная product/installed приёмка не проводилась. Сервер в D1.E0 не изменён.

Историческая приёмка D0: [DOCUMENTATION_ACCEPTANCE](migration/evidence/DOCUMENTATION_ACCEPTANCE.md). Новый сервер прошёл полный CI: 1272 unit, 1507 integration и 85 browser E2E, плюс отдельный regression пути Playwright. Квитанция и границы — [SERVER_IMPORT_ACCEPTANCE](migration/evidence/SERVER_IMPORT_ACCEPTANCE.md). Это серверная приёмка переноса; единое расширение и beta-функции ещё не приняты.

## Следующий этап

Завершить remote приёмку [D1.E1](migration/EXTENSION_IMPORT_NEXT_STEP.md). Затем D2 — единое ядро и adapters. Для серверной параллели сохраняется [поручение](development/SERVER_CODEX_HANDOFF.md); D1.E0 не реализует и не открывает H3/P8.5/P8.6. Если владелец передаст новую принятую версию расширения, сначала обновить источник и карту, не подменять выбранные байты по последнему имени ветки.
WB R1–R8 остаются закрыты до установленной приёмки исправленного provider-neutral контура.

## Как обновлять

Для каждого принятого изменения указывать версию/коммит, вид проверки, результат и ограничения. Нельзя одновременно оставлять текущему этапу статусы DONE и PENDING. Исторические неуспешные попытки находятся в evidence, а не в текущей строке.
