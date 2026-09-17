# Octoport domain migration

Status: DOMAIN-D0 ACCEPTED / DOMAIN-D1 ACCEPTED / DOMAIN-D2 ACCEPTED
Date opened: 2026-09-16
Owner decision: migrate public/product domain family to `octoport.ru` before beginning the new public site implementation.

## Branches

DOMAIN-D1 authority:

`feature/octoport-domain-migration-2026-09-16`

DOMAIN-D2 ingress:

`feature/octoport-ingress-d2-2026-09-16`

Original canonical base when the migration stream opened:

`5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`.

## DOMAIN-D0 accepted facts

Read-only server/DNS audit completed 2026-09-16.

- Server: `Easyscript`, public IPv4 `78.17.68.165`, no public IPv6 observed.
- Nginx was active; there was no production Seller Agents portal/API/admin deployment.
- Existing working product-domain service was `docs.selleragents.ru` static documentation with its own Let's Encrypt certificate.
- `selleragents.ru` and `api.selleragents.ru` resolved to this server but had no deployed product application vhosts.
- `openscript.ru` is unrelated/historical and is not part of this migration.
- Existing Seller Agents documentation service must remain untouched during the Octoport migration.

## Octoport DNS prepared by owner

Authoritative DNS is hosted by AdminVPS.

Current A records prepared for the migration:

- `octoport.ru` -> `78.17.68.165`
- `www.octoport.ru` -> `78.17.68.165`
- `app.octoport.ru` -> `78.17.68.165`
- `api.octoport.ru` -> `78.17.68.165`
- `admin.octoport.ru` -> `78.17.68.165`

AdminVPS also created mail-related records (`mail`, `pop`, `smtp`, MX and TXT). Their presence is not acceptance of application email and they remain outside application-mail acceptance until a production SMTP/provider decision is made.

The `admin.octoport.ru` A record may remain in DNS, but it is not an enabled application hostname in the accepted initial topology.

## Accepted target domain family

Initial Octoport topology:

- `https://octoport.ru/` - future public marketing/site application;
- `https://www.octoport.ru/` - canonical redirect to `https://octoport.ru/`;
- `https://app.octoport.ru/` - user portal;
- `https://app.octoport.ru/admin/` - admin UI on the SAME web origin as the user portal;
- `https://api.octoport.ru/` - public Control Plane API for packaged clients and BFFs.

`admin.octoport.ru` is intentionally not enabled as a separate admin application origin in the initial topology.

Reason: the accepted admin elevation flow depends on portal session/CSRF cookies. Current cookies are host-only; placing admin on a separate hostname would require an unnecessary authentication/cookie redesign. The prior Seller Agents ingress plan already required portal/admin same-origin for this reason.

Current production ingress authority is [DOMAIN_INGRESS_PLAN_2026-09-16](../server/DOMAIN_INGRESS_PLAN_2026-09-16.md). The 2026-09-09 `selleragents.ru` plan is historical and remains preserved as evidence.

## Application findings relevant to migration

### Portal

- Browser routes are relative/same-origin.
- Portal BFF reads `CONTROL_PLANE_API_ORIGIN`.
- No old public domain is hardcoded in portal runtime.
- Current cookies are host-only.
- Target production value is `CONTROL_PLANE_API_ORIGIN=https://api.octoport.ru` when production deployment is implemented.

### API

- Current source listens on loopback by default.
- No production API process was deployed at D0/D2.
- No public-domain constants or absolute generated links were found.
- Production ingress upstream/service/secrets/database/SMTP remain future deployment work.

### Admin

- Uses relative same-origin BFF calls and host-only cookies.
- Must remain under the same origin as portal in the initial Octoport topology.
- Exact `/admin/` routing/base-path behavior must be accepted before application deployment.

### Extension

Current I1 client is explicitly local-development configured (`127.0.0.1` control-plane endpoints), not an old Seller Agents production package.

Future production package must use:

- API origin `https://api.octoport.ru`;
- portal origin `https://app.octoport.ru`;
- generated extension host permissions for those origins;
- a new accepted package/version.

No production extension client currently needs an emergency old-domain cutover.

### Email

