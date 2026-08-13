#!/usr/bin/env node
// Prints what's still blocking go-live, keyed to the client-call agenda items.
// Run: npm run check:launch
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const airlines = read("src/data/airlines.json");
const site = read("src/data/site.json");

const blocking = [];
const optional = [];
const done = [];

// ── Agenda 1 — pricing, min/max, delivery ────────────────────────────
const unpriced = airlines.filter((a) => !a.priceVerified);
const undelivered = airlines.filter((a) => !a.deliveryVerified);
if (unpriced.length) {
  blocking.push([
    "1",
    `Pricing unconfirmed for ${unpriced.length} program(s): ${unpriced.map((a) => a.program).join(", ")}`,
    "src/data/airlines.json → pricePerMile (cents), min, max, then priceVerified: true",
  ]);
} else done.push(["1", "All program prices verified"]);

if (undelivered.length) {
  blocking.push([
    "1",
    `Delivery window unconfirmed for ${undelivered.length} program(s): ${undelivered.map((a) => a.program).join(", ")}`,
    'src/data/airlines.json → delivery (e.g. "Within 48 hours"), then deliveryVerified: true',
  ]);
} else done.push(["1", "All delivery windows verified"]);

// Order limits are their own fact — priceVerified covers the per-mile rate,
// not how small or large an order we'll take. Nine programs carry limits read
// off the client's own store; the rest share a default that is not a policy.
const unlimited = airlines.filter((a) => !a.limitsVerified);
if (unlimited.length) {
  const n = (v) => v.toLocaleString("en-US");
  const defaults = [...new Set(unlimited.map((a) => `${n(a.min)}/${n(a.max)}`))];
  blocking.push([
    "1",
    `Order min/max unconfirmed for ${unlimited.length} program(s) — and the widget now ENFORCES them: an amount outside the range cannot be submitted. Every wrong figure here turns away a real order`,
    `src/data/airlines.json → min, max, then limitsVerified: true. These ${unlimited.length} currently sit on an unconfirmed ${defaults.join(" / ")}; the other ${airlines.length - unlimited.length} are sourced from the live store`,
  ]);
} else done.push(["1", "All order limits verified"]);

// Localized pages ship real Arabic copy that no native speaker has signed
// off — machine-adjacent Arabic on a scam-wary purchase reads as a scam.
const unreviewed = airlines.flatMap((a) =>
  Object.entries(a.i18n ?? {})
    .filter(([, t]) => !t.reviewed)
    .map(([loc]) => `${a.program} (${loc})`)
);
if (unreviewed.length) {
  blocking.push([
    "1",
    `Translated page(s) not yet reviewed by a native speaker: ${unreviewed.join(", ")}`,
    "src/data/airlines.json → i18n.<locale>, have the copy reviewed, then reviewed: true",
  ]);
} else if (airlines.some((a) => a.i18n)) {
  done.push(["1", "All translated pages reviewed"]);
}

// ── Agenda 2 — payment methods ───────────────────────────────────────
if (!site.payments.verified) {
  blocking.push([
    "2",
    "Payment methods unconfirmed — FAQ shows a holding answer",
    "src/data/site.json → payments.methods / usdtNetworks / minOrderUsd / cardAnswer, then payments.verified: true",
  ]);
} else {
  if (!site.payments.cardAnswer)
    optional.push(["2", "No scripted answer for 'do you take cards?'", "src/data/site.json → payments.cardAnswer"]);
  done.push(["2", `Payments live: ${site.payments.methods.join(", ")}`]);
}

// ── Agenda 3 — where enquiries land ──────────────────────────────────
if (!site.contact.verified) {
  blocking.push([
    "3",
    "Enquiry inboxes unconfirmed — BOTH forms are inert (they show a fallback message instead of sending)",
    "src/data/site.json → contact.orderEmail, contact.agentEmail, then contact.verified: true",
  ]);
} else {
  if (!site.contact.web3formsKeyQuote)
    blocking.push(["3", "Quote form has no Web3Forms key — it cannot send", "src/data/site.json → contact.web3formsKeyQuote"]);
  else done.push(["3", "Quote form wired"]);
  if (!site.contact.web3formsKeyAgents)
    blocking.push(["3", "Agent form has no Web3Forms key — it cannot send", "src/data/site.json → contact.web3formsKeyAgents"]);
  else done.push(["3", "Agent form wired"]);
}

