# Carrier logos

Sourced from Wikimedia Commons / English Wikipedia, then processed:

- `<script>`, `on*` event handlers, comments, `<image>` and `<foreignObject>`
  stripped — an SVG is an active document and these are third-party files
- DOCTYPE and internal subsets removed (a leftover `]>` broke Frontier)
- a `viewBox` derived from `width`/`height` where the source had none
  (American, EVA, United), and fixed pixel dimensions removed so CSS sizes them

Wired via `logo` / `logoAlt` in `src/data/airlines.json`. Removing a file and
clearing those fields falls back to the abstract tail-fin badge automatically —
no template changes needed.

**These are third-party trademarks.** They are used to identify the programme
being sold, not to suggest any affiliation; the footer states we are not
affiliated with any airline. If a carrier objects, clear the two fields for that
entry and the badge takes over on the next build.
