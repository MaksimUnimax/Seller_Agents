# D2.3 — адаптер WB и общая очередь

Адаптер WB включён в development-сборку 0.2.2 и исполняется через SellerAgentsBatchQueue / SellerAgentsGuardedBatchQueue. Проверяется весь generated worker, исходники и распакованный ZIP. **Это внутренний API адаптера: popup/content handlers пока вызывают Ozon. Пользовательского WB маршрута, каталога магазинов и установленной приёмки этим шагом не создано.**

Поручение: восстановить текущую работу после D2.2 и продолжить объединение; Ozon остаётся эталоном общей механики. Source authority Seller_Agents — main `f73d2b448e5189476b06bf1a2a25e528241e750d`, tree `e88a92686cf3b2754e17e9591c8c558f89555d32`. Старое сообщение начиналось с Blood & Sand, но фактический D2.2 опубликован уже в Seller_Agents. Повторный Extension CI D2.2 `34836998945` завершён success.

## Ответственность и зависимости

| Подсистема | Источник/реализация | Действие D2.3 и доказательство | Оставшаяся граница |
|---|---|---|---|
| Registry, сериализация, токен | Закреплённые WB operations/contract/credentials | Шесть точных файлов WB загружаются в замкнутый scope; 188 записей проверены на локальную сериализацию/запрет, прежние 172 enabled и 16 disabled не изменены | Это сохранённый snapshot, не новая сертификация прав, схем или API |
| Transport | WB fixed-host JSON/binary transport | Сохранены allowlist, redirect:error, deadline, bounded read; adapter добавляет контекст перед fetch и после ответа, credentials:omit | Никакого переноса Ozon host/auth/числовых квот |
| HELP/API discovery | Общее SellerAgentsMixedBatchDiscovery из Ozon + WB HELP/contract | Одна общая реализация сканирования; HELP V1/V2, legacy catalog/describe, ошибки элементов и порядок проверены | WB_FILE требует прикладной delivery route и здесь явно отклоняется; чужая площадка в блоке отклоняется |
| Очередь/unknown/replay | SellerAgentsBatchQueue и LocalOperations из Ozon | WB не использует старые worker, wb_batch_runtime или runtime_worker; single-flight, serialized records, requesting после restart проверены | Будущий sender/tab/account admission находится в приложении |
| Контекст и поздние действия | ExecutionContext D2.2 + GuardedBatchQueue | Обёртка ожиданий выделена из Ozon в общий модуль, используется обоими адаптерами; сохранены все 12 Ozon context-сценариев | Прикладной reader WB должен получать настоящие магазин, Work и binding |
| Квота | Общий ObservedQuota, WB host/credential scope | Только наблюдённый Retry-After; общий singleton на установку; разные диалоги делят deadline. После 429 нет retry; ожидание хвоста возобновляет приложение отдельным допустимым действием | Числовые WB policy, verified account dedup и автоматический wake не изобретались |
| Cache/coalescing/prefetch | WB policy выключена | Эти пути явно запрещены; команда не расширяется и не меняется | Дальнейшее включение только по подтверждённой WB policy |
| Полнота результата | WB adapter → тот же result record очереди | Большой JSON не обрезается; binary передаётся целиком в report с исходным filename, если он безопасен; malformed JSON и size limit дают явную ошибку | Bytes received не равны uploaded/sent; field schema/semantic certification отсутствует |
| Хранилище | Общий record store, прикладные read/write ports | Ошибка записи до dispatch блокирует сеть; после ответа ошибка сохранения Retry-After сначала сохраняет результат, затем останавливает хвост | Browser write должен resolve только по завершённой транзакции; общий часовой TTL всех копий ещё предстоит |
| Work/Start/Finish | Принятый общий Ozon Work model, D2.2 guard | WB adapter принимает только закреплённый активный context; Finish/смены проверены контролируемым reader | Настоящий WB Start, prompt, sender identity и смена магазина ещё не подключены |
| AI/files/delivery/recovery | Зрелые Ozon application/AI modules | Они не заменены WB копиями. Финализация WB отдаёт сохранённые результаты прикладному порту, guard перед ним | Общая сборка WB файлов, claim/insert/send/unknown и live DOM должны быть подключены и проверены следующим участком |
| Popup/ключи/import/export | Требования UX и зрелый Ozon operator flow | Старый WB popup и backup-механика не копируются | Несколько магазинов, общие формы и совместимость backup не реализованы; причина owner INVALID_CREDENTIAL_BACKUP остаётся неизвестной |

## Интерфейс для следующего прикладного шага

В privileged worker доступны SellerAgentsWBAdapter и SellerAgentsWBBatch. Ни один из них не экспортируется странице и не получает серверные секреты.

1. Приложение после проверки отправителя/диалога и явного разрешения блока фиксирует snapshot по общему ExecutionContext. Marketplace — `wildberries`, commandHash — SHA-256 точного выбранного текста, requestId — стабильный ID разрешённого пакета.
2. credentialRevision получается через WBAdapter.credentialRevision. Это локальный digest токена, не подтверждённый providerAccountId. Приложение передаёт snapshot, readCurrent и один снимок credentials в createContext; после await контекст проверяется заново. В durable record raw token не сохраняется.
3. Один shared RecordStore и один ObservedQuota создаются на всю установку/namespace; нельзя создавать отдельные write queues на каждый диалог. Promise write обязан означать завершённое сохранение.
4. WBBatch.create получает records/quota/diagnostic/finalize/workerId. admit фиксирует только явные элементы; process вызывает единственную общую очередь. Повтор того же requestId не запускает API заново. Состояние requesting прежнего worker закрывается UNKNOWN без retry.
5. finalize получает тот же owner, entries и guard. Приложение обязано сверять guard после каждого ожидания перед DOM/file/insert/send; callback не является доказательством отправки. Ошибки и сохранённые частичные результаты не должны стираться при подключении delivery.

Обычный пакет не делает control-plane calls. Пока нет реального WB application route, разрешения manifest не расширены; auth, R1–R8, browser-store release и live provider calls остаются вне этого шага.

## Проверка

```sh
python tooling/checks/extension_core.py --output build/d2-3-verification
```

17 групп WB-сценариев в tests/regression/extension-core/wb-adapter.mjs, прежние Ozon source/ZIP gates, полный worker, контекст, direct-binary attachment и transaction-abort. Одинаковые группы на исходниках и ZIP не суммируются как новое покрытие. [Квитанция](../migration/evidence/extension-wb-adapter-d2-3-2026-09-14/README.md).

## Следующий участок D2

Привязать оба адаптера к настоящей модели магазинов и общему popup, затем соединить WB Start/discovery/execution с общей прикладной доставкой. Проверить отдельно диалоги Ozon/WB и два магазина одной площадки. Удалить клиентскую автоработу, развести Show/Hide и Finish, унифицировать часовой TTL всех payload-копий. После этого ранний I1 с настоящим серверным auth по общему контракту и установленная приёмка. WB INSTALLED FAIL и R1–R8 BLOCKED не снимаются внутренними тестами адаптера.
