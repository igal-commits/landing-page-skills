---
name: art-directing-site-imagery
description: Use when choosing, generating or fixing the photography on a website - hero frames, section and card images, model imagery, product renders - or when a page's images look inconsistent, stocky, off-brand, soft, or do not prove the claim next to them.
---

# Art Directing Site Imagery

## Overview

Website imagery fails as a **set**, not as individual pictures. Three good photographs that
share nothing look worse than three ordinary ones that share a light, a palette and a
subject. And a beautiful picture that does not prove the sentence beside it is decoration.

**Core principle: decide the constants across the set before generating a single image, and
make every picture prove the claim it sits next to.**

## Engine and art director

Imagery on a page comes from an engine, directed by an art director, never from stock and never
from crops of older pages.

In our stack the engine is Botika, our own on-model rendering engine, and the art director is a
skill that sits on top of it: it holds the brief's constants, picks the model, pose, outfit
completion and background for each image, runs the render batch and QA-checks the results
against the required style. That skill drives a private pipeline and is not part of this
repository. The contract it fulfils is what this skill needs from **any** engine:

| Input | Output |
|---|---|
| the brief's constants (palette, light, environment, crop, continuity, variation) | a set at native resolution, named for its slot |
| one source asset per garment or subject | source versus render sheets for fidelity |
| the slot list: each section's claim and the aspect of its box | a QA log: what was checked, what was re-rolled |

If your engine cannot take the constants as input, the art director step is a person with a
checklist, and the checklist is this skill.

## Budget rule

Rendering costs credits and time. One render per distinct job. Reuse an existing asset before
making a new one. Ask a person before any batch over about six. No speculative batches "in case
we need them". The same render often serves two sections: reuse it.

## Fix the constants first

Write these down. Every image is then held against them, and any image that misses is
regenerated, not accepted.

| Constant | Decide |
|---|---|
| Palette | three neutrals, at most one accent, as hex |
| Light | one language: soft daylight, hard directional, or overcast |
| Environment | studio, real location, or a declared ratio of both |
| Crop | pick two of full-length / mid / tight, never three |
| Continuity | the one thing that stays the same across the set |
| Variation | the one thing that changes across the set |

The strongest continuity device for a product set is **one garment across different models
and scenes**. It demonstrates range while proving consistency, which is usually the exact
claim the page is making. The weak version is one model in different garments: it proves
nothing and looks like a lookbook.

## Imagery proves the copy

Before touching layout, write for each section the one claim its copy makes and the picture
that proves it. A face crop under "Scene" or a plain dress under "Prints and logos" decorates
the card instead of demonstrating it.

| Section claim | The picture is |
|---|---|
| Prints stay aligned | stripes lined up across a seam |
| Logos stay placed | an emblem on the chest, the same place on every model |
| Scales to a catalogue | many different products in one studio, with a list of statuses |
| One garment, any scene | the same garment and model in several places, the controls changing |
| Inclusive | one garment on several different models |

If a section has a claim and no picture that proves it, that is a render brief.

## Matching an existing set

When adding to imagery that already exists, derive the constants from what is there before
generating anything. Measure rather than eyeball: sample the background luminance and the
dominant hues of the existing frames, and note the crop and lighting of each.

If the existing set is four light frames and one dark, the new set is four light and one
dark. Ratios are part of the look.

## Sourcing the subject

- Extract each garment from the look photo with an image model, using the look photo as the
  reference. Render one product per garment, one look per render.
- Never use a source image that carries a third-party wordmark or logo.
- Pick the pose for the story. Upper-body poses for tops. Full length for dresses, jeans,
  skirts and trousers. A hand on the hip shows a pocket and aligned stripes.
- Backgrounds are neutral. Carry mood through casting and styling, not through a warm ground.

## Prompting for scenes

Describe the **scene**, never the garment. The garment is supplied as the input; describing
it fights the model and degrades fidelity.

