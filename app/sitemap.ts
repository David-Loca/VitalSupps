import { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/admin/blog";
import { getSiteBaseUrl } from "@/lib/seo/og-image";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();

  try {
    const blogs = await getAllBlogs();
    return buildSitemapEntries(baseUrl, blogs);
  } catch (error) {
    console.error("Error building sitemap (blogs omitted):", error);
    return buildSitemapEntries(baseUrl, []);
  }
}
