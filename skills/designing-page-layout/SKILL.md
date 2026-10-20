---
name: designing-page-layout
description: Use when laying out or restyling a web page section - spacing between sections, type scale, card grids, stat and number blocks, logo strips, the first screen - or when a page technically works but looks templated, uneven, loose or unfinished.
---

# Designing Page Layout

## Overview

Most pages fail on rhythm, not on ideas. The type is fine, the colours are fine, and it
still looks like a template, because the vertical spacing was decided section by section
and nothing lines up.

**Core principle: pick one spacing scale, one type scale and one section system before you
style anything, then never introduce a value that is not on them.**

## The section system

Content sections share a handful of values. Pinned scenes are the exception.

| Part | Rule |
|---|---|
| Section title | one size for every content section (for example 48 at desktop, 38 on phones) |
| Left edge | one edge, equal to the nav logo edge. A fit-to-height scale moves the edge, so measure it |
| Label | one pill style above the title |
| Card | one radius, one hairline, one tint. Never border plus shadow plus fill |
| End card | the title on the grid rows, the buttons on the next row, no extra sentence |

Pinned and scrubbed scenes keep their own stage sizes. They are viewport-tall by design, and
their whitespace is scroll runway. Do not shrink a pinned stage without re-anchoring every
position that is a percentage of it.

A page where each section has its own title size, its own left edge and its own card looks
assembled. This table is what stops that.

## Spacing rhythm

Decide the scale once. A 4px base with a geometric ramp covers everything:

```
0.4  0.8  1.6  2.4  3.2  4.8  6.4  8  12  16 rem
```

Drive all section spacing through two tokens, `--sec` between sections and `--blk` between
blocks inside one. Tightening a loose page means changing two numbers, not forty. On one page
48 and 40 units at desktop and 36 and 28 on phones took the document down about 10%.

**Element sizes do not change when you tighten the rhythm.** Cards, type, logos, buttons: keep
them as designed. Compare component sizes between the old build and the new one to prove it.

Section padding is where pages fall apart. Audit every junction, not every section:

| Junction | Total gap | Reads as |
|---|---|---|
| Two unrelated sections | 200-240px | separate chapters |
| A block continuing the one above it | 40-80px | one chapter, two parts |
| Full-bleed media meeting a section | 0 | a cut |

Measure the **sum** of the upper section's `padding-bottom` and the lower one's
`padding-top`. A page with 120/60, 64/20, 24/0 and 0/120 produces gaps of 180, 84, 24 and
120 with no logic. The reader feels it as sloppiness without being able to name it.

A gap over ~240px on a single-colour background needs something in it. Either tighten it or
put a CTA there.

## The first screen

Size the hero so the next strip shows on the first screen. `clamp(620, 100svh - 150, 900)` units
puts the proof strip in view after one scroll. A hero that fills the viewport and shows nothing
below it hides the proof the page depends on.

## Shared components belong to the site

A nav, footer or button that exists on the live site is the design. Do not restyle it on a new
page. When it looks different on the new page, the cause is almost always a page-level override
leaking in. Compare computed styles against the live site and remove the override, scoped to the
breakpoint where it leaks.

## Type scale

Two families maximum: one display, one text. Figures in a display face read as designed;
figures in a plain body face read as data.

Always set `font-variant-numeric: lining-nums tabular-nums` on any number that sits in a row
with other numbers. Without it, "3,000" and "500,000+" will not align and you will not know
why.

Negative letter-spacing scales with size: roughly `-0.02em` at display sizes, `0` at body,
positive `0.08em` on uppercase eyebrows.

Match the design's type widths exactly. See `extracting-figma-truth` for the optical-size
trap.

## Cards and grids

The single most common card bug is uneven content producing uneven cards.

| Before | After | Why |
|---|---|---|
| `.card { padding: 2rem }` in a grid | add `align-items: stretch` on the grid and `height: 100%` on the card | otherwise cards are as tall as their own content |
| Content flows top to bottom | `margin-top: auto` on the element that must sit at the bottom | pins the metric or CTA to a shared baseline across cards |
| Label wraps to 1 line in one card, 2 in another | `min-height` equal to 2 lines on the label | keeps every card's baseline identical |
| `<img>` with intrinsic size | wrapper with `aspect-ratio` + `object-fit: cover` on the image | a grid of mixed-aspect images is not a grid |
| Grey fill behind cards | white with a `1px` hairline | fills read as placeholder, hairlines read as designed |

## Stat and number blocks

A number block has three parts in a fixed order: source or label above, figure, caption
below. The figure is the largest thing in the block and every figure in the row shares a
baseline.

- Never put a non-number in a number slot. "Creative Ops" in a row with "150+" and "3,000"
  reads as a mistake. Either find the number or move that fact to prose.
- A figure that wraps to two lines breaks the row. "6 weeks to 24 hours" becomes "24h" with
  the rest in the caption.
- Cap the caption at two lines. If it needs three, the caption is doing the figure's job.

## Logo strips

Logos are sized by **optical weight**, never by bounding box. A stacked lockup, a square
badge and a single-line wordmark set to the same CSS height will look wrong in three
different ways.

Start at: stacked lockup 44px, square badge 40px, wordmark 22px, then adjust by eye.
Normalise every mark to one ink colour. Mixed logo colours make a strip look scraped. Only
cleared logos go in a strip (see `writing-claims-that-hold`).

## Shared CSS and phone overflow

A width rule written for a desktop component, such as `width: 37rem !important`, can make the
whole document wider than a phone (428 against 390). The symptom is a white strip down the
right edge. Check `scrollWidth` against `clientWidth` at 390, and scope fixed widths to the
breakpoints they were designed for.

## The tells of a templated page

- Every section is centred
- Section paddings are all `120px` regardless of relationship
- Cards have both a border and a shadow and a fill
- Headings are set in the body font at a heavier weight
- Numbers are in the body font
- Two accent colours, neither of which is the brand's
- `border-radius` values of 4, 8, 12 and 16 all on one page

## Checklist

- [ ] Every spacing value is on the scale; sections run on two tokens
- [ ] Every section junction gap is deliberate and falls in one of the three bands
- [ ] One title size, one left edge, one label, one card style across content sections
- [ ] The next strip shows on the first screen
- [ ] Shared components match the live site's computed styles
- [ ] Cards in a grid are the same height, with a shared internal baseline
- [ ] All media in a grid shares one `aspect-ratio`
- [ ] Numbers use tabular lining figures
- [ ] Logos are optically sized and one ink colour
- [ ] No horizontal overflow at 390
- [ ] No gap over 240px that contains nothing