// Spam hardening. Not a launch blocker: the forms work without it. It becomes
// one the moment the pages rank, because the Web3Forms access key is public in
// the page source and a scraped key is spammed directly, past the honeypot.
if (!site.contact.turnstileSiteKey)
  optional.push([
    "3",
    "No spam challenge on the forms — set a Turnstile sitekey AND turn captcha verification on in the Web3Forms dashboard (the widget alone does nothing, the key is public)",
    "src/data/site.json → contact.turnstileSiteKey",
  ]);
else done.push(["3", "Forms carry a Turnstile challenge (confirm it is enforced in the Web3Forms dashboard)"]);

// Account-control check. Not a launch blocker: the site is honest without it,
// and the ops process has to exist before the claim can. It is the answer to
// the one fraud question a buyer cannot check for themselves.
if (!site.verification.verified)
  optional.push([
    "4",
    "Account-control check unconfirmed — the 'how do you know the account is really mine' answer is suppressed on /order and in the FAQ",
    "src/data/site.json → verification.verified: true, once the test-transfer step is actually part of the process",
  ]);
else done.push(["4", "Account-control check published"]);

// ── Agenda 4 — guarantee + delivery transparency ─────────────────────
if (!site.guarantee.verified) {
  blocking.push([
    "4",
    "Guarantee text unconfirmed — guarantee tile, FAQ entry and hero clause are all suppressed",
    "src/data/site.json → guarantee.summary + guarantee.policy, then guarantee.verified: true",
  ]);
} else done.push(["4", `Guarantee published${site.guarantee.placeholder ? " (PLACEHOLDER)" : ""}`]);

if (!site.delivery.verified) {
  optional.push([
    "4",
    "No delivery-transparency wording — FAQ falls back to the generic window",
    "src/data/site.json → delivery.howItWorks, then delivery.verified: true",
  ]);
} else done.push(["4", "Delivery wording published"]);

// ── Agenda 9 — partner qualification bar ─────────────────────────────
if (!site.partner.verified || !site.partner.qualifyText) {
  optional.push([
    "9",
    "No partner qualification threshold — /agents advertises better rates with no stated bar, which invites retail buyers to question their own price",
    'src/data/site.json → partner.qualifyText (e.g. "from $25k/month or IATA"), then partner.verified: true',
  ]);
} else done.push(["9", `Partner bar stated: ${site.partner.qualifyText}`]);

// ── Airline direct-buy benchmark (agency can source this, not the client) ──
const noBenchmark = !site.benchmark.verified || site.benchmark.directBuyCents === null;
const perProgram = airlines.filter((a) => a.directBuyCents != null).length;
if (noBenchmark && perProgram === 0) {
  optional.push([
    "—",
    "No sourced airline direct-buy rate — every 'you save' figure and the whole us-vs-direct table are suppressed",
    "src/data/site.json → benchmark.directBuyCents + source, or per-program directBuyCents in airlines.json. WE can source this — it's public airline pricing, not a client input",
  ]);
} else {
  done.push(["—", `Direct-buy benchmark sourced${perProgram ? ` (${perProgram} per-program override(s))` : ""}`]);
}

// ── Agenda 12 — real proof ───────────────────────────────────────────
const real = site.testimonials.filter((t) => t.verified);
if (!real.length) {
  optional.push([
    "12",
    "No verified testimonials — the testimonials section is hidden entirely",
    'src/data/site.json → testimonials: [{ quote, name, role, source, verified: true }]',
  ]);
} else done.push(["12", `${real.length} verified testimonial(s) live`]);

