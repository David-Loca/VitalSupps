"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Save,
  X,
  Loader2,
  Check,
  Upload,
  Plus,
  MoveUp,
  MoveDown,
  Star,
  Link2,
} from "lucide-react";
import type {
  Product,
  ProductLocaleContent,
  ProductVariant,
  ProductReview,
  ProductFaqItem,
} from "@/lib/products";
import { locales as PRODUCT_LOCALES, type Locale } from "@/lib/i18n";
import { getAdminDict } from "@/lib/admin/i18n";
import { getProductsSegment } from "@/lib/utils/product-slugs";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
};

const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  de: "DE",
};

const BADGE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "None" },
  { value: "bestseller", label: "Bestseller" },
  { value: "new", label: "New" },
];

/**
 * `ProductReview.isSample` is typed as the literal `true` in lib/products.ts
 * (every review currently in data/products.json is fabricated sample content).
 * The editor needs to let admins flip a review to `isSample: false` once it's
 * replaced with a genuine customer review, so it works with a locally
 * widened type and casts to `ProductReview[]` only when building the save
 * payload — lib/products.ts itself is left untouched.
 */
type EditableReview = Omit<ProductReview, "isSample"> & { isSample: boolean };

function emptyLocaleContent(): ProductLocaleContent {
  return {
    name: "",
    tagline: "",
    heroImageAlt: "",
    targetAudience: "",
    benefits: [""],
    usage: "",
    safety: "",
    ingredients: [""],
    faq: [],
    seoKeywords: "",
  };
}

function emptySpecs() {
  return {
    servingSize: "",
    servingsPerContainer: "",
    form: "",
    allergens: "",
  };
}

function generateVariantId(): string {
  return `variant-${Math.random().toString(36).substring(2, 9)}`;
}

interface ProductDraft extends Omit<Product, "reviews"> {
  reviews: EditableReview[];
}

function buildEmptyProduct(): ProductDraft {
  return {
    slug: "",
    slugs: {},
    price: 0,
    compareAtPrice: undefined,
    badge: "",
    rating: 0,
    reviewCount: 0,
    images: { primary: "" },
    specs: emptySpecs(),
    reviews: [],
    variants: [],
    en: emptyLocaleContent(),
    fr: emptyLocaleContent(),
    es: emptyLocaleContent(),
    de: emptyLocaleContent(),
  };
}

function normalizeInitialProduct(product: Product): ProductDraft {
  return {
    ...product,
    slugs: product.slugs || {},
    specs: product.specs || emptySpecs(),
    reviews: (product.reviews || []).map((r) => ({
      ...r,
      isSample: (r as unknown as { isSample: boolean }).isSample !== false,
    })),
    variants: product.variants || [],
    en: { ...emptyLocaleContent(), ...product.en },
    fr: { ...emptyLocaleContent(), ...product.fr },
    es: { ...emptyLocaleContent(), ...product.es },
    de: { ...emptyLocaleContent(), ...product.de },
  };
}

function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

interface ProductEditorProps {
  onSave: (product: Product, originalSlug?: string) => Promise<void>;
  onDelete?: (slug: string) => Promise<void>;
  initialProduct?: Product;
  locale: string;
}

// ---------------------------------------------------------------------------
// Small reusable pieces
// ---------------------------------------------------------------------------

function TextListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-admin-text-secondary text-sm w-4 shrink-0">{index + 1}.</span>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="p-1.5 text-admin-danger/70 hover:text-admin-danger"
            title="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-admin-md bg-admin-hover hover:bg-admin-border text-admin-text"
      >
        <Plus className="w-3.5 h-3.5" />
        Add item
      </button>
    </div>
  );
}

