"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllProducts, getProductContent, formatPrice, getBundlePrice } from "@/lib/products";
import { getBundleWhatsAppUrl } from "@/lib/whatsapp";
import DecorativeCardBackground from "@/components/admin/ui/DecorativeCardBackground";

const BUNDLE_DISCOUNT_PERCENT = 15;

/** "Buy Both & Save" upsell block — both SKUs at a combined discounted price. */
export default function BundleOffer() {
  const { t, locale } = useLanguage();
  const products = getAllProducts();
  if (products.length < 2) return null;

  const [productA, productB] = products;
  const contentA = getProductContent(productA, locale);
  const contentB = getProductContent(productB, locale);
  const individualTotal = productA.price + productB.price;
  const bundlePrice = getBundlePrice(products, BUNDLE_DISCOUNT_PERCENT);
  const savings = individualTotal - bundlePrice;
  const whatsappUrl = getBundleWhatsAppUrl(t("whatsapp.bundleTemplate"), [contentA.name, contentB.name]);

  return (
    <section className="py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-brand-bg">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative isolate overflow-hidden bg-white border border-brand-border rounded-brand-lg shadow-[var(--shadow-brand-card)]"
        >
          <DecorativeCardBackground opacity={0.13} />
          <div className="relative z-10 p-6 sm:p-10">
            <span className="block text-[10px] sm:text-[11px] font-semibold tracking-[3px] uppercase text-brand-gold mb-2">
              {t("bundle.eyebrow")}
            </span>
            <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-brand-text mb-3">
              {t("bundle.title")}
            </h2>
            <p className="text-[15px] leading-[1.75] text-brand-text-secondary max-w-xl mb-8">{t("bundle.subtitle")}</p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-28 sm:w-24 sm:h-32 border border-brand-border rounded-[12px] overflow-hidden bg-brand-hover">
                  <Image
                    src={productA.images.primary}
                    alt={contentA.heroImageAlt}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
                <Plus className="w-5 h-5 text-brand-text-secondary shrink-0" />
                <div className="relative w-20 h-28 sm:w-24 sm:h-32 border border-brand-border rounded-[12px] overflow-hidden bg-brand-hover">
                  <Image
                    src={productB.images.primary}
                    alt={contentB.heroImageAlt}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              </div>

              <div className="flex-1 sm:pl-4">
                <p className="text-sm text-brand-text-secondary mb-0.5">{t("bundle.individualPrice")}</p>
                <p className="text-base text-brand-text/40 line-through mb-1.5">
                  {formatPrice(individualTotal, locale)}
                </p>
                <p className="text-sm text-brand-text-secondary mb-0.5">{t("bundle.bundlePrice")}</p>
                <p className="font-semibold text-3xl text-brand-text mb-1.5">
                  {formatPrice(bundlePrice, locale)}
                </p>
                <span className="inline-block bg-sale-light text-sale-dark text-xs font-bold tracking-wide px-2.5 py-1 rounded-full">
                  {t("bundle.youSave").replace("{amount}", formatPrice(savings, locale))}
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-[52px] px-7 rounded-[14px] bg-brand-gold text-white text-[15px] font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:brightness-95 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              {t("bundle.cta")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
