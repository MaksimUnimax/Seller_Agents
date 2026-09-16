# S04 pre-step research and bounded release — `какой ии для маркетплейсов`

Date: 2026-09-16.
Stage: `M3 — Ordinary Yandex SERP collection`.
Status: **PREPARED / OWNER-FACING ANALYSIS REQUIRED BEFORE EXECUTION**.

## 1. Whole roadmap position

Current evidence cursor:

- M0 product truth — PASS;
- M1 current-site/source baseline — PARTIAL, live measurement surfaces still open;
- M2 Wordstat — PASS with historical B01 persistence limitation documented;
- M3 ordinary Yandex SERP — IN PROGRESS;
- S01 generic agent category — CLOSED / 20;
- S02 Ozon agent — CLOSED / 20;
- S03 Wildberries agent — CLOSED / 20;
- S02 vs S03 paired comparison — COMPLETE / 40 of 40 rows, no sampling, `MIXED` split/merge implication;
- M4 preliminary competitor registry — active;
- M5 Alice — not started;
- M6 gap acquisition — blocked;
- M7 Collection Freeze — blocked;
- M8+ semantics/pages — blocked until M7.

## 2. S04 goal

Query: `какой ии для маркетплейсов`.
Wordstat context: B02 observed `totalCount=128`, no child results in that response.

Open question:

Does the phrase express a comparison/discovery/commercial-investigation task where users expect rankings, recommendations, guides and alternative evaluation, or does Yandex mostly map it back to generic product/category pages or content-generation tools?

S04 must determine the dominant current result/page types and decision criteria users are being served before any later content/page-role decision.

This step does not create a comparison landing, does not define a final target page and does not authorize unsupported superiority claims.

## 3. Why existing evidence is insufficient

S01-S03 establish agent-category and marketplace-specific operational intent. They do not answer a different user task: `какой` asks for help choosing/evaluating an AI solution.

The same broad vocabulary may produce:

- recommendation/ranking articles;
- product comparisons;
- vendor category/product pages;
- tutorials;
- videos;
- card/content-generation lists;
- forum/discussion surfaces;
- mixed intent.

Without S04, using S01-S03 to infer the correct format for a choice/comparison query would be methodologically unsafe.

## 4. Fresh external research checked 2026-09-16

### Official Yandex — query selection / market analysis

URL: https://yandex.ru/support/webmaster/ru/service/queries-selection

Current guidance supports:

- clustering by semantic/user-intent proximity;
- separate demand, clicks and competition measures;
- inspecting popular sites and pages for selected query groups;
- discovering additional/non-obvious formulations.

Project application:

Classify S04 by the actual pages Yandex ranks, not by assuming `какой` is automatically commercial. Record page type, decision format and recurring sites/pages.

### Official Yandex — EPOS / task usefulness

URL: https://yandex.ru/support/webmaster/ru/epos

Current Yandex guidance frames usefulness around whether a page helps the user solve a task, including understanding a topic or making a decision/choosing a product, while also emphasizing relevance, expertise, originality and substantive completeness.

Project application:

If S04 is truly choice/comparison intent, later content must help the user make a decision with meaningful criteria and product-truth-grounded distinctions, not publish a thin SEO listicle.

### Official Yandex — search quality

URL: https://yandex.ru/support/webmaster/ru/search-quality

Current guidance says Search tries to save user time and evaluates the usefulness of results/overall SERP around task resolution.

Project application:

Record whether top S04 pages resolve the choice task quickly through lists, criteria, comparisons, recommendations, reviews, product pages or other formats.

### Semrush — commercial intent keywords

URL: https://www.semrush.com/blog/commercial-intent-keywords/

Industry corroboration: commercial-investigation queries are used to research products/services before a purchase decision and often surface roundups, buying guides, comparisons and reviews.

Boundary: this is general industry practice, not Yandex-specific authority and not proof that S04 itself is commercial before observing its SERP.

### Ahrefs — SERP analysis / search intent

URLs:

- https://ahrefs.com/blog/serp-analysis/
- https://ahrefs.com/blog/search-intent/

Industry corroboration: dominant intent should be inferred from the content/page types that actually rank; mixed intent is common, and SERP page type/format is evidence for what searchers expect.

Boundary: no automatic universal intent label or page template is imported from Ahrefs.

## 5. Source -> method trace

| Method question | Authority | S04 action | Boundary |
|---|---|---|---|
| Is `какой` actually comparison intent? | Yandex query-intent clustering + observed SERP | classify all 20 ranked pages by real task/page format | wording alone is insufficient |
| What page format is rewarded? | Yandex popular pages + Ahrefs SERP analysis corroboration | count product/landing, roundup, guide, comparison, video, discussion, noise | result mix is snapshot, not permanent law |
| What makes later comparison useful? | Yandex EPOS/search quality | extract decision criteria and useful distinctions | do not create page yet |
| Is there commercial investigation? | observed Yandex SERP + Semrush corroboration | mark recommendation/evaluation signals | industry label does not override Yandex evidence |
| Which sites are competitors? | Yandex popular sites/pages principle | update recurring registry from actual ranks | business rival != search competitor |

