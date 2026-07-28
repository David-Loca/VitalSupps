/**
 * WhatsApp utility functions
 * 
 * TODO: Replace with Sanity CMS integration
 * This will allow the client to change the WhatsApp number via Sanity dashboard
 */

/**
 * Get the WhatsApp number
 * Currently reads from environment variable, but will be replaced with Sanity data
 */
export function getWhatsAppNumber(): string {
  // For now, use environment variable with fallback to default number
  // Later: fetch from Sanity CMS
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447727896626";
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
 * Generate a WhatsApp URL pre-filled with a product inquiry message.
 * @param productName - The product's display name
 * @param quantity - Optional quantity to include in the pre-filled message (e.g. from a buy box quantity stepper)
 * @param variantLabel - Optional selected variant label (e.g. "120 Capsules") to include in the pre-filled message
 */
export function getProductWhatsAppUrl(
  productName: string,
  quantity?: number,
  variantLabel?: string
): string {
  const productDescriptor = `${productName}${variantLabel ? ` (${variantLabel})` : ""}`;
  if (quantity && quantity > 1) {
    return getWhatsAppUrl(
      `Hi, I'd like to order ${quantity}x ${productDescriptor}. Can you help me complete my purchase?`
    );
  }
  return getWhatsAppUrl(`Hi, I'm interested in ${productDescriptor}. Can you tell me more?`);
}

/**
 * Generate a WhatsApp URL pre-filled with a bundle inquiry message for buying
 * multiple products together (e.g. the "Buy Both & Save" offer).
 * @param productNames - Display names of the products in the bundle
 */
export function getBundleWhatsAppUrl(productNames: string[]): string {
  return getWhatsAppUrl(
    `Hi, I'm interested in the bundle deal: ${productNames.join(" + ")}. Can you tell me more?`
  );
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

