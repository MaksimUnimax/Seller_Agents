# M2R-A02 raw Wordstat result — `аналитика продаж на маркетплейсах`

Date: 2026-09-16.
Query: `аналитика продаж на маркетплейсах`.
Stage: `M2R-A02 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-da2bca51-7dfe-401e-9857-1ecdb2695dcb",
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
    "phrase": "аналитика продаж на маркетплейсах",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 11456,
  "result": {
    "results": [
      {"phrase":"аналитик продаж на маркетплейсах","count":"138"},
      {"phrase":"аналитика продаж на маркетплейсах","count":"138"},
      {"phrase":"сервис аналитика продаж на маркетплейсах","count":"39"},
      {"phrase":"аналитика продаж на маркетплейсах бесплатно","count":"20"},
      {"phrase":"сервис для аналитики продаж на маркетплейсах","count":"19"},
      {"phrase":"аналитика товаров для продажи на маркетплейсах","count":"13"},
      {"phrase":"аналитика продаж на маркетплейсах бесплатно онлайн","count":"7"}
    ],
    "associations": [
      {"phrase":"купи продай","count":"359982"},
      {"phrase":"лзт маркет","count":"4535"},
      {"phrase":"маркет гуру","count":"2771"},
      {"phrase":"тф2 маркет","count":"1322"},
      {"phrase":"рбх маркет","count":"1325"},
      {"phrase":"izt market","count":"987"},
      {"phrase":"продать аккаунт","count":"44656"},
      {"phrase":"изт маркет","count":"901"},
      {"phrase":"купи продай бесплатные объявления","count":"4106"},
      {"phrase":"эко маркет","count":"2263"},
      {"phrase":"педант маркет","count":"1066"},
      {"phrase":"купить скины дота 2 маркет","count":"598"},
      {"phrase":"лит маркет","count":"2087"},
      {"phrase":"кейс маркет","count":"1345"},
      {"phrase":"рбкс маркет","count":"611"},
      {"phrase":"sold shop","count":"2298"}
    ],
    "totalCount":"138"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A02. Analytical classification is stored separately and must not modify this raw evidence.
