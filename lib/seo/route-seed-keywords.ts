import type { Locale } from "@/lib/i18n";
import type { CorpusSeoProfile } from "@/lib/seo/corpus-route-keywords";

export const legalPrivacySeeds: Record<Locale, readonly string[]> = {
  en: ["privacy policy", "privacy", "data protection", "personal data"],
  fr: ["politique de confidentialité", "confidentialité", "protection des données", "données personnelles"],
  it: ["informativa privacy", "privacy", "protezione dati", "dati personali"],
};

export const legalRefundSeeds: Record<Locale, readonly string[]> = {
  en: ["refund policy", "refund"],
  fr: ["politique de remboursement", "remboursement"],
  it: ["politica di rimborso", "rimborso"],
};

export const legalTermsSeeds: Record<Locale, readonly string[]> = {
  en: ["terms of service", "user agreement"],
  fr: ["conditions d'utilisation", "contrat utilisateur"],
  it: ["termini di utilizzo", "contratto utente"],
};

/** Localized slug pages: map English slug → corpus profile + seed lines */
export const blogListingSeeds: Record<Locale, readonly string[]> = {
  en: ["blog", "news", "tips", "articles", "guides", "tutorials"],
  fr: ["blog", "actualités", "conseils", "articles", "guides", "tutoriels"],
  it: ["blog", "novità", "consigli", "articoli", "guide", "tutorial"],
};

export const localizedSlugSeoConfig: Record<
  string,
  { profile: CorpusSeoProfile; seeds: Record<Locale, readonly string[]> }
> = {
  "privacy-policy": { profile: "legal", seeds: legalPrivacySeeds },
  "refund-policy": { profile: "legal", seeds: legalRefundSeeds },
  "terms-of-service": { profile: "legal", seeds: legalTermsSeeds },
};
