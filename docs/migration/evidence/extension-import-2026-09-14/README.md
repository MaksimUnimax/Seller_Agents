# D1.E1 — перенос исходников расширений

Дата: 2026-09-14. Статус: **IMPORT ACCEPTED / COMPLETED**.
Основание: новое поручение владельца «Делай» после опубликованной карты D1.E0. Исходный Seller_Agents main: `75c60ee8e4186c905f207710aa6eaa504a6f34a3`.

## Что перенесено

| Источник | Commit | Результат |
|---|---|---|
| Ozon 0.1.22 | `3b102f68a96bee0d7d734d7e32d4fccba440e927` | 36 production-файлов в `apps/extension/src/imported/ozon-v0.1.22/` |
| WB 0.3.0 | `006af2724aafdf6589c16881c1ed06eb01cca281` | 40 файлов в `migration/reference/wildberries-v0.3.0/runtime/` |
| Исходные проверки, helpers и fixtures | Exact commits карты D1.E0 | 156 файлов в тестовых каталогах и один исторический workflow вне активного CI |

Итого **232 файла, 6 759 884 байта**. Каждый файл совпадает с исходным Git blob, размером и SHA-256. [IMPORT_MANIFEST](IMPORT_MANIFEST.json) содержит source → target и hashes. 20 исторических документов сохранены ссылками/хешами в карте, без копирования старых живых данных. Исходные ветки Blood & Sand не изменялись.

## Что изменено для работы в новом репозитории

Добавлены упаковщик и runner, которые читают перенесённые файлы и во временном каталоге восстанавливают нужный старый layout. Старые тесты, production globals, storage keys, permissions, manifests, wrappers и порядок загрузки не редактировались.

Создан постоянный `Extension CI` с отдельными Ozon/WB Node/WB browser jobs. Он реагирует на реальные исходники, fixtures, карты и собственные инструменты. Встроенный отрицательный контроль подтверждает, что ошибка промежуточного процесса не маскируется следующим PASS.

Текст карты D1.E0 упоминал `tests/fixtures/migration/`, а её точные JSON-пути — `tests/fixtures/imported/`. Перенос выполнен по JSON; текстовая схема приведена к этим путям. Это исправление документационной неоднозначности без изменения исходников.

Корневое правило Git `build/` также скрывало новый исходный упаковщик в `tooling/build/`. Для каталога инструментов добавлено исключение; генерируемый корневой build остаётся игнорируемым, Python bytecode исключён из Git. Проверка списка файлов коммита подтверждает наличие самого упаковщика.

Сохранены две исходные особенности форматирования WB: пробел в конце строки `shared/runtime_worker.js` и пустая строка в конце `run_browser_fixture.py`. Они подтверждены совпадением source blobs; baseline-код не форматировался ради чистого whitespace diff. Новые инструменты и документация проверяются отдельно.

Серверные пути, pnpm lockfile, root scripts и серверный CI не менялись. Существующие lint/format/bridge guard ограничены серверными каталогами; импортированный legacy JS не добавляется в их область. Новые browser tools устанавливаются в отдельную Python-среду.

## Проверки и пакеты

[LOCAL_RESULTS](LOCAL_RESULTS.json) содержит результаты предварительных локальных прогонов и команды. В предварительном локальном прогоне:

| Проверка | Локальный результат |
|---|---|
| Происхождение всех файлов | 232/232 MATCH; runtime changes 0 |
| Ozon source | 14 gate-вызовов PASS, в том числе ожидаемые RED и текущие GREEN |
| Ozon extracted ZIP | 11 обязательных gate-вызовов PASS |
| Ozon syntax / version / permissions | 33 JS-файла в каждом маршруте, версии и baseline permissions PASS |
| WB Node source / ZIP | 35 suites, 754/0 в каждом прогоне |
| WB browser source / ZIP | Локально NOT RUN; remote CI PASS, 17 suites, 321/0 на source и ZIP |
| Повторная упаковка | Два независимых ZIP каждого baseline совпали |
| Source ↔ новый ZIP | 36/36 Ozon и 40/40 WB байтов MATCH |
| Runner intermediate failure | Ожидаемый exit 7; следующий процесс не запущен — PASS |

Локальная среда: Linux x86_64, Node 24.19.0, Python 3.12.14. [Сбой локальной установки Chromium](LOCAL_BROWSER_SETUP.json) — timeout/HTTP 502 до начала browser suites. Это ограничение этого прогона, а не результат тестирования WB. Для remote fixture run фиксируется фактический Chrome/Chromium и Python Playwright в artifact.

