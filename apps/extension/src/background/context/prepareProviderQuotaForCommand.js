async function prepareProviderQuotaForCommand(
  command,
  executionContext = null,
) {
  const normalized = OzonContract.normalizeCommand(command);
  const preflight = OzonContract.preflightExecution(normalized);
  if (String(preflight.meta.provider || "seller_api") !== "seller_api") {
    return Object.freeze({ required: false, allowed: true, quota: null });
  }
  const quotaFamily =
    normalized.operation === "analytics_data"
      ? ANALYTICS_QUOTA_FAMILY
      : normalized.operation === "stock_turnover_analytics"
        ? STOCK_TURNOVER_QUOTA_FAMILY
        : null;
  if (!quotaFamily)
    return Object.freeze({ required: false, allowed: true, quota: null });
  let settings;
  try {
    settings = await (executionContext
      ? executionContext.settings()
      : getSettings());
  } catch (_) {
    if (_?.execution_context_error) throw _;
    return Object.freeze({
      required: true,
      allowed: true,
      quota: null,
      scheduler_skipped: "credentials_unavailable",
    });
  }
  let present = false;
  try {
    present =
      OzonCredentials.normalizeSellerCredentials(settings.sellerCredentials, {
        required: false,
      }).present === true;
  } catch (_) {
    if (_?.execution_context_error) throw _;
    present = false;
  }
  if (!present)
    return Object.freeze({
      required: true,
      allowed: true,
      quota: null,
      scheduler_skipped: "credentials_unavailable",
    });
  try {
    const permit = await acquireAnalyticsProviderQuota(
      settings.sellerCredentials,
      Date.now(),
      quotaFamily,
    );
    return Object.freeze({
      required: true,
      allowed: permit.allowed === true,
      quota: permit,
    });
  } catch (error) {
    const blocked = Object.assign(
      new Error(
        "Persistent provider quota state недоступен; rate-limited Seller provider request заблокирован до восстановления scheduler state.",
      ),
      {
        code: "PROVIDER_QUOTA_STATE_UNAVAILABLE",
        external_request_executed: false,
        scheduler_cause_code: String(
          error?.code || error?.name || "QUOTA_STATE_ERROR",
        ).slice(0, 160),
      },
    );
    return Object.freeze({
      required: true,
      allowed: false,
      quota: null,
      error: blocked,
    });
  }
}
