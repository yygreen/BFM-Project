# SEO map and build queue

What the site targets, what it misses, and what to build next. Derived from two
Semrush exports pulled 11 Aug 2026:

- **Position tracking** (33 tracked keywords, the live WordPress site) — what we
  actually rank for today.
- **Keyword gap** (449 keywords vs `buyairlinemiles.com`, `airmileshk.com`,
  `milesbuyer.com/buy-miles/`) — what the vertical ranks for and we don't.

Both are samples, not the full organic footprint. Treat the volumes as relative
weights rather than traffic forecasts.

---

## 1. The one finding that reorders everything

**Nobody in this vertical ranks for the head terms. Not us, not the three
competitors.**

Across the 449-keyword gap (147,330/mo of search volume):

| | keywords | volume |
|---|---:|---:|
| Any competitor in the **top 10** | 5 | 590/mo |
| Any competitor in the **top 20** | 26 | 3,830/mo |
| Everyone stuck on page 3+ | 423 | 143,500/mo |

`buy delta miles` is 8,100/mo at KD 59. The best any miles reseller manages is
**#26**. Those SERPs belong to Delta itself and to the points blogs, and no
amount of on-page work on a reseller domain changes that in the near term.

So the gap file is not a list of things competitors took from us. It is mostly a
list of things nobody in our niche can win.

### Where the vertical *does* win

The five top-10 positions any competitor holds are all one program, all long tail,
all low difficulty:

| keyword | vol | KD | who | pos |
|---|---:|---:|---|---:|
| purchase hawaiian miles | 320 | 24 | buyairlinemiles | 6 |
| hawaiian air buy miles | 50 | 21 | buyairlinemiles | 7 |
| buy hawaiian miles bonus | 40 | 11 | buyairlinemiles | 7 |
| hawaii airline buy miles | 40 | 19 | buyairlinemiles | 9 |
| buy delta skymiles cheap | 140 | 28 | milesbuyer | 10 |

Our own top-10s, from the tracking export, follow the identical pattern: EVA and
Qatar long tails at KD 11–27, several at #1.

**The rule this gives us: KD under ~30 is winnable on a reseller domain. KD 45+
is not, for anyone.** Every recommendation below follows from it.

---

## 2. Where the volume actually sits

Of the 147,330/mo we don't rank for:

| bucket | keywords | volume | have a page? |
|---|---:|---:|---|
| Programs already on our roster | 325 | 111,220 | **yes, 21 of them** |
| Hotel points (Marriott, Hilton, Hyatt, IHG) | 77 | 30,140 | no — currency class we don't sell |
| Everything else | 47 | 5,970 | mixed |

Three quarters of the gap is on programs where we already have a `/buy/` page
**and** a `/calculator/` page. So the problem is not roster coverage. It is that
those pages are thin: three one-line sweet spots and a price.

### By program, and why Delta is the wrong place to start

`lowKD` is the share of that program's gap volume sitting under KD 35 — the part
that is actually reachable.

| our page | gap kw | gap vol | lowKD vol | reachable share |
|---|---:|---:|---:|---:|
| `/buy/hawaiian-miles` | 34 | 4,180 | 2,540 | **61%** |
| `/buy/turkish-miles-smiles` | 6 | 810 | 630 | **78%** |
| `/buy/cathay-pacific-asia-miles` | 4 | 1,610 | 610 | **38%** |
| `/buy/alaska-mileage-plan` | 7 | 610 | 390 | **64%** |
| `/buy/jetblue-trueblue` | 18 | 5,930 | 500 | 8% |
| `/buy/delta-skymiles` | 113 | 50,890 | 2,530 | **5%** |
| `/buy/southwest-rapid-rewards` | 59 | 21,610 | 710 | 3% |
| `/buy/american-aadvantage` | 44 | 17,800 | 420 | 2% |
| `/buy/flying-blue` | 13 | 3,780 | 110 | 3% |
| `/buy/united-mileageplus` | 15 | 2,640 | 40 | 2% |

