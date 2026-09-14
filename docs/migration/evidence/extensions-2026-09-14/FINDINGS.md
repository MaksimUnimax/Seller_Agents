# Расхождения и ограничения перед объединением

Дата: 2026-09-14. Это результаты D1.E0: карта исходников, ограниченные воспроизведения и сопоставление с принятыми требованиями. Production-исправления не сделаны. Полная поведенческая эквивалентность двух runtime не заявляется.

## E-01. Ozon source authority обновлена

**Подтверждено:** выбран Ozon 0.1.22 `3b102f68…`, 36 production-файлов. Установочный ZIP независимо получен из Actions, размер и SHA-256 пересчитаны; все файлы побайтово совпали с Git. Источник [final package workflow](https://github.com/MaksimUnimax/blood_sand/blob/3b102f68a96bee0d7d734d7e32d4fccba440e927/.github/workflows/ozon-v0122-final-package-2026-09-14.yml), [успешный run 34817391514](https://github.com/MaksimUnimax/blood_sand/actions/runs/34817391514).

**Граница:** PRE-HANDOFF PASS не закрывает LIVE CERTIFICATION. Исторический README описывает более старый пакет и не определяет состав 0.1.22. Старые multi-AI ветки не объединяются автоматически.

**Действие:** D1.E1 импортирует выбранные байты; D2 проверяет потерю/сохранение конкретного пользовательского сценария, если требуется исторический differential.

## E-02. Вход проверки 514 операций находился вне candidate

**Подтверждено:** workflow читает `FINAL_CONTROL_SAFETY_MATRIX.jsonl` через `git show origin/main:…`. В candidate-файлах матрицы нет. Движущийся branch ref не даёт устойчивого входа для следующего запуска.

Для переноса закреплена матрица из `17aa08335ee3acdc80cc7a093ddfa462198872f5`; GitHub history указывает последнее изменение файла на `a59ea64fcec4030f4787e4cb39a70d74f9f032f3`. SHA-256: `1bc4a66bf63277558a00297b358f64f6a38cd073480ec02aa6041bcc4e0b50ce`.

**Проверено здесь:** неизменённый `run_final_514_registry_gate.mjs` на Ozon 0.1.22 и закреплённой матрице — PASS: 514 уникальных transport-операций; 299 read-capable сопоставлены, включённых mutation/retired/unmapped нет. [Вывод запуска](OZON_514_PINNED_GATE.json).

Это новый воспроизводимый вход; исходный run не публиковал отдельный hash использованного matrix blob. Не выдавать сегодняшний pin за доказанное значение входа того исторического запуска. 514 — размер контрольной матрицы, а не число разрешённых пользовательских команд.

**Действие:** fixture по exact SHA + hash, CI без чтения движущегося `origin/main`; изменения API оформлять отдельным согласованным registry diff.

## E-03. Загрузка и смешанные файлы ограничивают механическое разделение

**Подтверждено:** все 36 Ozon и 40 WB файлов входят в статический граф загрузки. Ozon использует последовательные patch wrappers после базового worker. Крупные entrypoints и `ozon_contract.js`/`provider_transport_core.js` содержат несколько ответственностей.

Из 18 одинаковых относительных имён только `shared/manual_controls.js` имеет одинаковые байты. Различие остальных файлов не доказывает отсутствие функции; даже один одинаковый файл не доказывает равенство его окружения.

**Действие:** D1 сохраняет порядок; D2 извлекает подсистему вместе с consumers, storage/messages и регрессиями. [Граф](RUNTIME_LOAD_GRAPH.json) — граф ресурсов, не полная semantic closure. Не использовать размеры popup или число capabilities как критерий готовности.

## E-04. WB установленная приёмка провалена

**Подтверждено источником и сообщением владельца:** [исходный финальный отчёт](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/progress/full_migration_2026-09-13/FINAL_REPORT.md) записал source/ZIP 1075/0 и ожидание installed test. Позже владелец сообщил FAIL popup и импорта ключей. Это актуальная оценка; сам D1.E0 не выполнял установленный тест.

Текущий [WB popup.css](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/extension/popup.css) разрешает сжатие (`max-width:100vw; min-width:0`); [Ozon popup.css](https://github.com/MaksimUnimax/blood_sand/blob/3b102f68a96bee0d7d734d7e32d4fccba440e927/tooling/llm-api-bridges/ozon-seller/dist-step7-candidate/popup.css) задаёт `min-width:500px`. Это подтверждает различие реализации, а не достаточность одного CSS-исправления.

**Действие:** WB reference остаётся вне production; восстановить полный popup/operator сценарий с Work и delivery. R1–R8 BLOCKED до установленной приёмки исправленного provider-neutral контура. Успешный повтор старых 52 suite не закрывает этот gate.

## E-05. WB технический буфер не везде ограничен одним часом

**Подтверждено кодом и воспроизведением:** [artifact_store.js](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/extension/shared/artifact_store.js) задаёт TTL по умолчанию 86 400 000 мс. В [runtime_worker.js](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/extension/shared/runtime_worker.js) хранилище создаётся без другого TTL; пути исходных и quarantine-файлов не передают `expiresAt`. В [delivery_transaction_worker.js](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/extension/shared/delivery_transaction_worker.js) generated text также использует default; отдельный retained-text путь уже имеет часовой срок. Единого ограничения нет.

[Проба неизменённого модуля](WB_RETENTION_PROBE.json) с memory backend и искусственными часами: файл доступен через 3 600 001 мс. [Воспроизводимый скрипт](probe-wb-retention.mjs) принимает путь к исходному WB runtime и проверяет hash модуля. Это модульное доказательство, без настоящего браузера или данных магазина.

**Действие D2:** часовой предел для всех копий бизнес-данных, включая повторную доставку, quarantine и recovery; чтение истёкших данных запрещено, уборка согласована с возможным сном worker. Не продлевать TTL при повторном открытии или доставке. Требования — [SPEC](../../../product/SPEC.md), [DATA_AND_SECURITY](../../../architecture/DATA_AND_SECURITY.md). Отдельно проверить исходный Ozon и итоговый общий store по тем же сценариям; текущая проба этого не доказывает.

## E-06. Старый дефект завершения IndexedDB уже исправлен в Ozon

**Подтверждено текущим кодом:** [direct_binary_file_delivery_patch.js](https://github.com/MaksimUnimax/blood_sand/blob/3b102f68a96bee0d7d734d7e32d4fccba440e927/tooling/llm-api-bridges/ozon-seller/dist-step7-candidate/shared/direct_binary_file_delivery_patch.js) и [file_delivery_port_worker.js](https://github.com/MaksimUnimax/blood_sand/blob/3b102f68a96bee0d7d734d7e32d4fccba440e927/tooling/llm-api-bridges/ozon-seller/dist-step7-candidate/shared/file_delivery_port_worker.js) ожидают `transaction.oncomplete`. Ранее найденный дефект `request.onsuccess` не переносится в список текущих неисправностей без нового воспроизведения.

**Действие:** сохранить существующие transaction-abort и attachment regressions, проверить соответствующую closure при извлечении общего storage. Не делать повторное исправление по старому аудиту.

## E-07. Исторические инструкции конфликтуют с текущим ручным пакетом

**Подтверждено:** старый Ozon `OZON_COMMAND_ENVELOPE_CONTRACT.md` запрещает смешивание HELP/API; новый start prompt и mixed-batch runtime допускают упорядоченный смешанный пакет. В WB старое правило superseding authority также расходится с более поздним C09/runtime. Эти документы перечислены с точными commits в [реестре входов](TEST_AND_AUTHORITY_INPUTS.json).

**Действующая норма:** [SPEC](../../../product/SPEC.md), [UX](../../../product/UX.md). Одна форма может содержать несколько команд; одно явное нажатие запускает пакет по порядку. Само появление следующего блока не запускает работу. После Finish прекращается ожидание/запуск и отбрасываются поздние результаты по действующей state machine; скрытие кнопки не подменяет Finish.

**Действие:** старые инструкции помечать как historical reference. Импортировать существующие файлы как baseline, затем удалить доступный пользователю авторежим без удаления общего parser/delivery механизма, который используется ручной работой. Автоматическая доставка результата уже запущенного пакета не является новым запуском команды.

## E-08. Нужны единая модель магазинов и совместимый импорт ключей

**Подтверждено кодом:** Ozon использует `ozon-bridge-credentials-backup` v2 и legacy seller-формат; WB — `wildberries-bridge-seller-credentials-backup` с версиями 1/2. Это разные текущие структуры. Файл владельца, вызвавший `INVALID_CREDENTIAL_BACKUP`, для этой проверки не предоставлен, поэтому причина именно его ошибки не установлена.

**Действие D2:** один экспорт для всех площадок/магазинов; явная проверка и миграция поддержанных старых форматов; синтетические fixtures без реальных токенов. Отделить store identity от изменяемого имени и сменяемых credentials. Два API Ozon принадлежат одной карточке магазина. Изоляция аккаунтов и перенос секретов реализуются по [SPEC](../../../product/SPEC.md), а не сменой префикса storage key. Формат файла и защита конкретизируются при реализации без добавления обязательной серверной синхронизации.

## E-09. Локальные лимиты нельзя заменить серверной очередью

**Подтверждено:** исходный Ozon содержит локальные account/token-scoped механизмы для семейств с минутным интервалом, дополнительным safety interval и cache. Это правила конкретного runtime и API-семейства, а не универсальная норма для каждого запроса или WB.

**Действие D2:** вкладки одной установки делят очередь через background и сохранённое локальное состояние; разные установки не координируют каждый запрос через сервер. На 429 отдавать структурированную причину/ограничение и retry metadata при наличии. Предположение «другая установка недавно запустила команду» обозначать как предположение; 429 сам по себе не доказывает ни сбой Ozon, ни наличие другого диалога. Не добавлять скрытый повтор запроса. Норма — [READ_POLICY](../../../integrations/READ_POLICY.md) и [SYNC](../../../architecture/SYNC.md).

## E-10. Браузерная и общая продуктовая готовность остаются открыты

Оба source manifest — MV3 с Chromium-style service worker и ChatGPT/Alice origins. Это доказательство состава исходного пакета. Поддержка Chrome, Opera, Yandex, Firefox, Safari/macOS нового продукта здесь не проверялась; WebKit/headless тест не заменяет Safari extension на Mac.

Импорт исходника не реализует новый popup, несколько магазинов, account-scoped ключи, серверный bootstrap, beta quota и редкую синхронизацию. Эти требования уже описаны; не отмечать их выполненными по наличию похожего старого механизма. Серверные компоненты и контракты в D1.E0 не изменены.
