# SERP raw evidence — S01-05 collectN not due

Дата: 2026-09-16.
SERP pass: `S01`.
Attempt: `S01-05`.
Query: `ии агенты для маркетплейсов`.
Job: `octoport-serp-s01-20260916`.

## Exact received bridge envelope

Ниже сохранён полный полученный `SEARCH_ASYNC_BATCH_RESULT_V1` без сокращений.

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-s01-20260916","ok":true,"request_executed":false,"provider_calls":0,"processed":1,"normalized":0,"bounded_stop":false,"last":{"outcome":null,"code":"NO_DUE_OPERATIONS","index":null,"operation_id":null},"progress":{"job_id":"octoport-serp-s01-20260916","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":1,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":0,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":0,"unresolved":1,"all_successful":false,"busy":false,"revision":2}}
```

## Preservation rule

Этот файл является evidence-копией полного ответа bridge. Этот `collectN` не выполнил provider request: `request_executed:false`, `provider_calls:0`. Код `NO_DUE_OPERATIONS` означает локальный due-time guard; существующая операция остаётся в `WAITING`.
