# I1-C1: клиент авторизации единого расширения

Дата: 2026-09-15. Статус документа: READY_FOR_EXECUTOR, реализация этим документом не выполнена.

Репозиторий: `MaksimUnimax/Seller_Agents`.
Назначенная ветка: `feature/extension-i1-client-2026-09-15`.
Проверенная база `main`: `bc0cd0088ca50ba06021ea602a46bdd90de91378`.

## Поручение и результат

Владелец разрешил параллельную клиентскую работу: «Делай, я парралельно буду доделывать сервер. Если надо промпт давай для кодекса, не мешай работе двух других кодексов».

Ты — отдельный клиентский исполнитель. Выполни I1-C1 в собственном checkout и назначенной ветке: рабочий development-кандидат входа расширения через уже существующие серверные auth/device/bootstrap механизмы. После реализации, проверки и публикации draft PR остановись на передаче архитектору. Не ограничивайся ещё одним планом или описанием будущего кода.

Законченный сценарий C1:

1. Чистая установленная development-сборка предлагает войти.
2. Расширение создаёт активацию, показывает пользовательский код и открывает существующий портал.
3. Пользователь входит на портале и подтверждает устройство для своего аккаунта.
4. Расширение получает токены, проверяет подписанный bootstrap V2 собственным браузерным verifier и подключает каталог к подтверждённому `account.id`.
5. Повторное открытие popup, пробуждение worker и refresh не создают второй аккаунт/устройство или параллельную линию refresh.
6. Установка с другим аккаунтом не видит и не исполняет магазины предыдущего аккаунта; поздние операции предыдущего входа отсекаются.

Сценарий проверяется с настоящими локальными API, порталом и PostgreSQL из принятого серверного кода. Локальная тестовая доставка OTP допустима и должна быть явно обозначена в evidence. Это не доказательство настоящей доставки email, preprod, live Ozon/WB/ИИ или готовности всей беты.

Требования-основания: D-14, D-17, D-25, D-36, D-37. Перед кодом сопоставь конкретные `SA-*` и сценарии Axx из актуальных SPEC/ACCEPTANCE_MATRIX; номера не придумывай.

## Как работать рядом с двумя серверными исполнителями

На момент проверки:

| Поток | Ветка | Проверенный head |
| --- | --- | --- |
| Stream A, auth/trust | `feature/server-i1-bootstrap-trust` | `2121e817d9d07c967176233a502e5227e22e49cd` |
| Stream B, Health/H3 | `feature/server-health-h3-p8-4` | `53419eb57cc222254e14b5dc273a37249487331c` |
| Принятая общая база | `main` | `bc0cd0088ca50ba06021ea602a46bdd90de91378` |

Это снимок, не указание остановить или переключить чужие ветки. Публичный `main` уже включает PR #5 / I1-SRV.3; отдельные строки STATUS и acceptance документа ещё называют его кандидатом. Проверяй Git/PR/CI и содержание файлов вместе, фиксируй расхождение без самовольного редактирования серверной документации.

- Начни с чтения правил и read-only проверки `git status`, worktrees, remote refs и открытых PR. Не выполняй checkout/reset/stash/clean в рабочем каталоге другого Codex.
- Предпочтителен отдельный clone. Отдельный worktree допустим при отсутствии операций с общей историей и конфигурацией других задач. Не переиспользуй чужие `node_modules`, build, browser profile и test-results.
- Получи назначенную клиентскую ветку и свежий `origin/main`. Если принятый main продвинулся, перенеси его обычным merge только в свою ветку, сохранив чужие принятые изменения. Зафиксируй base и точный новый head. Не импортируй незавершённые серверные feature-ветки и не делай force push.
- При появлении чужих изменений в клиентском allowlist сначала установи их владельца и границы. Продолжай независимые файлы, а конкретный конфликт отдай архитектору. Не останавливай всю подготовку из-за незавершённого серверного этапа.
- Не отправляй сообщения другим исполнителям и не запускай дополнительные агенты. Передай владельцу компактный запрос по зависимости, только если обнаружен настоящий недостающий контракт.
- У каждой серверной/браузерной проверки — собственные порты, отдельная disposable БД, профиль и каталог артефактов. Нельзя подключаться к текущей БД серверных Codex, делать там миграции/TRUNCATE, занимать их порты, завершать их процессы или отменять их CI.
- Не используй глобальные `pkill`, `killall`, `docker compose down`, удаление общих каталогов или остановку чужих служб. Завершай только процессы, созданные своим harness и учтённые по PID/идентификатору.