Order: setting, light, camera, pose and mood, palette.

```
Empty city street at dusk beside a long corrugated steel shutter, cool blue ambient light
with one warm sodium lamp raking in from the right, 35mm full-length environmental frame,
the model standing still to the right of frame with a long stretch of empty wall on the
left, hands relaxed at her sides looking straight to camera, cinematic and quiet, cool
concrete grey and cream palette.
```

For web specifically:

- **Ask for the subject off-centre and name the empty side.** A hero needs a copy well.
- Use positive phrasing throughout. Naming what you do not want puts it in the frame.
- A scene is a real, specific, lived-in place full of the things that belong there. A pale
  empty room with a model in it reads as a studio pretending to be a place.
- Templates override prompts. If a template keeps returning a look you did not ask for, drop
  it and drive the whole scene from the prompt.

## Hero grids

A grid of portraits fails in three ways, all visible in the first second:

- the same photo twice, side by side
- a head cut by the hero edge
- changes that slide instead of fading

Rules: every visible photo is unique, none is cut by the edge of the hero, and photos change
place by fading out of one cell and into another. Test it by sampling frames for eight
seconds and failing on any duplicate source, tile outside the hero rectangle, tile overlap or
tile under the copy.

## QA at native resolution

Thumbnails and contact sheets hide exactly the failures that get noticed on a 27 inch
monitor. Locate hands and feet on a locator sheet, then crop those regions out of the
full-size file and view them at 2x to 4x:

- **Feet and shoes**: compare the two as a pair. Sole thickness, last shape, strap, heel.
- **Hands**: count the digits. If you cannot resolve the count, that is a fail, not a pass.
- **Limb joins**: a leg connecting hem to shoe, shoulders, elbows, knees
- **Contact shadows**: under the foot, not offset
- **Garment fidelity**: pockets, seams, collar, hem length and wash against the source
- **Text**: any signage or print in the frame

The cheapest fix is compositional. A frame that ends at mid-thigh removes the shoe failure
entirely. Use it whenever the bottom half is not the point. A prompt guard works too: "the
frame ends at mid-thigh and no feet, ankles or shoes are visible anywhere."

## Resolution

Ship roughly 2x the largest CSS width the slot will occupy, and serve the 1x file to 1x
screens through `srcset`. Audit the effective ratio of every picture at every scroll position
(pixels needed divided by pixels in the file; above 1.0 is soft). Upscaling a small source adds
pixels, not detail. Say so, and offer a re-render.

## Colour fields and text on images

Text over an image or a colour field is measured, not judged. White text needs 3:1 at large
sizes and 4.5:1 at body size, sampled from the pixels. A scrim inside the field fixes
legibility without dulling the colour. Mock UI placed on a colour field needs its own text
colour, or it inherits white from the scene and vanishes on a white card.

## Composing for the slot

Generate loose, crop tight. Match the delivered aspect to the CSS box so the browser is
choosing almost nothing:

- Card grids: one aspect for every card, set on the wrapper, `object-fit: cover` on the image
- Heroes: within about 10% of the widest viewport ratio you support
- Overlay zones: when card copy sits on the bottom third of an image, that zone must be quiet
- Collages proving consistency: one large cell plus two small, all three at the same aspect

## Checklist

- [ ] Constants written down before generating
- [ ] Every section has a claim and a picture that proves it
- [ ] Every image held against the constants; misses regenerated, not accepted
- [ ] Ratio of light to dark frames matches the existing set
- [ ] Models differ across the set; the garment or the light does not
- [ ] Hands, feet and garment detail checked at native resolution
- [ ] No third-party wordmarks in any source
- [ ] Copy well present and on the correct side in every hero frame
- [ ] Delivered aspect matches the CSS box; effective ratio at or below 1.0
- [ ] Text over images measured for contrast
- [ ] Reused before re-rendered; any batch over about six approved by a person
