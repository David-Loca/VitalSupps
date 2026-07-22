/**
 * Metadata management for page titles and descriptions
 * Handles SEO metadata for all pages in all languages
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { locales as siteLocales } from "@/lib/i18n";
import {
  getFileFromGitHub,
  hasGithubAdminContext,
  updateFileOnGitHub,
} from "./github";
import {
  adminReadsPreferGithub,
  isReadOnlyAdminFilesystem,
  READONLY_DEPLOY_GITHUB_MESSAGE,
  writeLocalAdminJsonFile,
} from "./local-filesystem";

export interface PageMetadata {
  title: string;
  description: string;
}

export interface MetadataContent {
  homepage: PageMetadata;
  blog: PageMetadata;
  blogListing: PageMetadata;
  legal: {
    refundPolicy: PageMetadata;
    privacyPolicy: PageMetadata;
    termsOfService: PageMetadata;
  };
}

function mergePageMetadataDefaults<T>(defaults: T, incoming: any): T {
  if (!incoming || typeof incoming !== 'object') return defaults;

  // Shallow merge at each level is enough here because all leaves are PageMetadata objects
  return {
    ...(defaults as any),
    ...(incoming as any),
    homepage: { ...(defaults as any).homepage, ...(incoming as any).homepage },
    blog: { ...(defaults as any).blog, ...(incoming as any).blog },
    blogListing: { ...(defaults as any).blogListing, ...(incoming as any).blogListing },
    legal: {
      ...(defaults as any).legal,
      ...(incoming as any).legal,
      refundPolicy: { ...(defaults as any).legal?.refundPolicy, ...(incoming as any).legal?.refundPolicy },
      privacyPolicy: { ...(defaults as any).legal?.privacyPolicy, ...(incoming as any).legal?.privacyPolicy },
      termsOfService: { ...(defaults as any).legal?.termsOfService, ...(incoming as any).legal?.termsOfService },
    },
  } as T;
}

function metadataFilePath(locale: string): string {
  return `data/metadata/${locale}.json`;
}

async function readLocalMetadataFile(locale: string): Promise<MetadataContent | null> {
  try {
    const absolute = path.join(process.cwd(), metadataFilePath(locale));
    const raw = await fs.readFile(absolute, "utf8");
    return JSON.parse(raw) as MetadataContent;
  } catch {
    return null;
  }
}

async function writeLocalMetadataFile(
  locale: string,
  jsonContent: string
): Promise<boolean> {
  return writeLocalAdminJsonFile(metadataFilePath(locale), jsonContent);
}

async function fetchMetadataGithubSha(filePath: string): Promise<string> {
  if (!hasGithubAdminContext()) {
    return "";
  }
  try {
    const file = await getFileFromGitHub(filePath);
    return file.sha;
  } catch {
    return "";
  }
}

/**
 * Get metadata file for a locale (local repo JSON first — matches what the site reads)
 */
function isGithubNotFoundError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("404") || message.includes("Not Found");
}

export async function getMetadataFile(locale: string): Promise<{
  content: MetadataContent;
  sha: string;
  path: string;
}> {
  const filePath = metadataFilePath(locale);
  const defaults = getDefaultMetadata(locale);

  if (adminReadsPreferGithub(hasGithubAdminContext())) {
    try {
      const file = await getFileFromGitHub(filePath);
      const parsed = JSON.parse(file.content);
      return {
        content: mergePageMetadataDefaults<MetadataContent>(defaults, parsed),
        sha: file.sha,
        path: file.path,
      };
    } catch (error: unknown) {
      if (!isGithubNotFoundError(error)) {
        throw error;
      }
    }
  }

  const sha = await fetchMetadataGithubSha(filePath);
  const local = await readLocalMetadataFile(locale);

  if (local) {
    return {
      content: mergePageMetadataDefaults<MetadataContent>(defaults, local),
      sha,
      path: filePath,
    };
  }

  try {
    const file = await getFileFromGitHub(filePath);
    const parsed = JSON.parse(file.content);
    return {
      content: mergePageMetadataDefaults<MetadataContent>(defaults, parsed),
      sha: file.sha,
      path: file.path,
    };
  } catch (error: unknown) {
    if (isGithubNotFoundError(error)) {
      return {
        content: defaults,
        sha: "",
        path: filePath,
      };
    }
    throw error;
  }
}

/**
 * Update metadata file
 */
