# M2R-A11 raw Wordstat result — `аналитика рекламы wildberries`

Date: 2026-09-17.
Query: `аналитика рекламы wildberries`.
Stage: `M2R-A11 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS_TOTALCOUNT_ONLY`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-f2af56f6-97d2-4a60-9a14-be9d9842bf0b",
  "run_id": null,
  "job_id": null,
  "status": "OK",
  "reason": null,
  "cost_estimate": {
    "estimated_rub": 0.02,
    "tariff_checked_at": "2026-08-12",
    "tariff_source": "https://aistudio.yandex.ru/docs/ru/search-api/pricing.html"
  },
  "policy": {
    "channel": "manual",
    "active_service": "wordstat"
  },
  "command": {
    "method": "getTop",
    "phrase": "аналитика рекламы wildberries",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1303,
  "result": {
    "totalCount":"15"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This is a successful provider response with `totalCount=15` and no `results[]` / `associations[]` arrays. It must not be rewritten as `result:{}` or numeric zero. Analytical interpretation is stored separately.
