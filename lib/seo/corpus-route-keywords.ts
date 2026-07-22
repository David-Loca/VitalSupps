import type { Locale } from "@/lib/i18n";

export type CorpusSeoProfile = "blog" | "legal";

/**
 * Builds meta keywords / WebPage JSON-LD `keywords` from hand-written route
 * seed keywords. Previously merged in phrases from a large keyword corpus
 * JSON file; that corpus was removed as IPTV-specific, so this now simply
 * dedupes and caps the seed list. Kept as a function (rather than inlining
 * `seedKeywords` everywhere) so a corpus-merge step can be reintroduced later
 * without touching call sites.
 */
export function getRouteMetaKeywords(
  _locale: Locale,
  _profile: CorpusSeoProfile,
  seedKeywords: readonly string[],
  options?: { maxTotal?: number }
): string[] {
  const maxTotal = options?.maxTotal ?? 72;
  const seen = new Set<string>();
  const out: string[] = [];

  for (const s of seedKeywords) {
    const k = s.toLowerCase().trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(s);
    if (out.length >= maxTotal) break;
  }
  return out;
}
