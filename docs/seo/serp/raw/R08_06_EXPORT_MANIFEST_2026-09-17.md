# R08 full export persistence manifest — `аналитика рекламы маркетплейсов`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection / F6 advertising-analysis boundary`.  
Job: `octoport-serp-r08-20260917`.  
Operation: `sprvt6p3aq5uj96uqs0b`.  
Revision: `5`.  
Status: **PERSISTED CANDIDATE / REMOTE READBACK PENDING**.

## 1. Source identity

```text
SOURCE_FILE = search-octoport-serp-r08-20260917-r5-0-0.json
SOURCE_BYTES = 74287
SOURCE_SHA256 = b90dd63cd9b492e09e6e4dbdd5d8cf6b9b877d4ea16678637822445cacb0fba2
EXPORT_SCHEMA = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
TOTAL_ITEMS = 1
RESULT_ROW_COUNT = 20
SUCCEEDED = 1
HAS_MORE = false
ALL_JOB_ITEMS_IN_THIS_FILE = true
DOCUMENT_COUNT = 20
USABLE_FOR_URL_COMPARISON = true
MISSING_URL_RANKS = []
UNSAFE_URL_RANKS = []
```

The exact owner-returned JSON is preserved losslessly as deterministic gzip (`mtime=0`) → Base64 → fixed chunks. No semantic evidence is omitted from the durable representation.

## 2. Deterministic encoded representation

```text
GZIP_MTIME = 0
GZIP_BYTES = 19565
GZIP_SHA256 = 1d82f415ace308517b2c2d2751293307645a2c2bc8134ac645f4cef233ce15fc
BASE64_CHARS = 26088
CHUNK_SIZE_CHARS = 4000
CHUNK_COUNT = 7
CHUNK_LENGTHS = [4000, 4000, 4000, 4000, 4000, 4000, 2088]
```

## 3. Chunk objects

| # | Repository path | Base64 chars | Git blob SHA |
|---:|---|---:|---|
| 1 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `efe2020d71caa6d48bdf3d0d841c1c5cf00f7149` |
| 2 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c02` | 4000 | `4f12518d8782b29981de30ea8a40870927cdd89c` |
| 3 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c03` | 4000 | `28238d7fa6dc95f2c307be4e21ba7944795e542b` |
| 4 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c04` | 4000 | `b1b37bee1ae687b4e4e8e1d9192e58ff96da278e` |
| 5 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c05` | 4000 | `c273feb7eb5d4ec75ec394b2c54a60feb9462f7b` |
| 6 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c06` | 4000 | `eab6e7c16e5f0c6e6e8ca272bfe12a1173e40e6d` |
| 7 | `search-octoport-serp-r08-20260917-r5-0-0.json.gz.b64.c07` | 2088 | `e79f86841ecaf44b0da3c8b617ccfe4fe23a136c` |

## 4. Reconstruction contract

Concatenate chunk contents strictly `c01..c07`, Base64-decode, then gunzip. The reconstructed bytes must satisfy:

```text
SHA256 = b90dd63cd9b492e09e6e4dbdd5d8cf6b9b877d4ea16678637822445cacb0fba2
BYTES = 74287
```

This manifest is not allowed to claim final remote-readback PASS until the committed chunk paths, manifest and full analysis have been fetched back from the branch and verified.
