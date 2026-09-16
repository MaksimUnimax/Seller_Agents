# KW-002 method audit for Octoport SEO

Date: 2026-09-16.
Status: `COMPLETE METHOD TRANSFER AUDIT`.
Source project: `MaksimUnimax/Yandex_direct`.
Source branch: `roadmap/kwork-productization-2026-08-28`.
Verified current source commit during this audit: `1f56a5ad3d7086c0930882c49b105e6cafe5b8d4` (`docs(kw002): durably close S06Q002 R1 evidence`).

## Purpose

KW-002 is currently the closest internal reference for building a semantic core and site architecture from zero under modern Yandex. Octoport should reuse the proven method mechanisms, but not copy its catalog-specific scale, commercial Kwork delivery constraints or artifact-heavy execution literally.

This audit answers four questions:

1. what KW-002 does correctly;
2. what failure history teaches us;
3. what transfers to Octoport;
4. what must not be copied.

## Source authorities reviewed

- `extension/docs/kwork/KW002_SEMANTIC_CORE_FROM_SCRATCH/README.md`
- `LEVEL2/STEP_RULES_INDEX.md`
- `KW002_UNIVERSAL_METHOD_LAYER_AUDIT_AND_REFACTOR_2026-09-11.md`
- `work/BLOOD_SAND_GREENFIELD_2026-09-08/KW002_EXECUTION_FAILURE_LEDGER_2026-09-11.md`
- `work/BLOOD_SAND_GREENFIELD_2026-09-08/KW002_EXECUTION_CURSOR_2026-09-11.json`
- current Step06 provider/export evidence state at commit above.

## Executive assessment

KW-002 has evolved into a strong evidence-governed research pipeline. Its strongest ideas are not “collect a lot of keywords”; they are:

```text
business truth first
-> lossless demand evidence
-> conservative normalization/sanitation
-> explicit HOLD
-> targeted expansion by information gain
-> current SERP competitors
-> row-level intent/user task
-> SERP-grounded clustering
-> query-to-page ownership
-> AI-search reconciliation
-> page jobs / IA / internal links
-> QA and revision
```

That architecture is highly reusable.

However, the rehearsal also proves that a process can become too artifact-heavy. The Blood & Sand job accumulated many correction layers, multi-megabyte ledgers, superseded states and repeated audits. Those were useful for discovering failure classes but are not a good target operating model for a much smaller SaaS semantic universe such as Octoport.

## What KW-002 does well — TAKE

### 1. Freeze product/business scope before search research

KW-002 separates client/business truth from search taxonomy. Search terms are discovered from a factual offer model rather than used to invent the offer.

Transfer to Octoport:

- `PRODUCT_TRUTH.md` remains the upstream authority;
- every keyword can exist as market evidence even when its requested capability is unsupported;
- unsupported mutation/action intent cannot become a deceptive commercial landing promise.

### 2. Separate RAW evidence, normalized identities, candidates, reserve and final targets

KW-002 explicitly distinguishes provider volume from analytical/final volume. This prevents raw provider noise from becoming an artificial “big semantic core”.

Transfer:

```text
RAW PROVIDER EVIDENCE
-> NORMALIZED QUERY UNIVERSE
-> WORKING / REVIEW / EXCLUDED
-> INTENT CLUSTERS
-> PAGE CANDIDATES / SUPPORTING / HOLD
```

We do not need a Kwork delivery cap, but we do need the same conceptual separation.

### 3. Durable provider evidence before downstream interpretation

The strongest execution lesson is that a provider success is not downstream authority until the complete required payload is durably saved and read back.

This directly matches the Octoport rule already adopted:

```text
provider response
-> persist complete evidence
-> readback/verify
-> analysis/progress
-> next paid/provider action
```

### 4. No blind retry on asynchronous/paid provider ambiguity

KW-002 treats timeout/unknown outcome as a safety problem, not as permission to repeat the request. Current Step06 even blocks release of the next query until Yandex Marketing Bridge 0.1.8 submit/collect/cost semantics are reconciled.

Transfer:

- exactly-once submit discipline;
- distinguish local lifecycle commands from provider calls;
- preserve operation IDs;
- poll existing operation rather than resubmit;
- account request/cost by actual provider execution.

Our S01 Deferred Search flow validated the same lesson.

### 5. Ambiguity is a first-class state

The failure ledger demonstrates why broad substring/stem rules caused false exclusions and false KEEP decisions. KW-002's corrected rule is effectively:

```text
substring match != referent proof
token match != intent proof
material ambiguity -> HOLD
```

Transfer:

