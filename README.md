# buyflightmiles — Astro site

A static, code-owned site for buyflightmiles. Built on Astro with the **Flightdeck** design system. One page is generated per airline program from a single data file, so growing the site is data entry, not page-building.

## Run it

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # static output to ./dist
npm run preview    # preview the production build
```

## Structure

```
src/
  data/airlines.js         ← the single source of truth. Add a program here → a page appears.
  styles/flightdeck.css    ← the whole design system (tokens + components)
  layouts/Base.astro       ← HTML shell, SEO meta, JSON-LD, header/footer
  components/               ← PricingCard, TrustStrip, CompareTable, Faq
  pages/
    index.astro            ← homepage (hero, program grid, trust, compare, how-it-works, FAQ)
    buy/[slug].astro       ← the airline page template (generates all program pages)
```

## Add or edit a program

Open `src/data/airlines.js` and add an object (or edit an existing one):

```js
{
  slug: "air-canada-aeroplan",
  program: "Aeroplan",
  airline: "Air Canada",
  alliance: "Star Alliance",
  pricePerMile: 1.7,          // cents
  min: 25000, max: 500000,
  delivery: "Within 48 hours",
  inStock: true,
  heroHeadline: "Buy Air Canada Aeroplan miles.",
  heroSub: "…",
  metaTitle: "…", metaDescription: "…",
  related: ["united-mileageplus", "ana"]
}
```

Rebuild and the page exists at `/buy/air-canada-aeroplan/`.

## Deploy

Static output, so it hosts anywhere. Two easy paths:
- **Netlify / Vercel (Git):** push this repo, set build command `npm run build`, publish directory `dist`. Auto-deploys on every push.
- **Drag-and-drop:** run `npm run build` and drop the `dist` folder into Netlify.

## Before launch — fill these in

- **Pricing marked `// PLACEHOLDER`** in `airlines.js` (Delta, United, American, BA and their delivery windows). The five live programs already carry real pricing.
- **Trust numbers** in `components/TrustStrip.astro` (rating, transfer count, completion %). Use real, verifiable figures only.
- **Payment methods** in `components/Faq.astro` — currently a placeholder. Fill with what you actually process (this is the line that's wrong on the current live site).
- **Checkout / order flow** — the "Buy" buttons currently anchor to the programs section. Wire them to your real order path (form → manual fulfillment), kept off-platform.
