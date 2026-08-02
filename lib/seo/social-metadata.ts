import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { openGraphLocaleMap, siteNameMap } from "@/lib/i18n/locale-maps";
import {
  getOgImageDimensions,
  getSiteBaseUrl,
  inferOgImageMimeType,
  optimizeImageForSocialShare,
  resolveAbsoluteImageUrl,
} from "@/lib/seo/og-image";

export interface SocialMetadataInput {
  title: string;
  description: string;
  locale: Locale;
  canonicalUrl: string;
  /** Raw path or absolute URL; optimized for Cloudinary when applicable. */
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
  languageAlternates?: Record<string, string>;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  section?: string;
  author?: string;
  /** When true, omit openGraph.images so a sibling opengraph-image.tsx file is used. */
  useGeneratedOgImage?: boolean;
}

function getSafeMetadataBase(): URL {
  try {
    return new URL(getSiteBaseUrl());
  } catch {
    return new URL("https://www.vital-healthstore.com");
  }
}

export function buildSocialMetadata(input: SocialMetadataInput): Metadata {
  const {
    title,
    description,
    locale,
    canonicalUrl,
    image,
    imageAlt,
    keywords,
    type = "website",
    languageAlternates,
    publishedTime,
    modifiedTime,
    tags = [],
    section,
    author = "VitalSupps",
    useGeneratedOgImage = false,
  } = input;

  const baseUrl = getSiteBaseUrl();
  const ogImageRaw = resolveAbsoluteImageUrl(image, baseUrl);
  const ogImage = optimizeImageForSocialShare(ogImageRaw);
  const mimeType = inferOgImageMimeType(ogImage);
  const dimensions = getOgImageDimensions(ogImage);
  const alt = imageAlt ?? title;

  const alternateLocale = locales
    .filter((loc) => loc !== locale)
    .map((loc) => openGraphLocaleMap[loc]);

  const ogImages = useGeneratedOgImage
    ? undefined
    : [
        {
          url: ogImage,
          width: dimensions.width,
          height: dimensions.height,
          alt,
          type: mimeType,
        },
      ];

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type: type === "article" ? "article" : "website",
    locale: openGraphLocaleMap[locale],
    alternateLocale,
    url: canonicalUrl,
    siteName: siteNameMap[locale],
    title,
    description,
    ...(ogImages ? { images: ogImages } : {}),
    ...(type === "article" && {
      publishedTime,
      modifiedTime,
      authors: [author],
      section,
      tags,
    }),
  };

  const twitterImages = useGeneratedOgImage ? undefined : [ogImage];

  const other: Record<string, string> = {
    "og:image:alt": alt,
    "article:author": author,
  };

  if (!useGeneratedOgImage) {
    other["og:image:secure_url"] = ogImage;
    other["og:image:type"] = mimeType;
    other["og:image:width"] = String(dimensions.width);
    other["og:image:height"] = String(dimensions.height);
    if (publishedTime) other["article:published_time"] = publishedTime;
    if (modifiedTime) other["article:modified_time"] = modifiedTime;
  }

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    authors: [{ name: author }],
    creator: author,
    publisher: "VitalSupps",
    applicationName: "VitalSupps",
    metadataBase: getSafeMetadataBase(),
    alternates: {
      canonical: canonicalUrl,
      ...(languageAlternates ? { languages: languageAlternates } : {}),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(twitterImages ? { images: twitterImages } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other,
  };
}
