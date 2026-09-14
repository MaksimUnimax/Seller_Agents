# D2.4 — квитанция кандидата

Дата: 2026-09-14. База: `de41f33646d5dd61bcae66624225e16538fd8f3a`. Development 0.2.3. Статус: CANDIDATE — проверки публикации ещё выполняются.

[Архитектура, изменения, команды и ограничения](../../../development/EXTENSION_APPLICATION.md).

Source/package: результаты фиксируются в LOCAL_RESULTS.json после последнего полного gate. Remote CI, native browser fixture, скачанный ZIP и readback должны быть записаны перед принятием. Нельзя считать эту промежуточную квитанцию PASS публикации.

Локальная среда: Python 3.12.14, Node 24.19.0, Linux. Локальный Chrome 152 не дошёл до запуска расширения из-за запрета socket(). Браузерные проверки перенесены в CI без live provider calls.

Промежуточные воспроизведения: старый transaction fixture искал не-async `getArtifact` как границу извлечения — сигнатура сохранена без ослабления проверки durability. Full-worker fixture посылал settings/diagnostics от content script — исправлен sender только в временной адаптации fixture, оригинал/RED/assertions сохранены. Source/package PASS D2.3 не заменяет нового browser gate.

Не принято этим шагом: beta auth, server integration, protected backup/relay/logout, WB live API certification, установленная работоспособность целевых браузеров/ИИ. R1–R8 BLOCKED, WB historical INSTALLED FAIL сохраняются.

## Кандидат после возобновления

Владелец снял паузу командой «Лимиты обновлены, продолжай работу». Первый кандидат `7f2488c3658913355f0b96407c37f411a2e3af81`: core/Ozon/WB Node PASS; native browser остановился на CSP несовместимом ожидании теста, до пользовательского сценария. Screenshot дополнительно выявил, что тестовая блокировка сети закрывала popup.js/css. CSP не ослаблялся: ожидание заменено locator polling, перехват ограничен HTTPS, extension resources загружаются штатно.

Исправленный кандидат `c2b83d423ff84952ba6cf866f8e91c4f2bb0c1a4`, tree `dc496ed9eb3b8807d510d4d6c8104c08803b1328`: local gate6 PASS (109 процессов, 10 application-групп). Добавлен реальный worker-сценарий 429 → удержание хвоста → ранний явный resume без дополнительного запроса; WB public quota больше не содержит Ozon intervals. Package: 1 726 025 bytes, SHA256 `71b15363ab87f31551c9cd40642b2823db97cb07388875d167f2426eb550692a`. Extension CI `34846097409` выполняется. Эта промежуточная запись не означает приёмку.

Второй native запуск дошёл до настоящего popup.js, затем выявил `POPUP_SENDER_REQUIRED`: исходный guard дополнительно отвергал собственную extension-страницу во вкладке. Проверка исправлена на точное браузерное MessageSender.url собственного popup.html; другой extension origin, другая extension-страница и HTTPS content sender по-прежнему отклоняются. Popup больше не обновляет себя от диагностических записей, поэтому ошибка не создаёт цикл повторов. Первый/второй native FAIL сохранены как промежуточные результаты, не считаются пройденными сценариями.
