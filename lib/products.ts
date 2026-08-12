import productsData from "@/data/products.json";
import type { Locale } from "@/lib/i18n";

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductLocaleContent {
  name: string;
  tagline: string;
  heroImageAlt: string;
  targetAudience: string;
  benefits: string[];
  usage: string;
  safety?: string;
  ingredients: string[];
  faq: ProductFaqItem[];
  /**
   * Optional per-product, per-locale override for the pre-filled WhatsApp
   * message used by the "Ask on WhatsApp" / inquiry CTA (e.g. on the
   * homepage product cards). Supports {product} and {variant} placeholders.
   * Falls back to the site-wide `whatsapp.productInquiryTemplate`
   * translation when unset.
   */
  whatsappInquiryTemplate?: string;
  /**
   * Optional per-product, per-locale override for the pre-filled WhatsApp
   * message used by the buy box's "Buy via WhatsApp" CTA. Supports
   * {product}, {variant}, and {quantity} placeholders. Falls back to the
   * site-wide `whatsapp.productOrderTemplate` translation when unset.
   */
  whatsappOrderTemplate?: string;
  /**
   * Optional admin-editable SEO keywords for this product/locale, comma-separated
   * (not visible on site — added to `<meta name="keywords">` and JSON-LD).
   * Merged with the curated list in lib/seo/product-keywords.ts, not a replacement.
   */
  seoKeywords?: string;
}

export interface ProductSpecs {
  servingSize: string;
  servingsPerContainer: string;
  form: string;
  allergens: string;
}

/**
 * Placeholder customer review. Every entry currently in `data/products.json`
 * is marked `isSample: true` — this is fabricated, illustrative content
 * used to build out the reviews UI ahead of real customer photography/
 * reviews. Replace with real, verified reviews before launch and remove
 * the `isSample` flag (or set it to false) once genuine reviews are in.
 */
export interface ProductReview {
  name: string;
  daysAgo: number;
  rating: number;
  text: string;
  isSample: true;
}

/**
 * A purchasable size/format option for a product (e.g. "60 Capsules",
 * "30ml Drops"), each with its own price and gallery images. Optional —
 * products without variants keep behaving exactly as before, driven by
 * the top-level `price`/`compareAtPrice`/`images.primary` fields.
 */
export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  isDefault?: boolean;
}

export interface Product {
  slug: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  images: { primary: string };
  specs?: ProductSpecs;
  reviews?: ProductReview[];
  variants?: ProductVariant[];
  en: ProductLocaleContent;
  fr: ProductLocaleContent;
  es: ProductLocaleContent;
  de: ProductLocaleContent;
}

export const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductContent(product: Product, locale: Locale): ProductLocaleContent {
  return product[locale] ?? product.en;
}

/**
 * Currency + regional number-format per site language: English shows USD,
 * French/German/Spanish show EUR (matching the "Made in [country]" choices
 * already used for those locales). The underlying price number is the same
 * across locales — only the symbol/format changes, not the amount.
 */
const CURRENCY_BY_LOCALE: Record<Locale, { currency: string; intlLocale: string }> = {
  en: { currency: "USD", intlLocale: "en-US" },
  fr: { currency: "EUR", intlLocale: "fr-FR" },
  de: { currency: "EUR", intlLocale: "de-DE" },
  es: { currency: "EUR", intlLocale: "es-ES" },
};

export function formatPrice(price: number, locale: Locale = "en"): string {
  const { currency, intlLocale } = CURRENCY_BY_LOCALE[locale] ?? CURRENCY_BY_LOCALE.en;
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
  }).format(price);
}

/**
 * Percentage discount off `compareAtPrice`, rounded to the nearest whole percent.
 * Accepts either a full `Product` (backward-compatible, reads its top-level
 * price fields) or an explicit `{ price, compareAtPrice }` pair — useful for
 * computing savings on a currently-selected variant instead of the product default.
 */
export function getSavingsPercent(
  productOrPrice: Product | { price: number; compareAtPrice?: number }
): number | null {
  const { price, compareAtPrice } = productOrPrice;
  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }
  return Math.round((1 - price / compareAtPrice) * 100);
}

/** The default variant (flagged `isDefault`), else the first variant, else null. */
export function getDefaultVariant(product: Product): ProductVariant | null {
  if (!product.variants || product.variants.length === 0) return null;
  return product.variants.find((v) => v.isDefault) ?? product.variants[0];
}

/** Lowest price across all variants, or the product's own price if it has none — used for "From $X" homepage copy. */
export function getLowestVariantPrice(product: Product): number {
  if (!product.variants || product.variants.length === 0) return product.price;
  return Math.min(...product.variants.map((v) => v.price));
}

export function getProductRating(product: Product): { rating: number; reviewCount: number } {
  return {
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
  };
}

export function getProductReviews(product: Product): ProductReview[] {
  return product.reviews ?? [];
}

/** Count of reviews per star rating (5 down to 1), for a distribution bar. */
export function getReviewDistribution(product: Product): { star: number; count: number; percent: number }[] {
  const reviews = getProductReviews(product);
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, percent: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
}

/** Combined bundle price for buying both products together, at a fixed discount off the sum. */
export function getBundlePrice(products: Product[], discountPercent = 15): number {
  const sum = products.reduce((total, p) => total + p.price, 0);
  return Math.round(sum * (1 - discountPercent / 100) * 100) / 100;
}