Delta looks like the prize at 50,890/mo and is the worst use of the next week:
95% of it is KD 45–70. Hawaiian carries a sixth of Delta's volume with **the same
amount of reachable volume**, and a competitor has already proven top-10 is
achievable there.

### Query shape

| type | keywords | volume |
|---|---:|---:|
| buy / purchase | 305 | 121,090 |
| program or brand name | 105 | 18,470 |
| value / worth / calculator | 12 | 3,070 |
| status & elite tiers | 16 | 3,040 (all hotel) |
| how to use / book / redeem | 9 | 1,510 |

The transactional cluster is enormous but repeats one intent in dozens of
phrasings — Delta alone has 113 variants of "buy delta miles". That is one page's
job, not 113 pages. What it needs is body copy and FAQ entries that use the real
phrasings: *can you buy*, *how much does it cost to buy*, *how to buy*, *cheap*.

---

## 3. Topical cluster map

```mermaid
mindmap
  root((buyflightmiles))
    Transactional
      buy {program} miles
        /buy/{slug} x21 built
        variants buy X / X buy / purchase X / can you buy / how to buy / cost to buy / cheap
        121,090/mo gap, mostly KD 45+
      what the airline charges
        directBuy sourced on 5, shown on 3
        withheld where their promo beats us
    Valuation
      what are X miles worth
        /calculator/{slug} x21 built
        wins AI Overviews today
        3,070/mo gap
    Program mechanics
      award chart
      do X miles expire
      upgrade with miles
      program name and alliance
        LIVES ON /buy, short facts
        25,040/mo informational gap
        only 3,080 of it under KD 30
        demand concentrated in 4 programs
        built on 3 of 21
    Program is stale
      currency renamed or merged
      alliance changed
        found on Hawaiian and Alaska
        no keyword, a correctness axis
        factsChecked dates it
        written up as a News post
    Redemption
      how to use X miles
      best uses and sweet spots
        sweetSpots field
        1,510/mo gap
    Currency level
      buy avios points
        NO PAGE
        390/mo gap, 4,400/mo UK head term
        comprar avios 1,300/mo KD 26 in Spain
    Trust and legitimacy
      is buying miles legal
      miles seller scam
        blog covers this
    Languages
      9 pages, 6 languages, one route
      ar x3 built, ranks 1-4
      de tr fr es zh-tw zh-hk built
      none native-reviewed yet
      Simplified Chinese NOT built
        里程币 1,300/mo at KD 16
    Hotel points
      Marriott 22,180/mo
      Hilton 5,560/mo
      Hyatt 2,400/mo
        BUSINESS QUESTION, not an SEO one
```

One branch still has no page at all: **currency level** (Avios). One is a
business decision: **hotel points**. **Program mechanics** has been answered
since this map was drawn: the short, purchase-critical facts live on `/buy`,
and the long story goes to a post that links back.

The **program is stale** branch was not in the original map and carries no
search volume. It earned a place because looking for Hawaiian's depth fields
turned up a currency that stopped existing in October 2025 while the site was
still selling it. That is a correctness axis rather than a keyword one, and
`factsChecked` is what tracks it.

### Does the EVA pattern generalise? Mostly no

The gap file splits into 305 buy-intent keywords and **134 informational ones
worth 25,040/mo**. Only a quarter of that informational volume is reachable:

| KD band | keywords | volume |
|---|---:|---:|
| under 30 | 25 | 3,080/mo |
| 30 to 40 | 32 | 5,920/mo |
| 40+ | 76 | 15,990/mo |

And it concentrates in four programs. `KD<35` is the reachable slice:

| program | info kw | info vol | KD<35 | the keywords |
|---|---:|---:|---:|---|
| Hawaiian | 26 | 3,430 | **1,790** | `hawaii miles` 590/KD33 |
| Cathay | 4 | 1,610 | **610** | `asia mile` 480/KD23, a brand typo |
| Delta | 20 | 2,090 | 530 | `how many skymiles for a flight` 170 |
| Flying Blue | 8 | 2,510 | 110 | `air france flying blue miles` 1,600/KD54 |
| everyone else | | | **0** | |

