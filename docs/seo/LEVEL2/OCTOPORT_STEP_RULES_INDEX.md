# Octoport SEO — LEVEL 2 universal step rules index

Status: ACTIVE / UNIVERSAL ROADMAP METHOD AUTHORITY
Date: 2026-09-18

This file is the Octoport analogue of KW-002 LEVEL2/STEP_RULES_INDEX.md.
It defines WHY each roadmap stage exists, its method boundary, output and PASS contract.

Hard architecture:

~~~text
LEVEL 1 = universal project/process rules
LEVEL 2 = reusable step methods and gates
work/evidence/state/results = concrete execution facts
~~~

Current job counts, query IDs, hashes and one-run examples do not define this file.

## Global corrected flow

~~~text
M0 PRODUCT TRUTH / SCOPE
-> M1 CURRENT SITE + MEASUREMENT BASELINE
-> M2 DEMAND / WORDSTAT
-> M3 CURRENT ORDINARY SEARCH BASELINE
-> M4 SEARCH COMPETITOR REGISTRY + COMPETITOR PAGE EXPANSION
-> M5 AI-DIAGNOSTIC HYPOTHESIS REGISTER ONLY; NO AI PROVIDER ACQUISITION
-> M6 NAMED GAP CLOSURE + COMPETITOR-DERIVED DEMAND VALIDATION + M3 CONTROL PATCH
-> M7 SEARCH-SIDE COLLECTION FREEZE
-> M8 SEARCH-ONLY SEMANTIC MASTER + ROW-LEVEL RELEVANCE/TASK/INTENT/PRIORITY
-> M9 SEARCH-ONLY SERP + USER-TASK CLUSTERING
-> M10A SEARCH-ONLY QUERY->PAGE / IA BASELINE FREEZE
-> M10B FINAL AI-DIAGNOSTIC CASE SELECTION
-> M10C ALICE / AI-SEARCH EVIDENCE ACQUISITION
-> M10D SEARCH-vs-AI RECONCILIATION
-> M11 FINAL PAGE OWNERSHIP + IA
-> M12 PAGE JOBS / PAGE SPECS / CONTENT SYSTEM
-> M13 TECHNICAL SEO SPEC
-> M14 BOUNDED IMPLEMENTATION
-> M15 SOURCE/PREDEPLOY/LIVE QA
-> M16 LAUNCH + INDEXING VERIFICATION
-> M17 MEASUREMENT + CONTROLLED ITERATION
-> M18 FINISHED-PRODUCT ACCEPTANCE / CLOSE
~~~

Critical transferred invariant:

~~~text
SEARCH-ONLY BASELINE
MUST EXIST BEFORE
AI EVIDENCE MAY CHANGE A DECISION
~~~

Alice evidence may be collected only after the Search-only decision baseline required by M10A exists. Earlier M5 creates hypotheses only.

## M0 — product truth / governance

KW-002 analog: Step00 + Step01.

WHY:
Search demand cannot invent product capabilities.

METHOD:
Freeze product definition, marketplaces, launch action boundary, claims, credentials/storage, availability and source authority.

OUTPUT:
current PRODUCT_TRUTH + explicit unknowns.

PASS:
every material promise traces to current product authority; material changes invalidate affected downstream decisions.

## M1 — current site + measurement baseline

KW-002 analog: Step00 site-state portion; later implementation/measurement has no exact KW-002 equivalent.

WHY:
Implementation cannot be safely designed without knowing current public/source state and measurement readiness.

OUTPUT:
current source/live URL/indexability/measurement baseline.

PASS:
blocking unknowns for later technical implementation are explicit or resolved.

## M2 — demand acquisition

KW-002 analog: Step02, Step03, Step03A, Step03B, Step04, Step05.

Existing dedicated Octoport gates remain authoritative.

PASS:
durable demand evidence, lineage, accepted historical limitations, and no unnamed high-value demand gap.

## M3 — ordinary Yandex Search baseline

KW-002 analog: Step06 plus later Step12 controls.

WHY:
Resolve current intent/result types and obtain current ranking evidence.

PASS:
accepted organic baseline plus required control debt closure before M7. Organic-only evidence must not be described as full SERP evidence.

## M4 — search competitors + competitor pages

KW-002 analog: Step06 + Step07.

WHY:
Derive actual current Search competitors, then discover page-level terminology/tasks/gaps from the authorized competitor universe.

Dedicated authority:
M4_SEARCH_COMPETITOR_LANDING_RULES.md.

PASS:
recurrence/lineage and authorized-competitor coverage pass; competitor-derived topics remain hypotheses, not proven demand.

## M5 — AI diagnostic hypothesis register

KW-002 analog: early preparation for Step15 only.

WHY:
Record possible questions where later Alice evidence may add decision value without contaminating the Search baseline.

METHOD:
From Search/competitor evidence, record candidate AI diagnostic questions, uncertainty and expected information gain.

PROHIBITED:
no Alice/GenSearch/provider acquisition; no AI-driven page decision.

OUTPUT:
provisional AI diagnostic hypothesis register.

PASS:
every row is a hypothesis with a named future decision; no AI evidence has entered Search semantic decisions.

## M6 — targeted gap closure + M3 control patch

KW-002 analog: Step05 + Step08 + corrective Step06 controls.

WHY:
Close only named gaps and validate genuinely new competitor-derived demand before Search freeze.

Dedicated authority:
M6_GAP_CLOSURE_AND_PROVIDER_RULES.md.

