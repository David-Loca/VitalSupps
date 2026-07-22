/**
 * GitHub API integration for admin dashboard
 * Handles file operations and commits
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { locales as siteLocales } from "@/lib/i18n";
import {
  adminReadsPreferGithub,
  isReadOnlyAdminFilesystem,
  READONLY_DEPLOY_GITHUB_MESSAGE,
  writeLocalAdminJsonFile,
} from "./local-filesystem";

interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  content: string;
}

interface CommitFileParams {
  path: string;
  content: string; // Can be base64 (for images) or text (for JSON)
  message: string;
  sha?: string;
  isBase64?: boolean; // Flag to indicate if content is already base64
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Get GitHub configuration from environment
 */
function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;

  if (!token || !repo || !email || !name) {
    throw new Error('Missing required GitHub configuration');
  }

  return { token, repo, branch, email, name };
}

/**
 * Get file content from GitHub
 */
export async function getFileFromGitHub(filePath: string): Promise<GitHubFileContent> {
  const { token, repo, branch } = getGitHubConfig();
  
  const url = `${GITHUB_API_BASE}/repos/${repo}/contents/${filePath}?ref=${branch}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    name: data.name,
    path: data.path,
    sha: data.sha,
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
  };
}

/**
 * Update file on GitHub
 */
function isGithubNotFoundError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("404") || message.includes("Not Found");
}

export async function updateFileOnGitHub(params: CommitFileParams): Promise<string> {
  const { token, repo, branch, email, name } = getGitHubConfig();
  
  const url = `${GITHUB_API_BASE}/repos/${repo}/contents/${params.path}`;
  
  // If content is already base64 (for binary files like images), use it directly
  // Otherwise, encode to base64
  let contentBase64: string;
  if (params.isBase64 || params.path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    // For images or explicitly marked as base64, use content as-is
    contentBase64 = params.content;
  } else {
    // For text files, encode to base64
    contentBase64 = Buffer.from(params.content, 'utf-8').toString('base64');
  }
  
  const body: any = {
    message: params.message,
    content: contentBase64,
    branch,
    committer: {
      name,
      email,
    },
    author: {
      name,
      email,
    },
  };

  // If SHA is provided, it's an update operation
  if (params.sha) {
    body.sha = params.sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update file: ${error.message || response.statusText}`);
  }

  const data = (await response.json()) as { content?: { sha?: string } };
  return data.content?.sha ?? "";
}

function translationFilePath(locale: string): string {
  return `lib/i18n/translations/${locale}.json`;
}

async function readLocalTranslationFile(locale: string): Promise<Record<string, unknown> | null> {
  try {
    const absolute = path.join(process.cwd(), translationFilePath(locale));
    const raw = await fs.readFile(absolute, "utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function writeLocalTranslationFile(
  locale: string,
  jsonContent: string
): Promise<boolean> {
  return writeLocalAdminJsonFile(translationFilePath(locale), jsonContent);
}

async function fetchGithubSha(filePath: string): Promise<string> {
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

/** @deprecated Use hasGithubAdminContext */
export const hasGithubBlogContext = hasGithubAdminContext;

export function hasGithubAdminContext(): boolean {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPO;
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;
  return Boolean(token && repoFull?.includes("/") && email && name);
}

/**
 * Get translation file — prefers local repo JSON (matches dev site), keeps GitHub sha for saves.
 */
export async function getTranslationFile(locale: string): Promise<{
  content: Record<string, unknown>;
  sha: string;
  path: string;
}> {
  const filePath = translationFilePath(locale);

  if (adminReadsPreferGithub(hasGithubAdminContext())) {
    try {
      const file = await getFileFromGitHub(filePath);
      return {
        content: JSON.parse(file.content) as Record<string, unknown>,
        sha: file.sha,
        path: file.path,
      };
    } catch (error) {
      if (!isGithubNotFoundError(error)) {
        throw error;
      }
    }
  }

  const localContent = await readLocalTranslationFile(locale);
  const sha = await fetchGithubSha(filePath);

  if (localContent) {
    return {
      content: localContent,
      sha,
      path: filePath,
    };
  }

  const file = await getFileFromGitHub(filePath);
  return {
    content: JSON.parse(file.content) as Record<string, unknown>,
    sha: file.sha,
    path: file.path,
  };
}

/**
 * Update translation file — writes local JSON when writable, then GitHub when configured.
 */
export async function updateTranslationFile(
  locale: string,
  content: Record<string, unknown>,
  sha: string
): Promise<{ sha: string }> {
  const filePath = translationFilePath(locale);
  const jsonContent = JSON.stringify(content, null, 2);

  const wroteLocal = await writeLocalTranslationFile(locale, jsonContent);

  if (!hasGithubAdminContext()) {
    if (!wroteLocal && isReadOnlyAdminFilesystem()) {
      throw new Error(READONLY_DEPLOY_GITHUB_MESSAGE);
    }
    return { sha: "" };
  }

  let remoteSha = sha;
  if (!remoteSha) {
    remoteSha = await fetchGithubSha(filePath);
  }

  const commit = async (fileSha: string | undefined) =>
    updateFileOnGitHub({
      path: filePath,
      content: jsonContent,
      message: `Update ${locale} translations via admin dashboard`,
      sha: fileSha,
    });

  try {
    const newSha = await commit(remoteSha || undefined);
    return { sha: newSha || remoteSha };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isStaleSha =
      /sha/i.test(message) && (/does not match/i.test(message) || /409/.test(message));
    if (!isStaleSha) {
      throw error;
    }
    const freshSha = await fetchGithubSha(filePath);
    const newSha = await commit(freshSha || undefined);
    return { sha: newSha || freshSha };
  }
}

/**
 * Get all translation files
 */
export async function getAllTranslations(): Promise<Record<string, any>> {
  const locales: string[] = [...siteLocales];
  const translations: Record<string, any> = {};

  for (const locale of locales) {
    try {
      const data = await getTranslationFile(locale);
      translations[locale] = data;
    } catch (error) {
      console.error(`Failed to fetch ${locale} translations:`, error);
      const fallback = await readLocalTranslationFile(locale);
      if (fallback) {
        translations[locale] = {
          content: fallback,
          sha: "",
          path: translationFilePath(locale),
        };
      }
    }
  }

  return translations;
}

/**
 * Verify GitHub token
 */
export async function verifyGitHubToken(): Promise<boolean> {
  try {
    const { token, repo } = getGitHubConfig();
    
    const url = `${GITHUB_API_BASE}/repos/${repo}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

