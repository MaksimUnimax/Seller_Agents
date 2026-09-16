# SEO SERP verification — execution progress

Дата: 2026-09-16.
Branch: `seo/wordstat-batch-01-2026-09-16`.
Status: `BLOCKED_LOCAL_SERVICE_SELECTION`.

## Evidence rule

For every bridge/provider response:

1. save the complete received envelope under `serp/raw/`;
2. verify the GitHub write by reading it back;
3. save analysis separately under `serp/analysis/`;
4. update this progress file;
5. only then issue the next executable bridge command.

Local admission errors with `request_executed: false` do not count as provider calls and must be preserved separately from actual SERP evidence.

## Isolation

- write only under `docs/seo/**`;
- do not touch server/runtime/site implementation;
- do not merge into moving `main` without a fresh overlap check.

## Priority queue

1. `ии агенты для маркетплейсов`;
2. `ии агент для озон`;
3. `ии агент для wildberries`;
4. `какой ии для маркетплейсов`;
5. `сервис аналитика продаж на маркетплейсах`;
6. `сервис внутренней аналитики маркетплейсов`;
7. `ии для работы с маркетплейсами`.

Optional control after priorities: `нейросеть помощь для маркетплейсов`.

## Attempts

| Attempt | Query | Stage | Status | Provider request executed | Raw | Analysis |
|---|---|---|---|---|---|---|
| S01-01 | ии агенты для маркетплейсов | `MANUAL_ADMISSION` | `SERVICE_NOT_ACTIVE` | `false` | `raw/S01_01_ADMISSION_ERROR_2026-09-16.md` | `analysis/S01_01_ADMISSION_ERROR_2026-09-16.md` |

## Totals

- actual Search provider calls: `0`;
- completed priority SERP queries: `0/7`;
- local admission failures: `1`;
- provider failures: `0`;
- Search provider cost incurred in this pass: `0 ₽`;
- current query: `ии агенты для маркетплейсов`;
- current blocker: active extension service is `wordstat`;
- required action: manually switch active service to `Search`, then repeat the same deferred Search `start` command;
- next provider action after successful `start`: none until the returned start envelope is persisted and verified; only then may `submitN` be issued.
