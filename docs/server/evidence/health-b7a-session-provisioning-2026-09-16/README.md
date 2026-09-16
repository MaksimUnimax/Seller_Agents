# Health B7A R1 capability-provenance evidence

Task: `SA-HEALTH-B7A-R1-CAPABILITY-PROVENANCE-20260916-01`

This directory contains sanitized, non-live evidence for the bounded
correction of the rejected B7A dedicated-session design. Architect review
identified a design defect: a structural binding and optional driver argument
allowed loader-authority bypass. The correction makes the local config loader
the sole producer of an opaque runtime capability.

The public package exposes only the type-only
`DedicatedHealthSessionRegistry`, the loader, its bounded config error, and the
dedicated factory. Sensitive bindings are held in a module-private registry
`WeakMap`; the driver has a separate private association `WeakMap`. A forged
registry is rejected before launch/state consumption, and an extra JavaScript
constructor argument has no authority.

The valid pre-fix RED used synthetic temporary state and loopback only. Both
bypasses were observed to send the synthetic cookie on candidate
`592b51da31ab5ecfd0e4d4b3e981897849731614`. Post-fix dedicated Chromium tests
pass, including the real temporary config → loader → opaque registry → factory
chain, forged-registry rejection, constructor-argument isolation, missing
target rejection, root-export absence, and default/dedicated cookie isolation.

Work route/config validation remains deterministic and exact: HTTPS,
`https://chatgpt.com` packaged authority, no credentials/query/hash, valid
packaged project/conversation route, and strict file safety. The old fabricated
loopback Work positive was removed; no live provider call is part of R1.

No actual path, URL, project/conversation identifier, token, cookie value,
account, credential, or storage-state content is published. All test material
was synthetic and temporary. There were zero live ChatGPT/provider/marketplace/
customer-session calls and zero login, CAPTCHA, anti-bot, authentication,
geoblock, or security bypasses.

Focused results: Health full unit suite 119 passed, required Health subset 109
passed, isolated dedicated Chromium E2E 7 passed, full lint/typecheck/build/
OpenAPI/bridge/docs checks passed. Database-dependent integration, migration,
and canonical webserver-backed E2E gates were not claimable because this
environment had no `DATABASE_URL`.

This evidence does not claim B7 live PASS, P8.4 acceptance, or P8.5 readiness.
The remaining external prerequisite is owner-provisioned dedicated Health auth
state/config for Standard and Work plus an approved dedicated Work
project/conversation route, all outside Git.
