"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Check if we're on the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 1024; // lg breakpoint

      // Always show header on mobile or at the top
      if (isMobile || currentScrollY < 50) {
        setIsVisible(true);
        setIsScrolled(currentScrollY > 10);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide when scrolling down, show when scrolling up (desktop only)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 10);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Close mobile menu
    setIsMobileMenuOpen(false);

    // If we're not on the home page, navigate to home page with hash
    if (!isHomePage) {
      // "Home" just means the top of the page, so avoid leaving a stray
      // "#home" in the address bar
      const homeUrl = href === "#home" ? `/${locale}` : `/${locale}${href}`;
      // Use window.location for static export compatibility
      window.location.href = homeUrl;
      return;
    }

    // If we're on the home page, just scroll to the element
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = 112;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      // Use requestAnimationFrame for smoother scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        });
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] transition-transform duration-300 ease-in-out ${
        isScrolled ? "shadow-md" : ""
      } ${isVisible ? "translate-y-0" : "lg:-translate-y-full"}`}
    >
      {/* Announcement bar - standard ecommerce trust/promo strip above the nav.
          Each message is optional (set via the admin panel); empty ones are
          skipped entirely so no orphaned "·" separator is ever shown. */}
      {(() => {
        const rawMessages = [
          t("announcement.shipping"),
          t("announcement.guarantee"),
          t("announcement.whatsapp"),
        ].filter((text) => text && text.trim().length > 0);

        if (rawMessages.length === 0) return null;

        // Progressively hide later messages on narrower screens, based on
        // their position AFTER empty ones are filtered out — not their
        // original slot — so a single remaining message is never hidden.
        const hideBelowByIndex: ("sm" | "md" | null)[] = [null, "sm", "md"];
        const messages = rawMessages.map((text, i) => ({
          text,
          hideBelow: hideBelowByIndex[i] ?? "md",
        }));

        return (
          <div className="bg-accent-blue-dark text-white text-[11px] sm:text-xs font-medium tracking-wide">
            <div className="max-w-[1280px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-8 flex items-center justify-center overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden text-ellipsis">
                {messages.map((m, i) => (
                  <span key={i} className="contents">
                    {i > 0 && (
                      <span
                        className={`text-white/40 ${m.hideBelow === "sm" ? "hidden sm:inline" : m.hideBelow === "md" ? "hidden md:inline" : ""}`}
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                    <span className={m.hideBelow === "sm" ? "hidden sm:inline" : m.hideBelow === "md" ? "hidden md:inline" : ""}>
                      {m.text}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
      <nav
        className="bg-white max-w-[1280px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-20" ref={dropdownRef}>
          {/* Logo */}
          <motion.a
            href={`/${locale}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/${locale}`;
            }}
            className="flex items-center shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Logo mark + wordmark */}
            <div className="relative h-9 sm:h-10 w-9 sm:w-10 shrink-0 mr-2 rounded-full overflow-hidden">
              <Image
                src="/logo/vitalsupps-icon.jpg"
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-8 sm:h-9 w-auto">
              <Image
                src="/logo/vitalsupps-wordmark.svg"
                alt="VitalSupps"
                width={170}
                height={30}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 mx-4">
            {/* Home */}
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="font-medium text-sm text-dark-text/70 hover:text-accent-blue transition-colors duration-200"
            >
              {t("common.home")}
            </motion.a>

            {/* Products */}
            <motion.a
              href="#products"
              onClick={(e) => handleNavClick(e, "#products")}
              className="font-medium text-sm text-dark-text/70 hover:text-accent-blue transition-colors duration-200"
            >
              {t("common.products")}
            </motion.a>

            {/* Blog */}
            <motion.a
              href={`/${locale}/blog`}
              className="font-medium text-sm text-dark-text/70 hover:text-accent-blue transition-colors duration-200"
            >
              {t("common.blog")}
            </motion.a>

            {/* FAQ */}
            <motion.a
              href="#faq"
              onClick={(e) => handleNavClick(e, "#faq")}
              className="font-medium text-sm text-dark-text/70 hover:text-accent-blue transition-colors duration-200"
            >
              {t("common.faq")}
            </motion.a>
          </div>

          {/* Desktop CTA Cluster */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <motion.a
              href="#cta"
              onClick={(e) => handleNavClick(e, "#cta")}
              aria-label={t("common.contactUs")}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-200"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </motion.a>
            <motion.a
              href="#cta"
              onClick={(e) => handleNavClick(e, "#cta")}
              className="btn btn-dark relative inline-flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("common.contactUs")}
            </motion.a>
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="md:hidden relative w-11 h-11 -mr-1.5 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-6 h-5">
              {/* Top line */}
              <motion.span
                className="absolute top-0 left-0 w-full h-0.5 bg-dark-text rounded-full origin-center"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 10 : 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              {/* Middle line */}
              <motion.span
                className="absolute top-1/2 left-0 w-full h-0.5 bg-dark-text rounded-full -translate-y-1/2 origin-center"
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  scaleX: isMobileMenuOpen ? 0 : 1,
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              {/* Bottom line */}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-dark-text rounded-full origin-center"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -10 : 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2, ease: "easeInOut" },
            }}
            className="overflow-hidden bg-white md:hidden shadow-lg border-b border-subtle-gray"
          >
            <div className="max-w-[1280px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
              <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                {/* Home */}
                <motion.a
                  href="#home"
                  onClick={(e) => handleNavClick(e, "#home")}
                  className="text-base font-medium text-dark-text hover:text-accent-blue py-3 px-4 rounded-md hover:bg-light-gray transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  {t("common.home")}
                </motion.a>

                {/* Products */}
                <motion.a
                  href="#products"
                  onClick={(e) => handleNavClick(e, "#products")}
                  className="text-base font-medium text-dark-text hover:text-accent-blue py-3 px-4 rounded-md hover:bg-light-gray transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.14, duration: 0.2 }}
                >
                  {t("common.products")}
                </motion.a>

                {/* Blog */}
                <motion.a
                  href={`/${locale}/blog`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-dark-text hover:text-accent-blue py-3 px-4 rounded-md hover:bg-light-gray transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.2 }}
                >
                  {t("common.blog")}
                </motion.a>

                {/* FAQ */}
                <motion.a
                  href="#faq"
                  onClick={(e) => handleNavClick(e, "#faq")}
                  className="text-base font-medium text-dark-text hover:text-accent-blue py-3 px-4 rounded-md hover:bg-light-gray transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22, duration: 0.2 }}
                >
                  {t("common.faq")}
                </motion.a>

                {/* Contact (Blue color) */}
                <motion.a
                  href="#cta"
                  onClick={(e) => handleNavClick(e, "#cta")}
                  className="text-base font-medium text-accent-blue hover:text-accent-blue-dark py-3 px-4 rounded-md hover:bg-light-gray transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.26, duration: 0.2 }}
                >
                  {t("common.contactUs")}
                </motion.a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