## Обязательное чтение

Прочитай `AGENTS.md`, `README.md`, `docs/README.md`, `docs/STATUS.md`, `docs/ROADMAP.md`, `docs/decisions/DECISIONS.md`, `docs/development/WORKFLOW.md`.

Клиентская область:

- `docs/product/SPEC.md`, `docs/product/UX.md`;
- `docs/architecture/CONTRACTS.md`, `docs/architecture/DATA_AND_SECURITY.md`, `docs/architecture/STATE_MACHINES.md`;
- `docs/development/EXTENSION_APPLICATION.md`, `docs/development/ACCEPTANCE_MATRIX.md` и evidence D2.4;
- `apps/extension/composition.json`, `apps/extension/application-patches.json`, `apps/extension/src/application/*`;
- `packages/control-client/README.md`, `packages/bridge-core/src/stores/catalog.js`, execution/context и существующие guards;
- сборщик и текущие extension-core/browser application проверки.

Сервер читать как потребитель контракта:

- `docs/server/I1_SRV_0_CONTRACT_DEPENDENCY_AUDIT_2026-09-14.md`;
- `docs/server/I1_SRV_2_DEVICE_AUTH_INTEGRATION_ACCEPTANCE_2026-09-15.md`;
- `docs/server/I1_SRV_3_BOOTSTRAP_TRUST_HANDOFF_ACCEPTANCE_2026-09-15.md`;
- `docs/server/bootstrap-trust-bundle-v1.schema.json`;
- принятые I1-SRV.4/.5 и handoff, если они уже появились в новом main;
- `packages/contracts/src/index.ts`, актуальный OpenAPI;
- `apps/api/src/device-authorization-routes.ts`, `device-management-routes.ts`, `portal-support-routes.ts`, `refresh-routes.ts`, `bootstrap-routes.ts`;
- `apps/portal/app/activate/page.tsx`, существующие login/OTP страницы;
- серверные verifier/canonicalization/trust-export и `packages/server/simulated-extension-client/src/*` как reference, не как готовый установленный клиент;
- `tests/e2e/server/bootstrap.spec.ts` и support harness для понимания локальной приёмки.

Markdown не заменяет фактическую строгую схему. Например, общий CONTRACTS содержит ещё перспективные поля ошибок, а acceptance .2 кратко называет GET активации «status». Реальные права и wire-поля проверяются по схемам и маршрутам.

## Владение файлами

| Разрешённая область | Назначение |
| --- | --- |
| `packages/control-client/**` | Браузерные auth/refresh/bootstrap/trust/session модули и их локальные документы |
| `apps/extension/src/**` | Подключение control-client, popup входа, account port, отмена устаревших операций |
| `apps/extension/composition.json`, `apps/extension/application-patches.json` | Подключение новых модулей и точные patches зрелой основы |
| `packages/bridge-core/src/stores/**`, `packages/bridge-core/src/execution/**`, `packages/bridge-core/src/work/**` | Только доказанно необходимые account/session guards, без переписывания ядра |
| `tooling/build/extension_composed.py`, новые `tooling/build/extension_i1*` | Детерминированная development-сборка, явные packaged origins и public trust |
| `tooling/checks/extension_core.py`, новые `tooling/checks/extension_i1*` | Проверки новых модулей с сохранением существующих assertions |
| `tests/regression/extension-core/**` | Клиентские unit/regression/native/integration harness; новые I1 файлы держать в `client-i1/` |
| `.github/workflows/extension-ci.yml`, новая `.github/workflows/extension-i1-ci.yml` | Только необходимая клиентская сборка/приёмка, независимые ресурсы и concurrency |
| `docs/development/client-i1/**`, `docs/migration/evidence/extension-i1-client-2026-09-15/**` | Текущий статус клиентского этапа, команды, evidence, handoff |

Не редактировать в этой задаче:

