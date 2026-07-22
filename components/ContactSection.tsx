"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/contexts/LanguageContext";
import { getContactEmailForLocale } from "@/lib/utils/contact-email";

export default function ContactSection() {
  const { t, locale } = useLanguage();
  const whatsappUrl = getWhatsAppUrl(t("whatsapp.contactQuestion"));
  const contactEmail = getContactEmailForLocale(locale);

  return (
    <section id="contact" className="pt-4 pb-8 lg:pt-6 lg:pb-10 xl:pt-8 xl:pb-12 2xl:pt-10 2xl:pb-16 bg-white">
      <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="bg-accent-blue rounded-lg overflow-hidden"
        >
          <div className="p-6 md:p-8 xl:p-10 2xl:p-12">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 xl:gap-10 2xl:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div>
                <h2 className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white uppercase mb-2 xl:mb-3 2xl:mb-4">
                  {t("contactSection.title")}
                </h2>
                <p className="text-white/90 text-sm md:text-base xl:text-lg 2xl:text-xl leading-relaxed">
                  {t("contactSection.description")}
                </p>
              </div>

              {/* Right Side - Contact Options */}
              <div className="flex flex-row md:flex-col gap-5 md:gap-4">
                {/* WhatsApp */}
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-white/80 transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 flex-shrink-0" />
                  <span className="text-base md:text-lg xl:text-xl 2xl:text-2xl font-medium underline">
                    {t("common.whatsapp")}
                  </span>
                </motion.a>

                {/* Email */}
                <motion.a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 text-white hover:text-white/80 transition-colors cursor-pointer"
                  whileHover={{ x: 2 }}
                >
                  <Mail className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-base md:text-lg xl:text-xl 2xl:text-2xl font-medium underline">E-mail</span>
                    <span className="text-sm xl:text-base 2xl:text-lg text-white/70 hidden md:block">{contactEmail}</span>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

