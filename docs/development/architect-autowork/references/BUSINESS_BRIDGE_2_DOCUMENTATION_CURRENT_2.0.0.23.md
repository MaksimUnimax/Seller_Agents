# Business Bridge 2 — canonical documentation

Документ создан: **2026-07-12**  
Текущая версия: **2.0.0-alpha.1**  
Статус: **side-by-side development and live-test candidate**

---

## 0. Правило ведения документа

Это единственный канонический файл документации Business Bridge 2.

Документ ведётся **append-only**:

- уже опубликованные разделы не удаляются;
- исторические факты не переписываются задним числом;
- ошибки и отозванные решения сохраняются и помечаются отдельной новой записью;
- каждый новый patch/version добавляет новый раздел в конец документа;
- новый раздел обязательно содержит: версию, дату, причину изменения, изменённые файлы, сохранённые инварианты, тесты, известные ограничения, rollback и SHA-256 новой сборки;
- отдельные документационные Markdown-файлы для каждого patch больше не создаются без прямого запроса владельца;
- ZIP расширения и другие бинарные артефакты всегда выдаются отдельно от этого файла.

Предыдущие отдельные файлы `BUSINESS_BRIDGE_2_ALPHA1_EXTENSION_NOTES_2026-07-12.md` и `BUSINESS_BRIDGE_2_SERVER_API_CONTRACT_ALPHA1_2026-07-12.md` консолидированы в этот документ и больше не являются каноническими.

---

# VERSION ENTRY — 2.0.0-alpha.1

Дата: **2026-07-12**  
Manifest version: `2.0.0.1`  
Server API contract: `business-bridge-v2`

## 1. Назначение продукта

Business Bridge 2 связывает ChatGPT-диалог с выбранной серверной CLI через отдельный Bridge-профиль.

Целевая цепочка:

```text
ChatGPT writing block
→ extension фиксирует prompt после user-turn anchor
→ POST одного idempotent job в Bridge 2
→ server-owned scheduler выполняет CLI
→ extension получает один terminal report
→ server delivery claim
→ server commit до единственного Send-click
→ фактический matching user-turn подтверждает delivery
→ extension ждёт следующий writing block
```

Роли компонентов:

- **ChatGPT** анализирует, принимает решения, формирует CLI-task и проверяет результат.
- **Extension** связывает конкретный ChatGPT-диалог с конкретным Bridge-профилем, передаёт job и доставляет report.
- **Bridge server** является authoritative owner chain/job/delivery state, запускает CLI, хранит состояние и обеспечивает idempotency.
- **CLI** выполняет одну точную задачу и возвращает terminal report.

## 2. Multi-Bridge модель

Одна установка расширения может хранить несколько Bridge-профилей.

Каждый профиль содержит:

```text
profile_id
endpoint / local tunnel
credential_ref
bridge_instance_id
api_contract
deployment_revision
profile_revision
```

Поддерживается:

- несколько серверов;
- разные токены для разных серверов;
- разные ChatGPT-диалоги через разные серверы одновременно;
- много параллельных runs;
- несколько CLI-профилей на каждом сервере.

При создании run профиль копируется в immutable snapshot. Смена выбранного профиля влияет только на следующий новый run и не переносит уже активный run на другой сервер.

Отсутствующий или повреждённый bound profile должен приводить к явной ошибке. Молчаливый fallback на другой сервер запрещён.

## 3. Сохранённые продуктовые инварианты

- один writing block создаёт не более одного idempotent job;
- один terminal result получает один delivery ID;
- server commit выполняется до единственного необратимого Send-click;
- после commit повторный Send запрещён;
- после потери browser acknowledgment разрешено только reconciliation существующего user-turn;
- Prefix Helper совместим через подтверждение полного report/summary в новом user-turn;
- ручной текст composer не перезаписывается;
- событийная активация точной вкладки сохранена перед конкретной доставкой;
- сохранён безопасный ручной выбор Send-кнопки как fallback при изменении DOM;
- Pause не отменяет уже выполняющуюся server task;
- Finish прекращает дальнейшее получение и доставку отчётов;
- server identity закрепляется по `bridge_instance_id`;
- active run не меняется при изменении dropdown или настроек следующего run;
- механизм захвата writing/code blocks сохранён из доказанной версии и контролируется hash-тестом.

## 4. Удалённый функционал

Полностью удалена отдельная периодическая активация вкладки/окна каждые 20 секунд:

- нет UI-настройки;
- нет storage-конфигурации;
- нет timer;
- нет alarm;
- нет runtime-веток;
- нет diagnostics этой функции.

Событийная активация нужной вкладки перед конкретным действием сохранена.

Также удалены из чистой alpha 1:

- hardcoded bootstrap token;
- extension `key`;
- `externally_connectable`;
- `scripting` permission;
- `unlimitedStorage` permission;
- forced `/v1/executors` refresh;
- client-side executor subprocess probing;
- document Send retry loop;
- compatibility fallback на Business Bridge 1 API.

## 5. Структура extension alpha 1

```text
manifest.json
service_worker.js
content_script.js
popup.html
popup.css
popup.js
shared/protocol.js
shared/model.js
shared/proven_writing_block_capture.js
tests/
```

Архитектурные роли:

```text
Profile Manager
Conversation Adapter
Chain Coordinator
Job Transport
Delivery Coordinator
Popup UI
```

## 6. Хранение в extension

Token хранится только в `chrome.storage.local`, отдельно от публичной записи профиля.

Token запрещено:

- выводить в popup;
- писать в diagnostics;
- экспортировать в backup;
- хранить в sync storage;
- включать в ZIP или документацию.

Активный run хранит immutable snapshot:

```text
profile_id
profile_revision
endpoint
credential_ref
bridge_instance_id
api_contract
deployment_revision
```

Старый credential сохраняется только пока используется активным run. После потери всех ссылок credential должен удаляться garbage collector.

Browser storage не является authoritative task database. Authoritative chain/job/delivery state принадлежит серверу.

## 7. Business Bridge 2 server architecture

Bridge 2 разворачивается рядом с Bridge 1 и не изменяет его.

Side-by-side alpha defaults:

```text
Bridge 1 root: /opt/business-bridge-80
Bridge 1 service: business-bridge-control-api-80.service
Bridge 1 listener: 127.0.0.1:18082

Bridge 2 root: /opt/business-bridge-2
Bridge 2 service: business-bridge-2.service
Bridge 2 listener: 127.0.0.1:18083
Bridge 2 API prefix: /v2
```

Целевая серверная схема:

```text
bounded HTTP API
→ SQLite WAL
→ persistent scheduler
→ bounded job worker pool
→ executor health cache + single-flight
→ process supervisor
→ artifacts only for large stdout/stderr/final message
```

Read endpoints не должны:

- запускать subprocess;
- выполнять recovery;
- обходить archive/queue;
- изменять chain/job state;
- зависеть от количества исторических task records.

## 8. Server persistence model

SQLite tables:

```text
meta
chains
jobs
deliveries
executor_health
events
```

### Chain states

```text
active | paused | terminated
```

### Job states

```text
queued | running | succeeded | failed | interrupted | cancelled
```

### Delivery states

```text
available | claimed | committed | confirmed
```

Основные правила:

- `idempotency_key` уникален;
- `(chain_id, sequence)` уникален;
- следующий job разрешён только после confirmed delivery предыдущего;
- running job после server restart становится `interrupted` и автоматически не перезапускается;
- queued jobs после restart могут продолжаться;
- token не хранится в SQLite;
- prompt/report не пишутся в structured HTTP logs.

## 9. Server API contract alpha 1

### Authentication

```text
Authorization: Bearer <token>
```

Исключение: `GET /v2/health`.

Все JSON responses содержат `request_id`.

Стандартная ошибка:

```json
{
  "ok": false,
  "code": "STABLE_ERROR_CODE",
  "error": "human message",
  "request_id": "..."
}
```

### `GET /v2/health`

Без auth. Возвращает только availability/version/contract.

### `GET /v2/identity`

Authenticated. Возвращает:

```text
instance_id
api_contract = business-bridge-v2
server_version
deployment_revision
started_at
```

### `GET /v2/executors`

Authenticated cheap cached read.

Запрещено запускать CLI subprocess из этого endpoint.

Ответ содержит:

```text
executor_id
display_name
kind
enabled
configured
health
checked_at
latency_ms
error_code
freshness
```

### `POST /v2/executors/refresh`

Запускает или присоединяется к одному background single-flight refresh. Не размножает probes.

### `POST /v2/chains`

Idempotent по `idempotency_key`.

```json
{
  "idempotency_key": "run UUID",
  "client_id": "extension installation UUID",
  "local_run_id": "run UUID",
  "conversation_ref": "conversation UUID or pending ref",
  "executor_id": "codex2"
}
```

### `GET /v2/chains/{chain_id}`

Cheap SQLite read.

### `POST /v2/chains/{chain_id}/bind-conversation`

Меняет только pending conversation reference на реальный ChatGPT conversation ID. Повторная привязка одного реального conversation ID к другому запрещена.

### `POST /v2/chains/{chain_id}/pause`

Не отменяет текущий queued/running job. Новые jobs отклоняются.

### `POST /v2/chains/{chain_id}/resume`

Разрешает следующий job.

### `POST /v2/chains/{chain_id}/terminate`

Не убивает уже запущенный CLI. Новые jobs отклоняются, дальнейшая browser delivery прекращается.

### `POST /v2/chains/{chain_id}/jobs`

Idempotent по `idempotency_key`, unique по `(chain_id, sequence)`.

```json
{
  "idempotency_key": "run:sequence:assistant_turn:fingerprint",
  "sequence": 0,
  "executor_id": "codex2",
  "assistant_turn_id": "ChatGPT assistant turn ID",
  "prompt_text": "exact writing-block body",
  "prompt_fingerprint": "fingerprint"
}
```

Job может быть принят при stale/unavailable executor health. Scheduler отвечает за ожидание восстановления. Catalog freshness не уничтожает profile list и не блокирует создание chain.

### `GET /v2/jobs/{job_id}?after_revision=N`

Cheap SQLite read. Не выполняет recovery/probes/filesystem archive scans.

Запрещено возвращать:

- `prompt_text`;
- absolute paths;
- token;
- stdout/stderr/final-message filesystem paths.

## 10. Delivery transaction

Один terminal job создаёт ровно один `delivery_id`.

### Claim

`POST /v2/jobs/{job_id}/delivery/claim`

```json
{
  "client_id": "client UUID",
  "run_id": "local run UUID"
}
```

Правила:

- `available → claimed`;
- повторный claim тем же owner возвращает ту же delivery;
- другой owner получает conflict;
- response содержит `report_text`, `report_hash`, `delivery_id`, `revision`.

### Commit

`POST /v2/jobs/{job_id}/delivery/commit`

```json
{
  "delivery_id": "...",
  "client_id": "client UUID"
}
```

Commit выполняется непосредственно перед единственным необратимым browser Send-click.

После commit сервер никогда не возвращает report как sendable повторно.

### Confirm

`POST /v2/jobs/{job_id}/delivery/confirm`

```json
{
  "delivery_id": "...",
  "client_id": "client UUID",
  "user_turn_id": "ChatGPT user turn ID"
}
```

Confirm:

- разрешён только из `committed`;
- idempotent;
- сохраняет `confirmed_user_turn_id`;
- увеличивает `chain.next_sequence` ровно один раз.

Никакие timer/recovery paths не могут переводить `committed` обратно в `available`.

## 11. Security invariants alpha 1

- bind только на loopback;
- уникальный случайный token минимум 32 bytes;
- token file mode `0600`;
- constant-time token comparison;
- bounded HTTP workers and queue;
- bounded request body;
- bounded job workers;
- bounded executor probe concurrency;
- commands только из server config arrays;
- browser API не принимает shell command, environment или working directory;
- `shell=False`;
- prompt рассматривается как недоверенный CLI input, но не как shell string Bridge;
- IDs валидируются;
- artifact paths создаются только из server-generated IDs;
- API не возвращает absolute server paths;
- structured logs не содержат token, prompt, report или Authorization header;
- read endpoints не запускают subprocess и не меняют runtime state.

Alpha 1 side-by-side compatibility mode временно может использовать root и unsafe CLI flags, потому что существующие CLI credentials находятся у root. Это не финальная public hardening модель и должно быть явно обозначено как `TEST_COMPATIBILITY_MODE`.

## 12. Extension alpha 1 tests

Результат:

```text
Node tests: 10 passed
Failed: 0
JavaScript syntax: passed
Manifest parse: passed
Chromium extension load smoke: no manifest/load errors detected
```

Проверено:

- exact SHA-preserved writing-block capture implementation from v1.8.37.9;
- fail-closed bound profile;
- immutable routing snapshot;
- delivery commit/confirm state machine;
- committed delivery не становится sendable повторно;
- отсутствие periodic 20-second activation subsystem;
- сохранение event-driven tab activation;
- отсутствие embedded extension key;
- отсутствие externally_connectable;
- отсутствие unlimitedStorage и scripting permissions;
- cached `/v2/executors` contract без `force:true`;
- commit-before-click boundary;
- отсутствие document retry-click loop.

Writing-block capture SHA-256:

```text
77b5d6b33b056b5928cba531ec11e9f74dcb64cbbd1122b9a0846610aefe9dcc
```

Extension files SHA-256:

```text
manifest.json                         700b38f9cd553a219064f51088a1bc3e8bee49b5756ac0daf13dd34138db6fb6
service_worker.js                     0f39864640e756dd484a93d930bb915cc688e8c26a6e670ac5f0637e9dc76e4c
content_script.js                     0239103fcfa3241f540bc7b9e6325467e8ee0ad6bf80c21468d14551fa376795
popup.html                            a64c453447eef91d0dfd6ab8bc02f1c2616787457a551432194d022c6f48a397
popup.css                             50818aa9cf1b2adb5861ce5b05a140352684b7a1733a20e52b9bd2289e362946
popup.js                              8c61f32656eec2d9960e31b198a91efecf7d0255fff00ba80ca95520abf148ed
shared/protocol.js                    3976c76cdda19ca26e1e8a489845f56903736e4298d5c1fbee12ffc8ee3908ad
shared/model.js                       86beffe016801ad2d0a7505e60c971f6360b47f0141632e236fbc6ad5ce02166
shared/proven_writing_block_capture.js 5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef
```

## 13. Extension artifact

Файл:

```text
business-bridge-chatgpt-extension-v2.0.0-alpha1.zip
```

SHA-256:

```text
3dc3240177c8097b5e59179c8d16e7e67da0356751935c32e79cb2f524108b1c
```

## 14. Known limitations alpha 1

- требуется новый сервер Business Bridge 2 с `/v2`;
- Bridge 1 API не поддерживается;
- endpoint профиля ограничен localhost/127.0.0.1/::1 и рассчитан на SSH tunnel;
- реальный Chrome end-to-end ещё не выполнен;
- DOM ChatGPT может измениться;
- attachment path требует отдельного live test большого report;
- удаление Bridge-профиля через UI пока не реализовано;
- token физически хранится строкой в Chrome local storage;
- сервер alpha 1 side-by-side может временно работать от root;
- alpha 1 не реализует отдельные аккаунты/тенанты: один token означает одну общую доверенную группу;
- старый Bridge 1 пока остаётся рядом и не удаляется.

## 15. Live acceptance gate

Alpha 1 принимается только после следующего сценария:

```text
профиль Bridge 2 добавлен и identity закреплена
→ Start отправляет один «поехали»
→ один writing block создаёт один server job
→ terminal report claim/commit
→ один Send-click
→ Prefix Helper при наличии добавляет prefix
→ появляется один matching user-turn
→ delivery confirmed
→ следующий writing block создаёт ровно следующий job
→ второй параллельный диалог не смешивает chain/job/report
→ разные диалоги могут использовать разные Bridge-профили
→ переключение dropdown не меняет активный run
→ отсутствует периодическая активация каждые 20 секунд
```

Дополнительно проверяются:

- browser reload;
- service-worker suspension;
- server restart между jobs;
- потеря acknowledgment после commit;
- duplicate POST;
- stale executor catalog;
- временная потеря SSH tunnel;
- два клиента с одним token;
- большой report через attachment path.

## 16. Rollback alpha 1

Extension rollback:

1. Отключить Business Bridge 2 extension.
2. Включить сохранённую Business Bridge 1 extension.
3. Обновить вкладку ChatGPT.
4. Не повторять Send для delivery, которая могла быть committed или уже отправлена.

Server rollback:

1. Остановить только `business-bridge-2.service`.
2. Не менять `business-bridge-control-api-80.service`.
3. Не удалять Bridge 1 root/state/token/queue.
4. При необходимости восстановить только backup `/opt/business-bridge-2`.

Storage keys Business Bridge 2 имеют отдельный префикс `bb2_`. Автоматической миграции старых active runs нет.

## 17. Server implementation artifact

Текущий server-side implementation prompt:

```text
BB2_SERVER_SIDE_BY_SIDE_IMPLEMENTATION_PROMPT_2026-07-12.md
```

SHA-256:

```text
771c0ff9b310424099bc123c5665a9f6b95f071912e23de828a674d7b0964033
```

Этот prompt является отдельным исполнительным артефактом, а не вторым файлом документации. Его результат после выполнения должен быть добавлен новым append-only разделом в конец этого документа.

---

# APPEND TEMPLATE FOR NEXT PATCH

Новый patch добавляется только в конец файла по шаблону:

```markdown
# VERSION ENTRY — <version>

Дата: YYYY-MM-DD
Technical ID: ...
Base version: ...
Artifact: ...
SHA-256: ...

## Причина изменения

## Доказанная первопричина

## Scope

## Изменённые файлы

## Удалённый функционал

## Сохранённые инварианты

## API / storage / schema changes

## Migration

## Tests

## Live acceptance

## Security impact

## Known limitations

## Rollback

## Final status
```


---

# Version entry — 2.0.0-alpha.1 server side-by-side deployment

**Date:** 2026-07-12  
**Technical ID:** `BB80-BUSINESS-BRIDGE-2-SIDE-BY-SIDE-IMPLEMENTATION-20260712-01`  
**Status:** Runtime report accepted provisionally; source-level acceptance and real Chrome end-to-end acceptance remain pending.

## Purpose

Deploy Business Bridge 2 beside the existing Business Bridge 1 without replacing or modifying Bridge 1.

## Reported deployment

- Root: `/opt/business-bridge-2`
- Service: `business-bridge-2.service`
- Listener: `127.0.0.1:18083`
- Version: `2.0.0-alpha.1`
- Deployment revision: `1b37957feef3a6dd6ff5988d2b31ed5fb7ee6081019145b16e6ca374b96d1195`
- Persistence: SQLite WAL
- Bridge 1 remained active on `127.0.0.1:18082`
- Bridge 1 PID remained `1319908`
- Bridge 1 source and unit hashes were reported unchanged

## Reported implementation properties

- Bounded HTTP worker pool and admission queue
- Maximum request-body size
- Cached executor health
- Single-flight executor refresh
- `GET /v2/executors` does not spawn CLI subprocesses
- Persistent scheduler and bounded job worker pool
- SQLite-backed chains, jobs, deliveries, executor health, and events
- Idempotent chain/job creation
- Delivery states: `available → claimed → committed → confirmed`
- Committed delivery is never returned to a sendable state
- API responses do not expose prompt text, tokens, or absolute artifact paths
- Token stored in a `0600` file
- `shell=True` is not used

## Reported tests

- Unit tests: 16 passed, 0 failed
- 20 parallel cached executor reads returned HTTP 200
- No executor subprocesses were created by parallel executor reads
- Dry chain lifecycle test passed
- One harmless real Codex2 job completed once
- Delivery claim, commit, and confirm passed
- Chain sequence advanced exactly once
- Restart recovery was covered by offline tests

## Preserved invariants

- Bridge 1 remains installed and operational
- Bridge 2 uses a separate root, service, listener, token, database, state, logs, and artifacts
- Multiple conversations and chains may execute concurrently
- Browser clients cannot submit arbitrary shell commands, command arrays, environment variables, or working directories
- Server owns job and delivery state
- Extension owns only the browser-side ChatGPT delivery transaction
- Periodic 20-second tab/window activation is not part of Business Bridge 2
- Event-driven activation of the specific run tab/window remains part of the target design

## Deployment deviation

Codex stopped `bridge80-jokes-20260706-001.service` because it occupied port `18083`.

This was an operational change outside Bridge 1 and Bridge 2. It must not be silently treated as part of the normal installation procedure. Before public installation documentation is finalized, port allocation must be checked first and conflicts must cause a clear stop or require explicit owner approval. Install instructions must never stop an unrelated service automatically.

## Acceptance status

Accepted from the report:

- Bridge 2 is reported active beside Bridge 1
- Bridge 1 is reported unchanged
- Basic API, queue, executor-cache, idempotency, and delivery tests passed

Not yet independently accepted:

- Exact server source implementation
- Complete API compatibility with the extension
- Security properties claimed by the report
- Migration and restart behavior in the installed runtime
- Browser-to-server-to-CLI-to-browser real Chrome flow
- Parallel multi-conversation behavior with the actual extension
- Prefix Helper integration
- Event-driven tab activation behavior
- Absence of duplicate Send, duplicate job, and cross-dialog delivery under real timing
- Source archive reproducibility

## Required source artifacts

- `/root/business-bridge-2-alpha1-source.tar.gz`
- Expected SHA-256: `b233baab9fc3055b647b004be7183042c68c6b7b29ea218750413bad8ee9b6fa`
- `/root/business-bridge-2-alpha1-install-facts.md`

## Known alpha limitations

- Bridge 2 runs as root in compatibility test mode
- `NoNewPrivileges=false`
- Codex and MiMo prompts use the proven argv form
- Prompt text may therefore be temporarily visible in the process list
- Restart recovery was not demonstrated by interrupting a real live CLI job
- No real Chrome extension end-to-end acceptance has been completed
- A pre-existing service conflict existed on port `18083`

## Rollback

- Stop only `business-bridge-2.service`
- Restore only the Bridge 2 directory from a Bridge 2 backup when applicable
- Do not modify or roll back Bridge 1

## Next gate

Independently inspect the sanitized Bridge 2 source archive and install facts, compare the implementation with the extension’s actual `/v2` client contract, then run a controlled real Chrome acceptance cycle through a new SSH tunnel to `127.0.0.1:18083`.

---

# Version entry — 2.0.0-alpha.2 extension hardening and server alpha.1 source rejection

**Date:** 2026-07-12  
**Extension version:** `2.0.0-alpha.2`  
**Manifest version:** `2.0.0.2`  
**Server target version:** `2.0.0-alpha.2`  
**Status:** Extension candidate built and statically verified. Installed server `2.0.0-alpha.1` rejected for real Chrome end-to-end testing until the server hardening patch is completed.

## Inputs independently inspected

- `business-bridge-2-alpha1-source.tar.gz`
- Expected and verified source archive SHA-256: `b233baab9fc3055b647b004be7183042c68c6b7b29ea218750413bad8ee9b6fa`
- `business-bridge-2-alpha1-install-facts.md`
- Business Bridge 2 extension `2.0.0-alpha.1`
- Prior architecture audit, forensic reports, and durable-delivery invariants

## Server alpha.1 acceptance verdict

The side-by-side deployment report was useful and the basic architecture is materially better than Bridge 1, but source inspection found release blockers that were not covered by the original `16/16` test suite. Server alpha.1 must not be used for the first real browser delivery test.

### Confirmed release blockers

1. **Unauthenticated state reads**
   - `GET /v2/chains/<chain_id>` did not require authentication.
   - `GET /v2/jobs/<job_id>` did not require authentication.
   - These responses exposed conversation references, executor selection, state, revision, and job metadata.

2. **Empty-token authorization**
   - An existing empty token file was accepted.
   - `Authorization: Bearer ` could authorize when the configured token was empty.

3. **Incomplete delivery ownership**
   - Claim ownership used `client_id + run_id`.
   - Commit and confirm checked only `client_id`.
   - A different run from the same browser installation could commit or confirm another run’s delivery.
   - The delivery path did not strictly verify that the URL `job_id` matched the delivery’s stored `job_id`.

4. **Subprocess launch failures can strand jobs in `running`**
   - A `Popen` exception could escape without terminalizing the job or creating a delivery.

### Additional confirmed correctness defects

