// Refreshes src/data/fx.json before every build.
//
// The site prices in US dollars because that is what is actually charged.
// The localized pages show a euro equivalent beside it as a conversion aid,
// and a conversion aid is only honest if it carries a real rate and the date
// that rate is from. This fetches the European Central Bank's daily reference
// rate, which is published once per working day around 16:00 CET and is the
// figure a European buyer can check independently.
//
// THIS SCRIPT MUST NEVER FAIL A BUILD. A network blip, a rate-limited API or
// a malformed response leaves the committed fx.json in place and the build
// carries on with the last known good rate. A slightly old rate shown with
// its true date is fine; a broken deploy is not.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("src/data/fx.json");
const URL = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR";
const TIMEOUT_MS = 8000;

const keep = (why) => {
  let current = "none";
  try {
    current = JSON.parse(readFileSync(OUT, "utf8")).date;
  } catch {}
  console.warn(`[fx] ${why} — keeping the committed rate (${current})`);
  process.exit(0);
};

const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

try {
  const res = await fetch(URL, { signal: ac.signal });
  clearTimeout(timer);
  if (!res.ok) keep(`HTTP ${res.status}`);

  const body = await res.json();
  const rate = body?.rates?.EUR;
  const date = body?.date;

  // Guard the shape AND the value. A rate outside this band means the API
  // changed its base or units, and silently publishing it would put a wrong
  // number next to every price.
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate < 0.5 || rate > 2) {
    keep(`implausible rate ${rate}`);
  }
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    keep(`bad date ${date}`);
  }

  const out = {
    base: "USD",
    rates: { EUR: rate },
    date,
    source: "European Central Bank reference rate, via frankfurter.dev",
  };
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`[fx] 1 USD = ${rate} EUR (ECB ${date})`);
} catch (err) {
  clearTimeout(timer);
  keep(err?.name === "AbortError" ? `timed out after ${TIMEOUT_MS}ms` : String(err?.message ?? err));
}
