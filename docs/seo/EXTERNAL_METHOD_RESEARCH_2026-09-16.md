# Octoport SEO — external method research

Date: 2026-09-16.
Status: `CURRENT METHOD EVIDENCE`.
Scope: organic search, semantic architecture, landing-page design, Yandex Search + Alice AI, technical SEO and measurement.

## Purpose

This research defines the external-method boundary for Octoport. It does not decide URLs or copy by itself. Current product truth, Wordstat evidence, live SERP evidence and actual implementation state remain project authority.

## Primary sources

### Official Yandex

- `https://yandex.ru/support/webmaster/ru/epos`
- `https://yandex.ru/support/webmaster/ru/alice`
- `https://yandex.ru/support/webmaster/ru/service/alice-answers`
- `https://yandex.ru/support/webmaster/ru/service/queries-selection`
- `https://yandex.ru/support/webmaster/ru/recommendations/site-structure`
- `https://yandex.ru/support/webmaster/ru/robot-workings/canonical`
- `https://yandex.ru/support/webmaster/ru/controlling-robot/robots-txt`
- `https://yandex.ru/support/webmaster/ru/controlling-robot/sitemap`
- `https://yandex.ru/support/webmaster/ru/supported-schemas/software`
- `https://yandex.ru/support/webmaster/ru/diagnosis/recommendations`

### Google Search Central

- `https://developers.google.com/search/docs/essentials`
- `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- `https://developers.google.com/search/docs/appearance/structured-data/software-app`

### Industry method corroboration

- `https://ahrefs.com/blog/keyword-intent/`
- `https://ahrefs.com/blog/keyword-clustering/`
- `https://ahrefs.com/blog/search-intent/`

Industry sources support workflow design; they do not replace Yandex demand/SERP evidence for this Russian-language project.

## 1. Modern Yandex target is the user task, not keyword-string matching

Yandex frames relevance as correspondence to the user's real task rather than formal phrase matching. The quality blocks grouped as ЭПОС are:

- expertise;
- usefulness;
- originality;
- meaningful completeness/content density.

Practical consequence for Octoport:

- a landing page cannot exist only because a phrase has volume;
- the page must solve the observed search task and match product truth;
- long generic SEO text is not a substitute for useful product explanation, proof, examples, comparison boundaries and clear next action;
- evidence, limitations and actual mechanics are part of the content value.

Yandex's own SEO sequence also supports the order `audience/task -> target queries -> relevant landing pages -> technical integration -> continuous market comparison and improvement`.

## 2. Alice AI is not a separate SEO universe

Official Yandex documentation says Alice AI builds answers using pages that rank highly in Search and favors expert, useful, original and substantive content. Source links are exposed to users. Alice answers are dynamic and can vary over time.

Therefore Octoport must not build a second artificial “AI SEO” site. The correct model is:

```text
strong Search page
+ complete factual coverage
+ clear entities/relationships
+ answerable subquestions
+ original product evidence
-> higher probability of both Search visibility and Alice source visibility
```

However, Alice requires its own evidence/measurement track because:

- source composition can differ from ordinary SERP order;
- Alice can fan out into related questions;
- Yandex Webmaster now reports Alice AI Share of Voice, source examples and neighboring sites for sites with sufficient search visibility.

Collection implication:

1. before launch/visibility: controlled manual/provider Alice/AI-search research on representative queries;
2. after the site ranks: Yandex Webmaster Alice AI visibility becomes the longitudinal measurement authority.

Robots must not accidentally block `YandexAdditionalBot` if Alice visibility is desired.

## 3. Query discovery should use several evidence layers

Wordstat remains demand evidence, but it is not sufficient alone. Yandex Webmaster's query-selection/market-analysis tool exposes additional query formulations, demand/click/competition indicators, clusters and popular pages/sites.

For Octoport, the eventual query universe should reconcile:

- Wordstat discovery and controlled exact/form probes;
- live ordinary Yandex SERPs;
- competitor landing vocabulary discovered from SERPs;
- Yandex Webmaster query/market data when the verified site has access;
- post-launch real query impressions/clicks;
- Alice AI source/query examples once available.

