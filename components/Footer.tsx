"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, MessageCircle, ArrowRight, ArrowUp, Globe } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/contexts/LanguageContext";
import { locales, type Locale } from "@/lib/i18n";
import { regionDisplayNames } from "@/lib/i18n/locale-maps";
import { getLegalUrl } from "@/lib/utils/installation-slugs";
import { getContactEmailForLocale } from "@/lib/utils/contact-email";
import { usePathname } from "next/navigation";

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    const headerHeight = 112;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export default function Footer() {
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const whatsappUrl = getWhatsAppUrl(t("whatsapp.contactQuestion"));
  const contactEmail = getContactEmailForLocale(locale);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const languageNames = regionDisplayNames;

  const quickLinks = isHomePage
    ? [
        { href: "#home", label: t("common.home"), isExternal: false },
        { href: "#features", label: t("common.features"), isExternal: false },
        { href: "#faq", label: t("common.faq"), isExternal: false },
        { href: "#contact", label: t("common.contact"), isExternal: false },
      ]
    : [
        { href: `/${locale}/`, label: t("common.home"), isExternal: true },
        { href: `/${locale}/#features`, label: t("common.features"), isExternal: true },
        { href: `/${locale}/#faq`, label: t("common.faq"), isExternal: true },
        { href: `/${locale}/#cta`, label: t("common.contact"), isExternal: true },
        { href: `/${locale}/blog/`, label: t("common.blog"), isExternal: true },
      ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerNavGroups = [
    {
      title: t("footer.quickLinks"),
      links: quickLinks.map((link, index) => ({ key: `ql-${index}`, ...link, external: link.isExternal })),
      ariaLabel: "Footer navigation",
    },
    {
      title: t("footer.legal"),
      links: [
        { slug: "privacy-policy", label: t("common.privacyPolicy") },
        { slug: "terms-of-service", label: t("common.termsOfService") },
        { slug: "refund-policy", label: t("common.refundPolicy") },
      ].map((link, index) => ({ key: `lg-${index}`, href: getLegalUrl(link.slug, locale), label: link.label, external: true })),
      ariaLabel: "Legal links",
    },
  ];

  return (
    <footer className="relative bg-dark-text text-white overflow-hidden border-t border-white/5">
      {/* Hairline accent marking the transition into the footer */}
      <div className="h-px w-full bg-accent-secondary/50" />

      <div className="relative max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-x-4 gap-y-6 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
          {/* Brand Column */}
          <motion.div
            className="col-span-2 lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden ring-2 ring-white/10">
                <Image
                  src="/logo/vitalsupps-icon.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="relative h-8 w-auto">
                <Image
                  src="/logo/vitalsupps-wordmark.svg"
                  alt="VitalSupps"
                  width={200}
                  height={35}
                  className="h-full w-auto object-contain brightness-0 invert"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-white/70 leading-relaxed text-sm max-w-md mb-3">
              {t("footer.description")}
            </p>


            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-md text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/30 hover:scale-[1.02] group"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t("common.whatsapp")}</span>
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] group border border-white/20 hover:border-white/30"
              >
                <Mail className="w-4 h-4" />
                <span>{t("common.email")}</span>
              </a>
            </div>
          </motion.div>

          {/* Navigation columns */}
          {footerNavGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.05 * (groupIndex + 1) }}
            >
              <h2 className="text-sm font-semibold text-white mb-2.5 tracking-wide uppercase">
                {group.title}
              </h2>
              <nav className="flex flex-col space-y-1.5" aria-label={group.ariaLabel}>
                {group.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.key}
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm group inline-flex items-center gap-2 w-fit"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </a>
                  ) : (
                    <a
                      key={link.key}
                      href={link.href}
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        if (link.href === "#contact") {
                          e.preventDefault();
                          const contactSection = document.querySelector("#contact") || document.querySelector("#faq");
                          if (contactSection) {
                            const headerHeight = 112;
                            const elementPosition = contactSection.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                          }
                        } else {
                          handleNavClick(e, link.href);
                        }
                      }}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm group inline-flex items-center gap-2 w-fit"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </a>
                  )
                )}
              </nav>
            </motion.div>
          ))}

          {/* Payment Methods Column */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-white mb-2.5 tracking-wide uppercase">
              {t("footer.paymentMethods")}
            </h2>
            <div className="relative w-full max-w-[160px] h-auto opacity-80 hover:opacity-100 transition-opacity duration-200 bg-white/5 p-1.5 rounded-md backdrop-blur-sm border border-white/10 mb-3">
              <Image
                src="/images/Methode-de-paiment.webp"
                alt="Payment methods accepted"
                width={400}
                height={60}
                className="w-full h-auto object-contain"
                quality={40}
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* FDA / supplement disclaimer */}
        <div className="border-t border-white/10 pt-4 pb-1">
          <p className="text-[11px] leading-relaxed text-white/40 max-w-4xl">
            {t("footer.fdaDisclaimer")}
          </p>
        </div>

        {/* Bottom Section - Copyright, Language Picker, Back to Top */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/50 order-2 sm:order-1">
              {t("footer.copyright").replace("{year}", currentYear.toString())}
            </p>

            <div className="flex items-center gap-3 order-1 sm:order-2">
              {/* Language Picker - shown even with a single locale, ready for more */}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/40" />
                <div className="relative flex items-center gap-0.5 bg-white/[0.04] rounded-full p-1 border border-white/10 shadow-inner">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocale(loc)}
                      className={`relative min-w-10 min-h-9 px-3 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-300 cursor-pointer ${
                        locale === loc
                          ? "bg-accent-blue text-white scale-105"
                          : "text-white/45 hover:text-white/90 hover:bg-white/[0.06]"
                      }`}
                      aria-label={`Switch to ${languageNames[loc]}`}
                      aria-current={locale === loc ? "true" : undefined}
                      title={languageNames[loc]}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Back to top */}
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 text-white/50 hover:text-white hover:bg-accent-blue hover:border-accent-blue hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