Первая remote попытка [34828658429](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34828658429), commit `4ee9c0a96bbeeb317e66f2118c17830b4e93ce90`, завершилась до создания jobs. В новом workflow обнаружено недопустимое использование `runner.temp` в job-level env; переменная перенесена в step-level env. Допустимость контекста подтверждается [таблицей GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#context-availability). Это исправление конфигурации CI; production-код и исходные тесты не менялись. Неудачная попытка не считается product test FAIL или PASS.

| Новый baseline ZIP | Размер, bytes | SHA-256 |
|---|---:|---|
| `SELLER_AGENTS_IMPORT_ozon_0.1.22_baseline.zip` | 1517679 | `88c390792cfd2074d7837050c19a4a232f6a3698729530dae5ffedef978316f2` |
| `SELLER_AGENTS_IMPORT_wildberries_0.3.0_baseline.zip` | 722299 | `4c69d42ad55236646093921f85e54231de7854dd2ce41ad9b7f4e59cd97adafb` |

Это новые ZIP_STORED с отсортированными entries и фиксированными metadata. Их hashes не равны hashes исходных архивов. Содержимое runtime прежнее. Упаковка описана в [инструкции](../../../development/EXTENSION_BASELINE.md). ZIP хранятся в build/CI artifacts, не в Git.

## Итоговая remote приёмка

Проверенный commit: `cc8bc2aec580cfb29528f207370c93cbe04a4641`, tree: `6b6c61af1629bc622363412f865afc636d86e677`. После завершения приёмки этот commit опубликован fast-forward в `main` от `75c60ee8`; завершающая фиксация добавляет только документацию и evidence. Production, fixtures, инструменты и workflow остаются байт-в-байт теми же, что в проверенном commit.

- [Extension CI 34828849627](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34828849627): все три jobs SUCCESS.
- [Docs CI 34828849631](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34828849631): SUCCESS.
- Ozon: 14 source + 11 package gate-вызовов и 66 syntax checks, всего 91 успешно завершённый процесс проверок.
- WB: 35 Node suites / 754 PASS и 17 Python/browser suites / 321 PASS на каждом маршруте. Итого **52 suites, 1075/0 на source и 1075/0 на extracted ZIP**. Повтор не удваивает функциональное покрытие.
- Remote среда: Ubuntu 24.04, Node 24.19.0, Python 3.12.14, Python Playwright 1.62.0, Google Chrome 152.0.7977.82. Другие браузеры/ОС этим прогоном не сертифицированы.
- Скачаны все три CI artifacts, независимо пересчитаны их hashes, извлечены baseline ZIP; внутренние файлы совпали с исходными 36/40. Hash WB ZIP одинаков в Node и browser jobs.
- [REMOTE_READBACK](REMOTE_READBACK.json): все 232 файла прочитаны из полученного с GitHub commit и сверены с source blob, SHA-256 и размером. Серверный diff отсутствует.

[REMOTE_RESULTS](REMOTE_RESULTS.json) сохраняет номера jobs/artifacts, hashes, per-suite результаты и среду. CI artifacts хранятся 14 дней; закреплённые исходники, команды, результаты и package hashes остаются в Git и позволяют повторить проверку.

В browser job после успешных маршрутов Playwright напечатал диагностические сообщения при завершении соединения (`Task was destroyed but it is pending`, `TargetClosedError`). Они сохранены в отчёте: оба набора завершились с 321/0 и exit 0, assertions не отключались. Причина не объявлена установленным дефектом расширения; это остаётся замечанием к завершению тестового процесса, а не доказательством живой приёмки.

## Сохраняющиеся ограничения

- Ozon: PRE-HANDOFF PASS в источнике; **LIVE CERTIFICATION PENDING POST INSTALL**.
- WB: **INSTALLED FAIL / MIGRATION REOPENED / COMPLETENESS NOT PROVEN; R1–R8 BLOCKED**.
- Известный WB TTL 24 часа в части путей сохранён как исходное поведение; приведение к согласованному часу — отдельная работа D2.
- Полнота общего runtime, новый popup/магазины, auth нового расширения и поддержка браузеров не приняты этим переносом.
- Живые API Ozon/WB и живые ChatGPT/Alice не тестировались; используются исходные offline fixtures. Production не развёрнут, расширения в магазины браузеров не публиковались.

Приёмка D1.E1 завершена: remote CI, все 52 WB suites на source/ZIP, независимая проверка CI artifacts и точный remote readback прошли. Установленная приёмка продукта остаётся отдельной.

Следующий этап после переноса: D2 — извлечение одного общего ядра по сценариям, с сохранением проверок Ozon, отдельным WB adapter и исправлением [известных расхождений](../extensions-2026-09-14/FINDINGS.md). [План](../../EXTENSION_IMPORT_NEXT_STEP.md), [общий roadmap](../../../ROADMAP.md).
