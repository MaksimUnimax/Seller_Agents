# Octoport domain migration

Status: DOMAIN-D0 / audit pending
Date opened: 2026-09-16
Owner decision: migrate public/product domain family to `octoport.ru` before beginning the new public site implementation.

## Branch

`feature/octoport-domain-migration-2026-09-16`

Base: canonical `main` at `5d7c8853cc69dd95bc6e713cac3fb2aa0a63383c`.

## Current known DNS context

- DNS hosting provider: AdminVPS.
- Existing DNS zone shown by owner: `openscript.ru`.
- Existing zone MUST NOT be modified during DOMAIN-D0.
- Exact current A/AAAA/CNAME records and server-side virtual-host configuration are not yet recorded here.

## Target domain family

Planned target, pending audit confirmation of service topology:

- `octoport.ru` — public site
- `app.octoport.ru` — user portal
- `api.octoport.ru` — API
- `admin.octoport.ru` — admin UI

## Migration principle

This is a parallel migration, not a hard cutover.

1. Preserve the existing domain and services.
2. Audit current DNS, TLS, reverse proxy, environment, CORS/cookies, extension endpoints, email URLs and callbacks read-only.
3. Add the new DNS zone and hostnames in parallel.
4. Add TLS and server routing for new hostnames without removing old ones.
5. Verify portal/API/admin/auth flows on the new domain family.
6. Move new extension builds and outbound links to Octoport.
7. Make Octoport canonical only after acceptance.
8. Retain the old web domain for compatibility/redirects; retire old API only after proving no supported client still depends on it.

## DOMAIN-D0 scope

Read-only audit only. No DNS, Nginx, TLS, application configuration, extension, email, database or production changes are authorized in D0.

Required D0 evidence:

- server public IPv4/IPv6 addresses;
- current DNS records for the existing domain;
- current authoritative name servers;
- Nginx/other reverse-proxy virtual hosts and upstreams;
- installed TLS certificates and covered hostnames;
- production environment domain/base URL variables;
- CORS/CSRF/cookie/domain handling;
- portal/API/admin public endpoints;
- extension server/API URLs and host permissions;
- email sender and absolute links;
- OAuth/payment/webhook/callback URLs if any;
- current dependencies on the old domain.

No cleanup or unrelated implementation belongs to this branch.
