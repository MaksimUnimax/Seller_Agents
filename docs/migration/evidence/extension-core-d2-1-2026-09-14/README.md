# D2.1 — выделение первых общих модулей

Дата: 2026-09-14. Статус: **CANDIDATE / REMOTE ACCEPTANCE PENDING**.
Основание: поручение владельца «Делай» после D1.E1. Base Seller_Agents: `f2a093231bde076c5ee9cd59047b31396b314ba1`. Donor Ozon 0.1.22: `3b102f68a96bee0d7d734d7e32d4fccba440e927`. WB reference: `006af2724aafdf6589c16881c1ed06eb01cca281`, INSTALLED FAIL.

## Изменение

Четыре общих модуля выделены в packages/bridge-core и подключены в исполняемую development-сборку 0.2.0. Work state/revision, mixed HELP/API discovery, local single-flight/record writes и delivery/recovery больше не имеют зависимости от конкретной площадки. Ozon file refs/attachment plan и protocol defaults вынесены в marketplace adapter. Остальная оркестрация временно остаётся в исходном worker.

Это первый ограниченный шаг D2, **не завершённое общее расширение Ozon/WB**. Сценарий Start → ручной пакет → delivery → Finish/recovery проверяется на реальном composed worker с контролируемыми внешними портами. [Техническая инструкция и оставшаяся работа](../../../development/EXTENSION_CORE.md).

Происхождение и точный состав задают [composition.json](../../../../apps/extension/composition.json) и inputs/files в [LOCAL_RESULTS](LOCAL_RESULTS.json). Frozen импорт не редактировался; версия меняется только в generated package. Набор и порядок загрузки 36 файлов сохранены, изменяемые shared entries скомпонованы из common core + provider/compat adapters. Замена четырёх функций worker проверяет исходный SHA каждого фрагмента.

## Локальная проверка

Linux, Node 24.19.0, Python 3.12.14. Команда: `python tooling/checks/extension_core.py --output build/d2-1-formatted-final`.

- 232 imported files MATCH; исходные snapshots и тесты неизменны.
- 14 Ozon source + 11 extracted-package gate-вызовов и 66 syntax checks — PASS.
- 9 новых групп module/donor/port checks и 6 сценариев полного worker — PASS на source и ZIP.
- Сохранённые transaction-abort и direct-binary attachment regressions — PASS на обоих маршрутах.
- Итого 99 успешно завершённых процессов; это число запусков, не число независимых пользовательских сценариев.
- Два независимых composed runtime/ZIP совпали. Распакованные 36 файлов совпали с собранными bytes.
- Промежуточный exit 7 остановил контрольный runner; следующая команда не запущена.

Новые файлы отформатированы принятой в репозитории Prettier 3.6.2; dependency manifests/lockfile не менялись. После форматирования весь заявленный маршрут повторён на окончательных байтах.

## Что уточнили при построении тестов

Первый harness не передавал обязательный `owner_kind=manual` в delivery messages и запрашивал обычный статус вместо CONTENT_READY для recovery. Исправлен тестовый канал по фактическому протоколу; product-код ради него не ослаблялся.

В исходном worker принятая команда после Finish может оформиться как локальный error-item `WORK_SESSION_NOT_VISIBLE` с нулём API-команд. Поэтому проверяется отказ в бизнес-исполнении и отсутствие запросов, а не предположение, что любой ответ служебного handler обязан иметь `ok=false`. Механика не объявляется новой функциональностью.

## Границы

- Новые common modules не делают сетевых запросов и не вводят обязательных обращений к серверу.
- WB prefixes/ports проверены синтетическим contract case, настоящий WB adapter ещё не подключён к этому worker.
- Store/account/credential context новой общей модели, новый popup, удаление legacy autorun, унификация часового TTL и серверная интеграция ещё впереди.
- Функции legacy autorun в модели сохранены только как совместимость существующих consumers; это не целевой пользовательский интерфейс.
- Browser messaging/storage/network в новых worker tests имитируются. Native worker suspension, живые ChatGPT/Alice/Ozon, Firefox, Opera, Yandex и Safari/macOS этим прогоном не сертифицированы.
- Ozon live pending и WB installed FAIL сохраняются. R1–R8 не открыты. Server/runtime contracts, lockfile, исходные branches и production не менялись.

Remote CI/readback и независимое скачивание CI artifact должны быть завершены до перевода D2.1 в ACCEPTED. Общий D2 остаётся IN_PROGRESS после принятия этого шага.
