# D2.3 — WB adapter / common queue

Дата: 2026-09-14. Статус: **LOCAL SOURCE/PACKAGE PASS; REMOTE CI/READBACK PENDING**.
Base remote main: `f73d2b448e5189476b06bf1a2a25e528241e750d`; tree `e88a92686cf3b2754e17e9591c8c558f89555d32`.
Поручение владельца: восстановить и продолжить существующее объединение; Ozon — основной эталон общей механики.

## Восстановленная последовательность

D0: документация и согласованные решения. D1.S1: перенос сервера. D1.E0: карта исходников/зависимостей Ozon и WB. D1.E1: перенос 232 исходных и проверочных файлов. D2.1: выделены общие Work/discovery/execution/delivery модули. D2.2: очередь и защита закреплённого контекста; версия 0.2.1. Последний main CI D2.2, оставшийся running в прошлом чате, завершён success: [run 34836998945](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34836998945).

Текущая работа находится в Seller_Agents. Blood & Sand остаётся источником закреплённых исходников; его main `17aa08335ee3acdc80cc7a093ddfa462198872f5` и отсутствие в нём f73d2b4 проверены при восстановлении. Локальное исходное дерево точно совпало с удалённым деревом Seller_Agents. CLI fetch не получил credentials; remote ref/tree/CI прочитаны GitHub connector. История исходных проектов не изменяется.

## Изменения

WB API adapter загружается после Ozon wrappers в изолированном scope. Сохранены WB registry/credentials/serializer/HELP/fixed-host transport. Общая очередь, single-flight и record storage происходят из Ozon. Await guards выделены из прикладного Ozon reader в общий GuardedBatchQueue, который вызывают Ozon и WB. Добавлен механизм общих наблюдённых Retry-After deadlines без придуманных числовых WB лимитов.

Результат после ошибки сохранения квоты сначала записывается, затем хвост останавливается. Binary bytes и исходное безопасное имя сохраняются в результате; состояние явно BYTES_RECEIVED_NOT_DELIVERED. Конкретные изменения, зависимости и открытые участки перечислены в [архитектуре адаптера](../../../development/EXTENSION_WB_ADAPTER.md).

## Проверка и пределы

[LOCAL_RESULTS](LOCAL_RESULTS.json): 105 gate processes PASS. Это прежние source/ZIP routes Ozon и 17 новых групп WB; 172 enabled/16 disabled проверены на локальные contract/serialization gates для всех 188 строк сохранённого registry. WB schema/live correctness этими числами не сертифицированы.

[NEGATIVE_CONTROLS](NEGATIVE_CONTROLS.json): контроль отсутствия нового адаптера на D2.2 и воспроизведение найденной ошибки промежуточного D2.3 кандидата. В нём transport превращал context cancellation перед fetch в обычную provider error; WB-07 это обнаружил, финальный adapter повторно проверяет context в catch. Это не утверждение причины прежнего installed FAIL WB.

Первый полный runner остановился до gate-вызовов: версия 0.2.2 ещё не входила в явный список development-версий. Runner обновлён; исходные imported tests не менялись. Structural port/whitespace adapters D2.2 сохранены; behavioral assertions не ослаблены. Повторный полный маршрут прошёл. Преднамеренный middle-failure runner control по-прежнему возвращает exit 7 и не исполняет следующий шаг.

Development-пакет 0.2.2 имеет 37 файлов; два ZIP совпадают, исходники и extracted bytes сверены. Точные hashes/inputs в LOCAL_RESULTS. Дополнительный WB module не заменяет Ozon globals и не добавляет network-on-load или новые manifest permissions.

**WB application route не подключён:** popup/content handlers ещё используют Ozon. Новые WB tests исполняют реальный generated worker и реальные core/adapter modules, но подставляют локальные application/storage/context/finalization ports. Это internal adapter acceptance, а не установленный полный сценарий. Настоящие магазины, WB Start, file/DOM/send и часовой TTL всех копий — следующий участок D2.

Imported baselines и tests неизменны. Сервер, wire contracts, lockfile, исходные ветки, live marketplace calls и production не менялись. WB INSTALLED FAIL / R1–R8 BLOCKED, Ozon live pending сохранены. Общий D2 остаётся IN_PROGRESS.
