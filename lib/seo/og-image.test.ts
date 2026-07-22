import { describe, expect, it } from "vitest";
import {
  inferOgImageMimeType,
  optimizeImageForSocialShare,
  resolveAbsoluteImageUrl,
} from "./og-image";

const BASE = "https://example.com";

describe("resolveAbsoluteImageUrl", () => {
  it("resolves relative paths", () => {
    expect(resolveAbsoluteImageUrl("/blog-images/x.png", BASE)).toBe(
      `${BASE}/blog-images/x.png`
    );
  });

  it("keeps https URLs", () => {
    const url = "https://res.cloudinary.com/demo/image/upload/v1/a.jpg";
    expect(resolveAbsoluteImageUrl(url, BASE)).toBe(url);
  });

  it("falls back for blob URLs", () => {
    expect(resolveAbsoluteImageUrl("blob:http://localhost/x", BASE)).toBe(
      `${BASE}/images/hero.webp`
    );
  });
});

describe("inferOgImageMimeType", () => {
  it("detects png and jpeg", () => {
    expect(inferOgImageMimeType("https://x.com/a.png")).toBe("image/png");
    expect(inferOgImageMimeType("https://x.com/a.jpg")).toBe("image/jpeg");
    expect(inferOgImageMimeType("https://x.com/a.webp?v=1")).toBe("image/webp");
  });
});

describe("optimizeImageForSocialShare", () => {
  it("adds Cloudinary OG crop transform", () => {
    const input =
      "https://res.cloudinary.com/df5we7yoo/image/upload/v1778882855/blog-images/q.jpg";
    const out = optimizeImageForSocialShare(input);
    expect(out).toContain("w_1200,h_630,c_fill");
    expect(out).toContain("/upload/w_1200");
  });

  it("does not double-transform", () => {
    const input =
      "https://res.cloudinary.com/df5we7yoo/image/upload/w_1200,h_630,c_fill/v1/a.jpg";
    expect(optimizeImageForSocialShare(input)).toBe(input);
  });

  it("leaves non-Cloudinary URLs unchanged", () => {
    const local = `${BASE}/images/hero.png`;
    expect(optimizeImageForSocialShare(local)).toBe(local);
  });
});