- A committed delivery could be claimed again by the same owner and return `report_text` without a distinct reconciliation-only contract.
- A terminated chain could be resumed.
- Paused or terminated chains prevented an already accepted queued job from running, contradicting the defined rule that pause/terminate do not cancel the current accepted task.
- A chain created for one executor could submit a job for another executor.
- Reuse of an idempotency key with different semantic input silently returned the original object instead of a stable conflict.
- A second idempotency key for the same `(chain_id, sequence)` could fall through to a generic SQLite/server error instead of a stable `409`.
- Executor catalog freshness remained `fresh` indefinitely after any completed refresh, regardless of age.
- `BB2_HOST` was not restricted to loopback.
- Existing token file permissions and token strength were not revalidated.
- Existing instance identity was not validated as a UUID.
- Atomic identity/token writes lacked an explicit fsync durability gate.
- Health probe subprocesses did not use their own process groups for descendant cleanup.
- Schema initialization did not provide a strict versioned migration gate.
- Queue/event lookup indexes and retention policies were incomplete.

### Output and process-supervision defects

- stdout and stderr were collected through `PIPE + communicate`, allowing unbounded in-memory growth.
- `final_message.md` was read in full before enforcing the report limit.
- The report limit was applied as characters rather than UTF-8 bytes.
- A failure between terminal job update and delivery creation could leave a terminal job without a delivery.
- Timeout cleanup could itself throw and leave inconsistent job state.
- Restart interruption needed to guarantee a terminal report/delivery, not only a state transition.

## Product semantics clarified for server alpha.2

- All endpoints except `GET /v2/health` require authorization.
- A server token identifies one trusted group, not isolated tenants.
- A Bridge instance supports many clients, browsers, conversations, chains, jobs, projects, and executor profiles.
- The browser may not submit command arrays, shell strings, environment variables, or working directories.
- A chain has one immutable executor selection.
- Pause and terminate reject new jobs but do not cancel or suppress a job that was already accepted.
- Terminated is final.
- Every accepted job eventually becomes terminal and receives exactly one durable delivery, including launch failures, timeouts, and server-restart interruption.
- Delivery ownership is the exact tuple `delivery_id + job_id + client_id + run_id`.
- After commit, delivery is never sendable again. The exact owner may retrieve reconciliation material only with an explicit non-sendable server state.

## Extension alpha.2 changes

### Durable start transaction

The initial `поехали` message now uses the same irreversible-boundary principle as report delivery:

```text
prepare composer
→ persist start committed state
→ one click
→ confirm matching user-turn
```

After the commit boundary, reload, worker suspension, or lost callback can only reconcile the existing user-turn. The extension must never click Send again for that start transaction.

### Delivery ownership and integrity

- Claim, commit, and confirm include `run_id`.
- The extension validates returned `job_id`, `delivery_id`, and server delivery state.
- The extension verifies SHA-256 of `report_text` before using it.
- Bridge response bodies are byte-bounded while streaming.
- A compatibility fallback for environments without a streaming response reader uses one bounded `response.text()` read and does not recurse.

### Parallel-dialog and storage safety

- Shared run-index mutation is serialized.
- Profile, credential, binding, diagnostics, and executor-catalog mutations use explicit storage locks.
- Client installation ID creation is serialized.
- Error runs are terminal for active-run selection and credential retention.
- Popup actions carry the original tab/origin/conversation context and fail if the popup context changed before the worker acts.
- Executor catalog refresh is client-side single-flight and protected against stale-generation overwrite.

### Send-control safety

- Automatic selection refuses zero-confidence buttons.
- A manually recorded Send profile does not silently fall back to another control if it no longer matches.
- Attachment/report delivery has no repeated click loop.
- Both start and report paths commit before their single allowed click.

### Preserved mechanisms

- Multi-server profiles, each with endpoint, token reference, and Bridge identity
- Immutable server snapshot inside an active run
- Parallel conversations through different servers
- Event-driven activation of the exact run tab/window
- Prefix Helper compatibility
- User-turn confirmation as delivery truth
- Manual composer protection
- Proven writing/code-block capture implementation retained verbatim
- No automatic run completion after a report

### Removed mechanism

Only the independent periodic prompt-wait tab/window activation subsystem, previously running approximately every 20 seconds, remains removed. Ordinary prompt observation and event-driven activation are preserved.

## Extension alpha.2 tests

- Node tests: `17 passed`, `0 failed`
- JavaScript syntax checks passed for all runtime modules
- The generated ZIP was extracted and the complete test suite was run again against the unpacked artifact
- Writing-block capture preservation test passed
- No embedded bootstrap token
- No `externally_connectable`
- No `scripting` permission
- No `unlimitedStorage` permission
- No periodic 20-second activation subsystem
- No document/report retry-click loop

## Extension alpha.2 artifacts

- ZIP: `business-bridge-chatgpt-extension-v2.0.0-alpha2.zip`
- ZIP SHA-256: `127b6b077368b1675ea1addb650b3776d8c39f9a01cbea253e87af42572cec63`
- ZIP size: `36601` bytes
- Test evidence: `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_ALPHA2.json`
- Test-evidence SHA-256: `9795f74008e19524e64e6a818725dd01692034e2b45ccd523bd1a2a249ad96ad`

## Known alpha.2 limitations

- No live Chrome test has been run against server alpha.2 because server alpha.2 is not installed yet.
- ChatGPT DOM compatibility remains subject to live acceptance.
- The extension stores server tokens in `chrome.storage.local`; this is the declared local-extension trust model for the current release line.
- Event-driven window focus is still present and must be validated for necessity and correctness in live tests.
- The server currently runs CLI in root compatibility mode; public hardened execution mode remains a later gate.

## Server patch safety gates

- Bridge 1 must remain untouched.
- Bridge 2 must be backed up before patching.
- No unrelated service may be stopped, restarted, disabled, or edited automatically.
- A port conflict must stop the task with evidence unless the owner explicitly approves a port change or service action.
- The existing Bridge 2 token and instance identity should remain stable unless validation proves them invalid; any rotation requires an explicit report and re-enrollment warning.
- Database migration must be versioned, transactional, idempotent, and tested from the exact alpha.1 schema.

## Rollback

- Disable only extension alpha.2 and re-enable the preserved alpha.1 extension folder if browser rollback is needed.
- Stop only `business-bridge-2.service` and restore the Bridge 2 backup if server rollback is needed.
- Never use Bridge 1 as a rollback target for Bridge 2.

## Next gate

Patch server alpha.1 to server alpha.2 with Codex, obtain the complete report and sanitized source archive, independently audit the resulting server source, and only then perform the first controlled Chrome end-to-end test.

---

# Version entry — 2.0.0-alpha.2 server hardening deployment

**Date:** 2026-07-12  
**Technical ID:** `BB80-BUSINESS-BRIDGE-2-ALPHA2-HARDENING-20260712-02`  
**Status:** Runtime report accepted provisionally. Source-level audit and real Chrome acceptance remain pending.

## Reason for this patch

Server alpha.1 had release-blocking defects in authentication coverage, token validation, delivery ownership, idempotency, process supervision, terminal-delivery recovery, loopback binding, HTTP robustness, and executor freshness. Alpha.2 was intended to close those defects before any browser end-to-end test.

## Reported deployment result

- Bridge 2 upgraded from `2.0.0-alpha.1` to `2.0.0-alpha.2`
- Root: `/opt/business-bridge-2`
- Service: `business-bridge-2.service`
- Listener: `127.0.0.1:18083`
- Main PID after deployment: `1270595`
- Deployment revision: `8a3fd1421b5ed1500b8438381c95f2f47ba75eef9934acb7c27fb656efd55764`
- SQLite schema migrated from version `1` to version `2`
- Existing Bridge 2 token and instance identity were preserved
- Instance ID reported as `dd5f713e-23b4-4a25-8f99-6dfd4ebe3310`
- Bridge 1 remained active with unchanged PID and source hashes
- No unrelated service was reported changed

## Reported security and correctness changes

- All data endpoints require Bearer authentication; only `/v2/health` is unauthenticated
- Token and instance identity files must be regular files with mode `0600`
- Blank, short, symlinked, or invalid token/identity data blocks startup
- Bind host is restricted to loopback
- Chain and job idempotency now compare semantic request content and return stable conflicts
- Executor selection is immutable within a chain
- Terminated chains cannot be resumed
- Accepted queued/running jobs survive pause or terminate state changes
- Delivery ownership includes exact `delivery_id + job_id + client_id + run_id`
- Commit and confirm are owner-checked and idempotent
- Confirmation increments chain sequence exactly once
- Every terminal job is reconciled to exactly one delivery
- Process launch, timeout, and output failures terminalize jobs instead of leaving them running
- Restart changes running jobs to interrupted without automatic rerun
- Executor reads remain cached and subprocess-free
- Freshness transitions to stale by age
- HTTP body, method, JSON, and admission behavior are bounded
- Structured logs exclude token, prompt, report, and raw body content

## Reported tests

- Unit and integration suite: `32 passed`, `0 failed`
- 50 concurrent executor reads returned HTTP 200 with no probe subprocesses
- 20 concurrent refresh callers collapsed to one refresh per executor profile
- Exact and conflicting chain/job idempotency were tested
- Delivery owner mismatch for another run was rejected
- Commit/confirm/reconciliation behavior was tested
- Missing executable and timeout paths produced terminal jobs with deliveries
- Restart recovery produced interrupted jobs without rerun
- Real harmless Codex2 E2E job succeeded and completed delivery confirmation
- SQLite `foreign_key_check=0` and `integrity_check=ok`

## Important reported observation

`codex2` was the successful live executor profile. A live `codex-default` attempt failed fast with `executor_command_failed`, but the supervisor correctly terminalized it and created a delivery. The exact reason for the `codex-default` profile failure remains to be inspected in the source/configuration audit.

## Preserved invariants

- Bridge 1 is not a rollback target and remains untouched
- Bridge 2 remains side-by-side on its own root, service, port, database, token, state, logs, and artifacts
- Multiple browser clients, conversations, chains, and jobs can operate in parallel under one trusted server token
- A running chain keeps its selected executor and server binding
- Committed delivery is never sendable again
- Browser reconciliation may inspect committed/confirmed report material but may not repeat Send
- Periodic 20-second tab/window activation remains removed
- Event-driven activation of the exact run tab/window remains required
- No automatic run completion after report delivery is introduced

## Reported backup and rollback artifacts

- Primary pre-deploy backup: `/root/business-bridge-2-before-alpha2-deploy-20260712-02.tar.gz`
- Backup SHA-256: `fd5443e456bc292c5d975807dcca784a2fd636776d7afa938bde47258e851a39`
- Additional pre-alpha.2 backup: `/root/business-bridge-2-before-alpha2-20260712-02.tar.gz`
- Separate root-only token rollback archive: `/root/business-bridge-2-before-alpha2-20260712-02-token.tar.gz`

## Source handoff artifacts

- Source archive: `/root/business-bridge-2-alpha2-source.tar.gz`
- Expected source archive SHA-256: `e86f07535095d3b05f14c8bb4198560f387af63264f91e8233eae9e68bc0a328`
- Archive size reported: `31102` bytes
- Archive entries reported: `31` files and `5` directories
- Install facts: `/root/business-bridge-2-alpha2-install-facts.md`

## Known alpha.2 limitations

- The service still runs as root in compatibility test mode
- `NoNewPrivileges=false` remains in use
- Prompt text is still passed in process argv for Codex and MiMo
- One trusted token covers all clients; there is no tenant isolation
- `codex-default` is not yet proven operational on this deployment
- Real Chrome extension integration has not yet been run
- Prefix Helper integration, event-driven focus behavior, multiple simultaneous conversations, worker suspension recovery, and duplicate-prevention under real browser timing remain unaccepted

## Independent acceptance status

Accepted provisionally from the runtime report:

- Service deployment and schema migration completed
- Bridge 1 was reported unchanged
- Core server security and correctness tests passed
- Cached executor reads no longer create probe storms
- A harmless real server-side Codex2 lifecycle completed

Not yet independently accepted:

- Exact source implementation and migration code
- Claimed endpoint authentication matrix
- Token/identity file validation implementation
- Delivery ownership and idempotency implementation
- Process-group cleanup and bounded output implementation
- Source archive safety and reproducibility
- Exact compatibility with extension `2.0.0-alpha.2`
- Real Chrome end-to-end behavior

## Next gate

Download and independently audit `business-bridge-2-alpha2-source.tar.gz` and `business-bridge-2-alpha2-install-facts.md`. Only after source/API compatibility is accepted may the new SSH tunnel and first controlled Chrome end-to-end test be started.

---

# Version entry — Extension 2.0.0-alpha.3 single-flight and bounded recovery

**Date:** 2026-07-12  
**Status:** Built and locally verified; real Chrome end-to-end acceptance remains pending.

## Reason for this patch

Static review of extension `2.0.0-alpha.2` found a duplicate-Send race and unbounded retry behavior that were not covered by the alpha.2 tests:

1. Two overlapping poll/recovery triggers could enter report delivery for the same run at the same time. Both could prepare the same claimed delivery; after the first committed it, the second content request could observe the committed state and still perform a second `button.click()`.
2. A double Start action could create two server chains before either browser run became visible locally.
3. Permanent server rejections such as `409 IDEMPOTENCY_CONFLICT`, `DELIVERY_OWNED`, `CONFIRMATION_CONFLICT`, invalid auth, or missing resources were treated like transient network failures and could be retried forever.
4. Delivery/start reconciliation used fixed short retry intervals and could repeatedly activate the run tab/window without a bound.
5. Diagnostic redaction was shallow and did not sanitize sensitive field names nested inside objects or arrays.

## Changed runtime files

- `service_worker.js`
- `shared/protocol.js`
- `shared/model.js`
- `content_script.js` — version string only; delivery and writing-block mechanics were not changed
- `manifest.json`
- `package.json`

## Reliability changes

- Added per-run single-flight for the complete poll cycle.
- Added per-run single-flight for the complete report delivery attempt.
- Serialized Start by stable conversation context, or by pending tab context before a conversation ID exists.
- Added stable error disposition: transient retry, permanent fatal failure, or manual-action pause.
- Added bounded exponential retry delays up to 60 seconds.
- Added automatic retry limits for ChatGPT start and delivery reconciliation.
- Permanent pre-job submission failures terminate the local run rather than loop indefinitely.
- Permanent delivery ownership, identity, integrity, or confirmation failures pause the run for explicit manual action and do not retry Send.
- Server `request_id` is retained in safe diagnostics when supplied.
- Nested diagnostic objects and arrays are recursively redacted.

## Duplicate-prevention change

The critical browser race is now fenced as follows:

```text
poll timer / recovery alarm / content-ready event
→ one single-flight poll cycle for run_id
→ one single-flight delivery attempt for run_id
→ server delivery commit before click
→ exactly one content delivery request may reach click for that run in the current worker lifetime
```

Durable server commit still remains the protection across service-worker restart. After commit, recovery is reconciliation-only and never schedules a second Send.

## Retry policy

Transient examples:

- network failure;
- request timeout;
- HTTP 408/425/429/500/502/503/504.

Permanent or manual-action examples:

- invalid authentication;
- idempotency or sequence conflict;
- executor mismatch;
- terminated/paused chain rejection;
- delivery owned by another client or run;
- delivery identity/hash/integrity mismatch;
- confirmation conflict;
- bound conversation mismatch.

Permanent delivery errors do not release or recreate the delivery and do not click Send again.

## Preserved invariants

- Multi-server profile selection is unchanged.
- The active run retains an immutable profile snapshot.
- Different conversations may run in parallel through different servers.
- The proven writing-block capture implementation is preserved unchanged.
- Prefix Helper compatibility remains based on confirming the actual new user-turn.
- Start and report delivery still commit before the single allowed click.
- Attachment delivery still has no retry-click loop.
- Periodic 20-second tab/window activation remains absent.
- Event-driven activation of the exact run tab/window remains present.
- Automatic completion of the run after a report was not added.

## Tests

Source tree:

```text
25 passed
0 failed
```

The same suite was executed again from a fresh extraction of the completed ZIP:

```text
25 passed
0 failed
```

Additional coverage includes:

- actual Promise single-flight joining and release;
- retry/permanent/manual error classification;
- bounded exponential backoff;
- preservation of resume state during manual-action pause;
- source guards proving single-flight poll and delivery wiring;
- source guard proving Start serialization;
- source guard proving recursive diagnostic redaction;
- preserved writing-block capture hash contract.

All JavaScript runtime files passed `node --check`.

## Build artifact

- ZIP: `business-bridge-chatgpt-extension-v2.0.0-alpha3.zip`
- SHA-256: `b44d02a7577933e8f24633cbb23452dc08edc69b1f735c6cf5e1450833503281`
- Test evidence: `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_ALPHA3.json`
- Test evidence SHA-256: `2ac25887fe7afa9572ec36c7a2c3064d32903c2ceb1d9eea785ea2e3d7a35b67`

## Known limitations

- No real user Chrome end-to-end cycle has yet been accepted.
- ChatGPT DOM selectors, attachment UI, Prefix Helper timing, and user-turn reconciliation still require live acceptance.
- Tokens remain in `chrome.storage.local` under the documented extension trust model.
- Event-driven activation of the exact run tab/window is intentionally retained.
- The installed server alpha.2 source still requires independent source/API verification.

## Rollback

- Disable extension `2.0.0-alpha.3`.
- Re-enable the preserved unpacked `2.0.0-alpha.2` folder.
- Do not repeat Send for any delivery that may already have crossed the commit boundary.
- No server rollback is required because alpha.3 changes only the extension.

## Next gate

Run a read-only source and API compatibility audit directly on the installed Bridge 2 alpha.2 through Codex, without requiring the owner to download another archive. After that audit is accepted, perform the first controlled real Chrome cycle using extension alpha.3 and server alpha.2.

---

# Version entry — 2.0.0-alpha.3 extension compatibility audit against server 2.0.0-alpha.2

**Date:** 2026-07-12  
**Technical ID:** `BB80-BB2-ALPHA2-INSTALLED-SOURCE-AND-EXTENSION-ALPHA3-COMPATIBILITY-AUDIT-20260712-03`  
**Status:** Server/extension contract accepted for controlled real Chrome E2E. Public-release acceptance is not yet granted.

## Scope

Read-only audit of the installed Business Bridge 2 server `2.0.0-alpha.2` against Business Bridge extension `2.0.0-alpha.3`.

## Accepted findings

- Bridge 2 is active on `127.0.0.1:18083`.
- Bridge 1 remained active and unchanged on `127.0.0.1:18082`.
- Installed server version is `2.0.0-alpha.2` with SQLite schema version `2`.
- Server and extension request/response contracts are compatible on the tested surface.
- Identity, executor catalog, chain, job, delivery claim, delivery commit, and delivery confirm contracts match the extension.
- Delivery ownership includes `delivery_id + job_id + client_id + run_id`.
- Committed and confirmed delivery states remain non-sendable and return reconciliation material only to the exact owner.
- Duplicate claim, commit, and confirm requests are idempotent.
- `chain.next_sequence` increments exactly once after confirmation.
- GET read paths do not start CLI processes or recovery work.
- Executor refresh is single-flight.
- HTTP admission and executor/job concurrency are bounded.
- Terminal job finalization and delivery creation use one transactional path, with restart reconciliation for missing deliveries.
- Process supervisor terminalizes missing executable, permission, timeout, and unexpected failure cases instead of leaving jobs in `running`.
- Restart recovery marks old running jobs `interrupted` and never automatically reruns them.
- Installed server tests passed `32/32`.
- Temporary concurrency sweeps with 100 callers passed.
- Live read-only endpoint checks passed.
- No service was restarted and no unrelated service was changed during the audit.

## Non-blocking differences

- `after_revision` is accepted and validated but currently does not provide long-poll or HTTP 304 semantics.
- Prompts are still passed through process argv in compatibility mode.
- Service still runs as root in compatibility mode.
- One trusted server token covers all trusted clients and chains; tenant isolation is not implemented.
- `codex-default` is operationally unavailable because its configured account hit a Codex usage limit. Command path and flags were not the cause. `codex2` remains the tested working profile.
- SQLite busy failures are not mapped to a distinct stable public error code; unexpected failures become `500 INTERNAL_ERROR`.

## Acceptance decision

The server `2.0.0-alpha.2` is accepted as compatible with extension `2.0.0-alpha.3` for a controlled real Chrome end-to-end test.

This does not yet mean:

- public-release ready;
- production secure;
- multi-browser and multi-conversation behavior proven under real ChatGPT timing;
- Prefix Helper integration proven in the real browser;
- event-driven tab activation proven;
- duplicate Send/job prevention proven with real service-worker suspension and page rerendering.

## Next gate

Run a controlled real Chrome E2E through a new SSH tunnel to local port `18083` using extension `2.0.0-alpha.3` and executor `codex2`.

The first live gate must verify:

1. profile enrollment and identity pinning;
2. exact conversation binding;
3. one Start user-turn;
4. one accepted writing block;
5. one server job;
6. one CLI execution;
7. one report delivery;
8. one confirmed user-turn;
9. one continuation slot;
10. no duplicate Send, duplicate job, cross-dialog routing, periodic 20-second activation, or stuck delivery state.

## Rollback

- Disable extension `2.0.0-alpha.3` and re-enable the previously preserved extension if browser rollback is required.
- Stop only `business-bridge-2.service` if server rollback is required.
- Do not modify Bridge 1.


---

# Version entry — 2.0.0-alpha.4 full reference-function restoration and start-delivery repair

**Date:** 2026-07-13  
**Scope:** Extension only  
**Status:** Candidate for controlled real Chrome acceptance. Versions `2.0.0-alpha.1`, `2.0.0-alpha.2`, and `2.0.0-alpha.3` of the extension are withdrawn from live testing because they did not preserve the full approved reference functionality and alpha.3 could remain at `START_COMMITTED_BEFORE_CLICK` without sufficient diagnostics.

## Reason for this version

The first Business Bridge 2 extension rebuilds over-minimized the popup and browser runtime. They preserved the new `/v2` server contract and some delivery invariants, but removed user-facing and operational functions that existed in the approved Business Bridge `v1.8.37.9` reference.

The live alpha.3 start attempt also produced only:

```text
RUN_CREATED
START_COMMITTED_BEFORE_CLICK
```

while the popup remained at:

```text
Создаю Bridge2 chain и отправляю «поехали»…
```

There was no evidence showing whether the actual button click occurred, whether Prefix Helper intercepted it, whether the ChatGPT DOM replaced the selected button, or whether a matching user-turn appeared.

Alpha.4 restores the reference feature surface, removes only the separately rejected periodic activation subsystem, and repairs the start path and diagnostics.

## Reference functionality restored

The following functions from the Business Bridge `v1.8.37.9` reference are present again:

1. Multiple Bridge server profiles with independent endpoint, token, identity, label, and revision.
2. Explicit binding of the selected Bridge profile to the current ChatGPT conversation.
3. Profile enrollment and update.
4. Default profile selection for new conversations.
5. Connection check and visible API/identity/catalog state.
6. CLI catalog refresh from the Bridge 2 cached `/v2/executors` endpoint.
7. Active-run count, active-run list, current-conversation run, page-monitor state, and latest task state.
8. CLI selection for the next iteration with a separate explicit Apply action.
9. Event-driven focus policy:
   - `off`;
   - `report_only`;
   - `always`.
10. Policy to wait for the selected CLI to recover or use a healthy enabled fallback for the next iteration.
11. Context-file attachment every N confirmed reports.
12. Clearing the stored context attachment.
13. Current iteration CLI, status, resource/recovery and failover presentation.
14. Manual Send-button picker.
15. Clearing the saved Send-button profile.
16. Start, Pause, Resume, and Terminate controls.
17. Diagnostics display, copy, and clear controls.
18. Full profile/settings export and import for migration between versions and folders.

## Function intentionally removed

Only the separate periodic prompt-wait activation subsystem is removed:

```text
periodic timer, formerly defaulting to 20 seconds
→ activate ChatGPT tab/window while merely waiting for the next prompt
```

The removal includes its UI, storage fields, timer, alarm, recovery branches, and diagnostics.

This does **not** remove event-driven activation of the exact run tab/window when a concrete operation requires it. Event-driven activation remains available through the focus policy.

## Start-path repair

Alpha.4 changes the start-delivery sequence to:

```text
stage «поехали»
→ resolve a stable enabled Send target
→ persist START commit
→ re-resolve the button if React replaced the original DOM node
→ dispatch exactly one Bridge click
→ return immediately to the popup
→ observe the resulting user-turn asynchronously
→ confirm the start anchor
```

The popup no longer waits synchronously for up to the full user-turn reconciliation timeout after click dispatch.

If the selected Send node disappears after commit but before click, the extension can abort the local start commit only while it has proof that no click was dispatched. After click dispatch, the extension never automatically clicks Start again.

## New start diagnostics

Alpha.4 records the exact stages:

- `START_TEXT_STAGED`
- `START_SEND_BUTTON_READY`
- `START_CLICK_ATTEMPT`
- `START_CLICK_DISPATCHED`
- `START_COMMIT_ABORTED_NO_CLICK`
- `START_USER_TURN_FOUND`
- `START_ANCHOR_TIMEOUT`
- `START_ANCHOR_WATCH_FAILED`

