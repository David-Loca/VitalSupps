import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import {
  getEnglishSlugFromLocalized,
  isLegalSlug,
  getLegalUrl,
} from '@/lib/utils/installation-slugs';
import { getLegalMetadata } from '@/lib/utils/metadata-loader';
import { locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { getRouteMetaKeywords } from '@/lib/seo/corpus-route-keywords';
import { localizedSlugSeoConfig } from '@/lib/seo/route-seed-keywords';
import { buildHreflangAlternatesForPaths } from '@/lib/seo/hreflang';
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd';

async function loadSlugMetadata(
  englishSlug: string,
  locale: Locale
): Promise<{ title: string; description: string }> {
  if (englishSlug === 'refund-policy') {
    return getLegalMetadata(locale, 'refundPolicy');
  }
  if (englishSlug === 'privacy-policy') {
    return getLegalMetadata(locale, 'privacyPolicy');
  }
  if (englishSlug === 'terms-of-service') {
    return getLegalMetadata(locale, 'termsOfService');
  }
  return { title: '', description: '' };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale: localeParam, slug } = resolvedParams;

  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;

  const baseUrl = getSiteBaseUrl();

  // Check if this is a localized legal slug
  const englishSlug = getEnglishSlugFromLocalized(slug, locale);

  // If it's not a legal page, return basic metadata
  if (!englishSlug || !isLegalSlug(englishSlug)) {
    return {
      title: 'Page introuvable',
      description: 'La page que vous recherchez n\'existe pas.',
    };
  }

  // Get language-specific URL
  const currentUrl = getLegalUrl(englishSlug, locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const languageAlternates = buildHreflangAlternatesForPaths(baseUrl, (loc) =>
    getLegalUrl(englishSlug, loc)
  );

  let title = '';
  let description = '';
  let keywords: string[] = [];

  try {
    const metadata = await loadSlugMetadata(englishSlug, locale);
    title = metadata?.title || '';
    description = metadata?.description || '';
  } catch (error) {
    console.error('Error loading page metadata:', error);
    title = 'Legal Page';
    description = `Legal information for ${englishSlug}`;
  }

  const seoCfg = localizedSlugSeoConfig[englishSlug];
  if (seoCfg) {
    keywords = getRouteMetaKeywords(locale, seoCfg.profile, seoCfg.seeds[locale]);
  }

  return buildSocialMetadata({
    title,
    description,
    locale,
    canonicalUrl,
    keywords: keywords.length > 0 ? keywords : undefined,
    type: "article",
    languageAlternates,
    useGeneratedOgImage: true,
  });
}

export default async function LegalSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale: localeParam, slug } = resolvedParams;

  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;

  // Check if this is a localized legal slug
  const englishSlug = getEnglishSlugFromLocalized(slug, locale);

  if (!englishSlug || !isLegalSlug(englishSlug)) {
    return <>{children}</>;
  }

  const baseUrl = getSiteBaseUrl();
  const currentUrl = getLegalUrl(englishSlug, locale);
  const canonicalUrl = `${baseUrl}${currentUrl}`;

  const seoCfg = localizedSlugSeoConfig[englishSlug];
  const needsJsonLd = !!seoCfg;

  const jsonLdBlock = needsJsonLd
    ? await renderSlugWebPageJsonLd(englishSlug, locale, canonicalUrl, baseUrl)
    : null;

  return (
    <>
      {jsonLdBlock}
      {children}
    </>
  );
}

async function renderSlugWebPageJsonLd(
  englishSlug: string,
  locale: Locale,
  canonicalUrl: string,
  baseUrl: string
) {
  const seoCfg = localizedSlugSeoConfig[englishSlug];
  if (!seoCfg) return null;
  let title = '';
  let description = '';
  try {
    const m = await loadSlugMetadata(englishSlug, locale);
    title = m.title;
    description = m.description;
  } catch {
    return null;
  }
  const keywords = getRouteMetaKeywords(locale, seoCfg.profile, seoCfg.seeds[locale]);
  return (
    <WebPageJsonLd
      url={canonicalUrl}
      name={title}
      description={description}
      locale={locale}
      keywords={keywords}
      siteUrl={`${baseUrl}/${locale}/`}
    />
  );
}