- `apps/api`, `apps/portal`, `apps/admin`, `apps/worker`, `apps/health-runner`;
- `packages/server`, `packages/contracts`, `packages/shared`, server OpenAPI, миграции и `infra`;
- `tooling/server`, `tests/integration/server`, `tests/e2e/server`, server CI;
- frozen/imported Ozon/WB runtime и исходные imported tests, provider API adapters/реестры и Health/DOM стратегии;
- root `package.json`, lockfile, workspace/общие TS/lint настройки;
- `AGENTS.md`, общие STATUS/ROADMAP/DECISIONS/CONTRACTS и серверные acceptance документы во время параллельной работы.

Последний пункт — организация текущей разрешённой параллели, а не отмена требования актуальной документации. Статус и доказательства вести в своём `docs/development/client-i1/README.md`; в handoff дать точный предлагаемый текст обновления общих документов. Архитектор внесёт его при синхронизации. Не изменяй сами правила, чтобы объявить расширение границ разрешённым.

Если действительно нужна новая зависимость или контракт за allowlist, сначала выполни независимую часть, затем покажи минимальный отдельный diff/предложение без применения в чужой области. Обычные решения внутри allowlist принимай самостоятельно.

## Участки реализации

### 1. Браузерный control-client и происхождение конфигурации

Используй предназначенный для этого `packages/control-client`. Не создавай вторую вечную клиентскую архитектуру. Runtime не должен импортировать Node/server код, читать server environment или напрямую обращаться к БД. Серверный simulated client — reference для semantics и differential tests.

Control API origin, portal origin и доверенный публичный key ring поступают из проверяемого входа сборки и включаются в package/receipt. Нельзя принимать origin/key из AI, content messages, произвольного popup поля или неподписанного bootstrap. Не добавляй endpoint загрузки ключей или TOFU.

Для локального integration package допускаются явно заданные loopback origins и public keys одноразового тестового сервера. Этот пакет помечается LOCAL DEVELOPMENT; его настройки не становятся production defaults. Частные ключи генерируются для disposable серверного процесса, не попадают в расширение, Git, ZIP, логи или отчёты. Сохранённый public bundle и его fingerprint не являются секретами.

Проверяй нужные manifest host permissions, права worker/storage и настоящие запросы из установленного расширения. Не исправляй предполагаемый CORS изменением сервера до воспроизводимого сбоя. Первый измеренный браузер — Chrome/Chromium; wire enum базы принимает `chrome` и `yandex_chromium`. Opera/Firefox/Safari не объявляй поддержанными и не маскируй несовместимую реализацию новым значением enum.

### 2. Точный путь активации

Используй текущие строгие схемы; следующая таблица фиксирует проверенную базу:

| Действие | Фактический контракт |
| --- | --- |
| Начать | `POST /v1/device-authorizations`, обязательный `Idempotency-Key`; `clientType: browser_extension`, browserFamily, extensionVersion и разрешённые optional поля |
| Ответ | 201: `status`, `authorizationId`, `deviceCode`, `userCode`, `expiresAt` |
| Открыть портал | Доверенный portal origin + `/activate?authorizationId=<uuid>`; существующий портал обслуживает login/returnTo/выбор аккаунта/approve |
| Ожидать и обменять | `POST /v1/device-authorizations/token`, `{deviceCode}`, стабильный `Idempotency-Key` логического обмена |
| Ещё ожидает | 409 с `error.code: DEVICE_AUTH_PENDING`, учитывать `Retry-After` и предел `expiresAt` |
| Успех | 200: activated, deviceId, sessionId, tokenType, accessToken/accessTokenExpiresAt, refreshToken/refreshTokenExpiresAt |
| Refresh | `POST /v1/auth/refresh`, `{refreshToken}`, обязательный `Idempotency-Key`; ответ содержит новые токены/сроки, без нового accountId |
| Bootstrap | `POST /v1/bootstrap`, Bearer, `contractVersion: control_plane_v2`, extensionVersion, browser, deviceId, lastConfigVersion и разрешённый detectedAi |

В start response нет `verificationUri`, `interval` и `accountId`. `GET /v1/device-authorizations/{id}` требует portal session и служит preview порталу; расширение не использует его для polling. `deviceCode` не передаётся URL/порталу/content script. Отдельный OTP UI в расширении не нужен.

