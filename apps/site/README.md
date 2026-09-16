# Octoport public site

Status: SITE-S0 foundation candidate.

## Purpose

`apps/site/public/` is the independent public marketing surface for `https://octoport.ru/`.
It is intentionally separate from:

- `apps/portal` — authenticated user portal;
- `apps/admin` — admin application, future same-origin route under `app.octoport.ru/admin/`;
- `apps/api` — Control Plane API;
- `apps/extension` — browser extension.

The first public-site foundation is dependency-free static HTML/CSS. This is deliberate: the marketing surface currently has no accepted dynamic runtime requirement, so S0 does not add a second Node production process, package dependencies, workspace lockfile churn, or coupling to the active server/I1 streams.

A framework may be introduced later only when a concrete site requirement needs it.

## Canonical domain

- canonical public origin: `https://octoport.ru/`;
- `https://www.octoport.ru/` remains redirect-only at nginx;
- authenticated portal is not served by this directory;
- API is not served by this directory.

DOMAIN-D2 currently returns an intentional `503` for the apex until a separate site-deployment step replaces that pre-deployment response with a static root.

## Truth boundary for public copy

Current S0 copy may state:

- Octoport is being prepared as one browser extension for Ozon and Wildberries;
- product positioning is an «ИИ-сотрудник» working through the user's chosen AI dialogue;
- beta is planned as a limited free beta;
- initial product scope is read-only data/report work rather than business-state editing;
- marketplace API keys remain local during ordinary work;
- Octoport does not provide a server archive of raw reports or chat history;
- the server is still used for account/device/auth and limited service metadata/synchronization.

S0 must NOT claim:

- that public registration is already open;
- that portal/API/admin are already deployed;
- public paid pricing such as historical `199/299` figures;
- that every target browser/provider combination has completed installed/live acceptance;
- that Octoport stores no server data at all;
- capabilities not supported by accepted marketplace APIs.

## Files

- `public/index.html` — public homepage source;
- `public/styles.css` — dependency-free responsive styling;
- `public/robots.txt` — crawler policy;
- `public/sitemap.xml` — initial canonical sitemap.

There is no build step in S0. Deployment copies the contents of `public/` byte-for-byte into a versioned/releasable static web root and changes nginx only in a separate accepted deployment step.

## Acceptance

`.github/workflows/site-ci.yml` validates the static source without PostgreSQL or server E2E. It checks canonical domain authority, required content boundaries, internal anchors, sitemap/robots consistency, absence of executable JavaScript, and accidental stale-domain / historical-price publication.

SITE-S0 source acceptance is not production deployment.
