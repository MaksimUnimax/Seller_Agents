# R12 export manifest — lossless source persistence

Date: 2026-09-17  
Query: `какой ии выбрать для маркетплейсов`  
Job: `octoport-serp-r12-20260917`  
Revision: `5`

## Export contract

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r12-20260917
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

## Source identity

```text
source_file = search-octoport-serp-r12-20260917-r5-0-0.json
source_bytes = 101005
source_sha256 = 5248855fd4b2ac3862de88a816f81d6ef1eadd9094378ebb5fc5a27e7cccd7b8
deterministic_gzip = gzip level 9 / mtime=0
gzip_bytes = 26862
gzip_sha256 = cfc5debce250b434dd4e9900f15f3f665de2f7852fe4fbc05731701b3bdcffef
base64_chars = 35816
lossless_parts = 18
chunk_size = 2000 base64 chars except final part
```

Lossless reconstruction:
1. concatenate c01..c18 in ordinal order with no separators;
2. Base64-decode;
3. gunzip;
4. verify `5248855fd4b2ac3862de88a816f81d6ef1eadd9094378ebb5fc5a27e7cccd7b8` and `101005` bytes.

## Chunk ledger

- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c01` — blob `f0d73f53cf1ce4fce5d3519748e69f8a84b45ce7` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c02` — blob `3202e185d23565c3fc74b6749b7537d2787e89c0` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c03` — blob `dc820cf5b3fbf2096bdc5c6d2e776dfb9c92e61e` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c04` — blob `0265aecb4144322b66c5bf330ebf6ebd09eb6b2a` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c05` — blob `114f53dbf3e3072c44891192f9b821f75afe6429` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c06` — blob `ccae6ff235bb156748c0de4c67092894d13724c6` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c07` — blob `6cf74d521faa6324cb0b8f57c548439f40b69ca3` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c08` — blob `de7d21dd5efb6f25a95a83576987ddd01febd47b` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c09` — blob `6ec12ad8cff7ab5b163e9d0bf4eba4c38f5cba4a` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c10` — blob `17c454f43963e34f23dd0236d29bfbf406dc7773` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c11` — blob `10b437e53bfcafaded8b73cc4ac8d40681b0be31` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c12` — blob `bdf2d9a811ac3412562f05a61a93f41ee45f3574` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c13` — blob `9a46d40f58c4eaa7400e5c645bbf4ca1d457fae4` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c14` — blob `f07a047904cdee84ad73cb89001be682a5ad89ca` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c15` — blob `89bcf991bc2ee3e74d49c99ab3ecdba3d15335d0` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c16` — blob `c59320f93f7fbeae7a60c859e2cc023da4efbfda` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c17` — blob `9bd81fe2538365815bdc3e9ff859ebc93c3c8280` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r12-20260917-r5-0-0.json.gz.b64.c18` — blob `004106069280593ec75f0a3059f046987c3d6e9b` — 1816 chars

The chunk representation is transport/storage only. The source authority remains the exact exported JSON reconstructed byte-for-byte from the ledger above.

## Persistence execution note

- `c01` was accidentally written through the Contents API as its own fast-forward commit before the Git Data path was restored.
- Four temporary non-evidence files (`TEST_SHOULD_NOT_BE_CREATED`, `SHOULD_NEVER_BE_CREATED`, `THIS_IS_NOT_REAL`, `STOP`) were accidentally created and then deleted by forward commits during connector-action mistakes.
- These temporary files are absent from the final tree and are not evidence.
- No force push was used and no accepted evidence was overwritten or lost.
- c02..c18 and all final authority files use the Git Data blob/tree/commit/ref path.
