import { notFound } from 'next/navigation';
import { getEnglishSlugFromLocalized, isLegalSlug } from '@/lib/utils/installation-slugs';
import type { Locale } from '@/lib/i18n';
import { locales } from '@/lib/i18n';

// Import page components directly
import RefundPolicyPage from '../refund-policy/page';
import PrivacyPolicyPage from '../privacy-policy/page';
import TermsOfServicePage from '../terms-of-service/page';

// Map English slugs to their page components
const legalPageMap: Record<string, React.ComponentType> = {
  'refund-policy': RefundPolicyPage,
  'privacy-policy': PrivacyPolicyPage,
  'terms-of-service': TermsOfServicePage,
};

export default async function LegalSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale: localeParam, slug } = resolvedParams;

  // Validate locale
  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;

  // Check if this is a localized legal slug
  const englishSlug = getEnglishSlugFromLocalized(slug, locale);

  // If it's not a legal page, return 404
  if (!englishSlug || !isLegalSlug(englishSlug)) {
    notFound();
  }

  // Get the appropriate page component
  const PageComponent = legalPageMap[englishSlug];

  if (!PageComponent) {
    notFound();
  }

  // Render the page component
  return <PageComponent />;
}
