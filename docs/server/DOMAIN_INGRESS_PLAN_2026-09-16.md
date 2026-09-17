# Octoport production domain and public ingress plan — 2026-09-16

Status: CURRENT DOMAIN AUTHORITY / DNS PREPARED / RUNTIME NOT DEPLOYED.

This document supersedes `DOMAIN_INGRESS_PLAN_2026-09-09.md` for future production deployment. The 2026-09-09 document remains historical evidence of the earlier `selleragents.ru` topology and must not be deleted or rewritten as if it had never been accepted.

## 1. Current domain authority

The future product/public domain family is `octoport.ru`.

Owner-prepared DNS on AdminVPS currently resolves to server IPv4 `78.17.68.165`:

- `octoport.ru` — A `78.17.68.165`;
- `www.octoport.ru` — A `78.17.68.165`;
- `app.octoport.ru` — A `78.17.68.165`;
- `api.octoport.ru` — A `78.17.68.165`;
- `admin.octoport.ru` — A `78.17.68.165`, reserved only and not enabled as an application origin.

AdminVPS-created mail/MX/TXT records do not constitute accepted application email infrastructure. Production OTP email remains a separate provider/SMTP acceptance boundary.

## 2. Accepted initial public topology

The initial Octoport production-facing topology is:

- `https://octoport.ru/` — public marketing/product site;
- `https://www.octoport.ru/` — redirect-only alias to `https://octoport.ru/`;
- `https://app.octoport.ru/` — user portal;
- `https://app.octoport.ru/admin/` — admin UI on the same web origin as the user portal;
- `https://api.octoport.ru/` — public Control Plane API used by accepted packaged clients and server-side BFFs.

`admin.octoport.ru` is intentionally not an enabled application hostname in the initial topology. The accepted admin elevation flow depends on portal session/CSRF cookies; current cookies are host-only. A separate admin hostname would introduce an unnecessary authentication/cookie redesign.

The currently working `https://docs.selleragents.ru/` documentation service is outside this cutover and remains operational until a separate docs migration is explicitly accepted.

## 3. Runtime status at authority change

At the 2026-09-16 DOMAIN-D0 audit:

- nginx is active on server `Easyscript`;
- there is no production Seller Agents/Octoport portal deployment;
- there is no production Control Plane API deployment;
- there is no production admin deployment;
- the current I1 extension package is local-development configured and does not use a public Seller Agents API;
- the only active old-domain product service observed is `docs.selleragents.ru`.

Therefore this change establishes the domain authority before the first production portal/API/admin deployment; it is not a live-user hard cutover.

## 4. Ingress and security requirements

Before public runtime acceptance:

1. nginx (or the accepted reverse proxy) must terminate public HTTP(S) ingress;
2. TLS must cover each enabled Octoport hostname;
3. HTTP must redirect to HTTPS;
4. `www.octoport.ru` must be redirect-only, not a second application origin;
5. Portal/Admin/API application ports must remain loopback/private behind ingress;
6. portal and admin must preserve the accepted same-origin cookie/CSRF boundary;
7. API exposure must preserve authentication, rate limits, exact route/contract boundaries and security headers;
8. direct browser CORS must not be enabled merely because `api.octoport.ru` exists; current portal/admin architecture uses same-origin BFF routes;
9. trusted-proxy/client-IP behavior must be verified before production API exposure;
10. certificate renewal and rollback must be verified before launch;
11. `docs.selleragents.ru` must remain untouched by the Octoport ingress rollout until separately migrated.

## 5. URL/configuration authority

Production URL values must be configurable rather than scattered through runtime source.

Current known real consumer:

- Portal/Admin BFF: `CONTROL_PLANE_API_ORIGIN=https://api.octoport.ru`.

Future public site, deployment or email components may need canonical site/app URLs, but new environment variables must be introduced only when there is an actual runtime consumer. Do not create unused symmetry variables or store secrets in Git.

## 6. Extension production authority

The current I1 development package remains localhost-configured and is not changed by this document.

A future accepted production Octoport extension package must use:

- API origin `https://api.octoport.ru`;
- portal origin `https://app.octoport.ru`;
- generated manifest host permissions for the required Octoport origins;
- its own accepted package/version and installed acceptance.

Domain authority alone does not mean that production extension package exists.

## 7. Email boundary

The DNS records `mail.octoport.ru`, `smtp.octoport.ru`, `pop.octoport.ru`, the MX record and any automatically-created SPF-like TXT record are not proof of a working or accepted OTP mail path.

Production OTP email remains governed by the selected SMTP/provider configuration, sender-domain authentication and deliverability acceptance. No mail host is declared canonical merely because AdminVPS created DNS records for it.

## 8. Migration sequencing

1. DOMAIN-D0 — read-only DNS/server/application audit: accepted.
2. DOMAIN-D1 — repository/domain authority: this document.
3. DOMAIN-D2 — bounded Octoport nginx/TLS ingress preparation, without removing existing working ingress.
4. Production portal/API/admin deployment and acceptance under the Octoport topology when that product boundary is ready.
5. New extension package against Octoport endpoints after portal/API acceptance.
6. Octoport becomes canonical for new product links/packages only after applicable runtime acceptance.
7. Old web/API compatibility is retired only after proving no supported client depends on it.

DNS preparation and this authority document do not themselves constitute production deployment or product acceptance.
