# Wordstat Batch 01 — broad discovery

Статус: **IN_PROGRESS — 2/15 SUCCESS, 0 FAIL**.
Дата подготовки: 2026-09-16.
Provider: Yandex Wordstat Bridge reference `1.1.5`.
Method: `getTop`.
Region: РФ `225`.
Devices: `DEVICE_ALL`.
`numPhrases`: `2000`.

## Жёсткое правило сохранения результата

После каждого provider response действует порядок:

1. немедленно сохранить полный provider result и provenance в `docs/seo/wordstat/raw/`;
2. убедиться, что GitHub write завершился успешно;
3. обновить progress/worklog;
4. только после этого анализировать результат и выдавать следующий Wordstat call.

Нельзя держать единственную копию результата только в диалоге: связь может оборваться. Следующая provider-команда не выдаётся, пока предыдущий ответ не записан в репозиторий.

## Текущий progress

| Call | Seed | Status | Raw evidence |
|---|---|---|---|
| B01-01 | `ии для маркетплейсов` | SUCCESS | `raw/B01_01_2026-09-16.md` |
| B01-02 | `нейросеть для маркетплейсов` | SUCCESS | `raw/B01_02_2026-09-16.md` |
| B01-03 | `ии помощник селлера` | NEXT | — |

Accumulated estimated provider cost after recorded success calls: `0.04 ₽`.

## Цель

Первый batch намеренно ограничен 15 broad seeds. Его задача — открыть реальный vocabulary рынка до механического выполнения всех гипотез из `SEED_UNIVERSE.md`.

После каждого результата сначала сохраняется raw envelope, затем анализируется, открыл ли seed новую релевантную лексическую семью. Второй batch строится по фактическим находкам.

## Команды

### B01-01 — A01

`ии для маркетплейсов`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии для маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-02 — A02

`нейросеть для маркетплейсов`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"нейросеть для маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-03 — A06

`ии помощник селлера`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии помощник селлера","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-04 — A14

`аналитика маркетплейсов с ии`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"аналитика маркетплейсов с ии","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-05 — B01

`ии для ozon`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии для ozon","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-06 — B02

`ии для озон`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии для озон","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-07 — C01

`ии для wildberries`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии для wildberries","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-08 — C02

`ии для вайлдберриз`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии для вайлдберриз","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-09 — D01

`chatgpt для маркетплейсов`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"chatgpt для маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-10 — D06

`chatgpt для ozon`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"chatgpt для ozon","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-11 — D10

`chatgpt для wildberries`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"chatgpt для wildberries","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-12 — F02

`ии анализ продаж маркетплейсов`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"ии анализ продаж маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-13 — H09

`подключить ии к маркетплейсу`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"подключить ии к маркетплейсу","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-14 — J01

`сервис аналитики маркетплейсов`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"сервис аналитики маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

### B01-15 — I01

`как использовать ии для маркетплейсов`

```text
WORDSTAT_API_V1 {"method":"getTop","phrase":"как использовать ии для маркетплейсов","numPhrases":2000,"regions":["225"],"devices":["DEVICE_ALL"]}
```

## Raw capture contract

Для каждого call создаётся отдельный raw artifact с минимум следующими полями:

```text
batch_id
call_id
seed_id
seed_phrase
requested_at
bridge_version
method
regions
devices
numPhrases
request_id
http_status
elapsed_ms
raw_result
```

Если provider вернул ошибку, она тоже сохраняется как evidence; call не удаляется и не заменяется бесследно повторным.

## Execution rule

- Никакого скрытого retry.
- При auth/quota/provider error зафиксировать конкретный call как failed/blocked и остановить зависимую интерпретацию.
- Успешный result не редактировать перед сохранением.
- Нормализованные строки создаются отдельно и ссылаются на `call_id`.
- Не запускать dynamics/regions автоматически вслед за каждым `getTop`.

## Acceptance Batch 01

Batch можно считать выполненным, когда:

1. по всем 15 calls есть raw success либо явно зафиксированный provider failure;
2. каждый success имеет provenance;
3. построен первый normalized union без потери raw phrase;
4. отмечены новые vocabulary families;
5. сформирован обоснованный Batch 02, а не просто следующие 15 строк исходного списка.
