"use client";

import { useState } from "react";
import { MessageCircle, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice, getSavingsPercent, type Product, type ProductVariant } from "@/lib/products";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";
import StarRating from "./StarRating";

/**
 * The PDP "buy box" — the single highest-priority "make it feel real"
 * surface on a product page. Bordered, self-contained card with name,
 * rating (anchor-linked to the reviews section), a variant selector when
 * the product has size/format options, price + compare-at + savings badge
 * for the selected variant, a purely-visual quantity stepper (WhatsApp
 * remains the checkout mechanism — the selected quantity/variant are
 * included in the pre-filled message), and a solid commercial "Buy via
 * WhatsApp" button.
 *
 * Variant selection state is lifted to the parent (`selectedVariant` +
 * `onVariantChange`) so the product image gallery can stay in sync with
 * whichever variant is selected here.
 */
export default function BuyBox({
  product,
  productName,
  selectedVariant,
  onVariantChange,
}: {
  product: Product;
  productName: string;
  selectedVariant?: ProductVariant | null;
  onVariantChange?: (variant: ProductVariant) => void;
}) {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const variants = product.variants;
  const price = selectedVariant ? selectedVariant.price : product.price;
  const compareAtPrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const savingsPercent = getSavingsPercent({ price, compareAtPrice });
  const whatsappUrl = getProductWhatsAppUrl(productName, quantity, selectedVariant?.label);

  return (
    <div className="bg-white border border-subtle-gray rounded-[4px] shadow-none p-5 sm:p-6">
      <h1 className="font-serif font-light text-2xl sm:text-3xl text-dark-text mb-2">{productName}</h1>

      {typeof product.rating === "number" && (
        <a href="#reviews" className="inline-block mb-4 hover:opacity-80 transition-opacity">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
        </a>
      )}

      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-serif font-light text-3xl text-dark-text">{formatPrice(price)}</span>
        {compareAtPrice && (
          <span className="text-lg text-dark-text/40 line-through">
            {formatPrice(compareAtPrice)}
          </span>
        )}
      </div>
      {savingsPercent && (
        <span className="inline-block bg-sale-light text-sale-dark text-xs font-bold tracking-wide px-2.5 py-1 rounded-[2px] mb-4">
          {t("buyBox.save").replace("{percent}", String(savingsPercent))}
        </span>
      )}

      <div className="flex items-center gap-2 text-sm font-medium text-success mb-6">
        <span className="w-2 h-2 rounded-full bg-success" />
        {t("buyBox.inStock")}
      </div>

      {/* Variant selector */}
      {variants && variants.length > 0 && (
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wide text-dark-text/50 mb-2">
            {t("buyBox.size")}
          </label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onVariantChange?.(variant)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2 rounded-[2px] border text-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-dark-text text-white border-dark-text"
                      : "border-subtle-gray text-dark-text hover:border-dark-text"
                  }`}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity stepper */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-dark-text/50 mb-2">
          {t("buyBox.quantity")}
        </label>
        <div className="inline-flex items-center border border-subtle-gray rounded-md">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="w-10 h-10 flex items-center justify-center text-dark-text hover:bg-off-white transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-dark-text" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="Increase quantity"
            className="w-10 h-10 flex items-center justify-center text-dark-text hover:bg-off-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-dark w-full inline-flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        {t("buyBox.addToCart")}
      </a>

      <p className="mt-4 flex items-center gap-2 text-xs text-dark-text/60">
        <Truck className="w-4 h-4 text-accent-secondary shrink-0" strokeWidth={1.5} />
        <ShieldCheck className="w-4 h-4 text-accent-secondary shrink-0" strokeWidth={1.5} />
        {t("buyBox.trustLine")}
      </p>
    </div>
  );
}
