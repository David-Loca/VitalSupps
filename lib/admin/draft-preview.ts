"use client";

/**
 * Same-origin BroadcastChannel bridge between the admin editor and the
 * public site rendered in the preview iframe. The public site only opens a
 * channel when it detects the `__draftPreview=1` query flag (see
 * contexts/LanguageContext.tsx), so this is a no-op for real visitors —
 * production rendering is completely unaffected.
 */

export const DRAFT_PREVIEW_CHANNEL = "vitalsupps-admin-draft-preview";
export const DRAFT_PREVIEW_PARAM = "__draftPreview";

export interface DraftContentMessage {
  type: "draft-content";
  locale: string;
  content: Record<string, unknown>;
}

export function isDraftPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get(DRAFT_PREVIEW_PARAM) === "1";
  } catch {
    return false;
  }
}

export function withDraftPreviewParam(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${DRAFT_PREVIEW_PARAM}=1`;
}

let sharedChannel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  if (!sharedChannel) {
    sharedChannel = new BroadcastChannel(DRAFT_PREVIEW_CHANNEL);
  }
  return sharedChannel;
}

export function broadcastDraftContent(locale: string, content: Record<string, unknown>): void {
  const channel = getChannel();
  if (!channel) return;
  const message: DraftContentMessage = { type: "draft-content", locale, content };
  channel.postMessage(message);
}

export function subscribeToDraftContent(
  onMessage: (message: DraftContentMessage) => void
): () => void {
  const channel = getChannel();
  if (!channel) return () => {};

  const handler = (event: MessageEvent<DraftContentMessage>) => {
    if (event.data?.type === "draft-content") {
      onMessage(event.data);
    }
  };

  channel.addEventListener("message", handler);
  return () => channel.removeEventListener("message", handler);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Recursively overlay `override` onto `base`, leaving untouched keys intact. */
export function deepMergeContent<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>
): T {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = result[key];
    result[key] =
      isPlainObject(overrideValue) && isPlainObject(baseValue)
        ? deepMergeContent(baseValue, overrideValue)
        : overrideValue;
  }
  return result as T;
}
