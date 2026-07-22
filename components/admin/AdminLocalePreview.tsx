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
