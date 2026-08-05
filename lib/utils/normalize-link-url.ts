/**
 * Normalizes a user-entered URL so bare domains (e.g. "example.com") become
 * absolute links ("https://example.com") instead of being treated by the
 * browser as a path relative to the current page.
 */
export function normalizeLinkUrl(rawUrl: string | null | undefined): string {
  const url = (rawUrl || "").trim();
  if (!url) return "";

  // Already absolute, protocol-relative, a same-site path, or a special scheme — leave as-is.
  if (/^(https?:\/\/|\/\/|\/|mailto:|tel:|#)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}
