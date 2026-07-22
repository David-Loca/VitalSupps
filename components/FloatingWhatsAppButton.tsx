"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FloatingWhatsAppButton() {
  const { t } = useLanguage();
  const whatsappUrl = getWhatsAppUrl(t("whatsapp.floatingButton"));

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-[53px] h-[53px] sm:w-[60px] sm:h-[60px] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center bg-[#25D366] hover:bg-[#20BA5A] group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={t("whatsapp.ariaFloating")}
    >
      {/* WhatsApp icon */}
      <div className="relative w-full h-full flex items-center justify-center p-2.5 sm:p-3">
        <Image
          src="/whatsapp.webp"
          alt="WhatsApp"
          width={48}
          height={48}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Tooltip on hover */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-dark-text text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
        {t("whatsapp.tooltip")}
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-dark-text" />
      </div>
    </motion.a>
  );
}