Turkish has exactly one informational keyword in the file, `turkish airlines
book with miles` at 90/mo and KD 52. Nothing reachable at all. So the queue
order I first gave, with Turkish at the top, was wrong twice over: its
"reachable" volume was buy-variants the existing page already serves, and its
informational demand is zero.

**Read this against EVA carefully.** EVA does not appear in this table, and
that is a property of the file rather than of EVA: the gap export lists only
keywords we *don't* rank for, and we already rank for the EVA cluster. Its
1,070/mo of proven mechanics demand is real and sits in the tracking export
instead. So the honest summary is that four programs have informational demand
worth building for — Hawaiian, Cathay, Delta and EVA — and seventeen do not.

For those seventeen, the depth fields are justified by the correctness audit
and by conversion, which is where the Hawaiian work landed anyway. Not by
search.

One cheap win falls out of this: **480 of Cathay's 610 reachable informational
volume is `asia mile`, singular, at KD 23.** That is a misspelling of the brand,
and the page can capture it by using the variant naturally in the copy.

### What the blog covers, and what it does not

The split, decided and settled: **purchase-critical facts live on the program
page. The blog takes narrative, dated events, and anything spanning the
roster.** A post that restates what a `/buy` page already says competes with
it for the same query and wins nothing.

Applying that rule, the queue is three items, not six:

1. ~~**Do airline miles expire? Every program, dated**~~ — **shipped**,
   `/blog/do-airline-miles-expire`. One table, 21 rows, 21 internal links out
   of a single post. Writing it *was* the correctness sweep, and it came back
   clean: no program on the site is described with the wrong expiry rule. It
   also produced the depth-field material for all 21, which is the next job.
2. ~~**How many miles for a flight?**~~ — **shipped**,
   `/blog/how-many-miles-for-a-flight`. Roster-wide, aggregates
   `how many skymiles for a flight` 170/KD34 and siblings, and feeds the
   calculators. Deliberately publishes **no** miles-per-route numbers: it
   classifies all 21 by pricing mechanism instead, because the mechanism
   outlasts the number and three of these programs repriced in the last two
   years.
3. **Refresh `how-much-are-alaska-miles-worth`** — not a new post. It is live
   and written throughout about "Mileage Plan", a name retired a year ago. The
   blog has the same staleness the program pages had.

**Dropped, because the program pages serve them:**

- *EVA Air Infinity MileageLands: award chart, expiry, upgrades.* The one case
  where the evidence pointed the other way, at 1,070/mo proven plus 380/mo
  ranking nowhere. Same rule applies regardless: award chart, expiry and
  upgrades are purchase-critical facts, so they belong in `/buy/eva-air-miles`
  depth fields, where the old guide URL already 301s. This makes EVA the
  highest-priority program-page fill on the roster.
- *Cathay Asia Miles booking and value.* `asia mile` at 480/mo KD 23 is a brand
  misspelling, and the page that should capture it is
  `/buy/cathay-pacific-asia-miles` using the variant in its own copy. A post
  would cannibalise it.
- *Qatar: QMiles are Avios now.* Already stated in Qatar's `quirks` on the
  program page, where a buyer meets it at the moment it matters.

All three are now program-page tasks rather than posts.

### The missing guide layer

The tracking export shows the old WordPress site earning 1,070/mo from a single
URL, `/eva-air-infinity-mileagelands-guide`, on informational queries: award
chart (140), program name (320), mileage program (210+170), upgrades (170),
expiry (30). The new site has no equivalent, and `/buy/eva-air` mentions "award
chart" zero times.

**The schema already supports this.** `quirks`, `mechanics`, `valueBands`,
`faqExtras` and `factsChecked` all exist in `content.config.ts` and all render.
Three of 21 programs fill them:

```
qatar-avios          quirks 3  mechanics 4  valueBands 3  faqExtras 3  factsChecked Aug 2026
hawaiian-miles       quirks 2  mechanics 5  valueBands -  faqExtras 3  factsChecked Aug 2026
alaska-mileage-plan  quirks 2  mechanics 4  valueBands -  faqExtras 2  factsChecked Aug 2026
other 18             -         -            -             -            -
```

