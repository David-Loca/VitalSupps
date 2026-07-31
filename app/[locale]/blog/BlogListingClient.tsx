"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { getBlogUrl, isBlogAvailableInLocale } from "@/lib/utils/blog-slugs";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n";
import { BotanicalCorner, GoldCurve } from "@/components/admin/ui/Decorative";

interface BlogListingClientProps {
  initialBlogs: BlogPost[];
  locale: Locale;
}

export default function BlogListingClient({ initialBlogs, locale }: BlogListingClientProps) {
  const { t } = useLanguage();
  const blogs = initialBlogs;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 sm:pt-32 pb-10 sm:pb-14" role="main">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Hero Section */}
          <section className="relative isolate mb-12 sm:mb-16 md:mb-20 overflow-hidden" aria-labelledby="blog-heading">
            <BotanicalCorner className="pointer-events-none absolute -right-8 -top-10 z-0 h-[260px] w-[300px] text-brand-sage opacity-[0.1] sm:h-[320px] sm:w-[380px]" />
            <GoldCurve className="pointer-events-none absolute -right-14 -top-16 z-0 h-[220px] w-[340px] text-brand-champagne opacity-[0.08] sm:h-[280px] sm:w-[420px]" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-success-bg rounded-full mb-6">
                <span className="text-brand-primary text-sm font-medium">{t("blog.eyebrow")}</span>
              </div>
              <h1 id="blog-heading" className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] font-semibold text-brand-text mb-4 sm:mb-6 leading-tight tracking-tight">
                {t("blog.title")}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary max-w-2xl mx-auto leading-relaxed">
                {t("blog.description")}
              </p>
            </motion.div>
          </section>

          {/* Blog Grid - server-rendered links for SEO */}
          {blogs.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-16 sm:py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-success-bg text-brand-primary mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <p className="text-brand-text text-lg sm:text-xl font-semibold mb-2">{t("blog.noPosts")}</p>
              <p className="text-brand-text-secondary text-sm sm:text-base leading-relaxed">{t("blog.noPostsSubtitle")}</p>
            </div>
          ) : (
            <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" aria-label={t("blog.articlesAriaLabel")}>
              {blogs
                .filter((blog) => isBlogAvailableInLocale(blog, locale))
                .map((blog, index) => {
                const displayTitle = (blog.title[locale] || "").trim() || t("blog.untitled");
                const displayExcerpt = (blog.excerpt[locale] || "").trim() || t("blog.excerptUnavailable");
                const publishedDate = new Date(blog.publishedAt);
                const formattedDate = publishedDate.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const postUrl = getBlogUrl(blog, locale);

                return (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      href={postUrl}
                      className="group block h-full bg-white border border-brand-border rounded-brand-lg shadow-[var(--shadow-brand-card)] overflow-hidden hover:border-brand-primary/25 hover:shadow-[var(--shadow-brand-card-hover)] hover:-translate-y-1 transition-all duration-300"
                      aria-label={`Read article: ${displayTitle}`}
                    >
                      {blog.featuredImage && !blog.featuredImage.startsWith("blob:") && (
                        <div className="relative w-full h-32 sm:h-40 md:h-44 overflow-hidden bg-brand-hover">
                          <Image
                            src={blog.featuredImage}
                            alt={displayTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <div className="p-4 sm:p-5 md:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-brand-text-secondary mb-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden />
                            <time dateTime={blog.publishedAt}>{formattedDate}</time>
                          </div>
                          {blog.author && (
                            <>
                              <span className="text-brand-text-secondary/60 hidden sm:inline">•</span>
                              <span className="font-medium text-xs">{blog.author}</span>
                            </>
                          )}
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-text mb-2 sm:mb-3 group-hover:text-brand-primary transition-colors duration-300 line-clamp-2 leading-tight">
                          {displayTitle}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-brand-text-secondary line-clamp-3 mb-4 sm:mb-5 leading-relaxed">
                          {displayExcerpt}
                        </p>
                        <div className="flex items-center gap-2 text-brand-primary font-medium text-xs sm:text-sm group-hover:gap-3 transition-all duration-300">
                          <span>{t("blog.readMore")}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </nav>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
