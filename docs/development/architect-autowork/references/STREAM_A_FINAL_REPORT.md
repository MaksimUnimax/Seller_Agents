Принял. **Новый prompt Codex не выдаю.** Работа Stream A на этой точке остановлена по твоей команде, и ниже — сводный отчёт за весь пройденный цикл.

## Итоговый статус

CURRENT\_MAIN = `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`

Последний merge — PR #6, I1-SRV.4. Post-merge readback подтверждён: merge commit имеет родителей `bc0cd0088ca50ba06021ea602a46bdd90de91378` и exact candidate `f2f7be25393f2d6b3794b8423d7a2701a7c37bdc`; tree `4dfcf1c3d3537091d741a7784f99ebee995e76cc` совпадает с candidate tree.

Текущая позиция roadmap: **I1-SRV.4 завершён и находится в canonical main. I1-SRV.5 НЕ НАЧАТ.**

То есть сейчас пройдено:

| ЭтапИтог                                     |             |
| -------------------------------------------- | ----------- |
| A8R — S1.1 reconciliation                    | DONE        |
| A8A — S1.1 acceptance                        | DONE        |
| I1-SRV.0 — contract/dependency audit         | DONE        |
| I1-SRV.1 — signed canonical account identity | DONE        |
| I1-SRV.2 — device/auth E2E server contract   | DONE        |
| I1-SRV.3 — bootstrap trust/key handoff       | DONE        |
| I1-SRV.4 — errors/revocation/offline         | DONE        |
| I1-SRV.5 — reference client full acceptance  | NOT STARTED |
| S1.2 real OTP provider/preprod               | NOT STARTED |
| D3/store sync                                | NOT STARTED |
| Extension real I1 integration                | NOT STARTED |

Никакого следующего Codex task сейчас не формирую.

# 1. С чего начинали

Stream A пришёл в эту работу с уже написанным S1.1, но branch разошёлся с `main`: параллельно в main уже появился принятый D2.4 extension result.

Главная первая задача была не писать новую авторизацию, а **безопасно сохранить одновременно обе линии**:

S1.1 server beta-access и D2.4 extension.

Это было критично, потому что тупой merge мог либо откатить D2.4, либо потерять серверную beta-логику.

# 2. S1.1 — beta access доведён до main

S1.1 в итоге был reconciled с новым main и принят.

Сохранено:

BETA / COMMERCIAL / NONE как явный `accessBasis`; режимы beta admission CLOSED / OPEN / PAUSED; atomic PostgreSQL admission; защита last-slot race; сериализация по normalized identity; idempotent OTP verify; отсутствие двойного account/admission/session effect; независимость BETA от fake subscription/trial/payment; независимая beta device policy; `ADMIN_BETA_OPERATOR`; admin API/UI управления beta admission; requestId/revision/audit; безопасные portal errors; migration `0016_s1_1_beta_access.sql`.

Отдельно был исправлен важный крайний случай: если у аккаунта одновременно есть BETA и COMMERCIAL, commercial deadline не должен обрезать offline grace, пока фактический `accessBasis` — BETA.

S1.1 был принят в main, после чего выполнен отдельный docs closeout. Исторически merge S1.1 — `d0b54aa5e659932d3fa2d996b572e06aadfffe62`, docs closeout — `74cd829b7e7134ad22c808b178cf3a239a8a71a6`.

# 3. I1-SRV.0 — разобрали существующую авторизацию вместо её переписывания

Перед I1 была подтверждена основная архитектурная вещь: **второй auth stack не нужен**.

У сервера уже были:

portal OTP, device authorization, approve/deny/exchange, access token, refresh token, refresh rotation/reuse handling, signed bootstrap, commercial access, beta access, device revoke.

Поэтому I1 пошёл как интеграция уже существующих механизмов в один extension-facing server contract.

Это сильно уменьшило риск и объём изменений.

# 4. I1-SRV.1 — canonical account identity

Здесь было несколько важных отбраковок до принятия правильной архитектуры.

Первая попытка механически добавляла `account.id` в строгий V1 wire contract. Это было отклонено: старые strict consumers могли сломаться.

