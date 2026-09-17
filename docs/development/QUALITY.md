# Проверки и доказательства

## Уровни

| Уровень | Что доказывает | Чего не доказывает |
|---|---|---|
| Documentation check | Существование файлов, относительные ссылки, coverage IDs, границы каркаса | Корректность production runtime |
| Unit/contract | Правила и схемы в проверенных случаях | Настоящий DOM/поведение браузера |
| Runtime harness | Исполнение production-модулей в контролируемой среде | Native background lifecycle |
| Browser fixture | DOM/File/IndexedDB сценарий на заданных fixtures | Совместимость живого ИИ |
| Exact package | Проверки тех файлов, которые попали в ZIP | Установленную работоспособность |
| Installed E2E | Настоящая установка, целевой браузер/ИИ, нужный сценарий | Все остальные комбинации и будущие версии |
| Production smoke | Конкретный выпуск/среду после размещения | Полноту всей спецификации |

В D0 запускается только Documentation check. Продуктовые проверки появляются вместе с переносом реального кода.

## Обязательная политика инструментов и human-action

Каноническая политика: [TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY](architect-autowork/TOOL_CAPABILITY_AND_HUMAN_ACTION_POLICY.md).

Она обязательна для каждого текущего и будущего roadmap/test gate. До передачи владельцу build/ZIP/package должны быть выполнены ВСЕ применимые проверки, которые способны выполнить доступные программные, browser/GUI, Codex, connector, CI и repository tools. Нельзя заменять доступный автоматический тест инструкцией владельцу «нажми/открой/проверь/запусти».

Перед объявлением human-only blocker исполнитель/архитектор обязан исчерпать релевантную лестницу инструментов из канонической политики и записать точный инструмент, действие и доказанное ограничение. FAILED/SKIPPED/NOT RUN не становятся PASS из-за того, что владельцу можно предложить проверить поведение вручную.

Для любого extension handoff отдельным обязательным gate является dialogue binding: exact conversation identity → bind → persistence → reload/restart restore → correct marketplace/store context → no neighboring-dialogue binding → unbind/rebind → wrong-dialogue fail-closed → применимая parallel-dialogue isolation. Если этот путь автоматизируем в тестовой среде, он должен быть пройден до выдачи ZIP владельцу.

Рабочий цикл до handoff: собрать актуальный live DOM/page/tool evidence где нужно → составить полный bounded test list → прогнать все автоматизируемые тесты → зафиксировать реальные падения → минимальный корректный patch → повторить affected tests и полный обязательный regression set → повторять до green → только затем package/handoff.

## Постоянный CI

Один стабильный docs check на push/PR. После D1 — общие scoped jobs: типы/схемы, необходимые unit/integration, PostgreSQL+migrations, build, критический браузерный regression.
Paths workflow охватывают реальный код, shared contracts и сам workflow. Проверки не ограничиваются изменением датированного файла workflow.
Не создавать десятки workflow на каждый патч. Специальный эксперимент сохраняется как evidence, постоянный полезный сценарий добавляется в общий набор.

Runner должен возвращать ошибку при падении любого обязательного шага. Для PowerShell каждый внешний процесс проверяется, либо общий runner агрегирует exit codes корректно.
Проверить один намеренно упавший промежуточный шаг при внедрении runner; последующий PASS не маскирует FAIL.
Проверки строк кода вспомогательны. Гарантии про повторную отправку, storage rollback и concurrency проверяются поведением.

## Что важно для этого продукта

Изоляция account/store/dialogue; неизменяемый контекст пакета; no hidden API replay;
Start/Finish/unknown; реальные attachment/send proof; завершение storage transaction;
полный результат без truncation; local quota и 429; часовой expiry; signed offline grace;
квота последней регистрации; optional sync failure isolation; отсутствие ключей в серверном payload.
Полный список сценариев: [ACCEPTANCE_MATRIX](ACCEPTANCE_MATRIX.md).

## Приёмка переноса WB

Не сравнивать только имена/размеры файлов. Для каждой подсистемы: принятое donor behavior → зависимости → текущая WB реализация → расхождение → действие → behavioral evidence → installed gate.
KEEP разрешён после доказанной эквивалентности применимого поведения.
Отрицательный контроль воспроизводит реальную проблему на старых байтах; после исправления проходит тот же сценарий.
Количество test cases и unresolved=0 не заменяют installed/live evidence. Любое реально необходимое участие владельца допускается только после исчерпания автоматизируемых проверок по канонической tool/human-action policy и не может скрывать неисполненный автоматический gate.
R1–R8 закрыты до установленной provider-neutral приёмки.

## Evidence

Каждая квитанция: date, source/release commit, package hash, environment, commands/run URL, test IDs/results, skipped/not-run, observed limitations.
Секреты и клиентские данные вычищаются. Воспроизводимость не требует публиковать настоящий токен.
Final report отделяет дефект fixture, ограничение среды и доказанный дефект production.
Проверки расширяются для конкретного оставшегося риска, а не для самоподтверждения полноты.
Для browser/installed/Health evidence отдельно отмечать: реально автоматизировано и выполнено; автоматизируемо, но недоступно с точной причиной; human-only с доказанной причиной; not applicable; not run. «Capability advertised» не равен «capability exercised».
