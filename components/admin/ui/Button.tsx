"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-admin-primary text-white border border-admin-primary hover:bg-admin-primary-dark hover:border-admin-primary-dark shadow-sm",
  secondary:
    "bg-white text-admin-text border border-admin-border hover:bg-admin-hover",
  ghost:
    "bg-transparent text-admin-text-secondary border border-transparent hover:bg-admin-hover hover:text-admin-text",
  danger:
    "bg-admin-danger-bg text-admin-danger border border-admin-danger/20 hover:bg-admin-danger hover:text-white",
  gold: "bg-admin-gold text-white border border-admin-gold hover:brightness-95 shadow-sm",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-[46px] px-5 text-[15px] gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      icon,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-[12px] font-medium
          transition-all duration-150 ease-[var(--ease-admin)]
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          hover:-translate-y-[1px] disabled:hover:translate-y-0
          ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
