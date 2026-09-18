# LEVEL 2 — M4 Search competitor + landing corpus

Status: ACTIVE / CURRENT M4 METHOD AUTHORITY
Date revised: 2026-09-18
KW-002 analog: Step06 + Step07

## 1. Purpose

M4 has two distinct jobs:

1. derive a current Search-competitor authority from accepted M3 ranking evidence;
2. inspect only that authorized competitor universe to discover page-level tasks, terminology, proof patterns and candidate semantic gaps.

~~~text
BUSINESS RIVAL != SEARCH COMPETITOR
DOMAIN RECURRENCE != FINAL CLUSTER
COMPETITOR PAGE TOPIC != PROVEN DEMAND
COMPETITOR-DERIVED CANDIDATE != FINAL KEYWORD
~~~

M4 does not decide final page ownership, URL, H1, Title or IA.

## 2. Entry gates

Before M4 preparation/execution:

~~~text
LIVE_HEAD = READ
LEVEL1 = READ
THIS_LEVEL2 = READ
M3_ACCEPTED_AUTHORITY = IDENTIFIED
M3_CONTROL_DEBT = DISCLOSED
FAILURE_HISTORY = READ
FRESH_EXTERNAL_METHOD_RESEARCH = PASS
~~~

The job-specific M4 preparation must record exact accepted M3 files/counts/hashes; those job facts do not belong in this universal rule.

## 3. M4A — current competitor derivation

### 3.1 Complete occurrence layer

Preserve one row per accepted Search occurrence before analytical dedupe.

Minimum lineage:
query identity, query text/family, rank, raw URL, normalized URL, host/domain, title/snippet where available, source file/revision/hash.

Silent duplicate deletion is forbidden.

### 3.2 Strength layers

Use distinct analytical layers:

~~~text
TOP3 = strength amplifier
TOP10 = primary competitor / intent strength layer
11-20 = secondary discovery layer
~~~

Do not count 11-20 as equivalent first-page strength.

### 3.3 Collision / uncertainty

Preserve ambiguous/entity-collision rows. Do not clean the market by deleting inconvenient evidence.

Any target-relevance or role classification keeps basis/confidence/HOLD.

### 3.4 Recurrence metrics

Domain/URL recurrence is competitor-discovery evidence only.

Every metric must state whether it is:
- row-level;
- query-level;
- Top3;
- Top10;
- full authorized depth;
- target-filtered or unfiltered.

Stale denominators after reclassification are forbidden.

### 3.5 Pairwise SERP similarity

For the bounded representative query set, compute every unique pair where practical.

Keep separately:

- exact URL overlap Top10;
- domain overlap Top10;
- URL/domain unions;
- URL/domain Jaccard;
- shared URLs/domains.

Exact URL overlap is the stronger future clustering signal. Domain overlap is competitor-breadth evidence.

No universal threshold inside M4 may auto-create a page.

### 3.6 Curated registry

The material competitor registry is selected from the complete recurrence universe plus qualitative result-role evidence.

For every registry entity record:
- inclusion basis;
- query breadth;
- Top3/Top10/full-depth visibility;
- accepted-intent denominator/granularity;
- collision/HOLD exposure;
- exact ranking URL lineage;
- role class.

Native marketplace surfaces remain a separate baseline class.

## 4. M4B — authorized competitor public-surface expansion

Only competitors admitted by the accepted M4A registry may enter M4B.

~~~text
RAW SERP DOMAIN != AUTHORIZED M4B COMPETITOR
AUTHORIZED HOST != ALL SIBLING HOSTS
~~~

Sibling/regional/mobile/language hosts require explicit equivalence or separate authority.

### 4.1 Allowed surfaces

Public legitimately accessible in-scope:
category/subcategory, product/service, navigation/taxonomy, use-case landing, article/guide/FAQ/help/glossary, title/headings/breadcrumbs/labels, public sitemap, visible structured metadata.

Forbidden:
login/private areas, CAPTCHA bypass, paywall/anti-bot bypass, hidden/private APIs, arbitrary external-link expansion, fabricated inaccessible content.

