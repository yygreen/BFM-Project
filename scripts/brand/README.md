# Brand mark generator

The logo ("the last miles, closed") is generated, not hand-drawn. The solid
route, the three coral dots and the destination ring all derive from one
bézier; the dots sit at true arc-length positions, so spacing survives any
tweak to the curve. The wordmark is Plus Jakarta Sans 500/800/500 converted
to outlines, glyph by glyph with the font's own kerning.

To regenerate (needs network for the fonts; opentype.js is not a project dep):

    cd scripts/brand
    npm i opentype.js
    curl -sO https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KUnNSg.ttf && mv LDIb*KUnNSg.ttf pjs-500.ttf
    curl -sO https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_m07NSg.ttf && mv LDIb*m07NSg.ttf pjs-800.ttf
    node outline.mjs     # wordmark → outlines (wordmark.json)
    node compose.mjs     # writes logo.svg, logo-light.svg, favicon.svg

Then copy the three SVGs into /public and re-raster the PNG fallbacks
(favicon-32, icon-192, icon-512 from favicon.svg; apple-touch-icon at 180px
full-bleed square — iOS masks it itself, transparent corners render black).
To change the mark, edit the control points or dot positions in compose.mjs
and regenerate — never nudge coordinates in the shipped SVGs.

## Share card (public/og/default.jpg)

The site-wide og:image is rendered from `og-card.html` (1200×630): open it in
a browser at exactly 1200×630 and screenshot as JPEG (quality ~86 lands well
under 100 KB), or drive it with Playwright. It reuses `public/logo.svg`
directly plus an oversized, low-opacity restatement of the route motif, so a
logo regeneration carries into the card by re-rendering — don't edit the JPEG.
Blog posts override the card with their own hero art via the `image`
frontmatter; everything else falls back to this file (wired in Base.astro).

## Three-step route (src/components/StepArt.astro)

The route is now a dead-level horizontal line ending in the logo's
destination ring, so its three `il-line` paths are plain `H` commands edited
directly in the component — no generator involved. `stepwave.mjs` is the
retired generator from the wave era (extrema solved onto the waypoints,
curvature matched across every marker); it stays here in case the art ever
curves again, but nothing reads its output today.
