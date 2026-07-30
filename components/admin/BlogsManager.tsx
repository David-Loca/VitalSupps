"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Loader2, AlertTriangle, ArrowLeft, FileText } from "lucide-react";
import BlogEditor from "./BlogEditor";
import DeploymentNotification from "./DeploymentNotification";
import type { BlogPost } from "@/lib/admin/blog-shared";
import { getBlogUrl } from "@/lib/utils/blog-slugs";
import { getPublishedLocales, type BlogLocale } from "@/lib/admin/blog-locales";
import {
  getBlogLocaleLabel,
  getBlogLocaleShort,
} from "@/lib/admin/admin-locale-labels";
import type { Locale } from "@/lib/i18n";
import Button from "@/components/admin/ui/Button";
import Card from "@/components/admin/ui/Card";
import Badge from "@/components/admin/ui/Badge";
import Modal from "@/components/admin/ui/Modal";
import SectionHero from "@/components/admin/ui/SectionHero";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | undefined | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState<BlogPost | null>(null);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({}); // Store blob URLs for images
  const [showDeploymentNotification, setShowDeploymentNotification] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const previewForLocale = (b: BlogPost, locale: BlogLocale) => {
    const title = (b.title[locale] || "").trim();
    const excerpt = (b.excerpt[locale] || "").trim();
    return { title: title || "Untitled", excerpt: excerpt || "No excerpt" };
  };

  const previewPrimary = (b: BlogPost) => {
    const locales = getPublishedLocales(b);
    const loc = (locales.includes(b.locale as BlogLocale)
      ? b.locale
      : locales[0] || "en") as BlogLocale;
    return { ...previewForLocale(b, loc), locale: loc };
  };

  // Helper to get slug for display
  const getSlugForDisplay = (blog: BlogPost, locale?: Locale): string => {
    if (typeof blog.slug === "string") {
      return blog.slug;
    }
    const slugRecord = blog.slug as Record<string, string>;
    const targetLocale = (locale || blog.locale) as Locale;
    return String(slugRecord[targetLocale] || "").trim();
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs/", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);

        // Pre-load image previews for blog featured images that might not be deployed yet
        data.forEach((blog: BlogPost) => {
          if (blog.featuredImage && !imagePreviews[blog.featuredImage]) {
            // Try to load the image, if it fails it's not deployed yet
            const img = new window.Image();
            img.onerror = () => {
              // Image not available yet, we'll just show broken image
              console.log(`Image not yet deployed: ${blog.featuredImage}`);
            };
            img.src = blog.featuredImage;
          }
        });
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (blog: BlogPost) => {
    try {
      const response = await fetch("/api/admin/blogs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blog),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        blog?: BlogPost;
      };

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to save blog");
      }

      if (payload.blog) {
        setBlogs((prev) => {
          const next = [...prev];
          const index = next.findIndex((item) => item.id === payload.blog!.id);
          if (index >= 0) {
            next[index] = payload.blog!;
          } else {
            next.push(payload.blog!);
          }
          return next.sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        });
      }

      setSelectedBlog(null);
      setSaveStatus("success");
      setShowDeploymentNotification(true);
    } catch (error) {
      console.error("Error saving blog:", error);
      setSaveStatus("error");
      setShowDeploymentNotification(true);
      throw error instanceof Error ? error : new Error("Failed to save blog");
    }
  };

  const handleDeleteClick = (blog: BlogPost) => {
    setDeleteConfirmBlog(blog);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmBlog(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmBlog) return;

    const blogId = deleteConfirmBlog.id;
    setIsDeleting(blogId);
    try {
      const response = await fetch(`/api/admin/blogs/?id=${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      await loadBlogs();
      setSelectedBlog(null);
      setDeleteConfirmBlog(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDelete = async (blogId: string) => {
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
      setDeleteConfirmBlog(blog);
    }
  };

  // Show editor when selectedBlog is undefined (new blog) or a BlogPost object (editing)
  if (selectedBlog !== null) {
    return (
      <div className="admin-page-enter">
        <div className="mb-6">
          <button
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-admin-text-secondary transition-colors hover:text-admin-primary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to Blogs List
          </button>
        </div>
        <BlogEditor
          initialBlog={selectedBlog || undefined}
          onSave={handleSave}
          onDelete={selectedBlog && typeof selectedBlog === 'object' && 'id' in selectedBlog ? () => handleDelete(selectedBlog.id) : undefined}
        />
        <DeploymentNotification
          show={showDeploymentNotification}
          onClose={() => setShowDeploymentNotification(false)}
          type={saveStatus === "error" ? "error" : "success"}
        />
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmBlog} onClose={handleDeleteCancel}>
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-admin-danger-bg">
          <AlertTriangle className="w-7 h-7 text-admin-danger" strokeWidth={2} />
        </div>
        <h3 className="text-[19px] font-semibold text-admin-text text-center mb-2">
          Delete Blog Post?
        </h3>
        <p className="text-[14px] text-admin-text-secondary text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-admin-text">
            &quot;
            {deleteConfirmBlog &&
              (
                Object.values(deleteConfirmBlog.title).find((t) => t?.trim()) || "Untitled"
              ).trim()}
            &quot;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleDeleteCancel}
            disabled={isDeleting === deleteConfirmBlog?.id}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting === deleteConfirmBlog?.id}
            loading={isDeleting === deleteConfirmBlog?.id}
            icon={<Trash2 className="w-4 h-4" strokeWidth={2} />}
            className="flex-1 !bg-admin-danger !text-white hover:!bg-admin-danger/90"
          >
            {isDeleting === deleteConfirmBlog?.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>

      <div className="space-y-8">
        <SectionHero
          icon={<FileText className="w-7 h-7" strokeWidth={2} />}
          title="Blog Management"
          subtitle="Create and manage blog posts"
        />

        <Card
          headerAction={
            <Button
              variant="primary"
              onClick={() => setSelectedBlog(undefined)}
              icon={<Plus className="w-4 h-4" strokeWidth={2} />}
            >
              Create New Blog
            </Button>
          }
        >
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 text-admin-primary animate-spin mx-auto mb-4" />
              <p className="text-admin-text-secondary text-[14px]">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-admin-text-secondary text-[14px] mb-4">No blog posts yet.</p>
              <Button
                variant="primary"
                onClick={() => setSelectedBlog(undefined)}
                icon={<Plus className="w-4 h-4" strokeWidth={2} />}
                className="mx-auto"
              >
                Create Your First Blog Post
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
               {blogs.map((blog) => (
                 <div
                   key={blog.id}
                   className="group rounded-admin-md border border-admin-border bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-admin-primary/25 hover:shadow-[var(--shadow-admin-card-hover)]"
                 >
                   {blog.featuredImage && !blog.featuredImage.startsWith('blob:') && (
                     <div className="relative w-full h-40 mb-3 overflow-hidden rounded-admin-sm bg-admin-hover">
                       <img
                         src={blog.featuredImage}
                         alt={previewPrimary(blog).title}
                         className="w-full h-full object-cover"
                       />
                     </div>
                   )}
                   <div className="flex flex-wrap gap-1 mb-2">
                     {getPublishedLocales(blog).map((loc) => (
                       <Badge key={loc} variant="neutral">
                         <span title={getBlogLocaleLabel(loc)}>{getBlogLocaleShort(loc)}</span>
                       </Badge>
                     ))}
                   </div>
                   <h3 className="font-semibold text-admin-text mb-2 line-clamp-2">
                     {previewPrimary(blog).title}
                   </h3>
                   <p className="text-[13px] text-admin-text-secondary mb-3 line-clamp-2">
                     {previewPrimary(blog).excerpt}
                   </p>
                   <div className="flex items-center justify-between text-[12px] text-admin-text-secondary/80 mb-3">
                     <span
                       className="truncate"
                       title={`Slugs — ${getPublishedLocales(blog)
                         .map((loc) => `${getBlogLocaleShort(loc)}: ${getSlugForDisplay(blog, loc)}`)
                         .join(", ")}`}
                     >
                       /{previewPrimary(blog).locale}/blog/{getSlugForDisplay(blog, previewPrimary(blog).locale)}/
                     </span>
                     <span className="whitespace-nowrap ml-2">
                       {new Date(blog.publishedAt).toLocaleDateString()}
                     </span>
                   </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedBlog(blog)}
                      icon={<Edit className="w-3.5 h-3.5" strokeWidth={2} />}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <a
                      href={getBlogUrl(blog, previewPrimary(blog).locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] border border-admin-border bg-white px-3.5 text-[13px] font-medium text-admin-text transition-all hover:-translate-y-[1px] hover:bg-admin-hover"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                      View
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(blog)}
                      disabled={isDeleting === blog.id}
                      className="!px-2.5"
                      aria-label="Delete blog"
                    >
                      {isDeleting === blog.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Deployment Notification */}
      <DeploymentNotification
        show={showDeploymentNotification}
        onClose={() => setShowDeploymentNotification(false)}
        type={saveStatus === "error" ? "error" : "success"}
      />
    </>
  );
}
