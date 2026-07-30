"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

const faqData: FAQItem[] = [
  {
    id: "general-1",
    questionKey: "faq.general1.question",
    answerKey: "faq.general1.answer",
  },
  {
    id: "general-2",
    questionKey: "faq.general2.question",
    answerKey: "faq.general2.answer",
  },
  {
    id: "general-3",
    questionKey: "faq.general3.question",
    answerKey: "faq.general3.answer",
  },
  {
    id: "general-4",
    questionKey: "faq.general4.question",
    answerKey: "faq.general4.answer",
  },
  {
    id: "general-5",
    questionKey: "faq.general5.question",
    answerKey: "faq.general5.answer",
  },
  {
    id: "general-6",
    questionKey: "faq.general6.question",
    answerKey: "faq.general6.answer",
  },
  {
    id: "general-7",
    questionKey: "faq.general7.question",
    answerKey: "faq.general7.answer",
  },
  {
    id: "general-8",
    questionKey: "faq.general8.question",
    answerKey: "faq.general8.answer",
  },
];

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section
      id="faq"
      className="py-14 sm:py-20 lg:py-[100px] px-4 sm:px-6 lg:px-10 bg-white"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif font-light text-[clamp(28px,4vw,48px)] text-center mb-8 xl:mb-10 2xl:mb-12 text-dark-text"
        >
          {t("faq.title")}
        </motion.h2>

        {/* FAQ - independent cards in a 2-col grid instead of one long accordion box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndices.has(index);

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-[4px] border transition-all duration-300 overflow-hidden h-fit ${
                  isOpen
                    ? "border-accent-blue"
                    : "border-subtle-gray hover:border-accent-blue/30"
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 transition-colors duration-200 cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 className="text-sm sm:text-base font-semibold font-heading pr-2 flex-1 text-dark-text">
                    {t(faq.questionKey)}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? "bg-accent-blue text-white" : "bg-off-white text-dark-text"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 border-l-4 border-accent-secondary-light ml-5 sm:ml-6 pl-4">
                        <p className="text-[15px] leading-[1.75] text-muted-text">
                          {t(faq.answerKey)}
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
  );
}

