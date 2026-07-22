"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MessageCircle, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductContent, formatPrice, type Product } from "@/lib/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";

export default function ProductPageClient({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const { t } = useLanguage();
  const content = getProductContent(product, locale);
  const whatsappUrl = getProductWhatsAppUrl(content.name);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const isTerracotta = product.slug === "gut-health";
  const accentText = isTerracotta ? "text-accent-terracotta" : "text-accent-blue";
  const accentBtn = isTerracotta
    ? "bg-accent-terracotta hover:bg-accent-terracotta-dark"
    : "bg-accent-blue hover:bg-accent-blue-dark";
  const accentDot = isTerracotta ? "bg-accent-terracotta" : "bg-accent-blue";

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-white">
      <Header />

      <main className="pt-24 sm:pt-28">
        {/* Back nav */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Link
            href={`/${locale}/`}
            className="inline-flex items-center gap-2 text-sm font-medium text-dark-text/60 hover:text-accent-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("products.backToHome")}
          </Link>
        </div>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-square bg-light-gray border border-subtle-gray rounded-lg flex items-center justify-center p-10">
              <div className="relative w-44 h-64">
                <Image
                  src={product.images.primary}
                  alt={content.heroImageAlt}
                  fill
                  className="object-contain"
                  sizes="300px"
                  priority
                />
              </div>
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark-text mb-3">
                {content.name}
              </h1>
              <p className="text-lg text-dark-text/70 mb-5">{content.tagline}</p>
              <p className={`font-display text-3xl mb-6 ${accentText}`}>
                {formatPrice(product.price)}
              </p>

              <div className="mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-dark-text/50 mb-2">
                  {t("products.targetAudience")}
                </h2>
                <p className="text-dark-text/80">{content.targetAudience}</p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm sm:text-base transition-colors w-full sm:w-auto ${accentBtn}`}
              >
                <MessageCircle className="w-4 h-4" />
                {t("products.buyOnWhatsapp")}
              </a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-off-white py-14 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl text-dark-text mb-8">
              {t("products.benefits")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 bg-white rounded-md p-4 border border-subtle-gray"
                >
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${accentDot}`} />
                  <p className="text-dark-text/80 text-sm sm:text-base">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage & Ingredients */}
        <section className="py-14 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-dark-text mb-5">
                {t("products.howToUse")}
              </h2>
              <p className="text-dark-text/80 leading-relaxed mb-6">{content.usage}</p>

              {content.safety && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <p className="text-sm text-dark-text/80 leading-relaxed">{content.safety}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-dark-text mb-5">
                {t("products.ingredients")}
              </h2>
              <ul className="space-y-2.5">
                {content.ingredients.map((ingredient) => (
                  <li key={ingredient} className="text-dark-text/80 text-sm sm:text-base leading-relaxed pl-4 relative">
                    <span className={`absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full ${accentDot}`} />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Product FAQ */}
        <section className="bg-off-white py-14 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl text-dark-text mb-8 text-center">
              {t("faq.title")}
            </h2>
            <div className="space-y-3">
              {content.faq.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={item.question}
                    className={`bg-white rounded-md border transition-all duration-300 overflow-hidden ${
                      isOpen ? "border-accent-blue" : "border-subtle-gray"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-sm sm:text-base font-semibold pr-2 flex-1 text-dark-text">
                        {item.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          isOpen ? "bg-accent-blue text-white" : "bg-off-white text-accent-blue"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-5 border-l-4 border-accent-blue-light ml-5 sm:ml-6 pl-4">
                            <p className="text-dark-text/70 leading-relaxed text-sm sm:text-base">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
