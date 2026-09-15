/**
 * Comparable duration for a delivery window string.
 *
 * The data carries two shapes: "Within 24 hours" (the original convention)
 * and "Within 3 business days" (the client's September 2026 price sheet).
 * Every "fastest confirmed window" computation used to sort on parseInt of
 * the leading number, which ranks "3 business days" ahead of "24 hours" —
 * wrong by three days. This maps both shapes onto hours (a business day
 * counted as 24, since only the ORDER matters, never the product) so mixed
 * data sorts truthfully. Unparseable strings sort last rather than first:
 * a window we can't read must never be promoted as the fastest.
 */
export const deliveryHours = (delivery: string): number => {
  const m = delivery.match(/(\d+)\s*(business\s+day|hour)/i);
  if (!m) return Number.POSITIVE_INFINITY;
  return parseInt(m[1], 10) * (/business/i.test(m[2]) ? 24 : 1);
};
