import type { Locale } from "@/lib/i18n";
import { PRODUCT_KEYWORDS } from "@/lib/seo/product-keywords";

/**
 * Homepage `<meta name="keywords">` list per locale: the union of both
 * products' curated keyword lists, deduped, plus the brand name.
 */
export const CORE_SITE_KEYWORDS: Record<Locale, readonly string[]> = (() => {
  const locales: Locale[] = ["en", "fr", "es", "de"];
  const result = {} as Record<Locale, readonly string[]>;
  for (const locale of locales) {
    const combined = [
      ...PRODUCT_KEYWORDS[locale]["gut-health"],
      ...PRODUCT_KEYWORDS[locale]["methylene-blue"],
      "VitalSupps",
      "vitalsupps",
    ];
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const kw of combined) {
      const key = kw.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(kw);
      }
    }
    result[locale] = deduped;
  }
  return result;
})();

/**
 * Keywords for homepage `<meta name="keywords">`. Kept as a function so
 * future keyword generation can be reintroduced without touching call sites.
 */
export function getHomepageKeywordList(locale: Locale): string[] {
  return [...CORE_SITE_KEYWORDS[locale]];
}
