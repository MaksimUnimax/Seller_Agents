# D2.4 — квитанция кандидата

Дата: 2026-09-14. База: `de41f33646d5dd61bcae66624225e16538fd8f3a`. Development 0.2.3. Статус: CANDIDATE — проверки публикации ещё выполняются.

[Архитектура, изменения, команды и ограничения](../../../development/EXTENSION_APPLICATION.md).

Source/package: результаты фиксируются в LOCAL_RESULTS.json после последнего полного gate. Remote CI, native browser fixture, скачанный ZIP и readback должны быть записаны перед принятием. Нельзя считать эту промежуточную квитанцию PASS публикации.

Локальная среда: Python 3.12.14, Node 24.19.0, Linux. Локальный Chrome 152 не дошёл до запуска расширения из-за запрета socket(). Браузерные проверки перенесены в CI без live provider calls.

Промежуточные воспроизведения: старый transaction fixture искал не-async `getArtifact` как границу извлечения — сигнатура сохранена без ослабления проверки durability. Full-worker fixture посылал settings/diagnostics от content script — исправлен sender только в временной адаптации fixture, оригинал/RED/assertions сохранены. Source/package PASS D2.3 не заменяет нового browser gate.

Не принято этим шагом: beta auth, server integration, protected backup/relay/logout, WB live API certification, установленная работоспособность целевых браузеров/ИИ. R1–R8 BLOCKED, WB historical INSTALLED FAIL сохраняются.
