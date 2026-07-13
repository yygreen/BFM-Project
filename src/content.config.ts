import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

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

export const collections = { airlines };
