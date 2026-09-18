# Octoport SEO — M4B1 product/vendor public-surface acquisition gate

Date: 2026-09-18
Status: **PREPARED / RELEASE CANDIDATE / WORK NOT STARTED**
WORK_ID: `OCTOPORT_SEO_M4B1_PRODUCT_VENDOR_2026-09-18_R1`
Stage: M4 — Search competitor + landing corpus
Substep: M4B1 — product/vendor public-surface expansion
Preparation base HEAD: `cb7ac5304381ffa16b13219dc38bdc8e8a38fcc6`

## 1. Why M4B is split

Accepted M4A authority:

- registry entities = 60;
- ranking-URL anchors = 143.

M4B must process the complete authorized universe without turning a large public-web crawl into sampling.

Therefore M4B is split into two **complete deterministic execution units**, not representative samples:

### M4B1 — current unit

Classes:

- `RECURRING_PRODUCT_VENDOR`: 30 entities / 82 anchors;
- `RELEVANT_ONE_OFF_PRODUCT_VENDOR`: 12 entities / 13 anchors;
- `SERVICE_OR_AGENCY`: 2 entities / 2 anchors;
- `OTHER_RELEVANT_CONTEXT`: 1 entity / 3 anchors.

Expected:

```text
M4B1_REGISTRY_ENTITIES = 45
M4B1_ACCEPTED_ANCHORS = 100
```

### M4B2 — later unit

- `EDITORIAL_OR_PUBLISHER`: 12 entities / 32 anchors;
- `NATIVE_MARKETPLACE_BASELINE`: 2 entities / 8 anchors;
- `AGGREGATOR_DIRECTORY`: 1 entity / 3 anchors.

Expected:

```text
M4B2_REGISTRY_ENTITIES = 15
M4B2_ACCEPTED_ANCHORS = 43
```

M4B is not complete until both units plus M4C synthesis are accepted.

## 2. Two-level gate

Main Chat re-read on live accepted M4A HEAD:

LEVEL 1:
- `docs/seo/LEVEL1/README.md`;
- `docs/seo/EXECUTION_RULES.md`;
- `docs/seo/QUALITY_FIRST_RESOURCE_RULE.md`;
- `docs/seo/WORK_HANDOFF_RULE.md`.

LEVEL 2:
- `docs/seo/LEVEL2/README.md`;
- `docs/seo/LEVEL2/OCTOPORT_STEP_RULES_INDEX.md`;
- `docs/seo/LEVEL2/M4_SEARCH_COMPETITOR_LANDING_RULES.md`.

Current evidence:
- `docs/seo/serp/competitors/M4A_R3_MAIN_CHAT_RETURN_QA_2026-09-18.md`;
- accepted M4A registry;
- accepted M4A page-candidate manifest;
- current M4 progress / roadmap;
- current S03 and R06 recovery authorities.

M4A acceptance:
`M4A_R3 = ACCEPTED / 9.8/10`.

## 3. Fresh external method research — 2026-09-18

### Yandex Webmaster — Search quality

https://yandex.ru/support/webmaster/en/search-quality

Current supported method elements:

- page quality is tied to relevance and likelihood of solving the user's task;
- usefulness, content quality/originality, trust/credibility and ease of consumption matter.

Project application:
M4B captures what task a current page solves, what proof/trust it provides, and how the public page substantiates its promise. Keyword presence alone is insufficient.

### Yandex Webmaster — EPOS

https://yandex.ru/support/webmaster/ru/epos

Current supported aspects:
- expertise;
- usefulness;
- originality;
- meaningful completeness.

Project application:
M4B extracts observable expertise/proof, useful task coverage, differentiated value and topic completeness. It does not copy page text.

### Yandex Webmaster — site structure

https://yandex.ru/support/webmaster/en/recommendations/site-structure

Current supported claims:
- public links/navigation connect user-facing site sections;
- pages and sections are discovered through links and site structure.

Project application:
public navigation, breadcrumbs and in-scope internal links may be used to build a bounded same-entity frontier. This does not authorize a whole-domain crawl.

### Yandex Webmaster — title and description

https://yandex.ru/support/webmaster/en/search-results/title-and-description

Current supported claim:
Search snippets can use title, description, page text and structured data.

Project application:
capture Title, meta description, H1/headings and observable structured data as distinct page evidence.

### Secondary industry corroboration — Ahrefs Content Gap

https://ahrefs.com/academy/how-to-use-ahrefs/competitive-analysis/content-gap

Supported workflow idea:
competitor pages/keywords can expose coverage gaps.

Project boundary:
a competitor-derived topic or phrase is only a **candidate**. It does not become proven demand or final semantic truth until M6 validation where required.

## 4. Frozen input authority

Work must use the accepted M4A artifacts at:

`docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R3/`

