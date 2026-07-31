"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, AlertTriangle, ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import BuyBox from "@/components/BuyBox";
import ProductReviews from "@/components/ProductReviews";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductContent, getDefaultVariant, type Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

/**
 * Product image gallery: a large main image panel + a thumbnail strip.
 * Shows whichever variant's images are currently selected in the buy box
 * (falls back to `product.images.primary` for products without variants).
 * Resets to the first image whenever the image set changes (i.e. the user
 * picks a different variant).
 *
 * Expected real-photo dimensions: square or 4:5, min 1200x1200px, consistent
 * crop/background across all products in a given gallery.
 */
function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  return (
    <div>
      <div className="relative h-90 sm:h-110 lg:h-125 w-full bg-white border border-brand-border rounded-brand-lg shadow-[var(--shadow-brand-card)] overflow-hidden mb-3">
        {images[activeIndex] ? (
          <Image
            src={images[activeIndex]}
            alt={alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 90vw"
            priority
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-brand-text/35">
            <ImageIcon className="w-10 h-10" strokeWidth={1.5} />
            <span className="text-xs font-medium">Product photo coming soon</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip — shown even with a single image so the gallery pattern is visible */}
      <div className="flex gap-2">
        {(images.length > 0 ? images : [""]).map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
            disabled={!hasMultiple}
            className={`relative w-16 h-16 rounded-[10px] bg-brand-hover border overflow-hidden flex items-center justify-center shrink-0 transition-colors ${
              activeIndex === index ? "border-brand-primary" : "border-brand-border"
            } ${hasMultiple ? "cursor-pointer" : "cursor-default"}`}
          >
            {src ? (
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            ) : (
              <ImageIcon className="w-5 h-5 text-brand-text/30" strokeWidth={1.5} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductPageClient({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const { t } = useLanguage();
  const content = getProductContent(product, locale);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const defaultVariant = getDefaultVariant(product);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariant?.id);
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ?? defaultVariant;
  const galleryImages =
    selectedVariant && selectedVariant.images.length > 0
      ? selectedVariant.images
      : [product.images.primary];
  const isTerracotta = product.slug === "gut-health";
  const accentDot = isTerracotta ? "bg-accent-terracotta" : "bg-brand-primary";
  const specs = product.specs;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-white">
      <Header />

      <main className="pt-32 sm:pt-36">
        {/* Breadcrumbs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-brand-text-secondary">
            <Link href={`/${locale}/`} className="hover:text-brand-primary transition-colors">
              {t("breadcrumbs.home")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/${locale}/#products`} className="hover:text-brand-primary transition-colors">
              {t("breadcrumbs.products")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-brand-text font-medium truncate">{content.name}</span>
          </nav>
        </div>

        {/* Gallery + Buy box */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <ProductGallery
              key={selectedVariant?.id ?? "default"}
              images={galleryImages}
              alt={content.heroImageAlt}
            />

            <div>
              <BuyBox
                product={product}
                productName={content.name}
                selectedVariant={selectedVariant}
                onVariantChange={(variant) => setSelectedVariantId(variant.id)}
              />

              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-text-secondary mb-2">
                  {t("products.targetAudience")}
                </h2>
                <p className="text-brand-text/80 text-sm sm:text-base">{content.targetAudience}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-brand-bg py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-brand-text mb-8">
              {t("products.benefits")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 bg-white rounded-brand-lg p-4 border border-brand-border"
                >
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${accentDot}`} />
                  <p className="text-[15px] leading-[1.75] text-brand-text-secondary">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage, Ingredients & Spec table */}
        <section className="py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-white">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-brand-text mb-5">
                {t("products.howToUse")}
              </h2>
              <p className="text-[15px] leading-[1.75] text-brand-text-secondary mb-6">{content.usage}</p>

              {content.safety && (
                <div className="flex items-start gap-3 bg-brand-warning-bg border border-brand-warning/25 rounded-brand-md p-4">
                  <AlertTriangle className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
                  <p className="text-sm text-brand-text/80 leading-relaxed">{content.safety}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-brand-text mb-5">
                {t("products.ingredients")}
              </h2>
              <ul className="space-y-2.5 mb-8">
                {content.ingredients.map((ingredient) => (
                  <li key={ingredient} className="text-[15px] leading-[1.75] text-brand-text-secondary pl-4 relative">
                    <span className={`absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full ${accentDot}`} />
                    {ingredient}
                  </li>
                ))}
              </ul>

              {/* Spec table — marketplace-style trust signal */}
              {specs && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-text-secondary mb-3">
                    {t("specs.title")}
                  </h3>
                  <table className="w-full text-sm border border-brand-border rounded-brand-md overflow-hidden">
                    <tbody>
                      <tr className="border-b border-brand-border">
                        <th scope="row" className="text-left font-medium text-brand-text-secondary bg-brand-bg px-4 py-2.5 w-1/2">
                          {t("specs.servingSize")}
                        </th>
                        <td className="px-4 py-2.5 text-brand-text/85">{specs.servingSize}</td>
                      </tr>
                      <tr className="border-b border-brand-border">
                        <th scope="row" className="text-left font-medium text-brand-text-secondary bg-brand-bg px-4 py-2.5">
                          {t("specs.servingsPerContainer")}
                        </th>
                        <td className="px-4 py-2.5 text-brand-text/85">{specs.servingsPerContainer}</td>
                      </tr>
                      <tr className="border-b border-brand-border">
                        <th scope="row" className="text-left font-medium text-brand-text-secondary bg-brand-bg px-4 py-2.5">
                          {t("specs.form")}
                        </th>
                        <td className="px-4 py-2.5 text-brand-text/85">{specs.form}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-left font-medium text-brand-text-secondary bg-brand-bg px-4 py-2.5">
                          {t("specs.allergens")}
                        </th>
                        <td className="px-4 py-2.5 text-brand-text/85">{specs.allergens}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        <ProductReviews product={product} />

        {/* Product FAQ */}
        <section className="py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-brand-text mb-8 text-center">
              {t("faq.title")}
            </h2>
            <div className="space-y-3">
              {content.faq.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={item.question}
                    className={`bg-white rounded-brand-lg border transition-all duration-300 overflow-hidden ${
                      isOpen ? "border-brand-primary shadow-[var(--shadow-brand-card)]" : "border-brand-border"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <h3 className="text-sm sm:text-base font-semibold pr-2 flex-1 text-brand-text">
                        {item.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          isOpen ? "bg-brand-primary text-white" : "bg-brand-hover text-brand-text"
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
                          <div className="px-5 sm:px-6 pb-5 border-l-2 border-brand-gold/40 ml-5 sm:ml-6 pl-4">
                            <p className="text-[15px] leading-[1.75] text-brand-text-secondary">
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
