async function readAnalyticsResultCacheForCurrentSettings(
  command,
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
    if (normalized.present !== true)
      return Object.freeze({ hit: false, reason: "credentials_unavailable" });
    return await readAnalyticsResultCache(command, settings.sellerCredentials);
  } catch (_) {
    if (_?.execution_context_error) throw _;
    return Object.freeze({ hit: false, reason: "cache_read_unavailable" });
  }
}
