# SERP raw evidence — S03-03 collect admission blocked

Дата: 2026-09-16.
Query: `ии агент для wildberries`.
Job: `octoport-serp-s03-20260916`.
Attempted stage: `collectN`.

## Exact received bridge envelope

```text
YMB_ERROR_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "status": "ERROR",
  "service": "search",
  "channel": "manual",
  "stage": "MANUAL_ADMISSION",
  "code": "MANUAL_OPERATION_ACTIVE",
  "message": "MANUAL_OPERATION_ACTIVE",
  "recoverable": true,
  "request_executed": false,
  "automatic_retry": false,
  "run_id": null,
  "operation": null,
  "autorun_continues": false,
  "timestamp": "2026-09-16T11:57:11.401Z",
  "operation_id": null
}
```

## Preservation note

This is a local/manual Bridge admission error. `request_executed:false` proves that this collect attempt did not execute a Yandex Search provider request. It is not a zero-result observation, not a provider failure, and not permission for blind resubmit/retry. The runtime reports Bridge version `0.1.9`, which differs from the `0.1.8` capability authority used when S03 was prepared, so current Bridge behavior must be reconciled before another lifecycle action is released.
