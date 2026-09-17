# R04-R1 export manifest — revision 5

Date: 2026-09-17.  
Query: `аналитика маркетплейсов для селлеров`.  
Job: `octoport-serp-r04r1-20260917`.  
Operation: `sprqtqegnppne4lqbf2t`.  
Status: **PASS / FULL EXPORT PERSISTED / VERIFIED REMOTE READBACK**.

## Source export identity

```text
SOURCE_FILE = search-octoport-serp-r04r1-20260917-r5-0-0.json
SOURCE_BYTES = 77770
SOURCE_SHA256 = 0eac21c35e6b7c349790b5513776217575a23138f75efd7965cb6b332ce9e961
SCHEMA = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
JOB_ID = octoport-serp-r04r1-20260917
REVISION = 5
OPERATION_ID = sprqtqegnppne4lqbf2t
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
GZIP_BYTES = 20532
GZIP_SHA256 = f0406557aab4c7dfa4d3855776eb9feb08639378ba2b475593e9b20c2ded2aac
BASE64_CHARS = 27376
CHUNK_COUNT = 7
```

Verified remote chunks:

| Chunk | chars | verified Git blob SHA |
|---|---:|---|
| `search-octoport-serp-r04r1-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `88c5d88c649ec31c79d9eea06f2236b80498c37f` |
| `...c02` | 4000 | `71224bee0cfcb7a40f649286948fd11303f596ed` |
| `...c03` | 4000 | `99b7f6cc3d2118aef9ec39c0310924d85405dd95` |
| `...c04` | 4000 | `3c67c9b0a03acf78c5389e818c604fc821a9cf18` |
| `...c05` | 4000 | `5bc378fe4679d81e428193bddaae337ceffef070` |
| `...c06` | 4000 | `1a992ced610d08c00e7658a726113ebee0b288d3` |
| `...c07` | 3376 | `4063fdb3c3f5dcc9a5129474fe7223e7bb0e5e9e` |

Every remote Git blob SHA and chunk length matches the locally precomputed value.

## Reconstruction contract

```text
concatenate c01..c07 in lexical order
-> Base64 decode
-> gzip decompress
-> exact original JSON bytes
-> verify SOURCE_BYTES and SOURCE_SHA256 above
```

This seven-chunk transport is the accepted durable authority for the complete R04-R1 export. The original user attachment remains the transport source; no normalization or semantic filtering was applied before persistence.
