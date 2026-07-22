import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Admin dashboard requires server-side rendering
  // Static export is disabled
  trailingSlash: true,
  images: {
    qualities: [20, 24, 40, 50, 75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Modern JavaScript - target modern browsers to reduce polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // Optimize for modern browsers - reduce polyfills
  transpilePackages: [],
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {},
  // Redirects for SEO-friendly URLs
  // Note: Critical redirects (root, trailing slashes, English->localized slugs) are handled in middleware.ts
  // These redirects handle old/legacy routes only
  async redirects() {
    return [
      // Root page redirect - prevent duplicate content (301 permanent redirect)
      // This is a backup - middleware handles this first, but keeping for safety
      {
        source: '/',
        destination: '/en/',
        permanent: true,
      },
      // Alternative redirects for old URLs
      {
        source: '/:locale/terms-and-conditions',
        destination: '/:locale/terms-of-service/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
