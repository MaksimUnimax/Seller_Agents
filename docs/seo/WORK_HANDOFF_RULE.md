# Octoport SEO — ChatGPT Work handoff rule

Status: **ACTIVE / OWNER-LOCKED / MANDATORY WHEN TRIGGERED**.
Date: 2026-09-17.

Adapted from KW-002 `LEVEL1/WORK_HANDOFF_RULE.md` and `WORK_BASE_FRESHNESS_AND_AUTHORITY_DRIFT_RULE.md`.

## 1. Purpose

Large-data work must never be degraded merely to fit the ordinary chat context.

```text
LARGE DATA
!= SAMPLE IT
!= FIRST-N ONLY
!= TRUNCATE IT
!= SUMMARIZE BEFORE COMPLETE ANALYSIS

LARGE DATA
-> HAND OFF COMPLETE EXECUTION UNIT TO CHATGPT WORK
```

This chat remains the architect/controller. Work is the large-data execution environment.

## 2. Roles

```text
MAIN CHAT
= decides method
= writes exact Work prompt
= freezes inputs/outputs/QA
= receives Work return
= verifies and accepts/rejects
= updates current authority
= gives the owner the exact GitHub upload URL for Work-return files

OWNER
= relays the prompt to Work
= downloads the single Work ZIP
= extracts it locally when the return contains multiple text/data files
= uploads ALL final unpacked files together in ONE GitHub UI upload action to the exact staging path supplied by Main Chat
= does not design the analysis prompt
= does not have to decide final repository placement beyond the staging path

CHATGPT WORK
= reads complete authorized large inputs
= analyzes/transforms/systematizes at full required volume
= creates governed artifacts
= runs requested QA
= packages multi-file returns into one ZIP for one-click owner download
= does not upload to GitHub unless the owner explicitly changes this rule for a specific task
= does not invent new permanent methodology
```

## 3. Trigger — quality based, not row-count based

Use Work whenever one or more are true:

- complete analysis of a large table or several large files is required;
- row-level joins/deduplication/reconciliation cannot be reliably verified in ordinary chat;
- full provider evidence would otherwise be sampled, truncated or omitted;
- pairwise SERP-overlap / clustering creates a large intermediate universe;
- competitor-page corpus requires full cross-file extraction and comparison;
- combined Wordstat + Search + Alice evidence must be normalized/systematized together;
- a final workbook/report/large structured artifact must be generated;
- ordinary context materially risks skipped rows, lost lineage, partial QA or repeated reconstruction.

There is deliberately **no fixed threshold such as 1000 rows**. The trigger is whether complete reliable analysis is at risk.

## 4. Current Octoport expected Work points

Work is expected, subject to actual size/complexity, at least for:

### W1 — post-Collection-Freeze semantic master

After M7, combine complete authorized:

- Wordstat B01/B02 + any justified incremental acquisition;
- ordinary Yandex SERP exports;
- competitor registry/page corpus;
- Alice/AI-search evidence;
- product truth and exclusion boundaries.

Work produces normalized universe, lineage, WORKING/REVIEW/EXCLUDED/BRAND states and QA artifacts.

### W2 — SERP-overlap / task clustering

If M9 requires multi-query URL-overlap matrices, pairwise similarity and full cluster reconciliation beyond safe ordinary-chat scale, Work processes the complete selected set.

### W3 — page/coverage matrix

If M11/M12 page ownership and secondary-query coverage produce large many-to-many tables, Work materializes them from frozen cluster authority.

### W4 — final technical/content artifact package

If final delivery requires large spreadsheets/reports or comprehensive cross-file QA, Work generates the material files under the accepted page/technical contract.

Work may also trigger earlier in M3–M5 if the accumulated SERP/competitor/Alice corpus becomes too large for reliable full-volume comparison here.

## 5. Mandatory pre-handoff manifest

Before I write a Work prompt, freeze:

```text
WORK_ID
ROADMAP_STAGE
WHY_WORK_REQUIRED
CURRENT_REMOTE_BRANCH / HEAD
ALLOWED_INPUT_FILES / SOURCES
PROHIBITED_INPUTS / SOURCES
AUTHORITATIVE UPSTREAM ARTIFACTS
EXACT EXECUTION GOAL
REQUIRED OUTPUT FILES / TABLES
MANDATORY FIELDS
ROW / JOIN / LINEAGE EXPECTATIONS where known
CLAIM BOUNDARIES
KNOWN FAILURE REGRESSIONS
QA / ACCEPTANCE CHECKS
STOP CONDITIONS
PUBLICATION POLICY
OWNER RELAY / STAGING PATH
```

