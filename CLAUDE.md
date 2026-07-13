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

**One data file drives every page.** Add an object to `src/data/airlines.js` and a full page is generated at `/buy/[slug]/`. Growing the site is data entry, not page-building. Never hand-build individual airline pages.

```
src/
  data/airlines.js         ← single source of truth (one object per program)
  styles/flightdeck.css    ← the entire design system (tokens + components), imported in Base.astro
  layouts/Base.astro       ← HTML shell, SEO meta, JSON-LD, header/footer
  components/              ← PricingCard, TrustStrip, CompareTable, Faq
  pages/
    index.astro           ← homepage
    buy/[slug].astro      ← airline page template (getStaticPaths over the data)
```

## Design system: "Flightdeck" — follow strictly, do not regress

Register: modern **aviation / instrument-panel**. Light, navy + steel + a single azure accent (`#1F4FA3`). It must read as **precision, security, reliability** — NOT a fintech/banking app, NOT a travel/vacation blog. These rules are deliberate corrections; keep them:

- **Every number** (price, delivery window, stat) is set in **monospace**. The mono figures are the signature.
- **Uppercase, letter-spaced labels appear in exactly one place: the `.spec-strip`.** Everywhere else, labels are quiet **sentence case**. Do **not** add "eyebrow"/kicker labels above headings. The `.kicker` token exists but is used at most once per page (e.g. the hero) — not as a hat on every section.
- **Squared corners.** Radius is 2–3px (`--radius`, `--radius-card`). No pills, no rounded 8–12px cards. Precision comes from tight geometry + hairlines, not decoration.
- **Status color (green/amber/red) is reserved for real states only** — in stock / limited / error. Never decorative.
- **Restraint = confidence.** No hype words in copy. State the outcome and the number. ("Delivered within 24 hours", not "Lightning-fast delivery!")

All design tokens live in `:root` in `flightdeck.css`. **Reuse tokens; never hardcode hex values.**

## SEO conventions

- Per-page `title` / `description` / `canonical` / OG via `Base.astro` props.
- **Product** JSON-LD on airline pages; **Organization** on the homepage.
- URL pattern is `/buy/{slug}` — consistent by design (the old WordPress site had inconsistent URLs). On migration, set **301 redirects** from the old URLs to preserve equity.
- This is a **programmatic SEO play** aimed at ~40 programs eventually. Keep markup clean and keep the `related` internal links intact.
- Add `@astrojs/sitemap` when convenient (one-line integration; `site` is already set in `astro.config.mjs`).

## Data conventions

- `pricePerMile` is in **cents**. The `$ per 1,000` figure is **derived** (`× 10`) in templates — don't store both.
- Five programs carry **real audited pricing**: KrisFlyer 1.8, Qatar 1.8, ANA 1.9 (72h), EVA 1.95 (48h), plus BA.
- Entries marked `// PLACEHOLDER` (Delta, United, American, and BA's delivery) need **real values before launch**.

## Business constraints (important)

- **Payment/checkout stays OFF this site.** The "Buy" buttons currently anchor to the programs section — wire them to the real order flow (a form → manual fulfillment), decoupled from the static site so hosting uptime is never coupled to payment-policy enforcement.
- Accepted payment methods are **USDT / wire / cash**. Do **NOT** advertise credit cards or PayPal — that copy is wrong on the current live site and must not be carried over. The payment-methods answer in `Faq.astro` is a placeholder to fill with true methods.
- **Trust is the #1 competitive lever**; buyers fear scams. Only publish trust stats that are **real and verifiable**. The figures in `TrustStrip.astro` (rating, transfer count, completion %) are placeholders and must be replaced with true numbers — never invented.
- **Not affiliated** with any airline or loyalty program (the footer says so). Don't imply a partnership or use airline logos/trademarks in a way that suggests one.

## TODO before launch

1. Replace `// PLACEHOLDER` pricing + delivery in `src/data/airlines.js`.
2. Replace trust figures in `src/components/TrustStrip.astro` with verifiable numbers.
3. Fill the payment-methods answer in `src/components/Faq.astro` with actual methods.
4. Wire the "Buy" buttons to the real order/quote flow, and set the **Web3Forms access key** in `src/pages/agents.astro` (register the key with the client's Gmail so partner applications email there).
5. Expand the roster toward the full list (Southwest, Alaska, JetBlue, Hawaiian, Frontier, Turkish, Etihad, Emirates, Lufthansa, …).
6. Add `@astrojs/sitemap`.
7. Set 301 redirects from the old WordPress URLs at deploy time.
