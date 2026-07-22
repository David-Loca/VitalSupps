import { locales, type Locale } from "@/lib/i18n";

/**
 * BCP 47 hreflang values for alternates (Google Search).
 * Internal route locale `ca` is English for Canada — must NOT use `ca` alone (that means Catalan).
 */
export const hreflangByLocale: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
};

/** Build `alternates.languages` for Next.js metadata from internal locale → absolute URL map. */
export function buildHreflangAlternates(
  urlsByLocale: Partial<Record<Locale, string>>,
  xDefaultUrl?: string
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const loc of locales) {
    const url = urlsByLocale[loc];
    if (!url) continue;
    out[hreflangByLocale[loc]] = url;
  }

  const fallback =
    xDefaultUrl ?? urlsByLocale.en ?? urlsByLocale[locales[0]];
  if (fallback) {
    out["x-default"] = fallback;
  }

  return out;
}

/** Homepage-style paths: `/en/`, `/ca/`, etc. */
export function buildHomepageHreflangAlternates(
  baseUrl: string,
  pathSuffix = "/"
): Record<string, string> {
  const normalizedSuffix = pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`;
  const urls = Object.fromEntries(
    locales.map((loc) => [loc, `${baseUrl}/${loc}${normalizedSuffix === "/" ? "/" : normalizedSuffix}`])
  ) as Record<Locale, string>;

  return buildHreflangAlternates(urls, `${baseUrl}/en${normalizedSuffix === "/" ? "/" : normalizedSuffix}`);
}

/** When each locale has its own localized path (install guides, legal, reseller). */
export function buildHreflangAlternatesForPaths(
  baseUrl: string,
  pathForLocale: (locale: Locale) => string,
  xDefaultLocale: Locale = "en"
): Record<string, string> {
  const urls = Object.fromEntries(
    locales.map((loc) => [loc, `${baseUrl}${pathForLocale(loc)}`])
  ) as Record<Locale, string>;

  return buildHreflangAlternates(urls, `${baseUrl}${pathForLocale(xDefaultLocale)}`);
}

/** Legal pages with localized slugs (privacy, refund, terms). */
export function buildLegalHreflangAlternates(
  baseUrl: string,
  englishLegalSlug: string,
  getLegalUrl: (englishSlug: string, locale: Locale) => string
): Record<string, string> {
  return buildHreflangAlternatesForPaths(baseUrl, (loc) => getLegalUrl(englishLegalSlug, loc));
}
