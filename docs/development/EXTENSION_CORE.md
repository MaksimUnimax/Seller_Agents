# Общее ядро расширения

Текущий шаг: [D2.3 — внутренний WB adapter/shared queue](EXTENSION_WB_ADAPTER.md), source/ZIP LOCAL PASS, remote приёмка ожидается. WB popup/content пока не подключены.

Принятый шаг D2.2: общая очередь и закреплённый контекст пакета в development-сборке 0.2.1. Это Ozon carrier, не общая бета Ozon/WB. [Приёмка D2.2](../migration/evidence/extension-context-d2-2-2026-09-14/README.md); [принятый предыдущий шаг D2.1](../migration/evidence/extension-core-d2-1-2026-09-14/README.md).

## Реальная граница модулей

| Код | Ответственность | Внешние зависимости |
|---|---|---|
| bridge-core/work/session-model | Состояния Work и переходы | Browser storage и Start orchestration остаются в приложении |
| bridge-core/protocol/mixed-discovery | Порядок HELP/API и вложенные envelopes | Маркеры и валидаторы площадки через порты |
| bridge-core/execution/local-operations | Single flight и последовательная запись всей карты операций | Storage ports |
| bridge-core/execution/batch-queue | Полный зрелый processBatchQueue: подготовка, очередь, local results, quota wait, atomic group projection, finalize | Политика, transport, cache, quota, форматы ошибок и проекции передаются через порты |
| bridge-core/execution/context | Неизменяемый allowlisted snapshot и сравнение identity/revisions | Чтение текущего состояния через port |
| bridge-core/delivery/model | Claim/commit/unknown/recovery | План файлов площадки и реальные DOM/file ports |
| marketplaces/ozon | Ozon registry/transport semantics, file plan, protocol defaults; provider-runtime с guard перед fetch | ProviderTransportCore и поздние принятые wrappers |
| apps/extension/src/background/context | Захват локального контекста, прикладные ports, admission, guarded policy/cache/execution/delivery | Существующие storage namespaces и message protocol |
| apps/extension/src/background/compat | Совместимость имён D2.1 | Самостоятельных копий общего алгоритма нет |

Общее ядро не обращается к DOM, хранилищу браузера или серверу. processBatchQueue больше не содержит второй копии алгоритма в worker: он делегирует SellerAgentsBatchQueue. Сохраняются порядок загрузки поздних Swagger/privacy/XLSX/file wrappers и динамическое обращение к текущему OzonProvider.

## Контекст D2.2 и граница будущей авторизации

При принятии ручного блока сохраняются accountId, storeId, marketplace, credentialRevision, conversationKey, bindingId/revision, workSessionId, policyRevision, commandHash и requestId. В durable record нет raw credentials. Замена реквизитов, binding revision, новой Work-сессии, отключение персональных данных или завершение текущей операции блокируют продолжение. Изменение auto-send после клика не меняет уже разрешённую доставку.

В этой промежуточной сборке **ещё нет аккаунта Seller Agents и каталога нескольких магазинов**. Поэтому accountId явно равен `standalone-local-development`; storeId — локальный digest пары Client ID, credentialRevision — digest точного набора Seller/Performance credentials. Это compatibility scope прежнего одного слота Ozon, не подтверждение providerAccountId и не реализация SA-AUTH-01/SA-SHOP-01. При подключении каталога заменить reader настоящими стабильными account/store IDs; не переносить этот локальный digest как серверный storeId.

Work generation в текущем carrier определяется start_intent_id. Обычное изменение revision из-за видимости не объявляется новым магазином. Контекст сверяется при входе в queue, на асинхронных портах, перед storage mutation, перед provider fetch (в том числе после Performance auth), после response и перед claim/insert/recovery доставки. Получение служебного токена может завершиться после Finish; запрос бизнес-данных после этого не разрешается. Уже принятый площадкой запрос не отменяется задним числом.

