# M2R-A16 raw Wordstat result — `как работать в кабинете wildberries`

Date: 2026-09-17.
Query: `как работать в кабинете wildberries`.
Stage: `M2R-A16 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS_TOTALCOUNT_ONLY`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-88338075-af6a-498f-a49d-edea2310dc11",
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
    "phrase": "как работать в кабинете wildberries",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1923,
  "result": {
    "totalCount":"6"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This is a successful provider response with `totalCount=6` and no `results[]` / `associations[]` arrays. It must not be rewritten as `result:{}` or numeric zero. Analytical interpretation is stored separately.
