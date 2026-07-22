"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Tv,
  Video,
  Film,
  Zap,
  Server,
  Headphones,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useShouldReduceAnimations, useIsMobile, useImageQuality } from "@/lib/utils/performance";
import { getLocaleSurface } from "@/lib/i18n/locale-surface";

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
  const imageQuality = useImageQuality();
  
  const features: Feature[] = [
    {
      id: "feature-1",
      icon: <Tv className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature1.title",
      descriptionKey: "features.feature1.description",
    },
    {
      id: "feature-2",
      icon: <Video className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature2.title",
      descriptionKey: "features.feature2.description",
    },
    {
      id: "feature-3",
      icon: <Film className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature3.title",
      descriptionKey: "features.feature3.description",
    },
    {
      id: "feature-4",
      icon: <Zap className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature4.title",
      descriptionKey: "features.feature4.description",
    },
    {
      id: "feature-5",
      icon: <Server className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature5.title",
      descriptionKey: "features.feature5.description",
    },
    {
      id: "feature-6",
      icon: <Headphones className="w-7 h-7" strokeWidth={1.75} />,
      titleKey: "features.feature6.title",
      descriptionKey: "features.feature6.description",
    },
  ];

  const featureItems = features;

  return (
    <section
      id="features"
      className={`pt-12 pb-6 sm:pt-16 sm:pb-8 lg:pt-20 lg:pb-10 xl:pt-24 xl:pb-12 2xl:pt-28 2xl:pb-16 ${surface.sectionSoftBg || "bg-white"}`}
    >
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Heading - Simple h2 for accessibility */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-center mb-4 xl:mb-6 2xl:mb-8 text-dark-text font-heading">
          {t("features.sectionTitle") || t("common.features")}
        </h2>
        {t("features.sectionSubtitle") ? (
          <p className="text-center text-base sm:text-lg text-dark-text/70 max-w-3xl mx-auto mb-12 xl:mb-16 2xl:mb-20">
            {t("features.sectionSubtitle")}
          </p>
        ) : (
          <div className="mb-12 xl:mb-16 2xl:mb-20" />
        )}
        
        {/* Stat panel + feature list */}
        <div className="grid grid-cols-1 lg:grid-cols-[36%_64%] gap-6 lg:gap-10 xl:gap-14 items-stretch">
          {/* Stat panel */}
          <motion.div
            initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: mobile ? "-50px" : "-100px" }}
            transition={reduceAnimations ? {} : { duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-dark p-7 sm:p-9 flex flex-col justify-center gap-7 sm:gap-8"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

            {[
              { value: t("features.statChannelsValue"), label: t("features.statChannelsLabel") },
              { value: t("features.statMoviesValue"), label: t("features.statMoviesLabel") },
              { value: t("features.statSupportValue"), label: t("features.statSupportLabel") },
            ].map((stat) => (
              <div key={stat.label} className="relative z-10">
                <p className="text-3xl sm:text-4xl font-bold text-white font-heading leading-none mb-1.5">
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
                {/* Icon */}
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-accent-blue-light text-accent-blue shrink-0">
                  {feature.icon}
                </div>

                <div>
                  {/* Title */}
                  <h3 className="font-semibold mb-1.5 text-dark-text text-base sm:text-lg tracking-tight">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-dark-text/70 leading-relaxed text-sm">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Image */}
        <motion.div
          initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: mobile ? "-50px" : "-100px" }}
          transition={reduceAnimations ? {} : { duration: 0.3, delay: 0.2 }}
          className="mt-8 lg:mt-10 flex justify-center"
        >
          <div className="relative w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl h-auto">
            <Image
              src="/images/trust.png-1536x61.webp"
              alt={t("features.trustBadgesAlt")}
              width={1536}
              height={61}
              className="w-full h-auto object-contain"
              quality={imageQuality}
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

