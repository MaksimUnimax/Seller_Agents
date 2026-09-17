# R10 export manifest — lossless complete export

Date: 2026-09-17.  
Query: `анализ ниш wildberries для продавца`.  
Job: `octoport-serp-r10-20260917`.  
Operation: `spr463ilaidv2pqtcdmm`.  
Revision: `5`.  
Source file: `search-octoport-serp-r10-20260917-r5-0-0.json`.

## Export contract QA

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r10-20260917
revision = 5
total_items = 1
page.item_count = 1
page.result_row_count = 20
page.items_with_raw = 1
page.items_with_normalized = 1
page.states.SUCCEEDED = 1
page.next_after = 0
page.has_more = false
page.all_job_items_in_this_file = true
normalized.result_count = 20
validation.document_count = 20
validation.empty_proven = false
validation.xml_error_code = null
validation.usable_for_url_comparison = true
validation.missing_url_ranks = []
validation.unsafe_url_ranks = []
```

The export is complete for the only R10 job item and contains the full normalized organic top-20. No pagination continuation is required.

## Exact source identity

```text
source_bytes = 95334
source_sha256 = c5b03e9c55e35d7da99adebeaeccb989b8c50909c543172d7c51c1c1b32e103e
```

The original `.json` file itself is not committed as a single raw GitHub file. Instead, the exact bytes are preserved through the deterministic lossless representation below. This is not a summary and does not discard any raw export data.

## Deterministic lossless representation

Method:

1. Take the exact source bytes.
2. gzip with compression level 9 and `mtime=0`.
3. Base64-encode the gzip bytes with no inserted line breaks.
4. Split the resulting Base64 string into fixed 4000-character chunks, except the final remainder.

```text
gzip_bytes = 26152
gzip_sha256 = d6142abe4864ea3fd399b3a9a74a3b54c5491d28acf5e29918667b11a009dc94
base64_chars = 34872
chunk_count = 9
chunk_sizes = [4000,4000,4000,4000,4000,4000,4000,4000,2872]
```

## Published chunk ledger

| Chunk | Repository path | Characters | Remote Git blob SHA |
|---:|---|---:|---|
| c01 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `03c95a3a6cf8c3c48ca2007f32fb6f0176bf10c7` |
| c02 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c02` | 4000 | `43fe3a1cdd074360e55b0637a811674909762b36` |
| c03 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c03` | 4000 | `a29844c6de1c6269acb5bb53a3f8c0977cc03fda` |
| c04 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c04` | 4000 | `b9158ccb2d54c561fdb36d6fa4172c93a16c5f6b` |
| c05 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c05` | 4000 | `35faabd5ee89b97219c2e5a6c395ad6db8aa78d2` |
| c06 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c06` | 4000 | `5bcdf212fdf5210a3a9dff7872720dd8c07a317e` |
| c07 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c07` | 4000 | `dabc059bc7de0df6aa1e64524de75a974f23655c` |
| c08 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c08` | 4000 | `284ec9e361bcfde047c47aba6861135c439f4348` |
| c09 | `docs/seo/serp/raw/search-octoport-serp-r10-20260917-r5-0-0.json.gz.b64.c09` | 2872 | `daf8b16ed1a9c8bce716511ee4b5a7194f03fd38` |

Every remote Git blob SHA above was read back from the durable branch and matched the locally recomputed Git blob SHA for the corresponding exact chunk bytes.

Two temporary paths created accidentally during persistence were deleted by ordinary forward commits and are not present in the final branch tree:

- `docs/seo/serp/raw/TEST_DO_NOT_COMMIT` — remote readback: 404 / absent;
- `docs/seo/serp/raw/ANOTHER_TEST` — remote readback: 404 / absent.

They are not evidence and are not part of the reconstruction contract.

## Reconstruction contract

To recover the exact original export:

1. read c01 through c09 in numeric order;
2. concatenate their contents directly with **no separators and no added newline characters**;
3. Base64-decode the concatenated string;
4. verify gzip SHA-256 equals `d6142abe4864ea3fd399b3a9a74a3b54c5491d28acf5e29918667b11a009dc94`;
5. gunzip the bytes;
6. verify resulting byte length equals `95334`;
7. verify resulting source SHA-256 equals `c5b03e9c55e35d7da99adebeaeccb989b8c50909c543172d7c51c1c1b32e103e`.

A successful verification proves byte-for-byte identity with the user-supplied R10 export.

## Gate result

```text
R10_EXPORT_COMPLETE = YES
R10_RESULT_ROWS = 20
R10_LOSSLESS_PERSISTENCE = PASS
R10_REMOTE_CHUNK_IDENTITY = PASS / 9 OF 9
R10_TEMP_PATHS_ABSENT = PASS
R10_SEMANTIC_ANALYSIS_ALLOWED = YES
```
