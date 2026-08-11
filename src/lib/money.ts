// Money formatting for every price the site shows.
//
// Nothing here rounds to the dollar. 1.95¢ per mile is $19.50 per 1,000, and
// rounding that to $20 overstates the price by 2.5% in the figure a buyer
// compares vendors on. Cents are carried through and shown.
//
// Amounts are handled as integer cents because the inputs are decimal cents
// per mile and binary floating point does not hold them exactly: at three
// programmes on the current roster, `price * miles / 100` lands a hair off a
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
