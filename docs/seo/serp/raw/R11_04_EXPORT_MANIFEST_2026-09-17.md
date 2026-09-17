# R11 export manifest — lossless source persistence

Date: 2026-09-17  
Query: `как работать в кабинете wildberries продавцу`  
Job: `octoport-serp-r11-20260917`  
Revision: `5`

## Export contract

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r11-20260917
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
source_file = search-octoport-serp-r11-20260917-r5-0-0.json
source_bytes = 91670
source_sha256 = 0f91fe568ddc9fe46ba099e6bd031add05c8c32111179725b8578aabcb695037
deterministic_gzip = gzip level 9 / mtime=0
gzip_bytes = 24761
gzip_sha256 = 572581f695331433003cfca376ee23d311f0a04adb33128480c8dcf6c3446048
base64_chars = 33016
lossless_parts = 17
chunk_size = 2000 base64 chars except final part
```

Lossless reconstruction:
1. concatenate c01..c17 in ordinal order with no separators;
2. Base64-decode;
3. gunzip;
4. verify `0f91fe568ddc9fe46ba099e6bd031add05c8c32111179725b8578aabcb695037` and `91670` bytes.

## Chunk ledger

- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c01` — blob `7b52e5ed667e15222339e1b0d99d08d365b339bb` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c02` — blob `23093951b6e5844ab29cb67a45da150d4c6fb038` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c03` — blob `bcf59a10c2d9ab08ee72f8957b97c270e7a16add` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c04` — blob `d40ff6d416d107afbb0cc6c6da86d7973242518a` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c05` — blob `98f188fe24e5ceefc12851fb876c95bc78258713` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c06` — blob `0047a1c6b13ace4c24380c377d6640e044122578` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c07` — blob `a854c00ebc4c703e8a014af9fa9793936425a1d8` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c08` — blob `e7ce1ac8df32c96537c9168f745f8aca952896cc` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c09` — blob `521d03695de8ec9070d2a84c169ab80b67b462cf` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c10` — blob `97ffd386443c8a87d19aac463cf8ccfa366bbc6e` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c11` — blob `4bfb36450b13259794f9bd986a8a6ced780a94f5` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c12` — blob `02ce603b77498d2c5f77fe13d356323cc9a9184a` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c13` — blob `5e9e8122968fa4e00fa9daeef7eb349f7917526e` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c14` — blob `095a15d26dd1abe27d1c546ae5ca7cd993c3ae99` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c15` — blob `f6e66dff31415561b9cfe6298b9ce562ab36fb6e` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c16` — blob `15e47e2cce6072cdceee028493cfa598422bd7c0` — 2000 chars
- `docs/seo/serp/raw/search-octoport-serp-r11-20260917-r5-0-0.json.gz.b64.c17` — blob `1f0a725d6f293b39aceb18e03418655df2e0f28e` — 1016 chars

The chunk representation is transport/storage only. The source authority remains the exact exported JSON reconstructed byte-for-byte from the ledger above.
