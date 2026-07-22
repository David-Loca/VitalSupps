"use client";

import { motion } from "framer-motion";
import { Home, Monitor, ArrowLeft, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { openWhatsApp } from "@/lib/whatsapp";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFoundContent() {
  const { t, locale } = useLanguage();

  return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated 404 with TV/Streaming Theme */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8 sm:mb-12"
          >
            {/* TV Screen with 404 */}
            <div className="relative inline-block">
              {/* TV Frame */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 sm:p-12 lg:p-16 shadow-2xl border-4 border-accent-blue/20">
                {/* Screen Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-transparent to-transparent rounded-xl blur-xl"></div>

                {/* Screen Content */}
                <div className="relative bg-gradient-to-br from-dark-text to-accent-blue-dark rounded-lg p-8 sm:p-12 lg:p-16 border-2 border-accent-blue/30">
                  {/* Signal Lines Animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <motion.div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 2px,
                          rgba(37, 99, 235, 0.3) 2px,
                          rgba(37, 99, 235, 0.3) 4px
                        )`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>

                  {/* 404 Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative z-10"
                  >
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-4 font-heading tracking-tight">
                      404
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-accent-blue">
                      <WifiOff className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                      <span className="text-sm sm:text-base lg:text-lg font-semibold">
                        {t("notFound.signalLost")}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* TV Stand */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-b-lg"></div>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-dark-text mb-4 font-heading">
              {t("notFound.title")}
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-dark-text/70 max-w-2xl mx-auto">
              {t("notFound.description")}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            {/* Home Button */}
            <Link
              href={`/${locale}/`}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent-blue text-white font-semibold rounded-lg shadow-lg hover:bg-accent-blue-dark hover:shadow-xl hover:ring-2 hover:ring-accent-blue/30 transition-all duration-200 text-sm sm:text-base lg:text-lg"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>{t("notFound.backHome")}</span>
            </Link>

            {/* Blog Button */}
            <Link
              href={`/${locale}/blog/`}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-accent-blue text-accent-blue font-semibold rounded-lg shadow-md hover:bg-accent-blue hover:text-white hover:shadow-xl transition-all duration-200 text-sm sm:text-base lg:text-lg"
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />
              <span>{t("common.blog")}</span>
            </Link>

            {/* Contact Button */}
            <button
              onClick={() => openWhatsApp(t("whatsapp.notFoundHelp"))}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#25D366] text-white font-semibold rounded-lg shadow-md hover:bg-[#20ba5a] hover:shadow-xl transition-all duration-200 text-sm sm:text-base lg:text-lg"
            >
              <Wifi className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:rotate-12" />
              <span>{t("common.contactUs")}</span>
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-subtle-gray"
          >
            <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={t("notFound.quickLinksAriaLabel")}>
              {[
                { href: `/${locale}/`, label: t("common.home") },
                { href: `/${locale}/blog/`, label: t("common.blog") },
                { href: `/${locale}/#cta`, label: t("common.contactUs") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm font-medium text-dark-text/75 bg-off-white hover:bg-accent-blue-light hover:text-accent-blue-dark transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </div>
        </main>

        <Footer />
      </div>
  );
}
