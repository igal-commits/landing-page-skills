---
name: extracting-figma-truth
description: Use when building from a Figma file - pulling images, colours, text, type widths, comments or layout out of a design - or when a rebuilt page looks lower resolution, differently cropped, differently set or differently coloured than the Figma frame it came from.
---

# Extracting Figma Truth

## Overview

A Figma frame is a composite. What you can see is a flattened render at whatever scale you
asked for; what is actually in the file is a stack of source images, most of them far larger
and some of them transparent cutouts that solve problems the flattened render cannot. Beside
the frames sit the comments and notes, which are the real brief.

**Core principle: never build from a Figma render when you can build from the fills
underneath it, and never trust a rebuild you have not diffed against the render.**

## Fetch once, cache, never re-poll

Seats with view-only access get a small monthly budget of API calls. Heavy use can lock the
node and render endpoints for days. So:

- Fetch the node tree once and save the JSON. Read from the saved file from then on.
- Never write an error body over a cached file. Check the status before saving.
- Keep a local cache folder with the nodes, the fills, the renders and the extracted vectors.
- If an endpoint is locked, say exactly which one and what access is missing. Do not scrape
  the Figma UI in a browser as a workaround.

## Two different endpoints

| You want | Endpoint | Gives you |
|---|---|---|
| To see what the frame looks like | `/v1/images?ids=&scale=&format=png` | a flattened render, text baked in, capped resolution |
| To rebuild it | `/v1/files/:key/images` | every raw image fill in the file, at native resolution |

The render is your reference for **correctness**. The fills are your **material**. Building
from renders is the single biggest cause of "why does the live page look worse than the
design".

Token: a personal access token in the `X-Figma-Token` header, read from your config and never
printed. Node ids come from `/v1/files/:key?depth=2` and `/v1/files/:key/nodes?ids=&depth=N`.
The official Figma MCP (`get_metadata`, `get_screenshot`, `get_design_context`) is the faster
route for structure and screenshots when the account allows it.

## Finding the material

Walk the node tree and collect every `fills[]` entry of `type: IMAGE` with `visible !== false`,
recording its `imageRef`, its node's bounding box, and its `scaleMode`. Then map each
`imageRef` through `/v1/files/:key/images` to a download URL.

What you will typically find behind one hero frame:

- a wide, low-ish outpainted background at the frame's own aspect
- a **transparent cutout** of the subject at a much taller aspect
- the original portrait source, taller still
- one or more flat overlay rectangles

The cutout is the prize. It is what lets you re-compose the frame at a different aspect ratio
without inventing pixels.

Detect cutouts by alpha coverage, not by name:

```python
a = np.asarray(Image.open(f).split()[3])
transparent_fraction = (a < 250).mean()   # > 0.3 means it is a cutout
```

## Comments and notes are the brief

Review feedback does not live only in the frames.

- **Comments**: `/v1/files/:key/comments`. Each thread carries `client_meta.node_offset`, the
  canvas coordinates where the pin sits. Map a comment to the node whose bounding box contains
  that point, not to the node id on the thread, which is often just the page.
- **Sticky notes on a QA canvas** are nodes with `characters`, not comments. A sticky belongs
  to the screenshot it overlaps; arrows and highlight rectangles mark the target.
- **Replies decide.** Read the whole thread. When the owner answered a comment, apply the
  answer, not the original ask.
- Apply comments as one batch, then reply once. Keep a "proposed fixes" frame in the file in
  step with the page so the designer can see what was done.

The motion direction sits in notes beside each frame. See `specifying-motion-in-figma`.

## Typography is the quiet divergence

A page can match every colour and image and still read as a different site, because the type
is set slightly differently.

**Measure the text, do not eyeball it.** For each text node, compare the rendered width in the
browser against the Figma text width, at the same size and string. Anything over 1% is a
finding.

The cause worth knowing: variable fonts with an optical-size axis (Inter, for one) switch
shape by size in the browser, narrowing headings. Figma sets every size at the text optical
size. The fix is to pin the axis:

