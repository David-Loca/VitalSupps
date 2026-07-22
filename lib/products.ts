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
}

export interface Product {
  slug: string;
  price: number;
  images: { primary: string };
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

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
