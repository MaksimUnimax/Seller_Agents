# Octoport SEO — M4B1 bounded browser recovery gate

Date: 2026-09-18
Status: **CURRENT / MAIN CHAT BROWSER RECOVERY**
Upstream: accepted M4B1 partial-return QA
Base HEAD: `ddb7ce16f325f92014de383039400523a7de7742`

## Exact bounded recovery unit

### URL recovery

Exactly `45` Work rows with `residual_recovery_required=true`.

Priority:
1. accepted anchors;
2. EXECUTION_ENVIRONMENT_FAILURE;
3. DYNAMIC_UNRESOLVED;
4. ROBOTS/SITE_POLICY_BLOCKED only through normal public access.

### Navigation recovery

Exactly `23` accepted M4B1 entities where Work could not enumerate same-entity navigation.

Recovery may inspect only:
- accepted anchors for that entity;
- normal public page navigation/breadcrumbs;
- same-entity links admitted by the frozen scope policy;
- public sitemap/robots when useful for the already-defined scope.

No whole-domain exploratory crawl.

## Rules

- never re-open the 249 Work pages already INSPECTED unless needed only to enumerate a missing navigation surface;
- do not redo the 12 complete entities;
- no login/auth bypass;
- no CAPTCHA/anti-bot bypass;
- no private/hidden APIs;
- no Search/Wordstat/Alice provider calls;
- no new competitor entity;
- browser/tool failure remains execution-environment evidence, not site unavailability;
- every recovered/discovered URL retains its original Work URL ID where applicable;
- newly discovered recovery-only URLs get deterministic `M4B1R_*` IDs and explicit discovery lineage;
- no final cluster/page/IA decision.

## Closure

Recovery produces an overlay, never rewrites Work return history.

M4B1 can pass only when:
- all 45 residual rows have a post-recovery terminal decision;
- all 23 navigation-enumeration entities have either complete bounded enumeration or a justified terminal limitation;
- newly discovered eligible URLs are themselves driven terminal;
- new INSPECTED pages receive structured evidence;
- entity synthesis/candidate register are updated by overlay where material;
- Main Chat re-reconciles complete Work + recovery state;
- quality score >=9.0 and hard gates PASS.

If browser recovery still leaves genuine environment residuals, remain PARTIAL; do not fake closure.
