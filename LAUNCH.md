# Launch checklist — turning client answers into a live site

Every outstanding client input maps to **one field in one of two JSON files**. No `.astro` editing required.

```bash
npm run check:launch   # what's still outstanding, keyed to the call agenda
npm run build          # validates both files; fails loudly on a bad value
```

| File | Holds |
|---|---|
| `src/data/airlines.json` | Per-program pricing, min/max, delivery windows (agenda item 1) |
| `src/data/site.json` | Everything else the client must confirm (items 2, 3, 4, 12) |

## The `verified` rule

Both files use `verified` flags. **A claim renders only when its flag is `true`.**

Unverified content is *suppressed, not faked* — an unconfirmed rating doesn't ship as a
placeholder number, it doesn't ship at all. So the site is honest and publishable **today**,
and each client answer switches on one more piece. Filling in a value is one edit; flipping
the flag is what publishes it.

## The `placeholder` escape hatch — staging only

A few trust values in `site.json` currently carry **`"placeholder": true`** alongside
`"verified": true`. That combination means: *this number renders, but nobody has confirmed
it.* It exists so the trust section can be design-reviewed as a populated layout instead of
a half-empty grid — you cannot judge spacing, tile count or the review badges against
suppressed data.

`npm run check:launch` treats **every placeholder as a BLOCKER**, so the site cannot be
declared launch-ready while one is present. To clear one, either:

- replace the value with the confirmed figure and **delete the `"placeholder": true` line**, or
- set `"verified": false` to hide the claim again.

Currently staged (all fictive until the client confirms): Trustpilot 4.8/5 (2,000 reviews),
founded 2016, 10,000 transfers, 99.9% completion.

The **Google** entry is kept in `reviews` at `verified: false`, so it renders nowhere. The
2.6★ profile is a real observation worth not losing track of — publishing it next to a 4.8
invites the buyer to ask which one is true — but the decision to cite it or not is the
client's, and it stays suppressed until they make it.

> The Trustpilot **TrustBox embed** is a separate thing and is *not* staged — it needs a real
> `businessUnitId`/`templateId` from the Trustpilot dashboard and loads their script, so it
> ships nothing at all until then. What renders today is our own review badge.

---

## Blockers — needed before taking real orders

### Agenda 1 — Pricing, min/max, delivery → `src/data/airlines.json`

