import { describe, expect, it } from "vitest";
import { CORE_SITE_KEYWORDS, getHomepageKeywordList } from "@/lib/seo/site-keywords";

describe("site keywords", () => {
  it("keeps a core list of French terms", () => {
    const frCore = CORE_SITE_KEYWORDS.fr.join(" ").toLowerCase();
    expect(frCore).toContain("votre produit");
    expect(CORE_SITE_KEYWORDS.fr.length).toBeGreaterThan(0);
  });

  it("keeps a core list for every locale", () => {
    for (const locale of ["en", "fr", "it"] as const) {
      expect(CORE_SITE_KEYWORDS[locale].length).toBeGreaterThan(0);
    }
  });

  it("homepage meta list never drops below the core list length", () => {
    const list = getHomepageKeywordList("fr");
    expect(list.length).toBeGreaterThanOrEqual(CORE_SITE_KEYWORDS.fr.length);
  });
});
