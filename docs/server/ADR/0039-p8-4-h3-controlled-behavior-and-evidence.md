# ADR-0039: P8.4 H3 controlled behavior and sanitized evidence boundary

Date: 2026-09-14
Status: Accepted for P8.4 implementation

## Context

P8.3 accepted a packaged deny-by-default `BrowserDriver` for H2 structural smoke. It intentionally does not expose arbitrary URL, selector, script, fill, click, or send authority. P8.4 must add H3 live behavioral smoke for ChatGPT Standard and ChatGPT Work without turning the server health runner into a generic browser automation endpoint.

The H3 sequence is fixed by `HEALTH_SYSTEM.md`: identify surface, identify composer, insert a deterministic prompt, send exactly once, observe busy, observe the assistant response, observe completion, validate Bridge-shaped surfaces, then clean/reset according to the controlled-account runbook.

## Decision

1. H3 accepts a packaged target key, a packaged surface id, and a packaged prompt id. It never accepts raw prompt text, selectors, executable scripts, or arbitrary URLs from a remote profile or API input.
2. `BRIDGE_COMMAND_SMOKE_V1` is a local benign prompt. It asks for a deterministic fenced-code response and explicitly forbids tool/external-data use. It does not contain an Ozon Bridge command envelope and therefore must not cause a provider request.
3. The behavioral step order is packaged and immutable at runtime. A caller cannot skip `SEND_ONCE`, repeat it, or reorder cleanup through the H3 plan contract.
4. H3 browser actions must be exposed only as typed packaged operations for approved Standard/Work profiles. Generic `fill(selector, text)`, `click(selector)`, `evaluate(script)`, or unrestricted navigation APIs remain forbidden.
5. H3 evidence is sanitized at the capture boundary. The server-facing evidence contract contains only bounded enum/boolean/count/timing metadata. Raw prompt/response text, full conversation content, raw HTML, arbitrary DOM fragments, cookies, tokens, storage state, and screenshot bytes are not valid fields.
6. Live H3 uses dedicated controlled health accounts/sessions only. Customer sessions are forbidden. Session secrets and authentication state remain outside Git.
7. Deterministic fixture tests remain ordinary CI. Live ChatGPT Standard/Work H3 is a separate controlled acceptance/operational check and must not make ordinary code CI depend on third-party availability.
8. This ADR does not start P8.5 scheduling/incidents, P8.6 H4/H5/admin hooks, P9 diagnostics, or P11 Bridge integration.

## Consequences

P8.4 can add the minimum packaged interaction vocabulary needed for H3 while preserving the P8.3 security boundary. Provider-specific drift is represented by versioned packaged behavior profiles and deterministic tests rather than by remotely supplied executable browser instructions.
