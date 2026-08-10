import { getCollection } from "astro:content";

// ============================================================
//  Blog helpers — category slugs, listings, counts.
//  Categories are a fixed enum in content.config.ts, so the
//  slug map below is exhaustive by construction; adding a
//  category to the enum without adding it here is a type error.
// ============================================================

export const CATEGORIES = ["News", "Guide", "Valuations", "Transfers", "Sweet spots", "Devaluations"] as const;
export type Category = (typeof CATEGORIES)[number];

/** "Sweet spots" → "sweet-spots" */
export const categorySlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

/** Short blurb used on the category archive pages. */
export const CATEGORY_BLURB: Record<Category, string> = {
  News: "Programme changes as they happen — each one sourced, so you can check it.",
  Guide: "How buying miles works, and how to do it without getting caught out.",
  Valuations: "What a mile in each programme is actually worth, priced the way a trader prices it.",
  Transfers: "Moving miles between accounts and people — what it costs, and when a top-up beats a transfer.",
  "Sweet spots": "Redemptions where the miles stretch furthest — the ones worth buying for.",
  Devaluations: "When a programme raises its award prices, what it costs you, and whether booking sooner helps.",
};

/** Published posts (drafts excluded), newest first. */
export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Categories that actually have published posts, with counts. */
export async function getCategoryCounts() {
  const posts = await getPosts();
  return CATEGORIES.map((name) => ({
    name,
    slug: categorySlug(name),
    count: posts.filter((p) => p.data.category === name).length,
  })).filter((c) => c.count > 0);
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * Reading time in whole minutes, from the raw Markdown body. Strips frontmatter
 * leftovers, HTML comments, code fences and link syntax first so markup doesn't
 * inflate the count. Floor of 1.
 */
export function readingTime(body = ""): number {
  const text = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Posts that reference a given programme slug, newest first. */
export async function getPostsForProgram(slug: string) {
  const posts = await getPosts();
  return posts.filter((p) => p.data.programs.includes(slug));
}
