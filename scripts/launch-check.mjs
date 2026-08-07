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

// ── Agenda 4 — guarantee + delivery transparency ─────────────────────
if (!site.guarantee.verified) {
  blocking.push([
    "4",
    "Guarantee text unconfirmed — guarantee tile, FAQ entry and hero clause are all suppressed",
    "src/data/site.json → guarantee.summary + guarantee.policy, then guarantee.verified: true",
  ]);
} else done.push(["4", "Guarantee published"]);

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

const stats = Object.entries(site.trust).filter(([, s]) => !s.verified || s.value === null || s.value === "");
if (stats.length) {
  optional.push([
    "12",
    `${stats.length} trust stat(s) suppressed (not rendered): ${stats.map(([k]) => k).join(", ")}`,
    "src/data/site.json → trust.*.value + verified: true — real numbers only",
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
