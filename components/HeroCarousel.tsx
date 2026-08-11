"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllProducts, getProductContent } from "@/lib/products";
import { getProductUrl } from "@/lib/utils/product-slugs";

const AUTOPLAY_MS = 5000;

interface HeroCarouselProps {
  reduceAnimations?: boolean;
}

/** Smooth auto-advancing carousel of the top product photos, with a title/tagline overlay per slide. */
export default function HeroCarousel({ reduceAnimations = false }: HeroCarouselProps) {
  const { t, locale } = useLanguage();
  const products = getAllProducts().slice(0, 3);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (isPaused || reduceAnimations || products.length <= 1) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, reduceAnimations, next, products.length]);

  if (products.length === 0) return null;

  const active = products[index];
  const content = getProductContent(active, locale);

  return (
    <div
      className="relative w-full h-72 sm:h-96 md:h-105 lg:h-120 rounded-brand-lg overflow-hidden shadow-[var(--shadow-brand-card)] border border-brand-border group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {active.badge && (
        <span className="absolute top-4 left-4 z-20 bg-brand-gold text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap">
          {t(`products.badge.${active.badge}`)}
        </span>
      )}

      <AnimatePresence mode="sync">
        <motion.div
          key={active.slug}
          initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceAnimations ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={active.images.primary}
            alt={content.heroImageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 90vw"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Title/tagline overlay */}
      <AnimatePresence mode="wait">
        <motion.a
          key={active.slug + "-caption"}
          href={getProductUrl(active.slug, locale)}
          initial={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceAnimations ? { opacity: 1 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 block"
        >
          <h3 className="font-semibold text-xl sm:text-2xl text-white leading-tight mb-1 drop-shadow-sm">
            {content.name}
          </h3>
          <p className="text-[13px] sm:text-sm text-white/85 max-w-md leading-snug">
            {content.tagline}
          </p>
        </motion.a>
      </AnimatePresence>

      {/* Dot indicators */}
      {products.length > 1 && (
        <div className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5">
          {products.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
