import type { Locale } from "@/lib/i18n";

export type LocaleSurface = {
  cardRadius: string;
  btnRadius: string;
  planBadgeRadius: string;
  sectionSoftBg: string;
  faqWrapper: string;
  faqAnswerBorder: string;
  ctaPanel: string;
  blogCard: string;
  testimonialCard: string;
};

const defaultSurface: LocaleSurface = {
  cardRadius: "rounded-2xl",
  btnRadius: "rounded-lg",
  planBadgeRadius: "rounded-full",
  sectionSoftBg: "",
  faqWrapper: "rounded-2xl shadow-lg border-2 border-subtle-gray",
  faqAnswerBorder: "border-l-4 border-accent-blue",
  ctaPanel:
    "rounded-2xl bg-white border border-dark-text/10 p-7 sm:p-8 lg:p-10 overflow-hidden shadow-sm",
  blogCard: "rounded-xl border border-subtle-gray",
  testimonialCard:
    "p-5 rounded-2xl border border-subtle-gray bg-white/80 backdrop-blur-sm hover:border-accent-blue/30 shadow-sm hover:shadow-card-hover transition-shadow duration-300",
};

export function getLocaleSurface(_locale: Locale): LocaleSurface {
  return defaultSurface;
}
