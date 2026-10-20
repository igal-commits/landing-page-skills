# Figma is still the source. The build is independent.

We still do a lot in Figma. Nothing in this pack replaces the design file. What the pack changes is who does the work between the file and the page.

## What Figma carries

| Thing | Where it lives in the file | Which skill reads it |
|---|---|---|
| The design: frames, fills, type, tokens | the frames | `extracting-figma-truth` |
| The motion direction | notes beside each frame: trigger, intro, ambient, counters, loops, pause, phones, reduced motion | `specifying-motion-in-figma` |
| The review feedback | comments (with canvas positions) and sticky notes on a QA canvas | `extracting-figma-truth` |
| Pinned scenes as states | one frame per scroll progress | `extracting-figma-truth`, `choreographing-scroll-stories` |

## What the agent does in the middle

1. Reads the frames, fills, comments and notes once, caches them, and never re-polls the API.
2. Builds the page from the fills, not from renders.
3. Diffs the page against the Figma render of the same node and fixes the difference, including text widths to within 1%.
4. Turns each motion note into a build and into a check.
5. Applies the comments as one batch and replies once.
6. Writes the differences back, in a "proposed fixes" frame, so the designer can see what was done.

A designer used to hand over a frame, wait, and review the result. Now the review is of a page that has already been measured against the frame.

## The four decisions that stay with a person

1. **Which claims are cleared.** The agent drafts the claims ledger. A person signs it.
2. **Which imagery is approved.** The agent proposes and QAs. A person approves the set.
3. **Staging review.** A person looks at staging before anything else happens.
4. **Production publish.** Never inferred from an earlier yes. Ask again, every time.

Between those gates there is no person in the loop. That is where the time goes.

## Imagery

Imagery on our pages is rendered in our own engine, directed by an art director skill that holds the brief's constants and matches the required style. That skill is private. `art-directing-site-imagery` describes what any engine has to be given and has to return, and the QA every image passes.

## The honest limits

- The more your Figma notes are numbers, the more independent the build gets. Notes written as adjectives bring the meetings back.
- Comments are a brief only if you map them by canvas position and read the replies.
- Seats with view-only access get a small API budget. Fetch once.
