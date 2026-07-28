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
const BundleOffer = lazy(() => import("@/components/BundleOffer"));
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
      const headerHeight = 112;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div id="home" className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-white">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center pt-28 pb-16 lg:pt-32 lg:min-h-[88vh] bg-off-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-5">
                <span className="text-[10px] sm:text-[11px] font-medium tracking-[3px] uppercase text-accent-secondary">
                  {t("hero.eyebrow")}
                </span>
                <span className="inline-flex items-center bg-sale text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-[2px]">
                  {t("hero.ribbon")}
                </span>
              </div>
              <h1 className="font-serif text-[clamp(42px,5.5vw,72px)] leading-[1.1] font-light text-dark-text mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-[15px] leading-[1.75] text-muted-text max-w-xl mx-auto lg:mx-0 mb-6">
                {t("hero.subtitle")}
              </p>
              <p className="font-serif italic font-light text-xl text-accent-blue mb-9">{t("hero.priceFrom")}</p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
                <a
                  href="#products"
                  onClick={scrollToProducts}
                  className="btn btn-dark inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("hero.ctaSecondary")}
                </a>
              </div>

              {/* Trust row - plain text + thin icon, no colored circles */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-muted-text pt-6 border-t border-subtle-gray">
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

            {/* Hero visual - large staged product photography */}
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative w-full aspect-[3/4] rounded-[4px] overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-dark-text text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-[2px] shadow-sm">
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

      {/* Final CTA banner - full-bleed black band */}
      <section id="cta" className="bg-dark-text py-24 lg:py-[100px] px-10 text-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-light text-[clamp(28px,4vw,48px)] text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-white/70 text-[15px] leading-[1.75] mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold inline-flex items-center justify-center gap-2"
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
