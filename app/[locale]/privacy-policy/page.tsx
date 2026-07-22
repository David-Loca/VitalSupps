"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function PrivacyPolicyPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl font-bold text-accent-blue mb-6 sm:mb-8"
          >
            {t("legal.privacyPolicy.title")}
          </motion.h1>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8 space-y-4"
          >
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.intro")}
            </p>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.intro2")}
            </p>
          </motion.div>


          {/* Data Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.privacyPolicy.dataProtectionTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.dataProtectionText")}
            </p>
          </motion.div>


          {/* Data Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.privacyPolicy.dataUsageTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed mb-4">
              {t("legal.privacyPolicy.dataUsageText")}
            </p>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.dataUsageText2")}
            </p>
          </motion.div>


          {/* Data Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.privacyPolicy.dataCollectionTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed mb-4">
              {t("legal.privacyPolicy.dataCollectionText")}
            </p>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.dataCollectionText2")}
            </p>
          </motion.div>


          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.privacyPolicy.securityTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.securityText")}
            </p>
          </motion.div>


          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.privacyPolicy.conclusion")}
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
