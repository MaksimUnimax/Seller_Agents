/* Read-only projection of already verified bootstrap metadata.
 * This layer deliberately grants no Work, dispatch, replay, or scheduler authority. */
(() => {
  "use strict";

  const client = globalThis.SellerAgentsControlClient;
  if (!client || typeof client.bootstrapWithPolicy !== "function")
    throw new Error("SIGNED_METADATA_CONTROL_CLIENT_MISSING");

  const SOURCES = new Set(["ONLINE", "CACHE"]);
  const FRESHNESS = new Set(["FRESH", "STALE_BUT_OFFLINE_GRACE_ELIGIBLE"]);

  function fail() {
    return Object.assign(new Error("BOOTSTRAP_METADATA_INVALID"), {
      code: "BOOTSTRAP_METADATA_INVALID",
    });
  }

  function plainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function freezeCopy(value) {
    const copy = value == null ? value : JSON.parse(JSON.stringify(value));
    const freeze = current => {
      if (!current || typeof current !== "object" || Object.isFrozen(current)) return current;
      for (const nested of Object.values(current)) freeze(nested);
      return Object.freeze(current);
    };
    return freeze(copy);
  }

  function projectVerifiedMetadata(result) {
    const payload = result?.payload;
    if (
      !plainObject(result) ||
      !SOURCES.has(result.source) ||
      !FRESHNESS.has(result.freshness) ||
      !plainObject(payload) ||
      !Number.isSafeInteger(payload.configVersion) ||
      payload.configVersion <= 0 ||
      !["BETA", "COMMERCIAL", "NONE"].includes(payload.accessBasis) ||
      !plainObject(payload.entitlements) ||
      !plainObject(payload.features)
    ) throw fail();

    let ai;
    if (payload.ai?.status === "RESOLVED") {
      if (!plainObject(payload.ai.detected) || !plainObject(payload.ai.profile)) throw fail();
      ai = {
        status: "RESOLVED",
        detected: payload.ai.detected,
        profile: payload.ai.profile,
      };
    } else if (payload.ai?.status === "UNCONFIGURED") {
      ai = { status: "UNCONFIGURED" };
    } else {
      throw fail();
    }

    return freezeCopy({
      metadataVersion: "signed_bootstrap_metadata_v1",
      source: result.source,
      freshness: result.freshness,
      executionAuthority: false,
      configVersion: payload.configVersion,
      accessBasis: payload.accessBasis,
      signedEntitlements: payload.entitlements,
      signedFeatures: payload.features,
      ai,
    });
  }

  async function getVerifiedBootstrapMetadata(options = {}) {
    return projectVerifiedMetadata(await client.bootstrapWithPolicy(options));
  }

  globalThis.SellerAgentsControlClient = Object.freeze({
    ...client,
    getVerifiedBootstrapMetadata,
  });
})();
