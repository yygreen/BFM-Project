import { z } from "astro/zod";
import raw from "../data/site.json";

// ============================================================
//  Client-supplied facts — the single place to edit them.
//
//  Everything in src/data/site.json is something only the client
//  can confirm (real prices live in airlines.json; everything else
//  lives here). Each block carries a `verified` flag:
//
//      verified: false  →  the site does NOT render the claim
//      verified: true   →  the claim goes live
//
//  That's deliberate. Trust is the #1 competitive lever and buyers
//  fear scams, so an unconfirmed rating or transfer count must never
//  ship as a real number. Filling a value in is a one-line edit;
//  flipping the flag is what publishes it.
//
//  `npm run check:launch` prints exactly what's still outstanding.
// ============================================================

const stat = z.object({ value: z.union([z.number(), z.string()]).nullable(), verified: z.boolean() });

const schema = z.object({
  payments: z.object({
    // NOTE: never add cards/PayPal here unless the client confirms them —
    // the old WordPress site advertised them wrongly.
    methods: z.array(z.string().min(1)),
    usdtNetworks: z.array(z.string().min(1)),
    minOrderUsd: z.number().positive().nullable(),
    cardAnswer: z.string(),
    verified: z.boolean(),
  }),

  contact: z.object({
    orderEmail: z.string().email().or(z.literal("")),
    agentEmail: z.string().email().or(z.literal("")),
    web3formsKeyQuote: z.string(),
    web3formsKeyAgents: z.string(),
    whatsapp: z.string(),
    telegram: z.string(),
    verified: z.boolean(),
  }),

  guarantee: z.object({
    shortLabel: z.string().min(1),
    summary: z.string().min(1),
    policy: z.string(),
    verified: z.boolean(),
  }),

  delivery: z.object({ howItWorks: z.string(), verified: z.boolean() }),

  // The bar an agent must clear for partner pricing. Stating it protects the
  // RETAIL price: without a threshold, "partner rates that scale with volume"
  // just tells a direct visitor a cheaper price exists and they aren't getting
  // it. With one, the cheaper price is visibly not available to them.
  partner: z.object({ qualifyText: z.string(), verified: z.boolean() }),

  // What airlines charge for their own miles — the basis of every "you save"
  // figure. Suppressed until sourced: a savings claim is the most prominent
  // number on the page and the easiest one to be caught out on.
  benchmark: z.object({
    directBuyCents: z.number().positive().max(20).nullable(),
    source: z.string(),
    verified: z.boolean(),
  }),

  trust: z.object({
    rating: z.object({
      value: z.number().positive().max(5).nullable(),
      outOf: z.number().positive(),
      source: z.string(),
      reviewCount: z.number().int().positive().nullable(),
      verified: z.boolean(),
    }),
    transfersCompleted: stat,
    completionRate: stat,
    accountLocks: stat,
    supportHours: stat,
  }),

  testimonials: z.array(
    z.object({
      quote: z.string().min(1),
      name: z.string().min(1),
      role: z.string().min(1),
      source: z.string().min(1),
      verified: z.boolean(),
    })
  ),
});

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  // Fail the build loudly rather than shipping a half-configured page.
  throw new Error(
    "src/data/site.json is invalid:\n" +
      parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n")
  );
}

export const site = parsed.data;

/** A stat is publishable only when it's flagged verified AND actually has a value. */
export const live = (s: { value: unknown; verified: boolean }) =>
  s.verified && s.value !== null && s.value !== "";

/** Testimonials the client has confirmed are real. */
export const realTestimonials = site.testimonials.filter((t) => t.verified);

/** True once the quote form can actually deliver mail. */
export const quoteFormReady = site.contact.verified && site.contact.web3formsKeyQuote !== "";
export const agentFormReady = site.contact.verified && site.contact.web3formsKeyAgents !== "";

/** The sourced airline direct-buy rate (cents/mile) for a program, or null. */
export const directBuyRate = (programRate: number | null | undefined): number | null => {
  if (typeof programRate === "number") return programRate;
  const b = site.benchmark;
  return b.verified && b.directBuyCents !== null ? b.directBuyCents : null;
};

/** Human-readable payment list, e.g. "USDT, bank wire or cash". */
export function paymentSentence(): string {
  const m = site.payments.methods;
  if (!site.payments.verified || m.length === 0) return "";
  if (m.length === 1) return m[0];
  return m.slice(0, -1).join(", ") + " or " + m[m.length - 1];
}
