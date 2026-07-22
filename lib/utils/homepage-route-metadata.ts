import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getHomepageKeywordList } from "@/lib/seo/site-keywords";
import { getHomepageMetadata } from "@/lib/utils/metadata-loader";
import { buildHomepageHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";

export async function buildLocaleHomepageMetadata(locale: Locale): Promise<Metadata> {
  const baseUrl = getSiteBaseUrl();
  const homepageMetadata = await getHomepageMetadata(locale);
  const title = homepageMetadata.title;
  const description = homepageMetadata.description;
  const hreflangAlternates = buildHomepageHreflangAlternates(baseUrl, "/");

  return {
    ...buildSocialMetadata({
      title,
      description,
      locale,
      canonicalUrl: `${baseUrl}/${locale}/`,
      keywords: getHomepageKeywordList(locale),
      type: "website",
      languageAlternates: hreflangAlternates,
      useGeneratedOgImage: true,
    }),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    verification: {},
  };
}
