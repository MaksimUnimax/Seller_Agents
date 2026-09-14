# Расширение Seller Agents

`src/imported/ozon-v0.1.22/` — неизменённый источник и regression baseline. `composition.json` и `src/background/compat/` подключают выделенные общие модули к development-сборке 0.2.0. Generated runtime создаётся сборщиком в build и не редактируется вручную.

WB пока остаётся reference. Единый marketplace switch, несколько магазинов, серверная авторизация нового расширения и браузерный выпуск ещё не реализованы этим шагом.

[Общее ядро и сборка](../../docs/development/EXTENSION_CORE.md), [исходные проверки](../../docs/development/EXTENSION_BASELINE.md), [текущее состояние](../../docs/STATUS.md).
