# Octoport SEO — M4A R3 execution release

Date: 2026-09-18
Status: **AUTHORIZED / REMOTE READBACK PASS / WORK MAY START**
WORK_ID: `OCTOPORT_SEO_M4A_HARDENED_2026-09-18_R3`
Preparation base HEAD: `e9aff98a7bae66a1565c38f4f078fbd0c19b3604`

## Release purpose

Execute the complete M4A hardened analysis frozen in:

`M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18_R3.md`

R3 exists because R2 correctly found an R06 historical transport-integrity defect. That defect has now been repaired provider-free and accepted by Main Chat.

## R06 current authority — mandatory

Use:

- `../raw/recovery/R06_2026-09-18/R06_10_RECOVERED_EXPORT_MANIFEST_2026-09-18.md`
- its seven recovery chunks;
- `../raw/recovery/R06_2026-09-18/R06_11_RECOVERY_QA_2026-09-18.md`.

Required R06 identity:

```text
SOURCE_BYTES = 73385
SOURCE_SHA256 = 78759292ba7f23ad741329cc631b9ec90b26abcff4e0b97fc81ff5289d0708f6
GZIP_BYTES = 20604
GZIP_SHA256 = f764c509f47f0a53a33b90a7c3dc5c8f61d62137da1b339360acb9c844a1b608
JOB_ID = octoport-serp-r06-20260917
REVISION = 5
OPERATION_ID = sprdv3pu6m66t214aidj
RESULT_COUNT = 20
RANKS = 1..20
```

Forbidden current authority:
`../raw/R06_08_EXPORT_MANIFEST_2026-09-17.md` exact source/gzip identity.

## Frozen M4A execution unit

- 15 accepted queries;
- 20 rows each;
- 300 occurrences;
- 105 unique unordered Top10 pairs;
- original R04 excluded;
- R04R1 accepted;
- no provider calls;
- no external vendor browsing;
- no final cluster/page decisions.

## Narrow Work preflight

Work:
1. fetches current remote HEAD;
2. verifies R3 gate/release/prompt identity;
3. verifies the 15-query authority set;
4. validates R06 recovery exactly as above;
5. resolves other accepted M3 exports/provenance;
6. HOLDs on material drift or input ambiguity;
7. otherwise executes the R3 prompt.

Work does not redo Main Chat governance or external method research.

## Return

Exactly 11 final deliverables from the R3 gate.

One ZIP, no repository write from Work.

Owner uploads all 11 unpacked files once to:

`docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R3/`

Main Chat owns return QA and acceptance.