Settings и секреты читаются в отдельный snapshot для исполнения, затем его credential digest сверяется с закреплённым. Cache и quota получают реквизиты этого snapshot; их namespace не переключается на новый кабинет. Служебный Performance token переиспользуется только для того же набора реквизитов.

Старый pending API-пакет без execution_context не получает контекст текущих настроек задним числом: EXECUTION_CONTEXT_MISSING, требуется новый явный запуск. In-flight/insert-unknown сохраняют запрет повторов. Отвергнутый локальный error-item без API не становится разрешением сети. Legacy autorun пока сохраняется как временный путь разработки; целевой клиентский autorun по-прежнему подлежит удалению.

Проверка контекста читает только небольшие settings/binding/Work записи. Статус операции хранится в worker как payload-free mirror; он обновляется после успешной записи через единственный manual record store. Отчётный буфер не перечитывается при каждом guard. На перезапуске mirror заполняется из текущей операции без автоматического исполнения. Отдельный runtime-тест проверяет отсутствие чтений payload при guard.

Новых обращений к серверу нет: сравнение локальное. Между браузерами команды, реквизиты и буфер этим кодом не синхронизируются.

## Сборка

```sh
python3 tooling/build/extension_composed.py --output build/core-development
python3 tooling/checks/extension_core.py --output build/core-verification
```

Node 24.19.0, Python 3.12.14. [composition.json](../../apps/extension/composition.json) перечисляет inputs/bundles и заменяемые функции. Проверяется полный SHA-256 каждого исходного фрагмента. Multi-line function signature извлекается до отдельной закрывающей строки функции; раньше совпадение на `}) {` могло захватить только заголовок — это исправлено до публикации и проверяется исполнением всего generated worker.

Все 232 imported файла остаются неизменными. Generated runtime не коммитится. Две независимые сборки ZIP обязаны совпасть; затем проверяются распакованные 36 файлов. Версия 0.2.1 принадлежит development-пакету, исходный Ozon 0.1.22 не переименовывается.

## Постоянная проверка

Существующий Extension CI исполняет прежние Ozon/WB baseline jobs и Common core / source and package. Composed route: прежние Ozon gates, 9 групп module/donor contracts, 6 полных worker-сценариев, 12 новых context-сценариев, transaction-abort и direct-binary attachment. Одинаковая проверка исходников и ZIP не считается удвоением покрытия.

Архивные тесты не редактируются. В временной копии проверки новой композиции адаптируются четыре имени портов и нечувствительность structural order assertion к пробелам; одна structural privacy-regex допускает форматирование. RED использует исходную проверку порядка. Все behavioral assertions сохранены, hashes и карта адаптации записываются runner-ом. Это не подмена исполнения поиском строк: также запускаются полный worker, provider predispatch и новые гонки.

Область требований: SA-SHOP-04, SA-WORK-01/03, SA-CMD-01/02/03 и применимая часть SA-QUOTA-01. Серверная авторизация, каталог, установленная приёмка и полная браузерная матрица этими тестами не закрываются.

## Оставшийся D2

1. D2.3: WB adapter подключён к общей очереди на уровне внутренних портов, сохранены pinned host/contract/read policy и карта зависимостей; source/ZIP LOCAL PASS. Прикладной маршрут WB ещё не подключён; schema/live certification не заявляется. См. [D2.3](EXTENSION_WB_ADAPTER.md).
2. Перевести прикладную Work/Start и delivery orchestration на общую модель магазина, заменить временный local scope; единая карточка магазинов и popup Ozon/WB.
3. Удалить клиентский autorun и согласовать Show/Hide отдельно от отмены по целевому UX. Текущее legacy поведение не объявляется уже исправленным.
4. Унифицировать техническое хранилище и часовой TTL всех payload-копий.
5. Подключить настоящий auth/bootstrap в раннем I1 по совместному контракту с серверным исполнителем.

WB INSTALLED FAIL / R1–R8 BLOCKED и Ozon live pending остаются действующими. Сервер, wire contracts и browser-store releases не входят в D2.2.
