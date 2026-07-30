"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    let cancelled = false;

    // Repeatedly re-scroll (not just once) so the offset self-corrects as
    // lazy-loaded sections/images above the target keep shifting layout
    // during a fresh full-page navigation — a single early attempt can
    // measure the wrong position before the page has finished settling.
    const scrollToHash = () => {
      if (cancelled) return;
      const element = document.querySelector(hash);
      if (!element) return;
      const headerHeight = 112;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerHeight);
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    const delays = [0, 100, 300, 600, 1000, 1600, 2400];
    const timers = delays.map((delay) => setTimeout(scrollToHash, delay));

    const onLoad = () => scrollToHash();
    window.addEventListener("load", onLoad);

    // Drop the hash from the address bar once we're confident the page has
    // settled, rather than the instant we first find the element.
    const cleanupTimer = setTimeout(() => {
      if (!cancelled) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }, 2600);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      clearTimeout(cleanupTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return null;
}
