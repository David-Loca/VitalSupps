import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getAllBlogs } from "@/lib/admin/blog";
import { getBlogUrl, isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { hreflangByLocale, buildHomepageHreflangAlternates } from "@/lib/seo/hreflang";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getBlogListingMetadata } from "@/lib/utils/metadata-loader";
import { getHomepageKeywordList } from "@/lib/seo/site-keywords";
import { buildBreadcrumbSchema, BREADCRUMB_LABELS } from "@/lib/seo/breadcrumb-schema";
import BlogListingClient from "./BlogListingClient";

export const revalidate = 3600; // Revalidate every hour so new posts appear

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getSiteBaseUrl();
  const { title, description } = await getBlogListingMetadata(locale);
  const hreflangAlternates = buildHomepageHreflangAlternates(baseUrl, "/blog/");

  return buildSocialMetadata({
    title,
    description,
    locale,
    canonicalUrl: `${baseUrl}/${locale}/blog/`,
    keywords: getHomepageKeywordList(locale),
    type: "website",
    languageAlternates: hreflangAlternates,
    useGeneratedOgImage: true,
  });
}

const baseUrl = getSiteBaseUrl();

const itemListMeta: Record<Locale, { name: string; description: string }> = {
  en: {
    name: "Blog - Articles and Guides",
    description: "Latest articles, guides and news.",
  },
  fr: {
    name: "Blog - Articles et Guides",
    description: "Derniers articles, guides et actualités.",
  },
  es: {
    name: "Blog - Artículos y Guías",
    description: "Últimos artículos, guías y noticias.",
  },
  de: {
    name: "Blog - Artikel und Leitfäden",
    description: "Neueste Artikel, Leitfäden und Neuigkeiten.",
  },
};

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  let blogs = await getAllBlogs();
  blogs = blogs.filter((blog) => isBlogAvailableInLocale(blog, locale));
  blogs = [...blogs].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const listingMeta = itemListMeta[locale];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listingMeta.name,
    description: listingMeta.description,
    url: `${baseUrl}/${locale}/blog/`,
    inLanguage: hreflangByLocale[locale],
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog, index) => {
      const title = (blog.title[locale] || "").trim() || "Untitled";
      const url = `${baseUrl}${getBlogUrl(blog, locale)}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          name: title,
          url,
          inLanguage: hreflangByLocale[locale],
          datePublished: blog.publishedAt,
          dateModified: blog.updatedAt,
        },
      };
    }),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: BREADCRUMB_LABELS[locale].home, url: `${baseUrl}/${locale}/` },
    { name: BREADCRUMB_LABELS[locale].blog, url: `${baseUrl}/${locale}/blog/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogListingClient initialBlogs={blogs} locale={locale} />
    </>
  );
}
