"use client";

import { useEffect, useState, useRef } from "react";
import { X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminDict } from "@/lib/admin/i18n";

interface DeploymentNotificationProps {
  show: boolean;
  onClose: () => void;
  type?: "success" | "info" | "error";
  message?: string;
  locale?: string;
}

export default function DeploymentNotification({
  show,
  onClose,
  type = "success",
  message,
  locale = "en",
}: DeploymentNotificationProps) {
  const ui = getAdminDict(locale).toast;
  const [isVisible, setIsVisible] = useState(show);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(10000);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = (duration: number) => {
    clearTimer();
    startTimeRef.current = Date.now();
    remainingTimeRef.current = duration;

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);
  };

  const pauseTimer = () => {
    if (timerRef.current && startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      clearTimer();
    }
  };

  const resumeTimer = () => {
    if (remainingTimeRef.current > 0) {
      startTimer(remainingTimeRef.current);
    }
  };

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      remainingTimeRef.current = 10000;
      startTimer(10000);
    } else {
      clearTimer();
    }

    return () => {
      clearTimer();
    };
  }, [show, onClose]);

  const defaultMessage =
    type === "success" ? ui.savedMessage : type === "error" ? ui.errorMessage : ui.processingMessage;

  const icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Clock;
  const Icon = icon;

  const accentColor =
    type === "success"
      ? "var(--color-admin-success)"
      : type === "error"
      ? "var(--color-admin-danger)"
      : "var(--color-admin-gold)";

  const iconColor =
    type === "success" ? "text-admin-success" : type === "error" ? "text-admin-danger" : "text-admin-gold";

  const title = type === "success" ? ui.savedTitle : type === "error" ? ui.errorTitle : ui.processingTitle;

  if (!show && !isVisible) return null;

  return (
    <AnimatePresence>
      {(show || isVisible) && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="admin-scope fixed top-4 right-4 z-50 w-full max-w-md"
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}
        >
          <div
            className="relative rounded-admin-md border border-admin-border bg-admin-card p-4 pr-10 shadow-2xl"
            style={{ borderLeft: `3px solid ${accentColor}` }}
          >
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-3.5 right-3.5 rounded-full p-1 text-admin-text-secondary transition-colors hover:bg-admin-hover hover:text-admin-text cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>

            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} strokeWidth={2} />
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-admin-text mb-1">{title}</h3>
                <p className="text-[13px] leading-relaxed text-admin-text-secondary">
                  {message || defaultMessage}
                </p>
                {type === "success" && (
                  <div className="mt-3 pt-3 border-t border-admin-border">
                    <div className="flex items-center gap-2 text-[12px] text-admin-text-secondary">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                      <span>{ui.liveSiteNote}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
