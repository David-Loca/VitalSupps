import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { getAllProducts, getProductBySlug, getProductContent, formatPrice } from "@/lib/products";
import { buildSocialMetadata } from "@/lib/seo/social-metadata";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { buildHreflangAlternatesForPaths } from "@/lib/seo/hreflang";
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
    (loc) => `/${loc}/products/${slug}/`
  );

  return buildSocialMetadata({
    title: `${content.name} | VitalSupps`,
    description: `${content.tagline} — ${formatPrice(product.price)}. ${content.targetAudience}`,
    locale,
    canonicalUrl: `${baseUrl}/${locale}/products/${slug}/`,
    keywords: [content.name, "VitalSupps"],
    type: "website",
    languageAlternates: hreflangAlternates,
    useGeneratedOgImage: true,
  });
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

  return <ProductPageClient product={product} locale={locale} />;
}
