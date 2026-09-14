# Перенос сервера D1.S1

Status: CANDIDATE_PREPARED — новые проверки Seller Agents ещё ожидаются.
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
New repository CI: PENDING.
Remote publication/readback: PENDING.
Production deployment/live AI/live marketplace requests: NOT_RUN.

## Продолжение

После успешного нового CI и удалённой сверки — SERVER_IMPORT_ACCEPTED, серверный Codex получает [поручение](../../development/SERVER_CODEX_HANDOFF.md).
Ozon/WB остаются отдельными последующими этапами переноса.

## Первый CI candidate

[f1daff90](https://github.com/MaksimUnimax/Seller_Agents/commit/f1daff90ab7694b18b84c08a778034d11b1f7dfe): import inventory/frozen boundaries, frozen install и lint PASS; format check FAIL для четырёх перемещённых файлов. Следующие stages не запускались. Documentation CI PASS. Исправляется только формат длинных новых путей и workspace YAML; этот неуспешный прогон не выдан за product PASS.

## Второй CI candidate

[afed7c04](https://github.com/MaksimUnimax/Seller_Agents/commit/afed7c047c35710415a4a14b623d9d65593c435a): formatting, typecheck и сохранённый Playwright workspace-path regression PASS. Unit stage обнаружил старое ожидание packages/db/drizzle в migrations.test.ts. Путь реальной миграции уже правильный packages/server/db/drizzle; обновлено только точное ожидаемое расположение в тесте, без изменения SQL или runtime мигратора. Остальные stages этого запуска не объявлены пройденными.
