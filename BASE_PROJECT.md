# Base Project — Cleanup Summary

This repo started life as an IPTV reseller marketing site. This document records the cleanup
pass that stripped IPTV-specific code/content and turned it into a generic, reusable base
(Next.js App Router + i18n + admin CMS + blog) for a future site — currently planned to be a
medicament/pharmacy store. **No medicament features were built in this pass** — this was
cleanup + generalization only.

Build (`npm run build`) and `tsc --noEmit` succeed; all 65 vitest tests pass.

## What was removed

### Routes
- `app/[locale]/installation/*` (apple-ios, firestick-android-ios, smart-tv, windows)
- `app/[locale]/iptv-installation-firestick/`, `iptv-installation-guide/`, `iptv-installation-ios/`,
  `iptv-installation-smart-tv/`, `iptv-installation-windows/`
- `app/[locale]/iptv-reseller-program/`
- `app/[locale]/revendeur/`

Reason: all IPTV-installation-guide and reseller-program marketing pages; not relevant to any
future site. Decision confirmed with user: delete both parallel route sets entirely rather than
keep one as a generic "how-to" template.

### Components
- `HeroSection.tsx`, `PricingCard.tsx`, `DeviceCarousel.tsx`, `ContentCarousel.tsx`,
  `LogoCarousel.tsx`, `TestimonialCard.tsx`, `TestimonialsSection.tsx`, `InstallationStep.tsx`,
  `CTASection.tsx`, `hero/DefaultHeroDescription.tsx` (+ now-empty `hero/` dir)

Reason: IPTV marketing copy/carousels/pricing tiers baked in; no generic reuse value as-is.

### Lib
- `lib/constants/official-player-links.ts` (IPTV player app store links)
- `lib/seo/schema-pricing.ts` (IPTV Product/pricing JSON-LD schema, only consumer was the
  deleted pricing section in `layout.tsx`)
- `lib/utils/urlParser.tsx` (zero references anywhere in the codebase — confirmed dead code)

### Data
- `data/seo/keyword-corpus.json` (+ now-empty `data/seo/` dir) — IPTV SEO keyword corpus
- `data/links/` (already empty)

### Public assets
- `public/carouselle-channels/`, `public/carouselle-shows/`, `public/carouselle-streaming/` —
  TV channel/show/streaming-service logos and posters used only by the deleted carousels
- `public/instalation/`, `public/reseller/` — installation screenshots and reseller device images
- `public/logo/IPTVSMARTERSNL-LOGO.png` — old brand logo
- `public/BingSiteAuth.xml`, `public/googlebf2b2c3a8cb9c333.html` — old domain's search-console
  verification files
- `public/0eb11dfbd77a4ebeb9f0b5c64861ac23.txt`, `public/9bdb599205064b41a472f23005bc02d5.txt` —
  old IndexNow key files (see **Rebranding items pending** below — new keys needed)

### Docs / scripts
- `docs/google-search-console-setup-guide.tex` — entirely about the old domain's search console
- `scripts/remake/` (`strip-keyword-components.mjs`, `snapshot-keys.mjs`, `keys-baseline.json`) —
  leftover throwaway tooling from a prior, unrelated cleanup attempt

## What was kept (the reusable base)

### i18n system
- `lib/i18n/*` (locale maps, path helpers, pricing-display, hero-text normalization)
- `lib/i18n/translations/{fr,se,it,no}.json` — **stripped to a minimal generic key set**
  (nav/common, blog, features, faq, whatsapp, contact, footer, legal-page copy) with neutral
  placeholder values; removed `pricing` (40 keys), `installation` (172 keys), `reseller`
  (52 keys), `deviceShowcase`, `testimonials`, `officialPlayerApps`
- `data/metadata/{fr,se,it,no}.json` — same treatment, per-locale SEO metadata
- `contexts/LanguageContext.tsx`, `middleware.ts` — locale routing/redirect logic, trimmed to
  only handle legal-page slug localization (installation/reseller branches removed)
- `lib/utils/metadata-loader.ts` — `getInstallationMetadata`/`getResellerMetadata` removed

