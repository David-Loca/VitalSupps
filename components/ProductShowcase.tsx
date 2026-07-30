"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getAllProducts,
  getProductContent,
  formatPrice,
  getSavingsPercent,
  getDefaultVariant,
  getLowestVariantPrice,
} from "@/lib/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import StarRating from "./StarRating";

export default function ProductShowcase() {
  const { t, locale } = useLanguage();
  const products = getAllProducts();

  return (
    <section id="products" className="py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-left mb-12 lg:mb-16 max-w-2xl"
        >
          <span className="block text-[10px] sm:text-[11px] font-medium tracking-[3px] uppercase text-accent-secondary mb-3">
            {t("common.products")}
          </span>
          <h2 className="font-serif font-light text-[clamp(28px,4vw,48px)] text-dark-text mb-4">
            {t("products.sectionTitle")}
          </h2>
          <p className="text-[15px] leading-[1.75] text-muted-text">
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
            const hasVariants = !!product.variants && product.variants.length > 0;
            const lowestPrice = getLowestVariantPrice(product);
            const defaultVariant = getDefaultVariant(product);
            const cardImage = defaultVariant?.images[0] ?? product.images.primary;
            const savingsPercent = hasVariants
              ? getSavingsPercent({ price: lowestPrice, compareAtPrice: product.variants!.find((v) => v.price === lowestPrice)?.compareAtPrice })
              : getSavingsPercent(product);

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative bg-white rounded-[4px] border border-subtle-gray overflow-hidden shadow-none hover:shadow-md transition-all duration-300 flex flex-col ${accentBorder}`}
              >
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 bg-sale text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-[2px] shadow-sm">
                    {t(`products.badge.${product.badge}`)}
                  </span>
                )}

                <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 bg-white">
                  <Image
                    src={cardImage}
                    alt={content.heroImageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 45vw, 90vw"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <h3 className="font-serif font-light text-xl sm:text-2xl text-dark-text mb-1.5">
                    {content.name}
                  </h3>
                  <p className="text-muted-text text-[15px] leading-[1.75] mb-3">{content.tagline}</p>

                  {typeof product.rating === "number" && (
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mb-4" />
                  )}

                  <ul className="space-y-2 mb-5 flex-1">
                    {content.benefits.slice(0, 3).map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-[15px] leading-[1.75] text-muted-text">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${accentDot}`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                    {hasVariants ? (
                      <span className={`font-serif font-light text-2xl ${accentText}`}>
                        {t("products.fromPrice").replace("{price}", formatPrice(lowestPrice))}
                      </span>
                    ) : (
                      <>
                        <span className={`font-serif font-light text-2xl ${accentText}`}>
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-base text-dark-text/40 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </>
                    )}
                    {savingsPercent && (
                      <span className="bg-sale-light text-sale-dark text-xs font-bold tracking-wide px-2 py-0.5 rounded-[2px]">
                        {t("buyBox.save").replace("{percent}", String(savingsPercent))}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/${locale}/products/${product.slug}/`}
                      className="btn btn-dark flex-1 inline-flex items-center justify-center gap-2"
                    >
                      {t("products.shopNow")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 inline-flex items-center justify-center gap-2"
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
