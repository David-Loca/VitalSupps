import type { Locale } from "@/lib/i18n";

/**
 * Localized URL slugs for legal pages (privacy policy, refund policy, terms
 * of service). Each locale gets its own localized slug for SEO; the English
 * slug (e.g. "privacy-policy") is the canonical key used throughout the app.
 * Keep in sync with `middleware.ts`'s `localizedSlugRedirectMaps`.
 */
const LEGAL_SLUG_MAP: Record<Locale, Record<string, string>> = {
  en: {
    "refund-policy": "refund-policy",
    "privacy-policy": "privacy-policy",
    "terms-of-service": "terms-of-service",
  },
  fr: {
    "refund-policy": "politique-de-remboursement",
    "privacy-policy": "politique-de-confidentialite",
    "terms-of-service": "conditions-utilisation",
  },
  es: {
    "refund-policy": "politica-de-reembolso",
    "privacy-policy": "politica-de-privacidad",
    "terms-of-service": "terminos-de-servicio",
  },
  de: {
    "refund-policy": "rueckerstattungsrichtlinie",
    "privacy-policy": "datenschutzrichtlinie",
    "terms-of-service": "nutzungsbedingungen",
  },
};

const ENGLISH_LEGAL_SLUGS = ["privacy-policy", "refund-policy", "terms-of-service"];

export function isLegalSlug(englishSlug: string): boolean {
  return ENGLISH_LEGAL_SLUGS.includes(englishSlug);
}

/** Localized slug (no leading/trailing slashes) for an English legal slug + locale. */
export function getLegalSlug(englishSlug: string, locale: Locale): string {
  return LEGAL_SLUG_MAP[locale]?.[englishSlug] ?? englishSlug;
}

/** Full locale-prefixed path (with trailing slash) for an English legal slug. */
export function getLegalUrl(englishSlug: string, locale: Locale): string {
  return `/${locale}/${getLegalSlug(englishSlug, locale)}/`;
}

/** Reverse-lookup: given a localized slug + locale, return the English slug, or null. */
export function getEnglishSlugFromLocalized(localizedSlug: string, locale: Locale): string | null {
  const map = LEGAL_SLUG_MAP[locale];
  if (!map) return null;
  for (const [englishSlug, slug] of Object.entries(map)) {
    if (slug === localizedSlug) return englishSlug;
  }
  // Also allow the English slug itself to resolve (useful before redirect).
  if (isLegalSlug(localizedSlug)) return localizedSlug;
  return null;
}
