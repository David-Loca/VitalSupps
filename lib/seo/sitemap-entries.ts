import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { getLegalUrl } from "@/lib/utils/installation-slugs";
import { getBlogUrl, isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { getPublishedLocales } from "@/lib/admin/blog-locales";
import { buildHreflangAlternates, buildHomepageHreflangAlternates } from "@/lib/seo/hreflang";

const legalEnglishSlugs = [
  "refund-policy",
  "privacy-policy",
  "terms-of-service",
] as const;

const otherRoutes = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
];

function toAbsoluteUrl(baseUrl: string, pathOrUrl: string): string | null {
  try {
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      return new URL(pathOrUrl).toString();
    }
    return new URL(pathOrUrl, baseUrl).toString();
  } catch {
    return null;
  }
}

function dedupeSitemapEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (!entry.url || seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

export function buildSitemapEntries(
  baseUrl: string,
  blogs: BlogPost[]
): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  const pushLocalizedGroup = (opts: {
    englishSlugs: readonly string[];
    pathForLocale: (englishSlug: string, locale: Locale) => string;
    priority: (englishSlug: string) => number;
  }) => {
    opts.englishSlugs.forEach((englishSlug) => {
      locales.forEach((locale) => {
        const localizedPath = opts.pathForLocale(englishSlug, locale);
        const url = toAbsoluteUrl(baseUrl, localizedPath);
        if (!url) return;

        const urlsByLocale: Partial<Record<Locale, string>> = {};
        locales.forEach((loc) => {
          const alt = toAbsoluteUrl(baseUrl, opts.pathForLocale(englishSlug, loc));
          if (alt) urlsByLocale[loc] = alt;
        });

        sitemapEntries.push({
          url,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: opts.priority(englishSlug),
          alternates: {
            languages: buildHreflangAlternates(urlsByLocale),
          },
        });
      });
    });
  };

  pushLocalizedGroup({
    englishSlugs: legalEnglishSlugs,
    pathForLocale: getLegalUrl,
    priority: () => 0.55,
  });

  locales.forEach((locale) => {
    otherRoutes.forEach((route) => {
      const pathWithSlash =
        route.path === ""
          ? "/"
          : route.path.endsWith("/")
            ? route.path
            : `${route.path}/`;
      const url = toAbsoluteUrl(baseUrl, `/${locale}${pathWithSlash}`);
      if (!url) return;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: buildHomepageHreflangAlternates(
            baseUrl,
            route.path === ""
              ? "/"
              : route.path.endsWith("/")
                ? route.path
                : `${route.path}/`
          ),
        },
      });
    });
  });

  blogs.forEach((blog) => {
    const publishedLocales = getPublishedLocales(blog).filter((loc) =>
      isBlogAvailableInLocale(blog, loc)
    );
    if (publishedLocales.length === 0) return;

    const urlsByLocale: Partial<Record<Locale, string>> = {};
    publishedLocales.forEach((loc) => {
      const blogPath = getBlogUrl(blog, loc);
      if (blogPath.includes("/blog//")) return;
      const absolute = toAbsoluteUrl(baseUrl, blogPath);
      if (absolute) urlsByLocale[loc] = absolute;
    });

    const hreflangLanguages = buildHreflangAlternates(
      urlsByLocale,
      urlsByLocale[publishedLocales[0]]
    );

    publishedLocales.forEach((blogLocale) => {
      const blogPath = getBlogUrl(blog, blogLocale);
      if (blogPath.includes("/blog//")) return;
      const url = toAbsoluteUrl(baseUrl, blogPath);
      if (!url) return;

      const lastModifiedRaw = blog.updatedAt || blog.publishedAt;
      const lastModified = new Date(lastModifiedRaw);
      sitemapEntries.push({
        url,
        lastModified: Number.isNaN(lastModified.getTime()) ? new Date() : lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: hreflangLanguages,
        },
      });
    });
  });

  return dedupeSitemapEntries(sitemapEntries);
}

export function blogUrlsInSitemap(
  entries: MetadataRoute.Sitemap,
  slug: string
): string[] {
  return entries
    .map((entry) => entry.url)
    .filter((url): url is string => Boolean(url && url.includes(slug)));
}
