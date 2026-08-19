// Money formatting for every price the site shows.
//
// Nothing here rounds to the dollar. 1.95¢ per mile is $19.50 per 1,000, and
// rounding that to $20 overstates the price by 2.5% in the figure a buyer
// compares vendors on. Cents are carried through and shown.
//
// Amounts are handled as integer cents because the inputs are decimal cents
// per mile and binary floating point does not hold them exactly: at three
// programs on the current roster, `price * miles / 100` lands a hair off a
// round number, and formatting that directly would print a stray penny.
//
// The mirror of this logic lives inline in QuoteWidget, SavingsTool and
// /order, which run in the browser as `is:inline` scripts and so cannot
// import. Change one, change those.

/**
 * Dollars, with cents only when there are cents: 1080 → "$1,080", 19.5 → "$19.50"
 *
 * `locale` groups the digits the way the page's language does. It matters on
 * the localized pages, where "$1,900" sitting beside "100.000 Meilen" is two
 * conventions in one line, and where a German reader takes "1,900" for one
 * point nine. The currency stays USD everywhere, and the localized copy says so.
 */
export function usd(n: number, locale = "en-US"): string {
  const cents = Math.round(n * 100);
  return (
    "$" +
    (cents / 100).toLocaleString(locale, {
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Cost of 1,000 miles at a cents-per-mile rate, as a number: 1.95 → 19.5 */
export function per1000(centsPerMile: number): number {
  return Math.round(centsPerMile * 1000) / 100;
}

/** Cost of an arbitrary number of miles at a cents-per-mile rate */
export function costOf(miles: number, centsPerMile: number): number {
  return Math.round(miles * centsPerMile) / 100;
}

/**
 * A per-mile rate at a fixed two decimals: 2 → "2.00", 1.8 → "1.80".
 *
 * For any surface that puts rates from several programs side by side. The
 * roster runs 1.75 to 2.2, and rendering them at their natural precision
 * gives "2¢" next to "1.95¢" — the eye cannot rank figures whose digit
 * counts differ, and the short one reads as a rounded guess on a card whose
 * whole job is precision. A single rate on its own page has nothing to line
 * up against and keeps its natural form.
 */
export function rateFixed(centsPerMile: number, locale = "en-US"): string {
  return centsPerMile.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * How far under the airline's own list price a rate sits, as a whole percent.
 * Returns null when there is no sourced list price to compare against, or
 * when ours isn't actually cheaper — the claim has to be true to render.
 */
export function savingVsList(ourCents: number, listCents: number | null): number | null {
  if (!listCents || listCents <= ourCents) return null;
  return Math.round(((listCents - ourCents) / listCents) * 100);
}
