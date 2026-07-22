import en from './translations/en.json';
import fr from './translations/fr.json';
import es from './translations/es.json';
import de from './translations/de.json';
import { normalizeHeroSection } from './normalize-hero-text';

export type Locale = 'en' | 'fr' | 'es' | 'de';

export const locales: Locale[] = ['en', 'fr', 'es', 'de'];

export const defaultLocale: Locale = 'en';

export const translations = {
  en,
  fr,
  es,
  de,
} as const;

export type TranslationKey = keyof typeof en | string;

function withNormalizedHero<T extends Record<string, unknown>>(bundle: T): T {
  if (!bundle.hero || typeof bundle.hero !== 'object') {
    return bundle;
  }
  return {
    ...bundle,
    hero: normalizeHeroSection(bundle.hero as Record<string, unknown>),
  };
}

export function getTranslations(locale: Locale) {
  const bundle = translations[locale] || translations[defaultLocale];
  return withNormalizedHero(bundle as Record<string, unknown>) as typeof bundle;
}

// Country to locale mapping for automatic detection
export const countryToLocale: Record<string, Locale> = {};

export function detectLocaleFromCountry(countryCode: string): Locale {
  return countryToLocale[countryCode.toUpperCase()] || defaultLocale;
}
