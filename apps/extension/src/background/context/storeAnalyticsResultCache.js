async function storeAnalyticsResultCache(
  command,
  providerResult,
  rawCredentials,
  profile = null,
  nowMs = Date.now(),
  executionContext = null,
) {
  const normalized = OzonContract.normalizeCommand(command);
  if (
    normalized.operation !== "analytics_data" ||
    providerResult?.ok !== true ||
    !providerResult?.result
  )
    return false;
  const descriptor = OzonContract.analyticsCoalescingDescriptor(normalized);
  if (!descriptor?.eligible) return false;
  OzonContract.verifyProviderResponse(normalized, providerResult.result);
  const identity = await sellerQuotaIdentity(rawCredentials);
  const storedResult = jsonCacheClone(providerResult.result);
  await withProviderResultCacheWrite(async () => {
    const data = await storageGet(KEYS.PROVIDER_RESULT_CACHE);
    const state = normalizedProviderResultCacheState(
      data[KEYS.PROVIDER_RESULT_CACHE],
    );
    const currentAccount =
      state.accounts[identity.account_hash] &&
      typeof state.accounts[identity.account_hash] === "object"
        ? { ...state.accounts[identity.account_hash] }
        : { entries: {} };
    const currentEntries =
      currentAccount.entries &&
      typeof currentAccount.entries === "object" &&
      !Array.isArray(currentAccount.entries)
        ? { ...currentAccount.entries }
        : {};
    for (const [entryId, entry] of Object.entries(currentEntries)) {
      if (!entry || Number(entry.expires_at || 0) <= Number(nowMs))
        delete currentEntries[entryId];
    }
    let targetId = null;
    for (const [entryId, entry] of Object.entries(currentEntries)) {
      if (
        String(entry?.compatibility_key || "") !==
        String(descriptor.compatibility_key || "")
      )
        continue;
      const metrics = Array.isArray(entry?.metrics)
        ? entry.metrics.map(String)
        : [];
      if (JSON.stringify(metrics) === JSON.stringify(descriptor.metrics)) {
        targetId = entryId;
        break;
      }
    }
    if (!targetId) targetId = `analytics-${crypto.randomUUID()}`;
    currentEntries[targetId] = {
      compatibility_key: descriptor.compatibility_key,
      compatibility_fingerprint: descriptor.compatibility_fingerprint,
      metrics: [...descriptor.metrics],
      result: storedResult,
      source_request_id: providerResult.request_id
        ? String(providerResult.request_id).slice(0, 200)
        : null,
      source_physical_command_fingerprint:
        providerResult.executed_command_fingerprint
          ? String(providerResult.executed_command_fingerprint).slice(0, 80)
          : OzonContract.commandFingerprint(normalized),
      http_status: Number(providerResult.http_status || 200),
      profile_id: profile?.profile_id
        ? String(profile.profile_id).slice(0, 120)
        : null,
      stored_at: Number(nowMs),
      expires_at: Number(nowMs) + ANALYTICS_CACHE_TTL_MS,
    };
    state.accounts[identity.account_hash] = {
      entries: currentEntries,
      updated_at: new Date(Number(nowMs)).toISOString(),
    };
    if (executionContext) await executionContext.assertCurrent();
    await storageSet({ [KEYS.PROVIDER_RESULT_CACHE]: state });
  });
  return true;
}
