"use client";

import { Info } from "lucide-react";
import { LeafSprig } from "./Decorative";

interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function InfoBox({ children, icon, className = "" }: InfoBoxProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-admin-md border border-admin-primary/10 bg-admin-success-bg p-5 ${className}`}
    >
      <LeafSprig className="pointer-events-none absolute -right-4 -bottom-6 h-28 w-28 opacity-70" />
      <div className="relative flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-admin-primary text-white">
          {icon ?? <Info className="h-4 w-4" strokeWidth={2} />}
        </span>
        <div className="text-[15px] leading-relaxed text-admin-text/90">{children}</div>
      </div>
    </div>
  );
}
