import fs from "fs/promises";
import path from "path";

export const READONLY_DEPLOY_GITHUB_MESSAGE =
  "Saving changes on production requires GitHub admin credentials (GITHUB_TOKEN, GITHUB_REPO, GITHUB_EMAIL, GITHUB_NAME).";

/** Serverless hosts (e.g. Vercel) mount the app bundle read-only under /var/task. */
export function isReadOnlyAdminFilesystem(): boolean {
  if (process.env.ADMIN_ALLOW_LOCAL_WRITES === "true") {
    return false;
  }

  return Boolean(
    process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );
}

export function isReadOnlyFilesystemError(error: unknown): boolean {
  const err = error as NodeJS.ErrnoException;
  return err?.code === "EROFS" || err?.code === "EPERM" || err?.code === "EACCES";
}

/** On serverless, bundled JSON is stale until redeploy — admin reads should use GitHub. */
export function adminReadsPreferGithub(hasGithub: boolean): boolean {
  return isReadOnlyAdminFilesystem() && hasGithub;
}

/** Returns true when the file was written locally, false when skipped or read-only. */
export async function writeLocalAdminJsonFile(
  relativePath: string,
  jsonContent: string
): Promise<boolean> {
  if (isReadOnlyAdminFilesystem()) {
    return false;
  }

  const absolute = path.join(process.cwd(), relativePath);
  try {
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    await fs.writeFile(absolute, `${jsonContent}\n`, "utf8");
    return true;
  } catch (error) {
    if (isReadOnlyFilesystemError(error)) {
      return false;
    }
    throw error;
  }
}
