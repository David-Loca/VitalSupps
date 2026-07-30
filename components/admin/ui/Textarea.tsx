"use client";

import { forwardRef, useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  showCount?: boolean;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      icon,
      showCount = false,
      maxLength,
      value,
      rows = 3,
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
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          rows={rows}
          className={`w-full resize-none rounded-admin-md border border-admin-border bg-white px-4 py-4 text-[16px] text-admin-text placeholder:text-admin-text-secondary/60
            transition-all duration-150 ease-[var(--ease-admin)]
            focus:outline-none focus:border-admin-primary focus:shadow-[var(--shadow-admin-focus)]
            ${className}`}
          {...props}
        />
        {showCount && typeof maxLength === "number" && (
          <div className="mt-1.5 text-right text-[12px] text-admin-text-secondary">
            {length} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
