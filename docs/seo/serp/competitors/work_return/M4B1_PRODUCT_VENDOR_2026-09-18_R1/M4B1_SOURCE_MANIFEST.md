# Octoport SEO — M4B1 source manifest

WORK_ID: `OCTOPORT_SEO_M4B1_PRODUCT_VENDOR_2026-09-18_R1`
STATUS: **PARTIAL / RECOVERY_REQUIRED — MAIN CHAT ACCEPTANCE AND RECOVERY REQUIRED**
Branch: `seo/wordstat-batch-01-2026-09-16`
LIVE_START_HEAD: `d9432e997a6b0e8a7086c142309665882c67e4fe`

## Frozen authority

The live branch was fetched and the released R1 contract remained current. The accepted M4A authority reconciled exactly:

- selected registry entities: **45**;
- accepted M4A anchors: **100**;
- allowed candidate classes only: `RECURRING_PRODUCT_VENDOR`, `RELEVANT_ONE_OFF_PRODUCT_VENDOR`, `SERVICE_OR_AGENCY`, `OTHER_RELEVANT_CONTEXT`;
- unauthorized entities admitted: **0**.

Frozen blob identities independently verified:

- `M4A_COMPETITOR_REGISTRY.tsv`: `822155d7cebcbcf5cf8cdaef0f92782d5f84cd59`;
- `M4A_PAGE_CANDIDATES.tsv`: `c388aba7b1deaded3b5bb46b9d39212cf3eb94db`;
- `M4A_SERP_OCCURRENCES_CLASSIFIED.tsv`: `0028a743c8617c569ba37dfa4b59e92b5f56e18d`;
- Main Chat M4A R3 return QA: `97a802d24537a8829c773b10bc9ce26330e681ae`.

Governing files read in full:

- `docs/seo/serp/competitors/M4B1_PRE_STEP_RESEARCH_AND_EXECUTION_GATE_2026-09-18_R1.md`;
- `docs/seo/serp/competitors/M4B1_EXECUTION_RELEASE_2026-09-18_R1.md`;
- `docs/seo/serp/competitors/M4B1_WORK_PROMPT_2026-09-18_R1.md`;
- `docs/seo/serp/competitors/M4A_R3_MAIN_CHAT_RETURN_QA_2026-09-18.md`;
- accepted M4A registry, page candidates, occurrence ledger, source manifest, analysis and QA.

## Public acquisition method

Every accepted anchor received a direct public-page read attempt. Retrieval failures were retried through a browser path where possible. Same-entity links exposed by browser-readable seeds were filtered deterministically by the per-entity frozen scope policy and all resulting one-hop URLs were attempted. No full HTML/page body is stored in the deliverables; evidence rows contain structured observations and paraphrases.

Public acquisition accounting:

- accepted anchors: **100**;
- deterministic discovered URLs: **272**;
- total URL ledger rows: **372**;
- inspected public pages with structured evidence: **249**;
- scope rows: **45**;
- entity synthesis rows: **45**;
- candidate-term rows: **390**;
- entities with browser-enumerated same-entity navigation: **22**;
- entities requiring navigation or URL recovery: **33**.

Terminal-state counts:

- `AUTH_REQUIRED`: 3;
- `DYNAMIC_UNRESOLVED`: 5;
- `EXECUTION_ENVIRONMENT_FAILURE`: 38;
- `INSPECTED`: 249;
- `NON_HTML`: 4;
- `OUT_OF_SCOPE`: 71;
- `ROBOTS_OR_SITE_POLICY_BLOCKED`: 2;

## Failure semantics

Tool/browser failures are recorded only as `EXECUTION_ENVIRONMENT_FAILURE`. Minimal client-rendered captures are `DYNAMIC_UNRESOLVED`. An explicit public access-block page is `ROBOTS_OR_SITE_POLICY_BLOCKED`. Authentication surfaces are `AUTH_REQUIRED`. None of these is converted to HTTP failure, site unavailability, CAPTCHA or not-found without page evidence.

The exact recovery queue is losslessly present in `M4B1_URL_LEDGER.tsv` where `residual_recovery_required=true`.

## Claim and demand boundaries

- Page statements are `COMPETITOR_CLAIM`, not Octoport product truth.
- Candidate terms are competitor-derived candidates, not proven demand.
- No Search, Wordstat or Alice/GenSearch provider call was executed.
- No final semantic cluster, page ownership, URL, H1, Title or IA decision was made.
- No external entity absent from the accepted M4A registry was added.

