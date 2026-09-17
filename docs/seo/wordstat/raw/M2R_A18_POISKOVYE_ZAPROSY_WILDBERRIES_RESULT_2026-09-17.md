# M2R-A18 raw Wordstat result — `поисковые запросы wildberries`

Date: 2026-09-17.
Query: `поисковые запросы wildberries`.
Stage: `M2R-A18 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-fd7e394b-9ad7-4cd5-90a7-96291cd76b53",
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
    "phrase": "поисковые запросы wildberries",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1862,
  "result": {
    "results": [
      {"phrase":"wildberries поисковый запрос","count":"73"}
    ],
    "associations": [
      {"phrase":"google поиск","count":"37154"},
      {"phrase":"позови меня с собой","count":"65493"},
      {"phrase":"позови меня с собой текст","count":"9185"},
      {"phrase":"мой поиск","count":"23079"},
      {"phrase":"позови меня родная","count":"12730"},
      {"phrase":"агрегатор это","count":"7716"},
      {"phrase":"я иду искать актеры","count":"16711"},
      {"phrase":"я иду тебя искать актеры","count":"7078"},
      {"phrase":"подбор ру знакомства","count":"5177"},
      {"phrase":"позови меня","count":"245314"},
      {"phrase":"забери меня с собой текст","count":"2090"},
      {"phrase":"что теперь будет с вайлдберриз","count":"370"},
      {"phrase":"когда появился вайлдберриз","count":"1592"},
      {"phrase":"поиск по странице","count":"9114"},
      {"phrase":"вайлдберриз войти","count":"23313"},
      {"phrase":"позови меня с собой palina","count":"981"},
      {"phrase":"мои заказы на валберис","count":"1246"},
      {"phrase":"валберис войти","count":"10821"},
      {"phrase":"кузьмин когда меня ты позовешь","count":"3135"}
    ],
    "totalCount":"73"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A18. Analytical classification is stored separately and must not modify this raw evidence.
