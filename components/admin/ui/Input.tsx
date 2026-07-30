"use client";

import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  accent?: boolean;
  showCount?: boolean;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      icon,
      badge,
      accent = false,
      showCount = false,
      maxLength,
      value,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const length = typeof value === "string" ? value.length : 0;

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 flex items-center gap-1.5 text-[14px] font-medium text-admin-primary"
          >
            {icon}
            {label}
          </label>
        )}
        {hint && <p className="mb-2 -mt-1 text-[13px] text-admin-text-secondary">{hint}</p>}
        <div className="relative">
          {badge && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-admin-gold text-[12px] font-semibold text-white">
              {badge}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            className={`w-full rounded-admin-md border bg-white text-[16px] text-admin-text placeholder:text-admin-text-secondary/60
              transition-all duration-150 ease-[var(--ease-admin)]
              focus:outline-none focus:border-admin-primary focus:shadow-[var(--shadow-admin-focus)]
              h-[54px] px-4 ${badge ? "pl-12" : ""}
              ${accent ? "border-admin-gold/60 text-admin-gold font-medium focus:border-admin-gold" : "border-admin-border"}
              ${className}`}
            {...props}
          />
        </div>
        {showCount && typeof maxLength === "number" && (
          <div className="mt-1.5 text-right text-[12px] text-admin-text-secondary">
            {length} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
