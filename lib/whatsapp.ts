/**
 * WhatsApp utility functions
 * 
 * TODO: Replace with Sanity CMS integration
 * This will allow the client to change the WhatsApp number via Sanity dashboard
 */

/**
 * Get the WhatsApp number
 * Currently reads from environment variable, but will be replaced with Sanity data
 *
 * No fallback number on purpose: the old number was decommissioned at the
 * client's request and a replacement hasn't been provided yet. Set
 * NEXT_PUBLIC_WHATSAPP_NUMBER once the new number is available.
 */
export function getWhatsAppNumber(): string {
  // For now, use environment variable; no default until the client supplies a new number
  // Later: fetch from Sanity CMS
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
}

/**
 * Get a clean WhatsApp number (digits only)
 */
export function getCleanWhatsAppNumber(): string {
  return getWhatsAppNumber().replace(/[^0-9]/g, "");
}

/**
 * Generate a WhatsApp URL with optional message
 * @param message - Optional pre-filled message
 * @returns WhatsApp URL
 */
export function getWhatsAppUrl(message?: string): string {
  const cleanNumber = getCleanWhatsAppNumber();
  
  if (!cleanNumber) {
    return "#";
  }

  const baseUrl = `https://wa.me/${cleanNumber}`;
  
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  
  return baseUrl;
}

/**
 * Fill a message template's {token} placeholders with the given values.
 * Unknown/missing tokens are replaced with an empty string rather than left
 * as a literal "{token}" in the outgoing message.
 */
export function fillWhatsAppTemplate(
  template: string,
  tokens: Record<string, string | number | undefined>
): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = tokens[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

/**
 * Generate a WhatsApp URL pre-filled with a product inquiry/order message
 * built from a template (the caller resolves which template to use — a
 * per-product/per-locale override from `data/products.json`, falling back
 * to a site-wide localized default translation — since this module has no
 * access to i18n or product content itself).
 *
 * Supported placeholders in `template`: {product} (name + variant, e.g.
 * "Gut Health Capsules (120 Capsules)"), {variant} (variant label alone,
 * empty string if none selected), {quantity}.
 *
 * @param template - The resolved message template
 * @param productName - The product's display name
 * @param variantLabel - Optional selected variant label (e.g. "120 Capsules")
 * @param quantity - Optional quantity (defaults to 1 for the {quantity} token)
 */
export function getProductWhatsAppUrl(
  template: string,
  productName: string,
  variantLabel?: string,
  quantity?: number
): string {
  const product = variantLabel ? `${productName} (${variantLabel})` : productName;
  const message = fillWhatsAppTemplate(template, {
    product,
    variant: variantLabel ?? "",
    quantity: quantity ?? 1,
  });
  return getWhatsAppUrl(message);
}

/**
 * Generate a WhatsApp URL pre-filled with a bundle inquiry message for buying
 * multiple products together (e.g. the "Buy Both & Save" offer).
 * @param template - The resolved message template; supports a {products} placeholder
 * @param productNames - Display names of the products in the bundle
 */
export function getBundleWhatsAppUrl(template: string, productNames: string[]): string {
  const message = fillWhatsAppTemplate(template, { products: productNames.join(" + ") });
  return getWhatsAppUrl(message);
}

/**
 * Open WhatsApp in a new window/tab
 * @param message - Optional pre-filled message
 */
export function openWhatsApp(message?: string): void {
  const url = getWhatsAppUrl(message);
  if (url !== "#") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

