# Изменения

## 2026-09-14 — документационный каркас

- Описаны единое расширение, сервер, сайт, админка и мониторинг.
- Зафиксированы магазины, ручные пакеты, завершение, часовой буфер и автономная работа.
- Определено редкое согласование установок без серверных разрешений на каждый запрос.
- Добавлена бесплатная бета с управляемым пределом регистраций.
- Статус WB исправлен в текущем учёте: INSTALLED FAIL, migration REOPENED; R1–R8 заблокированы.
- Разделены перенос, объединение, параллельная серверная разработка и выпуск.
- Production-код, сборки и развёртывание не входят в эту ревизию.

## 2026-09-14 — D1.S1 server import candidate

- Импорт замороженного server P8.4 Foundation, 3f16bbf.
- Новая структура, workspace paths и Server CI; без продолжения H3/P8.5/P8.6.
- Source mapping, проверка Git blob SHA и поручение серверному Codex.

## 2026-09-14 — D1.S1 server import accepted

- Новый Server CI PASS: 1272 unit, 1507 PostgreSQL integration, 85 browser E2E и отдельный regression пути Playwright.
- Подтверждено совпадение 594 файлов candidate с подготовленным деревом.
- Подготовлен handoff серверному Codex; расширения и дальнейшие H3/P8.5/P8.6 не начаты.

## 2026-09-14 — D1.E0 extension source map

- Ozon source authority обновлена на 0.1.22, 3b102f68; WB 0.3.0, 006af272, сохраняет INSTALLED FAIL.
- Независимо сверены оба ZIP, 76 исходных файлов и 100 связей загрузки; составлена карта D1/D2 и 176 входов проверок/исторических документов.
- Закреплён внешний input 514 matrix; его gate пройден на текущем Ozon. Проба WB подтверждает неединообразный TTL с 24-часовым default.
- Подготовлен отдельный D1.E1 import с сохранением исходных тестов и границами D2; production-код и сервер не изменены.

## 2026-09-14 — D1.E1 extension import candidate

- Перенесены 232 точных файла: Ozon 0.1.22, WB 0.3.0 reference, тесты и закреплённые inputs; runtime-байты не изменены.
- Добавлены независимые от сервера сборка и scoped Extension CI, исходные и распакованные package routes, контроль ошибки промежуточного шага.
- Упаковка baseline воспроизводима; новый ZIP_STORED имеет собственные hashes. Текущие результаты и ограничения сохранены в квитанции D1.E1.

## 2026-09-14 — D1.E1 extension import accepted

- Remote CI на cc8bc2a: Ozon source/extracted-package PASS; 52 WB suites, 1075/0 на каждом маршруте.
- Все три CI artifacts скачаны и независимо сверены; 232 Git-файла совпали с закреплёнными sources.
- Добавлены REMOTE_RESULTS и REMOTE_READBACK; D1 завершён, D2 ещё не начат.
- Зафиксированы неудачная первая конфигурация CI и диагностические сообщения Playwright teardown; исходный runtime и assertions не изменены.
- Ozon LIVE CERTIFICATION PENDING, WB INSTALLED FAIL и R1–R8 BLOCKED сохраняются. Сервер не менялся.

## 2026-09-14 — D2.1 common-core candidate

- Выделены Work/discovery/local execution/delivery-модули и Ozon protocol/file policy adapters.
- Общие алгоритмы подключены в реальную development-сборку 0.2.0; импортированные baseline-файлы не изменены.
- Добавлены 15 групп contract/worker сценариев, source/extracted-package маршруты и отдельный job существующего Extension CI.
- Локально 99 процессов PASS; remote приёмка ожидается. Общий D2, установленная приёмка и WB adapter остаются открыты.

## 2026-09-14 — D2.1 common-core accepted

- Полный Extension CI на 45f7d4e завершён SUCCESS: новый core job и три сохранённых baseline jobs.
- 99 процессов composed source/ZIP проверки PASS; 15 новых групп module/worker сценариев, прежние Ozon gates, transaction-abort и direct-binary attachment.
- CI artifact независимо скачан; 36 файлов пакета и 50 production inputs сверены с локальной сборкой и Git.
- D2.1 принят; общий D2, WB adapter, многомагазинность, общий popup и installed acceptance остаются открытыми.

## 2026-09-14 — D2.2 batch context candidate

- Воспроизведена отправка хвоста пакета под новыми ключами на D2.1.
- Общая очередь, безопасный snapshot и guard на асинхронных границах, до fetch и delivery; блокировка legacy pending API без context.
- Сохранены Ozon policy/cache/quota/delivery wrappers; Performance bearer ограничен теми же credentials.
- Добавлены 12 behavioral context-сценариев; пакет development 0.2.1. Remote acceptance pending.
