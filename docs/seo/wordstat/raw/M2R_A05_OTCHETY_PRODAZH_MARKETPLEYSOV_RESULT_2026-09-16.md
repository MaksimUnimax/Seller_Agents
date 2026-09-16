# M2R-A05 raw Wordstat result — `отчеты продаж маркетплейсов`

Date: 2026-09-16.
Query: `отчеты продаж маркетплейсов`.
Stage: `M2R-A05 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-0b1a7847-d1d7-4541-9bc8-11a79c51c2e3",
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
    "phrase": "отчеты продаж маркетплейсов",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1292,
  "result": {
    "results": [
      {"phrase":"отчеты продаж маркетплейсов","count":"448"},
      {"phrase":"отчет о продажах маркетплейс в 1с","count":"40"},
      {"phrase":"отчет о продажах маркетплейс проводки","count":"11"}
    ],
    "associations": [
      {"phrase":"ртс маркет","count":"17912"},
      {"phrase":"плати маркет ру","count":"3010"},
      {"phrase":"как написать продавцу на вб","count":"4366"},
      {"phrase":"тф2 маркет","count":"1322"},
      {"phrase":"яндекс маркет мои заказы","count":"7124"},
      {"phrase":"рбх маркет","count":"1325"},
      {"phrase":"эвотор маркет","count":"2339"},
      {"phrase":"фаворит маркет торговая площадка","count":"761"},
      {"phrase":"продать аккаунт","count":"44656"},
      {"phrase":"купить скины дота 2 маркет","count":"598"},
      {"phrase":"lolzteam маркет","count":"378"},
      {"phrase":"кейс маркет","count":"1345"},
      {"phrase":"как продавать на озон","count":"14600"},
      {"phrase":"купить на яндекс маркете","count":"51771"},
      {"phrase":"ртс маркет электронная торговая площадка","count":"1098"},
      {"phrase":"qrz ru куплю продам обменяю","count":"278"},
      {"phrase":"маркет плейсы это","count":"612"},
      {"phrase":"plati маркет","count":"280"},
      {"phrase":"купи продай ру официальный сайт","count":"189"}
    ],
    "totalCount":"448"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A05. Analytical classification is stored separately and must not modify this raw evidence.
