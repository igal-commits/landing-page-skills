---
name: reviewing-page-design
description: Use when asked to QA, review or check a web page - "run a full QA", "check the paddings", "does this work on mobile", "act as a designer and review this" - after any milestone build, or before handing any page back as finished.
---

# Reviewing Page Design

## Overview

A design review that reports "looks good" is worthless. A useful review names the element,
the measured value, and what it should be.

**Core principle: every finding carries a number or a selector. No adjectives without
evidence, and what you could not verify is said out loud.**

## Order of passes

Run in this order. Later passes are wasted if an earlier one fails.

1. **Structure**: does every section exist, in the intended order, with content bound
2. **Rhythm**: section junction gaps, grid alignment, card heights, the section system
3. **Responsive**: the window matrix below, mobile and desktop
4. **Type and colour**: contrast, hierarchy, orphans, overflow, text widths against the design
5. **Motion**: see `animating-web-pages` and `choreographing-scroll-stories`
6. **Claims and content**: see `writing-claims-that-hold`
7. **Accessibility and performance**: focus, alt text, LCP, layout shift

## The window matrix

Test the widths the page has to survive, not a representative one. A set that held up on a real
launch: desktop at 1024, 1280, 1440, 1920 and 2560, and phones at 320, 360, 390 and 430.

| Width | Look for |
|---|---|
| 1440 | line lengths over ~75 characters, sections that centre when they should not |
| 992 | three-column grids that should be two, sticky elements with no travel |
| 768 | the tablet block nobody wrote, so desktop values apply at half the width |
| 390 | full-bleed media that no longer contains its subject, dark text on a dark band, horizontal overflow |
| 320 | the smallest phone: wrapped headlines, clipped buttons |
| 2560 | images soft on a retina screen, content lost in the middle of a wide canvas |

The mobile failure worth naming: a full-height hero whose media is only ~55% of the section
leaves the rest showing the **section background**. If the section background is dark and
the copy has switched to a light theme, the text and buttons become invisible. Check both
theme states at 390.

## Measure, do not squint

Read values out of the live page rather than judging from a screenshot. This is faster,
catches things the eye misses, and works when rendering is unavailable.

```js
// Section rhythm: the gap that matters is the SUM at each junction
[...document.querySelectorAll('section')].map(s => {
  const c = getComputedStyle(s);
  return { cls: s.className, h: Math.round(s.getBoundingClientRect().height),
           padT: c.paddingTop, padB: c.paddingBottom };
});

// Overflow, the most common invisible bug
[...document.querySelectorAll('*')]
  .filter(e => e.scrollWidth > e.clientWidth + 1)
  .map(e => e.className);

// Horizontal page overflow
document.documentElement.scrollWidth > document.documentElement.clientWidth;

// Card evenness inside a grid
[...document.querySelectorAll('.card')].map(c => Math.round(c.getBoundingClientRect().height));
```

`tools/page-measure.js` in this repository bundles these and the checks below into one snippet.

Further measured checks that earned their place:

- **Section system**: every content-section title is the same computed font size; every left
  edge equals the nav logo edge.
- **Text size floor**: no text under 10px.
- **One `h1`.** Heading levels descend without skipping.
- **Images**: every one decodes; effective pixel ratio at or below 1.0 at every scroll
  position and device pixel ratio.
- **Contrast per scene**: every text node inside a pinned scene is at least 3:1 (large) or 4.5:1
  (body) against its first solid background, in the scene's finished state.
- **Hero**: sample frames for eight seconds. Fail on a duplicate image, a tile outside the hero
  rectangle, an overlap, a tile under the copy, or any change after the intro settles.
- **Scroll feel**: real wheel input, see `choreographing-scroll-stories`.
- **Console is clean.** Script starts, intro runs, no pending errors.

## When you cannot screenshot

Headless and hidden browser panes pause rendering, so screenshots come back blank while the
DOM is perfectly healthy. That is not a reason to skip the review and not a reason to ask
the user to check for you.

Verify numerically instead: computed styles, bounding boxes, `scrollWidth`, asset fetch
status and content type. State plainly in your report which findings were measured and
which were seen.

## Content and claims

A design review includes what the page says.

- Every statistic is attributed, and the attribution is cleared for marketing use
- Customer logos are on the cleared list, not just "logos we have"
- Alt text describes the image, is not the filename, and is not empty on meaningful images
- No placeholder text in a CMS list; no empty card behind an animation
- No banned words; no em dashes if the house style forbids them

## Accessibility floor

- Focus ring visible on every interactive element (`:focus-visible`, not `outline: none`)
- Body text contrast at least 4.5:1, large text 3:1
- Interactive targets at least 44x44 on touch
- Reduced motion honoured: the page is complete and static
- No-script: everything visible

## Performance floor

- The LCP image is eager, everything else lazy
- Hero image is roughly 2x its CSS width, not 4x
- No layout shift from images without dimensions or an `aspect-ratio` wrapper
- Video is a 1x or lite file on phones, with a poster

## How much to run

A **milestone** gets the full suite. A **small fix** gets the one check that covers the change,
a staging publish and a report. Running the whole suite after every tweak turns a one-line fix
into an hour. When someone says "fully QA", run everything.

After fixing, publish to staging and QA staging, not only the local build. What ships is what
needs checking.

## Verify the run, not the log

Before you report numbers, confirm the run that produced them finished: the state file is from
today, the log ends cleanly, the window is the one you meant. A stale log block from an earlier
run looks exactly like a fresh one.

## The cold reviewer gate

Your own QA shares your blind spots. For a milestone, hand a fresh reviewer who has never seen
the work only the artefacts: full-page screenshots at the matrix widths, the 390 sheet, the
motion capture and the claims ledger. Bar: 8 out of 10 on each of hierarchy, rhythm, motion,
imagery and copy. Three rounds at most, a new reviewer each round. A pilot of this on a finished
video scored 7 overall and found a static hook and a late brand name that all of our own
automated checks had passed.

## Reporting format

One table. Severity, location, measured value, fix. Ranked most severe first.

| Sev | Where | Measured | Fix |
|---|---|---|---|
| High | `.hero` at 390 | media 500px inside an 812px section; copy area is `#0c0c0c` | set the section background per theme |
| Med | proof to info junction | 120 + 120 = 240px of empty white | tighten to 80, or place the CTA there |

End with what you checked and could not fault, and a list of what you could not verify (for
example: "I cannot hear audio", "the draft cannot be previewed on the production domain"). A
review with no clean line reads as unfinished rather than thorough.

## Red flags

- "Looks good on mobile" with no width named
- Reporting a fix as done without re-measuring
- Skipping a pass because the previous one was clean
- Asking the user to check something you could measure
- Reporting numbers from a run you did not confirm finished
- Running the full suite for a one-line change
