async function getManualOperation(conversationKey) {
  return saPrunePayload(await manualOperationRecords.get(normalizeConversationKey(conversationKey)));
}
