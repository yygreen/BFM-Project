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
  data/airlines.json       ← the single source of truth. Add a program here → a page appears.
  content.config.ts        ← Zod schema; validates airlines.json at build time
  styles/flightdeck.css    ← the whole design system (tokens + components)
  layouts/Base.astro       ← HTML shell, SEO meta, JSON-LD, header/footer
  components/               ← PricingCard, TrustStrip, CompareTable, Faq, Emblem, Testimonials
  pages/
    index.astro            ← homepage (hero, program grid, trust, compare, how-it-works, FAQ)
    buy/[slug].astro       ← the airline page template (generates all program pages)
```

## Add or edit a program

Open `src/data/airlines.json` and add an entry (or edit an existing one). The `id` is the URL slug:

```json
{
  "id": "air-canada-aeroplan",
  "order": 9,
  "program": "Aeroplan",
  "airline": "Air Canada",
  "alliance": "Star Alliance",
  "code": "AC",
  "color": "#D82A20",
  "pricePerMile": 1.7,
  "priceVerified": false,
  "min": 25000,
  "max": 500000,
  "delivery": "Within 48 hours",
  "deliveryVerified": false,
  "inStock": true,
  "heroHeadline": "Buy Air Canada Aeroplan miles.",
  "heroSub": "…",
  "metaTitle": "…",
  "metaDescription": "…",
  "related": ["united-mileageplus", "ana"],
  "sweetSpots": []
}
```

Rebuild and the page exists at `/buy/air-canada-aeroplan/`. The schema in `content.config.ts` validates every field, so a typo or a missing value fails the build with a clear error instead of shipping a broken page. Set `priceVerified` / `deliveryVerified` to `true` once the numbers are confirmed real.

## Deploy

Static output, so it hosts anywhere. Two easy paths:
- **Netlify / Vercel (Git):** push this repo, set build command `npm run build`, publish directory `dist`. Auto-deploys on every push.
- **Drag-and-drop:** run `npm run build` and drop the `dist` folder into Netlify.

## Before launch — fill these in

- **Pricing marked `// PLACEHOLDER`** in `airlines.js` (Delta, United, American, BA and their delivery windows). The five live programs already carry real pricing.
- **Trust numbers** in `components/TrustStrip.astro` (rating, transfer count, completion %). Use real, verifiable figures only.
- **Payment methods** in `components/Faq.astro` — currently a placeholder. Fill with what you actually process (this is the line that's wrong on the current live site).
- **Checkout / order flow** — the "Buy" buttons currently anchor to the programs section. Wire them to your real order path (form → manual fulfillment), kept off-platform.