Octoport must keep ambiguous phrases such as analytics/internal analytics/training/API/content generation in `REVIEW/HOLD` until SERP/product evidence resolves them.

### 6. Mechanical QA and semantic QA are different

KW-002 found large semantic defects after accounting had passed. This is a crucial reusable lesson.

Transfer:

- row counts/reconciliation cannot approve semantic classification;
- high-value exclusion rules need adversarial semantic checks;
- page clustering requires independent SERP/user-task challenge, not only deterministic code output.

### 7. Targeted expansion by information gain

Current Step05 does not recurse through related queries indefinitely. It requires a named unanswered question, checks existing durable evidence, and only authorizes a new provider call when there is incremental information value.

Transfer:

Once Octoport's current Wordstat batches + SERP/competitor research expose a genuinely new product-fit lexical family, we reopen Wordstat narrowly. We do not launch another broad batch just because more phrases are possible.

### 8. Search competitors are discovered from actual SERPs

KW-002 explicitly separates business rivals from search competitors.

Transfer:

Octoport's competitor registry must come from repeated live ranking evidence. S01 already surfaced Berkuz, ILAI, MPSTATS Connect AI, KT-Team, JVO, MarketAut, JAFO, ClawWow, Selsup, OpenClaw and others; they are evidence candidates because they rank, not because we knew their brands beforehand.

### 9. SERP evidence before page ownership

KW-002 puts current ordinary Yandex Search before final clustering/query-to-page architecture. This is methodologically correct and aligns with external SERP-intent practice.

Transfer:

No final Octoport `/ozon`, `/wildberries`, `/ai-agent`, `/analytics`, `/chatgpt-*` route is accepted until representative query SERPs and overlap/page-type evidence support a distinct page job.

### 10. Ordinary Search and AI-search are reconciled, not confused

KW-002 states explicitly that AI-search evidence is not “ask Alice how to do SEO”. It studies whether generative answers use different source/page patterns and whether that changes the cluster/page job.

Transfer:

Octoport needs a dedicated Alice/AI-answer evidence stage after ordinary SERP/category evidence, followed by Search-vs-Alice reconciliation.

### 11. Universal method separated from concrete job evidence

The universalization audit correctly moved client/job examples out of reusable Level1/Level2 rules and retained them as job evidence.

Transfer:

Our `docs/seo/` should distinguish:

- reusable method/roadmap;
- current Octoport product truth;
- raw provider evidence;
- current decisions;
- implementation state.

## What KW-002 exposed as failure — TAKE THE LESSON, NOT THE FAILURE

### Failure class A — source/scope drift

Early mixed assortment authority invalidated downstream planning.

Octoport prevention: product/source authority is frozen; later product development can reopen it explicitly, never silently.

### Failure class B — acquisition probes looked complete but were not useful enough

Catalog coverage did not equal good search-probe design.

Octoport prevention: each new query/probe has an information-purpose label: discover category language, resolve intent, test marketplace split, test LLM pairing, test analytics meaning, etc.

### Failure class C — provider result visible in chat but not durably saved

Octoport prevention: exact/full envelope first; readback before next command. This is already active.

### Failure class D — substring/stem classifiers damaged semantics

Octoport prevention: no aggressive lexical auto-exclusion. Use explicit context, full-token/entity rules and HOLD for uncertainty.

### Failure class E — examples were patched instead of producer rules

Octoport prevention: any discovered classifier defect becomes a rule/regression-class fix across the active universe, not a one-row patch.

### Failure class F — upstream correction left downstream results stale

Octoport prevention: every accepted upstream semantic change lists which downstream authorities are invalidated/reopenable.

### Failure class G — historical and current authority coexisted ambiguously

Octoport prevention: one `CURRENT AUTHORITY` pointer per stage; historical evidence remains immutable but cannot silently feed current decisions.

## What to MODIFY for Octoport

### 1. Replace assortment/SKU model with capability × user-task × marketplace model

KW-002's rehearsal is product-catalog heavy. Octoport is one software product.

Our factual model should be:

```text
marketplace: Ozon / Wildberries
user: seller / marketplace manager / team / analyst (only where evidence supports)
capability: read data / reports / analytics input / multi-store / chosen LLM bridge
product boundary: read-only launch, local keys, no raw-report server archive
interaction model: natural-language dialogue -> explicit commands -> marketplace API -> result
LLM pairing: supported/observed external web AI language
```

### 2. Give Alice/AI-answer visibility a stronger explicit track

KW-002 includes AI-search late in the flow. For Octoport this should remain after Search-stage evidence for page ownership, but collection planning should begin earlier so we know which queries require Alice controls.

