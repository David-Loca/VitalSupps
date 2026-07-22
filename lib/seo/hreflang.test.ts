import { describe, expect, it } from "vitest";
import {
  buildHreflangAlternates,
  buildHomepageHreflangAlternates,
  buildLegalHreflangAlternates,
  hreflangByLocale,
} from "@/lib/seo/hreflang";

describe("hreflang", () => {
  it("maps internal fr route to fr-FR", () => {
    expect(hreflangByLocale.fr).toBe("fr-FR");
  });

  it("maps internal en route to en-US", () => {
    expect(hreflangByLocale.en).toBe("en-US");
  });

  it("builds homepage alternates with BCP 47 keys", () => {
    const alt = buildHomepageHreflangAlternates("https://example.com", "/");
    expect(alt["fr-FR"]).toBe("https://example.com/fr/");
    expect(alt["en-US"]).toBe("https://example.com/en/");
    expect(alt["x-default"]).toBe("https://example.com/en/");
  });

  it("supports partial locale maps for blog posts", () => {
    const alt = buildHreflangAlternates(
      {
        fr: "https://example.com/fr/blog/post/",
      },
      "https://example.com/fr/blog/post/"
    );
    expect(alt["fr-FR"]).toContain("/fr/blog/");
    expect(alt["x-default"]).toContain("/fr/blog/");
    expect(Object.keys(alt)).toEqual(["fr-FR", "x-default"]);
  });

  it("builds legal hreflang with localized slug for fr", () => {
    const getLegalUrl = (slug: string, loc: string) =>
      `/${loc}/${slug === "privacy-policy" && loc === "fr" ? "politique-de-confidentialite" : slug}/`;
    const alt = buildLegalHreflangAlternates(
      "https://example.com",
      "privacy-policy",
      getLegalUrl as (englishSlug: string, locale: import("@/lib/i18n").Locale) => string
    );
    expect(alt["fr-FR"]).toBe("https://example.com/fr/politique-de-confidentialite/");
  });
});
