# M2R-A06 raw Wordstat result — `финансовая аналитика маркетплейсов`

Date: 2026-09-16.
Query: `финансовая аналитика маркетплейсов`.
Stage: `M2R-A06 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-9167035a-3f9b-4e7d-b668-4769c03c1e89",
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
    "phrase": "финансовая аналитика маркетплейсов",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1717,
  "result": {
    "results": [
      {"phrase":"финансовый аналитик маркетплейсов","count":"64"},
      {"phrase":"финансовая аналитика для маркетплейсов","count":"8"}
    ],
    "associations": [
      {"phrase":"ебп финансы","count":"10095"},
      {"phrase":"ацк финансы","count":"16564"},
      {"phrase":"oro исследование рынка зачем звонят","count":"2295"},
      {"phrase":"аналит нет","count":"6415"},
      {"phrase":"ооо пко м б а финансы","count":"1767"},
      {"phrase":"ао тбанк финансы зачем звонят","count":"744"},
      {"phrase":"анализируй это фильм","count":"6574"},
      {"phrase":"ооо пко финэква","count":"1362"},
      {"phrase":"финист финансы что это","count":"941"},
      {"phrase":"про финансы ру","count":"710"},
      {"phrase":"факторный анализ","count":"9002"},
      {"phrase":"oro исследование рынка что это","count":"940"},
      {"phrase":"ооо пко фскп финансы","count":"543"},
      {"phrase":"ревмопробы какие анализы входят","count":"414"},
      {"phrase":"тбанк финансы зачем звонят","count":"1237"},
      {"phrase":"каулограмма это за анализ","count":"402"},
      {"phrase":"пко мба финансы что это","count":"1013"},
      {"phrase":"бьюти маркет","count":"1550"},
      {"phrase":"коагулограмма что входит в этот анализ","count":"210"},
      {"phrase":"финэкспертиза","count":"868"}
    ],
    "totalCount":"64"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A06. Analytical classification is stored separately and must not modify this raw evidence.
