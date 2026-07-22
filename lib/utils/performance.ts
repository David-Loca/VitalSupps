/**
 * Performance utilities for mobile optimization
 */
import { useEffect, useState } from "react";

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device has reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on device
 * Returns shorter duration on mobile for better performance
 */
export function getAnimationDuration(baseDuration: number = 0.5): number {
  if (isMobile()) {
    return baseDuration * 0.5; // Half duration on mobile
  }
  return baseDuration;
}

/**
 * Should use reduced animations
 */
export function shouldReduceAnimations(): boolean {
  return isMobile() || prefersReducedMotion();
}

/**
 * Get image quality based on device
 */
export function getImageQuality(): number {
  if (isMobile()) {
    return 20; // Much lower quality on mobile for faster loading
  }
  return 40;
}

/**
 * Intersection Observer options optimized for mobile
 */
export function getIntersectionObserverOptions(): IntersectionObserverInit {
  return {
    rootMargin: isMobile() ? '50px' : '200px', // Smaller margin on mobile
    threshold: isMobile() ? 0.1 : 0.2,
  };
}

/**
 * SSR-safe mobile detection hook. Returns `false` on the server and on the
 * client's first render (matching the server output to avoid a hydration
 * mismatch), then updates to the real value right after mount.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const update = () => setMobile(isMobile());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return mobile;
}

/**
 * SSR-safe reduced-motion hook. Same rationale as `useIsMobile`: starts at
 * `false` so the first client render matches the server-rendered HTML.
 */
export function useShouldReduceAnimations(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const update = () => setReduce(isMobile() || prefersReducedMotion());
    update();
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('resize', update);
    mediaQuery.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  return reduce;
}

/**
 * SSR-safe image quality hook. Starts at the desktop value (matches
 * `getImageQuality()`'s server-side default) so the first client render's
 * `quality` prop matches the server-rendered `<img>` src, then updates after
 * mount if the device turns out to be mobile.
 */
export function useImageQuality(): number {
  const [quality, setQuality] = useState(40);

  useEffect(() => {
    const update = () => setQuality(getImageQuality());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return quality;
}

