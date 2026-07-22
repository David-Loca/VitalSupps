/**
 * Upload data/blogs.json to GitHub (same path admin saves use).
 * Requires GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, GITHUB_EMAIL, GITHUB_NAME in .env
 *
 * Usage: node scripts/push-blogs-to-github.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_PATH = join(__dirname, "../data/blogs.json");
const GITHUB_API = "https://api.github.com";

function loadEnv() {
  try {
    const envPath = join(__dirname, "../.env");
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env */
  }
}

async function main() {
  loadEnv();
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const email = process.env.GITHUB_EMAIL;
  const name = process.env.GITHUB_NAME;

  if (!token || !repo || !email || !name) {
    console.error("Missing GITHUB_* env vars. Set them in .env first.");
    process.exit(1);
  }

  const content = readFileSync(BLOGS_PATH, "utf8");
  JSON.parse(content);
  const path = "data/blogs.json";
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${branch}`;

  let sha;
  const getRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  } else if (getRes.status !== 404) {
    throw new Error(`GitHub GET failed: ${getRes.status} ${await getRes.text()}`);
  }

  const putRes = await fetch(url.replace(`?ref=${branch}`, ""), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Sync blogs.json with Canada (ca) locale content",
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      sha,
      committer: { name, email },
    }),
  });

  if (!putRes.ok) {
    console.error(await putRes.text());
    process.exit(1);
  }

  const caCount = JSON.parse(content).filter((b) =>
    (b.translations || []).includes("ca")
  ).length;
  console.log(`Pushed data/blogs.json to ${repo}@${branch} (${caCount} posts with ca).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