Current repository configuration is development-only (`localhost:1025`, `no-reply@example.test`). Exim/Dovecot exist on the host, but no evidence proves they are the accepted production OTP provider for Octoport. Mail setup remains a separate acceptance boundary.

## DOMAIN-D1 accepted result

Repository authority records:

- Octoport as the future production domain family;
- `octoport.ru` as the future public site origin;
- `app.octoport.ru` as portal origin;
- `app.octoport.ru/admin/` as same-origin admin route;
- `api.octoport.ru` as future public Control Plane API origin;
- `admin.octoport.ru` as reserved/not enabled initially;
- `docs.selleragents.ru` as an active legacy documentation service intentionally preserved until separate migration;
- the 2026-09-09 Seller Agents ingress plan as historical/superseded for future deployment.

DOMAIN-D1 did not modify DNS, nginx, TLS, services, applications, extension runtime, databases or production environment.

## DOMAIN-D2 accepted result

Full evidence: [OCTOPORT_DOMAIN_D2_ACCEPTANCE_2026-09-16](../server/OCTOPORT_DOMAIN_D2_ACCEPTANCE_2026-09-16.md).

Accepted repository execution head:

`c6fce080d7e11d8684b44245487d146c4c915722`.

DOMAIN-D2 added reproducible pre-deployment ingress under `infra/production/` and executed it on `Easyscript`.

Accepted runtime behavior:

- `http://octoport.ru/` -> `308` HTTPS;
- `https://octoport.ru/` -> intentional `503` because the public site is not deployed;
- `http://www.octoport.ru/` -> `308` HTTPS;
- `https://www.octoport.ru/` -> `308` canonical redirect to `https://octoport.ru/`;
- `http://app.octoport.ru/` -> `308` HTTPS;
- `https://app.octoport.ru/` -> intentional `503` because portal is not deployed;
- `http://api.octoport.ru/` -> `308` HTTPS;
- `https://api.octoport.ru/` -> intentional JSON `503` because API is not deployed.

TLS acceptance:

- certificate subject `CN = octoport.ru`;
- SANs: `octoport.ru`, `www.octoport.ru`, `app.octoport.ru`, `api.octoport.ru`;
- Let's Encrypt renewal configuration installed;
- `certbot.timer` active;
- all four enabled Octoport hosts served the accepted Octoport certificate by SNI.

Safety acceptance:

- existing `docs.selleragents.ru` retained its old behavior and its own certificate;
- `admin.octoport.ru` is not configured as an nginx application vhost;
- portal/API/admin/site remain NOT_DEPLOYED;
- no database, SMTP, extension package or application deployment was introduced by D2.

The first D2 server attempt safely failed and rolled back because the verifier sampled SNI immediately after graceful nginx reload. The verifier was patched with a bounded convergence window and failure diagnostics; the final run passed, with `octoport.ru` converging on attempt `2/20`. The nginx hostname topology itself did not require redesign.

## Migration principle

This remains a staged migration, not a claim that all product runtimes are already deployed.

1. Preserve `docs.selleragents.ru` and all existing working services.
2. Keep Octoport domain authority/configuration in the repository.
3. Dedicated Octoport ingress/TLS is now accepted.
4. Deploy and accept portal/API/admin under the Octoport topology when their production deployment boundary is ready.
5. Package new extension builds against Octoport endpoints only after API/portal acceptance.
6. Implement the new public site after the domain migration foundation is stable, per owner sequencing.
7. Retain old web/API compatibility as needed; retire old API only after proving no supported client depends on it.

## State after DOMAIN-D2

- DNS_PREPARED: YES
- DOMAIN_AUTHORITY_ACCEPTED: YES
- OCTOPORT_TLS_ACCEPTED: YES
- OCTOPORT_PREDEPLOY_INGRESS_ACTIVE: YES
- WWW_CANONICAL_REDIRECT_ACTIVE: YES
- PUBLIC_SITE_DEPLOYED: NO
- PORTAL_DEPLOYED: NO
- API_DEPLOYED: NO
- ADMIN_APP_DEPLOYED: NO
- PRODUCTION_EXTENSION_PACKAGE_CREATED: NO
- PRODUCTION_SMTP_OTP_ACCEPTED: NO
- `docs.selleragents.ru` ACTIVE/PRESERVED: YES

No cleanup or unrelated implementation belongs to this migration stream.
