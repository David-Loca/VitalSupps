"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { isRegionalEnglishLocale } from "@/lib/i18n/regional-locales";
import { useLanguage } from "@/contexts/LanguageContext";
import { shouldReduceAnimations, isMobile } from "@/lib/utils/performance";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { getLocaleSurface } from "@/lib/i18n/locale-surface";

// Lazy load non-critical components - use dynamic imports with ssr: false for better performance
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));

// Loading placeholder component
const ComponentLoader = () => (
  <div className="w-full h-64 bg-gray-50 animate-pulse rounded-lg" />
);

type HomePageClientProps = {
  latestBlogs?: BlogPost[];
};

export default function Home({ latestBlogs = [] }: HomePageClientProps) {
  const { t, locale } = useLanguage();
  const isRegionalHome = isRegionalEnglishLocale(locale);
  const surface = getLocaleSurface(locale);
  const [reduceAnimations, setReduceAnimations] = useState(false);

  // Detect mobile and defer non-critical resources
  useEffect(() => {
    const mobile = isMobile();
    setReduceAnimations(shouldReduceAnimations());

    // Note: ScrollToTop component handles hash navigation on route changes
    // This only handles initial page load without hash (scroll to top)
    const hash = window.location.hash;
    if (!hash) {
      window.scrollTo(0, 0);
    }

    void mobile;
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-white">
      <Header />

      {/* Placeholder hero section - replace with real content */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-text mb-4">
            Welcome
          </h1>
          <p className="text-base sm:text-lg text-dark-text/70 max-w-2xl mx-auto">
            This is the homepage — replace this placeholder with real content.
          </p>
        </div>
      </section>

      <Suspense fallback={<ComponentLoader />}>
        <FeaturesSection />
      </Suspense>

      <div className="flex flex-col">
        {/* Latest from blog - drive traffic to blog and main pages */}
        <section
          id="latest-blog"
          className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50/50 ${isRegionalHome ? "order-2" : ""}`}
        >
          <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-text mb-3">
                {t("home.latestFromBlog")}
              </h2>
              <p className="text-base sm:text-lg text-dark-text/70 max-w-xl mx-auto">
                {t("home.latestFromBlogSubtitle")}
              </p>
            </motion.div>
            {latestBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {latestBlogs.map((blog, index) => {
                  const displayTitle = (blog.title[locale] || "").trim() || "Untitled";
                  const displayExcerpt = (blog.excerpt[locale] || "").trim();
                  return (
                    <motion.div
                      key={blog.id}
                      initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 20 }}
                      whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={getBlogUrl(blog, locale)}
                        className={`group block h-full bg-white p-5 sm:p-6 hover:border-accent-blue/30 hover:shadow-lg transition-all duration-300 ${surface.blogCard}`}
                      >
                        {blog.featuredImage && !blog.featuredImage.startsWith("blob:") && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100">
                            <Image
                              src={blog.featuredImage}
                              alt={displayTitle}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-dark-text mb-2 group-hover:text-accent-blue transition-colors line-clamp-2">
                          {displayTitle}
                        </h3>
                        <p className="text-sm text-dark-text/70 line-clamp-2 mb-4">{displayExcerpt}</p>
                        <span className="inline-flex items-center gap-2 text-accent-blue font-medium text-sm group-hover:gap-3 transition-all">
                          {t("blog.readMore")}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-text/60 text-sm">{t("blog.noPosts")}</p>
              </div>
            )}
            <motion.div
              initial={reduceAnimations ? { opacity: 1 } : { opacity: 0 }}
              whileInView={reduceAnimations ? { opacity: 1 } : { opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Link
                href={`/${locale}/blog/`}
                className={`inline-flex items-center gap-2 px-6 py-3 ${isRegionalHome ? "rounded-xl" : "rounded-full"} bg-accent-blue text-white font-semibold text-sm hover:bg-accent-blue-dark transition-colors shadow-md hover:shadow-lg`}
              >
                {t("home.viewAllArticles")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      <Suspense fallback={<ComponentLoader />}>
        <FAQSection />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingWhatsAppButton />
      </Suspense>
    </div>
  );
}
