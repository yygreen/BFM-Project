/**
 * Every redirect destination must be a page that exists.
 *
 * The 301 map is the only part of the site nothing else references: rename a
 * slug and the build's own checks stay green, the link crawl stays green, and
 * the map quietly starts pointing at 404s. That is exactly what happened when
 * six slugs were renamed to carry their airline — nine redirects broke, and
 * the pages they carried are the ones holding the old site's rankings.
 *
 * So this runs after every build and fails it. A redirect that lands on a 404
 * is worse than no redirect: it spends the visitor's click and the crawler's
 * budget to arrive nowhere.
 *
 * Sources are not checked. They are URLs on a site we no longer control.
 */
import { readFileSync, existsSync } from "node:fs";

const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
const redirects = cfg.redirects ?? [];

const broken = [];
for (const r of redirects) {
  // wildcards resolve at request time, so there is nothing to check here
  if (r.source.includes(":") || r.destination.includes(":")) continue;
  // strip the fragment and query: /#programs is the home page
  const path = r.destination.split("#")[0].split("?")[0].replace(/\/$/, "");
  if (path === "") continue;
  if (!existsSync(`dist${path}/index.html`)) broken.push(r);
}

if (broken.length) {
  console.error(`\n\x1b[31m\x1b[1m${broken.length} redirect(s) point at a page that does not exist:\x1b[0m`);
  for (const r of broken) console.error(`  ${r.source}  →  ${r.destination}`);
  console.error(
    "\nEither the destination slug changed, or the page was never built.\n" +
      "Fix vercel.json, or remove the redirect if the page is gone for good.\n",
  );
  process.exit(1);
}

console.log(`✓ ${redirects.length} redirects, every destination resolves`);