const realReviews = (site.reviews || []).filter((r) => r.verified);
if (!realReviews.length) {
  optional.push([
    "12",
    "No verified review platforms — the site shows no rating anywhere",
    'src/data/site.json → reviews: [{ platform, rating, count, url, verified: true }] — one entry per platform, each with its link',
  ]);
} else done.push(["12", `${realReviews.length} review platform(s) cited: ${realReviews.map((r) => r.platform + (r.placeholder ? " (PLACEHOLDER)" : "")).join(", ")}`]);

const tp = site.trustpilot || {};
if (!tp.verified || !tp.businessUnitId || !tp.templateId) {
  optional.push([
    "12",
    "No Trustpilot TrustBox — the widget and its script are omitted entirely",
    "src/data/site.json → trustpilot.businessUnitId + templateId + domain (Trustpilot dashboard → Integrations → TrustBox), then verified: true",
  ]);
} else done.push(["12", "Trustpilot TrustBox live"]);

if (!site.trust.foundedYear.verified || site.trust.foundedYear.value === null) {
  optional.push([
    "12",
    "Founding year unconfirmed — the years-trading tile is suppressed",
    "src/data/site.json → trust.foundedYear — the cheapest credible trust signal, and undisputable once true",
  ]);
} else done.push(["12", `Trading since ${site.trust.foundedYear.value}${site.trust.foundedYear.placeholder ? " (PLACEHOLDER)" : ""}`]);

const stats = Object.entries(site.trust).filter(([k, s]) => k !== "foundedYear" && (!s.verified || s.value === null || s.value === ""));
if (stats.length) {
  optional.push([
    "12",
    `${stats.length} trust stat(s) suppressed (not rendered): ${stats.map(([k]) => k).join(", ")}`,
    "src/data/site.json → trust.*.value + verified: true — real numbers only",
  ]);
}

// ── Placeholder sweep — staged values that must never reach production ──
const placeholders = [];
for (const [k, v] of Object.entries(site.trust)) {
  if (v && v.placeholder) placeholders.push(`trust.${k} = ${JSON.stringify(v.value)}`);
}
for (const r of site.reviews || []) {
  if (r.placeholder) placeholders.push(`reviews → ${r.platform} ${r.rating}/${r.outOf}${r.count ? ` (${r.count} reviews)` : ""}`);
}
if (site.guarantee.verified && site.guarantee.placeholder) {
  placeholders.push(`guarantee → "${site.guarantee.shortLabel}" (${site.guarantee.summary})`);
}
if (placeholders.length) {
  blocking.push([
    "12",
    `${placeholders.length} PLACEHOLDER value(s) are RENDERING ON THE SITE — staged for design review, NOT confirmed:\n       ${placeholders.join("\n       ")}`,
    'Replace with confirmed figures and delete `"placeholder": true`, or set verified:false to hide them again. The site cannot go live while any remain.',
  ]);
}

// ── Report ───────────────────────────────────────────────────────────
const B = "\x1b[1m", R = "\x1b[0m", RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m";
const show = (list, color, label) => {
  if (!list.length) return;
  console.log(`\n${color}${B}${label} (${list.length})${R}`);
  for (const [item, what, where] of list) {
    console.log(`  ${color}●${R} ${DIM}[agenda ${item}]${R} ${what}`);
    if (where) console.log(`     ${DIM}↳ ${where}${R}`);
  }
};

console.log(`\n${B}buyflightmiles — launch readiness${R}`);
show(blocking, RED, "BLOCKING go-live");
show(optional, YEL, "Suppressed until confirmed (site is live and honest without them)");

if (done.length) {
  console.log(`\n${GRN}${B}Ready (${done.length})${R}`);
  for (const [item, what] of done) console.log(`  ${GRN}✓${R} ${DIM}[agenda ${item}]${R} ${what}`);
}

console.log(
  blocking.length
    ? `\n${RED}${B}${blocking.length} blocker(s) between preview and taking real orders.${R}\n`
    : `\n${GRN}${B}No blockers — clear to go live.${R}\n`
);
process.exit(0);
