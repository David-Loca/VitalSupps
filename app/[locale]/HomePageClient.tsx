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

// Lazy load non-critical components
const ProductShowcase = lazy(() => import("@/components/ProductShowcase"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const TrustSection = lazy(() => import("@/components/TrustSection"));
const IngredientsSection = lazy(() => import("@/components/IngredientsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

const ComponentLoader = () => (
  <div className="w-full h-64 bg-gray-50 animate-pulse rounded-lg" />
);

type HomePageClientProps = {
  latestBlogs?: BlogPost[];
};

export default function Home({ latestBlogs: _latestBlogs = [] }: HomePageClientProps) {
  const { t, locale } = useLanguage();
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const whatsappUrl = getWhatsAppUrl(t("whatsapp.contactQuestion"));

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
      const headerHeight = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div id="home" className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 bg-off-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12 lg:gap-16 items-center">
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-accent-secondary mb-5">
                {t("hero.eyebrow")}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-dark-text leading-[1.05] mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-base sm:text-lg text-dark-text/70 max-w-xl mx-auto lg:mx-0 mb-9">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
                <a
                  href="#products"
                  onClick={scrollToProducts}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-accent-blue text-white font-semibold text-sm sm:text-base hover:bg-accent-blue-dark transition-colors w-full sm:w-auto"
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md border border-dark-text/20 text-dark-text font-semibold text-sm sm:text-base hover:border-accent-blue hover:text-accent-blue transition-colors w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("hero.ctaSecondary")}
                </a>
              </div>

              {/* Trust row - plain text + thin icon, no colored circles */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-dark-text/60 pt-6 border-t border-subtle-gray">
                <span className="inline-flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-accent-secondary" strokeWidth={1.5} /> {t("hero.badgeLabTested")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent-secondary" strokeWidth={1.5} /> {t("hero.badgeMadeInUsa")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-accent-secondary" strokeWidth={1.5} /> {t("hero.badgeNonGmo")}
                </span>
              </div>
            </motion.div>

            {/* Hero visual - line-art bottle illustration on a paper-tone panel */}
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm aspect-4/5 rounded-lg bg-light-gray border border-subtle-gray flex items-center justify-center p-10">
                <div className="relative w-40 sm:w-48 h-full">
                  <Image
                    src="/images/products/methylene-blue.svg"
                    alt="Line illustration of the VitalSupps Methylene Blue amber dropper bottle"
                    fill
                    className="object-contain"
                    sizes="240px"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Suspense fallback={<ComponentLoader />}>
        <ProductShowcase />
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

      {/* Final CTA banner */}
      <section id="cta" className="py-16 sm:py-20 bg-accent-blue-dark border-t border-b border-accent-secondary/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-white/75 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-white text-accent-blue-dark font-semibold text-sm sm:text-base hover:bg-off-white transition-colors"
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
