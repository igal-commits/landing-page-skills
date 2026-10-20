---
name: choreographing-scroll-stories
description: Use when designing or building a pinned, scroll-scrubbed section - a chapter story, a colour field with climbing cards, count-ups, a selection wall - when scrolling to a section feels slow or heavy, or when a reference page's motion has to be reproduced on a new page.
---

# Choreographing Scroll Stories

## Overview

A scroll story is a function of one number: progress, from 0 to 1. Everything on the stage is
derived from that number, so it scrubs forward and backward and lands in the same place every
time. A story built as a timeline that merely plays on scroll feels fine until someone scrolls
back up.

**Core principle: derive all state from one number, spend as little scroll as the story needs,
and measure the feel with real wheel input.**

For the mechanics of making motion run, see `animating-web-pages`.

## The budget

Scroll is the most expensive thing you can ask of a reader.

| Rule | Value |
|---|---|
| Pinned length for one story | about 6 viewport heights or less |
| Pinned length for a selection wall | about 1.4 viewport heights |
| Measured examples that felt right | 5.3, 5.8 viewport heights (48 to 52 wheel notches) |
| Rests between beats | trimmed, not padded |
| Easing | soft: `power2.inOut`, not `power3.in` |
| Scrub | `0.2` when a smooth-scroll library is present; never double-smooth |

A story that was 11.5 viewport heights (104 notches) read as "it takes ages to get to
sections". Cutting rests, not beats, fixed it.

Tune the smooth-scroll library from the page's own script, never site-wide. One setting that
felt right: duration 0.85, ease-out quart, wheel multiplier 1.15.

Size the hero so the next strip is on the first screen. A reader who scrolls once should reach
proof, not more hero.

## The grammar of a rich story

Richness is a grammar, not a list of widgets. The moves that, together, make a scroll story
read as designed:

| Move | What it is |
|---|---|
| White to colour to white | the stage opens into a colour field and returns to white, so the page breathes |
| Split statement | a sentence in two halves that part to make room for what comes between them |
| Sphere into field | an object grows until it becomes the stage background |
| Climbing cards | cards rise through a window while the side text swaps, one chapter at a time |
| Chips and counters on pictures | small metrics that count up on the image they describe |
| Fades, not slides | state changes cross-fade in place |
| Held end states | each chapter ends with its card at rest long enough to be read |
| The close | the call to action fades in after the last chapter; scrubbing back lands on chapter 1 |

On phones nothing pins. Chapters stack, each in its finished state.

## Copying a motion grammar

When someone points at a finished page and says "like this", do these in order:

1. **Capture the reference at the real window size.** Viewport shots down the live page, at the
   widths you will build for.
2. **Read its master timeline** in the source. The page's own timeline is the best spec you
   will ever get.
3. **Name each move** in a table: move, trigger, duration, easing, what the side text does.
4. **Rebuild the key section** with the same choreography and your own assets.
5. **Carry the smaller moves** (counters, assembling icons, colour fields behind UI mocks)
   through the other sections.

A section-by-section checklist of widgets is the wrong reading. A prototype with the right
pictures and a calm grey stage still reads as a different site.

Measure the reference's feel too: pinned length, notches, settle time. See below.

## State from one number

```js
const render = p => {                      // p: 0..1, the only input
  const k = chapter(p);                    // which chapter, and how far into it
  titles.forEach((t, i) => t.style.opacity = fade(k, i));
  cards.style.transform = `translateY(${-k.index * CARD_H - k.local * CARD_H}px)`;
  field.style.opacity = ease(clamp01(p / 0.12));
  cta.style.opacity = ease(clamp01((p - 0.92) / 0.08));
};
ScrollTrigger.create({ trigger: stage, pin: true, scrub: 0.2,
  start: 'top top', end: '+=' + 5.3 * innerHeight, onUpdate: s => render(s.progress) });
```

If `render(0.5)` gives the same result whether you got there from 0.2 or from 0.9, the story
scrubs correctly.

## Inside the scene

- **Every picture proves the claim next to it.** A chapter that says "prints stay aligned"
  shows stripes meeting at a seam.
- **Mock UI inside a colour field needs its own text colour.** The scene tweens the text
  colour to white over the field and the mock inherits it, giving white text on a white card.
  Existence checks pass; only a contrast check notices.
- **Measure legibility on the colour from pixels.** White text needs 3:1 large and 4.5:1 body.
  Put a scrim inside the field, not over it.
- **Photos on the stage are real, in the right place, every frame.** A card that builds with
  empty frames for half a second is a bug the reader sees.
- **Sequences that play once** (a "how to start" walkthrough) trigger at 78% of the viewport
  and do not replay. **Loops** pause between runs and stop off screen.

## Measure the feel with real input

Wheel input through a real browser, with the smooth-scroll library present. Not `scrollTo`.

```js
await page.mouse.wheel({ deltaY: 100 });           // one notch, repeated at a steady rhythm
```

Report, at each milestone: scroll position in px, in viewport heights, in notches, and in
seconds at a steady wheel rhythm. Then:

- **One-notch settle time.** About 600 ms is soft. Over a second is heavy.
- **Frame time during the scroll**: p95 under about 17 ms at 1440x900 and a phone size. Count
  frames over 34 ms and over 50 ms.
- **Run at several windows:** 1440x900, 1280x720, 1920x1080 and 390x844.

`tools/scroll-qa.mjs` in this repository does this for any page.

## Capturing pinned states for design

A scrubbed scene cannot be captured by waiting. Set the scroll to a fixed progress and capture
there (0.31, 0.51, 0.71, 0.92), one frame per chapter. The stacked reduced-motion capture is a
different page and should not stand in for the desktop story.

## Red flags

- A story that is a timeline played by scroll, not a function of progress
- A pin over about six viewport heights
- Easing tuned before the pin length was measured
- A smooth-scroll library and a heavy scrub, together
- Testing with `scrollTo` instead of real wheel input
- White text inside a mock UI on a colour field, never measured
- Reading "like this page" as a list of widgets
