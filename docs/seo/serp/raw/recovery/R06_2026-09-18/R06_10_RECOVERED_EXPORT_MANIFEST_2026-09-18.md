# R06 recovered export manifest — derived transport authority

Date: 2026-09-18
Status: **RECOVERED DERIVED AUTHORITY / PROVIDER-FREE TRANSPORT REPAIR**

Query: `помощник селлера маркетплейсов`
Job: `octoport-serp-r06-20260917`
Revision: `5`
Operation: `sprdv3pu6m66t214aidj`

## Authority boundary

This is a new derived transport authority. It does **not** claim to reconstruct the missing historical 73,361-byte attachment.

Historical `R06_08_EXPORT_MANIFEST_2026-09-17.md` is superseded for exact-byte transport identity: its listed chunks reconstruct a gzip whose trailer conflicts with the preserved DEFLATE payload.

The recovery is deterministic from immutable Git chunks and does not create a new Search observation.

## Original immutable transport inputs

Historical chunk blob SHAs:

```text
c01 8897d0fb26f77653073c23122aec39121d8e2ac0
c02 f5eb619123ade1a7c959b38a91629bdb9f3db389
c03 e2e88ffa923a7e03b156b2fe2e25092f74986575
c04 afb20b8b144f428e521cad7fa81052746d5dc757
c05 5a066c8e5011febf3c0ff9bdcec0a71f9c771ca9
c06 b9560e53ba662ea0b3a09521f50c02ec80535499
c07 e5509382cba1e183ef9d9b3f2cd885b1909aa872
```

Concatenation facts:

```text
BASE64_CHARS = 27472
GZIP_BYTES = 20604
ACTUAL_HISTORICAL_CHUNK_GZIP_SHA256 = 7eae84ffb5492d015e69aa4937a5da5bff36d45444c533853d35dec98b29a655
HISTORICAL_TRAILER_HEX = c8224d70911e0100
STANDARD_GZIP_VALIDATION = FAIL
```

## Deterministic repair

Independent raw-DEFLATE decompression proved that the compressed body is intact.

Recovered source identity:

```text
RECOVERED_SOURCE_BYTES = 73385
RECOVERED_SOURCE_SHA256 = 78759292ba7f23ad741329cc631b9ec90b26abcff4e0b97fc81ff5289d0708f6
RECOVERED_SOURCE_CRC32 = 0x95252f95
```

Recovery transformation:

```text
preserve gzip bytes 0..20595 unchanged
replace only final 8-byte gzip trailer:
old = c8224d70911e0100
new = 952f2595a91e0100
```

The new trailer encodes CRC32 `0x95252f95` and ISIZE `73385`.

Recovered gzip identity:

```text
RECOVERED_GZIP_BYTES = 20604
RECOVERED_GZIP_SHA256 = f764c509f47f0a53a33b90a7c3dc5c8f61d62137da1b339360acb9c844a1b608
RECOVERED_BASE64_CHARS = 27472
RECOVERED_CHUNK_COUNT = 7
STANDARD_GZIP_DECOMPRESSION = PASS
DECOMPRESSED_BYTES_EQUAL_INDEPENDENT_RAW_DEFLATE_RECOVERY = true
```

## Recovery chunks

c01–c06 are byte-identical to the historical chunks and therefore reuse the same Git blobs. Only c07 differs, because the repair changes only the gzip trailer.

| chunk | chars | Git blob SHA |
|---|---:|---|
| c01 | 4000 | `8897d0fb26f77653073c23122aec39121d8e2ac0` |
| c02 | 4000 | `f5eb619123ade1a7c959b38a91629bdb9f3db389` |
| c03 | 4000 | `e2e88ffa923a7e03b156b2fe2e25092f74986575` |
| c04 | 4000 | `afb20b8b144f428e521cad7fa81052746d5dc757` |
| c05 | 4000 | `5a066c8e5011febf3c0ff9bdcec0a71f9c771ca9` |
| c06 | 4000 | `b9560e53ba662ea0b3a09521f50c02ec80535499` |
| c07 | 3472 | `f8763ca95ff7bc42e6710d11c51d35836e2d19bc` |

## Reconstruction contract

```text
concatenate recovery c01..c07 in lexical order
-> Base64 decode
-> standard gzip decompress WITH CRC/ISIZE validation
-> exact recovered JSON bytes
-> verify SOURCE_BYTES = 73385
-> verify SOURCE_SHA256 = 78759292ba7f23ad741329cc631b9ec90b26abcff4e0b97fc81ff5289d0708f6
```

## Recovered JSON structural identity

Verified before publication:

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r06-20260917
revision = 5
total_items = 1
item_state = SUCCEEDED
operation_id = sprdv3pu6m66t214aidj
query = помощник селлера маркетплейсов
result_count = 20
document_count = 20
ranks = 1..20 complete
usable_for_url_comparison = true
missing_url_ranks = []
unsafe_url_ranks = []
has_more = false
all_job_items_in_this_file = true
```

This identity matches the separately durable R06 terminal collect record and the persisted all-20 semantic analysis.

## Provider boundary

```text
NEW_PROVIDER_CALLS = 0
NEW_SEARCH_SNAPSHOT = false
HISTORICAL_OPERATION_IDENTITY_PRESERVED = true
```

Use this manifest, not the superseded historical exact-byte manifest, for future R06 durable-export reconstruction.
