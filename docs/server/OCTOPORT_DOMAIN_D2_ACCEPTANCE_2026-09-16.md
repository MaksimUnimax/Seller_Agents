# Octoport DOMAIN-D2 ingress acceptance — 2026-09-16

Status: ACCEPTED.

## Scope

DOMAIN-D2 establishes pre-deployment HTTPS ingress for the already-prepared Octoport DNS without deploying portal, API, admin, public site, SMTP, databases, or extension runtime.

Enabled application hostnames at this stage:

- `octoport.ru`;
- `www.octoport.ru`;
- `app.octoport.ru`;
- `api.octoport.ru`.

`admin.octoport.ru` remains DNS-only/reserved and is not an nginx application hostname. The accepted future admin route remains `https://app.octoport.ru/admin/` so portal/admin stay same-origin.

`docs.selleragents.ru` remains outside this cutover and must stay operational.

## Accepted implementation

Repository branch:

`feature/octoport-ingress-d2-2026-09-16`

Accepted execution head:

`c6fce080d7e11d8684b44245487d146c4c915722`

Prepared implementation:

- `infra/production/nginx/octoport-bootstrap.conf`;
- `infra/production/nginx/octoport-predeploy.conf`;
- `infra/production/scripts/deploy-octoport-ingress.sh`;
- `infra/production/scripts/verify-octoport-ingress.sh`.

The deploy script performs bounded DNS/IP preflight, existing-config backup, ACME bootstrap, certificate issuance/reuse, nginx validation/reload, post-deploy verification, and rollback on failure. The verifier allows a bounded convergence window after graceful nginx reload before declaring an SNI failure.

## First execution — safe failure and rollback

The first execution was performed from exact head:

`6eeabbd209a73acdbdd0ab2dbf0f93a33c94da32`

The Let's Encrypt certificate was issued successfully, but the first verifier checked SNI immediately after graceful reload and observed the previous `docs.selleragents.ru` certificate before worker convergence. It failed with:

`octoport.ru is not serving the Octoport certificate`

The prepared rollback executed successfully. Existing `docs.selleragents.ru` remained healthy and unchanged.

Backup from that attempt:

`/var/backups/octoport-ingress/20260916T054456Z`

The architect corrected the verifier rather than changing the nginx topology: bounded SNI convergence retry plus failure diagnostics captured before rollback.

## Final accepted server execution

Execution checkout:

`/root/octoport-domain-d2-exec`

Exact accepted head:

`c6fce080d7e11d8684b44245487d146c4c915722`

Git status before/after: clean.

Static checks:

- `bash -n infra/production/scripts/deploy-octoport-ingress.sh` — PASS;
- `bash -n infra/production/scripts/verify-octoport-ingress.sh` — PASS;
- `nginx -t` — PASS.

Deployment command:

`bash infra/production/scripts/deploy-octoport-ingress.sh`

Result: PASS.

Backup created by the accepted run:

`/var/backups/octoport-ingress/20260916T062619Z`

The already-issued certificate was reused. `octoport.ru` converged to the new SNI certificate on verifier attempt `2/20`, confirming the first failure class was a short graceful-reload convergence window rather than a wrong nginx hostname topology.

The explicit post-deploy verifier was run again and PASSed.

## TLS evidence

Certificate path:

`/etc/letsencrypt/live/octoport.ru/fullchain.pem`

Certificate subject:

`CN = octoport.ru`

Issuer:

Let's Encrypt, `CN = YR1`.

SANs:

- `octoport.ru`;
- `www.octoport.ru`;
- `app.octoport.ru`;
- `api.octoport.ru`.

Validity observed during acceptance:

- notBefore: 2026-09-16;
- notAfter: 2026-12-15.

Renewal configuration exists under `/etc/letsencrypt/renewal/octoport.ru.conf`; `certbot.timer` was active.

All four enabled Octoport HTTPS hostnames served the Octoport certificate by SNI at acceptance.

## HTTP/HTTPS behavior

| Host | HTTP | HTTPS | Accepted meaning |
|---|---|---|---|
| `octoport.ru` | `308` to HTTPS | `503` | Public site not deployed yet |
| `www.octoport.ru` | `308` to HTTPS | `308` to `https://octoport.ru/` | Redirect-only canonical alias |
| `app.octoport.ru` | `308` to HTTPS | `503` | Portal not deployed yet |
| `api.octoport.ru` | `308` to HTTPS | `503` JSON (`application/json`) | API not deployed yet |

The `503` responses are intentional pre-deployment behavior. DOMAIN-D2 must not fabricate a portal/API/site or proxy to nonexistent application processes.

## Old docs safety

After accepted D2 deployment:

- `https://docs.selleragents.ru/` continued to return its existing `301` to `/ozon-ai/`;
- it continued to serve certificate `CN = docs.selleragents.ru`;
- its existing nginx behavior remained unchanged.

Therefore the active legacy documentation service was preserved as required.

## Admin safety

`admin.octoport.ru` was not present as an nginx application `server_name` after deployment.

This is intentional. The DNS record may remain reserved; the accepted admin application route is future `https://app.octoport.ru/admin/`.

## Runtime state after D2

Accepted facts after DOMAIN-D2:

- Octoport DNS: prepared;
- Octoport TLS: installed and renewing through Certbot;
- explicit Octoport nginx ingress: active;
- `www` canonical redirect: active;
- public site: NOT_DEPLOYED;
- portal: NOT_DEPLOYED;
- API: NOT_DEPLOYED;
- admin application: NOT_DEPLOYED;
- extension production package: NOT_CREATED;
- production SMTP/OTP path: NOT_ACCEPTED;
- `docs.selleragents.ru`: ACTIVE and preserved.

DOMAIN-D2 is infrastructure acceptance only. It is not production product launch and does not imply portal/API/admin/site readiness.