No ambiguous “analyze everything” prompt is acceptable.

## 6. Canonical handoff sequence

```text
MAIN CHAT PRE-STEP REVIEW
-> WORK TRIGGER CONFIRMED
-> FRESH EXTERNAL METHOD CHECK IF THIS IS A MAJOR STAGE
-> PRE-HANDOFF MANIFEST FROZEN
-> MAIN CHAT WRITES COMPLETE CANONICAL WORK PROMPT
-> OWNER RELAYS PROMPT TO WORK
-> WORK FETCHES/READS COMPLETE AUTHORIZED INPUT SET
-> WORK EXECUTES FULL-VOLUME ANALYSIS
-> WORK MATERIALIZES OUTPUTS + LOCAL QA
-> WORK PACKAGES FINAL MULTI-FILE RETURN INTO ONE ZIP
-> WORK GIVES OWNER ONE DOWNLOAD LINK
-> MAIN CHAT GIVES OWNER ONE EXACT GITHUB UPLOAD URL
-> OWNER DOWNLOADS ZIP, EXTRACTS IT, SELECTS ALL FINAL FILES, UPLOADS THEM TOGETHER IN ONE GITHUB UI ACTION
-> OWNER CONFIRMS UPLOAD
-> MAIN CHAT REMOTE-READBACKS THE UNPACKED FILES DIRECTLY
-> MAIN CHAT RETURN QA
-> ACCEPT | REWORK | HOLD
-> ONLY THEN NEXT ROADMAP STAGE
```

The owner does not have to invent or repair the prompt, choose final repository paths, or upload files one-by-one.

## 7. Work cannot change authority

Work output is **not automatically accepted truth**.

Work may not:

- change product truth;
- create new permanent SEO methodology;
- widen scope silently;
- drop rows silently;
- replace missing evidence with assumptions;
- change evidence classes;
- turn partial processing into complete;
- use prohibited/unlisted inputs;
- make provider calls unless the Work prompt explicitly authorizes them;
- override HOLD just to complete a table;
- decide final page ownership outside the supplied gate.

## 8. Start-base freshness

Before Work processes data:

```text
FETCH CURRENT REMOTE BRANCH
RECORD LIVE HEAD
VERIFY MANDATORY RULES / ROADMAP / INPUT AUTHORITY
VERIFY PROMPT IS CURRENT
VERIFY NO SUPERSEDED INPUT IS USED AS CURRENT
```

If not:

```text
WORK_EXECUTION_ALLOWED = false
```

## 9. Authority drift during a Work run

Before delivery:

```text
RECHECK REMOTE HEAD
```

If remote advanced:

- classify changed paths;
- distinguish immutable analytical payload from mutable current-state/method files;
- if governing rules/input authority changed, revalidate or rerun affected analysis;
- never overwrite newer mutable state from stale Work output.

```text
LOCAL CONSISTENCY != CURRENT AUTHORITY CONSISTENCY
```

## 10. Large artifact transport — OWNER-LOCKED

Do not use model text as a byte-transfer mechanism by default.

Forbidden for an already-produced large file:

- print entire file into chat;
- base64 the whole file through model output;
- split it into many giant connector arguments;
- regenerate a valid artifact merely because Git authentication failed;
- ask the owner to upload final files one-by-one;
- make the owner decide where each Work-return file belongs;
- make Work spend time trying to publish to GitHub when owner relay is the selected transport;
- give the owner an internal `sandbox:/workspace/...` path as if it were the required user-facing delivery.

### 10.1 Default multi-file Work return

For a Work task that creates multiple final files:

```text
WORK
-> creates all final files
-> runs local QA
-> records hashes / manifest
-> creates exactly one ZIP containing only final deliverables
-> gives the owner one real downloadable ZIP artifact/link
-> DOES NOT publish to GitHub

MAIN CHAT
-> immediately gives the owner one exact GitHub upload URL to the staging folder

OWNER
-> downloads the ZIP once
-> extracts it locally
-> selects ALL final files
-> uploads them together in ONE GitHub UI upload action
-> confirms completion

MAIN CHAT
-> reads the unpacked final files directly from GitHub
-> validates hashes/counts/lineage/content
-> moves/redistributes/accepts them as required
```

