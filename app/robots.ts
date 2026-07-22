import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // English slugs that should be disallowed in non-English locales
  // These will redirect, but we don't want Google to crawl/index them
  const englishSlugs = [
    'refund-policy',
    'privacy-policy',
    'terms-of-service',
  ];

  // Build disallow patterns for English slugs under every locale
  const disallowPatterns = [
    '/api/',
    '/admin/',
    ...locales.flatMap((locale) => [
      ...englishSlugs.map(slug => `/${locale}/${slug}`),
      ...englishSlugs.map(slug => `/${locale}/${slug}/`),
    ]),
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPatterns,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowPatterns,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowPatterns,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

