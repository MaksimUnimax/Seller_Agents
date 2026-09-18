# Octoport SEO — M4A R2 execution release

Date: 2026-09-18
Status: **SUSPENDED / DO NOT START OR RESUME / R06 INPUT AUTHORITY HOLD**
WORK_ID: OCTOPORT_SEO_M4A_HARDENED_2026-09-18_R2
Preparation base HEAD: 2612c3268de5d8fd30221057e10ad552f15bd37d

## Release purpose

Execute the complete M4A hardened analysis frozen in:
M4A_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18_R2.md

This is an execution release, not a methodology document.

## Frozen authority identities

Key current authorities at preparation time:

- LEVEL1/README.md blob: 4c3a30644ac736b926ec82bba6b1a6e33434ac06
- LEVEL2/README.md blob: ec939e4e1dd853f72427f8b4ee9021a0bcf856d4
- LEVEL2/OCTOPORT_STEP_RULES_INDEX.md blob: a3255ef77fb9e35563efbc8697fdb9f4bb6ffd63
- LEVEL2/OCTOPORT_KW002_RULE_TRANSFER_AUDIT_2026-09-18.md blob: c2b1ae95d26c3893f2ead70dd748662be51a943c
- LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md blob: bd92f68f8aba2bb4fc2aa0c8e659442c8dcd8218
- LEVEL2/OCTOPORT_M0_M3_COMPLETED_STAGE_KW002_RETRO_AUDIT_2026-09-18.md blob before R0 follow-up: 9140a41d4505644132b3bba25879e2c7211959d9
- evidence/M0_SCOPE_SOURCE_RETRO_CONSOLIDATION_2026-09-18.md blob: cd79ac5189631b7083694c5903f66eb18cd525de
- serp/M3_QUERY_MATRIX_2026-09-16.md blob: 16c3c22019d514402f164e0505be48d608acf156
- serp/SERP_PROGRESS.md blob: 721fd650575a6765564f14bf165f9c675b8270ac
- serp/M3_METHOD_RETROSPECTIVE_AND_CONTROL_DEBT_2026-09-18.md blob: 60a1b6de5c660733a0d2ea4d25d7fc56d84c5b99
- work/M2R_RECONCILIATION_MAIN_CHAT_RETURN_QA_2026-09-17.md blob: 58af2c3c9c1c1dd9afa6ebf37692a553d5c0ee63

The current live branch may advance by publication of this release set itself. Work uses the live HEAD at execution start and performs the bounded drift policy below.

## Frozen query authority

15 queries:
S01,S02,S03,R01,R02,R03,R04R1,R05,R06,R07,R08,R09,R10,R11,R12.

20 accepted rows per query.
300 accepted occurrences.
105 unique unordered query pairs.

Original R04 = historical / non-authority / zero accepted rows.

## Frozen input location policy

Accepted evidence must be resolved from current:
- docs/seo/serp/exports/**
- docs/seo/serp/analysis/**
- docs/seo/serp/raw/** only where provenance/authority identity requires it.

Work must not add or replace inputs from web search.

## Narrow drift preflight for Work

At startup:

1. fetch current remote branch and record live HEAD;
2. verify this release file, the R2 gate and R2 Work prompt are present;
3. verify the frozen 15-query authority is still current;
4. verify no governing M3/M4 authority or accepted M3 evidence has materially changed since release preparation;
5. verify exactly one accepted 20-row authority can be resolved for every query;
6. if material authority/evidence drift exists, STOP with AUTHORITY_DRIFT / HOLD;
7. otherwise execute.

This is NOT permission to redo Main Chat governance, external research or roadmap decisions.

## Forbidden execution expansion

No external web/vendor browsing.
No Search calls.
No Wordstat calls.
No Alice/GenSearch calls.
No product-fact inference.
No final clustering/page/URL/H1/Title/IA.

## Return

Exactly 11 deliverables defined in the R2 gate.
One ZIP.
No repository write from Work.
Owner uploads unpacked files once to:
docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R2/

Main Chat owns return QA and acceptance.


## Suspension — 2026-09-18

Work input-integrity preflight detected the R06 durable-export transport defect recorded in:

`../raw/R06_09_TRANSPORT_INTEGRITY_INCIDENT_2026-09-18.md`

This release is no longer executable even after R06 repair.

After recovery Main Chat must issue a new M4A release revision with the repaired/recovered R06 authority explicitly frozen.
