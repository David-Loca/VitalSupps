import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/lib/admin/blog-shared";
import {
  copyBlogLocaleContent,
  getPublishedLocales,
  hasLocalePublishableContent,
  normalizeBlogSlugRecord,
  validateBlogForPublish,
} from "@/lib/admin/blog-locales";

function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  const now = new Date().toISOString();
  return {
    id: "test",
    slug: { fr: "fr-slug" },
    title: { fr: "Title FR" },
    excerpt: { fr: "Excerpt FR" },
    publishedAt: now,
    updatedAt: now,
    locale: "fr",
    translations: ["fr"],
    blocks: [
      {
        id: "b1",
        type: "paragraph",
        content: { fr: "Body FR" },
      },
    ],
    meta: { description: { fr: "Meta FR" } },
    ...overrides,
  };
}

describe("blog-locales", () => {
  it("getPublishedLocales respects explicit translations array", () => {
    const blog = makePost({ translations: ["fr"] });
    expect(getPublishedLocales(blog)).toEqual(["fr"]);
  });

  it("getPublishedLocales infers from content when translations empty", () => {
    const blog = makePost({
      translations: [],
      locale: "fr",
      slug: { fr: "fr-only" },
      title: { fr: "T" },
      excerpt: { fr: "E" },
      meta: { description: { fr: "D" } },
      blocks: [{ id: "1", type: "paragraph", content: { fr: "Body" } }],
    });
    expect(getPublishedLocales(blog)).toEqual(["fr"]);
  });

  it("validateBlogForPublish allows the fr locale", () => {
    const blog = makePost();
    const result = validateBlogForPublish(blog, ["fr"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.blog.translations).toEqual(["fr"]);
    }
  });

  it("validateBlogForPublish rejects empty publish list", () => {
    const blog = makePost();
    const result = validateBlogForPublish(blog, []);
    expect(result.ok).toBe(false);
  });

  it("copyBlogLocaleContent copies title, excerpt, meta, and block content from fr to en", () => {
    const blog = makePost();
    const copied = copyBlogLocaleContent(blog, "fr", {});
    expect(copied.title.en).toBe("Title FR");
    expect(copied.excerpt.en).toBe("Excerpt FR");
    expect(copied.meta?.description?.en).toBe("Meta FR");
    expect((copied.blocks[0].content as Record<string, string>).en).toBe("Body FR");
    // fr content is untouched
    expect(copied.title.fr).toBe("Title FR");
  });

  it("copyBlogLocaleContent respects an explicit targets list", () => {
    const blog = makePost();
    const copied = copyBlogLocaleContent(blog, "fr", { targets: [] });
    expect(copied).toBe(blog);
  });

  it("hasLocalePublishableContent requires slug title excerpt meta and body", () => {
    const blog = makePost();
    expect(hasLocalePublishableContent(blog, "fr")).toBe(true);
  });

  it("normalizeBlogSlugRecord preserves fr slugs on save", () => {
    const normalized = normalizeBlogSlugRecord({
      fr: "french-guide",
    });
    expect(normalized.fr).toBe("french-guide");
  });

  it("normalizeBlogSlugRecord carries en slugs when present", () => {
    const normalized = normalizeBlogSlugRecord({
      fr: "french-guide",
      en: "english-guide",
    });
    expect(normalized.en).toBe("english-guide");
  });

  it("validateBlogForPublish allows en as the primary locale", () => {
    const blog = makePost({
      locale: "en",
      translations: ["en"],
      slug: { en: "en-slug" },
      title: { en: "Title EN" },
      excerpt: { en: "Excerpt EN" },
      meta: { description: { en: "Meta EN" } },
      blocks: [{ id: "b1", type: "paragraph", content: { en: "Body EN" } }],
    });
    const result = validateBlogForPublish(blog, ["en"]);
    expect(result.ok).toBe(true);
  });
});
