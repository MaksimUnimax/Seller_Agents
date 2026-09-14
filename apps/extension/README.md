# apps/extension

Composition root единого браузерного расширения. Подключает bridge-core, marketplace/AI/browser adapters и control-client. Содержит UI/entrypoints/packaging, не дублирует provider business policy.

D1.E1: `src/imported/ozon-v0.1.22/` содержит 36 точных исходных production-файлов Ozon. Общий runtime ещё не реализован. [Сборка/проверки](../../docs/development/EXTENSION_BASELINE.md), [приёмка](../../docs/migration/evidence/extension-import-2026-09-14/README.md).
Границы: [архитектура](../../docs/architecture/OVERVIEW.md), [размещение](../../docs/architecture/REPOSITORY.md), [текущий статус](../../docs/STATUS.md).
