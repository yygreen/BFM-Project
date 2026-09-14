# Blog plan — what to cover, in priority order

Keyword data: Semrush, US database, pulled 2026-08-09. Volumes are US monthly
searches. KD is Semrush keyword difficulty (0–100; under ~35 is realistic for a
new site, 50+ needs real authority).

Three posts exist today (`how-buying-airline-miles-works`,
`how-to-check-a-miles-seller-is-legitimate`, plus the template). Everything
below is additive.

**Mechanics that make these posts pay:** every post takes `programs: [...]` with
slugs from `airlines.json`, which renders live-priced links back to the money
pages — that internal linking is most of the SEO value. A typo'd slug fails the
build rather than shipping a dead link. Posts in `News` or `Devaluations` are
schema-required to carry a `source` URL.

---

## Tier 1 — write these first

These three clusters are large, winnable, and land on people who are *already*
in a buying situation. They should be the first ~25 posts.

### 1. "Do [programme] miles expire?" — ~16,000/mo combined

The highest-ROI cluster on the list. Expiry is a buying trigger: someone whose
balance is about to lapse needs either to redeem it or to top it up, and both
roads lead to a money page.

| Keyword | Vol | KD |
|---|---|---|
| do southwest points expire | 5,400 | 57 |
| do american airlines miles expire | 3,600 | 50 |
| do alaska airlines miles expire | 1,600 | 32 |
| do united airlines miles expire | 1,600 | 31 |
| do jetblue points expire | 1,300 | 55 |
| when do american airlines miles expire | 480 | 38 |
| do delta airline miles expire | 480 | 46 |
| do frontier miles expire | 390 | 23 |
| do avios expire | 260 | 15 |
| do hawaiian miles expire | 210 | 14 |
| do krisflyer miles expire | 110 | 18 |

Start with the low-KD end — Avios (15), Hawaiian (14), KrisFlyer (18), Frontier
(23), Alaska (32), United (31). Southwest and American are the biggest but the
hardest; write them once a few of the easier ones are ranking.

**Caveat:** expiry rules change, and a wrong answer here is the kind of error
that costs trust. Each post needs a dated, sourced statement of the programme's
current policy.

### 2. "What are [programme] miles worth?" — ~14,000/mo combined

The natural home for our own cents-per-mile figure. A reader asking what a mile
is worth is one step from asking what it costs to buy one.

| Keyword | Vol | KD |
|---|---|---|
| united miles value | 2,400 | 49 |
| southwest points value / how much are southwest points worth | 1,900 each | 54 / 41 |
| how much are american airlines miles worth | 1,600 | 52 |
| jetblue points value | 1,300 | 38 |
| alaska miles value | 1,000 | 21 |
| how much are united airlines miles worth | 1,000 | 31 |
| delta skymiles value | 720 | 34 |
| how much are jetblue points worth | 720 | 23 |
| how much are delta skymiles worth | 480 | 18 |
| how much are alaska airlines miles worth | 390 | 25 |
| how much are airline miles worth | 320 | 40 |
| avios value | 170 | 16 |

Alaska (21), Avios (16), Delta (18), JetBlue (23) are the soft targets.

### 3. "How to transfer [programme] miles to another person" — ~4,800/mo

Smaller, but it describes the exact mechanic the business runs on, so the
commercial fit is the tightest of any cluster here.

| Keyword | Vol | KD |
|---|---|---|
| can i use united miles on other star alliance airlines | 1,000 | 47 |
| how to transfer american airlines miles | 1,000 | 36 |
| can you transfer american airlines miles | 880 | 35 |
| how to transfer miles on american airlines | 720 | 33 |
| can i transfer american airlines miles | 590 | 34 |
| can american airlines miles be transferred | 480 | 34 |
| are airline miles transferable | 50 | 20 |
| transfer airline miles to another person | 40 | 19 |

---

## Tier 2

### 4. "Can you buy [programme] miles?" — ~8,400/mo across variants

Defends the money pages: these searchers are comparing the airline's own price
against alternatives. Answer honestly — state the airline's published rate next
to ours. Largest variants: *can you buy delta miles* (1,000), *how to buy delta
miles* (880), *can i buy delta miles* (590), *how to buy american airlines
miles* (480), and United's three variants at 390 each.

### 5. "How to redeem airline miles" — 27,100/mo, KD 61

The single biggest term in the niche, and the hardest. Owned by large
publishers. Worth one genuinely good pillar post that the Tier 1 posts link up
into — but do not expect it to rank quickly, and do not let it delay Tier 1.

### 6. Business-class upgrade long tail — ~600/mo across 30+ variants

Individually tiny (~20/mo each), collectively real, and the intent is exactly
our buyer: someone short of miles for a premium seat. One post per major
programme covering "how many miles for business class on X" and what to do when
you're short. Variants exist for AA, Delta, United, Emirates, Etihad,
KrisFlyer, Flying Blue, KLM, Asia Miles.

### 7. "How do airline miles work" — 720/mo, KD 31

Top of funnel, cheap to write, links down into everything else.

---

## Tier 3 — the news beat

Devaluation coverage is low volume (*united mileageplus devaluation* 140,
SkyMiles and AAdvantage 20 each) but it is the reason the blog exists: it earns
links, it is the topic buyers actually follow, and being early is the whole
value. Schema requires a `source` URL on these — a devaluation claim that turns
out to be wrong costs more trust than the post earns.

---

## Deliberately not recommended

**Hotel points — 26,100/mo, and bigger than the entire airline roster.**
*buy hilton points* 9,900 · *buy marriott points* 8,100 · *buy hyatt points*
8,100. This exceeds every airline term on the site combined. It is only worth
anything if the client actually sources hotel points — a client-call question,
not a writing decision.

**Credit-card transfer partners — ~7,500/mo.** *amex points transfer partners*
3,600, *chase points transfer partners* 3,600. High volume but it is card
affiliate territory, fiercely contested, and not our business.

---

## Note on the money-page titles

Earlier I flagged the 13 `metaTitle`s as targeting programme names over
airline names. Checking them against the data, that was overstated — most
already lead with the airline and several are exact matches for their head
term (*Buy Delta SkyMiles* → 4,400; *Buy Southwest Points* → 5,400; *Buy
JetBlue Points* → 1,900).

Two are genuinely off:

- **American** — title is "Buy American AAdvantage Miles"; the term is *buy
  american airlines miles* (5,400). Missing "Airlines".
- **United** — title is "Buy United MileagePlus Miles"; the term is *buy united
  miles* (6,600), the largest single money keyword on the site. "MileagePlus"
  splits the phrase.

Everything else can stay as it is.
