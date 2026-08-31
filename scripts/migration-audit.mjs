/**
 * Migration audit: capture what the old site serves, then prove the new one
 * still answers for all of it.
 *
 *   node scripts/migration-audit.mjs --capture
 *       Crawls the LIVE WordPress site and writes migration-baseline.json.
 *       Run this BEFORE the DNS cutover, while the old site still exists.
 *       After the switch it is unrepeatable, which is the whole point of
 *       committing the file.
 *
 *   node scripts/migration-audit.mjs --verify https://target.example
 *       Replays every captured URL against the target, following redirects,
 *       and reports anything that lost its home. Run against staging before
 *       the cutover and against the live domain after it.
 *
 * Seeds come from three places rather than one, because no single one is
 * complete: the WordPress sitemap (what WP knows it publishes), every source
 * in vercel.json (URLs we already believe exist, several of which are not in
 * the sitemap), and the links on the old home page (navigation the sitemap
 * can miss).
 *
 * A redirect to the home page counts as a FAILURE, not a pass. It returns 200
 * and looks fine in a status column, while actually being the catch-all
 * swallowing a page that should have had a match. That is the failure mode
 * this script exists to surface.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const OUT = "migration-baseline.json";
const OLD = "https://www.buyflightmiles.com";

/**
 * WordPress plumbing. It answers on the old site and must NOT be carried over:
 * it is not content, it holds no ranking, and redirecting an API root at a
 * marketing page would be worse than letting it 404 honestly.
 */
const WP_INFRA = [/^\/wp-json/, /^\/wp-admin/, /^\/wp-includes/, /^\/wp-content/, /^\/wp-login/, /^\/xmlrpc\.php/];

/**
 * Old pages we send to the catch-all on purpose, listed so the run is green
 * only when every OTHER surprise has been dealt with. Both are airlines we do
 * not stock, and one of them stopped existing when Alitalia became ITA.
 */
const ACCEPTED_CATCHALL = ["/airlines/alitalia-millemiglia", "/airlines/avaair"];
const CONCURRENCY = 4;
const TIMEOUT_MS = 20000;

const args = process.argv.slice(2);
const mode = args.includes("--capture") ? "capture" : args.includes("--verify") ? "verify" : null;
if (!mode) {
  console.error("usage: migration-audit.mjs --capture | --verify <base-url>");
  process.exit(2);
}

const get = async (url, redirect = "manual") => {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { redirect, signal: ac.signal, headers: { "user-agent": "bfm-migration-audit" } });
  } finally {
    clearTimeout(t);
  }
};

/** Run tasks a few at a time: this is someone's production site. */
async function pool(items, worker) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) out.push(await worker(items[i++]));
    }),
  );
  return out;
}

const path = (u) => new URL(u, OLD).pathname.replace(/\/$/, "") || "/";

