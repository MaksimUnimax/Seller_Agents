# Octoport domain migration

Status: DOMAIN-D0 ACCEPTED / DOMAIN-D1 NEXT
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

## Application findings relevant to migration

### Portal

- Browser routes are relative/same-origin.
- Portal BFF reads `CONTROL_PLANE_API_ORIGIN`.
- No old public domain is hardcoded in portal runtime.
- Current cookies are host-only.
- Target production value is expected to be `CONTROL_PLANE_API_ORIGIN=https://api.octoport.ru`.

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

## Migration principle

This is a parallel migration, not a hard cutover.

1. Preserve `docs.selleragents.ru` and all existing working services.
2. Prepare Octoport domain authority/configuration in the repository.
3. Add dedicated Octoport ingress/TLS without removing existing Seller Agents ingress.
4. Deploy and accept portal/API/admin under the Octoport topology when their production deployment boundary is ready.
5. Package new extension builds against Octoport endpoints only after API/portal acceptance.
6. Make Octoport canonical only after the applicable runtime is accepted.
7. Retain old web/domain compatibility as needed; retire old API only after proving no supported client depends on it.

## DOMAIN-D0 safety result

DOMAIN-D0 was read-only. No DNS, nginx, TLS, application configuration, extension, email, database, service or environment changes were performed by the audit.

## DOMAIN-D1 next boundary

DOMAIN-D1 is a repository/domain-authority preparation step. It must NOT deploy portal/API/admin, issue TLS certificates, reload nginx, change databases, or ship an extension.

D1 should:

- replace the old `selleragents.ru` production-domain authority in current normative ingress documentation with the accepted Octoport topology;
- preserve historical evidence instead of rewriting it;
- encode/clarify the same-origin portal/admin rule for `app.octoport.ru/admin/`;
- define configurable production URL/environment names rather than scattering domain literals;
- prepare an exact later ingress/TLS deployment plan for `octoport.ru`, `www.octoport.ru`, `app.octoport.ru`, and `api.octoport.ru`;
- keep `docs.selleragents.ru` operational and out of the Octoport cutover until separately migrated.

No cleanup or unrelated implementation belongs to this branch.
