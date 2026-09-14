# Источники и наблюдённые ревизии

## Активные источники D1

| Часть | Выбранная ветка источника | Точный source commit | Состояние переноса |
|---|---|---|---|
| Ozon 0.1.22 | `repair/ozon-v0.1.22-live-defects-2026-09-14` | `3b102f68a96bee0d7d734d7e32d4fccba440e927` | D1.E1: baseline перенесён; приёмка ожидается |
| WB 0.3.0 | `stage06-wb-terminal-2026-09-08` | `006af2724aafdf6589c16881c1ed06eb01cca281` | D1.E1: reference перенесён; INSTALLED FAIL сохраняется |
| Сервер P8.4 Foundation | `feature/product-control-plane-p8-4-h3-2026-09-14` | `3f16bbf6387cc62303e292fcfe61449c8f243b92` | D1.S1 импортирован и проверен в Seller_Agents |

Ozon предоставлен владельцем как актуальный 0.1.22, PRE-HANDOFF PASS; LIVE CERTIFICATION PENDING POST INSTALL. Source branch и run сверены, устанавливаемый ZIP независимо скачан: 285804 bytes, SHA-256 `a31308169278316aefb36b18c94f6d1597060344c5227afb380aca2f5741a895`, 36 файлов. [Source runtime](https://github.com/MaksimUnimax/blood_sand/tree/3b102f68a96bee0d7d734d7e32d4fccba440e927/tooling/llm-api-bridges/ozon-seller/dist-step7-candidate), [финальный run](https://github.com/MaksimUnimax/blood_sand/actions/runs/34817391514).

WB ZIP прочитан из Git: 722299 bytes, SHA-256 `218364999bba9739052c7183baedfa917157fcddd713a07229615226fb4d0793`, 40 файлов. Для обоих пакетов все source/ZIP байты совпали. Полная [квитанция D1.E0](evidence/extensions-2026-09-14/README.md), [карта файлов и проверок](EXTENSION_IMPORT_MAP.md).

Внешние проверочные inputs отдельно закреплены в [TEST_AND_AUTHORITY_INPUTS](evidence/extensions-2026-09-14/TEST_AND_AUTHORITY_INPUTS.json): старый WB donor `e01b051c…`, Ozon RED `309da471…`, permission manifest `0aa8f535…`, matrix 514 `17aa0833…`. Это test fixtures, не дополнительные runtime для production или указание объединять старые ветки.

Этот pin использован в D1.E1; [фактические файлы и проверка](evidence/extension-import-2026-09-14/README.md). Если владелец примет новый Ozon/WB до импорта, сравнить изменения и обновить карту; не брать иной HEAD молча. Сервер после D1.S1 развивается в Seller_Agents отдельным исполнителем, его исходная branch больше не является точкой для повторного переноса.

## История D0 и замены серверного источника

**Активная точка перенесённого сервера D1.S1: feature/product-control-plane-p8-4-h3-2026-09-14 @ 3f16bbf6387cc62303e292fcfe61449c8f243b92. Старые снимки D0 ниже сохранены как история.**

Проверено через GitHub 2026-09-14. Репозиторий источников: MaksimUnimax/blood_sand.
Это наблюдённые snapshots для D0. Перед D1 обязательно получить свежие HEAD, authority и exact artifact; продолжающуюся работу владельца эти значения не замораживают.

| Часть | Ветка | Наблюдённый HEAD |
|---|---|---|
| Ozon runtime 0.1.21 | repair/ozon-swagger-read-surface-v3-live-runtime-2026-09-13 | 35991e73fe861da5f7eb27c598d2c0397062a50b |
| Wildberries | stage06-wb-terminal-2026-09-08 | 006af2724aafdf6589c16881c1ed06eb01cca281 |
| Сервер | feature/product-control-plane-server-2026-09-04 | b01b879ce61bad6b093688f982f1b82503885636 |

## Ozon

[Наблюдённая ревизия](https://github.com/MaksimUnimax/blood_sand/tree/35991e73fe861da5f7eb27c598d2c0397062a50b/tooling/llm-api-bridges/ozon-seller).
Каноническую исполняемую папку/список файлов сверить по свежему release authority на D1; не выбирать donor по слову dist/latest или дате имени файла.
[Исторический Swagger control](https://github.com/MaksimUnimax/blood_sand/blob/17aa08335ee3acdc80cc7a093ddfa462198872f5/tooling/llm-api-bridges/ozon-seller/validation/FINAL_CONTROL_AUDIT_REPORT.md) — аналитическое evidence отдельного snapshot, не установленная приёмка тогдашней 0.1.21.

## WB

[Canonical source extension](https://github.com/MaksimUnimax/blood_sand/tree/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/extension).
[Migration authority](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/WB_OZON_PARITY_MIGRATION_AND_TEST_AUTHORITY_2026-09-11.md).
[Финальный отчёт 0.3.0](https://github.com/MaksimUnimax/blood_sand/blob/006af2724aafdf6589c16881c1ed06eb01cca281/tooling/llm-api-bridges/wildberries/progress/full_migration_2026-09-13/FINAL_REPORT.md).

Этот отчёт исторически говорит READY_FOR_OWNER и NOT_TESTED для installed. Более позднее сообщение владельца сообщает **INSTALLED FAIL**. В Seller Agents действует последнее наблюдение владельца.
Отчёт источника указывает donor authority c61f62a83b5a0762ae69c0138f98f7d226fea22b и исполняемый donor e01b051c2f4e0a3baed37f19762111cad9f79bac из repair/ozon-universal-ai-capability-engine-2026-09-13.
Это происхождение конкретного WB-прохода, не объявление второй текущей установленной Ozon версии и не указание слить все ветки.

## Сервер

[Корень сервера](https://github.com/MaksimUnimax/blood_sand/tree/b01b879ce61bad6b093688f982f1b82503885636/server).
[Roadmap](https://github.com/MaksimUnimax/blood_sand/blob/b01b879ce61bad6b093688f982f1b82503885636/server/docs/ROADMAP.md).
[Integration contract](https://github.com/MaksimUnimax/blood_sand/blob/b01b879ce61bad6b093688f982f1b82503885636/server/docs/INTEGRATION_CONTRACT.md).
[Tech stack](https://github.com/MaksimUnimax/blood_sand/blob/b01b879ce61bad6b093688f982f1b82503885636/server/docs/TECH_STACK.md).
[Exact-SHA Server CI №103](https://github.com/MaksimUnimax/blood_sand/actions/runs/34796397845): head b01b879ce61bad6b093688f982f1b82503885636, conclusion success.
[P8.3 remote acceptance](https://github.com/MaksimUnimax/blood_sand/blob/b01b879ce61bad6b093688f982f1b82503885636/server/docs/P8_3_REMOTE_ACCEPTANCE_2026-09-13.md).

Старое правило «реальное расширение только P11» заменено текущим [ROADMAP](../ROADMAP.md) с ранним I1. Принятые схемы безопасности сохраняются, изменяется порядок интеграции.

## Правило происхождения при переносе

Для каждого subsystem фиксировать source repo/branch/commit/path, release artifact/hash, authority, accepted behavior, зависимости, тесты и известные ограничения.
Файлы, отсутствующие в package graph, не становятся production лишь потому, что найдены в Git.
Никаких предположений «позже дата — значит принято», «больше байт — значит полнее», «все тесты зелёные — значит owner acceptance».

## Новая замороженная точка сервера — поручение владельца 2026-09-14

Для D1.S1 прежний b01b879 заменён на [3f16bbf6387cc62303e292fcfe61449c8f243b92](https://github.com/MaksimUnimax/blood_sand/commit/3f16bbf6387cc62303e292fcfe61449c8f243b92), feature/product-control-plane-p8-4-h3-2026-09-14.
P8.4 Foundation принят; H3 browser actions/P8.5/P8.6 не начаты. Неопубликованные owner_refs/recommendations в объём remote-переноса не входят.
Исторические snapshots выше сохранены как доказательство состояния D0.
