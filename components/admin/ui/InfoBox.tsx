"use client";

import { Info } from "lucide-react";
import { BotanicalCornerSmall } from "./Decorative";

interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function InfoBox({ children, icon, className = "" }: InfoBoxProps) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-admin-md border border-admin-primary/10 bg-admin-success-bg p-5 ${className}`}
    >
      <BotanicalCornerSmall className="absolute -right-3 -bottom-5 z-0 h-24 w-24 text-admin-sage opacity-[0.1]" />
      <div className="relative z-10 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-admin-primary text-white">
          {icon ?? <Info className="h-4 w-4" strokeWidth={2} />}
        </span>
        <div className="text-[15px] leading-relaxed text-admin-text/90">{children}</div>
      </div>
    </div>
  );
}
