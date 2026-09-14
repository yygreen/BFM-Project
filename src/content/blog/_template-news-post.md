---
title: "Headline: what changed, for which program"
description: "One or two sentences a searcher would read in Google. Max 200 characters. Say what changed and who it affects."
date: 2026-01-01
category: "News"
programs: ["delta-skymiles"]
source: "https://example.com/the-airline-announcement"
sourceLabel: "Delta newsroom"
draft: true
---

<!--
  COPY THIS FILE to create a news post. Rename it (the filename becomes the URL,
  /blog/your-file-name) and delete `draft: true` when it's ready to publish.

  Rules the build enforces:
    • category "News" or "Devaluations" REQUIRES a `source` URL. This is deliberate:
      a devaluation claim that turns out to be wrong costs more trust than the post
      earns. Link the airline's own announcement wherever possible.
    • `title` max 75 chars, `description` max 200. Both are used verbatim as the
      page's SEO meta, so write them for a search result, not for the page.
    • `programs` must be real slugs from src/data/airlines.json. They render as
      links back to those pages, which is most of the SEO value of posting at all.
    • `draft: true` excludes the post from the build entirely.

  Delete this comment block before publishing.
-->

Lead with the change itself in the first sentence: what it is, which program, and from
when. People arriving from search want the fact, not a preamble.

## What changed

The specifics. Old value versus new value, with the effective date.

## Who this affects

Be concrete about who should care and who can ignore it.

## What to do about it

The practical consequence. If a redemption is about to get more expensive, say whether
booking sooner actually helps, and be honest when it doesn't.
