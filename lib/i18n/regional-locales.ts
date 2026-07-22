import type { Locale } from "@/lib/i18n";

export const REGIONAL_ENGLISH_LOCALES = [] as const satisfies readonly Locale[];

export type RegionalEnglishLocale = never;

export function isRegionalEnglishLocale(_locale: Locale): boolean {
  return false;
}
