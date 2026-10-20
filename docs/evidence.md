# Evidence: selected measurements on the page in the reel

Measured with the tools in this repository on 2026-10-20, on the page's review environment, on the build that was current when the reel was recorded (published 15:51 GMT). These are selected measurements, not a full QA report.

## Scroll feel (`tools/scroll-qa.mjs`, real wheel input, smooth scroll present)

| Window | Story pin | Wall pin | Frame time p95 | Frames over 34 ms | One notch settles in |
|---|---|---|---|---|---|
| 1920 x 1080 | 5.2 viewport heights (56 notches) | 1.44 viewport heights (16 notches) | 16.8 ms | 0 | 642 ms |
| 1440 x 900 | 5.2 viewport heights (47 notches) | 1.44 viewport heights (13 notches) | 16.7 ms | 0 | 639 ms |

Both pins sit inside the pack's budget of about six viewport heights for a story and about 1.4 for a selection wall.

## Layout and content (`tools/page-measure.js`)

| Check | 1440 | 390 |
|---|---|---|
| Horizontal page overflow | none (1440 = 1440) | none (390 = 390) |
| Images, with alt text missing | 138, 0 | 138, 0 |
| Images upscaled past their natural size | 0 | 0 |
| `h1` count, skipped heading levels | 1, 0 | 1, 0 |
| Em dashes in visible text | 0 | 0 |
| Placeholder text found | none | none |

## The recording (`video/capture.mjs`, `video/analyze.py`)

| Measure | Value |
|---|---|
| Capture | 1920 x 1080, CDP screencast |
| Screencast frame gap, median and p95 | 16.7 ms, 19.0 ms |
| Longest gap | 268 ms, at the page reload, which is trimmed from the cut |
| Longest frozen stretch in the cut | 0.37 s, inside a pinned chapter hold |
| Output | 17.4 s, 1920 x 1080, 60 fps, H.264, limited-range BT.709, tagged |
| Colour fidelity | decoded frames within about 3 levels per channel of their sources, per pixel |

## What the tools are for

`page-measure.js` and `scroll-qa.mjs` are the two checks that turn "looks fine" into a number. Run them on your own page before you trust this table. They found real defects on other pages during this work: placeholder text left in a CMS list, images that failed to decode, and a card with no picture behind its animation.