Одна установка имеет один текущий activation attempt. Повторный popup/клик/wake переиспользует живую попытку и её idempotency, не создаёт дубликаты. Позднее завершение отменённой/сменившейся попытки не активирует клиент. Polling ограничен сроком попытки и retry headers, без плотного цикла и зависимости от постоянно открытого popup. `DEVICE_AUTH_CLOSED` не раскрывает клиенту точную причину denied/expired — UI не должен выдумывать её.

### 3. Строгая проверка bootstrap V2

Реализуй verifier, работающий в фактическом extension worker. Допустим браузерный WebCrypto Ed25519 при подтверждённой поддержке выбранной среды; unsupported crypto должен давать честную ошибку. Нельзя заменить проверку подписи декодированием JSON/JWT или доверять флагу, проставленному серверным тестовым клиентом.

Сохрани accepted semantics:

- строгие V2 envelope/snapshot/request versions, алгоритм Ed25519, unpadded base64url;
- выбор только известного `keyId` из packaged ring;
- проверка SPKI DER, SHA-256 fingerprint и ограничений trust-bundle schema;
- signed input для V2 по-прежнему `UTF8("product-control-plane/bootstrap-snapshot/v1\0") || UTF8(keyId) || 0x00 || canonicalPayloadBytes`; `\0` здесь означает нулевой байт, не два печатных символа;
- canonical JSON: сортировка ключей объектов по принятому code-unit порядку, порядок массивов сохраняется, UTF-8, только разрешённые типы/безопасные целые, исключён `-0`;
- проверка подписи над точными декодированными payload bytes, canonical byte equality и строгая проверка payload; повторяющиеся/лишние поля и несовпадающие версии не проходят;
- `account.id` берётся только из принятого подписанного V2 payload. В V1 его нет; автоматический fallback к V1 для каталога запрещён;
- запрос не содержит произвольный accountId. Сам bootstrap payload не подписывает deviceId/sessionId: привязка ответа к текущим credentials, device, запросу и локальной generation обеспечивается клиентом;
- `accessBasis: BETA` не требует фиктивной активной подписки: `subscription.state: NONE` остаётся NONE. Проверяй остальные подписанные access/compatibility/AI ограничения, не превращай успешную подпись в безусловное право Work.

Публичный bundle экспортируется существующим `pnpm config:trust-export`. ACTIVE входит по умолчанию; RETIRED — только выбранный release-time overlap, REGISTERED/REVOKED не доверяются. Следуй принятой схеме, не вводи другую lifecycle authority. Удаление/ротация packaged ключа, неизвестный keyId и повреждённый snapshot должны иметь проверяемые результаты.

### 4. Session storage, refresh и границы аккаунта

Токены, pending deviceCode/idempotency, проверенный envelope и session metadata хранятся только в privileged storage. Сохрани `TRUSTED_CONTEXTS` и проверки sender. Popup получает только минимальное UI-состояние; content scripts/AI/диагностические ответы не получают tokens, marketplace keys или полный auth storage.

Один refresh flight на установку. Для retry одной ротации сохраняй тот же idempotency до безопасного commit новых credentials. Учти worker interruption между серверной ротацией и локальной записью: новое пробуждение не отправляет старый refresh с новым ключом идемпотентности. Смена сессии/попытки и late refresh/bootstrap не могут восстановить предыдущую authority. `AUTH_REFRESH_INVALID` — терминальный отказ этой линии; transport/5xx не выдаются за отзыв устройства.

В `apps/extension/src/application/runtime.js` заменить production account port `standalone-local-development` подтверждённой session authority. Проверить все жёсткие сравнения development account, включая `saAssertStore`, пути legacy settings, catalog reads/mutations, Start/execution/delivery и callbacks после await. Недостаточно поменять одну константу.

Существующий `packages/bridge-core/src/stores/catalog.js` уже поддерживает account port и account-scoped storage. Сохрани store IDs и структуру, где это возможно. Данные development-account не переписывай автоматически на первый реальный UUID: его владелец ранее не был подтверждён. Сохрани изолированно и обозначь миграцию как незакрытый отдельный случай; не удаляй ключи для получения чистого теста.

