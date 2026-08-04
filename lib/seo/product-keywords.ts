import type { Locale } from "@/lib/i18n";
import { getProductBySlug, getProductContent } from "@/lib/products";

export type ProductKeywordSlug = "methylene-blue" | "gut-health";

/**
 * Hand-curated per-locale, per-product keyword lists for `<meta name="keywords">`
 * and JSON-LD `keywords`. Final, curated lists — do not auto-generate or append to these.
 */
export const PRODUCT_KEYWORDS: Record<Locale, Record<ProductKeywordSlug, string[]>> = {
  en: {
    "gut-health": [
      "buy gut health supplement",
      "best gut health supplement",
      "gut health supplement review",
      "probiotics for gut health",
      "digestive health supplement",
      "gut repair supplement",
      "gut supplement USA",
      "best probiotic supplement",
      "gut microbiome supplement",
      "official gut supplement",
      "digestive health capsules",
      "probiotic supplement review",
      "where to buy probiotics",
      "gut health capsules for bloating",
      "best probiotic for digestion",
      "probiotic and prebiotic supplement",
      "gut health supplement for women",
      "gut health supplement for men",
      "natural digestive enzyme supplement",
      "top rated gut health supplement",
    ],
    "methylene-blue": [
      "buy methylene blue",
      "pharmaceutical grade methylene blue",
      "methylene blue drops",
      "methylene blue supplement",
      "methylene blue USA",
      "methylene blue review",
      "best methylene blue",
      "methylene blue nootropic",
      "energy supplement alternative caffeine",
      "buy methylene blue drops",
      "best methylene blue drops",
      "methylene blue for focus",
      "methylene blue for energy",
      "methylene blue online",
      "USP grade methylene blue",
      "methylene blue tincture",
      "methylene blue for mental clarity",
      "where to buy methylene blue",
      "methylene blue capsules",
      "methylene blue dosage",
    ],
  },
  fr: {
    "gut-health": [
      "complément santé intestinale",
      "meilleur probiotique",
      "complément flore intestinale",
      "complément digestion",
      "réparer microbiote",
      "complément intestin",
      "acheter probiotique",
      "complément microbiote",
      "santé digestive",
      "probiotique puissant",
      "où acheter des probiotiques",
      "complément anti-ballonnements",
      "meilleur complément digestion",
      "probiotique et prébiotique",
      "gélules santé intestinale",
      "complément intestinal femme",
      "enzymes digestives naturelles",
      "meilleur complément flore intestinale",
    ],
    "methylene-blue": [
      "bleu de méthylène achat",
      "acheter bleu de méthylène",
      "bleu de méthylène énergie",
      "bleu de méthylène gouttes",
      "bleu de méthylène qualité pharmaceutique",
      "meilleur bleu de méthylène",
      "bleu de méthylène complément",
      "bleu de méthylène en ligne",
      "où acheter du bleu de méthylène",
      "bleu de méthylène concentration",
      "bleu de méthylène qualité USP",
      "gouttes de bleu de méthylène avis",
      "bleu de méthylène posologie",
    ],
  },
  es: {
    "gut-health": [
      "suplemento salud intestinal",
      "probióticos",
      "mejor probiótico",
      "comprar probióticos",
      "suplemento digestivo",
      "microbiota intestinal",
      "suplemento flora intestinal",
      "salud digestiva",
      "probiótico potente",
      "suplemento intestino",
      "dónde comprar probióticos",
      "mejor suplemento digestivo",
      "cápsulas salud intestinal",
      "probiótico y prebiótico",
      "suplemento intestinal para mujeres",
      "enzimas digestivas naturales",
      "suplemento contra la hinchazón",
    ],
    "methylene-blue": [
      "azul de metileno comprar",
      "azul de metileno gotas",
      "azul de metileno suplemento",
      "azul de metileno energía",
      "azul de metileno farmacéutico",
      "mejor azul de metileno",
      "azul de metileno online",
      "dónde comprar azul de metileno",
      "azul de metileno grado USP",
      "azul de metileno para concentración",
      "azul de metileno dosis",
      "azul de metileno opiniones",
    ],
  },
  de: {
    "gut-health": [
      "Darmgesundheit Supplement",
      "Probiotika kaufen",
      "bestes Probiotikum",
      "Darmflora aufbauen",
      "Darmflora Supplement",
      "Verdauung Supplement",
      "Darmgesundheit Kapseln",
      "Mikrobiom Supplement",
      "Darm Reparatur Supplement",
      "Probiotika kaufen wo",
      "bestes Verdauungssupplement",
      "Probiotikum gegen Blähungen",
      "Prä- und Probiotikum Kapseln",
      "Darmgesundheit Supplement für Frauen",
      "natürliche Verdauungsenzyme",
    ],
    "methylene-blue": [
      "Methylenblau kaufen",
      "Methylenblau Tropfen",
      "Methylenblau Deutschland",
      "Methylenblau pharma Qualität",
      "Methylenblau Energie",
      "Methylenblau Supplement",
      "Methylenblau online kaufen",
      "wo Methylenblau kaufen",
      "Methylenblau USP Qualität",
      "Methylenblau für Konzentration",
      "Methylenblau Dosierung",
      "Methylenblau Erfahrungen",
    ],
  },
};

function isProductKeywordSlug(slug: string): slug is ProductKeywordSlug {
  return slug === "methylene-blue" || slug === "gut-health";
}

/**
 * Full keyword list for a product page: the curated per-locale keyword list
 * plus the product's own localized display name and "VitalSupps", deduped.
 */
export function getProductKeywords(slug: string, locale: Locale): string[] {
  const base = isProductKeywordSlug(slug) ? PRODUCT_KEYWORDS[locale][slug] : [];

  const extra: string[] = [];
  const product = getProductBySlug(slug);
  if (product) {
    extra.push(getProductContent(product, locale).name);
  }
  extra.push("VitalSupps");

  const seen = new Set<string>();
  const result: string[] = [];
  for (const kw of [...base, ...extra]) {
    const key = kw.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(kw);
    }
  }
  return result;
}
