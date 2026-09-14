# Общее ядро расширения

В D2.1 выделены Work state/revision, mixed-envelope discovery, локальные single-flight/record writes и модель доставки/recovery. В D2.2 сюда также перенесены полная очередь пакета и immutable context guard. Прикладные Start, настройки, browser ports и каталог магазинов ещё развиваются.

Без конкретной площадки, DOM, browser storage API или сервера. Ozon file policy и protocol defaults находятся в marketplace adapter. Временные legacy compatibility exports создаёт приложение.

[Архитектура и команды](../../docs/development/EXTENSION_CORE.md), [фактический статус](../../docs/STATUS.md).
