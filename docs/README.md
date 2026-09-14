# Карта документации

Версия спецификации: 1.0. Дата: 2026-09-14.
Нормативная документация описывает целевое поведение. Реализацию и подтверждения смотреть отдельно в [STATUS](STATUS.md).

## Продукт

- [SPEC](product/SPEC.md): состав сервиса и обязательные требования.
- [UX](product/UX.md): экраны, действия, ошибки и переходы.
- [BETA_ADMISSION](product/BETA_ADMISSION.md): ограничение новых регистраций.
- [ADMIN_AND_WEB](product/ADMIN_AND_WEB.md): сайт, роли, админка и статистика.

## Архитектура

- [OVERVIEW](architecture/OVERVIEW.md): компоненты и зависимости.
- [REPOSITORY](architecture/REPOSITORY.md): каталоги и правила размещения.
- [DATA_AND_SECURITY](architecture/DATA_AND_SECURITY.md): данные, права и хранение.
- [CONTRACTS](architecture/CONTRACTS.md): обмен и версии.
- [SYNC](architecture/SYNC.md): автономность, привязки и перенос.
- [STATE_MACHINES](architecture/STATE_MACHINES.md): рабочие состояния и поздние события.

## Интеграции

- [Общая read-only политика](integrations/READ_POLICY.md).
- [Ozon](integrations/ozon/README.md), [WB](integrations/wildberries/README.md).
- [ИИ](integrations/ai/README.md), [браузеры](integrations/browsers/README.md).

## Разработка и выпуск

- [D2.2: очередь и контекст пакета](migration/evidence/extension-context-d2-2-2026-09-14/README.md).

- [Общее ядро D2.1/D2.2 и development-сборка](development/EXTENSION_CORE.md), [квитанция](migration/evidence/extension-core-d2-1-2026-09-14/README.md).

- [WORKFLOW](development/WORKFLOW.md), [QUALITY](development/QUALITY.md).
- [Расширения после импорта](development/EXTENSION_BASELINE.md), [приёмка D1.E1](migration/evidence/extension-import-2026-09-14/README.md).
- [ACCEPTANCE_MATRIX](development/ACCEPTANCE_MATRIX.md): обязательные сценарии.
- [FAILURE_LEDGER](development/FAILURE_LEDGER.md): известные классы ошибок.
- [RELEASE_AND_RECOVERY](operations/RELEASE_AND_RECOVERY.md).
- [MONITORING](operations/MONITORING.md).
- [CAPACITY](operations/CAPACITY.md): нагрузка, бюджеты и измерения.
- [ROADMAP](ROADMAP.md), [STATUS](STATUS.md).

## Решения и происхождение

- [DECISIONS](decisions/DECISIONS.md): принятые решения и заменённые варианты.
- [OPEN_ITEMS](decisions/OPEN_ITEMS.md): внешние проверки и намеренно отложенные детали.
- [SOURCES](migration/SOURCES.md), [PLAN](migration/PLAN.md).
- [Карта расширений D1.E0](migration/EXTENSION_IMPORT_MAP.md), [выполненный импорт D1.E1](migration/EXTENSION_IMPORT_NEXT_STEP.md).
- [Квитанция D1.E0](migration/evidence/extensions-2026-09-14/README.md), [расхождения исходников](migration/evidence/extensions-2026-09-14/FINDINGS.md).
- [SOURCE_STATUS](migration/evidence/SOURCE_STATUS.md): границы доказательств.
- [DOCUMENTATION_ACCEPTANCE](migration/evidence/DOCUMENTATION_ACCEPTANCE.md): проверка текущего этапа.
- [Инструкции пользователя](user/README.md).

## Как избегаем расхождения

Правило живёт в одном основном документе. Другие документы дают ссылку. Реестры операций и HELP в реализации происходят из одного машинного источника; OpenAPI генерируется из контрактов.
Изменение правила сопровождается обновлением решений и сценария приёмки. Документы источников сохраняют исторический смысл; их старые статусы не заменяют текущую оценку владельца.

## Перенесённый сервер

- [Серверная точка входа](server/README.md).
- [Квитанция переноса](migration/evidence/SERVER_IMPORT_ACCEPTANCE.md).
- [Поручение серверному Codex](development/SERVER_CODEX_HANDOFF.md).
