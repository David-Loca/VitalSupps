"use client";

type BadgeVariant = "neutral" | "primary" | "gold" | "success" | "warning" | "danger";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-admin-hover text-admin-text-secondary border-admin-border",
  primary: "bg-admin-success-bg text-admin-primary border-admin-primary/15",
  gold: "bg-admin-gold-light text-admin-gold border-admin-gold/25",
  success: "bg-admin-success-bg text-admin-success border-admin-success/20",
  warning: "bg-admin-warning-bg text-admin-warning border-admin-warning/20",
  danger: "bg-admin-danger-bg text-admin-danger border-admin-danger/20",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