Смена account/session и известная потеря authority закрывают активные локальные привязки и будущие dispatch/delivery, включая поздний refresh и незавершённые callbacks. Read/mutate текущего каталога не могут выдать результат предыдущему/следующему аккаунту после await. Сохрани поведение D2.2/D2.4 закреплённых credentials, Finish и запрета повторного Send при неизвестном результате.

Для проверки возврата A → B → A нужна безопасная локальная invalidation/reset с сохранением account-scoped данных. Полный продуктовый logout с выбором оставить/удалить ключи, backup/relay и синхронизацией остаётся D3; не объявляй его готовым этим шагом. Не показывай пользователю окончательный logout UX с молчаливым удалением ключей. Существующие portal logout и device revoke требуют cookie/CSRF: расширение не заимствует cookies и не выдумывает Bearer revoke endpoint. В тесте серверный revoke выполняется через настоящий portal authority, после чего проверяется реакция клиента.

### 5. Граница с I1-SRV.4/.5 и работа без лишних запросов

I1-C1 принимает online auth и привязку каталога. Финальная offline/cache/error policy находится у Stream A в I1-SRV.4, общий server handoff — I1-SRV.5. Если они уже приняты в новом main, сверяй реализацию с ними. Если ещё нет — не останавливай verifier/API/session/popup/catalog, но не придумывай новую policy и не объявляй C1 всей интеграцией I1.

Проверка свежего snapshot и expiry обязательна сейчас. Подписанные serverTime/expiresAt/offlineGraceUntil нельзя заменять самодельным сроком или продлевать при чтении. Полный offline-grace, clock rollback и восстановление cached policy включаются в отдельную явно отмеченную интеграционную приёмку по принятому .4; незакрытые случаи отрази в handoff. Не сокращай незаметно принятую продуктовую автономность: development-кандидат до этого не становится релизом.

Обычный marketplace пакет и доставка не вызывают control server. Work guards читают локальную проверенную authority; login/refresh/bootstrap выполняются своим control path. Не используй server request перед каждым item как замену правильной изоляции. Часовой буфер результатов D2.4 — отдельный срок и не является auth/session TTL.

Если для auth bootstrap нет detectedAi и сервер возвращает `UNCONFIGURED`, вход/каталог можно проверить отдельно. Это не разрешает обходить подписанную AI/compatibility policy и включать Work на неподдержанном профиле. Signed profile consumption/full Work acceptance, не закрытые этим заданием, честно вынеси в C2 после server sync. Существующие Work регрессии не ослабляй: их harness должен получать разрешённое тестовое состояние через тот же проверяемый путь, без shipped auth bypass/debug endpoint.

## Проверка

До изменений зафиксируй минимальный baseline. После изменений проведи достаточные проверки фактического клиента и исполняемой сборки. Не считай зелёный server simulated client доказательством работы установленного расширения.

Обязательные группы:

| Группа | Что доказать |
| --- | --- |
| Онлайн-вход | Реальные local API/portal/PostgreSQL, pending → approve → exchange → browser-verified V2 → каталог; закрытие/повторное открытие popup |
| Неуспешный вход | Deny/expiry, повтор клика, отменённая попытка с поздним ответом, корректное завершение polling без второго устройства |
| Криптография | Valid V2; account/payload/signature tamper; неизвестный/неверный ключ; cross-version; неканонические/лишние поля; public bundle fingerprint и overlap |
| Refresh | Singleflight, тот же idempotency после потерянного ответа/worker interruption, терминальный отказ, поздний ответ старой generation |
| Аккаунты | A → B → A, отдельные магазины одной площадки, pending read/write/dispatch/delivery при смене; development legacy не присваивается реальному аккаунту |
| Privilege boundary | Неправильный sender не читает auth/key storage и не меняет session; secrets отсутствуют в content/AI/logs/artifacts |
| Revoke | Отзыв через настоящий portal/device route; клиент после подтверждённого отказа не использует прежнюю authority как offline fallback |
| Регрессия | Сохранённые Ozon/WB application/queue/context/Finish/no replay/IDB/TTL assertions; ноль обязательных control requests в разрешённом обычном пакете |
| Package | Те же клиентские модули и trust input в source и извлечённом ZIP; детерминированность, receipt, точный source commit и hashes |

