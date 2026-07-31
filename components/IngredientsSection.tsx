"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllProducts, getProductContent } from "@/lib/products";

export default function IngredientsSection() {
  const { t, locale } = useLanguage();
  const products = getAllProducts();

  return (
    <section id="ingredients" className="py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-brand-bg">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-10 lg:gap-16 items-start mb-8 lg:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-semibold text-[clamp(28px,4vw,44px)] leading-tight text-brand-text"
          >
            {t("ingredients.sectionTitle")}
          </motion.h2>
          <p className="text-[15px] leading-[1.75] text-brand-text-secondary lg:pt-2">
            {t("ingredients.sectionSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {products.map((product, index) => {
            const content = getProductContent(product, locale);
            const isTerracotta = product.slug === "gut-health";
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`border-t-2 pt-5 ${isTerracotta ? "border-accent-terracotta" : "border-brand-primary"}`}
              >
                <h3 className="font-semibold text-lg sm:text-xl text-brand-text mb-4">
                  {content.name}
                </h3>
                <ul className="space-y-2.5">
                  {content.ingredients.map((ingredient) => (
                    <li key={ingredient} className="text-[15px] leading-[1.75] text-brand-text-secondary pl-4 relative">
                      <span
                        className={`absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full ${
                          isTerracotta ? "bg-accent-terracotta" : "bg-brand-primary"
                        }`}
                      />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
