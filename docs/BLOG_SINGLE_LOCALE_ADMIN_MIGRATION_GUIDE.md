# Blog admin migration guide — single-locale authoring + optional copy/mirror

**Purpose:** Give Cursor (or any developer) a safe, step-by-step plan to port the blog authoring model from the reference project into an **older site** that currently **forces every blog to be created in all languages at once**.

**Reference implementation (source of truth):**
- Admin UI: `components/admin/BlogEditor.tsx`
- Types: `lib/blog/types.ts`
- Per-locale blocks: `lib/blog/blocks-locale.ts`
- Storage normalize: `lib/admin/blog.ts` → `normalizeBlog()`
- Save API: `app/api/admin/blogs/route.ts`
- Public render: `app/[locale]/blog/[slug]/BlogPostContent.tsx`, `getBlocksForLocale()`
- Slugs/URLs: `lib/utils/blog-slugs.ts`
- Sitemap: `app/sitemap.ts` (blog section)
- Sanity script: `scripts/verify-blog-locale.ts`

**Adapt locale codes:** This guide uses `nl`, `no`, `de`. In the target project, replace `BLOG_LOCALES` / `Locale` with whatever the site uses (e.g. `en`, `es`, `fr` or `nl`, `no`, `de`). The **patterns** stay the same.

---

## 1. What you are fixing (symptoms in the old project)

Typical “forced trilingual” problems:

| Symptom | Why it hurts |
|--------|----------------|
| Save blocked unless title/slug/body filled for **every** locale | Cannot ship a Dutch-only post while Norwegian/German are WIP |
| One shared `blocks[]` with multilingual fields **inside** each block | Editing NL often overwrites NO/DE; mental model is confusing |
| Single slug copied to all languages automatically | SEO URLs cannot differ per market |
| Blog listing shows empty or broken cards for “missing” translations | Looks broken even when one language is intentional |
| Sitemap emits URLs for locales with no real content | Bing/Google crawl thin/duplicate pages |

**Target behavior (reference project):**

1. Author in **one active locale tab** (e.g. NL only).
2. **Save succeeds** with only that locale populated.
3. Other locales stay **empty until you choose** to fill them.
4. Optional **“Copy {locale} to all”** — duplicates text/slug/blocks (not machine translation).
5. Optional **“Mirror edits to all languages”** — while enabled, block add/edit/delete/reorder applies to every locale.
6. Public site: locale URL works if that locale has a slug (and ideally title/body); missing locale → `404` or hidden from listing (your choice, but be consistent).
7. Sitemap: **only** locales with a **non-empty slug** get entries.

---

## 2. Core data model (must match end-to-end)

### 2.1 `BlogPost` shape

```ts
// lib/blog/types.ts (or equivalent)

export interface BlogPost {
  id: string;
  slug: string | Record<Locale, string>;   // per-locale URL segment
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  featuredImage?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  locale: string;                            // primary / default locale for fallbacks
  translations?: Locale[];                 // which locales are “published” for this post
  blocks: BlogBlock[];                       // LEGACY — keep for old JSON, stop writing on save
  blocksByLocale?: Partial<Record<Locale, BlogBlock[]>>;  // NEW — source of truth for body
  meta?: {
    description?: Record<Locale, string>;
    keywords?: Record<Locale, string>;
  };
}
```

### 2.2 `BlogBlock` in the new model

Per-locale lists store **plain strings** per block (not `content: { nl, no, de }` on one row):

```ts
export interface BlogBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "list";
  content: string;              // single language per list entry
  level?: number;
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: "full" | "half" | "third" | "quarter";
  imageAlign?: "left" | "center" | "right";
  listItems?: string[];
  style?: { /* optional */ };
}
```

Legacy blocks may still use `content: string | Record<Locale, string>` — normalize on read, do not require on write.

### 2.3 `translations` is derived, not required input

On save, **compute** which locales exist:

```ts
const translations: Locale[] = [];
for (const loc of BLOG_LOCALES) {
  const hasSlug = getSlug(blog, loc).trim() !== "";
  const hasTitle = blog.title[loc]?.trim();
  const hasExcerpt = blog.excerpt[loc]?.trim();
  const hasBlocks = (blog.blocksByLocale?.[loc]?.length ?? 0) > 0;
  if (hasSlug || hasTitle || hasExcerpt || hasBlocks) {
    translations.push(loc);
  }
}
// Fallback if somehow empty: [blog.locale]
```

**Do not** require `translations.length === BLOG_LOCALES.length`.

---

