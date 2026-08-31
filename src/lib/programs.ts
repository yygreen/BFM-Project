/**
 * Program-shape helpers.
 *
 * The roster in airlines.json is a list of PROGRAMS — the things a buyer holds
 * an account in and the things we deliver into — even though it is keyed and
 * displayed by airline, because that is how people search for it. Most
 * programs cover exactly one airline, two cover several, and two share a
 * currency with each other. These helpers keep templates from having to know
 * which case they are looking at.
 */

export type Covered = { name: string; code: string };

/**
 * Every airline this program treats as its own metal.
 *
 * Falls back to the program's own airline, so `ownAirlines` only has to be
 * filled in where a program actually covers more than one and every template
 * can iterate the same shape either way.
 */
export function covers(a: {
  airline: string;
  code: string;
  ownAirlines?: Covered[];
}): Covered[] {
  return a.ownAirlines && a.ownAirlines.length
    ? a.ownAirlines
    : [{ name: a.airline, code: a.code }];
}

/** True when the program is worth telling a visitor it covers more than itself. */
export function coversMany(a: { ownAirlines?: Covered[] }): boolean {
  return (a.ownAirlines?.length ?? 0) > 1;
}

/**
 * "Air France and KLM", "Lufthansa, SWISS, Austrian Airlines and Brussels
 * Airlines" — the list as a sentence, for copy and meta descriptions.
 */
export function coversSentence(a: Parameters<typeof covers>[0]): string {
  const names = covers(a).map((c) => c.name);
  if (names.length < 2) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * An airline can be own-metal for exactly one program. Two would give the
 * "which miles do I need to fly X" question two contradictory answers, so this
 * fails the build rather than shipping the ambiguity — the same contract the
 * schema applies to slugs, colours and min/max.
 */
export function assertOwnAirlinesUnique(
  programs: { slug: string; ownAirlines?: Covered[] }[],
): void {
  const seen = new Map<string, string>();
  const clashes: string[] = [];
  for (const p of programs) {
    for (const c of p.ownAirlines ?? []) {
      const key = c.name.toLowerCase();
      const first = seen.get(key);
      if (first) clashes.push(`"${c.name}" is own-metal on both ${first} and ${p.slug}`);
      else seen.set(key, p.slug);
    }
  }
  if (clashes.length) {
    throw new Error(
      `ownAirlines must name each airline once across the roster:\n  ${clashes.join("\n  ")}`,
    );
  }
}
