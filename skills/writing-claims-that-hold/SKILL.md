---
name: writing-claims-that-hold
description: Use when writing or reviewing landing page copy, statistics, testimonials, customer logos, counters or comparisons, or before any page goes to staging, because a number or a name on the page needs a source and a clearance.
---

# Writing Claims That Hold

## Overview

A landing page is a set of promises with a logo on them. Every one that is not sourced and cleared
is a risk the company carries after the page ships. Animation makes it worse: a counter that
climbs to a number makes that number look verified.

**Core principle: nothing appears on the page that is not in the claims ledger, and the ledger
says who cleared it.**

## The claims ledger

One file, `05-claims-ledger.md`, one row per claim on the page:

| Claim as written | Type | Source | Cleared by | Where on the page |
|---|---|---|---|---|
| "500,000+ images and videos every month" | statistic | internal analytics, dated | head of marketing | proof block, counter |
| "Used by 3,000 brands" | statistic | CRM count, dated | head of marketing | proof block |
| Brand A logo | customer logo | signed permission | account owner | logo strip |
| "We cut costs by half" | quote | customer email | customer, in writing | quote carousel |

Types: statistic, customer logo, quote, comparison, capability, price. A person signs the
ledger before staging. The agent drafts it and refuses to build a claim that is not on it.

## Rules

1. **Statistics are attributed and dated.** A figure without a source reads as marketing. A
   figure with a source and a date reads as a result.
2. **Only cleared numbers count up.** A counter, a chip or a progress bar animates only a
   number that is in the ledger. If three chips count to 90%, 10x and 40%, all three are
   cleared figures, not decoration.
3. **The same number says the same thing everywhere.** Search the page for every figure. A
   "40%" in one card and a "4x" in another, for the same measure, is two claims and one of
   them is wrong.
4. **Customer logos and quotes are cleared per use.** "We have the file" is not clearance.
   A logo strip is a list of permissions.
5. **Name the alternative.** "Skip the photoshoot" says what you replace. "Transform your
   content" says nothing. Never imply there is no source image if there is one. Say "start with
   a flat lay".
6. **Use the owner's words where the owner gave them.** A headline someone wrote verbatim is
   not edited for style.
7. **One primary action.** The same button, repeated. A second action is allowed. A third is a
   decision pushed onto the visitor.
8. **No price or plan details the owner did not hand you.** Ask for them.

## Banned words, with a lint

Every team has words its pack forbids ("flawless", "revolutionary", "in no time"). Write the
list into the ledger and lint for it. Allow an exception only by quoting the exact line it is
allowed in, and fail the lint the moment that line is reused elsewhere.

```js
// run in the page console, or in the QA script
const banned = ['revolutionary','game-changing','seamless','flawless','magic'];
const text = document.body.innerText.toLowerCase();
banned.filter(w => text.includes(w));                 // must be empty
document.body.innerText.includes(String.fromCharCode(8212));            // house style: no em dashes
```

## Placeholders are claims too

CMS lists, sample cards and demo UI ship with placeholder text and get published. "A sample guide
title that sets up in two or three lines" on a news card is a claim that the company publishes
nonsense. The QA pass searches the rendered page for placeholder phrases, empty images and
alt text that is a filename. A scripted section that animates an empty card is worse than a
static one.

## Mock UI inside the page

A product mock on the page, with its names, metrics and statuses, is copy. The numbers in it
are claims, the names in it are people or brands, and the labels in it are promises. Put them
in the ledger or make them clearly generic.

## Hand-off

`05-claims-ledger.md` feeds `building-webflow-pages` (what may be written) and
`reviewing-page-design` (what to verify). Counters and chips are listed in
`specifying-motion-in-figma` with their cleared end values.

## Red flags

- A statistic with no source or date
- A counter animating a number nobody cleared
- A logo on the page that is not on the cleared list
- A testimonial with no permission on file
- The same measure quoted two different ways
- Placeholder text in a CMS list at launch
- "We will confirm the numbers after launch"
