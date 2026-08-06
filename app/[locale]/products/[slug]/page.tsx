import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { getAllProducts, getProductBySlug, getProductContent, formatPrice } from "@/lib/products";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { buildHreflangAlternatesForPaths } from "@/lib/seo/hreflang";
import { getProductKeywords } from "@/lib/seo/product-keywords";
import { getProductUrl } from "@/lib/utils/product-slugs";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { buildBreadcrumbSchema, BREADCRUMB_LABELS } from "@/lib/seo/breadcrumb-schema";
import ProductPageClient from "./ProductPageClient";

export async function generateStaticParams() {
  const products = getAllProducts();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const product of products) {
      params.push({ locale, slug: product.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!locales.includes(localeParam as Locale)) {
    return { title: "Page not found" };
  }
  const locale = localeParam as Locale;

  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  const content = getProductContent(product, locale);
  const baseUrl = getSiteBaseUrl();
  const hreflangAlternates = buildHreflangAlternatesForPaths(
    baseUrl,
    (loc) => getProductUrl(slug, loc)
  );

  const { title, description } = buildProductTitleAndDescription(slug, locale, content, product);

  return buildSocialMetadata({
    title,
    description,
    locale,
    canonicalUrl: `${baseUrl}${getProductUrl(slug, locale)}`,
    keywords: getProductKeywords(slug, locale),
    type: "website",
    languageAlternates: hreflangAlternates,
    useGeneratedOgImage: true,
  });
}

const PRODUCT_TITLE_LEAD_IN: Record<string, Record<Locale, string>> = {
  "methylene-blue": {
    en: "Buy Pharmaceutical Grade Methylene Blue Drops Online",
    fr: "Acheter Bleu de Méthylène Qualité Pharmaceutique en Ligne",
    es: "Comprar Azul de Metileno Grado Farmacéutico Online",
    de: "Methylenblau Kaufen Online – Pharma Qualität",
  },
  "gut-health": {
    en: "Best Gut Health Supplement – Probiotic & Digestive Enzymes",
    fr: "Meilleur Complément Santé Intestinale – Probiotique & Enzymes",
    es: "Mejor Suplemento de Salud Intestinal – Probiótico y Enzimas",
    de: "Bestes Darmgesundheit Supplement – Probiotikum & Enzyme",
  },
};

const PRODUCT_DESCRIPTION_LEAD_IN: Record<string, Record<Locale, string>> = {
  "methylene-blue": {
    en: "Buy pharmaceutical grade methylene blue drops online — USP-grade, third-party lab-tested",
    fr: "Achetez du bleu de méthylène qualité pharmaceutique en ligne — qualité USP, testé en laboratoire indépendant",
    es: "Compre azul de metileno grado farmacéutico online — calidad USP, probado por laboratorios independientes",
    de: "Kaufen Sie Methylenblau in Pharma-Qualität online — USP-Qualität, von unabhängigen Labors geprüft",
  },
  "gut-health": {
    en: "Best gut health supplement with probiotics and digestive enzymes for a balanced microbiome",
    fr: "Meilleur complément santé intestinale avec probiotiques et enzymes digestives pour un microbiote équilibré",
    es: "Mejor suplemento de salud intestinal con probióticos y enzimas digestivas para una microbiota equilibrada",
    de: "Bestes Darmgesundheit-Supplement mit Probiotika und Verdauungsenzymen für ein ausgeglichenes Mikrobiom",
  },
};

function buildProductTitleAndDescription(
  slug: string,
  locale: Locale,
  content: { name: string; tagline: string; targetAudience: string },
  product: { price: number }
): { title: string; description: string } {
  const titleLeadIn = PRODUCT_TITLE_LEAD_IN[slug];
  const descriptionLeadIn = PRODUCT_DESCRIPTION_LEAD_IN[slug];

  const title = titleLeadIn ? `${titleLeadIn[locale]} | VitalSupps` : `${content.name} | VitalSupps`;
  const description = descriptionLeadIn
    ? `${descriptionLeadIn[locale]} — ${content.name}, ${formatPrice(product.price, locale)}. ${content.targetAudience}`
    : `${content.tagline} — ${formatPrice(product.price, locale)}. ${content.targetAudience}`;

  return { title, description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;

  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }
  const locale = localeParam as Locale;

  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = `${baseUrl}${getProductUrl(slug, locale)}`;
  const content = getProductContent(product, locale);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: BREADCRUMB_LABELS[locale].home, url: `${baseUrl}/${locale}/` },
    { name: BREADCRUMB_LABELS[locale].products, url: `${baseUrl}/${locale}/#products` },
    { name: content.name, url: canonicalUrl },
  ]);

  return (
    <>
      <ProductJsonLd product={product} locale={locale} canonicalUrl={canonicalUrl} baseUrl={baseUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductPageClient product={product} locale={locale} />
    </>
  );
}