Required:
- `M4A_COMPETITOR_REGISTRY.tsv`;
- `M4A_PAGE_CANDIDATES.tsv`;
- `M4A_SERP_OCCURRENCES_CLASSIFIED.tsv`;
- `M4A_SOURCE_MANIFEST.md`;
- `M4A_ANALYSIS.md`;
- `M4A_QA.md`;
- Main Chat return QA.

M4B1 is selected by candidate class only. No remembered brand/entity may be added.

Preflight must reconcile exactly 45 registry entities and 100 accepted anchors.

Mismatch = HOLD.

## 5. Scope policies

Every M4B1 entity gets exactly one initial scope policy in `M4B1_SCOPE_LEDGER.tsv`.

### THEME_SCOPED_PUBLIC_TAXONOMY

Use for a specialized product/vendor site whose public structure is predominantly the relevant seller/marketplace product/topic.

Allowed discovery:
- all accepted M4A anchors;
- same-entity public navigation;
- breadcrumbs;
- directly linked category/product/use-case/help/guide pages inside the relevant public taxonomy;
- public sitemap URLs only when they fall inside the frozen relevant taxonomy/path scope.

### EVIDENCE_ANCHORED_RELEVANT_SUBTREE

Use for broad, multi-product, agency/service or general sites.

Allowed discovery:
- all accepted M4A anchors;
- same-host pages directly linked from those anchors and clearly inside the same marketplace/seller/product/use-case subtree;
- breadcrumbs/navigation local to that subtree;
- sitemap entries only when they match the already-frozen subtree/path/topic boundary.

Forbidden:
- whole-domain crawl;
- unrelated products/services/content;
- external-link expansion;
- site-wide search-result crawling;
- arbitrary “interesting” adjacent topics.

### Host equivalence

Default host boundary:
the accepted registrable domain.

Allowed equivalent hosts:
- `www` variant;
- redirect/canonical host proven to be the same entity/current public surface.

Other subdomains/sibling domains require explicit equivalence evidence in the scope ledger.

## 6. Frontier and terminal-state contract

Start every entity with **all** accepted M4A anchors for that registry ID.

Every discovered eligible URL must reach one terminal state:

- `INSPECTED`;
- `OUT_OF_SCOPE`;
- `DUPLICATE_CANONICAL`;
- `FACET_OR_SORT_VARIANT`;
- `NON_HTML`;
- `ROBOTS_OR_SITE_POLICY_BLOCKED`;
- `AUTH_REQUIRED`;
- `CAPTCHA_OR_ANTI_BOT`;
- `HTTP_ERROR`;
- `TIMEOUT`;
- `NOT_FOUND`;
- `REDIRECT_IN_SCOPE`;
- `REDIRECT_OUT_OF_SCOPE`;
- `DYNAMIC_UNRESOLVED`;
- `EXECUTION_ENVIRONMENT_FAILURE`;
- `ERROR`.

Hard distinction:

```text
TOOL/BROWSER FAILURE != SITE UNAVAILABLE
EXECUTION_ENVIRONMENT_FAILURE != HTTP_ERROR
CAPTCHA != NOT_FOUND
AUTH_REQUIRED != OUT_OF_SCOPE
```

Environment failures go into an explicit recovery queue for Main Chat/browser recovery. They are not converted into site facts.

Completion accounting:

```text
DISCOVERED_ELIGIBLE_URLS
=
ALL TERMINAL URL LEDGER ROWS
```

No sample/top-N may substitute for frontier closure.

If scope explodes beyond reliable complete treatment, Work returns `SCOPE_EXPLOSION_HOLD` with exact counts and boundary evidence; it must not silently truncate.

## 7. URL identity / canonicalization

Preserve separately:

- discovered URL;
- discovery source URL;
- normalized comparison URL;
- redirect chain;
- final URL;
- declared canonical where observable;
- terminal state.

Do not remove query parameters that materially change page content/identity.

A canonical/redirect may merge analytical identity but must not erase original discovery lineage.

## 8. Page evidence schema

For every `INSPECTED` page create one row in `M4B1_PAGE_EVIDENCE.tsv`.

Mandatory fields:

- `page_id`;
- `url_id`;
- `registry_id`;
- `entity_name`;
- `candidate_class`;
- `final_url`;
- `captured_at`;
- `page_role`;
- `title`;
- `meta_description`;
- `h1`;
- `heading_structure_summary`;
- `breadcrumb_summary`;
- `marketplace_scope`;
- `ai_llm_scope`;
- `user_jobs`;
- `data_scope`;
- `capability_claims`;
- `action_boundary_claims`;
- `integrations`;
- `pricing_availability`;
- `cta`;
- `proof_trust_cases`;
- `faq_subtopics`;
- `author_freshness`;
- `internal_link_pattern`;
- `structured_data_observed`;
- `evidence_locator`;
- `claim_confidence`;
- `octoport_overlap`;
- `octoport_difference`;
- `notes`.

