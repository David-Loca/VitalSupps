"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, AlertTriangle, ArrowLeft, Package, Star } from "lucide-react";
import ProductEditor from "./ProductEditor";
import DeploymentNotification from "./DeploymentNotification";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import Button from "@/components/admin/ui/Button";
import Card from "@/components/admin/ui/Card";
import Badge from "@/components/admin/ui/Badge";
import Modal from "@/components/admin/ui/Modal";
import SectionHero from "@/components/admin/ui/SectionHero";
import { BotanicalIcon } from "@/components/admin/ui/Decorative";
import { getAdminDict } from "@/lib/admin/i18n";

function getPriceRange(product: Product): string {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
  }
  return formatPrice(product.price);
}

export default function ProductsManager({ locale }: { locale: string }) {
  const ui = getAdminDict(locale);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [showDeploymentNotification, setShowDeploymentNotification] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/products/", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (product: Product, originalSlug?: string) => {
    try {
      const response = await fetch("/api/admin/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, originalSlug }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        product?: Product;
      };

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to save product");
      }

      if (payload.product) {
        setProducts((prev) => {
          const next = [...prev];
          const lookupSlug = originalSlug || payload.product!.slug;
          const index = next.findIndex((item) => item.slug === lookupSlug);
          if (index >= 0) {
            next[index] = payload.product!;
          } else {
            next.push(payload.product!);
          }
          return next;
        });
      }

      setSelectedProduct(null);
      setSaveStatus("success");
      setShowDeploymentNotification(true);
    } catch (error) {
      console.error("Error saving product:", error);
      setSaveStatus("error");
      setShowDeploymentNotification(true);
      throw error instanceof Error ? error : new Error("Failed to save product");
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirmProduct(product);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmProduct) return;

    const slug = deleteConfirmProduct.slug;
    setIsDeleting(slug);
    try {
      const response = await fetch(`/api/admin/products/?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await loadProducts();
      setSelectedProduct(null);
      setDeleteConfirmProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDelete = async (slug: string) => {
    const product = products.find((p) => p.slug === slug);
    if (product) {
      setDeleteConfirmProduct(product);
    }
  };

  // Show editor when selectedProduct is undefined (new product) or a Product object (editing)
  if (selectedProduct !== null) {
    return (
      <div className="admin-page-enter">
        <div className="mb-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-admin-text-secondary transition-colors hover:text-admin-primary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            {ui.editorChrome.backToProducts}
          </button>
        </div>
        <ProductEditor
          initialProduct={selectedProduct || undefined}
          onSave={handleSave}
          onDelete={
            selectedProduct && typeof selectedProduct === "object" && "slug" in selectedProduct
              ? () => handleDelete(selectedProduct.slug)
              : undefined
          }
          locale={locale}
        />
        <DeploymentNotification
          show={showDeploymentNotification}
          onClose={() => setShowDeploymentNotification(false)}
          type={saveStatus === "error" ? "error" : "success"}
          locale={locale}
        />
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirmProduct} onClose={handleDeleteCancel}>
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-admin-danger-bg">
          <AlertTriangle className="w-7 h-7 text-admin-danger" strokeWidth={2} />
        </div>
        <h3 className="text-[19px] font-semibold text-admin-text text-center mb-2">
          {ui.products.deleteTitle}
        </h3>
        <p className="text-[14px] text-admin-text-secondary text-center mb-6">
          {ui.products.deleteConfirmPrefix}{" "}
          <span className="font-medium text-admin-text">
            &quot;{deleteConfirmProduct?.en?.name || deleteConfirmProduct?.slug}&quot;
          </span>
          ? {ui.products.deleteWarning}
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleDeleteCancel}
            disabled={isDeleting === deleteConfirmProduct?.slug}
            className="flex-1"
          >
            {ui.common.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting === deleteConfirmProduct?.slug}
            loading={isDeleting === deleteConfirmProduct?.slug}
            icon={<Trash2 className="w-4 h-4" strokeWidth={2} />}
            className="flex-1 !bg-admin-danger !text-white hover:!bg-admin-danger/90"
          >
            {isDeleting === deleteConfirmProduct?.slug ? ui.common.deleting : ui.common.delete}
          </Button>
        </div>
      </Modal>

      <div className="space-y-8">
        <SectionHero
          icon={<Package className="w-7 h-7" strokeWidth={2} />}
          title={ui.products.title}
          subtitle={ui.products.subtitle}
        />

        <Card
          decorated
          headerAction={
            <Button
              variant="primary"
              onClick={() => setSelectedProduct(undefined)}
              icon={<Plus className="w-4 h-4" strokeWidth={2} />}
            >
              {ui.products.createNew}
            </Button>
          }
        >
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 text-admin-primary animate-spin mx-auto mb-4" />
              <p className="text-admin-text-secondary text-[14px]">{ui.products.loading}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <BotanicalIcon className="mx-auto mb-4 h-12 w-12 text-admin-sage opacity-30" />
              <p className="text-admin-text-secondary text-[14px] mb-4">{ui.products.empty}</p>
              <Button
                variant="primary"
                onClick={() => setSelectedProduct(undefined)}
                icon={<Plus className="w-4 h-4" strokeWidth={2} />}
                className="mx-auto"
              >
                {ui.products.createFirst}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="group rounded-admin-md border border-admin-border bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-admin-primary/25 hover:shadow-[var(--shadow-admin-card-hover)]"
                >
                  {product.images?.primary && (
                    <div className="relative w-full h-40 mb-3 overflow-hidden rounded-admin-sm bg-admin-hover">
                      <img
                        src={product.images.primary}
                        alt={product.en?.heroImageAlt || product.en?.name || product.slug}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    {product.badge && <Badge variant="gold">{product.badge}</Badge>}
                    <Badge variant="neutral">
                      {product.variants?.length || 0}{" "}
                      {(product.variants?.length || 0) === 1 ? ui.products.variant : ui.products.variants}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-admin-text mb-1 line-clamp-2">
                    {product.en?.name || "Untitled product"}
                  </h3>
                  <p className="text-[13px] text-admin-text-secondary mb-3 truncate" title={product.slug}>
                    /{product.slug}
                  </p>
                  <div className="flex items-center justify-between text-[14px] mb-3">
                    <span className="font-semibold text-admin-text">{getPriceRange(product)}</span>
                    {typeof product.rating === "number" && (
                      <span className="flex items-center gap-1 text-[12px] text-admin-text-secondary">
                        <Star className="w-3.5 h-3.5 fill-admin-gold text-admin-gold" strokeWidth={0} />
                        {product.rating.toFixed(1)} ({product.reviewCount || 0})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                      icon={<Edit className="w-3.5 h-3.5" strokeWidth={2} />}
                      className="flex-1"
                    >
                      {ui.common.edit}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      disabled={isDeleting === product.slug}
                      className="!px-2.5"
                      aria-label={ui.common.delete}
                    >
                      {isDeleting === product.slug ? (
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

        <DeploymentNotification
          show={showDeploymentNotification}
          onClose={() => setShowDeploymentNotification(false)}
          type={saveStatus === "error" ? "error" : "success"}
          locale={locale}
        />
      </div>
    </>
  );
}
