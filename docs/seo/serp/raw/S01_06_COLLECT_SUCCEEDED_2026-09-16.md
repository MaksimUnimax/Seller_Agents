# SERP raw evidence — S01-06 collectN succeeded

Дата: 2026-09-16.
SERP pass: `S01`.
Attempt: `S01-06`.
Query: `ии агенты для маркетплейсов`.
Job: `octoport-serp-s01-20260916`.

## Exact received bridge envelope

Ниже сохранён полный полученный `SEARCH_ASYNC_BATCH_RESULT_V1` без сокращений.

```text
SEARCH_ASYNC_BATCH_RESULT_V1 {"action":"collectN","job_id":"octoport-serp-s01-20260916","ok":true,"request_executed":true,"provider_calls":1,"processed":1,"normalized":1,"bounded_stop":false,"last":{"outcome":"received","code":null,"index":0,"operation_id":"sprjotiech5gn23a4tq3"},"progress":{"job_id":"octoport-serp-s01-20260916","control":"RUNNING","total":1,"counts":{"PENDING":0,"SUBMITTING":0,"WAITING":0,"COLLECTING":0,"RESULT_SAVED":0,"SUCCEEDED":1,"PARSE_FAILED":0,"FAILED":0,"UNKNOWN":0,"CANCELLED":0},"requests_started":1,"operations_accepted":1,"polls_started":1,"unresolved":0,"all_successful":true,"busy":false,"revision":5}}
```

## Preservation rule

Этот файл является evidence-копией полного ответа bridge. Этот `collectN` выполнил один provider request и успешно получил/нормализовал результат операции `sprjotiech5gn23a4tq3`: `SUCCEEDED:1`, `normalized:1`, `unresolved:0`, `all_successful:true`.
