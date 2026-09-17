# M2R-A17 raw Wordstat result — `как заполнить карточку товара wildberries`

Date: 2026-09-17.
Query: `как заполнить карточку товара wildberries`.
Stage: `M2R-A17 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS_TOTALCOUNT_ONLY`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-c9e11ced-47e2-43c8-ae95-7cd1ed1af64b",
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
    "phrase": "как заполнить карточку товара wildberries",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1289,
  "result": {
    "totalCount":"34"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This is a successful provider response with `totalCount=34` and no `results[]` / `associations[]` arrays. It must not be rewritten as `result:{}` or numeric zero. Analytical interpretation is stored separately.
