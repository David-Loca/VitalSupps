"use client";

import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import NotFoundContent from "@/components/NotFoundContent";

function detectLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return (locales as readonly string[]).includes(firstSegment)
    ? (firstSegment as Locale)
    : defaultLocale;
}

export default function NotFound() {
  const pathname = usePathname();
  const detectedLocale = detectLocaleFromPath(pathname || "");

  return (
    <LanguageProvider initialLocale={detectedLocale}>
      <NotFoundContent />
    </LanguageProvider>
  );
}
