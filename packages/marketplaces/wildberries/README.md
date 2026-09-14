# Wildberries adapter

WB-specific authority, credentials, serializer, HELP и fixed-host transport находятся в изолированном bundle. src/adapter.js добавляет строгую границу контекста; src/batch-adapter.js вызывает единственную очередь bridge-core.

D2.3: internal adapter SOURCE/PACKAGE/REMOTE CI/READBACK PASS. Реальные WB popup/content/Start/delivery не подключены. 0.3.0 INSTALLED FAIL и R1–R8 BLOCKED сохраняются. API registry — сохранённый snapshot, не live certification.

[Контракты, зависимости, границы и команды](../../../docs/development/EXTENSION_WB_ADAPTER.md).
