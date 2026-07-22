"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical, BadgeCheck, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrustSection() {
  const { t } = useLanguage();

  const badges = [
    { icon: RotateCcw, titleKey: "trust.guarantee.title", descKey: "trust.guarantee.description" },
    { icon: FlaskConical, titleKey: "trust.labTested.title", descKey: "trust.labTested.description" },
    { icon: BadgeCheck, titleKey: "trust.gmp.title", descKey: "trust.gmp.description" },
    { icon: ShieldCheck, titleKey: "trust.madeInUsa.title", descKey: "trust.madeInUsa.description" },
  ];

  return (
    <section className="py-10 sm:py-12 bg-dark-text border-y border-accent-secondary/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-0">
          <h2 className="font-display text-lg sm:text-xl text-white shrink-0 lg:w-56 lg:pr-8">
            {t("trust.sectionTitle")}
          </h2>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 lg:border-l lg:border-white/10 lg:pl-8">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.titleKey}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="flex items-start gap-3"
              >
                <badge.icon className="w-5 h-5 text-accent-secondary shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">
                    {t(badge.titleKey)}
                  </h3>
                  <p className="text-white/55 text-xs leading-relaxed">{t(badge.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
