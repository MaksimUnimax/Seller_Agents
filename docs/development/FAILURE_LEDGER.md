# Известные классы ошибок и обязательные защиты

Дата исходной фиксации: 2026-09-14. Статусы ниже различают актуальный owner result, историческое source evidence и ещё не проверенную текущесть дефекта.

| ID | Факт / граница доказательства | Что не повторять |
|---|---|---|
| F01 | Владелец сообщил installed FAIL WB 0.3.0 после source/exact ZIP 1075/0 | Не заменять установленную приёмку счётчиком tests/capabilities |
| F02 | Owner review обнаружил сохранённый старый WB popup вопреки требуемому зрелому функциональному переносу | Проверять всю подсистему и dependencies; KEEP только по behavioral equivalence |
| F03 | INVALID_CREDENTIAL_BACKUP на конкретном файле, файл ещё не исследован здесь | Не угадывать причину, не ослаблять validator для любого JSON, сопоставить форматы/legacy lifecycle |
| F04 | Ранее найдено request.onsuccess раньше завершения IndexedDB transaction; текущая исправленность проверяется при D1 | Commit по transaction complete; abort после request success — негативный сценарий |
| F05 | Ранее обнаружен PowerShell runner без проверки промежуточного exit code; текущесть проверить при D1 | Не позволять последней успешной команде маскировать предыдущий FAIL |
| F06 | Старые CURRENT/README могли расходиться с roadmap и фактическим HEAD | Один актуальный STATUS, pinned source, честные historical labels |
| F07 | Несколько старых Ozon branches ошибочно назывались двумя текущими установленными версиями | Сначала ancestry + semantic diff + authority; не сливать исторический fork автоматически |
| F08 | Ozon Swagger control: классификация/чувствительные поля/документы требовали исправлений | Полный inventory, бизнес-эффект, вложенные схемы и независимые privacy gates |
| F09 | WB source 0.2.4 fixture доказал сравнение целого user-turn с Copy/Edit вместо payload; owner root cause того случая не доказан | Проверять точный payload; не принимать empty composer/ACK за успех |
| F10 | Server source P8.3 — controlled Chrome structural harness, без live AI/provider calls | Не называть его ежедневным live health или готовой интеграцией расширения |

Ссылки на source evidence: [SOURCES](../migration/SOURCES.md), [SOURCE_STATUS](../migration/evidence/SOURCE_STATUS.md), [READ_POLICY](../integrations/READ_POLICY.md).

Для нового дефекта: наблюдение → воспроизведение → корень → scope → исправление → тот же проверочный сценарий → установленная проверка при необходимости.
Если точный корень неизвестен, UNKNOWN допустим; придуманная причинность — нет.
Не пересчитывать исторические результаты после исправления так, будто неуспешной попытки не было.
