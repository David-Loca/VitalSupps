import type { BlogLocale } from "@/lib/admin/blog-locales";

export const ADMIN_BLOG_LOCALE_LABELS: Record<BlogLocale, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
};

export const ADMIN_BLOG_LOCALE_SHORT: Record<BlogLocale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  de: "DE",
};

export const ADMIN_BLOG_SLUG_PLACEHOLDERS: Record<BlogLocale, string> = {
  en: "my-article",
  fr: "mon-article",
  es: "mi-articulo",
  de: "mein-artikel",
};

const TITLE_PLACEHOLDERS: Record<BlogLocale, string> = {
  en: "Enter the article title",
  fr: "Saisissez le titre de l'article",
  es: "Introduce el título del artículo",
  de: "Geben Sie den Artikeltitel ein",
};

const EXCERPT_PLACEHOLDERS: Record<BlogLocale, string> = {
  en: "Short description for the listing page",
  fr: "Courte description pour la page de liste",
  es: "Breve descripción para la página de listado",
  de: "Kurzbeschreibung für die Übersichtsseite",
};

const META_DESCRIPTION_PLACEHOLDERS: Record<BlogLocale, string> = {
  en: "SEO description for search engines and social media",
  fr: "Description SEO pour la recherche et les réseaux sociaux",
  es: "Descripción SEO para buscadores y redes sociales",
  de: "SEO-Beschreibung für Suchmaschinen und soziale Medien",
};

export function getBlogLocaleLabel(locale: BlogLocale): string {
  return ADMIN_BLOG_LOCALE_LABELS[locale];
}

export function getBlogLocaleShort(locale: BlogLocale): string {
  return ADMIN_BLOG_LOCALE_SHORT[locale];
}

export function getBlogSlugPlaceholder(locale: BlogLocale): string {
  return ADMIN_BLOG_SLUG_PLACEHOLDERS[locale];
}

export function getBlogTitlePlaceholder(locale: BlogLocale): string {
  return TITLE_PLACEHOLDERS[locale];
}

export function getBlogExcerptPlaceholder(locale: BlogLocale): string {
  return EXCERPT_PLACEHOLDERS[locale];
}

export function getBlogMetaDescriptionPlaceholder(locale: BlogLocale): string {
  return META_DESCRIPTION_PLACEHOLDERS[locale];
}

export function getBlogBlockTextPlaceholder(
  locale: BlogLocale,
  blockType: "heading" | "paragraph" | "quote" | "list"
): string {
  const label = getBlogLocaleLabel(locale);
  switch (blockType) {
    case "heading":
      return `Heading text (${label})`;
    case "paragraph":
      return `Paragraph text (${label})`;
    case "quote":
      return `Quote text (${label})`;
    case "list":
      return `List item (${label})`;
  }
}
