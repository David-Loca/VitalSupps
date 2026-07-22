"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslations, type Locale, locales, defaultLocale } from '@/lib/i18n';
import { getLocaleFromPathname, stripLocalePrefix, buildLocalizedPath } from '@/lib/i18n/locale-path';
import {
  getEnglishSlugFromLocalized,
  isLegalSlug,
  getLegalSlug,
} from '@/lib/utils/installation-slugs';

type Translations = ReturnType<typeof getTranslations>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const pathname = usePathname();
  const router = useRouter();

  // Update locale from URL path
  useEffect(() => {
    const pathLocale = getLocaleFromPathname(pathname);
    if (pathLocale) {
      setLocaleState(pathLocale);
    }
  }, [pathname]);

  /**
   * Navigate to the equivalent page under a different locale. Handles the
   * localized-slug pages (installation/reseller/legal) by translating the
   * slug rather than reusing the current locale's slug. Blog post detail
   * pages fall back to the target locale's blog listing, since a specific
   * post's translated slug isn't known client-side without a data fetch.
   */
  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    const rest = stripLocalePrefix(pathname);
    const segments = rest.split('/').filter(Boolean);

    // Blog post detail page (`/blog/some-slug`) — no reliable client-side way
    // to resolve the target locale's slug for this specific post, so land on
    // the target locale's blog listing instead of risking a broken link.
    if (segments[0] === 'blog' && segments.length > 1) {
      router.push(`/${newLocale}/blog/`);
      return;
    }

    // Localized slug pages (legal pages).
    if (segments.length === 1) {
      const currentSlug = segments[0];
      const englishSlug = getEnglishSlugFromLocalized(currentSlug, locale);
      if (englishSlug && isLegalSlug(englishSlug)) {
        router.push(`/${newLocale}/${getLegalSlug(englishSlug, newLocale)}/`);
        return;
      }
    }

    router.push(buildLocalizedPath(newLocale, rest));
  };

  const translations = getTranslations(locale);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Client component to detect locale on first visit - Instant redirect, no loading
export function LocaleDetector() {
  const router = useRouter();
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    if (detected) return;

    // Check if we're already on a locale route
    const currentPath = window.location.pathname;
    const isLocaleRoute = locales.some(locale => currentPath.startsWith(`/${locale}`));
    
    if (isLocaleRoute) {
      setDetected(true);
      return;
    }

    // Single-locale site: always land on the default locale.
    // Clear any stale preference from before the locale collapse.
    localStorage.removeItem('preferred-locale');
    router.replace(`/${defaultLocale}${currentPath === '/' ? '' : currentPath}`);
    setDetected(true);
  }, [router, detected]);

  return null;
}

