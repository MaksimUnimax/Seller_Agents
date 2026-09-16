# SERP raw evidence — S01-01 admission error

Дата: 2026-09-16.
SERP pass: `S01`.
Attempt: `S01-01`.
Intended query: `ии агенты для маркетплейсов`.

## Exact received bridge envelope

Ниже сохранён полный полученный `YMB_ERROR_V1`. Ошибка произошла до provider execution на стадии `MANUAL_ADMISSION`; никакой Search provider request выполнен не был.

```text
YMB_ERROR_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.8",
  "status": "ERROR",
  "service": "wordstat",
  "channel": "manual",
  "stage": "MANUAL_ADMISSION",
  "code": "SERVICE_NOT_ACTIVE",
  "message": "Deferred Search доступен только при активном сервисе Search.",
  "recoverable": true,
  "request_executed": false,
  "automatic_retry": false,
  "run_id": null,
  "operation": null,
  "autorun_continues": false,
  "timestamp": "2026-09-16T09:28:34.384Z",
  "operation_id": null
}
```

## Preservation rule

Этот файл является evidence-копией полного ответа bridge. Он не считается Search-result evidence и не расходует provider request budget, потому что `request_executed: false`.
