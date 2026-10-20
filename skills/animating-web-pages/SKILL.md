---
name: animating-web-pages
description: Use when adding or fixing motion on a web page - scroll reveals, hero intros and crossfades, ambient loops, looping background video, image rotators, sticky elements - or when an animation stutters, fires at the wrong time, plays off-screen, or does not run at all.
---

# Animating Web Pages

## Overview

Web motion fails in two ways: it does not run, or it runs badly. Both have specific,
findable causes. Guessing at easing curves is the last thing to do, not the first.

**Core principle: before tuning an animation, prove it is running on the elements you think
it is running on.**

For the design of pinned, scrubbed scenes, see `choreographing-scroll-stories`. This skill is
the mechanics: making motion run, and run well.

## When an animation does not run at all

Check in this order. The first three account for almost everything.

| Symptom | Cause | Check |
|---|---|---|
| Nothing moves, elements visible | Selector matches zero elements | `document.querySelectorAll(sel).length` in the console |
| Nothing moves, elements invisible | Reveal set `opacity: 0` and the trigger never fired | computed `opacity` on the element |
| A crossfade never crossfades | Both layers sit at `opacity: 1`; only the "on" rule exists | there must be a rest rule setting the incoming layer to `0` |
| Fires immediately on load | Trigger evaluated before layout settled | run after `load`, not `DOMContentLoaded`, when images size the page |
| Fires once then never again | `once: true` plus an element that re-enters | intended? |
| Nothing runs in a hidden tab or headless pane | the ticker is paused while `document.hidden` | force it: `gsap.ticker.lagSmoothing(0); gsap.ticker.tick()` |
| Triggers are off by a few hundred pixels | images loaded after the triggers were measured | `ScrollTrigger.refresh()` on load and on resize (200 ms debounce) |

The crossfade one is worth spelling out because it looks correct in code review:

```css
/* This alone does nothing. */
.tile.is-swapped .layer.is-alt { opacity: 1 }

/* The rest state is what makes it an animation. */
.layer.is-alt { opacity: 0 }
.tile.is-swapped .layer.is-alt { opacity: 1 }
```

## Intros and ambient motion

- **The headline is visible fast.** Cut an intro until the headline shows in about 1.1 s. A
  3.8 s intro is a loading screen.
- **Photos change by fading out of one cell and into another. They never slide.** Each photo is
  one element, never on screen twice, and never fading out while its copy fades in.
- **Ambient change is slow and irregular.** One tile every 1.8 to 3.4 s reads as a living
  grid while any single tile changes slowly. Do not shorten the interval to make each tile
  change faster.
- **Shuffle in rounds.** Every tile changes once before any repeats, and each pick is from the
  farther half of the last three.
- **Pause what nobody can see.** Ambient loops stop off screen and in a hidden tab, and resume
  where they were.
- **Intros do not replay on every return.** After the intro settles, nothing but the ambient
  layer moves.

## Scroll reveals

- Only set `opacity: 0` on elements that are actually below the fold at load. Blanket-hiding
  everything means anything above the fold is invisible until a scroll that may never happen.
- Reveal on `top 88%`, not on full intersection. Waiting for the element to be fully in view
  means it animates after the reader is already looking at it.
- Stagger between siblings, not within a component. 60-90ms between cards, 0 inside a card.
- Batch with one observer per group rather than one per element.

## Video

Autoplaying background video has one universal bug: the video plays while off-screen, an
observer pauses it, and by the time the reader arrives the loop is 15 seconds in and the
opening beat is lost.

```
Remove the autoplay attribute entirely.
pause() and load() on init.
On first intersection only: currentTime = 0, then play().
```

Serve a 1x file below 992px or under 1.5 device pixel ratio, and a poster frame for the
paint before the video decodes. Heavy homepage video is also where bandwidth goes: audit it.

## Stutter

Slow drift on a still photograph is the most common cause. A Ken Burns move of under about
1px per frame resamples the image every frame and reads as shimmer, not motion.

- Either move enough to be motion, or do not move at all.
- For a hold in a rendered video, copy the encoded frame byte for byte rather than
  re-encoding an identical frame. Anything else drifts.
- Check the loop seam. If frame 0 and the final frame differ, the loop visibly jumps every
  cycle. Measure the mean absolute difference between them.
- Do not double-smooth. A smooth-scroll library plus a heavy `scrub` value adds up to a page
  that lags the wheel. With a smooth-scroll library present, use `scrub: 0.2`.

## Sticky

`position: sticky` inside a CSS grid resolves against the **grid area**, not the whole
container. A sticky item that is only as tall as its own content has no travel and releases
immediately.

```css
.grid  { align-items: stretch }      /* the area is now full height */
.col   { position: static; height: 100% }
.inner { position: sticky; top: 10rem }
```

## Fallbacks

Every animation gets three fallbacks, written down in the motion spec and tested:

- **Reduced motion.** `prefers-reduced-motion: reduce` and a `?static` query render the
  stacked, finished states: nothing pinned, nothing hidden, every scene in its end state. Cover
  every CSS `transition` you added too. Listing the animated selectors but forgetting the
  transition on the container leaves a colour still sliding.
- **No script.** Everything stays visible. A class is added after about 3.5 s if the script
  never started, and the CSS reveals everything under it.
- **Phones.** Pinned scenes stack. State it, test it.

## Verification

Do not report an animation as working from the code. Confirm in the page:

- [ ] Selector counts are non-zero for every animated group
- [ ] Computed `opacity` on an above-fold element is 1 before any scroll
- [ ] Video `currentTime` is under 0.5s at the moment it first becomes visible
- [ ] Reduced-motion emulation leaves the page fully readable and static
- [ ] No-script leaves everything visible
- [ ] Nothing animates `width`, `height`, `top` or `left`; use `transform` and `opacity`
- [ ] Ambient loops make no style changes while off screen

## Red flags

- Tuning duration or easing before confirming the selector matches
- A `.is-active` rule with no corresponding rest-state rule
- `transition: all`
- An animation added because the section "felt empty"
- A photo that slides
- The same photo on screen twice
