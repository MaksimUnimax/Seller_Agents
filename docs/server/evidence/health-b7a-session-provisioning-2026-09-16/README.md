# Health B7A session provisioning evidence

Task: `SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01`

This directory contains sanitized non-live evidence for the dedicated Health
session/target provisioning foundation. The registry, browser driver and tests
preserve fresh `EPHEMERAL_CONTROLLED` contexts, strict local-only authority,
target ownership, Work route validation, bounded failures and result privacy.

The config shape is version `number`, a strict `targets` object, and target
bindings containing only `storageStatePath: string` for Standard or
`storageStatePath: string` plus `startUrl: string` for Work. Config/state files
are owner-only files outside Git. No actual path, URL, project/conversation
identifier, token, cookie, account or storage-state content is published.

Reauthentication is an explicit operator action: reprovision or replace the
dedicated Health state out of band, preserve restrictive permissions, and rerun
controlled Health. Login, CAPTCHA, anti-bot, authentication and geoblock
controls are never automated or bypassed. The runtime never persists refreshed
credentials.

The evidence records a non-live implementation candidate only. It does not
claim B7 live PASS, P8.4 acceptance or P8.5 readiness. The remaining external
prerequisite is owner-provisioned dedicated Health auth state/config for
Standard and Work plus an approved dedicated Work project/conversation route,
all outside Git.
