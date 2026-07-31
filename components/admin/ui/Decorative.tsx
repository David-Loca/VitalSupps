"use client";

/**
 * Premium brand decoration — fine-line botanical illustrations and flowing
 * gold curves, in the spirit of luxury wellness/skincare packaging.
 *
 * Design contract: every SVG here draws its strokes at (near) full opacity
 * using `currentColor`. The actual faintness (5–12%) is controlled entirely
 * by the *caller* via a text-color + opacity utility class, e.g.:
 *
 *   <BotanicalCorner className="text-admin-sage opacity-[0.08] absolute ..." />
 *
 * This keeps one predictable opacity knob instead of compounding baked-in
 * stroke-opacity with a wrapper opacity. All pieces are purely cosmetic:
 * pointer-events disabled, unselectable, meant to sit behind real content
 * inside a `relative overflow-hidden` container whose content wrapper is
 * `relative z-10`.
 */

const DECOR_PROPS = {
  "aria-hidden": true as const,
  className: "pointer-events-none select-none",
};

interface DecorativeSvgProps {
  className?: string;
  style?: React.CSSProperties;
}

/** Large fine-line botanical spray — the signature top-right hero motif. */
export function BotanicalCorner({ className = "", style }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      {...DECOR_PROPS}
      className={`${DECOR_PROPS.className} ${className}`}
      style={style}
    >
      {/* main stem */}
      <path
        d="M120 300C140 240 170 190 210 150C250 110 300 80 350 40"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* secondary stem */}
      <path
        d="M180 280C210 230 245 195 300 155"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* leaves — paired almond shapes tapering toward the tip */}
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M210 150C200 128 205 104 226 88C232 112 228 136 210 150Z" />
        <path d="M210 150C188 146 170 132 166 108C190 110 208 126 210 150Z" />
        <path d="M255 118C245 96 249 72 270 56C276 80 272 104 255 118Z" />
        <path d="M255 118C233 114 215 100 211 76C235 78 253 94 255 118Z" />
        <path d="M300 90C292 70 296 48 314 34C319 56 316 78 300 90Z" />
        <path d="M300 90C280 87 264 74 260 52C282 54 298 68 300 90Z" />
        <path d="M340 55C333 39 336 21 351 10C355 28 353 46 340 55Z" />
        <path d="M158 200C148 182 151 162 168 148C173 168 171 188 158 200Z" />
        <path d="M158 200C139 197 125 185 121 166C141 168 156 182 158 200Z" />
      </g>
      {/* short offshoot stems */}
      <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
        <path d="M226 100C232 96 240 94 248 96" />
        <path d="M270 66C277 61 286 59 294 61" />
        <path d="M168 158C161 152 152 149 143 150" />
      </g>
      {/* delicate accent dots */}
      <circle cx="351" cy="10" r="2.4" fill="currentColor" />
      <circle cx="314" cy="34" r="1.8" fill="currentColor" />
      <circle cx="121" cy="166" r="1.8" fill="currentColor" />
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
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M90 90C82 72 85 52 102 40C107 60 104 80 90 90Z" />
        <path d="M90 90C71 87 57 75 54 55C74 57 88 70 90 90Z" />
        <path d="M128 58C121 43 124 27 138 17C142 33 140 49 128 58Z" />
        <path d="M128 58C111 55 100 44 97 28C114 30 126 42 128 58Z" />
      </g>
      <circle cx="165" cy="15" r="2.2" fill="currentColor" />
      <circle cx="138" cy="17" r="1.6" fill="currentColor" />
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

/** Flowing metallic-gold bezier ribbons — sit behind the botanical motif. */
export function GoldCurve({ className = "", style }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      {...DECOR_PROPS}
      className={`${DECOR_PROPS.className} ${className}`}
      style={style}
    >
      <path
        d="M-10 190C90 150 150 90 260 20C300 -4 340 -6 400 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M20 230C120 185 180 130 280 55C315 28 350 20 400 34"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M60 260C150 215 210 165 300 95"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
