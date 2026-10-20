---
name: learning-from-past-pages
description: Use when planning a new or redesigned landing page and earlier pages, A/B tests, analytics or session recordings exist, or when someone asks which sections of the current page are actually working.
---

# Learning From Past Pages

## Overview

A redesign without a readout repeats the old page's mistakes with better typography. The
evidence is already sitting in analytics, in tests that ran, in recordings and in sales calls.

**Core principle: every section on the new page traces to evidence from an old page, or it is
labelled a bet. Nothing arrives on the page because it looks good in Figma.**

## The readout, in order

### 1. Fix the question before the data

Write down, in one line each:

- the **one conversion event** the page exists for (first project created, demo booked)
- the **population** it is measured on (new visitors only, excluding signed-in users, internal
  traffic and test accounts)
- the **window** and why it is comparable (same traffic mix, no campaign launch inside it)

A conversion rate without all three is a number, not a finding.

### 2. Read the funnel, then the page

- Visitors to conversion event, by source. A page that converts organic visitors and fails paid
  visitors has a message problem, not a design problem.
- Scroll depth reach per section. A section that 80% of visitors never reach is not a place to
  put proof.
- Click maps and time to first click. Dead clicks on something that is not a link are a request
  from the visitor.
- Recordings of the last three sections people saw before leaving.

### 3. Read the tests, carefully

Attribute each visitor to a variant by the **exposure event**, not by the URL path. Path-based
attribution drops everyone who was redirected, and the redirect is the thing being tested.

Before reading any lift, check the split. A test that was meant to be 50/50 and is not has a
bug, and the lift is meaningless. For two arms:

```
chi2 = (a - n/2)^2 / (n/2) + (b - n/2)^2 / (n/2)        n = a + b
p    = erfc( sqrt(chi2 / 2) )                           flag when p < 0.01
```

Decide the minimum number of conversions per arm before the test starts, and refuse to call it
earlier. Check that every visitor who saw one variant did not also see the other.

### 4. Read the people

Sales call objections, support chat openers and the questions visitors ask before they sign up
are the unprompted version of a survey. Tally them. The top three become the questions the new
page answers above the fold.

### 5. Write `00-learnings.md`

One row per section of the old page (the numbers below are illustrative, not data):

| Section | Evidence | Verdict |
|---|---|---|
| Logo strip under the hero | 71% reach it, clicks on it near zero | keep, move up one fold |
| Four-feature grid | reached by 38%, no clicks | cut, merge into the demo |
| Pricing teaser | highest click share after the hero button | keep, make it the second action |
| Testimonial carousel | reached by 22% | bet: move before the demo and re-test |

The verdicts are **keep, cut, rewrite or bet**. A bet is allowed. An unlabelled bet is not.

## What goes wrong

| Trap | Why it bites |
|---|---|
| Variant by pathname | redirected visitors vanish, the test arm looks worse than it was |
| Test accounts in the population | inflates conversion on the page your own team visits most |
| Comparing windows with a different traffic mix | a launch week is not a normal week |
| Reading lift before checking the split | a broken split produces confident nonsense |
| Crediting the page for the campaign | the page did not change, the audience did |
| Treating "reached" as "read" | scroll depth shows exposure, not attention |

## Hand-off

`00-learnings.md` goes to `concepting-a-website`. The concept must answer, for every `cut` and
every `bet`, why that decision stands.

## Red flags

- A redesign brief that does not mention the old page's numbers
- "The old page felt dated" as the only reason a section was cut
- A lift quoted without the split check
- A conversion rate with no event, population or window
