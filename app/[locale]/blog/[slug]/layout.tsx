import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getBlogBySlug } from "@/lib/admin/blog";
import { getBlogUrl, isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { getPublishedLocales } from "@/lib/admin/blog-locales";
import { buildHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";

function toKeywordArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function toValidIsoOrUndefined(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const baseUrl = getSiteBaseUrl();

  try {
    const blog = await getBlogBySlug(slug, locale);

    if (!blog || !isBlogAvailableInLocale(blog, locale)) {
      return getDefaultMetadata(locale, slug);
    }

    const title = (blog.title[locale] || "").trim() || "Blog Post";
    const metaDesc = (blog.meta?.description?.[locale] || "").trim();
    const excerptLocale = (blog.excerpt[locale] || "").trim();
    const description =
      metaDesc || excerptLocale || "Read our latest blog post.";
    const publishedTime = toValidIsoOrUndefined(blog.publishedAt);
    const modifiedTime = toValidIsoOrUndefined(blog.updatedAt);
    const keywordList = toKeywordArray(blog.meta?.keywords?.[locale]);

    const publishedLocales = getPublishedLocales(blog);
    const urlsByLocale: Partial<Record<Locale, string>> = {};
    publishedLocales.forEach((loc) => {
      const localizedUrl = getBlogUrl(blog, loc);
      if (localizedUrl !== `/${loc}/blog//`) {
        urlsByLocale[loc] = `${baseUrl}${localizedUrl}`;
      }
    });
    const xDefaultLoc = publishedLocales.includes("en")
      ? "en"
      : publishedLocales[0] || locale;
    const xDefaultUrl = getBlogUrl(blog, xDefaultLoc);
    const xDefaultAbsolute =
      xDefaultUrl !== `/${xDefaultLoc}/blog//`
        ? `${baseUrl}${xDefaultUrl}`
        : `${baseUrl}${getBlogUrl(blog, locale)}`;
    const languageAlternates = buildHreflangAlternates(urlsByLocale, xDefaultAbsolute);

    const canonicalPath = getBlogUrl(blog, locale);
    const canonicalUrl = `${baseUrl}${canonicalPath}`;

    return buildSocialMetadata({
      title: `${title} | Your Site Name`,
      description,
      locale,
      canonicalUrl,
      image: blog.featuredImage,
      imageAlt: title,
      keywords: keywordList,
      type: "article",
      languageAlternates,
      publishedTime,
      modifiedTime,
      tags: keywordList,
      section: "Blog",
    });
  } catch {
    return getDefaultMetadata(locale, slug);
  }
}

function getDefaultMetadata(locale: Locale, slug: string): Metadata {
  const baseUrl = getSiteBaseUrl();
  return buildSocialMetadata({
    title: "Blog Post | Your Site Name",
    description: "Read our latest blog post.",
    locale,
    canonicalUrl: `${baseUrl}/${locale}/blog/${slug}/`,
    type: "article",
    useGeneratedOgImage: true,
  });
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
