import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { blogUrlsInSitemap, buildSitemapEntries } from "@/lib/seo/sitemap-entries";

const baseUrl = "https://example.com";

function makeBlog(overrides: Partial<BlogPost> = {}): BlogPost {
  const now = new Date().toISOString();
  return {
    id: "test-post",
    slug: { fr: "meilleur-article-france" },
    title: { fr: "Meilleur Article France" },
    excerpt: { fr: "Excerpt" },
    publishedAt: now,
    updatedAt: now,
    locale: "fr",
    translations: ["fr"],
    blocks: [{ id: "1", type: "paragraph", content: { fr: "Body" } }],
    meta: { description: { fr: "Meta" } },
    ...overrides,
  };
}

describe("buildSitemapEntries", () => {
  it("includes fr blog posts that are live on the site", () => {
    const entries = buildSitemapEntries(baseUrl, [makeBlog()]);
    const matches = blogUrlsInSitemap(entries, "meilleur-article-france");

    expect(matches).toContain(
      "https://example.com/fr/blog/meilleur-article-france/"
    );
  });

  it("does not emit duplicate URLs", () => {
    const entries = buildSitemapEntries(baseUrl, [
      makeBlog(),
      makeBlog({ id: "test-post-2", slug: { fr: "autre-article" } }),
    ]);
    const urls = entries.map((entry) => entry.url).filter(Boolean);

    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes en locale URLs for non-blog pages", () => {
    const entries = buildSitemapEntries(baseUrl, []);
    const urls = entries.map((entry) => entry.url).filter(Boolean);

    expect(urls.some((url) => url?.includes("/en/"))).toBe(true);
  });

  it("includes en blog posts that are live on the site", () => {
    const entries = buildSitemapEntries(baseUrl, [
      makeBlog({
        id: "en-post",
        slug: { en: "best-article-english" },
        title: { en: "Best Article English" },
        excerpt: { en: "Excerpt" },
        locale: "en",
        translations: ["en"],
        blocks: [{ id: "1", type: "paragraph", content: { en: "Body" } }],
        meta: { description: { en: "Meta" } },
      }),
    ]);
    const matches = blogUrlsInSitemap(entries, "best-article-english");

    expect(matches).toContain(
      "https://example.com/en/blog/best-article-english/"
    );
  });
});
