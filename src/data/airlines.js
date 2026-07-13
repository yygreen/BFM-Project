// ============================================================
//  Airline programs — the data that drives every page.
//  Add a program here and a page is generated automatically.
//
//  pricePerMile is in CENTS. per1000 (USD) is derived in the template.
//  PLACEHOLDER = confirm real value before launch.
// ============================================================

export const airlines = [
  // ---- PRIORITY GAPS (highest buy-intent, not yet on the live site) ----
  {
    slug: "delta-skymiles",
    program: "SkyMiles",
    airline: "Delta Air Lines",
    alliance: "SkyTeam",
    pricePerMile: 1.9,          // PLACEHOLDER
    min: 25000,
    max: 500000,
    delivery: "Within 24 hours", // PLACEHOLDER
    inStock: true,
    heroHeadline: "Buy Delta SkyMiles with precision.",
    heroSub: "Top up your SkyMiles and fly Delta One for a fraction of the cash fare — delivered to your account, securely, within the day.",
    metaTitle: "Buy Delta SkyMiles | Fast, Secure Delivery | buyflightmiles",
    metaDescription: "Buy Delta SkyMiles at a fraction of the airline's price. Secure transfer, delivered within 24 hours, backed by our delivery guarantee.",
    related: ["ana", "eva-air"],
    sweetSpots: [
      { title: "Delta One to Europe", desc: "Lie-flat business across the Atlantic, often for far less than the cash fare." },
      { title: "Virgin Atlantic & Air France-KLM", desc: "Use SkyMiles on partner metal to reach more of Europe and beyond." },
      { title: "No change or cancellation fees", desc: "Flexibility that makes SkyMiles useful for last-minute and shifting plans." }
    ]
  },
  {
    slug: "united-mileageplus",
    program: "MileagePlus",
    airline: "United Airlines",
    alliance: "Star Alliance",
    pricePerMile: 1.9,          // PLACEHOLDER
    min: 25000,
    max: 500000,
    delivery: "Within 24 hours", // PLACEHOLDER
    inStock: true,
    heroHeadline: "Buy United MileagePlus miles.",
    heroSub: "Close the gap on a Polaris redemption. Buy the MileagePlus miles you need at a fraction of the price, delivered fast.",
    metaTitle: "Buy United MileagePlus Miles | Secure Delivery | buyflightmiles",
    metaDescription: "Buy United MileagePlus miles at a fraction of the price. Secure, guaranteed transfer delivered within 24 hours.",
    related: ["ana", "krisflyer"],
    sweetSpots: [
      { title: "Polaris business to Europe & Asia", desc: "United's lie-flat Polaris cabin is a standout on long-haul routes." },
      { title: "Star Alliance partners", desc: "Book ANA, Lufthansa, Swiss and more premium cabins with your miles." },
      { title: "Excursionist Perk", desc: "Add a free one-way inside a round-trip award for extra value." }
    ]
  },
  {
    slug: "american-aadvantage",
    program: "AAdvantage",
    airline: "American Airlines",
    alliance: "Oneworld",
    pricePerMile: 1.9,          // PLACEHOLDER
    min: 25000,
    max: 500000,
    delivery: "Within 24 hours", // PLACEHOLDER
    inStock: true,
    heroHeadline: "Buy American AAdvantage miles.",
    heroSub: "Top up AAdvantage and unlock Flagship business for less. Secure transfer, delivered to your account within the day.",
    metaTitle: "Buy American AAdvantage Miles | Secure Delivery | buyflightmiles",
    metaDescription: "Buy American Airlines AAdvantage miles at a fraction of the price. Secure, guaranteed delivery within 24 hours.",
    related: ["qatar-avios", "ba-avios"],
    sweetSpots: [
      { title: "Flagship Business", desc: "American's premium long-haul cabin to Europe and Asia at saver rates." },
      { title: "Qatar Qsuite & Japan Airlines", desc: "AAdvantage unlocks some of the best partner business class in the world." },
      { title: "Partner award value", desc: "Web-only partner pricing can beat buying those miles elsewhere." }
    ]
  },

  // ---- LIVE PROGRAMS (real pricing from the site audit) ----
  {
    slug: "krisflyer",
    program: "KrisFlyer",
    airline: "Singapore Airlines",
    alliance: "Star Alliance",
    pricePerMile: 1.8,
    min: 25000,
    max: 500000,
    delivery: "Within 24 hours",
    inStock: true,
    heroHeadline: "Buy Singapore KrisFlyer miles.",
    heroSub: "Fly Singapore Suites and Business on one of the world's best airlines. Buy the KrisFlyer miles you're short, delivered fast.",
    metaTitle: "Buy Singapore KrisFlyer Miles | buyflightmiles",
    metaDescription: "Buy Singapore Airlines KrisFlyer miles from 1.8¢. Secure transfer, delivered within 24 hours, delivery guaranteed.",
    related: ["ana", "eva-air"],
    sweetSpots: [
      { title: "Singapore Suites & Business", desc: "KrisFlyer is the only way to book Singapore's own premium cabins with miles." },
      { title: "Saver awards worldwide", desc: "Strong value to Europe, Asia and the US on Singapore metal." },
      { title: "Star Alliance partners", desc: "Extend your reach with partner redemptions across the alliance." }
    ]
  },
  {
    slug: "qatar-avios",
    program: "Avios (Privilege Club)",
    airline: "Qatar Airways",
    alliance: "Oneworld",
    pricePerMile: 1.8,
    min: 25000,
    max: 500000,
    delivery: "Within 24 hours",
    inStock: true,
    heroHeadline: "Buy Qatar Airways Avios.",
    heroSub: "Book Qsuite — one of the best business classes in the sky — for less. Buy Qatar Avios and complete your redemption within the day.",
    metaTitle: "Buy Qatar Airways Avios | Qsuite Redemptions | buyflightmiles",
    metaDescription: "Buy Qatar Airways Avios from 1.8¢ and book Qsuite for a fraction of the fare. Secure, guaranteed delivery within 24 hours.",
    related: ["ba-avios", "american-aadvantage"],
    sweetSpots: [
      { title: "Qsuite business class", desc: "One of the best business classes flying — bookable with Qatar Avios." },
      { title: "Short-haul & partner awards", desc: "Efficient pricing on Oneworld partners and regional routes." },
      { title: "Off-peak savings", desc: "Select dates price lower, stretching your Avios further." }
    ]
  },
  {
    slug: "ana",
    program: "Mileage Club",
    airline: "ANA",
    alliance: "Star Alliance",
    pricePerMile: 1.9,
    min: 25000,
    max: 500000,
    delivery: "Within 72 hours",
    inStock: true,
    heroHeadline: "Buy ANA Mileage Club miles.",
    heroSub: "ANA's award chart is one of the best-value routes to first and business class. Buy the miles you need, delivered securely.",
    metaTitle: "Buy ANA Mileage Club Miles | buyflightmiles",
    metaDescription: "Buy ANA Mileage Club miles from 1.9¢. Secure transfer, delivered within 72 hours, backed by our delivery guarantee.",
    related: ["krisflyer", "united-mileageplus"],
    sweetSpots: [
      { title: "Round-the-world business", desc: "ANA's round-the-world award is one of the best-value premium tickets in miles." },
      { title: "Business to Japan & Europe", desc: "Low rates on ANA metal make long-haul business attainable." },
      { title: "Star Alliance partners", desc: "Book premium cabins across the alliance with Mileage Club miles." }
    ]
  },
  {
    slug: "ba-avios",
    program: "Avios (Executive Club)",
    airline: "British Airways",
    alliance: "Oneworld",
    pricePerMile: 1.9,          // PLACEHOLDER — confirm live price
    min: 25000,
    max: 500000,
    delivery: "Within 24 hours", // PLACEHOLDER
    inStock: true,
    heroHeadline: "Buy British Airways Avios.",
    heroSub: "Great for short-haul sweet spots and premium long-haul. Buy the Avios you're short and book the seat you want.",
    metaTitle: "Buy British Airways Avios | buyflightmiles",
    metaDescription: "Buy British Airways Avios at a fraction of the price. Secure, guaranteed transfer delivered fast.",
    related: ["qatar-avios", "american-aadvantage"],
    sweetSpots: [
      { title: "Reward Flight Saver (short-haul)", desc: "Low Avios and capped fees make short hops excellent value." },
      { title: "Off-peak Club World", desc: "Long-haul business for fewer Avios on off-peak dates." },
      { title: "Oneworld partners", desc: "Qatar, Japan Airlines and Cathay open up with Avios." }
    ]
  },
  {
    slug: "eva-air",
    program: "Infinity MileageLands",
    airline: "EVA Air",
    alliance: "Star Alliance",
    pricePerMile: 1.95,
    min: 25000,
    max: 500000,
    delivery: "Within 48 hours",
    inStock: true,
    heroHeadline: "Buy EVA Air miles.",
    heroSub: "EVA's Royal Laurel business class is a standout. Buy Infinity MileageLands miles and lock in your redemption for less.",
    metaTitle: "Buy EVA Air Infinity MileageLands Miles | buyflightmiles",
    metaDescription: "Buy EVA Air Infinity MileageLands miles from 1.95¢. Secure transfer, delivered within 48 hours, delivery guaranteed.",
    related: ["krisflyer", "ana"],
    sweetSpots: [
      { title: "Royal Laurel business", desc: "EVA's acclaimed business class to Asia at reasonable rates." },
      { title: "Taipei hub connections", desc: "Great onward connectivity across Asia via TPE." },
      { title: "Star Alliance partners", desc: "Use Infinity MileageLands miles on alliance partners too." }
    ]
  }
];

export const getAirline = (slug) => airlines.find((a) => a.slug === slug);
