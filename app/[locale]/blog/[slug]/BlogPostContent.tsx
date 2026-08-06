"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { BlogBlock, BlogPost } from "@/lib/admin/blog-shared";
import type { Locale } from "@/lib/i18n";
import { normalizeLinkUrl } from "@/lib/utils/normalize-link-url";

interface BlogPostContentProps {
  blog: BlogPost;
  locale: Locale;
}

function isRenderableImageUrl(url: string | undefined): boolean {
  if (!url || url.startsWith("blob:")) return false;
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export default function BlogPostContent({ blog, locale: serverLocale }: BlogPostContentProps) {
  const { t, locale } = useLanguage();

  // Use client locale if available, otherwise fallback to server locale
  const activeLocale = locale || serverLocale;

  const displayTitle = (blog.title[activeLocale] || "").trim() || t("blog.untitled");
  const displayExcerpt = (blog.excerpt[activeLocale] || "").trim();
  const publishedDate = new Date(blog.publishedAt);
  const hasValidPublishedDate = !Number.isNaN(publishedDate.getTime());

  // Helper to get content for current locale
  const getBlockContent = (block: BlogBlock): string => {
    if (typeof block.content === "string") {
      return block.content;
    }
    if (block.content && typeof block.content === "object") {
      return String(block.content[activeLocale] || "").trim();
    }
    return "";
  };

  // Helper to parse markdown-like formatting (bold, italic, links)
  const parseMarkdown = (text: string) => {
    if (!text) return text;

    // Parse links: [text](url) — normalize bare domains (e.g. "example.com") to absolute URLs
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, linkText, url) =>
      `<a href="${normalizeLinkUrl(url)}" target="_blank" rel="noopener noreferrer" class="text-brand-primary hover:underline">${linkText}</a>`
    );

    // Parse bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Parse italic: *text*
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

    return text;
  };

  // Reading time — derived purely from the blocks already on the page, no extra data needed.
  const blocks = Array.isArray(blog.blocks) ? blog.blocks : [];
  const wordCount = blocks.reduce((total, block) => {
    if (block.type === "list") {
      const items = Array.isArray(block.listItems)
        ? block.listItems
        : block.listItems?.[activeLocale] || [];
      return total + items.join(" ").split(/\s+/).filter(Boolean).length;
    }
    return total + getBlockContent(block).split(/\s+/).filter(Boolean).length;
  }, 0);
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const renderBlock = (block: BlogBlock) => {
    const blockContent = getBlockContent(block);

    switch (block.type) {
      case "heading":
        const level = block.level || 2;
        const headingClassName = `font-semibold text-brand-text mb-3 sm:mb-4 mt-6 sm:mt-8 first:mt-0 ${
          level === 1
            ? "text-2xl sm:text-3xl md:text-4xl"
            : level === 2
            ? "text-xl sm:text-2xl md:text-3xl"
            : level === 3
            ? "text-lg sm:text-xl md:text-2xl"
            : "text-base sm:text-lg md:text-xl"
        }`;
        const headingStyle = { textAlign: block.style?.textAlign || "left" } as React.CSSProperties;

        if (level === 1) return <h1 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h1>;
        if (level === 2) return <h2 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h2>;
        if (level === 3) return <h3 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h3>;
        if (level === 4) return <h4 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h4>;
        if (level === 5) return <h5 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h5>;
        return <h6 key={block.id} className={headingClassName} style={headingStyle}>{blockContent}</h6>;

      case "paragraph":
        const parsedContent = parseMarkdown(blockContent);
        return (
          <p
            key={block.id}
            className="text-sm sm:text-base md:text-lg text-brand-text/80 leading-relaxed mb-4 sm:mb-6"
            style={{ textAlign: block.style?.textAlign || "left" }}
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        );

      case "image":
        if (!isRenderableImageUrl(block.imageUrl)) return null;

        // Determine max width based on imageWidth setting
        const getImageMaxWidth = () => {
          switch (block.imageWidth) {
            case "full":
              return "w-full max-w-full";
            case "half":
              return "w-full sm:w-full md:w-1/2 max-w-md";
            case "third":
              return "w-full sm:w-2/3 md:w-1/3 max-w-xs";
            case "quarter":
              return "w-full sm:w-1/2 md:w-1/4 max-w-[200px]";
            default:
              return "w-full max-w-md";
          }
        };

        return (
          <div
            key={block.id}
            className={`mb-4 sm:mb-6 md:mb-8 ${
              block.imageAlign === "center"
                ? "flex justify-center"
                : block.imageAlign === "right"
                ? "flex justify-end sm:justify-end"
                : "flex justify-start"
            }`}
          >
            <div className={`relative ${getImageMaxWidth()} aspect-4/3`}>
              <Image
                src={block.imageUrl!}
                alt={
                  typeof block.imageAlt === "string"
                    ? block.imageAlt
                    : (block.imageAlt?.[activeLocale] || displayTitle)
                }
                fill
                className="object-cover rounded-brand-lg border border-brand-border"
                loading="lazy"
                sizes="(min-width: 768px) 640px, 100vw"
              />
            </div>
          </div>
        );

      case "quote":
        const quoteContent = getBlockContent(block);
        return (
          <blockquote
            key={block.id}
            className="border-l-2 border-brand-gold pl-3 sm:pl-4 md:pl-6 py-3 sm:py-4 my-4 sm:my-6 md:my-8 italic text-sm sm:text-base md:text-lg text-brand-text-secondary bg-brand-bg rounded-r-brand-md"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(quoteContent) }}
          />
        );

      case "list":
        // Handle both old format (string[]) and new format (Record<string, string[]>)
        let listItems: string[] = [];
        if (Array.isArray(block.listItems)) {
          listItems = block.listItems;
        } else if (block.listItems && typeof block.listItems === "object") {
          listItems = block.listItems[activeLocale] || [];
        }

        return (
          <ul key={block.id} className="list-disc list-inside mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 text-brand-text/80 marker:text-brand-gold">
            {listItems.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="text-sm sm:text-base md:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }} />
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 sm:pt-32 pb-10 sm:pb-14 md:pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Use window.location for a full page reload to avoid navigation issues
              window.location.href = `/${activeLocale}/blog`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-hover hover:bg-brand-success-bg text-brand-text-secondary hover:text-brand-primary mb-4 sm:mb-6 md:mb-8 font-medium transition-colors duration-200 cursor-pointer text-sm sm:text-base"
          >
            ← {t("blog.backToBlog")}
          </button>

          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-text mb-3 sm:mb-4 leading-tight">
              {displayTitle}
            </h1>
            {displayExcerpt && (
              <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary mb-4 sm:mb-6 leading-relaxed">{displayExcerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-brand-text-secondary">
              {blog.author && (
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-[11px] font-semibold text-white">
                    {blog.author.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium text-brand-text">{blog.author}</span>
                </span>
              )}
              {blog.author && <span className="hidden sm:inline text-brand-border">•</span>}
              {hasValidPublishedDate ? (
                <span>
                  {publishedDate.toLocaleDateString(activeLocale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : null}
              <span className="hidden sm:inline text-brand-border">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                {readingMinutes} min read
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {isRenderableImageUrl(blog.featuredImage) && (
            <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 mb-6 sm:mb-8 md:mb-10 rounded-brand-lg overflow-hidden border border-brand-border bg-brand-hover">
              <Image
                src={blog.featuredImage!}
                alt={displayTitle}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
              />
            </div>
          )}

          {/* Content (blocks-only rendering) */}
          <div className="prose prose-lg max-w-none">
            {blocks.map((block) => renderBlock(block))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
