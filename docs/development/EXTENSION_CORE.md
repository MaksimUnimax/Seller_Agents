# Общие модули расширения: D2.1

D2 открыт поручением владельца после принятого переноса D1. Первый законченный шаг — извлечение проверенных общих алгоритмов и подключение их в собираемый Ozon-контур. Это development-сборка 0.2.0, не готовая общая бета Ozon/WB. Результаты: [квитанция](../migration/evidence/extension-core-d2-1-2026-09-14/README.md).

## Зачем выделяем по частям

В исходном Ozon worker функции исполняются вместе с поздними Swagger, XLSX и delivery wrappers. Их порядок и динамическое чтение зависимостей должны сохраниться. Поэтому первый шаг переносит законченные алгоритмы за узкие интерфейсы; остальная оркестрация временно остаётся в проверенном worker. Это не переписывание Ozon или восстановление старой WB реализации с нуля.

| Модуль | Источник и текущая ответственность | Что остаётся снаружи |
|---|---|---|
| `bridge-core/src/work/session-model.js` | Work state/revision, допустимые переходы из Ozon work_session_model | Стартовый промпт, binding/storage/messages и generation-проверки worker |
| `bridge-core/src/protocol/mixed-discovery.js` | Порядок HELP/API envelopes, строки/вложенный JSON, локальные ошибки | Маркеры, валидатор команд и HELP конкретной площадки |
| `bridge-core/src/execution/local-operations.js` | Single-flight и последовательная запись общей карты manual operations | Browser storage, namespace, разрешения и сам provider request |
| `bridge-core/src/delivery/model.js` | Claim/commit/insert/unknown/recovery из зрелой модели | Выбор файлов и представления через три provider ports |
| `marketplaces/ozon/src/delivery-plan.js` | Ozon result marker, допустимый file ref, оригинальные файлы и текстовый attachment | Хранилище и фактическая загрузка/Send в ИИ |
| `marketplaces/ozon/src/mixed-discovery.js` | Совместимые Ozon prefixes/defaults и parser injection | Общий алгоритм обхода envelopes |
| `apps/extension/src/background/compat` | Старые имена и worker function adapters | Самостоятельная вторая реализация алгоритмов |

Общее ядро не импортирует Ozon/WB, browser API, DOM или сервер. Ключи и ответы не появляются в новых межкомпонентных сообщениях. Ports принимаются при создании модели; отсутствующий обязательный port означает отказ при создании, а не выбор Ozon по умолчанию. Getter capability сохраняет видимость исправлений, загруженных после базовой модели.

## Сборка

```sh
python3 tooling/build/extension_composed.py --output build/core-development
python3 tooling/checks/extension_core.py --output build/core-verification
```

Нужны те же Node 24 и Python 3.12, что при переносе. Сборка не устанавливает серверные зависимости. Каждый каталог результата новый.

[composition.json](../../apps/extension/composition.json) определяет исходный baseline, состав generated bundles и четыре заменяемые функции worker. Перед заменой каждого фрагмента проверяется SHA-256 исходной функции. Manifest D1 по-прежнему проверяет все 232 неизменённых imported файла; он не пересчитывается под новый код.

Сборщик создаёт 36 production-файлов, соединяя core, Ozon adapter и compatibility entry в прежних точках загрузки. Остальные entrypoints берутся из закреплённого источника. В generated worker четыре функции делегируют ядру; новая очередь manual records занимает прежнюю область сериализации всей карты. Отдельная очередь на каждый диалог была бы ошибкой: два read/modify/write могли бы стереть изменения друг друга.

Это временная сборочная граница D2.1. Generated файлы не редактируются и не коммитятся. В `composition-receipt.json` перечислены hashes всех inputs и конечных файлов. Две независимые сборки совпадают, распакованные bytes повторно проверяются. Пакет имеет отдельные имя и версию 0.2.0; исходный Ozon 0.1.22 не переименовывается задним числом.

Legacy global names в скомпонованных файлах сохраняют текущих consumers. В новых исходниках есть один алгоритм; compatibility entries только связывают его с текущим приложением. Когда соответствующая область worker будет полностью перенесена, временная замена фрагментов удаляется вместе с adapter-функциями этой области.

## Постоянные проверки

В существующий Extension CI добавлен job Common core / source and package. Он исполняет:

1. D1 source identity и отрицательный контроль runner.
2. Детерминированную сборку и независимую распаковку.
3. Прежние Ozon source/package routes на новой реальной сборке; baseline-default runner остаётся 0.1.22, composed route явно требует 0.2.0. Assertions исходных тестов не изменены.
4. Девять групп проверок общих модулей, donor differential и отсутствия неявной площадки.
5. Шесть сценариев полного worker: Start → смешанный ручной пакет → доставка → Finish; двойной клик/отмена хвоста; restart во время запроса; insertion UNKNOWN; 429 без retry; неизвестный Start без второго Send.
6. Сохранённые regression транзакционного abort и direct binary attachment на source и ZIP.

Новые сценарии относятся к SA-WORK-01/03, SA-CMD-01/02/03 и части SA-DATA-01/02; проверяют применимую часть A04/A06–A12. Глобальные сценарии матрицы не получают installed PASS. Полный worker здесь работает с контролируемыми browser messages/storage/network. DOM, настоящая установка и живые ChatGPT/Alice не проверены этим job.

Старый WB route остаётся отдельной проверкой неизменённого reference. Совместимость чистого ядра с явно переданными WB prefixes/ports проверяется синтетическим контрактом; это не подключённый WB adapter и не разрешение R1–R8.

## Следующие части D2

1. Выделить оркестрацию Work/ручного пакета из оставшегося worker, вводя неизменяемый account/store/binding/credential context и проверку после await. Не начинать с копирования всего worker для WB.
2. Подключить WB marketplace adapter к тому же ядру, сохранив его host/schema/read-only policy. Сравнить применимое поведение с mature Ozon, восстановить неполные подсистемы.
3. Реализовать единую карточку магазина, два Ozon API, переключатель и новый Start при смене. Удалить пользовательскую автоработу; общие delivery primitives при этом сохраняются.
4. Объединить техническое хранилище с единым часовым TTL и сценариями ошибок/пробуждения. Legacy TTL не объявляется уже исправленным.
5. Ранний I1 с настоящим серверным auth/bootstrap по согласованной wire-схеме. Серверные пакеты не меняются этим шагом.

Исходные снимки удаляются только после принятой замены их consumers и переносимых проверок. Installed WB FAIL, Ozon live pending, браузерная матрица и общий D2 остаются открытыми.
