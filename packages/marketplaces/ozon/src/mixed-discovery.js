(() => {
  "use strict";
  function discover(text, options = {}) {
    return globalThis.SellerAgentsMixedBatchDiscovery.discover(text, {
      ...options,
      commandPrefix: String(options.commandPrefix || "OZON_API_V1"),
      helpPrefixV1: String(options.helpPrefixV1 || "OZON_HELP_V1"),
      helpPrefixV2: String(options.helpPrefixV2 || "OZON_HELP_V2"),
      discoveryFailureMessage:
        "OZON_API_V1 marker could not be converted into a command discovery record.",
    });
  }
  globalThis.OzonMixedBatchDiscovery = Object.freeze({ discover });
})();
