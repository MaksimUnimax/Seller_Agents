# M2R-A10 raw Wordstat result — `аналитика рекламы маркетплейсов`

Date: 2026-09-17.
Query: `аналитика рекламы маркетплейсов`.
Stage: `M2R-A10 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-e021d896-a988-47b8-940a-a3f2f48b3421",
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
    "phrase": "аналитика рекламы маркетплейсов",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1622,
  "result": {
    "results": [
      {"phrase":"реклама маркетплейса аналитика","count":"33"}
    ],
    "associations": [
      {"phrase":"лзт маркет","count":"4554"},
      {"phrase":"маркетолог это","count":"13167"},
      {"phrase":"тф2 маркет","count":"1313"},
      {"phrase":"рбх маркет","count":"1310"},
      {"phrase":"izt market","count":"992"},
      {"phrase":"tf2 market","count":"939"},
      {"phrase":"арз маркет","count":"2562"},
      {"phrase":"лит маркет","count":"2051"},
      {"phrase":"кейс маркет","count":"1331"},
      {"phrase":"ямз маркет","count":"988"},
      {"phrase":"что нужно сдавать на маркетолога","count":"1747"},
      {"phrase":"что сдавать на маркетолога","count":"4160"},
      {"phrase":"cta в маркетинге это","count":"409"},
      {"phrase":"бьюти маркет","count":"1540"},
      {"phrase":"пк маркетинг ру","count":"219"}
    ],
    "totalCount":"33"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A10. Analytical classification is stored separately and must not modify this raw evidence.