## 3. Storage layer — `normalizeBlog()` (backward compatible)

Port logic from `lib/admin/blog.ts` → `normalizeBlog()`:

1. **Slug:** `string` → expand to `{ [loc]: same }` for all locales (legacy); `Record` → keep per-locale keys, **empty string allowed** for unused locales.
2. **Title / excerpt / meta:** always `Record<Locale, string>` with `""` for missing.
3. **`blocksByLocale`:** if present and any locale has blocks → use it.
4. **Else** migrate legacy `blocks[]` once via `migrateLegacyBlogToBlocksByLocale(blog)`.
5. **On save from admin:** set `blocks: []` and persist only `blocksByLocale` (reference does this to avoid dual writes).

### 3.1 `migrateLegacyBlogToBlocksByLocale`

```ts
// lib/blog/blocks-locale.ts

export function migrateLegacyBlogToBlocksByLocale(blog: BlogPost): Record<Locale, BlogBlock[]> {
  const existing = blog.blocksByLocale;
  if (existing && BLOG_LOCALES.some((l) => (existing[l]?.length ?? 0) > 0)) {
    return { nl: [...(existing.nl ?? [])], no: [...(existing.no ?? [])], de: [...(existing.de ?? [])] };
  }
  if (!blog.blocks?.length) {
    return { nl: [], no: [], de: [] };
  }
  // Split each legacy block into three locale-specific copies (extract per-locale field)
  return {
    nl: blog.blocks.map((b) => legacyBlockToLocaleColumn(b, "nl")),
    no: blog.blocks.map((b) => legacyBlockToLocaleColumn(b, "no")),
    de: blog.blocks.map((b) => legacyBlockToLocaleColumn(b, "de")),
  };
}
```

### 3.2 `getBlocksForLocale` (public + admin read path)

```ts
export function getBlocksForLocale(blog: BlogPost, locale: Locale): BlogBlock[] {
  const byLoc = blog.blocksByLocale;
  const hasPerLocaleBody = byLoc && BLOG_LOCALES.some((l) => (byLoc[l]?.length ?? 0) > 0);
  if (hasPerLocaleBody) {
    return byLoc[locale] || [];
  }
  return Array.isArray(blog.blocks) ? blog.blocks : [];
}
```

---

## 4. Admin UI — `BlogEditor` changes (largest piece)

### 4.1 State to add

```ts
const BLOG_LOCALES: readonly Locale[] = ["nl", "no", "de"]; // adapt
const [activeLocale, setActiveLocale] = useState<Locale>("nl");
const [mirrorEditsAcrossLocales, setMirrorEditsAcrossLocales] = useState(false);

// Initial blog state must include:
blocksByLocale: { nl: [], no: [], de: [] },
slug: { nl: "", no: "", de: "" },
title: { nl: "", no: "", de: "" },
excerpt: { nl: "", no: "", de: "" },
```

On load existing post: run `migrateLegacyBlogToBlocksByLocale(initialBlog)` and set `blocks: []`.

### 4.2 Remove “all locales required” validation

Search the old editor for patterns like:

- `if (!title.nl || !title.no || !title.de) return alert(...)`
- `disabled={!allLocalesComplete}`
- Zod/schema `.refine()` requiring every locale
- Defaulting empty NO/DE to NL text **on save** (hidden force-fill)

**Delete or relax** those. Minimum to save (recommended):

- `blog.locale` set (primary language)
- **At least one** locale has: non-empty title **or** non-empty slug **or** ≥1 block in `blocksByLocale[loc]`

Optional stricter rule: require slug for the primary locale only.

### 4.3 Locale tabs

UI pattern (reference lines ~520–560 in `BlogEditor.tsx`):

- Row of buttons: `NL | NO | DE` → sets `activeLocale`.
- Subtitle: *“Default: each language is edited separately. Use mirror only when you want the same text everywhere.”*
- Checkbox: **Mirror edits to all languages** → `mirrorEditsAcrossLocales`.
- Button: **Copy {activeLocale} to all** → `copyActiveLocaleToAll()`.

### 4.4 Per-locale fields (bound to `activeLocale` only)

| Field | Binding |
|-------|---------|
| Title | `blog.title[activeLocale]` |
| Excerpt | `blog.excerpt[activeLocale]` |
| Slug | `getSlug(activeLocale)` / `setSlug(activeLocale, value)` — **no auto-fill from other locale** |
| Meta keywords/description | `blog.meta.*[activeLocale]` |
| Block list | `blog.blocksByLocale[activeLocale]` |

