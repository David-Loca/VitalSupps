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
    en: "Buy Pharmaceutical Grade Methylene Blue Drops",
    fr: "Acheter Bleu de Méthylène Qualité Pharmaceutique",
    es: "Comprar Azul de Metileno Grado Farmacéutico",
    de: "Methylenblau Kaufen – Pharma Qualität",
  },
  "gut-health": {
    en: "Best Probiotic & Digestive Health Supplement",
    fr: "Meilleur Complément Probiotique & Digestion",
    es: "Mejor Suplemento Probiótico y Digestivo",
    de: "Bestes Probiotikum für die Darmgesundheit",
  },
};

const PRODUCT_DESCRIPTION_LEAD_IN: Record<string, Record<Locale, string>> = {
  "methylene-blue": {
    en: "Buy pharmaceutical grade methylene blue drops",
    fr: "Achetez du bleu de méthylène qualité pharmaceutique",
    es: "Compre azul de metileno grado farmacéutico",
    de: "Kaufen Sie Methylenblau in Pharma-Qualität",
  },
  "gut-health": {
    en: "Best probiotic digestive health supplement",
    fr: "Meilleur complément probiotique pour la digestion",
    es: "Mejor suplemento probiótico para la digestión",
    de: "Bestes Probiotikum-Supplement für die Verdauung",
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

  return (
    <>
      <ProductJsonLd product={product} locale={locale} canonicalUrl={canonicalUrl} baseUrl={baseUrl} />
      <ProductPageClient product={product} locale={locale} />
    </>
  );
}