Delivery-stage click and anchor diagnostics are also retained.

These events make it possible to distinguish:

```text
text was never staged
button was never ready
commit occurred but no click occurred
click was dispatched
Prefix Helper or ChatGPT produced a user-turn
user-turn existed but identity/anchor binding failed
```

## Profile and settings migration

### Upgrade from the currently installed alpha.3 without losing the existing profile

The current alpha.3 unpacked directory must be upgraded **in place**:

1. Keep the same unpacked extension directory.
2. Replace its files with the contents of the alpha.4 ZIP.
3. In `chrome://extensions`, press **Reload** for the existing Business Bridge 2 card.
4. Do not remove the extension and do not load alpha.4 from a different directory for this transition.

For unpacked extensions without a fixed manifest key, Chrome storage remains associated with the current unpacked extension identity/path. In-place replacement therefore preserves the existing profile, token, bindings, Send-button profile, and run records.

### Explicit backup for future versions or folder moves

The popup now has:

- **Export settings**;
- **Import settings**.

The backup includes:

- Bridge profiles;
- profile tokens;
- default profile;
- conversation bindings;
- pending bindings;
- Send-button profile;
- next-iteration CLI settings;
- focus policies;
- selected-CLI recovery policy;
- context-attachment settings.

Import merges the settings and does not replace active runs.

**Security warning:** the exported JSON contains server tokens and must be treated as a secret. It must not be committed to Git, attached to public issues, or shared with untrusted users.

## Next-iteration CLI semantics

The selected CLI for the next iteration is no longer cosmetic.

When it differs from the current run executor, the extension creates a new Bridge 2 chain segment using the same browser run and conversation context, then atomically switches the run to the new chain. The old chain is terminated best-effort only after the new chain exists.

The browser run retains its own overall sequence while each new server chain segment begins with its own `chain_sequence`.

## Context attachment semantics

A stored context file can be attached every N confirmed reports.

- The interval is based on confirmed report deliveries.
- Optional context attachment failure does not cause a second Send click.
- If the attachment was due but not confirmed as uploaded, it remains due for a future report.
- Document/report delivery does not contain the old periodic retry-click loop.

## Preserved safety invariants

- One active run has an immutable server profile snapshot.
- Different conversations may use different Bridge servers in parallel.
- Missing bound profile fails closed instead of silently falling back to another server.
- One writing block creates at most one server job.
- Server delivery ownership includes the exact browser `client_id + run_id`.
- Start and report delivery persist the irreversible boundary before click.
- After click dispatch, automatic repeated Send is prohibited.
- Browser polling and delivery attempts are single-flight per run.
- Concurrent Start requests for the same conversation are serialized.
- Permanent server conflicts do not enter infinite retries.
- Transient retries use bounded exponential backoff.
- Manual composer text remains protected.
- Writing-block capture is preserved verbatim from the approved `v1.8.37.9` reference.
- Prefix Helper interception and delayed replay remain supported.
- No hardcoded Bridge token is included.

## Tests

### Node regression suite

```text
35 passed
0 failed
```

The suite was executed against:

1. the working source tree;
2. a fresh extraction of the final ZIP.

### JavaScript syntax

Passed:

- `service_worker.js`
- `content_script.js`
- `popup.js`

### Chromium Prefix Helper start harness

Passed with a simulated Prefix Helper sequence:

```text
Bridge click
→ Prefix Helper cancels the first click
→ delayed prefix insertion
→ Prefix Helper replay click
→ one ChatGPT user-turn containing prefix + «поехали»
→ asynchronous anchor observation
```

Observed diagnostics included:

```text
START_TEXT_STAGED
START_SEND_BUTTON_READY
START_CLICK_ATTEMPT
START_CLICK_DISPATCHED
START_USER_TURN_FOUND
```

### Writing-block capture

The source-preservation test confirms that the approved writing-block capture implementation remains verbatim relative to the `v1.8.37.9` reference.

## Changed files

- `manifest.json`
- `popup.html`
- `popup.css`
- `popup.js`
- `service_worker.js`
- `content_script.js`
- `tests/release_guards.test.mjs`
- `tests/worker_settings_runtime.test.mjs`
- `tests/chromium_start_prefix_harness.html`

The shared writing-block capture implementation was not changed.

## Build artifact

- ZIP: `business-bridge-chatgpt-extension-v2.0.0-alpha4.zip`
- SHA-256: `96c1fdb47aa33b134458f46140c457d872d29805117151080632937587ff7993`
- Test evidence: `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_ALPHA4.json`
- Test evidence SHA-256: `8372d07c21b0cd2a74085b31ec66c1316dcc01e9a90374eadc7c3beed6aa2803`

## Known limitations

- Real acceptance against the current live ChatGPT DOM and Bridge 2 server remains pending.
- The existing alpha.3 run that stopped at `START_COMMITTED_BEFORE_CLICK` has an uncertain send outcome because alpha.3 did not record click-stage evidence. Alpha.4 must not resend that Start automatically.
- After in-place upgrade, that uncertain run should be explicitly terminated once before starting a clean alpha.4 run.
- Unpacked extension IDs remain path-dependent without a fixed manifest key. In-place upgrade preserves current storage; explicit export/import handles later folder moves.
- The settings backup contains secrets.
- Server alpha.2 remains in root compatibility mode and CLI prompt argv exposure remains documented.

## Upgrade and first live-test gate

1. Replace files inside the current alpha.3 unpacked directory with alpha.4 files.
2. Reload the existing extension card.
3. Refresh the ChatGPT tab once.
4. Verify that the existing Bridge profile, token-derived identity, CLI selection, Send-button profile, and diagnostics remain visible.
5. Export settings once and store the JSON securely.
6. Explicitly terminate the uncertain old alpha.3 run.
7. Clear diagnostics.
8. Start one fresh alpha.4 run.
9. Confirm the following sequence in diagnostics:

```text
RUN_CREATED
START_TEXT_STAGED
START_SEND_BUTTON_READY
START_COMMITTED_BEFORE_CLICK
START_CLICK_ATTEMPT
START_CLICK_DISPATCHED
START_USER_TURN_FOUND
START_CONFIRMED
```

10. Continue with one writing block, one Bridge job, one CLI report, one delivery, and one confirmed continuation.

## Rollback

- Before replacement, preserve a copy of the current alpha.3 unpacked directory.
- To roll back browser code, restore that directory and click Reload.
- Do not repeat Start or report Send for any delivery whose click may already have been dispatched.
- No server rollback is required for this extension-only version.

---

# Version entry — Business Bridge 2 Extension 2.0.0-alpha.5

**Дата:** 2026-07-13  
**Статус:** кандидат для первого реального Chrome E2E; до live-проверки не называется принятой рабочей версией.  
**Артефакт:** `business-bridge-chatgpt-extension-v2.0.0-alpha5.zip`  
**SHA-256 ZIP:** `6aab4ecac415adf874d7aa2f592eeaf4665f1939cd66b3b8be862122e214e8be`  
**Test evidence:** `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_ALPHA5.json`  
**SHA-256 test evidence:** `89bb27ac24ea3df2f706216f23b6855db949baf81e6256561ef86525b627ef39`

## Причина выпуска

Версии `alpha.1–alpha.4` не должны рассматриваться как принятые релизы. В них новая архитектура была собрана раньше, чем был восстановлен и доказан полный продуктовый функционал референса. Кроме того, реальный Start пользователя остановился после `START_COMMITTED_BEFORE_CLICK`, а существовавший журнал не показывал следующий участок цепочки. Это означало, что сборка была передана раньше полноценной end-to-end проверки.

`alpha.5` не является построчным переносом старого кода. Старый `v1.8.37.9` используется как референс пользовательского поведения, инвариантов и известных поломок. Реализация остаётся новой и разделена на browser state model, protocol, service worker, ChatGPT adapter и popup.

## Исправление записи о Chromium-тесте alpha.4

В предыдущей append-only записи было указано, что Chromium Prefix Helper harness пройден. Эту формулировку нельзя трактовать как реальную проверку в пользовательском Chrome на текущем ChatGPT DOM. В данной среде полноценная навигация браузера блокируется политикой среды. Поэтому доказаны Node/runtime-модели и статические контракты, но реальный Chrome + ChatGPT + Prefix Helper + SSH tunnel + Bridge 2 остаётся обязательным acceptance gate.

## Полный функциональный контракт: раньше, проблема, alpha.5, обоснование

### 1. Несколько Bridge-профилей и серверов

**Как было раньше:** расширение хранило несколько профилей с endpoint, token и Bridge identity. Это позволяло разным диалогам работать через серверы 78, 80 и другие локальные туннели.

**Почему старая реализация была хрупкой:** enrollment одновременно добавлял профиль, мог менять глобальный активный профиль и определял активный ChatGPT-контекст после сетевой операции. Это создавало риск привязать профиль не к тому диалогу. Старые credential revisions могли накапливаться.

**Как сделано в alpha.5:** профили, credentials, default profile и conversation bindings разделены. Popup передаёт исходный `tab_id + origin + conversation_id`; worker повторно проверяет контекст. Профиль содержит подтверждённые endpoint, instance identity и API contract.

**Почему это правильно:** добавление сервера, выбор сервера по умолчанию и привязка конкретного диалога становятся отдельными действиями. Сетевой ответ не может незаметно изменить другой диалог.

### 2. Привязка диалога и неизменяемый сервер активного run

**Как было раньше:** диалог выбирал профиль для следующего run, а созданный run получал копию server routing. Идея была правильной, но при повреждённой привязке существовал риск молчаливого fallback на глобальный профиль.

**Почему это было плохо:** потеря или удаление привязанного профиля могла направить новый run на другой сервер без явного подтверждения пользователя.

**Как сделано в alpha.5:** существующая привязка разрешается строго. Если binding указывает на отсутствующий профиль, Start блокируется. Активный run хранит immutable snapshot: profile ID/revision, endpoint, credential reference, instance ID и deployment revision.

**Почему это правильно:** текущая задача никогда не переносится при смене dropdown, а ошибочная конфигурация завершается fail-closed вместо отправки на другой сервер.

### 3. Перенос профилей, tokens и настроек между версиями

**Как было раньше:** отдельного надёжного export/import не было. При загрузке новой unpacked-папки Chrome мог создать другую установку с отдельным storage, и пользователь повторно вводил профили и tokens. Миграции были распределены по runtime-коду без единого rollback snapshot.

**Почему это было плохо:** каждое обновление превращалось в ручную повторную настройку; частичная миграция могла оставить несовместимые ключи; token легко потерять.

**Как сделано в alpha.5:** settings schema `v2`; перед migration создаётся внутренний rollback backup `bb2_last_settings_migration_backup`. Есть export/import профилей, credentials, default profile, bindings, Send-button profile, CLI/focus/recovery settings и context attachments. Backup имеет canonical SHA-256; изменённый файл отклоняется. Импорт не заменяет active runs. Поддерживается старый backup format v1 и migration старых Bridge keys.

**Почему это правильно:** обновление той же установленной unpacked-папки сохраняет storage автоматически; при переносе в другую папку есть проверяемый секретный backup. Активная работа не заменяется импортом конфигурации.

### 4. Проверка соединения и Bridge identity

**Как было раньше:** health, identity и каталог CLI были частично смешаны. Успешная identity могла отображаться рядом с неработающим каталогом, а пользователь не понимал, какой именно этап сломан.

**Почему это было плохо:** лёгкий identity endpoint не доказывает работоспособность CLI-каталога; общий статус скрывал точную границу отказа.

**Как сделано в alpha.5:** отдельные состояния connection, identity, API contract, endpoint и executor freshness. Каждый HTTP request получает диагностические start/finish/failure события с latency, status, response size и server request ID.

**Почему это правильно:** видно, прошёл ли локальный туннель, auth, identity или конкретный API endpoint; token и body в журнал не попадают.

### 5. Каталог CLI и кнопка «Обновить CLI»

**Как было раньше:** popup и Start использовали принудительный `force:true`; cache игнорировался; каждый запрос мог вызвать серверные subprocess probes. Один timeout превращал список в `[]` и блокировал Start. Параллельные запросы могли создать probe storm.

**Почему это было плохо:** UI-запрос создавал тяжёлую серверную работу; client deadline 15 секунд был меньше теоретического server probe ceiling; один transient timeout уничтожил last-known-good состояние.

**Как сделано в alpha.5:** обычное чтение использует только быстрый cached `GET /v2/executors`. Кнопка «Обновить CLI» отдельно вызывает single-flight `POST /v2/executors/refresh`, затем ограниченно проверяет новый cached snapshot. Параллельные refresh в extension объединяются. Stale catalog показывается как stale, а не как отсутствующий.

**Почему это правильно:** read path не создаёт CLI subprocess; refresh явный и bounded; transient failure не стирает известный каталог и не создаёт storm.

### 6. Параллельные диалоги и runs

**Как было раньше:** все runs лежали в одном большом объекте `automation_runs`; поверх него добавлялись общий lock, per-run locks и revisions. Запоздалые записи могли перетереть состояние другого run.

**Почему это было плохо:** Chrome service worker может завершаться и просыпаться в неожиданные моменты; read-modify-write общего объекта создавал системный риск cross-run overwrite.

**Как сделано в alpha.5:** каждый run хранится отдельным ключом `bb2_run:<run_id>`, а отдельный index содержит только IDs. Есть per-run lock и короткие named storage locks. Start сериализован по conversation context. Polling и delivery имеют single-flight на `run_id`.

**Почему это правильно:** изменения одного диалога не перезаписывают состояние другого; одинаковые параллельные callbacks присоединяются к одной операции.

### 7. Start и отправка «поехали»

**Как было раньше:** Start ждал слишком много внутри popup/runtime request и не давал точных событий между commit и фактическим click. В реальном запуске журнал остановился на `START_COMMITTED_BEFORE_CLICK`, поэтому было невозможно установить, был ли найден новый DOM button, был ли click dispatched и появился ли user-turn.

**Почему это было плохо:** popup выглядел зависшим; потеря callback после click могла вызвать неопределённость; недостаточный журнал скрывал точную точку отказа.

**Как сделано в alpha.5:** Start создаёт chain/run, content adapter staging-ит `поехали`, проверяет Send button, запрашивает durable commit у worker, повторно валидирует кнопку, делает один click и сразу возвращает `START_CLICK_DISPATCHED`. User-turn anchor ищется асинхронно. Worker пишет `START_DISPATCH_REQUESTED` и `START_DISPATCH_RESPONSE`.

**Почему это правильно:** irreversible boundary сохраняется до click; popup не ждёт весь DOM lifecycle; после commit повторный автоматический click запрещён; каждый этап виден в журнале.

### 8. Захват writing blocks

**Как было раньше:** механизм стал критическим контрактом и многократно ломался при попытках добавить фильтры/admission gates вокруг чтения блоков.

**Почему вмешательство было плохим:** новый фильтр мог пропустить правильный блок, взять старый блок или изменить anchor semantics.

**Как сделано в alpha.5:** одобренная реализация capture вынесена в `shared/proven_writing_block_capture.js`; preservation test сравнивает её с референсом `v1.8.37.9`. Alpha.5 не меняет алгоритм извлечения.

**Почему это правильно:** новая архитектура строится вокруг проверенного capture contract, а не переписывает наиболее чувствительную часть без причины.

### 9. Стабилизация prompt и создание одной CLI-задачи

**Как было раньше:** prompt polling, recovery alarms и DOM events могли одновременно обрабатывать один writing block. Защита от дублей добавлялась по частям.

**Почему это было плохо:** два прохода могли одновременно принять один assistant turn и создать две попытки submission.

**Как сделано в alpha.5:** content adapter записывает stability/local extraction stages; worker сериализует run cycle; assistant turn ID и prompt fingerprint входят в idempotent job request. Server alpha.2 дополнительно обеспечивает unique idempotency и sequence.

**Почему это правильно:** browser race и server retry сходятся к одному job ID; одна и та же итерация не создаёт две задачи.

### 10. Выбор CLI следующей итерации

**Как было раньше:** пользователь выбирал следующую CLI, но код настройки, paused-run update и catalog refresh был связан с большим service-worker state machine. В урезанных ранних BB2 alpha часть UI была потеряна.

**Почему это было плохо:** смена dropdown могла быть воспринята как смена уже выполняющейся task; часть настроек исчезла при переархитектуре.

**Как сделано в alpha.5:** CLI следующей итерации хранится по conversation key. Текущая accepted/running job остаётся на immutable executor. Настройка применяется только к следующему submission или явно при resume допустимого paused run.

**Почему это правильно:** running task не меняется задним числом; пользователь отдельно видит активную CLI и CLI следующей итерации.

### 11. Ожидание выбранной CLI и recovery/fallback

**Как было раньше:** существовала настройка ждать выбранную CLI либо разрешить переход. Но executor probing был разбросан по read/recovery paths и мог породить subprocess storm.

**Почему это было плохо:** policy была полезной, но её реализация зависела от тяжёлых повторных probes и двух конкурирующих state machines.

**Как сделано в alpha.5:** popup сохраняет conversation recovery policy; executor health принадлежит серверу alpha.2 и обновляется отдельно; extension не запускает probes и только отображает server-owned state/policy.

**Почему это правильно:** пользовательская политика сохранена, а принятие job и executor recovery управляются одним серверным владельцем состояния.

### 12. Активация вкладки и окна

**Как было раньше:** было две разные системы: полезная событийная activation policy и отдельное периодическое пробуждение каждые 20 секунд во время ожидания prompt.

**Почему периодическая система была плохой:** она перехватывала фокус без нового события, имела собственные timer/alarm/storage/recovery ветки и добавляла гонки.

**Как сделано в alpha.5:** периодическая 20-секундная подсистема полностью отсутствует. Сохранены режимы `off`, `report_only`, `always`; `activateRunTab` вызывается только по конкретному событию доставки/ожидания согласно выбранной policy.

**Почему это правильно:** нужная вкладка активируется, когда это необходимо цепочке, но браузер больше не дёргается по таймеру.

### 13. Файл контекста раз в N отчётов

**Как было раньше:** roadmap/ТЗ сохранялся по диалогу, но attachment delivery имел отдельный retry-click loop; при неясном исходе upload/send существовал риск повторного Send.

**Почему это было плохо:** текстовая и attachment доставка подчинялись разным правилам; повторный click после возможной отправки нарушал at-most-once.

**Как сделано в alpha.5:** файл и interval хранятся по conversation. Перед единым Send content adapter staging-ит report attachment и optional context attachment. Неудача optional context file не блокирует сам report; файл остаётся ожидающим следующего отчёта. После commit выполняется максимум один Bridge click.

**Почему это правильно:** attachment и text delivery используют одну необратимую границу; основной отчёт не теряется из-за дополнительного файла.

### 14. Доставка CLI-отчёта

**Как было раньше:** подтверждение частично зависело от исчезновения текста из React composer. При Prefix Helper report мог реально уйти, но run оставался `report_sending`, после чего возникал бесконечный `PREPARE_NO_PAYLOAD` loop.

**Почему это было плохо:** composer — staging area, а не durable source of truth; DOM может быть заменён React или изменён Prefix Helper.

**Как сделано в alpha.5:** server delivery сначала claimed exact owner `client_id + run_id`; report hash проверяется. Worker делает server commit до browser click. Факт доставки подтверждается только matching user-turn. Committed/confirmed report может быть получен только как reconciliation material с `send_allowed=false`; повторный click запрещён.

**Почему это правильно:** source of truth разделён: сервер владеет delivery transaction, ChatGPT user-turn подтверждает фактическую отправку, composer используется только для staging/диагностики.

### 15. Совместимость с Prefix Helper

**Как было раньше:** Prefix Helper capture-listener отменял первый click, асинхронно добавлял prefix и делал replay click. Старый Bridge ошибочно принимал изменение composer за неудачу.

**Почему это было плохо:** два корректных расширения имели race из-за неверного критерия успешной отправки.

**Как сделано в alpha.5:** Bridge делает один click после commit и ожидает user-turn, допускающий prefix перед полным payload. Он не пытается повторить Send после interception.

**Почему это правильно:** Prefix Helper свободно выполняет свой replay, а Bridge подтверждает конечный результат, не конкурируя за composer.

### 16. Ручной выбор Send-кнопки

**Как было раньше:** ручной picker существовал как отладочный fallback. Автоматический поиск мог выбрать неоднозначную кнопку при изменении DOM.

**Почему это было плохо:** ошибочный click на соседний control опаснее явного отказа.

**Как сделано в alpha.5:** manual selector сохраняется и сбрасывается отдельно. Automatic selection отклоняет zero-confidence/ambiguous candidates. Перед click кнопка повторно проверяется в текущем DOM.

**Почему это правильно:** расширение fail-closed и требует выбор пользователя вместо случайного клика.

### 17. Пауза, продолжение и жёсткое завершение

**Как было раньше:** Pause не отменяла server task, что правильно. Однако Stop в разных ветках мог оставить timers, polling, anchor watches или stale callbacks, которые продолжали реагировать после остановки.

**Почему это было плохо:** пользователь нажал Stop, но старый report/prompt мог снова оживить run или вызвать click.

**Как сделано в alpha.5:** Stop переводит run в terminal `stopped`, очищает timer, отправляет `BB2_TERMINATE_RUN` content adapter, заносит run ID в hard-stop fence. Content блокирует Start/Delivery click. `saveRun` запрещает stale callback менять stopped run; поздний delivery response игнорируется.

**Почему это правильно:** после Stop расширение не реагирует на новые writing blocks, reports, polling или auto-continuation до нового явного Start.

### 18. Диагностика

**Как было раньше:** журнал содержал ограниченный набор worker events и часто заканчивался ровно перед проблемным DOM-действием. Pre-run catalog errors могли вообще не попасть в run log. Полезной фильтрации и скачивания полного JSON не было.

**Почему это было плохо:** при зависании `START_COMMITTED_BEFORE_CLICK` нельзя было отличить отсутствие кнопки, lost runtime callback, click dispatch или anchor timeout.

**Как сделано в alpha.5:** ring до 1500 событий; monotonic sequence, event ID, timestamp, runtime version, source и level. Popup автоматически обновляет журнал, фильтрует current/errors/HTTP/all, копирует отображаемое и скачивает полный JSON. Recursive redaction удаляет token, Authorization, prompt, report, body, credentials и secrets. HTTP события содержат sanitized path, duration, status, bytes, request_id и stable error code.

**Почему это правильно:** вся цепочка видна от popup до content adapter и Bridge, но журнал остаётся безопасным для передачи на диагностику.

Ключевые Start events:

```text
RUN_CREATED
START_TEXT_STAGED
START_SEND_BUTTON_READY / START_SEND_BUTTON_NOT_READY
START_COMMITTED_BEFORE_CLICK
START_CLICK_ATTEMPT
START_CLICK_DISPATCHED
START_USER_TURN_FOUND / START_ANCHOR_TIMEOUT
START_CONFIRMED
```

Ключевые prompt/job events:

```text
PROMPT_WATCH_STARTED
PROMPT_CANDIDATE_STABILITY_STARTED
PROMPT_LOCAL_EXTRACTION_PENDING
PROMPT_ACCEPTED / PROMPT_REJECTED_PAUSED
JOB_ACCEPTED
RUN_STATE_CHANGED
```

Ключевые delivery events:

```text
DELIVERY_CLAIMED
DELIVERY_TEXT_STAGED
DELIVERY_ATTACHMENTS_STAGED
DELIVERY_SEND_BUTTON_READY
DELIVERY_COMMITTED_BEFORE_CLICK
DELIVERY_CLICK_ATTEMPT
DELIVERY_CLICK_DISPATCHED
DELIVERY_USER_TURN_FOUND / DELIVERY_ANCHOR_TIMEOUT
DELIVERY_CONFIRMED
```

Ключевые hard-stop events:

```text
RUN_HARD_STOPPED
RUN_HARD_STOP_APPLIED
START_CLICK_BLOCKED_BY_HARD_STOP
DELIVERY_CLICK_BLOCKED_BY_HARD_STOP
STALE_CALLBACK_BLOCKED_AFTER_HARD_STOP
DELIVERY_RESPONSE_IGNORED_AFTER_HARD_STOP
```

### 19. Retry, recovery и single-flight

**Как было раньше:** множество timer/alarm/recovery paths повторяли фиксированные операции. Permanent 401/404/409 могли попадать в бесконечный цикл. Prompt polling и delivery могли идти одновременно.

**Почему это было плохо:** повторение permanent failure ничего не исправляет; параллельные recovery paths создают дубли и нагрузку.

**Как сделано в alpha.5:** transient errors получают bounded exponential backoff до 60 секунд и max attempts; permanent errors переводят run в error/pause с точным code; polling, executor refresh и delivery объединяются single-flight. После delivery commit допускается только reconciliation, не новый Send.

