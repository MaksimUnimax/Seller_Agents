# R02 export persistence manifest — `chatgpt для ozon`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection`.  
Status: **PASS / FULL EXPORT DURABLY PERSISTED / REMOTE PART-SHA READBACK PASS**.

## 1. Source attachment

Owner-returned Yandex Marketing Bridge export:

`search-octoport-serp-r02-20260917-r5-0-0.json`

Exact local checks:

```text
source_size_bytes = 77213
source_sha256 = 87c69a38376fb368ad01ffc6cf024a9741363e612a9131e762ceba2ccce01206
```

## 2. Export envelope

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r02-20260917
revision = 5
total_items = 1
query = chatgpt для ozon
state = SUCCEEDED
operation_id = sprg1vmblbk160ogsha3
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

Search settings remain comparable with S01-S03 and R01:

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

The exact 77,213-byte JSON was deterministically gzip-compressed (`gzip -9`, `mtime=0`), base64 encoded and split only for connector-safe transport.

Expected reconstructed gzip:

```text
gzip_size_bytes = 23565
gzip_sha256 = 0e36c13c1797e018e905a5ae493e3a565deb4d33f701adcf798fd48d3e47a2b4
base64_chars = 31420
part_lengths = 9500,9500,9500,2920
```

Repository parts:

| Part | Path | bytes | Git blob SHA |
|---|---|---:|---|
| 01 | `search-octoport-serp-r02-20260917-r5-0-0.json.gz.b64.part01` | 9500 | `11ed0d8f79fe11f1d299f6f8ce466f8561ad0bc1` |
| 02 | `search-octoport-serp-r02-20260917-r5-0-0.json.gz.b64.part02` | 9500 | `1a332e2bf01e0a128677bb147a901bbc87bcec59` |
| 03 | `search-octoport-serp-r02-20260917-r5-0-0.json.gz.b64.part03` | 9500 | `d11770f1db96baad7ec0bf95a5bd32ca332b6bee` |
| 04 | `search-octoport-serp-r02-20260917-r5-0-0.json.gz.b64.part04` | 2920 | `07cbf93ac35facd16e093046191587d1169206e5` |

All parts live under `docs/seo/serp/raw/`.

Reconstruction:

```text
concatenate part01 -> part02 -> part03 -> part04 as ASCII
-> base64 decode
-> verify gzip SHA-256
-> gunzip
-> verify source_size_bytes = 77213
-> verify source_sha256 = 87c69a38376fb368ad01ffc6cf024a9741363e612a9131e762ceba2ccce01206
```

## 4. Remote readback

Remote branch readback confirmed each part path and exact precomputed Git blob SHA:

```text
PART01_REMOTE_SHA_MATCH = PASS
PART02_REMOTE_SHA_MATCH = PASS
PART03_REMOTE_SHA_MATCH = PASS
PART04_REMOTE_SHA_MATCH = PASS
LOSSLESS_RECONSTRUCTION_CONTRACT = PASS
FULL_EXPORT_PERSISTENCE = PASS
REMOTE_READBACK = PASS
```

## 5. Semantic authority boundary

This manifest proves persistence/integrity only. Full 20-row semantic interpretation is recorded in:

`../analysis/R02_06_EXPORT_ANALYSIS_2026-09-17.md`.

No final page, route, cluster or IA decision is created by this artifact.
