# R03 export persistence manifest — `chatgpt для wildberries`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection`.  
Status: **PASS / FULL EXPORT DURABLY PERSISTED / VERIFIED 7-CHUNK REMOTE READBACK PASS**.

## 1. Source attachment

Owner-returned Yandex Marketing Bridge export:

`search-octoport-serp-r03-20260917-r5-0-0.json`

Exact local checks:

```text
source_size_bytes = 67471
source_sha256 = cd8706d0bf7da69f30df09286a7352f64e2230b3e30057a864d0b9d031cb92c4
```

## 2. Export envelope

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r03-20260917
revision = 5
total_items = 1
query = chatgpt для wildberries
state = SUCCEEDED
operation_id = spr8vij9p1s7cijt2chi
page.item_count = 1
page.result_row_count = 20
page.items_with_raw = 1
page.items_with_normalized = 1
page.next_after = 0
page.has_more = false
page.all_job_items_in_this_file = true
validation.schema = YMB_ASYNC_XML_GUARD_V1
validation.document_count = 20
validation.empty_proven = false
validation.usable_for_url_comparison = true
validation.missing_url_ranks = []
validation.unsafe_url_ranks = []
```

Search settings remain comparable with S01-S03, R01 and R02:

```text
searchType = SEARCH_TYPE_RU
region = 225
page = 0
groupsOnPage = 20
docsInGroup = 1
groupMode = GROUP_MODE_FLAT
familyMode = FAMILY_MODE_MODERATE
fixTypoMode = FIX_TYPO_MODE_OFF
sortMode = SORT_MODE_BY_RELEVANCE
sortOrder = SORT_ORDER_DESC
l10n = LOCALIZATION_RU
maxPassages = 4
```

## 3. Lossless repository transport

The exact 67,471-byte JSON was deterministically gzip-compressed (`gzip -9`, `mtime=0`) and base64 encoded.

```text
gzip_size_bytes = 20294
gzip_sha256 = b206a10378ee4e0b68536eb5d5b206db239e4a8a5d87abfaad7e615489216b83
base64_chars = 27060
```

An initial three-large-part transport was rejected after remote SHA verification showed that the first remote part did not match the precomputed source-derived blob SHA. Those three transport files were therefore treated as invalid/superseded and deleted. They are not reconstruction authority.

The final accepted transport uses seven smaller ASCII chunks:

| Chunk | Path | chars | Git blob SHA |
|---|---|---:|---|
| c01 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c01` | 4000 | `0e9719ca35479f13b240b30476c66ca76825d8f9` |
| c02 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c02` | 4000 | `8dd3218dd27848106df0da1826f79e7ec31034c8` |
| c03 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c03` | 4000 | `ca3bc3e3fc6d4c3cdb69a851288f7856f4a8be8a` |
| c04 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c04` | 4000 | `ab086b54ff3175be71d8db0c4846599924e867d5` |
| c05 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c05` | 4000 | `6e6752df55eef56c2df33f34361a4f7d93664bca` |
| c06 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c06` | 4000 | `cdaac1011265d4a7fddff3bcfcf56deb8eb0a695` |
| c07 | `search-octoport-serp-r03-20260917-r5-0-0.json.gz.b64.c07` | 3060 | `42827dd36b0a1a177244b32fba73cfc196a37f81` |

All accepted chunks live under `docs/seo/serp/raw/`.

Reconstruction contract:

```text
concatenate c01 -> c02 -> c03 -> c04 -> c05 -> c06 -> c07 as raw ASCII
-> verify total base64 chars = 27060
-> base64 decode
-> verify gzip_size_bytes = 20294
-> verify gzip_sha256 = b206a10378ee4e0b68536eb5d5b206db239e4a8a5d87abfaad7e615489216b83
-> gunzip
-> verify source_size_bytes = 67471
-> verify source_sha256 = cd8706d0bf7da69f30df09286a7352f64e2230b3e30057a864d0b9d031cb92c4
```

## 4. Remote readback

Every accepted chunk was read back from branch `seo/wordstat-batch-01-2026-09-16`. The returned Git blob SHA matched the exact precomputed SHA for all seven chunks.

```text
C01_REMOTE_SHA_MATCH = PASS
C02_REMOTE_SHA_MATCH = PASS
C03_REMOTE_SHA_MATCH = PASS
C04_REMOTE_SHA_MATCH = PASS
C05_REMOTE_SHA_MATCH = PASS
C06_REMOTE_SHA_MATCH = PASS
C07_REMOTE_SHA_MATCH = PASS
INVALID_LARGE_TRANSPORT_REMOVED = PASS
LOSSLESS_RECONSTRUCTION_CONTRACT = PASS
FULL_EXPORT_PERSISTENCE = PASS
REMOTE_READBACK = PASS
```

## 5. Semantic authority boundary

This manifest proves persistence/integrity only. Semantic interpretation is recorded in:

`../analysis/R03_06_EXPORT_ANALYSIS_2026-09-17.md`.

The paired F2 comparison is recorded separately in:

`../analysis/R02_VS_R03_OWN_CHATGPT_PAIRED_COMPARISON_2026-09-17.md`.

No final page, route, cluster or IA decision is created by this persistence artifact.
