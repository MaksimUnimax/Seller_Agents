# D1.E1 — перенос исходников расширений

Дата: 2026-09-14. Статус: **IMPORT CANDIDATE / REMOTE ACCEPTANCE PENDING**.
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

[LOCAL_RESULTS](LOCAL_RESULTS.json) содержит результаты предварительных локальных прогонов и команды. На этом candidate:

| Проверка | Локальный результат |
|---|---|
| Происхождение всех файлов | 232/232 MATCH; runtime changes 0 |
| Ozon source | 14 gate-вызовов PASS, в том числе ожидаемые RED и текущие GREEN |
| Ozon extracted ZIP | 11 обязательных gate-вызовов PASS |
| Ozon syntax / version / permissions | 33 JS-файла в каждом маршруте, версии и baseline permissions PASS |
| WB Node source / ZIP | 35 suites, 754/0 в каждом прогоне |
| WB browser source / ZIP | Локально NOT RUN; установка Chromium не завершилась, remote CI ожидается |
| Повторная упаковка | Два независимых ZIP каждого baseline совпали |
| Source ↔ новый ZIP | 36/36 Ozon и 40/40 WB байтов MATCH |
| Runner intermediate failure | Ожидаемый exit 7; следующий процесс не запущен — PASS |

Локальная среда: Linux x86_64, Node 24.19.0, Python 3.12.14. [Сбой локальной установки Chromium](LOCAL_BROWSER_SETUP.json) — timeout/HTTP 502 до начала browser suites. Это ограничение этого прогона, а не результат тестирования WB. Для remote fixture run фиксируется фактический Chrome/Chromium и Python Playwright в artifact.

| Новый baseline ZIP | Размер, bytes | SHA-256 |
|---|---:|---|
| `SELLER_AGENTS_IMPORT_ozon_0.1.22_baseline.zip` | 1517679 | `88c390792cfd2074d7837050c19a4a232f6a3698729530dae5ffedef978316f2` |
| `SELLER_AGENTS_IMPORT_wildberries_0.3.0_baseline.zip` | 722299 | `4c69d42ad55236646093921f85e54231de7854dd2ce41ad9b7f4e59cd97adafb` |

Это новые ZIP_STORED с отсортированными entries и фиксированными metadata. Их hashes не равны hashes исходных архивов. Содержимое runtime прежнее. Упаковка описана в [инструкции](../../../development/EXTENSION_BASELINE.md). ZIP хранятся в build/CI artifacts, не в Git.

## Сохраняющиеся ограничения

- Ozon: PRE-HANDOFF PASS в источнике; **LIVE CERTIFICATION PENDING POST INSTALL**.
- WB: **INSTALLED FAIL / MIGRATION REOPENED / COMPLETENESS NOT PROVEN; R1–R8 BLOCKED**.
- Известный WB TTL 24 часа в части путей сохранён как исходное поведение; приведение к согласованному часу — отдельная работа D2.
- Полнота общего runtime, новый popup/магазины, auth нового расширения и поддержка браузеров не приняты этим переносом.
- Живые API Ozon/WB и живые ChatGPT/Alice не тестировались; используются исходные offline fixtures. Production не развёрнут, расширения в магазины браузеров не публиковались.

Приёмка D1.E1 требует успешного remote CI, всех 52 WB suites на source/ZIP и точного remote readback. Только после этого статус кандидата меняется на IMPORT ACCEPTED. Установленная приёмка продукта остаётся отдельной.

Следующий этап после переноса: D2 — извлечение одного общего ядра по сценариям, с сохранением проверок Ozon, отдельным WB adapter и исправлением [известных расхождений](../extensions-2026-09-14/FINDINGS.md). [План](../../EXTENSION_IMPORT_NEXT_STEP.md), [общий roadmap](../../../ROADMAP.md).