// ---- capture -----------------------------------------------------------
if (mode === "capture") {
  const seeds = new Set(["/"]);

  // 1. the WordPress sitemap, index and children
  const locs = async (url) => {
    try {
      const xml = await (await get(url, "follow")).text();
      return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    } catch {
      return [];
    }
  };
  for (const idx of await locs(`${OLD}/wp-sitemap.xml`)) {
    if (idx.endsWith(".xml")) for (const u of await locs(idx)) seeds.add(path(u));
    else seeds.add(path(idx));
  }

  // 2. every redirect source we have already written — these are URLs we
  //    believe exist, and several never appear in the sitemap
  try {
    for (const r of JSON.parse(readFileSync("vercel.json", "utf8")).redirects ?? []) {
      if (!r.source.includes(":")) seeds.add(r.source);
    }
  } catch {}

  // 3. links on the old home page, for navigation the sitemap misses
  try {
    const html = await (await get(OLD + "/", "follow")).text();
    for (const m of html.matchAll(/href="([^"#?]+)"/g)) {
      const h = m[1];
      if (h.startsWith("/") || h.startsWith(OLD)) {
        const p = path(h);
        if (!/\.(css|js|png|jpe?g|svg|webp|ico|woff2?|xml|json)$/i.test(p)) seeds.add(p);
      }
    }
  } catch {}

  const list = [...seeds].sort();
  console.log(`[audit] probing ${list.length} URLs on ${OLD}`);

  const rows = await pool(list, async (p) => {
    try {
      const res = await get(OLD + p);
      const loc = res.headers.get("location");
      return { path: p, status: res.status, redirectsTo: loc ? path(loc) : null };
    } catch (err) {
      return { path: p, status: 0, error: String(err?.message ?? err) };
    }
  });

  rows.sort((a, b) => a.path.localeCompare(b.path));
  const live = rows.filter((r) => r.status >= 200 && r.status < 400);
  writeFileSync(
    OUT,
    JSON.stringify({ capturedFrom: OLD, capturedAt: new Date().toISOString().slice(0, 10), urls: rows }, null, 2) + "\n",
  );
  const byStatus = rows.reduce((m, r) => ((m[r.status] = (m[r.status] ?? 0) + 1), m), {});
  console.log(`[audit] ${Object.entries(byStatus).map(([s, n]) => `${s}: ${n}`).join(", ")}`);
  console.log(`[audit] wrote ${OUT} — ${live.length} URLs that must keep working`);
}

// ---- verify ------------------------------------------------------------
if (mode === "verify") {
  const base = args[args.indexOf("--verify") + 1];
  if (!base) {
    console.error("--verify needs a base URL");
    process.exit(2);
  }
  if (!existsSync(OUT)) {
    console.error(`No ${OUT}. Run --capture against the old site first — you cannot make one after the switch.`);
    process.exit(2);
  }
  const baseline = JSON.parse(readFileSync(OUT, "utf8"));
  // Only URLs the old site actually served, minus its plumbing: a 404 there
  // needs no home here, and neither does an API root.
  const must = baseline.urls.filter(
    (u) => u.status >= 200 && u.status < 400 && !WP_INFRA.some((re) => re.test(u.path)),
  );
  console.log(`[audit] replaying ${must.length} URLs against ${base}`);

  const rows = await pool(must, async (u) => {
    // Where the OLD site ultimately put a visitor. Several of its own URLs
    // already redirected to the home page, and matching that is parity rather
    // than a loss — comparing against "/" blindly reported those as failures.
    const expected = u.redirectsTo ?? u.path;
    try {
      const res = await get(base + u.path, "follow");
      return { path: u.path, expected, status: res.status, landed: new URL(res.url).pathname.replace(/\/$/, "") || "/" };
    } catch (err) {
      return { path: u.path, expected, status: 0, landed: null, error: String(err?.message ?? err) };
    }
  });

  const dead = rows.filter((r) => r.status !== 200);
  // The catch-all eating a page that deserved a match. Only a loss when the
  // old site did NOT already send it to the home page itself.
  const swallowed = rows.filter(
    (r) =>
      r.status === 200 &&
      r.landed === "/" &&
      r.expected !== "/" &&
      !ACCEPTED_CATCHALL.includes(r.path),
  );
  const ok = rows.length - dead.length - swallowed.length;

  for (const r of rows.sort((a, b) => a.path.localeCompare(b.path))) {
    const bad = dead.includes(r) || swallowed.includes(r);
    const mark = bad ? (r.status !== 200 ? "✗" : "!") : r.landed === r.path ? "=" : "→";
    if (mark !== "=") console.log(`  ${mark} ${r.path.padEnd(46)} ${r.status} ${r.landed ?? r.error ?? ""}`);
  }

  console.log(`\n[audit] ${ok} landed somewhere real, ${swallowed.length} swallowed by the home page, ${dead.length} dead`);
  if (dead.length || swallowed.length) {
    console.error("\nEvery line above marked ✗ or ! is a URL the old site served and this one does not.");
    process.exit(1);
  }
  console.log("[audit] every URL the old site served has a home here.");
}