export default function ProductEditor({ onSave, onDelete, initialProduct, locale }: ProductEditorProps) {
  const ui = getAdminDict(locale);
  const [product, setProduct] = useState<ProductDraft>(
    initialProduct ? normalizeInitialProduct(initialProduct) : buildEmptyProduct()
  );
  const [originalSlug] = useState<string | undefined>(initialProduct?.slug);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [mirrorMode, setMirrorMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialProduct) {
      setProduct(normalizeInitialProduct(initialProduct));
    }
  }, [initialProduct]);

  const content = product[activeLocale];

  const mirrorTargets = (): Locale[] => (mirrorMode ? PRODUCT_LOCALES : [activeLocale]);

  const setLocaleField = <K extends keyof ProductLocaleContent>(
    field: K,
    value: ProductLocaleContent[K]
  ) => {
    const targets = mirrorTargets();
    setProduct((prev) => {
      const next = { ...prev };
      for (const loc of targets) {
        next[loc] = { ...next[loc], [field]: value };
      }
      return next;
    });
  };

  // -- Image upload -----------------------------------------------------

  const uploadToCloudinary = async (file: File, folder = "product-images"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const response = await fetch("/api/admin/upload-cloudinary/", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload image");
    }
    const data = await response.json();
    return data.url as string;
  };

  const handlePrimaryImageUpload = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setProduct((prev) => ({ ...prev, images: { primary: previewUrl } }));
    setPendingUploads((prev) => new Set(prev).add("primary"));
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProduct((prev) => ({ ...prev, images: { primary: url } }));
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      setProduct((prev) => ({ ...prev, images: { primary: "" } }));
      URL.revokeObjectURL(previewUrl);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      setPendingUploads((prev) => {
        const next = new Set(prev);
        next.delete("primary");
        return next;
      });
    }
  };

  const handleVariantImageUpload = async (variantIndex: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const uploadKey = `variant-${variantIndex}-${Date.now()}`;
    setProduct((prev) => {
      const variants = [...(prev.variants || [])];
      const target = variants[variantIndex];
      if (!target) return prev;
      variants[variantIndex] = { ...target, images: [...target.images, previewUrl] };
      return { ...prev, variants };
    });
    setPendingUploads((prev) => new Set(prev).add(uploadKey));
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProduct((prev) => {
        const variants = [...(prev.variants || [])];
        const target = variants[variantIndex];
        if (!target) return prev;
        variants[variantIndex] = {
          ...target,
          images: target.images.map((img) => (img === previewUrl ? url : img)),
        };
        return { ...prev, variants };
      });
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      setProduct((prev) => {
        const variants = [...(prev.variants || [])];
        const target = variants[variantIndex];
        if (!target) return prev;
        variants[variantIndex] = {
          ...target,
          images: target.images.filter((img) => img !== previewUrl),
        };
        return { ...prev, variants };
      });
      URL.revokeObjectURL(previewUrl);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      setPendingUploads((prev) => {
        const next = new Set(prev);
        next.delete(uploadKey);
        return next;
      });
    }
  };

  // -- Variants -----------------------------------------------------------

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          id: generateVariantId(),
          label: "",
          price: 0,
          images: [],
          isDefault: (prev.variants || []).length === 0,
        },
      ],
    }));
  };

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    setProduct((prev) => {
      const variants = [...(prev.variants || [])];
      variants[index] = { ...variants[index], ...updates };
      return { ...prev, variants };
    });
  };

  const removeVariant = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index),
    }));
  };

  const moveVariant = (index: number, direction: "up" | "down") => {
    setProduct((prev) => {
      const variants = [...(prev.variants || [])];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= variants.length) return prev;
      [variants[index], variants[newIndex]] = [variants[newIndex], variants[index]];
      return { ...prev, variants };
    });
  };

  const setDefaultVariant = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v, i) => ({ ...v, isDefault: i === index })),
    }));
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setProduct((prev) => {
      const variants = [...(prev.variants || [])];
      const target = variants[variantIndex];
      if (!target) return prev;
      variants[variantIndex] = {
        ...target,
        images: target.images.filter((_, i) => i !== imageIndex),
      };
      return { ...prev, variants };
    });
  };

  // -- Reviews --------------------------------------------------------------

  const addReview = () => {
    setProduct((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        { name: "", daysAgo: 0, rating: 5, text: "", isSample: false },
      ],
    }));
  };

  const updateReview = (index: number, updates: Partial<EditableReview>) => {
    setProduct((prev) => {
      const reviews = [...prev.reviews];
      reviews[index] = { ...reviews[index], ...updates };
      return { ...prev, reviews };
    });
  };

  const removeReview = (index: number) => {
    setProduct((prev) => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== index) }));
  };

  // -- Save -----------------------------------------------------------------

  const validateClientSide = (): string | null => {
    const slug = product.slug.trim();
    if (!slug) return "Slug is required.";
    if (!isValidSlugFormat(slug)) {
      return "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-product).";
    }
    for (const loc of PRODUCT_LOCALES) {
      const c = product[loc];
      if (!c.name.trim()) return `Name is required for ${LOCALE_LABELS[loc]}.`;
      if (!c.tagline.trim()) return `Tagline is required for ${LOCALE_LABELS[loc]}.`;
      if (!c.heroImageAlt.trim()) return `Hero image alt text is required for ${LOCALE_LABELS[loc]}.`;
      if (!c.targetAudience.trim()) return `Target audience is required for ${LOCALE_LABELS[loc]}.`;
      if (!c.usage.trim()) return `Usage instructions are required for ${LOCALE_LABELS[loc]}.`;
      if (c.benefits.filter((b) => b.trim()).length === 0) {
        return `At least one benefit is required for ${LOCALE_LABELS[loc]}.`;
      }
      if (c.ingredients.filter((i) => i.trim()).length === 0) {
        return `At least one ingredient is required for ${LOCALE_LABELS[loc]}.`;
      }
    }
    const hasPrimary = Boolean(product.images.primary?.trim());
    const hasVariantImage = (product.variants || []).some((v) => v.images.some((img) => img.trim()));
    if (!hasPrimary && !hasVariantImage) {
      return "At least one image is required (primary image or a variant image).";
    }
    const variantIds = (product.variants || []).map((v) => v.id.trim());
    if (variantIds.some((id) => !id)) return "All variants must have an id.";
    const dupe = variantIds.find((id, idx) => variantIds.indexOf(id) !== idx);
    if (dupe) return `Duplicate variant id "${dupe}" — variant ids must be unique.`;
    return null;
  };

  const handleSave = async () => {
    if (pendingUploads.size > 0 || isUploading) {
      alert("Please wait for image uploads to complete before saving.");
      return;
    }

    const clientError = validateClientSide();
    if (clientError) {
      setSaveError(clientError);
      setSaveStatus("error");
      alert(clientError);
      return;
    }

    setIsSaving(true);
    setSaveStatus("idle");
    setSaveError(null);

    try {
      const payload: Product = {
        ...product,
        slug: product.slug.trim(),
        badge: product.badge || undefined,
        images: {
          primary: product.images.primary?.startsWith("blob:") ? "" : product.images.primary,
        },
        variants: (product.variants || []).map((v) => ({
          ...v,
          images: v.images.filter((img) => !img.startsWith("blob:")),
        })),
        reviews: product.reviews as unknown as ProductReview[],
      };

      await onSave(payload, originalSlug);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving product:", error);
      setSaveStatus("error");
      const message = error instanceof Error ? error.message : "Failed to save product.";
      setSaveError(message);
      alert(message);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const saveButton = (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="inline-flex items-center gap-2 px-4 py-2 bg-admin-primary hover:bg-admin-primary-dark text-white font-medium rounded-admin-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{ui.common.saving}</span>
        </>
      ) : saveStatus === "success" ? (
        <>
          <Check className="w-4 h-4" />
          <span>{ui.common.saved}</span>
        </>
      ) : saveStatus === "error" ? (
        <>
          <X className="w-4 h-4" />
          <span>{ui.common.error}</span>
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          <span>{ui.editorChrome.saveProduct}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-admin-lg border border-admin-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium text-admin-text mb-1">
              {initialProduct ? ui.editorChrome.editProductTitle : ui.editorChrome.createProductTitle}
            </h2>
            <p className="text-admin-text-secondary text-sm">
              Fields marked across all four languages are required for the storefront.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saveButton}
            {initialProduct && onDelete && (
              <button
                onClick={() => onDelete(product.slug)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-admin-danger hover:bg-admin-danger text-white font-medium rounded-admin-md transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>{ui.common.delete}</span>
              </button>
            )}
          </div>
        </div>

        {saveError && (
          <p className="mb-4 text-sm text-admin-danger bg-admin-danger-bg border border-admin-danger/20 rounded-admin-md px-4 py-2">
            {saveError}
          </p>
        )}

        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Slug (URL)</label>
            <input
              type="text"
              value={product.slug}
              onChange={(e) => setProduct((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="my-product"
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
            <p className="text-xs text-admin-text-secondary mt-1">
              Lowercase letters, numbers, and hyphens only. Preview: /products/{product.slug || "your-slug"}/
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Badge</label>
            <select
              value={product.badge || ""}
              onChange={(e) => setProduct((prev) => ({ ...prev, badge: e.target.value || undefined }))}
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            >
              {BADGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Base price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
            <p className="text-xs text-admin-text-secondary mt-1">
              Used when the product has no variants, or before a variant is selected.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Base compare-at price ($, optional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={product.compareAtPrice ?? ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Rating (0–5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={product.rating ?? 0}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Review count</label>
            <input
              type="number"
              min="0"
              value={product.reviewCount ?? 0}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, reviewCount: parseInt(e.target.value, 10) || 0 }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Primary image */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-admin-text mb-2">Primary image</label>
          <div className="space-y-3">
            {product.images.primary && (
              <div className="relative w-full max-w-xs">
                <img
                  src={product.images.primary}
                  alt="Primary product"
                  className="w-full h-auto max-h-56 object-contain rounded-admin-md border border-admin-border bg-admin-bg"
                />
                <button
                  onClick={() => setProduct((prev) => ({ ...prev, images: { primary: "" } }))}
                  className="absolute top-2 right-2 p-1 bg-admin-danger text-white rounded-full hover:bg-admin-danger"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-admin-hover hover:bg-admin-border text-admin-text font-medium rounded-admin-md transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Uploading..." : product.images.primary ? "Change image" : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handlePrimaryImageUpload(file);
                }}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Locale-tabbed content */}
      <div className="bg-white rounded-admin-lg border border-admin-border p-6">
        <div className="mb-6 space-y-4 rounded-admin-lg border border-admin-border bg-admin-bg/80 p-4">
          <div>
            <h3 className="text-sm font-semibold text-admin-text">{ui.localeToolbar.title}</h3>
            <p className="text-xs text-admin-text-secondary mt-1">
              All four languages are required. Switch tabs to edit each, or turn on mirror editing to type once.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {PRODUCT_LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={`px-3 py-1.5 text-sm font-medium rounded-admin-md transition-all ${
                  activeLocale === loc
                    ? "bg-admin-primary text-white"
                    : "bg-white text-admin-text border border-admin-border hover:bg-admin-hover"
                }`}
              >
                {LOCALE_SHORT[loc]} · {LOCALE_LABELS[loc]}
              </button>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-admin-text pt-2 border-t border-admin-border w-full">
            <input
              type="checkbox"
              checked={mirrorMode}
              onChange={(e) => setMirrorMode(e.target.checked)}
              className="rounded border-admin-border"
            />
            <Link2 className="w-4 h-4 text-admin-text-secondary" />
            <span>{ui.localeToolbar.mirrorEditing}</span>
          </label>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Name — {LOCALE_LABELS[activeLocale]}
            </label>
            <input
              type="text"
              value={content.name}
              onChange={(e) => setLocaleField("name", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text text-lg font-medium focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              URL slug — {LOCALE_LABELS[activeLocale]}
            </label>
            <input
              type="text"
              value={product.slugs?.[activeLocale] || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  slugs: { ...prev.slugs, [activeLocale]: e.target.value },
                }))
              }
              placeholder={product.slug || "leave blank to use the default"}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
            <p className="text-xs text-admin-text-secondary mt-1">
              Optional. Lowercase letters, numbers, and hyphens only. Preview: /{activeLocale}/{getProductsSegment(activeLocale)}/{product.slugs?.[activeLocale] || product.slug || "your-slug"}/
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Tagline — {LOCALE_LABELS[activeLocale]}
            </label>
            <input
              type="text"
              value={content.tagline}
              onChange={(e) => setLocaleField("tagline", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Hero image alt text — {LOCALE_LABELS[activeLocale]}
            </label>
            <input
              type="text"
              value={content.heroImageAlt}
              onChange={(e) => setLocaleField("heroImageAlt", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Target audience — {LOCALE_LABELS[activeLocale]}
            </label>
            <textarea
              value={content.targetAudience}
              onChange={(e) => setLocaleField("targetAudience", e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-admin-text mb-2 flex items-center gap-1.5">
              SEO Keywords — {LOCALE_LABELS[activeLocale]}{" "}
              <span className="font-normal text-admin-text-secondary">(comma-separated, not visible on site)</span>
            </label>
            <textarea
              value={content.seoKeywords || ""}
              onChange={(e) => setLocaleField("seoKeywords", e.target.value)}
              rows={2}
              placeholder="keyword one, keyword two, keyword three"
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent resize-none"
            />
            <p className="mt-1.5 text-xs text-admin-text-secondary">
              Added to this page's meta tags for search engines. These are combined with our existing curated keywords — no need to repeat obvious ones like the product name.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Benefits — {LOCALE_LABELS[activeLocale]}
            </label>
            <TextListEditor
              items={content.benefits}
              onChange={(items) => setLocaleField("benefits", items)}
              placeholder="A benefit of this product"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Usage instructions — {LOCALE_LABELS[activeLocale]}
            </label>
            <textarea
              value={content.usage}
              onChange={(e) => setLocaleField("usage", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Safety information — {LOCALE_LABELS[activeLocale]} (optional)
            </label>
            <textarea
              value={content.safety || ""}
              onChange={(e) => setLocaleField("safety", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Ingredients — {LOCALE_LABELS[activeLocale]}
            </label>
            <TextListEditor
              items={content.ingredients}
              onChange={(items) => setLocaleField("ingredients", items)}
              placeholder="An ingredient"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              FAQ — {LOCALE_LABELS[activeLocale]}
            </label>
            <div className="space-y-3">
              {content.faq.map((item, index) => (
                <div key={index} className="border border-admin-border rounded-admin-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-admin-text-secondary">Question {index + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setLocaleField(
                          "faq",
                          content.faq.filter((_, i) => i !== index)
                        )
                      }
                      className="p-1 text-admin-danger/70 hover:text-admin-danger"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const next: ProductFaqItem[] = [...content.faq];
                      next[index] = { ...next[index], question: e.target.value };
                      setLocaleField("faq", next);
                    }}
                    placeholder="Question"
                    className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const next: ProductFaqItem[] = [...content.faq];
                      next[index] = { ...next[index], answer: e.target.value };
                      setLocaleField("faq", next);
                    }}
                    placeholder="Answer"
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary resize-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setLocaleField("faq", [...content.faq, { question: "", answer: "" }])
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-admin-md bg-admin-hover hover:bg-admin-border text-admin-text"
              >
                <Plus className="w-3.5 h-3.5" />
                Add FAQ item
              </button>
            </div>
          </div>

          <div className="rounded-admin-md border border-admin-border bg-admin-bg/80 p-4 space-y-4">
            <p className="text-sm text-admin-text-secondary">
              WhatsApp messages — {LOCALE_LABELS[activeLocale]} (optional). Leave blank to use
              the site-wide default for this language. Available placeholders:{" "}
              <code className="text-xs bg-white px-1 py-0.5 rounded border border-admin-border">{"{product}"}</code>{" "}
              <code className="text-xs bg-white px-1 py-0.5 rounded border border-admin-border">{"{variant}"}</code>{" "}
              <code className="text-xs bg-white px-1 py-0.5 rounded border border-admin-border">{"{quantity}"}</code>{" "}
              (quantity only applies to the order message).
            </p>
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                &quot;Ask on WhatsApp&quot; inquiry message
              </label>
              <textarea
                value={content.whatsappInquiryTemplate || ""}
                onChange={(e) => setLocaleField("whatsappInquiryTemplate", e.target.value)}
                rows={2}
                placeholder="Leave empty to use the default"
                className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text placeholder-admin-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-admin-text mb-2">
                Buy box &quot;Buy via WhatsApp&quot; order message
              </label>
              <textarea
                value={content.whatsappOrderTemplate || ""}
                onChange={(e) => setLocaleField("whatsappOrderTemplate", e.target.value)}
                rows={2}
                placeholder="Leave empty to use the default"
                className="w-full px-4 py-3 bg-white border border-admin-border rounded-admin-md text-admin-text placeholder-admin-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Variants ("Types") */}
      <div className="bg-white rounded-admin-lg border border-admin-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-admin-text mb-1">Types (variants)</h3>
            <p className="text-admin-text-secondary text-sm">
              Purchasable size/format options. Pick one as the default shown on page load.
            </p>
          </div>
          <button
            onClick={addVariant}
            className="inline-flex items-center gap-2 px-3 py-2 bg-admin-hover hover:bg-admin-border text-admin-text font-medium rounded-admin-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add variant
          </button>
        </div>

        {(product.variants || []).length === 0 ? (
          <p className="text-sm text-admin-text-secondary py-6 text-center">
            No variants yet. The product will use the base price and primary image above.
          </p>
        ) : (
          <div className="space-y-4">
            {(product.variants || []).map((variant, index) => (
              <div key={variant.id || index} className="border border-admin-border rounded-admin-md p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => moveVariant(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-admin-text-secondary hover:text-admin-text-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveVariant(index, "down")}
                      disabled={index === (product.variants || []).length - 1}
                      className="p-1 text-admin-text-secondary hover:text-admin-text-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeVariant(index)}
                      className="p-1 text-admin-danger/70 hover:text-admin-danger mt-2"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-admin-text-secondary mb-1">ID</label>
                        <input
                          type="text"
                          value={variant.id}
                          onChange={(e) => updateVariant(index, { id: e.target.value })}
                          placeholder="e.g. drops-60ml"
                          className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-admin-text-secondary mb-1">Label</label>
                        <input
                          type="text"
                          value={variant.label}
                          onChange={(e) => updateVariant(index, { label: e.target.value })}
                          placeholder="e.g. 60ml Drops"
                          className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-admin-text-secondary mb-1">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, { price: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-admin-text-secondary mb-1">
                          Compare-at price ($, optional)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.compareAtPrice ?? ""}
                          onChange={(e) =>
                            updateVariant(index, {
                              compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                        />
                      </div>
                    </div>

                    <label className="inline-flex items-center gap-2 text-sm text-admin-text cursor-pointer">
                      <input
                        type="radio"
                        name="default-variant"
                        checked={Boolean(variant.isDefault)}
                        onChange={() => setDefaultVariant(index)}
                      />
                      Default variant (selected on page load)
                    </label>

                    <div>
                      <label className="block text-xs font-medium text-admin-text-secondary mb-1">Images</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {variant.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative w-20 h-20">
                            <img
                              src={img}
                              alt={`${variant.label || "Variant"} ${imgIndex + 1}`}
                              className="w-full h-full object-cover rounded-admin-md border border-admin-border bg-admin-bg"
                            />
                            <button
                              onClick={() => removeVariantImage(index, imgIndex)}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-admin-danger text-white rounded-full hover:bg-admin-danger"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-admin-border rounded-admin-md cursor-pointer hover:border-admin-primary/40 transition-colors bg-admin-bg">
                          {isUploading ? (
                            <Loader2 className="w-5 h-5 text-admin-text-secondary animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5 text-admin-text-secondary" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) await handleVariantImageUpload(index, file);
                              e.target.value = "";
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-admin-text-secondary">
                        First image is used as this variant&apos;s primary/gallery cover image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specs */}
      <div className="bg-white rounded-admin-lg border border-admin-border p-6">
        <h3 className="text-lg font-medium text-admin-text mb-4">Specs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Serving size</label>
            <input
              type="text"
              value={product.specs?.servingSize || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  specs: { ...emptySpecs(), ...prev.specs, servingSize: e.target.value },
                }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Servings per container</label>
            <input
              type="text"
              value={product.specs?.servingsPerContainer || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  specs: { ...emptySpecs(), ...prev.specs, servingsPerContainer: e.target.value },
                }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Form</label>
            <input
              type="text"
              value={product.specs?.form || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  specs: { ...emptySpecs(), ...prev.specs, form: e.target.value },
                }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">Allergens</label>
            <input
              type="text"
              value={product.specs?.allergens || ""}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  specs: { ...emptySpecs(), ...prev.specs, allergens: e.target.value },
                }))
              }
              className="w-full px-4 py-2 bg-white border border-admin-border rounded-admin-md text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-admin-lg border border-admin-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-admin-text mb-1">Reviews</h3>
            <p className="text-admin-text-secondary text-sm">
              Existing sample reviews are marked &quot;Sample&quot;. Toggle a review off sample once
              it&apos;s replaced with a genuine customer review.
            </p>
          </div>
          <button
            onClick={addReview}
            className="inline-flex items-center gap-2 px-3 py-2 bg-admin-hover hover:bg-admin-border text-admin-text font-medium rounded-admin-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add review
          </button>
        </div>

        {product.reviews.length === 0 ? (
          <p className="text-sm text-admin-text-secondary py-6 text-center">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="border border-admin-border rounded-admin-md p-4">
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      review.isSample ? "bg-admin-gold-light text-admin-gold" : "bg-admin-success-bg text-admin-success"
                    }`}
                  >
                    {review.isSample ? "Sample" : "Real"}
                  </span>
                  <button
                    onClick={() => removeReview(index)}
                    className="p-1 text-admin-danger/70 hover:text-admin-danger"
                    title="Remove review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-admin-text-secondary mb-1">Name</label>
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) => updateReview(index, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-admin-text-secondary mb-1">Days ago</label>
                    <input
                      type="number"
                      min="0"
                      value={review.daysAgo}
                      onChange={(e) =>
                        updateReview(index, { daysAgo: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-admin-text-secondary mb-1">Rating (1-5)</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={review.rating}
                        onChange={(e) =>
                          updateReview(index, { rating: parseInt(e.target.value, 10) || 1 })
                        }
                        className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                      />
                      <Star className="w-4 h-4 text-admin-gold shrink-0" />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-admin-text-secondary mb-1">Text</label>
                  <textarea
                    value={review.text}
                    onChange={(e) => updateReview(index, { text: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-admin-border rounded-admin-md text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary resize-none"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-admin-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!review.isSample}
                    onChange={(e) => updateReview(index, { isSample: !e.target.checked })}
                    className="rounded border-admin-border"
                  />
                  This is a real, verified customer review (not sample content)
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Save */}
      <div className="bg-white rounded-admin-lg border border-admin-border p-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-admin-text-secondary">Remember to save your changes before leaving</p>
          {saveButton}
        </div>
      </div>
    </div>
  );
}
