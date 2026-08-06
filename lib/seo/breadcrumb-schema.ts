import type { Locale } from "@/lib/i18n";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BREADCRUMB_LABELS: Record<Locale, { home: string; blog: string; products: string }> = {
  en: { home: "Home", blog: "Blog", products: "Products" },
  fr: { home: "Accueil", blog: "Blog", products: "Produits" },
  es: { home: "Inicio", blog: "Blog", products: "Productos" },
  de: { home: "Startseite", blog: "Blog", products: "Produkte" },
};

/** BreadcrumbList JSON-LD for a single non-homepage page's ancestry. */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
