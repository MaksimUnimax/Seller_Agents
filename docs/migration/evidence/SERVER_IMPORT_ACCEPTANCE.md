# Перенос сервера D1.S1

Status: SERVER_IMPORT_ACCEPTED — полный новый Server CI и удалённая сверка пройдены.
Source: MaksimUnimax/blood_sand, feature/product-control-plane-p8-4-h3-2026-09-14,
3f16bbf6387cc62303e292fcfe61449c8f243b92.
Source server tree: 3b2443b827fdd993fc242c830422806fdbabde1d.

## Состав и граница

Получены 512 файлов source server; каждый исходный Git blob SHA проверен.
511 файлов учтены переносом, один пустой server/.gitkeep исключён.
Отдельно адаптирован исходный Server CI. Карта source → target и хеши находятся в SERVER_IMPORT_MANIFEST.json.
Версии зависимостей, registry resolutions lockfile, DB migrations и OpenAPI сохраняются.
Изменения ограничены размещением, относительными путями, конфигурацией workspace/CI и документацией перехода.

P8.4 Foundation PASS — сообщение владельца и отдельное source evidence; не полная P8.4 acceptance.
H3 browser actions/P8.5/P8.6 не начаты. Бета, admission cap, новый доступ и объединение расширений не реализуются этим переносом.
owner_refs и recommendations отсутствуют в remote source, остаются локально у владельца и не включены в подтверждённый объём.

## Проверка

Source extraction: SHA matched 512/512; крупный OpenAPI прочитан через Git blob после обнаружения пустого ответа contents API.
New repository CI: PASS, run 34819854406 на 511ccff1a694e9caaa4d81a29346f30f876dab26.
Remote candidate publication/readback: PASS, 594 файла, совпадение Git blob SHA для каждого, расхождений 0.
Production deployment/live AI/live marketplace requests: NOT_RUN.

## Продолжение

Новый CI и удалённая сверка завершены; серверный Codex получает [поручение](../../development/SERVER_CODEX_HANDOFF.md).
Ozon/WB остаются отдельными последующими этапами переноса.

## Первый CI candidate

[f1daff90](https://github.com/MaksimUnimax/Seller_Agents/commit/f1daff90ab7694b18b84c08a778034d11b1f7dfe): import inventory/frozen boundaries, frozen install и lint PASS; format check FAIL для четырёх перемещённых файлов. Следующие stages не запускались. Documentation CI PASS. Исправляется только формат длинных новых путей и workspace YAML; этот неуспешный прогон не выдан за product PASS.

## Второй CI candidate

[afed7c04](https://github.com/MaksimUnimax/Seller_Agents/commit/afed7c047c35710415a4a14b623d9d65593c435a): formatting, typecheck и сохранённый Playwright workspace-path regression PASS. Unit stage обнаружил старое ожидание packages/db/drizzle в migrations.test.ts. Путь реальной миграции уже правильный packages/server/db/drizzle; обновлено только точное ожидаемое расположение в тесте, без изменения SQL или runtime мигратора. Остальные stages этого запуска не объявлены пройденными.

## Принятый результат

[511ccff1a694e9caaa4d81a29346f30f876dab26](https://github.com/MaksimUnimax/Seller_Agents/commit/511ccff1a694e9caaa4d81a29346f30f876dab26):
[Server CI 34819854406](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34819854406) — SUCCESS.

| Проверка | Результат |
|---|---|
| Import inventory / frozen bytes | PASS |
| Frozen install, lint, format, typecheck | PASS |
| Отдельный regression пути Playwright | 1 PASS |
| Package/app unit tests | 1272 PASS, совпадает с source baseline |
| PostgreSQL integration | 38 файлов, 1507 PASS |
| Применение SQL migrations | PASS |
| Точный OpenAPI artifact / boundary guard | PASS |
| Сборка пяти приложений | PASS |
| Browser E2E сервера | 85 PASS |
| Удалённый readback полного candidate | 594/594 Git blob SHA MATCH |

Browser E2E — серверные portal/admin/controlled H2 сценарии, а не приёмка установленного расширения или live H3.
Source CI также независимо подтверждён: [34817887681](https://github.com/MaksimUnimax/blood_sand/actions/runs/34817887681).
Схемы SQL, OpenAPI и весь исходный apps/health-runner сохранены побайтово. В production source адаптирован путь OpenAPI artifact; остальные изменения относятся к расположению модулей, тестовым путям, workspace/CI и документации.
Финальная квитанция: [SERVER_IMPORT_RECEIPT.json](SERVER_IMPORT_RECEIPT.json).

Завершающий коммит обновляет только документацию и квитанцию. Код и проверенная конфигурация остаются теми, которые прошли указанный CI. Его публикация в main и окончательная сверка подтверждаются Git history и итоговым отчётом владельцу.
