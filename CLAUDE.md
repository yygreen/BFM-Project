# CLAUDE.md

Context for Claude Code working on **buyflightmiles** — a static Astro site for an airline-miles resale storefront (premium-cabin award tickets). Read this before making changes.

## What this project is

- Marketing/storefront site for buyflightmiles.com, migrating **off WordPress** onto a code-owned static Astro site.
- Run entirely **in-house by the agency**. The client does **not** edit the site — there is no CMS or visual editor, and none is wanted. All edits go through code (you or the team).
- Deploy target: **Netlify or Vercel**, static output.

## Run / build

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output → ./dist
npm run preview
```

Node 18+ required for the project (Node 22 LTS recommended).

## Architecture — the core idea

**One data file drives every page.** Add an entry to `src/data/airlines.json` and a full page is generated at `/buy/[slug]/`. Growing the site is data entry, not page-building. Never hand-build individual airline pages. The data is a **schema-validated content collection** (`src/content.config.ts`): a missing `pricePerMile`, a bad `slug`/`code`/`color`, an unknown `alliance`, or `max < min` fails `npm run build` with a clear error instead of shipping a broken page.

```
src/
  data/airlines.json       ← single source of truth (one entry per program)
  content.config.ts        ← Zod schema that validates airlines.json at build time
  styles/flightdeck.css    ← the entire design system (tokens + components), imported in Base.astro
  layouts/Base.astro       ← HTML shell, SEO meta, JSON-LD, header/footer
  components/              ← PricingCard, TrustStrip, CompareTable, Faq, Emblem, Testimonials
  content/blog/*.md        ← one Markdown file per post (filename = URL slug)
  pages/
    index.astro           ← homepage
    buy/[slug].astro      ← airline page template (getStaticPaths over getCollection("airlines"))
    blog/index.astro      ← post listing
    blog/[...slug].astro  ← post template
```

## Blog

Posts are a second content collection (`src/content/blog/*.md`), validated by the same
build-time contract as the airline data. Copy `_template-news-post.md` to start one.

- **`draft: true` excludes a post from the build** — use it for anything not yet fact-checked.
- **`category: "News"` or `"Devaluations"` requires a `source` URL.** The schema enforces it.
  A devaluation claim that turns out to be wrong costs more trust than the post earns, and
  this is a market where buyers are already scam-wary.
- `programs: [...]` takes slugs from `airlines.json` and renders them as links back to the
  money pages with live prices. A typo'd slug **fails the build** rather than shipping a dead
  link — that internal linking is most of the SEO value of posting.
- `title` (≤75) and `description` (≤200) are used verbatim as SEO meta; write them for a
  search result. Posts emit Article JSON-LD and land in the sitemap automatically.

## Design system: "Warm Deck"

The site was deliberately moved **off** the earlier austere "Flightdeck" look (it read as too sterile/clinical) toward a **warmer, more human** register — closer to friendly consumer sites like themilesmarket.com — while staying credible and trustworthy for a high-value purchase. Keep it warm and approachable, but never cheap or hypey.

Register: **trustworthy but friendly**. Warm paper neutrals, navy + azure (`--acc #2159B8`) with a **warm gold accent** (`--gold #E1A340`). It should feel welcoming and reassuring — not a cold instrument panel, not a loud fintech app.

- **Rounded, soft geometry.** Cards use `--radius-card` (18px); buttons and badges are **pills** (`--radius-pill`). Gentle depth via the `--shadow*` tokens, not hairlines-only.
- **Warm palette.** Page background is warm off-white (`--page`), sections alternate white / `.tinted` (`--raised`) for rhythm. Use the gold accent sparingly for warmth (stars, one step icon, hero wash).
- **Numbers** (prices, delivery windows) stay in **monospace** — it's a clean signature and keeps figures scannable. This is the one holdover from the old system worth keeping.
- **`.kicker`** is now a small pill and may head sections (used more freely than before).
- **Imagery / illustration is welcome** — the hero route illustration, icon bubbles (`.ic`), and avatars are part of the warmth. Keep them geometric and on-palette.
- **Status color (green/amber/red) is reserved for real states only** — in stock / limited / error. Never decorative.
- **Copy is warm but honest.** Friendly and human, but state real outcomes and numbers — no invented hype ("Delivered within 24 hours", not "Lightning-fast!").

All design tokens live in `:root` in `flightdeck.css`. **Reuse tokens; never hardcode hex values.**

> Note: the file is still named `flightdeck.css` and some class names carry the old name — that's fine, only the visual direction changed.

## SEO conventions

- Per-page `title` / `description` / `canonical` / OG via `Base.astro` props.
- **Product** JSON-LD on airline pages; **Organization** on the homepage.
- URL pattern is `/buy/{slug}` — consistent by design (the old WordPress site had inconsistent URLs). On migration, set **301 redirects** from the old URLs to preserve equity.
- This is a **programmatic SEO play** aimed at ~40 programs eventually. Keep markup clean and keep the `related` internal links intact.
- Add `@astrojs/sitemap` when convenient (one-line integration; `site` is already set in `astro.config.mjs`).

## Data conventions

- Data lives in `src/data/airlines.json` (one entry per program, keyed by `id` = slug) and is validated by the Zod schema in `src/content.config.ts`. Templates read it via `getCollection("airlines")` and map `{ slug: e.id, ...e.data }`; entries are sorted by the `order` field.
- `pricePerMile` is in **cents**. The `$ per 1,000` figure is **derived** (`× 10`) in templates — don't store both.
- Real audited pricing: KrisFlyer 1.8, Qatar 1.8, ANA 1.9 (72h), EVA 1.95 (48h). These have `priceVerified: true` / `deliveryVerified: true`.
- **`priceVerified` / `deliveryVerified` replace the old `// PLACEHOLDER` comments.** Anything `false` (Delta, United, American, BA) needs a **real, confirmed value before launch** — then flip the flag to `true`.

## Business constraints (important)

- **Payment/checkout stays OFF this site.** The "Buy" buttons currently anchor to the programs section — wire them to the real order flow (a form → manual fulfillment), decoupled from the static site so hosting uptime is never coupled to payment-policy enforcement.
- Accepted payment methods are **USDT / wire / cash**. Do **NOT** advertise credit cards or PayPal — that copy is wrong on the current live site and must not be carried over. The payment-methods answer in `Faq.astro` is a placeholder to fill with true methods.
- **Trust is the #1 competitive lever**; buyers fear scams. Only publish trust stats that are **real and verifiable**. The figures in `TrustStrip.astro` (rating, transfer count, completion %) are placeholders and must be replaced with true numbers — never invented.
- **Not affiliated** with any airline or loyalty program (the footer says so). Don't imply a partnership or use airline logos/trademarks in a way that suggests one.

## Client-supplied facts — `src/data/site.json`

Everything the **client** must confirm lives in exactly two data files, never in components:

- `src/data/airlines.json` — per-program pricing, min/max, delivery windows
- `src/data/site.json` — payment methods, enquiry inboxes + Web3Forms keys, guarantee text, trust stats, testimonials (validated by `src/lib/site.ts`)

Both use **`verified` flags, and a claim renders only when its flag is `true`.** Unverified
content is *suppressed, not faked* — an unconfirmed rating doesn't ship as a placeholder
number, it doesn't ship at all. This is what lets the site be honest and publishable before
every answer is in. **Never hardcode a client-supplied fact into a component**, and never
invent a trust figure to fill a gap — add the field and leave it unverified.

Run `npm run check:launch` for what's still outstanding (keyed to the client-call agenda);
`npm run build` fails loudly on a malformed value. Full field-by-field map: **`LAUNCH.md`**.

## TODO before launch

1. Fill the outstanding client inputs — see `LAUNCH.md` and `npm run check:launch`. Blockers: program pricing/delivery for Delta, United, American, BA; payment methods; enquiry inboxes + Web3Forms keys; guarantee text.
2. Replace the suppressed trust stats and testimonials with real, verifiable ones (`site.json` → `trust`, `testimonials`). Note the Google Business Profile sits at 2.6★ vs 4.8 on Trustpilot — if a rating ships, cite its `source`.
3. Expand the roster toward the full list (Southwest, Alaska, JetBlue, Hawaiian, Frontier, Turkish, Etihad, Emirates, Lufthansa, …).
4. Set 301 redirects from the old WordPress URLs at deploy time.
