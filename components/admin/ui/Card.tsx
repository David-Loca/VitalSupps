"use client";

import DecorativeCardBackground from "./DecorativeCardBackground";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  bodyClassName?: string;
  noPadding?: boolean;
  /** Subtle bottom-right botanical corner — for gallery/showcase cards, not form-dense ones. */
  decorated?: boolean;
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  icon,
  headerAction,
  bodyClassName = "",
  noPadding = false,
  decorated = false,
}: CardProps) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-admin-lg border border-admin-border bg-admin-card shadow-[var(--shadow-admin-card)]
        transition-shadow duration-150 ${noPadding ? "" : "p-6 sm:p-8"} ${className}`}
    >
      {decorated && <DecorativeCardBackground topRight={false} opacity={0.14} />}
      {(title || subtitle || headerAction) && (
        <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="flex items-center gap-2 text-[24px] font-semibold text-admin-text">
                {icon}
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-[15px] text-admin-text-secondary">{subtitle}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className={`relative z-10 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
