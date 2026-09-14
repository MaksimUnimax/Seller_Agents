export function shouldBlockPrimaryDocumentRequest(
  url: string,
  frameId: string | undefined,
  primaryFrameId: string,
  allowedOrigins: readonly string[],
): boolean {
  if (frameId !== primaryFrameId) return false;
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
      !allowedOrigins.includes(parsed.origin)
    );
  } catch {
    return true;
  }
}
