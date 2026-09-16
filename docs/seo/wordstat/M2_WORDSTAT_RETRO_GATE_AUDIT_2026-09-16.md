# M2 Wordstat retrospective gate audit

Date: 2026-09-16.
Status: **PASS WITH EXPLICIT HISTORICAL PERSISTENCE LIMITATION / NO PROVIDER REPLAY REQUIRED**.
Scope: B01 + B02 already executed Wordstat acquisition, reviewed under the newly adopted Octoport/KW-002 execution rules.

Authorities:

- `../EXECUTION_RULES.md`;
- `../STAGE_GATES_M0_M7.md`;
- `../WORK_HANDOFF_RULE.md`;
- `BATCH_01_SYNTHESIS_2026-09-16.md`;
- `BATCH_02_SYNTHESIS_2026-09-16.md`;
- `raw/B01_*.md`;
- `raw/B02_*.md`.

## 1. Why this audit exists

B01/B02 were executed before the full KW-002 Step00–06 rule set was adopted locally. The provider observations remain real evidence; this audit checks whether the historical collection is sufficient and honest for downstream SEO work under the stricter current rules.

Hard migration principle:

```text
NEW STRICTER PROCESS RULE
!= AUTOMATIC REPLAY OF VALID HISTORICAL PROVIDER CALLS
```

Replay is justified only if a concrete current decision lacks material evidence and a new information-gain contract proves the need.

## 2. Fresh provider-method check

Checked 2026-09-16 against current official Yandex documentation.

### Official GetTop contract

Source: Yandex AI Studio — Wordstat.GetTop  
`https://aistudio.yandex.ru/en/docs/search-api/api-ref/Wordstat/getTop`

Current facts used by this audit:

- GetTop returns last-30-days data for popular queries containing the phrase and similar queries;
- `numPhrases` accepts `1..2000`;
- request includes phrase, regions, devices, folder;
- response can contain `totalCount`, `results[]`, `associations[]`.

### Official GetTop operation example

Source: Yandex AI Studio — Getting top results by key phrase  
`https://aistudio.yandex.ru/ru/docs/search-api/operations/wordstat-gettop`

Confirms maximum `numPhrases=2000`, `DEVICE_ALL`, region controls and result structure.

### Operators

Source: Yandex Wordstat — Operators  
`https://yandex.ru/support2/wordstat/ru/content/operators`

Confirms operator choices alter the measurement scope. The historical B01/B02 queries were broad unquoted discovery/targeted phrases; this audit does not retroactively reinterpret them as exact-form measurements.

## 3. B01 raw-persistence inventory

Historical B01 contains 15 calls.

### Classification

`B01-15` is the first file stored as the complete received `WORDSTAT_RESULT_V1` envelope in one literal evidence block.

`B01-01` through `B01-14` were created before that stricter local format. They preserve structured provider provenance and the factual Wordstat result body supplied to the project, but are **not byte-/format-identical full top-level bridge envelopes**.

Examples verified during this audit:

- B01-01 preserves request/provenance plus literal transcription of all supplied `result.results`, `result.associations` and `totalCount`;
- B01-03 preserves that the provider result contained only `totalCount: "20"` and no result/association arrays;
- B01-05 through B01-09 preserve literal result and association tables plus `totalCount` and request provenance;
- B01-10/B01-11 preserve the supplied totalCount-only result truth;
- B01-12/B01-13 preserve exact empty `result:{}` meaning and explicitly do not convert missing totalCount to zero;
- B01-14 preserves the supplied result/association rows and totalCount;
- B01-15 preserves the full received envelope.

### B01 inventory table

| Call | Seed | Durable semantic body | Provenance | Full top-level envelope | Current use |
|---|---|---|---|---|---|
| B01-01 | `ии для маркетплейсов` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-02 | `нейросеть для маркетплейсов` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-03 | `ии помощник селлера` | totalCount-only result preserved | present | no, structured transcription | usable |
| B01-04 | `аналитика маркетплейсов с ии` | totalCount-only result preserved | present | no, structured transcription | usable |
| B01-05 | `ии для ozon` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-06 | `ии для озон` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-07 | `ии для wildberries` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-08 | `ии для вайлдберриз` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-09 | `chatgpt для маркетплейсов` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-10 | `chatgpt для ozon` | totalCount-only result preserved | present | no, structured transcription | usable |
| B01-11 | `chatgpt для wildberries` | totalCount-only result preserved | present | no, structured transcription | usable |
| B01-12 | `ии анализ продаж маркетплейсов` | literal empty result object preserved | present | no, structured transcription | usable with empty-result boundary |
| B01-13 | `подключить ии к маркетплейсу` | literal empty result object preserved | present | no, structured transcription | usable with empty-result boundary |
| B01-14 | `сервис аналитики маркетплейсов` | result rows + associations + totalCount | present | no, structured transcription | usable |
| B01-15 | `как использовать ии для маркетплейсов` | complete result | present | **yes** | usable / exact-envelope |

