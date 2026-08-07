import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

// ============================================================
//  Airline programs — schema-validated content collection.
//  The single source of truth still lives in one file
//  (src/data/airlines.json); this schema validates every entry
//  at BUILD TIME, so a missing pricePerMile, a bad slug, an
//  unknown alliance, or max < min fails `npm run build` with a
//  clear error instead of shipping a broken page.
//
//  pricePerMile is in CENTS. The "$ per 1,000" figure is derived
//  (× 10) in templates — don't store both.
//  priceVerified / deliveryVerified replace the old // PLACEHOLDER
//  comments: false = needs a real, confirmed value before launch.
// ============================================================

const sweetSpot = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
});

const airlines = defineCollection({
  loader: file("src/data/airlines.json"),
  schema: z
    .object({
      // display order on the homepage / agents grid (lowest first)
      order: z.number().int().nonnegative(),

      program: z.string().min(1),
      airline: z.string().min(1),
      alliance: z.enum(["Star Alliance", "Oneworld", "SkyTeam"]),

      // 2-char IATA code, uppercase (e.g. "SQ")
      code: z.string().regex(/^[A-Z0-9]{2}$/, "code must be a 2-character uppercase IATA code"),
      // brand colour for the emblem accent
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "color must be a 6-digit hex like #1B2A5B"),

      // price per mile, in CENTS
      pricePerMile: z.number().positive().max(10),
      priceVerified: z.boolean().default(false),

      // What the AIRLINE charges to buy its own miles, in CENTS — the basis
      // for every "you save" figure. Optional: falls back to site.json's
      // benchmark. Each program prices differently, so a per-program number
      // is always more defensible than the shared default.
      directBuyCents: z.number().positive().max(20).nullable().default(null),

      min: z.number().int().positive(),
      max: z.number().int().positive(),

      delivery: z.string().min(1),
      deliveryVerified: z.boolean().default(false),

      inStock: z.boolean(),

      heroHeadline: z.string().min(1),
      heroSub: z.string().min(1),
      metaTitle: z.string().min(1).max(70),
      metaDescription: z.string().min(1).max(200),

      // slugs of related programs (validated for existence in [slug].astro)
      related: z.array(z.string()).max(4).default([]),
      sweetSpots: z.array(sweetSpot).default([]),
    })
    .refine((d) => d.max >= d.min, {
      message: "max must be greater than or equal to min",
      path: ["max"],
    }),
});

// ============================================================
//  Blog — program news, devaluations, sweet spots, guides.
//
//  One Markdown file per post in src/content/blog/. The filename
//  is the URL slug (/blog/{filename}). Same build-time contract
//  as the airline data: a missing title, an over-long meta
//  description, an unparseable date or an unknown `programs`
//  slug fails `npm run build` rather than shipping broken SEO.
//
//  draft: true keeps a post out of the build entirely — use it
//  for anything not yet fact-checked. This is a market where
//  buyers fear scams, so a post asserting a devaluation or a
//  transfer bonus needs a real source before it ships.
// ============================================================

const blog = defineCollection({
  loader: glob({ base: "src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string().min(1).max(75),
    description: z.string().min(1).max(200),

    date: z.coerce.date(),
    updated: z.coerce.date().optional(),

    // "News" carries a shelf life; guides are evergreen.
    category: z.enum(["News", "Guide", "Sweet spots", "Devaluations"]),

    // Program slugs this post relates to — renders as internal links
    // back to the money pages. Existence is checked in the template.
    programs: z.array(z.string()).max(6).default([]),

    // Where a factual claim came from. Required for News/Devaluations,
    // enforced by the refine below.
    source: z.string().url().optional(),
    sourceLabel: z.string().optional(),

    draft: z.boolean().default(false),
  }).refine((d) => !(["News", "Devaluations"].includes(d.category) && !d.source), {
    message: "News and Devaluations posts must cite a `source` URL — no unsourced claims",
    path: ["source"],
  }),
});

export const collections = { airlines, blog };
