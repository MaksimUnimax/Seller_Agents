# M3 method retrospective and control debt

Date: 2026-09-18  
Status: **PRIMARY ORGANIC ACQUISITION ACCEPTED / CONTROL DEBT OPEN UNTIL M6**  
Roadmap authority: `../SEO_MASTER_ROADMAP_2026-09-16.md`

## Scope

This retrospective evaluates the completed M3 ordinary Yandex Search pass without rewriting or discarding its accepted organic evidence.

Accepted primary corpus:

- S01–S03;
- R01–R12;
- R04R1 is authority for R04;
- final M3 close commit: `8eba5e3371f029812bd480076b0570af317e960b`.

## Method assessment

Overall method score at retrospective: **8.3/10**.

Strong areas:

- evidence-first query selection;
- consistent top-20 organic acquisition;
- exactly-once/lifecycle discipline;
- durable raw/export persistence and readback;
- result-by-result intent analysis;
- preservation of mixed intent;
- clean rerun of unreliable R04;
- no premature page architecture.

Control gaps:

1. XML/organic evidence was treated too close to “SERP” completeness.
2. No explicit device/browser sensitivity acceptance.
3. No bounded regional sensitivity beyond Russia `225`.
4. No temporal repeat policy for ambiguous/high-value queries.
5. No complete cross-query URL/domain overlap QA before M3 closure.

## Root cause

The root cause is not missing accepted organic rows. It is an incomplete historical Definition of Done.

The execution design prioritized:

```text
organic top-20 completeness
+ intent classification
+ competitor discovery
+ exactly-once lifecycle
+ persistence/hash/readback
```

but did not require:

```text
full HTML/SERP-feature representation
+ device sensitivity
+ region sensitivity
+ temporal stability
+ cross-query overlap QA
```

Because those fields were absent from the gate, M3 passed its own old acceptance criteria even though later method review showed that “full SERP research” requires more controls.

The bridge's reliable normalized XML/organic path also shaped execution: the team optimized around the transport that was already stable and auditable. That was useful operationally but should not have been allowed to define the entire methodological boundary.

Cross-query overlap was postponed toward later clustering. That was correct for final page decisions, but it removed an early QA control that should have existed before acquisition closure.

## Why we do not replay all M3

The organic evidence remains valid for what it actually proves. A complete replay would add cost/noise without first demonstrating information gain.

M6 will run a bounded control patch. Only material differences can authorize targeted new acquisition.

## Mandatory M6 control patch

See master roadmap M6. It must cover:

- representative full-SERP HTML features;
- device/browser sensitivity where supported;
- bounded regional sensitivity;
- temporal repeat for selected ambiguous/high-value queries;
- full cross-query URL/domain overlap QA;
- explicit `NO MATERIAL CHANGE | ENRICH | REOPEN TARGETED GAP | HOLD` decisions;
- final `M3_CONTROL_DEBT` closure artifact.

## Sources

Primary:

- Yandex Search API text search and result formats: https://aistudio.yandex.ru/ru/docs/search-api/concepts/web-search
  - XML contains search results without additional elements;
  - HTML can contain ads, quick answers and other SERP elements;
  - `userAgent` can optimize results for a particular device/browser.
- Yandex Webmaster query and market analysis: https://www.yandex.ru/support/webmaster/en/service/queries-selection
  - query clustering is based on similarity in meaning/user intent;
  - region and device can be selected;
  - popular sites/pages can be analyzed for selected queries.
- Yandex Webmaster site regionality: https://www.yandex.ru/support/webmaster/en/site-geography/site-region
  - regionality can affect location-dependent search results.

Industry corroboration:

- Ahrefs keyword clustering / SERP overlap: https://ahrefs.com/blog/keyword-clustering/
  - common/similar search results are a practical signal for shared or similar search intent.

## Acceptance effect

```text
M3_PRIMARY_ORGANIC_ACQUISITION = ACCEPTED
M3_CONTROL_DEBT = OPEN
M4 = ALLOWED / CURRENT
M5 = ALLOWED AFTER M4 SELECTION
M6 = MUST CLOSE M3 CONTROL DEBT
M7 = BLOCKED UNTIL M3_CONTROL_DEBT = CLOSED
```
