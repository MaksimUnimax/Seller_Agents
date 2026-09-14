# Текущее состояние

Дата проверки: 2026-09-14.
Этап: D1.E0 COMPLETED — карта расширений. D0/D1.S1 COMPLETED. D1.E1 (runtime import) NOT_STARTED.
Product implementation: SERVER_IMPORTED_AND_VERIFIED; EXTENSIONS_NOT_IMPORTED.
Deployment: NOT_STARTED.
Browser releases: NOT_CREATED.
Live provider tests in this stage: NOT_RUN.

## Компоненты

| Компонент | Исходное состояние | Состояние в Seller_Agents |
|---|---|---|
| Ozon 0.1.22 | 3b102f68; PRE-HANDOFF PASS, LIVE CERTIFICATION PENDING POST INSTALL | 36 файлов/ZIP сверены; карта готова, код не перенесён |
| WB 0.3.0 | 006af272; INSTALLED FAIL; provider-neutral migration REOPENED / COMPLETENESS NOT PROVEN | 40 файлов/ZIP сверены; карта reference готова, код не перенесён |
| Сервер | Замороженный P8.4 Foundation на 3f16bbf; H3 browser actions/P8.5/P8.6 не начаты | SERVER_IMPORT_ACCEPTED: новый полный CI PASS, 594-file readback MATCH; deployment не выполнен |
| Единое расширение | Целевая архитектура согласована | Не реализовано |
| Лимит регистраций беты | Новое требование владельца | Специфицировано, не реализовано |
| Редкая синхронизация/перенос ключей | Приняты целевые механики | Специфицированы, не реализованы |
| Сайт/админка | Исходные приложения сервера | Перенесены и проверены вместе с сервером; beta-механики ещё не реализованы |
| Мониторинг DOM/API | Есть основа Health, целевые правила API watcher | Расписания в этом этапе не создавались |

Снимки и подтверждения: [SOURCES](migration/SOURCES.md), [SOURCE_STATUS](migration/evidence/SOURCE_STATUS.md).

## Текущий результат

D1.E0: [карта расширений](migration/EXTENSION_IMPORT_MAP.md), [квитанция](migration/evidence/extensions-2026-09-14/README.md), [расхождения](migration/evidence/extensions-2026-09-14/FINDINGS.md). Сверены 76/76 production-файлов с точными ZIP, 100 связей статической загрузки и 176 входов проверок/исторических документов. Локально выполнены закреплённый 514 gate Ozon и проба WB retention; последняя подтверждает 24-часовой default вместо целевого часа. Полная повторная product/installed приёмка не проводилась. Сервер в D1.E0 не изменён.

Историческая приёмка D0: [DOCUMENTATION_ACCEPTANCE](migration/evidence/DOCUMENTATION_ACCEPTANCE.md). Новый сервер прошёл полный CI: 1272 unit, 1507 integration и 85 browser E2E, плюс отдельный regression пути Playwright. Квитанция и границы — [SERVER_IMPORT_ACCEPTANCE](migration/evidence/SERVER_IMPORT_ACCEPTANCE.md). Это серверная приёмка переноса; единое расширение и beta-функции ещё не приняты.

## Следующий этап

D1.E1: [перенос закреплённых исходников и проверок](migration/EXTENSION_IMPORT_NEXT_STEP.md). Затем D2 — единое ядро и adapters. Для серверной параллели сохраняется [поручение](development/SERVER_CODEX_HANDOFF.md); D1.E0 не реализует и не открывает H3/P8.5/P8.6. Если владелец передаст новую принятую версию расширения, сначала обновить источник и карту, не подменять выбранные байты по последнему имени ветки.
WB R1–R8 остаются закрыты до установленной приёмки исправленного provider-neutral контура.

## Как обновлять

Для каждого принятого изменения указывать версию/коммит, вид проверки, результат и ограничения. Нельзя одновременно оставлять текущему этапу статусы DONE и PENDING. Исторические неуспешные попытки находятся в evidence, а не в текущей строке.
