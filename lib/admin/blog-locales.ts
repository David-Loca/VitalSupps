import type { BlogBlock, BlogPost } from "@/lib/admin/blog-shared";
import type { Locale } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";

export const BLOG_LOCALES = locales;
export type BlogLocale = Locale;

export function isBlogLocale(value: string): value is BlogLocale {
  return BLOG_LOCALES.includes(value as BlogLocale);
}

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

export function getSlugForLocale(blog: BlogPost, locale: BlogLocale): string {
  if (typeof blog.slug === "string") {
    return normalizeSlug(blog.slug);
  }
  return normalizeSlug(String(blog.slug?.[locale] || ""));
}

export function getTextByLocale(
  value: Record<string, string> | undefined,
  locale: BlogLocale
): string {
  if (!value) return "";
  return String(value[locale] || "").trim();
}

function blockHasTextForLocale(block: BlogBlock, locale: BlogLocale): boolean {
  if (block.type === "image") {
    return Boolean(block.imageUrl && !block.imageUrl.startsWith("blob:"));
  }
  if (typeof block.content === "string") {
    return block.content.trim().length > 0;
  }
  if (block.content && typeof block.content === "object") {
    return String(block.content[locale] || "").trim().length > 0;
  }
  if (block.type === "list" && block.listItems) {
    if (Array.isArray(block.listItems)) {
      return block.listItems.some((item) => String(item).trim().length > 0);
    }
    const items = block.listItems[locale] || [];
    return Array.isArray(items) && items.some((item) => String(item).trim().length > 0);
  }
  return false;
}

/** True when this locale has enough filled fields to be published. */
export function hasLocalePublishableContent(blog: BlogPost, locale: BlogLocale): boolean {
  if (!getSlugForLocale(blog, locale)) return false;
  if (!getTextByLocale(blog.title, locale)) return false;
  if (!getTextByLocale(blog.excerpt, locale)) return false;
  if (!getTextByLocale(blog.meta?.description, locale)) return false;
  const blocks = Array.isArray(blog.blocks) ? blog.blocks : [];
  return blocks.some((block) => blockHasTextForLocale(block, locale));
}

/**
 * Locales that are live on the site. Uses `translations` when set; otherwise infers from content (legacy posts).
 */
export function getPublishedLocales(blog: BlogPost): BlogLocale[] {
  const explicit = (blog.translations || []).filter(isBlogLocale);
  if (explicit.length > 0) {
    return explicit;
  }

  const inferred = BLOG_LOCALES.filter((loc) => hasLocalePublishableContent(blog, loc));
  if (inferred.length > 0) {
    return inferred;
  }

  const primary = blog.locale;
  if (isBlogLocale(primary)) {
    return [primary];
  }
  return [defaultLocale];
}

export function isLocalePublished(blog: BlogPost, locale: BlogLocale): boolean {
  return getPublishedLocales(blog).includes(locale);
}

export function emptyLocaleTextMap(): Record<BlogLocale, string> {
  return Object.fromEntries(BLOG_LOCALES.map((loc) => [loc, ""])) as Record<BlogLocale, string>;
}

export function emptyLocaleListMap(): Record<BlogLocale, string[]> {
  return Object.fromEntries(BLOG_LOCALES.map((loc) => [loc, [] as string[]])) as Record<BlogLocale, string[]>;
}

/** Normalize slug payload from legacy string or partial record before save. */
export function normalizeBlogSlugRecord(
  slug: BlogPost["slug"]
): Record<BlogLocale, string> {
  const base = emptyLocaleTextMap();
  if (typeof slug === "string") {
    const trimmed = slug.trim();
    return { ...base, [defaultLocale]: trimmed };
  }
  const record = (slug || {}) as Record<string, string>;
  return Object.fromEntries(
    BLOG_LOCALES.map((loc) => [loc, String(record[loc] || "").trim()])
  ) as Record<BlogLocale, string>;
}

export type CopyBlogLocaleOptions = {
  /** Also copy URL slug (usually keep slugs unique per language). */
  includeSlug?: boolean;
  targets?: BlogLocale[];
};

function copyLocaleTextMap(
  value: Record<string, string> | undefined,
  from: BlogLocale,
  targets: BlogLocale[]
): Record<string, string> | undefined {
  if (!value) return value;
  const sourceText = value[from];
  if (sourceText === undefined) return value;
  const next = { ...value };
  for (const target of targets) {
    next[target] = sourceText;
  }
  return next;
}

/**
 * Copy title, excerpt, SEO fields, and block text from one locale to others.
 * Used by the editor UI to seed a new locale tab from the primary locale's content.
 */
