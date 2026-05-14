# Repository Guidelines

## Project Structure & Module Organization

This repository is a static Astro site for an agent engineering sharing site. Source files live in `src/`:

- `src/pages/` contains route pages. Use kebab-case filenames for multi-word routes, such as `harness-examples.astro`.
- `src/layouts/SiteLayout.astro` defines the shared shell, side navigation, metadata defaults, and global stylesheet import.
- `src/styles/page.css` holds the site-wide visual system and responsive layout rules.
- `src/lib/url.ts` centralizes URL generation for GitHub Pages base paths.
- `public/` stores static assets, including image files served as-is.

Generated output goes to `dist/`; do not edit it by hand.

## Build, Test, and Development Commands

Use pnpm for all package commands.

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

- `pnpm install` installs dependencies.
- `pnpm dev` starts Astro locally, usually at `http://localhost:4321`.
- `pnpm build` creates the production build in `dist/` and is the primary validation command.
- `pnpm preview` serves the built site locally for final inspection.

## Coding Style & Naming Conventions

Follow the existing Astro, TypeScript, and CSS style: two-space indentation, semicolons in TypeScript and JavaScript config files, single quotes in frontmatter/scripts, and descriptive CSS class names. Keep route filenames kebab-case. Prefer shared layout/navigation updates in `SiteLayout.astro` over duplicating shell markup.

When adding internal links or asset paths that may be affected by the GitHub Pages base path, use the `url()` helper from `src/lib/url.ts`.

## Testing Guidelines

There is no dedicated test framework configured yet. Treat `pnpm build` as the required check before committing. For visual or content changes, also run `pnpm preview` and inspect affected pages at desktop and narrow viewport widths. If tests are introduced later, place them near the code or under `tests/`, and document the command here.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, sentence-case messages, for example `Add CodeAct chapters, redesign landing page, polish chapter visuals` or `Bump CI Node to 22 for Astro 6`. Keep commits focused.

Pull requests should include a concise description, changed pages or assets, validation run, and screenshots for visible UI changes. Link related issues when applicable. GitHub Pages deploys from `main` via `.github/workflows/deploy.yml`, using Node 22 and `pnpm build`.

## Security & Configuration Tips

Do not commit secrets or local environment files. The Pages workflow supplies `SITE` and `BASE`; local development should work without setting them.