**Почему это правильно:** recovery ограничен и идемпотентен; постоянная ошибка требует действия пользователя вместо бесконечной активности.

### 20. Видимость текущей и следующей итерации

**Как было раньше:** popup показывал текущую CLI, status и failover, но в ранних BB2 alpha этот функционал был урезан и пользователь видел только минимальные profile/start controls.

**Почему это было плохо:** невозможно понять, какая CLI выполняет текущую task, какая выбрана на следующую итерацию и изменилось ли что-либо после клика.

**Как сделано в alpha.5:** раздельные блоки «Настройки следующей итерации» и «Текущая итерация»; активный run card, active run count/list, current executor, status, resource policy, latest task и page monitor.

**Почему это правильно:** UI соответствует реальной неизменяемости текущей task и заранее показывает настройки будущей итерации.

### 21. Безопасность extension-side

**Как было раньше:** старый manifest содержал legacy bootstrap credential и лишние surfaces; diagnostics redaction была неполной; settings не имели проверяемого backup.

**Почему это было плохо:** публичная сборка не должна содержать рабочий credential, открывать внешний message interface или случайно экспортировать prompt/report/token.

**Как сделано в alpha.5:** hardcoded token отсутствует; `externally_connectable` отсутствует; endpoint разрешён только localhost/127.0.0.1; credentials отделены от публичного profile metadata; recursive redaction; bounded HTTP responses; settings backup явно помечен секретным и проверяется checksum.

**Почему это правильно:** attack surface минимален для self-hosted localhost/SSH tunnel модели, а sensitive material не попадает в обычные логи.

## Изменённые файлы относительно alpha.4

- `manifest.json`
- `package.json`
- `popup.html`
- `popup.js`
- `service_worker.js`
- `content_script.js`
- `tests/release_guards.test.mjs`
- `tests/worker_settings_runtime.test.mjs`
- новый `tests/runtime_start_and_stop.test.mjs`

`shared/proven_writing_block_capture.js` не менялся по поведению; preservation test пройден.

## Проверки alpha.5

### Source tree

```text
44 passed
0 failed
```

### Чистая распаковка финального ZIP

```text
44 passed
0 failed
```

### JavaScript syntax

Пройдены `node --check`:

- `service_worker.js`
- `content_script.js`
- `popup.js`
- `shared/model.js`
- `shared/protocol.js`
- `shared/proven_writing_block_capture.js`

### Dynamic runtime tests

Пройдены не только source-string guards, но и VM/runtime сценарии:

1. Создание server chain → durable Start commit → один click dispatch → anchor confirmation → hard Stop.
2. Claimed/committed report → exact server confirm → sequence увеличивается один раз → hard Stop блокирует позднее завершение.
3. Settings backup roundtrip сохраняет profile token и не заменяет active runs.
4. Schema v1 → v2 создаёт rollback backup и сохраняет profiles.
5. Изменённый backup отклоняется checksum validation.
6. Кнопка «Обновить CLI» вызывает server refresh endpoint, а не только cached read.

### Release guards

- периодическая 20-секундная activation subsystem отсутствует;
- событийная activation policy присутствует;
- hardcoded Bridge token отсутствует;
- `externally_connectable` отсутствует;
- hard Stop fence присутствует в worker и content adapter;
- commit-before-click присутствует для Start и report delivery;
- writing-block capture preservation test пройден;
- automatic Send selection отказывается от неоднозначной кнопки.

## Сохранение текущих профилей при обновлении

Чтобы сохранить уже введённые profile `80-83`, token, identity, привязку диалога и Send-button profile без повторного ввода:

1. Не создавать новую unpacked extension card.
2. Сохранить копию текущей папки расширения для rollback.
3. Удалить содержимое именно текущей загруженной папки, не удаляя саму папку.
4. Распаковать файлы alpha.5 в эту же папку.
5. Нажать Reload на той же карточке в `chrome://extensions`.
6. Обновить ChatGPT tab.

Chrome сохранит storage той же установки. При первом старте alpha.5 выполнит settings schema migration и создаст internal rollback backup.

После успешного входа в popup следует сразу выполнить «Экспортировать настройки». Этот JSON содержит tokens и должен храниться как секрет. При будущем переносе в другую unpacked-папку используется import с checksum validation.

## Ограничения и честный acceptance status

- Реальный пользовательский Chrome E2E ещё не выполнен.
- Нельзя объявлять alpha.5 принятой рабочей сборкой до цепочки: existing profile migration → Start → user-turn `поехали` → writing block → one job → one report → one user-turn → next prompt.
- В контейнере не доказана текущая совместимость с фактическим live ChatGPT DOM; это проверяется только пользовательским Chrome.
- Settings export содержит Bridge tokens.
- Сервер alpha.2 продолжает работать в root compatibility mode; argv exposure prompt остаётся server-side known limitation.

## Rollback

- До обновления сохранить текущую unpacked-папку.
- При проблеме вернуть её содержимое и нажать Reload на той же extension card.
- Не повторять Start или report Send, если журнал уже содержит `*_CLICK_DISPATCHED`, но подтверждение user-turn отсутствует.
- Server rollback для alpha.5 не требуется: сервер alpha.2 не изменяется.

---

# Version entry — Business Bridge 2 Extension 2.0.0-alpha.6

**Date:** 2026-07-13  
**Scope:** extension only; server `2.0.0-alpha.2` was not changed  
**Status:** candidate for a clean real-Chrome acceptance run; not declared production-ready before that run

## Why alpha.5 failed in the real browser

The real log ended at:

```text
START_TEXT_STAGED
START_SEND_BUTTON_READY
START_COMMITTED_BEFORE_CLICK
START_CLICK_ATTEMPT
START_CLICK_DISPATCHED
START_USER_TURN_NOT_FOUND
```

The composer still contained `поехали`, therefore ChatGPT did not accept the send.

The working `v1.8.37.9` reference enforced a 2000 ms post-input rendering/stabilization delay before resolving and clicking Send. Alpha.5 replaced that proven boundary with only two equal DOM observations separated by 150 ms. In the live run alpha.5 considered the control ready and called click about 330 ms after staging the text.

A same-page delayed-submit browser harness reproduced the difference without Prefix Helper:

```text
alpha.5:
  early click: 1
  accepted click: 0
  composer after: поехали
  new user-turn: absent

alpha.6:
  early click: 0
  accepted click: 1
  composer after: empty
  new user-turn: поехали
```

The harness exposes a Send control immediately but accepts submission only 1500 ms after the input event. This reproduces the exact class of failure: visual DOM readiness did not prove submit readiness.

## Changes in alpha.6

### Shared composer stabilization gate

Start and report delivery now use the same gate:

1. Stage or reuse the exact expected text.
2. Wait at least 2000 ms after entering the send-preparation phase.
3. Reacquire the current primary composer.
4. Verify that the exact expected text is still present.
5. Require the same composer and Send target for three consecutive 200 ms samples.
6. Only then persist the durable commit.
7. Invoke one native-prototype click.
8. Never automatically click again after commit.

This restores the proven reference timing while adding stronger current-DOM verification.

### Accurate click diagnostics

The old name `*_CLICK_DISPATCHED` claimed more than the extension knew. Alpha.6 records separate facts:

- `*_CLICK_METHOD_CALLED`
- `*_CLICK_EVENT_OBSERVED` or `*_CLICK_EVENT_NOT_OBSERVED`
- document capture observed
- button capture observed
- button bubble observed
- form submit observed
- `isTrusted`
- final `defaultPrevented` state
- post-click checkpoints at 0, 100, 500, 1500 and 3000 ms
- whether the composer remains populated
- whether a matching user-turn exists

No prompt or report text is written to diagnostics.

### Preserved product behavior

- Multiple Bridge profiles and servers
- Profile token and identity storage
- Conversation-to-profile bindings
- Immutable active-run routing snapshot
- Profile/settings export and import
- Current active runs and full popup controls
- Next-iteration CLI selection
- Selected-executor recovery policy
- Context file interval
- Manual Send-button picker
- Start / Pause / Resume / hard Stop
- Writing-block capture preservation
- Server-owned delivery transaction
- Event-driven tab/window activation
- Parallel conversations and runs

Periodic 20-second tab/window activation remains removed.

## Changed files

- `content_script.js`
- `service_worker.js`
- `manifest.json`
- `package.json`
- `popup.html`
- tests for the new stabilization and diagnostic contract

## Tests

Source tree:

```text
46 passed
0 failed
```

Freshly unpacked final ZIP:

```text
46 passed
0 failed
```

Additional browser regression:

- same delayed-submit page against alpha.5: failure reproduced;
- same delayed-submit page against alpha.6: one accepted click and one user-turn;
- no Prefix Helper was present in this reproduction.

JavaScript syntax checks passed for:

- `content_script.js`
- `service_worker.js`
- `popup.js`

## Artifact

```text
business-bridge-chatgpt-extension-v2.0.0-alpha6.zip
SHA-256: f856ce81f5e7fd32fe3143449ff7128ac55170938c40afee7bde64b9e814cd56
```

Test evidence:

```text
TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_ALPHA6.json
SHA-256: b74930edf717e19af169a25afe9cbbea4474dca0072f4d791962276c4fdf1181
```

## Updating without recreating profiles

Use the same unpacked-extension folder and the same Chrome extension card:

1. Hard-stop the stuck alpha.5 run.
2. Keep a backup copy of the current extension folder.
3. Replace the contents of that same folder with alpha.6 files.
4. Press Reload on the existing card in `chrome://extensions`.
5. Refresh the ChatGPT tab.

Chrome storage, profiles, tokens, bindings, Send-button selection and settings remain attached to that extension installation.

The old staged `поехали` text may remain in the composer. Alpha.6 recognizes the exact text, reuses it, still applies the full stabilization gate, and does not overwrite unrelated user text.

## Rollback

Restore the backed-up extension-folder contents and press Reload on the same Chrome extension card. No server rollback is needed.

## Acceptance limitation

The delayed-submit regression is now reproduced and fixed in a real Chromium engine, but the final user Chrome + current live ChatGPT page acceptance run is still required. Alpha.6 is therefore a live-test candidate, not a production release.

---

# Business Bridge 2 Extension 2.0.0-alpha.7 — deterministic composer-send and visible transport state

Date: 2026-07-13

## Reason for this patch

Alpha.6 was not acceptable for live use. Two separate product defects were proven from the user's live diagnostics:

1. The Send target was validated before an asynchronous local commit, then an old DOM button reference could be used after that commit without re-resolving and fully validating the current composer, form, and button state. A native click method could therefore be called without a resulting click event, submit, composer clear, or matching user turn.
2. Transport loss was written into diagnostics and cached run error fields but was not elevated into a clear user-visible connection state. The popup could show a stale catalog while the local Bridge endpoint was unavailable, and no immediate red page notification was guaranteed.

Alpha.7 replaces these paths with small dedicated modules and one deterministic send transaction rather than adding more conditionals to the alpha.6 path.

## Architecture changes

### `shared/composer_send.js`

A dedicated composer-send module now owns:

- fresh composer, form, and Send-button resolution;
- connected and visible checks;
- native `disabled` and `aria-disabled` checks;
- exact composer/form ownership checks;
- exact staged-text checks;
- stable target sampling;
- diagnostic node identities and state snapshots;
- final synchronous validation followed immediately by ordinary `button.click()`.

There is no network request, service-worker message, timer, storage access, or `await` between the final validation and the click call.

The pre-commit button object is never reused after commit. Start and delivery each resolve a fresh post-commit target.

### `shared/transport.js`

A dedicated transport-state module now owns:

- `unknown`, `connected`, `disconnected`, and `recovering` states;
- bounded retry delays of 5, 10, 20, 40, and 60 seconds;
- last successful contact;
- last failed contact;
- last error code;
- next retry time.

The transport state is separate from the server run state. For example, a server job may remain `waiting_job` while the local endpoint is temporarily `disconnected`. Restoring transport resumes observation of the same job and does not create another job.

### `shared/toast.js`

A dedicated toast module now owns all page notifications and their exact product semantics:

- blue `#1d4ed8`: CLI is working;
- orange `#c2410c`: ChatGPT/operator work is in progress;
- green `#166534`: ChatGPT/operator work was successfully accepted or completed;
- red `#991b1b`: error.

Every toast has a `×` close button. Closing a toast only removes the visual element. It does not pause, stop, resume, confirm, submit, alter delivery state, delete diagnostics, or call the server.

## Deterministic Start transaction

The Start path is now:

```text
stage exact text
→ wait for stable composer state
→ resolve and snapshot a pre-commit target
→ perform the local durable Start commit
→ discard every pre-commit DOM reference
→ resolve a fresh post-commit composer/form/button target
→ require stable valid samples
→ make a final synchronous validation
→ record a synchronous pre-click snapshot
→ call currentButton.click() once
→ observe click event, composer state, and matching user turn
```

If no valid target exists after commit, the extension performs zero clicks, records `START_SEND_TARGET_NOT_READY_AFTER_COMMIT`, aborts the local Start commit where safe, preserves the staged text, and shows a red error. It does not select another ambiguous button.

If the click method is called but no click event is observed, the extension records `START_CLICK_EVENT_NOT_OBSERVED`, performs no automatic second click, and shows a red error.

## Deterministic report-delivery transaction

Report delivery uses the same fresh post-commit target resolver and final synchronous validation as Start.

The server delivery commit remains an irreversible boundary. After a server delivery is committed:

- no automatic resend is allowed;
- target-not-ready and click-event-not-observed conditions become explicit committed-unconfirmed states;
- the run is paused for manual inspection rather than clicking again;
- the original delivery identity and report hash remain unchanged.

This preserves the invariant: exactly one Send attempt after a durable server delivery commit.

## Diagnostic contract

The following state boundaries now have separate events and snapshots:

```text
*_PRE_COMMIT_SNAPSHOT
*_POST_COMMIT_SNAPSHOT
*_PRE_CLICK_SNAPSHOT
*_CLICK_METHOD_CALLED
*_CLICK_EVENT_OBSERVED
*_CLICK_EVENT_NOT_OBSERVED
*_POST_CLICK_CHECKPOINT
*_USER_TURN_FOUND
```

Snapshots contain node identities, connected state, visibility, disabled state, `aria-disabled`, same-form ownership, candidate count, and whether staged text is present. They do not contain the token, Authorization header, complete prompt, complete report, credential value, or request body.

## Visible connection-loss behavior

On the first `connected → disconnected` transition for a Bridge profile:

- one red page toast is shown;
- popup connection state becomes `Соединение потеряно`;
- the last successful contact, last failure, safe endpoint, error code, and next retry are available;
- the current server run status is preserved;
- polling changes to bounded recovery intervals.

Repeated failures in the same disconnected period do not create duplicate red transition toasts.

On `disconnected → connected`:

- one green recovery toast is shown;
- the same run and job continue;
- no new chain or job is created.

A stale executor catalog no longer masks a disconnected transport state.

## Preserved product behavior and invariants

Alpha.7 preserves:

- multiple Bridge server profiles;
- stored credentials and profile revisions;
- per-dialog profile binding;
- immutable active-run server snapshot;
- multiple parallel dialogs and runs;
- executor selection for the next iteration;
- context-file settings;
- manual Send-button selection;
- Start, Pause, Resume, and hard Stop;
- server-owned delivery claim, commit, and confirm;
- event-driven exact-tab activation;
- settings export/import and same-extension-card upgrades.

The proven writing-block capture implementation was not modified.

```text
shared/proven_writing_block_capture.js
SHA-256: 5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef
```

Periodic 20-second tab/window activation remains absent. The 20-second value in transport retry backoff is network recovery timing and does not activate or focus a tab.

The Business Bridge 2 server and Business Bridge 1 were not modified, restarted, or stopped for this extension patch.

## Changed runtime files

- `manifest.json`
- `package.json`
- `content_script.js`
- `service_worker.js`
- `popup.js`
- `popup.html`
- `popup.css`
- `shared/toast.js`
- `shared/composer_send.js`
- `shared/transport.js`

## Verification

Source tree:

```text
59 passed
0 failed
```

Freshly unpacked final ZIP:

```text
59 passed
0 failed
```

All JavaScript and MJS files passed syntax checks in both the source tree and the freshly unpacked ZIP. Python browser-harness files also passed syntax checks. ZIP integrity passed.

Chromium behavior checks passed for:

- delayed React readiness: zero early clicks, one accepted click, matching user turn found;
- Start post-commit DOM replacement: old button zero clicks, fresh button one click, different node identities, matching user turn found;
- permanently disabled post-commit target: zero clicks, local Start commit aborted, staged text preserved, explicit error;
- delivery post-commit DOM replacement: old button zero clicks, fresh button one click, delivery confirmed;
- exact toast colors and close-button behavior;
- transport loss and recovery: one red loss toast, no duplicate transition toast, one green recovery toast, `waiting_job` preserved.

Stability sweep:

```text
10 / 10 passed
```

The sweep contained five post-commit rebind scenarios and five delayed-readiness scenarios.

## Artifact

```text
business-bridge-chatgpt-extension-v2.0.0-alpha7.zip
SHA-256: bd1e3ed2a093df36f73123f818cdd9c89fbb29489c90074f8f51b742c953b375
```

Test evidence:

```text
TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_ALPHA7.json
SHA-256: 99b830c55d9fe8d1380d0a11ec55746b7864acca6b3535fdab12d95a9063dc93
```

The canonical documentation remains outside the extension ZIP.

## Updating without recreating profiles

1. Hard-stop any stuck alpha.6 run.
2. Keep a backup copy of the current unpacked extension folder.
3. Replace the contents of that same folder with alpha.7 files.
4. Press Reload on the existing extension card in `chrome://extensions`.
5. Refresh each ChatGPT tab used by Business Bridge 2.

Using the same Chrome extension card preserves profiles, tokens, dialog bindings, executor settings, Send-button profile, context settings, and stored run records.

## Rollback

Restore the backed-up extension-folder contents and press Reload on the same Chrome extension card. No server rollback is required.

## Acceptance limitation

Alpha.7 is a candidate for the user's live end-to-end acceptance test. The source, freshly unpacked ZIP, Chromium behavior harnesses, and ten-run stability sweep passed, but the following remain unproven until the user installs this exact ZIP:

- a full live run on the current real ChatGPT page in the user's Chrome;
- a live remote CLI report roundtrip after alpha.7 installation;
- behavior under future ChatGPT DOM changes.

Alpha.7 must not be described as a final production release before that live acceptance succeeds.

---

# 2026-07-13 — Extension 2.0.0-alpha.8

## Reason for the patch

Alpha.7 incorrectly treated visibility of a synthetic DOM `click` event as proof of whether ChatGPT accepted Send. In the user's failed run, `button.click()` was called and the visible user turn `поехали` was created, but the content-script event probe did not observe the DOM click. Alpha.7 then rolled back the local Start commit, terminated the live server chain, and marked the run as failed even though the irreversible page action had already succeeded.

This patch restores the proven reference transaction contract:

```text
persist the irreversible attempt before click
→ call the current Send control exactly once
→ treat click-event/composer observations as diagnostics only
→ use the matching new user-turn as delivery truth
→ after the click method call, never abort, terminate, or resend
→ if the user-turn is not yet visible, preserve an unconfirmed state and reconcile only
```

## Runtime changes

### `content_script.js`

- Start no longer aborts or terminates a chain when `button.click()` was called but a DOM click event was not observed.
- Report delivery no longer treats a missing observed click event as a delivery failure.
- Start and report delivery both wait for a matching new user-turn after the single irreversible method call.
- `click_event_observed` remains recorded for diagnostics but is not a success/failure gate.
- A missing matching user-turn produces an unconfirmed reconciliation state; it does not produce another Send.

### `service_worker.js`

- `DELIVERY_CLICK_EVENT_NOT_OBSERVED` was removed from the permanent no-click error class.
- A Start-abort request containing `click_method_called: true` is rejected with `START_ABORT_FORBIDDEN_AFTER_CLICK_METHOD`.
- Server-chain termination remains allowed only in a proven pre-click rollback path.

### `shared/model.js`

Full-cycle emulation found a second independent defect: after one report delivery reached `confirmed`, `claimDelivery()` still prohibited the next iteration from claiming a new distinct delivery. The invariant was narrowed correctly:

- a `committed` delivery remains irreversible and cannot be replaced;
- a completed `confirmed` delivery belongs to the previous iteration and may be replaced by the next job's delivery claim.

### Version and test runner

- Extension runtime: `2.0.0-alpha.8`.
- Manifest version: `2.0.0.8`.
- Node tests run sequentially with `--test-concurrency=1` so browser harnesses cannot interfere with one another.

## Preserved invariants

- The proven writing-block capture implementation was not modified.

```text
shared/proven_writing_block_capture.js
SHA-256: 5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef
```

- Exactly one Send method call per Start or report-delivery transaction.
- After the irreversible method-call boundary: reconciliation only, never automatic resend.
- Multiple profiles, tokens, bindings, next-iteration settings, Send-button profile, attachments, and stored runs survive same-extension-card updates.
- Active runs keep an immutable server/profile snapshot.
- Parallel dialogs, runs, servers, CLI selections, jobs, and report deliveries remain isolated.
- Event-driven exact-tab activation remains; periodic 20-second activation remains absent.
- Hard Stop blocks prompt capture, polling continuation, report delivery, replay, and stale callbacks until a new explicit Start.
- Toast colors remain blue for CLI work, orange for ChatGPT/operator work, green for acceptance/recovery, and red for errors. Every toast has a visual-only close button.
- Business Bridge 1 and both server installations were not modified, restarted, stopped, or reconfigured by this extension patch.

## Complete verification gate

Every named runtime function and every enumerated workflow step has an explicit result.

```text
Named runtime functions: 229 / 229 PASS
Enumerated workflow steps: 150 / 150 PASS
FAIL: 0
Unverified: 0
```

The detailed matrices are separate files beside the ZIP:

```text
BUSINESS_BRIDGE_2_ALPHA8_FUNCTION_TEST_MATRIX.md
SHA-256: fc9709def3b8eebb9e6d67eefbecbf9a2dc819671eb03e6652d4a70d44b5b478

BUSINESS_BRIDGE_2_ALPHA8_STEP_BY_STEP_TEST_MATRIX.md
SHA-256: fec8579a5bcad16ba77519562d3c8807a0e9b58935898e576b00d280804b7e77

BUSINESS_BRIDGE_2_ALPHA8_COVERAGE_SUMMARY.json
SHA-256: e8b580bdb38bff661da875439a46047be47012fe616ebe57bb1c00d7d09fabe7
```

## Full-suite results

Source tree, independent pass 1:

```text
83 tests
83 passed
0 failed
119355.753186 ms
```

Source tree, independent pass 2:

```text
83 tests
83 passed
0 failed
119641.519626 ms
```

Fresh extraction of the final ZIP:

```text
83 tests
83 passed
0 failed
119638.665516 ms
```

Exact non-browser state-machine, HTTP, storage, migration, and release-guard suite:

```text
70 tests
70 passed
0 failed
4153.466033 ms
```

All JavaScript and MJS files passed syntax checking. Python Chromium harnesses compiled successfully; one source string produced a non-fatal Python invalid-escape warning without changing execution. ZIP integrity and release-versus-fresh-extraction file parity passed. The final archive contains 54 files and no `__pycache__` or `.pyc` files.

## Browser and full-fleet emulation

Production `content_script.js`, popup code, composer-send module, toast module, and protected writing-block capture code were executed in headless Chromium DOM harnesses. Production service-worker source was executed in an isolated VM with Chrome API emulation, two independent Bridge v2 server endpoints, separate tokens, separate CLI catalogs, chains, jobs, and generated CLI reports.

The passed fleet scenarios include:

- two ChatGPT dialogs on two different Bridge servers and two CLI selections, each completing two iterations;
- two dialogs sharing one server without prompt, job, or report cross-talk;
- independent tokens and immutable active-run profile snapshots;
- simultaneous polling and simultaneous report delivery;
- pause or hard Stop of one run while another continues;
- loss of one server while the other remains operational;
- recovery of the same job without a duplicate delivery;
- duplicate-tab ownership and exact-conversation rebind;
- service-worker reload and run restoration from persisted storage;
- settings export/import while active runs remain preserved;
- large report attachment plus scheduled context attachment, each staged exactly once;
- Prefix Helper-style composer mutation with confirmation by matching user-turn;
- missing observed click event with a real emulated user-turn: no abort, no terminate, no resend;
- Start and report unconfirmed recovery: reconciliation only;
- second report iteration after a confirmed first delivery.

## Artifact

```text
business-bridge-chatgpt-extension-v2.0.0-alpha8.zip
SHA-256: ac59247d4bbbe1b3640e1a60d87cc1643586a08e5496c1951e2f74792747dd5b
```

The canonical documentation and test-evidence files remain outside the extension ZIP.

## Upgrade and rollback

