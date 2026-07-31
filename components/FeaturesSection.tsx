"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  Leaf,
  ShieldCheck,
  Sparkles,
  Factory,
  HeartPulse,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useShouldReduceAnimations, useIsMobile } from "@/lib/utils/performance";
import { getLocaleSurface } from "@/lib/i18n/locale-surface";
import { BotanicalCornerSmall } from "@/components/admin/ui/Decorative";

interface Feature {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}

export default function FeaturesSection() {
  const { t, locale } = useLanguage();
  const surface = getLocaleSurface(locale);
  const reduceAnimations = useShouldReduceAnimations();
  const mobile = useIsMobile();

  const features: Feature[] = [
    {
      id: "feature-1",
      icon: <FlaskConical className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature1.title",
      descriptionKey: "features.feature1.description",
    },
    {
      id: "feature-2",
      icon: <Leaf className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature2.title",
      descriptionKey: "features.feature2.description",
    },
    {
      id: "feature-3",
      icon: <ShieldCheck className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature3.title",
      descriptionKey: "features.feature3.description",
    },
    {
      id: "feature-4",
      icon: <Sparkles className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature4.title",
      descriptionKey: "features.feature4.description",
    },
    {
      id: "feature-5",
      icon: <Factory className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature5.title",
      descriptionKey: "features.feature5.description",
    },
    {
      id: "feature-6",
      icon: <HeartPulse className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature6.title",
      descriptionKey: "features.feature6.description",
    },
  ];

  const featureItems = features;

  return (
    <section
      id="features"
      className={`py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 ${surface.sectionSoftBg || "bg-white"}`}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Heading - Simple h2 for accessibility */}
        <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-center mb-4 xl:mb-6 2xl:mb-8 text-brand-text">
          {t("features.sectionTitle") || t("common.features")}
        </h2>
        {t("features.sectionSubtitle") ? (
          <p className="text-center text-[15px] leading-[1.75] text-brand-text-secondary max-w-3xl mx-auto mb-8 xl:mb-10 2xl:mb-12">
            {t("features.sectionSubtitle")}
          </p>
        ) : (
          <div className="mb-8 xl:mb-10 2xl:mb-12" />
        )}

        {/* Stat panel + feature list */}
        <div className="grid grid-cols-1 lg:grid-cols-[36%_64%] gap-6 lg:gap-10 xl:gap-14 items-stretch">
          {/* Stat panel */}
          <motion.div
            initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: mobile ? "-50px" : "-100px" }}
            transition={reduceAnimations ? {} : { duration: 0.4, ease: "easeOut" }}
            className="relative isolate overflow-hidden rounded-brand-lg bg-brand-primary-dark p-7 sm:p-9 flex flex-col justify-center gap-7 sm:gap-8"
          >
            <BotanicalCornerSmall className="pointer-events-none absolute -right-6 -bottom-8 z-0 h-40 w-40 text-white opacity-[0.07]" />
            {[
              { value: t("features.statChannelsValue"), label: t("features.statChannelsLabel") },
              { value: t("features.statMoviesValue"), label: t("features.statMoviesLabel") },
              { value: t("features.statSupportValue"), label: t("features.statSupportLabel") },
            ].map((stat) => (
              <div key={stat.label} className="relative z-10">
                <p className="font-semibold text-3xl sm:text-4xl text-white leading-none mb-1.5">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-white/75">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7 sm:gap-y-8">
            {featureItems.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: mobile ? "-50px" : "-100px" }}
                transition={reduceAnimations ? {} : {
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="flex items-start gap-4"
              >
                {/* Icon - plain thin-stroke, no colored circle */}
                <div className="text-brand-gold shrink-0 mt-0.5">
                  {feature.icon}
                </div>

                <div>
                  {/* Title */}
                  <h3 className="font-semibold mb-1.5 text-brand-text text-base sm:text-lg tracking-tight">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-brand-text-secondary text-[15px] leading-[1.75]">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust strip - simple text badges (no fabricated logos) */}
        <motion.div
          initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: mobile ? "-50px" : "-100px" }}
          transition={reduceAnimations ? {} : { duration: 0.3, delay: 0.2 }}
          className="mt-8 lg:mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-brand-text/60 text-sm font-medium"
        >
          <span>{t("features.trustBadgesAlt")}</span>
          <span aria-hidden="true">·</span>
          <span>{t("features.badgeLabTested")}</span>
          <span aria-hidden="true">·</span>
          <span>{t("features.badgeMadeInUsa")}</span>
          <span aria-hidden="true">·</span>
          <span>{t("features.badgeNonGmo")}</span>
        </motion.div>
      </div>
    </section>
  );
}

