---
name: building-webflow-pages
description: Use when building or restructuring a Webflow page through the Webflow MCP Designer tools - inserting sections, styling elements, uploading assets, adding custom code or scripts, previewing a draft, publishing to staging - or when a change reported success but did not appear on the page.
---

# Building Webflow Pages

## Overview

The Webflow MCP write tools report success on operations that silently did something
different from what you asked. Class names get renamed, images bind to nothing, styles
land on the wrong breakpoint. Every write must be read back.

**Core principle: a success response is not evidence. The element tree is.**

For CMS items, blog posts and page SEO, use a CMS-focused publishing skill instead. This skill
is the Designer surface: elements, styles, assets, custom code.

## The Iron Law

**Never publish to production without explicit approval in the current conversation.**

A site publish ships every staged Designer change on every page, including work you did
not make and unlisted pages that are still reachable in production. "I already told you to
publish earlier" does not carry across tasks. Ask again.

Staging is different, and it is how work gets reviewed. Publishing to the staging subdomain only
(an empty custom-domain list) is the normal step after a fix, followed by QA on staging. Publish
to the primary production domain only, never to every domain on the site, and only after approval.

## The nine traps

### 1. `whtml_builder` renames colliding classes

Ask for `hp2-proof` when a style of that name exists and you get `hp2-proof-1`. Ask for
`hp2-proof-n` and you get `hp2-proof-n-1`. Chained collisions produce `hp2-proof-link-1-2`.
Wrapper divs frequently get no class at all.

Nothing errors. Your head CSS then targets a class that does not exist, and any
`querySelectorAll('.hp2-proof')` in a registered script matches zero elements, so
scroll animations never run.

**Always** `query_elements` by style after inserting, read the real `styleNames`, and write
your CSS and script selectors against those. Unclassed wrappers are reachable as
`.parent-class > div`.

### 2. A class in `html` only applies if it already exists

A class referenced in the `html` param binds only if that style already exists in the site
OR is defined in the same call's `css` param. Otherwise the element inserts with **no
class** and still reports success. Define every class you use in `css`.

The builder also does not support descendant selectors. Use single classes and combo classes
(`.a.b`). `@media` and `clamp()` are fine.

### 3. `whtml_builder` needs a single root element

Multiple siblings at the top level fail or insert partially. Wrap in one container.

### 4. Images inserted as markup are not bound

An `<img>` in `html` returns `partial_success` with "does not exist in asset library".
Insert the element, then bind it with `set_image_asset` and the asset id.

### 5. `update_style` scopes by `breakpoint_id`, not `breakpoint`

A `breakpoint` key is silently ignored and the write lands on the base breakpoint, overwriting
desktop. The response shows a `breakpoints` key only when the scoped write worked. Pass
`breakpoint_id` explicitly and read it back.

### 6. `set_style` replaces, it does not add

`set_style` removes every existing style and applies only what you pass. To add a class,
read the current `styleNames` first and pass the full list.

### 7. `set_page_freeform_code` replaces the whole block

Page head and footer custom code live on `data_scripts_tool`, not on the pages or style
tools: `get_page_freeform_code` and `set_page_freeform_code`, with `location: "head"`.

The write is all-or-nothing. There is no append. Always `get` the current block, modify the
string, and `set` it back whole. Writing a fragment silently deletes everything else that
was in the head. It also rejects `<script>` tags on some plans, which is why scripts go in
embeds (below).

### 8. Pages made through the API do not inherit your base CSS

If the site sets its root font size in a base-CSS component (for example `html{font-size:.625rem}`
so that 1rem is 10px), a page created through the API does not get that component. Everything
renders 1.6 times too big in the Designer and on publish. The first element on every new page is
the base-CSS component. Check it before styling anything.

### 9. Asset creation outputs vanish and bindings rate-limit

`create_asset` output below a certain size is not persisted, so a 22-asset batch prints inline and
must be transcribed immediately. `set_image_asset` does a read and a write each: about ten binds
per minute before a 429. Bind in batches of ten with a minute between, and keep a table of
name, asset id, date and signature rows.

## Custom code and scripts

The page-script API is blocked on some accounts. To run JavaScript on a page:

1. `register_inline_script` (max 2000 characters) or `register_hosted_script`
2. Reference the returned hosted URL from a `<script src>` inside an **HtmlEmbed element**
   on the page, edited via `data_element_settings_tool` with key `code`

Structure the page as one embed per section plus a loader embed that brings in the animation
library and then your scripts. Version the display name (`sections.v17`) rather than mutating a
registered script: `update_registered_script` fails on inline scripts, and a versioned name rolls
back by editing one URL in the embed. Host the page CSS the same way, versioned.

## Previewing a draft

A draft page cannot be flipped to published through the API, and page branching is an Enterprise
feature. So QA a draft against a **local replica**: the live nav and footer markup, the site CSS,
the base-CSS rule and the animation library from a CDN.

In a hidden tab or headless pane the animation ticker pauses. Force it:

```js
gsap.ticker.lagSmoothing(0); gsap.ticker.tick();
```

Screenshots of a hidden pane paint blank below the fold. Translate the body to bring a section
into view for a screenshot, and call `ScrollTrigger.update()` after a real `scrollTo`.

## Assets

Three steps, and the third is the one people miss:

1. `create_asset` with the file name and the **MD5 of the raw bytes** (32 lowercase hex)
2. `POST` the bytes to the returned `uploadUrl` as multipart/form-data, appending every
   `uploadDetails` field plus the file under `file`. Expect **201**.
3. `create_asset` again with the same name and hash to finalize.

The CDN URL is `https://cdn.prod.website-files.com/<siteId>/<assetId>_<filename>`.
See [asset-upload.md](asset-upload.md) for a working curl recipe.

Videos upload through the same form (`video/mp4`, `video/webm`) and are referenced from an embed
with `autoplay muted loop playsinline` and a poster. Homepage video is where bandwidth goes, so
serve small loops and lite files to phones.

## Rate limits

Reads (`query_elements`, `get_all_elements`, `get_settings`) hydrate the assets and
collections endpoints and start returning 429 after heavy asset work. Writes keep working.
When `query_elements` 429s, `get_all_elements` at depth 2 usually still succeeds.

Batch reads: one `query_elements` call takes multiple queries.

## Verification checklist

Run this after every build session and report the results, not your intentions.

- [ ] `query_elements` by style name for every class you introduced; the real names match
      what your CSS and scripts target
- [ ] Every inserted image has an `assetId` in its settings
- [ ] Breakpoint styles read back at the breakpoint you meant
- [ ] The head/footer block still contains everything it had before your edit
- [ ] Registered script URL in the embed matches the version you just registered
- [ ] Asset CDN URLs return 200 with the expected content type and size
- [ ] The base-CSS component is the first element on the page
- [ ] The staged page matches what you built: fetch the staging HTML and check, do not assume

## Red flags

- "The tool returned success so the class is applied"
- "I'll write the CSS now and check the class names later"
- "It's a small change, I'll write the head block directly"
- "The user approved publishing earlier in this project"
- "I'll publish to all domains so it is consistent"

All of these mean: read the tree back before you continue.
