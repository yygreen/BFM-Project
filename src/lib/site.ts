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

// `placeholder: true` means "this renders, but it is NOT confirmed". It exists
// so the client can design-review a populated trust section without the numbers
// being mistaken for real ones — check:launch treats any placeholder as a
// BLOCKER, so the site cannot be declared launch-ready while one is present.
const stat = z.object({
  value: z.union([z.number(), z.string()]).nullable(),
  verified: z.boolean(),
  placeholder: z.boolean().default(false),
});

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
    // Cloudflare Turnstile sitekey. Empty means no challenge is rendered, so
    // the forms behave exactly as they do today until one is set.
    turnstileSiteKey: z.string(),
    phone: z.string(),
    whatsapp: z.string(),
    telegram: z.string(),
    verified: z.boolean(),
  }),

  guarantee: z.object({
    shortLabel: z.string().min(1),
    summary: z.string().min(1),
    policy: z.string(),
    verified: z.boolean(),
    placeholder: z.boolean().default(false),
  }),

  delivery: z.object({ howItWorks: z.string(), verified: z.boolean() }),

  // The account-control check performed before a full transfer. A membership
  // number alone proves nothing — anyone can type one — so a small test amount
  // goes first and the buyer confirms what landed. It defeats delivery into a
  // compromised account without ever asking for a credential.
  //
  // Suppressed until the client confirms they actually do this. Describing a
  // verification step we do not perform would be the invented trust signal
  // this whole file exists to prevent.
  verification: z.object({
    summary: z.string().min(1),
    why: z.string().min(1),
    verified: z.boolean(),
  }),

  // The bar an agent must clear for partner pricing. Stating it protects the
  // RETAIL price: without a threshold, "partner rates that scale with volume"
  // just tells a direct visitor a cheaper price exists and they aren't getting
  // it. With one, the cheaper price is visibly not available to them.
  partner: z.object({ qualifyText: z.string(), verified: z.boolean() }),

  // What airlines charge for their own miles — the basis of every "you save"
  // figure. Suppressed until sourced: a savings claim is the most prominent
  // number on the page and the easiest one to be caught out on.
  // Award flights are measured against the cash fare for the same seat, which
  // is a different benchmark from the miles side below — that one compares our
  // per-mile rate against what the airline charges for its own miles.
  flights: z.object({
    // The whole sentence, not a percentage plus a preposition. This one is
    // being worded and reworded, and a claim assembled from parts means every
    // rewrite is a code change; as a string the client owns the phrasing.
    savingsClaim: z.string(),
    verified: z.boolean(),
  }),

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
    // total miles moved — the headline scale figure buyers compare vendors on
    milesDelivered: stat,
    completionRate: stat,
    accountLocks: stat,
    supportHours: stat,
    // "trading since 2016" is the cheapest credible trust signal there is,
    // and unlike a rating it can't be disputed once it's true
    foundedYear: z.object({
      value: z.number().int().min(1970).max(2100).nullable(),
      verified: z.boolean(),
      placeholder: z.boolean().default(false),
    }),
  }),

  // One entry per review platform, each with its own link. Deliberately a
  // list rather than a single rating: the Google profile and Trustpilot
  // disagree sharply, and publishing one number without naming its source
  // is the kind of claim a sceptical buyer checks and catches.
  reviews: z.array(
    z.object({
      platform: z.string().min(1),
      rating: z.number().positive().max(5),
      outOf: z.number().positive().default(5),
      count: z.number().int().nonnegative().nullable(),
      url: z.string().url().or(z.literal("")),
      verified: z.boolean(),
      placeholder: z.boolean().default(false),
    })
  ),

  // Trustpilot TrustBox. Loading their script pulls a third-party bundle onto
  // every page, so it only ships once a real business-unit ID exists — an
  // empty widget is worse than none, and the rating is unconfirmed anyway.
  trustpilot: z.object({
    businessUnitId: z.string(),
    templateId: z.string(),
    domain: z.string(),
    locale: z.string().min(2),
    heightPx: z.number().int().positive(),
    verified: z.boolean(),
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

/** Review platforms the client has confirmed, each safe to cite with a source. */
export const realReviews = site.reviews.filter((r) => r.verified);

/** Years trading, or null until the founding year is confirmed. */
export function yearsTrading(now = 2026): number | null {
  const f = site.trust.foundedYear;
  if (!f.verified || f.value === null) return null;
  return Math.max(0, now - f.value);
}

/** True once a real TrustBox is configured — otherwise we ship no widget. */
export const trustpilotReady =
  site.trustpilot.verified &&
  site.trustpilot.businessUnitId !== "" &&
  site.trustpilot.templateId !== "";

/** Testimonials the client has confirmed are real. */
export const realTestimonials = site.testimonials.filter((t) => t.verified);

/** True once the quote form can actually deliver mail. */
export const quoteFormReady = site.contact.verified && site.contact.web3formsKeyQuote !== "";
export const agentFormReady = site.contact.verified && site.contact.web3formsKeyAgents !== "";

/**
 * Whether to render a Turnstile challenge on the forms.
 *
 * The widget alone proves nothing: the Web3Forms access key is public in the
 * page source, so a spammer can POST straight to the API and skip the page
 * entirely. It only bites once captcha verification is switched ON in the
 * Web3Forms dashboard, which makes them reject any submission without a valid
 * token. Both halves or neither.
 */
export const turnstileKey = site.contact.turnstileSiteKey;

/**
 * An inbox to hand an enquiry to when the form itself can't post it yet.
 * A Web3Forms key needs an account; an address needs nothing, so the moment
 * one exists the forms compose the enquiry into the visitor's mail client
 * instead of dead-ending. Empty until an address is configured.
 */
export const mailtoInbox = site.contact.orderEmail || "";

export type Channel = {
  kind: "email" | "phone" | "whatsapp" | "telegram";
  label: string;
  /** exactly as a visitor should see it, so they can compare character by character */
  value: string;
  href: string;
  external?: boolean;
};

/**
 * The channels we actually use, and the only ones.
 *
 * One definition, so the footer and anywhere else that publishes a channel
 * cannot drift apart on what counts as ours.
 *
 * Gated on contact.verified for the same reason every other claim is: an
 * unconfirmed handle published as official is worse than no handle. Empty
 * channels are omitted rather than shown blank, so the list never implies we
 * are reachable somewhere we are not.
 *
 * WhatsApp strips to digits because wa.me rejects a leading +.
 */
export function officialChannels(): Channel[] {
  const c = site.contact;
  if (!c.verified) return [];
  const out: Channel[] = [];
  if (c.orderEmail) out.push({ kind: "email", label: "Email", value: c.orderEmail, href: `mailto:${c.orderEmail}` });
  if (c.phone) out.push({ kind: "phone", label: "Phone", value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, "")}` });
  if (c.whatsapp)
    out.push({
      kind: "whatsapp",
      label: "WhatsApp",
      value: c.whatsapp,
      href: `https://wa.me/${c.whatsapp.replace(/\D/g, "")}`,
      external: true,
    });
  if (c.telegram)
    out.push({
      kind: "telegram",
      label: "Telegram",
      value: c.telegram,
      href: `https://t.me/${c.telegram.replace(/^@/, "")}`,
      external: true,
    });
  return out;
}

