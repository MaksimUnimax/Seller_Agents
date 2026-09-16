# M2R-A01 raw admission result — SERVICE_NOT_ACTIVE

Date: 2026-09-16.
Query: `аналитика маркетплейсов`.
Stage: `M2R-A01 / Wordstat.GetTop`.
Status: `LOCAL_ADMISSION_REJECTED / PROVIDER_NOT_CALLED`.

## Exact received bridge response

```text
YMB_ERROR_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "status": "ERROR",
  "service": "search",
  "channel": "manual",
  "stage": "MANUAL_ADMISSION",
  "code": "SERVICE_NOT_ACTIVE",
  "message": "Активный сервис search; команда WORDSTAT_API_V1 относится к wordstat.",
  "recoverable": true,
  "request_executed": false,
  "automatic_retry": false,
  "run_id": null,
  "operation": null,
  "autorun_continues": false,
  "timestamp": "2026-09-16T13:28:15.018Z",
  "operation_id": null
}
```

## Preservation note

This is not a Wordstat provider response and not semantic evidence about demand. The bridge rejected the command locally because active manual service was `search`, while the command belonged to `wordstat`. `request_executed:false` proves that no provider request was made. No zero/negative semantic interpretation is allowed.