```css
.page * { font-variation-settings: "opsz" 14 !important; }
```

On one build this brought every text width within 1% of Figma. Letting the axis float made
headings 4 to 8% narrower, which moved line breaks and pushed a headline off its photographs.

Two smaller traps in the same family:

- A default `<em>` picks up the site stylesheet's serif italic. Reset it:
  `.page em { font-style: normal; font-family: inherit }`.
- A fit-to-height scale applied to a frame also scales its left edge. Check the left edge
  against the nav logo edge after scaling.

## The aspect trap

Figma hero frames are usually banners: 1920x700, aspect 2.74. A web hero at `100svh` is
about 1.6 at desktop and 0.46 at mobile. `object-fit: cover` therefore throws away 40% of the
width, and the composition you approved in Figma is not the composition on the page.

Do not fight this with `object-position` alone. Options, best first:

1. **Re-compose from the cutout** at the web's aspect: build a background plate from the
   frame's own wall pixels, add a contact shadow from the cutout's alpha, composite the
   cutout on top. This is the only option that adds real information.
2. **Use the taller source** if one exists and the subject does not touch the frame edges.
3. **Per-frame `object-position`**, tuned per image and per breakpoint.

Edge-replication to widen an image smears anything the subject touches.

## Compositing fills faithfully

To reproduce a frame from its fills, honour in order:

- fill order (index 0 is the bottom)
- `visible` and `opacity` per fill
- `scaleMode`: `FILL` covers, `FIT` contains, `STRETCH` uses the `imageTransform` affine
- `blendMode`
- solid and gradient fills interleaved between the image fills

Verify by rendering the same node through the images endpoint and diffing against your
composite. An exact match is the only proof that you read the transform correctly.

## Pinned and scrolling scenes need one frame per state

A scroll-scrubbed scene captured while it waits will show its first state or its stacked
reduced-motion fallback, and the design team will say it looks nothing like the page. Capture
each state at a fixed scroll progress (for example 0.31, 0.51, 0.71, 0.92 of the pin) and put
each in the file as its own frame. Waiting does not finish a scrubbed scene.

## Resolution

Check the pixel dimensions of what you are about to ship, not the file size.

- A 3840x1400 hero at 74KB has been compressed to mush; the dimensions lie about the quality
- After swapping an `img.src` in place, `naturalWidth` reports the **stale** decoded variant.
  Verify with a fresh `new Image()` before concluding the CDN is serving the wrong file
- Audit the effective ratio of every picture at every scroll position:
  `eff = pixels needed / pixels in the file`. Above 1.0 is soft. Honour the srcset density
- Target roughly 2x the largest CSS width the element will occupy, and serve the 1x file to
  1x screens through `srcset`
- Figma re-encodes images, so a hash will never match your original. Match renders to
  originals by normalised correlation on a small thumbnail
- Resampling a small source to 4K adds pixels, not detail. Say so, and offer a re-render

## Vectors and logos

Export logo groups as SVG through the images endpoint with `format=svg`. Export the **group**,
not the frame containing it: frame exports carry a background `<rect>` filling the viewBox,
which is why the logo then renders tiny inside a large empty box at any CSS height.

Recolour to a single ink after export. Figma files routinely carry the same logo in three
different greys. Only use logos that are cleared (see `writing-claims-that-hold`).

## Checklist

- [ ] Fetched once; JSON cached; no error body saved over a good one
- [ ] Built from fills, not from a render
- [ ] Composite diffed against the Figma render of the same node
- [ ] Alpha coverage checked on every fill, so no cutout was missed
- [ ] Target aspect compared against the Figma frame aspect before cropping
- [ ] Text widths within 1% of Figma; optical size pinned; `<em>` reset
- [ ] Comments mapped by canvas position; replies read; applied as one batch
- [ ] One frame per pinned state, captured at a fixed scroll progress
- [ ] Shipped pixel dimensions ~2x the CSS width, effective ratio at or below 1.0
- [ ] SVG exports are tight to the mark with no background rect
