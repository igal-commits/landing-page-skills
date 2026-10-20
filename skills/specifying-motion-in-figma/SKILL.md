---
name: specifying-motion-in-figma
description: Use when motion has to be handed from design to build - scroll scenes, load intros, ambient loops, counters, hovers - or when a design says "subtle animation" and a developer has to guess, or when QA cannot tell whether motion is right.
---

# Specifying Motion in Figma

## Overview

Static frames cannot carry motion, so motion gets handed over as adjectives. "Smooth", "subtle",
"nice easing". A builder then guesses, a reviewer then disagrees, and nobody can prove who is
right.

**Core principle: motion lives in a note beside the frame, in a fixed grammar, with numbers.
If a line cannot be tested, it is not a specification yet.**

One annotated frame per section: the picture on the left, the notes on the right. A builder
can implement it without a call. A QA script can assert it.

## The note grammar

Every section frame carries the same headings, in this order, and omits the ones that do not
apply. The headings are the checklist.

| Heading | What it answers | Example |
|---|---|---|
| **Trigger** | what starts it and how long it holds | "Pinned for about 1.4 viewport heights." |
| **Intro** | what happens on load, with times | "Nav fades 0.6 s. Lattice hairlines draw over 0.9 s (power2.inOut). Copy rises 24 and fades, stagger 0.12 from 0.5 s." |
| **Behaviour** or named beats | what changes, in order | "The wall sits dimmed; the selection corners travel to a model, which comes to full strength while the others stay dim." |
| **Ambient** | what keeps moving, at what interval | "Every 1.8 to 3.4 s one tile changes: fade out 0.7 s, fade in 0.85 s, never a slide." |
| **Counters** | start value, end value, duration | "0 to 90%, 1x to 10x, 0 to 40% over 1.6 s (power2.out, stagger 0.18)." |
| **Loop** | loop length and the pause | "Loops with a 2.4 s pause." |
| **Pause** | when it stops | "Off screen and in a hidden tab." |
| **Phones** | what changes on a phone | "No pin: chapters stack." |
| **Reduced motion** | what the static version is | "Every scene in its finished state, nothing pinned, nothing hidden." |
| **Content** | whether the section is scripted at all | "Native CMS list; no scripted motion." |

A page-level frame carries what is shared: the smooth-scroll library and its settings, when
scroll triggers refresh, the reduced-motion rule, the no-script fallback and how the scripts are
shipped. Write it once, not per section.

## Rules that make a line testable

- **Every duration and delay is a number with a unit.** Easing is named (`power2.inOut`,
  `sine.inOut`), not described.
- **Pinned length is stated in viewport heights and in wheel notches.** "About 5.3 viewport
  heights (48 notches at 100 px)." Both are measurable.
- **Photo changes fade. They never slide.** Say so once on the page frame.
- **Ambient motion gives an interval range, not a number.** A fixed interval reads as a
  machine. Also state the pick rule ("each change is one of the farther half from the last
  three") so repeats cannot happen.
- **Every loop has a pause**, and every loop and ambient change pauses off screen.
- **Counters list both ends.** A counter makes a number look verified, so only cleared
  numbers count up (see `writing-claims-that-hold`).
- **Scrubbing back is specified.** "Scrubbing back lands on chapter 1." A scene that cannot
  run in reverse is a timeline, not a scroll story.
- **State the fallback.** Reduced motion and no script each get a line.

## Turn the note into a test

Each line becomes an assertion in the QA stage. The note is the test plan.

| Note says | The check measures |
|---|---|
| "Pinned about 5.3 viewport heights" | `ScrollTrigger.end - start` divided by window height, within 0.3 |
| "Stagger 0.07" | the start offsets between sibling tweens |
| "Fade in 0.85 s, never a slide" | opacity changes, `transform` stays unchanged on the photo |
| "Pauses off screen" | no style changes while the element is outside the viewport |
| "Phones: no pin" | no pin spacer at 390 px |
| "Reduced motion: finished states" | with the media feature emulated, nothing is hidden and nothing is pinned |

If a line has no check, either the line is too vague or the check is missing.

## Where prototypes help and where they do not

Figma prototypes and motion can carry keyframe tracks and easing. The official Figma MCP can
read them (`get_motion_context` returns keyframes, easing curves and ready CSS). Use that for
element-level motion: a card rising, a chip popping.

Prototypes cannot express scroll logic: pinning, scrubbing, state derived from progress, loops
that pause off screen. Notes carry those. Use both, and never leave scroll motion to a
prototype link.

## When direction arrives as a video

A designer's screen recording is direction, not a spec. Transcribe what they say, watch it at
half speed and write the numbers into the note. Then show the note back. A note the designer
has read and agreed to replaces the video as the source of truth.

## Real example

This is the Hero note from a production page, as written beside its frame. It reads:

> **Intro.** Nav fades 0.6 s. Lattice hairlines draw over 0.9 s (power2.inOut). Copy rises 24
> and fades, stagger 0.12 from 0.5 s. Portraits fade in at random, 0.7 s each, stagger 0.07
> from 0.9 s.
> **Ambient from 3.0 s.** Every 1.8 to 3.4 s (3 to 5 s on phones) one tile changes: fade out
> 0.7 s, fade in 0.85 s (sine.inOut), never a slide. 70%: the photo that has been off screen
> longest comes in from the reserve; 30%: two far-apart tiles trade.
> **Pause.** Off screen and in a hidden tab.

Everything in it is a number, a named easing or a rule. The build followed it without a
meeting.

## Template

See `template.md` in this folder.

## Red flags

- "Subtle", "smooth", "playful", "premium feel" with no number
- Motion described only in a video or a chat message
- A scroll scene with no length in viewport heights
- An ambient loop with no pause and no off-screen rule
- A counter that counts to a number nobody cleared
- No reduced-motion line
