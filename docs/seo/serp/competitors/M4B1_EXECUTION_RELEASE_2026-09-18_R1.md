# Octoport SEO — M4B1 execution release

Date: 2026-09-18
Status: **AUTHORIZED AFTER REMOTE READBACK OF THIS RELEASE SET**
WORK_ID: `OCTOPORT_SEO_M4B1_PRODUCT_VENDOR_2026-09-18_R1`
Preparation base HEAD: `cb7ac5304381ffa16b13219dc38bdc8e8a38fcc6`

## Frozen upstream authority

M4A acceptance:
`docs/seo/serp/competitors/M4A_R3_MAIN_CHAT_RETURN_QA_2026-09-18.md`

Accepted Work inputs:
`docs/seo/serp/competitors/work_return/M4A_HARDENED_2026-09-18_R3/`

Key blob identities:

- M4A competitor registry: `822155d7cebcbcf5cf8cdaef0f92782d5f84cd59`;
- M4A page candidates: `c388aba7b1deaded3b5bb46b9d39212cf3eb94db`;
- M4A occurrence ledger: `0028a743c8617c569ba37dfa4b59e92b5f56e18d`;
- Main Chat M4A QA: `97a802d24537a8829c773b10bc9ce26330e681ae`.

## Frozen execution unit

Select only registry rows whose candidate_class is:

- RECURRING_PRODUCT_VENDOR;
- RELEVANT_ONE_OFF_PRODUCT_VENDOR;
- SERVICE_OR_AGENCY;
- OTHER_RELEVANT_CONTEXT.

Expected:
45 entities / 100 accepted M4A anchors.

No other entity may enter M4B1.

## Allowed external action

Public web browsing/capture is REQUIRED in M4B1.

Allowed:
- current public pages;
- public navigation/breadcrumbs;
- public same-entity in-scope links;
- public sitemap/robots surfaces for bounded discovery;
- redirects/canonical inspection.

Forbidden:
- login/private areas;
- CAPTCHA/anti-bot bypass;
- paywall bypass;
- private/hidden APIs;
- external-link crawl expansion;
- Search/Wordstat/Alice provider calls;
- adding non-registry competitors.

## Work preflight

Work only:
1. fetch live branch and record HEAD;
2. verify this M4B1 gate/release/prompt;
3. verify M4A acceptance remains current;
4. reconcile exactly 45 selected registry entities and 100 anchors;
5. classify authority drift;
6. HOLD on material drift/mismatch;
7. otherwise execute.

Do not redo Main Chat methodology research/governance.

## Return

Exactly 9 deliverables from the M4B1 gate.
One ZIP.
No GitHub write by Work.

Owner staging:
`docs/seo/serp/competitors/work_return/M4B1_PRODUCT_VENDOR_2026-09-18_R1/`