Upgrade on the same Chrome extension card to preserve extension storage:

1. Stop or clear any failed alpha.7 run.
2. Back up the current unpacked extension directory.
3. Replace its files with alpha.8.
4. Press Reload on the existing card in `chrome://extensions`.
5. Refresh the ChatGPT tabs used by Business Bridge 2.

Rollback restores the backed-up extension directory and reloads the same extension card. No server rollback is required.

## Acceptance boundary

The verification above is complete deterministic browser/worker/server/CLI emulation of the shipped source and freshly extracted archive. It is not a claim that the ZIP has already completed an authenticated run inside the user's installed ChatGPT session. Final live acceptance therefore remains the first user-installed run of this exact artifact; no missing emulated function or workflow step is being deferred to that acceptance.

---

# Candidate patch — alpha.2 server ownership/recovery and portable browser harness

Дата: **2026-07-13**  
Статус: **candidate only; release gate not passed**

## Причина изменения

Проверка приложенного комплекта показала, что серверный архив фактически
помечен alpha.1, хотя документация описывает исправления alpha.2. Исходный
сервер имел незащищённые chain/job reads, не проверял semantic idempotency,
мог оставлять job в `running` после ошибки запуска CLI и не создавал delivery
для interrupted job после restart. Также browser harness содержал жёсткий путь
к отсутствующему `/opt/pyvenv/bin/python3`.

## Изменённые файлы

- `candidate/server/app/api.py`
- `candidate/server/app/config.py`
- `candidate/server/app/database.py`
- `candidate/server/app/executor_supervisor.py`
- `candidate/server/VERSION`
- `candidate/server/docs/API_CONTRACT.md`
- `candidate/server/docs/SECURITY_MODEL.md`
- `candidate/server/tests/`
- `candidate/extension/service_worker.js`
- `candidate/extension/tests/` — portable Python runtime selection

## Сохранённые инварианты

- commit-before-click и reconciliation-only после irreversible Send;
- сохранение proven writing-block capture без изменения поведения;
- изоляция conversation/run/server/CLI;
- hard Stop и отсутствие periodic 20-second activation;
- Bridge 1 не изменяется;
- credentials не попадают в diagnostics и structured logs.

## Проверки

- server candidate: **20/20 PASS**;
- extension non-browser/fleet suite: **70/70 PASS**;
- JavaScript/Python syntax: **PASS**;
- extension ZIP integrity: **PASS**;
- обязательные browser tests: **NOT TESTED** — в среде отсутствуют Playwright и Chromium;
- mutation/fault-injection release matrix: **NOT TESTED**.

## Артефакты candidate

- `business-bridge-chatgpt-extension-candidate-alpha2.zip`
  SHA-256: `03de58362025773b25f4b49d2e88bc0a0c8e62db208911a1072daec0fc06e15f`
- `business-bridge-2-server-candidate-alpha2.tar.gz`
  SHA-256: `b3d6304fbc2face6601f88a58947191d131f0ed1c8fec94b44ebc3643a44f835`

## Ограничения и rollback

Candidate нельзя объявлять финальным и устанавливать как release до запуска
всех реальных Chromium/MV3 и mutation сценариев. Rollback — восстановить
исходный alpha8 ZIP и приложенный server alpha1 archive; Bridge 1 не затрагивается.

## Release gate

**FAIL — BUILD_READY: NO.**


## 2.0.0.10 candidate — composer-empty send contract

**Дата:** 2026-07-14

### Причина

Удалена лишняя проверка отправленного сообщения по DOM user-turn и тексту отчёта. Расширение не анализирует содержание отправленного сообщения.

### Новый контракт

1. Расширение вставляет start-команду или terminal report в composer.
2. Пока composer содержит **любой непустой текст**, расширение заново находит актуальную Send-кнопку и вызывает Send.
3. Когда composer становится пустым, дальнейшие Send-клики прекращаются.
4. Расширение ждёт только новый assistant writing block, отсутствовавший в baseline до отправки.
5. Текст user-turn, текст отчёта, matching, reconciliation, `start_unconfirmed` и `delivery_unconfirmed` не используются.
6. Hard Stop проверяется перед каждой попыткой Send.

### Изменённые runtime-файлы

- `content_script.js`
- `service_worker.js`
- `shared/composer_send.js`
- `shared/model.js`
- `manifest.json`
- `package.json`
- файлы отображения версии

### Сохранённые инварианты

- `shared/proven_writing_block_capture.js` сохранён побайтно; SHA-256: `5B0EAAC9619CB827D1E74C61F53E2755C084A1D4B60C64D23F5FD4A5354C3AEF`.
- Автоматическое завершение run не добавлено.
- Периодическая активация вкладки не добавлена.
- Серверный код не изменён.
- Токены и профили в ZIP не включены.

### Проверки кандидата

- JavaScript syntax checks: PASS.
- Новый контрактный тест: 7/7 PASS.
- Предыдущий composer-empty контрактный тест: 7/7 PASS.
- Реальная mutation-проверка (`if (!currentText)` → `if (currentText)`): ожидаемый FAIL, exit code 1.
- Защищённый capture-файл: побайтно сохранён.
- Часть прежнего test suite требует обновления, потому что проверяет удалённые anchor/user-turn/reconciliation состояния. Поэтому это **кандидат для живого лабораторного теста**, не финальный публичный релиз.

### Установка кандидата

Сохранить ZIP в allowlist Chrome Extension Lab:

`D:\codex\MCP\chrome-extension-lab-mcp-v0.1.1\extensions\business-bridge-2.0.0.10-composer-empty-candidate.zip`

### ZIP SHA-256

`FAF763ECFDB53146E474A523731DDB767BF1326A48EC604411CD2D1ECCFB6A34`


---

# VERSION ENTRY — 2.0.0.11 current patched live state

**Дата:** 2026-07-14  
**Technical ID:** `BB2-EXT-2.0.0.11-STALE-MANUAL-SEND-PROFILE-FALLBACK-20260714`  
**Base version:** `2.0.0.10`  
**Artifact:** `business-bridge-2.0.0.11-current-patched.zip`  
**SHA-256:** `eac9a6ea4b726cb296498a35289eb77fb484ecba4b51bb1860442c82dbd35db6`  
**Статус:** текущая patched-сборка, установленная и частично проверенная в одной постоянной Chromium-сессии; полный QA и публичный release gate не завершены.

## Причина изменения

Реальный Start версии `2.0.0.10` создавал chain/run и вставлял `поехали` в ChatGPT composer, но не выполнял необратимый Send-click. Запуск завершался ошибкой:

```text
Send-кнопка не готова до start commit.
```

Дефект блокировал первый обязательный live-сценарий.

## Доказанная первопричина

Ручной профиль Send-кнопки мог быть сохранён при пустом composer. В этом состоянии справа находился voice/dictation control, а настоящая Send-кнопка ещё отсутствовала.

После вставки текста React заменял controls и создавал новую Send-кнопку. Код `content_script.js` при наличии `sendButtonProfile` использовал только точное совпадение старой ручной сигнатуры и не переходил к штатному автоматическому resolver.

Причинная связь подтверждена A/B:

- с сохранённым устаревшим manual profile — Start `FAIL`;
- после удаления только этого профиля, без изменения runtime-кода, тот же Start создал настоящий user-turn `поехали`.

## Scope patch

Изменён только browser-side resolver Send-кнопки:

1. Сначала выполняется поиск актуального control по сохранённой manual-сигнатуре.
2. При наличии актуального совпадения manual profile сохраняет приоритет.
3. Если совпадения больше нет после React-перерисовки, manual profile не блокирует дальнейший поиск.
4. Выполняется существующий автоматический resolver настоящей Send-кнопки.

Сервер, Bridge API, CLI, storage schema, credentials, conversation binding, writing/code-block capture и composer-empty contract не изменены.

## Изменённые файлы

### Функциональное изменение

- `content_script.js`
  - `sendButtonCandidates(context)`: при отсутствии актуальных manual candidates выполняется автоматический candidate resolver;
  - `sendButton(context)`: при отсутствии актуальной manual button выполняется штатный automatic resolver.

### Синхронизация runtime version

- `content_script.js`
- `manifest.json`
- `package.json`
- `popup.js`
- `service_worker.js`

`popup.html` намеренно не изменялся при воспроизведении уже установленного patch. Поэтому его видимая статическая подпись версии остаётся `2.0.0.10`; это известная отдельная несогласованность UI, а не скрытое дополнительное исправление.

## Проверенные hashes текущего live-state

```text
Base ZIP 2.0.0.10:
faf763ecfdb53146e474a523731ddb767bf1326a48ec604411cd2d1eccfb6a34

content_script.js:
0e2ac211cd3bc07c1f2584ddf7328608b8ba496b5f1bcca451a972da4b8fa515

manifest.json:
a7d15295f3d47de2986190ae61c9b932b7c8d224c0bf80385686d92d83355002

shared/proven_writing_block_capture.js:
5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef

Current 2.0.0.11 ZIP:
eac9a6ea4b726cb296498a35289eb77fb484ecba4b51bb1860442c82dbd35db6
```

Hashes `content_script.js` и `manifest.json` совпадают с файлами, ранее установленными в canonical live-path:

```text
D:\codex\MCP\chrome-extension-lab-mcp-v0.1.1\data\extensions\business-bridge-2-live-lab
```

## Сохранённые инварианты

- один writing block создаёт не более одного idempotent job;
- active run сохраняет immutable Bridge-profile и executor binding;
- настройка CLI относится только к следующей итерации;
- ручной Send profile сохраняет приоритет, пока он действительно соответствует текущему DOM;
- automatic resolver используется только когда manual target больше не существует;
- `shared/proven_writing_block_capture.js` сохранён побайтно;
- composer-empty Send contract не переписан;
- автоматическое завершение run не добавлено;
- periodic 20-second activation не добавлена;
- событийная активация сохранена;
- токены, credentials и browser storage в ZIP не включены;
- серверная часть не изменена.

## Статические и архивные проверки

Выполнено:

- точный исходный блок найден ровно один раз;
- выполнены ровно две ограниченные функциональные замены;
- старый блокирующий resolver отсутствует;
- новый fallback-блок присутствует;
- manifest version: `2.0.0.11`;
- полный набор файлов: `13`;
- `node --check` для всех JavaScript-файлов: `PASS`;
- protected writing-block capture SHA: `PASS`;
- mutation guard: возврат старого blocking resolver вызывает ожидаемый release-guard `FAIL`;
- ZIP integrity: `PASS`;
- свежая распаковка ZIP и повторный `node --check`: `PASS`;
- документация сохранена append-only: исходные bytes не переписаны, новая запись добавлена только в конец.

## Live QA checkpoint

### Start defect

После удаления причинного manual profile неизменённый runtime успешно создал настоящий user-turn `поехали`. Patch закрепляет это поведение на уровне кода, чтобы устаревший профиль больше не блокировал Start.

### Переключение CLI

- `BB2-LIVE-RUN-006`, MiMo → Codex: `PASS` после применения настройки следующей итерации.
- `BB2-LIVE-RUN-007`, Codex → MiMo: `PASS`.
- Текущая accepted/running итерация не менялась задним числом.
- Cross-CLI mixing не обнаружено.

### Pause → Resume

- `BB2-LIVE-RUN-008`: `FAIL` как Pause/Resume-тест, потому что фактическое окно было около 7 секунд вместо обязательных 30 секунд. Добавленная запись №18 была корректной.
- `BB2-LIVE-RUN-009`: `PASS`; paused-state выдержан более 30 секунд, тот же run/job продолжился, второй job не создан, запись №19 добавлена ровно один раз.

### Hard Stop

`BB2-LIVE-RUN-010` получил independent browser/runtime evidence expected-abort:

- `waiting_job → stopped`;
- `RUN_HARD_STOP_APPLIED`;
- `RUN_HARD_STOPPED`;
- active runs после остановки: `0`;
- Resume и новый Start не выполнялись;
- terminal report не доставлен;
- новый writing block не захвачен;
- live-сервис остался на 19 публикациях;
- запись №20 не появилась.

Формальный operator verdict ещё должен быть доставлен тестовому ChatGPT после восстановления туннеля и MCP.

## Known limitations

1. Полный Stage 3 QA ещё не завершён.
2. Видимая статическая версия в `popup.html` остаётся `2.0.0.10`, тогда как manifest/runtime/content имеют версию `2.0.0.11`.
3. Эта сборка воспроизводит точное уже установленное и проверявшееся live-state; несогласованность popup version намеренно не исправлялась без отдельного patch-cycle.
4. Hard Stop Run 010 имеет достаточное independent evidence, но окончательный verdict тестового ChatGPT ещё не записан.
5. Полный append-only QA-report должен быть дополнен после восстановления инфраструктуры.
6. Параллельные multi-conversation/multi-server сценарии и оставшиеся QA-модули не объявлены завершёнными.
7. Сборка не является публичным release.

## Rollback

Live rollback:

1. Не повторять Send для операции, которая могла пересечь необратимый click/commit boundary.
2. Остановить текущий QA.
3. Сохранить diagnostics.
4. Восстановить backup:

```text
D:\codex\MCP\chrome-extension-lab-mcp-v0.1.1\data\extensions\business-bridge-2-live-lab-backup-before-2.0.0.11-20260714-182504
```

5. Вернуть его содержимое в:

```text
D:\codex\MCP\chrome-extension-lab-mcp-v0.1.1\data\extensions\business-bridge-2-live-lab
```

6. Выполнить `extension_reload` в той же канонической Chromium-сессии.
7. Не создавать вторую Chromium-сессию.

Artifact rollback:

- отключить `2.0.0.11`;
- восстановить приложенный base artifact `2.0.0.10`;
- не переносить active run между версиями;
- серверный rollback не требуется.

## Final status

```text
PATCH CONTENT: VERIFIED
ARCHIVE INTEGRITY: PASS
JAVASCRIPT SYNTAX: PASS
LIVE DEFECT CAUSE: PROVEN
PARTIAL LIVE QA: COMPLETED
FULL QA: NOT COMPLETED
PUBLIC RELEASE: NO
```


---

# VERSION ENTRY — 2.0.0.12 project-chat conversation binding fix

**Дата:** 2026-07-15  
**Technical ID:** `BB2-EXT-2.0.0.12-PROJECT-CHAT-CONVERSATION-ID-20260715`  
**Base version:** `2.0.0.11`  
**ZIP artifact:** `business-bridge-2.0.0.12-project-chat-fix-candidate.zip`  
**ZIP SHA-256:** `187e75f8bc8487d2e9aee9b9cde3530387ee6e35fbc56e1aebf8d835f3d5e54c`  
**Patch artifact:** `business-bridge-2.0.0.12-project-chat-fix.patch`  
**Patch SHA-256:** `94126e7513e263eafd7010a4e7359560c63f8aed8de755545d1a52960162ac93`  
**Статус:** проверенный patch-кандидат; статические, parser, mutation, patch-apply и archive-integrity проверки пройдены; установка кандидата в canonical MCP live-path и живой post-patch PASS ещё не выполнены.

## Причина изменения

Business Bridge 2 версии `2.0.0.11` не загружал контекст ChatGPT-диалога, когда диалог находился внутри проекта ChatGPT.

Живое воспроизведение выполнено в созданном владельцем тестовом диалоге `для уебана` с URL вида:

```text
https://chatgpt.com/g/g-p-<project-id>/c/<conversation-id>
```

На текущем runtime `2.0.0.11` popup оставался в состоянии:

```text
Загрузка контекста…
```

Content runtime записывал проектный `chat_path`, но возвращал:

```text
conversation_id = null
CONTENT_READY_RESULT matched = false
```

Из-за отсутствующего `conversation_id` service worker не мог связать вкладку с состоянием конкретного диалога. Поэтому дальнейшая цепочка run/prompt-watch для этого проектного диалога не запускалась.

## Доказанная первопричина

В `content_script.js`, функция `identity()`, версия `2.0.0.11` использовала строгое регулярное выражение:

```javascript
/^\/c\/([0-9a-f-]{36})\/?$/i
```

Оно распознавало только обычный маршрут:

```text
/c/<conversation-id>
```

и принципиально не могло распознать проектный маршрут:

```text
/g/g-p-<project-id>/c/<conversation-id>
```

Корневая причина — неполный browser-side parser маршрута ChatGPT, а не Bridge-сервер, CLI, кнопка Send, кнопка «Копировать текст» или writing-block selector.

## Scope patch

В `content_script.js` добавлена отдельная функция:

```javascript
function conversationIdFromPath(pathname) {
  const match = String(pathname || "").match(/(?:^|\/)c\/([0-9a-f-]{36})(?:\/|$)/i);
  return match ? match[1].toLowerCase() : null;
}
```

`identity()` теперь получает `conversation_id` через эту функцию.

Поддерживаются как минимум:

```text
/c/<conversation-id>
/c/<conversation-id>/
/g/g-p-<project-id>/c/<conversation-id>
/g/g-p-<project-id>/c/<conversation-id>/
```

Невалидные и неполные ID не принимаются.

## Изменённые файлы

### Функциональное изменение

- `content_script.js`
  - добавлен `conversationIdFromPath(pathname)`;
  - `identity()` переведён с жёсткого `/c/<id>` parser на извлечение conversation ID из поддерживаемых ordinary/project paths.

### Синхронизация версии

- `content_script.js`: `VERSION = "2.0.0.12"`;
- `manifest.json`: manifest version `2.0.0.12`;
- `package.json`: package version `2.0.0.12`;
- `popup.js`: diagnostic export version `2.0.0.12`;
- `service_worker.js`: runtime version `2.0.0.12`;
- `popup.html`: видимая badge-версия синхронизирована с `2.0.0.12`.

Другие файлы не изменены.

## Сохранённые инварианты

- механизм захвата writing/code blocks не изменён;
- `shared/proven_writing_block_capture.js` сохранён побайтно;
- SHA-256 защищённого capture-файла до и после patch:

```text
5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef
```

- Send-button resolver и composer Send contract не изменены;
- server API и Bridge transport не изменены;
- storage schema не изменена;
- Bridge profiles, executor selection и immutable active-run binding не изменены;
- Pause, Resume, Hard Stop и Finish не изменены;
- periodic 20-second activation не добавлена;
- автоматическое завершение run не добавлено;
- credentials, token и browser storage в ZIP не включены;
- canonical Chromium profile и extension ID не требуют замены.

## Проверки

### JavaScript syntax

Все JavaScript-файлы кандидата проверены командой `node --check`.

```text
PASS
```

### Parser tests

Положительные сценарии:

- ordinary `/c/<id>`;
- ordinary `/c/<id>/`;
- project `/g/g-p-…/c/<id>`;
- project `/g/g-p-…/c/<id>/`;
- uppercase UUID normalizes to lowercase.

Отрицательные сценарии:

- project root без `/c/<id>`;
- невалидный conversation ID;
- ID с лишним суффиксом.

```text
identity parser tests: PASS
```

### Mutation test

Production parser временно возвращён к старому строгому выражению `^/c/<id>$`.

Тот же parser test завершился ожидаемым ненулевым кодом:

```text
expected failure: PASS
exit code: 1
```

Это доказывает, что тест действительно обнаруживает возврат исходного дефекта и не создаёт PASS собственной заглушкой.

### Patch application

Patch применён к чистой базе `2.0.0.11` с `-p1`.

Результат побайтно сравнен с каталогом кандидата `2.0.0.12`:

```text
patch apply: PASS
byte identity: PASS
```

### ZIP integrity

ZIP распакован в новый пустой каталог.

Проверено:

- архив открывается без ошибки;
- полный набор файлов: `13`;
- распакованное содержимое побайтно совпадает с кандидатом;
- повторный `node --check` всех распакованных JavaScript-файлов: PASS.

```text
ZIP integrity: PASS
ZIP/candidate byte identity: PASS
```

## Проверенные hashes

```text
business-bridge-2.0.0.12-project-chat-fix-candidate.zip
187e75f8bc8487d2e9aee9b9cde3530387ee6e35fbc56e1aebf8d835f3d5e54c

business-bridge-2.0.0.12-project-chat-fix.patch
94126e7513e263eafd7010a4e7359560c63f8aed8de755545d1a52960162ac93

content_script.js
161ce8472f12d85a040bea8a4317c5e1bed0deca60607926e4ea2c802f7c7fed

manifest.json
0daa3a23ba3f0e48c5fd5c414f5ec9b5c950c77d532061a177dcd4af1db4b445

shared/proven_writing_block_capture.js
5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef
```

## Live QA status

### Pre-patch reproduction

На текущем установленном `2.0.0.11` в canonical MCP Chromium-сессии открыт тестовый проектный диалог `для уебана`.

Подтверждено:

- фактический URL имеет вид `/g/g-p-…/c/<conversation-id>`;
- ChatGPT-диалог загружается;
- popup расширения не получает контекст нового проектного диалога и остаётся на `Загрузка контекста…`;
- это согласуется с `conversation_id = null` в runtime diagnostics.

```text
PRE-PATCH LIVE REPRODUCTION: PASS
```

### Post-patch live test

Кандидат `2.0.0.12` ещё не установлен в canonical MCP live-path и extension ещё не перезагружен с этим patch.

До выполнения этого этапа запрещено утверждать:

- живой `CONTENT_RUNTIME_STARTED` с корректным project conversation ID;
- успешную загрузку popup context;
- успешную привязку run к проектному диалогу;
- фактический захват следующего writing block;
- публичную готовность сборки.

```text
POST-PATCH LIVE TEST: PENDING
```

## Known limitations

1. Живой post-patch тест в созданном владельцем проектном диалоге ещё не выполнен.
2. Полный Stage 3 QA и публичный release gate не завершены.
3. Patch исправляет только распознавание conversation ID в project-chat URL; он не изменяет остальные DOM adapters ChatGPT.
4. Сборка остаётся кандидатом до установки в тот же live-path, `extension_reload` и проверки фактических runtime diagnostics.
5. Параллельные multi-conversation/multi-server сценарии повторно не прогонялись после этого изменения.

## Rollback

Перед установкой в canonical live-path необходимо создать полный backup текущего каталога `2.0.0.11`:

```text
D:\codex\MCP\chrome-extension-lab-mcp-v0.1.1\data\extensions\business-bridge-2-live-lab-backup-before-2.0.0.12-<timestamp>
```

Установка должна сохранять тот же unpacked extension path:

```text
D:\codex\MCP\chrome-extension-lab-mcp-v0.1.1\data\extensions\business-bridge-2-live-lab
```

При FAIL:

1. не создавать новый Chromium profile;
2. сохранить diagnostics и screenshot;
3. вернуть содержимое backup в прежний live-path;
4. выполнить `extension_reload` в той же canonical Chromium-сессии;
5. проверить manifest/runtime version и восстановление прежнего popup state;
6. не повторять необратимые Send/delivery действия существующего run.

Серверный rollback не требуется: серверная часть не изменена.

## Final status

```text
ROOT CAUSE: PROVEN
PATCH CONTENT: VERIFIED
PATCH APPLICATION: PASS
PARSER TESTS: PASS
MUTATION TEST: PASS (EXPECTED FAILURE DETECTED)
JAVASCRIPT SYNTAX: PASS
ARCHIVE INTEGRITY: PASS
PROTECTED WRITING-BLOCK CAPTURE: UNCHANGED
PRE-PATCH LIVE REPRODUCTION: PASS
POST-PATCH LIVE TEST: PENDING
PUBLIC RELEASE: NO
```


---

# VERSION ENTRY — 2.0.0.13 manual CLI button, deferred operator pause, and live-log delivery repair
Дата: **2026-07-27**  
Technical ID: `BB2-EXTENSION-2.0.0.13-MANUAL-PAUSE-LOG-REPAIR-20260727-01`  
Base version: `2.0.0.12`  
Artifact: `business-bridge-chatgpt-extension-v2.0.0.13.zip`  
SHA-256 ZIP: `440221cd338136061b94c768027457f4c27c323cb7c6ce16d305ef5bddce5b1c`  
Test evidence: `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_2.0.0.13.json`  
SHA-256 test evidence: `f3734dea83757c96a818e375f5e12e8c1f2b1570c4e1ffaeeed2e17499fae008`  
Final extracted-test TAP SHA-256: `6dd7ecafa371a3ece7aff1d39e7d543c082020924bd401caf87997b702be8503`  
Status: **эмулированные regression и failure-path tests приняты; реальный Chrome acceptance остаётся отдельным обязательным gate.**

## Причина изменения

Владелец запросил три связанных изменения:

1. Постоянно отображать возле локальной кнопки Copy каждого поддерживаемого writing block кнопку ручной отправки в CLI, когда текущий ChatGPT-диалог явно привязан к Bridge-профилю.
2. Исправить Pause: если CLI-задача уже принята или report находится в delivery pipeline, Pause не должна обрывать run. Она должна дождаться terminal report, выполнить единственную доставку, подтвердить фактический ChatGPT user-turn и только затем остановить автоматический prompt watcher.
3. Разобрать live diagnostics версии `2.0.0.12` и исправить выявленные ошибки доставки и диагностирования.

