# Handoffs and gates

Every stage reads files from earlier stages and writes one file or folder. A stage with no file did not happen.

```
page/
  00-learnings.md
  01-concept.md
  02-figma-truth/
  03-motion-spec.md
  04-imagery/
  05-claims-ledger.md
  06-tokens.md
  07-build/
  08-qa-report.md
  09-reel.mp4
```

## Stage by stage

| Stage | Reads | Writes | Gate to move on | Who signs |
|---|---|---|---|---|
| 1 `learning-from-past-pages` | analytics, test exposure data, recordings, sales and support notes | `00-learnings.md`: one row per old section, verdict keep, cut, rewrite or bet | no unlabelled section; split check done before any test lift is quoted | agent |
| 2 `concepting-a-website` | `00-learnings.md`, the brief, references | `01-concept.md`: five answers, claim sequence, section map with a proof picture per claim, art direction brief, what was left out | every cut and bet from stage 1 is answered | agent, then a person reads it |
| 3 `extracting-figma-truth` | the Figma file, its comments | `02-figma-truth/`: fills, tokens, text widths, `comments.json` mapped to nodes | composite diffed against the Figma render; text widths within 1% | agent |
| 4 `specifying-motion-in-figma` | frames, motion notes | `03-motion-spec.md`: every line has a number or a named easing, plus its test | every note line has a check | agent, designer reads it back |
| 5 `art-directing-site-imagery` | `01-concept.md`, the constants | `04-imagery/`: `brief.md`, the set, QA sheets | native-resolution QA passed; set matches the brief; any batch over about six was approved | **a person approves the set** |
| 6 `writing-claims-that-hold` | the concept, what is cleared | `05-claims-ledger.md` | every claim sourced and cleared; counters animate only cleared numbers | **a person signs the ledger** |
| 7 `designing-page-layout` | `02-figma-truth/`, the concept | `06-tokens.md`: spacing scale, type scale, section system | every value on the scale | agent |
| 8 `choreographing-scroll-stories` | `03-motion-spec.md` | scene timelines: state from one number | pin length under about six viewport heights; real-wheel feel measured | agent |
| 9 `animating-web-pages` | scene timelines | working motion | selectors match; reduced motion, no-script and phones tested | agent |
| 10 `building-webflow-pages` | everything above | the staged page in `07-build/` | every class, image and breakpoint read back from the element tree | agent; **staging review by a person** |
| 11 `reviewing-page-design` | the staged page | `08-qa-report.md`: one table, ranked, with what could not be verified | mobile and desktop matrix passed; cold reviewer at 8 of 10 for a milestone | agent |
| 12 `making-a-page-reel` | the staged page | `09-reel.mp4` | recorded from the real released page; no logos, names or placeholders in any frame | agent, a person approves what is posted |

Parallel after stage 4: stages 5, 6 and 7. Stages 8 and 9 are one loop: design the scene, prove it runs, adjust.

## The four human decisions

1. Which claims are cleared (stage 6).
2. Which imagery is approved (stage 5).
3. Staging review (stage 10).
4. The production publish. Never inferred from an earlier yes.

## Which stages a small fix runs

A one-line change runs the one stage that owns it, then a staging publish and the one check that covers the change. The full gate list runs after a milestone, or when someone says "fully QA".