export function copyBlogLocaleContent(
  blog: BlogPost,
  from: BlogLocale,
  options: CopyBlogLocaleOptions = {}
): BlogPost {
  const targets = (options.targets ?? BLOG_LOCALES).filter((loc) => loc !== from);
  if (targets.length === 0) return blog;

  const next: BlogPost = {
    ...blog,
    title: copyLocaleTextMap(blog.title, from, targets) ?? blog.title,
    excerpt: copyLocaleTextMap(blog.excerpt, from, targets) ?? blog.excerpt,
  };

  if (blog.meta) {
    next.meta = {
      ...blog.meta,
      description: copyLocaleTextMap(blog.meta.description, from, targets) ?? blog.meta.description,
      keywords: copyLocaleTextMap(blog.meta.keywords, from, targets) ?? blog.meta.keywords,
    };
  }

  if (options.includeSlug) {
    const slugRecord = normalizeBlogSlugRecord(blog.slug);
    const sourceSlug = slugRecord[from];
    if (sourceSlug) {
      const nextSlugRecord = { ...slugRecord };
      for (const target of targets) {
        nextSlugRecord[target] = sourceSlug;
      }
      next.slug = nextSlugRecord;
    }
  }

  if (Array.isArray(blog.blocks)) {
    next.blocks = blog.blocks.map((block) => {
      const updated: BlogBlock = { ...block };
      if (block.content && typeof block.content === "object") {
        updated.content = copyLocaleTextMap(
          block.content as Record<string, string>,
          from,
          targets
        ) as typeof block.content;
      }
      if (block.type === "image" && typeof block.imageAlt === "object" && block.imageAlt) {
        updated.imageAlt = copyLocaleTextMap(
          block.imageAlt as Record<string, string>,
          from,
          targets
        ) as typeof block.imageAlt;
      }
      if (block.type === "list" && block.listItems && !Array.isArray(block.listItems)) {
        const listRecord = block.listItems as Record<string, string[]>;
        const sourceItems = listRecord[from];
        if (sourceItems) {
          const nextListRecord = { ...listRecord };
          for (const target of targets) {
            nextListRecord[target] = sourceItems;
          }
          updated.listItems = nextListRecord;
        }
      }
      return updated;
    });
  }

  return next;
}

export function validateBlogForPublish(
  blog: BlogPost,
  publishedLocales: BlogLocale[]
): { ok: true; blog: BlogPost } | { ok: false; error: string } {
  if (!blog || typeof blog !== "object") {
    return { ok: false, error: "Invalid blog payload." };
  }

  if (publishedLocales.length === 0) {
    return { ok: false, error: "Select at least one language to publish." };
  }

  const primary = blog.locale;
  if (!isBlogLocale(primary)) {
    return {
      ok: false,
      error: `Primary language must be one of: ${BLOG_LOCALES.join(", ")}.`,
    };
  }

  if (!publishedLocales.includes(primary)) {
    return {
      ok: false,
      error: "Primary language must be included in published languages.",
    };
  }

  for (const loc of publishedLocales) {
    if (!hasLocalePublishableContent(blog, loc)) {
      return {
        ok: false,
        error: `Incomplete content for ${loc.toUpperCase()}. Each published language needs: slug, title, excerpt, SEO description, and at least one content block with text (images count for all languages).`,
      };
    }
  }

  const publishedAt = new Date(blog.publishedAt);
  if (Number.isNaN(publishedAt.getTime())) {
    return { ok: false, error: "Invalid published date." };
  }

  const normalizedSlugs = Object.fromEntries(
    BLOG_LOCALES.map((loc) => [loc, getSlugForLocale(blog, loc)])
  ) as Record<BlogLocale, string>;

  return {
    ok: true,
    blog: {
      ...blog,
      slug: normalizedSlugs,
      publishedAt: publishedAt.toISOString(),
      updatedAt: new Date().toISOString(),
      translations: [...publishedLocales],
    },
  };
}

export function findDuplicateSlugError(
  blog: BlogPost,
  allBlogs: BlogPost[],
  publishedLocales: BlogLocale[]
): string | null {
  const incomingId = String(blog.id || "").trim();
  const slugsToCheck = publishedLocales
    .map((loc) => getSlugForLocale(blog, loc))
    .filter(Boolean);

  const duplicate = allBlogs.find((existing) => {
    if (incomingId && existing.id === incomingId) return false;
    const existingPublished = getPublishedLocales(existing);
    return existingPublished.some((loc) => {
      const existingSlug = getSlugForLocale(existing, loc);
      return existingSlug && slugsToCheck.includes(existingSlug);
    });
  });

  if (duplicate) {
    return "Duplicate blog slug detected. Slugs must be unique across all published blog posts and languages.";
  }
  return null;
}
