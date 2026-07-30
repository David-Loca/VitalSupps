"use client";

import { GoldDivider, BotanicalCorner } from "./Decorative";

interface SectionHeroProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function SectionHero({ icon, title, subtitle }: SectionHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-admin-lg border border-admin-border bg-admin-card p-6 sm:p-8 shadow-[var(--shadow-admin-card)]">
      <BotanicalCorner className="pointer-events-none absolute -right-4 -top-6 h-[180px] w-[260px] opacity-80" />
      <div className="relative flex items-center gap-4">
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
