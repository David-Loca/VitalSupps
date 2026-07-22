# Spinning up a new project from this base

This repo is a reusable starting point (Next.js App Router + i18n + admin CMS + blog + SEO).
See [BASE_PROJECT.md](BASE_PROJECT.md) for what's included and the history of how it got here.
Use this checklist every time you fork it for a new project.

## 1. Clone and rename

- [ ] Clone/copy the repo into the new project's folder.
- [ ] Update `package.json` → `name` (currently `site-base`).
- [ ] Update this repo's remote/origin to the new project's git remote (don't push to the base
      template's history).

## 2. Environment

- [ ] Copy `.env.example` → `.env.local` and fill in real values (see README's
      [Environment variables](README.md#environment-variables) section for what each key does).
- [ ] Decide `NEXT_PUBLIC_BASE_URL` once the domain is known — SEO/sitemap/OG output is wrong
      until this is set.
- [ ] Set `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_WHATSAPP_NUMBER` (or remove the WhatsApp
      widget entirely if the new project doesn't want it — see `components/WhatsAppButton.tsx`,
      `FloatingWhatsAppButton.tsx`, `lib/whatsapp.ts`).
- [ ] Generate a fresh `INDEXNOW_KEY` (any GUID) + matching `public/<key>.txt` key file, update
      `INDEXNOW_KEY_LOCATION`. Old key files were deleted during base cleanup — don't reuse one
      from a prior project.

## 3. Branding

- [ ] Replace `app/favicon.ico`.
- [ ] Replace/confirm `public/logo/*` — verify nothing is leftover art from a prior project.
- [ ] Update site colors/theme in `globals.css` / Tailwind config if the new brand needs it.
- [ ] Update copy in `components/FeaturesSection.tsx`, `FAQSection.tsx`, `ContactSection.tsx`,
      `Header.tsx`, `Footer.tsx`, and the homepage hero in `HomePageClient.tsx` — these currently
      hold generic placeholder copy.
- [ ] Update translation strings in `lib/i18n/translations/{fr,se,it,no}.json` and
      `data/metadata/{fr,se,it,no}.json` (or trim to whichever locales the new project needs).

## 4. Content

- [ ] `data/blogs.json` starts empty (`[]`) — confirm it's still empty before launch, or seed it
      with real posts via the admin dashboard.
- [ ] Confirm `app/admin/dashboard/page.tsx` only shows panels relevant to this project (hero,
      WhatsApp/CTA, blogs, page metadata, settings). If the new project needs product/pricing/
      catalog editing, that's new functionality to build, not something to un-delete.

## 5. Compliance (if selling anything, especially regulated goods)

- [ ] Review `privacy-policy`, `refund-policy`, `terms-of-service` pages — the current copy is
      generic placeholder, not legal advice.
- [ ] Add any jurisdiction-specific disclosures the new project needs (age verification,
      prescription/licensing disclosures, data-handling notices, etc.) — see BASE_PROJECT.md's
      "Compliance/legal pages" section for the kind of thing to check for a health/medicine site
      specifically.

## 6. Verify

- [ ] `npm install`
- [ ] `npm run build` and `npx tsc --noEmit` — both succeed.
- [ ] `npm test` — all tests pass.
- [ ] `npm run dev`, click through the homepage, blog, admin login, and each locale manually.
- [ ] Add analytics (none wired up by default).
