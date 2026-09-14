# Адаптер Ozon

D2.1 содержит `src/delivery-plan.js` (Ozon file refs/представление результата) и `src/mixed-discovery.js` (protocol defaults и входные parsers). Они подключены к общим алгоритмам.

D2.2 добавляет provider-runtime.js: зрелая реализация с per-call guard перед fetch и credential-scoped Performance token reuse. Registry, низкоуровневый transport и поздние wrappers сохраняются из закреплённого baseline.

[Архитектура и команды](../../../docs/development/EXTENSION_CORE.md), [текущий статус](../../../docs/STATUS.md).