## Доказанная первопричина по live-логам 2.0.0.12

В предоставленном фрагменте журнала содержалось 250 последних событий. Для одного `delivery_id` были видны 117 последовательных `DELIVERY_SEND_CALLED` с номерами попыток от `24` до `140` за `193.272` секунды. Все видимые попытки использовали `button.click`, и у всех было `click_event_observed=false`. После этого расширение приняло очистку composer как успешную доставку и подтвердило сервер synthetic receipt вида `composer-empty:<delivery_id>`.

Source-level причина находилась в `content_script.js`: функция `clickComposerUntilEmpty()` повторяла выбор Send-кнопки и `button.click()` до тех пор, пока composer не становился пустым. Критерий «composer пуст» не доказывает появление matching ChatGPT user-turn и не может служить delivery truth.

Дополнительно HTTP diagnostics записывали строку `"undefined"` вместо `null` для отсутствующих `chain_id`/`job_id`, что ухудшало машинный анализ и визуально смешивало отсутствующее значение с реальным идентификатором.

## Что именно работало некорректно

### 1. Повторный Send-click

- Один committed delivery мог вызвать десятки и потенциально сотни необратимых `button.click()`.
- React/Prefix Helper/ChatGPT могли не очистить composer немедленно, и это ошибочно воспринималось как разрешение нажать Send повторно.
- Это нарушало основной инвариант `commit → exactly one Bridge click → reconciliation only`.

### 2. Ложное подтверждение delivery

- Серверный confirm получал synthetic `composer-empty:*`, а не реальный `data-turn-id` нового ChatGPT user-turn.
- Очистка composer могла произойти без доказательства того, что полный report действительно появился в диалоге.
- После такого confirm prompt watcher запускался заново, даже если фактическая доставка была неопределённой.

### 3. Pause замораживала не тот уровень состояния

- Старое состояние `paused` смешивало остановку автоматического захвата prompts с остановкой job/delivery pipeline.
- При нажатии Pause во время active CLI task не было отдельного durable признака «поставить на паузу после report».
- Ручные задания внутри операторской паузы были невозможны, потому что server chain и локальный polling рассматривались как полностью остановленные.

### 4. Recovery уже confirmed delivery

- При восстановлении server state `confirmed` код мог перейти в `waiting_prompt` и снова включить watcher, не завершив manual one-shot и не применив ранее запрошенную операторскую паузу.
- При отсутствии реального `confirmed_user_turn_id` мог создаваться synthetic recovery receipt.

### 5. Слабость diagnostics

- Неопределённые IDs отображались строкой `undefined`.
- Click-событие, не замеченное capture/bubble listeners, записывалось как обычный `info`, хотя это важный warning signal.
- Ранний helper мог бы скрыть превышение click-budget, если бы просто обрезал фактическое число попыток до одного.

## Реализованные изменения

### Ручная кнопка writing block

- Content script добавляет кнопку с маркером `data-bb2-manual-cli-button` рядом с доказанной локальной Copy-кнопкой writing block.
- Кнопка отображается всегда, когда текущий диалог имеет явный Bridge binding.
- Если binding отсутствует, кнопка не добавляется.
- Если профиль, token, соединение или CLI недоступны, либо автоматический режим активен, pause ещё ожидает report, pipeline занят или run находится в safety pause, кнопка остаётся видимой, но disabled и содержит точную причину в label/tooltip.
- Ручная отправка извлекает текст через доказанный `sectionWritingBlockText()` и не нажимает штатную кнопку Copy, поэтому clipboard пользователя не изменяется.
- При отсутствии active run создаётся временный `manual_one_shot` chain/run без сообщения «поехали». После одного report, фактического user-turn и server confirm chain завершается.
- При операторской паузе используется существующий run и его immutable profile snapshot. Chain временно разрешает приём одного manual job и снова закрывается для новых jobs после принятия задачи; уже принятая задача продолжает выполняться.
- Одновременно допускается только одна ручная submission operation; общий conversation lock, per-run lock и server idempotency предотвращают double-click race.

### Исправленная Pause

- Добавлено независимое состояние `operator_pause`: `running | requested | paused`.
- Pipeline status продолжает описывать фактическую фазу: `submitting_job`, `waiting_job`, `delivery_claimed`, `delivery_committed`, `waiting_prompt` и terminal states.
- Pause в idle `waiting_prompt` применяется сразу: watcher останавливается, server chain получает `/pause`, ручная кнопка активируется.
- Pause во время submission/job/delivery устанавливает `operator_pause=requested`, немедленно выключает только автоматический prompt watcher, но не отменяет задачу и не останавливает polling/delivery.
- После terminal report выполняются один Send-click, поиск matching user-turn и server confirm. Только после этого server chain ставится на паузу и `operator_pause` становится `paused`.
- В операторской паузе можно последовательно отправить один или несколько writing blocks вручную; после каждого подтверждённого report run возвращается в operator-paused idle.
- Resume разрешён только когда manual pipeline idle. Он возобновляет server chain, сбрасывает operator pause и создаёт новый automatic prompt watch.
- Safety pause остаётся отдельным fail-closed состоянием и не разрешает новые ручные задания.

### Единственный Send-click и фактический user-turn

- `clickComposerUntilEmpty()` удалена.
- Новый `clickComposerOnce()` повторно валидирует composer и Send target, затем вызывает ровно один `button.click()`.
- После click расширение ничего больше не нажимает и только ждёт новый user-turn, которого не было в baseline.
- Подтверждение допускает Prefix Helper prefix и нормализацию whitespace, но требует наличие полного outgoing payload внутри нового user-turn.
- Серверный `/delivery/confirm` получает реальный ChatGPT `user_turn_id`. Synthetic `composer-empty:*` запрещён.
- Любая ошибка после commit или фактического click переводит run в manual-action safety pause без повторного Send.

### Recovery и diagnostics

- Recovery server-confirmed delivery требует реальный `confirmed_user_turn_id`.
- Recovery сохраняет pending operator pause, manual one-shot termination и automatic/off semantics.
- HTTP path diagnostics возвращают `null` для отсутствующего `chain_id`/`job_id`.
- Фактическое число click attempts сохраняется; поле `click_budget_exceeded=true` явно отмечает нарушение бюджета.
- Неobserved click-event записывается с уровнем `warning`.
- При замене content runtime disconnect выполняется и для manual MutationObserver, чтобы не оставлять stale observer.

## Изменённые файлы

- `content_script.js` — manual DOM button, one-click delivery, real user-turn observation, observer cleanup;
- `service_worker.js` — manual one-shot/manual paused submission, deferred Pause, actual user-turn confirm, recovery reconciliation, button-state broadcast, diagnostic correction;
- `shared/model.js` — operator-pause and manual-submission state model;
- `shared/manual_policy.js` — button visibility/availability policy and reason codes;
- `shared/delivery_guard.js` — user-turn matching, no-resend disposition and click budget;
- `shared/diagnostic_guard.js` — HTTP route normalization and click-budget diagnostics;
- `manifest.json` — version and loading of new shared modules;
- `popup.js`, `popup.html`, `package.json` — version/UI/state synchronization;
- `tests/` — 70 deterministic emulation and regression tests;
- `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_2.0.0.13.json` — machine-readable evidence.

Не изменён: `shared/proven_writing_block_capture.js`. SHA-256 сохранён: `5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef`.

## Удалённый функционал

- Удалён delivery retry-until-composer-empty loop.
- Удалено synthetic подтверждение `composer-empty:<delivery_id>`.
- Не добавлялась периодическая активация вкладки/окна. Event-driven activation сохранена.

## Сохранённые инварианты

- явный conversation binding определяет Bridge server для нового run;
- active run использует immutable profile snapshot;
- один writing block создаёт не более одного idempotent submission для одной принятой операции;
- committed delivery никогда не становится sendable повторно;
- после единственного click разрешена только reconciliation;
- ручная кнопка не меняет clipboard и не изменяет доказанный capture algorithm;
- автоматическая и ручная submission не выполняются одновременно в одном run;
- Pause не отменяет уже принятую CLI task;
- Finish остаётся hard stop;
- event-driven focus policy сохраняется; periodic 20-second activation отсутствует;
- prompt/report/token не добавлены в structured diagnostics.

## API / storage / schema changes

Server API contract не изменён. Используются существующие `/v2/chains`, `/jobs`, `/delivery/claim`, `/delivery/commit`, `/delivery/confirm`, `/pause`, `/resume` и `/terminate`.

Локальные run records получают новые нормализуемые поля: `operator_pause`, `operator_pause_requested_at`, `operator_paused_at`, `submission_origin`, `manual_one_shot`, `consumed_manual_blocks`. Отдельная database migration не требуется: `normalizeRun()` добавляет defaults при чтении, а legacy operator pause преобразуется в `waiting_prompt + operator_pause=paused`, если это не safety pause.

## Tests

Эмулированная среда: Node.js VM modules, deterministic fake DOM для composer/Send, state-machine simulation, source-contract guards, network/error disposition simulation, syntax checks, manifest parse и тест из свежей распаковки ZIP. Реальная навигация Chrome/ChatGPT и live Bridge server в этой среде не запускались.

Первый формальный прогон: **70 passed, 0 failed**. Поэтому тестов с отметкой «упал в первом прогоне» нет. После первого прогона дополнительный ручной source audit нашёл четыре непокрытых тестовым падением слабости: redundant `/resume` для новой one-shot chain, неправильную confirmed-recovery семантику, потенциальное сокрытие click-budget violation и stale manual observer. Они исправлены, соответствующие существующие тесты усилены, затем весь набор повторён.

Финальные результаты:

- рабочее source tree: `70 passed, 0 failed`;
- предварительная свежая распаковка ZIP: `70 passed, 0 failed`;
- финальная свежая распаковка ZIP: `70 passed, 0 failed`;
- JavaScript syntax: passed для всех `.js`;
- Manifest V3 parse/module order: passed;
- protected writing-block capture SHA: passed.

### Ручная кнопка — 30 тестов

- **M01 — PASS:** binding without active run shows enabled manual button
- **M02 — PASS:** operator-paused idle run allows manual submit
- **M03 — PASS:** ready label includes selected CLI
- **M04 — PASS:** ready tooltip includes profile label
- **M05 — PASS:** automatic run keeps button visible but disabled
- **M06 — PASS:** deferred pause keeps button visible and disabled
- **M07 — PASS:** paused run with active job reports pipeline busy
- **M08 — PASS:** safety pause is visible and disabled
- **M09 — PASS:** absent binding hides button entirely
- **M10 — PASS:** missing bound profile keeps button visible with reason
- **M11 — PASS:** missing credential disables button
- **M12 — PASS:** disconnected transport disables button
- **M13 — PASS:** unknown transport state fails closed
- **M14 — PASS:** no selected executor disables button
- **M15 — PASS:** explicitly unavailable executor disables button
- **M16 — PASS:** unknown catalog availability does not erase an otherwise selected CLI
- **M17 — PASS:** paused submitting pipeline is busy
- **M18 — PASS:** paused claimed delivery is busy
- **M19 — PASS:** paused committed delivery is busy
- **M20 — PASS:** inconsistent waiting_prompt with current job fails busy
- **M21 — PASS:** inconsistent waiting_prompt with pending submission fails busy
- **M22 — PASS:** invalid operator pause value normalizes to automatic
- **M23 — PASS:** manual submission model rejects an automatic run
- **M24 — PASS:** manual submission model rejects a pending pipeline
- **M25 — PASS:** manual submission preserves paused automation
- **M26 — PASS:** manual one-shot flag is stored
- **M27 — PASS:** manual block journal deduplicates same structural block
- **M28 — PASS:** manual block journal is bounded to 100 records
- **M29 — PASS:** content source inserts a dedicated non-copy button marker and one-shot chains skip resume
- **M30 — PASS:** content source extracts manual payload without clicking ChatGPT Copy

### Пауза — 10 тестов

- **P01 — PASS:** idle automatic run pauses immediately without changing pipeline status
- **P02 — PASS:** running CLI task records deferred pause and keeps waiting_job
- **P03 — PASS:** submitting job records deferred pause and preserves submission
- **P04 — PASS:** committed delivery records deferred pause and preserves delivery
- **P05 — PASS:** completed deferred pause becomes operator-paused
- **P06 — PASS:** hard-stopped run cannot be revived by pause request
- **P07 — PASS:** errored run cannot be converted into operator pause
- **P08 — PASS:** safety-paused run remains safety-paused
- **P09 — PASS:** legacy operator pause migrates to waiting_prompt plus operator flag
- **P10 — PASS:** worker source defers server pause until delivery completion for busy runs

### Логи: повторный Send-click — 10 тестов

- **C01 — PASS:** one synchronous send calls button.click exactly once
- **C02 — PASS:** observed DOM click is reported but does not change click budget
- **C03 — PASS:** unobserved DOM click is still dispatched only once
- **C04 — PASS:** disabled button is rejected before click
- **C05 — PASS:** detached target is rejected before click
- **C06 — PASS:** changed composer text is rejected before click
- **C07 — PASS:** click budget accepts zero attempts before dispatch
- **C08 — PASS:** click budget accepts exactly one irreversible call
- **C09 — PASS:** click budget rejects the 140-attempt pattern seen in logs
- **C10 — PASS:** content runtime contains no retry-until-empty click loop

### Логи: подтверждение delivery — 10 тестов

- **U01 — PASS:** exact user-turn payload confirms delivery
- **U02 — PASS:** Prefix Helper prefix before full payload confirms delivery
- **U03 — PASS:** whitespace normalization preserves matching
- **U04 — PASS:** rendered wrapper containing the complete payload matches
- **U05 — PASS:** unrelated user-turn does not confirm delivery
- **U06 — PASS:** empty expected report cannot confirm
- **U07 — PASS:** actual ChatGPT user-turn ID is accepted and confirmed recovery requires it
- **U08 — PASS:** synthetic composer-empty receipt is rejected
- **U09 — PASS:** committed or clicked delivery failure becomes manual action without resend
- **U10 — PASS:** source confirms server delivery with response.user_turn_id, never composer-empty receipt

### Логи: диагностическая точность — 10 тестов

- **D01 — PASS:** identity endpoint logs null chain and job IDs
- **D02 — PASS:** executor endpoint logs null IDs instead of string undefined
- **D03 — PASS:** chain endpoint extracts chain ID and redacts path template
- **D04 — PASS:** job endpoint extracts job ID and redacts path template
- **D05 — PASS:** percent-encoded IDs are decoded safely
- **D06 — PASS:** malformed percent encoding does not crash diagnostics
- **D07 — PASS:** click diagnostic preserves historical 140 attempts and flags the budget violation
- **D08 — PASS:** zero-attempt pre-click diagnostic stays zero without a violation
- **D09 — PASS:** worker delegates HTTP route logging to diagnostic guard
- **D10 — PASS:** content diagnostics preserve warning severity for unobserved click

## Live acceptance

Перед объявлением версии принятой рабочей сборкой требуется реальный controlled Chrome test:

- обновить существующую unpacked-папку in place и Reload;
- подтвердить сохранение profile/token/binding/settings;
- увидеть кнопку возле локальной Copy writing block;
- проверить disabled reasons при auto mode, отсутствии CLI и обрыве туннеля;
- в operator pause отправить минимум два разных writing blocks вручную и получить два последовательных reports;
- нажать Pause во время реальной CLI task и доказать: task завершилась, report появился один раз, delivery подтвердился реальным user-turn, затем run стал paused;
- нажать Resume и доказать восстановление automatic watcher;
- проверить Prefix Helper interception/replay при единственном Bridge click;
- перезагрузить страницу/service worker между commit и user-turn observation и убедиться, что повторного Send нет;
- проверить два параллельных диалога и отсутствие cross-dialog routing.

## Security impact

- Content script не получает token и не формирует Bridge endpoint из DOM.
- Manual request содержит только conversation identity, assistant/writing-block IDs, prompt text и fingerprint; worker повторно проверяет active tab и strict bound profile.
- Browser не принимает shell command/environment/working directory.
- После commit/click никакой автоматический resend не разрешён.
- Diagnostics не записывают полный prompt, report, token или Authorization header.

## Known limitations

- Тесты являются эмуляцией и source/runtime regression tests, а не реальным Chrome E2E.
- ChatGPT DOM может изменить структуру локального toolbar; в этом случае кнопка не будет вставлена до обновления adapter, но должна fail closed.
- Невозможность browser click-event listener увидеть программный `button.click()` сама по себе не доказывает провал; truth теперь определяется новым matching user-turn.
- Live поведение server `/resume` для уже active chain и `/pause` сразу после job admission зависит от установленного alpha.2 contract и требует реальной проверки.
- Manual button в текущем patch ориентирована на тот writing-block contract, который уже использует автоматический Bridge capture.

## Rollback

1. Не удалять существующую unpacked extension, если storage должен сохраниться.
2. Перед заменой сохранить копию папки версии `2.0.0.12` и экспорт настроек.
3. Для rollback вернуть файлы `2.0.0.12` в ту же папку и нажать Reload.
4. Не повторять Send для delivery, которая могла уже пересечь commit/click boundary.
5. Server rollback не требуется: версия меняет только extension.

## Final status

Artifact `2.0.0.13` собран из исправленного дерева, содержит test evidence и прошёл полный набор из 70 тестов как в source tree, так и после fresh extraction. Сборка готова к controlled live Chrome acceptance, но до такого теста не объявляется production-ready.


---

# VERSION ENTRY — 2.0.0.14: ручная CLI-кнопка без зависимости от native Edit

Дата: **2026-07-27**  
Technical ID: `BB2-EXT-MANUAL-BUTTON-NO-EDIT-20260727-01`  
Base canonical documentation: `BUSINESS_BRIDGE_2_DOCUMENTATION_CURRENT_2.0.0.13.md`  
Base canonical documentation SHA-256: `2320634d6898f1695e260005a38bf097e642170e42ec2a78fb7e673fc8101193`  
Implementation base artifact: `business-bridge-chatgpt-extension-v2.0.0.13-reference-button-pause.zip`  
Implementation base artifact SHA-256: `a203c15ffefbbb84451ba2bb2065d24d775754474e2cd00fd8eb146726883ddc`  
Artifact: `business-bridge-chatgpt-extension-v2.0.0.14-no-edit.zip`  
Artifact SHA-256: `a3ddedfe5b18b94fc887784143dff672883a3b14b487334755d7ff22ceb5f33f`  
Artifact size: `71942` bytes  
Status: **статически проверенный patch-кандидат; реальный Chrome acceptance после установки не выполнен**

## Причина изменения

Реальная проверка на текущем DOM ChatGPT показала writing/code block с локальной штатной кнопкой Copy, но без native Edit. Версия `2.0.0.13-reference-button-pause` искала локальную Copy одним из двух способов:

1. общий DOM-контейнер Copy и Edit;
2. Copy внутри `[data-writing-block]`, `[data-writing-block-id]` или `#code-block-viewer`.

В наблюдаемой разметке `#code-block-viewer` содержал тело блока, а локальная Copy находилась в соседнем toolbar. Поэтому resolver возвращал `null`, и ручная CLI-кнопка не вставлялась, хотя профиль, соединение, binding и выбранная CLI были готовы.

## Доказанная первопричина

Первопричина находилась в `content_script.js`, в resolver локальной Copy-кнопки:

- наличие native Edit использовалось как условие доказательства локальности Copy;
- fallback принимал только Copy, физически находящуюся внутри explicit writing-block root;
- соседний toolbar текущего ChatGPT DOM не удовлетворял ни одному условию;
- цикл декорирования fail-closed пропускал блок без создания кнопки.

Сервер Business Bridge 2, token, профиль, tunnel и executor catalog не являлись причиной отсутствия кнопки.

## Scope

Patch ограничен поиском локальной Copy-кнопки для ручной CLI-кнопки и синхронизацией номера версии.

В patch не входят:

- изменение automatic run;
- изменение Pause/Resume/Finish;
- изменение composer Send;
- изменение delivery claim/commit/confirm;
- изменение Bridge API;
- изменение server source;
- изменение token/profile storage;
- изменение доказанного алгоритма извлечения writing block.

## Изменённые файлы

Runtime:

- `content_script.js`;
- `shared/manual_controls.js`;
- `manifest.json`;
- `package.json`;
- `popup.html`;
- `popup.js`;
- `service_worker.js`.

Tests:

- `tests/manual_button.test.mjs`.

## Реализованное изменение

- Native Edit полностью исключена из resolver.
- Copy-кандидаты по-прежнему фильтруют generic assistant-turn Copy: `copy-turn-action-button`, «Копировать ответ», `Copy response`.
- При наличии explicit root сначала принимается единственная Copy внутри него.
- Если Copy находится в соседнем toolbar, выбирается единственный кандидат с минимальной DOM-дистанцией через общий контейнер внутри текущего assistant turn.
- Если есть несколько одинаково близких кандидатов, resolver fail-closed возвращает `null`.
- Если explicit root отсутствует, допускается только единственная локальная Copy-кнопка в доказанном section.

## Удалённый функционал

Удалена только зависимость manual-button resolver от native Edit.

Не удалены:

- local Copy binding;
- generic turn Copy exclusion;
- fail-closed поведение при неоднозначности;
- profile/binding/executor проверки;
- существующая кнопочная policy;
- reference Send/delivery/retry mechanics.

## Сохранённые инварианты

- текст prompt извлекается через существующий writing-block capture без клика штатной Copy;
- clipboard пользователя не изменяется;
- отдельная CLI-кнопка добавляется только к доказанному локальному блоку;
- generic assistant-turn Copy не используется как anchor;
- неоднозначная DOM-разметка не приводит к отправке;
- active run и manual one-shot используют существующие idempotency и conversation locks;
- profile snapshot, token lookup и executor validation остаются worker-owned;
- `shared/proven_writing_block_capture.js` не изменён;
- protected capture SHA-256 сохранён: `5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef`;
- server API/schema и Bridge 2 runtime не изменены.

## API / storage / schema changes

- Server API changes: **нет**.
- Extension storage schema changes: **нет**.
- Migration: **не требуется**.
- Chrome permissions changes: **нет**.
- Existing profile, token, binding и run records должны сохраниться при in-place обновлении той же unpacked-папки.

## Tests

Source tree:

- `67 passed`;
- `0 failed`;
- TAP: `bb2_2.0.0.14_no_edit_tests.tap`;
- TAP SHA-256: `13a27e228c51520a5a66d68191df7d59dfd5fc7718cbb5340db9aed163dc3fcc`.

Fresh extraction из финального ZIP:

- `67 passed`;
- `0 failed`;
- TAP: `bb2_2.0.0.14_no_edit_final_extracted_tests.tap`;
- TAP SHA-256: `ac410a8bea913d6e838663e33c085e7006fafdec08cab8073f8c48ad1618f236`.

Дополнительно:

- JavaScript/MJS syntax: **PASS**;
- Manifest parse/version: **PASS**, `2.0.0.14`;
- ZIP integrity: **PASS**;
- sibling toolbar Copy без Edit: **PASS**;
- generic turn-level Copy rejection: **PASS**;
- ambiguous nearest Copy fail-closed: **PASS**;
- source guard на отсутствие Edit dependency: **PASS**.

Machine-readable evidence:

- `TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_2.0.0.14_NO_EDIT.json`;
- SHA-256: `4c6f0a82add6471f8dba34971ef7b715a082f8089137151136e6e0cc1d1ee61e`.

Exact diff:

- `BUSINESS_BRIDGE_2_2.0.0.14_NO_EDIT_DIFF.patch`;
- SHA-256: `ec1bdcbce331deae82f07c16e2460f4a4349b254b88f6eeb36a6b06a5d520dd7`.

## Live acceptance

До объявления patch рабочим требуется реальная проверка в пользовательском Chrome:

1. заменить файлы в той же unpacked-папке;
2. нажать Reload на существующей карточке расширения;
3. обновить вкладку ChatGPT;
4. подтвердить версию content runtime `2.0.0.14`;
5. подтвердить сохранение profile/token/binding/settings;
6. увидеть отдельную CLI-кнопку справа от локальной Copy при полном отсутствии Edit;
7. проверить disabled-state при неготовом профиле/CLI/run;
8. выполнить один harmless manual job через `codex2`;
9. доказать один job, один report, один Send-click и один confirmed user-turn;
10. убедиться, что generic «Копировать ответ» не получила CLI-кнопку.

На момент формирования этой записи live acceptance новой сборки: **PENDING**.

## Security impact