/**
 * The sourced airline direct-buy rate (cents/mile) for a program, or null.
 * A program's own figure wins over the shared benchmark, and either one shows
 * only while its `verified` flag holds — a researched but withheld figure
 * stays in the data and off the page.
 */
type DirectBuy = { cents: number; source: string; checked: string; verified: boolean } | undefined;
/**
 * The award-flight savings line, or null while it is unconfirmed. One phrasing
 * for the whole site: a claim worded differently on two pages reads as two
 * different claims.
 */
export const flightSavings = (): string | null =>
  site.flights.verified && site.flights.savingsClaim.trim()
    ? site.flights.savingsClaim.trim()
    : null;

/**
 * The savings claim with its figures marked up for the monospace treatment
 * every other number on this site gets — prices, delivery windows, order
 * limits. Done here rather than by splitting the claim into fields, so the
 * sentence stays one editable string and any rewording keeps the typography.
 */
export const flightSavingsHtml = (): string | null => {
  const claim = flightSavings();
  return claim && claim.replace(/\d[\d.,]*\s?%/g, (n) => `<b>${n}</b>`);
};

export const directBuyRate = (programDirect: DirectBuy): number | null => {
  if (programDirect?.verified) return programDirect.cents;
  const b = site.benchmark;
  return b.verified && b.directBuyCents !== null ? b.directBuyCents : null;
};

/** Where a program's published direct-buy figure came from, for the citation. */
export const directBuySource = (programDirect: DirectBuy): string =>
  programDirect?.verified ? `${programDirect.source}, ${programDirect.checked}` : site.benchmark.source;

/** Human-readable payment list, e.g. "USDT, bank wire or cash". */
export function paymentSentence(): string {
  const m = site.payments.methods;
  if (!site.payments.verified || m.length === 0) return "";
  if (m.length === 1) return m[0];
  return m.slice(0, -1).join(", ") + " or " + m[m.length - 1];
}
