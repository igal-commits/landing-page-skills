# Testing status

A skill that was only written is a guess. These were run the way the pack's own guidance says to: a tempting scenario with time pressure, run on a fresh agent **without** the skill and on a fresh agent **with** it, answers compared. Text answers only, no tools, six scenarios, twelve runs, 2026-10-20.

## Result

| Skill | Scenario | Without the skill | With the skill | Verdict |
|---|---|---|---|---|
| `choreographing-scroll-stories` | pinned 5-chapter section, brief says "cinematic, room to breathe" | pin `+=650%` (6.5 viewport heights), scrub true or 0.3, checked by dwell time, up/down parity and a throttled trace | pin 5.3 viewport heights, scrub 0.2, `render(p)` from one number, "room to breathe" from held end states, checked with real wheel input, notches, one-notch settle time and p95 frame time | **changed behaviour**: shorter pin, measurable feel |
| `extracting-figma-truth` | h1 wraps to 3 lines in the browser, 2 in Figma, Inter variable | guessed an optical-size mismatch but got the direction wrong (said Figma uses the tighter display cut) and suggested `font-optical-sizing: auto`, which would make it worse | pin `opsz` 14, measure rendered width against Figma first, revert the manual size and spacing tweaks | **changed behaviour**: wrong-direction fix became the right one |
| `making-a-page-reel` | 15 s LinkedIn video of a staging page with a logo strip and a named testimonial | Playwright with wheel steps, **logo strip and testimonial kept in frame** behind a consent gate, no colour tagging | CDP screencast, logos and testimonial hidden, scroll path from a measured sweep, colour matrix tagged, per-pixel verification | **changed behaviour**: different method and no customer marks in frame (partly because the scenario told the agent to follow the skill's own steps) |
| `reviewing-page-design` | QA before a 3pm review, screenshots blank below the fold, requester unreachable | already measured, labelled "measured, not seen", did not ask the user | same, plus a wider width matrix, junction sums, theme states at 390, the ranked severity table and a "could not verify" list | **same decision**, more structure |
| `writing-claims-that-hold` | animate three stat chips, only three other numbers cleared, "copy is final" | already refused the uncleared numbers and kept the cleared ones | same, plus a ledger file, a lint for the uncleared strings and the reason a counter makes a number look verified | **same decision**. The scenario did not discriminate |
| `learning-from-past-pages` | test with a 5,210 / 4,790 split, assigned by URL path, PM says "ship, 16% lift" | already caught the sample ratio mismatch and the non-significance, said do not ship | same, plus exposure-event attribution, the contamination check and the one-event, population, window definition | **same decision**. The scenario did not discriminate |

## Reading it honestly

- Three skills visibly changed what the agent did. Those are the ones to trust most.
- Three did not change the **decision**, because a strong model already refuses an uncleared number and already spots a skewed split. The scenarios were too easy. What those skills add is the artifact (the ledger, the readout, the report table), and that is not tested here.
- The other seven skills (`landing-page-pipeline`, `concepting-a-website`, `specifying-motion-in-figma`, `art-directing-site-imagery`, `designing-page-layout`, `animating-web-pages`, `building-webflow-pages`) have not been pressure-tested in this round. `building-webflow-pages` was tested earlier on its highest-risk rule (the silent class rename) and passed; the other six are written from real builds and are provisional.
- Two tools were run on a real page and found real things: `scroll-qa.mjs` and `page-measure.js`. See [evidence.md](evidence.md).

## To test a skill

1. Write a scenario that tempts the failure, with real time pressure in the prompt.
2. Run it on a fresh agent **without** the skill and record the rationalisations verbatim.
3. Run the same scenario with the skill.
4. Add explicit counters for any new rationalisation and run it again.

Make the scenario hard. If the baseline already gets it right, the scenario tests the model, not the skill. Do not test by reading. Reading is not using.
