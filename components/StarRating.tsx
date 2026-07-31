"use client";

import { Star } from "lucide-react";

/**
 * Shared star-rating display used by product cards, the buy box, and the
 * reviews section — a row of `--color-star`-filled stars plus optional
 * numeric average and review count, per the Ecommerce density addendum in
 * BRAND_IDENTITY.md.
 */
export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  className = "",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}) {
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <span key={i} className="relative inline-block">
              <Star className={`${sizeClass} text-brand-gold/25`} fill="currentColor" strokeWidth={0} />
              {(filled || half) && (
                <Star
                  className={`${sizeClass} text-brand-gold absolute inset-0`}
                  fill="currentColor"
                  strokeWidth={0}
                  style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                />
              )}
            </span>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-brand-text">{rating.toFixed(1)}</span>
      {showCount && typeof reviewCount === "number" && (
        <span className="text-sm text-brand-text-secondary">({reviewCount})</span>
      )}
    </div>
  );
}
