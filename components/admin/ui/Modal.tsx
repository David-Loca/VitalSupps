"use client";

import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, children, className = "" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-admin-text/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md rounded-admin-xl border border-admin-border bg-admin-card p-7 shadow-2xl [animation:admin-modal-in_0.2s_var(--ease-admin)_both] ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-admin-text-secondary transition-colors hover:bg-admin-hover hover:text-admin-text cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  );
}
