import type { Locale } from "@/lib/i18n";
import { getAllBlogs } from "@/lib/admin/blog";
import { getBlogUrl, isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { hreflangByLocale } from "@/lib/seo/hreflang";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import BlogListingClient from "./BlogListingClient";

export const revalidate = 3600; // Revalidate every hour so new posts appear

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
  it: {
    name: "Blog - Articoli e Guide",
    description: "Ultimi articoli, guide e novità.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BlogListingClient initialBlogs={blogs} locale={locale} />
    </>
  );
}
