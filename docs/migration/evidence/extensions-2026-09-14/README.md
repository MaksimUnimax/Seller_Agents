# Квитанция D1.E0 — карта исходников расширений

Дата: 2026-09-14. Результат: **SOURCE MAP COMPLETE; RUNTIME IMPORT NOT STARTED**.

Исходная точка Seller_Agents: `2cd57ba250a2d7ff1226a73ee058a1a31be744d4`, завершённый перенос сервера. В этой работе изменены документация и свидетельства проверки карты. Сервер, production-код расширений, исходные ветки и развёртывание не изменялись.

## Ozon 0.1.22

- Репозиторий: `MaksimUnimax/blood_sand`.
- Ветка: `repair/ozon-v0.1.22-live-defects-2026-09-14`.
- Commit: `3b102f68a96bee0d7d734d7e32d4fccba440e927`.
- Tree: `5d3b0af584d09d350357953f2df7d930bfcaad36`.
- Production root: `tooling/llm-api-bridges/ozon-seller/dist-step7-candidate/`.
- Source: 36 файлов, 1 512 883 байта без ZIP-сжатия.
- Установочный ZIP: `OZON_BRIDGE_v0.1.22_LIVE_DEFECT_REPAIR_3b102f68a96b.zip`.
- ZIP: **285804 bytes**, SHA-256 **`a31308169278316aefb36b18c94f6d1597060344c5227afb380aca2f5741a895`**.
- [Actions run 34817391514](https://github.com/MaksimUnimax/blood_sand/actions/runs/34817391514), job `103890901259`: success, exact candidate SHA.
- Actions artifact `10336772626`: внешний контейнер 552401 bytes. Его hash/размер не являются hash/размером установочного ZIP.

Внешний artifact скачан; устанавливаемый ZIP извлечён и пересчитан независимо. Перечень файлов, каждый исходный Git blob SHA и распакованные байты ZIP совпали. Это повторная проверка происхождения пакета; полные исторические gates здесь заново не запускались.

Текущий статус источника: PRE-HANDOFF PASS; **LIVE CERTIFICATION = PENDING POST INSTALL**. В исходном package-cycle заявлено `live_provider_calls=0`.

## Wildberries 0.3.0

- Репозиторий: `MaksimUnimax/blood_sand`.
- Ветка: `stage06-wb-terminal-2026-09-08`.
- Commit: `006af2724aafdf6589c16881c1ed06eb01cca281`.
- Production root: `tooling/llm-api-bridges/wildberries/extension/`.
- Source: 40 файлов, 717275 bytes без ZIP-сжатия.
- ZIP в source Git: `tooling/llm-api-bridges/wildberries/progress/full_migration_2026-09-13/release_0_3_0/wildberries-bridge-v0.3.0-integrated-migration.zip`.
- ZIP: **722299 bytes**, SHA-256 **`218364999bba9739052c7183baedfa917157fcddd713a07229615226fb4d0793`**.

ZIP прочитан из точного source Git, hash и все 40 файлов независимо сверены с production root. Исторический проход исходника и ZIP: 52 suite, 1075/0 в каждом; этот набор в D1.E0 заново не выполнялся.

Текущий статус по более позднему сообщению владельца: **INSTALLED FAIL / SHARED MIGRATION REOPENED / COMPLETENESS NOT PROVEN; R1–R8 BLOCKED**. Сохранение ZIP и тестов этот статус не меняет.

## Входы проверок

| Группа | Число записей | Значение |
|---|---:|---|
| Ozon final gates | 10 | Верхнеуровневые gate-файлы выбранного workflow |
| Ozon transitive inputs | 5 | Вызываемые gates и читаемый исходный test input |
| Protected regressions | 6 | IDB/attachment/XLSX для будущего извлечения подсистем |
| Workflow reference | 1 | Источник маршрута проверок, не готовый workflow для слепого копирования |
| WB suites | 52 | Исходный набор финального прохода |
| WB helpers / fixtures / metadata | 14 | 7 helpers, 5 fixtures, 2 metadata-файла |
| Исторический WB donor | 32 | Ozon `e01b051c2f4e0a3baed37f19762111cad9f79bac`; только differential fixture |
| Ozon negative runtime | 34 | `309da4714fe39216c2e3b7d2ff59295160bb3a98`; только ожидаемо красный fixture |
| Permission baseline | 1 | Manifest `0aa8f53528e304a91530f663060445e85e2af60b` |
| Матрица 514 | 1 | Exact input `17aa08335ee3acdc80cc7a093ddfa462198872f5` |
| Source authorities | 20 | Ссылки/хеши исторических документов; не bulk import |
| **Всего** | **176** | Записи входов, не число выполненных тестов |

Для каждого входа [TEST_AND_AUTHORITY_INPUTS](TEST_AND_AUTHORITY_INPUTS.json) хранит exact source commit/path/blob и будущую роль. Исторические fixtures не являются дополнительными текущими версиями Ozon для объединения.

## Выполнено в D1.E0

| Проверка | Результат и предел |
|---|---|
| Source ↔ ZIP | 76/76 файлов MATCH; оба размера и SHA-256 пересчитаны |
| Статическая загрузка | Ozon 46 связей / 36 достижимых файлов; WB 54 / 40; незаявленных ссылок в проверенном графе нет |
| Входы тестов | Все 176 записей сопоставлены с существующими blobs точных исходных commits; это не запуск 176 тестов |
| Закреплённая 514 matrix | Исходный gate PASS на выбранных Ozon-байтах; [stdout](OZON_514_PINNED_GATE.json) |
| WB retention | [Probe](WB_RETENTION_PROBE.json) подтверждает 24-часовой default и успешное чтение после часа; это выявленное расхождение с ТЗ |
| Документация | Проверка относительных ссылок/структуры и согласованности карты; remote CI связывается с опубликованным commit |

Версии среды ограниченных локальных проверок и результаты контроля карты: [MAP_VALIDATION.json](MAP_VALIDATION.json). Штатная проверка документации: `node tooling/checks/docs-check.mjs` из корня Seller_Agents. Она не выполняет product tests.

## Не выполнено и не заявляется

Runtime import, новое общее ядро, production fixes, installed UI tests, live Ozon/WB calls, полный повтор package suites, браузерная сертификация, подключение к серверу, публикация расширений и deployment. Число marketplace-запросов в D1.E0: **0**.

Продолжение: [карта](../../EXTENSION_IMPORT_MAP.md), [D1.E1](../../EXTENSION_IMPORT_NEXT_STEP.md), [выявленные расхождения](FINDINGS.md).
