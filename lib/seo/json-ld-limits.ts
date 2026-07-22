/**
 * Google ignores meta keywords but can flag oversized `keywords` in JSON-LD as low-quality.
 * Bing-oriented meta tags stay full; structured data uses a focused subset.
 */
export const JSON_LD_KEYWORD_MAX = 28;

export function keywordsForJsonLd(keywords: readonly string[]): string[] {
  return keywords.slice(0, JSON_LD_KEYWORD_MAX);
}
