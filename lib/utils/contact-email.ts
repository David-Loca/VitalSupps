import type { Locale } from "@/lib/i18n";

/** Default public inbox per site language (override with NEXT_PUBLIC_CONTACT_EMAIL_EN | _ES | _FR). */
const CONTACT_EMAIL_BY_LOCALE: Record<Locale, string> = {
  en: "info@example.com",
  fr: "info@example.com",
  es: "info@example.com",
  de: "info@example.com",
};

/**
 * Returns the contact email for the active locale.
 * Optional env: `NEXT_PUBLIC_CONTACT_EMAIL_EN`, `NEXT_PUBLIC_CONTACT_EMAIL_ES`, `NEXT_PUBLIC_CONTACT_EMAIL_FR`.
 */
export function getContactEmailForLocale(locale: Locale): string {
  const key = `NEXT_PUBLIC_CONTACT_EMAIL_${locale.toUpperCase()}` as keyof NodeJS.ProcessEnv;
  const fromEnv = process.env[key];
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return fromEnv.trim();
  }
  return CONTACT_EMAIL_BY_LOCALE[locale] ?? CONTACT_EMAIL_BY_LOCALE.en;
}
