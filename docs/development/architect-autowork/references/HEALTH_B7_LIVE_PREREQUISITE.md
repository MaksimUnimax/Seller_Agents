# Health P8.4 / B7 — controlled live H3 prerequisite

Date: 2026-09-16
Canonical repository: MaksimUnimax/runtime-fixtures (ID 1369117174)
Health branch at analysis: feature/server-health-h3-p8-4

## Architect status

B7_CONTROLLED_LIVE_H3 is not allowed to use a normal customer account, owner/customer browser profile, copied customer cookies/storage, marketplace credentials, seller data, or raw provider-login automation.

The only acceptable live prerequisite is an owner-approved dedicated Health account/session/profile used only for Health acceptance. CAPTCHA, anti-bot, provider authentication, geoblock and other security controls may never be bypassed.

The accepted B4 Opera Browser Connector capture is structural profile authority only. It explicitly did not establish B7 controlled Health-account reachability and must not be upgraded into live acceptance evidence.

## Current accepted runtime boundary

The accepted ChromeBrowserDriver deliberately launches a fresh headless Chromium browser and a fresh BrowserContext for every Health session. It exposes sessionKind EPHEMERAL_CONTROLLED, does not accept customer userDataDir/storageState/profile/session injection, keeps raw Playwright handles private, and closes the context/browser during cleanup.

The packaged Standard and Work production targets are https://chatgpt.com/ with allowed origin https://chatgpt.com. Work live positive behavior requires an authenticated Work surface. No current repository authority provides a sanctioned dedicated-Health authentication/session provisioning mechanism for that fresh controlled context.

Therefore a positive authenticated Work B7 run cannot be manufactured by copying a customer profile or by adding ad-hoc raw Playwright login steps. Either action would violate the accepted B6 security/session boundary.

## Exact external prerequisite

Before B7 can receive PASS, the owner must provide/authorize a dedicated Health account/session/profile and a sanctioned way for the controlled Health runner to use that dedicated identity without:

- customer-session/profile reuse;
- copying customer cookies/tokens/storage;
- arbitrary generic browser executor authority;
- CAPTCHA/anti-bot/auth/geoblock bypass;
- marketplace/seller credentials or data;
- raw prompt/response/conversation persistence.

If that prerequisite is unavailable, B7 verdict is BLOCKED_EXTERNAL_PREREQUISITE. Do not navigate/send against live ChatGPT merely to obtain a partial/fake PASS.

## Allowed progress while B7 is blocked

Complete all independently startable non-live P8.4 final-readiness work: accepted-stage inventory, architecture/security/privacy/test/fixture evidence reconciliation, exact SHA/CI/readback, full P8.4 diff and forbidden-path audit, secret/privacy audit and final freeze readiness. B8 may record PASS_NONLIVE / BLOCKED_B7_LIVE but must not claim P8.4 ACCEPTED.

Only after a real B7 controlled-live PASS may B8 close full P8.4 and allow P8.5 to start.