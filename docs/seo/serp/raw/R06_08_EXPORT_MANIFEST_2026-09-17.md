# R06 export manifest — revision 5

Date: 2026-09-17.  
Query: `помощник селлера маркетплейсов`.  
Job: `octoport-serp-r06-20260917`.  
Operation: `sprdv3pu6m66t214aidj`.  
Status: **PASS / FULL EXPORT PERSISTED / VERIFIED REMOTE READBACK**.

## Source export identity

```text
SOURCE_FILE = search-octoport-serp-r06-20260917-r5-0-0.json
SOURCE_BYTES = 73361
SOURCE_SHA256 = d16ae03ac3e0e87b23cc47870dc233b15d8788410abd5fc8105657b8276a12eb
SCHEMA = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
JOB_ID = octoport-serp-r06-20260917
REVISION = 5
OPERATION_ID = sprdv3pu6m66t214aidj
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
GZIP_BYTES = 20604
GZIP_SHA256 = a3df7f3b023e2bd991e345888333203046ecebb5fcc4e95bcf5bdffb898aadbe
BASE64_CHARS = 27472
CHUNK_COUNT = 7
```

Verified remote chunks:

| Chunk | chars | verified Git blob SHA |
|---|---:|---|
| `search-octoport-serp-r06-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `8897d0fb26f77653073c23122aec39121d8e2ac0` |
| `...c02` | 4000 | `f5eb619123ade1a7c959b38a91629bdb9f3db389` |
| `...c03` | 4000 | `e2e88ffa923a7e03b156b2fe2e25092f74986575` |
| `...c04` | 4000 | `afb20b8b144f428e521cad7fa81052746d5dc757` |
| `...c05` | 4000 | `5a066c8e5011febf3c0ff9bdcec0a71f9c771ca9` |
| `...c06` | 4000 | `b9560e53ba662ea0b3a09521f50c02ec80535499` |
| `...c07` | 3472 | `e5509382cba1e183ef9d9b3f2cd885b1909aa872` |

Every remote Git blob SHA and chunk length matches the locally precomputed value.

## Reconstruction contract

```text
concatenate c01..c07 in lexical order
-> Base64 decode
-> gzip decompress
-> exact original JSON bytes
-> verify SOURCE_BYTES and SOURCE_SHA256 above
```

This seven-chunk transport is the accepted durable authority for the complete R06 export. The original user attachment remains the transport source; no normalization or semantic filtering was applied before persistence.
