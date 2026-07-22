import type { Locale } from "@/lib/i18n";
import type { CorpusSeoProfile } from "@/lib/seo/corpus-route-keywords";

export const legalPrivacySeeds: Record<Locale, readonly string[]> = {
  en: ["privacy policy", "privacy", "data protection", "personal data"],
  fr: ["politique de confidentialité", "confidentialité", "protection des données", "données personnelles"],
  es: ["política de privacidad", "privacidad", "protección de datos", "datos personales"],
  de: ["datenschutzrichtlinie", "datenschutz", "datenschutzbestimmungen", "personenbezogene daten"],
};

export const legalRefundSeeds: Record<Locale, readonly string[]> = {
  en: ["refund policy", "refund"],
  fr: ["politique de remboursement", "remboursement"],
  es: ["política de reembolso", "reembolso"],
  de: ["rückerstattungsrichtlinie", "rückerstattung"],
};

export const legalTermsSeeds: Record<Locale, readonly string[]> = {
  en: ["terms of service", "user agreement"],
  fr: ["conditions d'utilisation", "contrat utilisateur"],
  es: ["términos de servicio", "acuerdo de usuario"],
  de: ["nutzungsbedingungen", "nutzervereinbarung"],
};

/** Localized slug pages: map English slug → corpus profile + seed lines */
export const blogListingSeeds: Record<Locale, readonly string[]> = {
  en: ["blog", "news", "tips", "articles", "guides", "tutorials"],
  fr: ["blog", "actualités", "conseils", "articles", "guides", "tutoriels"],
  es: ["blog", "noticias", "consejos", "artículos", "guías", "tutoriales"],
  de: ["blog", "neuigkeiten", "tipps", "artikel", "leitfäden", "tutorials"],
};

export const localizedSlugSeoConfig: Record<
  string,
  { profile: CorpusSeoProfile; seeds: Record<Locale, readonly string[]> }
> = {
  "privacy-policy": { profile: "legal", seeds: legalPrivacySeeds },
  "refund-policy": { profile: "legal", seeds: legalRefundSeeds },
  "terms-of-service": { profile: "legal", seeds: legalTermsSeeds },
};
