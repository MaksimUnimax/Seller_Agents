# D2.1 — выделение первых общих модулей

Дата: 2026-09-14. Статус: **ACCEPTED — SOURCE / PACKAGE / REMOTE READBACK PASS**.
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

## Remote core и точный пакет

[Common core CI](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34832750570/job/103939635078) завершён SUCCESS на `45f7d4efe46be3a4a903ea3c5c17d1aa88d3a3f5`, tree `06709890d75177e04ac056d43c308382204c7c4b`. На GitHub повторены все 99 процессов; итоговые inputs/files/package receipt совпали с локальными.

Пакет: `SELLER_AGENTS_D2_1_v0.2.0_DEVELOPMENT.zip`, **1526076 bytes**, SHA-256 `877b965c5daeda22aab03ede1c5253c3d9399239aeee54475804c90dbf190983`.
Artifact ID: `10342980900`; внешняя оболочка Actions имеет отдельный SHA-256 `6c35dd0108afff89fcfa5fb7c1d8f5d7f9a191e33927f22b0012dd41927b2880`.

[REMOTE_RESULTS](REMOTE_RESULTS.json) содержит результаты job, команды, negative control, состав и hashes. Artifact скачан независимо, его внешний hash и внутренний пакет пересчитаны; все 36 runtime entries совпали с receipt. [REMOTE_READBACK](REMOTE_READBACK.json) связывает 35 изменённых Git-файлов и 50 production inputs с проверенным commit; core-модули входят в пакет, а не остаются неиспользованными файлами. Все четыре common-core source перечислены среди реальных inputs.

[Полный Extension CI](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34832750570) завершён SUCCESS: Common core и все три Ozon/WB baseline jobs. Полный D2 и installed acceptance остаются открытыми даже после их PASS. CI artifacts сохраняются 14 дней; исходники, команды, hashes и результаты остаются в Git.

## Границы

- Новые common modules не делают сетевых запросов и не вводят обязательных обращений к серверу.
- WB prefixes/ports проверены синтетическим contract case, настоящий WB adapter ещё не подключён к этому worker.
- Store/account/credential context новой общей модели, новый popup, удаление legacy autorun, унификация часового TTL и серверная интеграция ещё впереди.
- Функции legacy autorun в модели сохранены только как совместимость существующих consumers; это не целевой пользовательский интерфейс.
- Browser messaging/storage/network в новых worker tests имитируются. Native worker suspension, живые ChatGPT/Alice/Ozon, Firefox, Opera, Yandex и Safari/macOS этим прогоном не сертифицированы.
- Ozon live pending и WB installed FAIL сохраняются. R1–R8 не открыты. Server/runtime contracts, lockfile, исходные branches и production не менялись.

D2.1 принят после remote CI, readback и независимой проверки скачанного artifact. Завершающая фиксация добавляет только документацию/evidence к проверенному commit; 50 production inputs и исполняемые проверки не меняются. Общий D2 остаётся IN_PROGRESS. Следующая работа — оркестрация с неизменяемым контекстом магазина/аккаунта и подключение WB adapter к тому же ядру.
