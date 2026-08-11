// Currency conversion for the localized pages.
//
// The site charges in US dollars, so the dollar figure is the price and the
// converted one is a reading aid. It is only worth showing because it carries
// a real, dated source: src/data/fx.json is refreshed from the ECB's daily
// reference rate before every build (scripts/fetch-fx.mjs) and falls back to
// the last committed value if that fetch fails.
//
// Nothing here decides whether a currency is ACCEPTED. Payment methods live
// in site.json and are the client's to confirm.
import fx from "../data/fx.json";

export type Fx = { rate: number; date: string; source: string };

/** The USD → currency rate, or null when we hold no rate for it. */
export function fxFor(currency: "EUR"): Fx | null {
  const rate = (fx.rates as Record<string, number>)[currency];
  if (typeof rate !== "number" || !Number.isFinite(rate)) return null;
  return { rate, date: fx.date, source: fx.source };
}

/** ECB dates are ISO; German readers expect 11.08.2026 */
export function deDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** Format a converted amount, e.g. 411.6 → "412 €" (whole euros: the figure
 *  is indicative, and cents would imply a precision it does not have). */
export function eur(amount: number, locale = "de-DE"): string {
  return `${Math.round(amount).toLocaleString(locale)} €`;
}
