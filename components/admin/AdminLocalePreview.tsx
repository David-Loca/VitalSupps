"use client";

import { normalizeInlineHeroText } from "@/lib/i18n/normalize-hero-text";

type GetValue = (path: string) => string;
type GetBoolValue = (path: string, defaultValue?: boolean) => boolean;

type PreviewProps = {
  locale: string;
  getValue: GetValue;
  getBoolValue?: GetBoolValue;
};

export function AdminHeroPreview({ locale, getValue }: PreviewProps) {
  const isRegional = locale === "ca" || locale === "uk";

  if (isRegional) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
          Homepage hero preview ({locale})
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb] mb-3">
          {getValue("hero.eyebrow")}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight mb-4 max-w-xl">
          <span className="block">{getValue("hero.title")}</span>
          <span className="block mt-1 text-base font-semibold text-neutral-600">
            {getValue("hero.subtitlePart1")}{" "}
            <span className="text-[#2563eb]">{getValue("hero.subtitlePart2")}</span>
          </span>
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-lg mb-4">
          {normalizeInlineHeroText(getValue("hero.lead"))}{" "}
          <span className="font-medium text-[#2563eb]">
            {normalizeInlineHeroText(getValue("hero.channelsLink"))}
          </span>
          {normalizeInlineHeroText(getValue("hero.lead2"))}{" "}
          {normalizeInlineHeroText(getValue("hero.lead3"))}{" "}
          {normalizeInlineHeroText(getValue("hero.lead4"))}{" "}
          {normalizeInlineHeroText(getValue("hero.lead5"))}
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex px-5 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-lg">
            {getValue("hero.cta")}
          </span>
          <span className="text-xs text-neutral-500">{getValue("hero.ctaNote")}</span>
        </div>
        <p className="text-xs text-neutral-500 max-w-lg">
          UK keyword pills appear in the section below the hero stats (not inside the hero).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">Homepage hero preview</p>
      <h1 className="text-3xl font-bold text-black mb-3">
        <span className="underline decoration-blue-600">{getValue("hero.title")}</span>
        <br />
        <span className="mt-2 block text-xl font-semibold">
          {getValue("hero.subtitlePart1")}{" "}
          <span className="text-blue-600">{getValue("hero.subtitlePart2")}</span>
        </span>
      </h1>
      <p className="text-gray-600 leading-relaxed text-sm">
        {normalizeInlineHeroText(getValue("hero.description"))}
      </p>
    </div>
  );
}

/**
 * Live preview of the site-wide announcement bar shown above the header on
 * every page. Mirrors `components/Header.tsx`'s exact rendering rules —
 * including that an empty message is skipped entirely (no orphaned "·"
 * separator) — so what the admin sees here always matches production.
 */
export function AdminAnnouncementPreview({ getValue }: PreviewProps) {
  const messages = [
    getValue("announcement.shipping"),
    getValue("announcement.guarantee"),
    getValue("announcement.whatsapp"),
  ].filter((text) => text && text.trim().length > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
        Announcement bar preview (shown above the header on every page)
      </p>
      {messages.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          All three messages are empty — the bar will not render at all on the live site.
        </p>
      ) : (
        <div className="bg-accent-blue-dark text-white text-[11px] sm:text-xs font-medium tracking-wide rounded-md">
          <div className="h-8 flex items-center justify-center overflow-hidden px-4">
            <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden text-ellipsis">
              {messages.map((text, i) => (
                <span key={i} className="contents">
                  {i > 0 && (
                    <span className="text-white/40" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <span>{text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
