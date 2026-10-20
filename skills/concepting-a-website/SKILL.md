---
name: concepting-a-website
description: Use when about to build any new page or site - given a brief, a Figma file, a competitor reference or "make us a new homepage" - to decide the narrative, the section order and the art direction before any markup or styling exists.
---

# Concepting a Website

## Overview

The expensive mistake is building the sections someone named instead of the sections the
page needs. A homepage is an argument, not a list of features.

**Core principle: decide what the page has to prove, and in what order, before you decide
what it contains.**

## Do not skip to building

If you have a Figma file, you still concept. Figma shows you the surface of somebody's
thinking, not the thinking. The single most common failure is faithfully rebuilding a
layout whose narrative does not survive contact with a real viewport.

Read `00-learnings.md` first (see `learning-from-past-pages`). If the old page has numbers and
the brief does not mention them, the brief is not finished.

## The five questions

Answer these in writing before proposing sections. If you cannot answer one, ask.

1. **Who is arriving, and from where?** Paid social and organic search need different
   openings. A visitor from a comparison article already knows the category.
2. **What do they currently believe?** The page moves them from one belief to another.
   Name both ends.
3. **What is the single strongest piece of proof you are allowed to use?** Cleared customer
   names, real numbers, a demonstrable product moment. Check what is actually cleared before
   designing a section around it.
4. **What is the one action?** One primary action, repeated. A secondary action is allowed.
   A third is a decision you are pushing onto the visitor.
5. **What would make this page impossible to confuse with a competitor's?** If the answer
   is "our logo", the concept is not done.

## Section architecture

Write the page as a sequence of claims before it is a sequence of sections:

```
Hero            the claim
Proof strip     you are not the first to believe it
Demonstration   here is the thing actually working
Mechanism       here is why it works
Evidence        here are the numbers, attributed
Scale           here is why it holds at your size
Close           the action
```

Then map sections onto claims. A section that does not advance a claim is decoration; cut
it or merge it. Two sections making the same claim is the most common bloat.

Sequencing rules that hold up:

- Demonstration before mechanism. People believe what they have seen.
- Numbers come after the demonstration, never before. An unattributed number in the first
  screen reads as marketing; the same number after a demo reads as a result.
- The close repeats the hero's claim in the hero's words.

## Every claim gets a proof picture

For each section write the one claim its copy makes and the picture that proves it. The
picture must demonstrate the claim, not decorate the card next to it.

| Claim | A picture that proves it |
|---|---|
| Prints stay aligned | stripes lining up across a seam |
| Logos stay placed | the same emblem on the same spot across several models |
| It scales | many different products in one studio, plus a list of statuses |
| One garment, any scene | one garment and one model in several places, the controls changing |
| It is inclusive | one garment on several different models |

A crop of an old photo under a new heading is the failure this table prevents. When a section
has a claim and no proof picture, that is a brief for the imagery stage, not a gap to fill with
stock.

## Copy the grammar, not the widgets

When someone points at a finished page and says "like this", a section-by-section checklist of
widgets is the wrong reading. The richness of the reference is its motion grammar: the colour
it moves through, how statements split, what climbs, what counts up. Capture the reference at
the real window size, name each move, and hand the table to `choreographing-scroll-stories`.

## Art direction, decided once

Before any imagery is made or sourced, write down and stick to:

- **Palette**: three neutrals and at most one accent, named as hex
- **Light**: one lighting language across every image (soft daylight, hard directional,
  overcast). Mixing them is what makes a page feel assembled from stock.
- **Crop language**: full length, mid, or tight. Pick two, not three.
- **Subject continuity**: what stays constant across images so the set reads as one shoot.
  One garment across different models and scenes is a stronger device than one model in
  different garments, because it demonstrates range while staying coherent.

Write this into a short brief and hold every image against it. See
`art-directing-site-imagery` for producing the images themselves.

## Deliverable: `01-concept.md`

Concepting is finished when you can hand over:

1. The five answers, in a paragraph each
2. The claim sequence
3. The section list mapped to claims, with the copy intent and the proof picture of each in
   one line
4. The art direction brief
5. An explicit list of what you decided **not** to include, and why

Item 5 is what stops the page re-growing the sections you cut.

## Red flags

- Starting from "sections we usually have"
- Proposing a layout before naming the claim
- A proof point nobody has confirmed you are allowed to publish
- More than one primary CTA style on the page
- Imagery decided per-section rather than as a set
- A section whose claim has no proof picture