### B01 conclusion

```text
B01_PROVIDER_OBSERVATIONS_LOST = 0 identified
B01_SEMANTIC_RESULT_BODY_REQUIRED_FOR_CURRENT_ANALYSIS = DURABLE for all 15
B01_EXACT_FULL_ENVELOPE_FILES = 1/15
B01_STRUCTURED_TRANSCRIPTION_FILES = 14/15
B01_HISTORICAL_STRICT_PERSISTENCE_CONFORMANCE = FAIL
B01_CURRENT_SEMANTIC_USABILITY = PASS WITH DOCUMENTED LIMITATION
```

The missing exact wrapper representation for B01-01..14 is a provenance/persistence-format debt, not currently a semantic-data loss requiring paid replay. Their preserved request IDs/parameters/statuses and factual result bodies are enough for the current semantic evidence role unless a later audit discovers a concrete missing field needed for a material decision.

## 4. B02 raw-persistence inventory

B02 was executed after the owner hardened the persistence rule.

All 15 calls were handled as:

```text
complete received WORDSTAT_RESULT_V1 envelope
-> GitHub raw file
-> remote readback
-> separate analysis
-> progress update
-> next call
```

Spot-check authority B02-01 confirms complete top-level envelope + full `results[]`, `associations[]`, `totalCount`, command/policy/cost/status fields. B02-15 correctly preserves its unusual `result` containing only `totalCount:"4"` without inventing arrays.

```text
B02_CALLS = 15
B02_FULL_ENVELOPE_RULE = PASS
B02_REMOTE_READBACK_PER_EXECUTION = PASS by execution ledger
B02_SEMANTIC_USABILITY = PASS
```

## 5. Seed/probe-quality retrospective

### B01

B01 was intentionally broad across independent vocabulary axes rather than a list of pre-decided final keywords:

- generic AI/category;
- neural-network wording;
- seller/helper role;
- analytics;
- Ozon Latin/Cyrillic;
- Wildberries Latin/Cyrillic;
- ChatGPT pairings;
- sales/task wording;
- integration wording;
- adjacent analytics-service category;
- informational how-to.

This satisfies the current principle that discovery probes must cover different search-language hypotheses rather than simply mirror product taxonomy.

High-noise broad roots (`ии для маркетплейсов`, `нейросеть для маркетплейсов`) were not promoted to final targets; their noise led to B02 refinements. This is exactly the current broad-control/refinement pattern.

### B02

B02 was derived from product-adjacent B01 observations and named unresolved questions:

- generic `ИИ-агент` category;
- work/sales/analytics tasks;
- assistant wording;
- manager-role wording;
- Ozon agent/assistant;
- Wildberries agent;
- analytics-service/internal-analytics variants;
- noisy help wording decomposition;
- comparison wording;
- seller-agent controlled variant.

B02 therefore has incremental information gain over B01 and is not duplicate acquisition for convenience.

### Seed-quality verdict

```text
BUSINESS/CAPABILITY COVERAGE = PASS
SEARCH-LANGUAGE DIVERSITY = PASS
BROAD-CONTROL vs REFINEMENT LOGIC = PASS
COST-ONLY DEFERRAL = not identified
SEED_USED_AS_FINAL_PAGE_PROOF = 0
SEED_QUALITY_RETRO_GATE = PASS
```

## 6. Depth/coverage retrospective

Historical calls used:

```text
method = getTop
numPhrases = 2000
region = 225
DEVICE_ALL
```

Current official provider maximum is still 2000.

Retrospective interpretation:

- for B01 broad discovery, choosing the maximum reduced avoidable discovery truncation risk and did not reduce data quality;
- for B02 targeted probes, 2000 was more than the returned relevant row volume required, but provider billing is per request rather than per returned row in the bridge cost model used here; using the same depth maintained a consistent observation ceiling;
- none of the preserved B01/B02 `results[]` arrays inspected approaches 2000 rows, so there is no evidence that a returned row list hit the request-depth boundary;
- `totalCount` is a query-demand count, **not** the number of returned result rows and must not be interpreted as depth saturation.

Therefore no current depth-boundary replay is justified.

Future Wordstat calls must receive a fresh job-specific depth contract rather than blindly reusing 2000.

```text
HISTORICAL_DEPTH_CAUSED_KNOWN_TRUNCATION = false
DEPTH_REPLAY_REQUIRED_NOW = false
FUTURE_DEPTH_AUTOMATICALLY_2000 = false
DEPTH_RETRO_GATE = PASS
```

## 7. Empty/low-result truth

Historical states remain distinct:

- B01-12 and B01-13: valid provider response with `result:{}` and no totalCount — **not numeric zero**;
- low totalCount responses: observed bounded demand values, not automatic exclusion;
- B02-15: `result` with `totalCount:"4"`, not empty result.

No technical/error state is converted to negative semantic evidence.

## 8. Does the historical persistence limitation require replay?

Current decision: **NO**.

Reason:

1. the factual Wordstat bodies required for current demand/lexical analysis are durable;
2. request/provenance parameters needed to interpret those bodies are recorded;
3. B02 already remeasured the most important product-fit branches under the stricter exact-envelope rule;
4. ordinary Search, competitor and Alice evidence will now test intent/page structure independently;
5. replaying 14 calls merely to reconstruct an exact wrapper adds little current information and would violate the information-gain rule.

Reopen/replay trigger:

```text
A LATER MATERIAL DECISION REQUIRES A FIELD NOT DURABLY PRESERVED
OR
NEW SEARCH/COMPETITOR/ALICE EVIDENCE REVEALS AN UNMEASURED PRODUCT-FIT LEXICAL FAMILY
OR
CURRENT PROVIDER/METHOD CHANGE MAKES A NEW SNAPSHOT ANALYTICALLY NECESSARY
```

Then create a fresh current request with new identity/provenance; never pretend it is the old response.

## 9. Work trigger evaluation

This retrospective audit is an inventory/method QA over 30 bounded Wordstat call artifacts, not a full multi-megabyte row-level semantic transformation.

```text
CURRENT_RETRO_AUDIT_WORK_TRIGGER = NOT MET
```

The later complete cross-source semantic transformation at M8 **does trigger/expect Work W1** if the frozen evidence corpus is large enough to risk incomplete ordinary-chat analysis, as already mandated by `WORK_HANDOFF_RULE.md`.

## 10. Known-failure regression matrix

| Failure class | Check | Result |
|---|---|---|
| seed mistaken for final page | B01/B02 remain acquisition evidence only | PASS |
| broad noisy seed promoted as category truth | broad AI/neural roots explicitly marked contaminated | PASS |
| provider success without durable semantic body | factual body found durable for all B01/B02 calls | PASS for semantic feed-forward |
| historical strict-envelope compliance | B01-01..14 lack exact full envelope storage | KNOWN LIMITATION |
| empty result treated as zero | B01-12/13 remain empty-object observations | PASS |
| totalCount mistaken for result-row count/depth | explicitly separated | PASS |
| max depth treated as permanent rule | future calls require fresh depth gate | PASS |
| unnecessary replay | no replay without information-gain trigger | PASS |
| cost overrides evidence quality | not identified in B01/B02 decision sequence | PASS |
| large-data sampled for convenience | not used in this bounded audit; future full-volume Work rule active | PASS |

## 11. Quality score

Each criterion is 0–10.

| Criterion | Score | Basis / lost points |
|---|---:|---|
| Goal/output completeness | 10.0 | Seed/depth/persistence/replay decision all covered. |
| Method/source support | 10.0 | Current official Yandex contract checked plus local KW-002-derived gates. |
| Input evidence/provenance integrity | 8.5 | Early B01 has structured transcription rather than exact full envelope. |
| Coverage/completeness | 9.5 | Strong independent vocabulary coverage; future M3–M5 can still expose legitimate new gaps. |
| Analytical correctness/claim boundaries | 10.0 | Empty/low/count/depth semantics explicitly bounded. |
| Adversarial QA quality | 9.0 | Persistence and seed/depth failure classes challenged; no need for full semantic Work yet. |
| Persistence/readback/reproducibility | 8.5 | B02 strong; B01 early historical format debt remains. |
| Owner usability/plain language | 10.0 | Limitation and replay decision are explicit. |
| Information gain/cost/execution efficiency | 10.0 | Avoids low-value replay and preserves gap-trigger model. |
| Downstream readiness | 9.5 | Safe to continue collection; M7 still requires Search/competitor/Alice evidence. |

```text
QUALITY_TOTAL = 95.0 / 100
QUALITY_SCORE = 9.5 / 10
```

Hard gate assessment:

```text
CRITICAL_CURRENT_SEMANTIC_EVIDENCE_LOSS = 0 identified
HISTORICAL_STRICT_PERSISTENCE_NONCONFORMANCE = documented / accepted limitation
BLIND_REPLAY_REQUIRED = false
NEXT_STAGE_COLLECTION_ALLOWED = true
```

## 12. Verdict

```text
M2_RETRO_GATE_AUDIT = PASS_WITH_EXPLICIT_LIMITATION
B01_B02_PROVIDER_REPLAY_REQUIRED = false
B01_01_TO_14_MAY_BE_CALLED_EXACT_FULL_ENVELOPES = false
B01_15_EXACT_FULL_ENVELOPE = true
B02_01_TO_15_EXACT_FULL_ENVELOPE_PROCESS = true
M3_CONTINUATION_ALLOWED = true
M7_COLLECTION_FREEZE = still blocked on M3-M6 and the remaining collection gates
```

Plain meaning: the early B01 storage format was weaker than the rule we now require, but the actual Wordstat phrases/counts/associations and request context needed for current SEO research were not found missing. Re-running those paid calls solely to reproduce wrapper formatting would add no useful market information. We preserve the limitation honestly and move forward; any genuinely new missing market question will be measured as a new request under the stricter rules.