Вторая попытка уже ввела V2, но выявились два других дефекта: signing-key retirement не учитывал V2-only key, а V2 пытались привязать к rollout-схеме V1 так, что возникала несовместимость с существующей DB authority.

После переоценки архитектуры приняли более чистую модель:

V1 остался полностью неизменным; V2 получил отдельные `control_plane_v2`, `bootstrap_snapshot_v2`, `bootstrap_envelope_v2`; V2 signed account содержит `{id, status}`; accountId берётся только из authenticated subject; клиент не может подставить свой accountId; изменение accountId ломает подпись; V1 продолжает использовать rollout `bootstrap.config`; V2 использует version-scoped ordinary-latest CONFIG\_RELEASE; никакого `bootstrap.config.v2`; новая migration не потребовалась.

Accepted candidate был `337a96f2dc78c1c35d5b28581399275bad9708b5`, PR #3, после независимой проверки смержен в main как `82761c57b4d5fddc7d55bf1ae715cfbcc61e1948`.

Итог I1-SRV.1: **Seller Agents account identity теперь существует как server-owned signed canonical identity.**

# 5. I1-SRV.2 — доказан реальный device/auth/token/bootstrap путь

Следующий этап был не про новые сущности, а про end-to-end correctness уже существующей авторизации.

Accepted candidate: `0afe60c7a687421b69c23dfb80d7683b35128688`.

Проверен полный путь:

device authorization → portal login → approval → exchange → access token → refresh token → signed bootstrap → refresh rotation → device revoke → последующий credential fail-closed.

Ключевое усиление durable authority: session/device/account должны принадлежать друг другу не только по JWT claims, но и по PostgreSQL authority. Добавлены проверки `device.account_id = session.account_id`, active device, active account, active user, active session.

Access token остался со связкой session/device/account. Refresh остаётся opaque и хранится через HMAC-derived persistence. Rotation остаётся atomic.

Отдельно были доказаны отрицательные случаи:

wrong issuer, audience, algorithm, expired token; mismatch account/device/session; revoked device; forbidden account/user/session; refresh replay/reuse; отсутствие descendant refresh после revoke.

V2 bootstrap E2E доказал, что signed `account.id` равен durable account ID и подмена его в payload ломает verification.

PR #4 был принят после exact-head CI и смержен:

merge `52f46680396d30b60fc95733dd30963c69bb5c89`.

# 6. I1-SRV.3 — bootstrap signing trust

Здесь закрывали уже не саму подпись, а **как extension вообще безопасно узнает, какому public key доверять**.

Основной принцип зафиксирован правильный:

extension не должен получить bootstrap от сервера, затем получить от того же runtime server public key и просто решить, что этот key trusted.

Это self-authentication/TOFU и так делать запрещено.

Правильная модель теперь такая: public trust bundle доставляется через отдельно аутентифицированный release/distribution path и заранее package/pin-ится клиентом. Runtime `keyId` только выбирает один из уже trusted keys.

Подтверждены:

Ed25519; SPKI DER public key; base64 public-key encoding; SHA-256 fingerprint; lowercase hex fingerprint; canonical JSON; exact signed bytes; unpadded base64url signature; keyId входит в signed input; private keys никогда не покидают server secret boundary.

Первый candidate I1-SRV.3 был отклонён мной несмотря на зелёный CI. Причина: exporter автоматически включал **все RETIRED keys** как verification overlap. Это означало, что normal retired key фактически оставался package-trusted навсегда, пока его не превратят в REVOKED, что смешивало planned rotation с emergency revocation.

После correction сделали явный release-time overlap selector:

ACTIVE keys идут автоматически; RETIRED идут только при явном выборе `--overlap-key`; REGISTERED/REVOKED/unknown selectors fail closed; старый retired key можно перестать package-ить без REVOKED; исторические retired keys больше не раздувают bundle бесконечно.

Corrected candidate `2121e817d9d07c967176233a502e5227e22e49cd` был принят и PR #5 смержен в:

