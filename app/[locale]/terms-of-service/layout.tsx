import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getLegalMetadata } from "@/lib/utils/metadata-loader";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { legalTermsSeeds } from "@/lib/seo/route-seed-keywords";
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
  const pageMetadata = await getLegalMetadata(locale, "termsOfService");
  const keywords = getRouteMetaKeywords(locale, "legal", legalTermsSeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("terms-of-service", locale)}`;
  const languageAlternates = buildLegalHreflangAlternates(
    baseUrl,
    "terms-of-service",
    getLegalUrl
  );

  return buildSocialMetadata({
    title: pageMetadata.title,
    description: pageMetadata.description,
    locale,
    canonicalUrl,
    keywords,
    type: "website",
    languageAlternates,
    useGeneratedOgImage: true,
  });
}

export default async function TermsOfServiceLayout({
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
  const pageMetadata = await getLegalMetadata(locale, "termsOfService");
  const keywords = getRouteMetaKeywords(locale, "legal", legalTermsSeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("terms-of-service", locale)}`;

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={pageMetadata.title}
        description={pageMetadata.description}
        locale={locale}
        keywords={keywords}
        siteUrl={`${baseUrl}/${locale}/`}
      />
      {children}
    </>
  );
}
