import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { legalPrivacySeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { buildLegalHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { getLegalUrl } from "@/lib/utils/installation-slugs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!locales.includes(localeParam as Locale)) {
    return {
      title: "Page introuvable",
      description: "La page que vous recherchez n'existe pas.",
    };
  }

  const locale = localeParam as Locale;
  const baseUrl = getSiteBaseUrl();

  const titleMap: Record<Locale, string> = {
  en: "Privacy Policy | Your Site Name",
  fr: "Politique de Confidentialité | Your Site Name",
  it: "Informativa sulla Privacy | Your Site Name",
};

  const descriptionMap: Record<Locale, string> = {
  en: "Learn how Your Site Name collects, uses, and protects your personal data when you use our website.",
  fr: "Découvrez comment Your Site Name collecte, utilise et protège vos données personnelles lorsque vous utilisez notre site web.",
  it: "Scopri come Your Site Name raccoglie, utilizza e protegge i tuoi dati personali quando usi il nostro sito web.",
};

  const keywords = getRouteMetaKeywords(locale, "legal", legalPrivacySeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("privacy-policy", locale)}`;
  const languageAlternates = buildLegalHreflangAlternates(
    baseUrl,
    "privacy-policy",
    getLegalUrl
  );

  return buildSocialMetadata({
    title: titleMap[locale],
    description: descriptionMap[locale],
    locale,
    canonicalUrl,
    keywords,
    type: "website",
    languageAlternates,
    useGeneratedOgImage: true,
  });
}

export default async function PrivacyPolicyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locale)) {
    return <>{children}</>;
  }
  const locale = localeParam as Locale;
  const baseUrl = getSiteBaseUrl();

  const titleMap: Record<Locale, string> = {
  en: "Privacy Policy | Your Site Name",
  fr: "Politique de Confidentialité | Your Site Name",
  it: "Informativa sulla Privacy | Your Site Name",
};

  const descriptionMap: Record<Locale, string> = {
  en: "Learn how Your Site Name collects, uses, and protects your personal data when you use our website.",
  fr: "Découvrez comment Your Site Name collecte, utilise et protège vos données personnelles lorsque vous utilisez notre site web.",
  it: "Scopri come Your Site Name raccoglie, utilizza e protegge i tuoi dati personali quando usi il nostro sito web.",
};

  const keywords = getRouteMetaKeywords(locale, "legal", legalPrivacySeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("privacy-policy", locale)}`;

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={titleMap[locale]}
        description={descriptionMap[locale]}
        locale={locale}
        keywords={keywords}
        siteUrl={`${baseUrl}/${locale}/`}
      />
      {children}
    </>
  );
}
