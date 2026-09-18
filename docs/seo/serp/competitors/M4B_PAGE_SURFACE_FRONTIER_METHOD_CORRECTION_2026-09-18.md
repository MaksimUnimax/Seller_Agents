# M4B page-surface frontier method correction — 2026-09-18

Status: **ACTIVE / ANTI-INFINITE-CRAWL CORRECTION**

## Problem found

M4B1 Recovery R2 introduced a job-level recursive rule that effectively required every newly inspected page to prove complete enumeration of its child-link tree.

That rule was stricter than the governing Octoport M4 Level2 and current KW-002 Step07 and generated 416 page-level residual flags even though all discovered URLs were terminal.

## Correct bounded discovery channels

The public page-surface frontier is constructed from:

1. accepted Search ranking URLs;
2. public entity navigation / relevant taxonomy / breadcrumbs inside the frozen scope;
3. public sitemap URLs or sitemap indexes that can be scoped to the authorized host/path/theme;
4. sequential pagination or public load-more surfaces required to enumerate an eligible collection;
5. redirects from an already eligible URL.

A URL becomes part of the frontier only when one of these declared channels discovers it or an explicitly admitted page-local taxonomy/breadcrumb link admits it.

## Not required

M4B does not require:

- computing the transitive closure of every ordinary body/internal link on every inspected page;
- proving the same sitewide menu separately on every page;
- following unrelated recommendations/recent-post widgets forever;
- crawling all legal/corporate/media URLs because they are linked from every footer;
- treating every contextual hyperlink as a new thematic branch.

Those behaviors create an unbounded graph and contradict deterministic scope.

## Required closure evidence per entity

Every authorized entity records terminal status for:

```text
ANCHORS
PRIMARY_NAV_TAXONOMY
BREADCRUMB_OR_LOCAL_SUBTREE
SCOPED_SITEMAP
PAGINATION_OR_LOAD_MORE
DISCOVERED_ELIGIBLE_URL_DELTA
```

Each channel must be:
`COMPLETE | NOT_APPLICABLE | NOT_FOUND | ACCESS_BLOCKED | UNSCOPABLE_WITH_REASON | HOLD`.

PASS requires no blocking HOLD and all URLs discovered by applicable completed channels terminal.

## R2 interpretation

The 416 `CHILD_LINK_TREE_NOT_FULLY_ENUMERATED_DUE_EXECUTION_ENVIRONMENT` flags remain immutable diagnostic history.

They do not individually require 416 revisits.

They identify entities where coverage closure must be proved by the canonical discovery-channel ledger.

## Regression rule

```text
COMPLETE_BOUNDED_FRONTIER
!=
COMPLETE_INTERNAL_LINK_GRAPH
```

A job-specific gate may not silently upgrade bounded public-surface discovery into an unlimited graph crawl.
