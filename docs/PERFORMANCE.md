# Performance Optimization Documentation

## Table of Contents
1. [Overview](#overview)
2. [Mobile Performance Optimizations](#mobile-performance-optimizations)
3. [Image Optimization](#image-optimization)
4. [Animation Optimization](#animation-optimization)
5. [Font Loading](#font-loading)
5. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
6. [Resource Hints](#resource-hints)
7. [Performance Utilities](#performance-utilities)
8. [Best Practices](#best-practices)

---

## Overview

This project implements comprehensive performance optimizations to achieve **95+ PageSpeed Insights scores** on both mobile and desktop. The optimizations are specifically tuned for mobile devices while maintaining excellent desktop performance.

### Key Performance Metrics
- **Target:** 95+ score on PageSpeed Insights (mobile & desktop)
- **LCP (Largest Contentful Paint):** < 2.5s on mobile
- **Speed Index:** < 3.0s on mobile
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

---

## Mobile Performance Optimizations

### 1. Mobile Detection

**Location:** `lib/utils/performance.ts`

The project uses a simple viewport-based mobile detection:

```typescript
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}
```

**Usage:**
- Conditionally loads resources based on device type
- Applies different image qualities
- Reduces animations on mobile
- Optimizes Intersection Observer settings

### 2. Reduced Motion Support

**Location:** `lib/utils/performance.ts`

Respects user's `prefers-reduced-motion` preference:

```typescript
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

**Impact:**
- Disables animations for users who prefer reduced motion
- Improves performance on low-end devices
- Better accessibility compliance

---

## Image Optimization

### Image Quality Strategy

**Location:** `lib/utils/performance.ts`

Different image qualities for mobile vs desktop:

```typescript
export function getImageQuality(): number {
  if (isMobile()) {
    return 20; // Lower quality on mobile for faster loading
  }
  return 40; // Higher quality on desktop
}
```

### Hero Image Optimization

**Location:** `components/HeroSection.tsx`

The hero image is optimized differently for mobile vs desktop:

```typescript
<Image
  src="/images/hero.png"
  alt="..."
  priority={!mobile}           // Only priority on desktop
  fetchPriority={mobile ? "low" : "high"}
  quality={mobile ? 20 : 40}   // Lower quality on mobile
  loading={mobile ? "lazy" : "eager"}
  sizes="(max-width: 640px) 100vw, ..."
/>
```

**Key Points:**
- **Mobile:** Text is LCP element, image loads lazily with low priority
- **Desktop:** Image is LCP element, loads with high priority
- Uses `order-1` and `order-2` Tailwind classes to prioritize text on mobile

### Image Preloading Strategy

**Location:** `app/layout.tsx`

Hero image is preloaded only on desktop:

```html
<link 
  rel="preload" 
  as="image" 
  href="/images/hero.png" 
  fetchPriority="high" 
  media="(min-width: 768px)" 
/>
```

**Rationale:**
- On mobile, text is the LCP element, so image doesn't need preloading
- On desktop, image is the LCP element, so preloading improves LCP

### Lazy Loading

All below-the-fold images use lazy loading:

```typescript
<Image
  src={image}
  alt="..."
  loading="lazy"
  quality={getImageQuality()}
/>
```

---

## Animation Optimization

### Reduced Animations on Mobile

**Location:** `lib/utils/performance.ts`

```typescript
export function shouldReduceAnimations(): boolean {
  return isMobile() || prefersReducedMotion();
}

export function getAnimationDuration(baseDuration: number = 0.5): number {
  if (isMobile()) {
    return baseDuration * 0.5; // Half duration on mobile
  }
  return baseDuration;
}
```

### Conditional Animation Rendering

**Location:** `components/PricingCard.tsx`, `components/FeaturesSection.tsx`, etc.

Components conditionally render animations:

```typescript
const reduceAnimations = shouldReduceAnimations();

{reduceAnimations ? (
  <div className="...">
    {/* Static content, no animations */}
  </div>
) : (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: getAnimationDuration(0.5) }}
  >
    {/* Animated content */}
  </motion.div>
)}
```

### Carousel Optimizations

**Location:** `components/ContentCarousel.tsx`, `components/LogoCarousel.tsx`

- **Frame Skipping:** Skips animation frames on mobile (every 3rd frame)
- **Slower Scroll Speed:** Reduced scroll speed on mobile (0.3 vs 0.6)
- **Intersection Observer:** Pauses animation when not in viewport

```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const frameSkip = isMobile ? 3 : 1; // Skip frames on mobile
const scrollSpeed = isMobile ? 0.3 : 0.6;
```

---

## Font Loading

### Font Configuration

**Location:** `app/layout.tsx`

Fonts are configured with `display: swap` for optimal loading:

```typescript
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Don't block render
  preload: false,  // Don't preload to reduce blocking
  adjustFontFallback: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  weight: ["400", "600"], // Only load needed weights
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  weight: ["400", "600", "700"], // Only load needed weights
});
```

**Key Optimizations:**
- `display: swap` - Shows fallback font immediately, swaps when loaded
- `preload: false` - Reduces render-blocking resources
- Limited font weights - Only loads necessary weights
- System font fallbacks - Instant rendering with system fonts

### Resource Hints

**Location:** `app/layout.tsx`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```

---

## Code Splitting & Lazy Loading

### Component Lazy Loading

**Location:** `app/[locale]/page.tsx`

Non-critical components are lazy-loaded:

```typescript
import { lazy, Suspense } from "react";

const ContentCarousel = lazy(() => import("@/components/ContentCarousel"));
const LogoCarousel = lazy(() => import("@/components/LogoCarousel"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const DeviceCarousel = lazy(() => import("@/components/DeviceCarousel"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const PricingCard = lazy(() => import("@/components/PricingCard"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FloatingWhatsAppButton = lazy(() => import("@/components/FloatingWhatsAppButton"));
const CTASection = lazy(() => import("@/components/CTASection"));

// Usage with Suspense
<Suspense fallback={<ComponentLoader />}>
  <ContentCarousel />
</Suspense>
```

**Benefits:**
- Reduces initial bundle size
- Faster Time to Interactive (TTI)
- Components load on-demand as user scrolls

### Intersection Observer for Deferred Loading

**Location:** `app/[locale]/page.tsx`

Uses Intersection Observer to defer loading of below-fold components:

```typescript
useEffect(() => {
  if (isMobileDevice) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Component will load when needed
            }
          });
        }, getIntersectionObserverOptions());
        
        // Observe sections below the fold
        setTimeout(() => {
          document.querySelectorAll('section').forEach(section => {
            if (section.offsetTop > window.innerHeight) {
              observer.observe(section);
            }
          });
        }, 100);
      }, { timeout: 2000 });
    }
  }
}, []);
```

---

## Resource Hints

### Preconnect & DNS Prefetch

**Location:** `app/layout.tsx`

```html
<!-- Preconnect to own domain -->
<link rel="preconnect" href="https://your-site.vercel.app" />

<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```

**Purpose:**
- Establishes early connections to external domains
- Reduces DNS lookup time
- Speeds up font loading

---

## Performance Utilities

### Utility Functions

**Location:** `lib/utils/performance.ts`

Complete set of performance utilities:

```typescript
// Mobile detection
export function isMobile(): boolean

// Reduced motion preference
export function prefersReducedMotion(): boolean

// Animation duration optimization
export function getAnimationDuration(baseDuration: number): number

// Should reduce animations
export function shouldReduceAnimations(): boolean

// Image quality optimization
export function getImageQuality(): number

// Intersection Observer options
export function getIntersectionObserverOptions(): IntersectionObserverInit
```

### Usage Example

```typescript
import { 
  isMobile, 
  shouldReduceAnimations, 
  getImageQuality,
  getIntersectionObserverOptions 
} from "@/lib/utils/performance";

const mobile = isMobile();
const reduceAnimations = shouldReduceAnimations();
const imageQuality = getImageQuality();

// Use in components
<Image quality={imageQuality} />
```

---

## Best Practices

### 1. Always Use Performance Utilities

Instead of hardcoding values, use the utility functions:

```typescript
// ❌ Bad
const quality = window.innerWidth < 768 ? 20 : 40;

// ✅ Good
const quality = getImageQuality();
```

### 2. Conditional Animation Rendering

Always check `shouldReduceAnimations()` before rendering animations:

```typescript
const reduceAnimations = shouldReduceAnimations();

{reduceAnimations ? (
  <StaticComponent />
) : (
  <AnimatedComponent />
)}
```

### 3. Lazy Load Below-the-Fold Components

Use `React.lazy()` and `Suspense` for non-critical components:

```typescript
const HeavyComponent = lazy(() => import("@/components/HeavyComponent"));

<Suspense fallback={<LoadingPlaceholder />}>
  <HeavyComponent />
</Suspense>
```

### 4. Optimize Images

- Use `getImageQuality()` for all images
- Set appropriate `sizes` attribute
- Use `loading="lazy"` for below-the-fold images
- Set `priority` only for LCP elements

### 5. Use Intersection Observer

Pause animations and defer loading when components are out of view:

```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  });
}, getIntersectionObserverOptions());
```

### 6. Limit Font Weights

Only load the font weights you actually use:

```typescript
// ❌ Bad - loads all weights
weight: ["400", "500", "600", "700", "800"]

// ✅ Good - only loads needed weights
weight: ["400", "600", "700"]
```

### 7. Use System Font Fallbacks

Always provide system font fallbacks for instant rendering:

```typescript
fallback: ["system-ui", "-apple-system", "sans-serif"]
```

---

## Performance Monitoring

### PageSpeed Insights

Regular testing with PageSpeed Insights:
- **URL:** https://pagespeed.web.dev/
- **Target:** 95+ score on mobile and desktop
- **Key Metrics:**
  - LCP < 2.5s
  - Speed Index < 3.0s
  - FID < 100ms
  - CLS < 0.1

### Lighthouse Audits

Run Lighthouse audits regularly:
```bash
# Chrome DevTools
# F12 → Lighthouse → Run audit
```

### Performance Budget

Keep these budgets in mind:
- **Initial Bundle Size:** < 200KB (gzipped)
- **Total JavaScript:** < 500KB (gzipped)
- **Images:** Optimize to < 200KB each
- **Fonts:** < 100KB total

---

## Troubleshooting

### Performance Score Dropped

**Check:**
1. Are images using `getImageQuality()`?
2. Are animations reduced on mobile?
3. Are components lazy-loaded?
4. Are fonts using `display: swap`?
5. Check Network tab for render-blocking resources

### Slow LCP on Mobile

**Solutions:**
1. Ensure hero text is LCP element (use `order-1` class)
2. Preload critical fonts
3. Reduce hero image quality on mobile
4. Use system font fallbacks

### High JavaScript Bundle Size

**Solutions:**
1. Lazy load non-critical components
2. Use `optimizePackageImports` in `next.config.ts`
3. Remove unused dependencies
4. Code split large components

---

## Future Enhancements

Potential improvements:
1. **Service Worker:** Implement caching strategy
2. **Image CDN:** Use optimized image CDN
3. **HTTP/2 Push:** Push critical resources
4. **Resource Prioritization:** Use `fetchpriority` attribute
5. **Web Vitals Monitoring:** Real user monitoring (RUM)

---

**Last Updated:** 2024
**Version:** 1.0.0