### 4.2 Deterministic host scope

Choose one scope policy per competitor:

EVIDENCE_ANCHORED_RELEVANT_SUBTREE
for broad/general sites;

THEME_SCOPED_PUBLIC_TAXONOMY
for specialized sites.

Scope is driven by M4A evidence + public taxonomy, not an arbitrary page quota.

### 4.3 URL frontier / canonicalization

Start from all accepted ranking URLs, then in-scope public navigation, sitemap and pagination.

Preserve:
raw URL, discovered-from URL, redirect target, declared canonical, computed canonical, terminal state.

Do not remove query parameters that change content/identity.

### 4.4 Terminal states and full bounded coverage

Every discovered eligible URL reaches a terminal state such as:
INSPECTED, OUT_OF_SCOPE, DUPLICATE_CANONICAL, FACET/SORT_VARIANT, NON_HTML, ROBOTS/AUTH/CAPTCHA/HTTP/TIMEOUT_INACCESSIBLE, NOT_FOUND, REDIRECT_IN_SCOPE, REDIRECT_OUT_OF_SCOPE, DYNAMIC_UNRESOLVED, ERROR.

~~~text
DISCOVERED
= INSPECTED
+ EXCLUDED
+ INACCESSIBLE
+ REDIRECT_TERMINAL
+ UNRESOLVED
~~~

No arbitrary sample/top-N is a completion substitute. If too large, use deterministic complete chunks and remain INCOMPLETE until reconciled.

### 4.5 Candidate/provenance boundary

Terminology/topic/use-case candidates retain raw wording, page URL, page section/location/context, normalized comparison key and transformation rule.

Multi-source provenance is preserved.

Normalization cannot silently merge morphology/synonyms/meaning.

Candidate reconciliation statuses include:
ALREADY_PRESENT, NEW_CANDIDATE, NORMALIZED_DUPLICATE, POSSIBLE_VARIANT, OUT_OF_SCOPE, AMBIGUOUS.

Only genuinely new eligible candidates route to M6 for demand validation.

## 5. M4C — synthesis

Produce:
- hardened competitor registry;
- full coverage ledger;
- URL ledger;
- page evidence/provenance;
- task/capability/claim/content-pattern matrix;
- competitor-derived candidate register;
- M5 AI hypothesis inputs;
- M6 demand/gap candidates.

## 6. Work boundary

Cross-file or large public-surface analysis that risks skipped rows/URLs, weak joins or sampling must use Work with complete bounded units.

Main Chat performs governance/research/release once.
Work performs only released execution plus narrow drift/input preflight.

## 7. PASS

~~~text
ALL_ACCEPTED_M3_OCCURRENCES_ACCOUNTED = true
TOP3_TOP10_11_20_DISTINCTION = PASS
COLLISION_UNCERTAINTY_PRESERVED = true
RECURRENCE_GRANULARITY_EXPLICIT = true
PAIRWISE_SERP_SIMILARITY = COMPLETE_FOR_FROZEN_SET
CURATED_REGISTRY_TRACEABLE = true
ONLY_AUTHORIZED_COMPETITORS_IN_M4B = true
ALL_AUTHORIZED_COMPETITORS_ACCOUNTED = true
ALL_DISCOVERED_ELIGIBLE_URLS_TERMINAL = true or explicit blocking/inaccessible state
ARBITRARY_SAMPLING = 0
EVERY_CANDIDATE_HAS_PROVENANCE = true
COMPETITOR_TOPIC_TREATED_AS_DEMAND = 0
FINAL_PAGE_DECISIONS = 0
GITHUB_PERSISTENCE_READBACK = PASS
OPEN_CRITICAL_DEFECTS = 0
~~~

## 8. Regression

The earlier M4A prompt created before explicit Level1/Level2 restoration remains SUPERSEDED / DO NOT EXECUTE.

A fresh M4A preparation is required from the current live HEAD after this revised M4 rule is read.
