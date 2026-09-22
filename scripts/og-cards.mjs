// Build-time OG share cards, one per program page plus one per blog post
// that has no raster hero of its own. Runs from `prebuild`, so the cards are
// regenerated from airlines.json on every deploy and a rate change can never
// leave a stale price in a link preview for longer than one build.
//
// Why generated at all: every page shipped the same default card, so a
// shared Qatar link and a shared blog post looked identical in WhatsApp and
// iMessage — and WhatsApp is literally the shop's contact channel. A card
// with the program, the emblem and the live rate reads like a product card.
//
// Design rules mirror the pages themselves:
//   - the abstract code emblem, never an airline logo: a carrier's mark on a
//     share card is exactly the implied-partnership look the footer disclaims
//   - unverified rates keep their tilde; a verified delivery window renders,
//     an unverified one is left off rather than invented
//   - tokens are copied from flightdeck.css :root — if the palette moves,
//     move these with it
//
// Deterministic offline: satori + resvg with the three faces vendored in
// scripts/og-fonts, so a Vercel build never reaches for Google Fonts.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const W = 1200, H = 630, PAD = 72;
const C = {
  page: "#F5F6FF", surface: "#FFFFFF", ink: "#10122B",
  text2: "#494D6B", text3: "#7B7F9E",
  cobalt: "#2540FF", cobaltTint: "#E7EAFF", cobaltLine: "#C3CAFF",
  coral: "#FF5C3A", line: "#E5E7F6",
};

const font = (f) => readFileSync(new URL(`./og-fonts/${f}`, import.meta.url));
const fonts = [
  { name: "Jakarta", data: font("jakarta-800.ttf"), weight: 800, style: "normal" },
  { name: "Inter", data: font("inter-500.ttf"), weight: 500, style: "normal" },
  { name: "Plex Mono", data: font("plexmono-600.ttf"), weight: 600, style: "normal" },
];

// satori takes react-ish element objects; h() keeps them readable
const h = (type, style, ...children) => ({
  type,
  props: { style, ...(children.length ? { children: children.flat() } : {}) },
});
const text = (s, style) => ({ type: "div", props: { style, children: s } });

// the brand wordmark plus the route mark's dots-and-ring shorthand
const wordmark = () =>
  h("div", { display: "flex", alignItems: "center", gap: 14 },
    h("div", { display: "flex", alignItems: "center", gap: 5 },
      ...[0, 1, 2].map((i) =>
        h("div", { width: 8, height: 8, borderRadius: 99, background: C.coral, marginTop: (2 - i) * 8 })),
      h("div", { width: 20, height: 20, borderRadius: 99, border: `5px solid ${C.cobalt}`, marginTop: -22, marginLeft: 2 })),
    h("div", { display: "flex", fontFamily: "Inter", fontSize: 34, color: C.ink },
      text("buy", { fontFamily: "Inter" }),
      text("flight", { fontFamily: "Jakarta", fontWeight: 800 }),
      text("miles", { fontFamily: "Inter" })));

// the level route: waypoint ring on the left, the logo's annulus at the end
const route = () =>
  h("div", { display: "flex", alignItems: "center", width: "100%", height: 30, position: "relative" },
    h("div", { position: "absolute", left: 0, right: 0, top: 13, height: 4, borderRadius: 2, background: C.cobalt }),
    h("div", { position: "absolute", left: 0, top: 2, width: 26, height: 26, borderRadius: 99, border: `4px solid ${C.cobaltLine}`, background: C.page, display: "flex", alignItems: "center", justifyContent: "center" },
      h("div", { width: 10, height: 10, borderRadius: 99, background: C.coral })),
    h("div", { position: "absolute", right: 0, top: 1, width: 28, height: 28, borderRadius: 99, border: `8px solid ${C.cobalt}`, background: C.page }));

const shell = (...children) =>
  h("div", {
    width: W, height: H, display: "flex", flexDirection: "column",
    justifyContent: "space-between", padding: PAD, background: C.page,
    fontFamily: "Inter",
  }, ...children);

