# M2 Wordstat phrase-volume accounting

Date: 2026-09-16.
Status: **CURRENT VOLUME ACCOUNTING / B01+B02**.
Scope: all 30 persisted Wordstat acquisition calls under `docs/seo/wordstat/raw/`.

## Purpose

Make the current semantic-acquisition volume explicit before further SERP/competitor/Alice work. This document counts phrase rows actually preserved in Wordstat evidence and distinguishes direct `results[]` phrases from broad/noisy `associations[]` phrases and from seed phrases that were queried but not echoed in arrays.

This is a volume ledger, not a final semantic core and not a relevance classification.

## 1. Acquisition calls

- B01 broad discovery calls: `15`.
- B02 targeted product-fit calls: `15`.
- total Wordstat calls: `30`.

## 2. Provider-returned row volume

### B01

- `results[]` raw row occurrences: `186`;
- unique exact `results[]` phrases: `185`;
- `associations[]` raw row occurrences: `143`;
- unique exact association phrases: `130`;
- all returned B01 row occurrences: `329`;
- all exact unique B01 returned phrases: `315`.

### B02

- `results[]` raw row occurrences: `20`;
- unique exact `results[]` phrases: `19`;
- `associations[]` raw row occurrences: `245`;
- unique exact association phrases: `152`;
- all returned B02 row occurrences: `265`;
- all exact unique B02 returned phrases: `171`.

### B01+B02 combined

- direct `results[]` row occurrences: `206`;
- direct exact unique `results[]` phrases: **`185`**;
- association row occurrences: `388`;
- exact unique association phrases: **`228`**;
- all provider-returned row occurrences: **`594`**;
- all exact unique provider-returned phrases after deduplication: **`413`**.

Important: B02 was a targeted remeasurement/refinement pass. Its direct result phrases mostly repeat phrases already discovered in B01, so it substantially improved confidence/intent routing but did not materially enlarge the direct phrase universe.

## 3. Seed phrases not echoed by provider arrays

There were `30` exact seed/probe phrases across B01+B02. Ten of them were not present in any returned `results[]`/`associations[]` row and therefore add ten tested phrase strings to the observed universe:

- `chatgpt для ozon`;
- `chatgpt для wildberries`;
- `аналитика маркетплейсов с ии`;
- `ии агент для селлера`;
- `ии анализ продаж маркетплейсов`;
- `ии для wildberries`;
- `ии для озон`;
- `ии помощник селлера`;
- `как использовать ии для маркетплейсов`;
- `подключить ии к маркетплейсу`.

Therefore:

- direct phrase universe = unique `results[]` + non-echoed tested seeds = **`195` unique phrase strings**;
- broad observed/tested universe = all unique provider-returned phrases + non-echoed tested seeds = **`423` unique phrase strings**.

## 4. What the numbers mean

`195` is the meaningful current size for the direct Wordstat lexical pool before relevance/intent cleanup. It includes both product-fit phrases and a large amount of card/image/content-generation wording.

`423` is the wider raw observation universe if broad `associations[]` are also counted. Associations are not equivalent to candidate SEO keywords: many are obviously unrelated/noisy navigation/entity terms such as marketplace misspellings, generic "market" terms, unrelated neural-network phrases, etc. They must remain evidence but must not inflate the apparent semantic-core size.

`594` is raw returned row-occurrence volume before deduplication; it is not the number of unique phrases.

## 5. Comparison with the prior ~2,840-phrase windows semantic project

The current Octoport acquisition is materially smaller:

- direct Wordstat phrase universe: `195`, about `6.9%` of 2,840;
- broad observed/tested universe including associations: `423`, about `14.9%` of 2,840.

This comparison does **not** imply that Octoport should also have exactly 2,840 phrases: the products and search markets differ. It does show that the current M2 acquisition is an initial/narrow semantic discovery layer, not a thousands-row comprehensive raw core.

## 6. Completeness implication

Current M2 remains valid for its actual purpose: discover major lexical families and release representative SERP intent checks. However the phrase-volume accounting shows that we must not describe the current Wordstat corpus as a complete final semantic universe.

Completeness must be built through the planned evidence loop:

`M3 Search -> M4 competitor corpus -> M5 Alice -> M6 explicit gap acquisition -> M7 freeze -> M8 full semantic master`.

If M3-M5 expose materially new lexical families, M6 must run targeted new Wordstat acquisition. The acquisition goal is information completeness, not reaching an arbitrary phrase quota.

## 7. Work trigger

Current accounting corpus is small enough for complete Main Chat treatment:

- `423` exact unique observed/tested phrase strings at the broadest level;
- no sampling was needed to produce this accounting.

`WORK_TRIGGER_FOR_CURRENT_COUNTING = NOT MET`.

If later gap expansion / competitor / Alice evidence grows the unified corpus to a scale where full deduplication, lineage reconciliation or classification cannot be safely completed here without truncation, hand the complete corpus to ChatGPT Work under `WORK_HANDOFF_RULE.md` rather than sampling it.