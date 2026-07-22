import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/lib/admin/blog-shared";
import type { Locale } from "@/lib/i18n";
import {
  findBlogByAnySlug,
  getAllBlogSlugs,
  getBlogSlug,
  getBlogUrl,
  isBlogAvailableInLocale,
} from "@/lib/utils/blog-slugs";

function makePost(overrides: Partial<BlogPost> & Pick<BlogPost, "slug">): BlogPost {
  const now = new Date().toISOString();
  return {
    id: "test-id",
    title: { fr: "T" },
    excerpt: { fr: "E" },
    publishedAt: now,
    updatedAt: now,
    locale: "fr",
    blocks: [],
    ...overrides,
  };
}

describe("blog-slugs", () => {
  it("getBlogSlug returns the fr slug", () => {
    const blog = makePost({
      slug: { fr: "french-slug" },
    });
    expect(getBlogSlug(blog, "fr" as Locale)).toBe("french-slug");
  });

  it("getBlogSlug returns empty string when locale segment missing", () => {
    const blog = makePost({
      slug: { fr: "" },
    });
    expect(getBlogSlug(blog, "fr" as Locale)).toBe("");
  });

  it("legacy string slug is reused for fr", () => {
    const blog = makePost({ slug: "legacy-one" });
    expect(getBlogSlug(blog, "fr" as Locale)).toBe("legacy-one");
  });

  it("getBlogUrl encodes slug and uses trailing slash path shape", () => {
    const blog = makePost({
      slug: { fr: "a b" },
      translations: ["fr"],
    });
    expect(getBlogUrl(blog, "fr" as Locale)).toMatch(/\/fr\/blog\/a%20b\/$/);
  });

  it("getAllBlogSlugs returns a value for every site locale", () => {
    const blog = makePost({
      slug: { fr: "fr-s" },
    });
    expect(getAllBlogSlugs(blog)).toEqual({
      en: "",
      fr: "fr-s",
      it: "",
    });
  });

  it("getAllBlogSlugs includes en when set", () => {
    const blog = makePost({
      slug: { fr: "fr-s", en: "en-s" },
    });
    expect(getAllBlogSlugs(blog)).toEqual({
      en: "en-s",
      fr: "fr-s",
      it: "",
    });
  });

  it("findBlogByAnySlug matches the fr slug", () => {
    const a = makePost({
      id: "1",
      slug: { fr: "baz" },
    });
    const b = makePost({
      id: "2",
      slug: { fr: "y" },
    });
    const blogs = [a, b];
    expect(findBlogByAnySlug(blogs, "baz")?.id).toBe("1");
    expect(findBlogByAnySlug(blogs, "y")?.id).toBe("2");
    expect(findBlogByAnySlug(blogs, "missing")).toBeNull();
  });

  it("findBlogByAnySlug accepts URL-encoded slug segments", () => {
    const blog = makePost({
      slug: { fr: "hello world" },
    });
    expect(findBlogByAnySlug([blog], "hello%20world")?.id).toBe(blog.id);
  });

  it("isBlogAvailableInLocale is false when locale not published", () => {
    const blog = makePost({
      slug: { fr: "" },
      translations: [],
    });
    expect(isBlogAvailableInLocale(blog, "fr")).toBe(false);
  });

  it("isBlogAvailableInLocale uses inferred publish list for legacy posts", () => {
    const blog = makePost({
      translations: ["fr"],
      locale: "fr",
      slug: { fr: "fr-post" },
      title: { fr: "T" },
      excerpt: { fr: "E" },
      meta: { description: { fr: "D" } },
      blocks: [{ id: "1", type: "paragraph", content: { fr: "body" } }],
    });
    expect(isBlogAvailableInLocale(blog, "fr")).toBe(true);
  });
});
