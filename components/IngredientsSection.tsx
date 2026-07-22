"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllProducts, getProductContent } from "@/lib/products";

export default function IngredientsSection() {
  const { t, locale } = useLanguage();
  const products = getAllProducts();

  return (
    <section id="ingredients" className="py-16 sm:py-20 bg-off-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-10 lg:gap-16 items-start mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl text-dark-text"
          >
            {t("ingredients.sectionTitle")}
          </motion.h2>
          <p className="text-base sm:text-lg text-dark-text/70 lg:pt-2">
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
                className={`border-t-2 pt-5 ${isTerracotta ? "border-accent-terracotta" : "border-accent-blue"}`}
              >
                <h3 className="text-lg sm:text-xl font-display text-dark-text mb-4">
                  {content.name}
                </h3>
                <ul className="space-y-2.5">
                  {content.ingredients.map((ingredient) => (
                    <li key={ingredient} className="text-sm text-dark-text/80 leading-relaxed pl-4 relative">
                      <span
                        className={`absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full ${
                          isTerracotta ? "bg-accent-terracotta" : "bg-accent-blue"
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