> **The order limits are not confirmed for any programme.** All thirteen have
> carried an identical `min: 25000` / `max: 500000` since the data file was
> created — a uniform default, never a per-programme policy, and never checked
> with the client. `priceVerified` covers the per-mile rate only. Until
> `limitsVerified` is `true`, the quote widget *guides* with these numbers
> ("orders usually start around 25,000 miles — ask and we'll quote a smaller
> one") rather than refusing the order, so nobody is turned away on a figure we
> invented. Ask the client for two things per programme: **the smallest order
> they'll take**, and **the largest single transfer the programme itself
> permits** — those are different limits from different sources.

Currently unconfirmed: **Delta SkyMiles, United MileagePlus, American AAdvantage, BA Avios.**

```jsonc
{
  "pricePerMile": 1.9,          // CENTS. The "$ per 1,000" figure is derived (×10) — don't store both
  "min": 25000,
  "max": 500000,
  "delivery": "Within 48 hours", // keep the "Within …" prefix
  "priceVerified": true,         // ← flip once the number is confirmed
  "deliveryVerified": true,      // ← flip once the window is confirmed
  "limitsVerified": true         // ← flip once min/max are confirmed
}
```

Until flipped, those pages still go live — showing a `~` indicative rate, a "Request a live
quote" CTA, and **no price in the Product JSON-LD**. Also re-confirm the four audited rates
(KrisFlyer 1.8 / Qatar 1.8 / ANA 1.9 / EVA 1.95) are still current.

### Agenda 2 — Payment methods → `site.json` → `payments`

```jsonc
"payments": {
  "methods": ["USDT", "Bank wire", "Cash"],
  "usdtNetworks": ["TRC-20", "ERC-20"],
  "minOrderUsd": 500,
  "cardAnswer": "We don't accept cards or PayPal — …",  // exact words for the FAQ
  "verified": true
}
```

⚠️ **Never add cards or PayPal unless the client explicitly confirms them.** The old WordPress
site advertised both incorrectly and that copy was deliberately not carried over.
Until verified, the FAQ shows: *"We'll confirm the accepted payment methods when we send your quote."*

### Agenda 3 — Where enquiries land → `site.json` → `contact`

```jsonc
"contact": {
  "orderEmail":        "orders@…",   // quote/order form + fallback text
  "agentEmail":        "partners@…", // partner application form
  "web3formsKeyQuote":  "…",         // register at web3forms.com against orderEmail
  "web3formsKeyAgents": "…",         // register against agentEmail (can be the same key if one inbox)
  "whatsapp": "", "telegram": "",
  "verified": true
}
```

**Both forms are inert until this is done** — they refuse to submit and show a fallback
pointing at the email address instead. No enquiry can silently vanish.

### Agenda 4 — Guarantee + delivery wording → `site.json` → `guarantee`, `delivery`

```jsonc
"guarantee": {
  "shortLabel": "delivery guarantee",
  "summary": "Miles land in your account, or you're refunded.",
  "policy": "Full policy text — what's covered, the window, how a refund is issued.",
  "verified": true
},
"delivery": { "howItWorks": "How a transfer actually reaches the account.", "verified": true }
```

While unverified, the guarantee tile, the "What if my miles don't arrive?" FAQ entry, and the
hero's guarantee clause are all suppressed (the hero falls back to *"your exact rate confirmed
before you pay"*, which is true regardless).

---

## Carrier logos — a decision, not a task

Every programme renders an abstract tail-fin badge in the carrier's brand
colour. The slot for a real logo exists and is one field:

```jsonc
// airlines.json
{ "logo": "/logos/delta.svg", "logoAlt": "Delta Air Lines" }
```

Drop the file under `public/logos/` and the badge is replaced everywhere it
appears — programme grid, pricing card, and the quote widget's dropdown.

**It is deliberately empty.** The footer states we are not affiliated with any
airline, and most carriers' terms prohibit reselling their miles. Displaying
their marks next to a resale offer is the clearest available signal of
affiliation, and it is what draws a cease-and-desist. Nominative use ("we sell
Delta miles" in text) is far more defensible than reproducing the logo.

If the client wants logos, that's their call to make with their own legal
advice — the mechanism is ready and takes a minute. Don't add files scraped
from the carriers' own sites on the assumption it's fine.

## Non-blocking — the site is live and honest without these

### Airline direct-buy rate → `site.json` → `benchmark` (we can source this ourselves)

Every "you save" figure rests on what the airline charges for its own miles. That number was
previously a hardcoded `4¢` appearing in both the calculator and the compare table — unsourced,
and uniform across programs even though each airline prices differently.

```jsonc
"benchmark": { "directBuyCents": 3.5, "source": "Airline published pricing, Aug 2026", "verified": true }
```

Per-program overrides are more defensible and take precedence:

```jsonc
// airlines.json
{ "directBuyCents": 2.75 }   // what THIS airline charges
```

Until one exists, the calculator's savings row and the entire us-vs-direct table are
suppressed. **This is not a client input** — it's public airline pricing we can research.
Sourcing it restores the single most persuasive number on the page.

### Agenda 9 — Partner qualification bar → `site.json` → `partner`

```jsonc
"partner": { "qualifyText": "from $25k/month, or IATA-accredited", "verified": true }
```

`/agents` advertises "partner rates that scale with volume" in the main nav, where **retail
buyers see it**. With no stated bar, that tells a direct visitor a cheaper price exists and
they aren't getting it. A visible threshold makes the cheaper price legibly *not available to
them*, which defends the retail price instead of undermining it. Needs the client's real
volume tier (agenda item 9).


### Agenda 12 — Real proof → `site.json` → `trust`, `testimonials`

```jsonc
"trust": {
  "rating": { "value": 4.8, "outOf": 5, "source": "Trustpilot", "reviewCount": 2000, "verified": true },
  "transfersCompleted": { "value": 10000, "verified": true },
  "completionRate":     { "value": 99.9,  "verified": true },
  "accountLocks":       { "value": 0,     "verified": true },
  "supportHours":       { "value": "24/7", "verified": true }
},
"testimonials": [
  { "quote": "…", "name": "Daniel R.", "role": "Booked Qatar Qsuite to Doha",
    "source": "Trustpilot", "verified": true }
]
```

**Only real, verifiable numbers.** These were previously invented placeholders sitting live on
the preview (`4.8/5`, `10,000+`, `99.9%`) — they have been removed and now render only once
verified. The testimonials section hides completely while no verified quote exists, so the page
never shows an empty shelf.

Note the tension with agenda item 12: the Google Business Profile is at **2.6★** while
Trustpilot is at 4.8. If a rating goes on the site, cite the source explicitly (`source` field).

---

## Where the values surface

| Field | Appears on |
|---|---|
| `airlines.json` price/delivery | Homepage grid + hero card, every `/buy/*` page, calculator, pricing card, Product JSON-LD |
| `payments.*` | FAQ (homepage + every program page) |
| `contact.*` | Quote form (homepage + every program page), partner form on `/agents` |
| `guarantee.*` | Trust strip, FAQ, homepage hero |
| `trust.*` | Trust strip, homepage hero stat line, FAQ legitimacy answer |
| `testimonials` | Homepage testimonials section |

The hero feature card auto-selects the **cheapest in-stock program with a confirmed price**, so
a pricing update moves the homepage on its own — no hand-editing.
