# Language Routing & Switching

## How it actually works

This site does **not** auto-detect a visitor's browser language. Language is determined purely
by the URL and a manual switcher — there is no `Accept-Language` header sniffing or geo-IP
detection in the codebase today.

### Supported locales

The list of supported locales lives in one place: `lib/i18n/index.ts`.

```ts
export type Locale = 'fr' | 'sv' | 'it' | 'no';
export const locales: Locale[] = ['fr', 'sv', 'it', 'no'];
export const defaultLocale: Locale = 'fr';
```

### Routing

Every public page lives under a single dynamic `app/[locale]/` route segment (not separate
per-language folders). `generateStaticParams` builds one static route per entry in `locales`, so
each supported language automatically gets every page (`/fr/`, `/sv/`, `/it/`, etc.).

### Default-locale redirect

`middleware.ts` redirects the bare root (`/`) to `/${defaultLocale}/` (currently `/fr/`) with a
301 and a `noindex` header, so search engines don't index the un-prefixed root. Visiting `/fr`
without a trailing slash also redirects to `/fr/` for consistency.

`contexts/LanguageContext.tsx`'s `LocaleDetector` does the equivalent on the client: any path that
isn't already under a known locale segment is redirected to `defaultLocale`. It does not read the
browser's language settings — it's a fallback, not a detector.

### Switching language

There is no dedicated `LanguageSwitcher` component — the switcher UI lives in
`components/Footer.tsx`, which renders one button per entry in `locales` (labelled via
`regionDisplayNames` from `lib/i18n/locale-maps.ts`). Clicking a button calls `setLocale()` in
`contexts/LanguageContext.tsx`, which:
- on a blog post page, navigates to that locale's blog listing (translated slugs aren't resolved
  client-side);
- on a legal page (privacy/refund/terms), swaps the URL slug for that locale's localized slug
  (`lib/utils/installation-slugs.ts`);
- otherwise, rewrites the current path to the new locale prefix.

### Localized URL slugs

Legal pages each have a locale-specific URL slug (e.g. `/fr/politique-de-confidentialite/`,
`/it/informativa-sulla-privacy/`). These are defined in `lib/utils/installation-slugs.ts` and
duplicated in `middleware.ts`'s `localizedSlugRedirectMaps` (so that visiting the English slug
under any locale 301-redirects to the localized one). Both must be kept in sync by hand when
adding a locale.

## If real auto-detection is wanted later

Browser-based (`Accept-Language`) or geo-IP based automatic locale selection is not implemented.
It would be a separate feature — likely a middleware check that redirects a first-time visitor at
`/` based on `Accept-Language` before falling back to `defaultLocale`, while still letting the
manual switcher override it. Out of scope for the current locale set.
