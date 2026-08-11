import type { Locale } from "@/lib/i18n";

/**
 * Localized URL slugs for the product catalog. Each locale gets its own
 * localized "products" segment word and its own localized slug per product;
 * the English slug (e.g. "methylene-blue") is the canonical key used
 * throughout the app (data lookups, admin, WhatsApp messages, image paths).
 * Keep in sync with `middleware.ts`'s product rewrite/redirect logic.
 */
const PRODUCTS_SEGMENT: Record<Locale, string> = {
  en: "products",
  fr: "produits",
  es: "productos",
  de: "produkte",
};

const PRODUCT_SLUG_MAP: Record<Locale, Record<string, string>> = {
  en: {
    "methylene-blue": "methylene-blue",
    "gut-health": "gut-health",
    "teeth-whitening-strips": "teeth-whitening-strips",
  },
  fr: {
    "methylene-blue": "bleu-de-methylene",
    "gut-health": "sante-intestinale",
    "teeth-whitening-strips": "bandes-blanchissantes-dentaires",
  },
  es: {
    "methylene-blue": "azul-de-metileno",
    "gut-health": "salud-intestinal",
    "teeth-whitening-strips": "bandas-blanqueadoras-dentales",
  },
  de: {
    "methylene-blue": "methylenblau",
    "gut-health": "darmgesundheit",
    "teeth-whitening-strips": "zahnaufhellungsstreifen",
  },
};

/** The localized "products" URL segment word for a locale (e.g. "produits" for fr). */
export function getProductsSegment(locale: Locale): string {
  return PRODUCTS_SEGMENT[locale] ?? PRODUCTS_SEGMENT.en;
}

/** True if `segment` is the literal English "products" word (used for canonicalization redirects). */
export function isEnglishProductsSegment(segment: string): boolean {
  return segment === PRODUCTS_SEGMENT.en;
}

/** True if `slug` is a real, known product's canonical English slug. */
export function isKnownProductSlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(PRODUCT_SLUG_MAP.en, slug);
}

/** Localized slug (no leading/trailing slashes) for an English product slug + locale. */
export function getProductSlug(englishSlug: string, locale: Locale): string {
  return PRODUCT_SLUG_MAP[locale]?.[englishSlug] ?? englishSlug;
}

/** Full locale-prefixed, fully localized product URL (with trailing slash). */
export function getProductUrl(englishSlug: string, locale: Locale): string {
  return `/${locale}/${getProductsSegment(locale)}/${getProductSlug(englishSlug, locale)}/`;
}

/**
 * Reverse-lookup: given a locale + the segment/slug pair from an incoming
 * URL, return the canonical English product slug, or null if they don't
 * resolve to a real product for that locale (segment must match exactly).
 */
export function getEnglishProductSlugFromLocalized(
  segment: string,
  localizedSlug: string,
  locale: Locale
): string | null {
  if (segment !== getProductsSegment(locale)) return null;
  const map = PRODUCT_SLUG_MAP[locale];
  if (!map) return null;
  for (const [englishSlug, slug] of Object.entries(map)) {
    if (slug === localizedSlug) return englishSlug;
  }
  return null;
}
