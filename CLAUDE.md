# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static multi-page Astro site (no client JS, no SSR) that presents an opinionated technical sharing deck on agent engineering. Content is the product — pages are hand-authored `.astro` files, not generated from a CMS or content collection.

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

### The two-source-of-truth contract for navigation

Adding or renaming a page is **not** just creating a route file. The side-nav is the navigation contract, and it lives in `src/layouts/SiteLayout.astro` as a hand-maintained `navItems` array. To add a page, you must:

1. Create `src/pages/<slug>.astro` that imports and wraps content in `<SiteLayout current="<key>" title="...">`.
2. Add a matching `{ key, href, label, kicker }` entry to `navItems` in `SiteLayout.astro`.
3. (Usually) Add an `<a class="overview-card">` tile in `src/pages/index.astro` so the home grid links to it.

The `current` prop and the `navItems[].key` value **must match exactly** — that's how the active-state highlight works. Mismatches fail silently (no active link).

### Layout and styling conventions

- **One layout**: `src/layouts/SiteLayout.astro` provides the sidebar + content shell. Every page uses it. Don't introduce parallel layouts unless the design genuinely diverges.
- **One global stylesheet**: `src/styles/page.css` is imported once (by the layout) and defines the entire component vocabulary (`.section`, `.section-head`, `.eyebrow`, `.overview-card`, `.code-card`, `.detail-card`, `.feedback-card`, `.signal-panel`, `.compare-card`, `.loop-card`, etc.). Pages compose existing classes; they **do not** declare scoped `<style>` blocks. Before inventing a new class name, scan `page.css` — there's almost always an existing one that fits.
- Visual system is intentionally consistent: muted off-white canvas, single accent green (`--accent: #0f6b4f`), generous whitespace, eyebrow + heading + body rhythm. Preserve this when editing — don't introduce new colors, fonts, or layout primitives ad hoc.

### Code samples inside pages

Code blocks are presented as `<figure class="code-card">` with `<figcaption>` (filename + optional source link) and `<pre><code>`. Inside `.astro` markup, `{` and `}` must be escaped as `&#123;` / `&#125;` because Astro otherwise parses them as JSX expressions — see `src/pages/harness-examples.astro` for the JSON example pattern.

### Static assets

`public/` is served verbatim from the site root. Image references in pages use absolute paths like `/images/eval-tools/foo.png` — only `eval-observability.astro` currently uses images.

## Content model

The pages tell a linear story (Overview → 01 What is an agent → 01A Session/state/memory → 02 Orchestration → 03 Tools & capability with three sub-pages 03A/03B/03C → 04 Eval & observability → 05 Harness, with sub-page 05A). The `kicker` field in `navItems` encodes that ordering. When adding a page, pick a kicker that fits the sequence rather than appending to the end.