- Новых permissions нет.
- Token и endpoint не передаются в content script.
- Resolver работает только с DOM-кнопками и не читает clipboard.
- При неоднозначности действие запрещается.
- Browser по-прежнему не передаёт shell command, environment или working directory.
- Server source и server credentials не изменяются.

## Known limitations

1. Тесты используют deterministic fake DOM и source guards; они не заменяют реальный Chrome E2E.
2. Текущий алгоритм зависит от наличия доказанного section и локальной Copy-кнопки.
3. При очередном изменении ChatGPT DOM resolver должен fail-closed; кнопка может снова не появиться, но не должна привязаться к чужому блоку.
4. Patch собран на implementation-base `2.0.0.13-reference-button-pause`, тогда как каноническая документация продолжает общую историю всех ветвей `2.0.0.13`; это явно зафиксировано в этой записи.
5. Сборка не считается production-ready до live acceptance.

## Rollback

1. Сохранить текущую unpacked-папку перед заменой.
2. Для rollback восстановить точные файлы `business-bridge-chatgpt-extension-v2.0.0.13-reference-button-pause.zip` в той же папке.
3. Нажать Reload на существующей карточке расширения.
4. Обновить вкладку ChatGPT.
5. Не создавать новую unpacked-папку, если требуется сохранить extension identity и `chrome.storage.local`.
6. Server rollback не требуется.

## Append-only proof

- Base canonical bytes: `177373`.
- Base canonical SHA-256: `2320634d6898f1695e260005a38bf097e642170e42ec2a78fb7e673fc8101193`.
- Весь base canonical document сохранён byte-for-byte как начало текущего документа.
- Эта version entry добавлена только в конец.
- SHA-256 текущего документа фиксируется во внешнем proof-файле, чтобы не создавать самоссылочный hash.

## Final status

```text
VERSION: 2.0.0.14
SCOPE: MANUAL COPY RESOLVER WITHOUT NATIVE EDIT
SERVER/API/STORAGE SCHEMA: UNCHANGED
PROTECTED WRITING CAPTURE: UNCHANGED
SOURCE TESTS: 67 PASSED / 0 FAILED
FRESH ZIP TESTS: 67 PASSED / 0 FAILED
ZIP INTEGRITY: PASS
REAL CHROME ACCEPTANCE: PENDING
PUBLIC RELEASE: NO
```


---

# Version entry — Extension 2.0.0.15 native Copy manual mode

**Date:** 2026-07-27  
**Status:** source/runtime verified and packaged; real user-Chrome acceptance remains pending.

## Reason for this patch

Version `2.0.0.14` attempted to insert a separate Business Bridge button next to ChatGPT's local Copy button. The user's live Chrome test proved that no extra button appeared. The saved live page then established the actual block structure:

- each code/writing block is represented by a `pre` containing `#code-block-viewer`;
- the native local Copy button is in the same `pre` and has `aria-label="Копировать"`;
- the generic response-level Copy button is outside that block and has `data-testid="copy-turn-action-button"`.

The separate-button approach is removed. Manual mode now reuses the native local Copy control and does not append a new DOM element.

## Operator-visible behavior

Popup contains a per-conversation switch **«Ручной режим writing blocks»**.

### Manual mode OFF

- no manual-mode `MutationObserver` exists;
- no manual-mode polling or interval exists;
- no native Copy button is recolored;
- no manual-mode click handler remains attached;
- any style/title changes made by the mode are restored from exact inline-style snapshots;
- automatic run capture and report-delivery logic remain independent and unchanged.

### Manual mode ON

1. The content adapter performs one bounded reverse traversal from the end of the current document.
2. It modifies at most the latest three existing local block Copy buttons.
3. Each selected native Copy button becomes blue.
4. One observer then waits for `childList` additions and examines only `mutation.addedNodes` subtrees.
5. A newly appended block is modified once when it appears.
6. Old or virtualized DOM inserted before the tracked tail is ignored.
7. Clicking the blue native Copy button performs both actions:
   - ChatGPT's original Copy action continues normally;
   - the exact text from that button's own `#code-block-viewer` is submitted through the existing manual Business Bridge workflow.

The added capture listener deliberately does not call `preventDefault`, `stopPropagation`, or `stopImmediatePropagation`. Native Copy therefore remains the primary browser action; Bridge submission is additional behavior.

## Performance and bounded-work contract

The manual subsystem is deliberately inactive while the switch is OFF.

When enabled:

- initial block limit: `3`;
- initial reverse-traversal limit: `5000` visited elements;
- initial scan does not use a full-page `querySelectorAll`;
- observer watches `childList + subtree` only;
- observer callback processes `addedNodes` only;
- added roots are batched for `60 ms`;
- no recurring timer rescans the conversation;
- no separate button node is created;
- disconnected decorated controls are removed from bookkeeping during subsequent batches;
- a tail-order check prevents reprocessing old DOM inserted above the latest observed block.

This is more efficient than repeatedly querying all writing blocks after every React mutation and avoids modifying the full historical conversation.

## Native Copy identification and exact payload ownership

A candidate is accepted only when all of these hold:

1. it is an `HTMLButtonElement`;
2. it is not `data-testid="copy-turn-action-button"`;
3. its accessible text is not «Копировать ответ» / `Copy response`;
4. its nearest `pre` contains `#code-block-viewer`;
5. the local button is uniquely resolved within that `pre`.

The submitted payload is read only from the `#code-block-viewer` associated with the clicked native button's own `pre`. The assistant turn ID comes from the containing assistant section. The structural manual ID uses the exact block index within that assistant turn.

## Manual submission safety

Recoloring is visual and does not imply that Bridge submission is currently allowed. On each click, content asks the service worker for the current manual eligibility state. Existing fail-closed rules remain:

- the conversation must be bound to a valid profile;
- profile credentials must exist;
- a selected executor must exist and be available under current policy;
- no active run may own the conversation, except the already-supported operator-paused idle manual step;
- idempotency and Bridge-side submission rules remain unchanged.

When submission is unavailable, the native Copy action still proceeds and only the additional Bridge action is rejected with a visible reason.

## Storage and popup state

Manual mode is stored per conversation, with a pending-tab fallback until a conversation ID becomes available. The setting is included in extension settings export/import. Changing the switch sends an immediate `BB2_APPLY_MANUAL_MODE` message to the active content runtime.

The extension settings schema version was not incremented; one additional namespaced storage map, `bb2_manual_modes`, was introduced. Server storage and the Business Bridge HTTP API were not changed.

## Changed files

### Functional runtime changes

- `content_script.js`
  - replaces separate-button creation with native-Copy enhancement;
  - adds bounded latest-three initialization;
  - adds `addedNodes`-only observer and tail filter;
  - preserves native Copy propagation;
  - restores native controls when disabled/disposed;
  - submits the exact clicked block through the existing manual workflow.
- `service_worker.js`
  - stores manual mode per conversation;
  - exposes get/set mode messages;
  - notifies content immediately;
  - includes manual-mode state in popup state and settings export/import.
- `popup.html`
  - adds the manual-mode switch and status description.
- `popup.js`
  - renders and changes the per-conversation manual-mode setting.

### Version synchronization

- `manifest.json`
- `package.json`
- `content_script.js`
- `service_worker.js`
- `popup.html`
- `popup.js`

### Tests

- `tests/manual_button.test.mjs`
- `tests/worker_integration.test.mjs`

## Protected behavior

`shared/proven_writing_block_capture.js` remains byte-identical to the implementation base:

```text
SHA-256: 5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef
```

Automatic Start, Pause/Resume, hard Stop, report delivery, commit-before-click boundaries, Send-button selection, server API and executor lifecycle were not intentionally modified.

## Verification

### Source tree

```text
JavaScript syntax: PASS
Tests: 72 passed / 0 failed
```

### Fresh extracted ZIP

```text
ZIP integrity: PASS
Source/extracted file count: 20 / 20
Source/extracted byte identity: PASS
JavaScript syntax: PASS
Tests: 72 passed / 0 failed
```

### Static validation against saved live ChatGPT DOM

The supplied `Бридж.html` contains two `#code-block-viewer` examples. For both examples:

- the viewer is inside a `pre`;
- that same `pre` contains exactly one local `button[aria-label="Копировать"]`;
- that same `pre` contains zero `button[data-testid="copy-turn-action-button"]`.

The page separately contains generic response-level Copy controls, proving that the exclusion marker exists in the captured live DOM.

Machine-readable evidence:

- `BB2_2.0.0.15_LIVE_DOM_STATIC_EVIDENCE.json`;
- SHA-256: `61069f198a7e1b3c81cc0d11c434ffa355a924e233e5af5a1eb9a312a626c23b`.

## Release artifacts and hashes

```text
business-bridge-chatgpt-extension-v2.0.0.15-native-copy-manual-mode.zip
SHA-256: 3b3d421e1a60ba41a53df89fb0264cbf6cbece748939e1479d9787dad993c478
Size: 75483 bytes

BUSINESS_BRIDGE_2_2.0.0.15_NATIVE_COPY_MANUAL_MODE.patch
SHA-256: 16d19177b9f708145c509d2326a0c90767871319e7e647e5ee6587ac56110067
Size: 46036 bytes

content_script.js
SHA-256: 996f567b95b97f287e02890494f074b6b27eaf0d6a8ab2e76161b2a803cfc286

service_worker.js
SHA-256: 31bcbea56b5721e67fc21c10104860f268ffe3f0e104d0774551031118215666

popup.html
SHA-256: 2dd737106f406653a8ea1a794471173de6ade5179279a62fef039c67d451aa57

popup.js
SHA-256: aa69aeacde5e6905bef6c34965d16c81674022bec08d1a6b2b3d6658ebe3ef15
```

## Live acceptance

A real user-Chrome test remains the acceptance gate. This package is not declared production-ready until the following are observed after Reload in the existing unpacked extension identity:

1. popup/content runtime shows `2.0.0.15`;
2. profile, token, conversation binding, executor and settings are preserved;
3. with manual mode OFF, no local Copy is blue and no manual observer behavior occurs;
4. after enabling manual mode, only the latest three existing local block Copy buttons become blue;
5. newly generated blocks become blue without a historical full-page rescan;
6. clicking a blue Copy both copies normally and creates exactly one accepted manual Bridge job;
7. generic «Копировать ответ» remains unchanged;
8. disabling the mode restores native appearance and stops waiting for new blocks.

Local source/runtime tests and saved-DOM validation do not substitute for this live gate.

## Installation preserving profiles and token

1. Back up the current unpacked extension directory.
2. Replace the contents of that same directory with the ZIP contents; do not create a second extension card.
3. Press **Reload** on the existing card in `chrome://extensions`.
4. Refresh the ChatGPT tab.
5. Confirm `content 2.0.0.15` in the popup.
6. Enable **«Ручной режим writing blocks»** for this conversation.

Using the same unpacked path and extension card preserves the existing `chrome.storage.local` identity. Server restart and server rollback are not required.

## Rollback

1. Disable manual mode before replacing files when possible.
2. Restore the backed-up previous unpacked directory contents into the same path.
3. Reload the same extension card.
4. Refresh ChatGPT.
5. Verify that native Copy styles are normal and the prior runtime version is active.

## Final status

```text
VERSION: 2.0.0.15
SCOPE: NATIVE COPY MANUAL MODE, LAST-3 INITIALIZATION, ADDED-NODES-ONLY WAITING
NEW DOM BUTTONS: NONE
NATIVE COPY DEFAULT ACTION: PRESERVED
MANUAL MODE OFF: OBSERVER/POLLING/STYLES/LISTENERS REMOVED
SERVER/API: UNCHANGED
PROTECTED WRITING CAPTURE: BYTE-IDENTICAL
SOURCE TESTS: 72 PASSED / 0 FAILED
FRESH ZIP TESTS: 72 PASSED / 0 FAILED
ZIP INTEGRITY: PASS
SAVED LIVE DOM CONTRACT: PASS
REAL USER-CHROME ACCEPTANCE: PENDING
PUBLIC RELEASE: NO
```


---

# VERSION ENTRY — 2.0.0.16

Дата: **2026-07-27**  
Manifest version: `2.0.0.16`  
Implementation base: `2.0.0.15`  
Scope: **RUN_BUSY feedback, report-prefix cadence, Copy-button picker, popup UX reordering and action feedback**

## Причина изменения

Live-проверка `2.0.0.15` показала одновременно несколько эксплуатационных проблем:

1. первый клик по синей native Copy создавал один manual job, но после React-перерисовки последующие клики могли оставаться только обычным копированием без понятной визуальной индикации занятости Bridge;
2. ручная Copy определялась только автоматическим DOM-resolver, хотя оператору требовался явный picker по образцу Send-кнопки;
3. в popup основные действия run и состояние привязки находились слишком низко;
4. обычные checkbox не давали достаточно явного состояния автоматического и ручного режимов;
5. действия popup не имели единой визуальной обратной связи;
6. отсутствовал настраиваемый префикс возвращаемого CLI-отчёта с такой же интервальной моделью, как у файла контекста.

## Реализованное поведение

### Повторный клик при занятом CLI

При первом разрешённом клике создаётся ровно один manual run/job. Когда run находится в занятом состоянии (`starting`, `submitting_job`, `waiting_job`, `delivery_ready`, `delivery_claimed`, `delivery_committed`, имеет `pending_submission`, `current_job_id` или ожидающую паузу):

- новый `chain`, `run` или `job` не создаётся;
- prompt повторно не передаётся в Bridge;
- сетевой Bridge-запрос из blocked-ветки не выполняется;
- штатное действие native Copy не блокируется;
- пользователю показывается плашка:

```text
Bridge уже выполняет или доставляет задачу.
```

Worker повторно проверяет занятость внутри run-lock и возвращает `RUN_BUSY`, поэтому защита действует также при гонке между предварительной проверкой content script и фактическим submit.

### React-перерисовка native Copy

Новые DOM-кнопки не создаются. Расширение продолжает изменять только цвет и дополнительный обработчик штатной локальной Copy.

Для сохранения обработчика после React replacement:

- при включении один раз обрабатываются только три последних writing blocks;
- эти три `pre` становятся tracked roots;
- затем `MutationObserver` читает только `addedNodes`;
- изменение внутри уже tracked root разрешает повторно найти и оформить только текущую Copy этого root;
- новый writing block принимается только после сохранённого tail root;
- старые вставки выше tail игнорируются;
- полного повторного `document.querySelectorAll` по истории, интервального polling и постоянного сканирования нет;
- при выключении manual mode observer отключается, очереди и tracked roots очищаются, стили и обработчики снимаются.

### Ручной picker Copy-кнопки

Добавлены:

- `Выбрать Copy-кнопку`;
- `Сбросить Copy-кнопку`;
- профиль `bb2_manual_copy_button_v1`;
- runtime API сохранения, чтения, очистки и broadcast обновления профиля.

Picker работает по образцу существующего Send picker:

1. оператор включает выбор;
2. следующий `pointerdown` по локальной Copy перехватывается только для обучения;
3. штатное копирование и manual submit во время picker не выполняются;
4. сохраняются tag, `data-testid`, `aria-label`, title, name, type и fallback text hint;
5. кнопка обязана находиться внутри `pre`, содержащего `#code-block-viewer`;
6. `data-testid="copy-turn-action-button"`, `Копировать ответ` и `Copy response` явно отклоняются.

При включении manual mode без сохранённого Copy-профиля popup автоматически запускает picker. До выбора доступен прежний безопасный локальный fallback; после выбора применяется сохранённая сигнатура.

### Префикс CLI-отчёта

Для каждого ChatGPT-диалога отдельно хранятся:

- `enabled`;
- `text`;
- `interval` от 1 до 999;
- `delivered_count`;
- `last_applied_at_count`;
- `updated_at`.

Префикс добавляется перед outgoing CLI-report, включая отчёты об ошибках CLI, и не добавляется в prompt, отправляемый в CLI.

Интервальная модель совпадает с файлом контекста:

```text
delivered_count - last_applied_at_count >= interval - 1
```

Следствия:

- `N = 1` — перед каждым подтверждённо доставляемым отчётом;
- `N = 2` — перед каждым вторым отчётом;
- `N = 3` — перед каждым третьим отчётом.

Счётчик `delivered_count` увеличивается только после подтверждённой доставки. `last_applied_at_count` обновляется только если префикс фактически был применён к этому отчёту.

### Popup UX

Новый порядок сверху вниз:

1. явный статус `Диалог привязан` / `Диалог не привязан` и кнопка `Привязать диалог`;
2. `Начать`, `Пауза`, `Продолжить`, `Завершить`;
3. toggle автоматического режима;
4. toggle ручного режима;
5. выбор Copy-кнопки;
6. состояние текущего run;
7. выбор CLI;
8. префикс отчёта и его счётчик;
9. файл контекста и его счётчик;
10. настройки следующей итерации;
11. Bridge/server, Send picker и перенос настроек;
12. диагностика.

Обычные checkbox автоматического и ручного режимов заменены визуальными toggle switches. Кнопки имеют pressed-state, loading-state, success-state и error-state; важные async-действия временно меняют подпись и показывают подтверждение результата.

### Привязка диалога

Кнопка `Закрепить за диалогом` переименована в `Привязать диалог` и вынесена в верхний priority block. Popup показывает точный привязанный профиль и endpoint либо явное отсутствие привязки. Manual submit по-прежнему требует strict conversation binding и не маскирует его default-profile fallback.

## Storage и перенос настроек

```text
settings schema: 3
settings backup version: 3
поддерживаемый импорт: backup versions 1, 2, 3
```

Новые ключи:

```text
bb2_copy_button_profile
bb2_report_prefix_configs
```

Copy profile и report-prefix configs участвуют в экспорте/импорте. Переход с установленной `2.0.0.15` создаёт migration backup и сохраняет существующие profiles, credentials, bindings, runs, Send profile, attachment settings и manual-mode settings.

## Изменённые файлы

```text
content_script.js
service_worker.js
popup.html
popup.css
popup.js
manifest.json
package.json
tests/worker_integration.test.mjs
tests/v2016_features.test.mjs (new)
```

## Сохранённые инварианты

Следующие файлы byte-for-byte совпадают с `2.0.0.15`:

```text
shared/proven_writing_block_capture.js
SHA-256: 5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef

shared/composer_send.js
SHA-256: a6a2b25ea29637b76250a9f29fdcb177b52824a16a193b44ca5603df2494da79

shared/model.js
SHA-256: e28abfba38ea70121221aacb113bcbe18b0d679e99da430fd90ba9977ab5b865

shared/protocol.js
SHA-256: 7c70bdf236c052d85522d231f073794c11036d7448a9e98608484f2bec5e83fd

shared/transport.js
SHA-256: 08ce98ec6304200bcf5e6d6c50edde6f2a9fea6abad5aba07facdd375fe5aa9b

shared/manual_controls.js
SHA-256: ad955ed32881961de48aad8ce0e245ec23e5c0b059486a040ced546da852aac7

shared/toast.js
SHA-256: 297735146c08a2e4498553307935be8c2ec1533cd2e1d2b4c87f104d4f69a533
```

Protected regression tests additionally подтверждают byte identity функций `clickComposerUntilEmpty`, `deliverReport`, `stabilizeComposerForSend`, `diagnostic`, `bridgeFetch` и `claimJobDelivery`.

## Проверки

### Source tree

```text
JavaScript syntax: PASS
Tests: 86 passed / 0 failed
```

### Fresh extracted ZIP

```text
ZIP integrity: PASS
Source/extracted file count: 21 / 21
Source/extracted byte identity: PASS
JavaScript syntax: PASS
Tests: 86 passed / 0 failed
```

Ключевые новые проверки:

- Copy profile save/read/clear;
- generic response Copy rejection;
- last-three initialization and added-nodes-only observer;
- re-enhancement only inside tracked root after React replacement;
- `RUN_BUSY` creates no Bridge request and no new run;
- prefix interval/counter formula and exact `PREFIX + "\n\n" + REPORT` composition;
- prefix and Copy profile export/import;
- popup element order, unique IDs, toggle switches and visual action feedback.

## Артефакты и SHA-256

```text
business-bridge-chatgpt-extension-v2.0.0.16-ux-copy-picker-prefix.zip
SHA-256: 339effdf01372dfd57a8f53e2865c13f84f23ad119bde808cd30908bb4d705bd
Size: 83787 bytes

BUSINESS_BRIDGE_2_2.0.0.16_UX_COPY_PICKER_PREFIX.patch
SHA-256: 9b032308272758aa8c742539390ec635b3520b07bc5b396adb8058a15c09dd8d
Size: 99992 bytes

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.16_SOURCE_TESTS.tap
SHA-256: d54a1aba116ea439f2202112733fee27b721ecbc29012852ed714614eb3f215d

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.16_FRESH_ZIP_TESTS.tap
SHA-256: 6aa76bdf8e4065ba435d0144a7f34261cfe31e7e76825f9f8a6645caaaac1f84

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.16_SYNTAX_CHECK.txt
SHA-256: 713392a15765176878a9a2b5c0af9372f17c6e75b3b921ba907d0dade6c61d09

content_script.js
SHA-256: 2f17203612932760ca9e63f65e55084ea390d0a61b501d3ca2e5706520abc70f

service_worker.js
SHA-256: 8da3f57df48fad3abf9accae17aa5ac438c3af32af24dc09ea88d60c6544f003

popup.html
SHA-256: 7c38f9ce22c98d13e6761b58d8ae2ee746927ee6d177fdd75570c6b85f2e5a05

popup.js
SHA-256: 40d959eb128f3aeb1a4d10edc1c8888b577485ed9531972047020feee7944c01

popup.css
SHA-256: c844d9c75f64d4ba9d5c8685952b7143707b5c07d8fd3b630e49e8a67fb14989
```

## Live acceptance

Реальная проверка в пользовательском Chrome остаётся обязательным acceptance gate. До установки и фактического наблюдения расширение не объявляется production-ready.

После Reload необходимо подтвердить:

1. popup и content показывают `2.0.0.16`;
2. profiles, token, binding, active run и настройки сохранены после schema migration 2 → 3;
3. верхний binding block правильно показывает `Диалог привязан`;
4. Start/Pause/Resume/Stop и оба toggle дают понятную визуальную обратную связь;
5. Copy picker принимает локальную Copy и отклоняет `Копировать ответ`;
6. manual mode включает только три последние Copy и затем новые blocks;
7. после React replacement Copy текущего tracked block снова становится синей без полного исторического сканирования;
8. при занятом CLI повторный клик только копирует и показывает busy-плашку, а число chain/run/job не увеличивается;
9. prefix при `N = 1` появляется перед следующим доставленным CLI-report;
10. счётчики prefix и attachment увеличиваются только после подтверждённой доставки;
11. отключение manual mode снимает observer, стиль и дополнительный обработчик.

## Установка с сохранением identity и storage

1. Сделать резервную копию текущей unpacked-папки расширения.
2. Заменить её содержимое файлами из ZIP `2.0.0.16`.
3. Не создавать новую карточку расширения и не менять unpacked path.
4. Нажать **Reload** на существующей карточке в `chrome://extensions`.
5. Обновить вкладку ChatGPT.
6. Открыть popup и проверить version, binding и настройки.

## Rollback

1. По возможности выключить manual mode.
2. Восстановить содержимое backup unpacked-папки `2.0.0.15` в тот же path.
3. Reload существующей карточки.
4. Обновить ChatGPT.
5. Проверить runtime version и состояние существующего run.

## Final status

```text
VERSION: 2.0.0.16
RUN_BUSY DUPLICATE SUBMISSION: BLOCKED
BUSY NATIVE COPY: PRESERVED
BUSY USER FEEDBACK: VISIBLE TOAST
INITIAL MANUAL SCAN: LAST 3 BLOCKS ONLY
LIVE OBSERVER: ADDED NODES ONLY
REACT COPY REPLACEMENT: TRACKED ROOT ONLY
COPY PICKER: IMPLEMENTED
GENERIC COPY RESPONSE: REJECTED
REPORT PREFIX: PER CONVERSATION, INTERVAL COUNTER IMPLEMENTED
POPUP ORDER: ACTIONS FIRST
AUTO/MANUAL CONTROLS: TOGGLE SWITCHES
ASYNC BUTTON FEEDBACK: IMPLEMENTED
SETTINGS SCHEMA: 3
SERVER/API: UNCHANGED
PROTECTED FILES: BYTE-IDENTICAL
SOURCE TESTS: 86 PASSED / 0 FAILED
FRESH ZIP TESTS: 86 PASSED / 0 FAILED
ZIP INTEGRITY: PASS
REAL USER-CHROME ACCEPTANCE: PENDING
PUBLIC RELEASE: NO
```


# Business Bridge 2 — Extension 2.0.0.17

## Назначение релиза

Версия `2.0.0.17` является ограниченным косметическим и компоновочным обновлением popup поверх `2.0.0.16`.

Согласованный пользовательский результат:

