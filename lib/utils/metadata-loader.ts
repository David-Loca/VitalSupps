/**
 * Utility to load page metadata from JSON files
 * Falls back to defaults if file doesn't exist
 */

import type { Locale } from '@/lib/i18n';
import { locales as validLocalesList } from '@/lib/i18n';
import { getDefaultMetadata } from '@/lib/admin/metadata';
import type { MetadataContent } from '@/lib/admin/metadata';
import fs from 'fs';
import path from 'path';
import { cache } from 'react';

/**
 * Load metadata for a locale (deduped per request when called from layout + generateMetadata)
 */
export const loadPageMetadata = cache(async function loadPageMetadata(locale: Locale): Promise<MetadataContent> {
  // Validate locale first - only valid locales should reach here
  const validLocales: Locale[] = validLocalesList;
  if (!validLocales.includes(locale)) {
    // Invalid locale, return default for English
    return getDefaultMetadata('en');
  }
  
  // Try to load from file system
  try {
    const filePath = path.join(process.cwd(), 'data', 'metadata', `${locale}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    return data as MetadataContent;
  } catch (error) {
    // File doesn't exist or can't be read, use default
    // Only log error for valid locales (invalid ones are handled above)
    if (validLocales.includes(locale)) {
      console.error(`Failed to load metadata for ${locale}, using defaults:`, error);
    }
  }

  // Fallback to default
  return getDefaultMetadata(locale);
});

/**
 * Get homepage metadata
 */
export async function getHomepageMetadata(locale: Locale): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.homepage;
}

/**
 * Get blog listing metadata
 */
export async function getBlogListingMetadata(locale: Locale): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.blogListing;
}

/**
 * Get blog page metadata (the "blog" section in metadata file)
 */
export async function getBlogMetadata(locale: Locale): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.blog;
}

/**
 * Get legal page metadata
 */
export async function getLegalMetadata(
  locale: Locale,
  page: "refundPolicy" | "privacyPolicy" | "termsOfService"
): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.legal[page];
}