The ZIP is primarily a **one-download transport package from Work to the owner**. Unless a specific task explicitly requires archiving the ZIP itself in GitHub, the owner should upload the **unpacked final files together**, not only the ZIP.

### 10.2 Exact GitHub upload link is Main Chat's responsibility

When owner upload is the chosen transport, Main Chat must provide the exact branch/folder upload URL immediately, for example:

```text
https://github.com/<owner>/<repo>/upload/<branch>/<staging-path>
```

Main Chat must not answer with vague instructions such as “upload it somewhere in the repo”.

### 10.3 One-action owner principle

User interaction cost is a hard operational concern.

Default goal:

```text
ONE WORK ZIP DOWNLOAD
+
ONE MULTI-FILE GITHUB UPLOAD ACTION
```

Do not stretch one transfer into multiple conversational turns or one-file-at-a-time uploads.

If a technical limitation is discovered, Main Chat must explain it immediately and choose the lowest-interaction recovery path.

### 10.4 Binary ZIP connector limitation

If Main Chat's repository connector cannot inspect/decompress a binary ZIP reliably:

- do not waste time repeatedly reading base64/binary through text tools;
- do not ask the owner to re-upload the same ZIP repeatedly;
- immediately provide the exact GitHub upload URL and ask the owner to upload all **unpacked final files together in one action**;
- once unpacked files are present, read them directly and continue QA.

If the owner has already uploaded the unpacked final files, the ZIP is no longer needed for content QA.

### 10.5 Single binary artifact exception

If Work produces only one genuine binary deliverable and no text/data sidecars are required, the owner may upload that single artifact directly. Main Chat must use an appropriate binary-capable verification path rather than forcing text transport.

Owner relay is a transport mechanism, not a reduction in analytical quality.

## 11. Publication state must remain explicit

Keep separate:

```text
LOCAL_ARTIFACT_COMPLETE
LOCAL_QA_PASS
PUBLICATION_HANDOFF_READY
OWNER_DOWNLOAD_COMPLETE
OWNER_UPLOAD_COMPLETE
REMOTE_READBACK_PASS
REMOTE_PUBLICATION_COMPLETE
```

Do not call an artifact durably accepted before remote readback.

## 12. Mandatory Work return gate

Main Chat checks:

1. source/input manifest;
2. current base/head compatibility;
3. row counts and joins;
4. lineage/provenance preservation;
5. mandatory fields;
6. silent row loss = 0;
7. HOLD/ERROR/UNRESOLVED handling;
8. known-failure regression matrix;
9. step-specific semantic/adversarial QA;
10. output identities/hashes/readback;
11. claim boundaries;
12. downstream readiness.

Only then can Work output become current authority.

## 13. No ordinary-chat fallback by quality reduction

If Work is required but cannot run:

```text
DO NOT SUBSTITUTE A SAMPLE
DO NOT PROCESS FIRST-N AND CALL IT COMPLETE
DO NOT SUMMARIZE AWAY THE MISSING DATA
```

Allowed responses:

- `WORK_EXECUTION_REQUIRED / BLOCKED`;
- split into complete independently valid units only when the roadmap/method explicitly permits it without loss of global coherence.

## 14. Explicit operating model for this project

Owner instruction adopted:

```text
THIS CHAT COLLECTS / CONTROLS / PERSISTS EVIDENCE
THIS CHAT WRITES THE WORK PROMPT
WORK ANALYZES + SYSTEMATIZES + TRANSFORMS LARGE DATA
WORK RETURNS MULTI-FILE RESULTS AS ONE DOWNLOADABLE ZIP
MAIN CHAT PROVIDES THE EXACT GITHUB STAGING UPLOAD URL
OWNER UPLOADS ALL UNPACKED FINAL FILES TOGETHER IN ONE ACTION
THIS CHAT QA'S, REDISTRIBUTES IF NEEDED, AND ACCEPTS THE RETURN
```

This is the default large-data architecture for the remainder of the Octoport SEO roadmap.
