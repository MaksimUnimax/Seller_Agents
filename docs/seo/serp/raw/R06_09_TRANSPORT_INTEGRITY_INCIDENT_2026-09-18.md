# R06 durable-export transport integrity incident — 2026-09-18

Status: **ACTIVE / R06 HISTORICAL TRANSPORT AUTHORITY INVALIDATED / PROVIDER LIFECYCLE RETAINED**
Detected by: ChatGPT Work M4A R2 narrow input-integrity preflight
Affected stage: M3 R06 durable export -> M4A R2 input authority
Provider replay authorized: **NO**

## 1. R06 identity

Query: `помощник селлера маркетплейсов`
Job: `octoport-serp-r06-20260917`
Revision: `5`
Operation: `sprdv3pu6m66t214aidj`

Terminal collect authority:
`R06_07_COLLECT_SUCCEEDED_2026-09-17.md`

It proves:

```text
ok = true
request_executed = true
provider_calls = 1
SUCCEEDED = 1
unresolved = 0
all_successful = true
revision = 5
operation_id = sprdv3pu6m66t214aidj
```

Therefore this incident does **not** invalidate provider execution/lifecycle truth. It invalidates the historical exact-byte durable-export claim.

## 2. Historical manifest claim that failed

Historical:
`R06_08_EXPORT_MANIFEST_2026-09-17.md`

Claimed:

```text
SOURCE_BYTES = 73361
SOURCE_SHA256 = d16ae03ac3e0e87b23cc47870dc233b15d8788410abd5fc8105657b8276a12eb
GZIP_BYTES = 20604
GZIP_SHA256 = a3df7f3b023e2bd991e345888333203046ecebb5fcc4e95bcf5bdffb898aadbe
BASE64_CHARS = 27472
CHUNK_COUNT = 7
```

The seven current Git chunk blob SHAs exactly match the historical manifest, so this is not later Git corruption.

## 3. Independent reconstruction from immutable Git chunks

Concatenating the exact current c01..c07 text gives 27,472 Base64 characters and decodes to exactly 20,604 gzip bytes.

Observed actual gzip SHA-256:

`7eae84ffb5492d015e69aa4937a5da5bff36d45444c533853d35dec98b29a655`

This does **not** match the manifest.

Standard gzip validation fails because the stored trailer is inconsistent.

Historical trailer declares:

```text
CRC32 = 0x704d22c8
ISIZE = 73361
```

The gzip DEFLATE body itself is intact and decompresses independently to:

```text
RECOVERED_SOURCE_BYTES = 73385
RECOVERED_SOURCE_CRC32 = 0x95252f95
RECOVERED_SOURCE_SHA256 = 78759292ba7f23ad741329cc631b9ec90b26abcff4e0b97fc81ff5289d0708f6
CORRECT_GZIP_TRAILER_HEX = 952f2595a91e0100
```

So the defect is specifically an inconsistent historical gzip trailer / source-identity manifest, not a damaged DEFLATE payload.

## 4. Recovered JSON structural verification

The recovered 73,385-byte body parses as valid JSON and identifies:

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
usable_for_url_comparison = true
missing_url_ranks = []
unsafe_url_ranks = []
has_more = false
all_job_items_in_this_file = true
```

Ranks are complete 1..20.

Observed provider/search settings also match the accepted M3 baseline:
Russia region 225, RU search, page 0, groups 20, one document/group, flat mode, relevance descending, RU localization.

The first ranked domains/URLs agree with the already-persisted all-20 R06 analysis, including ranks 1–5:
sally-seller.ru, infosell.tech, ilai.io, saintpack.ru, sellergpt.ru.

This supports semantic continuity, but the recovered body must be represented as a **new derived recovery authority**, not falsely relabelled as the historical 73,361-byte original.

## 5. Git-history check

Git history shows the seven chunks were committed as chunk artifacts and then the export manifest was committed.

No historical commit was found for these obvious full-source transport paths:

- `...r06...json`
- `...r06...json.gz`
- `...r06...json.gz.b64`

Therefore the manifest-claimed 73,361-byte exact source cannot currently be recovered from a separately persisted Git blob.

## 6. Correct recovery policy

Do NOT:
- use the invalid old manifest as exact-byte authority;
- ask Work to silently repair it;
- replay Search merely to reconstruct old transport formatting;
- overwrite/delete the historical incident.

Do:

```text
IMMUTABLE 7 CHUNKS
+ HEALTHY RAW DEFLATE BODY
+ SUCCESSFUL TERMINAL COLLECT IDENTITY
+ STRUCTURAL/SEMANTIC CROSSCHECK
-> MATERIALIZE NEW DERIVED RECOVERY TRANSPORT
-> CORRECT CRC/ISIZE/SHA
-> MAIN CHAT RECOVERY QA
-> NEW M4A RELEASE
```

A new provider call is authorized only if derived recovery cannot satisfy the M4A input-integrity gate.

## 7. Immediate execution state

```text
R06_PROVIDER_LIFECYCLE = VALID
R06_HISTORICAL_EXACT_EXPORT_MANIFEST = INVALIDATED
R06_RECOVERED_JSON = DERIVED / PENDING DURABLE RECOVERY MATERIALIZATION
M4A_R2 = HOLD / SUSPENDED
M4B = BLOCKED
NEW_PROVIDER_CALLS = 0
```
