"use client";

import { BotanicalCorner, BotanicalCornerSmall, GoldCurve } from "./Decorative";

/**
 * Single reusable decorative background for "premium wellness" cards: a
 * thin gold flowing line across the top, a sage botanical leaf branch
 * overlapping the top-right corner, and a smaller/fainter echo of the same
 * branch in the bottom-right corner.
 *
 * Usage — the host card supplies the positioning context:
 *
 *   <div className="relative overflow-hidden ...">
 *     <DecorativeCardBackground />
 *     <div className="relative z-10">... real content ...</div>
 *   </div>
 *
 * This component only renders the decoration layer itself (absolute,
 * inset-0, pointer-events-none, z-0) — it does not touch layout, spacing,
 * or the host card's own styling. Composed from the shared primitives in
 * `./Decorative` so the leaf/curve artwork is defined once.
 */

interface DecorativeCardBackgroundProps {
  /** Show the large branch + gold line overlapping the top-right corner. Default true. */
  topRight?: boolean;
  /** Show the smaller, fainter echo branch in the bottom-right corner. Default true. */
  bottomRight?: boolean;
  /** Base opacity for the top-right motif (0–1, ~15–25% per brand spec). The bottom-right echo renders fainter still. Default 0.2. */
  opacity?: number;
  className?: string;
}

export default function DecorativeCardBackground({
  topRight = true,
  bottomRight = true,
  opacity = 0.2,
  className = "",
}: DecorativeCardBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 select-none overflow-hidden ${className}`}
    >
      {topRight && (
        <>
          <GoldCurve
            className="absolute -right-6 -top-10 h-[220px] w-[340px] text-admin-gold-muted sm:h-[260px] sm:w-[400px]"
            style={{ opacity }}
          />
          <BotanicalCorner
            className="absolute -right-4 -top-6 h-[170px] w-[210px] text-admin-sage sm:h-[210px] sm:w-[250px]"
            style={{ opacity }}
          />
        </>
      )}
      {bottomRight && (
        <BotanicalCornerSmall
          className="absolute -bottom-6 -right-4 h-24 w-24 text-admin-sage sm:h-28 sm:w-28"
          style={{ opacity: opacity * 0.6 }}
        />
      )}
    </div>
  );
}
