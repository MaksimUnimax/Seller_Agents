# R07 export manifest — lossless complete export

Date: 2026-09-17.  
Query: `как заполнить карточку товара wildberries`.  
Job: `octoport-serp-r07-20260917`.  
Operation: `sprh5ncfp74am7l6eofs`.  
Revision: `5`.  
Source file: `search-octoport-serp-r07-20260917-r5-0-0.json`.

## Export contract QA

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r07-20260917
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

The export is complete for the only R07 job item. No pagination continuation is required.

## Exact source identity

```text
source_bytes = 97531
source_sha256 = 67fafe83ef45e5b8bce03ab2c44756029af3a6be0288148739db2fac8f71762d
```

The original JSON is preserved losslessly through deterministic gzip + Base64 text parts.

## Deterministic lossless representation

1. Exact source bytes.
2. gzip level 9 with `mtime=0`.
3. Base64 with no line breaks.
4. Text parts concatenated in ledger order.

```text
gzip_bytes = 24374
gzip_sha256 = f050ba638cdbf8bb6bf977899267f38539b41f03fa1054c063e6844bb74fda36
base64_chars = 32500
part_count = 14
part_sizes = [4000,4000,4000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,500]
```

The fourth original 4000-character chunk was split into `c04a` + `c04b` because the connector rejected that one payload as a whole; chunks c05-c08 were also stored as 2000-character pairs to keep the durable write path uniform. This changes only text segmentation, not the compressed/base64 payload.

## Published part ledger

| Part | Repository path | Characters | Git blob SHA |
|---|---|---:|---|
| c01 | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `f1b326e61bec908b4a57ceb7fa0647e3cad1f3e2` |
| c02 | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c02` | 4000 | `2c17c2470f00c9f379517320617736b7edbaca6a` |
| c03 | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c03` | 4000 | `24cb8b7af66d602e754defb4fabfdd3a60e2a2b3` |
| c04a | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c04a` | 2000 | `74cf552e1effa7fdce0aa3caa7ccbe8931ee4539` |
| c04b | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c04b` | 2000 | `748d1b8cc297bc6d86001c3bc61501af44a138c1` |
| c05a | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c05a` | 2000 | `e82c2e99197ef1a74f1479aae4414294f21307bb` |
| c05b | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c05b` | 2000 | `0f4a0b60d1d8683e1554668601fdff9f57c9b190` |
| c06a | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c06a` | 2000 | `c874432d6704e4991d08387272a053562a857260` |
| c06b | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c06b` | 2000 | `33e32f1b78888d6e36430dbebbdbf027cea5006c` |
| c07a | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c07a` | 2000 | `3b5df7677ba61a989fe29581039f443a1910bf12` |
| c07b | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c07b` | 2000 | `10892d93588f1c93bd9c8a23025219162be1b73b` |
| c08a | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c08a` | 2000 | `a0d078f2697fe415c0eafcad1094c44d54876586` |
| c08b | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c08b` | 2000 | `16b47b4b33ad565b8fa9858171b13f19fec6ce2a` |
| c09 | `docs/seo/serp/raw/search-octoport-serp-r07-20260917-r5-0-0.json.gz.b64.c09` | 500 | `492aec7df8e45b8510d8055e4509cccdfde11b55` |

## Reconstruction verification

Concatenating parts in ledger order, Base64-decoding, then gzip-decompressing locally reproduced:

```text
reconstructed_bytes = 97531
reconstructed_sha256 = 67fafe83ef45e5b8bce03ab2c44756029af3a6be0288148739db2fac8f71762d
reconstructed_equals_uploaded_source = true
```

Acceptance requires remote tree/readback to point each path at the listed Git blob SHA.
