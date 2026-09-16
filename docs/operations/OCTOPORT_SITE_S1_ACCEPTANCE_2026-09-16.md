# Octoport SITE-S1 live acceptance — 2026-09-16

Status: **LIVE ACCEPTED** for the bounded SITE-S1 static public-site deployment.

This is a technical/live acceptance of the current static foundation. It is **not** a declaration that the public site's branding, copy, funnel, SEO content program, registration flow, or final visual identity is complete.

## Accepted source

Repository: `MaksimUnimax/Seller_Agents`

Exact deployed source commit:

`16c0ac9b6aa9a72aa3100eb04f14bd74e4d6593a`

The deployment was intentionally pinned to this exact commit so that concurrent Seller Agents work could continue independently without changing the release under test.

Immutable release path:

`/var/www/octoport-site/releases/16c0ac9b6aa9a72aa3100eb04f14bd74e4d6593a`

Current release symlink resolved to that release during acceptance.

Server backup created by the accepted deploy:

`/var/backups/octoport-site/20260916T073803Z`

## Server execution acceptance

Prepared deployment command:

```bash
bash infra/production/scripts/deploy-octoport-site.sh
```

Result: PASS.

Prepared verifier was then run explicitly:

```bash
EXPECTED_SITE_SHA=16c0ac9b6aa9a72aa3100eb04f14bd74e4d6593a \
  bash infra/production/scripts/verify-octoport-site.sh
```

Result: PASS.

`nginx -t`: PASS.

Observed services at acceptance:

- nginx: active;
- `certbot.timer`: active.

No repository commit or push was performed by the server executor.

## Accepted live routing

| Route | Accepted result |
|---|---|
| `http://octoport.ru/` | `308` to HTTPS |
| `https://octoport.ru/` | `200`, static Octoport site |
| `https://octoport.ru/styles.css` | `200`, `text/css` |
| `https://octoport.ru/robots.txt` | `200` |
| `https://octoport.ru/sitemap.xml` | `200` |
| `http://www.octoport.ru/` | `308` to HTTPS |
| `https://www.octoport.ru/` | `308` to canonical `https://octoport.ru/` |
| `http://app.octoport.ru/` | `308` to HTTPS |
| `https://app.octoport.ru/` | intentional `503`; portal remains undeployed |
| `http://api.octoport.ru/` | `308` to HTTPS |
| `https://api.octoport.ru/` | intentional JSON `503`; API remains undeployed |

The API predeployment response retained the `service_not_deployed` marker.

`admin.octoport.ru` remains DNS-only/reserved and was not present as an nginx application `server_name`.

The accepted future admin topology remains same-origin under `https://app.octoport.ru/admin/`.

## Static release integrity

The accepted live release contains the required public files:

- `index.html`;
- `styles.css`;
- `robots.txt`;
- `sitemap.xml`.

Previous release directories were not deleted.

## Content truth checks

The live homepage was verified to contain:

- Octoport page title;
- canonical `https://octoport.ru/`;
- the current closed-beta marker `Набор ещё не открыт`;
- no public homepage references to `selleragents.ru` or `openscript.ru`.

The public site remains a static foundation and does not imply that portal registration, API production access, payments, or the public beta are already open.

## Security-header acceptance

Homepage acceptance included:

- `Content-Security-Policy` with restrictive `default-src 'none'`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy`.

`styles.css` was separately verified to retain inherited:

- `Content-Security-Policy`;
- `X-Content-Type-Options`;
- `X-Frame-Options`.

This specifically verifies the SITE-S1 correction that avoided location-level `add_header Cache-Control` overriding nginx security-header inheritance.

## TLS/SNI acceptance

Accepted Octoport certificate:

- subject: `CN = octoport.ru`;
- issuer: Let's Encrypt, `CN = YR1`;
- SANs: `octoport.ru`, `www.octoport.ru`, `app.octoport.ru`, `api.octoport.ru`;
- observed validity: 2026-09-16 through 2026-12-15.

All four enabled Octoport HTTPS hostnames served the accepted Octoport certificate by SNI.

## Existing docs safety

`https://docs.selleragents.ru/` remained operational with its previous redirect behavior.

Its certificate remained:

`CN = docs.selleragents.ru`

The Octoport deployment did not replace the docs certificate or route.

## Independent browser/live acceptance

After server acceptance, the architect independently opened the live service through the Opera Browser Connector.

Observed live state:

- `https://octoport.ru/` rendered the real Octoport page rather than the previous DOMAIN-D2 503;
- the live accessibility tree exposed the expected heading, navigation, Ozon/Wildberries diagram, four-step flow, data/privacy section and closed-beta section;
- desktop hero layout rendered without the previously fixed overlap between the Russian H1 and the right-hand marketplace/AI diagram;
- the marketplace/data panel rendered intact;
- the closed-beta panel rendered intact and visibly retained `Набор ещё не открыт`;
- `https://app.octoport.ru/` still displayed `Octoport portal is not deployed yet.`;
- `https://api.octoport.ru/` still displayed `{"error":"service_not_deployed"}`;
- a `www.octoport.ru` probe reached the corresponding canonical apex path, confirming the canonical redirect remained active.

No visual/live blocker was found for the bounded SITE-S1 foundation.

## Boundary after acceptance

SITE-S1 establishes and accepts the live static public-site foundation only.

Still separate future work includes, among other things:

- final Octoport logo/brand asset integration;
- product-copy/landing refinement against the accepted SEO/product truth authority;
- additional SEO pages/content according to the dedicated SEO stream;
- real beta registration/account entry when the portal deployment boundary is accepted;
- portal/API/admin deployment;
- production extension package pointed at Octoport endpoints;
- production SMTP/OTP acceptance;
- payments/monetization activation.

A later SEO semantic-foundation merge into `main` occurred after the exact SITE-S1 release commit. That merge changed documentation authority only and did not change the already-deployed SITE-S1 release bytes. Future public-site content work must consume the current `docs/seo/**` authority before changing public copy or information architecture.
