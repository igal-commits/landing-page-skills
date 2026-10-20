# Motion note template

Copy one block per section frame. Delete headings that do not apply. Every duration is a number
with a unit. Every easing is named.

```
INTERACTION
<Section name>

Trigger
<what starts it, how long it holds. Pins in viewport heights and wheel notches.>

Intro
<load sequence with times: element, duration, easing, stagger, start offset>

Behaviour
<named beats in order, one line each>

Ambient from <t> s
<interval range, fade durations, pick rule>

Counters
<element: start to end over duration (easing, stagger)>

Loop
<length, pause between loops>

Pause
<off screen, hidden tab>

Phones
<what changes below 992 px>

Reduced motion
<the static, finished state>

Content
<native CMS list, no scripted motion, or the script that owns it>
```

## Page-level frame

```
INTERACTION
Page

Smooth scroll
<library and settings>. Triggers refresh on load and on resize (<n> ms debounce).

Reduced motion
The static state shows every scene finished: nothing pinned, nothing hidden.

No script
Everything stays visible. A fail class is added after <n> s if the script never starts.

Build
<how the scripts and styles are shipped and versioned>
```