### Admin dashboard (generic CMS)
- `app/admin/*`, `app/api/admin/*`, `components/admin/*`, `lib/admin/*`
- Auth, sidebar, content editor, GitHub/local-filesystem publishing pipeline all intact
- `lib/admin/metadata.ts` — `MetadataContent` interface stripped of `installation`/`reseller`
  fields, default copy replaced with generic placeholders
- **Known follow-up**: `app/admin/dashboard/page.tsx` still contains large pricing/carousel/
  reseller editing UI sections wired to the now-removed translation keys. It builds fine (the
  getValue/updateValue helpers degrade gracefully to empty strings) but is functionally dead —
  editing those panels no longer affects the live site. Recommend trimming these sections (and
  the matching entries in `AdminSidebar`) once the medicament site's real content model exists.

### Blog/vlog system
- `app/[locale]/blog/*`, `data/blogs.json`, `components/admin/BlogEditor.tsx`,
  `BlogsManager.tsx`, `lib/admin/blog*.ts` — kept as a generic content publishing system
- **Known follow-up**: `data/blogs.json` still contains real IPTV article bodies (content, not
  code) — out of scope for this pass; purge/replace before launch.

### Layout / UI shell
- `components/Header.tsx`, `Footer.tsx` — de-branded (installation dropdown, reseller link,
  pricing nav, old logo all removed)
- `components/ScrollToTop.tsx`, `NotFoundContent.tsx`, `ContactSection.tsx`, `FAQSection.tsx`
  (16 IPTV FAQ entries → 4 generic placeholders), `FeaturesSection.tsx` (6 generic feature slots)
- `components/WhatsAppButton.tsx`, `FloatingWhatsAppButton.tsx`, `lib/whatsapp.ts` — **kept per
  user decision**, de-branded into a generic "contact via WhatsApp" widget
- `globals.css`, `app/layout.tsx`, `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`
- `lib/seo/*` — hreflang, JSON-LD limits, OG image/social metadata, sitemap entries, site
  keywords — mechanism kept, IPTV keyword/domain strings removed

### Domain/branding
- Hardcoded `europeiptvsmarterspro.com` replaced with `example.com` / env-driven base URL across
  `next.config.ts`, `app/robots.ts`, layout files, `lib/indexnow.ts`, `lib/seo/og-image.ts`,
  `lib/seo/social-metadata.ts`, `lib/seo/sitemap-entries.ts`, translation JSONs
- `package.json` name → `site-base`

## Current site structure (post-cleanup)

```
app/
  layout.tsx, page.tsx, not-found.tsx, robots.ts, sitemap.ts
  [locale]/
    layout.tsx, page.tsx, HomePageClient.tsx, opengraph-image.tsx
    [slug]/                  — legal pages only (privacy/refund/terms), localized slugs
    blog/
      page.tsx, BlogListingClient.tsx, opengraph-image.tsx
      [slug]/page.tsx, BlogPostContent.tsx, layout.tsx, opengraph-image.tsx
    privacy-policy/, refund-policy/, terms-of-service/
  admin/
    page.tsx, login/page.tsx, dashboard/page.tsx
  api/
    admin/{blogs,carousel,login,logout,metadata,translations,upload,upload-cloudinary,verify}/route.ts
    blogs/route.ts, indexnow/route.ts

components/
  Header.tsx, Footer.tsx, ScrollToTop.tsx, NotFoundContent.tsx
  ContactSection.tsx, FAQSection.tsx, FeaturesSection.tsx
  WhatsAppButton.tsx, FloatingWhatsAppButton.tsx
  admin/*  (AdminSidebar, BlogEditor, BlogsManager, AdminLocalePreview, etc.)
  seo/WebPageJsonLd.tsx

lib/
  i18n/*  (incl. translations/{fr,se,it,no}.json)
  admin/*  (auth, blog*, github, local-filesystem, metadata)
  seo/*  (hreflang, json-ld-limits, og-image, sitemap-entries, site-keywords, social-metadata)
  utils/  (blog-slugs, contact-email, homepage-route-metadata, installation-slugs [legal-slug
           helpers now], metadata-loader, metadata, performance)
  whatsapp.ts, indexnow.ts, cloudinary.ts

data/
  blogs.json, metadata/{fr,se,it,no}.json

contexts/LanguageContext.tsx
middleware.ts
```

