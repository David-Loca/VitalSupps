import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import { locales, type Locale } from "@/lib/i18n";

import { buildLocaleHomepageMetadata } from "@/lib/utils/homepage-route-metadata";
import { getHomeFaqMainEntity } from "@/lib/seo/home-faq-schema";
import { getContactEmailForLocale } from "@/lib/utils/contact-email";
import { hreflangByLocale } from "@/lib/seo/hreflang";

// Generate structured data for SEO
function generateStructuredData(locale: Locale, baseUrl: string) {
  const organizationName = "VitalSupps";

  const organizationDescMap: Record<Locale, string> = {
    en: "Premium, third-party lab-tested supplements — Methylene Blue and Gut Health formulas made in the USA.",
    fr: "Compléments alimentaires premium, testés en laboratoire indépendant — Bleu de méthylène et formule Santé Intestinale, fabriqués aux États-Unis.",
    es: "Suplementos premium probados por laboratorios independientes — Azul de metileno y fórmula de Salud Intestinal, fabricados en EE. UU.",
    de: "Premium-Nahrungsergänzungsmittel, von unabhängigen Labors getestet — Methylenblau und Darmgesundheits-Formel, hergestellt in den USA.",
  };

  const availableLanguageMap: Record<Locale, string[]> = {
    en: ["English"],
    fr: ["French", "Français"],
    es: ["Spanish", "Español"],
    de: ["German", "Deutsch"],
  };

  const breadcrumbHomeNameMap: Record<Locale, string> = {
    en: "Home",
    fr: "Accueil",
    es: "Inicio",
    de: "Startseite",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationName,
    description: organizationDescMap[locale],
    url: `${baseUrl}/${locale}/`, // Include trailing slash for consistency
    logo: `${baseUrl}/logo/vitalsupps-wordmark.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: getContactEmailForLocale(locale),
      availableLanguage: availableLanguageMap[locale],
    },
    sameAs: [],
  };

  // FAQ Schema for homepage — generic placeholder, override via getHomeFaqMainEntity if needed
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getHomeFaqMainEntity(locale) ?? [],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbHomeNameMap[locale],
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: organizationName,
    url: `${baseUrl}/${locale}/`,
    inLanguage: hreflangByLocale[locale],
    publisher: {
      "@type": "Organization",
      name: organizationName,
      url: `${baseUrl}/${locale}/`,
    },
  };

  return { organizationSchema, faqSchema, breadcrumbSchema, websiteSchema };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;

  // Validate locale before processing - prevent errors from invalid routes like /placeholder-image.png
  if (!locales.includes(localeParam as Locale)) {
    // Return basic metadata for invalid locales (will be handled by notFound() in layout)
    return {
      title: "Page introuvable",
      description: "La page que vous recherchez n'existe pas.",
    };
  }

  const locale = localeParam as Locale;
  return buildLocaleHomepageMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
  const { organizationSchema, faqSchema, breadcrumbSchema, websiteSchema } =
    generateStructuredData(locale as Locale, baseUrl);

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <div data-locale={locale} className="w-full overflow-x-clip">
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {children}
      </div>
    </LanguageProvider>
  );
}
