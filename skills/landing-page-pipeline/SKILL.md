---
name: landing-page-pipeline
description: Use when starting a landing page, homepage or product page from brief to launch, when picking up a page that is half built, or when unsure which of the landing-page skills applies next.
---

# Landing Page Pipeline

## Overview

A page ships fast when every stage leaves behind a file the next stage can read. It ships slowly
when the knowledge sits in someone's head and gets rediscovered at QA.

**Core principle: each stage produces one artifact, the next stage consumes it, and a gate
decides whether you move on. The agent runs the stages. A person holds four decisions.**

This is the hub. It names the stages, the skill that owns each one and what passes between
them. The depth lives in the skills.

## The twelve stages

| # | Stage | Skill | Reads | Writes | Gate |
|---|---|---|---|---|---|
| 1 | Learn from past pages | `learning-from-past-pages` | analytics, tests, recordings | `00-learnings.md` | every old section marked keep, cut, rewrite or bet |
| 2 | Concept | `concepting-a-website` | learnings, brief, references | `01-concept.md` | five answers, claim sequence, what we left out |
| 3 | Extract the design truth | `extracting-figma-truth` | the Figma file | `02-figma-truth/` | composite diffed against the Figma render |
| 4 | Specify the motion | `specifying-motion-in-figma` | frames, notes | `03-motion-spec.md` | every note line has a number and a test |
| 5 | Make the imagery | `art-directing-site-imagery` | concept, constants | `04-imagery/` | native-resolution QA passed, set matches brief |
| 6 | Write claims that hold | `writing-claims-that-hold` | concept, cleared facts | `05-claims-ledger.md` | every claim sourced and cleared |
| 7 | Lay it out | `designing-page-layout` | figma truth, concept | `06-tokens` (spacing, type, cards) | every value on the scale |
| 8 | Choreograph the scroll | `choreographing-scroll-stories` | motion spec | scene timelines | budget under six viewport heights |
| 9 | Make it move correctly | `animating-web-pages` | scene timelines | working motion | selectors match, reduced motion honoured |
| 10 | Build it | `building-webflow-pages` | everything above | the staged page | read back from the element tree |
| 11 | QA it, mobile and desktop | `reviewing-page-design` | the staged page | `08-qa-report.md` | measured, one table, nothing unverified |
| 12 | Show it | `making-a-page-reel` | the staged page | `09-reel.mp4` | recorded from the real page, 1080p until approved |

Stages 5, 6 and 7 run in parallel once 2, 3 and 4 are done. Stages 8 and 9 are one loop:
design the scene, prove it runs, adjust. Stage 11 runs after every milestone, not once.

## The four human decisions

Everything else is the agent's job. These four are not.

1. **Which claims are cleared.** The ledger lists what the page may say. A person signs it.
2. **Which imagery is approved.** The agent proposes and QAs. A person approves the set.
3. **Staging review.** A person looks at staging before anything else happens.
4. **Production publish.** Never inferred from an earlier "yes". Ask again, every time.

Everything between those gates, including extraction from Figma, the build, the QA and the
reel, runs without a person in the loop. That is where the weeks went.

## Figma stays the source, independence is the point

Figma still carries the design, the motion direction and the review comments. The agent reads
all three:

- the frames and fills, through `extracting-figma-truth`
- the motion notes beside each frame, through `specifying-motion-in-figma`
- the comments, mapped to canvas coordinates and applied in a batch

What changed is who does the middle. A designer used to hand a frame to a developer and wait.
Now the agent turns the frame into a page, measures it against the frame and sends back the
differences.

## Folder contract

```
page/
  00-learnings.md
  01-concept.md
  02-figma-truth/        fills, tokens, text widths, comments.json
  03-motion-spec.md
  04-imagery/            brief.md, set/, qa/
  05-claims-ledger.md
  06-tokens.md
  07-build/              embeds, styles, scripts (versioned)
  08-qa-report.md
  09-reel.mp4
```

If a stage has no file in this tree, it did not happen.

## Small fixes do not run the pipeline

A one-line change runs one stage. Edit, run only the check that covers the change, publish to
staging, report. Run the full QA suite after a milestone or when someone says "fully QA".
Re-running everything after each tweak turns a ten minute fix into an hour.

## Red flags

- Starting at stage 10 because the Figma file "looks done"
- A stage with no artifact
- Imagery chosen per section instead of as a set
- A number on the page that is not in the claims ledger
- "I will QA at the end"
- Publishing because an earlier message said to