export async function updateMetadataFile(
  locale: string,
  content: MetadataContent,
  sha: string
): Promise<{ sha: string; content: MetadataContent }> {
  const filePath = metadataFilePath(locale);
  const normalized = mergePageMetadataDefaults<MetadataContent>(
    getDefaultMetadata(locale),
    content
  );
  const jsonContent = JSON.stringify(normalized, null, 2);

  const wroteLocal = await writeLocalMetadataFile(locale, jsonContent);

  if (!hasGithubAdminContext()) {
    if (!wroteLocal && isReadOnlyAdminFilesystem()) {
      throw new Error(READONLY_DEPLOY_GITHUB_MESSAGE);
    }
    return { sha: "", content: normalized };
  }

  let remoteSha = sha;
  if (!remoteSha) {
    remoteSha = await fetchMetadataGithubSha(filePath);
  }

  const commit = async (fileSha: string | undefined) =>
    updateFileOnGitHub({
      path: filePath,
      content: jsonContent,
      message: `Update ${locale} page metadata via admin dashboard`,
      sha: fileSha,
    });

  try {
    const newSha = await commit(remoteSha || undefined);
    return { sha: newSha || remoteSha, content: normalized };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isStaleSha =
      /sha/i.test(message) && (/does not match/i.test(message) || /409/.test(message));
    if (!isStaleSha) {
      throw error;
    }
    const freshSha = await fetchMetadataGithubSha(filePath);
    const newSha = await commit(freshSha || undefined);
    return { sha: newSha || freshSha, content: normalized };
  }
}

/**
 * Get all metadata files
 */
export async function getAllMetadata(): Promise<Record<string, {
  content: MetadataContent;
  sha: string;
  path: string;
}>> {
  const locales: string[] = [...siteLocales];
  const metadata: Record<string, any> = {};

  for (const locale of locales) {
    try {
      const data = await getMetadataFile(locale);
      metadata[locale] = data;
    } catch (error) {
      console.error(`Failed to fetch ${locale} metadata:`, error);
      // Use default if fetch fails
      metadata[locale] = {
        content: getDefaultMetadata(locale),
        sha: '',
        path: `data/metadata/${locale}.json`,
      };
    }
  }

  return metadata;
}

/**
 * Get default metadata structure for a locale.
 * Generic placeholder copy — replace with real product copy per locale.
 */
export function getDefaultMetadata(locale: string): MetadataContent {
  const defaults: Record<string, MetadataContent> = {
    en: {
      homepage: {
        title: "Your Site Name | Home",
        description: "Generic site description — to be replaced with real content.",
      },
      blog: {
        title: "Blog | Your Site Name",
        description: "News, guides and tips.",
      },
      blogListing: {
        title: "Blog | Latest Articles",
        description: "Browse our collection of articles.",
      },
      legal: {
        refundPolicy: {
          title: "Refund Policy | Your Site Name",
          description: "Read Your Site Name's refund policy.",
        },
        privacyPolicy: {
          title: "Privacy Policy | Your Site Name",
          description: "Learn how Your Site Name collects, uses, and protects your personal data.",
        },
        termsOfService: {
          title: "Terms of Service | Your Site Name",
          description: "Read the terms and conditions for using Your Site Name's services.",
        },
      },
    },
    fr: {
      homepage: {
        title: "Your Site Name | Accueil",
        description: "Description générique du site — à remplacer par le contenu réel.",
      },
      blog: {
        title: "Blog | Your Site Name",
        description: "Actualités, guides et conseils.",
      },
      blogListing: {
        title: "Blog | Derniers Articles",
        description: "Parcourez notre collection d'articles.",
      },
      legal: {
        refundPolicy: {
          title: "Politique de Remboursement | Your Site Name",
          description: "Consultez la politique de remboursement de Your Site Name.",
        },
        privacyPolicy: {
          title: "Politique de Confidentialité | Your Site Name",
          description: "Découvrez comment Your Site Name collecte, utilise et protège vos données personnelles.",
        },
        termsOfService: {
          title: "Conditions d'Utilisation | Your Site Name",
          description: "Consultez les conditions d'utilisation des services Your Site Name.",
        },
      },
    },
    it: {
      homepage: {
        title: "Your Site Name | Home",
        description: "Descrizione generica del sito — da sostituire con contenuti reali.",
      },
      blog: {
        title: "Blog | Your Site Name",
        description: "Notizie, guide e consigli.",
      },
      blogListing: {
        title: "Blog | Ultimi Articoli",
        description: "Sfoglia la nostra raccolta di articoli.",
      },
      legal: {
        refundPolicy: {
          title: "Politica di Rimborso | Your Site Name",
          description: "Consulta la politica di rimborso di Your Site Name.",
        },
        privacyPolicy: {
          title: "Informativa sulla Privacy | Your Site Name",
          description: "Scopri come Your Site Name raccoglie, utilizza e protegge i tuoi dati personali.",
        },
        termsOfService: {
          title: "Termini di Servizio | Your Site Name",
          description: "Consulta i termini e le condizioni per l'utilizzo dei servizi Your Site Name.",
        },
      },
    },
  };

  return defaults[locale] || defaults.en;
}
