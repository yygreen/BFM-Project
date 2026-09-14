import rss from "@astrojs/rss";
import { getPosts } from "../lib/blog";

// Feed for the blog. Drafts are already excluded by getPosts().
export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "buyflightmiles: Miles news & guides",
    description:
      "Program news, devaluations, sweet spots and practical guides for buying airline miles.",
    site: context.site ?? "https://buyflightmiles.com",
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${p.id}/`,
      categories: [p.data.category],
    })),
    customData: "<language>en-gb</language>",
  });
}
