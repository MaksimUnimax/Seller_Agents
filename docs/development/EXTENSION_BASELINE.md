# Разработка после переноса расширений

Точка входа D1.E1: импортированные исходники, сохранённые тесты и воспроизводимые baseline-пакеты. Объединение в один продукт относится к D2. Актуальные результаты — [квитанция переноса](../migration/evidence/extension-import-2026-09-14/README.md).

## Где код и что можно считать готовым

| Путь | Назначение |
|---|---|
| `apps/extension/src/imported/ozon-v0.1.22/` | Неизменённые 36 production-файлов Ozon |
| `migration/reference/wildberries-v0.3.0/runtime/` | Неизменённые 40 WB-файлов для сверки; INSTALLED FAIL сохраняется |
| `tests/regression/imported/` | Исходные проверки Ozon и 52 WB suite, helpers и метаданные |
| `tests/fixtures/imported/` | Закреплённые donor, negative baseline, permissions и 514 matrix |
| `tooling/build/extension_baseline.py` | Проверка состава и байтов, временный тестовый layout, упаковка |
| `tooling/checks/extension_import.py` | Запуск исходного и пакетного маршрутов; остановка по ошибке |
| `.github/workflows/extension-ci.yml` | Постоянный scoped CI: Ozon, WB Node, WB browser fixtures |

Точные 232 перенесённых файла перечислены в [IMPORT_MANIFEST](../migration/evidence/extension-import-2026-09-14/IMPORT_MANIFEST.json). Контрольный manifest связан с картой D1.E0, а не создаётся из произвольного текущего содержимого каталога. Изменение baseline-кода требует отдельного решения и новой проверки; нельзя просто пересчитать ожидаемые hashes после ошибки.

Матрица операций читается из закреплённого локального fixture. Старый donor WB служит входом восьми differential suites; он не становится второй Ozon-версией продукта. Ozon RED fixture предназначен для проверок, которые должны распознать старый дефект.

## Команды

Требуются Node 24 и Python 3.12. Этот этап не требует установки серверного pnpm workspace или запуска PostgreSQL. CI использует Node 24.19.0 и Python 3.12.14.

Из корня репозитория, каждый раз в новый каталог результатов:

```sh
python3 tooling/checks/extension_import.py --suite ozon --output build/extension-ozon-run
python3 tooling/checks/extension_import.py --suite wb-nodes --output build/extension-wb-node-run
```

Для браузерных fixtures установить отдельную Python-среду и зависимости из `tooling/checks/extension-test-requirements.txt`. Они не меняют серверный lockfile:

```sh
python3 -m venv build/extension-venv
build/extension-venv/bin/python -m pip install -r tooling/checks/extension-test-requirements.txt
build/extension-venv/bin/python -m playwright install chromium
build/extension-venv/bin/python tooling/checks/extension_import.py --suite wb-browsers --output build/extension-wb-browser-run
```

Это команды для Linux/macOS; в Windows Python среды находится в `build/extension-venv/Scripts/python.exe`. Каждый вызов возвращает ненулевой exit code при ошибке; Windows-обёртка обязана проверить его до следующей команды.

`WB_TEST_CHROMIUM` позволяет передать абсолютный путь к уже установленному Chrome/Chromium. CI использует Chrome runner-а, если он присутствует; иначе устанавливает Chromium Playwright. Реальная версия записывается в `browser-environment.json`. Это контролируемые browser fixtures, не сертификат поддержки конкретного браузера/ОС и не проверка живого ChatGPT/Alice. Выборочный `CASE`/`WB_TEST_CASE` сбрасывается общим runner-ом.

Для полного набора есть `--suite all`; для проверки происхождения и упаковки без поведенческих suites — `--suite verify`. `summary.json`, `gates.json`, stdout и per-suite результаты сохраняются даже при провале. Каталог результата должен быть новым, чтобы два разных прогона не смешались.

## Что именно выполняется

- Ozon: 14 исходных и 11 пакетных gate-вызовов по финальному workflow, включая RED→GREEN, dependency closure, shared consumers, 514 matrix, даты, file lifecycle, predispatch и full worker. Отдельно — синтаксис 33 JS-файлов в каждом маршруте, версии и permissions.
- WB: исходные 35 Node suite и 17 Python/browser suite, затем те же наборы на распакованных байтах. Исходные assertions и helpers не редактируются.
- Перед ними проверяется ошибочный промежуточный шаг runner-а: следующий шаг не должен выполниться. Ожидаемый exit 7 учитывается как успешный отрицательный контроль, не как скрытая ошибка product gate.
- Дополнительные шесть Ozon IDB/attachment/XLSX регрессий сохранены для извлечения подсистем D2; они не входят в автоматически заявляемый финальный маршрут 0.1.22. При затрагивании подсистемы выбрать их по карте и выполнить явно.

Не суммировать повтор source/ZIP как новое функциональное покрытие. Зелёные исторические WB suites не отменяют установленный FAIL.

## Упаковка

```sh
python3 tooling/build/extension_baseline.py ozon --output build/ozon-baseline
python3 tooling/build/extension_baseline.py wildberries --output build/wb-baseline
```

Упаковщик использует точный список файлов, сортировку, фиксированные metadata и ZIP_STORED. Две сборки должны совпасть целиком; после распаковки сравнивается каждый source hash. Поэтому новые baseline ZIP крупнее сжатого исходного Ozon ZIP и имеют собственные hashes. Байты внутри прежние. Новый hash нельзя выдавать за исходный `a3130816…`.

Внутрь ZIP не входят тесты, fixtures, документация, сервер, ключи и другой marketplace runtime. Пакеты называются `SELLER_AGENTS_IMPORT_*_baseline.zip` и пока не являются единым Seller Agents. Они сохраняются в CI artifacts, а не в Git. WB baseline предназначен для анализа/регрессии и не объявляется исправленной пользовательской сборкой.

## Следующая реализация

D2 извлекает общее ядро по вертикальным сценариям и сохраняет применимые тесты. Baseline CI сам по себе не проверяет будущий новый код: в момент его добавления обязательны новые сценарии на реально собираемом общем расширении. Исходные снимки удаляются из рабочего дерева после принятой замены; fixtures остаются только при наличии нуждающегося в них теста.

Текущие расхождения: [FINDINGS](../migration/evidence/extensions-2026-09-14/FINDINGS.md). Сервер продолжает отдельный исполнитель; его команды уже ограничены серверными путями и не подхватывают legacy JS нового импорта.
