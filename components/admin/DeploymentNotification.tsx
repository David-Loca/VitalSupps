"use client";

import { useEffect, useState, useRef } from "react";
import { X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeploymentNotificationProps {
  show: boolean;
  onClose: () => void;
  type?: "success" | "info" | "error";
  message?: string;
}

export default function DeploymentNotification({
  show,
  onClose,
  type = "success",
  message,
}: DeploymentNotificationProps) {
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

  const defaultMessage = type === "success"
    ? "Your changes are saved. This dashboard keeps showing what you just saved. The public website updates after Vercel redeploys from GitHub (usually 1–3 minutes)."
    : type === "error"
    ? "An error occurred while saving. Please try again."
    : "Changes are being processed...";

  const icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Clock;
  const Icon = icon;

  const bgColor = type === "success"
    ? "bg-green-50 border-green-200"
    : type === "error"
    ? "bg-red-50 border-red-200"
    : "bg-blue-50 border-blue-200";

  const iconColor = type === "success"
    ? "text-green-600"
    : type === "error"
    ? "text-red-600"
    : "text-blue-600";

  const textColor = type === "success"
    ? "text-green-800"
    : type === "error"
    ? "text-red-800"
    : "text-blue-800";

  if (!show && !isVisible) return null;

  return (
    <AnimatePresence>
      {(show || isVisible) && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}
        >
          <div className={`${bgColor} border-2 rounded-lg shadow-lg p-4 relative`}>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <Icon className={`w-6 h-6 ${iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h3 className={`font-semibold text-sm mb-1 ${textColor}`}>
                  {type === "success" ? "Changes Saved!" : type === "error" ? "Error" : "Processing..."}
                </h3>
                <p className={`text-sm ${textColor} leading-relaxed`}>
                  {message || defaultMessage}
                </p>
                {type === "success" && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <Clock className="w-4 h-4" />
                      <span>Live site: GitHub → Vercel redeploy (1–3 min). Dashboard already shows your saved edits.</span>
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
