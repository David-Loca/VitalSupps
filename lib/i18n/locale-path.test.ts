import { describe, expect, it } from "vitest";
import {
  buildLocalizedPath,
  fixDuplicateLocalePath,
  getLocaleFromPathname,
  stripLocalePrefix,
} from "./locale-path";

describe("locale-path", () => {
  it("reads fr from pathname", () => {
    expect(getLocaleFromPathname("/fr/")).toBe("fr");
    expect(getLocaleFromPathname("/fr/blog/test/")).toBe("fr");
  });

  it("strips fr locale prefix", () => {
    expect(stripLocalePrefix("/fr/")).toBe("/");
    expect(stripLocalePrefix("/fr/blog/my-post/")).toBe("/blog/my-post");
  });

  it("strips stacked locale prefixes", () => {
    expect(stripLocalePrefix("/fr/fr/")).toBe("/");
    expect(stripLocalePrefix("/fr/fr/blog/post/")).toBe("/blog/post");
  });

  it("builds localized paths", () => {
    expect(buildLocalizedPath("fr", "/fr/")).toBe("/fr/");
    expect(buildLocalizedPath("fr", "/blog/foo")).toBe("/fr/blog/foo/");
  });

  it("reads en from pathname and builds en paths", () => {
    expect(getLocaleFromPathname("/en/")).toBe("en");
    expect(getLocaleFromPathname("/en/blog/test/")).toBe("en");
    expect(stripLocalePrefix("/en/blog/my-post/")).toBe("/blog/my-post");
    expect(buildLocalizedPath("en", "/blog/foo")).toBe("/en/blog/foo/");
  });

  it("fixes duplicate locale URLs", () => {
    expect(fixDuplicateLocalePath("/fr/fr/")).toBe("/fr/");
    expect(fixDuplicateLocalePath("/fr/fr/blog/slug/")).toBe("/fr/blog/slug/");
  });
});
