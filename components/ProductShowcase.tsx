"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllProducts, getProductContent, formatPrice } from "@/lib/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";

export default function ProductShowcase() {
  const { t, locale } = useLanguage();
  const products = getAllProducts();

  return (
    <section id="products" className="py-16 sm:py-20 lg:py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-left mb-12 lg:mb-16 max-w-2xl"
        >
          <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-accent-secondary mb-3">
            {t("common.products")}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-dark-text mb-4">
            {t("products.sectionTitle")}
          </h2>
          <p className="text-base sm:text-lg text-dark-text/70">
            {t("products.sectionSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {products.map((product, index) => {
            const content = getProductContent(product, locale);
            const whatsappUrl = getProductWhatsAppUrl(content.name);
            const isTerracotta = product.slug === "gut-health";
            const accentText = isTerracotta ? "text-accent-terracotta" : "text-accent-blue";
            const accentBorder = isTerracotta ? "hover:border-accent-terracotta/40" : "hover:border-accent-blue/40";
            const accentDot = isTerracotta ? "bg-accent-terracotta" : "bg-accent-blue";
            const accentBtn = isTerracotta
              ? "bg-accent-terracotta hover:bg-accent-terracotta-dark"
              : "bg-accent-blue hover:bg-accent-blue-dark";

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-white rounded-lg border border-subtle-gray overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col ${accentBorder}`}
              >
                <div className="relative aspect-[4/3] bg-light-gray flex items-center justify-center p-6">
                  <div className="relative w-36 h-52">
                    <Image
                      src={product.images.primary}
                      alt={content.heroImageAlt}
                      fill
                      className="object-contain"
                      sizes="200px"
                    />
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <h3 className="text-xl sm:text-2xl font-display text-dark-text mb-1.5">
                    {content.name}
                  </h3>
                  <p className="text-dark-text/70 text-sm sm:text-base mb-4">{content.tagline}</p>

                  <ul className="space-y-2 mb-5 flex-1">
                    {content.benefits.slice(0, 3).map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-dark-text/80">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${accentDot}`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-2xl font-display ${accentText}`}>
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/${locale}/products/${product.slug}/`}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-semibold text-sm transition-colors ${accentBtn}`}
                    >
                      {t("products.shopNow")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-subtle-gray text-dark-text font-semibold text-sm hover:border-dark-text/40 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("products.askOnWhatsapp")}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
