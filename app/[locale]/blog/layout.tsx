import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getBlogListingMetadata } from "@/lib/utils/metadata-loader";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { blogListingSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { buildHomepageHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getSiteBaseUrl();

  const pageMetadata = await getBlogListingMetadata(locale);
  const title = pageMetadata.title;
  const description = pageMetadata.description;
  const keywords = getRouteMetaKeywords(locale, "blog", blogListingSeeds[locale]);

  return buildSocialMetadata({
    title,
    description,
    locale,
    canonicalUrl: `${baseUrl}/${locale}/blog/`,
    keywords,
    type: "website",
    languageAlternates: buildHomepageHreflangAlternates(baseUrl, "/blog/"),
    useGeneratedOgImage: true,
  });
}

export default async function BlogLayout({
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
  const pageMetadata = await getBlogListingMetadata(locale);
  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = `${baseUrl}/${locale}/blog/`;
  const keywords = getRouteMetaKeywords(locale, "blog", blogListingSeeds[locale]);

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