`bc0cd0088ca50ba06021ea602a46bdd90de91378`.

# 7. I1-SRV.4 — stable errors, revocation и offline policy

На этом этапе мы сознательно **не стали плодить новые HTTP error codes** там, где клиентское действие одинаково.

Сохранены существующие public semantics:

`UNAUTHORIZED` для invalid/expired/durably unauthorized access; `AUTH_REFRESH_INVALID` для invalid/expired/reused/revoked refresh; `DEVICE_AUTH_PENDING` + Retry-After; `DEVICE_AUTH_CLOSED` для terminal denied/expired/already-exchanged device authorization; `DEVICE_MISMATCH`; `BOOTSTRAP_UNAVAILABLE`; существующие beta/subscription/account/device codes.

Это сделано намеренно: не раскрывать лишний security oracle, если клиент всё равно должен выполнить одно и то же безопасное действие.

Network failure не превращён в fake server error. DNS/connect/TLS/timeout до HTTP response остаётся client transport state.

# 8. Что теперь означает offline

Добавлен исполняемый reference policy в server-side `simulated-extension-client`.

Cached bootstrap разрешён только если одновременно выполнены условия:

ранее прошла настоящая strict signature verification; `keyId` найден в заранее packaged trusted ring; payload schema валидна; время не вышло за signed grace; client context совпадает; локальная release capability действительно существует; signed server policy эту capability разрешает; клиент локально не видел terminal revoke/forbidden/auth result.

Временные границы теперь однозначные:

до `expiresAt` — FRESH; начиная с `expiresAt`, но строго до `offlineGraceUntil` — только bounded offline/transient fallback; при `offlineGraceUntil` и позже — запрещено.

401 и 403 нельзя обойти cache fallback.

Invalid signature / unknown key / malformed signed response нельзя обойти cache fallback.

UPDATE\_REQUIRED, UNSUPPORTED\_BROWSER и прочие signed compatibility states нельзя downgrade-нуть старым cache.

Remote config не может включить feature, которой нет в локально packaged release.

Обычная marketplace-команда остаётся local data-plane operation и не требует server roundtrip.

# 9. В I1-SRV.4 тоже был найден реальный дефект и исправлен

Первый candidate `867d6e08761879eb407a15dd4aa546d16d974d74` имел хороший runtime anti-clock-rollback, но high-watermark после offline use оставался только в памяти процесса.

Это означало:

клиент мог дойти офлайн почти до конца grace, перезапуститься, откатить wall clock и после restart получить старый persisted time floor.

Я этот candidate отклонил.

Correction сделал effective-time floor durable.

Теперь после разрешённого cached/offline use новое effective time сохраняется **до возврата ALLOW**. Повторные use могут floor только увеличить. Restart загружает новый floor. Rollback системных часов не возвращает уже «потраченное» grace time. При достижении grace end expiry floor тоже сохраняется, поэтому restart не воскресит expired cache.

Если нужный cache-state update сохранить невозможно, offline authorization fail-closed.

При этом valid LIVE response по-прежнему можно использовать, даже если optional cache save не сработал: нельзя превращать availability cache в authority над настоящим live result.

Signed envelope, `expiresAt`, `offlineGraceUntil` при этом не переписываются.

Добавлена V2 pure-policy проверка и сохранена signed account identity protection.

# 10. Финальная проверка I1-SRV.4

Corrected candidate:

`f2f7be25393f2d6b3794b8423d7a2701a7c37bdc`

Branch:

`feature/server-i1-error-offline-semantics`

PR #6.

Полный diff от accepted main: 11 файлов, только docs, `packages/server/simulated-extension-client/**` и минимальная E2E bootstrap coverage.

Не изменены:

Health, `apps/extension/**`, marketplace adapters, store sync, DB schema, migrations, OpenAPI.

Fresh exact-head Server CI:

`34951442143`

тестировал именно `f2f7be25393f2d6b3794b8423d7a2701a7c37bdc`.

В нём реально прошли frozen install, lint, format, typecheck, Playwright config regression, unit, PostgreSQL integration, db\:migrate, openapi\:check, bridge\:guard, build и full server E2E.

