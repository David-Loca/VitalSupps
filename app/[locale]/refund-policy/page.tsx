"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function RefundPolicyPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-40 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl font-bold text-brand-primary mb-6 sm:mb-8"
          >
            {t("legal.refundPolicy.title")}
          </motion.h1>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 bg-white rounded-brand-lg border border-brand-border shadow-[var(--shadow-brand-card)] p-6 sm:p-8 space-y-4"
          >
            <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed">
              {t("legal.refundPolicy.intro")}
            </p>
            <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed">
              {t("legal.refundPolicy.intro2")}
            </p>
          </motion.div>
          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 bg-white rounded-brand-lg border border-brand-border shadow-[var(--shadow-brand-card)] p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-brand-text mb-4">
              {t("legal.refundPolicy.howItWorksTitle")}
            </h2>
            <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed">
              {t("legal.refundPolicy.howItWorksText")}
            </p>
          </motion.div>
          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 bg-white rounded-brand-lg border border-brand-border shadow-[var(--shadow-brand-card)] p-6 sm:p-8"
          >
            <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed">
              {t("legal.refundPolicy.conclusion")}
            </p>
            <p className="text-base sm:text-lg text-brand-primary font-medium mt-4">
              <Link href={`/${locale}#contact`} className="hover:underline">
                {t("common.contactUs")}
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingWhatsAppButton />
      </Suspense>
    </div>
  );
}