No metric should be silently added across overlapping phrases or treated as a different metric than the source actually provides.

## 4. Intent and SERP similarity decide page ownership

Industry clustering practice groups phrases when the same/similar pages rank for them, because similar SERPs are evidence of similar intent. Search intent analysis also distinguishes expected content type, format and angle.

Octoport page split/merge gate therefore uses:

1. user job / task;
2. product capability boundary;
3. ordinary Yandex result-type pattern;
4. URL/domain overlap across representative queries;
5. content type/format/angle;
6. cannibalization risk.

A lexical difference alone does not justify a new page. A high Wordstat count alone does not justify a new page. A low-volume but distinct high-intent task can still justify a page if it has a useful, honest product answer.

## 5. Competitor research must be SERP-derived and page-level

The meaningful competitor set is the set of domains/pages that repeatedly rank for our real query families, not a preselected business-rival list.

For each recurring search competitor collect:

- exact ranking URL(s);
- page type and intent;
- title/H1/visible framing;
- core product/category terminology;
- promised capabilities;
- proof/trust elements;
- information blocks and FAQ themes;
- CTA/conversion pattern;
- marketplace/LLM specificity;
- content freshness signals;
- internal-link/content-hub pattern where material;
- gaps versus Octoport product truth.

Competitor text is evidence, not copy source.

## 6. Technical SEO is a prerequisite, not the strategy

Official Yandex guidance supports:

- clear crawlable internal linking;
- unique URLs for useful pages;
- robots control for service/duplicate pages;
- Sitemap for canonical useful URLs;
- canonical signals for duplicates;
- unique title/description states;
- mobile usability;
- correct 404/deleted-page behavior;
- indexable main content;
- structured data where it describes real page content.

For Octoport specifically, Yandex supports `SoftwareApplication` and `WebApplication`; Google also supports `SoftwareApplication`. Structured data can improve understanding/presentation but is not a substitute for ranking quality and must reflect visible truthful content.

## 7. Cross-engine minimum

Although the primary research market is Yandex/Russian-language demand, implementation must not damage Google. Google Search Essentials aligns with the same durable principles:

- crawlable/indexable technical baseline;
- people-first useful content;
- language users actually search for in prominent page locations;
- crawlable links;
- structured data only where appropriate;
- Search Console measurement after launch.

We therefore design one technically clean public site rather than separate Yandex/Google page variants.

## 8. Method conclusions adopted for Octoport

Hard method decisions:

1. `PRODUCT TRUTH FIRST` — unsupported promises never become SEO targets.
2. `DEMAND != INTENT` — Wordstat volume must be reconciled with live SERP behavior.
3. `SEARCH != ALICE, BUT THEY SHARE QUALITY FOUNDATION` — ordinary Search remains the base; Alice gets separate evidence and measurement.
4. `QUERY != PAGE` — page ownership only after clustering and split/merge evidence.
5. `SERP COMPETITOR != BUSINESS RIVAL` — competitor registry originates from current ranking evidence.
6. `EVIDENCE BEFORE IMPLEMENTATION` — final routes/H1/Title/content specs are frozen before production site edits.
7. `EPOS CONTENT GATE` — every target page must prove relevance, expertise, usefulness, originality and meaningful completeness.
8. `NO THIN PROGRAMMATIC SEO` — no fake marketplace/persona/task pages without distinct intent and useful content.
9. `TECHNICAL CLEANLINESS` — canonical/indexability/robots/sitemap/internal linking/schema/mobile/performance are acceptance gates.
10. `MEASURE AND REOPEN` — post-launch query, landing and Alice visibility data can reopen earlier decisions.

## 9. What this research does not authorize

It does not authorize:

- final URL architecture;
- production copy changes;
- publishing unsupported features;
- automatic competitor-copy reuse;
- generating hundreds of articles from keyword variants;
- treating Alice answers as stable deterministic rankings;
- treating any third-party SEO score as ground truth.

Those decisions belong to the master roadmap and evidence gates.
