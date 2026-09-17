# R05 export manifest — revision 5

Date: 2026-09-17.  
Query: `отчеты для селлеров маркетплейсов`.  
Job: `octoport-serp-r05-20260917`.  
Operation: `sprsofoaue000d4c9epd`.  
Status: **PASS / FULL EXPORT PERSISTED / VERIFIED REMOTE READBACK**.

## Source export identity

```text
SOURCE_FILE = search-octoport-serp-r05-20260917-r5-0-0.json
SOURCE_BYTES = 104570
SOURCE_SHA256 = d18b9977e0ffc124194bd713871b3407429c044b813e87fff69359a930a5a429
SCHEMA = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
JOB_ID = octoport-serp-r05-20260917
REVISION = 5
OPERATION_ID = sprsofoaue000d4c9epd
TOTAL_ITEMS = 1
ITEM_STATE = SUCCEEDED
RESULT_COUNT = 20
DOCUMENT_COUNT = 20
USABLE_FOR_URL_COMPARISON = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
```

## Lossless transport

The exact source bytes were compressed using deterministic gzip (`mtime=0`) and Base64 encoded.

```text
GZIP_BYTES = 29635
GZIP_SHA256 = 1d0fd3384c4b3630e86c78df8a58cae7267fd52fa4e68565e0d88329268031b4
BASE64_CHARS = 39516
CHUNK_COUNT = 10
```

Verified remote chunks:

| Chunk | chars | verified Git blob SHA |
|---|---:|---|
| `search-octoport-serp-r05-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `5250b3cd71e1566ee3b1a5c08b43c71c1f3af4ee` |
| `...c02` | 4000 | `450086480597ee4a0c3f2c37a2466a39cfc7b9b2` |
| `...c03` | 4000 | `09e7ab43ec37d9fc82718e39236971c4ed3673b2` |
| `...c04` | 4000 | `8ee6c9d2b112612d78331caf6968652f0486af21` |
| `...c05` | 4000 | `2f0d850a656d25dd6a8151b72fbff9db93860709` |
| `...c06` | 4000 | `b5496c49655e2ccfe3225c592bf53a4577fda2ef` |
| `...c07` | 4000 | `5db58edf418980720caca775f36701c5c22d2155` |
| `...c08` | 4000 | `932300d0584d3cfd3214fab71e26da2330d1b58f` |
| `...c09` | 4000 | `da3ac56271cca96ef721fb46c2593b6ea0a9e9a0` |
| `...c10` | 3516 | `08de4ecc974cbb1bb36ea360236997ec0d83ba9c` |

Every remote Git blob SHA and chunk length matches the locally precomputed value.

## Reconstruction contract

```text
concatenate c01..c10 in lexical order
-> Base64 decode
-> gzip decompress
-> exact original JSON bytes
-> verify SOURCE_BYTES and SOURCE_SHA256 above
```

This ten-chunk transport is the accepted durable authority for the complete R05 export. The original user attachment remains the transport source; no normalization or semantic filtering was applied before persistence.
