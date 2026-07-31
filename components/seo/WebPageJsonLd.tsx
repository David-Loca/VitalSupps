import type { Locale } from "@/lib/i18n";
import { hreflangByLocale } from "@/lib/seo/hreflang";
import { keywordsForJsonLd } from "@/lib/seo/json-ld-limits";

type WebPageJsonLdProps = {
  url: string;
  name: string;
  description: string;
  locale: Locale | string;
  keywords?: string[];
  siteUrl: string;
};

/**
 * WebPage + WebSite linkage for crawlers; `keywords` maps CreativeWork.keywords in schema.org.
 */
export function WebPageJsonLd({ url, name, description, locale, keywords, siteUrl }: WebPageJsonLdProps) {
  const inLanguage = hreflangByLocale[locale as Locale] ?? "fr-FR";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name,
    description,
    inLanguage,
    isPartOf: {
      "@type": "WebSite",
      name: "VitalSupps",
      url: siteUrl,
    },
  };

  const jsonLdKeywords = keywordsForJsonLd(keywords ?? []);
  if (jsonLdKeywords.length) {
    data.keywords = jsonLdKeywords.join(", ");
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
