import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fixDuplicateLocalePath } from '@/lib/i18n/locale-path';
import { locales, defaultLocale } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();

  const isAdminIndex = pathname === "/admin" || pathname === "/admin/";

  // Protect admin routes (except login and index redirect page)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !isAdminIndex
  ) {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // CRITICAL: Root domain redirect - must be 301 permanent redirect for SEO
  // Redirect root domain to /fr/ to prevent duplicate content
  // Add noindex header so Google doesn't try to index the root domain
  if (pathname === '/') {
    url.pathname = `/${defaultLocale}/`;
    const response = NextResponse.redirect(url, 301);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Redirect root language pages without trailing slash to with trailing slash
  // e.g., /fr -> /fr/
  if ((locales as string[]).includes(pathname.slice(1)) && pathname.length === 3) {
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 301);
  }

  // Fix malformed URLs from old locale switcher (e.g. /ca/uk/ → /uk/)
  const fixedDuplicateLocale = fixDuplicateLocalePath(pathname);
  if (fixedDuplicateLocale) {
    url.pathname = fixedDuplicateLocale;
    return NextResponse.redirect(url, 301);
  }

  // Parse path segments for locale and slug detection
  const pathSegments = pathname.split('/').filter(Boolean);
  const hasTrailingSlash = pathname.endsWith('/');

  // Redirect English slugs to localized French slugs
  // AND handle trailing slash in one redirect to avoid double redirects
  // This ensures canonical URLs are used (localized slugs are canonical)
  // CRITICAL: Add noindex header so Google doesn't try to index these redirect pages
  if (pathSegments.length >= 2) {
    const locale = pathSegments[0];
    const slug = pathSegments[1];

    const localizedSlugRedirectMaps: Record<string, Record<string, string>> = {
      fr: {
        'refund-policy': 'politique-de-remboursement',
        'privacy-policy': 'politique-de-confidentialite',
        'terms-of-service': 'conditions-utilisation',
      },
      it: {
        'refund-policy': 'politica-di-rimborso',
        'privacy-policy': 'informativa-sulla-privacy',
        'terms-of-service': 'termini-di-utilizzo',
      },
    };

    const redirectMap = localizedSlugRedirectMaps[locale];

    if (redirectMap?.[slug]) {
      // Redirect directly to localized version with trailing slash
      url.pathname = `/${locale}/${redirectMap[slug]}/`;
      const response = NextResponse.redirect(url, 301);
      // Add noindex header so Google doesn't try to index the English slug URL
      // This prevents it from appearing in Search Console as "not indexed"
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
  }

  // Handle trailing slash consistency for other routes
  // But exclude API routes, admin routes, and static files
  // Only do this if we haven't already redirected above
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/_next') &&
    !pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/i) &&
    pathname.length > 1 &&
    !hasTrailingSlash &&
    pathSegments.length > 0 &&
    (locales as string[]).includes(pathSegments[0])
  ) {
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sitemap.xml|robots.txt).*)',
  ],
};