Для crypto используй differential/golden fixtures относительно принятого серверного verifier. Для account races управляй точными await/barrier точками; не подменяй доказательство случайными sleep. Проверяй браузерный verifier в worker хотя бы на happy path и tamper, даже если полный набор идёт также в Node.

У базы Node 24 и `pnpm@10.34.5`. Установку делай с frozen lockfile в своём checkout. Extension CI сейчас содержит Python/Node gates без автоматического pnpm bootstrap во всех jobs; обеспечь воспроизводимость нового теста, не полагайся на случайно установленные зависимости другого Codex.

Существующие команды-опоры, каждую запускать со своим новым output directory:

```sh
python tooling/checks/extension_core.py --output build/i1-client-core
python tooling/build/extension_composed.py --output build/i1-client-package
python tests/regression/extension-core/browser_application.py --runtime build/i1-client-package/runtime --output build/i1-client-browser-source
python tests/regression/extension-core/browser_application.py --runtime build/i1-client-package/extracted --output build/i1-client-browser-package
pnpm docs:check
pnpm bridge:guard
pnpm openapi:check
```

Добавь точную команду нового client-I1 harness и CI job. Старые runners/build names местами закреплены на D2.4/0.2.3: необходимые клиентские ожидания обновляй последовательно, сохраняя смысл assertions и frozen baselines. Новую development-версию выбери после fresh-read composition; `0.2.4` доступна на указанной базе, но это не вечная резервация версии.

Существующий server Playwright config/harness использует фиксированные 3100/3200/3300 и общую disposable БД. Не запускай его неизменённым рядом с серверными Codex. Создай свой client harness в allowlist с отдельными настройками. Можно импортировать неизменённые server services/app factories как тестовый host, запустить существующий portal отдельно и посеять только собственную disposable БД; это не разрешение редактировать server sources. Нельзя подменять реальные auth/refresh/bootstrap ответы в главном integration acceptance тесте. ИИ/marketplace synthetic fixtures остаются допустимыми и явно указанными.

Не повторяй весь server CI локально на общих ресурсах. Если CI платформы автоматически запускает server проверки для PR, не отменяй их; результат привяжи к точному head. Существующий intermittent серверный тест не исправляй в клиентском diff, не переписывай expectations и не ретраь до зелёного без разбора причины. Сохрани первый результат и вынеси независимый blocker владельцу.

Если native браузер не запускается из-за ограничений локальной среды, исполни этот gate в собственной CI job и представь точную причину локального ограничения. Не объявляй NOT_RUN/blocked проверку PASS и не обходи ограничения среды.

## Публикация и передача

1. Собери implementation и evidence commits только в назначенной ветке. Перед push повторно проверь remote head и diff относительно принятой базы; в diff не должно быть серверных/чужих правок.
2. Опубликуй draft PR в main с названием `I1-C1: extension device auth and signed account binding`. Main не сливай; чужие PR/ветки не меняй. Изменение main серверными потоками допустимо, его не замораживать.
3. Проверь опубликованный exact commit, diff, выполненные CI и читаемость артефактов. Скачанный ZIP сверь с receipt и исходниками; если artifacts/CI недоступны, явно оставь соответствующий gate открытым.
4. В `docs/development/client-i1/README.md` и evidence укажи requirement mapping, поведение, команды, реальные outcomes и пределы проверки. Не коммить токены, OTP/deviceCode, приватные signing keys, сырые данные магазинов/переписку или полный browser profile. Служебные снимки очищай от секретов.
5. Верни владельцу: точные base/head, PR, список изменённых областей, результат online auth, browser/version/package hash, CI ссылки, открытые I1-SRV.4/.5 зависимости, последующий C2 и предложенный текст STATUS/ROADMAP после синхронизации.

C1 не закрывает полный I1, S1.2/preprod/email, D3, Health/H3/P8, WB R1–R8, live marketplace/ИИ, browser-store release или beta acceptance. Следующий участок — сверка с окончательным server handoff, signed Work policy и автономностью, затем совместная установленная приёмка.

Технические решения и исправления внутри данного объёма выполняй самостоятельно. Для начала уже есть поручение владельца; дополнительного разрешения на чтение, свою ветку, implementation, локальные проверки и draft PR не требуется.
