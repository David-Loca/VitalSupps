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
 * Open WhatsApp in a new window/tab
 * @param message - Optional pre-filled message
 */
export function openWhatsApp(message?: string): void {
  const url = getWhatsAppUrl(message);
  if (url !== "#") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

