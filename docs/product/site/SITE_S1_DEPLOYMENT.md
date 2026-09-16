# Octoport SITE-S1 static deployment

Status: PREPARED / NOT DEPLOYED

SITE-S1 turns the already-accepted static public-site source into a reproducible nginx deployment, but repository preparation is not production activation.

## Runtime boundary

The public site remains a dependency-free static surface from `apps/site/public/`.

Target live path:

`/var/www/octoport-site/current`

Immutable releases are staged under:

`/var/www/octoport-site/releases/<git-sha>`

The `current` symlink is switched atomically only inside the bounded deploy script.

## Ingress boundary

SITE-S1 changes only the public apex behavior after deployment:

- `https://octoport.ru/` -> static public site;
- `https://www.octoport.ru/*` -> permanent redirect to canonical apex;
- `https://app.octoport.ru/` -> remains explicit `503` until portal deployment;
- `https://api.octoport.ru/` -> remains explicit JSON `503` until API deployment;
- `admin.octoport.ru` -> remains disabled as an nginx application hostname;
- `docs.selleragents.ru` -> must remain operational and keep its own certificate.

## Safety design

`infra/production/scripts/deploy-octoport-site.sh` requires:

- root execution on the accepted server;
- clean repository checkout;
- expected public IPv4 and DNS resolution;
- accepted Octoport certificate with at least seven days remaining;
- active nginx and certbot timer;
- valid source files and closed-beta copy;
- an existing `current` path only if it is a symlink.

Before changing live state it creates a root-only backup under `/var/backups/octoport-site/<UTC-stamp>/` containing the previous Octoport nginx configs and previous current-release target.

On any failure after the backup boundary it captures diagnostics and restores the previous nginx/current state. The deployment uses nginx reload, not restart, and contains no recursive forced cleanup of releases.

## Header/cache invariant

The public-site security headers are defined at the apex `server` level. Static locations use nginx `expires` for cache policy instead of location-level `add_header Cache-Control`; this preserves inherited CSP, X-Frame-Options and X-Content-Type-Options on CSS and other static responses.

The live verifier explicitly checks this inheritance on `styles.css`.

## Acceptance gates before server execution

Repository preparation must pass:

- `Site CI`;
- `Site Deploy CI`;
- Documentation CI;
- architect readback of the final diff against current `main`.

Server execution is a separate action performed only after source acceptance. Successful server execution must run the deploy script and then the verifier again, recording exact checkout SHA, backup path, release target, HTTP/HTTPS matrix, security headers, TLS/SNI result, old docs preservation and nginx state.

Until that server execution is accepted, `octoport.ru` remains on the DOMAIN-D2 intentional `503` behavior.
