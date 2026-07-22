import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const root = path.join(projectRoot, "blog-export-for-cursor");
const postsDir = path.join(root, "posts");
fs.mkdirSync(postsDir, { recursive: true });

const blogsPath = path.join(projectRoot, "data", "blogs.json");
const blogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
if (!Array.isArray(blogs)) {
  throw new Error("blogs.json must be a JSON array");
}

function slugOf(b) {
  const s = b.slug;
  if (typeof s === "string") return s || b.id;
  return s?.en || s?.fr || s?.es || Object.values(s || {}).find(Boolean) || b.id;
}

function titleOf(b) {
  const loc = b.locale || "en";
  const t = b.title;
  return t?.[loc] || t?.en || Object.values(t || {}).find(Boolean) || "(no title)";
}

const manifest = blogs.map((b) => ({
  id: b.id,
  file: `posts/${b.id}.json`,
  slugHint: slugOf(b),
  primaryLocale: b.locale,
  title: titleOf(b),
  publishedAt: b.publishedAt,
}));

manifest.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

for (const blog of blogs) {
  const file = path.join(postsDir, `${blog.id}.json`);
  fs.writeFileSync(file, `${JSON.stringify(blog, null, 2)}\n`, "utf8");
}

fs.writeFileSync(
  path.join(root, "manifest.json"),
  `${JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      sourceRepo: "site-base",
      postCount: blogs.length,
      posts: manifest,
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log(`Wrote ${blogs.length} posts to ${postsDir}`);
