"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, Check, ImageIcon } from "lucide-react";
import type { Product } from "@/lib/products";
import Card from "@/components/admin/ui/Card";

const CAROUSEL_SLIDE_COUNT = 3;

/**
 * Lets the admin change the image shown for each of the homepage hero
 * carousel's slides. The carousel always shows the first 3 products' own
 * `images.primary` (see components/HeroCarousel.tsx), so this editor is a
 * shortcut that uploads directly to Cloudinary and saves that same field —
 * no separate carousel data model, no risk of the two ever going out of sync.
 */
export default function HeroCarouselEditor() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const handleFileChange = async (product: Product, file: File | undefined) => {
    if (!file) return;
    setError(null);
    setSavedSlug(null);
    setUploadingSlug(product.slug);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "product-images");
      const uploadRes = await fetch("/api/admin/upload-cloudinary/", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload image");
      }
      const { url } = await uploadRes.json();

      const updatedProduct: Product = { ...product, images: { primary: url } };
      const saveRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save product");
      }

      setProducts((prev) =>
        (prev || []).map((p) => (p.slug === product.slug ? updatedProduct : p))
      );
      setSavedSlug(product.slug);
      setTimeout(() => setSavedSlug((s) => (s === product.slug ? null : s)), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploadingSlug(null);
    }
  };

  if (products === null) {
    return (
      <Card title="Hero Carousel Images" subtitle="Loading...">
        <div className="flex items-center justify-center py-10 text-admin-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </Card>
    );
  }

  const slides = products.slice(0, CAROUSEL_SLIDE_COUNT);

  return (
    <Card
      title="Hero Carousel Images"
      subtitle="The homepage carousel shows these products' images, in this order. Upload a new photo to replace any slide — the title and tagline shown on the carousel always come from that product's own name and tagline."
    >
      {error && (
        <p className="mb-4 text-sm text-admin-danger">{error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {slides.map((product, index) => {
          const isUploading = uploadingSlug === product.slug;
          const isSaved = savedSlug === product.slug;
          return (
            <div key={product.slug} className="rounded-admin-md border border-admin-border p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-admin-text-secondary mb-2">
                Slide {index + 1}
              </p>
              <div className="relative w-full h-40 rounded-admin-sm overflow-hidden bg-admin-hover mb-3 border border-admin-border">
                {product.images.primary ? (
                  <img
                    src={product.images.primary}
                    alt={product.en?.name || product.slug}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-admin-text-secondary">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <p className="font-medium text-admin-text text-sm mb-3 truncate">
                {product.en?.name || product.slug}
              </p>
              <input
                ref={(el) => {
                  fileInputRefs.current[product.slug] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(product, e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRefs.current[product.slug]?.click()}
                className="w-full inline-flex items-center justify-center gap-2 h-10 px-3 rounded-admin-md border border-admin-border bg-white text-sm font-medium text-admin-text hover:bg-admin-hover transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-admin-success" /> Saved
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> {isUploading ? "Uploading..." : "Change Image"}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      {slides.length === 0 && (
        <p className="text-sm text-admin-text-secondary">
          No products yet — add products first, then their images will appear here.
        </p>
      )}
    </Card>
  );
}
