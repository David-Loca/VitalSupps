"use client";

import { GoldDivider, GoldCurve, BotanicalCorner } from "./Decorative";

interface SectionHeroProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function SectionHero({ icon, title, subtitle }: SectionHeroProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-admin-lg border border-admin-border bg-admin-card p-6 sm:p-8 shadow-[var(--shadow-admin-card)]">
      {/* Layered decoration — gold curves behind, botanical line-art in front,
          both strictly decorative (z-0) and clipped to the card. */}
      <GoldCurve className="absolute -right-6 -top-10 z-0 h-[220px] w-[340px] text-admin-gold opacity-[0.09] sm:h-[260px] sm:w-[400px]" />
      <BotanicalCorner className="absolute -right-2 -top-4 z-0 h-[190px] w-[230px] text-admin-sage opacity-[0.11] sm:h-[240px] sm:w-[290px]" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-admin-success-bg text-admin-primary">
          {icon}
        </div>
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold leading-tight text-admin-text">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[15px] text-admin-text-secondary">{subtitle}</p>
          )}
          <GoldDivider className="mt-3" />
        </div>
      </div>
    </div>
  );
}
