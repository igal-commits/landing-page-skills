---
name: making-a-page-reel
description: Use when you need a short video of a page's real animation for a launch post, a LinkedIn update or a team review - or when a screen recording of a scroll-driven page is choppy, mistimed, shows things it should not, or does not read in a muted feed.
---

# Making a Page Reel

## Overview

The page already contains the best footage you will get: its own motion, running for real.
The work is capturing it faithfully, choosing the path through it, and proving the result.

**Core principle: record the real animation, never re-create it, and edit by measurement, not by
feel.**

A recording of a page is a walkthrough. Say so. A brand film is a different job: a designed,
animated film with a storyboard. This skill is for "here is how the page we built looks and moves".

## Decide before recording

- **What the reel proves.** One sentence. "The new page builds itself and scrolls as designed."
- **Which version.** Record the version that is real and released to a review environment.
  Never a version that is not released yet (an unannounced product page, a draft), and never a
  prototype that is still mid-change. Record staging, not a local build.
- **Format.** 16:9 at 1920x1080 is the native desktop capture and the safest. Do not invent a
  portrait layout the team has not QA'd.
- **Length.** Short. 15 to 20 seconds shows a whole page's capability. Five seconds shows one
  move. Decide which the reel needs.
- **What must not appear.** Customer logos, quotes with names, third-party marks, placeholder
  text, broken images, unreleased claims. Write the list now.
- **Resolution.** Review at 1080p. Do not render a 4K master until the cut is approved.

## Step 1: record the real animation

Use Chrome with a CDP screencast, not a screenshot per frame. Scroll-scrubbed GSAP, smooth
scroll, canvas trails and timed intros all run on wall-clock time. Stepping them frame by frame
changes the motion.

```
Page.startScreencast  format jpeg, quality 100, maxWidth = viewport width, everyNthFrame 1
```

On an Apple-silicon laptop this delivers about 60 frames a second (median gap 16.7 ms).

- **Load-time intros**: start the screencast, then reload the page, so the intro is in the
  recording. Trim the frames before the reload.
- **Scrolling**: drive scroll from keyframes `[seconds, position]`. Pass the positions through
  a monotone cubic (no overshoot, holds stay flat) and apply each value with the smooth-scroll
  library's `scrollTo(y, { immediate: true, force: true })`, so the page's own scrubbing and
  smoothing run exactly as they do for a reader. Never hand-animate the page's elements.
- **Hide, do not remove**: `visibility: hidden` on logos and quotes keeps pinned layouts
  intact. `display: none` shifts them.
- **Clock**: take the start time inside the page (`performance.timeOrigin + performance.now()`)
  so scroll keyframes and screencast timestamps share one clock.
- **Resample** to a constant frame rate: output frame `k` shows the latest screencast frame at
  or before `k / fps`.

`video/capture.mjs` in this repository does all of it from a small JSON plan.

## Step 2: choose the path by measurement

A scroll path chosen by feel leaves dead zones, stretches where the wheel moves and nothing on
the screen changes. Find them:

1. Record one slow, steady sweep of the whole range.
2. Run `video/analyze.py` on it. It reports frozen runs (identical frames) and the biggest
   frame-to-frame changes.
3. Map frozen runs back to scroll positions. Those are dead zones: cross them quickly.
4. Give the scroll-scrubbed moments (a circle growing, a card building, a counter counting) the
   slow, readable stretches. Scrubbed scenes track the scroll, so waiting does not finish them.
5. Time-based animations start when a threshold is crossed and need real time to finish. Do not
   end the clip until the last one has.

Then record the real take with the shaped path, and run `analyze.py` again. A short frozen run
inside a pinned scene is a hold and is fine. A 0.4 s freeze in the middle of a flick is not.

Check the capture's own health: the maximum gap between screencast frames inside the part you
will use should be under about 40 ms. A larger gap is a hitch, so re-record.

## Step 3: pick footage that is finished

Look at a contact sheet every 0.5 to 1 s before you commit. Reject:

- empty cards, broken images, alt text showing where a picture should be
- placeholder copy in a CMS list
- a first second that is blank while the page paints; trim to where the headline starts to rise
- anything on the "must not appear" list

If a section is unfinished, leave it out and tell the owner. A reel that features a broken card is
a public bug report.

## Step 4: encode with the colours tagged

```
./encode.sh <framesDir> out.mp4 <firstFrame> <frameCount> 60
```

The screencast frames are full-range BT.601 JPEG. The encode converts them to limited-range BT.709
and tags the stream, so players do not guess:

```
scale=in_range=full:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p
libx264 -crf 14 -preset slow -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709:fullrange=off
-movflags +faststart
```

`yuv420p` and `+faststart` make it play everywhere and start immediately. Verify the result by
decoding a few frames back and comparing them with the sources **per pixel**. Do not compare
channel means: averaging a few million float32 values accumulates enough error to invent a
colour cast that is not there. Within about 3 levels per channel is faithful.

## Step 5: QA the video

- Duration, frame rate, size and colour tags read back from the file
- A frame every second, looked at, plus the transitions at normal speed
- No logos, names, placeholders, banners or broken images in any frame, not only the chosen ones
- No cookie banner or consent widget in frame, and none clicked: hide it from the page's own CSS or
  record an environment that does not show it
- The first frame is the hook. If the page paints blank, trim it away
- Choose a poster frame where the page is complete and still, not mid-scroll

Then run the cold reviewer gate from `reviewing-page-design`.

## Step 6: say what you could not verify

Sound, if there is any ("I cannot hear it"). The platform's own recompression. Anything shown on a
device you did not test.

## When a designed reel is wanted

Compose the page footage inside a layout where every visual is a function of time (closed-form
springs, one overlay idea per beat, captions of two to five words, brand colour only on the name
and the end card). The same rules apply: the page window is never covered, text reads at 360 px
wide, payoffs hold for at least 1.2 s.

## Red flags

- A screenshot-per-frame capture of a scroll-driven page
- Recording a prototype that is mid-change, or a page that is not released
- A reel that includes a half-finished section
- Customer logos or named quotes in frame
- A scroll path chosen by feel, with no sweep behind it
- Colour compared by channel means
- Rendering 4K before the cut is approved
