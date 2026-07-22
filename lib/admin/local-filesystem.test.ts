import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  adminReadsPreferGithub,
  isReadOnlyAdminFilesystem,
  isReadOnlyFilesystemError,
} from "./local-filesystem";

describe("local-filesystem", () => {
  const envKeys = [
    "VERCEL",
    "VERCEL_ENV",
    "AWS_LAMBDA_FUNCTION_NAME",
    "NETLIFY",
    "ADMIN_ALLOW_LOCAL_WRITES",
  ] as const;

  const originalEnv: Partial<Record<(typeof envKeys)[number], string | undefined>> =
    {};

  beforeEach(() => {
    for (const key of envKeys) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of envKeys) {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    }
  });

  it("detects Vercel as read-only", () => {
    process.env.VERCEL = "1";
    expect(isReadOnlyAdminFilesystem()).toBe(true);
  });

  it("allows local writes when explicitly enabled", () => {
    process.env.VERCEL = "1";
    process.env.ADMIN_ALLOW_LOCAL_WRITES = "true";
    expect(isReadOnlyAdminFilesystem()).toBe(false);
  });

  it("recognizes EROFS errors", () => {
    expect(isReadOnlyFilesystemError({ code: "EROFS" })).toBe(true);
    expect(isReadOnlyFilesystemError({ code: "ENOENT" })).toBe(false);
  });

  it("prefers GitHub reads on Vercel when GitHub is configured", () => {
    process.env.VERCEL = "1";
    expect(adminReadsPreferGithub(true)).toBe(true);
    expect(adminReadsPreferGithub(false)).toBe(false);
  });
});
