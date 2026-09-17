# R09 revision-5 export persistence manifest

Date: 2026-09-17.  
Job: `octoport-serp-r09-20260917`.  
Query: `поисковые запросы wildberries для продавца`.  
Revision: `5`.  
Source filename: `search-octoport-serp-r09-20260917-r5-0-0.json`.

## Exact source identity

```text
SOURCE_BYTES = 88032
SOURCE_SHA256 = 81fddff80beb249939fba76d87334b1926a4978d846b555ba32bbd277d221e5c
GZIP_METHOD = gzip / compresslevel 9 / mtime 0
GZIP_BYTES = 23412
GZIP_SHA256 = bf1d3cd2971d598d845729492b7aba9291e1f2754ec5c0d4bf451d1c0dc41a41
BASE64_CHARS = 31216
CHUNK_SIZE_CHARS = 4000
CHUNK_COUNT = 8
CHUNK_LENGTHS = [4000, 4000, 4000, 4000, 4000, 4000, 4000, 3216]
```

## Repository representation

The exact export bytes are stored losslessly as deterministic gzip -> base64 text chunks:

- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c01` — blob `1f4be9daeb794ef1c04e79a75509b5a26cd796a8`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c02` — blob `889f4c34c4d78325ab00c7c308d096ec65fcdd0b`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c03` — blob `509ca529843c9a557f4bb5d65c1a2848fde16ea5`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c04` — blob `1ba5055ddb59f9847fe08f2c47938c582ee6634c`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c05` — blob `63ed9f92dd20995c48d7640900c41b3685affeb4`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c06` — blob `3461dde0cb9b1551ebb92a9fd667945297e350cd`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c07` — blob `aa3ecb75d4f42f073617c613146b432102343fc1`
- `search-octoport-serp-r09-20260917-r5-0-0.json.gz.b64.c08` — blob `53cf3074bbe94a55098e0df9b0d2e18bdc4b85b1`

Reconstruction:

```text
concatenate c01..c08
-> base64 decode
-> gzip decompress
-> exact original JSON bytes
-> SHA256 must equal 81fddff80beb249939fba76d87334b1926a4978d846b555ba32bbd277d221e5c
```

Local reconstruction verification before persistence:

```text
RECONSTRUCTED_SOURCE_SHA256 = 81fddff80beb249939fba76d87334b1926a4978d846b555ba32bbd277d221e5c
RECONSTRUCTED_BYTES_EQUAL_SOURCE = true
```

## Export contract QA

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r09-20260917
revision = 5
total_items = 1
page.item_count = 1
page.result_row_count = 20
page.items_with_raw = 1
page.items_with_normalized = 1
page.states = {'SUCCEEDED': 1}
page.next_after = 0
page.has_more = false
page.all_job_items_in_this_file = true
normalized.result_count = 20
validation.document_count = 20
validation.empty_proven = false
validation.xml_error_code = None
validation.usable_for_url_comparison = true
validation.missing_url_ranks = []
validation.unsafe_url_ranks = []
```

All 20 normalized rows are present in the single exported item. No pagination continuation is required.
