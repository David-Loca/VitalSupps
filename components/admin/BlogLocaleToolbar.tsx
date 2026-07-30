"use client";

import { Copy, Globe, Link2 } from "lucide-react";
import {
  BLOG_LOCALES,
  copyBlogLocaleContent,
  hasLocalePublishableContent,
  type BlogLocale,
} from "@/lib/admin/blog-locales";
import {
  ADMIN_BLOG_LOCALE_LABELS,
  getBlogLocaleLabel,
  getBlogLocaleShort,
} from "@/lib/admin/admin-locale-labels";
import type { BlogPost } from "@/lib/admin/blog-shared";
import Badge from "@/components/admin/ui/Badge";
import Button from "@/components/admin/ui/Button";
import { getAdminDict } from "@/lib/admin/i18n";

interface BlogLocaleToolbarProps {
  blog: BlogPost;
  activeLocale: BlogLocale;
  primaryLocale: BlogLocale;
  publishedLocales: BlogLocale[];
  mirrorMode: boolean;
  onBlogChange: (blog: BlogPost) => void;
  onActiveLocaleChange: (locale: BlogLocale) => void;
  onPrimaryLocaleChange: (locale: BlogLocale) => void;
  onPublishedLocalesChange: (locales: BlogLocale[]) => void;
  onMirrorModeChange: (enabled: boolean) => void;
  /** Admin UI display language — distinct from `activeLocale` (the content language being edited). */
  uiLocale: string;
}

export default function BlogLocaleToolbar({
  blog,
  activeLocale,
  primaryLocale,
  publishedLocales,
  mirrorMode,
  onBlogChange,
  onActiveLocaleChange,
  onPrimaryLocaleChange,
  onPublishedLocalesChange,
  onMirrorModeChange,
  uiLocale,
}: BlogLocaleToolbarProps) {
  const ui = getAdminDict(uiLocale).localeToolbar;
  const otherPublished = publishedLocales.filter((l) => l !== activeLocale);

  const togglePublished = (loc: BlogLocale) => {
    if (publishedLocales.includes(loc)) {
      if (publishedLocales.length <= 1) return;
      const next = publishedLocales.filter((l) => l !== loc);
      onPublishedLocalesChange(next);
      onBlogChange({ ...blog, translations: next });
      if (activeLocale === loc) {
        onActiveLocaleChange(next[0]);
      }
      if (primaryLocale === loc) {
        onPrimaryLocaleChange(next[0]);
      }
      return;
    }
    const next = [...publishedLocales, loc].sort(
      (a, b) => BLOG_LOCALES.indexOf(a) - BLOG_LOCALES.indexOf(b)
    );
    onPublishedLocalesChange(next);
    onBlogChange({ ...blog, translations: next });
  };

  const handleCopy = (includeSlug: boolean) => {
    if (otherPublished.length === 0) {
      alert("Enable at least one other published language first.");
      return;
    }
    const message = includeSlug
      ? `Copy all content and URL slugs from ${getBlogLocaleLabel(activeLocale)} to ${otherPublished.map((l) => getBlogLocaleLabel(l)).join(", ")}?`
      : `Copy all text content from ${getBlogLocaleLabel(activeLocale)} to ${otherPublished.map((l) => getBlogLocaleLabel(l)).join(", ")}? (Slugs stay separate.)`;
    if (!confirm(message)) return;
    onBlogChange(
      copyBlogLocaleContent(blog, activeLocale, {
        targets: otherPublished,
        includeSlug,
      })
    );
  };

  return (
    <div className="mb-6 space-y-4 rounded-admin-md border border-admin-border bg-admin-bg p-5">
      <div>
        <h3 className="text-[14px] font-semibold text-admin-text">{ui.title}</h3>
        <p className="text-[12px] text-admin-text-secondary mt-1">{ui.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-medium text-admin-text-secondary mr-1">{ui.publish}</span>
        {BLOG_LOCALES.map((loc) => {
          const checked = publishedLocales.includes(loc);
          const complete = hasLocalePublishableContent(blog, loc);
          return (
            <label
              key={loc}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-[12px] border cursor-pointer transition-all ${
                checked
                  ? "bg-white border-admin-border shadow-sm"
                  : "bg-admin-hover border-transparent opacity-80"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => togglePublished(loc)}
                className="rounded border-admin-border accent-admin-primary"
              />
              <span className="text-[13px] font-medium text-admin-text">{getBlogLocaleShort(loc)}</span>
              <span className="text-[12px] text-admin-text-secondary hidden sm:inline">
                {ADMIN_BLOG_LOCALE_LABELS[loc]}
              </span>
              {checked && (
                <Badge variant={complete ? "success" : "warning"}>{complete ? ui.ready : ui.draft}</Badge>
              )}
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[12px] font-medium text-admin-text-secondary">{ui.primary}</span>
        <select
          value={primaryLocale}
          onChange={(e) => {
            const loc = e.target.value as BlogLocale;
            onPrimaryLocaleChange(loc);
            onBlogChange({ ...blog, locale: loc });
            if (!publishedLocales.includes(loc)) {
              const next = [...publishedLocales, loc].sort(
                (a, b) => BLOG_LOCALES.indexOf(a) - BLOG_LOCALES.indexOf(b)
              );
              onPublishedLocalesChange(next);
              onBlogChange({ ...blog, locale: loc, translations: next });
            }
          }}
          className="text-[13px] px-3 py-2 border border-admin-border rounded-[10px] bg-white text-admin-text focus:outline-none focus:border-admin-primary"
        >
          {publishedLocales.map((loc) => (
            <option key={loc} value={loc}>
              {getBlogLocaleLabel(loc)}
            </option>
          ))}
        </select>

        <span className="text-[12px] font-medium text-admin-text-secondary ml-2">{ui.editing}</span>
        {publishedLocales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => onActiveLocaleChange(loc)}
            className={`inline-flex items-center px-3 py-1.5 text-[13px] font-medium rounded-[10px] transition-all cursor-pointer ${
              activeLocale === loc
                ? "bg-admin-primary text-white"
                : "bg-white text-admin-text border border-admin-border hover:bg-admin-hover"
            }`}
          >
            <Globe className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={2} />
            {getBlogLocaleShort(loc)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-admin-border">
        <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] text-admin-text">
          <input
            type="checkbox"
            checked={mirrorMode}
            onChange={(e) => onMirrorModeChange(e.target.checked)}
            className="rounded border-admin-border accent-admin-primary"
          />
          <Link2 className="w-4 h-4 text-admin-text-secondary" strokeWidth={2} />
          <span>{ui.mirrorEditing}</span>
        </label>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleCopy(false)}
          disabled={otherPublished.length === 0}
          icon={<Copy className="w-3.5 h-3.5" strokeWidth={2} />}
        >
          {ui.copyToOthers.replace("{locale}", activeLocale.toUpperCase())}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleCopy(true)}
          disabled={otherPublished.length === 0}
          title="Also copies URL slugs (use only if slugs should match)"
          icon={<Copy className="w-3.5 h-3.5" strokeWidth={2} />}
        >
          {ui.copyWithSlugs}
        </Button>
      </div>
    </div>
  );
}