So this is data entry into a template that already ships, not new engineering.
It does need real facts, which is what `factsChecked` is for, and Hawaiian
showed why: two of the three filled so far had something factually wrong on
the page before the research started.

Separately, `directBuy` is now sourced on five programs and rendered on three.
Delta, United and KrisFlyer publish a saving against the airline's list price
with the citation beside it. Aeroplan and Flying Blue are researched, correct
and withheld, because both airlines ran 2026 promotions that undercut our own
rate and an uncaveated saving would have been disprovable in one click.

---

## 4. Build queue

Ordered by reachable volume per unit of work, not by headline volume.
Status as of 12 August 2026.

1. ~~**Fill `quirks` / `mechanics` / `faqExtras` for Hawaiian**~~ **done**, and
   it took Alaska with it, since after the merger the two pages describe one
   program. ~~**Then Turkish, Asia Miles, EVA**~~ **reordered against the
   informational split above: EVA, then Cathay, then Delta.** Those are the
   only three left with reachable informational demand. Turkish drops off this
   list entirely, with one informational keyword at KD 52. The other seventeen
   stay worth doing for correctness and conversion, at no urgency.

2. **Add the real phrasings to each `/buy/` FAQ.** *Can you buy {program}
   miles?*, *How much does it cost to buy {n} {program} miles?*, *How to buy
   {program} miles* are literal gap keywords at KD 24–38. One shared FAQ block
   driven by the collection covers 21 pages at once.

3. **Avios currency page.** `buy avios points` is 390/mo at KD 14 and the old
   site ranked #18 with a dedicated URL we deleted. Avios spans BA, Qatar, Iberia
   and Finnair, so it is a currency page, not an airline page. Connects to the
   4,400/mo UK head term already flagged.

4. **301 map from the old URLs** (from the tracking export — these carry every
   ranking the live site has):

   | old | new |
   |---|---|
   | `/eva-air-miles-calculator` | `/calculator/eva-air` |
   | `/eva-air-infinity-mileagelands-guide` | `/buy/eva-air` |
   | `/eva-air-miles` | `/buy/eva-air` |
   | `/qatar-airways` | `/buy/qatar-avios` |
   | `/qatar-airways-ar` | `/ar/buy/qatar-avios` |
   | `/buy-avios` | `/buy/ba-avios` (or the currency page above) |

5. ~~**Chinese**~~ **partly done.** Traditional Chinese shipped for Taiwan
   (EVA) and Hong Kong (Cathay). `里程币` at 1,300/mo KD 16 is **Simplified**
   and still unbuilt, and it is the one with the numbers: neither Traditional
   market shows buy-intent volume at all.

   Also shipped since this doc was written: Turkish, French and Spanish pages,
   and one route now generates all six languages. **Nine translated pages, none
   native-reviewed**, which is nine of the launch blockers' worth of risk
   sitting behind copy I wrote.

6. ~~**Source the airline direct-buy benchmark**~~ **done for five programs,
   published on three.** The savings figure was suppressed site-wide for want
   of it. Remaining 16 need the same research and the same promo test.

7. **`comprar avios` in Spain: 1,300/mo at KD 26.** Turned up while validating
   the Spanish page. It is Iberia's Avios, which is the same currency we sell as
   BA and Qatar Avios and moves 1:1 between them. Low difficulty, real volume,
   and it converges with the Avios currency page already at item 3. Probably the
   best untaken opportunity in either dataset.

8. **Ask the client about hotel points.** 30,140/mo of the gap, and `buy marriott
   points` is 8,100/mo at KD 33 — the highest-volume genuinely reachable keyword
   in either file. Entirely dependent on whether he sources them at all.

### Explicitly not worth chasing

`buy delta miles` (8,100, KD 59), `buy southwest points` (5,400, KD 54),
`purchase delta skymiles` (3,600, KD 70), `buy delta skymiles` (4,400, KD 46).
Best reseller position across all four is #25. Revisit once the domain has
authority it does not have today.
