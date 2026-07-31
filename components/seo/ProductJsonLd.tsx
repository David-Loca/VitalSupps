import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";
import { getProductContent } from "@/lib/products";
import { resolveAbsoluteImageUrl } from "@/lib/seo/og-image";
import { getProductKeywords } from "@/lib/seo/product-keywords";
import { keywordsForJsonLd } from "@/lib/seo/json-ld-limits";

type ProductJsonLdProps = {
  product: Product;
  locale: Locale;
  canonicalUrl: string;
  baseUrl: string;
};

/**
 * schema.org/Product structured data for product pages — enables rich
 * results (price, availability, star rating) in Google/Bing search.
 */
export function ProductJsonLd({ product, locale, canonicalUrl, baseUrl }: ProductJsonLdProps) {
  const content = getProductContent(product, locale);
  const image = resolveAbsoluteImageUrl(product.images?.primary, baseUrl);
  const keywords = keywordsForJsonLd(getProductKeywords(product.slug, locale));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.name,
    description: content.tagline,
    image,
    sku: product.slug,
    productID: product.slug,
    brand: {
      "@type": "Brand",
      name: "VitalSupps",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    },
  };

  if (keywords.length) {
    data.keywords = keywords.join(", ");
  }

  if (product.rating && product.reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
