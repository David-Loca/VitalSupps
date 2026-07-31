import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getDefaultOgImageUrl, getSiteBaseUrl } from "@/lib/seo/og-image";

export function getDefaultOGImage(): string {
  return getDefaultOgImageUrl();
}

export interface MetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  locale?: Locale;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(options: MetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    locale = "en",
    publishedTime,
    modifiedTime,
    author = "VitalSupps",
    section,
    tags = [],
  } = options;

  const baseUrl = getSiteBaseUrl();
  const fullTitle = `${title} | VitalSupps`;
  const pageUrl = url || `${baseUrl}/${locale}/`;

  const languageAlternates = buildHreflangAlternates(
    Object.fromEntries(
      locales.map((loc) => [
        loc,
        pageUrl.replace(`/${locale}`, `/${loc}`).replace(`/${locale}/`, `/${loc}/`),
      ])
    ) as Record<Locale, string>,
    pageUrl.replace(`/${locale}`, "/en").replace(`/${locale}/`, "/en/")
  );

  return buildSocialMetadata({
    title: fullTitle,
    description,
    locale,
    canonicalUrl: pageUrl,
    image,
    imageAlt: title,
    keywords,
    type,
    languageAlternates,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
  });
}

export function getPageOGImage(_page: string, _locale: Locale = "en"): string {
  return getDefaultOGImage();
}
