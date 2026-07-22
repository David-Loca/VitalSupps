"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { BlogBlock, BlogPost } from "@/lib/admin/blog-shared";
import type { Locale } from "@/lib/i18n";

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
    
    // Parse links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-blue hover:underline">$1</a>');
    
    // Parse bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Parse italic: *text*
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    return text;
  };

  const renderBlock = (block: BlogBlock) => {
    const blockContent = getBlockContent(block);
    
    switch (block.type) {
      case "heading":
        const level = block.level || 2;
        const headingClassName = `font-bold text-dark-text mb-3 sm:mb-4 mt-6 sm:mt-8 first:mt-0 ${
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
            className="text-sm sm:text-base md:text-lg text-dark-text/80 leading-relaxed mb-4 sm:mb-6"
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
            <div className={`relative ${getImageMaxWidth()}`}>
              <img
                src={block.imageUrl}
                alt={
                  typeof block.imageAlt === "string"
                    ? block.imageAlt
                    : (block.imageAlt?.[activeLocale] || displayTitle)
                }
                className="w-full h-auto rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        );

      case "quote":
        const quoteContent = getBlockContent(block);
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-accent-blue pl-3 sm:pl-4 md:pl-6 py-3 sm:py-4 my-4 sm:my-6 md:my-8 italic text-sm sm:text-base md:text-lg text-dark-text/70 bg-gray-50 rounded-r-lg"
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
          <ul key={block.id} className="list-disc list-inside mb-4 sm:mb-6 space-y-1.5 sm:space-y-2 text-dark-text/80">
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
      <main className="pt-24 sm:pt-24 pb-10 sm:pb-14 md:pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Use window.location for a full page reload to avoid navigation issues
              window.location.href = `/${activeLocale}/blog`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-off-white hover:bg-accent-blue-light text-dark-text/75 hover:text-accent-blue-dark mb-4 sm:mb-6 md:mb-8 font-medium transition-colors duration-200 cursor-pointer text-sm sm:text-base"
          >
            ← {t("blog.backToBlog")}
          </button>

          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-text mb-3 sm:mb-4 leading-tight">
              {displayTitle}
            </h1>
            {displayExcerpt && (
              <p className="text-base sm:text-lg md:text-xl text-dark-text/70 mb-4 sm:mb-6 leading-relaxed">{displayExcerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-dark-text/50">
              {blog.author && <span>Par {blog.author}</span>}
              {blog.author && <span className="hidden sm:inline">•</span>}
              {hasValidPublishedDate ? (
                <span>
                  {publishedDate.toLocaleDateString(activeLocale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : null}
            </div>
          </header>

          {/* Featured Image */}
          {isRenderableImageUrl(blog.featuredImage) && (
            <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 mb-6 sm:mb-8 md:mb-10 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={blog.featuredImage}
                alt={displayTitle}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          {/* Content (blocks-only rendering) */}
          <div className="prose prose-lg max-w-none">
            {(Array.isArray(blog.blocks) ? blog.blocks : []).map((block) => renderBlock(block))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
