import { describe, expect, it } from "vitest";
import { JSON_LD_KEYWORD_MAX, keywordsForJsonLd } from "@/lib/seo/json-ld-limits";

describe("json-ld keyword limits", () => {
  it("caps structured-data keywords for Google quality signals", () => {
    const many = Array.from({ length: 200 }, (_, i) => `keyword ${i}`);
    const capped = keywordsForJsonLd(many);
    expect(capped.length).toBe(JSON_LD_KEYWORD_MAX);
  });
});