Evidence policy:
- factual observation/paraphrase first;
- no full-page text storage;
- no bulk copyrighted copying;
- exact quotation only when essential and short;
- page claims remain `COMPETITOR_CLAIM`, never Octoport truth.

## 9. Candidate-term / gap register

Competitor-derived terms/tasks go to `M4B1_CANDIDATE_TERMS.tsv`.

Mandatory fields:

- `candidate_id`;
- `registry_id`;
- `page_id`;
- `raw_term_short`;
- `evidence_locator`;
- `candidate_type`;
- `normalized_key`;
- `relation_to_existing_octoport_evidence`;
- `status`;
- `m6_validation_required`;
- `reason`.

Allowed `status`:
- `ALREADY_PRESENT`;
- `NEW_CANDIDATE`;
- `POSSIBLE_VARIANT`;
- `OUT_OF_SCOPE`;
- `AMBIGUOUS`.

A `NEW_CANDIDATE` is not a production keyword and not a page decision.

## 10. Entity synthesis

Create one row for every 45 M4B1 entities.

Fields include:

- registry/entity identity;
- scope policy;
- anchors accounted;
- discovered/inspected/blocked/unresolved counts;
- primary public positioning;
- user jobs;
- marketplace scope;
- data scope;
- AI/LLM framing;
- read/analysis vs write/automation framing;
- integrations;
- pricing/availability;
- proof/trust;
- CTA pattern;
- content architecture pattern;
- Octoport overlap;
- Octoport difference;
- candidate-gap count;
- completion state;
- unresolved reason.

## 11. Work trigger

`WORK_TRIGGER = MET`.

Reason:
45 entities + 100 frozen anchors + deterministic public-surface expansion + URL frontier reconciliation is a full-volume browsing/data-integration task. Ordinary chat would create skipped URLs, partial joins or representative sampling.

Main Chat has already done:
- Level1/Level2 read;
- M4A acceptance;
- fresh method research;
- unit selection;
- schema/gate design.

Work does only released execution plus narrow live-authority drift preflight.

## 12. Required deliverables

Exactly 9 final deliverables:

1. `M4B1_SOURCE_MANIFEST.md`
2. `M4B1_SCOPE_LEDGER.tsv`
3. `M4B1_URL_LEDGER.tsv`
4. `M4B1_PAGE_EVIDENCE.tsv`
5. `M4B1_ENTITY_SYNTHESIS.tsv`
6. `M4B1_CANDIDATE_TERMS.tsv`
7. `M4B1_ANALYSIS.md`
8. `M4B1_QA.md`
9. `M4B1_RETURN_MANIFEST.json`

One ZIP containing exactly those 9 files.

## 13. Hard QA

PASS-candidate requires:

```text
LIVE_BRANCH_FETCHED = true
M4A_R3_ACCEPTED_AUTHORITY_CURRENT = true
M4B1_REGISTRY_ENTITIES = 45
M4B1_ACCEPTED_ANCHORS = 100
ALL_100_ANCHORS_ACCOUNTED = true
UNAUTHORIZED_REGISTRY_ENTITIES = 0
SCOPE_POLICY_ROWS = 45
EVERY_DISCOVERED_ELIGIBLE_URL_TERMINAL = true
ARBITRARY_SAMPLING = 0
SILENT_URL_LOSS = 0
EXECUTION_ENV_FAILURES_SEPARATED_FROM_SITE_FAILURES = true
ALL_INSPECTED_PAGES_HAVE_EVIDENCE_ROWS = true
ALL_ENTITY_SYNTHESIS_ROWS = 45
CANDIDATE_TERMS_HAVE_PAGE_PROVENANCE = true
COMPETITOR_TERM_TREATED_AS_PROVEN_DEMAND = 0
COMPETITOR_CLAIM_TREATED_AS_OCTOPORT_FACT = 0
FULL_PAGE_COPY_STORAGE = 0
FINAL_CLUSTER_DECISIONS = 0
FINAL_PAGE_OWNERSHIP_DECISIONS = 0
NEW_SEARCH_PROVIDER_CALLS = 0
NEW_WORDSTAT_PROVIDER_CALLS = 0
NEW_ALICE_PROVIDER_CALLS = 0
OPEN_CRITICAL_DEFECTS = 0
```

A browser/environment residual may return `PARTIAL / RECOVERY_REQUIRED`, never fake PASS.

## 14. Return policy

Work does not publish to GitHub and does not self-accept.

Owner uploads all 9 unpacked files in one GitHub UI action to:

`docs/seo/serp/competitors/work_return/M4B1_PRODUCT_VENDOR_2026-09-18_R1/`

Main Chat performs remote readback, independent count/URL/provenance QA and any bounded browser recovery required before acceptance.