Documentation CI `34951442176` — success.

Локальная ошибка `No space left on device` была именно host/Docker environment problem, а не code failure; remote exact-head PostgreSQL integration, migrations и E2E полностью прошли.

PR #6 был mergeable, review blockers отсутствовали.

После expected-head guarded merge:

canonical main = `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`.

# 11. Что сервер умеет сейчас

На текущем main server-side часть уже умеет следующее:

реальная account identity существует и подписывается; device auth path связан с реальным account; access token привязан к session/device/account; durable PostgreSQL authority перепроверяется на online запросах; refresh rotation atomic; replay/idempotency semantics определены; revoke устройства блокирует online access/refresh/bootstrap; suspended/forbidden account/session fail closed; signed V1/V2 bootstrap существует; V2 содержит canonical account ID; trust handoff для Ed25519 ключей определён; rotation overlap bounded; public keys можно безопасно экспортировать для release packaging; private keys наружу не выходят; stable client error actions определены; offline cache policy определена; offline grace нельзя локально продлевать; restart clock rollback больше не возвращает использованное grace; stale cache нельзя использовать после уже увиденного terminal online denial; marketplace data-plane остаётся локальным.

# 12. Что сознательно НЕ делалось

Мы не трогали Stream B Health/P8 authority.

Не меняли `apps/health-runner/**` и `packages/server/health/**`.

Не подключали реальный extension runtime.

Не меняли popup auth UI, browser token storage, Ozon/WB adapters, Work capture, delivery engine или marketplace execution.

Не делали server-side store catalog/sync.

Не начинали D3.

Не начинали S1.2.

Не выбирали настоящий mail provider и не подключали production SMTP/OTP delivery.

Не строили preprod/P14 infra.

Private marketplace credentials по-прежнему не отправляются на server.

# 13. Что ещё осталось

Главный оставшийся I1 server step — **I1-SRV.5**.

Он должен независимо доказать полный reference-client lifecycle на настоящих server API contracts:

device authorization → portal auth → approve → exchange → access/refresh → V2 signed bootstrap → verification → canonical accountId → BETA access → refresh rotation → offline/cache behavior → revoke → последующий denial.

Только после принятия I1-SRV.5 должен сработать новый hard stop:

`STREAM_A_I1_SERVER_REACHED_SYNC_BOUNDARY`.

После этого server contract передаётся extension architect для настоящей browser integration.

Но по твоей команде **I1-SRV.5 сейчас не стартую и Codex task не выдаю**.

# 14. Точная текущая точка

CURRENT\_MAIN = `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`

S1\_1\_IN\_MAIN = YES
ACCOUNT\_ID\_SIGNED = YES, V2
DEVICE\_FLOW = SERVER ACCEPTED
REFRESH\_FLOW = SERVER ACCEPTED
BOOTSTRAP\_SIGNATURE = ACCEPTED
KEY\_HANDOFF = ACCEPTED
OFFLINE\_GRACE = ACCEPTED THROUGH I1-SRV.4
REVOCATION = ONLINE FAIL-CLOSED + OFFLINE OBSERVATION SEMANTICS DEFINED
REFERENCE\_CLIENT = PARTIAL / I1-SRV.5 STILL NOT STARTED
PUBLIC\_HTTP\_CONTRACT\_CHANGED\_IN\_I1\_SRV\_4 = NO
DB\_MIGRATION\_IN\_I1\_SRV\_1\_TO\_4 = NO
STREAM\_B\_AREA\_TOUCHED = NO
EXTENSION\_RUNTIME\_TOUCHED = NO
S1\_2\_STARTED = NO
D3\_STARTED = NO
I1\_SRV\_5\_STARTED = NO

То есть серверная часть I1 уже доведена **до конца I1-SRV.4**, включая две независимые архитектурные коррекции, которые были найдены именно на нашей проверке после зелёного Codex/CI. Остался последний server acceptance step I1-SRV.5, после которого уже должна идти реальная синхронизация с extension architect, а не дальнейшее автономное развитие Stream A.