import { Octokit } from "@octokit/rest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import {
  adminReadsPreferGithub,
  isReadOnlyAdminFilesystem,
  READONLY_DEPLOY_GITHUB_MESSAGE,
  writeLocalAdminJsonFile,
} from "@/lib/admin/local-filesystem";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Product } from "@/lib/products";

export type {
  Product,
  ProductLocaleContent,
  ProductFaqItem,
  ProductSpecs,
  ProductReview,
  ProductVariant,
} from "@/lib/products";

/** Public reads use the bundled JSON (ISR/CDN). Admin reads prefer GitHub when configured. */
export type ProductReadOptions = {
  forAdmin?: boolean;
};

const PRODUCTS_DATA_PATH = "data/products.json";
const PRODUCT_LOCALES: Locale[] = locales;

/** GitHub is only required when calling product persistence APIs — not when importing types/helpers. */
function getGithubProductContext() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  const owner = repoFull?.split("/")[0];
  const repo = repoFull?.split("/")[1];
  const branch = process.env.GITHUB_BRANCH || "main";
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;
  if (!token || !owner || !repo || !email || !name) {
    throw new Error("Missing GitHub environment variables for product system.");
  }
  return {
    octokit: new Octokit({ auth: token }),
    owner,
    repo,
    branch,
    email,
    name,
  };
}

function hasGithubProductContext(): boolean {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;
  return Boolean(token && repoFull?.includes("/") && email && name);
}

async function writeLocalProductsFile(jsonContent: string): Promise<boolean> {
  return writeLocalAdminJsonFile(PRODUCTS_DATA_PATH, jsonContent);
}

async function getLocalProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), PRODUCTS_DATA_PATH);
    const content = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(content) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: unknown) {
    if ((error as { code?: string })?.code !== "ENOENT") {
      console.error("Error reading local products:", error);
    }
    return [];
  }
}

const getPublicProductsCached = cache(async (): Promise<Product[]> => {
  return getLocalProducts();
});

async function getGithubProducts(): Promise<Product[]> {
  const { octokit, owner, repo, branch } = getGithubProductContext();
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: PRODUCTS_DATA_PATH,
    ref: branch,
  });

  const data = response.data;
  if (
    response.status !== 200 ||
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !("content" in data)
  ) {
    return [];
  }

  const file = data as { content: string };
  if (typeof file.content !== "string") {
    return [];
  }

  const content = Buffer.from(file.content, "base64").toString("utf8");
  const parsed = JSON.parse(content) as Product[];
  return Array.isArray(parsed) ? parsed : [];
}

/**
 * Merge GitHub + local `data/products.json`. Since products don't carry an
 * `updatedAt` timestamp, local (freshly written on this instance) wins for
 * slugs it has; anything only present remotely is kept as-is.
 */
function mergeProductSources(remote: Product[], local: Product[]): Product[] {
  if (local.length === 0) return remote;
  if (remote.length === 0) return local;

  const bySlug = new Map<string, Product>();
  for (const product of remote) {
    bySlug.set(product.slug, product);
  }
  for (const product of local) {
    bySlug.set(product.slug, product);
  }
  return Array.from(bySlug.values());
}

export async function getAllProducts(options?: ProductReadOptions): Promise<Product[]> {
  if (!options?.forAdmin) {
    return getPublicProductsCached();
  }

  const local = await getLocalProducts();

  // Admin read-path must keep working even when GitHub env vars are missing.
  if (!hasGithubProductContext()) {
    return local;
  }

  if (adminReadsPreferGithub(true)) {
    try {
      return await getGithubProducts();
    } catch (error) {
      console.error("Error fetching products from GitHub:", error);
      return local;
    }
  }

  try {
    const remote = await getGithubProducts();
    return mergeProductSources(remote, local);
  } catch (error: unknown) {
    if ((error as { status?: number })?.status === 404) {
      return local;
    }
    console.error("Error fetching products from GitHub:", error);
    return local.length > 0 ? local : [];
  }
}

export async function getProductBySlug(
  slug: string,
  options?: ProductReadOptions
): Promise<Product | null> {
  const products = await getAllProducts(options);
  return products.find((p) => p.slug === slug) ?? null;
}

/**
 * Saves a product. `originalSlug` should be passed when editing an existing
 * product whose slug field was changed in the form, so the save can find and
 * replace the correct array entry (upsert is otherwise keyed by `product.slug`).
 */
