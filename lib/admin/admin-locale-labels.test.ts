import { describe, expect, it } from "vitest";
import {
  ADMIN_BLOG_LOCALE_LABELS,
  getBlogSlugPlaceholder,
} from "./admin-locale-labels";

describe("admin-locale-labels", () => {
  it("labels fr as French", () => {
    expect(ADMIN_BLOG_LOCALE_LABELS.fr).toBe("French");
  });

  it("uses the French slug placeholder for fr", () => {
    expect(getBlogSlugPlaceholder("fr")).toBe("mon-article");
  });

  it("labels en as English", () => {
    expect(ADMIN_BLOG_LOCALE_LABELS.en).toBe("English");
  });

  it("uses the English slug placeholder for en", () => {
    expect(getBlogSlugPlaceholder("en")).toBe("my-article");
  });
});
