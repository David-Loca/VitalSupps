export interface BlogBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "list";
  content: string | Record<string, string>;
  level?: number;
  imageUrl?: string;
  imageAlt?: string | Record<string, string>;
  imageWidth?: "full" | "half" | "third" | "quarter";
  imageAlign?: "left" | "center" | "right";
  listItems?: string[] | Record<string, string[]>;
  style?: {
    textAlign?: "left" | "center" | "right";
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string | Record<string, string>;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  featuredImage?: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  locale: string;
  translations?: string[];
  blocks: BlogBlock[];
  meta?: {
    description?: Record<string, string>;
    keywords?: Record<string, string>;
  };
}
