"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    
    if (hash) {
      // If there's a hash, scroll to that element with header offset
      const scrollToHash = () => {
        const element = document.querySelector(hash);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
          // Drop the hash from the address bar once we've scrolled to it
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          return true;
        }
        return false;
      };

      // Try to scroll to hash element (multiple attempts for lazy-loaded components)
      if (!scrollToHash()) {
        setTimeout(() => {
          if (!scrollToHash()) {
            setTimeout(scrollToHash, 300);
          }
        }, 50);
      }
    } else {
      // Only scroll to top if there's no hash
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}


