import type { Locale } from "@/lib/i18n";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const CLOUDINARY_OG_TRANSFORM = "w_1200,h_630,c_fill,g_auto,q_auto:good,f_jpg";

export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!raw) return "https://www.vital-healthstore.com";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

/** Absolute HTTPS URL for Open Graph / Twitter / WhatsApp crawlers. */
export function resolveAbsoluteImageUrl(
  value: string | undefined,
  baseUrl: string = getSiteBaseUrl()
): string {
  if (!value || value.startsWith("blob:")) {
    return `${baseUrl}/images/hero.webp`;
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  if (value.startsWith("/")) {
    return `${baseUrl}${value}`;
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return value;
    }
  } catch {
    // fall through
  }
  return `${baseUrl}/images/hero.webp`;
}

/** Infer MIME type from URL path (social crawlers validate this). */
export function inferOgImageMimeType(url: string): string {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

/**
 * Cloudinary: crop to 1.91:1 (1200×630) for Facebook, WhatsApp, LinkedIn, X.
 * Local / non-Cloudinary URLs are returned unchanged.
 */
export function optimizeImageForSocialShare(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  if (url.includes("w_1200") && url.includes("h_630")) {
    return url;
  }
  return url.replace("/upload/", `/upload/${CLOUDINARY_OG_TRANSFORM}/`);
}

export function getDefaultOgImageUrl(_locale?: Locale): string {
  return `${getSiteBaseUrl()}/images/hero.webp`;
}

/** Hero asset dimensions (metadata must match real file to avoid crop issues). */
export const DEFAULT_HERO_OG_DIMENSIONS = {
  width: 1376,
  height: 768,
} as const;

export function getOgImageDimensions(url: string): { width: number; height: number } {
  if (url.includes("res.cloudinary.com") && url.includes("w_1200")) {
    return { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
  }
  if (url.includes("/images/hero.webp")) {
    return { ...DEFAULT_HERO_OG_DIMENSIONS };
  }
  return { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
}
