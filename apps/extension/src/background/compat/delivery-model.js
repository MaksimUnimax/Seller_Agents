globalThis.BridgeAutorunModel = globalThis.SellerAgentsDeliveryModel.create(
  globalThis.SellerAgentsOzonDeliveryPlan.create(
    () => globalThis.OzonAIDeliveryCapabilities,
  ),
);
