import { readFileSync, writeFileSync } from "fs";
import opentype from "opentype.js";

const load = (f) => opentype.parse(readFileSync(f).buffer.slice(0));
const a = load("pjs-500.ttf"), b = load("pjs-800.ttf");
const w = (f) => f.tables.os2.usWeightClass;
const medium = w(a) === 500 ? a : b;
const extrabold = w(a) === 800 ? a : b;
console.log("mapped: medium =", w(medium), "| extrabold =", w(extrabold));

// per-glyph layout: charToGlyph avoids the GSUB path that crashes
function layout(font, text, x, y, size, tracking) {
  const scale = size / font.unitsPerEm;
  let d = "", cx = x, prev = null;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    if (prev) cx += font.getKerningValue(prev, g) * scale;
    d += g.getPath(cx, y, size).toPathData(2) + " ";
    cx += g.advanceWidth * scale + tracking;
    prev = g;
  }
  return { d: d.trim(), x: cx };
}

const SIZE = 26, Y = 31, TRACK = -0.5;
let x = 62;
const buy = layout(medium, "buy", x, Y, SIZE, TRACK); x = buy.x;
const flight = layout(extrabold, "flight", x, Y, SIZE, TRACK); x = flight.x;
const miles = layout(medium, "miles", x, Y, SIZE, TRACK); x = miles.x;
console.log("wordmark ends at x =", x.toFixed(1));
writeFileSync("wordmark.json", JSON.stringify({ buy: buy.d, flight: flight.d, miles: miles.d, end: x }));