async function render(node, out) {
  const svg = await satori(node, { width: W, height: H, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  writeFileSync(out, png);
}

// ---- program cards --------------------------------------------------------
const airlines = JSON.parse(readFileSync("src/data/airlines.json", "utf8"));
mkdirSync("public/og/buy", { recursive: true });
mkdirSync("public/og/blog", { recursive: true });

for (const a of airlines) {
  const flightsOnly = a.fulfilment === "flights";
  const rate = `${a.priceVerified ? "" : "~"}${a.pricePerMile.toLocaleString("en-US")}¢`;
  const nameSize = a.program.length > 18 ? 56 : 68;
  const pill = (label) =>
    h("div", { display: "flex", background: C.cobaltTint, color: C.cobalt, fontSize: 24, fontFamily: "Jakarta", fontWeight: 800, padding: "10px 24px", borderRadius: 99 },
      text(label, {}));
  const card = shell(
    wordmark(),
    h("div", { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 },
      h("div", { display: "flex", flexDirection: "column", gap: 10, maxWidth: 840 },
        text(a.program, { fontFamily: "Jakarta", fontWeight: 800, fontSize: nameSize, color: C.ink, lineHeight: 1.08, letterSpacing: "-0.03em" }),
        text(a.airline, { fontSize: 32, color: C.text2 })),
      h("div", { width: 150, height: 150, borderRadius: 36, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
        text(a.code, { fontFamily: "Jakarta", fontWeight: 800, fontSize: 52, color: "#FFFFFF", letterSpacing: "0.02em" }))),
    // flights-only programs never show a per-mile rate anywhere, the share
    // card included — the card sells the seat, like the page does
    flightsOnly
      ? h("div", { display: "flex", alignItems: "center", gap: 28 },
          text(a.alliance === "Independent" ? "Flights booked in your name" : "Award flights, in your name", { fontFamily: "Jakarta", fontWeight: 800, fontSize: 52, color: C.ink, lineHeight: 1, letterSpacing: "-0.02em" }),
          pill(a.alliance === "Independent" ? "The flight you want" : "Business & first class"))
      : h("div", { display: "flex", alignItems: "center", gap: 28 },
          h("div", { display: "flex", alignItems: "flex-end", gap: 12 },
            text(rate, { fontFamily: "Plex Mono", fontWeight: 600, fontSize: 82, color: C.ink, lineHeight: 1, letterSpacing: "-0.06em" }),
            text("per mile", { fontSize: 28, color: C.text2, paddingBottom: 8 })),
          pill(a.deliveryVerified ? `Delivered ${a.delivery.toLowerCase()}` : "Exact rate confirmed before you pay")),
    route(),
  );
  await render(card, `public/og/buy/${a.id}.png`);
}

// ---- blog cards: only for posts whose hero can't serve as an og:image -----
// (no image at all, or an SVG — link scrapers don't rasterise SVG)
const fmField = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?\\s*$`, "m"));
  return m ? m[1].trim() : "";
};
let blogCards = 0;
for (const file of readdirSync("src/content/blog")) {
  if (!file.endsWith(".md") || file.startsWith("_")) continue;
  const raw = readFileSync(`src/content/blog/${file}`, "utf8");
  const fm = raw.split("---")[1] ?? "";
  if (/^draft:\s*true/m.test(fm)) continue;
  const image = fmField(fm, "image");
  if (image && !image.endsWith(".svg")) continue;
  const title = fmField(fm, "title");
  const category = fmField(fm, "category");
  const slug = file.replace(/\.md$/, "");
  const card = shell(
    wordmark(),
    h("div", { display: "flex", flexDirection: "column", gap: 26, maxWidth: 1000 },
      category
        ? h("div", { display: "flex" },
            h("div", { display: "flex", background: C.cobaltTint, color: C.cobalt, fontSize: 24, fontFamily: "Jakarta", fontWeight: 800, padding: "8px 22px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.02em" },
              text(category, {})))
        : h("div", { display: "flex" }),
      text(title, { fontFamily: "Jakarta", fontWeight: 800, fontSize: 58, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.03em" })),
    route(),
  );
  await render(card, `public/og/blog/${slug}.png`);
  blogCards++;
}

console.log(`✓ OG cards: ${airlines.length} programs, ${blogCards} posts`);
