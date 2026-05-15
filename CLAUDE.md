# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static multi-page Astro site (no SSR) that presents an opinionated technical sharing deck on agent engineering. Content is the product — pages are hand-authored `.astro` files, not generated from a CMS or content collection.

Client-side JS is intentionally minimal: the only script in the codebase is the resizable side-nav handler in `src/layouts/SiteLayout.astro` (a `<script>` block Astro will bundle and hash). Pages themselves contain no `<script>` tags and should stay that way — if you find yourself wanting JS in a page, reconsider whether the interaction is essential.

## Commands

Package manager is **pnpm** (a `pnpm-lock.yaml` is committed; do not introduce `npm`/`yarn` lockfiles).

```bash
pnpm install         # install deps
pnpm dev             # astro dev server, usually http://localhost:4321
pnpm build           # static build to dist/
pnpm preview         # serve the built dist/
```

There is **no test runner, no linter, and no formatter** configured. `astro build` is the de facto correctness check — it runs TypeScript in strict mode (via `astro/tsconfigs/strict`) against the frontmatter of every `.astro` file, so a successful build is the closest thing to "tests pass."

## Architecture

### Routing and pages

`output: 'static'` in `astro.config.mjs` — every page in `src/pages/*.astro` is pre-rendered to HTML at build time. There are no API routes, no dynamic routes, no middleware. File names map directly to URLs (`src/pages/skills.astro` → `/skills/`).

### The three-source-of-truth contract for navigation

Adding or renaming a page is **not** just creating a route file. Three hand-maintained arrays in `src/layouts/SiteLayout.astro` drive the site's navigation, and all three must stay in sync:

- `mainNavItems` — the main-track side-nav entries.
- `bonusNavItems` — the optional/bonus side-nav entries (rendered below the "Optional" divider).
- `chapterFlow` — a single flattened reading order (main → optional) that powers the **Previous / Next** chapter cards rendered in the layout footer of every non-overview page.

To add a page:

1. Create `src/pages/<slug>.astro` that imports and wraps content in `<SiteLayout current="<key>" title="...">`.
2. Add a matching `{ key, href, label, kicker }` entry to **either** `mainNavItems` or `bonusNavItems` (pick the right group).
3. Add the **same** `{ key, href, label }` entry to `chapterFlow` in the position the page should occupy in the linear reading order — otherwise the prev/next footer will skip it.
4. Add a row to the table-of-contents `<ol class="toc-list">` in `src/pages/index.astro` so the home page TOC lists it. Use the existing `<li><a href={url('/slug/')}><span>kicker</span><strong>Label</strong><em>One-line gist.</em></a></li>` shape; an `<li class="toc-divider">` row separates main vs. optional.

The `current` prop, the nav array's `key`, and the `chapterFlow` `key` **must all match exactly** — that's how the active-state highlight and the prev/next lookup both work. Mismatches fail silently (no active link, no chapter card).

### Internal links must go through `url()`

The site is built with a configurable `base` (currently the GitHub Pages project sub-path) in `astro.config.mjs`. Hard-coded internal hrefs like `href="/skills/"` will 404 in production. Always wrap internal paths with the helper in `src/lib/url.ts`:

```astro
import { url } from '../lib/url';
<a href={url('/skills/')}>Skills</a>
```

This applies to anchors in pages, the layout's `navItems`, any `<a>` you add in overview tiles, **and any reference to a `public/` asset from inside a page or component** — `<img src>`, CSS `background-image: url(...)`, anything that resolves through the browser. The asset itself lives in `public/` and gets served from the site root, but the path you *write* in source still needs `url()` so it resolves correctly under the GitHub Pages sub-path. The only things exempt from `url()` are fully external URLs (`https://…`) and intra-document hash anchors (`#section-id`).

### Layout and styling conventions

- **One layout**: `src/layouts/SiteLayout.astro` provides the sidebar + content shell. Every page uses it. Don't introduce parallel layouts unless the design genuinely diverges.
- **Resizable side-nav**: the sidebar width is driven by the `--nav-width` CSS variable on `<html>`, clamped to `[--nav-width-min, --nav-width-max]`. A drag handle in the layout updates the variable on `pointermove` and persists the result to `localStorage` under the key `nav-width`. Double-click resets. If you need to tweak bounds, edit the `:root` variables in `src/styles/page.css` — the handler reads them at startup, so no JS changes needed.
- **One global stylesheet**: `src/styles/page.css` is imported once (by the layout) and defines the entire component vocabulary (`.section`, `.section-head`, `.eyebrow`, `.overview-card`, `.code-card`, `.detail-card`, `.feedback-card`, `.signal-panel`, `.compare-card`, `.loop-card`, etc.). Pages compose existing classes; they **do not** declare scoped `<style>` blocks. Before inventing a new class name, scan `page.css` — there's almost always an existing one that fits.
- Visual system is intentionally consistent: muted off-white canvas, single accent green (`--accent: #0f6b4f`), generous whitespace, eyebrow + heading + body rhythm. Preserve this when editing — don't introduce new colors, fonts, or layout primitives ad hoc.

### Code samples inside pages

Code blocks are presented as `<figure class="code-card">` with `<figcaption>` (filename + optional source link) and `<pre><code>`. Inside `.astro` markup, `{` and `}` must be escaped as `&#123;` / `&#125;` because Astro otherwise parses them as JSX expressions — see `src/pages/harness-examples.astro` for the JSON example pattern.

### Static assets

`public/` is served verbatim from the site root, but page-level references to assets in `public/` must still go through `url()` (see "Internal links must go through `url()`" above) so they resolve under the GitHub Pages sub-path. The canonical pattern is `src={url('/images/eval-tools/foo.png')}`, as in `src/pages/eval-observability.astro` — currently the only page that ships images.

## Content model

Pages are organized into two groups, each a separate array in `SiteLayout.astro`:

**Main track** (`mainNavItems`) — the linear story:

- Overview (Start)
- 01 What is an agent → 01A Session, state, memory
- 02 Design patterns
- 03 Tools & capability, with sub-pages 03A Function tools, 03B Skills, 03C Code execution, 03D Human handoff, 03E Search & retrieval, 03F MCP servers, 03G File system & OS, 03H Browser & computer use
- 04 Eval & observability
- 05 Harness concept → 05A ADK harness examples, 05B Cost & latency engineering, 05C Failure-mode catalog

**Optional** (`bonusNavItems`) — off-the-main-track deep dives, rendered below an "Optional" divider in the side-nav:

- 06 CodeAct deep dive → 06A ML agent: a coding agent, specialized, 06B Security & permission model, 06C Rollout lifecycle
- 07 Useful resources

The kicker is both ordering *and* parent/child taxonomy — `03A` is a child of `03`, not a peer. When adding a page: pick the right group (main vs. optional), pick a kicker that fits the hierarchy within that group, and keep array order matching kicker order so the side-nav renders the story correctly. The two arrays render as a single `<nav>` with the `.nav-divider` between them — don't add a second `<nav>` block.

### Chapter prev/next cards

`SiteLayout.astro` renders a `<nav class="chapter-nav">` footer with **Previous** and **Next** cards on every page except `overview`. Lookup is positional: it finds the current page in `chapterFlow` and reads the neighbours. This means:

- A page missing from `chapterFlow` (but present in a nav array) renders without prev/next cards.
- Reordering the side-nav arrays without reordering `chapterFlow` will produce a reading order that disagrees with the side-nav. Keep them lockstep.
- The overview page intentionally has no footer cards (`current !== 'overview'` guard).
