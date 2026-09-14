# D2.2 — общая очередь и контекст пакета

Дата: 2026-09-14. Статус: **ACCEPTED — SOURCE / PACKAGE / REMOTE CI / READBACK PASS**.
Base Seller_Agents: `56812e282dfb7ee48a6682277c68fd74ca716a60`. Основание: новое поручение владельца «Делай» после D2.1.

## Подтверждённая проблема

На точном D2.1 runtime запущены две команды. Пока первая ожидала контролируемого ответа, через настоящий settings-handler сохранены другие ключи. Старая реализация отправила вторую команду с текущими настройками: 2 запроса вместо допустимого 1. [RED_RESULTS](RED_RESULTS.json) фиксирует тот же regression script и SHA проверенного старого пакета. Живые marketplace calls отсутствуют.

## Изменение

Полный processBatchQueue выделен в bridge-core с явными policy/cache/quota/transport ports. Admission сохраняет неизменяемый безопасный context; queue, provider, cache и delivery сверяют его. При смене реквизитов/привязки/Work остановлены хвост пакета и старая доставка. Guard перед реальным fetch действует также после получения Performance bearer. Token reuse привязан к реквизитам.

Development package 0.2.1 по-прежнему работает через один Ozon credential slot. Настоящие accountId/store catalog, WB adapter, новый popup, часовой TTL и серверная интеграция ещё не реализованы. [Архитектура и команды](../../../development/EXTENSION_CORE.md).

## Проверка

[LOCAL_RESULTS](LOCAL_RESULTS.json) — итоговый полный source/ZIP маршрут, состав пакета и команды. 101 процесс, включая 12 новых context-сценариев, 6 существующих worker-сценариев, 9 module/donor групп и прежние Ozon gates. Включены same-cabinet rotation, binding revision, Work generation, privacy revocation, unrelated setting, stale insert/recovery, Finish во время Performance auth, старый pending пакет без context и token isolation. Установка и live DOM не выполняются.

Две текстовые structural-проверки потребовали адаптации к новым именам портов/форматированию; behavioral assertions исходных тестов не менялись. Оригинальные imported tests сохранены. Runner записывает точные mappings/hashes. Первое извлечение multi-line signature остановилось на закрывающей скобке параметров и было отклонено syntax-check; исправлено полное извлечение тела. Один тест привязки первоначально писал неверное legacy storage имя; исправлена fixture по runtime_names, не production для прохождения теста.

Локальный финальный маршрут: **PASS, 101 процесс**. Пакет `SELLER_AGENTS_D2_2_v0.2.1_DEVELOPMENT.zip`, 1561316 bytes, SHA-256 `2edb38989ced75ff028df0d17ae69ffc5d345490868276370490062bb4e8d26d`. Все 67 production inputs перечислены в receipt. Повтор сборки и source/extracted bytes MATCH. Проверка guard не читает сохранённые отчёты.

[Extension CI](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34835820799) завершён SUCCESS на `6f3a356d0e5b7543f9f265d170c7dc333bf72801`, tree `e3071f87170ea14ae5069148e68541c251386cca`: Common core и все три baseline jobs. Скачанный CI artifact независимо проверен: внешний hash, внутренний package и 36 файлов совпали; состав 67 inputs идентичен локальному receipt.

[REMOTE_RESULTS](REMOTE_RESULTS.json) содержит CI/job/artifact и hashes; [REMOTE_READBACK](REMOTE_READBACK.json) — сверку всех 39 изменённых Git-файлов и 67 production inputs. Завершающий commit меняет только документацию/evidence относительно проверенного кода. D2.2 принят, общий D2 остаётся IN_PROGRESS. Следующий шаг — WB marketplace adapter к общей очереди и прикладная модель магазинов по [плану](../../../development/EXTENSION_CORE.md). CI archives имеют ограниченный срок хранения; исходники, команды и hashes остаются в Git.

## Границы

- Контекст и guard локальны, серверных запросов не добавлено.
- `standalone-local-development` и digest credentials не выдаются за реализованные аккаунты/магазины сервиса.
- Legacy autorun временно остаётся для разработки; целевой пользовательский режим ещё не завершён.
- Source/ZIP и имитационный worker не означают installed PASS.
- Ozon live pending; WB INSTALLED FAIL / migration REOPENED / R1–R8 BLOCKED сохраняются.
- Сервер, контракты, lockfile, исходные ветки Blood & Sand и production не менялись.
