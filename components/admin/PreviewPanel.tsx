"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Tablet, Smartphone, X, ExternalLink, RefreshCw } from "lucide-react";
import {
  broadcastDraftContent,
  withDraftPreviewParam,
} from "@/lib/admin/draft-preview";
import Button from "@/components/admin/ui/Button";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "834px",
  mobile: "390px",
};

const DEVICE_ICON: Record<Device, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

interface PreviewPanelProps {
  open: boolean;
  onClose: () => void;
  locale: string;
  /** Current draft content for `locale` — broadcast into the iframe on every change. */
  content: Record<string, unknown> | undefined;
  path?: string;
  labels?: {
    title?: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    openInNewTab?: string;
    refresh?: string;
    close?: string;
  };
}

export default function PreviewPanel({
  open,
  onClose,
  locale,
  content,
  path,
  labels,
}: PreviewPanelProps) {
  const [device, setDevice] = useState<Device>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const previewPath = path || `/${locale}/`;
  const src = withDraftPreviewParam(previewPath);

  // Re-send the current draft the moment the iframe (re)loads a fresh document.
  const handleIframeLoad = () => {
    if (content) broadcastDraftContent(locale, content);
  };

  // Push every subsequent edit straight into the live iframe — debounced
  // lightly so fast typing doesn't spam the channel.
  useEffect(() => {
    if (!open || !content) return;
    const timeout = setTimeout(() => {
      broadcastDraftContent(locale, content);
    }, 150);
    return () => clearTimeout(timeout);
  }, [open, locale, content]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-scope fixed inset-0 z-[60] flex flex-col bg-admin-bg/98 backdrop-blur-sm [animation:admin-fade-up_0.2s_var(--ease-admin)_both]">
      <div className="flex items-center justify-between gap-3 border-b border-admin-border bg-admin-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-admin-text">
            {labels?.title ?? "Live preview"}
          </span>
          <span className="rounded-full bg-admin-success-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-admin-primary">
            {locale.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-[12px] border border-admin-border bg-admin-hover p-1">
          {(["desktop", "tablet", "mobile"] as Device[]).map((d) => {
            const Icon = DEVICE_ICON[d];
            const isActive = device === d;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex h-9 items-center gap-1.5 rounded-[9px] px-3 text-[13px] font-medium transition-all cursor-pointer ${
                  isActive ? "bg-white text-admin-primary shadow-sm" : "text-admin-text-secondary hover:text-admin-text"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span className="hidden sm:inline">
                  {labels?.[d] ?? d[0].toUpperCase() + d.slice(1)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReloadKey((k) => k + 1)}
            aria-label={labels?.refresh ?? "Refresh"}
            className="!px-2.5"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
          </Button>
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-[12px] border border-admin-border bg-white px-3 text-[13px] font-medium text-admin-text transition-all hover:-translate-y-[1px] hover:bg-admin-hover"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">{labels?.openInNewTab ?? "Open in new tab"}</span>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={labels?.close ?? "Close"}
            className="!px-2.5"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
        <div
          className={`h-full transition-all duration-300 ease-[var(--ease-admin)] ${
            device === "desktop"
              ? "w-full"
              : "overflow-hidden rounded-[28px] border-[6px] border-admin-text/80 shadow-2xl"
          }`}
          style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
        >
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={src}
            title="Live site preview"
            onLoad={handleIframeLoad}
            className={`h-full w-full bg-white ${device === "desktop" ? "rounded-admin-lg border border-admin-border shadow-[var(--shadow-admin-card)]" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
