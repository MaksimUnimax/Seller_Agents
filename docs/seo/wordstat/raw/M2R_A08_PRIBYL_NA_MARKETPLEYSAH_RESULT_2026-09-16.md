# M2R-A08 raw Wordstat result — `прибыль на маркетплейсах`

Date: 2026-09-16.
Query: `прибыль на маркетплейсах`.
Stage: `M2R-A08 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-9dc9f798-a26e-4d1d-aae4-9015ab6678f5",
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
    "phrase": "прибыль на маркетплейсах",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1687,
  "result": {
    "results": [
      {"phrase":"прибыль на маркетплейсах","count":"389"},
      {"phrase":"налог на прибыль маркетплейс","count":"128"},
      {"phrase":"чистая прибыль на маркетплейсе","count":"56"},
      {"phrase":"расчет прибыли на маркетплейсе","count":"27"},
      {"phrase":"прибыль с товара на маркетплейсе","count":"24"},
      {"phrase":"прибыль от продаж на маркетплейсах","count":"22"},
      {"phrase":"учет на маркетплейсах прибыль","count":"15"}
    ],
    "associations": [
      {"phrase":"заказ рф электронная торговая площадка","count":"4767"},
      {"phrase":"plati market ru","count":"2101"},
      {"phrase":"тф2 маркет","count":"1322"},
      {"phrase":"tf2 market","count":"940"},
      {"phrase":"marketplace","count":"19208"},
      {"phrase":"ртс маркет электронная торговая площадка","count":"1098"},
      {"phrase":"маркет плейсы это","count":"612"},
      {"phrase":"sale zakazrf ru электронная торговая площадка","count":"411"},
      {"phrase":"бьюти маркет","count":"1550"},
      {"phrase":"маркет для бизнеса","count":"6087"},
      {"phrase":"block market","count":"497"},
      {"phrase":"бабл ти купить","count":"7765"},
      {"phrase":"бизнес маркет","count":"11106"},
      {"phrase":"как торговать на озон","count":"1951"},
      {"phrase":"как начать торговать на озон","count":"554"},
      {"phrase":"беее про маркет","count":"127"},
      {"phrase":"атоваквон цена бизнес маркет","count":"124"},
      {"phrase":"купить карьер business market","count":"80"}
    ],
    "totalCount":"389"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A08. Analytical classification is stored separately and must not modify this raw evidence.
