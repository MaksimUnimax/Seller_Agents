# Health P8.4 / B7A — architect security review

Date: 2026-09-16
Repository: MaksimUnimax/runtime-fixtures
Product branch: feature/server-health-h3-p8-4
Candidate head: 592b51da31ab5ecfd0e4d4b3e981897849731614
Base: 90c1e0c66a47692634eb652aa1392fdafc1f8f10

## Verdict

SA-HEALTH-B7A-SESSION-PROVISIONING-20260916-01: REWORK_REQUIRED.

The candidate is not accepted even if its exact-head CI is green. The defect is a security-boundary/provenance flaw in the architect-approved B7A design, not an executor deviation: the original task explicitly allowed a direct DedicatedHealthSessionBinding path and a direct loopback binding in E2E. That design made the strict file-backed loader optional rather than authoritative.

B8 non-live readiness remains accepted in its bounded pre-B7A scope. P8.4 remains NOT_ACCEPTED. P8.5 remains NOT_STARTED.

## Exact candidate facts

Remote Health head independently read back as 592b51da31ab5ecfd0e4d4b3e981897849731614.
Tree: 1e4737933665a6ba6d02e491e7873d3f40e47e6f.
Parent: 90c1e0c66a47692634eb652aa1392fdafc1f8f10.
Base-to-candidate compare: ahead 1 / behind 0 / merge base exact base.
Exactly eight allowlisted paths changed and no unrelated scope changed.

The loader itself correctly implements many intended checks: strict target keys, absolute paths, lstat regular/non-symlink checks, bounded sizes, POSIX owner-only permissions, distinct state-file identity, strict Work URL validation, bounded safe errors and serialization redaction.

Those checks are nevertheless bypassable by the current public construction path.

## Proven defect — direct binding bypass

Current root API exports:

- ChromeBrowserDriver;
- createDedicatedHealthChromeBrowserDriver;
- DedicatedHealthSessionRegistry as a runtime class;
- DedicatedHealthSessionBinding as a structural TypeScript type.

Current ChromeBrowserDriver constructor accepts an optional third dedicatedBinding argument. createDedicatedHealthChromeBrowserDriver accepts a DedicatedHealthSessionBinding directly and simply passes it to that constructor.

There is no runtime proof that such a binding came from loadDedicatedHealthSessionRegistry.

The new E2E itself proves the bypass is reachable: its standardBinding()/workBinding() helpers construct plain JavaScript objects and pass them directly to createDedicatedHealthChromeBrowserDriver. The synthetic cookie is then consumed successfully by Chromium without the file-backed registry being involved.

The risk is stronger than a later navigation bypass: launch() calls browser.newContext({ storageState: binding.storageStatePath }) before open() performs target/start-URL ownership checks. Therefore a fabricated direct binding can cause an arbitrary accessible storage-state path to be consumed before target mismatch or unsafe startUrl is rejected.

Consequences:

- lstat symlink/regular-file checks become optional;
- size and POSIX permission checks become optional;
- Standard/Work distinct-state check becomes optional;
- a caller can point the driver at a normal owner/customer storage-state file rather than a dedicated Health file;
- the accepted B6/B7 security invariant “only explicitly dedicated Health state can be provisioned / no customer-session reuse” is not enforced by runtime authority.

Green tests/CI cannot override this architectural defect because the tests currently exercise the bypass as a positive helper path.

## R1 architecture decision

The local config loader must be the sole producer of a runtime capability that can attach auth state to ChromeBrowserDriver.

### 1. Opaque registry capability

Replace the current constructible/public-binding model with an opaque loader-created registry capability.

Inside dedicated-health-session.ts keep the sensitive bindings in a module-private WeakMap keyed by loader-created registry objects. A registry returned by loadDedicatedHealthSessionRegistry is inserted into that WeakMap only after all config/state/Work-route checks pass.

The package root may export a DedicatedHealthSessionRegistry TYPE for callers, but must not export a constructible runtime registry class or any direct sensitive binding type/value that can be passed to the driver.

External code must not receive a public resolve() result containing storageStatePath/startUrl. Safe target inventory/metadata may be exposed only if needed and must not contain those sensitive values.

Add a module-internal resolver used only by browser-driver.ts. It must reject any object not present in the private WeakMap with one bounded safe error such as UNTRUSTED_SESSION_REGISTRY/TARGET_NOT_CONFIGURED and no secret text.

### 2. Default ChromeBrowserDriver must have no direct injection parameter

Restore the public ChromeBrowserDriver constructor to its pre-B7A shape:

ChromeBrowserDriver(targets, launchTimeoutMs?)

No third binding/options argument may attach storage state.

Use a module-private WeakMap in browser-driver.ts to associate a driver instance with a trusted binding only from the dedicated factory. JavaScript callers passing a third argument to new ChromeBrowserDriver must not obtain session injection.

### 3. Dedicated factory accepts registry + target key, not binding/path

New public shape:

createDedicatedHealthChromeBrowserDriver(targets, registry, targetKey, launchTimeoutMs?)

The factory resolves the target-specific hidden binding through the module-internal trusted-registry resolver and then stores it in the driver-private WeakMap.

No public API accepts storageStatePath or Work startUrl directly.

The existing target/origin/route defenses in open() remain. launch() may use storageState only after the driver was associated with a loader-created trusted binding.

### 4. Root exports

index.ts must stop re-exporting DedicatedHealthSessionBinding.

DedicatedHealthSessionRegistry should be a type-only/opaque public contract; do not expose a public constructible class as the capability source.

Keep loadDedicatedHealthSessionRegistry, DedicatedHealthSessionConfigError and safe error-code type public.

### 5. Regression proof

Add explicit RED-before-fix proof on the exact candidate:

- a fabricated plain binding object can currently inject a synthetic storage-state cookie through createDedicatedHealthChromeBrowserDriver without loader authority;
- a JavaScript third constructor argument can currently do the same through ChromeBrowserDriver.

Record that as the valid security RED. Do not manufacture a provider/live failure.

Post-fix tests must prove:

- a plain forged registry object cast to the public type is rejected before browser launch/state consumption;
- a caller cannot new a public runtime DedicatedHealthSessionRegistry from the root package;
- ChromeBrowserDriver ignores/rejects any extra JavaScript third argument and remains an anonymous fresh context;
- only a registry returned by loadDedicatedHealthSessionRegistry can create a dedicated driver;
- Standard positive cookie consumption uses a real temporary config -> loader -> registry -> factory chain;
- default-driver cookie isolation remains intact;
- Work valid production config still parses only exact https://chatgpt.com packaged route authority, but no live Work navigation is required in R1;
- target mismatch/missing target fails through registry/factory before navigation;
- serialization remains redacted;
- no H2/H3 plan schema or remote authority widening occurs.

The old direct loopback Work binding positive E2E must be removed/replaced because it is the bypass. Work route parsing/registry authority can be proven deterministically without a live provider call. Actual authenticated Work navigation remains B7 live acceptance after R1.

## Scope

R1 may modify only the same eight B7A paths already changed by the candidate. No package/dependency, target registry, H2/H3 plan, Standard/Work strategy/profile, shared contract, API/OpenAPI, DB/migration, reserved public-doc, site/SEO/domain or private-control change is authorized.

Preserve the correct parts of the candidate: strict file safety, strict Work production URL authority, fresh EPHEMERAL_CONTROLLED context, no writeback, no raw handle exposure, bounded errors, sanitized evidence and zero live calls.

Do not rewrite B8 history or claim P8.4 accepted.
