import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getRouteMetaKeywords } from "@/lib/seo/corpus-route-keywords";
import { legalRefundSeeds } from "@/lib/seo/route-seed-keywords";
import { WebPageJsonLd } from "@/components/seo/WebPageJsonLd";
import { buildLegalHreflangAlternates } from "@/lib/seo/hreflang";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { getLegalUrl } from "@/lib/utils/installation-slugs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!locales.includes(localeParam as Locale)) {
    return {
      title: "Page introuvable",
      description: "La page que vous recherchez n'existe pas.",
    };
  }

  const locale = localeParam as Locale;
  const baseUrl = getSiteBaseUrl();

  const titleMap: Record<Locale, string> = {
  en: "Refund Policy | VitalSupps",
  fr: "Politique de Remboursement | VitalSupps",
  es: "Política de Reembolso | VitalSupps",
  de: "Rückerstattungsrichtlinie | VitalSupps",
};

  const descriptionMap: Record<Locale, string> = {
  en: "Learn about VitalSupps' return process, eligibility, and how to request a refund.",
  fr: "Découvrez le processus de retour de VitalSupps, l'éligibilité et comment demander un remboursement.",
  es: "Conoce el proceso de devolución de VitalSupps, la elegibilidad y cómo solicitar un reembolso.",
  de: "Erfahren Sie mehr über den Rückgabeprozess von VitalSupps, die Berechtigung und wie Sie eine Rückerstattung beantragen.",
};

  const keywords = getRouteMetaKeywords(locale, "legal", legalRefundSeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("refund-policy", locale)}`;
  const languageAlternates = buildLegalHreflangAlternates(
    baseUrl,
    "refund-policy",
    getLegalUrl
  );

  return buildSocialMetadata({
    title: titleMap[locale],
    description: descriptionMap[locale],
    locale,
    canonicalUrl,
    keywords,
    type: "website",
    languageAlternates,
    useGeneratedOgImage: true,
  });
}

export default async function RefundPolicyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locale)) {
    return <>{children}</>;
  }
  const locale = localeParam as Locale;
  const baseUrl = getSiteBaseUrl();

  const titleMap: Record<Locale, string> = {
  en: "Refund Policy | VitalSupps",
  fr: "Politique de Remboursement | VitalSupps",
  es: "Política de Reembolso | VitalSupps",
  de: "Rückerstattungsrichtlinie | VitalSupps",
};

  const descriptionMap: Record<Locale, string> = {
  en: "Learn about VitalSupps' return process, eligibility, and how to request a refund.",
  fr: "Découvrez le processus de retour de VitalSupps, l'éligibilité et comment demander un remboursement.",
  es: "Conoce el proceso de devolución de VitalSupps, la elegibilidad y cómo solicitar un reembolso.",
  de: "Erfahren Sie mehr über den Rückgabeprozess von VitalSupps, die Berechtigung und wie Sie eine Rückerstattung beantragen.",
};

  const keywords = getRouteMetaKeywords(locale, "legal", legalRefundSeeds[locale]);
  const canonicalUrl = `${baseUrl}${getLegalUrl("refund-policy", locale)}`;

  return (
    <>
      <WebPageJsonLd
        url={canonicalUrl}
        name={titleMap[locale]}
        description={descriptionMap[locale]}
        locale={locale}
        keywords={keywords}
        siteUrl={`${baseUrl}/${locale}/`}
      />
      {children}
    </>
  );
}
