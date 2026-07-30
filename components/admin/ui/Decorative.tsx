"use client";

/**
 * Extremely subtle brand decoration (gold curves + botanical line-art).
 * Purely cosmetic, absolutely positioned, pointer-events disabled — safe to
 * drop into any relatively-positioned, overflow-hidden container.
 */

export function BotanicalCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M40 180C110 170 150 120 300 20"
        stroke="#D8A73C"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M90 200C150 175 190 140 280 60"
        stroke="#D8A73C"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <g stroke="#14532D" strokeOpacity="0.16" strokeWidth="1.2" strokeLinecap="round">
        <path d="M230 40C245 55 255 75 250 100" />
        <path d="M250 100C270 95 288 78 296 55" />
        <path d="M250 100C260 118 258 138 244 154" />
        <path d="M270 30C280 45 283 62 276 80" />
      </g>
      <circle cx="296" cy="26" r="3" fill="#D8A73C" fillOpacity="0.4" />
      <circle cx="256" cy="66" r="2" fill="#D8A73C" fillOpacity="0.3" />
    </svg>
  );
}

export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`h-[3px] w-16 rounded-full bg-admin-gold ${className}`} aria-hidden="true" />
  );
}

export function GoldCurve({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M0 100C120 40 260 10 400 60"
        stroke="#D8A73C"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <g stroke="#14532D" strokeOpacity="0.15" strokeWidth="1.4" strokeLinecap="round">
        <path d="M20 140C60 120 90 90 100 40" />
        <path d="M55 108C68 100 76 88 78 74" />
        <path d="M40 124C52 118 60 108 63 96" />
        <path d="M75 78C90 74 104 63 110 48" />
      </g>
      <circle cx="100" cy="40" r="3" fill="#D8A73C" fillOpacity="0.35" />
    </svg>
  );
}
