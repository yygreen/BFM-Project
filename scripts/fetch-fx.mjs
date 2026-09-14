// Refreshes src/data/fx.json before every build.
//
// The site prices in US dollars because that is what is actually charged.
// Every localized page shows the equivalent in its own market's currency
// beside it as a reading aid, and a reading aid is only honest if it carries
// a real rate, a named source and the date that rate is from.
//
// Three sources, because no single one covers the roster:
//
//   ecb    EUR, TRY, HKD — the European Central Bank's daily reference rate,
//          published once per working day around 16:00 CET. The best
//          provenance available and independently checkable, so it is used
//          wherever it reaches.
//   erapi  TWD, COP — the ECB publishes neither. exchangerate-api.com does,
//          updates daily, needs no key, and is named on the page rather than
//          passed off as a central bank figure.
//   peg    AED, QAR — both are pegged to the dollar by their central banks
//          (3.6725 since 1997, 3.64 since 2001). A fixed peg is not a daily
//          rate and saying so is more accurate than dressing it up as one.
//          The peg is still checked against the live feed on every run: if it
//          has moved, that is a currency regime change, and this refuses to
//          publish rather than quietly shipping a stale peg.
//
// THIS SCRIPT MUST NEVER FAIL A BUILD. It starts from the committed file and
// overlays only what it successfully fetched, so one dead source leaves the
// other currencies fresh and that source's last known good rate in place. A
// slightly old rate shown with its true date is fine; a broken deploy is not.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("src/data/fx.json");
const TIMEOUT_MS = 8000;

// The band is a sanity check on the units, not a forecast. A value outside it
// means the API changed its base or its scale, and publishing that silently
// would put a badly wrong number beside every price on a market's pages.
const WANT = {
  EUR: { via: "ecb", band: [0.5, 2] },
  TRY: { via: "ecb", band: [10, 500] },
  HKD: { via: "ecb", band: [5, 12] },
  TWD: { via: "erapi", band: [20, 60] },
  COP: { via: "erapi", band: [1000, 12000] },
  AED: { via: "peg", peg: 3.6725 },
  QAR: { via: "peg", peg: 3.64 },
};

const VIA = {
  ecb: "European Central Bank reference rate, via frankfurter.dev",
  erapi: "exchangerate-api.com daily reference rate",
  peg: "official central bank peg to the US dollar",
};

// how far a peg may drift in the live feed before we stop trusting it
const PEG_TOLERANCE = 0.005;

let prev = { base: "USD", rates: {}, via: VIA };
try {
  prev = JSON.parse(readFileSync(OUT, "utf8"));
} catch {
  console.warn("[fx] no readable fx.json — starting from empty");
}

const rates = { ...(prev.rates ?? {}) };
const notes = [];

const get = async (url) => {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

const plausible = (code, rate) => {
  const [lo, hi] = WANT[code].band;
  return typeof rate === "number" && Number.isFinite(rate) && rate >= lo && rate <= hi;
};

const isDate = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);

const codesFor = (via) => Object.keys(WANT).filter((c) => WANT[c].via === via);

// ---- ECB ---------------------------------------------------------------
const ecbCodes = codesFor("ecb");
try {
  const body = await get(
    `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${ecbCodes.join(",")}`,
  );
  if (!isDate(body?.date)) throw new Error(`bad date ${body?.date}`);
  for (const code of ecbCodes) {
    const rate = body?.rates?.[code];
    if (!plausible(code, rate)) {
      notes.push(`${code}: implausible ${rate}, kept ${rates[code]?.rate ?? "none"}`);
      continue;
    }
    rates[code] = { rate, date: body.date, via: "ecb" };
  }
  console.log(`[fx] ecb ${body.date}: ${ecbCodes.map((c) => `${c} ${body.rates?.[c]}`).join(", ")}`);
} catch (err) {
  notes.push(`ecb unavailable (${err?.message ?? err}) — kept committed rates`);
}

// ---- exchangerate-api, and the peg check -------------------------------
// One call serves both: the floating currencies the ECB does not publish, and
// the independent reading that tells us the pegs still hold.
try {
  const body = await get("https://open.er-api.com/v6/latest/USD");
  if (body?.result !== "success") throw new Error(`result ${body?.result}`);
  const live = body?.rates ?? {};
  // this feed dates itself as an RFC 1123 timestamp; we store plain ISO
  const date = new Date(body.time_last_update_utc ?? Date.now()).toISOString().slice(0, 10);
  if (!isDate(date)) throw new Error(`bad date ${date}`);

  for (const code of codesFor("erapi")) {
    const rate = live[code];
    if (!plausible(code, rate)) {
      notes.push(`${code}: implausible ${rate}, kept ${rates[code]?.rate ?? "none"}`);
      continue;
    }
    rates[code] = { rate: Math.round(rate * 1e4) / 1e4, date, via: "erapi" };
  }
  console.log(`[fx] erapi ${date}: ${codesFor("erapi").map((c) => `${c} ${live[c]}`).join(", ")}`);

  for (const code of codesFor("peg")) {
    const { peg } = WANT[code];
    const seen = live[code];
    if (typeof seen !== "number" || Math.abs(seen - peg) / peg > PEG_TOLERANCE) {
      notes.push(`${code}: peg ${peg} but feed says ${seen} — NOT publishing, check the peg`);
      continue;
    }
    // A peg carries no date: it is the same number today as in 1997, and
    // stamping today's date on it would imply a daily observation.
    rates[code] = { rate: peg, date: null, via: "peg" };
  }
} catch (err) {
  notes.push(`erapi unavailable (${err?.message ?? err}) — kept committed rates and pegs`);
}

for (const n of notes) console.warn(`[fx] ${n}`);

const missing = Object.keys(WANT).filter((c) => !rates[c]);
if (missing.length) console.warn(`[fx] no rate at all for: ${missing.join(", ")}`);

writeFileSync(OUT, JSON.stringify({ base: "USD", rates, via: VIA }, null, 2) + "\n");
console.log(`[fx] wrote ${Object.keys(rates).length} rates`);

// --check: for the scheduled job, not for builds.
//
// Because this script deliberately never fails, a source that dies stays
// invisible: the site keeps publishing the last good rate under its true and
// slowly ageing date, which is honest but wrong to leave unattended. The
// daily workflow runs this mode so a dead feed shows up as a failed run
// instead of a figure quietly drifting for a month.
//
// Five days of slack: the ECB publishes on working days only, so a Tuesday
// after a long weekend legitimately serves Thursday's rate.
if (process.argv.includes("--check")) {
  const MAX_AGE_DAYS = 5;
  const today = new Date().toISOString().slice(0, 10);
  const ageDays = (iso) => (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${iso}T00:00:00Z`)) / 86400000;

  const bad = [];
  for (const code of Object.keys(WANT)) {
    const row = rates[code];
    if (!row) {
      bad.push(`${code}: no rate`);
      continue;
    }
    if (row.via === "peg") continue; // a peg has no date and does not go stale
    const age = ageDays(row.date);
    if (!Number.isFinite(age) || age > MAX_AGE_DAYS) bad.push(`${code}: rate is ${age} days old (${row.date})`);
  }

  if (bad.length) {
    console.error(`\n\x1b[31m\x1b[1mFX rates are stale or missing:\x1b[0m`);
    for (const b of bad) console.error(`  ${b}`);
    console.error("\nThe site is still publishing its last known good rates, dated honestly.");
    console.error("Check whether the source moved or the peg changed.\n");
    process.exit(1);
  }
  console.log("[fx] check passed: every rate is current");
}
