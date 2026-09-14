# D2.4 — приёмка development application

Дата: 2026-09-14. База: `de41f33646d5dd61bcae66624225e16538fd8f3a`. Development 0.2.3. Статус: DEVELOPMENT_APPLICATION_VERIFIED — SOURCE/PACKAGE/NATIVE_FIXTURE/REMOTE_CI/READBACK PASS. Code: `96af54f1d67c20f6eca2ade552fde20948f1e66d`. Полная installed/live приёмка и beta auth не входят в этот статус.

[Архитектура, изменения, команды и ограничения](../../../development/EXTENSION_APPLICATION.md).

Source/package: [LOCAL_RESULTS](LOCAL_RESULTS.json), финальный local gate7 PASS. [REMOTE_CI](REMOTE_CI.json): все пять jobs финального code candidate SUCCESS. Native fixture, точные скачанные artifacts и readback приведены ниже. Ранние FAIL сохранены как история устранённых дефектов.

Локальная среда: Python 3.12.14, Node 24.19.0, Linux. Локальный Chrome 152 не дошёл до запуска расширения из-за запрета socket(). Браузерные проверки перенесены в CI без live provider calls.

Промежуточные воспроизведения: старый transaction fixture искал не-async `getArtifact` как границу извлечения — сигнатура сохранена без ослабления проверки durability. Full-worker fixture посылал settings/diagnostics от content script — исправлен sender только в временной адаптации fixture, оригинал/RED/assertions сохранены. Source/package PASS D2.3 не заменяет нового browser gate.

Не принято этим шагом: beta auth, server integration, protected backup/relay/logout, WB live API certification, установленная работоспособность целевых браузеров/ИИ. R1–R8 BLOCKED, WB historical INSTALLED FAIL сохраняются.

## Кандидат после возобновления

Владелец снял паузу командой «Лимиты обновлены, продолжай работу». Первый кандидат `7f2488c3658913355f0b96407c37f411a2e3af81`: core/Ozon/WB Node PASS; native browser остановился на CSP несовместимом ожидании теста, до пользовательского сценария. Screenshot дополнительно выявил, что тестовая блокировка сети закрывала popup.js/css. CSP не ослаблялся: ожидание заменено locator polling, перехват ограничен HTTPS, extension resources загружаются штатно.

Исправленный кандидат `c2b83d423ff84952ba6cf866f8e91c4f2bb0c1a4`, tree `dc496ed9eb3b8807d510d4d6c8104c08803b1328`: local gate6 PASS (109 процессов, 10 application-групп). Добавлен реальный worker-сценарий 429 → удержание хвоста → ранний явный resume без дополнительного запроса; WB public quota больше не содержит Ozon intervals. Package: 1 726 025 bytes, SHA256 `71b15363ab87f31551c9cd40642b2823db97cb07388875d167f2426eb550692a`. Extension CI `34846097409`: native FAIL, исправлен следующим кандидатом. Незавершённый WB browser повтор отменён новым push; эта ревизия не принята.

Второй native запуск дошёл до настоящего popup.js, затем выявил `POPUP_SENDER_REQUIRED`: исходный guard дополнительно отвергал собственную extension-страницу во вкладке. Проверка исправлена на точное браузерное MessageSender.url собственного popup.html; другой extension origin, другая extension-страница и HTTPS content sender по-прежнему отклоняются. Popup больше не обновляет себя от диагностических записей, поэтому ошибка не создаёт цикл повторов. Первый/второй native FAIL сохранены как промежуточные результаты, не считаются пройденными сценариями.

## Финальный кодовый кандидат

`96af54f1d67c20f6eca2ade552fde20948f1e66d`, tree `91c77ca762351266b25185afca387a5c11d06c5f`. Local gate7 и CI common core PASS: 109 gate processes, 10 application-групп на source/ZIP. Старые assertions и frozen inputs сохранены. Ozon baseline и WB Node baseline PASS. Native Chromium 151.0.7922.34 source + extracted PASS; результаты и шесть визуально просмотренных снимков — [BROWSER_RESULTS](BROWSER_RESULTS.json). Все три размера/типографики читаемы, горизонтального обрезания и перекрытий нет. Это проверка WB edit card в синтетическом браузерном сценарии, не полная installed матрица.

Скачаны точные core и browser artifacts; внешние digest проверены, внутренние development ZIP побайтово совпадают с local gate7 — [ARTIFACT_VERIFICATION](ARTIFACT_VERIFICATION.json). Сборка `SELLER_AGENTS_D2_4_v0.2.3_DEVELOPMENT.zip`: **1 726 363 bytes**, SHA256 `baa3d726c212e96cb5757aece646496860e1550115502ca1def4e535f15e8276`, 38 runtime-файлов.

Прочитано полное удалённое Git tree без truncation: все **924 Git-файла** совпали по пересчитанным Git blob hashes; все **84 production inputs** также совпали по SHA256/bytes с проверенной composition receipt — [REMOTE_READBACK](REMOTE_READBACK.json). Сведения относятся к code candidate; последующее принятие добавляет только документы и квитанции.

Extension CI [34846554237](https://github.com/MaksimUnimax/Seller_Agents/actions/runs/34846554237): **SUCCESS, все пять jobs**. WB browsers: 17 suites, 321/0 на source и extracted; WB Node: 35 suites, 754/0 на обоих маршрутах. Повтор source на ZIP проверяет упаковку, не удваивает число уникальных сценариев. Публикация в main выполняется fast-forward после повторного чтения refs. Финальная ревизия меняет только документы; production inputs и package остаются точно от принятого code candidate.

## Следующий участок

Ранний I1: реальная серверная авторизация/account/device/bootstrap и совместная проверка обычного автономного выполнения. Затем D3/S2 и Q1. Полный D2 не закрыт одним developer fixture; исторический WB INSTALLED FAIL, R1–R8 BLOCKED и target browser/live границы остаются в силе. Сервер, wire contracts и pinned доноры этим шагом не изменены.
