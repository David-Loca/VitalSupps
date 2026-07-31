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
              <div className="relative bg-gradient-to-br from-[#16241c] to-[#0c150f] rounded-2xl p-8 sm:p-12 lg:p-16 shadow-2xl border-4 border-brand-gold/20">
                {/* Screen Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/15 via-transparent to-transparent rounded-xl blur-xl"></div>

                {/* Screen Content */}
                <div className="relative bg-gradient-to-br from-brand-text to-brand-primary-dark rounded-lg p-8 sm:p-12 lg:p-16 border-2 border-brand-gold/25">
                  {/* Signal Lines Animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <motion.div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 2px,
                          rgba(216, 167, 60, 0.3) 2px,
                          rgba(216, 167, 60, 0.3) 4px
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
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-semibold text-white mb-4 tracking-tight">
                      404
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-brand-gold">
                      <WifiOff className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                      <span className="text-sm sm:text-base lg:text-lg font-semibold">
                        {t("notFound.signalLost")}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* TV Stand */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-[#16241c] to-[#0c150f] rounded-b-lg"></div>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-brand-text mb-4">
              {t("notFound.title")}
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-brand-text-secondary max-w-2xl mx-auto">
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
              className="group inline-flex items-center gap-2 h-[52px] px-7 rounded-[14px] bg-brand-primary text-white text-[15px] font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-primary-dark active:scale-[0.98]"
            >
              <Home className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>{t("notFound.backHome")}</span>
            </Link>

            {/* Blog Button */}
            <Link
              href={`/${locale}/blog/`}
              className="group inline-flex items-center gap-2 h-[52px] px-7 rounded-[14px] border border-brand-border bg-white text-brand-text text-[15px] font-medium transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-hover active:scale-[0.98]"
            >
              <Monitor className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>{t("common.blog")}</span>
            </Link>

            {/* Contact Button */}
            <button
              onClick={() => openWhatsApp(t("whatsapp.notFoundHelp"))}
              className="group inline-flex items-center gap-2 h-[52px] px-7 bg-[#25D366] text-white font-medium rounded-[14px] shadow-sm hover:bg-[#20ba5a] hover:-translate-y-0.5 transition-all duration-150 text-[15px] cursor-pointer active:scale-[0.98]"
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
            className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-brand-border"
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
                  className="px-4 py-2 rounded-full text-sm font-medium text-brand-text-secondary bg-brand-hover hover:bg-brand-success-bg hover:text-brand-primary transition-colors duration-200"
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
