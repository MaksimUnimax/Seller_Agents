# Приёмка документационного каркаса D0

Дата: 2026-09-14. Scope: Seller_Agents scaffold and documentation only.
Product implementation: NOT_IMPORTED. Live marketplace calls: NOT_RUN. Installed product tests: NOT_RUN.
Monitoring schedules: NOT_CREATED. Production deployment: NOT_STARTED.

## Состав

ТЗ с постоянными requirement IDs; UX; beta admission и админка; архитектура/данные/контракты/состояния/синхронизация;
API read-policy и browser/AI boundaries; workflow/quality/acceptance/failure ledger;
release/monitoring/capacity; exact source snapshots и migration handoff; пользовательские инструкции;
README boundaries каталогов, GitHub templates, dependency-free docs checker и docs-only CI.

## Проверки этого этапа

Проверка относительных ссылок и целевых файлов; соответствие requirements и матрицы; валидность JSON root metadata; отсутствие импортированного production-кода в каркасе.
Отдельная смысловая сверка: 36 принятых решений, latest WB installed FAIL/R1–R8 gate, один клик на пакет, часовой buffer, автономность без серверного разрешения команды, destination-only consent и лимит новых регистраций.
Автоматическая проверка не доказывает смысловую полноту сама по себе; её область указана в выводе и в QUALITY.

## Публикация

Каноническое подтверждение публикации — Git commit и проверка содержимого удалённого дерева.
Workflow Documentation CI относится только к документации. Наличие зелёной этой проверки не является server/extension test pass.
Итоговые commit/readback/CI evidence фиксируются в отчёте владельцу; при необходимости последующая квитанция ссылается на предыдущий проверенный commit, без невозможного требования включить SHA коммита в него самого.

## Ограничения

Текущие источники продолжают изменяться. Открытые внешние вопросы перечислены в OPEN_ITEMS, не скрыты под словом «полностью».
Новые API schemas, рабочие manifests, migrations/implementation, browser packages и инфраструктурные секреты здесь не создавались.
Следующий этап D1 отдельно переносит реальные компоненты и сохраняет их границы приёмки.

## Предпубликационная проверка

На подготовленном наборе выполнена та же чистая функция проверки, которая включена в docs-check.mjs: 81 файл, 75 Markdown, 179 относительных ссылок, 26 требований покрыты 32 сценариями; ошибок 0.
Эта проверка выполнена в JavaScript-среде подготовки. Запуск Node CLI и GitHub workflow проверяется отдельно после публикации; здесь ему не приписывается заранее PASS.
