import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import { getLegalUrl } from "@/lib/utils/installation-slugs";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { getPublishedLocales } from "@/lib/admin/blog-locales";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://vital-healthstore.com";
}

// NOTE: the file this default key pointed to (public/0eb11dfbd77a4ebeb9f0b5c64861ac23.txt)
// was deleted as part of the IPTV cleanup. Set INDEXNOW_KEY / INDEXNOW_KEY_LOCATION
// env vars and add a matching public/<key>.txt file before relying on IndexNow again.
const DEFAULT_INDEXNOW_KEY = "0eb11dfbd77a4ebeb9f0b5c64861ac23";

function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_INDEXNOW_KEY;
}

function getIndexNowKeyLocation(): string {
  const baseUrl = getBaseUrl();
  const key = getIndexNowKey();
  return process.env.INDEXNOW_KEY_LOCATION || `${baseUrl}/${key}.txt`;
}

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function isSameHost(urlStr: string, host: string): boolean {
  try {
    const u = new URL(urlStr);
    return u.host === host;
  } catch {
    return false;
  }
}

export function buildIndexNowUrlListForMetadata(locale: Locale): string[] {
  const baseUrl = getBaseUrl();

  const urls: string[] = [];
  // Core pages commonly updated via metadata
  urls.push(`${baseUrl}/${locale}/`);
  urls.push(`${baseUrl}/${locale}/blog/`);

  // Legal pages
  urls.push(`${baseUrl}${getLegalUrl("refund-policy", locale)}`);
  urls.push(`${baseUrl}${getLegalUrl("privacy-policy", locale)}`);
  urls.push(`${baseUrl}${getLegalUrl("terms-of-service", locale)}`);

  return uniq(urls);
}

export function buildIndexNowUrlListForBlog(blog: BlogPost): string[] {
  const baseUrl = getBaseUrl();
  const urls: string[] = [];

  // Always ping blog listing pages (discovery + internal links)
  locales.forEach((loc) => {
    urls.push(`${baseUrl}/${loc}/blog/`);
  });

  // Ping the post URL for each published locale (slugs may differ per locale)
  getPublishedLocales(blog).forEach((loc) => {
    const path = getBlogUrl(blog, loc);
    if (!path.includes("/blog//")) {
      urls.push(`${baseUrl}${path}`);
    }
  });

  return uniq(urls);
}

export async function submitToIndexNow(urlList: string[]): Promise<{ ok: boolean; status: number; body?: any }> {
  const baseUrl = getBaseUrl();
  const host = new URL(baseUrl).host;

  const sanitized = uniq(urlList)
    .filter((u) => typeof u === "string" && u.length > 0)
    .filter((u) => isSameHost(u, host));

  if (sanitized.length === 0) {
    return { ok: true, status: 200, body: { skipped: true, reason: "No valid URLs to submit" } };
  }

  const payload = {
    host,
    key: getIndexNowKey(),
    keyLocation: getIndexNowKeyLocation(),
    urlList: sanitized,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  let body: any = undefined;
  try {
    body = await res.json();
  } catch {
    // IndexNow often returns empty body on success
  }

  return { ok: res.ok, status: res.status, body };
}