- отдельный переключатель **«Автоматический режим»** удалён как дублирующий Start/Pause/Resume;
- существующая кнопка запуска переименована из `▶ Начать` в **`▶ Авторежим`**;
- идентификатор кнопки `start` и действие `BB2_START_RUN` сохранены;
- выбор Send и Copy перенесён в единый верхний блок **«Кнопки ChatGPT»**;
- в интерфейсе явно указано, что ручной выбор обеих кнопок необязателен;
- при отсутствии ручного профиля сохраняется существующее автоматическое распознавание Send и локальной Copy;
- включение ручного режима больше не запускает Copy picker автоматически;
- ручной режим, Pause, Resume, Stop, Bridge worker, API, run state machine, доставка, prefix, attachment counters и diagnostics не изменялись.

## Итоговая верхняя структура popup

1. Привязка диалога и Bridge-профиль.
2. `▶ Авторежим`, `Ⅱ Пауза`, `▶ Продолжить`, `■ Завершить`.
3. Единственный переключатель ручного режима writing blocks.
4. Единый блок **«Кнопки ChatGPT»**:
   - состояние, выбор и сброс Send-кнопки;
   - состояние, выбор и сброс Copy-кнопки;
   - пояснение об автоматическом fallback.
5. Сводка текущего run.
6. CLI, prefix, attachment, остальные настройки и журнал.

## Поведение выбора кнопок

Ручное указание кнопок не является обязательным precondition для запуска.

### Send

При отсутствии сохранённой сигнатуры расширение продолжает искать доступную кнопку отправки внутри composer form по существующему scoring: `data-testid`, Send/«Отправить» token и `type=submit`.

### Copy

При отсутствии сохранённой сигнатуры расширение продолжает искать локальную Copy внутри `pre`, содержащего `#code-block-viewer`; общая `copy-turn-action-button` / «Копировать ответ» исключается.

Ручные pickers используются как резервная настройка при изменении интерфейса ChatGPT или неоднозначном автоматическом распознавании.

## Границы изменений

`content_script.js` и `service_worker.js` отличаются от `2.0.0.16` только строками runtime version.

Byte-identical protected files:

```text
shared/proven_writing_block_capture.js
shared/composer_send.js
shared/protocol.js
shared/transport.js
```

Изменённая UI-логика ограничена `popup.html`, `popup.css` и `popup.js`:

- удалены DOM и event listener дублирующего `autoMode`;
- удалён принудительный вызов Copy picker после включения manual mode;
- Start action не переписан и продолжает вызывать существующий `startRunAction` → `BB2_START_RUN`;
- существующие обработчики `pickSend`, `clearSend`, `pickCopy`, `clearCopy` сохранены и только перемещены в общей разметке.

## Проверки

### Source tree

```text
JavaScript syntax: PASS
Tests: 91 passed / 0 failed
```

### Fresh extracted ZIP

```text
ZIP integrity: PASS
Source/extracted file count: 22 / 22
Source/extracted byte identity: PASS
JavaScript syntax: PASS
Tests: 91 passed / 0 failed
```

Новые проверки версии:

- `autoMode` отсутствует в HTML и JavaScript;
- `▶ Авторежим` использует прежний `start` handler;
- Send и Copy расположены в одном `picker-box`;
- ручной выбор обозначен как необязательный;
- включение manual mode не вызывает ни один picker;
- автоматические Send/Copy fallback остаются в content script;
- версия синхронизирована во всех runtime-файлах.

## Артефакты и SHA-256

```text
business-bridge-chatgpt-extension-v2.0.0.17-cosmetic-autorun-unified-buttons.zip
SHA-256: c3f2315fee10a25a1d7a70080932645464bc56d5bb564b749d41dce5b06ff9a8
Size: 86442 bytes

BUSINESS_BRIDGE_2_2.0.0.17_COSMETIC_AUTORUN_UNIFIED_BUTTONS.patch
SHA-256: 4b1c041f432249fc5674a60884b8470ec4c50726758275a74e7c5763556bc969
Size: 16126 bytes

TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_2.0.0.17_COSMETIC_AUTORUN_UNIFIED_BUTTONS.json
SHA-256: e264b37ca80056882101fd380a5dc6138c1ba54b521cd78b31c9412f27a5ef7c
Size: 4733 bytes

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.17_SOURCE_TESTS.tap
SHA-256: 60185d9edfc195e8d26f070f2a915d2f30b7b73510f01a509becd7b567d93517

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.17_FRESH_ZIP_TESTS.tap
SHA-256: 9dfa6848ba7b8aa098880f0313918c6ab43d4c00ad60cdfc1e6d130f3f244d63

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.17_SYNTAX_CHECK.txt
SHA-256: ce9f2fd8ffe9136ceb4531fdd634c59bdcb508b1cf3967ea7867133dc2226870

popup.html
SHA-256: 8396a6e81494938718399dd85033b914977707bc292692db5ae48a52ba786277

popup.js
SHA-256: a783f5559e8138e7f34506d629736c770fa7e84c58d390bf6b81ef8975c9a6b8

popup.css
SHA-256: 4693d9c32d44725431f6f705febd7ed9cfb34e76c213ba6144a6aab44b45269a

content_script.js
SHA-256: 282ffd084e0990d37c5ade6da92cb38c5a306e5b98ea3b654ba8b448526a61be

service_worker.js
SHA-256: 239b215ababb8286616f030e4ce25cd00592e5ef5a359a6c6f7f3fcc12c3a6cc
```

## Live acceptance

Реальная проверка в пользовательском Chrome остаётся обязательным acceptance gate.

После Reload проверить:

1. popup и content показывают `2.0.0.17`;
2. отдельный переключатель «Автоматический режим» отсутствует;
3. кнопка `▶ Авторежим` запускает run так же, как прежняя `▶ Начать`;
4. Pause, Resume и Stop работают без изменений;
5. Send и Copy отображаются в едином блоке «Кнопки ChatGPT»;
6. без ручного выбора обеих кнопок сохраняется автоматическое распознавание;
7. включение manual mode не переводит страницу в режим выбора Copy;
8. ручные pickers работают только после явного нажатия соответствующей кнопки.

## Установка с сохранением identity и storage

1. Сделать резервную копию текущей unpacked-папки расширения.
2. Заменить её содержимое файлами из ZIP `2.0.0.17`.
3. Не создавать новую карточку расширения и не менять unpacked path.
4. Нажать **Reload** на существующей карточке в `chrome://extensions`.
5. Обновить вкладку ChatGPT.
6. Открыть popup и проверить version, binding и новую компоновку.

## Final status

```text
VERSION: 2.0.0.17
AUTOMATIC MODE TOGGLE: REMOVED
START BUTTON LABEL: ▶ АВТОРЕЖИМ
START ACTION: UNCHANGED
MANUAL MODE TOGGLE: PRESERVED
SEND/COPY PICKERS: ONE UNIFIED BLOCK
MANUAL BUTTON SELECTION: OPTIONAL
AUTOMATIC SEND/COPY FALLBACK: PRESERVED
FORCED COPY PICKER ON MANUAL ENABLE: REMOVED
SERVER/API/RUN/DELIVERY: UNCHANGED
PROTECTED FILES: BYTE-IDENTICAL
SOURCE TESTS: 91 PASSED / 0 FAILED
FRESH ZIP TESTS: 91 PASSED / 0 FAILED
ZIP INTEGRITY: PASS
REAL USER-CHROME ACCEPTANCE: PENDING
PUBLIC RELEASE: NO
```

---

# Append-only update — 2.0.0.18: снят лимит длины префикса отчёта

Дата обновления: 2026-07-27

## Причина

В версии 2.0.0.17 поле `reportPrefixText` содержало HTML-ограничение `maxlength="12000"`, а `service_worker.js` повторно отклонял префиксы длиннее 12 000 code points. При вставке большого управляющего prompt браузер молча сохранял только первые 12 000 символов, поэтому значительная часть префикса терялась до сохранения настроек и до доставки отчёта.

## Изменение

В версии 2.0.0.18 удалены оба искусственных ограничения расширения:

- из `popup.html` удалён `maxlength="12000"` у `textarea#reportPrefixText`;
- из `validateReportPrefixRecord()` удалена проверка `codePointLength(text) > 12000` и ошибка о превышении 12 000 символов;
- не добавлен новый лимит, автоматическое обрезание, `slice`, `substring` или замещающая length-ошибка;
- сохранены нормализация переносов строк, запрет пустого включённого префикса, интервал N, счётчики подтверждённых доставок, export/import и добавление префикса перед CLI-отчётом.

Формулировка «без ограничения» в этом релизе означает отсутствие character-count limit, установленного кодом Business Bridge 2. Физические пределы памяти браузера, `chrome.storage`, DOM-композера и размера сообщения ChatGPT являются внешними пределами и этим патчем не изменяются.

## Scope control

Не изменялись:

- Bridge HTTP/API protocol;
- создание и жизненный цикл run/job;
- CLI executor selection;
- delivery cadence и confirmed-delivery counters;
- ручные и автоматические Send/Copy resolvers;
- attachment policy и лимит файла контекста 8 МБ;
- protected composer delivery functions;
- сервер и его службы.

`content_script.js` изменён только номером версии. `popup.js` изменён только номером версии. В `service_worker.js` функциональное изменение ограничено удалением одной length guard строки и обновлением версии.

## Проверка большого префикса

Добавлен интеграционный тест `W18`:

```text
PREFIX CODE POINTS: 160360
STORAGE: BYTE-FOR-BYTE EQUAL
TRUNCATION: NONE
APPLY BEFORE CLI REPORT: PASS
```

Размер 160 360 выбран по фактическому проблемному префиксу. Тест передаёт его через `BB2_APPLY_NEXT_ITERATION_SETTINGS`, проверяет сохранённое значение целиком и затем проверяет результат `applyReportPrefix()`.

## Проверки

### Source tree

```text
JavaScript syntax: PASS
Tests: 95 passed / 0 failed
Explicit popup maxlength: ABSENT
Explicit worker character limit: ABSENT
```

### Fresh extracted ZIP

```text
ZIP integrity: PASS
Source/extracted file count: 23 / 23
Source/extracted byte identity: PASS
JavaScript syntax: PASS
Tests: 95 passed / 0 failed
```

## Артефакты и SHA-256

```text
business-bridge-chatgpt-extension-v2.0.0.18-unlimited-report-prefix.zip
SHA-256: fdff8b9d16ec40f9935563de135da98ce0c7fee06fbc75671840d7d70e53cfd9

BUSINESS_BRIDGE_2_2.0.0.18_REMOVE_REPORT_PREFIX_LENGTH_LIMIT.patch
SHA-256: 3676e48cd8111c9a227a2f5ee8899252d728251a269b4a8a5f195c82d60899b9

TEST_EVIDENCE_BUSINESS_BRIDGE_2_EXTENSION_2.0.0.18_REMOVE_REPORT_PREFIX_LENGTH_LIMIT.json
SHA-256: fba94674cab7130ec7d996ad36464ba098b110acd75c656b7f66672800e7514e

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.18_SOURCE_TESTS.tap
SHA-256: 49891e068ee2f72903656b55855c42b0b09681b773ff78a91751fdf18d6e5f62

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.18_FRESH_ZIP_TESTS.tap
SHA-256: b526ce9580e5ca7096a5bdd09fd7a932306998929e4841aabc1013dff1dc97e3

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.18_SYNTAX_CHECK.txt
SHA-256: 9163da5ad307ac04a865efed78957ae19f34967a288a432f26cb2a1779eef87d

BUSINESS_BRIDGE_2_EXTENSION_2.0.0.18_SOURCE_ZIP_BYTE_IDENTITY.json
SHA-256: 59c6e10f87bd6b8326f416dc4c73fb57a1f979713c29863d38d23e8448249940

popup.html
SHA-256: c1764575e8c6834e06fae04cc3bf119c7b32f441f2d3a985c431962136aa9a8c

service_worker.js
SHA-256: f6eaec7a3647460888991effe717c600479ad6af61406f8c6eb2d8f7676e34ed

popup.js
SHA-256: c4c8486e3a86b121748ef57474fadb7d4e6e087d0c9e6cd44c1ba1fe91eef492

content_script.js
SHA-256: 7df148f4d9b064beb869a1ab9e4912d6cfa5bb305751973825ddb5041a3cb2d5
```

## Live acceptance

После Reload существующей unpacked-карточки проверить:

1. popup и content показывают `2.0.0.18`;
2. в поле префикса вставляется полный большой текст, а не первые 12 000 символов;
3. после закрытия и повторного открытия popup текст сохранён полностью;
4. при следующей подходящей доставке полный префикс стоит перед полным CLI-отчётом;
5. ChatGPT принимает и отправляет итоговое большое сообщение;
6. при фактическом внешнем пределе ChatGPT/браузера фиксируется реальная ошибка этого слоя, а Business Bridge не режет префикс молча.

## Final status

```text
VERSION: 2.0.0.18
REPORT PREFIX HTML MAXLENGTH: REMOVED
REPORT PREFIX WORKER LENGTH GUARD: REMOVED
REPLACEMENT CHARACTER LIMIT: NONE
LARGE PREFIX TEST: 160360 CODE POINTS PASS
PREFIX STORAGE: BYTE-FOR-BYTE PASS
PREFIX APPLICATION: NO TRUNCATION
SERVER/API/RUN/DELIVERY CADENCE: UNCHANGED
SOURCE TESTS: 95 PASSED / 0 FAILED
FRESH ZIP TESTS: 95 PASSED / 0 FAILED
ZIP INTEGRITY: PASS
REAL USER-CHROME LARGE-PREFIX ACCEPTANCE: PENDING
PUBLIC RELEASE: NO
```


---

# VERSION ENTRY — 2.0.0.23 ProseMirror native editor delivery repair

Дата: **2026-08-13**  
Technical ID: `BB2-EXTENSION-2.0.0.23-PROSEMIRROR-NATIVE-EDITOR-20260813-01`  
Base source supplied by owner: `business-bridge-chatgpt-extension-v2.0.0.18-unlimited-report-prefix(20260813-024120).zip`  
Artifact: `business-bridge-chatgpt-extension-v2.0.0.23-prosemirror-native-editor.zip`  
ZIP SHA-256: `cfd62cbcfb05abc2dc646b6caa893b20f5bcd1abd53be8e3e811c7aff3f1dd24`

## Причина изменения

После обновления ChatGPT Business Bridge 2 мог визуально поместить terminal report в нижнее поле, но ChatGPT продолжал считать редактор пустым: голосовая кнопка не переходила в Send, а даже ручное нажатие пользователем не могло отправить визуально отображаемый текст.

Владелец предоставил:

- точные исходники неработающего BB2 `2.0.0.18`;
- рабочее контрольное расширение `ChatGPT Dialog Auto Sender 1.3.1`;
- текущий сохранённый HTML страницы ChatGPT;
- diagnostics проблемного run.

## Доказанная первопричина

Текущая сохранённая страница ChatGPT содержит:

```text
form[data-type="unified-composer"]
hidden textarea[name="prompt-textarea"]
div#prompt-textarea.ProseMirror[contenteditable="true"][role="textbox"]
empty-state voice button: aria-label="Запустить голосовой режим"
```

Старый BB2 для любого non-input `contenteditable` выполнял прямую DOM-мутацию:

```js
composer.textContent = text;
composer.dispatchEvent(new InputEvent("input", ...));
composer.dispatchEvent(new Event("change", ...));
```

Контролируемая Chromium 144 эмуляция была построена так, чтобы редакторская модель принимала browser-generated input, но не считала synthetic event после прямой DOM-мутации настоящим вводом. На **неизменённом исходном `content_script.js` 2.0.0.18** воспроизведён фактический симптом владельца:

```text
DOM text visible: YES
logical editor model: EMPTY
Voice remains: YES
Send appears: NO
delivery commit: NO
error: DELIVERY_SEND_TARGET_NOT_READY_BEFORE_COMMIT
```

Это подтверждает, что прежний `DELIVERY_COMPOSER_STABILIZED` доказывал только совпадение отображаемого DOM-текста, но не принятие текста управляемым редактором ChatGPT.

## Исправление

Функционально изменён только browser-side `content_script.js`.

Для текущего ProseMirror composer:

1. определяется текущий `unified-composer` и реальный `ProseMirror` textbox;
2. редактор получает focus;
3. его текущее содержимое выделяется через Selection/Range;
4. однострочный plain text вводится через browser-native `document.execCommand("insertText")`;
5. multiline plain text сначала безопасно HTML-экранируется через временный DOM `textContent`, newline преобразуется в `<br>`, затем используется browser-native `document.execCommand("insertHTML")`;
6. browser native command обязан вернуть `true`; при отсутствии API или отказе никакого direct-DOM fallback для ProseMirror нет;
7. ProseMirror читается через `innerText`, чтобы block/`<br>` line structure сохраняла исходные переносы строк;
8. ранее staged собственный delivery больше не считается автоматически пригодным для повторного использования: он restage-ится через настоящий editor path, что чинит phantom text после предыдущего fail;
9. matching start text restage-ится тем же путём;
10. `sendButtonCandidates()` больше не возвращает несовместимый raw `HTMLElement[]` manual branch; manual profile добавляет score к общей форме `{button, score}`, после чего остаётся live automatic discovery.

## Изменённые runtime-файлы

### Функционально

- `content_script.js`

### Только version synchronization

- `service_worker.js`
- `popup.js`
- `popup.html`
- `manifest.json`

### Test/package metadata

- `package.json` — version `2.0.0.23` и команды воспроизводимого Chromium test suite;
- regression tests обновлены под новую версию;
- добавлен `tests/v2023_prosemirror_native.test.mjs`;
- добавлен `tests/chromium_prosemirror_integration.py`;
- добавлены self-contained fixtures current composer и exact baseline `content_script.js 2.0.0.18`.

## Сохранённые инварианты

Не менялись:

- Bridge server;
- SSH tunnel;
- server token/identity;
- `/v2` API contract;
- HTTP transport;
- executor/CLI invocation;
- chain/job lifecycle;
- server delivery claim/commit/confirm state machine;
- report-prefix worker composition;
- attachment protocol;
- writing-block capture;
- commit-before-click boundary;
- post-click composer-empty confirmation;
- manual-mode core controls;
- profile/token routing.

Protected/runtime dependency hashes сохранены:

```text
shared/composer_send.js
  a6a2b25ea29637b76250a9f29fdcb177b52824a16a193b44ca5603df2494da79

shared/proven_writing_block_capture.js
  5b0eaac9619cb827d1e74c61f53e2755c084a1d4b60c64d23f5fd4a5354c3aef

shared/protocol.js
  7c70bdf236c052d85522d231f073794c11036d7448a9e98608484f2bec5e83fd

shared/transport.js
  08ce98ec6304200bcf5e6d6c50edde6f2a9fea6abad5aba07facdd375fe5aa9b

shared/model.js
  e28abfba38ea70121221aacb113bcbe18b0d679e99da430fd90ba9977ab5b865

shared/manual_controls.js
  ad955ed32881961de48aad8ce0e245ec23e5c0b059486a040ced546da852aac7
```

## Проверка всех затронутых зависимостей

Проверены не только новые helper-функции, а все consumer paths нового editor adapter:

- current ChatGPT DOM resolver;
- ProseMirror recognition;
- text reader;
- Selection/Range replacement;
- single-line native insert;
- multiline native insert;
- HTML escaping plain report text;
- Start path;
- Delivery path;
- existing phantom delivery restage;
- matching accepted text restage;
- different user draft fail-closed;
- Send picker staging;
- picker restore;
- Send profile save;
- valid manual Send profile;
- stale manual Send profile automatic fallback;
- `sendButtonCandidates` dependency shape;
- `BB2ComposerSend.waitForValidatedTarget`;
- `BB2ComposerSend.clickSynchronously`;
- delivery commit-before-click;
- start commit-before-click;
- composer-empty confirmation;
- attachment delivery;
- 160,360-code-point report prefix worker storage/application;
- full prefix + `\n\n` + CLI report path through content adapter;
- reports of 22,169, 160,360 and 500,000 characters;
- native edit API missing;
- native edit rejected;
- source/fresh-ZIP byte identity;
- protected dependency hashes;
- service-worker Bridge functions hashes.

## Tests

### Исходная предоставленная 2.0.0.18

После восстановления требуемого её собственным regression test reference каталога:

```text
95 / 95 Node tests PASS
```

Новый Chromium regression дополнительно доказал, что этот набор не ловил phantom editor-state failure.

### Source 2.0.0.23

```text
Node:                         118 / 118 PASS
Chromium ProseMirror checks:   21 / 21 PASS
Total explicit checks:        139 / 139 PASS
JavaScript syntax:            PASS
manifest/package JSON:        PASS
```

### Fresh extraction final ZIP

```text
Node:                         118 / 118 PASS
Chromium ProseMirror checks:   21 / 21 PASS
Total explicit checks:        139 / 139 PASS
JavaScript syntax:            PASS
manifest/package JSON:        PASS
ZIP integrity:                PASS
source/fresh file list:       IDENTICAL
source/fresh file bytes:      IDENTICAL
```

## Chromium editor evidence

Chromium runtime used by the controlled test:

```text
Chrome/144.0.0.0 headless runtime
```

The old direct DOM path generates only synthetic/untrusted `input` in the failure model and leaves logical editor state empty.

The patched native editor path generates browser-trusted input, drives the model from Voice-state to Send-state, executes one validated click, and the composer becomes empty.

Exact large-text checks:

```text
22,169 chars: PASS, exact
160,360 chars: PASS, exact
500,000 chars: PASS, exact
160,360-char prefix + \n\n + CLI REPORT: PASS, exact
```

## Fail-closed checks

If the native browser edit API is absent:

```text
COMPOSER_NATIVE_EDIT_UNAVAILABLE
commit = 0
send = 0
```

If the browser native command rejects the operation:

```text
COMPOSER_NATIVE_EDIT_REJECTED
commit = 0
send = 0
```

If a different user draft exists:

```text
user draft preserved
commit = 0
send = 0
```

## Migration

Storage schema не менялась.

Server migration не требуется.

Existing profiles/tokens/bindings/settings сохраняются при in-place замене файлов той же unpacked-карточки расширения.

## Rollback

Rollback требует только возврата файлов предыдущего extension build в прежний unpacked path и Reload карточки расширения.

Server rollback не нужен, потому что серверная часть не изменена.

Не следует повторять необратимый Send для delivery, если существует вероятность, что конкретная delivery уже была committed старой версией; стандартный server-owned reconciliation invariant остаётся действующим.

## Live acceptance

Контролируемый Chromium runtime и exact current-DOM fixture прошли полностью. Реальная отправка в authenticated user ChatGPT остаётся отдельным live acceptance gate, потому что текущая среда не имеет доступа к пользовательскому установленному Chrome profile.

При live acceptance требуется подтвердить один сценарий:

```text
terminal report arrives
-> text is inserted
-> Voice control changes to Send arrow
-> one Send click
-> composer empties
-> one user turn appears
-> server delivery confirm proceeds normally
```

## Артефакты

```text
business-bridge-chatgpt-extension-v2.0.0.23-prosemirror-native-editor.zip
SHA-256: cfd62cbcfb05abc2dc646b6caa893b20f5bcd1abd53be8e3e811c7aff3f1dd24

business-bridge-2-v2.0.0.18-to-v2.0.0.23-prosemirror-native-editor.patch
SHA-256: 5a9acc3cb5b6e112d1b03104865caa7699fe143e71edc7d6f1f3e1f8f3bba5c5

BB2_2.0.0.23_PROSEMIRROR_NATIVE_EDITOR_TEST_REPORT.md
SHA-256: c5212379a66e34e38e5ce30b5a55d14766c8d80d33a1f08e12e3bb457da9bf27
```

## Final status

```text
VERSION: 2.0.0.23
ROOT CAUSE REPRODUCTION: PASS
PROSEMIRROR NATIVE EDIT: PASS
TRUSTED BROWSER INPUT: PASS
VOICE -> SEND EMULATION: PASS
SEND -> EMPTY CONFIRMATION: PASS
START DEPENDENCIES: PASS
DELIVERY DEPENDENCIES: PASS
PICKER DEPENDENCIES: PASS
MANUAL/AUTO SEND RESOLUTION: PASS
PHANTOM RETRY REPAIR: PASS
USER DRAFT FAIL-CLOSED: PASS
ATTACHMENT PATH: PASS
LARGE TEXT EXACTNESS: PASS
NATIVE EDIT FAILURE SAFETY: PASS
SERVER/API/CLI CHANGES: NONE
SOURCE: 139 / 139 PASS
FRESH ZIP: 139 / 139 PASS
ZIP INTEGRITY: PASS
SOURCE/FRESH BYTE IDENTITY: PASS
LIVE AUTHENTICATED CHATGPT SEND: PENDING OWNER INSTALL/CONTROL RUN
```
