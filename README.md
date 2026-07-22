# Site Base

A reusable Next.js (App Router) base with i18n routing, a generic admin CMS/blog editor, and SEO
utilities. See [BASE_PROJECT.md](BASE_PROJECT.md) for what this base includes and its history.

**Starting a new project from this base?** Follow [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md) —
it's a checklist for rebranding, env setup, and content cleanup so nothing from a prior project
leaks into the new one.

## Getting Started

Copy `.env.example` to `.env.local` and fill in the values (see [Environment variables](#environment-variables)
below), then run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (the terminal will print the actual port if
3000 is already in use — use the port it prints, not always 3000).

## Environment variables

Create a `.env.local` file at the repo root (never commit it — it's already git-ignored) with the
keys below. `.env.example` documents the same list with placeholder values.

### Required to run at all

| Key | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for `/admin/login` — protects the admin dashboard. |
| `NEXT_PUBLIC_BASE_URL` | Canonical site URL (e.g. `https://your-domain.com`), used in metadata, sitemaps, JSON-LD, and OG images. Falls back to `https://example.com` if unset, but SEO output will be wrong until it's set. |

### Content publishing (admin dashboard → GitHub)

The admin dashboard can save content (blog posts, translations, metadata) either to the local
filesystem (dev) or by committing straight to a GitHub repo (needed for platforms with a
read-only filesystem at runtime, e.g. Vercel). All five are required together if you want
GitHub-backed publishing — omit all five to fall back to local-filesystem writes only.

| Key | Purpose |
|---|---|
| `GITHUB_TOKEN` | Personal access token with repo write access. |
| `GITHUB_REPO` | `owner/repo` of the site's own repository. |
| `GITHUB_BRANCH` | Branch to commit to (e.g. `main`). |
| `GITHUB_EMAIL` | Git author email used for commits made by the admin dashboard. |
| `GITHUB_NAME` | Git author name used for commits made by the admin dashboard. |

### Media uploads (admin dashboard image uploads)

| Key | Purpose |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |

Omit all three if you don't need image uploads through the admin dashboard.

### Optional features

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email shown in footer/contact section and structured data. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Enables the floating WhatsApp contact button. Omit to hide it. |
| `INDEXNOW_KEY` | IndexNow key for instant search-engine indexing pings. |
| `INDEXNOW_KEY_LOCATION` | Public URL where a file containing the same key value is served (e.g. `https://your-domain.com/<key>.txt`) — required by IndexNow to verify key ownership. You must create that key file under `public/` yourself; it was removed during the base cleanup. |

### Auto-provided (don't set manually)

| Key | Purpose |
|---|---|
| `VERCEL_OIDC_TOKEN` | Injected automatically by the Vercel CLI/platform in `.env.local` — do not set by hand. |

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [BASE_PROJECT.md](BASE_PROJECT.md) — what's in this base, what was stripped out, and next steps
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) — using the admin dashboard
