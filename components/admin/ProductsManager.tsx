"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import ProductEditor from "./ProductEditor";
import DeploymentNotification from "./DeploymentNotification";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

function getPriceRange(product: Product): string {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
  }
  return formatPrice(product.price);
}

export default function ProductsManager() {
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
      <div>
        <div className="mb-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 hover:underline cursor-pointer"
          >
            ← Back to Products List
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
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleDeleteCancel}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleDeleteCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Delete Product?
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                &quot;{deleteConfirmProduct.en?.name || deleteConfirmProduct.slug}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting === deleteConfirmProduct.slug}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting === deleteConfirmProduct.slug}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting === deleteConfirmProduct.slug ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-medium text-black mb-1">Product Management</h2>
              <p className="text-gray-500 text-sm">Create and manage store products</p>
            </div>
            <button
              onClick={() => setSelectedProduct(undefined)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products yet.</p>
              <button
                onClick={() => setSelectedProduct(undefined)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Product</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  {product.images?.primary && (
                    <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.images.primary}
                        alt={product.en?.heroImageAlt || product.en?.name || product.slug}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    {product.badge && (
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        {product.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {product.variants?.length || 0} variant{(product.variants?.length || 0) === 1 ? "" : "s"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.en?.name || "Untitled product"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 truncate" title={product.slug}>
                    /{product.slug}
                  </p>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-medium text-gray-900">{getPriceRange(product)}</span>
                    {typeof product.rating === "number" && (
                      <span className="text-xs text-gray-400">
                        ★ {product.rating.toFixed(1)} ({product.reviewCount || 0})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      disabled={isDeleting === product.slug}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all text-sm font-medium disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting === product.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DeploymentNotification
          show={showDeploymentNotification}
          onClose={() => setShowDeploymentNotification(false)}
          type={saveStatus === "error" ? "error" : "success"}
        />
      </div>
    </>
  );
}
