# Octoport SEO — KW-002 step-rule transfer audit

Date: 2026-09-18
Status: METHOD TRANSFER AUDIT / CORRECTION AUTHORITY

## Why this audit exists

Owner required a full check that rules learned in KW-002 are transferred into every upcoming Octoport step, not rediscovered only after the same failure repeats.

Root problem found:

~~~text
ROADMAP DESCRIPTION EXISTED
BUT
DEDICATED LEVEL 2 / STEP-GATE TRANSFER WAS INCOMPLETE
~~~

A detailed roadmap is not a substitute for an executable step method.

## Sources reviewed

Current KW-002 branch:
roadmap/kwork-productization-2026-08-28

Read/reconciled:
- project README and three-layer architecture;
- LEVEL1 mandatory no-action/reread gate;
- recurring Main Chat failure checklist;
- roadmap/method generalization rule;
- method source/evidence rules;
- execution failure/anti-regression rules;
- LEVEL2 README;
- LEVEL2 STEP_RULES_INDEX Step00-22;
- inherited universal Step00-22 rules;
- dedicated Step06 Search competitor rule;
- dedicated Step07 competitor semantic expansion rule;
- concrete 2026-09-17 rule-compliance incident and corrected role-boundary QA.

## Transfer matrix

| Octoport | KW-002 analog | Previous state | Audit result / correction |
|---|---|---|---|
| M4 | Step06 + Step07 | PARTIAL | Existing M4 rule was too shallow. Must add Top3/Top10/11-20 distinction, collision control, recurrence granularity, exact-URL pairwise similarity, curated registry, authorized-competitor-only expansion, bounded full URL coverage, terminal URL states and provenance. |
| M5 | Step15 preparation | METHOD ORDER DEFECT | Previous roadmap authorized Alice collection before a Search-only semantic/page baseline existed. Corrected: M5 becomes AI diagnostic hypothesis register only; no Alice provider acquisition. |
| M6 | Step05 + Step08 + Step06 corrective controls | PARTIAL | Existing info-gain rule present, but competitor-derived demand must explicitly return through Wordstat/persistence/normalization/sanitation, and M3 controls remain mandatory. |
| M7 | Step09 + Step11 freeze boundary | METHOD ORDER DEFECT | Previous M7 required Alice evidence before Search semantic freeze. Corrected: M7 is Search-side collection freeze; Alice excluded. |
| M8 | Step09 + Step10 | PARTIAL / CONTAMINATION RISK | Previous M8 accepted Alice as semantic-master input. Corrected: M8 is Search-only semantic master and row-level relevance/task/intent/priority. |
| M9 | Step13 | ROADMAP ONLY | Rule transferred into universal index + dedicated clustering/IA gate. |
| M10 | Step14-17 | INCOMPLETE | Previous M10 reconciled Alice without an explicit frozen Search-only query->page/IA baseline. Corrected: M10A Search-only baseline, M10B case selection, M10C Alice acquisition, M10D reconciliation. |
| M11 | Step18 architecture | ROADMAP ONLY | Final page ownership/IA must consume accepted M10 delta and one canonical truth. |
| M12 | Step18 Page Jobs + Step19 | ROADMAP ONLY | Dedicated page-spec/content contract required. |
| M13 | no exact KW-002 analog | ROADMAP ONLY | Must use current Yandex/Google technical docs and preserve traceability. |
| M14 | no exact KW-002 analog | ROADMAP ONLY | Requires Octoport implementation isolation/current-main/test gates. |
| M15 | Step20 | ROADMAP ONLY | Exact-file/source/live QA must be separate from artifact existence. |
| M16 | Step20 + Step22 | ROADMAP ONLY | Launch/indexing must verify actual live/search state, not deployment success only. |
| M17 | Step21 | ROADMAP ONLY | Measurement/iteration must preserve hypothesis/change/result lineage. |
| M18 | Step20 + Step22 | ROADMAP ONLY | Finished state requires zero blocking pending actions and recoverable final authority. |

## Major corrected sequencing defect: Alice

KW-002 intentionally performs:

~~~text
SEARCH SEMANTIC FREEZE
-> CURRENT SERP
-> SEARCH CLUSTERING
-> SEARCH-ONLY QUERY->PAGE / IA
-> AI CASE SELECTION
-> AI EVIDENCE
-> SEARCH-vs-AI RECONCILIATION
-> FINAL ARCHITECTURE
~~~

Old Octoport roadmap performed Alice acquisition before Search semantic master/clustering.

Why that is dangerous:
- AI can contaminate what should be an independently auditable Search baseline;
- diagnostic cases cannot be chosen by architecture sensitivity before the architecture exists;
- later change cannot be causally classified if there is no frozen baseline;
- NO_CHANGE loses meaning if Search-only truth was never frozen.

Correction:
- M5 = hypothesis register only, no AI provider acquisition;
- M7 = Search-side freeze, no Alice requirement;
- M8/M9 = Search-only;
- M10A = Search-only page/IA baseline;
- M10B/C/D = final AI case selection, Alice evidence and reconciliation;
- M11 = final architecture.

Official Yandex current documentation supports this separation operationally: Search with Alice builds answers from content found/indexed by Yandex and cites sources; its sources can change over time. Alice visibility reporting is based on queries where the site already has sufficient Search visibility. Therefore Alice is treated as a bounded diagnostic/visibility layer, not as a replacement for ordinary Search baseline.

## Known KW-002 failures now explicitly carried forward

The following mechanisms must be regression-tested in Octoport:

1. Main Chat acts from memory instead of live rules.
2. Work trigger evaluated for the wrong execution unit.
3. Owner asked to route many files manually.
4. Sources exist only in artifact, not owner-facing report.
5. Technical PASS substitutes for owner-facing/reporting/semantic PASS.
6. Main Chat explains before reopening the exact live rule.
7. Job incident contaminates universal method.
8. Main Chat governance duplicated inside Work runtime.
9. Provider success treated as durable evidence.
10. Aggregate counts without occurrence-level reproducibility.
11. Example-only patch instead of mechanism fix/full affected rerun.
12. substring/token shortcuts used as semantic proof.
13. mechanical QA/self-score substituted for semantic QA.
14. upstream authority change leaves downstream PASS stale.
15. preliminary family/domain overlap treated as final cluster/page.
16. one Search/AI snapshot treated as permanent truth.
17. competitor page topic treated as proven demand.
18. large bounded competitor surface sampled instead of fully accounted.

## Current transfer verdict

Before this audit:

~~~text
KW002_RULE_TRANSFER_M4_M18 = INCOMPLETE
ALICE_SEQUENCE = UNSAFE / NOT EQUIVALENT TO KW002
DEDICATED_LEVEL2_AFTER_M4 = MISSING
~~~

Required corrected state:

~~~text
UNIVERSAL_STEP_INDEX = REQUIRED
HIGH_RISK_DEDICATED_LEVEL2 = REQUIRED
SEARCH_ONLY_BASELINE_BEFORE_AI_DELTA = REQUIRED
M4A_OLD_PREPARATION = STILL SUPERSEDED
NEW_M4A_PREPARATION = ONLY AFTER UPDATED LEVEL2 READ
~~~
