"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck, Leaf, FlaskConical } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { shouldReduceAnimations, isMobile } from "@/lib/utils/performance";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { BotanicalCorner, BotanicalCornerSmall, GoldCurve } from "@/components/admin/ui/Decorative";
import { getAllProducts, getLowestVariantPrice, formatPrice } from "@/lib/products";

// Lazy load non-critical components
const ProductShowcase = lazy(() => import("@/components/ProductShowcase"));
const BundleOffer = lazy(() => import("@/components/BundleOffer"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const TrustSection = lazy(() => import("@/components/TrustSection"));
const IngredientsSection = lazy(() => import("@/components/IngredientsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => (
  <div className="w-full h-64 bg-brand-hover animate-pulse rounded-brand-lg" />
);

type HomePageClientProps = {
  latestBlogs?: BlogPost[];
};

export default function Home({ latestBlogs: _latestBlogs = [] }: HomePageClientProps) {
  const { t, locale } = useLanguage();
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const whatsappUrl = getWhatsAppUrl(t("whatsapp.contactQuestion"));
  const lowestSitewidePrice = Math.min(
    ...getAllProducts().map((product) => getLowestVariantPrice(product))
  );

  useEffect(() => {
    const mobile = isMobile();
    setReduceAnimations(shouldReduceAnimations());

    const hash = window.location.hash;
    if (!hash) {
      window.scrollTo(0, 0);
    }

    void mobile;
  }, []);

  const scrollToProducts = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.querySelector("#products");
    if (el) {
      const headerHeight = 112;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div id="home" className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-brand-bg">
      <Header />

      {/* Hero */}
      <section className="relative isolate flex items-center pt-28 pb-16 lg:pt-32 lg:min-h-[88vh] bg-brand-bg overflow-hidden">
        {/* Decorative botanical + gold artwork — same language as the admin panel */}
        <BotanicalCorner className="pointer-events-none absolute -right-8 -top-10 z-0 h-[320px] w-[380px] text-brand-sage opacity-[0.12] sm:h-[420px] sm:w-[480px]" />
        <GoldCurve className="pointer-events-none absolute -right-14 -top-16 z-0 h-[280px] w-[420px] text-brand-champagne opacity-[0.09] sm:h-[360px] sm:w-[540px]" />
        <BotanicalCornerSmall className="pointer-events-none absolute -bottom-10 -left-10 z-0 h-52 w-52 rotate-180 text-brand-sage opacity-[0.08]" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-5">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[3px] uppercase text-brand-gold">
                  {t("hero.eyebrow")}
                </span>
                <span className="inline-flex items-center bg-brand-gold text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full whitespace-nowrap">
                  {t("hero.ribbon")}
                </span>
              </div>
              <h1 className="text-[clamp(40px,5.5vw,68px)] leading-[1.08] font-semibold tracking-tight text-brand-text mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-[16px] leading-[1.75] text-brand-text-secondary max-w-xl mx-auto lg:mx-0 mb-6">
                {t("hero.subtitle")}
              </p>
              <p className="font-medium text-xl text-brand-primary mb-9">
                {t("hero.priceFrom").replace("{price}", formatPrice(lowestSitewidePrice, locale))}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
                <a
                  href="#products"
                  onClick={scrollToProducts}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-[52px] px-7 rounded-[14px] bg-brand-primary text-white text-[15px] font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-primary-dark active:scale-[0.98]"
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-[52px] px-7 rounded-[14px] border border-brand-border bg-white text-brand-text text-[15px] font-medium transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-hover active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("hero.ctaSecondary")}
                </a>
              </div>

              {/* Trust row - plain text + thin icon, no colored circles */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-brand-text-secondary pt-6 border-t border-brand-border">
                <span className="inline-flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-brand-gold" strokeWidth={1.5} /> {t("hero.badgeLabTested")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold" strokeWidth={1.5} /> {t("hero.badgeMadeInUsa")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-brand-gold" strokeWidth={1.5} /> {t("hero.badgeNonGmo")}
                </span>
              </div>
            </motion.div>

            {/* Hero visual - large staged product photography */}
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative w-full h-72 sm:h-96 md:h-105 lg:h-120 rounded-brand-lg overflow-hidden shadow-[var(--shadow-brand-card)] border border-brand-border">
                <span className="absolute top-4 left-4 z-10 bg-brand-gold text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {t("hero.ribbon")}
                </span>
                <Image
                  src="/images/products/methylene-blue-hero.svg"
                  alt="VitalSupps Methylene Blue amber dropper bottle"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 90vw"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Suspense fallback={<ComponentLoader />}>
        <ProductShowcase />
      </Suspense>

      <Suspense fallback={<ComponentLoader />}>
        <BundleOffer />
      </Suspense>

      <Suspense fallback={<ComponentLoader />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<ComponentLoader />}>
        <TrustSection />
      </Suspense>

      <Suspense fallback={<ComponentLoader />}>
        <IngredientsSection />
      </Suspense>

      <Suspense fallback={<ComponentLoader />}>
        <FAQSection />
      </Suspense>

      {/* Final CTA banner - full-bleed deep-green band, bookending the footer */}
      <section id="cta" className="relative isolate overflow-hidden bg-brand-primary-dark py-14 sm:py-20 lg:py-[100px] px-10 text-center">
        <BotanicalCorner className="pointer-events-none absolute -right-10 -top-14 z-0 h-[320px] w-[380px] text-white opacity-[0.06]" />
        <GoldCurve className="pointer-events-none absolute -left-16 -bottom-16 z-0 h-[260px] w-[400px] rotate-180 text-brand-gold opacity-[0.08]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-white/70 text-[15px] leading-[1.75] mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-[14px] bg-brand-gold text-white text-[15px] font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:brightness-95 active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            {t("cta.button")}
          </a>
        </div>
      </section>

      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingWhatsAppButton />
      </Suspense>
    </div>
  );
}
