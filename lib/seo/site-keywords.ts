import type { Locale } from "@/lib/i18n";

/**
 * Hand-curated homepage meta keywords. Replace with real product keywords
 * per locale — these are neutral placeholders left after removing the
 * IPTV-specific keyword set and the generated keyword corpus.
 */
export const CORE_SITE_KEYWORDS: Record<Locale, readonly string[]> = {
  en: ["your product", "your brand"],
  fr: ["votre produit", "votre marque"],
  it: ["il tuo prodotto", "il tuo marchio"],
};

/**
 * Keywords for homepage `<meta name="keywords">`. Previously merged in a
 * large generated keyword corpus; that corpus was removed, so this now
 * simply returns the core list. Kept as a function so future keyword
 * generation can be reintroduced without touching call sites.
 */
export function getHomepageKeywordList(locale: Locale): string[] {
  return [...CORE_SITE_KEYWORDS[locale]];
}
