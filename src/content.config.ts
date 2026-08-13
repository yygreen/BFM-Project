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
  // typical miles for the redemption — when present the template computes the
  // cost at OUR live rate, so the figure can never contradict the widget
  miles: z.number().int().positive().optional(),
});

// ---- per-program editorial blocks -------------------------------------
// What keeps thirteen generated pages from being the same page thirteen
// times: per-program FACTS, not filler. Every block is optional and renders
// only when filled — a half-empty section is worse than none — and any claim
// about the program itself is dated via factsChecked, because expiry rules
// and fee behaviour go stale.
const valueBands = z.object({
  excellent: z.array(z.string().min(1)),
  good: z.array(z.string().min(1)),
  skip: z.array(z.string().min(1)),
});
const quirk = z.object({ title: z.string().min(1), text: z.string().min(1) });
const fact = z.object({ label: z.string().min(1), text: z.string().min(1) });
const faqExtra = z.object({ q: z.string().min(1), a: z.string().min(1) });

// A localized landing page for a program. Adding a block here generates
// /{locale}/buy/{slug}/ with hreflang pairs on both sides — growing into a
// new language market is data entry, the same as growing the roster. The old
// WordPress site ranks with an Arabic Qatar page, so the migration must keep
// that surface rather than folding it into English.
const translation = z.object({
  metaTitle: z.string().min(1).max(75),
  metaDescription: z.string().min(1).max(200),
  heroHeadline: z.string().min(1),
  heroSub: z.string().min(1),
  steps: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(3).max(4),
  // the program's best redemptions, mirroring sweetSpots on the English page
  uses: z.array(z.object({ title: z.string().min(1), desc: z.string().min(1) })).min(1).max(6).optional(),
  // a plain benefit list. Optional: the German page renders the same trust
  // block the English page does instead, and a section that exists in one
  // language only is a different page rather than a translation.
  points: z.array(z.string().min(1)).min(2).max(6).optional(),
  faq: z.array(faqExtra).min(1).max(6),
  ctaLabel: z.string().min(1),
  // Optional flag override for this program's language toggle. The registry
  // sets one per locale, which is right where a language maps to a country;
  // Arabic doesn't, so its three pages name their own market instead.
  flag: z.string().min(1).optional(),
  // Currency for this program's converted prices, overriding the locale's.
  // Same reason as `flag`: a language is not a market. The Arabic pages sell
  // into Qatar and the UAE, and the riyal is not the dirham.
  currency: z.string().length(3).optional(),
  // set true once a native speaker has reviewed the copy — check:launch
  // treats unreviewed translations as launch blockers, not silent passes
  reviewed: z.boolean().default(false),
});