### 3. Add competitor landing/product-positioning extraction

KW-002 primarily uses competitors as semantic expansion and SERP evidence. Octoport additionally needs product-market landing analysis:

- category naming;
- promise boundary;
- features/jobs emphasized;
- proof/trust;
- pricing/beta framing when public;
- CTA;
- page type;
- structured content and internal links.

### 4. Add explicit current-site gap audit

Octoport already has a live/static public homepage source. The research must end in a delta between current source and evidence-backed page specifications, not just a theoretical site tree.

### 5. Add software-specific technical SEO

Include `SoftwareApplication/WebApplication` schema decision, install/beta availability truth, supported platforms when verified, robots/Sitemap/canonical, YandexAdditionalBot, static indexable content, mobile/performance and Yandex/Google verification.

### 6. Add measurement as part of the product, not an afterthought

Post-launch authority must include:

- Yandex Webmaster index/query/page metrics;
- Yandex query-selection/market data;
- Alice AI Share of Voice/source examples when data exists;
- Google Search Console;
- product conversion events via approved analytics setup;
- periodic SERP rechecks for key category queries.

## What NOT to copy from KW-002

### 1. Do not copy artifact explosion

The rehearsal needed many ledgers/correction layers to discover method defects. Octoport should use:

```text
immutable raw evidence
+ one current normalized authority per stage
+ compact decision ledger
+ append-only changelog/progress
```

not dozens of nearly identical corrected/post-corrected files.

### 2. Do not copy Kwork delivery-cap mechanics

`DELIVERY_KEYWORD_CAP`, client package sizing and reserve selection for paid Kwork limits are product-specific to KW-002. Octoport's completeness gate is coverage of relevant search tasks, not an arbitrary number of delivered phrases.

### 3. Do not collect tens of thousands of rows by default

Octoport has a compact SaaS category. We need complete **relevant intent coverage**, not maximal row count.

Stop when new evidence stops changing:

- category vocabulary;
- user-task families;
- marketplace split;
- page ownership;
- content requirements;
- competitor/AI source set materially.

### 4. Do not repeat full-volume rework because an audit format changed

Method changes should preserve valid raw evidence and only invalidate dependent authorities that actually rely on the changed assumption.

### 5. Do not confuse preliminary family labels with pages

Families help research coverage; only SERP + task + product fit can authorize page ownership.

## Octoport transfer matrix

| KW-002 mechanism | Octoport decision |
|---|---|
| scope/source freeze | `ADOPT` |
| factual offer model | `ADAPT` to software capability/task model |
| broad Wordstat RAW | `ADOPT`, already executed B01/B02 |
| conservative normalization/dedup | `ADOPT` |
| high-confidence sanitation + HOLD | `ADOPT` |
| preliminary families | `ADOPT LIGHTWEIGHT` |
| targeted expansion by information gain | `ADOPT` |
| current SERP competitor discovery | `ADOPT` |
| competitor semantic expansion | `ADOPT, BOUNDED` |
| competitor-derived Wordstat | `CONDITIONAL` only for genuinely new relevant vocabulary |
| row-level relevance/intent | `ADOPT` |
| delivery keyword cap | `DO NOT ADOPT` |
| current Yandex SERP evidence | `ADOPT` |
| SERP-overlap clustering | `ADOPT` |
| query-to-page ownership | `ADOPT` |
| AI-search case selection/evidence | `ADOPT + EXPAND` |
| Search-vs-AI reconciliation | `ADOPT` |
| huge occurrence/family ledgers | `DO NOT ADOPT` for current scale |
| repeated correction strata | `DO NOT ADOPT AS NORMAL STATE` |
| failure-ledger anti-regression mindset | `ADOPT` |
| durable readback before next provider call | `ADOPT HARD RULE` |

## Final conclusion

KW-002 is a strong methodological ancestor, especially after its failure-driven refactors. The correct transfer is **its evidence discipline and decision ordering**, not its document volume.

Octoport's final method is therefore:

```text
PRODUCT TRUTH
-> bounded demand discovery
-> lossless persistence
-> lightweight normalization/sanitation/HOLD
-> targeted gap expansion
-> ordinary Yandex SERP + search competitors
-> competitor/page-format evidence
-> Alice/AI-answer evidence
-> row intent + SERP-overlap clustering
-> page ownership / IA
-> page specs under product truth + EPOS
-> technical SEO
-> implementation
-> live verification
-> Yandex/Google/Alice measurement and iteration
```

The authoritative execution plan for this transfer is `SEO_MASTER_ROADMAP_2026-09-16.md`.