**Homepage (`HomePageClient.tsx`) currently renders**: `Header` → placeholder hero
(`<h1>Welcome</h1>` + one-line paragraph) → `FeaturesSection` → latest-blog-posts section →
`FAQSection` → `Footer` → `FloatingWhatsAppButton`. All references to deleted marketing sections
were removed rather than left dangling.

## Env keys — shared infra vs IPTV-specific

Not modified (values untouched); reported here for your review.

**Shared infra (keep):**
`ADMIN_PASSWORD`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`,
`GITHUB_BRANCH`, `GITHUB_EMAIL`, `GITHUB_NAME`, `GITHUB_TOKEN`, `VERCEL_OIDC_TOKEN`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`

**IPTV-specific — needs your decision:**
- `GITHUB_REPO` = `David-Loca/third-iptv`
- `NEXT_PUBLIC_BASE_URL` = `https://www.europeiptvsmarterspro.com`
- `NEXT_PUBLIC_CONTACT_EMAIL` = `info@official-iptvsmarterspro.com`
- `INDEXNOW_KEY` / `INDEXNOW_KEY_LOCATION` — points at a now-deleted key file

## Next steps to build the medicament site

**Data model needed:**
- Products/medicines (name, description, images, dosage/strength, form, manufacturer)
- Categories (e.g. pain relief, vitamins, prescription vs OTC)
- Prescription-required flag + upload/verification flow if selling Rx items
- Pricing/inventory/SKU fields
- Reuse the existing admin content-editor pipeline (`lib/admin/*`) for managing this data —
  it's already generic (auth, github/local-filesystem publish) once the metadata shape changes

**New pages:**
- Product catalog (list + filters by category)
- Product detail page
- Cart/checkout (if selling directly — decide payment processor)
- Search

**Compliance/legal pages likely required for selling medicine online** (jurisdiction-dependent —
confirm with your legal/regulatory requirements):
- Pharmacy license / regulatory registration disclosure
- Prescription verification policy
- Age verification (if applicable)
- Drug interaction / medical disclaimer ("not a substitute for professional medical advice")
- Data privacy for health information (may need stricter handling than the current generic
  privacy policy, depending on jurisdiction — e.g. HIPAA-adjacent rules)
- Return/refund policy specific to medicine (often stricter than general retail — some
  jurisdictions restrict returns on medication entirely)

**Rebranding items still pending:**
- Favicon (`app/favicon.ico` is still the old one)
- Logo — verify `public/logo/Logo1-removebg-preview-1.png`, `Logo3-removebg-preview.png`,
  `cropped-logo-1.png` aren't IPTV-branded artwork before reusing (couldn't visually confirm
  during cleanup); currently referenced generically in Header/Footer/admin login
- Domain — replace `example.com` placeholders and `NEXT_PUBLIC_BASE_URL` once the real domain
  is chosen
- Analytics IDs — none were found wired up in this codebase; add when ready
- SEO verification files — regenerate Bing/Google Search Console verification and IndexNow key
  files for the new domain (old ones deleted in this pass)

## Open questions / decisions deferred to you

1. **`lib/utils/installation-slugs.ts`** was reconstructed during cleanup — the original file was
   untracked in git and got deleted before its full usage graph was traced (it also exported
   legal-page-slug helpers consumed by `LanguageContext.tsx`, `app/[locale]/[slug]/*`,
   `middleware.ts`, `lib/seo/sitemap-entries.ts`, `lib/indexnow.ts`, `Footer.tsx`, and legal-page
   layouts). It was rebuilt as a legal-slug-only module (`getLegalUrl`, `getLegalSlug`,
   `isLegalSlug`, `getEnglishSlugFromLocalized`) by inferring usage from call sites — please
   sanity-check the localized slug mappings (fr/se/it/no privacy/refund/terms slugs) against
   what should actually be live.
2. **Logo files** in `public/logo/` — confirm they're generic/reusable, not old IPTV brand art.
3. **`app/admin/dashboard/page.tsx`** pricing/carousel/reseller panels are dead UI now — plan a
   follow-up pass once the medicament content model is defined, rather than leaving them.
4. **`data/blogs.json`** — still has real IPTV article content; decide whether to purge existing
   posts or keep them as filler until real content is ready.
5. **IndexNow key** — confirm you'll regenerate `INDEXNOW_KEY` + key-location file for the new
   domain (old key files were deleted).