PASS:
all high-value gaps resolve to existing evidence, targeted acquisition, owner/product fact or HOLD; new rows pass normalization/sanitation; M3 control debt is closed or explicit blocking HOLD.

## M7 — Search-side collection freeze

KW-002 analog: Step09 + Step11 boundary.

WHY:
Create one immutable Search-side evidence snapshot before expensive semantic analysis.

ALICE:
Alice evidence is NOT a prerequisite and is excluded from the Search freeze.

OUTPUT:
frozen source manifest/hashes, open HOLD list, Work handoff manifest.

PASS:
Search-side evidence is sufficient, durable and internally reconciled; unresolved blocking gaps = 0.

## M8 — Search-only semantic master

KW-002 analog: Step09 + Step10.

WHY:
Perform full-volume semantic judgments on the cleaned Search-side universe.

Dedicated authority:
M7_M8_SEARCH_FREEZE_AND_SEMANTIC_MASTER_RULES.md.

OUTPUT:
Search-only semantic master with WORKING/REVIEW-HOLD/EXCLUDED/BRAND states, user task, intent, relevance, priority, provenance and independent QA.

PASS:
no default KEEP; uncertainty explicit; no Alice evidence used in row-level Search truth.

## M9 — Search-only clustering

KW-002 analog: Step13.

WHY:
Determine which queries can be satisfied by one page using task/intent + exact-URL SERP behavior + semantics.

Dedicated authority:
M9_M11_CLUSTER_IA_RULES.md.

PASS:
merge/split decisions evidence-backed; no universal overlap threshold; mixed/HOLD states explicit.

## M10 — Search-only baseline -> Alice diagnostic -> reconciliation

KW-002 analog: Step14 + Step15 + Step16 + Step17.

Dedicated authority:
M5_M10_SEARCH_ONLY_AND_ALICE_SEQUENCE_RULES.md.

M10A freezes Search-only query->page ownership and IA baseline.
M10B selects final AI cases for decision value.
M10C acquires/persists Alice evidence.
M10D classifies AI effect:
CHANGE | ENRICH | DE_RISK | NO_CHANGE | HOLD.

PASS:
AI never retroactively contaminates the Search-only baseline; every delta has causal evidence; NO_CHANGE is valid.

## M11 — final page ownership + IA

KW-002 analog: Step18 architecture portion.

WHY:
Materialize final architecture after accepted AI reconciliation.

OUTPUT:
canonical cluster->page owner, page role, KEEP/OPTIMIZE/CREATE/ROUTE/HOLD, IA and internal-link responsibility.

PASS:
one primary governed owner per retained cluster unless explicit evidence supports split; no fake CREATE.

## M12 — page specs + content system

KW-002 analog: Step18 Page Jobs + Step19 deliverables.

Dedicated authority:
M12_PAGE_SPECS_CONTENT_RULES.md.

WHY:
Turn final architecture into implementable, truthful, useful page contracts.

PASS:
every page spec has query/task/coverage boundaries, product promise, content/proof needs, internal links, indexing/canonical state and evidence trace.

## M13 — technical SEO specification

KW-002 analog: no exact implementation-level analog; inherits Step18/19 traceability and must use current Yandex/Google technical sources.

WHY:
Freeze crawl/index/canonical/robots/sitemap/schema/mobile/rendering/HTTP requirements before code changes.

PASS:
requirements are current, source-backed, internally consistent and executable.

## M14 — bounded production implementation

KW-002 analog: no direct analog; implementation is Octoport-specific.

WHY:
Apply accepted M11-M13 authorities without scope drift into parallel server/extension work.

PASS:
only authorized routes/files/metadata/linking/technical changes made; current main refreshed; tests pass; no unsupported product claim introduced.

## M15 — source / predeploy / live QA

KW-002 analog: Step20 exact-file QA plus Octoport live technical QA.

PASS:
spec->source->deployed parity, indexability, canonical, robots/sitemap, rendering, links, schema, mobile/performance and no thin/orphan/duplicate target defects.

## M16 — launch + indexing verification

KW-002 analog: Step20 + Step22 close mechanics; current Yandex indexing docs provide the technical method.

PASS:
canonical pages live/discoverable, ownership surfaces ready, crawl/index states checked, errors explicit, no launch blocker hidden.

## M17 — measurement + controlled iteration

KW-002 analog: Step21 productization measurement adapted to live SEO measurement.

PASS:
query/page/Alice/Google/conversion metrics have provenance; optimizations use hypothesis -> change -> measured result; no uncontrolled rewrite loop.

## M18 — finished-product acceptance / close

KW-002 analog: Step20 + Step22.

PASS:
blocking semantic, implementation, crawl/indexability, product-truth and handoff defects = 0; final authorities recoverable; measurement/reopen loop documented.

## Global PASS

Every material stage additionally requires:

~~~text
LEVEL1_READ = PASS
APPLICABLE_LEVEL2_READ = PASS
FRESH_METHOD_RESEARCH = PASS where applicable
FULL_VOLUME_ACCOUNTING = PASS where applicable
SEMANTIC_QA = PASS where applicable
KNOWN_FAILURE_REGRESSION = PASS
PROVIDER_EXECUTION_GATE = PASS where provider work occurred
GITHUB_PERSISTENCE_REMOTE_READBACK = PASS
OPEN_CRITICAL_DEFECTS = 0
~~~

A quality score cannot override a failed hard gate.
