import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-card";
import { getHomepageMetadata } from "@/lib/utils/metadata-loader";

export const alt = "Your Site Name";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : "en";

  const { title, description } = await getHomepageMetadata(locale);

  return createOgImageResponse({
    title,
    description,
    locale,
    badge: undefined,
  });
}
