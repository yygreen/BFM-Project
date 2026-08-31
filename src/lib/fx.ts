// Currency conversion for the localized pages.
//
// The site charges in US dollars, so the dollar figure is the price and the
// converted one is a reading aid. It is only worth showing because it carries
// a real, dated, named source: src/data/fx.json is refreshed before every
// build (scripts/fetch-fx.mjs) from the ECB where the ECB publishes, from
// exchangerate-api where it does not, and from the published dollar peg for
// the Gulf currencies. Each rate records which of the three it came from.
//
// Nothing here decides whether a currency is ACCEPTED. Payment methods live
// in site.json and are the client's to confirm. Every localized page says the
// billing happens in dollars, next to every converted figure.
import fx from "../data/fx.json";

export type Fx = {
  rate: number;
  /** null for a peg: it is not a daily observation and must not be dated */
  date: string | null;
  via: string;
  source: string;
};

type Row = { rate: number; date: string | null; via: string };

/** The USD → currency rate, or null when we hold no rate for it. */
export function fxFor(currency: string): Fx | null {
  const row = (fx.rates as Record<string, Row>)[currency];
  if (!row || typeof row.rate !== "number" || !Number.isFinite(row.rate)) return null;
  return {
    rate: row.rate,
    date: row.date ?? null,
    via: row.via,
    source: (fx.via as Record<string, string>)[row.via] ?? row.via,
  };
}

/**
 * How each currency writes an amount. `{n}` is the grouped number.
 *
 * Colombia writes its peso with a plain `$`, which is exactly the symbol the
 * dollar price beside it already uses. On a page showing both, that is not a
 * style choice, it is a way to misread a price by a factor of three thousand,
 * so the code is spelled out instead.
 */
const MONEY: Record<string, string> = {
  EUR: "{n} €",
  TRY: "{n} ₺",
  HKD: "HK${n}",
  TWD: "NT${n}",
  COP: "COP {n}",
  AED: "{n} د.إ",
  QAR: "{n} ر.ق",
};

/** The money template for a currency, e.g. "{n} €". Falls back to the code. */
export function moneyTpl(currency: string): string {
  return MONEY[currency] ?? `{n} ${currency}`;
}

/** Just the symbol, for labels like "cash fare (€)". */
export function moneySymbol(currency: string): string {
  return moneyTpl(currency).replace("{n}", "").trim();
}

/**
 * Format a converted amount, e.g. 411.6 → "412 €".
 *
 * Whole units on purpose: the figure is indicative, and decimals would imply
 * a precision a daily reference rate does not have. That holds just as well
 * for the peso, where the equivalent runs to seven figures.
 */
export function money(amount: number, currency: string, numLocale = "en-US"): string {
  return moneyTpl(currency).replace("{n}", Math.round(amount).toLocaleString(numLocale));
}

/**
 * Render a rate date the way the market writes dates: 12.08.2026 in German,
 * 12/08/2026 in French, 2026/08/12 in Chinese. Intl already knows all of it,
 * so there is no table of formats to keep in step with the locale registry.
 *
 * Noon UTC rather than midnight: an ISO date parses as UTC midnight, which is
 * the previous day in every negative offset, and a rate dated a day early is
 * the one thing this whole file exists to avoid.
 */
export function fxDate(iso: string, numLocale = "en-GB"): string {
  return new Intl.DateTimeFormat(numLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** German dates, kept for the German route's own copy. */
export function deDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** Format euros. Retained for the German page, which predates the registry. */
export function eur(amount: number, locale = "de-DE"): string {
  return money(amount, "EUR", locale);
}
