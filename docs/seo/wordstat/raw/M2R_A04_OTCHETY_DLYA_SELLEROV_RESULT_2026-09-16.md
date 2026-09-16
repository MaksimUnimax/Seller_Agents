# M2R-A04 raw Wordstat result — `отчеты для селлеров`

Date: 2026-09-16.
Query: `отчеты для селлеров`.
Stage: `M2R-A04 / Wordstat.GetTop`.
Status: `WORDSTAT_OBSERVED / SUCCESS`.

## Exact received provider envelope

```text
WORDSTAT_RESULT_V1 {
  "bridge": "yandex-marketing-bridge",
  "version": "0.1.9",
  "service": "wordstat",
  "operation": "getTop",
  "request_id": "wordstat-493e934a-82e0-46a4-b8e2-ca7513aec581",
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
    "phrase": "отчеты для селлеров",
    "numPhrases": 2000,
    "regions": ["225"],
    "devices": ["DEVICE_ALL"]
  },
  "http_status": 200,
  "elapsed_ms": 1637,
  "result": {
    "results": [
      {"phrase":"отчет для селлеров","count":"421"},
      {"phrase":"озон селлер отчет для налоговой","count":"15"}
    ],
    "associations": [
      {"phrase":"подача декларации соут","count":"1190"},
      {"phrase":"подать декларацию соут","count":"2113"},
      {"phrase":"сзв тд ефс 1 кто сдает","count":"131"},
      {"phrase":"парус отчетность","count":"1894"},
      {"phrase":"отчетность в статистику по инн","count":"1431"},
      {"phrase":"перс сведения сроки сдачи отчетности 2026","count":"99"},
      {"phrase":"такском отчетность","count":"742"},
      {"phrase":"сбис сдача отчетности вход в личный кабинет","count":"71"},
      {"phrase":"место подачи декларации по ндс","count":"477"},
      {"phrase":"фтс сроки сдачи статистической отчетности 2026","count":"51"},
      {"phrase":"статистика отчетность","count":"5624"},
      {"phrase":"отчетность нко","count":"3094"},
      {"phrase":"saby отчетность","count":"529"},
      {"phrase":"сертификаты сфр для 1с отчетности","count":"160"},
      {"phrase":"статистика отчетность по инн","count":"2243"},
      {"phrase":"сдача отчетности фнс","count":"4848"},
      {"phrase":"сведения о бенефициарном владельце что это","count":"459"},
      {"phrase":"отчетность на аусн","count":"3227"},
      {"phrase":"нефинансовая отчетность новости","count":"57"}
    ],
    "totalCount":"421"
  },
  "request_executed": true,
  "automatic_retry": false
}
```

## Preservation note

This file preserves the complete response supplied by the user for M2R-A04. Analytical classification is stored separately and must not modify this raw evidence.