const airlines = defineCollection({
  loader: file("src/data/airlines.json"),
  schema: z
    .object({
      // display order on the homepage / agents grid (lowest first)
      order: z.number().int().nonnegative(),

      program: z.string().min(1),
      airline: z.string().min(1),
      // What the order form calls the buyer's membership identifier. Defaults
      // to "{program} account number", which reads correctly for most of the
      // roster ("MileagePlus account number"); set this only where that
      // doesn't, e.g. the two Avios programs, whose `program` carries a
      // parenthetical. It is terminology, not a claim about the program.
      accountLabel: z.string().min(1).optional(),
      // several US carriers (Southwest, JetBlue, Hawaiian, Frontier) belong to
      // no alliance at all — "Independent" is a real value, not a fallback
      alliance: z.enum(["Star Alliance", "Oneworld", "SkyTeam", "Independent"]),

      // 2-char IATA code, uppercase (e.g. "SQ")
      code: z.string().regex(/^[A-Z0-9]{2}$/, "code must be a 2-character uppercase IATA code"),
      // brand colour for the emblem accent
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "color must be a 6-digit hex like #1B2A5B"),

      // Optional path to a carrier logo under /public (e.g. "/logos/delta.svg").
      // When absent, an abstract tail-fin badge in the brand colour is drawn
      // instead. Left empty deliberately: the footer states we are NOT
      // affiliated with any airline, and displaying carrier marks alongside a
      // resale offer is the clearest possible signal of affiliation. Only add
      // a file here once its use has actually been cleared.
      logo: z.string().optional(),
      logoAlt: z.string().optional(),

      // price per mile, in CENTS
      pricePerMile: z.number().positive().max(10),
      priceVerified: z.boolean().default(false),

      // What the AIRLINE charges to buy its own miles, in CENTS — the basis
      // for every "you save" figure. Optional: falls back to site.json's
      // benchmark. Each program prices differently, so a per-program number
      // is always more defensible than the shared default.
      //
      // It carries its own source and date because it is a claim about a third
      // party that a buyer can check in one click, and because airlines move
      // these prices. `verified` gates rendering the same way every other flag
      // on this site does: a figure can be correctly sourced and still be
      // withheld, which is what `note` is for.
      directBuy: z
        .object({
          cents: z.number().positive().max(20),
          source: z.string().min(1),
          checked: z.string().min(1), // e.g. "August 2026"
          verified: z.boolean().default(false),
          note: z.string().optional(),
        })
        .optional(),

      // Order limits carry their own flag. They are a different fact from a
      // different source than the per-mile price, so priceVerified must not
      // stand in for them — while this is false the widget guides with the
      // figure instead of asserting it as the program's policy.
      min: z.number().int().positive(),
      max: z.number().int().positive(),
      limitsVerified: z.boolean().default(false),

      delivery: z.string().min(1),
      deliveryVerified: z.boolean().default(false),

      inStock: z.boolean(),

      heroHeadline: z.string().min(1),
      // The run of words inside heroHeadline that gets the blue highlight —
      // normally the search phrase the page is written for, so the h1 shows
      // what the page is about at a glance. Must appear verbatim in the
      // headline; the template checks and falls back to a plain h1.
      heroHighlight: z.string().min(1).optional(),
      heroSub: z.string().min(1),
      metaTitle: z.string().min(1).max(70),
      metaDescription: z.string().min(1).max(200),

      // slugs of related programs (validated for existence in [slug].astro)
      related: z.array(z.string()).max(4).default([]),
      sweetSpots: z.array(sweetSpot).default([]),
      valueBands: valueBands.optional(),
      quirks: z.array(quirk).default([]),
      mechanics: z.array(fact).default([]),
      faqExtras: z.array(faqExtra).default([]),
      // when the program-fact blocks above were last checked, e.g. "August 2026"
      factsChecked: z.string().optional(),

      // Localized landing pages, keyed by locale. Add a key here and a route
      // under src/pages/{locale}/buy/ when a market opens. Optional one by
      // one rather than a record over a locale enum: that form is exhaustive
      // in Zod, so every program would be required to carry every language.
      i18n: z
        .object({
          // One optional key per locale. z.record over an enum is EXHAUSTIVE
          // in Zod, which would demand every program carry every language, so
          // the keys are spelled out. Add a locale here and in
          // src/lib/locales.ts and the route generates it.
          ar: translation.optional(),
          de: translation.optional(),
          es: translation.optional(),
          tr: translation.optional(),
          fr: translation.optional(),
          "zh-tw": translation.optional(),
          "zh-hk": translation.optional(),
        })
        .optional(),
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
    category: z.enum(["News", "Guide", "Valuations", "Transfers", "Sweet spots", "Devaluations"]),

    // Program slugs this post relates to — renders as internal links
    // back to the money pages. Existence is checked in the template.
    programs: z.array(z.string()).max(6).default([]),

    // Where a factual claim came from. Required for News/Devaluations,
    // enforced by the refine below.
    source: z.string().url().optional(),
    sourceLabel: z.string().optional(),

    // Optional real hero image (path under /public). When absent the post
    // renders a generated on-brand SVG keyed to its slug — see PostHero.astro
    // — so the layout never depends on art that doesn't exist yet.
    image: z.string().optional(),
    imageAlt: z.string().optional(),

    // Pins a post to the top of /blog as the lead story.
    featured: z.boolean().default(false),

    draft: z.boolean().default(false),
  }).refine((d) => !(["News", "Devaluations"].includes(d.category) && !d.source), {
    message: "News and Devaluations posts must cite a `source` URL — no unsourced claims",
    path: ["source"],
  }),
});

export const collections = { airlines, blog };
