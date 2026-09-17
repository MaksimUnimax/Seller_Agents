# R01 export persistence manifest — `подключить chatgpt к маркетплейсу`

Date: 2026-09-17.  
Stage: `M3 — Ordinary Yandex SERP collection`.  
Status: **PASS / FULL EXPORT DURABLY PERSISTED / REMOTE READBACK PASS**.

## 1. Source attachment

Owner-returned Yandex Marketing Bridge export:

`search-octoport-serp-r01-20260917-r5-0-0.json`

Local exact-byte checks:

```text
source_size_bytes = 98455
source_sha256 = 1c3cf6ae186bcfd07924a183209130cfb38f7af16e533acf864762973c4dfb7e
```

## 2. Export envelope

```text
schema = YMB_SEARCH_ASYNC_EXPORT_PAGE_V1
job_id = octoport-serp-r01-20260917
revision = 5
total_items = 1
query = подключить chatgpt к маркетплейсу
state = SUCCEEDED
operation_id = sprsmko0p531abn82fmk
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

Search settings retained from the comparable S01-S03 series:

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

The GitHub connector available to Main Chat is text-oriented. To avoid truncating or rewriting the 98,455-byte JSON, the exact source bytes were deterministically gzip-compressed (`gzip -9`, `mtime=0`), base64 encoded and split only for connector-safe transport.

Expected reconstructed gzip:

```text
gzip_size_bytes = 28228
gzip_sha256 = 3fa45c263cc56f8672713ce379b1d8766440f4230e9011d5aabf4757a98c27ab
base64_chars = 37640
part_lengths = 9500,9500,9500,9140
```

Repository parts:

| Part | Path | bytes | Git blob SHA |
|---|---|---:|---|
| 01 | `search-octoport-serp-r01-20260917-r5-0-0.json.gz.b64.part01` | 9500 | `a6ca55bf6e77aaab7251142dc8fd632905fed9c7` |
| 02 | `search-octoport-serp-r01-20260917-r5-0-0.json.gz.b64.part02` | 9500 | `6f14bcb52c5067841c5430d434b0276cf47c4359` |
| 03 | `search-octoport-serp-r01-20260917-r5-0-0.json.gz.b64.part03` | 9500 | `64986f06e680d9e18d1662c1c843227d55d7cbc2` |
| 04 | `search-octoport-serp-r01-20260917-r5-0-0.json.gz.b64.part04` | 9140 | `7a0a3080af83a589f1b95da6a558afd10123fcb9` |

All four live under `docs/seo/serp/raw/`.

Reconstruction procedure:

```text
concatenate part01 -> part02 -> part03 -> part04 as raw ASCII
-> base64 decode
-> verify gzip SHA-256
-> gunzip
-> verify source size 98455 and source SHA-256
```

## 4. Remote readback

Directory readback on branch `seo/wordstat-batch-01-2026-09-16` confirmed all four paths after fast-forward ref update. Each returned byte count and Git blob SHA matches the locally calculated expected value.

```text
PART01_REMOTE_SHA_MATCH = PASS
PART02_REMOTE_SHA_MATCH = PASS
PART03_REMOTE_SHA_MATCH = PASS
PART04_REMOTE_SHA_MATCH = PASS
REMOTE_PART_LENGTHS_MATCH = PASS
LOSSLESS_RECONSTRUCTION_CONTRACT = PASS
FULL_EXPORT_PERSISTENCE = PASS
REMOTE_READBACK = PASS
```

## 5. Semantic authority boundary

This manifest proves persistence/integrity only. Semantic interpretation is recorded separately in:

`../analysis/R01_06_EXPORT_ANALYSIS_2026-09-17.md`.

No page, URL architecture or final cluster is created by this persistence artifact.
