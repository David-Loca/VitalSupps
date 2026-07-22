"use client";

import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg" />;

export default function TermsOfServicePage() {
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
            {t("legal.termsOfService.title")}
          </motion.h1>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.intro")}
            </p>
          </motion.div>
          {/* Definitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.definitionsTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.definitionsText")}
            </p>
          </motion.div>
          {/* Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.cookiesTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.cookiesText")}
            </p>
          </motion.div>
          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.intellectualPropertyTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed mb-4">
              {t("legal.termsOfService.intellectualPropertyText")}
            </p>
            <p className="text-base sm:text-lg font-semibold text-dark-text mb-2">
              {t("legal.termsOfService.intellectualPropertyRestrictions")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-dark-text/70 leading-relaxed ml-4">
              <li>{t("legal.termsOfService.restriction1")}</li>
              <li>{t("legal.termsOfService.restriction2")}</li>
            </ul>
          </motion.div>
          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.commentsTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed mb-4">
              {t("legal.termsOfService.commentsText")}
            </p>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.commentsText2")}
            </p>
          </motion.div>
          {/* Hyperlinks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.hyperlinksTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed mb-4">
              {t("legal.termsOfService.hyperlinksText")}
            </p>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.hyperlinksText2")}
            </p>
          </motion.div>
          {/* iFrames */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.iframesTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.iframesText")}
            </p>
          </motion.div>
          {/* Content Responsibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.contentResponsibilityTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.contentResponsibilityText")}
            </p>
          </motion.div>
          {/* Privacy and Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.privacyDataTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.privacyDataText")}{" "}
              <Link href={`/${locale}/privacy-policy`} className="text-accent-blue hover:underline">
                {t("common.privacyPolicy")}
              </Link>
              .
            </p>
          </motion.div>
          {/* Modifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.modificationsTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.modificationsText")}
            </p>
          </motion.div>
          {/* Link Removal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.linkRemovalTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.linkRemovalText")}
            </p>
          </motion.div>
          {/* Limitation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="mb-6 bg-white rounded-2xl border border-subtle-gray shadow-sm p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text mb-4">
              {t("legal.termsOfService.limitationTitle")}
            </h2>
            <p className="text-base sm:text-lg text-dark-text/70 leading-relaxed">
              {t("legal.termsOfService.limitationText")}
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