Show three slug inputs (nl/no/de) if you want transparency; reference shows “URL path segment per language (set each manually)”.

### 4.5 `copyActiveLocaleToAll()` — duplicate, not translate

Deep-clone active locale into all three:

- `title`, `excerpt`, `meta.keywords`, `meta.description` ← copy string from `source`
- `slug` ← same segment in all three (operator can edit after)
- `blocksByLocale.nl/no/de` ← `JSON.parse(JSON.stringify(sourceBlocks))`

**No API call.** Same language in all tabs until user edits or translates manually.

### 4.6 `mirrorEditsAcrossLocales` — block operations fan-out

When mirror is **on**, these affect **every** locale:

- `setBlockContent`, `updateBlock`, `deleteBlock`, `moveBlock`, `addBlock`
- Optionally slug (reference mirrors slug in `setSlug` when mirror is on)

When mirror is **off**, only `activeLocale` array mutates.

Implementation pattern:

```ts
const localesToUpdate = mirrorEditsAcrossLocales ? BLOG_LOCALES : [activeLocale];
for (const loc of localesToUpdate) {
  by[loc] = by[loc].map(/* ... */);
}
```

Always `cloneBlocksByLocale(prev)` before mutating to avoid shared references.

### 4.7 Save payload (admin → API)

```ts
const cleanedBlog = {
  ...blog,
  id: blog.id || generateId(),
  slug: { nl: "...", no: "...", de: "..." },  // empty strings OK
  translations,                                 // derived array
  blocks: [],                                   // clear legacy
  blocksByLocale: { nl: [...], no: [...], de: [...] },
  updatedAt: new Date().toISOString(),
};
await onSave(cleanedBlog);
```

---

## 5. API route — `POST /api/admin/blogs`

Reference: `app/api/admin/blogs/route.ts`

1. Auth check unchanged.
2. `await saveBlog(blog)` → must call `normalizeBlog()` inside.
3. Fire-and-forget IndexNow (optional): `submitToIndexNow(buildIndexNowUrlListForBlog(blog))`.
4. **Do not** reject body when `translations.length < 3`.

### 5.1 DELETE handler (optional but recommended)

Before delete, load blog; after delete, ping IndexNow with old URLs so search engines drop 404s faster.

---

## 6. Public site — must not assume three full translations

### 6.1 Blog post page `[locale]/blog/[slug]`

1. Resolve post by slug for requested locale (`getBlogBySlug`).
2. If no post → `notFound()`.
3. Title: `blog.title[locale] || blog.title[blog.locale] || fallback`.
4. Body: `getBlocksForLocale(blog, locale)` — may be **empty array**; decide UX:
   - **Strict:** `notFound()` if `getBlocksForLocale` length === 0 && no title (recommended for SEO).
   - **Lenient:** show title + “translation coming soon” (worse for SEO).

### 6.2 Blog listing `[locale]/blog`

Filter cards:

```ts
blogs.filter((b) => {
  const slug = getBlogSlug(b, locale);
  return slug.trim() !== "" && (b.title[locale]?.trim() || getBlocksForLocale(b, locale).length > 0);
});
```

Do not list posts that only exist in another language unless you want cross-locale discovery.

### 6.3 `getBlogSlug` / `getBlogUrl`

Reference `lib/utils/blog-slugs.ts`:

- Per-locale slug from `Record`.
- Fallback for **link generation only**: `slugRecord[locale] || slugRecord[primary] || slugRecord.nl`.
- **Do not** use fallback to invent admin requirement; fallback is for old URLs and hreflang edge cases.

### 6.4 hreflang / alternates

Only emit `<link rel="alternate" hreflang="...">` for locales in `translations` (or locales with non-empty slug). Omit empty locales — avoids signaling pages that 404.

---

## 7. Sitemap

Reference `app/sitemap.ts` blog loop:

```ts
locales.forEach((locale) => {
  const slug = allSlugs[locale];
  if (slug && slug.trim() !== "") {
    blogLocales.push(locale);
  }
});
// Only add <url> entries for blogLocales
```

Do **not** add `/no/blog/...` if Norwegian slug is empty.

---

## 8. Implementation order (minimize breakage)

Execute in this order in the **target** repo. After each phase, run the app and save one test post.