export async function saveProduct(product: Product, originalSlug?: string): Promise<void> {
  const products = await getAllProducts({ forAdmin: true });
  const lookupSlug = originalSlug || product.slug;
  const existingIndex = products.findIndex((p) => p.slug === lookupSlug);

  const duplicate = products.some((p, idx) => p.slug === product.slug && idx !== existingIndex);
  if (duplicate) {
    throw new Error(
      `A product with slug "${product.slug}" already exists. Slugs must be unique.`
    );
  }

  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }

  const content = JSON.stringify(products, null, 2);
  const wroteLocal = await writeLocalProductsFile(content);

  // No GitHub configured (e.g. local dev): local write is the save, nothing more to do.
  if (!hasGithubProductContext()) {
    if (!wroteLocal && isReadOnlyAdminFilesystem()) {
      throw new Error(READONLY_DEPLOY_GITHUB_MESSAGE);
    }
    return;
  }

  try {
    const { octokit, owner, repo, branch, email, name } = getGithubProductContext();

    let sha: string | undefined;
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: PRODUCTS_DATA_PATH,
        ref: branch,
      });
      if (response.status === 200 && "sha" in response.data) {
        sha = response.data.sha;
      }
    } catch (error: unknown) {
      if ((error as { status?: number })?.status !== 404) throw error;
    }

    const productName = product.en?.name || product.slug;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: PRODUCTS_DATA_PATH,
      message: sha ? `Update product: ${productName}` : `Create product: ${productName}`,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch,
      committer: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
}

export async function deleteProduct(slug: string): Promise<void> {
  const products = await getAllProducts({ forAdmin: true });
  const filtered = products.filter((p) => p.slug !== slug);
  const content = JSON.stringify(filtered, null, 2);
  const wroteLocal = await writeLocalProductsFile(content);

  // No GitHub configured (e.g. local dev): local write is the delete, nothing more to do.
  if (!hasGithubProductContext()) {
    if (!wroteLocal && isReadOnlyAdminFilesystem()) {
      throw new Error(READONLY_DEPLOY_GITHUB_MESSAGE);
    }
    return;
  }

  try {
    const { octokit, owner, repo, branch, email, name } = getGithubProductContext();

    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: PRODUCTS_DATA_PATH,
      ref: branch,
    });

    if (response.status === 200 && "sha" in response.data) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: PRODUCTS_DATA_PATH,
        message: `Delete product: ${slug}`,
        content: Buffer.from(content).toString("base64"),
        sha: response.data.sha,
        branch,
        committer: {
          name,
          email,
        },
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ProductValidationResult =
  | { ok: true; product: Product }
  | { ok: false; error: string };

function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Validates a product payload against the fields the storefront depends on.
 * Mirrors the shape of `validateBlogForPublish` in `blog-locales.ts` for
 * consistency with the rest of the admin CMS.
 */
export function validateProductForPublish(product: Product): ProductValidationResult {
  if (!product || typeof product !== "object") {
    return { ok: false, error: "Invalid product payload." };
  }

  const slug = String(product.slug || "").trim();
  if (!slug) {
    return { ok: false, error: "Product slug is required." };
  }
  if (!isValidSlugFormat(slug)) {
    return {
      ok: false,
      error: "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-product).",
    };
  }

  for (const loc of PRODUCT_LOCALES) {
    const content = product[loc];
    if (!content) {
      return { ok: false, error: `Missing content for locale ${loc.toUpperCase()}.` };
    }
    if (!content.name?.trim()) {
      return { ok: false, error: `Name is required for ${loc.toUpperCase()}.` };
    }
    if (!content.tagline?.trim()) {
      return { ok: false, error: `Tagline is required for ${loc.toUpperCase()}.` };
    }
    if (!content.heroImageAlt?.trim()) {
      return { ok: false, error: `Hero image alt text is required for ${loc.toUpperCase()}.` };
    }
    if (!content.targetAudience?.trim()) {
      return { ok: false, error: `Target audience is required for ${loc.toUpperCase()}.` };
    }
    if (!content.usage?.trim()) {
      return { ok: false, error: `Usage instructions are required for ${loc.toUpperCase()}.` };
    }
    if (!Array.isArray(content.benefits) || content.benefits.filter((b) => b?.trim()).length === 0) {
      return { ok: false, error: `At least one benefit is required for ${loc.toUpperCase()}.` };
    }
    if (
      !Array.isArray(content.ingredients) ||
      content.ingredients.filter((i) => i?.trim()).length === 0
    ) {
      return { ok: false, error: `At least one ingredient is required for ${loc.toUpperCase()}.` };
    }
  }

  const hasPrimaryImage = Boolean(product.images?.primary?.trim());
  const hasVariantImage =
    Array.isArray(product.variants) &&
    product.variants.some((v) => Array.isArray(v.images) && v.images.some((img) => img?.trim()));
  if (!hasPrimaryImage && !hasVariantImage) {
    return {
      ok: false,
      error: "At least one image is required (primary image or a variant image).",
    };
  }

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const ids = product.variants.map((v) => String(v.id || "").trim());
    if (ids.some((id) => !id)) {
      return { ok: false, error: "All variants must have an id." };
    }
    const dupe = ids.find((id, idx) => ids.indexOf(id) !== idx);
    if (dupe) {
      return {
        ok: false,
        error: `Duplicate variant id "${dupe}" — variant ids must be unique within a product.`,
      };
    }
    const defaultCount = product.variants.filter((v) => v.isDefault).length;
    if (defaultCount > 1) {
      return { ok: false, error: "Only one variant can be marked as default." };
    }
  }

  return { ok: true, product: { ...product, slug } };
}
