async function storeAnalyticsResultCacheForCurrentSettings(
  command,
  providerResult,
  profile = null,
  executionContext = null,
) {
  try {
    const settings = await (executionContext
      ? executionContext.settings()
      : getSettings());
    const normalized = OzonCredentials.normalizeSellerCredentials(
      settings.sellerCredentials,
      { required: false },
    );
    if (normalized.present !== true) return false;
    return await storeAnalyticsResultCache(
      command,
      providerResult,
      settings.sellerCredentials,
      profile,
      Date.now(),
      executionContext,
    );
  } catch (_) {
    if (_?.execution_context_error) throw _;
    return false;
  }
}