| Phase | Task | Risk if skipped |
|-------|------|-----------------|
| **0** | Audit: find all blog validation, types, storage path (`data/blogs.json` etc.) | Wrong file edited |
| **1** | Add types + `blocks-locale.ts` helpers (no UI yet) | — |
| **2** | Update `normalizeBlog()` + load path migration | Corrupt JSON |
| **3** | Update save API to accept partial locales | Still blocked in UI |
| **4** | Refactor `BlogEditor`: tabs, remove required-all-locales, `blocksByLocale` | Main UX goal |
| **5** | Add copy-to-all + mirror controls | — |
| **6** | Public listing + post page + `getBlocksForLocale` | 404s or empty pages |
| **7** | Sitemap + hreflang filter | SEO noise |
| **8** | Add `scripts/verify-blog-locale.ts` + manual QA checklist | Regressions |

**Do not** bulk-rewrite existing blog JSON in phase 1–4; legacy posts should load via `migrateLegacyBlogToBlocksByLocale` on read and re-save when edited.

---

## 9. Cursor agent instructions (copy-paste prompt)

Use this prompt in the **old** project after attaching this file:

```
Read docs/BLOG_SINGLE_LOCALE_ADMIN_MIGRATION_GUIDE.md fully.

Goal: Stop forcing trilingual blog creation. Port the reference project patterns:
- blocksByLocale (independent body per locale)
- optional single-locale save
- activeLocale tabs in admin
- copyActiveLocaleToAll + mirrorEditsAcrossLocales
- derived translations[] on save
- sitemap only for locales with non-empty slug

Rules:
1. Map BLOG_LOCALES to this project's locale codes before coding.
2. Change the smallest set of files; do not refactor unrelated admin sections.
3. Keep backward compatibility: old blogs with blocks[] must still render.
4. Remove or relax any validation that requires all locales filled.
5. Do not machine-translate on copy — duplicate text only.
6. After changes, run/build and fix type errors.
7. Add scripts/verify-blog-locale.ts (adapt imports) if missing.

Deliverables:
- List files changed and why
- Note any remaining intentional differences from the reference project
```

---

## 10. QA checklist (manual)

- [ ] Create new post with **only NL** title + slug + one paragraph → save succeeds.
- [ ] NO and DE tabs empty; public `/no/blog/...` 404s or hidden (per your rule).
- [ ] NL public URL works and shows correct body.
- [ ] Edit NL, click **Copy NL to all** → NO/DE filled with same text; slugs equal.
- [ ] Enable **Mirror**, add block in NL → appears in NO/DE.
- [ ] Disable **Mirror**, add block in DE only → NL/NO unchanged.
- [ ] Open old pre-migration post → renders; re-save → `blocksByLocale` populated.
- [ ] Sitemap contains only locales with slug.
- [ ] Blog listing per locale does not show empty cards.
- [ ] IndexNow ping on save (if configured) uses correct production host.

---

## 11. Common mistakes (do not do these)

| Mistake | Fix |
|---------|-----|
| Requiring `title[no]` and `title[de]` on submit | Derive `translations`; require only one locale |
| Writing both `blocks` and `blocksByLocale` with different data | On save: `blocks: []`, single source `blocksByLocale` |
| Shallow copy `blocksByLocale.nl = blocksByLocale.no = same array` | Deep clone on copy; `cloneBlocksByLocale` each edit |
| Using one slug for all locales on every keystroke | Only mirror slug when mirror checkbox on |
| Listing all posts on every locale’s blog index | Filter by slug/title/blocks for that locale |
| Sitemap all 3 URLs always | Filter by non-empty slug |
| Deleting legacy `blocks` support before migration | Keep read path until all posts re-saved |

---

## 12. Optional enhancements (out of scope unless asked)

- Machine translation button (reference uses offline Python scripts, not admin UI).
- Per-locale featured image.
- Draft status per locale.
- Auto IndexNow on publish (reference: `lib/indexnow.ts` + env `INDEXNOW_KEY`).

---

## 13. File mapping template (fill in for target project)

| Reference (reference project) | Target project path |
|-------------------------|---------------------|
| `components/admin/BlogEditor.tsx` | |
| `lib/blog/types.ts` | |
| `lib/blog/blocks-locale.ts` | |
| `lib/admin/blog.ts` | |
| `app/api/admin/blogs/route.ts` | |
| `lib/utils/blog-slugs.ts` | |
| `app/[locale]/blog/[slug]/page.tsx` | |
| `app/[locale]/blog/[slug]/BlogPostContent.tsx` | |
| `app/[locale]/blog/page.tsx` (listing) | |
| `app/sitemap.ts` | |
| `scripts/verify-blog-locale.ts` | |

---

*End of guide. Version aligned with reference project `main` branch (per-locale `blocksByLocale`, optional trilingual copy/mirror, non-blocking single-locale save).*
