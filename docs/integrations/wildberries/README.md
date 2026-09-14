# Wildberries adapter — обязательный незакрытый gate

Текущий статус владельца: **0.3.0 = INSTALLED FAIL**.
Provider-neutral migration: **REOPENED / COMPLETENESS NOT PROVEN**.
**WB-specific R1–R8 не начинать до установленной приёмки исправленного provider-neutral runtime.**

Источник snapshot и исторический отчёт: [SOURCES](../../migration/SOURCES.md).
Предыдущие 102 capabilities и 1075/0 проверок не аннулируются как результаты своей среды, но не доказывают полноту переноса или installed acceptance.

## Что сохраняем

WB_API_V1, WB auth/token/hosts, registry/схемы/сериализацию, read-only gates и подтверждённую WB-семантику.
Старый registry 188/172 enabled/16 disabled — историческая граница источника, не свежая сертификация 172 операций.
Корректно перенесённые общие блоки сохраняются после behavioral differential; существование старого файла само по себе не authority.

## Что доводим

Provider-neutral Work Session, popup/operator flow, AI adapters, ownership, локальное предотвращение повторов, recovery, delivery transactions, файлы, diagnostics, HELP/parsing, quota framework и metadata/LKG.
Для неполного блока переносится целая зрелая подсистема с dependency closure и проверками, адаптированная к WB boundary. Не копируется Ozon business layer.
При объединении такая подсистема должна иметь одну реализацию в bridge-core, а не продолжать расходиться в двух production-копиях.

Owner-installed failure сообщил незавершённый перенос popup и INVALID_CREDENTIAL_BACKUP.
Размер popup.js и различие CSS — основания исследовать semantic differential, а не количественная мера отсутствующих функций.
Причина несовместимости конкретного файла ключей пока не доказана без этого файла. Не публиковать выдуманный диагноз и не обещать принять любой формат.

## Открытие R1–R8

После доказанной installed provider-neutral приёмки:
R1 identity/token/entitlements; R2 cards; R3 prices/stocks; R4 analytics/reports;
R5 orders/returns; R6 finance; R7 promotion; R8 feedback/questions/rating.
Все действия по-прежнему только read-only; «prices» означает чтение, не изменение.
Реальные cache/coalescing/prefetch policies не включаются из Ozon по аналогии.
Новая source-проверка может уточнить границу переноса, но не скрыть установленный FAIL старым READY_FOR_OWNER.
