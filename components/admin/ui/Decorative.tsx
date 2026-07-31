"use client";

import { useId } from "react";

/**
 * Premium brand decoration — fine-line botanical illustrations, a soft
 * gradient glow, flowing champagne-gold shimmer curves, and a few tiny
 * sparkle marks. Editorial/Apple-HIG-inspired: thin strokes, no fills, no
 * symmetry, opacity always controlled by the caller and kept low (<15%
 * recommended) so the artwork reads as texture, not illustration.
 *
 * Design contract: line art draws at (near) full stroke opacity using
 * `currentColor`; the caller sets faintness via a text-color + opacity
 * utility class, e.g.:
 *
 *   <BotanicalCorner className="text-admin-sage opacity-[0.12] absolute ..." />
 *
 * Purely cosmetic: pointer-events disabled, unselectable, meant to sit
 * behind real content inside a `relative overflow-hidden` container whose
 * content wrapper is `relative z-10`.
 */

const DECOR_PROPS = {
  "aria-hidden": true as const,
  className: "pointer-events-none select-none",
};

interface DecorativeSvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/** Tiny four-point sparkle mark. */
function Sparkle({ cx, cy, s, opacity = 1 }: { cx: number; cy: number; s: number; opacity?: number }) {
  const d = `M${cx} ${cy - s}L${cx + s * 0.22} ${cy - s * 0.22}L${cx + s} ${cy}L${cx + s * 0.22} ${cy + s * 0.22}L${cx} ${cy + s}L${cx - s * 0.22} ${cy + s * 0.22}L${cx - s} ${cy}L${cx - s * 0.22} ${cy - s * 0.22}Z`;
  return <path d={d} fill="var(--color-admin-champagne)" opacity={opacity} />;
}

/** Large fine-line botanical spray with a soft glow mesh — the signature top-right hero motif. */
export function BotanicalCorner({ className = "", style }: DecorativeSvgProps) {
  const uid = useId();
  const glowId = `${uid}-glow`;

  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      {...DECOR_PROPS}
      className={`${DECOR_PROPS.className} ${className}`}
      style={style}
    >
      <defs>
        <radialGradient id={glowId} cx="0.75" cy="0.25" r="0.65">
          <stop offset="0%" stopColor="var(--color-admin-champagne)" stopOpacity="0.5" />
          <stop offset="45%" stopColor="var(--color-admin-sage)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-admin-sage)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft gradient mesh glow, sits behind everything */}
      <rect x="120" y="0" width="240" height="220" fill={`url(#${glowId})`} />

      {/* main stem */}
      <path
        d="M120 300C140 240 170 190 210 150C250 110 300 80 350 40"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* secondary stem */}
      <path
        d="M180 280C210 230 245 195 300 155"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {/* leaves — paired almond shapes tapering toward the tip, gently uneven for an organic (non-symmetric) feel */}
      <g stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round">
        <path d="M210 150C201 129 204 105 226 88C233 113 227 137 210 150Z" />
        <path d="M210 150C189 145 171 131 166 108C191 111 209 127 210 150Z" />
        <path d="M255 118C246 97 248 73 270 56C277 81 271 105 255 118Z" />
        <path d="M255 118C234 113 214 99 211 76C236 79 253 95 255 118Z" />
        <path d="M300 90C293 71 295 49 314 34C320 57 316 79 300 90Z" />
        <path d="M300 90C281 86 263 73 260 52C283 55 299 69 300 90Z" />
        <path d="M340 55C334 40 335 22 351 10C356 29 353 47 340 55Z" />
        <path d="M158 200C149 183 150 163 168 148C174 169 171 189 158 200Z" />
      </g>
      {/* a couple of leaves in deep emerald for tonal depth */}
      <g stroke="var(--color-admin-emerald)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M158 200C140 196 124 184 121 166C142 169 156 183 158 200Z" />
      </g>
      {/* short offshoot stems */}
      <g stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
        <path d="M226 100C233 97 240 95 248 96" />
        <path d="M270 66C278 62 286 60 294 61" />
        <path d="M168 158C160 153 152 150 143 150" />
      </g>
      {/* delicate gold sparkles */}
      <Sparkle cx={349} cy={8} s={3.4} opacity={0.9} />
      <Sparkle cx={308} cy={40} s={2.2} opacity={0.7} />
      <Sparkle cx={118} cy={163} s={2.4} opacity={0.75} />
    </svg>
  );
}

/** Compact botanical sprig for information cards / small corners. */
export function BotanicalCornerSmall({ className = "", style }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      {...DECOR_PROPS}
      className={`${DECOR_PROPS.className} ${className}`}
      style={style}
    >
      <path
        d="M20 170C48 150 72 122 90 90C108 58 128 34 165 15"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <g stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round">
        <path d="M90 90C82 72 85 52 102 40C107 60 104 80 90 90Z" />
        <path d="M90 90C71 87 57 75 54 55C74 57 88 70 90 90Z" />
        <path d="M128 58C121 43 124 27 138 17C142 33 140 49 128 58Z" />
      </g>
      <g stroke="var(--color-admin-emerald)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 58C111 55 100 44 97 28C114 30 126 42 128 58Z" />
      </g>
      <Sparkle cx={164} cy={14} s={2.6} opacity={0.85} />
    </svg>
  );
}

/** Tiny centered sprout used inside empty states — meant to be gently visible. */
export function BotanicalIcon({ className = "", style }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      {...DECOR_PROPS}
      className={`${DECOR_PROPS.className} ${className}`}
      style={style}
    >
      <path
        d="M32 56V30"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M32 34C32 22 24 14 12 12C13 25 21 33 32 34Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M32 30C32 18 40 10 52 8C51 21 43 29 32 30Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 56C20 50 25 46 32 46C39 46 44 50 44 56"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Thin gold rule beneath section headings. */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-[3px] w-16 rounded-full bg-admin-gold ${className}`} aria-hidden="true" />
  );
}

/** Flowing champagne-gold shimmer curves — sit behind the botanical motif. */
export function GoldCurve({ className = "", style }: DecorativeSvgProps) {
  const uid = useId();
  const shimmerId = `${uid}-shimmer`;

  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      {...DECOR_PROPS}
      className={`${DECOR_PROPS.className} ${className}`}
      style={style}
    >
      <defs>
        <linearGradient id={shimmerId} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="var(--color-admin-champagne)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--color-admin-champagne)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-admin-champagne)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M-10 190C90 150 150 90 260 20C300 -4 340 -6 400 10"
        stroke={`url(#${shimmerId})`}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M20 230C120 185 180 130 280 55C315 28 350 20 400 34"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M60 260C150 215 210 165 300 95"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
