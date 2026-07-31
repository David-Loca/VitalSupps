import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";
import { isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-card";
import { resolveAbsoluteImageUrl } from "@/lib/seo/og-image";
import { getBlogMetadata } from "@/lib/utils/metadata-loader";

export const alt = "VitalSupps Blog Post";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : "en";

  const fallback = await getBlogMetadata(locale);

  try {
    const blog = await getBlogBySlug(slug, locale);
    if (!blog || !isBlogAvailableInLocale(blog, locale)) {
      return createOgImageResponse({
        title: fallback.title,
        description: fallback.description,
        locale,
        badge: "Blog",
      });
    }

    const title = (blog.title[locale] || "").trim() || fallback.title;
    const metaDesc = (blog.meta?.description?.[locale] || "").trim();
    const excerpt = (blog.excerpt[locale] || "").trim();
    const description = metaDesc || excerpt || fallback.description;
    const backgroundImageUrl = blog.featuredImage
      ? resolveAbsoluteImageUrl(blog.featuredImage)
      : undefined;

    return createOgImageResponse({
      title,
      description,
      locale,
      badge: "Blog",
      backgroundImageUrl,
    });
  } catch {
    return createOgImageResponse({
      title: fallback.title,
      description: fallback.description,
      locale,
      badge: "Blog",
    });
  }
}
