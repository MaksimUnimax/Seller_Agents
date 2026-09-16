# Octoport domain migration

Status: DOMAIN-D0 ACCEPTED / DOMAIN-D1 ACCEPTED / DOMAIN-D2 NEXT
Date opened: 2026-09-16
Owner decision: migrate public/product domain family to `octoport.ru` before beginning the new public site implementation.

## Branch

`feature/octoport-domain-migration-2026-09-16`

Base: canonical `main` at `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`.

## DOMAIN-D0 accepted facts

Read-only server/DNS audit completed 2026-09-16.

- Server: `Easyscript`, public IPv4 `78.17.68.165`, no public IPv6 observed.
- Nginx is active; there is currently no production Seller Agents portal/API/admin deployment.
- Existing working product-domain service is `docs.selleragents.ru` static documentation with its own Let's Encrypt certificate.
- `selleragents.ru` and `api.selleragents.ru` resolve to this server but do not currently have deployed product application vhosts.
- `openscript.ru` is unrelated/historical and is not part of this migration.
- Existing Seller Agents documentation service must remain untouched during the Octoport migration.

## Octoport DNS already prepared by owner

Authoritative DNS is hosted by AdminVPS.

Current A records:

- `octoport.ru` -> `78.17.68.165`
- `www.octoport.ru` -> `78.17.68.165`
- `app.octoport.ru` -> `78.17.68.165`
- `api.octoport.ru` -> `78.17.68.165`
- `admin.octoport.ru` -> `78.17.68.165`

AdminVPS also created mail-related records (`mail`, `pop`, `smtp`, MX and TXT). Their presence is not acceptance of application email and they are outside domain-ingress acceptance until a production SMTP/mail decision is made.

The `admin.octoport.ru` A record may remain in DNS, but it is not an enabled application hostname in the accepted initial topology.

## Accepted target domain family

Initial Octoport topology:

- `https://octoport.ru/` - future public marketing/site application.
- `https://www.octoport.ru/` - canonical redirect to `https://octoport.ru/`.
- `https://app.octoport.ru/` - user portal.
- `https://app.octoport.ru/admin/` - admin UI on the SAME web origin as the user portal.
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
- No production API process is currently deployed.
- No public-domain constants or absolute generated links were found.
- Production ingress/service/secrets/database/SMTP remain future deployment work.

### Admin

- Uses relative same-origin BFF calls and host-only cookies.
- Must remain under the same origin as portal in the initial Octoport topology.
- Exact `/admin/` routing/base-path behavior must be accepted before deployment.

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

Repository authority now records:

- Octoport as the future production domain family;
- `octoport.ru` as the future public site origin;
- `app.octoport.ru` as portal origin;
- `app.octoport.ru/admin/` as same-origin admin route;
- `api.octoport.ru` as future public Control Plane API origin;
- `admin.octoport.ru` as reserved/not enabled initially;
- `docs.selleragents.ru` as an active legacy documentation service intentionally preserved until separate migration;
- the 2026-09-09 Seller Agents ingress plan as historical/superseded for future deployment.

DOMAIN-D1 did not modify DNS, nginx, TLS, services, applications, extension runtime, databases or production environment.

## Migration principle

This is a parallel migration, not a hard cutover.

1. Preserve `docs.selleragents.ru` and all existing working services.
2. Keep Octoport domain authority/configuration in the repository.
3. Add dedicated Octoport ingress/TLS without removing existing Seller Agents ingress.
4. Deploy and accept portal/API/admin under the Octoport topology when their production deployment boundary is ready.
5. Package new extension builds against Octoport endpoints only after API/portal acceptance.
6. Make Octoport canonical only after the applicable runtime is accepted.
7. Retain old web/domain compatibility as needed; retire old API only after proving no supported client depends on it.

## DOMAIN-D2 next boundary

DOMAIN-D2 is the first server-side implementation step.

Its scope is bounded ingress/TLS preparation only. It must:

- preserve `docs.selleragents.ru` exactly as a working service;
- add explicit nginx handling for `octoport.ru`, `www.octoport.ru`, `app.octoport.ru` and `api.octoport.ru` without pretending undeployed portal/API apps exist;
- prepare/issue correct TLS only for hostnames that can be safely terminated at this stage;
- prevent Octoport hosts from falling through to the `docs.selleragents.ru` certificate/default behavior;
- keep application upstreams private and avoid exposing nonexistent product processes;
- leave `admin.octoport.ru` disabled as an application hostname;
- validate nginx/certificate behavior and rollback.

Exact D2 implementation details are owned by the architect; server Codex is used only as an executor for bounded server code/config changes and prescribed tests, not for planning or architecture.

No cleanup or unrelated implementation belongs to this branch.