## 6. S04 full-row analysis contract

For every top-20 result capture:

- rank / URL / domain / title / snippet;
- page type: product/landing, roundup/ranking, comparison, guide, article, video, discussion, official, noise;
- primary user job: choose, compare, learn, generate content, connect data, automate, analyze;
- number/list/ranking language (`топ`, `лучшие`, `обзор`, `сравнение`, `выбрать`);
- product/vendor count if visible;
- whether the page gives explicit selection criteria;
- seller/API/data/operations relevance;
- marketplace coverage Ozon/WB/generic;
- LLM/agent/assistant/neural-network vocabulary;
- read-only vs mutation-heavy promises;
- card/content-generation contamination;
- recurrence against S01-S03;
- new competitor / new lexical-family signal.

## 7. Outcome contract

### SUCCESS_WITH_RESULTS

Classify all rows and assign provisional dominant intent:

`COMMERCIAL_INVESTIGATION | INFORMATIONAL_DISCOVERY | PRODUCT_CATEGORY | MIXED | NOISE_DOMINATED | HOLD`.

The result may change which future Page Job hypotheses deserve later clustering/M11 consideration, but cannot create a page before M7.

### SUCCESS_WITH_ZERO

Bounded zero only for exact query/settings/snapshot. It weakens this exact probe but does not erase the broader comparison/discovery family or Wordstat evidence.

### TECHNICAL/VALIDATION/UNKNOWN

No semantic conclusion. Persist truth. No blind retry.

## 8. Provider contract

Keep the same paired M3 settings for comparability:

- Search RU;
- region 225;
- page 0;
- 20 flat groups;
- one doc/group;
- moderate family mode;
- typo correction off;
- relevance descending;
- maxRequests 1;
- maxCostRub 0.0305.

## 9. Bridge capability gate

Observed current runtime identifies itself as YMB `0.1.9`.

Empirical S03 runtime evidence proves the currently installed runtime can complete the same bounded lifecycle needed by S04: accepted `submitN`, explicit `collectN`, terminal success and revision-bound `exportPage`. A transient local `MANUAL_OPERATION_ACTIVE` admission lock was observed and recovered without duplicate provider execution.

Committed source authority for exact `0.1.9` remains unresolved; therefore no behavior beyond empirically observed commands is assumed. Any new 0.1.9-specific admission/error code must be preserved and reconciled before retry.

## 10. Work trigger

Expected acquisition unit: one top-20 SERP.

`WORK_TRIGGER = NOT MET`.

S04 itself must be analyzed in Main Chat in full. Large cross-query/corpus analysis later goes to Work if full-volume treatment becomes unsafe; never sample merely for context convenience.

## 11. Hard gates before first Bridge command

- S03 evidence closure/readback — PASS;
- fresh S04 external research — PASS;
- owner-facing clickable-source analysis — REQUIRED;
- source-to-method trace — PASS;
- information-gain/outcome contract — PASS;
- provider settings — PASS;
- current Bridge empirical capability — PASS with `0.1.9 source authority unresolved` limitation;
- Work trigger evaluated — PASS;
- no S04 provider call yet — true.

## 12. Quality score

| Criterion | /10 |
|---|---:|
| Goal/output definition | 10.0 |
| Fresh external method support | 9.5 |
| Evidence/provenance readiness | 10.0 |
| Distinct information gain | 9.5 |
| Intent/page-format analysis design | 10.0 |
| Adversarial/noise controls | 9.5 |
| Product-truth boundaries | 10.0 |
| Work/data-volume compliance | 10.0 |
| Reproducibility/provider bounds | 9.5 |
| Downstream readiness | 9.0 |

`QUALITY_TOTAL = 97/100`
`QUALITY_SCORE = 9.7/10`

Main limitation: exact committed source authority for installed YMB 0.1.9 is unresolved, so execution relies only on empirically demonstrated bounded lifecycle behavior.

## 13. Plain-language summary

S04 is not another agent keyword. It asks a new question: when a seller searches `какой ИИ`, what kind of answer does Yandex think they need? If top results are rankings/comparisons/guides, we have a real choice/commercial-investigation intent. If generic product pages or card generators dominate, the hypothesis changes. We will inspect all 20 results, not samples, and extract the criteria and page formats without designing the final Octoport page yet.

No Bridge command is released until this analysis is disclosed to the owner and the release artifact is read back.