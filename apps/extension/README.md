# Расширение Seller Agents

`src/imported/ozon-v0.1.22/` — неизменённый источник и regression baseline. `composition.json`, `src/background/compat/` и `src/background/context/` подключают общее ядро и защиту контекста к development-сборке 0.2.1. Generated runtime создаётся сборщиком в build и не редактируется вручную.

WB пока остаётся reference. Единый marketplace switch, несколько магазинов, серверная авторизация нового расширения и браузерный выпуск ещё не реализованы этим шагом.

[Общее ядро и сборка](../../docs/development/EXTENSION_CORE.md), [исходные проверки](../../docs/development/EXTENSION_BASELINE.md), [текущее состояние](../../docs/STATUS.md).
