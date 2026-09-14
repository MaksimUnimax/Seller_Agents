# Текущее состояние

Дата проверки: 2026-09-14.
Этап: D1 COMPLETED — D1.S1/D1.E0/D1.E1 приняты. D1.E1 IMPORT_ACCEPTED: 232 файла, remote CI и readback PASS. D0 COMPLETED; D2 IN_PROGRESS, D2.1 ACCEPTED; D2.2 ACCEPTED — SOURCE/PACKAGE/REMOTE CI/READBACK PASS; D2.3 INTERNAL_ADAPTER_ACCEPTED — SOURCE/PACKAGE/REMOTE CI/READBACK PASS.
Product implementation: SERVER_IMPORTED_AND_VERIFIED; EXTENSION_BASELINES_IMPORTED_AND_VERIFIED; COMMON_CORE_COMPOSED_OZON_VERIFIED; BATCH_CONTEXT_VERIFIED; WB_INTERNAL_ADAPTER_VERIFIED; WB_APPLICATION_ROUTE_NOT_CONNECTED; COMBINED_OZON_WB_RUNTIME_NOT_IMPLEMENTED.
Deployment: NOT_STARTED.
Browser releases: NOT_CREATED.
Live provider tests in this stage: NOT_RUN.

## Компоненты

| Компонент | Исходное состояние | Состояние в Seller_Agents |
|---|---|---|
| Ozon 0.1.22 | 3b102f68; PRE-HANDOFF PASS, LIVE CERTIFICATION PENDING POST INSTALL | 36 runtime-файлов перенесены; local/remote source и package routes PASS; live pending сохраняется |
| WB 0.3.0 | 006af272; INSTALLED FAIL; provider-neutral migration REOPENED / COMPLETENESS NOT PROVEN | 40 runtime-файлов перенесены в reference; 52 исходных suites дают 1075/0 на source и ZIP; installed FAIL сохраняется |
| Сервер | Замороженный P8.4 Foundation на 3f16bbf; H3 browser actions/P8.5/P8.6 не начаты | SERVER_IMPORT_ACCEPTED: новый полный CI PASS, 594-file readback MATCH; deployment не выполнен |
| Единое расширение | Целевая архитектура согласована | D2.3: WB internal adapter в development 0.2.2, source/ZIP/remote CI/readback PASS; WB popup/content не подключены |
| Лимит регистраций беты | Новое требование владельца | Специфицировано, не реализовано |
| Редкая синхронизация/перенос ключей | Приняты целевые механики | Специфицированы, не реализованы |
| Сайт/админка | Исходные приложения сервера | Перенесены и проверены вместе с сервером; beta-механики ещё не реализованы |
| Мониторинг DOM/API | Есть основа Health, целевые правила API watcher | Расписания в этом этапе не создавались |

Снимки и подтверждения: [SOURCES](migration/SOURCES.md), [SOURCE_STATUS](migration/evidence/SOURCE_STATUS.md).

## Текущий результат

D2.3: [квитанция](migration/evidence/extension-wb-adapter-d2-3-2026-09-14/README.md), [границы и зависимости](development/EXTENSION_WB_ADAPTER.md). 105 source/ZIP gate processes PASS, включая 17 групп WB. Один shared guarded queue для Ozon/WB. Сохранены WB API authority и запреты, добавлены context fences и наблюдённый Retry-After. WB выполняется во внутреннем adapter API с локальными application ports в harness; настоящие popup/Start/delivery ещё не соединены. Это не единая установленная сборка. Remote CI 34839904748 SUCCESS; скачанный ZIP побайтово совпал, 97 Git-файлов и все 77 production inputs сверены. Внутренний adapter API принят.

D2.2: [квитанция](migration/evidence/extension-context-d2-2-2026-09-14/README.md). Общая очередь, pinned context и защита от смены реквизитов/привязки во время выполнения. Статус: ACCEPTED; 101 процесс source/ZIP PASS, полный remote CI PASS, скачанный package и 67 production inputs MATCH. Это один Ozon slot, не реализованный каталог аккаунтов/магазинов.

D2.1: [квитанция](migration/evidence/extension-core-d2-1-2026-09-14/README.md), [архитектура и команды](development/EXTENSION_CORE.md). Выделены Work/discovery/local execution/delivery modules с Ozon ports. 99 процессов source/extracted-package проверки PASS локально; включают 15 новых групп сценариев и сохранённые Ozon/attachment/transaction gates. Remote CI и readback PASS; скачанный CI package совпал с локальным, все 50 inputs сверены с Git. Это первый шаг, не завершение всего D2.

D1.E1: [квитанция](migration/evidence/extension-import-2026-09-14/README.md), [команды](development/EXTENSION_BASELINE.md). Перенесены 76 production/reference-файлов и 156 тестовых/справочных входов без изменения байтов. Ozon: 14 source + 11 package gate-вызовов, 66 syntax checks; WB Node: 35 suites, 754/0 на source и ZIP. Проверены повторная упаковка, исходные hashes и остановка runner-а по ошибке. Remote CI PASS: ещё 17 WB browser suites, 321/0 на каждом маршруте; суммарно 52 suites, 1075/0 на source и ZIP. Все три CI artifact скачаны и независимо сверены; 232 удалённых файла совпали с исходниками. Серверный код, конфигурация и lockfile не изменены.

D1.E0: [карта расширений](migration/EXTENSION_IMPORT_MAP.md), [квитанция](migration/evidence/extensions-2026-09-14/README.md), [расхождения](migration/evidence/extensions-2026-09-14/FINDINGS.md). Сверены 76/76 production-файлов с точными ZIP, 100 связей статической загрузки и 176 входов проверок/исторических документов. Локально выполнены закреплённый 514 gate Ozon и проба WB retention; последняя подтверждает 24-часовой default вместо целевого часа. Полная повторная product/installed приёмка не проводилась. Сервер в D1.E0 не изменён.

Историческая приёмка D0: [DOCUMENTATION_ACCEPTANCE](migration/evidence/DOCUMENTATION_ACCEPTANCE.md). Новый сервер прошёл полный CI: 1272 unit, 1507 integration и 85 browser E2E, плюс отдельный regression пути Playwright. Квитанция и границы — [SERVER_IMPORT_ACCEPTANCE](migration/evidence/SERVER_IMPORT_ACCEPTANCE.md). Это серверная приёмка переноса; единое расширение и beta-функции ещё не приняты.

## Следующий этап

[D1.E1](migration/EXTENSION_IMPORT_NEXT_STEP.md) завершён. D2.1 и D2.2 приняты. D2.3 внутренний adapter принят по source/package/remote CI/readback. Далее — соединить Ozon/WB adapters с настоящим каталогом магазинов, общим popup и прикладной Work/delivery orchestration по [плану](development/EXTENSION_WB_ADAPTER.md). Для серверной параллели сохраняется [поручение](development/SERVER_CODEX_HANDOFF.md); перенос расширений не реализует и не открывает H3/P8.5/P8.6. Если владелец передаст новую принятую версию расширения, сначала обновить источник и карту, не подменять выбранные байты по последнему имени ветки.
WB R1–R8 остаются закрыты до установленной приёмки исправленного provider-neutral контура.

## Как обновлять

Для каждого принятого изменения указывать версию/коммит, вид проверки, результат и ограничения. Нельзя одновременно оставлять текущему этапу статусы DONE и PENDING. Исторические неуспешные попытки находятся в evidence, а не в текущей строке.
